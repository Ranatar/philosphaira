// Ошибки, у которых есть внешняя сторона и внутренняя.
//
// Наружу уходит только то, что предназначено наружу: сообщения внутренних
// ошибок остаются в журнале. Иначе первая же необработанная ошибка расскажет
// читателю имя таблицы и текст запроса.

export class Forbidden extends Error {
  constructor(message, details = {}) { super(message); this.status = 403; this.code = 'forbidden'; this.details = details; }
}
export class Conflict extends Error {
  constructor(message, details = {}) { super(message); this.status = 409; this.code = 'conflict'; this.details = details; }
}
export class Unauthorized extends Error {
  constructor(message = 'Требуется вход') { super(message); this.status = 401; this.code = 'unauthorized'; }
}
export class NotFound extends Error {
  constructor(message = 'Не найдено') { super(message); this.status = 404; this.code = 'not_found'; }
}

export function errorHandler(err, req, res, _next) {
  const status = err.status ?? 500;
  if (status >= 500) (req.log?.error ?? console.error)({ err }, 'необработанная ошибка');
  res.status(status).json({
    error: {
      code: err.code ?? (status === 500 ? 'internal' : 'error'),
      message: status >= 500 ? 'Внутренняя ошибка' : err.message,
      details: err.details ?? undefined,
    },
  });
}
