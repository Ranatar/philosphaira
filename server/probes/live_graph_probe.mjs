#!/usr/bin/env node
// Проба ЖИВОГО ОБНОВЛЕНИЯ ГРАФА (A-1 плана doc/plan-next.md).
//
// ПОВОД. Первое применение свежего графа с сервера стирало картинку
// НАЧИСТО и МОЛЧА: rebuildDerived() пересоздаёт nodes и links целиком, у
// новых узлов нет координат, у новых связей концы — строки, а d3 держит
// там объекты. Отрисовка честно пропускала всё (три места проверяют
// `x === undefined`), ошибки не было ни одной.
//
// ЧЕГО НЕ ХВАТИЛО СУЩЕСТВУЮЩИМ ПРИБОРАМ. page_probe смотрит страницу,
// УЖЕ вошедшую в серверный лад, и потому перехода не переживает. Прибор,
// не переживающий смены состояния, смену состояния не стережёт. Здесь
// проверяется именно ПЕРЕХОД и то, что за ним следует.
//
//   DATABASE_URL=… MFA_SECRET_KEY=… node probes/live_graph_probe.mjs [папка app]
//
// ПРИБОР НЕ ПЕРЕСКАЗЫВАЕТ ПРАВИЛО, А СПРАШИВАЕТ ЕГО: видимость узла
// берётся у самой страницы (__app.isNodeVisible), а не считается заново.

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { createPool } from '../src/db/pool.js';
import { createServer } from '../src/http/server.js';
import { withTransaction } from '../src/db/tx.js';
import { importSet } from '../src/db/graph.js';
import { currentLayout, saveLayout } from '../src/db/layout.js';
import { fullLayout } from '../src/graph/layout.js';
import { exportAll, graphVersion } from '../src/db/graph.js';
import { SET_NAMES } from '../src/graph/schema.js';
import { register } from '../src/auth/service.js';
import { findById, updateRole, setEmailVerified } from '../src/db/users.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';
import { totpCode as totpКод } from '../src/auth/totp.js';
import { directCommit } from '../src/commits/review.js';
import { deliverOnce } from '../src/notify/worker.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ПРИЛОЖЕНИЕ = process.argv[2] || path.join(КОРЕНЬ, '..', 'app');
const БРАУЗЕР = process.env.CHROME
  || '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const ПОРТ = Number(process.env.PROBE_PORT || 8816);

const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const ждать = мс => new Promise(r => setTimeout(r, мс));

// ЖИВОЙ ОТКЛИК ЗАВИСИТ ОТ РАБОТНИКА, и это не оплошность пробы, а
// устройство: коммит кладёт извещение в исходящие, работник публикует его
// в шину (LISTEN/NOTIFY), узел рассылает по сокетам, клиент по сообщению
// зовёт pullGraphSince. Без запущенного notify-worker страница не узнает
// о чужой правке до перезагрузки — это стоит помнить при развёртывании.
const прокрутитьРаботника = async pool => { await deliverOnce(pool); };

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();

// Граф у страницы и у сервера обязан быть один — иначе первая же правка
// приходит как столкновение, и проба мерит несуществующую жизнь.
await withTransaction(pool, async client => {
  for (const имя of SET_NAMES) {
    const filePath = path.join(ПРИЛОЖЕНИЕ, 'data', имя + '.json');
    if (fs.existsSync(filePath)) {
      await importSet(client, имя, JSON.parse(fs.readFileSync(filePath, 'utf8')));
    }
  }
});

const узелСервера = await createServer({
  pool, строкаПодключения: process.env.DATABASE_URL,
  папкаПриложения: ПРИЛОЖЕНИЕ, безопасныеCookie: false });
await узелСервера.слушать(ПОРТ);

// «Клиент Б» — не второй браузер, а тот же путь правки, которым ходит
// человек с правом рассмотрения: коммит применяется и поднимает версию
// графа, а узел рассылает сигнал. Второй браузер здесь ничего не добавил
// бы: проверяется поведение КЛИЕНТА А при пришедшем изменении.
const второй = await register(pool, { username: 'редактор_б',
  email: 'b@example.invalid', password: 'вполне-длинный-пароль' });
