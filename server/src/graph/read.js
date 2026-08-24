// ЧТЕНИЕ ГРАФА: полное состояние и приращение.
//
// Клиент, отставший на одну чужую правку, не должен получать 2200 сущностей.
// Поэтому у состояния есть версия, а у запроса — «с какой».

import { exportAll, graphVersion, changesSince, entityHistory } from '../db/graph.js';
import { НАБОР_ПО_РОДУ, НАБОРЫ } from './schema.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';

/** Полное состояние. Версия отдаётся ВМЕСТЕ с данными, иначе она бесполезна. */
export async function readGraph(pool, { actor }) {
  assertCan(actor, P.VIEW_GRAPH);
  // Версия берётся ПЕРВОЙ: если её взять после выгрузки, между ними может
  // лечь чужой коммит, и клиент решит, что у него состояние новее, чем есть.
  const версия = await graphVersion(pool);
  return { версия, наборы: await exportAll(pool) };
}

/**
 * Приращение с версии since. Возвращает изменившиеся сущности с пометкой
 * «удалена»: клиенту нужно узнать, что она исчезла, а не просто перестать
 * её получать.
 */
export async function readGraphSince(pool, { actor, since }) {
  assertCan(actor, P.VIEW_GRAPH);
  const версия = await graphVersion(pool);
  const строки = await changesSince(pool, Number(since) || 0);
  return {
    версия, с: Number(since) || 0,
    изменения: строки.map(с => ({
      набор: НАБОР_ПО_РОДУ[с.kind],
      kind: с.kind,
      entityId: с.entityId,
      удалена: с.удалена,
      порядок: с.порядок,
      запись: с.удалена ? null : собрать(с.kind, с.entityId, с.тело),
    })),
  };
}

function собрать(kind, entityId, тело) {
  const запись = {};
  for (const ключ of НАБОРЫ[НАБОР_ПО_РОДУ[kind]].keys) {
    if (ключ === 'id') запись.id = entityId;
    else if (ключ in тело) запись[ключ] = тело[ключ];
  }
  return запись;
}

export function readEntityHistory(pool, { actor, kind, entityId }) {
  assertCan(actor, P.VIEW_COMMIT_HISTORY);
  return entityHistory(pool, { kind, entityId });
}
