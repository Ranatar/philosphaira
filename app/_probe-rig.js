// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// СГЕНЕРИРОВАНО tools/build/rig.mjs — правки вносить ТУДА, не сюда.
//
// Имена, объявленные через let, отданы СВОЙСТВАМИ, а не значениями:
// значение застывает на миге подключения, и прибор читает старое молча.
// Список порождён обходом дерева, а не памятью человека.
import { DATA, S, MET, VIEWS } from './modules/core/ns.js';
import { api, serverMode } from './modules/core/api.js';
import { emit, subscribe } from './modules/core/events.js';
import { isSymmetricLink } from './modules/core/link-facts.js';
import { PERM, can } from './modules/core/perms.js';
import { WEIGHT_WORDS } from './modules/core/relation-types.js';
import { authSession } from './modules/core/session.js';
import { isLinkVisible, isNodeVisible } from './modules/core/visibility.js';
import { lastSubmitResult, lastSubmitted } from './modules/data/backend.js';
import { connectLive, knownGraphVersion, pullGraphSince } from './modules/data/remote.js';
import { DATA_SETS, collectData, hasUnsaved } from './modules/data/save.js';
import { resetBeyondFilter } from './modules/filters/beyond-filter.js';
import { applyFiltersImmediate } from './modules/filters/filters.js';
import { addLinkToGraph, findConnection, getConceptConnections } from './modules/graph/graph-data.js';
import { cancelGraphSelection, selectConceptOnGraph } from './modules/graph/graph-selection.js';
import { toggleMetricValueMode } from './modules/metrics/format.js';
import { initializePhilosophyMetrics } from './modules/metrics/link-indexes.js';
import { calculateBetweennessAsync, medianNodeDegree, nodeDegreeOf } from './modules/metrics/network.js';
import { handleMetricsScopeChange } from './modules/metrics/scope.js';
import { profileIsMeaningful, profileSimilarity, similarityData, structuralSimilarity } from './modules/metrics/similarity-concepts.js';
import { philosopherSimilarity, philosopherSimilarityData } from './modules/metrics/similarity-philosophers.js';
import { authLogout, closeAuthModal, openAuthModal, submitAuth } from './modules/modal/auth.js';
import { applyRelayout, askLayoutRevert, closeCommitsPanel, commitError, commitItems, commitTab, doLayoutRevert, layoutHistoryItems, layoutPlan, layoutRevertTo, loadCommits, loadLayoutHistory, openCommitsPanel, planRelayout, showImpact, switchCommitTab } from './modules/modal/commits.js';
import { lastConflict, rebuildOverCurrent, showConflict } from './modules/modal/conflict.js';
import { handleConnectionViewSearch, toggleConnectionSearchSection } from './modules/modal/connection-view.js';
import { closeUniversalModal, openUniversalModal, toggleModalMode } from './modules/modal/core.js';
import { openConceptById, openEditConceptModal, openEditConnectionModal } from './modules/modal/entry.js';
import { provenanceValue, refreshProvenanceField } from './modules/modal/forms.js';
import { deleteConnection, saveConceptData, saveConnectionData } from './modules/modal/persist.js';
import { closeConceptProfileModal, showConceptProfileModal } from './modules/modal/profile-concept.js';
import { closePhilosopherProfileModal, showPhilosopherProfileModal } from './modules/modal/profile-philosopher.js';
import { handleModalSearch } from './modules/modal/search.js';
import { confirmMfaEnroll, openSecurityModal, refreshSecurityDone, startMfaEnroll } from './modules/modal/security.js';
import { closeUsersPanel, loadUsers, openUsersPanel, userItems, usersError } from './modules/modal/users.js';
import { closePathDescriptionsModal, showPathDescriptionsModal } from './modules/paths/path-descriptions.js';
import { findAndShowPath } from './modules/paths/path-ui.js';
import { findShortestPath } from './modules/paths/shortest-path.js';
import { gfxCanvas, renderState } from './modules/render/canvas-core.js';
import { linkDrawAlpha, linkVisualState } from './modules/render/draw-link.js';
import { toggleGrouping } from './modules/render/grouping.js';
import { pickLink, pickNode, rebuildQuadtree, toGraph } from './modules/render/picking.js';
import { hasNodeClass } from './modules/render/render-state.js';
import { highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, resetHighlight } from './modules/render/selection.js';
import { clearSimilarityOverlay, showSimilarityOverlay } from './modules/render/similarity-overlay.js';
import { freezeSimulation, resetSimulation, unfreezeSimulation } from './modules/render/simulation.js';
import { applyStoredLayout, graphFingerprint, layoutFromStore, selectedEdges, selectedNodes } from './modules/state/render.js';
import { closeStatsModal, handleStatsParameterChange, loadStatsContent, openStatsModal, switchStatsView } from './modules/stats/modal.js';
import { pickObservation, saveObservation } from './modules/stats/observations.js';
import { toggleMetricLayout } from './modules/stats/results.js';
import { closeAboutModal, openAboutModal } from './modules/ui/about.js';
import { actionNames } from './modules/ui/actions.js';
import { exportToPNG, exportToSVG } from './modules/ui/export.js';
import { changeFilterMode, deselectAllPhilosophers, deselectAllRubrics, onlyTradition, resetTradition, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, syncTraditionRows, togglePhilosopher, traditionMembers } from './modules/ui/legend.js';
import { loadNotifications, markAllNotificationsRead, notifyItems, refreshUnread, toggleNotifyPanel, unreadCount } from './modules/ui/notifications.js';
import { clearLegendSearch, handleLegendSearch, selectSearchResult, setSearchKind, toggleLegendSearch } from './modules/ui/search-legend.js';
import { handleLegendLinkSearch, pickLinkEnd } from './modules/ui/search-link.js';
import { clearPhilosopherSearch, handleLegendPhilSearch, handlePhilosopherSearch } from './modules/ui/search-philosopher.js';
import { selectCustomOption, showCustomSelectDropdown } from './modules/widgets/custom-select.js';

