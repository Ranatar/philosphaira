// ЧТЕНИЕ УВЕДОМЛЕНИЙ.
//
// Трёх меток времени первой редакции (last_login, lastNotificationCheck,
// read) больше нет: непрочитанность адресных считается признаком is_read,
// широковещательных — курсором. last_login остался для журнала входов и на
// счёт уведомлений не влияет.

import { withTransaction } from '../db/tx.js';
import { unreadCount, listAddressed, listBroadcasts, markRead, markAllRead,
         getPreferences, setPreferences } from '../db/notifications.js';
import { CATEGORIES } from './catalog.js';
import { Forbidden } from '../http/errors.js';

export const unread = (pool, user) => unreadCount(pool, user.userId);

export async function list(pool, user, { onlyUnread = false, limit = 50 } = {}) {
  const [адресные, вещание] = await Promise.all([
    listAddressed(pool, { userId: user.userId, onlyUnread, limit }),
    listBroadcasts(pool, { userId: user.userId, limit }),
  ]);
  const allItems = [
    ...адресные.map(з => ({ ...з, вид: 'адресное' })),
    ...вещание.filter(з => !onlyUnread || !з.прочитано)
              .map(з => ({ ...з, вид: 'широковещательное' })),
  ].sort((first, second) => +new Date(second.createdAt) - +new Date(first.createdAt));
  return allItems.slice(0, limit);
}

export const read = (pool, user, notificationId) =>
  withTransaction(pool, client => markRead(client, { userId: user.userId, notificationId }));

export const readAll = (pool, user) =>
  withTransaction(pool, client => markAllRead(client, user.userId));

export const preferences = (pool, user) => getPreferences(pool, user.userId);

export function updatePreferences(pool, user, изменения) {
  for (const categoryName of Object.keys(изменения.categories ?? {})) {
    if (!CATEGORIES[categoryName]) throw new Forbidden(`Нет такой категории: «${categoryName}»`);
    if (CATEGORIES[categoryName].mandatory && изменения.categories[categoryName] === false) {
      throw new Forbidden(
        `Категорию «${CATEGORIES[categoryName].title}» отключить нельзя: ` +
        'о собственном положении сообщают всегда');
    }
  }
  return withTransaction(pool, client => setPreferences(client, user.userId, изменения));
}
