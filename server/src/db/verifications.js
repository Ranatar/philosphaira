// Подтверждения адреса: SQL и превращение строки в понятный объект.

import crypto from 'node:crypto';
import { sha256 } from './sessions.js';

export const СРОК_ЧАСОВ = 24;

export async function issueVerification(client, { userId, email }) {
  const токен = crypto.randomBytes(32).toString('base64url');
  await client.query(`
    INSERT INTO email_verifications (user_id, token_sha256, email, expires_at)
    VALUES ($1, $2, $3, NOW() + INTERVAL '${СРОК_ЧАСОВ} hours')`,
    [userId, sha256(токен), email]);
  return токен;   // письмо отправляет работник исходящих (беседа 3.2)
}

/** Отдаёт понятный объект, а не строку: змеиным полям наружу хода нет. */
export async function findVerification(client, токен) {
  const { rows } = await client.query(`
    SELECT v.verification_id AS "id", v.user_id AS "userId",
           v.email AS "email", v.used_at AS "usedAt", v.expires_at AS "expiresAt",
           u.email AS "currentEmail"
      FROM email_verifications v JOIN users u USING (user_id)
     WHERE v.token_sha256 = $1 FOR UPDATE`, [sha256(токен)]);
  return rows[0] ?? null;
}

export const markVerificationUsed = (client, id) => client.query(
  `UPDATE email_verifications SET used_at = NOW() WHERE verification_id = $1`, [id]);
