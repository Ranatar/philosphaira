#!/usr/bin/env node
// ХОД ДОЛГИХ РАСЧЁТОВ — отдельно от обхода и снимков.
//
//   node tools/probes/progress_probe.mjs [index.html]
//
// Почему отдельный прибор. Обход и compare снимают разметку в миг после
// действия; процент, меняющийся посреди расчёта, делал бы снимок зависимым
// от скорости машины. Поэтому всякий живой процент носит признак
// data-live-progress (снимки вычёркивают его текст), а кнопки, запускающие
// тяжёлый досчёт, — data-sweep-skip (обход их не жмёт). Проверяет всё это
// здесь, и устроено иначе, чем обход: не снимок «после», а ЗАПИСЬ ХОДА.
// В странице стоит часовой, который каждые 40 мс переписывает видимые
// проценты; после расчёта прибор спрашивает, как они шли.
//
// Что утверждается по каждому индикатору:
//   появился        — процент был виден хоть раз;
//   числа годны     — каждое показание — целое от 0 до 100;
//   не убывает      — ход монотонен (у каждого элемента отдельно);
//   двигался        — различных показаний не меньше двух (только там, где
//                     расчёт по замеру длится секунды, а не миллисекунды);
//   исчез           — по окончании видимых процентов не осталось;
//   дал результат   — на месте индикатора то, ради чего считали.
//
// Сценарии (каждый — в свежей вкладке, чтобы кеши не перетекали):
//   1. окно концепции, колонка «по месту в сети», кнопка «Посчитать»
//   2. сравнение концепций, плитка «место в сети», кнопка «Посчитать»
//   3. «Близкие пары»: матрица пар (оверлей) и вид «по месту в сети»
//   4. карта сходства, вид «по месту в сети» (плашка)
//   5. окно статистики: «Рассчитать» у посредничества и близости (полоса)
//   6. фильтр «Связанные сети» при четырёх философах (оверлей)
//   7. фильтр «Сквозные цепочки» при четырёх философах (оверлей)
//
// Чего прибор НЕ проверяет: верность самих процентов (что 50 % — это
// половина работы) и кнопку «Прервать» у оверлея цепочек.
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

// Часовой: пишет показания всех видимых [data-live-progress].
const ЧАСОВОЙ = () => {
  window.__prog = [];
  const ключ = new WeakMap();
  let n = 0;
  window.__progTimer = setInterval(() => {
    for (const e of document.querySelectorAll('[data-live-progress]')) {
      if (!e.getClientRects().length) continue;
      if (!ключ.has(e)) ключ.set(e, ++n);
      window.__prog.push({ эл: ключ.get(e), т: e.textContent.trim(), мс: performance.now() });
    }
  }, 40);
  window.__progVisible = () => [...document.querySelectorAll('[data-live-progress]')]
    .filter(e => e.getClientRects().length).length;
};

async function вкладка() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const ошибки = [];
  page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
  page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });
  await page.goto(BASE + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(6500);
  await page.addScriptTag({ type: 'module', content: `import './_probe-rig.js';` });
  await page.waitForFunction('window.__appReady === true', { timeout: 30000 });
  await wait(500);
  return { page, ошибки };
}

async function ждать(page, условие, потолок = 180000) {
  const t0 = Date.now();
  while (Date.now() - t0 < потолок) {
    if (await page.evaluate(условие)) return Date.now() - t0;
    await wait(250);
  }
  return null;
}

// Разбор записанного хода одного сценария.
async function разобрать(page, имя, { двигался = true, результат }) {
  const лог = await page.evaluate(() => { clearInterval(window.__progTimer); return window.__prog; });
  const поЭлементу = {};
  let негодных = 0;
  for (const з of лог) {
    const m = /^(\d+)\s?%$/.exec(з.т);
    if (!m || +m[1] > 100) { негодных++; continue; }
    (поЭлементу[з.эл] = поЭлементу[з.эл] || []).push(+m[1]);
  }
  const ряды = Object.values(поЭлементу);
  const убывает = ряды.some(р => р.some((v, i) => i && v < р[i - 1]));
  const различных = new Set(ряды.flat()).size;
  проверить(`${имя}: процент появился`, лог.length > 0, '> 0 показаний', лог.length);
  проверить(`${имя}: показания — целые от 0 до 100`, негодных === 0, 0, негодных);
  проверить(`${имя}: ход не убывает`, !убывает, 'монотонно', ряды.map(р => р.join('→').slice(0, 60)).join(' | '));
  if (двигался) проверить(`${имя}: ход двигался`, различных >= 2, '≥ 2 различных', различных);
  const видно = await page.evaluate(() => window.__progVisible());
  проверить(`${имя}: по окончании процентов не видно`, видно === 0, 0, видно);
  проверить(`${имя}: дал результат`, результат.годно, результат.ждали, результат.вышло);
}

