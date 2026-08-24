// Шифрование секретов TOTP.
//
// Секрет второго шага в базе открытым лежать не должен: утечка дампа иначе
// равна утечке всех вторых шагов сразу. Ключ — из окружения, а не из кода:
// иначе он уедет в репозиторий вместе с первым же коммитом.
//
// AES-256-GCM даёт и шифрование, и подпись: подменённый шифротекст не
// расшифруется, а не расшифруется молча в мусор.

import crypto from 'node:crypto';

const АЛГ = 'aes-256-gcm';

function ключ() {
  const из = process.env.MFA_SECRET_KEY;
  if (!из) {
    throw new Error(
      'MFA_SECRET_KEY не задан. Умолчания здесь нет нарочно: ключ из кода — ' +
      'это ключ, известный всем, кто видел код.');
  }
  const байты = Buffer.from(из, 'base64');
  if (байты.length !== 32) {
    throw new Error(`MFA_SECRET_KEY должен быть 32 байта в base64, а не ${байты.length}`);
  }
  return байты;
}

export function зашифровать(текст) {
  const iv = crypto.randomBytes(12);
  const ш = crypto.createCipheriv(АЛГ, ключ(), iv);
  const тело = Buffer.concat([ш.update(текст, 'utf8'), ш.final()]);
  return Buffer.concat([iv, ш.getAuthTag(), тело]);
}

export function расшифровать(буфер) {
  const б = Buffer.from(буфер);
  const iv = б.subarray(0, 12), метка = б.subarray(12, 28), тело = б.subarray(28);
  const р = crypto.createDecipheriv(АЛГ, ключ(), iv);
  р.setAuthTag(метка);
  return Buffer.concat([р.update(тело), р.final()]).toString('utf8');
}

export const новыйКлюч = () => crypto.randomBytes(32).toString('base64');
