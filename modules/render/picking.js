// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { PICK_LINK_WIDTH, gfxCanvas, renderState } from './canvas-core.js';
import { linkDrawWidth, linkVisualState } from './draw-link.js';
import { linkShape, linkStrokeWidth } from './geometry.js';
import { NODE_PASSES, nodeDrawPass, nodeRadius } from './render-state.js';
import { DRAW_ORDER, linkDrawnLive } from './scene.js';

function toGraph(clientX, clientY) {
      const rect = gfxCanvas.getBoundingClientRect();
      return renderState.transform.invert([clientX - rect.left, clientY - rect.top]);
    }

function pickNode(gx, gy) {
      let hit = null, hitPass = -1;
      for (const n of DATA.nodes) {
        if (!isNodeVisible(n) || n.x === undefined) continue;
        if (Math.hypot(n.x - gx, n.y - gy) > nodeRadius(n) + 2) continue;
        const pass = NODE_PASSES.indexOf(nodeDrawPass(n));
        if (pass >= hitPass) { hit = n; hitPass = pass; }   // нарисован позже — лежит выше
      }
      return hit;
    }

function pointInTriangle(x, y, t) {
      const side = (a, b) => (x - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (y - b[1]);
      const d1 = side(t[0], t[1]), d2 = side(t[1], t[2]), d3 = side(t[2], t[0]);
      return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
    }

function distToSegment(x, y, a, b) {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
    }

function hitLinkShape(g, w, x, y) {
      let dHead = Infinity, onHead = false;
      for (const h of g.heads) {
        if (pointInTriangle(x, y, h)) { onHead = true; dHead = 0; break; }
        dHead = Math.min(dHead, distToSegment(x, y, h[0], h[1]),
                         distToSegment(x, y, h[1], h[2]), distToSegment(x, y, h[2], h[0]));
      }
      let u = Math.atan2(y - g.cy, x - g.cx) - g.s0;
      u -= 2 * Math.PI * Math.floor(u / (2 * Math.PI));
      const inSpan = g.s1 > g.s0 && u <= g.s1 - g.s0;
      const off = Math.abs(Math.hypot(x - g.cx, y - g.cy) - g.r);
      const dArc = inSpan ? off : Math.min(
        Math.hypot(x - g.cx - g.r * Math.cos(g.s0), y - g.cy - g.r * Math.sin(g.s0)),
        Math.hypot(x - g.cx - g.r * Math.cos(g.s1), y - g.cy - g.r * Math.sin(g.s1)));
      return { visible: onHead || (inSpan && off <= w / 2), d: Math.min(dArc, dHead) };
    }

function pickLink(clientX, clientY) {
      const rect = gfxCanvas.getBoundingClientRect();
      if (clientX < rect.left || clientY < rect.top ||
          clientX >= rect.right || clientY >= rect.bottom) return null;
      const [x, y] = toGraph(clientX, clientY);
      const n = DATA.links.length;
      let best = null, bestRank = -1, bestD = Infinity, onStroke = false;
      for (let i = 0; i < n; i++) {
        const l = DATA.links[i];
        if (!isLinkVisible(l)) continue;
        const s = l.source, t = l.target;
        if (!s || !t || s.x === undefined || t.x === undefined) continue;
        const state = linkVisualState(l), w = linkDrawWidth(l, state);
        const band = Math.max(w, PICK_LINK_WIDTH) / 2;
        // Грубый отсев: дуга лежит в круге вокруг середины хорды (петля —
        // около узла), наконечник не длиннее 6 × ширина.
        const reach = (s === t) ? 4 * nodeRadius(s) + 4 * w + 20
          : 0.56 * Math.hypot(t.x - s.x, t.y - s.y) + 6 * Math.max(w, linkStrokeWidth(l)) + 20;
        if (Math.hypot(x - (s.x + t.x) / 2, y - (s.y + t.y) / 2) > reach + band) continue;
        const g = linkShape(l, w);
        if (!g) continue;
        const hit = hitLinkShape(g, w, x, y), d = hit.d;
        if (d > band) continue;
        const rank = (linkDrawnLive(l) ? DRAW_ORDER.length : 0) * n
                   + DRAW_ORDER.indexOf(state) * n + i;
        // Строго на фигуре: сглаженная кайма шириной в полпикселя видимой
        // не считается — иначе связь, чья кайма легла поверх другой,
        // отнимала бы у неё точку, которую видно как ту.
        if (hit.visible) {
          if (!onStroke || rank > bestRank) { best = l; bestRank = rank; onStroke = true; }
        } else if (!onStroke && (d < bestD || (d === bestD && rank > bestRank))) {
          best = l; bestD = d; bestRank = rank;
        }
      }
      return best;
    }

export { pickLink, pickNode, toGraph };
