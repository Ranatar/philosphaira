#!/usr/bin/env node
// ЗАВЕДЕНИЕ НОВЫХ КОНЦЕПЦИЙ В ИСХОДНИК по файлам правок doc/additions/*.json.
//
//   node tools/edit/add_concepts.mjs doc/additions/batch-D-concepts.json
//                                    [--проба] [--исходник путь]
//
// Второй такой скрипт после add_links.mjs и по тем же причинам: в рабочей
// папке ревизии описаний есть apply-concepts.py, но он ПЕРЕПИСЫВАЕТ поля у
// существующих записей, а здесь записи заводятся. Порядок работ жёсткий:
// сперва концепции, потом связи F1/F2 — иначе связям не на что опереться.
//
// Проверяется перед записью: имя свободно и в принятом виде; у философа
// такой метки ещё нет; философ существует; рубрики из наличных; оба поля
// на месте; подпись — одна фраза без завершающей точки (П10), абзац кончается
// точкой (con.ext-final); инвариант хранения — ни двойных кавычек, ни
// обратных слэшей, ни переводов строк, ни двойных пробелов. Массив concepts
// хранится в ДВОЙНЫХ кавычках, в отличие от relations, — потому запретный
// знак здесь именно двойная кавычка. При любом отказе файл не трогается;
// повторный прогон даёт «заведено 0».

import fs from 'node:fs';
import path from 'node:path';
import { ИСХОДНИК, ДЕРЕВО } from '../paths.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--проба');
const srcIdx = args.indexOf('--исходник');
const srcPath = srcIdx >= 0 ? args[srcIdx + 1] : ИСХОДНИК;
const batches = args.filter((a, i) => !a.startsWith('--') && (srcIdx < 0 || i !== srcIdx + 1));
if (!batches.length) { console.error('нужен хотя бы один файл правок'); process.exit(2); }

