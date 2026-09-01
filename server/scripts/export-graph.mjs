#!/usr/bin/env node
// Обратная выгрузка: шесть JSON в том же виде, в каком их пишет приложение.
//
//   node scripts/export-graph.mjs <папка назначения>

import fs from 'node:fs';
import path from 'node:path';
import { createPool } from '../src/db/pool.js';
import { exportSet, asAppWrites } from '../src/db/graph.js';
import { currentLayout } from '../src/db/layout.js';
import { SET_NAMES } from '../src/graph/schema.js';

const папка = process.argv[2];
if (!папка) { console.error('укажите папку назначения'); process.exit(1); }
fs.mkdirSync(папка, { recursive: true });

const pool = createPool();
try {
  for (const имя of SET_NAMES) {
    const записи = await exportSet(pool, имя);
    fs.writeFileSync(path.join(папка, имя + '.json'), asAppWrites(записи));
    console.log(`  ${имя.padEnd(14, '.')} ${записи.length}`);
  }
  // Раскладка выгружается седьмым набором, в том же виде, в каком её ждёт
  // страница: отпечаток плюс координаты. Отпечаток берётся из семени, если
  // оно рядом, — сервер его не считает и считать не должен: правило живёт
  // в исходнике, а второй его список однажды разъедется с первым.
  const раскладка = await currentLayout(pool);
  if (раскладка) {
    // ПОРЯДОК КЛЮЧЕЙ БЕРЁТСЯ У КОНЦЕПЦИЙ, а не у JSONB: база порядок вставки
    // не хранит, и без этого выгрузка не совпадала с семенем побайтово —
    // при том что координаты до одной совпадали. Проверка развёртывания
    // сверяет именно байты, и правильно делает: набор читает страница, а
    // не человек.
    const порядок = await exportSet(pool, 'concepts');
    const позиции = {};
    for (const к of порядок) if (раскладка.позиции[к.id]) позиции[к.id] = раскладка.позиции[к.id];
    for (const [id, xy] of Object.entries(раскладка.позиции))
      if (!(id in позиции)) позиции[id] = xy;
    fs.writeFileSync(path.join(папка, 'nodePositions.json'),
      JSON.stringify({ fingerprint: раскладка.отпечаток ?? '', nodes: позиции }, null, 1));
    console.log(`  ${'nodePositions'.padEnd(14, '.')} ${Object.keys(раскладка.позиции).length}`);
  }
  console.log('выгрузка завершена');
} finally { await pool.end(); }
