// СНОСКИ В ОПИСАНИИ СУЩНОСТИ.
//
// Источник на всю сущность (`provenance` + `provenanceStatus`) остаётся как
// был и от сносок НЕ ЗАВИСИТ: сводка и отбор по происхождению считают по
// нему. Сноска уточняет отдельное утверждение внутри текста.
//
// УСТРОЙСТВО. В тексте описания стоит метка `[^id]`; запись сноски лежит в
// поле `footnotes` той же сущности: { id, status, text }. Номер «1, 2, 3»
// в хранимом нигде нет — его проставляет показ по порядку первого
// появления метки. Порядковые номера в хранимом сталкивались бы при
// слиянии (два правщика разом добавили «сноску 2»), смещения по знакам
// ломались бы при каждой правке текста. Постоянный id — ни того, ни другого.
//
// Квадратных скобок в описаниях базы нет ни одной (сверено по всем 3538
// записям), так что метка не спутается с живым текстом.
//
// Правило СОГЛАСИЯ — то же, что у происхождения сущности: сноска с
// источником без текста или «не найден» с текстом утверждает то, чего нет.

import { PROVENANCE_STATUS } from './schema.js';

export const FOOTNOTE_MARK_SOURCE = String.raw`\[\^([a-z0-9]{1,12})\]`;
export const footnoteMarks = () => new RegExp(FOOTNOTE_MARK_SOURCE, 'g');
export const FOOTNOTE_ID = /^[a-z0-9]{1,12}$/;

// «Не разобрано» у сноски смысла не имеет: пустая сноска — это отсутствие
// сноски. Остальные три — те же состояния, что у сущности.
export const FOOTNOTE_STATUSES = Object.freeze([
  PROVENANCE_STATUS.SOURCED,
  PROVENANCE_STATUS.EDITORIAL_REASONING,
  PROVENANCE_STATUS.SOURCE_NOT_FOUND,
]);
export const FOOTNOTE_TEXT_MAX = 300;
export const FOOTNOTES_MAX = 60;

/** В каких полях сущности бывают метки. */
export const FOOTNOTE_HOST_FIELDS = Object.freeze({
  concept:     Object.freeze(['description', 'extendedDescription']),
  relation:    Object.freeze(['description']),
  philosopher: Object.freeze(['description']),
});

/** Идентификаторы меток в текстах сущности — по порядку первого появления. */
export function footnoteIdsIn(kind, entity) {
  const seen = [];
  for (const field of FOOTNOTE_HOST_FIELDS[kind] ?? []) {
    const text = entity?.[field];
    if (typeof text !== 'string') continue;
    for (const m of text.matchAll(footnoteMarks())) if (!seen.includes(m[1])) seen.push(m[1]);
  }
  return seen;
}

/** Форма значения поля `footnotes`, без сверки с текстом. Пусто — годно. */
export function footnoteShapeProblems(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) return ['сноски — не список'];
  const problems = [];
  if (value.length === 0) problems.push('пустой список сносок не хранится — вместо него поле опускается');
  if (value.length > FOOTNOTES_MAX) problems.push(`сносок больше ${FOOTNOTES_MAX}`);
  const ids = new Set();
  value.forEach((note, i) => {
    const at = `сноска ${i + 1}`;
    if (!note || typeof note !== 'object' || Array.isArray(note)) { problems.push(`${at}: не запись`); return; }
    const extra = Object.keys(note).filter(k => !['id', 'status', 'text'].includes(k));
    if (extra.length) problems.push(`${at}: посторонние поля ${extra.join(', ')}`);
    if (!FOOTNOTE_ID.test(String(note.id ?? ''))) problems.push(`${at}: негодный id «${note.id}»`);
    else if (ids.has(note.id)) problems.push(`${at}: id «${note.id}» повторяется`);
    else ids.add(note.id);
    if (!FOOTNOTE_STATUSES.includes(note.status)) problems.push(`${at}: неизвестное состояние «${note.status}»`);
    const text = typeof note.text === 'string' ? note.text.trim() : '';
    if (note.text != null && typeof note.text !== 'string') problems.push(`${at}: текст — не строка`);
    if (text.length > FOOTNOTE_TEXT_MAX) problems.push(`${at}: текст длиннее ${FOOTNOTE_TEXT_MAX}`);
    if (note.status !== PROVENANCE_STATUS.SOURCE_NOT_FOUND && !text)
      problems.push(`${at}: у состояния «${note.status}» нужен текст`);
    if (note.status === PROVENANCE_STATUS.SOURCE_NOT_FOUND && text)
      problems.push(`${at}: «не найден» — это пометка о работе, текста источника у неё быть не может`);
  });
  return problems;
}

/** Согласие меток в тексте и записей: каждая метка с записью, каждая запись с меткой. */
export function footnoteProblems(kind, entity) {
  const problems = footnoteShapeProblems(entity?.footnotes);
  if (problems.length) return problems;
  const marked = footnoteIdsIn(kind, entity);
  const listed = (entity?.footnotes ?? []).map(n => n.id);
  for (const id of marked) if (!listed.includes(id)) problems.push(`метка [^${id}] без записи сноски`);
  for (const id of listed) if (!marked.includes(id)) problems.push(`сноска ${id} без метки в тексте`);
  return problems;
}
