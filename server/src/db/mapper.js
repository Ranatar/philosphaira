// СЛОЙ ПРЕОБРАЗОВАНИЯ: строка базы → доменный объект.
//
// Единственное место, где пользователь становится пользователем. Половина
// дефектов первой редакции росла отсюда: verifyToken отдавал rows[0] со
// змеиными именами (is_banned, is_active), а PermissionChecker спрашивал
// верблюжьи (isBanned, isActive). Замер на том коде:
//
//   обычный редактор       VIEW_GRAPH: false | CREATE_COMMIT: false
//   ЗАБАНЕННЫЙ редактор    VIEW_GRAPH: false | CREATE_COMMIT: false
//   полупереведённый (isBanned потерян): CREATE_COMMIT: true  ← бан не проверен
//
// Ответ не зависел от состояния вовсе: !user.isActive истинно для любой
// строки базы. Отсюда же падали target.metadata.roleChangedAt и
// user.settings.emailNotifications — у плоской строки нет ни metadata, ни
// settings, и это TypeError, а не логическая ошибка.
//
// Права считаются ЗДЕСЬ И ОДИН РАЗ: роль задаёт потолок, состояние записи его
// срезает (неподтверждённая почта, незаведённый двухшаговый вход). Дальше их
// только спрашивают — ни застава, ни служба, ни интерфейс не пересчитывают.

/**
 * Громкий отказ вместо тихого undefined. Недостающее поле — это, как правило,
 * забытый столбец в SELECT, и узнать об этом надо ЗДЕСЬ, а не через три слоя
 * в виде «прав нет».
 */
function requireColumns(row, fieldNames, whose) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error(`${whose}: ожидалась строка базы, получено ${row}`);
  }
  const missing = fieldNames.filter(column => !(column in row));
  if (missing.length) {
    throw new Error(
      `${whose}: в строке базы нет полей: ${missing.join(', ')}. ` +
      'Скорее всего, SELECT их не забрал — преобразователь не угадывает.');
  }
  return row;
}

const USER_FIELDS = [
  'user_id', 'username', 'email', 'role',
  'is_active', 'is_banned', 'deleted_at',
  'email_verified_at', 'mfa_enabled',
];

import { ROLES, effectivePermissions } from '../access/roles.js';

const toIso = v => (v == null ? null
  : (v instanceof Date ? v.toISOString() : new Date(v).toISOString()));

/**
 * @param {object} строка   — то, что вернул SELECT * FROM users
 * @param {object} [кому]   — доменный пользователь, КОМУ показываем: от него
 *                            зависит видимость почты. null — гость.
 */
export function userFromRow(row, { кому: recipients = null } = {}) {
  requireColumns(row, USER_FIELDS, 'userFromRow');

  const spec = ROLES[row.role];
  if (!spec) throw new Error(`userFromRow: неизвестная роль «${row.role}»`);

  const emailVerified = row.email_verified_at != null;
  const mfaReady      = row.mfa_enabled === true;

  // Почту видят сам человек и сотрудники от модератора и выше.
  const isSelf = Boolean(recipients && recipients.userId === row.user_id);
  const canSeeMail = isSelf
    || Boolean(recipients && recipients.level >= ROLES.moderator.level);

  return Object.freeze({
    userId:   row.user_id,
    username: row.username,
    email:    canSeeMail ? row.email : undefined,
    role:     row.role,
    level:    spec.level,
    permissions: effectivePermissions({ role: row.role, emailVerified, mfaReady }),

    isActive:  row.is_active === true,
    isBanned:  row.is_banned === true,
    isDeleted: row.deleted_at != null,
    banReason: row.is_banned ? (row.ban_reason ?? null) : null,

    emailVerified,
    mfaReady,

    profile: Object.freeze({
      displayName:  row.display_name ?? null,
      avatarUrl:    row.avatar_url ?? null,
      bio:          row.bio ?? null,
      registeredAt: toIso(row.registered_at),
    }),
    settings: Object.freeze({
      language: row.language ?? 'ru',
      theme:    row.theme ?? 'dark',
    }),
  });
}

/** Как пользователь выглядит в ответе API. Второго вида объекта нет. */
export function userToApi(user) {
  const { userId, username, email, role, level, permissions, profile, settings,
          isActive, isBanned, banReason, emailVerified, mfaReady } = user;
  const outward = {
    userId, username, role, level, permissions, profile, settings,
    state: { isActive, isBanned, banReason, emailVerified, mfaReady },
  };
  if (email !== undefined) outward.email = email;
  return outward;
}

export { requireColumns };
