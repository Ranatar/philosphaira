#!/usr/bin/env node
// ИСТОЧНИКИ И СНОСКИ В ИСХОДНИК по файлу правок (JSON).
//
//   node tools/edit/set_provenance.mjs <файл-правок.json> [ещё файлы …]
//                                      [--проба] [--исходник путь]
//
// Четвёртый применяющий скрипт рядом с add_concepts, add_links и fix_links:
// те заводят и правят сами записи, этот проставляет им ОСНОВАНИЕ — источник
// всей записи (provenance + provenanceStatus) и сноски к отдельным фразам
// описания (метка [^id] в тексте, запись { id, status, text } в footnotes).
// Через интерфейс то же делает форма правки; скрипт нужен для работы по
// первоисточникам, где за один заход разбираются десятки записей.
//
// ФОРМАТ ПРАВКИ:
//   { "entries": [ {
//       "kind": "relation" | "concept" | "philosopher",
//       "id": "rel_…",
//       "status": "sourced" | "editorial_reasoning" | "source_not_found",
//       "provenance": "TLP 2.11, 2.202",           // не нужен при source_not_found
//       "footnotes": [ { "status": "sourced", "text": "PU §43",
//                        "after": "точный отрезок описания, после которого метка" } ]
//   } ] }
// Метка встаёт СРАЗУ ПОСЛЕ отрезка `after`; он обязан встречаться в тексте
// ровно один раз. Отрезок берётся до конечной точки фразы — сноска по
// русскому набору стоит перед точкой, и тогда «фраза сноски», по которой
// заслон при правке спрашивает о подтверждении, совпадает с самой фразой.
// Идентификаторы сносок выдаются f1, f2, … по порядку их мест в тексте.
//
// ПРАВИЛА СОГЛАСИЯ НЕ ПЕРЕСКАЗЫВАЮТСЯ, А СПРАШИВАЮТСЯ У СЕРВЕРА:
// footnoteProblems, provenanceProblems, entityTextProblems — те же функции,
// которыми сервер судит правку и семя. Пересказ правила однажды разошёлся бы
// с ним молча (doc/build-ops.md, «Прибор не пересказывает правило»).
//
// ИДЕМПОТЕНТНОСТЬ: если запись уже в нужном виде, правка — пропуск; повторный
// прогон даёт «правок 0». При любом отказе файл не пишется.

import fs from 'node:fs';
import path from 'node:path';
import { ИСХОДНИК, КОРЕНЬ } from '../paths.mjs';
import { footnoteProblems, FOOTNOTE_HOST_FIELDS } from '../../server/src/graph/footnotes.js';
import { provenanceProblems, PROVENANCE_STATUSES } from '../../server/src/graph/schema.js';
import { entityTextProblems } from '../../server/src/graph/text-rules.js';

void КОРЕНЬ;
const args = process.argv.slice(2);
const dryRun = args.includes('--проба');
const srcIdx = args.indexOf('--исходник');
const srcPath = srcIdx >= 0 ? args[srcIdx + 1] : ИСХОДНИК;
const batches = args.filter((a, i) => !a.startsWith('--') && (srcIdx < 0 || i !== srcIdx + 1));
if (!batches.length) { console.error('нужен хотя бы один файл правок'); process.exit(2); }

const LITERAL_BY_KIND = { relation: 'relations', concept: 'concepts', philosopher: 'philosophers' };

// Конец выражения от открывающей скобки, с учётом строк: в описаниях бывают
// скобки, и счёт без строк сбился бы на первом же «(см. выше)».
function matchingClose(text, from) {
  const open = text[from], close = open === '[' ? ']' : '}';
  let depth = 0, quote = null, escaped = false;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (escaped) { escaped = false; continue; } if (ch === '\\') { escaped = true; continue; } if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (!depth) return i; }
  }
  return -1;
}

function literalRange(text, name) {
  const m = new RegExp('const ' + name + ' = \\[').exec(text);
  if (!m) return null;
  const from = text.indexOf('[', m.index);
  const to = matchingClose(text, from);
  return to < 0 ? null : { from, to };
}

// Запись по имени: ищем `id: "…"` внутри литерала и расширяем до её скобок.
function recordRange(text, lit, id) {
  const needle = `id: "${id}"`;
  let at = text.indexOf(needle, lit.from), found = null;
  while (at >= 0 && at < lit.to) {
    const after = text[at + needle.length];
    if (after === ',' || after === ' ' || after === '\n' || after === '\r' || after === '}') {
      if (found !== null) return { error: 'имя встречается в литерале дважды' };
      found = at;
    }
    at = text.indexOf(needle, at + 1);
  }
  if (found === null) return { error: 'записи с таким именем в литерале нет' };
  const from = text.lastIndexOf('{', found);
  const to = matchingClose(text, from);
  if (to < 0 || to > lit.to) return { error: 'не найдены границы записи' };
  return { from, to };
}