const A = { DATA, S, MET, VIEWS, DATA_SETS, PERM, WEIGHT_WORDS, actionNames, addLinkToGraph, api, applyFiltersImmediate, applyRelayout, applyStoredLayout, askLayoutRevert, authLogout, calculateBetweennessAsync, can, cancelGraphSelection, changeFilterMode, clearLegendSearch, clearPhilosopherSearch, clearSimilarityOverlay, closeAboutModal, closeAuthModal, closeCommitsPanel, closeConceptProfileModal, closePathDescriptionsModal, closePhilosopherProfileModal, closeStatsModal, closeUniversalModal, closeUsersPanel, collectData, confirmMfaEnroll, connectLive, deleteConnection, deselectAllPhilosophers, deselectAllRubrics, doLayoutRevert, emit, exportToPNG, exportToSVG, findAndShowPath, findConnection, findShortestPath, freezeSimulation, getConceptConnections, gfxCanvas, graphFingerprint, handleConnectionViewSearch, handleLegendLinkSearch, handleLegendPhilSearch, handleLegendSearch, handleMetricsScopeChange, handleModalSearch, handlePhilosopherSearch, handleStatsParameterChange, hasNodeClass, hasUnsaved, highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, initializePhilosophyMetrics, isLinkVisible, isNodeVisible, isSymmetricLink, layoutFromStore, linkDrawAlpha, linkVisualState, loadCommits, loadLayoutHistory, loadNotifications, loadStatsContent, loadUsers, markAllNotificationsRead, medianNodeDegree, nodeDegreeOf, onlyTradition, openAboutModal, openAuthModal, openCommitsPanel, openConceptById, openEditConceptModal, openEditConnectionModal, openSecurityModal, openStatsModal, openUniversalModal, openUsersPanel, philosopherSimilarity, philosopherSimilarityData, pickLink, pickLinkEnd, pickNode, pickObservation, planRelayout, profileIsMeaningful, profileSimilarity, provenanceValue, pullGraphSince, rebuildOverCurrent, rebuildQuadtree, refreshProvenanceField, refreshSecurityDone, refreshUnread, renderState, resetBeyondFilter, resetHighlight, resetSimulation, resetTradition, saveConceptData, saveConnectionData, saveObservation, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, selectConceptOnGraph, selectCustomOption, selectSearchResult, setSearchKind, showConceptProfileModal, showConflict, showCustomSelectDropdown, showImpact, showPathDescriptionsModal, showPhilosopherProfileModal, showSimilarityOverlay, similarityData, startMfaEnroll, structuralSimilarity, submitAuth, subscribe, switchCommitTab, switchStatsView, syncTraditionRows, toGraph, toggleConnectionSearchSection, toggleGrouping, toggleLegendSearch, toggleMetricLayout, toggleMetricValueMode, toggleModalMode, toggleNotifyPanel, togglePhilosopher, traditionMembers, unfreezeSimulation };

