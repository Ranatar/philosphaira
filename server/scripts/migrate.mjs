#!/usr/bin/env node
// Накат и откат миграций.
//
//   node scripts/migrate.mjs up       — накатить всё, чего нет
//   node scripts/migrate.mjs down     — откатить последнюю
//   node scripts/migrate.mjs status   — что применено
//
// Каждая миграция идёт В ОДНОЙ ТРАНЗАКСИИ вместе с записью о себе: иначе
// бывает состояние «схема применена наполовину, а журнал говорит, что
// применена целиком», и распутывать его приходится руками.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ПАПКА  = path.join(КОРЕНЬ, 'migrations');

const ЖУРНАЛ = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version    TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

const миграции = () => fs.readdirSync(ПАПКА)
  .filter(f => f.endsWith('.up.sql'))
  .map(f => f.replace(/\.up\.sql$/, ''))
  .sort();

const читать = (имя, сторона) =>
  fs.readFileSync(path.join(ПАПКА, `${имя}.${сторона}.sql`), 'utf8');

const применённые = async db => {
  await db.query(ЖУРНАЛ);
  const { rows } = await db.query('SELECT version FROM schema_migrations ORDER BY version');
  return rows.map(r => r.version);
};

const команда = process.argv[2] || 'up';
const pool = создатьПул();

try {
  if (команда === 'status') {
    const есть = await применённые(pool);
    for (const м of миграции()) {
      console.log((есть.includes(м) ? '  применена  ' : '  НЕ применена ') + м);
    }
    console.log(`\nвсего ${миграции().length}, применено ${есть.length}`);

  } else if (команда === 'up') {
    const есть = await применённые(pool);
    const ждут = миграции().filter(м => !есть.includes(м));
    if (!ждут.length) { console.log('накатывать нечего'); }
    for (const м of ждут) {
      await withTransaction(pool, async client => {
        await client.query(читать(м, 'up'));
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [м]);
      });
      console.log('накачена ' + м);
    }

  } else if (команда === 'down') {
    const есть = await применённые(pool);
    const последняя = есть[есть.length - 1];
    if (!последняя) { console.log('откатывать нечего'); }
    else {
      await withTransaction(pool, async client => {
        await client.query(читать(последняя, 'down'));
        await client.query('DELETE FROM schema_migrations WHERE version = $1', [последняя]);
      });
      console.log('откачена ' + последняя);
    }

  } else {
    console.error('команды: up | down | status');
    process.exitCode = 1;
  }
} finally {
  await pool.end();
}
