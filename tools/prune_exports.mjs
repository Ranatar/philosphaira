#!/usr/bin/env node
// Убирает из модулей ВЫВОЗ имён, которых никто не ввозит.
//
// Зачем. Разбивка вывозит все собственные имена подряд — иначе пришлось бы
// заранее знать, кому что понадобится. В итоге список вывоза перестаёт что-либо
// сообщать: из 203 вывезенных имён ввозились единицы, а прочие были шумом.
// Список вывоза должен читаться как «вот что модуль обещает наружу»; пока в нём
// всё подряд, обещания не отличить от внутренней кухни.
//
// Что НЕ убирается:
//   * имя, ввезённое хоть одним модулем, main.js или оснасткой _probe-rig.js;
//   * весь modules/dead.js — там вывоз есть ОПИСЬ СКЛАДА. Сущности лежат
//     ровно потому, что к ним никто не обращается; сняв вывоз, мы потеряли бы
//     и учёт (map_tree считает склад по вывозу), и смысл файла.
//
// Место в цепочке: ПОСЛЕ prune_imports.mjs. Тот убирает призрачные ввозы, и
// пока он не отработал, часть имён выглядит ввезённой, хотя ввоз призрачный.
// И ПОСЛЕ rig.mjs — оснастка обязана уже существовать, иначе её ввозы не
// увидены и приборы останутся без имён.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
import { ДЕРЕВО } from './paths.mjs';

const ROOT = process.argv[2] || ДЕРЕВО;
const СКЛАД = 'modules/dead.js';

const файлы = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (p.endsWith('.js')) файлы.push(p);
  }
})(ROOT);

const отн = p => path.relative(ROOT, p).split(path.sep).join('/');
const разобрать = t => acorn.parse(t, { ecmaVersion: 'latest', sourceType: 'module', ranges: true });

// ── сколько раз имя помянуто внутри своего модуля ───────────────────
// Ввоз и вывоз обращениями не считаются: в `export { a, b }` каждое имя даёт
// два узла-идентификатора, и без этой оговорки счёт врёт ровно на два.
function обращения(текст) {
  const счёт = new Map();
  (function обойти(у) {
    if (!у || typeof у.type !== 'string') return;
    if (у.type === 'ImportDeclaration') return;
    if (у.type === 'ExportNamedDeclaration' && !у.declaration) return;
    if (у.type === 'Identifier') счёт.set(у.name, (счёт.get(у.name) || 0) + 1);
    for (const k in у) {
      const v = у[k];
      if (Array.isArray(v)) v.forEach(обойти);
      else if (v && typeof v.type === 'string') обойти(v);
    }
  })(разобрать(текст));
  return счёт;
}

// ── кто что ввозит ──────────────────────────────────────────────────
// Ключ «модуль ▸ имя». Потребителями считаются ВСЕ файлы дерева, включая
// main.js и _probe-rig.js: оснастка — единственный мост к приборам, и её
// ввозы столь же настоящие, как ввозы приложения.
const ввезено = new Set();
for (const f of файлы) {
  const ast = разобрать(fs.readFileSync(f, 'utf8'));
  for (const n of ast.body) {
    if (n.type !== 'ImportDeclaration' || !n.source.value.startsWith('.')) continue;
    const цель = path.posix.normalize(path.posix.join(path.posix.dirname(отн(f)), n.source.value));
    for (const s of n.specifiers)
      if (s.type === 'ImportSpecifier') ввезено.add(`${цель} ▸ ${s.imported.name}`);
  }
}

// ── чистка ──────────────────────────────────────────────────────────
let убрано = 0, оставлено = 0, тронуто = 0;
const перечень = [], подНаблюдением = [];

// Мёртвое имя вывоза НЕ ЛИШАЕТСЯ. Сняв вывоз с имени, которое не работает и
// внутри своего модуля, мы спрятали бы его от map_tree: карта смотрит именно
// список вывоза, и «мёртвых сущностей» тут же стало бы ноль. Пробовал —
// searchNodes и graphSelectionContext исчезли из виду. Чистка убирает шум,
// а не улики: дом мёртвому имени назначает человек (modules/dead.js), и до
// тех пор оно остаётся на виду.
const мёртвоеЗдесь = (счёт, имя) => (счёт.get(имя) || 0) - 1 <= 0;

