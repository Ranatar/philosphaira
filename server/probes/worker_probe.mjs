#!/usr/bin/env node
// Проба ДОСТАВКИ. Требует живой базы.
//
// Главное здесь — что падение почты НЕ РОНЯЕТ уже совершённого и НЕ ТЕРЯЕТ
// уведомления: строка остаётся в исходящих и уходит следующим заходом.
//
//   DATABASE_URL=… node probes/worker_probe.mjs

import { createPool } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register } from '../src/auth/service.js';
import { findById } from '../src/db/users.js';
import { importSet } from '../src/db/graph.js';
import { createCommit } from '../src/commits/service.js';
import { reviewCommit, directCommit } from '../src/commits/review.js';
import { deliverOnce, sendDigests, sweep, typesWithoutTemplate } from '../src/notify/worker.js';
import { renderEmail, renderDigest, esc, TEMPLATES } from '../src/notify/email.js';
import { updatePreferences } from '../src/notify/read.js';
import { N, CATALOG } from '../src/notify/catalog.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();
const ПАРОЛЬ = 'вполне-длинный-пароль';

// Отправитель, которого можно ломать и допрашивать.
const собиратель = (падать = false) => {
  const письма = [];
  return {
    письма,
    async send(п) {
      if (падать) throw new Error('почтовый сервер лёг');
      письма.push(п);
    },
  };
};

