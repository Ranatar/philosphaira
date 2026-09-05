#!/usr/bin/env node
// Работник исходящих. Крутится, пока его не остановят.
//
//   node scripts/notify-worker.mjs [--once]
//
// Отправитель СЛЕДУЕТ ИЗ ОКРУЖЕНИЯ: задан SMTP_URL — письма уходят по нему,
// не задан — не уходят никуда. Прежде здесь стояло `nullSender` намертво, и
// «настоящий подставляется при развёртывании» означало правку кода на боевой
// машине.
//
// ОБ ЭТОМ ГОВОРИТСЯ ВСЛУХ И ПРИ ЗАПУСКЕ. Молчаливая отправка «в никуда» хуже
// отказа: работник при этом исправен, живые обновления идут, регистрация
// проходит — молчит только почта, и узнают об этом через неделю от человека,
// который так и не дождался письма.

import { createPool } from '../src/db/pool.js';
import { deliverOnce, sendDigests, sweep } from '../src/notify/worker.js';
import { senderFromEnv } from '../src/notify/mail.js';

const разово = process.argv.includes('--once');
const pool = createPool();
const { sender: отправитель, source: откуда } = senderFromEnv();
console.log(откуда === 'smtp'
  ? `почта: ${new URL(process.env.SMTP_URL).host}, от ${process.env.MAIL_FROM}`
  : 'ПОЧТА НЕ НАСТРОЕНА (нет SMTP_URL): письма уходить не будут, '
    + 'подтверждение адреса и открытая регистрация не работают');

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
