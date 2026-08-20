// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';
import d3 from '../../vendor/d3.js';

// DATA.concepts.forEach(c => { DATA.conceptToRubrics[c.id] = c.r) @0293d862
function buildConceptToRubrics() {
DATA.concepts.forEach(c => {
      DATA.conceptToRubrics[c.id] = c.rubrics || [];
    });
}

// DATA.rubrics.forEach(r => { DATA.rubricsObj[r.name] = { conce) @ae17de32
function buildRubricsIndex() {
DATA.rubrics.forEach(r => {
      DATA.rubricsObj[r.name] = {
        concepts: DATA.concepts.filter(c => c.rubrics && c.rubrics.includes(r.id)).map(c => c.id),
        description: r.description
      };
    });
}

const conceptById = new Map();

const philosopherByName = new Map();

const traditionById = new Map();

const rubricById = new Map();

const nodesByPhilosopher = new Map();

const linksByConcept = new Map();

function rebuildIndexes() {
      conceptById.clear();
      DATA.nodes.forEach(n => conceptById.set(n.id, n));

      philosopherByName.clear();
      DATA.philosophers.forEach(p => philosopherByName.set(p.nameRu, p));

      traditionById.clear();
      DATA.traditions.forEach(t => traditionById.set(t.id, t));

      rubricById.clear();
      DATA.rubrics.forEach(r => rubricById.set(r.id, r));

      nodesByPhilosopher.clear();
      DATA.nodes.forEach(n => {
        let a = nodesByPhilosopher.get(n.concept);
        if (!a) { a = []; nodesByPhilosopher.set(n.concept, a); }
        a.push(n);
      });

      // d3 подменяет source/target ссылками на узлы уже на первом тике,
      // поэтому конец связи читается через (l.source && l.source.id).
      linksByConcept.clear();
      DATA.nodes.forEach(n => linksByConcept.set(n.id, []));
      DATA.links.forEach(l => {
        const s = (l.source && l.source.id) || l.source;
        const t = (l.target && l.target.id) || l.target;
        let a = linksByConcept.get(s);
        if (!a) { a = []; linksByConcept.set(s, a); }
        a.push(l);
        if (t !== s) {
          let b = linksByConcept.get(t);
          if (!b) { b = []; linksByConcept.set(t, b); }
          b.push(l);
        }
      });
    }

// DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.name) @bb1f233a
function buildPhilosopherTraditions() {
DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
}

function buildIndexes() {
  DATA.philosopherIdToName = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherIdToName[p.id] = p.nameRu;
      });
  
  DATA.philosopherConcepts = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherConcepts[p.nameRu] = {
          color: p.color,
          years: p.years
        };
      });
  
  DATA.philosopherOrder = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherOrder[p.nameRu] = p.birth;
      });
  
  DATA.relationTypesObj = {};
  
  DATA.relationTypes.forEach(rt => {
        DATA.relationTypesObj[rt.id] = {
          color: rt.color,
          label: rt.label,
          layer: rt.layer,    // A9: нужен для B1 и для будущей проверки целостности
          temporal: rt.temporal,
          symmetric: rt.symmetric === true,
          ground: rt.ground || null
        };
      });
  
  DATA.linkColors = {};
  
  DATA.relationTypes.forEach(rt => {
        DATA.linkColors[rt.id] = rt.color;
      });
  
  DATA.nodes = DATA.concepts.map(c => ({
        id: c.id,
        label: c.label,
        concept: DATA.philosopherIdToName[c.philosopher], // Преобразуем id в имя
        rubrics: c.rubrics || [],
        description: c.description,
        extendedDescription: c.extendedDescription
      }));
  
  DATA.links = DATA.relations.map(r => ({
        source: r.source,
        target: r.target,
        type: r.type,
        weight: r.weight || 2, // Вес по умолчанию, если не указан
        bidirectional: r.bidirectional || false,
        description: r.description,
      }));
  
  DATA.conceptToRubrics = {};
  
  DATA.rubricsObj = {};
  
  DATA.philosopherTraditions = {};
}

// УКАЗАТЕЛИ ГОТОВЫ УЖЕ ЗДЕСЬ, а не из сборки. База ввезена в ns.js, значит
// строить их можно при вычислении этого тела — и тогда всякий, кто ввозит
// этот модуль, получает обещание: указатели на месте. Без такого обещания
// всё, что от них считается, приходилось откладывать в boot.
buildIndexes();

export { buildConceptToRubrics, buildPhilosopherTraditions, buildRubricsIndex, conceptById, linksByConcept, nodesByPhilosopher, philosopherByName, rebuildIndexes, rubricById, traditionById };
