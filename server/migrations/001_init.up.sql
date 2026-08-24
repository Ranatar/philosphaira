-- 001 · Основание: пользователи, сессии, история ролей, журнал действий.
--
-- Что здесь решено, а не переписано из первой редакции документа:
--   * роль — ТИП, а не строка с CHECK: список ролей есть предмет, а порядок
--     в типе задаёт старшинство;
--   * удаление пользователя МЯГКОЕ (deleted_at): у коммитов есть автор, и он
--     обязан остаться названным. Единственность логина и почты держат
--     ЧАСТИЧНЫЕ индексы — иначе удалённый занимал бы адрес навсегда;
--   * все внешние ключи расписаны поимённо с ON DELETE. В первой редакции
--     ON DELETE стоял только у уведомлений, при объявленном праве удаления
--     пользователя — то есть удаление упиралось бы в ключ;
--   * updated_at ведёт триггер, а не восемь мест в коде.

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
  mfa_enabled       BOOLEAN      NOT NULL DEFAULT FALSE,
  mfa_secret_enc    BYTEA,
  mfa_enabled_at    TIMESTAMPTZ,

  registered_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by        UUID,                  -- NULL означает «заведён системой»
  role_changed_at   TIMESTAMPTZ,
  role_changed_by   UUID,

  deleted_at        TIMESTAMPTZ,

  CONSTRAINT users_ban_reason_ck
    CHECK (is_banned = FALSE OR ban_reason IS NOT NULL),
  CONSTRAINT users_created_by_fk
    FOREIGN KEY (created_by)       REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT users_banned_by_fk
    FOREIGN KEY (banned_by)        REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT users_role_changed_by_fk
    FOREIGN KEY (role_changed_by)  REFERENCES users(user_id) ON DELETE SET NULL
);

-- Единственность с оглядкой на мягкое удаление и на регистр: «Ivan» и «ivan»
-- — один и тот же адрес, а освобождённый удалением занимать никого не должен.
CREATE UNIQUE INDEX users_email_uq    ON users (lower(email))    WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX users_username_uq ON users (lower(username)) WHERE deleted_at IS NULL;
CREATE INDEX users_role_idx   ON users (role)      WHERE deleted_at IS NULL;
CREATE INDEX users_active_idx ON users (is_active) WHERE is_active AND NOT is_banned AND deleted_at IS NULL;

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_touch BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- История ролей: и журнал, и источник для «кто кого назначил».
-- reason обязателен НА УРОВНЕ СХЕМЫ: в первой редакции требование жило
-- только в disabled кнопки диалога.
CREATE TABLE role_history (
  history_id  BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  old_role    user_role,
  new_role    user_role NOT NULL,
  changed_by  UUID REFERENCES users(user_id) ON DELETE SET NULL,
  reason      TEXT NOT NULL CHECK (btrim(reason) <> ''),
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX role_history_user_idx ON role_history (user_id, changed_at DESC);

-- Журнал действий. Право «просмотр логов» в первой редакции существовало
-- без единой таблицы, в которую эти логи писались бы.
CREATE TABLE audit_log (
  entry_id     BIGSERIAL PRIMARY KEY,
  actor_id     UUID REFERENCES users(user_id) ON DELETE SET NULL,
  action       VARCHAR(64) NOT NULL,       -- 'user.ban', 'commit.approve', …
  subject_type VARCHAR(32),
  subject_id   TEXT,
  payload      JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX audit_actor_idx   ON audit_log (actor_id, created_at DESC);
CREATE INDEX audit_subject_idx ON audit_log (subject_type, subject_id, created_at DESC);

-- Сессии. Токен НЕПРОЗРАЧНЫЙ и хранится хешем; ищется ПО ХЕШУ, для чего
-- индекс и заведён единственным. В первой редакции сессия искалась по
-- user_id, а token_hash не сверялся никогда — отзыв не работал вовсе.
CREATE TABLE user_sessions (
  session_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_sha256  BYTEA NOT NULL,
  mfa_pending   BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_passed_at TIMESTAMPTZ,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);
CREATE UNIQUE INDEX sessions_token_uq   ON user_sessions (token_sha256);
CREATE INDEX sessions_user_idx    ON user_sessions (user_id)    WHERE revoked_at IS NULL;
CREATE INDEX sessions_expires_idx ON user_sessions (expires_at) WHERE revoked_at IS NULL;
