#!/usr/bin/env node
// ЗАВЕДЕНИЕ ВТОРОГО ШАГА ИЗ КОМАНДНОЙ СТРОКИ.
//
// ПОЧЕМУ ЭТОТ СКРИПТ ВООБЩЕ ЕСТЬ. Писался он, когда заведения второго шага в
// слое HTTP не было вовсе: службы beginEnroll/confirmEnroll существовали и
// были проверены (mfa_probe), но наружу их не выставили, и единственным
// каналом доверия оставалась командная строка оператора — как у
// bootstrap-admin.
//
// С ТЕХ ПОР ПАНЕЛЬ ПОЯВИЛАСЬ: маршруты POST /api/auth/mfa/enroll и
// /enroll/confirm заведены (http/app.js), клиент их зовёт (modal/security.js,
// окно безопасности). Обычный путь теперь — панель.
//
// Скрипт остаётся для случаев, когда панель недоступна: QR нечем снять,
// браузер не встаёт, администратор заперт срезанными правами. Секрет здесь
// показывается СТРОКОЙ, и её можно ввести в аутентификатор руками.
//
//   cd ~/philosphaira/server
//   node scripts/enroll-mfa.mjs [логин]      # умолчание — admin
//
// Секрет ПОКАЗЫВАЕТСЯ, но второй шаг НЕ включается, пока не предъявлен код:
// иначе можно запереть себя, сохранив секрет, который никуда не записал.

import readline from 'node:readline/promises';
import { stdin as вход, stdout as выход } from 'node:process';
import { createPool } from '../src/db/pool.js';
import { findByUsername } from '../src/db/users.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';

const логин = process.argv[2] || 'admin';
const pool = createPool();

try {
  // Спрашиваем слой базы, а не пишем SQL здесь: змеиные имена полей живут
  // только в src/db/ — это стережёт structure_probe, и он же поймал первую
  // редакцию этого скрипта.
  const найден = await findByUsername(pool, логин);

  if (!найден) {
    console.error(`Пользователя «${логин}» нет.`);
    console.error('Логин задавался при bootstrap-admin; умолчание — admin.');
    process.exit(1);
  }
  if (найден.mfaReady) {
    console.error(`У «${логин}» второй шаг уже заведён. Снимать его отсюда нельзя —`);
    console.error('это делается из панели, с предъявлением свежего кода.');
    process.exit(1);
  }

  const user = { userId: найден.userId, username: найден.username };
  const { секрет: secret, ссылка } = await beginEnroll(pool, user);

  console.log('');
  console.log('  СЕКРЕТ (вносить руками):  ' + secret);
  console.log('  ССЫЛКА (для QR):          ' + ссылка);
  console.log('');
  console.log('  Внесите секрет в приложение-аутентификатор — подойдёт любое,');
  console.log('  понимающее TOTP: Aegis, FreeOTP, Google Authenticator.');
  console.log('  Затем введите шестизначный код, который оно показывает.');
  console.log('');

  const rl = readline.createInterface({ input: вход, output: выход });
  const totpCode = (await rl.question('  Код: ')).trim();
  rl.close();

  const { коды: recoveryCodes } = await confirmEnroll(pool, user, totpCode);

  console.log('');
  console.log('  ✓ Второй шаг заведён. Права восстановлены полностью.');
  console.log('');
  console.log('  КОДЫ ВОССТАНОВЛЕНИЯ — единственный раз, когда они видны.');
  console.log('  Каждый срабатывает однажды. Храните вне телефона:');
  console.log('');
  for (const к of recoveryCodes) console.log('    ' + к);
  console.log('');
} catch (e) {
  console.error('\n  ✗ ' + e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
