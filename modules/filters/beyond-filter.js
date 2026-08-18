// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { applyFiltersImmediate } from './filters.js';
import { pinnedDespiteFilter, pinnedVisibleNodes } from '../state/filters.js';

function updateFilterNote() {
      const section = document.getElementById('beyondFilterSection');
      const count = document.getElementById('beyondFilterCount');
      if (!section) return;
      if (count) count.textContent = pinnedDespiteFilter.size;
      section.style.display = pinnedDespiteFilter.size ? 'block' : 'none';
    }

function resetBeyondFilter() {
      pinnedDespiteFilter.forEach(id => pinnedVisibleNodes.delete(id));
      pinnedDespiteFilter.clear();
      updateFilterNote();
      applyFiltersImmediate();
    }

export { resetBeyondFilter, updateFilterNote };
