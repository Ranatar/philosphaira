#!/usr/bin/env node
// Перенос шести JSON в базу.
//
//   node scripts/import-graph.mjs <папка с data/*.json>
//
// Идёт ОДНОЙ транзакцией: половина перенесённой базы хуже, чем ни одной.

import fs from 'node:fs';
import path from 'node:path';
import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { importSet, bumpGraphVersion } from '../src/db/graph.js';
import { ИМЕНА } from '../src/graph/schema.js';

const папка = process.argv[2];
if (!папка) { console.error('укажите папку с шестью .json'); process.exit(1); }

const pool = создатьПул();
try {
  const итог = await withTransaction(pool, async client => {
    const по = {};
    for (const имя of ИМЕНА) {
      const путь = path.join(папка, имя + '.json');
      if (!fs.existsSync(путь)) throw new Error('нет файла ' + путь);
      по[имя] = await importSet(client, имя, JSON.parse(fs.readFileSync(путь, 'utf8')));
    }
    await bumpGraphVersion(client);
    return по;
  });
  for (const [имя, n] of Object.entries(итог)) console.log(`  ${имя.padEnd(14, '.')} ${n}`);
  console.log('перенос завершён');
} finally { await pool.end(); }
