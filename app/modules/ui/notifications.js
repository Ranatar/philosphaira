// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api, serverMode } from '../core/api.js';
import { escapeAttr } from '../util/html.js';

let unreadCount = 0;

let notifyItems = [];

async function refreshUnread() {
      if (!serverMode) return 0;
      const reply = await api('/api/notifications/unread-count');
      if (!reply.годно || !reply.тело) return unreadCount;
      unreadCount = (reply.тело.data && reply.тело.data.count) || 0;
      renderBell();
      return unreadCount;
    }

async function loadNotifications() {
      if (!serverMode) return [];
      const reply = await api('/api/notifications?limit=50');
      notifyItems = (reply.годно && reply.тело && reply.тело.data) || [];
      renderNotifyList();
      return notifyItems;
    }

function renderBell() {
      const bell = document.getElementById('notifyBell');
      if (!bell) return;
      bell.style.display = serverMode ? 'inline-block' : 'none';
      const badge = document.getElementById('notifyBadge');
      if (!badge) return;
      badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
      badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

function renderNotifyList() {
      const slot = document.getElementById('notifyList');
      if (!slot) return;
      if (!notifyItems.length) {
        slot.innerHTML = '<div class="notify-empty">Пока ничего</div>';
        return;
      }
      slot.innerHTML = notifyItems.map(z => {
        const readMark = z.прочитано ? ' notify-read' : '';
        const button = (z.вид === 'адресное' && !z.прочитано)
          ? `<button class="notify-mark" data-id="${escapeAttr(z.id)}">прочитано</button>`
          : '';
        return `<div class="notify-item${readMark}">`
             + `<div class="notify-type">${escapeAttr(notifyWords(z.type))}</div>`
             + `<div class="notify-when">${escapeAttr(String(z.createdAt).slice(0, 16).replace('T', ' '))}</div>`
             + button + '</div>';
      }).join('');
    }

function notifyWords(kind) {
      const dict = {
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
      return dict[kind] || 'Уведомление';
    }

function toggleNotifyPanel() {
      const panel = document.getElementById('notifyPanel');
      if (!panel) return;
      const openBtn = getComputedStyle(panel).display === 'none';
      panel.style.display = openBtn ? 'block' : 'none';
      if (openBtn) loadNotifications();
    }

async function markNotificationRead(id) {
      if (!serverMode || !id) return;
      await api('/api/notifications/' + encodeURIComponent(id) + '/read',
        { метод: 'POST' });
      const found = notifyItems.find(z2 => String(z2.id) === String(id));
      if (found) found.прочитано = true;
      renderNotifyList();
      await refreshUnread();
    }

async function markAllNotificationsRead() {
      if (!serverMode) return;
      await api('/api/notifications/read-all', { метод: 'POST' });
      notifyItems.forEach(z => { z.прочитано = true; });
      renderNotifyList();
      await refreshUnread();
    }

export { loadNotifications, markAllNotificationsRead, markNotificationRead, notifyItems, refreshUnread, renderBell, toggleNotifyPanel, unreadCount };
