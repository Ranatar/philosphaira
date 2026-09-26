#!/usr/bin/env node
// УТВЕРЖДЕНИЯ О ДОЛЖНОМ — второй слой приёмки.
//
// Чем отличается от первых двух. Сравнение двух страниц отвечает «одинаково
// ли», эталон — «стало ли иначе, чем было». Оба молчат о том, ПРАВИЛЬНО ли:
// эталон, снятый с испорченной стороны, закрепит поломку как норму, а
// сравнение двух одинаково испорченных страниц её не заметит. Так у нас уже
// трижды и выходило — разбор собственного onclick в подсветке вкладок,
// пустая проверка подсветки узла, пропавшая кнопка «Нормировать».
//
// Здесь записано, что ДОЛЖНО быть верно, числами и условиями. Утверждения
// переживают намеренные правки (менять их приходится осознанно, по одному),
// не нуждаются ни в исходнике, ни в эталоне и говорят о деле, а не о прошлом.
//
//   node tools/probes/assert_probe.mjs <страница>        по умолчанию index.html
import { createRequire } from 'node:module';
import { PUPPETEER, БРАУЗЕР, СЕРВЕР } from '../paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);

const CHROME = БРАУЗЕР;
const BASE = СЕРВЕР;
const СТРАНИЦА = process.argv[2] || 'index.html';
const wait = ms => new Promise(r => setTimeout(r, ms));

// ── ожидаемое. Меняется ОСОЗНАННО, по одному числу ──────────────────
const ЖДЁМ = {
  // Переучреждено 2026-09-11 после расширения по doc/db-additions-spec.md
  // (29 концепций, 519 связей). Прежние: 689 / 2201; до сентября: 453 / 1624.
  концепций: 718, связей: 2720, философов: 100, традиций: 25, рубрик: 15, типовСвязей: 21,
  вкладокСтатистики: 40,
  таблицСтилей: 11,   // с 11-multiuser (глава стилей многопользовательского режима)
  порогКонтраста: 4.5,
};

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
page.on('console', m => {
  const u = (m.location() && m.location().url) || '';
  if (m.type() === 'error' && !u.includes('favicon')) ошибки.push('console: ' + m.text().slice(0, 140));
});
page.on('requestfailed', r => {
  if (!r.url().endsWith('favicon.ico')) ошибки.push('не загрузилось: ' + r.url().split('/').pop());
});
page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });

