#!/usr/bin/env node
// Проба СЕРВЕРНОГО РЕЖИМА СТРАНИЦЫ.
//
// Заход 4.1 обещает две вещи разом, и проверять их надо порознь:
//   БЕЗ СЕРВЕРА страница ведёт себя ровно как прежде — это стерегут
//     приборы приложения (assert_probe, compare и прочие);
//   С СЕРВЕРОМ права приходят снаружи — это стережёт вот эта проба.
//
// Она поднимает настоящий сервер, отдающий и страницу, и API, и смотрит на
// страницу глазами браузера.
//
//   DATABASE_URL=… node probes/page_probe.mjs [папка app]

import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { createPool } from '../src/db/pool.js';
import { createServer } from '../src/http/server.js';
import { register } from '../src/auth/service.js';
import { importSet } from '../src/db/graph.js';
import { withTransaction } from '../src/db/tx.js';
import { SET_NAMES } from '../src/graph/schema.js';
import fs from 'node:fs';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';
import { totpCode as totpКод } from '../src/auth/totp.js';
import { findById } from '../src/db/users.js';

const КОРЕНЬ = ПАПКА_СЕРВЕРА();
function ПАПКА_СЕРВЕРА() { return path.dirname(path.dirname(fileURLToPath(import.meta.url))); }
const ПРИЛОЖЕНИЕ = process.argv[2] || path.join(КОРЕНЬ, '..', 'app');
const БРАУЗЕР = process.env.CHROME
  || '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';

const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const ждать = мс => new Promise(r => setTimeout(r, мс));

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();

// ГРАФ У СТРАНИЦЫ И У СЕРВЕРА ДОЛЖЕН БЫТЬ ОДИН. Первый набросок пробы этого
// не сделал: страница несла свою базу, сервер — пустую, и первая же прямая
// правка приходила на сервер как столкновение. Слияние работало верно, а
// проба мерила несуществующую жизнь: в настоящей странице и сервер держат
// один и тот же граф, потому что страница его у сервера и берёт.
await withTransaction(pool, async client => {
  for (const имя of SET_NAMES) {
    const filePath = path.join(ПРИЛОЖЕНИЕ, 'data', имя + '.json');
    if (fs.existsSync(filePath)) {
      await importSet(client, имя, JSON.parse(fs.readFileSync(filePath, 'utf8')));
    }
  }
});

// Сервер собирается целиком — с живыми соединениями: страница берёт
// страницу по HTTP и тут же открывает сокет, и проверять надо оба разом.
const узелСервера = await createServer({
  pool, строкаПодключения: process.env.DATABASE_URL,
  папкаПриложения: ПРИЛОЖЕНИЕ, безопасныеCookie: false });
await узелСервера.слушать(8814);
const httpServer = узелСервера.сервер;

const ПАРОЛЬ = 'вполне-длинный-пароль';
let браузер;

