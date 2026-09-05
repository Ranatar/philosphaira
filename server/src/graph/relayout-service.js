// ПЕРЕКЛАДКА ГРАФА — служба.
//
// ПОЧЕМУ СЛУЖБА, А НЕ ПРОСТО СКРИПТ. Первая редакция жила целиком в
// scripts/relayout.mjs, и проба извещений законно покраснела: род
// layout_changed объявлен, а создаёт его никто — она смотрит в службы, а не
// в скрипты. Упрёк верный не формально: когда перекладка станет кнопкой в
// панели коммитов, ход должен быть ОДИН, а не переписан заново рядом.
// Скрипт остаётся тонкой оболочкой над этими двумя ходами.
//
// ПОЧЕМУ ХОД ДВУХТАКТНЫЙ. Перекладка меняет то, что люди видят глазами. Она
// необратима не технически — прежняя раскладка хранится, — а ПО ВОСПРИЯТИЮ:
// ориентировка в графе теряется у всех сразу, и вернуть координаты легче,
// чем вернуть спокойствие. Поэтому «посчитать и показать меру» и «применить»
// — разные ходы, и первый ничего не пишет.
import { withTransaction } from '../db/tx.js';
import { exportAll, graphVersion } from '../db/graph.js';
import { currentLayout, saveLayout, layoutById } from '../db/layout.js';
import { audit } from '../db/users.js';
import { notify } from '../notify/notify.js';
import { N } from '../notify/catalog.js';
import { fullLayout, divergence } from './layout.js';

/**
 * Посчитать полную раскладку и оценить, насколько она разойдётся с нынешней.
 * НИЧЕГО НЕ ПИШЕТ. Возвращает и сами координаты, и меру, и список уехавших
 * дальше всех — это те числа, по которым человек принимает решение.
 */
export async function relayoutPlan(db) {
  const graphVer = await graphVersion(db);
  const previous = await currentLayout(db);
  const graph = await exportAll(db);
  const positions = fullLayout(graph);
  const measure = previous ? divergence(previous.позиции, positions) : null;
  const farMoved = previous
    ? Object.keys(positions)
        .filter(id => previous.позиции[id])
        .map(id => ({ id, сдвиг: +Math.hypot(
          positions[id][0] - previous.позиции[id][0],
          positions[id][1] - previous.позиции[id][1]).toFixed(0) }))
        .sort((a, b) => b.сдвиг - a.сдвиг).slice(0, 5)
    : [];
  return { версия: graphVer, прежняя: previous, позиции: positions, мера: measure, дальние: farMoved, граф: graph };
}

/**
 * Применить перекладку. Журнал и извещение — В ТОЙ ЖЕ транзакции: порознь
 * они разъезжаются, и раскладка сменилась бы, а люди о ней не узнали.
 */
export async function applyRelayout(pool, { план, actorId = null }) {
  const { версия: graphVer, прежняя: previous, позиции: positions, мера: measure } = план;
  return withTransaction(pool, async client => {
    const id = await saveLayout(client, {
      версияГрафа: graphVer, род: 'full', изЧего: previous?.id ?? null,
      позиции: positions, расхождение: measure, ктоId: actorId,
    });
    await audit(client, {
      actorId, action: 'layout.relayout', subjectType: 'graph_layout', subjectId: id,
      payload: { версияГрафа: graphVer, изЧего: previous?.id ?? null, ...(measure ?? {}) },
    });
    // Первая раскладка никого не удивит: удивляет СМЕНА привычной картины.
    if (measure) await notify(client, N.LAYOUT_CHANGED, measure);
    return { id, мера: measure };
  });
}

/**
 * Вернуть прежнюю раскладку. Записывается НОВОЙ строкой, а не удалением
 * поздних: история раскладок есть история решений, и стирать её значит
 * терять ответ на вопрос «почему картина такая».
 */
export async function revertLayout(pool, { id: кКакой, actorId = null }) {
  const targetLayout = await layoutById(pool, кКакой);
  if (!targetLayout) return null;
  const currentPositions = await currentLayout(pool);
  const measure = divergence(currentPositions?.позиции ?? null, targetLayout.позиции);
  const graphVer = await graphVersion(pool);
  return withTransaction(pool, async client => {
    const id = await saveLayout(client, {
      версияГрафа: graphVer, род: targetLayout.род, изЧего: targetLayout.id,
      позиции: targetLayout.позиции, расхождение: measure, ктоId: actorId,
    });
    await audit(client, {
      actorId, action: 'layout.revert', subjectType: 'graph_layout', subjectId: id,
      payload: { вернулиК: targetLayout.id, ...(measure ?? {}) },
    });
    // Возврат — такая же смена картины, как и перекладка. Молчать о нём
    // значило бы решить за человека, что «вернули как было» его не касается.
    if (measure?.медиана) await notify(client, N.LAYOUT_CHANGED, measure);
    return { id, изЧего: targetLayout.id, мера: measure };
  });
}
