# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 191 811 знаков, 46 844 строк; встроенный скрипт — строки 5941–46842. Составлено 2026-09-27 16:45:02 UTC.

Всего глобальных сущностей: **1123** — функций 716
(из них асинхронных 43), `const` 130, `let` 169,
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
| `nodes` | const | 24329 | 131 | 80 |
| `escapeAttr` | function | 43321 | 126 | 34 |
| `conceptById` | const | 24397 | 77 | 46 |
| `ModalContext` | const | 40253 | 75 | 26 |
| `links` | const | 24347 | 67 | 49 |
| `similarityOverlay` | var | 37779 | 65 | 17 |
| `concepts` | const | 6911 | 60 | 52 |
| `renderState` | const | 37759 | 59 | 30 |
| `emit` | function | 26065 | 56 | 40 |
| `relations` | const | 12840 | 54 | 48 |
| `selectedPhilosophers` | let | 24538 | 53 | 18 |
| `_conceptMap` | let | 28957 | 53 | 23 |
| `philosopherConcepts` | const | 24283 | 47 | 29 |
| `relationTypesObj` | const | 24298 | 47 | 32 |
| `useWeightedPaths` | let | 24457 | 47 | 18 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 24185 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 24204 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 24239 | 32 | (positions) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 24315 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 24404 | 51 | () | `linksByConcept`×7, `nodesByPhilosopher`×4, `nodes`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links`, `compareConcepts`, `compareLinks` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 24476 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 24480 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 24513 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 24520 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 24522 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 24544 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 24554 | 23 | () | `nodes` | `stmt076` | — | — |
| `strictChronologyCheck` | function | 24588 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24645 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24656 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24668 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24730 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24779 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24785 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24808 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24820 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24924 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24995 | 271 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `escapeAttr`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `emit`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight`, `descriptionHtml`, `descriptionPlain` | `applyLinkState` | статич.×1 | — |
| `handlePathArrowHover` | function | 25271 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 25315 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 25354 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 25374 | 7 | () | `emit`, `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 25386 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `descriptionHtml`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 25516 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 25535 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 25562 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25577 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25595 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25620 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25625 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25643 | 6 | () | `chosenPhilosophers` | `stmt060` | — | — |
| `highlightPhilosopherOnGraph` | function | 25650 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25710 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25740 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25748 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25759 | 33 | () | `relationTypesObj`, `links`, `linkSearch`, `directionMark`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25793 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25817 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25840 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25852 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt061` | статич.×1 | — |
| `buildAboutText` | function | 25864 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25947 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25953 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25959 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25968 | 20 | (el, text) | `hintBox`×9 | `stmt063` | — | — |
| `hideHint` | function | 25989 | 3 | () | `hintBox`×2 | `stmt064`, `stmt065`, `stmt066` | — | — |
| `subscribe` | function | 26025 | 17 | (event, handler, phase) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `initLinkState`, `stmt029`, `stmt032`, `stmt033`, `stmt034`, `stmt036`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt060`, `stmt061`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071`, `stmt072`, `stmt073` | — | — |
| `emit` | function | 26065 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `applyFiltersImmediate`×2, `handleMetricsScopeChange`×2, `openPairInComparison`×2, `handleLinkClick`×2, `showSimilarityOverlay`×2, `dispatchClick`×2, `submitAuth`×2, `applyServerLayout`, `findAndShowPath`, `clearPathHighlight`, `refreshMetricsIfScoped`, `setInfluenceScope`, `closeStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `renderClosestPairs`, `toggleMetricVisualization`, `selectCustomOption`, `setSimilarityLinks`, `clearSimilarityOverlay`, `highlightCombined`, `authLogout`, `openUniversalModal`, `closeUniversalModal`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt042` | — | — |
| `debounce` | function | 26083 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 26161 | 30 | (message, duration=…) | — | `showSimilarityOverlay`×6, `handleUniqueChainsMode`×5, `handleChainsMode`×4, `applyLinkState`×2, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt082` | — | — |
| `buildAdjacencyGraph` | function | 26198 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 26280 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 26416 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 26426 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 26475 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 26550 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26740 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `selectionListSets`, `displaySearchResults`, `selectSearchResult`, `pickNode` | — | — |
| `isLinkVisible` | function | 26741 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `selectionListSets`, `exportToSVG`, `paintLinkLayer`, `pickLink` | — | — |
| `applyBasicFilter` | function | 26743 | 52 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26799 | 7 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `handleChainsMode` | async function | 26810 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26873 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26942 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26960 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26968 | 22 | () | `filterMode`×3, `emit`×2, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `applyLinkState`, `selectSearchResult`, `stmt055` | — | — |
| `applyFilters` | function | 26993 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 27027 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 27040 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION`, `descriptionPlain`, `escapeAttr` | `stmt046`, `stmt053` | — | — |
| `togglePhilosopher` | function | 27131 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 27160 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 27184 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 27193 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 27199 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 27208 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 27216 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `applyLinkState`×2, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 27240 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt048` | — | — |
| `onlyTradition` | function | 27269 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 27276 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 27286 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 27295 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 27304 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 27313 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 27322 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 27332 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 27341 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 27353 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 27397 | 4 | (mode) | `filterMode`, `applyFilters` | `applyLinkState` | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 27403 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 27413 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt047`, `stmt050`, `stmt074` | — | — |
| `updateProvenanceCoverage` | function | 27440 | 45 | () | `philosophers`×2, `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 27502 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 27503 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 27511 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 27524 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `liveScopeKey` | function | 27550 | 4 | () | `metricsScope`×2, `useWeightedPaths`, `respectDirection` | `applyMetricsScope`, `closeStatsModal` | — | — |
| `applyMetricsScope` | function | 27556 | 36 | (viewName) | `lastScopeKey`×4, `metricsScopeActive`×3, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `cachesMatchLive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27721 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27738 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27759 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27793 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27919 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `ensureNetworkProfile`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 28087 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 28099 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 28112 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 28246 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 28260 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 28306 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 28375 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 28387 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 28434 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 28456 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 28563 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 28571 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28601 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28622 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `networkSimilarityData`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28693 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28701 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28760 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28821 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28827 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `ensureNetworkProfile`, `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28905 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28914 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28968 | 5 | (r) | — | `exportToSVG`×2, `drawLinkSet`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `linkShape`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28979 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28989 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28994 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 29009 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 29028 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 29047 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 29157 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 29165 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 29340 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 29348 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 29474 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 29481 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 29530 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 29537 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29641 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29653 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29664 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29725 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29747 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29754 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29759 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29802 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29809 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29877 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29889 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29948 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29955 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 30006 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 30035 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 30059 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 30064 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 30292 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 30299 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 30342 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 30349 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 30405 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 30412 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 30472 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 30479 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 30528 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 30535 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30593 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30600 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30632 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30642 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30732 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30743 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30775 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30782 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30832 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30839 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30887 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30898 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30962 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30988 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `nodeDegreeOf` | function | 31000 | 7 | (conceptId) | `_relations` | `profileIsMeaningful`, `networkSimilarityData`, `similarProfileColumnHtml`, `similarNetworkColumnHtml`, `similarConceptsBlock` | — | — |
| `profileIsMeaningful` | function | 31008 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `showSimilarityOverlay`×3, `nearestConcepts`×2, `similarityVerdict`×2, `renderComparison`×2, `similarProfileColumnHtml`×2, `similarNetworkColumnHtml`×2, `similarityThresholds`, `similarConceptsBlock` | — | — |
| `similarityData` | function | 31013 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `similarityThresholds`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 31062 | 9 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `_typeStyleCache`, `_netSimCache`, `_simThresholdCache`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 31080 | 8 | () | `_pairCache`×5, `networkSimilarityData` | `allConceptPairsAsync`, `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 31094 | 63 | (progressCallback) | `_pairCache`×3, `_pairCalculating`×3, `normedDot`×2, `similarityData`, `allConceptPairs`, `PAIRS_CHUNK_ROWS`, `neighborSets`, `typeStyleData`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `fillPairsNetwork` | function | 31158 | 11 | (P) | `normedDot`, `networkSimilarityData` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 31170 | 9 | (idA, idB) | `similarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 31183 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 31196 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `typeStyleData` | — | — |
| `structuralSimilarity` | function | 31204 | 13 | (idA, idB) | `neighborSets` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `zColumns` | function | 31220 | 15 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `centerRows` | function | 31236 | 6 | (M) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `vectorNorm` | function | 31242 | 5 | (v) | — | `typeStyleData`, `networkSimilarityData` | — | — |
| `normedDot` | function | 31247 | 6 | (a, na, b, nb) | — | `similarityThresholds`×3, `allConceptPairsAsync`×2, `fillPairsNetwork`, `typeStyleSimilarity`, `networkSimilarity` | — | — |
| `typeStyleData` | function | 31269 | 15 | () | `_typeStyleCache`×4, `_concepts`, `_relations`, `typeProfileOf`, `zColumns`, `centerRows`, `vectorNorm` | `allConceptPairsAsync`, `typeStyleSimilarity`, `similarityThresholds` | — | — |
| `typeStyleSimilarity` | function | 31284 | 6 | (idA, idB) | `normedDot`, `typeStyleData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `metricValueMap` | function | 31316 | 9 | (res) | — | `networkSimilarityData` | — | — |
| `networkSimilarityData` | function | 31326 | 15 | () | `_netSimCache`×5, `betweennessCache`, `pageRankCache`, `closenessCache`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `eigenvectorCache`, `_concepts`, `nodeDegreeOf`, `zColumns`, `centerRows`, `vectorNorm`, `NETWORK_SIM_NAMES`, `metricValueMap` | `ensureNetworkProfile`×2, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkSimilarity`, `networkRoleOf`, `networkProgressPercent`, `similarityThresholds`, `nearestConcepts`, `applyLinkState`, `showSimilarityOverlay`, `forceSimilarColumn` | — | — |
| `networkSimilarity` | function | 31342 | 7 | (idA, idB) | `normedDot`, `networkSimilarityData` | `similarityOf`, `similarityVerdict`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `networkRoleOf` | function | 31353 | 11 | (id) | `NETWORK_ROLE_OF`, `networkSimilarityData` | `similarityVerdict` | — | — |
| `networkProgressPercent` | function | 31374 | 10 | () | `NETWORK_PROGRESS_WEIGHTS`×2, `betweennessCache`, `pageRankCache`, `closenessCache`, `eigenvectorCache`, `networkSimilarityData`, `_netProgress` | `ensureNetworkProfile`, `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `ensureNetworkProfile` | function | 31389 | 38 | (onProgress) | `_netSimPending`×5, `_netProgressListeners`×3, `networkSimilarityData`×2, `_netProgress`×2, `betweennessCache`, `calculateBetweennessAsync`, `pageRankCache`, `calculatePageRank`, `closenessCache`, `calculateClosenessCentrality`, `eigenvectorCache`, `calculateEigenvectorCentrality`, `networkProgressPercent` | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `liveProgressHtml` | function | 31433 | 3 | (pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `updateLiveProgress` | function | 31436 | 4 | (root, pct) | — | `renderClosestPairs`, `computeComparisonNetwork`, `showSimilarityOverlay`, `computeSimilarNetworkColumn` | — | — |
| `similarityNeedsDegree` | function | 31443 | 3 | (kind) | — | `nearestConcepts`×2, `showSimilarityOverlay` | — | — |
| `similarityOf` | function | 31446 | 7 | (kind, idA, idB) | `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity` | `nearestConcepts` | — | — |
| `similarityThresholds` | function | 31462 | 28 | () | `_simThresholdCache`×4, `normedDot`×3, `profileIsMeaningful`, `similarityData`, `typeStyleData`, `networkSimilarityData`, `SIM_VERDICT_HIGH_Q`, `SIM_VERDICT_LOW_Q` | `similarityVerdict` | — | — |
| `nearestConcepts` | function | 31495 | 51 | (conceptId, kind, k, force) | `profileIsMeaningful`×2, `similarityNeedsDegree`×2, `similarityData`, `networkSimilarityData`, `similarityOf` | `similarConceptsBlock`×3, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `rubricUnionSize` | function | 31574 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 31581 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 31672 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 31674 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 31680 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 31701 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 31743 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 31759 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 31778 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 31827 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 31831 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 31837 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31877 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31929 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 32002 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 32006 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 32017 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 32041 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 32058 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 32071 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 32100 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 32105 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 32143 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 32154 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 32163 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt049` | — | — |
| `handleMetricsScopeChange` | function | 32178 | 9 | () | `emit`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyLinkState`×2 | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 32192 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt049`, `stmt075` | — | — |
| `getMetricDescription` | function | 32727 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 32748 | 39 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `refreshObservationsNav`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2, `applyLinkState` | статич.×1, динам.×1 | — |
| `provenanceState` | function | 32816 | 6 | (z) | — | `provenanceKinds` | — | — |
| `provenanceKinds` | function | 32832 | 8 | (z) | `provenanceState` | `selectionListSets` | — | — |
| `setSelectionProvenance` | function | 32849 | 9 | (value) | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `selectionProvenance`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListSets` | function | 32862 | 64 | () | `selectionPhilCount`×4, `selectionProvenance`×2, `philosophers`, `nodes`, `links`, `isNodeVisible`, `isLinkVisible`, `provenanceKinds`, `selectionMirrorCount`, `linkHasTwoHeads`, `comparePhilosophers`, `compareConcepts`, `linkIsInternal`, `compareLinks`, `storedRecord` | `toggleSelectionBodies`, `renderSelectionList` | — | — |
| `openSelectionListModal` | function | 32927 | 12 | () | `SELECTION_LIST_CHUNK`×3, `selectionListShown`, `renderSelectionList`, `freezeSimulation` | — | статич.×1 | — |
| `closeSelectionListModal` | function | 32940 | 4 | () | `unfreezeSimulation` | — | статич.×1 | — |
| `toggleSelectionBlock` | function | 32945 | 5 | (kind) | `selectionListOpenBlocks`×3, `renderSelectionList` | — | динам.×2 | — |
| `toggleSelectionBody` | function | 32951 | 5 | (key) | `selectionListOpenBodies`×3, `renderSelectionList` | — | динам.×3 | — |
| `toggleSelectionBodies` | function | 32967 | 11 | (kind) | `selectionListOpenBodies`×3, `selectionListShown`, `selectionListSets`, `renderSelectionList` | — | динам.×1 | — |
| `selectionListMore` | function | 32982 | 4 | (kind) | `SELECTION_LIST_CHUNK`, `selectionListShown`, `renderSelectionList` | — | динам.×1 | — |
| `linkHasTwoHeads` | function | 33006 | 5 | (l) | `relationTypesObj` | `selectionListSets`, `orientLink`, `directionMark`, `linkShape` | — | — |
| `orientLink` | function | 33021 | 12 | (l, isOwnEnd) | `linkHasTwoHeads` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2 | — | — |
| `directionMark` | function | 33034 | 12 | (l) | `linkHasTwoHeads` | `selectionRowRelation`×2, `showFoundLinks` | — | — |
| `selectionLabel` | function | 33050 | 4 | (id) | `conceptById` | `selectionRowRelation`×2 | — | — |
| `selectionRowPhilosopher` | function | 33055 | 15 | (p) | `escapeAttr`×4, `selectionListOpenBodies`, `selectionPhilCount`, `descriptionHtml` | `renderSelectionList` | — | — |
| `selectionRowConcept` | function | 33078 | 15 | (n) | `escapeAttr`×3, `descriptionHtml`×2, `philosopherConcepts`, `selectionListOpenBodies` | `renderSelectionList` | — | — |
| `openSelectionLink` | function | 33106 | 7 | (s, t) | `links`, `openUniversalModal` | — | динам.×1 | — |
| `selectionRowRelation` | function | 33114 | 32 | (l) | `escapeAttr`×7, `directionMark`×2, `selectionLabel`×2, `relationTypesObj`, `conceptById`, `selectionListOpenBodies`, `linkIsInternal`, `otherEndColor`, `descriptionHtml` | `renderSelectionList` | — | — |
| `renderSelectionList` | function | 33147 | 83 | () | `selectionProvenance`×4, `PROVENANCE_LABELS`×3, `selectionMirrorCount`×2, `conceptById`, `selectionListOpenBlocks`, `SELECTION_LIST_CHUNK`, `selectionListShown`, `selectionListSets`, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation`, `escapeAttr` | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBlock`, `toggleSelectionBody`, `toggleSelectionBodies`, `selectionListMore` | — | — |
| `closeStatsModal` | function | 33231 | 43 | () | `lastScopeKey`×3, `cachesMatchLive`×2, `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `emit`, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `liveScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt067` | статич.×1 | — |
| `handleStatsParameterChange` | function | 33276 | 32 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `emit`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | `applyLinkState`×2 | статич.×2 | — |
| `observationsAllowed` | function | 33317 | 3 | () | `authSession`×2, `serverMode` | `refreshObservationsNav`×2, `switchStatsView` | — | — |
| `refreshObservationsNav` | function | 33320 | 5 | () | `currentStatsView`×2, `observationsAllowed`×2 | `openStatsModal`, `stmt034` | — | — |
| `switchStatsView` | function | 33326 | 17 | (viewName, event) | `emit`, `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `observationsAllowed`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `applyLinkState`, `stmt059` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 33345 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 33369 | 21 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `PERM`, `can`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 33396 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 33424 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 33461 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 33468 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent`, `deleteObservation` | — | — |
| `renderObservations` | function | 33492 | 46 | () | `escapeAttr`×7, `observationPicked`×4, `PERM`×3, `can`×3, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `deleteObservation` | async function | 33548 | 18 | (id) | `observationPicked`×2, `loadObservations`, `api`, `escapeAttr` | — | динам.×1 | — |
| `pickObservation` | function | 33567 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 33580 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 33608 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt056`, `stmt073` | — | — |
| `calculateMetricFromModal` | async function | 33695 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 33748 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 33770 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 33776 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `comparePhilosophers` | function | 33792 | 14 | (a, b) | `philosopherByName` | `compareLinks`×2, `selectionListSets`, `sortPhilosophersByBirth`, `compareConcepts`, `pickPhilosophers`, `philosopherTraditionsBlock` | — | — |
| `sortPhilosophersByBirth` | function | 33807 | 3 | (list) | `comparePhilosophers` | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `compareConcepts` | function | 33815 | 4 | (a, b) | `comparePhilosophers` | `rebuildIndexes`, `selectionListSets` | — | — |
| `linkIsInternal` | function | 33845 | 5 | (l) | `conceptById`×2 | `compareLinks`×2, `selectionListSets`, `selectionRowRelation` | — | — |
| `otherEndColor` | function | 33869 | 7 | (l, ownerName) | `conceptById`, `philosopherByName` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `selectionRowRelation` | — | — |
| `compareLinks` | function | 33877 | 12 | (a, b) | `comparePhilosophers`×2, `linkIsInternal`×2, `conceptById` | `rebuildIndexes`, `selectionListSets` | — | — |
| `philosopherYears` | function | 33889 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 33908 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 33934 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 33942 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 33955 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 33963 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 33967 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 33972 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 34002 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 34018 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 34020 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 34033 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 34074 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 34110 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 34186 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 34252 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 34266 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 34272 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML`, `descriptionHtml` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 34440 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 34470 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 34507 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 34572 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 34588 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 34604 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 34620 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 34636 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 34652 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 34668 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 34688 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 34712 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 34736 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 34760 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 34784 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 34808 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 34832 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 34856 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 34880 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 34905 | 195 | () | `descriptionHtml`×2, `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 35144 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 35177 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 35244 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 35266 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 35300 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 35305 | 42 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function ⟲ | 35348 | 108 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsKind`×2, `_pairsMinShared`×2, `emit`, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `fillPairsNetwork`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×8 | — |
| `openPairInComparison` | function | 35457 | 5 | (a, b) | `emit`×2, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 35463 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `similarityVerdict` | function | 35518 | 49 | (idA, idB) | `profileIsMeaningful`×2, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `NETWORK_ROLE_WORDS`, `networkSimilarity`, `networkRoleOf`, `SIM_SHARED_HIGH`, `similarityThresholds` | `renderComparison` | — | — |
| `computeComparisonNetwork` | function | 35568 | 7 | () | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `renderComparison` | — | динам.×1 | — |
| `renderComparison` | function | 35576 | 68 | () | `_cmpA`×8, `_cmpB`×8, `conceptById`×2, `profileIsMeaningful`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarity`, `similarityVerdict` | `loadStatsContent`×2, `applyLinkState`×2, `computeComparisonNetwork`, `stmt058` | — | — |
| `generateGenerativeContent` | function | 35645 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 35665 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 35685 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 35714 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 35741 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 35761 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 35785 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 35809 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 35833 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 35857 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 35915 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 35958 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 35997 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 36035 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 36080 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 36158 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 36221 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 36263 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt081` | — | — |
| `toggleMetricVisualization` | function | 36276 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 36410 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 36428 | 111 | (metricData, metricName) | `gfxNode`×2, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 36541 | 38 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `philosopherIdByName` | function | 36622 | 4 | (name) | `philosophers` | `currentLinkState`×3 | — | — |
| `philosopherNameById` | function | 36626 | 4 | (id) | `philosophers` | `applyLinkState`×2 | — | — |
| `excludedList` | function | 36632 | 8 | (set, all, toKey) | — | `currentLinkState`×3 | — | — |
| `currentLinkState` | function | 36641 | 63 | () | `ModalContext`×6, `similarityOverlay`×5, `currentStatsView`×4, `philosopherIdByName`×3, `excludedList`×3, `filterMode`×2, `_cmpA`×2, `_cmpB`×2, `_pairsKind`×2, `selectedSourceNode`×2, `selectedTargetNode`×2, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `selectedPhilosophers`, `selectedRelations`, `selectedRubrics` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `linkStateToHash` | function | 36705 | 8 | (st) | `LINK_KEYS` | `syncLinkHash`, `applyLinkState`, `initLinkState` | — | — |
| `hashToLinkState` | function | 36714 | 15 | (hash) | `LINK_KEYS` | `initLinkState`×2 | — | — |
| `syncLinkHash` | function | 36731 | 11 | (push) | `_linkLastHash`×2, `_linkApplying`, `currentLinkState`, `linkStateToHash` | `initLinkState` | — | — |
| `applyLinkState` | function | 36743 | 111 | (st) | `conceptById`×6, `selectedPhilosophers`×3, `selectedRelations`×3, `selectedRubrics`×3, `showTemporaryMessage`×2, `syncPhilosopherCheckboxes`×2, `handleMetricsScopeChange`×2, `handleStatsParameterChange`×2, `renderComparison`×2, `_linkApplying`×2, `philosopherNameById`×2, `selectCustomOption`×2, `openUniversalModal`×2, `rubrics`, `relations`, `philosopherConcepts`, `relationTypesObj`, `filterMode`, `findAndShowPath`, `applyFiltersImmediate`, `changeFilterMode`, `networkSimilarityData`, `currentStatsView`, `openStatsModal`, `switchStatsView`, `_cmpA`, `_cmpB`, `_pairsKind`, `_linkMissed`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `similarityOverlay`, `showSimilarityOverlay`, `setSimilarityLinks`, `openConceptById` | `initLinkState`×2 | — | — |
| `initLinkState` | function | 36855 | 15 | () | `hashToLinkState`×2, `applyLinkState`×2, `subscribe`, `_linkLastHash`, `currentLinkState`, `linkStateToHash`, `syncLinkHash` | `stmt013` | — | — |
| `showProgress` | function | 36879 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 36892 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 36898 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 36973 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 36993 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 37032 | 86 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `CONTRADICTION_DASH`×3, `nodes`×2, `isNodeVisible`×2, `isReflexiveLink`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `nodeEdgeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 37123 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 37148 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 37177 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 37189 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 37193 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 37197 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 37221 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 37257 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 37299 | 10 | (query) | `philosophers`, `comparePhilosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 37310 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 37337 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 37342 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 37351 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 37361 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 37385 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 37410 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 37420 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 37427 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 37444 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 37459 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 37471 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `applyLinkState`×2 | динам.×1 | — |
| `handleNodeClick` | function | 37530 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 37652 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 37681 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 37749 | 8 | () | `gfxCanvas`×4, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 37789 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function ⟲ | 37801 | 126 | (sourceId, kind) | `showTemporaryMessage`×6, `profileIsMeaningful`×3, `similarityOverlay`×3, `emit`×2, `concepts`, `relations`, `nodes`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `typeStyleSimilarity`, `networkSimilarityData`, `networkSimilarity`, `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `similarityNeedsDegree`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState`, `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 37928 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 37957 | 7 | (mode) | `similarityOverlay`×2, `emit`, `updateSimilarityLegend`, `requestDraw` | `applyLinkState` | динам.×1 | — |
| `nodeLitBySimilarity` | function | 37969 | 9 | (id) | `similarityOverlay`×5, `SIGNED_SIMILARITY` | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 37980 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 37995 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 38008 | 6 | () | `emit`, `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt051` | динам.×1 | — |
| `updateSimilarityLegend` | function | 38015 | 49 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIGNED_SIMILARITY`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 38068 | 1 | (d) | `renderState` | `exportToSVG`, `nodeOuterRadius`, `loopShape`, `renderScene`, `startRadiusAnimation`, `pickNode`, `pickLink` | — | — |
| `nodeLabelDy` | function | 38069 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 38070 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×5, `nodeDrawPass`×3, `nodeEdgeWidth`×2 | — | — |
| `hasLinkClass` | function | 38071 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `nodeDrawPass` | function | 38081 | 6 | (d) | `hasNodeClass`×3, `selectedNodes` | `renderScene`, `pickNode` | — | — |
| `nodeEdgeWidth` | function | 38089 | 16 | (d) | `hasNodeClass`×2, `similarityOverlay`, `selectedNodes` | `renderScene`×3, `exportToSVG`, `nodeOuterRadius`, `linksLayerKey` | — | — |
| `nodeOuterRadius` | function | 38108 | 1 | (d) | `nodeRadius`, `nodeEdgeWidth` | `clippedArc`×2, `loopShape` | — | — |
| `setPainter` | function | 38116 | 1 | (handler) | `painter` | `stmt062` | — | — |
| `requestDraw` | function | 38118 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 38140 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 38151 | 8 | () | `renderState`×2, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 38159 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 38170 | 4 | (d) | `renderState` | `arrowSize`, `linkDrawWidth`, `pickLink` | — | — |
| `linkHoverStrokeWidth` | function | 38174 | 4 | (d) | `renderState` | `linkDrawWidth` | — | — |
| `arcParams` | function | 38180 | 15 | (s, t) | — | `clippedArc` | — | — |
| `arcAngleOfChord` | function | 38213 | 3 | (c, R) | — | `clippedArc`×2, `linkShape`×2, `loopShape` | — | — |
| `clippedArc` | function | 38220 | 10 | (s, t) | `nodeOuterRadius`×2, `arcAngleOfChord`×2, `arcParams` | `linkShape`, `renderScene` | — | — |
| `arrowSize` | function | 38232 | 8 | (l, w) | `arrowMode`, `linkStrokeWidth` | `linkShape` | — | — |
| `arcHead` | function | 38243 | 8 | (g, tipA, baseA, half) | — | `linkShape`×2, `loopShape` | — | — |
| `linkShape` | function | 38256 | 20 | (l, w) | `arcAngleOfChord`×2, `arcHead`×2, `isReflexiveLink`, `linkHasTwoHeads`, `clippedArc`, `arrowSize`, `loopShape` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `loopShape` | function | 38280 | 16 | (l, w) | `nodeRadius`, `nodeOuterRadius`, `arcAngleOfChord`, `arcHead` | `linkShape` | — | — |
| `linkVisualState` | function | 38303 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawWidth` | function | 38311 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `pickLink` | — | — |
| `linkDrawAlpha` | function | 38320 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `exportToSVG`, `drawLinkSet` | — | — |
| `strokeLinkShape` | function | 38355 | 10 | (c, g, width) | — | `drawLinkSet`×2 | — | — |
| `fillLinkHeads` | function | 38366 | 10 | (c, g) | — | `drawLinkSet` | — | — |
| `linkOutOfLayer` | function | 38406 | 4 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 38410 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene`, `pickLink` | — | — |
| `linksLayerKey` | function | 38425 | 23 | (c) | `renderState`×5, `nodes`×3, `links`, `visibleLinkSet`, `arrowMode`, `similarityOverlay`, `nodeEdgeWidth`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 38448 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 38454 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 38478 | 42 | (c, tms, take) | `relationTypesObj`×4, `CONTRADICTION_DASH`×3, `isReflexiveLink`×2, `strokeLinkShape`×2, `links`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `fillLinkHeads`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 38528 | 137 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×5, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `nodeEdgeWidth`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `NODE_PASSES`, `nodeDrawPass`, `clippedArc`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 38666 | 9 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt062` | — | — |
| `startRadiusAnimation` | function | 38677 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 38683 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `storedRecord` | function | 38718 | 5 | (kind, id) | `philosophers`, `concepts`, `relations` | `generateConnectionVisualization`×4, `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `selectionListSets`, `hasConceptChanges`, `hasConnectionChanges`, `saveConceptData`, `saveConnectionData`, `generateConceptViewContent` | — | — |
| `withoutEmptyOptional` | function | 38729 | 8 | (record) | `OMITTED_WHEN_EMPTY` | `saveConnectionData`×3, `savePhilosopherData`×2, `saveConceptData`×2 | — | — |
| `toGraph` | function | 38738 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `pickLink`, `dispatchMove` | — | — |
| `pickNode` | function | 38744 | 10 | (gx, gy) | `nodes`, `isNodeVisible`, `nodeRadius`, `NODE_PASSES`, `nodeDrawPass` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `pointInTriangle` | function | 38755 | 5 | (x, y, t) | — | `hitLinkShape` | — | — |
| `distToSegment` | function | 38761 | 5 | (x, y, a, b) | — | `hitLinkShape`×3 | — | — |
| `hitLinkShape` | function | 38773 | 16 | (g, w, x, y) | `distToSegment`×3, `pointInTriangle` | `pickLink` | — | — |
| `pickLink` | function | 38794 | 36 | (clientX, clientY) | `links`×2, `DRAW_ORDER`×2, `isLinkVisible`, `gfxCanvas`, `PICK_LINK_WIDTH`, `nodeRadius`, `linkStrokeWidth`, `linkShape`, `linkVisualState`, `linkDrawWidth`, `linkDrawnLive`, `toGraph`, `hitLinkShape` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 38836 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 38852 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 38903 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 39005 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 39028 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 39063 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 39075 | 4 | () | `tickCount`, `layoutSettled` | `dragMoveStarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 39133 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 39164 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 39199 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 39216 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 39223 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 39233 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 39243 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 39343 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 39379 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragMoveStarted` | function | 39557 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 39567 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 39573 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 39586 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 39598 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 39611 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 39624 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `openSelectionListModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 39629 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeSelectionListModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 39667 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 39689 | 14 | () | — | `stmt077` | — | — |
| `toggleGrouping` | function | 39704 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 39781 | 4 | (conceptId) | `conceptById`, `showDetailModal` | `applyLinkState` | динам.×3 | — |
| `similarItemHtml` | function | 39787 | 15 | (x) | `conceptById` | `similarColumnHtml` | — | — |
| `similarForced` | function | 39806 | 3 | (conceptId, kind) | `_forcedSimilar`×2 | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `forceSimilarColumn` | function | 39809 | 9 | (kind, conceptId) | `_forcedSimilar`×3, `networkSimilarityData`, `refreshSimilarColumn`, `computeSimilarNetworkColumn` | — | динам.×1 | — |
| `refreshSimilarColumn` | function | 39818 | 8 | (kind, conceptId) | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `forceSimilarColumn`, `refreshSimilarNetworkColumn` | — | — |
| `forceButtonHtml` | function | 39826 | 4 | (kind, conceptId, caption) | — | `similarProfileColumnHtml`, `similarNetworkColumnHtml` | — | — |
| `similarColumnHtml` | function | 39831 | 10 | (title, hint, list, empty, attrs) | `similarItemHtml` | `similarNetworkColumnHtml`×3, `similarProfileColumnHtml`×2, `similarConceptsBlock`×2 | — | — |
| `similarProfileColumnHtml` | function | 39842 | 16 | (conceptId) | `profileIsMeaningful`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `similarNetworkColumnHtml` | function | 39863 | 20 | (conceptId) | `similarColumnHtml`×3, `profileIsMeaningful`×2, `medianNodeDegree`, `nodeDegreeOf`, `nearestConcepts`, `similarForced`, `forceButtonHtml` | `refreshSimilarColumn`, `similarConceptsBlock` | — | — |
| `computeSimilarNetworkColumn` | function | 39884 | 13 | (conceptId) | `networkProgressPercent`, `ensureNetworkProfile`, `liveProgressHtml`, `updateLiveProgress`, `refreshSimilarNetworkColumn` | `forceSimilarColumn` | динам.×1 | — |
| `refreshSimilarNetworkColumn` | function | 39898 | 3 | (conceptId) | `refreshSimilarColumn` | `computeSimilarNetworkColumn` | — | — |
| `similarConceptsBlock` | function | 39902 | 52 | (conceptId) | `nearestConcepts`×3, `_forcedSimilar`×2, `similarColumnHtml`×2, `medianNodeDegree`, `nodeDegreeOf`, `profileIsMeaningful`, `similarProfileColumnHtml`, `similarNetworkColumnHtml` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 39983 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 39999 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 40018 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 40024 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 40041 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 40053 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 40128 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 40137 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 40236 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 40267 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 40282 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt044` | динам.×1 | — |
| `modalEntityExists` | function | 40302 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 40320 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 40408 | 1 | (permissions) | `granted` | `setSessionUser` | — | — |
| `can` | function | 40410 | 1 | (permission) | `granted` | `renderCommits`×4, `renderObservations`×3, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` | — | — |
| `setSessionUser` | function | 40414 | 11 | (user, grantedFromServer) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 40428 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 40430 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 40473 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 40475 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 40480 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 40509 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 40541 | 41 | () | `securityError`×3, `securitySecret`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `api`, `detectServerMode`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 40583 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 40589 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 40600 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 40607 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 40622 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 40629 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 40645 | 99 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `emit`×2, `closeAuthModal`×2, `authNoticeMember`×2, `logoutInFlight`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 40747 | 45 | () | `ModalContext`×2, `logoutInFlight`×2, `emit`, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode`, `serverMode`, `api`, `disconnectLive`, `reportSubmit` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 40795 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `confirmMfaEnroll`, `authLogout` | — | — |
| `renderAuthControls` | function | 40807 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt041`, `stmt042` | — | — |
| `philRowTip` | function | 40840 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 40846 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt042` | — | — |
| `openUniversalModal` | function | 40862 | 67 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `emit`, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `applyLinkState`×2, `saveConceptData`×2, `saveConnectionData`×2, `openSelectionLink`, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt070` | динам.×26 | — |
| `closeUniversalModal` | function | 40931 | 28 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `emit`, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 40961 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 40980 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 41001 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 41012 | 23 | (original) | `philosopherByName`×2, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 41036 | 20 | (original) | `conceptToRubrics`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 41057 | 28 | (original) | `ModalContext`×2, `relationTypesObj`, `storedRecord`, `footnotesChanged` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 41087 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 41091 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 41101 | 11 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 41113 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 41120 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 41141 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt069` | — | — |
| `showPhilosopherDetailModal` | function | 41145 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 41149 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt068` | — | — |
| `closePhilosopherDetailModal` | function | 41150 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 41152 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 41157 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt071` | динам.×1 | — |
| `openEditConnectionModal` | function | 41164 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `rebuildOverCurrent`, `stmt072` | динам.×1 | — |
| `updateGraphData` | function | 41189 | 22 | () | `simulation`×3, `nodes`, `links`, `requestDraw`, `linkLayer`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt054` | — | — |
| `addNodeToGraph` | function | 41212 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 41230 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 41235 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 41247 | 8 | () | `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 41261 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 41280 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 41293 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 41356 | 1 | () | `hasUnsavedEdits`, `serverMode` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 41357 | 1 | () | `hasUnsavedEdits`, `unconfirmedDirect` | `stmt028` | — | — |
| `trackDirectEdit` | function | 41361 | 11 | (sending) | `unconfirmedDirect`×2, `hasUnsavedEdits` | `submitChange` | — | — |
| `collectData` | function | 41373 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 41377 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 41389 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 41398 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 41443 | 10 | (cookieName) | — | `apiOnce` | — | — |
| `api` | async function ⟲ | 41460 | 10 | (path, options=…, freshAsked=…) | `apiOnce`×2 | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `deleteObservation`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `authLogout`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent`, `toggleEntityHistory`, `revertEntityToVersion` | — | — |
| `apiOnce` | async function | 41471 | 34 | (path, ?) | `serverMode`, `readCookie` | `api`×2 | — | — |
| `detectServerMode` | async function | 41510 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `confirmMfaEnroll`, `stmt042` | — | — |
| `sameValue` | function | 41572 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 41587 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 41611 | 16 | (descr, apply) | `sendCommit`×2, `PERM`, `can`, `trackDirectEdit`, `serverMode`, `lastSubmitted` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `markSupersedes` | function | 41642 | 3 | (commitId, kind, entityId) | `supersedesNext` | `rebuildOverCurrent` | — | — |
| `sendCommit` | async function | 41646 | 63 | (descr, direct) | `supersedesNext`×5, `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange`×2 | — | — |
| `commitMessageFor` | function | 41711 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 41747 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 41754 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 41759 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 41777 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 41804 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 41818 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 41862 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 41869 | 4 | () | — | `stmt031` | статич.×1 | — |
| `switchCommitTab` | function | 41874 | 14 | (tab) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 41899 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 41918 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 41929 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 41931 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 41937 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 41956 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 41979 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 42010 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 42014 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `changesDiff` | function | 42043 | 21 | (changes) | `escapeAttr`×3, `CHANGE_FIELD_LABELS`, `CHANGE_KIND_LABELS`, `conflictValue`, `richText` | `renderCommits` | — | — |
| `provenanceDiff` | function | 42065 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `footnotesDiff` | function | 42104 | 22 | (changes) | `escapeAttr`×3, `FOOTNOTE_LABELS` | `renderCommits` | — | — |
| `stateInWords` | function | 42127 | 4 | (stateCode) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 42140 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 42156 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 42206 | 86 | () | `escapeAttr`×14, `PERM`×4, `can`×4, `commitTab`×3, `commitItems`×3, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `changesDiff`, `provenanceDiff`, `footnotesDiff`, `layoutTabHtml`, `conflictRowsHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 42299 | 7 | (count) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 42307 | 20 | (id, verdict) | `emit`, `api`, `commitItems`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 42328 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 42352 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 42373 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 42435 | 11 | () | `unreadCount`×4, `renderBell`×2, `authSession`, `serverMode`, `api` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 42447 | 7 | () | `notifyItems`×2, `authSession`, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 42455 | 9 | () | `unreadCount`×3, `authSession`, `serverMode` | `refreshUnread`×2, `stmt033` | — | — |
| `renderNotifyList` | function | 42465 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 42485 | 17 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 42503 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 42511 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt035` | — | — |
| `markAllNotificationsRead` | async function | 42521 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 42554 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt036` | — | — |
| `showConflict` | function | 42571 | 21 | (descr, clashes, commitId=…) | `reportSubmit`×2, `conflictRowsHtml`, `lastConflict` | `stmt029` | — | — |
| `conflictValue` | function | 42604 | 7 | (v) | `FOOTNOTE_LABELS` | `conflictRowsHtml`×3, `changesDiff` | — | — |
| `conflictRowsHtml` | function | 42611 | 16 | (clashes) | `escapeAttr`×6, `conflictValue`×3 | `renderCommits`, `showConflict` | — | — |
| `rebuildOverCurrent` | async function | 42631 | 29 | (given=…) | `reportSubmit`×2, `links`, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `api`, `markSupersedes`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | `stmt031` | статич.×1 | — |
| `replaceEntity` | function | 42675 | 9 | (set, id, record) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 42689 | 18 | (increment) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 42709 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `revertEntityToVersion`, `stmt042` | — | — |
| `connectLive` | function ⟲ | 42745 | 38 | () | `liveSocket`×5, `authSession`×2, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt042` | — | — |
| `disconnectLive` | function | 42790 | 5 | () | `liveSocket`×2 | `authLogout` | — | — |
| `rebuildDerived` | function | 42815 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 42859 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 42877 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 42885 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `authLogout`, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 42910 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 42964 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 42996 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt044`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 43016 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `historyBlock` | function | 43074 | 17 | (kind, entityId) | `escapeAttr`×4, `serverMode` | `generateConnectionViewContent`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `toggleEntityHistory` | async function | 43092 | 18 | (kind, entityId) | `historyBusy`×3, `historyFor`×2, `historyItems`×2, `renderEntityHistory`×2, `api`, `toggleSubsection` | `revertEntityToVersion`×2 | динам.×1 | — |
| `renderEntityHistory` | function | 43116 | 39 | (kind, entityId) | `escapeAttr`×10, `historyItems`×2, `PERM`, `can` | `toggleEntityHistory`×2 | — | — |
| `revertEntityToVersion` | async function | 43156 | 20 | (kind, entityId, version) | `toggleEntityHistory`×2, `api`, `pullGraphSince`, `historyFor`, `historyItems` | — | динам.×1 | — |
| `provenanceBlock` | function | 43177 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `withoutFootnotes` | function | 43217 | 4 | (text) | `FOOTNOTE_MARK_SOURCE` | `descriptionHtml`, `descriptionPlain`, `provenanceEntityDrift` | — | — |
| `richText` | function | 43233 | 13 | (text) | `RICH_TAG`, `escapeAttr` | `changesDiff`, `descriptionHtml`, `footnotedText` | — | — |
| `descriptionHtml` | function | 43247 | 1 | (text) | `withoutFootnotes`, `richText` | `generatePhilosopherViewContent`×4, `generateConceptViewContent`×3, `showPathDescriptionsModal`×2, `selectionRowConcept`×2, `generateTensionContent`×2, `findAndShowPath`, `selectionRowPhilosopher`, `selectionRowRelation`, `generateMetricResults`, `stmt024`, `stmt025`, `generatePhilosopherEditContent`, `philosopherTraditionsBlock` | — | — |
| `descriptionPlain` | function | 43249 | 4 | (text) | `withoutFootnotes` | `generatePhilosopherViewContent`×2, `findAndShowPath`, `initFilters` | — | — |
| `footnoteOrder` | function | 43255 | 9 | (...texts) | `FOOTNOTE_MARK_SOURCE` | `generateConnectionVisualization`×2, `provenanceDriftWarning`, `footnotesField`, `insertFootnote`, `refreshFootnoteRows`, `footnotesValue`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotedText` | function | 43266 | 10 | (text, order, notes) | `FOOTNOTE_MARK_SOURCE`, `richText`, `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `footnotesBlock` | function | 43279 | 11 | (notes, order) | `escapeAttr`×4, `FOOTNOTE_LABELS` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `installFootnoteLinks` | function | 43295 | 24 | () | `lastFootnoteHost`, `refreshFootnoteRows` | `stmt038` | — | — |
| `escapeAttr` | function | 43321 | 4 | (s) | — | `renderCommits`×14, `renderEntityHistory`×10, `renderUsers`×8, `selectionRowRelation`×7, `renderObservations`×7, `compareObservationsInPanel`×6, `conflictRowsHtml`×6, `layoutHistoryHtml`×5, `generatePhilosopherEditContent`×5, `generateConceptEditContent`×5, `selectionRowPhilosopher`×4, `layoutTabHtml`×4, `historyBlock`×4, `footnotesBlock`×4, `findAndShowPath`×3, `selectionRowConcept`×3, `changesDiff`×3, `provenanceDiff`×3, `footnotesDiff`×3, `renderNotifyList`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `generateConnectionEditContent`×2, `generatePhilosopherViewContent`×2, `initFilters`, `renderSelectionList`, `deleteObservation`, `confirmMfaEnroll`, `provenanceBlock`, `richText`, `footnotedText`, `provenanceField`, `footnoteRow` | динам.×13 | — |
| `relationIndexById` | function | 43338 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 43346 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 43364 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 43405 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 43412 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 43413 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 43415 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 43424 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `footnotePhrase` | function | 43580 | 12 | (texts, id) | `FOOTNOTE_MARK_SOURCE` | `provenanceDriftWarning`×2 | — | — |
| `provenanceDriftWarning` | function | 43593 | 22 | (prev, next) | `footnotePhrase`×2, `footnoteOrder`, `provenanceEntityDrift` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceEntityDrift` | function | 43616 | 15 | (prev, next) | `withoutFootnotes` | `provenanceDriftWarning` | — | — |
| `conceptIntegrityWarnings` | function | 43632 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 43651 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 43669 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 43679 | 107 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `withoutEmptyOptional`×2, `footnotesValue`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 43787 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 43835 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 43844 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 43852 | 83 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `withoutEmptyOptional`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `footnotesValue`×2, `philosopherByName`, `storedRecord`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 43950 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 43986 | 100 | () | `ModalContext`×6, `relations`×5, `withoutEmptyOptional`×3, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `footnotesValue`×2, `relationTypesObj`, `storedRecord`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 44087 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 44162 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 44189 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 44208 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 44230 | 4 | (line, state) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `footnoteRow` | function | 44239 | 15 | (note, n) | `FOOTNOTE_LABELS`, `FOOTNOTE_STATE_ORDER`, `escapeAttr` | `footnotesField`, `insertFootnote` | — | — |
| `footnotesField` | function | 44255 | 15 | (record) | `footnoteOrder`, `footnoteRow` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `footnoteHosts` | function | 44274 | 4 | () | — | `insertFootnote`, `removeFootnote`, `refreshFootnoteRows`, `footnotesValue` | — | — |
| `insertFootnote` | function | 44279 | 22 | () | `lastFootnoteHost`×2, `footnoteOrder`, `footnoteRow`, `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `removeFootnote` | function | 44302 | 7 | (id) | `footnoteHosts`, `refreshFootnoteRows` | — | динам.×1 | — |
| `refreshFootnoteRows` | function | 44312 | 19 | () | `footnoteOrder`, `footnoteHosts` | `installFootnoteLinks`, `insertFootnote`, `removeFootnote` | динам.×1 | — |
| `footnotesValue` | function | 44333 | 17 | () | `FOOTNOTE_LABELS`, `footnoteOrder`, `footnoteHosts` | `savePhilosopherData`×2, `saveConceptData`×2, `saveConnectionData`×2, `footnotesChanged` | — | — |
| `footnotesChanged` | function | 44352 | 5 | (record) | `footnotesValue` | `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | — | — |
| `needsCitation` | function | 44358 | 3 | (state) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 44373 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 44383 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 44403 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 44421 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 44428 | 118 | (philosopherName) | `escapeAttr`×5, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `descriptionHtml`, `provenanceField`, `footnotesField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 44551 | 133 | (conceptData) | `escapeAttr`×5, `philosopherConcepts`×3, `relationHint`×2, `storedRecord`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `provenanceField`, `footnotesField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 44692 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 44733 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 44759 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 44769 | 98 | (connectionData) | `conceptById`×2, `relationHint`×2, `storedRecord`×2, `ModalContext`×2, `escapeAttr`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `provenanceField`, `footnotesField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 44872 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 44902 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt057` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 44921 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 44935 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 44957 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 44961 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 44980 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 44989 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 44996 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 45020 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 45035 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 45096 | 75 | (sourceNode, targetNode, connectionData) | `storedRecord`×4, `conceptPlate`×3, `relationHint`×2, `footnoteOrder`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `footnotedText`, `footnotesBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 45172 | 85 | (connectionData) | `conceptById`×2, `ModalContext`×2, `historyBlock`, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 45269 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 45289 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 45332 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt057` | динам.×1 | — |
| `updateConnectionVisualization` | function | 45366 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 45388 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 45412 | 259 | (conceptData) | `relationTypesObj`×4, `philosopherConcepts`×3, `descriptionHtml`×3, `conceptToRubrics`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `storedRecord`, `similarConceptsBlock`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 45673 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 45689 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 45700 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 45739 | 14 | (sectionId) | — | `toggleEntityHistory` | динам.×4 | — |
| `gotoNodeFromModal` | function | 45755 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 45780 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 45811 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 45822 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 45857 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `comparePhilosophers`, `descriptionHtml`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 45896 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 45901 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 45937 | 488 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×12, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `descriptionHtml`×4, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `philosopherConcepts`×2, `links`×2, `orientLink`×2, `linkArrow`×2, `otherEndColor`×2, `descriptionPlain`×2, `escapeAttr`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `historyBlock`, `provenanceBlock`, `footnoteOrder`, `footnotedText`, `footnotesBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 46427 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 46443 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 46479 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 46511 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt040`, `stmt053` | — | — |
| `closeAllModals` | function | 46618 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt043`, `stmt044` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5946 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 6068 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `selectionListSets`, `philosopherIdByName`, `philosopherNameById`, `pickPhilosophers`, `storedRecord`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6791 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `currentLinkState`, `applyLinkState`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6871 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6911 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12840 | массив (2723) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `applyLinkState`, `showSimilarityOverlay`, `storedRecord`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 24176 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 24274 | литерал null | — | `applyStoredLayout`×2, `stmt082`×2 |
| `philosopherIdToName` | const | 24277 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 24283 | объект (0) | — | `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generateConceptViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `generatePhilosopherViewContent`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `selectionRowConcept`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 24292 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 24298 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `linkHasTwoHeads`, `selectionRowRelation`, `currentLinkState`, `applyLinkState`, `exportToSVG`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 24323 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 24329 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `linksLayerKey`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `selectionListSets`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `pickNode`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt045` |
| `links` | const | 24347 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `selectionListSets`, `openSelectionLink`, `exportToSVG`, `similarityLinkCount`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `rebuildOverCurrent`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt045` |
| `conceptToRubrics` | const | 24359 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 24365 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 24397 | new Map | — | `generatePhilosopherViewContent`×12, `applyLinkState`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `linkIsInternal`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `selectionLabel`, `selectionRowRelation`, `renderSelectionList`, `otherEndColor`, `compareLinks`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarItemHtml`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 24398 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `hasPhilosopherChanges`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `comparePhilosophers`, `otherEndColor`, `philosopherYears`, `showPhilosopherProfileModal`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 24399 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 24400 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 24401 | new Map | — | `rebuildIndexes`×4, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 24402 | new Map | — | `rebuildIndexes`×7, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 24457 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `liveScopeKey`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt079`, `stmt084` |
| `respectDirection` | let | 24458 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `liveScopeKey`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt080`, `stmt084` |
| `skipTypologicalInPaths` | let | 24475 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 24491 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 24532 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt086` |
| `MATURITY_AGE` | const | 24535 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 24538 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `applyLinkState`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `currentLinkState`, `deletePhilosopher` |
| `selectedRelations` | let | 24539 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `applyLinkState`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations`, `currentLinkState` |
| `philosopherTraditions` | const | 24542 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 24548 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `applyLinkState`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics`, `currentLinkState` |
| `filterMode` | let | 24551 | строка | — | `applyFiltersImmediate`×3, `currentLinkState`×2, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode`, `applyLinkState` |
| `arrowHoverTimer` | let | 25268 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 25269 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 25383 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 25533 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 25560 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25639 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25708 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25838 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt061` |
| `hintBox` | let | 25966 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 26000 | массив (19) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 26021 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 26023 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 26098 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 26252 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 26414 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 26556 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26737 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26738 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26991 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26998 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 27021 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 27146 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 27498 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 27499 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 27500 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 27539 | литерал null | — | `applyMetricsScope`×4, `closeStatsModal`×3 |
| `cachesMatchLive` | let | 27549 | литерал true | — | `closeStatsModal`×2, `applyMetricsScope` |
| `FORMULA_VERSIONS` | const | 27613 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27649 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27698 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27912 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27913 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 28105 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 28106 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 28252 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 28253 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 28381 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 28443 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 28444 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 28445 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 28454 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28809 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `networkSimilarityData`, `networkProgressPercent`, `ensureNetworkProfile`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28810 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28812 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28954 | литерал null | — | `philosopherSimilarityData`×4, `metricDescriptions`×3, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `typeStyleData`, `networkSimilarityData`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28955 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `typeStyleData`, `generativityScores`, `metricDescriptions`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28956 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28957 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28958 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28959 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28960 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28961 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 29044 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 29162 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 29345 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 29479 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 29535 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29704 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29712 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29715 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29717 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29719 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29807 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29882 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29887 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29953 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 30011 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 30026 | объект (3) | — | — |
| `_tensionScales` | let | 30032 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 30033 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 30297 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 30347 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 30410 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 30477 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 30533 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30598 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30637 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30741 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30780 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30837 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30892 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30971 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30987 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 31011 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 31075 | литерал null | — | `allConceptPairs`×5, `allConceptPairsAsync`×3, `invalidateSimilarityCache` |
| `_pairCalculating` | let | 31076 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 31092 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 31182 | литерал null | — | `neighborSets`×3 |
| `_typeStyleCache` | let | 31268 | литерал null | — | `typeStyleData`×4, `invalidateSimilarityCache` |
| `NETWORK_SIM_NAMES` | const | 31303 | массив (8) | — | `networkSimilarityData` |
| `NETWORK_ROLE_OF` | const | 31305 | объект (8) | — | `networkRoleOf` |
| `NETWORK_ROLE_WORDS` | const | 31310 | объект (4) | — | `similarityVerdict` |
| `_netSimCache` | let | 31313 | литерал null | — | `networkSimilarityData`×5, `invalidateSimilarityCache` |
| `_netSimPending` | let | 31314 | литерал null | — | `ensureNetworkProfile`×5 |
| `NETWORK_PROGRESS_WEIGHTS` | const | 31371 | объект (4) | — | `networkProgressPercent`×2 |
| `_netProgress` | let | 31372 | объект (4) | — | `ensureNetworkProfile`×2, `networkProgressPercent` |
| `_netProgressListeners` | const | 31373 | new Set | — | `ensureNetworkProfile`×3 |
| `SIGNED_SIMILARITY` | const | 31442 | new Set | — | `nodeLitBySimilarity`, `updateSimilarityLegend` |
| `SIM_VERDICT_HIGH_Q` | const | 31458 | литерал 0.9 | — | `similarityThresholds` |
| `SIM_VERDICT_LOW_Q` | const | 31459 | литерал 0.1 | — | `similarityThresholds` |
| `SIM_SHARED_HIGH` | const | 31460 | литерал 3 | — | `similarityVerdict` |
| `_simThresholdCache` | let | 31461 | литерал null | — | `similarityThresholds`×4, `invalidateSimilarityCache` |
| `PHIL_SIM_MIN_CONCEPTS` | const | 31554 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 31573 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 31579 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 31729 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 31738 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 31770 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 31771 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 31776 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31875 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31921 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31926 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31927 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 32015 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 32053 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 32141 | строка | — | `liveScopeKey`×2, `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 32269 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×3, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `_relations`, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 32744 | литерал null | — | `openStatsModal`×4, `currentLinkState`×4, `handleStatsParameterChange`×3, `refreshObservationsNav`×2, `stmt056`×2, `stmt073`×2, `effectiveScopeFlags`, `switchStatsView`, `applyLinkState` |
| `isStatsModalOpen` | let | 32745 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt056`, `stmt073` |
| `selectionListOpenBlocks` | let | 32802 | new Set | — | `toggleSelectionBlock`×3, `renderSelectionList` |
| `selectionListOpenBodies` | let | 32803 | new Set | — | `toggleSelectionBody`×3, `toggleSelectionBodies`×3, `selectionRowPhilosopher`, `selectionRowConcept`, `selectionRowRelation` |
| `SELECTION_LIST_CHUNK` | const | 32804 | литерал 400 | — | `setSelectionProvenance`×3, `openSelectionListModal`×3, `selectionListMore`, `renderSelectionList` |
| `selectionListShown` | let | 32805 | объект (3) | — | `setSelectionProvenance`, `openSelectionListModal`, `toggleSelectionBodies`, `selectionListMore`, `renderSelectionList` |
| `selectionProvenance` | let | 32808 | строка | — | `renderSelectionList`×4, `selectionListSets`×2, `setSelectionProvenance` |
| `PROVENANCE_LABELS` | const | 32841 | объект (5) | — | `renderSelectionList`×3 |
| `selectionPhilCount` | let | 32859 | объект (0) | — | `selectionListSets`×4, `selectionRowPhilosopher` |
| `selectionMirrorCount` | let | 32860 | литерал 0 | — | `renderSelectionList`×2, `selectionListSets` |
| `observationItems` | let | 33458 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 33459 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `deleteObservation`×2, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 33737 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 33933 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 33952 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 33953 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 33978 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 33999 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 34000 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 34109 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 34122 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 34246 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 35105 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 35105 | литерал null | — | `renderComparison`×8, `generateComparisonContent`×3, `currentLinkState`×2, `openPairInComparison`, `applyLinkState`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 35117 | строка | — | `renderClosestPairs`×2, `currentLinkState`×2, `applyLinkState` |
| `_pairsMinDegree` | var | 35118 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 35119 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 35120 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 35121 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 35123 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 35123 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 35141 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 35242 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 36215 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 36216 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 36217 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 36218 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `LINK_KEYS` | const | 36612 | объект (14) | — | `linkStateToHash`, `hashToLinkState` |
| `_linkApplying` | let | 36618 | литерал false | — | `applyLinkState`×2, `syncLinkHash` |
| `_linkMissed` | let | 36619 | массив (0) | — | `applyLinkState` |
| `_linkLastHash` | let | 36620 | литерал null | — | `syncLinkHash`×2, `applyLinkState`, `initLinkState` |
| `selectedSourceNode` | let | 37382 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 37383 | литерал null | — | `currentLinkState`×2, `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 37513 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 37526 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 37527 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 37528 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 37649 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 37650 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 37726 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 37727 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 37736 | вызов document.getElementById() | — | `resizeCanvas`×4, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 37737 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 37738 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `PICK_LINK_WIDTH` | const | 37745 | литерал 10 | — | `pickLink` |
| `dpr` | let | 37747 | выражение | — | `paintLinkLayer`×4, `draw`×4, `resizeCanvas`×3 |
| `renderState` | const | 37759 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `draw`, `startRadiusAnimation`, `toGraph`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 37773 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowSize`, `linksLayerKey` |
| `uniformLinkWidthActive` | var | 37774 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 37779 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `currentLinkState`×5, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt051`×2, `applyLinkState`, `clearSimilarityOverlay`, `nodeEdgeWidth`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 37785 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 37786 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 38065 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 38066 | литерал 1 | — | `renderScene` |
| `NODE_PASSES` | const | 38077 | массив (3) | — | `renderScene`, `pickNode` |
| `drawScheduled` | let | 38111 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 38115 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 38132 | литерал false | — | `ensureAnimLoop`×3 |
| `CONTRADICTION_DASH` | const | 38351 | объект (3) | — | `exportToSVG`×3, `drawLinkSet`×3 |
| `DRAW_ORDER` | const | 38377 | массив (5) | — | `pickLink`×2, `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 38390 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 38396 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 38526 | литерал 3 | — | `renderScene` |
| `OMITTED_WHEN_EMPTY` | const | 38728 | массив (3) | — | `withoutEmptyOptional` |
| `nodeHandlers` | const | 38834 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 38834 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 38876 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 38888 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 38898 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 38906 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 38978 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 38979 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 38981 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 39002 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 39008 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragMoveStarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt078` |
| `maxTicks` | let | 39064 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 39120 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `nodeDrawPass`, `nodeEdgeWidth`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 39123 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 39131 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 39131 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 39392 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 39393 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 39622 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 39648 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 39649 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 39650 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 39651 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 39652 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 39653 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 39664 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `_forcedSimilar` | let | 39805 | объект (2) | — | `forceSimilarColumn`×3, `similarForced`×2, `similarConceptsBlock`×2 |
| `PROFILE_METRICS` | const | 39961 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 40017 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 40253 | объект (4) | — | `currentLinkState`×6, `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 40264 | массив (0) | — | `pushModalState`×5, `stmt044`×2, `stmt052`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 40265 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 40359 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 40360 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 40361 | объект (1) | — | `observationsAllowed`×2, `connectLive`×2, `setSessionUser`, `renderAuthControls`, `refreshUnread`, `loadNotifications`, `renderBell` |
| `authModalKind` | let | 40362 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 40380 | вызов Object.freeze() | — | `renderCommits`×4, `renderObservations`×3, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `observationBar`, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers`, `renderEntityHistory` |
| `granted` | let | 40406 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 40471 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `logoutInFlight` | let | 40745 | литерал null | — | `submitAuth`×2, `authLogout`×2 |
| `pinnedVisibleNodes` | const | 41187 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 41343 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 41345 | литерал false | — | `markDirty`, `hasUnsaved`, `trackDirectEdit`, `downloadData`, `saveToFolder` |
| `unconfirmedDirect` | let | 41354 | литерал 0 | — | `trackDirectEdit`×2, `hasUnsaved` |
| `dataFolder` | let | 41396 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 41441 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationsAllowed`, `observationBar`, `loadObservations`, `authLogout`, `markDirty`, `apiOnce`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `historyBlock`, `commitReasonField` |
| `lastSubmitted` | let | 41609 | литерал null | — | `submitChange` |
| `supersedesNext` | let | 41641 | литерал null | — | `sendCommit`×5, `markSupersedes` |
| `userItems` | let | 41744 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 41745 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 41858 | строка | — | `switchCommitTab`×4, `renderCommits`×3, `loadCommits` |
| `commitItems` | let | 41859 | массив (0) | — | `loadCommits`×3, `renderCommits`×3, `reviewCommitFromPanel`, `stmt031` |
| `commitError` | let | 41860 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 41896 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 41897 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 41916 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 41927 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 42001 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `CHANGE_FIELD_LABELS` | const | 42037 | объект (17) | — | `changesDiff` |
| `CHANGE_KIND_LABELS` | const | 42041 | объект (6) | — | `changesDiff` |
| `LAYOUT_KINDS` | const | 42138 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 42432 | литерал 0 | — | `refreshUnread`×4, `renderBell`×3 |
| `notifyItems` | let | 42433 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 42672 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 42784 | литерал null | — | `connectLive`×5, `disconnectLive`×2, `stmt037`×2 |
| `liveRetry` | let | 42785 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 42786 | литерал false | — | `connectLive`, `stmt037` |
| `lastConflict` | let | 42882 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 42905 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 42907 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 42962 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 43030 | массив (3) | — | `generateConnectionEditContent` |
| `historyFor` | let | 43059 | литерал null | — | `toggleEntityHistory`×2, `revertEntityToVersion` |
| `historyItems` | let | 43060 | массив (0) | — | `toggleEntityHistory`×2, `renderEntityHistory`×2, `revertEntityToVersion` |
| `historyBusy` | let | 43061 | литерал false | — | `toggleEntityHistory`×3 |
| `FOOTNOTE_MARK_SOURCE` | const | 43209 | TaggedTemplateExpression | — | `withoutFootnotes`, `footnoteOrder`, `footnotedText`, `footnotePhrase` |
| `FOOTNOTE_LABELS` | const | 43212 | объект (3) | — | `footnotesDiff`, `conflictValue`, `footnotesBlock`, `footnoteRow`, `footnotesValue` |
| `FOOTNOTE_STATE_ORDER` | const | 43214 | массив (3) | — | `footnoteRow` |
| `RICH_TAG` | const | 43232 | литерал {} | — | `richText` |
| `lastFootnoteHost` | let | 43294 | литерал null | — | `insertFootnote`×2, `installFootnoteLinks` |
| `GROUNDING_TYPES` | const | 43361 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 44155 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 44977 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 45698 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 46441 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 46477 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 46793 | вызов document.getElementById() | — | `stmt079`×2 |
| `legendDirectionToggle` | const | 46795 | вызов document.getElementById() | — | `stmt080`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 24278 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 24284 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 24293 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 24299 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 24324 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 24360 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 24366 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 24455 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 24543 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 33679 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 33688 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 34247 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 36581 | 6 | `window.addEventListener('load')` | `saveOriginalRadii`, `initLinkState` |
| stmt014 | обработчик | 37275 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 37497 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 38915 | 46 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `requestDraw`, `pickNode`, `gfxZoom`, `dragMoveStarted`, `dragended` |
| stmt017 | вызов | 38962 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 39033 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 39037 | 15 | `if (layoutFromStore) { // ЭНЕРГИЯ ГАСИТСЯ ВМЕСТЕ С ОСТАНОВОМ. Симуляци…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 39080 | 14 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `requestDraw`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 39106 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 39108 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 39213 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 39395 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode`, `descriptionHtml` |
| stmt025 | обработчик | 39424 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges`, `descriptionHtml` |
| stmt026 | построение | 39655 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 39744 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 41422 | 5 | `window.addEventListener('beforeunload')` | `hasUnsaved` |
| stmt029 | вызов | 41728 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 41834 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 42401 | 18 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `commitItems`, `closeCommitsPanel`, `revertCommitFromPanel`, `showImpact`, `rebuildOverCurrent` |
| stmt032 | вызов | 42529 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 42530 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | вызов | 42531 | 1 | `subscribe()` | `subscribe`, `refreshObservationsNav` |
| stmt035 | обработчик | 42536 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt036 | вызов | 42569 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt037 | обработчик | 42797 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt038 | вызов | 43319 | 1 | `installFootnoteLinks()` | `installFootnoteLinks` |
| stmt039 | обработчик | 45261 | 7 | `document.addEventListener('click')` | — |
| stmt040 | вызов | 46593 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt041 | вызов | 46594 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt042 | вызов | 46599 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt043 | обработчик | 46633 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt044 | обработчик | 46641 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt045 | вызов | 46665 | 1 | `console.log()` | `nodes`, `links` |
| stmt046 | вызов | 46666 | 1 | `initFilters()` | `initFilters` |
| stmt047 | вызов | 46669 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt048 | вызов | 46674 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt049 | вызов | 46683 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt050 | вызов | 46688 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt051 | вызов | 46692 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt052 | вызов | 46695 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt053 | вызов | 46698 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt054 | вызов | 46723 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt055 | вызов | 46724 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt056 | вызов | 46725 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt057 | вызов | 46732 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt058 | вызов | 46736 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt059 | вызов | 46737 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt060 | вызов | 46738 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt061 | вызов | 46739 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt062 | вызов | 46746 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt063 | обработчик | 46748 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt064 | обработчик | 46752 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt065 | обработчик | 46756 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt066 | обработчик | 46760 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt067 | вызов | 46761 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt068 | вызов | 46762 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt069 | вызов | 46764 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt070 | вызов | 46765 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt071 | вызов | 46766 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt072 | вызов | 46767 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt073 | вызов | 46769 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt074 | вызов | 46773 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt075 | вызов | 46775 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt076 | вызов | 46778 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt077 | вызов | 46781 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt078 | обработчик | 46784 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt079 | условие | 46794 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt080 | условие | 46796 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt081 | вызов | 46799 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt082 | условие | 46804 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt083 | вызов | 46806 | 1 | `console.log()` | — |
| stmt084 | вызов | 46807 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt085 | обработчик | 46815 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt086 | обработчик | 46821 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt087 | условие | 46836 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt088 | вызов | 46840 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 26134 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 33679 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 33688 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 36581 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 36861 | `popstate` | `window` | addEventListener | функция на месте | `initLinkState` |
| 37275 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 37393 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 37497 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 38906 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 38915 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38915 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 38915 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 39080 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 39106 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 39108 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 39200 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 39201 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 39202 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 39203 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 39210 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 39395 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39395 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 39424 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39424 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39424 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 39744 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 40454 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 40535 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 41422 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 41834 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 42401 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 42536 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt035` |
| 42759 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42769 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42774 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 42797 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt037` |
| 43307 | `mouseover` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 43308 | `mouseout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 43309 | `focusin` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 43313 | `focusout` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 43314 | `click` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 43315 | `input` | `document` | addEventListener | функция на месте | `installFootnoteLinks` |
| 44927 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 44928 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 45261 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt039` |
| 45399 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 46524 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46554 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46569 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 46633 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt043` |
| 46641 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt044` |
| 46748 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt063` |
| 46752 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt064` |
| 46756 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt065` |
| 46760 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt066` |
| 46784 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt078` |
| 46815 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt085` |
| 46821 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt086` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27740 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27753 | `installMetricScopeWrappers` | `window[name]` | запись |
| 36388 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 40324 | `modalContentFor` | `window[name]` | чтение |
| 40330 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| 5145 | `onclick` | (страница) | `closeUniversalModal()` |
| 5154 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 5159 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 5165 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 5177 | `onclick` | (страница) | `toggleLegendSearch()` |
| 5182 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 5184 | `onclick` | (страница) | `setSearchKind('concept')` |
| 5186 | `onclick` | (страница) | `setSearchKind('connection')` |
| 5195 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 5196 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 5197 | `onclick` | (страница) | `clearLegendSearch()` |
| 5207 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5208 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 5209 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 5220 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 5221 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 5230 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 5231 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5242 | `onclick` | (страница) | `openStatsModal()` |
| 5254 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5266 | `onclick` | (страница) | `resetNodeSizes()` |
| 5273 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5278 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5279 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5290 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5321 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5329 | `onclick` | (страница) | `toggleSection('relations')` |
| 5334 | `onclick` | (страница) | `selectAllRelations()` |
| 5335 | `onclick` | (страница) | `deselectAllRelations()` |
| 5356 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5361 | `onclick` | (страница) | `selectAllRubrics()` |
| 5362 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5369 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5374 | `onclick` | (страница) | `selectAllTraditions()` |
| 5375 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5409 | `onclick` | (страница) | `openSelectionListModal()` |
| 5420 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5433 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5434 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5447 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5448 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5453 | `onclick` | (страница) | `findAndShowPath()` |
| 5496 | `onclick` | (страница) | `resetSimulation()` |
| 5497 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5498 | `onclick` | (страница) | `centerGraph()` |
| 5499 | `onclick` | (страница) | `toggleGrouping()` |
| 5500 | `onclick` | (страница) | `downloadData()` |
| 5501 | `onclick` | (страница) | `saveToFolder()` |
| 5503 | `onclick` | (страница) | `exportToPNG()` |
| 5504 | `onclick` | (страница) | `exportToSVG()` |
| 5507 | `onclick` | (страница) | `openAboutModal()` |
| 5510 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5512 | `onclick` | (страница) | `closeAboutModal()` |
| 5522 | `onclick` | (страница) | `closeUsersPanel()` |
| 5531 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5532 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5533 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5538 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5546 | `onclick` | (страница) | `openCommitsPanel()` |
| 5547 | `onclick` | (страница) | `openUsersPanel()` |
| 5548 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5552 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5565 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5566 | `onclick` | (страница) | `closeConflictModal()` |
| 5600 | `onclick` | (страница) | `closeSelectionListModal()` |
| 5619 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5625 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5631 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5637 | `onclick` | (страница) | `closeStatsModal()` |
| 5651 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5655 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5659 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5663 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5667 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5671 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5675 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5679 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5683 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5695 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5699 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5703 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5715 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5719 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5731 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5735 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5747 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5751 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5763 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5775 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5779 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5791 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5795 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5799 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5803 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5807 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5811 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5815 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5827 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5839 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5843 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5847 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5851 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5865 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5869 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5873 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5877 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5889 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5893 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 5907 | `onclick` | (страница) | `switchStatsView('observations')` |
| 25053 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25087 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 25134 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 25138 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 25139 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 25240 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 25243 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 25414 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 25433 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 25436 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 25473 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25607 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25730 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25783 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 27057 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 27073 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 27097 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 27102 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 27104 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 27120 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29684 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29692 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 33063 | `onclick` | `selectionRowPhilosopher` | `openUniversalModal('philosopher', '${escapeAttr(p.nameRu)}', 'view')` |
| 33065 | `onclick` | `selectionRowPhilosopher` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 33086 | `onclick` | `selectionRowConcept` | `openUniversalModal('concept', nodes.find(x => x.id === '${escapeAttr(n.id)}'), 'view')` |
| 33087 | `onclick` | `selectionRowConcept` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 33138 | `onclick` | `selectionRowRelation` | `openSelectionLink('${escapeAttr(s)}', '${escapeAttr(t)}')` |
| 33140 | `onclick` | `selectionRowRelation` | `toggleSelectionBody('${escapeAttr(bodyKey)}')` |
| 33169 | `onclick` | `renderSelectionList` | `setSelectionProvenance('${v}')` |
| 33209 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 33214 | `onclick` | `renderSelectionList` | `toggleSelectionBodies('${kind}')` |
| 33217 | `onclick` | `renderSelectionList` | `toggleSelectionBlock('${kind}')` |
| 33223 | `onclick` | `renderSelectionList` | `selectionListMore('${kind}')` |
| 33386 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 33516 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 33523 | `onclick` | `renderObservations` | `deleteObservation('${escapeAttr(z.observationId)}')` |
| 33759 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 34086 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 34314 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34346 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 34351 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 34358 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 34408 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 34416 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 34423 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 34560 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 35164 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 35169 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 35258 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 35286 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 35317 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 35318 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 35319 | `onclick` | `generateClosestPairsContent` | `_pairsKind='types'; renderClosestPairs();` |
| 35320 | `onclick` | `generateClosestPairsContent` | `_pairsKind='network'; renderClosestPairs();` |
| 35325 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 35330 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 35334 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 35339 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 35435 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 35487 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 35488 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 35594 | `onclick` | `renderComparison` | `computeComparisonNetwork()` |
| 35899 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 36088 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 36129 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 37213 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 37325 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 37438 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 38030 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 38045 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 38061 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 39796 | `onclick` | `similarItemHtml` | `openConceptById('${x.id}')` |
| 39828 | `onclick` | `forceButtonHtml` | `forceSimilarColumn('${kind}','${conceptId}')` |
| 39877 | `onclick` | `similarNetworkColumnHtml` | `computeSimilarNetworkColumn('${conceptId}')` |
| 39932 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 40083 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 40103 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 40112 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 40119 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 40216 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 40444 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 40445 | `onclick` | `openAuthModal` | `submitAuth()` |
| 40500 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 40502 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 40530 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 40560 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 40563 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 40615 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 40815 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 40816 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 40819 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 40820 | `onclick` | `renderAuthControls` | `authLogout()` |
| 40894 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 40904 | `onclick` | `openUniversalModal` | `popModalState()` |
| 42149 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(item.id))}')` |
| 42172 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 42173 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 42180 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 42187 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 42200 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 42201 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 42989 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 43082 | `onclick` | `historyBlock` | `toggleEntityHistory('${escapeAttr(kind)}', '${escapeAttr(entityId)}')` |
| 43141 | `onclick` | `renderEntityHistory` | `revertEntityToVersion('${escapeAttr(kind)}', '${escapeAttr(entityId)}', ${Number(commit.версия)})` |
| 44177 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 44247 | `onchange` | `footnoteRow` | `refreshFootnoteRows()` |
| 44251 | `onclick` | `footnoteRow` | `removeFootnote('${note.id}')` |
| 44267 | `onclick` | `footnotesField` | `insertFootnote()` |
| 44386 | `onclick` | `modalActions` | `${saveFn}()` |
| 44389 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 44393 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 44441 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 44449 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 44453 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 44521 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 44524 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 44527 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 44532 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 44644 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 44647 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 44650 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 44673 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 44791 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 44831 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 44895 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 45003 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 45007 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 45201 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 45224 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 45225 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 45326 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 45429 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 45430 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 45431 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 45438 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 45446 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 45449 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 45500 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 45510 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 45537 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 45542 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 45565 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 45589 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 45594 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 45642 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45650 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 45797 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 45879 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 45911 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 45960 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45961 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 45962 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 45975 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 46131 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 46147 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 46163 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 46217 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 46225 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 46228 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 46283 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 46295 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 46321 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 46325 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 46330 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 46353 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 46387 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${leftNode.id}'), 'view');` |
| 46392 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${rightNode.id}'), 'view');` |
| 46398 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28914 | 34 | — |
| `TENSION_WEIGHTS` | const | 30026 | 5 | — |
| `tensionScales` | function | 30035 | 23 | — |
| `searchNodes` | function | 37193 | 3 | — |
| `toggleSimilarityKind` | function | 37928 | 5 | — |
| `graphSelectionContext` | window-объявление | 42962 | 1 | — |
| `generatePhilosopherEditContent` | function | 44428 | 118 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 44551 | 133 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 44769 | 98 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 45172 | 85 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 45412 | 259 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 45937 | 488 | вероятно цель `window[…]` в `modalContentFor` |


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
| `document` | 395 |
| `Math` | 182 |
| `Set` | 125 |
| `Object` | 83 |
| `String` | 60 |
| `Map` | 58 |
| `undefined` | 57 |
| `console` | 48 |
| `setTimeout` | 47 |
| `window` | 47 |
| `Array` | 46 |
| `alert` | 28 |
| `d3` | 28 |
| `Boolean` | 20 |
| `Promise` | 20 |
| `encodeURIComponent` | 16 |
| `Number` | 15 |
| `Infinity` | 12 |
| `Date` | 12 |
| `clearTimeout` | 9 |
| `location` | 8 |
| `JSON` | 8 |
| `confirm` | 7 |
| `URL` | 6 |
| `prompt` | 6 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `RegExp` | 5 |
| `event` | 4 |
| `Float32Array` | 4 |
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
