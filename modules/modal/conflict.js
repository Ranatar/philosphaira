// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { reportSubmit } from '../data/backend.js';
import { applyFreshGraph } from '../data/remote.js';
import { ModalContext } from './context.js';
import { closeUniversalModal } from './core.js';
import { openEditConceptModal, openEditPhilosopherModal } from './entry.js';
import { escapeAttr } from '../util/html.js';

function warnRemoteEdit(тронуто) {
      const окно = document.getElementById('universalModal');
      if (!окно || getComputedStyle(окно).display === 'none') return;
      // ModalContext — так это зовётся на самом деле. Я написал по памяти
      // «modalContext», и прибор строения тут же сказал, что такого имени
      // нет: имя, которого нет, останавливает сборку, а не проходит молча.
      const данные = ModalContext && ModalContext.currentData;
      const адрес = данные && (typeof данные === 'string' ? данные : данные.id);
      if (!адрес) return;
      if (!тронуто.some(т => т.entityId === адрес)) return;
      reportSubmit('чужая правка',
        'Эту запись только что изменил кто-то другой. '
        + 'Ваш текст цел; при сохранении вы увидите, что разошлось.');
    }

function showConflict(описание, столкновения) {
      lastConflict = { описание, столкновения, когда: Date.now() };

      const строки = столкновения.map(с => {
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

      const окно = document.getElementById('conflictModal');
      const тело = document.getElementById('conflictBody');
      if (!окно || !тело) {
        // Разметки нет (старая страница) — хотя бы не молчим.
        reportSubmit('столкновение',
          'Правка столкнулась с чужой: ' + столкновения.map(с => с.field).join(', '));
        return;
      }
      тело.innerHTML = строки
        || '<div class="conflict-row">Запись изменилась целиком</div>';
      окно.style.display = 'flex';
      reportSubmit('столкновение', 'Правка столкнулась с чужой');
    }

async function rebuildOverCurrent() {
      const с = lastConflict;
      closeConflictModal();
      if (!с) return;

      const ответ = await api('/api/graph');
      if (!ответ.годно || !ответ.тело || !ответ.тело.data) {
        reportSubmit('отказ', 'Не удалось взять свежую запись у сервера');
        return;
      }
      applyFreshGraph(ответ.тело.data);

      // Окно ЗАКРЫВАЕТСЯ и открывается заново: открытое поверх открытого
      // остаётся с прежним содержимым полей, и правщик увидит своё старое
      // значение вместо нынешнего — то есть ровно то, от чего мы его и
      // спасаем. Первый набросок так и делал, и проба это показала.
      closeUniversalModal();
      const адрес = с.описание.entityId;
      if (с.описание.kind === 'concept') openEditConceptModal(адрес);
      else if (с.описание.kind === 'philosopher') openEditPhilosopherModal(адрес);
      reportSubmit('пересобрано', 'Взято нынешнее состояние — правьте заново');
    }

function closeConflictModal() {
      const окно = document.getElementById('conflictModal');
      if (окно) окно.style.display = 'none';
    }

let lastConflict = null;

export { closeConflictModal, lastConflict, rebuildOverCurrent, showConflict, warnRemoteEdit };