// Наличные записи читаются ИЗ ПРАВИМОГО ИСХОДНИКА, а не из собранного
// дерева: дерево отстаёт ровно на одну правку, и после первой же сборки
// заведённые концепции начинают выглядеть как уже занятые метки. Та же
// причина, что и у add_links.mjs.
const dataDir = process.env.PG_DATA || path.join(ДЕРЕВО, 'data');
const read = (n) => JSON.parse(fs.readFileSync(path.join(dataDir, n + '.json'), 'utf8'));
const исходныйТекст = fs.readFileSync(srcPath, 'utf8');
const литерал = (имя) => {
  const s = new RegExp('const ' + имя + ' = \\[').exec(исходныйТекст);
  if (!s) return null;
  const от = исходныйТекст.indexOf('[', s.index);
  let г = 0, i = от, строка = null, экран = false;
  for (; i < исходныйТекст.length; i++) {
    const ch = исходныйТекст[i];
    if (строка) { if (экран) { экран = false; continue; } if (ch === '\\') { экран = true; continue; } if (ch === строка) строка = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { строка = ch; continue; }
    if (ch === '[') г++; else if (ch === ']') { г--; if (!г) { i++; break; } }
  }
  try { return new Function('return (' + исходныйТекст.slice(от, i) + ')')(); } catch (e) { return null; }
};
const concepts = литерал('concepts') || read('concepts');
const philosophers = литерал('philosophers') || read('philosophers');
const rubrics = литерал('rubrics') || read('rubrics');
const philByName = new Map(philosophers.map(p => [p.nameRu, p]));
const rubricIds = new Set(rubrics.map(r => r.id));

let source = исходныйТекст;
const startMatch = /^(\s*)const concepts = \[/m.exec(source);
if (!startMatch) { console.error('в исходнике не найден массив concepts'); process.exit(2); }
const arrayStart = startMatch.index + startMatch[0].length;
const tail = source.slice(arrayStart);
const closeInTail = tail.search(new RegExp('^' + startMatch[1] + '\\];', 'm'));
if (closeInTail < 0) { console.error('не найдено закрытие массива concepts'); process.exit(2); }
const arrayEnd = arrayStart + closeInTail;
const body = source.slice(arrayStart, arrayEnd);

const занятыеИмена = new Set([...body.matchAll(/\bid:\s*"([^"]+)"/g)].map(m => m[1]));
const занятыеМетки = new Set(concepts.map(c => c.philosopher + ' | ' + c.label));
const было = занятыеИмена.size;

const notes = [];
const ready = [];
for (const file of batches) {
  const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const c of batch.concepts) {
    const tag = `${path.basename(file)} ${c.id}`;
    if (!/^[a-z][a-z0-9_]*$/.test(c.id || '')) { notes.push(`${tag}: имя не в принятом виде`); continue; }
    if (занятыеИмена.has(c.id)) { notes.push(`${tag}: ПРОПУСК, такое имя в исходнике уже есть`); continue; }
    const phil = philByName.get(c.philosopher);
    if (!phil) { notes.push(`${tag}: нет философа «${c.philosopher}»`); continue; }
    if (занятыеМетки.has(phil.id + ' | ' + c.label)) { notes.push(`${tag}: у ${c.philosopher} уже есть метка «${c.label}»`); continue; }
    const чужие = (c.rubrics || []).filter(r => !rubricIds.has(r));
    if (!c.rubrics || !c.rubrics.length) { notes.push(`${tag}: не указана ни одна рубрика`); continue; }
    if (чужие.length) { notes.push(`${tag}: неизвестные рубрики ${чужие.join(', ')}`); continue; }
    const подпись = c.description || '', абзац = c.extendedDescription || '';
    if (!подпись || !абзац) { notes.push(`${tag}: пустое поле`); continue; }
    for (const [имя, текст] of [['подпись', подпись], ['абзац', абзац]]) {
      if (/["\\\n\t]|\s\s/.test(текст)) notes.push(`${tag}: ${имя} нарушает инвариант хранения`);
    }
    if (/[.!?]$/.test(подпись)) notes.push(`${tag}: подпись кончается точкой`);
    if ((подпись.match(/[.!?](\s|$)/g) || []).length) notes.push(`${tag}: подпись не одна фраза`);
    if (!/\.$/.test(абзац)) notes.push(`${tag}: абзац не кончается точкой`);
    занятыеИмена.add(c.id); занятыеМетки.add(phil.id + ' | ' + c.label);
    ready.push({ ...c, philId: phil.id });
  }
}

const отказы = notes.filter(n => !n.includes('ПРОПУСК'));
for (const n of notes) console.log((n.includes('ПРОПУСК') ? '· ' : '✗ ') + n);
if (отказы.length) { console.log(`\n✗ отказов ${отказы.length} — файл не тронут`); process.exit(1); }

const запись = (c) =>
  `      { id: "${c.id}", label: "${c.label}", philosopher: "${c.philId}", rubrics: [${c.rubrics.map(r => `"${r}"`).join(', ')}],\n`
  + `        description: "${c.description}",\n`
  + `        extendedDescription: "${c.extendedDescription}" },`;
// Последняя запись массива стоит без запятой — та же мина, что у связей.
const нуженЗапятой = /\}\s*$/.test(body);
const вставка = ready.length
  ? (нуженЗапятой ? ',' : '') + '\n'
    + `      // Заведено по doc/db-additions-spec.md, заход D.\n`
    + ready.map(запись).join('\n').replace(/,$/, '') + '\n'
  : '';

if (dryRun) {
  console.log(`\nпроба: годных ${ready.length}, концепций было ${было}, стало бы ${было + ready.length}`);
  process.exit(0);
}

// Вставка идёт СРАЗУ за последней записью: если положить её после
// переводов строки, запятая окажется на отдельной строке, и
// reorder_chrono, режущий массив на куски текста, унесёт её в начало
// следующего куска — тот перестанет читаться. Поймано приёмкой.
const хвостПробелы = body.length - body.trimEnd().length;
const точкаВставки = arrayEnd - хвостПробелы;
const обновлённый = source.slice(0, точкаВставки) + вставка + source.slice(точкаВставки);
fs.writeFileSync(srcPath + '.bak', source);
fs.writeFileSync(srcPath, обновлённый);

// Постпроверка чтением литерала: вставка, ломающая массив, должна отменяться,
// а не доживать до сборки.
const проверить = (txt) => {
  const s = /^(\s*)const concepts = \[/m.exec(txt);
  const от = txt.indexOf('[', s.index);
  let г = 0, i = от, строка = null, экран = false;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (строка) { if (экран) { экран = false; continue; } if (ch === '\\') { экран = true; continue; } if (ch === строка) строка = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { строка = ch; continue; }
    if (ch === '[') г++; else if (ch === ']') { г--; if (!г) { i++; break; } }
  }
  return new Function('return (' + txt.slice(от, i) + ')')();
};
let итог;
try { итог = проверить(обновлённый); }
catch (e) { fs.writeFileSync(srcPath, source); console.error(`✗ литерал не читается: ${e.message} — правка отменена`); process.exit(1); }
if (итог.length !== было + ready.length) {
  fs.writeFileSync(srcPath, source);
  console.error(`✗ после записи концепций ${итог.length}, ждали ${было + ready.length} — правка отменена`);
  process.exit(1);
}
console.log(`\nзаведено ${ready.length}, пропущено ${notes.length}; концепций ${было} → ${итог.length}`);
console.log(`резервная копия: ${srcPath}.bak`);
console.log('дальше: связи F1 и F2 через add_links.mjs, затем layout, сборка и приёмка');
