#!/usr/bin/env node
// Проба С БАЗОЙ. Требует живого PostgreSQL и DATABASE_URL.
// Работает на ЧИСТОЙ базе: сперва откатывает всё, потом накатывает заново.
//
//   DATABASE_URL=… node probes/db_probe.mjs

import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { userFromRow, userToApi } from '../src/db/mapper.js';
import { paginate } from '../src/db/paginate.js';
import { assertNotLastAdministrator } from '../src/access/last-admin.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...дов) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...дов],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

const pool = создатьПул();

try {
  // ── 1. откат до чистого места и накат ───────────────────────────────────
  // «Пять раз» было счётом миграций на день написания: их прибавилось, и
  // проба стала оставлять хвост. Откатываем ДО КОНЦА, а не заданное число раз.
  while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
  const { rows: [{ n: таблицДо }] } = await pool.query(
    `SELECT count(*)::int AS n FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name <> 'schema_migrations'`);
  проверить('после отката таблиц не осталось', таблицДо === 0, 0, таблицДо);

  мигр('up');
  const { rows: [{ n: таблицПосле }] } = await pool.query(
    `SELECT count(*)::int AS n FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name <> 'schema_migrations'`);
  // Число таблиц НЕ вписано числом: миграций прибавится, и утверждение,
  // которое надо править при каждой новой, — это не утверждение, а помеха.
  // Спрашиваем поимённо: все ли, что накат обещает, на месте.
  const { rows: имена } = await pool.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name <> 'schema_migrations'
      ORDER BY table_name`);
  const есть = имена.map(r => r.table_name);
  // Список пополняется вместе с миграциями — и это НЕ помеха, а смысл:
  // таблица, появившаяся мимо намерения, должна ронять приёмку, а не
  // проходить молча.
  const ждём = ['audit_log', 'broadcasts', 'commits', 'email_verifications',
                'graph_entities', 'graph_state', 'mfa_recovery_codes',
                'notification_preferences', 'notifications', 'outbox',
                'role_history', 'user_sessions', 'users'];
  проверить('накат создаёт все обещанные таблицы',
    ждём.every(т => есть.includes(т)), ждём.join(','), есть.join(','));
  проверить('лишних таблиц накат не создаёт',
    есть.every(т => ждём.includes(т)), 'только обещанные', есть.join(','));

  // Повторный накат ничего не делает: журнал помнит применённое.
  const снова = мигр('up');
  проверить('повторный накат идемпотентен',
    снова.includes('накатывать нечего'), 'нечего', снова.trim().split('\n').pop());

  // ── 2. преобразователь отказывает ГРОМКО ────────────────────────────────
  проверить('неполная строка роняет преобразователь с внятным словом',
    (await отказ(() => userFromRow({ user_id: 'x' }))).includes('нет полей'),
    'нет полей', await отказ(() => userFromRow({ user_id: 'x' })));
  проверить('не-строка тоже роняет',
    (await отказ(() => userFromRow(null))).includes('ожидалась строка базы'),
    'ожидалась строка базы', await отказ(() => userFromRow(null)));

  // ── 3. первый администратор ─────────────────────────────────────────────
  execFileSync('node', [path.join(КОРЕНЬ, 'scripts', 'bootstrap-admin.mjs')],
    { encoding: 'utf8', env: process.env });
  const { rows: [строка] } = await pool.query(
    `SELECT * FROM users WHERE role = 'administrator'`);
  проверить('bootstrap завёл администратора', !!строка, 'есть', строка ? 'есть' : 'нет');

  const админ = userFromRow(строка);
  проверить('преобразователь дал доменный объект',
    админ.isActive === true && админ.isBanned === false && админ.isDeleted === false,
    'active, не забанен, не удалён',
    `${админ.isActive}/${админ.isBanned}/${админ.isDeleted}`);
  проверить('запись доменного объекта неизменяема',
    Object.isFrozen(админ), 'заморожен', Object.isFrozen(админ));

  // Второй запуск не должен заводить второго администратора.
  let второй = 'не упал';
  try {
    execFileSync('node', [path.join(КОРЕНЬ, 'scripts', 'bootstrap-admin.mjs')],
      { encoding: 'utf8', env: process.env, stdio: 'pipe' });
  } catch { второй = 'отказал'; }
  const { rows: [{ n: администраторов }] } = await pool.query(
    `SELECT count(*)::int AS n FROM users WHERE role = 'administrator'`);
  проверить('второй запуск не заводит второго', администраторов === 1, 1, администраторов);
  проверить('второй запуск сообщает об отказе', второй === 'отказал', 'отказал', второй);

  // ── 4. почта видна не всем ──────────────────────────────────────────────
  const гостю = userFromRow(строка, { кому: null });
  const себе  = userFromRow(строка, { кому: { userId: строка.user_id } });
  проверить('гость почты не видит', гостю.email === undefined, 'нет', гостю.email);
  проверить('себе почта видна', себе.email === строка.email, строка.email, себе.email);
  проверить('в ответ API почта гостя не попадает',
    !('email' in userToApi(гостю)), 'нет ключа', Object.keys(userToApi(гостю)).join(','));
  проверить('хеш пароля не попадает в ответ API',
    !JSON.stringify(userToApi(себе)).includes('password'), 'нет', 'есть');

  // ── 5. транзакция откатывается целиком ──────────────────────────────────
  await отказ(() => withTransaction(pool, async client => {
    await client.query(`
      INSERT INTO users (username, email, password_hash) VALUES ('врем','в@в.рф','x')`);
    throw new Error('нарочно');
  }));
  const { rows: [{ n: осталось }] } = await pool.query(
    `SELECT count(*)::int AS n FROM users WHERE username = 'врем'`);
  проверить('падение внутри транзакции ничего не оставляет', осталось === 0, 0, осталось);

  // ── 6. мягкое удаление освобождает адрес ────────────────────────────────
  await pool.query(`
    INSERT INTO users (username, email, password_hash) VALUES ('тёзка','t@e.рф','x')`);
  const занято = await отказ(() => pool.query(`
    INSERT INTO users (username, email, password_hash) VALUES ('тёзка','t2@e.рф','x')`));
  проверить('живой логин занят', занято.includes('users_username_uq'),
    'users_username_uq', занято.slice(0, 40));
  await pool.query(`UPDATE users SET deleted_at = NOW() WHERE username = 'тёзка'`);
  const свободно = await отказ(() => pool.query(`
    INSERT INTO users (username, email, password_hash) VALUES ('тёзка','t3@e.рф','x')`));
  проверить('после мягкого удаления логин свободен', свободно === 'ПРОШЛО',
    'ПРОШЛО', свободно.slice(0, 40));

  // ── 7. заслоны схемы ────────────────────────────────────────────────────
  const безПричины = await отказ(() => pool.query(`
    UPDATE users SET is_banned = TRUE WHERE username = 'тёзка'`));
  проверить('бан без причины схема не пропускает',
    безПричины.includes('users_ban_reason_ck'), 'users_ban_reason_ck',
    безПричины.slice(0, 40));

  const пустаяПричина = await отказ(() => pool.query(`
    INSERT INTO role_history (user_id, new_role, reason)
    VALUES ($1, 'editor', '   ')`, [строка.user_id]));
  проверить('пустая причина смены роли не проходит',
    пустаяПричина.includes('reason'), 'отказ по reason', пустаяПричина.slice(0, 40));

  // ── 8. триггер updated_at ───────────────────────────────────────────────
  const { rows: [до] } = await pool.query(
    `SELECT updated_at FROM users WHERE user_id = $1`, [строка.user_id]);
  await new Promise(r => setTimeout(r, 30));
  await pool.query(`UPDATE users SET bio = 'проба' WHERE user_id = $1`, [строка.user_id]);
  const { rows: [после] } = await pool.query(
    `SELECT updated_at FROM users WHERE user_id = $1`, [строка.user_id]);
  проверить('updated_at ведёт триггер, а не код',
    +new Date(после.updated_at) > +new Date(до.updated_at), 'выросло',
    `${до.updated_at} → ${после.updated_at}`);

  // ── 9. пагинация ────────────────────────────────────────────────────────
  const стр = await paginate(pool, {
    from: 'users', select: '*', where: ['deleted_at IS NULL'], params: [],
    order: 'registered_at DESC', page: 1, limit: 1,
    map: r => userFromRow(r),
  });
  проверить('пагинация отдаёт items и pagination',
    Array.isArray(стр.items) && !!стр.pagination, 'оба', Object.keys(стр).join(','));
  проверить('limit соблюдается', стр.items.length === 1, 1, стр.items.length);
  проверить('total считает всех живых', стр.pagination.total >= 2, '≥2', стр.pagination.total);
  const огромный = await paginate(pool, {
    from: 'users', select: '*', params: [], order: 'registered_at DESC',
    page: 1, limit: 1000000, map: r => r.user_id,
  });
  проверить('предел страницы сверху ограничен',
    огромный.pagination.limit === 100, 100, огромный.pagination.limit);

  // ── 10. заслон «последний администратор» ────────────────────────────────
  // Гонка проверяется в 1.5, здесь — что заслон вообще считает и не пускает.
  const { rows: [{ n: адм }] } = await pool.query(
    `SELECT count(*)::int AS n FROM users WHERE role = 'administrator'
       AND is_active AND NOT is_banned AND deleted_at IS NULL`);
  проверить('администратор в базе один', адм === 1, 1, адм);

  const последний = await отказ(() => withTransaction(pool, async client =>
    assertNotLastAdministrator(client, { userId: строка.user_id, newRole: 'viewer' })));
  проверить('последнего администратора понизить нельзя',
    последний.includes('последний действующий'), 'отказ', последний.slice(0, 46));

  const вАдмины = await отказ(() => withTransaction(pool, async client =>
    assertNotLastAdministrator(client, { userId: строка.user_id, newRole: 'administrator' })));
  проверить('назначение администратором заслона не требует',
    вАдмины === 'ПРОШЛО', 'ПРОШЛО', вАдмины.slice(0, 46));

  await pool.query(`
    INSERT INTO users (username, email, password_hash, role)
    VALUES ('второй','vt@e.рф','x','administrator')`);
  const теперьМожно = await отказ(() => withTransaction(pool, async client =>
    assertNotLastAdministrator(client, { userId: строка.user_id, newRole: 'viewer' })));
  проверить('когда администраторов двое, понижение проходит',
    теперьМожно === 'ПРОШЛО', 'ПРОШЛО', теперьМожно.slice(0, 46));

  // Забаненный администратор в счёт не идёт: заслон о ДЕЙСТВУЮЩИХ.
  await pool.query(`
    UPDATE users SET is_banned = TRUE, ban_reason = 'проба' WHERE username = 'второй'`);
  const сноваНельзя = await отказ(() => withTransaction(pool, async client =>
    assertNotLastAdministrator(client, { userId: строка.user_id, newRole: 'viewer' })));
  проверить('забаненный администратор в счёт не идёт',
    сноваНельзя.includes('последний действующий'), 'отказ', сноваНельзя.slice(0, 46));

} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(52, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
