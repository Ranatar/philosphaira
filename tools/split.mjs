#!/usr/bin/env node
// Разбивка philosophy_graph.html на ES6-модули.
//
// Правила (все механические, никакого ручного переписывания):
//  1. Модуль сущности берётся из assign2.json (карта + спецификация).
//  2. Данные (6 массивов) уезжают в JSON и грузятся fetch'ем в DATA.
//  3. Пространства имён: DATA — данные и производные указатели,
//     S — изменяемое и отложенное, MET — метрики, зовомые по имени,
//     VIEWS — генераторы окон, зовомые по имени.
//  4. Объявление, чей начальный вид не чист (трогает document/d3/DATA),
//     становится ячейкой S и заполняется при запуске.
//  5. ВЕСЬ исполняемый код верхнего уровня переезжает в boot.js в том же
//     порядке — так порядок запуска сохраняется дословно.
//  6. Модули после этого содержат только объявления, поэтому взаимные
//     импорты безопасны.
//  7. bridge.js выставляет в window то, что зовёт разметка, — через
//     геттеры и сеттеры, поэтому разметку править не нужно.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
const eslintScope = require('eslint-scope');

const SRC = process.argv[3] || ИСХОДНИК;
// Пути — из одного места; см. tools/paths.mjs.
import { D3, ДЕРЕВО, ИСХОДНИК, КАРТА_ИМЁН, РАСКЛАДКА } from './paths.mjs';

const OUT = process.argv[2] || ДЕРЕВО;

// ── дерево стирается ЗДЕСЬ, а не тем, кто нас позвал ────────────────
// Прежде стирал только `remap.mjs собрать`, а ручная цепочка из семи шагов —
// та самая, которую предписывает doc/build-ops.md, — начиналась поверх
// прошлой сборки. Цена: уцелевал `actions_map.json`, delegate.mjs видел в нём
// все 208 действий, считал новых НОЛЬ и пропускал блок под `if (новые.length)`
// целиком — вместе с подключением `actions-dyn.js` в `main.js`. Страница
// поднималась с 96 действиями из 206, а ни один шаг цепочки не ругался:
// молчаливый отказ, худший из исходов.
// Стирать своё — обязанность первого шага; полагаться на звавшего нельзя.
if (fs.existsSync(OUT)) {
  // Заслон несимметричной цены: описка в пути не должна снести исходник или
  // оснастку. Стираем только то, что похоже на дерево сборки, либо пустое.
  const ПРИЗНАКИ = ['index.html', 'main.js', 'boot.js', 'modules'];
  const есть = fs.readdirSync(OUT);
  if (есть.length && !ПРИЗНАКИ.some(f => есть.includes(f))) {
    console.error(`split: «${OUT}» не похож на дерево сборки — ни одного из ${ПРИЗНАКИ.join(', ')}.`);
    console.error('Стирать чужую папку разбивка не станет. Проверьте путь.');
    process.exit(1);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
}

const src = fs.readFileSync(SRC, 'utf8');

// ── разбор ─────────────────────────────────────────────────────────
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let blocks = [], m;
while ((m = re.exec(src)) !== null) blocks.push({ i: m.index, all: m[0], code: m[1] });
const blk = blocks.slice().sort((a, b) => b.code.length - a.code.length)[0];
const code = blk.code;
const codeStart = blk.i + blk.all.indexOf('>') + 1;

const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', ranges: true });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'script' });
const gs = sm.globalScope;

// РАСКЛАДКА ПО ИМЕНАМ, а не по строкам. Имена устойчивы, номера строк —
// нет: одна вставка в исходник сдвигает всё после себя, и тридцать чужих
// сущностей молча уезжают в соседние модули (замерено). Диапазоны нужны
// были ровно один раз — чтобы разложить 730 сущностей впервые.
const assignNames = JSON.parse(fs.readFileSync(
  process.argv[4] || РАСКЛАДКА, 'utf8')).по_имени;
const mapJson = JSON.parse(fs.readFileSync(
  process.argv[5] || КАРТА_ИМЁН, 'utf8'));
const assign2 = { state: [] };

// ── перечень сущностей верхнего уровня (тот же порядок, что в карте) ─
const entities = [];   // {name|null, kind, range, node, decl}
let stmtNo = 0;
for (const node of ast.body) {
  if (node.type === 'FunctionDeclaration') {
    entities.push({ name: node.id.name, decl: 'function', node, range: node.range, async: node.async });
  } else if (node.type === 'VariableDeclaration') {
    for (const dcl of node.declarations) {
      if (dcl.id.type !== 'Identifier') continue;
      entities.push({ name: dcl.id.name, decl: node.kind, node: dcl, range: dcl.range,
                      declNode: node, init: dcl.init });
    }
  } else {
    // ПРИСВАИВАНИЕ К window НА ВЕРХНЕМ УРОВНЕ — ЭТО ОБЪЯВЛЕНИЕ, и разбирается
    // оно как объявление: у имени появляется дом в раскладке, а значение
    // подчиняется общему признаку разрешимости. Пока здесь был безымянный
    // оператор, первое правило уводило его в boot независимо ни от чего.
    const пр = node.type === 'ExpressionStatement'
      && node.expression.type === 'AssignmentExpression'
      && node.expression.operator === '='
      && node.expression.left.type === 'MemberExpression'
      && !node.expression.left.computed
      && node.expression.left.object.type === 'Identifier'
      && node.expression.left.object.name === 'window'
      && node.expression.left.property.type === 'Identifier'
      && !/^on/i.test(node.expression.left.property.name)
      ? node.expression : null;
    if (пр && !entities.some(x => x.name === пр.left.property.name)) {
      entities.push({ name: пр.left.property.name, decl: 'let', node: пр,
                      range: [пр.right.range[0], пр.right.range[1]],
                      declNode: { kind: 'let' }, init: пр.right });
    } else {
      stmtNo++;
      entities.push({ name: null, id: `stmt${String(stmtNo).padStart(3, '0')}`, decl: 'statement',
                      node, range: node.range });
    }
  }
}
const byName = new Map(entities.filter(e => e.name).map(e => [e.name, e]));

// Мёртвые сущности живут в dead.js — это записано в раскладке, а не
// перечнем внутри программы: раскладка должна быть единственным источником.

// ── пространства имён ──────────────────────────────────────────────
const RAW_DATA = ['traditions', 'philosophers', 'rubrics', 'relationTypes', 'concepts', 'relations'];
const DERIVED = ['philosopherIdToName', 'philosopherConcepts', 'philosopherOrder',
                 'relationTypesObj', 'linkColors', 'conceptToRubrics', 'rubricsObj',
                 'philosopherTraditions', 'nodes', 'links'];
const DERIVED_SET = new Set(DERIVED);
const DATA_NAMES = new Set([...RAW_DATA, ...DERIVED]);

// метрики, зовомые по имени: ключи METRIC_FLAGS + словарь в toggleMetricVisualization
const metFlags = byName.get('METRIC_FLAGS');
const MET_NAMES = new Set();
for (const p of metFlags.init.properties) {
  const n = p.key.name || p.key.value;
  if (byName.has(n)) MET_NAMES.add(n);
}
for (const r of mapJson.nameRefs) if (byName.has(r.name)) {
  const e = byName.get(r.name);
  if (/Index$|^calculate|^generativity$|^deductiveDepth$|Pattern$/.test(r.name) && e.decl === 'function')
    MET_NAMES.add(r.name);
}
const VIEW_NAMES = new Set(['generateConceptViewContent', 'generatePhilosopherViewContent',
  'generateConnectionViewContent', 'generateConceptEditContent',
  'generatePhilosopherEditContent', 'generateConnectionEditContent']);

// ── карта модулей (нужна до отбора отложенного) ─────────────────────
const moduleOfLate = new Map();     // имя сущности | stmtNNN -> модуль
const безМодуля = [];
for (const e of entities) {
  if (e.decl === 'statement') { moduleOfLate.set(e.id, 'boot.js'); continue; }
  if (RAW_DATA.includes(e.name)) continue;
  const m = assignNames[e.name];
  // Строку берём из самой сущности: прежде здесь звалась несуществующая
  // lineIn, и вместо внятного «имя без модуля» вылетало «lineIn is not
  // defined» — сообщение об ошибке само было сломано и прятало причину.
  if (!m) { безМодуля.push(e.name + ' (стр. ' + (e.line || '?') + ')'); continue; }
  moduleOfLate.set(e.name, m);
}
if (безМодуля.length) {
  // Новая сущность требует ЯВНОГО решения, куда её отнести: молча
  // расселять по соседству — как раз то, от чего уходим.
  console.error('нет модуля для ' + безМодуля.length + ' имён:\n  ' + безМодуля.join('\n  '));
  process.exit(1);
}

// изменяемое и отложенное
const STATE_NAMES = new Set(assign2.state.filter(n => byName.has(n)));

// РАЗМЕТКА ТОЖЕ ПИШЕТ В ГЛОБАЛЬНЫЕ, а этих записей в коде нет вовсе:
// `oninput="_pairsMinDegree=+this.value; renderClosestPairs()"` живёт в
// строке шаблона, разбор её не видит. Такие имена обязаны стать ячейками
// общего состояния: после делегирования тело действия — настоящий код в
// чужом модуле, а присвоить ввезённому имени нельзя.
for (const h of [...mapJson.markup.static, ...mapJson.markup.dynamic]) {
  for (const m of h.code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*=(?!=)/g)) {
    if (byName.has(m[1])) STATE_NAMES.add(m[1]);
  }
}

