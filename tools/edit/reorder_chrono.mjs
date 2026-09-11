#!/usr/bin/env node
// ХРОНОЛОГИЧЕСКИЙ ПОРЯДОК ЗАПИСЕЙ В ИСХОДНИКЕ.
//
// Перестановка равнозначных строк: ни одно поле не меняется, меняется только
// место записи в массиве. Три правила:
//
//   1. philosophers — по году рождения, по возрастанию. Совпадающие годы
//      сохраняют нынешний относительный порядок (устойчивая сортировка):
//      выбор, кто из ровесников первым, был сделан прежде и пересматривать
//      его перестановкой незачем.
//   2. concepts — группы по философам идут в порядке философов; ПОРЯДОК
//      ВНУТРИ ГРУППЫ СОХРАНЯЕТСЯ. Он не случаен: концепции одного философа
//      выложены от опорной к производным, и сортировка внутри группы
//      разрушила бы это.
//   3. relations — по месту источника, затем цели в новом порядке концепций.
//      Прежде порядок связей не подчинялся никакому правилу вовсе.
//
// ЧТО НЕ МЕНЯЕТСЯ И ПОЧЕМУ. Отпечаток базы: graphFingerprint() СОРТИРУЕТ
// идентификаторы и ключи рёбер перед свёрткой, значит раскладка не протухает
// и layout.mjs гонять не нужно. Имена связей: sha1 от тройки, от места не
// зависят. Координаты: набор позиций — словарь по идентификатору, не список.
//
//   node tools/edit/reorder_chrono.mjs [--проверить]

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { КОРЕНЬ } from '../paths.mjs';

const ИСХОДНИК = path.join(КОРЕНЬ, 'source', 'philosophy_graph_v3.html');
const ПРОВЕРКА = process.argv.includes('--проверить');
let src = fs.readFileSync(ИСХОДНИК, 'utf8');

