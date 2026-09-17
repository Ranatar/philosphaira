// УЗЕЛ: соединения + подписка на шину.
//
// Работник исходящих (3.2) кладёт уведомление в базу и публикует ИЗВЕЩЕНИЕ.
// Узел добирает уведомление из базы и разносит по своим сокетам. Так
// уведомление доходит и до тех, кто висит на другом узле.

import { Connections } from './manager.js';
import { subscribe, publish } from './bus.js';
import { notificationForDelivery } from '../db/notifications.js';

export async function startNode({ db, строкаПодключения: connectionString, origins = null }) {
  const connections = new Connections({ db, origins });

  const subscription = await subscribe(connectionString, async change => {
    if (change.вид === 'уведомление') {
      const notification = await notificationForDelivery(db, change.notificationId).catch(() => null);
      if (!notification) return;
      connections.кЧеловеку(change.userId,
        { type: 'notification', notification: { type: notification.type, data: notification.data } });
      return;
    }
    if (change.вид === 'вещание') {
      connections.кВсем({ type: 'broadcast', broadcastId: change.broadcastId, тип: change.type });
      return;
    }
    if (change.вид === 'сессия-отозвана') { connections.порватьСессию(change.sessionId); return; }
    if (change.вид === 'доступ-отозван')  { connections.порватьЧеловека(change.userId); return; }
  });

  return {
    соединения: connections,
    handleUpgrade: (req, socket, head) => connections.handleUpgrade(req, socket, head),
    async close() { connections.close(); await subscription.close(); },
  };
}

export { publish };
