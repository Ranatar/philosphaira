# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 119 143 знаков, 45 727 строк; встроенный скрипт — строки 5895–45725. Составлено 2026-09-18 09:57:27 UTC.

Всего глобальных сущностей: **1069** — функций 673
(из них асинхронных 42), `const` 123, `let` 166,
`var` 15, операторов верхнего уровня 86.
Обработчиков событий 52; вызовов из разметки:
статической 110, порождаемой 164.

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
| `nodes` | const | 24037 | 131 | 81 |
| `escapeAttr` | function | 42417 | 104 | 25 |
| `ModalContext` | const | 39703 | 75 | 26 |
| `conceptById` | const | 24105 | 71 | 46 |
| `links` | const | 24055 | 69 | 50 |
| `similarityOverlay` | var | 37427 | 64 | 16 |
| `renderState` | const | 37406 | 62 | 33 |
| `concepts` | const | 6860 | 59 | 51 |
| `emit` | function | 25773 | 54 | 39 |
| `relations` | const | 12784 | 53 | 47 |
| `selectedPhilosophers` | let | 24246 | 53 | 18 |
| `_conceptMap` | let | 28687 | 53 | 23 |
| `philosopherConcepts` | const | 23991 | 47 | 29 |
| `relationTypesObj` | const | 24006 | 47 | 32 |
| `useWeightedPaths` | let | 24165 | 47 | 18 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 23893 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 23912 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 23947 | 32 | (positions) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 24023 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 24112 | 51 | () | `linksByConcept`×7, `nodesByPhilosopher`×4, `nodes`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links`, `compareConcepts`, `compareLinks` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 24184 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 24188 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 24221 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 24228 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 24230 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 24252 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 24262 | 23 | () | `nodes` | `stmt074` | — | — |
| `strictChronologyCheck` | function | 24296 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24353 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24364 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24376 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24438 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24487 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24493 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24516 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24528 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24632 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24703 | 271 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `emit`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | `applyLinkState` | статич.×1 | — |
| `handlePathArrowHover` | function | 24979 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 25023 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 25062 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 25082 | 7 | () | `emit`, `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 25094 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 25224 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 25243 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 25270 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25285 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25303 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25328 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25333 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25351 | 6 | () | `chosenPhilosophers` | `stmt058` | — | — |
| `highlightPhilosopherOnGraph` | function | 25358 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25418 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25448 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25456 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25467 | 33 | () | `relationTypesObj`, `links`, `linkSearch`, `directionMark`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25501 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25525 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25548 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25560 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt059` | статич.×1 | — |
| `buildAboutText` | function | 25572 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25655 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25661 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25667 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25676 | 20 | (el, text) | `hintBox`×9 | `stmt061` | — | — |
| `hideHint` | function | 25697 | 3 | () | `hintBox`×2 | `stmt062`, `stmt063`, `stmt064` | — | — |
| `subscribe` | function | 25733 | 17 | (event, handler, phase) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `initLinkState`, `stmt029`, `stmt032`, `stmt033`, `stmt035`, `stmt045`, `stmt046`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt065`, `stmt066`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071` | — | — |
| `emit` | function | 25773 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `applyFiltersImmediate`×2, `handleMetricsScopeChange`×2, `openPairInComparison`×2, `handleLinkClick`×2, `showSimilarityOverlay`×2, `dispatchClick`×2, `applyServerLayout`, `findAndShowPath`, `clearPathHighlight`, `refreshMetricsIfScoped`, `setInfluenceScope`, `closeStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `renderClosestPairs`, `toggleMetricVisualization`, `selectCustomOption`, `setSimilarityLinks`, `clearSimilarityOverlay`, `highlightCombined`, `submitAuth`, `openUniversalModal`, `closeUniversalModal`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt040` | — | — |
| `debounce` | function | 25791 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 25869 | 30 | (message, duration=…) | — | `showSimilarityOverlay`×6, `handleUniqueChainsMode`×5, `handleChainsMode`×4, `applyLinkState`×2, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt080` | — | — |
| `buildAdjacencyGraph` | function | 25906 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 25988 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 26124 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 26134 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 26183 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 26258 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26448 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `selectionListSets`, `displaySearchResults`, `selectSearchResult`, `rebuildQuadtree` | — | — |
| `isLinkVisible` | function | 26449 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `selectionListSets`, `exportToSVG`, `needsContinuousAnimation`, `paintLinkLayer`, `repaintPickCanvas` | — | — |
| `applyBasicFilter` | function | 26451 | 53 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26508 | 8 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `refreshHitMaps` | function | 26537 | 4 | () | `pickDirty`, `rebuildQuadtree` | `applyBasicFilter`, `applyChainVisibility` | — | — |
| `handleChainsMode` | async function | 26545 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26608 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26677 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26695 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26703 | 22 | () | `filterMode`×3, `emit`×2, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `applyLinkState`, `selectSearchResult`, `stmt053` | — | — |
| `applyFilters` | function | 26728 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 26762 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 26775 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION` | `stmt044`, `stmt051` | — | — |
| `togglePhilosopher` | function | 26866 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 26895 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 26919 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 26928 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 26934 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 26943 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 26951 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `applyLinkState`×2, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 26975 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt046` | — | — |
| `onlyTradition` | function | 27004 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 27011 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 27021 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 27030 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 27039 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 27048 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 27057 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 27067 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 27076 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 27088 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 27132 | 4 | (mode) | `filterMode`, `applyFilters` | `applyLinkState` | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 27138 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 27148 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt045`, `stmt048`, `stmt072` | — | — |
| `updateProvenanceCoverage` | function | 27175 | 40 | () | `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 27232 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 27233 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 27241 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 27254 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `liveScopeKey` | function | 27280 | 4 | () | `metricsScope`×2, `useWeightedPaths`, `respectDirection` | `applyMetricsScope`, `closeStatsModal` | — | — |
| `applyMetricsScope` | function | 27286 | 36 | (viewName) | `lastScopeKey`×4, `metricsScopeActive`×3, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27451 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27468 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27489 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27523 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27649 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `ensureNetworkProfile`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 27817 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 27829 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 27842 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 27976 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 27990 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 28036 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 28105 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 28117 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 28164 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 28186 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 28293 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 28301 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28331 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28352 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28423 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28431 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28490 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28551 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28557 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28635 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28644 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28698 | 5 | (r) | — | `buildIncomingLinks`, `buildOutgoingLinks`, `drawLinkSet`, `repaintPickCanvas`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28709 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28719 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28724 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 28739 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 28758 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 28777 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 28887 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 28895 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 29070 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 29078 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 29204 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 29211 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 29260 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 29267 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29371 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29383 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29394 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29455 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29477 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29484 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29489 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29532 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29539 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29607 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29619 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29678 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29685 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 29736 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 29765 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 29789 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 29794 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 30022 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 30029 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 30072 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 30079 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 30135 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 30142 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 30202 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 30209 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 30258 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 30265 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30323 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30330 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30362 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30372 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30462 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30473 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30505 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30512 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30562 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30569 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30617 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30628 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30692 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30718 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful`, `similarNetworkColumnHtml` | — | — |
| `nodeDegreeOf` | function | 30730 | 7 | (conceptId) | `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful`, `networkSimilarityData`, `similarNetworkColumnHtml` | — | — |
| `profileIsMeaningful` | function | 30738 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `showSimilarityOverlay`×3, `nearestConcepts`×2, `similarityVerdict`×2, `renderComparison`×2, `similarityThresholds`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `similarityData` | function | 30743 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `similarityThresholds`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 30792 | 9 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `_typeStyleCache`, `_netSimCache`, `_simThresholdCache`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 30810 | 8 | () | `_pairCache`×5, `networkSimilarityData` | `allConceptPairsAsync`, `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 30824 | 63 | (progressCallback) | `_pairCache`×3, `_pairCalculating`×3, `normedDot`×2, `similarityData`, `allConceptPairs`, `PAIRS_CHUNK_ROWS`, `neighborSets`, `typeStyleData`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `fillPairsNetwork` | function | 30888 | 11 | (P) | `normedDot`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 30900 | 9 | (idA, idB) | `similarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 30913 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 30926 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `typeStyleData` | — | — |
| `structuralSimilarity` | function | 30934 | 13 | (idA, idB) | `neighborSets` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `zColumns` | function | 30950 | 15 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `centerRows` | function | 30966 | 6 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `vectorNorm` | function | 30972 | 5 | (v) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `normedDot` | function | 30977 | 6 | (a, na, b, nb) | — | `similarityThresholds`×3, `allConceptPairsAsync`×2, `fillPairsNetwork`, `typeStyleSimilarity`, `networkSimilarity` | — | — |
| `typeStyleData` | function | 30999 | 15 | () | `_typeStyleCache`×4, `_concepts`, `_relations`, `typeProfileOf`, `zColumns`, `centerRows`, `vectorNorm` | `allConceptPairsAsync`, `typeStyleSimilarity`, `similarityThresholds` | — | — |
| `typeStyleSimilarity` | function | 31014 | 6 | (idA, idB) | `normedDot`, `typeStyleData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `metricValueMap` | function | 31046 | 9 | (res) | — | `networkSimilarityData` | — | — |
| `networkSimilarityData` | function | 31056 | 15 | () | `_netSimCache`×5, `betweennessCache`, `pageRankCache`, `closenessCache`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `eigenvectorCache`, `_concepts`, `nodeDegreeOf`, `zColumns`, `centerRows`, `vectorNorm`, `NETWORK_SIM_NAMES`, `metricValueMap` | `ensureNetworkProfile`×2, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkSimilarity`, `networkRoleOf`, `networkProgressPercent`, `similarityThresholds`, `nearestConcepts`, `applyLinkState`, `showSimilarityOverlay` | — | — |
| `networkSimilarity` | function | 31072 | 7 | (idA, idB) | `normedDot`, `networkSimilarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `networkRoleOf` | function | 31083 | 11 | (id) | `NETWORK_ROLE_OF`, `networkSimilarityData` | `similarityVerdict` | — | — |
| `networkProgressPercent` | function | 31104 | 10 | () | `NETWORK_PROGRESS_WEIGHTS`×2, `betweennessCache`, `pageRankCache`, `closenessCache`, `eigenvectorCache`, `networkSimilarityData`, `_netProgress` | `ensureNetworkProfile`, `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `ensureNetworkProfile` | function | 31119 | 38 | (onProgress) | `_netSimPending`×5, `_netProgressListeners`×3, `networkSimilarityData`×2, `_netProgress`×2, `betweennessCache`, `calculateBetweennessAsync`, `pageRankCache`, `calculatePageRank`, `closenessCache`, `calculateClosenessCentrality`, `eigenvectorCache`, `calculateEigenvectorCentrality`, `networkProgressPercent` | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `liveProgressHtml` | function | 31163 | 3 | (pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `updateLiveProgress` | function | 31166 | 4 | (root, pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `similarityNeedsDegree` | function | 31173 | 3 | (kind) | — | `nearestConcepts`×2, `showSimilarityOverlay` | — | — |
| `similarityOf` | function | 31176 | 7 | (kind, idA, idB) | `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity` | `nearestConcepts` | — | — |
| `similarityThresholds` | function | 31192 | 28 | () | `_simThresholdCache`×4, `normedDot`×3, `profileIsMeaningful`, `similarityData`, `typeStyleData`, `networkSimilarityData`, `SIM_VERDICT_HIGH_Q`, `SIM_VERDICT_LOW_Q` | `similarityVerdict` | — | — |
| `nearestConcepts` | function | 31221 | 51 | (conceptId, kind, k) | `profileIsMeaningful`×2, `similarityNeedsDegree`×2, `similarityData`, `networkSimilarityData`, `similarityOf` | `similarConceptsBlock`×3, `similarNetworkColumnHtml` | — | — |
| `rubricUnionSize` | function | 31300 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 31307 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 31398 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 31400 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 31406 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 31427 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 31469 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 31485 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 31504 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 31553 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 31557 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 31563 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31603 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31655 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 31728 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 31732 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 31743 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 31767 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 31784 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 31797 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 31826 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 31831 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 31869 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 31880 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 31889 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt047` | — | — |
| `handleMetricsScopeChange` | function | 31904 | 9 | () | `emit`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyLinkState`×2 | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 31918 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt047`, `stmt073` | — | — |
| `getMetricDescription` | function | 32453 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 32474 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2, `applyLinkState` | статич.×1, динам.×1 | — |
| `provenanceState` | function | 32541 | 6 | (z) | — | `selectionListSets` | — | — |
| `setSelectionProvenance` | function | 32556 | 9 | (value) | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `selectionProvenance`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListSets` | function | 32569 | 61 | () | `selectionPhilCount`×4, `selectionProvenance`×2, `philosophers`, `nodes`, `links`, `isNodeVisible`, `isLinkVisible`, `provenanceState`, `selectionMirrorCount`, `linkHasTwoHeads`, `comparePhilosophers`, `compareConcepts`, `linkIsInternal`, `compareLinks` | `toggleSelectionBodies`, `renderSelectionList` | — | — |
| `openSelectionListModal` | function | 32631 | 12 | () | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `renderSelectionList`, `freezeSimulation` | — | статич.×1 | — |
| `closeSelectionListModal` | function | 32644 | 4 | () | `unfreezeSimulation` | — | статич.×1 | — |
| `toggleSelectionBlock` | function | 32649 | 5 | (kind) | `selectionListOpenBlocks`×3, `renderSelectionList` | — | динам.×2 | — |
| `toggleSelectionBody` | function | 32655 | 5 | (key) | `selectionListOpenBodies`×3, `renderSelectionList` | — | динам.×3 | — |
| `toggleSelectionBodies` | function | 32671 | 11 | (kind) | `selectionListOpenBodies`×3, `selectionListShown`, `selectionListSets`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListMore` | function | 32686 | 4 | (kind) | `SELECTION_LIST_CHUNK`, `selectionListShown`, `renderSelectionList` | — | динам.×1 | — |
| `linkHasTwoHeads` | function | 32710 | 5 | (l) | `relationTypesObj` | `selectionListSets`, `directionMark`, `exportToSVG`, `fillArrow` | — | — |
| `directionMark` | function | 32716 | 12 | (l) | `linkHasTwoHeads` | `selectionRowRelation`×2, `generatePhilosopherViewContent`×2, `showFoundLinks` | — | — |
| `selectionLabel` | function | 32732 | 4 | (id) | `conceptById` | `selectionRowRelation`×2 | — | — |
| `selectionRowPhilosopher` | function | 32737 | 15 | (p) | `escapeAttr`×5, `selectionListOpenBodies`, `selectionPhilCount` | `renderSelectionList` | — | — |
| `selectionRowConcept` | function | 32760 | 15 | (n) | `escapeAttr`×5, `philosopherConcepts`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `openSelectionLink` | function | 32788 | 7 | (s, t) | `links`, `openUniversalModal` | — | динам.×1 | — |
| `selectionRowRelation` | function | 32796 | 32 | (l) | `escapeAttr`×8, `directionMark`×2, `selectionLabel`×2, `relationTypesObj`, `conceptById`, `selectionListOpenBodies`, `linkIsInternal`, `otherEndColor` | `renderSelectionList` | — | — |
| `renderSelectionList` | function | 32829 | 82 | () | `selectionProvenance`×3, `PROVENANCE_LABELS`×3, `selectionMirrorCount`×2, `conceptById`, `selectionListOpenBlocks`, `SELECTION_LIST_CHUNK`, `selectionListShown`, `selectionListSets`, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation`, `escapeAttr` | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBlock`, `toggleSelectionBody`, `toggleSelectionBodies`, `selectionListMore` | — | — |
| `closeStatsModal` | function | 32912 | 33 | () | `lastScopeKey`×3, `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `emit`, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt065` | статич.×1 | — |
| `handleStatsParameterChange` | function | 32947 | 32 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `emit`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | `applyLinkState`×2 | статич.×2 | — |
| `switchStatsView` | function | 32981 | 16 | (viewName, event) | `emit`, `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `applyLinkState`, `stmt057` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 32999 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 33023 | 21 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `PERM`, `can`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 33050 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 33078 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 33115 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 33122 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent`, `deleteObservation` | — | — |
| `renderObservations` | function | 33146 | 46 | () | `escapeAttr`×7, `observationPicked`×4, `PERM`×3, `can`×3, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `deleteObservation` | async function | 33202 | 18 | (id) | `observationPicked`×2, `loadObservations`, `api`, `escapeAttr` | — | динам.×1 | — |
| `pickObservation` | function | 33221 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 33234 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 33262 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt054`, `stmt071` | — | — |
| `calculateMetricFromModal` | async function | 33349 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 33402 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 33424 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 33430 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `comparePhilosophers` | function | 33446 | 14 | (a, b) | `philosopherByName` | `compareLinks`×2, `selectionListSets`, `sortPhilosophersByBirth`, `compareConcepts`, `pickPhilosophers`, `philosopherTraditionsBlock` | — | — |
| `sortPhilosophersByBirth` | function | 33461 | 3 | (list) | `comparePhilosophers` | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `compareConcepts` | function | 33469 | 4 | (a, b) | `comparePhilosophers` | `rebuildIndexes`, `selectionListSets` | — | — |
| `linkIsInternal` | function | 33499 | 5 | (l) | `conceptById`×2 | `compareLinks`×2, `selectionListSets`, `selectionRowRelation` | — | — |
| `otherEndColor` | function | 33523 | 7 | (l, ownerName) | `conceptById`, `philosopherByName` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `selectionRowRelation` | — | — |
| `compareLinks` | function | 33531 | 12 | (a, b) | `comparePhilosophers`×2, `linkIsInternal`×2, `conceptById` | `rebuildIndexes`, `selectionListSets` | — | — |
| `philosopherYears` | function | 33543 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 33562 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 33588 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 33596 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 33609 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 33617 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 33621 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 33626 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 33656 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 33672 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 33674 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 33687 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 33728 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 33764 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 33840 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 33906 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 33920 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 33926 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 34094 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 34124 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 34161 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 34226 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 34242 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 34258 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 34274 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 34290 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 34306 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 34322 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 34342 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 34366 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 34390 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 34414 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 34438 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 34462 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 34486 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 34510 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 34534 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 34559 | 195 | () | `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 34798 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 34831 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 34898 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 34920 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 34954 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 34959 | 42 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function ⟲ | 35002 | 108 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsKind`×2, `_pairsMinShared`×2, `emit`, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×8 | — |
| `openPairInComparison` | function | 35111 | 5 | (a, b) | `emit`×2, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 35117 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `similarityVerdict` | function | 35172 | 49 | (idA, idB) | `profileIsMeaningful`×2, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `NETWORK_ROLE_WORDS`, `networkSimilarity`, `networkRoleOf`, `SIM_SHARED_HIGH`, `similarityThresholds` | `renderComparison` | — | — |
| `computeComparisonNetwork` | function | 35222 | 7 | () | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `renderComparison` | — | динам.×1 | — |
| `renderComparison` | function | 35230 | 68 | () | `_cmpA`×8, `_cmpB`×8, `conceptById`×2, `profileIsMeaningful`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity`, `similarityVerdict` | `loadStatsContent`×2, `applyLinkState`×2, `computeComparisonNetwork`, `stmt056` | — | — |
| `generateGenerativeContent` | function | 35299 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 35319 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 35339 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 35368 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 35395 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 35415 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 35439 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 35463 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 35487 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 35511 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 35569 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 35612 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 35651 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 35689 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 35734 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 35812 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 35875 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 35917 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt079` | — | — |
| `toggleMetricVisualization` | function | 35930 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 36064 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 36082 | 110 | (metricData, metricName) | `gfxNode`×2, `nodes`, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 36194 | 39 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `philosopherIdByName` | function | 36276 | 4 | (name) | `philosophers` | `currentLinkState`×3 | — | — |
| `philosopherNameById` | function | 36280 | 4 | (id) | `philosophers` | `applyLinkState`×2 | — | — |
| `excludedList` | function | 36286 | 8 | (set, all, toKey) | — | `currentLinkState`×3 | — | — |
| `currentLinkState` | function | 36295 | 63 | () | `ModalContext`×6, `similarityOverlay`×5, `currentStatsView`×4, `philosopherIdByName`×3, `excludedList`×3, `filterMode`×2, `_cmpA`×2, `_cmpB`×2, `_pairsKind`×2, `selectedSourceNode`×2, `selectedTargetNode`×2, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `selectedPhilosophers`, `selectedRelations`, `selectedRubrics` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `linkStateToHash` | function | 36359 | 8 | (st) | `LINK_KEYS` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `hashToLinkState` | function | 36368 | 15 | (hash) | `LINK_KEYS` | `initLinkState`×2 | — | — |
| `syncLinkHash` | function | 36385 | 11 | (push) | `_linkLastHash`×2, `_linkApplying`, `currentLinkState`, `linkStateToHash` | `initLinkState` | — | — |
| `applyLinkState` | function | 36397 | 111 | (st) | `conceptById`×6, `selectedPhilosophers`×3, `selectedRelations`×3, `selectedRubrics`×3, `showTemporaryMessage`×2, `syncPhilosopherCheckboxes`×2, `handleMetricsScopeChange`×2, `handleStatsParameterChange`×2, `renderComparison`×2, `_linkApplying`×2, `philosopherNameById`×2, `selectCustomOption`×2, `openUniversalModal`×2, `rubrics`, `relations`, `philosopherConcepts`, `relationTypesObj`, `filterMode`, `findAndShowPath`, `applyFiltersImmediate`, `changeFilterMode`, `networkSimilarityData`, `currentStatsView`, `openStatsModal`, `switchStatsView`, `_cmpA`, `_cmpB`, `_pairsKind`, `_linkMissed`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `similarityOverlay`, `showSimilarityOverlay`, `setSimilarityLinks`, `openConceptById` | `initLinkState`×2 | — | — |
| `initLinkState` | function | 36509 | 15 | () | `hashToLinkState`×2, `applyLinkState`×2, `subscribe`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `syncLinkHash` | `stmt013` | — | — |
| `showProgress` | function | 36533 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 36546 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 36552 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 36627 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 36647 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 36686 | 74 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `nodes`×2, `isNodeVisible`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `linkHasTwoHeads`, `renderState`, `nodeRadius`, `nodeLabelDy`, `arrowPoints`, `arrowPointsStart`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 36765 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 36790 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 36819 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 36831 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 36835 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 36839 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 36863 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 36899 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 36941 | 10 | (query) | `philosophers`, `comparePhilosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 36952 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 36979 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 36984 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 36993 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 37003 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 37027 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 37052 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 37062 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 37069 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 37086 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 37101 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 37113 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `applyLinkState`×2 | динам.×1 | — |
| `handleNodeClick` | function | 37172 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 37294 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 37323 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 37393 | 11 | () | `gfxCanvas`×6, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `pickCanvas`×2, `pickDirty`, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 37437 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function ⟲ | 37449 | 126 | (sourceId, kind) | `showTemporaryMessage`×6, `profileIsMeaningful`×3, `similarityOverlay`×3, `emit`×2, `concepts`, `relations`, `nodes`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarityData`, `networkSimilarity`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `similarityNeedsDegree`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState`, `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 37576 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 37605 | 7 | (mode) | `similarityOverlay`×2, `emit`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState` | динам.×1 | — |
| `nodeLitBySimilarity` | function | 37617 | 9 | (id) | `similarityOverlay`×5, `SIGNED_SIMILARITY` | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 37628 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 37643 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 37656 | 6 | () | `emit`, `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt049` | динам.×1 | — |
| `updateSimilarityLegend` | function | 37663 | 49 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIGNED_SIMILARITY`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 37716 | 1 | (d) | `renderState` | `exportToSVG`, `drawSelfLoop`, `renderScene`, `startRadiusAnimation`, `pickNode` | — | — |
| `nodeLabelDy` | function | 37717 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 37718 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×6 | — | — |
| `hasLinkClass` | function | 37719 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `setPainter` | function | 37727 | 1 | (handler) | `painter` | `stmt060` | — | — |
| `requestDraw` | function | 37729 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 37749 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 37760 | 9 | () | `renderState`×2, `links`, `isLinkVisible`, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 37769 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 37780 | 4 | (d) | `renderState` | `arrowPoints`, `arrowPointsStart`, `linkDrawWidth` | — | — |
| `linkHoverStrokeWidth` | function | 37784 | 4 | (d) | `renderState` | `linkDrawWidth`, `drawLinkSet` | — | — |
| `arcParams` | function | 37790 | 15 | (s, t) | — | `arrowPoints`, `arrowPointsStart`, `strokeLink`, `renderScene` | — | — |
| `arrowPoints` | function | 37807 | 26 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `arrowPointsStart` | function | 37837 | 28 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `linkVisualState` | function | 37872 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawWidth` | function | 37880 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawAlpha` | function | 37889 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `drawLinkSet`×2, `exportToSVG` | — | — |
| `strokeLink` | function | 37911 | 8 | (c, l, width) | `arcParams` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `drawSelfLoop` | function | 37923 | 27 | (c, l, sw, col, alpha) | `nodeRadius` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `fillArrow` | function | 37951 | 13 | (c, l, sw) | `linkHasTwoHeads`, `arrowPoints`, `arrowPointsStart` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkOutOfLayer` | function | 37997 | 5 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 38002 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene` | — | — |
| `linksLayerKey` | function | 38017 | 19 | (c) | `renderState`×5, `nodes`×2, `links`, `visibleLinkSet`, `similarityOverlay`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 38036 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 38042 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 38066 | 36 | (c, tms, take) | `relationTypesObj`×4, `linkDrawAlpha`×2, `links`, `isReflexiveLink`, `renderState`, `linkHoverStrokeWidth`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 38110 | 138 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×6, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `arcParams`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 38249 | 10 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `pickDirty`, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt060` | — | — |
| `startRadiusAnimation` | function | 38261 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 38267 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `rebuildQuadtree` | function | 38283 | 5 | () | `nodes`, `isNodeVisible`, `quadtree` | `refreshHitMaps`, `pickNode`, `stmt016`, `stmt020`, `updateGraphData` | — | — |
| `toGraph` | function | 38289 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `dispatchMove` | — | — |
| `pickNode` | function | 38294 | 9 | (gx, gy) | `quadtree`×2, `renderState`, `nodeRadius`, `rebuildQuadtree` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `repaintPickCanvas` | function | 38304 | 30 | () | `pickCtx`×13, `dpr`×4, `links`×2, `pickCanvas`×2, `isLinkVisible`, `isReflexiveLink`, `pickDirty`, `PICK_LINK_WIDTH`, `renderState`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow` | `pickLink` | — | — |
| `pickLink` | function | 38335 | 12 | (clientX, clientY) | `links`×2, `pickCanvas`×2, `dpr`×2, `gfxCanvas`, `pickCtx`, `pickDirty`, `repaintPickCanvas` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 38353 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 38369 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 38420 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 38514 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 38537 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 38567 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 38579 | 4 | () | `tickCount`, `layoutSettled` | `dragstarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 38639 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 38670 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 38705 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 38722 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 38729 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 38739 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 38749 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 38849 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 38885 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragstarted` | function | 39056 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 39066 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 39072 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 39085 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 39097 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 39110 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 39123 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `openSelectionListModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 39128 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeSelectionListModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 39166 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 39188 | 14 | () | — | `stmt075` | — | — |
| `toggleGrouping` | function | 39203 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 39280 | 4 | (conceptId) | `conceptById`, `showDetailModal` | `applyLinkState` | динам.×3 | — |
| `similarItemHtml` | function | 39286 | 15 | (x) | `conceptById` | `similarColumnHtml` | — | — |
| `similarColumnHtml` | function | 39302 | 10 | (title, hint, list, empty, attrs) | `similarItemHtml` | `similarNetworkColumnHtml`×3, `similarConceptsBlock`×3 | — | — |
| `similarNetworkColumnHtml` | function | 39317 | 15 | (conceptId) | `similarColumnHtml`×3, `medianNodeDegree`, `nodeDegreeOf`, `profileIsMeaningful`, `nearestConcepts` | `refreshSimilarNetworkColumn`, `similarConceptsBlock` | — | — |
| `computeSimilarNetworkColumn` | function | 39333 | 13 | (conceptId) | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `refreshSimilarNetworkColumn` | — | динам.×1 | — |
| `refreshSimilarNetworkColumn` | function | 39347 | 5 | (conceptId) | `similarNetworkColumnHtml` | `computeSimilarNetworkColumn` | — | — |
| `similarConceptsBlock` | function | 39353 | 51 | (conceptId) | `nearestConcepts`×3, `similarColumnHtml`×3, `medianNodeDegree`×2, `nodeDegreeOf`×2, `profileIsMeaningful`, `similarNetworkColumnHtml` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 39433 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 39449 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 39468 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 39474 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 39491 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 39503 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 39578 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 39587 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 39686 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 39717 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 39732 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt042` | динам.×1 | — |
| `modalEntityExists` | function | 39752 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 39770 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 39850 | 1 | (permissions) | `granted` | `setSessionUser` | — | — |
| `can` | function | 39852 | 1 | (permission) | `granted` | `renderCommits`×4, `renderObservations`×3, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` | — | — |
| `setSessionUser` | function | 39856 | 11 | (user, grantedFromServer) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 39870 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 39872 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 39915 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 39917 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 39922 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 39951 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 39983 | 30 | () | `securityError`×3, `securitySecret`, `renderAuthControls`, `refreshEditHints`, `api`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 40014 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 40020 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 40031 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 40038 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 40053 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 40060 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 40076 | 96 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `closeAuthModal`×2, `authNoticeMember`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `emit`, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 40173 | 24 | () | `ModalContext`×2, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 40200 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `authLogout` | — | — |
| `renderAuthControls` | function | 40212 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt039`, `stmt040` | — | — |
| `philRowTip` | function | 40245 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 40251 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt040` | — | — |
| `openUniversalModal` | function | 40267 | 67 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `emit`, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `applyLinkState`×2, `saveConceptData`×2, `saveConnectionData`×2, `openSelectionLink`, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt068` | динам.×26 | — |
| `closeUniversalModal` | function | 40336 | 28 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `emit`, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 40366 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 40385 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 40406 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 40417 | 22 | (original) | `philosopherByName` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 40440 | 19 | (original) | `conceptToRubrics` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 40460 | 27 | (original) | `ModalContext`×2, `relationTypesObj` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 40489 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 40493 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 40503 | 11 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 40515 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 40522 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 40543 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt067` | — | — |
| `showPhilosopherDetailModal` | function | 40547 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 40551 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt066` | — | — |
| `closePhilosopherDetailModal` | function | 40552 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 40554 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 40559 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt069` | динам.×1 | — |
| `openEditConnectionModal` | function | 40566 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `stmt070` | динам.×1 | — |
| `updateGraphData` | function | 40591 | 24 | () | `simulation`×3, `nodes`, `links`, `pickDirty`, `requestDraw`, `linkLayer`, `rebuildQuadtree`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt052` | — | — |
| `addNodeToGraph` | function | 40616 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 40634 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 40639 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 40651 | 8 | () | `pickDirty`, `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 40665 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 40684 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 40697 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 40751 | 1 | () | `hasUnsavedEdits` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 40752 | 1 | () | `hasUnsavedEdits` | — | — | — |
| `collectData` | function | 40754 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 40758 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 40770 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 40779 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 40824 | 10 | (cookieName) | — | `api` | — | — |
| `api` | async function | 40835 | 34 | (path, ?) | `serverMode`, `readCookie` | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `deleteObservation`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent`, `toggleEntityHistory`, `revertEntityToVersion` | — | — |
| `detectServerMode` | async function | 40874 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `stmt040` | — | — |
| `sameValue` | function | 40936 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 40951 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 40975 | 17 | (descr, apply) | `PERM`, `can`, `serverMode`, `lastSubmitted`, `sendCommit` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `sendCommit` | async function | 40999 | 58 | (descr, direct) | `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange` | — | — |
| `commitMessageFor` | function | 41059 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 41095 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 41102 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 41107 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 41125 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 41152 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 41166 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 41210 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 41217 | 4 | () | — | — | статич.×1 | — |
| `switchCommitTab` | function | 41222 | 14 | (tab) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 41247 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 41266 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 41277 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 41279 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 41285 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 41304 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 41327 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 41358 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 41362 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `provenanceDiff` | function | 41379 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `stateInWords` | function | 41412 | 4 | (stateCode) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 41425 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 41441 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 41491 | 73 | () | `escapeAttr`×13, `PERM`×4, `can`×4, `commitItems`×3, `commitTab`×2, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `provenanceDiff`, `layoutTabHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 41571 | 7 | (count) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 41579 | 17 | (id, verdict) | `emit`, `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 41597 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 41621 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 41642 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 41698 | 8 | () | `unreadCount`×3, `serverMode`, `api`, `renderBell` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 41707 | 7 | () | `notifyItems`×2, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 41715 | 9 | () | `unreadCount`×3, `serverMode` | `refreshUnread`, `stmt033` | — | — |
| `renderNotifyList` | function | 41725 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 41745 | 16 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 41762 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 41770 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt034` | — | — |
| `markAllNotificationsRead` | async function | 41780 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 41812 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt035` | — | — |
| `showConflict` | function | 41829 | 31 | (descr, clashes) | `escapeAttr`×5, `reportSubmit`×2, `lastConflict` | `stmt029` | — | — |
| `rebuildOverCurrent` | async function | 41866 | 22 | () | `reportSubmit`×2, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `api`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | — | статич.×1 | — |
| `replaceEntity` | function | 41903 | 9 | (set, id, record) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 41917 | 18 | (increment) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 41937 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `revertEntityToVersion`, `stmt040` | — | — |
| `connectLive` | function ⟲ | 41973 | 33 | () | `liveSocket`×5, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt040` | — | — |
| `rebuildDerived` | function | 42030 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 42074 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 42092 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 42100 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 42125 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 42179 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 42211 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt042`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 42231 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `historyBlock` | function | 42289 | 17 | (kind, entityId) | `escapeAttr`×4, `serverMode` | `generateConnectionViewContent`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `toggleEntityHistory` | async function | 42307 | 18 | (kind, entityId) | `historyBusy`×3, `historyFor`×2, `historyItems`×2, `renderEntityHistory`×2, `api`, `toggleSubsection` | `revertEntityToVersion`×2 | динам.×1 | — |
| `renderEntityHistory` | function | 42331 | 39 | (kind, entityId) | `escapeAttr`×10, `historyItems`×2, `PERM`, `can` | `toggleEntityHistory`×2 | — | — |
| `revertEntityToVersion` | async function | 42371 | 20 | (kind, entityId, version) | `toggleEntityHistory`×2, `api`, `pullGraphSince`, `historyFor`, `historyItems` | — | динам.×1 | — |
| `provenanceBlock` | function | 42392 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `escapeAttr` | function | 42417 | 4 | (s) | — | `renderCommits`×13, `renderEntityHistory`×10, `selectionRowRelation`×8, `renderUsers`×8, `renderObservations`×7, `compareObservationsInPanel`×6, `selectionRowPhilosopher`×5, `selectionRowConcept`×5, `layoutHistoryHtml`×5, `showConflict`×5, `layoutTabHtml`×4, `historyBlock`×4, `provenanceDiff`×3, `renderNotifyList`×3, `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `renderSelectionList`, `deleteObservation`, `confirmMfaEnroll`, `provenanceBlock`, `provenanceField`, `generateConnectionEditContent` | динам.×13 | — |
| `relationIndexById` | function | 42434 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 42442 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 42460 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 42501 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 42508 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 42509 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 42511 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 42520 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `provenanceDriftWarning` | function | 42672 | 10 | (prev, next) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 42683 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 42702 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 42720 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 42730 | 102 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 42833 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 42881 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 42890 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 42898 | 76 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `philosopherByName`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 42989 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 43025 | 93 | () | `ModalContext`×6, `relations`×5, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 43119 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 43194 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 43221 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 43240 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 43259 | 6 | (line, state) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `needsCitation` | function | 43266 | 3 | (state) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 43281 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 43291 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 43311 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 43329 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 43336 | 117 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `provenanceField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 43458 | 132 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `provenanceField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 43598 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 43639 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 43665 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 43675 | 97 | (connectionData) | `conceptById`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `provenanceField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 43777 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 43807 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt055` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 43826 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 43840 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 43862 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 43866 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 43885 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 43894 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 43901 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 43925 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 43940 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 44001 | 75 | (sourceNode, targetNode, connectionData) | `conceptPlate`×3, `relationHint`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 44077 | 85 | (connectionData) | `conceptById`×2, `ModalContext`×2, `historyBlock`, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 44174 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 44194 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 44237 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt055` | динам.×1 | — |
| `updateConnectionVisualization` | function | 44271 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 44293 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 44317 | 267 | (conceptData) | `relationTypesObj`×4, `philosopherConcepts`×3, `conceptToRubrics`×2, `linkArrow`×2, `otherEndColor`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `similarConceptsBlock`, `historyBlock`, `provenanceBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 44586 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 44602 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 44613 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 44652 | 14 | (sectionId) | — | `toggleEntityHistory` | динам.×4 | — |
| `gotoNodeFromModal` | function | 44668 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 44693 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 44724 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 44735 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 44770 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `comparePhilosophers`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 44809 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 44814 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 44850 | 458 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×6, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `philosopherConcepts`×2, `links`×2, `directionMark`×2, `linkArrow`×2, `otherEndColor`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `historyBlock`, `provenanceBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 45310 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 45326 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 45362 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 45394 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt038`, `stmt051` | — | — |
| `closeAllModals` | function | 45501 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt041`, `stmt042` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5900 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 6022 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `selectionListSets`, `philosopherIdByName`, `philosopherNameById`, `pickPhilosophers`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6740 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `currentLinkState`, `applyLinkState`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6820 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6860 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12784 | массив (2720) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `applyLinkState`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 23884 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 23982 | литерал null | — | `applyStoredLayout`×2, `stmt080`×2 |
| `philosopherIdToName` | const | 23985 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 23991 | объект (0) | — | `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generateConceptViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `generatePhilosopherViewContent`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `selectionRowConcept`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 24000 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 24006 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `linkHasTwoHeads`, `selectionRowRelation`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 24031 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 24037 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `linksLayerKey`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `selectionListSets`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `visualizeMetricBySize`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `rebuildQuadtree`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt043` |
| `links` | const | 24055 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `repaintPickCanvas`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `selectionListSets`, `openSelectionLink`, `exportToSVG`, `similarityLinkCount`, `needsContinuousAnimation`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt043` |
| `conceptToRubrics` | const | 24067 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 24073 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 24105 | new Map | — | `applyLinkState`×6, `generatePhilosopherViewContent`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `linkIsInternal`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `selectionLabel`, `selectionRowRelation`, `renderSelectionList`, `otherEndColor`, `compareLinks`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarItemHtml`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 24106 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `comparePhilosophers`, `otherEndColor`, `philosopherYears`, `showPhilosopherProfileModal`, `hasPhilosopherChanges`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 24107 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 24108 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 24109 | new Map | — | `rebuildIndexes`×4, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 24110 | new Map | — | `rebuildIndexes`×7, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 24165 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `liveScopeKey`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt077`, `stmt082` |
| `respectDirection` | let | 24166 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `liveScopeKey`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt078`, `stmt082` |
| `skipTypologicalInPaths` | let | 24183 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 24199 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 24240 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt084` |
| `MATURITY_AGE` | const | 24243 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 24246 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `applyLinkState`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `currentLinkState`, `deletePhilosopher` |
| `selectedRelations` | let | 24247 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `applyLinkState`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations`, `currentLinkState` |
| `philosopherTraditions` | const | 24250 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 24256 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `applyLinkState`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics`, `currentLinkState` |
| `filterMode` | let | 24259 | строка | — | `applyFiltersImmediate`×3, `currentLinkState`×2, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode`, `applyLinkState` |
| `arrowHoverTimer` | let | 24976 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 24977 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 25091 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 25241 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 25268 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25347 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25416 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25546 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt059` |
| `hintBox` | let | 25674 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 25708 | массив (19) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 25729 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 25731 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 25806 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 25960 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 26122 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 26264 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26445 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26446 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26726 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26733 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 26756 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 26881 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 27228 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 27229 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 27230 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 27269 | литерал null | — | `applyMetricsScope`×4, `closeStatsModal`×3 |
| `cachesMatchLive` | let | 27279 | литерал true | — | `applyMetricsScope`, `closeStatsModal` |
| `FORMULA_VERSIONS` | const | 27343 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27379 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27428 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27642 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27643 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 27835 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 27836 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 27982 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 27983 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 28111 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 28173 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 28174 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 28175 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 28184 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28539 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28540 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28542 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28684 | литерал null | — | `philosopherSimilarityData`×4, `metricDescriptions`×3, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `typeStyleData`, `networkSimilarityData`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28685 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `typeStyleData`, `generativityScores`, `metricDescriptions`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28686 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28687 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28688 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28689 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28690 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28691 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 28774 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 28892 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 29075 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 29209 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 29265 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29434 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29442 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29445 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29447 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29449 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29537 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29612 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29617 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29683 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 29741 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 29756 | объект (3) | — | — |
| `_tensionScales` | let | 29762 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 29763 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 30027 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 30077 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 30140 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 30207 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 30263 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30328 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30367 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30471 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30510 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30567 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30622 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30701 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30717 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 30741 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 30805 | литерал null | — | `allConceptPairs`×5, `allConceptPairsAsync`×3, `invalidateSimilarityCache` |
| `_pairCalculating` | let | 30806 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 30822 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 30912 | литерал null | — | `neighborSets`×3 |
| `_typeStyleCache` | let | 30998 | литерал null | — | `typeStyleData`×4, `invalidateSimilarityCache` |
| `NETWORK_SIM_NAMES` | const | 31033 | массив (8) | — | `networkSimilarityData` |
| `NETWORK_ROLE_OF` | const | 31035 | объект (8) | — | `networkRoleOf` |
| `NETWORK_ROLE_WORDS` | const | 31040 | объект (4) | — | `similarityVerdict` |
| `_netSimCache` | let | 31043 | литерал null | — | `networkSimilarityData`×5, `invalidateSimilarityCache` |
| `_netSimPending` | let | 31044 | литерал null | — | `ensureNetworkProfile`×5 |
| `NETWORK_PROGRESS_WEIGHTS` | const | 31101 | объект (4) | — | `networkProgressPercent`×2 |
| `_netProgress` | let | 31102 | объект (4) | — | `ensureNetworkProfile`×2, `networkProgressPercent` |
| `_netProgressListeners` | const | 31103 | new Set | — | `ensureNetworkProfile`×3 |
| `SIGNED_SIMILARITY` | const | 31172 | new Set | — | `nodeLitBySimilarity`, `updateSimilarityLegend` |
| `SIM_VERDICT_HIGH_Q` | const | 31188 | литерал 0.9 | — | `similarityThresholds` |
| `SIM_VERDICT_LOW_Q` | const | 31189 | литерал 0.1 | — | `similarityThresholds` |
| `SIM_SHARED_HIGH` | const | 31190 | литерал 3 | — | `similarityVerdict` |
| `_simThresholdCache` | let | 31191 | литерал null | — | `similarityThresholds`×4, `invalidateSimilarityCache` |
| `PHIL_SIM_MIN_CONCEPTS` | const | 31280 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 31299 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 31305 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 31455 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 31464 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 31496 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 31497 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 31502 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31601 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31647 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31652 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31653 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 31741 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 31779 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 31867 | строка | — | `liveScopeKey`×2, `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 31995 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×3, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `_relations`, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 32470 | литерал null | — | `openStatsModal`×4, `currentLinkState`×4, `handleStatsParameterChange`×3, `stmt054`×2, `stmt071`×2, `effectiveScopeFlags`, `switchStatsView`, `applyLinkState` |
| `isStatsModalOpen` | let | 32471 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt054`, `stmt071` |
| `selectionListOpenBlocks` | let | 32527 | new Set | — | `toggleSelectionBlock`×3, `renderSelectionList` |
| `selectionListOpenBodies` | let | 32528 | new Set | — | `toggleSelectionBody`×3, `toggleSelectionBodies`×3, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` |
| `SELECTION_LIST_CHUNK` | const | 32529 | литерал 400 | — | `setSelectionProvenance`×3, `openSelectionListModal`×3, `selectionListMore`, `renderSelectionList` |
| `selectionListShown` | let | 32530 | объект (3) | — | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBodies`, `selectionListMore`, `renderSelectionList` |
| `selectionProvenance` | let | 32533 | строка | — | `renderSelectionList`×3, `selectionListSets`×2, `setSelectionProvenance` |
| `PROVENANCE_LABELS` | const | 32548 | объект (5) | — | `renderSelectionList`×3 |
| `selectionPhilCount` | let | 32566 | объект (0) | — | `selectionListSets`×4, `selectionRowPhilosopher` |
| `selectionMirrorCount` | let | 32567 | литерал 0 | — | `renderSelectionList`×2, `selectionListSets` |
| `observationItems` | let | 33112 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 33113 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `deleteObservation`×2, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 33391 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 33587 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 33606 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 33607 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 33632 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 33653 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 33654 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 33763 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 33776 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 33900 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 34759 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 34759 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 34771 | строка | — | `renderClosestPairs`×2, `currentLinkState`×2, `applyLinkState` |
| `_pairsMinDegree` | var | 34772 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 34773 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 34774 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 34775 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 34777 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 34777 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 34795 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 34896 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 35869 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 35870 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 35871 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 35872 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `LINK_KEYS` | const | 36266 | объект (14) | — | `linkStateToHash`, `hashToLinkState` |
| `_linkApplying` | let | 36272 | литерал false | — | `applyLinkState`×2, `syncLinkHash` |
| `_linkMissed` | let | 36273 | массив (0) | — | `applyLinkState` |
| `_linkLastHash` | let | 36274 | литерал null | — | `syncLinkHash`×2, `applyLinkState`, `initLinkState` |
| `selectedSourceNode` | let | 37024 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 37025 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 37155 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 37168 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 37169 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 37170 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 37291 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 37292 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 37368 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 37369 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 37378 | вызов document.getElementById() | — | `resizeCanvas`×6, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 37379 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 37380 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `pickCanvas` | const | 37383 | вызов document.createElement() | — | `resizeCanvas`×2, `repaintPickCanvas`×2, `pickLink`×2, `pickCtx` |
| `pickCtx` | const | 37384 | вызов pickCanvas.getContext() | `pickCanvas` | `repaintPickCanvas`×13, `pickLink` |
| `pickDirty` | let | 37385 | литерал true | — | `refreshHitMaps`, `resizeCanvas`, `draw`, `repaintPickCanvas`, `pickLink`, `gfxZoom`, `stmt016`, `stmt020`, `updateGraphData`, `updateLinkOnGraph` |
| `PICK_LINK_WIDTH` | const | 37389 | литерал 10 | — | `repaintPickCanvas` |
| `dpr` | let | 37391 | выражение | — | `paintLinkLayer`×4, `draw`×4, `repaintPickCanvas`×4, `resizeCanvas`×3, `pickLink`×2 |
| `renderState` | const | 37406 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `drawLinkSet`, `draw`, `startRadiusAnimation`, `toGraph`, `pickNode`, `repaintPickCanvas`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 37420 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowPoints`, `arrowPointsStart` |
| `arrowRadius` | var | 37421 | литерал null | — | `arrowPoints`×2, `arrowPointsStart`×2, `visualizeMetricBySize`, `resetNodeSizes` |
| `uniformLinkWidthActive` | var | 37422 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 37427 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `currentLinkState`×5, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt049`×2, `applyLinkState`, `clearSimilarityOverlay`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 37433 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 37434 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 37713 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 37714 | литерал 1 | — | `renderScene` |
| `drawScheduled` | let | 37722 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 37726 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 37741 | литерал false | — | `ensureAnimLoop`×3 |
| `DRAW_ORDER` | const | 37965 | массив (5) | — | `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 37978 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 37984 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 38108 | литерал 3 | — | `renderScene` |
| `quadtree` | let | 38282 | литерал null | — | `pickNode`×2, `rebuildQuadtree` |
| `nodeHandlers` | const | 38351 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 38351 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 38393 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 38405 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 38415 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 38423 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `pickDirty`, `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 38487 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 38488 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 38490 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 38511 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 38517 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragstarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt076` |
| `maxTicks` | let | 38568 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 38626 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 38629 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 38637 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 38637 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 38898 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 38899 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 39121 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 39147 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 39148 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 39149 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 39150 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 39151 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 39152 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 39163 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `PROFILE_METRICS` | const | 39411 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 39467 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 39703 | объект (4) | — | `currentLinkState`×6, `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 39714 | массив (0) | — | `pushModalState`×5, `stmt042`×2, `stmt050`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 39715 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 39809 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 39810 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 39811 | объект (1) | — | `setSessionUser`, `renderAuthControls` |
| `authModalKind` | let | 39812 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 39830 | вызов Object.freeze() | — | `renderCommits`×4, `renderObservations`×3, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` |
| `granted` | let | 39848 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 39913 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `pinnedVisibleNodes` | const | 40589 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 40747 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 40749 | литерал false | — | `markDirty`, `hasUnsaved`, `downloadData`, `saveToFolder`, `stmt028` |
| `dataFolder` | let | 40777 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 40822 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationBar`, `loadObservations`, `api`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `historyBlock`, `commitReasonField` |
| `lastSubmitted` | let | 40973 | литерал null | — | `submitChange` |
| `userItems` | let | 41092 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 41093 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 41206 | строка | — | `switchCommitTab`×4, `renderCommits`×2, `loadCommits` |
| `commitItems` | let | 41207 | массив (0) | — | `loadCommits`×3, `renderCommits`×3 |
| `commitError` | let | 41208 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 41244 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 41245 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 41264 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 41275 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 41349 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `LAYOUT_KINDS` | const | 41423 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 41695 | литерал 0 | — | `refreshUnread`×3, `renderBell`×3 |
| `notifyItems` | let | 41696 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 41900 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 42007 | литерал null | — | `connectLive`×5, `stmt036`×2 |
| `liveRetry` | let | 42008 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 42009 | литерал false | — | `connectLive`, `stmt036` |
| `lastConflict` | let | 42097 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 42120 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 42122 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 42177 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 42245 | массив (3) | — | `generateConnectionEditContent` |
| `historyFor` | let | 42274 | литерал null | — | `toggleEntityHistory`×2, `revertEntityToVersion` |
| `historyItems` | let | 42275 | массив (0) | — | `toggleEntityHistory`×2, `renderEntityHistory`×2, `revertEntityToVersion` |
| `historyBusy` | let | 42276 | литерал false | — | `toggleEntityHistory`×3 |
| `GROUNDING_TYPES` | const | 42457 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 43187 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 43882 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 44611 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 45324 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 45360 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 45676 | вызов document.getElementById() | — | `stmt077`×2 |
| `legendDirectionToggle` | const | 45678 | вызов document.getElementById() | — | `stmt078`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 23986 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 23992 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 24001 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 24007 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 24032 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 24068 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 24074 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 24163 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 24251 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 33333 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 33342 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 33901 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 36235 | 6 | `window.addEventListener('load')` | `saveOriginalRadii`, `initLinkState` |
| stmt014 | обработчик | 36917 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 37139 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 38433 | 37 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `pickNode`, `gfxZoom`, `dragstarted`, `dragended` |
| stmt017 | вызов | 38471 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 38542 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 38546 | 10 | `if (layoutFromStore) { simulation.stop(); layoutSettled = true; // СЧЁ…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 38584 | 16 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 38612 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 38614 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 38719 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 38901 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode` |
| stmt025 | обработчик | 38930 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges` |
| stmt026 | построение | 39154 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 39243 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 40803 | 5 | `window.addEventListener('beforeunload')` | `hasUnsavedEdits` |
| stmt029 | вызов | 41076 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 41182 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 41670 | 12 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `revertCommitFromPanel`, `showImpact` |
| stmt032 | вызов | 41788 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 41789 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | обработчик | 41794 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt035 | вызов | 41827 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt036 | обработчик | 42012 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt037 | обработчик | 44166 | 7 | `document.addEventListener('click')` | — |
| stmt038 | вызов | 45476 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt039 | вызов | 45477 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt040 | вызов | 45482 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt041 | обработчик | 45516 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt042 | обработчик | 45524 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt043 | вызов | 45548 | 1 | `console.log()` | `nodes`, `links` |
| stmt044 | вызов | 45549 | 1 | `initFilters()` | `initFilters` |
| stmt045 | вызов | 45552 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt046 | вызов | 45557 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt047 | вызов | 45566 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt048 | вызов | 45571 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt049 | вызов | 45575 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt050 | вызов | 45578 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt051 | вызов | 45581 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt052 | вызов | 45606 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt053 | вызов | 45607 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt054 | вызов | 45608 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt055 | вызов | 45615 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt056 | вызов | 45619 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt057 | вызов | 45620 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt058 | вызов | 45621 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt059 | вызов | 45622 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt060 | вызов | 45629 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt061 | обработчик | 45631 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt062 | обработчик | 45635 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt063 | обработчик | 45639 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt064 | обработчик | 45643 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt065 | вызов | 45644 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt066 | вызов | 45645 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt067 | вызов | 45647 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt068 | вызов | 45648 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt069 | вызов | 45649 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt070 | вызов | 45650 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt071 | вызов | 45652 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt072 | вызов | 45656 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt073 | вызов | 45658 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt074 | вызов | 45661 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt075 | вызов | 45664 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt076 | обработчик | 45667 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt077 | условие | 45677 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt078 | условие | 45679 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt079 | вызов | 45682 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt080 | условие | 45687 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt081 | вызов | 45689 | 1 | `console.log()` | — |
| stmt082 | вызов | 45690 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt083 | обработчик | 45698 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt084 | обработчик | 45704 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt085 | условие | 45719 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt086 | вызов | 45723 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 25842 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 33333 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 33342 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 36235 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 36515 | `popstate` | `window` | addEventListener | функция на месте | `initLinkState` |
| 36917 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 37035 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 37139 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 38423 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 38433 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38433 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38433 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38584 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 38612 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 38614 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 38706 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 38707 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 38708 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 38709 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 38716 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 38901 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 38901 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 38930 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 38930 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 38930 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39243 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 39896 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 39977 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 40803 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 41182 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 41670 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 41794 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt034` |
| 41982 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 41992 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 41997 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42012 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt036` |
| 43832 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 43833 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44166 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt037` |
| 44304 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 45407 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 45437 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 45452 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 45516 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt041` |
| 45524 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt042` |
| 45631 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt061` |
| 45635 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt062` |
| 45639 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt063` |
| 45643 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt064` |
| 45667 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt076` |
| 45698 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt083` |
| 45704 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt084` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27470 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27483 | `installMetricScopeWrappers` | `window[name]` | запись |
| 36042 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 39774 | `modalContentFor` | `window[name]` | чтение |
| 39780 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| 5119 | `onclick` | (страница) | `closeUniversalModal()` |
| 5128 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 5133 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 5139 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 5151 | `onclick` | (страница) | `toggleLegendSearch()` |
| 5156 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 5158 | `onclick` | (страница) | `setSearchKind('concept')` |
| 5160 | `onclick` | (страница) | `setSearchKind('connection')` |
| 5169 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 5170 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 5171 | `onclick` | (страница) | `clearLegendSearch()` |
| 5181 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5182 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5183 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 5194 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 5195 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 5204 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 5205 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5216 | `onclick` | (страница) | `openStatsModal()` |
| 5228 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5240 | `onclick` | (страница) | `resetNodeSizes()` |
| 5247 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5252 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5253 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5264 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5295 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5303 | `onclick` | (страница) | `toggleSection('relations')` |
| 5308 | `onclick` | (страница) | `selectAllRelations()` |
| 5309 | `onclick` | (страница) | `deselectAllRelations()` |
| 5330 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5335 | `onclick` | (страница) | `selectAllRubrics()` |
| 5336 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5343 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5348 | `onclick` | (страница) | `selectAllTraditions()` |
| 5349 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5383 | `onclick` | (страница) | `openSelectionListModal()` |
| 5394 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5407 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5408 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5421 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5422 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5427 | `onclick` | (страница) | `findAndShowPath()` |
| 5470 | `onclick` | (страница) | `resetSimulation()` |
| 5471 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5472 | `onclick` | (страница) | `centerGraph()` |
| 5473 | `onclick` | (страница) | `toggleGrouping()` |
| 5474 | `onclick` | (страница) | `downloadData()` |
| 5475 | `onclick` | (страница) | `saveToFolder()` |
| 5477 | `onclick` | (страница) | `exportToPNG()` |
| 5478 | `onclick` | (страница) | `exportToSVG()` |
| 5481 | `onclick` | (страница) | `openAboutModal()` |
| 5484 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5486 | `onclick` | (страница) | `closeAboutModal()` |
| 5496 | `onclick` | (страница) | `closeUsersPanel()` |
| 5505 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5506 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5507 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5512 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5520 | `onclick` | (страница) | `openCommitsPanel()` |
| 5521 | `onclick` | (страница) | `openUsersPanel()` |
| 5522 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5526 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5539 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5540 | `onclick` | (страница) | `closeConflictModal()` |
| 5574 | `onclick` | (страница) | `closeSelectionListModal()` |
| 5593 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5599 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5605 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5611 | `onclick` | (страница) | `closeStatsModal()` |
| 5625 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5629 | `onclick` | (страница) | `switchStatsView('observations')` |
| 5633 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5637 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5641 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5645 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5649 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5653 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5657 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5661 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5665 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5669 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5673 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5677 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5689 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5693 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5697 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5709 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5713 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5725 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5729 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5741 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5745 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5757 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5769 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5773 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5785 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5789 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5793 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5797 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5801 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5805 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5809 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5821 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5833 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5837 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5841 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5845 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5857 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5861 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 24761 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24795 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 24842 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 24846 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 24847 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 24948 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 24951 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25122 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 25141 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 25144 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 25181 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25315 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25438 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25491 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 26792 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 26808 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 26832 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 26837 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 26839 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 26855 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29414 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29422 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 32745 | `onclick` | `selectionRowPhilosopher` | `openUniversalModal('philosopher', '${escapeAttr(p.nameRu)}', 'view')` |
| 32747 | `onclick` | `selectionRowPhilosopher` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32768 | `onclick` | `selectionRowConcept` | `openUniversalModal('concept', nodes.find(x => x.id === '${escapeAttr(n.id)}'), 'view')` |
| 32769 | `onclick` | `selectionRowConcept` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32820 | `onclick` | `selectionRowRelation` | `openSelectionLink('${escapeAttr(s)}', '${escapeAttr(t)}')` |
| 32822 | `onclick` | `selectionRowRelation` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 32851 | `onclick` | `renderSelectionList` | `setSelectionProvenance('${v}')` |
| 32890 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32895 | `onclick` | `renderSelectionList` | `toggleSelectionBodies('${kind}')` |
| 32898 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 32904 | `onclick` | `renderSelectionList` | `selectionListMore('${kind}')` |
| 33040 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 33170 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 33177 | `onclick` | `renderObservations` | `deleteObservation('${escapeAttr(z.observationId)}')` |
| 33413 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 33740 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 33968 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34000 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34005 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 34012 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 34062 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 34070 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 34077 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 34214 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 34818 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 34823 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 34912 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 34940 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 34971 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 34972 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 34973 | `onclick` | `generateClosestPairsContent` | `_pairsKind='types'; renderClosestPairs();` |
| 34974 | `onclick` | `generateClosestPairsContent` | `_pairsKind='network'; renderClosestPairs();` |
| 34979 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 34984 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 34988 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 34993 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 35089 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 35141 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 35142 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 35248 | `onclick` | `renderComparison` | `computeComparisonNetwork()` |
| 35553 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 35742 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 35783 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 36855 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 36967 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 37080 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 37678 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 37693 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 37709 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 39295 | `onclick` | `similarItemHtml` | `openConceptById('${x.id}')` |
| 39328 | `onclick` | `similarNetworkColumnHtml` | `computeSimilarNetworkColumn('${conceptId}')` |
| 39381 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 39533 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 39553 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 39562 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 39569 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 39666 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 39886 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 39887 | `onclick` | `openAuthModal` | `submitAuth()` |
| 39942 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 39944 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 39972 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 40002 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 40005 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 40046 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 40220 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 40221 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 40224 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 40225 | `onclick` | `renderAuthControls` | `authLogout()` |
| 40299 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 40309 | `onclick` | `openUniversalModal` | `popModalState()` |
| 41434 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(item.id))}')` |
| 41457 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 41458 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 41465 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 41472 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41485 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 41486 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 42204 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 42297 | `onclick` | `historyBlock` | `toggleEntityHistory('${escapeAttr(kind)}', '${escapeAttr(entityId)}')` |
| 42356 | `onclick` | `renderEntityHistory` | `revertEntityToVersion('${escapeAttr(kind)}', '${escapeAttr(entityId)}', ${Number(commit.версия)})` |
| 43209 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 43294 | `onclick` | `modalActions` | `${saveFn}()` |
| 43297 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 43301 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 43349 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 43357 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 43361 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 43428 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 43431 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 43434 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 43439 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 43550 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 43553 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 43556 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 43579 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 43697 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 43737 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 43800 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 43908 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 43912 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 44106 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 44129 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44130 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 44231 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 44331 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44332 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 44333 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 44340 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 44347 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 44350 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 44401 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 44411 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 44444 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 44449 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 44472 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 44502 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 44507 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 44555 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 44563 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 44710 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 44792 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 44824 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 44871 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 44872 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 44873 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 44885 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 45041 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45057 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45073 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 45127 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 45135 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 45138 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 45193 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 45205 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 45224 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 45226 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 45229 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 45252 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 45274 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 45277 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 45281 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28644 | 34 | — |
| `TENSION_WEIGHTS` | const | 29756 | 5 | — |
| `tensionScales` | function | 29765 | 23 | — |
| `searchNodes` | function | 36835 | 3 | — |
| `toggleSimilarityKind` | function | 37576 | 5 | — |
| `hasUnsaved` | function | 40752 | 1 | — |
| `graphSelectionContext` | window-объявление | 42177 | 1 | — |
| `generatePhilosopherEditContent` | function | 43336 | 117 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 43458 | 132 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 43675 | 97 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 44077 | 85 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 44317 | 267 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 44850 | 458 | вероятно цель `window[…]` в `modalContentFor` |


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
| `document` | 378 |
| `Math` | 151 |
| `Set` | 117 |
| `Object` | 82 |
| `undefined` | 59 |
| `Map` | 54 |
| `String` | 51 |
| `console` | 48 |
| `setTimeout` | 47 |
| `window` | 47 |
| `Array` | 40 |
| `d3` | 29 |
| `alert` | 25 |
| `Promise` | 20 |
| `Boolean` | 17 |
| `encodeURIComponent` | 16 |
| `Number` | 15 |
| `Date` | 12 |
| `Infinity` | 10 |
| `clearTimeout` | 9 |
| `location` | 8 |
| `confirm` | 7 |
| `URL` | 6 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `prompt` | 5 |
| `event` | 4 |
| `Float32Array` | 4 |
| `JSON` | 4 |
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
