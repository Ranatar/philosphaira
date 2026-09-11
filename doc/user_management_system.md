# Система пользователей, прав и уведомлений

**Редакция 3, 22 августа 2026 — ПО ФАКТУ ПОСТРОЕННОГО.** Редакции 2 и 2.1
описывали замысел; эта описывает сделанное. Фазы 0–4 плана пройдены: сервер
и клиент написаны, приёмка стоит и зелена — 16 слоёв на сервере, 13 приборов
и полный обход на приложении. Что разошлось с замыслом и почему — сказано
в новом разделе «Чем построенное разошлось с этим документом»; вычитывать
документ, не читая его, больше не надо.

**Редакция 2.1, 21 августа 2026.** Первая редакция (декабрь 2025) переработана
целиком: устройство прав и уведомлений переписано, а не подправлено. Ниже — что
именно было не так и почему лечение оказалось перестройкой, а не заплатой.

*Что 2.1 добавила к редакции 2 (шесть принятых решений):* столкновения
разбираются **по полям и трёхсторонним сравнением**, а не версией на всю
сущность, — «правили одинаково» и «правили по-разному» теперь различаются
(раздел 6); подтверждение почты требуется для создания коммитов, а двухшаговый
вход — для действий над пользователями, и оба ограничения живут в одном месте,
где вычисляется набор прав (разделы 5 и 11); аватары по умолчанию порождаются
из идентификатора, загрузка описана отдельно (раздел 11); перенос семи JSON
получил четыре нерешённых вопроса вместо одной строки «описан схемой»
(раздел 6); показатели пользователя — с оговоркой о материализации и сверке
(раздел 14).

## Оглавление

