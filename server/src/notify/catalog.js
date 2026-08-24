// ОПИСЬ ТИПОВ УВЕДОМЛЕНИЙ.
//
// В первой редакции документа получателей считали ПРАВИЛАМИ ПО РОЛЯМ:
// четыре функции (viewerNotifications, editorNotifications, …), каждая со
// списком типов и отдельными проверками «своё ли это». Одна и та же мысль
// была записана в трёх местах по-разному и дала три разных исхода:
//   у viewer она ТЕКЛА — уведомление о ЧУЖОЙ смене роли приходило всем;
//   у editor и moderator работала, но делала запись в их списках
//     недостижимой;
//   у administrator её просто не было — о смене СОБСТВЕННОЙ роли он не
//     узнавал вовсе.
//
// Правил по ролям здесь нет. У каждого типа есть опись, и в ней сказано,
// КОМУ он адресован. Роль получателя участвует лишь постольку, поскольку
// опись говорит «сотрудникам такого-то уровня».

import { ROLES } from '../access/roles.js';

export const N = Object.freeze({
  GRAPH_CHANGED:      'graph_changed',
  COMMIT_APPROVED:    'commit_approved',
  COMMIT_REJECTED:    'commit_rejected',
  COMMIT_CONFLICTED:  'commit_conflicted',
  COMMIT_COINCIDED:   'commit_coincided',
  NEW_COMMIT_PENDING: 'new_commit_pending',
  ROLE_CHANGED:       'role_changed',
  USER_PROMOTED:      'user_promoted',
  USER_DEMOTED:       'user_demoted',
  USER_BANNED:        'user_banned',
  USER_UNBANNED:      'user_unbanned',
});

// Категории — то, что человек может отключить у себя. mandatory отключить
// нельзя: о собственном положении сообщают всегда.
export const CATEGORIES = Object.freeze({
  graphChanges: { title: 'Изменения графа',    mandatory: false },
  commitStatus: { title: 'Судьба моих правок', mandatory: false },
  moderation:   { title: 'Модерация',          mandatory: false },
  roleChanges:  { title: 'Моё положение',      mandatory: true  },
});

/**
 * Адресат задаётся ОПИСЬЮ, а не ролью получателя:
 *   author     — data.authorId
 *   subject    — data.userId (тот, о ком событие)
 *   staff      — действующие пользователи с уровнем не ниже minLevel
 *   everyone   — широковещание
 */
export const CATALOG = Object.freeze({
  [N.GRAPH_CHANGED]: {
    audience: { kind: 'everyone' },
    category: 'graphChanges', priority: 'low', broadcast: true,
  },
  [N.COMMIT_APPROVED]: {
    audience: { kind: 'author' }, category: 'commitStatus', priority: 'normal',
  },
  [N.COMMIT_REJECTED]: {
    audience: { kind: 'author' }, category: 'commitStatus', priority: 'high',
  },
  [N.COMMIT_CONFLICTED]: {
    audience: { kind: 'author' }, category: 'commitStatus', priority: 'high',
  },
  // «То же самое уже внесли». Не отказ и не одобрение — отдельное известие,
  // иначе труд человека выглядел бы как ошибка.
  [N.COMMIT_COINCIDED]: {
    audience: { kind: 'author' }, category: 'commitStatus', priority: 'low',
  },
  [N.NEW_COMMIT_PENDING]: {
    audience: { kind: 'staff', minLevel: ROLES.moderator.level },
    category: 'moderation', priority: 'normal',
  },
  [N.ROLE_CHANGED]: {
    audience: { kind: 'subject' }, category: 'roleChanges', priority: 'high',
  },
  // Повышение и понижение заменили четыре прежних типа (new_editor,
  // editor_removed, new_moderator, moderator_removed), из которых два не
  // создавались никогда. Кому сообщать — зависит от СТУПЕНИ, а не от имени
  // типа: о новом модераторе знают администраторы, о новом редакторе —
  // модераторы и выше.
  [N.USER_PROMOTED]: {
    audience: { kind: 'staff', minLevelFrom: 'peerLevel' },
    category: 'moderation', priority: 'normal',
  },
  [N.USER_DEMOTED]: {
    audience: { kind: 'staff', minLevelFrom: 'peerLevel' },
    category: 'moderation', priority: 'normal',
  },
  [N.USER_BANNED]: {
    audience: { kind: 'staff', minLevel: ROLES.moderator.level },
    category: 'moderation', priority: 'normal',
  },
  [N.USER_UNBANNED]: {
    audience: { kind: 'staff', minLevel: ROLES.moderator.level },
    category: 'moderation', priority: 'low',
  },
});

/** Уровень, начиная с которого сообщают о движении по ступени. */
export function peerLevel(data) {
  const верх = Math.max(ROLES[data?.oldRole]?.level ?? 0,
                        ROLES[data?.newRole]?.level ?? 0);
  return верх >= ROLES.moderator.level ? ROLES.administrator.level
                                       : ROLES.moderator.level;
}
