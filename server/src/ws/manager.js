// СОЕДИНЕНИЯ.
//
// Три дефекта первой редакции жили здесь:
//   connections был Map userId → ws, ОДИН сокет на человека — второе
//     устройство молча выбивало первое, и уведомления у первого пропадали;
//   аутентификация шла ОТДЕЛЬНЫМ СООБЩЕНИЕМ после соединения, без срока —
//     соединение могло висеть неизвестным сколько угодно;
//   JSON.parse стоял без защиты — кривое сообщение роняло процесс целиком.

import { WebSocketServer } from 'ws';
import { sessionByToken } from '../db/sessions.js';
import { isUsable } from '../access/access.js';
import { ИМЯ_СЕАНСА } from '../http/cookies.js';

export const ПРОВЕРКА_ЖИЗНИ_МС = 30_000;

const разобратьCookie = строка => Object.fromEntries(
  String(строка ?? '').split(';').map(к => {
    const i = к.indexOf('=');
    return i === -1 ? [к.trim(), ''] : [к.slice(0, i).trim(), decodeURIComponent(к.slice(i + 1))];
  }).filter(([и]) => и));

export class Соединения {
  constructor({ db, origins = null } = {}) {
    this.db = db;
    this.origins = origins;              // null — не проверять (для проб)
    this.поЛюдям = new Map();            // userId → Set<ws>, а НЕ один ws
    this.wss = new WebSocketServer({ noServer: true });
    this.сторож = setInterval(() => this.выместиМёртвых(), ПРОВЕРКА_ЖИЗНИ_МС);
  }

  /** Сколько сокетов у человека — нужно пробам и учёту. */
  сколькоУ(userId) { return this.поЛюдям.get(userId)?.size ?? 0; }
  всего() { let n = 0; for (const с of this.поЛюдям.values()) n += с.size; return n; }

  /**
   * Рукопожатие. Аутентификация ЗДЕСЬ, а не сообщением после: соединение не
   * может жить неизвестным ни секунды.
   */
  async handleUpgrade(request, socket, head) {
    const отказать = код => {
      socket.write(`HTTP/1.1 ${код} \r\n\r\n`);
      socket.destroy();
    };
    try {
      if (this.origins && !this.origins.includes(request.headers.origin)) {
        return отказать(403);
      }
      const токен = разобратьCookie(request.headers.cookie)[ИМЯ_СЕАНСА];
      const сеанс = await sessionByToken(this.db, токен);
      // Частичная сессия (пароль прошёл, второй шаг нет) сокета не получает:
      // она не даёт ничего, кроме права предъявить код.
      if (!сеанс || сеанс.mfaPending || !isUsable(сеанс.user)) return отказать(401);

      this.wss.handleUpgrade(request, socket, head,
        ws => this.принять(ws, сеанс.user, сеанс.sessionId));
    } catch { отказать(500); }
  }

  принять(ws, user, sessionId) {
    ws.userId = user.userId;
    ws.sessionId = sessionId;
    ws.живой = true;

    if (!this.поЛюдям.has(user.userId)) this.поЛюдям.set(user.userId, new Set());
    this.поЛюдям.get(user.userId).add(ws);   // второе устройство НЕ выбивает первое

    ws.on('pong', () => { ws.живой = true; });
    ws.on('message', сырое => {
      let сообщение;
      // Кривое сообщение закрывает РАЗГОВОР, а не процесс.
      try { сообщение = JSON.parse(сырое); } catch { return; }
      if (сообщение?.type === 'ping') ws.send('{"type":"pong"}');
    });
    ws.on('close', () => this.убрать(ws));
    ws.on('error', () => this.убрать(ws));
    ws.send(JSON.stringify({ type: 'hello', userId: user.userId }));
  }

  убрать(ws) {
    const набор = this.поЛюдям.get(ws.userId);
    набор?.delete(ws);
    if (набор && набор.size === 0) this.поЛюдям.delete(ws.userId);
  }

  /** Разослать ВСЕМ устройствам человека. */
  кЧеловеку(userId, сообщение) {
    let ушло = 0;
    for (const ws of this.поЛюдям.get(userId) ?? []) {
      if (ws.readyState === ws.OPEN) { ws.send(JSON.stringify(сообщение)); ушло++; }
    }
    return ушло;
  }

  кВсем(сообщение) {
    let ушло = 0;
    for (const userId of this.поЛюдям.keys()) ушло += this.кЧеловеку(userId, сообщение);
    return ушло;
  }

  /** Отозвана сессия — рвём её сокеты. Право, которого нет, не должно доживать. */
  порватьСессию(sessionId) {
    let порвано = 0;
    for (const набор of this.поЛюдям.values()) {
      for (const ws of [...набор]) {
        if (ws.sessionId === sessionId) { ws.close(4001, 'сессия отозвана'); порвано++; }
      }
    }
    return порвано;
  }

  порватьЧеловека(userId) {
    let порвано = 0;
    for (const ws of [...(this.поЛюдям.get(userId) ?? [])]) {
      ws.close(4001, 'доступ отозван'); порвано++;
    }
    return порвано;
  }

  /** Мёртвые соединения выметаются: без этого Map растёт молча. */
  выместиМёртвых() {
    for (const набор of this.поЛюдям.values()) {
      for (const ws of [...набор]) {
        if (!ws.живой) { ws.terminate(); this.убрать(ws); continue; }
        ws.живой = false;
        try { ws.ping(); } catch { this.убрать(ws); }
      }
    }
  }

  close() {
    clearInterval(this.сторож);
    for (const набор of this.поЛюдям.values()) for (const ws of [...набор]) ws.terminate();
    this.поЛюдям.clear();
    this.wss.close();
  }
}