// ВВЕЗЁННОМУ ИМЕНИ ПРИСВОИТЬ НЕЛЬЗЯ: всякое let/var, в которое пишут
// из чужого модуля, обязано стать ячейкой S. Считается по окончательной
// раскладке, а не по черновой (иначе visibleNodeIds уезжает в core/,
// а пишет в него filters/ — и присвоение падает уже в браузере).
{
  // ВЕСЬ код верхнего уровня уезжает в boot.js, поэтому его записи в
  // модульные let становятся МЕЖМОДУЛЬНЫМИ, даже если спека держала
  // оператор и переменную в одном модуле. Иначе обработчик наведения
  // падает на первом же движении мыши: tooltipTimeout ввезён, а ему
  // присваивают.
  const homeOfEntity = (e) => e.decl === 'statement' ? 'boot.js'
    : (moduleOfLate.get(e.name) || null);
  for (const e of mapJson.entities) {
    const src = homeOfEntity(e);
    for (const u of e.uses || []) {
      if (!u.writes) continue;
      const t = byName.get(u.name);
      if (!t || (t.decl !== 'let' && t.decl !== 'var')) continue;
      const home = moduleOfLate.get(u.name);
      if (home && src && home !== src) STATE_NAMES.add(u.name);
    }
  }
}

// имена, к которым обращается начальный вид объявления
// ССЫЛКИ, ЧИТАЕМЫЕ ПРИ ВЫЧИСЛЕНИИ ОБЪЯВЛЕНИЯ — И ТОЛЬКО ОНИ.
//
// Имя внутри тела вложенной функции при инициализации НЕ ЧИТАЕТСЯ: оно
// сработает потом, когда функцию позовут, и к тому времени данные загружены.
// Прежняя проверка смотрела на весь начальный вид разом и потому откладывала
// таблицы, состоящие из одних ленивых замыканий. Замер: так напрасно уезжали
// в boot() metricDescriptions (456 строк), FilterModes (171), LoadingIndicator
// (57), PROFILE_METRICS (21) — а у последней автор САМ написал `() => …`,
// чтобы отложить чтение.
//
// Различать надо вычисляемость, а не наличие имени в тексте: METRIC_COVERAGE_FN
// ссылается на метрики ПРЯМО ('problem-generation': problemGenerationIndex),
// собирается при вычислении и потому откладывается по-прежнему.
const ФУНКЦИЯ = new Set(['FunctionExpression', 'FunctionDeclaration', 'ArrowFunctionExpression']);
function initRefs(e) {
  const out = new Set();
  if (!e.init) return out;
  (function walk(n) {
    if (!n || typeof n.type !== 'string') return;
    if (ФУНКЦИЯ.has(n.type)) return;          // тело сработает позже — не читаем
    if (n.type === 'Identifier') out.add(n.name);
    if (n.type === 'MemberExpression' && !n.computed) { walk(n.object); return; }
    if (n.type === 'Property' && !n.computed && n.key.type === 'Identifier') { walk(n.value); return; }
    for (const k of Object.keys(n)) {
      if (k === 'range') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c));
      else if (v && typeof v.type === 'string') walk(v);
    }
  })(e.init);
  return out;
}
// РАЗМЕТКА УЖЕ ЕСТЬ, КОГДА ИСПОЛНЯЮТСЯ ТЕЛА МОДУЛЕЙ. `<script type="module">`
// откладывается по стандарту и запускается после разбора документа, а сам
// скрипт к тому же стоит последней строкой перед </body>. Осторожность с
// document и window унаследована от одностраничной версии, где скрипт
// исполнялся посреди документа, — там она была нужна, здесь нет.
// localStorage, performance и navigator доступны и того раньше.
//
// d3 остаётся в списке, пока он подключён КЛАССИЧЕСКИМ скриптом: у такого
// нет ввоза, а значит нет и обещания, что он вычислится раньше. Перевод d3
// в ввоз — отдельный шаг, после него строка ниже опустеет вовсе.
const ENV = new Set();  // пусто: и разметка, и d3 приходят раньше тел модулей
// Встроенные: их наличие в начальном виде НЕ ДЕЛАЕТ значение зависимым.
const ВСТРОЕННЫЕ = new Set(['Set', 'Map', 'WeakMap', 'WeakSet', 'Array', 'Object',
  'Date', 'Math', 'JSON', 'Number', 'String', 'Boolean', 'Infinity', 'NaN', 'undefined']);
