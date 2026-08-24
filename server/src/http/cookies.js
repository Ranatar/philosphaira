// COOKIE И CSRF.
//
// Токен в localStorage, как было в первой редакции, крадёт любой XSS.
// Поэтому сессия живёт в httpOnly-cookie — но тогда браузер шлёт её сам,
// и появляется CSRF. Лечится двойной отправкой: рядом кладётся ОБЫЧНАЯ
// (читаемая) cookie со случайным значением, и всякий изменяющий запрос
// обязан прислать её же заголовком.

import crypto from 'node:crypto';
import { Forbidden } from './errors.js';

export const ИМЯ_СЕАНСА = 'session';
export const ИМЯ_CSRF   = 'csrf';

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

export const новыйПризнакCsrf = () => crypto.randomBytes(24).toString('base64url');

export function checkCsrf(req, _res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const изCookie = req.cookies?.[ИМЯ_CSRF];
  const изЗаголовка = req.get?.('X-CSRF-Token');
  // Сравнение постоянного времени: обычное === выдаёт длину общего начала.
  const сошлось = изCookie && изЗаголовка
    && изCookie.length === изЗаголовка.length
    && crypto.timingSafeEqual(Buffer.from(изCookie), Buffer.from(изЗаголовка));
  if (!сошлось) return next(new Forbidden('Не сошёлся признак CSRF'));
  next();
}
