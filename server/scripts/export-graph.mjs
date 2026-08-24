#!/usr/bin/env node
// Обратная выгрузка: шесть JSON в том же виде, в каком их пишет приложение.
//
//   node scripts/export-graph.mjs <папка назначения>

import fs from 'node:fs';
import path from 'node:path';
import { создатьПул } from '../src/db/pool.js';
import { exportSet, какПишетПриложение } from '../src/db/graph.js';
import { ИМЕНА } from '../src/graph/schema.js';

const папка = process.argv[2];
if (!папка) { console.error('укажите папку назначения'); process.exit(1); }
fs.mkdirSync(папка, { recursive: true });

const pool = создатьПул();
try {
  for (const имя of ИМЕНА) {
    const записи = await exportSet(pool, имя);
    fs.writeFileSync(path.join(папка, имя + '.json'), какПишетПриложение(записи));
    console.log(`  ${имя.padEnd(14, '.')} ${записи.length}`);
  }
  console.log('выгрузка завершена');
} finally { await pool.end(); }
