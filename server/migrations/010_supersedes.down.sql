ALTER TABLE commits DROP CONSTRAINT IF EXISTS commits_supersedes_not_self_ck;
DROP INDEX IF EXISTS commits_supersedes_idx;
ALTER TABLE commits DROP COLUMN IF EXISTS supersedes;
