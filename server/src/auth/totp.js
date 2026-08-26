// TOTP (RFC 6238) на node:crypto. Внешней зависимости здесь не нужно:
// это HMAC, отсчёт тридцатисекундными шагами и десятичная свёртка.
//
// Почему TOTP, а не WebAuthn: WebAuthn лучше по существу, но требует железа
// и усложняет восстановление. Он приходит вторым способом, а не первым.

import crypto from 'node:crypto';

export const STEP_SEC = 30;
export const CHARS  = 6;

// Base32 (RFC 4648) без набивки: в таком виде секрет читают приложения
// вроде FreeOTP и попадает в ссылку otpauth://.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(буфер) {
  let bits = 0, накоплено = 0, вышло = '';
  for (const byte of буфер) {
    накоплено = (накоплено << 8) | byte; bits += 8;
    while (bits >= 5) { вышло += ALPHABET[(накоплено >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) вышло += ALPHABET[(накоплено << (5 - bits)) & 31];
  return вышло;
}

export function base32Decode(row) {
  let bits = 0, накоплено = 0;
  const bytes = [];
  for (const symbol of row.replace(/=+$/, '').toUpperCase()) {
    const i = ALPHABET.indexOf(symbol);
    if (i === -1) throw new Error(`base32: недопустимый знак «${symbol}»`);
    накоплено = (накоплено << 5) | i; bits += 5;
    if (bits >= 8) { bytes.push((накоплено >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(bytes);
}

/** Секрет в 20 байт — как советует RFC 4226 для HMAC-SHA1. */
export const createSecret = () => base32Encode(crypto.randomBytes(20));

export function totpCode(секретBase32, время = Date.now()) {
  const timeStep = Math.floor(время / 1000 / STEP_SEC);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(timeStep));
  const hmac = crypto.createHmac('sha1', base32Decode(секретBase32))
    .update(counterBuf).digest();
  // Динамическая усечка по RFC 4226 §5.4.
  const offset = hmac[hmac.length - 1] & 0x0f;
  const number = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16)
              | (hmac[offset + 2] << 8)  |  hmac[offset + 3];
  return String(number % 10 ** CHARS).padStart(CHARS, '0');
}

/**
 * Сверка с окном в один шаг в обе стороны: часы у телефона и у сервера
 * расходятся, и требовать точного совпадения значит отказывать честным.
 * Сравнение постоянного времени — код короткий, но и он не должен выдавать
 * длину общего начала.
 */
export function verifyCode(секретBase32, предъявленный, время = Date.now()) {
  const given = String(предъявленный ?? '').trim();
  if (!/^\d{6}$/.test(given)) return false;
  for (const timeStep of [-1, 0, 1]) {
    const expected = totpCode(секретBase32, время + timeStep * STEP_SEC * 1000);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return true;
  }
  return false;
}

/** Ссылка для приложения-аутентификатора. */
export const otpauth = ({ секрет: secret, логин, издатель = 'PhilosPhaira' }) =>
  `otpauth://totp/${encodeURIComponent(издатель)}:${encodeURIComponent(логин)}`
  + `?secret=${secret}&issuer=${encodeURIComponent(издатель)}`
  + `&algorithm=SHA1&digits=${CHARS}&period=${STEP_SEC}`;
