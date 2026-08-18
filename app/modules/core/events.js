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

function subscribe(событие, дело) {
      if (!BUS_EVENTS.includes(событие)) {
        console.error('шина: неизвестное событие при подписке —', событие);
        return;
      }
      if (!busSubscribers.has(событие)) busSubscribers.set(событие, []);
      busSubscribers.get(событие).push(дело);
    }

function emit(событие, ...доводы) {
      if (!BUS_EVENTS.includes(событие)) {
        console.error('шина: неизвестное событие —', событие);
        return;
      }
      for (const дело of busSubscribers.get(событие) || []) {
        try { дело(...доводы); }
        catch (e) { console.error('шина: подписчик события «' + событие + '» упал —', e); }
      }
    }

export { BUS_EVENTS, busSubscribers, emit, subscribe };