const evalRecord = (src) => new Function('return (' + src + ')')();
const q = (s) => `"${s}"`;
const INVARIANT = /["\\\n\t]|\s\s/;

let source = fs.readFileSync(srcPath, 'utf8');
const original = source;
const notes = [];
let applied = 0, skipped = 0;

for (const file of batches) {
  const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const e of batch.entries || []) {
    const tag = `${path.basename(file)} ${e.kind}:${e.id}`;
    const litName = LITERAL_BY_KIND[e.kind];
    if (!litName) { notes.push(`✗ ${tag}: неизвестный род «${e.kind}»`); continue; }
    const lit = literalRange(source, litName);
    if (!lit) { notes.push(`✗ ${tag}: литерал ${litName} не найден`); continue; }
    const rr = recordRange(source, lit, e.id);
    if (rr.error) { notes.push(`✗ ${tag}: ${rr.error}`); continue; }
    const recordText = source.slice(rr.from, rr.to + 1);
    let current;
    try { current = evalRecord(recordText); } catch (err) { notes.push(`✗ ${tag}: запись не читается (${err.message})`); continue; }

    if (!PROVENANCE_STATUSES.includes(e.status) || e.status === 'unspecified') {
      notes.push(`✗ ${tag}: состояние записи «${e.status}» — нужно sourced, editorial_reasoning или source_not_found`); continue;
    }
    const hosts = FOOTNOTE_HOST_FIELDS[e.kind] || [];
    const specNotes = e.footnotes || [];
    if (specNotes.length && !hosts.length) { notes.push(`✗ ${tag}: у рода ${e.kind} сносок не бывает`); continue; }

    // Текст без прежних меток — правка задаёт сноски целиком, а не прибавляет.
    const stripMarks = (t) => (typeof t === 'string' ? t.replace(/\s?\[\^[a-z0-9]{1,12}\]/g, '') : t);
    const next = { ...current };
    for (const h of hosts) next[h] = stripMarks(current[h]);

    // Места меток: отрезок `after` обязан встретиться ровно один раз в одном
    // из полей-хозяев. Две сноски на одно место — отказ: это одна сноска.
    const placed = [];
    let bad = false;
    for (const n of specNotes) {
      if (!n.after) { notes.push(`✗ ${tag}: у сноски нет отрезка after`); bad = true; break; }
      const where = hosts.map(h => ({ h, i: (next[h] || '').indexOf(n.after) })).filter(x => x.i >= 0);
      const count = hosts.reduce((s, h) => s + ((next[h] || '').split(n.after).length - 1), 0);
      const elsewhere = ['description', 'extendedDescription'].filter(f => !hosts.includes(f)
        && typeof current[f] === 'string' && current[f].includes(n.after));
      if (!count && elsewhere.length) {
        notes.push(`✗ ${tag}: отрезок стоит в поле ${elsewhere.join(', ')}, а у рода ${e.kind} сноски только в ${hosts.join(', ')}`);
        bad = true; break;
      }
      if (count !== 1) { notes.push(`✗ ${tag}: отрезок «${n.after.slice(0, 50)}…» встречается ${count} раз(а), нужен ровно один`); bad = true; break; }
      placed.push({ ...n, host: where[0].h, pos: where[0].i + n.after.length });
    }
    if (bad) continue;
    const posKeys = placed.map(p => p.host + ':' + p.pos);
    if (new Set(posKeys).size !== posKeys.length) { notes.push(`✗ ${tag}: две сноски на одном месте`); continue; }
    // Порядок имён — порядок мест: сперва по полю (как показ), затем по месту.
    placed.sort((a, b) => hosts.indexOf(a.host) - hosts.indexOf(b.host) || a.pos - b.pos);
    placed.forEach((p, i) => { p.id = 'f' + (i + 1); });
    for (const h of hosts) {
      const mine = placed.filter(p => p.host === h).sort((a, b) => b.pos - a.pos);
      for (const p of mine) next[h] = next[h].slice(0, p.pos) + `[^${p.id}]` + next[h].slice(p.pos);
    }
    // ДАННОЕ ПЕРЕДАЁТСЯ КАК ЕСТЬ, СУДИТ СЕРВЕР. Первая редакция сама
    // выбрасывала текст у «не найден» — и подлог «не найден с текстом»
    // проходил молча: правка превращалась в другую, а противоречия никто не
    // видел. Пустое не пишется, непустое идёт на суд.
    const filled = (v) => (typeof v === 'string' && v.trim() !== '' ? v : undefined);
    next.provenance = filled(e.provenance);
    next.provenanceStatus = e.status;
    next.footnotes = placed.length
      ? placed.map(p => (filled(p.text) === undefined ? { id: p.id, status: p.status } : { id: p.id, status: p.status, text: p.text }))
      : undefined;
    for (const k of ['provenance', 'footnotes']) if (next[k] === undefined) delete next[k];

    // Суд — функциями сервера, по итоговой записи.
    const problems = [
      ...provenanceProblems(next),
      ...(hosts.length ? footnoteProblems(e.kind, next) : []),
      ...entityTextProblems(e.kind, next),
    ];
    for (const h of hosts) if (typeof next[h] === 'string' && INVARIANT.test(next[h])) problems.push(`${h}: нарушен инвариант хранения`);
    for (const s of [next.provenance, ...(next.footnotes || []).map(n => n.text)]) {
      if (typeof s === 'string' && INVARIANT.test(s)) problems.push(`строка «${s.slice(0, 40)}»: нарушен инвариант хранения`);
    }
    if (problems.length) { notes.push(`✗ ${tag}: ${problems.join('; ')}`); continue; }

    const same = hosts.every(h => current[h] === next[h])
      && current.provenance === next.provenance && current.provenanceStatus === next.provenanceStatus
      && JSON.stringify(current.footnotes || null) === JSON.stringify(next.footnotes || null);
    if (same) { notes.push(`· ${tag}: ПРОПУСК, уже в нужном виде`); skipped++; continue; }

    // Запись в текст. Поля-хозяева правятся на месте; прежние ключи
    // происхождения снимаются, новые встают последними — тот же порядок, что
    // в описи сервера (graph/schema.js), иначе выгрузка разойдётся с файлами.
    let rec = recordText;
    for (const h of hosts) {
      if (current[h] === next[h]) continue;
      const re = new RegExp(`(${h}:\\s*)"[^"]*"`);
      if (!re.test(rec)) { notes.push(`✗ ${tag}: поле ${h} не найдено в тексте записи`); bad = true; break; }
      rec = rec.replace(re, (m0, pre) => pre + q(next[h]));
    }
    if (bad) continue;
    rec = rec.replace(/,\s*provenance:\s*"[^"]*"/, '')
             .replace(/,\s*provenanceStatus:\s*"[^"]*"/, '')
             .replace(/,\s*footnotes:\s*\[[^\]]*\]/, '');
    const tail = [];
    if (next.provenance !== undefined) tail.push(`provenance: ${q(next.provenance)}`);
    tail.push(`provenanceStatus: ${q(next.provenanceStatus)}`);
    if (next.footnotes) {
      tail.push('footnotes: [' + next.footnotes.map(n => '{ ' + Object.entries(n).map(([k, v]) => `${k}: ${q(v)}`).join(', ') + ' }').join(', ') + ']');
    }
    const close = rec.lastIndexOf('}');
    const body = rec.slice(0, close).replace(/\s+$/, '');
    rec = body + ',\n        ' + tail.join(',\n        ') + ' ' + rec.slice(close);

    // Самопроверка: запись читается и даёт ровно задуманное.
    let check;
    try { check = evalRecord(rec); } catch (err) { notes.push(`✗ ${tag}: после правки запись не читается (${err.message})`); continue; }
    if (JSON.stringify(check) !== JSON.stringify(next)) { notes.push(`✗ ${tag}: после правки запись не совпала с задуманной`); continue; }

    source = source.slice(0, rr.from) + rec + source.slice(rr.to + 1);
    applied++;
    notes.push(`  ${tag}: ${e.status}${placed.length ? `, сносок ${placed.length}` : ''}`);
  }
}

for (const n of notes) console.log(n);
const refusals = notes.filter(n => n.startsWith('✗'));
if (refusals.length) { console.log(`\n✗ отказов ${refusals.length} — файл не тронут`); process.exit(1); }
if (dryRun) { console.log(`\nпроба: правок ${applied}, пропущено ${skipped}`); process.exit(0); }
if (applied) {
  fs.writeFileSync(srcPath + '.bak', original);
  fs.writeFileSync(srcPath, source);
  console.log(`\nправок ${applied}, пропущено ${skipped}\nрезервная копия: ${srcPath}.bak`);
} else {
  console.log(`\nправок 0, пропущено ${skipped}`);
}
