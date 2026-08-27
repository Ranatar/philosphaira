// УЗЕЛ: соединения + подписка на шину.
//
// Работник исходящих (3.2) кладёт уведомление в базу и публикует ИЗВЕЩЕНИЕ.
// Узел добирает уведомление из базы и разносит по своим сокетам. Так
// уведомление доходит и до тех, кто висит на другом узле.

import { Connections } from './manager.js';
import { subscribe, publish } from './bus.js';
import { notificationForDelivery } from '../db/notifications.js';

export async function startNode({ db, строкаПодключения, origins = null }) {
  const connections = new Connections({ db, origins });

  const subscription = await subscribe(строкаПодключения, async и => {
    if (и.вид === 'уведомление') {
      const notification = await notificationForDelivery(db, и.notificationId).catch(() => null);
      if (!notification) return;
      connections.кЧеловеку(и.userId,
        { type: 'notification', notification: { type: notification.type, data: notification.data } });
      return;
    }
    if (и.вид === 'вещание') {
      connections.кВсем({ type: 'broadcast', broadcastId: и.broadcastId, тип: и.type });
      return;
    }
    if (и.вид === 'сессия-отозвана') { connections.порватьСессию(и.sessionId); return; }
    if (и.вид === 'доступ-отозван')  { connections.порватьЧеловека(и.userId); return; }
  });

  return {
    соединения: connections,
    handleUpgrade: (req, socket, head) => connections.handleUpgrade(req, socket, head),
    async close() { connections.close(); await subscription.close(); },
  };
}

export { publish };
