// Хранилище уведомлений. Единственное место с SQL по notifications,
// broadcasts, notification_preferences и outbox.

import { rolesAtLeast } from '../access/roles.js';

/** Действующие сотрудники от указанного уровня. Отдаёт ТОЛЬКО имена. */
export async function staffIds(client, minLevel) {
  const { rows } = await client.query(`
    SELECT user_id AS "id" FROM users
     WHERE is_active AND NOT is_banned AND deleted_at IS NULL
       AND role = ANY($1::user_role[])`, [rolesAtLeast(minLevel)]);
  return rows.map(с => с.id);
}

/**
 * Отсеять тех, кто отключил категорию. Обязательные категории не отсеиваются
 * вовсе — о собственном положении сообщают всегда.
 */
export async function keepSubscribed(client, userIds, category) {
  if (!userIds.length) return [];
  const { rows } = await client.query(`
    SELECT u AS "id"
      FROM unnest($1::uuid[]) AS u
      LEFT JOIN notification_preferences p ON p.user_id = u
     WHERE COALESCE((p.categories ->> $2)::boolean, TRUE)`, [userIds, category]);
  return rows.map(с => с.id);
}

export async function insertAddressed(client, { userIds, type, category, priority,
                                                data, дней }) {
  const { rows } = await client.query(`
    INSERT INTO notifications (user_id, type, category, priority, data, expires_at)
    SELECT u, $2, $3, $4, $5, NOW() + ($6 || ' days')::interval
      FROM unnest($1::uuid[]) AS u
    RETURNING notification_id AS "id"`,
    [userIds, type, category, priority, data, String(дней)]);
  return rows.map(с => с.id);
}

export async function insertBroadcast(client, { type, category, data, дней }) {
  const { rows } = await client.query(`
    INSERT INTO broadcasts (type, category, data, expires_at)
    VALUES ($1, $2, $3, NOW() + ($4 || ' days')::interval)
    RETURNING broadcast_id AS "id"`, [type, category, data, String(дней)]);
  return rows[0].id;
}

export const enqueue = (client, channel, payload) => client.query(
  `INSERT INTO outbox (channel, payload) VALUES ($1, $2::jsonb)`,
  [channel, JSON.stringify(payload)]);

export const enqueueMany = (client, channel, payloads) => client.query(
  `INSERT INTO outbox (channel, payload)
   SELECT $1, x FROM jsonb_array_elements($2::jsonb) AS x`,
  [channel, JSON.stringify(payloads)]);

/** Непрочитанное: адресные по признаку, широковещательные по курсору. */
export async function unreadCount(db, userId) {
  const { rows } = await db.query(`
    SELECT (SELECT count(*) FROM notifications
             WHERE user_id = $1 AND NOT is_read AND expires_at > NOW())
         + (SELECT count(*) FROM broadcasts b
             WHERE b.expires_at > NOW()
               AND b.broadcast_id > COALESCE(
                     (SELECT broadcast_seen_id FROM notification_preferences
                       WHERE user_id = $1), 0)) AS "сколько"`, [userId]);
  return Number(rows[0].сколько);
}

export async function listAddressed(db, { userId, onlyUnread = false, limit = 50 }) {
  const { rows } = await db.query(`
    SELECT notification_id AS "id", type, category, priority, is_read AS "прочитано",
           data, created_at AS "createdAt"
      FROM notifications
     WHERE user_id = $1 AND expires_at > NOW()
       AND ($2::boolean IS NOT TRUE OR NOT is_read)
     ORDER BY created_at DESC LIMIT $3`, [userId, onlyUnread, limit]);
  return rows;
}

export async function listBroadcasts(db, { userId, limit = 50 }) {
  const { rows } = await db.query(`
    SELECT broadcast_id AS "id", type, category, data, created_at AS "createdAt",
           (broadcast_id <= COALESCE(
              (SELECT broadcast_seen_id FROM notification_preferences
                WHERE user_id = $1), 0)) AS "прочитано"
      FROM broadcasts WHERE expires_at > NOW()
     ORDER BY broadcast_id DESC LIMIT $2`, [userId, limit]);
  return rows;
}

