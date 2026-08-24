// КОММИТЫ ДО РАССМОТРЕНИЯ.
//
// Что здесь есть: создание, правка и удаление СВОЕГО, пока он ждёт;
// свой список; очередь на рассмотрение; предупреждение о чужой правке того
// же поля. Само рассмотрение, слияние и откат — беседы 2.3–2.4.
//
// Описание изменения приходит в том же виде, в каком его строит приложение
// (беседа 0.3): { action, kind, entityId, fields: { поле: { base, next } } }.
// Оба значения поля хранятся нарочно — без «было» нельзя отличить «двое
// правили одинаково» от «двое правили по-разному».

import { withTransaction } from '../db/tx.js';
import { paginate } from '../db/paginate.js';
import { insertCommit, findCommit, findOwnPendingForUpdate, updateOwnCommit,
         deleteCommit, overlappingPending, commitsFrom, commitsSelect,
         commitToApi } from '../db/commits.js';
import { audit } from '../db/users.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';
import { НАБОР_ПО_РОДУ } from '../graph/schema.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { Forbidden, Conflict, NotFound } from '../http/errors.js';

const ДЕЙСТВИЯ = ['add', 'edit', 'delete'];
const РОДЫ = Object.keys(НАБОР_ПО_РОДУ);

/**
 * Проверка описания. Отказ ГРОМКИЙ и поимённый: «неверный коммит» не
 * говорит правщику ничего, а починить он должен сам.
 */
export function assertChanges(changes) {
  if (!Array.isArray(changes) || changes.length === 0) {
    throw new Forbidden('Коммит без изменений: описывать нечего');
  }
  const адреса = new Set();
  changes.forEach((и, i) => {
    const где = `изменение ${i + 1}`;
    if (!ДЕЙСТВИЯ.includes(и?.action)) {
      throw new Forbidden(`${где}: неизвестное действие «${и?.action}»`);
    }
    if (!РОДЫ.includes(и?.kind)) {
      throw new Forbidden(`${где}: неизвестный род сущности «${и?.kind}»`);
    }
    if (typeof и.entityId !== 'string' || !и.entityId.trim()) {
      throw new Forbidden(`${где}: пустой адрес сущности`);
    }
    const адрес = `${и.kind}\u0000${и.entityId}`;
    if (адреса.has(адрес)) {
      // Два изменения одной сущности в одном коммите — это спор с самим
      // собой: какое из них верно, не знает никто, включая автора.
      throw new Forbidden(`${где}: сущность ${и.entityId} правится дважды в одном коммите`);
    }
    адреса.add(адрес);

    const поля = и.fields ?? {};
    if (и.action === 'delete') {
      if (Object.keys(поля).length) {
        throw new Forbidden(`${где}: у удаления не бывает полей`);
      }
      return;
    }
    if (!Object.keys(поля).length) {
      throw new Forbidden(`${где}: нет ни одного изменённого поля`);
    }
    for (const [имя, з] of Object.entries(поля)) {
      if (!з || typeof з !== 'object' || !('base' in з) || !('next' in з)) {
        throw new Forbidden(
          `${где}, поле ${имя}: нужны ОБА значения — base и next. ` +
          'Без «было» нельзя отличить одинаковую правку от разной.');
      }
    }
  });
  return changes;
}

export async function createCommit(pool, { actor, message, authorComment = null,
                                           changes, ip = null, наРассмотрение = true }) {
  assertCan(actor, P.CREATE_COMMIT);
  if (!message || !String(message).trim()) {
    throw new Forbidden('Коммит без сообщения: рецензенту нечего читать');
  }
  assertChanges(changes);

  // Предупреждение, а НЕ отказ: чужая правка того же поля — повод узнать о
  // ней, а не запрет отправлять. Решать столкновение будет применение.
  const пересечения = await overlappingPending(pool, { authorId: actor.userId, changes });

  return withTransaction(pool, async client => {
    const коммит = await insertCommit(client,
      { authorId: actor.userId, message: String(message).trim(),
        authorComment, changes });
    await audit(client, { actorId: actor.userId, action: 'commit.create',
                          subjectType: 'commit', subjectId: коммит.commitId,
                          payload: { изменений: changes.length }, ip });
    // Уведомление складывается ТОЙ ЖЕ транзакцией и никуда не отправляется.
    //
    // Но только если коммит и вправду ВСТАЁТ В ОЧЕРЕДЬ. Прямая правка тоже
    // заводит коммит — и первый набросок звал сюда же, извещая сотрудников
    // «новый коммит на рассмотрении» о том, что уже применено. Проба нашла
    // это на лишней адресной строке.
    if (наРассмотрение) {
      await notify(client, N.NEW_COMMIT_PENDING, {
        authorId: actor.userId, authorName: actor.username,
        commitId: коммит.commitId, message: коммит.message });
    }
    return { коммит, пересечения };
  });
}

