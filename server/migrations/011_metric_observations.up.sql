-- ЗАМЕРЫ МЕТРИК (E-2 плана doc/plan-next.md).
--
-- Хранится НЕ метрика, а НАБЛЮДЕНИЕ: что намерил такой-то человек тогда-то
-- при таких-то условиях. Сервер не считает и не судит — он помнит. Доверие
-- к числу даёт не то, что его посчитал сервер, а то, что условия записаны и
-- замер воспроизводим.
--
-- КЛЮЧ УСЛОВИЙ — ЧЕТЫРЕ ВЕЛИЧИНЫ, А НЕ ОДНА. Версии графа мало: то же число
-- при иных флагах, ином охвате или иной формуле означает другое. Сравнивать
-- позволено лишь замеры, у которых совпало всё, кроме версии графа, — иначе
-- ряд выглядит историей ГРАФА, а окажется историей наших правок КОДА.
CREATE TABLE metric_observations (
  observation_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric          TEXT        NOT NULL,
  graph_version   BIGINT      NOT NULL,
  formula_version INT         NOT NULL,
  -- Флаги и охват — отпечатком, а не перечнем: перечень выбранных философов
  -- бывает в полсотни имён, а сравнивают его целиком, и только на равенство.
  flags           TEXT        NOT NULL,
  scope_hash      TEXT        NOT NULL,
  scope_note      TEXT,                  -- «вся база», «античность» — для глаза
  values          JSONB       NOT NULL,  -- верхние N и сводка
  note            TEXT,                  -- зачем замеряли
  author_id       UUID        NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Замер без сводки бесполезен: по одному верхнему десятку нельзя сказать,
  -- сдвинулась ли метрика вся или только её вершина.
  CONSTRAINT metric_observations_values_ck
    CHECK (jsonb_typeof(values -> 'summary') = 'object')
);

-- Ищут двумя способами: «все замеры этой метрики» и «сравнимые с этим».
CREATE INDEX metric_observations_metric_idx
  ON metric_observations (metric, created_at DESC);
CREATE INDEX metric_observations_comparable_idx
  ON metric_observations (metric, formula_version, flags, scope_hash);
