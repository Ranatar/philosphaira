// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

const BUS_EVENTS = [
      'filters-applied',      // отбор пересчитан; вид пора обновить
      'data-changed',      // база правлена: добавили, удалили, переименовали
      'open-concept',      // щелчок по узлу просит окно концепции
      'open-link',          // щелчок по связи просит окно связи
      'edit-concept',      // shift-щелчок под admin
      'edit-link',
      'stats-stale',    // метрики пересчитаны; открытый вид пора обновить
      'close-modals',           // просьба свернуть всё открытое
      'close-stats',     // наложение метрики просит убрать панель
      'concept-picked', // выбор с полотна доставлен просившему
      'comparison-refresh',     // выбран участник сравнения концепций
      'switch-stats-view',        // вид статистики просит показать другой вид
      'philosophers-chosen',       // набор выбранных философов изменился
      'selection-cleared',        // на графе не осталось ничего выбранного
      'commit-conflicted',        // правка столкнулась с чужой; окно разбора
      'graph-updated-remotely',   // граф изменил кто-то другой; правка пришла извне
      'notification-arrived',     // пришло уведомление; колокол обновляет счёт
      'session-changed',          // вошли или вышли; кому надо — перерисуется
    ];

const busSubscribers = new Map();

const BUS_PHASES = ['derived', 'bound', 'filters', 'ui'];

function subscribe(event, handler, фаза) {
      // Фаза приписывается самому подписчику: список подписок читается
      // сверху вниз, и увидеть в нём очередь рассылки иначе нельзя.
      if (фаза) {
        if (!BUS_PHASES.includes(фаза)) {
          console.error('шина: неизвестная фаза —', фаза);
          return;
        }
        handler.фаза = фаза;
      }
      if (!BUS_EVENTS.includes(event)) {
        console.error('шина: неизвестное событие при подписке —', event);
        return;
      }
      if (!busSubscribers.has(event)) busSubscribers.set(event, []);
      busSubscribers.get(event).push(handler);
    }

function emit(event, ...args) {
      if (!BUS_EVENTS.includes(event)) {
        console.error('шина: неизвестное событие —', event);
        return;
      }
      const allHandlers = busSubscribers.get(event) || [];
      // Рассылка идёт ПО ФАЗАМ. Внутри фазы порядок прежний — порядок
      // записи; между фазами он объявлен и не зависит от того, кто когда
      // подписался.
      const queue = BUS_PHASES.length && allHandlers.some(h => h.фаза)
        ? BUS_PHASES.flatMap(ф => allHandlers.filter(h => (h.фаза || 'ui') === ф))
        : allHandlers;
      for (const handler of queue) {
        try { handler(...args); }
        catch (e) { console.error('шина: подписчик события «' + event + '» упал —', e); }
      }
    }

export { emit, subscribe };
