// ХРАНИЛИЩЕ КОММИТОВ. Единственное место с SQL по commits.

import { SET_BY_KIND } from '../graph/schema.js';

/** Как коммит выглядит наружу. Змеиным именам хода за пределы src/db/ нет. */
const commit = since => Object.freeze({
  commitId:      since.commit_id,
  authorId:      since.author_id,
  authorName:    since.author_name ?? null,
  status:        since.status,
  message:       since.message,
  authorComment: since.author_comment ?? null,
  changes:       since.changes,
  reviewedBy:    since.reviewed_by ?? null,
  reviewedAt:    since.reviewed_at ?? null,
  reviewComment: since.review_comment ?? null,
  // СТОЛКНОВЕНИЯ ОТДАЮТСЯ НАРУЖУ. Прежде они писались в базу и там же
  // оставались: ни в переводе, ни в списке полей их не было, и автор
  // конфликтного коммита не мог узнать, ЧТО именно столкнулось. Между тем
  // в каждой записи лежат все три значения — база, предложенное и текущее
  // (merge.js), — и без них конфликт не состояние, а тупик.
  conflicts:     since.conflicts ?? null,
  // Кого этот коммит заменяет. История правки без родства распадается на
  // несвязанные попытки: видно, что трижды предлагали похожее, и не видно,
  // что это были три захода на одно и то же.
  supersedes:    since.supersedes ?? null,
  createdAt:     since.created_at,
});

const COLUMNS = `
  c.commit_id, c.author_id, c.status, c.message, c.author_comment, c.changes,
  c.reviewed_by, c.reviewed_at, c.review_comment, c.conflicts, c.supersedes,
  c.created_at,
  u.username AS author_name`;

export async function insertCommit(client,
    { authorId, message, authorComment, changes, supersedes = null }) {
  const { rows } = await client.query(`
    INSERT INTO commits (author_id, message, author_comment, changes, supersedes)
    VALUES ($1, $2, $3, $4::jsonb, $5)
    RETURNING commit_id, author_id, status, message, author_comment, changes,
              reviewed_by, reviewed_at, review_comment, supersedes, created_at`,
    [authorId, message, authorComment, JSON.stringify(changes), supersedes]);
  return commit(rows[0]);
}

export async function findCommit(db, commitId) {
  const { rows } = await db.query(
    `SELECT ${COLUMNS} FROM commits c JOIN users u ON u.user_id = c.author_id
      WHERE c.commit_id = $1`, [commitId]);
  return rows[0] ? commit(rows[0]) : null;
}

/** Взять СВОЙ ожидающий с блокировкой: правка и удаление идут только так. */
export async function findOwnPendingForUpdate(client, { commitId, authorId }) {
  const { rows } = await client.query(`
    SELECT ${COLUMNS} FROM commits c JOIN users u ON u.user_id = c.author_id
     WHERE c.commit_id = $1 AND c.author_id = $2 AND c.status = 'pending'
     FOR UPDATE OF c`, [commitId, authorId]);
  return rows[0] ? commit(rows[0]) : null;
}

export async function updateOwnCommit(client, { commitId, message, authorComment, changes }) {
  const { rows } = await client.query(`
    UPDATE commits SET message = $2, author_comment = $3, changes = $4::jsonb
     WHERE commit_id = $1
    RETURNING commit_id, author_id, status, message, author_comment, changes,
              reviewed_by, reviewed_at, review_comment, created_at`,
    [commitId, message, authorComment, JSON.stringify(changes)]);
  return commit(rows[0]);
}

export const deleteCommit = (client, commitId) =>
  client.query(`DELETE FROM commits WHERE commit_id = $1`, [commitId]);

export const commitsFrom = 'commits c JOIN users u ON u.user_id = c.author_id';
export const commitsSelect = COLUMNS;
export const commitToApi = commit;

/**
 * Чужие ожидающие коммиты, трогающие ТЕ ЖЕ поля тех же сущностей.
 * Половина столкновений снимается тем, что правщик узнаёт о чужой правке
 * ПРИ ОТПРАВКЕ, а не после рассмотрения.
 */
export async function overlappingPending(db, { authorId, changes }) {
  const entityKeys = changes.map(и => `${и.kind}\u0000${и.entityId}`);
  const { rows } = await db.query(`
    SELECT c.commit_id, c.author_id, c.message, c.changes, u.username AS author_name
      FROM commits c JOIN users u ON u.user_id = c.author_id
     WHERE c.status = 'pending' AND c.author_id <> $1`, [authorId]);

  const overlaps = [];
  for (const since of rows) {
    for (const theirs of since.changes) {
      const entityKey = `${theirs.kind}\u0000${theirs.entityId}`;
      if (!entityKeys.includes(entityKey)) continue;
      const mine = changes.find(и => `${и.kind}\u0000${и.entityId}` === entityKey);
      const shared = Object.keys(mine.fields ?? {})
        .filter(п => п in (theirs.fields ?? {}));
      // Совпал адрес, но не поля — это не пересечение: двое правят разные
      // стороны одной концепции, и слияние выйдет само (беседа 2.3).
      if (!shared.length && mine.action === 'edit' && theirs.action === 'edit') continue;
      overlaps.push({
        commitId: since.commit_id,
        authorName: since.author_name,
        message: since.message,
        kind: theirs.kind,
        набор: SET_BY_KIND[theirs.kind],
        entityId: theirs.entityId,
        поля: shared,
        обаНеПравки: mine.action !== 'edit' || theirs.action !== 'edit',
      });
    }
  }
  return overlaps;
}

// ── рассмотрение (беседа 2.3) ───────────────────────────────────────────

export async function lockCommit(client, commitId) {
  const { rows } = await client.query(`
    SELECT commit_id AS "commitId", author_id AS "authorId", changes, status
      FROM commits WHERE commit_id = $1 FOR UPDATE`, [commitId]);
  return rows[0] ?? null;
}

export const markRejected = (client, { commitId, reviewerId, comment }) =>
  client.query(`
    UPDATE commits SET status = 'rejected', reviewed_by = $2,
           reviewed_at = NOW(), review_comment = $3
     WHERE commit_id = $1`, [commitId, reviewerId, comment]);

export const markConflicted = (client, { commitId, reviewerId = null, столкновения: conflicts }) =>
  client.query(`
    UPDATE commits SET status = 'conflicted', reviewed_by = $2,
           reviewed_at = CASE WHEN $2::uuid IS NULL THEN NULL ELSE NOW() END,
           conflicts = $3::jsonb
     WHERE commit_id = $1`,
    [commitId, reviewerId, JSON.stringify(conflicts ?? [])]);

export const markApplied = (client, { commitId, статус, reviewerId = null,
                                      comment = null, версия: version }) =>
  client.query(`
    UPDATE commits SET status = $2::commit_status, reviewed_by = $3,
           reviewed_at = CASE WHEN $3::uuid IS NULL THEN NULL ELSE NOW() END,
           review_comment = $4, applied_at = NOW(), applied_version = $5
     WHERE commit_id = $1`, [commitId, статус, reviewerId, comment, version]);
