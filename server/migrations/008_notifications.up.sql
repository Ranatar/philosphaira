-- 008 · Уведомления.
--
-- ДВЕ ДОРОГИ, И ЭТО НАРОЧНО.
-- Адресные (одобрен твой коммит, изменена твоя роль) — строка на человека.
-- Широковещательные (граф изменился) — ОДНА строка на событие, а
-- «прочитано» у них курсор. В первой редакции документа graph_changed клал
-- строку каждому активному пользователю и слал ему письмо — на каждый
-- применённый коммит, последовательным await по SELECT * без пагинации.
-- На тысяче читателей это тысяча вставок и тысяча писем за исправление
-- опечатки в описании связи.
--
-- Колонок email_notifications и push_notifications в users НЕТ и не будет:
-- в первой редакции они существовали одновременно с таблицей настроек,
-- письма читали одни, а API правил другие.

CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  category   VARCHAR(32) NOT NULL,
  priority   VARCHAR(10) NOT NULL DEFAULT 'normal'
             CHECK (priority IN ('low','normal','high')),
  -- is_read, а не read: «read» — слово, занятое смыслом в SQL и в голове.
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  read_at    TIMESTAMPTZ
);
CREATE INDEX notif_unread_idx  ON notifications (user_id, created_at DESC)
  WHERE is_read = FALSE;
CREATE INDEX notif_expires_idx ON notifications (expires_at);

CREATE TABLE broadcasts (
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
  categories    JSONB   NOT NULL DEFAULT '{}'::jsonb,   -- {"graphChanges": false}
  broadcast_seen_id BIGINT NOT NULL DEFAULT 0,          -- курсор широковещательных
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ИСХОДЯЩИЕ. Уведомление складывается сюда В ТОЙ ЖЕ ТРАНЗАКЦИИ, что и само
-- действие, и никуда не отправляется: доставка — забота работника (3.2).
-- В первой редакции падение почты роняло уже совершённую смену роли и
-- выдавало клиенту ошибку на удавшемся действии.
CREATE TABLE outbox (
  outbox_id    BIGSERIAL PRIMARY KEY,
  channel      VARCHAR(20) NOT NULL,     -- notification | broadcast | email
  payload      JSONB NOT NULL,
  attempts     INTEGER NOT NULL DEFAULT 0,
  next_try_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  last_error   TEXT
);
CREATE INDEX outbox_due_idx ON outbox (next_try_at) WHERE delivered_at IS NULL;
