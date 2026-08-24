// ВТОРОЙ ШАГ ВХОДА.
//
// Три места, где здесь обычно ошибаются, и как они обойдены:
//
// 1. ОКНО МЕЖДУ ШАГАМИ. После верного пароля выдаётся не сессия, а ЧАСТИЧНАЯ
//    (mfa_pending), которая не даёт ничего, кроме права предъявить код.
//    Иначе промежуток между шагами оказывается полноценной сессией, и второй
//    шаг становится украшением. Привратник отсекает такие сессии.
//
// 2. КУРИЦА И ЯЙЦО. Требовать заведённый второй шаг ДО назначения
//    администратором нельзя: первого администратора заводит bootstrap-admin,
//    и требовать с него нечего. Поэтому назначение проходит, а учётная запись
//    входит в состояние «требуется двухшаговый вход»: смотреть можно всё,
//    опасное — ничего. Проверка живёт в effectivePermissions (NEEDS_MFA),
//    а не двенадцатью условиями по коду.
//
// 3. ПОДТВЕРЖДЕНИЕ ШАГА ДЛЯ ОПАСНОГО. Украденная сессия сотрудника равна
//    украденной системе, если второй шаг спрашивают только при входе.
//    Поэтому смена роли, бан и удаление требуют кода, предъявленного в
//    последние пятнадцать минут (requireFreshMfa).

import { withTransaction } from '../db/tx.js';
import { putSecret, getSecret, enableMfa, disableMfa, issueRecoveryCodes,
         spendRecoveryCode, countRecoveryCodes, passSessionMfa, sessionMfaState }
  from '../db/mfa.js';
import { audit } from '../db/users.js';
import { revokeAllSessions } from '../db/sessions.js';
import { зашифровать, расшифровать } from './secretbox.js';
import { создатьСекрет, сверить, otpauth } from './totp.js';
import { Conflict, Forbidden, Unauthorized } from '../http/errors.js';

export const СВЕЖЕСТЬ_МИНУТ = 15;

/**
 * Шаг первый заведения: выдать секрет и показать его человеку.
 * Второй шаг НЕ включается: включит его только предъявленный код — иначе
 * можно запереть себя, сохранив секрет, который никуда не записал.
 */
export async function beginEnroll(pool, user) {
  const секрет = создатьСекрет();
  await withTransaction(pool, client =>
    putSecret(client, user.userId, зашифровать(секрет)));
  return { секрет, ссылка: otpauth({ секрет, логин: user.username }) };
}

/** Шаг второй: код сошёлся — включаем и выдаём коды восстановления. */
export async function confirmEnroll(pool, user, код) {
  const есть = await getSecret(pool, user.userId);
  if (!есть?.шифр) throw new Conflict('Секрет не выдан: начните заведение заново');
  if (есть.включён) throw new Conflict('Второй шаг уже заведён');

  const секрет = расшифровать(есть.шифр);
  if (!сверить(секрет, код)) throw new Unauthorized('Код не сошёлся');

  return withTransaction(pool, async client => {
    await enableMfa(client, user.userId);
    const коды = await issueRecoveryCodes(client, user.userId);
    await audit(client, { actorId: user.userId, action: 'mfa.enabled',
                          subjectType: 'user', subjectId: user.userId });
    return { коды };
  });
}

/**
 * Предъявление кода. Годится и код из приложения, и код восстановления —
 * второй одноразовый. Различать их отдельным ходом незачем: человек, который
 * потерял телефон, вводит то, что у него есть.
 */
export async function submitCode(pool, sessionId, код) {
  const состояние = await sessionMfaState(pool, sessionId);
  if (!состояние) throw new Unauthorized('Сессия недействительна');

  const есть = await getSecret(pool, состояние.userId);
  if (!есть?.включён) throw new Conflict('Второй шаг не заведён');

  const поПриложению = сверить(расшифровать(есть.шифр), код);

  return withTransaction(pool, async client => {
    const поВосстановлению = поПриложению
      ? false : await spendRecoveryCode(client, состояние.userId, код);
    if (!поПриложению && !поВосстановлению) {
      throw new Unauthorized('Код не сошёлся');
    }
    await passSessionMfa(client, sessionId);
    await audit(client, { actorId: состояние.userId,
                          action: поВосстановлению ? 'mfa.recovery_used' : 'mfa.passed',
                          subjectType: 'user', subjectId: состояние.userId });
    return {
      способ: поВосстановлению ? 'восстановление' : 'приложение',
      осталосьКодов: await countRecoveryCodes(client, состояние.userId),
    };
  });
}

/**
 * Отзыв второго шага. Требует кода: иначе украденная сессия снимает защиту
 * одним запросом. Все сессии гасятся — включая ту, из которой отзывали.
 */
export async function disable(pool, user, код) {
  const есть = await getSecret(pool, user.userId);
  if (!есть?.включён) throw new Conflict('Второй шаг не заведён');
  if (!сверить(расшифровать(есть.шифр), код)) {
    throw new Unauthorized('Код не сошёлся');
  }
  return withTransaction(pool, async client => {
    await disableMfa(client, user.userId);
    await issueRecoveryCodes(client, user.userId, 0);   // гасит прежние
    await revokeAllSessions(client, user.userId);
    await audit(client, { actorId: user.userId, action: 'mfa.disabled',
                          subjectType: 'user', subjectId: user.userId });
    return { ok: true };
  });
}

/** Свежо ли подтверждение. Отсутствие отметки — не свежо. */
export function свежийШаг(пройденВ, минут = СВЕЖЕСТЬ_МИНУТ, сейчас = Date.now()) {
  if (!пройденВ) return false;
  return сейчас - +new Date(пройденВ) <= минут * 60_000;
}

/** Застава для опасных действий. */
export const requireFreshMfa = (минут = СВЕЖЕСТЬ_МИНУТ) => async (req, _res, next) => {
  try {
    if (!req.user) throw new Unauthorized();
    const состояние = await sessionMfaState(req.db, req.sessionId);
    if (!свежийШаг(состояние?.пройденВ, минут)) {
      throw Object.assign(new Forbidden('Подтвердите вход одноразовым кодом'),
                          { status: 401, code: 'mfa_required' });
    }
    next();
  } catch (e) { next(e); }
};
