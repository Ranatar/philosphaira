// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { emit } from '../core/events.js';
import { isReflexiveLink, isSymmetricLink } from '../core/link-facts.js';
import { canEdit } from '../core/session.js';
import { handleLinkClick, handleNodeClick } from '../graph/click-actions.js';
import { cancelGraphSelection, handleConceptSelection } from '../graph/graph-selection.js';
import { gfxCanvas, gfxSvg, renderState } from './canvas-core.js';
import { dragended, dragstarted, gfxLink, gfxNode, gfxZoom, linkHandlers, nodeHandlers } from './d3-layer.js';
import { requestDraw } from './loop.js';
import { pickLink, pickNode, rebuildQuadtree, toGraph } from './picking.js';
import { resetHighlight } from './selection.js';
import { tooltip } from './tooltip-el.js';
import { editMode } from '../state/edit.js';
import { chosenPhilosophers } from '../state/filters.js';
import { selectedEdges } from '../state/render.js';
import { labelWithAuthor } from '../util/philosopher-label.js';

// gfxSvg.call(d3.drag() @22b50a4e
function installNodeDrag() {
gfxSvg.call(d3.drag()
        .container(gfxCanvas)
        .subject((event) => {
          const g = renderState.transform.invert([event.x, event.y]);
          const n = pickNode(g[0], g[1]);
          if (!n) return null;
          // d3.drag запоминает захват как subject.x - pointer.x, и обе
          // величины должны быть в системе координат КОНТЕЙНЕРА, то есть
          // экранной. Узел живёт в координатах графа, поэтому субъектом
          // отдаём обёртку с экранными координатами — иначе в начале
          // перетаскивания узел прыгает на величину сдвига камеры.
          return { node: n,
               x: renderState.transform.applyX(n.x),
               y: renderState.transform.applyY(n.y) };
        })
        // d3.drag передаёт в обработчик датум ЭЛЕМЕНТА, а у канваса его
        // нет — перетаскиваемый узел лежит в event.subject
        .on("start", (event) => {
          const s = event.subject;
          if (s && s.node) dragstarted(event, s.node);
        })
        .on("drag",  (event) => {
          const s = event.subject;
          if (!s || !s.node) return;
          const g = renderState.transform.invert([event.x, event.y]);
          const d = s.node;
          d.fx = g[0]; d.fy = g[1];
          d.x  = g[0]; d.y  = g[1];
          rebuildQuadtree();
          S.pickDirty = true;
          requestDraw();
        })
        .on("end",   (event) => {
          const s = event.subject;
          if (s && s.node) dragended(event, s.node);
        }))
      .call(gfxZoom);
}

let lastHoverNode = null;

let lastHoverLink = null;

function dispatchMove(event) {
      const p = toGraph(event.clientX, event.clientY);
      const n = pickNode(p[0], p[1]);
      const l = n ? null : pickLink(event.clientX, event.clientY);

      // dispatchMove переставляет курсор на каждом движении, поэтому
      // проверка режима нужна и здесь: иначе перекрестие мигало бы,
      // сменяясь на pointer над каждым узлом.
      gfxCanvas.style.cursor =
        (S.graphSelectionContext && S.graphSelectionContext.active)
          ? "crosshair"
          : ((n || l) ? "pointer" : "default");

      if (n !== lastHoverNode) {
        if (lastHoverNode && nodeHandlers.mouseout) nodeHandlers.mouseout(event, lastHoverNode);
        renderState.hoveredNode = n;
        if (n && nodeHandlers.mouseover) nodeHandlers.mouseover(event, n);
        lastHoverNode = n;
        requestDraw();
      }
      if (l !== lastHoverLink) {
        if (lastHoverLink && linkHandlers.mouseout) linkHandlers.mouseout(event, lastHoverLink);
        renderState.hoveredLink = l;
        if (l && linkHandlers.mouseover) linkHandlers.mouseover(event, l);
        lastHoverLink = l;
        requestDraw();
      } else if (l && linkHandlers.mousemove) {
        linkHandlers.mousemove(event, l);
      }
    }

