#!/usr/bin/env node
// ЗАВЕДЕНИЕ НОВЫХ СВЯЗЕЙ В ИСХОДНИК по файлам правок (JSON).
//
//   node tools/edit/add_links.mjs <файл-правок.json> [ещё файлы …]
//                                 [--проба] [--исходник путь]
//
// Почему свой, а не тот, что в рабочей папке ревизии описаний: там проверка
// хронологии сравнивает ГОДЫ РОЖДЕНИЯ и отвергает всякую прямую связь от
// младшего к старшему. Приложение судит иначе — по пересечению периодов
// деятельности (MATURITY_AGE = 20, при отсутствии года смерти рождение + 80),
// и в самой базе таких связей двенадцать: Шеллинг → Гегель, Адорно →
// Маркузе, Сартр → Лакан. Все они верны: младший печатается раньше. Строгое
// правило по рождению отвергало бы их, и прибор, отвергающий то, что база
// содержит, чинит не данные, а собственное представление о них.
//
// Проверяется перед записью: обе концепции существуют; тип известен; такой
// связи ещё нет (у симметричных — и в обратную сторону); слой против
// расстояния (логический тип между системами и исторический внутри одной —
// отказ); хронология по полю temporal; вес 1..3; инвариант хранения.
// При любом отказе файл не пишется. Повторный прогон даёт «применено 0».

import fs from 'node:fs';
import path from 'node:path';
import { ИСХОДНИК, ДЕРЕВО } from '../paths.mjs';

const MATURITY_AGE = 20;
const args = process.argv.slice(2);
const dryRun = args.includes('--проба');
const srcIdx = args.indexOf('--исходник');
const srcPath = srcIdx >= 0 ? args[srcIdx + 1] : ИСХОДНИК;
const batches = args.filter((a, i) => !a.startsWith('--') && (srcIdx < 0 || i !== srcIdx + 1));
if (!batches.length) { console.error('нужен хотя бы один файл правок'); process.exit(2); }

// КОНЦЕПЦИИ ЧИТАЮТСЯ ИЗ ПРАВИМОГО ИСХОДНИКА, а не из собранного дерева.
// Первый прогон по полному набору это и вскрыл: заведённые тем же заходом
// двадцать девять концепций в app/data ещё не попали, и все сто сорок три
// связи к ним были отвергнуты как «нет концепции». Дерево отстаёт от
// исходника ровно на одну правку — значит спрашивать надо исходник.
const dataDir = process.env.PG_DATA || path.join(ДЕРЕВО, 'data');
const read = (n) => JSON.parse(fs.readFileSync(path.join(dataDir, n + '.json'), 'utf8'));
const литерал = (txt, имя) => {
  const s = new RegExp('const ' + имя + ' = \\[').exec(txt);
  if (!s) return null;
  const от = txt.indexOf('[', s.index);
  let г = 0, i = от, строка = null, экран = false;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (строка) { if (экран) { экран = false; continue; } if (ch === '\\') { экран = true; continue; } if (ch === строка) строка = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { строка = ch; continue; }
    if (ch === '[') г++; else if (ch === ']') { г--; if (!г) { i++; break; } }
  }
  try { return new Function('return (' + txt.slice(от, i) + ')')(); } catch (e) { return null; }
};
const исходныйТекст = fs.readFileSync(srcPath, 'utf8');
const concepts = литерал(исходныйТекст, 'concepts') || read('concepts');
const philosophers = литерал(исходныйТекст, 'philosophers') || read('philosophers');
const types = литерал(исходныйТекст, 'relationTypes') || read('relationTypes');
const conceptById = new Map(concepts.map(c => [c.id, c]));
const philById = new Map(philosophers.map(p => [p.id, p]));
const typeById = new Map(types.map(t => [t.id, t]));

let source = исходныйТекст;

// Границы массива relations в исходнике: записи лежат по одной строке,
// закрытие массива — строка «    ];» на том же отступе, что и объявление.
const startMatch = /^(\s*)const relations = \[/m.exec(source);
if (!startMatch) { console.error('в исходнике не найден массив relations'); process.exit(2); }
const arrayStart = startMatch.index + startMatch[0].length;
const closeRe = new RegExp('^' + startMatch[1] + '\\];', 'm');
closeRe.lastIndex = arrayStart;
const tail = source.slice(arrayStart);
const closeInTail = tail.search(closeRe);
if (closeInTail < 0) { console.error('не найдено закрытие массива relations'); process.exit(2); }
const arrayEnd = arrayStart + closeInTail;
const body = source.slice(arrayStart, arrayEnd);

const existing = new Set();
const pairType = new Set();
for (const m of body.matchAll(/source:\s*"([^"]+)",\s*target:\s*"([^"]+)",\s*type:\s*"([^"]+)"/g)) {
  existing.add(`${m[1]}|${m[2]}|${m[3]}`);
  pairType.add([m[1], m[2]].sort().join('~') + '|' + m[3]);
}
const было = existing.size;

