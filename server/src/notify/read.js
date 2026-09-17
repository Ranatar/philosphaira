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
import { checkUnsubscribeToken } from './unsubscribe.js';
import { Forbidden } from '../http/errors.js';

export const unread = (pool, user) => unreadCount(pool, user.userId);

export async function list(pool, user, { onlyUnread = false, limit = 50 } = {}) {
  const [addressed, broadcast] = await Promise.all([
    listAddressed(pool, { userId: user.userId, onlyUnread, limit }),
    listBroadcasts(pool, { userId: user.userId, limit }),
  ]);
  const allItems = [
    ...addressed.map(item => ({ ...item, вид: 'адресное' })),
    ...broadcast.filter(item => !onlyUnread || !item.прочитано)
              .map(item => ({ ...item, вид: 'широковещательное' })),
  ].sort((first, second) => +new Date(second.createdAt) - +new Date(first.createdAt));
  return allItems.slice(0, limit);
}

export const read = (pool, user, notificationId) =>
  withTransaction(pool, client => markRead(client, { userId: user.userId, notificationId }));

export const readAll = (pool, user) =>
  withTransaction(pool, client => markAllRead(client, user.userId));

export const preferences = (pool, user) => getPreferences(pool, user.userId);

/**
 * Отписка по подписанной ссылке из письма — БЕЗ ВХОДА.
 *
 * Выключает почту целиком и больше ничего. Отказ при негодной подписи
 * ОДИНАКОВ для «нет такого человека» и «подпись не та»: иначе ссылка стала
 * бы способом перебирать, какие номера заведены.
 */
export async function unsubscribeByToken(pool, { userId, token }) {
  if (!userId || !checkUnsubscribeToken(userId, token)) {
    throw new Forbidden('Ссылка отписки недействительна');
  }
  await withTransaction(pool, client =>
    setPreferences(client, userId, { emailEnabled: false }));
  return { отписан: true };
}

export function updatePreferences(pool, user, changes) {
  for (const categoryName of Object.keys(changes.categories ?? {})) {
    if (!CATEGORIES[categoryName]) throw new Forbidden(`Нет такой категории: «${categoryName}»`);
    if (CATEGORIES[categoryName].mandatory && changes.categories[categoryName] === false) {
      throw new Forbidden(
        `Категорию «${CATEGORIES[categoryName].title}» отключить нельзя: ` +
        'о собственном положении сообщают всегда');
    }
  }
  return withTransaction(pool, client => setPreferences(client, user.userId, changes));
}
