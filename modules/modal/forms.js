// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { serverMode } from '../core/api.js';

function commitReasonField() {
      if (!serverMode) return '';
      return `
        <div class="modal-form-group commit-reason">
          <label for="commitReason">Зачем эта правка <span class="необязательно">(необязательно, но рецензенту помогает)</span></label>
          <input type="text" id="commitReason" maxlength="160"
                 placeholder="Например: уточнил формулировку по Диогену Лаэртскому">
        </div>`;
    }

export { commitReasonField };
