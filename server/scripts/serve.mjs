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
import { создатьПул } from '../src/db/pool.js';
import { создатьСервер } from '../src/http/server.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const порт = Number(process.env.PORT || 8814);
if (!Number.isInteger(порт) || порт < 1 || порт > 65535) {
  console.error(`Негодный PORT: ${process.env.PORT ?? ''}`);
  process.exit(1);
}

const строкаПодключения = process.env.DATABASE_URL;
const pool = создатьПул(строкаПодключения);
let узел = null;
let закрываемся = false;

async function завершить(почему, код = 0) {
  if (закрываемся) return;
  закрываемся = true;
  console.log(`\n${почему}: останавливаюсь…`);
  try { if (узел) await узел.close(); }
  catch (e) { console.error('соединения не закрылись:', e.message); код = 1; }
  try { await pool.end(); }
  catch (e) { console.error('пул не закрылся:', e.message); код = 1; }
  process.exitCode = код;
}
process.once('SIGINT',  () => void завершить('SIGINT'));
process.once('SIGTERM', () => void завершить('SIGTERM'));

try {
  узел = await создатьСервер({
    pool, строкаПодключения,
    // Страница отдаётся ЭТИМ ЖЕ узлом: только так в неё попадает метка
    // philos-api, по которой клиент узнаёт, что сервер есть.
    папкаПриложения: path.resolve(КОРЕНЬ, '..', 'app'),
    безопасныеCookie: process.env.NODE_ENV === 'production',
    origins: process.env.WS_ORIGINS
      ? process.env.WS_ORIGINS.split(',').map(с => с.trim()).filter(Boolean)
      : null,
  });
  await узел.слушать(порт);
  console.log(`ΦilosΦaira поднята: http://127.0.0.1:${порт}/`);
  console.log(process.env.NODE_ENV === 'production'
    ? 'лад: production, cookie только по HTTPS'
    : 'лад: development, cookie без HTTPS');
} catch (e) {
  console.error('не поднялась:', e.message);
  await завершить('ошибка запуска', 1);
}