await withTransaction(pool, async client => {
  await updateRole(client, { userId: второй.user.userId, newRole: 'administrator',
                             actorId: второй.user.userId });
  // Роль — только потолок; состояние записи его срезает. REVIEW_COMMIT
  // требует подтверждённой почты И заведённого второго шага (roles.js,
  // NEEDS_VERIFIED_EMAIL / NEEDS_MFA). Готовим то и другое настоящим
  // путём, а не подменой прав.
  await setEmailVerified(client, второй.user.userId);
});
{
  const audience = await findById(pool, второй.user.userId);
  const { секрет: secret } = await beginEnroll(pool, audience);
  await confirmEnroll(pool, audience, totpКод(secret));
}
const актор = await findById(pool, второй.user.userId);

// КЛИЕНТ А — вошедший читатель, а не гость. Гостю живое соединение не
// даётся вовсе (manager.js отвечает 401 на подъём без сеанса), и это
// решение, а не оплошность. Но прибор, открывший страницу гостем, мерил
// бы не то: у гостя чужая правка не появится до перезагрузки.
const ПАРОЛЬ_А = 'вполне-длинный-пароль';
const первый = await register(pool, { username: 'читатель_а',
  email: 'a@example.invalid', password: ПАРОЛЬ_А });
await withTransaction(pool, client => setEmailVerified(client, первый.user.userId));

let браузер, pageHtml;
const ошибки = [];

/** Спросить у страницы её собственное состояние графа. */
const mfaState = () => pageHtml.evaluate(`(() => {
  const A = window.__app, D = A.DATA;
  const узлы = D.nodes, связи = D.links;
  const сИмён = new Set(узлы.map(у => у.id));
  const концыОбъектами = связи.filter(с =>
    с.source && typeof с.source === 'object' && с.target && typeof с.target === 'object');
  const мёртвыеСвязи = связи.filter(с => {
    const и = (с.source && с.source.id) || с.source;
    const ц = (с.target && с.target.id) || с.target;
    return !сИмён.has(и) || !сИмён.has(ц);
  });
  const вСимуляции = A.S.simulation.nodes();
  return {
    узлов: узлы.length,
    связей: связи.length,
    сКоординатами: узлы.filter(у => Number.isFinite(у.x) && Number.isFinite(у.y)).length,
    видимых: узлы.filter(у => A.isNodeVisible(у)).length,
    концовОбъектами: концыОбъектами.length,
    мёртвыхСвязей: мёртвыеСвязи.length,
    версия: A.knownGraphVersion,
    симуляцияТаЖе: вСимуляции === узлы,
    вСимуляции: вСимуляции.length,
    места: Object.fromEntries(узлы.slice(0, 60).map(у => [у.id, [у.x, у.y]])),
    разброс: (() => {
      const сx = узлы.reduce((с, у) => с + у.x, 0) / узлы.length;
      const сy = узлы.reduce((с, у) => с + у.y, 0) / узлы.length;
      return Math.sqrt(узлы.reduce((с, у) =>
        с + (у.x - сx) ** 2 + (у.y - сy) ** 2, 0) / узлы.length);
    })(),
    естьУзел: и => узлы.some(у => у.id === и),
  };
})()`);

/** Доля закрашенного на холсте: «видно ли граф» без пересказа отрисовки. */
const закрашено = () => pageHtml.evaluate(`(() => {
  const c = document.getElementById('graphCanvas');
  if (!c) return null;
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let краски = 0, всего = 0;
  for (let i = 0; i < d.length; i += 4 * 37) { всего++; if (d[i + 3] > 8) краски++; }
  return всего ? краски / всего : null;
})()`);

