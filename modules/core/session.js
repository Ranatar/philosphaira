// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { PERM, setPermissions } from './perms.js';

const AUTH_ADMIN = { login: 'admin', password: 'admin' };

const authAccounts = new Map();

let authSession = { user: null };

function setSessionUser(user, праваСнаружи) {
      authSession.user = user;
      // Права ПРИСЛАНЫ — берём присланные; нет — выводим из роли, как в
      // местном режиме. Одна строка, и она единственная: заслоны спрашивают
      // готовый набор и о происхождении его не знают.
      setPermissions(Array.isArray(праваСнаружи)
        ? праваСнаружи
        : (user && user.role === 'admin'
             ? [PERM.CREATE_COMMIT, PERM.REVIEW_COMMIT]   // местный админ правит напрямую
             : []));
    }

export { AUTH_ADMIN, authAccounts, authSession, setSessionUser };
