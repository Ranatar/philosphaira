-- 002 · Подтверждение адреса.
--
-- Токен хранится ХЕШЕМ по той же причине, что и сессионный: утечка таблицы
-- не должна давать возможность подтвердить чужой адрес. Срок — сутки;
-- одноразовость держит колонка used_at, а не удаление строки: по ней видно,
-- что письмо дошло и им воспользовались.
CREATE TABLE email_verifications (
  verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_sha256 BYTEA NOT NULL,
  email        VARCHAR(255) NOT NULL,   -- адрес НА МОМЕНТ ВЫДАЧИ
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  used_at      TIMESTAMPTZ
);
CREATE UNIQUE INDEX email_ver_token_uq ON email_verifications (token_sha256);
CREATE INDEX email_ver_user_idx ON email_verifications (user_id, created_at DESC);
