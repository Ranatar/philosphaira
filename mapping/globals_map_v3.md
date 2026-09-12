# Карта глобальных сущностей `philosophy_graph.html`

Файл: 3 026 816 знаков, 43 969 строк; встроенный скрипт — строки 5636–43967. Составлено 2026-09-11 20:40:38 UTC.

Всего глобальных сущностей: **978** — функций 612
(из них асинхронных 39), `const` 111, `let` 148,
`var` 15, операторов верхнего уровня 86.
Обработчиков событий 51; вызовов из разметки:
статической 108, порождаемой 146.

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
| `nodes` | const | 23778 | 130 | 80 |
| `ModalContext` | const | 38107 | 69 | 25 |
| `escapeAttr` | function | 40668 | 69 | 18 |
| `links` | const | 23796 | 67 | 48 |
| `renderState` | const | 35884 | 62 | 33 |
| `concepts` | const | 6601 | 59 | 51 |
| `conceptById` | const | 23846 | 58 | 39 |
| `similarityOverlay` | var | 35905 | 58 | 14 |
| `_conceptMap` | let | 28382 | 53 | 23 |
| `relations` | const | 12525 | 52 | 46 |
| `selectedPhilosophers` | let | 23973 | 49 | 16 |
| `philosopherConcepts` | const | 23732 | 47 | 26 |
| `useWeightedPaths` | let | 23892 | 46 | 17 |
| `relationTypesObj` | const | 23747 | 44 | 29 |
| `respectDirection` | let | 23893 | 43 | 19 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `graphFingerprint` | function | 23634 | 15 | () | `concepts`, `relations` | `applyStoredLayout` | — | — |
| `applyStoredLayout` | function | 23653 | 29 | () | `nodes`×4, `storedLayoutComplaint`×2, `nodePositions`, `graphFingerprint` | `layoutFromStore` | — | — |
| `applyServerLayout` | function | 23688 | 32 | (позиции) | `nodes`×3, `simulation`×2, `emit`, `layoutSettled` | `pullGraphSince`, `applyFreshGraph` | — | — |
| `isSymmetricLink` | function | 23764 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `linksBothWays`, `tensionIndex`, `exportToSVG`, `stmt025` | — | — |
| `rebuildIndexes` | function | 23853 | 37 | () | `linksByConcept`×6, `nodes`×3, `nodesByPhilosopher`×3, `conceptById`×2, `philosopherByName`×2, `traditionById`×2, `rubricById`×2, `traditions`, `philosophers`, `rubrics`, `links` | `stmt008`, `afterDataChange` | — | — |
| `isTypologicalLink` | function | 23911 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed`, `traditionBridgingIndex` | — | — |
| `pathLinkAllowed` | function | 23915 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `nodeAge` | function | 23948 | 6 | (id) | `philosopherByName`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `stepWithoutGap` | — | — |
| `DATA_nodes_find` | function | 23955 | 1 | (id) | `conceptById` | `stepWithoutGap`×2, `nodeAge` | — | — |
| `stepWithoutGap` | function | 23957 | 8 | (fromId, toId, step, last) | `DATA_nodes_find`×2, `nodeAge` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 23979 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 23989 | 23 | () | `nodes` | `stmt074` | — | — |
| `strictChronologyCheck` | function | 24023 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 24080 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 24091 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 24103 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `conceptById`×2, `philosopherByName`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 24165 | 40 | (path, mode=…) | `conceptById`×2, `philosopherByName`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 24214 | 5 | (name) | `traditionById`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 24220 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditionById` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 24243 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 24255 | 102 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 24359 | 69 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodeAge`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `stepWithoutGap`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 24430 | 268 | () | `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `philosopherByName`×2, `conceptById`, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | — | статич.×1 | — |
| `handlePathArrowHover` | function | 24703 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 24747 | 37 | (path, respectDirectionFlag=…, mode=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 24786 | 18 | (path, respectDirection=…, mode=…) | `currentChronologyMode`, `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 24806 | 6 | () | `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 24817 | 128 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `philosopherByName`, `currentChronologyMode`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 24947 | 15 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 24966 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 24993 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 25008 | 16 | (kind) | `searchKind`, `clearLegendPhilSearch`, `clearLinkSearch`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 25026 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 25051 | 4 | (name) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 25056 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `markChosenInLegend` | function | 25074 | 6 | () | `chosenPhilosophers` | `stmt058` | — | — |
| `highlightPhilosopherOnGraph` | function | 25081 | 56 | (name, add) | `chosenPhilosophers`×8, `emit`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 25141 | 26 | (end, query) | `linkSearch`×4, `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList` | `openLegendLinkSearch` | статич.×2 | — |
| `openLegendLinkSearch` | function | 25171 | 7 | (end) | `handleLegendLinkSearch`, `scrollToPickedRow` | — | статич.×2 | — |
| `pickLinkEnd` | function | 25179 | 10 | (end, id) | `conceptById`, `linkSearch`, `showFoundLinks` | — | динам.×1 | — |
| `showFoundLinks` | function | 25190 | 28 | () | `relationTypesObj`, `links`, `linkSearch`, `emptyList` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 25219 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `clearLinkSearch` | function | 25243 | 12 | () | `linkSearch`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `updateFilterNote` | function | 25266 | 7 | () | `pinnedDespiteFilter`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 25278 | 6 | () | `pinnedDespiteFilter`×2, `updateFilterNote`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt059` | статич.×1 | — |
| `buildAboutText` | function | 25290 | 82 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 25373 | 5 | () | `buildAboutText` | — | статич.×1 | — |
| `closeAboutModal` | function | 25379 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 25385 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `showHint` | function | 25394 | 20 | (el, text) | `hintBox`×9 | `stmt061` | — | — |
| `hideHint` | function | 25415 | 3 | () | `hintBox`×2 | `stmt062`, `stmt063`, `stmt064` | — | — |
| `subscribe` | function | 25450 | 17 | (event, handler, фаза) | `busSubscribers`×3, `BUS_EVENTS`, `BUS_PHASES` | `stmt029`, `stmt032`, `stmt033`, `stmt035`, `stmt045`, `stmt046`, `stmt047`, `stmt048`, `stmt049`, `stmt050`, `stmt051`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058`, `stmt059`, `stmt065`, `stmt066`, `stmt067`, `stmt068`, `stmt069`, `stmt070`, `stmt071` | — | — |
| `emit` | function | 25490 | 17 | (event, ...args) | `BUS_PHASES`×2, `BUS_EVENTS`, `busSubscribers` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `handleLinkClick`×2, `dispatchClick`×2, `applyServerLayout`, `refreshMetricsIfScoped`, `applyFiltersImmediate`, `setInfluenceScope`, `handleMetricsScopeChange`, `stmt010`, `toggleMetricValueMode`, `openPhilosopherPair`, `openPairInComparison`, `toggleMetricVisualization`, `selectCustomOption`, `showSimilarityOverlay`, `highlightCombined`, `submitAuth`, `addNodeToGraph`, `addLinkToGraph`, `sendCommit`, `reviewCommitFromPanel`, `pullGraphSince`, `connectLive`, `afterDataChange`, `handleConceptSelection`, `stmt040` | — | — |
| `debounce` | function | 25508 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 25586 | 29 | (message, duration=…) | — | `handleUniqueChainsMode`×5, `handleChainsMode`×4, `showSimilarityOverlay`×4, `exportToPNG`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze`, `doLayoutRevert`, `applyRelayout`, `stmt080` | — | — |
| `buildAdjacencyGraph` | function | 25622 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 25704 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 25840 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 25850 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 25899 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `sharesTradition` | function | 25974 | 5 | (nameA, nameB) | `philosopherTraditions`×2 | `FilterModes`×2 | — | — |
| `isNodeVisible` | function | 26164 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `displaySearchResults`, `selectSearchResult`, `rebuildQuadtree` | — | — |
| `isLinkVisible` | function | 26165 | 1 | (l) | `visibleLinkSet`×2 | `renderScene`×3, `applyBasicFilter`, `applyChainVisibility`, `exportToSVG`, `needsContinuousAnimation`, `paintLinkLayer`, `repaintPickCanvas` | — | — |
| `applyBasicFilter` | function | 26167 | 53 | (mode) | `links`×3, `pinnedDespiteFilter`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 26224 | 8 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `refreshHitMaps`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `refreshHitMaps` | function | 26253 | 4 | () | `pickDirty`, `rebuildQuadtree` | `applyBasicFilter`, `applyChainVisibility` | — | — |
| `handleChainsMode` | async function | 26261 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `emit`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 26324 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `emit`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 26393 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 26411 | 7 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 26419 | 21 | () | `filterMode`×3, `emit`, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `selectSearchResult`, `stmt053` | — | — |
| `applyFilters` | function | 26443 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 26477 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 26490 | 89 | () | `traditions`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint`, `WITHOUT_TRADITION` | `stmt044`, `stmt051` | — | — |
| `togglePhilosopher` | function | 26581 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 26610 | 8 | (traditionId) | `selectedPhilosophers`×3, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `resetTradition` | function | 26634 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `selectAllTraditions` | function | 26643 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 26649 | 5 | () | `traditions`, `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | статич.×1 | — |
| `traditionMembers` | function | 26658 | 7 | (traditionId) | `philosophers`×2, `WITHOUT_TRADITION` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `onlyTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 26666 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `toggleTradition`, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition` | — | — |
| `syncTraditionRows` | function | 26690 | 28 | () | `selectedPhilosophers`×2, `WITHOUT_TRADITION`×2, `traditions`, `traditionMembers` | `stmt046` | — | — |
| `onlyTradition` | function | 26719 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 26726 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 26736 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 26745 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 26754 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 26763 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 26772 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 26782 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 26791 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 26803 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 26847 | 4 | (mode) | `filterMode`, `applyFilters` | — | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 26853 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updateFilterStats` | function | 26863 | 12 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2, `updateProvenanceCoverage` | `stmt045`, `stmt048`, `stmt072` | — | — |
| `updateProvenanceCoverage` | function | 26890 | 40 | () | `concepts`×2, `relations`×2 | `updateFilterStats` | — | — |
| `metricsLinks` | function | 26947 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 26948 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache`, `saveObservation` | — | — |
| `transformForScope` | function | 26956 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 26969 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope`, `observationBar`, `saveObservation` | — | — |
| `applyMetricsScope` | function | 26987 | 30 | (viewName) | `metricsScopeActive`×3, `lastScopeKey`×2, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 27146 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 27163 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 27184 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 27218 | 117 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 27344 | 166 | (progressCallback) | `nodes`×5, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `conceptById`, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 27512 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 27524 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 27537 | 133 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×9, `useWeightedPaths`×3, `respectDirection`×3, `pageRankCache`×3, `pageRankCalculating`×3, `conceptById`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 27671 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 27685 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 27731 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 27800 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 27812 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 27859 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 27881 | 106 | () | `weightedClusteringCache`×3, `WEIGHTED_CLUSTERING_MIN_DEGREE`×2, `nodes`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 27988 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 27996 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 28026 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 28047 | 70 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 28118 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 28126 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 28185 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 28246 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 28252 | 77 | (iterations=…, progressCallback=…) | `nodes`×3, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `conceptById`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `runSingleMetric` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 28330 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 28339 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 28393 | 5 | (r) | — | `buildIncomingLinks`, `buildOutgoingLinks`, `drawLinkSet`, `repaintPickCanvas`, `stmt025`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `buildReflexiveMap` | function | 28404 | 9 | () | `_relations` | `reflexiveLinkOf`, `initializeMetricsData` | — | — |
| `reflexiveLinkOf` | function | 28414 | 4 | (conceptId) | `_reflexiveMap`×3, `buildReflexiveMap` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 28419 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 28434 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 28453 | 10 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `_reflexiveMap`, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 28472 | 109 | (conceptId) | `_incomingLinks`, `_outgoingLinks`, `sumWeight`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 28582 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 28590 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 28765 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 28773 | 125 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 28899 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 28906 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 28955 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 28962 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 29066 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 29078 | 10 | (scope) | `influenceScope`×2, `emit`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×2 | — |
| `influenceScopeSwitcher` | function | 29089 | 38 | () | `influenceScope`×7, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 29150 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×3, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `problemGenerationIndex`, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `linksBothWays` | function | 29172 | 5 | (conceptId) | `isSymmetricLink`, `_incomingLinks`, `_outgoingLinks` | `problemGenerationIndex`, `revolutionaryIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex` | — | — |
| `otherPhilosopher` | function | 29179 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 29184 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 29227 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 29234 | 67 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 29302 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 29314 | 58 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks`, `linksBothWays`, `otherPhilosopher`, `MUTUAL_DIALOGUE_BONUS` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 29373 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 29380 | 50 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks`, `linksBothWays` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 29431 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 29460 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 29484 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 29489 | 227 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf`, `linksBothWays` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 4× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 29717 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 29724 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 29767 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 29774 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 29830 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 29837 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 29897 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 29904 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 29953 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 29960 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 30018 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 30025 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 30057 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 30067 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 30157 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 30168 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 30200 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 30207 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 30257 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 30264 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 30312 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 30323 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 30387 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 30413 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful` | — | — |
| `nodeDegreeOf` | function | 30425 | 7 | (conceptId) | `_relations` | `similarConceptsBlock`×2, `profileIsMeaningful` | — | — |
| `profileIsMeaningful` | function | 30433 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `nearestConcepts`×2, `showSimilarityOverlay`×2, `similarConceptsBlock` | — | — |
| `similarityData` | function | 30438 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 30487 | 6 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 30502 | 3 | () | `_pairCache` | `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 30511 | 55 | (progressCallback) | `_pairCache`×4, `_pairCalculating`×3, `similarityData`, `PAIRS_CHUNK_ROWS`, `neighborSets` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 30567 | 9 | (idA, idB) | `similarityData` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 30580 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 30593 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `structuralSimilarity`×2 | — | — |
| `structuralSimilarity` | function | 30601 | 22 | (idA, idB) | `typeProfileOf`×2, `neighborSets` | `showSimilarityOverlay`×2, `nearestConcepts`, `renderComparison` | — | — |
| `nearestConcepts` | function | 30624 | 51 | (conceptId, kind, k) | `profileIsMeaningful`×2, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `similarConceptsBlock`×2 | — | — |
| `rubricUnionSize` | function | 30703 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 30710 | 90 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 30801 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 30803 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 30809 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 30830 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 30872 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 30888 | 10 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 30907 | 48 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 30956 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 30960 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 30966 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 31006 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 31058 | 72 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `isTypologicalLink`, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 31131 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 31135 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 31146 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 31170 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 31187 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 2× (ключ объекта) в `FORMULA_VERSIONS`, `METRIC_FLAGS` |
| `deductiveIndex` | function | 31200 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 6× (ключ объекта, строка) в `FORMULA_VERSIONS`, `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 31229 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 31234 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 31272 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 31283 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 31292 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt047` | — | — |
| `handleMetricsScopeChange` | function | 31307 | 8 | () | `emit`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | — | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 31320 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt047`, `stmt073` | — | — |
| `getMetricDescription` | function | 31855 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 31876 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2 | статич.×1, динам.×1 | — |
| `closeStatsModal` | function | 31916 | 30 | () | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `lastScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt011`, `stmt065` | статич.×1 | — |
| `handleStatsParameterChange` | function | 31948 | 31 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | — | статич.×2 | — |
| `switchStatsView` | function | 31981 | 15 | (viewName, event) | `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `stmt057` | статич.×40, динам.×1 | — |
| `updateActiveNavItem` | function | 31998 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `observationBar` | function | 32022 | 17 | (viewName) | `escapeAttr`×2, `metricsScopeActive`, `effectiveScopeFlags`, `VIEW_METRIC`, `serverMode` | `loadStatsContent` | — | — |
| `observationValues` | function | 32045 | 27 | (viewName) | — | `saveObservation` | — | — |
| `saveObservation` | async function | 32073 | 25 | (viewName) | `metricsScopeActive`×2, `FORMULA_VERSIONS`×2, `metricsNodes`, `effectiveScopeFlags`, `VIEW_METRIC`, `observationValues`, `api` | — | динам.×1 | — |
| `generateObservationsContent` | function | 32110 | 6 | () | `loadObservations` | `loadStatsContent` | — | — |
| `loadObservations` | async function | 32117 | 23 | () | `observationItems`, `renderObservations`, `serverMode`, `api` | `generateObservationsContent` | — | — |
| `renderObservations` | function | 32141 | 35 | () | `escapeAttr`×6, `observationPicked`×4, `observationItems`×2, `compareObservationsInPanel` | `loadObservations`, `pickObservation` | — | — |
| `pickObservation` | function | 32177 | 7 | (id) | `observationPicked`×6, `renderObservations` | — | динам.×1 | — |
| `compareObservationsInPanel` | async function | 32190 | 27 | () | `escapeAttr`×6, `observationPicked`, `api` | `renderObservations` | — | — |
| `loadStatsContent` | function | 32218 | 69 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `observationBar`, `generateObservationsContent`, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt054`, `stmt071` | — | — |
| `calculateMetricFromModal` | async function | 32305 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `linkArrow` | function | 32358 | 18 | (glyph, color, weight, label, more, from, to) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 32380 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `sortPhilosophersByBirth`×2, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 32386 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `sortPhilosophersByBirth` | function | 32389 | 3 | (list) | `philosopherBirth`×2 | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `philosopherYears` | function | 32392 | 4 | (nameRu) | `philosopherByName` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 32411 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 32437 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 32445 | 4 | (node) | `ambiguousLabels` | `stmt024` | — | — |
| `conceptDegreeForNorm` | function | 32458 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 32466 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 32470 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 32475 | 5 | () | `metricValueMode`×2, `emit`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 32505 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 32521 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 32523 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 32536 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 32577 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 32613 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 32689 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 32755 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 32769 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 32775 | 164 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 32943 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 32973 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 33010 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 33075 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 33091 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 33107 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 33123 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 33139 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 33155 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 33171 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 33191 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 33215 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 33239 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 33263 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 33287 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 33311 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 33335 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 33359 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 33383 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 33408 | 195 | () | `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 33647 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 33680 | 63 | () | `philosopherProfile`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 33747 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 33769 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 33803 | 4 | (a, b) | `emit`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 33808 | 40 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function | 33849 | 96 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsMinShared`×2, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `_pairsKind`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×6 | — |
| `openPairInComparison` | function | 33946 | 4 | (a, b) | `emit`, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 33951 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `conceptById`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderComparison` | function | 34000 | 62 | () | `_cmpA`×4, `_cmpB`×4, `conceptById`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `loadStatsContent`×2, `stmt056` | — | — |
| `generateGenerativeContent` | function | 34063 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 34083 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 34103 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 34132 | 26 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 34159 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 34179 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 34203 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 34227 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 34251 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 34275 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 34333 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 34376 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 34415 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 34453 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 34498 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 34576 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 34639 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 34681 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt013`, `stmt079` | — | — |
| `toggleMetricVisualization` | function | 34694 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `emit`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 34828 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 34846 | 110 | (metricData, metricName) | `gfxNode`×2, `nodes`, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 34958 | 39 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `showProgress` | function | 35010 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 35023 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 35029 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 35104 | 18 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 35124 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 35163 | 74 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `nodes`×2, `isNodeVisible`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 35242 | 12 | (query) | `pickConcepts`, `displaySearchResults` | — | статич.×2 | — |
| `pickConcepts` | function | 35267 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `rowInner` | function | 35296 | 11 | (n, tail) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `emptyList` | function | 35308 | 3 | (text) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `showFoundLinks`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 35312 | 3 | (query) | `pickConcepts` | — | — | — |
| `displaySearchResults` | function | 35316 | 23 | (results, container, context) | `isNodeVisible`, `rowInner`, `emptyList` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 35340 | 35 | (nodeId, context) | `selectedNodes`×2, `conceptById`, `pinnedDespiteFilter`, `updateFilterNote`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 35376 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `pickPhilosophers` | function | 35418 | 11 | (query) | `philosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 35430 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `emptyList`, `pickPhilosophers` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 35457 | 4 | (name) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 35462 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 35471 | 9 | (query) | `pickConcepts`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 35481 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 35505 | 16 | () | `populateCustomSelect`×2 | `stmt015` | — | — |
| `pickedConceptOf` | function | 35530 | 7 | (type) | `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | `populateCustomSelect` | — | — |
| `scrollToPickedRow` | function | 35540 | 6 | (box) | — | `openLegendLinkSearch`, `showCustomSelectDropdown` | — | — |
| `populateCustomSelect` | function | 35547 | 16 | (type, query=…) | `pickConcepts`, `rowInner`, `emptyList`, `pickedConceptOf` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 35564 | 14 | (type) | `scrollToPickedRow`, `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 35579 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 35591 | 24 | (type, nodeId) | `conceptById`, `emit`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | — | динам.×1 | — |
| `handleNodeClick` | function | 35650 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `emit`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `PERM`, `can`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 35772 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `emit`×2, `handleLinkSelect`×2, `PERM`, `can` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 35801 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 35871 | 11 | () | `gfxCanvas`×6, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `pickCanvas`×2, `pickDirty`, `requestDraw` | `stmt017`, `stmt027` | — | — |
| `similarityColor` | function | 35915 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function | 35925 | 95 | (sourceId, kind) | `showTemporaryMessage`×4, `similarityOverlay`×3, `profileIsMeaningful`×2, `structuralSimilarity`×2, `concepts`, `relations`, `nodes`, `emit`, `_simCache`, `profileSimilarity`, `initializePhilosophyMetrics`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `toggleSimilarityKind` | динам.×2 | — |
| `toggleSimilarityKind` | function | 36021 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `setSimilarityLinks` | function | 36050 | 6 | (mode) | `similarityOverlay`×2, `updateSimilarityLegend`, `requestDraw` | — | динам.×1 | — |
| `nodeLitBySimilarity` | function | 36061 | 9 | (id) | `similarityOverlay`×5 | `similarityLinkCount`×4, `linkAmongHighlighted`×4 | — | — |
| `similarityLinkCount` | function | 36072 | 13 | (mode) | `nodeLitBySimilarity`×4, `similarityOverlay`×3, `links` | `updateSimilarityLegend`×2 | — | — |
| `linkAmongHighlighted` | function | 36087 | 12 | (l) | `similarityOverlay`×4, `nodeLitBySimilarity`×4 | `linkDrawAlpha` | — | — |
| `clearSimilarityOverlay` | function | 36100 | 5 | () | `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt049` | динам.×1 | — |
| `updateSimilarityLegend` | function | 36106 | 46 | () | `similarityOverlay`×11, `similarityLinkCount`×2, `conceptById`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 36156 | 1 | (d) | `renderState` | `exportToSVG`, `drawSelfLoop`, `renderScene`, `startRadiusAnimation`, `pickNode` | — | — |
| `nodeLabelDy` | function | 36157 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 36158 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×6 | — | — |
| `hasLinkClass` | function | 36159 | 1 | (name, l) | `renderState` | `linkVisualState`×4, `linkOutOfLayer` | — | — |
| `setPainter` | function | 36167 | 1 | (handler) | `painter` | `stmt060` | — | — |
| `requestDraw` | function | 36169 | 9 | () | `drawScheduled`×3, `painter`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt025`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `setSimilarityLinks`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt016`, `stmt019`, `stmt020`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 36189 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 36200 | 9 | () | `renderState`×2, `links`, `isLinkVisible`, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 36209 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 36220 | 4 | (d) | `renderState` | `arrowPoints`, `arrowPointsStart`, `linkDrawWidth` | — | — |
| `linkHoverStrokeWidth` | function | 36224 | 4 | (d) | `renderState` | `linkDrawWidth`, `drawLinkSet` | — | — |
| `arcParams` | function | 36230 | 15 | (s, t) | — | `arrowPoints`, `arrowPointsStart`, `strokeLink`, `renderScene` | — | — |
| `arrowPoints` | function | 36247 | 26 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `arrowPointsStart` | function | 36277 | 28 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `linkHasTwoHeads` | function | 36308 | 5 | (l) | `relationTypesObj` | `exportToSVG`, `fillArrow` | — | — |
| `linkVisualState` | function | 36316 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawWidth` | function | 36324 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkDrawAlpha` | function | 36333 | 21 | (l, state, tms) | `renderState`, `similarityOverlay`, `linkAmongHighlighted` | `drawLinkSet`×2, `exportToSVG` | — | — |
| `strokeLink` | function | 36355 | 8 | (c, l, width) | `arcParams` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `drawSelfLoop` | function | 36367 | 27 | (c, l, sw, col, alpha) | `nodeRadius` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `fillArrow` | function | 36395 | 13 | (c, l, sw) | `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads` | `drawLinkSet`, `repaintPickCanvas` | — | — |
| `linkOutOfLayer` | function | 36441 | 5 | (l) | `hasLinkClass` | `linkDrawnLive`, `paintLinkLayer` | — | — |
| `linkDrawnLive` | function | 36446 | 5 | (l) | `renderState`, `linkOutOfLayer`, `selectedEdges` | `renderScene` | — | — |
| `linksLayerKey` | function | 36461 | 19 | (c) | `renderState`×5, `nodes`×2, `links`, `visibleLinkSet`, `similarityOverlay`, `selectedEdges` | `renderScene` | — | — |
| `sameLayerKey` | function | 36480 | 5 | (a, b) | — | `renderScene`×3 | — | — |
| `paintLinkLayer` | function | 36486 | 21 | (c, key) | `linkLayer`×7, `dpr`×4, `isLinkVisible`, `renderState`, `linkOutOfLayer`, `drawLinkSet` | `renderScene` | — | — |
| `drawLinkSet` | function | 36510 | 36 | (c, tms, take) | `relationTypesObj`×4, `linkDrawAlpha`×2, `links`, `isReflexiveLink`, `renderState`, `linkHoverStrokeWidth`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow`, `DRAW_ORDER` | `renderScene`×3, `paintLinkLayer` | — | — |
| `renderScene` | function | 36554 | 138 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×6, `linkLayer`×4, `isNodeVisible`×3, `isLinkVisible`×3, `sameLayerKey`×3, `drawLinkSet`×3, `nodes`×2, `conceptById`×2, `renderState`×2, `lastLayerKey`×2, `selectedNodes`×2, `philosopherConcepts`, `ctx`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `arcParams`, `linkDrawnLive`, `linksLayerKey`, `paintLinkLayer`, `LABEL_SHADOW_PASSES` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 36693 | 10 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `pickDirty`, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt060` | — | — |
| `startRadiusAnimation` | function | 36705 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 36711 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `rebuildQuadtree` | function | 36727 | 5 | () | `nodes`, `isNodeVisible`, `quadtree` | `refreshHitMaps`, `pickNode`, `stmt016`, `stmt020`, `updateGraphData` | — | — |
| `toGraph` | function | 36733 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `dispatchMove` | — | — |
| `pickNode` | function | 36738 | 9 | (gx, gy) | `quadtree`×2, `renderState`, `nodeRadius`, `rebuildQuadtree` | `dispatchClick`×2, `stmt016`, `dispatchMove` | — | — |
| `repaintPickCanvas` | function | 36748 | 30 | () | `pickCtx`×13, `dpr`×4, `links`×2, `pickCanvas`×2, `isLinkVisible`, `isReflexiveLink`, `pickDirty`, `PICK_LINK_WIDTH`, `renderState`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow` | `pickLink` | — | — |
| `pickLink` | function | 36779 | 12 | (clientX, clientY) | `links`×2, `pickCanvas`×2, `dpr`×2, `gfxCanvas`, `pickCtx`, `pickDirty`, `repaintPickCanvas` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 36797 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 36813 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 36864 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `pullStrengthOf` | const-функция | 36958 | 2 | (d) | `linksByConcept`, `LAYOUT_PULL` | `installLayoutPull`×2, `toggleGrouping`×2 | — | — |
| `installLayoutPull` | function | 36981 | 5 | () | `pullStrengthOf`×2, `viewWidth`, `viewHeight`, `simulation` | `stmt018` | — | — |
| `maxTicksFor` | const-функция | 37011 | 1 | (decay) | `simulation` | `maxTicks` | — | — |
| `resetLayoutClock` | function | 37023 | 4 | () | `tickCount`, `layoutSettled` | `dragstarted`, `resetSimulation`, `centerGraph`, `toggleGrouping`, `updateGraphData` | — | — |
| `dispatchMove` | function | 37083 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 37114 | 34 | (event) | `chosenPhilosophers`×2, `emit`×2, `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `PERM`, `can`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 37149 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt023` | — | — |
| `isEdgeConnectedToNode` | function | 37166 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 37173 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 37183 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 37193 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `emit`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 37293 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 37329 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragstarted` | function | 37500 | 8 | (event, d) | `simulation`, `resetLayoutClock` | `stmt016` | — | — |
| `dragended` | function | 37510 | 5 | (event, d) | `simulation` | `stmt016` | — | — |
| `resetSimulation` | function | 37516 | 9 | () | `nodes`, `simulation`, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 37529 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `layoutSettled`, `simulation`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 37541 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 37554 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `resetLayoutClock` | — | статич.×1 | — |
| `freezeSimulation` | function | 37567 | 4 | (source) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 37572 | 17 | (source) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `layoutSettled`, `simLockedByHand` | `closePathDescriptionsModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 37610 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 37632 | 14 | () | — | `stmt075` | — | — |
| `toggleGrouping` | function | 37647 | 39 | () | `simulation`×7, `isGrouped`×3, `pullStrengthOf`×2, `groupPositions`×2, `resetLayoutClock`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 37724 | 4 | (conceptId) | `conceptById`, `showDetailModal` | — | динам.×3 | — |
| `similarConceptsBlock` | function | 37729 | 79 | (conceptId) | `medianNodeDegree`×2, `nodeDegreeOf`×2, `nearestConcepts`×2, `conceptById`, `profileIsMeaningful` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 37837 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 37853 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 37872 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 37878 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 37895 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 37907 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `conceptById`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 37982 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 37991 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `concepts`, `relations`, `philosopherByName`, `rubricById`, `nodesByPhilosopher`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 38090 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 38121 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 38136 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt042` | динам.×1 | — |
| `modalEntityExists` | function | 38156 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 38174 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `setPermissions` | function | 38247 | 1 | (права) | `granted` | `setSessionUser` | — | — |
| `can` | function | 38249 | 1 | (право) | `granted` | `renderCommits`×4, `switchCommitTab`×2, `makeLegendsEditable`×2, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers` | — | — |
| `setSessionUser` | function | 38253 | 11 | (user, праваСнаружи) | `PERM`×2, `authSession`, `setPermissions` | `submitAuth`×3, `authLogout`, `detectServerMode` | — | — |
| `authModalEl` | function | 38267 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 38269 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `securityModalEl` | function | 38312 | 1 | () | — | `openSecurityModal` | — | — |
| `securityError` | function | 38314 | 4 | (text) | — | `confirmMfaEnroll`×3, `startMfaEnroll`×2 | — | 1× (строка) в `securityError` |
| `openSecurityModal` | async function | 38319 | 28 | () | `authModalKind`, `securitySecret`, `securityModalEl`, `api` | — | динам.×1 | — |
| `startMfaEnroll` | async function | 38348 | 31 | () | `securityError`×2, `escapeAttr`×2, `securitySecret`, `confirmMfaEnroll`, `api` | — | динам.×1 | — |
| `confirmMfaEnroll` | async function | 38380 | 30 | () | `securityError`×3, `securitySecret`, `renderAuthControls`, `refreshEditHints`, `api`, `escapeAttr` | `startMfaEnroll` | динам.×1 | — |
| `refreshSecurityDone` | function | 38411 | 5 | () | — | — | динам.×1 | — |
| `closeAuthModal` | function | 38417 | 10 | () | `authModalEl` | `submitAuth`×2 | динам.×4 | — |
| `authError` | function | 38428 | 4 | (text) | — | `submitAuth`×8 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 38435 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 38450 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 38457 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | async function | 38473 | 91 | () | `authError`×8, `renderAuthControls`×5, `refreshEditHints`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authModalKind`×3, `setSessionUser`×3, `refreshOpenModalToolbar`×3, `closeAuthModal`×2, `authNoticeMember`×2, `serverMode`×2, `api`×2, `detectServerMode`×2, `pullGraphSince`×2, `connectLive`×2, `emit`, `authNoticeAdmin` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 38565 | 24 | () | `ModalContext`×2, `setSessionUser`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 38592 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`×3, `authLogout` | — | — |
| `renderAuthControls` | function | 38604 | 19 | () | `authSession` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `stmt039`, `stmt040` | — | — |
| `philRowTip` | function | 38637 | 5 | () | `PERM`, `can` | `makeLegendsEditable` | — | — |
| `refreshEditHints` | function | 38643 | 15 | () | `PERM`, `can` | `submitAuth`×5, `confirmMfaEnroll`, `authLogout`, `makeLegendsEditable`, `stmt040` | — | — |
| `openUniversalModal` | function | 38659 | 64 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `PERM`, `can` | `saveConceptData`×2, `saveConnectionData`×2, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConcept`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt068` | динам.×24 | — |
| `closeUniversalModal` | function | 38725 | 27 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `rebuildOverCurrent`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 38754 | 17 | () | `ModalContext`×5, `PERM`, `can`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 38773 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 38794 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 38805 | 22 | (original) | `philosopherByName` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 38828 | 19 | (original) | `conceptToRubrics` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 38848 | 27 | (original) | `ModalContext`×2, `relationTypesObj` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 38877 | 3 | (prefix=…) | — | `saveConnectionData`×2, `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 38881 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 38891 | 8 | (conceptId) | `linksByConcept` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 38900 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 38907 | 15 | (philosopherName) | `nodesByPhilosopher`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 38928 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt067` | — | — |
| `showPhilosopherDetailModal` | function | 38932 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 38936 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt066` | — | — |
| `closePhilosopherDetailModal` | function | 38937 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 38939 | 4 | (philosopherName=…) | `PERM`, `can`, `openUniversalModal` | `makeLegendsEditable`×2, `rebuildOverCurrent` | — | — |
| `openEditConceptModal` | function | 38944 | 6 | (concept=…) | `conceptById`, `PERM`, `can`, `openUniversalModal` | `rebuildOverCurrent`, `stmt069` | динам.×1 | — |
| `openEditConnectionModal` | function | 38951 | 6 | (a=…, b=…) | `PERM`, `can`, `openUniversalModal`, `findConnection` | `stmt070` | динам.×1 | — |
| `updateGraphData` | function | 38976 | 24 | () | `simulation`×3, `nodes`, `links`, `pickDirty`, `requestDraw`, `linkLayer`, `rebuildQuadtree`, `resetLayoutClock` | `addNodeToGraph`, `addLinkToGraph`, `stmt052` | — | — |
| `addNodeToGraph` | function | 39001 | 15 | (nodeData) | `emit`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 39019 | 4 | () | `requestDraw`, `linkLayer` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 39024 | 11 | (linkData) | `conceptById`×2, `emit`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 39036 | 8 | () | `pickDirty`, `requestDraw`, `linkLayer` | `saveConnectionData` | — | — |
| `forgetNode` | function | 39050 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 39069 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 39082 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 39136 | 1 | () | `hasUnsavedEdits` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 39137 | 1 | () | `hasUnsavedEdits` | — | — | — |
| `collectData` | function | 39139 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 39143 | 11 | (name, text) | — | `downloadData` | — | — |
| `downloadData` | function | 39155 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 39164 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `readCookie` | function | 39209 | 10 | (имя) | — | `api` | — | — |
| `api` | async function | 39220 | 29 | (path, ?) | `serverMode`, `readCookie` | `submitAuth`×2, `sendCommit`×2, `pullGraphSince`×2, `saveObservation`, `loadObservations`, `compareObservationsInPanel`, `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll`, `detectServerMode`, `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel`, `planRelayout`, `loadLayoutHistory`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `showImpact`, `refreshUnread`, `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `rebuildOverCurrent` | — | — |
| `detectServerMode` | async function | 39254 | 36 | () | `serverMode`×2, `setSessionUser`, `api` | `submitAuth`×2, `stmt040` | — | — |
| `sameValue` | function | 39316 | 14 | (a, b) | — | `describeChange` | — | — |
| `describeChange` | function | 39331 | 17 | (action, kind, entityId, prevSide, next) | `sameValue` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `submitChange` | function | 39355 | 17 | (descr, применить) | `PERM`, `can`, `serverMode`, `lastSubmitted`, `sendCommit` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `sendCommit` | async function | 39379 | 58 | (descr, direct) | `reportSubmit`×3, `api`×2, `emit`, `commitMessageFor`, `applyFreshGraph` | `submitChange` | — | — |
| `commitMessageFor` | function | 39439 | 9 | (descr) | — | `sendCommit` | — | — |
| `openUsersPanel` | function | 39475 | 6 | () | `loadUsers` | — | статич.×1 | — |
| `closeUsersPanel` | function | 39482 | 4 | () | — | — | статич.×1 | — |
| `loadUsers` | async function | 39487 | 17 | () | `userItems`×3, `usersError`×2, `api`, `renderUsers` | `openUsersPanel`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `renderUsers` | function | 39505 | 26 | () | `escapeAttr`×8, `userItems`×2, `usersError`×2, `PERM`, `can` | `loadUsers`, `changeUserRoleFromPanel`, `banUserFromPanel` | — | — |
| `changeUserRoleFromPanel` | async function | 39532 | 13 | (id, role) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030` | — | — |
| `banUserFromPanel` | async function | 39546 | 14 | (id, unban) | `api`, `usersError`, `loadUsers`, `renderUsers` | `stmt030`×2 | — | — |
| `openCommitsPanel` | function | 39590 | 6 | () | `loadCommits` | — | статич.×1 | — |
| `closeCommitsPanel` | function | 39597 | 4 | () | — | — | статич.×1 | — |
| `switchCommitTab` | function | 39602 | 14 | (вкладка) | `commitTab`×4, `PERM`×2, `can`×2, `layoutPlan`, `layoutError`, `loadLayoutHistory`, `layoutRevertTo`, `loadCommits`, `renderCommits` | — | статич.×3 | — |
| `planRelayout` | async function | 39627 | 12 | () | `layoutPlan`×2, `layoutError`×2, `api`, `renderCommits` | — | динам.×2 | — |
| `loadLayoutHistory` | async function | 39646 | 5 | () | `api`, `layoutHistoryItems`, `renderCommits` | `switchCommitTab`, `doLayoutRevert`, `applyRelayout` | — | — |
| `cancelLayoutRevert` | function | 39657 | 1 | () | `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `askLayoutRevert` | function | 39659 | 5 | (id) | `layoutHistoryItems`, `layoutRevertTo`, `renderCommits` | — | динам.×1 | — |
| `doLayoutRevert` | async function | 39665 | 18 | () | `layoutRevertTo`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `layoutPlan`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×1 | — |
| `applyRelayout` | async function | 39684 | 22 | () | `layoutPlan`×3, `layoutError`×2, `showTemporaryMessage`, `api`, `loadLayoutHistory`, `renderCommits`, `pullGraphSince` | — | динам.×2 | — |
| `loadCommits` | async function | 39707 | 15 | () | `commitItems`×3, `commitError`×2, `api`, `commitTab`, `renderCommits` | `openCommitsPanel`, `switchCommitTab`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `commitStateWords` | function | 39738 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `commitStateKind` | function | 39742 | 3 | (state2) | `COMMIT_STATES` | `renderCommits` | — | — |
| `provenanceDiff` | function | 39759 | 32 | (changes) | `escapeAttr`×3, `stateInWords`×2 | `renderCommits` | — | — |
| `stateInWords` | function | 39792 | 4 | (код) | `PROVENANCE_STATES` | `provenanceDiff`×2 | — | — |
| `layoutHistoryHtml` | function | 39805 | 15 | () | `escapeAttr`×5, `layoutHistoryItems`×2, `LAYOUT_KINDS` | `layoutTabHtml`×2 | — | — |
| `layoutTabHtml` | function | 39821 | 49 | () | `layoutRevertTo`×5, `escapeAttr`×4, `layoutPlan`×3, `layoutError`×2, `layoutHistoryHtml`×2, `LAYOUT_KINDS` | `renderCommits` | — | — |
| `renderCommits` | function | 39871 | 73 | () | `escapeAttr`×13, `PERM`×4, `can`×4, `commitItems`×3, `commitTab`×2, `commitError`×2, `refreshEditCount`×2, `commitStateWords`, `commitStateKind`, `provenanceDiff`, `layoutTabHtml` | `switchCommitTab`, `planRelayout`, `loadLayoutHistory`, `cancelLayoutRevert`, `askLayoutRevert`, `doLayoutRevert`, `applyRelayout`, `loadCommits`, `reviewCommitFromPanel`, `revertCommitFromPanel` | — | — |
| `refreshEditCount` | function | 39951 | 7 | (сколько) | — | `renderCommits`×2 | — | — |
| `reviewCommitFromPanel` | async function | 39959 | 17 | (id, решение) | `emit`, `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031`×2 | — | — |
| `revertCommitFromPanel` | async function | 39977 | 14 | (id) | `api`, `commitError`, `loadCommits`, `renderCommits`, `pullGraphSince` | `stmt031` | — | — |
| `showImpact` | async function | 40001 | 16 | (id) | `api`, `describeImpact` | `stmt031` | — | — |
| `describeImpact` | function | 40022 | 26 | (data) | `escapeAttr`×2 | `showImpact` | — | — |
| `refreshUnread` | async function | 40078 | 8 | () | `unreadCount`×3, `serverMode`, `api`, `renderBell` | `markNotificationRead`, `markAllNotificationsRead`, `stmt032`, `stmt033` | — | — |
| `loadNotifications` | async function | 40087 | 7 | () | `notifyItems`×2, `serverMode`, `api`, `renderNotifyList` | `toggleNotifyPanel` | — | — |
| `renderBell` | function | 40095 | 9 | () | `unreadCount`×3, `serverMode` | `refreshUnread`, `stmt033` | — | — |
| `renderNotifyList` | function | 40105 | 18 | () | `escapeAttr`×3, `notifyItems`×2, `notifyWords` | `loadNotifications`, `markNotificationRead`, `markAllNotificationsRead` | — | — |
| `notifyWords` | function | 40125 | 16 | (kind) | — | `renderNotifyList` | — | — |
| `toggleNotifyPanel` | function | 40142 | 7 | () | `loadNotifications` | — | статич.×1 | — |
| `markNotificationRead` | async function | 40150 | 9 | (id) | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | `stmt034` | — | — |
| `markAllNotificationsRead` | async function | 40160 | 7 | () | `serverMode`, `api`, `notifyItems`, `refreshUnread`, `renderNotifyList` | — | статич.×1 | — |
| `warnRemoteEdit` | function | 40192 | 14 | (touched) | `ModalContext`×2, `reportSubmit` | `stmt035` | — | — |
| `showConflict` | function | 40209 | 31 | (descr, столкновения) | `escapeAttr`×5, `reportSubmit`×2, `lastConflict` | `stmt029` | — | — |
| `rebuildOverCurrent` | async function | 40246 | 22 | () | `reportSubmit`×2, `closeUniversalModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `api`, `applyFreshGraph`, `closeConflictModal`, `lastConflict` | — | статич.×1 | — |
| `replaceEntity` | function | 40283 | 9 | (set, id, запись) | — | `applyIncrement` | — | — |
| `applyIncrement` | function | 40297 | 18 | (приращение) | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations`, `knownGraphVersion`, `replaceEntity`, `rebuildDerived`, `afterDataChange` | `pullGraphSince` | — | — |
| `pullGraphSince` | async function | 40317 | 30 | () | `knownGraphVersion`×3, `api`×2, `applyServerLayout`, `emit`, `serverMode`, `applyIncrement`, `applyFreshGraph` | `submitAuth`×2, `doLayoutRevert`, `applyRelayout`, `reviewCommitFromPanel`, `revertCommitFromPanel`, `connectLive`, `stmt040` | — | — |
| `connectLive` | function ⟲ | 40353 | 33 | () | `liveSocket`×5, `serverMode`×2, `liveRetry`×2, `emit`, `pullGraphSince`, `liveClosedOnPurpose` | `submitAuth`×2, `stmt040` | — | — |
| `rebuildDerived` | function | 40410 | 43 | () | `nodes`×4, `links`×2, `philosophers`, `concepts`, `relations`, `viewWidth`, `viewHeight` | `applyIncrement`, `applyFreshGraph` | — | — |
| `applyFreshGraph` | function | 40454 | 17 | (state2) | `traditions`×2, `philosophers`×2, `rubrics`×2, `relationTypes`×2, `concepts`×2, `relations`×2, `applyServerLayout`, `rebuildDerived`, `afterDataChange` | `sendCommit`, `rebuildOverCurrent`, `pullGraphSince` | — | — |
| `closeConflictModal` | function | 40472 | 4 | () | — | `rebuildOverCurrent` | статич.×1 | — |
| `reportSubmit` | function | 40480 | 19 | (kind, text) | `noticeTimer`×2, `lastSubmitResult` | `sendCommit`×3, `showConflict`×2, `rebuildOverCurrent`×2, `warnRemoteEdit` | — | — |
| `afterDataChange` | function | 40505 | 36 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `rebuildIndexes`, `emit`, `linkLayer`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `applyIncrement`, `applyFreshGraph`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 40559 | 31 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 40591 | 14 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt042`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 40611 | 6 | (conceptId) | `emit`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `provenanceBlock` | function | 40643 | 24 | (value, status) | `escapeAttr` | `generateConnectionVisualization`, `generateConceptViewContent`, `generatePhilosopherViewContent` | — | — |
| `escapeAttr` | function | 40668 | 4 | (s) | — | `renderCommits`×13, `renderUsers`×8, `renderObservations`×6, `compareObservationsInPanel`×6, `layoutHistoryHtml`×5, `showConflict`×5, `layoutTabHtml`×4, `provenanceDiff`×3, `renderNotifyList`×3, `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `observationBar`×2, `startMfaEnroll`×2, `describeImpact`×2, `confirmMfaEnroll`, `provenanceBlock`, `provenanceField`, `generateConnectionEditContent` | динам.×4 | — |
| `relationIndexById` | function | 40685 | 4 | (id) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 40693 | 12 | (nameA, nameB) | `philosopherByName`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 40711 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 40752 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 40759 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 40760 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 40762 | 4 | (id) | `conceptById` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 40771 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `conceptById`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `provenanceDriftWarning` | function | 40923 | 10 | (prev, next) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 40934 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 40953 | 16 | (name, birth, death, original) | `nodesByPhilosopher`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 40971 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 40981 | 102 | () | `philosophers`×8, `selectedPhilosophers`×3, `philosopherByName`×2, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `describeChange`, `submitChange`, `afterDataChange`, `provenanceDriftWarning`, `philosopherIntegrityWarnings`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 41084 | 41 | (philosopherName) | `philosophers`×2, `philosopherConcepts`, `philosopherOrder`, `philosopherByName`, `nodesByPhilosopher`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `describeChange`, `submitChange`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 41132 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 41141 | 7 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexById` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 41149 | 76 | () | `concepts`×5, `nodes`×5, `conceptToRubrics`×2, `openUniversalModal`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `provenanceFields`×2, `philosopherByName`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `provenanceDriftWarning`, `conceptIntegrityWarnings`, `confirmWarnings`, `provenanceValue` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 41240 | 31 | (conceptId) | `ModalContext`×6, `conceptById`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 41276 | 93 | () | `ModalContext`×6, `relations`×5, `links`×2, `conceptById`×2, `modalEntityExists`×2, `openUniversalModal`×2, `generateId`×2, `describeChange`×2, `submitChange`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexById`, `connectionIntegrityWarnings`, `provenanceDriftWarning`, `confirmWarnings`, `provenanceValue`, `provenanceFields` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 41370 | 49 | (sourceId=…, targetId=…) | `ModalContext`×6, `conceptById`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `describeChange`, `submitChange`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `provenanceField` | function | 41445 | 22 | (data) | `escapeAttr`, `PROVENANCE_STATES` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `refreshProvenanceField` | function | 41472 | 17 | () | — | — | динам.×1 | — |
| `provenanceValue` | function | 41491 | 12 | () | `needsCitation` | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `provenanceFields` | function | 41510 | 6 | (line, состояние) | — | `saveConceptData`×2, `savePhilosopherData`, `saveConnectionData` | — | — |
| `needsCitation` | function | 41517 | 3 | (состояние) | — | `provenanceValue` | — | — |
| `commitReasonField` | function | 41532 | 9 | () | `serverMode` | `modalActions` | — | — |
| `modalActions` | function | 41542 | 15 | (saveFn, deleteFn, deleteArg, isNew) | `commitReasonField` | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 41562 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 41580 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 41587 | 117 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosopherByName`, `nodesByPhilosopher`, `provenanceField`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 41709 | 132 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `conceptToRubrics`, `conceptById`, `isReflexiveLink`, `linkArrow`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `provenanceField`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 41849 | 39 | () | `relationTypesObj`, `links`, `LAYER_NAMES`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 41890 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 41916 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 41926 | 97 | (connectionData) | `conceptById`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `provenanceField`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 42028 | 29 | (type, query) | `pickConcepts`, `rowInner`, `emptyList`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 42058 | 18 | (type, conceptId) | `conceptById`, `ModalContext`, `updateConnEditPairNote` | `stmt055` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 42077 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 42091 | 20 | () | `ModalContext`×5, `conceptById`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 42113 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 42117 | 7 | (conceptId) | `conceptById`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 42136 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 42145 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 42152 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 42176 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditionById` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 42191 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 42252 | 75 | (sourceNode, targetNode, connectionData) | `conceptPlate`×3, `relationHint`×2, `relationTypesObj`, `isReflexiveLink`, `provenanceBlock`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 42328 | 81 | (connectionData) | `conceptById`×2, `ModalContext`×2, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 42421 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 42441 | 42 | (type, query) | `nodes`×2, `links`, `pickConcepts`, `rowInner`, `emptyList`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 42484 | 33 | (type, conceptId) | `ModalContext`×3, `conceptById`, `updateConnectionVisualization` | `stmt055` | динам.×1 | — |
| `updateConnectionVisualization` | function | 42518 | 18 | () | `conceptById`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 42540 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 42564 | 266 | (conceptData) | `philosopherConcepts`×5, `relationTypesObj`×4, `conceptToRubrics`×2, `linkArrow`×2, `nodes`, `links`, `conceptById`, `rubricById`, `getContrastColor`, `similarConceptsBlock`, `provenanceBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 42832 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 42848 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 42859 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 42898 | 14 | (sectionId) | — | — | динам.×4 | — |
| `gotoNodeFromModal` | function | 42914 | 23 | (nodeId) | `selectedNodes`×2, `conceptById`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 42939 | 28 | (rubricId, currentConceptId) | `philosopherConcepts`, `nodes`, `conceptToRubrics`, `rubricById` | — | динам.×1 | — |
| `conjugateVerb` | function | 42970 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 42981 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `philosopherTraditionsBlock` | function | 43016 | 37 | (name) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 43055 | 4 | (name) | `traditionById`, `philosopherTraditions` | `philosopherTraditionsBlock` | — | — |
| `similarPhilosophersBlock` | function | 43060 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 43096 | 454 | (philosopherName) | `declinePhilosopher`×22, `conceptById`×6, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `philosopherConcepts`×3, `nodesByPhilosopher`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `links`×2, `linkArrow`×2, `conceptToRubrics`, `philosopherByName`, `traditionById`, `rubricById`, `provenanceBlock`, `philosopherTraditionsBlock`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 43552 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 43568 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 43604 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 43636 | 81 | () | `PERM`×2, `can`×2, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `philRowTip`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt038`, `stmt051` | — | — |
| `closeAllModals` | function | 43743 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt041`, `stmt042` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5641 | массив (25) | — | `applyFreshGraph`×2, `rebuildIndexes`, `buildAboutText`, `initFilters`, `selectAllTraditions`, `deselectAllTraditions`, `syncTraditionRows`, `collectData`, `applyIncrement`, `generatePhilosopherEditContent` |
| `philosophers` | const | 5763 | массив (100) | — | `savePhilosopherData`×8, `buildAboutText`×2, `traditionMembers`×2, `applyFreshGraph`×2, `deletePhilosopher`×2, `stmt001`, `stmt002`, `stmt003`, `rebuildIndexes`, `stmt009`, `rebuildPhilosopherTraditions`, `initializePhilosophyMetrics`, `pickPhilosophers`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `rebuildDerived`, `philosopherTraditionsBlock` |
| `rubrics` | const | 6481 | массив (15) | — | `selectAllRubrics`×2, `applyFreshGraph`×2, `stmt007`, `rebuildIndexes`, `selectedRubrics`, `buildAboutText`, `initFilters`, `deselectAllRubrics`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement`, `generateConceptEditContent` |
| `relationTypes` | const | 6561 | массив (21) | — | `applyFreshGraph`×2, `stmt004`, `stmt005`, `buildAboutText`, `rebuildDerivedIndexes`, `collectData`, `applyIncrement` |
| `concepts` | const | 6601 | массив (718) | — | `saveConceptData`×5, `updateProvenanceCoverage`×2, `rebuildDerivedIndexes`×2, `applyFreshGraph`×2, `removeConceptEverywhere`×2, `graphFingerprint`, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `savePhilosopherData` |
| `relations` | const | 12525 | массив (2720) | — | `saveConnectionData`×5, `updateProvenanceCoverage`×2, `applyFreshGraph`×2, `graphFingerprint`, `links`, `buildAboutText`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `applyIncrement`, `rebuildDerived`, `relationIndexById`, `removeLinkEverywhere` |
| `nodePositions` | const | 23625 | объект (2) | — | `applyStoredLayout` |
| `storedLayoutComplaint` | let | 23723 | литерал null | — | `applyStoredLayout`×2, `stmt080`×2 |
| `philosopherIdToName` | const | 23726 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 23732 | объект (0) | — | `generateConceptViewContent`×5, `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generatePhilosopherViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `rowInner`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `philosopherTraditionsBlock`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 23741 | объект (0) | — | `rebuildDerivedIndexes`×3, `pickConcepts`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 23747 | объект (0) | — | `generatePhilosopherViewContent`×5, `drawLinkSet`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt025`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `showFoundLinks`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `exportToSVG`, `linkHasTwoHeads`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 23772 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 23778 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `calculatePageRank`×9, `calculateBetweennessAsync`×5, `saveConceptData`×5, `applyStoredLayout`×4, `calculateClosenessCentrality`×4, `generateOverviewContent`×4, `rebuildDerived`×4, `applyServerLayout`×3, `rebuildIndexes`×3, `calculateEigenvectorCentrality`×3, `subSelection`×3, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `linksLayerKey`×2, `renderScene`×2, `makeClassed`×2, `removeConceptEverywhere`×2, `handleConnectionViewSearch`×2, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `visualizeMetricBySize`, `pickConcepts`, `showSimilarityOverlay`, `startRadiusAnimation`, `stepRadiusAnimation`, `rebuildQuadtree`, `gfxNode`, `simulation`, `stmt022`, `resetSimulation`, `updateGraphData`, `conceptIntegrityWarnings`, `savePhilosopherData`, `generateConceptViewContent`, `showAllConcepts`, `stmt043` |
| `links` | const | 23796 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `repaintPickCanvas`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `rebuildDerived`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `rebuildIndexes`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `showFoundLinks`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `exportToSVG`, `similarityLinkCount`, `needsContinuousAnimation`, `linksLayerKey`, `drawLinkSet`, `gfxLink`, `simulation`, `stmt022`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt043` |
| `conceptToRubrics` | const | 23808 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 23814 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `conceptById` | const | 23846 | new Map | — | `generatePhilosopherViewContent`×6, `deleteConnection`×3, `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `renderComparison`×2, `renderScene`×2, `stmt025`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `updateConnectionVisualization`×2, `DATA_nodes_find`, `findAndShowPath`, `pickLinkEnd`, `calculateBetweennessAsync`, `calculatePageRank`, `calculateEigenvectorCentrality`, `generateComparisonContent`, `highlightNodeById`, `selectSearchResult`, `selectCustomOption`, `updateSimilarityLegend`, `stmt024`, `openConceptById`, `similarConceptsBlock`, `showConceptProfileModal`, `openEditConceptModal`, `labelOf`, `deleteConcept`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `generateConceptViewContent`, `gotoNodeFromModal` |
| `philosopherByName` | const | 23847 | new Map | — | `rebuildIndexes`×2, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `activityOverlap`×2, `savePhilosopherData`×2, `nodeAge`, `showPathDescriptionsModal`, `philosopherBirth`, `philosopherYears`, `showPhilosopherProfileModal`, `hasPhilosopherChanges`, `deletePhilosopher`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `traditionById` | const | 23848 | new Map | — | `rebuildIndexes`×2, `traditionsOfPhilosopher`, `analyzePathTraditions`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `rubricById` | const | 23849 | new Map | — | `rebuildIndexes`×2, `showPhilosopherProfileModal`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `nodesByPhilosopher` | const | 23850 | new Map | — | `rebuildIndexes`×3, `generatePhilosopherViewContent`×3, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `philosopherIntegrityWarnings`, `deletePhilosopher`, `generatePhilosopherEditContent` |
| `linksByConcept` | const | 23851 | new Map | — | `rebuildIndexes`×6, `pullStrengthOf`, `getConceptConnections` |
| `useWeightedPaths` | let | 23892 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt077`, `stmt082` |
| `respectDirection` | let | 23893 | литерал true | — | `metricDescriptions`×15, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt078`, `stmt082` |
| `skipTypologicalInPaths` | let | 23910 | литерал true | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 23926 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 23967 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `highlightPath`, `showPathDescriptionsModal`, `stmt084` |
| `MATURITY_AGE` | const | 23970 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 23973 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `toggleTradition`×3, `savePhilosopherData`×3, `syncTraditionRows`×2, `afterDataChange`×2, `resetTradition`, `selectAllTraditions`, `deselectAllTraditions`, `syncPhilosopherCheckboxes`, `onlyTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `deletePhilosopher` |
| `selectedRelations` | let | 23974 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations` |
| `philosopherTraditions` | const | 23977 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `sharesTradition`×2, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt009`, `traditionsOfPhilosopher`, `philosopherTraditionsBlock`, `DATA_traditions_of` |
| `selectedRubrics` | let | 23983 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics` |
| `filterMode` | let | 23986 | строка | — | `applyFiltersImmediate`×3, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode` |
| `arrowHoverTimer` | let | 24700 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 24701 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 24814 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 24964 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `searchKind` | let | 24991 | строка | — | `setSearchKind` |
| `chosenPhilosophers` | const | 25070 | new Set | — | `highlightPhilosopherOnGraph`×8, `dispatchClick`×2, `markChosenInLegend` |
| `linkSearch` | const | 25139 | объект (2) | — | `handleLegendLinkSearch`×4, `clearLinkSearch`×2, `pickLinkEnd`, `showFoundLinks` |
| `pinnedDespiteFilter` | const | 25264 | new Set | — | `applyBasicFilter`×3, `updateFilterNote`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt059` |
| `hintBox` | let | 25392 | литерал null | — | `showHint`×9, `hideHint`×2 |
| `BUS_EVENTS` | const | 25426 | массив (18) | — | `subscribe`, `emit` |
| `busSubscribers` | const | 25446 | new Map | — | `subscribe`×3, `emit` |
| `BUS_PHASES` | const | 25448 | массив (4) | — | `emit`×2, `subscribe` |
| `LoadingIndicator` | const | 25523 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 25676 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 25838 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 25980 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `sharesTradition`×2 | `applyBasicFilter` |
| `visibleNodeIds` | var | 26161 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 26162 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility`, `linksLayerKey` |
| `debouncedApplyFilters` | const | 26441 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 26448 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 26471 | объект (4) | — | `relationHint`×2, `onConnTypeChange` |
| `WITHOUT_TRADITION` | const | 26596 | строка | — | `syncTraditionRows`×2, `initFilters`, `traditionMembers` |
| `metricsLinkSource` | let | 26943 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 26944 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 26945 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `saveObservation`×2, `metricScopeFactor`, `closeStatsModal`, `observationBar` |
| `lastScopeKey` | let | 26984 | литерал null | — | `applyMetricsScope`×2, `closeStatsModal` |
| `FORMULA_VERSIONS` | const | 27038 | вызов Object.freeze() | — | `saveObservation`×2 |
| `METRIC_FLAGS` | const | 27074 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 27123 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles`, `observationBar`, `saveObservation` |
| `betweennessCache` | let | 27337 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 27338 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 27530 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 27531 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 27677 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 27678 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 27806 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 27868 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 27869 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 27870 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 27879 | литерал 5 | — | `calculateWeightedClustering`×2 |
| `eigenvectorCache` | let | 28234 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 28235 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 28237 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 28379 | литерал null | — | `metricDescriptions`×5, `philosopherSimilarityData`×4, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 28380 | литерал null | — | `philosopherSimilarityData`×3, `buildReflexiveMap`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `generativityScores`, `conceptDegreeForNorm` |
| `_philosophers` | let | 28381 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 28382 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 28383 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 28384 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 28385 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `linksBothWays`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `_reflexiveMap` | let | 28386 | литерал null | — | `reflexiveLinkOf`×3, `initializeMetricsData` |
| `problemGenerationIndexCache` | let | 28469 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 28587 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 28770 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 28904 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 28960 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 29129 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 29137 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 29140 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 29142 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 29144 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 29232 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 29307 | литерал null | — | `invalidateDialogicalIndexCache` |
| `MUTUAL_DIALOGUE_BONUS` | const | 29312 | литерал 1.5 | — | `dialogicalIndex` |
| `internalCoherenceIndexCache` | let | 29378 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 29436 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 29451 | объект (3) | — | — |
| `_tensionScales` | let | 29457 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 29458 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 29722 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 29772 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 29835 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 29902 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 29958 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 30023 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 30062 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 30166 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 30205 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 30262 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 30317 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 30396 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 30412 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 30436 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 30497 | литерал null | — | `allConceptPairsAsync`×4, `invalidateSimilarityCache`, `allConceptPairs` |
| `_pairCalculating` | let | 30498 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 30509 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 30579 | литерал null | — | `neighborSets`×3 |
| `PHIL_SIM_MIN_CONCEPTS` | const | 30683 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 30702 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 30708 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 30858 | строка | — | `influenceScopeSwitcher`×7, `influenceIndex`×2, `setInfluenceScope`×2, `linkInInfluenceScope` |
| `INFLUENCE_SCOPE_LABELS` | const | 30867 | объект (4) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 30899 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 30900 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 30905 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 31004 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 31050 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 31055 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 31056 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 31144 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 31182 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 31270 | строка | — | `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 31397 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×5, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 31872 | литерал null | — | `openStatsModal`×4, `handleStatsParameterChange`×3, `stmt054`×2, `stmt071`×2, `effectiveScopeFlags`, `switchStatsView` |
| `isStatsModalOpen` | let | 31873 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt010`, `stmt011`, `toggleMetricVisualization`, `stmt054`, `stmt071` |
| `observationItems` | let | 32107 | массив (0) | — | `renderObservations`×2, `loadObservations` |
| `observationPicked` | let | 32108 | массив (0) | — | `pickObservation`×6, `renderObservations`×4, `compareObservationsInPanel` |
| `WEIGHT_WORDS` | const | 32347 | объект (3) | — | `showPathDescriptionsModal`, `linkArrow` |
| `_ambiguousLabels` | let | 32436 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 32455 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 32456 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 32481 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 32502 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 32503 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 32612 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 32625 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 32749 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt012`, `applyMetricLayout` |
| `_cmpA` | let | 33608 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `pickedConceptOf`, `selectCustomOption` |
| `_cmpB` | let | 33608 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `pickedConceptOf`, `selectCustomOption` |
| `_pairsKind` | var | 33620 | строка | — | `renderClosestPairs` |
| `_pairsMinDegree` | var | 33621 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 33622 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 33623 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 33624 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 33626 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 33626 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 33644 | объект (4) | — | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 33745 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 34633 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 34634 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 34635 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 34636 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `selectedSourceNode` | let | 35502 | литерал null | — | `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `selectedTargetNode` | let | 35503 | литерал null | — | `findAndShowPath`, `pickedConceptOf`, `selectCustomOption` |
| `editMode` | let | 35633 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 35646 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 35647 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 35648 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 35769 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 35770 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 35846 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingX`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `viewHeight` | let | 35847 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `installLayoutPull`, `spacingY`, `stmt027`, `addNodeToGraph`, `rebuildDerived`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 35856 | вызов document.getElementById() | — | `resizeCanvas`×6, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt016`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 35857 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4, `renderScene` |
| `gfxSvg` | const | 35858 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `pickCanvas` | const | 35861 | вызов document.createElement() | — | `resizeCanvas`×2, `repaintPickCanvas`×2, `pickLink`×2, `pickCtx` |
| `pickCtx` | const | 35862 | вызов pickCanvas.getContext() | `pickCanvas` | `repaintPickCanvas`×13, `pickLink` |
| `pickDirty` | let | 35863 | литерал true | — | `refreshHitMaps`, `resizeCanvas`, `draw`, `repaintPickCanvas`, `pickLink`, `gfxZoom`, `stmt016`, `stmt020`, `updateGraphData`, `updateLinkOnGraph` |
| `PICK_LINK_WIDTH` | const | 35867 | литерал 10 | — | `repaintPickCanvas` |
| `dpr` | let | 35869 | выражение | — | `paintLinkLayer`×4, `draw`×4, `repaintPickCanvas`×4, `resizeCanvas`×3, `pickLink`×2 |
| `renderState` | const | 35884 | объект (9) | — | `forgetNode`×6, `linksLayerKey`×5, `subSelection`×5, `stepRadiusAnimation`×4, `stmt016`×4, `stmt025`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `renderScene`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `linkDrawnLive`, `paintLinkLayer`, `drawLinkSet`, `draw`, `startRadiusAnimation`, `toGraph`, `pickNode`, `repaintPickCanvas`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 35898 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowPoints`, `arrowPointsStart` |
| `arrowRadius` | var | 35899 | литерал null | — | `arrowPoints`×2, `arrowPointsStart`×2, `visualizeMetricBySize`, `resetNodeSizes` |
| `uniformLinkWidthActive` | var | 35900 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 35905 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `nodeLitBySimilarity`×5, `linkAmongHighlighted`×4, `stmt024`×4, `showSimilarityOverlay`×3, `toggleSimilarityKind`×3, `similarityLinkCount`×3, `forgetNode`×3, `setSimilarityLinks`×2, `stmt049`×2, `clearSimilarityOverlay`, `linkDrawAlpha`, `linksLayerKey` |
| `SIMILARITY_KEEP_QUANTILE` | const | 35911 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 35912 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 36153 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 36154 | литерал 1 | — | `renderScene` |
| `drawScheduled` | let | 36162 | литерал false | — | `requestDraw`×3 |
| `painter` | let | 36166 | литерал null | — | `requestDraw`×2, `setPainter` |
| `animLoopRunning` | let | 36181 | литерал false | — | `ensureAnimLoop`×3 |
| `DRAW_ORDER` | const | 36409 | массив (5) | — | `exportToSVG`, `drawLinkSet` |
| `linkLayer` | const | 36422 | объект (3) | — | `paintLinkLayer`×7, `renderScene`×4, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph`, `afterDataChange` |
| `lastLayerKey` | let | 36428 | литерал null | — | `renderScene`×2 |
| `LABEL_SHADOW_PASSES` | const | 36552 | литерал 3 | — | `renderScene` |
| `quadtree` | let | 36726 | литерал null | — | `pickNode`×2, `rebuildQuadtree` |
| `nodeHandlers` | const | 36795 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 36795 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 36837 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt024`, `gotoNodeFromModal` |
| `gfxLink` | const | 36849 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt025` |
| `gfxLinkAll` | const | 36859 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 36867 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `pickDirty`, `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt016`, `centerGraph`, `gotoNodeFromModal` |
| `tickCount` | let | 36931 | литерал 0 | — | `stmt020`×2, `resetLayoutClock`, `stmt022` |
| `layoutSettled` | let | 36932 | литерал false | — | `applyServerLayout`, `stmt019`, `resetLayoutClock`, `stmt020`, `stmt021`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `layoutFromStore` | const | 36934 | вызов applyStoredLayout() | `applyStoredLayout` | `stmt019` |
| `LAYOUT_PULL` | const | 36955 | литерал 0.1 | — | `pullStrengthOf` |
| `simulation` | let | 36961 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×7, `stmt027`×5, `updateGraphData`×3, `applyServerLayout`×2, `stmt020`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `installLayoutPull`, `stmt019`, `maxTicksFor`, `maxTicks`, `stmt021`, `stmt022`, `dragstarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt076` |
| `maxTicks` | let | 37012 | вызов maxTicksFor() | `simulation`, `maxTicksFor` | `stmt020` |
| `selectedNodes` | let | 37070 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 37073 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `linkDrawnLive`, `linksLayerKey`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt025`, `forgetLink` |
| `lastHoverNode` | let | 37081 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 37081 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 37342 | вызов d3.select() | — | `stmt024`×2 |
| `tooltipTimeout` | let | 37343 | литерал null | — | `stmt024`×6 |
| `simLockedByHand` | let | 37565 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 37591 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt026`, `stmt027` |
| `groupPositions` | const | 37592 | объект (0) | — | `stmt027`×3, `toggleGrouping`×2, `stmt026` |
| `cols` | const | 37593 | литерал 6 | — | `stmt027`×3, `stmt026`×2, `rows`, `spacingX` |
| `rows` | const | 37594 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt027` |
| `spacingX` | const | 37595 | выражение | `viewWidth`, `cols` | `stmt026` |
| `spacingY` | const | 37596 | выражение | `viewHeight`, `rows` | `stmt026` |
| `isGrouped` | let | 37607 | литерал false | — | `toggleGrouping`×3, `stmt027` |
| `PROFILE_METRICS` | const | 37815 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 37871 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 38107 | объект (4) | — | `deleteConcept`×6, `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `warnRemoteEdit`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 38118 | массив (0) | — | `pushModalState`×5, `stmt042`×2, `stmt050`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 38119 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 38213 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 38214 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 38215 | объект (1) | — | `setSessionUser`, `renderAuthControls` |
| `authModalKind` | let | 38216 | строка | — | `submitAuth`×3, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `PERM` | const | 38234 | вызов Object.freeze() | — | `renderCommits`×4, `setSessionUser`×2, `switchCommitTab`×2, `makeLegendsEditable`×2, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `philRowTip`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `submitChange`, `renderUsers` |
| `granted` | let | 38245 | new Set | — | `setPermissions`, `can` |
| `securitySecret` | let | 38310 | литерал null | — | `openSecurityModal`, `startMfaEnroll`, `confirmMfaEnroll` |
| `pinnedVisibleNodes` | const | 38974 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 39132 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 39134 | литерал false | — | `markDirty`, `hasUnsaved`, `downloadData`, `saveToFolder`, `stmt028` |
| `dataFolder` | let | 39162 | литерал null | — | `saveToFolder`×3 |
| `serverMode` | let | 39207 | литерал false | — | `submitAuth`×2, `detectServerMode`×2, `connectLive`×2, `observationBar`, `loadObservations`, `api`, `submitChange`, `refreshUnread`, `loadNotifications`, `renderBell`, `markNotificationRead`, `markAllNotificationsRead`, `pullGraphSince`, `commitReasonField` |
| `lastSubmitted` | let | 39353 | литерал null | — | `submitChange` |
| `userItems` | let | 39472 | массив (0) | — | `loadUsers`×3, `renderUsers`×2 |
| `usersError` | let | 39473 | строка | — | `loadUsers`×2, `renderUsers`×2, `changeUserRoleFromPanel`, `banUserFromPanel` |
| `commitTab` | let | 39586 | строка | — | `switchCommitTab`×4, `renderCommits`×2, `loadCommits` |
| `commitItems` | let | 39587 | массив (0) | — | `loadCommits`×3, `renderCommits`×3 |
| `commitError` | let | 39588 | строка | — | `loadCommits`×2, `renderCommits`×2, `reviewCommitFromPanel`, `revertCommitFromPanel` |
| `layoutPlan` | let | 39624 | литерал null | — | `applyRelayout`×3, `layoutTabHtml`×3, `planRelayout`×2, `switchCommitTab`, `doLayoutRevert` |
| `layoutError` | let | 39625 | строка | — | `planRelayout`×2, `doLayoutRevert`×2, `applyRelayout`×2, `layoutTabHtml`×2, `switchCommitTab` |
| `layoutHistoryItems` | let | 39644 | массив (0) | — | `layoutHistoryHtml`×2, `loadLayoutHistory`, `askLayoutRevert` |
| `layoutRevertTo` | let | 39655 | литерал null | — | `layoutTabHtml`×5, `doLayoutRevert`×3, `switchCommitTab`, `cancelLayoutRevert`, `askLayoutRevert` |
| `COMMIT_STATES` | const | 39729 | вызов Object.freeze() | — | `commitStateWords`, `commitStateKind` |
| `LAYOUT_KINDS` | const | 39803 | вызов Object.freeze() | — | `layoutHistoryHtml`, `layoutTabHtml` |
| `unreadCount` | let | 40075 | литерал 0 | — | `refreshUnread`×3, `renderBell`×3 |
| `notifyItems` | let | 40076 | массив (0) | — | `loadNotifications`×2, `renderNotifyList`×2, `markNotificationRead`, `markAllNotificationsRead` |
| `knownGraphVersion` | let | 40280 | литерал 0 | — | `pullGraphSince`×3, `applyIncrement` |
| `liveSocket` | let | 40387 | литерал null | — | `connectLive`×5, `stmt036`×2 |
| `liveRetry` | let | 40388 | литерал 0 | — | `connectLive`×2 |
| `liveClosedOnPurpose` | let | 40389 | литерал false | — | `connectLive`, `stmt036` |
| `lastConflict` | let | 40477 | литерал null | — | `showConflict`, `rebuildOverCurrent` |
| `noticeTimer` | let | 40500 | литерал null | — | `reportSubmit`×2 |
| `lastSubmitResult` | let | 40502 | литерал null | — | `reportSubmit` |
| `graphSelectionContext` | window-объявление | 40557 | объект (3) | — | — |
| `WEIGHT_OPTIONS` | const | 40625 | массив (3) | — | `generateConnectionEditContent` |
| `GROUNDING_TYPES` | const | 40708 | new Set | — | `groundingCyclePath`×2 |
| `PROVENANCE_STATES` | const | 41438 | массив (4) | — | `stateInWords`, `provenanceField` |
| `CONN_WEIGHT_WORDS` | const | 42133 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 42857 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 43566 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 43602 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 43918 | вызов document.getElementById() | — | `stmt077`×2 |
| `legendDirectionToggle` | const | 43920 | вызов document.getElementById() | — | `stmt078`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 23727 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 23733 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 23742 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 23748 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 23773 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 23809 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 23815 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | вызов | 23890 | 1 | `rebuildIndexes()` | `rebuildIndexes` |
| stmt009 | построение | 23978 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt010 | обработчик | 32289 | 7 | `document.addEventListener('click')` | `emit`, `isStatsModalOpen` |
| stmt011 | обработчик | 32298 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt012 | try | 32750 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt013 | обработчик | 34999 | 3 | `window.addEventListener('load')` | `saveOriginalRadii` |
| stmt014 | обработчик | 35394 | 15 | `document.addEventListener('click')` | — |
| stmt015 | обработчик | 35617 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt016 | вызов | 36877 | 37 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `pickNode`, `gfxZoom`, `dragstarted`, `dragended` |
| stmt017 | вызов | 36915 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt018 | вызов | 36986 | 1 | `installLayoutPull()` | `installLayoutPull` |
| stmt019 | условие | 36990 | 10 | `if (layoutFromStore) { simulation.stop(); layoutSettled = true; // СЧЁ…` | `requestDraw`, `layoutSettled`, `layoutFromStore`, `simulation` |
| stmt020 | обработчик | 37028 | 16 | `simulation.on('tick')` | `tickCount`×2, `simulation`×2, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `layoutSettled`, `maxTicks` |
| stmt021 | обработчик | 37056 | 1 | `simulation.on('end.settled')` | `layoutSettled`, `simulation` |
| stmt022 | обработчик | 37058 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `tickCount`, `simulation` |
| stmt023 | вызов | 37163 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt024 | обработчик | 37345 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `conceptById`, `labelWithAuthor`, `gfxNode` |
| stmt025 | обработчик | 37374 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `conceptById`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges` |
| stmt026 | построение | 37598 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt027 | обработчик | 37687 | 36 | `window.addEventListener('resize')` | `simulation`×5, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt028 | обработчик | 39188 | 5 | `window.addEventListener('beforeunload')` | `hasUnsavedEdits` |
| stmt029 | вызов | 39456 | 2 | `subscribe()` | `subscribe`, `showConflict` |
| stmt030 | обработчик | 39562 | 11 | `document.addEventListener('click')` | `banUserFromPanel`×2, `changeUserRoleFromPanel` |
| stmt031 | обработчик | 40050 | 12 | `document.addEventListener('click')` | `reviewCommitFromPanel`×2, `revertCommitFromPanel`, `showImpact` |
| stmt032 | вызов | 40168 | 1 | `subscribe()` | `subscribe`, `refreshUnread` |
| stmt033 | вызов | 40169 | 1 | `subscribe()` | `subscribe`, `refreshUnread`, `renderBell` |
| stmt034 | обработчик | 40174 | 7 | `document.addEventListener('click')` | `markNotificationRead` |
| stmt035 | вызов | 40207 | 1 | `subscribe()` | `subscribe`, `warnRemoteEdit` |
| stmt036 | обработчик | 40392 | 4 | `window.addEventListener('pagehide')` | `liveSocket`×2, `liveClosedOnPurpose` |
| stmt037 | обработчик | 42413 | 7 | `document.addEventListener('click')` | — |
| stmt038 | вызов | 43718 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt039 | вызов | 43719 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt040 | вызов | 43724 | 12 | `detectServerMode().then()` | `emit`, `renderAuthControls`, `refreshEditHints`, `detectServerMode`, `pullGraphSince`, `connectLive` |
| stmt041 | обработчик | 43758 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt042 | обработчик | 43766 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt043 | вызов | 43790 | 1 | `console.log()` | `nodes`, `links` |
| stmt044 | вызов | 43791 | 1 | `initFilters()` | `initFilters` |
| stmt045 | вызов | 43794 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt046 | вызов | 43799 | 1 | `subscribe()` | `subscribe`, `syncTraditionRows` |
| stmt047 | вызов | 43808 | 4 | `subscribe()` | `subscribe`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt048 | вызов | 43813 | 1 | `subscribe()` | `subscribe`, `updateFilterStats` |
| stmt049 | вызов | 43817 | 3 | `subscribe()` | `similarityOverlay`×2, `subscribe`, `clearSimilarityOverlay` |
| stmt050 | вызов | 43820 | 3 | `subscribe()` | `modalStack`×2, `subscribe` |
| stmt051 | вызов | 43823 | 6 | `subscribe()` | `subscribe`, `initFilters`, `makeLegendsEditable` |
| stmt052 | вызов | 43848 | 1 | `subscribe()` | `subscribe`, `updateGraphData` |
| stmt053 | вызов | 43849 | 1 | `subscribe()` | `subscribe`, `applyFiltersImmediate` |
| stmt054 | вызов | 43850 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt055 | вызов | 43857 | 4 | `subscribe()` | `subscribe`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt056 | вызов | 43861 | 1 | `subscribe()` | `subscribe`, `renderComparison` |
| stmt057 | вызов | 43862 | 1 | `subscribe()` | `subscribe`, `switchStatsView` |
| stmt058 | вызов | 43863 | 1 | `subscribe()` | `markChosenInLegend`, `subscribe` |
| stmt059 | вызов | 43864 | 6 | `subscribe()` | `pinnedDespiteFilter`, `resetBeyondFilter`, `subscribe` |
| stmt060 | вызов | 43871 | 1 | `setPainter()` | `setPainter`, `draw` |
| stmt061 | обработчик | 43873 | 4 | `document.addEventListener('mouseover')` | `showHint` |
| stmt062 | обработчик | 43877 | 4 | `document.addEventListener('mouseout')` | `hideHint` |
| stmt063 | обработчик | 43881 | 1 | `document.addEventListener('scroll')` | `hideHint` |
| stmt064 | обработчик | 43885 | 1 | `document.addEventListener('click')` | `hideHint` |
| stmt065 | вызов | 43886 | 1 | `subscribe()` | `subscribe`, `closeStatsModal` |
| stmt066 | вызов | 43887 | 1 | `subscribe()` | `subscribe`, `closeDetailModal` |
| stmt067 | вызов | 43889 | 1 | `subscribe()` | `subscribe`, `showDetailModal` |
| stmt068 | вызов | 43890 | 1 | `subscribe()` | `subscribe`, `openUniversalModal` |
| stmt069 | вызов | 43891 | 1 | `subscribe()` | `subscribe`, `openEditConceptModal` |
| stmt070 | вызов | 43892 | 1 | `subscribe()` | `subscribe`, `openEditConnectionModal` |
| stmt071 | вызов | 43894 | 3 | `subscribe()` | `currentStatsView`×2, `subscribe`, `isStatsModalOpen`, `loadStatsContent` |
| stmt072 | вызов | 43898 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt073 | вызов | 43900 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt074 | вызов | 43903 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt075 | вызов | 43906 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt076 | обработчик | 43909 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt077 | условие | 43919 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt078 | условие | 43921 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt079 | вызов | 43924 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt080 | условие | 43929 | 1 | `if (storedLayoutComplaint) showTemporaryMessage(storedLayoutComplaint,…` | `storedLayoutComplaint`×2, `showTemporaryMessage` |
| stmt081 | вызов | 43931 | 1 | `console.log()` | — |
| stmt082 | вызов | 43932 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt083 | обработчик | 43940 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt084 | обработчик | 43946 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt085 | условие | 43961 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt086 | вызов | 43965 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 25559 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 32289 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 32298 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt011` |
| 34999 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 35394 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 35513 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 35617 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt015` |
| 36867 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 36877 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 36877 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 36877 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt016` |
| 37028 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt020` |
| 37056 | `end.settled` | `simulation` | .on() | функция на месте | верхний уровень: `stmt021` |
| 37058 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt022` |
| 37150 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 37151 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 37152 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 37153 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 37160 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 37345 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt024` |
| 37345 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt024` |
| 37374 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 37374 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt025` |
| 37374 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt025` |
| 37687 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt027` |
| 38293 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 38374 | `keydown` | `field` | addEventListener | функция на месте | `startMfaEnroll` |
| 39188 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt028` |
| 39562 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 40050 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt031` |
| 40174 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt034` |
| 40362 | `message` | `socket` | addEventListener | функция на месте | `connectLive` |
| 40372 | `open` | `socket` | addEventListener | функция на месте | `connectLive` |
| 40377 | `close` | `socket` | addEventListener | функция на месте | `connectLive` |
| 40392 | `pagehide` | `window` | addEventListener | функция на месте | верхний уровень: `stmt036` |
| 42083 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 42084 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 42413 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt037` |
| 42551 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 43649 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 43679 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 43694 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 43758 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt041` |
| 43766 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt042` |
| 43873 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt061` |
| 43877 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt062` |
| 43881 | `scroll` | `document` | addEventListener | hideHint | верхний уровень: `stmt063` |
| 43885 | `click` | `document` | addEventListener | hideHint | верхний уровень: `stmt064` |
| 43909 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt076` |
| 43940 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt083` |
| 43946 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt084` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 27165 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 27178 | `installMetricScopeWrappers` | `window[name]` | запись |
| 34806 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 38178 | `modalContentFor` | `window[name]` | чтение |
| 38184 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| `openUniversalModal` | да | 0 | 24 | `onclick` | `conceptPlate`, `findAndShowPath`, `generateConceptEditContent`, `generateConceptViewContent`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent`, `linkArrow`, `philosopherTraditionsBlock`, `showAllConcepts`, `showConceptProfileModal`, `showPathDescriptionsModal`, `showPhilosopherProfileModal` |
| `renderClosestPairs` | да | 0 | 6 | `onchange`, `onclick`, `oninput` | `generateClosestPairsContent` |
| `setTimeout` | **НЕТ** | 0 | 6 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `closeUniversalModal` | да | 1 | 3 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `modalActions` |
| `closeConceptProfileModal` | да | 1 | 3 | `onclick` | `showConceptProfileModal` |
| `toggleSection` | да | 4 | 0 | `onclick` | — |
| `findConnection` | да | 0 | 4 | `onclick` | `findAndShowPath`, `generateConceptEditContent`, `linkArrow`, `showPathDescriptionsModal` |
| `escapeAttr` | да | 0 | 4 | `onclick` | `generatePhilosopherEditContent`, `layoutHistoryHtml`, `observationBar`, `renderObservations` |
| `highlightNodeById` | да | 0 | 4 | `onclick` | `generateConceptRankingsContent`, `generateDegreeContent`, `generateMetricResults`, `generateTemporalInfluenceContent` |
| `closeAuthModal` | да | 0 | 4 | `onclick` | `confirmMfaEnroll`, `openAuthModal`, `openSecurityModal`, `showAuthNotice` |
| `toggleSubsection` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `toggleConnectionDescription` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `setSearchKind` | да | 3 | 0 | `onclick` | — |
| `showCustomSelectDropdown` | да | 2 | 1 | `onfocus` | `generateComparisonContent` |
| `filterCustomSelect` | да | 2 | 1 | `oninput` | `generateComparisonContent` |
| `switchCommitTab` | да | 3 | 0 | `onclick` | — |
| `openConceptById` | да | 0 | 3 | `onclick` | `findAndShowPath`, `showPathDescriptionsModal`, `similarConceptsBlock` |
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
| `saveObservation` | да | 0 | 1 | `onclick` | `observationBar` |
| `pickObservation` | да | 0 | 1 | `onclick` | `renderObservations` |
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
| 1359 | `onmouseover` | (страница) | `this.style.background=…` |
| 4913 | `onclick` | (страница) | `closeUniversalModal()` |
| 4922 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 4927 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 4933 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 4941 | `onclick` | (страница) | `toggleLegendSearch()` |
| 4946 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 4948 | `onclick` | (страница) | `setSearchKind('concept')` |
| 4950 | `onclick` | (страница) | `setSearchKind('connection')` |
| 4959 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 4960 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 4961 | `onclick` | (страница) | `clearLegendSearch()` |
| 4971 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 4972 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 4973 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 4984 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 4985 | `onfocus` | (страница) | `openLegendLinkSearch('from')` |
| 4994 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 4995 | `onfocus` | (страница) | `openLegendLinkSearch('to')` |
| 5006 | `onclick` | (страница) | `openStatsModal()` |
| 5018 | `onclick` | (страница) | `resetBeyondFilter()` |
| 5030 | `onclick` | (страница) | `resetNodeSizes()` |
| 5037 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 5042 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 5043 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 5054 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 5085 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 5093 | `onclick` | (страница) | `toggleSection('relations')` |
| 5098 | `onclick` | (страница) | `selectAllRelations()` |
| 5099 | `onclick` | (страница) | `deselectAllRelations()` |
| 5120 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 5125 | `onclick` | (страница) | `selectAllRubrics()` |
| 5126 | `onclick` | (страница) | `deselectAllRubrics()` |
| 5133 | `onclick` | (страница) | `toggleSection('traditions')` |
| 5138 | `onclick` | (страница) | `selectAllTraditions()` |
| 5139 | `onclick` | (страница) | `deselectAllTraditions()` |
| 5160 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 5173 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 5174 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 5187 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 5188 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 5193 | `onclick` | (страница) | `findAndShowPath()` |
| 5236 | `onclick` | (страница) | `resetSimulation()` |
| 5237 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 5238 | `onclick` | (страница) | `centerGraph()` |
| 5239 | `onclick` | (страница) | `toggleGrouping()` |
| 5240 | `onclick` | (страница) | `downloadData()` |
| 5241 | `onclick` | (страница) | `saveToFolder()` |
| 5243 | `onclick` | (страница) | `exportToPNG()` |
| 5244 | `onclick` | (страница) | `exportToSVG()` |
| 5247 | `onclick` | (страница) | `openAboutModal()` |
| 5250 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 5252 | `onclick` | (страница) | `closeAboutModal()` |
| 5262 | `onclick` | (страница) | `closeUsersPanel()` |
| 5271 | `onclick` | (страница) | `switchCommitTab('mine')` |
| 5272 | `onclick` | (страница) | `switchCommitTab('pending')` |
| 5273 | `onclick` | (страница) | `switchCommitTab('layout')` |
| 5278 | `onclick` | (страница) | `closeCommitsPanel()` |
| 5286 | `onclick` | (страница) | `openCommitsPanel()` |
| 5287 | `onclick` | (страница) | `openUsersPanel()` |
| 5288 | `onclick` | (страница) | `toggleNotifyPanel()` |
| 5292 | `onclick` | (страница) | `markAllNotificationsRead()` |
| 5305 | `onclick` | (страница) | `rebuildOverCurrent()` |
| 5306 | `onclick` | (страница) | `closeConflictModal()` |
| 5334 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5340 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 5346 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 5352 | `onclick` | (страница) | `closeStatsModal()` |
| 5366 | `onclick` | (страница) | `switchStatsView('overview')` |
| 5370 | `onclick` | (страница) | `switchStatsView('observations')` |
| 5374 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 5378 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 5382 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 5386 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 5390 | `onclick` | (страница) | `switchStatsView('degree')` |
| 5394 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 5398 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 5402 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 5406 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 5410 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 5414 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 5418 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 5430 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 5434 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 5438 | `onclick` | (страница) | `switchStatsView('tension')` |
| 5450 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 5454 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 5466 | `onclick` | (страница) | `switchStatsView('influence')` |
| 5470 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 5482 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 5486 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 5498 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 5510 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 5514 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 5526 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 5530 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 5534 | `onclick` | (страница) | `switchStatsView('generative')` |
| 5538 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 5542 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 5546 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 5550 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5562 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5574 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5578 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5582 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5586 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5598 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5602 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 24488 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24522 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 24569 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 24573 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 24574 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 24675 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 24678 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 24845 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 24864 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${node.id}')` |
| 24867 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${node.concept}', 'view')` |
| 24904 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 25038 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 25161 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${end}', '${n.id}')` |
| 25209 | `onclick` | `showFoundLinks` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 26507 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 26523 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 26547 | `onchange` | `initFilters` | `toggleTradition('${id}')` |
| 26552 | `onclick` | `initFilters` | `onlyTradition('${id}')` |
| 26554 | `onclick` | `initFilters` | `resetTradition('${id}')` |
| 26570 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 29109 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 29117 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${influenceScope === 'within_ext' ? 'within' : 'within_ext'}')` |
| 32035 | `onclick` | `observationBar` | `saveObservation('${escapeAttr(viewName)}')` |
| 32157 | `onclick` | `renderObservations` | `pickObservation('${escapeAttr(z.observationId)}')` |
| 32369 | `onclick` | `linkArrow` | `openUniversalModal('connection', findConnection('${from}', '${to}', false), 'view')` |
| 32589 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 32817 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 32849 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 32854 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 32861 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 32911 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 32919 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 32926 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 33063 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 33667 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 33672 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 33761 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 33789 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 33820 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 33821 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 33826 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 33831 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 33835 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 33840 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 33924 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 33975 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 33976 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 34317 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 34506 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 34547 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 35332 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 35445 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 35558 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 36119 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','${k}')` |
| 36133 | `onclick` | `updateSimilarityLegend` | `setSimilarityLinks('${m}')` |
| 36149 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 37751 | `onclick` | `similarConceptsBlock` | `openConceptById('${x.id}')` |
| 37778 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','${mapKind}')` |
| 37937 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 37957 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 37966 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 37973 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 38070 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 38283 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 38284 | `onclick` | `openAuthModal` | `submitAuth()` |
| 38339 | `onclick` | `openSecurityModal` | `closeAuthModal()` |
| 38341 | `onclick` | `openSecurityModal` | `startMfaEnroll()` |
| 38369 | `onclick` | `startMfaEnroll` | `confirmMfaEnroll()` |
| 38399 | `onchange` | `confirmMfaEnroll` | `refreshSecurityDone()` |
| 38402 | `onclick` | `confirmMfaEnroll` | `closeAuthModal()` |
| 38443 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 38612 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 38613 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 38616 | `onclick` | `renderAuthControls` | `openSecurityModal()` |
| 38617 | `onclick` | `renderAuthControls` | `authLogout()` |
| 38691 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 38701 | `onclick` | `openUniversalModal` | `popModalState()` |
| 39814 | `onclick` | `layoutHistoryHtml` | `askLayoutRevert('${escapeAttr(String(л.id))}')` |
| 39837 | `onclick` | `layoutTabHtml` | `doLayoutRevert()` |
| 39838 | `onclick` | `layoutTabHtml` | `cancelLayoutRevert()` |
| 39845 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 39852 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 39865 | `onclick` | `layoutTabHtml` | `applyRelayout()` |
| 39866 | `onclick` | `layoutTabHtml` | `planRelayout()` |
| 40584 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 41460 | `onchange` | `provenanceField` | `refreshProvenanceField()` |
| 41545 | `onclick` | `modalActions` | `${saveFn}()` |
| 41548 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 41552 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 41600 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 41608 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 41612 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 41679 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 41682 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 41685 | `onclick` | `generatePhilosopherEditContent` | `deleteConcept('${c.id}')` |
| 41690 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 41801 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 41804 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 41807 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 41830 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 41948 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 41988 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 42051 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 42159 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 42163 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 42357 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 42380 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 42381 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 42478 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 42578 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 42579 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 42580 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 42587 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 42593 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 42596 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 42647 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 42657 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 42690 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 42695 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 42718 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 42748 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 42753 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 42801 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 42809 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 42956 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 43038 | `onclick` | `philosopherTraditionsBlock` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 43070 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 43117 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 43118 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 43119 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 43130 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 43286 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 43302 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 43318 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 43372 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 43380 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 43383 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 43438 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 43450 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 43469 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 43471 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 43474 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 43497 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 43516 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 43519 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 43523 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 28339 | 34 | — |
| `TENSION_WEIGHTS` | const | 29451 | 5 | — |
| `tensionScales` | function | 29460 | 23 | — |
| `searchNodes` | function | 35312 | 3 | — |
| `toggleSimilarityKind` | function | 36021 | 5 | — |
| `hasUnsaved` | function | 39137 | 1 | — |
| `graphSelectionContext` | window-объявление | 40557 | 1 | — |
| `generatePhilosopherEditContent` | function | 41587 | 117 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 41709 | 132 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 41926 | 97 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 42328 | 81 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 42564 | 266 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 43096 | 454 | вероятно цель `window[…]` в `modalContentFor` |


### 7.2. Имена из разметки без глобального определения

| Имя | Статич. | Динам. | Порождается в |
|---|---|---|---|
| `setTimeout` | 0 | 6 | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `String` | 0 | 1 | `layoutHistoryHtml` |


### 7.3. Необъявленные имена, используемые в скрипте

Обычные глобальные объекты браузера и `d3`; сюда же попадут опечатки.


| Имя | Обращений |
|---|---|
| `document` | 348 |
| `Math` | 143 |
| `Set` | 109 |
| `Object` | 72 |
| `Map` | 51 |
| `undefined` | 50 |
| `console` | 48 |
| `window` | 44 |
| `Array` | 39 |
| `setTimeout` | 38 |
| `String` | 36 |
| `d3` | 29 |
| `alert` | 24 |
| `Promise` | 18 |
| `Boolean` | 16 |
| `Number` | 13 |
| `Infinity` | 10 |
| `encodeURIComponent` | 10 |
| `clearTimeout` | 9 |
| `Date` | 8 |
| `URL` | 6 |
| `confirm` | 6 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `event` | 4 |
| `JSON` | 4 |
| `prompt` | 4 |
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
