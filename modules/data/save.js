// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA } from '../core/ns.js';
import { serverMode } from '../core/api.js';

const DATA_SETS = ['traditions', 'philosophers', 'rubrics',
                         'relationTypes', 'concepts', 'relations'];

let hasUnsavedEdits = false;

let unconfirmedDirect = 0;

function markDirty() { if (!serverMode) hasUnsavedEdits = true; }

function hasUnsaved() { return hasUnsavedEdits || unconfirmedDirect > 0; }

function trackDirectEdit(sending) {
      unconfirmedDirect++;
      // Исключение по дороге — тот же отказ: счёт обязан вернуться, иначе
      // уход со страницы спрашивал бы вечно.
      const settle = accepted => {
        unconfirmedDirect--;
        if (!accepted) hasUnsavedEdits = true;
        return accepted;
      };
      return sending.then(settle, () => settle(false));
    }

function collectData() {
      return { traditions: DATA.traditions, philosophers: DATA.philosophers, rubrics: DATA.rubrics, relationTypes: DATA.relationTypes, concepts: DATA.concepts, relations: DATA.relations };
    }

function deliverFile(name, text) {
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

function downloadData() {
      const data = collectData();
      for (const name of DATA_SETS) deliverFile(name + '.json', JSON.stringify(data[name], null, 1));
      hasUnsavedEdits = false;
      return DATA_SETS.length;
    }

let dataFolder = null;

async function saveToFolder() {
      if (!window.showDirectoryPicker) {
        alert('Этот браузер не умеет писать в папку. Воспользуйтесь «Скачать базу».');
        return false;
      }
      try {
        if (!dataFolder) dataFolder = await window.showDirectoryPicker({ mode: 'readwrite' });
        const data = collectData();
        for (const name of DATA_SETS) {
          const phil = await dataFolder.getFileHandle(name + '.json', { create: true });
          const w = await phil.createWritable();
          await w.write(JSON.stringify(data[name], null, 1));
          await w.close();
        }
        hasUnsavedEdits = false;
        return true;
      } catch (e) {
        if (e && e.name === 'AbortError') return false;
        console.error('сохранение в папку не удалось:', e);
        alert('Сохранить не удалось: ' + (e && e.message ? e.message : e));
        return false;
      }
    }

// window.addEventListener('beforeunload') @b3c60506
function installUnsavedGuard() {
window.addEventListener('beforeunload', ev => {
      if (!hasUnsaved()) return;
      ev.preventDefault();
      ev.returnValue = '';
    });
}

export { DATA_SETS, collectData, downloadData, hasUnsaved, installUnsavedGuard, markDirty, saveToFolder, trackDirectEdit };
