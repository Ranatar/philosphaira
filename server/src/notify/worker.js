// РАБОТНИК ИСХОДЯЩИХ.
//
// Складывает уведомления служба (беседа 3.1) — в той же транзакции, что и
// само действие. Доставляет их отсюда, отдельно и позже. Порядок именно
// такой, потому что в первой редакции падение почты роняло уже совершённую
// смену роли и выдавало клиенту ошибку на удавшемся действии.
//
// Отсюда главное свойство: НЕ ДОСТАВЛЕННОЕ НЕ ТЕРЯЕТСЯ. Строка остаётся в
// исходящих с растущей задержкой и последней ошибкой; следующий заход
// возьмёт её снова.
//
// Отправитель ПОДСТАВЛЯЕТСЯ доводом, а не берётся из воздуха: проба
// подсовывает падающий и смотрит, что будет.

import { withTransaction } from '../db/tx.js';
import { claimOutbox, markDelivered, markFailed, notificationForDelivery,
         digestRecipients, broadcastsSince, stampDigest, sweepExpired }
  from '../db/notifications.js';
import { renderEmail, renderDigest } from './email.js';
import { publish } from '../ws/bus.js';
import { CATALOG } from './catalog.js';

/** Отправитель по умолчанию: никуда не шлёт и об этом говорит. */
export const nullSender = {
  async send() {
    throw new Error('отправитель писем не настроен: задайте свой в работнике');
  },
};

/**
 * Один заход по исходящим.
 * Возвращает счёт: сколько доставлено, сколько отложено, сколько пропущено.
 */
export async function deliverOnce(pool, { отправитель = nullSender,
                                          сколько = 50 } = {}) {
  const batch = await withTransaction(pool, client =>
    claimOutbox(client, { сколько }));

  let delivered = 0, отложено = 0, пропущено = 0;

  for (const record of batch) {
    try {
      if (record.channel === 'broadcast') {
        // Широковещательное письмо в одиночку не шлётся: его место в
        // сводке. Строку закрываем — иначе она будет вечно возвращаться.
        await withTransaction(pool, client => publish(client,
          { вид: 'вещание', broadcastId: record.payload.broadcastId,
            type: record.payload.type })).catch(() => {});
        await withTransaction(pool, client => markDelivered(client, record.id));
        пропущено++;
        continue;
      }

      const notification = await notificationForDelivery(pool, record.payload.notificationId);
      // Извещение в шину идёт ДО почты и независимо от неё: живому окну
      // уведомление нужно сейчас, а не после того, как встанет почтовый
      // сервер. Падение почты отложит письмо, но не окно.
      if (notification) {
        await withTransaction(pool, client => publish(client,
          { вид: 'уведомление', notificationId: record.payload.notificationId,
            userId: notification.userId })).catch(() => {});
      }
      if (!notification) { // уведомление успели убрать по сроку
        await withTransaction(pool, client => markDelivered(client, record.id));
        пропущено++;
        continue;
      }
      if (!notification.почтойХочет) {
        await withTransaction(pool, client => markDelivered(client, record.id));
        пропущено++;
        continue;
      }

      const letter = renderEmail(notification.type, notification.data);
      await отправитель.send({ to: notification.email, ...letter });
      await withTransaction(pool, client => markDelivered(client, record.id));
      delivered++;
    } catch (e) {
      await withTransaction(pool, client => markFailed(client,
        { id: record.id, attempts: record.attempts, ошибка: e.message }));
      отложено++;
    }
  }
  return { взято: batch.length, доставлено: delivered, отложено, пропущено };
}

/**
 * Сводка по широковещательным: одно письмо в час на человека вместо письма
 * на каждое событие. Курсор broadcast_seen_id не трогаем — он про
 * прочитанность в приложении, а не про почту; для почты своя отметка.
 */
export async function sendDigests(pool, { отправитель = nullSender,
                                          часов = 1, категория = 'graphChanges' } = {}) {
  const recipients = await digestRecipients(pool, { категория, часов });
  let sent = 0, пусто = 0, отложено = 0;

  for (const person of recipients) {
    const events = await broadcastsSince(pool,
      { послеId: person.курсор, категория });
    if (!events.length) { пусто++; continue; }
    try {
      await отправитель.send({ to: person.email, ...renderDigest(events) });
      await withTransaction(pool, client => stampDigest(client, person.id));
      sent++;
    } catch {
      // Отметку НЕ ставим: не отправленная сводка должна уйти в следующий раз.
      отложено++;
    }
  }
  return { кандидатов: recipients.length, отправлено: sent, пусто, отложено };
}

/** Суточная уборка. Просроченное не хранится: индекс на expires_at для того и есть. */
export const sweep = pool => withTransaction(pool, client => sweepExpired(client));

/** Проверка полноты образцов: тип без образца — ошибка, а не пропажа. */
export function typesWithoutTemplate() {
  return Object.keys(CATALOG).filter(тип => {
    try { renderEmail(тип, {}); return false; } catch { return true; }
  });
}
