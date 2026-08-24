// Хранилище второго шага. Единственное место с SQL по mfa_*.

import crypto from 'node:crypto';
import { sha256 } from './sessions.js';

/** Секрет кладётся, но НЕ включается: включает его только подтверждённый код. */
export const putSecret = (client, userId, шифр) => client.query(
  `UPDATE users SET mfa_secret_enc = $1, mfa_enabled = FALSE, mfa_enabled_at = NULL
    WHERE user_id = $2`, [шифр, userId]);

export async function getSecret(db, userId) {
  const { rows } = await db.query(
    `SELECT mfa_secret_enc AS "шифр", mfa_enabled AS "включён"
       FROM users WHERE user_id = $1`, [userId]);
  return rows[0] ?? null;
}

export const enableMfa = (client, userId) => client.query(
  `UPDATE users SET mfa_enabled = TRUE, mfa_enabled_at = NOW() WHERE user_id = $1`,
  [userId]);

export const disableMfa = (client, userId) => client.query(
  `UPDATE users SET mfa_enabled = FALSE, mfa_enabled_at = NULL, mfa_secret_enc = NULL
    WHERE user_id = $1`, [userId]);

/**
 * Выдать коды восстановления. Прежние гасятся: два действующих набора — это
 * набор, о котором человек забыл, и он-то и утечёт.
 */
export async function issueRecoveryCodes(client, userId, сколько = 10) {
  await client.query(
    `UPDATE mfa_recovery_codes SET used_at = NOW()
      WHERE user_id = $1 AND used_at IS NULL`, [userId]);
  const коды = [];
  for (let i = 0; i < сколько; i++) {
    // Читаемая группировка: код переписывают с экрана на бумагу.
    const код = crypto.randomBytes(5).toString('hex').match(/.{5}/g).join('-');
    коды.push(код);
    await client.query(
      `INSERT INTO mfa_recovery_codes (user_id, code_sha256) VALUES ($1, $2)`,
      [userId, sha256(код)]);
  }
  return коды;
}

/** Погасить код восстановления. Отдаёт true, если код был и был живым. */
export async function spendRecoveryCode(client, userId, код) {
  const { rowCount } = await client.query(`
    UPDATE mfa_recovery_codes SET used_at = NOW()
     WHERE user_id = $1 AND code_sha256 = $2 AND used_at IS NULL`,
    [userId, sha256(String(код ?? '').trim())]);
  return rowCount === 1;
}

export async function countRecoveryCodes(db, userId) {
  const { rows } = await db.query(
    `SELECT count(*)::int AS "осталось" FROM mfa_recovery_codes
      WHERE user_id = $1 AND used_at IS NULL`, [userId]);
  return rows[0].осталось;
}

/** Сессия прошла второй шаг: перестаёт быть частичной. */
export const passSessionMfa = (client, sessionId) => client.query(
  `UPDATE user_sessions SET mfa_pending = FALSE, mfa_passed_at = NOW()
    WHERE session_id = $1`, [sessionId]);

export async function sessionMfaState(db, sessionId) {
  const { rows } = await db.query(`
    SELECT s.user_id AS "userId", s.mfa_pending AS "ожидает",
           s.mfa_passed_at AS "пройденВ"
      FROM user_sessions s
     WHERE s.session_id = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()`,
    [sessionId]);
  return rows[0] ?? null;
}
