// Проба захода 0.3: всякая правка сперва ОПИСЫВАЕТСЯ, и описание верно.
//
// Спрашивает не «сломалось ли», а «то ли записано»: род сущности, действие,
// адрес и состав полей. Поле, которого человек не трогал, в описании быть
// не должно — иначе на сервере оно столкнётся там, где никто ничего не менял.
//
//   node tools/probes/draft_probe.mjs [index.html]

import puppeteer from 'puppeteer-core';
import { PUPPETEER, БРАУЗЕР, СЕРВЕР } from '../paths.mjs';

const страница = process.argv[2] || 'index.html';

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });

const browser = await puppeteer.launch({
  executablePath: БРАУЗЕР, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
page.on('dialog', d => d.accept());          // подтверждения удаления

await page.goto(СЕРВЕР + страница, { waitUntil: 'domcontentloaded' });
if (страница === 'index.html') {
  await page.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
}
const ждать = ms => new Promise(r => setTimeout(r, ms));
await ждать(9000);

const зов = страница === 'index.html' ? 'window.__app' : 'window';
const описание = () => page.evaluate(
  `(${зов}.lastSubmitted ? JSON.parse(JSON.stringify(${зов}.lastSubmitted)) : null)`);

// Входим админом: без права правки заслоны не пустят.
await page.evaluate(`(function(){
  ${зов}.openAuthModal('login');
  document.getElementById('authLogin').value = 'admin';
  document.getElementById('authPassword').value = 'admin';
  ${зов}.submitAuth();
})()`);
await ждать(600);

// ── 1. правка концепции: трогаем ОДНО поле ───────────────────────────────
const cid = await page.evaluate(`${зов}.DATA.concepts[0].id`);
await page.evaluate(`${зов}.openConceptById(${JSON.stringify(cid)})`);
await ждать(700);
await page.evaluate(`${зов}.openEditConceptModal(${JSON.stringify(cid)})`);
await ждать(900);
const было = await page.evaluate(`document.getElementById('conceptDescription').value`);
await page.evaluate(`(function(){
  document.getElementById('conceptDescription').value = ${JSON.stringify('проба 0.3')};
  ${зов}.saveConceptData();
})()`);
await ждать(900);
let о = await описание();
проверить('правка концепции: род', о && о.kind === 'concept', 'concept', о && о.kind);
проверить('правка концепции: действие', о && о.action === 'edit', 'edit', о && о.action);
проверить('правка концепции: адрес', о && о.entityId === cid, cid, о && о.entityId);
проверить('правка концепции: изменено ровно одно поле',
  о && Object.keys(о.fields).length === 1, 1, о && Object.keys(о.fields).length);
проверить('правка концепции: это description',
  о && !!о.fields.description, 'description', о && Object.keys(о.fields).join(','));
проверить('правка концепции: «было» сохранено',
  о && о.fields.description && о.fields.description.base === было,
  было.slice(0, 20), о && о.fields.description && String(о.fields.description.base).slice(0, 20));

// ── 2. сохранение без правки: описание пустое ────────────────────────────
await page.evaluate(`${зов}.openEditConceptModal(${JSON.stringify(cid)})`);
await ждать(900);
await page.evaluate(`${зов}.saveConceptData()`);
await ждать(800);
о = await описание();
проверить('сохранение без правки: полей нет',
  о && Object.keys(о.fields).length === 0, 0, о && Object.keys(о.fields).length);

// ── 3. правка связи ──────────────────────────────────────────────────────
const пара = await page.evaluate(`(function(){
  var l = ${зов}.DATA.relations[0];
  return { id: l.id, source: l.source, target: l.target };
})()`);
await page.evaluate(`${зов}.openEditConnectionModal(${JSON.stringify(пара.source)}, ${JSON.stringify(пара.target)})`);
await ждать(800);
await page.evaluate(`(function(){
  var w = document.getElementById('connWeight');
  if (w) w.value = String((parseInt(w.value, 10) || 2) === 5 ? 4 : 5);
  ${зов}.saveConnectionData();
})()`);
await ждать(900);
о = await описание();
проверить('правка связи: род', о && о.kind === 'relation', 'relation', о && о.kind);
проверить('правка связи: адрес — имя связи', о && о.entityId === пара.id, пара.id, о && о.entityId);
проверить('правка связи: изменён вес',
  о && !!о.fields.weight, 'weight', о && Object.keys(о.fields).join(','));
проверить('правка связи: концы не тронуты',
  о && !о.fields.source && !о.fields.target, 'нет', о && Object.keys(о.fields).join(','));

// ── 4. удаление связи ────────────────────────────────────────────────────
await page.evaluate(`${зов}.deleteConnection(${JSON.stringify(пара.source)}, ${JSON.stringify(пара.target)})`);
await ждать(900);
о = await описание();
проверить('удаление связи: действие', о && о.action === 'delete', 'delete', о && о.action);
проверить('удаление связи: адрес', о && о.entityId === пара.id, пара.id, о && о.entityId);
проверить('удаление связи: полей нет',
  о && Object.keys(о.fields).length === 0, 0, о && Object.keys(о.fields).length);

проверить('ошибок страницы нет', ошибки.length === 0, 0, ошибки.slice(0, 2).join(' | '));

for (const п of проверки)
  console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(44, '.') +
    (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
const плохо = проверки.filter(п => !п.годно);
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
await browser.close();
process.exit(плохо.length ? 1 : 0);
