// УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ.
//
// Пар «повысить до редактора» / «понизить до зрителя» здесь нет: в первой
// редакции это была та же changeUserRole под другими именами, причём
// promoteToModerator вдобавок проверял роль отдельным способом — то есть
// давал второй ответ на тот же вопрос. Один ход — одно имя.
//
// Три отличия от первой редакции, каждое за дефект:
//   объект пользователя НЕ правится руками после COMMIT (там стояло
//     target.metadata.roleChangedAt = … на плоской строке — падение);
//     свежее состояние ПЕРЕЧИТЫВАЕТСЯ;
//   бан и снятие сессий идут ОДНОЙ транзакцией (там — двумя запросами
//     подряд, и падение между ними оставляло забаненного с живой сессией);
//   причина обязательна НА СЕРВЕРЕ (там требование жило в disabled кнопки).
//
// Уведомления (беседа 3.1) складываются в исходящие ТОЙ ЖЕ транзакцией и
// отсюда не отправляются: падение почты не должно отменять совершённого.

import { withTransaction } from '../db/tx.js';
import { paginate } from '../db/paginate.js';
import { userFromRow } from '../db/mapper.js';
import { findByIdForUpdate, updateRole, writeRoleHistory, setBan, clearBan,
         softDelete, audit } from '../db/users.js';
import { revokeAllSessions } from '../db/sessions.js';
import { assertNotLastAdministrator } from '../access/last-admin.js';
import { assertCan, assertCanActOn, assertCanChangeRole,
         permissionForRoleChange, can } from '../access/access.js';
import { P, ROLES, REAL_ROLES } from '../access/roles.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { Forbidden, Conflict, NotFound } from '../http/errors.js';

const requireReason = (причина, чего) => {
  if (!причина || !String(причина).trim()) {
    throw new Forbidden(`Причина ${чего} обязательна`);
  }
};

export async function changeUserRole(pool, { actor, targetUserId, newRole, reason, ip = null }) {
  requireReason(reason, 'изменения роли');

  return withTransaction(pool, async client => {
    const target = await findByIdForUpdate(client, targetUserId);
    if (!target) throw new NotFound('Пользователь не найден');

    const oldRole = target.role;
    assertCanChangeRole(actor, target, newRole);
    if (oldRole === 'administrator') {
      await assertNotLastAdministrator(client, { userId: targetUserId, newRole });
    }

    await updateRole(client, { userId: targetUserId, newRole, actorId: actor.userId });
    await writeRoleHistory(client,
      { userId: targetUserId, oldRole, newRole, actorId: actor.userId, reason });

    // Понижение снимает сессии: право, которого больше нет, не должно
    // доживать в открытой вкладке до следующего запроса.
    if (ROLES[newRole].level < ROLES[oldRole].level) {
      await revokeAllSessions(client, targetUserId);
    }

    await audit(client, { actorId: actor.userId, action: 'user.role_change',
                          subjectType: 'user', subjectId: targetUserId,
                          payload: { oldRole, newRole, reason }, ip });

    const payload = { userId: targetUserId, username: target.username,
                     oldRole, newRole, changedByName: actor.username, reason };
    await notify(client, N.ROLE_CHANGED, payload);
    await notify(client,
      ROLES[newRole].level > ROLES[oldRole].level ? N.USER_PROMOTED : N.USER_DEMOTED,
      payload);

    return findByIdForUpdate(client, targetUserId);   // свежее, а не правленое
  });
}

export async function banUser(pool, { actor, targetUserId, reason, ip = null }) {
  requireReason(reason, 'бана');

  return withTransaction(pool, async client => {
    const target = await findByIdForUpdate(client, targetUserId);
    if (!target) throw new NotFound('Пользователь не найден');

    assertCan(actor, P.BAN_USER);
    assertCanActOn(actor, target);          // в том числе: не себя
    if (target.isBanned) throw new Conflict('Пользователь уже забанен');
    if (target.role === 'administrator') {
      await assertNotLastAdministrator(client, { userId: targetUserId });
    }

    await setBan(client, { userId: targetUserId, reason, actorId: actor.userId });
    await revokeAllSessions(client, targetUserId);   // В ТОЙ ЖЕ транзакции

    await audit(client, { actorId: actor.userId, action: 'user.ban',
                          subjectType: 'user', subjectId: targetUserId,
                          payload: { reason }, ip });
    await notify(client, N.USER_BANNED, { userId: targetUserId,
      username: target.username, reason, bannedByName: actor.username });
    return { ok: true };
  });
}

export async function unbanUser(pool, { actor, targetUserId, ip = null }) {
  return withTransaction(pool, async client => {
    const target = await findByIdForUpdate(client, targetUserId);
    if (!target) throw new NotFound('Пользователь не найден');

    assertCan(actor, P.BAN_USER);
    // Первая редакция здесь НЕ проверяла отношения вовсе: модератор мог снять
    // бан с администратора, которого забанил администратор.
    assertCanActOn(actor, target);
    if (!target.isBanned) throw new Conflict('Пользователь не забанен');

    await clearBan(client, targetUserId);
    await audit(client, { actorId: actor.userId, action: 'user.unban',
                          subjectType: 'user', subjectId: targetUserId, ip });
    await notify(client, N.USER_UNBANNED, { userId: targetUserId,
      username: target.username, unbannedByName: actor.username });
    return { ok: true };
  });
}

export async function deleteUser(pool, { actor, targetUserId, ip = null }) {
  return withTransaction(pool, async client => {
    const target = await findByIdForUpdate(client, targetUserId);
    if (!target) throw new NotFound('Пользователь не найден');

    assertCan(actor, P.DELETE_USER);
    assertCanActOn(actor, target);
    await assertNotLastAdministrator(client, { userId: targetUserId });

    await softDelete(client, targetUserId);
    await revokeAllSessions(client, targetUserId);

    await audit(client, { actorId: actor.userId, action: 'user.delete',
                          subjectType: 'user', subjectId: targetUserId,
                          payload: { username: target.username }, ip });
    return { ok: true };
  });
}

export async function listUsers(pool, { actor, role, isBanned, query,
                                        page = 1, limit = 20 }) {
  assertCan(actor, P.VIEW_USERS);      // НЕ VIEW_LOGS: это разные права

  const where = ['u.deleted_at IS NULL'];
  const params = [];
  const push = (сборка, значение) => {
    params.push(значение); where.push(сборка(params.length));
  };
  if (role !== undefined)     push(i => `u.role = $${i}::user_role`, role);
  if (isBanned !== undefined) push(i => `u.is_banned = $${i}`, isBanned);
  if (query) push(i => `(u.username ILIKE $${i} OR u.email ILIKE $${i})`, `%${query}%`);

  return paginate(pool, {
    from: 'users u', select: 'u.*', where, params,
    order: 'u.registered_at DESC', page, limit,
    map: строка => userFromRow(строка, { кому: actor }),
  });
}

/**
 * Какие роли ЭТОТ актор может назначить ЭТОМУ человеку.
 * Считается тем же кодом, что и проверяет: интерфейс не вычисляет список
 * сам — в первой редакции он был четвёртым местом, где записана иерархия.
 */
export function allowedRoles(actor, target) {
  if (!actor || !target) return [];
  return REAL_ROLES.filter(роль => {
    if (роль === target.role) return false;
    try { assertCanActOn(actor, target); } catch { return false; }
    return can(actor, permissionForRoleChange(target.role, роль));
  });
}
