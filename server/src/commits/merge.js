// server/commits/merge.js

/**
 * Сравнение значений полей графа. Это не «глубокое равенство вообще», а
 * решение о том, что считать ОДНОЙ И ТОЙ ЖЕ правкой:
 *  - текст: обрезаем края и приводим переносы строк. Регистр НЕ трогаем —
 *    в философских текстах он значим («Ничто» и «ничто» — разные вещи);
 *  - наборы (рубрики, традиции): равенство МНОЖЕСТВ. Порядок там смысла не
 *    несёт, и считать перестановку правкой значило бы плодить ложные
 *    столкновения;
 *  - числа и признаки: точное равенство после приведения;
 *  - null, undefined и строка из пробелов — одно и то же «пусто».
 */
export function sameValue(a, b) {
  if (isEmpty(a) && isEmpty(b)) return true;
  if (isEmpty(a) || isEmpty(b)) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const sa = new Set(a.map(String));
    const sb = new Set(b.map(String));
    return sa.size === sb.size && [...sa].every(x => sb.has(x));
  }
  if (typeof a === 'number'  || typeof b === 'number')  return Number(a) === Number(b);
  if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b);
  return normText(a) === normText(b);
}

const isEmpty  = v => v == null || (typeof v === 'string' && v.trim() === '');
const normText = v => String(v).replace(/\r\n?/g, '\n').trim();

export const MERGE = Object.freeze({
  CLEAN:    'clean',      // никто не трогал — применяем
  SAME:     'same',       // правили ОДИНАКОВО — применять нечего
  CONFLICT: 'conflict',   // правили ПО-РАЗНОМУ — нужен человек
});

/**
 * Трёхстороннее сравнение одного поля:
 *   base    — что видел правщик, когда начинал;
 *   next    — что он хочет получить;
 *   current — что в базе на момент применения.
 * Различение «правили одинаково / правили по-разному» выпадает отсюда само.
 * Отдельной машинерии для него не нужно — нужно лишь хранить в коммите ОБА
 * значения, а не одно новое.
 */
export function mergeField({ base, next, current }) {
  if (sameValue(current, base)) return MERGE.CLEAN;
  if (sameValue(current, next)) return MERGE.SAME;
  return MERGE.CONFLICT;
}

/**
 * Изменение целой сущности. Поля считаются ПООТДЕЛЬНОСТИ: правка описания и
 * правка рубрик не сталкиваются между собой, хотя и метят в одну концепцию.
 * Версия на всю сущность такие случаи блокировала напрасно — а это самый
 * частый случай совместной работы.
 */
// Известные действия. Список закрытый НАРОЧНО: прежде всякое незнакомое
// действие молча проваливалось в ветку правки и получало приговор по чужому
// делу. При `current === null` оно объявлялось «сущность удалена» — диагноз
// не просто бесполезный, а ЛОЖНЫЙ: сущность цела, незнакомо действие.
// Нашлось это замером, когда проверяли, потянет ли форма коммита перекладку
// графа: `{action: 'relayout'}` вернул conflict вместо отказа.
//
// Молчаливо принятый мусор опаснее громкого отказа: коммит с опечаткой в
// действии («ad» вместо «add») получил бы вердикт вместо жалобы.
export const ACTIONS = Object.freeze(['add', 'edit', 'delete']);

export function mergeEntityChange({ action, fields = {}, current }) {
  if (!ACTIONS.includes(action)) {
    throw new Error(`слияние: неизвестное действие «${action}»; ` +
      `известны: ${ACTIONS.join(', ')}`);
  }
  if (action === 'delete') {
    // Оба удалили — применять нечего. Иначе удаляем.
    return current === null ? { outcome: MERGE.SAME } : { outcome: MERGE.CLEAN };
  }
  if (action === 'add') {
    return current === null
      ? { outcome: MERGE.CLEAN }
      : { outcome: MERGE.CONFLICT,
          conflicts: [{ field: null, reason: 'адрес уже занят' }] };
  }
  if (current === null) {
    return { outcome: MERGE.CONFLICT,
             conflicts: [{ field: null, reason: 'сущность удалена' }] };
  }

  const outcomes = {}, conflicts = [], apply = {};
  for (const [field, { base, next }] of Object.entries(fields)) {
    // Поле, где «было» и «стало» совпадают, — вовсе не правка: форма
    // отдаёт все поля разом, и большинство из них человек не трогал.
    // Записывать их значило бы сталкиваться там, где никто ничего не менял.
    if (sameValue(base, next)) { outcomes[field] = MERGE.SAME; continue; }
    const verdict = mergeField({ base, next, current: current[field] });
    outcomes[field] = verdict;
    if (verdict === MERGE.CONFLICT) {
      conflicts.push({ field, base, yours: next, current: current[field] });
    } else if (verdict === MERGE.CLEAN) {
      apply[field] = next;
    }
  }
  // Столкнулось хоть одно поле — коммит не применяется НИКАКОЙ частью:
  // половина правки хуже, чем ни одной.
  if (conflicts.length) return { outcome: MERGE.CONFLICT, conflicts, fields: outcomes };

  const outcome = Object.keys(apply).length ? MERGE.CLEAN : MERGE.SAME;
  return { outcome, apply, fields: outcomes };
}
