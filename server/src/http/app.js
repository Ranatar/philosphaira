// СЛОЙ HTTP.
//
// Заводится в беседе 4.1, и это отступление от плана, которое надо назвать:
// план полагал, что маршруты появятся сами собой вместе со службами. Они не
// появились — беседы 1.1–3.3 писали службы и пробы, а наружу сервер не
// смотрел вовсе. Клиенту (4.1) нужен вход и сведения о себе, значит слой
// пора завести — но только то, без чего 4.1 не встаёт: вход, выход, второй
// шаг, «кто я». Остальные ходы придут со своими беседами.
//
// Ветки /api/admin/… нет нарочно: путь не должен быть вторым носителем
// знания о правах — их проверяет застава, и только она.

import express from 'express';
import cookieParser from 'cookie-parser';
import fs from 'node:fs/promises';
import path from 'node:path';
import { attachUser } from '../auth/middleware.js';
import { login, logout, logoutAll, register, verifyEmail } from '../auth/service.js';
import { submitCode, requireFreshMfa, beginEnroll, confirmEnroll, disable as disableMfa }
  from '../auth/mfa.js';
import { userToApi } from '../db/mapper.js';
import { impactOf } from '../graph/impact.js';
import { recordObservation, getObservation, listMetricObservations,
         compareObservations, listComparableWith } from '../metrics/observations.js';
import { exportAll } from '../db/graph.js';
import { createCommit, listMine, listPending, getCommit,
         editOwnCommit, deleteOwnCommit } from '../commits/service.js';
import { directCommit, reviewCommit } from '../commits/review.js';
import { revertCommit } from '../commits/revert.js';
import { listUsers, changeUserRole, banUser, unbanUser, allowedRoles }
  from '../users/service.js';
import { can } from '../access/access.js';
import { readGraph, readGraphSince, readEntityHistory } from '../graph/read.js';
import { unread, list, read, readAll, preferences, updatePreferences }
  from '../notify/read.js';
import { P } from '../access/roles.js';
import { errorHandler } from './errors.js';
import { requireAuth } from './guards.js';
import { checkCsrf, newCsrfToken, cookieСеанса, cookieCsrf,
         SESSION_COOKIE, CSRF_COOKIE } from './cookies.js';

