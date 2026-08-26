// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { setSessionUser } from './session.js';

let serverMode = false;

function readCookie(имя) {
      const pairs = String(document.cookie || '').split(';');
      for (const pair of pairs) {
        const i = pair.indexOf('=');
        if (i !== -1 && pair.slice(0, i).trim() === имя) {
          return decodeURIComponent(pair.slice(i + 1));
        }
      }
      return null;
    }

async function api(path, { метод = 'GET', тело: body } = {}) {
      // БЕЗ СЕРВЕРА НЕ ХОДИМ ВОВСЕ. Обход жмёт все обработчики подряд,
      // включая кнопки панелей, — и на статическом сервере каждый такой
      // зов давал 404, который браузер печатает в консоль. Прибор счёл это
      // ошибками страницы, и счёл правильно: без сервера страница обязана
      // вести себя ровно как прежде, а четыре строки в консоли — уже не
      // ровно. Тот же случай, что с /api/users/me при запуске (беседа 4.1):
      // там лечилось меткой, здесь — одной заставой в единственной двери.
      if (!serverMode) return { есть: false, код: 0, годно: false, тело: null };

      const headers = {};
      if (body) headers['Content-Type'] = 'application/json';
      if (метод !== 'GET') {
        const token = readCookie('csrf');
        if (token) headers['X-CSRF-Token'] = token;
      }
      try {
        const reply = await fetch(path, {
          method: метод, credentials: 'same-origin', headers: headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        const parsed = await reply.json().catch(() => null);
        return { есть: true, код: reply.status, годно: reply.ok, тело: parsed };
      } catch (e) {
        // Сети нет вовсе (file:// или сервер лежит) — это не ошибка, это
        // местный режим.
        return { есть: false, код: 0, годно: false, тело: null };
      }
    }

async function detectServerMode() {
      // СПРАШИВАЕМ, ТОЛЬКО ЕСЛИ ЕСТЬ КОГО. Первый набросок ходил на
      // /api/users/me всегда — и на статическом сервере получал 404,
      // который браузер печатает в консоль. Прибор счёл это ошибкой
      // страницы, и правильно счёл: без сервера страница обязана вести
      // себя РОВНО как прежде, а лишняя строка в консоли — уже не ровно.
      //
      // Признак сервера — метка в разметке, которую ставит он сам, отдавая
      // страницу. Догадка заменена объявлением: сервер называет себя, а не
      // страница его нащупывает.
      if (!document.querySelector('meta[name="philos-api"]')) return false;

      // Метка есть — сервер объявил себя сам, значит спрашивать можно.
      // Застава в api() смотрит на serverMode, а он ещё false: поднимаем
      // его здесь, до первого зова, и опускаем обратно, если ответа нет.
      serverMode = true;
      const reply = await api('/api/users/me');
      if (!reply.есть || !reply.годно || !reply.тело || !reply.тело.data) {
        serverMode = false;
        return false;
      }
      const me = reply.тело.data;
      // Права приходят СНАРУЖИ. Роль сервер тоже присылает, но заслоны
      // спрашивают право, а не роль, — и потому одна строка здесь заменяет
      // тринадцать заслонов по странице.
      if (!me.гость) {
        setSessionUser({ login: me.username, role: me.role }, me.permissions);
      }
      // И ВСЁ. Взять граф и открыть живое соединение — работа ЭТАЖА ВЫШЕ,
      // и зовёт её запуск, а не эта функция. Первый набросок делал всё
      // разом, и в дереве появился круг core/api.js ↔ data/remote.js:
      // нулевой этаж не может знать о первом. Ошибка была не в связи, а в
      // том, что́ вложено в функцию: она отвечает на ОДИН вопрос — есть ли
      // сервер и кто я.
      return true;
    }

export { api, detectServerMode, serverMode };
