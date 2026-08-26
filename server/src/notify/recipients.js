// КОМУ. Единственное место, отвечающее на этот вопрос.
//
// Его же зовёт проба — она не пересказывает правило, а спрашивает его.
// Пересказ уже однажды дал ложное согласие: в первой редакции проверка
// «своё ли это» была записана дважды, и в одном из трёх мест список типов
// побеждал её, а в другом делал недостижимой.

import { CATALOG, peerLevel } from './catalog.js';
import { staffIds } from '../db/notifications.js';

export async function recipientsFor(client, type, data) {
  const spec = CATALOG[type];
  if (!spec) {
    throw new Error(`уведомления: неизвестный тип «${type}» — ` +
      'у типа либо есть опись, либо его нет');
  }

  switch (spec.audience.kind) {
    case 'everyone':
      return { broadcast: true };

    case 'author':
      return { userIds: data?.authorId ? [data.authorId] : [] };

    case 'subject':
      return { userIds: data?.userId ? [data.userId] : [] };

    case 'staff': {
      const level = spec.audience.minLevelFrom === 'peerLevel'
        ? peerLevel(data) : spec.audience.minLevel;
      const allItems = await staffIds(client, level);
      // Ни тот, о ком событие, ни автор коммита не получают служебной копии
      // о самих себе: первому уже пришло адресное уведомление, второй и так
      // знает, что отправил коммит.
      const ownIds = new Set([data?.userId, data?.authorId].filter(Boolean));
      return { userIds: allItems.filter(id => !ownIds.has(id)) };
    }

    default:
      throw new Error(`уведомления: неизвестный род адресата «${spec.audience.kind}»`);
  }
}