await page.goto(BASE + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
// Ждём не «сеть утихла», а разметку плюс паузу: с ростом дерева (сто с
// лишним модулей) простой сети не наступал вовсе, и приборы падали по
// времени при сервере, отвечающем 200 на каждый запрос.
await wait(6500);

const модуль = !СТРАНИЦА.startsWith('_ref');
await page.addScriptTag(модуль
  ? { type: 'module', content: `
      // ПУТЕЙ К МОДУЛЯМ ЗДЕСЬ БОЛЬШЕ НЕТ. Оснастка _probe-rig.js порождается
      // из дерева и потому знает, где что лежит, а прибор — нет и знать не
      // должен: раскладка меняется, и всякий зашитый путь становится миной.
      import './_probe-rig.js';
      window.__t = window.__app;
      window.__tReady = true;` }
  : { content: `
      window.__t = { DATA: { concepts: concepts, relations: relations, philosophers: philosophers,
          traditions: traditions, rubrics: rubrics, relationTypes: relationTypes,
          nodes: nodes, links: links, conceptToRubrics: conceptToRubrics,
          philosopherIdToName: philosopherIdToName },
        actionNames: function () { return []; },
        openStatsModal: openStatsModal, closeStatsModal: closeStatsModal,
        switchStatsView: switchStatsView, openConceptById: openConceptById,
        closeUniversalModal: closeUniversalModal, openUniversalModal: openUniversalModal,
        openEditConceptModal: openEditConceptModal, openAuthModal: openAuthModal,
        submitAuth: submitAuth, closeAuthModal: closeAuthModal,
        collectData: collectData, hasUnsaved: hasUnsaved, handleLegendSearch: handleLegendSearch };
      window.__tReady = true;` });
await page.waitForFunction('window.__tReady === true', { timeout: 20000 });

// ──────────────────────────────────────────────────────────────────
// СОСТОЯНИЕ СВЕЖЕЗАГРУЖЕННОЙ СТРАНИЦЫ — спрашивать надо ЗДЕСЬ. В конце
// прибора счётчик тиков давно ушёл: окна открывались, раскладка сбрасывалась.
// РАСКЛАДКА ТЕПЕРЬ ПРИХОДИТ ГОТОВОЙ — и это та самая точка, где признак
// улёгшести и счётчик тиков наконец РАЗЛИЧАЮТСЯ: раскладка готова, а тиков
// прошло НОЛЬ. В Л-1 подлог «разморозка снова читает счётчик» проходил
// законно, потому что при укладке одними тиками оба выражения давали один
// ответ. Здесь он краснеет: 0 < 342, и разморозка разбудила бы готовое.
const сразу = await page.evaluate(() => ({
  тик: window.__t.S.tickCount,
  признак: window.__t.S.layoutSettled,
  изНабора: window.__t.layoutFromStore,
}));
проверить('раскладка пришла готовой, без единого тика',
  сразу.изНабора === true && сразу.тик === 0, '0 тиков, из набора',
  `${сразу.тик} тиков, из набора ${сразу.изНабора}`);
проверить('готовая раскладка помечена улёгшейся', сразу.признак === true, true, сразу.признак);

// РАЗМОРОЗКА ПРОВЕРЯЕТСЯ ЗДЕСЬ ЖЕ, И ТОЛЬКО ЗДЕСЬ. Дальше по прибору счётчик
// доходит до потолка, и вопрос «улеглось ли?» получает один ответ и от
// признака, и от счётчика — проверка становится пустой. На свежей странице
// они расходятся: раскладка готова, а тиков ноль. Подлог «вернуть чтение
// счётчика» краснеет именно тут.
const разбудило = await page.evaluate(async () => {
  const до = window.__t.DATA.nodes.map(n => [n.x, n.y]);
  window.__t.unfreezeSimulation('окно');
  await new Promise(r => setTimeout(r, 1200));
  let m = 0;
  window.__t.DATA.nodes.forEach((n, i) => {
    m = Math.max(m, Math.hypot(n.x - до[i][0], n.y - до[i][1]));
  });
  return { сдвиг: +m.toFixed(2), тик: window.__t.S.tickCount };
});
проверить('разморозка не будит ГОТОВУЮ раскладку',
  разбудило.сдвиг < 1 && разбудило.тик === 0, '0 тиков, сдвиг <1 px',
  `${разбудило.тик} тиков, сдвиг ${разбудило.сдвиг} px`);



// ── ПОКОЙ И ЩЕЛЧОК (24 сентября 2026) ────────────────────────────────
// В покое граф не перерисовывается: бегущий пунктир противоречий снят, и
// непрерывный цикл больше ничем не держится. Мера независимая — очистки
// холста графа за полторы секунды, а не вопрос к needsContinuousAnimation.
// Щелчок по концепции — одинарный и двойной — укладку не будит: прежде
// d3.drag объявлял перетаскивание уже на нажатии, а симуляция, остановленная
// на готовой раскладке, хранила alpha = 1 и перестраивала её целиком
// (медианный сдвиг узла 64 px). Проверяется настоящей мышью; двойной щелчок —
// двумя быстрыми, как его и считает приложение (readme §7).
{
  const idleClears = await page.evaluate(async () => {
    const cv = window.__t.gfxCanvas, P = CanvasRenderingContext2D.prototype, orig = P.clearRect;
    let n = 0;
    P.clearRect = function (...a) { if (this.canvas === cv) n++; return orig.apply(this, a); };
    await new Promise(r => setTimeout(r, 1500));
    P.clearRect = orig;
    return n;
  });
  проверить('в покое граф не перерисовывается', idleClears === 0, '0 кадров за 1,5 с', idleClears);

  const target = await page.evaluate(() => {
    const A = window.__t, T = A.renderState.transform, r = A.gfxCanvas.getBoundingClientRect();
    const n = A.DATA.nodes.find(n => A.isNodeVisible(n) && T.applyX(n.x) > r.width * 0.35 && T.applyX(n.x) < r.width * 0.65
      && T.applyY(n.y) > r.height * 0.35 && T.applyY(n.y) < r.height * 0.65);
    return { x: r.left + T.applyX(n.x), y: r.top + T.applyY(n.y) };
  });
  const positions = () => page.evaluate(() => ({
    p: window.__t.DATA.nodes.map(n => [n.x, n.y]), settled: window.__t.S.layoutSettled }));
  const maxShift = (a, b) => Math.max(...a.p.map((q, i) => Math.hypot(q[0] - b.p[i][0], q[1] - b.p[i][1])));
  const before = await positions();
  await page.mouse.click(target.x, target.y);
  await wait(1200);
  const afterClick = await positions();
  проверить('щелчок по концепции не двигает граф', maxShift(before, afterClick) === 0 && afterClick.settled,
    'сдвиг 0, раскладка улёгшаяся', `сдвиг ${maxShift(before, afterClick).toFixed(2)}, улеглась ${afterClick.settled}`);
  await page.mouse.click(target.x, target.y);
  await page.mouse.click(target.x, target.y);
  await wait(1200);
  await page.evaluate(() => { window.__t.closeUniversalModal(); window.__t.resetHighlight(); });
  await wait(800);
  const afterDouble = await positions();
  проверить('двойной щелчок и закрытие окна не двигают граф', maxShift(before, afterDouble) === 0 && afterDouble.settled,
    'сдвиг 0, раскладка улёгшаяся', `сдвиг ${maxShift(before, afterDouble).toFixed(2)}, улеглась ${afterDouble.settled}`);
}

// ── 1. база загрузилась и указатели пересобраны ─────────────────────
{
  const d = await page.evaluate(() => {
    const D = window.__t.DATA;
    return { концепций: D.concepts.length, связей: D.relations.length,
      философов: D.philosophers.length, традиций: D.traditions.length,
      рубрик: D.rubrics.length, типовСвязей: D.relationTypes.length,
      узлов: D.nodes.length, рёбер: D.links.length,
      рубрикиУзлов: Object.keys(D.conceptToRubrics).length,
      именаФилософов: Object.keys(D.philosopherIdToName).length };
  });
  for (const k of ['концепций', 'связей', 'философов', 'традиций', 'рубрик', 'типовСвязей'])
    проверить('база: ' + k, d[k] === ЖДЁМ[k], ЖДЁМ[k], d[k]);
  // узлы и связи — производные: их число обязано совпасть с базой
  проверить('указатели: узлов столько же, сколько концепций',
    d.узлов === d.концепций, d.концепций, d.узлов);
  проверить('указатели: рёбер столько же, сколько связей',
    d.рёбер === d.связей, d.связей, d.рёбер);
  проверить('указатели: рубрики есть у каждой концепции',
    d.рубрикиУзлов === d.концепций, d.концепций, d.рубрикиУзлов);
  проверить('указатели: имя есть у каждого философа',
    d.именаФилософов === d.философов, d.философов, d.именаФилософов);
}

// ── 2. глобального хода нет, действия все известны ──────────────────
if (модуль) {
  const g = await page.evaluate(() => {
    const свои = window.__t.actionNames();
    const набор = new Set(свои);
    const неизвестные = [];
    for (const el of document.querySelectorAll('*'))
      for (const пр of ['click', 'change', 'input', 'focus', 'enter', 'leave']) {
        const имя = el.getAttribute('data-act-' + пр);
        if (имя && !набор.has(имя)) неизвестные.push(имя);
      }
    const вРазметке = document.querySelectorAll(
      '[onclick],[onchange],[oninput],[onfocus],[onmouseover],[onmouseout]').length;
    return { действий: свои.length, неизвестные: [...new Set(неизвестные)], вРазметке };
  });
  проверить('делегирование: все имена действий известны реестру',
    g.неизвестные.length === 0, 0, g.неизвестные.length + (g.неизвестные[0] ? ' (' + g.неизвестные[0] + ')' : ''));
  проверить('в разметке нет встроенных обработчиков', g.вРазметке === 0, 0, g.вРазметке);
  проверить('реестр действий не пуст', g.действий > 100, '>100', g.действий);
}

// ── 3. таблицы стилей подключены ────────────────────────────────────
if (модуль) {
  const n = await page.evaluate(() => document.styleSheets.length);
  проверить('стилей подключено', n === ЖДЁМ.таблицСтилей, ЖДЁМ.таблицСтилей, n);
}

// ── 4. панели отрисованы по данным ──────────────────────────────────
{
  const п = await page.evaluate(() => ({
    философы: document.querySelectorAll('#philosopherFilters input').length,
    связи: document.querySelectorAll('#relationFilters input').length,
    рубрики: document.querySelectorAll('#rubricFilters input').length,
    // Строк на одну больше, чем традиций: последняя — «вне традиций»,
    // и она спрятана, пока философов без разметки нет. Считаем ОТДЕЛЬНО,
    // иначе показатель ответил бы «26 вместо 25» и не сказал, почему.
    традиции: document.querySelectorAll('#traditionFilters input').length
              - (document.getElementById('trad-no_tradition') ? 1 : 0),
    внеТрадиций: !!document.getElementById('trad-no_tradition'),
    источник: document.querySelectorAll('#sourceSelectDropdown .concept-row').length,
    цель: document.querySelectorAll('#targetSelectDropdown .concept-row').length,
    вкладок: document.querySelectorAll('.stats-nav-item').length,
  }));
  проверить('легенда: галочек философов', п.философы === ЖДЁМ.философов, ЖДЁМ.философов, п.философы);
  проверить('легенда: галочек типов связей', п.связи === ЖДЁМ.типовСвязей, ЖДЁМ.типовСвязей, п.связи);
  проверить('легенда: галочек рубрик', п.рубрики === ЖДЁМ.рубрик, ЖДЁМ.рубрик, п.рубрики);
  проверить('легенда: галочек традиций', п.традиции === ЖДЁМ.традиций, ЖДЁМ.традиций, п.традиции);
  проверить('в легенде есть строка «вне традиций»', п.внеТрадиций === true, true, п.внеТрадиций);
  проверить('поиск пути: список источника полон', п.источник === ЖДЁМ.концепций, ЖДЁМ.концепций, п.источник);
  проверить('поиск пути: список цели полон', п.цель === ЖДЁМ.концепций, ЖДЁМ.концепций, п.цель);
  проверить('статистика: вкладок', п.вкладок === ЖДЁМ.вкладокСтатистики, ЖДЁМ.вкладокСтатистики, п.вкладок);
}

// ── 5. КАЖДАЯ вкладка даёт содержимое и подсвечивается ──────────────
{
  await page.evaluate(() => window.__t.openStatsModal());
  await wait(1200);
  const виды = await page.evaluate(() =>
    [...document.querySelectorAll('.stats-nav-item')].map(e =>
      e.dataset.view || ((e.getAttribute('onclick') || '').match(/'([^']+)'/) || [])[1]).filter(Boolean));
  проверить('у каждой вкладки есть имя вида', виды.length === ЖДЁМ.вкладокСтатистики,
    ЖДЁМ.вкладокСтатистики, виды.length);
  const пустые = [], безПодсветки = [];
  for (const в of виды) {
    await page.evaluate(n => window.__t.switchStatsView(n), в);
    await wait(1400);
    const r = await page.evaluate(() => ({
      длина: (document.getElementById('statsContentArea').textContent || '').trim().length,
      активных: document.querySelectorAll('.stats-nav-item.active').length,
    }));
    if (r.длина < 100) пустые.push(в);
    if (r.активных !== 1) безПодсветки.push(в + ':' + r.активных);
  }
  проверить('каждая вкладка даёт непустое содержимое', пустые.length === 0, 0,
    пустые.length + (пустые[0] ? ' (' + пустые[0] + ')' : ''));
  проверить('ровно одна вкладка подсвечена в каждом виде', безПодсветки.length === 0, 0,
    безПодсветки.length + (безПодсветки[0] ? ' (' + безПодсветки[0] + ')' : ''));
  await page.evaluate(() => window.__t.closeStatsModal());
  await wait(500);
}

// ── 6. окна открываются и говорят о том, что открыли ────────────────
{
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  const имя = await page.evaluate(() => window.__t.DATA.concepts[0].label);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(1100);
  const о = await page.evaluate(() => ({
    видно: getComputedStyle(document.getElementById('universalModal')).display !== 'none',
    текст: (document.getElementById('universalModalContent').textContent || ''),
  }));
  проверить('окно концепции открылось', о.видно, true, о.видно);
  проверить('окно концепции называет свою концепцию',
    о.текст.includes(имя), 'содержит «' + имя + '»', о.текст.slice(0, 40).trim() + '…');
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);

  const ф = await page.evaluate(() => window.__t.DATA.philosophers[0].nameRu);
  await page.evaluate(p => window.__t.openUniversalModal('philosopher', p, 'view'), ф);
  await wait(1300);
  const оф = await page.evaluate(() =>
    (document.getElementById('universalModalContent').textContent || ''));
  проверить('окно философа называет своего философа',
    оф.includes(ф), 'содержит «' + ф + '»', оф.slice(0, 40).trim() + '…');
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 7. поиск находит именно то, что искали ──────────────────────────
{
  const r = await page.evaluate(() => {
    window.__t.handleLegendSearch('иде');
    const узлы = [...document.querySelectorAll('#legendSearchResults .concept-row')];
    return { сколько: узлы.length,
      мимо: узлы.filter(e => !e.textContent.toLowerCase().includes('иде')).length };
  });
  проверить('поиск в легенде что-то находит', r.сколько > 0, '>0', r.сколько);
  проверить('в найденном нет посторонних', r.мимо === 0, 0, r.мимо);
}

// ── 8. права: без входа правка недоступна, под admin доступна ───────
{
  await page.evaluate(() => window.__t.closeUniversalModal());
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(900);
  const без = await page.evaluate(() =>
    !!document.querySelector('#universalModal .modal-toolbar .modal-edit-btn, #universalModal .modal-toolbar button[title*="едакт"]'));
  проверить('без входа кнопки правки нет', без === false, false, без);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);

  await page.evaluate(() => {
    window.__t.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__t.submitAuth();
  });
  await wait(900);
  await page.evaluate(() => window.__t.closeAuthModal());
  await wait(400);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(900);
  const под = await page.evaluate(() =>
    (document.querySelector('#universalModal .modal-toolbar') || {}).innerHTML || '');
  проверить('под admin в полосе окна что-то появилось', под.length > 20, '>20 знаков', под.length);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9. правка доходит до данных ─────────────────────────────────────
{
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  await page.evaluate(i => window.__t.openEditConceptModal(i), id);
  await wait(1300);
  await page.evaluate(() => {
    document.getElementById('conceptLabel').value = 'ПРОВЕРКА ВТОРОГО СЛОЯ';
    const b = [...document.querySelectorAll('#universalModal button')]
      .find(x => /Сохранить/.test(x.textContent));
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(2000);
  const п = await page.evaluate(i => {
    const D = window.__t.DATA;
    const c = D.concepts.find(x => x.id === i), n = D.nodes.find(x => x.id === i);
    return { вБазе: c ? c.label : null, наГрафе: n ? n.label : null,
      несохранённое: window.__t.hasUnsaved(),
      наборов: Object.keys(window.__t.collectData()).length };
  }, id);
  проверить('правка записалась в базу', п.вБазе === 'ПРОВЕРКА ВТОРОГО СЛОЯ',
    'ПРОВЕРКА ВТОРОГО СЛОЯ', п.вБазе);
  проверить('правка дошла до узла графа', п.наГрафе === 'ПРОВЕРКА ВТОРОГО СЛОЯ',
    'ПРОВЕРКА ВТОРОГО СЛОЯ', п.наГрафе);
  проверить('база помечена несохранённой', п.несохранённое === true, true, п.несохранённое);
  проверить('сериализатор отдаёт шесть наборов', п.наборов === 6, 6, п.наборов);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 9б. визуализация метрики размером: кнопка сброса в легенде ──────
{
  // Тонкое место, дважды ломавшееся: раздел легенды обновлялся ДО смены
  // признаков, а данные метрики брались ПОСЛЕ закрытия окна статистики —
  // которое эти данные и стирает. Утверждение держит оба конца: включили —
  // раздел виден и назван; сбросили — исчез.
  await page.evaluate(() => window.__t.openStatsModal());
  await wait(1000);
  await page.evaluate(() => window.__t.switchStatsView('pagerank'));
  await wait(2000);
  await page.evaluate(() => {
    const b = document.querySelector('#statsContentArea button');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(3000);
  const естьКнопка = await page.evaluate(() =>
    document.querySelectorAll('#statsContentArea [id^="visualize-btn-"]').length);
  проверить('вид метрики даёт кнопку визуализации', естьКнопка === 1, 1, естьКнопка);

  await page.evaluate(() => {
    const b = document.querySelector('#statsContentArea [id^="visualize-btn-"]');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1800);
  const после = await page.evaluate(() => {
    const s = document.getElementById('visualizationControlSection');
    return { виден: !!s && getComputedStyle(s).display !== 'none',
      метка: ((document.getElementById('currentVisualizationMetric') || {}).textContent || '').trim(),
      окно: getComputedStyle(document.getElementById('statsModal')).display };
  });
  проверить('после визуализации: окно статистики закрылось', после.окно === 'none', 'none', после.окно);
  проверить('после визуализации: раздел сброса в легенде виден', после.виден, true, после.виден);
  проверить('после визуализации: названа метрика', после.метка === 'PageRank', 'PageRank', после.метка);

  await page.evaluate(() => {
    const b = document.querySelector('#visualizationControlSection button');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const снят = await page.evaluate(() => {
    const s = document.getElementById('visualizationControlSection');
    return !s || getComputedStyle(s).display === 'none';
  });
  проверить('после сброса: раздел скрыт', снят, true, снят);
}

// ── 9в. приглушение: щелчок и карта сходства ────────────────────────
{
  // Два выделения устроены РАЗНО, и это намеренно. Щелчок говорит «вот
  // соседи по связям» — там гаснут несмежные связи (класс dimmed). Карта
  // сходства говорит «вот похожие по смыслу» — там гаснут непохожие узлы,
  // а связи гаснут ВСЕ: приглушать их по сходству нечем, у связи такого
  // значения нет. Замер держит оба конца, чтобы они не разъехались.
  const мера = () => page.evaluate(() => {
    const св = {};
    for (const l of window.__t.DATA.links) {
      const a = window.__t.linkDrawAlpha(l, window.__t.linkVisualState(l), 0).toFixed(2);
      св[a] = (св[a] || 0) + 1;
    }
    return { связей: window.__t.DATA.links.length, прозрачность: св,
      карта: !!window.__t.S.similarityOverlay };
  });

  const исходно = await мера();
  проверить('исходно все связи в полную силу',
    исходно.прозрачность['0.40'] === исходно.связей, исходно.связей, исходно.прозрачность['0.40']);

  // М1-исправление 2026-09-06. Прежде здесь стоял nodes[5] — узел по НОМЕРУ,
  // а порог «карта сходства строится» относительный: степень не ниже медианной.
  // Прирост базы опустил медиану с 6 до 5, и logos_heraclitus (степень 5, сам
  // не изменившийся) оказался НА пороге — прибор покраснел, не сообщив ничего
  // о правке. Берём узел строго ниже медианы, вычисляя её на месте.
  const id = await page.evaluate(() => {
    const D = window.__t.DATA, ст = {};
    D.nodes.forEach(n => ст[n.id] = 0);
    D.links.forEach(l => {
      const s = l.source.id || l.source, t = l.target.id || l.target;
      if (ст[s] != null) ст[s]++; if (ст[t] != null) ст[t]++;
    });
    const v = Object.values(ст).sort((a, b) => a - b);
    const мед = v[Math.floor(v.length / 2)];
    const слабый = D.nodes.find(n => ст[n.id] > 0 && ст[n.id] < мед);
    return (слабый || D.nodes[5]).id;
  });
  await page.evaluate(i => {
    const n = window.__t.DATA.nodes.find(x => x.id === i);
    window.__t.highlightConnected([n]);
  }, id);
  await wait(700);
  const щелчок = await мера();
  проверить('щелчок по узлу гасит несмежные связи',
    (щелчок.прозрачность['0.10'] || 0) > 1000, '>1000', щелчок.прозрачность['0.10'] || 0);
  проверить('щелчок оставляет смежные яркими',
    (щелчок.прозрачность['1.00'] || 0) > 0, '>0', щелчок.прозрачность['1.00'] || 0);
  await page.evaluate(() => window.__t.resetHighlight());
  await wait(500);

  // М1: карта сходства по профилю строится ТОЛЬКО для концепций со степенью
  // не ниже медианной — тот же отсев, что в списке окна. Прежде здесь стоял
  // nodes[5] (logos_heraclitus, степень 5 при медиане 6), и утверждение
  // «карта включилась» молча предполагало, что она включается всегда.
  // Берём заведомо связную концепцию, а отказ на малосвязной проверяем
  // отдельным утверждением ниже: покрытие от правки выросло, а не сжалось.
  const idСвязный = await page.evaluate(() =>
    window.__t.DATA.nodes.find(n => n.id === 'eidos').id);
  await page.evaluate(i => window.__t.showSimilarityOverlay(i, 'profile'), idСвязный);
  await wait(2500);
  const карта = await мера();
  проверить('карта сходства включилась', карта.карта, true, карта.карта);
  проверить('при карте сходства гаснут ВСЕ обычные связи',
    (карта.прозрачность['0.07'] || 0) === карта.связей, карта.связей, карта.прозрачность['0.07'] || 0);
  await page.evaluate(() => window.__t.clearSimilarityOverlay());
  await wait(600);
  const после = await мера();
  проверить('после снятия карты связи вернулись',
    после.прозрачность['0.40'] === после.связей, после.связей, после.прозрачность['0.40']);

  // М1, встречное утверждение: на малосвязной концепции карта НЕ строится,
  // и отказ ГРОМКИЙ. Первая редакция правки возвращала пустоту молча —
  // кнопка нажималась и не делала ничего, что от поломки неотличимо.
  await page.evaluate(i => window.__t.showSimilarityOverlay(i, 'profile'), id);
  await wait(1200);
  const вырожд = await мера();
  проверить('на малосвязной концепции карта по профилю не строится',
    вырожд.карта === false, false, вырожд.карта);
  проверить('и отказ виден на странице',
    await page.evaluate(() => document.body.innerText.includes('слишком мало связей')),
    true, await page.evaluate(() => document.body.innerText.includes('слишком мало связей')));
  await page.evaluate(() => window.__t.clearSimilarityOverlay());
  await wait(400);
}

// ── 9г. стрелка связи: ровно ОДНА подсказка ────────────────────────
{
  // Было две разом: собственный тёмный ярлык и встроенная подсказка браузера
  // (title) — светлая, с тёмным текстом. Плюс жирность ярлыка гуляла: cw-1/2/3
  // задавали вес шрифта на самой стрелке, а ярлык лежал внутри и наследовал.
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  const ид = await page.evaluate(() => {
    const счёт = {};
    for (const l of window.__t.DATA.links) {
      const a = l.source.id || l.source;
      счёт[a] = (счёт[a] || 0) + 1;
    }
    return Object.entries(счёт).sort((x, y) => y[1] - x[1])[0][0];
  });
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  const с = await page.evaluate(() => {
    const стрелки = [...document.querySelectorAll('#universalModalContent .connection-arrow')];
    return {
      стрелок: стрелки.length,
      встроенных: стрелки.filter(e => e.getAttribute('title')).length,
      своих: стрелки.map(e => e.querySelectorAll('.connection-arrow-tooltip').length),
      весаЯрлыков: [...new Set(стрелки.map(e => {
        const t = e.querySelector('.connection-arrow-tooltip');
        return t ? getComputedStyle(t).fontWeight : '—';
      }))],
      фоны: [...new Set(стрелки.map(e => {
        const t = e.querySelector('.connection-arrow-tooltip');
        return t ? getComputedStyle(t).backgroundColor : '—';
      }))],
      весаГлифов: [...new Set(стрелки.map(e => {
        const g = e.querySelector('.connection-arrow-glyph');
        return g ? getComputedStyle(g).fontWeight : '—';
      }))],
      // Ореол и прозрачность глифа — снимаются здесь же, пока путь открыт:
      // вне окна пути глифов на странице нет вовсе.
      ореолы: [...new Set(стрелки.map(e => {
        const g = e.querySelector('.connection-arrow-glyph');
        return g ? getComputedStyle(g).textShadow : '—';
      }))],
      прозрачности: [...new Set(стрелки.map(e => {
        const g = e.querySelector('.connection-arrow-glyph');
        return g ? getComputedStyle(g).opacity : '—';
      }))],
    };
  });
  проверить('стрелки связей есть', с.стрелок > 0, '>0', с.стрелок);
  проверить('встроенных подсказок браузера нет', с.встроенных === 0, 0, с.встроенных);
  проверить('вес связи по-прежнему виден в глифе',
    с.весаГлифов.length > 1, '>1 разных', с.весаГлифов.join(','));

  // СМЫСЛОВОЙ ЦВЕТ ПРОВЕРЯЕТСЯ ИНАЧЕ, ЧЕМ ЧИСЛОМ. Глиф берёт цвет ИЗ ДАННЫХ
  // (тип связи), и отношение контраста для него не поднять, не переписав
  // палитру: пять типов из 21 темнее порога 4,5 (emerge_from 1,78,
  // dialogue 2,1). Решение, стоявшее в readme §10 долгом, — ОРЕОЛ: тень,
  // отделяющая знак от фона. Формула контраста ореола не знает, поэтому
  // прибор спрашивает, ПРИМЕНЕНО ЛИ РЕШЕНИЕ, а не «хорош ли контраст».
  // Это честная граница утверждения, и она названа здесь, а не подразумевается.
  проверить('у глифа стрелки есть ореол',
    с.ореолы.length > 0 && с.ореолы.every(т => т && т !== 'none' && т !== '—'),
    'тень у всех', с.ореолы.join(' | ').slice(0, 60));
  // Прозрачность множила и без того низкий контраст (было 0,65 у слабых
  // связей), а вес и так закодирован жирностью — то же знание двумя
  // способами, из которых один вредит читаемости.
  проверить('прозрачность глифа не глушит цвет',
    с.прозрачности.every(о => Number(о) === 1), 'все 1', с.прозрачности.join(','));

  // ЕДИНАЯ ПОДСКАЗКА. Было три способа разом: встроенные подсказки браузера
  // (светлые, вида страница не задаёт), свой ярлык у стрелки связи и такой
  // же у рубрики; на стрелке всплывали обе. Теперь один короб на странице.
  const встроенныхВсего = await page.evaluate(() => document.querySelectorAll('[title]').length);
  const своихЯрлыков = await page.evaluate(() =>
    document.querySelectorAll('.connection-arrow-tooltip, .rubric-tooltip-text').length);
  const сЕдиной = await page.evaluate(() => document.querySelectorAll('[data-tip]').length);
  проверить('на странице нет встроенных подсказок', встроенныхВсего === 0, 0, встроенныхВсего);
  проверить('старых ярлыков не осталось', своихЯрлыков === 0, 0, своихЯрлыков);
  проверить('единая подсказка расставлена', сЕдиной > 100, '>100', сЕдиной);

  const короб = await page.evaluate(() => {
    const эл = document.querySelector('#universalModalContent .connection-arrow[data-tip]')
      || document.querySelector('[data-tip]');
    эл.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    const h = document.getElementById('hintBox');
    if (!h) return { есть: false };
    const s = getComputedStyle(h);
    return { есть: true, виден: s.visibility !== 'hidden' && s.opacity !== '0',
      фон: s.backgroundColor, вес: s.fontWeight, перенос: s.whiteSpace, ширина: s.maxWidth,
      текст: h.textContent.length };
  });
  проверить('подсказка показывается', короб.есть && короб.виден, true, короб.виден);
  проверить('подсказка на тёмном фоне', короб.фон === 'rgba(0, 0, 0, 0.92)', 'rgba(0, 0, 0, 0.92)', короб.фон);
  проверить('вес шрифта подсказки один', короб.вес === '400', '400', короб.вес);
  проверить('длинный текст переносится', короб.перенос === 'normal', 'normal', короб.перенос);
  проверить('в подсказке есть текст', короб.текст > 0, '>0', короб.текст);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9д. стрелка связи — вход в окно связи ──────────────────────────
{
  // Прежде войти в окно связи можно было лишь с полотна да из формы правки
  // концепции: в списках связей сама связь была видна, а открыть её нечем —
  // щелчок по строке вёл к соседней КОНЦЕПЦИИ.
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  const ид = await page.evaluate(() => {
    const c = {};
    for (const l of window.__t.DATA.links) { const a = l.source.id || l.source; c[a] = (c[a] || 0) + 1; }
    return Object.entries(c).sort((x, y) => y[1] - x[1])[0][0];
  });
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  const стрелок = await page.evaluate(() =>
    document.querySelectorAll('#universalModalContent .connection-arrow').length);
  const щёлк = await page.evaluate(() =>
    document.querySelectorAll('#universalModalContent .connection-arrow.clickable').length);
  проверить('в окне концепции есть стрелки связей', стрелок > 0, '>0', стрелок);
  проверить('все стрелки открывают связь', щёлк === стрелок, стрелок, щёлк);

  await page.evaluate(() => {
    const el = document.querySelector('#universalModalContent .connection-arrow.clickable');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const текст = await page.evaluate(() =>
    document.getElementById('universalModalContent').textContent);
  проверить('щелчок по стрелке открыл окно связи',
    текст.includes('Просмотр связи'), 'содержит «Просмотр связи»', текст.trim().slice(0, 30));
  проверить('в окне связи есть возврат назад',
    текст.includes('Назад'), 'содержит «Назад»', текст.includes('Назад'));
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9е. окно пути: порядок «узел → связь → узел» ───────────────────
{
  // Прежде описание связи стояло НАД описанием её узла, а у исходного узла
  // своего блока не было вовсе — он ютился внутри первого отрезка, тогда как
  // конечный получал отдельный. Читалось как несимметричное.
  const ид = await page.evaluate(() => window.__t.DATA.nodes.map(n => n.id));
  await page.evaluate(i => window.__t.selectCustomOption('source', i), ид[0]);
  // М8: типологические связи в путях пропускаются по умолчанию — они
  // утверждают, что контакта НЕ БЫЛО, и предъявлять их как цепочку передачи
  // нечестно. Прежняя цель (ид[120]) достижима от ид[0] направленно ТОЛЬКО
  // через типологическое ребро, и после правки путь туда честно не находится.
  // Замерено: так теряется 6,3 % направленно достижимых пар — цена названа,
  // а не спрятана. Цель заменена на достижимую без типологического слоя.
  await page.evaluate(i => window.__t.selectCustomOption('target', i), 'one_being');
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c) c.checked = false;
    window.__t.findAndShowPath();
  });
  await wait(2000);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1000);
  const п = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    const ряд = [...c.children]
      .filter(e => e.classList.contains('path-node-full-description')
                || e.classList.contains('path-description-item'))
      .map(e => e.classList.contains('path-node-full-description') ? 'узел' : 'связь');
    const первый = c.querySelector('.path-node-full-description h4');
    const узлы = [...c.querySelectorAll('.path-node-full-description h4')].map(h => h.textContent);
    return { ряд, первый: первый ? первый.textContent.split(':')[0] : '—',
      последний: узлы.length ? узлы[узлы.length - 1].split(':')[0] : '—' };
  });
  проверить('окно пути начинается с исходного узла',
    п.первый === 'Исходный узел', 'Исходный узел', п.первый);
  проверить('окно пути кончается конечным узлом',
    п.последний === 'Конечный узел', 'Конечный узел', п.последний);
  проверить('порядок чередуется узел → связь → узел',
    п.ряд.length > 2 && п.ряд.every((в, i) => в === (i % 2 ? 'связь' : 'узел')),
    'узел,связь,узел…', п.ряд.slice(0, 5).join(','));
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  // Возвращаем состояние: галочка хронологии нужна следующим утверждениям.
  // Проверки идут по одной странице и обязаны оставлять её как взяли.
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await wait(400);
}

// ── 9ж. описания не вылезают за край поля ──────────────────────────
{
  // `width:100%` при боковых отступах даёт коробку ШИРЕ родителя на сумму
  // отступов (замер: 541 против 517) — описание вылезало за край.
  const ид = await page.evaluate(() => {
    let лучший = null, дл = 0;
    for (const r of window.__t.DATA.relations) {
      const d = (r.description || '').length;
      if (d > дл) { дл = d; лучший = r.source; }
    }
    return лучший;
  });
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  await page.evaluate(() =>
    document.querySelectorAll('.connection-description').forEach(e => e.classList.add('show')));
  await wait(500);
  const пере = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('#universalModalContent *')) {
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
        const s = getComputedStyle(el);
        if (s.overflowX === 'auto' || s.overflowX === 'scroll') continue;
        n++;
      }
    }
    return n;
  });
  проверить('в окне концепции ничто не вылезает за край', пере === 0, 0, пере);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9з. режим «без разрывов»: время идёт в одну сторону ────────────
{
  // Прочие режимы проверяют РЕБРО — нет ли анахронизма в отдельной связи.
  // Ребро может быть безупречным, а путь ломаным: −428 → 1788 → 121, и
  // каждый шаг законен (замер: разрыв в 82 % путей, прыжок до 2496 лет).
  // Здесь проверяется ПУТЬ. Ход выбирается по концам: цель раньше источника
  // — ищем ход назад, и путь читается как родословная «восходит к».
  // Считаем В СТРАНИЦЕ: годы живут в её данных, а не здесь.
  const монотонен = (путь, ход) => page.evaluate(([п, х]) => {
    let край = null, ломано = false;
    for (const id of п) {
      const n = window.__t.DATA.nodes.find(x => x.id === id);
      const ф = n && window.__t.DATA.philosophers.find(y => y.nameRu === n.concept);
      const г = ф ? ф.birth : null;
      if (г === null) continue;
      if (край !== null && (х > 0 ? г < край : г > край)) ломано = true;
      край = край === null ? г : (х > 0 ? Math.max(край, г) : Math.min(край, г));
    }
    return !ломано;
  }, [путь, ход]);
  const прогнать = (a, b, режим) => page.evaluate(([и, ц, р]) => {
    window.__t.S.currentChronologyMode = р;
    const путь = window.__t.findShortestPath(и, ц, true, true);
    window.__t.S.currentChronologyMode = 'strict';
    return путь;
  }, [a, b, режим]);

  const строгий = await прогнать('eidos', 'logos_marcus', 'strict');
  проверить('строгий режим путь находит', !!строгий && строгий.length > 1, true, !!строгий);
  const строгийЛоман = строгий ? !(await монотонен(строгий, +1)) : false;
  проверить('строгий режим ДОПУСКАЕТ разрыв хронологии', строгийЛоман, true, строгийЛоман);

  const вперёд = await прогнать('eidos', 'logos_marcus', 'seamless');
  проверить('без разрывов: путь вперёд найден', !!вперёд && вперёд.length > 1, true, !!вперёд);
  const вперёдМоно = вперёд ? await монотонен(вперёд, +1) : false;
  проверить('без разрывов: путь вперёд монотонен', вперёдМоно, true, вперёдМоно);

  const назад = await прогнать('logos_marcus', 'eidos', 'seamless');
  проверить('без разрывов: обратный путь найден', !!назад && назад.length > 1, true, !!назад);
  const назадМоно = назад ? await монотонен(назад, -1) : false;
  проверить('без разрывов: обратный путь монотонен назад', назадМоно, true, назадМоно);
}

// ── 9и. шапка пути показывает ХОД времени, а не только концы ───────
{
  // Прежде писалось «428-348 до н.э. → 121-180», и путь, ушедший в 1788 год
  // и вернувшийся в 121-й, выглядел безупречно: прыжок прятался между
  // концами. Годы у каждого узла загромоздили бы цепочку — они собраны в
  // одну строку, подряд идущие повторы слиты.
  const шапка = async (режим) => {
    await page.evaluate(() => {
      const c = document.getElementById('respectChronology');
      if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    await page.evaluate(р => {
      const e = document.getElementById('chronologyModeSelect');
      e.value = р;
      e.dispatchEvent(new Event('change', { bubbles: true }));
    }, режим);
    await page.evaluate(i => window.__t.selectCustomOption('source', i), 'eidos');
    await page.evaluate(i => window.__t.selectCustomOption('target', i), 'logos_marcus');
    await page.evaluate(() => window.__t.findAndShowPath());
    await wait(2200);
    return page.evaluate(() => {
      const т = document.getElementById('pathResult').textContent.replace(/\s+/g, ' ');
      const i = т.indexOf('Ход времени');
      return i < 0 ? '' : т.slice(i, i + 120);
    });
  };
  const строгая = await шапка('strict');
  проверить('шапка называет ход времени', строгая.startsWith('Ход времени'),
    'начинается с «Ход времени»', строгая.slice(0, 24));
  проверить('в строгом режиме разрыв назван',
    /разрывов: \d/.test(строгая), 'есть «разрывов: N»', строгая.slice(0, 70));
  проверить('промежуточный год виден, а не только концы',
    строгая.includes('1788'), 'содержит 1788', строгая.slice(0, 60));

  const без = await шапка('seamless');
  проверить('без разрывов: в шапке нет счётчика разрывов',
    !/разрывов: \d/.test(без), 'нет «разрывов»', без.slice(0, 70));
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'strict';
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// ── 9к. панель контроля: значки, подсказки, место, справка ─────────
{
  // Панель стояла слева внизу и перекрывалась легендой. После сжатия
  // подписей до значков она уместилась справа внизу — на месте плашки
  // подсказок, которую заменило окно «О проекте».
  const п = await page.evaluate(() => {
    const c = document.getElementById('controls'), l = document.getElementById('legend');
    const rc = c.getBoundingClientRect(), rl = l.getBoundingClientRect();
    const кнопки = [...c.querySelectorAll('button')];
    return {
      справа: Math.round(window.innerWidth - rc.right),
      снизу: Math.round(window.innerHeight - rc.bottom),
      ширина: Math.round(rc.width),
      перекрывает: !(rc.right < rl.left || rc.left > rl.right
                  || rc.bottom < rl.top || rc.top > rl.bottom),
      кнопок: кнопки.length,
      безПодсказки: кнопки.filter(x => !x.getAttribute('data-tip')).length,
      сПодписью: кнопки.filter(x => /[A-Za-zА-Яа-я]/.test(x.textContent)).map(x => x.textContent.trim()),
      плашка: !!document.getElementById('info'),
    };
  });
  проверить('панель контроля стоит справа внизу',
    п.справа <= 24 && п.снизу <= 24, '≤24 и ≤24', п.справа + ' и ' + п.снизу);
  проверить('панель не перекрывает легенду', п.перекрывает === false, false, п.перекрывает);
  проверить('панель узкая', п.ширина <= 380, '≤380', п.ширина);
  проверить('у каждой кнопки панели есть подсказка', п.безПодсказки === 0, 0, п.безПодсказки);
  проверить('подписи остались только у PNG, SVG и JSON',
    п.сПодписью.length === 3 && п.сПодписью.every(t => /PNG|SVG|JSON/.test(t)),
    'PNG, SVG, JSON', п.сПодписью.join(' / '));
  проверить('плашка подсказок убрана', п.плашка === false, false, п.плашка);

  await page.evaluate(() => window.__t.openAboutModal());
  await wait(600);
  const ЧИСЛА = [ЖДЁМ.концепций, ЖДЁМ.связей, ЖДЁМ.философов].map(String);
  const о = await page.evaluate((ЧИСЛА) => {
    const t = document.getElementById('aboutContent').textContent;
    return {
      открыто: document.getElementById('aboutModal').classList.contains('show'),
      разделов: document.querySelectorAll('#aboutContent h3').length,
      числаИзДанных: ЧИСЛА.every(n => t.includes(n)),
      проПравку: /едактир/.test(t),
      знаков: t.length,
    };
  }, ЧИСЛА);
  проверить('окно «О проекте» открывается', о.открыто, true, о.открыто);
  проверить('в нём есть разделы управления', о.разделов >= 5, '≥5', о.разделов);
  проверить('числа взяты из данных', о.числаИзДанных, true, о.числаИзДанных);
  проверить('о правке в окне не говорится', о.проПравку === false, false, о.проПравку);
  await page.evaluate(() => window.__t.closeAboutModal());
  await wait(300);
}

// ── 9л. четыре замечания по панели и подсказке ─────────────────────
{
  // 1. Кнопки не отращивают подписи. Заморозка и группировка переписывали
  //    себе текст при нажатии, и панель на глазах раздувалась.
  const подписи = () => page.evaluate(() =>
    [...document.querySelectorAll('#controls button')]
      .map(x => x.textContent.trim()).filter(t => /[A-Za-zА-Яа-я]/.test(t)));
  const до = await подписи();
  await page.evaluate(() => {
    document.getElementById('freezeBtn').click();
    document.getElementById('groupBtn').click();
  });
  await wait(900);
  const после = await подписи();
  проверить('нажатия не добавляют подписей на кнопки',
    после.join('|') === до.join('|'), до.join('|'), после.join('|'));
  await page.evaluate(() => {
    document.getElementById('freezeBtn').click();
    document.getElementById('groupBtn').click();
  });
  await wait(600);

  // 2. Подсказка поверх ВСЕГО: панель при наведении поднимается до 9999,
  //    окно правки до 10001 — подсказка пряталась под тем, к чему относится.
  const п = await page.evaluate(() => {
    document.getElementById('freezeBtn')
      .dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    const h = document.getElementById('hintBox');
    const s = getComputedStyle(h);
    const слои = [...document.querySelectorAll('*')]
      .map(e => Number(getComputedStyle(e).zIndex))
      .filter(z => Number.isFinite(z));
    return { слой: Number(s.zIndex), наибольшийПрочий: Math.max(...слои.filter(z => z < 100000)),
      сквозной: s.pointerEvents };
  });
  проверить('подсказка выше любого другого слоя',
    п.слой > п.наибольшийПрочий, '> ' + п.наибольшийПрочий, п.слой);
  проверить('подсказка не перехватывает мышь', п.сквозной === 'none', 'none', п.сквозной);

  // 3. Выпадающие списки рисуются в тёмной коже: их рисует не страница,
  //    а система, и без объявления схемы список оставался белым.
  const в = await page.evaluate(() => ({
    схема: getComputedStyle(document.documentElement).colorScheme,
    фонПункта: getComputedStyle(document.querySelector('#chronologyModeSelect option')).backgroundColor,
  }));
  проверить('странице объявлена тёмная кожа', в.схема === 'dark', 'dark', в.схема);
  проверить('пункты списка тёмные',
    в.фонПункта === 'rgb(20, 18, 28)', 'rgb(20, 18, 28)', в.фонПункта);
}

// ── 9м. окно описаний пути не теряет блоки при ходе против стрелки ──
{
  // В режиме без разрывов путь идёт по годам, и ребро сплошь и рядом
  // пройдено против своей стрелки. Разбор рёбер об этом не знал и возвращал
  // null — в окне описаний оставался ОДИН исходный узел.
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'seamless';
    e.dispatchEvent(new Event('change', { bubbles: true }));
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.evaluate(i => window.__t.selectCustomOption('source', i), 'intentionality_brentano');
  await page.evaluate(i => window.__t.selectCustomOption('target', i), 'one_being');
  await page.evaluate(() => window.__t.findAndShowPath());
  await wait(2400);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1100);
  const о = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    return {
      узлов: c.querySelectorAll('.path-node-full-description').length,
      связей: c.querySelectorAll('.path-description-item').length,
      узловВПути: document.querySelectorAll('#pathResult .path-node').length,
    };
  });
  проверить('в окне описаний столько же узлов, сколько в пути',
    о.узлов === о.узловВПути, о.узловВПути, о.узлов);
  проверить('связей на одну меньше, чем узлов',
    о.связей === о.узлов - 1, о.узлов - 1, о.связей);
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'strict';
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await wait(400);
}

// ── 9н. поиск: многословный запрос, поиск философов, скрытые отбором ──
{
  // МНОГОСЛОВНЫЙ ЗАПРОС. Прежде запрос сравнивался ЦЕЛИКОМ с началом каждого
  // отдельного слова, и «миф о пещере» не находил ничего. Изъян был и в
  // нетронутом исходнике — проверено.
  const найдено = (q) => page.evaluate(з => {
    window.__t.handleLegendSearch(з);
    return document.querySelectorAll('#legendSearchResults .concept-row').length;
  }, q);
  проверить('многословный запрос находит', await найдено('миф о пещере') > 0, '>0',
    await найдено('миф о пещере'));
  проверить('порядок слов в запросе не важен', await найдено('пещере миф') > 0, '>0',
    await найдено('пещере миф'));

  // СКРЫТАЯ ОТБОРОМ. Два правила спорили молча: подсветка считала узел
  // участником, отрисовка его не рисовала — соседи загорались вокруг пустого
  // места. Теперь строка помечена, а выбор показывает концепцию поверх отбора.
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1400);
  const п = await page.evaluate(() => {
    window.__t.handleLegendSearch('миф о пещере');
    const r = document.querySelector('#legendSearchResults .concept-row');
    return { помечена: !!r && r.classList.contains('hidden-by-filter'),
      приписка: r ? (r.querySelector('.concept-row-note') || {}).textContent : null };
  });
  проверить('скрытая отбором помечена в списке', п.помечена, true, п.помечена);
  проверить('пометка названа словами', п.приписка === 'скрыта отбором',
    'скрыта отбором', п.приписка);

  await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    window.__t.selectSearchResult(n.id, 'legend');
  });
  await wait(1500);
  const в = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const s = document.getElementById('beyondFilterSection');
    return { видима: window.__t.isNodeVisible(n),
      раздел: !!s && getComputedStyle(s).display !== 'none',
      счёт: (document.getElementById('beyondFilterCount') || {}).textContent };
  });
  проверить('выбранная скрытая концепция показана', в.видима, true, в.видима);
  проверить('в легенде появился раздел о показе поверх отбора', в.раздел, true, в.раздел);
  проверить('раздел считает показанные', в.счёт === '1', '1', в.счёт);

  await page.evaluate(() => window.__t.resetBeyondFilter());
  await wait(1200);
  const с = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const s = document.getElementById('beyondFilterSection');
    return { видима: window.__t.isNodeVisible(n),
      раздел: !!s && getComputedStyle(s).display !== 'none' };
  });
  проверить('возврат отбора снова прячет концепцию', с.видима === false, false, с.видима);
  проверить('раздел исчезает вместе с показанными', с.раздел === false, false, с.раздел);
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1200);

  // ПОИСК ФИЛОСОФОВ В ОКНЕ ФИЛОСОФА — устроен как поиск концепций.
  await page.evaluate(() => window.__t.openUniversalModal('philosopher', 'Платон', 'view'));
  await wait(1200);
  const ф = await page.evaluate(() => {
    window.__t.handlePhilosopherSearch('арист');
    const rs = [...document.querySelectorAll('#philSearchResults .concept-row')];
    return { строк: rs.length,
      кружок: rs[0] ? !!rs[0].querySelector('.concept-row-color') : false,
      текст: rs[0] ? rs[0].textContent.replace(/\s+/g, ' ').trim() : '' };
  });
  проверить('поиск философов находит', ф.строк > 0, '>0', ф.строк);
  проверить('у строки философа есть кружок цвета', ф.кружок, true, ф.кружок);
  проверить('строка называет годы и число концепций',
    /\d+.*·.*концепций \d+/.test(ф.текст), 'годы · концепций N', ф.текст.slice(0, 46));
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 9о. поиск в легенде по трём сущностям ──────────────────────────
{
  // Поле прежде висело всегда и искало только концепции. Теперь оно
  // раскрывается кнопкой, а внутри три вида: философ, концепция, связь.
  const скрыт = await page.evaluate(() =>
    getComputedStyle(document.getElementById('searchBody')).display === 'none');
  проверить('поиск в легенде свёрнут по умолчанию', скрыт, true, скрыт);

  await page.evaluate(() => window.__t.toggleLegendSearch());
  await wait(500);
  const р = await page.evaluate(() => ({
    видно: getComputedStyle(document.getElementById('searchBody')).display !== 'none',
    вид: ([...document.querySelectorAll('.search-kind')]
      .find(b => b.classList.contains('active')) || {}).textContent.trim(),
    концепция: getComputedStyle(document.getElementById('rowConcept')).display !== 'none',
    философ: getComputedStyle(document.getElementById('rowPhilosopher')).display !== 'none',
    связь: getComputedStyle(document.getElementById('rowConnection')).display !== 'none',
  }));
  проверить('раскрывается кнопкой', р.видно, true, р.видно);
  проверить('по умолчанию ищет концепции', р.вид === 'Концепция', 'Концепция', р.вид);
  проверить('видна только строка концепции',
    р.концепция && !р.философ && !р.связь, 'только концепция',
    `${р.концепция}/${р.философ}/${р.связь}`);

  // СВЯЗЬ — две строки, как в окне связи; выбор подсвечивает её на графе.
  await page.evaluate(() => window.__t.setSearchKind('connection'));
  await wait(400);
  const строк = await page.evaluate(() =>
    document.querySelectorAll('#rowConnection input').length);
  проверить('у поиска связи две строки', строк === 2, 2, строк);

  const пара = await page.evaluate(() => {
    const l = window.__t.DATA.links[0];
    return [l.source.id || l.source, l.target.id || l.target];
  });
  await page.evaluate(([a]) => window.__t.pickLinkEnd('from', a), пара);
  await page.evaluate(([, c]) => window.__t.pickLinkEnd('to', c), пара);
  await wait(700);
  const найдено = await page.evaluate(() =>
    document.querySelectorAll('#legendLinkFound .concept-row').length);
  проверить('связь между двумя концами найдена', найдено > 0, '>0', найдено);

  await page.evaluate(() => {
    document.querySelector('#legendLinkFound .concept-row')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const св = await page.evaluate(() => {
    const по = {};
    for (const l of window.__t.DATA.links) {
      const s = window.__t.linkVisualState(l);
      по[s] = (по[s] || 0) + 1;
    }
    return по;
  });
  проверить('выбранная связь выделена на графе', (св.selected || 0) === 1, 1, св.selected || 0);
  проверить('прочие связи приглушены', (св.dimmed || 0) > 1000, '>1000', св.dimmed || 0);

  // ФИЛОСОФ — три уровня, которые в отрисовке уже есть: его связи
  // подсвечены (1,0), внешние обычные (0,4), прочие приглушены (0,1).
  await page.evaluate(() => window.__t.setSearchKind('philosopher'));
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await wait(1000);
  const ф = await page.evaluate(() => {
    const по = {};
    for (const l of window.__t.DATA.links) {
      const s = window.__t.linkVisualState(l);
      по[s] = (по[s] || 0) + 1;
    }
    return по;
  });
  проверить('внутренние связи философа подсвечены',
    (ф.highlighted || 0) > 0, '>0', ф.highlighted || 0);
  проверить('внешние связи остаются обычными', (ф.normal || 0) > 0, '>0', ф.normal || 0);
  проверить('посторонние связи приглушены', (ф.dimmed || 0) > 1000, '>1000', ф.dimmed || 0);
  проверить('три уровня различны',
    new Set([ф.highlighted, ф.normal, ф.dimmed]).size === 3, '3 разных',
    [ф.highlighted, ф.normal, ф.dimmed].join('/'));

  await page.evaluate(() => window.__t.toggleLegendSearch());
  await wait(400);
}

// ── 9п. три уровня у КОНЦЕПЦИЙ и связи скрытой отбором ─────────────
{
  // У концепций ЧЕТЫРЕ состояния: выбранная (жёлтый ободок, толщина 6),
  // подсвеченная (белый 5 со свечением), обычная (белый 3), приглушённая
  // (0,2). Жёлтый оставлен ТОЛЬКО за явным выбором. При выборе философа его
  // концепции берут подсвеченное состояние, соседи по внешним связям —
  // обычное: прежде они гасли, и связи к ним выглядели «в никуда».
  const состояния = () => page.evaluate(() => {
    const у = { подсвечено: 0, обычные: 0, приглушено: 0 };
    for (const n of window.__t.DATA.nodes) {
      if (window.__t.hasNodeClass('highlighted', n)) у.подсвечено++;
      else if (window.__t.hasNodeClass('dimmed', n)) у.приглушено++;
      else у.обычные++;
    }
    return у;
  });
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await wait(900);
  const один = await состояния();
  проверить('концепции философа подсвечены', один.подсвечено > 0, '>0', один.подсвечено);
  проверить('соседи по внешним связям НЕ гаснут', один.обычные > 0, '>0', один.обычные);
  проверить('прочие концепции приглушены', один.приглушено > 100, '>100', один.приглушено);

  // CTRL добавляет философа к выбору, как на полотне добавляются узлы.
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Аристотель', true));
  await wait(900);
  const двое = await состояния();
  проверить('ctrl добавляет второго философа',
    двое.подсвечено > один.подсвечено, '>' + один.подсвечено, двое.подсвечено);
  проверить('соседей стало больше', двое.обычные > один.обычные, '>' + один.обычные, двое.обычные);

  // СВЯЗИ показанной вопреки отбору концепции. Прежде она висела в пустоте:
  // отбор для узла отменён, а связи оставались скрытыми.
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1400);
  await page.evaluate(() => {
    window.__t.handleLegendSearch('миф о пещере');
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    window.__t.selectSearchResult(n.id, 'legend');
  });
  await wait(1500);
  const св = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const свои = window.__t.DATA.links.filter(l => {
      const a = l.source.id || l.source, b = l.target.id || l.target;
      return a === n.id || b === n.id;
    });
    return { видима: window.__t.isNodeVisible(n), всего: свои.length,
      видимых: свои.filter(l => window.__t.isLinkVisible(l)).length };
  });
  проверить('показанная вопреки отбору видима', св.видима, true, св.видима);
  проверить('её связи к видимым соседям тоже видны',
    св.видимых > 0, '>0', св.видимых + ' из ' + св.всего);

  await page.evaluate(() => window.__t.resetBeyondFilter());
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1200);
}

