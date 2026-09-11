// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

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

function escapeAttr(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

export { escapeAttr, provenanceBlock, scrollToPickedRow };
