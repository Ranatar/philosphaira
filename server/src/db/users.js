// ХРАНИЛИЩЕ ПОЛЬЗОВАТЕЛЕЙ. Единственное место, где есть SQL по users.
//
// Заведено не из любви к слоям, а по требованию пробы строения: служба входа
// начала читать rows и змеиные поля, и проба покраснела. Соблазн был ослабить
// правило («ну ведь пароль надо где-то прочитать»), но правило право — и
// вопрос лишь в том, ГДЕ проходит граница. Она проходит здесь.
//
// ХЕШ ПАРОЛЯ НИКОГДА НЕ ПОПАДАЕТ В ДОМЕННЫЙ ОБЪЕКТ. Его отдают отдельным
// полем и только тому, кто сверяет пароль: userFromRow о нём не знает, а
// значит и в ответ API он попасть не может даже по недосмотру.

import { userFromRow } from './mapper.js';

/** Себе показываем полностью: почта своя. */
const себе = строка => userFromRow(строка, { кому: { userId: строка.user_id, level: 4 } });

export async function findByEmailWithSecret(db, email) {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE lower(email) = lower($1) AND deleted_at IS NULL`,
    [email]);
  if (!rows[0]) return null;
  return { user: себе(rows[0]), passwordHash: rows[0].password_hash };
}

export async function findById(db, userId) {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL`, [userId]);
  return rows[0] ? себе(rows[0]) : null;
}

/**
 * Завести пользователя. Единственность держит ИНДЕКС: предварительный SELECT
 * оставлял окно, в которое помещалась чужая регистрация. Ошибку 23505 ловит
 * и переводит в общий ответ вызывающий — здесь она проходит как есть.
 */
export async function insertUser(client, { username, email, passwordHash,
                                           displayName = null, role = 'viewer' }) {
  const { rows: [строка] } = await client.query(`
    INSERT INTO users (username, email, password_hash, display_name, role)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, email, passwordHash, displayName, role]);
  return себе(строка);
}

export const setLastLogin = (client, userId) => client.query(
  `UPDATE users SET last_login = NOW() WHERE user_id = $1`, [userId]);

export const setEmailVerified = (client, userId) => client.query(
  `UPDATE users SET email_verified_at = NOW() WHERE user_id = $1`, [userId]);

/**
 * Запись в журнал. Одно и то же значение идёт ДВУМЯ доводами нарочно:
 * один $n нельзя поставить разом в колонку uuid (actor_id) и text
 * (subject_id) — Postgres выводит тип довода из всех мест сразу и
 * отказывается («inconsistent types deduced for parameter»). Приведение
 * $1::text не спасает, оно лишь добавляет второе требование.
 */
export const audit = (client, { actorId = null, action, subjectType = null,
                                subjectId = null, payload = {}, ip = null }) =>
  client.query(`
    INSERT INTO audit_log (actor_id, action, subject_type, subject_id, payload, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [actorId, action, subjectType, subjectId == null ? null : String(subjectId),
     payload, ip]);

// ── управление пользователями (беседа 1.5) ──────────────────────────────

/** Взять с блокировкой: иначе два одновременных действия прочтут одно и то же. */
export async function findByIdForUpdate(client, userId) {
  const { rows } = await client.query(
    `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL FOR UPDATE`,
    [userId]);
  return rows[0] ? себе(rows[0]) : null;
}

export const updateRole = (client, { userId, newRole, actorId }) => client.query(
  `UPDATE users SET role = $1, role_changed_at = NOW(), role_changed_by = $2
    WHERE user_id = $3`, [newRole, actorId, userId]);

export const writeRoleHistory = (client, { userId, oldRole, newRole, actorId, reason }) =>
  client.query(`
    INSERT INTO role_history (user_id, old_role, new_role, changed_by, reason)
    VALUES ($1, $2, $3, $4, $5)`, [userId, oldRole, newRole, actorId, reason]);

export const setBan = (client, { userId, reason, actorId }) => client.query(
  `UPDATE users SET is_banned = TRUE, ban_reason = $1, banned_at = NOW(), banned_by = $2
    WHERE user_id = $3`, [reason, actorId, userId]);

export const clearBan = (client, userId) => client.query(
  `UPDATE users SET is_banned = FALSE, ban_reason = NULL,
                    banned_at = NULL, banned_by = NULL
    WHERE user_id = $1`, [userId]);

/**
 * Мягкое удаление. Логин и почта переносятся в мёртвое имя: частичные
 * уникальные индексы (WHERE deleted_at IS NULL) этого и ждут — иначе
 * удалённый занимал бы адрес навсегда.
 */
export const softDelete = (client, userId) => client.query(`
  UPDATE users
     SET deleted_at = NOW(), is_active = FALSE,
         email    = 'deleted+' || user_id || '@invalid',
         username = 'deleted_' || left(user_id::text, 8)
   WHERE user_id = $1`, [userId]);

export const roleHistory = async (db, userId) => {
  const { rows } = await db.query(`
    SELECT h.old_role AS "oldRole", h.new_role AS "newRole", h.reason AS "reason",
           h.changed_at AS "changedAt", u.username AS "changedBy"
      FROM role_history h LEFT JOIN users u ON u.user_id = h.changed_by
     WHERE h.user_id = $1 ORDER BY h.changed_at DESC`, [userId]);
  return rows;
};

export const auditEntries = async (db, { actorId = null, action = null,
                                         limit = 50 } = {}) => {
  const { rows } = await db.query(`
    SELECT actor_id AS "actorId", action, subject_type AS "subjectType",
           subject_id AS "subjectId", created_at AS "createdAt"
      FROM audit_log
     WHERE ($1::uuid IS NULL OR actor_id = $1)
       AND ($2::text IS NULL OR action = $2)
     ORDER BY created_at DESC LIMIT $3`, [actorId, action, limit]);
  return rows;
};

export { себе as userForSelf };

/**
 * Сериализовать заведение первого администратора МЕЖДУ ПРОЦЕССАМИ и
 * вернуть число живых пользователей.
 *
 * `SELECT ... FOR UPDATE` по ПУСТОЙ таблице не блокирует НИЧЕГО: строк
 * нет, запирать нечего. Два одновременных запуска увидят ноль и заведут
 * двух администраторов. Ровно эту ошибку разбирали в беседе 1.5 для
 * заслона последнего администратора — и не заметили, что здесь она же.
 *
 * Замок на уровне СДЕЛКИ снимается сам при COMMIT или ROLLBACK, и его
 * не надо помнить.
 */
export async function beginBootstrapAdmin(client) {
  await client.query(
    `SELECT pg_advisory_xact_lock(hashtext('philosphaira.bootstrap-admin'))`);
  const { rowCount } = await client.query(
    `SELECT 1 FROM users WHERE deleted_at IS NULL`);
  return rowCount;
}
