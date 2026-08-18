// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

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
    ];

const busSubscribers = new Map();

function subscribe(event, handler) {
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
      for (const handler of busSubscribers.get(event) || []) {
        try { handler(...args); }
        catch (e) { console.error('шина: подписчик события «' + event + '» упал —', e); }
      }
    }

export { BUS_EVENTS, busSubscribers, emit, subscribe };
