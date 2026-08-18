// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { PICK_LINK_WIDTH, dpr, gfxCanvas, pickCanvas, pickCtx, renderState } from './canvas-core.js';
import { drawSelfLoop, fillArrow, linkDrawWidth, linkVisualState, strokeLink } from './draw-link.js';
import { nodeRadius } from './render-state.js';

let quadtree = null;

function rebuildQuadtree() {
      quadtree = d3.quadtree()
        .x(d => d.x).y(d => d.y)
        .addAll(DATA.nodes.filter(n => isNodeVisible(n) && n.x !== undefined));
    }

function toGraph(clientX, clientY) {
      const rect = gfxCanvas.getBoundingClientRect();
      return renderState.transform.invert([clientX - rect.left, clientY - rect.top]);
    }

function pickNode(gx, gy) {
      if (!quadtree) rebuildQuadtree();
      let maxR = 18;
      for (const v of renderState.radius.values()) if (v > maxR) maxR = v;
      const found = quadtree.find(gx, gy, maxR + 4);
      if (!found) return null;
      const r = nodeRadius(found);
      return (Math.hypot(found.x - gx, found.y - gy) <= r + 2) ? found : null;
    }

function repaintPickCanvas() {
      const t = renderState.transform;
      pickCtx.setTransform(1, 0, 0, 1, 0, 0);
      pickCtx.clearRect(0, 0, pickCanvas.width, pickCanvas.height);
      pickCtx.setTransform(dpr * t.k, 0, 0, dpr * t.k, dpr * t.x, dpr * t.y);
      pickCtx.globalAlpha = 1;
      pickCtx.lineCap = "round";
      pickCtx.lineJoin = "round";
      pickCtx.setLineDash([]);
      for (let i = 0; i < DATA.links.length; i++) {
        const l = DATA.links[i];
        if (!isLinkVisible(l)) continue;
        const id = i + 1;
        const col = "rgb(" + ((id >> 16) & 255) + "," + ((id >> 8) & 255) + "," + (id & 255) + ")";
        pickCtx.strokeStyle = col;
        pickCtx.fillStyle = col;
        // область попадания не уже прежней :hover-зоны
        const pw = Math.max(linkDrawWidth(l, linkVisualState(l)), PICK_LINK_WIDTH);
        if (isReflexiveLink(l)) {
          // У петли source === target, дуга между узлами вырождается
          // в точку — рисовать её на карте выбора незачем, как незачем
          // и наконечник от fillArrow: он рисуется внутри drawSelfLoop.
          drawSelfLoop(pickCtx, l, pw, pickCtx.strokeStyle, 1);
        } else {
          strokeLink(pickCtx, l, pw);
          fillArrow(pickCtx, l);
        }
      }
      S.pickDirty = false;
    }

function pickLink(clientX, clientY) {
      if (S.pickDirty) repaintPickCanvas();
      const rect = gfxCanvas.getBoundingClientRect();
      const px = Math.round((clientX - rect.left) * dpr);
      const py = Math.round((clientY - rect.top) * dpr);
      if (px < 0 || py < 0 || px >= pickCanvas.width || py >= pickCanvas.height) return null;
      let data;
      try { data = pickCtx.getImageData(px, py, 1, 1).data; } catch (e) { return null; }
      const id = (data[0] << 16) | (data[1] << 8) | data[2];
      if (!id || id > DATA.links.length) return null;
      return DATA.links[id - 1];
    }

export { pickLink, pickNode, quadtree, rebuildQuadtree, repaintPickCanvas, toGraph };
