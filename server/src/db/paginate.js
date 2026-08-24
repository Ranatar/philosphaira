// Один вид ответа на весь API. В первой редакции пагинация была ОБЕЩАНА в
// описании эндпоинтов и не написана нигде, а панель пыталась читать сразу
// два вида ответа: и голый массив, и объект с pagination.

export const ПРЕДЕЛ_НА_СТРАНИЦУ = 100;

export async function paginate(db, { from, select, where = [], params = [],
                                     order, page = 1, limit = 20, map }) {
  // Предел сверху — не украшение: limit=1000000 из адресной строки уносит
  // в память всю таблицу.
  const пределы = Math.min(Math.max(1, Number(limit) || 20), ПРЕДЕЛ_НА_СТРАНИЦУ);
  const страница = Math.max(1, Number(page) || 1);
  const условие = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: [{ count }] } = await db.query(
    `SELECT count(*)::int AS count FROM ${from} ${условие}`, params);
  const { rows } = await db.query(
    `SELECT ${select} FROM ${from} ${условие} ORDER BY ${order}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, пределы, (страница - 1) * пределы]);

  return {
    items: rows.map(map),
    pagination: {
      page: страница, limit: пределы, total: count,
      pages: Math.max(1, Math.ceil(count / пределы)),
    },
  };
}
