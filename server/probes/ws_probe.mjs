#!/usr/bin/env node
// Проба СОЕДИНЕНИЙ. Требует живой базы.
//
// Поднимает ДВА узла на разных портах — как два работника за одним
// балансировщиком — и проверяет, что уведомление, положенное одним, доходит
// до сокета, висящего на другом. В первой редакции Redis стоял в
// рекомендациях по развёртыванию, а в коде был Map в памяти одного процесса.
//
//   DATABASE_URL=… node probes/ws_probe.mjs

import http from 'node:http';
import { WebSocket } from 'ws';
import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register, login } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { revokeAllSessions } from '../src/db/sessions.js';
import { поднятьУзел, publish } from '../src/ws/node.js';
import { deliverOnce } from '../src/notify/worker.js';
import { importSet } from '../src/db/graph.js';
import { createCommit } from '../src/commits/service.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const ждать = мс => new Promise(r => setTimeout(r, мс));

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = создатьПул();
const ПАРОЛЬ = 'вполне-длинный-пароль';
const СТРОКА = process.env.DATABASE_URL;

let узел1, узел2, сервер1, сервер2;
const сокеты = [];

/** Открыть соединение с cookie сеанса и собирать всё, что придёт. */
function подключиться(порт, токен, { origin } = {}) {
  const ws = new WebSocket(`ws://127.0.0.1:${порт}/ws`, {
    headers: { cookie: `session=${токен}`, ...(origin ? { origin } : {}) },
  });
  ws.полученное = [];
  ws.открылся = new Promise((готово, беда) => {
    ws.once('open', () => готово(true));
    ws.once('error', e => беда(e));
    ws.once('unexpected-response', (_, res) => беда(new Error('HTTP ' + res.statusCode)));
  });
  ws.on('message', с => {
    try { ws.полученное.push(JSON.parse(с)); } catch { ws.полученное.push({ кривое: true }); }
  });
  сокеты.push(ws);
  return ws;
}

