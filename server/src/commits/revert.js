// ОТКАТ.
//
// Откат — НЕ действие и не состояние «отменено». Это КОММИТ, обращающий
// другой: у него заполнено reverts, а changes вычислены из отменяемого.
// Так история остаётся честной: видно, кто откатил, когда и почему, и сам
// откат можно откатить тем же ходом.
//
// Обращение изменения:
//   edit   → те же поля, но base и next поменяны местами;
//   add    → delete;
//   delete → add с телом, КОТОРОЕ ЛЕЖИТ В БАЗЕ. Коммит удаления полей не
//            несёт (у удаления их не бывает), но мягкое удаление сохранило
//            тело — оттуда его и берём. Это и есть довод в пользу мягкого
//            удаления, а не только «у коммитов есть автор».
//
// Столкновения работают и здесь, и это правильно: если после коммита кто-то
// правил ту же сущность, откат наткнётся на его правку и уйдёт в conflicted,
// а не перезапишет чужое молча.

import { withTransaction } from '../db/tx.js';
import { lockCommit, markApplied, markConflicted, insertCommit, findCommit }
  from '../db/commits.js';
import { entityBody } from '../db/graph.js';
import { audit } from '../db/users.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';
import { applyCommit } from './apply.js';
import { SETS, SET_BY_KIND } from '../graph/schema.js';
import { Conflict, Forbidden, NotFound } from '../http/errors.js';

/** Построить обращающие изменения. Читает базу — потому и берёт client. */
export async function invertChanges(client, changes) {
  const inverted = [];
  for (const change of changes) {
    if (change.action === 'edit') {
      const fieldPairs = {};
      for (const [имя, з] of Object.entries(change.fields ?? {})) {
        fieldPairs[имя] = { base: з.next, next: з.base };
      }
      inverted.push({ action: 'edit', kind: change.kind, entityId: change.entityId, fields: fieldPairs });
      continue;
    }
    if (change.action === 'add') {
      inverted.push({ action: 'delete', kind: change.kind, entityId: change.entityId, fields: {} });
      continue;
    }
    // delete → add: тело берём из базы, где оно уцелело мягким удалением.
    const prevCount = await entityBody(client, change.kind, change.entityId);
    if (!prevCount) {
      throw new Conflict(
        `Нечего возвращать: сущности ${change.entityId} нет в базе вовсе. ` +
        'Похоже, её удалили не коммитом.');
    }
    const fields = {};
    for (const fieldKey of SETS[SET_BY_KIND[change.kind]].keys) {
      if (fieldKey === 'id') continue;
      if (fieldKey in prevCount.тело) fields[fieldKey] = { base: null, next: prevCount.тело[fieldKey] };
    }
    inverted.push({ action: 'add', kind: change.kind, entityId: change.entityId, fields: fields });
  }
  return inverted;
}

export async function revertCommit(pool, { actor, commitId, reason, ip = null }) {
  assertCan(actor, P.REVERT_COMMIT);
  if (!String(reason ?? '').trim()) {
    throw new Forbidden('Причина отката обязательна: откат тоже правка');
  }

  return withTransaction(pool, async client => {
    const target = await lockCommit(client, commitId);
    if (!target) throw new NotFound('Коммит не найден');
    if (target.status !== 'applied') {
      // Откатывать нечего у того, что не применялось. Совпавший (coincided)
      // тоже не откатывается: он ничего не записал, и «отменять» пришлось бы
      // чужую правку под видом своей.
      throw new Conflict(`Откатить можно только применённый коммит, а он ${target.status}`);
    }

    const inverted = await invertChanges(client, target.changes);
    const revertRecord = await insertCommit(client, {
      authorId: actor.userId,
      message: `Откат: ${String(reason).trim()}`.slice(0, 200),
      authorComment: null,
      changes: inverted,
    });
    await client.query(`UPDATE commits SET reverts = $2 WHERE commit_id = $1`,
      [revertRecord.commitId, commitId]);

    let merged;
    try {
      merged = await applyCommit(client, { changes: inverted, actorId: actor.userId });
    } catch (e) {
      if (!(e instanceof Conflict)) throw e;
      await markConflicted(client, { commitId: revertRecord.commitId,
                                     столкновения: e.details?.столкновения ?? [] });
      await audit(client, { actorId: actor.userId, action: 'commit.revert_conflicted',
                            subjectType: 'commit', subjectId: commitId, ip });
      return { исход: 'conflicted', commitId: revertRecord.commitId,
               столкновения: e.details?.столкновения ?? [] };
    }

    await markApplied(client, { commitId: revertRecord.commitId, статус: merged.исход,
                                версия: merged.версия });
    // Отменённый помечается reverted: иначе его можно откатить дважды и
    // получить возврат правки под видом отката.
    await client.query(`UPDATE commits SET status = 'reverted' WHERE commit_id = $1`,
      [commitId]);
    await audit(client, { actorId: actor.userId, action: 'commit.revert',
                          subjectType: 'commit', subjectId: commitId,
                          payload: { откат: revertRecord.commitId, версия: merged.версия }, ip });
    return { ...merged, commitId: revertRecord.commitId, отменён: commitId };
  });
}

export { findCommit };
