// ПРАВИЛА СВОБОДНОГО ТЕКСТА В СУЩНОСТЯХ ГРАФА.
//
// ПОВОД (26.09.2026). Сквозной опыт: правщик подал коммит, где в метке и в
// описании концепции стояла разметка со сценарием; модератор одобрил — и
// сценарий исполнился у гостя, открывшего окно концепции. Страница
// вставляла текст в разметку как есть, сервер не смотрел на него вовсе.
//
// Заслона ДВА, и это не повтор. Страница экранирует всякий показ описания
// (richText в исходнике) — это защищает от всего, что уже лежит в базе или
// придёт мимо сервера (семя, сохранение в файлы). Сервер не пускает
// разметку в базу — это защищает все места показа РАЗОМ, включая метки и
// имена, которые страница выводит в сотне мест.
//
// ПРАВИЛО. Во всех строках правки запрещены `<`, `>` и прямая кавычка `"`:
// первые два открывают разметку, кавычка закрывает значение атрибута, куда
// метки и имена подставляются (`data-tip="…"`). В базе на 26.09.2026 этих
// знаков нет ни в одном поле ни одного набора — правило ничего не отнимает.
// Исключение — описания: в них разрешены РОВНО `<b>`, `</b>`, `<i>`, `</i>`
// без атрибутов (решение автора) и кавычка (описание всюду экранируется).

import { footnoteMarks, FOOTNOTE_HOST_FIELDS } from './footnotes.js';

export const RICH_FIELDS = Object.freeze(['description', 'extendedDescription']);
const ALLOWED_TAG = /<\/?[bi]>/g;

/** Все строки значения — и вложенные (рубрики, сноски) — с путём до них. */
function* stringsOf(value, at) {
  if (typeof value === 'string') { yield [at, value]; return; }
  if (Array.isArray(value)) { let i = 0; for (const x of value) yield* stringsOf(x, `${at}[${i++}]`); return; }
  if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) yield* stringsOf(v, `${at}.${k}`);
}

/** Нарушения правил текста в значении одного поля сущности данного рода. */
export function textProblems(kind, field, value) {
  const problems = [];
  const rich = RICH_FIELDS.includes(field);
  for (const [at, text] of stringsOf(value, field)) {
    const rest = rich ? text.replace(ALLOWED_TAG, '') : text;
    if (/[<>]/.test(rest)) {
      problems.push(rich
        ? `${at}: разметка не допускается — в описании можно только <b>…</b> и <i>…</i>, без атрибутов`
        : `${at}: знаки < и > не допускаются`);
    } else if (!rich && text.includes('"')) {
      problems.push(`${at}: прямая кавычка " не допускается — используйте «ёлочки»`);
    }
  }
  // Метка сноски — только там, где сноски живут. Прежде у концепции их
  // принимало и краткое описание, которого окно концепции не показывает:
  // номер висел в списке источников без места в тексте.
  if (rich && typeof value === 'string' && !(FOOTNOTE_HOST_FIELDS[kind] ?? []).includes(field)
      && footnoteMarks().test(value)) {
    problems.push(`${field}: метки сносок здесь не ставятся — у ${kind} сноски только в ${(FOOTNOTE_HOST_FIELDS[kind] ?? []).join(', ') || 'нигде'}`);
  }
  return problems;
}

/** Нарушения во всей сущности (для семени и выгрузок). */
export function entityTextProblems(kind, entity) {
  return Object.entries(entity ?? {}).flatMap(([field, value]) => textProblems(kind, field, value));
}
