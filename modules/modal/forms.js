// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { serverMode } from '../core/api.js';
import { escapeAttr } from '../util/html.js';

function provenanceField(data) {
      const prev = data && data.provenance ? data.provenance : '';
      return `
        <div class="modal-form-group">
          <label for="entityProvenance">Источник <span class="необязательно">(необязательно)</span></label>
          <input type="text" id="entityProvenance" maxlength="300"
                 placeholder="Например: Гераклит, фр. B1 (Дильс–Кранц); или // своё рассуждение"
                 value="${escapeAttr(prev)}">
          <div class="modal-form-note">
            Две косые в начале означают рассуждение составителя, а не ссылку.
          </div>
        </div>`;
    }

function provenanceValue() {
      const field = document.getElementById('entityProvenance');
      return field ? field.value.trim() : '';
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

export { commitReasonField, provenanceField, provenanceValue };
