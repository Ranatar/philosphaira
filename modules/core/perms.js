// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

const PERM = Object.freeze({
      CREATE_COMMIT: 'create_commit',   // можно править граф (через очередь)
      // БАН И ОТКАТ. Кнопки бана, «Откатить» и «Вернуть к версии» рисуются
      // по этим правам, а ключей здесь не было: PERM.BAN_USER и
      // PERM.REVERT_COMMIT давали undefined, can(undefined) — ложь, и
      // кнопок не видел никто, включая администратора, хотя сервер всё
      // умеет (найдено 26.09.2026). Утверждение «кнопка бана нарисована по
      // праву» сходилось при этом само собой: ложь равна лжи.
      BAN_USER: 'ban_user',
      REVERT_COMMIT: 'revert_commit',
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
