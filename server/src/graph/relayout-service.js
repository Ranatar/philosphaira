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
import { полнаяРаскладка, расхождение } from './layout.js';

/**
 * Посчитать полную раскладку и оценить, насколько она разойдётся с нынешней.
 * НИЧЕГО НЕ ПИШЕТ. Возвращает и сами координаты, и меру, и список уехавших
 * дальше всех — это те числа, по которым человек принимает решение.
 */
export async function планПерекладки(db) {
  const версия = await graphVersion(db);
  const прежняя = await currentLayout(db);
  const граф = await exportAll(db);
  const позиции = полнаяРаскладка(граф);
  const мера = прежняя ? расхождение(прежняя.позиции, позиции) : null;
  const дальние = прежняя
    ? Object.keys(позиции)
        .filter(id => прежняя.позиции[id])
        .map(id => ({ id, сдвиг: +Math.hypot(
          позиции[id][0] - прежняя.позиции[id][0],
          позиции[id][1] - прежняя.позиции[id][1]).toFixed(0) }))
        .sort((a, b) => b.сдвиг - a.сдвиг).slice(0, 5)
    : [];
  return { версия, прежняя, позиции, мера, дальние, граф };
}

/**
 * Применить перекладку. Журнал и извещение — В ТОЙ ЖЕ транзакции: порознь
 * они разъезжаются, и раскладка сменилась бы, а люди о ней не узнали.
 */
export async function применитьПерекладку(pool, { план, actorId = null }) {
  const { версия, прежняя, позиции, мера } = план;
  return withTransaction(pool, async client => {
    const id = await saveLayout(client, {
      версияГрафа: версия, род: 'full', изЧего: прежняя?.id ?? null,
      позиции, расхождение: мера, ктоId: actorId,
    });
    await audit(client, {
      actorId, action: 'layout.relayout', subjectType: 'graph_layout', subjectId: id,
      payload: { версияГрафа: версия, изЧего: прежняя?.id ?? null, ...(мера ?? {}) },
    });
    // Первая раскладка никого не удивит: удивляет СМЕНА привычной картины.
    if (мера) await notify(client, N.LAYOUT_CHANGED, мера);
    return { id, мера };
  });
}

/**
 * Вернуть прежнюю раскладку. Записывается НОВОЙ строкой, а не удалением
 * поздних: история раскладок есть история решений, и стирать её значит
 * терять ответ на вопрос «почему картина такая».
 */
export async function вернутьРаскладку(pool, { id: кКакой, actorId = null }) {
  const цель = await layoutById(pool, кКакой);
  if (!цель) return null;
  const нынешняя = await currentLayout(pool);
  const мера = расхождение(нынешняя?.позиции ?? null, цель.позиции);
  const версия = await graphVersion(pool);
  return withTransaction(pool, async client => {
    const id = await saveLayout(client, {
      версияГрафа: версия, род: цель.род, изЧего: цель.id,
      позиции: цель.позиции, расхождение: мера, ктоId: actorId,
    });
    await audit(client, {
      actorId, action: 'layout.revert', subjectType: 'graph_layout', subjectId: id,
      payload: { вернулиК: цель.id, ...(мера ?? {}) },
    });
    // Возврат — такая же смена картины, как и перекладка. Молчать о нём
    // значило бы решить за человека, что «вернули как было» его не касается.
    if (мера?.медиана) await notify(client, N.LAYOUT_CHANGED, мера);
    return { id, изЧего: цель.id, мера };
  });
}