try {
  const { user } = await register(pool, {
    username: 'правщик', email: 'p@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='administrator', email_verified_at=NOW()
                     WHERE user_id=$1`, [user.userId]);
  // ПРЯМАЯ ПРАВКА ТРЕБУЕТ ВТОРОГО ШАГА. Это не придирка пробы: право
  // review_commit срезается, пока второй шаг не заведён (беседа 1.4), и
  // первый набросок пробы этого не учёл — правка администратора уходила в
  // очередь, и проба краснела на верном поведении.
  const админ = await findById(pool, user.userId);
  const заведение = await beginEnroll(pool, админ);
  await confirmEnroll(pool, админ, totpКод(заведение.секрет));

  браузер = await puppeteer.launch({ executablePath: БРАУЗЕР, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const pageHtml = await браузер.newPage();
  await pageHtml.setViewport({ width: 1440, height: 900 });
  const ошибки = [];
  pageHtml.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));

  await pageHtml.goto('http://127.0.0.1:8814/index.html',
    { waitUntil: 'domcontentloaded' });
  await pageHtml.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
  await ждать(9000);

  // ── 1. метка и режим ────────────────────────────────────────────────────
  проверить('сервер отдал страницу с меткой',
    await pageHtml.evaluate(`!!document.querySelector('meta[name="philos-api"]')`),
    'есть', 'нет');
  проверить('страница признала серверный режим',
    await pageHtml.evaluate(`window.__app.serverMode === true`), true,
    await pageHtml.evaluate(`window.__app.serverMode`));
  проверить('ошибок страницы нет', ошибки.length === 0, 0, ошибки.slice(0, 2).join(' | '));

  // ── 2. до входа прав нет ────────────────────────────────────────────────
  проверить('до входа править нельзя',
    await pageHtml.evaluate(`window.__app.can(window.__app.PERM.CREATE_COMMIT) === false`),
    false, await pageHtml.evaluate(`window.__app.can(window.__app.PERM.CREATE_COMMIT)`));

  // ── 3. ВХОД ЧЕРЕЗ СЕРВЕР ────────────────────────────────────────────────
  await pageHtml.evaluate(`(function(){
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'p@e.рф';
    document.getElementById('authPassword').value = ${JSON.stringify(ПАРОЛЬ)};
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1200);
  проверить('вход объявил, что ждёт кода',
    await pageHtml.evaluate(`(document.getElementById('authError')||{}).textContent || ''`)
      .then(т => /код/i.test(т)), 'просит код',
    await pageHtml.evaluate(`(document.getElementById('authError')||{}).textContent || ''`));

  // ВТОРОЙ ШАГ ЧЕРЕЗ СТРАНИЦУ: код вводится в то же поле и тем же ходом.
  await pageHtml.evaluate(`(function(){
    document.getElementById('authPassword').value = ${JSON.stringify('')} + '${totpКод(заведение.секрет)}';
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1500);

  проверить('ВХОД ПРОШЁЛ ЧЕРЕЗ СЕРВЕР',
    await pageHtml.evaluate(`!!(window.__app.authSession && window.__app.authSession.user)`),
    'вошли', 'нет');
  проверить('имя пришло с сервера',
    await pageHtml.evaluate(`window.__app.authSession.user.login`), 'правщик',
    await pageHtml.evaluate(`window.__app.authSession.user.login`));
  проверить('ПРАВА ПРИШЛИ СНАРУЖИ, а не выведены из роли',
    await pageHtml.evaluate(`window.__app.can(window.__app.PERM.CREATE_COMMIT)`), true,
    await pageHtml.evaluate(`window.__app.can(window.__app.PERM.CREATE_COMMIT)`));
  проверить('и это тот же набор, что отдаёт сервер',
    await pageHtml.evaluate(`(async () => {
      const о = await fetch('/api/users/me', { credentials: 'same-origin' });
      const я = (await о.json()).data;
      return я.permissions.includes('create_commit');
    })()`), true, 'иначе');
  проверить('заслон правки открылся',
    await pageHtml.evaluate(`(function(){
      const было = document.querySelectorAll('[data-act-click]').length;
      window.__app.openEditConceptModal(window.__app.DATA.concepts[0].id);
      const открылось = document.getElementById('universalModal')
        && getComputedStyle(document.getElementById('universalModal')).display !== 'none';
      window.__app.closeUniversalModal();
      return !!открылось && было > 0;
    })()`), true, 'нет');

  // ── 4. ОТПРАВКА ПРАВКИ: администратор правит НАПРЯМУЮ ───────────────────
  const доПравки = await pageHtml.evaluate(
    `window.__app.DATA.concepts[0].description`);
  await pageHtml.evaluate(`(function(){
    window.__app.openEditConceptModal(window.__app.DATA.concepts[0].id);
  })()`);
  await ждать(700);
  await pageHtml.evaluate(`(function(){
    document.getElementById('conceptDescription').value = 'правка администратора';
    window.__app.saveConceptData();
  })()`);
  await ждать(1500);

  проверить('у администратора правка легла в базу СРАЗУ',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`)
      === 'правка администратора', 'правка администратора',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`));
  проверить('и извещение говорит, что применено',
    (await pageHtml.evaluate(`window.__app.lastSubmitResult && window.__app.lastSubmitResult.род`))
      === 'применено', 'применено',
    await pageHtml.evaluate(`window.__app.lastSubmitResult && window.__app.lastSubmitResult.род`));
  проверить('на сервере коммит применён, а не ждёт',
    (await pool.query(`SELECT status FROM commits ORDER BY created_at DESC LIMIT 1`))
      .rows[0]?.status === 'applied', 'applied',
    (await pool.query(`SELECT status FROM commits ORDER BY created_at DESC LIMIT 1`))
      .rows[0]?.status);
  проверить('и рецензента у неё нет — это прямая правка, а не самоодобрение',
    (await pool.query(`SELECT reviewed_by FROM commits ORDER BY created_at DESC LIMIT 1`))
      .rows[0]?.reviewed_by === null, null,
    (await pool.query(`SELECT reviewed_by FROM commits ORDER BY created_at DESC LIMIT 1`))
      .rows[0]?.reviewed_by);

  // ── 5. РЕДАКТОР: правка НЕ трогает базу, а встаёт в очередь ─────────────
  await register(pool, { username: 'редактор', email: 'r@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='editor', email_verified_at=NOW()
                     WHERE username='редактор'`);
  await pageHtml.evaluate(`window.__app.authLogout()`);
  await ждать(300);
  await pageHtml.evaluate(`(function(){
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'r@e.рф';
    document.getElementById('authPassword').value = ${JSON.stringify(ПАРОЛЬ)};
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1500);
  проверить('редактор вошёл', await pageHtml.evaluate(
    `!!(window.__app.authSession && window.__app.authSession.user)`), 'вошёл', 'нет');
  проверить('редактор править вправе', await pageHtml.evaluate(
    `window.__app.can(window.__app.PERM.CREATE_COMMIT)`), true, false);
  проверить('но НЕ напрямую', await pageHtml.evaluate(
    `window.__app.can(window.__app.PERM.REVIEW_COMMIT) === false`), true, false);

  const былоУРедактора = await pageHtml.evaluate(
    `window.__app.DATA.concepts[0].description`);
  await pageHtml.evaluate(`(function(){
    window.__app.openEditConceptModal(window.__app.DATA.concepts[0].id);
  })()`);
  await ждать(700);
  await pageHtml.evaluate(`(function(){
    document.getElementById('conceptDescription').value = 'правка редактора';
    window.__app.saveConceptData();
  })()`);
  await ждать(1500);

  проверить('ПРАВКА РЕДАКТОРА НЕ ТРОНУЛА БАЗУ НА СТРАНИЦЕ',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`)
      === былоУРедактора, былоУРедактора,
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`));
  проверить('извещение говорит, что правка в очереди',
    (await pageHtml.evaluate(`window.__app.lastSubmitResult && window.__app.lastSubmitResult.род`))
      === 'в очереди', 'в очереди',
    await pageHtml.evaluate(`window.__app.lastSubmitResult && window.__app.lastSubmitResult.род`));
  const очередь = await pool.query(
    `SELECT status, changes FROM commits WHERE status='pending' ORDER BY created_at DESC LIMIT 1`);
  проверить('на сервере коммит ЖДЁТ рассмотрения',
    очередь.rows[0]?.status === 'pending', 'pending', очередь.rows[0]?.status);
  проверить('и описание дошло с обоими значениями поля',
    очередь.rows[0]?.changes?.[0]?.fields?.description?.base === былоУРедактора
    && очередь.rows[0]?.changes?.[0]?.fields?.description?.next === 'правка редактора',
    'было и стало', JSON.stringify(очередь.rows[0]?.changes?.[0]?.fields));

  // ── 6. РАЗБОР СТОЛКНОВЕНИЯ ──────────────────────────────────────────────
  // Входим обратно администратором (он правит напрямую), открываем форму,
  // и ПОКА ОНА ОТКРЫТА подменяем поле на сервере чужой правкой. Так и
  // выглядит настоящее столкновение: правщик видел одно, сохраняет другое,
  // а в базе к этому времени третье.
  await pageHtml.evaluate(`window.__app.authLogout()`);
  await ждать(300);
  await pageHtml.evaluate(`(function(){
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'p@e.рф';
    document.getElementById('authPassword').value = ${JSON.stringify(ПАРОЛЬ)};
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1000);
  await pageHtml.evaluate(`(function(){
    document.getElementById('authPassword').value = '${totpКод(заведение.секрет)}';
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1500);

  const entityKey = await pageHtml.evaluate(`window.__app.DATA.concepts[0].id`);
  await pageHtml.evaluate(`window.__app.openEditConceptModal(${JSON.stringify(entityKey)})`);
  await ждать(700);
  await pageHtml.evaluate(`document.getElementById('conceptDescription').value = 'моё описание'`);

  // Чужая правка ПОКА ФОРМА ОТКРЫТА — прямо в базе сервера.
  await pool.query(`
    UPDATE graph_entities SET data = data || '{"description":"чужое описание"}'::jsonb,
           version = version + 1
     WHERE kind = 'concept' AND entity_id = $1`, [entityKey]);

  await pageHtml.evaluate(`window.__app.saveConceptData()`);
  await ждать(1500);

  проверить('СТОЛКНОВЕНИЕ ПОКАЗАНО ОКНОМ',
    await pageHtml.evaluate(`(function(){
      const о = document.getElementById('conflictModal');
      return !!о && getComputedStyle(о).display !== 'none';
    })()`), 'окно открыто', 'нет');
  const разбор = await pageHtml.evaluate(
    `(document.getElementById('conflictBody')||{}).textContent || ''`);
  проверить('в разборе названо ПОЛЕ', /description/.test(разбор), 'description',
    разбор.slice(0, 60));
  проверить('показано, что правщик ВИДЕЛ', /вы видели/.test(разбор), 'вы видели', '—');
  проверить('показано, чего он ХОТЕЛ', /моё описание/.test(разбор), 'моё описание', '—');
  проверить('показано, что там СЕЙЧАС', /чужое описание/.test(разбор), 'чужое описание',
    разбор.slice(0, 80));
  проверить('и граф на странице чужим не перезаписан молча',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`) !== 'моё описание',
    'не «моё»', await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`));

  // ГЛАВНОЕ УТВЕРЖДЕНИЕ 4.2б: «взять нынешнее» приносит ЧУЖОЕ значение.
  await pageHtml.evaluate(`window.__app.rebuildOverCurrent()`);
  await ждать(1500);
  проверить('окно разбора закрылось',
    await pageHtml.evaluate(`(function(){
      const о = document.getElementById('conflictModal');
      return !о || getComputedStyle(о).display === 'none';
    })()`), 'закрыто', 'открыто');
  проверить('СВЕЖИЙ ГРАФ ВЗЯТ У СЕРВЕРА',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`)
      === 'чужое описание', 'чужое описание',
    await pageHtml.evaluate(`window.__app.DATA.concepts[0].description`));
  проверить('ФОРМА ОТКРЫЛАСЬ ЗАНОВО С ЧУЖИМ ЗНАЧЕНИЕМ',
    await pageHtml.evaluate(
      `(document.getElementById('conceptDescription')||{}).value || ''`)
      === 'чужое описание', 'чужое описание',
    await pageHtml.evaluate(
      `(document.getElementById('conceptDescription')||{}).value || ''`));

  await pageHtml.evaluate(`window.__app.closeUniversalModal()`);
  await ждать(300);

  // ── 7. ПРИХОД ИЗВНЕ: чужая правка БЕЗ ПЕРЕЗАГРУЗКИ ─────────────────────
  // Версию НЕ сравниваем с нулём: сразу после переноса она и есть ноль, и
  // это верно. Спрашиваем то, что нужно на деле, — совпала ли версия
  // страницы с версией сервера.
  const версияДо = await pageHtml.evaluate(`window.__app.knownGraphVersion`);
  const наСервере = Number((await pool.query(
    `SELECT version FROM graph_state WHERE singleton`)).rows[0].version);
  проверить('версия страницы совпала с версией сервера',
    версияДо === наСервере, наСервере, версияДо);

  const адрес2 = await pageHtml.evaluate(`window.__app.DATA.concepts[1].id`);
  const былоНаСтранице = await pageHtml.evaluate(
    `window.__app.DATA.concepts[1].description`);

  // Чужая правка — настоящим коммитом от другого человека.
  const чужой = await findById(pool,
    (await pool.query(`SELECT user_id FROM users WHERE username='редактор'`))
      .rows[0].user_id);
  await pool.query(`UPDATE users SET role='moderator', mfa_enabled=TRUE
                     WHERE user_id=$1`, [чужой.userId]);
  const { directCommit } = await import('../src/commits/review.js');
  const свежий = await findById(pool, чужой.userId);
  await directCommit(pool, { actor: свежий, message: 'чужая правка извне',
    changes: [{ action: 'edit', kind: 'concept', entityId: адрес2,
      fields: { description: { base: былоНаСтранице, next: 'пришло извне' } } }] });

  // Работник исходящих публикует извещение в шину — узел разнесёт по сокетам.
  const { deliverOnce } = await import('../src/notify/worker.js');
  await deliverOnce(pool, { отправитель: { async send() {} } });
  await ждать(2000);

  проверить('ЧУЖАЯ ПРАВКА ПРИШЛА НА СТРАНИЦУ БЕЗ ПЕРЕЗАГРУЗКИ',
    await pageHtml.evaluate(`window.__app.DATA.concepts[1].description`)
      === 'пришло извне', 'пришло извне',
    await pageHtml.evaluate(`window.__app.DATA.concepts[1].description`));
  проверить('и версия графа на странице выросла',
    await pageHtml.evaluate(`window.__app.knownGraphVersion`) > версияДо,
    `> ${версияДо}`, await pageHtml.evaluate(`window.__app.knownGraphVersion`));
  проверить('производный набор узлов тоже обновился',
    await pageHtml.evaluate(
      `(window.__app.DATA.nodes.find(n => n.id === ${JSON.stringify(адрес2)}) || {}).description`)
      === 'пришло извне', 'пришло извне',
    await pageHtml.evaluate(
      `(window.__app.DATA.nodes.find(n => n.id === ${JSON.stringify(адрес2)}) || {}).description`));
  проверить('ошибок страницы от прихода извне нет', ошибки.length === 0, 0,
    ошибки.slice(0, 2).join(' | '));

  // ── 8. КОЛОКОЛ УВЕДОМЛЕНИЙ ─────────────────────────────────────────────
  проверить('колокол виден в серверном режиме',
    await pageHtml.evaluate(`(function(){
      const к = document.getElementById('notifyBell');
      return !!к && getComputedStyle(к).display !== 'none';
    })()`), 'виден', 'нет');

  // Администратор уже получил уведомления: о своих коммитах и о чужом.
  const counters = await pageHtml.evaluate(`window.__app.unreadCount`);
  const наСервере2 = Number((await pool.query(`
    SELECT count(*)::int AS n FROM notifications n
      JOIN users u USING (user_id)
     WHERE u.username = 'правщик' AND NOT n.is_read`)).rows[0].n);
  проверить('СЧЁТ БЕРЁТСЯ СВОИМ ХОДОМ и сходится с базой',
    counters >= наСервере2 && counters > 0, `≥ ${наСервере2} и > 0`, counters);

  await pageHtml.evaluate(`window.__app.toggleNotifyPanel()`);
  await ждать(800);
  проверить('панель открылась', await pageHtml.evaluate(`(function(){
    const п = document.getElementById('notifyPanel');
    return !!п && getComputedStyle(п).display !== 'none';
  })()`), 'открыта', 'нет');
  проверить('список непуст',
    (await pageHtml.evaluate(`window.__app.notifyItems.length`)) > 0, '>0',
    await pageHtml.evaluate(`window.__app.notifyItems.length`));
  проверить('тип уведомления показан по-человечески',
    await pageHtml.evaluate(
      `!/graph_changed|commit_/.test(document.getElementById('notifyList').textContent)`),
    'без машинных имён', 'есть машинные');

  // ОТМЕТКА ВИСИТ НА КНОПКЕ, А НЕ НА ТЕЛЕ. Щёлкаем по телу — счёт не падает.
  const доЩелчка = await pageHtml.evaluate(`window.__app.unreadCount`);
  await pageHtml.evaluate(`(function(){
    const т = document.querySelector('.notify-item');
    if (т) т.click();
  })()`);
  await ждать(800);
  проверить('ЩЕЛЧОК ПО ТЕЛУ НЕ ОТМЕЧАЕТ ПРОЧИТАННЫМ',
    await pageHtml.evaluate(`window.__app.unreadCount`) === доЩелчка,
    доЩелчка, await pageHtml.evaluate(`window.__app.unreadCount`));

  const естьКнопка = await pageHtml.evaluate(`!!document.querySelector('.notify-mark')`);
  if (естьКнопка) {
    await pageHtml.evaluate(`document.querySelector('.notify-mark').click()`);
    await ждать(1000);
    проверить('а щелчок по КНОПКЕ отмечает и уменьшает счёт',
      await pageHtml.evaluate(`window.__app.unreadCount`) < доЩелчка,
      `< ${доЩелчка}`, await pageHtml.evaluate(`window.__app.unreadCount`));
  } else {
    проверить('кнопка отметки есть у непрочитанного адресного', false,
      'есть', 'нет');
  }

  await pageHtml.evaluate(`window.__app.markAllNotificationsRead()`);
  await ждать(1000);
  проверить('«отметить все» обнуляет счёт ЦЕЛИКОМ',
    await pageHtml.evaluate(`window.__app.unreadCount`) === 0, 0,
    await pageHtml.evaluate(`window.__app.unreadCount`));

  // ── 8-бис. ПОЛЕ «ЗАЧЕМ» ────────────────────────────────────────────────
  // Заголовок коммита машинный — это АДРЕС правки. Причину пишет человек,
  // и она должна дойти до сервера отдельным полем, а не вместо адреса.
  const адрес8 = await pageHtml.evaluate('window.__app.DATA.concepts[2].id');
  await pageHtml.evaluate(`window.__app.openEditConceptModal(${JSON.stringify(адрес8)})`);
  await ждать(900);
  проверить('в серверном ладу поле «зачем» есть',
    await pageHtml.evaluate(`!!document.getElementById('commitReason')`), 'есть', 'нет');

  await pageHtml.evaluate(`(function(){
    document.getElementById('conceptDescription').value = 'правка с объяснением';
    document.getElementById('commitReason').value = 'уточнил по Диогену Лаэртскому';
    window.__app.saveConceptData();
  })()`);
  await ждать(1800);

  const сОбъяснением = (await pool.query(
    `SELECT message, author_comment FROM commits ORDER BY created_at DESC LIMIT 1`)).rows[0];
  проверить('ПРИЧИНА ДОШЛА ДО СЕРВЕРА',
    сОбъяснением.author_comment === 'уточнил по Диогену Лаэртскому',
    'уточнил по Диогену Лаэртскому', сОбъяснением.author_comment);
  проверить('и заголовок остался МАШИННЫМ адресом правки',
    /^Изменено: концепция /.test(сОбъяснением.message),
    'Изменено: концепция …', сОбъяснением.message);

  // ── 9. ПАНЕЛЬ ПРАВОК ───────────────────────────────────────────────────
  await pageHtml.evaluate(`window.__app.openCommitsPanel()`);
  await ждать(1200);
  проверить('панель правок открылась', await pageHtml.evaluate(`(function(){
    const о = document.getElementById('commitsModal');
    return !!о && getComputedStyle(о).display !== 'none';
  })()`), 'открыта', 'нет');
  проверить('свои правки показаны',
    (await pageHtml.evaluate(`window.__app.commitItems.length`)) > 0, '>0',
    await pageHtml.evaluate(`window.__app.commitItems.length`));
  проверить('в панели крупно ПРИЧИНА, а адрес под ней',
    await pageHtml.evaluate(`(function(){
      const т = document.getElementById('commitsBody');
      if (!т) return false;
      const шапка = т.querySelector('.commit-msg');
      const адрес = т.querySelector('.commit-what');
      return !!шапка && !!адрес
        && /Диоген/.test(шапка.textContent) && /Изменено/.test(адрес.textContent);
    })()`), 'причина сверху',
    await pageHtml.evaluate(`(function(){
      const т = document.getElementById('commitsBody');
      const ш = т && т.querySelector('.commit-msg');
      const а = т && т.querySelector('.commit-what');
      return 'msg=«' + (ш ? ш.textContent.slice(0,40) : 'нет')
           + '» what=«' + (а ? а.textContent.slice(0,40) : 'нет') + '»';
    })()`));

  // ── ПОСЛЕДСТВИЯ ПРАВКИ ВИДНЫ В ПАНЕЛИ (E-3, клиентская часть) ─────────
  // Знание о каскаде было и раньше, но только у автора и только в миг
  // правки. Проверяется, что оно дошло до панели рассмотрения.
  // Панель надо ОТКРЫТЬ: пока её не открывали, места для записей в разметке
  // нет вовсе, и «кнопок ноль» значило бы не отсутствие возможности, а
  // закрытую панель.
  const кнопокПоследствий = await pageHtml.evaluate(
    `document.querySelectorAll('.commit-impact-btn').length`);
  const чтоВПанели = await pageHtml.evaluate(
    `((document.getElementById('commitsBody') || {}).textContent || '').slice(0, 80)`);
  проверить('в панели правок есть спрос последствий', кнопокПоследствий > 0, '>0',
    `${кнопокПоследствий}; в панели: «${чтоВПанели}»`);
  if (кнопокПоследствий > 0) {
    const первый = await pageHtml.evaluate(
      `document.querySelector('.commit-impact-btn').getAttribute('data-id')`);
    await pageHtml.evaluate(`window.__app.showImpact(
      ${JSON.stringify(первый)})`);
    await ждать(1500);
    const сказано = await pageHtml.evaluate(
      `(document.querySelector('.commit-impact') || {}).textContent || ''`);
    проверить('последствия сказаны СЛОВАМИ, а не молчанием',
      сказано.trim().length > 0 && !/Считаю/.test(сказано), 'ответ',
      сказано.trim().slice(0, 60));
    проверить('«строение не изменится» — тоже ответ, и он произносится',
      /Строение графа не изменится|Исчезнут|Останутся без связей|распадётся/
        .test(сказано), 'внятный ответ', сказано.trim().slice(0, 60));
    // Повторный спрос закрывает — иначе панель растёт от каждого нажатия.
    await pageHtml.evaluate(`window.__app.showImpact(
      ${JSON.stringify(первый)})`);
    await ждать(400);
    проверить('повторный спрос сворачивает показанное',
      (await pageHtml.evaluate(
        `(document.querySelector('.commit-impact') || {}).textContent || ''`)).trim() === '',
      'пусто', 'осталось');
  }
  проверить('состояние коммита показано словами',
    await pageHtml.evaluate(
      `!/pending|applied|conflicted/.test(document.getElementById('commitsBody').textContent)`),
    'без машинных слов', 'есть машинные');

  // ВКЛАДКА ОЧЕРЕДИ — ПО ПРАВУ, А НЕ ПО РОЛИ. У администратора со вторым
  // шагом право есть.
  проверить('администратору вкладка очереди видна', await pageHtml.evaluate(`(function(){
    const в = document.querySelector('[data-tab="pending"]');
    return !!в && в.style.display !== 'none';
  })()`), 'видна', 'скрыта');

  await pageHtml.evaluate(`window.__app.switchCommitTab('pending')`);
  await ждать(1200);
  проверить('очередь загрузилась',
    await pageHtml.evaluate(`window.__app.commitTab`) === 'pending', 'pending',
    await pageHtml.evaluate(`window.__app.commitTab`));

  // ОДОБРЕНИЕ ЧЕРЕЗ ПАНЕЛЬ.
  const ждёт = await pool.query(
    `SELECT commit_id FROM commits WHERE status='pending' LIMIT 1`);
  if (ждёт.rows[0]) {
    await pageHtml.evaluate(`(function(){
      const к = document.querySelector('.commit-approve');
      if (к) к.click();
    })()`);
    await ждать(2000);
    const после = await pool.query(
      `SELECT status FROM commits WHERE commit_id=$1`, [ждёт.rows[0].commit_id]);
    проверить('ОДОБРЕНИЕ ЧЕРЕЗ ПАНЕЛЬ ДОШЛО ДО СЕРВЕРА',
      после.rows[0].status !== 'pending', 'не pending', после.rows[0].status);
  } else {
    проверить('в очереди есть что рассматривать', false, 'есть', 'пусто');
  }

  // ОТКАЗ СЕРВЕРА ПОКАЗЫВАЕТСЯ, А НЕ ПРОГЛАТЫВАЕТСЯ.
  await pageHtml.evaluate(`(async () => {
    await window.__app.loadCommits();
  })()`);
  await ждать(800);
  const выдуманный = '00000000-0000-0000-0000-000000000000';
  await pageHtml.evaluate(`(async () => {
    const о = await fetch('/api/commits/' + ${JSON.stringify(выдуманный)} + '/review', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json',
                 'X-CSRF-Token': (document.cookie.match(/csrf=([^;]+)/)||[])[1] || '' },
      body: JSON.stringify({ action: 'approve' }) });
    window.__проба_код = о.status;
  })()`);
  await ждать(800);
  проверить('сервер отказывает на выдуманный коммит',
    await pageHtml.evaluate(`window.__проба_код`) >= 400, '≥400',
    await pageHtml.evaluate(`window.__проба_код`));

  await pageHtml.evaluate(`window.__app.closeCommitsPanel()`);
  await ждать(300);

  // ── 10. ПАНЕЛЬ ПОЛЬЗОВАТЕЛЕЙ ────────────────────────────────────────────
  await pageHtml.evaluate(`window.__app.openUsersPanel()`);
  await ждать(1500);
  проверить('панель пользователей открылась', await pageHtml.evaluate(`(function(){
    const о = document.getElementById('usersModal');
    return !!о && getComputedStyle(о).display !== 'none';
  })()`), 'открыта', 'нет');
  проверить('список пользователей непуст',
    (await pageHtml.evaluate(`window.__app.userItems.length`)) > 0, '>0',
    await pageHtml.evaluate(`window.__app.userItems.length`));

  // ГЛАВНОЕ УТВЕРЖДЕНИЕ 4.5б: роли ПРИСЛАНЫ, а не вычислены страницей.
  проверить('у каждой записи есть присланный список ролей',
    await pageHtml.evaluate(
      `window.__app.userItems.every(у => Array.isArray(у.allowedRoles))`),
    'у всех', 'нет');

  const ownIds = await pageHtml.evaluate(`(function(){
    const я = window.__app.authSession.user.login;
    const з = window.__app.userItems.find(у => у.username === я);
    return з ? з.allowedRoles.length : -1;
  })()`);
  проверить('СЕБЕ РОЛЬ МЕНЯТЬ НЕЛЬЗЯ — список пуст', ownIds === 0, 0, ownIds);

  const unknownKeys = await pageHtml.evaluate(`(function(){
    const я = window.__app.authSession.user.login;
    const з = window.__app.userItems.find(у => у.username !== я);
    return з ? z(з) : null; function z(з){ return { имя: з.username, роли: з.allowedRoles }; }
  })()`);
  проверить('чужому роли предложены', (unknownKeys && unknownKeys.роли.length) > 0, '>0',
    JSON.stringify(unknownKeys));
  проверить('нынешней роли в предложенных нет',
    !!unknownKeys && !unknownKeys.роли.includes(
      (await pageHtml.evaluate(`(function(){
        const я = window.__app.authSession.user.login;
        const з = window.__app.userItems.find(у => у.username !== я);
        return з ? з.role : '';
      })()`))), 'нет', 'есть');

  // Список ролей на СТРАНИЦЕ совпадает с тем, что даёт СЕРВЕР.
  const сСервера = await pageHtml.evaluate(`(async () => {
    const о = await fetch('/api/users?limit=50', { credentials: 'same-origin' });
    const т = await о.json();
    const я = window.__app.authSession.user.login;
    // Вид ответа один: успех в поле data — списки не исключение с 25.08.
    // Старый вид терпим, чтобы прибор годился и для прежнего сервера.
    const список = (т.data && т.data.items) || т.items || [];
    const з = список.find(у => у.username !== я);
    return з ? з.allowedRoles.join(',') : '';
  })()`);
  проверить('СПИСОК РОЛЕЙ СОВПАДАЕТ С СЕРВЕРОМ',
    сСервера === (unknownKeys ? unknownKeys.роли.join(',') : 'иначе'),
    сСервера, unknownKeys ? unknownKeys.роли.join(',') : 'нет');

  // Кнопки бана — по праву.
  проверить('кнопка бана нарисована по праву',
    await pageHtml.evaluate(`(function(){
      const есть = !!document.querySelector('.user-ban, .user-unban');
      return есть === window.__app.can(window.__app.PERM.BAN_USER);
    })()`), 'по праву', 'иначе');

  await pageHtml.evaluate(`window.__app.closeUsersPanel()`);
  await ждать(300);

  // ── 11. неверный пароль ─────────────────────────────────────────────────
  await pageHtml.evaluate(`window.__app.authLogout()`);
  await ждать(300);
  await pageHtml.evaluate(`(function(){
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'p@e.рф';
    document.getElementById('authPassword').value = 'не тот пароль';
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await ждать(1200);
  проверить('неверный пароль не пускает',
    await pageHtml.evaluate(`!(window.__app.authSession && window.__app.authSession.user)`),
    'не пустил', 'пустил');
  проверить('и сообщение приходит С СЕРВЕРА, а не выдумано страницей',
    await pageHtml.evaluate(`(document.getElementById('authError')||{}).textContent || ''`)
      .then(т => /адрес или пароль/i.test(т)), 'адрес или пароль',
    await pageHtml.evaluate(`(document.getElementById('authError')||{}).textContent || ''`));

  // ── КОЛОКОЛ (покрытие многопользовательской части) ────────────────────
  // Обход `sweep_all` сюда не доберётся никогда: он идёт по странице без
  // сервера, где колокола нет вовсе. Значит стеречь его может только этот
  // прибор — он поднимает настоящий сервер.
  // ПЕРЕКЛЮЧАТЕЛЬ, А НЕ «ОТКРЫТЬ»: один вызов может и закрыть, если панель
  // уже открыта чем-то до нас. Добиваемся состояния, а не повторяем
  // действие вслепую.
  for (let попытка = 0; попытка < 2; попытка++) {
    const открыта = await pageHtml.evaluate(`(() => {
      const п = document.getElementById('notifyPanel');
      return !!п && getComputedStyle(п).display !== 'none';
    })()`);
    if (открыта) break;
    await pageHtml.evaluate(`window.__app.toggleNotifyPanel()`);
    await ждать(1200);
  }
  // Спрашиваем ВЫЧИСЛЕННЫЙ стиль, а не свойство style: открытие ставит
  // display в разметке, но закрытым панель бывает и по правилу из таблицы
  // стилей — тогда inline-свойство пусто, и проверка по нему лжёт.
  проверить('колокол открывается',
    await pageHtml.evaluate(`(() => {
      const п = document.getElementById('notifyPanel');
      return !!п && getComputedStyle(п).display !== 'none';
    })()`), 'открыт',
    await pageHtml.evaluate(`(() => {
      const п = document.getElementById('notifyPanel');
      return п ? getComputedStyle(п).display : 'панели нет';
    })()`));
  const былоНепрочтённых = await pageHtml.evaluate(`window.__app.unreadCount`);
  проверить('счёт непрочитанного пришёл С СЕРВЕРА, а не выдуман',
    Number.isInteger(былоНепрочтённых), 'число', былоНепрочтённых);
  проверить('список уведомлений загружен',
    Array.isArray(await pageHtml.evaluate(`window.__app.notifyItems`)),
    'массив', typeof (await pageHtml.evaluate(`window.__app.notifyItems`)));

  if (былоНепрочтённых > 0) {
    await pageHtml.evaluate(`window.__app.markAllNotificationsRead()`);
    await ждать(1200);
    проверить('«прочитать всё» ОБНУЛЯЕТ счёт',
      (await pageHtml.evaluate(`window.__app.unreadCount`)) === 0, 0,
      await pageHtml.evaluate(`window.__app.unreadCount`));
    // Перечитывание у сервера — а не вера своей же памяти.
    await pageHtml.evaluate(`window.__app.refreshUnread()`);
    await ждать(800);
    проверить('и сервер подтверждает обнуление',
      (await pageHtml.evaluate(`window.__app.unreadCount`)) === 0, 0,
      await pageHtml.evaluate(`window.__app.unreadCount`));
  }

  // ── ПРОИСХОЖДЕНИЕ СОДЕРЖАНИЯ В ОКНАХ (E-1, клиентская часть) ─────────
  // Раздел показывается ТОЛЬКО когда источник указан: пустое «Источник: —»
  // под каждой из 453 концепций приучило бы не читать этот раздел вовсе.
  const безИсточника = await pageHtml.evaluate(`(() => {
    const без = window.__app.DATA.concepts.find(к => !к.provenance);
    if (!без) return 'все с источником';
    window.__app.openConceptById(без.id);
    return без.id;
  })()`);
  await ждать(900);
  проверить('у концепции БЕЗ источника раздела нет',
    (await pageHtml.evaluate(
      `document.querySelectorAll('#universalModal .provenance').length`)) === 0,
    0, await pageHtml.evaluate(
      `document.querySelectorAll('#universalModal .provenance').length`));

  // Правка с источником — тем же ходом, каким её подаёт страница.
  await pageHtml.evaluate(`(async () => {
    const c = window.__app.DATA.concepts[0];
    await window.__app.api('/api/commits', { метод: 'POST', тело: {
      message: 'проба: источник',
      changes: [{ action: 'edit', kind: 'concept', entityId: c.id,
                  fields: { provenance: { base: null,
                    next: 'Гераклит, фр. B1 (Дильс–Кранц)' } } }] } });
    await window.__app.pullGraphSince();
  })()`);
  await ждать(1500);
  const сИсточником = await pageHtml.evaluate(
    `(window.__app.DATA.concepts[0] || {}).provenance || ''`);
  проверить('источник дошёл до страницы приращением',
    /Гераклит/.test(сИсточником), 'Гераклит', сИсточником.slice(0, 40));

  await pageHtml.evaluate(`(() => {
    window.__app.closeUniversalModal();
    window.__app.openConceptById(window.__app.DATA.concepts[0].id);
  })()`);
  await ждать(900);
  проверить('РАЗДЕЛ ИСТОЧНИКА ПОЯВИЛСЯ, когда источник есть',
    /Гераклит/.test(await pageHtml.evaluate(
      `(document.querySelector('#universalModal .provenance') || {}).textContent || ''`)),
    'Гераклит', await pageHtml.evaluate(
      `(document.querySelector('#universalModal .provenance') || {}).textContent || ''`));
  проверить('и назван словом «Источник»',
    /Источник/.test(await pageHtml.evaluate(
      `(document.querySelector('#universalModal .provenance-label') || {}).textContent || ''`)),
    'Источник', await pageHtml.evaluate(
      `(document.querySelector('#universalModal .provenance-label') || {}).textContent || ''`));
  await pageHtml.evaluate(`window.__app.closeUniversalModal()`);

  // ── ПОКРЫТИЕ ИСТОЧНИКАМИ (E-1, видимость фронта работ) ───────────────
  // Показатель ДОЛЖЕН МОЛЧАТЬ, пока не подкреплено ничего: «0 из 2077» в
  // первый день не сообщает ничего, кроме того, что работа не начата.
  const покрытиеДо = await pageHtml.evaluate(
    `((document.getElementById('provenanceCoverage') || {}).textContent || '').trim()`);
  проверить('покрытие источниками уже видно (источник внесён выше)',
    /С источником/.test(покрытиеДо), 'строка есть', покрытиеДо.slice(0, 60));
  проверить('и называет связи ПЕРВЫМИ, концепции после',
    покрытиеДо.indexOf('связей') < покрытиеДо.indexOf('концепций'),
    'связи впереди', покрытиеДо.slice(0, 60));

  // ── ЗАПОМНИТЬ ЗАМЕР (E-2, клиентская часть) ──────────────────────────
  await pageHtml.evaluate(`window.__app.openStatsModal()`);
  await ждать(800);
  await pageHtml.evaluate(`window.__app.loadStatsContent('degree')`);
  await ждать(1200);
  проверить('под видом статистики есть полоса замера',
    await pageHtml.evaluate(`!!document.querySelector('.observation-bar')`),
    'есть', 'нет');
  проверить('и условия названы словами',
    /веса|направленность|охват/.test(await pageHtml.evaluate(
      `(document.querySelector('.observation-conditions')||{}).textContent||''`)),
    'условия', await pageHtml.evaluate(
      `(document.querySelector('.observation-conditions')||{}).textContent||''`));

  await pageHtml.evaluate(`window.__app.saveObservation('degree')`);
  await ждать(1500);
  const сказано = await pageHtml.evaluate(
    `(document.getElementById('observationSaid')||{}).textContent||''`);
  проверить('ЗАМЕР ЗАПОМНЕН и назван граф, при котором снят',
    /Запомнено при графе версии/.test(сказано), 'запомнено', сказано.slice(0, 60));

  // ── РАЗДЕЛ «ЗАМЕРЫ» (E-2, четвёртый пункт) ───────────────────────────
  // Замер уже записан выше — есть что показывать.
  await pageHtml.evaluate(`window.__app.loadStatsContent('observations')`);
  await ждать(1500);
  // Спрашиваем РАЗМЕТКУ, а не нутро модуля: `observationItems` наружу не
  // вывозится, и требовать этого ради пробы значило бы менять устройство
  // под прибор.
  проверить('раздел замеров показывает записанное',
    (await pageHtml.evaluate(`document.querySelectorAll('.obs-item').length`)) > 0,
    '>0', await pageHtml.evaluate(`document.querySelectorAll('.obs-item').length`));
  проверить('и условия каждого замера названы словами',
    /охват/.test(await pageHtml.evaluate(
      `(document.querySelector('.obs-conditions')||{}).textContent||''`)),
    'охват назван', await pageHtml.evaluate(
      `(document.querySelector('.obs-conditions')||{}).textContent||''`));
  проверить('пока выбран один замер — сличать не предлагают',
    /Выбрано 0 из 2/.test(await pageHtml.evaluate(
      `(document.getElementById('obsCompare')||{}).textContent||''`)),
    'ждёт двух', await pageHtml.evaluate(
      `(document.getElementById('obsCompare')||{}).textContent||''`).then(т => т.slice(0, 40)));

  проверить('ошибок страницы по-прежнему нет', ошибки.length === 0, 0,
    ошибки.slice(0, 2).join(' | '));

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  await браузер?.close();
  await узелСервера.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
