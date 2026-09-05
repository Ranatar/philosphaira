// ОГРАНИЧЕНИЕ ЧАСТОТЫ ПО УЧЁТНОЙ ЗАПИСИ.
//
// Счёт по IP (он остаётся отдельно) не спасает от перебора с множества
// адресов и заодно бьёт по целым сетям за одним NAT. Поэтому второй счёт —
// по адресу учётной записи, с растущей задержкой.
//
// Хранилище здесь В ПАМЯТИ ПРОЦЕССА, и это НЕ годится для нескольких
// работников: каждый будет считать своё. Замена на Redis — беседа 3.3, где
// общее хранилище появляется и для соединений. Пока лучше честная память с
// этой надписью, чем Redis в рекомендациях и Map в коде, как было в первой
// редакции.

const counters = new Map();          // ключ → { сколько, доКогда }

export const WINDOW_MS = 3600_000;
export const LIMIT  = 10;

export function noteFailure(ключ, сейчас = Date.now()) {
  const prevCount = counters.get(ключ);
  if (!prevCount || prevCount.доКогда < сейчас) {
    counters.set(ключ, { сколько: 1, доКогда: сейчас + WINDOW_MS });
    return 1;
  }
  prevCount.сколько += 1;
  return prevCount.сколько;
}

export function resetCounter(ключ) { counters.delete(ключ); }

export function isBruteForce(ключ, сейчас = Date.now()) {
  const prevCount = counters.get(ключ);
  if (!prevCount || prevCount.доКогда < сейчас) return false;
  return prevCount.сколько >= LIMIT;
}

/** Задержка растёт: пятая неудача ждёт секунду, десятая — полминуты. */
export function delayMs(ключ) {
  const prevCount = counters.get(ключ);
  if (!prevCount || prevCount.сколько < 4) return 0;
  return Math.min(30_000, 2 ** (prevCount.сколько - 4) * 250);
}

export function clearCounters() { counters.clear(); }

// ── СЧЁТ ПОПЫТОК, А НЕ НЕУДАЧ ────────────────────────────────────────────
//
// Вход считает НЕУДАЧИ: удачный вход не повод придержать человека. Открытая
// регистрация — другой случай: там вредна как раз УДАЧНАЯ попытка, потому
// что каждая заводит запись и письмо. Счётчик тот же, повод другой, и потому
// у него своё имя: читающий не должен гадать, что здесь считается.
export const noteAttempt = noteFailure;

/** Предел здесь доводом: у входа он свой, у регистрации свой. */
export function overLimit(ключ, предел, сейчас = Date.now()) {
  const prevCount = counters.get(ключ);
  if (!prevCount || prevCount.доКогда < сейчас) return false;
  return prevCount.сколько >= предел;
}

/**
 * Сколько записей с одного адреса в час.
 *
 * ЧИСЛО ИМЕЕТ СМЫСЛ ТОЛЬКО ПРИ ВЕРНОМ АДРЕСЕ. За обратным ставнем без
 * `trust proxy` у всех один адрес, и предел ударил бы по всем разом — потому
 * запуск в production без объявленного TRUST_PROXY отказан (`serve.mjs`).
 */
export const REGISTER_LIMIT = 5;
