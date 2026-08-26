#!/usr/bin/env node
// Перенос шести JSON в базу.
//
//   node scripts/import-graph.mjs <папка с data/*.json>
//
// Идёт ОДНОЙ транзакцией: половина перенесённой базы хуже, чем ни одной.

import fs from 'node:fs';
import path from 'node:path';
import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { importSet, bumpGraphVersion, counts } from '../src/db/graph.js';
import { SET_NAMES } from '../src/graph/schema.js';

const папка = process.argv[2];
if (!папка) { console.error('укажите папку с шестью .json'); process.exit(1); }

const pool = createPool();
try {
  // ПОВТОРНЫЙ ПЕРЕНОС НЕ БЕЗОБИДЕН. importSet кладёт с ON CONFLICT DO UPDATE:
  // на непустой базе он перезапишет содержимое серверных сущностей старым
  // JSON и поднимет их версии. Шесть файлов — это СЕМЯ, а рабочее состояние
  // живёт в базе; спутать их значит потерять чужую работу молча.
  const previous = await counts(pool);
  if (Object.values(previous).some(n => Number(n) > 0)
      && process.env.ALLOW_GRAPH_REIMPORT !== '1') {
    console.error(
      'В graph_entities уже есть живые сущности: ' +
      Object.entries(previous).map(([и, n]) => `${и} ${n}`).join(', ') + '.\n' +
      'Повторный перенос перезапишет серверные правки семенем.\n' +
      'Если это и вправду нужно — ALLOW_GRAPH_REIMPORT=1.');
    process.exitCode = 1;
    await pool.end();
    process.exit(1);
  }

  const merged = await withTransaction(pool, async client => {
    const по = {};
    for (const имя of SET_NAMES) {
      const filePath = path.join(папка, имя + '.json');
      if (!fs.existsSync(filePath)) throw new Error('нет файла ' + filePath);
      по[имя] = await importSet(client, имя, JSON.parse(fs.readFileSync(filePath, 'utf8')));
    }
    await bumpGraphVersion(client);
    return по;
  });
  for (const [имя, n] of Object.entries(merged)) console.log(`  ${имя.padEnd(14, '.')} ${n}`);
  console.log('перенос завершён');
} finally { await pool.end(); }
