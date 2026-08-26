// Шифрование секретов TOTP.
//
// Секрет второго шага в базе открытым лежать не должен: утечка дампа иначе
// равна утечке всех вторых шагов сразу. Ключ — из окружения, а не из кода:
// иначе он уедет в репозиторий вместе с первым же коммитом.
//
// AES-256-GCM даёт и шифрование, и подпись: подменённый шифротекст не
// расшифруется, а не расшифруется молча в мусор.

import crypto from 'node:crypto';

const ALG = 'aes-256-gcm';

function fieldKey() {
  const fromEnv = process.env.MFA_SECRET_KEY;
  if (!fromEnv) {
    throw new Error(
      'MFA_SECRET_KEY не задан. Умолчания здесь нет нарочно: ключ из кода — ' +
      'это ключ, известный всем, кто видел код.');
  }
  const bytes = Buffer.from(fromEnv, 'base64');
  if (bytes.length !== 32) {
    throw new Error(`MFA_SECRET_KEY должен быть 32 байта в base64, а не ${bytes.length}`);
  }
  return bytes;
}

/**
 * Проверить ключ, ничего не шифруя. Зовётся при запуске: без этого сервер
 * поднимался МОЛЧА и падал лишь на первом входе со вторым шагом — то есть
 * у первого же человека, а не у того, кто запускал. Отказ должен случаться
 * там, где его увидит тот, кто может починить.
 */
export function assertKey() { fieldKey(); }

export function encrypt(текст) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, fieldKey(), iv);
  const payloadBuf = Buffer.concat([cipher.update(текст, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), payloadBuf]);
}

export function decrypt(буфер) {
  const second = Buffer.from(буфер);
  const iv = second.subarray(0, 12), метка = second.subarray(12, 28), payloadBuf = second.subarray(28);
  const decipher = crypto.createDecipheriv(ALG, fieldKey(), iv);
  decipher.setAuthTag(метка);
  return Buffer.concat([decipher.update(payloadBuf), decipher.final()]).toString('utf8');
}

export const newKey = () => crypto.randomBytes(32).toString('base64');
