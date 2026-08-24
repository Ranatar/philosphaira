// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

const ModalContext = {
      currentEntity: null,    // 'philosopher' | 'concept' | 'connection'
      currentMode: 'view',    // 'view' | 'edit'
      currentData: null,    // строка (имя философа) либо объект
      editState: {}       // состояние форм: selectedSource и прочее
    };

export { ModalContext };
