// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { serverMode } from '../core/api.js';

import { FOOTNOTE_LABELS, FOOTNOTE_STATE_ORDER, escapeAttr, footnoteOrder } from '../util/html.js';

function installFootnoteLinks() {
      const light = id => document.querySelectorAll('[data-fn]').forEach(x =>
        x.classList.toggle('fn-active', x.dataset.fn === id));
      const at = ev => ev.target && ev.target.closest ? ev.target.closest('[data-fn]') : null;
      document.addEventListener('mouseover', ev => { const el = at(ev); if (el) light(el.dataset.fn); });
      document.addEventListener('mouseout',  ev => { if (at(ev)) light(null); });
      document.addEventListener('focusin',   ev => {
        const el = at(ev); if (el) light(el.dataset.fn);
        if (ev.target && ev.target.classList && ev.target.classList.contains('fn-host')) S.lastFootnoteHost = ev.target;
      });
      document.addEventListener('focusout',  ev => { if (at(ev)) light(null); });
      document.addEventListener('click',     ev => { const el = at(ev); if (el) light(el.dataset.fn); });
      document.addEventListener('input',     ev => {
        if (ev.target && ev.target.classList && ev.target.classList.contains('fn-host')) refreshFootnoteRows();
      });
    }

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
      const stateSelect = PROVENANCE_STATES.map(([stateCode, stateLabel, hint]) =>
        `<option value="${stateCode}"${stateCode === state2 ? ' selected' : ''}>`
        + `${stateLabel} — ${hint}</option>`).join('');
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

function footnoteRow(note, n) {
      const opts = FOOTNOTE_STATE_ORDER.map(st =>
        `<option value="${st}"${st === note.status ? ' selected' : ''}>${FOOTNOTE_LABELS[st]}</option>`).join('');
      const hidden = note.status === 'source_not_found' ? ' style="display:none"' : '';
      const hint = note.status === 'editorial_reasoning' ? 'Своими словами: на чём держится утверждение'
                                                          : 'Локус: книга, глава, фрагмент';
      return `<div class="fn-row" data-fn-row="${note.id}">`
        + `<span class="fn-num" data-fn-num>${n || ''}</span>`
        + `<select class="fn-status" data-act-change="refresh-footnote-rows-change">${opts}</select>`
        + `<input type="text" class="fn-text" maxlength="300" value="${escapeAttr(note.text || '')}"`
        + ` placeholder="${hint}"${hidden}>`
        + `<button type="button" class="fn-remove" title="Удалить сноску вместе с меткой"`
        + ` data-act-click="remove-footnote" data-a1="${note.id}">×</button>`
        + `<span class="fn-row-warn" data-fn-warn></span></div>`;
    }

function footnotesField(record) {
      const notes = (record && record.footnotes) || [];
      // тот же порядок полей, что у окна просмотра и у footnoteHosts
      const order = footnoteOrder(record && record.extendedDescription, record && record.description);
      return `
        <div class="modal-form-group fn-editor">
          <label>Сноски к описанию <span class="необязательно">(необязательно)</span></label>
          <div class="modal-form-note">Поставьте курсор в описание и нажмите «Вставить сноску»:
            в текст встанет метка вида [^…], а ниже — строка её источника. Источник всей
            записи (поле выше) от сносок не зависит.</div>
          <div id="fnRows">${notes.map(n => footnoteRow(n, order.get(n.id))).join('')}</div>
          <div class="modal-form-note" id="fnSummary"></div>
          <button type="button" class="btn btn-secondary" data-act-click="insert-footnote">Вставить сноску</button>
        </div>`;
    }

function footnoteHosts() {
      const hosts = Array.from(document.querySelectorAll('textarea.fn-host'));
      return hosts.filter(h => h.hasAttribute('data-fn-first')).concat(hosts.filter(h => !h.hasAttribute('data-fn-first')));
    }

