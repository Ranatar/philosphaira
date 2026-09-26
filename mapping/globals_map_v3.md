# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 159 677 знаков, 46 374 строк; встроенный скрипт — строки 5939–46372. Составлено 2026-09-26 06:16:03 UTC.

Всего глобальных сущностей: **1109** — функций 706
(из них асинхронных 42), `const` 127, `let` 168,
`var` 14, операторов верхнего уровня 88.
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
| `nodes` | const | 24081 | 131 | 80 |
| `escapeAttr` | function | 42896 | 109 | 28 |
| `conceptById` | const | 24149 | 77 | 46 |
| `ModalContext` | const | 40005 | 75 | 26 |
| `links` | const | 24099 | 66 | 48 |
| `similarityOverlay` | var | 37531 | 65 | 17 |
| `concepts` | const | 6904 | 60 | 52 |
| `renderState` | const | 37511 | 59 | 30 |
| `emit` | function | 25817 | 56 | 40 |
| `relations` | const | 12828 | 54 | 48 |
| `selectedPhilosophers` | let | 24290 | 53 | 18 |
| `_conceptMap` | let | 28709 | 53 | 23 |
| `philosopherConcepts` | const | 24035 | 47 | 29 |
| `relationTypesObj` | const | 24050 | 47 | 32 |
| `useWeightedPaths` | let | 24209 | 47 | 18 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 23937 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 23956 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 23991 | 32 | (positions) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 24067 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 24156 | 51 | () | `linksByConcept`×7, `nodesByPhilosopher`×4, `nodes`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links`, `compareConcepts`, `compareLinks` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 24228 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 24232 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 24265 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 24272 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 24274 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 24296 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 24306 | 23 | () | `nodes` | `stmt076` | — | — |
| `strictChronologyCheck` | function | 24340 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24397 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24408 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24420 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24482 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24531 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24537 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24560 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24572 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24676 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24747 | 271 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `withoutFootnotes`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `emit`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | `applyLinkState` | статич.×1 | — |
| `handlePathArrowHover` | function | 25023 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 25067 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 25106 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 25126 | 7 | () | `emit`, `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 25138 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `withoutFootnotes`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 25268 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 25287 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 25314 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25329 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25347 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25372 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25377 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25395 | 6 | () | `chosenPhilosophers` | `stmt060` | — | — |
| `highlightPhilosopherOnGraph` | function | 25402 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25462 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25492 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25500 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25511 | 33 | () | `relationTypesObj`, `links`, `linkSearch`, `directionMark`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25545 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25569 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25592 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25604 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt061` | статич.×1 | — |
| `buildAboutText` | function | 25616 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25699 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25705 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25711 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25720 | 20 | (el, text) | `hintBox`×9 | `stmt063` | — | — |
| `hideHint` | function | 25741 | 3 | () | `hintBox`×2 | `stmt064`, `stmt065`, `stmt066` | — | — |
| `subscribe` | function | 25777 | 17 | (event, handler, phase) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `initLinkState`, `stmt029`, `stmt032`, `stmt033`, `stmt034`, `stmt036`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt060`, `stmt061`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071`, `stmt072`, `stmt073` | — | — |
| `emit` | function | 25817 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `applyFiltersImmediate`×2, `handleMetricsScopeChange`×2, `openPairInComparison`×2, `handleLinkClick`×2, `showSimilarityOverlay`×2, `dispatchClick`×2, `submitAuth`×2, `applyServerLayout`, `findAndShowPath`, `clearPathHighlight`, `refreshMetricsIfScoped`, `setInfluenceScope`, `closeStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `renderClosestPairs`, `toggleMetricVisualization`, `selectCustomOption`, `setSimilarityLinks`, `clearSimilarityOverlay`, `highlightCombined`, `authLogout`, `openUniversalModal`, `closeUniversalModal`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt042` | — | — |
| `debounce` | function | 25835 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 25913 | 30 | (message, duration=…) | — | `showSimilarityOverlay`×6, `handleUniqueChainsMode`×5, `handleChainsMode`×4, `applyLinkState`×2, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt082` | — | — |
| `buildAdjacencyGraph` | function | 25950 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 26032 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 26168 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 26178 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 26227 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 26302 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26492 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `selectionListSets`, `displaySearchResults`, `selectSearchResult`, `pickNode` | — | — |
| `isLinkVisible` | function | 26493 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `selectionListSets`, `exportToSVG`, `paintLinkLayer`, `pickLink` | — | — |
| `applyBasicFilter` | function | 26495 | 52 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26551 | 7 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `handleChainsMode` | async function | 26562 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26625 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26694 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26712 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26720 | 22 | () | `filterMode`×3, `emit`×2, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `applyLinkState`, `selectSearchResult`, `stmt055` | — | — |
| `applyFilters` | function | 26745 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 26779 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 26792 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION` | `stmt046`, `stmt053` | — | — |
| `togglePhilosopher` | function | 26883 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 26912 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 26936 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 26945 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 26951 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 26960 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 26968 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `applyLinkState`×2, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 26992 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt048` | — | — |
| `onlyTradition` | function | 27021 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 27028 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 27038 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 27047 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 27056 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 27065 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 27074 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 27084 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 27093 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 27105 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 27149 | 4 | (mode) | `filterMode`, `applyFilters` | `applyLinkState` | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 27155 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 27165 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt047`, `stmt050`, `stmt074` | — | — |
| `updateProvenanceCoverage` | function | 27192 | 45 | () | `philosophers`×2, `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 27254 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 27255 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 27263 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 27276 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `liveScopeKey` | function | 27302 | 4 | () | `metricsScope`×2, `useWeightedPaths`, `respectDirection` | `applyMetricsScope`, `closeStatsModal` | — | — |
| `applyMetricsScope` | function | 27308 | 36 | (viewName) | `lastScopeKey`×4, `metricsScopeActive`×3, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27473 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27490 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27511 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27545 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27671 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `ensureNetworkProfile`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 27839 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 27851 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 27864 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 27998 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 28012 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 28058 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 28127 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 28139 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 28186 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 28208 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 28315 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 28323 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28353 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28374 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28445 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28453 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28512 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28573 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28579 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28657 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28666 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28720 | 5 | (r) | — | `exportToSVG`×2, `drawLinkSet`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `linkShape`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28731 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28741 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28746 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 28761 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 28780 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 28799 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 28909 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 28917 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 29092 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 29100 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 29226 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 29233 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 29282 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 29289 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29393 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29405 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29416 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29477 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29499 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29506 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29511 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29554 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29561 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29629 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29641 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29700 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29707 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 29758 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 29787 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 29811 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 29816 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 30044 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 30051 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 30094 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 30101 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 30157 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 30164 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 30224 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 30231 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 30280 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 30287 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30345 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30352 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30384 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30394 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30484 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30495 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30527 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30534 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30584 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30591 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30639 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30650 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30714 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30740 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `nodeDegreeOf` | function | 30752 | 7 | (conceptId) | `_relations` | `profileIsMeaningful`, `networkSimilarityData`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `profileIsMeaningful` | function | 30760 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `showSimilarityOverlay`×3, `nearestConcepts`×2, `similarityVerdict`×2, `renderComparison`×2, `similarProfileColumnHtml`×2, `similarNetworkColumnHtml`×2, `similarityThresholds`, `similarConceptsBlock` | — | — |
| `similarityData` | function | 30765 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `similarityThresholds`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 30814 | 9 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `_typeStyleCache`, `_netSimCache`, `_simThresholdCache`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 30832 | 8 | () | `_pairCache`×5, `networkSimilarityData` | `allConceptPairsAsync`, `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 30846 | 63 | (progressCallback) | `_pairCache`×3, `_pairCalculating`×3, `normedDot`×2, `similarityData`, `allConceptPairs`, `PAIRS_CHUNK_ROWS`, `neighborSets`, `typeStyleData`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `fillPairsNetwork` | function | 30910 | 11 | (P) | `normedDot`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 30922 | 9 | (idA, idB) | `similarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 30935 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 30948 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `typeStyleData` | — | — |
| `structuralSimilarity` | function | 30956 | 13 | (idA, idB) | `neighborSets` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `zColumns` | function | 30972 | 15 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `centerRows` | function | 30988 | 6 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `vectorNorm` | function | 30994 | 5 | (v) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `normedDot` | function | 30999 | 6 | (a, na, b, nb) | — | `similarityThresholds`×3, `allConceptPairsAsync`×2, `fillPairsNetwork`, `typeStyleSimilarity`, `networkSimilarity` | — | — |
| `typeStyleData` | function | 31021 | 15 | () | `_typeStyleCache`×4, `_concepts`, `_relations`, `typeProfileOf`, `zColumns`, `centerRows`, `vectorNorm` | `allConceptPairsAsync`, `typeStyleSimilarity`, `similarityThresholds` | — | — |
| `typeStyleSimilarity` | function | 31036 | 6 | (idA, idB) | `normedDot`, `typeStyleData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `metricValueMap` | function | 31068 | 9 | (res) | — | `networkSimilarityData` | — | — |
| `networkSimilarityData` | function | 31078 | 15 | () | `_netSimCache`×5, `betweennessCache`, `pageRankCache`, `closenessCache`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `eigenvectorCache`, `_concepts`, `nodeDegreeOf`, `zColumns`, `centerRows`, `vectorNorm`, `NETWORK_SIM_NAMES`, `metricValueMap` | `ensureNetworkProfile`×2, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkSimilarity`, `networkRoleOf`, `networkProgressPercent`, `similarityThresholds`, `nearestConcepts`, `applyLinkState`, `showSimilarityOverlay`, `forceSimilarColumn` | — | — |
| `networkSimilarity` | function | 31094 | 7 | (idA, idB) | `normedDot`, `networkSimilarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `networkRoleOf` | function | 31105 | 11 | (id) | `NETWORK_ROLE_OF`, `networkSimilarityData` | `similarityVerdict` | — | — |
| `networkProgressPercent` | function | 31126 | 10 | () | `NETWORK_PROGRESS_WEIGHTS`×2, `betweennessCache`, `pageRankCache`, `closenessCache`, `eigenvectorCache`, `networkSimilarityData`, `_netProgress` | `ensureNetworkProfile`, `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `ensureNetworkProfile` | function | 31141 | 38 | (onProgress) | `_netSimPending`×5, `_netProgressListeners`×3, `networkSimilarityData`×2, `_netProgress`×2, `betweennessCache`, `calculateBetweennessAsync`, `pageRankCache`, `calculatePageRank`, `closenessCache`, `calculateClosenessCentrality`, `eigenvectorCache`, `calculateEigenvectorCentrality`, `networkProgressPercent` | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `liveProgressHtml` | function | 31185 | 3 | (pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `updateLiveProgress` | function | 31188 | 4 | (root, pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `similarityNeedsDegree` | function | 31195 | 3 | (kind) | — | `nearestConcepts`×2, `showSimilarityOverlay` | — | — |
| `similarityOf` | function | 31198 | 7 | (kind, idA, idB) | `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity` | `nearestConcepts` | — | — |
| `similarityThresholds` | function | 31214 | 28 | () | `_simThresholdCache`×4, `normedDot`×3, `profileIsMeaningful`, `similarityData`, `typeStyleData`, `networkSimilarityData`, `SIM_VERDICT_HIGH_Q`, `SIM_VERDICT_LOW_Q` | `similarityVerdict` | — | — |
| `nearestConcepts` | function | 31247 | 51 | (conceptId, kind, k, force) | `profileIsMeaningful`×2, `similarityNeedsDegree`×2, `similarityData`, `networkSimilarityData`, `similarityOf` | `similarConceptsBlock`×3, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `rubricUnionSize` | function | 31326 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 31333 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 31424 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 31426 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 31432 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 31453 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 31495 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 31511 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 31530 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 31579 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 31583 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 31589 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31629 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31681 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 31754 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 31758 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 31769 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 31793 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 31810 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 31823 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 31852 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 31857 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 31895 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 31906 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 31915 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt049` | — | — |
| `handleMetricsScopeChange` | function | 31930 | 9 | () | `emit`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyLinkState`×2 | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 31944 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt049`, `stmt075` | — | — |
| `getMetricDescription` | function | 32479 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 32500 | 39 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `refreshObservationsNav`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2, `applyLinkState` | статич.×1, динам.×1 | — |
| `provenanceState` | function | 32568 | 6 | (z) | — | `provenanceKinds` | — | — |
| `provenanceKinds` | function | 32584 | 8 | (z) | `provenanceState` | `selectionListSets` | — | — |
| `setSelectionProvenance` | function | 32601 | 9 | (value) | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `selectionProvenance`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListSets` | function | 32614 | 64 | () | `selectionPhilCount`×4, `selectionProvenance`×2, `philosophers`, `nodes`, `links`, `isNodeVisible`, `isLinkVisible`, `provenanceKinds`, `selectionMirrorCount`, `linkHasTwoHeads`, `comparePhilosophers`, `compareConcepts`, `linkIsInternal`, `compareLinks`, `storedRecord` | `toggleSelectionBodies`, `renderSelectionList` | — | — |
| `openSelectionListModal` | function | 32679 | 12 | () | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `renderSelectionList`, `freezeSimulation` | — | статич.×1 | — |
| `closeSelectionListModal` | function | 32692 | 4 | () | `unfreezeSimulation` | — | статич.×1 | — |
| `toggleSelectionBlock` | function | 32697 | 5 | (kind) | `selectionListOpenBlocks`×3, `renderSelectionList` | — | динам.×2 | — |
| `toggleSelectionBody` | function | 32703 | 5 | (key) | `selectionListOpenBodies`×3, `renderSelectionList` | — | динам.×3 | — |
| `toggleSelectionBodies` | function | 32719 | 11 | (kind) | `selectionListOpenBodies`×3, `selectionListShown`, `selectionListSets`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListMore` | function | 32734 | 4 | (kind) | `SELECTION_LIST_CHUNK`, `selectionListShown`, `renderSelectionList` | — | динам.×1 | — |
| `linkHasTwoHeads` | function | 32758 | 5 | (l) | `relationTypesObj` | `selectionListSets`, `orientLink`, `directionMark`, `linkShape` | — | — |
| `orientLink` | function | 32773 | 12 | (l, isOwnEnd) | `linkHasTwoHeads` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2 | — | — |
| `directionMark` | function | 32786 | 12 | (l) | `linkHasTwoHeads` | `selectionRowRelation`×2, `showFoundLinks` | — | — |
| `selectionLabel` | function | 32802 | 4 | (id) | `conceptById` | `selectionRowRelation`×2 | — | — |
| `selectionRowPhilosopher` | function | 32807 | 15 | (p) | `escapeAttr`×5, `selectionListOpenBodies`, `selectionPhilCount`, `withoutFootnotes` | `renderSelectionList` | — | — |
| `selectionRowConcept` | function | 32830 | 15 | (n) | `escapeAttr`×5, `withoutFootnotes`×2, `philosopherConcepts`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `openSelectionLink` | function | 32858 | 7 | (s, t) | `links`, `openUniversalModal` | — | динам.×1 | — |
| `selectionRowRelation` | function | 32866 | 32 | (l) | `escapeAttr`×8, `directionMark`×2, `selectionLabel`×2, `relationTypesObj`, `conceptById`, `selectionListOpenBodies`, `linkIsInternal`, `otherEndColor`, `withoutFootnotes` | `renderSelectionList` | — | — |
| `renderSelectionList` | function | 32899 | 83 | () | `selectionProvenance`×4, `PROVENANCE_LABELS`×3, `selectionMirrorCount`×2, `conceptById`, `selectionListOpenBlocks`, `SELECTION_LIST_CHUNK`, `selectionListShown`, `selectionListSets`, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation`, `escapeAttr` | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBlock`, `toggleSelectionBody`, `toggleSelectionBodies`, `selectionListMore` | — | — |
| `closeStatsModal` | function | 32983 | 43 | () | `lastScopeKey`×3, `cachesMatchLive`×2, `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `emit`, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt067` | статич.×1 | — |
| `handleStatsParameterChange` | function | 33028 | 32 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `emit`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | `applyLinkState`×2 | статич.×2 | — |
| `observationsAllowed` | function | 33069 | 3 | () | `authSession`×2, `serverMode` | `refreshObservationsNav`×2, `switchStatsView` | — | — |
| `refreshObservationsNav` | function | 33072 | 5 | () | `currentStatsView`×2, `observationsAllowed`×2 | `openStatsModal`, `stmt034` | — | — |
| `switchStatsView` | function | 33078 | 17 | (viewName, event) | `emit`, `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `observationsAllowed`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `applyLinkState`, `stmt059` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 33097 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 33121 | 21 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `PERM`, `can`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 33148 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 33176 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 33213 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 33220 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent`, `deleteObservation` | — | — |
| `renderObservations` | function | 33244 | 46 | () | `escapeAttr`×7, `observationPicked`×4, `PERM`×3, `can`×3, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `deleteObservation` | async function | 33300 | 18 | (id) | `observationPicked`×2, `loadObservations`, `api`, `escapeAttr` | — | динам.×1 | — |
| `pickObservation` | function | 33319 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 33332 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 33360 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt056`, `stmt073` | — | — |
| `calculateMetricFromModal` | async function | 33447 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 33500 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 33522 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 33528 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `comparePhilosophers` | function | 33544 | 14 | (a, b) | `philosopherByName` | `compareLinks`×2, `selectionListSets`, `sortPhilosophersByBirth`, `compareConcepts`, `pickPhilosophers`, `philosopherTraditionsBlock` | — | — |
| `sortPhilosophersByBirth` | function | 33559 | 3 | (list) | `comparePhilosophers` | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `compareConcepts` | function | 33567 | 4 | (a, b) | `comparePhilosophers` | `rebuildIndexes`, `selectionListSets` | — | — |
| `linkIsInternal` | function | 33597 | 5 | (l) | `conceptById`×2 | `compareLinks`×2, `selectionListSets`, `selectionRowRelation` | — | — |
| `otherEndColor` | function | 33621 | 7 | (l, ownerName) | `conceptById`, `philosopherByName` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `selectionRowRelation` | — | — |
| `compareLinks` | function | 33629 | 12 | (a, b) | `comparePhilosophers`×2, `linkIsInternal`×2, `conceptById` | `rebuildIndexes`, `selectionListSets` | — | — |
| `philosopherYears` | function | 33641 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 33660 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 33686 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 33694 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 33707 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 33715 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 33719 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 33724 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 33754 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 33770 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 33772 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 33785 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 33826 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 33862 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 33938 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 34004 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 34018 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 34024 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML`, `withoutFootnotes` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 34192 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 34222 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 34259 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 34324 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 34340 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 34356 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 34372 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 34388 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 34404 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 34420 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 34440 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 34464 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 34488 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 34512 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 34536 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 34560 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 34584 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 34608 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 34632 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 34657 | 195 | () | `withoutFootnotes`×2, `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 34896 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 34929 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 34996 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 35018 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 35052 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 35057 | 42 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function ⟲ | 35100 | 108 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsKind`×2, `_pairsMinShared`×2, `emit`, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×8 | — |
| `openPairInComparison` | function | 35209 | 5 | (a, b) | `emit`×2, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 35215 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `similarityVerdict` | function | 35270 | 49 | (idA, idB) | `profileIsMeaningful`×2, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `NETWORK_ROLE_WORDS`, `networkSimilarity`, `networkRoleOf`, `SIM_SHARED_HIGH`, `similarityThresholds` | `renderComparison` | — | — |
| `computeComparisonNetwork` | function | 35320 | 7 | () | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `renderComparison` | — | динам.×1 | — |
| `renderComparison` | function | 35328 | 68 | () | `_cmpA`×8, `_cmpB`×8, `conceptById`×2, `profileIsMeaningful`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity`, `similarityVerdict` | `loadStatsContent`×2, `applyLinkState`×2, `computeComparisonNetwork`, `stmt058` | — | — |
| `generateGenerativeContent` | function | 35397 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 35417 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 35437 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 35466 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 35493 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 35513 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 35537 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 35561 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 35585 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 35609 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 35667 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 35710 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 35749 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 35787 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 35832 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 35910 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 35973 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 36015 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt081` | — | — |
| `toggleMetricVisualization` | function | 36028 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 36162 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 36180 | 111 | (metricData, metricName) | `gfxNode`×2, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 36293 | 38 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `philosopherIdByName` | function | 36374 | 4 | (name) | `philosophers` | `currentLinkState`×3 | — | — |
| `philosopherNameById` | function | 36378 | 4 | (id) | `philosophers` | `applyLinkState`×2 | — | — |
| `excludedList` | function | 36384 | 8 | (set, all, toKey) | — | `currentLinkState`×3 | — | — |
| `currentLinkState` | function | 36393 | 63 | () | `ModalContext`×6, `similarityOverlay`×5, `currentStatsView`×4, `philosopherIdByName`×3, `excludedList`×3, `filterMode`×2, `_cmpA`×2, `_cmpB`×2, `_pairsKind`×2, `selectedSourceNode`×2, `selectedTargetNode`×2, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `selectedPhilosophers`, `selectedRelations`, `selectedRubrics` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `linkStateToHash` | function | 36457 | 8 | (st) | `LINK_KEYS` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `hashToLinkState` | function | 36466 | 15 | (hash) | `LINK_KEYS` | `initLinkState`×2 | — | — |
| `syncLinkHash` | function | 36483 | 11 | (push) | `_linkLastHash`×2, `_linkApplying`, `currentLinkState`, `linkStateToHash` | `initLinkState` | — | — |
| `applyLinkState` | function | 36495 | 111 | (st) | `conceptById`×6, `selectedPhilosophers`×3, `selectedRelations`×3, `selectedRubrics`×3, `showTemporaryMessage`×2, `syncPhilosopherCheckboxes`×2, `handleMetricsScopeChange`×2, `handleStatsParameterChange`×2, `renderComparison`×2, `_linkApplying`×2, `philosopherNameById`×2, `selectCustomOption`×2, `openUniversalModal`×2, `rubrics`, `relations`, `philosopherConcepts`, `relationTypesObj`, `filterMode`, `findAndShowPath`, `applyFiltersImmediate`, `changeFilterMode`, `networkSimilarityData`, `currentStatsView`, `openStatsModal`, `switchStatsView`, `_cmpA`, `_cmpB`, `_pairsKind`, `_linkMissed`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `similarityOverlay`, `showSimilarityOverlay`, `setSimilarityLinks`, `openConceptById` | `initLinkState`×2 | — | — |
| `initLinkState` | function | 36607 | 15 | () | `hashToLinkState`×2, `applyLinkState`×2, `subscribe`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `syncLinkHash` | `stmt013` | — | — |
| `showProgress` | function | 36631 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 36644 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 36650 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 36725 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 36745 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 36784 | 86 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `CONTRADICTION_DASH`×3, `nodes`×2, `isNodeVisible`×2, `isReflexiveLink`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `nodeEdgeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 36875 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 36900 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 36929 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 36941 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 36945 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 36949 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 36973 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 37009 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 37051 | 10 | (query) | `philosophers`, `comparePhilosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 37062 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 37089 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 37094 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 37103 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 37113 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 37137 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 37162 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 37172 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 37179 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 37196 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 37211 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 37223 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `applyLinkState`×2 | динам.×1 | — |
| `handleNodeClick` | function | 37282 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 37404 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 37433 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 37501 | 8 | () | `gfxCanvas`×4, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 37541 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function ⟲ | 37553 | 126 | (sourceId, kind) | `showTemporaryMessage`×6, `profileIsMeaningful`×3, `similarityOverlay`×3, `emit`×2, `concepts`, `relations`, `nodes`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarityData`, `networkSimilarity`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `similarityNeedsDegree`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState`, `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 37680 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 37709 | 7 | (mode) | `similarityOverlay`×2, `emit`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState` | динам.×1 | — |
| `nodeLitBySimilarity` | function | 37721 | 9 | (id) | `similarityOverlay`×5, `SIGNED_SIMILARITY` | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 37732 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 37747 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 37760 | 6 | () | `emit`, `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt051` | динам.×1 | — |
| `updateSimilarityLegend` | function | 37767 | 49 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIGNED_SIMILARITY`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 37820 | 1 | (d) | `renderState` | `exportToSVG`, `nodeOuterRadius`, `loopShape`, `renderScene`, `startRadiusAnimation`, `pickNode`, `pickLink` | — | — |
| `nodeLabelDy` | function | 37821 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 37822 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×5, `nodeDrawPass`×3, `nodeEdgeWidth`×2 | — | — |
| `hasLinkClass` | function | 37823 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `nodeDrawPass` | function | 37833 | 6 | (d) | `hasNodeClass`×3, `selectedNodes` | `renderScene`, `pickNode` | — | — |
| `nodeEdgeWidth` | function | 37841 | 16 | (d) | `hasNodeClass`×2, `similarityOverlay`, `selectedNodes` | `renderScene`×3, `exportToSVG`, `nodeOuterRadius`, `linksLayerKey` | — | — |
| `nodeOuterRadius` | function | 37860 | 1 | (d) | `nodeRadius`, `nodeEdgeWidth` | `clippedArc`×2, `loopShape` | — | — |
| `setPainter` | function | 37868 | 1 | (handler) | `painter` | `stmt062` | — | — |
| `requestDraw` | function | 37870 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 37892 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 37903 | 8 | () | `renderState`×2, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 37911 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 37922 | 4 | (d) | `renderState` | `arrowSize`, `linkDrawWidth`, `pickLink` | — | — |
| `linkHoverStrokeWidth` | function | 37926 | 4 | (d) | `renderState` | `linkDrawWidth` | — | — |
| `arcParams` | function | 37932 | 15 | (s, t) | — | `clippedArc` | — | — |
| `arcAngleOfChord` | function | 37965 | 3 | (c, R) | — | `clippedArc`×2, `linkShape`×2, `loopShape` | — | — |
| `clippedArc` | function | 37972 | 10 | (s, t) | `nodeOuterRadius`×2, `arcAngleOfChord`×2, `arcParams` | `linkShape`, `renderScene` | — | — |
| `arrowSize` | function | 37984 | 8 | (l, w) | `arrowMode`, `linkStrokeWidth` | `linkShape` | — | — |
| `arcHead` | function | 37995 | 8 | (g, tipA, baseA, half) | — | `linkShape`×2, `loopShape` | — | — |
| `linkShape` | function | 38008 | 20 | (l, w) | `arcAngleOfChord`×2, `arcHead`×2, `isReflexiveLink`, `linkHasTwoHeads`, `clippedArc`, `arrowSize`, `loopShape` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `loopShape` | function | 38032 | 16 | (l, w) | `nodeRadius`, `nodeOuterRadius`, `arcAngleOfChord`, `arcHead` | `linkShape` | — | — |
| `linkVisualState` | function | 38055 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawWidth` | function | 38063 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawAlpha` | function | 38072 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `exportToSVG`, `drawLinkSet` | — | — |
| `strokeLinkShape` | function | 38107 | 10 | (c, g, width) | — | `drawLinkSet`×2 | — | — |
| `fillLinkHeads` | function | 38118 | 10 | (c, g) | — | `drawLinkSet` | — | — |
| `linkOutOfLayer` | function | 38158 | 4 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 38162 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene`, `pickLink` | — | — |
| `linksLayerKey` | function | 38177 | 23 | (c) | `renderState`×5, `nodes`×3, `links`, `visibleLinkSet`, `arrowMode`, `similarityOverlay`, `nodeEdgeWidth`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 38200 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 38206 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 38230 | 42 | (c, tms, take) | `relationTypesObj`×4, `CONTRADICTION_DASH`×3, `isReflexiveLink`×2, `strokeLinkShape`×2, `links`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `fillLinkHeads`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 38280 | 137 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×5, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `nodeEdgeWidth`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `NODE_PASSES`, `nodeDrawPass`, `clippedArc`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 38418 | 9 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt062` | — | — |
| `startRadiusAnimation` | function | 38429 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 38435 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `storedRecord` | function | 38470 | 5 | (kind, id) | `philosophers`, `concepts`, `relations` | `generateConnectionVisualization`×4, `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `selectionListSets`, `hasConceptChanges`, `hasConnectionChanges`, `saveConceptData`, `saveConnectionData`, `generateConceptViewContent` | — | — |
| `withoutEmptyOptional` | function | 38481 | 8 | (record) | `OMITTED_WHEN_EMPTY` | `saveConnectionData`×3, `savePhilosopherData`×2, `saveConceptData`×2 | — | — |
| `toGraph` | function | 38490 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `pickLink`, `dispatchMove` | — | — |
| `pickNode` | function | 38496 | 10 | (gx, gy) | `nodes`, `isNodeVisible`, `nodeRadius`, `NODE_PASSES`, `nodeDrawPass` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `pointInTriangle` | function | 38507 | 5 | (x, y, t) | — | `hitLinkShape` | — | — |
| `distToSegment` | function | 38513 | 5 | (x, y, a, b) | — | `hitLinkShape`×3 | — | — |
| `hitLinkShape` | function | 38525 | 16 | (g, w, x, y) | `distToSegment`×3, `pointInTriangle` | `pickLink` | — | — |
| `pickLink` | function | 38546 | 36 | (clientX, clientY) | `links`×2, `DRAW_ORDER`×2, `isLinkVisible`, `gfxCanvas`, `PICK_LINK_WIDTH`, `nodeRadius`, `linkStrokeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawnLive`, `toGraph`, `hitLinkShape` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 38588 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 38604 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 38655 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 38757 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 38780 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 38815 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 38827 | 4 | () | `tickCount`, `layoutSettled` | `dragMoveStarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 38885 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 38916 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 38951 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 38968 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 38975 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 38985 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 38995 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 39095 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 39131 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragMoveStarted` | function | 39309 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 39319 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 39325 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 39338 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 39350 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 39363 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 39376 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `openSelectionListModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 39381 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeSelectionListModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 39419 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 39441 | 14 | () | — | `stmt077` | — | — |
| `toggleGrouping` | function | 39456 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 39533 | 4 | (conceptId) | `conceptById`, `showDetailModal` | `applyLinkState` | динам.×3 | — |
| `similarItemHtml` | function | 39539 | 15 | (x) | `conceptById` | `similarColumnHtml` | — | — |
| `similarForced` | function | 39558 | 3 | (conceptId, kind) | `_forcedSimilar`×2 | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `forceSimilarColumn` | function | 39561 | 9 | (kind, conceptId) | `_forcedSimilar`×3, `networkSimilarityData`, `refreshSimilarColumn`, `computeSimilarNetworkColumn` | — | динам.×1 | — |
| `refreshSimilarColumn` | function | 39570 | 8 | (kind, conceptId) | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `forceSimilarColumn`, `refreshSimilarNetworkColumn` | — | — |
| `forceButtonHtml` | function | 39578 | 4 | (kind, conceptId, caption) | — | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `similarColumnHtml` | function | 39583 | 10 | (title, hint, list, empty, attrs) | `similarItemHtml` | `similarNetworkColumnHtml`×3, `similarProfileColumnHtml`×2, `similarConceptsBlock`×2 | — | — |
| `similarProfileColumnHtml` | function | 39594 | 16 | (conceptId) | `profileIsMeaningful`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `similarNetworkColumnHtml` | function | 39615 | 20 | (conceptId) | `similarColumnHtml`×3, `profileIsMeaningful`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `computeSimilarNetworkColumn` | function | 39636 | 13 | (conceptId) | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `refreshSimilarNetworkColumn` | `forceSimilarColumn` | динам.×1 | — |
| `refreshSimilarNetworkColumn` | function | 39650 | 3 | (conceptId) | `refreshSimilarColumn` | `computeSimilarNetworkColumn` | — | — |
| `similarConceptsBlock` | function | 39654 | 52 | (conceptId) | `nearestConcepts`×3, `_forcedSimilar`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 39735 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 39751 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 39770 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 39776 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 39793 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 39805 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 39880 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 39889 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 39988 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 40019 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 40034 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt044` | динам.×1 | — |
| `modalEntityExists` | function | 40054 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 40072 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 40152 | 1 | (permissions) | `granted` | `setSessionUser` | — | — |
| `can` | function | 40154 | 1 | (permission) | `granted` | `renderCommits`×4, `renderObservations`×3, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` | — | — |
| `setSessionUser` | function | 40158 | 11 | (user, grantedFromServer) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 40172 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 40174 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 40217 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 40219 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 40224 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 40253 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 40285 | 30 | () | `securityError`×3, `securitySecret`, `renderAuthControls`, `refreshEditHints`, `api`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 40316 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 40322 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 40333 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 40340 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 40355 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 40362 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 40378 | 99 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `emit`×2, `closeAuthModal`×2, `authNoticeMember`×2, `logoutInFlight`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 40480 | 45 | () | `ModalContext`×2, `logoutInFlight`×2, `emit`, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode`, `serverMode`, `api`, `disconnectLive`, `reportSubmit` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 40528 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `authLogout` | — | — |
| `renderAuthControls` | function | 40540 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt041`, `stmt042` | — | — |
| `philRowTip` | function | 40573 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 40579 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt042` | — | — |
| `openUniversalModal` | function | 40595 | 67 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `emit`, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `applyLinkState`×2, `saveConceptData`×2, `saveConnectionData`×2, `openSelectionLink`, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt070` | динам.×26 | — |
| `closeUniversalModal` | function | 40664 | 28 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `emit`, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 40694 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 40713 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 40734 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 40745 | 23 | (original) | `philosopherByName`×2, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 40769 | 20 | (original) | `conceptToRubrics`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 40790 | 28 | (original) | `ModalContext`×2, `relationTypesObj`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 40820 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 40824 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 40834 | 11 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 40846 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 40853 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 40874 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt069` | — | — |
| `showPhilosopherDetailModal` | function | 40878 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 40882 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt068` | — | — |
| `closePhilosopherDetailModal` | function | 40883 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 40885 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 40890 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt071` | динам.×1 | — |
| `openEditConnectionModal` | function | 40897 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `stmt072` | динам.×1 | — |
| `updateGraphData` | function | 40922 | 22 | () | `simulation`×3, `nodes`, `links`, `requestDraw`, `linkLayer`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt054` | — | — |
| `addNodeToGraph` | function | 40945 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 40963 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 40968 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 40980 | 8 | () | `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 40994 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 41013 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 41026 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 41089 | 1 | () | `hasUnsavedEdits`, `serverMode` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 41090 | 1 | () | `hasUnsavedEdits`, `unconfirmedDirect` | `stmt028` | — | — |
| `trackDirectEdit` | function | 41094 | 11 | (sending) | `unconfirmedDirect`×2, `hasUnsavedEdits` | `submitChange` | — | — |
| `collectData` | function | 41106 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 41110 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 41122 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 41131 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 41176 | 10 | (cookieName) | — | `api` | — | — |
| `api` | async function | 41187 | 34 | (path, ?) | `serverMode`, `readCookie` | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `deleteObservation`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `authLogout`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent`, `toggleEntityHistory`, `revertEntityToVersion` | — | — |
| `detectServerMode` | async function | 41226 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `stmt042` | — | — |
| `sameValue` | function | 41288 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 41303 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 41327 | 16 | (descr, apply) | `sendCommit`×2, `PERM`, `can`, `trackDirectEdit`, `serverMode`, `lastSubmitted` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `sendCommit` | async function | 41350 | 60 | (descr, direct) | `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange`×2 | — | — |
| `commitMessageFor` | function | 41412 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 41448 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 41455 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 41460 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 41478 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 41505 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 41519 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 41563 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 41570 | 4 | () | — | — | статич.×1 | — |
| `switchCommitTab` | function | 41575 | 14 | (tab) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 41600 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 41619 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 41630 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 41632 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 41638 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 41657 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 41680 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 41711 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 41715 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `provenanceDiff` | function | 41732 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `footnotesDiff` | function | 41771 | 22 | (changes) | `escapeAttr`×3, `FOOTNOTE_LABELS` | `renderCommits` | — | — |
| `stateInWords` | function | 41794 | 4 | (stateCode) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 41807 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 41823 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 41873 | 74 | () | `escapeAttr`×13, `PERM`×4, `can`×4, `commitItems`×3, `commitTab`×2, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `provenanceDiff`, `footnotesDiff`, `layoutTabHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 41954 | 7 | (count) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 41962 | 17 | (id, verdict) | `emit`, `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 41980 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 42004 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 42025 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 42081 | 11 | () | `unreadCount`×4, `renderBell`×2, `authSession`, `serverMode`, `api` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 42093 | 7 | () | `notifyItems`×2, `authSession`, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 42101 | 9 | () | `unreadCount`×3, `authSession`, `serverMode` | `refreshUnread`×2, `stmt033` | — | — |
| `renderNotifyList` | function | 42111 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 42131 | 16 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 42148 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 42156 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt035` | — | — |
| `markAllNotificationsRead` | async function | 42166 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 42199 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt036` | — | — |
| `showConflict` | function | 42216 | 31 | (descr, clashes) | `escapeAttr`×5, `reportSubmit`×2, `lastConflict` | `stmt029` | — | — |
| `rebuildOverCurrent` | async function | 42253 | 22 | () | `reportSubmit`×2, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `api`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | — | статич.×1 | — |
| `replaceEntity` | function | 42290 | 9 | (set, id, record) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 42304 | 18 | (increment) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 42324 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `revertEntityToVersion`, `stmt042` | — | — |
| `connectLive` | function ⟲ | 42360 | 38 | () | `liveSocket`×5, `authSession`×2, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt042` | — | — |
| `disconnectLive` | function | 42405 | 5 | () | `liveSocket`×2 | `authLogout` | — | — |
| `rebuildDerived` | function | 42430 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 42474 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 42492 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 42500 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `authLogout`, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 42525 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 42579 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 42611 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt044`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 42631 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `historyBlock` | function | 42689 | 17 | (kind, entityId) | `escapeAttr`×4, `serverMode` | `generateConnectionViewContent`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `toggleEntityHistory` | async function | 42707 | 18 | (kind, entityId) | `historyBusy`×3, `historyFor`×2, `historyItems`×2, `renderEntityHistory`×2, `api`, `toggleSubsection` | `revertEntityToVersion`×2 | динам.×1 | — |
| `renderEntityHistory` | function | 42731 | 39 | (kind, entityId) | `escapeAttr`×10, `historyItems`×2, `PERM`, `can` | `toggleEntityHistory`×2 | — | — |
| `revertEntityToVersion` | async function | 42771 | 20 | (kind, entityId, version) | `toggleEntityHistory`×2, `api`, `pullGraphSince`, `historyFor`, `historyItems` | — | динам.×1 | — |
| `provenanceBlock` | function | 42792 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `withoutFootnotes` | function | 42832 | 4 | (text) | `FOOTNOTE_MARK_SOURCE` | `generatePhilosopherViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectionRowConcept`×2, `generateTensionContent`×2, `generateConceptViewContent`×2, `selectionRowPhilosopher`, `selectionRowRelation`, `generateMetricResults`, `stmt024`, `stmt025` | — | — |
| `footnoteOrder` | function | 42838 | 9 | (...texts) | `FOOTNOTE_MARK_SOURCE` | `generateConnectionVisualization`×2, `footnotesField`, `insertFootnote`, `refreshFootnoteRows`, `footnotesValue`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotedText` | function | 42849 | 10 | (text, order, notes) | `FOOTNOTE_MARK_SOURCE` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotesBlock` | function | 42862 | 11 | (notes, order) | `FOOTNOTE_LABELS`, `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `installFootnoteLinks` | function | 42878 | 16 | () | `lastFootnoteHost`, `refreshFootnoteRows` | `stmt038` | — | — |
| `escapeAttr` | function | 42896 | 4 | (s) | — | `renderCommits`×13, `renderEntityHistory`×10, `selectionRowRelation`×8, `renderUsers`×8, `renderObservations`×7, `compareObservationsInPanel`×6, `selectionRowPhilosopher`×5, `selectionRowConcept`×5, `layoutHistoryHtml`×5, `showConflict`×5, `layoutTabHtml`×4, `historyBlock`×4, `provenanceDiff`×3, `footnotesDiff`×3, `renderNotifyList`×3, `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `renderSelectionList`, `deleteObservation`, `confirmMfaEnroll`, `provenanceBlock`, `footnotesBlock`, `provenanceField`, `footnoteRow`, `generateConnectionEditContent` | динам.×13 | — |
| `relationIndexById` | function | 42913 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 42921 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 42939 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 42980 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 42987 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 42988 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 42990 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 42999 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `provenanceDriftWarning` | function | 43151 | 10 | (prev, next) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 43162 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 43181 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 43199 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 43209 | 107 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `withoutEmptyOptional`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields`, `footnotesValue` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 43317 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 43365 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 43374 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 43382 | 83 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `withoutEmptyOptional`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `philosopherByName`, `storedRecord`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `footnotesValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 43480 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 43516 | 100 | () | `ModalContext`×6, `relations`×5, `withoutEmptyOptional`×3, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `relationTypesObj`, `storedRecord`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields`, `footnotesValue` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 43617 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 43692 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 43719 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 43738 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 43760 | 4 | (line, state) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `footnoteRow` | function | 43769 | 15 | (note, n) | `FOOTNOTE_LABELS`, `FOOTNOTE_STATE_ORDER`, `escapeAttr` | `footnotesField`, `insertFootnote` | — | — |
| `footnotesField` | function | 43785 | 15 | (record) | `footnoteOrder`, `footnoteRow` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `footnoteHosts` | function | 43804 | 4 | () | — | `insertFootnote`, `removeFootnote`, `refreshFootnoteRows`, `footnotesValue` | — | — |
| `insertFootnote` | function | 43809 | 22 | () | `lastFootnoteHost`×2, `footnoteOrder`, `footnoteRow`, `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `removeFootnote` | function | 43832 | 7 | (id) | `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `refreshFootnoteRows` | function | 43842 | 19 | () | `footnoteOrder`, `footnoteHosts` | `installFootnoteLinks`, `insertFootnote`, `removeFootnote` | динам.×1 | — |
| `footnotesValue` | function | 43863 | 17 | () | `FOOTNOTE_LABELS`, `footnoteOrder`, `footnoteHosts` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData`, `footnotesChanged` | — | — |
| `footnotesChanged` | function | 43882 | 5 | (record) | `footnotesValue` | `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | — | — |
| `needsCitation` | function | 43888 | 3 | (state) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 43903 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 43913 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 43933 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 43951 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 43958 | 118 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `provenanceField`, `footnotesField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 44081 | 133 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `storedRecord`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `provenanceField`, `footnotesField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 44222 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 44263 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 44289 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 44299 | 98 | (connectionData) | `conceptById`×2, `relationHint`×2, `storedRecord`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `provenanceField`, `footnotesField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 44402 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 44432 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt057` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 44451 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 44465 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 44487 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 44491 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 44510 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 44519 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 44526 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 44550 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 44565 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 44626 | 75 | (sourceNode, targetNode, connectionData) | `storedRecord`×4, `conceptPlate`×3, `relationHint`×2, `footnoteOrder`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `footnotedText`, `footnotesBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 44702 | 85 | (connectionData) | `conceptById`×2, `ModalContext`×2, `historyBlock`, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 44799 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 44819 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 44862 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt057` | динам.×1 | — |
| `updateConnectionVisualization` | function | 44896 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 44918 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 44942 | 259 | (conceptData) | `relationTypesObj`×4, `philosopherConcepts`×3, `conceptToRubrics`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `withoutFootnotes`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `storedRecord`, `similarConceptsBlock`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 45203 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 45219 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 45230 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 45269 | 14 | (sectionId) | — | `toggleEntityHistory` | динам.×4 | — |
| `gotoNodeFromModal` | function | 45285 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 45310 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 45341 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 45352 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 45387 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `comparePhilosophers`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 45426 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 45431 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 45467 | 488 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×12, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `withoutFootnotes`×4, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `philosopherConcepts`×2, `links`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 45957 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 45973 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 46009 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 46041 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt040`, `stmt053` | — | — |
| `closeAllModals` | function | 46148 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt043`, `stmt044` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5944 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 6066 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `selectionListSets`, `philosopherIdByName`, `philosopherNameById`, `pickPhilosophers`, `storedRecord`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6784 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `currentLinkState`, `applyLinkState`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6864 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6904 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12828 | массив (2720) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `applyLinkState`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 23928 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 24026 | литерал null | — | `applyStoredLayout`×2, `stmt082`×2 |
| `philosopherIdToName` | const | 24029 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 24035 | объект (0) | — | `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generateConceptViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `generatePhilosopherViewContent`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `selectionRowConcept`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 24044 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 24050 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `linkHasTwoHeads`, `selectionRowRelation`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 24075 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 24081 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `linksLayerKey`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `selectionListSets`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `pickNode`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt045` |
| `links` | const | 24099 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `selectionListSets`, `openSelectionLink`, `exportToSVG`, `similarityLinkCount`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt045` |
| `conceptToRubrics` | const | 24111 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 24117 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 24149 | new Map | — | `generatePhilosopherViewContent`×12, `applyLinkState`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `linkIsInternal`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `selectionLabel`, `selectionRowRelation`, `renderSelectionList`, `otherEndColor`, `compareLinks`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarItemHtml`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 24150 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `hasPhilosopherChanges`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `comparePhilosophers`, `otherEndColor`, `philosopherYears`, `showPhilosopherProfileModal`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 24151 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 24152 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 24153 | new Map | — | `rebuildIndexes`×4, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 24154 | new Map | — | `rebuildIndexes`×7, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 24209 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `liveScopeKey`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt079`, `stmt084` |
| `respectDirection` | let | 24210 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `liveScopeKey`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt080`, `stmt084` |
| `skipTypologicalInPaths` | let | 24227 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 24243 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 24284 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt086` |
| `MATURITY_AGE` | const | 24287 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 24290 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `applyLinkState`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `currentLinkState`, `deletePhilosopher` |
| `selectedRelations` | let | 24291 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `applyLinkState`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations`, `currentLinkState` |
| `philosopherTraditions` | const | 24294 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 24300 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `applyLinkState`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics`, `currentLinkState` |
| `filterMode` | let | 24303 | строка | — | `applyFiltersImmediate`×3, `currentLinkState`×2, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode`, `applyLinkState` |
| `arrowHoverTimer` | let | 25020 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 25021 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 25135 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 25285 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 25312 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25391 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25460 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25590 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt061` |
| `hintBox` | let | 25718 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 25752 | массив (19) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 25773 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 25775 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 25850 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 26004 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 26166 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 26308 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26489 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26490 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26743 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26750 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 26773 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 26898 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 27250 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 27251 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 27252 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 27291 | литерал null | — | `applyMetricsScope`×4, `closeStatsModal`×3 |
| `cachesMatchLive` | let | 27301 | литерал true | — | `closeStatsModal`×2, `applyMetricsScope` |
| `FORMULA_VERSIONS` | const | 27365 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27401 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27450 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27664 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27665 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 27857 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 27858 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 28004 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 28005 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 28133 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 28195 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 28196 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 28197 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 28206 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28561 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28562 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28564 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28706 | литерал null | — | `philosopherSimilarityData`×4, `metricDescriptions`×3, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `typeStyleData`, `networkSimilarityData`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28707 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `typeStyleData`, `generativityScores`, `metricDescriptions`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28708 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28709 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28710 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28711 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28712 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28713 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 28796 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 28914 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 29097 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 29231 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 29287 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29456 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29464 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29467 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29469 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29471 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29559 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29634 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29639 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29705 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 29763 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 29778 | объект (3) | — | — |
| `_tensionScales` | let | 29784 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 29785 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 30049 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 30099 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 30162 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 30229 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 30285 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30350 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30389 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30493 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30532 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30589 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30644 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30723 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30739 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 30763 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 30827 | литерал null | — | `allConceptPairs`×5, `allConceptPairsAsync`×3, `invalidateSimilarityCache` |
| `_pairCalculating` | let | 30828 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 30844 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 30934 | литерал null | — | `neighborSets`×3 |
| `_typeStyleCache` | let | 31020 | литерал null | — | `typeStyleData`×4, `invalidateSimilarityCache` |
| `NETWORK_SIM_NAMES` | const | 31055 | массив (8) | — | `networkSimilarityData` |
| `NETWORK_ROLE_OF` | const | 31057 | объект (8) | — | `networkRoleOf` |
| `NETWORK_ROLE_WORDS` | const | 31062 | объект (4) | — | `similarityVerdict` |
| `_netSimCache` | let | 31065 | литерал null | — | `networkSimilarityData`×5, `invalidateSimilarityCache` |
| `_netSimPending` | let | 31066 | литерал null | — | `ensureNetworkProfile`×5 |
| `NETWORK_PROGRESS_WEIGHTS` | const | 31123 | объект (4) | — | `networkProgressPercent`×2 |
| `_netProgress` | let | 31124 | объект (4) | — | `ensureNetworkProfile`×2, `networkProgressPercent` |
| `_netProgressListeners` | const | 31125 | new Set | — | `ensureNetworkProfile`×3 |
| `SIGNED_SIMILARITY` | const | 31194 | new Set | — | `nodeLitBySimilarity`, `updateSimilarityLegend` |
| `SIM_VERDICT_HIGH_Q` | const | 31210 | литерал 0.9 | — | `similarityThresholds` |
| `SIM_VERDICT_LOW_Q` | const | 31211 | литерал 0.1 | — | `similarityThresholds` |
| `SIM_SHARED_HIGH` | const | 31212 | литерал 3 | — | `similarityVerdict` |
| `_simThresholdCache` | let | 31213 | литерал null | — | `similarityThresholds`×4, `invalidateSimilarityCache` |
| `PHIL_SIM_MIN_CONCEPTS` | const | 31306 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 31325 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 31331 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 31481 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 31490 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 31522 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 31523 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 31528 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31627 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31673 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31678 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31679 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 31767 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 31805 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 31893 | строка | — | `liveScopeKey`×2, `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 32021 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×3, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `_relations`, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 32496 | литерал null | — | `openStatsModal`×4, `currentLinkState`×4, `handleStatsParameterChange`×3, `refreshObservationsNav`×2, `stmt056`×2, `stmt073`×2, `effectiveScopeFlags`, `switchStatsView`, `applyLinkState` |
| `isStatsModalOpen` | let | 32497 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt056`, `stmt073` |
| `selectionListOpenBlocks` | let | 32554 | new Set | — | `toggleSelectionBlock`×3, `renderSelectionList` |
| `selectionListOpenBodies` | let | 32555 | new Set | — | `toggleSelectionBody`×3, `toggleSelectionBodies`×3, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` |
| `SELECTION_LIST_CHUNK` | const | 32556 | литерал 400 | — | `setSelectionProvenance`×3, `openSelectionListModal`×3, `selectionListMore`, `renderSelectionList` |
| `selectionListShown` | let | 32557 | объект (3) | — | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBodies`, `selectionListMore`, `renderSelectionList` |
| `selectionProvenance` | let | 32560 | строка | — | `renderSelectionList`×4, `selectionListSets`×2, `setSelectionProvenance` |
| `PROVENANCE_LABELS` | const | 32593 | объект (5) | — | `renderSelectionList`×3 |
| `selectionPhilCount` | let | 32611 | объект (0) | — | `selectionListSets`×4, `selectionRowPhilosopher` |
| `selectionMirrorCount` | let | 32612 | литерал 0 | — | `renderSelectionList`×2, `selectionListSets` |
| `observationItems` | let | 33210 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 33211 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `deleteObservation`×2, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 33489 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 33685 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 33704 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 33705 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 33730 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 33751 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 33752 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 33861 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 33874 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 33998 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 34857 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 34857 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 34869 | строка | — | `renderClosestPairs`×2, `currentLinkState`×2, `applyLinkState` |
| `_pairsMinDegree` | var | 34870 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 34871 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 34872 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 34873 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 34875 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 34875 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 34893 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 34994 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 35967 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 35968 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 35969 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 35970 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `LINK_KEYS` | const | 36364 | объект (14) | — | `linkStateToHash`, `hashToLinkState` |
| `_linkApplying` | let | 36370 | литерал false | — | `applyLinkState`×2, `syncLinkHash` |
| `_linkMissed` | let | 36371 | массив (0) | — | `applyLinkState` |
| `_linkLastHash` | let | 36372 | литерал null | — | `syncLinkHash`×2, `applyLinkState`, `initLinkState` |
| `selectedSourceNode` | let | 37134 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 37135 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 37265 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 37278 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 37279 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 37280 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 37401 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 37402 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 37478 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 37479 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 37488 | вызов document.getElementById() | — | `resizeCanvas`×4, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 37489 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 37490 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `PICK_LINK_WIDTH` | const | 37497 | литерал 10 | — | `pickLink` |
| `dpr` | let | 37499 | выражение | — | `paintLinkLayer`×4, `draw`×4, `resizeCanvas`×3 |
| `renderState` | const | 37511 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `draw`, `startRadiusAnimation`, `toGraph`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 37525 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowSize`, `linksLayerKey` |
| `uniformLinkWidthActive` | var | 37526 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 37531 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `currentLinkState`×5, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt051`×2, `applyLinkState`, `clearSimilarityOverlay`, `nodeEdgeWidth`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 37537 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 37538 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 37817 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 37818 | литерал 1 | — | `renderScene` |
| `NODE_PASSES` | const | 37829 | массив (3) | — | `renderScene`, `pickNode` |
| `drawScheduled` | let | 37863 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 37867 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 37884 | литерал false | — | `ensureAnimLoop`×3 |
| `CONTRADICTION_DASH` | const | 38103 | объект (3) | — | `exportToSVG`×3, `drawLinkSet`×3 |
| `DRAW_ORDER` | const | 38129 | массив (5) | — | `pickLink`×2, `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 38142 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 38148 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 38278 | литерал 3 | — | `renderScene` |
| `OMITTED_WHEN_EMPTY` | const | 38480 | массив (3) | — | `withoutEmptyOptional` |
| `nodeHandlers` | const | 38586 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 38586 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 38628 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 38640 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 38650 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 38658 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 38730 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 38731 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 38733 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 38754 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 38760 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragMoveStarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt078` |
| `maxTicks` | let | 38816 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 38872 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `nodeDrawPass`, `nodeEdgeWidth`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 38875 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 38883 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 38883 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 39144 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 39145 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 39374 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 39400 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 39401 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 39402 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 39403 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 39404 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 39405 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 39416 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `_forcedSimilar` | let | 39557 | объект (2) | — | `forceSimilarColumn`×3, `similarForced`×2, `similarConceptsBlock`×2 |
| `PROFILE_METRICS` | const | 39713 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 39769 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 40005 | объект (4) | — | `currentLinkState`×6, `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 40016 | массив (0) | — | `pushModalState`×5, `stmt044`×2, `stmt052`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 40017 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 40111 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 40112 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 40113 | объект (1) | — | `observationsAllowed`×2, `connectLive`×2, `setSessionUser`, `renderAuthControls`, `refreshUnread`, `loadNotifications`, `renderBell` |
| `authModalKind` | let | 40114 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 40132 | вызов Object.freeze() | — | `renderCommits`×4, `renderObservations`×3, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` |
| `granted` | let | 40150 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 40215 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `logoutInFlight` | let | 40478 | литерал null | — | `submitAuth`×2, `authLogout`×2 |
| `pinnedVisibleNodes` | const | 40920 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 41076 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 41078 | литерал false | — | `markDirty`, `hasUnsaved`, `trackDirectEdit`, `downloadData`, `saveToFolder` |
| `unconfirmedDirect` | let | 41087 | литерал 0 | — | `trackDirectEdit`×2, `hasUnsaved` |
| `dataFolder` | let | 41129 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 41174 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationsAllowed`, `observationBar`, `loadObservations`, `authLogout`, `markDirty`, `api`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `historyBlock`, `commitReasonField` |
| `lastSubmitted` | let | 41325 | литерал null | — | `submitChange` |
| `userItems` | let | 41445 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 41446 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 41559 | строка | — | `switchCommitTab`×4, `renderCommits`×2, `loadCommits` |
| `commitItems` | let | 41560 | массив (0) | — | `loadCommits`×3, `renderCommits`×3 |
| `commitError` | let | 41561 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 41597 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 41598 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 41617 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 41628 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 41702 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `LAYOUT_KINDS` | const | 41805 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 42078 | литерал 0 | — | `refreshUnread`×4, `renderBell`×3 |
| `notifyItems` | let | 42079 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 42287 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 42399 | литерал null | — | `connectLive`×5, `disconnectLive`×2, `stmt037`×2 |
| `liveRetry` | let | 42400 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 42401 | литерал false | — | `connectLive`, `stmt037` |
| `lastConflict` | let | 42497 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 42520 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 42522 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 42577 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 42645 | массив (3) | — | `generateConnectionEditContent` |
| `historyFor` | let | 42674 | литерал null | — | `toggleEntityHistory`×2, `revertEntityToVersion` |
| `historyItems` | let | 42675 | массив (0) | — | `toggleEntityHistory`×2, `renderEntityHistory`×2, `revertEntityToVersion` |
| `historyBusy` | let | 42676 | литерал false | — | `toggleEntityHistory`×3 |
| `FOOTNOTE_MARK_SOURCE` | const | 42824 | TaggedTemplateExpression | — | `withoutFootnotes`, `footnoteOrder`, `footnotedText` |
| `FOOTNOTE_LABELS` | const | 42827 | объект (3) | — | `footnotesDiff`, `footnotesBlock`, `footnoteRow`, `footnotesValue` |
| `FOOTNOTE_STATE_ORDER` | const | 42829 | массив (3) | — | `footnoteRow` |
| `lastFootnoteHost` | let | 42877 | литерал null | — | `insertFootnote`×2, `installFootnoteLinks` |
| `GROUNDING_TYPES` | const | 42936 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 43685 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 44507 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 45228 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 45971 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 46007 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 46323 | вызов document.getElementById() | — | `stmt079`×2 |
| `legendDirectionToggle` | const | 46325 | вызов document.getElementById() | — | `stmt080`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 24030 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 24036 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 24045 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 24051 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 24076 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 24112 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 24118 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 24207 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 24295 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 33431 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 33440 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 33999 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 36333 | 6 | `window.addEventListener('load')` | `saveOriginalRadii`, `initLinkState` |
| stmt014 | обработчик | 37027 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 37249 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 38667 | 46 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `requestDraw`, `pickNode`, `gfxZoom`, `dragMoveStarted`, `dragended` |
| stmt017 | вызов | 38714 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 38785 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 38789 | 15 | `if (layoutFromStore) { // ЭНЕРГИЯ ГАСИТСЯ ВМЕСТЕ С ОСТАНОВОМ. Симуляци…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 38832 | 14 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `requestDraw`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 38858 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 38860 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 38965 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 39147 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode`, `withoutFootnotes` |
| stmt025 | обработчик | 39176 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges`, `withoutFootnotes` |
| stmt026 | построение | 39407 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 39496 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 41155 | 5 | `window.addEventListener('beforeunload')` | `hasUnsaved` |
| stmt029 | вызов | 41429 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 41535 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 42053 | 12 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `revertCommitFromPanel`, `showImpact` |
| stmt032 | вызов | 42174 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 42175 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | вызов | 42176 | 1 | `subscribe()` | `subscribe`, `refreshObservationsNav` |
| stmt035 | обработчик | 42181 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt036 | вызов | 42214 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt037 | обработчик | 42412 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt038 | вызов | 42894 | 1 | `installFootnoteLinks()` | `installFootnoteLinks` |
| stmt039 | обработчик | 44791 | 7 | `document.addEventListener('click')` | — |
| stmt040 | вызов | 46123 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt041 | вызов | 46124 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt042 | вызов | 46129 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt043 | обработчик | 46163 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt044 | обработчик | 46171 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt045 | вызов | 46195 | 1 | `console.log()` | `nodes`, `links` |
| stmt046 | вызов | 46196 | 1 | `initFilters()` | `initFilters` |
| stmt047 | вызов | 46199 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt048 | вызов | 46204 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt049 | вызов | 46213 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt050 | вызов | 46218 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt051 | вызов | 46222 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt052 | вызов | 46225 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt053 | вызов | 46228 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt054 | вызов | 46253 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt055 | вызов | 46254 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt056 | вызов | 46255 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt057 | вызов | 46262 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt058 | вызов | 46266 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt059 | вызов | 46267 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt060 | вызов | 46268 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt061 | вызов | 46269 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt062 | вызов | 46276 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt063 | обработчик | 46278 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt064 | обработчик | 46282 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt065 | обработчик | 46286 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt066 | обработчик | 46290 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt067 | вызов | 46291 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt068 | вызов | 46292 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt069 | вызов | 46294 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt070 | вызов | 46295 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt071 | вызов | 46296 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt072 | вызов | 46297 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt073 | вызов | 46299 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt074 | вызов | 46303 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt075 | вызов | 46305 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt076 | вызов | 46308 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt077 | вызов | 46311 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt078 | обработчик | 46314 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt079 | условие | 46324 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt080 | условие | 46326 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt081 | вызов | 46329 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt082 | условие | 46334 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt083 | вызов | 46336 | 1 | `console.log()` | — |
| stmt084 | вызов | 46337 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt085 | обработчик | 46345 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt086 | обработчик | 46351 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt087 | условие | 46366 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt088 | вызов | 46370 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 25886 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 33431 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 33440 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 36333 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 36613 | `popstate` | `window` | addEventListener | функция на месте | `initLinkState` |
| 37027 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 37145 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 37249 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 38658 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 38667 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38667 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38667 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38832 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 38858 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 38860 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 38952 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 38953 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 38954 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 38955 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 38962 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 39147 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39147 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39176 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39176 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39176 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39496 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 40198 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 40279 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 41155 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 41535 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 42053 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 42181 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt035` |
| 42374 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42384 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42389 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42412 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt037` |
| 42882 | `mouseover` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42883 | `mouseout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42884 | `focusin` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42888 | `focusout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42889 | `click` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 42890 | `input` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 44457 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44458 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44791 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt039` |
| 44929 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 46054 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46084 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46099 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46163 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt043` |
| 46171 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt044` |
| 46278 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt063` |
| 46282 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt064` |
| 46286 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt065` |
| 46290 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt066` |
| 46314 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt078` |
| 46345 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt085` |
| 46351 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt086` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27492 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27505 | `installMetricScopeWrappers` | `window[name]` | запись |
| 36140 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 40076 | `modalContentFor` | `window[name]` | чтение |
| 40082 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| 1368 | `onmouseover` | (страница) | `this.style.background=…` |
| 5143 | `onclick` | (страница) | `closeUniversalModal()` |
| 5152 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 5157 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 5163 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 5175 | `onclick` | (страница) | `toggleLegendSearch()` |
| 5180 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 5182 | `onclick` | (страница) | `setSearchKind('concept')` |
| 5184 | `onclick` | (страница) | `setSearchKind('connection')` |
| 5193 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 5194 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 5195 | `onclick` | (страница) | `clearLegendSearch()` |
| 5205 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5206 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5207 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 5218 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 5219 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 5228 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 5229 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5240 | `onclick` | (страница) | `openStatsModal()` |
| 5252 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5264 | `onclick` | (страница) | `resetNodeSizes()` |
| 5271 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5276 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5277 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5288 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5319 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5327 | `onclick` | (страница) | `toggleSection('relations')` |
| 5332 | `onclick` | (страница) | `selectAllRelations()` |
| 5333 | `onclick` | (страница) | `deselectAllRelations()` |
| 5354 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5359 | `onclick` | (страница) | `selectAllRubrics()` |
| 5360 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5367 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5372 | `onclick` | (страница) | `selectAllTraditions()` |
| 5373 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5407 | `onclick` | (страница) | `openSelectionListModal()` |
| 5418 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5431 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5432 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5445 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5446 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5451 | `onclick` | (страница) | `findAndShowPath()` |
| 5494 | `onclick` | (страница) | `resetSimulation()` |
| 5495 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5496 | `onclick` | (страница) | `centerGraph()` |
| 5497 | `onclick` | (страница) | `toggleGrouping()` |
| 5498 | `onclick` | (страница) | `downloadData()` |
| 5499 | `onclick` | (страница) | `saveToFolder()` |
| 5501 | `onclick` | (страница) | `exportToPNG()` |
| 5502 | `onclick` | (страница) | `exportToSVG()` |
| 5505 | `onclick` | (страница) | `openAboutModal()` |
| 5508 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5510 | `onclick` | (страница) | `closeAboutModal()` |
| 5520 | `onclick` | (страница) | `closeUsersPanel()` |
| 5529 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5530 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5531 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5536 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5544 | `onclick` | (страница) | `openCommitsPanel()` |
| 5545 | `onclick` | (страница) | `openUsersPanel()` |
| 5546 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5550 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5563 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5564 | `onclick` | (страница) | `closeConflictModal()` |
| 5598 | `onclick` | (страница) | `closeSelectionListModal()` |
| 5617 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5623 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5629 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5635 | `onclick` | (страница) | `closeStatsModal()` |
| 5649 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5653 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5657 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5661 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5665 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5669 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5673 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5677 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5681 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5693 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5697 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5701 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5713 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5717 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5729 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5733 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5745 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5749 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5761 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5773 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5777 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5789 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5793 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5797 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5801 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5805 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5809 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5813 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5825 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5837 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5841 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5845 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5849 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5863 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5867 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5871 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5875 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5887 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5891 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 5905 | `onclick` | (страница) | `switchStatsView('observations')` |
| 24805 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24839 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 24886 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 24890 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 24891 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 24992 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 24995 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25166 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 25185 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 25188 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 25225 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25359 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25482 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25535 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 26809 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 26825 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 26849 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 26854 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 26856 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 26872 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29436 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29444 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 32815 | `onclick` | `selectionRowPhilosopher` | `openUniversalModal('philosopher', '${escapeAttr(p.nameRu)}', 'view')` |
| 32817 | `onclick` | `selectionRowPhilosopher` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32838 | `onclick` | `selectionRowConcept` | `openUniversalModal('concept', nodes.find(x => x.id === '${escapeAttr(n.id)}'), 'view')` |
| 32839 | `onclick` | `selectionRowConcept` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32890 | `onclick` | `selectionRowRelation` | `openSelectionLink('${escapeAttr(s)}', '${escapeAttr(t)}')` |
| 32892 | `onclick` | `selectionRowRelation` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32921 | `onclick` | `renderSelectionList` | `setSelectionProvenance('${v}')` |
| 32961 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32966 | `onclick` | `renderSelectionList` | `toggleSelectionBodies('${kind}')` |
| 32969 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32975 | `onclick` | `renderSelectionList` | `selectionListMore('${kind}')` |
| 33138 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 33268 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 33275 | `onclick` | `renderObservations` | `deleteObservation('${escapeAttr(z.observationId)}')` |
| 33511 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 33838 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 34066 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34098 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34103 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 34110 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 34160 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 34168 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 34175 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 34312 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 34916 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 34921 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 35010 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 35038 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 35069 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 35070 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 35071 | `onclick` | `generateClosestPairsContent` | `_pairsKind='types'; renderClosestPairs();` |
| 35072 | `onclick` | `generateClosestPairsContent` | `_pairsKind='network'; renderClosestPairs();` |
| 35077 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 35082 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 35086 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 35091 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 35187 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 35239 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 35240 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 35346 | `onclick` | `renderComparison` | `computeComparisonNetwork()` |
| 35651 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 35840 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 35881 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 36965 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 37077 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 37190 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 37782 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 37797 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 37813 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 39548 | `onclick` | `similarItemHtml` | `openConceptById('${x.id}')` |
| 39580 | `onclick` | `forceButtonHtml` | `forceSimilarColumn('${kind}','${conceptId}')` |
| 39629 | `onclick` | `similarNetworkColumnHtml` | `computeSimilarNetworkColumn('${conceptId}')` |
| 39684 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 39835 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 39855 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 39864 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 39871 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 39968 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 40188 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 40189 | `onclick` | `openAuthModal` | `submitAuth()` |
| 40244 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 40246 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 40274 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 40304 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 40307 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 40348 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 40548 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 40549 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 40552 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 40553 | `onclick` | `renderAuthControls` | `authLogout()` |
| 40627 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 40637 | `onclick` | `openUniversalModal` | `popModalState()` |
| 41816 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(item.id))}')` |
| 41839 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 41840 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 41847 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 41854 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41867 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41868 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 42604 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 42697 | `onclick` | `historyBlock` | `toggleEntityHistory('${escapeAttr(kind)}', '${escapeAttr(entityId)}')` |
| 42756 | `onclick` | `renderEntityHistory` | `revertEntityToVersion('${escapeAttr(kind)}', '${escapeAttr(entityId)}', ${Number(commit.версия)})` |
| 43707 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 43777 | `onchange` | `footnoteRow` | `refreshFootnoteRows()` |
| 43781 | `onclick` | `footnoteRow` | `removeFootnote('${note.id}')` |
| 43797 | `onclick` | `footnotesField` | `insertFootnote()` |
| 43916 | `onclick` | `modalActions` | `${saveFn}()` |
| 43919 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 43923 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 43971 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 43979 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 43983 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 44051 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 44054 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 44057 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 44062 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 44174 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 44177 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 44180 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 44203 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 44321 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 44361 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 44425 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 44533 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 44537 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 44731 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 44754 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44755 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44856 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 44959 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44960 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44961 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 44968 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 44976 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 44979 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 45030 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 45040 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 45067 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 45072 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 45095 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 45119 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 45124 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 45172 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45180 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 45327 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45409 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 45441 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 45490 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45491 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45492 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 45505 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 45661 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45677 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45693 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45747 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 45755 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 45758 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 45813 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 45825 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 45851 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 45855 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 45860 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 45883 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 45917 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 45922 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 45928 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28666 | 34 | — |
| `TENSION_WEIGHTS` | const | 29778 | 5 | — |
| `tensionScales` | function | 29787 | 23 | — |
| `searchNodes` | function | 36945 | 3 | — |
| `toggleSimilarityKind` | function | 37680 | 5 | — |
| `graphSelectionContext` | window-объявление | 42577 | 1 | — |
| `generatePhilosopherEditContent` | function | 43958 | 118 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 44081 | 133 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 44299 | 98 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 44702 | 85 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 44942 | 259 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 45467 | 488 | вероятно цель `window[…]` в `modalContentFor` |


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
| `document` | 393 |
| `Math` | 181 |
| `Set` | 124 |
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
