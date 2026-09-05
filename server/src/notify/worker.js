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
import { claimOutbox, markDelivered, markFailed, markDead, notificationForDelivery,
         digestRecipients, broadcastsSince, stampDigest, sweepExpired }
  from '../db/notifications.js';
import { renderEmail, renderDigest } from './email.js';
import { publish } from '../ws/bus.js';
import { CATALOG } from './catalog.js';
import { nullSender, isPermanentFailure } from './mail.js';
import { mailHeaders } from './unsubscribe.js';
import { N } from './catalog.js';

/**
 * Куда ведёт ссылка отписки. Та же переменная, что и в письмах
 * подтверждения (`auth/service.js`): адрес у службы один.
 */
const LINK_ROOT = () => process.env.PUBLIC_URL || 'http://127.0.0.1:8814';

// Отправитель по умолчанию живёт в mail.js — там же, где настоящий. Здесь
// он только перевозится дальше: два определения одного отправителя были бы
// двумя ответами на один вопрос.
export { nullSender };

/**
 * Сколько раз пробовать, прежде чем счесть письмо безнадёжным.
 *
 * Постоянный отказ виден сразу (5xx), а вот адрес, чей сервер не отвечает
 * НИКОГДА, отказывает временно — и без этого предела повторялся бы вечно,
 * раз в час. Десять попыток при удвоении задержки — это около суток.
 */
export const MAX_ATTEMPTS = 10;

/**
 * Один заход по исходящим.
 * Возвращает счёт: сколько доставлено, сколько отложено, сколько пропущено.
 */
export async function deliverOnce(pool, { отправитель = nullSender,
                                          сколько = 50 } = {}) {
  const batch = await withTransaction(pool, client =>
    claimOutbox(client, { сколько }));

  let delivered = 0, отложено = 0, пропущено = 0, безнадёжно = 0;

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
      // НА НЕПОДТВЕРЖДЁННЫЙ АДРЕС НЕ ПИШЕМ — кроме самого письма
      // подтверждения, иначе адрес не подтвердить никогда.
      //
      // При открытой регистрации выдуманных адресов будет много, и письма на
      // них возвращаются отказом. Доля отказов — то, по чему почтовые службы
      // судят об отправителе: превысил — и в спам пойдут ВСЕ письма с
      // домена, включая подтверждения, без которых регистрация не работает.
      // Строку закрываем: ждать тут нечего, подтверждение придёт отдельным
      // уведомлением, а не этим.
      if (!notification.почтаПодтверждена && notification.type !== N.EMAIL_VERIFY) {
        await withTransaction(pool, client => markDelivered(client, record.id));
        пропущено++;
        continue;
      }

      const letter = renderEmail(notification.type, notification.data);
      const headers = mailHeaders({ type: notification.type,
        userId: notification.userId, baseUrl: LINK_ROOT() });
      await отправитель.send({ to: notification.email, ...letter, headers });
      await withTransaction(pool, client => markDelivered(client, record.id));
      delivered++;
    } catch (e) {
      // ДВА РОДА ОТКАЗА. Постоянный (несуществующий ящик, негодный конверт)
      // и исчерпание попыток закрывают строку: иначе она возвращалась бы
      // раз в час вечно и отравляла бы счёт неотправленных, по которому
      // только и видно отставшего работника. Ошибка при этом ОСТАЁТСЯ в
      // last_error — строка закрыта, но не забыта.
      const exhausted = record.attempts + 1 >= MAX_ATTEMPTS;
      if (isPermanentFailure(e) || exhausted) {
        await withTransaction(pool, client => markDead(client,
          { id: record.id, ошибка: e.message }));
        безнадёжно++;
      } else {
        await withTransaction(pool, client => markFailed(client,
          { id: record.id, attempts: record.attempts, ошибка: e.message }));
        отложено++;
      }
    }
  }
  return { взято: batch.length, доставлено: delivered, отложено, пропущено, безнадёжно };
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
      await отправитель.send({ to: person.email, ...renderDigest(events),
        headers: mailHeaders({ type: N.GRAPH_CHANGED, userId: person.id,
          baseUrl: LINK_ROOT() }) });
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
