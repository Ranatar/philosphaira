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
import { SET_BY_KIND, PROVENANCE_STATUS, PROVENANCE_STATUSES }
  from '../graph/schema.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { Forbidden, Conflict, NotFound } from '../http/errors.js';

const ACTIONS = ['add', 'edit', 'delete'];
const KINDS = Object.keys(SET_BY_KIND);

/**
 * Проверка описания. Отказ ГРОМКИЙ и поимённый: «неверный коммит» не
 * говорит правщику ничего, а починить он должен сам.
 */
export function assertChanges(changes) {
  if (!Array.isArray(changes) || changes.length === 0) {
    throw new Forbidden('Коммит без изменений: описывать нечего');
  }
  const entityKeys = new Set();
  changes.forEach((и, i) => {
    const where = `изменение ${i + 1}`;
    if (!ACTIONS.includes(и?.action)) {
      throw new Forbidden(`${where}: неизвестное действие «${и?.action}»`);
    }
    if (!KINDS.includes(и?.kind)) {
      throw new Forbidden(`${where}: неизвестный род сущности «${и?.kind}»`);
    }
    if (typeof и.entityId !== 'string' || !и.entityId.trim()) {
      throw new Forbidden(`${where}: пустой адрес сущности`);
    }
    const entityKey = `${и.kind}\u0000${и.entityId}`;
    if (entityKeys.has(entityKey)) {
      // Два изменения одной сущности в одном коммите — это спор с самим
      // собой: какое из них верно, не знает никто, включая автора.
      throw new Forbidden(`${where}: сущность ${и.entityId} правится дважды в одном коммите`);
    }
    entityKeys.add(entityKey);

    const fieldNames = и.fields ?? {};
    if (и.action === 'delete') {
      if (Object.keys(fieldNames).length) {
        throw new Forbidden(`${where}: у удаления не бывает полей`);
      }
      return;
    }
    if (!Object.keys(fieldNames).length) {
      throw new Forbidden(`${where}: нет ни одного изменённого поля`);
    }
    for (const [имя, з] of Object.entries(fieldNames)) {
      if (!з || typeof з !== 'object' || !('base' in з) || !('next' in з)) {
        throw new Forbidden(
          `${where}, поле ${имя}: нужны ОБА значения — base и next. ` +
          'Без «было» нельзя отличить одинаковую правку от разной.');
      }
    }
    assertProvenance(fieldNames, where);
  });
  return changes;
}

/**
 * СОСТОЯНИЕ ПРОИСХОЖДЕНИЯ СОГЛАСНО СО СТРОКОЙ.
 *
 * Состояние, расходящееся со строкой, хуже отсутствия состояния: оно
 * УТВЕРЖДАЕТ то, чего нет. `sourced` без ссылки говорит «источник есть», а
 * его нет; `unspecified` при заполненной строке говорит «не искали», хотя
 * искали и нашли. Проверяется здесь, а не в окне: окно можно обойти ходом.
 */
function assertProvenance(fields, where) {
  const status = fields.provenanceStatus?.next;
  const citation = 'provenance' in fields
    ? String(fields.provenance.next ?? '').trim()
    : null;

  if (status != null && !PROVENANCE_STATUSES.includes(status)) {
    throw new Forbidden(`${where}: неизвестное состояние происхождения «${status}»`);
  }
  if (status == null) return;   // состояние не трогают — судить не о чем

  const hasCitation = citation !== null ? citation.length > 0 : undefined;
  if (hasCitation === undefined) return;   // строку не трогают, проверить нечем

  if (status === PROVENANCE_STATUS.SOURCED && !hasCitation) {
    throw new Forbidden(
      `${where}: состояние «источник есть», а строка источника пуста`);
  }
  if (status === PROVENANCE_STATUS.UNSPECIFIED && hasCitation) {
    throw new Forbidden(
      `${where}: состояние «не указано», а строка источника заполнена`);
  }
}

