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
         upsertEntity, patchEntity, stampVersion } from '../db/graph.js';
import { НАБОРЫ, НАБОР_ПО_РОДУ } from '../graph/schema.js';
import { Conflict } from '../http/errors.js';

/**
 * Применить коммит целиком.
 * Возвращает { исход, версия, применено } либо бросает Conflict с разбором.
 * Исход 'coincided' означает, что всё содержимое коммита УЖЕ внесено кем-то
 * другим: работа не пропала, но записывать нечего.
 */
export async function applyCommit(client, { changes, actorId = null }) {
  const столкновения = [];
  const записать = [];

  for (const изм of changes) {
    const { есть, живая, порядок } = await lockEntity(client, изм.kind, изм.entityId);
    const итог = mergeEntityChange({
      action: изм.action,
      fields: изм.fields ?? {},
      current: живая,
    });

    if (итог.outcome === MERGE.CONFLICT) {
      for (const с of итог.conflicts ?? [{ field: null, reason: 'столкновение' }]) {
        столкновения.push({
          набор: НАБОР_ПО_РОДУ[изм.kind], kind: изм.kind, entityId: изм.entityId,
          action: изм.action, ...с,
        });
      }
      continue;
    }
    записать.push({ изм, итог, есть, порядок });
  }

  if (столкновения.length) {
    throw new Conflict('Изменения столкнулись с чужими', { столкновения });
  }

  // Сколько записей выйдет — известно ДО записи, и это важно: версию графа
  // надо поднять ПЕРЕД тем, как ставить её сущностям. Иначе приращение
  // «что изменилось с версии N» пропустит собственный коммит.
  const кЗаписи = записать.filter(з => з.итог.outcome !== MERGE.SAME);
  if (!кЗаписи.length) return { исход: 'coincided', версия: null, применено: 0 };

  const версия = await bumpGraphVersion(client);

  let тронуто = 0;
  for (const { изм, итог, есть, порядок } of кЗаписи) {

    if (изм.action === 'delete') {
      await markEntityDeleted(client, изм.kind, изм.entityId, actorId);
      await stampVersion(client, { kind: изм.kind, entityId: изм.entityId, версия });
      тронуто++;
      continue;
    }

    if (изм.action === 'add') {
      const тело = {};
      for (const [поле, з] of Object.entries(изм.fields)) тело[поле] = з.next;
      // Сущность могла существовать и быть удалённой — тогда её воскрешают,
      // а не заводят рядом вторую: адрес занят навсегда.
      const ord = есть ? порядок : await nextOrd(client, изм.kind);
      await upsertEntity(client, { kind: изм.kind, entityId: изм.entityId,
                                   ord, тело, actorId });
      await stampVersion(client, { kind: изм.kind, entityId: изм.entityId, версия });
      тронуто++;
      continue;
    }

    // edit: пишутся ТОЛЬКО чистые поля. Совпавшие уже стоят в базе, и
    // переписывать их значило бы поднимать версию впустую.
    await patchEntity(client, { kind: изм.kind, entityId: изм.entityId,
                                поля: итог.apply, actorId });
    await stampVersion(client, { kind: изм.kind, entityId: изм.entityId, версия });
    тронуто++;
  }

  return { исход: 'applied', версия, применено: тронуто };
}

/** Опись нужна разбору столкновений: показать поле по-человечески. */
export const полеНабора = (kind, поле) =>
  НАБОРЫ[НАБОР_ПО_РОДУ[kind]]?.keys.includes(поле) ? поле : `${поле} (нет в описи)`;
