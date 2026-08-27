// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { serverMode } from '../core/api.js';
import { escapeAttr } from '../util/html.js';

const PROVENANCE_STATES = [
      ['unspecified',         'не указан',            'источник ещё не искали'],
      ['sourced',             'источник',             'библиографическая ссылка'],
      ['editorial_reasoning', 'основание редактора',  'собственное построение, а не ссылка'],
      ['source_not_found',    'искали, не нашли',     'о ходе работы, а не о предмете'],
    ];

function provenanceField(data) {
      const prevSide = data && data.provenance ? String(data.provenance) : '';
      // Старое соглашение читается на входе: записи, не прошедшие перевод,
      // должны открываться правильно, а не терять смысл.
      const own = prevSide.startsWith('//');
      const text = own ? prevSide.slice(2).trim() : prevSide;
      const state2 = (data && data.provenanceStatus)
        || (own ? 'editorial_reasoning' : (text ? 'sourced' : 'unspecified'));
      const stateSelect = PROVENANCE_STATES.map(([код, имя, пояснение]) =>
        `<option value="${код}"${код === state2 ? ' selected' : ''}>`
        + `${имя} — ${пояснение}</option>`).join('');
      return `
        <div class="modal-form-group">
          <label for="entityProvenanceStatus">Происхождение</label>
          <select id="entityProvenanceStatus"
                  data-act-change="refresh-provenance-field-change">${stateSelect}</select>
          <input type="text" id="entityProvenance" maxlength="300"
                 placeholder="Например: Гераклит, фр. B1 (Дильс–Кранц)"
                 value="${escapeAttr(text)}">
          <div class="modal-form-note" id="entityProvenanceNote"></div>
        </div>`;
    }

function refreshProvenanceField() {
      const stateSelect = document.getElementById('entityProvenanceStatus');
      const field = document.getElementById('entityProvenance');
      const noteSlot = document.getElementById('entityProvenanceNote');
      if (!stateSelect || !field) return;
      const state2 = stateSelect.value;
      const needsCitation2 = state2 === 'sourced' || state2 === 'editorial_reasoning';
      field.style.display = needsCitation2 ? '' : 'none';
      if (!needsCitation2) field.value = '';
      if (noteSlot) {
        noteSlot.textContent =
          state2 === 'sourced' ? 'Укажите локус: книга, глава, фрагмент.'
        : state2 === 'editorial_reasoning' ? 'Своими словами: на чём держится утверждение.'
        : state2 === 'source_not_found' ? 'Это пометка о ходе работы, а не о предмете: источник может найтись позже.'
        : 'Источник ещё не искали — так и останется, пока не укажете.';
      }
    }

function provenanceValue() {
      const field = document.getElementById('entityProvenance');
      const stateSelect = document.getElementById('entityProvenanceStatus');
      const line = field ? field.value.trim() : '';
      const state2 = stateSelect ? stateSelect.value : 'unspecified';
      // Согласие сторожит и сервер (`assertProvenance`), но чинить его надо
      // ЗДЕСЬ: человеку незачем получать отказ за то, что окно позволило.
      if (state2 === 'sourced' && !line) {
        return { строка: '', состояние: 'unspecified' };
      }
      return { строка: needsCitation(state2) ? line : '', состояние: state2 };
    }

function needsCitation(состояние) {
      return состояние === 'sourced' || состояние === 'editorial_reasoning';
    }

function commitReasonField() {
      if (!serverMode) return '';
      return `
        <div class="modal-form-group commit-reason">
          <label for="commitReason">Зачем эта правка <span class="необязательно">(необязательно, но рецензенту помогает)</span></label>
          <input type="text" id="commitReason" maxlength="160"
                 placeholder="Например: уточнил формулировку по Диогену Лаэртскому">
        </div>`;
    }

export { PROVENANCE_STATES, commitReasonField, provenanceField, provenanceValue, refreshProvenanceField };
