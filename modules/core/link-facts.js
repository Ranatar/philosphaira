// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
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

function linksBothWays(conceptId) {
      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];
      return incoming.concat(outgoing.filter(r => !isSymmetricLink(r)));
    }

function otherPhilosopher(r, conceptId) {
      const other = S._conceptMap.get(r.source === conceptId ? r.target : r.source);
      return other ? S._philosopherMap.get(other.philosopher) : null;
    }

function linkHasTwoHeads(l) {
      if (l.bidirectional) return true;
      const t = DATA.relationTypesObj[l.type];
      return !!(t && t.symmetric);
    }

function orientLink(l, isOwnEnd) {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      if (s === t) return { left: s, right: t, mark: '↻', ownIsTarget: false };
      const ownIsTarget = !isOwnEnd(s) && isOwnEnd(t);
      return {
        left: ownIsTarget ? t : s,
        right: ownIsTarget ? s : t,
        mark: linkHasTwoHeads(l) ? '↔' : (ownIsTarget ? '←' : '→'),
        ownIsTarget,
      };
    }

function directionMark(l) {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      if (s === t) return '↻';          // возвратная: сама на себя
      // СПРАШИВАЕТ, А НЕ ПЕРЕСКАЗЫВАЕТ. Первая редакция писала здесь
      // `l.bidirectional ? '↔' : '→'` — то же неполное правило, что было
      // в четырёх текстовых местах, и 202 связи симметричных ТИПОВ
      // получали одностороннюю стрелку. При этом полотно рисовало им два
      // наконечника: текст и картинка расходились на глазах у человека.
      // Правило было в пяти местах, из них верно в одном — рисующем.
      return linkHasTwoHeads(l) ? '↔' : '→';
    }

export { buildReflexiveMap, directionMark, isReflexiveLink, isSymmetricLink, isTypologicalLink, linkHasTwoHeads, linksBothWays, orientLink, otherPhilosopher, reflexiveLinkOf, sumWeight };