for (const f of файлы) {
  const rel = отн(f);
  if (rel === СКЛАД) continue;
  const текст = fs.readFileSync(f, 'utf8');
  const ast = разобрать(текст);
  const счёт = обращения(текст);
  const правки = [];                                  // {от, до, чем}

  for (const n of ast.body) {
    if (n.type === 'ExportDefaultDeclaration' || n.type === 'ExportAllDeclaration') {
      console.error(`${rel}: ${n.type} — такой вывоз программа не разбирает, чистка прекращена`);
      process.exit(1);
    }
    if (n.type !== 'ExportNamedDeclaration') continue;
    if (n.source) {
      console.error(`${rel}: «export … from» — такой вывоз программа не разбирает, чистка прекращена`);
      process.exit(1);
    }

    if (n.declaration) {                              // export function f / export const x
      const имена = n.declaration.id ? [n.declaration.id.name]
        : (n.declaration.declarations || []).map(d => d.id && d.id.name).filter(Boolean);
      if (!имена.length) {
        console.error(`${rel}: вывоз объявлением без имени — чистка прекращена`);
        process.exit(1);
      }
      const нужен = имена.some(и => ввезено.has(`${rel} ▸ ${и}`));
      if (нужен) { оставлено += имена.length; continue; }
      const мёртвые = имена.filter(и => мёртвоеЗдесь(счёт, и));
      if (мёртвые.length) {
        оставлено += имена.length;
        подНаблюдением.push(...мёртвые.map(и => `${rel} ▸ ${и}`));
        continue;
      }
      // снимаем только слово export, объявление остаётся местным
      правки.push({ от: n.range[0], до: n.declaration.range[0], чем: '' });
      убрано += имена.length;
      перечень.push(...имена.map(и => `${rel} ▸ ${и}`));
      continue;
    }

    const оставить = [], убрать = [];
    for (const s of n.specifiers) {
      if (s.type !== 'ExportSpecifier') {
        console.error(`${rel}: ${s.type} в списке вывоза — чистка прекращена`);
        process.exit(1);
      }
      if (s.local.name !== s.exported.name) {
        console.error(`${rel}: вывоз с переименованием «${s.local.name} as ${s.exported.name}» — чистка прекращена`);
        process.exit(1);
      }
      const имя = s.exported.name;
      if (ввезено.has(`${rel} ▸ ${имя}`)) { оставить.push(имя); continue; }
      if (мёртвоеЗдесь(счёт, имя)) {          // не работает и внутри — улика, оставляем
        оставить.push(имя);
        подНаблюдением.push(`${rel} ▸ ${имя}`);
        continue;
      }
      убрать.push(имя);
    }
    if (!убрать.length) { оставлено += оставить.length; continue; }
    убрано += убрать.length;
    оставлено += оставить.length;
    перечень.push(...убрать.map(и => `${rel} ▸ ${и}`));
    if (оставить.length) {
      правки.push({ от: n.range[0], до: n.range[1], чем: `export { ${оставить.join(', ')} };` });
    } else {
      // строка уходит целиком вместе со своим переводом строки
      let до = n.range[1];
      if (текст[до] === '\n') до++;
      let от = n.range[0];
      while (от > 0 && (текст[от - 1] === ' ' || текст[от - 1] === '\t')) от--;
      правки.push({ от, до, чем: '' });
    }
  }

  if (!правки.length) continue;
  let вышло = текст;
  for (const п of правки.sort((a, b) => b.от - a.от))
    вышло = вышло.slice(0, п.от) + п.чем + вышло.slice(п.до);
  fs.writeFileSync(f, вышло);
  тронуто++;
}

// ── проверка результата, а не намерения ─────────────────────────────
// Программа сама себе не судья: перечитываем дерево заново и убеждаемся, что
// каждый оставшийся ввоз по-прежнему находит своё имя. Молчаливо снятый
// нужный вывоз стоил бы отказа в браузере, а не при сборке.
const вывозит = new Map();
for (const f of файлы) {
  const ast = разобрать(fs.readFileSync(f, 'utf8'));
  const s = new Set();
  for (const n of ast.body) {
    if (n.type !== 'ExportNamedDeclaration') continue;
    if (n.declaration) {
      if (n.declaration.id) s.add(n.declaration.id.name);
      for (const d of n.declaration.declarations || []) if (d.id && d.id.name) s.add(d.id.name);
    }
    for (const sp of n.specifiers || []) s.add(sp.exported.name);
  }
  вывозит.set(отн(f), s);
}
let беда = 0;
for (const f of файлы) {
  const rel = отн(f);
  const ast = разобрать(fs.readFileSync(f, 'utf8'));
  for (const n of ast.body) {
    if (n.type !== 'ImportDeclaration' || !n.source.value.startsWith('.')) continue;
    const цель = path.posix.normalize(path.posix.join(path.posix.dirname(rel), n.source.value));
    if (!вывозит.has(цель)) continue;                 // данные и поставляемое — не наша забота
    for (const s of n.specifiers)
      if (s.type === 'ImportSpecifier' && !вывозит.get(цель).has(s.imported.name)) {
        console.error(`ПОСЛЕ ЧИСТКИ: ${rel} ввозит ${s.imported.name} из ${цель}, а там его больше нет`);
        беда++;
      }
  }
}
if (беда) {
  console.error(`чистка вывозов сняла ${беда} нужных имён — дерево негодно, пересоберите`);
  process.exit(1);
}

console.log(`вывозов снято: ${убрано} в ${тронуто} модулях; оставлено ${оставлено}` +
  ` (склад ${СКЛАД} не тронут)`);
if (подНаблюдением.length) {
  console.log(`оставлено на виду как мёртвое (вывоз снимать нельзя — исчезнет из карты): ${подНаблюдением.length}`);
  for (const и of подНаблюдением) console.log('  ' + и);
}
if (process.env.PG_EXPORTS_REPORT) for (const и of перечень) console.log('  ' + и);