function dispatchClick(event) {
      // Режим выбора концепции на графе проверяется ПЕРВЫМ, до всего
      // остального: пока он включён, клик значит только одно.
      // Порядок: режим выбора → узел → связь → фон.
      if (S.graphSelectionContext && S.graphSelectionContext.active) {
        const gp = toGraph(event.clientX, event.clientY);
        const gn = pickNode(gp[0], gp[1]);
        if (gn) handleConceptSelection(gn.id);
        else cancelGraphSelection();   // клик мимо — отмена, а не пустое ожидание
        return;
      }

      const p = toGraph(event.clientX, event.clientY);
      const n = pickNode(p[0], p[1]);
      if (n) { if (nodeHandlers.click) nodeHandlers.click(event, n); return; }
      const l = pickLink(event.clientX, event.clientY);
      if (l) { if (linkHandlers.click) linkHandlers.click(event, l); return; }
      // фон
      if (event.shiftKey && canEdit()) {           // ЗАСЛОН ПРАВКИ
        emit('edit-concept');
      } else {
        resetHighlight();
        // ДЕФЕКТ И-1: строка философа в легенде оставалась отмеченной.
        // resetHighlight() чистит подсветку графа, но не набор выбранных
        // философов, а отметка `phil-chosen` ставится по нему. Щелчок по фону
        // означает «снять выделение» целиком — значит и набор, и извещение.
        if (chosenPhilosophers.size) {
          chosenPhilosophers.clear();
          emit('philosophers-chosen');
        }
        editMode.pendingConceptSelection = [];
        requestDraw();
      }
    }

function initGraphEventHandlers() {
      gfxLink.on("click", handleLinkClick);
      gfxNode.on("click", handleNodeClick);
      gfxCanvas.addEventListener("mousemove", dispatchMove);
      gfxCanvas.addEventListener("mouseleave", (event) => {
        if (lastHoverNode && nodeHandlers.mouseout) nodeHandlers.mouseout(event, lastHoverNode);
        if (lastHoverLink && linkHandlers.mouseout) linkHandlers.mouseout(event, lastHoverLink);
        lastHoverNode = lastHoverLink = null;
        renderState.hoveredNode = renderState.hoveredLink = null;
        requestDraw();
      });
      gfxCanvas.addEventListener("click", dispatchClick);
    }

