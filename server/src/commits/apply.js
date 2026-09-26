// ПРИМЕНЕНИЕ КОММИТА.
//
// Столкновение возникает не между двумя ожидающими коммитами — те просто
// стоят в очереди, — а между коммитом и СОСТОЯНИЕМ БАЗЫ НА МИГ ПРИМЕНЕНИЯ.
// Поэтому вопрос всегда один: то ли сейчас в поле, что видел правщик.
//
// Сверка идёт ПО ПОЛЮ, а не по сущности целиком: один правил описание,
// другой рубрики — оба применяются, слияние выходит само. Это самый частый
// случай совместной работы, и версия на всю сущность блокировала его зря.
//
// Столкнулось одно поле — не применяется НИЧЕГО: половина правки хуже, чем
// ни одной.

import { mergeEntityChange, MERGE } from './merge.js';
import { bumpGraphVersion, lockEntity, nextOrd, markEntityDeleted,
         upsertEntity, patchEntity, stampVersion, exportAll } from '../db/graph.js';
import { currentLayout, saveLayout } from '../db/layout.js';
import { touchesLayout, growLayout, divergence } from '../graph/layout.js';
import { SETS, SET_BY_KIND, OMITTED_WHEN_EMPTY, isEmptyOptional, provenanceProblems } from '../graph/schema.js';
import { footnoteProblems, FOOTNOTE_HOST_FIELDS } from '../graph/footnotes.js';
import { Conflict } from '../http/errors.js';

/**
 * Применить коммит целиком.
 * Возвращает { исход, версия, применено } либо бросает Conflict с разбором.
 * Исход 'coincided' означает, что всё содержимое коммита УЖЕ внесено кем-то
 * другим: работа не пропала, но записывать нечего.
 */
