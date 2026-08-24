DROP INDEX IF EXISTS outbox_claim_idx;
ALTER TABLE outbox DROP COLUMN IF EXISTS claimed_until;
ALTER TABLE notification_preferences DROP COLUMN IF EXISTS last_digest_at;
