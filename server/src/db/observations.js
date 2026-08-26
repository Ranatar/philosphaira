/**
 * ЗАМЕРЫ МЕТРИК В БАЗЕ (E-2).
 *
 * Змеиным именам полей хода за пределы src/db/ нет — как и всюду здесь.
 */

import crypto from 'node:crypto';

/** Как замер выглядит наружу. */
const observation = observation => Object.freeze({
  observationId:  observation.observation_id,
  metric:         observation.metric,
  graphVersion:   Number(observation.graph_version),
  formulaVersion: observation.formula_version,
  flags:          observation.flags,
  scopeHash:      observation.scope_hash,
  scopeNote:      observation.scope_note ?? null,
  values:         observation.values,
  note:           observation.note ?? null,
  authorId:       observation.author_id,
  authorName:     observation.author_name ?? null,
  createdAt:      observation.created_at,
});

const COLUMNS = `
  o.observation_id, o.metric, o.graph_version, o.formula_version, o.flags,
  o.scope_hash, o.scope_note, o.values, o.note, o.author_id, o.created_at,
  u.username AS author_name`;
const FROM_CLAUSE = `metric_observations o JOIN users u ON u.user_id = o.author_id`;

/**
 * Отпечаток охвата. Считается ЗДЕСЬ, а не принимается от клиента: иначе два
 * замера с одинаковым охватом могли бы получить разные отпечатки просто
 * потому, что клиент перечислил сущности в другом порядке, — и сравнение
 * между ними стало бы невозможным без всякой причины.
 */
export function scopeFingerprint(охват) {
  const sorted = Array.isArray(охват) ? [...охват].map(String).sort() : [];
  return crypto.createHash('sha256')
    .update(sorted.join('\u0000')).digest('hex').slice(0, 16);
}

export async function insertObservation(db, {
  metric, graphVersion, formulaVersion, flags, scopeHash, scopeNote,
  values, note, authorId,
}) {
  const { rows } = await db.query(`
    INSERT INTO metric_observations
      (metric, graph_version, formula_version, flags, scope_hash, scope_note,
       values, note, author_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)
    RETURNING observation_id, metric, graph_version, formula_version, flags,
              scope_hash, scope_note, values, note, author_id, created_at`,
    [metric, graphVersion, formulaVersion, flags, scopeHash, scopeNote ?? null,
     JSON.stringify(values), note ?? null, authorId]);
  return observation(rows[0]);
}

export async function findObservation(db, id) {
  const { rows } = await db.query(
    `SELECT ${COLUMNS} FROM ${FROM_CLAUSE} WHERE o.observation_id = $1`, [id]);
  return rows[0] ? observation(rows[0]) : null;
}

/** Замеры одной метрики, свежие сверху. */
export async function listObservations(db, { metric, limit = 50 }) {
  const { rows } = await db.query(`
    SELECT ${COLUMNS} FROM ${FROM_CLAUSE}
     WHERE ($1::text IS NULL OR o.metric = $1)
     ORDER BY o.created_at DESC LIMIT $2`, [metric ?? null, Math.min(limit, 200)]);
  return rows.map(observation);
}

/**
 * СРАВНИМЫЕ С ДАННЫМ: та же метрика, та же формула, те же флаги, тот же
 * охват — и ИНАЯ версия графа. Именно этот запрос и есть смысл всей затеи:
 * ряд, в котором меняется только граф, а условия замера постоянны.
 */
export async function listComparable(db, { observationId }) {
  const { rows } = await db.query(`
    SELECT ${COLUMNS} FROM ${FROM_CLAUSE}
     WHERE o.observation_id <> $1
       AND (o.metric, o.formula_version, o.flags, o.scope_hash) = (
         SELECT metric, formula_version, flags, scope_hash
           FROM metric_observations WHERE observation_id = $1)
     ORDER BY o.graph_version`, [observationId]);
  return rows.map(observation);
}
