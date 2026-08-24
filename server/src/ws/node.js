// УЗЕЛ: соединения + подписка на шину.
//
// Работник исходящих (3.2) кладёт уведомление в базу и публикует ИЗВЕЩЕНИЕ.
// Узел добирает уведомление из базы и разносит по своим сокетам. Так
// уведомление доходит и до тех, кто висит на другом узле.

import { Соединения } from './manager.js';
import { subscribe, publish } from './bus.js';
import { notificationForDelivery } from '../db/notifications.js';

export async function поднятьУзел({ db, строкаПодключения, origins = null }) {
  const соединения = new Соединения({ db, origins });

  const подписка = await subscribe(строкаПодключения, async и => {
    if (и.вид === 'уведомление') {
      const н = await notificationForDelivery(db, и.notificationId).catch(() => null);
      if (!н) return;
      соединения.кЧеловеку(и.userId,
        { type: 'notification', notification: { type: н.type, data: н.data } });
      return;
    }
    if (и.вид === 'вещание') {
      соединения.кВсем({ type: 'broadcast', broadcastId: и.broadcastId, тип: и.type });
      return;
    }
    if (и.вид === 'сессия-отозвана') { соединения.порватьСессию(и.sessionId); return; }
    if (и.вид === 'доступ-отозван')  { соединения.порватьЧеловека(и.userId); return; }
  });

  return {
    соединения,
    handleUpgrade: (req, socket, head) => соединения.handleUpgrade(req, socket, head),
    async close() { соединения.close(); await подписка.close(); },
  };
}

export { publish };
