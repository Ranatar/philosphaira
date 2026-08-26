// ПИСЬМА.
//
// В первой редакции данные подставлялись в HTML КАК ЕСТЬ — в разделе,
// обещающем защиту от XSS. React в панели экранирует сам, письма — нет:
// сообщение коммита с угловыми скобками уезжало в почтовый ящик разметкой.
//
// Здесь экранируется КАЖДАЯ подстановка, и у письма есть текстовая часть:
// почтовые клиенты, режущие HTML, иначе покажут пустое сообщение.
//
// Образец обязателен: тип без образца — ошибка, а не молчаливая пропажа.

import { N, CATEGORIES } from './catalog.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g,
  з => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[з]));

const paragraph = (что, audience) => `<p><strong>${esc(что)}:</strong> ${esc(audience)}</p>`;

export const TEMPLATES = Object.freeze({
  [N.EMAIL_VERIFY]: d => ({
    subject: 'Подтвердите адрес',
    text: `Ссылка: ${d.ссылка}\nЕсли вы не регистрировались — письмо можно`
        + ' не читать: без перехода по ссылке ничего не произойдёт.',
    html: '<h2>Подтвердите адрес</h2>'
        + `<p><a href="${esc(d.ссылка)}">${esc(d.ссылка)}</a></p>`
        + '<p>Если вы не регистрировались — письмо можно не читать:'
        + ' без перехода по ссылке ничего не произойдёт.</p>',
  }),
  [N.COMMIT_APPROVED]: d => ({
    subject: 'Ваше изменение одобрено',
    text: `Коммит: ${d.commitId}\nРассмотрел: ${d.reviewerName ?? '—'}`,
    html: `<h2>Ваше изменение одобрено</h2>`
        + paragraph('Коммит', d.commitId) + paragraph('Рассмотрел', d.reviewerName ?? '—'),
  }),
  [N.COMMIT_REJECTED]: d => ({
    subject: 'Ваше изменение отклонено',
    text: `Коммит: ${d.commitId}\nРассмотрел: ${d.reviewerName ?? '—'}\n`
        + `Комментарий: ${d.comment ?? ''}`,
    html: `<h2>Ваше изменение отклонено</h2>`
        + paragraph('Коммит', d.commitId) + paragraph('Рассмотрел', d.reviewerName ?? '—')
        + paragraph('Комментарий', d.comment ?? ''),
  }),
  [N.COMMIT_CONFLICTED]: d => ({
    subject: 'Ваше изменение столкнулось с чужим',
    text: `Коммит: ${d.commitId}\nРазошлось полей: ${(d.столкновения ?? []).length}`,
    html: `<h2>Ваше изменение столкнулось с чужим</h2>`
        + paragraph('Коммит', d.commitId)
        + paragraph('Разошлось полей', (d.столкновения ?? []).length),
  }),
  [N.COMMIT_COINCIDED]: d => ({
    subject: 'То же самое уже внесли',
    text: `Коммит: ${d.commitId}\nВаша правка совпала с уже применённой.`,
    html: `<h2>То же самое уже внесли</h2>` + paragraph('Коммит', d.commitId)
        + `<p>Ваша правка совпала с уже применённой — работа не пропала, ` +
          `но записывать было нечего.</p>`,
  }),
  [N.NEW_COMMIT_PENDING]: d => ({
    subject: 'Новое изменение на рассмотрении',
    text: `Автор: ${d.authorName ?? '—'}\nСообщение: ${d.message ?? ''}`,
    html: `<h2>Новое изменение на рассмотрении</h2>`
        + paragraph('Автор', d.authorName ?? '—') + paragraph('Сообщение', d.message ?? ''),
  }),
  [N.ROLE_CHANGED]: d => ({
    subject: 'Ваша роль изменена',
    text: `Было: ${d.oldRole}\nСтало: ${d.newRole}\nПричина: ${d.reason ?? ''}`,
    html: `<h2>Ваша роль изменена</h2>` + paragraph('Было', d.oldRole)
        + paragraph('Стало', d.newRole) + paragraph('Причина', d.reason ?? ''),
  }),
  [N.USER_PROMOTED]: d => ({
    subject: 'Повышение в правах',
    text: `${d.username}: ${d.oldRole} → ${d.newRole}`,
    html: `<h2>Повышение в правах</h2>`
        + paragraph('Кто', d.username) + paragraph('Стало', d.newRole),
  }),
  [N.USER_DEMOTED]: d => ({
    subject: 'Понижение в правах',
    text: `${d.username}: ${d.oldRole} → ${d.newRole}`,
    html: `<h2>Понижение в правах</h2>`
        + paragraph('Кто', d.username) + paragraph('Стало', d.newRole),
  }),
  [N.USER_BANNED]: d => ({
    subject: 'Учётная запись заблокирована',
    text: `${d.username}\nПричина: ${d.reason ?? ''}`,
    html: `<h2>Учётная запись заблокирована</h2>`
        + paragraph('Кто', d.username) + paragraph('Причина', d.reason ?? ''),
  }),
  [N.USER_UNBANNED]: d => ({
    subject: 'Блокировка снята',
    text: `${d.username}`,
    html: `<h2>Блокировка снята</h2>` + paragraph('Кто', d.username),
  }),
  // Широковещательное письмо в одиночку не шлётся: только сводкой.
  [N.GRAPH_CHANGED]: d => ({
    subject: 'Граф изменён',
    text: `Версия: ${d.версия}`,
    html: `<h2>Граф изменён</h2>` + paragraph('Версия', d.версия),
  }),
});

export function renderEmail(type, data) {
  const assemble = TEMPLATES[type];
  if (!assemble) throw new Error(`письма: нет образца для типа «${type}»`);
  return assemble(data ?? {});
}

/** Сводка: одно письмо вместо десятка одинаковых. */
export function renderDigest(events) {
  const rows = events.map(с =>
    `${new Date(с.createdAt).toISOString().slice(0, 16).replace('T', ' ')} — ` +
    `версия ${с.data?.версия ?? '—'}`);
  return {
    subject: `Граф изменён: ${events.length} ${events.length === 1 ? 'раз' : 'раза(з)'}`,
    text: 'Изменения графа:\n' + rows.join('\n'),
    html: '<h2>Изменения графа</h2><ul>'
        + rows.map(с => `<li>${esc(с)}</li>`).join('') + '</ul>',
  };
}

export const NOTIFY_CATEGORIES = CATEGORIES;
