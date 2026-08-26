// COOKIE И CSRF.
//
// Токен в localStorage, как было в первой редакции, крадёт любой XSS.
// Поэтому сессия живёт в httpOnly-cookie — но тогда браузер шлёт её сам,
// и появляется CSRF. Лечится двойной отправкой: рядом кладётся ОБЫЧНАЯ
// (читаемая) cookie со случайным значением, и всякий изменяющий запрос
// обязан прислать её же заголовком.

import crypto from 'node:crypto';
import { Forbidden } from './errors.js';

export const SESSION_COOKIE = 'session';
export const CSRF_COOKIE   = 'csrf';

export const cookieСеанса = (безопасно = true) => ({
  httpOnly: true,
  secure: безопасно,
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 3600 * 1000,
});

export const cookieCsrf = (безопасно = true) => ({
  httpOnly: false,          // её обязан прочитать клиент — в этом весь приём
  secure: безопасно,
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 3600 * 1000,
});

export const newCsrfToken = () => crypto.randomBytes(24).toString('base64url');

export function checkCsrf(req, _res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const fromCookie = req.cookies?.[CSRF_COOKIE];
  const fromHeader = req.get?.('X-CSRF-Token');
  // Сравнение постоянного времени: обычное === выдаёт длину общего начала.
  const matched = fromCookie && fromHeader
    && fromCookie.length === fromHeader.length
    && crypto.timingSafeEqual(Buffer.from(fromCookie), Buffer.from(fromHeader));
  if (!matched) return next(new Forbidden('Не сошёлся признак CSRF'));
  next();
}
