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
import { createCommit, editOwnCommit } from '../src/commits/service.js';
import { reviewCommit, directCommit } from '../src/commits/review.js';
import { findCommit } from '../src/db/commits.js';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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

  // ── СНОСКИ (24.09.2026) ─────────────────────────────────────────────────
  // Правило — graph/footnotes.js; здесь оно же на живой базе: правка сноски
  // доходит до базы, пустое не пишется, несогласие меток и записей при
  // применении — столкновение для рецензента.
  const noteK1 = [{ id: 'k1', status: 'sourced', text: 'DK 22 B2' }];
  await withTransaction(pool, client => importSet(client, 'concepts', [
    { id: 'c1', label: 'Логос', philosopher: 'ph1', rubrics: [],
      description: 'x', extendedDescription: 'Логос[^k1] общ всем.', footnotes: noteK1 },
    { id: 'c2', label: 'Огонь', philosopher: 'ph1', rubrics: [],
      description: 'y', extendedDescription: 'Огонь[^k2] мера.', provenance: 'DK 22 B30',
      provenanceStatus: 'sourced', footnotes: [{ id: 'k2', status: 'source_not_found' }] },
  ]));
  const conceptById = async id => (await exportSet(pool, 'concepts')).find(c => c.id === id);
  const conceptEdit = (id, fields) => [{ action: 'edit', kind: 'concept', entityId: id, fields }];

  // правка ТЕКСТА сноски — прежде сравнение списков записей давало «уже внесено»
  const noteK1b = [{ id: 'k1', status: 'sourced', text: 'DK 22 B1' }];
  const { коммит: кС1 } = await createCommit(pool, { actor: редактор, message: 'уточнил локус',
    changes: conceptEdit('c1', { footnotes: { base: noteK1, next: noteK1b } }) });
  const иС1 = await reviewCommit(pool, { actor: модератор, commitId: кС1.commitId, action: 'approve' });
  проверить('правка текста сноски применяется', иС1.исход === 'applied', 'applied', иС1.исход);
  проверить('новый текст сноски в базе', (await conceptById('c1')).footnotes?.[0]?.text === 'DK 22 B1',
    'DK 22 B1', JSON.stringify((await conceptById('c1')).footnotes));

  // удаление сноски вместе с меткой: ключ уходит, а не остаётся пустым
  const { коммит: кС2 } = await createCommit(pool, { actor: второй, message: 'убрал сноску',
    changes: conceptEdit('c1', { extendedDescription: { base: 'Логос[^k1] общ всем.', next: 'Логос общ всем.' },
                                 footnotes: { base: noteK1b, next: null } }) });
  const иС2 = await reviewCommit(pool, { actor: модератор, commitId: кС2.commitId, action: 'approve' });
  const c1 = await conceptById('c1');
  проверить('сноска убрана вместе с меткой', иС2.исход === 'applied' && c1.extendedDescription === 'Логос общ всем.',
    'applied, текст без метки', `${иС2.исход}, ${c1.extendedDescription}`);
  проверить('пустые сноски не пишутся — ключа нет', !('footnotes' in c1), 'нет ключа', JSON.stringify(c1.footnotes));

  // метка осталась без записи — столкновение по полю footnotes, а не молчаливая запись
  const { коммит: кС3 } = await createCommit(pool, { actor: редактор, message: 'сноску долой, метку забыл',
    changes: conceptEdit('c2', { footnotes: { base: [{ id: 'k2', status: 'source_not_found' }], next: null } }) });
  const иС3 = await reviewCommit(pool, { actor: модератор, commitId: кС3.commitId, action: 'approve' });
  проверить('метка без записи при применении — столкновение', иС3.исход === 'conflicted', 'conflicted', иС3.исход);
  проверить('столкновение названо полем footnotes', иС3.столкновения?.[0]?.field === 'footnotes',
    'footnotes', иС3.столкновения?.[0]?.field);
  проверить('при несогласии в базе ничего не тронуто', (await conceptById('c2')).footnotes?.length === 1,
    '1 сноска', JSON.stringify((await conceptById('c2')).footnotes));

  // негодная форма отклоняется ещё при подаче
  проверить('негодное состояние сноски не принимается при подаче',
    (await отказ(() => createCommit(pool, { actor: редактор, message: 'x',
      changes: conceptEdit('c2', { footnotes: { base: [{ id: 'k2', status: 'source_not_found' }],
        next: [{ id: 'k2', status: 'unspecified' }] } }) }))).includes('сноски'), 'отказ про сноски', 'иное');

  // очищенный источник сущности уходит из записи, а не пишется null
  const { коммит: кС4 } = await createCommit(pool, { actor: второй, message: 'источник отвергнут',
    changes: conceptEdit('c2', { provenance: { base: 'DK 22 B30', next: null },
                                 provenanceStatus: { base: 'sourced', next: null } }) });
  const иС4 = await reviewCommit(pool, { actor: модератор, commitId: кС4.commitId, action: 'approve' });
  const c2 = await conceptById('c2');
  проверить('очищенный источник уходит из записи', иС4.исход === 'applied'
    && !('provenance' in c2) && !('provenanceStatus' in c2), 'applied, ключей нет',
    `${иС4.исход}, ${JSON.stringify({ p: c2.provenance, s: c2.provenanceStatus })}`);

  // новая сущность с пустыми сносками — ключа нет вовсе
  const { коммит: кС5 } = await createCommit(pool, { actor: редактор, message: 'новая',
    changes: [{ action: 'add', kind: 'concept', entityId: 'c3', fields: {
      label: { base: null, next: 'Новое' }, philosopher: { base: null, next: 'ph1' },
      rubrics: { base: null, next: [] }, description: { base: null, next: 'без сносок' },
      extendedDescription: { base: null, next: 'z' }, provenance: { base: null, next: null },
      footnotes: { base: null, next: null } } }] });
  const иС5 = await reviewCommit(pool, { actor: модератор, commitId: кС5.commitId, action: 'approve' });
  const c3 = await conceptById('c3');
  проверить('новая сущность без сносок — ключей-пустышек нет', иС5.исход === 'applied' && c3
    && !('footnotes' in c3) && !('provenance' in c3), 'applied, ключей нет', `${иС5.исход}, ${JSON.stringify(c3)}`);

  // ── ТЕКСТ, ИСТОЧНИК, СЕМЯ (26.09.2026) ────────────────────────────────
  // Сквозной опыт: разметка из метки и описания, одобренная модератором,
  // исполнилась у гостя. Правило — graph/text-rules.js.
  const submitEdit = fields => отказ(() => createCommit(pool, { actor: редактор, message: 'т', changes: conceptEdit('c3', fields) }));
  проверить('сценарий в описании отвергается при подаче',
    (await submitEdit({ extendedDescription: { base: 'z', next: 'z<img src=x onerror="alert(1)">' } })).includes('разметка'),
    'отказ «разметка»', 'иное');
  проверить('знак < в метке отвергается', (await submitEdit({ label: { base: 'Новое', next: 'Новое<b>' } })).includes('< и >'),
    'отказ', 'иное');
  проверить('прямая кавычка в метке отвергается', (await submitEdit({ label: { base: 'Новое', next: 'Новое"' } })).includes('кавычка'),
    'отказ', 'иное');
  проверить('разметка в тексте сноски отвергается', (await submitEdit({ extendedDescription: { base: 'z', next: 'z[^a1]' },
    footnotes: { base: null, next: [{ id: 'a1', status: 'sourced', text: '<i>Книга</i>' }] } })).includes('footnotes'),
    'отказ по footnotes', 'иное');
  проверить('метка сноски в КРАТКОМ описании отвергается', (await submitEdit({ description: { base: 'без сносок', next: 'без сносок[^a1]' } }))
    .includes('метки сносок здесь не ставятся'), 'отказ', 'иное');
  const { коммит: cT1 } = await createCommit(pool, { actor: редактор, message: 'жирный и курсив',
    changes: conceptEdit('c3', { extendedDescription: { base: 'z', next: '<b>Логос</b> и <i>эпос</i>' } }) });
  const rT1 = await reviewCommit(pool, { actor: модератор, commitId: cT1.commitId, action: 'approve' });
  проверить('<b> и <i> без атрибутов проходят', rT1.исход === 'applied'
    && (await conceptById('c3')).extendedDescription === '<b>Логос</b> и <i>эпос</i>', 'applied', rT1.исход);
  проверить('<b> с атрибутом отвергается', (await submitEdit({ extendedDescription: { base: '<b>Логос</b> и <i>эпос</i>',
    next: '<b onclick="x()">Логос</b>' } })).includes('разметка'), 'отказ', 'иное');

  // согласие источника — по итогу: правка одного из двух полей
  const { коммит: cP1 } = await createCommit(pool, { actor: редактор, message: 'только состояние',
    changes: conceptEdit('c3', { provenanceStatus: { base: null, next: 'sourced' } }) });
  const rP1 = await reviewCommit(pool, { actor: модератор, commitId: cP1.commitId, action: 'approve' });
  проверить('«источник есть» без строки — столкновение по итогу', rP1.исход === 'conflicted'
    && !('provenanceStatus' in (await conceptById('c3'))), 'conflicted, в базе пусто', rP1.исход);
  await withTransaction(pool, client => importSet(client, 'concepts', [
    { id: 'c4', label: 'С источником', philosopher: 'ph1', rubrics: ['r1'], description: 'd', extendedDescription: 'e',
      provenance: 'Диоген Лаэртский, IX 1', provenanceStatus: 'sourced' }]));
  const { коммит: cP2 } = await createCommit(pool, { actor: редактор, message: 'стёр строку',
    changes: conceptEdit('c4', { provenance: { base: 'Диоген Лаэртский, IX 1', next: null } }) });
  const rP2 = await reviewCommit(pool, { actor: модератор, commitId: cP2.commitId, action: 'approve' });
  проверить('строка стёрта под «источник есть» — столкновение по итогу', rP2.исход === 'conflicted'
    && (await conceptById('c4')).provenance === 'Диоген Лаэртский, IX 1', 'conflicted, строка цела', rP2.исход);

  // запись, пришедшая семенем с несогласной сноской, не запирается целиком
  await withTransaction(pool, client => importSet(client, 'concepts', [
    { id: 'c5', label: 'Из семени', philosopher: 'ph1', rubrics: ['r1'], description: 'd', extendedDescription: 'утверждение[^f1]' }]));
  const { коммит: cS1 } = await createCommit(pool, { actor: редактор, message: 'рубрики',
    changes: conceptEdit('c5', { rubrics: { base: ['r1'], next: ['r1', 'r2'] } }) });
  const rS1 = await reviewCommit(pool, { actor: модератор, commitId: cS1.commitId, action: 'approve' });
  проверить('несогласная сноска из семени не запирает правку рубрик', rS1.исход === 'applied', 'applied', rS1.исход);
  const { коммит: cS2 } = await createCommit(pool, { actor: редактор, message: 'текст',
    changes: conceptEdit('c5', { extendedDescription: { base: 'утверждение[^f1]', next: 'утверждение, уточнённое[^f1]' } }) });
  const rS2 = await reviewCommit(pool, { actor: модератор, commitId: cS2.commitId, action: 'approve' });
  проверить('ВСТРЕЧНОЕ: правка текста с меткой без записи — всё ещё столкновение', rS2.исход === 'conflicted', 'conflicted', rS2.исход);

  // перенос семени проверяет те же правила и отказывает громко
  {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'семя-'));
    for (const f of fs.readdirSync(path.join(КОРЕНЬ, '..', 'app', 'data'))) fs.copyFileSync(path.join(КОРЕНЬ, '..', 'app', 'data', f), path.join(tmp, f));
    const cs = JSON.parse(fs.readFileSync(path.join(tmp, 'concepts.json'), 'utf8'));
    cs[0].extendedDescription += '[^q1]';
    fs.writeFileSync(path.join(tmp, 'concepts.json'), JSON.stringify(cs));
    let importOutput = '';
    try { execFileSync('node', [path.join(КОРЕНЬ, 'scripts', 'import-graph.mjs'), tmp], { encoding: 'utf8', env: process.env, stdio: 'pipe' }); importOutput = 'ПРИНЯТО'; }
    catch (e) { importOutput = String(e.stderr || e.message); }
    проверить('перенос несогласного семени отказывает с перечнем', importOutput.includes('не прошло правил') && importOutput.includes('[^q1]'),
      'отказ с меткой q1', importOutput.slice(0, 80));
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // ── РЕШАЕТСЯ ТО, ЧТО ВИДЕЛИ (26.09.2026) ─────────────────────────────
  // Одобрение несёт отпечаток увиденного; автор поправил коммит после того,
  // как рецензент его прочёл, — старый отпечаток не проходит.
  {
    const { коммит: seen } = await createCommit(pool, { actor: редактор, message: 'безобидная правка',
      changes: conceptEdit('c4', { description: { base: 'd', next: 'd, уточнено' } }) });
    const digestSeen = (await findCommit(pool, seen.commitId)).digest;
    await editOwnCommit(pool, { actor: редактор, commitId: seen.commitId,
      changes: conceptEdit('c4', { description: { base: 'd', next: 'совсем другое' } }) });
    const stale = await отказ(() => reviewCommit(pool, { actor: модератор, commitId: seen.commitId,
      action: 'approve', seenDigest: digestSeen }));
    проверить('одобрение со СТАРЫМ отпечатком отвергается — автор поправил коммит после прочтения',
      stale.includes('изменился') && (await findCommit(pool, seen.commitId)).status === 'pending'
      && (await conceptById('c4')).description === 'd', 'отказ; коммит ждёт; база цела', stale.slice(0, 60));
    const fresh = (await findCommit(pool, seen.commitId)).digest;
    проверить('отпечаток меняется вместе с содержанием коммита', fresh !== digestSeen, 'другой', fresh);
    const ok = await reviewCommit(pool, { actor: модератор, commitId: seen.commitId, action: 'approve', seenDigest: fresh });
    проверить('ВСТРЕЧНОЕ: со свежим отпечатком одобрение проходит', ok.исход === 'applied'
      && (await conceptById('c4')).description === 'совсем другое', 'applied', ok.исход);
  }

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
