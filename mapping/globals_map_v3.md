# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 150 120 знаков, 46 212 строк; встроенный скрипт — строки 5910–46210. Составлено 2026-09-25 05:27:03 UTC.

Всего глобальных сущностей: **1101** — функций 701
(из них асинхронных 42), `const` 127, `let` 166,
`var` 14, операторов верхнего уровня 87.
Обработчиков событий 58; вызовов из разметки:
статической 110, порождаемой 168.

Столбец «использует» — глобальные имена, к которым сущность обращается
(×N — число обращений); «используется в» — обратная связь. Обращения из
строк разметки в AST не видны и учтены отдельным столбцом «из разметки».

**Разделы.** [1. Функции](#1-глобальные-функции) ·
[2. Константы и переменные](#2-глобальные-константы-и-переменные) ·
[3. Операторы верхнего уровня](#3-операторы-верхнего-уровня) ·
[4. Обработчики событий](#4-обработчики-событий-навешанные-из-кода) ·
[4б. Обращение по имени](#4б-обращение-к-функциям-по-имени-window) ·
[5. Вызовы из разметки](#5-функции-вызываемые-из-разметки) ·
[6. Разметка построчно](#6-все-обработчики-в-разметке-построчно) ·
[7. Диагностика](#7-диагностика)


## 0. На чём всё держится

Пятнадцать сущностей с наибольшим числом обращений.

| Имя | Вид | Стр. | Обращений | Из скольких сущностей |
|---|---|---|---|---|
| `nodes` | const | 24052 | 131 | 80 |
| `escapeAttr` | function | 42745 | 109 | 28 |
| `conceptById` | const | 24120 | 77 | 46 |
| `ModalContext` | const | 39921 | 75 | 26 |
| `links` | const | 24070 | 66 | 48 |
| `similarityOverlay` | var | 37447 | 65 | 17 |
| `concepts` | const | 6875 | 60 | 52 |
| `renderState` | const | 37427 | 59 | 30 |
| `relations` | const | 12799 | 54 | 48 |
| `emit` | function | 25788 | 54 | 39 |
| `selectedPhilosophers` | let | 24261 | 53 | 18 |
| `_conceptMap` | let | 28675 | 53 | 23 |
| `philosopherConcepts` | const | 24006 | 47 | 29 |
| `relationTypesObj` | const | 24021 | 47 | 32 |
| `useWeightedPaths` | let | 24180 | 47 | 18 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 23908 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 23927 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 23962 | 32 | (positions) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 24038 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 24127 | 51 | () | `linksByConcept`×7, `nodesByPhilosopher`×4, `nodes`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links`, `compareConcepts`, `compareLinks` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 24199 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 24203 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 24236 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 24243 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 24245 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 24267 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 24277 | 23 | () | `nodes` | `stmt075` | — | — |
| `strictChronologyCheck` | function | 24311 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24368 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24379 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24391 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24453 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24502 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24508 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24531 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24543 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24647 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24718 | 271 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `withoutFootnotes`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `emit`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | `applyLinkState` | статич.×1 | — |
| `handlePathArrowHover` | function | 24994 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 25038 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 25077 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 25097 | 7 | () | `emit`, `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 25109 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `withoutFootnotes`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 25239 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 25258 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 25285 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25300 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25318 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25343 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25348 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25366 | 6 | () | `chosenPhilosophers` | `stmt059` | — | — |
| `highlightPhilosopherOnGraph` | function | 25373 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25433 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25463 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25471 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25482 | 33 | () | `relationTypesObj`, `links`, `linkSearch`, `directionMark`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25516 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25540 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25563 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25575 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt060` | статич.×1 | — |
| `buildAboutText` | function | 25587 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25670 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25676 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25682 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25691 | 20 | (el, text) | `hintBox`×9 | `stmt062` | — | — |
| `hideHint` | function | 25712 | 3 | () | `hintBox`×2 | `stmt063`, `stmt064`, `stmt065` | — | — |
| `subscribe` | function | 25748 | 17 | (event, handler, phase) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `initLinkState`, `stmt029`, `stmt032`, `stmt033`, `stmt035`, `stmt046`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt060`, `stmt066`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071`, `stmt072` | — | — |
| `emit` | function | 25788 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `applyFiltersImmediate`×2, `handleMetricsScopeChange`×2, `openPairInComparison`×2, `handleLinkClick`×2, `showSimilarityOverlay`×2, `dispatchClick`×2, `applyServerLayout`, `findAndShowPath`, `clearPathHighlight`, `refreshMetricsIfScoped`, `setInfluenceScope`, `closeStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `renderClosestPairs`, `toggleMetricVisualization`, `selectCustomOption`, `setSimilarityLinks`, `clearSimilarityOverlay`, `highlightCombined`, `submitAuth`, `openUniversalModal`, `closeUniversalModal`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt041` | — | — |
| `debounce` | function | 25806 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 25884 | 30 | (message, duration=…) | — | `showSimilarityOverlay`×6, `handleUniqueChainsMode`×5, `handleChainsMode`×4, `applyLinkState`×2, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt081` | — | — |
| `buildAdjacencyGraph` | function | 25921 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 26003 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 26139 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 26149 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 26198 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 26273 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26463 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `selectionListSets`, `displaySearchResults`, `selectSearchResult`, `pickNode` | — | — |
| `isLinkVisible` | function | 26464 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `selectionListSets`, `exportToSVG`, `paintLinkLayer`, `pickLink` | — | — |
| `applyBasicFilter` | function | 26466 | 52 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26522 | 7 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `handleChainsMode` | async function | 26533 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26596 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26665 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26683 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26691 | 22 | () | `filterMode`×3, `emit`×2, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `applyLinkState`, `selectSearchResult`, `stmt054` | — | — |
| `applyFilters` | function | 26716 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 26750 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 26763 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION` | `stmt045`, `stmt052` | — | — |
| `togglePhilosopher` | function | 26854 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 26883 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 26907 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 26916 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 26922 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 26931 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 26939 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `applyLinkState`×2, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 26963 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt047` | — | — |
| `onlyTradition` | function | 26992 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 26999 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 27009 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 27018 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 27027 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 27036 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 27045 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 27055 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 27064 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 27076 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 27120 | 4 | (mode) | `filterMode`, `applyFilters` | `applyLinkState` | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 27126 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 27136 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt046`, `stmt049`, `stmt073` | — | — |
| `updateProvenanceCoverage` | function | 27163 | 40 | () | `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 27220 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 27221 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 27229 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 27242 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `liveScopeKey` | function | 27268 | 4 | () | `metricsScope`×2, `useWeightedPaths`, `respectDirection` | `applyMetricsScope`, `closeStatsModal` | — | — |
| `applyMetricsScope` | function | 27274 | 36 | (viewName) | `lastScopeKey`×4, `metricsScopeActive`×3, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27439 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27456 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27477 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27511 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27637 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `ensureNetworkProfile`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 27805 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 27817 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 27830 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 27964 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 27978 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 28024 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 28093 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 28105 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 28152 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 28174 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 28281 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 28289 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28319 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28340 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28411 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28419 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28478 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28539 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28545 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28623 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28632 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28686 | 5 | (r) | — | `exportToSVG`×2, `drawLinkSet`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `linkShape`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28697 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28707 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28712 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 28727 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 28746 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 28765 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 28875 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 28883 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 29058 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 29066 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 29192 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 29199 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 29248 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 29255 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29359 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29371 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29382 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29443 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29465 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29472 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29477 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29520 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29527 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29595 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29607 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29666 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29673 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 29724 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 29753 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 29777 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 29782 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 30010 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 30017 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 30060 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 30067 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 30123 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 30130 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 30190 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 30197 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 30246 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 30253 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30311 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30318 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30350 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30360 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30450 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30461 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30493 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30500 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30550 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30557 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30605 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30616 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30680 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30706 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `nodeDegreeOf` | function | 30718 | 7 | (conceptId) | `_relations` | `profileIsMeaningful`, `networkSimilarityData`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `profileIsMeaningful` | function | 30726 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `showSimilarityOverlay`×3, `nearestConcepts`×2, `similarityVerdict`×2, `renderComparison`×2, `similarProfileColumnHtml`×2, `similarNetworkColumnHtml`×2, `similarityThresholds`, `similarConceptsBlock` | — | — |
| `similarityData` | function | 30731 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `similarityThresholds`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 30780 | 9 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `_typeStyleCache`, `_netSimCache`, `_simThresholdCache`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 30798 | 8 | () | `_pairCache`×5, `networkSimilarityData` | `allConceptPairsAsync`, `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 30812 | 63 | (progressCallback) | `_pairCache`×3, `_pairCalculating`×3, `normedDot`×2, `similarityData`, `allConceptPairs`, `PAIRS_CHUNK_ROWS`, `neighborSets`, `typeStyleData`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `fillPairsNetwork` | function | 30876 | 11 | (P) | `normedDot`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 30888 | 9 | (idA, idB) | `similarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 30901 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 30914 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `typeStyleData` | — | — |
| `structuralSimilarity` | function | 30922 | 13 | (idA, idB) | `neighborSets` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `zColumns` | function | 30938 | 15 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `centerRows` | function | 30954 | 6 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `vectorNorm` | function | 30960 | 5 | (v) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `normedDot` | function | 30965 | 6 | (a, na, b, nb) | — | `similarityThresholds`×3, `allConceptPairsAsync`×2, `fillPairsNetwork`, `typeStyleSimilarity`, `networkSimilarity` | — | — |
| `typeStyleData` | function | 30987 | 15 | () | `_typeStyleCache`×4, `_concepts`, `_relations`, `typeProfileOf`, `zColumns`, `centerRows`, `vectorNorm` | `allConceptPairsAsync`, `typeStyleSimilarity`, `similarityThresholds` | — | — |
| `typeStyleSimilarity` | function | 31002 | 6 | (idA, idB) | `normedDot`, `typeStyleData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `metricValueMap` | function | 31034 | 9 | (res) | — | `networkSimilarityData` | — | — |
| `networkSimilarityData` | function | 31044 | 15 | () | `_netSimCache`×5, `betweennessCache`, `pageRankCache`, `closenessCache`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `eigenvectorCache`, `_concepts`, `nodeDegreeOf`, `zColumns`, `centerRows`, `vectorNorm`, `NETWORK_SIM_NAMES`, `metricValueMap` | `ensureNetworkProfile`×2, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkSimilarity`, `networkRoleOf`, `networkProgressPercent`, `similarityThresholds`, `nearestConcepts`, `applyLinkState`, `showSimilarityOverlay`, `forceSimilarColumn` | — | — |
| `networkSimilarity` | function | 31060 | 7 | (idA, idB) | `normedDot`, `networkSimilarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `networkRoleOf` | function | 31071 | 11 | (id) | `NETWORK_ROLE_OF`, `networkSimilarityData` | `similarityVerdict` | — | — |
| `networkProgressPercent` | function | 31092 | 10 | () | `NETWORK_PROGRESS_WEIGHTS`×2, `betweennessCache`, `pageRankCache`, `closenessCache`, `eigenvectorCache`, `networkSimilarityData`, `_netProgress` | `ensureNetworkProfile`, `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `ensureNetworkProfile` | function | 31107 | 38 | (onProgress) | `_netSimPending`×5, `_netProgressListeners`×3, `networkSimilarityData`×2, `_netProgress`×2, `betweennessCache`, `calculateBetweennessAsync`, `pageRankCache`, `calculatePageRank`, `closenessCache`, `calculateClosenessCentrality`, `eigenvectorCache`, `calculateEigenvectorCentrality`, `networkProgressPercent` | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `liveProgressHtml` | function | 31151 | 3 | (pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `updateLiveProgress` | function | 31154 | 4 | (root, pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `similarityNeedsDegree` | function | 31161 | 3 | (kind) | — | `nearestConcepts`×2, `showSimilarityOverlay` | — | — |
| `similarityOf` | function | 31164 | 7 | (kind, idA, idB) | `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity` | `nearestConcepts` | — | — |
| `similarityThresholds` | function | 31180 | 28 | () | `_simThresholdCache`×4, `normedDot`×3, `profileIsMeaningful`, `similarityData`, `typeStyleData`, `networkSimilarityData`, `SIM_VERDICT_HIGH_Q`, `SIM_VERDICT_LOW_Q` | `similarityVerdict` | — | — |
| `nearestConcepts` | function | 31213 | 51 | (conceptId, kind, k, force) | `profileIsMeaningful`×2, `similarityNeedsDegree`×2, `similarityData`, `networkSimilarityData`, `similarityOf` | `similarConceptsBlock`×3, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `rubricUnionSize` | function | 31292 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 31299 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 31390 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 31392 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 31398 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 31419 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 31461 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 31477 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 31496 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 31545 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 31549 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 31555 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31595 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31647 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 31720 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 31724 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 31735 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 31759 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 31776 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 31789 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 31818 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 31823 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 31861 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 31872 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 31881 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt048` | — | — |
| `handleMetricsScopeChange` | function | 31896 | 9 | () | `emit`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyLinkState`×2 | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 31910 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt048`, `stmt074` | — | — |
| `getMetricDescription` | function | 32445 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 32466 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2, `applyLinkState` | статич.×1, динам.×1 | — |
| `provenanceState` | function | 32533 | 6 | (z) | — | `selectionListSets` | — | — |
| `setSelectionProvenance` | function | 32548 | 9 | (value) | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `selectionProvenance`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListSets` | function | 32561 | 61 | () | `selectionPhilCount`×4, `selectionProvenance`×2, `philosophers`, `nodes`, `links`, `isNodeVisible`, `isLinkVisible`, `provenanceState`, `selectionMirrorCount`, `linkHasTwoHeads`, `comparePhilosophers`, `compareConcepts`, `linkIsInternal`, `compareLinks` | `toggleSelectionBodies`, `renderSelectionList` | — | — |
| `openSelectionListModal` | function | 32623 | 12 | () | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `renderSelectionList`, `freezeSimulation` | — | статич.×1 | — |
| `closeSelectionListModal` | function | 32636 | 4 | () | `unfreezeSimulation` | — | статич.×1 | — |
| `toggleSelectionBlock` | function | 32641 | 5 | (kind) | `selectionListOpenBlocks`×3, `renderSelectionList` | — | динам.×2 | — |
| `toggleSelectionBody` | function | 32647 | 5 | (key) | `selectionListOpenBodies`×3, `renderSelectionList` | — | динам.×3 | — |
| `toggleSelectionBodies` | function | 32663 | 11 | (kind) | `selectionListOpenBodies`×3, `selectionListShown`, `selectionListSets`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListMore` | function | 32678 | 4 | (kind) | `SELECTION_LIST_CHUNK`, `selectionListShown`, `renderSelectionList` | — | динам.×1 | — |
| `linkHasTwoHeads` | function | 32702 | 5 | (l) | `relationTypesObj` | `selectionListSets`, `orientLink`, `directionMark`, `linkShape` | — | — |
| `orientLink` | function | 32717 | 12 | (l, isOwnEnd) | `linkHasTwoHeads` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2 | — | — |
| `directionMark` | function | 32730 | 12 | (l) | `linkHasTwoHeads` | `selectionRowRelation`×2, `showFoundLinks` | — | — |
| `selectionLabel` | function | 32746 | 4 | (id) | `conceptById` | `selectionRowRelation`×2 | — | — |
| `selectionRowPhilosopher` | function | 32751 | 15 | (p) | `escapeAttr`×5, `selectionListOpenBodies`, `selectionPhilCount`, `withoutFootnotes` | `renderSelectionList` | — | — |
| `selectionRowConcept` | function | 32774 | 15 | (n) | `escapeAttr`×5, `withoutFootnotes`×2, `philosopherConcepts`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `openSelectionLink` | function | 32802 | 7 | (s, t) | `links`, `openUniversalModal` | — | динам.×1 | — |
| `selectionRowRelation` | function | 32810 | 32 | (l) | `escapeAttr`×8, `directionMark`×2, `selectionLabel`×2, `relationTypesObj`, `conceptById`, `selectionListOpenBodies`, `linkIsInternal`, `otherEndColor`, `withoutFootnotes` | `renderSelectionList` | — | — |
| `renderSelectionList` | function | 32843 | 82 | () | `selectionProvenance`×3, `PROVENANCE_LABELS`×3, `selectionMirrorCount`×2, `conceptById`, `selectionListOpenBlocks`, `SELECTION_LIST_CHUNK`, `selectionListShown`, `selectionListSets`, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation`, `escapeAttr` | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBlock`, `toggleSelectionBody`, `toggleSelectionBodies`, `selectionListMore` | — | — |
| `closeStatsModal` | function | 32926 | 33 | () | `lastScopeKey`×3, `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `emit`, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt066` | статич.×1 | — |
| `handleStatsParameterChange` | function | 32961 | 32 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `emit`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | `applyLinkState`×2 | статич.×2 | — |
| `switchStatsView` | function | 32995 | 16 | (viewName, event) | `emit`, `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `applyLinkState`, `stmt058` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 33013 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 33037 | 21 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `PERM`, `can`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 33064 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 33092 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 33129 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 33136 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent`, `deleteObservation` | — | — |
| `renderObservations` | function | 33160 | 46 | () | `escapeAttr`×7, `observationPicked`×4, `PERM`×3, `can`×3, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `deleteObservation` | async function | 33216 | 18 | (id) | `observationPicked`×2, `loadObservations`, `api`, `escapeAttr` | — | динам.×1 | — |
| `pickObservation` | function | 33235 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 33248 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 33276 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt055`, `stmt072` | — | — |
| `calculateMetricFromModal` | async function | 33363 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 33416 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 33438 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 33444 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `comparePhilosophers` | function | 33460 | 14 | (a, b) | `philosopherByName` | `compareLinks`×2, `selectionListSets`, `sortPhilosophersByBirth`, `compareConcepts`, `pickPhilosophers`, `philosopherTraditionsBlock` | — | — |
| `sortPhilosophersByBirth` | function | 33475 | 3 | (list) | `comparePhilosophers` | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `compareConcepts` | function | 33483 | 4 | (a, b) | `comparePhilosophers` | `rebuildIndexes`, `selectionListSets` | — | — |
| `linkIsInternal` | function | 33513 | 5 | (l) | `conceptById`×2 | `compareLinks`×2, `selectionListSets`, `selectionRowRelation` | — | — |
| `otherEndColor` | function | 33537 | 7 | (l, ownerName) | `conceptById`, `philosopherByName` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `selectionRowRelation` | — | — |
| `compareLinks` | function | 33545 | 12 | (a, b) | `comparePhilosophers`×2, `linkIsInternal`×2, `conceptById` | `rebuildIndexes`, `selectionListSets` | — | — |
| `philosopherYears` | function | 33557 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 33576 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 33602 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 33610 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 33623 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 33631 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 33635 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 33640 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 33670 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 33686 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 33688 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 33701 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 33742 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 33778 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 33854 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 33920 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 33934 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 33940 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML`, `withoutFootnotes` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 34108 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 34138 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 34175 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 34240 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 34256 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 34272 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 34288 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 34304 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 34320 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 34336 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 34356 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 34380 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 34404 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 34428 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 34452 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 34476 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 34500 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 34524 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 34548 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 34573 | 195 | () | `withoutFootnotes`×2, `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 34812 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 34845 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 34912 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 34934 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 34968 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 34973 | 42 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function ⟲ | 35016 | 108 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsKind`×2, `_pairsMinShared`×2, `emit`, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×8 | — |
| `openPairInComparison` | function | 35125 | 5 | (a, b) | `emit`×2, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 35131 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `similarityVerdict` | function | 35186 | 49 | (idA, idB) | `profileIsMeaningful`×2, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `NETWORK_ROLE_WORDS`, `networkSimilarity`, `networkRoleOf`, `SIM_SHARED_HIGH`, `similarityThresholds` | `renderComparison` | — | — |
| `computeComparisonNetwork` | function | 35236 | 7 | () | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `renderComparison` | — | динам.×1 | — |
| `renderComparison` | function | 35244 | 68 | () | `_cmpA`×8, `_cmpB`×8, `conceptById`×2, `profileIsMeaningful`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity`, `similarityVerdict` | `loadStatsContent`×2, `applyLinkState`×2, `computeComparisonNetwork`, `stmt057` | — | — |
| `generateGenerativeContent` | function | 35313 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 35333 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 35353 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 35382 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 35409 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 35429 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 35453 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 35477 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 35501 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 35525 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 35583 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 35626 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 35665 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 35703 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 35748 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 35826 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 35889 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 35931 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt080` | — | — |
| `toggleMetricVisualization` | function | 35944 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 36078 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 36096 | 111 | (metricData, metricName) | `gfxNode`×2, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 36209 | 38 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `philosopherIdByName` | function | 36290 | 4 | (name) | `philosophers` | `currentLinkState`×3 | — | — |
| `philosopherNameById` | function | 36294 | 4 | (id) | `philosophers` | `applyLinkState`×2 | — | — |
| `excludedList` | function | 36300 | 8 | (set, all, toKey) | — | `currentLinkState`×3 | — | — |
| `currentLinkState` | function | 36309 | 63 | () | `ModalContext`×6, `similarityOverlay`×5, `currentStatsView`×4, `philosopherIdByName`×3, `excludedList`×3, `filterMode`×2, `_cmpA`×2, `_cmpB`×2, `_pairsKind`×2, `selectedSourceNode`×2, `selectedTargetNode`×2, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `selectedPhilosophers`, `selectedRelations`, `selectedRubrics` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `linkStateToHash` | function | 36373 | 8 | (st) | `LINK_KEYS` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `hashToLinkState` | function | 36382 | 15 | (hash) | `LINK_KEYS` | `initLinkState`×2 | — | — |
| `syncLinkHash` | function | 36399 | 11 | (push) | `_linkLastHash`×2, `_linkApplying`, `currentLinkState`, `linkStateToHash` | `initLinkState` | — | — |
| `applyLinkState` | function | 36411 | 111 | (st) | `conceptById`×6, `selectedPhilosophers`×3, `selectedRelations`×3, `selectedRubrics`×3, `showTemporaryMessage`×2, `syncPhilosopherCheckboxes`×2, `handleMetricsScopeChange`×2, `handleStatsParameterChange`×2, `renderComparison`×2, `_linkApplying`×2, `philosopherNameById`×2, `selectCustomOption`×2, `openUniversalModal`×2, `rubrics`, `relations`, `philosopherConcepts`, `relationTypesObj`, `filterMode`, `findAndShowPath`, `applyFiltersImmediate`, `changeFilterMode`, `networkSimilarityData`, `currentStatsView`, `openStatsModal`, `switchStatsView`, `_cmpA`, `_cmpB`, `_pairsKind`, `_linkMissed`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `similarityOverlay`, `showSimilarityOverlay`, `setSimilarityLinks`, `openConceptById` | `initLinkState`×2 | — | — |
| `initLinkState` | function | 36523 | 15 | () | `hashToLinkState`×2, `applyLinkState`×2, `subscribe`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `syncLinkHash` | `stmt013` | — | — |
| `showProgress` | function | 36547 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 36560 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 36566 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 36641 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 36661 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 36700 | 86 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `CONTRADICTION_DASH`×3, `nodes`×2, `isNodeVisible`×2, `isReflexiveLink`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `nodeEdgeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 36791 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 36816 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 36845 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 36857 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 36861 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 36865 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 36889 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 36925 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 36967 | 10 | (query) | `philosophers`, `comparePhilosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 36978 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 37005 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 37010 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 37019 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 37029 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 37053 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 37078 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 37088 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 37095 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 37112 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 37127 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 37139 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `applyLinkState`×2 | динам.×1 | — |
| `handleNodeClick` | function | 37198 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 37320 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 37349 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 37417 | 8 | () | `gfxCanvas`×4, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 37457 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function ⟲ | 37469 | 126 | (sourceId, kind) | `showTemporaryMessage`×6, `profileIsMeaningful`×3, `similarityOverlay`×3, `emit`×2, `concepts`, `relations`, `nodes`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarityData`, `networkSimilarity`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `similarityNeedsDegree`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState`, `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 37596 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 37625 | 7 | (mode) | `similarityOverlay`×2, `emit`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState` | динам.×1 | — |
| `nodeLitBySimilarity` | function | 37637 | 9 | (id) | `similarityOverlay`×5, `SIGNED_SIMILARITY` | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 37648 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 37663 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 37676 | 6 | () | `emit`, `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt050` | динам.×1 | — |
| `updateSimilarityLegend` | function | 37683 | 49 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIGNED_SIMILARITY`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 37736 | 1 | (d) | `renderState` | `exportToSVG`, `nodeOuterRadius`, `loopShape`, `renderScene`, `startRadiusAnimation`, `pickNode`, `pickLink` | — | — |
| `nodeLabelDy` | function | 37737 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 37738 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×5, `nodeDrawPass`×3, `nodeEdgeWidth`×2 | — | — |
| `hasLinkClass` | function | 37739 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `nodeDrawPass` | function | 37749 | 6 | (d) | `hasNodeClass`×3, `selectedNodes` | `renderScene`, `pickNode` | — | — |
| `nodeEdgeWidth` | function | 37757 | 16 | (d) | `hasNodeClass`×2, `similarityOverlay`, `selectedNodes` | `renderScene`×3, `exportToSVG`, `nodeOuterRadius`, `linksLayerKey` | — | — |
| `nodeOuterRadius` | function | 37776 | 1 | (d) | `nodeRadius`, `nodeEdgeWidth` | `clippedArc`×2, `loopShape` | — | — |
| `setPainter` | function | 37784 | 1 | (handler) | `painter` | `stmt061` | — | — |
| `requestDraw` | function | 37786 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 37808 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 37819 | 8 | () | `renderState`×2, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 37827 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 37838 | 4 | (d) | `renderState` | `arrowSize`, `linkDrawWidth`, `pickLink` | — | — |
| `linkHoverStrokeWidth` | function | 37842 | 4 | (d) | `renderState` | `linkDrawWidth` | — | — |
| `arcParams` | function | 37848 | 15 | (s, t) | — | `clippedArc` | — | — |
| `arcAngleOfChord` | function | 37881 | 3 | (c, R) | — | `clippedArc`×2, `linkShape`×2, `loopShape` | — | — |
| `clippedArc` | function | 37888 | 10 | (s, t) | `nodeOuterRadius`×2, `arcAngleOfChord`×2, `arcParams` | `linkShape`, `renderScene` | — | — |
| `arrowSize` | function | 37900 | 8 | (l, w) | `arrowMode`, `linkStrokeWidth` | `linkShape` | — | — |
| `arcHead` | function | 37911 | 8 | (g, tipA, baseA, half) | — | `linkShape`×2, `loopShape` | — | — |
| `linkShape` | function | 37924 | 20 | (l, w) | `arcAngleOfChord`×2, `arcHead`×2, `isReflexiveLink`, `linkHasTwoHeads`, `clippedArc`, `arrowSize`, `loopShape` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `loopShape` | function | 37948 | 16 | (l, w) | `nodeRadius`, `nodeOuterRadius`, `arcAngleOfChord`, `arcHead` | `linkShape` | — | — |
| `linkVisualState` | function | 37971 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawWidth` | function | 37979 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawAlpha` | function | 37988 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `exportToSVG`, `drawLinkSet` | — | — |
| `strokeLinkShape` | function | 38023 | 10 | (c, g, width) | — | `drawLinkSet`×2 | — | — |
| `fillLinkHeads` | function | 38034 | 10 | (c, g) | — | `drawLinkSet` | — | — |
| `linkOutOfLayer` | function | 38074 | 4 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 38078 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene`, `pickLink` | — | — |
| `linksLayerKey` | function | 38093 | 23 | (c) | `renderState`×5, `nodes`×3, `links`, `visibleLinkSet`, `arrowMode`, `similarityOverlay`, `nodeEdgeWidth`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 38116 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 38122 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 38146 | 42 | (c, tms, take) | `relationTypesObj`×4, `CONTRADICTION_DASH`×3, `isReflexiveLink`×2, `strokeLinkShape`×2, `links`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `fillLinkHeads`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 38196 | 137 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×5, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `nodeEdgeWidth`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `NODE_PASSES`, `nodeDrawPass`, `clippedArc`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 38334 | 9 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt061` | — | — |
| `startRadiusAnimation` | function | 38345 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 38351 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `storedRecord` | function | 38386 | 5 | (kind, id) | `philosophers`, `concepts`, `relations` | `generateConnectionVisualization`×4, `hasConceptChanges`, `hasConnectionChanges`, `generateConceptEditContent`, `generateConnectionEditContent`, `generateConceptViewContent` | — | — |
| `withoutEmptyOptional` | function | 38397 | 8 | (record) | `OMITTED_WHEN_EMPTY` | `saveConnectionData`×3, `savePhilosopherData`×2, `saveConceptData`×2 | — | — |
| `toGraph` | function | 38406 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `pickLink`, `dispatchMove` | — | — |
| `pickNode` | function | 38412 | 10 | (gx, gy) | `nodes`, `isNodeVisible`, `nodeRadius`, `NODE_PASSES`, `nodeDrawPass` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `pointInTriangle` | function | 38423 | 5 | (x, y, t) | — | `hitLinkShape` | — | — |
| `distToSegment` | function | 38429 | 5 | (x, y, a, b) | — | `hitLinkShape`×3 | — | — |
| `hitLinkShape` | function | 38441 | 16 | (g, w, x, y) | `distToSegment`×3, `pointInTriangle` | `pickLink` | — | — |
| `pickLink` | function | 38462 | 36 | (clientX, clientY) | `links`×2, `DRAW_ORDER`×2, `isLinkVisible`, `gfxCanvas`, `PICK_LINK_WIDTH`, `nodeRadius`, `linkStrokeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawnLive`, `toGraph`, `hitLinkShape` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 38504 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 38520 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 38571 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 38673 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 38696 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 38731 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 38743 | 4 | () | `tickCount`, `layoutSettled` | `dragMoveStarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 38801 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 38832 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 38867 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 38884 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 38891 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 38901 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 38911 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 39011 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 39047 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragMoveStarted` | function | 39225 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 39235 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 39241 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 39254 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 39266 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 39279 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 39292 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `openSelectionListModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 39297 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeSelectionListModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 39335 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 39357 | 14 | () | — | `stmt076` | — | — |
| `toggleGrouping` | function | 39372 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 39449 | 4 | (conceptId) | `conceptById`, `showDetailModal` | `applyLinkState` | динам.×3 | — |
| `similarItemHtml` | function | 39455 | 15 | (x) | `conceptById` | `similarColumnHtml` | — | — |
| `similarForced` | function | 39474 | 3 | (conceptId, kind) | `_forcedSimilar`×2 | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `forceSimilarColumn` | function | 39477 | 9 | (kind, conceptId) | `_forcedSimilar`×3, `networkSimilarityData`, `refreshSimilarColumn`, `computeSimilarNetworkColumn` | — | динам.×1 | — |
| `refreshSimilarColumn` | function | 39486 | 8 | (kind, conceptId) | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `forceSimilarColumn`, `refreshSimilarNetworkColumn` | — | — |
| `forceButtonHtml` | function | 39494 | 4 | (kind, conceptId, caption) | — | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `similarColumnHtml` | function | 39499 | 10 | (title, hint, list, empty, attrs) | `similarItemHtml` | `similarNetworkColumnHtml`×3, `similarProfileColumnHtml`×2, `similarConceptsBlock`×2 | — | — |
| `similarProfileColumnHtml` | function | 39510 | 16 | (conceptId) | `profileIsMeaningful`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `similarNetworkColumnHtml` | function | 39531 | 20 | (conceptId) | `similarColumnHtml`×3, `profileIsMeaningful`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `computeSimilarNetworkColumn` | function | 39552 | 13 | (conceptId) | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `refreshSimilarNetworkColumn` | `forceSimilarColumn` | динам.×1 | — |
| `refreshSimilarNetworkColumn` | function | 39566 | 3 | (conceptId) | `refreshSimilarColumn` | `computeSimilarNetworkColumn` | — | — |
| `similarConceptsBlock` | function | 39570 | 52 | (conceptId) | `nearestConcepts`×3, `_forcedSimilar`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 39651 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 39667 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 39686 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 39692 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 39709 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 39721 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 39796 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 39805 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 39904 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 39935 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 39950 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt043` | динам.×1 | — |
| `modalEntityExists` | function | 39970 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 39988 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 40068 | 1 | (permissions) | `granted` | `setSessionUser` | — | — |
| `can` | function | 40070 | 1 | (permission) | `granted` | `renderCommits`×4, `renderObservations`×3, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` | — | — |
| `setSessionUser` | function | 40074 | 11 | (user, grantedFromServer) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 40088 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 40090 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 40133 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 40135 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 40140 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 40169 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 40201 | 30 | () | `securityError`×3, `securitySecret`, `renderAuthControls`, `refreshEditHints`, `api`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 40232 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 40238 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 40249 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 40256 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 40271 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 40278 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 40294 | 96 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `closeAuthModal`×2, `authNoticeMember`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `emit`, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 40391 | 24 | () | `ModalContext`×2, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 40418 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `authLogout` | — | — |
| `renderAuthControls` | function | 40430 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt040`, `stmt041` | — | — |
| `philRowTip` | function | 40463 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 40469 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt041` | — | — |
| `openUniversalModal` | function | 40485 | 67 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `emit`, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `applyLinkState`×2, `saveConceptData`×2, `saveConnectionData`×2, `openSelectionLink`, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt069` | динам.×26 | — |
| `closeUniversalModal` | function | 40554 | 28 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `emit`, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 40584 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 40603 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 40624 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 40635 | 23 | (original) | `philosopherByName`×2, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 40659 | 20 | (original) | `conceptToRubrics`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 40680 | 28 | (original) | `ModalContext`×2, `relationTypesObj`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 40710 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 40714 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 40724 | 11 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 40736 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 40743 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 40764 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt068` | — | — |
| `showPhilosopherDetailModal` | function | 40768 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 40772 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt067` | — | — |
| `closePhilosopherDetailModal` | function | 40773 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 40775 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 40780 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt070` | динам.×1 | — |
| `openEditConnectionModal` | function | 40787 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `stmt071` | динам.×1 | — |
| `updateGraphData` | function | 40812 | 22 | () | `simulation`×3, `nodes`, `links`, `requestDraw`, `linkLayer`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt053` | — | — |
| `addNodeToGraph` | function | 40835 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 40853 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 40858 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 40870 | 8 | () | `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 40884 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 40903 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 40916 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 40970 | 1 | () | `hasUnsavedEdits` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 40971 | 1 | () | `hasUnsavedEdits` | — | — | — |
| `collectData` | function | 40973 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 40977 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 40989 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 40998 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 41043 | 10 | (cookieName) | — | `api` | — | — |
| `api` | async function | 41054 | 34 | (path, ?) | `serverMode`, `readCookie` | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `deleteObservation`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent`, `toggleEntityHistory`, `revertEntityToVersion` | — | — |
| `detectServerMode` | async function | 41093 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `stmt041` | — | — |
| `sameValue` | function | 41155 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 41170 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 41194 | 17 | (descr, apply) | `PERM`, `can`, `serverMode`, `lastSubmitted`, `sendCommit` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `sendCommit` | async function | 41218 | 58 | (descr, direct) | `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange` | — | — |
| `commitMessageFor` | function | 41278 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 41314 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 41321 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 41326 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 41344 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 41371 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 41385 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 41429 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 41436 | 4 | () | — | — | статич.×1 | — |
| `switchCommitTab` | function | 41441 | 14 | (tab) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 41466 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 41485 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 41496 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 41498 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 41504 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 41523 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 41546 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 41577 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 41581 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `provenanceDiff` | function | 41598 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `footnotesDiff` | function | 41637 | 22 | (changes) | `escapeAttr`×3, `FOOTNOTE_LABELS` | `renderCommits` | — | — |
| `stateInWords` | function | 41660 | 4 | (stateCode) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 41673 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 41689 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 41739 | 74 | () | `escapeAttr`×13, `PERM`×4, `can`×4, `commitItems`×3, `commitTab`×2, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `provenanceDiff`, `footnotesDiff`, `layoutTabHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 41820 | 7 | (count) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 41828 | 17 | (id, verdict) | `emit`, `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 41846 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 41870 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 41891 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 41947 | 8 | () | `unreadCount`×3, `serverMode`, `api`, `renderBell` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 41956 | 7 | () | `notifyItems`×2, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 41964 | 9 | () | `unreadCount`×3, `serverMode` | `refreshUnread`, `stmt033` | — | — |
| `renderNotifyList` | function | 41974 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 41994 | 16 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 42011 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 42019 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt034` | — | — |
| `markAllNotificationsRead` | async function | 42029 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 42061 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt035` | — | — |
| `showConflict` | function | 42078 | 31 | (descr, clashes) | `escapeAttr`×5, `reportSubmit`×2, `lastConflict` | `stmt029` | — | — |
| `rebuildOverCurrent` | async function | 42115 | 22 | () | `reportSubmit`×2, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `api`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | — | статич.×1 | — |
| `replaceEntity` | function | 42152 | 9 | (set, id, record) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 42166 | 18 | (increment) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 42186 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `revertEntityToVersion`, `stmt041` | — | — |
| `connectLive` | function ⟲ | 42222 | 33 | () | `liveSocket`×5, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt041` | — | — |
| `rebuildDerived` | function | 42279 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 42323 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 42341 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 42349 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 42374 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 42428 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 42460 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt043`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 42480 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `historyBlock` | function | 42538 | 17 | (kind, entityId) | `escapeAttr`×4, `serverMode` | `generateConnectionViewContent`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `toggleEntityHistory` | async function | 42556 | 18 | (kind, entityId) | `historyBusy`×3, `historyFor`×2, `historyItems`×2, `renderEntityHistory`×2, `api`, `toggleSubsection` | `revertEntityToVersion`×2 | динам.×1 | — |
| `renderEntityHistory` | function | 42580 | 39 | (kind, entityId) | `escapeAttr`×10, `historyItems`×2, `PERM`, `can` | `toggleEntityHistory`×2 | — | — |
| `revertEntityToVersion` | async function | 42620 | 20 | (kind, entityId, version) | `toggleEntityHistory`×2, `api`, `pullGraphSince`, `historyFor`, `historyItems` | — | динам.×1 | — |
| `provenanceBlock` | function | 42641 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `withoutFootnotes` | function | 42681 | 4 | (text) | `FOOTNOTE_MARK_SOURCE` | `generatePhilosopherViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectionRowConcept`×2, `generateTensionContent`×2, `generateConceptViewContent`×2, `selectionRowPhilosopher`, `selectionRowRelation`, `generateMetricResults`, `stmt024`, `stmt025` | — | — |
| `footnoteOrder` | function | 42687 | 9 | (...texts) | `FOOTNOTE_MARK_SOURCE` | `generateConnectionVisualization`×2, `insertFootnote`, `refreshFootnoteRows`, `footnotesValue`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotedText` | function | 42698 | 10 | (text, order, notes) | `FOOTNOTE_MARK_SOURCE` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotesBlock` | function | 42711 | 11 | (notes, order) | `FOOTNOTE_LABELS`, `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `installFootnoteLinks` | function | 42727 | 16 | () | `lastFootnoteHost`, `refreshFootnoteRows` | `stmt037` | — | — |
| `escapeAttr` | function | 42745 | 4 | (s) | — | `renderCommits`×13, `renderEntityHistory`×10, `selectionRowRelation`×8, `renderUsers`×8, `renderObservations`×7, `compareObservationsInPanel`×6, `selectionRowPhilosopher`×5, `selectionRowConcept`×5, `layoutHistoryHtml`×5, `showConflict`×5, `layoutTabHtml`×4, `historyBlock`×4, `provenanceDiff`×3, `footnotesDiff`×3, `renderNotifyList`×3, `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `renderSelectionList`, `deleteObservation`, `confirmMfaEnroll`, `provenanceBlock`, `footnotesBlock`, `provenanceField`, `footnoteRow`, `generateConnectionEditContent` | динам.×13 | — |
| `relationIndexById` | function | 42762 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 42770 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 42788 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 42829 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 42836 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 42837 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 42839 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 42848 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `provenanceDriftWarning` | function | 43000 | 10 | (prev, next) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 43011 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 43030 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 43048 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 43058 | 107 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `withoutEmptyOptional`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields`, `footnotesValue` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 43166 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 43214 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 43223 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 43231 | 82 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `withoutEmptyOptional`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `philosopherByName`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `footnotesValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 43328 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 43364 | 98 | () | `ModalContext`×6, `relations`×5, `withoutEmptyOptional`×3, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields`, `footnotesValue` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 43463 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 43538 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 43565 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 43584 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 43606 | 4 | (line, state) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `footnoteRow` | function | 43612 | 12 | (note) | `FOOTNOTE_LABELS`, `FOOTNOTE_STATE_ORDER`, `escapeAttr` | `footnotesField`, `insertFootnote` | — | — |
| `footnotesField` | function | 43625 | 13 | (record) | `footnoteRow` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `footnoteHosts` | function | 43642 | 4 | () | — | `insertFootnote`, `removeFootnote`, `refreshFootnoteRows`, `footnotesValue` | — | — |
| `insertFootnote` | function | 43647 | 22 | () | `lastFootnoteHost`×2, `footnoteOrder`, `footnoteRow`, `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `removeFootnote` | function | 43670 | 7 | (id) | `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `refreshFootnoteRows` | function | 43680 | 19 | () | `footnoteOrder`, `footnoteHosts` | `installFootnoteLinks`, `insertFootnote`, `removeFootnote` | динам.×1 | — |
| `footnotesValue` | function | 43701 | 17 | () | `FOOTNOTE_LABELS`, `footnoteOrder`, `footnoteHosts` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData`, `footnotesChanged` | — | — |
| `footnotesChanged` | function | 43720 | 5 | (record) | `footnotesValue` | `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | — | — |
| `needsCitation` | function | 43726 | 3 | (state) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 43741 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 43751 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 43771 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 43789 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 43796 | 118 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `provenanceField`, `footnotesField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 43919 | 133 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `storedRecord`, `getConceptConnections`, `provenanceField`, `footnotesField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 44060 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 44101 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 44127 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 44137 | 98 | (connectionData) | `conceptById`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `storedRecord`, `WEIGHT_OPTIONS`, `escapeAttr`, `provenanceField`, `footnotesField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 44240 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 44270 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt056` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 44289 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 44303 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 44325 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 44329 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 44348 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 44357 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 44364 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 44388 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 44403 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 44464 | 75 | (sourceNode, targetNode, connectionData) | `storedRecord`×4, `conceptPlate`×3, `relationHint`×2, `footnoteOrder`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `footnotedText`, `footnotesBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 44540 | 85 | (connectionData) | `conceptById`×2, `ModalContext`×2, `historyBlock`, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 44637 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 44657 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 44700 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt056` | динам.×1 | — |
| `updateConnectionVisualization` | function | 44734 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 44756 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 44780 | 259 | (conceptData) | `relationTypesObj`×4, `philosopherConcepts`×3, `conceptToRubrics`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `withoutFootnotes`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `storedRecord`, `similarConceptsBlock`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 45041 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 45057 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 45068 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 45107 | 14 | (sectionId) | — | `toggleEntityHistory` | динам.×4 | — |
| `gotoNodeFromModal` | function | 45123 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 45148 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 45179 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 45190 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 45225 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `comparePhilosophers`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 45264 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 45269 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 45305 | 488 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×12, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `withoutFootnotes`×4, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `philosopherConcepts`×2, `links`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 45795 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 45811 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 45847 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 45879 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt039`, `stmt052` | — | — |
| `closeAllModals` | function | 45986 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt042`, `stmt043` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5915 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 6037 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `selectionListSets`, `philosopherIdByName`, `philosopherNameById`, `pickPhilosophers`, `storedRecord`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6755 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `currentLinkState`, `applyLinkState`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6835 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6875 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12799 | массив (2720) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `applyLinkState`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 23899 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 23997 | литерал null | — | `applyStoredLayout`×2, `stmt081`×2 |
| `philosopherIdToName` | const | 24000 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 24006 | объект (0) | — | `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generateConceptViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `generatePhilosopherViewContent`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `selectionRowConcept`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 24015 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 24021 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `linkHasTwoHeads`, `selectionRowRelation`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 24046 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 24052 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `linksLayerKey`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `selectionListSets`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `pickNode`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt044` |
| `links` | const | 24070 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `selectionListSets`, `openSelectionLink`, `exportToSVG`, `similarityLinkCount`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt044` |
| `conceptToRubrics` | const | 24082 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 24088 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 24120 | new Map | — | `generatePhilosopherViewContent`×12, `applyLinkState`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `linkIsInternal`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `selectionLabel`, `selectionRowRelation`, `renderSelectionList`, `otherEndColor`, `compareLinks`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarItemHtml`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 24121 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `hasPhilosopherChanges`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `comparePhilosophers`, `otherEndColor`, `philosopherYears`, `showPhilosopherProfileModal`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 24122 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 24123 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 24124 | new Map | — | `rebuildIndexes`×4, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 24125 | new Map | — | `rebuildIndexes`×7, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 24180 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `liveScopeKey`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt078`, `stmt083` |
| `respectDirection` | let | 24181 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `liveScopeKey`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt079`, `stmt083` |
| `skipTypologicalInPaths` | let | 24198 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 24214 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 24255 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt085` |
| `MATURITY_AGE` | const | 24258 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 24261 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `applyLinkState`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `currentLinkState`, `deletePhilosopher` |
| `selectedRelations` | let | 24262 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `applyLinkState`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations`, `currentLinkState` |
| `philosopherTraditions` | const | 24265 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 24271 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `applyLinkState`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics`, `currentLinkState` |
| `filterMode` | let | 24274 | строка | — | `applyFiltersImmediate`×3, `currentLinkState`×2, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode`, `applyLinkState` |
| `arrowHoverTimer` | let | 24991 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 24992 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 25106 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 25256 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 25283 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25362 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25431 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25561 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt060` |
| `hintBox` | let | 25689 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 25723 | массив (19) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 25744 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 25746 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 25821 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 25975 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 26137 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 26279 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26460 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26461 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26714 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26721 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 26744 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 26869 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 27216 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 27217 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 27218 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 27257 | литерал null | — | `applyMetricsScope`×4, `closeStatsModal`×3 |
| `cachesMatchLive` | let | 27267 | литерал true | — | `applyMetricsScope`, `closeStatsModal` |
| `FORMULA_VERSIONS` | const | 27331 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27367 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27416 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27630 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27631 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 27823 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 27824 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 27970 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 27971 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 28099 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 28161 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 28162 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 28163 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 28172 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28527 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28528 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28530 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28672 | литерал null | — | `philosopherSimilarityData`×4, `metricDescriptions`×3, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `typeStyleData`, `networkSimilarityData`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28673 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `typeStyleData`, `generativityScores`, `metricDescriptions`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28674 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28675 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28676 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28677 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28678 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28679 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 28762 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 28880 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 29063 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 29197 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 29253 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29422 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29430 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29433 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29435 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29437 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29525 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29600 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29605 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29671 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 29729 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 29744 | объект (3) | — | — |
| `_tensionScales` | let | 29750 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 29751 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 30015 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 30065 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 30128 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 30195 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 30251 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30316 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30355 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30459 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30498 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30555 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30610 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30689 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30705 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 30729 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 30793 | литерал null | — | `allConceptPairs`×5, `allConceptPairsAsync`×3, `invalidateSimilarityCache` |
| `_pairCalculating` | let | 30794 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 30810 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 30900 | литерал null | — | `neighborSets`×3 |
| `_typeStyleCache` | let | 30986 | литерал null | — | `typeStyleData`×4, `invalidateSimilarityCache` |
| `NETWORK_SIM_NAMES` | const | 31021 | массив (8) | — | `networkSimilarityData` |
| `NETWORK_ROLE_OF` | const | 31023 | объект (8) | — | `networkRoleOf` |
| `NETWORK_ROLE_WORDS` | const | 31028 | объект (4) | — | `similarityVerdict` |
| `_netSimCache` | let | 31031 | литерал null | — | `networkSimilarityData`×5, `invalidateSimilarityCache` |
| `_netSimPending` | let | 31032 | литерал null | — | `ensureNetworkProfile`×5 |
| `NETWORK_PROGRESS_WEIGHTS` | const | 31089 | объект (4) | — | `networkProgressPercent`×2 |
| `_netProgress` | let | 31090 | объект (4) | — | `ensureNetworkProfile`×2, `networkProgressPercent` |
| `_netProgressListeners` | const | 31091 | new Set | — | `ensureNetworkProfile`×3 |
| `SIGNED_SIMILARITY` | const | 31160 | new Set | — | `nodeLitBySimilarity`, `updateSimilarityLegend` |
| `SIM_VERDICT_HIGH_Q` | const | 31176 | литерал 0.9 | — | `similarityThresholds` |
| `SIM_VERDICT_LOW_Q` | const | 31177 | литерал 0.1 | — | `similarityThresholds` |
| `SIM_SHARED_HIGH` | const | 31178 | литерал 3 | — | `similarityVerdict` |
| `_simThresholdCache` | let | 31179 | литерал null | — | `similarityThresholds`×4, `invalidateSimilarityCache` |
| `PHIL_SIM_MIN_CONCEPTS` | const | 31272 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 31291 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 31297 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 31447 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 31456 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 31488 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 31489 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 31494 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31593 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31639 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31644 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31645 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 31733 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 31771 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 31859 | строка | — | `liveScopeKey`×2, `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 31987 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×3, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `_relations`, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 32462 | литерал null | — | `openStatsModal`×4, `currentLinkState`×4, `handleStatsParameterChange`×3, `stmt055`×2, `stmt072`×2, `effectiveScopeFlags`, `switchStatsView`, `applyLinkState` |
| `isStatsModalOpen` | let | 32463 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt055`, `stmt072` |
| `selectionListOpenBlocks` | let | 32519 | new Set | — | `toggleSelectionBlock`×3, `renderSelectionList` |
| `selectionListOpenBodies` | let | 32520 | new Set | — | `toggleSelectionBody`×3, `toggleSelectionBodies`×3, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` |
| `SELECTION_LIST_CHUNK` | const | 32521 | литерал 400 | — | `setSelectionProvenance`×3, `openSelectionListModal`×3, `selectionListMore`, `renderSelectionList` |
| `selectionListShown` | let | 32522 | объект (3) | — | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBodies`, `selectionListMore`, `renderSelectionList` |
| `selectionProvenance` | let | 32525 | строка | — | `renderSelectionList`×3, `selectionListSets`×2, `setSelectionProvenance` |
| `PROVENANCE_LABELS` | const | 32540 | объект (5) | — | `renderSelectionList`×3 |
| `selectionPhilCount` | let | 32558 | объект (0) | — | `selectionListSets`×4, `selectionRowPhilosopher` |
| `selectionMirrorCount` | let | 32559 | литерал 0 | — | `renderSelectionList`×2, `selectionListSets` |
| `observationItems` | let | 33126 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 33127 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `deleteObservation`×2, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 33405 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 33601 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 33620 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 33621 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 33646 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 33667 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 33668 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 33777 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 33790 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 33914 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 34773 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 34773 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 34785 | строка | — | `renderClosestPairs`×2, `currentLinkState`×2, `applyLinkState` |
| `_pairsMinDegree` | var | 34786 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 34787 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 34788 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 34789 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 34791 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 34791 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 34809 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 34910 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 35883 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 35884 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 35885 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 35886 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `LINK_KEYS` | const | 36280 | объект (14) | — | `linkStateToHash`, `hashToLinkState` |
| `_linkApplying` | let | 36286 | литерал false | — | `applyLinkState`×2, `syncLinkHash` |
| `_linkMissed` | let | 36287 | массив (0) | — | `applyLinkState` |
| `_linkLastHash` | let | 36288 | литерал null | — | `syncLinkHash`×2, `applyLinkState`, `initLinkState` |
| `selectedSourceNode` | let | 37050 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 37051 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 37181 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 37194 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 37195 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 37196 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 37317 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 37318 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 37394 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 37395 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 37404 | вызов document.getElementById() | — | `resizeCanvas`×4, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 37405 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 37406 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `PICK_LINK_WIDTH` | const | 37413 | литерал 10 | — | `pickLink` |
| `dpr` | let | 37415 | выражение | — | `paintLinkLayer`×4, `draw`×4, `resizeCanvas`×3 |
| `renderState` | const | 37427 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `draw`, `startRadiusAnimation`, `toGraph`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 37441 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowSize`, `linksLayerKey` |
| `uniformLinkWidthActive` | var | 37442 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 37447 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `currentLinkState`×5, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt050`×2, `applyLinkState`, `clearSimilarityOverlay`, `nodeEdgeWidth`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 37453 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 37454 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 37733 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 37734 | литерал 1 | — | `renderScene` |
| `NODE_PASSES` | const | 37745 | массив (3) | — | `renderScene`, `pickNode` |
| `drawScheduled` | let | 37779 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 37783 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 37800 | литерал false | — | `ensureAnimLoop`×3 |
| `CONTRADICTION_DASH` | const | 38019 | объект (3) | — | `exportToSVG`×3, `drawLinkSet`×3 |
| `DRAW_ORDER` | const | 38045 | массив (5) | — | `pickLink`×2, `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 38058 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 38064 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 38194 | литерал 3 | — | `renderScene` |
| `OMITTED_WHEN_EMPTY` | const | 38396 | массив (3) | — | `withoutEmptyOptional` |
| `nodeHandlers` | const | 38502 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 38502 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 38544 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 38556 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 38566 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 38574 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 38646 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 38647 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 38649 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 38670 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 38676 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragMoveStarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt077` |
| `maxTicks` | let | 38732 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 38788 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `nodeDrawPass`, `nodeEdgeWidth`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 38791 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 38799 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 38799 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 39060 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 39061 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 39290 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 39316 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 39317 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 39318 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 39319 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 39320 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 39321 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 39332 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `_forcedSimilar` | let | 39473 | объект (2) | — | `forceSimilarColumn`×3, `similarForced`×2, `similarConceptsBlock`×2 |
| `PROFILE_METRICS` | const | 39629 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 39685 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 39921 | объект (4) | — | `currentLinkState`×6, `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 39932 | массив (0) | — | `pushModalState`×5, `stmt043`×2, `stmt051`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 39933 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 40027 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 40028 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 40029 | объект (1) | — | `setSessionUser`, `renderAuthControls` |
| `authModalKind` | let | 40030 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 40048 | вызов Object.freeze() | — | `renderCommits`×4, `renderObservations`×3, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` |
| `granted` | let | 40066 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 40131 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `pinnedVisibleNodes` | const | 40810 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 40966 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 40968 | литерал false | — | `markDirty`, `hasUnsaved`, `downloadData`, `saveToFolder`, `stmt028` |
| `dataFolder` | let | 40996 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 41041 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationBar`, `loadObservations`, `api`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `historyBlock`, `commitReasonField` |
| `lastSubmitted` | let | 41192 | литерал null | — | `submitChange` |
| `userItems` | let | 41311 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 41312 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 41425 | строка | — | `switchCommitTab`×4, `renderCommits`×2, `loadCommits` |
| `commitItems` | let | 41426 | массив (0) | — | `loadCommits`×3, `renderCommits`×3 |
| `commitError` | let | 41427 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 41463 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 41464 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 41483 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 41494 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 41568 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `LAYOUT_KINDS` | const | 41671 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 41944 | литерал 0 | — | `refreshUnread`×3, `renderBell`×3 |
| `notifyItems` | let | 41945 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 42149 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 42256 | литерал null | — | `connectLive`×5, `stmt036`×2 |
| `liveRetry` | let | 42257 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 42258 | литерал false | — | `connectLive`, `stmt036` |
| `lastConflict` | let | 42346 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 42369 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 42371 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 42426 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 42494 | массив (3) | — | `generateConnectionEditContent` |
| `historyFor` | let | 42523 | литерал null | — | `toggleEntityHistory`×2, `revertEntityToVersion` |
| `historyItems` | let | 42524 | массив (0) | — | `toggleEntityHistory`×2, `renderEntityHistory`×2, `revertEntityToVersion` |
| `historyBusy` | let | 42525 | литерал false | — | `toggleEntityHistory`×3 |
| `FOOTNOTE_MARK_SOURCE` | const | 42673 | TaggedTemplateExpression | — | `withoutFootnotes`, `footnoteOrder`, `footnotedText` |
| `FOOTNOTE_LABELS` | const | 42676 | объект (3) | — | `footnotesDiff`, `footnotesBlock`, `footnoteRow`, `footnotesValue` |
| `FOOTNOTE_STATE_ORDER` | const | 42678 | массив (3) | — | `footnoteRow` |
| `lastFootnoteHost` | let | 42726 | литерал null | — | `insertFootnote`×2, `installFootnoteLinks` |
| `GROUNDING_TYPES` | const | 42785 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 43531 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 44345 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 45066 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 45809 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 45845 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 46161 | вызов document.getElementById() | — | `stmt078`×2 |
| `legendDirectionToggle` | const | 46163 | вызов document.getElementById() | — | `stmt079`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 24001 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 24007 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 24016 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 24022 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 24047 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 24083 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 24089 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 24178 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 24266 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 33347 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 33356 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 33915 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 36249 | 6 | `window.addEventListener('load')` | `saveOriginalRadii`, `initLinkState` |
| stmt014 | обработчик | 36943 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 37165 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 38583 | 46 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `requestDraw`, `pickNode`, `gfxZoom`, `dragMoveStarted`, `dragended` |
| stmt017 | вызов | 38630 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 38701 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 38705 | 15 | `if (layoutFromStore) { // ЭНЕРГИЯ ГАСИТСЯ ВМЕСТЕ С ОСТАНОВОМ. Симуляци…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 38748 | 14 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `requestDraw`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 38774 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 38776 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 38881 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 39063 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode`, `withoutFootnotes` |
| stmt025 | обработчик | 39092 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges`, `withoutFootnotes` |
| stmt026 | построение | 39323 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 39412 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 41022 | 5 | `window.addEventListener('beforeunload')` | `hasUnsavedEdits` |
| stmt029 | вызов | 41295 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 41401 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 41919 | 12 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `revertCommitFromPanel`, `showImpact` |
| stmt032 | вызов | 42037 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 42038 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | обработчик | 42043 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt035 | вызов | 42076 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt036 | обработчик | 42261 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt037 | вызов | 42743 | 1 | `installFootnoteLinks()` | `installFootnoteLinks` |
| stmt038 | обработчик | 44629 | 7 | `document.addEventListener('click')` | — |
| stmt039 | вызов | 45961 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt040 | вызов | 45962 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt041 | вызов | 45967 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt042 | обработчик | 46001 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt043 | обработчик | 46009 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt044 | вызов | 46033 | 1 | `console.log()` | `nodes`, `links` |
| stmt045 | вызов | 46034 | 1 | `initFilters()` | `initFilters` |
| stmt046 | вызов | 46037 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt047 | вызов | 46042 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt048 | вызов | 46051 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt049 | вызов | 46056 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt050 | вызов | 46060 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt051 | вызов | 46063 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt052 | вызов | 46066 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt053 | вызов | 46091 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt054 | вызов | 46092 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt055 | вызов | 46093 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt056 | вызов | 46100 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt057 | вызов | 46104 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt058 | вызов | 46105 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt059 | вызов | 46106 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt060 | вызов | 46107 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt061 | вызов | 46114 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt062 | обработчик | 46116 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt063 | обработчик | 46120 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt064 | обработчик | 46124 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt065 | обработчик | 46128 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt066 | вызов | 46129 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt067 | вызов | 46130 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt068 | вызов | 46132 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt069 | вызов | 46133 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt070 | вызов | 46134 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt071 | вызов | 46135 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt072 | вызов | 46137 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt073 | вызов | 46141 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt074 | вызов | 46143 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt075 | вызов | 46146 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt076 | вызов | 46149 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt077 | обработчик | 46152 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt078 | условие | 46162 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt079 | условие | 46164 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt080 | вызов | 46167 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt081 | условие | 46172 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt082 | вызов | 46174 | 1 | `console.log()` | — |
| stmt083 | вызов | 46175 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt084 | обработчик | 46183 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt085 | обработчик | 46189 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt086 | условие | 46204 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt087 | вызов | 46208 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 25857 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 33347 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 33356 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 36249 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 36529 | `popstate` | `window` | addEventListener | функция на месте | `initLinkState` |
| 36943 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 37061 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 37165 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 38574 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 38583 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38583 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38583 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38748 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 38774 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 38776 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 38868 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 38869 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 38870 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 38871 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 38878 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 39063 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39063 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39092 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39092 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39092 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39412 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 40114 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 40195 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 41022 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 41401 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 41919 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 42043 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt034` |
| 42231 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42241 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42246 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42261 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt036` |
| 42731 | `mouseover` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42732 | `mouseout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42733 | `focusin` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42737 | `focusout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42738 | `click` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42739 | `input` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 44295 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44296 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44629 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt038` |
| 44767 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 45892 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 45922 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 45937 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46001 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt042` |
| 46009 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt043` |
| 46116 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt062` |
| 46120 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt063` |
| 46124 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt064` |
| 46128 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt065` |
| 46152 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt077` |
| 46183 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt084` |
| 46189 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt085` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27458 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27471 | `installMetricScopeWrappers` | `window[name]` | запись |
| 36056 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 39992 | `modalContentFor` | `window[name]` | чтение |
| 39998 | `modalContentFor` | `window[fallbackName]` | чтение |


Имена функций, встречающиеся строкой или ключом объекта:

| Имя функции | Раз | Где |
|---|---|---|
| `abstractionIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualComplexityIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualContinuityIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualFertilityIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `criticalPowerIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `deductiveIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `dialogicalIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `foundationalIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `generativeIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `influenceIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `instrumentalIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `internalCoherenceIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `paradigmShiftIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `problemGenerationIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `revolutionaryIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `syntheticIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `transformationIndex` | 6 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `tensionIndex` | 4 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка), `toggleMetricVisualization` (строка) |
| `calculateBetweenness` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateClosenessCentrality` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateEigenvectorCentrality` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateLocalCohesion` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculatePageRank` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateRichClubCoefficient` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateWeightedClustering` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateWeightedDegree` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherHistoricalReachIndex` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherInterdisciplinaryIndex` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherSystematicIndex` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `temporalInfluencePattern` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `traditionBridgingIndex` | 3 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateClusteringCoefficient` | 2 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта) |
| `deductiveDepth` | 2 | `FORMULA_VERSIONS` (ключ объекта), `METRIC_FLAGS` (ключ объекта) |
| `securityError` | 1 | `securityError` (строка) |
| `authError` | 1 | `authError` (строка) |
| `savePhilosopherData` | 1 | `generatePhilosopherEditContent` (строка) |
| `deletePhilosopher` | 1 | `generatePhilosopherEditContent` (строка) |
| `saveConceptData` | 1 | `generateConceptEditContent` (строка) |
| `deleteConcept` | 1 | `generateConceptEditContent` (строка) |
| `saveConnectionData` | 1 | `generateConnectionEditContent` (строка) |
| `deleteConnection` | 1 | `generateConnectionEditContent` (строка) |


## 5. Функции, вызываемые из разметки

«Статич.» — атрибуты в разметке страницы; «динам.» — атрибуты внутри
строк и шаблонов, которые собирает код. «Порождается в» — сущности,
в теле которых эта разметка написана.

| Имя | Определена глобально | Статич. | Динам. | Атрибуты | Порождается в |
|---|---|---|---|---|---|
| `switchStatsView` | да | 40 | 1 | `onclick` | `showConceptProfileModal` |
| `openUniversalModal` | да | 0 | 26 | `onclick` | `conceptPlate`, `findAndShowPath`, `generateConceptEditContent`, `generateConceptViewContent`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent`, `linkArrow`, `philosopherTraditionsBlock`, `selectionRowConcept`, `selectionRowPhilosopher`, `showAllConcepts`, `showConceptProfileModal`, `showPathDescriptionsModal`, `showPhilosopherProfileModal` |
| `escapeAttr` | да | 0 | 13 | `onclick` | `generatePhilosopherEditContent`, `historyBlock`, `layoutHistoryHtml`, `observationBar`, `renderEntityHistory`, `renderObservations`, `selectionRowConcept`, `selectionRowPhilosopher`, `selectionRowRelation` |
| `renderClosestPairs` | да | 0 | 8 | `onchange`, `onclick`, `oninput` | `generateClosestPairsContent` |
| `setTimeout` | **НЕТ** | 0 | 6 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `closeUniversalModal` | да | 1 | 3 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `modalActions` |
| `closeConceptProfileModal` | да | 1 | 3 | `onclick` | `showConceptProfileModal` |
| `toggleSection` | да | 4 | 0 | `onclick` | — |
| `findConnection` | да | 0 | 4 | `onclick` | `findAndShowPath`, `generateConceptEditContent`, `linkArrow`, `showPathDescriptionsModal` |
| `highlightNodeById` | да | 0 | 4 | `onclick` | `generateConceptRankingsContent`, `generateDegreeContent`, `generateMetricResults`, `generateTemporalInfluenceContent` |
| `closeAuthModal` | да | 0 | 4 | `onclick` | `confirmMfaEnroll`, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `toggleSubsection` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `toggleConnectionDescription` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `setSearchKind` | да | 3 | 0 | `onclick` | — |
| `showCustomSelectDropdown` | да | 2 | 1 | `onfocus` | `generateComparisonContent` |
| `filterCustomSelect` | да | 2 | 1 | `oninput` | `generateComparisonContent` |
| `switchCommitTab` | да | 3 | 0 | `onclick` | — |
| `openConceptById` | да | 0 | 3 | `onclick` | `findAndShowPath`, `showPathDescriptionsModal`, `similarItemHtml` |
| `toggleSelectionBody` | да | 0 | 3 | `onclick` | `selectionRowConcept`, `selectionRowPhilosopher`, `selectionRowRelation` |
| `closePhilosopherProfileModal` | да | 1 | 1 | `onclick` | `showPhilosopherProfileModal` |
| `handleLegendSearch` | да | 2 | 0 | `onfocus`, `oninput` | — |
| `handleLegendPhilSearch` | да | 2 | 0 | `onfocus`, `oninput` | — |
| `handleLegendLinkSearch` | да | 2 | 0 | `oninput` | — |
| `openLegendLinkSearch` | да | 2 | 0 | `onfocus` | — |
| `openStatsModal` | да | 1 | 1 | `onclick` | `showConceptProfileModal` |
| `handleStatsParameterChange` | да | 2 | 0 | `onchange` | — |
| `clearPathHighlight` | да | 0 | 2 | `onclick` | `findAndShowPath` |
| `handlePathArrowHover` | да | 0 | 2 | `onmouseenter`, `onmouseleave` | `findAndShowPath` |
| `setInfluenceScope` | да | 0 | 2 | `onclick` | `influenceScopeSwitcher` |
| `toggleSelectionBlock` | да | 0 | 2 | `onclick` | `renderSelectionList` |
| `toggleMetricVisualization` | да | 0 | 2 | `onclick` | `generateMetricResults` |
| `toggleMetricValueMode` | да | 0 | 2 | `onclick` | `generateConceptRankingsContent`, `generateMetricResults` |
| `showConceptProfileModal` | да | 0 | 2 | `onclick` | `generateConceptViewContent`, `generateMetricResults` |
| `renderPhilosopherComparison` | да | 0 | 2 | `onchange` | `generatePhilosopherComparisonContent` |
| `showSimilarityOverlay` | да | 0 | 2 | `onclick` | `similarConceptsBlock`, `updateSimilarityLegend` |
| `showPhilosopherProfileModal` | да | 0 | 2 | `onclick` | `generatePhilosopherViewContent`, `showConceptProfileModal` |
| `openAuthModal` | да | 0 | 2 | `onclick` | `renderAuthControls` |
| `planRelayout` | да | 0 | 2 | `onclick` | `layoutTabHtml` |
| `applyRelayout` | да | 0 | 2 | `onclick` | `layoutTabHtml` |
| `updatePhilColorSample` | да | 0 | 2 | `oninput` | `generatePhilosopherEditContent` |
| `handleConnectionViewSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generateConnectionViewContent` |
| `handleModalSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generateConceptViewContent` |
| `handlePhilosopherSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generatePhilosopherViewContent` |
| `closePathDescriptionsModal` | да | 1 | 0 | `onclick` | — |
| `toggleLegendSearch` | да | 1 | 0 | `onclick` | — |
| `clearLegendSearch` | да | 1 | 0 | `onclick` | — |
| `clearLegendPhilSearch` | да | 1 | 0 | `onclick` | — |
| `resetBeyondFilter` | да | 1 | 0 | `onclick` | — |
| `resetNodeSizes` | да | 1 | 0 | `onclick` | — |
| `selectAllPhilosophers` | да | 1 | 0 | `onclick` | — |
| `deselectAllPhilosophers` | да | 1 | 0 | `onclick` | — |
| `changeFilterMode` | да | 1 | 0 | `onchange` | — |
| `toggleUniformLinkWidth` | да | 1 | 0 | `onchange` | — |
| `selectAllRelations` | да | 1 | 0 | `onclick` | — |
| `deselectAllRelations` | да | 1 | 0 | `onclick` | — |
| `selectAllRubrics` | да | 1 | 0 | `onclick` | — |
| `deselectAllRubrics` | да | 1 | 0 | `onclick` | — |
| `selectAllTraditions` | да | 1 | 0 | `onclick` | — |
| `deselectAllTraditions` | да | 1 | 0 | `onclick` | — |
| `openSelectionListModal` | да | 1 | 0 | `onclick` | — |
| `togglePanel` | да | 1 | 0 | `onclick` | — |
| `findAndShowPath` | да | 1 | 0 | `onclick` | — |
| `resetSimulation` | да | 1 | 0 | `onclick` | — |
| `toggleSimulationFreeze` | да | 1 | 0 | `onclick` | — |
| `centerGraph` | да | 1 | 0 | `onclick` | — |
| `toggleGrouping` | да | 1 | 0 | `onclick` | — |
| `downloadData` | да | 1 | 0 | `onclick` | — |
| `saveToFolder` | да | 1 | 0 | `onclick` | — |
| `exportToPNG` | да | 1 | 0 | `onclick` | — |
| `exportToSVG` | да | 1 | 0 | `onclick` | — |
| `openAboutModal` | да | 1 | 0 | `onclick` | — |
| `onAboutBackdropClick` | да | 1 | 0 | `onclick` | — |
| `closeAboutModal` | да | 1 | 0 | `onclick` | — |
| `closeUsersPanel` | да | 1 | 0 | `onclick` | — |
| `closeCommitsPanel` | да | 1 | 0 | `onclick` | — |
| `openCommitsPanel` | да | 1 | 0 | `onclick` | — |
| `openUsersPanel` | да | 1 | 0 | `onclick` | — |
| `toggleNotifyPanel` | да | 1 | 0 | `onclick` | — |
| `markAllNotificationsRead` | да | 1 | 0 | `onclick` | — |
| `rebuildOverCurrent` | да | 1 | 0 | `onclick` | — |
| `closeConflictModal` | да | 1 | 0 | `onclick` | — |
| `closeSelectionListModal` | да | 1 | 0 | `onclick` | — |
| `handleMetricsScopeChange` | да | 1 | 0 | `onchange` | — |
| `closeStatsModal` | да | 1 | 0 | `onclick` | — |
| `showPathDescriptionsModal` | да | 0 | 1 | `onclick` | `findAndShowPath` |
| `togglePathNodesDescriptions` | да | 0 | 1 | `onclick` | `showPathDescriptionsModal` |
| `pickPhilosopherFromSearch` | да | 0 | 1 | `onclick` | `handleLegendPhilSearch` |
| `pickLinkEnd` | да | 0 | 1 | `onclick` | `handleLegendLinkSearch` |
| `highlightLinkOnGraph` | да | 0 | 1 | `onclick` | `showFoundLinks` |
| `togglePhilosopher` | да | 0 | 1 | `onchange` | `initFilters` |
| `toggleRelation` | да | 0 | 1 | `onchange` | `initFilters` |
| `toggleTradition` | да | 0 | 1 | `onchange` | `initFilters` |
| `onlyTradition` | да | 0 | 1 | `onclick` | `initFilters` |
| `resetTradition` | да | 0 | 1 | `onclick` | `initFilters` |
| `toggleRubric` | да | 0 | 1 | `onchange` | `initFilters` |
| `openSelectionLink` | да | 0 | 1 | `onclick` | `selectionRowRelation` |
| `setSelectionProvenance` | да | 0 | 1 | `onclick` | `renderSelectionList` |
| `toggleSelectionBodies` | да | 0 | 1 | `onclick` | `renderSelectionList` |
| `selectionListMore` | да | 0 | 1 | `onclick` | `renderSelectionList` |
| `saveObservation` | да | 0 | 1 | `onclick` | `observationBar` |
| `pickObservation` | да | 0 | 1 | `onclick` | `renderObservations` |
| `deleteObservation` | да | 0 | 1 | `onclick` | `renderObservations` |
| `calculateMetricFromModal` | да | 0 | 1 | `onclick` | `generateCalculateButton` |
| `toggleMetricLayout` | да | 0 | 1 | `onclick` | `generateMetricResults` |
| `toggleMetricDetails` | да | 0 | 1 | `onclick` | `generateMetricResults` |
| `renderPhilosopherPairs` | да | 0 | 1 | `onclick` | `generatePhilosopherPairsContent` |
| `openPhilosopherPair` | да | 0 | 1 | `onclick` | `renderPhilosopherPairs` |
| `openPairInComparison` | да | 0 | 1 | `onclick` | `renderClosestPairs` |
| `computeComparisonNetwork` | да | 0 | 1 | `onclick` | `renderComparison` |
| `selectSearchResult` | да | 0 | 1 | `onclick` | `displaySearchResults` |
| `selectPhilosopherResult` | да | 0 | 1 | `onclick` | `handlePhilosopherSearch` |
| `selectCustomOption` | да | 0 | 1 | `onclick` | `populateCustomSelect` |
| `setSimilarityLinks` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
| `clearSimilarityOverlay` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
| `forceSimilarColumn` | да | 0 | 1 | `onclick` | `forceButtonHtml` |
| `computeSimilarNetworkColumn` | да | 0 | 1 | `onclick` | `similarNetworkColumnHtml` |
| `toggleProfileOrder` | да | 0 | 1 | `onclick` | `showConceptProfileModal` |
| `submitAuth` | да | 0 | 1 | `onclick` | `openAuthModal` |
| `startMfaEnroll` | да | 0 | 1 | `onclick` | `openSecurityModal` |
| `confirmMfaEnroll` | да | 0 | 1 | `onclick` | `startMfaEnroll` |
| `refreshSecurityDone` | да | 0 | 1 | `onchange` | `confirmMfaEnroll` |
| `openSecurityModal` | да | 0 | 1 | `onclick` | `renderAuthControls` |
| `authLogout` | да | 0 | 1 | `onclick` | `renderAuthControls` |
| `toggleModalMode` | да | 0 | 1 | `onclick` | `openUniversalModal` |
| `popModalState` | да | 0 | 1 | `onclick` | `openUniversalModal` |
| `askLayoutRevert` | да | 0 | 1 | `onclick` | `layoutHistoryHtml` |
| `String` | **НЕТ** | 0 | 1 | `onclick` | `layoutHistoryHtml` |
| `doLayoutRevert` | да | 0 | 1 | `onclick` | `layoutTabHtml` |
| `cancelLayoutRevert` | да | 0 | 1 | `onclick` | `layoutTabHtml` |
| `cancelGraphSelection` | да | 0 | 1 | `onclick` | `selectConceptOnGraph` |
| `toggleEntityHistory` | да | 0 | 1 | `onclick` | `historyBlock` |
| `revertEntityToVersion` | да | 0 | 1 | `onclick` | `renderEntityHistory` |
| `Number` | **НЕТ** | 0 | 1 | `onclick` | `renderEntityHistory` |
| `refreshProvenanceField` | да | 0 | 1 | `onchange` | `provenanceField` |
| `refreshFootnoteRows` | да | 0 | 1 | `onchange` | `footnoteRow` |
| `removeFootnote` | да | 0 | 1 | `onclick` | `footnoteRow` |
| `insertFootnote` | да | 0 | 1 | `onclick` | `footnotesField` |
| `syncPhilColorFromPicker` | да | 0 | 1 | `oninput` | `generatePhilosopherEditContent` |
| `openEditConceptModal` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `deleteConcept` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `createNewConceptForPhilosopher` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `openEditConnectionModal` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `deleteConnection` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `createNewConnectionForConcept` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `onConnTypeChange` | да | 0 | 1 | `onchange` | `generateConnectionEditContent` |
| `swapConnectionConcepts` | да | 0 | 1 | `onclick` | `generateConnectionEditContent` |
| `selectConnectionEditConcept` | да | 0 | 1 | `onclick` | `handleConnectionEditSearch` |
| `toggleConnectionSearchSection` | да | 0 | 1 | `onclick` | `generateConnectionViewContent` |
| `selectConnectionViewConcept` | да | 0 | 1 | `onclick` | `handleConnectionViewSearch` |
| `clearModalSearch` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `gotoNodeFromModal` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `toggleAllConnectionDescriptions` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `showAllConcepts` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `showPhilosopherDetailModal` | да | 0 | 1 | `onclick` | `similarPhilosophersBlock` |
| `clearPhilosopherSearch` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `toggleAllPhilosopherConceptDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `togglePhilosopherConceptDescription` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `toggleAllPhilosopherConnectionDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |


## 6. Все обработчики в разметке построчно

| Стр. | Атрибут | Порождается в | Код |
|---|---|---|---|
| 1364 | `onmouseover` | (страница) | `this.style.background=…` |
| 5134 | `onclick` | (страница) | `closeUniversalModal()` |
| 5143 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 5148 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 5154 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 5166 | `onclick` | (страница) | `toggleLegendSearch()` |
| 5171 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 5173 | `onclick` | (страница) | `setSearchKind('concept')` |
| 5175 | `onclick` | (страница) | `setSearchKind('connection')` |
| 5184 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 5185 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 5186 | `onclick` | (страница) | `clearLegendSearch()` |
| 5196 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5197 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5198 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 5209 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 5210 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 5219 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 5220 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5231 | `onclick` | (страница) | `openStatsModal()` |
| 5243 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5255 | `onclick` | (страница) | `resetNodeSizes()` |
| 5262 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5267 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5268 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5279 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5310 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5318 | `onclick` | (страница) | `toggleSection('relations')` |
| 5323 | `onclick` | (страница) | `selectAllRelations()` |
| 5324 | `onclick` | (страница) | `deselectAllRelations()` |
| 5345 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5350 | `onclick` | (страница) | `selectAllRubrics()` |
| 5351 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5358 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5363 | `onclick` | (страница) | `selectAllTraditions()` |
| 5364 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5398 | `onclick` | (страница) | `openSelectionListModal()` |
| 5409 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5422 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5423 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5436 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5437 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5442 | `onclick` | (страница) | `findAndShowPath()` |
| 5485 | `onclick` | (страница) | `resetSimulation()` |
| 5486 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5487 | `onclick` | (страница) | `centerGraph()` |
| 5488 | `onclick` | (страница) | `toggleGrouping()` |
| 5489 | `onclick` | (страница) | `downloadData()` |
| 5490 | `onclick` | (страница) | `saveToFolder()` |
| 5492 | `onclick` | (страница) | `exportToPNG()` |
| 5493 | `onclick` | (страница) | `exportToSVG()` |
| 5496 | `onclick` | (страница) | `openAboutModal()` |
| 5499 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5501 | `onclick` | (страница) | `closeAboutModal()` |
| 5511 | `onclick` | (страница) | `closeUsersPanel()` |
| 5520 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5521 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5522 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5527 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5535 | `onclick` | (страница) | `openCommitsPanel()` |
| 5536 | `onclick` | (страница) | `openUsersPanel()` |
| 5537 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5541 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5554 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5555 | `onclick` | (страница) | `closeConflictModal()` |
| 5589 | `onclick` | (страница) | `closeSelectionListModal()` |
| 5608 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5614 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5620 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5626 | `onclick` | (страница) | `closeStatsModal()` |
| 5640 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5644 | `onclick` | (страница) | `switchStatsView('observations')` |
| 5648 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5652 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5656 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5660 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5664 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5668 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5672 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5676 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5680 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5684 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5688 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5692 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5704 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5708 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5712 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5724 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5728 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5740 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5744 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5756 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5760 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5772 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5784 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5788 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5800 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5804 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5808 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5812 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5816 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5820 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5824 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5836 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5848 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5852 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5856 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5860 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5872 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5876 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 24776 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24810 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 24857 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 24861 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 24862 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 24963 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 24966 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25137 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 25156 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 25159 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 25196 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25330 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25453 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25506 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 26780 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 26796 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 26820 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 26825 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 26827 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 26843 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29402 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29410 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 32759 | `onclick` | `selectionRowPhilosopher` | `openUniversalModal('philosopher', '${escapeAttr(p.nameRu)}', 'view')` |
| 32761 | `onclick` | `selectionRowPhilosopher` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32782 | `onclick` | `selectionRowConcept` | `openUniversalModal('concept', nodes.find(x => x.id === '${escapeAttr(n.id)}'), 'view')` |
| 32783 | `onclick` | `selectionRowConcept` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32834 | `onclick` | `selectionRowRelation` | `openSelectionLink('${escapeAttr(s)}', '${escapeAttr(t)}')` |
| 32836 | `onclick` | `selectionRowRelation` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32865 | `onclick` | `renderSelectionList` | `setSelectionProvenance('${v}')` |
| 32904 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32909 | `onclick` | `renderSelectionList` | `toggleSelectionBodies('${kind}')` |
| 32912 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32918 | `onclick` | `renderSelectionList` | `selectionListMore('${kind}')` |
| 33054 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 33184 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 33191 | `onclick` | `renderObservations` | `deleteObservation('${escapeAttr(z.observationId)}')` |
| 33427 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 33754 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 33982 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34014 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34019 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 34026 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 34076 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 34084 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 34091 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 34228 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 34832 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 34837 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 34926 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 34954 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 34985 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 34986 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 34987 | `onclick` | `generateClosestPairsContent` | `_pairsKind='types'; renderClosestPairs();` |
| 34988 | `onclick` | `generateClosestPairsContent` | `_pairsKind='network'; renderClosestPairs();` |
| 34993 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 34998 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 35002 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 35007 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 35103 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 35155 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 35156 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 35262 | `onclick` | `renderComparison` | `computeComparisonNetwork()` |
| 35567 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 35756 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 35797 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 36881 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 36993 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 37106 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 37698 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 37713 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 37729 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 39464 | `onclick` | `similarItemHtml` | `openConceptById('${x.id}')` |
| 39496 | `onclick` | `forceButtonHtml` | `forceSimilarColumn('${kind}','${conceptId}')` |
| 39545 | `onclick` | `similarNetworkColumnHtml` | `computeSimilarNetworkColumn('${conceptId}')` |
| 39600 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 39751 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 39771 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 39780 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 39787 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 39884 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 40104 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 40105 | `onclick` | `openAuthModal` | `submitAuth()` |
| 40160 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 40162 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 40190 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 40220 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 40223 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 40264 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 40438 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 40439 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 40442 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 40443 | `onclick` | `renderAuthControls` | `authLogout()` |
| 40517 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 40527 | `onclick` | `openUniversalModal` | `popModalState()` |
| 41682 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(item.id))}')` |
| 41705 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 41706 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 41713 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 41720 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41733 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41734 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 42453 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 42546 | `onclick` | `historyBlock` | `toggleEntityHistory('${escapeAttr(kind)}', '${escapeAttr(entityId)}')` |
| 42605 | `onclick` | `renderEntityHistory` | `revertEntityToVersion('${escapeAttr(kind)}', '${escapeAttr(entityId)}', ${Number(commit.версия)})` |
| 43553 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 43617 | `onchange` | `footnoteRow` | `refreshFootnoteRows()` |
| 43621 | `onclick` | `footnoteRow` | `removeFootnote('${note.id}')` |
| 43635 | `onclick` | `footnotesField` | `insertFootnote()` |
| 43754 | `onclick` | `modalActions` | `${saveFn}()` |
| 43757 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 43761 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 43809 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 43817 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 43821 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 43889 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 43892 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 43895 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 43900 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 44012 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 44015 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 44018 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 44041 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 44159 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 44199 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 44263 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 44371 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 44375 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 44569 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 44592 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44593 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44694 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 44797 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44798 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44799 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 44806 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 44814 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 44817 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 44868 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 44878 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 44905 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 44910 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 44933 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 44957 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 44962 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 45010 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45018 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 45165 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45247 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 45279 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 45328 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45329 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45330 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 45343 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 45499 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45515 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45531 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45585 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 45593 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 45596 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 45651 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 45663 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 45689 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 45693 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 45698 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 45721 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 45755 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 45760 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 45766 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28632 | 34 | — |
| `TENSION_WEIGHTS` | const | 29744 | 5 | — |
| `tensionScales` | function | 29753 | 23 | — |
| `searchNodes` | function | 36861 | 3 | — |
| `toggleSimilarityKind` | function | 37596 | 5 | — |
| `hasUnsaved` | function | 40971 | 1 | — |
| `graphSelectionContext` | window-объявление | 42426 | 1 | — |
| `generatePhilosopherEditContent` | function | 43796 | 118 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 43919 | 133 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 44137 | 98 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 44540 | 85 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 44780 | 259 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 45305 | 488 | вероятно цель `window[…]` в `modalContentFor` |


### 7.2. Имена из разметки без глобального определения

| Имя | Статич. | Динам. | Порождается в |
|---|---|---|---|
| `setTimeout` | 0 | 6 | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `String` | 0 | 1 | `layoutHistoryHtml` |
| `Number` | 0 | 1 | `renderEntityHistory` |


### 7.3. Необъявленные имена, используемые в скрипте

Обычные глобальные объекты браузера и `d3`; сюда же попадут опечатки.


| Имя | Обращений |
|---|---|
| `document` | 392 |
| `Math` | 181 |
| `Set` | 123 |
| `Object` | 82 |
| `Map` | 57 |
| `undefined` | 57 |
| `String` | 55 |
| `console` | 48 |
| `setTimeout` | 47 |
| `window` | 47 |
| `Array` | 45 |
| `alert` | 28 |
| `d3` | 28 |
| `Promise` | 20 |
| `Boolean` | 17 |
| `encodeURIComponent` | 16 |
| `Number` | 15 |
| `Infinity` | 12 |
| `Date` | 12 |
| `clearTimeout` | 9 |
| `location` | 8 |
| `confirm` | 7 |
| `URL` | 6 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `JSON` | 5 |
| `prompt` | 5 |
| `event` | 4 |
| `Float32Array` | 4 |
| `RegExp` | 4 |
| `Uint16Array` | 3 |
| `getComputedStyle` | 3 |
| `decodeURIComponent` | 2 |
| `Blob` | 2 |
| `requestAnimationFrame` | 2 |
| `WebSocket` | 2 |
| `isNaN` | 1 |
| `Float64Array` | 1 |
| `parseFloat` | 1 |
| `fetch` | 1 |
