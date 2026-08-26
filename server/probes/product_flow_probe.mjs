#!/usr/bin/env node
// Проба ПРОДУКТОВОГО ЦИКЛА (A-2 плана doc/plan-next.md).
//
// ХОДИТ ТОЛЬКО ЧЕРЕЗ HTTP — тем же контрактом, что и человек за браузером.
// В этом весь смысл: службы в src/ проверены своими пробами и зелены, но
// служба, не выведенная наружу, продуктом не является. Отсутствующий ход
// здесь фиксируется КРАСНЫМ как отсутствующая возможность, а не обходится
// прямым вызовом.
//
//   DATABASE_URL=… MFA_SECRET_KEY=… node probes/product_flow_probe.mjs
//
// ЧТО СЧИТАЕТСЯ ПОДГОТОВКОЙ, А ЧТО ПРОВЕРКОЙ. Подготовка — то, что в жизни
// делает оператор с доступом к базе: первый администратор, роль. Она идёт
// службами и помечена словом ПОДГОТОВКА. Всё, что делает пользователь,
// идёт через HTTP. Смешивать эти два канала молча — способ получить
// зелёную пробу при неработающем продукте.

import http from 'node:http';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from '../src/db/pool.js';
import { createApp } from '../src/http/app.js';
import { withTransaction } from '../src/db/tx.js';
import { importSet } from '../src/db/graph.js';
import { SET_NAMES } from '../src/graph/schema.js';
import fs from 'node:fs';
import { findById, updateRole, setEmailVerified } from '../src/db/users.js';
import { beginEnroll, confirmEnroll } from '../src/auth/mfa.js';
import { totpCode as totpКод } from '../src/auth/totp.js';
import { deliverOnce } from '../src/notify/worker.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ПРИЛОЖЕНИЕ = path.join(КОРЕНЬ, '..', 'app');
const ПОРТ = Number(process.env.PROBE_PORT || 8817);
const БАЗА = `http://127.0.0.1:${ПОРТ}`;
const ПАРОЛЬ = 'вполне-длинный-пароль';

const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
/** Отдельный род записи: возможности НЕТ наружу. Красное, но не поломка. */
const нетХода = (имя, вышло) =>
  проверки.push({ имя, годно: false, ждали: 'ход есть', вышло, дыра: true });

while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = createPool();
await withTransaction(pool, async client => {
  for (const имя of SET_NAMES) {
    const путь = path.join(ПРИЛОЖЕНИЕ, 'data', имя + '.json');
    if (fs.existsSync(путь)) {
      await importSet(client, имя, JSON.parse(fs.readFileSync(путь, 'utf8')));
    }
  }
});

const app = createApp({ pool, безопасныеCookie: false,
  строкаПодключения: process.env.DATABASE_URL });
const httpServer = http.createServer(app);
await new Promise(г => httpServer.listen(ПОРТ, г));

const прокрутитьРаботника = async pool => { await deliverOnce(pool); };
const типПусто = з => з === null || з === undefined || String(з).trim() === '';
const чисто = з => String(з ?? '').replace(/[\r\n]+/g, '').trim();

/** Клиент, помнящий cookie и признак CSRF, — как браузер. */
function браузер(имя) {
  const печенья = new Map();
  return {
    имя, печенья,
    async зов(путь, { method = 'GET', body } = {}) {
      const заголовки = {};
      if (body) заголовки['Content-Type'] = 'application/json';
      if (печенья.size) заголовки.cookie =
        [...печенья].map(([к, з]) => `${чисто(к)}=${чисто(з)}`).join('; ');
      if (method !== 'GET' && печенья.has('csrf')) {
        заголовки['X-CSRF-Token'] = печенья.get('csrf');
      }
      const observation = await fetch(БАЗА + путь, { method, headers: заголовки,
        body: body ? JSON.stringify(body) : undefined });
      for (const since of observation.headers.getSetCookie?.() ?? []) {
        const [пара] = since.split(';');
        const i = пара.indexOf('=');
        печенья.set(пара.slice(0, i).trim(), пара.slice(i + 1).trim());
      }
      return { код: observation.status, тело: await observation.json().catch(() => null) };
    },
  };
}

