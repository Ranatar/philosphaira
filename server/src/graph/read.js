// ЧТЕНИЕ ГРАФА: полное состояние и приращение.
//
// Клиент, отставший на одну чужую правку, не должен получать 2200 сущностей.
// Поэтому у состояния есть версия, а у запроса — «с какой».

import { exportAll, graphVersion, changesSince, entityHistory } from '../db/graph.js';
import { SET_BY_KIND, SETS } from './schema.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';

/** Полное состояние. Версия отдаётся ВМЕСТЕ с данными, иначе она бесполезна. */
export async function readGraph(pool, { actor }) {
  assertCan(actor, P.VIEW_GRAPH);
  // Версия берётся ПЕРВОЙ: если её взять после выгрузки, между ними может
  // лечь чужой коммит, и клиент решит, что у него состояние новее, чем есть.
  const version = await graphVersion(pool);
  return { версия: version, наборы: await exportAll(pool) };
}

/**
 * Приращение с версии since. Возвращает изменившиеся сущности с пометкой
 * «удалена»: клиенту нужно узнать, что она исчезла, а не просто перестать
 * её получать.
 */
export async function readGraphSince(pool, { actor, since }) {
  assertCan(actor, P.VIEW_GRAPH);
  const version = await graphVersion(pool);
  const rows = await changesSince(pool, Number(since) || 0);
  return {
    версия: version, с: Number(since) || 0,
    изменения: rows.map(с => ({
      набор: SET_BY_KIND[с.kind],
      kind: с.kind,
      entityId: с.entityId,
      удалена: с.удалена,
      порядок: с.порядок,
      запись: с.удалена ? null : assemble(с.kind, с.entityId, с.тело),
    })),
  };
}

function assemble(kind, entityId, тело) {
  const record = {};
  for (const fieldKey of SETS[SET_BY_KIND[kind]].keys) {
    if (fieldKey === 'id') record.id = entityId;
    else if (fieldKey in тело) record[fieldKey] = тело[fieldKey];
  }
  return record;
}

export function readEntityHistory(pool, { actor, kind, entityId }) {
  assertCan(actor, P.VIEW_COMMIT_HISTORY);
  return entityHistory(pool, { kind, entityId });
}