async function сценарий(имя, тело) {
  const { page, ошибки } = await вкладка();
  try { await тело(page); }
  catch (e) { проверить(`${имя}: сценарий отработал`, false, 'без исключений', String(e).slice(0, 160)); }
  проверить(`${имя}: ошибок страницы нет`, ошибки.length === 0, 0, ошибки.slice(0, 2).join(' | '));
  await page.close();
}

const СВЯЗНАЯ = () => window.__app.DATA.concepts.filter(c => window.__app.profileIsMeaningful(c.id)).map(c => c.id);

// 1. окно концепции
await сценарий('окно концепции', async page => {
  await page.evaluate(`(${СВЯЗНАЯ})()`).then(ids => page.evaluate(id => window.__app.openConceptById(id), ids[0]));
  await wait(600);
  проверить('окно концепции: без нажатия сеть не считается',
    await page.evaluate(() => !window.__app.networkSimilarityData()), true, 'не посчитана');
  await page.evaluate(ЧАСОВОЙ);
  await page.evaluate(() => document.querySelector('#similarNetworkCol .similar-map-btn').click());
  const мс = await ждать(page, () => !!document.querySelector('#similarNetworkCol .similar-item'));
  await wait(300);
  const строк = await page.evaluate(() => document.querySelectorAll('#similarNetworkCol .similar-item').length);
  await разобрать(page, 'окно концепции', { результат: { годно: мс !== null && строк > 0, ждали: 'строки соседей', вышло: `${строк} за ${мс} мс` } });
});

// 2. сравнение концепций
await сценарий('сравнение', async page => {
  const ids = await page.evaluate(`(${СВЯЗНАЯ})()`);
  await page.evaluate(([a, b]) => {
    const A = window.__app;
    A.S._cmpA = a; A.S._cmpB = b;
    A.openStatsModal();
  }, ids);
  await wait(800);
  await page.evaluate(() => window.__app.switchStatsView('comparison'));
  await wait(1500);
  await page.evaluate(ЧАСОВОЙ);
  const есть = await page.evaluate(() => {
    const b = document.querySelector('#cmpBody .similar-map-btn');
    if (b) b.click();
    return !!b;
  });
  проверить('сравнение: у связной пары есть кнопка «Посчитать»', есть, true, есть);
  const мс = await ждать(page, () => !document.querySelector('#cmpBody .similar-map-btn')
    && !document.querySelector('#cmpBody [data-live-progress]')
    && /%/.test((document.querySelectorAll('#cmpBody .cmp-score-value')[3] || {}).textContent || ''));
  await wait(300);
  const плитка = await page.evaluate(() => (document.querySelectorAll('#cmpBody .cmp-score-value')[3] || {}).textContent);
  await разобрать(page, 'сравнение', { результат: { годно: мс !== null, ждали: 'процент сходства в плитке', вышло: `${плитка} за ${мс} мс` } });
});

// 3. близкие пары: матрица, затем сеть
await сценарий('близкие пары', async page => {
  await page.evaluate(() => window.__app.openStatsModal());
  await wait(800);
  await page.evaluate(ЧАСОВОЙ);
  await page.evaluate(() => window.__app.switchStatsView('closest-pairs'));
  const мс1 = await ждать(page, () => !!document.querySelector('#pairsBody .pairs-row')
    && !document.querySelector('[id^="loadingIndicator_"]'));
  await разобрать(page, 'матрица пар', { двигался: false, результат: { годно: мс1 !== null, ждали: 'строки пар', вышло: `за ${мс1} мс` } });
  await page.evaluate(ЧАСОВОЙ);
  await page.evaluate(() => document.getElementById('pairsBtnNetwork').click());
  const мс2 = await ждать(page, () => /Подошло/.test((document.querySelector('#pairsBody .pairs-count') || {}).textContent || ''));
  await разобрать(page, 'пары по сети', { результат: { годно: мс2 !== null, ждали: 'строки пар по сети', вышло: `за ${мс2} мс` } });
});

