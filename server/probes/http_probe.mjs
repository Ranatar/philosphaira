#!/usr/bin/env node
// Проба СЛОЯ HTTP. Требует живой базы.
//
// Спрашивает то, чего службы сами о себе сказать не могут: доходит ли
// сессия в cookie, работает ли двойная отправка против CSRF, отличает ли
// клиент «сервера нет» от «я не вошёл».
//
//   DATABASE_URL=… node probes/http_probe.mjs

import http from 'node:http';
import { создатьПул } from '../src/db/pool.js';
import { создатьПриложение } from '../src/http/app.js';
import { findById } from '../src/db/users.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';
import { код as totpКод } from '../src/auth/totp.js';
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

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = создатьПул();
const app = создатьПриложение({ pool, безопасныеCookie: false });
const сервер = http.createServer(app);
await new Promise(г => сервер.listen(8810, г));

const ПАРОЛЬ = 'вполне-длинный-пароль';
const БАЗА = 'http://127.0.0.1:8810';

// Значение печенья идёт в заголовок, а заголовок не терпит ни переносов,
// ни управляющих знаков. Чистим ОДНИМ местом — иначе ошибка вылезает не
// там, где сделана, и читается как «сервер сломался».
const чисто = з => String(з ?? '').replace(/[\r\n]+/g, '').trim();
const строкаПеченья = м =>
  [...м].map(([и, з]) => `${чисто(и)}=${чисто(з)}`).join('; ');

/** Клиент, помнящий cookie, — как браузер. */
function браузер() {
  const печенья = new Map();
  return {
    печенья,
    async зов(путь, { method = 'GET', body } = {}) {
      const заголовки = {};
      if (body) заголовки['Content-Type'] = 'application/json';
      if (печенья.size) заголовки.cookie = строкаПеченья(печенья);
      if (method !== 'GET' && печенья.has('csrf')) {
        заголовки['X-CSRF-Token'] = печенья.get('csrf');
      }
      let о;
      try {
        о = await fetch(БАЗА + путь, { method, headers: заголовки,
          body: body ? JSON.stringify(body) : undefined });
      } catch (e) {
        throw new Error(`${путь}: ${e.message} | заголовки ${JSON.stringify(заголовки)}`);
      }
      for (const с of о.headers.getSetCookie?.() ?? []) {
        const [пара] = с.split(';');
        const i = пара.indexOf('=');
        // trim с обеих сторон: значение приходит без хвоста атрибутов, но
        // с пробелами и переносами по краям — и они ломают заголовок.
        печенья.set(пара.slice(0, i).trim(), пара.slice(i + 1).trim());
      }
      return { код: о.status, тело: await о.json().catch(() => null) };
    },
  };
}