1. [Что было не так в первой редакции](#что-было-не-так-в-первой-редакции)
2. [Договорённости, на которых держится всё остальное](#договорённости-на-которых-держится-всё-остальное)
3. [База пользователей](#база-пользователей)
4. [Слой преобразования: строка БД → доменный объект](#слой-преобразования-строка-бд--доменный-объект)
5. [Роли и права](#роли-и-права)
6. [Коммиты: договор, нужный правам и уведомлениям](#коммиты-договор-нужный-правам-и-уведомлениям)
7. [Уведомления](#уведомления)
8. [Управление пользователями](#управление-пользователями)
9. [API](#api)
10. [Интерфейсы](#интерфейсы)
11. [Безопасность](#безопасность)
12. [Чем это стережётся: пробы](#чем-это-стережётся-пробы)
13. [Как это прикладывается к ΦilosΦaira](#как-это-прикладывается-к-φilosφaira)
14. [Что осталось нерешённым](#что-осталось-нерешённым)

---

## Что было не так в первой редакции

Дефекты показаны не рассуждением, а запуском: блоки `Permissions` и
`NotificationRules` вырезаны из документа **дословно** в исполняемый модуль и
прогнаны пробами. Из тринадцати утверждений не сошлось десять.

| # | Что | Чем лечится здесь |
|---|---|---|
| 1 | `verifyToken` отдаёт строку БД (`is_banned`), `hasPermission` спрашивает `isBanned` — ответ не зависел от состояния пользователя вовсе | раздел 4: единственное место, где строка становится объектом; чтение `rows[0]` где-либо ещё запрещено |
| 2 | администратор мог управлять сам собой: самобан, самопонижение | `canActOn` отказывает на `actor.id === target.id` всегда |
| 3 | не было заслона «последний администратор» | `assertNotLastAdministrator`, проверка внутри транзакции |
| 4 | забаненный администратор менял роли: `canChangeRoleTo` не смотрел ни бан, ни активность | все проверки идут через одну дверь `can()`, которая смотрит состояние первой |
| 5 | `canChangeRoleTo(null, …)` бросал `TypeError` вместо отказа | явная проверка и громкий, но правильный отказ |
| 6 | модератор имел `CREATE_COMMIT` и `APPROVE_COMMIT` разом — самоодобрение | `assertNotSelfReview`: автор коммита не может быть его рецензентом ни при какой роли |
| 7 | 10 прав из 16 объявлены и ни разу не спрошены | проба «каждое право хоть раз спрашивается» входит в приёмку |
| 8 | `getUserList` спрашивал `VIEW_LOGS` — право на журнал вместо права на список | `VIEW_USERS` заведено отдельно |
| 9 | иерархия ролей записана пятью способами (диаграмма, `RolePermissions`, `roleLevels`, `canChangeRoleTo`, `availableRoles` в диалоге) | один `ROLES`; матрица прав, уровни и списки в интерфейсе **порождаются** из него |
| 10 | `viewer` получал уведомление о ЧУЖОЙ смене роли: тип был и в списке, и в отдельной проверке — список побеждал | правил по ролям больше нет вовсе; получателей считает одна функция по описи типов |
| 11 | у `editor` и `moderator` та же мысль давала обратный итог, а запись в их списках была недостижима | то же |
| 12 | администратору о смене его роли не сообщали (ветки не было) | адресат «сам предмет события» задан в описи типа, а не в правилах роли |
| 13 | 4 типа из 13 мертвы: `user_promoted`, `user_demoted`, `user_banned`, `user_unbanned` | либо у типа есть отправитель, либо типа нет; проба стережёт |
| 14 | два пути создания уведомлений с разными правилами: широковещание спрашивало правила, адресная отправка — нет | путь один: `notify(type, data)`; получателей считает опись |
| 15 | два источника правды о почте: `users.email_notifications` и `notification_preferences` | колонки из `users` убраны; настройки только в своей таблице |
| 16 | колонки настроек по видам (`graph_changes`, …) не читал никто | у каждого типа есть `category`, и она сверяется с настройками |
| 17 | `token_hash` не сверялся никогда (искали по `user_id`) — отзыв сессии не работал | вход по хешу токена, `UNIQUE`, поиск индексом |
| 18 | `bcrypt` по JWT: обрезка на 72 байтах и невозможность искать индексом | SHA-256 по непрозрачному токену |
| 19 | `register` не создавал сессию, а `verifyToken` её требовал — токен был невалиден с первой секунды | регистрация и вход выдают сессию одним и тем же ходом |
| 20 | `login` сообщал о бане до проверки пароля — утечка по чужому email | сначала пароль, потом состояние; при неизвестном email сверка с холостым хешем |
| 21 | письма собирались подстановкой в HTML без экранирования — в разделе, обещающем защиту от XSS | `esc()` на каждой подстановке, плюс текстовая часть письма |
| 22 | `xss-clean` заброшен автором | убран; экранирование при выводе, `helmet` с явной CSP |
| 23 | токен в `localStorage` | httpOnly-cookie + двойная отправка против CSRF |
| 24 | `db.query(…, { transaction })` через общий пул транзакции не даёт | `withTransaction(fn)` выдаёт `client`; вне его транзакционные запросы не пишутся |
| 25 | `banUser` вне транзакции: бан и снятие сессий раздельно | одна транзакция |
| 26 | уведомления слались изнутри запроса; падение почты роняло уже совершённое действие | таблица исходящих (`outbox`) пишется в той же транзакции, доставляет работник |
| 27 | `GRAPH_CHANGED` — письмо каждому активному на каждый коммит, последовательным `await` по `SELECT *` | сводка: одно письмо в час на человека, доставка порциями |
| 28 | WebSocket: `Map userId → ws` — второе устройство молча выбивало первое | `Map userId → Set<ws>`; аутентификация при рукопожатии; ping/pong; `JSON.parse` под защитой |
| 29 | клиентские `fetch` нигде не слали `Authorization` — `/api/users/me` вернул бы 401 | один `api()` на весь клиент, cookie идут сами, CSRF-заголовок ставится там же |
| 30 | пагинация обещана в API и не написана; панель ждала массив там, где обещан объект | `paginate()` и один вид ответа |
| 31 | `stats.*` обещаны в структуре и отсутствуют в схеме | представление `user_stats`, считаемое из коммитов |
| 32 | `ON DELETE` только у уведомлений при объявленном праве `DELETE_USER` | удаление пользователя мягкое; внешние ключи расписаны поимённо |
| 33 | `VIEW_LOGS` есть, а журнала нет | таблица `audit_log`, запись в той же транзакции, что и действие |
| 34 | `expiresAt` — 7 дней в примере, 30 в коде | одно место, `NOTIFICATION_TTL_DAYS` |
| 35 | типы коммитов без удаления при заявленном `REVERT_COMMIT` | полный список из четырёх действий на пять родов сущностей |
| 36 | столкновения двух правок одной сущности не решались вовсе | `baseVersion` у сущности, отказ при расхождении, разбор при слиянии |

Ещё одно замечание, не дефект, но обещание не по делу: «гранулярный контроль
доступа» в заключении первой редакции. Права не гранулярны — они выдаются
пакетом по роли. Здесь так и написано; гранулярность, если она понадобится,
будет отдельной работой, а не словом в выводах.

---

## Договорённости, на которых держится всё остальное

Четыре правила. Каждое куплено дефектом из таблицы выше, и почти каждое —
повторение того, что проект уже усвоил на графе.

**1. Одно знание — одно место.** Уровни ролей, состав прав, список получателей
уведомления, срок жизни уведомления, вид ответа API — у каждого ровно один дом.
Матрица прав в этом документе не написана руками: она **порождается** из
`ROLES` (раздел 5) и обязана сойтись с ним по пробе. Первая редакция держала
иерархию ролей в пяти местах, и три из них расходились.

**2. Прибор не пересказывает правило — он его спрашивает.** Интерфейс не
вычисляет права заново: он спрашивает у сервера, что можно, и рисует по ответу.
Проба не повторяет условие отбора получателей, а зовёт ту же функцию, что и
служба.

**3. Отказ должен быть громким.** Слой преобразования падает на отсутствующем
поле, а не подставляет `undefined`; шина уведомлений падает на неизвестном типе,
а не молчит; отправка на тип без описи — ошибка. Все три случая в первой
редакции отказывали молча, и молчание стоило дороже поломки.

**4. Право проверяется на сервере, интерфейс лишь показывает.** Всякая проверка
в React — про то, рисовать ли кнопку. Ни одно решение не принимается там.

---

## База пользователей

Источник правды — схема БД. Вид пользователя в JSON, который отдаёт API, —
**проекция** этой схемы, и строит его один преобразователь (раздел 4). Первая
редакция описывала два вида врозь, и они разошлись: `stats.*` были обещаны
структурой, читались интерфейсом и не существовали в схеме.

### Схема

```sql
-- Роли храним типом, а не строкой с CHECK: список ролей — предмет, а не
-- случайное значение поля, и порядок в типе задаёт старшинство.
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'moderator', 'administrator');

CREATE TABLE users (
  user_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username          VARCHAR(50)  NOT NULL,
  email             VARCHAR(255) NOT NULL,
  password_hash     TEXT         NOT NULL,
  role              user_role    NOT NULL DEFAULT 'viewer',

  display_name      VARCHAR(100),
  avatar_url        TEXT,
  bio               TEXT,
  language          VARCHAR(5)   NOT NULL DEFAULT 'ru',
  theme             VARCHAR(10)  NOT NULL DEFAULT 'dark',

  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  is_banned         BOOLEAN      NOT NULL DEFAULT FALSE,
  ban_reason        TEXT,
  banned_at         TIMESTAMPTZ,
  banned_by         UUID,

  email_verified_at TIMESTAMPTZ,

  registered_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by        UUID,                  -- NULL означает «заведён системой»
  role_changed_at   TIMESTAMPTZ,
  role_changed_by   UUID,

  -- Мягкое удаление: у коммитов есть автор, и он обязан остаться названным.
  deleted_at        TIMESTAMPTZ,

  CONSTRAINT users_ban_reason_ck
    CHECK (is_banned = FALSE OR ban_reason IS NOT NULL),
  CONSTRAINT users_created_by_fk
    FOREIGN KEY (created_by)  REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT users_banned_by_fk
    FOREIGN KEY (banned_by)   REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT users_role_changed_by_fk
    FOREIGN KEY (role_changed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Единственность — с оглядкой на мягкое удаление и на регистр.
CREATE UNIQUE INDEX users_email_uq    ON users (lower(email))    WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX users_username_uq ON users (lower(username)) WHERE deleted_at IS NULL;
CREATE INDEX users_role_idx   ON users (role)   WHERE deleted_at IS NULL;
CREATE INDEX users_active_idx ON users (is_active) WHERE is_active AND NOT is_banned AND deleted_at IS NULL;

-- Заслон «последний администратор» держится не только кодом.
-- Частичный уникальный индекс тут не годится (он запрещал бы второго админа),
-- поэтому счёт проверяется в транзакции; см. assertNotLastAdministrator.

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_touch BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

```sql
-- История ролей: и журнал, и источник для «кто кого назначил».
CREATE TABLE role_history (
  history_id  BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  old_role    user_role,
  new_role    user_role NOT NULL,
  changed_by  UUID REFERENCES users(user_id) ON DELETE SET NULL,
  reason      TEXT NOT NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX role_history_user_idx ON role_history (user_id, changed_at DESC);

-- Журнал действий. Право VIEW_LOGS в первой редакции существовало без журнала.
CREATE TABLE audit_log (
  entry_id    BIGSERIAL PRIMARY KEY,
  actor_id    UUID REFERENCES users(user_id) ON DELETE SET NULL,
  action      VARCHAR(64) NOT NULL,        -- 'user.ban', 'commit.approve', …
  subject_type VARCHAR(32),                -- 'user' | 'commit' | 'concept' | …
  subject_id  TEXT,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX audit_actor_idx   ON audit_log (actor_id, created_at DESC);
CREATE INDEX audit_subject_idx ON audit_log (subject_type, subject_id, created_at DESC);

-- Сессии. Токен непрозрачный, хранится ХЕШЕМ, ищется по хешу.
CREATE TABLE user_sessions (
  session_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_sha256  BYTEA NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);
CREATE UNIQUE INDEX sessions_token_uq   ON user_sessions (token_sha256);
CREATE INDEX sessions_user_idx    ON user_sessions (user_id) WHERE revoked_at IS NULL;
CREATE INDEX sessions_expires_idx ON user_sessions (expires_at) WHERE revoked_at IS NULL;

-- Показатели пользователя — ПРЕДСТАВЛЕНИЕ, а не колонки: иначе появится
-- второй источник правды о числе коммитов, и он разойдётся с первым.
CREATE VIEW user_stats AS
SELECT u.user_id,
       count(*) FILTER (WHERE c.status IS NOT NULL)   AS commits_created,
       count(*) FILTER (WHERE c.status = 'applied')   AS commits_approved,
       count(*) FILTER (WHERE c.status = 'rejected')  AS commits_rejected,
       max(c.created_at)                              AS last_commit_at
FROM users u LEFT JOIN commits c ON c.author_id = u.user_id
GROUP BY u.user_id;
```

### Вид, который отдаёт API

```json
{
  "userId": "8f14e45f-ceea-467a-9f0a-1b2c3d4e5f60",
  "username": "ivan_petrov",
  "email": "ivan@example.com",
  "role": "viewer",
  "level": 1,
  "profile": {
    "displayName": "Иван Петров",
    "avatarUrl": null,
    "bio": "Интересуюсь философией Канта",
    "registeredAt": "2026-01-15T10:00:00Z",
    "emailVerified": true
  },
  "settings": { "language": "ru", "theme": "dark" },
  "state": { "isActive": true, "isBanned": false, "banReason": null },
  "stats": { "commitsCreated": 15, "commitsApproved": 12, "commitsRejected": 3,
             "lastCommitAt": "2026-08-19T18:20:00Z" },
  "permissions": ["view_graph", "view_commit_history"]
}
```

Три вещи, которых в первой редакции не было и которые здесь существенны.
`level` и `permissions` отдаются **сервером**, чтобы интерфейс не вычислял права
заново (договорённость 2). `email` виден только себе, модератору и
администратору — отбор делает тот же преобразователь. Пароля, хеша пароля и
внутренних меток в проекции нет ни в каком виде.
---

## Слой преобразования: строка БД → доменный объект

Половина дефектов первой редакции росла из одного корня: `verifyToken` клал в
`req.user` строку `rows[0]` со змеиными именами, а `PermissionChecker` спрашивал
верблюжьи. Замер на коде первой редакции:

```
обычный редактор       VIEW_GRAPH: false | CREATE_COMMIT: false
ЗАБАНЕННЫЙ редактор    VIEW_GRAPH: false | CREATE_COMMIT: false
полупереведённый (isBanned потерян): CREATE_COMMIT: true  ← бан не проверен
```

Ответ не зависел от состояния пользователя вовсе: `!user.isActive` истинно для
любой строки БД, поэтому запрещалось всё; а стоило написать частичный перевод —
и бан переставал проверяться. Отсюда же падали `target.metadata.roleChangedAt` и
`user.settings.emailNotifications`: у плоской строки нет ни `metadata`, ни
`settings`.

**Правило: `rows[0]` не покидает `server/db/`.** Всё, что выходит наружу, прошло
через преобразователь; всё, что входит в службы, — доменный объект. Проверяется
пробой (раздел 12) и заслоном в самом преобразователе.

```js
// server/db/mapper.js
import { ROLES, effectivePermissions } from '../access/roles.js';

// Громкий отказ вместо тихого undefined. Недостающее поле — это, как правило,
// забытый столбец в SELECT, и узнать об этом надо здесь, а не через три слоя
// в виде «прав нет».
function requireFields(row, fields, what) {
  if (!row || typeof row !== 'object') {
    throw new Error(`${what}: ожидалась строка БД, получено ${row}`);
  }
  const missing = fields.filter(f => !(f in row));
  if (missing.length) {
    throw new Error(
      `${what}: в строке БД нет полей: ${missing.join(', ')}. ` +
      `Скорее всего, SELECT не забрал их — преобразователь не угадывает.`);
  }
  return row;
}

const USER_FIELDS = ['user_id', 'username', 'email', 'role',
                     'is_active', 'is_banned', 'deleted_at',
                     'email_verified_at', 'mfa_enabled'];

/**
 * Единственное место, где пользователь становится пользователем.
 * viewer — тот, КОМУ показываем: от него зависит видимость почты.
 */
export function userFromRow(row, { viewer = null, stats = null } = {}) {
  requireFields(row, USER_FIELDS, 'userFromRow');

  const role  = row.role;
  const spec  = ROLES[role];
  if (!spec) throw new Error(`userFromRow: неизвестная роль «${role}»`);

  const emailVerified = row.email_verified_at != null;
  const mfaReady      = row.mfa_enabled === true;

  const self      = viewer && viewer.userId === row.user_id;
  const staff     = viewer && viewer.level >= ROLES.moderator.level;
  const seeEmail  = Boolean(self || staff);

  return Object.freeze({
    userId:   row.user_id,
    username: row.username,
    email:    seeEmail ? row.email : undefined,
    role,
    level:    spec.level,
    // Не spec.permissions, а ДЕЙСТВУЮЩИЙ набор: роль минус то, что срезано
    // неподтверждённой почтой и незаведённым двухшаговым входом.
    permissions: effectivePermissions({ role, emailVerified, mfaReady }),
    emailVerified,
    mfaReady,

    isActive:  row.is_active === true,
    isBanned:  row.is_banned === true,
    isDeleted: row.deleted_at != null,
    banReason: row.is_banned ? (row.ban_reason ?? null) : null,

    profile: Object.freeze({
      displayName:   row.display_name ?? null,
      avatarUrl:     row.avatar_url ?? null,
      bio:           row.bio ?? null,
      registeredAt:  iso(row.registered_at),
      emailVerified,
    }),
    settings: Object.freeze({
      language: row.language ?? 'ru',
      theme:    row.theme ?? 'dark',
    }),
    stats: stats ? Object.freeze({
      commitsCreated:  Number(stats.commits_created  ?? 0),
      commitsApproved: Number(stats.commits_approved ?? 0),
      commitsRejected: Number(stats.commits_rejected ?? 0),
      lastCommitAt:    iso(stats.last_commit_at),
    }) : null,
  });
}

/** Как пользователь выглядит в ответе API: тем же преобразователем, без второго вида. */
export function userToApi(user) {
  const { userId, username, email, role, level, permissions,
          profile, settings, stats, isActive, isBanned, banReason } = user;
  const out = { userId, username, role, level, permissions, profile, settings, stats,
                state: { isActive, isBanned, banReason } };
  if (email !== undefined) out.email = email;
  return out;
}

const iso = v => (v == null ? null
  : (v instanceof Date ? v.toISOString() : new Date(v).toISOString()));
```

Тот же приём — для коммитов и уведомлений: `commitFromRow`, `notificationFromRow`
лежат рядом и подчиняются тому же правилу. Отдельного вида «структура коммита в
JSON» больше нет: он порождается преобразователем.

---

## Роли и права

### Один источник

```js
// server/access/roles.js

export const P = {
  VIEW_GRAPH:               'view_graph',
  VIEW_COMMIT_HISTORY:      'view_commit_history',

  CREATE_COMMIT:            'create_commit',
  EDIT_OWN_PENDING_COMMIT:  'edit_own_pending_commit',
  DELETE_OWN_PENDING_COMMIT:'delete_own_pending_commit',

  VIEW_PENDING_COMMITS:     'view_pending_commits',
  REVIEW_COMMIT:            'review_commit',      // одобрить ИЛИ отклонить
  REVERT_COMMIT:            'revert_commit',
  VIEW_USERS:               'view_users',
  MANAGE_EDITORS:           'manage_editors',     // роли viewer ↔ editor
  BAN_USER:                 'ban_user',
  VIEW_LOGS:                'view_logs',

  MANAGE_MODERATORS:        'manage_moderators',  // роли editor ↔ moderator
  MANAGE_ADMINS:            'manage_admins',      // любая ↔ administrator
  DELETE_USER:              'delete_user',
  SYSTEM_SETTINGS:          'system_settings',
};

const viewer    = [P.VIEW_GRAPH, P.VIEW_COMMIT_HISTORY];
const editor    = [...viewer, P.CREATE_COMMIT,
                   P.EDIT_OWN_PENDING_COMMIT, P.DELETE_OWN_PENDING_COMMIT];
const moderator = [...editor, P.VIEW_PENDING_COMMITS, P.REVIEW_COMMIT,
                   P.REVERT_COMMIT, P.VIEW_USERS, P.MANAGE_EDITORS,
                   P.BAN_USER, P.VIEW_LOGS];

// Права администратора ПЕРЕЧИСЛЕНЫ, а не собраны из Object.values(P).
// Иначе всякое будущее право достаётся ему молча — а решать, кому оно
// достаётся, должен человек, вписывающий право.
const administrator = [...moderator, P.MANAGE_MODERATORS, P.MANAGE_ADMINS,
                       P.DELETE_USER, P.SYSTEM_SETTINGS];

export const ROLES = Object.freeze({
  guest:         Object.freeze({ level: 0, permissions: Object.freeze([P.VIEW_GRAPH]) }),
  viewer:        Object.freeze({ level: 1, permissions: Object.freeze(viewer) }),
  editor:        Object.freeze({ level: 2, permissions: Object.freeze(editor) }),
  moderator:     Object.freeze({ level: 3, permissions: Object.freeze(moderator) }),
  administrator: Object.freeze({ level: 4, permissions: Object.freeze(administrator) }),
});

/** Роли, которые может носить настоящая запись в БД (guest — это отсутствие входа). */
export const REAL_ROLES = Object.freeze(
  Object.keys(ROLES).filter(r => r !== 'guest'));

/**
 * Права, которые НЕ выдаются, пока не выполнено условие.
 * Держать их списком, а не проверкой в одиннадцати местах, — то же правило
 * «одно знание — одно место»: набор прав вычисляется однажды, и всё
 * остальное — застава, интерфейс, проба — спрашивает уже готовый набор.
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
 * Действующий набор прав. Роль задаёт потолок, состояние записи его срезает.
 * Кнопка правки в интерфейсе исчезает сама: сервер отдаёт этот набор в
 * /api/users/me, и второго условия нигде писать не нужно.
 */
export function effectivePermissions({ role, emailVerified = false, mfaReady = false }) {
  const spec = ROLES[role];
  if (!spec) throw new Error(`effectivePermissions: неизвестная роль «${role}»`);
  return Object.freeze(spec.permissions.filter(perm =>
       (emailVerified || !NEEDS_VERIFIED_EMAIL.includes(perm))
    && (mfaReady      || !NEEDS_MFA.includes(perm))));
}

/** Роли, чей уровень не ниже данного. Нужна отбору получателей уведомлений:
 *  «сотрудникам от модератора и выше» — это ЗДЕСЬ, а не второй список там. */
export function rolesAtLeast(level) {
  return REAL_ROLES.filter(role => ROLES[role].level >= level);
}

/** Матрица прав ПОРОЖДАЕТСЯ. Руками её больше не пишут: разойдётся. */
export function permissionMatrix() {
  const roles = Object.keys(ROLES);
  return Object.values(P).map(perm => ({
    permission: perm,
    ...Object.fromEntries(roles.map(r => [r, ROLES[r].permissions.includes(perm)])),
  }));
}
```

### Матрица (порождена `permissionMatrix()`, не написана руками)

| Право | guest | viewer | editor | moderator | administrator |
|---|:--:|:--:|:--:|:--:|:--:|
| `view_graph` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `view_commit_history` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `create_commit` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `edit_own_pending_commit` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `delete_own_pending_commit` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `view_pending_commits` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `review_commit` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `revert_commit` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `view_users` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `manage_editors` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `ban_user` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `view_logs` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `manage_moderators` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `manage_admins` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `delete_user` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `system_settings` | ❌ | ❌ | ❌ | ❌ | ✅ |

Права `approve_commit` и `reject_commit` слиты в `review_commit`: разных прав у
них не было ни в одной строке, а два имени на одно право — это два места, где
можно ошибиться.


### Что срезает права помимо роли

| Условие | Что становится недоступно | Почему |
|---|---|---|
| почта не подтверждена | создание и правка своих коммитов | правка графа от неподтверждённого адреса — самый дешёвый способ насорить |
| двухшаговый вход не заведён | рассмотрение и откат коммитов, бан, смена ролей, удаление, системные настройки | украденная сессия сотрудника без этого равна украденной системе |

Оба ограничения срезают набор **в одном месте** — `effectivePermissions`.
Отсюда три следствия, ради которых это и сделано так. Застава
(`requirePermission`) не знает о них ничего и не меняется. Интерфейс не
проверяет ни почту, ни двухшаговый вход: сервер отдаёт `permissions`, кнопка
исчезает сама. И проба спрашивает ту же функцию, а не пересказывает условие.

Две оговорки, без которых это ломает жизнь. У пользователей, заведённых **до**
введения проверки, адрес считается подтверждённым задним числом — иначе первый
же выпуск отнимет право правки у всех, кто уже работает. А назначение
администратором проходит **до** заведения двухшагового входа: иначе первого
администратора (его заводит `bootstrap-admin`) назначить нечем. Он входит в
состояние «требуется двухшаговый вход»: смотреть может всё, делать —
ничего опасного, пока не заведёт.

### Проверки

```js
// server/access/access.js
import { P, ROLES } from './roles.js';

export class Forbidden extends Error {
  constructor(message, details = {}) { super(message); this.status = 403; this.details = details; }
}
export class Conflict extends Error {
  constructor(message, details = {}) { super(message); this.status = 409; this.details = details; }
}

/** Пригоден ли пользователь ДЕЙСТВОВАТЬ. Одна дверь для трёх условий. */
export function isUsable(user) {
  return Boolean(user) && user.isActive === true
      && user.isBanned === false && user.isDeleted !== true;
}

/**
 * Есть ли право. Гость — это отсутствие пользователя, а не роль в БД.
 * Забаненный и деактивированный не имеют НИЧЕГО, включая права гостя:
 * бан должен быть строже, чем неизвестность.
 */
export function can(user, permission) {
  if (!user) return ROLES.guest.permissions.includes(permission);
  if (!isUsable(user)) return false;
  // Спрашиваем ГОТОВЫЙ набор, посчитанный преобразователем: пересчитывать
  // его здесь значило бы завести второе место, где решается, что доступно
  // неподтверждённому или не заведшему двухшаговый вход.
  return user.permissions.includes(permission);
}

export function assertCan(user, permission) {
  if (!can(user, permission)) {
    throw new Forbidden('Недостаточно прав для этого действия',
                        { requiredPermission: permission });
  }
}

/**
 * Может ли actor действовать НАД target.
 * Отказ на самого себя — безусловный: самобан и самопонижение первой редакции
 * жили ровно здесь. Всё, что человек делает с собой, идёт отдельными ходами
 * (сменить пароль, выйти, удалить свою запись) и через них же проверяется.
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
  const top = Math.max(ROLES[fromRole].level, ROLES[toRole].level);
  if (top >= ROLES.administrator.level) return P.MANAGE_ADMINS;
  if (top >= ROLES.moderator.level)     return P.MANAGE_MODERATORS;
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
 * В первой редакции модератор имел и CREATE_COMMIT, и право одобрения, а
 * запрета не было нигде: самоодобрение проходило штатным путём.
 */
export function assertNotSelfReview(actor, commit) {
  if (actor && commit && actor.userId === commit.authorId) {
    throw new Forbidden('Собственный коммит рассматривает кто-то другой');
  }
}
```

### Заслон «последний администратор»

Считать администраторов до транзакции бессмысленно: два одновременных
понижения оба увидят двоих. Поэтому счёт берётся **внутри** транзакции и с
блокировкой строк.

```js
// server/access/last-admin.js
import { Conflict } from './access.js';

export async function assertNotLastAdministrator(client, { userId, newRole = null }) {
  // Понижение не последнего или назначение администратором — не наш случай.
  if (newRole === 'administrator') return;

  const { rows } = await client.query(`
    SELECT user_id FROM users
     WHERE role = 'administrator'
       AND is_active AND NOT is_banned AND deleted_at IS NULL
     FOR UPDATE`);

  const remaining = rows.filter(r => r.user_id !== userId);
  if (remaining.length === 0) {
    throw new Conflict(
      'Это последний действующий администратор: сначала назначьте другого');
  }
}
```

Тот же заслон зовётся из бана, деактивации и удаления — не только из смены
роли. Три двери, одна проверка.
---

## Коммиты: договор, нужный правам и уведомлениям

Первая редакция говорила о коммитах как о данности, и от этого в ней остались
дыры: типов изменения было четыре (`add_node`, `edit_node`, `add_link`,
`edit_link`) при заявленном праве отката, а столкновение двух правок одной связи
не разбиралось нигде. Здесь описан **минимум**, без которого разделы о правах и
уведомлениях не сходятся. Если есть отдельный документ о системе коммитов, эти
два надо свести: расхождение между ними будет ровно тем сортом дефекта, который
разбирала первая половина этого файла.

### Где живёт сам граф

```sql
CREATE TYPE entity_kind AS ENUM
  ('concept', 'relation', 'philosopher', 'tradition', 'rubric', 'relationType');

-- Шесть JSON приложения становятся ОДНОЙ таблицей. Их прежний вид
-- (data/concepts.json и прочие) остаётся ПРОЕКЦИЕЙ этой таблицы: так
-- одностраничная версия продолжает работать без сервера, читая выгрузку.
CREATE TABLE graph_entities (
  kind        entity_kind NOT NULL,
  entity_id   TEXT        NOT NULL,
  version     INTEGER     NOT NULL DEFAULT 1,
  data        JSONB       NOT NULL,
  deleted_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES users(user_id) ON DELETE SET NULL,
  PRIMARY KEY (kind, entity_id)
);
CREATE INDEX graph_alive_idx ON graph_entities (kind) WHERE deleted_at IS NULL;

-- Общий счётчик состояния графа: по нему клиент понимает, что отстал.
CREATE TABLE graph_state (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  version   BIGINT  NOT NULL DEFAULT 0
);
INSERT INTO graph_state (singleton) VALUES (TRUE) ON CONFLICT DO NOTHING;
```

### Четыре нерешённых вопроса переноса

Схема выше говорит, **куда** переезжают шесть наборов, но не говорит, как. Вот
что замерено по нынешней базе и что из этого следует.

```
ключи концепции: id, label, philosopher, rubrics, description, extendedDescription
ключи связи:     source, target, type, weight, description
связей 1624, из них с полем id: 0
пар source+target, встречающихся дважды: 2
троек source+target+type, встречающихся дважды: 0
```

**1. У связей нет идентификатора — и это главная помеха.** В приложении связь
адресуется тройкой «источник — цель — тип» (`relationIndexOf` ищет именно так),
и сегодня тройка уникальна. Но `graph_entities` требует `entity_id`, и если
собрать его из тройки, то **смена типа связи перестанет быть правкой** и станет
удалением с добавлением: адрес поменялся. История связи при этом рвётся, а
откат такой правки перестаёт быть простым. Вдобавок две пары
`source + target` уже встречаются дважды — между двумя концепциями бывает
несколько связей, и различает их только тип.

Вывод: связям нужны **устойчивые идентификаторы**, выданные при переносе, и
адресация по ним. Хорошая новость в том, что это дёшево: по всему дереву
приложения связь адресуется тройкой ровно в **двух местах**, оба в
`modal/persist.js` и оба через `relationIndexOf`. Всё остальное читает
`source`/`target` как концы связи при обходе графа, а не как адрес для правки.

**2. Массив упорядочен, таблица — нет.** Шесть JSON хранят порядок, и выгрузка
обязана его воспроизводить. Иначе каждая выгрузка выйдет иной, а сравнение
сторон в приёмке начнёт врать на пустом месте. Нужна явная колонка порядка
(`ord INTEGER NOT NULL`), заполняемая при переносе положением в массиве.

**3. Выгрузка должна совпадать посимвольно.** `data/save.js` пишет
`JSON.stringify(данные, null, 1)` — отступ в один пробел и тот порядок ключей,
что в объекте. Сервер обязан выгружать точно так же, иначе первый же перенос
даст расхождение на тысячи строк, в котором настоящих правок не разглядеть.

**4. Что источник, а что производное.** `DATA.nodes` — не хранимый набор: он
собирается из `concepts`, причём философ там лежит **именем**, тогда как в
`concepts` — идентификатором. В `graph_entities` едут шесть хранимых наборов;
`nodes` и `links` продолжают строиться на клиенте. Это надо записать явно,
иначе кто-нибудь перенесёт и их — и заведёт второй источник правды о том же.

### Коммит

```sql
CREATE TYPE commit_status AS ENUM
  ('pending', 'applied', 'coincided', 'rejected', 'conflicted', 'reverted');
CREATE TYPE commit_action AS ENUM ('add', 'edit', 'delete');

CREATE TABLE commits (
  commit_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  status        commit_status NOT NULL DEFAULT 'pending',
  message       VARCHAR(200) NOT NULL,
  author_comment TEXT,

  -- [{ action, kind, entityId, fields: { поле: { base, next } } }]
  -- Хранятся ОБА значения поля: без «было» нельзя отличить «правили
  -- одинаково» от «правили по-разному».
  changes       JSONB NOT NULL,

  reviewed_by   UUID REFERENCES users(user_id) ON DELETE SET NULL,
  reviewed_at   TIMESTAMPTZ,
  review_comment TEXT,
  applied_at    TIMESTAMPTZ,
  applied_version BIGINT,          -- значение graph_state.version после применения
  reverts       UUID REFERENCES commits(commit_id) ON DELETE SET NULL,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Рецензент не может быть автором. Заслон стоит в БД, а не только в коде:
  -- самоодобрение — то, что первая редакция пропускала штатным путём.
  CONSTRAINT commits_no_self_review_ck
    CHECK (reviewed_by IS NULL OR reviewed_by <> author_id),
  CONSTRAINT commits_rejected_needs_comment_ck
    CHECK (status <> 'rejected' OR review_comment IS NOT NULL)
);
CREATE INDEX commits_pending_idx ON commits (created_at) WHERE status = 'pending';
CREATE INDEX commits_author_idx  ON commits (author_id, created_at DESC);
```

**Прямая правка — не самоодобрение.** Заслон `assertNotSelfReview` запрещает
именно рецензию: автор не может стоять в `reviewed_by`. Но обладатель права
`REVIEW_COMMIT` вправе править граф напрямую — тогда коммит записывается сразу
как `applied` с пустым `reviewed_by` и отдельным действием в журнале
(`commit.direct`). Разница существенная: без неё единственный администратор не
смог бы изменить ничего, а «самоодобрение» перестало бы отличаться от прямой
правки в журнале. Ограничение в БД (`reviewed_by IS NULL OR reviewed_by <>
author_id`) допускает ровно этот случай и запрещает подделку рецензии.

**Четыре действия на шесть родов сущностей**, а не четыре типа на два рода:
`add | edit | delete` × `concept | relation | philosopher | tradition | rubric |
relationType`. Откат (`revert`) — не действие, а коммит, обращающий другой:
у него заполнено `reverts`, а `changes` вычислены из отменяемого.

### Столкновения

Столкновение возникает не между двумя ожидающими коммитами — те просто стоят в
очереди, — а между коммитом и **состоянием базы на миг применения**. Поэтому
вопрос всегда один: то ли сейчас в поле, что видел правщик, когда начинал.

Различать «двое правили одинаково» и «двое правили по-разному» нужно, но
отдельной машинерии для этого заводить не приходится. Достаточно хранить в
коммите **оба** значения — и было, и стало, — и сравнивать три величины.

| `сейчас` | что это значит | что делаем |
|---|---|---|
| `= было` | никто не трогал | применяем |
| `= стало` | правили **одинаково** | вхолостую: значение уже такое |
| иное | правили **по-разному** | столкновение, нужен человек |

Сверка идёт **по полю, а не по сущности целиком**. Один правил описание,
другой — рубрики: оба применяются, слияние выходит само. Это самый частый
случай совместной работы, и версия на всю сущность (`baseVersion` первого
наброска) блокировала его напрасно.

Совпавшая правка **не отклоняется**. Коммит применяется вхолостую и получает
состояние `coincided`, а автор — уведомление вида «то же самое внёс такой-то
полчаса назад». Отклонять было бы неверно: человек сделал работу и пришёл к
тому же выводу независимо — это ценный факт для истории, а не ошибка. В
журнале остаются оба.

```js
// server/commits/merge.js

/**
 * Сравнение значений полей графа. Это не «глубокое равенство вообще», а
 * решение о том, что считать ОДНОЙ И ТОЙ ЖЕ правкой:
 *  - текст: обрезаем края и приводим переносы строк. Регистр НЕ трогаем —
 *    в философских текстах он значим («Ничто» и «ничто» — разные вещи);
 *  - наборы (рубрики, традиции): равенство МНОЖЕСТВ. Порядок там смысла не
 *    несёт, и считать перестановку правкой значило бы плодить ложные
 *    столкновения;
 *  - числа и признаки: точное равенство после приведения;
 *  - null, undefined и строка из пробелов — одно и то же «пусто».
 */
export function sameValue(a, b) {
  if (isEmpty(a) && isEmpty(b)) return true;
  if (isEmpty(a) || isEmpty(b)) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const sa = new Set(a.map(String));
    const sb = new Set(b.map(String));
    return sa.size === sb.size && [...sa].every(x => sb.has(x));
  }
  if (typeof a === 'number'  || typeof b === 'number')  return Number(a) === Number(b);
  if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b);
  return normText(a) === normText(b);
}

const isEmpty  = v => v == null || (typeof v === 'string' && v.trim() === '');
const normText = v => String(v).replace(/\r\n?/g, '\n').trim();

export const MERGE = Object.freeze({
  CLEAN:    'clean',      // никто не трогал — применяем
  SAME:     'same',       // правили ОДИНАКОВО — применять нечего
  CONFLICT: 'conflict',   // правили ПО-РАЗНОМУ — нужен человек
});

/**
 * Трёхстороннее сравнение одного поля:
 *   base    — что видел правщик, когда начинал;
 *   next    — что он хочет получить;
 *   current — что в базе на момент применения.
 * Различение «правили одинаково / правили по-разному» выпадает отсюда само.
 * Отдельной машинерии для него не нужно — нужно лишь хранить в коммите ОБА
 * значения, а не одно новое.
 */
export function mergeField({ base, next, current }) {
  if (sameValue(current, base)) return MERGE.CLEAN;
  if (sameValue(current, next)) return MERGE.SAME;
  return MERGE.CONFLICT;
}

/**
 * Изменение целой сущности. Поля считаются ПООТДЕЛЬНОСТИ: правка описания и
 * правка рубрик не сталкиваются между собой, хотя и метят в одну концепцию.
 * Версия на всю сущность такие случаи блокировала напрасно — а это самый
 * частый случай совместной работы.
 */
export function mergeEntityChange({ action, fields = {}, current }) {
  if (action === 'delete') {
    // Оба удалили — применять нечего. Иначе удаляем.
    return current === null ? { outcome: MERGE.SAME } : { outcome: MERGE.CLEAN };
  }
  if (action === 'add') {
    return current === null
      ? { outcome: MERGE.CLEAN }
      : { outcome: MERGE.CONFLICT,
          conflicts: [{ field: null, reason: 'адрес уже занят' }] };
  }
  if (current === null) {
    return { outcome: MERGE.CONFLICT,
             conflicts: [{ field: null, reason: 'сущность удалена' }] };
  }

  const outcomes = {}, conflicts = [], apply = {};
  for (const [field, { base, next }] of Object.entries(fields)) {
    // Поле, где «было» и «стало» совпадают, — вовсе не правка: форма
    // отдаёт все поля разом, и большинство из них человек не трогал.
    // Записывать их значило бы сталкиваться там, где никто ничего не менял.
    if (sameValue(base, next)) { outcomes[field] = MERGE.SAME; continue; }
    const verdict = mergeField({ base, next, current: current[field] });
    outcomes[field] = verdict;
    if (verdict === MERGE.CONFLICT) {
      conflicts.push({ field, base, yours: next, current: current[field] });
    } else if (verdict === MERGE.CLEAN) {
      apply[field] = next;
    }
  }
  // Столкнулось хоть одно поле — коммит не применяется НИКАКОЙ частью:
  // половина правки хуже, чем ни одной.
  if (conflicts.length) return { outcome: MERGE.CONFLICT, conflicts, fields: outcomes };

  const outcome = Object.keys(apply).length ? MERGE.CLEAN : MERGE.SAME;
  return { outcome, apply, fields: outcomes };
}
```

Три оговорки, каждая — решение, а не мелочь.

**Что считать «тем же значением».** Для текстов — совпадение после обрезки
краёв и приведения переносов строк; регистр **не** нормализуется: в
философских текстах «Ничто» и «ничто» — разные вещи. Для наборов (рубрики,
традиции) — равенство множеств: порядок там смысла не несёт, и считать
перестановку правкой значило бы плодить ложные столкновения. Для веса связи —
равенство чисел, а не строк.

**Столкнулось одно поле — не применяется ничего.** Половина правки хуже, чем
ни одной: коммит целиком уходит в `conflicted`, и автор пересобирает его поверх
нынешнего состояния, видя в отказе, какое именно поле разошлось и как.

**Машина ловит столкновение по адресу, а не по смыслу.** Две одинаковые по
существу новые концепции с разными идентификаторами она не заметит никогда —
это работа рецензента, и обещать здесь автоматику не следует.

Отдельно — то, что к разрешению столкновений не относится, но снимает добрую их
половину: **предупреждать при отправке**. «Есть коммит на рассмотрении,
трогающий то же поле этой концепции» — правщик увидит это до того, как потратит
вечер. Стоит один запрос, а спасает от самой обидной разновидности потерянного
труда.

---

## Уведомления

### Что здесь переделано целиком

Первая редакция считала получателей **правилами по ролям**: четыре функции
(`viewerNotifications`, `editorNotifications`, …), каждая со списком типов и
отдельными проверками «своё ли это». Одна и та же мысль была записана в трёх
местах по-разному и дала три разных исхода: у `viewer` она текла (уведомление о
чужой смене роли приходило всем), у `editor` и `moderator` работала, но делала
запись в списке недостижимой, а у `administrator` её просто не было — и о смене
собственной роли он не узнавал.

Правил по ролям здесь нет вовсе. **У каждого типа уведомления есть опись, и в
ней сказано, кому он адресован.** Роль получателя участвует лишь постольку,
поскольку опись говорит «сотрудникам такого-то уровня».

### Опись типов

```js
// server/notify/catalog.js
import { ROLES } from '../access/roles.js';

export const N = {
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
};

// Категории — то, что человек может отключить у себя в настройках.
// mandatory: отключить нельзя (сообщения о собственном положении).
export const CATEGORIES = Object.freeze({
  graphChanges: { title: 'Изменения графа',   mandatory: false },
  commitStatus: { title: 'Судьба моих правок', mandatory: false },
  moderation:   { title: 'Модерация',          mandatory: false },
  roleChanges:  { title: 'Моё положение',      mandatory: true  },
});

/**
 * Адресат задаётся ОПИСЬЮ, а не ролью получателя.
 *   author     — data.authorId
 *   subject    — data.userId (тот, о ком событие)
 *   staff(min) — все действующие пользователи с уровнем не ниже min
 *   everyone   — все действующие (только для широковещания, см. ниже)
 */
export const CATALOG = Object.freeze({
  [N.GRAPH_CHANGED]: {
    audience: { kind: 'everyone' },
    category: 'graphChanges', priority: 'low', broadcast: true,
  },
  [N.COMMIT_APPROVED]: {
    audience: { kind: 'author' },
    category: 'commitStatus', priority: 'normal',
  },
  [N.COMMIT_REJECTED]: {
    audience: { kind: 'author' },
    category: 'commitStatus', priority: 'high',
  },
  [N.COMMIT_CONFLICTED]: {
    audience: { kind: 'author' },
    category: 'commitStatus', priority: 'high',
  },
  // «То же самое уже внесли». Не отказ и не одобрение — отдельное известие,
  // иначе труд человека выглядел бы как ошибка.
  [N.COMMIT_COINCIDED]: {
    audience: { kind: 'author' },
    category: 'commitStatus', priority: 'low',
  },
  [N.NEW_COMMIT_PENDING]: {
    audience: { kind: 'staff', minLevel: ROLES.moderator.level },
    category: 'moderation', priority: 'normal',
  },
  [N.ROLE_CHANGED]: {
    audience: { kind: 'subject' },
    category: 'roleChanges', priority: 'high',
  },
  // Повышение и понижение заменили четыре прежних типа (new_editor,
  // editor_removed, new_moderator, moderator_removed), из которых два
  // не создавались никогда. Кому сообщать — зависит от СТУПЕНИ, а не от
  // имени типа: о новом модераторе знают администраторы, о новом
  // редакторе — модераторы и выше.
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
  const top = Math.max(ROLES[data.oldRole]?.level ?? 0,
                       ROLES[data.newRole]?.level ?? 0);
  // О редакторах знают модераторы; о модераторах и администраторах —
  // администраторы.
  return top >= ROLES.moderator.level ? ROLES.administrator.level
                                      : ROLES.moderator.level;
}
```

### Кто получит: одна функция

```js
// server/notify/recipients.js
import { CATALOG, peerLevel } from './catalog.js';
import { rolesAtLeast } from '../access/roles.js';

/**
 * Единственное место, отвечающее на вопрос «кому». Его же зовёт проба —
 * она не пересказывает правило, а спрашивает его.
 * Возвращает { broadcast: true } либо список userId.
 */
export async function recipientsFor(client, type, data) {
  const spec = CATALOG[type];
  if (!spec) throw new Error(`уведомления: неизвестный тип «${type}» — ` +
    `у типа либо есть опись, либо его нет`);

  switch (spec.audience.kind) {
    case 'everyone':
      return { broadcast: true };

    case 'author':
      return { userIds: data.authorId ? [data.authorId] : [] };

    case 'subject':
      return { userIds: data.userId ? [data.userId] : [] };

    case 'staff': {
      const minLevel = spec.audience.minLevelFrom === 'peerLevel'
        ? peerLevel(data) : spec.audience.minLevel;
      const { rows } = await client.query(`
        SELECT user_id FROM users
         WHERE is_active AND NOT is_banned AND deleted_at IS NULL
           AND role = ANY($1::user_role[])`, [rolesAtLeast(minLevel)]);
      // Ни тот, о ком событие, ни автор коммита не получают служебной копии
      // о самих себе: первому уже пришло адресное уведомление, второй и так
      // знает, что отправил коммит. Проба поймала это на модераторе, который
      // получал «новый коммит на модерации» о собственном коммите.
      const свои = new Set([data.userId, data.authorId].filter(Boolean));
      return { userIds: rows.map(r => r.user_id).filter(id => !свои.has(id)) };
    }

    default:
      throw new Error(`уведомления: неизвестный род адресата «${spec.audience.kind}»`);
  }
}
```

Ровно эти четыре случая. Проверка «своё ли это» исчезла как отдельная мысль:
адресное уведомление отправляется тому, кому адресовано, и никому больше.

### Адресные и широковещательные — две дороги, и это нарочно

`GRAPH_CHANGED` в первой редакции клал строку в `notifications` **каждому
активному пользователю** и слал ему письмо — на каждый применённый коммит,
последовательным `await` в цикле по `SELECT *` без пагинации. На тысяче
пользователей это тысяча вставок и тысяча писем на одну правку связи.

Поэтому широковещательные уведомления живут отдельно, а «прочитано» у них —
курсор, а не строка на человека.

```sql
CREATE TABLE notifications (            -- адресные
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  category   VARCHAR(32) NOT NULL,
  priority   VARCHAR(10) NOT NULL DEFAULT 'normal'
             CHECK (priority IN ('low','normal','high')),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,   -- не «read»: слово занято смыслом
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  read_at    TIMESTAMPTZ
);
CREATE INDEX notif_unread_idx ON notifications (user_id, created_at DESC)
  WHERE is_read = FALSE;
CREATE INDEX notif_expires_idx ON notifications (expires_at);

CREATE TABLE broadcasts (               -- широковещательные: одна строка на событие
  broadcast_id BIGSERIAL PRIMARY KEY,
  type       VARCHAR(50) NOT NULL,
  category   VARCHAR(32) NOT NULL,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX broadcasts_time_idx ON broadcasts (created_at DESC);

CREATE TABLE notification_preferences (
  user_id       UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  push_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  categories    JSONB   NOT NULL DEFAULT '{}'::jsonb,  -- {"graphChanges": false}
  -- курсор по широковещательным
  broadcast_seen_id BIGINT NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Колонок `email_notifications` и `push_notifications` в `users` больше нет:
в первой редакции они существовали одновременно с таблицей настроек, письма
читали одни, а API правил другие.

### Отправка

```js
// server/notify/notify.js
import { CATALOG, CATEGORIES } from './catalog.js';
import { recipientsFor } from './recipients.js';

export const NOTIFICATION_TTL_DAYS = 30;   // одно место; было 7 в примере и 30 в коде

/**
 * Зовётся ВНУТРИ той же транзакции, что и само действие, и ничего не
 * доставляет: складывает в исходящие. Доставка — забота работника.
 * В первой редакции падение почты роняло уже совершённую смену роли.
 */
export async function notify(client, type, data) {
  const spec = CATALOG[type];
  if (!spec) throw new Error(`уведомления: неизвестный тип «${type}»`);

  const who = await recipientsFor(client, type, data);
  const expires = `NOW() + INTERVAL '${NOTIFICATION_TTL_DAYS} days'`;

  if (who.broadcast) {
    const { rows: [b] } = await client.query(`
      INSERT INTO broadcasts (type, category, data, expires_at)
      VALUES ($1, $2, $3, ${expires}) RETURNING broadcast_id`,
      [type, spec.category, data]);
    await client.query(`
      INSERT INTO outbox (channel, payload)
      VALUES ('broadcast', $1)`, [{ broadcastId: b.broadcast_id, type }]);
    return { broadcastId: b.broadcast_id };
  }

  const ids = await filterByPreferences(client, who.userIds, spec.category);
  if (!ids.length) return { created: 0 };

  const { rows } = await client.query(`
    INSERT INTO notifications (user_id, type, category, priority, data, expires_at)
    SELECT u, $2, $3, $4, $5, ${expires} FROM unnest($1::uuid[]) AS u
    RETURNING notification_id, user_id`,
    [ids, type, spec.category, spec.priority, data]);

  await client.query(`
    INSERT INTO outbox (channel, payload)
    SELECT 'notification', jsonb_build_object('notificationId', n)
      FROM unnest($1::uuid[]) AS n`,
    [rows.map(r => r.notification_id)]);

  return { created: rows.length };
}

/** Обязательные категории не отключаются: о собственном положении сообщают всегда. */
async function filterByPreferences(client, userIds, category) {
  if (!userIds.length) return [];
  if (CATEGORIES[category].mandatory) return userIds;
  const { rows } = await client.query(`
    SELECT u.user_id
      FROM unnest($1::uuid[]) AS u(user_id)
      LEFT JOIN notification_preferences p USING (user_id)
     WHERE COALESCE((p.categories ->> $2)::boolean, TRUE)`,
    [userIds, category]);
  return rows.map(r => r.user_id);
}
```

```sql
CREATE TABLE outbox (
  outbox_id   BIGSERIAL PRIMARY KEY,
  channel     VARCHAR(20) NOT NULL,     -- notification | broadcast | email
  payload     JSONB NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  next_try_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  last_error  TEXT
);
CREATE INDEX outbox_due_idx ON outbox (next_try_at) WHERE delivered_at IS NULL;
```

Работник разбирает `outbox`: шлёт в открытые соединения, копит почту и
отправляет **сводку** — не более одного письма в час на человека по
широковещательным и сразу по обязательным. Не доставленное откладывается с
растущей задержкой; шесть неудач подряд — запись остаётся с `last_error`, и её
видно в журнале. Отдельная задача раз в сутки убирает просроченное:

```sql
DELETE FROM notifications WHERE expires_at < NOW();
DELETE FROM broadcasts    WHERE expires_at < NOW();
DELETE FROM outbox        WHERE delivered_at < NOW() - INTERVAL '7 days';
```

### Непрочитанное

```js
// server/notify/read.js
export async function unreadCount(db, userId) {
  const { rows: [r] } = await db.query(`
    SELECT (SELECT count(*) FROM notifications
             WHERE user_id = $1 AND NOT is_read AND expires_at > NOW())
         + (SELECT count(*) FROM broadcasts b
             WHERE b.expires_at > NOW()
               AND b.broadcast_id > COALESCE(
                     (SELECT broadcast_seen_id FROM notification_preferences
                       WHERE user_id = $1), 0)) AS n`, [userId]);
  return Number(r.n);
}
```

Трёх меток времени первой редакции (`last_login`, `lastNotificationCheck`,
`read`) больше нет: непрочитанность адресных считается полем `is_read`,
широковещательных — курсором. `last_login` остался только для журнала входов и
на счёт уведомлений не влияет.

### Письма

```js
// server/notify/email.js
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

// Каждая подстановка экранируется. В первой редакции данные попадали в HTML
// письма как есть — в разделе, обещающем защиту от XSS.
const TEMPLATES = {
  commit_approved: d => ({
    subject: 'Ваше изменение одобрено',
    text: `Коммит: ${d.commitMessage}\nМодератор: ${d.reviewerName}` +
          (d.reviewComment ? `\nКомментарий: ${d.reviewComment}` : ''),
    html: `<h2>Ваше изменение одобрено</h2>
           <p><strong>Коммит:</strong> ${esc(d.commitMessage)}</p>
           <p><strong>Модератор:</strong> ${esc(d.reviewerName)}</p>` +
          (d.reviewComment
            ? `<p><strong>Комментарий:</strong> ${esc(d.reviewComment)}</p>` : ''),
  }),
  // … по одному описанию на тип; отсутствие описания — ошибка, а не молчание
};

export function renderEmail(notification) {
  const make = TEMPLATES[notification.type];
  if (!make) throw new Error(`письма: нет образца для типа «${notification.type}»`);
  return make(notification.data);
}
```

У письма есть и текстовая часть: почтовые клиенты, режущие HTML, иначе покажут
пустое сообщение.
---

## Управление пользователями

### Транзакция — это соединение, а не довод

В первой редакции стояло `db.query(sql, params, { transaction })`. Так
транзакция не работает: `db` — пул, и два запроса уйдут в разные соединения,
а `BEGIN` останется в одном из них. Ошибка тем неприятнее, что всё выглядит
правильно и даже проходит на малой нагрузке, пока пул отдаёт то же соединение.

```js
// server/db/tx.js
export async function withTransaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch { /* соединение уже мертво */ }
    throw e;
  } finally {
    client.release();
  }
}
```

**Соглашение:** функция, первый довод которой называется `client`, обязана
исполняться внутри транзакции; функция, берущая `db`, — вне её. Читается по
подписи, не требует памяти.

### Смена роли

```js
// server/users/service.js
import { withTransaction } from '../db/tx.js';
import { userFromRow } from '../db/mapper.js';
import { P, ROLES } from '../access/roles.js';
import { assertCan, assertCanActOn, assertCanChangeRole, Forbidden, Conflict }
  from '../access/access.js';
import { assertNotLastAdministrator } from '../access/last-admin.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { audit } from '../audit.js';

export async function changeUserRole(pool, { actor, targetUserId, newRole, reason, ip }) {
  if (!reason || !reason.trim()) {
    throw new Forbidden('Причина изменения роли обязательна');
  }

  return withTransaction(pool, async client => {
    // Строку берём с блокировкой: иначе два одновременных понижения
    // прочитают одно и то же старое состояние.
    const { rows } = await client.query(
      `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [targetUserId]);
    if (!rows[0]) throw new Conflict('Пользователь не найден');

    const target  = userFromRow(rows[0]);
    const oldRole = target.role;

    assertCanChangeRole(actor, target, newRole);
    if (oldRole === 'administrator') {
      await assertNotLastAdministrator(client, { userId: targetUserId, newRole });
    }

    await client.query(`
      UPDATE users SET role = $1, role_changed_at = NOW(), role_changed_by = $2
       WHERE user_id = $3`, [newRole, actor.userId, targetUserId]);

    await client.query(`
      INSERT INTO role_history (user_id, old_role, new_role, changed_by, reason)
      VALUES ($1, $2, $3, $4, $5)`,
      [targetUserId, oldRole, newRole, actor.userId, reason]);

    // Понижение снимает сессии: право, которого больше нет, не должно
    // доживать в открытой вкладке до следующего запроса.
    if (ROLES[newRole].level < ROLES[oldRole].level) {
      await revokeSessions(client, targetUserId);
    }

    const data = {
      userId: targetUserId, username: target.username,
      oldRole, newRole,
      changedBy: actor.userId,
      changedByName: actor.profile.displayName || actor.username,
      reason, changedAt: new Date().toISOString(),
    };

    await notify(client, N.ROLE_CHANGED, data);
    await notify(client,
      ROLES[newRole].level > ROLES[oldRole].level ? N.USER_PROMOTED : N.USER_DEMOTED,
      data);

    await audit(client, { actor, action: 'user.role_change',
                          subjectType: 'user', subjectId: targetUserId,
                          payload: { oldRole, newRole, reason }, ip });

    const { rows: [fresh] } = await client.query(
      `SELECT * FROM users WHERE user_id = $1`, [targetUserId]);
    return userFromRow(fresh, { viewer: actor });
  });
}
```

Три отличия от первой редакции, каждое за дефект. Объект `target` не правится
руками после `COMMIT` (там было `target.metadata.roleChangedAt = …` на плоской
строке — падение); свежее состояние перечитывается. Уведомления складываются в
исходящие внутри транзакции, а не отправляются из запроса — падение почты больше
не отменяет совершённого и не выдаёт клиенту ошибку на удавшемся действии.
И `reason` обязателен на **сервере**: в первой редакции требование жило только в
`disabled` кнопки диалога.

Пар «повысить до редактора» / «понизить до зрителя» здесь нет: это была та же
`changeUserRole` под другими именами, причём `promoteToModerator` вдобавок
проверял роль отдельным способом. Один ход — одно имя.

### Бан, разбан, удаление

```js
export async function banUser(pool, { actor, targetUserId, reason, ip }) {
  if (!reason || !reason.trim()) throw new Forbidden('Причина бана обязательна');

  return withTransaction(pool, async client => {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [targetUserId]);
    if (!rows[0]) throw new Conflict('Пользователь не найден');
    const target = userFromRow(rows[0]);

    assertCan(actor, P.BAN_USER);
    assertCanActOn(actor, target);          // в том числе: не себя
    if (target.isBanned) throw new Conflict('Пользователь уже забанен');
    if (target.role === 'administrator') {
      await assertNotLastAdministrator(client, { userId: targetUserId });
    }

    await client.query(`
      UPDATE users SET is_banned = TRUE, ban_reason = $1,
                       banned_at = NOW(), banned_by = $2
       WHERE user_id = $3`, [reason, actor.userId, targetUserId]);

    await revokeSessions(client, targetUserId);   // в ТОЙ ЖЕ транзакции

    const data = { userId: targetUserId, username: target.username, reason,
                   bannedBy: actor.userId,
                   bannedByName: actor.profile.displayName || actor.username };
    await notify(client, N.USER_BANNED, data);
    await audit(client, { actor, action: 'user.ban', subjectType: 'user',
                          subjectId: targetUserId, payload: { reason }, ip });
    return { ok: true };
  });
}

export async function unbanUser(pool, { actor, targetUserId, ip }) {
  return withTransaction(pool, async client => {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [targetUserId]);
    if (!rows[0]) throw new Conflict('Пользователь не найден');
    const target = userFromRow(rows[0]);

    assertCan(actor, P.BAN_USER);
    // Первая редакция здесь НЕ проверяла canManageUser: модератор мог снять
    // бан с администратора, которого забанил администратор.
    assertCanActOn(actor, target);
    if (!target.isBanned) throw new Conflict('Пользователь не забанен');

    await client.query(`
      UPDATE users SET is_banned = FALSE, ban_reason = NULL,
                       banned_at = NULL, banned_by = NULL
       WHERE user_id = $1`, [targetUserId]);

    await notify(client, N.USER_UNBANNED,
      { userId: targetUserId, username: target.username, unbannedBy: actor.userId });
    await audit(client, { actor, action: 'user.unban', subjectType: 'user',
                          subjectId: targetUserId, payload: {}, ip });
    return { ok: true };
  });
}

/**
 * Удаление МЯГКОЕ: у коммитов есть автор, и он обязан остаться названным.
 * Почта и логин освобождаются переносом в мёртвое имя — частичные уникальные
 * индексы (WHERE deleted_at IS NULL) этого и ждут.
 */
export async function deleteUser(pool, { actor, targetUserId, ip }) {
  return withTransaction(pool, async client => {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL FOR UPDATE`,
      [targetUserId]);
    if (!rows[0]) throw new Conflict('Пользователь не найден');
    const target = userFromRow(rows[0]);

    assertCan(actor, P.DELETE_USER);
    assertCanActOn(actor, target);
    await assertNotLastAdministrator(client, { userId: targetUserId });

    await client.query(`
      UPDATE users
         SET deleted_at = NOW(), is_active = FALSE,
             email    = 'deleted+' || user_id || '@invalid',
             username = 'deleted_' || left(user_id::text, 8)
       WHERE user_id = $1`, [targetUserId]);
    await revokeSessions(client, targetUserId);

    await audit(client, { actor, action: 'user.delete', subjectType: 'user',
                          subjectId: targetUserId,
                          payload: { username: target.username }, ip });
    return { ok: true };
  });
}

async function revokeSessions(client, userId) {
  await client.query(`
    UPDATE user_sessions SET revoked_at = NOW()
     WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
}
```

### Список пользователей

```js
export async function listUsers(db, { actor, role, isBanned, isActive, query,
                                      page = 1, limit = 20 }) {
  assertCan(actor, P.VIEW_USERS);      // не VIEW_LOGS: это разные права

  const where = ['u.deleted_at IS NULL'];
  const params = [];
  const add = (sql, value) => { params.push(value); where.push(sql(params.length)); };

  if (role !== undefined)     add(i => `u.role = $${i}::user_role`, role);
  if (isBanned !== undefined) add(i => `u.is_banned = $${i}`, isBanned);
  if (isActive !== undefined) add(i => `u.is_active = $${i}`, isActive);
  if (query)                  add(i => `(u.username ILIKE $${i} OR u.email ILIKE $${i})`,
                                  `%${query}%`);

  return paginate(db, {
    from: `users u LEFT JOIN user_stats s USING (user_id)`,
    select: `u.*, s.commits_created, s.commits_approved,
             s.commits_rejected, s.last_commit_at`,
    where, params, order: 'u.registered_at DESC', page, limit,
    map: row => userFromRow(row, { viewer: actor, stats: row }),
  });
}

// server/db/paginate.js — один вид ответа на весь API.
export async function paginate(db, { from, select, where, params, order,
                                     page, limit, map }) {
  const lim  = Math.min(Math.max(1, Number(limit) || 20), 100);
  const pg   = Math.max(1, Number(page) || 1);
  const cond = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: [{ count }] } = await db.query(
    `SELECT count(*)::int AS count FROM ${from} ${cond}`, params);
  const { rows } = await db.query(
    `SELECT ${select} FROM ${from} ${cond} ORDER BY ${order}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, lim, (pg - 1) * lim]);

  return {
    items: rows.map(map),
    pagination: { page: pg, limit: lim, total: count,
                  pages: Math.max(1, Math.ceil(count / lim)) },
  };
}
```

### Журнал

```js
// server/audit.js
export async function audit(client, { actor, action, subjectType, subjectId,
                                      payload = {}, ip = null }) {
  await client.query(`
    INSERT INTO audit_log (actor_id, action, subject_type, subject_id, payload, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [actor?.userId ?? null, action, subjectType, String(subjectId), payload, ip]);
}
```

Пишется в той же транзакции, что и действие: журнал, который можно потерять
отдельно от события, хуже, чем никакого — он создаёт ложную уверенность.

---

## API

### Общий вид

Успех: `{ "data": … }` — либо `{ "items": [...], "pagination": {...} }` для
списков. Отказ: `{ "error": { "code", "message", "details" } }`. Один вид на
все ответы; первая редакция обещала пагинацию в описании и возвращала голый
массив, а панель пыталась читать оба вида сразу.

```js
// server/http/errors.js
export function errorHandler(err, req, res, _next) {
  const status = err.status ?? 500;
  if (status >= 500) req.log.error({ err }, 'необработанная ошибка');
  res.status(status).json({
    error: {
      code: err.code ?? (status === 403 ? 'forbidden'
                       : status === 409 ? 'conflict'
                       : status === 401 ? 'unauthorized' : 'internal'),
      // Наружу уходит только то, что предназначено наружу: сообщения
      // внутренних ошибок остаются в журнале.
      message: status >= 500 ? 'Внутренняя ошибка' : err.message,
      details: err.details ?? undefined,
    },
  });
}
```

### Эндпоинты

```
POST   /api/auth/register          { username, email, password, displayName? }
POST   /api/auth/login             { email, password }
POST   /api/auth/logout                       — гасит ТЕКУЩУЮ сессию
POST   /api/auth/logout-all                   — все сессии этого пользователя
GET    /api/auth/sessions                     — свои сессии (устройства)
DELETE /api/auth/sessions/:sessionId
POST   /api/auth/verify-email      { token }
POST   /api/auth/password/forgot   { email }
POST   /api/auth/password/reset    { token, password }
PATCH  /api/auth/password          { currentPassword, newPassword }

GET    /api/users/me                          — включая permissions и level
PATCH  /api/users/me               { displayName?, bio?, language?, theme? }
DELETE /api/users/me               { password }      — удаление своей записи

GET    /api/users                  ?role=&isBanned=&isActive=&query=&page=&limit=
GET    /api/users/:userId
POST   /api/users/:userId/role     { newRole, reason }
POST   /api/users/:userId/ban      { reason }
POST   /api/users/:userId/unban
DELETE /api/users/:userId
GET    /api/users/:userId/role-history
GET    /api/users/:userId/allowed-roles       — что ЭТОТ актор может назначить

GET    /api/notifications          ?unread=true&page=&limit=
GET    /api/notifications/unread-count
POST   /api/notifications/:id/read
POST   /api/notifications/read-all
DELETE /api/notifications/:id
GET    /api/notifications/preferences
PATCH  /api/notifications/preferences  { emailEnabled?, pushEnabled?, categories? }

GET    /api/graph                  ?since=<version>    — состояние или приращение
GET    /api/commits                ?status=&mine=true&page=&limit=
POST   /api/commits                { message, authorComment?, changes[] }
PATCH  /api/commits/:id                        — свой, пока pending
DELETE /api/commits/:id                        — свой, пока pending
POST   /api/commits/:id/review     { action: 'approve'|'reject', comment }
POST   /api/commits/:id/revert     { reason }

GET    /api/admin/logs             ?actor=&action=&from=&to=&page=&limit=
```

Ветки `/api/admin/…` для действий над пользователями убраны: путь не должен
быть вторым носителем знания о правах — их проверяет застава, и только она.
`/api/admin/logs` остался, потому что это отдельный предмет, а не действие над
пользователем.

Отдельно `GET /api/users/:userId/allowed-roles`: интерфейс не вычисляет
допустимые роли сам (в первой редакции список ролей в диалоге был четвёртым
местом, где записана иерархия).

```js
// server/http/guards.js
import { assertCan } from '../access/access.js';

export const requirePermission = permission => (req, _res, next) => {
  try { assertCan(req.user, permission); next(); } catch (e) { next(e); }
};

export const requireAuth = (req, _res, next) =>
  req.user ? next() : next(Object.assign(new Error('Требуется вход'), { status: 401 }));
```

```js
app.post('/api/commits', requireAuth, requirePermission(P.CREATE_COMMIT), createCommit);
app.post('/api/commits/:id/review',
         requireAuth, requirePermission(P.REVIEW_COMMIT), reviewCommit);
app.post('/api/users/:userId/ban',
         requireAuth, requirePermission(P.BAN_USER), banHandler);
```

Застава проверяет **право**, служба — ещё и отношение к предмету
(`assertCanActOn`, `assertNotSelfReview`, «последний администратор»). Разделение
не случайно: право можно проверить, не читая БД, а отношение — нельзя, и
попытка сделать это в заставе привела бы к двойному чтению и двум ответам на
один вопрос.
---

## Интерфейсы

### Один вызов на весь клиент

В первой редакции ни один `fetch` не слал `Authorization`, хотя токен клали в
`localStorage`: `/api/users/me` вернул бы 401 при любом раскладе. Здесь сессия
живёт в cookie (раздел «Безопасность»), поэтому заголовок не нужен вовсе, — но
нужен признак против CSRF, и он ставится в одном месте.

```js
// client/api.js
let csrf = null;   // выдаётся при входе, лежит в обычной (не httpOnly) cookie

export function setCsrfToken(t) { csrf = t; }

export async function api(path, { method = 'GET', body, signal } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'include',            // cookie идут сами
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(method === 'GET' ? {} : { 'X-CSRF-Token': csrf ?? readCookie('csrf') }),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(payload?.error?.message || `Ошибка ${res.status}`);
    e.code = payload?.error?.code; e.details = payload?.error?.details;
    e.status = res.status;
    throw e;
  }
  return payload;
}
```

### Панель уведомлений

```jsx
// client/NotificationPanel.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from './api.js';

export function NotificationPanel() {
  const [items, setItems]   = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen]     = useState(false);
  const socket = useRef(null);
  const retry  = useRef(0);
  const alive  = useRef(true);

  const load = useCallback(async () => {
    const [list, count] = await Promise.all([
      api('/api/notifications?limit=50'),
      api('/api/notifications/unread-count'),
    ]);
    setItems(list.items);
    setUnread(count.data.count);      // из своего запроса, а не из пагинации
  }, []);

  useEffect(() => {
    alive.current = true;
    load().catch(() => {});

    // Соединение восстанавливается с растущей задержкой и ЗАКРЫВАЕТСЯ при
    // размонтировании: в первой редакции сокет открывался и не закрывался
    // никогда, а useEffect не имел уборки.
    const connect = () => {
      if (!alive.current) return;
      const ws = new WebSocket(wsUrl());
      socket.current = ws;

      ws.onopen = () => { retry.current = 0; };
      ws.onmessage = ev => {
        let msg;
        try { msg = JSON.parse(ev.data); } catch { return; }
        if (msg.type === 'notification') {
          setItems(prev => [msg.notification, ...prev]);
          setUnread(n => n + 1);
        } else if (msg.type === 'broadcast') {
          setItems(prev => [msg.notification, ...prev]);
          setUnread(n => n + 1);
        } else if (msg.type === 'graph-version') {
          window.dispatchEvent(
            new CustomEvent('graph-version', { detail: msg.version }));
        }
      };
      ws.onclose = () => {
        if (!alive.current) return;
        const wait = Math.min(30000, 500 * 2 ** retry.current++);
        setTimeout(connect, wait);
      };
    };
    connect();

    return () => { alive.current = false; socket.current?.close(); };
  }, [load]);

  const markRead = async id => {
    await api(`/api/notifications/${id}/read`, { method: 'POST' });
    setItems(prev => prev.map(n =>
      n.notificationId === id ? { ...n, read: true } : n));
    setUnread(n => Math.max(0, n - 1));
  };

  const markAllRead = async () => {
    await api('/api/notifications/read-all', { method: 'POST' });
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <div className="notification-panel">
      <button className="notification-bell" onClick={() => setOpen(v => !v)}
              aria-label={`Уведомления${unread ? `, непрочитанных ${unread}` : ''}`}>
        🔔{unread > 0 && <span className="badge">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Уведомления</h3>
            {unread > 0 && <button onClick={markAllRead}>Отметить все</button>}
          </div>
          <div className="notification-list">
            {items.length === 0 && <p className="empty">Пока ничего</p>}
            {items.map(n => (
              <NotificationItem key={n.notificationId ?? `b${n.broadcastId}`}
                                notification={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

`NotificationItem` строит текст по типу — как и прежде, но с двумя поправками:
отметка о прочтении висит на **отдельной кнопке**, а не на всём теле (клик по
телу ведёт к предмету уведомления), и неизвестный тип рисуется человеческим
«Уведомление», а не `JSON.stringify(data)`.

### Панель пользователей

```jsx
// client/UserManagementPanel.jsx
export function UserManagementPanel({ me }) {
  const [page, setPage]       = useState({ items: [], pagination: null });
  const [filters, setFilters] = useState({ role: '', status: 'active' });
  const [busy, setBusy]       = useState(false);

  const load = useCallback(async (pageNo = 1) => {
    const q = new URLSearchParams({ page: String(pageNo), limit: '20' });
    if (filters.role) q.set('role', filters.role);
    if (filters.status === 'banned') q.set('isBanned', 'true');
    if (filters.status === 'active') q.set('isBanned', 'false');
    setPage(await api(`/api/users?${q}`));
  }, [filters]);

  useEffect(() => { load(1).catch(showError); }, [load]);

  const changeRole = async (userId, newRole, reason) => {
    setBusy(true);
    try { await api(`/api/users/${userId}/role`,
                    { method: 'POST', body: { newRole, reason } });
          await load(page.pagination?.page ?? 1);
          showSuccess('Роль изменена');
    } catch (e) { showError(e.message); }      // ошибки СЕРВЕРА, а не молчание
    finally { setBusy(false); }
  };

  const ban = async (userId, reason) => {
    setBusy(true);
    try { await api(`/api/users/${userId}/ban`, { method: 'POST', body: { reason } });
          await load(page.pagination?.page ?? 1);
          showSuccess('Пользователь забанен');
    } catch (e) { showError(e.message); }
    finally { setBusy(false); }
  };
  /* … разметка: фильтры, список UserCard, пагинация … */
}
```

Три поправки против первой редакции. `fetch` без `try` вокруг разбора ответа
там **не бросал** на 403: `fetch` не считает 403 ошибкой, поэтому
`showError` не вызывался никогда, а панель показывала «Роль успешно изменена»
на отказ сервера. Здесь бросает `api()`. `UserCard` вызывал `handleBan`,
которого не существовало (передавался `onBan`) — исправлено. И список
перезагружается с той страницы, на которой стоял пользователь.

```jsx
function UserCard({ user, me, onChangeRole, onBan }) {
  // Право показать кнопку берётся у СЕРВЕРА (me.permissions), а не считается
  // клиентской копией PermissionChecker: копия разошлась бы первой же правкой.
  const mayManage = me.permissions.includes('manage_editors')
                 && me.userId !== user.userId
                 && me.level > user.level;
  /* … */
}

function RoleChangeDialog({ user, onConfirm, onCancel }) {
  const [roles, setRoles]   = useState(null);
  const [role,  setRole]    = useState(user.role);
  const [reason, setReason] = useState('');

  // Список допустимых ролей приходит с сервера: пятое место, где была
  // записана иерархия, устранено.
  useEffect(() => {
    api(`/api/users/${user.userId}/allowed-roles`)
      .then(r => setRoles(r.data.roles)).catch(() => setRoles([]));
  }, [user.userId]);

  if (!roles) return <div className="dialog">Загрузка…</div>;
  /* … выбор роли из roles, обязательная причина, кнопки … */
}
```

### Форма коммита

Прежняя форма верна по существу; добавлены три вещи. Тип изменения выбирается
как **действие + род сущности** (раздел о коммитах), а не одним списком из
четырёх пунктов без удаления. К каждому изменению прикладывается `baseVersion`
той сущности, которую правщик видел, — иначе столкновения нечем ловить. И на
ответ `409 conflict` форма показывает, что именно разошлось, предлагая
пересобрать коммит поверх нынешнего состояния.

---

## Безопасность

### Пароли

`bcrypt` с ценой 10 заменён на `argon2id` с явными настройками; там, где
`argon2` недоступен, `bcrypt` с ценой не ниже 12. Требования к паролю
проверяются на сервере (не меньше 12 знаков, отказ по списку самых частых),
а не только в форме.

```js
// server/auth/password.js
import argon2 from 'argon2';

const OPTS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const hashPassword   = pw => argon2.hash(pw, OPTS);
export const verifyPassword = (hash, pw) => argon2.verify(hash, pw).catch(() => false);

// Холостой хеш: при неизвестном email сверка всё равно выполняется, чтобы
// время ответа не выдавало, существует ли запись.
export const DUMMY_HASH = await argon2.hash('нет такого пользователя', OPTS);
```

### Сессии

JWT здесь не даёт ничего. Довод «не ходить в базу» не работает: каждый запрос и
так читает пользователя, чтобы узнать про бан и роль. Зато JWT приносит
неотзываемость. Поэтому токен **непрозрачный**, хранится хешем, ищется по хешу.

```js
// server/auth/sessions.js
import crypto from 'node:crypto';

const TTL_DAYS = 30;
const sha256 = t => crypto.createHash('sha256').update(t).digest();

export async function createSession(client, { userId, ip, userAgent }) {
  const token = crypto.randomBytes(32).toString('base64url');
  const { rows: [s] } = await client.query(`
    INSERT INTO user_sessions (user_id, token_sha256, ip_address, user_agent, expires_at)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '${TTL_DAYS} days')
    RETURNING session_id`, [userId, sha256(token), ip, userAgent]);
  return { token, sessionId: s.session_id };
}

/** Поиск ПО ХЕШУ ТОКЕНА. В первой редакции сессия искалась по user_id,
 *  а token_hash не сверялся никогда — отзыв не работал вовсе. */
export async function sessionByToken(db, token) {
  if (!token) return null;
  const { rows } = await db.query(`
    SELECT s.session_id, s.user_id, u.*
      FROM user_sessions s JOIN users u USING (user_id)
     WHERE s.token_sha256 = $1
       AND s.revoked_at IS NULL AND s.expires_at > NOW()`, [sha256(token)]);
  return rows[0] ?? null;
}

export const revokeSession = (client, sessionId) => client.query(
  `UPDATE user_sessions SET revoked_at = NOW() WHERE session_id = $1`, [sessionId]);
```

```js
// server/auth/middleware.js
import { userFromRow } from '../db/mapper.js';
import { sessionByToken } from './sessions.js';
import { isUsable } from '../access/access.js';

export async function attachUser(req, _res, next) {
  try {
    const token = req.cookies?.session ?? null;
    const row = await sessionByToken(req.db, token);
    if (!row) { req.user = null; return next(); }

    const user = userFromRow(row);          // ← единственная дверь
    if (!isUsable(user)) { req.user = null; return next(); }

    req.user = user;
    req.sessionId = row.session_id;
    touchSession(req.db, row.session_id);   // без await: не задерживать ответ
    next();
  } catch (e) { next(e); }
}
```

Отсутствие входа — это `req.user = null`, а не ошибка: гость вправе смотреть
граф. Отказ выдаёт застава там, где право требуется.

### Двухшаговый вход

Для роли, способной назначить другого администратора, пароля мало. Устройство:
TOTP по RFC 6238; секрет шифруется в базе ключом из окружения, а не лежит
открытым; при заведении выдаются одноразовые коды восстановления — они хранятся
хешами и гасятся при использовании. WebAuthn лучше по существу, но требует
железа и усложняет восстановление, поэтому он вторым способом, а не первым.

```sql
ALTER TABLE users
  ADD COLUMN mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN mfa_secret_enc  BYTEA,
  ADD COLUMN mfa_enabled_at  TIMESTAMPTZ;

CREATE TABLE mfa_recovery_codes (
  code_id   BIGSERIAL PRIMARY KEY,
  user_id   UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  code_hash BYTEA NOT NULL,
  used_at   TIMESTAMPTZ
);

-- Частичная сессия: та, что прошла пароль, но не прошла второй шаг.
ALTER TABLE user_sessions
  ADD COLUMN mfa_pending BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN mfa_passed_at TIMESTAMPTZ;
```

Три места, где здесь обычно ошибаются.

**Окно между шагами.** После верного пароля выдаётся **не сессия**, а частичная
(`mfa_pending = TRUE`), которая не даёт ничего, кроме права предъявить код.
Иначе промежуток между шагами оказывается полноценной сессией — и второй шаг
становится украшением.

```js
export function attachUser(/* … */) {
  /* … */
  if (row.mfa_pending) { req.user = null; req.mfaPending = row.session_id; return next(); }
  /* … */
}
```

**Курица и яйцо.** Требовать заведённый второй шаг **до** назначения
администратором нельзя: первого администратора заводит `bootstrap-admin`, и
требовать с него нечего. Поэтому назначение проходит, а учётная запись входит в
состояние «требуется двухшаговый вход»: смотреть можно всё, опасное — ничего.
Проверка живёт там же, где остальные, — в `effectivePermissions` (раздел 5), а
не двенадцатью отдельными условиями по коду.

**Подтверждение шага для опасного.** Смена роли, бан и удаление требуют кода,
предъявленного в последние пятнадцать минут: украденная сессия сотрудника без
этого равна украденной системе.

```js
export const requireFreshMfa = (minutes = 15) => (req, _res, next) => {
  const passed = req.session?.mfaPassedAt;
  if (!passed || Date.now() - +new Date(passed) > minutes * 60_000) {
    return next(Object.assign(new Error('Подтвердите вход одноразовым кодом'),
                              { status: 401, code: 'mfa_required' }));
  }
  next();
};

app.post('/api/users/:userId/role',
  requireAuth, requireFreshMfa(), requirePermission(P.MANAGE_EDITORS), roleHandler);
```

### Cookie и CSRF

```js
const SESSION_COOKIE = {
  httpOnly: true,                    // из localStorage токен крадёт любой XSS
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 3600 * 1000,
};
// Плюс обычная (читаемая) cookie `csrf` со случайным значением; всякий
// изменяющий запрос обязан прислать её же в заголовке X-CSRF-Token.
export function checkCsrf(req, _res, next) {
  if (req.method === 'GET' || req.method === 'HEAD') return next();
  const fromCookie = req.cookies?.csrf;
  const fromHeader = req.get('X-CSRF-Token');
  if (!fromCookie || fromCookie !== fromHeader) {
    return next(Object.assign(new Error('Не сошёлся признак CSRF'), { status: 403 }));
  }
  next();
}
```

### Вход и регистрация

```js
// server/auth/service.js
export async function register(pool, { username, email, password, displayName, ip, ua }) {
  assertPasswordPolicy(password);

  return withTransaction(pool, async client => {
    let row;
    try {
      // Единственность держит ИНДЕКС, а не предварительный SELECT: между
      // проверкой и вставкой первой редакции помещалась чужая регистрация.
      ({ rows: [row] } = await client.query(`
        INSERT INTO users (username, email, password_hash, display_name, role)
        VALUES ($1, $2, $3, $4, 'viewer') RETURNING *`,
        [username, email, await hashPassword(password), displayName ?? null]));
    } catch (e) {
      if (e.code === '23505') {
        // Наружу — общий ответ: раздельный выдал бы, какие адреса заняты.
        throw Object.assign(new Error(
          'Если такой адрес свободен, письмо для подтверждения отправлено'),
          { status: 202, code: 'registration_pending' });
      }
      throw e;
    }

    // Сессия выдаётся ТУТ ЖЕ: в первой редакции регистрация возвращала токен,
    // под который не было сессии, и первый же запрос получал 401.
    const { token } = await createSession(client, { userId: row.user_id, ip, userAgent: ua });
    await client.query(`INSERT INTO notification_preferences (user_id) VALUES ($1)`,
                       [row.user_id]);
    await sendVerificationEmail(client, row);
    return { user: userFromRow(row, { viewer: userFromRow(row) }), token };
  });
}

export async function login(pool, { email, password, ip, ua }) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE lower(email) = lower($1) AND deleted_at IS NULL`,
    [email]);
  const row = rows[0] ?? null;

  // Сверка идёт ВСЕГДА — с холостым хешем, если записи нет.
  const ok = await verifyPassword(row?.password_hash ?? DUMMY_HASH, password);
  if (!row || !ok) {
    throw Object.assign(new Error('Неверный адрес или пароль'), { status: 401 });
  }

  // О бане сообщаем ПОСЛЕ проверки пароля: иначе состояние чужой записи
  // узнаётся по одному лишь адресу.
  if (row.is_banned) {
    throw Object.assign(new Error('Учётная запись заблокирована: ' + row.ban_reason),
                        { status: 403 });
  }
  if (!row.is_active) {
    throw Object.assign(new Error('Учётная запись отключена'), { status: 403 });
  }

  return withTransaction(pool, async client => {
    const { token } = await createSession(client,
      { userId: row.user_id, ip, userAgent: ua });
    await client.query(`UPDATE users SET last_login = NOW() WHERE user_id = $1`,
                       [row.user_id]);
    await audit(client, { actor: userFromRow(row), action: 'auth.login',
                          subjectType: 'user', subjectId: row.user_id, ip });
    return { user: userFromRow(row, { viewer: userFromRow(row) }), token };
  });
}
```

Выход гасит **текущую** сессию (`revokeSession(req.sessionId)`), а не все:
в первой редакции `logout` на одном устройстве выбрасывал человека со всех.
Для «выйти везде» есть отдельный ход.

Первый администратор заводится не через API: `npm run bootstrap-admin` при
пустой таблице. Открытая ветка «первый зарегистрировавшийся становится
администратором» — известный способ потерять систему в первые же сутки.

### Ограничение частоты

```js
const ipLimiter   = rateLimit({ windowMs: 15*60_000, max: 300, keyGenerator: ipOf });
const authLimiter = rateLimit({ windowMs: 15*60_000, max: 20,  keyGenerator: ipOf });

// Лимит по IP не спасает от перебора с множества адресов и заодно бьёт по
// целым сетям за одним NAT. Поэтому второй счёт — ПО УЧЁТНОЙ ЗАПИСИ,
// с растущей задержкой.
async function accountThrottle(req, res, next) {
  const key = `login:${String(req.body?.email ?? '').toLowerCase()}`;
  const fails = await redis.incr(key);
  if (fails === 1) await redis.expire(key, 3600);
  if (fails > 10) {
    return next(Object.assign(new Error('Слишком много попыток, попробуйте позже'),
                              { status: 429 }));
  }
  res.on('finish', () => { if (res.statusCode < 400) redis.del(key); });
  next();
}

app.use('/api/auth', authLimiter);      // до общего, иначе общий сработает первым
app.use('/api',      ipLimiter);
app.post('/api/auth/login', accountThrottle, loginHandler);
```

**ПОСТРОЕНО ИНАЧЕ, И ОДНУ ПОЛОВИНУ ЗАБЫЛИ (найдено аудитом 10 сентября
2026).** Redis в проекте нет, счёт живёт в памяти процесса
(`src/auth/throttle.js`, надпись об этом стоит в самой шапке); ограничения
`express-rate-limit` по IP тоже нет — по IP считается только регистрация,
`REGISTER_LIMIT`. Счёт по учётной записи был написан целиком, проверен
`auth_probe` — и **не звался из `login` ни разу**: перебор пароля по одной
записи не ограничивался ничем. Служба работала, проба её хвалила, а
возможности не было — тот самый род дыры, ради которого заведён
`exposure_probe`; он её не увидел, потому что `throttle` записан во
«внутренние», и прибору велено туда не смотреть. Заслон вписан в
`auth/service.js`, и — важнее самой правки — в `auth_probe` добавлены
утверждения, которые спрашивают **вход**, а не счётчик: прежние были зелены
именно потому, что спрашивали счётчик.

### Заголовки и ввод

```js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],           // без 'unsafe-inline': разметка графа
                                        // переведена на делегирование
      styleSrc:   ["'self'"],
      imgSrc:     ["'self'", 'data:'],  // сторонние аватары не грузим
      connectSrc: ["'self'", 'wss://api.example.com'],
      frameAncestors: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
app.use(express.json({ limit: '256kb' }));
```

`xss-clean` убран: пакет заброшен автором, и, главное, он лечит не ту болезнь.
Ввод не «чистится» — он **проверяется по схеме** (`zod` или равноценное) на
входе и **экранируется при выводе**: React делает это сам, письма — через
`esc()` (раздел о письмах).

### Аватары

По умолчанию аватара нет вовсе: рисунок **порождается из идентификатора**
(identicon) прямо в браузере. Ноль хранения, ноль загрузок, ноль перечисленных
ниже забот — для сообщества правщиков философского графа этого, скорее всего,
и довольно. Загрузку стоит заводить, если попросят.

Чего нельзя делать ни в каком случае — это хранить произвольный `avatar_url` и
подставлять его в `<img src>`, как было в первой редакции. Два разных вреда.
Первый: каждый, кто откроет список пользователей, сходит запросом на чужой
сервер, и владелец того сервера увидит время и адреса всех ваших читателей, а
картинку сможет подменить когда угодно. Второй, злее: если **сервер** сам
пойдёт по этому адресу — сделать миниатюру, проверить размер, — адрес можно
указать внутренний (`http://localhost:5432`, `http://169.254.169.254/`), и
чужими руками сервер сходит туда, куда снаружи хода нет.

Если загрузка всё же нужна: файл принимается к себе; тип определяется **по
содержимому**, а не по расширению и не по заголовку `Content-Type`; картинка
пережимается (это заодно срезает всё вложенное); кладётся под своим именем и
отдаётся со своего домена — тогда в CSP остаётся `img-src 'self'`. Ограничение
нужно и по весу файла, и **по числу точек**: изображение 40 000 × 40 000 весит
килобайты и кладёт пережимающий процесс.

### WebSocket

```js
// server/ws/manager.js
export class WebSocketManager {
  static byUser = new Map();            // userId → Set<ws>, а НЕ один ws

  static async handleUpgrade(request, socket, head) {
    // Аутентификация при РУКОПОЖАТИИ: соединение не может жить неизвестным.
    const token = parseCookie(request.headers.cookie)?.session;
    const row = await sessionByToken(db, token);
    if (!row || !isUsable(userFromRow(row))) return deny(socket, 401);
    if (!originAllowed(request.headers.origin)) return deny(socket, 403);
    wss.handleUpgrade(request, socket, head,
      ws => this.attach(ws, userFromRow(row), row.session_id));
  }

  static attach(ws, user, sessionId) {
    ws.user = user; ws.sessionId = sessionId; ws.isAlive = true;
    if (!this.byUser.has(user.userId)) this.byUser.set(user.userId, new Set());
    this.byUser.get(user.userId).add(ws);       // второе устройство НЕ выбивает первое

    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('message', raw => {
      let msg; try { msg = JSON.parse(raw); } catch { return; }   // не роняем процесс
      if (msg.type === 'ping') ws.send('{"type":"pong"}');
    });
    ws.on('close', () => {
      const set = this.byUser.get(user.userId);
      set?.delete(ws);
      if (set && set.size === 0) this.byUser.delete(user.userId);
    });
  }

  static toUser(userId, message) {
    for (const ws of this.byUser.get(userId) ?? []) {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
    }
  }
}

// Мёртвые соединения выметаются: без этого Map растёт молча.
setInterval(() => {
  for (const set of WebSocketManager.byUser.values())
    for (const ws of set) {
      if (!ws.isAlive) { ws.terminate(); continue; }
      ws.isAlive = false; ws.ping();
    }
}, 30_000);
```

При нескольких работниках соединения живут в разных процессах, поэтому
доставка идёт через Redis pub/sub: работник исходящих публикует, каждый узел
рассылает своим. В первой редакции Redis стоял в рекомендациях по развёртыванию,
а в коде — `Map` в памяти одного процесса; при двух работниках половина
уведомлений не дошла бы.

Сессия, отозванная баном или понижением, рвёт и сокеты: `revokeSessions`
публикует `session-revoked`, узлы закрывают соответствующие соединения.
---

## Чем это стережётся: пробы

Документ, в котором дефекты нашлись запуском, обязан оставить после себя
запуск. Ниже — состав приёмки серверной части. Каждая проба отвечает на вопрос,
который в первой редакции остался без ответа.

### Строение (без БД и без сети)

| Проба | Что утверждает | Какой дефект стерегла бы |
|---|---|---|
| `matrix_matches_roles` | напечатанная матрица прав совпадает с `permissionMatrix()` | № 9: иерархия в пяти местах |
| `every_permission_used` | каждое право из `P` хоть раз спрашивается в коде (`assertCan`/`can`/`requirePermission`) | № 7: 10 прав объявлены и мертвы |
| `every_type_has_spec` | у каждого типа из `N` есть запись в `CATALOG`, и наоборот | № 13: 4 мёртвых типа |
| `every_type_has_sender` | каждый тип хоть раз зовётся в `notify(...)` | № 13 |
| `every_type_has_template` | у каждого типа есть образец письма | молчаливое падение доставки |
| `rows_stay_in_db` | ни одно `rows[0]` и ни одна змеиная запись поля не встречается вне `server/db/` | № 1: корень половины бед |
| `no_second_truth` | в `users` нет колонок настроек уведомлений; в схеме нет `commits_created` | № 15, 31 |
| `tx_signature` | функция, пишущая в БД внутри `withTransaction`, называет первый довод `client` | № 24 |
| `merge_rules` | восемнадцать утверждений о трёхстороннем сравнении (раздел 6) | № 36: столкновения не разбирались |
| `narrowing_rules` | неподтверждённый не создаёт коммитов, не заведший второй шаг не банит | новые ограничения раздела 5 |

### Правила (чистые функции, без окружения)

Тринадцать утверждений, на которых сломалась первая редакция, — здесь они
стали пробой. Проба **зовёт те же функции**, что и служба, а не пересказывает
их условия: пересказ уже однажды дал ложное согласие в приборе типослепой меры.

```
   забаненный пользователь из строки БД не действует
   администратор не может управлять сам собой
   администратор не может понизить сам себя
   забаненный администратор не меняет роли
   отсутствующий актор даёт отказ, а не исключение
   модератор не рецензирует собственный коммит
   viewer НЕ получает уведомление о чужой роли
   viewer получает уведомление о СВОЕЙ роли
   администратор узнаёт о смене СВОЕЙ роли
   мёртвых типов уведомлений 0
   прав, объявленных и ни разу не спрошенных 0
   матрица прав сходится с ROLES
   набор администратора собран перечислением, а не Object.values(P)
```

К ним добавились восемнадцать утверждений о слиянии — «правили одинаково» даёт
`same`, «по-разному» даёт `conflict`, перестановка рубрик правкой не считается,
регистр значим, столкнувшееся поле названо поимённо. Все они спрашивают
`mergeField` и `mergeEntityChange`, а не пересказывают таблицу трёх случаев.
Подлог проверен и на них: если убрать пропуск нетронутых полей или заменить
равенство множеств равенством массивов — набор краснеет.

### С базой

- **последний администратор**: два одновременных понижения — второе получает
  409, а не «администраторов не осталось». Проверяется двумя соединениями,
  а не рассуждением о `FOR UPDATE`;
- **отзыв сессии**: после бана прежний токен получает 401 — и по HTTP, и по
  WebSocket;
- **столкновение**: два коммита с одинаковым `baseVersion` — второй уходит в
  `conflicted`, граф не тронут наполовину;
- **исходящие**: падение почты не откатывает действие и не теряет уведомление —
  запись остаётся в `outbox` и доставляется следующим заходом работника;
- **сводка**: тысяча активных пользователей и один применённый коммит дают одну
  строку в `broadcasts`, а не тысячу.

### Что проба сказать НЕ может — и как это выяснилось

Набор из двадцати четырёх утверждений выше был проверен подлогом, и подлог
вскрыл изъян в самой пробе. Утверждение «новое право не достаётся
администратору молча» было **пустым**: списки прав вычисляются при загрузке
модуля, поэтому добавление имени в `P` после неё не двигает ничего, как
устройство ни ломай. Проба отвечала «сошлось» и при перечислении, и при
`[...Object.values(P)]`.

Лечение — сменить вопрос, а не подпереть ответ: спрашивать не поведение, а
**текст** `roles.js` (собран ли набор администратора перечислением). После
правки тот же подлог даёт расхождение.

Второе, что проба не ловит: подлог «убрать `AND is_active` из отбора
получателей» она пропускает — отбор идёт запросом, а в чистой пробе вместо БД
стоит заглушка. Этот вопрос принадлежит пробам с базой, и делать вид, что он
покрыт, нельзя.

### Подложенная поломка

Каждая новая проба проверяется не тем, что она зелёная, а нарочно внесённой
поломкой — и поломкой **правдоподобной**, какую внёс бы человек, а не такой,
от которой всё падает. Для этого набора: ослабить условие в `canActOn` на
`>=`; убрать `AND is_active` из отбора получателей; заменить `token_sha256` на
`user_id` в `sessionByToken`. Если проба этого не заметила — она пересказывает
правило вместо того, чтобы его спрашивать.

---

## Как это прикладывается к ΦilosΦaira

Вопрос стоял так: надо ли менять состав модулей приложения или всё делается
надстройкой. Ответ измерен по дереву, а не прикинут.

### Что показал замер

```
canEdit() зовётся в 11 местах, в 6 модулях:
  modal/entry.js 3 · modal/philosopher-view.js 3 · modal/core.js 2
  graph/click-actions.js 2 · render/interactions.js 1 · modal/edit-rights.js 1
core/session.js ввозят: main.js и 6 модулей (все — modal/, graph/, render/)

изменения базы: ВОСЕМЬ мест, все в modal/persist.js, все зовут afterDataChange
data/mutate.js ввозит ровно один модуль: modal/persist.js
modal/persist.js ввозят только реестры действий ui/actions-byname.js и actions-dyn.js
afterDataChange уже извещает шину: emit('data-changed', what)

metrics/ (18), render/ (15), stats/ (5), filters/ (3), paths/ (5), widgets/, util/
  — не ввозят ни session.js, ни save.js, ни persist.js, ни mutate.js: НИ ОДИН
```

Иначе говоря, у приложения уже есть ровно те три шва, которые нужны
многопользовательскому режиму, и они узкие:

| Шов | Где | Что через него проходит |
|---|---|---|
| **право** | `canEdit()` в `core/session.js` (этаж 0) | «можно ли править» — 11 мест спрашивают одну функцию |
| **изменение** | `afterDataChange` в `data/mutate.js` (этаж 1) | всякая правка базы, восемь входов |
| **приход извне** | тот же `afterDataChange` | чужая правка входит той же дверью, что и своя |

### Ответ: надстройка, но не чистая

**Переставлять существующие модули не придётся.** Ни одно имя не меняет дома,
ни один модуль не переезжает, слои не трогаются. Это следует из замера: право и
правка уже собраны в единые точки, а два верхних этажа (`modal/`, `ui/`) как
раз и предназначены для новых панелей.

**Но три вещи придётся сделать, и надстройкой их не назовёшь:**

1. **Добавить модули** — а значит, вписать новые имена в
   `decisions/assign_names.json`. Сборка иначе встанет с перечнем, и это
   хорошо: новая сущность требует явного решения (readme §4).

   | Модуль | Этаж | Зачем |
   |---|---|---|
   | `core/backend.js` | 0 | транспорт: два воплощения — местное (как сейчас) и серверное. Всё остальное о выборе не знает |
   | `core/perms.js` | 0 | `can(permission)` вместо `canEdit()`; состав прав приходит с сервера |
   | `data/commit-draft.js` | 1 | собирает описание изменения (`action`, `kind`, `entityId`, `baseVersion`, `data`) |
   | `data/remote.js` | 1 | принимает приращение графа от сервера и заводит его в `afterDataChange` |
   | `ui/notifications.js` | 6 | колокол, список, живое соединение |
   | `modal/commits.js` | 5 | свои коммиты и очередь модерации |
   | `modal/users.js` | 5 | управление пользователями |

   Правило слоёв соблюдается: `modal/` (5) и `ui/` (6) ввозят вниз;
   `data/remote.js` (1) ввозит `core/backend.js` (0) — вниз; `core/backend.js`
   не ввозит ничего выше нуля. Рёбер снизу вверх не появляется — это
   проверяется `layers.mjs ввозы`, а не обещанием.

2. **Дописать список событий шины.** `BUS_EVENTS` в `core/events.js` —
   закрытый перечень, и `emit` неизвестного события ругается вслух. Нужны:
   `session-changed`, `commit-submitted`, `commit-reviewed`,
   `notification-arrived`, `graph-updated-remotely`. Это правка одного списка на
   этаже 0.

3. **Перестроить внутренности `modal/persist.js`** — единственная настоящая
   работа. Сейчас каждая из восьми точек делает «изменить `DATA` → позвать
   `afterDataChange`». Для режима с модерацией правка редактора не должна
   попадать в `DATA` вовсе: она должна стать **описанием**, уйти на сервер и
   ждать решения. Значит, восемь мест обязаны сперва собрать описание, а
   применять или отправлять его будет распорядитель:

   ```js
   // было:  DATA.concepts.push(...); DATA.nodes.push(...); afterDataChange(...)
   // стало: submitChange({ action:'add', kind:'concept', data:{...} })
   //        — а уж он либо применит на месте (местный режим или прямая правка
   //          обладателя REVIEW_COMMIT), либо отправит коммитом и ничего
   //          не тронет
   ```

   Это правка одного модуля, но восьми мест в нём, и она задевает поведение,
   а не устройство — значит, эталоны разметки сдвинутся законно, а вот
   утверждения о должном обязаны быть расширены **до** правки, а не после.

### Чего это НЕ трогает

`metrics/`, `render/`, `stats/`, `filters/`, `paths/`, `widgets/`, `util/` — семь
слоёв, около семидесяти модулей из ста пятнадцати — не задеваются вовсе.
Правится примерно **800 строк из 17 982** (`persist.js` 363, `auth.js` 162,
`mutate.js` 89, `save.js` 72, `edit-rights.js` 53, `events.js` 43,
`session.js` 14) — 4,5 % дерева. Остальное продолжает считать метрики и рисовать
граф, ничего не зная о пользователях.

### Три обстоятельства проекта, которые нельзя обойти

**Первое: правка вносится в исходник, а не в `app/`.** Клиентская часть
многопользовательского режима обязана быть написана в
`source/philosophy_graph_v3.html` — иначе следующая сборка её сотрёт (readme
§5). А значит, одностраничный файл вырастет ещё на панель уведомлений, очередь
модерации и управление пользователями. Он уже 31 404 строки.

**Второе: одностраничная версия — эталон приёмки.** Пока она действующая,
приборы сравнивают сборку с ней. Значит, многопользовательский режим обязан
быть **отключаемым**: без сервера страница работает ровно как сегодня
(`core/backend.js` в местном воплощении, `canEdit()` через `admin`/`admin`), и
все нынешние 145 утверждений остаются верными. Режим включается наличием
сервера, а не пересборкой.

**Третье: серверная часть лежит вне конвейера.** `server/` — рукотворное, как
`decisions/` и `tools/`, и в терминах readme §12 это **решение**, а не
производное: восстановить его пересборкой нельзя. Ему нужна своя приёмка
(раздел 12) и своё место в цепочке `accept_all.sh`.

Отсюда честный вывод, который стоит проговорить отдельно. **Многопользовательский
режим — первый настоящий довод отпустить одностраничную версию.** Readme §10
называет это «развилкой на будущее» и советует начинать заранее; здесь она
перестаёт быть будущим. Но отпускать её **сейчас** не надо: сначала —
надстройка при живом эталоне, чтобы приёмка не осталась без второй стороны в
тот самый заход, когда меняется поведение. Отпускать одностраничную версию имеет
смысл тогда, когда утверждения о должном покроют то, что сегодня покрывает
сравнение сторон.

### Порядок работ

0. **Идентификаторы связям** — до всего прочего и без всякого сервера. Правка
   исходника (первого рода: правится предмет), перенос 1624 связей, две точки
   адресации в `modal/persist.js`, одна строка в `core/graph-index.js`, где
   `DATA.links` собирается из `DATA.relations`. Проверяемое предсказание:
   поле, которого никто не рисует, **не должен сдвинуть ни один эталон** —
   если сдвинул, значит задето что-то ещё, и это надо понять до продолжения.
1. `server/` отдельно, со своей приёмкой: права, уведомления, сессии, коммиты —
   без единой правки приложения. Проверяется пробами раздела 12.
2. `core/backend.js` в местном воплощении + `core/perms.js`: `canEdit()`
   становится `can('create_commit')`, поведение не меняется ни на снимок.
   Приёмка обязана пройти **без сдвига эталонов** — если сдвинулась, значит
   тронуто поведение, а не устройство.
3. `modal/persist.js`: восемь мест переводятся на описание изменения; местное
   воплощение применяет его немедленно. Снова без сдвига эталонов.
4. Только теперь — серверное воплощение `backend.js`, `data/remote.js` и панели.
   Здесь эталоны разметки сдвинутся законно, и переутверждать их надо, помня
   правило о трёх прогонах (readme §6): панели задевают разметку, но не
   величины с задержкой, — значит, довольно одного прогона и сличения сторон.

Шаги 2 и 3 нарочно сделаны так, чтобы приёмка была зелёной **до** появления
сервера: перестройка, которую нельзя проверить, — это перестройка, о которой
узнаёшь на публикации.

---

## Чем построенное разошлось с этим документом

Двенадцать мест, где замысел пришлось поправить делом. Каждое найдено
пробой или прибором, а не размышлением, и потому стоит здесь: следующий
читатель должен видеть предмет, а не намерение.

**Словарь прав один на обе стороны.** Страница звала своё право
`edit_graph`, сервер такого не знает — он присылает `create_commit`. Права
«приходили снаружи» и не совпадали ни с одним заслоном; те молча
закрывались. Одно слово, одно место (заход 4.1).

**Заслон последнего администратора блокирует ВЕСЬ набор**, включая предмет
действия. Набросок 1.2 запирал «всех, кроме предмета» — казалось, запирать
надо тех, чьё исчезновение опасно. Ручная гонка двумя соединениями
показала: наборы блокировок не пересекались, оба заслона пропускали, а
сделки вставали друг на друге насмерть, и одна умирала по СРОКУ, а не по
правилу (заход 1.5).

**Порядок ключей в наборах не единый.** `relationTypes` держит три
разных порядка, и одна опись их покрывает — но только если `temporal`
стоит перед `ground` и `symmetric`. У философов нашлась одна запись из 57
с полем на чужом месте; приведена к общему виду (заход 2.1).

**У связей не было имён вовсе.** Адресация тройкой «источник — цель — тип»
означала, что смена типа есть смена адреса: история рвётся. Имена выданы
однократным переносом, выведены из содержимого — перенос повторим (0.1).

**Версия графа поднимается ДО записи**, а не после: иначе коммит ставит
сущностям версию, которой ещё нет, и приращение пропускает собственную
правку (2.4).

**Приращение «с нуля» не даёт всей базы.** Сущности после переноса помечены
версией ноль, а приращение отдаёт строго более новые. Первый раз граф
берётся целиком (4.3).

**Живое соединение переоткрывается после входа.** Открывать его только при
запуске бессмысленно: страница тогда ещё гость, а гостю сокета не дают —
рукопожатие требует сеанса. Соединения не было ни у кого, кто вошёл после
загрузки (4.3).

**Шина между узлами — LISTEN/NOTIFY самого Postgres**, а не Redis: база уже
есть, а второе хранилище — это второе, что надо поднимать, стеречь и
чинить. По шине идёт ИЗВЕЩЕНИЕ, а не уведомление: 8000 байт хватает (3.3).

**Прямая правка не извещает об очереди.** `directCommit` заводит коммит, но
очереди не будет — сотрудникам незачем читать «новое изменение на
рассмотрении» о том, что уже применено (3.1).

**Слой HTTP не появился сам.** План полагал, что маршруты возникнут вместе
со службами; беседы 1.1–3.3 написали службы и пробы, а наружу сервер не
смотрел вовсе. Слой заведён в 4.1 — и только тот, без которого клиент не
встаёт.

**Единственная дверь наружу закрывается заставой.** Без серверного режима
`api()` не ходит никуда: обход жмёт все обработчики подряд, и каждый зов на
статическом сервере давал 404 в консоль — то есть изменение поведения
страницы без сервера (4.5).

**`core/backend.js` не заводился в 0.2.** В том заходе ему нечего было
делать, а модуль, который никто не зовёт, есть мёртвая сущность — дерево их
не допускает и проверяет прибором. Транспорт появился в 0.3, когда у него
появилась работа.

## Что осталось нерешённым

Здесь только то, что действительно открыто, — без «умных уведомлений» и прочих
похвал себе, которыми кончалась первая редакция.

- **Согласование с документом о коммитах.** Раздел 6 — минимум, выведенный из
  нужд прав и уведомлений. Если отдельный документ о системе коммитов
  существует, эти два надо свести до начала работ: расхождение между ними будет
  того же сорта, что и разобранное выше.
- **Слияние полей делается, слияние текстов — нет.** Двое правили разные поля —
  сливается само. Двое правили один и тот же абзац по-разному — коммит уходит в
  `conflicted`, и автор пересобирает его. Построчного слияния текста
  (как в `diff3`) здесь нет и, по-моему, не нужно: описания концепций правятся
  целиком, а не строками.
- **Гранулярных прав нет** — права выдаются пакетом по роли. Отложено
  сознательно, и цена отсрочки уже уплачена: всюду спрашивается
  `can(право)`, нигде — `роль === 'moderator'`. Поэтому переход к
  гранулярности будет изменением **способа вычислить набор**
  (`effectivePermissions` подмешает таблицу личных выдач), а не правкой
  одиннадцати мест по дереву.
- **Прав на части графа нет вовсе.** Все редакторы правят весь граф. Если
  понадобится «этот ведёт только немецкую классику» — это область
  ответственности, а не новое право, и устройство у неё другое.
- **Устойчивые идентификаторы связей не выданы.** Без них не встают ни
  `graph_entities`, ни адресация изменений, ни откат (раздел 6, вопрос 1).
  Это первая работа по порядку — и делается она **до** сервера, на
  одностраничной версии.
- **Программы переноса нет.** Схема описана, обратная выгрузка (та, что нужна
  одностраничной версии) — нет; вопросы порядка и посимвольного совпадения
  выгрузки решены на бумаге, но не в коде.
- **Показатели пользователя.** `user_stats` — обычное представление: при каждом
  обращении считается `GROUP BY` по всей таблице коммитов. Пока их тысячи —
  незаметно; когда список пользователей на двадцать строк начнёт соединяться с
  пересчётом по сотням тысяч, станет заметно. «Материализовать» — значит хранить
  посчитанное, и способов три: `MATERIALIZED VIEW` с обновлением по расписанию
  (просто, но показатели отстают, а обновление считает всё заново);
  колонки-счётчики в `users` (быстро и точно, но это ровно тот второй источник
  правды, от которого избавлялся весь документ); отдельная таблица
  `user_counters`, поправляемая в **той же транзакции**, что и смена статуса
  коммита. Стоит выбрать третье — и только после замера. К нему обязательна
  ночная проба, сверяющая счётчики с честным пересчётом по `commits`:
  расхождение будет значить, что завёлся второй путь смены статуса, мимо
  единственного. Лекарство от второго источника правды здесь не запрет, а
  сверка, — потому что запретить производные величины нельзя, а поймать
  расхождение можно.
