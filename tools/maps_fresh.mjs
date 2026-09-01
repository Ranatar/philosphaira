#!/usr/bin/env node
// Свежесть карт — проверкой, а не на глаз.
//
// Повод. Карты складываются по-разному, и устаревают они тоже по-разному:
//
//   assign_names.json  — раскладка. Устареть НЕЗАМЕТНО не может: новое имя
//                        останавливает сборку с перечнем.
//   globals_map_v3     — из неё разбивка берёт метрики, зовомые по имени,
//                        обработчики разметки (а из них — ячейки общего
//                        состояния) и имена для моста. Устареет — сборка
//                        соберётся, но пространства и состояние окажутся
//                        посчитаны по вчерашнему коду.
//   css_map.json       — описательная: её не читает НИКТО (главы разрезатель
//                        берёт из css_map.mjs). Значит, устареть может совсем
//                        молча — и это худший случай из трёх.
//   map_tree           — по собранному дереву; устаревает при каждой сборке.
//   mapping/module-spec.md  — то же.
//
// Отметка времени в сравнении не участвует: она различается всегда.
import fs from 'node:fs';
import { ДЕРЕВО, ИСХОДНИК } from './paths.mjs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Файл может лежать и рядом с набором, и в выкладке: ищем в обоих местах.
// Прибор, не нашедший файл, обязан сказать «не нашёл», а не «устарел» —
// первая же проба дала именно такую ложную тревогу.
const МЕСТА = [КОРЕНЬ, '/mnt/user-data/outputs'];
const есть = (...в) => {
  for (const м of МЕСТА) for (const x of в) {
    const п = path.join(м, x);
    if (fs.existsSync(п)) return п;
  }
  return path.join(КОРЕНЬ, в[в.length - 1]);
};



const ВРЕМ = '/tmp/свежесть';
fs.mkdirSync(ВРЕМ, { recursive: true });

// Сравнение устойчиво к порядку ключей — но НЕ ценой их потери. Первая
// попытка передавала список ключей вторым доводом JSON.stringify: он там
// работает ОТБОРОМ, и всё вложенное просто выпадало из сравнения. Прибор
// показывал «свежая» на нарочно испорченной карте — проверено.
const упорядочить = (з) => {
  if (Array.isArray(з)) return з.map(упорядочить);
  if (з && typeof з === 'object')
    return Object.fromEntries(Object.keys(з).sort().map(k => [k, упорядочить(з[k])]));
  return з;
};
const без = (о) => {
  const к = JSON.parse(JSON.stringify(о));
  if (к.meta) { delete к.meta.generated; delete к.meta.file; }   // путь и время — не содержание
  if (к.меры) delete к.меры.составлено;
  return JSON.stringify(упорядочить(к));
};

const карты = [
  { имя: 'mapping/globals_map_v3.json', как: ['map_globals.mjs', [ИСХОДНИК, path.join(ВРЕМ, 'g.json')]],
    новый: path.join(ВРЕМ, 'g.json'),
    зачем: 'из неё разбивка берёт метрики по имени, обработчики разметки и ячейки состояния' },
  { имя: 'mapping/css_map.json', как: ['css_map.mjs', [ИСХОДНИК, path.join(ВРЕМ, 'c.json')]],
    новый: path.join(ВРЕМ, 'c.json'),
    зачем: 'описательная; её не читает никто, поэтому устареет молча' },
  { имя: 'mapping/map_tree.json', как: ['map_tree.mjs', [ДЕРЕВО, path.join(ВРЕМ, 't.json')]],
    новый: path.join(ВРЕМ, 't.json'),
    зачем: 'по собранному дереву; устаревает при каждой сборке' },
];

let плохо = 0;
for (const к of карты) {
  const старый = path.join(КОРЕНЬ, к.имя);
  if (!fs.existsSync(старый)) {
    console.log(`? ${к.имя} — НЕ НАЙДЕНА (искал рядом с набором и в выкладке)`);
    плохо++; continue;
  }
  try {
    execFileSync('node', [path.join(КОРЕНЬ, 'tools', к.как[0]), ...к.как[1]], { stdio: 'pipe' });
  } catch (e) {
    console.log(`✗ ${к.имя} — пересобрать не удалось: ${String(e.message).split('\n')[0]}`);
    плохо++; continue;
  }
  const а = без(JSON.parse(fs.readFileSync(старый, 'utf8')));
  const б = без(JSON.parse(fs.readFileSync(к.новый, 'utf8')));
  if (а === б) console.log(`✓ ${к.имя} — свежая`);
  else { console.log(`✗ ${к.имя} — УСТАРЕЛА (${к.зачем})`); плохо++; }
}

