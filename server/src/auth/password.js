// ПАРОЛИ.
//
// argon2id с явными настройками вместо bcrypt(10) первой редакции. Довод не
// в моде: bcrypt обрезает вход на 72 байтах, и это же свойство сделало там
// вторую беду — хеширование им ТОКЕНА (см. src/auth/sessions.js).
//
// Требования к паролю проверяются НА СЕРВЕРЕ. В первой редакции они жили
// только в форме, а форма — это подсказка, а не заслон.

import argon2 from 'argon2';
import { Forbidden } from '../http/errors.js';

// Настройки выписаны числами, а не оставлены на умолчание библиотеки:
// умолчание меняется от версии к версии, и тогда старые хеши проверяются
// одними затратами, а новые считаются другими — молча.
export const OPTIONS = Object.freeze({
  type: argon2.argon2id,
  memoryCost: 19456,   // 19 МиБ
  timeCost: 2,
  parallelism: 1,
});

export const hashPassword = пароль => argon2.hash(пароль, OPTIONS);

/** Никогда не бросает: неверный пароль и битый хеш — оба «не сошлось». */
export const verifyPassword = (passwordHash, пароль) =>
  argon2.verify(passwordHash, пароль, OPTIONS).catch(() => false);

// ХОЛОСТОЙ ХЕШ. При неизвестном адресе сверка всё равно выполняется, чтобы
// время ответа не выдавало, существует ли запись. Считается один раз при
// загрузке модуля — иначе первая же сверка «в пустоту» окажется заметно
// дешевле настоящей.
export const DUMMY_HASH = await argon2.hash(
  'нет такого пользователя:' + Math.random(), OPTIONS);

export const MIN_LENGTH = 12;

// Список самых частых — не полнота, а заслон от очевидного. Настоящую
// проверку по словарю ставить, когда появятся живые пользователи.
const COMMON_PASSWORDS = new Set([
  'password', 'пароль', '123456789012', 'qwertyuiop12', 'administrator',
  'philosophy12', 'graph1234567', 'passwordpassword', 'qwerty123456',
]);

export function assertPasswordPolicy(пароль) {
  if (typeof пароль !== 'string' || пароль.length < MIN_LENGTH) {
    throw new Forbidden(`Пароль короче ${MIN_LENGTH} знаков`);
  }
  // Пробелы по краям — обычная опечатка при вставке; молча их обрезать
  // нельзя (пароль станет другим), а вот сказать о них надо.
  if (пароль !== пароль.trim()) {
    throw new Forbidden('Пароль начинается или кончается пробелом');
  }
  if (COMMON_PASSWORDS.has(пароль.toLowerCase())) {
    throw new Forbidden('Такой пароль слишком частый');
  }
}
