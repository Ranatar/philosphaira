// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';

const DATA_SETS = ['traditions', 'philosophers', 'rubrics',
                         'relationTypes', 'concepts', 'relations'];

let hasUnsavedEdits = false;

function markDirty() { hasUnsavedEdits = true; }

function hasUnsaved() { return hasUnsavedEdits; }

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

// window.addEventListener('beforeunload') @adf47dee
function installUnsavedGuard() {
window.addEventListener('beforeunload', ev => {
      if (!hasUnsavedEdits) return;
      ev.preventDefault();
      ev.returnValue = '';
    });
}

export { DATA_SETS, collectData, dataFolder, deliverFile, downloadData, hasUnsaved, hasUnsavedEdits, installUnsavedGuard, markDirty, saveToFolder };
