#!/usr/bin/env node
// Перевод обработчиков разметки на делегирование.
//
// Что делает:
//  1. Ставит в дерево ui/actions.js (реестр действий) и ui/delegation.js
//     (четыре слушателя на document).
//  2. Переписывает атрибуты on* в имена действий: data-act-click и т. п.
//  3. Собирает ui/actions-<область>.js — тела действий с нужными ввозами.
//  4. Пишет actions_map.json: имя действия → исходный текст атрибута.
//     Он нужен приёмке, чтобы сверять обход с прежним перечнем.
//
// Работает заходами: сперва статическая разметка index.html, затем
// генераторы по одному. Обработчик, уже переведённый, второй раз не берётся.

import fs from 'node:fs';
import path from 'node:path';

// Пути — из одного места; см. tools/paths.mjs.
import { ДЕРЕВО } from './paths.mjs';

const ROOT = process.argv[2] || ДЕРЕВО;
const ЗАХОД = process.argv[3] || 'static';

// ── что где вывозится ───────────────────────────────────────────────
const exportsOf = new Map();      // имя -> путь модуля
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (!p.endsWith('.js')) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/^export \{([^}]*)\};?$/gm))
      for (const n of m[1].split(',').map(s => s.trim()).filter(Boolean))
        exportsOf.set(n, rel);
    for (const m of text.matchAll(/^export (?:async )?function (\w+)/gm))
      exportsOf.set(m[1], rel);
    for (const m of text.matchAll(/^export const (\w+)/gm))
      exportsOf.set(m[1], rel);
  }
})(ROOT);
const NS = ['DATA', 'S', 'MET', 'VIEWS'];
// имя → пространство: в атрибуте написано `_pairsKind='profile'`, а в
// настоящем коде это поле общего состояния
const nsOfName = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'namespaces.json'), 'utf8')); }
  catch (e) { return {}; }
})();

// ── имена действий ──────────────────────────────────────────────────
const mapFile = path.join(ROOT, 'actions_map.json');
const карта = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : {};
// Ключ — ПАРА «событие + код»: у поля поиска легенды один и тот же код
// висит и на oninput, и на onfocus, и это два разных обработчика.
const поИсходному = new Map(Object.entries(карта).map(([k, v]) => [v.attr + ' :: ' + v['код'], k]));