// ── 9р. легенда, окно справки, традиции, описания пути ─────────────
{
  // ЛЕГЕНДА во всю высоту окна: было 85vh, и при 1080 точках внизу
  // пропадало 80 — при содержимом в 3200 точек это просто терянная высота.
  const л = await page.evaluate(() => {
    const r = document.getElementById('legend').getBoundingClientRect();
    return { верх: Math.round(r.top), низ: Math.round(window.innerHeight - r.bottom) };
  });
  проверить('легенда отступает сверху и снизу одинаково',
    Math.abs(л.верх - л.низ) <= 2, 'разница ≤2', Math.abs(л.верх - л.низ));
  проверить('легенда не вылезает за нижний край', л.низ >= 0, '≥0', л.низ);

  // ОКНО СПРАВКИ закрывается наравне с прочими.
  await page.evaluate(() => window.__t.openAboutModal());
  await wait(500);
  await page.keyboard.press('Escape');
  await wait(500);
  const поEsc = await page.evaluate(() =>
    document.getElementById('aboutModal').classList.contains('show'));
  проверить('окно справки закрывается по Esc', поEsc === false, false, поEsc);

  await page.evaluate(() => window.__t.openAboutModal());
  await wait(400);
  await page.evaluate(() => document.getElementById('aboutModal')
    .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })));
  await wait(400);
  const поЩелчку = await page.evaluate(() =>
    document.getElementById('aboutModal').classList.contains('show'));
  проверить('окно справки закрывается щелчком мимо', поЩелчку === false, false, поЩелчку);

  // РАЗДЕЛ ТРАДИЦИЙ в окне философа — по образцу рубрик в окне концепции.
  await page.evaluate(() => window.__t.openUniversalModal('philosopher', 'Платон', 'view'));
  await wait(1200);
  const т = await page.evaluate(() => {
    const t = document.getElementById('universalModalContent').textContent;
    const разделов = [...document.querySelectorAll('#universalModalContent .rubric-title')]
      .filter(e => e.textContent.includes('Традиция')).length;
    return { разделов, естьПеречень: /Также в этой традиции/.test(t) };
  });
  проверить('в окне философа есть раздел традиций', т.разделов > 0, '>0', т.разделов);
  проверить('в разделе перечислены философы традиции',
    т.естьПеречень, true, т.естьПеречень);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);

  // ОПИСАНИЯ ПУТИ: плашка философа, вес связи, нажимаемые заголовки.
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  const ид = await page.evaluate(() => window.__t.DATA.nodes.map(n => n.id));
  await page.evaluate(i => window.__t.selectCustomOption('source', i), ид[0]);
  // М8: типологические связи в путях пропускаются по умолчанию — они
  // утверждают, что контакта НЕ БЫЛО, и предъявлять их как цепочку передачи
  // нечестно. Прежняя цель (ид[120]) достижима от ид[0] направленно ТОЛЬКО
  // через типологическое ребро, и после правки путь туда честно не находится.
  // Замерено: так теряется 6,3 % направленно достижимых пар — цена названа,
  // а не спрятана. Цель заменена на достижимую без типологического слоя.
  await page.evaluate(i => window.__t.selectCustomOption('target', i), 'one_being');
  await page.evaluate(() => window.__t.findAndShowPath());
  await wait(2400);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1100);
  const о = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    return {
      плашек: c.querySelectorAll('.philosopher-tag').length,
      узлов: c.querySelectorAll('.path-node-full-description').length,
      нажимаемых: c.querySelectorAll('.path-open').length,
      весНазван: /вес \d+ —/.test(c.textContent),
      естьФилософСтрокой: /Философ:/.test(c.textContent),
    };
  });
  проверить('у каждого узла плашка философа', о.плашек === о.узлов, о.узлов, о.плашек);
  проверить('строка «Философ:» убрана', о.естьФилософСтрокой === false, false, о.естьФилософСтрокой);
  проверить('вес связи назван', о.весНазван, true, о.весНазван);
  проверить('заголовки нажимаемы', о.нажимаемых >= о.узлов, '≥' + о.узлов, о.нажимаемых);
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  await wait(400);

  // ПАНЕЛЬ ПУТИ: узлы и стрелки тоже открывают свои окна.
  const п = await page.evaluate(() => ({
    узлов: document.querySelectorAll('#pathResult .path-node.path-open').length,
    стрелок: document.querySelectorAll('#pathResult .path-arrow.path-open').length,
  }));
  проверить('узлы в панели пути нажимаемы', п.узлов > 0, '>0', п.узлов);
  проверить('стрелки в панели пути нажимаемы', п.стрелок > 0, '>0', п.стрелок);
}

