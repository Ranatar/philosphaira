#!/usr/bin/env node
// ПЕРЕИМЕНОВАНИЕ МЕСТНЫХ ИМЁН — ПО ОБЛАСТЯМ ВИДИМОСТИ.
//
// Родич rename.mjs, но тот работает с ВЕРХНЕЙ областью, а здесь
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
//   node tools/edit/rename_locals.mjs словарь.json [--да]
//
// Словарь: { "<старое>": "<новое>" } — общее правило, либо
//          { "<старое>": { "<имя функции>": "<новое>", "*": "<по умолчанию>" } }
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as eslintScope from 'eslint-scope';
import { ИСХОДНИК } from '../paths.mjs';

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

// ЗАСЛОН ОТ ЗАХВАТА. У rename.mjs отказ при занятом имени есть, здесь его
// не было — а нужен он тут даже больше: местное имя может не совпасть ни с
// чем в своей области (и разбор промолчит), но ЗАТЕНИТЬ внешнее, которое
// внутри читается. Тогда ссылка молча начинает указывать не туда. Ровно так
// `const S = []` увёл `S.useWeightedPaths` на пустой массив, и метрика
// полгода считала ненаправленное посредничество вместо направленного.
//
// ПРОВЕРЯТЬ НАДО ДО ПРАВКИ, а не после: как только имя затенено, разбор уже
// разрешает все ссылки внутри на местное, и постфактум захват неотличим от
// законного затенения. Отдельный прибор «по факту» я написал и выбросил —
// подложенная поломка прошла мимо него именно поэтому.
//
// Два вопроса на каждое переименование X → Y в области S:
//   1) есть ли в самой S другое связывание с именем Y (два const — ошибка
//      разбора, но var и параметр пройдут молча);
//   2) читается ли внутри S внешнее Y — то самое, что будет захвачено.
const столкновения = [];
(function проверить(область) {
  for (const пер of область.variables) {
    const правило = СЛОВАРЬ[пер.name];
    if (!правило || область.type === 'global') continue;
    const где = хозяин(область);
    const новое = typeof правило === 'string' ? правило : (правило[где] || правило['*']);
    if (!новое) continue;

    if (область.variables.some(v => v.name === новое)) {
      столкновения.push(`${пер.name} → ${новое} (в ${где}): имя УЖЕ ЗАНЯТО в той же области`);
      continue;
    }
    const [a, b] = область.block.range;
    for (let верх = область.upper; верх; верх = верх.upper) {
      const внешнее = верх.variables.find(v => v.name === новое);
      if (!внешнее) continue;
      const внутри = внешнее.references.filter(
        r => r.identifier.range[0] >= a && r.identifier.range[1] <= b);
      if (внутри.length) столкновения.push(
        `${пер.name} → ${новое} (в ${где}): ЗАХВАТ — внешнее «${новое}» читается внутри `
        + `${внутри.length} раз, после правки ссылки укажут на местное`);
      break;
    }
  }
  область.childScopes.forEach(проверить);
})(sm.globalScope);

if (столкновения.length) {
  console.error('\nСТОЛКНОВЕНИЕ ИМЁН — переименование отменено:');
  for (const с of столкновения) console.error('  ✗ ' + с);
  console.error('\nВыберите другое имя.');
  process.exit(1);
}

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
