// СЕССИИ.
//
// JWT здесь не даёт ничего. Довод «не ходить в базу» не работает: каждый
// запрос и так читает пользователя, чтобы узнать про бан, роль и почту.
// Зато JWT приносит неотзываемость. Поэтому токен НЕПРОЗРАЧНЫЙ, хранится
// хешем и ищется ПО ХЕШУ.
//
// В первой редакции сессия искалась по user_id, а token_hash не сверялся
// НИКОГДА: пока жила хоть одна сессия, проходил любой токен этого
// пользователя, включая отозванный. Таблица сессий была украшением.
//
// И хешировался токен через bcrypt — то есть (а) обрезался на 72 байтах,
// (б) не мог искаться индексом вовсе: bcrypt даёт разную соль на каждый
// вызов, и «найти по хешу» превращается в перебор всех сессий.

import crypto from 'node:crypto';
import { userFromRow } from './mapper.js';

export const СРОК_ДНЕЙ = 30;

const sha256 = токен => crypto.createHash('sha256').update(токен).digest();

/**
 * Выдать сессию. Возвращает ОТКРЫТЫЙ токен — единственный раз, когда он
 * существует в открытом виде; в базе только хеш.
 */
export async function createSession(client, { userId, ip = null, userAgent = null,
                                              mfaPending = false }) {
  const токен = crypto.randomBytes(32).toString('base64url');
  const { rows } = await client.query(`
    INSERT INTO user_sessions (user_id, token_sha256, ip_address, user_agent,
                               mfa_pending, expires_at)
    VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '${СРОК_ДНЕЙ} days')
    RETURNING session_id AS "sessionId"`,
    [userId, sha256(токен), ip, userAgent, mfaPending]);
  return { токен, sessionId: rows[0].sessionId };
}

/**
 * Найти живую сессию ПО ХЕШУ ТОКЕНА и сразу отдать ДОМЕННЫЙ объект.
 * Отдавать строку было бы удобнее, но тогда привратник начал бы читать
 * змеиные поля — а это ровно то, из чего выросла половина дефектов первой
 * редакции. Проба строения на этом и поймала первый набросок.
 */
export async function sessionByToken(db, токен) {
  if (!токен) return null;
  const { rows } = await db.query(`
    SELECT u.*, s.session_id, s.mfa_pending, s.mfa_passed_at
      FROM user_sessions s JOIN users u USING (user_id)
     WHERE s.token_sha256 = $1
       AND s.revoked_at IS NULL AND s.expires_at > NOW()`, [sha256(токен)]);
  const строка = rows[0];
  if (!строка) return null;
  return {
    user: userFromRow(строка, { кому: { userId: строка.user_id, level: 4 } }),
    sessionId:   строка.session_id,
    mfaPending:  строка.mfa_pending === true,
    mfaPassedAt: строка.mfa_passed_at,
  };
}

/** Погасить ОДНУ сессию. Выход на одном устройстве не выбрасывает со всех. */
export const revokeSession = (client, sessionId) => client.query(
  `UPDATE user_sessions SET revoked_at = NOW()
    WHERE session_id = $1 AND revoked_at IS NULL`, [sessionId]);

/** Погасить все сессии пользователя: «выйти везде», бан, понижение роли. */
export const revokeAllSessions = (client, userId) => client.query(
  `UPDATE user_sessions SET revoked_at = NOW()
    WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);

/** Отметка активности. Без await: задерживать ответ ради неё незачем. */
export const touchSession = (db, sessionId) => db.query(
  `UPDATE user_sessions SET last_activity = NOW() WHERE session_id = $1`,
  [sessionId]).catch(() => {});

export { sha256 };
