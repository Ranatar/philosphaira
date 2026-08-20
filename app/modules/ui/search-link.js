// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { conceptById } from '../core/graph-index.js';
import { emptyList, pickConcepts, rowInner } from '../core/search.js';
import { gfxSvg } from '../render/canvas-core.js';
import { gfxZoom } from '../render/d3-layer.js';
import { requestDraw } from '../render/loop.js';
import { highlightCombined } from '../render/selection.js';
import { selectedEdges, selectedNodes } from '../state/render.js';

const linkSearch = { from: null, to: null };

function handleLegendLinkSearch(end, query) {
      const box = document.getElementById(end === 'from' ? 'legendLinkFromResults' : 'legendLinkToResults');
      if (!box) return;
      // Второй конец сужает выбор: показываем только то, с чем связь есть.
      const other = end === 'from' ? linkSearch.to : linkSearch.from;
      let set = DATA.nodes;
      if (other) {
        const neighbours = new Set();
        DATA.links.forEach(l => {
          const a = l.source.id || l.source, b = l.target.id || l.target;
          if (a === other.id) neighbours.add(b);
          if (b === other.id) neighbours.add(a);
        });
        set = DATA.nodes.filter(n => neighbours.has(n.id));
      }
      const found = pickConcepts(query, set);
      box.innerHTML = found.length
        ? found.map(n => `
            <div class="concept-row" data-act-click="pick-link-end" data-a1="${end}" data-a2="${n.id}">
              ${rowInner(n)}
            </div>`).join('')
        : emptyList(other ? 'Среди связанных ничего не найдено' : 'Ничего не найдено');
      box.classList.add('show');
    }

function pickLinkEnd(end, id) {
      const node = conceptById.get(id);
      if (!node) return;
      linkSearch[end] = node;
      const field = document.getElementById(end === 'from' ? 'legendLinkFrom' : 'legendLinkTo');
      if (field) field.value = `${node.label} (${node.concept})`;
      const box = document.getElementById(end === 'from' ? 'legendLinkFromResults' : 'legendLinkToResults');
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      showFoundLinks();
    }

function showFoundLinks() {
      const box = document.getElementById('legendLinkFound');
      if (!box) return;
      const { from, to } = linkSearch;
      if (!from || !to) { box.innerHTML = ''; return; }

      const found = DATA.links.filter(l => {
        const a = l.source.id || l.source, b = l.target.id || l.target;
        return (a === from.id && b === to.id) || (a === to.id && b === from.id);
      });
      if (!found.length) {
        box.innerHTML = emptyList('Между ними связи нет');
        return;
      }
      box.innerHTML = found.map((l, k) => {
        const t = DATA.relationTypesObj[l.type] || {};
        const a = l.source.id || l.source;
        const arrow = l.bidirectional ? '↔' : (a === from.id ? '→' : '←');
        return `
          <div class="concept-row" data-act-click="highlight-link-on-graph" data-a1="${from.id}" data-a2="${to.id}" data-a3="${k}">
            <div class="concept-row-color" style="background:${t.color || '#6c5ce7'};"></div>
            <div class="concept-row-text">
              <div class="concept-row-label">${from.label} ${arrow} ${to.label}</div>
              <div class="concept-row-phil">${t.label || l.type} · вес ${l.weight || 2}</div>
            </div>
          </div>`;
      }).join('');
    }

function highlightLinkOnGraph(idA, idB, k) {
      const found = DATA.links.filter(l => {
        const a = l.source.id || l.source, b = l.target.id || l.target;
        return (a === idA && b === idB) || (a === idB && b === idA);
      });
      const link = found[k] || found[0];
      if (!link) return;

      selectedNodes.clear();
      selectedEdges.clear();
      selectedEdges.add(link);
      highlightCombined();

      // Ведём к ней взгляд: середина связи в середину полотна.
      const a = link.source, b = link.target;
      if (a && b && a.x !== undefined && b.x !== undefined) {
        const transform = d3.zoomIdentity
          .translate(S.viewWidth / 2 - (a.x + b.x) / 2, S.viewHeight / 2 - (a.y + b.y) / 2)
          .scale(1.4);
        gfxSvg.transition().duration(750).call(gfxZoom.transform, transform);
      }
      requestDraw();
    }

function clearLinkSearch() {
      linkSearch.from = null;
      linkSearch.to = null;
      ['legendLinkFrom', 'legendLinkTo'].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
      });
      ['legendLinkFromResults', 'legendLinkToResults', 'legendLinkFound'].forEach(id => {
        const box = document.getElementById(id);
        if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      });
    }

export { clearLinkSearch, handleLegendLinkSearch, highlightLinkOnGraph, pickLinkEnd };
