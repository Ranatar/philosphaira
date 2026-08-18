// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { applyFiltersImmediate } from './filters.js';
import { pinnedDespiteFilter, pinnedVisibleNodes } from '../state/filters.js';

function updateFilterNote() {
      const раздел = document.getElementById('beyondFilterSection');
      const счёт = document.getElementById('beyondFilterCount');
      if (!раздел) return;
      if (счёт) счёт.textContent = pinnedDespiteFilter.size;
      раздел.style.display = pinnedDespiteFilter.size ? 'block' : 'none';
    }

function resetBeyondFilter() {
      pinnedDespiteFilter.forEach(id => pinnedVisibleNodes.delete(id));
      pinnedDespiteFilter.clear();
      updateFilterNote();
      applyFiltersImmediate();
    }

export { resetBeyondFilter, updateFilterNote };
