// РОЛИ И ПРАВА. Единственный источник.
//
// В первой редакции документа иерархия ролей была записана ПЯТЬЮ способами:
// диаграммой, объектом RolePermissions, картой roleLevels, условиями внутри
// canChangeRoleTo и списком availableRoles в диалоге интерфейса. Три из пяти
// расходились между собой. Здесь она записана один раз, а матрица прав
// ПОРОЖДАЕТСЯ (permissionMatrix) и обязана сойтись с напечатанной — это
// проверяет проба, а не человек.

export const P = Object.freeze({
  VIEW_GRAPH:                'view_graph',
  VIEW_COMMIT_HISTORY:       'view_commit_history',

  CREATE_COMMIT:             'create_commit',
  EDIT_OWN_PENDING_COMMIT:   'edit_own_pending_commit',
  DELETE_OWN_PENDING_COMMIT: 'delete_own_pending_commit',

  VIEW_PENDING_COMMITS:      'view_pending_commits',
  REVIEW_COMMIT:             'review_commit',      // одобрить ИЛИ отклонить
  REVERT_COMMIT:             'revert_commit',
  VIEW_USERS:                'view_users',
  MANAGE_EDITORS:            'manage_editors',     // роли viewer ↔ editor
  BAN_USER:                  'ban_user',
  VIEW_LOGS:                 'view_logs',

  MANAGE_MODERATORS:         'manage_moderators',  // роли editor ↔ moderator
  MANAGE_ADMINS:             'manage_admins',      // любая ↔ administrator
  DELETE_USER:               'delete_user',
  SYSTEM_SETTINGS:           'system_settings',
});

// approve_commit и reject_commit слиты в review_commit: разных прав у них не
// было ни в одной строке матрицы, а два имени на одно право — два места,
// где можно ошибиться.

const viewer    = [P.VIEW_GRAPH, P.VIEW_COMMIT_HISTORY];
const editor    = [...viewer, P.CREATE_COMMIT,
                   P.EDIT_OWN_PENDING_COMMIT, P.DELETE_OWN_PENDING_COMMIT];
const moderator = [...editor, P.VIEW_PENDING_COMMITS, P.REVIEW_COMMIT,
                   P.REVERT_COMMIT, P.VIEW_USERS, P.MANAGE_EDITORS,
                   P.BAN_USER, P.VIEW_LOGS];

// Права администратора ПЕРЕЧИСЛЕНЫ, а не собраны из Object.values(P).
// Иначе всякое будущее право достаётся ему молча — а решать, кому оно
// достаётся, должен человек, который это право вписывает.
const administrator = [...moderator, P.MANAGE_MODERATORS, P.MANAGE_ADMINS,
                       P.DELETE_USER, P.SYSTEM_SETTINGS];

export const ROLES = Object.freeze({
  guest:         Object.freeze({ level: 0, permissions: Object.freeze([P.VIEW_GRAPH]) }),
  viewer:        Object.freeze({ level: 1, permissions: Object.freeze(viewer) }),
  editor:        Object.freeze({ level: 2, permissions: Object.freeze(editor) }),
  moderator:     Object.freeze({ level: 3, permissions: Object.freeze(moderator) }),
  administrator: Object.freeze({ level: 4, permissions: Object.freeze(administrator) }),
});

/** Роли, которые может носить запись в базе. Гость — отсутствие входа. */
export const REAL_ROLES = Object.freeze(
  Object.keys(ROLES).filter(r => r !== 'guest'));

/**
 * Права, которые НЕ выдаются, пока не выполнено условие. Держать их списком,
 * а не проверкой в каждой заставе, — то же правило «одно знание — одно место».
 */
export const NEEDS_VERIFIED_EMAIL = Object.freeze([
  P.CREATE_COMMIT, P.EDIT_OWN_PENDING_COMMIT, P.DELETE_OWN_PENDING_COMMIT,
]);

export const NEEDS_MFA = Object.freeze([
  P.REVIEW_COMMIT, P.REVERT_COMMIT, P.BAN_USER,
  P.MANAGE_EDITORS, P.MANAGE_MODERATORS, P.MANAGE_ADMINS,
  P.DELETE_USER, P.SYSTEM_SETTINGS,
]);

/**
 * ДЕЙСТВУЮЩИЙ набор прав: роль задаёт потолок, состояние записи его срезает.
 * Считается один раз — преобразователем, — и дальше только спрашивается.
 */
export function effectivePermissions({ role, emailVerified = false, mfaReady = false }) {
  const spec = ROLES[role];
  if (!spec) throw new Error(`effectivePermissions: неизвестная роль «${role}»`);
  return Object.freeze(spec.permissions.filter(право =>
       (emailVerified || !NEEDS_VERIFIED_EMAIL.includes(право))
    && (mfaReady      || !NEEDS_MFA.includes(право))));
}

/**
 * Роли, чей уровень не ниже данного. Нужна отбору получателей уведомлений:
 * «сотрудникам от модератора и выше» — это ЗДЕСЬ, а не второй список там.
 */
export function rolesAtLeast(level) {
  return REAL_ROLES.filter(роль => ROLES[роль].level >= level);
}

/** Матрица прав ПОРОЖДАЕТСЯ. Руками её больше не пишут: разойдётся. */
export function permissionMatrix() {
  const roleNames = Object.keys(ROLES);
  return Object.values(P).map(право => ({
    permission: право,
    ...Object.fromEntries(roleNames.map(decipher => [decipher, ROLES[decipher].permissions.includes(право)])),
  }));
}
