// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { api } from '../core/api.js';

import { refreshEditHints, renderAuthControls } from './edit-rights.js';
import { escapeAttr } from '../util/html.js';

let securitySecret = null;

function securityModalEl() { return document.getElementById('authModal'); }

function securityError(text) {
      const el = document.getElementById('securityError');
      if (el) el.textContent = text || '';
    }

async function openSecurityModal() {
      const el = securityModalEl();
      if (!el) return;
      securitySecret = null;
      S.authModalKind = 'security';
      const reply = await api('/api/users/me');
      const me = (reply.тело && reply.тело.data) || {};
      const ready = me.state ? me.state.mfaReady === true : false;
      const mail = me.state ? me.state.emailVerified === true : false;
      el.innerHTML =
        '<h3>🛡️ Безопасность учётной записи</h3>'
      + '<div class="auth-field"><label>Адрес</label><div id="securityEmail">'
      + (mail ? 'подтверждён' : 'НЕ подтверждён — письмо со ссылкой уже отправлено')
      + '</div></div>'
      + '<div class="auth-field"><label>Второй шаг</label><div id="securityMfa">'
      + (ready ? 'заведён' : 'НЕ заведён — опасные права срезаны')
      + '</div></div>'
      + '<div id="securityBody"></div>'
      + '<div class="auth-error" id="securityError"></div>'
      + '<div class="auth-actions">'
      + '<button data-act-click="close-auth-modal">Закрыть</button>'
      + (ready ? ''
              : '<button class="primary" data-act-click="start-mfa-enroll">Завести второй шаг</button>')
      + '</div>';
      el.classList.add('show');
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.classList.add('show');
    }

async function startMfaEnroll() {
      securityError('');
      const reply = await api('/api/auth/mfa/enroll', { метод: 'POST' });
      if (!reply.годно) {
        securityError('Не удалось начать: ' + (reply.код || 'нет ответа'));
        return;
      }
      const enrollData = reply.тело.data;
      securitySecret = enrollData.секрет;
      const body = document.getElementById('securityBody');
      if (!body) return;
      // Ссылка otpauth отдаётся ТЕКСТОМ, а не картинкой: рисовать QR нечем,
      // а звать чужую службу за картинкой значило бы отдать ей секрет.
      body.innerHTML =
        '<div class="auth-field"><label for="securitySecret">Секрет</label>'
      + '<input type="text" id="securitySecret" readonly value="' + escapeAttr(enrollData.секрет) + '"></div>'
      + '<div class="auth-field"><label for="securityUri">Ссылка otpauth</label>'
      + '<input type="text" id="securityUri" readonly value="' + escapeAttr(enrollData.ссылка) + '"></div>'
      + '<div class="auth-field"><label for="securityCode">Код из приложения</label>'
      + '<input type="text" id="securityCode" autocomplete="off" inputmode="numeric"></div>'
      + '<div class="auth-actions">'
      + '<button class="primary" data-act-click="confirm-mfa-enroll">Подтвердить код</button>'
      + '</div>';
      const field = document.getElementById('securityCode');
      if (field) {
        field.focus();
        field.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); confirmMfaEnroll(); }
        });
      }
    }

async function confirmMfaEnroll() {
      const field = document.getElementById('securityCode');
      const code = field ? String(field.value || '').trim() : '';
      if (!code) { securityError('Введите код из приложения'); return; }
      const reply = await api('/api/auth/mfa/enroll/confirm',
        { метод: 'POST', тело: { code: code } });
      if (!reply.годно) { securityError('Код не сошёлся'); return; }
      securitySecret = null;
      const codes = (reply.тело.data && reply.тело.data.коды) || [];
      const body = document.getElementById('securityBody');
      if (body) {
        // КОДЫ ВИДНЫ ОДИН РАЗ: в базе лежат только их хеши. Поэтому окно
        // требует ЯВНОГО подтверждения, что они сохранены, — закрыть его
        // случайным щелчком мимо значило бы потерять их насовсем.
        body.innerHTML =
          '<div class="auth-field"><label>Коды восстановления</label>'
        + '<div id="securityCodes">' + codes.map(к => escapeAttr(к)).join('<br>') + '</div></div>'
        + '<div class="auth-field">'
        + '<label for="securitySaved">Я сохранил коды вне этого устройства</label>'
        + '<input type="checkbox" id="securitySaved" data-act-change="refresh-security-done-change"></div>'
        + '<div class="auth-actions">'
        + '<button id="securityDone" class="primary" disabled '
        + 'data-act-click="close-auth-modal">Готово</button></div>';
      }
      const row = document.getElementById('securityMfa');
      if (row) row.textContent = 'заведён';
      securityError('');
      renderAuthControls();
      refreshEditHints();
    }

function refreshSecurityDone() {
      const checkbox = document.getElementById('securitySaved');
      const button = document.getElementById('securityDone');
      if (button) button.disabled = !(checkbox && checkbox.checked);
    }

export { confirmMfaEnroll, openSecurityModal, refreshSecurityDone, startMfaEnroll };
