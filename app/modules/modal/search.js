// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { displaySearchResults, pickConcepts } from '../core/search.js';

function handleModalSearch(query) {
      const resultsContainer = document.getElementById('modalSearchResults');
      const clearBtn = document.querySelector('#modalSearch .legend-search-clear');
      
      if (query && query.trim()) clearBtn.classList.add('show');
      else clearBtn.classList.remove('show');

      displaySearchResults(pickConcepts(query), resultsContainer, 'modal');
    }

function clearModalSearch() {
      const searchInput = document.getElementById('modalSearchInput');
      const resultsContainer = document.getElementById('modalSearchResults');
      const clearBtn = document.querySelector('#modalSearch .legend-search-clear');
      
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

// document.addEventListener('click') @eed5f20f
function installModalSearchDismiss() {
document.addEventListener('click', function(event) {
      document.querySelectorAll('.modal-concept-search').forEach(box => {
        if (!box.contains(event.target)) {
          box.querySelector('.modal-concept-search-results')?.classList.remove('show');
        }
      });
    });
}

export { clearModalSearch, handleModalSearch, installModalSearchDismiss };
