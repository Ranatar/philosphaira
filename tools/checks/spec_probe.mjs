#!/usr/bin/env node
// РАЗБОР СПЕЦИФИКАЦИИ ДОБАВЛЕНИЙ В БАЗУ (doc/db-additions-spec.md).
//
// Перечень связей, составленный человеком по памяти, врёт молча: каждая
// строка по отдельности выглядит разумно. Первый прогон по черновику
// спецификации нашёл 85 связей, УЖЕ ЕСТЬ в базе, 9 с перевёрнутым
// направлением и 15, замыкавших круг обоснования, — треть перечня.
//
// Прибор не пересказывает правила приложения, а берёт их из данных:
// направление проверяется по полю `temporal` того же relationTypes,
// круги — по тем же четырём обосновывающим типам, что и в
// groundingCyclePath, допуск на пересечение периодов деятельности — тот же
// (MATURITY_AGE = 20, при отсутствии года смерти рождение + 80). Меняется
// правило в приложении — меняется и здесь, потому что источник один.
//
//   node tools/checks/spec_probe.mjs [спецификация.md]
//
// Пусто — берётся doc/db-additions-spec.md. Возврат 1, если есть замечания.

import fs from 'node:fs';
import path from 'node:path';
import { КОРЕНЬ, ДЕРЕВО } from '../paths.mjs';

const MATURITY_AGE = 20;
const GROUNDING_TYPES = new Set(['consequence', 'presuppose', 'condition', 'emerge_from']);
const DEGREE_FLOOR_NOTE = 'порог показательности профиля — медиана степени по всей базе';

const specPath = process.argv[2] || path.join(КОРЕНЬ, 'doc/db-additions-spec.md');
const dataDir = process.env.PG_DATA || path.join(ДЕРЕВО, 'data');

const readSet = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name + '.json'), 'utf8'));
let concepts, philosophers, relations, relationTypes, rubrics;
try {
  concepts = readSet('concepts');
  philosophers = readSet('philosophers');
  relations = readSet('relations');
  relationTypes = readSet('relationTypes');
  rubrics = readSet('rubrics');
} catch (e) {
  console.error(`✗ не читается база из ${dataDir}: ${e.message}`);
  console.error('  соберите дерево (node tools/remap.mjs собрать) или задайте PG_DATA');
  process.exit(2);
}

const philById = new Map(philosophers.map(p => [p.id, p]));
const philByName = new Map(philosophers.map(p => [p.nameRu, p]));
const conceptById = new Map(concepts.map(c => [c.id, c]));
const typeById = new Map(relationTypes.map(t => [t.id, t]));
const rubricIds = new Set(rubrics.map(r => r.id));

// Пара «философ + метка» однозначна по всей базе — проверяется здесь же:
// если двойники заведутся, разбор спецификации станет гаданием.
const idByPair = new Map();
const twins = [];
for (const c of concepts) {
  const key = philById.get(c.philosopher).nameRu + ' | ' + c.label;
  if (idByPair.has(key)) twins.push(key);
  idByPair.set(key, c.id);
}

const notes = [];
const fail = (line, text) => notes.push(`стр ${line}: ${text}`);
for (const key of twins) fail(0, `в базе две концепции с одним именем: ${key}`);

