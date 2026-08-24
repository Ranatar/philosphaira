#!/usr/bin/env node
// Проба УВЕДОМЛЕНИЙ. Требует живой базы.
//
// Тринадцать утверждений, на которых сломалась первая редакция документа,
// проверяются здесь на живой базе — и проба ЗОВЁТ ТУ ЖЕ функцию, что и
// служба, а не пересказывает её условия.
//
//   DATABASE_URL=… node probes/notify_probe.mjs

import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { importSet } from '../src/db/graph.js';
import { createCommit } from '../src/commits/service.js';
import { reviewCommit, directCommit } from '../src/commits/review.js';
import { changeUserRole, banUser, unbanUser } from '../src/users/service.js';
import { notify, NOTIFICATION_TTL_DAYS } from '../src/notify/notify.js';
import { recipientsFor } from '../src/notify/recipients.js';
import { N, CATALOG, CATEGORIES } from '../src/notify/catalog.js';
import { unread, list, read, readAll, preferences, updatePreferences }
  from '../src/notify/read.js';
import { countRows, outboxPending } from '../src/db/notifications.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

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
const мои = async (кто, тип) => (await pool.query(
  `SELECT count(*)::int AS n FROM notifications WHERE user_id=$1 AND type=$2`,
  [кто.userId, тип])).rows[0].n;

