// ПРОВЕРКИ ПРАВ. Одна дверь.
//
// Пять дыр первой редакции жили именно здесь, и каждая воспроизводилась
// запуском её же кода:
//   администратор мог управлять сам собой (самобан, самопонижение);
//   заслона «последний администратор» не было вовсе;
//   забаненный администратор менял роли — canChangeRoleTo не смотрел ни бан,
//     ни активность, потому что эти проверки жили только в hasPermission,
//     а changeUserRole его не звал;
//   canChangeRoleTo(null, …) бросал TypeError вместо отказа;
//   модератор имел и право создавать коммиты, и право их рассматривать —
//     самоодобрение проходило штатным путём.

import { P, ROLES } from './roles.js';
import { Forbidden, Conflict } from '../http/errors.js';

export { Forbidden, Conflict };

/** Пригоден ли пользователь ДЕЙСТВОВАТЬ. Одна дверь для трёх условий. */
export function isUsable(user) {
  return Boolean(user) && user.isActive === true
      && user.isBanned === false && user.isDeleted !== true;
}

/**
 * Есть ли право. Гость — отсутствие пользователя, а не роль в базе.
 * Забаненный и деактивированный не имеют НИЧЕГО, включая права гостя:
 * бан должен быть строже, чем неизвестность.
 *
 * Спрашивается ГОТОВЫЙ набор, посчитанный преобразователем. Пересчитывать
 * его здесь значило бы завести второе место, где решается, что доступно
 * неподтверждённому или не заведшему двухшаговый вход.
 */
export function can(user, permission) {
  if (!user) return ROLES.guest.permissions.includes(permission);
  if (!isUsable(user)) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

export function assertCan(user, permission) {
  if (!can(user, permission)) {
    throw new Forbidden('Недостаточно прав для этого действия',
                        { requiredPermission: permission });
  }
}

/**
 * Может ли actor действовать НАД target.
 * Отказ на самого себя БЕЗУСЛОВЕН: всё, что человек делает с собой, идёт
 * отдельными ходами (сменить пароль, выйти, удалить свою запись) и через них
 * же проверяется.
 */
export function canActOn(actor, target) {
  if (!isUsable(actor) || !target) return false;
  if (actor.userId === target.userId) return false;
  if (target.isDeleted) return false;
  if (actor.role === 'administrator') return true;
  if (actor.role === 'moderator') return target.level <= ROLES.editor.level;
  return false;
}

export function assertCanActOn(actor, target) {
  if (!canActOn(actor, target)) {
    throw new Forbidden(actor && target && actor.userId === target.userId
      ? 'Это действие нельзя выполнить над собой'
      : 'Вы не можете управлять этим пользователем');
  }
}

/** Какое право нужно, чтобы двигать роль между двумя ступенями. */
export function permissionForRoleChange(fromRole, toRole) {
  const topLevel = Math.max(ROLES[fromRole].level, ROLES[toRole].level);
  if (topLevel >= ROLES.administrator.level) return P.MANAGE_ADMINS;
  if (topLevel >= ROLES.moderator.level)     return P.MANAGE_MODERATORS;
  return P.MANAGE_EDITORS;
}

export function assertCanChangeRole(actor, target, newRole) {
  if (!ROLES[newRole] || newRole === 'guest') {
    throw new Forbidden(`Такой роли не бывает: «${newRole}»`);
  }
  assertCanActOn(actor, target);
  if (target.role === newRole) {
    throw new Conflict('Роль уже такая — менять нечего');
  }
  assertCan(actor, permissionForRoleChange(target.role, newRole));
}

/**
 * Автор не рецензирует собственный коммит НИ ПРИ КАКОЙ роли.
 *
 * Прямая правка — не самоодобрение: обладатель права рассмотрения вправе
 * править граф напрямую, и тогда коммит записывается сразу применённым с
 * ПУСТЫМ рецензентом и отдельным действием журнала. Без этого различения
 * единственный администратор не смог бы изменить ничего.
 */
export function assertNotSelfReview(actor, commit) {
  if (actor && commit && actor.userId === commit.authorId) {
    throw new Forbidden('Собственный коммит рассматривает кто-то другой');
  }
}
