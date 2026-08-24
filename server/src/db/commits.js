// ХРАНИЛИЩЕ КОММИТОВ. Единственное место с SQL по commits.

import { НАБОР_ПО_РОДУ } from '../graph/schema.js';

/** Как коммит выглядит наружу. Змеиным именам хода за пределы src/db/ нет. */
const коммит = с => Object.freeze({
  commitId:      с.commit_id,
  authorId:      с.author_id,
  authorName:    с.author_name ?? null,
  status:        с.status,
  message:       с.message,
  authorComment: с.author_comment ?? null,
  changes:       с.changes,
  reviewedBy:    с.reviewed_by ?? null,
  reviewedAt:    с.reviewed_at ?? null,
  reviewComment: с.review_comment ?? null,
  createdAt:     с.created_at,
});

const ПОЛЯ = `
  c.commit_id, c.author_id, c.status, c.message, c.author_comment, c.changes,
  c.reviewed_by, c.reviewed_at, c.review_comment, c.created_at,
  u.username AS author_name`;

export async function insertCommit(client, { authorId, message, authorComment, changes }) {
  const { rows } = await client.query(`
    INSERT INTO commits (author_id, message, author_comment, changes)
    VALUES ($1, $2, $3, $4::jsonb)
    RETURNING commit_id, author_id, status, message, author_comment, changes,
              reviewed_by, reviewed_at, review_comment, created_at`,
    [authorId, message, authorComment, JSON.stringify(changes)]);
  return коммит(rows[0]);
}

export async function findCommit(db, commitId) {
  const { rows } = await db.query(
    `SELECT ${ПОЛЯ} FROM commits c JOIN users u ON u.user_id = c.author_id
      WHERE c.commit_id = $1`, [commitId]);
  return rows[0] ? коммит(rows[0]) : null;
}

/** Взять СВОЙ ожидающий с блокировкой: правка и удаление идут только так. */
export async function findOwnPendingForUpdate(client, { commitId, authorId }) {
  const { rows } = await client.query(`
    SELECT ${ПОЛЯ} FROM commits c JOIN users u ON u.user_id = c.author_id
     WHERE c.commit_id = $1 AND c.author_id = $2 AND c.status = 'pending'
     FOR UPDATE OF c`, [commitId, authorId]);
  return rows[0] ? коммит(rows[0]) : null;
}

export async function updateOwnCommit(client, { commitId, message, authorComment, changes }) {
  const { rows } = await client.query(`
    UPDATE commits SET message = $2, author_comment = $3, changes = $4::jsonb
     WHERE commit_id = $1
    RETURNING commit_id, author_id, status, message, author_comment, changes,
              reviewed_by, reviewed_at, review_comment, created_at`,
    [commitId, message, authorComment, JSON.stringify(changes)]);
  return коммит(rows[0]);
}

export const deleteCommit = (client, commitId) =>
  client.query(`DELETE FROM commits WHERE commit_id = $1`, [commitId]);

export const commitsFrom = 'commits c JOIN users u ON u.user_id = c.author_id';
export const commitsSelect = ПОЛЯ;
export const commitToApi = коммит;

/**
 * Чужие ожидающие коммиты, трогающие ТЕ ЖЕ поля тех же сущностей.
 * Половина столкновений снимается тем, что правщик узнаёт о чужой правке
 * ПРИ ОТПРАВКЕ, а не после рассмотрения.
 */
export async function overlappingPending(db, { authorId, changes }) {
  const адреса = changes.map(и => `${и.kind}\u0000${и.entityId}`);
  const { rows } = await db.query(`
    SELECT c.commit_id, c.author_id, c.message, c.changes, u.username AS author_name
      FROM commits c JOIN users u ON u.user_id = c.author_id
     WHERE c.status = 'pending' AND c.author_id <> $1`, [authorId]);

  const пересечения = [];
  for (const с of rows) {
    for (const чужое of с.changes) {
      const адрес = `${чужое.kind}\u0000${чужое.entityId}`;
      if (!адреса.includes(адрес)) continue;
      const моё = changes.find(и => `${и.kind}\u0000${и.entityId}` === адрес);
      const общие = Object.keys(моё.fields ?? {})
        .filter(п => п in (чужое.fields ?? {}));
      // Совпал адрес, но не поля — это не пересечение: двое правят разные
      // стороны одной концепции, и слияние выйдет само (беседа 2.3).
      if (!общие.length && моё.action === 'edit' && чужое.action === 'edit') continue;
      пересечения.push({
        commitId: с.commit_id,
        authorName: с.author_name,
        message: с.message,
        kind: чужое.kind,
        набор: НАБОР_ПО_РОДУ[чужое.kind],
        entityId: чужое.entityId,
        поля: общие,
        обаНеПравки: моё.action !== 'edit' || чужое.action !== 'edit',
      });
    }
  }
  return пересечения;
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

export const markConflicted = (client, { commitId, reviewerId = null, столкновения }) =>
  client.query(`
    UPDATE commits SET status = 'conflicted', reviewed_by = $2,
           reviewed_at = CASE WHEN $2::uuid IS NULL THEN NULL ELSE NOW() END,
           conflicts = $3::jsonb
     WHERE commit_id = $1`,
    [commitId, reviewerId, JSON.stringify(столкновения ?? [])]);

export const markApplied = (client, { commitId, статус, reviewerId = null,
                                      comment = null, версия }) =>
  client.query(`
    UPDATE commits SET status = $2::commit_status, reviewed_by = $3,
           reviewed_at = CASE WHEN $3::uuid IS NULL THEN NULL ELSE NOW() END,
           review_comment = $4, applied_at = NOW(), applied_version = $5
     WHERE commit_id = $1`, [commitId, статус, reviewerId, comment, версия]);