export const markRead = (client, { userId, notificationId }) => client.query(
  `UPDATE notifications SET is_read = TRUE, read_at = NOW()
    WHERE notification_id = $1 AND user_id = $2 AND NOT is_read`,
  [notificationId, userId]);

/** «Прочитать всё» двигает и курсор широковещательных — иначе счётчик врёт. */
export async function markAllRead(client, userId) {
  await client.query(
    `UPDATE notifications SET is_read = TRUE, read_at = NOW()
      WHERE user_id = $1 AND NOT is_read`, [userId]);
  await client.query(`
    INSERT INTO notification_preferences (user_id, broadcast_seen_id)
    VALUES ($1, COALESCE((SELECT max(broadcast_id) FROM broadcasts), 0))
    ON CONFLICT (user_id) DO UPDATE
      SET broadcast_seen_id = COALESCE((SELECT max(broadcast_id) FROM broadcasts), 0),
          updated_at = NOW()`, [userId]);
}

export async function getPreferences(db, userId) {
  const { rows } = await db.query(`
    SELECT email_enabled AS "emailEnabled", push_enabled AS "pushEnabled",
           categories, broadcast_seen_id AS "broadcastSeenId"
      FROM notification_preferences WHERE user_id = $1`, [userId]);
  return rows[0] ?? { emailEnabled: true, pushEnabled: false,
                      categories: {}, broadcastSeenId: 0 };
}

export const setPreferences = (client, userId, { emailEnabled, pushEnabled, categories }) =>
  client.query(`
    INSERT INTO notification_preferences (user_id, email_enabled, push_enabled, categories)
    VALUES ($1, COALESCE($2, TRUE), COALESCE($3, FALSE), COALESCE($4::jsonb, '{}'::jsonb))
    ON CONFLICT (user_id) DO UPDATE
      SET email_enabled = COALESCE($2, notification_preferences.email_enabled),
          push_enabled  = COALESCE($3, notification_preferences.push_enabled),
          categories    = COALESCE($4::jsonb, notification_preferences.categories),
          updated_at    = NOW()`,
    [userId, emailEnabled ?? null, pushEnabled ?? null,
     categories === undefined ? null : JSON.stringify(categories)]);

export async function outboxPending(db, limit = 100) {
  const { rows } = await db.query(`
    SELECT outbox_id AS "id", channel, payload FROM outbox
     WHERE delivered_at IS NULL AND next_try_at <= NOW()
     ORDER BY outbox_id LIMIT $1`, [limit]);
  return rows;
}

export async function countRows(db, таблица) {
  const { rows } = await db.query(`SELECT count(*)::int AS "n" FROM ${таблица}`);
  return rows[0].n;
}

// ── доставка (беседа 3.2) ───────────────────────────────────────────────

/**
 * Взять порцию исходящих СЕБЕ. Работник может идти в несколько рук, и
 * строка должна достаться ровно одному: SKIP LOCKED пропускает занятые
 * чужой сделкой, а claimed_until страхует от работника, умершего молча.
 */
export async function claimOutbox(client, { сколько = 50, наСекунд = 120 }) {
  const { rows } = await client.query(`
    UPDATE outbox SET claimed_until = NOW() + ($2 || ' seconds')::interval
     WHERE outbox_id IN (
       SELECT outbox_id FROM outbox
        WHERE delivered_at IS NULL AND next_try_at <= NOW()
          AND (claimed_until IS NULL OR claimed_until < NOW())
        ORDER BY outbox_id LIMIT $1
        FOR UPDATE SKIP LOCKED)
    RETURNING outbox_id AS "id", channel, payload, attempts`,
    [сколько, String(наСекунд)]);
  return rows;
}

export const markDelivered = (client, id) => client.query(
  `UPDATE outbox SET delivered_at = NOW(), claimed_until = NULL, last_error = NULL
    WHERE outbox_id = $1`, [id]);

