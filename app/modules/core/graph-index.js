// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
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

      // ПОРЯДОК ЗАДАЁТСЯ ЗДЕСЬ, ОДИН РАЗ НА ВСЕХ.
      //
      // Прежде списки шли в порядке базы, то есть в порядке заведения по
      // заходам A–H: правила, которое можно назвать вслух, не было. Назвать
      // его в каждом из девяти показывающих мест значило бы завести девять
      // правил, которые однажды разойдутся.
      //
      // Сортировка при построении, а не при показе: указатели строятся
      // заново только при правке базы (afterDataChange), а показ идёт
      // постоянно. Платим редко, получаем везде — включая те места, где
      // порядком никто не занимался и не вспомнит.
      nodesByPhilosopher.forEach(a => a.sort(compareConcepts));
      linksByConcept.forEach(a => a.sort(compareLinks));
    }

// DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.name) @bb1f233a
function buildPhilosopherTraditions() {
DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
}

function comparePhilosophers(a, b) {
      // Принимает и ИМЯ, и запись философа: зовут отсюда и там, где в руках
      // список имён (концепции хранят имя в поле concept), и там, где список
      // записей (поиск, традиции). Две почти одинаковые функции разошлись бы.
      const nameOf = x => (x && typeof x === 'object') ? x.nameRu : x;
      const na = nameOf(a), nb = nameOf(b);
      // Год берётся из указателя НАПРЯМУЮ, а не через philosopherBirth:
      // тот живёт в util/philosopher-label.js, и обращение к нему замкнуло
      // бы круг ввозов core/graph-index ↔ util/philosopher-label. Сравнения
      // опираются на указатели, значит и жить должны рядом с ними.
      const birthOf = n => { const p = philosopherByName.get(n); return p ? p.birth : 0; };
      const d = birthOf(na) - birthOf(nb);
      return d !== 0 ? d : String(na).localeCompare(String(nb), 'ru');
    }

function compareConcepts(a, b) {
      const d = comparePhilosophers(a.concept, b.concept);
      return d !== 0 ? d : String(a.label || '').localeCompare(String(b.label || ''), 'ru');
    }

function linkIsInternal(l) {
      const s = conceptById.get(l.source.id || l.source);
      const t = conceptById.get(l.target.id || l.target);
      return !!(s && t && s.concept === t.concept);
    }

function otherEndColor(l, ownerName) {
      const nodeOf = id => conceptById.get(id && id.id ? id.id : id) || {};
      const s2 = nodeOf(l.source), t2 = nodeOf(l.target);
      const other = (s2.concept === ownerName) ? t2 : s2;
      const record = philosopherByName.get(other.concept || ownerName);
      return (record && record.color) || 'var(--fg-muted)';
    }

function compareLinks(a, b) {
      const nodeOf = id => conceptById.get(id.id || id) || {};
      const aS = nodeOf(a.source), aT = nodeOf(a.target);
      const bS = nodeOf(b.source), bT = nodeOf(b.target);
      const byLabel = (x, y) =>
        String(x.label || '').localeCompare(String(y.label || ''), 'ru');
      const aInner = linkIsInternal(a), bInner = linkIsInternal(b);
      return comparePhilosophers(aS.concept, bS.concept)        // 1. чья система
          || (aInner === bInner ? 0 : (aInner ? -1 : 1))        // 2. сперва внутрь себя
          || comparePhilosophers(aT.concept, bT.concept)        // 3. к кому наружу
          || byLabel(aS, bS) || byLabel(aT, bT);                // 4–5. алфавит
    }

function storedRecord(kind, id) {
      if (id == null) return null;
      const set = kind === 'concept' ? DATA.concepts : kind === 'relation' ? DATA.relations : DATA.philosophers;
      return set.find(r => r.id === id) || null;
    }

const OMITTED_WHEN_EMPTY = ['provenance', 'provenanceStatus', 'footnotes'];

function withoutEmptyOptional(record) {
      const out = { ...record };
      for (const k of OMITTED_WHEN_EMPTY) {
        const v = out[k];
        if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete out[k];
      }
      return out;
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
        extendedDescription: c.extendedDescription,
        // Происхождение переносится в узел ЯВНО. Узлы строятся по жёсткому
        // перечню полей, и новое поле сущности само сюда не попадёт: окна
        // просмотра получают именно узел, а не запись из concepts.
        provenance: c.provenance,
        // Состояние переносится ВМЕСТЕ со строкой: окна просмотра получают
        // узел, а не запись набора, и без этого им нечем отличить «нет
        // источника» от «не искали».
        provenanceStatus: c.provenanceStatus
      }));
  
  DATA.links = DATA.relations.map(r => ({
        id: r.id,          // устойчивое имя связи: адрес правки, переживающий
                           // смену типа и концов (заход 0.1)
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

export { buildConceptToRubrics, buildPhilosopherTraditions, buildRubricsIndex, compareConcepts, compareLinks, comparePhilosophers, conceptById, linkIsInternal, linksByConcept, nodesByPhilosopher, otherEndColor, philosopherByName, rebuildIndexes, rubricById, storedRecord, traditionById, withoutEmptyOptional };