// Всё, что готово к моменту вычисления тела модуля: встроенное, окружение
// (разметка есть — скрипт модульный), d3 (ввезён), сырая база (ввезена) и
// производные указатели (строятся телом core/graph-index.js).
const ГОТОВОЕ = new Set([...ВСТРОЕННЫЕ,
  'window', 'document', 'localStorage', 'performance', 'navigator', 'console', 'd3',
  ...RAW_DATA, ...DERIVED]);

// отложено: трогает окружение, данные или другую отложенную ячейку.
// Считается до неподвижной точки — иначе `const ctx = gfxCanvas.getContext()`
// исполнится при ввозе модуля, когда gfxCanvas ещё пуст.
{
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of entities) {
      if (!e.name || e.decl === 'function' || e.decl === 'statement') continue;
      if (DATA_NAMES.has(e.name) || MET_NAMES.has(e.name) || VIEW_NAMES.has(e.name)) continue;
      if (STATE_NAMES.has(e.name)) continue;
      let defer = (e.decl === 'let' || e.decl === 'var') && !e.init;
      if (!defer) {
        for (const r of initRefs(e)) {
          // MET и VIEWS заполняются при исполнении тел модулей, поэтому
          // объявление, читающее их в начальном виде, тоже откладывается:
          // иначе METRIC_COVERAGE_FN соберётся из одних undefined.
          // СЫРАЯ БАЗА ЗДЕСЬ БОЛЬШЕ НЕ ПРИЧИНА: она ввезена в core/ns.js и
          // готова прежде всякого тела. А ПРОИЗВОДНЫЕ УКАЗАТЕЛИ — причина
          // по-прежнему: их строит buildIndexes() уже из сборки.
          if (ENV.has(r) || STATE_NAMES.has(r)
              || MET_NAMES.has(r) || VIEW_NAMES.has(r)) { defer = true; break; }
        }
      }
      if (defer) { STATE_NAMES.add(e.name); changed = true; }
    }
  }
}
for (const n of DATA_NAMES) STATE_NAMES.delete(n);
for (const n of MET_NAMES) STATE_NAMES.delete(n);

const nsOf = (n) => DATA_NAMES.has(n) ? 'DATA' : MET_NAMES.has(n) ? 'MET'
  : VIEW_NAMES.has(n) ? 'VIEWS' : STATE_NAMES.has(n) ? 'S' : null;

// ── карта модулей ──────────────────────────────────────────────────
const moduleOf = moduleOfLate;
// МОДУЛИ ЛЕЖАТ В modules/, а корень дерева — это само приложение: index.html,
// точка входа, сборка, стили, данные и поставляемое. Так корень сборки годится
// в корень публикации (Pages отдаёт ветку целиком), а «что здесь модуль»
// видно по пути, а не по памяти.
//
// Раскладка (assign_names.json) по-прежнему хранит имена БЕЗ приставки:
// modules/ — свойство дерева, а не решения человека, и переставить папку
// значит поправить эту функцию, а не 742 записи.
function modPath(mod) {
  if (mod === 'data/*.json') return 'modules/core/store.js';
  if (mod === 'main.js') return 'modules/boot-defs.js';   // main.js пишется отдельно
  return 'modules/' + mod;
}

// ── переименование ссылок ──────────────────────────────────────────
// собираем правки как {start,end,text}
const edits = [];
const declIdRanges = new Set();
for (const v of gs.variables) for (const def of v.defs) if (def.name) declIdRanges.add(def.name.range.join(':'));

// найти узел-родителя для сокращённой записи свойств
const shorthandKeys = new Set();
(function walk(n) {
  if (!n || typeof n.type !== 'string') return;
  if (n.type === 'Property' && n.shorthand && n.value && n.value.type === 'Identifier')
    shorthandKeys.add(n.value.range.join(':'));
  for (const k of Object.keys(n)) {
    if (k === 'range') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c));
    else if (v && typeof v.type === 'string') walk(v);
  }
})(ast);

