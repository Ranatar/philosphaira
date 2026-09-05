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
import { SETS, SET_BY_KIND } from '../graph/schema.js';
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
    const { есть, живая, порядок } = await lockEntity(client, change.kind, change.entityId);
    const merged = mergeEntityChange({
      action: change.action,
      fields: change.fields ?? {},
      current: живая,
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
    toWrite.push({ изм: change, итог: merged, есть, порядок });
  }

  if (conflicts.length) {
    throw new Conflict('Изменения столкнулись с чужими', { столкновения: conflicts });
  }

  // Сколько записей выйдет — известно ДО записи, и это важно: версию графа
  // надо поднять ПЕРЕД тем, как ставить её сущностям. Иначе приращение
  // «что изменилось с версии N» пропустит собственный коммит.
  const toApply = toWrite.filter(з => з.итог.outcome !== MERGE.SAME);
  if (!toApply.length) return { исход: 'coincided', версия: null, применено: 0 };

  const version = await bumpGraphVersion(client);

  let touched = 0;
  for (const { изм: change, итог: merged, есть, порядок } of toApply) {

    if (change.action === 'delete') {
      await markEntityDeleted(client, change.kind, change.entityId, actorId);
      await stampVersion(client, { kind: change.kind, entityId: change.entityId, версия: version });
      touched++;
      continue;
    }

    if (change.action === 'add') {
      const payload = {};
      for (const [поле, з] of Object.entries(change.fields)) payload[поле] = з.next;
      // Сущность могла существовать и быть удалённой — тогда её воскрешают,
      // а не заводят рядом вторую: адрес занят навсегда.
      const ord = есть ? порядок : await nextOrd(client, change.kind);
      await upsertEntity(client, { kind: change.kind, entityId: change.entityId,
                                   ord, тело: payload, actorId });
      await stampVersion(client, { kind: change.kind, entityId: change.entityId, версия: version });
      touched++;
      continue;
    }

    // edit: пишутся ТОЛЬКО чистые поля. Совпавшие уже стоят в базе, и
    // переписывать их значило бы поднимать версию впустую.
    await patchEntity(client, { kind: change.kind, entityId: change.entityId,
                                поля: merged.apply, actorId });
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
      const { позиции, новых } = growLayout(graph, previous.позиции);
      const measure = divergence(previous.позиции, позиции);
      const id = await saveLayout(client, {
        версияГрафа: version, род: 'warm', изЧего: previous.id,
        позиции, ктоId: actorId, расхождение: measure,
      });
      layout = { id, новых, ...measure };
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
export const setField = (kind, поле) =>
  SETS[SET_BY_KIND[kind]]?.keys.includes(поле) ? поле : `${поле} (нет в описи)`;
