// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { PERM, can } from '../core/perms.js';
import { escapeAttr } from '../util/html.js';

let userItems = [];

let usersError = '';

function openUsersPanel() {
      const modal = document.getElementById('usersModal');
      if (!modal) return;
      modal.style.display = 'flex';
      loadUsers();
    }

function closeUsersPanel() {
      const modal = document.getElementById('usersModal');
      if (modal) modal.style.display = 'none';
    }

async function loadUsers() {
      usersError = '';
      const reply = await api('/api/users?limit=50');
      if (!reply.годно) {
        userItems = [];
        usersError = (reply.тело && reply.тело.error && reply.тело.error.message)
                   || 'Не удалось получить список';
      } else {
        // Вид ответа один: успех в поле data. Прежнее чтение (ответ.тело.items)
        // держалось на том, что списки уезжали наружу без обёртки; терпим и
        // старый вид, чтобы страница пережила сервер прежней редакции.
        const usersBody = (reply.тело && reply.тело.data) || reply.тело || {};
        userItems = usersBody.items || [];
      }
      renderUsers();
      return userItems;
    }

function renderUsers() {
      const slot = document.getElementById('usersBody');
      if (!slot) return;
      if (usersError) {
        slot.innerHTML = `<div class="users-error">${escapeAttr(usersError)}</div>`;
        return;
      }
      if (!userItems.length) {
        slot.innerHTML = '<div class="users-empty">Пусто</div>';
        return;
      }
      slot.innerHTML = userItems.map(u => {
        // Список ролей ПРИСЛАН. Пустой — значит этому человеку роль менять
        // нельзя, и выбора не рисуем вовсе.
        const roles = (u.allowedRoles || []).map(р =>
          `<button class="user-role" data-id="${escapeAttr(u.userId)}" `
          + `data-role="${escapeAttr(р)}">${escapeAttr(р)}</button>`).join('');
        const ban = u.state && u.state.isBanned
          ? `<button class="user-unban" data-id="${escapeAttr(u.userId)}">Снять бан</button>`
          : `<button class="user-ban" data-id="${escapeAttr(u.userId)}">Забанить</button>`;
        return '<div class="user-item">'
          + `<div class="user-name">${escapeAttr(u.username)}</div>`
          + `<div class="user-role-now">${escapeAttr(u.role)}</div>`
          + roles + (can(PERM.BAN_USER) ? ban : '') + '</div>';
      }).join('');
    }

async function changeUserRoleFromPanel(id, role) {
      const reason = prompt(`Причина смены роли на «${role}» (обязательна):`);
      if (!reason) return;
      const reply = await api('/api/users/' + encodeURIComponent(id) + '/role',
        { метод: 'POST', тело: { newRole: role, reason: reason } });
      if (!reply.годно) {
        usersError = (reply.тело && reply.тело.error && reply.тело.error.message)
                   || 'Сервер отказал';
        renderUsers();
        return;
      }
      await loadUsers();
    }

async function banUserFromPanel(id, unban) {
      const reason = unban ? null : prompt('Причина бана (обязательна):');
      if (!unban && !reason) return;
      const reply = await api(
        '/api/users/' + encodeURIComponent(id) + (unban ? '/unban' : '/ban'),
        { метод: 'POST', тело: unban ? {} : { reason: reason } });
      if (!reply.годно) {
        usersError = (reply.тело && reply.тело.error && reply.тело.error.message)
                   || 'Сервер отказал';
        renderUsers();
        return;
      }
      await loadUsers();
    }

export { banUserFromPanel, changeUserRoleFromPanel, closeUsersPanel, loadUsers, openUsersPanel, userItems, usersError };
