// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { displaySearchResults, pickConcepts } from '../core/search.js';
import { isNodeVisible } from '../core/visibility.js';
import { updateFilterNote } from '../filters/beyond-filter.js';
import { applyFiltersImmediate } from '../filters/filters.js';
import { showDetailModal } from '../modal/entry.js';
import { clearModalSearch } from '../modal/search.js';
import { gfxSvg } from '../render/canvas-core.js';
import { gfxZoom } from '../render/d3-layer.js';
import { highlightConnected } from '../render/selection.js';
import { pinnedDespiteFilter, pinnedVisibleNodes } from '../state/filters.js';
import { selectedNodes } from '../state/render.js';
import { clearLinkSearch } from './search-link.js';
import { clearLegendPhilSearch } from './search-philosopher.js';

let searchKind = 'concept';

function toggleLegendSearch() {
      const тело = document.getElementById('searchBody');
      const открыт = тело.style.display !== 'none';
      тело.style.display = открыт ? 'none' : 'block';
      if (открыт) {
        clearLegendSearch();
        clearLegendPhilSearch();
        clearLinkSearch();
      } else {
        setSearchKind('concept');   // по умолчанию — концепции
        const поле = document.getElementById('legendSearchInput');
        if (поле) поле.focus();
      }
    }

function setSearchKind(вид) {
      searchKind = вид;
      const строки = { philosopher: 'rowPhilosopher', concept: 'rowConcept', connection: 'rowConnection' };
      Object.entries(строки).forEach(([к, id]) => {
        const el = document.getElementById(id);
        if (el) el.style.display = (к === вид) ? (к === 'connection' ? 'block' : 'flex') : 'none';
      });
      ['Philosopher', 'Concept', 'Connection'].forEach(к => {
        const b = document.getElementById('kind' + к);
        if (b) b.classList.toggle('active', к.toLowerCase() === вид);
      });
      // Найденное прежним видом убираем: оно уже не про то, что спрашивают.
      clearLegendSearch();
      clearLegendPhilSearch();
      clearLinkSearch();
    }

function handleLegendSearch(query) {
      const resultsContainer = document.getElementById('legendSearchResults');
      const clearBtn = document.querySelector('#legendSearch .legend-search-clear');
      
      // Пустой запрос больше не закрывает список: он выпадает весь, как в
      // окне просмотра связи. Крестик очистки показывается только когда
      // есть что чистить.
      if (query && query.trim()) clearBtn.classList.add('show');
      else clearBtn.classList.remove('show');

      displaySearchResults(pickConcepts(query), resultsContainer, 'legend');
    }

function selectSearchResult(nodeId, context) {
      const nodeData = DATA.nodes.find(n => n.id === nodeId);
      if (!nodeData) return;
      
      if (context === 'legend') {
        // Скрытую отбором показываем ВОПРЕКИ отбору. Прежде два правила
        // спорили молча: подсветка считала узел участником, отрисовка его
        // не рисовала — соседи загорались вокруг пустого места. Пометка
        // держится в легенде, пока её не снимут.
        if (!isNodeVisible(nodeData)) {
          pinnedVisibleNodes.add(nodeData.id);
          pinnedDespiteFilter.add(nodeData.id);
          applyFiltersImmediate();
          updateFilterNote();
          showTemporaryMessage(`«${nodeData.label}» скрыта отбором и показана поверх него`);
        }

        // Выделяем узел и центрируем
        selectedNodes.clear();
        selectedNodes.add(nodeData);
        highlightConnected([nodeData]);
        
        const transform = d3.zoomIdentity
          .translate(S.viewWidth / 2 - nodeData.x, S.viewHeight / 2 - nodeData.y)
          .scale(1.5);
        gfxSvg.transition().duration(750).call(gfxZoom.transform, transform);
        
        clearLegendSearch();
        
      } else if (context === 'modal') {
        // Переходим к детальной информации об узле
        showDetailModal(nodeData);
        clearModalSearch();
      }
    }

function clearLegendSearch() {
      const searchInput = document.getElementById('legendSearchInput');
      const resultsContainer = document.getElementById('legendSearchResults');
      const clearBtn = document.querySelector('#legendSearch .legend-search-clear');
      
      if (searchInput) {
        searchInput.value = '';
      }
      if (resultsContainer) {
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
      }
      if (clearBtn) {
        clearBtn.classList.remove('show');
      }
    }

// document.addEventListener('click') @e0801433
function installLegendSearchDismiss() {
document.addEventListener('click', function(event) {
      // Для поиска в легенде
      const legendSearch = document.getElementById('legendSearch');
      const legendResults = document.getElementById('legendSearchResults');
      if (legendSearch && !legendSearch.contains(event.target) && legendResults) {
        legendResults.classList.remove('show');
      }
      
      // Для поиска в модальном окне
      const modalSearch = document.getElementById('modalSearch');
      const modalResults = document.getElementById('modalSearchResults');
      if (modalSearch && !modalSearch.contains(event.target) && modalResults) {
        modalResults.classList.remove('show');
      }
    });
}

export { clearLegendSearch, handleLegendSearch, installLegendSearchDismiss, searchKind, selectSearchResult, setSearchKind, toggleLegendSearch };