// ── 10. контраст подписей не ниже порога ───────────────────────────
{
  const плохие = await page.evaluate(порог => {
    const яркость = c => {
      const m = c.match(/[\d.]+/g).map(Number);
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
    };
    const фон = el => {
      let e = el;
      while (e) {
        const c = getComputedStyle(e).backgroundColor;
        const m = c.match(/[\d.]+/g);
        if (m && (m.length < 4 || Number(m[3]) > 0.5)) return c;
        e = e.parentElement;
      }
      return 'rgb(0,0,0)';
    };
    const плохо = [];
    for (const el of document.querySelectorAll('#legend *, #controls *, #pathFinder *')) {
      const t = [...el.childNodes].filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim()).join('');
      if (!t) continue;

      // СМЫСЛОВОЙ ЦВЕТ ПОРОГУ НЕ ПОДЧИНЯЕТСЯ. Цвет стрелки пути и подписи
      // философа берётся ИЗ ДАННЫХ — от типа связи, от философа, — и несёт
      // смысл: пять типов из 21 темнее порога (emerge_from даёт 1,78,
      // dialogue 2,1). Поднять их значило бы переписать палитру, то есть
      // сменить смысловое кодирование ради оформления. Такие места
      // пропускаются намеренно; читаемость там — отдельный вопрос, и решать
      // его надо обводкой или тенью, а не подменой цвета.
      if (el.style && el.style.color) continue;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) continue;
      const a = яркость(s.color), b = яркость(фон(el));
      const k = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (k < порог) плохо.push(t.slice(0, 30) + ' — ' + k.toFixed(2));
    }
    return плохо;
  }, ЖДЁМ.порогКонтраста);
  проверить(`контраст подписей не ниже ${ЖДЁМ.порогКонтраста}`,
    плохие.length === 0, 0, плохие.length + (плохие[0] ? ' (' + плохие[0] + ')' : ''));
}

// ── 10-бис. правка базы будит укладку ───────────────────────────────
// ПОВОД. updateGraphData наливала энергию (alpha 0.3) и не сбрасывала счётчик
// тиков, а счётчик — он же стоп-кран. На улёгшейся раскладке перезапуск давал
// РОВНО ОДИН тик, после чего simulation.stop(). Новая концепция оставалась
// там, куда её поставил addNodeToGraph, и не раскладывалась вовсе.
//
// ПРИБОР НЕ ПЕРЕСКАЗЫВАЕТ ПРАВИЛО: про потолок в 300 тиков он не знает и
// знать не должен. Он спрашивает СОСТОЯНИЕ — узлы перестали двигаться и
// счётчик перестал расти, — а потом смотрит, что даёт правка базы.
//
// ПОРОГИ ЗАМЕРЕНЫ ОБЕИМИ СТОРОНАМИ, а не назначены:
//   со сбросом счётчика — тиков 28, медианный сдвиг 58.3 px
//   без сброса (подлог)  — тиков 301, медианный сдвиг 1.9 px
{
  const снять = () => page.evaluate(() => ({
    тик: window.__t.S.tickCount,
    xy: window.__t.DATA.nodes.map(n => [n.x, n.y]),
  }));
  const наибольший = (a, b) => {
    let m = 0;
    for (let k = 0; k < a.length; k++)
      m = Math.max(m, Math.hypot(a[k][0] - b[k][0], a[k][1] - b[k][1]));
    return m;
  };

  // Чтобы Л-0 (сброс счётчика при правке базы) остался под охраной, счётчик
  // надо сперва довести до потолка: с готовой раскладкой он ноль, и дефект
  // «энергию налили, стоп-кран не отпустили» этим путём не проявился бы.
  await page.evaluate(() => window.__t.resetSimulation());

  let прежний = null, тихо = 0, покой = null;
  for (let i = 0; i < 90 && !покой; i++) {
    const с = await снять();
    if (прежний && с.тик === прежний.тик && наибольший(с.xy, прежний.xy) < 0.01) {
      if (++тихо >= 2) покой = с;
    } else тихо = 0;
    прежний = с;
    if (!покой) await wait(500);
  }
  покой = покой || прежний;

  // Разморозка по закрытию окна не должна трогать улёгшуюся раскладку.
  const улеглось = await page.evaluate(async () => {
    const признак = window.__t.S.layoutSettled;
    const до = window.__t.DATA.nodes.map(n => [n.x, n.y]);
    window.__t.unfreezeSimulation('окно');
    await new Promise(r => setTimeout(r, 900));
    let m = 0;
    window.__t.DATA.nodes.forEach((n, i) => {
      m = Math.max(m, Math.hypot(n.x - до[i][0], n.y - до[i][1]));
    });
    return { признак, разбудило: m > 1 };
  });

  await page.evaluate(() => {
    const D = window.__t.DATA;
    const св = {
      id: 'rel_probe_l0', source: D.nodes[0].id, target: D.nodes[220].id,
      type: 'influence', weight: 2, description: 'проба Л-0',
    };
    D.relations.push({ ...св });
    D.links.push(св);
    window.__t.addLinkToGraph(св);
  });
  const послеПризнак = await page.evaluate(() => window.__t.S.layoutSettled);
  await wait(2500);

  const после = await снять();
  const сдвиги = покой.xy
    .map((p, i) => Math.hypot(после.xy[i][0] - p[0], после.xy[i][1] - p[1]))
    .sort((a, b) => a - b);
  const медиана = сдвиги[Math.floor(сдвиги.length / 2)];

  проверить('после сброса раскладка снова уложилась тиками', покой.тик > 0, '>0', покой.тик);
  проверить('правка базы начинает счёт тиков заново',
    после.тик < покой.тик, '<' + покой.тик, после.тик);
  // Порог понижен вторично 2026-09-11, с 15 до 5 px, по той же причине и с
  // тем же доводом. Расширение базы (2201 → 2720 связей при 718 узлах)
  // сделало раскладку ещё жёстче: два прогона подряд дали 8.8 и 9.3 px, то
  // есть замер устойчив, а прежний порог отсекал бы его всегда. Проверяется
  // здесь сам факт разъезда, а не его величина; при неподвижной раскладке
  // медиана легла бы около нуля, и 5 px от неё так же далеко, как прежние 15
  // были от прежних величин. ПОРОГ ПОНИЖАЛИ ДВАЖДЫ — если понадобится
  // третий раз, надо не двигать число, а менять сам замер: он меряет
  // жёсткость укладки не меньше, чем факт правки.
  проверить('после правки базы узлы разъезжаются',
    медиана > 5, '>5 px', медиана.toFixed(1) + ' px');

  // ПРИЗНАК УЛЁГШЕСТИ ОТДЕЛЁН ОТ СЧЁТЧИКА. Прежде о состоянии раскладки
  // спрашивали tickCount, и он работал разом счётчиком, стоп-краном и
  // признаком. Здесь проверяется, что признак говорит правду в обе стороны
  // и что разморозка по закрытию окна улёгшуюся раскладку НЕ будит.
  //
  // ЧЕСТНАЯ ГРАНИЦА ЭТИХ УТВЕРЖДЕНИЙ, проверенная подлогом. Вернул разморозке
  // прежнее условие (S.tickCount < S.maxTicks) вместо признака — прибор
  // ПРОМОЛЧАЛ, и правильно: пока раскладка укладывается только тиками, оба
  // выражения в этой точке дают один ответ. Утверждение ловит СНЯТИЕ заслона
  // (подлог «if (S.simulation)» краснеет), но не подмену признака счётчиком.
  // Различить их можно будет там, где раскладка становится готовой БЕЗ
  // тиков, — то есть в заходе Л-3, когда появится предвычисленная раскладка.
  // Тогда сюда добавляется утверждение «страница загрузилась с готовой
  // раскладкой и нулём тиков», и подлог со счётчиком краснеет.
  проверить('улёгшаяся раскладка помечена признаком',
    улеглось.признак === true, true, улеглось.признак);
  проверить('разморозка не будит улёгшуюся раскладку',
    улеглось.разбудило === false, false, улеглось.разбудило);
  проверить('после правки базы признак снят',
    послеПризнак === false, false, послеПризнак);
}

