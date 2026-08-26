-- РОДСТВО КОММИТОВ (E-4 плана doc/plan-next.md).
--
-- Исправленный коммит не знал о предшественнике: история распадалась на
-- несвязанные попытки, и «почему в третий раз приняли то, что дважды
-- отклонили» было не восстановить. Ссылка дешевле нитей обсуждения и
-- полезнее их: она отвечает на вопрос о ДЕЛЕ, а не хранит переписку.
--
-- ON DELETE SET NULL, а не CASCADE: удаление предшественника не должно
-- уносить с собой того, кто его исправил.
ALTER TABLE commits
  ADD COLUMN supersedes UUID REFERENCES commits (commit_id) ON DELETE SET NULL;

-- Искать будут «кто исправил вот этот», а не наоборот.
CREATE INDEX commits_supersedes_idx ON commits (supersedes)
  WHERE supersedes IS NOT NULL;

-- Сам себя коммит заменить не может: это была бы петля в истории.
ALTER TABLE commits
  ADD CONSTRAINT commits_supersedes_not_self_ck
  CHECK (supersedes IS NULL OR supersedes <> commit_id);
