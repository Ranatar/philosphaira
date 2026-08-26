#!/usr/bin/env node
// Работник исходящих. Крутится, пока его не остановят.
//
//   node scripts/notify-worker.mjs [--once]
//
// Отправителя здесь нет нарочно: настоящий подставляется при развёртывании.
// Умолчание не шлёт никуда и об этом говорит — молчаливая отправка «в никуда»
// хуже отказа, потому что о ней узнают через неделю.

import { createPool } from '../src/db/pool.js';
import { deliverOnce, sendDigests, sweep, nullSender } from '../src/notify/worker.js';

const разово = process.argv.includes('--once');
const pool = createPool();
const отправитель = nullSender;

async function заход() {
  const д = await deliverOnce(pool, { отправитель });
  if (д.взято) console.log('исходящие:', JSON.stringify(д));
  const с = await sendDigests(pool, { отправитель });
  if (с.отправлено) console.log('сводки:', JSON.stringify(с));
}

if (разово) {
  await заход();
  console.log('уборка:', JSON.stringify(await sweep(pool)));
  await pool.end();
} else {
  console.log('работник пошёл; Ctrl+C — остановить');
  setInterval(() => заход().catch(e => console.error('заход упал:', e.message)), 5000);
  setInterval(() => sweep(pool).catch(() => {}), 24 * 3600 * 1000);
}