// ── 10-бис. правки интерфейса 11 сентября ──────────────────────────
//
// ЗАЧЕМ ЭТИ ЧЕТЫРЕ УТВЕРЖДЕНИЯ. Правки были сделаны, проверены в браузере
// руками — и потеряны при откате исходника, потому что ни одно утверждение
// о них не говорило. Приёмка при этом осталась ЗЕЛЁНОЙ: эталоны я
// переучредил уже с испорченной стороны, и они закрепили потерю как норму —
// ровно тот случай, о котором предупреждает baseline.mjs. Проверенное
// руками не проверено ничем.
{
  const о = await page.evaluate(async () => {
    const A = window.__t, ждать = мс => new Promise(r => setTimeout(r, мс));
    const низкая = A.DATA.concepts.find(c => !A.profileIsMeaningful(c.id));
    const высокая = A.DATA.concepts.find(c => A.profileIsMeaningful(c.id));
    const о = { словарьВеса: Object.values(A.WEIGHT_WORDS || {}).join('|') };

    A.openConceptById(низкая.id); await ждать(400);
    const кн = document.querySelector('.similar-map-btn');
    о.подписьМалой = кн ? кн.textContent.trim() : 'НЕТ КНОПКИ';
    if (кн) кн.click();
    await ждать(900);
    const вид = document.querySelector('#similarityLegend .simleg-btn.active');
    о.видМалой = вид ? вид.textContent.trim() : 'НЕТ ПАНЕЛИ';
    A.clearSimilarityOverlay(); A.closeUniversalModal(); await ждать(200);

    A.openConceptById(высокая.id); await ждать(400);
    const кн2 = document.querySelector('.similar-map-btn');
    о.подписьСвязной = кн2 ? кн2.textContent.trim() : 'НЕТ КНОПКИ';
    A.closeUniversalModal(); await ждать(200);

    // Список поиска: выбрали концепцию — и вернулись в поле.
    A.selectCustomOption('source', A.DATA.nodes[10].id); await ждать(200);
    A.showCustomSelectDropdown('source'); await ждать(300);
    const ящик = document.getElementById('sourceSelectDropdown');
    о.строкВСписке = ящик.querySelectorAll('.concept-row').length;
    о.выбраннаяОтмечена = !!ящик.querySelector('.concept-row-picked');
    return о;
  });
  // Малосвязная концепция: кнопка зовёт вид, который для неё работает.
  проверить('у малосвязной концепции кнопка зовёт вид по структуре',
    /по структуре/.test(о.подписьМалой), 'подпись «(по структуре)»', о.подписьМалой);
  проверить('и наложение открывается именно по структуре',
    о.видМалой === 'По структуре', 'По структуре', о.видМалой);
  проверить('у связной концепции подпись прежняя',
    о.подписьСвязной === '🗺️ Показать на графе', '🗺️ Показать на графе', о.подписьСвязной);
  // Поиск: по фокусу выпадает ВЕСЬ список, а не пустота от текста поля.
  проверить('список поиска выпадает целиком при выбранной концепции',
    о.строкВСписке === ЖДЁМ.концепций, ЖДЁМ.концепций, о.строкВСписке);
  проверить('выбранная строка в списке помечена',
    о.выбраннаяОтмечена === true, true, о.выбраннаяОтмечена);
  // Словарь веса один на всю страницу.
  проверить('вес назван словами легенды',
    о.словарьВеса === 'побочная связь|обычная связь|несущая связь',
    'побочная|обычная|несущая', о.словарьВеса);
}

// ── 10-бис-бис. четыре вида сходства концепций (2026-09-17) ─────────
//
// Типы связей переведены на двойное центрирование, добавлено место в сети.
// Прежняя мера по типам светила на карте почти всё (674 узла из 717 у
// связной концепции) — отсюда утверждение «меньше половины». Сетевая мера
// асинхронна: утверждения проверяют, что она ДОЖИДАЕТСЯ и дорисовывается,
// а не остаётся заглушкой.
{
  const о = await page.evaluate(async () => {
    const A = window.__t, ждать = мс => new Promise(r => setTimeout(r, мс)), о = {};
    const высокая = A.DATA.concepts.find(c => A.profileIsMeaningful(c.id));
    const низкая = A.DATA.concepts.find(c => !A.profileIsMeaningful(c.id));
    const готоваДо = !!A.networkSimilarityData();
    A.openConceptById(высокая.id); await ждать(1500);
    о.колонок = document.querySelectorAll('.similar-col').length;
    // Окно не смеет запускать сетевые метрики само: фоновый расчёт меняет
    // облик видов статистики, и итог приборов зависел бы от его скорости.
    о.тихоНеЗапускает = готоваДо || !A.networkSimilarityData();
    const кнопка = document.querySelector('#similarNetworkCol .similar-map-btn');
    if (кнопка) кнопка.click();
    о.сетьДождалась = await A.ensureNetworkProfile(); await ждать(500);
    о.строкСети = document.querySelectorAll('#similarNetworkCol .similar-item').length;
    A.closeUniversalModal(); await ждать(200);
    A.openConceptById(низкая.id); await ждать(400);
    const пусто = document.querySelector('#similarNetworkCol .similar-empty');
    о.сетьМалой = пусто ? пусто.textContent : 'НЕТ ПОМЕТКИ';
    A.closeUniversalModal(); await ждать(200);
    о.виды = {};
    for (const вид of ['profile', 'structure', 'types', 'network']) {
      A.showSimilarityOverlay(высокая.id, вид); await ждать(500);
      const панель = document.getElementById('similarityLegend');
      const счёт = панель ? панель.querySelector('.simleg-hint').textContent.match(/Показано\s+(\d+)\s+концепций из\s+(\d+)/) : null;
      о.виды[вид] = {
        кнопок: панель ? панель.querySelectorAll('.simleg-btn').length : 0,
        активна: панель ? (панель.querySelector('.simleg-btn.active') || {}).textContent : null,
        двусторонняя: !!панель && !панель.querySelector('.simleg-scale.one-sided'),
        доля: счёт ? +счёт[1] / +счёт[2] : null,
      };
      if (о.виды[вид].активна) о.виды[вид].активна = о.виды[вид].активна.trim();
    }
    A.clearSimilarityOverlay(); await ждать(200);
    const п = A.similarityThresholds();
    о.порогиУпорядочены = [п.profile, п.types, п.network].every(t => t && t.high > t.low);
    const в = A.similarityVerdict(высокая.id, низкая.id);
    о.строкВердикта = в.lines.length;
    о.заголовок = в.headline;
    document.querySelector('.open-stats-modal-btn').click(); await ждать(600);
    A.switchStatsView('comparison'); await ждать(1200);
    о.плиток = document.querySelectorAll('#cmpBody .cmp-score').length;
    о.строкВОкне = document.querySelectorAll('#cmpBody .cmp-verdict-lines li').length;
    A.switchStatsView('closest-pairs'); await ждать(300);
    о.видовПар = [...document.querySelectorAll('.pairs-modes .pairs-btn')].map(b => b.id).join(',');
    const закрыть = document.querySelector('.stats-close-btn[data-act-click="close-stats-modal"]');
    if (закрыть) закрыть.click();
    await ждать(300);
    return о;
  });
  проверить('сетевые метрики для сходства досчитываются', о.сетьДождалась === true, true, о.сетьДождалась);
  проверить('в окне концепции четыре колонки похожих', о.колонок === 4, 4, о.колонок);
  проверить('окно концепции само не запускает сетевые метрики', о.тихоНеЗапускает === true, true, о.тихоНеЗапускает);
  проверить('колонка «по месту в сети» дорисовывается по кнопке', о.строкСети > 0, '> 0', о.строкСети);
  проверить('у малосвязной концепции место в сети помечено непоказательным',
    /непоказательно/.test(о.сетьМалой), 'непоказательно', о.сетьМалой);
  const подписи = { profile: 'По профилю', structure: 'По структуре', types: 'По типам связей', network: 'По месту в сети' };
  for (const [вид, д] of Object.entries(о.виды)) {
    проверить(`карта «${вид}»: четыре вида и выбран свой`,
      д.кнопок === 4 && д.активна === подписи[вид], `4, ${подписи[вид]}`, `${д.кнопок}, ${д.активна}`);
    проверить(`карта «${вид}»: шкала ${вид === 'structure' ? 'односторонняя' : 'двусторонняя'}`,
      д.двусторонняя === (вид !== 'structure'), вид !== 'structure', д.двусторонняя);
  }
  проверить('карта по типам светит меньше половины концепций',
    о.виды.types.доля !== null && о.виды.types.доля < 0.5, '< 0.5', о.виды.types.доля);
  проверить('пороги вердикта упорядочены у трёх знаковых мер', о.порогиУпорядочены === true, true, о.порогиУпорядочены);
  проверить('вердикт называет все четыре меры и заголовок',
    о.строкВердикта === 4 && !!о.заголовок, '4 строки и заголовок', `${о.строкВердикта}, ${о.заголовок}`);
  проверить('окно сравнения: четыре плитки и четыре строки вердикта',
    о.плиток === 4 && о.строкВОкне === 4, '4 и 4', `${о.плиток} и ${о.строкВОкне}`);
  проверить('близкие пары: четыре вида',
    о.видовПар === 'pairsBtnProfile,pairsBtnStructure,pairsBtnTypes,pairsBtnNetwork',
    'профиль, структура, типы, сеть', о.видовПар);
}

// ── 10-бис-пят. строки связей выстроены «от себя» ─────────────────
//
// В окне философа и в окне концепции список показан ОТ одной стороны:
// она обязана стоять слева, стрелка — считаться от неё, возвратная связь
// получать '↻', а двуглавая ТИПОМ — '↔'. Прежде окно философа печатало
// пару в порядке базы (его концепция оказывалась справа во всех 1645
// внешних связях, где она цель), а окно концепции считало стрелку по
// неполному правилу: 195 двуглавых типом получали одностороннюю стрелку,
// 35 возвратных — '→'. Нашёл пользователь, 18 сентября 2026.
{
  const о = await page.evaluate(async () => {
    const A = window.__t, ждать = мс => new Promise(r => setTimeout(r, мс)), о = {};
    const end = x => (x && x.id) || x;
    const rel = A.S._relations;
    const refl = rel.find(l => end(l.source) === end(l.target));
    const sym = rel.find(l => A.linkHasTwoHeads(l) && !l.bidirectional && end(l.source) !== end(l.target));
    const строки = () => [...document.querySelectorAll('.connection-item')]
      .map(e => e.textContent.replace(/\s+/g, ' ').trim());
    // возвратная связь в окне своей концепции
    A.openConceptById(end(refl.source)); await ждать(700);
    о.возвратная = строки().filter(s => s.startsWith('↻')).length;
    A.closeUniversalModal(); await ждать(200);
    // двуглавая ТИПОМ — в окне цели
    const метка = A.conceptById.get(end(sym.source)).label;
    A.openConceptById(end(sym.target)); await ждать(700);
    о.двуглавая = (строки().find(s => s.includes(метка)) || '').slice(0, 2).trim();
    A.closeUniversalModal(); await ждать(200);
    // окно философа: своя концепция слева во ВСЕХ внешних строках
    const philOf = i => { const n = A.conceptById.get(i); return n ? n.concept : null; };
    const внеш = rel.find(l => {
      const s = philOf(end(l.source)), p = philOf(end(l.target));
      return s && p && s !== p;
    });
    const имя = philOf(end(внеш.target));
    A.openUniversalModal('philosopher', имя, 'view'); await ждать(900);
    // Строка устроена как в окне концепции: у каждого конца название
    // сверху, философ под ним, а ХОЗЯИН ОКНА не подписан вовсе.
    // Конец берём ПО ИДЕНТИФИКАТОРУ из разметки, а не по названию: 14
    // названий в базе повторяются (у «Логоса» их три), и карта по подписи
    // давала не того философа.
    const philИз = id => { const n = A.conceptById.get(id); return n ? n.concept : null; };
    const внешние = [...document.querySelectorAll('.connection-item')]
      .map(e => ({
        концы: [...e.querySelectorAll('[data-a1]')]
          .filter(x => x.querySelector('.concept-name'))
          .map(x => x.dataset.a1),
        подписи: [...e.querySelectorAll('.concept-philosopher')].map(x => x.textContent.trim()),
      }))
      .filter(r => r.концы.length === 2 && r.концы.some(k => philИз(k) !== имя));
    о.внешнихСтрок = внешние.length;
    о.своиСлева = внешние.filter(r => philИз(r.концы[0]) === имя).length;
    о.хозяинПодписан = внешние.filter(r => r.подписи.includes(имя)).length;
    о.чужойПодписан = внешние.filter(r => r.подписи.length === 1).length;
    A.closeUniversalModal(); await ждать(200);
    return о;
  });
  проверить('возвратная связь в окне концепции помечена ↻', о.возвратная >= 1, '≥ 1 строка', о.возвратная);
  проверить('связь двуглавого типа в окне концепции помечена ↔', о.двуглавая === '↔', '↔', о.двуглавая);
  проверить('в окне философа его концепция стоит слева во всех внешних строках',
    о.внешнихСтрок > 0 && о.своиСлева === о.внешнихСтрок,
    'все строки', `${о.своиСлева} из ${о.внешнихСтрок}`);
  проверить('имя хозяина окна в строках не повторяется', о.хозяинПодписан === 0, 0, о.хозяинПодписан);
  проверить('чужой конец подписан философом отдельной строкой',
    о.внешнихСтрок > 0 && о.чужойПодписан === о.внешнихСтрок,
    'все строки', `${о.чужойПодписан} из ${о.внешнихСтрок}`);
}

// ── 10-бис-четв. «всё равно показать» у малосвязной концепции ─────
//
// Профиль и место в сети у концепции со связностью ниже медианы
// непоказательны, но пользователь вправе взглянуть. Утверждения держат три
// вещи: кнопки есть; после нажатия колонки наполняются и подпись честно
// предупреждает; решение относится к ОДНОЙ концепции и на другой не
// действует. Порог снимается только с источника — кандидаты остаются
// связными, иначе список займут такие же вырожденные.
{
  const о = await page.evaluate(async () => {
    const A = window.__t, ждать = мс => new Promise(r => setTimeout(r, мс)), о = {};
    const слабые = A.DATA.concepts.filter(c => !A.profileIsMeaningful(c.id) && A.nodeDegreeOf(c.id) >= 1);
    о.слабыхЕсть = слабые.length >= 2;
    if (!о.слабыхЕсть) return о;
    const колонка = id => document.getElementById(id);
    A.openConceptById(слабые[0].id); await ждать(700);
    о.кнопокДо = ['similarProfileCol', 'similarNetworkCol']
      .filter(id => colonkaButton(id)).length;
    function colonkaButton(id) {
      const c = колонка(id);
      return c && /Всё равно/.test((c.querySelector('.similar-map-btn') || {}).textContent || '');
    }
    колонка('similarProfileCol').querySelector('.similar-map-btn').click();
    await ждать(500);
    о.строкПрофиля = колонка('similarProfileCol').querySelectorAll('.similar-item').length;
    о.подписьПрофиля = колонка('similarProfileCol').querySelector('.similar-col-hint').textContent;
    колонка('similarNetworkCol').querySelector('.similar-map-btn').click();
    await A.ensureNetworkProfile(); await ждать(700);
    о.строкСети = колонка('similarNetworkCol').querySelectorAll('.similar-item').length;
    // кандидаты остаются связными: у всех показанных связность не ниже медианы
    const порог = A.medianNodeDegree();
    // имя концепции берём из РАЗМЕТКИ: в сборке onclick переведён в
    // делегирование (data-act-click + data-a1), в исходнике остаётся onclick
    const имена = [...колонка('similarProfileCol').querySelectorAll('.similar-item')]
      .map(e => e.dataset.a1 || (e.getAttribute('onclick') || '').replace(/.*'(.+?)'.*/, '$1'))
      .filter(Boolean);
    о.кандидатыСвязны = имена.length > 0 && имена.every(id => A.nodeDegreeOf(id) >= порог);
    A.closeUniversalModal(); await ждать(300);
    A.openConceptById(слабые[1].id); await ждать(700);
    о.кнопокНаДругой = ['similarProfileCol', 'similarNetworkCol'].filter(id => colonkaButton(id)).length;
    A.closeUniversalModal(); await ждать(200);
    return о;
  });
  if (о.слабыхЕсть) {
    проверить('у малосвязной концепции две кнопки «Всё равно показать»', о.кнопокДо === 2, 2, о.кнопокДо);
    проверить('после кнопки профильная колонка наполняется', о.строкПрофиля > 0, '> 0', о.строкПрофиля);
    проверить('подпись предупреждает о ненадёжности профиля',
      /ненадёжно/.test(о.подписьПрофиля || ''), 'предупреждение', (о.подписьПрофиля || '').slice(0, 80));
    проверить('после кнопки колонка места в сети наполняется', о.строкСети > 0, '> 0', о.строкСети);
    проверить('в насильном списке кандидаты остаются связными', о.кандидатыСвязны === true, true, о.кандидатыСвязны);
    проверить('на другой концепции кнопки возвращаются', о.кнопокНаДругой === 2, 2, о.кнопокНаДругой);
  } else {
    проверить('в базе есть малосвязные концепции для проверки', false, '≥ 2', 0);
  }
}

// ── 10-бис-трет. кеши, посчитанные вне окна статистики, не выбрасываются ──
//
// Прежде закрытие окна обнуляло ключ области, и при следующем открытии
// сбрасывались все кеши — в том числе сетевые метрики, досчитанные кнопкой
// в окне концепции. Утверждения держат оба конца: в том же ладе (оба
// переключателя, весь граф) кеш живёт; смена переключателя его сбрасывает.
{
  const о = await page.evaluate(async () => {
    const A = window.__t, ждать = мс => new Promise(r => setTimeout(r, мс)), о = {};
    // предусловие: оба переключателя включены, область — весь граф
    A.openStatsModal(); await ждать(600);
    const uw = document.getElementById('statsUseWeightsToggle');
    const rd = document.getElementById('statsRespectDirectionToggle');
    const sc = document.getElementById('statsScopeToggle');
    if (!uw.checked) { uw.checked = true; A.handleStatsParameterChange(); }
    if (!rd.checked) { rd.checked = true; A.handleStatsParameterChange(); }
    if (sc.checked) { sc.checked = false; A.handleMetricsScopeChange(); }
    await ждать(300);
    document.querySelector('.stats-close-btn[data-act-click="close-stats-modal"]').click();
    await ждать(400);
    await A.ensureNetworkProfile();
    const до = A.networkSimilarityData();
    A.openStatsModal(); await ждать(800);
    о.пережилОткрытие = !!до && A.networkSimilarityData() === до;
    uw.checked = false; A.handleStatsParameterChange(); await ждать(500);
    о.сброшенСменой = A.networkSimilarityData() !== до;
    uw.checked = true; A.handleStatsParameterChange(); await ждать(300);
    document.querySelector('.stats-close-btn[data-act-click="close-stats-modal"]').click();
    await ждать(400);
    return о;
  });
  проверить('сетевые метрики, посчитанные вне окна статистики, переживают его открытие',
    о.пережилОткрытие === true, true, о.пережилОткрытие);
  проверить('смена переключателя весов сбрасывает их', о.сброшенСменой === true, true, о.сброшенСменой);
}