try {
  // ── 1. гость ────────────────────────────────────────────────────────────
  const гость = браузер('гость');
  const audience = await гость.зов('/api/users/me');
  проверить('гостю отвечают, и отвечают что он гость',
    audience.код === 200 && audience.тело?.data?.гость === true, '200 + гость',
    `${audience.код} ${JSON.stringify(audience.тело?.data?.гость)}`);
  const графГостю = await гость.зов('/api/graph');
  проверить('гость читает граф',
    графГостю.код === 200 && (графГостю.тело?.data?.наборы?.concepts?.length ?? 0) > 400,
    '>400 концепций', графГостю.тело?.data?.наборы?.concepts?.length);

  // ── 2. регистрация автора ───────────────────────────────────────────────
  const автор = браузер('автор');
  const рег = await автор.зов('/api/auth/register', { method: 'POST',
    body: { username: 'автор_проба', email: 'author@example.invalid',
            password: ПАРОЛЬ } });
  проверить('регистрация проходит', рег.код === 201, 201, рег.код);
  проверить('сессия и признак CSRF пришли cookie',
    автор.печенья.has('session') && автор.печенья.has('csrf'), 'обе',
    [...автор.печенья.keys()].join(','));

  // ── 3. ПОДТВЕРЖДЕНИЕ ПОЧТЫ: хода наружу НЕТ ────────────────────────────
  // Токен рождается в register (issueVerification), возвращается службой —
  // и НИКУДА не идёт: HTTP отдаёт только userToApi, письма нет, в
  // исходящие ничего не кладётся, в базе лежит только sha256. Значит
  // обычный человек подтвердить адрес НЕ МОЖЕТ, а без подтверждения нет
  // права CREATE_COMMIT. Ход /api/auth/verify-email есть, но токена для
  // него взять неоткуда.
  проверить('ответ регистрации НЕ содержит токена (и правильно)',
    !JSON.stringify(рег.тело ?? {}).includes('token'), 'нет токена',
    'есть токен в ответе');
  const данныеАвтора = рег.тело.data;

  // ПИСЬМО — ЭТО ПОЧТОВЫЙ ЯЩИК, А НЕ ОБХОД API. Ссылку человек достаёт из
  // письма; здесь его роль играет чтение уведомления, которое register
  // положил в исходящие. Всё, что делается ПОСЛЕ перехода по ссылке, снова
  // идёт через HTTP.
  const { rows: письма } = await pool.query(
    `SELECT data FROM notifications WHERE type = 'email_verify'
       AND user_id = $1`, [данныеАвтора.userId]);
  проверить('ПИСЬМО С ПОДТВЕРЖДЕНИЕМ ПОЛОЖЕНО', письма.length === 1, 1, письма.length);
  const ссылка = письма[0]?.data?.ссылка ?? '';
  проверить('в письме есть ссылка с токеном', /#подтвердить=.{20,}/.test(ссылка),
    'ссылка с токеном', ссылка.slice(0, 50));

  const токенПодтверждения = ссылка.split('=').pop();
  const подтв = await автор.зов('/api/auth/verify-email', { method: 'POST',
    body: { token: токенПодтверждения } });
  проверить('ПОЧТА ПОДТВЕРЖДАЕТСЯ ССЫЛКОЙ ИЗ ПИСЬМА', подтв.код === 200, 200,
    `${подтв.код} ${JSON.stringify(подтв.тело?.error ?? '').slice(0, 50)}`);
  const повторно = await автор.зов('/api/auth/verify-email', { method: 'POST',
    body: { token: токенПодтверждения } });
  проверить('ссылка одноразовая', повторно.код >= 400, '4xx', повторно.код);

  // ПОДГОТОВКА (оператор): роль. Повышение — дело администратора, и его
  // ход проверяется отдельно; здесь важно лишь состояние.
  await withTransaction(pool, client =>
    updateRole(client, { userId: данныеАвтора.userId, newRole: 'editor',
                         actorId: данныеАвтора.userId }));

  const меня = await автор.зов('/api/users/me');
  проверить('роль editor видна в «кто я»', меня.тело?.data?.role === 'editor',
    'editor', меня.тело?.data?.role);
  проверить('право на коммит появилось после подтверждения',
    меня.тело?.data?.permissions?.includes('create_commit'), 'create_commit',
    (меня.тело?.data?.permissions || []).join(',').slice(0, 60));

  // ── 4. ЗАВЕДЕНИЕ ВТОРОГО ШАГА: хода наружу НЕТ ─────────────────────────
  const enroll = await автор.зов('/api/auth/mfa/enroll', { method: 'POST' });
  проверить('второй шаг заводится через HTTP', enroll.код === 200, 200,
    `${enroll.код} ${JSON.stringify(enroll.тело?.error ?? '').slice(0, 50)}`);
  проверить('выдан секрет и ссылка otpauth',
    !!enroll.тело?.data?.секрет && /^otpauth:/.test(enroll.тело?.data?.ссылка || ''),
    'секрет + otpauth', JSON.stringify(enroll.тело?.data ?? {}).slice(0, 60));
  проверить('шаг ЕЩЁ НЕ включён до предъявления кода',
    enroll.тело?.data?.включён === false, false, enroll.тело?.data?.включён);

  const мимоКода = await автор.зов('/api/auth/mfa/enroll/confirm',
    { method: 'POST', body: { code: '000000' } });
  проверить('неверный код не включает второй шаг', мимоКода.код >= 400,
    '4xx', мимоКода.код);

  const секретАвтора = enroll.тело.data.секрет;
  const verifyToken = await автор.зов('/api/auth/mfa/enroll/confirm',
    { method: 'POST', body: { code: totpКод(секретАвтора) } });
  проверить('верный код включает второй шаг', verifyToken.код === 200, 200,
    `${verifyToken.код} ${JSON.stringify(verifyToken.тело?.error ?? '')}`);
  проверить('коды восстановления выданы один раз',
    Array.isArray(verifyToken.тело?.data?.коды)
      && verifyToken.тело.data.коды.length >= 5,
    '≥5 кодов', (verifyToken.тело?.data?.коды || []).length);

  // ЧУЖОЙ ЗАПИСИ ШАГ НЕ ЗАВЕСТИ: имя берётся из сессии, а не из тела.
  const чужой = await автор.зов('/api/auth/mfa/enroll', { method: 'POST',
    body: { userId: '00000000-0000-0000-0000-000000000000' } });
  проверить('userId из тела не слушают', чужой.код === 409 || чужой.код === 200,
    'свой же шаг', чужой.код);

  // ── 5. коммит с обоснованием ───────────────────────────────────────────
  const commit = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: правка описания',
            authorComment: 'обоснование автора для рецензента',
            changes: [{ action: 'edit', kind: 'concept',
                        entityId: 'harmony_spheres',
                        fields: { description: {
                          base: 'Небесные тела звучат по числовым отношениям',
                          next: 'Правка из продуктовой пробы' } } }] } });
  // 202 «принято»: коммит ушёл НА РАССМОТРЕНИЕ, а не применён — код честнее
  // 201, и первая редакция утверждения ждала не того.
  проверить('коммит принят на рассмотрение', commit.код === 202,
    202, `${commit.код} ${JSON.stringify(commit.тело?.error ?? '').slice(0, 60)}`);
  const commitId = commit.тело?.data?.commitId ?? commit.тело?.data?.коммит?.commitId;
  проверить('коммит вернул свой адрес', !!commitId, 'commitId',
    JSON.stringify(commit.тело?.data ?? {}).slice(0, 80));

  const ownIds = await автор.зов('/api/commits');
  проверить('автор видит свой коммит в списке',
    JSON.stringify(ownIds.тело ?? {}).includes('проба: правка описания'),
    'виден', `${ownIds.код} ${JSON.stringify(ownIds.тело).slice(0, 90)}`);
  // ВИД ОТВЕТА ОБЯЗАН БЫТЬ ОДИН. http_probe утверждает «успех всегда в поле
  // data» — и это правда для всех ходов, кроме списков: `res.json(await
  // listMine(...))` отдаёт результат разбиения на страницы КАК ЕСТЬ, то
  // есть {items, page, …} без обёртки. Клиенту приходится знать про два
  // вида ответа вместо одного.
  проверить('список коммитов отвечает в том же виде, что и остальные ходы',
    'data' in (ownIds.тело ?? {}), 'data', Object.keys(ownIds.тело ?? {}).join(','));
  const один = await автор.зов(`/api/commits/${commitId}`);
  проверить('ОБОСНОВАНИЕ АВТОРА пережило запись и читается',
    JSON.stringify(один.тело?.data ?? {}).includes('обоснование автора'),
    'authorComment на месте', JSON.stringify(один.тело?.data ?? {}).slice(0, 80));

  // ── 6. правка собственного коммита: хода наружу НЕТ ────────────────────
  const правка = await автор.зов(`/api/commits/${commitId}`, { method: 'PATCH',
    body: { authorComment: 'обоснование автора, уточнённое' } });
  проверить('свой ожидающий коммит правится', правка.код === 200, 200,
    `${правка.код} ${JSON.stringify(правка.тело?.error ?? '').slice(0, 50)}`);
  проверить('уточнённое обоснование сохранилось',
    /уточнённое/.test(JSON.stringify(
      (await автор.зов(`/api/commits/${commitId}`)).тело ?? {})),
    'уточнено', 'не уточнено');

  // Чужой коммит правке не поддаётся, и ответ не выдаёт его существования.
  const посторонний = браузер('посторонний');
  const регП = await посторонний.зов('/api/auth/register', { method: 'POST',
    body: { username: 'посторонний_проба', email: 'other@example.invalid',
            password: ПАРОЛЬ } });
  await withTransaction(pool, async client => {
    await setEmailVerified(client, регП.тело.data.userId);
    await updateRole(client, { userId: регП.тело.data.userId, newRole: 'editor',
                               actorId: регП.тело.data.userId });
  });
  const чужаяПравка = await посторонний.зов(`/api/commits/${commitId}`,
    { method: 'PATCH', body: { message: 'подмена' } });
  проверить('ЧУЖОЙ коммит не правится', чужаяПравка.код >= 400, '4xx',
    чужаяПравка.код);

  // ── 7. рецензент ───────────────────────────────────────────────────────
  // ПОДГОТОВКА: рецензент — администратор с подтверждённой почтой и
  // заведённым вторым шагом (REVIEW_COMMIT требует и того и другого).
  // Второй шаг заводится службой ИМЕННО ПОТОМУ, что хода наружу нет, —
  // см. пункт 4. Это не обход, а следствие уже записанной дыры.
  const рец = браузер('рецензент');
  const регР = await рец.зов('/api/auth/register', { method: 'POST',
    body: { username: 'рецензент_проба', email: 'rev@example.invalid',
            password: ПАРОЛЬ } });
  const идР = регР.тело.data.userId;
  await withTransaction(pool, async client => {
    await setEmailVerified(client, идР);
    await updateRole(client, { userId: идР, newRole: 'administrator', actorId: идР });
  });
  {
    const он = await findById(pool, идР);
    const { секрет: secret } = await beginEnroll(pool, он);
    await confirmEnroll(pool, он, totpКод(secret));
  }
  // Права пересчитываются на каждом запросе — перезаходить не нужно.
  const ктоР = await рец.зов('/api/users/me');
  проверить('у рецензента есть право рассматривать',
    ктоР.тело?.data?.permissions?.includes('review_commit'), 'review_commit',
    (ктоР.тело?.data?.permissions || []).join(',').slice(0, 60));

  const очередь = await рец.зов('/api/commits/pending');
  проверить('коммит виден в очереди рассмотрения',
    JSON.stringify(очередь.тело ?? {}).includes('проба: правка описания'),
    'виден', `${очередь.код} ${JSON.stringify(очередь.тело).slice(0, 90)}`);
  проверить('рецензент видит ОБОСНОВАНИЕ автора',
    JSON.stringify(очередь.тело ?? {}).includes('обоснование автора')
    || JSON.stringify((await рец.зов(`/api/commits/${commitId}`)).тело ?? {})
         .includes('обоснование автора'),
    'видит', 'не видит');

  // ── 8. отказ обязан нести причину ──────────────────────────────────────
  const безПричины = await рец.зов(`/api/commits/${commitId}/review`,
    { method: 'POST', body: { action: 'reject' } });
  проверить('ОТКАЗ БЕЗ ПРИЧИНЫ НЕ ПРОХОДИТ', безПричины.код >= 400,
    '4xx', безПричины.код);

  const отказ = await рец.зов(`/api/commits/${commitId}/review`,
    { method: 'POST', body: { action: 'reject',
                              comment: 'причина отказа для автора' } });
  проверить('отказ с причиной проходит', отказ.код === 200, 200,
    `${отказ.код} ${JSON.stringify(отказ.тело?.error ?? '').slice(0, 50)}`);

  const послеОтказа = await автор.зов(`/api/commits/${commitId}`);
  проверить('АВТОР ВИДИТ ПРИЧИНУ ОТКАЗА',
    JSON.stringify(послеОтказа.тело?.data ?? {}).includes('причина отказа'),
    'причина видна', JSON.stringify(послеОтказа.тело?.data ?? {}).slice(0, 90));

  // ── 9. уведомление автору ──────────────────────────────────────────────
  await deliverOnce(pool);
  const counters = await автор.зов('/api/notifications/unread-count');
  проверить('автору пришло уведомление об отказе',
    (counters.тело?.data?.сколько ?? counters.тело?.data?.count ?? 0) > 0, '>0',
    JSON.stringify(counters.тело?.data));

  // ── 10. исправленный коммит и одобрение ────────────────────────────────
  const второй = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: исправленная правка',
            authorComment: 'учёл замечание',
            changes: [{ action: 'edit', kind: 'concept',
                        entityId: 'harmony_spheres',
                        fields: { description: {
                          base: 'Небесные тела звучат по числовым отношениям',
                          next: 'Правка из продуктовой пробы, редакция вторая' } } }] } });
  const id2 = второй.тело?.data?.commitId ?? второй.тело?.data?.коммит?.commitId;
  const одобр = await рец.зов(`/api/commits/${id2}/review`,
    { method: 'POST', body: { action: 'approve' } });
  проверить('одобрение проходит без обязательного комментария',
    одобр.код === 200, 200, `${одобр.код} ${JSON.stringify(одобр.тело?.error ?? '')}`);

  const граф = await гость.зов('/api/graph');
  const описание = граф.тело?.data?.наборы?.concepts
    ?.find(к => к.id === 'harmony_spheres')?.description;
  проверить('ПРИНЯТАЯ ПРАВКА ВИДНА В ГРАФЕ', /редакция вторая/.test(описание || ''),
    'новое описание', String(описание).slice(0, 50));
  проверить('версия графа выросла', (граф.тело?.data?.версия ?? 0) > 0, '>0',
    граф.тело?.data?.версия);

  // ── 11. сам себя не рассматривает ──────────────────────────────────────
  const самСебе = await рец.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: свой коммит рецензента',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: null, next: 'своя правка' } } }] } });
  const idС = самСебе.тело?.data?.commitId ?? самСебе.тело?.data?.коммит?.commitId;
  if (idС) {
    const своё = await рец.зов(`/api/commits/${idС}/review`,
      { method: 'POST', body: { action: 'approve' } });
    проверить('СВОЙ коммит рассматривать нельзя', своё.код >= 400, '4xx', своё.код);
  }

  // ── 11а. МАТРИЦА КОММИТОВ И РАССМОТРЕНИЯ (C-1, спецификация §6) ────────
  //
  // Проверяется не «работает ли ход», а НЕИЗМЕННОСТЬ РАССМОТРЕННОГО и
  // раздельность двух комментариев. Обе вещи легко теряются: пока правка
  // своего коммита была только службой, никто не спрашивал, что она делает
  // с уже рассмотренным.
  const рассмотренный = await автор.зов(`/api/commits/${commitId}`,
    { method: 'PATCH', body: { message: 'переписать историю' } });
  проверить('РАССМОТРЕННЫЙ коммит НЕИЗМЕНЯЕМ', рассмотренный.код >= 400,
    '4xx', рассмотренный.код);
  const отзыв = await автор.зов(`/api/commits/${commitId}`, { method: 'DELETE' });
  проверить('рассмотренный коммит не отзывается', отзыв.код >= 400, '4xx', отзыв.код);

  const отклонённый = await автор.зов(`/api/commits/${commitId}`);
  const к = отклонённый.тело?.data ?? {};
  проверить('состояние отклонённого названо словом', к.status === 'rejected',
    'rejected', к.status);
  проверить('ДВА КОММЕНТАРИЯ ХРАНЯТСЯ РАЗДЕЛЬНО',
    typeof к.authorComment === 'string' && typeof к.reviewComment === 'string'
      && к.authorComment !== к.reviewComment,
    'разные поля', `${JSON.stringify(к.authorComment)} / ${JSON.stringify(к.reviewComment)}`);
  проверить('у рассмотренного записан рецензент и время',
    !!к.reviewedBy && !!к.reviewedAt, 'оба', `${к.reviewedBy} ${к.reviewedAt}`);
  проверить('сообщение и обоснование — РАЗНЫЕ поля',
    к.message !== к.authorComment, 'разные', к.message);

  // Одобренный коммит помечен применённым, а не просто «рассмотренным».
  const принятый = (await автор.зов(`/api/commits/${id2}`)).тело?.data ?? {};
  проверить('одобренный коммит помечен applied', принятый.status === 'applied',
    'applied', принятый.status);
  проверить('у одобренного нет обязательного отзыва рецензента',
    принятый.reviewComment === null || принятый.reviewComment === undefined
      || типПусто(принятый.reviewComment), 'необязателен',
    JSON.stringify(принятый.reviewComment));

  // Прямая правка распорядителя ОТЛИЧИМА от рассмотренного коммита: у неё
  // автор и рецензент — одно лицо, и очереди она не проходила. Без этого
  // различия история врёт: правка, никем не смотренная, выглядит одобренной.
  // Путь выбирает ЗАСТАВА, а не тело запроса: у кого есть право
  // рассматривать, у того правка ложится сразу; довод «наРассмотрение»
  // снаружи не слушают — иначе всякий обходил бы очередь. Ответ говорит
  // об этом прямо (поле «прямая») и разными кодами: 201 против 202.
  const текущееLogos = (await гость.зов('/api/graph')).тело?.data?.наборы
    ?.concepts?.find(к => к.id === 'logos')?.description ?? null;
  const прямая = await рец.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: прямая правка распорядителя',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { description: { base: текущееLogos,
                                                 next: 'прямая правка' } } }] } });
  проверить('правка распорядителя ложится СРАЗУ (201, не 202)',
    прямая.код === 201, 201, прямая.код);
  проверить('и ответ НАЗЫВАЕТ её прямой', прямая.тело?.data?.прямая === true,
    true, JSON.stringify(прямая.тело?.data?.прямая));
  проверить('а коммит автора очередь проходил (202)', commit.код === 202,
    202, commit.код);
  const idП = прямая.тело?.data?.commitId;
  const п = (await рец.зов(`/api/commits/${idП}`)).тело?.data ?? {};
  проверить('у прямой правки автор и рецензент — одно лицо',
    п.authorId === п.reviewedBy || п.reviewedBy === null,
    'одно лицо', `${п.authorId} / ${п.reviewedBy}`);
  проверить('прямая правка сразу применена', п.status === 'applied',
    'applied', п.status);

  // ── 11б. КОНФЛИКТ КАК ВОССТАНАВЛИВАЕМОЕ СОСТОЯНИЕ (C-2, §7) ───────────
  //
  // Столкновение не должно быть тупиком. Проверяется, что после него
  // ВИДНЫ ВСЕ ТРИ ЗНАЧЕНИЯ — база, предложенное, текущее, — и что
  // разрешение есть НОВАЯ операция, а не молчаливая перезапись чужого.
  const базаНус = (await гость.зов('/api/graph')).тело?.data?.наборы
    ?.concepts?.find(к => к.id === 'nous')?.description ?? null;

  // Автор предлагает правку от известной ему базы...
  const спорный = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: спорная правка',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: базаНус,
                                                 next: 'от автора' } } }] } });
  const idСпор = спорный.тело?.data?.commitId;

  // ...а распорядитель тем временем правит то же поле по-своему.
  await рец.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: чужая правка того же поля',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: базаНус,
                                                 next: 'от распорядителя' } } }] } });

  const попытка = await рец.зов(`/api/commits/${idСпор}/review`,
    { method: 'POST', body: { action: 'approve' } });
  // СТОЛКНОВЕНИЕ — НЕ ОШИБКА, А ИСХОД. Первая редакция утверждения ждала
  // 4xx и была неправа: review.js говорит прямо — «столкновение не отказ
  // рецензента и не ошибка автора: это состояние коммита». Ход отвечает
  // 200, называет исход и НЕ применяет правку. Прибор спрашивает, а не
  // диктует.
  проверить('одобрение отвечает 200 и НАЗЫВАЕТ исход',
    попытка.код === 200 && попытка.тело?.data?.исход === 'conflicted',
    '200 + conflicted', `${попытка.код} ${попытка.тело?.data?.исход}`);
  проверить('столкновения пришли в ответе на одобрение',
    Array.isArray(попытка.тело?.data?.столкновения)
      && попытка.тело.data.столкновения.length > 0,
    'список', JSON.stringify(попытка.тело?.data?.столкновения).slice(0, 60));

  const спорПосле = (await автор.зов(`/api/commits/${idСпор}`)).тело?.data ?? {};
  проверить('коммит помечен conflicted', спорПосле.status === 'conflicted',
    'conflicted', спорПосле.status);
  проверить('СТОЛКНОВЕНИЯ ВИДНЫ АВТОРУ', Array.isArray(спорПосле.conflicts)
    && спорПосле.conflicts.length > 0, 'список', JSON.stringify(спорПосле.conflicts));
  const с0 = (спорПосле.conflicts || [])[0] || {};
  проверить('в столкновении названо ПОЛЕ', с0.field === 'description',
    'description', с0.field);
  проверить('ВИДНЫ ВСЕ ТРИ ЗНАЧЕНИЯ: база, предложенное, текущее',
    с0.base === базаНус && с0.yours === 'от автора'
      && с0.current === 'от распорядителя',
    'три значения', JSON.stringify([с0.base, с0.yours, с0.current]).slice(0, 90));

  проверить('чужая правка НЕ перезаписана молча',
    /от распорядителя/.test(String((await гость.зов('/api/graph')).тело?.data
      ?.наборы?.concepts?.find(к => к.id === 'nous')?.description)),
    'от распорядителя', 'перезаписано');

  // Разрешение — НОВАЯ операция: конфликтный коммит остаётся конфликтным.
  const заново = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: разрешение столкновения',
            authorComment: 'учёл чужую правку',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: 'от распорядителя',
                                                 next: 'от автора поверх чужого' } } }] } });
  проверить('разрешение подаётся НОВЫМ коммитом', заново.код === 202,
    202, заново.код);
  проверить('конфликтный коммит так и остался конфликтным',
    (await автор.зов(`/api/commits/${idСпор}`)).тело?.data?.status === 'conflicted',
    'conflicted', (await автор.зов(`/api/commits/${idСпор}`)).тело?.data?.status);

  // «Правили одинаково» — не столкновение, а свой исход.
  const текущийНус = (await гость.зов('/api/graph')).тело?.data?.наборы
    ?.concepts?.find(к => к.id === 'nous')?.description;
  const одинаково = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: та же правка, что уже применена',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: базаНус,
                                                 next: текущийНус } } }] } });
  const idОдин = одинаково.тело?.data?.commitId;
  await рец.зов(`/api/commits/${idОдин}/review`,
    { method: 'POST', body: { action: 'approve' } });
  проверить('СОВПАВШАЯ правка даёт coincided, а не conflicted',
    (await автор.зов(`/api/commits/${idОдин}`)).тело?.data?.status === 'coincided',
    'coincided', (await автор.зов(`/api/commits/${idОдин}`)).тело?.data?.status);

  // ── 11в. УВЕДОМЛЕНИЯ КАК КОНТРАКТ (C-3, §8) ──────────────────────────
  //
  // Главное здесь — НЕ «пришло ли», а «ровно ли один раз». Работник
  // исходящих запускается по расписанию, и повторный прогон не должен
  // рассылать то же самое заново: человек, получивший письмо дважды,
  // перестаёт верить всем письмам сразу.
  const счётДо = (await автор.зов('/api/notifications/unread-count'))
    .тело?.data?.count ?? 0;
  await прокрутитьРаботника(pool);
  const счётПосле = (await автор.зов('/api/notifications/unread-count'))
    .тело?.data?.count ?? 0;
  // СНАЧАЛА — ЧТО ПРОВЕРЯТЬ ЕСТЬ ЧТО. Утверждение «не двоит» на пустом
  // ящике сходится само собой и не значит ничего; такой прибор зелен и
  // слеп. Поэтому непустота ящика — отдельное утверждение перед ним.
  проверить('к этому мигу уведомления автору уже есть', счётДо > 0, '>0', счётДо);
  проверить('ПОВТОРНЫЙ ПРОГОН РАБОТНИКА НЕ ДВОИТ уведомлений',
    счётПосле === счётДо, счётДо, счётПосле);

  const sorted = await автор.зов('/api/notifications');
  const записи = sorted.тело?.data?.items ?? sorted.тело?.data ?? [];
  проверить('список уведомлений отвечает в поле data',
    'data' in (sorted.тело ?? {}), 'data', Object.keys(sorted.тело ?? {}).join(','));
  проверить('в уведомлении назван ЕГО РОД',
    Array.isArray(записи) && записи.length > 0 && !!записи[0].type,
    'type', JSON.stringify(записи[0] ?? {}).slice(0, 70));
  проверить('уведомления автору — ТОЛЬКО о его коммитах',
    Array.isArray(записи) && записи.every(з => з.type !== 'commit_pending'),
    'нет чужой очереди', (записи || []).map(з => з.type).join(',').slice(0, 60));

  // Прочитанное не возвращается в непрочитанное.
  const перваяЗапись = (записи || [])[0];
  if (перваяЗапись) {
    await автор.зов(`/api/notifications/${перваяЗапись.notificationId
      ?? перваяЗапись.id}/read`, { method: 'POST' });
    const счётЧт = (await автор.зов('/api/notifications/unread-count'))
      .тело?.data?.count ?? 0;
    проверить('отметка «прочитано» уменьшает счёт', счётЧт < счётПосле,
      `<${счётПосле}`, счётЧт);
    await прокрутитьРаботника(pool);
    const счётСнова = (await автор.зов('/api/notifications/unread-count'))
      .тело?.data?.count ?? 0;
    проверить('и работник НЕ возвращает прочитанное в непрочитанное',
      счётСнова === счётЧт, счётЧт, счётСнова);
  }

  const всёПрочтено = await автор.зов('/api/notifications/read-all',
    { method: 'POST' });
  проверить('«прочитать всё» проходит', всёПрочтено.код === 200, 200,
    всёПрочтено.код);
  проверить('после этого непрочитанных нет',
    ((await автор.зов('/api/notifications/unread-count')).тело?.data?.count ?? -1) === 0,
    0, (await автор.зов('/api/notifications/unread-count')).тело?.data?.count);

  // Настройки — тоже часть контракта, и обязательное в них не отключается.
  const наст = await автор.зов('/api/notifications/preferences');
  проверить('настройки уведомлений читаются', наст.код === 200, 200, наст.код);
  const отключить = await автор.зов('/api/notifications/preferences',
    { method: 'PATCH', body: { categories: { account: false } } });
  проверить('ОБЯЗАТЕЛЬНУЮ категорию отключить НЕЛЬЗЯ', отключить.код >= 400,
    '4xx', отключить.код);
  const необязательная = await автор.зов('/api/notifications/preferences',
    { method: 'PATCH', body: { categories: { graphChanges: false } } });
  проверить('а необязательную — можно', необязательная.код === 200, 200,
    необязательная.код);

  // ── 11г. ПОСЛЕДСТВИЯ ПРАВКИ ВИДНЫ РЕЦЕНЗЕНТУ (E-3, §16) ──────────────
  //
  // На клиенте такие предупреждения давно есть и хороши, но видит их только
  // автор и только в миг правки. Проверяется, что то же знание доходит до
  // того, кто РЕШАЕТ.
  const наУдаление = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: удаление концепции ради последствий',
            changes: [{ action: 'delete', kind: 'concept',
                        entityId: 'harmony_spheres' }] } });
  const idУд = наУдаление.тело?.data?.commitId;
  const посл = await рец.зов(`/api/commits/${idУд}/impact`);
  проверить('последствия коммита отдаются рецензенту', посл.код === 200, 200,
    `${посл.код} ${JSON.stringify(посл.тело?.error ?? '').slice(0, 50)}`);
  const посл1 = посл.тело?.data ?? {};
  проверить('названа сама исчезающая концепция',
    (посл1.gone?.concepts ?? []).some(к => к.id === 'harmony_spheres'),
    'harmony_spheres', JSON.stringify(посл1.gone?.concepts).slice(0, 60));
  проверить('КАСКАД ПОСЧИТАН: связи гибнут вместе с концом',
    посл1.cascaded > 0, '>0', посл1.cascaded);
  проверить('связность до и после названа числом',
    Number.isInteger(посл1.connectivity?.before) && Number.isInteger(посл1.connectivity?.after),
    'два числа', JSON.stringify(посл1.connectivity));
  проверить('осиротевшие перечислены поимённо (или список пуст)',
    Array.isArray(посл1.orphaned), 'массив', typeof посл1.orphaned);

  // Правка без удаления строения не трогает — и ответ говорит это прямо,
  // а не молчит.
  const послПравки = await рец.зов(`/api/commits/${id2}/impact`);
  const посл2 = послПравки.тело?.data ?? {};
  проверить('у правки без удаления последствий для строения нет',
    (посл2.gone?.concepts ?? []).length === 0 && посл2.cascaded === 0
      && посл2.connectivity?.splits === false,
    'строение не тронуто', JSON.stringify(посл2).slice(0, 70));

  const чужойСпрос = await посторонний.зов(`/api/commits/${idУд}/impact`);
  проверить('чужие последствия постороннему не видны', чужойСпрос.код >= 400,
    '4xx', чужойСпрос.код);

  // ── 11д. РОДСТВО КОММИТОВ (E-4, §17) ─────────────────────────────────
  //
  // Нитей обсуждения здесь нет нарочно: цикл «отказ с причиной → новый
  // коммит с новым обоснованием» УЖЕ диалог, привязанный к делу. А вот
  // связи между попытками не было — история распадалась на несвязанные
  // заходы.
  const взамен = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: третий заход на то же',
            supersedes: commitId,
            changes: [{ action: 'edit', kind: 'concept', entityId: 'nous',
                        fields: { description: { base: (await гость.зов('/api/graph'))
                          .тело?.data?.наборы?.concepts?.find(к => к.id === 'nous')
                          ?.description ?? null, next: 'третий заход' } } }] } });
  проверить('коммит взамен отклонённого принимается', взамен.код === 202,
    202, `${взамен.код} ${JSON.stringify(взамен.тело?.error ?? '').slice(0, 60)}`);
  const idВзамен = взамен.тело?.data?.commitId;
  проверить('РОДСТВО ВИДНО СНАРУЖИ',
    (await автор.зов(`/api/commits/${idВзамен}`)).тело?.data?.supersedes === commitId,
    commitId, (await автор.зов(`/api/commits/${idВзамен}`)).тело?.data?.supersedes);

  const чужоеРодство = await посторонний.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: заменить чужой коммит', supersedes: commitId,
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { description: { base: null, next: 'подмена' } } }] } });
  проверить('ЧУЖОЙ коммит заменить нельзя', чужоеРодство.код >= 400, '4xx',
    чужоеРодство.код);

  // Заменять ожидающий бессмысленно: его надо править, а не заводить второй.
  const ждущий = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: ещё один ожидающий',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { description: { base: null, next: 'ждущий' } } }] } });
  const наЖдущего = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: замена ожидающего',
            supersedes: ждущий.тело?.data?.commitId,
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { description: { base: null, next: 'замена' } } }] } });
  проверить('ОЖИДАЮЩИЙ коммит заменять нельзя — его правят',
    наЖдущего.код >= 400, '4xx', наЖдущего.код);

  // ── 11е. ПРОИСХОЖДЕНИЕ СОДЕРЖАНИЯ (E-1, §14) ─────────────────────────
  //
  // Поле НЕОБЯЗАТЕЛЬНО и появляется только там, где его указали. Это не
  // послабление, а условие работы: 453 концепции и 1624 связи не обрастут
  // источниками за один заход, и система, требующая их сразу, просто не
  // даст ничего править.
  const сИсточником = await автор.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: правка с указанием источника',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { provenance: { base: null,
                          next: 'Гераклит, фр. B1 (Дильс–Кранц)' } } }] } });
  проверить('правка ОДНОГО происхождения принимается',
    сИсточником.код === 202, 202,
    `${сИсточником.код} ${JSON.stringify(сИсточником.тело?.error ?? '').slice(0, 60)}`);
  await рец.зов(`/api/commits/${сИсточником.тело?.data?.commitId}/review`,
    { method: 'POST', body: { action: 'approve' } });

  const графСИст = (await гость.зов('/api/graph')).тело?.data?.наборы?.concepts ?? [];
  const логос = графСИст.find(к => к.id === 'logos') ?? {};
  проверить('ПРОИСХОЖДЕНИЕ ДОШЛО ДО ВЫГРУЗКИ',
    /Гераклит/.test(String(логос.provenance ?? '')), 'Гераклит',
    JSON.stringify(логос.provenance));

  // САМОЕ ВАЖНОЕ УТВЕРЖДЕНИЕ ЭТОГО РАЗДЕЛА: сущность без источника НЕ
  // обрастает пустым полем. Иначе выгрузка разошлась бы с файлами у всех
  // 453 концепций разом, а «нет источника» стало бы неотличимо от
  // «источник — пустая строка».
  const безИсточника = графСИст.filter(к => 'provenance' in к).length;
  проверить('поле есть ТОЛЬКО там, где указано', безИсточника === 1, 1,
    безИсточника);

  // Машинное описание коммита подхватывает новое поле САМО — оно строится
  // из ключей fields, а не из зашитого перечня.
  проверить('машинный адрес правки называет поле происхождения',
    /provenance/.test(JSON.stringify(
      (await автор.зов(`/api/commits/${сИсточником.тело?.data?.commitId}`)).тело ?? {})),
    'provenance', 'не назван');

  // ── 11ж. ЗАМЕРЫ МЕТРИК (E-2, §15) ────────────────────────────────────
  //
  // Сервер не считает метрики и не будет: 86 функций живут в браузере.
  // Он ЗАПОМИНАЕТ наблюдение вместе с условиями — и стережёт, чтобы
  // несравнимое не сравнивали.
  const summary = { summary: { mean: 0.31, median: 0.28, spread: 0.12, nonzero: 288 },
                   top: [{ id: 'nietzsche', value: 0.72 }] };
  const замер1 = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', formulaVersion: 1,
            flags: 'weights=on;direction=off', scope: [], scopeNote: 'вся база',
            values: summary, note: 'перед правкой описаний' } });
  проверить('замер записывается', замер1.код === 201, 201,
    `${замер1.код} ${JSON.stringify(замер1.тело?.error ?? '').slice(0, 60)}`);
  проверить('ВЕРСИЮ ГРАФА ПОДПИСАЛ СЕРВЕР, а не клиент',
    Number.isInteger(замер1.тело?.data?.graphVersion), 'число',
    замер1.тело?.data?.graphVersion);

  const безВерсии = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', flags: 'x', values: summary } });
  проверить('ЗАМЕР БЕЗ ВЕРСИИ ФОРМУЛЫ ОТВЕРГНУТ — это число без родословной',
    безВерсии.код >= 400, '4xx', безВерсии.код);
  const безСводки = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', formulaVersion: 1, flags: 'x',
            values: { top: [{ id: 'a', value: 1 }] } } });
  проверить('замер без сводки отвергнут', безСводки.код >= 400, '4xx', безСводки.код);

  // ГРАФ МЕЖДУ ЗАМЕРАМИ ПРАВИТСЯ ПО-НАСТОЯЩЕМУ. Первая редакция снимала оба
  // замера при одной версии — и служба честно отказала: «это один и тот же
  // граф, сравнивать нечего». Отказ был прав, неверна была проба.
  await рец.зов('/api/commits', { method: 'POST',
    body: { message: 'проба: правка между замерами',
            changes: [{ action: 'edit', kind: 'concept', entityId: 'logos',
                        fields: { description: {
                          base: (await гость.зов('/api/graph')).тело?.data?.наборы
                            ?.concepts?.find(к => к.id === 'logos')?.description ?? null,
                          next: 'правка между замерами' } } }] } });

  // Второй замер — после правки графа, при ТЕХ ЖЕ условиях.
  const замер2 = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', formulaVersion: 1,
            flags: 'weights=on;direction=off', scope: [], scopeNote: 'вся база',
            values: { summary: { mean: 0.34, median: 0.28, spread: 0.13, nonzero: 290 },
                      top: [{ id: 'nietzsche', value: 0.75 }] } } });
  const замерId1 = замер1.тело?.data?.observationId;
  const замерId2 = замер2.тело?.data?.observationId;

  const сравнение = await автор.зов(
    `/api/metrics/compare?a=${замерId1}&b=${замерId2}`);
  проверить('сравнимые замеры сравниваются',
    сравнение.тело?.data?.сравнимы === true, true,
    JSON.stringify(сравнение.тело?.data?.почему ?? сравнение.тело?.data?.сравнимы));
  проверить('и названа РАЗНИЦА по сводке',
    сравнение.тело?.data?.сводка?.mean?.разница != null, 'число',
    JSON.stringify(сравнение.тело?.data?.сводка?.mean));
  проверить('раньше и позже расставлены по версии графа',
    сравнение.тело?.data?.раньше?.graphVersion
      <= сравнение.тело?.data?.позже?.graphVersion, 'по возрастанию',
    JSON.stringify([сравнение.тело?.data?.раньше?.graphVersion,
                    сравнение.тело?.data?.позже?.graphVersion]));

  // ГЛАВНОЕ УТВЕРЖДЕНИЕ РАЗДЕЛА: несравнимое сравнивать НЕ ДАЮТ.
  const инаяФормула = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', formulaVersion: 2,
            flags: 'weights=on;direction=off', scope: [], values: summary } });
  const отказСравнить = await автор.зов(
    `/api/metrics/compare?a=${замерId1}&b=${инаяФормула.тело?.data?.observationId}`);
  проверить('ЗАМЕРЫ ИНОЙ ФОРМУЛЫ СРАВНИВАТЬ НЕ ДАЮТ',
    отказСравнить.тело?.data?.сравнимы === false, false,
    отказСравнить.тело?.data?.сравнимы);
  проверить('и сказано, ЧТО ИМЕННО разошлось',
    /версия формулы/.test(JSON.stringify(отказСравнить.тело?.data?.разошлось ?? '')),
    'версия формулы', JSON.stringify(отказСравнить.тело?.data?.разошлось));

  const инойОхват = await автор.зов('/api/metrics/observations', { method: 'POST',
    body: { metric: 'criticalPowerIndex', formulaVersion: 1,
            flags: 'weights=on;direction=off', scope: ['plato', 'kant'],
            scopeNote: 'двое', values: summary } });
  проверить('замеры иного охвата сравнивать не дают',
    (await автор.зов(`/api/metrics/compare?a=${замерId1}&b=${инойОхват.тело?.data?.observationId}`))
      .тело?.data?.сравнимы === false, false, true);

  const сравнимые = await автор.зов(`/api/metrics/observations/${замерId1}/comparable`);
  проверить('сравнимые с замером перечислены',
    (сравнимые.тело?.data?.items ?? []).some(з => з.observationId === замерId2),
    'второй замер в списке',
    (сравнимые.тело?.data?.items ?? []).length);
  проверить('а несравнимые в этот список НЕ попали',
    !(сравнимые.тело?.data?.items ?? []).some(
      з => з.formulaVersion === 2 || з.scopeNote === 'двое'),
    'только сравнимые', JSON.stringify(
      (сравнимые.тело?.data?.items ?? []).map(з => з.formulaVersion)));

  // ── 11з. ТРИ ХОДА, КОТОРЫХ НЕ БЫЛО (найдены вопросом автора) ─────────
  //
  // Службы работали и были проверены своими пробами, а наружу не выводились.
  // Продуктовая проба их не видела: она спрашивает то, о чём знает, что надо
  // спросить, и отсутствие неспрошенного ей невидимо.

  // 1. СНЯТИЕ ВТОРОГО ШАГА. Без него защита есть ловушка: потерян телефон,
  // кончились коды — запись заперта навсегда.
  // Шаг заводится ЗДЕСЬ ЖЕ, а не берётся от прежнего раздела: между ними
  // лежит вход заново и десяток правок, и полагаться на состояние, которое
  // никто не подтверждал, значит проверять не то, что думаешь.
  const сноваЗавод = await автор.зов('/api/auth/mfa/enroll', { method: 'POST' });
  await автор.зов('/api/auth/mfa/enroll/confirm', { method: 'POST',
    body: { code: totpКод(сноваЗавод.тело.data.секрет) } });

  const снятьЧужимКодом = await автор.зов('/api/auth/mfa/disable',
    { method: 'POST', body: { code: '000000' } });
  проверить('снять второй шаг ЧУЖИМ кодом нельзя', снятьЧужимКодом.код >= 400,
    '4xx', снятьЧужимКодом.код);

  const снятие = await автор.зов('/api/auth/mfa/disable',
    { method: 'POST', body: { code: totpКод(сноваЗавод.тело.data.секрет) } });
  проверить('ВТОРОЙ ШАГ СНИМАЕТСЯ своим кодом', снятие.код === 200, 200,
    `${снятие.код} ${JSON.stringify(снятие.тело?.error ?? '').slice(0, 60)}`);
  проверить('после снятия шаг больше не заведён',
    (await pool.query('SELECT mfa_enabled FROM users WHERE user_id = $1',
      [данныеАвтора.userId])).rows[0].mfa_enabled === false, false, true);

  // 2. ИСТОРИЯ ПРАВОК СУЩНОСТИ. Хранилась и не читалась.
  //
  // ЧИТАЕТ РЕЦЕНЗЕНТ, А НЕ АВТОР, И ЭТО СЛЕДСТВИЕ ПРЕДЫДУЩЕЙ ПРОВЕРКИ:
  // снятие второго шага гасит ВСЕ сеансы разом — иначе увёденный сеанс
  // пережил бы снятие защиты. Автор после снятия вышел, и это правильно.
  const история = await рец.зов('/api/graph/concept/harmony_spheres/history');
  проверить('история правок сущности читается', история.код === 200, 200,
    `${история.код} ${JSON.stringify(история.тело?.error ?? '').slice(0, 50)}`);
  проверить('и в ней есть записи о наших правках',
    (история.тело?.data?.items ?? []).length > 0, '>0',
    (история.тело?.data?.items ?? []).length);

  // 3. УДАЛЕНИЕ ЗАПИСИ. Право было, хода не было.
  const жертва = браузер('на удаление');
  const регЖ = await жертва.зов('/api/auth/register', { method: 'POST',
    body: { username: 'на_удаление', email: 'del@example.invalid',
            password: ПАРОЛЬ } });
  const идЖ = регЖ.тело.data.userId;
  const своими = await автор.зов(`/api/users/${идЖ}`, { method: 'DELETE' });
  проверить('УДАЛЯТЬ ЧУЖИЕ ЗАПИСИ РЕДАКТОРУ НЕЛЬЗЯ', своими.код >= 400,
    '4xx', своими.код);
  // УДАЛЕНИЕ ТРЕБУЕТ СВЕЖЕГО ВТОРОГО ШАГА, и это не помеха пробе, а
  // проверяемое свойство: запись удаляют насовсем, и одного увода сеанса
  // для этого мало. Рецензент вошёл без предъявления кода — значит и не
  // должен мочь.
  const распорядителем = await рец.зов(`/api/users/${идЖ}`, { method: 'DELETE' });
  проверить('УДАЛЕНИЕ ТРЕБУЕТ СВЕЖЕГО ВТОРОГО ШАГА',
    распорядителем.код === 401
      && /mfa/i.test(JSON.stringify(распорядителем.тело?.error ?? '')),
    '401 mfa_required', `${распорядителем.код} ${JSON.stringify(
      распорядителем.тело?.error ?? '').slice(0, 50)}`);

  // ── 12. откат ──────────────────────────────────────────────────────────
  const revertCommit = await рец.зов(`/api/commits/${id2}/revert`, { method: 'POST',
    body: { reason: 'проба отката' } });
  проверить('откат проходит', revertCommit.код === 200 || revertCommit.код === 201,
    '200', `${revertCommit.код} ${JSON.stringify(revertCommit.тело?.error ?? '').slice(0, 50)}`);
  const графПосле = await гость.зов('/api/graph');
  const описаниеПосле = графПосле.тело?.data?.наборы?.concepts
    ?.find(к => к.id === 'harmony_spheres')?.description;
  проверить('откат вернул прежнее описание',
    !/редакция вторая/.test(описаниеПосле || ''), 'прежнее',
    String(описаниеПосле).slice(0, 50));

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 140));
} finally {
  httpServer.close();
  for (const п of проверки)
    console.log((п.годно ? '  ' : (п.дыра ? '⊘ ' : '✗ ')) + п.имя.padEnd(58, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const дыры = проверки.filter(п => п.дыра);
  const плохо = проверки.filter(п => !п.годно && !п.дыра);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length},` +
              ` отсутствующих возможностей ${дыры.length}`);
  await pool.end();
  process.exit(плохо.length || дыры.length ? 1 : 0);
}
