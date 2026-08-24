DROP INDEX IF EXISTS graph_since_idx;
ALTER TABLE graph_entities DROP COLUMN IF EXISTS changed_at_version;