for (const v of gs.variables) {
  const ns = nsOf(v.name);
  if (!ns) continue;
  for (const ref of v.references) {
    const id = ref.identifier;
    if (declIdRanges.has(id.range.join(':'))) continue;
    const key = id.range.join(':');
    const text = shorthandKeys.has(key) ? `${v.name}: ${ns}.${v.name}` : `${ns}.${v.name}`;
    edits.push({ start: id.range[0], end: id.range[1], text });
  }
}
edits.sort((a, b) => a.start - b.start);

// Пять мест зовут по склеенному имени через window[…]. В модулях это не
// работает вовсе, поэтому обращение переводится на нужное пространство имён.
const NS_DISPATCH = {
  modalContentFor: [[/window\[/g, 'VIEWS[']],
  installMetricScopeWrappers: [[/window\[/g, 'MET[']],
  toggleMetricVisualization: [[/window\[/g, 'MET[']],
};

// Единственный намеренный глобальный объект в window: не мост, а состояние
// выбора концепции с графа. Уезжает в S вместе с остальным изменяемым.
const WINDOW_PROPS = [[/\bwindow\.graphSelectionContext\b/g, 'S.graphSelectionContext']];

function render(from, to) {          // кусок исходника с применёнными правками
  let out = '', pos = from;
  for (const ed of edits) {
    if (ed.start < from || ed.end > to) continue;
    out += code.slice(pos, ed.start) + ed.text;
    pos = ed.end;
  }
  out += code.slice(pos, to);
  for (const [re_, to_] of WINDOW_PROPS) out = out.replace(re_, to_);
  return out;
}

// ── данные в JSON ──────────────────────────────────────────────────
// data/ — это БАЗА, а не модули: она лежит в корне дерева, рядом с index.html.
fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
{
  const parts = RAW_DATA.map(n => code.slice(byName.get(n).declNode.range[0], byName.get(n).range[1]) + ';');
  const script = parts.join('\n') + '\n' +
    `module.exports = {${RAW_DATA.join(',')}};`;
  fs.writeFileSync('/tmp/data_extract.cjs', script);
  const data = require('/tmp/data_extract.cjs');
  for (const n of RAW_DATA) {
    const текст = JSON.stringify(data[n], null, 1);
    // .json — база в человекочитаемом виде: её же пишет сохранение из
    // приложения, её же кладут в data/ вручную.
    fs.writeFileSync(path.join(OUT, 'data', n + '.json'), текст);
  }
}

// ── распределение текста по модулям ────────────────────────────────
const files = new Map();            // путь -> массив кусков
const bootChunks = [];              // {line, text}
// РАЗРЕШИМОСТЬ ЗНАЧЕНИЙ СЧИТАЕТСЯ ДО НЕПОДВИЖНОЙ ТОЧКИ.
//
// Значение ячейки можно вычислить в теле её модуля, если всё, на что оно
// ссылается, к тому времени готово. Готово: встроенное, окружение, d3, сырая
// база, производные указатели, ОБЫЧНЫЕ сущности чужих модулей (их приносит
// ввоз, а ввоз обещает порядок) — и ДРУГИЕ РАЗРЕШИМЫЕ ЯЧЕЙКИ, если поставить
// ввоз к их модулю ради порядка.
//
// Последнее и есть неподвижная точка: `spacingX = viewWidth / (cols + 1)`
// разрешимо ровно постольку, поскольку разрешимо `viewWidth`. Раньше такие
// цепочки целиком уходили в сборку.
// Имена пространств MET и VIEWS заполняются ТЕЛАМИ своих модулей. Значит они
// готовы ровно так же, как обычные сущности, — при условии ввоза ради порядка.
// Без него METRIC_COVERAGE_FN обязана была ждать сборки, хотя ничего, кроме
// порядка, ей не требовалось: обёртки области счёта ставятся много позже, при
// открытии окна статистики, и таблица захватывает необёрнутые метрики в любом
// случае — что из сборки, что из тела модуля.
const ДОМ_ПРОСТРАНСТВА = new Map(); // имя из MET/VIEWS → путь модуля-владельца
const ДОМ_ЯЧЕЙКИ = new Map();     // имя ячейки → путь модуля-владельца
const РАЗРЕШИМЫЕ = new Set();
{
  const ячейки = entities.filter(e => e.name && nsOf(e.name) === 'S' && e.init
                                   && e.decl !== 'statement' && e.decl !== 'function');
  const обычное = (r) => byName.has(r) && !nsOf(r);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of ячейки) {
      if (РАЗРЕШИМЫЕ.has(e.name)) continue;
      const ok = [...initRefs(e)].every(r =>
        ГОТОВОЕ.has(r) || обычное(r) || РАЗРЕШИМЫЕ.has(r)
        || ((MET_NAMES.has(r) || VIEW_NAMES.has(r)) && moduleOf.has(r)));
      if (ok) { РАЗРЕШИМЫЕ.add(e.name); changed = true; }
    }
  }
}

// ввозы РАДИ ПОРЯДКА, приписываемые модулю поверх обычных
const ВВОЗ_ПОРЯДКА = new Map();   // путь модуля → Set путей
const порядокРади = (мой, чужой) => {
  if (!чужой || чужой === мой) return;
  if (!ВВОЗ_ПОРЯДКА.has(мой)) ВВОЗ_ПОРЯДКА.set(мой, new Set());
  ВВОЗ_ПОРЯДКА.get(мой).add(чужой);
};

const add = (mod, text) => {
  const p = modPath(mod);
  if (!files.has(p)) files.set(p, []);
  files.get(p).push(text);
};

// Операторы, строящие производные указатели, — это все, что стоят ДО
// объявления links. Привязка к соседу устойчива к вставкам где угодно ещё,
// в отличие от перечня stmt001…stmt008.
// ОПЕРАТОР ВЕРХНЕГО УРОВНЯ ТОЖЕ МОЖЕТ ИМЕТЬ ДОМ.
//
// Раньше всякий такой оператор уходил в сборку, и единственным способом
// поселить его в модуле была правка ИСХОДНИКА — обёртка в именованную
// функцию. Это неверно по существу: исходник описывает предмет, а не
// обслуживает разбивку. Дом оператора — дело раскладки.
//
// КЛЮЧ: человекочитаемая метка + отпечаток текста.
//   document.addEventListener('keydown') @1f2e3a4b
// Метка нужна, чтобы запись в раскладке читалась без открывания исходника;
// отпечаток — чтобы ключ указывал ИМЕННО на этот оператор, а не на любой
// похожий (четыре разных addEventListener('click') на document различаются
// только текстом).
//
// ОТПЕЧАТОК СЧИТАЕТСЯ ОТ ТЕКСТА БЕЗ ПРОБЕЛОВ И КОММЕНТАРИЕВ: переносы и
// пояснения править можно, дом от этого не теряется. Правка САМОГО дела
// отпечаток меняет — и это верно: сборка тогда остановится и спросит, туда
// ли по-прежнему класть.
function ключОператора(текст) {
  const голый = текст
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const хеш = crypto.createHash('sha1').update(голый).digest('hex').slice(0, 8);
  let метка = голый.slice(0, 60);
  const m = голый.match(/^([\w.$]+(?:\([^)]{0,40}\))?(?:\.[\w$]+)?\s*\([^,)]{0,40})/);
  if (m) метка = m[1].replace(/\s+/g, ' ').trim() + ')';
  return `${метка} @${хеш}`;
}
// ИМЯ УСТАНОВКИ ОБЯЗАНО БЫТЬ НЕПОВТОРИМЫМ ВО ВС�ем ПРОЕКТЕ.
//
// Оно вывозится из модуля и ввозится сборкой наравне с прочими именами, а
// значит попадает в то же пространство: совпадение с любым из 742 имён даст
// либо затенение, либо негодный ввоз — и то и другое обнаружится далеко от
// причины. Проверяем на месте и падаем громко.
const взятыеИмена = new Set();
function проверитьИмяУстановки(имя, ключ) {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(имя)) {
    console.error(`установка «${имя}» (${ключ}): имя должно быть латинским идентификатором`);
    process.exit(1);
  }
  if (assignNames[имя]) {
    console.error(`установка «${имя}» (${ключ}): такое имя уже есть в раскладке — выберите другое`);
    process.exit(1);
  }
  if (взятыеИмена.has(имя)) {
    console.error(`установка «${имя}» (${ключ}): это имя уже занято другой установкой`);
    process.exit(1);
  }
  взятыеИмена.add(имя);
}

