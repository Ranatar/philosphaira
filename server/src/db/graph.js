// ХРАНИЛИЩЕ ГРАФА. Единственное место с SQL по graph_entities.
//
// Главное обещание: ВЫГРУЗКА ДАЁТ ТЕ ЖЕ ШЕСТЬ ФАЙЛОВ ПОСИМВОЛЬНО.
// Приложение пишет их как JSON.stringify(данные, null, 1) — отступ в один
// пробел, порядок ключей тот, что в объекте, не-ASCII не экранируется,
// завершающего перевода строки нет. Всё это воспроизводится здесь и
// проверяется побайтовым сравнением, а не на глаз.

import { НАБОРЫ, НАБОР_ПО_РОДУ, ИМЕНА } from '../graph/schema.js';

/** Ровно то, что делает приложение при сохранении. */
export const какПишетПриложение = данные => JSON.stringify(данные, null, 1);

/**
 * Разложить запись на адрес и тело. Ключ id в тело НЕ кладётся: он и так
 * лежит в entity_id, а два места для одного знания расходятся.
 */
function разобрать(имяНабора, запись) {
  const опись = НАБОРЫ[имяНабора];
  const чужие = Object.keys(запись).filter(к => !опись.keys.includes(к));
  if (чужие.length) {
    throw new Error(
      `перенос ${имяНабора}: в записи ${запись.id} посторонние поля ` +
      `${чужие.join(', ')}. Молча выкинуть их нельзя — допишите опись ` +
      'в src/graph/schema.js или разберитесь, откуда они взялись.');
  }
  if (запись.id == null) {
    throw new Error(`перенос ${имяНабора}: запись без id`);
  }
  const тело = {};
  for (const к of опись.keys) {
    if (к === 'id') continue;
    if (к in запись) тело[к] = запись[к];
  }
  return { entityId: String(запись.id), тело };
}

/** Собрать запись обратно: id первым, остальные — по описи. */
function собрать(имяНабора, entityId, тело) {
  const запись = {};
  for (const к of НАБОРЫ[имяНабора].keys) {
    if (к === 'id') запись.id = entityId;
    else if (к in тело) запись[к] = тело[к];
  }
  return запись;
}

/** Перенос одного набора. Идемпотентен: повтор даёт то же состояние. */
export async function importSet(client, имяНабора, записи) {
  const { kind } = НАБОРЫ[имяНабора];
  let n = 0;
  for (const [ord, запись] of записи.entries()) {
    const { entityId, тело } = разобрать(имяНабора, запись);
    await client.query(`
      INSERT INTO graph_entities (kind, entity_id, ord, data, changed_at_version)
      VALUES ($1, $2, $3, $4, 0)
      ON CONFLICT (kind, entity_id) DO UPDATE
        SET ord = EXCLUDED.ord, data = EXCLUDED.data,
            version = graph_entities.version + 1,
            deleted_at = NULL, updated_at = NOW()`,
      [kind, entityId, ord, тело]);
    n++;
  }
  return n;
}

/** Выгрузка одного набора в том же виде, в каком его пишет приложение. */
export async function exportSet(db, имяНабора) {
  const { kind } = НАБОРЫ[имяНабора];
  const { rows } = await db.query(`
    SELECT entity_id AS "entityId", data AS "тело"
      FROM graph_entities
     WHERE kind = $1 AND deleted_at IS NULL
     ORDER BY ord`, [kind]);
  return rows.map(с => собрать(имяНабора, с.entityId, с.тело));
}

export async function exportAll(db) {
  const всё = {};
  for (const имя of ИМЕНА) всё[имя] = await exportSet(db, имя);
  return всё;
}

/** Текущее состояние графа: по нему клиент понимает, что отстал. */
export async function graphVersion(db) {
  const { rows } = await db.query(
    `SELECT version AS "версия" FROM graph_state WHERE singleton`);
  return Number(rows[0].версия);
}

export const bumpGraphVersion = async client => {
  const { rows } = await client.query(
    `UPDATE graph_state SET version = version + 1 WHERE singleton
      RETURNING version AS "версия"`);
  return Number(rows[0].версия);
};

/** Сколько живых сущностей каждого рода — для сверок и для показа. */
export async function counts(db) {
  const { rows } = await db.query(`
    SELECT kind::text AS "род", count(*)::int AS "сколько"
      FROM graph_entities WHERE deleted_at IS NULL
     GROUP BY kind`);
  return Object.fromEntries(rows.map(с => [НАБОР_ПО_РОДУ[с.род], с.сколько]));
}

