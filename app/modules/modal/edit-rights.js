// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { PERM, can } from '../core/perms.js';
import { authSession } from '../core/session.js';

import { ModalContext } from './context.js';
import { openUniversalModal } from './core.js';

function refreshOpenModalToolbar() {
      const modal = document.getElementById('universalModal');
      if (!modal || !modal.classList.contains('show')) return;
      if (!ModalContext.currentEntity) return;
      openUniversalModal(ModalContext.currentEntity,
                 ModalContext.currentData,
                 ModalContext.currentMode,
                 { noPush: true });
    }

function renderAuthControls() {
      const box = document.getElementById('authButtons');
      if (!box) return;
      const u = authSession.user;
      // Только значки, как и прочие кнопки панели; что делает каждая —
      // говорит подсказка при наведении.
      if (!u) {
        box.innerHTML =
          '<button data-act-click="open-auth-modal" data-tip="Вход">🔑</button>'
        + '<button data-act-click="open-auth-modal-2" data-tip="Регистрация">📝</button>';
      } else {
        box.innerHTML =
          '<button data-act-click="open-security-modal" data-tip="Безопасность учётной записи">🛡️</button>'
        + '<button data-act-click="auth-logout" data-tip="Выйти из учётной записи">🚪</button>'
        + '<span id="authWho" data-tip="' + u.login
        + (u.role === 'admin' ? ' · правка открыта' : '') + '">' + u.login
        + (u.role === 'admin' ? ' · правка открыта' : '') + '</span>';
      }
    }

function philRowTip() {
      return can(PERM.CREATE_COMMIT)
        ? 'Щелчок — выбрать на графе, Ctrl+щелчок — добавить к выбору, двойной — окно философа, Shift+щелчок — правка'
        : 'Щелчок — выбрать на графе, Ctrl+щелчок — добавить к выбору, двойной — окно философа';
    }

function refreshEditHints() {
      const may = can(PERM.CREATE_COMMIT);
      const philHeader = Array.from(document.querySelectorAll('.legend-section h4'))
        .find(h => h.textContent.includes('Философ'));
      if (philHeader) {
        philHeader.style.cursor = may ? 'pointer' : '';
        if (may) philHeader.setAttribute('data-tip', 'Shift+клик для добавления философа');
        else philHeader.removeAttribute('data-tip');
      }
      document.querySelectorAll('.legend-item').forEach(item => {
        item.setAttribute('data-tip', may
          ? 'Двойной клик — подробности, Shift+клик — правка'
          : 'Двойной клик — подробности');
      });
    }

export { philRowTip, refreshEditHints, refreshOpenModalToolbar, renderAuthControls };