const домаОператоров = JSON.parse(fs.readFileSync(РАСКЛАДКА, 'utf8')).операторы || {};
const задетыеКлючи = new Set();

const УСТАНОВКИ = [];   // порождённые установки: имя → модуль
const границаИндекса = (byName.get('links') || { range: [0, 0] }).range[1];
const indexChunks = [];

// ДОМА РАЗРЕШИМЫХ ЯЧЕЕК — ДО ВЫПУСКА, А НЕ ПО ХОДУ. Иначе ячейка, выпущенная
// раньше той, на которую ссылается, осталась бы без ввоза ради порядка: в
// исходнике объявления идут сверху вниз, но полагаться на это нельзя.
for (const [имя] of byName)
  if (РАЗРЕШИМЫЕ.has(имя) && moduleOf.has(имя)) ДОМ_ЯЧЕЙКИ.set(имя, modPath(moduleOf.get(имя)));
for (const [имя] of byName)
  if ((MET_NAMES.has(имя) || VIEW_NAMES.has(имя)) && moduleOf.has(имя))
    ДОМ_ПРОСТРАНСТВА.set(имя, modPath(moduleOf.get(имя)));

for (const e of entities) {
  const mod = moduleOf.get(e.name || e.id);
  if (e.decl === 'statement') {
    const text = render(e.range[0], e.range[1]);
    // дом задан раскладкой — оператор уезжает в модуль, в сборке остаётся вызов
    const ключ = ключОператора(text);
    const домОп = домаОператоров[ключ];
    if (домОп) {
      задетыеКлючи.add(ключ);
      // Запись бывает двух видов: строка (только модуль) или объект с именем.
      // ИМЯ ДАЁТ ЧЕЛОВЕК: `install_<отпечаток>` уникально, но не говорит ничего
      // ни в модуле, ни в следе ошибки в консоли.
      const модОп = typeof домОп === 'string' ? домОп : домОп.модуль;
      const имяУст = (typeof домОп === 'object' && домОп.имя)
        ? домОп.имя : 'install_' + ключ.slice(ключ.lastIndexOf('@') + 1);
      проверитьИмяУстановки(имяУст, ключ);
      // add() САМА зовёт modPath — передавать ей уже готовый путь значит
      // навесить приставку дважды и разложить тела в modules/modules/…,
      // тогда как вывоз ссылается на правильный путь. Ошибка тихая: сборка
      // проходит, а проверка ввозов кричит «вывоз не определён».
      add(модОп, `// ${ключ}\nfunction ${имяУст}() {\n${text}\n}`);
      УСТАНОВКИ.push({ имя: имяУст, модуль: modPath(модОп) });
      bootChunks.push({ line: e.range[0], text: `${имяУст}();` });
      continue;
    }
    if (e.range[0] < границаИндекса) indexChunks.push(text);
    else bootChunks.push({ line: e.range[0], text });
    continue;
  }
  if (RAW_DATA.includes(e.name)) continue;                 // уехало в JSON
  const ns = nsOf(e.name);
  if (DERIVED.includes(e.name)) {
    indexChunks.push(`DATA.${e.name} = ` + render(e.init.range[0], e.init.range[1]) + ';');
    continue;
  }
  if (e.decl === 'function') {
    let body = render(e.range[0], e.range[1]);
    for (const [re_, to_] of (NS_DISPATCH[e.name] || [])) body = body.replace(re_, to_);
    if (ns) add(mod, `${ns}.${e.name} = ` + body.replace(/^(async\s+)?function\s+/, (s, a) => (a || '') + 'function ') + ';');
    else add(mod, body);
  } else {
    const init = e.init ? render(e.init.range[0], e.init.range[1]) : 'undefined';
    if (ns === 'S') {
      // НАЧАЛЬНОЕ ЗНАЧЕНИЕ ЖИВЁТ С ИМЕНЕМ, ЕСЛИ ОНО НИ ОТ ЧЕГО НЕ ЗАВИСИТ.
      // Ячейка попадает в S не только из-за отложенного вычисления, но и
      // потому, что в неё пишут из чужого модуля (useWeightedPaths правят и
      // paths/, и stats/). У такой ячейки значение — простой литерал, порядок
      // ему безразличен, а boot() он раздувал: 52 присваивания подряд.
      // Заодно раскладка перестаёт обещать модуль, которого сборка не создаёт:
      // приписка ячейки к модулю наконец даёт файл.
      // Всё, что читает данные или другую ячейку, по-прежнему уходит в boot.
      // РАЗРЕШИМО ЛИ ЗНАЧЕНИЕ ПРИ ВЫЧИСЛЕНИИ ТЕЛА. Раньше сюда пускались
      // только литералы, потому что больше ничего и не было готово. Теперь
      // готово почти всё: разметка есть, d3 ввезён, база ввезена, указатели
      // строятся телом graph-index, а ввоз ради порядка ставится выше.
      // Не готовы только ДРУГИЕ ЯЧЕЙКИ: порядок между чужими телами ничем
      // не обещан, и `spacingX = viewWidth / (cols + 1)` обязано ждать сборки.
      const refs = [...initRefs(e)];
      if (РАЗРЕШИМЫЕ.has(e.name)) {
        add(mod, `S.${e.name} = ${init};`);
        // ссылка на чужую ячейку разрешима только вместе с ввозом ради порядка
        for (const r of refs) {
          if (ДОМ_ЯЧЕЙКИ.has(r)) порядокРади(modPath(mod), ДОМ_ЯЧЕЙКИ.get(r));
          if (ДОМ_ПРОСТРАНСТВА.has(r)) порядокРади(modPath(mod), ДОМ_ПРОСТРАНСТВА.get(r));
        }
      } else {
        bootChunks.push({ line: e.range[0], text: `S.${e.name} = ${init};` });
      }
    } else if (ns) {
      add(mod, `${ns}.${e.name} = ${init};`);
    } else {
      add(mod, `${e.declNode.kind} ${e.name} = ${init};`);
    }
  }
}

