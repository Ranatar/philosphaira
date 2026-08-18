// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { renderState } from './canvas-core.js';

const LABEL_HIDE_BELOW = 0.6;

const LABEL_ALL_ABOVE = 1.0;

function nodeRadius(d)  { return renderState.radius.get(d.id)  ?? 18;  }

function nodeLabelDy(d) { return renderState.labelDy.get(d.id) ?? -25; }

function hasNodeClass(name, d) { const s = renderState.nodeClasses[name]; return !!s && s.has(d.id); }

function hasLinkClass(name, l) { const s = renderState.linkClasses[name]; return !!s && s.has(l); }

export { LABEL_ALL_ABOVE, LABEL_HIDE_BELOW, hasLinkClass, hasNodeClass, nodeLabelDy, nodeRadius };
