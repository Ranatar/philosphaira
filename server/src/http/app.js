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
import { submitCode, requireFreshMfa } from '../auth/mfa.js';
import { userToApi } from '../db/mapper.js';
import { createCommit, listMine, listPending, getCommit } from '../commits/service.js';
import { directCommit, reviewCommit } from '../commits/review.js';
import { revertCommit } from '../commits/revert.js';
import { listUsers, changeUserRole, banUser, unbanUser, allowedRoles }
  from '../users/service.js';
import { can } from '../access/access.js';
import { readGraph, readGraphSince } from '../graph/read.js';
import { unread, list, read, readAll, preferences, updatePreferences }
  from '../notify/read.js';
import { P } from '../access/roles.js';
import { errorHandler } from './errors.js';
import { requireAuth } from './guards.js';
import { checkCsrf, новыйПризнакCsrf, cookieСеанса, cookieCsrf,
         ИМЯ_СЕАНСА, ИМЯ_CSRF } from './cookies.js';

export function создатьПриложение({ pool, безопасныеCookie = true,
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
  const БЕЗ_ПРИЗНАКА = new Set([
    '/api/auth/register', '/api/auth/login', '/api/auth/mfa',
    '/api/auth/verify-email',
  ]);
  app.use((req, res, next) =>
    БЕЗ_ПРИЗНАКА.has(req.path) ? next() : checkCsrf(req, res, next));

  const выдатьСеанс = (res, токен) => {
    const признак = новыйПризнакCsrf();
    res.cookie(ИМЯ_СЕАНСА, токен, cookieСеанса(безопасныеCookie));
    res.cookie(ИМЯ_CSRF, признак, cookieCsrf(безопасныеCookie));
    return признак;
  };

  const ход = fn => (req, res, next) => fn(req, res).catch(next);

  app.post('/api/auth/register', ход(async (req, res) => {
    const { username, email, password, displayName } = req.body ?? {};
    const и = await register(pool, { username, email, password, displayName,
      ip: req.ip, ua: req.get('user-agent') });
    выдатьСеанс(res, и.токен);
    res.status(201).json({ data: userToApi(и.user) });
  }));

  app.post('/api/auth/login', ход(async (req, res) => {
    const { email, password } = req.body ?? {};
    const и = await login(pool, { email, password,
      ip: req.ip, ua: req.get('user-agent') });
    выдатьСеанс(res, и.токен);
    // Частичная сессия честно объявляет себя: клиент должен знать, что
    // впереди второй шаг, а не гадать по отказам.
    res.json({ data: { user: userToApi(и.user), ждётКода: и.ждётКода === true } });
  }));

  app.post('/api/auth/mfa', ход(async (req, res) => {
    // Ход для ЧАСТИЧНОЙ сессии: req.user здесь null нарочно, потому и
    // requireAuth не годится — привратник таких не пускает дальше.
    if (!req.mfaPending) throw Object.assign(new Error('Второй шаг не ожидается'),
      { status: 400, code: 'no_mfa_pending' });
    const и = await submitCode(pool, req.mfaPending, req.body?.code);
    res.json({ data: и });
  }));

  app.post('/api/auth/logout', requireAuth, ход(async (req, res) => {
    await logout(pool, req.sessionId);
    res.clearCookie(ИМЯ_СЕАНСА).clearCookie(ИМЯ_CSRF).json({ data: { ok: true } });
  }));

  app.post('/api/auth/logout-all', requireAuth, ход(async (req, res) => {
    await logoutAll(pool, req.user.userId);
    res.clearCookie(ИМЯ_СЕАНСА).clearCookie(ИМЯ_CSRF).json({ data: { ok: true } });
  }));

  app.post('/api/auth/verify-email', ход(async (req, res) => {
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
    app.get('/index.html', ход(async (_req, res) => {
      const путь = path.join(папкаПриложения, 'index.html');
      const страница = await fs.readFile(путь, 'utf8');
      res.type('html').send(страница.replace('</head>',
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
  app.post('/api/commits', requireAuth, ход(async (req, res) => {
    const { message, authorComment, changes } = req.body ?? {};
    if (can(req.user, P.REVIEW_COMMIT)) {
      const и = await directCommit(pool, { actor: req.user, message, authorComment,
        changes, ip: req.ip });
      return res.status(201).json({ data: { ...и, прямая: true } });
    }
    const и = await createCommit(pool, { actor: req.user, message, authorComment,
      changes, ip: req.ip });
    res.status(202).json({ data: { commitId: и.коммит.commitId,
      status: и.коммит.status, пересечения: и.пересечения, прямая: false } });
  }));

  /**
   * Граф целиком или ПРИРАЩЕНИЕМ. Отставшему на одну чужую правку не надо
   * отдавать 2200 сущностей — довольно тех, что изменились с его версии.
   */
  app.get('/api/graph', ход(async (req, res) => {
    const с = req.query.since;
    res.json({ data: с === undefined
      ? await readGraph(pool, { actor: req.user })
      : await readGraphSince(pool, { actor: req.user, since: с }) });
  }));

  app.get('/api/commits', requireAuth, ход(async (req, res) => {
    res.json(await listMine(pool, { actor: req.user,
      status: req.query.status, page: req.query.page, limit: req.query.limit }));
  }));

  // ── уведомления ────────────────────────────────────────────────────────
  // Счёт непрочитанного — СВОЙ ход, а не поле в ответе списка. В первой
  // редакции документа панель брала счётчик из пагинации, и при более чем
  // пятидесяти уведомлениях он врал.
  app.get('/api/notifications/unread-count', requireAuth, ход(async (req, res) => {
    res.json({ data: { count: await unread(pool, req.user) } });
  }));

  app.get('/api/notifications', requireAuth, ход(async (req, res) => {
    res.json({ data: await list(pool, req.user, {
      onlyUnread: req.query.unread === 'true',
      limit: Number(req.query.limit) || 50 }) });
  }));

  app.post('/api/notifications/:id/read', requireAuth, ход(async (req, res) => {
    await read(pool, req.user, req.params.id);
    res.json({ data: { ok: true } });
  }));

  app.post('/api/notifications/read-all', requireAuth, ход(async (req, res) => {
    await readAll(pool, req.user);
    res.json({ data: { ok: true } });
  }));

  app.get('/api/notifications/preferences', requireAuth, ход(async (req, res) => {
    res.json({ data: await preferences(pool, req.user) });
  }));

  app.patch('/api/notifications/preferences', requireAuth, ход(async (req, res) => {
    await updatePreferences(pool, req.user, req.body ?? {});
    res.json({ data: await preferences(pool, req.user) });
  }));

  // ── очередь и рассмотрение (беседа 4.5) ────────────────────────────────
  // Ветки /api/admin/… нет нарочно: путь не должен быть вторым носителем
  // знания о правах. Кто вправе — решает застава, и только она.
  app.get('/api/commits/pending', requireAuth, ход(async (req, res) => {
    res.json(await listPending(pool, { actor: req.user,
      page: req.query.page, limit: req.query.limit }));
  }));

  app.get('/api/commits/:id', requireAuth, ход(async (req, res) => {
    res.json({ data: await getCommit(pool, { actor: req.user, commitId: req.params.id }) });
  }));

  app.post('/api/commits/:id/review', requireAuth, ход(async (req, res) => {
    res.json({ data: await reviewCommit(pool, { actor: req.user,
      commitId: req.params.id, action: req.body?.action,
      comment: req.body?.comment, ip: req.ip }) });
  }));

  app.post('/api/commits/:id/revert', requireAuth, ход(async (req, res) => {
    res.json({ data: await revertCommit(pool, { actor: req.user,
      commitId: req.params.id, reason: req.body?.reason, ip: req.ip }) });
  }));

  // ── пользователи (беседа 4.5б) ─────────────────────────────────────────
  //
  // ДОПУСТИМЫЕ РОЛИ СЧИТАЕТ СЕРВЕР и присылает с каждой записью. Клиенту
  // остаётся нарисовать список — не вычислить его. В первой редакции
  // документа диалог смены роли держал СВОЙ список availableRoles, и это
  // было четвёртое место, где записана иерархия; три из пяти разошлись.
  app.get('/api/users', requireAuth, ход(async (req, res) => {
    const стр = await listUsers(pool, { actor: req.user,
      role: req.query.role, query: req.query.q,
      isBanned: req.query.banned === undefined ? undefined : req.query.banned === 'true',
      page: req.query.page, limit: req.query.limit });
    res.json({
      ...стр,
      items: стр.items.map(у => ({ ...у, allowedRoles: allowedRoles(req.user, у) })),
    });
  }));

  app.post('/api/users/:id/role', requireAuth, requireFreshMfa(), ход(async (req, res) => {
    const у = await changeUserRole(pool, { actor: req.user, targetUserId: req.params.id,
      newRole: req.body?.newRole, reason: req.body?.reason, ip: req.ip });
    res.json({ data: { ...у, allowedRoles: allowedRoles(req.user, у) } });
  }));

  app.post('/api/users/:id/ban', requireAuth, requireFreshMfa(), ход(async (req, res) => {
    res.json({ data: await banUser(pool, { actor: req.user, targetUserId: req.params.id,
      reason: req.body?.reason, ip: req.ip }) });
  }));

  app.post('/api/users/:id/unban', requireAuth, requireFreshMfa(), ход(async (req, res) => {
    res.json({ data: await unbanUser(pool, { actor: req.user,
      targetUserId: req.params.id, ip: req.ip }) });
  }));

  app.use(errorHandler);
  return app;
}
