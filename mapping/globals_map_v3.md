# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 069 331 знаков, 44 805 строк; встроенный скрипт — строки 5867–44803. Составлено 2026-09-16 15:39:03 UTC.

Всего глобальных сущностей: **1012** — функций 636
(из них асинхронных 42), `const` 113, `let` 156,
`var` 15, операторов верхнего уровня 86.
Обработчиков событий 51; вызовов из разметки:
статической 110, порождаемой 160.

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
| `nodes` | const | 24009 | 131 | 81 |
| `escapeAttr` | function | 41498 | 104 | 24 |
| `ModalContext` | const | 38793 | 69 | 25 |
| `links` | const | 24027 | 68 | 49 |
| `conceptById` | const | 24077 | 63 | 43 |
| `renderState` | const | 36574 | 62 | 33 |
| `concepts` | const | 6832 | 59 | 51 |
| `similarityOverlay` | var | 36595 | 58 | 14 |
| `_conceptMap` | let | 28632 | 53 | 23 |
| `relations` | const | 12756 | 52 | 46 |
| `selectedPhilosophers` | let | 24218 | 49 | 16 |
| `philosopherConcepts` | const | 23963 | 48 | 27 |
| `useWeightedPaths` | let | 24137 | 46 | 17 |
| `relationTypesObj` | const | 23978 | 45 | 30 |
| `respectDirection` | let | 24138 | 43 | 19 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 23865 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 23884 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 23919 | 32 | (positions) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 23995 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 24084 | 51 | () | `linksByConcept`×7, `nodesByPhilosopher`×4, `nodes`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links`, `compareConcepts`, `compareLinks` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 24156 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 24160 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 24193 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 24200 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 24202 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 24224 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 24234 | 23 | () | `nodes` | `stmt074` | — | — |
| `strictChronologyCheck` | function | 24268 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24325 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24336 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24348 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24410 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24459 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24465 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24488 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24500 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24604 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24675 | 268 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | — | статич.×1 | — |
| `handlePathArrowHover` | function | 24948 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 24992 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 25031 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 25051 | 6 | () | `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 25062 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 25192 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 25211 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 25238 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25253 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25271 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25296 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25301 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25319 | 6 | () | `chosenPhilosophers` | `stmt058` | — | — |
| `highlightPhilosopherOnGraph` | function | 25326 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25386 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25416 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25424 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25435 | 33 | () | `relationTypesObj`, `links`, `linkSearch`, `directionMark`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25469 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25493 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25516 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25528 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt059` | статич.×1 | — |
| `buildAboutText` | function | 25540 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25623 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25629 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25635 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25644 | 20 | (el, text) | `hintBox`×9 | `stmt061` | — | — |
| `hideHint` | function | 25665 | 3 | () | `hintBox`×2 | `stmt062`, `stmt063`, `stmt064` | — | — |
| `subscribe` | function | 25700 | 17 | (event, handler, phase) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `stmt029`, `stmt032`, `stmt033`, `stmt035`, `stmt045`, `stmt046`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt065`, `stmt066`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071` | — | — |
| `emit` | function | 25740 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `handleLinkClick`×2, `dispatchClick`×2, `applyServerLayout`, `refreshMetricsIfScoped`, `applyFiltersImmediate`, `setInfluenceScope`, `handleMetricsScopeChange`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `openPairInComparison`, `toggleMetricVisualization`, `selectCustomOption`, `showSimilarityOverlay`, `highlightCombined`, `submitAuth`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt040` | — | — |
| `debounce` | function | 25758 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 25836 | 29 | (message, duration=…) | — | `handleUniqueChainsMode`×5, `handleChainsMode`×4, `showSimilarityOverlay`×4, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt080` | — | — |
| `buildAdjacencyGraph` | function | 25872 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 25954 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 26090 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 26100 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 26149 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 26224 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26414 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `selectionListSets`, `displaySearchResults`, `selectSearchResult`, `rebuildQuadtree` | — | — |
| `isLinkVisible` | function | 26415 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `selectionListSets`, `exportToSVG`, `needsContinuousAnimation`, `paintLinkLayer`, `repaintPickCanvas` | — | — |
| `applyBasicFilter` | function | 26417 | 53 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26474 | 8 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `refreshHitMaps` | function | 26503 | 4 | () | `pickDirty`, `rebuildQuadtree` | `applyBasicFilter`, `applyChainVisibility` | — | — |
| `handleChainsMode` | async function | 26511 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26574 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26643 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26661 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26669 | 21 | () | `filterMode`×3, `emit`, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `selectSearchResult`, `stmt053` | — | — |
| `applyFilters` | function | 26693 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 26727 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 26740 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION` | `stmt044`, `stmt051` | — | — |
| `togglePhilosopher` | function | 26831 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 26860 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 26884 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 26893 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 26899 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 26908 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 26916 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 26940 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt046` | — | — |
| `onlyTradition` | function | 26969 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 26976 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 26986 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 26995 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 27004 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 27013 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 27022 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 27032 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 27041 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 27053 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 27097 | 4 | (mode) | `filterMode`, `applyFilters` | — | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 27103 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 27113 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt045`, `stmt048`, `stmt072` | — | — |
| `updateProvenanceCoverage` | function | 27140 | 40 | () | `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 27197 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 27198 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 27206 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 27219 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `applyMetricsScope` | function | 27237 | 30 | (viewName) | `metricsScopeActive`×3, `lastScopeKey`×2, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27396 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27413 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27434 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27468 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27594 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 27762 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 27774 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 27787 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 27921 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 27935 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 27981 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 28050 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 28062 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 28109 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 28131 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 28238 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 28246 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28276 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28297 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28368 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28376 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28435 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28496 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28502 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28580 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28589 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28643 | 5 | (r) | — | `buildIncomingLinks`, `buildOutgoingLinks`, `drawLinkSet`, `repaintPickCanvas`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28654 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28664 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28669 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 28684 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 28703 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 28722 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 28832 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 28840 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 29015 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 29023 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 29149 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 29156 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 29205 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 29212 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29316 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29328 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29339 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29400 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29422 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29429 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29434 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29477 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29484 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29552 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29564 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29623 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29630 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 29681 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 29710 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 29734 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 29739 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 29967 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 29974 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 30017 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 30024 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 30080 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 30087 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 30147 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 30154 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 30203 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 30210 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30268 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30275 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30307 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30317 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30407 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30418 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30450 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30457 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30507 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30514 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30562 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30573 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30637 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30663 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful` | — | — |
| `nodeDegreeOf` | function | 30675 | 7 | (conceptId) | `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful` | — | — |
| `profileIsMeaningful` | function | 30683 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `nearestConcepts`×2, `showSimilarityOverlay`×2, `similarConceptsBlock` | — | — |
| `similarityData` | function | 30688 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 30737 | 6 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 30752 | 3 | () | `_pairCache` | `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 30761 | 55 | (progressCallback) | `_pairCache`×4, `_pairCalculating`×3, `similarityData`, `PAIRS_CHUNK_ROWS`, `neighborSets` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 30817 | 9 | (idA, idB) | `similarityData` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 30830 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 30843 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `structuralSimilarity`×2 | — | — |
| `structuralSimilarity` | function | 30851 | 22 | (idA, idB) | `typeProfileOf`×2, `neighborSets` | `showSimilarityOverlay`×2, `nearestConcepts`, `renderComparison` | — | — |
| `nearestConcepts` | function | 30874 | 51 | (conceptId, kind, k) | `profileIsMeaningful`×2, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `similarConceptsBlock`×2 | — | — |
| `rubricUnionSize` | function | 30953 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 30960 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 31051 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 31053 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 31059 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 31080 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 31122 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 31138 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 31157 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 31206 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 31210 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 31216 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31256 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31308 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 31381 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 31385 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 31396 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 31420 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 31437 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 31450 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 31479 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 31484 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 31522 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 31533 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 31542 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt047` | — | — |
| `handleMetricsScopeChange` | function | 31557 | 8 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | — | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 31570 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt047`, `stmt073` | — | — |
| `getMetricDescription` | function | 32105 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 32126 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2 | статич.×1, динам.×1 | — |
| `provenanceState` | function | 32193 | 6 | (z) | — | `selectionListSets` | — | — |
| `setSelectionProvenance` | function | 32208 | 9 | (value) | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `selectionProvenance`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListSets` | function | 32220 | 37 | () | `selectionPhilCount`×4, `selectionProvenance`×2, `philosophers`, `nodes`, `links`, `isNodeVisible`, `isLinkVisible`, `provenanceState`, `comparePhilosophers`, `compareConcepts`, `compareLinks` | `toggleSelectionBodies`, `renderSelectionList` | — | — |
| `openSelectionListModal` | function | 32258 | 12 | () | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `renderSelectionList`, `freezeSimulation` | — | статич.×1 | — |
| `closeSelectionListModal` | function | 32271 | 4 | () | `unfreezeSimulation` | — | статич.×1 | — |
| `toggleSelectionBlock` | function | 32276 | 5 | (kind) | `selectionListOpenBlocks`×3, `renderSelectionList` | — | динам.×2 | — |
| `toggleSelectionBody` | function | 32282 | 5 | (key) | `selectionListOpenBodies`×3, `renderSelectionList` | — | динам.×3 | — |
| `toggleSelectionBodies` | function | 32298 | 11 | (kind) | `selectionListOpenBodies`×3, `selectionListShown`, `selectionListSets`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListMore` | function | 32313 | 4 | (kind) | `SELECTION_LIST_CHUNK`, `selectionListShown`, `renderSelectionList` | — | динам.×1 | — |
| `linkHasTwoHeads` | function | 32337 | 5 | (l) | `relationTypesObj` | `directionMark`, `exportToSVG`, `fillArrow` | — | — |
| `directionMark` | function | 32343 | 12 | (l) | `linkHasTwoHeads` | `selectionRowRelation`×2, `generatePhilosopherViewContent`×2, `showFoundLinks` | — | — |
| `selectionLabel` | function | 32359 | 4 | (id) | `conceptById` | `selectionRowRelation`×2 | — | — |
| `selectionRowPhilosopher` | function | 32364 | 15 | (p) | `escapeAttr`×5, `selectionListOpenBodies`, `selectionPhilCount` | `renderSelectionList` | — | — |
| `selectionRowConcept` | function | 32387 | 16 | (n) | `escapeAttr`×6, `philosopherConcepts`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `selectionRowRelation` | function | 32411 | 29 | (l) | `escapeAttr`×8, `directionMark`×2, `selectionLabel`×2, `relationTypesObj`, `conceptById`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `renderSelectionList` | function | 32441 | 53 | () | `selectionProvenance`×3, `PROVENANCE_LABELS`×3, `selectionListOpenBlocks`, `SELECTION_LIST_CHUNK`, `selectionListShown`, `selectionListSets`, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBlock`, `toggleSelectionBody`, `toggleSelectionBodies`, `selectionListMore` | — | — |
| `closeStatsModal` | function | 32495 | 30 | () | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `lastScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt065` | статич.×1 | — |
| `handleStatsParameterChange` | function | 32527 | 31 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | — | статич.×2 | — |
| `switchStatsView` | function | 32560 | 15 | (viewName, event) | `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `stmt057` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 32577 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 32601 | 21 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `PERM`, `can`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 32628 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 32656 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 32693 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 32700 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent`, `deleteObservation` | — | — |
| `renderObservations` | function | 32724 | 46 | () | `escapeAttr`×7, `observationPicked`×4, `PERM`×3, `can`×3, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `deleteObservation` | async function | 32780 | 18 | (id) | `observationPicked`×2, `loadObservations`, `api`, `escapeAttr` | — | динам.×1 | — |
| `pickObservation` | function | 32799 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 32812 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 32840 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt054`, `stmt071` | — | — |
| `calculateMetricFromModal` | async function | 32927 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 32980 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 33002 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 33008 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `comparePhilosophers` | function | 33024 | 14 | (a, b) | `philosopherByName` | `compareLinks`×2, `selectionListSets`, `sortPhilosophersByBirth`, `compareConcepts`, `pickPhilosophers`, `philosopherTraditionsBlock` | — | — |
| `sortPhilosophersByBirth` | function | 33039 | 3 | (list) | `comparePhilosophers` | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `compareConcepts` | function | 33047 | 4 | (a, b) | `comparePhilosophers` | `rebuildIndexes`, `selectionListSets` | — | — |
| `linkIsInternal` | function | 33062 | 5 | (l) | `conceptById`×2 | `compareLinks`×2 | — | — |
| `compareLinks` | function | 33068 | 15 | (a, b) | `comparePhilosophers`×2, `linkIsInternal`×2, `conceptById` | `rebuildIndexes`, `selectionListSets` | — | — |
| `philosopherYears` | function | 33083 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 33102 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 33128 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 33136 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 33149 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 33157 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 33161 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 33166 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 33196 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 33212 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 33214 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 33227 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 33268 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 33304 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 33380 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 33446 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 33460 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 33466 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 33634 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 33664 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 33701 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 33766 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 33782 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 33798 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 33814 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 33830 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 33846 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 33862 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 33882 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 33906 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 33930 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 33954 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 33978 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 34002 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 34026 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 34050 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 34074 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 34099 | 195 | () | `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 34338 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 34371 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 34438 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 34460 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 34494 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 34499 | 40 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function | 34540 | 96 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsMinShared`×2, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `_pairsKind`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×6 | — |
| `openPairInComparison` | function | 34637 | 4 | (a, b) | `emit`, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 34642 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderComparison` | function | 34691 | 62 | () | `_cmpA`×4, `_cmpB`×4, `conceptById`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `loadStatsContent`×2, `stmt056` | — | — |
| `generateGenerativeContent` | function | 34754 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 34774 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 34794 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 34823 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 34850 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 34870 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 34894 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 34918 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 34942 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 34966 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 35024 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 35067 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 35106 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 35144 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 35189 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 35267 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 35330 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 35372 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt079` | — | — |
| `toggleMetricVisualization` | function | 35385 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 35519 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 35537 | 110 | (metricData, metricName) | `gfxNode`×2, `nodes`, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 35649 | 39 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `showProgress` | function | 35701 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 35714 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 35720 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 35795 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 35815 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 35854 | 74 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `nodes`×2, `isNodeVisible`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `linkHasTwoHeads`, `renderState`, `nodeRadius`, `nodeLabelDy`, `arrowPoints`, `arrowPointsStart`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 35933 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 35958 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 35987 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 35999 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 36003 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 36007 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 36031 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 36067 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 36109 | 10 | (query) | `philosophers`, `comparePhilosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 36120 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 36147 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 36152 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 36161 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 36171 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 36195 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 36220 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 36230 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 36237 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 36254 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 36269 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 36281 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | — | динам.×1 | — |
| `handleNodeClick` | function | 36340 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 36462 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 36491 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 36561 | 11 | () | `gfxCanvas`×6, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `pickCanvas`×2, `pickDirty`, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 36605 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function | 36615 | 95 | (sourceId, kind) | `showTemporaryMessage`×4, `similarityOverlay`×3, `profileIsMeaningful`×2, `structuralSimilarity`×2, `concepts`, `relations`, `nodes`, `emit`, `_simCache`, `profileSimilarity`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 36711 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 36740 | 6 | (mode) | `similarityOverlay`×2, `updateSimilarityLegend`, `requestDraw` | — | динам.×1 | — |
| `nodeLitBySimilarity` | function | 36751 | 9 | (id) | `similarityOverlay`×5 | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 36762 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 36777 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 36790 | 5 | () | `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt049` | динам.×1 | — |
| `updateSimilarityLegend` | function | 36796 | 46 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 36846 | 1 | (d) | `renderState` | `exportToSVG`, `drawSelfLoop`, `renderScene`, `startRadiusAnimation`, `pickNode` | — | — |
| `nodeLabelDy` | function | 36847 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 36848 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×6 | — | — |
| `hasLinkClass` | function | 36849 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `setPainter` | function | 36857 | 1 | (handler) | `painter` | `stmt060` | — | — |
| `requestDraw` | function | 36859 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 36879 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 36890 | 9 | () | `renderState`×2, `links`, `isLinkVisible`, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 36899 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 36910 | 4 | (d) | `renderState` | `arrowPoints`, `arrowPointsStart`, `linkDrawWidth` | — | — |
| `linkHoverStrokeWidth` | function | 36914 | 4 | (d) | `renderState` | `linkDrawWidth`, `drawLinkSet` | — | — |
| `arcParams` | function | 36920 | 15 | (s, t) | — | `arrowPoints`, `arrowPointsStart`, `strokeLink`, `renderScene` | — | — |
| `arrowPoints` | function | 36937 | 26 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `arrowPointsStart` | function | 36967 | 28 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `linkVisualState` | function | 37002 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawWidth` | function | 37010 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawAlpha` | function | 37019 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `drawLinkSet`×2, `exportToSVG` | — | — |
| `strokeLink` | function | 37041 | 8 | (c, l, width) | `arcParams` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `drawSelfLoop` | function | 37053 | 27 | (c, l, sw, col, alpha) | `nodeRadius` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `fillArrow` | function | 37081 | 13 | (c, l, sw) | `linkHasTwoHeads`, `arrowPoints`, `arrowPointsStart` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkOutOfLayer` | function | 37127 | 5 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 37132 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene` | — | — |
| `linksLayerKey` | function | 37147 | 19 | (c) | `renderState`×5, `nodes`×2, `links`, `visibleLinkSet`, `similarityOverlay`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 37166 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 37172 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 37196 | 36 | (c, tms, take) | `relationTypesObj`×4, `linkDrawAlpha`×2, `links`, `isReflexiveLink`, `renderState`, `linkHoverStrokeWidth`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 37240 | 138 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×6, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `arcParams`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 37379 | 10 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `pickDirty`, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt060` | — | — |
| `startRadiusAnimation` | function | 37391 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 37397 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `rebuildQuadtree` | function | 37413 | 5 | () | `nodes`, `isNodeVisible`, `quadtree` | `refreshHitMaps`, `pickNode`, `stmt016`, `stmt020`, `updateGraphData` | — | — |
| `toGraph` | function | 37419 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `dispatchMove` | — | — |
| `pickNode` | function | 37424 | 9 | (gx, gy) | `quadtree`×2, `renderState`, `nodeRadius`, `rebuildQuadtree` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `repaintPickCanvas` | function | 37434 | 30 | () | `pickCtx`×13, `dpr`×4, `links`×2, `pickCanvas`×2, `isLinkVisible`, `isReflexiveLink`, `pickDirty`, `PICK_LINK_WIDTH`, `renderState`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow` | `pickLink` | — | — |
| `pickLink` | function | 37465 | 12 | (clientX, clientY) | `links`×2, `pickCanvas`×2, `dpr`×2, `gfxCanvas`, `pickCtx`, `pickDirty`, `repaintPickCanvas` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 37483 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 37499 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 37550 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 37644 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 37667 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 37697 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 37709 | 4 | () | `tickCount`, `layoutSettled` | `dragstarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 37769 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 37800 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 37835 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 37852 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 37859 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 37869 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 37879 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 37979 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 38015 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragstarted` | function | 38186 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 38196 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 38202 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 38215 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 38227 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 38240 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 38253 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `openSelectionListModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 38258 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeSelectionListModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 38296 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 38318 | 14 | () | — | `stmt075` | — | — |
| `toggleGrouping` | function | 38333 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 38410 | 4 | (conceptId) | `conceptById`, `showDetailModal` | — | динам.×3 | — |
| `similarConceptsBlock` | function | 38415 | 79 | (conceptId) | `medianNodeDegree`×2, `nodeDegreeOf`×2, `nearestConcepts`×2, `conceptById`, `profileIsMeaningful` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 38523 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 38539 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 38558 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 38564 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 38581 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 38593 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 38668 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 38677 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 38776 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 38807 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 38822 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt042` | динам.×1 | — |
| `modalEntityExists` | function | 38842 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 38860 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 38940 | 1 | (permissions) | `granted` | `setSessionUser` | — | — |
| `can` | function | 38942 | 1 | (permission) | `granted` | `renderCommits`×4, `renderObservations`×3, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` | — | — |
| `setSessionUser` | function | 38946 | 11 | (user, grantedFromServer) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 38960 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 38962 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 39005 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 39007 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 39012 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 39041 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 39073 | 30 | () | `securityError`×3, `securitySecret`, `renderAuthControls`, `refreshEditHints`, `api`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 39104 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 39110 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 39121 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 39128 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 39143 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 39150 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 39166 | 96 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `closeAuthModal`×2, `authNoticeMember`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `emit`, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 39263 | 24 | () | `ModalContext`×2, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 39290 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `authLogout` | — | — |
| `renderAuthControls` | function | 39302 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt039`, `stmt040` | — | — |
| `philRowTip` | function | 39335 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 39341 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt040` | — | — |
| `openUniversalModal` | function | 39357 | 64 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `saveConceptData`×2, `saveConnectionData`×2, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt068` | динам.×27 | — |
| `closeUniversalModal` | function | 39423 | 27 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 39452 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 39471 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 39492 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 39503 | 22 | (original) | `philosopherByName` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 39526 | 19 | (original) | `conceptToRubrics` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 39546 | 27 | (original) | `ModalContext`×2, `relationTypesObj` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 39575 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 39579 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 39589 | 11 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 39601 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 39608 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 39629 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt067` | — | — |
| `showPhilosopherDetailModal` | function | 39633 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 39637 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt066` | — | — |
| `closePhilosopherDetailModal` | function | 39638 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 39640 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 39645 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt069` | динам.×1 | — |
| `openEditConnectionModal` | function | 39652 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `stmt070` | динам.×1 | — |
| `updateGraphData` | function | 39677 | 24 | () | `simulation`×3, `nodes`, `links`, `pickDirty`, `requestDraw`, `linkLayer`, `rebuildQuadtree`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt052` | — | — |
| `addNodeToGraph` | function | 39702 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 39720 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 39725 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 39737 | 8 | () | `pickDirty`, `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 39751 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 39770 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 39783 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 39837 | 1 | () | `hasUnsavedEdits` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 39838 | 1 | () | `hasUnsavedEdits` | — | — | — |
| `collectData` | function | 39840 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 39844 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 39856 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 39865 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 39910 | 10 | (cookieName) | — | `api` | — | — |
| `api` | async function | 39921 | 29 | (path, ?) | `serverMode`, `readCookie` | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `deleteObservation`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent`, `toggleEntityHistory`, `revertEntityToVersion` | — | — |
| `detectServerMode` | async function | 39955 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `stmt040` | — | — |
| `sameValue` | function | 40017 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 40032 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 40056 | 17 | (descr, apply) | `PERM`, `can`, `serverMode`, `lastSubmitted`, `sendCommit` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `sendCommit` | async function | 40080 | 58 | (descr, direct) | `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange` | — | — |
| `commitMessageFor` | function | 40140 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 40176 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 40183 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 40188 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 40206 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 40233 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 40247 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 40291 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 40298 | 4 | () | — | — | статич.×1 | — |
| `switchCommitTab` | function | 40303 | 14 | (tab) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 40328 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 40347 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 40358 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 40360 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 40366 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 40385 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 40408 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 40439 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 40443 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `provenanceDiff` | function | 40460 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `stateInWords` | function | 40493 | 4 | (stateCode) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 40506 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 40522 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 40572 | 73 | () | `escapeAttr`×13, `PERM`×4, `can`×4, `commitItems`×3, `commitTab`×2, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `provenanceDiff`, `layoutTabHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 40652 | 7 | (count) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 40660 | 17 | (id, verdict) | `emit`, `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 40678 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 40702 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 40723 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 40779 | 8 | () | `unreadCount`×3, `serverMode`, `api`, `renderBell` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 40788 | 7 | () | `notifyItems`×2, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 40796 | 9 | () | `unreadCount`×3, `serverMode` | `refreshUnread`, `stmt033` | — | — |
| `renderNotifyList` | function | 40806 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 40826 | 16 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 40843 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 40851 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt034` | — | — |
| `markAllNotificationsRead` | async function | 40861 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 40893 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt035` | — | — |
| `showConflict` | function | 40910 | 31 | (descr, clashes) | `escapeAttr`×5, `reportSubmit`×2, `lastConflict` | `stmt029` | — | — |
| `rebuildOverCurrent` | async function | 40947 | 22 | () | `reportSubmit`×2, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `api`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | — | статич.×1 | — |
| `replaceEntity` | function | 40984 | 9 | (set, id, record) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 40998 | 18 | (increment) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 41018 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `revertEntityToVersion`, `stmt040` | — | — |
| `connectLive` | function ⟲ | 41054 | 33 | () | `liveSocket`×5, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt040` | — | — |
| `rebuildDerived` | function | 41111 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 41155 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 41173 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 41181 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 41206 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 41260 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 41292 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt042`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 41312 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `historyBlock` | function | 41370 | 17 | (kind, entityId) | `escapeAttr`×4, `serverMode` | `generateConnectionViewContent`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `toggleEntityHistory` | async function | 41388 | 18 | (kind, entityId) | `historyBusy`×3, `historyFor`×2, `historyItems`×2, `renderEntityHistory`×2, `api`, `toggleSubsection` | `revertEntityToVersion`×2 | динам.×1 | — |
| `renderEntityHistory` | function | 41412 | 39 | (kind, entityId) | `escapeAttr`×10, `historyItems`×2, `PERM`, `can` | `toggleEntityHistory`×2 | — | — |
| `revertEntityToVersion` | async function | 41452 | 20 | (kind, entityId, version) | `toggleEntityHistory`×2, `api`, `pullGraphSince`, `historyFor`, `historyItems` | — | динам.×1 | — |
| `provenanceBlock` | function | 41473 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `escapeAttr` | function | 41498 | 4 | (s) | — | `renderCommits`×13, `renderEntityHistory`×10, `selectionRowRelation`×8, `renderUsers`×8, `renderObservations`×7, `selectionRowConcept`×6, `compareObservationsInPanel`×6, `selectionRowPhilosopher`×5, `layoutHistoryHtml`×5, `showConflict`×5, `layoutTabHtml`×4, `historyBlock`×4, `provenanceDiff`×3, `renderNotifyList`×3, `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `deleteObservation`, `confirmMfaEnroll`, `provenanceBlock`, `provenanceField`, `generateConnectionEditContent` | динам.×13 | — |
| `relationIndexById` | function | 41515 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 41523 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 41541 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 41582 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 41589 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 41590 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 41592 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 41601 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `provenanceDriftWarning` | function | 41753 | 10 | (prev, next) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 41764 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 41783 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 41801 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 41811 | 102 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 41914 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 41962 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 41971 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 41979 | 76 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `philosopherByName`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 42070 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 42106 | 93 | () | `ModalContext`×6, `relations`×5, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 42200 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 42275 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 42302 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 42321 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 42340 | 6 | (line, state) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `needsCitation` | function | 42347 | 3 | (state) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 42362 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 42372 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 42392 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 42410 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 42417 | 117 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `provenanceField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 42539 | 132 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `provenanceField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 42679 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 42720 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 42746 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 42756 | 97 | (connectionData) | `conceptById`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `provenanceField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 42858 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 42888 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt055` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 42907 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 42921 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 42943 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 42947 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 42966 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 42975 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 42982 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 43006 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 43021 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 43082 | 75 | (sourceNode, targetNode, connectionData) | `conceptPlate`×3, `relationHint`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 43158 | 85 | (connectionData) | `conceptById`×2, `ModalContext`×2, `historyBlock`, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 43255 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 43275 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 43318 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt055` | динам.×1 | — |
| `updateConnectionVisualization` | function | 43352 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 43374 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 43398 | 267 | (conceptData) | `philosopherConcepts`×5, `relationTypesObj`×4, `conceptToRubrics`×2, `linkArrow`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `similarConceptsBlock`, `historyBlock`, `provenanceBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 43667 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 43683 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 43694 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 43733 | 14 | (sectionId) | — | `toggleEntityHistory` | динам.×4 | — |
| `gotoNodeFromModal` | function | 43749 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 43774 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 43805 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 43816 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 43851 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `comparePhilosophers`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 43890 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 43895 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 43931 | 455 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×6, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `philosopherConcepts`×3, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `links`×2, `directionMark`×2, `linkArrow`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `historyBlock`, `provenanceBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 44388 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 44404 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 44440 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 44472 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt038`, `stmt051` | — | — |
| `closeAllModals` | function | 44579 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt041`, `stmt042` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5872 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 5994 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `selectionListSets`, `pickPhilosophers`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6712 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6792 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6832 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12756 | массив (2720) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 23856 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 23954 | литерал null | — | `applyStoredLayout`×2, `stmt080`×2 |
| `philosopherIdToName` | const | 23957 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 23963 | объект (0) | — | `generateConceptViewContent`×5, `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generatePhilosopherViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `selectionRowConcept`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 23972 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 23978 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `linkHasTwoHeads`, `selectionRowRelation`, `exportToSVG`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 24003 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 24009 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `linksLayerKey`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `selectionListSets`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `visualizeMetricBySize`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `rebuildQuadtree`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt043` |
| `links` | const | 24027 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `repaintPickCanvas`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `selectionListSets`, `exportToSVG`, `similarityLinkCount`, `needsContinuousAnimation`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt043` |
| `conceptToRubrics` | const | 24039 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 24045 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 24077 | new Map | — | `generatePhilosopherViewContent`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `linkIsInternal`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `selectionLabel`, `selectionRowRelation`, `compareLinks`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarConceptsBlock`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 24078 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `comparePhilosophers`, `philosopherYears`, `showPhilosopherProfileModal`, `hasPhilosopherChanges`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 24079 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 24080 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 24081 | new Map | — | `rebuildIndexes`×4, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 24082 | new Map | — | `rebuildIndexes`×7, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 24137 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt077`, `stmt082` |
| `respectDirection` | let | 24138 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt078`, `stmt082` |
| `skipTypologicalInPaths` | let | 24155 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 24171 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 24212 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt084` |
| `MATURITY_AGE` | const | 24215 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 24218 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `deletePhilosopher` |
| `selectedRelations` | let | 24219 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations` |
| `philosopherTraditions` | const | 24222 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 24228 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics` |
| `filterMode` | let | 24231 | строка | — | `applyFiltersImmediate`×3, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode` |
| `arrowHoverTimer` | let | 24945 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 24946 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 25059 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 25209 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 25236 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25315 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25384 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25514 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt059` |
| `hintBox` | let | 25642 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 25676 | массив (18) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 25696 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 25698 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 25773 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 25926 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 26088 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 26230 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26411 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26412 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26691 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26698 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 26721 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 26846 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 27193 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 27194 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 27195 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 27234 | литерал null | — | `applyMetricsScope`×2, `closeStatsModal` |
| `FORMULA_VERSIONS` | const | 27288 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27324 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27373 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27587 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27588 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 27780 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 27781 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 27927 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 27928 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 28056 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 28118 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 28119 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 28120 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 28129 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28484 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28485 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28487 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28629 | литерал null | — | `metricDescriptions`×5, `philosopherSimilarityData`×4, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28630 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `generativityScores`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28631 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28632 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28633 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28634 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28635 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28636 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 28719 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 28837 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 29020 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 29154 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 29210 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29379 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29387 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29390 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29392 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29394 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29482 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29557 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29562 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29628 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 29686 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 29701 | объект (3) | — | — |
| `_tensionScales` | let | 29707 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 29708 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 29972 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 30022 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 30085 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 30152 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 30208 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30273 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30312 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30416 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30455 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30512 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30567 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30646 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30662 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 30686 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 30747 | литерал null | — | `allConceptPairsAsync`×4, `invalidateSimilarityCache`, `allConceptPairs` |
| `_pairCalculating` | let | 30748 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 30759 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 30829 | литерал null | — | `neighborSets`×3 |
| `PHIL_SIM_MIN_CONCEPTS` | const | 30933 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 30952 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 30958 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 31108 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 31117 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 31149 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 31150 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 31155 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31254 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31300 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31305 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31306 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 31394 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 31432 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 31520 | строка | — | `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 31647 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×5, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 32122 | литерал null | — | `openStatsModal`×4, `handleStatsParameterChange`×3, `stmt054`×2, `stmt071`×2, `effectiveScopeFlags`, `switchStatsView` |
| `isStatsModalOpen` | let | 32123 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt054`, `stmt071` |
| `selectionListOpenBlocks` | let | 32179 | new Set | — | `toggleSelectionBlock`×3, `renderSelectionList` |
| `selectionListOpenBodies` | let | 32180 | new Set | — | `toggleSelectionBody`×3, `toggleSelectionBodies`×3, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` |
| `SELECTION_LIST_CHUNK` | const | 32181 | литерал 400 | — | `setSelectionProvenance`×3, `openSelectionListModal`×3, `selectionListMore`, `renderSelectionList` |
| `selectionListShown` | let | 32182 | объект (3) | — | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBodies`, `selectionListMore`, `renderSelectionList` |
| `selectionProvenance` | let | 32185 | строка | — | `renderSelectionList`×3, `selectionListSets`×2, `setSelectionProvenance` |
| `PROVENANCE_LABELS` | const | 32200 | объект (5) | — | `renderSelectionList`×3 |
| `selectionPhilCount` | let | 32218 | объект (0) | — | `selectionListSets`×4, `selectionRowPhilosopher` |
| `observationItems` | let | 32690 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 32691 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `deleteObservation`×2, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 32969 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 33127 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 33146 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 33147 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 33172 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 33193 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 33194 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 33303 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 33316 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 33440 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 34299 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 34299 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 34311 | строка | — | `renderClosestPairs` |
| `_pairsMinDegree` | var | 34312 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 34313 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 34314 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 34315 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 34317 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 34317 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 34335 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 34436 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 35324 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 35325 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 35326 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 35327 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `selectedSourceNode` | let | 36192 | литерал null | — | `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 36193 | литерал null | — | `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 36323 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 36336 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 36337 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 36338 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 36459 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 36460 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 36536 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 36537 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 36546 | вызов document.getElementById() | — | `resizeCanvas`×6, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 36547 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 36548 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `pickCanvas` | const | 36551 | вызов document.createElement() | — | `resizeCanvas`×2, `repaintPickCanvas`×2, `pickLink`×2, `pickCtx` |
| `pickCtx` | const | 36552 | вызов pickCanvas.getContext() | `pickCanvas` | `repaintPickCanvas`×13, `pickLink` |
| `pickDirty` | let | 36553 | литерал true | — | `refreshHitMaps`, `resizeCanvas`, `draw`, `repaintPickCanvas`, `pickLink`, `gfxZoom`, `stmt016`, `stmt020`, `updateGraphData`, `updateLinkOnGraph` |
| `PICK_LINK_WIDTH` | const | 36557 | литерал 10 | — | `repaintPickCanvas` |
| `dpr` | let | 36559 | выражение | — | `paintLinkLayer`×4, `draw`×4, `repaintPickCanvas`×4, `resizeCanvas`×3, `pickLink`×2 |
| `renderState` | const | 36574 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `drawLinkSet`, `draw`, `startRadiusAnimation`, `toGraph`, `pickNode`, `repaintPickCanvas`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 36588 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowPoints`, `arrowPointsStart` |
| `arrowRadius` | var | 36589 | литерал null | — | `arrowPoints`×2, `arrowPointsStart`×2, `visualizeMetricBySize`, `resetNodeSizes` |
| `uniformLinkWidthActive` | var | 36590 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 36595 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt049`×2, `clearSimilarityOverlay`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 36601 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 36602 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 36843 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 36844 | литерал 1 | — | `renderScene` |
| `drawScheduled` | let | 36852 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 36856 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 36871 | литерал false | — | `ensureAnimLoop`×3 |
| `DRAW_ORDER` | const | 37095 | массив (5) | — | `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 37108 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 37114 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 37238 | литерал 3 | — | `renderScene` |
| `quadtree` | let | 37412 | литерал null | — | `pickNode`×2, `rebuildQuadtree` |
| `nodeHandlers` | const | 37481 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 37481 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 37523 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 37535 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 37545 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 37553 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `pickDirty`, `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 37617 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 37618 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 37620 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 37641 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 37647 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragstarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt076` |
| `maxTicks` | let | 37698 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 37756 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 37759 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 37767 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 37767 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 38028 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 38029 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 38251 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 38277 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 38278 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 38279 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 38280 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 38281 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 38282 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 38293 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `PROFILE_METRICS` | const | 38501 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 38557 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 38793 | объект (4) | — | `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 38804 | массив (0) | — | `pushModalState`×5, `stmt042`×2, `stmt050`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 38805 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 38899 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 38900 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 38901 | объект (1) | — | `setSessionUser`, `renderAuthControls` |
| `authModalKind` | let | 38902 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 38920 | вызов Object.freeze() | — | `renderCommits`×4, `renderObservations`×3, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` |
| `granted` | let | 38938 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 39003 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `pinnedVisibleNodes` | const | 39675 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 39833 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 39835 | литерал false | — | `markDirty`, `hasUnsaved`, `downloadData`, `saveToFolder`, `stmt028` |
| `dataFolder` | let | 39863 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 39908 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationBar`, `loadObservations`, `api`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `historyBlock`, `commitReasonField` |
| `lastSubmitted` | let | 40054 | литерал null | — | `submitChange` |
| `userItems` | let | 40173 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 40174 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 40287 | строка | — | `switchCommitTab`×4, `renderCommits`×2, `loadCommits` |
| `commitItems` | let | 40288 | массив (0) | — | `loadCommits`×3, `renderCommits`×3 |
| `commitError` | let | 40289 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 40325 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 40326 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 40345 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 40356 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 40430 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `LAYOUT_KINDS` | const | 40504 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 40776 | литерал 0 | — | `refreshUnread`×3, `renderBell`×3 |
| `notifyItems` | let | 40777 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 40981 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 41088 | литерал null | — | `connectLive`×5, `stmt036`×2 |
| `liveRetry` | let | 41089 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 41090 | литерал false | — | `connectLive`, `stmt036` |
| `lastConflict` | let | 41178 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 41201 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 41203 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 41258 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 41326 | массив (3) | — | `generateConnectionEditContent` |
| `historyFor` | let | 41355 | литерал null | — | `toggleEntityHistory`×2, `revertEntityToVersion` |
| `historyItems` | let | 41356 | массив (0) | — | `toggleEntityHistory`×2, `renderEntityHistory`×2, `revertEntityToVersion` |
| `historyBusy` | let | 41357 | литерал false | — | `toggleEntityHistory`×3 |
| `GROUNDING_TYPES` | const | 41538 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 42268 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 42963 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 43692 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 44402 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 44438 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 44754 | вызов document.getElementById() | — | `stmt077`×2 |
| `legendDirectionToggle` | const | 44756 | вызов document.getElementById() | — | `stmt078`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 23958 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 23964 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 23973 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 23979 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 24004 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 24040 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 24046 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 24135 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 24223 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 32911 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 32920 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 33441 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 35690 | 3 | `window.addEventListener('load')` | `saveOriginalRadii` |
| stmt014 | обработчик | 36085 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 36307 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 37563 | 37 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `pickNode`, `gfxZoom`, `dragstarted`, `dragended` |
| stmt017 | вызов | 37601 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 37672 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 37676 | 10 | `if (layoutFromStore) { simulation.stop(); layoutSettled = true; // СЧЁ…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 37714 | 16 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 37742 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 37744 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 37849 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 38031 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode` |
| stmt025 | обработчик | 38060 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges` |
| stmt026 | построение | 38284 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 38373 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 39889 | 5 | `window.addEventListener('beforeunload')` | `hasUnsavedEdits` |
| stmt029 | вызов | 40157 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 40263 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 40751 | 12 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `revertCommitFromPanel`, `showImpact` |
| stmt032 | вызов | 40869 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 40870 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | обработчик | 40875 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt035 | вызов | 40908 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt036 | обработчик | 41093 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt037 | обработчик | 43247 | 7 | `document.addEventListener('click')` | — |
| stmt038 | вызов | 44554 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt039 | вызов | 44555 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt040 | вызов | 44560 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt041 | обработчик | 44594 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt042 | обработчик | 44602 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt043 | вызов | 44626 | 1 | `console.log()` | `nodes`, `links` |
| stmt044 | вызов | 44627 | 1 | `initFilters()` | `initFilters` |
| stmt045 | вызов | 44630 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt046 | вызов | 44635 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt047 | вызов | 44644 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt048 | вызов | 44649 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt049 | вызов | 44653 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt050 | вызов | 44656 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt051 | вызов | 44659 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt052 | вызов | 44684 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt053 | вызов | 44685 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt054 | вызов | 44686 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt055 | вызов | 44693 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt056 | вызов | 44697 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt057 | вызов | 44698 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt058 | вызов | 44699 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt059 | вызов | 44700 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt060 | вызов | 44707 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt061 | обработчик | 44709 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt062 | обработчик | 44713 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt063 | обработчик | 44717 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt064 | обработчик | 44721 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt065 | вызов | 44722 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt066 | вызов | 44723 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt067 | вызов | 44725 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt068 | вызов | 44726 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt069 | вызов | 44727 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt070 | вызов | 44728 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt071 | вызов | 44730 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt072 | вызов | 44734 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt073 | вызов | 44736 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt074 | вызов | 44739 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt075 | вызов | 44742 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt076 | обработчик | 44745 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt077 | условие | 44755 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt078 | условие | 44757 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt079 | вызов | 44760 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt080 | условие | 44765 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt081 | вызов | 44767 | 1 | `console.log()` | — |
| stmt082 | вызов | 44768 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt083 | обработчик | 44776 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt084 | обработчик | 44782 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt085 | условие | 44797 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt086 | вызов | 44801 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 25809 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 32911 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 32920 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 35690 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 36085 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 36203 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 36307 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 37553 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 37563 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 37563 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 37563 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 37714 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 37742 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 37744 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 37836 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 37837 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 37838 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 37839 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 37846 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 38031 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 38031 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 38060 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 38060 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 38060 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 38373 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 38986 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 39067 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 39889 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 40263 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 40751 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 40875 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt034` |
| 41063 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 41073 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 41078 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 41093 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt036` |
| 42913 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 42914 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 43247 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt037` |
| 43385 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 44485 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 44515 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 44530 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 44594 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt041` |
| 44602 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt042` |
| 44709 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt061` |
| 44713 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt062` |
| 44717 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt063` |
| 44721 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt064` |
| 44745 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt076` |
| 44776 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt083` |
| 44782 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt084` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27415 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27428 | `installMetricScopeWrappers` | `window[name]` | запись |
| 35497 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 38864 | `modalContentFor` | `window[name]` | чтение |
| 38870 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| `openUniversalModal` | да | 0 | 27 | `onclick` | `conceptPlate`, `findAndShowPath`, `generateConceptEditContent`, `generateConceptViewContent`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent`, `linkArrow`, `philosopherTraditionsBlock`, `selectionRowConcept`, `selectionRowPhilosopher`, `selectionRowRelation`, `showAllConcepts`, `showConceptProfileModal`, `showPathDescriptionsModal`, `showPhilosopherProfileModal` |
| `escapeAttr` | да | 0 | 13 | `onclick` | `generatePhilosopherEditContent`, `historyBlock`, `layoutHistoryHtml`, `observationBar`, `renderEntityHistory`, `renderObservations`, `selectionRowConcept`, `selectionRowPhilosopher`, `selectionRowRelation` |
| `renderClosestPairs` | да | 0 | 6 | `onchange`, `onclick`, `oninput` | `generateClosestPairsContent` |
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
| `openConceptById` | да | 0 | 3 | `onclick` | `findAndShowPath`, `showPathDescriptionsModal`, `similarConceptsBlock` |
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
| `selectSearchResult` | да | 0 | 1 | `onclick` | `displaySearchResults` |
| `selectPhilosopherResult` | да | 0 | 1 | `onclick` | `handlePhilosopherSearch` |
| `selectCustomOption` | да | 0 | 1 | `onclick` | `populateCustomSelect` |
| `setSimilarityLinks` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
| `clearSimilarityOverlay` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
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
| 5091 | `onclick` | (страница) | `closeUniversalModal()` |
| 5100 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 5105 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 5111 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 5123 | `onclick` | (страница) | `toggleLegendSearch()` |
| 5128 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 5130 | `onclick` | (страница) | `setSearchKind('concept')` |
| 5132 | `onclick` | (страница) | `setSearchKind('connection')` |
| 5141 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 5142 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 5143 | `onclick` | (страница) | `clearLegendSearch()` |
| 5153 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5154 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5155 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 5166 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 5167 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 5176 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 5177 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5188 | `onclick` | (страница) | `openStatsModal()` |
| 5200 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5212 | `onclick` | (страница) | `resetNodeSizes()` |
| 5219 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5224 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5225 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5236 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5267 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5275 | `onclick` | (страница) | `toggleSection('relations')` |
| 5280 | `onclick` | (страница) | `selectAllRelations()` |
| 5281 | `onclick` | (страница) | `deselectAllRelations()` |
| 5302 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5307 | `onclick` | (страница) | `selectAllRubrics()` |
| 5308 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5315 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5320 | `onclick` | (страница) | `selectAllTraditions()` |
| 5321 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5355 | `onclick` | (страница) | `openSelectionListModal()` |
| 5366 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5379 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5380 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5393 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5394 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5399 | `onclick` | (страница) | `findAndShowPath()` |
| 5442 | `onclick` | (страница) | `resetSimulation()` |
| 5443 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5444 | `onclick` | (страница) | `centerGraph()` |
| 5445 | `onclick` | (страница) | `toggleGrouping()` |
| 5446 | `onclick` | (страница) | `downloadData()` |
| 5447 | `onclick` | (страница) | `saveToFolder()` |
| 5449 | `onclick` | (страница) | `exportToPNG()` |
| 5450 | `onclick` | (страница) | `exportToSVG()` |
| 5453 | `onclick` | (страница) | `openAboutModal()` |
| 5456 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5458 | `onclick` | (страница) | `closeAboutModal()` |
| 5468 | `onclick` | (страница) | `closeUsersPanel()` |
| 5477 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5478 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5479 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5484 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5492 | `onclick` | (страница) | `openCommitsPanel()` |
| 5493 | `onclick` | (страница) | `openUsersPanel()` |
| 5494 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5498 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5511 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5512 | `onclick` | (страница) | `closeConflictModal()` |
| 5546 | `onclick` | (страница) | `closeSelectionListModal()` |
| 5565 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5571 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5577 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5583 | `onclick` | (страница) | `closeStatsModal()` |
| 5597 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5601 | `onclick` | (страница) | `switchStatsView('observations')` |
| 5605 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5609 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5613 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5617 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5621 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5625 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5629 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5633 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5637 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5641 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5645 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5649 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5661 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5665 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5669 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5681 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5685 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5697 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5701 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5713 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5717 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5729 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5741 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5745 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5757 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5761 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5765 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5769 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5773 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5777 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5781 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5793 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5805 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5809 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5813 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5817 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5829 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5833 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 24733 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24767 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 24814 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 24818 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 24819 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 24920 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 24923 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25090 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 25109 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 25112 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 25149 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25283 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25406 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25459 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 26757 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 26773 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 26797 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 26802 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 26804 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 26820 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29359 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29367 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 32372 | `onclick` | `selectionRowPhilosopher` | `openUniversalModal('philosopher', '${escapeAttr(p.nameRu)}', 'view')` |
| 32374 | `onclick` | `selectionRowPhilosopher` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32395 | `onclick` | `selectionRowConcept` | `openUniversalModal('concept', nodes.find(x => x.id === '${escapeAttr(n.id)}'), 'view')` |
| 32397 | `onclick` | `selectionRowConcept` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32432 | `onclick` | `selectionRowRelation` | `openUniversalModal('connection', links.find(x => (x.source.id\|\|x.source) === '${escapeAttr(s)}' && (x.target.id\|\|x.target) === '${escapeAttr(t)}'), 'view')` |
| 32434 | `onclick` | `selectionRowRelation` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32463 | `onclick` | `renderSelectionList` | `setSelectionProvenance('${v}')` |
| 32475 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32478 | `onclick` | `renderSelectionList` | `toggleSelectionBodies('${kind}')` |
| 32481 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32487 | `onclick` | `renderSelectionList` | `selectionListMore('${kind}')` |
| 32618 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 32748 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 32755 | `onclick` | `renderObservations` | `deleteObservation('${escapeAttr(z.observationId)}')` |
| 32991 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 33280 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 33508 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 33540 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 33545 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 33552 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 33602 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 33610 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 33617 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 33754 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 34358 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 34363 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 34452 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 34480 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 34511 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 34512 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 34517 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 34522 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 34526 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 34531 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 34615 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 34666 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 34667 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 35008 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 35197 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 35238 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 36023 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 36135 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 36248 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 36809 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 36823 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 36839 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 38437 | `onclick` | `similarConceptsBlock` | `openConceptById('${x.id}')` |
| 38464 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 38623 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 38643 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 38652 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 38659 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 38756 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 38976 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 38977 | `onclick` | `openAuthModal` | `submitAuth()` |
| 39032 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 39034 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 39062 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 39092 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 39095 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 39136 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 39310 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 39311 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 39314 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 39315 | `onclick` | `renderAuthControls` | `authLogout()` |
| 39389 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 39399 | `onclick` | `openUniversalModal` | `popModalState()` |
| 40515 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(item.id))}')` |
| 40538 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 40539 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 40546 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 40553 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 40566 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 40567 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 41285 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 41378 | `onclick` | `historyBlock` | `toggleEntityHistory('${escapeAttr(kind)}', '${escapeAttr(entityId)}')` |
| 41437 | `onclick` | `renderEntityHistory` | `revertEntityToVersion('${escapeAttr(kind)}', '${escapeAttr(entityId)}', ${Number(commit.версия)})` |
| 42290 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 42375 | `onclick` | `modalActions` | `${saveFn}()` |
| 42378 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 42382 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 42430 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 42438 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 42442 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 42509 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 42512 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 42515 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 42520 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 42631 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 42634 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 42637 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 42660 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 42778 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 42818 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 42881 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 42989 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 42993 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 43187 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 43210 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 43211 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 43312 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 43412 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 43413 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 43414 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 43421 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 43428 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 43431 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 43482 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 43492 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 43525 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 43530 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 43553 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 43583 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 43588 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 43636 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 43644 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 43791 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 43873 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 43905 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 43952 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 43953 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 43954 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 43966 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 44122 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 44138 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 44154 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 44208 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 44216 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 44219 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 44274 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 44286 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 44305 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 44307 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 44310 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 44333 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 44352 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 44355 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 44359 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28589 | 34 | — |
| `TENSION_WEIGHTS` | const | 29701 | 5 | — |
| `tensionScales` | function | 29710 | 23 | — |
| `searchNodes` | function | 36003 | 3 | — |
| `toggleSimilarityKind` | function | 36711 | 5 | — |
| `hasUnsaved` | function | 39838 | 1 | — |
| `graphSelectionContext` | window-объявление | 41258 | 1 | — |
| `generatePhilosopherEditContent` | function | 42417 | 117 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 42539 | 132 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 42756 | 97 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 43158 | 85 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 43398 | 267 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 43931 | 455 | вероятно цель `window[…]` в `modalContentFor` |


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
| `document` | 355 |
| `Math` | 146 |
| `Set` | 111 |
| `Object` | 74 |
| `Map` | 51 |
| `undefined` | 50 |
| `console` | 48 |
| `String` | 47 |
| `window` | 44 |
| `Array` | 39 |
| `setTimeout` | 38 |
| `d3` | 29 |
| `alert` | 25 |
| `Promise` | 18 |
| `Boolean` | 16 |
| `encodeURIComponent` | 16 |
| `Number` | 14 |
| `Infinity` | 10 |
| `clearTimeout` | 9 |
| `Date` | 8 |
| `confirm` | 7 |
| `URL` | 6 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `prompt` | 5 |
| `event` | 4 |
| `JSON` | 4 |
| `Uint16Array` | 3 |
| `Float32Array` | 2 |
| `Blob` | 2 |
| `requestAnimationFrame` | 2 |
| `getComputedStyle` | 2 |
| `WebSocket` | 2 |
| `location` | 2 |
| `isNaN` | 1 |
| `parseFloat` | 1 |
| `decodeURIComponent` | 1 |
| `fetch` | 1 |