export async function applyCommit(client, { changes, actorId = null }) {
  const conflicts = [];
  const toWrite = [];

  for (const change of changes) {
    const { есть: exists, живая: alive, порядок: position } = await lockEntity(client, change.kind, change.entityId);
    const merged = mergeEntityChange({
      action: change.action,
      fields: change.fields ?? {},
      current: alive,
    });

    if (merged.outcome === MERGE.CONFLICT) {
      for (const since of merged.conflicts ?? [{ field: null, reason: 'столкновение' }]) {
        conflicts.push({
          набор: SET_BY_KIND[change.kind], kind: change.kind, entityId: change.entityId,
          action: change.action, ...since,
        });
      }
      continue;
    }
    // СОГЛАСИЕ СНОСОК СУДИТСЯ ПО ИТОГУ, А НЕ ПО ПРАВКЕ: правка может трогать
    // одно описание, а записи сносок лежат в сущности; и два по отдельности
    // верных коммита при слиянии дают несогласие (один убрал метку, другой
    // правил её сноску). Такое — столкновение для рецензента, а не отказ.
    //
    // И ТОЛЬКО ЕСЛИ ПРАВКА ИХ КАСАЕТСЯ. Прежде суд шёл при любой правке
    // сущности: запись, пришедшая с несогласной сноской семенем, запиралась
    // целиком — правка её рубрик получала «сноски не сходятся» и не писалась
    // (замер 26.09.2026). Касается — значит трогает сноски или текст, где
    // стоят метки; тогда несогласие и правда дело этой правки.
    const touched = Object.keys(change.fields ?? {});
    const result = change.action === 'add'
      ? Object.fromEntries(Object.entries(change.fields ?? {}).map(([k, v]) => [k, v.next]))
      : { ...(alive ?? {}), ...(merged.apply ?? {}) };
    const touchesNotes = change.action === 'add' || touched.includes('footnotes')
      || (FOOTNOTE_HOST_FIELDS[change.kind] ?? []).some(f => touched.includes(f));
    if (change.action !== 'delete' && FOOTNOTE_HOST_FIELDS[change.kind] && touchesNotes) {
      const problems = footnoteProblems(change.kind, result);
      if (problems.length) {
        conflicts.push({ набор: SET_BY_KIND[change.kind], kind: change.kind, entityId: change.entityId,
          action: change.action, field: 'footnotes', reason: 'сноски не сходятся с текстом: ' + problems.join('; ') });
        continue;
      }
    }
    // СОГЛАСИЕ ИСТОЧНИКА — по итогу, тем же ходом и по тому же поводу: если
    // правка трогала источник или его состояние.
    if (change.action !== 'delete'
        && (touched.includes('provenance') || touched.includes('provenanceStatus'))) {
      const problems = provenanceProblems(result);
      if (problems.length) {
        conflicts.push({ набор: SET_BY_KIND[change.kind], kind: change.kind, entityId: change.entityId,
          action: change.action, field: 'provenanceStatus', reason: 'источник не согласован: ' + problems.join('; ') });
        continue;
      }
    }
    toWrite.push({ изм: change, итог: merged, есть: exists, порядок: position });
  }

  if (conflicts.length) {
    throw new Conflict('Изменения столкнулись с чужими', { столкновения: conflicts });
  }

  // Сколько записей выйдет — известно ДО записи, и это важно: версию графа
  // надо поднять ПЕРЕД тем, как ставить её сущностям. Иначе приращение
  // «что изменилось с версии N» пропустит собственный коммит.
  const toApply = toWrite.filter(entry => entry.итог.outcome !== MERGE.SAME);
  if (!toApply.length) return { исход: 'coincided', версия: null, применено: 0 };

  const version = await bumpGraphVersion(client);

  let touched = 0;
  for (const { изм: change, итог: merged, есть: exists, порядок: position } of toApply) {

    if (change.action === 'delete') {
      await markEntityDeleted(client, change.kind, change.entityId, actorId);
      await stampVersion(client, { kind: change.kind, entityId: change.entityId, версия: version });
      touched++;
      continue;
    }

    if (change.action === 'add') {
      const payload = {};
      for (const [fieldKey, entry] of Object.entries(change.fields)) {
        // пустой необязательный ключ не пишется вовсе — как в файлах семени
        if (OMITTED_WHEN_EMPTY.includes(fieldKey) && isEmptyOptional(entry.next)) continue;
        payload[fieldKey] = entry.next;
      }
      // Сущность могла существовать и быть удалённой — тогда её воскрешают,
      // а не заводят рядом вторую: адрес занят навсегда.
      const ord = exists ? position : await nextOrd(client, change.kind);
      await upsertEntity(client, { kind: change.kind, entityId: change.entityId,
                                   ord, тело: payload, actorId });
      await stampVersion(client, { kind: change.kind, entityId: change.entityId, версия: version });
      touched++;
      continue;
    }

    // edit: пишутся ТОЛЬКО чистые поля. Совпавшие уже стоят в базе, и
    // переписывать их значило бы поднимать версию впустую.
    // Пустой необязательный ключ — это «убрать ключ»: записанный null
    // разошёлся бы с файлами и был бы неотличим от «источник — пустая строка».
    const setFields = {}, dropKeys = [];
    for (const [fieldKey, value] of Object.entries(merged.apply ?? {})) {
      if (OMITTED_WHEN_EMPTY.includes(fieldKey) && isEmptyOptional(value)) dropKeys.push(fieldKey);
      else setFields[fieldKey] = value;
    }
    await patchEntity(client, { kind: change.kind, entityId: change.entityId,
                                поля: setFields, убрать: dropKeys, actorId });
    await stampVersion(client, { kind: change.kind, entityId: change.entityId, версия: version });
    touched++;
  }

  // ── РАСКЛАДКА ─────────────────────────────────────────────────────
  // В ТОЙ ЖЕ ТРАНЗАКЦИИ, что и правка: раскладка — часть состояния графа, и
  // разъехаться с ним она не должна ни на миг.
  //
  // ДОРАСКЛАД, А НЕ ПЕРЕСЧЁТ. Замер на улёгшейся раскладке: одна добавленная
  // связь при полном пересчёте сдвигает узлы на 130 px по медиане, при
  // дорассладе из прежних координат — на 9. Полный пересчёт после каждого
  // коммита означал бы, что после чужой правки все теряют ориентировку.
  //
  // И НЕ ПРИ КАЖДОМ КОММИТЕ. Раскладка зависит только от множества узлов и
  // пар «источник — цель»; правка описания, типа, веса, рубрик её не
  // задевает, и большинство коммитов пересчёта не требует вовсе.
  let layout = null;
  if (touchesLayout(changes)) {
    const previous = await currentLayout(client);
    if (previous) {
      const graph = await exportAll(client);
      const { позиции: positions, новых: added } = growLayout(graph, previous.позиции);
      const measure = divergence(previous.позиции, positions);
      const id = await saveLayout(client, {
        версияГрафа: version, род: 'warm', изЧего: previous.id,
        позиции: positions, ктоId: actorId, расхождение: measure,
      });
      layout = { id, новых: added, ...measure };
    }
    else {
      // Прежней раскладки нет — значит её ещё ни разу не считали. Полный
      // отжиг ВНУТРИ транзакции правки недопустим: это секунды под замком на
      // всех сущностях. Но и промолчать нельзя: без начальной раскладки
      // коммиты не заведут её НИКОГДА, каждый клиент будет считать свою, и
      // узнают об этом только когда двое сравнят картины. Нашла эту дыру
      // проба живого обновления — на пустой базе она законно покраснела.
      console.warn('[раскладка] правка задела состав графа, но начальной ' +
        'раскладки нет — дорастить не из чего. Посчитайте: npm run relayout -- --применить');
    }
  }

  return { исход: 'applied', версия: version, применено: touched, раскладка: layout };
}

/** Опись нужна разбору столкновений: показать поле по-человечески. */
export const setField = (kind, fieldKey) =>
  SETS[SET_BY_KIND[kind]]?.keys.includes(fieldKey) ? fieldKey : `${fieldKey} (нет в описи)`;
