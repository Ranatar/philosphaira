// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { isReflexiveLink, linkHasTwoHeads } from '../core/link-facts.js';
import { renderState } from './canvas-core.js';
import { nodeOuterRadius, nodeRadius } from './render-state.js';

function linkStrokeWidth(d) {
      if (renderState.uniformLinkWidth) return 2;
      return d.weight === 3 ? 5 : (d.weight === 1 ? 2 : 3);
    }

function linkHoverStrokeWidth(d) {
      if (renderState.uniformLinkWidth) return 2;
      return d.weight === 3 ? 12 : (d.weight === 1 ? 8 : 10);
    }

function arcParams(s, t) {
      const dx = t.x - s.x, dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!dist) return null;
      const r = dist * 1.5;
      const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
      const hx = (s.x - t.x) / 2, hy = (s.y - t.y) / 2;
      const h2 = hx * hx + hy * hy;
      let f = (r * r - h2) / h2;
      f = f < 0 ? 0 : Math.sqrt(f);
      const cx = mx + f * hy, cy = my - f * hx;
      return { cx, cy, r,
           a0: Math.atan2(s.y - cy, s.x - cx),
           a1: Math.atan2(t.y - cy, t.x - cx) };
    }

function arcAngleOfChord(c, R) {
      return 2 * Math.asin(Math.min(1, c / (2 * R)));
    }

function clippedArc(s, t) {
      const p = arcParams(s, t);
      if (!p) return null;
      let sweep = p.a1 - p.a0;
      while (sweep <= 0) sweep += 2 * Math.PI;
      const e0 = p.a0 + arcAngleOfChord(nodeOuterRadius(s), p.r);
      const e1 = p.a0 + sweep - arcAngleOfChord(nodeOuterRadius(t), p.r);
      if (!(e1 > e0)) return null;
      return { cx: p.cx, cy: p.cy, r: p.r, e0, e1 };
    }

function arrowSize(l, w) {
      let len, half;
      if (S.arrowMode === 'metric') { len = 9; half = 3; }
      else { const sw = linkStrokeWidth(l); len = 6 * sw; half = 3 * sw; }
      const need = (w || 0) / 2 + 1.5;      // не уже штриха, который накрывает
      if (half < need) { len *= need / half; half = need; }
      return { len, half };
    }

function arcHead(g, tipA, baseA, half) {
      const tip  = [g.cx + g.r * Math.cos(tipA),  g.cy + g.r * Math.sin(tipA)];
      const base = [g.cx + g.r * Math.cos(baseA), g.cy + g.r * Math.sin(baseA)];
      const ux = tip[0] - base[0], uy = tip[1] - base[1];
      const L = Math.hypot(ux, uy) || 1;
      const nx = -uy / L * half, ny = ux / L * half;
      return [[base[0] + nx, base[1] + ny], tip, [base[0] - nx, base[1] - ny]];
    }

function linkShape(l, w) {
      if (isReflexiveLink(l)) return loopShape(l, w);
      const s = l.source, t = l.target;
      if (!s || !t || s.x === undefined || t.x === undefined) return null;
      const g = clippedArc(s, t);
      if (!g) return null;
      const two = linkHasTwoHeads(l);
      let { len, half } = arrowSize(l, w);
      // Узлы близко и наконечникам не хватает дуги — ужимаем их, а не
      // выпускаем за край противоположного узла.
      const room = 0.9 * (g.e1 - g.e0);
      const need = (two ? 2 : 1) * arcAngleOfChord(len, g.r);
      if (need > room) { const f = room / need; len *= f; half *= f; }
      const da = arcAngleOfChord(len, g.r);
      g.heads = [arcHead(g, g.e1, g.e1 - da, half)];
      if (two) g.heads.push(arcHead(g, g.e0, g.e0 + da, half));
      g.s0 = two ? g.e0 + da : g.e0;
      g.s1 = g.e1 - da;
      return g;
    }

function loopShape(l, w) {
      const n = l.source;
      if (!n || n.x === undefined) return null;
      const r = nodeRadius(n) || 18, R = 2 * r, D = r * Math.sqrt(3);
      const rho = nodeOuterRadius(n);
      const phi = Math.acos(Math.max(-1, Math.min(1, (D * D + R * R - rho * rho) / (2 * D * R))));
      const g = { cx: n.x, cy: n.y - D, r: R,
            e0: Math.PI / 2 + phi,                   // левая точка на краю
            e1: Math.PI / 2 - phi + 2 * Math.PI };   // через верх к правой
      const k = Math.max(5, w * 2.6);
      const da = arcAngleOfChord(1.3 * k, R);
      g.heads = [arcHead(g, g.e1, g.e1 - da, 0.55 * k)];
      g.s0 = g.e0;
      g.s1 = g.e1 - da;
      return g;
    }

export { clippedArc, linkHoverStrokeWidth, linkShape, linkStrokeWidth };