// 4. карта сходства
await сценарий('карта', async page => {
  const ids = await page.evaluate(`(${СВЯЗНАЯ})()`);
  await page.evaluate(ЧАСОВОЙ);
  await page.evaluate(id => window.__app.showSimilarityOverlay(id, 'network'), ids[0]);
  const мс = await ждать(page, () => !!document.querySelector('#similarityLegend .simleg-btn.active')
    && !document.getElementById('networkProgressBox'));
  const вид = await page.evaluate(() => (document.querySelector('#similarityLegend .simleg-btn.active') || {}).textContent);
  await разобрать(page, 'карта', { результат: { годно: мс !== null && /месту в сети/.test(вид || ''), ждали: 'открыта по месту в сети', вышло: `${(вид || '').trim()} за ${мс} мс` } });
});

// 5. сетевые метрики окна статистики (полоса #analysisProgress)
await сценарий('метрики статистики', async page => {
  await page.evaluate(() => window.__app.openStatsModal());
  await wait(800);
  for (const вид of ['betweenness', 'closeness']) {
    await page.evaluate(v => window.__app.switchStatsView(v), вид);
    await wait(1200);
    await page.evaluate(ЧАСОВОЙ);
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('#statsContentArea button')].find(x => /Рассчитать/.test(x.textContent));
      if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    const мс = await ждать(page, () => getComputedStyle(document.getElementById('analysisProgress')).display === 'none'
      && !![...document.querySelectorAll('#statsContentArea [id^="visualize-btn-"]')].length);
    await разобрать(page, `метрика ${вид}`, { результат: { годно: мс !== null, ждали: 'кнопка визуализации', вышло: `за ${мс} мс` } });
  }
});

// 6–7. фильтры цепочек
for (const [режим, имя] of [['chains', 'связанные сети'], ['unique_chains', 'сквозные цепочки']]) {
  await сценарий(имя, async page => {
    await page.evaluate(() => {
      const A = window.__app;
      // четыре философа с наибольшим числом концепций: у первых по хронологии
      // цепочек нет вовсе, и проверка результата выходила пустой
      const счёт = {};
      for (const n of A.DATA.nodes) счёт[n.concept] = (счёт[n.concept] || 0) + 1;
      const имена = Object.keys(счёт).sort((x, y) => счёт[y] - счёт[x] || x.localeCompare(y)).slice(0, 4);
      A.deselectAllPhilosophers();
      for (const x of имена) A.togglePhilosopher(x);
    });
    await wait(800);
    await page.evaluate(ЧАСОВОЙ);
    await page.evaluate(m => {
      const fm = document.getElementById('filterMode');
      fm.value = m;
      window.__app.changeFilterMode(m);
    }, режим);
    await wait(300);
    const мс = await ждать(page, () => !document.querySelector('[id^="loadingIndicator_"]'));
    const итог = await page.evaluate(() => (document.getElementById('filterStats') || {}).textContent || '');
    const показано = +((/(\d+)\s*\//.exec(итог) || [])[1] || 0);
    // «Сквозные цепочки» требуют однократного участия каждого философа и у
    // этой четвёрки законно пусты (замер 2026-09-17: «Связанные сети» дают
    // 39 концепций, сквозные — 0). Для них результат — снятый оверлей и
    // обновлённый счётчик; для связанных сетей — ещё и найденные концепции.
    const годно = мс !== null && /Показано/.test(итог) && (режим === 'unique_chains' || показано > 0);
    await разобрать(page, имя, { двигался: false, результат: { годно, ждали: режим === 'unique_chains' ? 'оверлей снят, счётчик обновлён' : 'оверлей снят, найдены концепции', вышло: `${итог.trim().slice(0, 60)} за ${мс} мс` } });
  });
}

await browser.close();
let плохо = 0;
for (const п of проверки) {
  if (!п.годно) плохо++;
  console.log(`${п.годно ? '  ' : '✗ '}${п.имя}: ждали ${п.ждали}, вышло ${п.вышло}`);
}
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо}`);
process.exit(плохо ? 1 : 0);
