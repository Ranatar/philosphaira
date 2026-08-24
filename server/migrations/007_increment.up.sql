-- 007 · Приращение и откат.
--
-- changed_at_version — версия графа, НА КОТОРОЙ сущность стала такой.
-- Без неё «дай, что изменилось с версии N» превращается в «дай всё»:
-- 2200 сущностей на каждое чужое исправление опечатки.
--
-- Удалённые из приращения НЕ исключаются: клиенту нужно узнать, что
-- сущность исчезла, а не просто перестать её получать.
ALTER TABLE graph_entities ADD COLUMN changed_at_version BIGINT NOT NULL DEFAULT 0;
CREATE INDEX graph_since_idx ON graph_entities (changed_at_version);
