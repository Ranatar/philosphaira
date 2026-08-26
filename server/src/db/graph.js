// ХРАНИЛИЩЕ ГРАФА. Единственное место с SQL по graph_entities.
//
// Главное обещание: ВЫГРУЗКА ДАЁТ ТЕ ЖЕ ШЕСТЬ ФАЙЛОВ ПОСИМВОЛЬНО.
// Приложение пишет их как JSON.stringify(данные, null, 1) — отступ в один
// пробел, порядок ключей тот, что в объекте, не-ASCII не экранируется,
// завершающего перевода строки нет. Всё это воспроизводится здесь и
// проверяется побайтовым сравнением, а не на глаз.

import { SETS, SET_BY_KIND, SET_NAMES } from '../graph/schema.js';

/** Ровно то, что делает приложение при сохранении. */
export const asAppWrites = payload => JSON.stringify(payload, null, 1);

/**
 * Разложить запись на адрес и тело. Ключ id в тело НЕ кладётся: он и так
 * лежит в entity_id, а два места для одного знания расходятся.
 */
function parseRecord(имяНабора, record) {
  const spec = SETS[имяНабора];
  const unknownKeys = Object.keys(record).filter(commitRow => !spec.keys.includes(commitRow));
  if (unknownKeys.length) {
    throw new Error(
      `перенос ${имяНабора}: в записи ${record.id} посторонние поля ` +
      `${unknownKeys.join(', ')}. Молча выкинуть их нельзя — допишите опись ` +
      'в src/graph/schema.js или разберитесь, откуда они взялись.');
  }
  if (record.id == null) {
    throw new Error(`перенос ${имяНабора}: запись без id`);
  }
  const payloadBuf = {};
  for (const commitRow of spec.keys) {
    if (commitRow === 'id') continue;
    if (commitRow in record) payloadBuf[commitRow] = record[commitRow];
  }
  return { entityId: String(record.id), тело: payloadBuf };
}

/** Собрать запись обратно: id первым, остальные — по описи. */
function assemble(имяНабора, entityId, payloadBuf) {
  const record = {};
  for (const commitRow of SETS[имяНабора].keys) {
    if (commitRow === 'id') record.id = entityId;
    else if (commitRow in payloadBuf) record[commitRow] = payloadBuf[commitRow];
  }
  return record;
}

/** Перенос одного набора. Идемпотентен: повтор даёт то же состояние. */
export async function importSet(client, имяНабора, записи) {
  const { kind } = SETS[имяНабора];
  let n = 0;
  for (const [ord, record] of записи.entries()) {
    const { entityId, тело: payloadBuf } = parseRecord(имяНабора, record);
    await client.query(`
      INSERT INTO graph_entities (kind, entity_id, ord, data, changed_at_version)
      VALUES ($1, $2, $3, $4, 0)
      ON CONFLICT (kind, entity_id) DO UPDATE
        SET ord = EXCLUDED.ord, data = EXCLUDED.data,
            version = graph_entities.version + 1,
            deleted_at = NULL, updated_at = NOW()`,
      [kind, entityId, ord, payloadBuf]);
    n++;
  }
  return n;
}

/** Выгрузка одного набора в том же виде, в каком его пишет приложение. */
export async function exportSet(db, имяНабора) {
  const { kind } = SETS[имяНабора];
  const { rows } = await db.query(`
    SELECT entity_id AS "entityId", data AS "тело"
      FROM graph_entities
     WHERE kind = $1 AND deleted_at IS NULL
     ORDER BY ord`, [kind]);
  return rows.map(since => assemble(имяНабора, since.entityId, since.тело));
}

export async function exportAll(db) {
  const allSets = {};
  for (const categoryName of SET_NAMES) allSets[categoryName] = await exportSet(db, categoryName);
  return allSets;
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
  return Object.fromEntries(rows.map(since => [SET_BY_KIND[since.род], since.сколько]));
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
  const since = rows[0];
  if (!since) return { есть: false, живая: null, порядок: null };
  return { есть: true, живая: since.удалена ? null : since.тело, порядок: since.порядок };
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
export const upsertEntity = (client, { kind, entityId, ord, тело: payloadBuf, actorId }) =>
  client.query(`
    INSERT INTO graph_entities (kind, entity_id, ord, data, updated_by)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (kind, entity_id) DO UPDATE
      SET data = EXCLUDED.data, deleted_at = NULL,
          version = graph_entities.version + 1,
          updated_at = NOW(), updated_by = EXCLUDED.updated_by`,
    [kind, entityId, ord, payloadBuf, actorId]);

/** Пишет ТОЛЬКО чистые поля: совпавшие уже в базе, версию впустую не поднимаем. */
export const patchEntity = (client, { kind, entityId, поля: fieldNames, actorId }) =>
  client.query(`
    UPDATE graph_entities SET data = data || $3::jsonb, version = version + 1,
           updated_at = NOW(), updated_by = $4
     WHERE kind = $1 AND entity_id = $2`,
    [kind, entityId, JSON.stringify(fieldNames ?? {}), actorId]);

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

export const stampVersion = (client, { kind, entityId, версия: version }) => client.query(
  `UPDATE graph_entities SET changed_at_version = $3
    WHERE kind = $1 AND entity_id = $2`, [kind, entityId, version]);

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
