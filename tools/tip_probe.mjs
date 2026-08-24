import puppeteer from 'puppeteer-core';
import { БРАУЗЕР, СЕРВЕР } from './paths.mjs';
const b = await puppeteer.launch({ executablePath: БРАУЗЕР, headless: 'new',
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto(СЕРВЕР + 'index.html', { waitUntil: 'domcontentloaded' });
await p.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
const wait = ms => new Promise(r => setTimeout(r, ms));
const счёт = () => p.evaluate(`(function(){
  var it = document.querySelectorAll('#philosopherFilters .legend-item');
  var д = 0;
  it.forEach(function(x){ var t = x.getAttribute('data-tip');
    if (t && t.length > 50) д++; });
  return д + ' из ' + it.length;
})()`);
await wait(8000);
const шаги = [];
шаги.push(['исходно', await счёт()]);
await p.evaluate(() => window.__app.deselectAllPhilosophers()); await wait(600);
шаги.push(['снять всех', await счёт()]);
await p.evaluate(() => window.__app.selectAllPhilosophers()); await wait(600);
шаги.push(['вернуть всех', await счёт()]);
await p.evaluate(() => window.__app.togglePhilosopher('Пифагор')); await wait(500);
шаги.push(['дёрнуть одного', await счёт()]);
let плохо = 0;
for (const [имя, знач] of шаги) {
  const годно = знач === '57 из 57';
  if (!годно) плохо++;
  console.log((годно ? '  ' : '✗ ') + имя.padEnd(16, '.') + ' подсказок ' + знач);
}
console.log(плохо ? `НЕ СОШЛОСЬ: ${плохо}` : 'подсказки переживают отбор');
await b.close();
process.exit(плохо ? 1 : 0);
