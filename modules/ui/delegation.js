// Сгенерировано tools/delegate.mjs — правки вносить туда.

import { runAction } from './actions.js';

// Четыре слушателя на document — больше не нужно.
//   click, change, input   — всплывают;
//   focus НЕ всплывает, поэтому focusin.
// Разметка перерисовывается сорока генераторами, и делегированию это
// родная задача: обработчики не приходится возвращать после перерисовки.
const EVENTS = [['click', 'click'], ['change', 'change'],
                 ['input', 'input'], ['focusin', 'focus']];

// mouseenter и mouseleave НЕ ВСПЛЫВАЮТ — делегировать их напрямую нельзя.
// Но всплывающие mouseover и mouseout дают ровно ту же семантику, если
// отбросить переходы ВНУТРИ элемента: вход считается, только когда курсор
// пришёл извне, выход — только когда ушёл наружу. Это стандартная замена,
// и она снимает последнюю нужду в глобальном имени.
const BOUNDS = [['mouseover', 'enter'], ['mouseout', 'leave']];

// Подмена window.event на время действия.
//
// Часть кода читает НЕЯВНОЕ ГЛОБАЛЬНОЕ event и берёт из него currentTarget
// (так устроен toggleSection: const header = event.currentTarget). При
// встроенном обработчике currentTarget — сам элемент; при делегировании —
// document, потому что слушатель висит на нём. Поэтому на время вызова
// window.event подменяется прослойкой, у которой currentTarget — тот
// элемент, что нёс name действия. Всё прочее берётся у настоящего события.
function withEventSwap(ev, el, handler) {
  const own = Object.getOwnPropertyDescriptor(window, 'event');
  const layer = new Proxy(ev, {
    get: function (t, p) {
      if (p === 'currentTarget') return el;
      var v = t[p];
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
  Object.defineProperty(window, 'event', { configurable: true, value: layer });
  try { return handler(layer); }
  finally {
    if (own) Object.defineProperty(window, 'event', own);
    else delete window.event;      // вернуть встроенный доступ через прототип
  }
}

export function installDelegation(root = document) {
  for (const [event, flag] of BOUNDS) {
    root.addEventListener(event, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + flag + ']');
      if (!el) return;
      // переход внутри самого элемента границей не считается
      const other = ev.relatedTarget;
      if (other && el.contains(other)) return;
      withEventSwap(ev, el, layer =>
        runAction(el.getAttribute('data-act-' + flag), el, layer));
    });
  }
  for (const [event, flag] of EVENTS) {
    root.addEventListener(event, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + flag + ']');
      if (!el) return;
      withEventSwap(ev, el, layer =>
        runAction(el.getAttribute('data-act-' + flag), el, layer));
    });
  }
}
