#!/usr/bin/env node
// ПЕРЕИМЕНОВАНИЕ МЕСТНЫХ ИМЁН — ПО ОБЛАСТЯМ ВИДИМОСТИ.
//
// Родич rename_globals.mjs, но тот работает с ВЕРХНЕЙ областью, а здесь
// переименовываются имена внутри функций: `const строка = …`, `узел`, `цвет`.
// Их 85, и прежний отчёт «кириллических имён в дереве нет» был неверен —
// я проверял только верхнюю область.
//
// Почему нельзя заменой слова: `строка` в разных функциях означает разное
// (строка таблицы, строка текста, номер строки), а `дело` и `событие` — ещё и
// обычные русские слова, которых полно в описаниях концепций. Однажды такая
// замена уже испортила базу в 137 местах.
//
// Здесь каждое ОБЪЯВЛЕНИЕ переименовывается отдельно вместе со своими
// ссылками: eslint-scope знает, какая ссылка к какому объявлению относится.
// Словарь задаёт имя ПО КОНТЕКСТУ: «имя в области такой-то функции».
//
//   node tools/rename_locals.mjs словарь.json [--да]
//
// Словарь: { "<старое>": "<новое>" } — общее правило, либо
//          { "<старое>": { "<имя функции>": "<новое>", "*": "<по умолчанию>" } }
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as eslintScope from 'eslint-scope';
import { ИСХОДНИК } from './paths.mjs';

const СЛОВАРЬ = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const ПРИМЕНИТЬ = process.argv.includes('--да');

const html = fs.readFileSync(ИСХОДНИК, 'utf8');
const нач = html.indexOf('<script>', html.indexOf('</style>'));
const телоНач = html.indexOf('>', нач) + 1;
const телоКон = html.indexOf('</script>', телоНач);
const code = html.slice(телоНач, телоКон);

const ast = acorn.parse(code, { ecmaVersion: 2023, sourceType: 'script', ranges: true });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'script' });

// имя вмещающей функции — для словаря и для отчёта
function хозяин(область) {
  let о = область;
  while (о) {
    if (о.block && (о.block.type === 'FunctionDeclaration' || о.block.type === 'FunctionExpression')
        && о.block.id) return о.block.id.name;
    о = о.upper;
  }
  return '(верх)';
}

const правки = [];
const отчёт = [];
(function обход(область) {
  for (const пер of область.variables) {
    const правило = СЛОВАРЬ[пер.name];
    if (!правило) continue;
    if (область.type === 'global') continue;      // верхняя область — не наше дело
    const где = хозяин(область);
    const новое = typeof правило === 'string' ? правило : (правило[где] || правило['*']);
    if (!новое) continue;
    отчёт.push(`${пер.name} → ${новое}   (в ${где}, ссылок ${пер.references.length})`);
    for (const d of пер.defs) if (d.name) правки.push({ ...d.name.range, s: d.name.range[0], e: d.name.range[1], новое });
    for (const r of пер.references) правки.push({ s: r.identifier.range[0], e: r.identifier.range[1], новое });
  }
  область.childScopes.forEach(обход);
})(sm.globalScope);

const поМесту = new Map();
for (const п of правки) поМесту.set(п.s + ':' + п.e, п);
const список = [...поМесту.values()].sort((a, b) => b.s - a.s);

for (const с of отчёт.sort()) console.log('  ' + с);
console.log(`\nобъявлений: ${отчёт.length}, мест: ${список.length}`);

if (!ПРИМЕНИТЬ) { console.log('(показ; чтобы применить, добавьте ключ --да)'); process.exit(0); }

let новыйКод = code;
for (const п of список) новыйКод = новыйКод.slice(0, п.s) + п.новое + новыйКод.slice(п.e);
fs.writeFileSync(ИСХОДНИК, html.slice(0, телоНач) + новыйКод + html.slice(телоКон));
console.log('\nисходник обновлён. ОБЯЗАТЕЛЬНО: probe6 — он поймает, если правка задела данные.');
