// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { reportSubmit } from '../data/backend.js';
import { applyFreshGraph } from '../data/remote.js';
import { ModalContext } from './context.js';
import { closeUniversalModal } from './core.js';
import { openEditConceptModal, openEditPhilosopherModal } from './entry.js';
import { escapeAttr } from '../util/html.js';

function warnRemoteEdit(touched) {
      const modal = document.getElementById('universalModal');
      if (!modal || getComputedStyle(modal).display === 'none') return;
      // ModalContext — так это зовётся на самом деле. Я написал по памяти
      // «modalContext», и прибор строения тут же сказал, что такого имени
      // нет: имя, которого нет, останавливает сборку, а не проходит молча.
      const data = ModalContext && ModalContext.currentData;
      const address = data && (typeof data === 'string' ? data : data.id);
      if (!address) return;
      if (!touched.some(t => t.entityId === address)) return;
      reportSubmit('чужая правка',
        'Эту запись только что изменил кто-то другой. '
        + 'Ваш текст цел; при сохранении вы увидите, что разошлось.');
    }

function showConflict(descr, столкновения) {
      // ПОЛЕ ОСТАЁТСЯ «описание»: его читает rebuildOverCurrent и проба.
      // Переименование довода свернуло запись в `{ descr, … }`, и
      // пересборка поверх текущего падала на `c.описание.entityId`.
      lastConflict = { описание: descr, столкновения, когда: Date.now() };

      const lines = столкновения.map(с => {
        if (!с.field) {
          return `<div class="conflict-row"><b>${escapeAttr(String(с.reason || 'столкновение'))}</b></div>`;
        }
        return '<div class="conflict-row">'
          + `<div><b>${escapeAttr(с.field)}</b></div>`
          + `<div>вы видели: ${escapeAttr(String(с.base ?? ''))}</div>`
          + `<div>вы хотели: ${escapeAttr(String(с.yours ?? ''))}</div>`
          + `<div>сейчас там: ${escapeAttr(String(с.current ?? ''))}</div>`
          + '</div>';
      }).join('');

      const modal = document.getElementById('conflictModal');
      const body = document.getElementById('conflictBody');
      if (!modal || !body) {
        // Разметки нет (старая страница) — хотя бы не молчим.
        reportSubmit('столкновение',
          'Правка столкнулась с чужой: ' + столкновения.map(с => с.field).join(', '));
        return;
      }
      body.innerHTML = lines
        || '<div class="conflict-row">Запись изменилась целиком</div>';
      modal.style.display = 'flex';
      reportSubmit('столкновение', 'Правка столкнулась с чужой');
    }

async function rebuildOverCurrent() {
      const c = lastConflict;
      closeConflictModal();
      if (!c) return;

      const reply = await api('/api/graph');
      if (!reply.годно || !reply.тело || !reply.тело.data) {
        reportSubmit('отказ', 'Не удалось взять свежую запись у сервера');
        return;
      }
      applyFreshGraph(reply.тело.data);

      // Окно ЗАКРЫВАЕТСЯ и открывается заново: открытое поверх открытого
      // остаётся с прежним содержимым полей, и правщик увидит своё старое
      // значение вместо нынешнего — то есть ровно то, от чего мы его и
      // спасаем. Первый набросок так и делал, и проба это показала.
      closeUniversalModal();
      const address = c.описание.entityId;
      if (c.описание.kind === 'concept') openEditConceptModal(address);
      else if (c.описание.kind === 'philosopher') openEditPhilosopherModal(address);
      reportSubmit('пересобрано', 'Взято нынешнее состояние — правьте заново');
    }

function closeConflictModal() {
      const modal = document.getElementById('conflictModal');
      if (modal) modal.style.display = 'none';
    }

let lastConflict = null;

export { closeConflictModal, lastConflict, rebuildOverCurrent, showConflict, warnRemoteEdit };