function границы(имя) {
  const m = new RegExp('const\\s+' + имя + '\\s*=\\s*\\[').exec(src);
  if (!m) throw new Error('не найден массив ' + имя);
  let i = src.indexOf('[', m.index), d = 0, j = i, q = null, e = false;
  for (; j < src.length; j++) {
    const c = src[j];
    if (q) { if (e) { e = false; continue; } if (c === '\\') { e = true; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && src[j + 1] === '/') { while (j < src.length && src[j] !== '\n') j++; continue; }
    if (c === '[') d++; else if (c === ']') { d--; if (!d) { j++; break; } }
  }
  return { от: i, до: j, данные: new Function('return (' + src.slice(i, j) + ')')() };
}

// Разбор массива на КУСКИ ТЕКСТА: перекладываем исходные строки как есть,
// ничего не перепечатывая. Иначе перестановка стала бы переписыванием, и
// сличение с прежней версией показало бы правку там, где её нет.
function куски(от, до) {
  const тело = src.slice(от + 1, до - 1);
  const части = [];
  let гл = 0, нач = 0, q = null, e = false;
  for (let i = 0; i < тело.length; i++) {
    const c = тело[i];
    if (q) { if (e) { e = false; continue; } if (c === '\\') { e = true; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && тело[i + 1] === '/') { while (i < тело.length && тело[i] !== '\n') i++; continue; }
    if (c === '{' || c === '[') гл++;
    else if (c === '}' || c === ']') {
      гл--;
      if (гл === 0) {
        let k = i + 1;
        while (k < тело.length && (тело[k] === ',' || тело[k] === ' ')) k++;
        части.push(тело.slice(нач, k));
        нач = k;
      }
    }
  }
  const хвост = тело.slice(нач);
  return { части, хвост };
}

function переложить(имя, порядок) {
  const { от, до, данные } = границы(имя);
  const { части, хвост } = куски(от, до);
  if (части.length !== данные.length)
    throw new Error(`${имя}: кусков ${части.length}, записей ${данные.length}`);
  // Куски склеиваются ОДНОЙ ЗАПЯТОЙ, без добавочного перевода строки: у
  // каждого куска перевод уже в начале, и склейка через ',\n' прибавляла к
  // нему второй. Файл рос на пустую строку под каждую запись — 3538 строк за
  // прогон: 43621 → 47157 → 50695. Снимать переводы у кусков тоже нельзя, это
  // сплющило бы весь массив (37118 строк вместо 43544). Поймано при
  // расширении базы сентября 2026.
  const новые = порядок.map(i => части[i].replace(/,\s*$/, ''));
  const тело = новые.join(',') + (/^\s*$/.test(хвост) ? '' : ',' + хвост);
  src = src.slice(0, от) + '[\n' + тело + '\n    ]' + src.slice(до);
  return данные;
}

const отпечаток = д => {
  const ids = д.concepts.map(c => c.id).sort();
  const рёбра = д.relations.map(r => r.source + '|' + r.target + '|' + r.type).sort();
  return crypto.createHash('sha1').update(ids.join(',') + ';' + рёбра.join(',')).digest('hex').slice(0, 16);
};

const P0 = границы('philosophers').данные;
const C0 = границы('concepts').данные;
const R0 = границы('relations').данные;
const было = отпечаток({ concepts: C0, relations: R0 });

// 1. философы
const порФ = P0.map((p, i) => i).sort((a, b) => P0[a].birth - P0[b].birth || a - b);
const местоФ = {}; порФ.forEach((стар, нов) => местоФ[P0[стар].id] = нов);

// 2. концепции: группа философа целиком, порядок внутри как был
const порК = C0.map((c, i) => i)
  .sort((a, b) => местоФ[C0[a].philosopher] - местоФ[C0[b].philosopher] || a - b);
const местоК = {}; порК.forEach((стар, нов) => местоК[C0[стар].id] = нов);

// 3. связи
const порС = R0.map((r, i) => i)
  .sort((a, b) => (местоК[R0[a].source] - местоК[R0[b].source])
                || (местоК[R0[a].target] - местоК[R0[b].target]) || a - b);

переложить('philosophers', порФ);
переложить('concepts', порК);
переложить('relations', порС);

const P1 = границы('philosophers').данные;
const C1 = границы('concepts').данные;
const R1 = границы('relations').данные;
const стало = отпечаток({ concepts: C1, relations: R1 });

const набор = a => JSON.stringify(a.map(x => JSON.stringify(x)).sort());
if (набор(P0) !== набор(P1)) throw new Error('философы: набор записей изменился');
if (набор(C0) !== набор(C1)) throw new Error('концепции: набор записей изменился');
if (набор(R0) !== набор(R1)) throw new Error('связи: набор записей изменился');
if (было !== стало) throw new Error('отпечаток базы изменился: ' + было + ' → ' + стало);

let сб = 0;
for (let i = 1; i < P1.length; i++) if (P1[i].birth < P1[i - 1].birth) сб++;
const порФ1 = {}; P1.forEach((p, i) => порФ1[p.id] = i);
let сбК = 0; for (let i = 1; i < C1.length; i++)
  if (порФ1[C1[i].philosopher] < порФ1[C1[i - 1].philosopher]) сбК++;
const порК1 = {}; C1.forEach((c, i) => порК1[c.id] = i);
let сбС = 0; for (let i = 1; i < R1.length; i++)
  if (порК1[R1[i].source] < порК1[R1[i - 1].source]) сбС++;

console.log('ПЕРЕСТАНОВКА');
console.log('  философы:  нарушений хронологии ' + сб + ' (было 11)');
console.log('  концепции: групп не по порядку ' + сбК);
console.log('  связи:     источник не по порядку ' + сбС + ' (было 595 на исходных 1624)');
console.log('  набор записей во всех трёх массивах: тот же, до знака');
console.log('  отпечаток базы: ' + стало + ' — НЕ ИЗМЕНИЛСЯ, раскладку пересчитывать не нужно');

if (ПРОВЕРКА) { console.log('\n--проверить: файл не записан.'); process.exit(0); }
fs.writeFileSync(ИСХОДНИК, src);
console.log('\nзаписано. дальше: node tools/remap.mjs собрать');
