// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

function liveProgressHtml(pct) {
      return `<span class="progress-live" data-live-progress>${pct} %</span>`;
    }

function updateLiveProgress(root, pct) {
      if (!root) return;
      root.querySelectorAll('[data-live-progress]').forEach(e => { e.textContent = pct + ' %'; });
    }

function scrollToPickedRow(box) {
      if (!box) return;
      const row = box.querySelector('.concept-row-picked');
      if (!row) { box.scrollTop = 0; return; }
      box.scrollTop = Math.max(0, row.offsetTop - (box.clientHeight - row.offsetHeight) / 2);
    }

function provenanceBlock(value, status) {
      const text = String(value == null ? '' : value).trim();
      // Старое соглашение читается на входе: записи, не прошедшие перевод
      // миграцией, не должны терять смысл.
      const own = text.startsWith('//');
      const state2 = status || (own ? 'editorial_reasoning'
                                       : (text ? 'sourced' : 'unspecified'));
      // «НЕ УКАЗАН» МОЛЧИТ. Показывать его под каждой из 453 концепций
      // значило бы приучить не читать этот раздел вовсе; он должен говорить
      // тогда, когда есть что сказать.
      if (state2 === 'unspecified') return '';
      const label = state2 === 'sourced' ? 'Источник'
                    : state2 === 'editorial_reasoning' ? 'Основание'
                    : 'Источник не найден';
      // У «искали, не нашли» ссылки нет и быть не может: это состояние
      // говорит о ходе работы, а не о предмете.
      const body = state2 === 'source_not_found'
        ? 'искали, пока не нашли'
        : escapeAttr(own ? text.slice(2).trim() : text);
      if (!body) return '';
      return '<div class="provenance">'
        + '<span class="provenance-label">' + label + '</span>'
        + '<span class="provenance-text">' + body + '</span></div>';
    }

const FOOTNOTE_MARK_SOURCE = String.raw`\[\^([a-z0-9]{1,12})\]`;

const FOOTNOTE_LABELS = { sourced: 'Источник', editorial_reasoning: 'Основание',
                              source_not_found: 'Источник не найден' };

const FOOTNOTE_STATE_ORDER = ['sourced', 'editorial_reasoning', 'source_not_found'];

function withoutFootnotes(text) {
      if (text == null) return text;
      return String(text).replace(new RegExp('\\s?' + FOOTNOTE_MARK_SOURCE, 'g'), '');
    }

const RICH_TAG = /&lt;(\/?)([bi])&gt;/g;

function richText(text) {
      if (text == null) return '';
      const open = [];
      const out = escapeAttr(text).replace(RICH_TAG, (whole, close, tag) => {
        if (!close) { open.push(tag); return '<' + tag + '>'; }
        const at = open.lastIndexOf(tag);
        if (at < 0) return '';
        // закрыть и то, что было открыто внутри, — вложенность держится
        const inner = open.splice(at);
        return inner.reverse().map(t => '</' + t + '>').join('');
      });
      return out + open.reverse().map(t => '</' + t + '>').join('');
    }

function descriptionHtml(text) { return richText(withoutFootnotes(text)); }

function descriptionPlain(text) {
      if (text == null) return '';
      return String(withoutFootnotes(text)).replace(/<\/?[bi]>/g, '');
    }

function footnoteOrder(...texts) {
      const order = new Map();
      for (const text of texts) {
        if (typeof text !== 'string') continue;
        for (const m of text.matchAll(new RegExp(FOOTNOTE_MARK_SOURCE, 'g')))
          if (!order.has(m[1])) order.set(m[1], order.size + 1);
      }
      return order;
    }

function footnotedText(text, order, notes) {
      if (text == null) return text;
      const status = new Map((notes || []).map(n => [n.id, n.status]));
      return richText(text).replace(new RegExp(FOOTNOTE_MARK_SOURCE, 'g'), (whole, id) => {
        const n = order.get(id);
        const cls = status.has(id) ? ' fn-' + escapeAttr(status.get(id)) : '';
        return `<sup class="fn-ref${cls}" data-fn="${id}" tabindex="0" role="button"`
          + ` aria-label="сноска ${n || '?'}">${n || '?'}</sup>`;
      });
    }

function footnotesBlock(notes, order) {
      if (!notes || !notes.length) return '';
      const items = notes.slice()
        .sort((a, b) => (order.get(a.id) || 1e9) - (order.get(b.id) || 1e9))
        .map(n => `<li class="fn-item fn-${escapeAttr(n.status)}" data-fn="${escapeAttr(n.id)}" tabindex="0">`
          + `<span class="fn-num">${order.get(n.id) || '—'}</span>`
          + `<span class="fn-state">${FOOTNOTE_LABELS[n.status] || escapeAttr(n.status)}</span>`
          + `<span class="fn-text">${n.status === 'source_not_found' ? 'искали, пока не нашли' : escapeAttr(n.text || '')}</span></li>`)
        .join('');
      return `<div class="fn-list"><div class="fn-list-title">Источники к тексту</div><ol>${items}</ol></div>`;
    }

function escapeAttr(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

export { FOOTNOTE_LABELS, FOOTNOTE_MARK_SOURCE, FOOTNOTE_STATE_ORDER, descriptionHtml, descriptionPlain, escapeAttr, footnoteOrder, footnotedText, footnotesBlock, liveProgressHtml, provenanceBlock, richText, scrollToPickedRow, updateLiveProgress, withoutFootnotes };
