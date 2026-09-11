#!/usr/bin/env node
// Проба ВХОДА. Требует живой базы.
//
// Спрашивает то, на чём сломалась первая редакция: работает ли токен сразу
// после регистрации, отзывается ли сессия, одинаково ли отвечают неизвестный
// адрес и неверный пароль, узнаётся ли бан до пароля.
//
//   DATABASE_URL=… node probes/auth_probe.mjs

import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { userFromRow } from '../src/db/mapper.js';
import { register, login, logout, logoutAll, verifyEmail } from '../src/auth/service.js';
import { sessionByToken, revokeAllSessions, createSession } from '../src/db/sessions.js';
import { hashPassword, verifyPassword, assertPasswordPolicy, DUMMY_HASH }
  from '../src/auth/password.js';
import { noteFailure, isBruteForce, resetCounter, clearCounters, LIMIT }
  from '../src/auth/throttle.js';
import { checkCsrf, newCsrfToken } from '../src/http/cookies.js';
import { can } from '../src/access/access.js';
import { P } from '../src/access/roles.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (setName, finite, ждали, вышло) =>
  проверки.push({ имя: setName, годно: !!finite, ждали, вышло });
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

try {
  // ── 1. политика пароля проверяется на сервере ───────────────────────────
  проверить('короткий пароль не проходит',
    (await отказ(() => assertPasswordPolicy('коротко'))).includes('короче'),
    'короче', await отказ(() => assertPasswordPolicy('коротко')));
  проверить('пароль с пробелом по краю не проходит',
    (await отказ(() => assertPasswordPolicy(' ' + ПАРОЛЬ))).includes('пробел'),
    'пробел', 'иное');
  проверить('частый пароль не проходит',
    (await отказ(() => assertPasswordPolicy('administrator'))).includes('частый'),
    'частый', 'иное');

  // ── 2. хеш пароля ───────────────────────────────────────────────────────
  const passwordHash = await hashPassword(ПАРОЛЬ);
  проверить('хеш argon2id', passwordHash.startsWith('$argon2id$'), '$argon2id$', passwordHash.slice(0, 10));
  проверить('верный пароль сходится', await verifyPassword(passwordHash, ПАРОЛЬ), true, 'да');
  проверить('неверный не сходится', !(await verifyPassword(passwordHash, ПАРОЛЬ + 'x')), true, 'да');
  проверить('битый хеш не роняет, а не сходится',
    (await verifyPassword('не хеш вовсе', ПАРОЛЬ)) === false, false, 'да');
  проверить('холостой хеш не подходит ни к чему',
    (await verifyPassword(DUMMY_HASH, ПАРОЛЬ)) === false, false, 'да');

  // ── 3. регистрация ──────────────────────────────────────────────────────
  const первый = await register(pool, {
    username: 'иван', email: 'ivan@e.рф', password: ПАРОЛЬ });
  проверить('регистрация даёт токен', !!первый.токен, 'токен', первый.токен ? 'есть' : 'нет');
  проверить('новичок — зритель', первый.user.role === 'viewer', 'viewer', первый.user.role);
  проверить('адрес не подтверждён сразу',
    первый.user.emailVerified === false, false, первый.user.emailVerified);

  // ГЛАВНОЕ: токен из регистрации работает НЕМЕДЛЕННО.
  const поТокену = await sessionByToken(pool, первый.токен);
  проверить('токен регистрации действует сразу', !!поТокену, 'есть', поТокену ? 'есть' : 'НЕТ');

  // ── 4. занятый адрес не выдаёт себя ─────────────────────────────────────
  // Заодно проверяем ОКРУЖЕНИЕ: единственность держится на lower(), а lower()
  // не сворачивает кириллицу в базе с локалью C. Если это так, «ИВАН» и
  // «иван» окажутся разными людьми — и узнать об этом надо здесь, а не на
  // публикации.
  const { rows: [{ свёрнуто }] } = await pool.query(`SELECT lower('ИВАН') AS "свёрнуто"`);
  проверить('база сворачивает кириллицу (локаль не C)',
    свёрнуто === 'иван', 'иван', свёрнуто);

  const занят = await отказ(() => register(pool, {
    username: 'другой', email: 'IVAN@e.рф', password: ПАРОЛЬ }));
  проверить('занятый адрес даёт общий ответ',
    занят.includes('Если такой адрес свободен'), 'общий ответ', занят.slice(0, 34));
  const занятЛогин = await отказ(() => register(pool, {
    username: 'ИВАН', email: 'other@e.рф', password: ПАРОЛЬ }));
  проверить('занятый логин даёт ТОТ ЖЕ ответ', занятЛогин === занят, 'тот же', 'иной');

  // ── 5. вход ─────────────────────────────────────────────────────────────
  const вход = await login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ });
  проверить('вход даёт токен', !!вход.токен, 'токен', вход.токен ? 'есть' : 'нет');
  проверить('токен входа отличается от токена регистрации',
    вход.токен !== первый.токен, 'отличается', 'совпал');

  const неверный = await отказ(() => login(pool, { email: 'ivan@e.рф', password: 'не тот пароль' }));
  const нетТакого = await отказ(() => login(pool, { email: 'нет@e.рф', password: ПАРОЛЬ }));
  проверить('неверный пароль и неизвестный адрес отвечают ОДИНАКОВО',
    неверный === нетТакого, неверный, нетТакого);

  // ── 6. о бане — после пароля ────────────────────────────────────────────
  await pool.query(`UPDATE users SET is_banned = TRUE, ban_reason = 'проба'
                     WHERE lower(email) = 'ivan@e.рф'`);
  const банСВерным = await отказ(() => login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ }));
  const банСНеверным = await отказ(() => login(pool, { email: 'ivan@e.рф', password: 'мимо' }));
  проверить('с верным паролем о бане сообщают',
    банСВерным.includes('заблокирована'), 'заблокирована', банСВерным.slice(0, 30));
  проверить('с неверным паролем бан НЕ виден',
    банСНеверным === нетТакого, 'как неизвестный адрес', банСНеверным.slice(0, 30));
  await pool.query(`UPDATE users SET is_banned = FALSE, ban_reason = NULL
                     WHERE lower(email) = 'ivan@e.рф'`);

  // ── 7. отзыв сессии ─────────────────────────────────────────────────────
  const вход2 = await login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ });
  проверить('обе сессии живы',
    !!(await sessionByToken(pool, вход.токен)) && !!(await sessionByToken(pool, вход2.токен)),
    'обе', 'не обе');

  await logout(pool, вход.sessionId);
  проверить('logout гасит ОДНУ сессию',
    !(await sessionByToken(pool, вход.токен)) && !!(await sessionByToken(pool, вход2.токен)),
    'первая мертва, вторая жива', 'иначе');

  await logoutAll(pool, первый.user.userId);
  проверить('logout-all гасит все',
    !(await sessionByToken(pool, вход2.токен)) && !(await sessionByToken(pool, первый.токен)),
    'все мертвы', 'иначе');

  // ── 8. бан рвёт сессии ──────────────────────────────────────────────────
  const вход3 = await login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ });
  await withTransaction(pool, async client => {
    await client.query(`UPDATE users SET is_banned = TRUE, ban_reason = 'проба'
                         WHERE user_id = $1`, [первый.user.userId]);
    await revokeAllSessions(client, первый.user.userId);
  });
  проверить('после бана прежний токен мёртв',
    !(await sessionByToken(pool, вход3.токен)), 'мёртв', 'жив');
  await pool.query(`UPDATE users SET is_banned = FALSE, ban_reason = NULL
                     WHERE user_id = $1`, [первый.user.userId]);

  // ── 9. отозванная и просроченная не проходят ────────────────────────────
  const { токен: срочный } = await withTransaction(pool, client =>
    createSession(client, { userId: первый.user.userId }));
  await pool.query(`UPDATE user_sessions SET expires_at = NOW() - INTERVAL '1 hour'
                     WHERE user_id = $1 AND revoked_at IS NULL`, [первый.user.userId]);
  проверить('просроченная сессия не проходит',
    !(await sessionByToken(pool, срочный)), 'не проходит', 'проходит');
  проверить('выдуманный токен не проходит',
    !(await sessionByToken(pool, 'выдуманный-токен')), 'не проходит', 'проходит');

  // ── 10. подтверждение адреса ────────────────────────────────────────────
  const { rows: [строкаДо] } = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`, [первый.user.userId]);
  проверить('до подтверждения коммитов нет',
    !can(userFromRow(строкаДо), P.CREATE_COMMIT), false, 'нет');
  проверить('до подтверждения смотреть можно',
    can(userFromRow(строкаДо), P.VIEW_GRAPH), true, 'да');

  // Право на коммиты есть у РЕДАКТОРА, а не у зрителя: подтверждение адреса
  // не выдаёт прав, оно лишь перестаёт их срезать. Первый набросок пробы
  // требовал от зрителя create_commit и краснел — правильно краснел.
  await pool.query(`UPDATE users SET role = 'editor' WHERE user_id = $1`,
    [первый.user.userId]);
  const { rows: [редакторДо] } = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`, [первый.user.userId]);
  проверить('редактор с неподтверждённым адресом коммитов не создаёт',
    !can(userFromRow(редакторДо), P.CREATE_COMMIT), false, 'нет');

  await verifyEmail(pool, первый.подтверждение);
  const { rows: [строкаПосле] } = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`, [первый.user.userId]);
  проверить('после подтверждения адрес подтверждён',
    userFromRow(строкаПосле).emailVerified === true, true, 'да');
  проверить('после подтверждения право на коммиты появляется',
    can(userFromRow(строкаПосле), P.CREATE_COMMIT), true,
    can(userFromRow(строкаПосле), P.CREATE_COMMIT) ? 'да' : 'НЕТ');

  const дважды = await отказ(() => verifyEmail(pool, первый.подтверждение));
  проверить('ссылка одноразовая', дважды.includes('уже воспользовались'),
    'уже воспользовались', дважды.slice(0, 30));
  const чужая = await отказ(() => verifyEmail(pool, 'не тот токен'));
  проверить('чужая ссылка недействительна', чужая.includes('недействительна'),
    'недействительна', чужая.slice(0, 30));

  // ── 11. счёт неудач по учётной записи ───────────────────────────────────
  clearCounters();
  for (let i = 0; i < LIMIT - 1; i++) noteFailure('login:ivan');
  проверить('до предела перебора нет', !isBruteForce('login:ivan'), false, 'нет');
  noteFailure('login:ivan');
  проверить('на пределе — перебор', isBruteForce('login:ivan'), true, 'да');
  resetCounter('login:ivan');
  проверить('удачный вход сбрасывает счёт', !isBruteForce('login:ivan'), false, 'нет');

  // ── 11-бис. СЧЁТЧИК ЗОВЁТСЯ ИЗ ВХОДА, а не только существует ────────────
  // Прежде проба спрашивала САМ СЧЁТЧИК и была зелена, пока login о нём не
  // знал вовсе: служба работала, проба её хвалила, перебор пароля не был
  // ограничен ничем. Здесь спрашивается ВХОД — тот, кто должен считать.
  clearCounters();
  const loginKey = 'login:ivan@e.рф';
  for (let i = 0; i < LIMIT; i++)
    await отказ(() => login(pool, { email: 'ivan@e.рф', password: 'заведомо не тот' }));
  проверить('вход считает неудачи сам', isBruteForce(loginKey), true,
    isBruteForce(loginKey) ? 'да' : 'нет');
  const перебор = await отказ(() => login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ }));
  проверить('после предела не пускают даже с верным паролем',
    перебор.includes('Слишком много'), 'Слишком много…', перебор.slice(0, 40));
  clearCounters();
  const послеСброса = await login(pool, { email: 'ivan@e.рф', password: ПАРОЛЬ });
  проверить('со сброшенным счётом вход снова открыт', !!послеСброса.токен, 'токен', послеСброса.токен ? 'токен' : 'нет');
  проверить('удачный вход обнулил счёт сам', !isBruteForce(loginKey), false,
    isBruteForce(loginKey) ? 'да' : 'нет');
  clearCounters();

  // ── 12. CSRF ────────────────────────────────────────────────────────────
  const csrfToken = newCsrfToken();
  const прогнать = (метод, cookie, заголовок) => new Promise(готово => {
    checkCsrf({ method: метод, cookies: cookie ? { csrf: cookie } : {},
                get: () => заголовок }, {}, e => готово(e ? 'отказ' : 'прошло'));
  });
  проверить('GET без признака проходит', await прогнать('GET') === 'прошло', 'прошло', '—');
  проверить('POST с совпавшим признаком проходит',
    await прогнать('POST', csrfToken, csrfToken) === 'прошло', 'прошло', '—');
  проверить('POST без заголовка не проходит',
    await прогнать('POST', csrfToken, undefined) === 'отказ', 'отказ', '—');
  проверить('POST с чужим признаком не проходит',
    await прогнать('POST', csrfToken, newCsrfToken()) === 'отказ', 'отказ', '—');

} catch (e) {
  // Падение посреди пробы — тоже итог, и молчать о нём нельзя: список
  // утверждений просто оборвётся, и «8 из 8» будет выглядеть успехом.
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
