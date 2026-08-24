// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

const PERM = Object.freeze({
      CREATE_COMMIT: 'create_commit',   // можно править граф (через очередь)
      REVIEW_COMMIT: 'review_commit',   // можно править НАПРЯМУЮ, без очереди
    });

let granted = new Set();

function setPermissions(права) { granted = new Set(права); }

function can(право) { return granted.has(право); }

export { PERM, can, setPermissions };
