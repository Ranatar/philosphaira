// ПРИВРАТНИК. Кладёт в запрос доменного пользователя — или null.
//
// Отсутствие входа — это req.user = null, а НЕ ошибка: гость вправе смотреть
// граф. Отказ выдаёт застава там, где право требуется.

import { sessionByToken, touchSession } from '../db/sessions.js';
import { isUsable } from '../access/access.js';
import { ИМЯ_СЕАНСА } from '../http/cookies.js';

export async function attachUser(req, _res, next) {
  try {
    const сеанс = await sessionByToken(req.db, req.cookies?.[ИМЯ_СЕАНСА] ?? null);
    if (!сеанс) { req.user = null; return next(); }

    // Частичная сессия (прошла пароль, не прошла второй шаг) не даёт НИЧЕГО,
    // кроме права предъявить код. Иначе промежуток между шагами оказывается
    // полноценной сессией, и второй шаг становится украшением. Ход для самого
    // предъявления кода появится в беседе 1.4.
    if (сеанс.mfaPending) {
      req.user = null;
      req.mfaPending = сеанс.sessionId;
      return next();
    }

    if (!isUsable(сеанс.user)) { req.user = null; return next(); }

    req.user = сеанс.user;
    req.sessionId = сеанс.sessionId;
    touchSession(req.db, сеанс.sessionId);   // без await
    next();
  } catch (e) { next(e); }
}
