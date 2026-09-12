#!/usr/bin/env node
// СЛИЧЕНИЕ СТОРОН по всему, что правилось в этом заходе. Одни и те же
// вопросы задаются сборке (через оснастку) и одностраничной версии
// (через eval). Расхождение означает, что сборка не сохраняет поведение.
//   node tools/probes/sides_all.mjs index.html
//   node tools/probes/sides_all.mjs _ref-work.html
import { createRequire } from 'node:module';
import { PUPPETEER, БРАУЗЕР, СЕРВЕР } from '../paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);
const wait = ms => new Promise(r => setTimeout(r, ms));
const СТРАНИЦА = process.argv[2] || 'index.html';
const сборка = !СТРАНИЦА.startsWith('_ref');

const browser = await puppeteer.launch({
  executablePath: БРАУЗЕР, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });
await page.goto(СЕРВЕР + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
await wait(9000);

if (сборка) {
  await page.addScriptTag({ type: 'module', content: `
    import './_probe-rig.js';
    const A = window.__app;
    window.__в = имя => (A[имя] !== undefined ? A[имя]
      : A.MET[имя] !== undefined ? A.MET[имя]
      : A.VIEWS[имя] !== undefined ? A.VIEWS[имя]
      : A.S[имя] !== undefined ? A.S[имя]
      : A.DATA[имя]);
    window.__зап = (имя, з) => { A.S[имя] = з; };
    window.__готово = true;` });
} else {
  await page.addScriptTag({ content: `
    window.__в = имя => { try { return eval(имя); } catch (e) { return undefined; } };
    window.__зап = (имя, з) => { try { eval(имя + ' = з'); } catch (e) {} };
    window.__готово = true;` });
}
await page.waitForFunction('window.__готово === true', { timeout: 20000 });

const итог = await page.evaluate(async () => {
  const V = window.__в;
  V('initializePhilosophyMetrics')();
  const cons = V('concepts');
  const метка = id => { const c = cons.find(x => x.id === id); return c ? c.label : id; };
  const верх = (a, n, f) => a.slice(0, n).map(r => метка(r.node.id) + ' ' + f(r));
  const o = {};

  // ── метрики ──
  const pr = await V('calculatePageRank')();
  o.суммаPR = +pr.reduce((s, r) => s + r.value, 0).toFixed(6);
  o.pagerank = верх(pr, 5, r => r.value.toFixed(6));
  o.eigenvector = верх(await V('calculateEigenvectorCentrality')(), 5, r => r.value.toFixed(5));
  o.betweenness = верх(await V('calculateBetweennessAsync')(), 5, r => r.value.toFixed(2));
  o.closeness = верх(await V('calculateClosenessCentrality')(), 5, r => r.value.toFixed(5));
  const wc = V('calculateWeightedClustering')();
  o.взвКласт = верх(wc, 5, r => r.value.toFixed(4) + '/k=' + r.neighbors);
  o.взвКластМакс = +wc[0].value.toFixed(4);
  o.richClub = верх(V('calculateRichClubCoefficient')(), 5, r => r.value.toFixed(3));
  const T = V('nodes').map(n => ({ id: n.id, m: V('tensionIndex')(n.id) }));
  o.напряжениеНенулевых = T.filter(t => t.m.total > 0).length;
  o.напряжение = T.filter(t => t.m.total > 0).sort((a, b) => b.m.total - a.m.total)
    .slice(0, 5).map(t => метка(t.id) + ' ' + t.m.total.toFixed(1));
  const dl = V('nodes').map(n => ({ id: n.id, v: V('dialogicalIndex')(n.id).total }))
    .sort((a, b) => b.v - a.v);
  o.диалогичность = dl.slice(0, 5).map(r => метка(r.id) + ' ' + r.v.toFixed(1));

  // ── правки интерфейса ──
  const h = V('generatePhilosopherEditContent')('Гегель');
  const d = document.createElement('div'); d.innerHTML = h;
  const row = d.querySelector('.modal-edit-list-item');
  o.кнопкиУКонцепцииФилософа = [...row.querySelectorAll('button')]
    .map(x => (x.dataset.actClick || (x.getAttribute('onclick') || '').replace(/\(.*/, '')));

  V('openUniversalModal')('connection', V('links')[0], 'edit');
  await new Promise(r => setTimeout(r, 700));
  const ov = document.getElementById('modalOverlay');
  V('selectConceptOnGraph')('source', 'edit');
  await new Promise(r => setTimeout(r, 400));
  o.подложкаВоВремяВыбора = getComputedStyle(ov).backgroundColor;
  V('cancelGraphSelection')();
  await new Promise(r => setTimeout(r, 200));
  o.подложкаПосле = getComputedStyle(ov).backgroundColor;
  V('closeUniversalModal')();
  await new Promise(r => setTimeout(r, 600));

  // карты попаданий после отбора
  V('rebuildQuadtree')();
  const sel = V('selectedPhilosophers'); sel.clear(); sel.add('Гегель');
  V('applyFiltersImmediate')();
  await new Promise(r => setTimeout(r, 1400));
  const скрытый = V('nodes').find(n => !V('isNodeVisible')(n) && n.x !== undefined);
  o.видимыхПослеОтбора = V('visibleNodeIds').size;
  o.скрытыйУзелЛовитПопадание = !!V('pickNode')(скрытый.x, скрытый.y);
  return o;
});

console.log(JSON.stringify({ страница: СТРАНИЦА, ошибки, итог }, null, 1));
await browser.close();
