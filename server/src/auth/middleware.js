// ПРИВРАТНИК. Кладёт в запрос доменного пользователя — или null.
//
// Отсутствие входа — это req.user = null, а НЕ ошибка: гость вправе смотреть
// граф. Отказ выдаёт застава там, где право требуется.

import { sessionByToken, touchSession } from '../db/sessions.js';
import { isUsable } from '../access/access.js';
import { SESSION_COOKIE } from '../http/cookies.js';

export async function attachUser(req, _res, next) {
  try {
    const session = await sessionByToken(req.db, req.cookies?.[SESSION_COOKIE] ?? null);
    if (!session) { req.user = null; return next(); }

    // Частичная сессия (прошла пароль, не прошла второй шаг) не даёт НИЧЕГО,
    // кроме права предъявить код. Иначе промежуток между шагами оказывается
    // полноценной сессией, и второй шаг становится украшением. Ход для самого
    // предъявления кода появится в беседе 1.4.
    if (session.mfaPending) {
      req.user = null;
      req.mfaPending = session.sessionId;
      return next();
    }

    if (!isUsable(session.user)) { req.user = null; return next(); }

    req.user = session.user;
    req.sessionId = session.sessionId;
    touchSession(req.db, session.sessionId);   // без await
    next();
  } catch (e) { next(e); }
}
