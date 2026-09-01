// ЧТЕНИЕ ГРАФА: полное состояние и приращение.
//
// Клиент, отставший на одну чужую правку, не должен получать 2200 сущностей.
// Поэтому у состояния есть версия, а у запроса — «с какой».

import { exportAll, graphVersion, changesSince, entityHistory } from '../db/graph.js';
import { currentLayout } from '../db/layout.js';
import { SET_BY_KIND, SETS } from './schema.js';
import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';

/** Полное состояние. Версия отдаётся ВМЕСТЕ с данными, иначе она бесполезна. */
export async function readGraph(pool, { actor }) {
  assertCan(actor, P.VIEW_GRAPH);
  // Версия берётся ПЕРВОЙ: если её взять после выгрузки, между ними может
  // лечь чужой коммит, и клиент решит, что у него состояние новее, чем есть.
  const version = await graphVersion(pool);
  // Раскладка едет ВМЕСТЕ с графом, одним ответом. Порознь они разъезжаются:
  // страница получила бы новые связи со старыми координатами и на миг
  // показала бы картину, которой не было никогда.
  const раскладка = await currentLayout(pool);
  return {
    версия: version,
    наборы: await exportAll(pool),
    раскладка: раскладка ? { версияГрафа: раскладка.версияГрафа, позиции: раскладка.позиции } : null,
  };
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
  // Раскладка идёт с приращением ТОЛЬКО когда она новее того, что у клиента.
  // Она весит вчетверо больше самого приращения (453 пары чисел против
  // одной-двух сущностей), и слать её на каждое обновление значило бы
  // отменить весь смысл приращения. Дорасклад случается лишь при правках,
  // задевающих состав узлов и связей, — это меньшинство коммитов.
  const раскладка = await currentLayout(pool);
  const нужнаРаскладка = раскладка && раскладка.версияГрафа > (Number(since) || 0);
  return {
    версия: version, с: Number(since) || 0,
    раскладка: нужнаРаскладка
      ? { версияГрафа: раскладка.версияГрафа, позиции: раскладка.позиции }
      : null,
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