const activeEnd = (p) => (p.death != null ? p.death : p.birth + 80);
const overlap = (a, b) =>
  a.birth + MATURITY_AGE <= activeEnd(b) && b.birth + MATURITY_AGE <= activeEnd(a);

const notes = [];
const ready = [];
for (const file of batches) {
  const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const e of batch.edits) {
    const tag = `${path.basename(file)} ${e.source} →${e.type}→ ${e.target}`;
    const cs = conceptById.get(e.source), ct = conceptById.get(e.target);
    if (!cs || !ct) { notes.push(`${tag}: нет концепции ${cs ? e.target : e.source}`); continue; }
    const t = typeById.get(e.type);
    if (!t) { notes.push(`${tag}: неизвестный тип`); continue; }
    if (![1, 2, 3].includes(e.weight)) { notes.push(`${tag}: вес ${e.weight}`); continue; }
    const key = `${e.source}|${e.target}|${e.type}`;
    const pk = [e.source, e.target].sort().join('~') + '|' + e.type;
    if (existing.has(key) || (t.symmetric && pairType.has(pk))) { notes.push(`${tag}: ПРОПУСК, такая связь уже есть`); continue; }
    const sp = philById.get(cs.philosopher), tp = philById.get(ct.philosopher);
    const свои = sp.id === tp.id;
    if (!свои && t.layer === 'logical') { notes.push(`${tag}: логический тип между разными системами`); continue; }
    if (свои && t.layer === 'historical') { notes.push(`${tag}: исторический тип внутри одной системы`); continue; }
    if (t.temporal && !свои && sp.birth !== tp.birth && !overlap(sp, tp)) {
      const позже = sp.birth > tp.birth;
      if (t.temporal === 'forward' && позже) { notes.push(`${tag}: хронология, источник моложе цели`); continue; }
      if ((t.temporal === 'retrospective' || t.temporal === 'up_to_contemporary') && !позже) {
        notes.push(`${tag}: хронология, источник старше цели`); continue;
      }
    }
    const d = e.description || '';
    if (!d) { notes.push(`${tag}: нет описания`); continue; }
    if (/["\\\n\t]|\s\s/.test(d)) { notes.push(`${tag}: описание нарушает инвариант хранения`); continue; }
    existing.add(key); pairType.add(pk);
    ready.push(e);
  }
}

const отказы = notes.filter(n => !n.includes('ПРОПУСК'));
for (const n of notes) console.log((n.includes('ПРОПУСК') ? '· ' : '✗ ') + n);

if (отказы.length) {
  console.log(`\n✗ отказов ${отказы.length} — файл не тронут`);
  process.exit(1);
}

const строка = (e) => `      { source: "${e.source}", target: "${e.target}", type: "${e.type}", weight: ${e.weight},\n`
  + `        description: "${e.description}" },`;
// Последняя запись массива стоит БЕЗ ЗАПЯТОЙ: без этой строки вставка даёт
// «} { » и литерал перестаёт читаться. Поймано разбором, а не глазом.
const нуженЗапятой = /\}\s*$/.test(body);
const вставка = ready.length
  ? (нуженЗапятой ? ',' : '') + '\n'
    + `      // Заведено по файлам правок: ${batches.map(b => path.basename(b)).join(', ')}.\n`
    + ready.map(строка).join('\n').replace(/,$/, '') + '\n'
  : '';

if (dryRun) {
  console.log(`\nпроба: годных ${ready.length}, пропущено ${notes.length}, связей было ${было}, стало бы ${было + ready.length}`);
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
// Постпроверка: столько же записей, сколько ждали, и литерал по-прежнему читается.
const проверка = obновлённыйСчёт(обновлённый);
function obновлённыйСчёт(txt) {
  const s = /^(\s*)const relations = \[/m.exec(txt);
  const от = s.index + s[0].length;
  const до = от + txt.slice(от).search(new RegExp('^' + s[1] + '\\];', 'm'));
  return [...txt.slice(от, до).matchAll(/source:\s*"[^"]+",\s*target:\s*"[^"]+",\s*type:\s*"[^"]+"/g)].length;
}
if (проверка !== было + ready.length) {
  fs.writeFileSync(srcPath, source);
  console.error(`✗ после записи связей ${проверка}, ждали ${было + ready.length} — правка отменена`);
  process.exit(1);
}
console.log(`\nприменено ${ready.length}, пропущено ${notes.length}; связей ${было} → ${проверка}`);
console.log(`резервная копия: ${srcPath}.bak`);
console.log('дальше: node tools/edit/layout.mjs, затем remap собрать и приёмка');
