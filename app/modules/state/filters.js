// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';

S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));

S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));

S.selectedTraditions = new Set(DATA.traditions.map(t => t.id));

S.selectedRubrics = new Set(DATA.rubrics.map(r => r.id));

S.filterMode = 'all';

const chosenPhilosophers = new Set();

const pinnedDespiteFilter = new Set();

const pinnedVisibleNodes = new Set();

export { chosenPhilosophers, pinnedDespiteFilter, pinnedVisibleNodes };
