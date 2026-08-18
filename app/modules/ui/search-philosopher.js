// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import '../core/graph-index.js';
import { emptyList } from '../core/search.js';
import { openUniversalModal } from '../modal/core.js';
import { highlightPhilosopherOnGraph } from '../render/selection.js';

function handleLegendPhilSearch(query) {
      const box = document.getElementById('legendPhilResults');
      const clearBtn = document.querySelector('#rowPhilosopher .legend-search-clear');
      if (!box) return;
      if (clearBtn) clearBtn.classList.toggle('show', !!(query && query.trim()));
      const found = pickPhilosophers(query);
      box.innerHTML = found.length
        ? found.map(f => {
            const color = DATA.philosopherConcepts[f.nameRu]
              ? DATA.philosopherConcepts[f.nameRu].color : '#6c5ce7';
            const count = DATA.concepts.filter(c => c.philosopher === f.id).length;
            return `
              <div class="concept-row" data-act-click="pick-philosopher-from-search" data-a1="${f.nameRu}">
                <div class="concept-row-color" style="background:${color};box-shadow:0 0 6px ${color};"></div>
                <div class="concept-row-text">
                  <div class="concept-row-label">${f.nameRu}</div>
                  <div class="concept-row-phil">${f.years} · концепций ${count}</div>
                </div>
              </div>`;
          }).join('')
        : emptyList();
      box.classList.add('show');
    }

function pickPhilosopherFromSearch(name) {
      highlightPhilosopherOnGraph(name);
      clearLegendPhilSearch();
    }

function clearLegendPhilSearch() {
      const field = document.getElementById('legendPhilInput');
      const box = document.getElementById('legendPhilResults');
      if (field) field.value = '';
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
    }

function pickPhilosophers(query) {
      const q = (query || '').trim().toLowerCase();
      const queryWords = q ? q.split(/\s+/).filter(Boolean) : [];
      const fits = p => {
        if (!queryWords.length) return true;
        const words = (p.nameRu + ' ' + (p.nameEn || '')).toLowerCase().split(/\s+/);
        return queryWords.every(q => words.some(w => w.startsWith(q)));
      };
      return DATA.philosophers.filter(fits)
        .sort((a, b) => (a.birth || 0) - (b.birth || 0));
    }

function handlePhilosopherSearch(query) {
      const box = document.getElementById('philSearchResults');
      const clearBtn = document.querySelector('#philSearch .legend-search-clear');
      if (!box) return;
      if (clearBtn) clearBtn.classList.toggle('show', !!(query && query.trim()));

      const found = pickPhilosophers(query);
      box.innerHTML = found.length
        ? found.map(p => {
            const color = DATA.philosopherConcepts[p.nameRu]
              ? DATA.philosopherConcepts[p.nameRu].color : '#6c5ce7';
            // Считаем по идентификатору философа: в concepts поле philosopher
            // хранит именно id («aristotle»), а не имя.
            const count = DATA.concepts.filter(c => c.philosopher === p.id).length;
            return `
              <div class="concept-row" data-act-click="select-philosopher-result" data-a1="${p.nameRu}">
                <div class="concept-row-color" style="background:${color};box-shadow:0 0 6px ${color};"></div>
                <div class="concept-row-text">
                  <div class="concept-row-label">${p.nameRu}</div>
                  <div class="concept-row-phil">${p.years} · концепций ${count}</div>
                </div>
              </div>`;
          }).join('')
        : emptyList();
      box.classList.add('show');
    }

function selectPhilosopherResult(name) {
      clearPhilosopherSearch();
      openUniversalModal('philosopher', name, 'view');
    }

function clearPhilosopherSearch() {
      const field = document.getElementById('philSearchInput');
      const box = document.getElementById('philSearchResults');
      const clearBtn = document.querySelector('#philSearch .legend-search-clear');
      if (field) field.value = '';
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      if (clearBtn) clearBtn.classList.remove('show');
    }

export { clearLegendPhilSearch, clearPhilosopherSearch, handleLegendPhilSearch, handlePhilosopherSearch, pickPhilosopherFromSearch, pickPhilosophers, selectPhilosopherResult };
