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
import { SESSION_COOKIE } from '../http/cookies.js';

export const HEARTBEAT_MS = 30_000;

const parseCookie = строка => Object.fromEntries(
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
    this.сторож = setInterval(() => this.выместиМёртвых(), HEARTBEAT_MS);
  }

  /** Сколько сокетов у человека — нужно пробам и учёту. */
  сколькоУ(userId) { return this.поЛюдям.get(userId)?.size ?? 0; }
  всего() { let n = 0; for (const since of this.поЛюдям.values()) n += since.size; return n; }

  /**
   * Рукопожатие. Аутентификация ЗДЕСЬ, а не сообщением после: соединение не
   * может жить неизвестным ни секунды.
   */
  async handleUpgrade(request, socket, head) {
    const refuse = recoveryCode => {
      socket.write(`HTTP/1.1 ${recoveryCode} \r\n\r\n`);
      socket.destroy();
    };
    try {
      if (this.origins && !this.origins.includes(request.headers.origin)) {
        return refuse(403);
      }
      const token = parseCookie(request.headers.cookie)[SESSION_COOKIE];
      const session = await sessionByToken(this.db, token);
      // Частичная сессия (пароль прошёл, второй шаг нет) сокета не получает:
      // она не даёт ничего, кроме права предъявить код.
      if (!session || session.mfaPending || !isUsable(session.user)) return refuse(401);

      this.wss.handleUpgrade(request, socket, head,
        ws => this.принять(ws, session.user, session.sessionId));
    } catch { refuse(500); }
  }

  принять(ws, user, sessionId) {
    ws.userId = user.userId;
    ws.sessionId = sessionId;
    ws.живой = true;

    if (!this.поЛюдям.has(user.userId)) this.поЛюдям.set(user.userId, new Set());
    this.поЛюдям.get(user.userId).add(ws);   // второе устройство НЕ выбивает первое

    ws.on('pong', () => { ws.живой = true; });
    ws.on('message', сырое => {
      let message;
      // Кривое сообщение закрывает РАЗГОВОР, а не процесс.
      try { message = JSON.parse(сырое); } catch { return; }
      if (message?.type === 'ping') ws.send('{"type":"pong"}');
    });
    ws.on('close', () => this.убрать(ws));
    ws.on('error', () => this.убрать(ws));
    ws.send(JSON.stringify({ type: 'hello', userId: user.userId }));
  }

  убрать(ws) {
    const connections = this.поЛюдям.get(ws.userId);
    connections?.delete(ws);
    if (connections && connections.size === 0) this.поЛюдям.delete(ws.userId);
  }

  /** Разослать ВСЕМ устройствам человека. */
  кЧеловеку(userId, message) {
    let sent = 0;
    for (const ws of this.поЛюдям.get(userId) ?? []) {
      if (ws.readyState === ws.OPEN) { ws.send(JSON.stringify(message)); sent++; }
    }
    return sent;
  }

  кВсем(message) {
    let sent = 0;
    for (const userId of this.поЛюдям.keys()) sent += this.кЧеловеку(userId, message);
    return sent;
  }

  /** Отозвана сессия — рвём её сокеты. Право, которого нет, не должно доживать. */
  порватьСессию(sessionId) {
    let dropped = 0;
    for (const connections of this.поЛюдям.values()) {
      for (const ws of [...connections]) {
        if (ws.sessionId === sessionId) { ws.close(4001, 'сессия отозвана'); dropped++; }
      }
    }
    return dropped;
  }

  порватьЧеловека(userId) {
    let dropped = 0;
    for (const ws of [...(this.поЛюдям.get(userId) ?? [])]) {
      ws.close(4001, 'доступ отозван'); dropped++;
    }
    return dropped;
  }

  /** Мёртвые соединения выметаются: без этого Map растёт молча. */
  выместиМёртвых() {
    for (const connections of this.поЛюдям.values()) {
      for (const ws of [...connections]) {
        if (!ws.живой) { ws.terminate(); this.убрать(ws); continue; }
        ws.живой = false;
        try { ws.ping(); } catch { this.убрать(ws); }
      }
    }
  }

  close() {
    clearInterval(this.сторож);
    for (const connections of this.поЛюдям.values()) for (const ws of [...connections]) ws.terminate();
    this.поЛюдям.clear();
    this.wss.close();
  }
}
