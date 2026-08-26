// Транзакция — это СОЕДИНЕНИЕ, а не довод.
//
// В первой редакции стояло db.query(sql, params, { transaction }). Так
// транзакция не работает: db — пул, и два запроса уйдут в разные соединения,
// а BEGIN останется в одном из них. Ошибка тем неприятнее, что всё выглядит
// правильно и проходит на малой нагрузке, пока пул отдаёт то же соединение.
//
// СОГЛАШЕНИЕ, которое читается по подписи и не требует памяти:
//   функция, первый довод которой называется client, обязана исполняться
//   ВНУТРИ транзакции; функция, берущая db, — вне её.
// Стережёт проба tx_signature.

export async function withTransaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const outcome = await fn(client);
    await client.query('COMMIT');
    return outcome;
  } catch (e) {
    // Соединение может быть уже мертво — тогда откатывать нечего и незачем
    // ронять поверх настоящей ошибки вторую, о неудавшемся откате.
    try { await client.query('ROLLBACK'); } catch { /* умерло — и ладно */ }
    throw e;
  } finally {
    client.release();
  }
}
