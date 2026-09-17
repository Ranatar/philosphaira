/**
 * ЗАМЕРЫ МЕТРИК: служба (E-2).
 *
 * СЕРВЕР НЕ СЧИТАЕТ МЕТРИКИ И НЕ БУДЕТ. Восемьдесят шесть функций живут в
 * браузере, переносить их сюда — работа на месяцы без всякой прибыли:
 * доверие к числу даёт не место вычисления, а записанные условия и
 * воспроизводимость. Сервер помнит наблюдение и стережёт его связность.
 */

import { assertCan, can } from '../access/access.js';
import { P } from '../access/roles.js';
import { Forbidden } from '../http/errors.js';
import { withTransaction } from '../db/tx.js';
import { graphVersion } from '../db/graph.js';
import { insertObservation, findObservation, listObservations, deleteObservation,
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
  assertCan(actor, P.SAVE_OBSERVATION);
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

/**
 * ЧУЖОЙ ЗАМЕР НЕ ОТЛИЧАЕТСЯ ОТ НЕСУЩЕСТВУЮЩЕГО. Отказ один и тот же — «Замера
 * нет», — иначе перебор по идентификаторам сообщал бы, какие замеры на свете
 * есть и у кого. То же правило, по которому вход отвечает одинаково на
 * неверный пароль и на неизвестный адрес.
 */
function assertVisible(actor, observation) {
  if (!observation) throw new Forbidden('Замера нет');
  if (can(actor, P.VIEW_ALL_OBSERVATIONS)) return observation;
  if (observation.authorId === actor.userId) return observation;
  throw new Forbidden('Замера нет');
}

export async function getObservation(pool, { actor, observationId }) {
  assertCan(actor, P.VIEW_GRAPH);
  return assertVisible(actor, await findObservation(pool, observationId));
}

export async function listMetricObservations(pool, { actor, metric, limit }) {
  assertCan(actor, P.VIEW_GRAPH);
  // Кому не дано видеть чужие — тот видит СВОИ, а не пустоту: замеры и
  // заводились ради того, чтобы человек сличал собственный ряд.
  const onlyAuthorId = can(actor, P.VIEW_ALL_OBSERVATIONS) ? null : actor.userId;
  return listObservations(pool, { metric, limit, onlyAuthorId });
}

/**
 * УДАЛЕНИЕ — то, чего не было вовсе. Записанный замер нельзя было убрать
 * никак, даже администратору: пять ходов службы спрашивали VIEW_GRAPH, и
 * удаления среди них не значилось.
 *
 * Удаление ОКОНЧАТЕЛЬНОЕ, а не мягкое, и это осознанно. Мягкое удаление
 * заведено у сущностей графа ради отката коммитов — тело нужно, чтобы вернуть
 * его обратно. Замер же ничего не обращает: он не часть истории графа, а
 * запись о наблюдении. Держать удалённые замеры значило бы копить ряд,
 * который никто не увидит и не сличит.
 */
export async function removeObservation(pool, { actor, observationId }) {
  assertCan(actor, P.DELETE_OBSERVATION);
  const deleted = await deleteObservation(pool, observationId);
  if (!deleted) throw new Forbidden('Замера нет');
  return { observationId: deleted.observation_id, metric: deleted.metric };
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
  // Видимость спрашивается у ОБОИХ: иначе сличение стало бы обходным путём
  // к чужому замеру — числа чужого ряда вышли бы наружу разницей.
  const first = assertVisible(actor, await findObservation(pool, aId));
  const second = assertVisible(actor, await findObservation(pool, bId));

  const differs = CONDITIONS.filter(condition => first[condition] !== second[condition]);
  if (differs.length) {
    const inWords = {
      metric: 'метрика', formulaVersion: 'версия формулы',
      flags: 'флаги счёта', scopeHash: 'охват',
    };
    return {
      сравнимы: false,
      разошлось: differs.map(condition => ({
        что: inWords[condition] ?? condition, у_первого: first[condition], у_второго: second[condition] })),
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
    сводка: Object.fromEntries(fieldNames.map(field => {
      const before = Number(summaryEarlier[field]), updated = Number(summaryLater[field]);
      const finite = Number.isFinite(before) && Number.isFinite(updated);
      return [field, { было: summaryEarlier[field] ?? null, стало: summaryLater[field] ?? null,
                   разница: finite ? +(updated - before).toFixed(6) : null }];
    })),
  };
}

export async function listComparableWith(pool, { actor, observationId }) {
  assertCan(actor, P.VIEW_GRAPH);
  assertVisible(actor, await findObservation(pool, observationId));
  const all = await listComparable(pool, { observationId });
  // И сам перечень сравнимых сужается: показать чужой замер в списке «с чем
  // можно сличить» значило бы отдать его тем же путём, только в обход.
  return can(actor, P.VIEW_ALL_OBSERVATIONS)
    ? all : all.filter(o => o.authorId === actor.userId);
}
