// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';

let editMode = {
      active: false,
      type: null, // 'philosopher', 'concept', 'connection'
      data: null,
      isNew: false,
      pendingConceptSelection: [] // Для последовательного выбора двух концепций
    };

S.lastFootnoteHost = null;

export { editMode };
