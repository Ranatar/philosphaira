// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { renderState } from './canvas-core.js';
import { selectedNodes } from '../state/render.js';

const LABEL_HIDE_BELOW = 0.6;

const LABEL_ALL_ABOVE = 1.0;

function nodeRadius(d)  { return renderState.radius.get(d.id)  ?? 18;  }

function nodeLabelDy(d) { return renderState.labelDy.get(d.id) ?? -25; }

function hasNodeClass(name, d) { const s = renderState.nodeClasses[name]; return !!s && s.has(d.id); }

function hasLinkClass(name, l) { const s = renderState.linkClasses[name]; return !!s && s.has(l); }

const NODE_PASSES = ["dimmed", "normal", "top"];

function nodeDrawPass(d) {
      const selected    = selectedNodes.has(d) || hasNodeClass("selected", d);
      const highlighted = hasNodeClass("highlighted", d);
      if (hasNodeClass("dimmed", d) && !selected && !highlighted) return "dimmed";
      return (selected || highlighted) ? "top" : "normal";
    }

function nodeEdgeWidth(d) {
      const selected    = selectedNodes.has(d) || hasNodeClass("selected", d);
      const highlighted = hasNodeClass("highlighted", d);
      const ov = S.similarityOverlay;
      if (ov && d.id !== ov.sourceId) {
        const v = ov.values.get(d.id);
        if (v !== null && v !== undefined && !selected) {
          // Н2: доля от максимума строки — толщина на полную шкалу
          const t = Math.max(-1, Math.min(1, v / ov.rowMax));
          return 2 + Math.abs(t) * 5;
        }
      } else if (ov && d.id === ov.sourceId) {
        return 7;
      }
      return selected ? 6 : (highlighted ? 5 : 3);
    }

function nodeOuterRadius(d) { return nodeRadius(d) + nodeEdgeWidth(d) / 2; }

export { LABEL_ALL_ABOVE, LABEL_HIDE_BELOW, NODE_PASSES, hasLinkClass, hasNodeClass, nodeDrawPass, nodeEdgeWidth, nodeLabelDy, nodeOuterRadius, nodeRadius };
