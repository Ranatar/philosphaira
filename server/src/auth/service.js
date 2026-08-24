// СЛУЖБА ВХОДА.
//
// Четыре дефекта первой редакции жили здесь, и каждый лечится не заплатой:
//   register не создавал сессию, а verifyToken её требовал — выданный при
//     регистрации токен был невалиден с первой же секунды;
//   единственность держал предварительный SELECT, между которым и вставкой
//     помещалась чужая регистрация;
//   раздельные ответы «занято» / «свободно» выдавали, какие адреса заняты;
//   о бане сообщалось ДО проверки пароля — состояние чужой записи узнавалось
//     по одному лишь адресу.
//
// Ни одной строки базы здесь нет: SQL живёт в src/db/, сюда приходят готовые
// доменные объекты. Первый набросок был иным, и проба строения покраснела —
// правильно покраснела: хеш пароля читался прямо тут, а вместе с ним в службу
// просочились бы и остальные змеиные поля.

import { withTransaction } from '../db/tx.js';
import { findByEmailWithSecret, insertUser, setLastLogin, setEmailVerified, audit }
  from '../db/users.js';
import { createSession, revokeSession, revokeAllSessions } from '../db/sessions.js';
import { issueVerification, findVerification, markVerificationUsed }
  from '../db/verifications.js';
import { hashPassword, verifyPassword, assertPasswordPolicy, ХОЛОСТОЙ_ХЕШ }
  from './password.js';
import { Forbidden, Conflict, Unauthorized, NotFound } from '../http/errors.js';

const ответОРегистрации = () => Object.assign(
  new Error('Если такой адрес свободен, письмо для подтверждения отправлено'),
  { status: 202, code: 'registration_pending' });

export async function register(pool, { username, email, password,
                                       displayName = null, ip = null, ua = null }) {
  assertPasswordPolicy(password);
  const хеш = await hashPassword(password);   // ВНЕ транзакции: argon2 небыстр

  return withTransaction(pool, async client => {
    let user;
    try {
      user = await insertUser(client,
        { username, email, passwordHash: хеш, displayName });
    } catch (e) {
      // 23505 — нарушение единственности. Наружу общий ответ: раздельный
      // выдал бы, какие адреса и логины заняты.
      if (e.code === '23505') throw ответОРегистрации();
      throw e;
    }

    // Сессия выдаётся ТУТ ЖЕ, иначе первый же запрос получит 401.
    const { токен, sessionId } = await createSession(client,
      { userId: user.userId, ip, userAgent: ua });
    const подтверждение = await issueVerification(client,
      { userId: user.userId, email });

    await audit(client, { actorId: user.userId, action: 'auth.register',
                          subjectType: 'user', subjectId: user.userId, ip });
    return { user, токен, sessionId, подтверждение };
  });
}

export async function login(pool, { email, password, ip = null, ua = null }) {
  const найдено = await findByEmailWithSecret(pool, email);

  // Сверка идёт ВСЕГДА — с холостым хешем, если записи нет: иначе ответ на
  // неизвестный адрес приходит заметно быстрее, и это само по себе ответ.
  const сошлось = await verifyPassword(найдено?.passwordHash ?? ХОЛОСТОЙ_ХЕШ, password);
  if (!найдено || !сошлось) throw new Unauthorized('Неверный адрес или пароль');

  const { user } = найдено;

  // О бане и отключении — ПОСЛЕ проверки пароля.
  if (user.isBanned) {
    throw new Forbidden('Учётная запись заблокирована: ' + (user.banReason ?? ''));
  }
  if (!user.isActive) throw new Forbidden('Учётная запись отключена');

  return withTransaction(pool, async client => {
    // У кого второй шаг заведён, тот получает ЧАСТИЧНУЮ сессию: она не даёт
    // ничего, кроме права предъявить код. Иначе окно между шагами оказалось
    // бы полноценной сессией.
    const { токен, sessionId } = await createSession(client,
      { userId: user.userId, ip, userAgent: ua, mfaPending: user.mfaReady });
    await setLastLogin(client, user.userId);
    await audit(client, { actorId: user.userId, action: 'auth.login',
                          subjectType: 'user', subjectId: user.userId, ip });
    return { user, токен, sessionId, ждётКода: user.mfaReady };
  });
}

export const logout = (pool, sessionId) =>
  withTransaction(pool, client => revokeSession(client, sessionId));

export const logoutAll = (pool, userId) =>
  withTransaction(pool, client => revokeAllSessions(client, userId));

/**
 * Подтверждение адреса. Токен одноразовый и привязан к адресу НА МОМЕНТ
 * ВЫДАЧИ: если человек успел сменить почту, старое письмо подтверждать
 * нечего — иначе подтверждённым окажется адрес, которого уже нет.
 */
export async function verifyEmail(pool, токен) {
  return withTransaction(pool, async client => {
    const з = await findVerification(client, токен);
    if (!з) throw new NotFound('Ссылка недействительна');
    if (з.usedAt) throw new Conflict('Ссылкой уже воспользовались');
    if (new Date(з.expiresAt) < new Date()) throw new Conflict('Срок ссылки истёк');
    if (з.email.toLowerCase() !== з.currentEmail.toLowerCase()) {
      throw new Conflict('Адрес изменился — запросите подтверждение заново');
    }

    await markVerificationUsed(client, з.id);
    await setEmailVerified(client, з.userId);
    await audit(client, { actorId: з.userId, action: 'auth.email_verified',
                          subjectType: 'user', subjectId: з.userId });
    return { ok: true };
  });
}
