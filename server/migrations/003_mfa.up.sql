-- 003 · Коды восстановления второго шага.
--
-- Хранятся ХЕШАМИ и гасятся при использовании: одноразовость держит колонка
-- used_at, а не удаление строки — по ней видно, что кодом воспользовались,
-- и когда. Колонки mfa_* у пользователя и mfa_pending у сессии заведены
-- миграцией 001: место под второй шаг было оставлено сразу.
CREATE TABLE mfa_recovery_codes (
  code_id    BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  code_sha256 BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at    TIMESTAMPTZ
);
CREATE UNIQUE INDEX mfa_code_uq   ON mfa_recovery_codes (code_sha256);
CREATE INDEX mfa_code_user_idx    ON mfa_recovery_codes (user_id) WHERE used_at IS NULL;
