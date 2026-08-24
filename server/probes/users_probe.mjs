#!/usr/bin/env node
// Проба УПРАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯМИ. Требует живой базы.
//
// Главное здесь — гонка последнего администратора, проверенная ДВУМЯ
// СОЕДИНЕНИЯМИ. Заслон 1.2 умеет её держать, но до сих пор этому верили
// на слово: рассуждение о FOR UPDATE — не замер.
//
//   DATABASE_URL=… MFA_SECRET_KEY=… node probes/users_probe.mjs

import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register } from '../src/auth/service.js';
import { findById, roleHistory, auditEntries } from '../src/db/users.js';
import { sessionByToken } from '../src/db/sessions.js';
import { changeUserRole, banUser, unbanUser, deleteUser, listUsers, allowedRoles }
  from '../src/users/service.js';
import { assertNotLastAdministrator } from '../src/access/last-admin.js';
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

// Полноправный: подтверждённая почта и заведённый второй шаг. Иначе права
// срезаны, и проба мерила бы не то, что думает.
async function завести(имя, роль) {
  const { user } = await register(pool, {
    username: имя, email: `${имя}@e.рф`, password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role = $1, email_verified_at = NOW(),
                                     mfa_enabled = TRUE WHERE user_id = $2`,
    [роль, user.userId]);
  return findById(pool, user.userId);
}

try {
  const админ    = await завести('админ', 'administrator');
  const модератор = await завести('модератор', 'moderator');
  const редактор  = await завести('редактор', 'editor');
  const зритель   = await завести('зритель', 'viewer');

  // ── 1. смена роли ───────────────────────────────────────────────────────
  проверить('причина обязательна на сервере',
    (await отказ(() => changeUserRole(pool, { actor: админ,
      targetUserId: зритель.userId, newRole: 'editor', reason: '  ' }))).includes('Причина'),
    'Причина', 'иное');

  const стал = await changeUserRole(pool, { actor: админ,
    targetUserId: зритель.userId, newRole: 'editor', reason: 'взялся за дело' });
  проверить('роль изменилась', стал.role === 'editor', 'editor', стал.role);
  проверить('возвращается СВЕЖЕЕ состояние, а не правленый объект',
    стал.level === 2, 2, стал.level);

  const история = await roleHistory(pool, зритель.userId);
  проверить('история роли записана', история.length === 1, 1, история.length);
  проверить('в истории есть причина', история[0].reason === 'взялся за дело',
    'взялся за дело', история[0].reason);
  проверить('в истории назван тот, кто менял', история[0].changedBy === 'админ',
    'админ', история[0].changedBy);

  const журнал = await auditEntries(pool, { action: 'user.role_change' });
  проверить('журнал пишется той же транзакцией', журнал.length === 1, 1, журнал.length);

  // ── 2. отношения ────────────────────────────────────────────────────────
  проверить('модератор не двигает роль администратора',
    (await отказ(() => changeUserRole(pool, { actor: модератор,
      targetUserId: админ.userId, newRole: 'viewer', reason: 'ни к чему' })))
      !== 'ПРОШЛО', 'отказ', 'прошло');
  проверить('модератор двигает редактора вниз', (await changeUserRole(pool, {
    actor: модератор, targetUserId: редактор.userId, newRole: 'viewer',
    reason: 'по просьбе' })).role === 'viewer', 'viewer', 'иное');
  проверить('над собой роль не меняют',
    (await отказ(() => changeUserRole(pool, { actor: админ,
      targetUserId: админ.userId, newRole: 'viewer', reason: 'зачем-то' })))
      .includes('над собой'), 'над собой', 'иное');

  // ── 3. понижение снимает сессии ─────────────────────────────────────────
  const { user: временный } = await register(pool, {
    username: 'временный', email: 'vr@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='moderator' WHERE user_id=$1`,
    [временный.userId]);
  const { токен } = await (await import('../src/auth/service.js'))
    .login(pool, { email: 'vr@e.рф', password: ПАРОЛЬ });
  проверить('сессия жива до понижения', !!(await sessionByToken(pool, токен)), 'жива', 'нет');
  await changeUserRole(pool, { actor: админ, targetUserId: временный.userId,
    newRole: 'viewer', reason: 'понижение' });
  проверить('понижение гасит сессии', !(await sessionByToken(pool, токен)),
    'погашены', 'жива');

  // ── 4. бан ──────────────────────────────────────────────────────────────
  const { токен: токенР } = await (await import('../src/auth/service.js'))
    .login(pool, { email: 'редактор@e.рф', password: ПАРОЛЬ });
  await banUser(pool, { actor: модератор, targetUserId: редактор.userId,
    reason: 'нарушал' });
  const забанен = await findById(pool, редактор.userId);
  проверить('бан поставлен', забанен.isBanned === true, true, забанен.isBanned);
  проверить('причина бана видна', забанен.banReason === 'нарушал', 'нарушал', забанен.banReason);
  проверить('бан гасит сессии ТОЙ ЖЕ транзакцией',
    !(await sessionByToken(pool, токенР)), 'погашены', 'жива');
  проверить('дважды забанить нельзя',
    (await отказ(() => banUser(pool, { actor: модератор,
      targetUserId: редактор.userId, reason: 'ещё раз' }))).includes('уже забанен'),
    'уже забанен', 'иное');
  проверить('бан без причины не проходит',
    (await отказ(() => banUser(pool, { actor: модератор,
      targetUserId: зритель.userId, reason: '' }))).includes('Причина'), 'Причина', 'иное');
  проверить('себя не банят',
    (await отказ(() => banUser(pool, { actor: админ,
      targetUserId: админ.userId, reason: 'зачем-то' }))).includes('над собой'),
    'над собой', 'иное');

  // ── 5. разбан ───────────────────────────────────────────────────────────
  const второйАдмин = await завести('второй', 'administrator');
  await banUser(pool, { actor: админ, targetUserId: второйАдмин.userId,
    reason: 'проба' });
  проверить('МОДЕРАТОР НЕ СНИМАЕТ БАН С АДМИНИСТРАТОРА',
    (await отказ(() => unbanUser(pool, { actor: модератор,
      targetUserId: второйАдмин.userId }))) !== 'ПРОШЛО', 'отказ', 'прошло');
  await unbanUser(pool, { actor: админ, targetUserId: второйАдмин.userId });
  проверить('администратор бан снимает',
    (await findById(pool, второйАдмин.userId)).isBanned === false, false, 'да');
  проверить('незабаненного не разбанить',
    (await отказ(() => unbanUser(pool, { actor: админ,
      targetUserId: второйАдмин.userId }))).includes('не забанен'), 'не забанен', 'иное');

  // ── 6. ГОНКА ПОСЛЕДНЕГО АДМИНИСТРАТОРА, ДВА СОЕДИНЕНИЯ ──────────────────
  // Администраторов ровно двое. Оба понижаются ОДНОВРЕМЕННО, каждый своим
  // соединением. Пройти должно ровно одно: иначе администраторов не
  // останется вовсе, а это состояние, из которого нет выхода.
  const { rows: [{ n: сколькоАдминов }] } = await pool.query(
    `SELECT count(*)::int AS n FROM users WHERE role = 'administrator'
       AND is_active AND NOT is_banned AND deleted_at IS NULL`);
  проверить('администраторов ровно двое', сколькоАдминов === 2, 2, сколькоАдминов);

  // Гонку надо ставить ВРУЧНУЮ, двумя соединениями и с проверкой ожидания.
  // Первый набросок пускал два понижения через Promise.all и был зелёным
  // даже со снятой блокировкой: заходы попросту не накладывались во времени.
  // Подлог это вскрыл — и заодно вскрыл настоящий изъян заслона.
  const A = админ.userId, B = второйАдмин.userId;
  const cA = await pool.connect(), cB = await pool.connect();
  let состояниеB = 'ждёт';
  try {
    await cA.query('BEGIN'); await cB.query('BEGIN');
    await assertNotLastAdministrator(cA, { userId: A, newRole: 'viewer' });
    проверить('первая сделка проходит заслон', true, 'проходит', 'проходит');

    const bПромис = assertNotLastAdministrator(cB, { userId: B, newRole: 'viewer' })
      .then(() => { состояниеB = 'ПРОПУСТИЛ'; })
      .catch(e => { состояниеB = e.message.includes('последний действующий')
        ? 'отказал' : 'иное: ' + e.message.slice(0, 40); });

    await new Promise(r => setTimeout(r, 500));
    проверить('ВТОРАЯ СДЕЛКА ЖДЁТ ПЕРВУЮ (блокировка держит)',
      состояниеB === 'ждёт', 'ждёт', состояниеB);

    await cA.query(`UPDATE users SET role='viewer', role_changed_at=NOW()
                     WHERE user_id=$1`, [A]);
    await cA.query('COMMIT');
    await bПромис;
    проверить('дождавшись, вторая ОТКАЗЫВАЕТ по правилу, а не по сроку',
      состояниеB === 'отказал', 'отказал', состояниеB);
    await cB.query('ROLLBACK');
  } finally { cA.release(); cB.release(); }

  const { rows: [{ n: осталось }] } = await pool.query(
    `SELECT count(*)::int AS n FROM users WHERE role = 'administrator'
       AND is_active AND NOT is_banned AND deleted_at IS NULL`);
  проверить('АДМИНИСТРАТОР ОСТАЛСЯ', осталось === 1, 1, осталось);

  // ── 7. мягкое удаление ──────────────────────────────────────────────────
  const живойАдмин = (await findById(pool, админ.userId))?.role === 'administrator'
    ? админ : второйАдмин;
  const жертва = await завести('жертва', 'editor');
  await deleteUser(pool, { actor: живойАдмин, targetUserId: жертва.userId });
  проверить('удалённый не находится', !(await findById(pool, жертва.userId)),
    'не находится', 'находится');
  const { rows: [строкаУд] } = await pool.query(
    `SELECT username, email, is_active FROM users WHERE user_id = $1`, [жертва.userId]);
  проверить('запись осталась ради авторства коммитов', !!строкаУд, 'осталась', 'нет');
  проверить('логин освобождён', строкаУд.username.startsWith('deleted_'),
    'deleted_…', строкаУд.username);
  проверить('почта освобождена', строкаУд.email.endsWith('@invalid'),
    '@invalid', строкаУд.email);
  const снова = await отказ(() => register(pool, {
    username: 'жертва', email: 'жертва@e.рф', password: ПАРОЛЬ }));
  проверить('освобождённое имя можно занять заново', снова === 'ПРОШЛО', 'ПРОШЛО', снова);

  проверить('модератор не удаляет',
    (await отказ(() => deleteUser(pool, { actor: модератор,
      targetUserId: зритель.userId }))) !== 'ПРОШЛО', 'отказ', 'прошло');

  // ── 8. список ───────────────────────────────────────────────────────────
  const список = await listUsers(pool, { actor: живойАдмин, page: 1, limit: 3 });
  проверить('список отдаёт items и pagination',
    Array.isArray(список.items) && !!список.pagination, 'оба', Object.keys(список).join(','));
  проверить('limit соблюдается', список.items.length === 3, 3, список.items.length);
  проверить('удалённые в список не попадают',
    !список.items.some(u => u.username.startsWith('deleted_')), 'нет', 'есть');
  const поРоли = await listUsers(pool, { actor: живойАдмин, role: 'moderator' });
  проверить('отбор по роли работает',
    поРоли.items.every(u => u.role === 'moderator'), 'все модераторы', 'нет');
  проверить('редактор списка не видит',
    (await отказ(() => listUsers(pool, { actor: редактор }))) !== 'ПРОШЛО', 'отказ', 'прошло');
  проверить('администратор видит почту в списке',
    список.items.every(u => u.email !== undefined), 'видит', 'нет');

  // ── 9. допустимые роли считает сервер ───────────────────────────────────
  // Берём СВЕЖЕГО зрителя: тот, что заведён в начале, к этому месту уже
  // повышен, и список для него законно короче. Первый набросок пробы этого
  // не учёл и покраснел — правильно покраснел.
  const свежийЗритель = await завести('новичок', 'viewer');
  const зр = await findById(pool, свежийЗритель.userId);
  проверить('модератору доступен только подъём до editor',
    allowedRoles(модератор, зр).join(',') === 'editor',
    'editor', allowedRoles(модератор, зр).join(','));
  проверить('администратору доступны все ступени, кроме нынешней',
    allowedRoles(живойАдмин, зр).sort().join(',') === 'administrator,editor,moderator',
    'administrator,editor,moderator', allowedRoles(живойАдмин, зр).sort().join(','));
  проверить('нынешней роли в списке нет',
    !allowedRoles(живойАдмин, зр).includes(зр.role), 'нет', 'есть');
  проверить('над собой список пуст',
    allowedRoles(живойАдмин, живойАдмин).length === 0, 0,
    allowedRoles(живойАдмин, живойАдмин).length);

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
