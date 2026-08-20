// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { sumWeight } from '../core/link-facts.js';

let instrumentalIndexCache = null;

MET.instrumentalIndex = function instrumentalIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const asMethod = outgoing.filter(r => r.type === 'instrument');
      const servesAsMethod = sumWeight(asMethod);

      const domains = new Set();
      const authors = new Set();
      asMethod.forEach(r => {
        const target = S._conceptMap.get(r.target);
        if (!target) return;
        (target.rubrics || []).forEach(rub => domains.add(rub));
        if (target.philosopher !== concept.philosopher) authors.add(target.philosopher);
      });

      return {
        total: servesAsMethod * 2 + domains.size * 2 + authors.size,
        servesAsMethod,
        domainsServed: domains.size,
        crossAuthor: authors.size,
        instrumentLinks: asMethod.length
      };
    };

function invalidateInstrumentalIndexCache() {
      instrumentalIndexCache = null;
    }

let abstractionIndexCache = null;

MET.abstractionIndex = function abstractionIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      const illustratedBy = sumWeight(incoming.filter(r => r.type === 'exemplify'));
      const illustrates   = sumWeight(outgoing.filter(r => r.type === 'exemplify'));

      const illustrators = new Set();
      incoming.filter(r => r.type === 'exemplify').forEach(r => {
        const source = S._conceptMap.get(r.source);
        if (source) illustrators.add(source.id);
      });

      return {
        total: illustratedBy - illustrates,
        illustratedBy,
        illustrates,
        distinctIllustrations: illustrators.size
      };
    };

function invalidateAbstractionIndexCache() {
      abstractionIndexCache = null;
    }

let deductiveIndexCache = new Map();

MET.deductiveDepth = function deductiveDepth(conceptId, seen) {
      if (seen.has(conceptId)) return 0;
      seen.add(conceptId);
      let best = 0;
      for (const r of (S._outgoingLinks.get(conceptId) || [])) {
        if (r.type !== 'consequence') continue;
        const d = 1 + MET.deductiveDepth(r.target, seen);
        if (d > best) best = d;
      }
      seen.delete(conceptId);
      return best;
    };

MET.deductiveIndex = function deductiveIndex(conceptId) {
      if (deductiveIndexCache.has(conceptId)) return deductiveIndexCache.get(conceptId);

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const direct = outgoing.filter(r => r.type === 'consequence');
      const directConsequences = sumWeight(direct);

      const authors = new Set();
      direct.forEach(r => {
        const target = S._conceptMap.get(r.target);
        if (target) authors.add(target.philosopher);
      });

      const derivationDepth = MET.deductiveDepth(conceptId, new Set());

      const result = {
        total: directConsequences * 2 + derivationDepth * 3 + authors.size,
        directConsequences,
        derivationDepth,
        breadth: authors.size,
        consequenceLinks: direct.length
      };
      deductiveIndexCache.set(conceptId, result);
      return result;
    };

function invalidateDeductiveIndexCache() {
      deductiveIndexCache = new Map();
    }

export { invalidateAbstractionIndexCache, invalidateDeductiveIndexCache, invalidateInstrumentalIndexCache };
