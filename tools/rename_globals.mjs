#!/usr/bin/env node
// ПЕРЕИМЕНОВАНИЕ ИМЁН — ПО РАЗБОРУ, А НЕ ПО ЗАМЕНЕ СЛОВА.
//
// Замена слова по файлу однажды уже испортила базу: `дело`, `событие` и
// `доводы` — обычные русские слова, и в 137 местах прозы и описаний концепций
// вместо них появились `handler`, `event`, `args`. Поймал это probe6, потому
// что снимки данных изменили длину — при переименовании такого быть не может.
//
// Здесь переименование идёт по РАЗБОРУ: acorn находит узлы-имена, eslint-scope
// сводит ссылку с объявлением, и правятся ТОЛЬКО отрезки, которые разбор
// назвал именем. Строка, комментарий и текст описания недосягаемы в принципе.
//
//   node tools/rename_globals.mjs словарь.json [--да]
//
// Без ключа --да только показывает, что будет сделано.
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as eslintScope from 'eslint-scope';
import { ИСХОДНИК, РАСКЛАДКА } from './paths.mjs';

const СЛОВАРЬ = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const ПРИМЕНИТЬ = process.argv.includes('--да');

const html = fs.readFileSync(ИСХОДНИК, 'utf8');

// Тот же способ выделения скрипта, что и в split.mjs: разбирается ТОЛЬКО код.
const нач = html.indexOf('<script>', html.indexOf('</style>'));
const телоНач = html.indexOf('>', нач) + 1;
const телоКон = html.indexOf('</script>', телоНач);
const code = html.slice(телоНач, телоКон);

const ast = acorn.parse(code, { ecmaVersion: 2023, sourceType: 'script', ranges: true });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'script' });
const верх = sm.globalScope;

const правки = [];   // {start, end, было, стало}
let ненайденные = [];

for (const [старое, новое] of Object.entries(СЛОВАРЬ)) {
  const v = верх.variables.find(x => x.name === старое)
         || верх.through.map(r => r.identifier).find(i => i.name === старое);
  const пер = верх.variables.find(x => x.name === старое);
  if (!пер) { ненайденные.push(старое); continue; }
  for (const d of пер.defs) if (d.name) правки.push({ start: d.name.range[0], end: d.name.range[1], было: старое, стало: новое });
  for (const r of пер.references) правки.push({ start: r.identifier.range[0], end: r.identifier.range[1], было: старое, стало: новое });
}

// одно и то же место могло попасть дважды (объявление есть и ссылка)
const поМесту = new Map();
for (const п of правки) поМесту.set(п.start + ':' + п.end, п);
const список = [...поМесту.values()].sort((a, b) => b.start - a.start);

const счёт = {};
for (const п of список) счёт[п.было] = (счёт[п.было] || 0) + 1;
for (const [и, n] of Object.entries(счёт)) console.log(`  ${и} → ${СЛОВАРЬ[и]}: ${n} мест`);
if (ненайденные.length) console.log('  НЕ НАЙДЕНЫ в верхней области:', ненайденные.join(', '));

if (!ПРИМЕНИТЬ) { console.log('\n(показ; чтобы применить, добавьте ключ --да)'); process.exit(0); }

let новыйКод = code;
for (const п of список) новыйКод = новыйКод.slice(0, п.start) + п.стало + новыйКод.slice(п.end);
fs.writeFileSync(ИСХОДНИК, html.slice(0, телоНач) + новыйКод + html.slice(телоКон));

// раскладка знает имена — её ключи тоже переименовываются
const a = JSON.parse(fs.readFileSync(РАСКЛАДКА, 'utf8'));
a.по_имени = Object.fromEntries(Object.entries(a.по_имени).map(([k, v]) => [СЛОВАРЬ[k] || k, v]));
if (Array.isArray(a.новые)) a.новые = a.новые.map(x => СЛОВАРЬ[x] || x);
fs.writeFileSync(РАСКЛАДКА, JSON.stringify(a, null, 1));

console.log(`\nправлено мест: ${список.length}; исходник и раскладка обновлены.`);
console.log('ОБЯЗАТЕЛЬНО: probe6 — он хеширует данные и поймает, если правка задела описания.');
