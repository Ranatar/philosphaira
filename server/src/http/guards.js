// Заставы. Проверяют ПРАВО — и только его.
//
// Отношение к предмету (не над собой ли, не свой ли коммит, не последний ли
// администратор) проверяет служба, а не застава. Разделение не случайно:
// право проверяется без чтения базы, отношение — нельзя, и попытка сделать
// это в заставе дала бы двойное чтение и два ответа на один вопрос.
//
// Ветки /api/admin/… для действий над пользователями не заводятся: путь не
// должен быть вторым носителем знания о правах.

import { assertCan } from '../access/access.js';
import { Unauthorized } from './errors.js';

export const requirePermission = permission => (req, _res, next) => {
  try { assertCan(req.user, permission); next(); } catch (e) { next(e); }
};

export const requireAuth = (req, _res, next) =>
  req.user ? next() : next(new Unauthorized());
