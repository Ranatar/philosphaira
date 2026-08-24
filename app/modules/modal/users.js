// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { PERM, can } from '../core/perms.js';
import { escapeAttr } from '../util/html.js';

let userItems = [];

let usersError = '';

function openUsersPanel() {
      const окно = document.getElementById('usersModal');
      if (!окно) return;
      окно.style.display = 'flex';
      loadUsers();
    }

function closeUsersPanel() {
      const окно = document.getElementById('usersModal');
      if (окно) окно.style.display = 'none';
    }

async function loadUsers() {
      usersError = '';
      const ответ = await api('/api/users?limit=50');
      if (!ответ.годно) {
        userItems = [];
        usersError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                   || 'Не удалось получить список';
      } else {
        userItems = (ответ.тело && ответ.тело.items) || [];
      }
      renderUsers();
      return userItems;
    }

function renderUsers() {
      const место = document.getElementById('usersBody');
      if (!место) return;
      if (usersError) {
        место.innerHTML = `<div class="users-error">${escapeAttr(usersError)}</div>`;
        return;
      }
      if (!userItems.length) {
        место.innerHTML = '<div class="users-empty">Пусто</div>';
        return;
      }
      место.innerHTML = userItems.map(у => {
        // Список ролей ПРИСЛАН. Пустой — значит этому человеку роль менять
        // нельзя, и выбора не рисуем вовсе.
        const роли = (у.allowedRoles || []).map(р =>
          `<button class="user-role" data-id="${escapeAttr(у.userId)}" `
          + `data-role="${escapeAttr(р)}">${escapeAttr(р)}</button>`).join('');
        const бан = у.state && у.state.isBanned
          ? `<button class="user-unban" data-id="${escapeAttr(у.userId)}">Снять бан</button>`
          : `<button class="user-ban" data-id="${escapeAttr(у.userId)}">Забанить</button>`;
        return '<div class="user-item">'
          + `<div class="user-name">${escapeAttr(у.username)}</div>`
          + `<div class="user-role-now">${escapeAttr(у.role)}</div>`
          + роли + (can(PERM.BAN_USER) ? бан : '') + '</div>';
      }).join('');
    }

async function changeUserRoleFromPanel(id, роль) {
      const причина = prompt(`Причина смены роли на «${роль}» (обязательна):`);
      if (!причина) return;
      const ответ = await api('/api/users/' + encodeURIComponent(id) + '/role',
        { метод: 'POST', тело: { newRole: роль, reason: причина } });
      if (!ответ.годно) {
        usersError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                   || 'Сервер отказал';
        renderUsers();
        return;
      }
      await loadUsers();
    }

async function banUserFromPanel(id, снять) {
      const причина = снять ? null : prompt('Причина бана (обязательна):');
      if (!снять && !причина) return;
      const ответ = await api(
        '/api/users/' + encodeURIComponent(id) + (снять ? '/unban' : '/ban'),
        { метод: 'POST', тело: снять ? {} : { reason: причина } });
      if (!ответ.годно) {
        usersError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                   || 'Сервер отказал';
        renderUsers();
        return;
      }
      await loadUsers();
    }

export { banUserFromPanel, changeUserRoleFromPanel, closeUsersPanel, loadUsers, openUsersPanel, userItems, usersError };
