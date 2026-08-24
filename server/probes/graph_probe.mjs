#!/usr/bin/env node
// Проба ПЕРЕНОСА ГРАФА. Самая жёсткая в плане: перенос → выгрузка →
// ПОБАЙТОВОЕ сличение с исходными шестью файлами.
//
// Мягче нельзя. Если выгрузка отличается хоть отступом, одностраничная
// версия перестаёт быть действующей, а первый же настоящий перенос даёт
// расхождение на тысячи строк, в котором правок не разглядеть.
//
//   DATABASE_URL=… node probes/graph_probe.mjs [папка с data/*.json]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { importSet, exportSet, exportAll, counts, graphVersion, bumpGraphVersion,
         какПишетПриложение } from '../src/db/graph.js';
import { НАБОРЫ, ИМЕНА } from '../src/graph/schema.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ДАННЫЕ = process.argv[2] || path.join(КОРЕНЬ, '..', 'app', 'data');
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

// Откат ДО ПУСТОГО МЕСТА, а не заданное число раз: числом был счёт миграций
// на день написания пробы, и с каждой новой миграцией проба начинала
// оставлять хвост — а на хвосте она падает не там, где смотрят.
while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = создатьПул();

try {
  const исходные = Object.fromEntries(ИМЕНА.map(имя =>
    [имя, fs.readFileSync(path.join(ДАННЫЕ, имя + '.json'), 'utf8')]));

  // ── 1. перенос ──────────────────────────────────────────────────────────
  const перенесено = await withTransaction(pool, async client => {
    const по = {};
    for (const имя of ИМЕНА) {
      по[имя] = await importSet(client, имя, JSON.parse(исходные[имя]));
    }
    await bumpGraphVersion(client);
    return по;
  });
  for (const имя of ИМЕНА) {
    const ждём = JSON.parse(исходные[имя]).length;
    проверить(`перенесено ${имя}`, перенесено[имя] === ждём, ждём, перенесено[имя]);
  }

  const сколько = await counts(pool);
  проверить('в базе столько же живых, сколько в файлах',
    ИМЕНА.every(имя => сколько[имя] === перенесено[имя]), 'столько же',
    JSON.stringify(сколько));

  // ── 2. ГЛАВНОЕ: выгрузка совпадает ПОБАЙТОВО ────────────────────────────
  for (const имя of ИМЕНА) {
    const выгружено = какПишетПриложение(await exportSet(pool, имя));
    const совпало = выгружено === исходные[имя];
    let где = '';
    if (!совпало) {
      const i = [...исходные[имя]].findIndex((з, k) => з !== выгружено[k]);
      где = `первое расхождение на знаке ${i}: `
          + `«${исходные[имя].slice(Math.max(0, i - 30), i + 30)}» → `
          + `«${выгружено.slice(Math.max(0, i - 30), i + 30)}»`;
    }
    проверить(`ВЫГРУЗКА ${имя} СОВПАДАЕТ ПОБАЙТОВО`, совпало,
      `${исходные[имя].length} знаков`, совпало ? '' : где);
  }

  // ── 3. повторный перенос ничего не портит ───────────────────────────────
  await withTransaction(pool, async client => {
    for (const имя of ИМЕНА) await importSet(client, имя, JSON.parse(исходные[имя]));
  });
  проверить('повторный перенос идемпотентен по составу',
    ИМЕНА.every(имя => сколько[имя] === перенесено[имя]), 'то же', 'иное');
  const послеПовтора = какПишетПриложение(await exportSet(pool, 'concepts'));
  проверить('и выгрузка после него та же', послеПовтора === исходные.concepts,
    'та же', 'иная');

  // ── 4. порядок ──────────────────────────────────────────────────────────
  // Массив упорядочен, таблица нет. Без явного порядка каждая выгрузка
  // выходила бы иной — проверяем, что порядок берётся из ord, а не из
  // случайности плана запроса.
  await pool.query(`
    UPDATE graph_entities SET ord = ord + 1000 WHERE kind = 'tradition' AND ord = 0`);
  const переставлено = await exportSet(pool, 'traditions');
  const было = JSON.parse(исходные.traditions);
  проверить('перестановка ord меняет порядок выгрузки',
    переставлено[переставлено.length - 1].id === было[0].id,
    было[0].id, переставлено[переставлено.length - 1].id);
  await pool.query(`
    UPDATE graph_entities SET ord = ord - 1000 WHERE kind = 'tradition' AND ord >= 1000`);
  проверить('порядок восстановился',
    какПишетПриложение(await exportSet(pool, 'traditions')) === исходные.traditions,
    'та же', 'иная');

  // ── 5. мягкое удаление ──────────────────────────────────────────────────
  await pool.query(`
    UPDATE graph_entities SET deleted_at = NOW()
     WHERE kind = 'tradition' AND ord = 0`);
  проверить('удалённое в выгрузку не попадает',
    (await exportSet(pool, 'traditions')).length === было.length - 1,
    было.length - 1, (await exportSet(pool, 'traditions')).length);
  await pool.query(`
    UPDATE graph_entities SET deleted_at = NULL WHERE kind = 'tradition' AND ord = 0`);
  проверить('и воскресает откатом', 
    (await exportSet(pool, 'traditions')).length === было.length,
    было.length, (await exportSet(pool, 'traditions')).length);

  // ── 6. посторонние поля роняют перенос, а не выкидываются молча ─────────
  const сЧужим = await отказ(() => withTransaction(pool, client =>
    importSet(client, 'traditions',
      [{ id: 'x', name: 'проба', description: '', ЧУЖОЕ: 1 }])));
  проверить('посторонние поля роняют перенос',
    сЧужим.includes('посторонние поля'), 'посторонние поля', сЧужим.slice(0, 40));
  const безId = await отказ(() => withTransaction(pool, client =>
    importSet(client, 'traditions', [{ name: 'без имени' }])));
  проверить('запись без id роняет перенос',
    безId.includes('без id'), 'без id', безId.slice(0, 40));

  // ── 7. счётчик состояния ────────────────────────────────────────────────
  const в1 = await graphVersion(pool);
  const в2 = await withTransaction(pool, client => bumpGraphVersion(client));
  проверить('счётчик состояния растёт', в2 === в1 + 1, в1 + 1, в2);

  // ── 8. id не задваивается ───────────────────────────────────────────────
  const { rows } = await pool.query(
    `SELECT data ? 'id' AS "естьId" FROM graph_entities LIMIT 1`);
  проверить('id лежит только в адресе, не в теле', rows[0].естьId === false,
    false, rows[0].естьId);

  // ── 9. опись покрывает всё, что есть в файлах ───────────────────────────
  for (const имя of ИМЕНА) {
    const ключи = new Set();
    for (const з of JSON.parse(исходные[имя])) Object.keys(з).forEach(к => ключи.add(к));
    const лишние = [...ключи].filter(к => !НАБОРЫ[имя].keys.includes(к));
    проверить(`опись ${имя} покрывает все поля файла`, лишние.length === 0,
      0, лишние.join(',') || 0);
  }

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(50, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
