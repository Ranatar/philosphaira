-- Откат 001. Порядок обратный накату: сперва зависимые, потом users, потом тип.
-- Откат существует не ради красоты: без него нельзя проверить, что накат
-- полон — а проверяется это накатом на чистой базе после отката.
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS role_history;
DROP TRIGGER IF EXISTS users_touch ON users;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS touch_updated_at();
DROP TYPE IF EXISTS user_role;
