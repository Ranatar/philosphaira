#!/usr/bin/env node
// Проба СЛОЯ HTTP. Требует живой базы.
//
// Спрашивает то, чего службы сами о себе сказать не могут: доходит ли
// сессия в cookie, работает ли двойная отправка против CSRF, отличает ли
// клиент «сервера нет» от «я не вошёл».
//
//   DATABASE_URL=… node probes/http_probe.mjs

import http from 'node:http';
import { createPool } from '../src/db/pool.js';
import { createApp } from '../src/http/app.js';
import { findById } from '../src/db/users.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';
import { totpCode as totpКод } from '../src/auth/totp.js';
import { clearCounters, REGISTER_LIMIT } from '../src/auth/throttle.js';
import { unsubscribeToken } from '../src/notify/unsubscribe.js';
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

const pool = createPool();
const app = createApp({ pool, безопасныеCookie: false });
const httpServer = http.createServer(app);
await new Promise(г => httpServer.listen(8810, г));

const ПАРОЛЬ = 'вполне-длинный-пароль';
const БАЗА = 'http://127.0.0.1:8810';

// Значение печенья идёт в заголовок, а заголовок не терпит ни переносов,
// ни управляющих знаков. Чистим ОДНИМ местом — иначе ошибка вылезает не
// там, где сделана, и читается как «сервер сломался».
const чисто = з => String(з ?? '').replace(/[\r\n]+/g, '').trim();
const строкаПеченья = м =>
  [...м].map(([result, з]) => `${чисто(result)}=${чисто(з)}`).join('; ');

/** Клиент, помнящий cookie, — как браузер. */
function браузер() {
  const печенья = new Map();
  return {
    печенья,
    async зов(filePath, { method = 'GET', body } = {}) {
      const заголовки = {};
      if (body) заголовки['Content-Type'] = 'application/json';
      if (печенья.size) заголовки.cookie = строкаПеченья(печенья);
      if (method !== 'GET' && печенья.has('csrf')) {
        заголовки['X-CSRF-Token'] = печенья.get('csrf');
      }
      let observation;
      try {
        observation = await fetch(БАЗА + filePath, { method, headers: заголовки,
          body: body ? JSON.stringify(body) : undefined });
      } catch (e) {
        throw new Error(`${filePath}: ${e.message} | заголовки ${JSON.stringify(заголовки)}`);
      }
      for (const since of observation.headers.getSetCookie?.() ?? []) {
        const [пара] = since.split(';');
        const i = пара.indexOf('=');
        // trim с обеих сторон: значение приходит без хвоста атрибутов, но
        // с пробелами и переносами по краям — и они ломают заголовок.
        печенья.set(пара.slice(0, i).trim(), пара.slice(i + 1).trim());
      }
      return { код: observation.status, тело: await observation.json().catch(() => null) };
    },
  };
}