// ── разбор ─────────────────────────────────────────────────────────
// Внутри блока философа конец без приставки принадлежит ему самому;
// чужой конец пишется как «Философ: Метка».
const lines = fs.readFileSync(specPath, 'utf8').split('\n');
const proposedLinks = [];
const proposedConcepts = [];
let section = null, block = null;

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i], no = i + 1;
  const head1 = raw.match(/^# (.+)$/);
  if (head1) { section = /^Заход /.test(head1[1]) ? head1[1] : null; block = null; continue; }
  const head3 = raw.match(/^### (.+?)\s*$/);
  if (head3) { block = head3[1].split(':')[0].trim(); continue; }
  if (!section) continue;

  const link = raw.match(/^-\s+(?:\*\*★\*\*\s*)?(.+?)\s*→\s*(.+?)\s*—\s*([a-z_]+)\s+([123])\s*$/);
  if (link) {
    const split = (side) => {
      const parts = side.split(': ');
      return parts.length > 1
        ? [parts[0].trim(), parts.slice(1).join(': ').trim()]
        : [block, side.trim()];
    };
    const [sourcePhil, sourceLabel] = split(link[1]);
    const [targetPhil, targetLabel] = split(link[2]);
    proposedLinks.push({ no, section, sourcePhil, sourceLabel, targetPhil, targetLabel,
                         type: link[3], weight: +link[4] });
    continue;
  }
  // строка таблицы захода D: | Метка | `идентификатор` | рубрика, рубрика |
  //
  // Идентификатор назначается ЗДЕСЬ, а не при заведении: связи захода F
  // адресуются меткой, но в базу пойдут именем, и если имя выдумать при
  // применении, спецификация и база разойдутся молча.
  const row = raw.match(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([a-z, _]+)\s*\|\s*$/);
  if (row && block) {
    proposedConcepts.push({ no, phil: block, label: row[1].trim(), id: row[2].trim(),
                            rubrics: row[3].split(',').map(s => s.trim()).filter(Boolean) });
  }
}

const realKeys = new Set(idByPair.keys());

// ЗАВОДИМЫЕ КОНЦЕПЦИИ — ТОЖЕ КОНЦЫ СВЯЗЕЙ. Заход D перечисляет то, чего в
// базе пока нет, а заход F вешает на них связи; без этого перечня половина
// строк читалась бы как опечатка. Ключ тот же, что у заведённых: «Философ |
// Метка», и он проверяется на столкновение с базой.
const idsВБазе = new Set(concepts.map(c => c.id));
const занято = new Map();
for (const c of proposedConcepts) {
  if (!c.id) { fail(c.no, `у «${c.label}» не назначен идентификатор`); continue; }
  if (!/^[a-z][a-z0-9_]*$/.test(c.id)) fail(c.no, `идентификатор «${c.id}» не в принятом виде (латиница, snake_case)`);
  if (idsВБазе.has(c.id)) fail(c.no, `идентификатор «${c.id}» уже занят в базе`);
  if (занято.has(c.id)) fail(c.no, `идентификатор «${c.id}» повторяется в спецификации`);
  занято.set(c.id, c);
  const key = c.phil + ' | ' + c.label;
  if (!idByPair.has(key)) idByPair.set(key, c.id);
}
const planned = new Set(proposedConcepts.map(c => c.id).filter(Boolean));
const philOfPlanned = new Map(proposedConcepts.map(c => [c.id, c.phil]));
const labelOfPlanned = new Map(proposedConcepts.map(c => [c.id, c.label]));
const philNameOf = (id) => planned.has(id)
  ? philOfPlanned.get(id)
  : philById.get(conceptById.get(id).philosopher).nameRu;
const labelOf = (id) => planned.has(id) ? labelOfPlanned.get(id) : conceptById.get(id).label;

// ── что уже есть ───────────────────────────────────────────────────
const existing = new Set(relations.map(r => `${r.source}|${r.target}|${r.type}`));
const existingPairType = new Set(relations.map(
  r => [r.source, r.target].sort().join('~') + '|' + r.type));

// Подграф обоснования ориентируется ОТ обосновывающего к обоснованному:
// у ground === 'source' основание в источнике, иначе в цели.
const groundEdges = new Map();
const addGroundEdge = (from, to) => {
  if (from === to) return;
  if (!groundEdges.has(from)) groundEdges.set(from, []);
  groundEdges.get(from).push(to);
};
const groundDirection = (type, source, target) =>
  typeById.get(type).ground === 'target' ? [target, source] : [source, target];
for (const r of relations) {
  if (!GROUNDING_TYPES.has(r.type)) continue;
  addGroundEdge(...groundDirection(r.type, r.source, r.target));
}
const reachable = (from, to) => {
  const seen = new Set([from]); const queue = [from];
  while (queue.length) {
    const v = queue.shift();
    if (v === to) return true;
    for (const w of groundEdges.get(v) || []) if (!seen.has(w)) { seen.add(w); queue.push(w); }
  }
  return false;
};

const activeEnd = (p) => (p.death != null ? p.death : p.birth + 80);
const overlap = (a, b) =>
  a.birth + MATURITY_AGE <= activeEnd(b) && b.birth + MATURITY_AGE <= activeEnd(a);

// ── проверка связей ────────────────────────────────────────────────
const accepted = [];
const seenHere = new Set();
for (const l of proposedLinks) {
  const sourceId = idByPair.get(l.sourcePhil + ' | ' + l.sourceLabel);
  const targetId = idByPair.get(l.targetPhil + ' | ' + l.targetLabel);
  if (!sourceId) { fail(l.no, `нет концепции «${l.sourcePhil}: ${l.sourceLabel}»`); continue; }
  if (!targetId) { fail(l.no, `нет концепции «${l.targetPhil}: ${l.targetLabel}»`); continue; }
  const type = typeById.get(l.type);
  if (!type) { fail(l.no, `неизвестный тип связи «${l.type}»`); continue; }

  const pairKey = [sourceId, targetId].sort().join('~') + '|' + l.type;
  if (existing.has(`${sourceId}|${targetId}|${l.type}`)) {
    fail(l.no, `такая связь в базе уже есть — ${l.sourceLabel} → ${l.targetLabel} (${l.type})`); continue;
  }
  if (existingPairType.has(pairKey)) {
    fail(l.no, `эта пара уже связана тем же типом в обратную сторону — ${l.sourceLabel} ↔ ${l.targetLabel} (${l.type})`); continue;
  }
  if (seenHere.has(pairKey)) {
    fail(l.no, `повтор внутри спецификации — ${l.sourceLabel} ↔ ${l.targetLabel} (${l.type})`); continue;
  }

  // Хронология — по полю temporal, а не по зашитым спискам типов.
  const sourcePhil = philByName.get(l.sourcePhil), targetPhil = philByName.get(l.targetPhil);
  if (!sourcePhil) { fail(l.no, `нет философа «${l.sourcePhil}»`); continue; }
  if (!targetPhil) { fail(l.no, `нет философа «${l.targetPhil}»`); continue; }
  if (type.temporal && sourcePhil.id !== targetPhil.id
      && sourcePhil.birth !== targetPhil.birth && !overlap(sourcePhil, targetPhil)) {
    const later = sourcePhil.birth > targetPhil.birth;
    const say = (need) => fail(l.no,
      `хронология: у типа «${type.label}» источник ${need}, `
      + `а ${l.sourcePhil} (${sourcePhil.years}) и ${l.targetPhil} (${targetPhil.years}) не пересекаются`);
    if (type.temporal === 'forward' && later) say('должен быть РАНЬШЕ цели');
    if ((type.temporal === 'retrospective' || type.temporal === 'up_to_contemporary') && !later)
      say('не может быть РАНЬШЕ цели');
    if (type.temporal === 'contemporary') say('и цель должны быть современниками');
  }

  // СЛОЙ ПРОТИВ РАССТОЯНИЯ. База держит это начисто: из 2201 связи ни одной
  // логической между разными системами и ни одной исторической внутри одной.
  // Оно и понятно: обоснование живёт внутри системы, передание — между ними,
  // а `both` законно и там и там. Прибор этого не знал, и первый же заход
  // описаний упёрся в отказ применяющего скрипта на трёх связях.
  if (sourcePhil.id !== targetPhil.id && type.layer === 'logical') {
    fail(l.no, `логический тип «${type.label}» между разными системами (${l.sourcePhil} и ${l.targetPhil})`); continue;
  }
  if (sourcePhil.id === targetPhil.id && type.layer === 'historical') {
    fail(l.no, `исторический тип «${type.label}» внутри одной системы (${l.sourcePhil})`); continue;
  }

  // Круги обоснования — накопительно: каждая следующая связь проверяется
  // с учётом уже принятых, иначе спецификация из двух строк замкнёт круг
  // и обе строки поодиночке будут выглядеть невинно.
  if (GROUNDING_TYPES.has(l.type)) {
    const [from, to] = groundDirection(l.type, sourceId, targetId);
    if (from !== to && reachable(to, from)) {
      fail(l.no, `круг обоснования — ${l.sourceLabel} → ${l.targetLabel} (${l.type})`); continue;
    }
    addGroundEdge(from, to);
  }
  seenHere.add(pairKey);
  accepted.push({ ...l, sourceId, targetId });
}

// ── проверка заводимых концепций ───────────────────────────────────
for (const c of proposedConcepts) {
  if (!philByName.has(c.phil)) { fail(c.no, `нет философа «${c.phil}»`); continue; }
  if (realKeys.has(c.phil + ' | ' + c.label)) fail(c.no, `концепция «${c.label}» у ${c.phil} уже есть`);
  const unknown = c.rubrics.filter(r => !rubricIds.has(r));
  if (unknown.length) fail(c.no, `неизвестные рубрики у «${c.label}»: ${unknown.join(', ')}`);
  if (!c.rubrics.length) fail(c.no, `у «${c.label}» не указана ни одна рубрика`);
}

// ── чего достигает ─────────────────────────────────────────────────
const degree = new Map([...concepts.map(c => [c.id, 0]), ...[...planned].map(id => [id, 0])]);
for (const r of relations) {
  degree.set(r.source, (degree.get(r.source) || 0) + 1);
  degree.set(r.target, (degree.get(r.target) || 0) + 1);
}
const after = new Map(degree);
for (const l of accepted) {
  after.set(l.sourceId, after.get(l.sourceId) + 1);
  after.set(l.targetId, after.get(l.targetId) + 1);
}
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};
const floorNow = median([...degree.values()]);
const floorAfter = median([...after.values()]);

