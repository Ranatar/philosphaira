// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

const PERM = Object.freeze({
      CREATE_COMMIT: 'create_commit',   // можно править граф (через очередь)
      REVIEW_COMMIT: 'review_commit',   // можно править НАПРЯМУЮ, без очереди
      // Перекладка графа. Право отдельное от прочих администраторских
      // нарочно: настройки меняют то, КАК работает система, а перекладка —
      // то, ЧТО люди видят глазами. Клиент его не выводит из роли, а
      // получает от сервера: в местном режиме перекладки нет вовсе, потому
      // что нет и хранимой раскладки, которую можно было бы переучредить.
      RELAYOUT_GRAPH: 'relayout_graph',
    });

let granted = new Set();

function setPermissions(права) { granted = new Set(права); }

function can(право) { return granted.has(право); }

export { PERM, can, setPermissions };
