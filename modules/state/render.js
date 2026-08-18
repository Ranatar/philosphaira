// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';

S.viewWidth = window.innerWidth;

S.viewHeight = window.innerHeight;

S.pickDirty = true;

S.arrowMode = 'default';

S.arrowRadius = null;

S.uniformLinkWidthActive = false;

S.similarityOverlay = null;

S.simulation = d3.forceSimulation(DATA.nodes)
      .force("link", d3.forceLink(DATA.links).id(d => d.id).distance(160))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(S.viewWidth / 2, S.viewHeight / 2))
      .force("collision", d3.forceCollide().radius(45))
      .alphaDecay(0.02);

S.tickCount = 0;

let selectedNodes = new Set();

let selectedEdges = new Set();

S.isGrouped = false;

export { selectedEdges, selectedNodes };
