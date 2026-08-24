#!/usr/bin/env node
// Первый администратор заводится ЗДЕСЬ, а не через API.
//
// Открытая ветка «первый зарегистрировавшийся становится администратором» —
// известный способ потерять систему в первые же сутки. Поэтому: только при
// ПУСТОЙ таблице, только из командной строки, и с временным паролем, который
// нельзя предъявить, пока не заведён настоящий (беседа 1.3 добавит хеширование
// и смену пароля).

import crypto from 'node:crypto';
import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { userFromRow } from '../src/db/mapper.js';

const login = process.env.BOOTSTRAP_ADMIN_LOGIN || 'admin';
const email = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@example.invalid';

const pool = создатьПул();
try {
  const итог = await withTransaction(pool, async client => {
    // Считаем ВНУТРИ транзакции и с блокировкой: два одновременных запуска
    // иначе оба увидят пустую таблицу и заведут двух администраторов.
    const { rowCount } = await client.query(
      `SELECT user_id FROM users WHERE deleted_at IS NULL FOR UPDATE`);
    if (rowCount) return { уже: rowCount };

    // Хеш, которому не соответствует НИ ОДИН пароль: настоящее хеширование
    // приходит в 1.3, а до тех пор запись не должна пускать никого.
    const заглушка = '!нельзя-войти:' + crypto.randomBytes(16).toString('hex');
    const { rows: [строка] } = await client.query(`
      INSERT INTO users (username, email, password_hash, role, display_name)
      VALUES ($1, $2, $3, 'administrator', $1) RETURNING *`,
      [login, email, заглушка]);

    // Строка становится объектом СРАЗУ, и дальше живёт только объект:
    // читать строку.user_id тут же — значит начать ту самую двойную
    // жизнь, из которой выросла половина дефектов первой редакции.
    // Проба строения ловит это и поймала при первом же прогоне.
    const заведён = userFromRow(строка);

    await client.query(`
      INSERT INTO role_history (user_id, old_role, new_role, changed_by, reason)
      VALUES ($1, NULL, 'administrator', NULL, $2)`,
      [заведён.userId, 'первый администратор, заведён bootstrap-admin']);

    await client.query(`
      INSERT INTO audit_log (actor_id, action, subject_type, subject_id, payload)
      VALUES (NULL, 'user.bootstrap', 'user', $1, '{}'::jsonb)`, [заведён.userId]);

    return { заведён };
  });

  if (итог.уже) {
    console.log(`в базе уже ${итог.уже} пользовател(я/ей) — ничего не делаю`);
    process.exitCode = 1;
  } else {
    console.log(`заведён администратор ${итог.заведён.username} (${итог.заведён.userId})`);
    console.log('пароля у него ПОКА НЕТ: войти нельзя до беседы 1.3');
  }
} finally {
  await pool.end();
}
