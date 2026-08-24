// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from './ns.js';

S.visibleNodeIds = null;

S.visibleLinkSet = null;

function isNodeVisible(d) { return !S.visibleNodeIds || S.visibleNodeIds.has(d.id); }

function isLinkVisible(l) { return !S.visibleLinkSet || S.visibleLinkSet.has(l); }

export { isLinkVisible, isNodeVisible };
