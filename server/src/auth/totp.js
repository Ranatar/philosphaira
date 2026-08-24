// TOTP (RFC 6238) на node:crypto. Внешней зависимости здесь не нужно:
// это HMAC, отсчёт тридцатисекундными шагами и десятичная свёртка.
//
// Почему TOTP, а не WebAuthn: WebAuthn лучше по существу, но требует железа
// и усложняет восстановление. Он приходит вторым способом, а не первым.

import crypto from 'node:crypto';

export const ШАГ_СЕК = 30;
export const ЗНАКОВ  = 6;

// Base32 (RFC 4648) без набивки: в таком виде секрет читают приложения
// вроде FreeOTP и попадает в ссылку otpauth://.
const АЛФАВИТ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(буфер) {
  let биты = 0, накоплено = 0, вышло = '';
  for (const байт of буфер) {
    накоплено = (накоплено << 8) | байт; биты += 8;
    while (биты >= 5) { вышло += АЛФАВИТ[(накоплено >>> (биты - 5)) & 31]; биты -= 5; }
  }
  if (биты > 0) вышло += АЛФАВИТ[(накоплено << (5 - биты)) & 31];
  return вышло;
}

export function base32Decode(строка) {
  let биты = 0, накоплено = 0;
  const байты = [];
  for (const знак of строка.replace(/=+$/, '').toUpperCase()) {
    const i = АЛФАВИТ.indexOf(знак);
    if (i === -1) throw new Error(`base32: недопустимый знак «${знак}»`);
    накоплено = (накоплено << 5) | i; биты += 5;
    if (биты >= 8) { байты.push((накоплено >>> (биты - 8)) & 255); биты -= 8; }
  }
  return Buffer.from(байты);
}

/** Секрет в 20 байт — как советует RFC 4226 для HMAC-SHA1. */
export const создатьСекрет = () => base32Encode(crypto.randomBytes(20));

export function код(секретBase32, время = Date.now()) {
  const шаг = Math.floor(время / 1000 / ШАГ_СЕК);
  const счётчик = Buffer.alloc(8);
  счётчик.writeBigUInt64BE(BigInt(шаг));
  const hmac = crypto.createHmac('sha1', base32Decode(секретBase32))
    .update(счётчик).digest();
  // Динамическая усечка по RFC 4226 §5.4.
  const сдвиг = hmac[hmac.length - 1] & 0x0f;
  const число = ((hmac[сдвиг] & 0x7f) << 24) | (hmac[сдвиг + 1] << 16)
              | (hmac[сдвиг + 2] << 8)  |  hmac[сдвиг + 3];
  return String(число % 10 ** ЗНАКОВ).padStart(ЗНАКОВ, '0');
}

/**
 * Сверка с окном в один шаг в обе стороны: часы у телефона и у сервера
 * расходятся, и требовать точного совпадения значит отказывать честным.
 * Сравнение постоянного времени — код короткий, но и он не должен выдавать
 * длину общего начала.
 */
export function сверить(секретBase32, предъявленный, время = Date.now()) {
  const дано = String(предъявленный ?? '').trim();
  if (!/^\d{6}$/.test(дано)) return false;
  for (const шаг of [-1, 0, 1]) {
    const ждём = код(секретBase32, время + шаг * ШАГ_СЕК * 1000);
    if (crypto.timingSafeEqual(Buffer.from(ждём), Buffer.from(дано))) return true;
  }
  return false;
}

/** Ссылка для приложения-аутентификатора. */
export const otpauth = ({ секрет, логин, издатель = 'PhilosPhaira' }) =>
  `otpauth://totp/${encodeURIComponent(издатель)}:${encodeURIComponent(логин)}`
  + `?secret=${секрет}&issuer=${encodeURIComponent(издатель)}`
  + `&algorithm=SHA1&digits=${ЗНАКОВ}&period=${ШАГ_СЕК}`;
