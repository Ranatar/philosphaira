// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from './modules/core/ns.js';
import { loadData } from './modules/data/load.js';
import './modules/core/graph-index.js';
import { onReady, onLoad } from './modules/core/ready.js';
import { buildConceptToRubrics } from './modules/core/graph-index.js';
import { buildRubricsIndex } from './modules/core/graph-index.js';
import { buildPhilosopherTraditions } from './modules/core/graph-index.js';
import { installStatsModalDismiss } from './modules/stats/modal.js';
import { installStatsEscape } from './modules/stats/modal.js';
import { restoreMetricLayoutMode } from './modules/stats/results.js';
import { installLegendSearchDismiss } from './modules/ui/search-legend.js';
import { installNodeDrag } from './modules/render/interactions.js';
import { installSimulationTick } from './modules/render/simulation.js';
import { installSimulationStatsEnd } from './modules/render/simulation.js';
import { installNodeHover } from './modules/render/interactions.js';
import { installLinkHover } from './modules/render/interactions.js';
import { buildGroupPositions } from './modules/render/grouping.js';
import { installResize } from './modules/render/grouping.js';
import { installUnsavedGuard } from './modules/data/save.js';
import { installModalSearchDismiss } from './modules/modal/search.js';
import { installOverlayDismiss } from './modules/boot-defs.js';
import { installModalKeys } from './modules/boot-defs.js';
import { installHintOver } from './modules/ui/hint.js';
import { installHintOut } from './modules/ui/hint.js';
import { installHintOnScroll } from './modules/ui/hint.js';
import { installHintOnClick } from './modules/ui/hint.js';
import { installSimulationLog } from './modules/render/simulation.js';
import { syncLegendWeightsToggle } from './modules/ui/legend.js';
import { syncLegendDirectionToggle } from './modules/ui/legend.js';
import { installChronologyToggle } from './modules/paths/chronology.js';
import { installChronologyMode } from './modules/paths/chronology.js';
import { showChronologyModeIfOn } from './modules/paths/chronology.js';
import { subscribe } from './modules/core/events.js';
import { rebuildIndexes } from './modules/core/graph-index.js';
import { resetBeyondFilter } from './modules/filters/beyond-filter.js';
import { applyFiltersImmediate } from './modules/filters/filters.js';
import { initializePhilosophyMetrics } from './modules/metrics/link-indexes.js';
import { invalidateEverythingForScope } from './modules/metrics/scope-reset.js';
import { selectConnectionEditConcept } from './modules/modal/connection-edit.js';
import { selectConnectionViewConcept } from './modules/modal/connection-view.js';
import { modalStack, openUniversalModal } from './modules/modal/core.js';
import { renderAuthControls } from './modules/modal/edit-rights.js';
import { closeDetailModal, openEditConceptModal, openEditConnectionModal, showDetailModal } from './modules/modal/entry.js';
import { makeLegendsEditable } from './modules/modal/philosopher-view.js';
import { initPathFinder } from './modules/paths/path-ui.js';
import { resizeCanvas } from './modules/render/canvas-core.js';
import { initGraphEventHandlers } from './modules/render/interactions.js';
import { setPainter } from './modules/render/loop.js';
import { saveOriginalRadii } from './modules/render/metric-visualization.js';
import { draw, updateGraphData } from './modules/render/scene.js';
import { clearSimilarityOverlay } from './modules/render/similarity-overlay.js';
import { pinnedDespiteFilter } from './modules/state/filters.js';
import { closeStatsModal, loadStatsContent, switchStatsView } from './modules/stats/modal.js';
import { renderComparison } from './modules/stats/views/comparison.js';
import { initFilters, markChosenInLegend, updateFilterStats, updatePhilosopherDimming } from './modules/ui/legend.js';
import { restorePanelStates } from './modules/ui/panels.js';
import { initializeCustomSelects } from './modules/widgets/custom-select.js';

