-- Обратный ход возвращает соглашение с двумя косыми и убирает поле.
UPDATE graph_entities
   SET data = (data - 'provenanceStatus')
       || CASE WHEN data ->> 'provenanceStatus' = 'editorial_reasoning'
               THEN jsonb_build_object('provenance', '// ' || (data ->> 'provenance'))
               ELSE '{}'::jsonb END
 WHERE data ? 'provenanceStatus';