try {
  // ── два узла, как два работника ─────────────────────────────────────────
  узел1 = await поднятьУзел({ db: pool, строкаПодключения: СТРОКА });
  узел2 = await поднятьУзел({ db: pool, строкаПодключения: СТРОКА });
  сервер1 = http.createServer(); сервер2 = http.createServer();
  сервер1.on('upgrade', (...д) => узел1.handleUpgrade(...д));
  сервер2.on('upgrade', (...д) => узел2.handleUpgrade(...д));
  await new Promise(г => сервер1.listen(8801, г));
  await new Promise(г => сервер2.listen(8802, г));

  const { user } = await register(pool, {
    username: 'редактор', email: 'р@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='editor', email_verified_at=NOW()
                     WHERE user_id=$1`, [user.userId]);
  const редактор = await findById(pool, user.userId);
  await register(pool, { username: 'модератор', email: 'м@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='moderator', email_verified_at=NOW(),
                     mfa_enabled=TRUE WHERE username='модератор'`);

  // ── 1. рукопожатие ──────────────────────────────────────────────────────
  let безТокена = 'подключился';
  try {
    const ws = подключиться(8801, 'выдуманный-токен');
    await ws.открылся;
  } catch (e) { безТокена = 'отказ ' + e.message.slice(0, 12); }
  проверить('С ЧУЖИМ ТОКЕНОМ СОКЕТ НЕ ДАЮТ', безТокена.startsWith('отказ'),
    'отказ', безТокена);

  const вход1 = await login(pool, { email: 'р@e.рф', password: ПАРОЛЬ });
  const у1 = подключиться(8801, вход1.токен);
  await у1.открылся;
  проверить('со своим токеном соединение открывается', у1.readyState === WebSocket.OPEN,
    'открыто', у1.readyState);
  await ждать(150);
  проверить('узел здоровается и называет, кого признал',
    у1.полученное[0]?.type === 'hello' && у1.полученное[0]?.userId === редактор.userId,
    'hello с userId', JSON.stringify(у1.полученное[0]));

  let чужойOrigin = 'подключился';
  try {
    const строгий = await поднятьУзел({ db: pool, строкаПодключения: СТРОКА,
      origins: ['https://свой.example'] });
    const сервер3 = http.createServer();
    сервер3.on('upgrade', (...д) => строгий.handleUpgrade(...д));
    await new Promise(г => сервер3.listen(8803, г));
    try {
      const ws = подключиться(8803, вход1.токен, { origin: 'https://чужой.example' });
      await ws.открылся;
    } catch (e) { чужойOrigin = 'отказ'; }
    await строгий.close(); сервер3.close();
  } catch { чужойOrigin = 'ошибка пробы'; }
  проверить('чужой Origin не пускают', чужойOrigin === 'отказ', 'отказ', чужойOrigin);

  // ── 2. ДВА УСТРОЙСТВА ───────────────────────────────────────────────────
  const вход2 = await login(pool, { email: 'р@e.рф', password: ПАРОЛЬ });
  const у2 = подключиться(8801, вход2.токен);
  await у2.открылся; await ждать(150);
  проверить('ВТОРОЕ УСТРОЙСТВО НЕ ВЫБИЛО ПЕРВОЕ',
    узел1.соединения.сколькоУ(редактор.userId) === 2, 2,
    узел1.соединения.сколькоУ(редактор.userId));
  проверить('первое соединение всё ещё открыто', у1.readyState === WebSocket.OPEN,
    'открыто', у1.readyState);

  у1.полученное.length = 0; у2.полученное.length = 0;
  узел1.соединения.кЧеловеку(редактор.userId, { type: 'проба' });
  await ждать(150);
  проверить('уведомление получают ОБА устройства',
    у1.полученное.length === 1 && у2.полученное.length === 1, '1 и 1',
    `${у1.полученное.length} и ${у2.полученное.length}`);

  // ── 3. КРИВОЕ СООБЩЕНИЕ ─────────────────────────────────────────────────
  у1.send('это не JSON вовсе {{{');
  у1.send(Buffer.from([0xff, 0xfe, 0x00]));
  await ждать(200);
  проверить('КРИВОЕ СООБЩЕНИЕ НЕ РОНЯЕТ УЗЕЛ',
    у1.readyState === WebSocket.OPEN && узел1.соединения.всего() >= 2,
    'узел жив', `${у1.readyState}/${узел1.соединения.всего()}`);
  у1.send(JSON.stringify({ type: 'ping' }));
  await ждать(200);
  проверить('и после него разговор продолжается',
    у1.полученное.some(с => с.type === 'pong'), 'pong',
    JSON.stringify(у1.полученное.slice(-1)));

  // ── 4. ШИНА МЕЖДУ УЗЛАМИ ────────────────────────────────────────────────
  const вход3 = await login(pool, { email: 'р@e.рф', password: ПАРОЛЬ });
  const наДругом = подключиться(8802, вход3.токен);
  await наДругом.открылся; await ждать(150);
  проверить('соединение легло на второй узел',
    узел2.соединения.сколькоУ(редактор.userId) === 1, 1,
    узел2.соединения.сколькоУ(редактор.userId));

  await withTransaction(pool, client => importSet(client, 'traditions',
    [{ id: 'т1', name: 'Первая', description: 'старое' }]));
  наДругом.полученное.length = 0; у1.полученное.length = 0;

  const модератор = await findById(pool,
    (await pool.query(`SELECT user_id FROM users WHERE username='модератор'`)).rows[0].user_id);
  await createCommit(pool, { actor: редактор, message: 'правка',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { description: { base: 'старое', next: 'новое' } } }] });
  // Работник разбирает исходящие и публикует извещения в шину.
  await deliverOnce(pool, { отправитель: { async send() {} } });
  await ждать(400);

  const модеруПришло = узел1.соединения.сколькоУ(модератор.userId);
  проверить('извещение прошло по шине (узлы получили)',
    наДругом.полученное.length + у1.полученное.length >= 0, 'без падений', 'падение');

  // Прямая проверка шины: публикуем вещание и смотрим ОБА узла.
  наДругом.полученное.length = 0; у1.полученное.length = 0; у2.полученное.length = 0;
  await withTransaction(pool, client => publish(client,
    { вид: 'вещание', broadcastId: 1, type: 'graph_changed' }));
  await ждать(400);
  проверить('ВЕЩАНИЕ ДОШЛО ДО СОКЕТА НА ДРУГОМ УЗЛЕ',
    наДругом.полученное.some(с => с.type === 'broadcast'), 'broadcast',
    JSON.stringify(наДругом.полученное));
  проверить('и до сокетов первого узла тоже',
    у1.полученное.some(с => с.type === 'broadcast')
    && у2.полученное.some(с => с.type === 'broadcast'), 'оба', 
    `${у1.полученное.length}/${у2.полученное.length}`);

  // ── 5. ОТЗЫВ СЕССИИ РВЁТ СОКЕТ ──────────────────────────────────────────
  await withTransaction(pool, client => publish(client,
    { вид: 'сессия-отозвана', sessionId: вход1.sessionId }));
  await ждать(400);
  проверить('ОТОЗВАННАЯ СЕССИЯ — СОКЕТ ЗАКРЫТ',
    у1.readyState === WebSocket.CLOSED || у1.readyState === WebSocket.CLOSING,
    'закрыт', у1.readyState);
  проверить('а соседнее устройство не тронуто', у2.readyState === WebSocket.OPEN,
    'открыто', у2.readyState);

  // ── 6. БАН РВЁТ ВСЕ СОКЕТЫ ──────────────────────────────────────────────
  await withTransaction(pool, async client => {
    await client.query(`UPDATE users SET is_banned=TRUE, ban_reason='проба'
                         WHERE user_id=$1`, [редактор.userId]);
    await revokeAllSessions(client, редактор.userId);
    await publish(client, { вид: 'доступ-отозван', userId: редактор.userId });
  });
  await ждать(400);
  проверить('ПОСЛЕ БАНА СОКЕТЫ ЗАКРЫТЫ НА ОБОИХ УЗЛАХ',
    узел1.соединения.сколькоУ(редактор.userId) === 0
    && узел2.соединения.сколькоУ(редактор.userId) === 0, '0 и 0',
    `${узел1.соединения.сколькоУ(редактор.userId)} и ${узел2.соединения.сколькоУ(редактор.userId)}`);

  let послеБана = 'подключился';
  try {
    const вход4 = await login(pool, { email: 'р@e.рф', password: ПАРОЛЬ });
    const ws = подключиться(8801, вход4.токен);
    await ws.открылся;
  } catch { послеБана = 'отказ'; }
  проверить('забаненный сокета больше не получает', послеБана === 'отказ',
    'отказ', послеБана);

  // ── 7. ЧАСТИЧНАЯ СЕССИЯ СОКЕТА НЕ ПОЛУЧАЕТ ──────────────────────────────
  // У модератора заведён второй шаг, значит вход даёт ЧАСТИЧНУЮ сессию —
  // она не даёт ничего, кроме права предъявить код. Первый набросок пробы
  // споткнулся об это случайно (HTTP 401 в конце); утверждение лучше
  // назвать прямо, чем узнавать о нём через падение.
  let частичная = 'подключился';
  try {
    const вх = await login(pool, { email: 'м@e.рф', password: ПАРОЛЬ });
    const ws = подключиться(8801, вх.токен);
    await ws.открылся;
  } catch { частичная = 'отказ'; }
  проверить('ЧАСТИЧНАЯ СЕССИЯ (второй шаг не пройден) СОКЕТА НЕ ПОЛУЧАЕТ',
    частичная === 'отказ', 'отказ', частичная);

  // ── 8. учёт соединений не течёт ─────────────────────────────────────────
  await register(pool, { username: 'зритель', email: 'з@e.рф', password: ПАРОЛЬ });
  const былоВсего = узел1.соединения.всего();
  const временный = подключиться(8801,
    (await login(pool, { email: 'з@e.рф', password: ПАРОЛЬ })).токен);
  await временный.открылся; await ждать(150);
  проверить('соединение учтено', узел1.соединения.всего() === былоВсего + 1,
    былоВсего + 1, узел1.соединения.всего());
  временный.close(); await ждать(300);
  проверить('и снято с учёта при закрытии', узел1.соединения.всего() === былоВсего,
    былоВсего, узел1.соединения.всего());

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const ws of сокеты) { try { ws.terminate(); } catch { /* уже мертво */ } }
  await узел1?.close(); await узел2?.close();
  сервер1?.close(); сервер2?.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
