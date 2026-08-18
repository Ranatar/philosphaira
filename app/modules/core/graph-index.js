// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';

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

// DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.name) @bb1f233a
function buildPhilosopherTraditions() {
DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
}

export function buildIndexes() {
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

export { buildConceptToRubrics, buildPhilosopherTraditions, buildRubricsIndex };