export async function createCommit(pool, { actor, message, authorComment = null,
                                           changes, supersedes = null,
                                           ip = null, наРассмотрение = true }) {
  assertCan(actor, P.CREATE_COMMIT);
  if (!message || !String(message).trim()) {
    throw new Forbidden('Коммит без сообщения: рецензенту нечего читать');
  }
  assertChanges(changes);

  // РОДСТВО ПРОВЕРЯЕТСЯ, А НЕ ПРИНИМАЕТСЯ НА ВЕРУ. Заменять можно только
  // СВОЙ и только УЖЕ РАССМОТРЕННЫЙ коммит: ссылка на чужой выдала бы его
  // существование, а ссылка на ожидающий значила бы, что автор подал два
  // захода разом вместо того, чтобы поправить первый.
  if (supersedes != null) {
    const previous = await findCommit(pool, supersedes);
    if (!previous || previous.authorId !== actor.userId) {
      throw new Forbidden('Заменять можно только свой коммит');
    }
    if (previous.status === 'pending') {
      throw new Forbidden(
        'Этот коммит ещё ждёт рассмотрения — поправьте его, а не заводите второй');
    }
  }

  // Предупреждение, а НЕ отказ: чужая правка того же поля — повод узнать о
  // ней, а не запрет отправлять. Решать столкновение будет применение.
  const overlaps = await overlappingPending(pool, { authorId: actor.userId, changes });

  return withTransaction(pool, async client => {
    const commit = await insertCommit(client,
      { authorId: actor.userId, message: String(message).trim(),
        authorComment, changes, supersedes });
    await audit(client, { actorId: actor.userId, action: 'commit.create',
                          subjectType: 'commit', subjectId: commit.commitId,
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
        commitId: commit.commitId, message: commit.message });
    }
    return { коммит: commit, пересечения: overlaps };
  });
}

export async function editOwnCommit(pool, { actor, commitId, message,
                                            authorComment, changes, ip = null }) {
  assertCan(actor, P.EDIT_OWN_PENDING_COMMIT);
  if (changes !== undefined) assertChanges(changes);

  return withTransaction(pool, async client => {
    const ownPending = await findOwnPendingForUpdate(client,
      { commitId, authorId: actor.userId });
    // Один ответ на два случая нарочно: «чужой» и «уже рассмотрен» не должны
    // различаться снаружи — иначе по ответу узнаётся, что чужой коммит есть.
    if (!ownPending) throw new NotFound('Нет такого коммита среди ваших ожидающих');

    const updated = await updateOwnCommit(client, {
      commitId,
      message: message === undefined ? ownPending.message : String(message).trim(),
      authorComment: authorComment === undefined ? ownPending.authorComment : authorComment,
      changes: changes === undefined ? ownPending.changes : changes,
    });
    await audit(client, { actorId: actor.userId, action: 'commit.edit',
                          subjectType: 'commit', subjectId: commitId, ip });
    return updated;
  });
}

export async function deleteOwnCommit(pool, { actor, commitId, ip = null }) {
  assertCan(actor, P.DELETE_OWN_PENDING_COMMIT);
  return withTransaction(pool, async client => {
    const ownPending = await findOwnPendingForUpdate(client,
      { commitId, authorId: actor.userId });
    if (!ownPending) throw new NotFound('Нет такого коммита среди ваших ожидающих');
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
  const commit = await findCommit(pool, commitId);
  if (!commit) throw new NotFound('Коммит не найден');
  const isOwn = commit.authorId === actor?.userId;
  const othersPending = commit.status === 'pending' && !isOwn;
  // Чужой ожидающий виден только тому, кто вправе его рассматривать.
  if (othersPending) assertCan(actor, P.VIEW_PENDING_COMMITS);
  else assertCan(actor, P.VIEW_COMMIT_HISTORY);
  return commit;
}

export { overlappingPending, Conflict };