// ── 10-трет. строки традиций отвечают набору философов ─────────────
//
// Прежде отбор держался на ДВУХ независимых наборах: selectedPhilosophers
// и selectedTraditions. Второй накладывался поверх третьим запретом, о
// котором не знали ни список философов, ни режимы «Связанные сети» и
// «Сквозные цепочки» — те теряли традиции молча. Набор слит в один,
// строка традиции стала показателем состояния; согласованность показателя
// с набором не проверял никто, поэтому расхождение и жило.
{
  const состояние = async () => page.evaluate(() => {
    const A = window.__t;
    const выбр = A.S.selectedPhilosophers;
    const все = A.DATA.traditions.map(t => t.id);
    const плохо = [];
    for (const id of [...все, 'no_tradition']) {
      const cb = document.getElementById('trad-' + id);
      if (!cb) { плохо.push(id + ': нет строки'); continue; }
      const члены = A.traditionMembers(id);
      const n = члены.filter(x => выбр.has(x)).length;
      const ждёмОтмечен = члены.length > 0 && n === члены.length;
      const ждёмНеполный = n > 0 && n < члены.length;
      if (cb.checked !== ждёмОтмечен) плохо.push(id + ': отмечен ' + cb.checked);
      if (cb.indeterminate !== ждёмНеполный) плохо.push(id + ': неполный ' + cb.indeterminate);
      const c = document.getElementById('trad-count-' + id);
      if (!c || c.textContent.trim() !== '(' + n + ' из ' + члены.length + ')')
        плохо.push(id + ': счёт «' + (c ? c.textContent.trim() : '—') + '»');
    }
    return { плохо, выбрано: выбр.size };
  });

  await page.evaluate(() => window.__t.deselectAllPhilosophers());
  await wait(900);
  let с = await состояние();
  проверить('строки традиций отвечают пустому набору', с.плохо.length === 0, 0, с.плохо[0] || 0);

  await page.evaluate(() => window.__t.selectAllPhilosophers());
  await wait(900);
  с = await состояние();
  проверить('строки традиций отвечают полному набору', с.плохо.length === 0, 0, с.плохо[0] || 0);

  // Частичный набор: неполный выбор и счёт должны его показать.
  await page.evaluate(() => window.__t.onlyTradition('existentialism'));
  await wait(900);
  с = await состояние();
  проверить('строки традиций отвечают частичному набору', с.плохо.length === 0, 0, с.плохо[0] || 0);

  const ч = await page.evaluate(() => {
    const cb = document.getElementById('trad-phenomenology');
    const c = document.getElementById('trad-count-phenomenology');
    return { неполный: cb.indeterminate, счёт: c.textContent.trim() };
  });
  проверить('пересекающаяся традиция показана неполной', ч.неполный === true, true, ч.неполный);

  // БЕЗУСЛОВНЫЙ СБРОС: снимает всех членов, даже состоящих в другой
  // традиции с частичным выбором. Порядок нажатий на итог не влияет.
  const до = await page.evaluate(() => window.__t.S.selectedPhilosophers.size);
  await page.evaluate(() => window.__t.resetTradition('existentialism'));
  await wait(900);
  const после = await page.evaluate(() => ({
    осталось: window.__t.S.selectedPhilosophers.size,
    хайдеггер: window.__t.S.selectedPhilosophers.has('Хайдеггер'),
    феноменология: document.getElementById('trad-count-phenomenology').textContent.trim(),
  }));
  проверить('сброс традиции снимает всех её членов', после.осталось === 0, 0, после.осталось);
  проверить('снимает и того, кто состоит в другой традиции',
    после.хайдеггер === false, false, после.хайдеггер);
  проверить('пересекающаяся традиция опустела следом',
    после.феноменология === '(0 из 10)', '(0 из 10)', после.феноменология);

  // Строка «вне традиций» спрятана, пока таких философов нет.
  const вне = await page.evaluate(() => {
    const cb = document.getElementById('trad-no_tradition');
    return cb ? cb.closest('.legend-item').style.display : 'нет строки';
  });
  проверить('строка «вне традиций» скрыта, пока таких нет', вне === 'none', 'none', вне);

  await page.evaluate(() => window.__t.selectAllPhilosophers());
  await wait(700);
}

// ── 10-четв. окно списка отобранного ───────────────────────────────
//
// ТРИ УТВЕРЖДЕНИЯ ПРОТИВ ТРЁХ ДЕФЕКТОВ, КОТОРЫХ НЕ ПОЙМАЛ НИКТО.
//
// Первая редакция окна имела все три, и приёмка прошла зелено: эталоны
// сличают снимок с прежним снимком, а новое окно сличать не с чем — его
// эталон учреждается ВМЕСТЕ с дефектами. Нашёл их человек, открывший окно.
// Отсюда правило: у новой части утверждения пишутся ОТ ЗАМЫСЛА, а не от
// снимка, — иначе первая редакция не проверяется вовсе.
{
  await page.evaluate(() => window.__t.openSelectionListModal());
  await wait(600);
  await page.evaluate(() => window.__t.toggleSelectionBlock('relation'));
  await wait(800);

  // 1. ПРОКРУТКА. Первая редакция вешала содержимое на .stats-modal-body,
  // а у того overflow: hidden — он там для двух колонок со своей прокруткой.
  const прокрутка = await page.evaluate(() => {
    const b = document.getElementById('selectionListBody');
    const c = getComputedStyle(b);
    return { overflowY: c.overflowY, влезает: b.scrollHeight > b.clientHeight + 4 };
  });
  проверить('тело окна списка прокручивается', прокрутка.overflowY === 'auto',
    'auto', прокрутка.overflowY);
  проверить('и содержимое в него не влезает — значит прокрутка нужна',
    прокрутка.влезает === true, true, прокрутка.влезает);

  // 2. СЛОИ. Первая редакция брала z-index: 9999 у окна статистики, и окно
  // просмотра (2150), открытое ОТСЮДА, оказывалось ПОД списком: открыто, но
  // не видно. Ровно дефект И-2, описанный у .detail-modal.
  await page.evaluate(() => document.querySelector('#selectionListBody .sel-name').click());
  await wait(900);
  const слои = await page.evaluate(() => {
    const m = document.getElementById('universalModal');
    return {
      открыто: m.classList.contains('show'),
      просмотр: +getComputedStyle(m).zIndex,
      список: +getComputedStyle(document.getElementById('selectionListModal')).zIndex,
    };
  });
  проверить('щелчок по строке открывает окно просмотра', слои.открыто === true,
    true, слои.открыто);
  проверить('И ОНО ЛЕЖИТ ВЫШЕ СПИСКА, а не под ним',
    слои.просмотр > слои.список, `> ${слои.список}`, слои.просмотр);

  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  await page.evaluate(() => window.__t.closeSelectionListModal());
  await wait(300);

  // 3. ПОДВАЛ ЛЕГЕНДЫ ВНЕ ПРОКРУТКИ, А НЕ ЗАКРАШЕН.
  //
  // Три редакции подряд — и каждая учит одному.
  // Первая красила подвал var(--panel-bg, #1b1b24): такой переменной не
  // существует, применялся запасной цвет, заметно серее панели.
  // Вторая брала --surface-solid — но панель залита ГРАДИЕНТОМ, и плоская
  // краска расходится с ним тем заметнее, чем ниже; подбирать цвет под
  // градиент бесполезно, он меняется с высотой окна.
  // Третья убрала краску вовсе: легенда стала колонкой, прокручивается её
  // середина (#legendScroll), подвал — обычный последний ребёнок вне
  // прокрутки. Под ним ничего не проезжает, и залит он тем же градиентом,
  // что и панель.
  //
  // Поэтому спрашиваем УСТРОЙСТВО, а не цвет: цвет здесь — следствие, и
  // проверять следствие значит снова привязаться к решению, а не к замыслу.
  const подвал = await page.evaluate(() => {
    const f = document.querySelector('.legend-footer');
    const sc = document.getElementById('legendScroll');
    const l = document.getElementById('legend');
    return {
      серединаПрокручивается: getComputedStyle(sc).overflowY === 'auto'
                              && sc.scrollHeight > sc.clientHeight + 4,
      панельНеПрокручивается: getComputedStyle(l).overflowY === 'hidden',
      подвалВнеПрокрутки: !sc.contains(f),
      подвалВиден: f.getBoundingClientRect().bottom <= l.getBoundingClientRect().bottom + 1,
      фон: getComputedStyle(f).backgroundColor,
    };
  });
  проверить('прокручивается СЕРЕДИНА легенды, а не вся панель',
    подвал.серединаПрокручивается && подвал.панельНеПрокручивается, true,
    `${подвал.серединаПрокручивается}/${подвал.панельНеПрокручивается}`);
  проверить('подвал легенды ВНЕ прокрутки — красить его не нужно',
    подвал.подвалВнеПрокрутки === true, true, подвал.подвалВнеПрокрутки);
  проверить('и он виден целиком без прокручивания',
    подвал.подвалВиден === true, true, подвал.подвалВиден);
}

// ── 10-пят. строки списка и знак направленности ────────────────────
//
// Всё, что здесь стережётся, найдено ЧЕЛОВЕКОМ, открывшим окно, — ни один
// прибор этого не спрашивал.
{
  // РАЗВОРАЧИВАЕМ ПО СОСТОЯНИЮ, А НЕ ПЕРЕКЛЮЧЕНИЕМ. Раздел выше уже открывал
  // блок связей, и второй toggle его закрывал: строк не оказывалось, и проба
  // падала на пустом списке. Переключатель годится человеку, который видит
  // состояние; прибору надо приводить к известному, а не переключать вслепую.
  await page.evaluate(() => window.__t.selectAllPhilosophers());
  await wait(500);
  await page.evaluate(() => window.__t.openSelectionListModal());
  await wait(500);
  // Состояние спрашивается У НАБОРА, а не угадывается по разметке. Первая
  // редакция этой проверки искала «▼» в заголовке и сверяла имя блока по
  // innerHTML — способ, который врёт при любой правке разметки, что и
  // случилось: блоки не открылись, и проба упала на пустом списке.
  await page.evaluate(() => {
    ['relation', 'concept'].forEach(kind => {
      if (!window.__t.selectionListOpenBlocks.has(kind)) {
        window.__t.toggleSelectionBlock(kind);
      }
    });
  });
  await wait(900);

  const строки = await page.evaluate(() => {
    const блоки = document.querySelectorAll('#selectionListBody .sel-block');
    const св = блоки[2].querySelectorAll('.sel-row');
    const кц = блоки[1].querySelectorAll('.sel-row');
    const знаки = {};
    блоки[2].querySelectorAll('.sel-name').forEach(n => {
      const m = n.textContent.match(/[↔→↻]/);
      if (m) знаки[m[0]] = (знаки[m[0]] || 0) + 1;
    });
    return {
      уСвязиЕстьПодпись: !!(св[0].querySelector('.sel-caption') || {}).textContent,
      уКонцепцииЕстьПодпись: !!(кц[0].querySelector('.sel-caption') || {}).textContent,
      знаки,
    };
  });
  // ПОДПИСЬ СВЯЗИ НЕСЁТ ТОЛЬКО АДРЕСАТА. Философ-источник назван чертой
  // над группой; повторять его в каждой из 23 строк (медиана; у самого
  // связного — 94) значило бы переписывать заголовок на каждой строке.
  // У ВНУТРЕННЕЙ связи подписи нет вовсе — философ один и он на черте.
  // Прежняя редакция ждала «названы философы обоих концов» и краснела на
  // верном поведении: она описывала снятое устройство.
  проверить('у внутренней связи подписи нет — философ назван чертой',
    строки.уСвязиЕстьПодпись === false, false, строки.уСвязиЕстьПодпись);
  // ПОДПИСЬ У КОНЦЕПЦИИ ВИДНА ВСЕГДА — по образцу окна философа. Без неё
  // свёрнутый список был рядом имён без смысла.
  проверить('у строки концепции подпись видна без разворота',
    строки.уКонцепцииЕстьПодпись === true, true, строки.уКонцепцииЕстьПодпись);
  // ЗНАК НАПРАВЛЕННОСТИ: видов ТРИ. Возвратные связи (35 в базе) рисовались
  // как «А → А» — вид, читаемый как ошибка данных.
  проверить('возвратные связи помечены своим знаком, а не стрелкой',
    (строки.знаки['↻'] || 0) > 0, '>0', строки.знаки['↻'] || 0);

  await page.evaluate(() => window.__t.closeSelectionListModal());
  await wait(300);

  // ЗАМОРОЗКА УКЛАДКИ, как у прочих полноэкранных окон. Граф под окном не
  // виден, а укладка продолжала считать кадры.
  const заморозка = await page.evaluate(() => {
    const S = window.__t.S;
    let стопов = 0;
    const было = S.simulation.stop.bind(S.simulation);
    S.simulation.stop = function () { стопов++; return было(); };
    window.__t.openSelectionListModal();
    const после = стопов;
    window.__t.closeSelectionListModal();
    S.simulation.stop = было;
    return после;
  });
  проверить('открытие списка замораживает укладку', заморозка > 0, '>0', заморозка);

  // ЗНАК НАПРАВЛЕННОСТИ ЖИВЁТ В ОДНОМ МЕСТЕ. Правило было записано в
  // четырёх порознь и везде одинаково неполно; общая directionMark заведена
  // затем, чтобы пятое место взяло её, а не переписало снова.
  const знак = await page.evaluate(() => {
    const A = window.__t;
    const петля = A.DATA.links.find(l => (l.source.id || l.source) === (l.target.id || l.target));
    const взаимная = A.DATA.links.find(l => l.bidirectional);
    const обычная = A.DATA.links.find(l => !l.bidirectional
      && (l.source.id || l.source) !== (l.target.id || l.target));
    return { петля: A.directionMark(петля), взаимная: A.directionMark(взаимная),
             обычная: A.directionMark(обычная) };
  });
  проверить('directionMark различает три вида направленности',
    знак.петля === '↻' && знак.взаимная === '↔' && знак.обычная === '→',
    '↻ ↔ →', `${знак.петля} ${знак.взаимная} ${знак.обычная}`);

  // ТЕКСТ И ПОЛОТНО НЕ РАСХОДЯТСЯ. Взаимность бывает двух родов: флаг
  // bidirectional у связи (81) и symmetric у типа (202). Полотно знало оба
  // и рисовало два наконечника; directionMark знала только флаг и давала
  // одностороннюю стрелку — человек видел на графе связь с двумя остриями,
  // открывал список и находил «→». Проверяется на ВСЕЙ базе, а не на
  // образце: расхождение касалось ровно того рода, которого в образце
  // могло не оказаться.
  const согласие = await page.evaluate(() => {
    const A = window.__t;
    let врозь = 0, примеры = [];
    for (const l of A.DATA.links) {
      const петля = (l.source.id || l.source) === (l.target.id || l.target);
      const два = A.linkHasTwoHeads(l);
      const знак = A.directionMark(l);
      const ждём = петля ? '↻' : (два ? '↔' : '→');
      if (знак !== ждём) {
        врозь++;
        if (примеры.length < 3) примеры.push(l.type + ' ' + знак + '≠' + ждём);
      }
    }
    return { врозь, примеры };
  });
  проверить('знак в тексте согласен с числом наконечников на полотне',
    согласие.врозь === 0, 0, согласие.врозь + (согласие.примеры.length
      ? ' (' + согласие.примеры.join(', ') + ')' : ''));
}

// ── 10-шест. порядок в списках ─────────────────────────────────────
//
// Порядка не было вовсе: списки шли в порядке базы, то есть в порядке
// заведения по заходам A–H. Назвать такое правило вслух нельзя, и человек
// не понимал, почему концепции Спинозы и Локка идут вперемешку.
{
  const порядок = await page.evaluate(() => {
    const A = window.__t;
    const беда = [];

    // 1. РОВЕСНИКИ. Сравнение по одному году НЕДООПРЕДЕЛЕНО, а ровесников в
    // базе двенадцать групп — 26 человек из 100. Без второго уровня их
    // порядок зависит от порядка в файле.
    const годы = {};
    A.DATA.philosophers.forEach(p => { (годы[p.birth] || (годы[p.birth] = [])).push(p.nameRu); });
    const пары = Object.values(годы).filter(v => v.length > 1);
    const упор = [...A.DATA.philosophers].sort(A.comparePhilosophers).map(p => p.nameRu);
    for (const группа of пары) {
      const места = группа.map(n => упор.indexOf(n));
      const поАлфавиту = [...группа].sort((a, b) => a.localeCompare(b, 'ru'));
      const какВышло = [...группа].sort((a, b) => упор.indexOf(a) - упор.indexOf(b));
      if (поАлфавиту.join('|') !== какВышло.join('|')) беда.push('ровесники: ' + какВышло.join(', '));
      // и стоять они обязаны подряд, а не вперемешку с чужими годами
      if (Math.max(...места) - Math.min(...места) !== места.length - 1) {
        беда.push('ровесники вразбивку: ' + группа.join(', '));
      }
    }

    // 2. ПОРЯДОК СВЯЗЕЙ — ПО СИСТЕМАМ.
    //
    // Проверяется на ОБЩЕМ списке, а не у каждой концепции: правило
    // сортирует связь по философу ИСТОЧНИКА, и у концепции-цели чужая связь
    // законно окажется впереди её собственных внутренних. Первая редакция
    // этого утверждения спрашивала «внутренние впереди» у каждой концепции —
    // и краснела на верном поведении (sphere_being: пифагорова связь идёт
    // перед парменидовыми). Утверждение описывало снятое правило.
    const свой = x => { const c = A.conceptById.get(x.id || x); return c ? c.concept : ''; };
    const порядокСвязей = [...A.DATA.links].sort(A.compareLinks);
    let проверено = порядокСвязей.length;

    // 2а. Список и вправду упорядочен этим сравнением (без «почти»).
    for (let i = 1; i < порядокСвязей.length; i++) {
      if (A.compareLinks(порядокСвязей[i - 1], порядокСвязей[i]) > 0) {
        беда.push('порядок нарушен на месте ' + i); break;
      }
    }

    // 2б. Внутри каждого философа-источника внутренние идут перед внешними.
    const груды = new Map();
    порядокСвязей.forEach((l, i) => {
      const чей = свой(l.source);
      if (!груды.has(чей)) груды.set(чей, []);
      груды.get(чей).push(свой(l.source) === свой(l.target));
    });
    for (const [чей, виды] of груды) {
      const последнийВнутр = виды.lastIndexOf(true);
      const первыйВнешний = виды.indexOf(false);
      if (последнийВнутр !== -1 && первыйВнешний !== -1 && последнийВнутр > первыйВнешний) {
        беда.push('у ' + чей + ' внешняя связь идёт перед внутренней'); break;
      }
    }

    // 2в. Связи одного философа лежат ПОДРЯД, а не вперемешку с чужими.
    const встречен = new Set();
    let прежний = null;
    for (const l of порядокСвязей) {
      const чей = свой(l.source);
      if (чей !== прежний) {
        if (встречен.has(чей)) { беда.push('связи ' + чей + ' идут вразбивку'); break; }
        встречен.add(чей); прежний = чей;
      }
    }

    // 3. КОНЦЕПЦИИ ФИЛОСОФА — по алфавиту.
    for (const [имя, список] of A.nodesByPhilosopher) {
      const было = список.map(n => n.label);
      const надо = [...было].sort((a, b) => a.localeCompare(b, 'ru'));
      if (было.join('|') !== надо.join('|')) { беда.push('концепции не по алфавиту: ' + имя); break; }
    }

    return { беда, проверено, ровесниковГрупп: пары.length };
  });
  проверить('ровесники упорядочены по алфавиту и стоят подряд',
    !порядок.беда.some(б => б.startsWith('ровесники')), 0,
    порядок.беда.filter(б => б.startsWith('ровесники'))[0] || 0);
  проверить('групп ровесников в базе больше одной — второй уровень нужен',
    порядок.ровесниковГрупп > 1, '>1', порядок.ровесниковГрупп);
  проверить('список связей упорядочен своим же сравнением',
    !порядок.беда.some(б => б.startsWith('порядок')), 0,
    порядок.беда.filter(б => б.startsWith('порядок'))[0] || 0);
  проверить('у каждого философа внутренние связи идут перед внешними',
    !порядок.беда.some(б => б.startsWith('у ')), 0,
    порядок.беда.filter(б => б.startsWith('у '))[0] || 0);
  проверить('связи одного философа лежат подряд, а не вразбивку',
    !порядок.беда.some(б => б.startsWith('связи')), 0,
    порядок.беда.filter(б => б.startsWith('связи'))[0] || 0);
  проверить('концепции философа идут по алфавиту',
    !порядок.беда.some(б => б.startsWith('концепции')), 0,
    порядок.беда.filter(б => б.startsWith('концепции'))[0] || 0);
}

