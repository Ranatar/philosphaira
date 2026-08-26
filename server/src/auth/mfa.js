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
import { encrypt, decrypt } from './secretbox.js';
import { createSecret, verifyCode, otpauth } from './totp.js';
import { Conflict, Forbidden, Unauthorized } from '../http/errors.js';

export const FRESH_MINUTES = 15;

/**
 * Шаг первый заведения: выдать секрет и показать его человеку.
 * Второй шаг НЕ включается: включит его только предъявленный код — иначе
 * можно запереть себя, сохранив секрет, который никуда не записал.
 */
export async function beginEnroll(pool, user) {
  const secret = createSecret();
  await withTransaction(pool, client =>
    putSecret(client, user.userId, encrypt(secret)));
  return { секрет: secret, ссылка: otpauth({ секрет: secret, логин: user.username }) };
}

/** Шаг второй: код сошёлся — включаем и выдаём коды восстановления. */
export async function confirmEnroll(pool, user, код) {
  const stored = await getSecret(pool, user.userId);
  if (!stored?.шифр) throw new Conflict('Секрет не выдан: начните заведение заново');
  if (stored.включён) throw new Conflict('Второй шаг уже заведён');

  const secret = decrypt(stored.шифр);
  if (!verifyCode(secret, код)) throw new Unauthorized('Код не сошёлся');

  return withTransaction(pool, async client => {
    await enableMfa(client, user.userId);
    const recoveryCodes = await issueRecoveryCodes(client, user.userId);
    await audit(client, { actorId: user.userId, action: 'mfa.enabled',
                          subjectType: 'user', subjectId: user.userId });
    return { коды: recoveryCodes };
  });
}

/**
 * Предъявление кода. Годится и код из приложения, и код восстановления —
 * второй одноразовый. Различать их отдельным ходом незачем: человек, который
 * потерял телефон, вводит то, что у него есть.
 */
export async function submitCode(pool, sessionId, код) {
  const mfaState = await sessionMfaState(pool, sessionId);
  if (!mfaState) throw new Unauthorized('Сессия недействительна');

  const stored = await getSecret(pool, mfaState.userId);
  if (!stored?.включён) throw new Conflict('Второй шаг не заведён');

  const byAuthenticator = verifyCode(decrypt(stored.шифр), код);

  return withTransaction(pool, async client => {
    const byRecoveryCode = byAuthenticator
      ? false : await spendRecoveryCode(client, mfaState.userId, код);
    if (!byAuthenticator && !byRecoveryCode) {
      throw new Unauthorized('Код не сошёлся');
    }
    await passSessionMfa(client, sessionId);
    await audit(client, { actorId: mfaState.userId,
                          action: byRecoveryCode ? 'mfa.recovery_used' : 'mfa.passed',
                          subjectType: 'user', subjectId: mfaState.userId });
    return {
      способ: byRecoveryCode ? 'восстановление' : 'приложение',
      осталосьКодов: await countRecoveryCodes(client, mfaState.userId),
    };
  });
}

/**
 * Отзыв второго шага. Требует кода: иначе украденная сессия снимает защиту
 * одним запросом. Все сессии гасятся — включая ту, из которой отзывали.
 */
export async function disable(pool, user, код) {
  const stored = await getSecret(pool, user.userId);
  if (!stored?.включён) throw new Conflict('Второй шаг не заведён');
  if (!verifyCode(decrypt(stored.шифр), код)) {
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
export function isFreshMfa(пройденВ, минут = FRESH_MINUTES, сейчас = Date.now()) {
  if (!пройденВ) return false;
  return сейчас - +new Date(пройденВ) <= минут * 60_000;
}

/** Застава для опасных действий. */
export const requireFreshMfa = (минут = FRESH_MINUTES) => async (req, _res, next) => {
  try {
    if (!req.user) throw new Unauthorized();
    const mfaState = await sessionMfaState(req.db, req.sessionId);
    if (!isFreshMfa(mfaState?.пройденВ, минут)) {
      throw Object.assign(new Forbidden('Подтвердите вход одноразовым кодом'),
                          { status: 401, code: 'mfa_required' });
    }
    next();
  } catch (e) { next(e); }
};
