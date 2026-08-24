// РАССМОТРЕНИЕ КОММИТА И ПРЯМАЯ ПРАВКА.
//
// Различение, без которого система не работает вовсе:
//
//   САМООДОБРЕНИЕ запрещено — автор не может стоять в reviewed_by ни при
//   какой роли. Заслон стоит и в коде, и в схеме.
//
//   ПРЯМАЯ ПРАВКА — не самоодобрение. Обладатель права рассмотрения вправе
//   править граф без очереди: тогда коммит записывается сразу применённым,
//   рецензент ПУСТ, а в журнале стоит отдельное действие commit.direct.
//   Без этого единственный администратор не смог бы изменить ничего.
//
// Совпавшая правка НЕ отклоняется. Коммит применяется вхолостую и получает
// состояние coincided: человек сделал работу и пришёл к тому же выводу
// независимо — это ценный факт для истории, а не ошибка.

import { withTransaction } from '../db/tx.js';
import { findCommit, lockCommit, markRejected, markConflicted, markApplied }
  from '../db/commits.js';
import { audit } from '../db/users.js';
import { assertCan, assertNotSelfReview } from '../access/access.js';
import { P } from '../access/roles.js';
import { applyCommit } from './apply.js';
import { createCommit } from './service.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { Conflict, Forbidden, NotFound } from '../http/errors.js';

export async function reviewCommit(pool, { actor, commitId, action, comment = null,
                                           ip = null }) {
  assertCan(actor, P.REVIEW_COMMIT);
  if (action !== 'approve' && action !== 'reject') {
    throw new Forbidden(`Неизвестное решение «${action}»: approve или reject`);
  }
  if (action === 'reject' && !String(comment ?? '').trim()) {
    throw new Forbidden('Отказ без комментария — не отказ, а молчание');
  }

  return withTransaction(pool, async client => {
    const коммит = await lockCommit(client, commitId);
    if (!коммит) throw new NotFound('Коммит не найден');
    if (коммит.status !== 'pending') {
      throw new Conflict(`Коммит уже рассмотрен: ${коммит.status}`);
    }
    assertNotSelfReview(actor, коммит);

    if (action === 'reject') {
      await markRejected(client, { commitId, reviewerId: actor.userId,
                                   comment: String(comment).trim() });
      await audit(client, { actorId: actor.userId, action: 'commit.reject',
                            subjectType: 'commit', subjectId: commitId, ip });
      await notify(client, N.COMMIT_REJECTED, {
        authorId: коммит.authorId, commitId,
        reviewerName: actor.username, comment: String(comment).trim() });
      return { исход: 'rejected' };
    }

    let итог;
    try {
      итог = await applyCommit(client, { changes: коммит.changes, actorId: коммит.authorId });
    } catch (e) {
      if (!(e instanceof Conflict)) throw e;
      // Столкновение — не отказ рецензента и не ошибка автора: это
      // состояние коммита. Разбор кладём рядом, чтобы автор видел, ЧТО
      // разошлось, и мог пересобрать поверх нынешнего.
      await markConflicted(client, { commitId, reviewerId: actor.userId,
                                     столкновения: e.details?.столкновения ?? [] });
      await audit(client, { actorId: actor.userId, action: 'commit.conflicted',
                            subjectType: 'commit', subjectId: commitId,
                            payload: { столкновений: e.details?.столкновения?.length ?? 0 }, ip });
      await notify(client, N.COMMIT_CONFLICTED, {
        authorId: коммит.authorId, commitId,
        столкновения: e.details?.столкновения ?? [] });
      return { исход: 'conflicted', столкновения: e.details?.столкновения ?? [] };
    }

    await markApplied(client, { commitId, статус: итог.исход,
                                reviewerId: actor.userId, comment, версия: итог.версия });
    await audit(client, { actorId: actor.userId,
                          action: итог.исход === 'coincided' ? 'commit.coincided' : 'commit.approve',
                          subjectType: 'commit', subjectId: commitId,
                          payload: { применено: итог.применено, версия: итог.версия }, ip });
    await notify(client,
      итог.исход === 'coincided' ? N.COMMIT_COINCIDED : N.COMMIT_APPROVED,
      { authorId: коммит.authorId, commitId, reviewerName: actor.username });
    if (итог.исход === 'applied') {
      await notify(client, N.GRAPH_CHANGED,
        { commitId, версия: итог.версия, применено: итог.применено });
    }
    return итог;
  });
}

/**
 * Прямая правка: коммит заводится и применяется сразу, рецензент пуст.
 * Право то же, что на рассмотрение, — и это осмысленно: кто вправе одобрять
 * чужое, тот вправе вносить своё без очереди.
 */
export async function directCommit(pool, { actor, message, authorComment = null,
                                           changes, ip = null }) {
  assertCan(actor, P.REVIEW_COMMIT);
  // наРассмотрение: false — очереди не будет, извещать о ней некого.
  const { коммит, пересечения } = await createCommit(pool,
    { actor, message, authorComment, changes, ip, наРассмотрение: false });

  return withTransaction(pool, async client => {
    let итог;
    try {
      итог = await applyCommit(client, { changes, actorId: actor.userId });
    } catch (e) {
      if (!(e instanceof Conflict)) throw e;
      await markConflicted(client, { commitId: коммит.commitId,
                                     столкновения: e.details?.столкновения ?? [] });
      return { исход: 'conflicted', commitId: коммит.commitId,
               столкновения: e.details?.столкновения ?? [], пересечения };
    }
    await markApplied(client, { commitId: коммит.commitId, статус: итог.исход,
                                версия: итог.версия });
    await audit(client, { actorId: actor.userId, action: 'commit.direct',
                          subjectType: 'commit', subjectId: коммит.commitId,
                          payload: { применено: итог.применено }, ip });
    if (итог.исход === 'applied') {
      await notify(client, N.GRAPH_CHANGED,
        { commitId: коммит.commitId, версия: итог.версия, применено: итог.применено });
    }
    return { ...итог, commitId: коммит.commitId, пересечения };
  });
}

export { findCommit };