// ── применение коммитов (беседа 2.3) ────────────────────────────────────
// SQL по сущностям графа живёт ЗДЕСЬ, а не в службе применения: проба
// строения поймала первый набросок, где apply.js читал rows напрямую.

/** Взять сущность с блокировкой. живая === null — её нет или она удалена. */
export async function lockEntity(client, kind, entityId) {
  const { rows } = await client.query(`
    SELECT data AS "тело", ord AS "порядок", (deleted_at IS NOT NULL) AS "удалена"
      FROM graph_entities WHERE kind = $1 AND entity_id = $2 FOR UPDATE`,
    [kind, entityId]);
  const с = rows[0];
  if (!с) return { есть: false, живая: null, порядок: null };
  return { есть: true, живая: с.удалена ? null : с.тело, порядок: с.порядок };
}

export async function nextOrd(client, kind) {
  const { rows } = await client.query(
    `SELECT coalesce(max(ord), -1) + 1 AS "след" FROM graph_entities WHERE kind = $1`,
    [kind]);
  return rows[0].след;
}

export const markEntityDeleted = (client, kind, entityId, actorId) => client.query(`
  UPDATE graph_entities SET deleted_at = NOW(), version = version + 1,
         updated_at = NOW(), updated_by = $3
   WHERE kind = $1 AND entity_id = $2`, [kind, entityId, actorId]);

/** Заводит или ВОСКРЕШАЕТ по тому же адресу: адрес занят навсегда. */
export const upsertEntity = (client, { kind, entityId, ord, тело, actorId }) =>
  client.query(`
    INSERT INTO graph_entities (kind, entity_id, ord, data, updated_by)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (kind, entity_id) DO UPDATE
      SET data = EXCLUDED.data, deleted_at = NULL,
          version = graph_entities.version + 1,
          updated_at = NOW(), updated_by = EXCLUDED.updated_by`,
    [kind, entityId, ord, тело, actorId]);

/** Пишет ТОЛЬКО чистые поля: совпавшие уже в базе, версию впустую не поднимаем. */
export const patchEntity = (client, { kind, entityId, поля, actorId }) =>
  client.query(`
    UPDATE graph_entities SET data = data || $3::jsonb, version = version + 1,
           updated_at = NOW(), updated_by = $4
     WHERE kind = $1 AND entity_id = $2`,
    [kind, entityId, JSON.stringify(поля ?? {}), actorId]);

// ── откат и приращение (беседа 2.4) ─────────────────────────────────────

/**
 * Тело сущности ВКЛЮЧАЯ удалённые. Нужно откату удаления: коммит удаления
 * полей не несёт (у удаления их не бывает), а вернуть сущность надо в том
 * виде, в каком она была. Мягкое удаление для того и заведено — тело на
 * месте, и воскрешать есть что.
 */
export async function entityBody(client, kind, entityId) {
  const { rows } = await client.query(`
    SELECT data AS "тело", (deleted_at IS NOT NULL) AS "удалена"
      FROM graph_entities WHERE kind = $1 AND entity_id = $2`, [kind, entityId]);
  return rows[0] ?? null;
}

export const stampVersion = (client, { kind, entityId, версия }) => client.query(
  `UPDATE graph_entities SET changed_at_version = $3
    WHERE kind = $1 AND entity_id = $2`, [kind, entityId, версия]);

/**
 * Приращение: что изменилось ПОСЛЕ версии since. Удалённые приходят с
 * пометкой, а не молчанием.
 */
export async function changesSince(db, since) {
  const { rows } = await db.query(`
    SELECT kind::text AS "kind", entity_id AS "entityId", data AS "тело",
           ord AS "порядок", (deleted_at IS NOT NULL) AS "удалена",
           changed_at_version AS "версия"
      FROM graph_entities
     WHERE changed_at_version > $1
     ORDER BY changed_at_version, kind, ord`, [since]);
  return rows;
}

/** История сущности: применённые коммиты, тронувшие этот адрес. */
export async function entityHistory(db, { kind, entityId }) {
  const { rows } = await db.query(`
    SELECT c.commit_id AS "commitId", c.status, c.message, c.created_at AS "createdAt",
           c.applied_version AS "версия", u.username AS "author",
           c.changes AS "changes"
      FROM commits c JOIN users u ON u.user_id = c.author_id
     WHERE c.status IN ('applied', 'reverted')
       AND c.changes @> $1::jsonb
     ORDER BY c.applied_version`,
    [JSON.stringify([{ kind, entityId }])]);
  return rows;
}
