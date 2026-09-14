// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api, serverMode } from '../core/api.js';
import { PERM, can } from '../core/perms.js';
import { pullGraphSince } from '../data/remote.js';
import { toggleSubsection } from './descriptions.js';

import { escapeAttr } from '../util/html.js';

let historyFor = null;

let historyItems = [];

let historyBusy = false;

function historyBlock(kind, entityId) {
      // Без сервера истории нет вовсе: коммиты живут на нём. Молчание здесь
      // честнее пустого раздела, который никогда не наполнится.
      if (!serverMode) return '';
      const key = kind + ':' + entityId;
      return `
        <div class="connections-subsection">
          <div class="subsection-header"
               data-act-click="toggle-entity-history" data-a1="${escapeAttr(kind)}" data-a2="${escapeAttr(entityId)}">
            <div class="subsection-title">🕐 История правок</div>
            <span class="subsection-toggle collapsed" id="toggle-history-${escapeAttr(key)}">▼</span>
          </div>
          <div class="subsection-content collapsed" id="content-history-${escapeAttr(key)}">
            <div class="empty-state-hint">Разверните, чтобы прочесть</div>
          </div>
        </div>`;
    }

async function toggleEntityHistory(kind, entityId) {
      const key = kind + ':' + entityId;
      toggleSubsection('history-' + key);
      const slot = document.getElementById('content-history-' + key);
      if (!slot || slot.classList.contains('collapsed')) return;
      // Повторный разворот не перечитывает: история меняется коммитом, а
      // коммит перерисует окно сам.
      if (historyFor === key && historyItems.length) return renderEntityHistory(kind, entityId);
      if (historyBusy) return;
      historyBusy = true;
      slot.innerHTML = '<div class="empty-state-hint">Читаю историю…</div>';
      const reply = await api('/api/graph/' + encodeURIComponent(kind)
                            + '/' + encodeURIComponent(entityId) + '/history');
      historyBusy = false;
      historyFor = key;
      historyItems = (reply.годно && reply.тело.data && reply.тело.data.items) || [];
      renderEntityHistory(kind, entityId);
    }

function renderEntityHistory(kind, entityId) {
      const key = kind + ':' + entityId;
      const slot = document.getElementById('content-history-' + key);
      if (!slot) return;
      if (!historyItems.length) {
        slot.innerHTML = '<div class="empty-state-hint">Правок не было: '
          + 'сущность в том виде, в каком пришла с семенем графа</div>';
        return;
      }
      // Свежие сверху: человек ищет «что изменилось на днях», а не начало времён.
      const rows = [...historyItems].reverse().map(к => {
        const mine = (к.changes || []).filter(и => и.kind === kind && и.entityId === entityId);
        const fields = mine.flatMap(и => Object.entries(и.fields || {})
          .map(([имя, пара]) => `
            <div class="history-field"><b>${escapeAttr(имя)}</b>
              <div class="history-was">было: ${escapeAttr(String(пара.base ?? '—')).slice(0, 400)}</div>
              <div class="history-now">стало: ${escapeAttr(String(пара.next ?? '—')).slice(0, 400)}</div>
            </div>`));
        const action = mine.some(и => и.action === 'add') ? 'заведена'
                     : mine.some(и => и.action === 'delete') ? 'удалена' : 'правлена';
        // Вернуть можно К ВЕРСИИ, а не к коммиту: коммит — это правка,
        // а версия — состояние. Возврат применяется сразу, тем же правом,
        // что и откат коммита.
        const back = can(PERM.REVERT_COMMIT)
          ? `<button class="history-revert"
                     data-act-click="revert-entity-to-version" data-a1="${escapeAttr(kind)}" data-a2="${escapeAttr(entityId)}" data-a3="${Number(к.версия)}"
                     >Вернуть к версии ${escapeAttr(String(к.версия))}</button>`
          : '';
        return `<div class="history-item${к.status === 'reverted' ? ' reverted' : ''}">
          <div class="history-head">версия ${escapeAttr(String(к.версия))} · ${escapeAttr(action)}
            · ${escapeAttr(к.author || '')}
            ${к.status === 'reverted' ? '<span class="history-undone">отменён</span>' : ''}</div>
          <div class="history-message">${escapeAttr(к.message || '')}</div>
          ${fields.join('')}
          ${back}
        </div>`;
      });
      slot.innerHTML = '<div class="history-list">' + rows.join('') + '</div>';
    }

async function revertEntityToVersion(kind, entityId, version) {
      const reason = prompt(`Причина возврата ${entityId} к версии ${version} (обязательна):`);
      if (!reason) return;
      const reply = await api('/api/graph/' + encodeURIComponent(kind) + '/'
        + encodeURIComponent(entityId) + '/revert-to/' + encodeURIComponent(version),
        { метод: 'POST', тело: { reason: reason } });
      if (!reply.годно) {
        alert((reply.тело && reply.тело.error && reply.тело.error.message) || 'Сервер отказал');
        return;
      }
      // ОКНО НЕ ЗАКРЫВАЕТСЯ, И ЭТО НЕ УДОБСТВО, А УСТРОЙСТВО. Вызов
      // closeUniversalModal отсюда замкнул бы круг ввозов
      // connection-view → core → history → core: прибор map_tree назвал его
      // «круговых групп 1» в тот же прогон. Вместо закрытия перечитываем
      // историю: возврат — это коммит, и он в неё уже лёг.
      historyFor = null; historyItems = [];
      await pullGraphSince();
      await toggleEntityHistory(kind, entityId);   // свернуть
      await toggleEntityHistory(kind, entityId);   // и развернуть заново
    }

export { historyBlock, renderEntityHistory, revertEntityToVersion, toggleEntityHistory };
