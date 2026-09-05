// ОТПРАВИТЕЛЬ ПИСЕМ.
//
// До сих пор его не было вовсе: работник брал `nullSender`, и тот на каждой
// отправке отказывался вслух. Для закрытого круга это годилось — адреса
// подтверждал оператор. ОТКРЫТАЯ РЕГИСТРАЦИЯ БЕЗ ПИСЕМ НЕВОЗМОЖНА:
// подтверждение адреса идёт письмом, а без подтверждённого адреса права
// срезаны (`NEEDS_VERIFIED_EMAIL`, `access/roles.js`).
//
// ЗДЕСЬ ТОЛЬКО ТРАНСПОРТ. Что писать — в `email.js`, кому — в
// `recipients.js`, когда — в `worker.js`. Модуль ничего не знает ни о
// уведомлениях, ни о базе, и потому проверяется без них.
//
// ГЛАВНОЕ РЕШЕНИЕ ФАЙЛА — ДВА РОДА ОТКАЗА.
// Прежде всякий отказ откладывал письмо с растущей задержкой, но потолком в
// час и БЕЗ ПРЕДЕЛА ПОПЫТОК. Пока адреса заводил оператор, это было
// безобидно. При открытой регистрации несуществующий адрес (опечатка, бот,
// одноразовый ящик) даёт отказ 550 — и такая строка возвращалась бы в
// исходящие вечно, раз в час, навсегда. Хуже, чем сама по себе бесполезная
// работа: счёт неотправленных исходящих — ЕДИНСТВЕННЫЙ признак отставшего
// работника (`server/README.md` §7), и мёртвые письма отравили бы его.
//
// Поэтому отказ различается:
//   постоянный  (5xx, негодный конверт) — письмо закрывается, ошибка хранится;
//   временный   (4xx, сеть, срок)       — как прежде, отложить и повторить.
// Разделение живёт ЗДЕСЬ, а не в работнике: это свойство почты, а не очереди.

import nodemailer from 'nodemailer';

/** Отправитель по умолчанию вынесен сюда же: он тоже способ отправки. */
export const nullSender = {
  async send() {
    throw new Error('отправитель писем не настроен: задайте SMTP_URL и MAIL_FROM');
  },
};

/**
 * Постоянный ли отказ.
 *
 * Спрашиваем У ОШИБКИ, а не пересказываем правило почтового сервера:
 * `responseCode` — это код, который тот и вернул. `EENVELOPE` nodemailer
 * ставит, когда конверт негоден сам по себе (некуда слать) — повтор
 * бессмыслен по устройству, а не по решению сервера.
 */
export function isPermanentFailure(error) {
  if (!error) return false;
  if (error.permanent === true) return true;
  if (error.code === 'EENVELOPE') return true;
  const code = error.responseCode;
  // 421 и 450–452 — временные, хотя и «отказ»: сервер занят или ящик заперт.
  return typeof code === 'number' && code >= 500 && code < 600;
}

/**
 * Убрать пароль из сообщения об ошибке.
 *
 * nodemailer охотно кладёт в текст ошибки строку подключения, а работник
 * пишет `last_error` В БАЗУ и в журнал. Один такой отказ — и пароль от
 * почтового ящика лежит в двух местах, откуда его никто не подумает убрать.
 */
export function scrub(text, secret) {
  let s = String(text ?? '');
  // Пароль вычищается В ОБОИХ ВИДАХ. `new URL(...).password` отдаёт его
  // ПРОЦЕНТНО-КОДИРОВАННЫМ, а nodemailer кладёт в текст ошибки исходную
  // строку подключения — то есть вид, в котором его написал человек. Пробa
  // это и показала: пароль «тайна» уходил в базу целым, потому что искали
  // «%D1%82%D0%B0%D0%B9%D0%BD%D0%B0».
  for (const variant of [].concat(secret ?? []))
    if (variant) s = s.split(variant).join('***');
  return s;
}

/** Пароль строки подключения во всех видах, в каких он может встретиться. */
export function secretsOf(url) {
  if (!url) return [];
  let raw = null;
  try { raw = new URL(url).password || null; } catch { return []; }
  if (!raw) return [];
  const variants = new Set([raw]);
  try { variants.add(decodeURIComponent(raw)); } catch { /* не кодировано */ }
  return [...variants];
}

/**
 * Отправитель поверх SMTP.
 *
 * `transport` берётся доводом, чтобы проба могла подсунуть свой и проверить
 * НАСТОЯЩИЙ путь письма, а не его пересказ.
 */
export function createSmtpSender({ url, from, transport = null } = {}) {
  if (!from) throw new Error('MAIL_FROM не задан: письму нужен обратный адрес');
  const secret = secretsOf(url);
  const post = transport ?? nodemailer.createTransport(url);

  return {
    async send({ to, subject, text, html, headers }) {
      if (!to) throw Object.assign(new Error('письмо без получателя'),
        { code: 'EENVELOPE' });
      if (!subject) throw new Error('письмо без темы');
      if (!text && !html) throw new Error('письмо без содержимого');
      try {
        return await post.sendMail({ from, to, subject, text, html, headers });
      } catch (e) {
        // Ошибка пересобирается, а не пробрасывается: иначе в базу уйдёт
        // сообщение nodemailer вместе со строкой подключения.
        const beda = new Error(scrub(e.message, secret));
        beda.code = e.code;
        beda.responseCode = e.responseCode;
        beda.permanent = isPermanentFailure(e);
        throw beda;
      }
    },
    async close() { if (post.close) post.close(); },
  };
}

/**
 * Какой отправитель следует из окружения.
 *
 * Возвращает и ОТКУДА он взялся: работник обязан сказать об этом вслух при
 * запуске. Молчаливая отправка «в никуда» хуже отказа — о ней узнают через
 * неделю, и не от того, кто разворачивал.
 */
export function senderFromEnv(env = process.env) {
  if (!env.SMTP_URL) return { sender: nullSender, source: 'none' };
  return {
    sender: createSmtpSender({ url: env.SMTP_URL, from: env.MAIL_FROM }),
    source: 'smtp',
  };
}
