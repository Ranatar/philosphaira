// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA } from '../core/ns.js';
import '../core/graph-index.js';
import { api } from '../core/api.js';
import { markSupersedes, reportSubmit } from '../data/backend.js';
import { applyFreshGraph } from '../data/remote.js';
import { ModalContext } from './context.js';
import { closeUniversalModal } from './core.js';
import { openEditConceptModal, openEditConnectionModal, openEditPhilosopherModal } from './entry.js';
import { FOOTNOTE_LABELS, escapeAttr } from '../util/html.js';

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

function showConflict(descr, clashes, commitId = null) {
      // ПОЛЕ ОСТАЁТСЯ «описание»: его читает rebuildOverCurrent и проба.
      // Переименование довода свернуло запись в `{ descr, … }`, и
      // пересборка поверх текущего падала на `c.описание.entityId`.
      lastConflict = { описание: descr, clashes, commitId, когда: Date.now() };

      const lines = conflictRowsHtml(clashes);

      const modal = document.getElementById('conflictModal');
      const body = document.getElementById('conflictBody');
      if (!modal || !body) {
        // Разметки нет (старая страница) — хотя бы не молчим.
        reportSubmit('столкновение',
          'Правка столкнулась с чужой: ' + clashes.map(clash => clash.field).join(', '));
        return;
      }
      body.innerHTML = lines
        || '<div class="conflict-row">Запись изменилась целиком</div>';
      modal.style.display = 'flex';
      reportSubmit('столкновение', 'Правка столкнулась с чужой');
    }

function conflictValue(v) {
      if (v == null || v === '') return '—';
      if (Array.isArray(v)) return v.length ? v.map(x => (x && typeof x === 'object')
        ? [x.id, FOOTNOTE_LABELS[x.status] || x.status, x.text].filter(Boolean).join(' · ') : String(x)).join('; ') : '—';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    }

function conflictRowsHtml(clashes) {
      return (clashes || []).map(clash => {
        const where = [clash.entityId, clash.field].filter(Boolean).join(' · ');
        if (!clash.field || !('yours' in clash)) {
          return '<div class="conflict-row">'
            + (where ? `<div><b>${escapeAttr(where)}</b></div>` : '')
            + `<div>${escapeAttr(String(clash.reason || 'столкновение'))}</div></div>`;
        }
        return '<div class="conflict-row">'
          + `<div><b>${escapeAttr(where)}</b></div>`
          + `<div>вы видели: ${escapeAttr(conflictValue(clash.base))}</div>`
          + `<div>вы хотели: ${escapeAttr(conflictValue(clash.yours))}</div>`
          + `<div>сейчас там: ${escapeAttr(conflictValue(clash.current))}</div>`
          + '</div>';
      }).join('');
    }

async function rebuildOverCurrent(given = null) {
      const c = (given && given.описание) ? given : lastConflict;
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
      markSupersedes(c.commitId || null, c.описание.kind, address);
      if (c.описание.kind === 'concept') openEditConceptModal(address);
      else if (c.описание.kind === 'philosopher') openEditPhilosopherModal(address);
      // СВЯЗЬ ТОЖЕ: прежде пересборка связи закрывала окно, говорила «правьте
      // заново» — и правку не открывала.
      else if (c.описание.kind === 'relation') {
        const link = DATA.links.find(l => l.id === address);
        if (link) openEditConnectionModal(link);
      }
      reportSubmit('пересобрано', 'Взято нынешнее состояние — правьте заново');
    }

function closeConflictModal() {
      const modal = document.getElementById('conflictModal');
      if (modal) modal.style.display = 'none';
    }

let lastConflict = null;

export { closeConflictModal, conflictRowsHtml, conflictValue, lastConflict, rebuildOverCurrent, showConflict, warnRemoteEdit };
