-- 004 · Граф в базе.
--
-- Шесть JSON приложения становятся ОДНОЙ таблицей. Их прежний вид остаётся
-- ПРОЕКЦИЕЙ: обратная выгрузка обязана давать те же файлы ПОСИМВОЛЬНО, иначе
-- одностраничная версия перестанет быть действующей, а первый же перенос
-- даст расхождение на тысячи строк, в котором настоящих правок не разглядеть.
--
-- ЧЕТЫРЕ РЕШЕНИЯ, без которых перенос не встаёт:
--
-- 1. ord — ЯВНЫЙ порядок. Массив упорядочен, таблица нет; без колонки порядка
--    каждая выгрузка выходила бы иной, и сравнение сторон в приёмке начало бы
--    врать на пустом месте.
-- 2. data — JSONB БЕЗ ключа id: он и так лежит в entity_id, а два места для
--    одного знания расходятся. При выгрузке id ставится обратно первым.
--    ОГОВОРКА: jsonb не хранит порядок ключей, поэтому порядок полей внутри
--    записи задаётся описью KEYS в src/graph/schema.js, а не базой.
-- 3. Мягкое удаление и здесь: откат коммита должен уметь воскресить сущность,
--    а строка, удалённая физически, не воскресает.
-- 4. graph_state.version — общий счётчик состояния: по нему клиент понимает,
--    что отстал, и просит приращение вместо всей базы.

CREATE TYPE entity_kind AS ENUM
  ('concept', 'relation', 'philosopher', 'tradition', 'rubric', 'relationType');

CREATE TABLE graph_entities (
  kind        entity_kind NOT NULL,
  entity_id   TEXT        NOT NULL,
  ord         INTEGER     NOT NULL,
  version     INTEGER     NOT NULL DEFAULT 1,
  data        JSONB       NOT NULL,
  deleted_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES users(user_id) ON DELETE SET NULL,
  PRIMARY KEY (kind, entity_id)
);
CREATE INDEX graph_alive_idx ON graph_entities (kind, ord) WHERE deleted_at IS NULL;

CREATE TABLE graph_state (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  version   BIGINT  NOT NULL DEFAULT 0
);
INSERT INTO graph_state (singleton) VALUES (TRUE) ON CONFLICT DO NOTHING;
