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

export const НАБОРЫ = Object.freeze({
  concepts:      { kind: 'concept',      keys: ['id', 'label', 'philosopher', 'rubrics', 'description', 'extendedDescription'] },
  relations:     { kind: 'relation',     keys: ['id', 'source', 'target', 'type', 'weight', 'bidirectional', 'description'] },
  philosophers:  { kind: 'philosopher',  keys: ['id', 'name', 'nameRu', 'color', 'birth', 'death', 'years', 'traditions', 'description'] },
  traditions:    { kind: 'tradition',    keys: ['id', 'name', 'description'] },
  rubrics:       { kind: 'rubric',       keys: ['id', 'name', 'description', 'reserved'] },
  // Порядок СНЯТ С ФАЙЛОВ, а не придуман: temporal идёт ПЕРЕД ground и
  // symmetric, и одна опись покрывает все три встречающихся порядка —
  // проверено побайтовым сличением выгрузки.
  relationTypes: { kind: 'relationType', keys: ['id', 'label', 'color', 'layer', 'temporal', 'ground', 'symmetric'] },
});

/** Имя набора по роду сущности — обратный указатель, чтобы не искать перебором. */
export const НАБОР_ПО_РОДУ = Object.freeze(Object.fromEntries(
  Object.entries(НАБОРЫ).map(([имя, о]) => [о.kind, имя])));

export const ИМЕНА = Object.freeze(Object.keys(НАБОРЫ));
