// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api, serverMode } from '../core/api.js';
import { escapeAttr } from '../util/html.js';

let unreadCount = 0;

let notifyItems = [];

async function refreshUnread() {
      if (!serverMode) return 0;
      const ответ = await api('/api/notifications/unread-count');
      if (!ответ.годно || !ответ.тело) return unreadCount;
      unreadCount = (ответ.тело.data && ответ.тело.data.count) || 0;
      renderBell();
      return unreadCount;
    }

async function loadNotifications() {
      if (!serverMode) return [];
      const ответ = await api('/api/notifications?limit=50');
      notifyItems = (ответ.годно && ответ.тело && ответ.тело.data) || [];
      renderNotifyList();
      return notifyItems;
    }

function renderBell() {
      const колокол = document.getElementById('notifyBell');
      if (!колокол) return;
      колокол.style.display = serverMode ? 'inline-block' : 'none';
      const значок = document.getElementById('notifyBadge');
      if (!значок) return;
      значок.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
      значок.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

function renderNotifyList() {
      const место = document.getElementById('notifyList');
      if (!место) return;
      if (!notifyItems.length) {
        место.innerHTML = '<div class="notify-empty">Пока ничего</div>';
        return;
      }
      место.innerHTML = notifyItems.map(з => {
        const прочитано = з.прочитано ? ' notify-read' : '';
        const кнопка = (з.вид === 'адресное' && !з.прочитано)
          ? `<button class="notify-mark" data-id="${escapeAttr(з.id)}">прочитано</button>`
          : '';
        return `<div class="notify-item${прочитано}">`
             + `<div class="notify-type">${escapeAttr(notifyWords(з.type))}</div>`
             + `<div class="notify-when">${escapeAttr(String(з.createdAt).slice(0, 16).replace('T', ' '))}</div>`
             + кнопка + '</div>';
      }).join('');
    }

function notifyWords(тип) {
      const словарь = {
        graph_changed: 'Граф изменён',
        commit_approved: 'Ваше изменение одобрено',
        commit_rejected: 'Ваше изменение отклонено',
        commit_conflicted: 'Ваше изменение столкнулось с чужим',
        commit_coincided: 'То же самое уже внесли',
        new_commit_pending: 'Новое изменение на рассмотрении',
        role_changed: 'Ваша роль изменена',
        user_promoted: 'Повышение в правах',
        user_demoted: 'Понижение в правах',
        user_banned: 'Учётная запись заблокирована',
        user_unbanned: 'Блокировка снята',
      };
      return словарь[тип] || 'Уведомление';
    }

function toggleNotifyPanel() {
      const панель = document.getElementById('notifyPanel');
      if (!панель) return;
      const открыть = getComputedStyle(панель).display === 'none';
      панель.style.display = открыть ? 'block' : 'none';
      if (открыть) loadNotifications();
    }

async function markNotificationRead(id) {
      if (!serverMode || !id) return;
      await api('/api/notifications/' + encodeURIComponent(id) + '/read',
        { метод: 'POST' });
      const з = notifyItems.find(з => String(з.id) === String(id));
      if (з) з.прочитано = true;
      renderNotifyList();
      await refreshUnread();
    }

async function markAllNotificationsRead() {
      if (!serverMode) return;
      await api('/api/notifications/read-all', { метод: 'POST' });
      notifyItems.forEach(з => { з.прочитано = true; });
      renderNotifyList();
      await refreshUnread();
    }

export { loadNotifications, markAllNotificationsRead, markNotificationRead, notifyItems, refreshUnread, renderBell, toggleNotifyPanel, unreadCount };