// ОТЧЁТ ДЛЯ ЧЕЛОВЕКА: ключи всех операторов, оставшихся в сборке. Без него
// расселять их пришлось бы, выписывая отпечатки вручную.
if (process.env.PG_KEYS_REPORT) {
  console.error('\nоператоры, оставшиеся в сборке (ключ → впишите модуль в decisions/assign_names.json, раздел «операторы»):');
  for (const c of bootChunks) {
    if (/^install_[0-9a-f]{8}\(\);$/.test(c.text.trim())) continue;
    console.error('   ' + ключОператора(c.text));
  }
  console.error('');
}

// ГРОМКИЙ ОТКАЗ: ключ в раскладке есть, а такого оператора в исходнике нет.
// Молча вернуть оператор в сборку было бы худшим исходом: всё зелёное, а
// раскладка тихо перестала действовать. Отпечаток меняется при всякой правке
// самого дела — тогда сборка обязана остановиться и спросить.
{
  const потерянные = Object.keys(домаОператоров).filter(k => !задетыеКлючи.has(k));
  if (потерянные.length) {
    console.error('операторы: в раскладке есть, в исходнике нет —');
    for (const k of потерянные) console.error('   ' + k);
    console.error('Правился сам оператор? Тогда впишите новый ключ (он в отчёте ниже).');
    process.exit(1);
  }
}

// ── что каждый модуль должен ввозить ───────────────────────────────
const homeOf = new Map();           // имя -> модуль (для не-пространственных)
for (const e of entities) if (e.name && !nsOf(e.name) && !RAW_DATA.includes(e.name))
  homeOf.set(e.name, modPath(moduleOf.get(e.name)));

function importsFor(text, selfPath) {
  const need = new Map();           // модуль -> Set(имена)
  const ns = new Set();
  // Имя, помянутое в ПОЯСНЕНИИ, ввоза не требует: без этого
  // metrics/philosophical.js ввозил TENSION_WEIGHTS ради одной строки
  // комментария о том, что эта постоянная сохранена намеренно.
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  for (const [name, home] of homeOf) {
    if (home === selfPath) continue;
    if (new RegExp('(?<![.\\w$])' + name.replace(/\$/g, '\\$') + '(?![\\w$])').test(text)) {
      if (!need.has(home)) need.set(home, new Set());
      need.get(home).add(name);
    }
  }
  for (const n of ['DATA', 'S', 'MET', 'VIEWS'])
    if (new RegExp('(?<![.\\w$])' + n + '[.\\[]').test(text)) ns.add(n);
  return { need, ns };
}
function rel(from, to) {
  let r = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  if (!r.startsWith('.')) r = './' + r;
  return r;
}

// ── сборка файлов ──────────────────────────────────────────────────
const HEAD = '// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.\n';

// пространства имён
fs.mkdirSync(path.join(OUT, 'modules/core'), { recursive: true });
fs.writeFileSync(path.join(OUT, modPath('core/ns.js')), HEAD + `
// DATA   — данные и производные указатели
// S      — изменяемое состояние и отложенные ячейки
// MET    — метрики, к которым обращаются по имени
// VIEWS  — генераторы окон, к которым обращаются по имени
//
// БАЗА ЧИТАЕТСЯ ЗДЕСЬ, ДО ИСПОЛНЕНИЯ ЛЮБОГО ДРУГОГО ТЕЛА.
//
// Раньше она тянулась fetch-ем из сборки и появлялась ПОСЛЕ того как
// исполнились тела всех модулей, — оттого всё, что от неё считается,
// приходилось откладывать. Ожидание на верхнем уровне модуля даёт то же
// обещание, что и ввоз: всякий, кто ввозит ns.js, ждёт его завершения.
//
// Почему не \`import … with { type: 'json' }\`: признак свежий, Firefox до 138
// падает на нём ПРИ РАЗБОРЕ — не работает вообще ничего. Проверено на
// опубликованной странице.
// Почему не отдельные .js-модули с данными: база остаётся шестью .json —
// их пишет сохранение из приложения, их же кладут в data/ вручную. Заменишь
// способ чтения на .js — подложенный .json перестанет действовать молча.
const FILES = ${JSON.stringify(RAW_DATA)};
const loaded = await Promise.all(FILES.map(n =>
  fetch(new URL('../../data/' + n + '.json', import.meta.url))
    .then(r => {
      if (!r.ok) throw new Error('не читается ' + n + '.json: ' + r.status);
      return r.json();
    })));

export const DATA = Object.fromEntries(FILES.map((n, i) => [n, loaded[i]]));
export const S = {};
export const MET = {};
export const VIEWS = {};
`);