function insertFootnote() {
      const hosts = footnoteHosts();
      if (!hosts.length) return;
      const host = hosts.includes(S.lastFootnoteHost) ? S.lastFootnoteHost : hosts[hosts.length - 1];
      const taken = new Set([...footnoteOrder(...hosts.map(h => h.value)).keys(),
        ...Array.from(document.querySelectorAll('[data-fn-row]')).map(r => r.dataset.fnRow)]);
      // Наименьший свободный f1, f2, … в пределах сущности. Не случайный:
      // случайность ничего не давала (одновременная правка сносок одной
      // сущности всё равно сталкивается целым полем), а делала неповторимым
      // полный обход — нажатие «Вставить сноску» давало всякий раз иное окно.
      let k = 1;
      while (taken.has('f' + k)) k++;
      const id = 'f' + k;
      const at = host.selectionEnd != null ? host.selectionEnd : host.value.length;
      host.value = host.value.slice(0, at) + `[^${id}]` + host.value.slice(at);
      host.selectionStart = host.selectionEnd = at + id.length + 3;
      const rows = document.getElementById('fnRows');
      rows.insertAdjacentHTML('beforeend', footnoteRow({ id, status: 'sourced', text: '' }));
      refreshFootnoteRows();
      const input = rows.querySelector(`[data-fn-row="${id}"] .fn-text`);
      if (input) input.focus();
    }

function removeFootnote(id) {
      const row = document.querySelector(`[data-fn-row="${id}"]`);
      if (row) row.remove();
      const mark = new RegExp('\\s?\\[\\^' + id + '\\]', 'g');
      footnoteHosts().forEach(h => { h.value = h.value.replace(mark, ''); });
      refreshFootnoteRows();
    }

function refreshFootnoteRows() {
      const rows = Array.from(document.querySelectorAll('[data-fn-row]'));
      const order = footnoteOrder(...footnoteHosts().map(h => h.value));
      for (const row of rows) {
        const id = row.dataset.fnRow, n = order.get(id);
        row.querySelector('[data-fn-num]').textContent = n ? String(n) : '—';
        row.querySelector('[data-fn-warn]').textContent = n ? '' : 'метки в тексте нет';
        const st = row.querySelector('.fn-status').value, input = row.querySelector('.fn-text');
        input.style.display = st === 'source_not_found' ? 'none' : '';
        if (st === 'source_not_found') input.value = '';
        input.placeholder = st === 'editorial_reasoning' ? 'Своими словами: на чём держится утверждение'
                                                         : 'Локус: книга, глава, фрагмент';
      }
      const listed = new Set(rows.map(r => r.dataset.fnRow));
      const orphan = [...order.keys()].filter(id => !listed.has(id));
      const summary = document.getElementById('fnSummary');
      if (summary) summary.textContent = orphan.length
        ? `В тексте есть метки без строки источника: ${orphan.map(id => '[^' + id + ']').join(', ')}` : '';
    }

function footnotesValue() {
      const rows = Array.from(document.querySelectorAll('[data-fn-row]'));
      const order = footnoteOrder(...footnoteHosts().map(h => h.value));
      const list = [], problems = [];
      for (const row of rows) {
        const id = row.dataset.fnRow, status = row.querySelector('.fn-status').value;
        const text = row.querySelector('.fn-text').value.trim();
        const n = order.get(id);
        if (!n) problems.push(`сноска ${id}: метки в тексте нет — удалите строку или верните метку`);
        if (status !== 'source_not_found' && !text) problems.push(`сноска ${n || id}: у состояния «${FOOTNOTE_LABELS[status]}» нужен текст`);
        list.push(status === 'source_not_found' ? { id, status } : { id, status, text });
      }
      const listed = new Set(list.map(x => x.id));
      for (const id of order.keys()) if (!listed.has(id)) problems.push(`метка [^${id}] без строки источника`);
      list.sort((a, b) => (order.get(a.id) || 1e9) - (order.get(b.id) || 1e9));
      return { list, problems };
    }

function footnotesChanged(record) {
      if (!document.getElementById('fnRows')) return false;
      const key = arr => JSON.stringify((arr || []).map(n => [n.id, n.status, (n.text || '').trim()]).sort());
      return key(footnotesValue().list) !== key(record && record.footnotes);
    }

function needsCitation(state) {
      return state === 'sourced' || state === 'editorial_reasoning';
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

export { PROVENANCE_STATES, commitReasonField, footnotesChanged, footnotesField, footnotesValue, insertFootnote, installFootnoteLinks, provenanceField, provenanceValue, refreshFootnoteRows, refreshProvenanceField, removeFootnote };