// Живые величины — через посредника: обращение к нему читает переменную
// модуля в тот миг, когда спросили.
const ЖИВЫЕ = {
  get authSession() { return typeof authSession !== 'undefined' ? authSession : undefined; },
  get commitError() { return typeof commitError !== 'undefined' ? commitError : undefined; },
  get commitItems() { return typeof commitItems !== 'undefined' ? commitItems : undefined; },
  get commitTab() { return typeof commitTab !== 'undefined' ? commitTab : undefined; },
  get knownGraphVersion() { return typeof knownGraphVersion !== 'undefined' ? knownGraphVersion : undefined; },
  get lastConflict() { return typeof lastConflict !== 'undefined' ? lastConflict : undefined; },
  get lastSubmitResult() { return typeof lastSubmitResult !== 'undefined' ? lastSubmitResult : undefined; },
  get lastSubmitted() { return typeof lastSubmitted !== 'undefined' ? lastSubmitted : undefined; },
  get layoutHistoryItems() { return typeof layoutHistoryItems !== 'undefined' ? layoutHistoryItems : undefined; },
  get layoutPlan() { return typeof layoutPlan !== 'undefined' ? layoutPlan : undefined; },
  get layoutRevertTo() { return typeof layoutRevertTo !== 'undefined' ? layoutRevertTo : undefined; },
  get notifyItems() { return typeof notifyItems !== 'undefined' ? notifyItems : undefined; },
  get selectedEdges() { return typeof selectedEdges !== 'undefined' ? selectedEdges : undefined; },
  get selectedNodes() { return typeof selectedNodes !== 'undefined' ? selectedNodes : undefined; },
  get serverMode() { return typeof serverMode !== 'undefined' ? serverMode : undefined; },
  get unreadCount() { return typeof unreadCount !== 'undefined' ? unreadCount : undefined; },
  get userItems() { return typeof userItems !== 'undefined' ? userItems : undefined; },
  get usersError() { return typeof usersError !== 'undefined' ? usersError : undefined; },
};

Object.defineProperties(A, {
  nodes: { get: () => DATA.nodes },
  links: { get: () => DATA.links },
  concepts: { get: () => DATA.concepts },
  relations: { get: () => DATA.relations },
  philosophers: { get: () => DATA.philosophers },
  isStatsModalOpen: { get: () => S.isStatsModalOpen },
  simulation: { get: () => S.simulation },
  tickCount: { get: () => S.tickCount },
  authSession: { get: () => ЖИВЫЕ.authSession },
  commitError: { get: () => ЖИВЫЕ.commitError },
  commitItems: { get: () => ЖИВЫЕ.commitItems },
  commitTab: { get: () => ЖИВЫЕ.commitTab },
  knownGraphVersion: { get: () => ЖИВЫЕ.knownGraphVersion },
  lastConflict: { get: () => ЖИВЫЕ.lastConflict },
  lastSubmitResult: { get: () => ЖИВЫЕ.lastSubmitResult },
  lastSubmitted: { get: () => ЖИВЫЕ.lastSubmitted },
  layoutHistoryItems: { get: () => ЖИВЫЕ.layoutHistoryItems },
  layoutPlan: { get: () => ЖИВЫЕ.layoutPlan },
  layoutRevertTo: { get: () => ЖИВЫЕ.layoutRevertTo },
  notifyItems: { get: () => ЖИВЫЕ.notifyItems },
  selectedEdges: { get: () => (S.selectedEdges !== undefined ? S.selectedEdges : ЖИВЫЕ.selectedEdges) },
  selectedNodes: { get: () => (S.selectedNodes !== undefined ? S.selectedNodes : ЖИВЫЕ.selectedNodes) },
  serverMode: { get: () => ЖИВЫЕ.serverMode },
  unreadCount: { get: () => ЖИВЫЕ.unreadCount },
  userItems: { get: () => ЖИВЫЕ.userItems },
  usersError: { get: () => ЖИВЫЕ.usersError },
});

window.__app = A;
window.__appReady = true;