/**
 * Отказ навсегда: письмо закрывается, ошибка ОСТАЁТСЯ.
 *
 * `delivered_at` ставится не потому, что письмо ушло, а потому, что оно
 * больше не в очереди: это же поле отбирает работу (`claimOutbox`) и по нему
 * же считается отставание. Отличить безнадёжное от доставленного можно по
 * `last_error`, который здесь нарочно не стирается:
 *   SELECT count(*) FROM outbox WHERE delivered_at IS NOT NULL AND last_error IS NOT NULL;
 */
export const markDead = (client, { id, ошибка }) => client.query(
  `UPDATE outbox SET delivered_at = NOW(), claimed_until = NULL,
          attempts = attempts + 1, last_error = $2
    WHERE outbox_id = $1`, [id, String(ошибка).slice(0, 500)]);

/** Задержка растёт: не удалось — подождём вдвое дольше, но не больше часа. */
export const markFailed = (client, { id, attempts, ошибка }) => client.query(
  `UPDATE outbox SET attempts = attempts + 1, claimed_until = NULL,
          last_error = $2,
          next_try_at = NOW() + (LEAST(3600, 30 * power(2, $3)::int) || ' seconds')::interval
    WHERE outbox_id = $1`, [id, String(ошибка).slice(0, 500), attempts]);

export async function notificationForDelivery(db, notificationId) {
  const { rows } = await db.query(`
    SELECT n.type, n.category, n.data, n.user_id AS "userId",
           u.email, u.username,
           COALESCE(p.email_enabled, TRUE) AS "почтойХочет",
           (u.email_verified_at IS NOT NULL) AS "почтаПодтверждена"
      FROM notifications n JOIN users u USING (user_id)
      LEFT JOIN notification_preferences p ON p.user_id = n.user_id
     WHERE n.notification_id = $1`, [notificationId]);
  return rows[0] ?? null;
}

/** Кому слать сводку: у кого час прошёл и кто не отключал ни почту, ни категорию. */
export async function digestRecipients(db, { категория, часов = 1 }) {
  const { rows } = await db.query(`
    SELECT u.user_id AS "id", u.email, u.username,
           COALESCE(p.last_digest_at, to_timestamp(0)) AS "прошлаяСводка",
           COALESCE(p.broadcast_seen_id, 0) AS "курсор"
      FROM users u LEFT JOIN notification_preferences p ON p.user_id = u.user_id
     WHERE u.is_active AND NOT u.is_banned AND u.deleted_at IS NULL
       AND u.email_verified_at IS NOT NULL
       AND COALESCE(p.email_enabled, TRUE)
       AND COALESCE((p.categories ->> $1)::boolean, TRUE)
       AND COALESCE(p.last_digest_at, to_timestamp(0)) < NOW() - ($2 || ' hours')::interval`,
    [категория, String(часов)]);
  return rows;
}

export async function broadcastsSince(db, { послеId, категория }) {
  const { rows } = await db.query(`
    SELECT broadcast_id AS "id", type, data, created_at AS "createdAt"
      FROM broadcasts
     WHERE broadcast_id > $1 AND category = $2 AND expires_at > NOW()
     ORDER BY broadcast_id`, [послеId, категория]);
  return rows;
}

export const stampDigest = (client, userId) => client.query(`
  INSERT INTO notification_preferences (user_id, last_digest_at)
  VALUES ($1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET last_digest_at = NOW(), updated_at = NOW()`,
  [userId]);

/** Уборка просроченного. Индекс на expires_at заведён миграцией 008. */
export async function sweepExpired(client) {
  const updatedUser = await client.query(`DELETE FROM notifications WHERE expires_at < NOW()`);
  const deleted = await client.query(`DELETE FROM broadcasts    WHERE expires_at < NOW()`);
  const result = await client.query(
    `DELETE FROM outbox WHERE delivered_at < NOW() - INTERVAL '7 days'`);
  return { уведомлений: updatedUser.rowCount, вещаний: deleted.rowCount, исходящих: result.rowCount };
}
