-- 005 · Коммиты до рассмотрения.
--
-- Состояния: pending — ждёт рассмотрения; applied — применён; coincided —
-- применён вхолостую (то же самое уже внесли); rejected — отклонён;
-- conflicted — столкнулся с чужим; reverted — отменён другим коммитом.
-- Применение, слияние и откат приходят в 2.3–2.4; здесь — жизнь коммита
-- ДО рассмотрения.
--
-- ДВА ЗАСЛОНА СТОЯТ В СХЕМЕ, А НЕ ТОЛЬКО В КОДЕ. Служба может ошибиться,
-- обход её — тем более; ограничение базы не обойдёшь ни тем, ни другим:
--   * автор не может быть своим рецензентом. Прямая правка обладателем
--     права рассмотрения — НЕ самоодобрение: там reviewed_by пуст, и
--     ограничение это допускает;
--   * отказ без комментария — не отказ, а молчание.

CREATE TYPE commit_status AS ENUM
  ('pending', 'applied', 'coincided', 'rejected', 'conflicted', 'reverted');

CREATE TABLE commits (
  commit_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  status          commit_status NOT NULL DEFAULT 'pending',
  message         VARCHAR(200) NOT NULL CHECK (btrim(message) <> ''),
  author_comment  TEXT,

  -- [{ action, kind, entityId, fields: { поле: { base, next } } }]
  -- Хранятся ОБА значения поля: без «было» нельзя отличить «двое правили
  -- одинаково» от «двое правили по-разному».
  changes         JSONB NOT NULL CHECK (jsonb_typeof(changes) = 'array'
                                        AND jsonb_array_length(changes) > 0),

  reviewed_by     UUID REFERENCES users(user_id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  review_comment  TEXT,
  applied_at      TIMESTAMPTZ,
  applied_version BIGINT,
  reverts         UUID REFERENCES commits(commit_id) ON DELETE SET NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT commits_no_self_review_ck
    CHECK (reviewed_by IS NULL OR reviewed_by <> author_id),
  CONSTRAINT commits_rejected_needs_comment_ck
    CHECK (status <> 'rejected' OR btrim(coalesce(review_comment, '')) <> '')
);

CREATE INDEX commits_pending_idx ON commits (created_at) WHERE status = 'pending';
CREATE INDEX commits_author_idx  ON commits (author_id, created_at DESC);

CREATE TRIGGER commits_touch BEFORE UPDATE ON commits
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Указатель «какие ожидающие коммиты трогают эту сущность». Нужен, чтобы
-- предупреждать правщика ПРИ ОТПРАВКЕ, а не после рассмотрения: половина
-- столкновений снимается тем, что человек узнаёт о чужой правке вовремя.
CREATE INDEX commits_touch_idx ON commits
  USING gin ((changes -> 0)) WHERE status = 'pending';
