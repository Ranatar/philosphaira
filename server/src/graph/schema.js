// ОПИСЬ ШЕСТИ НАБОРОВ.
//
// Здесь записано то, чего база знать не может: КАКИЕ поля у записи и В КАКОМ
// ПОРЯДКЕ они пишутся. JSONB порядок ключей не хранит (и не обязан), а
// выгрузка должна совпадать с прежними файлами посимвольно — значит порядок
// задаётся описью.
//
// Порядок и состав СНЯТЫ С ФАЙЛОВ, а не придуманы: перенос сам проверяет,
// что ни одного постороннего ключа в данных не встретилось, и падает, если
// встретилось. Молча выкинуть поле — худшее, что может сделать перенос.

export const SETS = Object.freeze({
  // ПРОИСХОЖДЕНИЕ (`provenance`) идёт ПОСЛЕДНИМ ключом, а не по смыслу:
  // порядок снят с файлов побайтовым сличением, и вставка в середину
  // разошлась бы с ними. Поле НЕОБЯЗАТЕЛЬНО — у большинства сущностей его
  // нет и не будет ещё долго; пустое значение не пишется вовсе, чтобы
  // выгрузка сущности без источника осталась прежней знак в знак.
  //
  // Имя НЕ `source`: у связей так называется начало связи, и совпадение
  // сломало бы и опись, и слияние — невнятно и не сразу.
  //
  // `provenanceStatus` (27.08) отвечает на вопрос, на который одна строка
  // ответить не может: ПОЧЕМУ ИСТОЧНИКА НЕТ. Пустое поле означало сразу
  // четыре разных положения дел — не искали, искали и не нашли, своё
  // построение, прежний источник отвергнут, — и различить их было нельзя.
  concepts:      { kind: 'concept',      keys: ['id', 'label', 'philosopher', 'rubrics', 'description', 'extendedDescription', 'provenance', 'provenanceStatus'] },
  relations:     { kind: 'relation',     keys: ['id', 'source', 'target', 'type', 'weight', 'bidirectional', 'description', 'provenance', 'provenanceStatus'] },
  philosophers:  { kind: 'philosopher',  keys: ['id', 'name', 'nameRu', 'color', 'birth', 'death', 'years', 'traditions', 'description', 'provenance', 'provenanceStatus'] },
  traditions:    { kind: 'tradition',    keys: ['id', 'name', 'description'] },
  rubrics:       { kind: 'rubric',       keys: ['id', 'name', 'description', 'reserved'] },
  // Порядок СНЯТ С ФАЙЛОВ, а не придуман: temporal идёт ПЕРЕД ground и
  // symmetric, и одна опись покрывает все три встречающихся порядка —
  // проверено побайтовым сличением выгрузки.
  relationTypes: { kind: 'relationType', keys: ['id', 'label', 'color', 'layer', 'temporal', 'ground', 'symmetric'] },
});

/** Имя набора по роду сущности — обратный указатель, чтобы не искать перебором. */
export const SET_BY_KIND = Object.freeze(Object.fromEntries(
  Object.entries(SETS).map(([имя, о]) => [о.kind, имя])));

/**
 * СОСТОЯНИЯ ПРОИСХОЖДЕНИЯ.
 *
 * `unspecified` — источник ещё не искали или не указали. Это УМОЛЧАНИЕ: все
 *   записи, заведённые до 27.08, именно таковы, и их молчание ничего не
 *   утверждает.
 * `sourced` — есть библиографическая ссылка; она в `provenance`.
 * `editorial_reasoning` — собственное построение составителя, а не ссылка.
 *   Прежнее соглашение «две косые в начале строки» переводится сюда.
 * `source_not_found` — искали и пока НЕ НАШЛИ.
 *
 * ПОСЛЕДНЕЕ — РЕДАКЦИОННОЕ СОСТОЯНИЕ, А НЕ ДОКАЗАТЕЛЬСТВО ОТСУТСТВИЯ
 * ИСТОЧНИКА. Оно говорит о ходе работы, а не о предмете: завтра источник
 * может найтись. Путать эти вещи — значит превращать рабочую пометку в
 * утверждение о философии, которого никто не делал.
 */
export const PROVENANCE_STATUS = Object.freeze({
  UNSPECIFIED:         'unspecified',
  SOURCED:             'sourced',
  EDITORIAL_REASONING: 'editorial_reasoning',
  SOURCE_NOT_FOUND:    'source_not_found',
});

export const PROVENANCE_STATUSES = Object.freeze(Object.values(PROVENANCE_STATUS));

export const SET_NAMES = Object.freeze(Object.keys(SETS));
