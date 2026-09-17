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
export async function deliverOnce(pool, { отправитель: sender = nullSender,
                                          сколько: limit = 50 } = {}) {
  const batch = await withTransaction(pool, client =>
    claimOutbox(client, { сколько: limit }));

  let delivered = 0, deferred = 0, skipped = 0, dead = 0;

  for (const record of batch) {
    try {
      if (record.channel === 'broadcast') {
        // Широковещательное письмо в одиночку не шлётся: его место в
        // сводке. Строку закрываем — иначе она будет вечно возвращаться.
        await withTransaction(pool, client => publish(client,
          { вид: 'вещание', broadcastId: record.payload.broadcastId,
            type: record.payload.type })).catch(() => {});
        await withTransaction(pool, client => markDelivered(client, record.id));
        skipped++;
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
        skipped++;
        continue;
      }
      if (!notification.почтойХочет) {
        await withTransaction(pool, client => markDelivered(client, record.id));
        skipped++;
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
        skipped++;
        continue;
      }

      const letter = renderEmail(notification.type, notification.data);
      const headers = mailHeaders({ type: notification.type,
        userId: notification.userId, baseUrl: LINK_ROOT() });
      await sender.send({ to: notification.email, ...letter, headers });
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
        dead++;
      } else {
        await withTransaction(pool, client => markFailed(client,
          { id: record.id, attempts: record.attempts, ошибка: e.message }));
        deferred++;
      }
    }
  }
  return { взято: batch.length, доставлено: delivered, отложено: deferred, пропущено: skipped, безнадёжно: dead };
}

/**
 * Сводка по широковещательным: одно письмо в час на человека вместо письма
 * на каждое событие. Курсор broadcast_seen_id не трогаем — он про
 * прочитанность в приложении, а не про почту; для почты своя отметка.
 */
export async function sendDigests(pool, { отправитель: sender = nullSender,
                                          часов: hours = 1, категория: category = 'graphChanges' } = {}) {
  const recipients = await digestRecipients(pool, { категория: category, часов: hours });
  let sent = 0, empty = 0, deferred = 0;

  for (const person of recipients) {
    const events = await broadcastsSince(pool,
      { послеId: person.курсор, категория: category });
    if (!events.length) { empty++; continue; }
    try {
      await sender.send({ to: person.email, ...renderDigest(events),
        headers: mailHeaders({ type: N.GRAPH_CHANGED, userId: person.id,
          baseUrl: LINK_ROOT() }) });
      await withTransaction(pool, client => stampDigest(client, person.id));
      sent++;
    } catch {
      // Отметку НЕ ставим: не отправленная сводка должна уйти в следующий раз.
      deferred++;
    }
  }
  return { кандидатов: recipients.length, отправлено: sent, пусто: empty, отложено: deferred };
}

/** Суточная уборка. Просроченное не хранится: индекс на expires_at для того и есть. */
export const sweep = pool => withTransaction(pool, client => sweepExpired(client));

/** Проверка полноты образцов: тип без образца — ошибка, а не пропажа. */
export function typesWithoutTemplate() {
  return Object.keys(CATALOG).filter(type => {
    try { renderEmail(type, {}); return false; } catch { return true; }
  });
}
