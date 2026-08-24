// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api, serverMode } from '../core/api.js';
import { emit } from '../core/events.js';
import { PERM, can } from '../core/perms.js';
import { applyFreshGraph } from './remote.js';

let lastSubmitted = null;

function submitChange(описание, применить) {
      lastSubmitted = описание;

      // МЕСТНОЕ ВОПЛОЩЕНИЕ — как было: применить немедленно.
      if (!serverMode) { применить(); return true; }

      // СЕРВЕРНОЕ. У кого есть право прямой правки — тот правит и на месте
      // (сервер сделает то же у себя); у остальных правка НЕ ТРОГАЕТ базу
      // вовсе: она уходит коммитом и ждёт рассмотрения. Показать правку,
      // которой ещё нет, было бы обманом: человек уйдёт с экрана в
      // уверенности, что дело сделано.
      const прямо = can(PERM.REVIEW_COMMIT);
      if (прямо) применить();

      sendCommit(описание, прямо);
      return прямо;
    }

async function sendCommit(описание, прямо) {
      const ответ = await api('/api/commits', {
        метод: 'POST',
        тело: { message: commitMessageFor(описание), changes: [описание] },
      });

      if (!ответ.годно) {
        const текст = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
          || 'Не удалось отправить правку';
        reportSubmit('отказ', текст);
        return;
      }
      const д = ответ.тело.data || {};

      // СТОЛКНОВЕНИЕ. Прямая правка тоже сталкивается — и это правильно:
      // если после того, как правщик открыл форму, кто-то тронул то же
      // поле, молча перезаписать чужое хуже, чем спросить.
      if (д.исход === 'conflicted') {
        // Прямая правка успела лечь в базу СТРАНИЦЫ (мы применили её на
        // месте, не дожидаясь ответа). Сервер её отверг — значит на
        // странице она держаться не должна: иначе человек видит своё, а в
        // общем графе стоит чужое, и разойдутся они молча. Берём у сервера
        // нынешнее состояние ДО показа окна.
        if (прямо) {
          const свежий = await api('/api/graph');
          if (свежий.годно && свежий.тело && свежий.тело.data) {
            applyFreshGraph(свежий.тело.data);
          }
        }
        // Через ШИНУ, а не вызовом: распорядитель (этаж 1) не должен знать
        // об окне (этаж 5). Первый набросок звал окно прямо, и в дереве
        // появился ПЕРВЫЙ круг за всё время — data/backend.js и
        // modal/conflict.js ввозили друг друга. Событие развязывает их:
        // распорядитель говорит, ЧТО случилось, а кто это показывает —
        // не его забота.
        emit('commit-conflicted', { описание, столкновения: д.столкновения || [] });
        return;
      }

      if (д.прямая || прямо) { reportSubmit('применено', 'Правка внесена'); return; }

      let текст = 'Правка отправлена на рассмотрение';
      if (д.пересечения && д.пересечения.length) {
        // Предупреждение, а не отказ: половина столкновений снимается тем,
        // что правщик узнаёт о чужой правке ВОВРЕМЯ.
        const п = д.пересечения[0];
        текст += `. Учтите: ${п.authorName} уже правит `
               + (п.поля && п.поля.length ? `поле «${п.поля[0]}»` : 'ту же запись');
      }
      reportSubmit('в очереди', текст);
    }

function commitMessageFor(описание) {
      const действие = { add: 'Добавлено', edit: 'Изменено', delete: 'Удалено' };
      const род = { concept: 'концепция', relation: 'связь', philosopher: 'философ',
                    tradition: 'традиция', rubric: 'рубрика', relationType: 'тип связи' };
      const поля = Object.keys(описание.fields || {});
      return `${действие[описание.action] || 'Правка'}: ${род[описание.kind] || описание.kind}`
           + ` ${описание.entityId}`
           + (поля.length ? ` (${поля.join(', ')})` : '');
    }

function reportSubmit(род, текст) {
      lastSubmitResult = { род, текст, когда: Date.now() };
      const место = document.getElementById('submitNotice');
      if (!место) { if (род === 'отказ') alert(текст); return; }

      место.textContent = текст;
      место.className = 'submit-notice kind-' + род;
      место.style.display = 'block';

      // Гаснет само: извещение о судьбе правки — весть, а не окно, и
      // закрывать его руками человек не обязан. Отказ висит дольше:
      // его надо прочесть.
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => { место.style.display = 'none'; },
                               род === 'отказ' ? 12000 : 6000);
    }

let noticeTimer = null;

let lastSubmitResult = null;

export { lastSubmitResult, lastSubmitted, reportSubmit, submitChange };
