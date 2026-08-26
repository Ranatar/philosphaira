#!/usr/bin/env node
// ПЕРВЫЙ АДМИНИСТРАТОР. Только из командной строки и только на пустой базе.
//
// Открытая ветка «первый зарегистрировавшийся становится администратором» —
// известный способ потерять систему в первые же сутки.
//
// ПАРОЛЬ НАСТОЯЩИЙ. Прежняя version клала заглушку, которой не соответствует
// ни один пароль: она осталась с беседы 1.1, когда argon2 в проекте ещё не
// было, и прямо сообщала «войти нельзя до 1.3». В 1.3 пароли появились, а
// сюда никто не вернулся — первый администратор так и не мог войти.
//
// ПОЧЕМУ ПОЧТА СЧИТАЕТСЯ ПОДТВЕРЖДЁННОЙ. Обычный человек доказывает владение
// адресом письмом. Оператор, запускающий эту команду, уже держит в руках
// DATABASE_URL и ключ MFA — канал доверия сильнее письма. Заодно снимается
// круг «чтобы настроить систему, нужен администратор, а чтобы он получил
// права, должна работать почта».
//
// MFA НЕ ЗАВОДИТСЯ САМ: секрет должен увидеть человек, который вносит его в
// приложение, а включённый без подтверждения второй шаг запер бы вход.

import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { beginBootstrapAdmin, insertUser, setEmailVerified,
         writeRoleHistory, audit } from '../src/db/users.js';
import { assertPasswordPolicy, hashPassword } from '../src/auth/password.js';

const login = process.env.BOOTSTRAP_ADMIN_LOGIN || 'admin';
const email = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@example.invalid';
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!password) {
  console.error(
    'BOOTSTRAP_ADMIN_PASSWORD не задан. У первого администратора должен быть\n' +
    'настоящий пароль; небезопасного умолчания здесь нет.\n' +
    'Задавайте переменной окружения, а не доводом командной строки: довод\n' +
    'виден в списке процессов и остаётся в истории оболочки.');
  process.exit(1);
}

// Требования — те же, что для всякой регистрации: второго свода правил нет.
assertPasswordPolicy(password);

// argon2 считается ДО сделки: он дорог, и держать на нём соединение и
// замок незачем.
const passwordHash = await hashPassword(password);

const pool = createPool();
try {
  const merged = await withTransaction(pool, async client => {
    const живых = await beginBootstrapAdmin(client);
    if (живых) return { уже: живых };

    const user = await insertUser(client, {
      username: login, email, passwordHash,
      displayName: login, role: 'administrator',
    });
    await setEmailVerified(client, user.userId);
    await writeRoleHistory(client, {
      userId: user.userId, oldRole: null, newRole: 'administrator',
      actorId: null, reason: 'первый администратор, заведён bootstrap-admin',
    });
    await audit(client, {
      actorId: null, action: 'user.bootstrap', subjectType: 'user',
      subjectId: user.userId,
      payload: { username: user.username, почтаПодтвержденаВнеСети: true },
    });
    return { user };
  });

  if (merged.уже) {
    console.error(`в базе уже ${merged.уже} живых пользовател(я/ей) — ничего не сделано`);
    process.exitCode = 1;
  } else {
    console.log(`заведён администратор ${merged.user.username} (${merged.user.userId})`);
    console.log('почта помечена подтверждённой как часть доверенного запуска');
    console.log('СЛЕДУЮЩИЙ ШАГ: войти и завести второй шаг — без него опасные');
    console.log('права срезаны, и назначить второго администратора нельзя');
  }
} finally {
  await pool.end();
}
