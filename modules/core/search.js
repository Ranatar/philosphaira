// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';
import './graph-index.js';
import { isNodeVisible } from './visibility.js';

function pickConcepts(query, pool) {
      const q = (query || '').trim().toLowerCase();
      const set = pool || DATA.nodes;
      // Запрос делится на слова, и КАЖДОЕ должно найти себе слово в названии
      // или в имени философа. Прежде запрос сравнивался целиком с началом
      // каждого отдельного слова, и «миф о пещере» не находил ничего: ни
      // одно слово с этой строки не начинается. Теперь находит — и порядок
      // слов не важен, «пещере миф» тоже.
      const queryWords = q ? q.split(/\s+/).filter(Boolean) : [];
      const fits = n => {
        if (!queryWords.length) return true;   // пустой запрос = показать всё
        const words = (n.label + ' ' + n.concept).toLowerCase().split(/\s+/);
        return queryWords.every(q => words.some(w => w.startsWith(q)));
      };
      return set.filter(fits).sort((a, b) => {
        const ao = DATA.philosopherOrder[a.concept] || 0;
        const bo = DATA.philosopherOrder[b.concept] || 0;
        return ao !== bo ? ao - bo : a.label.localeCompare(b.label);
      });
    }

function rowInner(n, tail) {
      const color = DATA.philosopherConcepts[n.concept]
        ? DATA.philosopherConcepts[n.concept].color : '#6c5ce7';
      return `
          <div class="concept-row-color" style="background:${color};box-shadow:0 0 6px ${color};"></div>
          <div class="concept-row-text">
            <div class="concept-row-label">${n.label}</div>
            <div class="concept-row-phil">${n.concept}</div>
          </div>
          ${tail || ''}`;
    }

function emptyList(text) {
      return `<div class="concept-row-empty">${text || 'Ничего не найдено'}</div>`;
    }

function displaySearchResults(results, container, context) {
      if (results.length === 0) {
        container.innerHTML = emptyList();
        container.classList.add('show');
        return;
      }
      
      // Скрытые отбором ПОКАЗЫВАЮТСЯ в списке: поиск для того и нужен, чтобы
      // находить. Но помечаются — иначе выбор такой концепции выглядел бы
      // поломкой: соседи подсвечиваются, а сама она не появляется.
      container.innerHTML = results.map(node => {
        const hidden = !isNodeVisible(node);
        const tail = hidden
          ? '<div class="concept-row-note" title="">скрыта отбором</div>' : '';
        return `
        <div class="concept-row${hidden ? ' hidden-by-filter' : ''}"
             data-act-click="select-search-result" data-a1="${node.id}" data-a2="${context}">
          ${rowInner(node, tail)}
        </div>`;
      }).join('');
      
      container.classList.add('show');
    }

export { displaySearchResults, emptyList, pickConcepts, rowInner };
