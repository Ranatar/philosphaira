#!/usr/bin/env node
// ШТАТНАЯ ТОЧКА ВХОДА. Один узел поднимает разом приложение, API и живые
// соединения — до сих пор сервер поднимался только пробами, и «как его
// запустить» знал лишь тот, кто читал их код.
//
// ЗАПУСК НИЧЕГО НЕ ГОТОВИТ: не накатывает миграции, не переносит граф, не
// заводит людей. Молчаливая подготовка при старте — способ однажды
// перезаписать рабочую базу семенем.
//
//   node scripts/serve.mjs        (или npm start)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from '../src/db/pool.js';
import { createServer } from '../src/http/server.js';
import { assertKey } from '../src/auth/secretbox.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const порт = Number(process.env.PORT || 8814);
if (!Number.isInteger(порт) || порт < 1 || порт > 65535) {
  console.error(`Негодный PORT: ${process.env.PORT ?? ''}`);
  process.exit(1);
}

// ОБЯЗАТЕЛЬНОЕ ПРОВЕРЯЕТСЯ ДО ПОДЪЁМА, а не при первом обращении. Прежде
// сервер без MFA_SECRET_KEY поднимался МОЛЧА и падал на первом входе со
// вторым шагом — то есть у первого попавшегося человека, а не у того, кто
// запускал и может починить. Отказ должен случаться там, где его увидят.
try {
  assertKey();
} catch (e) {
  console.error('Запуск невозможен: ' + e.message);
  process.exit(1);
}

const строкаПодключения = process.env.DATABASE_URL;
const pool = createPool(строкаПодключения);
let wsNode = null;
let закрываемся = false;

async function завершить(почему, totpCode = 0) {
  if (закрываемся) return;
  закрываемся = true;
  console.log(`\n${почему}: останавливаюсь…`);
  try { if (wsNode) await wsNode.close(); }
  catch (e) { console.error('соединения не закрылись:', e.message); totpCode = 1; }
  try { await pool.end(); }
  catch (e) { console.error('пул не закрылся:', e.message); totpCode = 1; }
  process.exitCode = totpCode;
}
process.once('SIGINT',  () => void завершить('SIGINT'));
process.once('SIGTERM', () => void завершить('SIGTERM'));

try {
  wsNode = await createServer({
    pool, строкаПодключения,
    // Страница отдаётся ЭТИМ ЖЕ узлом: только так в неё попадает метка
    // philos-api, по которой клиент узнаёт, что сервер есть.
    папкаПриложения: path.resolve(КОРЕНЬ, '..', 'app'),
    безопасныеCookie: process.env.NODE_ENV === 'production',
    origins: process.env.WS_ORIGINS
      ? process.env.WS_ORIGINS.split(',').map(с => с.trim()).filter(Boolean)
      : null,
  });
  await wsNode.слушать(порт);
  console.log(`ΦilosΦaira поднята: http://127.0.0.1:${порт}/`);
  console.log(process.env.NODE_ENV === 'production'
    ? 'лад: production, cookie только по HTTPS'
    : 'лад: development, cookie без HTTPS');
} catch (e) {
  console.error('не поднялась:', e.message);
  await завершить('ошибка запуска', 1);
}