export async function boot() {
  await loadData();
  buildConceptToRubrics();
  
  buildRubricsIndex();
  
  rebuildIndexes();
  
  buildPhilosopherTraditions();
  
  installStatsModalDismiss();
  
  installStatsEscape();
  
  restoreMetricLayoutMode();
  
  onLoad(() => {
        saveOriginalRadii();
      });
  
  installLegendSearchDismiss();
  
  onReady(function() {
        // Даем время на создание графа
        setTimeout(initializeCustomSelects, 500);
      });
  
  installNodeDrag();
  
  resizeCanvas();
  
  installSimulationTick();
  
  installSimulationStatsEnd();
  
  initGraphEventHandlers();
  
  installNodeHover();
  
  installLinkHover();
  
  buildGroupPositions();
  
  installResize();
  
  installUnsavedGuard();
  
  installModalSearchDismiss();
  
  setTimeout(makeLegendsEditable, 100);
  
  renderAuthControls();
  
  installOverlayDismiss();
  
  installModalKeys();
  
  console.log("Инициализация графа:", DATA.nodes.length, "узлов,", DATA.links.length, "связей");
  
  initFilters();
  
  subscribe('filters-applied', updateFilterStats);
  
  subscribe('filters-applied', updatePhilosopherDimming);
  
  subscribe('data-changed', () => {
        initializePhilosophyMetrics();
        invalidateEverythingForScope();
      });
  
  subscribe('data-changed', updateFilterStats);
  
  subscribe('data-changed', () => {
        if (typeof S.similarityOverlay !== 'undefined' && S.similarityOverlay) clearSimilarityOverlay();
      });
  
  subscribe('data-changed', () => {
        if (typeof modalStack !== 'undefined') modalStack.length = 0;
      });
  
  subscribe('data-changed', (what) => {
        if (what && what.philosophers) {
          initFilters();
          setTimeout(makeLegendsEditable, 100);
        }
      });
  
  subscribe('data-changed', () => applyFiltersImmediate());
  
  subscribe('data-changed', () => updateGraphData());
  
  subscribe('data-changed', () => {
        if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
      });
  
  subscribe('concept-picked', (mode, type, id) => {
        if (mode === 'view') selectConnectionViewConcept(type, id);
        else selectConnectionEditConcept(type, id);
      });
  
  subscribe('comparison-refresh', () => renderComparison());
  
  subscribe('switch-stats-view', (kind) => switchStatsView(kind));
  
  subscribe('philosophers-chosen', () => markChosenInLegend());
  
  subscribe('selection-cleared', () => {
        // Показ поверх отбора держался ради выделения; выделения нет — нет и
        // нужды в нём. Подписка, а не прямой вызов: отрисовка не должна знать
        // об отборе, иначе выходит круг (замер: четыре модуля в кольце).
        if (pinnedDespiteFilter.size) resetBeyondFilter();
      });
  
  setPainter(draw);
  
  installHintOver();
  
  installHintOut();
  
  installHintOnScroll();
  
  installHintOnClick();
  
  subscribe('close-stats', () => closeStatsModal());
  
  subscribe('close-modals', () => closeDetailModal());
  
  subscribe('open-concept', (node) => showDetailModal(node));
  
  subscribe('open-link', (link) => openUniversalModal('connection', link, 'view'));
  
  subscribe('edit-concept', (id) => openEditConceptModal(id));
  
  subscribe('edit-link', (a, b) => openEditConnectionModal(a, b));
  
  subscribe('stats-stale', () => {
        if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
      });
  
  updateFilterStats();
  
  initializePhilosophyMetrics();
  
  initPathFinder();
  
  restorePanelStates();
  
  installSimulationLog();
  
  syncLegendWeightsToggle();
  
  syncLegendDirectionToggle();
  
  saveOriginalRadii();
  
  console.log("Граф инициализирован. Используйте кнопки для запуска анализа.");
  
  console.log("Текущий режим: веса -", S.useWeightedPaths ? "ВКЛ" : "ВЫКЛ", 
            ", направленность -", S.respectDirection ? "ВКЛ" : "ВЫКЛ");
  
  installChronologyToggle();
  
  installChronologyMode();
  
  showChronologyModeIfOn();
  
  console.log('Обработчики событий хронологии инициализированы');
}
