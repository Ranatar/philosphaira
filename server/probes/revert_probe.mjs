#!/usr/bin/env node
// Проба ОТКАТА, ИСТОРИИ И ПРИРАЩЕНИЯ. Требует живой базы.
//
// Главное здесь — что откат возвращает граф ПОСИМВОЛЬНО в прежний вид, а
// приращение с версии N, наложенное на состояние версии N, даёт то же, что
// полная выгрузка. И то и другое сверяется сравнением строк, а не на глаз.
//
//   DATABASE_URL=… node probes/revert_probe.mjs

import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { importSet, exportSet, exportAll, graphVersion, asAppWrites,
         entityHistory } from '../src/db/graph.js';
import { createCommit } from '../src/commits/service.js';
import { reviewCommit, directCommit } from '../src/commits/review.js';
import { revertCommit, invertChanges } from '../src/commits/revert.js';
import { readGraph, readGraphSince } from '../src/graph/read.js';
import { findCommit } from '../src/db/commits.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();
const ПАРОЛЬ = 'вполне-длинный-пароль';

async function завести(имя, роль) {
  const { user } = await register(pool, {
    username: имя, email: `${имя}@e.рф`, password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role = $1, email_verified_at = NOW(),
                                     mfa_enabled = TRUE WHERE user_id = $2`,
    [роль, user.userId]);
  return findById(pool, user.userId);
}

const слепок = db => exportAll(db).then(deleted =>
  Object.fromEntries(Object.entries(deleted).map(([и, з]) => [и, asAppWrites(з)])));

try {
  const редактор  = await завести('редактор', 'editor');
  const модератор = await завести('модератор', 'moderator');

  await withTransaction(pool, client => importSet(client, 'traditions', [
    { id: 'т1', name: 'Первая', description: 'старое' },
    { id: 'т2', name: 'Вторая', description: 'другое' },
  ]));

  // ── 1. ОТКАТ ПРАВКИ ─────────────────────────────────────────────────────
  const доПравки = await слепок(pool);
  const { коммит: к1 } = await createCommit(pool, { actor: редактор,
    message: 'правлю описание', changes: [{ action: 'edit', kind: 'tradition',
      entityId: 'т1', fields: { description: { base: 'старое', next: 'новое' } } }] });
  await reviewCommit(pool, { actor: модератор, commitId: к1.commitId, action: 'approve' });
  проверить('правка применилась',
    (await exportSet(pool, 'traditions'))[0].description === 'новое', 'новое', 'иное');

  проверить('откат без причины не проходит',
    (await отказ(() => revertCommit(pool, { actor: модератор, commitId: к1.commitId,
      reason: '  ' }))).includes('Причина отката'), 'Причина отката', 'иное');
  проверить('редактор откатывать не вправе',
    (await отказ(() => revertCommit(pool, { actor: редактор, commitId: к1.commitId,
      reason: 'зачем-то' }))) !== 'ПРОШЛО', 'отказ', 'прошло');

  const о1 = await revertCommit(pool, { actor: модератор, commitId: к1.commitId,
    reason: 'передумали' });
  проверить('откат применился', о1.исход === 'applied', 'applied', о1.исход);
  const послеОтката = await слепок(pool);
  проверить('ГРАФ ВЕРНУЛСЯ ПОСИМВОЛЬНО',
    послеОтката.traditions === доПравки.traditions,
    `${доПравки.traditions.length} знаков`, `${послеОтката.traditions.length} знаков`);

  const к1п = await findCommit(pool, к1.commitId);
  проверить('отменённый помечен reverted', к1п.status === 'reverted', 'reverted', к1п.status);
  const о1п = await pool.query(`SELECT reverts, author_id FROM commits WHERE commit_id=$1`,
    [о1.commitId]);
  проверить('у отката записано, что он отменяет',
    о1п.rows[0].reverts === к1.commitId, к1.commitId, о1п.rows[0].reverts);
  проверить('автор отката — тот, кто откатывал',
    о1п.rows[0].author_id === модератор.userId, 'модератор', 'иной');
  проверить('дважды откатить нельзя',
    (await отказ(() => revertCommit(pool, { actor: модератор, commitId: к1.commitId,
      reason: 'ещё раз' }))).includes('только применённый'), 'только применённый', 'иное');

  // ── 2. ОТКАТ ОТКАТА ─────────────────────────────────────────────────────
  const о2 = await revertCommit(pool, { actor: модератор, commitId: о1.commitId,
    reason: 'всё-таки нужно' });
  проверить('откат отката применился', о2.исход === 'applied', 'applied', о2.исход);
  проверить('ГРАФ ВЕРНУЛСЯ К ПРАВЛЕНОМУ ВИДУ',
    (await exportSet(pool, 'traditions'))[0].description === 'новое', 'новое',
    (await exportSet(pool, 'traditions'))[0].description);

  // ── 3. ОТКАТ УДАЛЕНИЯ ───────────────────────────────────────────────────
  const доУдаления = await слепок(pool);
  const { коммит: к3 } = await createCommit(pool, { actor: редактор,
    message: 'удаляю вторую', changes: [{ action: 'delete', kind: 'tradition',
      entityId: 'т2', fields: {} }] });
  await reviewCommit(pool, { actor: модератор, commitId: к3.commitId, action: 'approve' });
  проверить('удаление применилось',
    (await exportSet(pool, 'traditions')).length === 1, 1,
    (await exportSet(pool, 'traditions')).length);
  await revertCommit(pool, { actor: модератор, commitId: к3.commitId, reason: 'вернуть' });
  проверить('ОТКАТ УДАЛЕНИЯ ВОССТАНОВИЛ ЗАПИСЬ ПОСИМВОЛЬНО',
    (await слепок(pool)).traditions === доУдаления.traditions,
    'посимвольно', 'иначе');

  // ── 4. ОТКАТ ДОБАВЛЕНИЯ ─────────────────────────────────────────────────
  const доДобавления = await слепок(pool);
  const д = await directCommit(pool, { actor: модератор, message: 'добавляю третью',
    changes: [{ action: 'add', kind: 'tradition', entityId: 'т3',
      fields: { name: { base: null, next: 'Третья' },
                description: { base: null, next: 'свежая' } } }] });
  проверить('добавление применилось',
    (await exportSet(pool, 'traditions')).length === 3, 3,
    (await exportSet(pool, 'traditions')).length);
  await revertCommit(pool, { actor: модератор, commitId: д.commitId, reason: 'лишняя' });
  проверить('откат добавления убрал запись посимвольно',
    (await слепок(pool)).traditions === доДобавления.traditions, 'посимвольно', 'иначе');

  // ── 5. ОТКАТ СТАЛКИВАЕТСЯ, А НЕ ПЕРЕЗАПИСЫВАЕТ МОЛЧА ────────────────────
  const { коммит: к5 } = await createCommit(pool, { actor: редактор,
    message: 'правлю имя', changes: [{ action: 'edit', kind: 'tradition',
      entityId: 'т1', fields: { name: { base: 'Первая', next: 'Первейшая' } } }] });
  await reviewCommit(pool, { actor: модератор, commitId: к5.commitId, action: 'approve' });
  await directCommit(pool, { actor: модератор, message: 'а я иначе',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { name: { base: 'Первейшая', next: 'Совсем иная' } } }] });
  const о5 = await revertCommit(pool, { actor: модератор, commitId: к5.commitId,
    reason: 'откатить поверх чужого' });
  проверить('ОТКАТ ПОВЕРХ ЧУЖОЙ ПРАВКИ — СТОЛКНОВЕНИЕ',
    о5.исход === 'conflicted', 'conflicted', о5.исход);
  проверить('и чужая правка уцелела',
    (await exportSet(pool, 'traditions'))[0].name === 'Совсем иная', 'Совсем иная',
    (await exportSet(pool, 'traditions'))[0].name);
  проверить('отменяемый при столкновении остался применённым',
    (await findCommit(pool, к5.commitId)).status === 'applied', 'applied',
    (await findCommit(pool, к5.commitId)).status);

  // ── 6. ОБРАЩЕНИЕ ИЗМЕНЕНИЙ ──────────────────────────────────────────────
  const обратно = await withTransaction(pool, client => invertChanges(client, [
    { action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { name: { base: 'А', next: 'Б' } } },
    { action: 'add', kind: 'tradition', entityId: 'т9', fields: {} },
  ]));
  проверить('правка обращается перестановкой было и стало',
    обратно[0].fields.name.base === 'Б' && обратно[0].fields.name.next === 'А',
    'Б→А', JSON.stringify(обратно[0].fields.name));
  проверить('добавление обращается удалением', обратно[1].action === 'delete',
    'delete', обратно[1].action);

  // ── 7. ИСТОРИЯ СУЩНОСТИ ─────────────────────────────────────────────────
  const история = await entityHistory(pool, { kind: 'tradition', entityId: 'т1' });
  проверить('история сущности не пуста', история.length >= 3, '≥3', история.length);
  проверить('в истории назван автор', !!история[0].author, 'есть', 'нет');
  проверить('история идёт по возрастанию версий',
    история.every((з, i) => i === 0 || Number(з.версия) >= Number(история[i - 1].версия)),
    'по возрастанию', 'иначе');
  const чужая = await entityHistory(pool, { kind: 'tradition', entityId: 'т2' });
  проверить('история другой сущности — другая',
    чужая.length < история.length, 'короче', `${чужая.length} против ${история.length}`);

  // ── 8. ПРИРАЩЕНИЕ ───────────────────────────────────────────────────────
  const полное = await readGraph(pool, { actor: редактор });
  проверить('полное состояние приходит с версией',
    typeof полное.версия === 'number' && !!полное.наборы.traditions,
    'версия и наборы', Object.keys(полное).join(','));

  const срез = полное.версия;
  const слепокНаСрезе = await слепок(pool);
  await directCommit(pool, { actor: модератор, message: 'после среза',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т2',
      fields: { description: { base: 'другое', next: 'третье' } } }] });

  const прир = await readGraphSince(pool, { actor: редактор, since: срез });
  проверить('приращение отдаёт ТОЛЬКО изменившееся',
    прир.изменения.length === 1, 1, прир.изменения.length);
  проверить('и это та самая сущность',
    прир.изменения[0].entityId === 'т2', 'т2', прир.изменения[0].entityId);
  проверить('версия приращения новее среза', прир.версия > срез, `> ${срез}`, прир.версия);

  // ГЛАВНОЕ: состояние на срезе + приращение === полное состояние.
  const наложено = JSON.parse(слепокНаСрезе.traditions);
  for (const и of прир.изменения) {
    if (и.набор !== 'traditions') continue;
    const where = наложено.findIndex(з => з.id === и.entityId);
    if (и.удалена) { if (where !== -1) наложено.splice(where, 1); }
    else if (where === -1) наложено.push(и.запись);
    else наложено[where] = и.запись;
  }
  проверить('СРЕЗ ПЛЮС ПРИРАЩЕНИЕ = ПОЛНОЕ СОСТОЯНИЕ',
    asAppWrites(наложено) === (await слепок(pool)).traditions,
    'совпало', 'разошлось');

  const сНуля = await readGraphSince(pool, { actor: редактор, since: 0 });
  проверить('приращение с нуля отдаёт всё изменённое коммитами',
    сНуля.изменения.length >= 2, '≥2', сНуля.изменения.length);

  // Удалённое приходит с пометкой, а не молчанием.
  const доУд = (await readGraph(pool, { actor: редактор })).версия;
  await directCommit(pool, { actor: модератор, message: 'удаляю вторую снова',
    changes: [{ action: 'delete', kind: 'tradition', entityId: 'т2', fields: {} }] });
  const прирУд = await readGraphSince(pool, { actor: редактор, since: доУд });
  проверить('удалённое приходит В приращении, с пометкой',
    прирУд.изменения.some(и => и.entityId === 'т2' && и.удалена === true),
    'помечено удалённым', JSON.stringify(прирУд.изменения.map(и => [и.entityId, и.удалена])));

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
