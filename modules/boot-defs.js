// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from './core/ns.js';
import { cancelGraphSelection } from './graph/graph-selection.js';
import { closeUniversalModal, modalStack, popModalState } from './modal/core.js';
import { closeDetailModal, closePhilosopherDetailModal } from './modal/entry.js';
import { closeConceptProfileModal } from './modal/profile-concept.js';
import { closePhilosopherProfileModal } from './modal/profile-philosopher.js';
import { closePathDescriptionsModal } from './paths/path-descriptions.js';
import { closeAboutModal } from './ui/about.js';

function closeAllModals() {
      // Окно «О проекте» закрывается наравне с прочими: Escape и щелчок по
      // подложке. Прежде его брал только крестик — оно не входило в этот
      // перечень, а перечень и есть единственное место, куда вписывается
      // всякое новое окно.
      if (typeof closeAboutModal === 'function')       closeAboutModal();
      if (typeof closeDetailModal === 'function')      closeDetailModal();
      if (typeof closePhilosopherDetailModal === 'function')  closePhilosopherDetailModal();
      if (typeof closeConceptProfileModal === 'function')   closeConceptProfileModal();
      if (typeof closePhilosopherProfileModal === 'function') closePhilosopherProfileModal();
      if (typeof closePathDescriptionsModal === 'function')   closePathDescriptionsModal();
      if (typeof closeUniversalModal === 'function')      closeUniversalModal();
    }

// document.getElementById('modalOverlay').addEventListener('click') @fb46dc6c
function installOverlayDismiss() {
document.getElementById('modalOverlay').addEventListener('click', function() {
      // Пока идёт выбор концепции на графе, подложка пропускает клики
      // к канве и закрывать окно не должна (этап 7 спецификации).
      if (S.graphSelectionContext && S.graphSelectionContext.active) return;
      closeAllModals();
    });
}

// document.addEventListener('keydown') @499b7298
function installModalKeys() {
document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (S.graphSelectionContext && S.graphSelectionContext.active) {
          if (typeof cancelGraphSelection === 'function') cancelGraphSelection();
          return;
        }
        closeAllModals();
      }

      // Backspace — шаг назад по истории окон. Escape по-прежнему
      // закрывает всё: это две разные привычки, и смешивать их не надо.
      if (e.key === 'Backspace') {
        const t = e.target;
        const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
                   || t.isContentEditable);
        if (typing) return;
        if (typeof modalStack !== 'undefined' && modalStack.length > 0) {
          e.preventDefault();
          popModalState();
        }
      }
    });
}

export { closeAllModals, installModalKeys, installOverlayDismiss };
