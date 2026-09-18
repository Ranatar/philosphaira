#!/usr/bin/env node
// ССЫЛКИ — ПРОВЕРКА КРУГОМ.
//
//   node tools/probes/link_probe.mjs [index.html]
//
// Устроен не как обход: тот жмёт всё подряд и сличает с эталоном, а этот
// замыкает круг. Порядок один и тот же для каждого состояния:
//   1. привести страницу в состояние действиями;
//   2. снять отпечаток состояния и прочитать получившийся адрес;
//   3. открыть ЧИСТУЮ вкладку по этому адресу;
//   4. сличить отпечаток восстановленного с отпечатком исходного.
// Эталона у прибора нет и быть не должно: он сверяет страницу с нею же,
// поэтому переживает любую правку разметки и не требует переутверждения.
//
// Отпечаток — не весь DOM, а ровно то, что ссылка обещает восстановить:
// содержимое окна сущности, панель пути и её итог, вид статистики с
// переключателями, панель карты сходства и наборы фильтров. Иначе в
// сличение попадали бы подсказки, порядок узлов и прочее, к ссылке
// отношения не имеющее.
//
// Отдельно утверждается ОБЕЩАНИЕ «намерение, а не расчёт»: ссылка на карту
// «по месту в сети» в чистой вкладке НЕ запускает двадцатисекундный счёт,
// а говорит, что нажать.
import { createRequire } from 'node:module';
import { БРАУЗЕР as CHROME, PUPPETEER, СЕРВЕР as BASE } from '../paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);

const СТРАНИЦА = process.argv[2] || 'index.html';
const wait = мс => new Promise(r => setTimeout(r, мс));
const проверки = [];
const проверить = (имя, годно, ждали, вышло) => проверки.push({ имя, годно: !!годно, ждали, вышло });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

// Отпечаток обещанного ссылкой состояния.
const ОТПЕЧАТОК = () => {
  const A = window.__app;
  const текст = sel => { const e = document.querySelector(sel); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; };
  const виден = sel => { const e = document.querySelector(sel); return !!e && !!e.getClientRects().length; };
  const набор = s => [...s].sort().join(',');
  return {
    окно: viewОкна(),
    путь: (A.selectedSourceNode || '-') + '..' + (A.selectedTargetNode || '-') + '|' + текст('#pathResult').slice(0, 300),
    статистика: (A.S.currentStatsView || '-') + '|' + [
      (document.getElementById('statsUseWeightsToggle') || {}).checked,
      (document.getElementById('statsRespectDirectionToggle') || {}).checked,
      (document.getElementById('statsScopeToggle') || {}).checked].join(''),
    сравнение: (A.S._cmpA || '-') + '..' + (A.S._cmpB || '-'),
    пары: A.S._pairsKind || '-',
    карта: A.S.similarityOverlay
      ? A.S.similarityOverlay.sourceId + ':' + A.S.similarityOverlay.kind + ':' + (A.S.similarityOverlay.linkMode || 'none')
      : '-',
    философы: набор(A.S.selectedPhilosophers),
    типы: набор(A.S.selectedRelations),
    рубрики: набор(A.S.selectedRubrics),
    режим: A.S.filterMode,
    видноОкно: виден('#universalModal.show'),
  };
  function viewОкна() {
    const m = document.getElementById('universalModal');
    if (!m || !m.classList.contains('show')) return '-';
    const c = document.getElementById('universalModalContent');
    return (m.className || '') + '|' + ((c && c.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 400);
  }
};

async function вкладка(hash) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const ошибки = [];
  page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
  page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });
  await page.goto(BASE + СТРАНИЦА + (hash || ''), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(6500);
  await page.addScriptTag({ type: 'module', content: `import './_probe-rig.js';` });
  await page.waitForFunction('window.__appReady === true', { timeout: 30000 });
  await wait(2500);   // запуск состояния из адреса отложен на 1,2 с после load
  return { page, ошибки };
}

