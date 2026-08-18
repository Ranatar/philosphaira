// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

// DATA   — данные и производные указатели
// S      — изменяемое состояние и отложенные ячейки
// MET    — метрики, к которым обращаются по имени
// VIEWS  — генераторы окон, к которым обращаются по имени
//
// БАЗА ПРИХОДИТ ВВОЗОМ, А НЕ ЗАПРОСОМ. Пока она тянулась fetch-ем, она
// появлялась ПОСЛЕ того как исполнились тела всех модулей, и всё, что от
// неё считается, приходилось откладывать в boot. Ввоз разрешается до
// исполнения любого тела, поэтому DATA полон уже здесь.
import traditions from '../../data/traditions.json' with { type: 'json' };
import philosophers from '../../data/philosophers.json' with { type: 'json' };
import rubrics from '../../data/rubrics.json' with { type: 'json' };
import relationTypes from '../../data/relationTypes.json' with { type: 'json' };
import concepts from '../../data/concepts.json' with { type: 'json' };
import relations from '../../data/relations.json' with { type: 'json' };

export const DATA = { traditions, philosophers, rubrics, relationTypes, concepts, relations };
export const S = {};
export const MET = {};
export const VIEWS = {};
