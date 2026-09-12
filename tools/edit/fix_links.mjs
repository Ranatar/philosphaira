#!/usr/bin/env node
// ПРАВКА ХАРАКТЕРИСТИК СУЩЕСТВУЮЩИХ СВЯЗЕЙ по файлу правок (JSON).
//
//   node tools/edit/fix_links.mjs <файл-правок.json>
//                                 [--проба] [--исходник путь]
//
// Третий применяющий скрипт: add_concepts заводит записи, add_links заводит
// рёбра, этот правит УЖЕ ЗАВЕДЁННОЕ — тип, вес, двусторонность, направление
// и описание. Адресуется тройкой (source, target, type) ДО правки; если её
// не нашлось, но нашлась правка в готовом виде, запись пропускается — так
// достигается идемпотентность.
//
// Правка направления переставляет концы и потому требует нового описания:
// перевёрнутая связь со старым текстом читается наоборот. Скрипт этого не
// проверяет по смыслу, но требует поля `description` при `swap: true` и при
// смене типа — чтобы забыть было нельзя.
//
// Проверяется то же, что при заведении: слой против расстояния, хронология
// по `temporal`, вес 1..3, инвариант хранения; сверх того — что после правки
// такой связи ещё нет (иначе правка создаёт двойника).

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
const dataDir = process.env.PG_DATA || path.join(ДЕРЕВО, 'data');
const read = (n) => JSON.parse(fs.readFileSync(path.join(dataDir, n + '.json'), 'utf8'));
const concepts = литерал('concepts') || read('concepts');
const philosophers = литерал('philosophers') || read('philosophers');
const types = литерал('relationTypes') || read('relationTypes');
const relations = литерал('relations') || read('relations');
const conceptById = new Map(concepts.map(c => [c.id, c]));
const philById = new Map(philosophers.map(p => [p.id, p]));
const typeById = new Map(types.map(t => [t.id, t]));
const activeEnd = (p) => (p.death != null ? p.death : p.birth + 80);
const overlap = (a, b) => a.birth + MATURITY_AGE <= activeEnd(b) && b.birth + MATURITY_AGE <= activeEnd(a);

let source = исходныйТекст;
const notes = [];
let применено = 0, пропущено = 0;

for (const file of batches) {
  const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const f of batch.fixes) {
    const tag = `${path.basename(file)} ${f.source} →${f.type}→ ${f.target}`;
    const было = relations.find(r => r.source === f.source && r.target === f.target && r.type === f.type);
    const стало = { source: f.swap ? f.target : f.source, target: f.swap ? f.source : f.target,
                    type: f.newType || f.type, weight: f.weight, bidirectional: f.bidirectional };
    if (!было) {
      const уже = relations.find(r => r.source === стало.source && r.target === стало.target && r.type === стало.type);
      if (уже) { notes.push(`· ${tag}: ПРОПУСК, правка уже применена`); пропущено++; continue; }
      notes.push(`✗ ${tag}: такой связи в исходнике нет`); continue;
    }
    // Правка, ничего не меняющая, — это ПРОПУСК, а не работа: иначе повторный
    // прогон рапортует о пятнадцати применённых правках и идемпотентность
    // остаётся на слово, а не на деле.
    const безПеремен = !f.swap && !f.newType
      && (f.weight === undefined || было.weight === f.weight)
      && (f.bidirectional === undefined || !!было.bidirectional === !!f.bidirectional)
      && (!f.description || было.description === f.description);
    if (безПеремен) { notes.push(`· ${tag}: ПРОПУСК, менять нечего`); пропущено++; continue; }
    if ((f.swap || f.newType) && !f.description) {
      notes.push(`✗ ${tag}: перестановка концов или смена типа требует нового описания`); continue;
    }
    const t = typeById.get(стало.type);
    if (!t) { notes.push(`✗ ${tag}: неизвестный тип «${стало.type}»`); continue; }
    if (стало.weight !== undefined && ![1, 2, 3].includes(стало.weight)) { notes.push(`✗ ${tag}: вес ${стало.weight}`); continue; }
    const cs = conceptById.get(стало.source), ct = conceptById.get(стало.target);
    const sp = philById.get(cs.philosopher), tp = philById.get(ct.philosopher);
    const свои = sp.id === tp.id;
    if (!свои && t.layer === 'logical') { notes.push(`✗ ${tag}: логический тип между разными системами`); continue; }
    if (свои && t.layer === 'historical') { notes.push(`✗ ${tag}: исторический тип внутри одной системы`); continue; }
    if (t.temporal && !свои && sp.birth !== tp.birth && !overlap(sp, tp)) {
      const позже = sp.birth > tp.birth;
      if (t.temporal === 'forward' && позже) { notes.push(`✗ ${tag}: хронология, источник моложе цели`); continue; }
      if ((t.temporal === 'retrospective' || t.temporal === 'up_to_contemporary') && !позже) {
        notes.push(`✗ ${tag}: хронология, источник старше цели`); continue;
      }
    }
    if (f.description && /["\\\n\t]|\s\s/.test(f.description)) { notes.push(`✗ ${tag}: описание нарушает инвариант хранения`); continue; }

    // Запись в исходнике: находим её по тройке и переписываем поля.
    const ключ = new RegExp(
      `(\\{[^{}]*?source:\\s*"${f.source}",\\s*target:\\s*"${f.target}",\\s*type:\\s*"${f.type}"[^]*?\\})(?=,?\\s*(?:\\n\\s*(?:\\{|//|\\];)))`);
    const m = ключ.exec(source);
    if (!m) { notes.push(`✗ ${tag}: запись не найдена в тексте исходника`); continue; }
    let запись = m[0];
    if (f.swap) запись = запись
      .replace(`source: "${f.source}"`, 'source: "@@"')
      .replace(`target: "${f.target}"`, `target: "${f.source}"`)
      .replace('source: "@@"', `source: "${f.target}"`);
    if (f.newType) запись = запись.replace(`type: "${f.type}"`, `type: "${f.newType}"`);
    if (f.weight !== undefined) запись = запись.replace(/weight:\s*\d/, `weight: ${f.weight}`);
    if (f.bidirectional !== undefined) {
      запись = /bidirectional:\s*(true|false)/.test(запись)
        ? запись.replace(/bidirectional:\s*(true|false)/, `bidirectional: ${f.bidirectional}`)
        : запись.replace(/(weight:\s*\d)/, `$1, bidirectional: ${f.bidirectional}`);
    }
    if (f.description) запись = запись.replace(/description:\s*"[^"]*"/, `description: "${f.description}"`);
    source = source.slice(0, m.index) + запись + source.slice(m.index + m[0].length);
    применено++;
  }
}

for (const n of notes) console.log(n);
const отказы = notes.filter(n => n.startsWith('✗'));
if (отказы.length) { console.log(`\n✗ отказов ${отказы.length} — файл не тронут`); process.exit(1); }
if (dryRun) { console.log(`\nпроба: правок ${применено}, пропущено ${пропущено}`); process.exit(0); }

fs.writeFileSync(srcPath + '.bak', исходныйТекст);
fs.writeFileSync(srcPath, source);
console.log(`\nправок ${применено}, пропущено ${пропущено}`);
console.log(`резервная копия: ${srcPath}.bak`);
