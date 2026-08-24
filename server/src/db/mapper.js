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
function требоватьПоля(строка, поля, чей) {
  if (!строка || typeof строка !== 'object' || Array.isArray(строка)) {
    throw new Error(`${чей}: ожидалась строка базы, получено ${строка}`);
  }
  const нет = поля.filter(п => !(п in строка));
  if (нет.length) {
    throw new Error(
      `${чей}: в строке базы нет полей: ${нет.join(', ')}. ` +
      'Скорее всего, SELECT их не забрал — преобразователь не угадывает.');
  }
  return строка;
}

const ПОЛЯ_ПОЛЬЗОВАТЕЛЯ = [
  'user_id', 'username', 'email', 'role',
  'is_active', 'is_banned', 'deleted_at',
  'email_verified_at', 'mfa_enabled',
];

import { ROLES, effectivePermissions } from '../access/roles.js';

const иso = v => (v == null ? null
  : (v instanceof Date ? v.toISOString() : new Date(v).toISOString()));

/**
 * @param {object} строка   — то, что вернул SELECT * FROM users
 * @param {object} [кому]   — доменный пользователь, КОМУ показываем: от него
 *                            зависит видимость почты. null — гость.
 */
export function userFromRow(строка, { кому = null } = {}) {
  требоватьПоля(строка, ПОЛЯ_ПОЛЬЗОВАТЕЛЯ, 'userFromRow');

  const spec = ROLES[строка.role];
  if (!spec) throw new Error(`userFromRow: неизвестная роль «${строка.role}»`);

  const emailVerified = строка.email_verified_at != null;
  const mfaReady      = строка.mfa_enabled === true;

  // Почту видят сам человек и сотрудники от модератора и выше.
  const сам = Boolean(кому && кому.userId === строка.user_id);
  const видитПочту = сам
    || Boolean(кому && кому.level >= ROLES.moderator.level);

  return Object.freeze({
    userId:   строка.user_id,
    username: строка.username,
    email:    видитПочту ? строка.email : undefined,
    role:     строка.role,
    level:    spec.level,
    permissions: effectivePermissions({ role: строка.role, emailVerified, mfaReady }),

    isActive:  строка.is_active === true,
    isBanned:  строка.is_banned === true,
    isDeleted: строка.deleted_at != null,
    banReason: строка.is_banned ? (строка.ban_reason ?? null) : null,

    emailVerified,
    mfaReady,

    profile: Object.freeze({
      displayName:  строка.display_name ?? null,
      avatarUrl:    строка.avatar_url ?? null,
      bio:          строка.bio ?? null,
      registeredAt: иso(строка.registered_at),
    }),
    settings: Object.freeze({
      language: строка.language ?? 'ru',
      theme:    строка.theme ?? 'dark',
    }),
  });
}

/** Как пользователь выглядит в ответе API. Второго вида объекта нет. */
export function userToApi(user) {
  const { userId, username, email, role, level, permissions, profile, settings,
          isActive, isBanned, banReason, emailVerified, mfaReady } = user;
  const наружу = {
    userId, username, role, level, permissions, profile, settings,
    state: { isActive, isBanned, banReason, emailVerified, mfaReady },
  };
  if (email !== undefined) наружу.email = email;
  return наружу;
}

export { требоватьПоля };
