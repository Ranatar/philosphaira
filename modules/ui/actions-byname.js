// Сгенерировано tools/delegate.mjs — правки вносить туда.
import { registerActions } from './actions.js';
import { deleteConcept, deleteConnection, deletePhilosopher, saveConceptData, saveConnectionData, savePhilosopherData } from '../modal/persist.js';

// Кнопки «Сохранить» и «Удалить» в формах правки: name обработчика приходит
// из данных, потому что одна и та же полоса кнопок обслуживает концепции,
// философов и связи. Промах по имени — ошибка, а не тишина.
const BY_NAME = { saveConceptData, savePhilosopherData, saveConnectionData, deleteConcept, deletePhilosopher, deleteConnection };

function callByName(name, ...args) {
  const fn = BY_NAME[name];
  if (!fn) { console.error('делегирование: нет функции по имени —', name); return; }
  return fn(...args.filter(d => d !== undefined && d !== ''));
}

registerActions({
  'сохранить-сущность': (el) => callByName(el.dataset.a1),
  'удалить-сущность': (el) => callByName(el.dataset.a1, el.dataset.a2, el.dataset.a3),
});
