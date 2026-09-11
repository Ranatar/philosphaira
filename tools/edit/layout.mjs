#!/usr/bin/env node
// РАСКЛАДКА, ПОСЧИТАННАЯ ЗАРАНЕЕ — девятый шаг цепочки сборки.
//
// Считает силовую укладку медленным отжигом и вписывает координаты в
// ИСХОДНИК, литералом nodePositions. Дальше их разносит обычная сборка:
// nodePositions — седьмое имя в RAW_DATA, значит split сам положит
// app/data/nodePositions.json и добавит его в загрузчик.
//
// ПОЧЕМУ В CHROME, А НЕ ПРОСТО В NODE. Замерено: тот же d3 7.8.5 в Chrome и
// в node даёт РАЗНЫЕ раскладки на одних данных, одних параметрах и одном
// числе тиков — медиана расхождения 65 px, максимум 266. Расходятся движки в
// последних битах, Барнс–Хат усиливает. Раз страница живёт в браузере, там же
// и считаем: иначе координаты в наборе будут от одного мира, а проверка
// приборами — от другого.
//
// ПОЧЕМУ ОТПЕЧАТОК СПРАШИВАЕТСЯ У СТРАНИЦЫ. graphFingerprint объявлена в
// исходнике и живёт в одном месте. Пересчитать её здесь по своему образцу
// значило бы записать правило дважды — а это в проекте уже четырежды
// оборачивалось прибором, показывающим полное согласие при поломке.
//
// ПОЧЕМУ МЕДЛЕННЫЙ ОТЖИГ. Замер по десяти случайным началам: при alphaDecay
// 0.02 и 342 тиках узлов дальше 150 px от соседа 9,8 ± 4,0; при 0.005 и 3000
// тиках — 9,2 ± 2,2, и разброс вдвое уже. В кадре это четыре минуты и потому
// немыслимо, здесь — шесть секунд один раз.
//
//   node tools/edit/layout.mjs            посчитать и вписать в исходник
//   node tools/edit/layout.mjs --показать только посчитать и показать меры
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { PUPPETEER, БРАУЗЕР, СЕРВЕР, ИСХОДНИК } from '../paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);

const ТОЛЬКО_ПОКАЗАТЬ = process.argv.includes('--показать');
const ТИКОВ = +(process.env.PG_LAYOUT_TICKS || 3000);
const РАСПАД = +(process.env.PG_LAYOUT_DECAY || 0.005);
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: БРАУЗЕР, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });

await page.goto(СЕРВЕР + 'index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
await wait(6500);
await page.addScriptTag({ type: 'module', content:
  `import './_probe-rig.js'; window.__t = window.__app; window.__tReady = true;` });
await page.waitForFunction('window.__tReady === true', { timeout: 30000 });

const итог = await page.evaluate(({ ТИКОВ, РАСПАД }) => {
  const D = window.__t.DATA, S = window.__t.S, d3 = window.d3;

  // Силы берутся у ЖИВОЙ симуляции — те самые, по которым страница и будет
  // жить дальше. Переписать их числами значило бы считать раскладку не для
  // этой страницы, а для своего представления о ней.
  const s0 = S.simulation;
  const расстояние = s0.force('link').distance();
  const заряд = s0.force('charge').strength();
  const столкновение = s0.force('collision').radius();
  const тяга = s0.force('pullX') ? s0.force('pullX').strength() : null;

  const nodes = D.concepts.map(c => ({ id: c.id }));
  const links = D.relations.map(r => ({ source: r.source, target: r.target }));
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(расстояние))
    .force('charge', d3.forceManyBody().strength(заряд))
    .force('center', d3.forceCenter(720, 450))
    .force('collision', d3.forceCollide().radius(столкновение))
    .alphaDecay(РАСПАД).stop();
  if (тяга) {
    sim.force('pullX', d3.forceX(720).strength(тяга));
    sim.force('pullY', d3.forceY(450).strength(тяга));
  }
  sim.tick(ТИКОВ);

  // Округление до десятой доли: точность ниже пикселя ничего не значит, а
  // в исходнике и в наборе шестнадцать знаков после запятой — просто шум.
  const позиции = {};
  for (const n of nodes) позиции[n.id] = [+n.x.toFixed(1), +n.y.toFixed(1)];

  // меры — чтобы было видно, что посчиталось, а не только что посчиталось
  const X = nodes.map(n => [n.x, n.y]);
  const бл = [];
  for (let i = 0; i < X.length; i++) {
    let л = Infinity;
    for (let j = 0; j < X.length; j++) {
      if (i === j) continue;
      const d2 = (X[i][0] - X[j][0]) ** 2 + (X[i][1] - X[j][1]) ** 2;
      if (d2 < л) л = d2;
    }
    бл.push(Math.sqrt(л));
  }
  бл.sort((a, b) => a - b);
  const xs = X.map(p => p[0]), ys = X.map(p => p[1]);

  return {
    отпечаток: window.__t.graphFingerprint(),
    позиции,
    тягаЕсть: !!тяга,
    меры: {
      узлов: nodes.length,
      медиана: +бл[Math.floor(бл.length / 2)].toFixed(1),
      одиноких: бл.filter(d => d > 150).length,
      охват: Math.round(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))),
    },
  };
}, { ТИКОВ, РАСПАД });

await page.close(); await browser.close();

if (ошибки.length) {
  console.error('страница ругалась, раскладке верить нельзя:\n  ' + ошибки.slice(0, 3).join('\n  '));
  process.exit(1);
}
console.log(`отжиг ${ТИКОВ} тиков при распаде ${РАСПАД}, тяга ${итог.тягаЕсть ? 'есть' : 'НЕТ'}`);
console.log(`узлов ${итог.меры.узлов}, медиана до соседа ${итог.меры.медиана}, ` +
  `одиноких ${итог.меры.одиноких}, охват ${итог.меры.охват}`);
console.log('отпечаток базы ' + итог.отпечаток);

if (ТОЛЬКО_ПОКАЗАТЬ) process.exit(0);

// ── вписывание в исходник ──────────────────────────────────────────
// Литерал заменяется целиком, по маяку объявления. Разбор здесь не нужен:
// объявление одно, и его границы видны по строке-объявлению и по `};`
// в начале строки — набор пишется одной строкой, как ниже.
const исходник = fs.readFileSync(ИСХОДНИК, 'utf8');
const маяк = /^(\s*)const nodePositions = .*$/m;
if (!маяк.test(исходник)) {
  console.error('в исходнике нет объявления nodePositions — вписывать некуда');
  process.exit(2);
}
const набор = { fingerprint: итог.отпечаток, nodes: итог.позиции };
const новый = исходник.replace(маяк,
  (_, отступ) => отступ + 'const nodePositions = ' + JSON.stringify(набор) + ';');
fs.writeFileSync(ИСХОДНИК, новый);
console.log(`вписано в ${ИСХОДНИК}: ${JSON.stringify(набор).length} знаков`);
console.log('дальше: node tools/remap.mjs собрать');
