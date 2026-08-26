/**
 * ПОСЛЕДСТВИЯ КОММИТА ДЛЯ СТРОЕНИЯ ГРАФА (E-3 плана doc/plan-next.md).
 *
 * ЗАЧЕМ. Рецензент видит перечень изменений — «удалить концепцию X», — но не
 * видит, ЧТО ПРИ ЭТОМ СТАНЕТ С ГРАФОМ. Между тем на клиенте такие
 * предупреждения давно есть и хороши: окно правки говорит автору, сколько
 * концепций и связей исчезнет вместе с философом, кто останется без связей,
 * какие концепции пропадут бесследно. Беда в том, что видит их ТОЛЬКО АВТОР
 * и ТОЛЬКО в миг правки. К рассмотрению они не доходят: рецензенту достаётся
 * голый список изменений.
 *
 * Здесь то же знание считается НА СЕРВЕРЕ и по коммиту — то есть доступно
 * тому, кто решает, а не только тому, кто предлагает.
 *
 * ЧТО СЧИТАЕТСЯ, А ЧТО НЕТ. Только СТРОЕНИЕ: каскад, изоляция, связность.
 * Метрики (посредничество, сходство, рейтинги) не считаются нарочно — они
 * живут в браузере, версии у них нет, и предпросмотр по ним требует сперва
 * решить, как хранить наблюдения (E-2). Строение же считается обходом графа
 * и стоит дёшево.
 */

import { SET_BY_KIND } from './schema.js';

/** Собрать relations по concepts: id → массив связей. */
function byConcept(relations) {
  const map = new Map();
  for (const rel of relations) {
    for (const end of [rel.source, rel.target]) {
      if (!map.has(end)) map.set(end, []);
      map.get(end).push(rel);
    }
  }
  return map;
}

/** На сколько кусков распадается граф. */
function componentCount(concepts, relations) {
  const neighbors = new Map(concepts.map(c => [c.id, []]));
  for (const rel of relations) {
    if (neighbors.has(rel.source) && neighbors.has(rel.target)) {
      neighbors.get(rel.source).push(rel.target);
      neighbors.get(rel.target).push(rel.source);
    }
  }
  const seen = new Set();
  let count = 0;
  for (const [start] of neighbors) {
    if (seen.has(start)) continue;
    count++;
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      for (const neighbor of neighbors.get(queue.pop()) ?? []) {
        if (!seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); }
      }
    }
  }
  return count;
}

/**
 * Последствия набора изменений для нынешнего графа.
 *
 * @param sets  выгрузка графа (concepts, relations, philosophers …)
 * @param changes изменения коммита в том же виде, в каком они хранятся
 */
export function impactOf(sets, changes) {
  const concepts = sets.concepts ?? [];
  const relations = sets.relations ?? [];
  const philosophers = sets.philosophers ?? [];
  const byId = new Map(concepts.map(c => [c.id, c]));
  const edgesOf = byConcept(relations);

  const gone = { concepts: new Set(), relations: new Set(), philosophers: new Set() };

  for (const change of changes ?? []) {
    if (change.action !== 'delete') continue;
    const set = SET_BY_KIND[change.kind];
    if (set === 'concepts') {
      gone.concepts.add(change.entityId);
      // Связи гибнут вместе с концом — это и есть каскад, о котором окно
      // правки предупреждает автора.
      for (const rel of edgesOf.get(change.entityId) ?? []) gone.relations.add(rel.id);
    } else if (set === 'relations') {
      gone.relations.add(change.entityId);
    } else if (set === 'philosophers') {
      gone.philosophers.add(change.entityId);
      for (const c of concepts) {
        if (c.philosopher !== change.entityId) continue;
        gone.concepts.add(c.id);
        for (const rel of edgesOf.get(c.id) ?? []) gone.relations.add(rel.id);
      }
    }
  }

  const conceptsAfter = concepts.filter(c => !gone.concepts.has(c.id));
  const relationsAfter = relations.filter(rel => !gone.relations.has(rel.id)
    && !gone.concepts.has(rel.source) && !gone.concepts.has(rel.target));
  const edgesAfter = byConcept(relationsAfter);

  // ОСИРОТЕВШИЕ — те, кто ИМЕЛ связи и остался без них. Концепция, изолированная
  // и до правки, здесь ни при чём: она не пострадала, и называть её значило бы
  // разбавлять предупреждение шумом.
  const orphaned = conceptsAfter
    .filter(c => (edgesOf.get(c.id) ?? []).length > 0
              && (edgesAfter.get(c.id) ?? []).length === 0)
    .map(c => ({ id: c.id, label: c.label }));

  const partsBefore = componentCount(concepts, relations);
  const partsAfter = componentCount(conceptsAfter, relationsAfter);

  return {
    gone: {
      concepts: [...gone.concepts].map(id => ({
        id, label: byId.get(id)?.label ?? null })),
      relations: [...gone.relations],
      philosophers: [...gone.philosophers],
    },
    // Каскад: сколько связей уходит СВЕРХ прямо названных в коммите.
    cascaded: [...gone.relations].filter(id =>
      !(changes ?? []).some(change => change.action === 'delete'
        && SET_BY_KIND[change.kind] === 'relations' && change.entityId === id)).length,
    orphaned,
    connectivity: { before: partsBefore, after: partsAfter, splits: partsAfter > partsBefore },
    // Пусто — не значит «считать не стали»: это ответ «строение не тронуто».
    philosophersTouched: philosophers.filter(ph => gone.philosophers.has(ph.id)).length,
  };
}
