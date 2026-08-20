// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from './ns.js';
import './graph-index.js';

function isSymmetricLink(l) {
      if (!l) return false;
      if (l.bidirectional) return true;
      const t = DATA.relationTypesObj[l.type];
      return !!(t && t.symmetric);
    }

function isTypologicalLink(l) {
      const t = DATA.relationTypesObj[l && l.type];
      return !!(t && t.layer === 'typological');
    }

function isReflexiveLink(r) {
      const s = (r.source && r.source.id) || r.source;
      const t = (r.target && r.target.id) || r.target;
      return s === t;
    }

function buildReflexiveMap() {
      const m = new Map();
      S._relations.forEach(r => {
        const s = (r.source && r.source.id) || r.source;
        const t = (r.target && r.target.id) || r.target;
        if (s === t && !m.has(s)) m.set(s, r);
      });
      return m;
    }

function reflexiveLinkOf(conceptId) {
      if (!S._reflexiveMap) S._reflexiveMap = buildReflexiveMap();
      return S._reflexiveMap.get(conceptId) || null;
    }

function sumWeight(links) {
      return links.reduce((s, r) => s + (r.weight || 1), 0);
    }

function otherPhilosopher(r, conceptId) {
      const other = S._conceptMap.get(r.source === conceptId ? r.target : r.source);
      return other ? S._philosopherMap.get(other.philosopher) : null;
    }

export { buildReflexiveMap, isReflexiveLink, isSymmetricLink, isTypologicalLink, otherPhilosopher, reflexiveLinkOf, sumWeight };