// ПОРОГ ПЛЫВЁТ, И ЭТО НЕ НЕДОСМОТР ПРИЛОЖЕНИЯ. profileIsMeaningful сравнивает
// степень с МЕДИАНОЙ, а под медианой по устройству лежит половина базы: цель
// «ни одной концепции ниже порога» недостижима в принципе. Достижим ПАРИТЕТ —
// чтобы задетая спецификацией часть была под порогом не чаще прочей.
const touched = new Set(accepted.flatMap(l => [l.sourceId, l.targetId]));
const untouched = concepts.filter(c => !touched.has(c.id));
const share = (ids, deg, floor) =>
  ids.length ? (100 * ids.filter(id => deg.get(id) < floor).length / ids.length).toFixed(1) + ' %' : '—';
const touchedIds = [...touched], untouchedIds = untouched.map(c => c.id);
const belowAfter = touchedIds.filter(id => after.get(id) < floorAfter);

console.log(`спецификация: ${specPath}`);
console.log(`база: ${dataDir} — концепций ${concepts.length}, связей ${relations.length}`);
console.log(`строк со связями ${proposedLinks.length}, годных ${accepted.length}; концепций к заведению ${proposedConcepts.length}`);
const byWeight = accepted.reduce((acc, l) => (acc[l.weight] = (acc[l.weight] || 0) + 1, acc), {});
console.log(`веса: 1 — ${byWeight[1] || 0}, 2 — ${byWeight[2] || 0}, 3 — ${byWeight[3] || 0}`);
const bySection = accepted.reduce((acc, l) => (acc[l.section] = (acc[l.section] || 0) + 1, acc), {});
for (const [name, n] of Object.entries(bySection)) console.log(`  ${name}: ${n}`);
console.log(`медиана степени по базе: ${floorNow} → ${floorAfter} (${DEGREE_FLOOR_NOTE})`);
console.log(`ниже порога — задетые: ${share(touchedIds, degree, floorNow)} → ${share(touchedIds, after, floorAfter)}`
          + `; остальные: ${share(untouchedIds, degree, floorNow)} → ${share(untouchedIds, after, floorAfter)}`);
