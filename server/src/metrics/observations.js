/**
 * ЗАМЕРЫ МЕТРИК: служба (E-2).
 *
 * СЕРВЕР НЕ СЧИТАЕТ МЕТРИКИ И НЕ БУДЕТ. Восемьдесят шесть функций живут в
 * браузере, переносить их сюда — работа на месяцы без всякой прибыли:
 * доверие к числу даёт не место вычисления, а записанные условия и
 * воспроизводимость. Сервер помнит наблюдение и стережёт его связность.
 */

import { assertCan } from '../access/access.js';
import { P } from '../access/roles.js';
import { Forbidden } from '../http/errors.js';
import { withTransaction } from '../db/tx.js';
import { graphVersion } from '../db/graph.js';
import { insertObservation, findObservation, listObservations,
         listComparable, scopeFingerprint } from '../db/observations.js';

/** Условия, при совпадении которых замеры сравнимы. Версия графа — не в счёт. */
const CONDITIONS = ['metric', 'formulaVersion', 'flags', 'scopeHash'];

function assertValues(values) {
  if (!values || typeof values !== 'object') {
    throw new Forbidden('Замер без значений');
  }
  const summary = values.summary;
  if (!summary || typeof summary !== 'object') {
    // Верхний десяток без сводки не даёт сказать, сдвинулась ли метрика вся
    // или только её вершина, — а именно это и спрашивают у ряда замеров.
    throw new Forbidden(
      'Замер без сводки: нужны хотя бы среднее и медиана по всем значениям');
  }
  if (Array.isArray(values.top) && values.top.length > 100) {
    throw new Forbidden('Верхних значений больше сотни — это уже выгрузка, а не замер');
  }
}

/**
 * Записать замер.
 *
 * ФЛАГИ И ВЕРСИЮ ФОРМУЛЫ ПОДАЁТ КЛИЕНТ, и это осознанно: только он знает,
 * при каких галочках считал и какая формула у него на руках. Сервер их не
 * выдумывает — он их ЗАПОМИНАЕТ. Ложь клиента здесь возможна, но она вредит
 * лишь ему самому: сравнимость проверяется по тем же величинам.
 *
 * ВЕРСИЮ ГРАФА, НАПРОТИВ, БЕРЁТ СЕРВЕР. Клиент мог отстать на чужую правку и
 * не знать об этом, и тогда замер оказался бы подписан версией, которой в
 * природе не было.
 */
export async function recordObservation(pool, {
  actor, metric, formulaVersion, flags, scope, scopeNote, values, note,
}) {
  assertCan(actor, P.VIEW_GRAPH);
  if (!metric || !String(metric).trim()) throw new Forbidden('Замер без метрики');
  if (!Number.isInteger(formulaVersion) || formulaVersion < 1) {
    throw new Forbidden('Замер без версии формулы: число без родословной');
  }
  if (!flags || typeof flags !== 'string') throw new Forbidden('Замер без флагов');
  assertValues(values);

  return withTransaction(pool, async client => {
    const version = await graphVersion(client);
    return insertObservation(client, {
      metric: String(metric).trim(),
      graphVersion: version,
      formulaVersion,
      flags,
      scopeHash: scopeFingerprint(scope),
      scopeNote: scopeNote ? String(scopeNote).slice(0, 120) : null,
      values,
      note: note ? String(note).slice(0, 300) : null,
      authorId: actor.userId,
    });
  });
}

export async function getObservation(pool, { actor, observationId }) {
  assertCan(actor, P.VIEW_GRAPH);
  const observation = await findObservation(pool, observationId);
  if (!observation) throw new Forbidden('Замера нет');
  return observation;
}

export async function listMetricObservations(pool, { actor, metric, limit }) {
  assertCan(actor, P.VIEW_GRAPH);
  return listObservations(pool, { metric, limit });
}

/**
 * СРАВНЕНИЕ ДВУХ ЗАМЕРОВ — и ОТКАЗ, если они несравнимы.
 *
 * Отказ прямой, а не предупреждение мелким шрифтом: ряд чисел, у которых
 * разошлась формула или охват, выглядит историей графа, а на деле история
 * наших правок. Ложная история убедительнее отсутствующей, и потому её надо
 * не оговаривать, а не показывать вовсе.
 */
export async function compareObservations(pool, { actor, aId, bId }) {
  assertCan(actor, P.VIEW_GRAPH);
  const first = await findObservation(pool, aId);
  const second = await findObservation(pool, bId);
  if (!first || !second) throw new Forbidden('Замера нет');

  const differs = CONDITIONS.filter(к => first[к] !== second[к]);
  if (differs.length) {
    const inWords = {
      metric: 'метрика', formulaVersion: 'версия формулы',
      flags: 'флаги счёта', scopeHash: 'охват',
    };
    return {
      сравнимы: false,
      разошлось: differs.map(к => ({
        что: inWords[к] ?? к, у_первого: first[к], у_второго: second[к] })),
      почему: 'Сравнивать можно только замеры, у которых совпало всё, кроме '
            + 'версии графа. Иначе разница в числах будет приписана графу, '
            + 'а взялась она из условий счёта.',
    };
  }

  if (first.graphVersion === second.graphVersion) {
    return { сравнимы: false, разошлось: [],
      почему: 'Это один и тот же граф — сравнивать нечего.' };
  }

  const earlier = first.graphVersion < second.graphVersion ? first : second;
  const later  = first.graphVersion < second.graphVersion ? second : first;
  const summaryEarlier = earlier.values.summary ?? {};
  const summaryLater = later.values.summary ?? {};
  const fieldNames = [...new Set([...Object.keys(summaryEarlier), ...Object.keys(summaryLater)])];

  return {
    сравнимы: true,
    метрика: first.metric,
    условия: { formulaVersion: first.formulaVersion, flags: first.flags,
               scopeNote: first.scopeNote ?? later.scopeNote ?? null },
    раньше: { observationId: earlier.observationId, graphVersion: earlier.graphVersion,
              createdAt: earlier.createdAt },
    позже:  { observationId: later.observationId,  graphVersion: later.graphVersion,
              createdAt: later.createdAt },
    сводка: Object.fromEntries(fieldNames.map(п => {
      const before = Number(summaryEarlier[п]), updated = Number(summaryLater[п]);
      const finite = Number.isFinite(before) && Number.isFinite(updated);
      return [п, { было: summaryEarlier[п] ?? null, стало: summaryLater[п] ?? null,
                   разница: finite ? +(updated - before).toFixed(6) : null }];
    })),
  };
}

export async function listComparableWith(pool, { actor, observationId }) {
  assertCan(actor, P.VIEW_GRAPH);
  if (!await findObservation(pool, observationId)) throw new Forbidden('Замера нет');
  return listComparable(pool, { observationId });
}
