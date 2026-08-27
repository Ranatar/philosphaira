-- СОСТОЯНИЕ ПРОИСХОЖДЕНИЯ (F-2, п. 2 ревизии 27.08).
--
-- Одна строка `provenance` не могла ответить, ПОЧЕМУ источника нет. Пустое
-- поле означало сразу четыре разных положения: не искали, искали и не
-- нашли, собственное построение, прежний источник отвергнут. Различить их
-- было нельзя — а решения составителя они требуют разные.
--
-- ПЕРЕВОД СТАРЫХ ЗАПИСЕЙ ИДЁТ ЗДЕСЬ, А НЕ В КОДЕ: код, доводящий данные при
-- чтении, приходится держать вечно, и однажды кто-то прочтёт мимо него.
--
--   строка начинается с `//`  → editorial_reasoning (прежнее соглашение)
--   строка непуста            → sourced
--   строки нет                → поле не заводится вовсе (= unspecified)
--
-- Поле НЕ ЗАВОДИТСЯ там, где строки нет: сущность без источника должна
-- остаться в выгрузке побайтово прежней, а «не указано» и есть умолчание.
UPDATE graph_entities
   SET data = jsonb_set(
         CASE WHEN data ->> 'provenance' LIKE '//%'
              THEN jsonb_set(data, '{provenance}',
                     to_jsonb(btrim(substring(data ->> 'provenance' from 3))))
              ELSE data END,
         '{provenanceStatus}',
         to_jsonb(CASE WHEN data ->> 'provenance' LIKE '//%'
                       THEN 'editorial_reasoning' ELSE 'sourced' END))
 WHERE data ? 'provenance'
   AND btrim(coalesce(data ->> 'provenance', '')) <> '';
