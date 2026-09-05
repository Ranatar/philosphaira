// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { emit } from '../core/events.js';
import { linksByConcept } from '../core/graph-index.js';

function graphFingerprint() {
      const conceptIds = DATA.concepts.map(c => c.id).sort();
      const edgeKeys = DATA.relations
        .map(r => r.source + '|' + r.target + '|' + r.type).sort();
      const fingerprintInput = conceptIds.join(',') + ';' + edgeKeys.join(',');
      // Двойной 32-битный FNV: одного мало для 1,6 тысячи рёбер, а
      // криптографический в браузере только асинхронный.
      let a = 0x811c9dc5, b = 0x01000193;
      for (let i = 0; i < fingerprintInput.length; i++) {
        const c = fingerprintInput.charCodeAt(i);
        a = Math.imul(a ^ c, 0x01000193) >>> 0;
        b = Math.imul(b + c, 0x85ebca6b) >>> 0;
      }
      return (a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0'));
    }

function applyStoredLayout() {
      const stored = DATA.nodePositions;
      const ownFingerprint = graphFingerprint();
      if (!stored || !stored.fingerprint) {
        console.warn('Раскладка: набор позиций пуст — считаю на месте.');
        return false;
      }
      if (stored.fingerprint !== ownFingerprint) {
        console.warn('Раскладка: позиции протухли (в наборе ' + stored.fingerprint +
          ', у базы ' + ownFingerprint + ') — считаю на месте. Пересчитать: node tools/layout.mjs');
        storedLayoutComplaint = 'Позиции графа устарели — раскладка считается заново';
        return false;
      }
      let placed = 0;
      for (const n of DATA.nodes) {
        const p = stored.nodes[n.id];
        if (!p) continue;
        n.x = p[0]; n.y = p[1]; n.vx = 0; n.vy = 0;
        placed++;
      }
      if (placed !== DATA.nodes.length) {
        console.warn('Раскладка: координат ' + placed + ' из ' + DATA.nodes.length +
          ' — считаю на месте.');
        storedLayoutComplaint = 'Позиции графа неполны — раскладка считается заново';
        for (const n of DATA.nodes) { delete n.x; delete n.y; delete n.vx; delete n.vy; }
        return false;
      }
      return true;
    }

function applyServerLayout(позиции) {
      if (!позиции) return false;
      let placed = 0;
      for (const n of DATA.nodes) {
        const p = позиции[n.id];
        if (!p) continue;
        n.x = p[0]; n.y = p[1]; n.vx = 0; n.vy = 0;
        placed++;
      }
      if (placed !== DATA.nodes.length) {
        console.warn('Раскладка с сервера неполна: ' + placed + ' из ' +
          DATA.nodes.length + ' — раскладка считается на месте.');
        return false;
      }
      if (S.simulation) S.simulation.stop();
      S.layoutSettled = true;
      // ПЕРЕРИСОВКА ЧЕРЕЗ СОБЫТИЕ, А НЕ ПРЯМЫМ ЗОВОМ: requestDraw живёт на
      // третьем этаже (render/), а эта створка — на первом, и прямой вызов
      // дал бы ребро ввоза снизу вверх.
      //
      // НО СОБЫТИЕ НУЖНО ВЕРНОЕ. Первая редакция объявляла 'data-changed' —
      // «база правлена». Это неправда: база не менялась, изменились только
      // координаты. И неправда обошлась дорого: на 'data-changed' подписан
      // updateGraphData, а он БУДИТ УКЛАДКУ — узлы тут же уезжали с
      // присланных мест. Замер поймал: расхождение с координатами сервера
      // 352 px вместо нуля.
      //
      // 'filters-applied' — «вид пора обновить»: ровно то, что здесь и
      // случилось, и никто на нём укладку не трогает.
      emit('filters-applied', {});
      return true;
    }

let storedLayoutComplaint = null;

S.viewWidth = window.innerWidth;

S.viewHeight = window.innerHeight;

S.pickDirty = true;

S.arrowMode = 'default';

S.arrowRadius = null;

S.uniformLinkWidthActive = false;

S.similarityOverlay = null;

const linkLayer = { canvas: null, ctx: null, key: null };

S.tickCount = 0;

S.layoutSettled = false;

const layoutFromStore = applyStoredLayout();

const LAYOUT_PULL = 0.1;

const pullStrengthOf = d =>
      LAYOUT_PULL / Math.max(1, (linksByConcept.get(d.id) || []).length);

S.simulation = d3.forceSimulation(DATA.nodes)
      .force("link", d3.forceLink(DATA.links).id(d => d.id).distance(160))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(S.viewWidth / 2, S.viewHeight / 2))
      .force("collision", d3.forceCollide().radius(45))
      .alphaDecay(0.02);

function installLayoutPull() {
      S.simulation
        .force("pullX", d3.forceX(S.viewWidth / 2).strength(pullStrengthOf))
        .force("pullY", d3.forceY(S.viewHeight / 2).strength(pullStrengthOf));
    }

function resetLayoutClock() {
      S.tickCount = 0;
      S.layoutSettled = false;
    }

let selectedNodes = new Set();

let selectedEdges = new Set();

S.isGrouped = false;

export { applyServerLayout, applyStoredLayout, graphFingerprint, installLayoutPull, layoutFromStore, linkLayer, pullStrengthOf, resetLayoutClock, selectedEdges, selectedNodes, storedLayoutComplaint };