// загрузка данных
fs.mkdirSync(path.join(OUT, 'modules/data'), { recursive: true });
fs.writeFileSync(path.join(OUT, modPath('data/load.js')), HEAD + `
import { DATA } from '../core/ns.js';

// Загружать больше нечего: база ввезена в core/ns.js и готова до запуска.
// Имя сохранено, потому что его зовёт сборка, — и потому что оно честно
// отвечает на вопрос «база на месте?».
export async function loadData() { return DATA; }
`);

// производные указатели
{
  const body = indexChunks.join('\n\n');
  const { need, ns } = importsFor(body, 'core/graph-index.js');
  let head = HEAD + `import { ${[...ns, 'DATA'].filter((v, i, a) => a.indexOf(v) === i).join(', ')} } from './ns.js';\n`;
  for (const [mod, names] of need)
    head += `import { ${[...names].sort().join(', ')} } from '${rel(modPath('core/graph-index.js'), mod)}';\n`;
  const prev = files.get(modPath('core/graph-index.js')) || [];
  files.set(modPath('core/graph-index.js'), prev);
  fs.mkdirSync(path.join(OUT, 'modules/core'), { recursive: true });
  files.set(modPath('core/graph-index.js'), [...prev,
    `export function buildIndexes() {\n${body.split('\n').map(l => '  ' + l).join('\n')}\n}\n\n` +
    `// УКАЗАТЕЛИ ГОТОВЫ УЖЕ ЗДЕСЬ, а не из сборки. База ввезена в ns.js, значит\n` +
    `// строить их можно при вычислении этого тела — и тогда всякий, кто ввозит\n` +
    `// этот модуль, получает обещание: указатели на месте. Без такого обещания\n` +
    `// всё, что от них считается, приходилось откладывать в boot.\n` +
    `buildIndexes();`]);
}

// остальные модули
for (const [p, chunks] of files) {
  const body = chunks.join('\n\n');
  const { need, ns } = importsFor(body, p);
  let head = HEAD;
  if (ns.size) head += `import { ${[...ns].sort().join(', ')} } from '${rel(p, modPath('core/ns.js'))}';\n`;
  // d3 ВВОЗИТСЯ, А НЕ БЕРЁТСЯ ИЗ ОКНА. Классический скрипт не даёт обещания,
  // что вычислится раньше тела модуля, и потому всякое объявление, трогающее
  // d3, приходилось откладывать в boot. Ввоз такое обещание даёт.
  if (/(?<![.\w$])d3(?![\w$])/.test(body)) head += `import d3 from '${rel(p, 'vendor/d3.js')}';\n`;
  // ВВОЗ РАДИ ПОРЯДКА. Производные указатели строятся в теле graph-index;
  // модуль, читающий их при вычислении СВОЕГО тела, обязан исполниться позже.
  // Ввоз — единственное, что такое обещание даёт: `DATA` из ns.js о наполнении
  // мешка ничего не говорит.
  if (p !== modPath('core/graph-index.js') && new RegExp('DATA\\.(' + DERIVED.join('|') + ')\\b').test(body))
    head += `import '${rel(p, modPath('core/graph-index.js'))}';\n`;
  for (const чужой of [...(ВВОЗ_ПОРЯДКА.get(p) || [])].sort())
    head += `import '${rel(p, чужой)}';\n`;
  for (const [mod, names] of [...need].sort())
    head += `import { ${[...names].sort().join(', ')} } from '${rel(p, mod)}';\n`;
  // экспортируем всё своё непространственное
  const own = entities.filter(e => e.name && homeOf.get(e.name) === p).map(e => e.name)
    .concat(УСТАНОВКИ.filter(у => у.модуль === p).map(у => у.имя));
  const tail = own.length ? `\nexport { ${own.sort().join(', ')} };\n` : '';
  const full = head + '\n' + body + '\n' + tail;
  const fp = path.join(OUT, p);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, full);
}

// вспомогательное: события загрузки к моменту запуска уже прошли
fs.writeFileSync(path.join(OUT, modPath('core/ready.js')), HEAD + `
// Модульный сценарий откладывается, а запуск ещё и ждёт fetch, поэтому
// DOMContentLoaded и load к этому времени УЖЕ ПРОШЛИ, и подписка на них
// не сработает никогда. Эти две обёртки зовут обработчик сразу, если
// событие позади, и подписываются, если ещё нет.
export function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
export function onLoad(fn) {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn);
}
`);

