// Один вид ответа на весь API. В первой редакции пагинация была ОБЕЩАНА в
// описании эндпоинтов и не написана нигде, а панель пыталась читать сразу
// два вида ответа: и голый массив, и объект с pagination.

export const PAGE_LIMIT = 100;

export async function paginate(db, { from, select, where = [], params = [],
                                     order, page = 1, limit = 20, map }) {
  // Предел сверху — не украшение: limit=1000000 из адресной строки уносит
  // в память всю таблицу.
  const limitValue = Math.min(Math.max(1, Number(limit) || 20), PAGE_LIMIT);
  const pageHtml = Math.max(1, Number(page) || 1);
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: [{ count }] } = await db.query(
    `SELECT count(*)::int AS count FROM ${from} ${whereClause}`, params);
  const { rows } = await db.query(
    `SELECT ${select} FROM ${from} ${whereClause} ORDER BY ${order}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limitValue, (pageHtml - 1) * limitValue]);

  return {
    items: rows.map(map),
    pagination: {
      page: pageHtml, limit: limitValue, total: count,
      pages: Math.max(1, Math.ceil(count / limitValue)),
    },
  };
}
