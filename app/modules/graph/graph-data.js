// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { emit } from '../core/events.js';
import { conceptById, linksByConcept, traditionById } from '../core/graph-index.js';
import { renderState } from '../render/canvas-core.js';
import { requestDraw } from '../render/loop.js';
import { updateGraphData } from '../render/scene.js';
import { pinnedVisibleNodes } from '../state/filters.js';
import { linkLayer, selectedEdges, selectedNodes } from '../state/render.js';

function traditionsOfPhilosopher(name) {
      return (DATA.philosopherTraditions[name] || [])
        .map(id => (traditionById.get(id) || {}).name)
        .filter(Boolean);
    }

function findConnection(sourceId, targetId, bidirectional = true) {
      return DATA.links.find(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        if (srcId === sourceId && tgtId === targetId) return true;
        if (bidirectional && srcId === targetId && tgtId === sourceId) return true;
        return false;
      }) || null;
    }

function getConceptConnections(conceptId) {
      // Ради этого места и заводился linksByConcept: прежде тут шёл полный
      // проход по 1624 связям, а зовут отсюда семь мест, часть — в циклах.
      // ОТДАЁТСЯ КОПИЯ, а не сам список указателя: прежняя filter возвращала
      // свежий массив, и звавшие вправе его менять. Копия стоит длины ответа,
      // а не длины базы.
      return (linksByConcept.get(conceptId) || []).slice();
    }

function addNodeToGraph(nodeData) {
      // Узел уже лежит в nodes; здесь только начальные координаты.
      // Без них d3 поставит его в (0,0) и рывком выбросит через весь
      // экран, а пользователь потеряет только что созданное из виду.
      pinnedVisibleNodes.add(nodeData.id);
      if (nodeData.x === undefined || nodeData.y === undefined) {
        const c = renderState.transform.invert([S.viewWidth / 2, S.viewHeight / 2]);
        nodeData.x = c[0] + (Math.random() - 0.5) * 60;
        nodeData.y = c[1] + (Math.random() - 0.5) * 60;
        nodeData.vx = 0;
        nodeData.vy = 0;
      }
      updateGraphData();
      emit('filters-applied');
    }

function updateNodeOnGraph() {
      linkLayer.key = null;   // метка и цвет узла живут вне слоя, но правка
      requestDraw();          // могла задеть и философа, и связи
    }

function addLinkToGraph(linkData) {
      // d3 ждёт в source/target объекты узлов, а не идентификаторы:
      // на строках сила связей молча не сработает.
      const s = conceptById.get((linkData.source.id || linkData.source));
      const t = conceptById.get((linkData.target.id || linkData.target));
      if (!s || !t) { console.error('Не найдены узлы для связи', linkData); return; }
      linkData.source = s;
      linkData.target = t;
      updateGraphData();
      emit('filters-applied');
    }

function updateLinkOnGraph() {
      // Тип, вес и взаимность меняют и вид, и полосу попадания.
      // Признак годности слоя опирается на положения, счёт и ссылки на
      // наборы — ничего из этого правка не трогает, поэтому сброс явный.
      S.pickDirty = true;
      linkLayer.key = null;
      requestDraw();
    }

function forgetNode(nodeId) {
      pinnedVisibleNodes.delete(nodeId);
      renderState.radius.delete(nodeId);
      renderState.labelDy.delete(nodeId);
      for (const n of Array.from(selectedNodes)) {
        if (n && n.id === nodeId) selectedNodes.delete(n);
      }
      if (renderState.hoveredNode && renderState.hoveredNode.id === nodeId) {
        renderState.hoveredNode = null;
      }
      for (const store of [renderState.nodeClasses]) {
        Object.values(store).forEach(set => { if (set) set.delete(nodeId); });
      }
      if (S.similarityOverlay && S.similarityOverlay.values) {
        S.similarityOverlay.values.delete(nodeId);
      }
      if (S.visibleNodeIds) S.visibleNodeIds.delete(nodeId);
    }

function forgetLink(link) {
      selectedEdges.delete(link);
      if (renderState.hoveredLink === link) renderState.hoveredLink = null;
      Object.values(renderState.linkClasses).forEach(set => {
        if (set) set.delete(link);
      });
      if (S.visibleLinkSet) S.visibleLinkSet.delete(link);
    }

function connectionsBetween(sourceId, targetId) {
      return DATA.links.filter(l => {
        const s = l.source.id || l.source;
        const t = l.target.id || l.target;
        return (s === sourceId && t === targetId)
          || (s === targetId && t === sourceId);
      });
    }

export { addLinkToGraph, addNodeToGraph, connectionsBetween, findConnection, forgetLink, forgetNode, getConceptConnections, traditionsOfPhilosopher, updateLinkOnGraph, updateNodeOnGraph };
