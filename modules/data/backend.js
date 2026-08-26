// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api, serverMode } from '../core/api.js';
import { emit } from '../core/events.js';
import { PERM, can } from '../core/perms.js';
import { applyFreshGraph } from './remote.js';

let lastSubmitted = null;

function submitChange(descr, применить) {
      lastSubmitted = descr;

      // МЕСТНОЕ ВОПЛОЩЕНИЕ — как было: применить немедленно.
      if (!serverMode) { применить(); return true; }

      // СЕРВЕРНОЕ. У кого есть право прямой правки — тот правит и на месте
      // (сервер сделает то же у себя); у остальных правка НЕ ТРОГАЕТ базу
      // вовсе: она уходит коммитом и ждёт рассмотрения. Показать правку,
      // которой ещё нет, было бы обманом: человек уйдёт с экрана в
      // уверенности, что дело сделано.
      const direct = can(PERM.REVIEW_COMMIT);
      if (direct) применить();

      sendCommit(descr, direct);
      return direct;
    }

async function sendCommit(descr, direct) {
      // Причина уходит ОТДЕЛЬНЫМ полем, а не вместо заголовка: заголовок —
      // адрес правки, по нему её ищут и разбирают столкновения, и терять
      // его ради вольного слова нельзя.
      const field = document.getElementById('commitReason');
      const why = field && field.value ? field.value.trim() : '';

      const reply = await api('/api/commits', {
        метод: 'POST',
        тело: { message: commitMessageFor(descr), authorComment: why || null,
                changes: [descr] },
      });

      if (!reply.годно) {
        const serverMessage = (reply.тело && reply.тело.error && reply.тело.error.message)
          || 'Не удалось отправить правку';
        reportSubmit('отказ', serverMessage);
        return;
      }
      const commitData = reply.тело.data || {};

      // СТОЛКНОВЕНИЕ. Прямая правка тоже сталкивается — и это правильно:
      // если после того, как правщик открыл форму, кто-то тронул то же
      // поле, молча перезаписать чужое хуже, чем спросить.
      if (commitData.исход === 'conflicted') {
        // Прямая правка успела лечь в базу СТРАНИЦЫ (мы применили её на
        // месте, не дожидаясь ответа). Сервер её отверг — значит на
        // странице она держаться не должна: иначе человек видит своё, а в
        // общем графе стоит чужое, и разойдутся они молча. Берём у сервера
        // нынешнее состояние ДО показа окна.
        if (direct) {
          const fresh = await api('/api/graph');
          if (fresh.годно && fresh.тело && fresh.тело.data) {
            applyFreshGraph(fresh.тело.data);
          }
        }
        // Через ШИНУ, а не вызовом: распорядитель (этаж 1) не должен знать
        // об окне (этаж 5). Первый набросок звал окно прямо, и в дереве
        // появился ПЕРВЫЙ круг за всё время — data/backend.js и
        // modal/conflict.js ввозили друг друга. Событие развязывает их:
        // распорядитель говорит, ЧТО случилось, а кто это показывает —
        // не его забота.
        emit('commit-conflicted', { descr, столкновения: commitData.столкновения || [] });
        return;
      }

      if (commitData.прямая || direct) { reportSubmit('применено', 'Правка внесена'); return; }

      let text = 'Правка отправлена на рассмотрение';
      if (commitData.пересечения && commitData.пересечения.length) {
        // Предупреждение, а не отказ: половина столкновений снимается тем,
        // что правщик узнаёт о чужой правке ВОВРЕМЯ.
        const firstOverlap = commitData.пересечения[0];
        text += `. Учтите: ${firstOverlap.authorName} уже правит `
               + (firstOverlap.поля && firstOverlap.поля.length ? `поле «${firstOverlap.поля[0]}»` : 'ту же запись');
      }
      reportSubmit('в очереди', text);
    }

function commitMessageFor(descr) {
      const action = { add: 'Добавлено', edit: 'Изменено', delete: 'Удалено' };
      const kind = { concept: 'концепция', relation: 'связь', philosopher: 'философ',
                    tradition: 'традиция', rubric: 'рубрика', relationType: 'тип связи' };
      const fields = Object.keys(descr.fields || {});
      return `${action[descr.action] || 'Правка'}: ${kind[descr.kind] || descr.kind}`
           + ` ${descr.entityId}`
           + (fields.length ? ` (${fields.join(', ')})` : '');
    }

function reportSubmit(kind, text) {
      // ПОЛЕ ОСТАЁТСЯ «род». Переименование довода свернуло запись в
      // `{ kind, … }`, и проба, читающая `.род`, стала получать undefined —
      // а извещение при этом работало, так что глазами беду не увидеть.
      lastSubmitResult = { род: kind, text, когда: Date.now() };
      const slot = document.getElementById('submitNotice');
      if (!slot) { if (kind === 'отказ') alert(text); return; }

      slot.textContent = text;
      slot.className = 'submit-notice kind-' + kind;
      slot.style.display = 'block';

      // Гаснет само: извещение о судьбе правки — весть, а не окно, и
      // закрывать его руками человек не обязан. Отказ висит дольше:
      // его надо прочесть.
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => { slot.style.display = 'none'; },
                               kind === 'отказ' ? 12000 : 6000);
    }

let noticeTimer = null;

let lastSubmitResult = null;

export { lastSubmitResult, lastSubmitted, reportSubmit, submitChange };