try {
  const б = браузер();

  // ── 1. гость ────────────────────────────────────────────────────────────
  const гость = await б.зов('/api/users/me');
  проверить('сервер отвечает и гостю', гость.код === 200, 200, гость.код);
  проверить('и говорит, что тот ГОСТЬ, а не молчит',
    гость.тело?.data?.гость === true, true, JSON.stringify(гость.тело?.data));
  проверить('у гостя есть право смотреть граф',
    гость.тело?.data?.permissions?.includes('view_graph'), 'view_graph',
    гость.тело?.data?.permissions?.join(','));

  // ── 2. регистрация и cookie ─────────────────────────────────────────────
  const рег = await б.зов('/api/auth/register', { method: 'POST',
    body: { username: 'иван', email: 'ivan@e.рф', password: ПАРОЛЬ } });
  проверить('регистрация проходит', рег.код === 201, 201, рег.код);
  проверить('сессия пришла cookie', б.печенья.has('session'), 'есть',
    [...б.печенья.keys()].join(','));
  проверить('и признак CSRF рядом', б.печенья.has('csrf'), 'есть', 'нет');
  проверить('хеш пароля наружу не ушёл',
    !JSON.stringify(рег.тело).includes('password'), 'нет', 'есть');

  const я = await б.зов('/api/users/me');
  проверить('после регистрации «кто я» знает меня',
    я.тело?.data?.username === 'иван', 'иван', я.тело?.data?.username);
  проверить('и отдаёт НАБОР ПРАВ, а не роль',
    Array.isArray(я.тело?.data?.permissions), 'массив',
    typeof я.тело?.data?.permissions);
  проверить('неподтверждённому коммиты не разрешены',
    !я.тело?.data?.permissions.includes('create_commit'), 'нет', 'есть');

  // ── 3. CSRF ─────────────────────────────────────────────────────────────
  const заг1 = { cookie: строкаПеченья(б.печенья) };
  let безПризнака;
  try {
    безПризнака = await fetch(БАЗА + '/api/auth/logout', { method: 'POST', headers: заг1 });
  } catch (e) {
    throw new Error('без признака: ' + e.message + ' | ' + JSON.stringify(заг1));
  }
  проверить('изменяющий запрос БЕЗ заголовка CSRF отвергается',
    безПризнака.status === 403, 403, безПризнака.status);
  // ЗНАЧЕНИЕ ЗАГОЛОВКА — ТОЛЬКО ЛАТИНИЦА. Заголовки HTTP суть ByteString
  // (Latin-1), и кириллическое «чужой-признак-совсем» роняет fetch ещё до
  // отправки — с сообщением про ByteString, в котором про кириллицу нет ни
  // слова. Я потратил на это три захода, дважды починив не то место.
  // Впредь: подставная величина в заголовке пишется латиницей.
  const чужойПризнак = await fetch(БАЗА + '/api/auth/logout', {
    method: 'POST', headers: { cookie: строкаПеченья(б.печенья),
                               'X-CSRF-Token': 'chuzhoy-priznak-sovsem' },
  });
  проверить('и с чужим признаком тоже', чужойПризнак.status === 403, 403,
    чужойПризнак.status);

  // ── 4. вход и выход ─────────────────────────────────────────────────────
  await б.зов('/api/auth/logout', { method: 'POST' });
  const послеВыхода = await б.зов('/api/users/me');
  проверить('после выхода я снова гость', послеВыхода.тело?.data?.гость === true,
    true, JSON.stringify(послеВыхода.тело?.data).slice(0, 40));

  const мимо = await б.зов('/api/auth/login', { method: 'POST',
    body: { email: 'ivan@e.рф', password: 'не тот' } });
  проверить('неверный пароль — 401', мимо.код === 401, 401, мимо.код);
  проверить('и наружу не уходит, чего именно не сошлось',
    !/пароль неверн|нет такого/i.test(мимо.тело?.error?.message ?? ''),
    'общий ответ', мимо.тело?.error?.message);

  const вход = await б.зов('/api/auth/login', { method: 'POST',
    body: { email: 'ivan@e.рф', password: ПАРОЛЬ } });
  проверить('вход проходит', вход.код === 200, 200, вход.код);
  проверить('вход говорит, ждёт ли кода', вход.тело?.data?.ждётКода === false,
    false, вход.тело?.data?.ждётКода);

  // ── 5. ВТОРОЙ ШАГ ЧЕРЕЗ HTTP ────────────────────────────────────────────
  // Вход отдаёт { user, ждётКода }, а не пользователя вплотную: у ответа
  // есть ДВА предмета, и складывать их в один — то самое смешение, из-за
  // которого в первой редакции документа панель читала сразу два вида
  // ответа. Первый набросок пробы полез в data.userId и получил null.
  const кто = await findById(pool, вход.тело.data.user.userId);
  const начало = await beginEnroll(pool, кто);
  await confirmEnroll(pool, кто, totpКод(начало.секрет));

  const б2 = браузер();
  const вход2 = await б2.зов('/api/auth/login', { method: 'POST',
    body: { email: 'ivan@e.рф', password: ПАРОЛЬ } });
  проверить('со вторым шагом вход объявляет, что ждёт кода',
    вход2.тело?.data?.ждётКода === true, true, вход2.тело?.data?.ждётКода);
  const частичный = await б2.зов('/api/users/me');
  проверить('ЧАСТИЧНАЯ СЕССИЯ — ещё гость',
    частичный.тело?.data?.гость === true, true,
    JSON.stringify(частичный.тело?.data).slice(0, 40));

  const мимоКода = await б2.зов('/api/auth/mfa', { method: 'POST', body: { code: '000000' } });
  проверить('неверный код не пускает', мимоКода.код === 401, 401, мимоКода.код);
  const кодом = await б2.зов('/api/auth/mfa', { method: 'POST',
    body: { code: totpКод(начало.секрет) } });
  проверить('верный код проходит', кодом.код === 200, 200, кодом.код);
  const после = await б2.зов('/api/users/me');
  проверить('и сессия становится полной', после.тело?.data?.username === 'иван',
    'иван', JSON.stringify(после.тело?.data).slice(0, 40));

  const лишний = await б2.зов('/api/auth/mfa', { method: 'POST',
    body: { code: totpКод(начало.секрет) } });
  проверить('второй шаг дважды не спрашивают', лишний.код === 400, 400, лишний.код);

  // ── 6. вид ответа один на всё ───────────────────────────────────────────
  проверить('успех всегда в поле data', 'data' in (после.тело ?? {}), 'data',
    Object.keys(после.тело ?? {}).join(','));
  проверить('отказ всегда в поле error с кодом',
    !!мимо.тело?.error?.code, 'error.code', JSON.stringify(мимо.тело).slice(0, 40));
  const внутренняя = await б.зов('/api/auth/verify-email', { method: 'POST',
    body: { token: 'нет такого' } });
  проверить('несуществующая ссылка — 404, а не 500', внутренняя.код === 404, 404,
    внутренняя.код);

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  сервер.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