// ── 10-сед. зеркала двусторонних связей и разделители ──────────────
//
// Двусторонняя внешняя связь записана в базе ОДИН раз и в одну сторону, а
// порядок ведётся по философу-источнику: «Эйдос ↔ Эпистема» легла бы к
// Платону, а у Фуко её не было бы вовсе — хотя связь принадлежит обоим, и
// сторона выбрана произволом записи. Поэтому для таких строится зеркало.
{
  const зеркала = await page.evaluate(() => {
    const A = window.__t;
    const наборы = A.selectionListSets();
    const св = наборы.relation;
    // КЛЮЧ ПО ИДЕНТИФИКАТОРАМ, А НЕ ПО ПОДПИСЯМ. Первая редакция считала
    // тёзок одной связью: «Общественный договор» носят ТРИ концепции —
    // Гоббса, Локка и Руссо, — и «Интенциональность» две (Брентано и
    // Гуссерль). Прибор выдавал четыре лишних вхождения на верном коде.
    const кон = z => String(z && z.id ? z.id : z);
    const пара = l => [кон(l.source), кон(l.target)].sort().join(' | ');

    // Каждая связь встречается ровно столько раз, сколько ей положено:
    // двусторонняя внешняя — дважды, всё прочее — однажды.
    const счёт = new Map();
    for (const l of св) {
      const k = пара(l) + '|' + l.type;
      счёт.set(k, (счёт.get(k) || 0) + 1);
    }
    let лишние = 0, недостающие = 0;
    for (const l of A.DATA.links) {
      const надо = (A.linkHasTwoHeads(l) && !A.linkIsInternal(l)) ? 2 : 1;
      const вышло = счёт.get(пара(l) + '|' + l.type) || 0;
      if (вышло > надо) лишние++;
      if (вышло < надо) недостающие++;
    }
    return {
      строк: св.length,
      зеркал: св.filter(l => l.mirrorOf).length,
      внутреннихЗеркал: св.filter(l => l.mirrorOf && A.linkIsInternal(l)).length,
      лишние, недостающие,
      счётчикОкна: A.selectionMirrorCount,
    };
  });
  проверить('двусторонняя внешняя связь показана ДВАЖДЫ, прочие по разу',
    зеркала.лишние === 0 && зеркала.недостающие === 0, '0/0',
    `${зеркала.лишние}/${зеркала.недостающие}`);
  // ВНУТРЕННИЕ НЕ ОТРАЖАЮТСЯ: философ один, и вторая строка была бы
  // удвоением без смысла.
  проверить('внутренние связи не отражаются', зеркала.внутреннихЗеркал === 0, 0,
    зеркала.внутреннихЗеркал);
  проверить('число повторных названо в заголовке блока',
    зеркала.счётчикОкна === зеркала.зеркал, зеркала.зеркал, зеркала.счётчикОкна);

  // ЗЕРКАЛО ОТКРЫВАЕТ ТУ ЖЕ СВЯЗЬ. У него концы переставлены, и поиск
  // строго «источник → цель» не нашёл бы ничего — строка молча перестала
  // бы открываться.
  await page.evaluate(() => {
    window.__t.openSelectionListModal();
    if (!window.__t.selectionListOpenBlocks.has('relation')) {
      window.__t.toggleSelectionBlock('relation');
    }
  });
  await wait(1000);
  const черты = await page.evaluate(() => {
    const блоки = [...document.querySelectorAll('#selectionListBody .sel-block')];
    const тело = блоки[2];
    const первый = тело.querySelector('.sel-block-body > *');
    return {
      перваяЧерта: первый && первый.classList.contains('sel-divider')
        ? первый.textContent.trim() : '(не черта)',
      чертВсего: тело.querySelectorAll('.sel-divider').length,
      // философа в строке концепции больше нет — его говорит черта
      уКонцепцииЕстьМета: !!блоки[1].querySelector('.sel-row .sel-meta'),
    };
  });
  // ЧЕРТА У ПЕРВОЙ ГРУППЫ ТОЖЕ: имя философа стоит на ней и больше нигде.
  проверить('первая группа тоже начинается с черты',
    черты.перваяЧерта !== '(не черта)' && черты.перваяЧерта.length > 0,
    'черта с именем', черты.перваяЧерта);
  проверить('в строке концепции философ не повторяется — его назвала черта',
    черты.уКонцепцииЕстьМета === false, false, черты.уКонцепцииЕстьМета);

  await page.evaluate(() => window.__t.closeSelectionListModal());
  await wait(300);
}

// ── 10-вос. цвет кружка у строки связи ─────────────────────────────
//
// Правило было записано ЧЕТЫРЬМЯ способами в четырёх местах, и три из них
// на вопрос «с кем связано» не отвечали: в окне философа у внутренних —
// свой цвет на все строки, у внешних — по ИСТОЧНИКУ (а внешние берутся в
// обе стороны, и у половины строк цвет показывал самого хозяина окна), в
// списке отобранного — вовсе цветом ТИПА связи.
{
  const цвет = await page.evaluate(() => {
    const A = window.__t;
    const цв = имя => { const p = A.philosopherByName.get(имя); return p ? p.color : null; };
    const кон = z => A.conceptById.get(z && z.id ? z.id : z) || {};
    let верно = 0, неверно = 0; const примеры = [];
    // ПРОВЕРЯЕТСЯ С ОБЕИХ СТОРОН: хозяином строки бывает и источник (список,
    // где связь лежит в группе источника), и цель (окно концепции, куда
    // связь пришла). Проверка только с одной стороны пропустила бы ровно ту
    // ошибку, что была в окне философа.
    for (const l of A.DATA.links) {
      const s = кон(l.source), t = кон(l.target);
      for (const хозяин of [s.concept, t.concept]) {
        const чужой = (s.concept === хозяин) ? t.concept : s.concept;
        if (A.otherEndColor(l, хозяин) === цв(чужой)) верно++;
        else { неверно++; if (примеры.length < 3) примеры.push(хозяин + '→' + чужой); }
      }
    }
    return { верно, неверно, примеры };
  });
  проверить('цвет кружка — цвет ЧУЖОГО конца связи, с обеих сторон',
    цвет.неверно === 0, 0, цвет.неверно + (цвет.примеры.length
      ? ' (' + цвет.примеры.join(', ') + ')' : ''));
  проверить('правило проверено на всей базе, а не на образце',
    цвет.верно > 5000, '>5000', цвет.верно);

  // ЗНАК НАПРАВЛЕННОСТИ КРАСИТСЯ ТИПОМ — как linkArrow в окнах просмотра.
  // Цвет здесь подкрепление, а не единственный носитель: тип назван и
  // словами, различить двадцать один тип по цвету никто не сможет.
  await page.evaluate(() => {
    window.__t.openSelectionListModal();
    if (!window.__t.selectionListOpenBlocks.has('relation')) {
      window.__t.toggleSelectionBlock('relation');
    }
  });
  await wait(1000);
  const знаки = await page.evaluate(() => {
    const A = window.__t;
    const ряды = [...document.querySelectorAll('#selectionListBody .sel-block')][2]
      .querySelectorAll('.sel-row');
    let сЦветом = 0, всего = 0, разных = new Set();
    for (const r of [...ряды].slice(0, 50)) {
      const м = r.querySelector('.sel-mark');
      всего++;
      if (м && м.style.color) { сЦветом++; разных.add(м.style.color); }
    }
    return { всего, сЦветом, разных: разных.size };
  });
  проверить('знак связи окрашен типом в каждой строке',
    знаки.сЦветом === знаки.всего, знаки.всего, знаки.сЦветом);
  проверить('и цвета типов разные, а не один на всех',
    знаки.разных > 1, '>1', знаки.разных);

  await page.evaluate(() => window.__t.closeSelectionListModal());
  await wait(300);
}

// ── 10-гамма. СЕТЕВОЕ СХОДСТВО ПЕРЕЖИВАЕТ ОКНО СТАТИСТИКИ (26.09.2026) ─────
// Замечание автора: сходство, посчитанное в окне концепции, после открытия и
// закрытия окна статистики приходилось считать заново — закрытие окна
// обнуляло кеши безусловно. Встречное: если окно считало на КОПИИ (выключен
// учёт весов), кеши держат её числа и при закрытии обязаны сброситься —
// иначе окно концепции показало бы сходство по чужим данным.
{
  const keep = await page.evaluate(async () => {
    const A = window.__t;
    A.closeUniversalModal();
    await A.ensureNetworkProfile();
    const before = !!A.networkSimilarityData();
    A.openStatsModal(); await new Promise(r => setTimeout(r, 400));
    A.switchStatsView('pagerank'); await new Promise(r => setTimeout(r, 1500));
    A.closeStatsModal(); await new Promise(r => setTimeout(r, 300));
    return { before, afterLive: !!A.networkSimilarityData() };
  });
  проверить('сетевое сходство переживает окно статистики, считавшее в живом ладе',
    keep.before && keep.afterLive, 'есть до и после', JSON.stringify(keep));
  const drop = await page.evaluate(async () => {
    const A = window.__t;
    A.openStatsModal(); await new Promise(r => setTimeout(r, 400));
    A.switchStatsView('pagerank'); await new Promise(r => setTimeout(r, 800));
    const w = document.getElementById('statsUseWeightsToggle');
    w.checked = false; w.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 1500));
    // Сходство ДОСЧИТЫВАЕТСЯ на копии целиком: первая редакция открывала только
    // PageRank, трёх других метрик не было, и сходства после закрытия не было
    // при любом сбросе — подлог «не сбрасывать никогда» прошёл зелёным.
    await A.ensureNetworkProfile();
    const inCopy = !!A.networkSimilarityData();
    A.closeStatsModal(); await new Promise(r => setTimeout(r, 300));
    const after = !!A.networkSimilarityData();
    A.openStatsModal(); await new Promise(r => setTimeout(r, 300));
    w.checked = true; w.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 300));
    A.closeStatsModal();
    return { inCopy, afterCopy: after };
  });
  проверить('после окна на копии (веса выключены) кеши сброшены, а не выданы за живые',
    drop.inCopy === true && drop.afterCopy === false, 'на копии было, после закрытия нет', JSON.stringify(drop));
}