// Один круг: действия → адрес → чистая вкладка по адресу → сличение.
async function круг(имя, действия, { ждатьПосле = 1500, послеВосстановления } = {}) {
  const { page, ошибки } = await вкладка('');
  let адрес = null, было = null;
  try {
    await действия(page);
    await wait(ждатьПосле);
    было = await page.evaluate(ОТПЕЧАТОК);
    адрес = await page.evaluate(() => location.hash);
    проверить(`${имя}: адрес не пуст`, !!адрес && адрес.length > 1, 'непустой хеш', адрес);
  } catch (e) {
    проверить(`${имя}: действия отработали`, false, 'без исключений', String(e).slice(0, 160));
  }
  проверить(`${имя}: ошибок на первой вкладке нет`, ошибки.length === 0, 0, ошибки.slice(0, 2).join(' | '));
  await page.close();
  if (!адрес || !было) return;

  const второй = await вкладка(адрес);
  let стало = null;
  try {
    стало = await второй.page.evaluate(ОТПЕЧАТОК);
    if (послеВосстановления) await послеВосстановления(второй.page, стало);
  } catch (e) {
    проверить(`${имя}: восстановление отработало`, false, 'без исключений', String(e).slice(0, 160));
  }
  проверить(`${имя}: ошибок при восстановлении нет`, второй.ошибки.length === 0, 0, второй.ошибки.slice(0, 2).join(' | '));
  if (стало) {
    const разошлись = Object.keys(было).filter(k => JSON.stringify(было[k]) !== JSON.stringify(стало[k]));
    проверить(`${имя}: состояние восстановлено кругом`, разошлись.length === 0, 'совпало целиком',
      разошлись.length ? разошлись.map(k => `${k}: «${String(стало[k]).slice(0, 70)}» вместо «${String(было[k]).slice(0, 70)}»`).join(' ; ') : 'совпало');
    const адрес2 = await второй.page.evaluate(() => location.hash);
    проверить(`${имя}: адрес после восстановления тот же`, адрес2 === адрес, адрес, адрес2);
  }
  await второй.page.close();
}

const СВЯЗНЫЕ = () => window.__app.DATA.concepts.filter(c => window.__app.profileIsMeaningful(c.id)).map(c => c.id);

// 1. окно концепции
await круг('окно концепции', async page => {
  const ids = await page.evaluate(`(${СВЯЗНЫЕ})()`);
  await page.evaluate(id => window.__app.openConceptById(id), ids[0]);
});

// 2. окно философа, открытое ТАК ЖЕ, КАК ЕГО ОТКРЫВАЕТ ПРИЛОЖЕНИЕ:
// именем-строкой из карточки узла. Первая редакция слоя ждала объект, и у
// окна философа адрес не писался вовсе (нашёл пользователь, 18 сентября).
await круг('окно философа', async page => {
  await page.evaluate(() => {
    const A = window.__app;
    A.openUniversalModal('philosopher', A.DATA.nodes[0].concept, 'view');
  });
});

// 3. окно связи
await круг('окно связи', async page => {
  await page.evaluate(() => {
    const A = window.__app;
    const св = A.DATA.relations.find(r => r.id);
    A.openUniversalModal('connection', св, 'view');
  });
});

// 4. путь с параметрами
await круг('путь', async page => {
  await page.evaluate(() => {
    const A = window.__app;
    const ids = A.DATA.concepts.map(c => c.id);
    A.selectCustomOption('source', ids[0]);
    A.selectCustomOption('target', ids[40]);
    const c = document.getElementById('respectChronology');
    if (c) c.checked = false;
    A.findAndShowPath();
  });
}, { ждатьПосле: 2500 });

// 4-бис. СНЯТЫЙ путь: концы остаются выбранными, панель пуста — и адрес
// обязан это видеть. Прежде ссылка на путь оставалась после сброса
// подсветки (нашёл пользователь, 18 сентября).
{
  const { page, ошибки } = await вкладка('');
  await page.evaluate(() => {
    const A = window.__app;
    const ids = A.DATA.concepts.map(c => c.id);
    A.selectCustomOption('source', ids[0]);
    A.selectCustomOption('target', ids[40]);
    A.findAndShowPath();
  });
  await wait(2500);
  const сПутём = await page.evaluate(() => location.hash);
  // жмём ту же кнопку, что и человек, а не зовём обработчик по имени
  const нажалось = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#pathFinder button, .path-btn')]
      .find(x => /Сбросить|Очистить/i.test(x.textContent));
    if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); return true; }
    return false;
  });
  проверить('снятый путь: кнопка сброса нашлась', нажалось, true, нажалось);
  await wait(800);
  const после = await page.evaluate(() => location.hash);
  проверить('снятый путь: сперва адрес с путём', /path=/.test(сПутём), 'path=…', сПутём);
  проверить('снятый путь: после сброса подсветки путь из адреса ушёл',
    !/path=/.test(после), 'без path=', после || '(пусто)');
  проверить('снятый путь: ошибок страницы нет', ошибки.length === 0, 0, ошибки.slice(0, 2).join(' | '));
  await page.close();
}