try {
  const second = браузер();

  // ── 1. гость ────────────────────────────────────────────────────────────
  const гость = await second.зов('/api/users/me');
  проверить('сервер отвечает и гостю', гость.код === 200, 200, гость.код);
  проверить('и говорит, что тот ГОСТЬ, а не молчит',
    гость.тело?.data?.гость === true, true, JSON.stringify(гость.тело?.data));
  проверить('у гостя есть право смотреть граф',
    гость.тело?.data?.permissions?.includes('view_graph'), 'view_graph',
    гость.тело?.data?.permissions?.join(','));

  // ── 2. регистрация и cookie ─────────────────────────────────────────────
  const рег = await second.зов('/api/auth/register', { method: 'POST',
    body: { username: 'иван', email: 'ivan@e.рф', password: ПАРОЛЬ } });
  проверить('регистрация проходит', рег.код === 201, 201, рег.код);
  проверить('сессия пришла cookie', second.печенья.has('session'), 'есть',
    [...second.печенья.keys()].join(','));
  проверить('и признак CSRF рядом', second.печенья.has('csrf'), 'есть', 'нет');
  проверить('хеш пароля наружу не ушёл',
    !JSON.stringify(рег.тело).includes('password'), 'нет', 'есть');

  const я = await second.зов('/api/users/me');
  проверить('после регистрации «кто я» знает меня',
    я.тело?.data?.username === 'иван', 'иван', я.тело?.data?.username);
  проверить('и отдаёт НАБОР ПРАВ, а не роль',
    Array.isArray(я.тело?.data?.permissions), 'массив',
    typeof я.тело?.data?.permissions);
  проверить('неподтверждённому коммиты не разрешены',
    !я.тело?.data?.permissions.includes('create_commit'), 'нет', 'есть');

  // ── 3. CSRF ─────────────────────────────────────────────────────────────
  const заг1 = { cookie: строкаПеченья(second.печенья) };
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
    method: 'POST', headers: { cookie: строкаПеченья(second.печенья),
                               'X-CSRF-Token': 'chuzhoy-priznak-sovsem' },
  });
  проверить('и с чужим признаком тоже', чужойПризнак.status === 403, 403,
    чужойПризнак.status);

  // ── 4. вход и выход ─────────────────────────────────────────────────────
  await second.зов('/api/auth/logout', { method: 'POST' });
  const послеВыхода = await second.зов('/api/users/me');
  проверить('после выхода я снова гость', послеВыхода.тело?.data?.гость === true,
    true, JSON.stringify(послеВыхода.тело?.data).slice(0, 40));

  const мимо = await second.зов('/api/auth/login', { method: 'POST',
    body: { email: 'ivan@e.рф', password: 'не тот' } });
  проверить('неверный пароль — 401', мимо.код === 401, 401, мимо.код);
  проверить('и наружу не уходит, чего именно не сошлось',
    !/пароль неверн|нет такого/i.test(мимо.тело?.error?.message ?? ''),
    'общий ответ', мимо.тело?.error?.message);

  const вход = await second.зов('/api/auth/login', { method: 'POST',
    body: { email: 'ivan@e.рф', password: ПАРОЛЬ } });
  проверить('вход проходит', вход.код === 200, 200, вход.код);
  проверить('вход говорит, ждёт ли кода', вход.тело?.data?.ждётКода === false,
    false, вход.тело?.data?.ждётКода);

  // ── 5. ВТОРОЙ ШАГ ЧЕРЕЗ HTTP ────────────────────────────────────────────
  // Вход отдаёт { user, ждётКода }, а не пользователя вплотную: у ответа
  // есть ДВА предмета, и складывать их в один — то самое смешение, из-за
  // которого в первой редакции документа панель читала сразу два вида
  // ответа. Первый набросок пробы полез в data.userId и получил null.
  const audience = await findById(pool, вход.тело.data.user.userId);
  const начало = await beginEnroll(pool, audience);
  await confirmEnroll(pool, audience, totpКод(начало.секрет));

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
  // И СПИСКИ ТОЖЕ. Прежде утверждение выше спрашивало об этом одиночные
  // ответы, а списки уезжали как {items, pagination}: правило держалось
  // не везде, а прибор этого не видел, потому что не спрашивал.
  const списки = await second.зов('/api/commits');
  проверить('в поле data отвечают И СПИСКИ',
    'data' in (списки.тело ?? {}) && Array.isArray(списки.тело?.data?.items),
    'data.items', Object.keys(списки.тело ?? {}).join(','));
  проверить('отказ всегда в поле error с кодом',
    !!мимо.тело?.error?.code, 'error.code', JSON.stringify(мимо.тело).slice(0, 40));
  const внутренняя = await second.зов('/api/auth/verify-email', { method: 'POST',
    body: { token: 'нет такого' } });
  проверить('несуществующая ссылка — 404, а не 500', внутренняя.код === 404, 404,
    внутренняя.код);

  // ── 7. РАСКЛАДКА: два такта и заслон по версии ─────────────────────────
  // Пользователь пробы — обычный (viewer/editor), права на перекладку у него
  // нет. Проверяем сперва ОТКАЗ: право новое, и легче всего ошибиться,
  // раздав его шире, чем задумано.
  const планЧужой = await б2.зов('/api/layout/plan', { method: 'POST' });
  проверить('без права перекладка недоступна', планЧужой.код === 403, 403, планЧужой.код);

  // Дальше — от лица администратора. Роль поднимается прямо в базе:
  // проходить через HTTP смены ролей здесь незачем, это чужой предмет.
  await pool.query(`UPDATE users SET role = 'administrator' WHERE user_id = $1`,
    [audience.userId]);

  const план = await б2.зов('/api/layout/plan', { method: 'POST' });
  проверить('план перекладки считается', план.код === 200, 200, план.код);
  проверить('план отдаёт версию графа',
    Number.isFinite(план.тело?.data?.версия), 'число', план.тело?.data?.версия);
  // КООРДИНАТ В ОТВЕТЕ БЫТЬ НЕ ДОЛЖНО: их 453 пары, а решение принимается по
  // мере расхождения. Отдавать картину значило бы слать четырнадцать
  // килобайт затем, чтобы клиент их выбросил.
  проверить('план НЕ отдаёт координаты',
    !('позиции' in (план.тело?.data ?? {})), 'нет поля позиции',
    Object.keys(план.тело?.data ?? {}).join(','));

  // ЗАСЛОН ПО ВЕРСИИ. План не хранится между запросами нарочно: хранимый
  // план протухает молча, пока человек думает. Применение считает заново и
  // отказывается, если версия разошлась с той, по которой решали.
  const чужаяВерсия = await б2.зов('/api/layout/apply', { method: 'POST',
    body: { версия: план.тело.data.версия + 1000 } });
  проверить('применение с чужой версией отбито', чужаяВерсия.код === 409, 409,
    чужаяВерсия.код);
  проверить('и объясняет, почему',
    /изменился|посчитайте заново/i.test(чужаяВерсия.тело?.error?.message ?? ''),
    'про изменение графа', (чужаяВерсия.тело?.error?.message ?? '').slice(0, 40));
  const безВерсии = await б2.зов('/api/layout/apply', { method: 'POST', body: {} });
  проверить('применение без версии отбито', безВерсии.код === 409, 409, безВерсии.код);

  const применено = await б2.зов('/api/layout/apply', { method: 'POST',
    body: { версия: план.тело.data.версия } });
  проверить('перекладка применяется', применено.код === 200, 200, применено.код);
  проверить('и отдаёт номер новой раскладки',
    Number.isFinite(применено.тело?.data?.id), 'число', применено.тело?.data?.id);

  const история = await б2.зов('/api/layout/history');
  проверить('история раскладок доступна',
    Array.isArray(история.тело?.data) && история.тело.data.length > 0,
    'непустой список', (история.тело?.data ?? []).length);

  const откат = await б2.зов(`/api/layout/${применено.тело.data.id}/revert`,
    { method: 'POST' });
  проверить('откат раскладки проходит', откат.код === 200, 200, откат.код);
  const нетТакой = await б2.зов('/api/layout/999999/revert', { method: 'POST' });
  проверить('откат к несуществующей — 404', нетТакой.код === 404, 404, нетТакой.код);

  // ── ОТКРЫТАЯ РЕГИСТРАЦИЯ: ПРЕДЕЛ ПО АДРЕСУ ──────────────────────────────
  //
  // Раздел ставится последним нарочно: счётчик общий на процесс, и всё, что
  // регистрировалось выше, тоже считалось. Обнуляем и считаем сами.
  clearCounters();
  {
    const коды = [];
    for (let i = 0; i < REGISTER_LIMIT; i++) {
      const б = браузер();
      коды.push((await б.зов('/api/auth/register', { method: 'POST',
        body: { username: `предел${i}`, email: `предел${i}@e.рф`, password: ПАРОЛЬ } })).код);
    }
    проверить(`${REGISTER_LIMIT} записей с адреса проходят`,
      коды.every(к => к === 201), 'все 201', коды.join(','));
    const лишний = await браузер().зов('/api/auth/register', { method: 'POST',
      body: { username: 'лишний', email: 'лишний@e.рф', password: ПАРОЛЬ } });
    проверить('следующая отвергнута с 429', лишний.код === 429, 429, лишний.код);
    проверить('и названа своим кодом', лишний.тело?.error?.code === 'too_many',
      'too_many', лишний.тело?.error?.code);
    проверить('лишняя запись НЕ ЗАВЕДЕНА',
      (await pool.query(`SELECT count(*)::int AS n FROM users WHERE username='лишний'`))
        .rows[0].n === 0, 0, 'заведена');
    clearCounters();
    const снова = await браузер().зов('/api/auth/register', { method: 'POST',
      body: { username: 'после', email: 'после@e.рф', password: ПАРОЛЬ } });
    проверить('после обнуления счётчика регистрация снова идёт',
      снова.код === 201, 201, снова.код);
  }

  // ── ОТПИСКА ОДНИМ НАЖАТИЕМ, БЕЗ ВХОДА ──────────────────────────────────
  //
  // Ход принимает почтовая служба, а не браузер: ни cookie, ни признака CSRF
  // у неё нет. Значит проверять надо ИМЕННО голым запросом.
  {
    clearCounters();
    const б = браузер();
    await б.зов('/api/auth/register', { method: 'POST',
      body: { username: 'отписчик', email: 'отписчик@e.рф', password: ПАРОЛЬ } });
    const кто = (await pool.query(
      `SELECT user_id AS "id" FROM users WHERE username='отписчик'`)).rows[0].id;
    const токен = unsubscribeToken(кто);
    const почтаВключена = async () => (await pool.query(
      `SELECT COALESCE(email_enabled, TRUE) AS "вкл" FROM users u
         LEFT JOIN notification_preferences p USING (user_id)
        WHERE u.user_id = $1`, [кто])).rows[0].вкл;

    проверить('до отписки почта включена', await почтаВключена(), true, false);

    const чужой = await fetch(`${БАЗА}/api/notifications/unsubscribe?u=${кто}&t=нетакой`,
      { method: 'POST' });
    проверить('ПОДДЕЛАННАЯ подпись отвергнута', чужой.status === 403, 403, чужой.status);
    проверить('и почта осталась включена', await почтаВключена(), true, false);

    const пустой = await fetch(`${БАЗА}/api/notifications/unsubscribe`, { method: 'POST' });
    проверить('без подписи — тоже отказ', пустой.status === 403, 403, пустой.status);

    const одноНажатие = await fetch(
      `${БАЗА}/api/notifications/unsubscribe?u=${кто}&t=${токен}`,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'List-Unsubscribe=One-Click' });
    проверить('ОДНО ДЕЙСТВИЕ БЕЗ COOKIE И БЕЗ CSRF проходит',
      одноНажатие.status === 200, 200, одноНажатие.status);
    проверить('и почта выключена', (await почтаВключена()) === false, false,
      await почтаВключена());

    const глазами = await fetch(`${БАЗА}/api/notifications/unsubscribe?u=${кто}&t=${токен}`);
    проверить('ссылка работает и по нажатию человеком (GET)',
      глазами.status === 200, 200, глазами.status);
  }

  // ── ДОВЕРИЕ ОБРАТНОМУ СТАВНЮ ────────────────────────────────────────────
  //
  // Два узла на одних данных, отличаются ОДНИМ доводом. Спрашиваем не код
  // ответа, а то, ЧТО ЛЕГЛО В БАЗУ: адрес человека нужен именно там.
  {
    const адресСессии = имя => pool.query(
      `SELECT host(s.ip_address) AS адрес FROM user_sessions s
         JOIN users u USING (user_id) WHERE u.username = $1
        ORDER BY s.session_id DESC LIMIT 1`, [имя]).then(r => r.rows[0]?.адрес);

    clearCounters();
    const наивный = http.createServer(createApp({ pool, безопасныеCookie: false }));
    await new Promise(г => наивный.listen(8812, г));
    await fetch('http://127.0.0.1:8812/api/auth/register', { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.9' },
      body: JSON.stringify({ username: 'безставня', email: 'без@e.рф', password: ПАРОЛЬ }) });
    наивный.close();
    проверить('БЕЗ trustProxy заголовку не верят',
      (await адресСессии('безставня')) === '127.0.0.1', '127.0.0.1',
      await адресСессии('безставня'));

    clearCounters();
    const заСтавнем = http.createServer(
      createApp({ pool, безопасныеCookie: false, trustProxy: 1 }));
    await new Promise(г => заСтавнем.listen(8813, г));
    await fetch('http://127.0.0.1:8813/api/auth/register', { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.9' },
      body: JSON.stringify({ username: 'заставнем', email: 'за@e.рф', password: ПАРОЛЬ }) });
    заСтавнем.close();
    проверить('С trustProxy в базу ложится адрес человека',
      (await адресСессии('заставнем')) === '203.0.113.9', '203.0.113.9',
      await адресСессии('заставнем'));
  }

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  httpServer.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
