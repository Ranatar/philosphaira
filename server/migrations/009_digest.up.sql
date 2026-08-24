-- 009 · Сводка по широковещательным.
--
-- last_digest_at — когда человеку в последний раз отправляли сводку.
-- Без неё «не чаще раза в час» превращается в «на каждое событие»:
-- работник просыпается чаще, чем раз в час, и без отметки шлёт заново.
ALTER TABLE notification_preferences ADD COLUMN last_digest_at TIMESTAMPTZ;

-- Работник может идти в несколько рук; строка исходящих должна достаться
-- ровно одному. claimed_until — до какого времени она занята.
ALTER TABLE outbox ADD COLUMN claimed_until TIMESTAMPTZ;
CREATE INDEX outbox_claim_idx ON outbox (claimed_until) WHERE delivered_at IS NULL;
