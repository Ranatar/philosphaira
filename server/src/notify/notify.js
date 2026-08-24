// СКЛАДЫВАНИЕ УВЕДОМЛЕНИЙ.
//
// Зовётся ВНУТРИ той же транзакции, что и само действие, и ничего не
// доставляет: кладёт в исходящие. В первой редакции падение почты роняло
// уже совершённую смену роли — и клиент получал ошибку на удавшемся действии.
//
// Путь ОДИН. В первой редакции их было два: broadcastNotification спрашивал
// правила, а адресный createNotification — нет, и ветки правил про «свои
// коммиты» работали вхолостую.

import { CATALOG, CATEGORIES } from './catalog.js';
import { recipientsFor } from './recipients.js';
import { insertAddressed, insertBroadcast, enqueue, enqueueMany, keepSubscribed }
  from '../db/notifications.js';

// Одно место. В первой редакции срок был 7 дней в примере структуры и 30 в коде.
export const NOTIFICATION_TTL_DAYS = 30;

export async function notify(client, type, data) {
  const опись = CATALOG[type];
  if (!опись) throw new Error(`уведомления: неизвестный тип «${type}»`);

  const кому = await recipientsFor(client, type, data);

  if (кому.broadcast) {
    const id = await insertBroadcast(client, {
      type, category: опись.category, data, дней: NOTIFICATION_TTL_DAYS });
    await enqueue(client, 'broadcast', { broadcastId: id, type });
    return { broadcastId: id, создано: 1 };
  }

  const кто = CATEGORIES[опись.category].mandatory
    ? кому.userIds
    : await keepSubscribed(client, кому.userIds, опись.category);
  if (!кто.length) return { создано: 0 };

  const имена = await insertAddressed(client, {
    userIds: кто, type, category: опись.category,
    priority: опись.priority, data, дней: NOTIFICATION_TTL_DAYS });
  await enqueueMany(client, 'notification',
    имена.map(id => ({ notificationId: id, type })));
  return { создано: имена.length };
}