// запуск
{
  bootChunks.sort((a, b) => a.line - b.line);
  let body = bootChunks.map(c => c.text).join('\n\n');
  body = body
    .replace(/document\.addEventListener\(\s*'DOMContentLoaded'\s*,\s*/g, 'onReady(')
    .replace(/window\.addEventListener\(\s*'load'\s*,\s*/g, 'onLoad(');
  const { need, ns } = importsFor(body, 'boot.js');
  let head = HEAD;
  head += `import { DATA, S, MET, VIEWS } from './${modPath('core/ns.js')}';\n`;
  if (/(?<![.\w$])d3(?![\w$])/.test(body)) head += `import d3 from './vendor/d3.js';\n`;
  head += `import { loadData } from './${modPath('data/load.js')}';\n`;
  // Ввоз ради ПОРЯДКА, а не ради имени: тело graph-index строит указатели,
  // и сборке довольно того, что оно исполнится раньше.
  head += `import './${modPath('core/graph-index.js')}';\n`;
  head += `import { onReady, onLoad } from './${modPath('core/ready.js')}';\n`;
  // Установки, порождённые из операторов с домом: сборка их только зовёт.
  for (const у of УСТАНОВКИ)
    head += `import { ${у.имя} } from '${rel('boot.js', у.модуль)}';\n`;
  for (const [mod, names] of [...need].sort())
    if (mod !== modPath('core/graph-index.js'))
      head += `import { ${[...names].sort().join(', ')} } from '${rel('boot.js', mod)}';\n`;
    else
      head += `import { ${[...names].sort().join(', ')} } from './${modPath('core/graph-index.js')}';\n`;
  fs.writeFileSync(path.join(OUT, 'boot.js'), head + `
export async function boot() {
  await loadData();
${body.split('\n').map(l => '  ' + l).join('\n')}
}
`);
}

// мост в разметку: остаётся ТОЛЬКО пока в разметке есть встроенные
// обработчики. После делегирования его снимает tools/unbridge.mjs.
{
  // Имена из атрибутов — и ЕЩЁ имена, которые разметка подставляет строкой.
  // modalActions пишет onclick="${saveFn}()", и в разборе разметки такого
  // имени не видно вовсе. Без этого saveConceptData и пять его товарищей
  // не попадают в мост, а нажатие «Сохранить» даёт ReferenceError.
  const строкой = mapJson.nameRefs
    .filter(r => byName.has(r.name) && byName.get(r.name).decl === 'function')
    .map(r => r.name);
  const fns = [...new Set([
    ...mapJson.markup.byName.filter(r => r.defined).map(r => r.name),
    ...строкой,
  ])];
  const vars = fns.filter(n => nsOf(n));
  const plain = fns.filter(n => !nsOf(n));
  const extra = ['nodes', 'links', 'concepts', 'relations', 'philosophers',
    'isStatsModalOpen', '_pcmpA', '_pcmpB', '_pairsKind', '_philPairsKind',
    '_pairsMinDegree', '_pairsMinShared', '_pairsCrossAuthor', '_pairsCrossTradition',
    'graphSelectionContext'].filter(n => byName.has(n) || DATA_NAMES.has(n));
  const need = new Map();
  for (const n of plain) {
    const home = homeOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  let head = HEAD + `// ДОЛГ. Выставляет в window то, что ещё зовёт разметка.\n` +
    `// Считается tools/bridge_debt.py, цель — ноль.\n` +
    `import { DATA, S, MET, VIEWS } from './core/ns.js';\n`;
  for (const [mod, names] of [...need].sort())
    head += `import { ${[...names].sort().join(', ')} } from '${rel('bridge.js', mod)}';\n`;
  let body = '\nexport function installBridge() {\n';
  for (const n of plain) if (homeOf.has(n)) body += `  window.${n} = ${n};\n`;
  for (const n of [...new Set([...vars, ...extra])]) {
    const ns = nsOf(n);
    if (!ns) continue;
    body += `  Object.defineProperty(window, '${n}', { configurable: true, ` +
      `get: () => ${ns}.${n}, set: v => { ${ns}.${n} = v; } });\n`;
  }
  body += '}\n';
  fs.writeFileSync(path.join(OUT, 'bridge.js'), head + body);
}

// точка входа
{
// Модули, которые только записывают себя в MET/VIEWS, никто не ввозит по
// имени — без явного ввоза их тело не исполнится и запись не случится.
const all = [...files.keys()].sort();
fs.writeFileSync(path.join(OUT, 'main.js'), HEAD + `
${all.map(p => `import './${p}';`).join('\n')}

import { boot } from './boot.js';
import { installBridge } from './bridge.js';

installBridge();          // ДОЛГ: пока разметка зовёт функции по имени
boot().catch(err => {
  console.error('запуск не удался:', err);
  const el = document.getElementById('filterStats');
  if (el) el.textContent = 'Ошибка запуска: ' + err.message;
});
`);
}

// index.html — разметка без скрипта; d3 переезжает из сети к себе
{
  fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });
  fs.copyFileSync(D3,
                  path.join(OUT, 'vendor/d3.min.js'));
  // Поставляемая сборка d3 — UMD: своих вывозов у неё нет, она кладёт себя
  // в globalThis. Обёртка превращает её в обычный модуль, и дальше d3
  // ничем не отличается от прочих зависимостей: ввоз есть — порядок обещан.
  fs.writeFileSync(path.join(OUT, 'vendor/d3.js'),
    "// Сгенерировано разбивкой: обёртка над UMD-сборкой d3.\n" +
    "import './d3.min.js';\nexport default globalThis.d3;\n");
  let html = src.slice(0, blk.i) + '  <script type="module" src="./main.js"></script>' +
    src.slice(blk.i + blk.all.length);
  // Классический скрипт убран совсем: d3 приходит ввозом из vendor/d3.js.
  html = html.replace(/\s*<script src="https:\/\/cdnjs\.cloudflare\.com[^"]*d3[^"]*"><\/script>/, '');
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
}

// перечень имён по пространствам — нужен переводу на делегирование:
// тела действий пишутся настоящим кодом, и `_pairsKind='profile'` из
// атрибута обязано стать `S._pairsKind='profile'`
{
  const ns = {};
  for (const n of DATA_NAMES) ns[n] = 'DATA';
  for (const n of MET_NAMES) ns[n] = 'MET';
  for (const n of VIEW_NAMES) ns[n] = 'VIEWS';
  for (const n of STATE_NAMES) ns[n] = 'S';
  fs.writeFileSync(path.join(OUT, 'namespaces.json'), JSON.stringify(ns, null, 1));
}

console.log('модулей записано:', files.size + 5,
  '| в boot:', bootChunks.length,
  '| DATA:', DATA_NAMES.size, '| S:', STATE_NAMES.size,
  '| MET:', MET_NAMES.size, '| VIEWS:', VIEW_NAMES.size);
