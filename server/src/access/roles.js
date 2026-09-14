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

  // ЗАМЕРЫ — ТРИ ПРАВА, А НЕ ОДНО. Прежде все пять ходов службы замеров
  // спрашивали VIEW_GRAPH, то есть самое слабое право: записать и прочесть
  // чужие замеры мог любой вошедший, а удалить — никто, включая
  // администратора. Три действия здесь разной цены, и мерить их одной
  // меркой значило бы либо пустить всех всюду, либо закрыть всё разом.
  SAVE_OBSERVATION:          'save_observation',       // свои замеры
  VIEW_ALL_OBSERVATIONS:     'view_all_observations',  // и чужие тоже
  DELETE_OBSERVATION:        'delete_observation',

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

  // ПЕРЕКЛАДКА — ОТДЕЛЬНОЕ ПРАВО, а не часть SYSTEM_SETTINGS. Соблазн был:
  // и то и другое «администраторское». Но настройки меняют то, КАК работает
  // система, а перекладка — то, ЧТО люди видят глазами: после неё
  // пространственная память о графе перестаёт работать у всех сразу. Свести
  // их в одно имя значило бы дать этому имени два смысла — и однажды выдать
  // право на перекладку тому, кому хотели дать право на настройки.
  RELAYOUT_GRAPH:            'relayout_graph',
});

// approve_commit и reject_commit слиты в review_commit: разных прав у них не
// было ни в одной строке матрицы, а два имени на одно право — два места,
// где можно ошибиться.

const viewer    = [P.VIEW_GRAPH, P.VIEW_COMMIT_HISTORY];
const editor    = [...viewer, P.CREATE_COMMIT, P.SAVE_OBSERVATION,
                   P.EDIT_OWN_PENDING_COMMIT, P.DELETE_OWN_PENDING_COMMIT];
const moderator = [...editor, P.VIEW_PENDING_COMMITS, P.REVIEW_COMMIT,
                   P.REVERT_COMMIT, P.VIEW_USERS, P.MANAGE_EDITORS,
                   P.BAN_USER, P.VIEW_LOGS, P.VIEW_ALL_OBSERVATIONS];

// Права администратора ПЕРЕЧИСЛЕНЫ, а не собраны из Object.values(P).
// Иначе всякое будущее право достаётся ему молча — а решать, кому оно
// достаётся, должен человек, который это право вписывает.
const administrator = [...moderator, P.MANAGE_MODERATORS, P.MANAGE_ADMINS,
                       P.DELETE_USER, P.SYSTEM_SETTINGS, P.RELAYOUT_GRAPH,
                       P.DELETE_OBSERVATION];

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
  // Замер — запись с автором и родословной, живущая дольше сессии. Подписывать
  // её именем, которое никто не подтвердил, значит заводить историю от лица
  // неизвестно кого. Мерка та же, что у коммита.
  P.SAVE_OBSERVATION,
]);

export const NEEDS_MFA = Object.freeze([
  P.REVIEW_COMMIT, P.REVERT_COMMIT, P.BAN_USER,
  P.MANAGE_EDITORS, P.MANAGE_MODERATORS, P.MANAGE_ADMINS,
  P.DELETE_USER, P.SYSTEM_SETTINGS,
  // Удаление чужого замера неотменяемо и бьёт по чужой работе — мерка та же,
  // что у удаления учётной записи.
  P.DELETE_OBSERVATION,
  // Перекладка — по той же мерке, что откат коммита: действие редкое, видное
  // всем и трудно отменяемое ПО ВОСПРИЯТИЮ, даже когда отменяемо технически.
  P.RELAYOUT_GRAPH,
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
