#!/usr/bin/env node
// Проба ПРИМЕНЕНИЯ И РАССМОТРЕНИЯ. Требует живой базы.
//
// merge_probe спрашивает правила слияния как чистые функции; здесь те же
// правила проверяются НА ЖИВОЙ БАЗЕ, где сущность лежит в таблице, версия
// растёт, а столкновение становится состоянием коммита.
//
//   DATABASE_URL=… node probes/apply_probe.mjs

import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { importSet, exportSet, graphVersion } from '../src/db/graph.js';
import { createCommit } from '../src/commits/service.js';
import { reviewCommit, directCommit } from '../src/commits/review.js';
import { findCommit } from '../src/db/commits.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, finite, ждали, вышло) =>
  проверки.push({ имя, годно: !!finite, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

// Откат ДО ПУСТОГО МЕСТА, а не заданное число раз: числом был счёт миграций
// на день написания пробы, и с каждой новой миграцией проба начинала
// оставлять хвост — а на хвосте она падает не там, где смотрят.
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

const правка = (поле, previous, стало, id = 'т1') => ([{
  action: 'edit', kind: 'tradition', entityId: id,
  fields: { [поле]: { base: previous, next: стало } },
}]);

try {
  const редактор  = await завести('редактор', 'editor');
  const второй    = await завести('второй', 'editor');
  const модератор = await завести('модератор', 'moderator');

  // Маленький набор вместо всей базы: проба должна читаться, а не пугать.
  await withTransaction(pool, client => importSet(client, 'traditions', [
    { id: 'т1', name: 'Первая', description: 'старое описание' },
    { id: 'т2', name: 'Вторая', description: 'другое' },
  ]));
  const версия0 = await graphVersion(pool);

  // ── 1. чистое применение ────────────────────────────────────────────────
  const { коммит: к1 } = await createCommit(pool, { actor: редактор,
    message: 'уточнил', changes: правка('description', 'старое описание', 'новое') });
  const и1 = await reviewCommit(pool, { actor: модератор, commitId: к1.commitId,
    action: 'approve' });
  проверить('чистый коммит применяется', и1.исход === 'applied', 'applied', и1.исход);
  проверить('версия графа выросла', и1.версия === версия0 + 1, версия0 + 1, и1.версия);
  const после1 = await exportSet(pool, 'traditions');
  проверить('поле записано', после1[0].description === 'новое', 'новое', после1[0].description);
  проверить('соседнее поле не тронуто', после1[0].name === 'Первая', 'Первая', после1[0].name);
  const к1п = await findCommit(pool, к1.commitId);
  проверить('рецензент записан', к1п.reviewedBy === модератор.userId, 'модератор', к1п.reviewedBy);

  // ── 2. САМООДОБРЕНИЕ ────────────────────────────────────────────────────
  const { коммит: к2 } = await createCommit(pool, { actor: модератор,
    message: 'свой коммит', changes: правка('description', 'новое', 'моё') });
  проверить('СВОЙ КОММИТ РАССМАТРИВАТЬ НЕЛЬЗЯ',
    (await отказ(() => reviewCommit(pool, { actor: модератор, commitId: к2.commitId,
      action: 'approve' }))).includes('кто-то другой'), 'кто-то другой', 'иное');
  await pool.query(`DELETE FROM commits WHERE commit_id = $1`, [к2.commitId]);

  // ── 3. РАЗНЫЕ ПОЛЯ ОДНОЙ СУЩНОСТИ — СЛИЯНИЕ ВЫХОДИТ САМО ────────────────
  const { коммит: кА } = await createCommit(pool, { actor: редактор,
    message: 'правлю имя', changes: правка('name', 'Первая', 'Первейшая') });
  const { коммит: кБ } = await createCommit(pool, { actor: второй,
    message: 'правлю описание', changes: правка('description', 'новое', 'третье') });
  const иА = await reviewCommit(pool, { actor: модератор, commitId: кА.commitId, action: 'approve' });
  const иБ = await reviewCommit(pool, { actor: модератор, commitId: кБ.commitId, action: 'approve' });
  проверить('первый из двух применился', иА.исход === 'applied', 'applied', иА.исход);
  проверить('ВТОРОЙ ТОЖЕ применился (поля разные)', иБ.исход === 'applied', 'applied', иБ.исход);
  const после3 = (await exportSet(pool, 'traditions'))[0];
  проверить('обе правки на месте',
    после3.name === 'Первейшая' && после3.description === 'третье',
    'Первейшая/третье', `${после3.name}/${после3.description}`);

  // ── 4. ОДНО ПОЛЕ, РАЗНЫЕ ЗНАЧЕНИЯ — СТОЛКНОВЕНИЕ ────────────────────────
  const { коммит: кВ } = await createCommit(pool, { actor: редактор,
    message: 'моё описание', changes: правка('description', 'третье', 'моё') });
  const { коммит: кГ } = await createCommit(pool, { actor: второй,
    message: 'моё другое', changes: правка('description', 'третье', 'другое') });
  await reviewCommit(pool, { actor: модератор, commitId: кВ.commitId, action: 'approve' });
  const иГ = await reviewCommit(pool, { actor: модератор, commitId: кГ.commitId, action: 'approve' });
  проверить('второй уходит в СТОЛКНОВЕНИЕ', иГ.исход === 'conflicted', 'conflicted', иГ.исход);
  проверить('названо поле, а не «конфликт»',
    иГ.столкновения?.[0]?.field === 'description', 'description',
    иГ.столкновения?.[0]?.field);
  проверить('показано, что было, что хотели и что сейчас',
    иГ.столкновения?.[0]?.base === 'третье'
    && иГ.столкновения?.[0]?.yours === 'другое'
    && иГ.столкновения?.[0]?.current === 'моё', 'все три', JSON.stringify(иГ.столкновения?.[0]));
  const кГп = await findCommit(pool, кГ.commitId);
  проверить('разбор столкновения лёг рядом с коммитом',
    Array.isArray((await pool.query(
      `SELECT conflicts FROM commits WHERE commit_id=$1`, [кГ.commitId])).rows[0].conflicts),
    'массив', 'нет');
  проверить('граф от столкновения не тронут',
    (await exportSet(pool, 'traditions'))[0].description === 'моё', 'моё', 'иное');

  // ── 5. ОДИНАКОВАЯ ПРАВКА — ВХОЛОСТУЮ, А НЕ ОТКАЗ ────────────────────────
  // Считать «версия0 + столько-то» — значит вести в пробе вторую бухгалтерию
  // и ошибаться в ней (первый набросок ошибся). Спрашиваем ПРЯМО: изменилась
  // ли версия за этот заход.
  const версияПередСовпавшей = await graphVersion(pool);
  const { коммит: кД } = await createCommit(pool, { actor: второй,
    message: 'то же самое', changes: правка('description', 'третье', 'моё') });
  const иД = await reviewCommit(pool, { actor: модератор, commitId: кД.commitId, action: 'approve' });
  проверить('СОВПАВШАЯ ПРАВКА даёт coincided, а не отказ',
    иД.исход === 'coincided', 'coincided', иД.исход);
  проверить('и версия графа впустую не растёт',
    (await graphVersion(pool)) === версияПередСовпавшей,
    версияПередСовпавшей, await graphVersion(pool));

  // ── 6. столкнулось одно поле — не применяется НИЧЕГО ────────────────────
  const версияДо = await graphVersion(pool);
  const { коммит: кЕ } = await createCommit(pool, { actor: редактор,
    message: 'два изменения разом', changes: [
      { action: 'edit', kind: 'tradition', entityId: 'т2',
        fields: { name: { base: 'Вторая', next: 'Вторичная' } } },
      { action: 'edit', kind: 'tradition', entityId: 'т1',
        fields: { description: { base: 'НЕ ТО', next: 'мимо' } } },
    ] });
  const иЕ = await reviewCommit(pool, { actor: модератор, commitId: кЕ.commitId, action: 'approve' });
  проверить('коммит с одним столкнувшимся полем весь в conflicted',
    иЕ.исход === 'conflicted', 'conflicted', иЕ.исход);
  проверить('ЧИСТАЯ ЧАСТЬ ТОЖЕ НЕ ПРИМЕНЕНА',
    (await exportSet(pool, 'traditions'))[1].name === 'Вторая', 'Вторая',
    (await exportSet(pool, 'traditions'))[1].name);
  проверить('версия не изменилась', (await graphVersion(pool)) === версияДо,
    версияДо, await graphVersion(pool));

  // ── 7. добавление и удаление ────────────────────────────────────────────
  const { коммит: кЖ } = await createCommit(pool, { actor: редактор,
    message: 'новая традиция', changes: [{ action: 'add', kind: 'tradition',
      entityId: 'т3', fields: { name: { base: null, next: 'Третья' },
                                description: { base: null, next: 'свежая' } } }] });
  await reviewCommit(pool, { actor: модератор, commitId: кЖ.commitId, action: 'approve' });
  const тр = await exportSet(pool, 'traditions');
  проверить('добавленная сущность встала в конец',
    тр[тр.length - 1].id === 'т3', 'т3', тр[тр.length - 1].id);
  проверить('её поля на месте', тр[тр.length - 1].name === 'Третья', 'Третья',
    тр[тр.length - 1].name);

  const { коммит: кЗ } = await createCommit(pool, { actor: редактор,
    message: 'добавить занятое', changes: [{ action: 'add', kind: 'tradition',
      entityId: 'т3', fields: { name: { base: null, next: 'Дубль' } } }] });
  проверить('добавление по занятому адресу — столкновение',
    (await reviewCommit(pool, { actor: модератор, commitId: кЗ.commitId,
      action: 'approve' })).исход === 'conflicted', 'conflicted', 'иное');

  const { коммит: кИ } = await createCommit(pool, { actor: редактор,
    message: 'удаляю третью', changes: [{ action: 'delete', kind: 'tradition',
      entityId: 'т3', fields: {} }] });
  await reviewCommit(pool, { actor: модератор, commitId: кИ.commitId, action: 'approve' });
  проверить('удалённое из выгрузки исчезло',
    !(await exportSet(pool, 'traditions')).some(т => т.id === 'т3'), 'нет', 'есть');

  const { коммит: кК } = await createCommit(pool, { actor: редактор,
    message: 'правлю удалённое', changes: правка('name', 'Третья', 'Четвёртая', 'т3') });
  проверить('правка удалённого — столкновение',
    (await reviewCommit(pool, { actor: модератор, commitId: кК.commitId,
      action: 'approve' })).исход === 'conflicted', 'conflicted', 'иное');

  const { коммит: кЛ } = await createCommit(pool, { actor: редактор,
    message: 'удаляю ещё раз', changes: [{ action: 'delete', kind: 'tradition',
      entityId: 'т3', fields: {} }] });
  проверить('повторное удаление — вхолостую, а не столкновение',
    (await reviewCommit(pool, { actor: модератор, commitId: кЛ.commitId,
      action: 'approve' })).исход === 'coincided', 'coincided', 'иное');

  const { коммит: кМ } = await createCommit(pool, { actor: редактор,
    message: 'воскрешаю', changes: [{ action: 'add', kind: 'tradition',
      entityId: 'т3', fields: { name: { base: null, next: 'Воскресшая' },
                                description: { base: null, next: '' } } }] });
  await reviewCommit(pool, { actor: модератор, commitId: кМ.commitId, action: 'approve' });
  const воскрес = (await exportSet(pool, 'traditions')).find(т => т.id === 'т3');
  проверить('удалённое воскресает по тому же адресу, а не рядом',
    воскрес?.name === 'Воскресшая', 'Воскресшая', воскрес?.name);

  // ── 8. отказ ────────────────────────────────────────────────────────────
  const { коммит: кН } = await createCommit(pool, { actor: редактор,
    message: 'спорное', changes: правка('name', 'Первейшая', 'Странная') });
  проверить('отказ без комментария не проходит',
    (await отказ(() => reviewCommit(pool, { actor: модератор, commitId: кН.commitId,
      action: 'reject' }))).includes('не отказ, а молчание'), 'молчание', 'иное');
  const иН = await reviewCommit(pool, { actor: модератор, commitId: кН.commitId,
    action: 'reject', comment: 'не согласен' });
  проверить('отказ с комментарием проходит', иН.исход === 'rejected', 'rejected', иН.исход);
  проверить('отклонённый граф не тронул',
    (await exportSet(pool, 'traditions'))[0].name === 'Первейшая', 'Первейшая', 'иное');
  проверить('дважды рассмотреть нельзя',
    (await отказ(() => reviewCommit(pool, { actor: модератор, commitId: кН.commitId,
      action: 'approve' }))).includes('уже рассмотрен'), 'уже рассмотрен', 'иное');
  проверить('редактор рассматривать не вправе',
    (await отказ(() => reviewCommit(pool, { actor: редактор, commitId: кН.commitId,
      action: 'approve' }))) !== 'ПРОШЛО', 'отказ', 'прошло');

  // ── 9. ПРЯМАЯ ПРАВКА ────────────────────────────────────────────────────
  const прямо = await directCommit(pool, { actor: модератор,
    message: 'правлю сам', changes: правка('name', 'Первейшая', 'Прямая') });
  проверить('прямая правка применяется сразу', прямо.исход === 'applied',
    'applied', прямо.исход);
  проверить('и она видна в графе',
    (await exportSet(pool, 'traditions'))[0].name === 'Прямая', 'Прямая', 'иное');
  const прямойК = await pool.query(
    `SELECT status, reviewed_by FROM commits WHERE commit_id = $1`, [прямо.commitId]);
  проверить('РЕЦЕНЗЕНТ У ПРЯМОЙ ПРАВКИ ПУСТ',
    прямойК.rows[0].reviewed_by === null, null, прямойК.rows[0].reviewed_by);
  проверить('и в журнале отдельное действие',
    (await pool.query(`SELECT count(*)::int AS n FROM audit_log
                        WHERE action = 'commit.direct'`)).rows[0].n === 1,
    1, (await pool.query(`SELECT count(*)::int AS n FROM audit_log
                           WHERE action = 'commit.direct'`)).rows[0].n);
  проверить('редактор прямо править не вправе',
    (await отказ(() => directCommit(pool, { actor: редактор, message: 'мимо',
      changes: правка('name', 'Прямая', 'Моя') }))) !== 'ПРОШЛО', 'отказ', 'прошло');

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
