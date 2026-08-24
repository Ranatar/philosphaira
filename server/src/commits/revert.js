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
import { НАБОРЫ, НАБОР_ПО_РОДУ } from '../graph/schema.js';
import { Conflict, Forbidden, NotFound } from '../http/errors.js';

/** Построить обращающие изменения. Читает базу — потому и берёт client. */
export async function invertChanges(client, changes) {
  const обратные = [];
  for (const изм of changes) {
    if (изм.action === 'edit') {
      const поля = {};
      for (const [имя, з] of Object.entries(изм.fields ?? {})) {
        поля[имя] = { base: з.next, next: з.base };
      }
      обратные.push({ action: 'edit', kind: изм.kind, entityId: изм.entityId, fields: поля });
      continue;
    }
    if (изм.action === 'add') {
      обратные.push({ action: 'delete', kind: изм.kind, entityId: изм.entityId, fields: {} });
      continue;
    }
    // delete → add: тело берём из базы, где оно уцелело мягким удалением.
    const было = await entityBody(client, изм.kind, изм.entityId);
    if (!было) {
      throw new Conflict(
        `Нечего возвращать: сущности ${изм.entityId} нет в базе вовсе. ` +
        'Похоже, её удалили не коммитом.');
    }
    const поля = {};
    for (const ключ of НАБОРЫ[НАБОР_ПО_РОДУ[изм.kind]].keys) {
      if (ключ === 'id') continue;
      if (ключ in было.тело) поля[ключ] = { base: null, next: было.тело[ключ] };
    }
    обратные.push({ action: 'add', kind: изм.kind, entityId: изм.entityId, fields: поля });
  }
  return обратные;
}

export async function revertCommit(pool, { actor, commitId, reason, ip = null }) {
  assertCan(actor, P.REVERT_COMMIT);
  if (!String(reason ?? '').trim()) {
    throw new Forbidden('Причина отката обязательна: откат тоже правка');
  }

  return withTransaction(pool, async client => {
    const отменяемый = await lockCommit(client, commitId);
    if (!отменяемый) throw new NotFound('Коммит не найден');
    if (отменяемый.status !== 'applied') {
      // Откатывать нечего у того, что не применялось. Совпавший (coincided)
      // тоже не откатывается: он ничего не записал, и «отменять» пришлось бы
      // чужую правку под видом своей.
      throw new Conflict(`Откатить можно только применённый коммит, а он ${отменяемый.status}`);
    }

    const обратные = await invertChanges(client, отменяемый.changes);
    const откат = await insertCommit(client, {
      authorId: actor.userId,
      message: `Откат: ${String(reason).trim()}`.slice(0, 200),
      authorComment: null,
      changes: обратные,
    });
    await client.query(`UPDATE commits SET reverts = $2 WHERE commit_id = $1`,
      [откат.commitId, commitId]);

    let итог;
    try {
      итог = await applyCommit(client, { changes: обратные, actorId: actor.userId });
    } catch (e) {
      if (!(e instanceof Conflict)) throw e;
      await markConflicted(client, { commitId: откат.commitId,
                                     столкновения: e.details?.столкновения ?? [] });
      await audit(client, { actorId: actor.userId, action: 'commit.revert_conflicted',
                            subjectType: 'commit', subjectId: commitId, ip });
      return { исход: 'conflicted', commitId: откат.commitId,
               столкновения: e.details?.столкновения ?? [] };
    }

    await markApplied(client, { commitId: откат.commitId, статус: итог.исход,
                                версия: итог.версия });
    // Отменённый помечается reverted: иначе его можно откатить дважды и
    // получить возврат правки под видом отката.
    await client.query(`UPDATE commits SET status = 'reverted' WHERE commit_id = $1`,
      [commitId]);
    await audit(client, { actorId: actor.userId, action: 'commit.revert',
                          subjectType: 'commit', subjectId: commitId,
                          payload: { откат: откат.commitId, версия: итог.версия }, ip });
    return { ...итог, commitId: откат.commitId, отменён: commitId };
  });
}

export { findCommit };