const worst = belowAfter.filter(id => after.get(id) <= floorAfter - 2)
  .sort((a, b) => after.get(a) - after.get(b)).slice(0, 15);
if (worst.length) {
  console.log('  дальше всех от порога: ' + worst
    .map(id => `${philById.get(conceptById.get(id).philosopher).nameRu}: ${conceptById.get(id).label} (${after.get(id)})`)
    .join('; '));
}

// СВЯЗНОСТЬ. Граф должен оставаться одним куском: концепция, ни с чем не
// соединённая, не показывается ни в поиске пути, ни в сходстве, и вся работа
// над её описанием пропадает. Сейчас база связна начисто (один кусок на 689),
// и всякое добавление обязано это сохранить — особенно заводимые концепции,
// у которых связей нет вовсе, покуда их не назначат.
const neighbours = new Map([...degree.keys()].map(id => [id, []]));
const link = (a, b) => { if (a === b) return; neighbours.get(a).push(b); neighbours.get(b).push(a); };
for (const r of relations) link(r.source, r.target);
for (const l of accepted) link(l.sourceId, l.targetId);
const seen = new Set(); const components = [];
for (const id of neighbours.keys()) {
  if (seen.has(id)) continue;
  const stack = [id]; seen.add(id); const cur = [];
  while (stack.length) {
    const v = stack.pop(); cur.push(v);
    for (const w of neighbours.get(v)) if (!seen.has(w)) { seen.add(w); stack.push(w); }
  }
  components.push(cur);
}
components.sort((a, b) => b.length - a.length);
console.log(`связность: кусков ${components.length}, наибольший ${components[0].length} из ${neighbours.size}`);
if (components.length > 1) {
  for (const k of components.slice(1)) {
    fail(0, `граф распадается: отдельный кусок из ${k.length} — `
      + k.slice(0, 6).map(id => `${philNameOf(id)}: ${labelOf(id)}`).join('; '));
  }
}
// СИСТЕМА КАЖДОГО ФИЛОСОФА — ТОЖЕ ОДИН КУСОК. Связность всего графа этого не
// обеспечивает: понятие может висеть на чужой системе, не будучи связано ни с
// одним понятием собственной, и тогда окно философа показывает россыпь вместо
// учения. В базе на 11 сентября так распадается ровно одна система из ста.
const внутренние = new Map();
const своиУ = new Map();
for (const id of degree.keys()) {
  const ph = philNameOf(id);
  if (!своиУ.has(ph)) своиУ.set(ph, []);
  своиУ.get(ph).push(id);
  внутренние.set(id, []);
}
const связьВнутри = (a, b) => {
  if (a === b || philNameOf(a) !== philNameOf(b)) return;
  внутренние.get(a).push(b); внутренние.get(b).push(a);
};
for (const r of relations) связьВнутри(r.source, r.target);
for (const l of accepted) связьВнутри(l.sourceId, l.targetId);
for (const [ph, ids] of своиУ) {
  if (ids.length < 2) continue;
  const видели = new Set(); const куски = [];
  for (const id of ids) {
    if (видели.has(id)) continue;
    const стек = [id]; видели.add(id); const cur = [];
    while (стек.length) {
      const v = стек.pop(); cur.push(v);
      for (const w of внутренние.get(v)) if (!видели.has(w)) { видели.add(w); стек.push(w); }
    }
    куски.push(cur);
  }
  if (куски.length > 1) {
    куски.sort((a, b) => b.length - a.length);
    fail(0, `система «${ph}» распадается на ${куски.length}: `
      + куски.map(k => k.map(labelOf).join(' + ')).join(' | '));
  }
}

const бесхозные = [...planned].filter(id => !neighbours.get(id).length);
for (const id of бесхозные) fail(0, `заводимая концепция без единой связи: ${philNameOf(id)}: ${labelOf(id)}`);

if (notes.length) {
  console.log(`\n✗ ЗАМЕЧАНИЙ ${notes.length}:`);
  for (const n of notes) console.log('  ' + n);
  process.exit(1);
}
console.log('\nзамечаний нет');