// НАБОР ПОЗИЦИЙ — не карта, но устаревает так же молча. Пересчитывать его
// здесь нельзя (это шесть секунд отжига в браузере), да и незачем: у набора
// есть отпечаток базы, и достаточно сверить его с нынешней базой. Расходятся —
// значит после последней правки базы забыли `node tools/layout.mjs`, и
// страница будет каждый раз считать раскладку заново, теряя двадцать секунд.
{
  const файл = path.join(ДЕРЕВО, 'data', 'nodePositions.json');
  if (!fs.existsSync(файл)) {
    console.log('? data/nodePositions.json — НЕ НАЙДЕН (соберите дерево)');
    плохо++;
  } else {
    const набор = JSON.parse(fs.readFileSync(файл, 'utf8'));
    // Отпечаток считается ТЕМ ЖЕ правилом, что и на странице, — правило
    // одно и живёт в исходнике; здесь оно вынуто из него текстом, а не
    // переписано по образцу. Разъедется исходник — вынется другое.
    const телоИсх = fs.readFileSync(ИСХОДНИК, 'utf8');
    // Тело функции берётся по СЧЁТУ СКОБОК, а не по образцу «\n    }»:
    // внутри есть вложенные блоки, и образец обрывал функцию на первом же
    // из них — отпечаток выходил undefined, а сообщение винило базу.
    const тело = (имя) => {
      const r = new RegExp('function ' + имя + '\\(\\) \\{').exec(телоИсх);
      let гл = 0, i = r.index + r[0].length - 1;
      for (; i < телоИсх.length; i++) {
        const c = телоИсх[i];
        if (c === '{') гл++;
        else if (c === '}') { гл--; if (!гл) break; }
      }
      return телоИсх.slice(r.index, i + 1);
    };
    const м = [тело('graphFingerprint')];
    const дан = н => {
      const r = new RegExp('^[ \\t]*const ' + н + ' = ', 'm').exec(телоИсх);
      const от = r.index + r[0].length;
      let гл = 0, i = от;
      for (; i < телоИсх.length; i++) {
        const c = телоИсх[i];
        if (c === '[' || c === '{') гл++;
        else if (c === ']' || c === '}') { гл--; if (!гл) break; }
      }
      return телоИсх.slice(от, i + 1);
    };
    const код = `const concepts = ${дан('concepts')};\nconst relations = ${дан('relations')};\n`
      + м[0].replace('function graphFingerprint()', 'const f = function ()') + ';\nreturn f();';
    let свой;
    try { свой = new Function(код)(); }
    catch (e) { свой = null; }
    if (свой === null) {
      console.log('? nodePositions — отпечаток не вычислился, проверьте graphFingerprint');
      плохо++;
    } else if (набор.fingerprint === свой) {
      console.log('✓ data/nodePositions.json — свежий');
    } else {
      console.log(`✗ data/nodePositions.json — УСТАРЕЛ (в наборе ${набор.fingerprint}, у базы ${свой}); пересчитать: node tools/layout.mjs`);
      плохо++;
    }
  }
}

// спецификация модулей — текстом
{
  const старый = есть('mapping/module-spec.md');
  const новый = path.join(ВРЕМ, 'spec.md');
  execFileSync('node', [path.join(КОРЕНЬ, 'tools/gen_spec2.mjs'), ДЕРЕВО, новый], { stdio: 'pipe' });
  if (!fs.existsSync(старый)) {
    console.log('? mapping/module-spec.md — НЕ НАЙДЕНА (искал рядом с набором и в выкладке)');
    плохо++;
  } else {
    const свежа = fs.readFileSync(старый, 'utf8') === fs.readFileSync(новый, 'utf8');
    console.log(`${свежа ? '✓' : '✗'} mapping/module-spec.md — ${свежа ? 'свежая' : 'УСТАРЕЛА'}`);
    if (!свежа) плохо++;
  }
}

console.log(плохо ? `\nустаревших карт: ${плохо} — пересоберите их` : '\nвсе карты свежие');
process.exit(плохо ? 1 : 0);
