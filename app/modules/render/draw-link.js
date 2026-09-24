// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { renderState } from './canvas-core.js';
import { linkHoverStrokeWidth, linkStrokeWidth } from './geometry.js';
import { hasLinkClass } from './render-state.js';
import { linkAmongHighlighted } from './similarity-overlay.js';
import { selectedEdges } from '../state/render.js';

function linkVisualState(l) {
      if (hasLinkClass("path-highlight", l)) return "path";
      if (selectedEdges.has(l) || hasLinkClass("selected", l)) return "selected";
      if (hasLinkClass("highlighted", l)) return "highlighted";
      if (hasLinkClass("dimmed", l)) return "dimmed";
      return "normal";
    }

function linkDrawWidth(l, state) {
      if (state === "path") return 6;
      if (renderState.uniformLinkWidth) return 2;
      if (renderState.hoveredLink === l) return linkHoverStrokeWidth(l);
      if (state === "selected") return 5;
      if (state === "highlighted") return 4;
      return linkStrokeWidth(l);
    }

function linkDrawAlpha(l, state, tms) {
      if (state === "path") return 0.8 + 0.2 * Math.cos(2 * Math.PI * tms / 1500);
      if (state === "selected" || state === "highlighted") return 1;
      if (state === "dimmed") return 0.1;
      if (renderState.hoveredLink === l) return 0.9;

      // Карта сходства гасит паутину связей. Замер показывал перекос: она
      // приглушает 383 узла из 453, а все 1624 связи остаются в полную силу
      // и перетягивают внимание на то, что карта как раз отодвигает. Ярким
      // остаётся лишь то, что карта рисует сама, — дуги к ближайшим по
      // сходству (они рисуются отдельно и сюда не попадают).
      //
      // Приглушать связи ПО СХОДСТВУ нечем: у связи такого значения нет, а
      // похожие концепции чаще всего рёбрами и не соединены. Поэтому
      // признак другой, чем при щелчке: не «несмежные», а «все обычные».
      // Связь между двумя подсвеченными показывается в полную силу, если
      // переключатель включён: см. toggleSimilarityLinks.
      if (S.similarityOverlay) return linkAmongHighlighted(l) ? 0.85 : 0.07;

      return 0.4;
    }

const CONTRADICTION_DASH = { pattern: [8, 16], secondOffset: 12, second: "#F4D03F" };

function strokeLinkShape(c, g, width) {
      if (!(g.s1 > g.s0)) return;
      c.beginPath();
      c.arc(g.cx, g.cy, g.r, g.s0, g.s1, false);
      const cap = c.lineCap;
      c.lineCap = "butt";
      c.lineWidth = width;
      c.stroke();
      c.lineCap = cap;
    }

function fillLinkHeads(c, g) {
      for (const pts of g.heads) {
        c.beginPath();
        c.moveTo(pts[0][0], pts[0][1]);
        c.lineTo(pts[1][0], pts[1][1]);
        c.lineTo(pts[2][0], pts[2][1]);
        c.closePath();
        c.fill();
      }
    }

export { CONTRADICTION_DASH, fillLinkHeads, linkDrawAlpha, linkDrawWidth, linkVisualState, strokeLinkShape };