try {
  браузер = await puppeteer.launch({ executablePath: БРАУЗЕР, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  pageHtml = await браузер.newPage();
  pageHtml.on('pageerror', e => ошибки.push(String(e).slice(0, 200)));

  // ── 1. клиент А открыт, переход в серверный лад состоялся ─────────────
  await pageHtml.goto(`http://127.0.0.1:${ПОРТ}/index.html`,
    { waitUntil: 'domcontentloaded' });
  // Оснастка НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается отдельным модульным тегом,
  // как это делает page_probe. Без неё window.__app не появится вовсе.
  await pageHtml.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
  await pageHtml.waitForFunction('window.__appReady === true', { timeout: 20000 });
  await ждать(1500);

  // Вход тем же путём, которым ходит человек: окно входа и его кнопка.
  await pageHtml.evaluate(`(() => {
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'a@example.invalid';
    document.getElementById('authPassword').value = ${JSON.stringify(ПАРОЛЬ_А)};
  })()`);
  await pageHtml.evaluate(`window.__app.submitAuth()`);
  await pageHtml.waitForFunction(
    `!!(window.__app.authSession && window.__app.authSession.user)`, { timeout: 15000 });
  await ждать(2500);

  const доля0 = await закрашено();
  const до = await mfaState();

  проверить('клиент А вошёл',
    await pageHtml.evaluate(`!!(window.__app.authSession && window.__app.authSession.user)`),
    true, false);
  проверить('страница вошла в серверный лад',
    await pageHtml.evaluate(`window.__app.serverMode === true`), true,
    await pageHtml.evaluate(`window.__app.serverMode`));
  // ВЕРСИЯ НОЛЬ ЗДЕСЬ ЗАКОННА, и первая редакция этого утверждения была
  // неверна: сущности, легшие ПЕРЕНОСОМ, помечены версией ноль, а
  // приращение отдаёт строго новее запрошенной. Пока правок не было,
  // версия графа — ноль. Прибор спрашивает страницу, а не диктует ей.
  проверить('версия графа у клиента определена',
    Number.isFinite(до.версия), 'число', до.версия);
  // Переучреждено 2026-09-06 после заходов 1–9. Прежние: 453 / 1624.
  // Числа не выведены из данных нарочно: прибор проверяет, что при переходе
  // на серверный лад НИЧЕГО не потерялось, — а для этого сравнивать надо с
  // заранее известным количеством, а не с тем, что отдал сервер.
  проверить('узлы на месте после перехода', до.узлов === 689, 689, до.узлов);
  проверить('связи на месте после перехода', до.связей === 2201, 2201, до.связей);

  // ЭТО И ЕСТЬ ТОТ ДЕФЕКТ. Три утверждения, каждое падало бы порознь.
  проверить('у ВСЕХ узлов есть координаты', до.сКоординатами === до.узлов,
    до.узлов, до.сКоординатами);
  проверить('концы связей — объекты узлов, а не строки',
    до.концовОбъектами === до.связей, до.связей, до.концовОбъектами);
  проверить('симуляция держит ТОТ ЖЕ массив узлов', до.симуляцияТаЖе, true,
    `${до.вСимуляции} против ${до.узлов}`);
  проверить('граф ВИДЕН на холсте после перехода', доля0 > 0.2, '>0.20',
    доля0 === null ? 'холста нет' : доля0.toFixed(3));

  // ── ОКНО «БЕЗОПАСНОСТЬ УЧЁТНОЙ ЗАПИСИ» ────────────────────────────────
  // Пока окна не было, bootstrap-admin отправлял человека заводить второй
  // шаг в панели, а заводить его там было нечем. Проверяется весь путь:
  // кнопка → окно → секрет → код → коды восстановления.
  await pageHtml.evaluate(`window.__app.openSecurityModal()`);
  await ждать(800);
  проверить('кнопка щита ведёт в окно безопасности',
    await pageHtml.evaluate(
      `/Безопасность учётной записи/.test(document.getElementById('authModal').textContent)`),
    'окно открыто', 'не открылось');
  проверить('окно говорит о состоянии второго шага',
    await pageHtml.evaluate(
      `/НЕ заведён|заведён/.test((document.getElementById('securityMfa')||{}).textContent||'')`),
    'состояние названо', 'молчит');

  await pageHtml.evaluate(`window.__app.startMfaEnroll()`);
  await ждать(1200);
  const секретСоСтраницы = await pageHtml.evaluate(
    `(document.getElementById('securitySecret')||{}).value || ''`);
  проверить('секрет показан на странице', секретСоСтраницы.length > 10,
    'секрет', секретСоСтраницы.length);
  проверить('и ссылка otpauth рядом',
    await pageHtml.evaluate(
      `/^otpauth:/.test((document.getElementById('securityUri')||{}).value||'')`),
    'otpauth', 'нет');
  проверить('ШАГ ЕЩЁ НЕ ВКЛЮЧЁН до предъявления кода',
    (await findById(pool, первый.user.userId)).mfaReady === false, false, true);

  await pageHtml.evaluate(`(() => {
    document.getElementById('securityCode').value = ${JSON.stringify('000000')};
  })()`);
  await pageHtml.evaluate(`window.__app.confirmMfaEnroll()`);
  await ждать(900);
  проверить('неверный код не включает шаг, а говорит об этом',
    (await findById(pool, первый.user.userId)).mfaReady === false
    && /не сошёлся/i.test(await pageHtml.evaluate(
      `(document.getElementById('securityError')||{}).textContent||''`)),
    'отказ с причиной', await pageHtml.evaluate(
      `(document.getElementById('securityError')||{}).textContent||''`));

  await pageHtml.evaluate(`(() => {
    document.getElementById('securityCode').value = ${JSON.stringify('ЗАМЕНА')};
  })()`.replace('"ЗАМЕНА"', JSON.stringify(totpКод(секретСоСтраницы))));
  await pageHtml.evaluate(`window.__app.confirmMfaEnroll()`);
  await ждать(1200);
  проверить('ВЕРНЫЙ КОД ВКЛЮЧАЕТ ВТОРОЙ ШАГ',
    (await findById(pool, первый.user.userId)).mfaReady === true, true, false);
  const кодыНаСтранице = await pageHtml.evaluate(
    `((document.getElementById('securityCodes')||{}).textContent||'').trim().length`);
  проверить('коды восстановления показаны', кодыНаСтранице > 20, '>20 знаков',
    кодыНаСтранице);
  проверить('кнопка «Готово» ЗАПЕРТА, пока не подтверждено сохранение',
    await pageHtml.evaluate(`(document.getElementById('securityDone')||{}).disabled === true`),
    'заперта', 'открыта');
  await pageHtml.evaluate(`(() => {
    document.getElementById('securitySaved').checked = true;
    window.__app.refreshSecurityDone();
  })()`);
  проверить('и отпирается подтверждением',
    await pageHtml.evaluate(`(document.getElementById('securityDone')||{}).disabled === false`),
    'отперта', 'заперта');

  // ── 2. изменение приходит извне: правка поля существующей концепции ───
  // МЕСТА СНИМАЮТСЯ НЕПОСРЕДСТВЕННО ПЕРЕД ПРАВКОЙ, а не в начале пробы.
  // Пока между двумя замерами лежало полторы секунды, годился и снимок «до»;
  // с появлением проверки окна безопасности между ними стало полминуты, и
  // укладка успевала разъехаться на 175 точек при пороге 150. Прибор мерил
  // бы тогда возраст пробы, а не сохранность координат.
  const переДПравкой = await mfaState();
  const местаДо = переДПравкой.места;
  const outcome = await directCommit(pool, { actor: актор,
    message: 'проба живого обновления: правка описания',
    // Поля идут парой base/next: без «было» слияние не отличит одинаковую
    // правку от разной. Это и есть исход coincided.
    changes: [{ action: 'edit', kind: 'concept', entityId: 'harmony_spheres',
                fields: { description: {
                  base: 'Небесные тела звучат по числовым отношениям',
                  next: 'Изменено пробой живого обновления' } } }] });
  проверить('правка применена сервером', outcome.исход === 'applied',
    'applied', outcome.исход);

  await прокрутитьРаботника(pool);
  await ждать(3000);
  const после = await mfaState();
  const доля1 = await закрашено();

  проверить('клиент А догнал версию', после.версия > до.версия,
    `>${до.версия}`, после.версия);
  проверить('узлы и связи остались на месте',
    после.узлов === до.узлов && после.связей === до.связей,
    `${до.узлов}/${до.связей}`, `${после.узлов}/${после.связей}`);
  // МЕРИТЬ НАДО МЕДИАНОЙ, А НЕ ПОРОГОМ НА КАЖДЫЙ УЗЕЛ. Первая редакция
  // требовала «ни один не сдвинулся больше 60 точек» и падала на исправном
  // коде: updateGraphData законно перезапускает укладку (alpha 0.3), и за
  // три секунды узлы успевают разъехаться. Потеря координат выглядит иначе
  // — узлы схлопываются к середине, и разброс падает в разы. Прибор мерит
  // именно это, а не дрожание укладки.
  const сдвиги = Object.entries(местаДо)
    .map(([result, [x, y]]) => { const т = после.места[result];
      return т ? Math.hypot(т[0] - x, т[1] - y) : Infinity; })
    .sort((first, second) => first - second);
  const медиана = сдвиги[Math.floor(сдвиги.length / 2)];
  проверить('координаты прежних узлов СОХРАНИЛИСЬ (медианный сдвиг мал)',
    медиана < 150, '<150 точек', Number.isFinite(медиана) ? медиана.toFixed(1) : медиана);
  проверить('узлы не схлопнулись к середине',
    после.разброс > переДПравкой.разброс * 0.6,
    `>${(переДПравкой.разброс * 0.6).toFixed(0)}`,
    после.разброс.toFixed(0));
  проверить('граф ВИДЕН после приращения', доля1 > 0.2, '>0.20',
    доля1 === null ? 'холста нет' : доля1.toFixed(3));
  проверить('правка ВИДНА странице', await pageHtml.evaluate(
    `(window.__app.DATA.concepts.find(к => к.id === 'harmony_spheres') || {}).description`)
    .then(т => /пробой живого обновления/.test(т || '')), 'новое описание',
    await pageHtml.evaluate(
      `(window.__app.DATA.concepts.find(к => к.id === 'harmony_spheres') || {}).description`));

  // ── 3. новый узел появляется в видимой области ────────────────────────
  // НАЧАЛЬНАЯ РАСКЛАДКА — ПРЕДУСЛОВИЕ, как и семя графа. Она заводится
  // отдельным ходом человека (README §5б), а не сама собой при первом
  // коммите: полный отжиг внутри транзакции правки — это секунды под
  // замком на всех сущностях. Проба воспроизводит установку, а не обходит её.
  {
    const граф0 = await exportAll(pool);
    const версия0 = await graphVersion(pool);
    await withTransaction(pool, client => saveLayout(client, {
      версияГрафа: версия0, род: 'full', позиции: fullLayout(граф0),
    }));
  }

  await directCommit(pool, { actor: актор, message: 'проба: новая концепция',
    changes: [{ action: 'add', kind: 'concept', entityId: 'проба_живого',
                fields: {
                  id:          { base: null, next: 'проба_живого' },
                  label:       { base: null, next: 'Проба живого' },
                  philosopher: { base: null, next: 'pythagoras' },
                  rubrics:     { base: null, next: ['being'] },
                  description: { base: null, next: 'заведена прибором' } } }] });
  await прокрутитьРаботника(pool);
  await ждать(3000);
  const сНовым = await mfaState();

  {
    // СЕРВЕРНАЯ РАСКЛАДКА ДОЛЖНА БЫТЬ ПРИМЕНЕНА, А НЕ ПРОСТО ПОЛУЧЕНА.
    // Без этого утверждения был бы ровно тот молчаливый отказ, за которым в
    // этом проекте уже охотились: координаты приходят с приращением, а
    // страница их игнорирует и считает раскладку сама. Всё выглядит
    // исправным — узлы на местах, разброс нормальный, — и только у двух
    // человек картины разные.
    //
    // Добавление концепции ЗАДЕВАЕТ раскладку, значит сервер её дорастил и
    // прислал. Сверяем поточечно: страница обязана стоять там, где сказал
    // сервер, а не там, куда её привела своя укладка.
    const хранимая = await currentLayout(pool);
    if (!хранимая) {
      проверить('серверная раскладка есть', false, 'есть', 'НЕТ — growLayout не сработал');
    } else {
      const расхожд = Object.entries(сНовым.места)
        .filter(([id]) => хранимая.позиции[id])
        .map(([id, [x, y]]) => Math.hypot(x - хранимая.позиции[id][0],
                                          y - хранимая.позиции[id][1]))
        .sort((a2, b2) => a2 - b2);
      const медРасх = расхожд.length ? расхожд[Math.floor(расхожд.length / 2)] : Infinity;
      проверить('серверная раскладка ПРИМЕНЕНА страницей',
        медРасх < 5, '<5 точек от присланных координат',
        Number.isFinite(медРасх) ? медРасх.toFixed(2) : 'сверять нечего');
      // Второе утверждение спрашивает СЕРВЕР, а не страницу: страница
      // отдаёт места лишь части узлов (видимых), и сверять их число с
      // числом узлов графа значило бы мерить не то. Первая редакция этого
      // утверждения так и падала — 60 из 454.
      проверить('раскладка покрывает весь граф',
        Object.keys(хранимая.позиции).length === сНовым.узлов,
        сНовым.узлов, Object.keys(хранимая.позиции).length);
    }
  }

  проверить('новый узел дошёл до клиента', сНовым.узлов === до.узлов + 1,
    до.узлов + 1, сНовым.узлов);
  проверить('у нового узла есть координаты',
    сНовым.сКоординатами === сНовым.узлов, сНовым.узлов, сНовым.сКоординатами);
  проверить('новый узел не выброшен за пределы полотна',
    await pageHtml.evaluate(`(() => {
      const у = window.__app.DATA.nodes.find(н => н.id === 'проба_живого');
      if (!у) return 'узла нет';
      const п = window.__app.S;
      return Math.abs(у.x) < п.viewWidth * 4 && Math.abs(у.y) < п.viewHeight * 4;
    })()`) === true, 'близко к середине', 'улетел');

  // ── 4. удаление не оставляет мёртвых связей ───────────────────────────
  // ЗДЕСЬ ЖДАТЬ НАХОДКУ: правка, снявшая исчезновение графа, этого случая
  // НЕ покрывает. Связи удалённой концепции должны уйти вместе с ней.
  const связейДоУдаления = сНовым.связей;
  await directCommit(pool, { actor: актор, message: 'проба: удаление концепции',
    changes: [{ action: 'delete', kind: 'concept', entityId: 'проба_живого' }] });
  await прокрутитьРаботника(pool);
  await ждать(3000);
  const сУдалённым = await mfaState();

  проверить('удалённый узел ушёл с клиента', сУдалённым.узлов === до.узлов,
    до.узлов, сУдалённым.узлов);
  проверить('МЁРТВЫХ СВЯЗЕЙ НЕТ (концы существуют)',
    сУдалённым.мёртвыхСвязей === 0, 0, сУдалённым.мёртвыхСвязей);
  проверить('связей не прибавилось из ниоткуда',
    сУдалённым.связей <= связейДоУдаления, `≤${связейДоУдаления}`, сУдалённым.связей);
  проверить('граф ВИДЕН после удаления', (await закрашено()) > 0.2, '>0.20',
    (await закрашено())?.toFixed(3));

  // ── 4б. ФАЗЫ ШИНЫ ДЕРЖАТ ПОРЯДОК (F-4, п. 13) ────────────────────────
  //
  // Прежде порядок держался на порядке ЗАПИСИ подписок, и о его значимости
  // знал лишь тот, кто однажды на нём погорел. Теперь фаза объявлена, и
  // проверяется главное: очередь не зависит от того, кто когда подписался.
  //
  // ПОДЛОГ ПРЯМО В ПРОБЕ: подписываемся на `data-changed` ПОЗЖЕ всех, но с
  // ранней фазой, и смотрим, вызовут ли нас РАНЬШЕ отрисовки. При старом
  // устройстве такой подписчик попал бы в самый хвост.
  const порядок = await pageHtml.evaluate(`(() => {
    window.__порядок = [];
    window.__app.subscribe('data-changed', () => window.__порядок.push('поздний-derived'), 'derived');
    window.__app.subscribe('data-changed', () => window.__порядок.push('поздний-ui'), 'ui');
    window.__app.emit('data-changed', {});
    return window.__порядок.join(',');
  })()`);
  проверить('ФАЗА ВАЖНЕЕ ПОРЯДКА ЗАПИСИ',
    порядок === 'поздний-derived,поздний-ui', 'derived раньше ui', порядок);

  // СПРАШИВАЕМ ПО ДЕЙСТВИЮ, А НЕ ПО НУТРУ. `busSubscribers` наружу не
  // вывозится, и требовать этого ради пробы значило бы менять устройство
  // под прибор: подписчик с выдуманной фазой просто не должен вызываться.
  проверить('подписчик с неизвестной фазой не вызывается',
    await pageHtml.evaluate(`(() => {
      window.__выдумка = 0;
      window.__app.subscribe('data-changed', () => window.__выдумка++, 'выдуманная');
      window.__app.emit('data-changed', {});
      return window.__выдумка === 0;
    })()`), 'не вызван', 'вызван');

  // ── 4а. РАЗРЫВ И ДОГОН (C-4, §9) ─────────────────────────────────────
  //
  // Клиент, переживший разрыв, обязан догнать пропущенное САМ. Иначе
  // страница тихо показывает вчерашний граф — и это хуже пустого экрана:
  // пустой виден, а устаревший выглядит исправным.
  const версияДоРазрыва = (await mfaState()).версия;
  await pageHtml.evaluate(`(() => {
    // Разрыв изображается закрытием сокета, а не выключением сети: так
    // ведёт себя усыпивший вкладку телефон или упавший узел.
    if (window.__app.S.liveSocket) window.__app.S.liveSocket.close();
  })()`);
  await ждать(600);

  // БАЗУ БЕРЁМ НАСТОЯЩУЮ. С base: null слияние даёт СТОЛКНОВЕНИЕ, правка не
  // ложится вовсе — и тогда «в разрыве клиент не знает» сходится само
  // собой, не проверив ничего. Прибор, зелёный оттого, что ничего не
  // произошло, хуже красного.
  const базаНус = await pageHtml.evaluate(
    `(window.__app.DATA.concepts.find(к => к.id === 'nous') || {}).description || null`);
  await directCommit(pool, { actor: актор, message: 'проба: правка во время разрыва',
    changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                fields: { description: {
                  base: базаНус, next: 'изменено, пока клиент был в разрыве' } } }] });
  await прокрутитьРаботника(pool);
  await ждать(1200);

  // СВЯЗЬ КЛИЕНТ ЧИНИТ САМ, И ЭТО ГЛАВНОЕ, ЧТО ЗДЕСЬ ПРОВЕРЯЕТСЯ.
  // Первая редакция утверждала «пока связи нет, клиент не знает о правке»
  // — и падала: за секунду с небольшим страница успевала переподключиться
  // (liveRetry, пауза 500 мс с удвоением) и догнать. Утверждение мерило
  // бы расторопность пробы, а не поведение клиента. Проверяем сильнее:
  // догон происходит БЕЗ ЕДИНОГО вмешательства снаружи.
  const вРазрыве = await mfaState();
  await ждать(2500);
  const послеДогона = await mfaState();
  проверить('КЛИЕНТ САМ ВОССТАНОВИЛ СВЯЗЬ И ДОГНАЛ',
    послеДогона.версия > версияДоРазрыва, `>${версияДоРазрыва}`, послеДогона.версия);
  проверить('догон принёс именно пропущенное',
    await pageHtml.evaluate(
      `/пока клиент был в разрыве/.test((window.__app.DATA.concepts
         .find(к => к.id === 'nous') || {}).description || '')`),
    'правка на месте', 'не догнал');
  проверить('граф ВИДЕН после догона', (await закрашено()) > 0.2, '>0.20',
    (await закрашено())?.toFixed(3));
  проверить('догон не задвоил узлы', послеДогона.узлов === вРазрыве.узлов,
    вРазрыве.узлов, послеДогона.узлов);
  проверить('мёртвых связей после догона нет', послеДогона.мёртвыхСвязей === 0,
    0, послеДогона.мёртвыхСвязей);

  // ── 5. повторное чтение ничего не двоит ──────────────────────────────
  await pageHtml.evaluate(`window.__app.pullGraphSince()`);
  await ждать(1500);
  const повтор = await mfaState();
  проверить('повторное приращение не двоит узлы',
    повтор.узлов === сУдалённым.узлов, сУдалённым.узлов, повтор.узлов);
  проверить('повторное приращение не двоит связи',
    повтор.связей === сУдалённым.связей, сУдалённым.связей, повтор.связей);

  // ── 6. ДВЕ ВКЛАДКИ ОДНОГО ЧЕЛОВЕКА (F-5, п. 14 ревизии) ──────────────
  //
  // До сих пор все пробы держали ОДНУ страницу, и целый род бед оставался
  // невидимым: человек работает в двух вкладках, сеанс у него один, а
  // состояние в каждой своё. Проверяется, что вкладки СХОДЯТСЯ, а не что
  // они одинаковы в каждый миг: сходимость — обещание, одновременность —
  // нет.
  const вкладкаБ = await браузер.newPage();
  вкладкаБ.on('pageerror', e => ошибки.push('вкладка Б: ' + String(e).slice(0, 160)));
  await вкладкаБ.goto(`http://127.0.0.1:${ПОРТ}/index.html`,
    { waitUntil: 'domcontentloaded' });
  await вкладкаБ.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
  await вкладкаБ.waitForFunction('window.__appReady === true', { timeout: 20000 });
  await ждать(2000);

  // ВХОД НЕ ПОВТОРЯЕТСЯ: сеанс лежит в cookie, и вторая вкладка того же
  // браузера должна признать его сама. Если бы не признала — человеку
  // пришлось бы входить в каждой вкладке отдельно.
  // СОКЕТ НЕ ВЫВОЗИТСЯ НАРУЖУ — спрашиваем СЕРВЕР, сколько соединений он
  // держит. Первый замер смотрел `window.__app.liveSocket` и видел
  // undefined; это ничего не значило, кроме того, что имя не вывезено.

  проверить('ВТОРАЯ ВКЛАДКА УЗНАЁТ СЕАНС БЕЗ ПОВТОРНОГО ВХОДА',
    await вкладкаБ.evaluate(
      `!!(window.__app.authSession && window.__app.authSession.user)`),
    'узнала', 'просит войти заново');
  проверить('и это тот же человек',
    (await вкладкаБ.evaluate(`window.__app.authSession.user.username`))
      === (await pageHtml.evaluate(`window.__app.authSession.user.username`)),
    'тот же', await вкладкаБ.evaluate(`window.__app.authSession.user.username`));

  const версияА = await pageHtml.evaluate(`window.__app.knownGraphVersion`);
  const версияБ = await вкладкаБ.evaluate(`window.__app.knownGraphVersion`);
  проверить('обе вкладки знают одну версию графа', версияА === версияБ,
    версияА, версияБ);

  // СОКЕТ У КАЖДОЙ ВКЛАДКИ СВОЙ. Спрашивается у СЕРВЕРА, а не у страницы:
  // `liveSocket` наружу не вывозится, и `undefined` в замере значил бы лишь
  // то, что имя не вывезено, — на этом я потерял полчаса.
  проверить('у каждой вкладки СВОЙ сокет, а не один на двоих',
    узелСервера.узел.соединения.всего() >= 2, '≥2',
    узелСервера.узел.соединения.всего());

  // ПРАВКА В ОДНОЙ ВКЛАДКЕ ДОХОДИТ ДО ДРУГОЙ. Это и есть главное: две
  // вкладки одного человека — тот же случай, что два человека, и обе
  // должны сойтись, не перезаписав друг друга молча.
  const адресДляДвух = await pageHtml.evaluate(`window.__app.DATA.concepts[2].id`);
  const описаниеДляДвух = await pageHtml.evaluate(
    `window.__app.DATA.concepts[2].description ?? null`);
  // ПРАВИТ ТОТ, У КОГО ЕСТЬ ПРАВО. Вкладка А открыта ЧИТАТЕЛЕМ — ему
  // править нельзя, и первая редакция получала «недостаточно прав»,
  // выглядело же это как несходимость вкладок. Правка идёт службой от
  // имени редактора, тем же путём, что и остальные правки в этой пробе.
  const редакторСвежий = await findById(pool, второй.user.userId);
  await directCommit(pool, { actor: редакторСвежий,
    message: 'проба: правка для двух вкладок',
    changes: [{ action: 'edit', kind: 'concept', entityId: адресДляДвух,
                fields: { description: { base: описаниеДляДвух,
                                         next: 'правка для двух вкладок' } } }] });

  // РАБОТНИК ИСХОДЯЩИХ ПРОКРУЧИВАЕТСЯ ЯВНО. Без него извещение лежит в
  // ящике, сокет молчит, и обе вкладки остаются при старом графе — а
  // выглядит это как несходимость вкладок. Тот же порядок, что и в
  // остальных проверках этой пробы.
  await прокрутитьРаботника(pool);
  await ждать(3000);

  const сразу = await вкладкаБ.evaluate(`(() => {
    const c = window.__app.DATA.concepts.find(c => c.id === ${JSON.stringify(адресДляДвух)});
    return c ? c.description : null;
  })()`);
  проверить('ВКЛАДКА Б ДОГНАЛА САМА (живое обновление)',
    сразу === 'правка для двух вкладок', 'правка для двух вкладок', сразу);

  await вкладкаБ.evaluate(`window.__app.pullGraphSince()`);
  await ждать(1500);

  const уБ = await вкладкаБ.evaluate(`(() => {
    const c = window.__app.DATA.concepts.find(c => c.id === ${JSON.stringify(адресДляДвух)});
    return c ? c.description : null;
  })()`);
  проверить('и по требованию догоняет наверняка',
    уБ === 'правка для двух вкладок', 'правка для двух вкладок', уБ);

  const послеПравкиА = await pageHtml.evaluate(`window.__app.knownGraphVersion`);
  const послеПравкиБ = await вкладкаБ.evaluate(`window.__app.knownGraphVersion`);
  проверить('версии графа СОШЛИСЬ после правки',
    послеПравкиА === послеПравкиБ, послеПравкиА, послеПравкиБ);

  // Счёт непрочитанного — личный, и он тоже должен сходиться: извещение
  // приходит по сеансу, а не по вкладке.
  const счётА = await pageHtml.evaluate(`window.__app.unreadCount`);
  const счётБ = await вкладкаБ.evaluate(`window.__app.unreadCount`);
  проверить('счёт непрочитанного одинаков в обеих вкладках',
    счётА === счётБ, счётА, счётБ);

  await вкладкаБ.close();

  проверить('ошибок страницы нет ни одной', ошибки.length === 0, 0,
    ошибки.slice(0, 2).join(' | '));

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 120));
} finally {
  await браузер?.close();
  await узелСервера.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(58, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