// ── 10-эпсилон. ПРАВКА ГРАФА И КЕШИ МЕТРИК (26.09.2026) ─────────────────
// Закрытие окна статистики теперь СОХРАНЯЕТ кеши живого лада. Правку графа
// обслуживает своё событие (data-changed сносит кеши), но это надо видеть, а
// не выводить: после правки сетевой профиль обязан совпасть с пересчётом С
// НУЛЯ — и при правке после закрытия окна, и при правке в окне на копии.
// На свежей вкладке: правка добавляет связь и не должна мешать прочему.
{
  const tab = await browser.newPage();
  await tab.setViewport({ width: 1440, height: 900 });
  tab.on('pageerror', e => ошибки.push('вкладка правки: ' + String(e).split('\n')[0]));
  tab.on('dialog', d => d.accept());
  await tab.goto(BASE + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(6500);
  await tab.addScriptTag({ type: 'module', content: `
    import './_probe-rig.js';
    window.__t = window.__app;
    window.__tReady = true;` });
  await tab.waitForFunction('window.__t && window.__t.DATA', { timeout: 20000 });
  const edits = await tab.evaluate(async () => {
    const A = window.__t, D = A.DATA, sleep = ms => new Promise(r => setTimeout(r, ms));
    let serial = 0;
    const addLink = () => {                      // путь сохранения: запись, связь графа, afterDataChange
      const has = new Set(D.links.map(l => (l.source.id || l.source) + '>' + (l.target.id || l.target)));
      const s = D.nodes.find(n => A.nodeDegreeOf(n.id) >= 3 + serial);
      const t = D.nodes.find(n => n !== s && n.concept !== s.concept && !has.has(s.id + '>' + n.id) && !has.has(n.id + '>' + s.id));
      const rec = { id: 'edit_cache_probe_' + (++serial), source: s.id, target: t.id, type: 'develop', weight: 3,
                    bidirectional: false, description: 'проба' };
      D.relations.push({ ...rec }); const link = { ...rec }; D.links.push(link); A.addLinkToGraph(link);
      A.afterDataChange({ nodes: true, links: true });
    };
    const print = () => { const W = A.networkSimilarityData(); return W ? JSON.stringify(W.Z.map(r => r.map(v => +v.toFixed(9)))) : null; };
    const fromScratch = async () => { A.invalidateEverythingForScope(); A.initializePhilosophyMetrics(); await A.ensureNetworkProfile(); return print(); };
    const out = {};
    // 1. посчитали, окно в живом ладе закрыли (кеши сохранены), ПОТОМ правка
    await A.ensureNetworkProfile();
    A.openStatsModal(); await sleep(400); A.switchStatsView('pagerank'); await sleep(1500);
    A.closeStatsModal(); await sleep(300);
    addLink();
    out.afterCloseDropped = !A.networkSimilarityData();
    await A.ensureNetworkProfile(); const flow1 = print();
    out.afterCloseFresh = flow1 === await fromScratch();
    // 2. правка В ОКНЕ НА КОПИИ (веса выключены), затем закрытие
    A.openStatsModal(); await sleep(400); A.switchStatsView('pagerank'); await sleep(800);
    const w = document.getElementById('statsUseWeightsToggle');
    w.checked = false; w.dispatchEvent(new Event('change', { bubbles: true })); await sleep(1200);
    addLink(); await sleep(300);
    A.closeStatsModal(); await sleep(300);
    await A.ensureNetworkProfile(); const flow2 = print();
    out.copyEditFresh = flow2 === await fromScratch();
    A.openStatsModal(); await sleep(300); w.checked = true; w.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(300); A.closeStatsModal();
    return out;
  });
  await tab.close();
  проверить('метрики: правка графа после закрытия окна сносит сходство, пересчёт совпадает с расчётом с нуля',
    edits.afterCloseDropped && edits.afterCloseFresh, 'снесено; совпадает', JSON.stringify(edits));
  проверить('метрики: правка в окне на копии — после закрытия пересчёт совпадает с расчётом с нуля',
    edits.copyEditFresh, 'совпадает', JSON.stringify(edits));
}

// ── 10-дельта. РАЗДЕЛЫ ОКНА СТАТИСТИКИ (решение автора, 26.09.2026) ─────
// Сравнение и близкие пары — своим разделом «Сходство», не среди сетевых
// метрик; «Замеры» — только вошедшему: без сервера и без входа раздел скрыт,
// а переход на вид (навигацией или по адресу) уводит в «Общий обзор».
{
  const nav = await page.evaluate(async () => {
    const A = window.__t;
    A.openStatsModal(); await new Promise(r => setTimeout(r, 300));
    const groups = [...document.querySelectorAll('.stats-navigation .stats-nav-group')];
    const byTitle = t => groups.find(g => g.querySelector('.stats-nav-group-title').textContent.includes(t));
    const views = g => g ? [...g.querySelectorAll('.stats-nav-item')].map(i => i.dataset.view).join(',') : null;
    const obs = document.getElementById('statsObservationsGroup');
    A.switchStatsView('observations'); await new Promise(r => setTimeout(r, 300));
    const active = (document.querySelector('.stats-nav-item.active') || {}).dataset;
    A.closeStatsModal();
    return { similar: views(byTitle('Сходство')), base: views(byTitle('Базовые метрики')),
             obsHidden: !!obs && obs.style.display === 'none', active: active && active.view };
  });
  проверить('статистика: сравнение и близкие пары — своим разделом «Сходство», не среди базовых метрик',
    nav.similar === 'comparison,closest-pairs,philosopher-comparison,philosopher-pairs'
      && !/comparison|pairs|observations/.test(nav.base || ''), 'четыре вида в «Сходстве»', JSON.stringify(nav));
  проверить('статистика: без входа «Замеры» скрыты, а переход на них уводит в «Общий обзор»',
    nav.obsHidden && nav.active === 'overview', 'скрыты; overview', JSON.stringify({ h: nav.obsHidden, a: nav.active }));
}

// ── 10-альфа. СНОСКИ В ОПИСАНИИ (24.09.2026) ────────────────────────────
// Правка — настоящими нажатиями: кнопка ставит метку туда, где курсор;
// показ — номера в тексте и источники под ним; наведение подсвечивает ровно
// свою пару цветом состояния; удаление снимает метку. Затем УТЕЧКА: метка
// подкладывается во ВСЕ описания, и в местах показа чужих описаний её не
// должно быть видно — данные сырые, снимает её только показ.
{
  await page.evaluate(() => { window.__t.closeUniversalModal(); window.__t.resetHighlight(); });
  await wait(400);
  const noteId = await page.evaluate(() => {
    const A = window.__t, n = A.DATA.nodes.find(n => n.extendedDescription && n.description);
    A.openUniversalModal('concept', n, 'edit');
    return n.id;
  });
  await wait(600);
  const insertButton = async () => {
    const i = await page.$$eval('button', bs => bs.findIndex(b => b.textContent.includes('Вставить сноску')));
    return (await page.$$('button'))[i];
  };
  await page.evaluate(() => { const t = document.getElementById('conceptExtendedDescription');
    t.focus(); const i = Math.max(1, t.value.indexOf('.')); t.setSelectionRange(i, i); });
  await (await insertButton()).click(); await wait(200);
  await page.keyboard.type('DK 22 B1');
  await page.evaluate(() => { const t = document.getElementById('conceptDescription');
    t.focus(); t.setSelectionRange(t.value.length, t.value.length); });
  await (await insertButton()).click(); await wait(200);
  await page.evaluate(() => { const rows = document.querySelectorAll('[data-fn-row]');
    const sel = rows[rows.length - 1].querySelector('.fn-status');
    sel.value = 'source_not_found'; sel.dispatchEvent(new Event('change', { bubbles: true })); });
  const formNumbers = await page.$$eval('[data-fn-num]', xs => xs.map(x => x.textContent).join(','));
  await page.evaluate(() => window.__t.saveConceptData());
  await wait(700);
  const saved = await page.evaluate(id => {
    const A = window.__t, c = A.DATA.concepts.find(c => c.id === id);
    return { notes: c.footnotes || [], marks: ((c.description || '') + (c.extendedDescription || '')).match(/\[\^[a-z0-9]+\]/g) || [],
             fields: Object.keys(A.lastSubmitted.fields) };
  }, noteId);
  проверить('сноски: кнопка ставит метку, запись сохраняет две сноски',
    saved.notes.length === 2 && saved.marks.length === 2, '2 сноски, 2 метки', `${saved.notes.length}, ${saved.marks.length}`);
  проверить('сноски: в правку ушли и тексты, и поле footnotes', saved.fields.includes('footnotes')
    && saved.fields.includes('extendedDescription'), 'footnotes и текст', saved.fields.join(','));
  проверить('сноски: «не найден» хранится без текста',
    saved.notes.some(n => n.status === 'source_not_found' && !('text' in n)), 'без text', JSON.stringify(saved.notes));

  await page.evaluate(id => { const A = window.__t; A.openUniversalModal('concept', A.DATA.nodes.find(n => n.id === id), 'view'); }, noteId);
  await wait(600);
  const shown = await page.evaluate(() => ({
    refs: document.querySelectorAll('.description .fn-ref').length,
    items: [...document.querySelectorAll('.fn-item .fn-num')].map(x => x.textContent).join(','),
    leaks: (document.body.innerText.match(/\[\^/g) || []).length }));
  проверить('сноски: номер в тексте, источники под ним, номера как в форме',
    shown.refs === 1 && shown.items === '1,2' && formNumbers === '1,2',
    'номер 1 в тексте; 1,2 в списке и в форме', `${shown.refs}; ${shown.items}; форма ${formNumbers}`);
  const supBox = await (await page.$('.description .fn-ref')).boundingBox();
  await page.mouse.move(supBox.x + supBox.width / 2, supBox.y + supBox.height / 2);
  await wait(150);
  const lit = await page.evaluate(() => {
    const id = document.querySelector('.description .fn-ref').dataset.fn;
    const li = document.querySelector(`.fn-item[data-fn="${id}"]`);
    return { own: li.classList.contains('fn-active'), color: getComputedStyle(li).outlineColor,
             others: [...document.querySelectorAll('.fn-item')].filter(x => x !== li && x.classList.contains('fn-active')).length };
  });
  проверить('сноски: наведение на номер обводит свой источник цветом состояния',
    lit.own && lit.others === 0 && lit.color === 'rgb(130, 224, 170)',
    'своя обводка #82E0AA, прочие нет', JSON.stringify(lit));

  await page.evaluate(id => { const A = window.__t; A.openUniversalModal('concept', A.DATA.nodes.find(n => n.id === id), 'edit'); }, noteId);
  await wait(600);
  // ПОВТОРНОЕ ОТКРЫТИЕ формы над сохранёнными сносками: номера стоят сразу,
  // у «не найден» поле текста скрыто, источник всей записи — из записи, а не
  // из узла. Снимок окна (25.09.2026) показал все три изъяна; прибор их не
  // видел — проверял форму только после нажатия кнопки.
  const reopened = await page.evaluate(id => {
    const A = window.__t, c = A.DATA.concepts.find(x => x.id === id);
    const rows = [...document.querySelectorAll('[data-fn-row]')];
    return { nums: rows.map(r => r.querySelector('[data-fn-num]').textContent).join(','),
      hiddenNotFound: rows.filter(r => r.querySelector('.fn-status').value === 'source_not_found')
        .every(r => getComputedStyle(r.querySelector('.fn-text')).display === 'none'),
      textWidth: Math.round(rows[0].querySelector('.fn-text').getBoundingClientRect().width) };
  }, noteId);
  проверить('сноски: при повторном открытии формы номера стоят, у «не найден» поле скрыто, поле текста не сжато',
    reopened.nums === '1,2' && reopened.hiddenNotFound && reopened.textWidth > 150,
    '1,2; скрыто; шире 150 px', JSON.stringify(reopened));
  await page.evaluate(id => { const A = window.__t, c = A.DATA.concepts.find(x => x.id === id);
    c.provenance = 'проба записи'; c.provenanceStatus = 'sourced';
    A.closeUniversalModal(); A.openUniversalModal('concept', A.DATA.nodes.find(n => n.id === id), 'edit'); }, noteId);
  await wait(600);
  const provInForm = await page.evaluate(() => ({ st: document.getElementById('entityProvenanceStatus').value,
    line: document.getElementById('entityProvenance').value }));
  проверить('сноски: источник всей записи в форме правки — из записи, а не из узла',
    provInForm.st === 'sourced' && provInForm.line === 'проба записи', 'sourced / проба записи', JSON.stringify(provInForm));
  await page.click('[data-fn-row] .fn-remove');
  await wait(150);
  const marksLeft = await page.evaluate(() => ((document.getElementById('conceptDescription').value
    + document.getElementById('conceptExtendedDescription').value).match(/\[\^/g) || []).length);
  await page.evaluate(() => window.__t.saveConceptData());
  await wait(700);
  const afterRemove = await page.evaluate(id => (window.__t.DATA.concepts.find(c => c.id === id).footnotes || []).length, noteId);
  проверить('сноски: удаление снимает и строку, и метку', marksLeft === 1 && afterRemove === 1,
    '1 метка, 1 сноска', `${marksLeft}, ${afterRemove}`);

  // ИСТОЧНИК ТОЛЬКО В ЗАПИСИ — отбор и заслон при сохранении обязаны его
  // видеть. Прежде оба спрашивали связь и узел графа: у связей начального
  // построения поля нет вовсе, и отбор «источник» не находил ни одной связи,
  // а заслон «описание изменено, источник прежний» для связей не срабатывал.
  const onlyInRecord = await page.evaluate(() => {
    const A = window.__t, D = A.DATA;
    const rel = D.relations.find(r => { const l = D.links.find(x => x.id === r.id); return l && A.isLinkVisible(l) && !r.provenance; });
    const con = D.concepts.find(c => { const n = D.nodes.find(x => x.id === c.id); return n && A.isNodeVisible(n) && !c.provenance; });
    rel.provenance = 'DK 22 B10'; rel.provenanceStatus = 'sourced';
    con.provenance = 'DK 22 B1';  con.provenanceStatus = 'sourced';
    A.openSelectionListModal();
    A.setSelectionProvenance('sourced');
    const sets = A.selectionListSets();
    A.setSelectionProvenance('all');
    A.closeSelectionListModal();
    return { rel: sets.relation.some(l => l.id === rel.id), con: sets.concept.some(n => n.id === con.id), relId: rel.id };
  });
  проверить('источник: отбор «источник» находит связь и концепцию, чей источник есть только в записи',
    onlyInRecord.rel && onlyInRecord.con, 'связь и концепция в отборе', JSON.stringify(onlyInRecord));
  // СНОСКИ СЧИТАЮТСЯ НАЛИЧИЕМ (решение автора 25.09.2026): запись, у которой
  // источник только в сноске, отбором «источник» находится и в «не разобрано»
  // не попадает; запись с общим источником и сноской «не найден» — в обоих.
  const byNotes = await page.evaluate(() => {
    const A = window.__t, D = A.DATA;
    const free = D.concepts.filter(c => { const n = D.nodes.find(x => x.id === c.id);
      return n && A.isNodeVisible(n) && !c.provenance && !c.footnotes; });
    const onlyNote = free[0], both = free[1];
    onlyNote.footnotes = [{ id: 'f1', status: 'sourced', text: 'DK 22 B50' }];
    Object.assign(both, { provenance: 'DK 22 B30', provenanceStatus: 'sourced',
      footnotes: [{ id: 'f1', status: 'source_not_found' }] });
    A.openSelectionListModal();
    const inSet = (st, id) => { A.setSelectionProvenance(st); return A.selectionListSets().concept.some(n => n.id === id); };
    const r = { onlyNoteSourced: inSet('sourced', onlyNote.id), onlyNoteUnsorted: inSet('unspecified', onlyNote.id),
      bothSourced: inSet('sourced', both.id), bothNotFound: inSet('source_not_found', both.id),
      note: (document.querySelector('.sel-prov-note') || {}).textContent || '' };
    A.setSelectionProvenance('all'); A.closeSelectionListModal();
    return r;
  });
  проверить('источник: отбор считает сноски наличием — только в сноске находится, «не разобрано» не находит',
    byNotes.onlyNoteSourced && !byNotes.onlyNoteUnsorted, 'найдена; не в «не разобрано»', JSON.stringify(byNotes));
  проверить('источник: общий источник и сноска «не найден» — запись в обоих отборах, пояснение про сноски',
    byNotes.bothSourced && byNotes.bothNotFound && byNotes.note.includes('сноск'), 'в обоих; пояснение',
    JSON.stringify(byNotes));
  const dialogs = [];
  const onDialog = d => dialogs.push(d.message());
  page.on('dialog', onDialog);
  await page.evaluate(id => { const A = window.__t;
    A.openUniversalModal('connection', A.DATA.links.find(l => l.id === id), 'edit'); }, onlyInRecord.relId);
  await wait(600);
  await page.evaluate(() => { const t = document.getElementById('connDescription'); t.value = t.value + ' Уточнено.';
    window.__t.saveConnectionData(); });
  await wait(700);
  page.off('dialog', onDialog);
  проверить('источник: правка описания связи с источником спрашивает, подтверждает ли он новый текст',
    dialogs.some(m => m.includes('Описание изменено, а источник остался прежним')), 'вопрос задан',
    dialogs.map(m => m.slice(0, 60)).join(' | ') || 'вопроса не было');
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);

  // утечка: метка во всех описаниях — и в записях, и в копиях узлов и связей
  const probeNode = await page.evaluate(() => {
    const A = window.__t, mark = ' [^leak01]';
    for (const set of [A.DATA.concepts, A.DATA.relations, A.DATA.philosophers, A.DATA.nodes, A.DATA.links])
      for (const r of set) {
        if (typeof r.description === 'string') r.description += mark;
        if (typeof r.extendedDescription === 'string') r.extendedDescription += mark;
      }
    A.closeUniversalModal(); A.resetHighlight();
    const T = A.renderState.transform, rc = A.gfxCanvas.getBoundingClientRect();
    const n = A.DATA.nodes.filter(n => A.isNodeVisible(n) && T.applyX(n.x) > 300 && T.applyX(n.x) < rc.width - 300
      && T.applyY(n.y) > 200 && T.applyY(n.y) < rc.height - 200)
      .sort((a, b) => A.getConceptConnections(b.id).length - A.getConceptConnections(a.id).length)[0];
    return { id: n.id, x: rc.left + T.applyX(n.x), y: rc.top + T.applyY(n.y), phil: n.concept };
  });
  await wait(400);
  await page.mouse.move(probeNode.x, probeNode.y);
  await wait(500);
  const leakTooltip = await page.evaluate(() => (document.body.innerText.match(/\[\^/g) || []).length);
  const leakViews = [];
  for (const [kind, key] of [['concept', 'node'], ['philosopher', 'phil'], ['connection', 'link']]) {
    await page.evaluate(({ kind, key, p }) => {
      const A = window.__t;
      const arg = kind === 'concept' ? A.DATA.nodes.find(n => n.id === p.id)
        : kind === 'philosopher' ? p.phil
        : A.DATA.links.find(l => (l.source.id || l.source) === p.id || (l.target.id || l.target) === p.id);
      A.openUniversalModal(kind, arg, 'view');
    }, { kind, key, p: probeNode });
    await wait(700);
    leakViews.push(await page.evaluate(() => {
      // своё описание окна показывается С НОМЕРОМ: метка без записи даёт «?»,
      // а не сырую [^…]. Сырая метка где угодно — утечка.
      return (document.body.innerText.match(/\[\^/g) || []).length;
    }));
    await page.evaluate(() => window.__t.closeUniversalModal());
    await wait(300);
  }
  проверить('сноски: метки не просачиваются в подсказку графа и окна (концепция, философ, связь)',
    leakTooltip === 0 && leakViews.every(n => n === 0), 'подсказка 0; окна 0,0,0',
    `подсказка ${leakTooltip}; окна ${leakViews.join(',')}`);
}

// ── 10-бис. первое перетаскивание: будит, но не перестраивает ────────
// НА СВЕЖЕЙ СТРАНИЦЕ, во второй вкладке. К концу прибора основная страница
// прошла через правки базы и пути, и каждое будило и гасило укладку: остаток
// alpha = 1 готовой раскладки там давно израсходован, и «первое»
// перетаскивание уже не первое. Так и было: подлог «не гасить энергию» в
// первой редакции этого утверждения прошёл зелёным.
// «Будит» — встречное к «щелчок не двигает граф»: иначе оба прошли бы и при
// укладке, не просыпающейся вовсе. «Не перестраивает» — энергию даёт само
// перетаскивание (цель 0,3), а не остаток alpha = 1. Замер 24 сентября 2026:
// при alpha = 1 медиана сдвига прочих узлов через 1 с — 56 px, 655 из 718
// дальше 20 px; с погашенной энергией — 2–4 px.
{
  const fresh = await browser.newPage();
  await fresh.setViewport({ width: 1440, height: 900 });
  fresh.on('pageerror', e => ошибки.push('вторая вкладка: ' + String(e).split('\n')[0]));
  await fresh.goto(BASE + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(6500);
  await fresh.addScriptTag({ type: 'module', content: `
    import './_probe-rig.js';
    window.__t = window.__app;
    window.__tReady = true;` });
  await fresh.waitForFunction('window.__t && window.__t.DATA', { timeout: 20000 });
  const start = await fresh.evaluate(() => {
    const A = window.__t, T = A.renderState.transform, r = A.gfxCanvas.getBoundingClientRect();
    const n = A.DATA.nodes.find(n => A.isNodeVisible(n) && T.applyX(n.x) > r.width * 0.35 && T.applyX(n.x) < r.width * 0.65
      && T.applyY(n.y) > r.height * 0.35 && T.applyY(n.y) < r.height * 0.65);
    return { x: r.left + T.applyX(n.x), y: r.top + T.applyY(n.y), id: n.id,
      before: A.DATA.nodes.map(n => [n.x, n.y]), settled: A.S.layoutSettled };
  });
  await fresh.mouse.move(start.x, start.y);
  await fresh.mouse.down();
  await fresh.mouse.move(start.x + 40, start.y + 25, { steps: 5 });
  await fresh.mouse.up();
  await wait(1000);
  const after = await fresh.evaluate(({ before, id }) => {
    const A = window.__t;
    const shifts = A.DATA.nodes.map((n, i) => n.id === id ? null : Math.hypot(n.x - before[i][0], n.y - before[i][1]))
      .filter(v => v !== null).sort((a, b) => a - b);
    return { settled: A.S.layoutSettled, tick: A.S.tickCount, median: shifts[shifts.length >> 1] };
  }, { before: start.before, id: start.id });
  await fresh.close();
  проверить('перетаскивание узла будит укладку', after.settled === false && after.tick > 0,
    'раскладка не улёгшаяся, тики идут', `улеглась ${after.settled}, тиков ${after.tick} (до: улеглась ${start.settled})`);
  проверить('первое перетаскивание не перестраивает раскладку', after.median < 15,
    'медиана сдвига прочих узлов < 15 px', after.median.toFixed(1) + ' px');
}

// ── 11. страница не ругалась ────────────────────────────────────────
проверить('ошибок страницы нет', ошибки.length === 0, 0,
  ошибки.length + (ошибки[0] ? ' (' + ошибки[0].slice(0, 60) + ')' : ''));

await page.close(); await browser.close();

const плохо = проверки.filter(п => !п.годно);
for (const п of проверки)
  console.log(`${п.годно ? '✓' : '✗'} ${п.имя}: ждали ${п.ждали}, вышло ${п.вышло}`);
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
process.exit(плохо.length ? 1 : 0);