// Один и тот же обработчик встречается и в статической разметке, и в
// генераторах (например «Закрыть»). Имя ему даётся ОДНО, но тело
// записывается в реестр ОДИН РАЗ — иначе реестр справедливо ругается на
// занятое имя. Признак «уже был» возвращается вместе с именем.
function имяДействия(attr, code) {
  const было = поИсходному.get(attr + ' :: ' + code);
  if (было) return было;
  // читаемое имя из первого вызова: openStatsModal() -> open-stats-modal.
  // ТОЛЬКО ЛАТИНИЦА: кириллическое имя сюда не попадёт, и действие получит
  // имя атрибута («onclick»), слившись с любым другим таким же. Поэтому то,
  // что зовётся ИЗ РАЗМЕТКИ, называется латиницей — проверка модулей это
  // ловит, но лучше знать заранее.
  const m = code.match(/([A-Za-z_$][\w$]*)\s*\(/);
  let base = (m ? m[1] : attr).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  if (attr !== 'onclick') base += '-' + attr.slice(2);   // -input, -focus, -change
  let name = base, i = 2;
  while (карта[name]) name = base + '-' + i++;
  return name;
}

// ── превращение тела ────────────────────────────────────────────────
// `${…}` в атрибуте — это подстановка; она уезжает в data-атрибут,
// а в теле остаётся чтение el.dataset.aN. Кавычки вокруг подстановки
// снимаются: значение и так строка.
function разобрать(code) {
  const args = [];
  // 1. Подстановки под пометки. Подстановка бывает ЦЕЛЫМ доводом ('${id}')
  //    и ЧАСТЬЮ строки ('phil-internal-${id}') — второе станет шаблонной.
  let t = code.replace(/\$\{([^}]*)\}/g, (all, выр) => {
    args.push(выр);
    return '\u0000' + args.length + '\u0000';
  });
  t = t.replace(/'([^']*)'/g, (all, внутри) => {
    if (!внутри.includes('\u0000')) return all;
    const цел = внутри.match(/^\u0000(\d+)\u0000$/);
    if (цел) return `el.dataset.a${цел[1]}`;
    return '`' + внутри.replace(/\u0000(\d+)\u0000/g,
      (x, n) => '${el.dataset.a' + n + '}') + '`';
  });
  t = t.replace(/\u0000(\d+)\u0000/g, (x, n) => `el.dataset.a${n}`);

  // 2. Строковые постоянные ПРЯЧУТСЯ: приставка пространства имён и
  //    подмена this/event не должны залезать внутрь строк, иначе
  //    toggleSection('rubrics') превращается в toggleSection('DATA.rubrics').
  const прятки = [];
  t = t.replace(/`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, (x) => {
    прятки.push(x);
    return '\u0001' + (прятки.length - 1) + '\u0001';
  });

  t = t
    .replace(/(?<![.\w$])([A-Za-z_$][\w$]*)(?![\w$])/g, (n) =>
      nsOfName[n] ? nsOfName[n] + '.' + n : n)
    .replace(/(?<![.\w$])this\.value(?![\w$])/g, 'el.value')
    .replace(/(?<![.\w$])this\.checked(?![\w$])/g, 'el.checked')
    .replace(/(?<![.\w$])this\.style(?![\w$])/g, 'el.style')
    .replace(/(?<![.\w$])this(?![\w$])/g, 'el')
    .replace(/(?<![.\w$])event(?![\w$])/g, 'ev');

  const body = t.replace(/\u0001(\d+)\u0001/g, (x, n) => прятки[n]);
  return { body: body.trim().replace(/;$/, ''), args };
}

function нужныеИмена(body) {
  const need = new Map(), ns = new Set();
  for (const m of body.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)(?![\w$])/g)) {
    const n = m[1];
    if (NS.includes(n)) { ns.add(n); continue; }
    const home = exportsOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  return { need, ns };
}

// ПУТЬ ВНУТРИ ДЕРЕВА СЧИТАЕТСЯ ОДНОЙ ФУНКЦИЕЙ.
//
// Их было три: своя в каждом генераторе действий, и каждая по-своему угадывала,
// лежит ли цель под modules/. При переезде модулей две дали «../modules/…», а
// третья «../../core/…» — пути синтаксически безупречные и ведущие в никуда;
// поймала их только проверка ввозов.
//
// Отсюда правило: цель может прийти ИМЕНЕМ МОДУЛЯ (`modal/persist.js`) или уже
// путём в дереве (`modules/modal/persist.js`) — приставка навешивается ровно
// один раз, и функция от повторного вызова не портится.
function вДереве(откуда, куда) {
  const цель = куда.startsWith('modules/') ? куда : 'modules/' + куда;
  let r = path.relative(path.dirname(откуда), цель).replace(/\\/g, '/');
  return r.startsWith('.') ? r : './' + r;
}

// ── постоянная оснастка ─────────────────────────────────────────────
const HEAD = '// Сгенерировано tools/delegate.mjs — правки вносить туда.\n';
// Оснастка делегирования — такие же модули, как прочие: под modules/.
fs.mkdirSync(path.join(ROOT, 'modules/ui'), { recursive: true });

fs.writeFileSync(path.join(ROOT, 'modules/ui/actions.js'), HEAD + `
// Реестр действий разметки. Разметка несёт ИМЯ ACTIONS, а не name функции,
// поэтому глобальное пространство имён ей больше не нужно.
//
// Промах по имени ОБЯЗАН шуметь: это единственное, чем делегирование хуже
// встроенного обработчика — строка data-act-click="открыть-концепцию"
// молчаливее, чем onclick="openUniversalModal(…)". Молчаливых отказов в
// этом приложении already было довольно.
const ACTIONS = new Map();

export function registerActions(map) {
  for (const name of Object.keys(map)) {
    if (ACTIONS.has(name)) console.error('делегирование: name действия занято —', name);
    ACTIONS.set(name, map[name]);
  }
}

export function runAction(name, el, ev) {
  const fn = ACTIONS.get(name);
  if (!fn) { console.error('делегирование: неизвестное действие —', name, el); return; }
  try { return fn(el, ev); }
  catch (e) { console.error('делегирование: действие «' + name + '» упало —', e); }
}

export function actionNames() { return [...ACTIONS.keys()]; }
`);

fs.writeFileSync(path.join(ROOT, 'modules/ui/delegation.js'), HEAD + `
import { runAction } from './actions.js';

// Четыре слушателя на document — больше не нужно.
//   click, change, input   — всплывают;
//   focus НЕ всплывает, поэтому focusin.
// Разметка перерисовывается сорока генераторами, и делегированию это
// родная задача: обработчики не приходится возвращать после перерисовки.
const EVENTS = [['click', 'click'], ['change', 'change'],
                 ['input', 'input'], ['focusin', 'focus']];

// mouseenter и mouseleave НЕ ВСПЛЫВАЮТ — делегировать их напрямую нельзя.
// Но всплывающие mouseover и mouseout дают ровно ту же семантику, если
// отбросить переходы ВНУТРИ элемента: вход считается, только когда курсор
// пришёл извне, выход — только когда ушёл наружу. Это стандартная замена,
// и она снимает последнюю нужду в глобальном имени.
const BOUNDS = [['mouseover', 'enter'], ['mouseout', 'leave']];

// Подмена window.event на время действия.
//
// Часть кода читает НЕЯВНОЕ ГЛОБАЛЬНОЕ event и берёт из него currentTarget
// (так устроен toggleSection: const header = event.currentTarget). При
// встроенном обработчике currentTarget — сам элемент; при делегировании —
// document, потому что слушатель висит на нём. Поэтому на время вызова
// window.event подменяется прослойкой, у которой currentTarget — тот
// элемент, что нёс name действия. Всё прочее берётся у настоящего события.
function withEventSwap(ev, el, handler) {
  const own = Object.getOwnPropertyDescriptor(window, 'event');
  const layer = new Proxy(ev, {
    get: function (t, p) {
      if (p === 'currentTarget') return el;
      var v = t[p];
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
  Object.defineProperty(window, 'event', { configurable: true, value: layer });
  try { return handler(layer); }
  finally {
    if (own) Object.defineProperty(window, 'event', own);
    else delete window.event;      // вернуть встроенный доступ через прототип
  }
}

export function installDelegation(root = document) {
  for (const [event, flag] of BOUNDS) {
    root.addEventListener(event, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + flag + ']');
      if (!el) return;
      // переход внутри самого элемента границей не считается
      const other = ev.relatedTarget;
      if (other && el.contains(other)) return;
      withEventSwap(ev, el, layer =>
        runAction(el.getAttribute('data-act-' + flag), el, layer));
    });
  }
  for (const [event, flag] of EVENTS) {
    root.addEventListener(event, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + flag + ']');
      if (!el) return;
      withEventSwap(ev, el, layer =>
        runAction(el.getAttribute('data-act-' + flag), el, layer));
    });
  }
}
`);

// ── заход по статической разметке ───────────────────────────────────
const ATTR = /\bon(click|change|input|focus|mouseover|mouseout|mouseenter|mouseleave)\s*=\s*"([^"]*)"/gi;
const ПРИЗНАК = { click: 'click', change: 'change', input: 'input', focus: 'focus',
                  mouseenter: 'enter', mouseleave: 'leave' };

let переведено = 0, оставлено = 0;
const новые = [];

if (ЗАХОД === 'static') {
  const p = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(ATTR, (all, ev, code) => {
    const attr = 'on' + ev.toLowerCase();
    const признак = ПРИЗНАК[ev.toLowerCase()];
    if (!признак) { оставлено++; return all; }      // наведение — забота стилей
    const { body, args } = разобрать(code);
    const имя = имяДействия(attr, code);
    карта[имя] = { код: code, attr, тело: body, аргументов: args.length, откуда: 'index.html' };
    новые.push(имя);
    переведено++;
    return `data-act-${признак}="${имя}"`;
  });
  fs.writeFileSync(p, html);
}

// ── ручная статья: modalActions ─────────────────────────────────────
// Единственное место, которое механически не переводится: в разметку
// подставляется НЕ ДАННОЕ, а ИМЯ ФУНКЦИИ и кусок исходного кода
// (`onclick="${saveFn}()"`, deleteArg = "'c1'" или "'a', 'b'"). При
// делегировании name функции ничего не значит, а куску кода взяться неоткуда.
// Поэтому три места правятся явно: args передаются НАБОРОМ ЗНАЧЕНИЙ,
// а вызов идёт через таблицу имён с руганью на промах.
// ИСКАТЬ НАДО ПО ОБЪЯВЛЕНИЮ В ДЕРЕВЕ, А НЕ ПО ВЫВОЗУ: сущности пространств
// (VIEWS.generateConceptEditContent и подобные) поимённо НЕ ВЫВОЗЯТСЯ, и
// exportsOf их не знает. Первая попытка опереться на вывоз молча пропустила
// три правки из пяти — удаление сущности перестало работать, а поймал это
// только probe6.
let беда = false;
function модульСущности(name) {
  const re = new RegExp(
    `(?:^|\\n)\\s*(?:async\\s+)?(?:function|const|let|var)\\s+${name}\\b` +
    `|(?:^|\\n)\\s*(?:DATA|S|MET|VIEWS)\\.${name}\\s*=`);
  for (const f of файлыДерева()) {
    if (re.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))) return f;
  }
  return null;
}
function файлыДерева(д = '') {
  const из = [];
  for (const n of fs.readdirSync(path.join(ROOT, д))) {
    const отн = д ? д + '/' + n : n;
    if (fs.statSync(path.join(ROOT, отн)).isDirectory()) {
      if (n !== 'vendor' && n !== 'css' && n !== 'data') из.push(...файлыДерева(отн));
    } else if (n.endsWith('.js')) из.push(отн);
  }
  return из;
}

// МЕСТО ИЩЕТСЯ ПО ИМЕНИ СУЩНОСТИ, А НЕ ПО ПУТИ К ФАЙЛУ. Зашитый путь
// превращает всякое переименование модуля в поломку сборки: переименование
// modal/edit-common.js в modal/form-buttons.js уронило этот шаг с ENOENT.
// Модуль сущности берётся из вывозов дерева — из того же места, откуда его
// берёт всё остальное в этой программе.
function ручнаяСтатья() {
  const правки = [
    ['modalActions',
     'onclick="${saveFn}()"',
     'data-act-click="сохранить-сущность" data-a1="${saveFn}"'],
    ['modalActions',
     'onclick="${deleteFn}(${deleteArg})"',
     'data-act-click="удалить-сущность" data-a1="${deleteFn}"' +
     ' data-a2="${(deleteArg || [])[0] || \'\'}" data-a3="${(deleteArg || [])[1] || \'\'}"'],
    ['generateConceptEditContent',
     "conceptData && conceptData.id ? `'${conceptData.id}'` : 'null'",
     'conceptData && conceptData.id ? [conceptData.id] : []'],
    ['generateConnectionEditContent',
     "(srcId && tgtId) ? `'${srcId}', '${tgtId}'` : ''",
     '(srcId && tgtId) ? [srcId, tgtId] : []'],
    ['generatePhilosopherEditContent',
     "philosopherData ? `'${escapeAttr(philosopherName)}'` : 'null'",
     'philosopherData ? [philosopherName] : []'],
  ];
  for (const [сущность, было, стало] of правки) {
    const файл = модульСущности(сущность);
    if (!файл) { console.error('ручная статья: НЕ НАЙДЕНА сущность', сущность); беда = true; continue; }
    const q = path.join(ROOT, файл);
    let t = fs.readFileSync(q, 'utf8');
    if (t.includes(стало)) continue;
    if (!t.includes(было)) { console.error('ручная статья не нашла место:', файл, было.slice(0, 50)); continue; }
    fs.writeFileSync(q, t.replace(было, стало));
  }
}
ручнаяСтатья();
// ОТКАЗ ДОЛЖЕН БЫТЬ ГРОМКИМ: пропущенная правка не ломает сборку и не мешает
// странице открыться — ломается только удаление сущности, и увидит это лишь
// probe6. Поэтому останавливаемся здесь.
if (беда) { console.error('ручная статья не применена целиком — сборка остановлена'); process.exit(1); }

// таблица «имя функции → сама функция»: нужна только этой статье
{
  const имена = ['saveConceptData', 'savePhilosopherData', 'saveConnectionData',
                 'deleteConcept', 'deletePhilosopher', 'deleteConnection'];
  const need = new Map();
  for (const n of имена) {
    const home = exportsOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  let out = HEAD + `import { registerActions } from './actions.js';\n`;
  for (const m of [...need.keys()].sort())
    out += `import { ${[...need.get(m)].sort().join(', ')} } from '${вДереве('modules/ui/actions-byname.js', m)}';\n`;
  out += `
