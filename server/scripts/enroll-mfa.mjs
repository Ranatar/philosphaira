#!/usr/bin/env node
// ЗАВЕДЕНИЕ ВТОРОГО ШАГА ИЗ КОМАНДНОЙ СТРОКИ.
//
// ПОЧЕМУ ЭТОТ СКРИПТ ВООБЩЕ ЕСТЬ. Службы beginEnroll/confirmEnroll написаны
// и проверены (mfa_probe), но наружу не выставлены: слой HTTP заводился
// «только тот, без которого клиент не встаёт» (user_management_system.md,
// раздел «Чем построенное разошлось»), и заведение в него не попало.
// Клиент знает единственный путь второго шага — POST /api/auth/mfa, и это
// ПРЕДЪЯВЛЕНИЕ кода при входе, а не заведение. Пока маршрута нет, канал
// доверия здесь тот же, что у bootstrap-admin: командная строка оператора.
//
//   cd ~/philosphaira/server
//   node scripts/enroll-mfa.mjs [логин]      # умолчание — admin
//
// Секрет ПОКАЗЫВАЕТСЯ, но второй шаг НЕ включается, пока не предъявлен код:
// иначе можно запереть себя, сохранив секрет, который никуда не записал.

import readline from 'node:readline/promises';
import { stdin as вход, stdout as выход } from 'node:process';
import { создатьПул } from '../src/db/pool.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';

const логин = process.argv[2] || 'admin';
const pool = создатьПул();

try {
  const { rows } = await pool.query(
    `SELECT user_id, username, mfa_enabled FROM users
      WHERE lower(username) = lower($1) AND deleted_at IS NULL`, [логин]);

  if (!rows[0]) {
    console.error(`Пользователя «${логин}» нет. Кто есть:`);
    const { rows: все } = await pool.query(
      `SELECT username, role FROM users WHERE deleted_at IS NULL ORDER BY created_at`);
    for (const с of все) console.error(`  ${с.username} (${с.role})`);
    process.exit(1);
  }
  if (rows[0].mfa_enabled) {
    console.error(`У «${логин}» второй шаг уже заведён. Снимать его отсюда нельзя —`);
    console.error('это делается из панели, с предъявлением свежего кода.');
    process.exit(1);
  }

  const user = { userId: rows[0].user_id, username: rows[0].username };
  const { секрет, ссылка } = await beginEnroll(pool, user);

  console.log('');
  console.log('  СЕКРЕТ (вносить руками):  ' + секрет);
  console.log('  ССЫЛКА (для QR):          ' + ссылка);
  console.log('');
  console.log('  Внесите секрет в приложение-аутентификатор — подойдёт любое,');
  console.log('  понимающее TOTP: Aegis, FreeOTP, Google Authenticator.');
  console.log('  Затем введите шестизначный код, который оно показывает.');
  console.log('');

  const rl = readline.createInterface({ input: вход, output: выход });
  const код = (await rl.question('  Код: ')).trim();
  rl.close();

  const { коды } = await confirmEnroll(pool, user, код);

  console.log('');
  console.log('  ✓ Второй шаг заведён. Права восстановлены полностью.');
  console.log('');
  console.log('  КОДЫ ВОССТАНОВЛЕНИЯ — единственный раз, когда они видны.');
  console.log('  Каждый срабатывает однажды. Храните вне телефона:');
  console.log('');
  for (const к of коды) console.log('    ' + к);
  console.log('');
} catch (e) {
  console.error('\n  ✗ ' + e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