// 5. фильтры: снятые философы, типы, рубрики
await круг('фильтры', async page => {
  await page.evaluate(() => {
    const A = window.__app;
    const имена = Object.keys(A.DATA.philosopherConcepts).slice(0, 3);
    for (const имя of имена) A.togglePhilosopher(имя);
    A.S.selectedRelations.delete('influence');
    A.S.selectedRubrics.delete([...A.S.selectedRubrics][0]);
    A.applyFiltersImmediate();
  });
}, { ждатьПосле: 2500 });

// 6. вид статистики с переключателями
await круг('статистика', async page => {
  await page.evaluate(() => {
    const A = window.__app;
    A.openStatsModal();
  });
  await wait(900);
  await page.evaluate(() => {
    const A = window.__app;
    const w = document.getElementById('statsUseWeightsToggle');
    w.checked = false; A.handleStatsParameterChange();
    A.switchStatsView('degree');
  });
}, { ждатьПосле: 2500 });

// 7. пара в сравнении концепций
await круг('сравнение концепций', async page => {
  const ids = await page.evaluate(`(${СВЯЗНЫЕ})()`);
  // окно статистики само щёлкает по «Обзору» через 100 мс, если вида ещё не
  // было: переключаем вид после этого, как сделал бы человек
  await page.evaluate(() => window.__app.openStatsModal());
  await wait(900);
  await page.evaluate(([a, b]) => {
    const A = window.__app;
    A.S._cmpA = a; A.S._cmpB = b;
    A.switchStatsView('comparison');
  }, ids);
}, { ждатьПосле: 2500 });

// 8. карта сходства по типам связей плюс показ связей
await круг('карта сходства', async page => {
  const ids = await page.evaluate(`(${СВЯЗНЫЕ})()`);
  await page.evaluate(id => {
    const A = window.__app;
    A.showSimilarityOverlay(id, 'types');
    A.setSimilarityLinks('all');
  }, ids[0]);
});

// 9. обещание «намерение, а не расчёт»
{
  const { page } = await вкладка('');
  const ids = await page.evaluate(`(${СВЯЗНЫЕ})()`);
  await page.evaluate(async id => { await window.__app.ensureNetworkProfile(); window.__app.showSimilarityOverlay(id, 'network'); }, ids[0]);
  await wait(1500);
  const адрес = await page.evaluate(() => location.hash);
  проверить('карта по сети: адрес записан', /sim=.*network/.test(адрес), 'sim=…:network', адрес);
  await page.close();
  const { page: чистая } = await вкладка(адрес);
  const о = await чистая.evaluate(() => ({
    карта: !!window.__app.S.similarityOverlay,
    сеть: !!window.__app.networkSimilarityData(),
    // извещение живёт секунды и к этому мигу могло исчезнуть, поэтому
    // спрашиваем саму страницу, чего она в ссылке не нашла
    пропало: (window.__app._linkMissed || []).join('; '),
  }));
  проверить('карта по сети: чистая вкладка не запускает долгий счёт', о.сеть === false && о.карта === false,
    'счёт не начат, карта не открыта', JSON.stringify(о).slice(0, 120));
  проверить('карта по сети: сказано, что нажать', /месту в сети/.test(о.пропало), 'запись о том, что нажать', о.пропало.slice(0, 140));
  await чистая.close();
}

await browser.close();
let плохо = 0;
for (const п of проверки) {
  if (!п.годно) плохо++;
  console.log(`${п.годно ? '  ' : '✗ '}${п.имя}: ждали ${п.ждали}, вышло ${п.вышло}`);
}
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо}`);
process.exit(плохо ? 1 : 0);