// Кнопки «Сохранить» и «Удалить» в формах правки: name обработчика приходит
// из данных, потому что одна и та же полоса кнопок обслуживает концепции,
// философов и связи. Промах по имени — ошибка, а не тишина.
const BY_NAME = { ${имена.join(', ')} };

function callByName(name, ...args) {
  const fn = BY_NAME[name];
  if (!fn) { console.error('делегирование: нет функции по имени —', name); return; }
  return fn(...args.filter(d => d !== undefined && d !== ''));
}

registerActions({
  'сохранить-сущность': (el) => callByName(el.dataset.a1),
  'удалить-сущность': (el) => callByName(el.dataset.a1, el.dataset.a2, el.dataset.a3),
});
`;
  fs.writeFileSync(path.join(ROOT, 'modules/ui/actions-byname.js'), out);
  карта['сохранить-сущность'] = { attr: 'onclick', поимённо: 'save', тело: '', аргументов: 1, откуда: 'ручная статья' };
  карта['удалить-сущность'] = { attr: 'onclick', поимённо: 'delete', тело: '', аргументов: 3, откуда: 'ручная статья' };
  const mp = path.join(ROOT, 'main.js');
  let main = fs.readFileSync(mp, 'utf8');
  if (!main.includes("'./modules/ui/actions-byname.js'"))
    fs.writeFileSync(mp, main.replace(/^import \{ boot \}/m,
      "import './modules/ui/actions-byname.js';\nimport { boot }"));
}

// ── заход по порождаемой разметке ───────────────────────────────────
// Атрибуты живут в шаблонных строках сорока генераторов. Подстановки
// `${…}` уезжают в data-атрибуты, а тело действия читает их из dataset.
// Кавычки вокруг подстановки снимаются: значение и так строка.
const ATTR_JS = /\bon(click|change|input|focus|mouseenter|mouseleave)\s*=\s*(\\?")((?:[^"\\]|\\.)*?)\2/g;

if (ЗАХОД === 'dyn') {
  const files = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const q = path.join(d, f);
      if (fs.statSync(q).isDirectory()) { if (f !== 'vendor') walk(q); continue; }
      if (q.endsWith('.js') && !f.startsWith('_ref')) files.push(q);
    }
  })(ROOT);

  for (const q of files) {
    const rel = path.relative(ROOT, q).replace(/\\/g, '/');
    if (rel.startsWith('modules/ui/actions')) continue;
    let text = fs.readFileSync(q, 'utf8');
    let changed = false;
    text = text.replace(ATTR_JS, (all, ev, кав, code) => {
      const attr = 'on' + ev.toLowerCase();
      const flag = ПРИЗНАК[ev.toLowerCase()];
      if (!flag) { оставлено++; return all; }
      const clean = code.replace(/\\"/g, '"').replace(/\\'/g, "'");
      const { body, args } = разобрать(clean);
      const name = имяДействия(attr, clean);
      const already = карта[name] !== undefined;
      карта[name] = { код: clean, attr, тело: body, аргументов: args.length, откуда: rel };
      поИсходному.set(attr + ' :: ' + clean, name);
      if (!already) новые.push(name);
      переведено++;
      changed = true;
      let out = `data-act-${flag}=${кав}${name}${кав}`;
      args.forEach((выр, i) => { out += ` data-a${i + 1}=${кав}\${${выр}}${кав}`; });
      return out;
    });
    if (changed) fs.writeFileSync(q, text);
  }
}

// ── сборка модуля с телами ──────────────────────────────────────────
const file = `modules/ui/actions-${ЗАХОД}.js`;
if (новые.length) {
  const need = new Map(), ns = new Set();
  for (const name of новые) {
    const r = нужныеИмена(карта[name].тело);
    for (const [m, s] of r.need) {
      if (!need.has(m)) need.set(m, new Set());
      s.forEach(x => need.get(m).add(x));
    }
    r.ns.forEach(x => ns.add(x));
  }
  const rel = to => вДереве(file, to);
  let out = HEAD + `import { registerActions } from './actions.js';\n`;
  if (ns.size) out += `import { ${[...ns].sort().join(', ')} } from '${rel('core/ns.js')}';\n`;
  for (const m of [...need.keys()].sort())
    out += `import { ${[...need.get(m)].sort().join(', ')} } from '${rel(m)}';\n`;
  out += `\nregisterActions({\n`;
  for (const name of новые)
    out += `  ${JSON.stringify(name)}: (el, ev) => { ${карта[name].тело}; },\n`;
  out += `});\n`;
  fs.writeFileSync(path.join(ROOT, file), out);
}

// ── подключение в main.js: по НАЛИЧИЮ ФАЙЛА, а не по числу новых имён ─
// Прежде этот блок стоял под `if (новые.length)`. Стоило дереву уцелеть от
// прошлой сборки — и `actions_map.json` отдавал все имена уже известными:
// новых ноль, блок пропущен, ввоз в точку входа не поставлен. Реестр терял
// 111 действий из 206, и ни одна проверка строения этого не замечала.
// Наличие файла — вопрос о неизменном; число новых имён — о ходе прогона.
if (переведено && !fs.existsSync(path.join(ROOT, file))) {
  console.error(`delegate: переведено ${переведено} атрибутов, а модуля ${file} нет.`);
  console.error('Сборка прекращена: тела действий негде взять.');
  process.exit(1);
}
if (fs.existsSync(path.join(ROOT, file))) {
  const mp = path.join(ROOT, 'main.js');
  let main = fs.readFileSync(mp, 'utf8');
  if (!main.includes(`'./${file}'`))
    main = main.replace(/^import \{ boot \}/m, `import './${file}';\nimport { boot }`);
  if (!main.includes('installDelegation'))
    main = main.replace(/^import \{ boot \}/m,
      `import { installDelegation } from './modules/ui/delegation.js';\nimport { boot }`);
  if (!main.includes('installDelegation()'))
    main = main.replace(/^installBridge\(\);.*$/m,
      'installDelegation();      // делегирование: разметка несёт имя действия\n$&');
  fs.writeFileSync(mp, main);
  if (!fs.readFileSync(mp, 'utf8').includes(`'./${file}'`)) {
    console.error(`delegate: ${file} есть, а ввоза в main.js не появилось — якорь «import { boot }» не найден.`);
    process.exit(1);
  }
}

fs.writeFileSync(mapFile, JSON.stringify(карта, null, 1));
console.log(`заход «${ЗАХОД}»: переведено ${переведено}, оставлено ${оставлено}, ` +
  `всего в реестре ${Object.keys(карта).length}`);
