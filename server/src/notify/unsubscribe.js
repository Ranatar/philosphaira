// ОТПИСКА ОДНИМ НАЖАТИЕМ.
//
// ПОВОД — НЕ УДОБСТВО, А ДОСТАВЛЯЕМОСТЬ. Человек, которому надоели письма,
// имеет два способа их прекратить: найти отписку или нажать «это спам».
// Второй способ проще, и он бьёт по ОТПРАВИТЕЛЮ: почтовые службы считают
// жалобы и после сотой начинают складывать в спам ВСЕ письма с домена —
// включая подтверждение адреса, без которого открытая регистрация не
// работает вовсе. Поэтому отписка должна быть заметнее жалобы.
//
// Gmail и Yahoo с 2024 года требуют от рассылок заголовок `List-Unsubscribe`
// и отписку В ОДНО ДЕЙСТВИЕ, без входа и без вопросов. Ссылка потому и
// подписывается: получатель письма не вошёл в систему и войти не обязан.
//
// ЧЕГО ССЫЛКА НЕ ДАЁТ. Только выключение почты. Ни чтения, ни правки, ни
// смены адреса — попавший в чужие руки токен позволяет ровно то же, что и
// нажатие «это спам», то есть ничего сверх уже возможного.
//
// КЛЮЧ ОТДЕЛЬНЫЙ, А НЕ ТОТ ЖЕ. Секрет берётся из MFA_SECRET_KEY, но не сам
// ключ: из него выводится подключ для этой и только этой надобности. Один
// ключ на два дела — способ однажды обнаружить, что подпись отписки годится
// там, где ждали секрет второго шага.

import crypto from 'node:crypto';
import { CATALOG, CATEGORIES } from './catalog.js';

const PURPOSE = 'philos/unsubscribe/v1';

function subkey() {
  const fromEnv = process.env.MFA_SECRET_KEY;
  if (!fromEnv) throw new Error('MFA_SECRET_KEY не задан: подписать отписку нечем');
  const bytes = Buffer.from(fromEnv, 'base64');
  if (bytes.length !== 32) {
    throw new Error(`MFA_SECRET_KEY должен быть 32 байта в base64, а не ${bytes.length}`);
  }
  return crypto.createHmac('sha256', bytes).update(PURPOSE).digest();
}

/** Подпись для одного человека. Не истекает: письмо может пролежать год. */
export function unsubscribeToken(userId) {
  return crypto.createHmac('sha256', subkey())
    .update(String(userId)).digest('base64url');
}

/** Сверка ПОСТОЯННЫМ ПО ВРЕМЕНИ сравнением: иначе подпись подбирается побайтно. */
export function checkUnsubscribeToken(userId, token) {
  const expected = Buffer.from(unsubscribeToken(userId));
  const given = Buffer.from(String(token ?? ''));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

/**
 * Можно ли отписаться от письма этого типа.
 *
 * Обязательные категории («моя учётная запись», «моё положение») отписке не
 * подлежат — и заголовка у них быть не должно: отписка, которая ничего не
 * выключает, хуже её отсутствия. Подтверждение адреса — письмо
 * ТРАНЗАКЦИОННОЕ, ответ на действие человека, а не рассылка.
 */
export function unsubscribable(type) {
  const entry = CATALOG[type];
  if (!entry) return false;
  return CATEGORIES[entry.category]?.mandatory !== true;
}

/**
 * Заголовки письма. Пустой набор — для тех типов, от которых не отписаться.
 *
 * `List-Unsubscribe-Post` — это и есть «одно действие»: почтовая служба сама
 * отправляет POST, не открывая браузер и не спрашивая человека.
 */
export function mailHeaders({ type, userId, baseUrl }) {
  if (!unsubscribable(type) || !userId) return {};
  const link = `${baseUrl.replace(/\/+$/, '')}/api/notifications/unsubscribe`
    + `?u=${encodeURIComponent(userId)}&t=${unsubscribeToken(userId)}`;
  return {
    'List-Unsubscribe': `<${link}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}
