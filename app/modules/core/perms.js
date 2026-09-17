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
      // ЗАМЕРЫ — ТРИ ПРАВА. Прежде полоса «Запомнить замер» показывалась по
      // одному условию serverMode, то есть любому вошедшему, а список
      // отдавал ВСЕ замеры, включая чужие. Сервер спрашивал VIEW_GRAPH —
      // самое слабое право, — и удаления не было вовсе.
      SAVE_OBSERVATION: 'save_observation',
      VIEW_ALL_OBSERVATIONS: 'view_all_observations',
      DELETE_OBSERVATION: 'delete_observation',
    });

let granted = new Set();

function setPermissions(permissions) { granted = new Set(permissions); }

function can(permission) { return granted.has(permission); }

export { PERM, can, setPermissions };
