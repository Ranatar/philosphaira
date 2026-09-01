// ХРАНИМАЯ РАСКЛАДКА — доступ к базе.
//
// Строка graph_layout НЕ ПОКИДАЕТ этот слой: наружу уходит объект домена.
// Правило слоя записано в server-design.md и уже стоило одного захода —
// verifyToken отдавал строку базы, а проверка прав спрашивала домен.

/** Действующая раскладка или null, если её ещё не считали. */
export async function currentLayout(db) {
  const { rows } = await db.query(
    `SELECT layout_id, graph_version, kind, positions, created_at,
            shift_median, shift_far, fingerprint
       FROM graph_layout ORDER BY layout_id DESC LIMIT 1`);
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: Number(r.layout_id),
    версияГрафа: Number(r.graph_version),
    род: r.kind,
    позиции: r.positions,
    отпечаток: r.fingerprint,
    когда: r.created_at,
    расхождение: r.shift_median === null ? null
      : { медиана: r.shift_median, далеко: r.shift_far },
  };
}

/** Записать новую раскладку. Возвращает её идентификатор. */
export async function saveLayout(client, {
  версияГрафа, род, изЧего = null, позиции, ктоId = null, расхождение = null,
  отпечаток = null,
}) {
  const { rows } = await client.query(
    `INSERT INTO graph_layout
       (graph_version, kind, based_on, positions, created_by, shift_median, shift_far, fingerprint)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
     RETURNING layout_id`,
    [версияГрафа, род, изЧего, JSON.stringify(позиции), ктоId,
     расхождение?.медиана ?? null, расхождение?.далеко ?? null, отпечаток]);
  return Number(rows[0].layout_id);
}

/**
 * Раскладка по идентификатору — нужна откату: вернуть прежнюю картину
 * пересчётом нельзя, она зависит от всей истории приращений.
 */
export async function layoutById(db, id) {
  const { rows } = await db.query(
    `SELECT layout_id, graph_version, kind, positions FROM graph_layout WHERE layout_id = $1`,
    [id]);
  if (!rows.length) return null;
  const r = rows[0];
  return { id: Number(r.layout_id), версияГрафа: Number(r.graph_version),
           род: r.kind, позиции: r.positions };
}

/** Последние раскладки — для панели и для отката. */
export async function layoutHistory(db, { limit = 20 } = {}) {
  const { rows } = await db.query(
    `SELECT layout_id, graph_version, kind, based_on, created_by, created_at,
            shift_median, shift_far
       FROM graph_layout ORDER BY layout_id DESC LIMIT $1`, [limit]);
  return rows.map(r => ({
    id: Number(r.layout_id), версияГрафа: Number(r.graph_version), род: r.kind,
    изЧего: r.based_on === null ? null : Number(r.based_on),
    ктоId: r.created_by, когда: r.created_at,
    расхождение: r.shift_median === null ? null
      : { медиана: r.shift_median, далеко: r.shift_far },
  }));
}