export async function editOwnCommit(pool, { actor, commitId, message,
                                            authorComment, changes, ip = null }) {
  assertCan(actor, P.EDIT_OWN_PENDING_COMMIT);
  if (changes !== undefined) assertChanges(changes);

  return withTransaction(pool, async client => {
    const был = await findOwnPendingForUpdate(client,
      { commitId, authorId: actor.userId });
    // Один ответ на два случая нарочно: «чужой» и «уже рассмотрен» не должны
    // различаться снаружи — иначе по ответу узнаётся, что чужой коммит есть.
    if (!был) throw new NotFound('Нет такого коммита среди ваших ожидающих');

    const стал = await updateOwnCommit(client, {
      commitId,
      message: message === undefined ? был.message : String(message).trim(),
      authorComment: authorComment === undefined ? был.authorComment : authorComment,
      changes: changes === undefined ? был.changes : changes,
    });
    await audit(client, { actorId: actor.userId, action: 'commit.edit',
                          subjectType: 'commit', subjectId: commitId, ip });
    return стал;
  });
}

export async function deleteOwnCommit(pool, { actor, commitId, ip = null }) {
  assertCan(actor, P.DELETE_OWN_PENDING_COMMIT);
  return withTransaction(pool, async client => {
    const был = await findOwnPendingForUpdate(client,
      { commitId, authorId: actor.userId });
    if (!был) throw new NotFound('Нет такого коммита среди ваших ожидающих');
    await deleteCommit(client, commitId);
    await audit(client, { actorId: actor.userId, action: 'commit.delete',
                          subjectType: 'commit', subjectId: commitId, ip });
    return { ok: true };
  });
}

/** Свои коммиты — все, в любом состоянии. Право на них есть у всякого автора. */
export function listMine(pool, { actor, status, page = 1, limit = 20 }) {
  assertCan(actor, P.VIEW_COMMIT_HISTORY);
  const where = ['c.author_id = $1'];
  const params = [actor.userId];
  if (status) { params.push(status); where.push(`c.status = $${params.length}::commit_status`); }
  return paginate(pool, {
    from: commitsFrom, select: commitsSelect, where, params,
    order: 'c.created_at DESC', page, limit, map: commitToApi,
  });
}

/**
 * Очередь на рассмотрение. Отдельное право: редактор своих коммитов видит
 * сколько угодно, а чужих ожидающих — ни одного.
 */
export function listPending(pool, { actor, page = 1, limit = 20 }) {
  assertCan(actor, P.VIEW_PENDING_COMMITS);
  return paginate(pool, {
    from: commitsFrom, select: commitsSelect,
    where: [`c.status = 'pending'`], params: [],
    order: 'c.created_at ASC', page, limit, map: commitToApi,   // первым пришёл — первым рассмотрен
  });
}

export async function getCommit(pool, { actor, commitId }) {
  const коммит = await findCommit(pool, commitId);
  if (!коммит) throw new NotFound('Коммит не найден');
  const свой = коммит.authorId === actor?.userId;
  const мойЧужой = коммит.status === 'pending' && !свой;
  // Чужой ожидающий виден только тому, кто вправе его рассматривать.
  if (мойЧужой) assertCan(actor, P.VIEW_PENDING_COMMITS);
  else assertCan(actor, P.VIEW_COMMIT_HISTORY);
  return коммит;
}

export { overlappingPending, Conflict };
