// ВОЗВРАТ СУЩНОСТИ К ВЕРСИИ.
//
// Откат коммита (revert.js) обращает ОДИН коммит: он отвечает на вопрос «эта
// правка была ошибкой». Здесь вопрос другой — «верни мне вот это понятие
// таким, каким оно было в среду»: не одна правка, а состояние.
//
// ЭТО ТОЖЕ КОММИТ, и по тем же доводам, что записаны в шапке revert.js:
// история остаётся честной (видно, кто вернул, когда и почему), и сам возврат
// можно откатить обычным ходом. Сверх того коммит даром получает всё уже
// построенное — проверку base (столкновения), рассылку по сокетам,
// приращение, ленту истории. Отдельный механизм пришлось бы снабжать этим
// заново, то есть завести второе место, где записано одно и то же правило.
//
// ПРИМЕНЯЕТСЯ СРАЗУ, не через очередь рецензирования: мерка та же, что у
// отката коммита, и право то же — REVERT_COMMIT.
//
// ТЕЛО НА ВЕРСИЮ ВОССТАНАВЛИВАЕТСЯ НАЗАД ОТ НЫНЕШНЕГО, а не вперёд от пустоты.
// Вперёд нельзя: сущности из семени графа (graph:import) не имеют ни одного
// коммита, и проигрывание с нуля дало бы у них пустое тело вместо настоящего.
// Нынешнее тело — единственная опора, которой можно верить.

import { withTransaction } from '../db/tx.js';
import { insertCommit, markApplied, markConflicted } from '../db/commits.js';
import { entityBody, entityHistory } from '../db/graph.js';
import { audit } from '../db/users.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';
import { applyCommit } from './apply.js';
import { SETS, SET_BY_KIND } from '../graph/schema.js';
import { Conflict, Forbidden, NotFound } from '../http/errors.js';

/**
 * Тело сущности на указанной версии.
 *
 * Идём НАЗАД от нынешнего тела, обращая правки, легшие после версии. Для
 * `edit` это просто: берём base вместо next.
 *
 * А вот на `add` и `delete` — ОТКАЗ, а не догадка. Если сущность в этом
 * промежутке заводили или удаляли, «вернуть к версии» перестаёт значить
 * что-то одно: возвращать ли её из небытия, стирать ли снова. Молчаливый
 * выбор здесь хуже отказа, а отказ прямой — лучше предупреждения мелким
 * шрифтом. Такие случаи разбираются откатом самих коммитов, где действие
 * названо поимённо.
 */
export async function bodyAtVersion(client, { kind, entityId, version }) {
  const current = await entityBody(client, kind, entityId);
  if (!current) throw new NotFound('Такой сущности в базе нет');
  if (current.удалена) {
    throw new Conflict('Сущность удалена; вернуть её можно откатом того коммита, '
                     + 'которым её удалили');
  }

  const body = { ...current.тело };
  const history = await entityHistory(client, { kind, entityId });
  const later = history.filter(з => Number(з.версия) > Number(version))
                       .sort((а, б) => Number(б.версия) - Number(а.версия));

  for (const commit of later) {
    for (const change of commit.changes ?? []) {
      if (change.kind !== kind || change.entityId !== entityId) continue;
      if (change.action !== 'edit') {
        throw new Conflict(
          `Между версией ${version} и нынешней сущность ${change.action === 'add'
            ? 'заводили' : 'удаляли'} (коммит ${commit.commitId}). `
          + 'Возврат к версии здесь не определён однозначно — разберите это '
          + 'откатом самих коммитов.');
      }
      for (const [fieldKey, пара] of Object.entries(change.fields ?? {})) {
        body[fieldKey] = пара.base;
      }
    }
  }
  return { нынешнее: current.тело, прежнее: body, правок: later.length };
}

export async function revertEntityToVersion(pool, {
  actor, kind, entityId, version, reason, ip = null,
}) {
  assertCan(actor, P.REVERT_COMMIT);
  if (!SET_BY_KIND[kind]) throw new NotFound(`Неизвестный род «${kind}»`);
  if (!Number.isInteger(Number(version)) || Number(version) < 0) {
    throw new Forbidden('Возврат без версии: непонятно, куда возвращать');
  }
  // Причина обязательна ровно по той же причине, что и у отката коммита:
  // возврат тоже правка, и она должна уметь объяснить себя.
  if (!String(reason ?? '').trim()) {
    throw new Forbidden('Причина возврата обязательна: возврат тоже правка');
  }

  return withTransaction(pool, async client => {
    const { нынешнее: now, прежнее: was } =
      await bodyAtVersion(client, { kind, entityId, version: Number(version) });

    // Изменение ОДНО и только по полям, которые на деле разошлись. Писать в
    // коммит все поля подряд значило бы столкнуться с чужой правкой там, где
    // мы ничего не меняем.
    const fields = {};
    for (const fieldKey of SETS[SET_BY_KIND[kind]].keys) {
      if (fieldKey === 'id') continue;
      const before = now[fieldKey] ?? null;
      const after = was[fieldKey] ?? null;
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        fields[fieldKey] = { base: before, next: after };
      }
    }
    if (!Object.keys(fields).length) {
      throw new Conflict(`Сущность и так в том же виде, что на версии ${version}`);
    }

    const changes = [{ action: 'edit', kind, entityId, fields }];
    const record = await insertCommit(client, {
      authorId: actor.userId,
      message: `Возврат ${entityId} к версии ${version}: ${String(reason).trim()}`.slice(0, 200),
      authorComment: null,
      changes,
    });

    let merged;
    try {
      merged = await applyCommit(client, { changes, actorId: actor.userId });
    } catch (e) {
      if (!(e instanceof Conflict)) throw e;
      // Столкновения работают и здесь, и это правильно: если кто-то правил ту
      // же сущность, пока окно истории было открыто, возврат наткнётся на его
      // правку и уйдёт в conflicted, а не перезапишет чужое молча.
      await markConflicted(client, { commitId: record.commitId,
                                     столкновения: e.details?.столкновения ?? [] });
      await audit(client, { actorId: actor.userId, action: 'graph.revert_to_version_conflicted',
                            subjectType: kind, subjectId: entityId, ip });
      return { исход: 'conflicted', commitId: record.commitId,
               столкновения: e.details?.столкновения ?? [] };
    }

    await markApplied(client, { commitId: record.commitId, статус: merged.исход,
                                версия: merged.версия });
    await audit(client, { actorId: actor.userId, action: 'graph.revert_to_version',
                          subjectType: kind, subjectId: entityId,
                          payload: { версия: Number(version), коммит: record.commitId }, ip });
    return { ...merged, commitId: record.commitId, кВерсии: Number(version),
             полей: Object.keys(fields).length };
  });
}