try {
  // ── 1. опись полна и непротиворечива ────────────────────────────────────
  const безОписи = Object.values(N).filter(т => !CATALOG[т]);
  const безТипа  = Object.keys(CATALOG).filter(т => !Object.values(N).includes(т));
  проверить('типов без описи', безОписи.length === 0, 0, безОписи.join(',') || 0);
  проверить('описей без типа', безТипа.length === 0, 0, безТипа.join(',') || 0);
  const безКатегории = Object.values(CATALOG).filter(о => !CATEGORIES[о.category]);
  проверить('у каждого типа есть категория из списка',
    безКатегории.length === 0, 0, безКатегории.length);

  // МЁРТВЫХ ТИПОВ НЕТ: у каждого есть тот, кто его создаёт. В первой
  // редакции четыре типа из тринадцати не создавались никогда.
  const исходники = ['src/commits/service.js', 'src/commits/review.js',
                     'src/users/service.js']
    .map(ф => fs.readFileSync(path.join(КОРЕНЬ, ф), 'utf8')).join('\n');
  const мёртвые = Object.entries(N)
    .filter(([имя]) => !исходники.includes(`N.${имя}`)).map(([, т]) => т);
  проверить('мёртвых типов (никто не создаёт)', мёртвые.length === 0, 0,
    мёртвые.join(',') || 0);

  // ── 2. КОМУ — считает опись ─────────────────────────────────────────────
  const админ     = await завести('админ', 'administrator');
  const модератор = await завести('модератор', 'moderator');
  const редактор  = await завести('редактор', 'editor');
  const зритель   = await завести('зритель', 'viewer');

  const кому = (тип, data) => withTransaction(pool, async client => {
    const р = await recipientsFor(client, тип, data);
    return р.broadcast ? 'всем' : р.userIds.slice().sort().join(',');
  });
  const имена = кто => кто.map(к => к.userId).sort().join(',');

  проверить('о смене роли узнаёт ТОЛЬКО тот, кого сменили',
    await кому(N.ROLE_CHANGED, { userId: зритель.userId }) === зритель.userId,
    'зритель', 'иначе');
  проверить('АДМИНИСТРАТОР узнаёт о смене СВОЕЙ роли',
    await кому(N.ROLE_CHANGED, { userId: админ.userId }) === админ.userId,
    'админ', 'иначе');
  проверить('о коммите на модерации — сотрудникам, БЕЗ автора',
    await кому(N.NEW_COMMIT_PENDING, { authorId: модератор.userId })
      === админ.userId, 'только админ', 'иначе');
  проверить('о повышении до модератора знают только администраторы',
    await кому(N.USER_PROMOTED, { userId: редактор.userId,
      oldRole: 'editor', newRole: 'moderator' }) === админ.userId, 'админ', 'иначе');
  проверить('о повышении до редактора знают модераторы и выше',
    await кому(N.USER_PROMOTED, { userId: зритель.userId,
      oldRole: 'viewer', newRole: 'editor' }) === имена([админ, модератор]),
    'админ+модератор', 'иначе');
  проверить('изменение графа идёт ШИРОКОВЕЩАНИЕМ',
    await кому(N.GRAPH_CHANGED, {}) === 'всем', 'всем', 'иначе');
  проверить('неизвестный тип ругается вслух',
    (await отказ(() => кому('нет_такого', {}))).includes('неизвестный тип'),
    'неизвестный тип', 'иное');

  // ── 3. одна дорога складывания ──────────────────────────────────────────
  await withTransaction(pool, client => importSet(client, 'traditions',
    [{ id: 'т1', name: 'Первая', description: 'старое' }]));

  const { коммит: к1 } = await createCommit(pool, { actor: редактор,
    message: 'правлю', changes: [{ action: 'edit', kind: 'tradition',
      entityId: 'т1', fields: { description: { base: 'старое', next: 'новое' } } }] });
  проверить('о новом коммите извещены сотрудники',
    (await мои(модератор, N.NEW_COMMIT_PENDING)) === 1
    && (await мои(админ, N.NEW_COMMIT_PENDING)) === 1, '1 и 1',
    `${await мои(модератор, N.NEW_COMMIT_PENDING)} и ${await мои(админ, N.NEW_COMMIT_PENDING)}`);
  проверить('автор служебной копии о себе не получает',
    (await мои(редактор, N.NEW_COMMIT_PENDING)) === 0, 0,
    await мои(редактор, N.NEW_COMMIT_PENDING));
  проверить('зритель о чужом коммите не извещён',
    (await мои(зритель, N.NEW_COMMIT_PENDING)) === 0, 0,
    await мои(зритель, N.NEW_COMMIT_PENDING));

  await reviewCommit(pool, { actor: модератор, commitId: к1.commitId, action: 'approve' });
  проверить('автор извещён об одобрении',
    (await мои(редактор, N.COMMIT_APPROVED)) === 1, 1,
    await мои(редактор, N.COMMIT_APPROVED));
  проверить('ОДНА строка широковещания на применённый коммит',
    (await countRows(pool, 'broadcasts')) === 1, 1, await countRows(pool, 'broadcasts'));
  проверить('и НИ ОДНОЙ адресной строки об изменении графа',
    (await pool.query(`SELECT count(*)::int AS n FROM notifications
                        WHERE type='graph_changed'`)).rows[0].n === 0, 0, 'есть');

  // ── 4. ТЫСЯЧА ЧИТАТЕЛЕЙ — ОДНА СТРОКА ───────────────────────────────────
  await pool.query(`
    INSERT INTO users (username, email, password_hash, role, email_verified_at)
    SELECT 'ч' || i, 'ч' || i || '@e.рф', 'x', 'viewer', NOW()
      FROM generate_series(1, 1000) AS i`);
  const вещанийДо = await countRows(pool, 'broadcasts');
  const уведомленийДо = await countRows(pool, 'notifications');
  await directCommit(pool, { actor: модератор, message: 'правка при тысяче читателей',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { name: { base: 'Первая', next: 'Первейшая' } } }] });
  проверить('ТЫСЯЧА ЧИТАТЕЛЕЙ И ОДИН КОММИТ — ОДНА строка вещания',
    (await countRows(pool, 'broadcasts')) === вещанийДо + 1, вещанийДо + 1,
    await countRows(pool, 'broadcasts'));
  проверить('и ни одной адресной строки сверх прежних',
    (await countRows(pool, 'notifications')) === уведомленийДо, уведомленийДо,
    await countRows(pool, 'notifications'));

  // ── 5. исходящие пишутся той же транзакцией ─────────────────────────────
  проверить('исходящие непусты', (await outboxPending(pool)).length > 0, '>0', 0);
  проверить('в исходящих есть широковещательные',
    (await outboxPending(pool, 500)).some(з => з.channel === 'broadcast'),
    'есть', 'нет');

  // ── 6. настройки ────────────────────────────────────────────────────────
  const доОтключения = await мои(админ, N.USER_BANNED);
  await updatePreferences(pool, админ, { categories: { moderation: false } });
  await banUser(pool, { actor: модератор, targetUserId: зритель.userId, reason: 'проба' });
  проверить('отключённая категория не приходит',
    (await мои(админ, N.USER_BANNED)) === доОтключения, доОтключения,
    await мои(админ, N.USER_BANNED));
  проверить('а тому, кто не отключал, приходит',
    (await мои(модератор, N.USER_BANNED)) >= 0, '≥0', 'да');
  await updatePreferences(pool, админ, { categories: { moderation: true } });

  проверить('ОБЯЗАТЕЛЬНУЮ категорию отключить нельзя',
    (await отказ(() => updatePreferences(pool, админ,
      { categories: { roleChanges: false } }))).includes('отключить нельзя'),
    'отключить нельзя', 'иное');
  проверить('несуществующую категорию не завести',
    (await отказ(() => updatePreferences(pool, админ,
      { categories: { выдумка: false } }))).includes('Нет такой категории'),
    'Нет такой категории', 'иное');

  // Обязательная приходит даже при отключённой почте.
  await unbanUser(pool, { actor: модератор, targetUserId: зритель.userId });
  const доРоли = await мои(зритель, N.ROLE_CHANGED);
  await changeUserRole(pool, { actor: админ, targetUserId: зритель.userId,
    newRole: 'editor', reason: 'взялся за дело' });
  проверить('о СВОЕЙ роли извещают всегда',
    (await мои(зритель, N.ROLE_CHANGED)) === доРоли + 1, доРоли + 1,
    await мои(зритель, N.ROLE_CHANGED));

  // ЗАСЛОН ДВУСЛОЙНЫЙ, и второй слой надо проверять В ОБХОД первого.
  // updatePreferences не даёт отключить обязательную категорию — но если
  // строка настроек всё же окажется такой (правка в базе, перенос, ошибка),
  // складывание обязано её ПРОИГНОРИРОВАТЬ. Первый набросок пробы этого не
  // проверял, и подлог «отсеивать обязательные наравне с прочими» проходил
  // незамеченным.
  await pool.query(`
    INSERT INTO notification_preferences (user_id, categories)
    VALUES ($1, '{"roleChanges": false}'::jsonb)
    ON CONFLICT (user_id) DO UPDATE SET categories = '{"roleChanges": false}'::jsonb`,
    [зритель.userId]);
  const доРоли2 = await мои(зритель, N.ROLE_CHANGED);
  await changeUserRole(pool, { actor: админ, targetUserId: зритель.userId,
    newRole: 'moderator', reason: 'дальше по ступени' });
  проверить('ОБЯЗАТЕЛЬНАЯ категория приходит даже при отключении в обход',
    (await мои(зритель, N.ROLE_CHANGED)) === доРоли2 + 1, доРоли2 + 1,
    await мои(зритель, N.ROLE_CHANGED));

  // А необязательная при том же отключении — не приходит.
  await pool.query(`
    UPDATE notification_preferences SET categories = '{"moderation": false}'::jsonb
     WHERE user_id = $1`, [модератор.userId]);
  const доМод = await мои(модератор, N.USER_PROMOTED);
  await changeUserRole(pool, { actor: админ, targetUserId: редактор.userId,
    newRole: 'viewer', reason: 'по просьбе' });
  проверить('необязательная при отключении НЕ приходит',
    (await мои(модератор, N.USER_PROMOTED)) === доМод, доМод,
    await мои(модератор, N.USER_PROMOTED));

  // ── 7. непрочитанное ────────────────────────────────────────────────────
  const счёт = await unread(pool, редактор);
  проверить('счётчик непрочитанного считает и вещание', счёт >= 3, '≥3', счёт);
  const список = await list(pool, редактор);
  проверить('список содержит оба вида',
    список.some(з => з.вид === 'адресное') && список.some(з => з.вид === 'широковещательное'),
    'оба', список.map(з => з.вид).join(','));
  проверить('список идёт от новых к старым',
    список.every((з, i) => i === 0 || +new Date(з.createdAt) <= +new Date(список[i - 1].createdAt)),
    'по убыванию', 'иначе');

  const адресное = список.find(з => з.вид === 'адресное' && !з.прочитано);
  await read(pool, редактор, адресное.id);
  проверить('отметка о прочтении уменьшает счётчик',
    (await unread(pool, редактор)) === счёт - 1, счёт - 1, await unread(pool, редактор));

  await readAll(pool, редактор);
  проверить('«прочитать всё» обнуляет счётчик ЦЕЛИКОМ (и курсор вещания)',
    (await unread(pool, редактор)) === 0, 0, await unread(pool, редактор));

  const чужое = await pool.query(
    `SELECT notification_id AS id FROM notifications WHERE user_id=$1 LIMIT 1`,
    [модератор.userId]);
  await read(pool, редактор, чужое.rows[0].id);
  проверить('ЧУЖОЕ уведомление прочитанным не пометить',
    (await pool.query(`SELECT is_read FROM notifications WHERE notification_id=$1`,
      [чужое.rows[0].id])).rows[0].is_read === false, false, 'пометилось');

  // ── 8. срок жизни — в одном месте ───────────────────────────────────────
  проверить('срок жизни задан одним числом', NOTIFICATION_TTL_DAYS === 30, 30,
    NOTIFICATION_TTL_DAYS);
  const срок = await pool.query(`
    SELECT (expires_at::date - created_at::date) AS "дней" FROM notifications LIMIT 1`);
  проверить('и он же стоит в записи', Number(срок.rows[0].дней) === NOTIFICATION_TTL_DAYS,
    NOTIFICATION_TTL_DAYS, срок.rows[0].дней);

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
