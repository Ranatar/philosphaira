#!/usr/bin/env node
// Проба ШТАТНОГО ЗАПУСКА. Требует живой базы.
//
// Спрашивает то, что до сих пор знал только тот, кто читал пробы: можно ли
// поднять систему с пустого места штатными командами и войти в неё.
//
//   DATABASE_URL=… MFA_SECRET_KEY=… node probes/bootstrap_probe.mjs

import { execFile, execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { createPool } from '../src/db/pool.js';
import { findByEmailWithSecret } from '../src/db/users.js';
import { counts } from '../src/db/graph.js';
import { beginBootstrapAdmin } from '../src/db/users.js';
import { verifyPassword } from '../src/auth/password.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ПРИЛОЖЕНИЕ = path.join(КОРЕНЬ, '..', 'app');
const ПАРОЛЬ = 'вполне-длинный-пароль-запуска';

const проверки = [];
const проверить = (setName, finite, ждали, вышло) =>
  проверки.push({ имя: setName, годно: !!finite, ждали, вышло });
const ждать = мс => new Promise(r => setTimeout(r, мс));

/** Запустить команду и вернуть исход, не роняя пробу. */
function прогнать(файл, доводы = [], доп = {}) {
  try {
    const вывод = execFileSync('node', [path.join(КОРЕНЬ, 'scripts', файл), ...доводы],
      { encoding: 'utf8', env: { ...process.env, ...доп }, stdio: 'pipe' });
    return { код: 0, вывод };
  } catch (e) {
    return { код: e.status ?? 1, вывод: (e.stdout ?? '') + (e.stderr ?? '') };
  }
}

const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();

try {
  // ── 1. ПЕРЕНОС ГРАФА ────────────────────────────────────────────────────
  const первый = прогнать('import-graph.mjs', [path.join(ПРИЛОЖЕНИЕ, 'data')]);
  проверить('перенос графа на пустой базе проходит', первый.код === 0, 0, первый.код);
  const сколько = await counts(pool);
  проверить('граф в базе', (сколько.concepts ?? 0) > 0, '>0', сколько.concepts);

  // ГЛАВНОЕ: повтор НЕ переписывает рабочее состояние семенем.
  const повтор = прогнать('import-graph.mjs', [path.join(ПРИЛОЖЕНИЕ, 'data')]);
  проверить('ПОВТОРНЫЙ ПЕРЕНОС ОТКАЗЫВАЕТ', повтор.код !== 0, 'отказ', повтор.код);
  проверить('и говорит, чем это грозит',
    /перезапишет|семен/i.test(повтор.вывод), 'объясняет', повтор.вывод.slice(0, 40));

  const нарочно = прогнать('import-graph.mjs', [path.join(ПРИЛОЖЕНИЕ, 'data')],
    { ALLOW_GRAPH_REIMPORT: '1' });
  проверить('с явным разрешением проходит', нарочно.код === 0, 0, нарочно.код);

  // ── 2. ПЕРВЫЙ АДМИНИСТРАТОР ─────────────────────────────────────────────
  const безПароля = прогнать('bootstrap-admin.mjs', [], { BOOTSTRAP_ADMIN_PASSWORD: '' });
  проверить('без пароля отказывает', безПароля.код !== 0, 'отказ', безПароля.код);
  проверить('и предупреждает про историю оболочки',
    /истори|списке процессов/i.test(безПароля.вывод), 'предупреждает', 'нет');

  const короткий = прогнать('bootstrap-admin.mjs', [],
    { BOOTSTRAP_ADMIN_PASSWORD: 'коротко' });
  проверить('короткий пароль не проходит: правила ТЕ ЖЕ, что при регистрации',
    короткий.код !== 0, 'отказ', короткий.код);

  const завёл = прогнать('bootstrap-admin.mjs', [], {
    BOOTSTRAP_ADMIN_PASSWORD: ПАРОЛЬ,
    BOOTSTRAP_ADMIN_LOGIN: 'глава', BOOTSTRAP_ADMIN_EMAIL: 'glava@e.рф' });
  проверить('первый администратор заведён', завёл.код === 0, 0, завёл.вывод.slice(0, 60));

  const найден = await findByEmailWithSecret(pool, 'glava@e.рф');
  проверить('он есть в базе', !!найден, 'есть', 'нет');
  проверить('ПАРОЛЬ НАСТОЯЩИЙ — им можно войти',
    await verifyPassword(найден.passwordHash, ПАРОЛЬ), true, 'нет');
  проверить('роль администратора', найден.user.role === 'administrator',
    'administrator', найден.user.role);
  проверить('почта подтверждена доверенным запуском',
    найден.user.emailVerified === true, true, найден.user.emailVerified);
  проверить('второй шаг САМ не заведён', найден.user.mfaReady === false, false, true);
  проверить('без второго шага опасные права срезаны',
    !найден.user.permissions.includes('manage_admins')
    && !найден.user.permissions.includes('ban_user'), 'срезаны', 'есть');

  const второй = прогнать('bootstrap-admin.mjs', [], { BOOTSTRAP_ADMIN_PASSWORD: ПАРОЛЬ });
  проверить('повторный запуск отказывает', второй.код !== 0, 'отказ', второй.код);

  // ── 3. ГОНКА ДВУХ ЗАПУСКОВ НА ПУСТОЙ БАЗЕ ───────────────────────────────
  // SELECT ... FOR UPDATE по ПУСТОЙ таблице не блокирует ничего: строк нет.
  // Два запуска увидят ноль и заведут двоих. Проверяем настоящим запуском
  // двух процессов разом, а не рассуждением.
  await pool.query(`DELETE FROM audit_log`);
  await pool.query(`DELETE FROM role_history`);
  await pool.query(`DELETE FROM users`);

  // ВРУЧНУЮ, ДВУМЯ СОЕДИНЕНИЯМИ. Два процесса, пущенные разом, могут и не
  // наложиться во времени — первый набросок так и вышел: зелено даже со
  // снятым замком. Тот же урок, что в беседе 1.5: гонку надо ставить, а не
  // надеяться на неё.
  const cA = await pool.connect(), cB = await pool.connect();
  let состояниеB = 'ждёт';
  try {
    await cA.query('BEGIN'); await cB.query('BEGIN');
    const живыхA = await beginBootstrapAdmin(cA);
    проверить('первая сделка видит пустую базу', живыхA === 0, 0, живыхA);

    const bПромис = beginBootstrapAdmin(cB)
      .then(n => { состояниеB = 'прошёл, живых ' + n; })
      .catch(e => { состояниеB = 'упал: ' + e.message.slice(0, 30); });
    await ждать(500);
    проверить('ВТОРАЯ СДЕЛКА ЖДЁТ ПЕРВУЮ (замок держит)',
      состояниеB === 'ждёт', 'ждёт', состояниеB);

    await cA.query(`INSERT INTO users (username, email, password_hash, role)
                    VALUES ('первый', 'p1@e.рф', 'x', 'administrator')`);
    await cA.query('COMMIT');
    await bПромис;
    проверить('дождавшись, вторая видит УЖЕ ЗАНЯТУЮ базу',
      состояниеB === 'прошёл, живых 1', 'прошёл, живых 1', состояниеB);
    await cB.query('ROLLBACK');
  } finally { cA.release(); cB.release(); }

  const { rows: [{ n }] } = await pool.query(`SELECT count(*)::int AS n FROM users`);
  проверить('ЗАВЁЛСЯ РОВНО ОДИН', n === 1, 1, n);

  // ── 4. ШТАТНАЯ ТОЧКА ВХОДА ──────────────────────────────────────────────
  проверить('точка входа есть',
    fs.existsSync(path.join(КОРЕНЬ, 'scripts', 'serve.mjs')), 'есть', 'нет');
  const ходы = JSON.parse(fs.readFileSync(path.join(КОРЕНЬ, 'package.json'), 'utf8')).scripts;
  проверить('npm start ведёт к ней', ходы.start === 'node scripts/serve.mjs',
    'node scripts/serve.mjs', ходы.start);
  // ЗАПУСК НИЧЕГО НЕ ГОТОВИТ: ни миграций, ни семени, ни людей.
  проверить('запуск не накатывает миграций и не сеет граф',
    !/migrate|import|bootstrap/.test(ходы.start), 'только запуск', ходы.start);

  const httpServer = fs.readFileSync(path.join(КОРЕНЬ, 'scripts', 'serve.mjs'), 'utf8');
  проверить('запуск отдаёт и страницу', /папкаПриложения/.test(httpServer), 'отдаёт', 'нет');
  проверить('останов ловится по сигналу',
    /SIGINT/.test(httpServer) && /SIGTERM/.test(httpServer), 'оба', 'нет');

  // Поднимаем настоящим ходом и стучимся.
  const процесс = (await import('node:child_process')).spawn('node',
    [path.join(КОРЕНЬ, 'scripts', 'serve.mjs')],
    { env: { ...process.env, PORT: '8831' }, stdio: 'pipe' });
  let сказал = '';
  процесс.stdout.on('data', second => { сказал += String(second); });
  await ждать(4000);
  let ответ = null;
  try {
    const о = await fetch('http://127.0.0.1:8831/api/users/me');
    ответ = о.status;
  } catch { ответ = 'нет ответа'; }
  проверить('поднятый сервер отвечает', ответ === 200, 200, ответ);
  проверить('и называет, где он', /http:\/\/127\.0\.0\.1:8831/.test(сказал),
    'называет', сказал.slice(0, 60));

  const pageHtml = await fetch('http://127.0.0.1:8831/index.html')
    .then(о => о.text()).catch(() => '');
  проверить('он же отдаёт страницу С МЕТКОЙ',
    pageHtml.includes('name="philos-api"'), 'с меткой', pageHtml.slice(0, 40));

  процесс.kill('SIGTERM');
  await ждать(2500);
  // ── КОНТРАКТ ЗАПУСКА: обязательное проверяется ДО подъёма (D-1, §13) ──
  const ТОЧКА = path.join(КОРЕНЬ, 'scripts', 'serve.mjs');
  const безКлюча = { ...process.env };
  delete безКлюча.MFA_SECRET_KEY;
  const попыткаБезКлюча = spawnSync('node', [ТОЧКА], {
    env: безКлюча, encoding: 'utf8', timeout: 10000 });
  проверить('БЕЗ MFA_SECRET_KEY ЗАПУСК ОТКАЗЫВАЕТ, а не поднимается молча',
    попыткаБезКлюча.status !== 0
      && /MFA_SECRET_KEY/.test(попыткаБезКлюча.stderr + попыткаБезКлюча.stdout),
    'отказ с именем переменной',
    `код ${попыткаБезКлюча.status}: ${(попыткаБезКлюча.stderr || '').slice(0, 60)}`);

  const кривойКлюч = spawnSync('node', [ТОЧКА], {
    env: { ...process.env, MFA_SECRET_KEY: 'слишкомкороткий' },
    encoding: 'utf8', timeout: 10000 });
  проверить('негодный ключ отвергается с указанием длины',
    кривойКлюч.status !== 0 && /32 байта/.test(кривойКлюч.stderr + кривойКлюч.stdout),
    '32 байта', (кривойКлюч.stderr || '').slice(0, 60));

  const кривойПорт = spawnSync('node', [ТОЧКА], {
    env: { ...process.env, PORT: 'восемь' }, encoding: 'utf8', timeout: 10000 });
  проверить('негодный PORT отвергается', кривойПорт.status !== 0
    && /PORT/.test(кривойПорт.stderr + кривойПорт.stdout), 'отказ',
    `код ${кривойПорт.status}`);

  // production ЗНАЧИТ «ЗА СТАВНЕМ», и адрес человека там приходит заголовком.
  // Умолчание «не доверять» верно, но за ставнем оно тихо портит журнал и
  // предел регистраций — поэтому выбор требуется от человека, а не берётся
  // молча. Отказ должен случаться там, где его увидит тот, кто запускает.
  const боевойБезСтавня = { ...process.env, NODE_ENV: 'production' };
  delete боевойБезСтавня.TRUST_PROXY;
  const безСтавня = spawnSync('node', [ТОЧКА], {
    env: боевойБезСтавня, encoding: 'utf8', timeout: 10000 });
  проверить('production БЕЗ TRUST_PROXY запуск отказывает',
    безСтавня.status !== 0 && /TRUST_PROXY/.test(безСтавня.stderr + безСтавня.stdout),
    'отказ с именем переменной',
    `код ${безСтавня.status}: ${(безСтавня.stderr || '').slice(0, 60)}`);

  // Осознанное «ставня нет» — это ноль, а не молчание. Проверяем, что такой
  // запуск ПРОХОДИТ: иначе заслон запирал бы и того, кто ответил.
  const сНулём = (await import('node:child_process')).spawn('node', [ТОЧКА],
    { env: { ...process.env, NODE_ENV: 'production', TRUST_PROXY: '0', PORT: '8817' },
      stdio: 'pipe' });
  let сказалНуль = '';
  сНулём.stdout.on('data', б => { сказалНуль += б; });
  await ждать(2500);
  проверить('production с TRUST_PROXY=0 поднимается',
    /поднята/.test(сказалНуль), 'поднялась', сказалНуль.slice(0, 60) || 'молчит');
  сНулём.kill('SIGTERM');
  await ждать(1000);

  проверить('по SIGTERM останавливается', процесс.exitCode !== null || процесс.killed,
    'остановился', процесс.exitCode);

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