async function завести(имя, роль) {
  const { user } = await register(pool, {
    username: имя, email: `${имя}@e.рф`, password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role = $1, email_verified_at = NOW(),
                                     mfa_enabled = TRUE WHERE user_id = $2`,
    [роль, user.userId]);
  return findById(pool, user.userId);
}
const вИсходящих = async () => (await pool.query(
  `SELECT count(*)::int AS n FROM outbox WHERE delivered_at IS NULL`)).rows[0].n;

try {
  // ── 1. образцы ──────────────────────────────────────────────────────────
  проверить('у каждого типа есть образец письма', typesWithoutTemplate().length === 0,
    0, typesWithoutTemplate().join(',') || 0);
  проверить('образцов не больше, чем типов',
    Object.keys(TEMPLATES).every(т => !!CATALOG[т]), 'все известны',
    Object.keys(TEMPLATES).filter(т => !CATALOG[т]).join(','));
  проверить('неизвестный тип ругается вслух',
    (await отказ(() => renderEmail('нет_такого', {}))).includes('нет образца'),
    'нет образца', 'иное');

  // ── 2. ЭКРАНИРОВАНИЕ ────────────────────────────────────────────────────
  const злое = '<script>alert(1)</script> & "кавычки"';
  const letter = renderEmail(N.NEW_COMMIT_PENDING, { authorName: злое, message: злое });
  проверить('угловые скобки в HTML экранированы',
    !letter.html.includes('<script>'), 'нет <script>', 'есть');
  проверить('амперсанд экранирован', letter.html.includes('&amp;'), '&amp;', 'нет');
  проверить('кавычки экранированы', letter.html.includes('&quot;'), '&quot;', 'нет');
  проверить('в письме ЕСТЬ текстовая часть',
    typeof letter.text === 'string' && letter.text.length > 0, 'есть', 'нет');
  проверить('в текстовой части подставлено как есть, без разметки',
    letter.text.includes(злое), 'как есть', 'иначе');
  проверить('у письма есть заголовок', !!letter.subject, 'есть', 'нет');
  проверить('esc не портит обычный текст', esc('Кант и Гегель') === 'Кант и Гегель',
    'Кант и Гегель', esc('Кант и Гегель'));

  // ── 3. доставка ─────────────────────────────────────────────────────────
  const редактор  = await завести('редактор', 'editor');
  const модератор = await завести('модератор', 'moderator');
  await завести('админ', 'administrator');
  await withTransaction(pool, client => importSet(client, 'traditions',
    [{ id: 'т1', name: 'Первая', description: 'старое' }]));

  const { коммит: к1 } = await createCommit(pool, { actor: редактор,
    message: 'правка с <угловыми> скобками',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { description: { base: 'старое', next: 'новое' } } }] });
  проверить('исходящие непусты после действия', (await вИсходящих()) > 0, '>0', 0);

  const почта = собиратель();
  const и1 = await deliverOnce(pool, { отправитель: почта });
  проверить('работник забрал порцию', и1.взято > 0, '>0', и1.взято);
  проверить('и что-то доставил', и1.доставлено > 0, '>0', и1.доставлено);
  проверить('после доставки исходящих не осталось', (await вИсходящих()) === 0, 0,
    await вИсходящих());
  // СМОТРИМ ПИСЬМА О КОММИТЕ, А НЕ ВСЮ ПОРЦИЮ. С тех пор как регистрация
  // кладёт письмо с подтверждением адреса, порция смешанная: своё письмо
  // автор получает законно, и утверждение «в порции нет писем автору»
  // стало ложным, ничего при этом не поймав.
  const оКоммите = почта.письма.filter(п => п.subject !== 'Подтвердите адрес');
  проверить('письмо О КОММИТЕ ушло сотрудникам, а не автору',
    оКоммите.length > 0 && оКоммите.every(п => п.to !== 'редактор@e.рф'),
    'не автору', оКоммите.map(п => п.to).join(',') || 'писем о коммите нет');
  проверить('УГЛОВЫЕ СКОБКИ В ПИСЬМЕ НЕ СТАЛИ РАЗМЕТКОЙ',
    почта.письма.some(п => п.html.includes('&lt;угловыми&gt;')), '&lt;угловыми&gt;',
    'нет');

  // ── 4. ПАДЕНИЕ ПОЧТЫ ────────────────────────────────────────────────────
  await reviewCommit(pool, { actor: модератор, commitId: к1.commitId, action: 'approve' });
  const былоИсходящих = await вИсходящих();
  проверить('одобрение положило в исходящие', былоИсходящих > 0, '>0', былоИсходящих);

  const битая = собиратель(true);
  const и2 = await deliverOnce(pool, { отправитель: битая });
  проверить('при падении почты ничего не доставлено', и2.доставлено === 0, 0, и2.доставлено);
  проверить('всё отложено, а не потеряно', и2.отложено > 0, '>0', и2.отложено);
  // Ждать, что уцелеет ВСЯ порция, неверно: широковещательные строки почты
  // не касаются и закрываются независимо от неё. Уцелеть обязано ровно то,
  // что отложено, — это и спрашиваем.
  проверить('УВЕДОМЛЕНИЕ ОСТАЛОСЬ В ИСХОДЯЩИХ (сколько отложено, столько и ждёт)',
    (await вИсходящих()) === и2.отложено, и2.отложено, await вИсходящих());
  проверить('широковещательные строки почты не касаются и закрылись',
    и2.пропущено > 0, '>0', и2.пропущено);
  проверить('и записана последняя ошибка',
    (await pool.query(`SELECT last_error FROM outbox WHERE delivered_at IS NULL
                        AND last_error IS NOT NULL LIMIT 1`)).rowCount === 1,
    'записана', 'нет');
  проверить('ДЕЙСТВИЕ ПРИ ЭТОМ УЦЕЛЕЛО (коммит применён)',
    (await pool.query(`SELECT status FROM commits WHERE commit_id=$1`,
      [к1.commitId])).rows[0].status === 'applied', 'applied', 'иное');

  // Задержка растёт: следующая попытка отодвинута в будущее.
  проверить('следующая попытка отодвинута',
    (await pool.query(`SELECT count(*)::int AS n FROM outbox
                        WHERE delivered_at IS NULL AND next_try_at > NOW()`)).rows[0].n > 0,
    '>0', 0);
  const и3 = await deliverOnce(pool, { отправитель: собиратель() });
  проверить('до срока работник её не берёт', и3.взято === 0, 0, и3.взято);

  // Срок наступил — уходит.
  await pool.query(`UPDATE outbox SET next_try_at = NOW() - INTERVAL '1 minute'
                     WHERE delivered_at IS NULL`);
  const целая = собиратель();
  const и4 = await deliverOnce(pool, { отправитель: целая });
  проверить('ПОСЛЕ ПОЧИНКИ ПОЧТЫ УВЕДОМЛЕНИЕ УХОДИТ', и4.доставлено > 0, '>0', и4.доставлено);
  проверить('и исходящие опустели', (await вИсходящих()) === 0, 0, await вИсходящих());

  // ── 5. отключённая почта ────────────────────────────────────────────────
  await updatePreferences(pool, редактор, { emailEnabled: false });
  await directCommit(pool, { actor: модератор, message: 'ещё правка',
    changes: [{ action: 'edit', kind: 'tradition', entityId: 'т1',
      fields: { name: { base: 'Первая', next: 'Вторая' } } }] });
  const { коммит: к2 } = await createCommit(pool, { actor: редактор,
    message: 'и моя', changes: [{ action: 'edit', kind: 'tradition',
      entityId: 'т1', fields: { description: { base: 'новое', next: 'третье' } } }] });
  await reviewCommit(pool, { actor: модератор, commitId: к2.commitId, action: 'approve' });
  const тихая = собиратель();
  await deliverOnce(pool, { отправитель: тихая });
  проверить('отключившему почту письма не идут',
    тихая.письма.every(п => п.to !== 'редактор@e.рф'), 'не идут',
    тихая.письма.map(п => п.to).join(','));
  проверить('но строка исходящих закрыта, а не висит вечно',
    (await вИсходящих()) === 0, 0, await вИсходящих());
  await updatePreferences(pool, редактор, { emailEnabled: true });

  // ── 6. СВОДКА ───────────────────────────────────────────────────────────
  const сводочная = собиратель();
  const с1 = await sendDigests(pool, { отправитель: сводочная, часов: 0 });
  проверить('сводка ушла', с1.отправлено > 0, '>0', с1.отправлено);
  проверить('ОДНО письмо на человека, а не письмо на событие',
    сводочная.письма.length === с1.отправлено, с1.отправлено, сводочная.письма.length);
  проверить('в сводке перечислены события',
    сводочная.письма[0].text.includes('Изменения графа'), 'Изменения графа', 'иное');

  const повтор = собиратель();
  const с2 = await sendDigests(pool, { отправитель: повтор, часов: 1 });
  проверить('ЧАЩЕ РАЗА В ЧАС СВОДКА НЕ ШЛЁТСЯ', с2.отправлено === 0, 0, с2.отправлено);

  const битаяСводка = собиратель(true);
  await pool.query(`UPDATE notification_preferences SET last_digest_at = NULL`);
  const с3 = await sendDigests(pool, { отправитель: битаяСводка, часов: 0 });
  проверить('при падении сводка откладывается', с3.отложено > 0, '>0', с3.отложено);
  // ЧАСОВ: 1, а не 0. С нулём условие «прошёл ли час» истинно и для того,
  // кому отметку только что поставили, — и подлог «ставить отметку даже при
  // падении» проходил незамеченным. Час отсекает отмеченных, и утверждение
  // начинает мерить именно отметку.
  const с4 = await sendDigests(pool, { отправитель: собиратель(), часов: 1 });
  проверить('НЕОТПРАВЛЕННАЯ СВОДКА УХОДИТ СЛЕДУЮЩИМ ЗАХОДОМ (отметка не ставилась)',
    с4.отправлено > 0, '>0', с4.отправлено);

  проверить('сводка сама по себе экранирует',
    renderDigest([{ createdAt: new Date(), data: { версия: '<b>1</b>' } }])
      .html.includes('&lt;b&gt;'), '&lt;b&gt;', 'нет');

  // ── 7. уборка ───────────────────────────────────────────────────────────
  await pool.query(`UPDATE notifications SET expires_at = NOW() - INTERVAL '1 day'`);
  await pool.query(`UPDATE broadcasts    SET expires_at = NOW() - INTERVAL '1 day'`);
  const убрано = await sweep(pool);
  проверить('уборка убрала просроченные уведомления', убрано.уведомлений > 0, '>0',
    убрано.уведомлений);
  проверить('и просроченные вещания', убрано.вещаний > 0, '>0', убрано.вещаний);
  проверить('после уборки их не осталось',
    (await pool.query(`SELECT count(*)::int AS n FROM notifications`)).rows[0].n === 0,
    0, (await pool.query(`SELECT count(*)::int AS n FROM notifications`)).rows[0].n);

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
