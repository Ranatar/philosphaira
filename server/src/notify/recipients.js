// КОМУ. Единственное место, отвечающее на этот вопрос.
//
// Его же зовёт проба — она не пересказывает правило, а спрашивает его.
// Пересказ уже однажды дал ложное согласие: в первой редакции проверка
// «своё ли это» была записана дважды, и в одном из трёх мест список типов
// побеждал её, а в другом делал недостижимой.

import { CATALOG, peerLevel } from './catalog.js';
import { staffIds } from '../db/notifications.js';

export async function recipientsFor(client, type, data) {
  const опись = CATALOG[type];
  if (!опись) {
    throw new Error(`уведомления: неизвестный тип «${type}» — ` +
      'у типа либо есть опись, либо его нет');
  }

  switch (опись.audience.kind) {
    case 'everyone':
      return { broadcast: true };

    case 'author':
      return { userIds: data?.authorId ? [data.authorId] : [] };

    case 'subject':
      return { userIds: data?.userId ? [data.userId] : [] };

    case 'staff': {
      const уровень = опись.audience.minLevelFrom === 'peerLevel'
        ? peerLevel(data) : опись.audience.minLevel;
      const все = await staffIds(client, уровень);
      // Ни тот, о ком событие, ни автор коммита не получают служебной копии
      // о самих себе: первому уже пришло адресное уведомление, второй и так
      // знает, что отправил коммит.
      const свои = new Set([data?.userId, data?.authorId].filter(Boolean));
      return { userIds: все.filter(id => !свои.has(id)) };
    }

    default:
      throw new Error(`уведомления: неизвестный род адресата «${опись.audience.kind}»`);
  }
}
