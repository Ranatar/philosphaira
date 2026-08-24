#!/usr/bin/env node
// Проба КОММИТОВ ДО РАССМОТРЕНИЯ. Требует живой базы.
//
//   DATABASE_URL=… node probes/commits_probe.mjs

import { создатьПул } from '../src/db/pool.js';
import { register } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { createCommit, editOwnCommit, deleteOwnCommit, listMine, listPending,
         getCommit, assertChanges } from '../src/commits/service.js';
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

// Откат ДО ПУСТОГО МЕСТА, а не заданное число раз: числом был счёт миграций
// на день написания пробы, и с каждой новой миграцией проба начинала
// оставлять хвост — а на хвосте она падает не там, где смотрят.
while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = создатьПул();
const ПАРОЛЬ = 'вполне-длинный-пароль';

async function завести(имя, роль) {
  const { user } = await register(pool, {
    username: имя, email: `${имя}@e.рф`, password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role = $1, email_verified_at = NOW(),
                                     mfa_enabled = TRUE WHERE user_id = $2`,
    [роль, user.userId]);
  return findById(pool, user.userId);
}

const правка = (поле, было, стало, id = 'harmony_spheres') => ([{
  action: 'edit', kind: 'concept', entityId: id,
  fields: { [поле]: { base: было, next: стало } },
}]);

try {
  const редактор  = await завести('редактор', 'editor');
  const второй    = await завести('второй', 'editor');
  const зритель   = await завести('зритель', 'viewer');
  const модератор = await завести('модератор', 'moderator');
  const неподтв   = await завести('неподтв', 'editor');
  await pool.query(`UPDATE users SET email_verified_at = NULL WHERE username = 'неподтв'`);
  const неподтверждённый = await findById(pool, неподтв.userId);

  // ── 1. кто вправе создавать ─────────────────────────────────────────────
  проверить('зритель коммитов не создаёт',
    (await отказ(() => createCommit(pool, { actor: зритель,
      message: 'проба', changes: правка('description', 'а', 'б') }))) !== 'ПРОШЛО',
    'отказ', 'прошло');
  проверить('неподтверждённый адрес коммитов не создаёт',
    (await отказ(() => createCommit(pool, { actor: неподтверждённый,
      message: 'проба', changes: правка('description', 'а', 'б') }))) !== 'ПРОШЛО',
    'отказ', 'прошло');

  // ── 2. разбор описания: отказ поимённый ─────────────────────────────────
  const дурное = [
    ['пустой список', []],
    ['неизвестное действие', [{ action: 'жечь', kind: 'concept', entityId: 'x', fields: {} }]],
    ['неизвестный род', [{ action: 'edit', kind: 'дракон', entityId: 'x', fields: { a: { base: 1, next: 2 } } }]],
    ['пустой адрес', [{ action: 'edit', kind: 'concept', entityId: '  ', fields: { a: { base: 1, next: 2 } } }]],
    ['правка без полей', [{ action: 'edit', kind: 'concept', entityId: 'x', fields: {} }]],
    ['удаление с полями', [{ action: 'delete', kind: 'concept', entityId: 'x', fields: { a: { base: 1, next: 2 } } }]],
    ['поле без «было»', [{ action: 'edit', kind: 'concept', entityId: 'x', fields: { a: { next: 2 } } }]],
    ['одна сущность дважды', [
      { action: 'edit', kind: 'concept', entityId: 'x', fields: { a: { base: 1, next: 2 } } },
      { action: 'edit', kind: 'concept', entityId: 'x', fields: { b: { base: 1, next: 2 } } }]],
  ];
  for (const [имя, ч] of дурное) {
    проверить(`описание отвергается: ${имя}`,
      (await отказ(() => assertChanges(ч))) !== 'ПРОШЛО', 'отказ', 'прошло');
  }
  проверить('годное описание проходит',
    (await отказ(() => assertChanges(правка('description', 'а', 'б')))) === 'ПРОШЛО',
    'ПРОШЛО', 'отказ');
  проверить('коммит без сообщения не создаётся',
    (await отказ(() => createCommit(pool, { actor: редактор, message: '  ',
      changes: правка('description', 'а', 'б') }))).includes('без сообщения'),
    'без сообщения', 'иное');

  // ── 3. создание ─────────────────────────────────────────────────────────
  const { коммит: первый, пересечения: п0 } = await createCommit(pool, {
    actor: редактор, message: 'уточнил описание',
    changes: правка('description', 'старое', 'новое') });
  проверить('коммит создан ожидающим', первый.status === 'pending', 'pending', первый.status);
  проверить('автор записан', первый.authorId === редактор.userId, 'редактор', первый.authorId);
  проверить('оба значения поля сохранены',
    первый.changes[0].fields.description.base === 'старое'
    && первый.changes[0].fields.description.next === 'новое', 'оба', 'нет');
  проверить('пересечений нет', п0.length === 0, 0, п0.length);

  // ── 4. предупреждение о чужой правке ТОГО ЖЕ ПОЛЯ ───────────────────────
  const { пересечения: п1 } = await createCommit(pool, {
    actor: второй, message: 'и я про описание',
    changes: правка('description', 'старое', 'третье') });
  проверить('чужая правка того же поля даёт предупреждение', п1.length === 1, 1, п1.length);
  проверить('в предупреждении назван автор', п1[0]?.authorName === 'редактор',
    'редактор', п1[0]?.authorName);
  проверить('и названо поле', п1[0]?.поля.join(',') === 'description',
    'description', п1[0]?.поля.join(','));

  const { пересечения: п2 } = await createCommit(pool, {
    actor: второй, message: 'а я про рубрики',
    changes: правка('rubrics', ['a'], ['a', 'b']) });
  проверить('чужая правка ДРУГОГО поля предупреждения не даёт', п2.length === 0, 0, п2.length);

  const { пересечения: п3 } = await createCommit(pool, {
    actor: второй, message: 'удаляю целиком',
    changes: [{ action: 'delete', kind: 'concept', entityId: 'harmony_spheres', fields: {} }] });
  проверить('удаление против правки предупреждение ДАЁТ', п3.length >= 1, '≥1', п3.length);

  // ── 5. правка своего ────────────────────────────────────────────────────
  const правленый = await editOwnCommit(pool, { actor: редактор,
    commitId: первый.commitId, message: 'уточнил ещё раз' });
  проверить('своё сообщение правится', правленый.message === 'уточнил ещё раз',
    'уточнил ещё раз', правленый.message);
  проверить('описание сохранилось при правке одного сообщения',
    правленый.changes[0].fields.description.next === 'новое', 'новое',
    правленый.changes[0].fields.description.next);

  проверить('ЧУЖОЙ КОММИТ НЕ ПРАВИТСЯ',
    (await отказ(() => editOwnCommit(pool, { actor: второй,
      commitId: первый.commitId, message: 'подменю' })))
      .includes('среди ваших ожидающих'), 'среди ваших', 'иное');
  проверить('ответ о чужом и о несуществующем ОДИНАКОВ',
    (await отказ(() => editOwnCommit(pool, { actor: второй,
      commitId: первый.commitId, message: 'x' })))
    === (await отказ(() => editOwnCommit(pool, { actor: второй,
      commitId: '00000000-0000-0000-0000-000000000000', message: 'x' }))),
    'одинаков', 'различен');
  проверить('негодное описание при правке отвергается',
    (await отказ(() => editOwnCommit(pool, { actor: редактор,
      commitId: первый.commitId, changes: [] }))) !== 'ПРОШЛО', 'отказ', 'прошло');

  // ── 6. видимость ────────────────────────────────────────────────────────
  const свои = await listMine(pool, { actor: второй });
  проверить('свой список показывает только свои',
    свои.items.every(к => к.authorId === второй.userId), 'только свои', 'нет');
  проверить('редактор очереди НЕ видит',
    (await отказ(() => listPending(pool, { actor: редактор }))) !== 'ПРОШЛО',
    'отказ', 'прошло');
  const очередь = await listPending(pool, { actor: модератор });
  проверить('модератор видит очередь', очередь.items.length >= 4, '≥4', очередь.items.length);
  проверить('очередь идёт от старых к новым',
    +new Date(очередь.items[0].createdAt) <= +new Date(очередь.items[1].createdAt),
    'по возрастанию', 'иначе');

  проверить('свой коммит виден автору',
    (await getCommit(pool, { actor: редактор, commitId: первый.commitId })).commitId
      === первый.commitId, 'виден', 'нет');
  проверить('ЧУЖОЙ ОЖИДАЮЩИЙ РЕДАКТОРУ НЕ ВИДЕН',
    (await отказ(() => getCommit(pool, { actor: второй, commitId: первый.commitId })))
      !== 'ПРОШЛО', 'отказ', 'прошло');
  проверить('модератору чужой ожидающий виден',
    (await getCommit(pool, { actor: модератор, commitId: первый.commitId })).status
      === 'pending', 'pending', 'иное');

  // ── 7. ЗАСЛОНЫ СХЕМЫ — в обход службы ───────────────────────────────────
  const себеРецензент = await отказ(() => pool.query(`
    UPDATE commits SET reviewed_by = author_id, reviewed_at = NOW()
     WHERE commit_id = $1`, [первый.commitId]));
  проверить('СХЕМА не даёт записать себя рецензентом',
    себеРецензент.includes('commits_no_self_review_ck'),
    'commits_no_self_review_ck', себеРецензент.slice(0, 42));

  const отказБезСлова = await отказ(() => pool.query(`
    UPDATE commits SET status = 'rejected' WHERE commit_id = $1`, [первый.commitId]));
  проверить('СХЕМА не даёт отклонить без комментария',
    отказБезСлова.includes('commits_rejected_needs_comment_ck'),
    'commits_rejected_needs_comment_ck', отказБезСлова.slice(0, 42));

  const пустоеОписание = await отказ(() => pool.query(`
    INSERT INTO commits (author_id, message, changes) VALUES ($1, 'x', '[]'::jsonb)`,
    [редактор.userId]));
  проверить('СХЕМА не даёт пустое описание',
    пустоеОписание.includes('changes'), 'отказ по changes', пустоеОписание.slice(0, 42));

  const пустоеСообщение = await отказ(() => pool.query(`
    INSERT INTO commits (author_id, message, changes)
    VALUES ($1, '   ', '[{"action":"delete","kind":"concept","entityId":"x"}]'::jsonb)`,
    [редактор.userId]));
  проверить('СХЕМА не даёт пустое сообщение',
    пустоеСообщение.includes('message'), 'отказ по message', пустоеСообщение.slice(0, 42));

  // Прямая правка обладателем права — НЕ самоодобрение: рецензент пуст.
  const прямая = await отказ(() => pool.query(`
    UPDATE commits SET status = 'applied', applied_at = NOW()
     WHERE commit_id = $1`, [первый.commitId]));
  проверить('прямая правка (без рецензента) схемой допускается',
    прямая === 'ПРОШЛО', 'ПРОШЛО', прямая.slice(0, 42));
  await pool.query(`UPDATE commits SET status='pending', applied_at=NULL
                     WHERE commit_id = $1`, [первый.commitId]);

  // ── 8. удаление своего ──────────────────────────────────────────────────
  проверить('чужой коммит не удаляется',
    (await отказ(() => deleteOwnCommit(pool, { actor: второй,
      commitId: первый.commitId }))) !== 'ПРОШЛО', 'отказ', 'прошло');
  await deleteOwnCommit(pool, { actor: редактор, commitId: первый.commitId });
  проверить('свой коммит удаляется',
    (await отказ(() => getCommit(pool, { actor: редактор, commitId: первый.commitId })))
      .includes('не найден'), 'не найден', 'иное');

  // Рассмотренный уже не свой в этом смысле: править и удалять нечего.
  const { коммит: закрытый } = await createCommit(pool, { actor: редактор,
    message: 'будет отклонён', changes: правка('label', 'а', 'б') });
  await pool.query(`UPDATE commits SET status='rejected', review_comment='не то',
                     reviewed_by=$2, reviewed_at=NOW() WHERE commit_id=$1`,
    [закрытый.commitId, модератор.userId]);
  проверить('РАССМОТРЕННЫЙ коммит автор уже не правит',
    (await отказ(() => editOwnCommit(pool, { actor: редактор,
      commitId: закрытый.commitId, message: 'передумал' }))) !== 'ПРОШЛО',
    'отказ', 'прошло');
  проверить('и не удаляет',
    (await отказ(() => deleteOwnCommit(pool, { actor: редактор,
      commitId: закрытый.commitId }))) !== 'ПРОШЛО', 'отказ', 'прошло');
  проверить('но видит в своей истории',
    (await listMine(pool, { actor: редактор, status: 'rejected' })).items.length === 1,
    1, (await listMine(pool, { actor: редактор, status: 'rejected' })).items.length);

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
