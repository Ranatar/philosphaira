// Сгенерировано tools/delegate.mjs — правки вносить туда.

// Реестр действий разметки. Разметка несёт ИМЯ ACTIONS, а не name функции,
// поэтому глобальное пространство имён ей больше не нужно.
//
// Промах по имени ОБЯЗАН шуметь: это единственное, чем делегирование хуже
// встроенного обработчика — строка data-act-click="открыть-концепцию"
// молчаливее, чем onclick="openUniversalModal(…)". Молчаливых отказов в
// этом приложении already было довольно.
const ACTIONS = new Map();

export function registerActions(map) {
  for (const name of Object.keys(map)) {
    if (ACTIONS.has(name)) console.error('делегирование: name действия занято —', name);
    ACTIONS.set(name, map[name]);
  }
}

export function runAction(name, el, ev) {
  const fn = ACTIONS.get(name);
  if (!fn) { console.error('делегирование: неизвестное действие —', name, el); return; }
  try { return fn(el, ev); }
  catch (e) { console.error('делегирование: действие «' + name + '» упало —', e); }
}

export function actionNames() { return [...ACTIONS.keys()]; }
