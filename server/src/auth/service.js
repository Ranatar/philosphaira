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
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { hashPassword, verifyPassword, assertPasswordPolicy, DUMMY_HASH }
  from './password.js';
import { Forbidden, Conflict, Unauthorized, NotFound, TooMany } from '../http/errors.js';
import { noteFailure, resetCounter, isBruteForce, delayMs } from './throttle.js';

const registrationReply = () => Object.assign(
  new Error('Если такой адрес свободен, письмо для подтверждения отправлено'),
  { status: 202, code: 'registration_pending' });

/**
 * Корень ссылок в письмах. Спрашивается у окружения: сервер не знает, под
 * каким именем его видят снаружи, а зашитый адрес — верный способ разослать
 * людям ссылки на 127.0.0.1.
 */
const LINK_ROOT = () => process.env.PUBLIC_URL || 'http://127.0.0.1:8814';

export async function register(pool, { username, email, password,
                                       displayName = null, ip = null, ua = null }) {
  assertPasswordPolicy(password);
  const passwordHash = await hashPassword(password);   // ВНЕ транзакции: argon2 небыстр

  return withTransaction(pool, async client => {
    let user;
    try {
      user = await insertUser(client,
        { username, email, passwordHash: passwordHash, displayName });
    } catch (e) {
      // 23505 — нарушение единственности. Наружу общий ответ: раздельный
      // выдал бы, какие адреса и логины заняты.
      if (e.code === '23505') throw registrationReply();
      throw e;
    }

    // Сессия выдаётся ТУТ ЖЕ, иначе первый же запрос получит 401.
    const { токен, sessionId } = await createSession(client,
      { userId: user.userId, ip, userAgent: ua });
    const verifyToken = await issueVerification(client,
      { userId: user.userId, email });

    // ПИСЬМО КЛАДЁТСЯ ТОЙ ЖЕ ТРАНЗАКЦИЕЙ и никуда не отправляется — этим
    // занят работник исходящих. Без него токен подтверждения рождался и
    // умирал на месте: наружу он не выходил ни ответом, ни письмом, а в
    // базе лежит только его sha256. Человек не мог подтвердить адрес, а
    // без подтверждения нет права на правку — продуктовая проба показала
    // это первым же заходом.
    await notify(client, N.EMAIL_VERIFY, {
      userId: user.userId,
      ссылка: `${LINK_ROOT()}/index.html#подтвердить=${verifyToken}`,
    });

    await audit(client, { actorId: user.userId, action: 'auth.register',
                          subjectType: 'user', subjectId: user.userId, ip });
    return { user, токен, sessionId, подтверждение: verifyToken };
  });
}

export async function login(pool, { email, password, ip = null, ua = null }) {
  // ПЕРЕБОР ПО УЧЁТНОЙ ЗАПИСИ. Счётчик в throttle.js был написан, проверен
  // своей пробой — и НЕ ЗВАЛСЯ ОТСЮДА НИ РАЗУ: шапка throttle.js обещала
  // «второй счёт по адресу учётной записи, с растущей задержкой», а по IP
  // считалась только регистрация. То есть перебор пароля по одной записи не
  // был ограничен ничем. Найдено аудитом 10 сентября 2026.
  //
  // Ключ — адрес, а не IP: перебор с множества адресов бьёт по одной записи,
  // а счёт по IP заодно наказывает всех за одним NAT.
  const failKey = 'login:' + String(email ?? '').trim().toLowerCase();
  if (isBruteForce(failKey)) {
    throw new TooMany('Слишком много неудачных попыток; попробуйте позже');
  }
  // Задержка растёт с пятой неудачи и ставится ДО сверки: она стоит на пути
  // у следующей попытки, а не наказывает уже случившуюся.
  const waitMs = delayMs(failKey);
  if (waitMs) await new Promise(r => setTimeout(r, waitMs));

  const found = await findByEmailWithSecret(pool, email);

  // Сверка идёт ВСЕГДА — с холостым хешем, если записи нет: иначе ответ на
  // неизвестный адрес приходит заметно быстрее, и это само по себе ответ.
  const matched = await verifyPassword(found?.passwordHash ?? DUMMY_HASH, password);
  if (!found || !matched) {
    noteFailure(failKey);
    throw new Unauthorized('Неверный адрес или пароль');
  }

  const { user } = found;

  // О бане и отключении — ПОСЛЕ проверки пароля.
  if (user.isBanned) {
    throw new Forbidden('Учётная запись заблокирована: ' + (user.banReason ?? ''));
  }
  if (!user.isActive) throw new Forbidden('Учётная запись отключена');

  // Удачный вход обнуляет счёт: считаются неудачи подряд, а не за всю жизнь.
  resetCounter(failKey);

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
    const verification = await findVerification(client, токен);
    if (!verification) throw new NotFound('Ссылка недействительна');
    if (verification.usedAt) throw new Conflict('Ссылкой уже воспользовались');
    if (new Date(verification.expiresAt) < new Date()) throw new Conflict('Срок ссылки истёк');
    if (verification.email.toLowerCase() !== verification.currentEmail.toLowerCase()) {
      throw new Conflict('Адрес изменился — запросите подтверждение заново');
    }

    await markVerificationUsed(client, verification.id);
    await setEmailVerified(client, verification.userId);
    await audit(client, { actorId: verification.userId, action: 'auth.email_verified',
                          subjectType: 'user', subjectId: verification.userId });
    return { ok: true };
  });
}
