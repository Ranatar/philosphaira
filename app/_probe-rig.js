// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// Сгенерировано tools/rig.mjs.
import { DATA, S, MET, VIEWS } from './modules/core/ns.js';
import { isSymmetricLink } from './modules/core/link-facts.js';
import { isLinkVisible, isNodeVisible } from './modules/core/visibility.js';
import { DATA_SETS, collectData, hasUnsaved } from './modules/data/save.js';
import { resetBeyondFilter } from './modules/filters/beyond-filter.js';
import { findConnection, getConceptConnections } from './modules/graph/graph-data.js';
import { cancelGraphSelection } from './modules/graph/graph-selection.js';
import { toggleMetricValueMode } from './modules/metrics/format.js';
import { initializePhilosophyMetrics } from './modules/metrics/link-indexes.js';
import { medianNodeDegree, nodeDegreeOf } from './modules/metrics/network.js';
import { handleMetricsScopeChange } from './modules/metrics/scope.js';
import { profileIsMeaningful, profileSimilarity, similarityData, structuralSimilarity } from './modules/metrics/similarity-concepts.js';
import { philosopherSimilarity, philosopherSimilarityData } from './modules/metrics/similarity-philosophers.js';
import { authLogout, closeAuthModal, openAuthModal, submitAuth } from './modules/modal/auth.js';
import { handleConnectionViewSearch, toggleConnectionSearchSection } from './modules/modal/connection-view.js';
import { closeUniversalModal, openUniversalModal, toggleModalMode } from './modules/modal/core.js';
import { openConceptById, openEditConceptModal, openEditConnectionModal } from './modules/modal/entry.js';
import { closeConceptProfileModal, showConceptProfileModal } from './modules/modal/profile-concept.js';
import { closePhilosopherProfileModal, showPhilosopherProfileModal } from './modules/modal/profile-philosopher.js';
import { handleModalSearch } from './modules/modal/search.js';
import { closePathDescriptionsModal, showPathDescriptionsModal } from './modules/paths/path-descriptions.js';
import { findAndShowPath } from './modules/paths/path-ui.js';
import { findShortestPath } from './modules/paths/shortest-path.js';
import { linkDrawAlpha, linkVisualState } from './modules/render/draw-link.js';
import { toggleGrouping } from './modules/render/grouping.js';
import { pickLink, pickNode, toGraph } from './modules/render/picking.js';
import { hasNodeClass } from './modules/render/render-state.js';
import { highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, resetHighlight } from './modules/render/selection.js';
import { clearSimilarityOverlay, showSimilarityOverlay } from './modules/render/similarity-overlay.js';
import { freezeSimulation, unfreezeSimulation } from './modules/render/simulation.js';
import { selectedEdges, selectedNodes } from './modules/state/render.js';
import { closeStatsModal, handleStatsParameterChange, openStatsModal, switchStatsView } from './modules/stats/modal.js';
import { toggleMetricLayout } from './modules/stats/results.js';
import { closeAboutModal, openAboutModal } from './modules/ui/about.js';
import { actionNames } from './modules/ui/actions.js';
import { exportToPNG, exportToSVG } from './modules/ui/export.js';
import { changeFilterMode, deselectAllPhilosophers, deselectAllRubrics, onlyTradition, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, togglePhilosopher } from './modules/ui/legend.js';
import { clearLegendSearch, handleLegendSearch, selectSearchResult, setSearchKind, toggleLegendSearch } from './modules/ui/search-legend.js';
import { handleLegendLinkSearch, pickLinkEnd } from './modules/ui/search-link.js';
import { clearPhilosopherSearch, handleLegendPhilSearch, handlePhilosopherSearch } from './modules/ui/search-philosopher.js';
import { selectCustomOption, showCustomSelectDropdown } from './modules/widgets/custom-select.js';

const A = { DATA, S, MET, VIEWS, DATA_SETS, actionNames, authLogout, cancelGraphSelection, changeFilterMode, clearLegendSearch, clearPhilosopherSearch, clearSimilarityOverlay, closeAboutModal, closeAuthModal, closeConceptProfileModal, closePathDescriptionsModal, closePhilosopherProfileModal, closeStatsModal, closeUniversalModal, collectData, deselectAllPhilosophers, deselectAllRubrics, exportToPNG, exportToSVG, findAndShowPath, findConnection, findShortestPath, freezeSimulation, getConceptConnections, handleConnectionViewSearch, handleLegendLinkSearch, handleLegendPhilSearch, handleLegendSearch, handleMetricsScopeChange, handleModalSearch, handlePhilosopherSearch, handleStatsParameterChange, hasNodeClass, hasUnsaved, highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, initializePhilosophyMetrics, isLinkVisible, isNodeVisible, isSymmetricLink, linkDrawAlpha, linkVisualState, medianNodeDegree, nodeDegreeOf, onlyTradition, openAboutModal, openAuthModal, openConceptById, openEditConceptModal, openEditConnectionModal, openStatsModal, openUniversalModal, philosopherSimilarity, philosopherSimilarityData, pickLink, pickLinkEnd, pickNode, profileIsMeaningful, profileSimilarity, resetBeyondFilter, resetHighlight, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, selectCustomOption, selectSearchResult, selectedEdges, selectedNodes, setSearchKind, showConceptProfileModal, showCustomSelectDropdown, showPathDescriptionsModal, showPhilosopherProfileModal, showSimilarityOverlay, similarityData, structuralSimilarity, submitAuth, switchStatsView, toGraph, toggleConnectionSearchSection, toggleGrouping, toggleLegendSearch, toggleMetricLayout, toggleMetricValueMode, toggleModalMode, togglePhilosopher, unfreezeSimulation };
const FROM_MODULES = { get selectedNodes() { return typeof selectedNodes !== 'undefined' ? selectedNodes : undefined; },
                    get selectedEdges() { return typeof selectedEdges !== 'undefined' ? selectedEdges : undefined; } };

// Приборы обращаются к данным и состоянию через свойства, чтобы видеть
// СВЕЖИЕ значения, а не снимок на миг подключения.
//
// Часть имён живёт то в общем состоянии, то обычной переменной своего
// модуля — это зависит от того, пишут ли в них извне, а раскладка со
// временем меняется. Поэтому смотрим В ОБА МЕСТА: сперва S, потом вывоз.
// Иначе прибор врёт при каждой такой перестановке.
Object.defineProperties(A, {
  nodes: { get: () => DATA.nodes },
  links: { get: () => DATA.links },
  concepts: { get: () => DATA.concepts },
  relations: { get: () => DATA.relations },
  philosophers: { get: () => DATA.philosophers },
  selectedNodes: { get: () => (S.selectedNodes !== undefined ? S.selectedNodes : FROM_MODULES.selectedNodes) },
  selectedEdges: { get: () => (S.selectedEdges !== undefined ? S.selectedEdges : FROM_MODULES.selectedEdges) },
  isStatsModalOpen: { get: () => S.isStatsModalOpen },
  simulation: { get: () => S.simulation },
  renderState: { get: () => S.renderState },
  gfxCanvas: { get: () => S.gfxCanvas },
  tickCount: { get: () => S.tickCount },
});

window.__app = A;
window.__appReady = true;
