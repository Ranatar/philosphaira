#!/usr/bin/env node
// ИНВАРИАНТ «ИСХОДНИК ↔ ДЕРЕВО» (A-3 плана doc/plan-next.md).
//
// Утверждение одно: `app/` порождается из `source/philosophy_graph_v3.html`
// и НИЧЕГО СВОЕГО НЕ СОДЕРЖИТ. Правка, попавшая только в дерево, живёт до
// первой пересборки и исчезает молча; правка, попавшая только в исходник,
// не работает вовсе. И то и другое случалось.
//
//   node tools/checks/build_invariant.mjs            # проверить
//   node tools/checks/build_invariant.mjs --собрать  # пересобрать и проверить
//
// ЛОВУШКА, РАДИ КОТОРОЙ ЭТА ПРОГРАММА НАПИСАНА ИМЕННО ТАК. Наивная проверка
// «пересобрать и сравнить» ОПАСНА: remap.mjs стирает дерево ПЕРВЫМ делом, а
// останавливается на заслоне операторов ПОЗЖЕ. После неудачной сборки
// сравнивать было бы не с чем — и не во что вернуться. Поэтому зелёная
// копия снимается ДО первой команды и возвращается при любом исходе
// (build-ops.md, «Порядок работ» п. 1).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { КОРЕНЬ, ДЕРЕВО, программа } from '../paths.mjs';

const собрать = process.argv.includes('--собрать');

/** Отпечаток дерева: путь → sha256. Оснастка и следы приборов не в счёт. */
function отпечаток(корень) {
  const карта = new Map();
  const обойти = п => {
    for (const имя of fs.readdirSync(п).sort()) {
      const полный = path.join(п, имя);
      if (fs.statSync(полный).isDirectory()) { обойти(полный); continue; }
      // _ref-orig.html — эталонная сторона исходника, её кладёт make_ref.py
      // при приёмке; частью дерева она не является.
      if (имя === '_ref-orig.html') continue;
      карта.set(path.relative(корень, полный),
        crypto.createHash('sha256').update(fs.readFileSync(полный)).digest('hex'));
    }
  };
  обойти(корень);
  return карта;
}

function сличить(было, стало) {
  const пропало = [...было.keys()].filter(к => !стало.has(к));
  const появилось = [...стало.keys()].filter(к => !было.has(к));
  const изменилось = [...было.keys()]
    .filter(к => стало.has(к) && стало.get(к) !== было.get(к));
  return { пропало, появилось, изменилось };
}

const запас = fs.mkdtempSync(path.join(os.tmpdir(), 'дерево-зелёное-'));
fs.cpSync(ДЕРЕВО, запас, { recursive: true });
const было = отпечаток(запас);
console.log(`зелёная копия снята: ${было.size} файлов → ${запас}`);

let код = 0;
try {
  console.log('пересборка…');
  execFileSync('node', [программа('remap.mjs'), 'собрать'],
    { encoding: 'utf8', stdio: собрать ? 'inherit' : 'pipe', env: process.env });

  const стало = отпечаток(ДЕРЕВО);
  const { пропало, появилось, изменилось } = сличить(было, стало);
  const всего = пропало.length + появилось.length + изменилось.length;

  if (всего === 0) {
    console.log(`\n✓ ИНВАРИАНТ ДЕРЖИТСЯ: пересборка дала то же дерево, ${стало.size} файлов`);
  } else {
    код = 1;
    console.log(`\n✗ ДЕРЕВО И ИСХОДНИК РАЗОШЛИСЬ: расхождений ${всего}`);
    const показать = (имя, список) => {
      if (!список.length) return;
      console.log(`  ${имя} (${список.length}):`);
      for (const ф of список.slice(0, 12)) console.log('    ' + ф);
      if (список.length > 12) console.log(`    … и ещё ${список.length - 12}`);
    };
    показать('изменилось', изменилось);
    показать('пропало из дерева', пропало);
    показать('появилось в дереве', появилось);
    console.log('\nЧитается так: перечисленное есть в дереве, но НЕ следует из');
    console.log('исходника. Правку надо перенести в source/, а дерево получать');
    console.log('пересборкой — иначе она исчезнет при следующей же сборке.');
  }
} catch (e) {
  код = 1;
  console.log('\n✗ ПЕРЕСБОРКА НЕ ПРОШЛА — дерево возвращается из зелёной копии');
  console.log('  ' + String(e.message).split('\n').slice(0, 3).join('\n  '));
} finally {
  if (код !== 0 && !собрать) {
    // При проверке дерево обязано остаться таким, каким было: программа
    // измеряет, а не правит. При --собрать пересобранное оставляем.
    fs.rmSync(ДЕРЕВО, { recursive: true, force: true });
    fs.cpSync(запас, ДЕРЕВО, { recursive: true });
    console.log('  дерево возвращено');
  }
  fs.rmSync(запас, { recursive: true, force: true });
}
process.exit(код);