export function createApp({ pool, безопасныеCookie = true,
                                    папкаПриложения = null }) {
  const app = express();
  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());

  // Пул кладётся в запрос, а не берётся из воздуха: пробе нужно подсунуть свой.
  app.use((req, _res, next) => { req.db = pool; next(); });
  app.use(attachUser);

  // ВХОДНЫЕ ХОДЫ ИЗ ПРОВЕРКИ CSRF ИСКЛЮЧЕНЫ, и вот почему: признак выдаётся
  // ВМЕСТЕ с сессией, а до входа его взять неоткуда — первая же попытка
  // войти отвергалась бы с 403. Проба это и показала.
  // Защиту здесь несёт SameSite=Lax: чужой сайт не заставит браузер послать
  // наши cookie POST-запросом. Двойная отправка стережёт всё остальное —
  // то есть ходы, которые опираются на УЖЕ выданную сессию.
  const WITHOUT_CSRF = new Set([
    '/api/auth/register', '/api/auth/login', '/api/auth/mfa',
    '/api/auth/verify-email',
  ]);
  app.use((req, res, next) =>
    WITHOUT_CSRF.has(req.path) ? next() : checkCsrf(req, res, next));

  const issueSession = (res, токен) => {
    const csrfToken = newCsrfToken();
    res.cookie(SESSION_COOKIE, токен, cookieСеанса(безопасныеCookie));
    res.cookie(CSRF_COOKIE, csrfToken, cookieCsrf(безопасныеCookie));
    return csrfToken;
  };

  const wrap = fn => (req, res, next) => fn(req, res).catch(next);

  app.post('/api/auth/register', wrap(async (req, res) => {
    const { username, email, password, displayName } = req.body ?? {};
    const result = await register(pool, { username, email, password, displayName,
      ip: req.ip, ua: req.get('user-agent') });
    issueSession(res, result.токен);
    res.status(201).json({ data: userToApi(result.user) });
  }));

  app.post('/api/auth/login', wrap(async (req, res) => {
    const { email, password } = req.body ?? {};
    const result = await login(pool, { email, password,
      ip: req.ip, ua: req.get('user-agent') });
    issueSession(res, result.токен);
    // Частичная сессия честно объявляет себя: клиент должен знать, что
    // впереди второй шаг, а не гадать по отказам.
    res.json({ data: { user: userToApi(result.user), ждётКода: result.ждётКода === true } });
  }));

  app.post('/api/auth/mfa', wrap(async (req, res) => {
    // Ход для ЧАСТИЧНОЙ сессии: req.user здесь null нарочно, потому и
    // requireAuth не годится — привратник таких не пускает дальше.
    if (!req.mfaPending) throw Object.assign(new Error('Второй шаг не ожидается'),
      { status: 400, code: 'no_mfa_pending' });
    const result = await submitCode(pool, req.mfaPending, req.body?.code);
    res.json({ data: result });
  }));

  // ── заведение второго шага ───────────────────────────────────────────
  // Службы beginEnroll/confirmEnroll были написаны и проверены mfa_probe,
  // но наружу не выведены — и потому не существовали как возможность:
  // bootstrap-admin отправлял человека заводить шаг в панели, а заводить
  // его там было нечем. Проба, зовущая службу напрямую, такой дыры не
  // видит; продуктовая, ходящая по HTTP, увидела сразу.
  //
  // КОГО СЛУШАТЬ О ТОМ, ЧЕЙ ЭТО ШАГ. Только сессию. Ни userId, ни логин из
  // тела не читаются вовсе: иначе всякий вошедший заводил бы второй шаг
  // чужой записи и запирал бы её на свой телефон.
  app.post('/api/auth/mfa/enroll', requireAuth, wrap(async (req, res) => {
    const { секрет: secret, ссылка } = await beginEnroll(pool, req.user);
    // Шаг ЕЩЁ НЕ ВКЛЮЧЁН: включает только предъявленный код. Иначе можно
    // запереть себя, сохранив в базе секрет, который никуда не записан.
    res.json({ data: { секрет: secret, ссылка, включён: false } });
  }));

  app.post('/api/auth/mfa/enroll/confirm', requireAuth, wrap(async (req, res) => {
    const { коды: recoveryCodes } = await confirmEnroll(pool, req.user, req.body?.code);
    // Коды восстановления показываются ОДИН раз и больше ниоткуда не
    // читаются: в базе лежат только их хеши.
    res.json({ data: { включён: true, коды: recoveryCodes } });
  }));

  // СНЯТИЕ ВТОРОГО ШАГА. Служба была написана и проверена `mfa_probe`, а
  // хода не имела — то есть человек мог завести второй шаг и НЕ МОГ его
  // снять. Потерян телефон, кончились коды восстановления — запись заперта
  // навсегда. Защита, из которой нет выхода, есть ловушка.
  //
  // Требуется КОД, а не только вход: снимать защиту должен тот, у кого она
  // на руках, иначе достаточно было бы увести сеанс. Служба гасит и коды
  // восстановления, и все сеансы разом — потому и требует свежести.
  app.post('/api/auth/mfa/disable', requireAuth, wrap(async (req, res) => {
    res.json({ data: await disableMfa(pool, req.user, req.body?.code) });
  }));

  app.post('/api/auth/logout', requireAuth, wrap(async (req, res) => {
    await logout(pool, req.sessionId);
    res.clearCookie(SESSION_COOKIE).clearCookie(CSRF_COOKIE).json({ data: { ok: true } });
  }));

  app.post('/api/auth/logout-all', requireAuth, wrap(async (req, res) => {
    await logoutAll(pool, req.user.userId);
    res.clearCookie(SESSION_COOKIE).clearCookie(CSRF_COOKIE).json({ data: { ok: true } });
  }));

  app.post('/api/auth/verify-email', wrap(async (req, res) => {
    res.json({ data: await verifyEmail(pool, req.body?.token) });
  }));

  /**
   * «Кто я». Отвечает и гостю — тем, что он гость: клиенту нужно отличать
   * «сервера нет» от «сервер есть, но я не вошёл».
   */
  app.get('/api/users/me', (req, res) => {
    res.json({ data: req.user ? userToApi(req.user)
                              : { гость: true, permissions: ['view_graph'] } });
  });

  /**
   * Страница, отданная СЕРВЕРОМ, несёт метку — по ней клиент и узнаёт, что
   * сервер есть. Догадка заменена объявлением: иначе страница нащупывала бы
   * сервер запросом наугад и на статическом сервере печатала 404 в консоль,
   * а прибор справедливо считал бы это изменением поведения.
   */
  if (папкаПриложения) {
    app.get('/index.html', wrap(async (_req, res) => {
      const filePath = path.join(папкаПриложения, 'index.html');
      const pageHtml = await fs.readFile(filePath, 'utf8');
      res.type('html').send(pageHtml.replace('</head>',
        '<meta name="philos-api" content="1"></head>'));
    }));
    app.get('/', (_req, res) => res.redirect('/index.html'));
    app.use(express.static(папкаПриложения));
  }

  /**
   * Отправка правки. ОДИН ход на два случая, и решает не клиент, а сервер:
   * у кого есть право рассмотрения — правит напрямую, у остальных правка
   * встаёт в очередь. Клиент, конечно, знает свои права и рисует по ним —
   * но решение принимается здесь, иначе право оказалось бы у того, кто
   * рисует кнопки.
   */
  app.post('/api/commits', requireAuth, wrap(async (req, res) => {
    const { message, authorComment, changes, supersedes } = req.body ?? {};
    if (can(req.user, P.REVIEW_COMMIT)) {
      const result = await directCommit(pool, { actor: req.user, message, authorComment,
        changes, ip: req.ip });
      return res.status(201).json({ data: { ...result, прямая: true } });
    }
    const result = await createCommit(pool, { actor: req.user, message, authorComment,
      changes, supersedes, ip: req.ip });
    res.status(202).json({ data: { commitId: result.коммит.commitId,
      status: result.коммит.status, пересечения: result.пересечения, прямая: false } });
  }));

  /**
   * Граф целиком или ПРИРАЩЕНИЕМ. Отставшему на одну чужую правку не надо
   * отдавать 2200 сущностей — довольно тех, что изменились с его версии.
   */
  // ── ЗАМЕРЫ МЕТРИК (E-2) ──────────────────────────────────────────────
  // Право — то же, что на просмотр графа: кто вправе видеть числа, вправе и
  // записать, что он их видел. Отдельного права нет нарочно: оно стало бы
  // вторым носителем знания о том, кому что доступно.
  app.post('/api/metrics/observations', requireAuth, wrap(async (req, res) => {
    const { metric, formulaVersion, flags, scope, scopeNote, values, note }
      = req.body ?? {};
    res.status(201).json({ data: await recordObservation(pool, {
      actor: req.user, metric, formulaVersion, flags, scope, scopeNote,
      values, note }) });
  }));

  app.get('/api/metrics/observations', requireAuth, wrap(async (req, res) => {
    res.json({ data: { items: await listMetricObservations(pool, {
      actor: req.user, metric: req.query.metric,
      limit: Number(req.query.limit) || 50 }) } });
  }));

  app.get('/api/metrics/observations/:id', requireAuth, wrap(async (req, res) => {
    res.json({ data: await getObservation(pool,
      { actor: req.user, observationId: req.params.id }) });
  }));

  // Сравнимые — отдельным ходом, а не полем в ответе: их бывает много, и
  // тянуть их всякий раз, когда просто открыли замер, значит платить за то,
  // чего не просили.
  app.get('/api/metrics/observations/:id/comparable', requireAuth,
    wrap(async (req, res) => {
      res.json({ data: { items: await listComparableWith(pool,
        { actor: req.user, observationId: req.params.id }) } });
    }));

  app.get('/api/metrics/compare', requireAuth, wrap(async (req, res) => {
    res.json({ data: await compareObservations(pool, { actor: req.user,
      aId: req.query.a, bId: req.query.b }) });
  }));

  app.get('/api/graph', wrap(async (req, res) => {
    const since = req.query.since;
    res.json({ data: since === undefined
      ? await readGraph(pool, { actor: req.user })
      : await readGraphSince(pool, { actor: req.user, since: since }) });
  }));

  // ПРАВКА И ОТЗЫВ СВОЕГО ОЖИДАЮЩЕГО КОММИТА. Права
  // EDIT_OWN_PENDING_COMMIT и DELETE_OWN_PENDING_COMMIT существовали,
  // выдавались — и не значили ничего: ходов наружу не было. Право без
  // хода — это обещание, которое некому исполнить.
  //
  // «Чужой» и «уже рассмотренный» служба не различает нарочно, и здесь это
  // сохраняется: разный ответ выдал бы существование чужих коммитов.
  app.patch('/api/commits/:id', requireAuth, wrap(async (req, res) => {
    const { message, authorComment, changes } = req.body ?? {};
    res.json({ data: await editOwnCommit(pool, { actor: req.user,
      commitId: req.params.id, message, authorComment, changes, ip: req.ip }) });
  }));

  app.delete('/api/commits/:id', requireAuth, wrap(async (req, res) => {
    res.json({ data: await deleteOwnCommit(pool,
      { actor: req.user, commitId: req.params.id, ip: req.ip }) });
  }));

  // ИСТОРИЯ ПРАВОК СУЩНОСТИ. Право `VIEW_COMMIT_HISTORY` есть у всякого
  // вошедшего, служба читает все версии — а посмотреть, как менялось
  // описание концепции, было нельзя. История, которую нельзя прочесть,
  // хранится впустую.
  app.get('/api/graph/:kind/:entityId/history', requireAuth, wrap(async (req, res) => {
    res.json({ data: { items: await readEntityHistory(pool, { actor: req.user,
      kind: req.params.kind, entityId: req.params.entityId }) } });
  }));

  app.get('/api/commits', requireAuth, wrap(async (req, res) => {
    // ВИД ОТВЕТА ОДИН НА ВСЁ: успех — в поле data, и списки не исключение.
    // Прежде разбиение на страницы уезжало наружу как есть ({items,
    // pagination}), и клиенту приходилось знать два вида ответа вместо
    // одного. Поймала продуктовая проба: http_probe утверждал «успех
    // всегда в data», но спрашивал об этом не списки.
    res.json({ data: await listMine(pool, { actor: req.user,
      status: req.query.status, page: req.query.page, limit: req.query.limit }) });
  }));

  // ── уведомления ────────────────────────────────────────────────────────
  // Счёт непрочитанного — СВОЙ ход, а не поле в ответе списка. В первой
  // редакции документа панель брала счётчик из пагинации, и при более чем
  // пятидесяти уведомлениях он врал.
  app.get('/api/notifications/unread-count', requireAuth, wrap(async (req, res) => {
    res.json({ data: { count: await unread(pool, req.user) } });
  }));

  app.get('/api/notifications', requireAuth, wrap(async (req, res) => {
    res.json({ data: await list(pool, req.user, {
      onlyUnread: req.query.unread === 'true',
      limit: Number(req.query.limit) || 50 }) });
  }));

  app.post('/api/notifications/:id/read', requireAuth, wrap(async (req, res) => {
    await read(pool, req.user, req.params.id);
    res.json({ data: { ok: true } });
  }));

  app.post('/api/notifications/read-all', requireAuth, wrap(async (req, res) => {
    await readAll(pool, req.user);
    res.json({ data: { ok: true } });
  }));

  app.get('/api/notifications/preferences', requireAuth, wrap(async (req, res) => {
    res.json({ data: await preferences(pool, req.user) });
  }));

  app.patch('/api/notifications/preferences', requireAuth, wrap(async (req, res) => {
    await updatePreferences(pool, req.user, req.body ?? {});
    res.json({ data: await preferences(pool, req.user) });
  }));

  // ── очередь и рассмотрение (беседа 4.5) ────────────────────────────────
  // Ветки /api/admin/… нет нарочно: путь не должен быть вторым носителем
  // знания о правах. Кто вправе — решает застава, и только она.
  app.get('/api/commits/pending', requireAuth, wrap(async (req, res) => {
    res.json({ data: await listPending(pool, { actor: req.user,
      page: req.query.page, limit: req.query.limit }) });
  }));

  app.get('/api/commits/:id', requireAuth, wrap(async (req, res) => {
    res.json({ data: await getCommit(pool, { actor: req.user, commitId: req.params.id }) });
  }));

  app.post('/api/commits/:id/review', requireAuth, wrap(async (req, res) => {
    res.json({ data: await reviewCommit(pool, { actor: req.user,
      commitId: req.params.id, action: req.body?.action,
      comment: req.body?.comment, ip: req.ip }) });
  }));

  // ПОСЛЕДСТВИЯ КОММИТА ДЛЯ СТРОЕНИЯ. Право то же, что на просмотр самого
  // коммита: кто вправе увидеть изменение, вправе увидеть и то, во что оно
  // обойдётся. Отдельного права нет нарочно — оно стало бы вторым носителем
  // знания о том, кому что видно.
  app.get('/api/commits/:id/impact', requireAuth, wrap(async (req, res) => {
    const commitRow = await getCommit(pool, { actor: req.user, commitId: req.params.id });
    res.json({ data: impactOf(await exportAll(pool), commitRow.changes) });
  }));

  app.post('/api/commits/:id/revert', requireAuth, wrap(async (req, res) => {
    res.json({ data: await revertCommit(pool, { actor: req.user,
      commitId: req.params.id, reason: req.body?.reason, ip: req.ip }) });
  }));

  // ── пользователи (беседа 4.5б) ─────────────────────────────────────────
  //
  // ДОПУСТИМЫЕ РОЛИ СЧИТАЕТ СЕРВЕР и присылает с каждой записью. Клиенту
  // остаётся нарисовать список — не вычислить его. В первой редакции
  // документа диалог смены роли держал СВОЙ список availableRoles, и это
  // было четвёртое место, где записана иерархия; три из пяти разошлись.
  app.get('/api/users', requireAuth, wrap(async (req, res) => {
    const page = await listUsers(pool, { actor: req.user,
      role: req.query.role, query: req.query.q,
      isBanned: req.query.banned === undefined ? undefined : req.query.banned === 'true',
      page: req.query.page, limit: req.query.limit });
    res.json({ data: {
      ...page,
      items: page.items.map(updatedUser => ({ ...updatedUser, allowedRoles: allowedRoles(req.user, updatedUser) })),
    } });
  }));

  app.post('/api/users/:id/role', requireAuth, requireFreshMfa(), wrap(async (req, res) => {
    const updatedUser = await changeUserRole(pool, { actor: req.user, targetUserId: req.params.id,
      newRole: req.body?.newRole, reason: req.body?.reason, ip: req.ip });
    res.json({ data: { ...updatedUser, allowedRoles: allowedRoles(req.user, updatedUser) } });
  }));

  // УДАЛЕНИЕ ЗАПИСИ. Право `DELETE_USER` объявлено, выдано распорядителю и
  // проверяется службой — а хода не было, и право не значило ничего.
  // Служба сама стережёт последнего распорядителя и запрет действовать на
  // равного; здесь ничего не решается заново, иначе знание о правах
  // расползлось бы по двум местам.
  app.delete('/api/users/:id', requireAuth, requireFreshMfa(), wrap(async (req, res) => {
    res.json({ data: await deleteUser(pool,
      { actor: req.user, targetUserId: req.params.id, ip: req.ip }) });
  }));

  app.post('/api/users/:id/ban', requireAuth, requireFreshMfa(), wrap(async (req, res) => {
    res.json({ data: await banUser(pool, { actor: req.user, targetUserId: req.params.id,
      reason: req.body?.reason, ip: req.ip }) });
  }));

  app.post('/api/users/:id/unban', requireAuth, requireFreshMfa(), wrap(async (req, res) => {
    res.json({ data: await unbanUser(pool, { actor: req.user,
      targetUserId: req.params.id, ip: req.ip }) });
  }));

  app.use(errorHandler);
  return app;
}
