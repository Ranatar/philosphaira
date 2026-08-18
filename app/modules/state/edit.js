// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

let editMode = {
      active: false,
      type: null, // 'philosopher', 'concept', 'connection'
      data: null,
      isNew: false,
      pendingConceptSelection: [] // Для последовательного выбора двух концепций
    };

let graphSelectionContext = { active: false, type: null, mode: 'edit' };

export { editMode, graphSelectionContext };