// gfxNode.on("mouseover") @521a9ae5
function installNodeHover() {
gfxNode.on("mouseover", function(event, d) {
      if (S.tooltipTimeout) clearTimeout(S.tooltipTimeout);
      
      S.tooltipTimeout = setTimeout(() => {
        let simNote = '';
        if (S.similarityOverlay && d.id !== S.similarityOverlay.sourceId) {
          const sv = S.similarityOverlay.values.get(d.id);
          if (sv !== undefined) {
            const src = DATA.nodes.find(n => n.id === S.similarityOverlay.sourceId);
            simNote = `<br/><span style="color:#ffd700">Сходство с «${src ? src.label : '—'}»: ` +
                  `${sv.toFixed(3)}</span>`;
          }
        }
        tooltip
          .style("opacity", 1)
          .html(`<strong>${labelWithAuthor(d)}</strong><br/>${d.description}<br/><em>${d.concept}</em>${simNote}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 15) + "px");
      }, 100); // Небольшая задержка
    })
    .on("mouseout", function() {
      if (S.tooltipTimeout) {
        clearTimeout(S.tooltipTimeout);
        S.tooltipTimeout = null;
      }
      tooltip.style("opacity", 0);
    });
}

// gfxLink.on("mouseover") @1a928fa2
function installLinkHover() {
gfxLink.on("mouseover", function(event, d) {
      const tooltip = document.getElementById('tooltip');
      
      // Получаем данные узлов source и target
      const sourceId = d.source.id || d.source;
      const targetId = d.target.id || d.target;
      const sourceNode = DATA.nodes.find(n => n.id === sourceId);
      const targetNode = DATA.nodes.find(n => n.id === targetId);
      
      if (!sourceNode || !targetNode) return;
      
      // Получаем название типа связи и цвет
      const relationLabel = DATA.relationTypesObj[d.type].label;
      const relationColor = DATA.relationTypesObj[d.type].color;
      
      // Создаём SVG стрелку с цветом типа связи
      const arrowWidth = 60;
      const arrowHeight = 20;
      let arrowSvg;
      
      // ДЕФЕКТ U3: у петли source === target, и стрелка «слева направо»
      // лгала бы о двух разных концах. Начертание то же, что на канве
      // (drawSelfLoop) и в окне связи: окружность над узлом, наконечник
      // в правой точке касания. Дуга 300°, потому оба флага единицы.
      const reflexive = isReflexiveLink(d);
      
      if (reflexive) {
        arrowSvg = `
          <svg width="46" height="40" style="display: block;">
            <defs>
              <marker id="arrowhead-loop-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
              </marker>
            </defs>
            <circle cx="23" cy="33" r="5" fill="${relationColor}" opacity="0.35" />
            <path d="M 18 33 A 10 10 0 1 1 28 33" fill="none"
                stroke="${relationColor}" stroke-width="2"
                marker-end="url(#arrowhead-loop-${d.type})" />
          </svg>
        `;
      } else if (isSymmetricLink(d)) {
        // Двунаправленная стрелка: <->
        arrowSvg = `
          <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
            <defs>
              <!-- orient="auto" направлял бы начальный маркер ПО ходу линии,
                 и выходило >-> вместо <->. auto-start-reverse переворачивает
                 его на входе пути — для того он в SVG 2 и введён. -->
              <marker id="arrowhead-start-${d.type}" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
                <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
              </marker>
              <marker id="arrowhead-end-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
              </marker>
            </defs>
            <line x1="10" y1="${arrowHeight/2}" x2="${arrowWidth-10}" y2="${arrowHeight/2}" 
                stroke="${relationColor}" stroke-width="2" 
                marker-start="url(#arrowhead-start-${d.type})" 
                marker-end="url(#arrowhead-end-${d.type})" />
          </svg>
        `;
      } else {
        // Однонаправленная стрелка: ->
        arrowSvg = `
          <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
            <defs>
              <marker id="arrowhead-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
              </marker>
            </defs>
            <line x1="5" y1="${arrowHeight/2}" x2="${arrowWidth-5}" y2="${arrowHeight/2}" 
                stroke="${relationColor}" stroke-width="2" 
                marker-end="url(#arrowhead-${d.type})" />
          </svg>
        `;
      }
      
      // Формируем красивый tooltip. У петли конец один, поэтому
      // и название концепции, и имя философа выводятся однажды:
      // прежде подсказка повторяла их дважды по обе стороны стрелки.
      let tooltipContent = reflexive ? `
        <div class="link-tooltip-header">
          <div class="link-tooltip-arrow">${arrowSvg}</div>
          <strong>${sourceNode.label}</strong>
        </div>
        <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
        <div class="link-tooltip-philosophers" style="justify-content: center;">
          <em>(${sourceNode.concept})</em>
        </div>
      ` : `
        <div class="link-tooltip-header">
          <strong>${sourceNode.label}</strong>
          <div class="link-tooltip-arrow">${arrowSvg}</div>
          <strong>${targetNode.label}</strong>
        </div>
        <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
        <div class="link-tooltip-philosophers">
          <em>(${sourceNode.concept})</em>
          <em>(${targetNode.concept})</em>
        </div>
      `;
      
      // Для выделенных связей добавляем описание, если оно есть
      if (selectedEdges.has(d) && d.description) {
        tooltipContent += `<div class="tooltip-description">${d.description}</div>`;
      }
      
      tooltip.innerHTML = tooltipContent;
      tooltip.style.opacity = 1;
      tooltip.style.left = (event.pageX + 15) + 'px';
      tooltip.style.top = (event.pageY - 10) + 'px';

      // Ф0.4: markerUnits = strokeWidth означал рост стрелки при :hover
      renderState.hoveredLink = d; requestDraw();
    })
    .on("mousemove", function(event) {
      const tooltip = document.getElementById('tooltip');
      tooltip.style.left = (event.pageX + 15) + 'px';
      tooltip.style.top = (event.pageY - 10) + 'px';
    })
    .on("mouseout", function(event, d) {
      const tooltip = document.getElementById('tooltip');
      tooltip.style.opacity = 0;
      if (renderState.hoveredLink === d) { renderState.hoveredLink = null; requestDraw(); }
    });
}

export { dispatchClick, dispatchMove, initGraphEventHandlers, installLinkHover, installNodeDrag, installNodeHover, lastHoverLink, lastHoverNode };
