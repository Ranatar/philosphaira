# Карта модульного дерева `philosophy_graph`

Составлена **по собранному дереву**, а не по одностраничному исходнику:
115 модулей, 18024 строк, 683 объявлений,
484 вывозов, 697 рёбер ввоза. Составлено 2026-08-20 18:24:06.

Зачем отдельно от карты глобальных сущностей. Та описывает единый файл — 746
сущностей в одной области видимости — и нужна разбивке: по ней считается
раскладка. Но у модульного дерева есть свойства, которых у единого файла нет
вовсе: кто у кого что ввозит, какие имена вывезены впустую, насколько плотно
модули лезут в общие пространства, есть ли круги. И эта карта переживёт
одностраничную версию, когда её отпустят.

## Что держит дом

Входящая степень — из скольких модулей ввозят этот.

| Модуль | Ввозят из него |
|---|---|
| `modules/core/ns.js` | 90 |
| `modules/core/graph-index.js` | 55 |
| `modules/core/link-facts.js` | 20 |
| `modules/render/canvas-core.js` | 19 |
| `modules/core/events.js` | 17 |
| `modules/state/render.js` | 14 |
| `modules/metrics/link-indexes.js` | 13 |
| `modules/render/selection.js` | 13 |
| `modules/render/d3-layer.js` | 12 |
| `modules/modal/core.js` | 11 |
| `modules/render/loop.js` | 11 |
| `modules/stats/results.js` | 10 |

## Самые востребованные имена

| Имя | В скольких модулях ввозится |
|---|---|
| `S` | 71 |
| `DATA` | 59 |
| `conceptById` | 22 |
| `MET` | 21 |
| `emit` | 15 |
| `initializePhilosophyMetrics` | 12 |
| `philosopherByName` | 11 |
| `renderState` | 10 |
| `isSymmetricLink` | 9 |
| `selectedNodes` | 9 |
| `requestDraw` | 9 |
| `isReflexiveLink` | 9 |
| `isNodeVisible` | 8 |
| `openUniversalModal` | 7 |
| `pickConcepts` | 7 |

## Общие пространства имён

| Пространство | Полей | Самое востребованное поле | В скольких модулях |
|---|---|---|---|
| `DATA` | 16 | `nodes` | 34 |
| `S` | 67 | `_concepts` | 15 |
| `MET` | 33 | `influenceIndex` | 7 |
| `VIEWS` | 6 | `generateConceptViewContent` | 1 |

## Круги в графе ввозов

Кругов нет.


## Вывоз впустую и мёртвые сущности

Различать обязательно. **Лишний вывоз** — имя вывезено, никем не ввозится,
но внутри своего модуля работает: разбивка вывозит все собственные имена
подряд, поэтому таких много (0), и это шум в списке вывоза,
а не мёртвый код. **Мёртвая сущность** — имя не помянуто нигде: ни снаружи, ни
внутри своего модуля. Таких сейчас **0**.

Отдельно считаются имена, которые держатся только приборами приёмки
(2): в дереве они выглядят мёртвыми, а на деле
их ввозят измерительные программы.

| Имя | Модуль |
|---|---|
| `hasUnsaved` | `modules/data/save.js` |
| `actionNames` | `modules/ui/actions.js` |

## Модули

| Модуль | Строк | Объявлений | Вывозит | Ввозит из | Пространства |
|---|---|---|---|---|---|
| `boot.js` | 228 | 0 | 1 | 57 | DATA:2, S:5 |
| `main.js` | 121 | 0 | 0 | 110 | — |
| `modules/boot-defs.js` | 62 | 3 | 2 | 8 | S:1 |
| `modules/core/base-cells.js` | 19 | 0 | 0 | 1 | S:8 |
| `modules/core/events.js` | 43 | 4 | 2 | 0 | — |
| `modules/core/graph-index.js` | 150 | 11 | 10 | 2 | DATA:16 |
| `modules/core/link-facts.js` | 48 | 7 | 7 | 2 | DATA:1, S:4 |
| `modules/core/long-task.js` | 120 | 3 | 3 | 0 | — |
| `modules/core/ns.js` | 33 | 2 | 4 | 0 | — |
| `modules/core/ready.js` | 15 | 0 | 2 | 0 | — |
| `modules/core/relation-types.js` | 59 | 6 | 4 | 2 | DATA:2 |
| `modules/core/search.js` | 68 | 4 | 4 | 3 | DATA:3 |
| `modules/core/session.js` | 14 | 4 | 4 | 0 | — |
| `modules/core/time.js` | 13 | 2 | 2 | 0 | — |
| `modules/core/visibility.js` | 13 | 2 | 2 | 1 | S:2 |
| `modules/data/load.js` | 9 | 0 | 1 | 1 | — |
| `modules/data/mutate.js` | 89 | 3 | 1 | 6 | DATA:11, S:1 |
| `modules/data/save.js` | 72 | 10 | 7 | 1 | DATA:6 |
| `modules/dead.js` | 86 | 6 | 6 | 5 | DATA:1, S:5, MET:1 |
| `modules/filters/beyond-filter.js` | 21 | 2 | 2 | 2 | — |
| `modules/filters/chains.js` | 273 | 6 | 3 | 4 | DATA:3, S:2 |
| `modules/filters/filters.js` | 454 | 14 | 3 | 13 | DATA:4, S:8 |
| `modules/graph/click-actions.js` | 201 | 8 | 2 | 8 | S:1 |
| `modules/graph/graph-data.js` | 118 | 10 | 10 | 10 | DATA:2, S:6 |
| `modules/graph/graph-selection.js` | 55 | 3 | 3 | 3 | S:1 |
| `modules/metrics/by-link-type.js` | 116 | 6 | 3 | 2 | S:3, MET:4 |
| `modules/metrics/concept-dynamics.js` | 224 | 8 | 4 | 2 | S:4, MET:4 |
| `modules/metrics/descriptions.js` | 478 | 2 | 1 | 3 | S:3 |
| `modules/metrics/format.js` | 32 | 4 | 2 | 2 | S:3 |
| `modules/metrics/generativity.js` | 110 | 8 | 3 | 1 | S:6, MET:1 |
| `modules/metrics/graph-cache.js` | 117 | 3 | 2 | 3 | S:3 |
| `modules/metrics/link-indexes.js` | 122 | 4 | 1 | 5 | DATA:3, S:9 |
| `modules/metrics/network.js` | 871 | 25 | 18 | 4 | DATA:1, S:8, MET:9 |
| `modules/metrics/philosopher.js` | 308 | 13 | 6 | 2 | S:5, MET:9 |
| `modules/metrics/philosophical.js` | 1039 | 23 | 13 | 4 | DATA:1, S:6, MET:10 |
| `modules/metrics/rankings.js` | 141 | 5 | 4 | 3 | S:4, MET:9 |
| `modules/metrics/scope-reset.js` | 64 | 3 | 1 | 12 | S:2 |
| `modules/metrics/scope-select.js` | 99 | 6 | 6 | 2 | DATA:2, S:5 |
| `modules/metrics/scope.js` | 135 | 7 | 6 | 8 | DATA:2, S:6 |
| `modules/metrics/similarity-concepts.js` | 243 | 15 | 10 | 3 | S:4, MET:17 |
| `modules/metrics/similarity-philosophers.js` | 166 | 11 | 7 | 2 | S:3, MET:3 |
| `modules/metrics/tension-cache.js` | 13 | 1 | 1 | 1 | S:2 |
| `modules/metrics/tradition-bridging.js` | 89 | 4 | 3 | 2 | S:4, MET:1 |
| `modules/modal/assembly.js` | 54 | 3 | 3 | 1 | — |
| `modules/modal/auth.js` | 162 | 10 | 4 | 4 | — |
| `modules/modal/concept-view.js` | 336 | 1 | 0 | 7 | DATA:5, VIEWS:1 |
| `modules/modal/connection-edit.js` | 284 | 9 | 5 | 12 | DATA:2, VIEWS:1 |
| `modules/modal/connection-view.js` | 415 | 11 | 5 | 10 | DATA:5, VIEWS:1 |
| `modules/modal/context.js` | 11 | 1 | 1 | 0 | — |
| `modules/modal/core.js` | 154 | 7 | 5 | 9 | S:1 |
| `modules/modal/descriptions.js` | 162 | 10 | 6 | 0 | — |
| `modules/modal/dirty.js` | 112 | 5 | 1 | 5 | DATA:2 |
| `modules/modal/edit-forms.js` | 288 | 2 | 2 | 11 | DATA:5, VIEWS:2 |
| `modules/modal/edit-rights.js` | 53 | 3 | 3 | 3 | — |
| `modules/modal/entry.js` | 124 | 12 | 12 | 11 | DATA:3, S:2 |
| `modules/modal/integrity.js` | 254 | 10 | 6 | 7 | DATA:4 |
| `modules/modal/persist.js` | 363 | 10 | 6 | 11 | DATA:9, S:1 |
| `modules/modal/philosopher-view.js` | 621 | 4 | 1 | 12 | DATA:6, VIEWS:1 |
| `modules/modal/profile-concept.js` | 182 | 8 | 4 | 8 | DATA:4, S:3, MET:19 |
| `modules/modal/profile-philosopher.js` | 121 | 2 | 2 | 8 | DATA:3, S:3, MET:3 |
| `modules/modal/search.js` | 43 | 3 | 3 | 1 | — |
| `modules/paths/analysis.js` | 74 | 2 | 2 | 7 | DATA:2 |
| `modules/paths/chronology.js` | 175 | 10 | 6 | 4 | DATA:1, S:1 |
| `modules/paths/path-descriptions.js` | 179 | 4 | 3 | 8 | DATA:2, S:2 |
| `modules/paths/path-ui.js` | 416 | 8 | 5 | 9 | DATA:4, S:7 |
| `modules/paths/shortest-path.js` | 203 | 4 | 1 | 5 | DATA:2, S:4 |
| `modules/render/canvas-core.js` | 45 | 9 | 9 | 3 | S:3 |
| `modules/render/d3-layer.js` | 105 | 11 | 9 | 6 | DATA:2, S:3 |
| `modules/render/draw-link.js` | 101 | 6 | 6 | 6 | S:1 |
| `modules/render/geometry.js` | 95 | 6 | 6 | 3 | DATA:1, S:2 |
| `modules/render/grouping.js` | 103 | 7 | 3 | 6 | DATA:1, S:7 |
| `modules/render/interactions.js` | 308 | 8 | 4 | 19 | DATA:1, S:4 |
| `modules/render/loop.js` | 20 | 4 | 2 | 0 | — |
| `modules/render/metric-visualization.js` | 371 | 10 | 3 | 5 | DATA:4, S:3 |
| `modules/render/picking.js` | 79 | 6 | 4 | 8 | DATA:2, S:1 |
| `modules/render/render-state.js` | 17 | 6 | 6 | 1 | — |
| `modules/render/scene.js` | 340 | 18 | 7 | 14 | DATA:4, S:5 |
| `modules/render/selection.js` | 261 | 8 | 7 | 11 | DATA:2, S:2 |
| `modules/render/similarity-overlay.js` | 219 | 10 | 5 | 8 | DATA:4, S:1 |
| `modules/render/simulation.js` | 126 | 11 | 8 | 10 | DATA:2, S:3 |
| `modules/render/tooltip-el.js` | 7 | 1 | 1 | 1 | — |
| `modules/state/edit.js` | 12 | 1 | 1 | 0 | — |
| `modules/state/filters.js` | 22 | 3 | 3 | 2 | DATA:4, S:5 |
| `modules/state/metrics-scope.js` | 13 | 0 | 0 | 1 | S:5 |
| `modules/state/paths.js` | 18 | 0 | 0 | 2 | S:7 |
| `modules/state/render.js` | 38 | 3 | 3 | 3 | DATA:2, S:10 |
| `modules/state/stats.js` | 33 | 0 | 0 | 1 | S:15 |
| `modules/stats/coverage.js` | 66 | 3 | 3 | 6 | S:3, MET:19 |
| `modules/stats/modal.js` | 238 | 8 | 8 | 16 | DATA:2, S:9 |
| `modules/stats/results.js` | 414 | 11 | 8 | 4 | S:3 |
| `modules/stats/run.js` | 128 | 4 | 1 | 3 | S:1, MET:6 |
| `modules/stats/views/advanced.js` | 275 | 10 | 10 | 4 | DATA:3, MET:10 |
| `modules/stats/views/comparison.js` | 428 | 10 | 10 | 10 | DATA:4, S:11 |
| `modules/stats/views/network.js` | 223 | 9 | 9 | 4 | DATA:2, S:2, MET:1 |
| `modules/stats/views/philosopher.js` | 171 | 4 | 4 | 6 | DATA:3, MET:3 |
| `modules/stats/views/philosophical.js` | 473 | 12 | 12 | 7 | DATA:3, S:2, MET:10 |
| `modules/stats/views/rankings.js` | 141 | 2 | 2 | 5 | DATA:2, S:1 |
| `modules/ui/about.js` | 102 | 4 | 3 | 1 | DATA:6 |
| `modules/ui/actions-byname.js` | 20 | 2 | 0 | 2 | — |
| `modules/ui/actions-dyn.js` | 148 | 0 | 0 | 31 | DATA:1, S:9 |
| `modules/ui/actions-static.js` | 121 | 0 | 0 | 21 | — |
| `modules/ui/actions.js` | 27 | 1 | 3 | 0 | — |
| `modules/ui/delegation.js` | 70 | 3 | 1 | 1 | — |
| `modules/ui/export.js` | 126 | 2 | 2 | 11 | DATA:4, S:2 |
| `modules/ui/hint.js` | 60 | 7 | 4 | 1 | S:1 |
| `modules/ui/legend.js` | 317 | 27 | 23 | 7 | DATA:7, S:10 |
| `modules/ui/panels.js` | 40 | 2 | 2 | 0 | — |
| `modules/ui/search-legend.js` | 141 | 7 | 6 | 17 | S:2 |
| `modules/ui/search-link.js` | 118 | 6 | 4 | 10 | DATA:3, S:2 |
| `modules/ui/search-philosopher.js` | 98 | 7 | 6 | 5 | DATA:3 |
| `modules/util/color.js` | 23 | 1 | 1 | 0 | — |
| `modules/util/html.js` | 9 | 1 | 1 | 0 | — |
| `modules/util/philosopher-label.js` | 40 | 7 | 5 | 3 | DATA:1 |
| `modules/util/ru.js` | 49 | 3 | 3 | 0 | — |
| `modules/widgets/custom-select.js` | 88 | 5 | 4 | 4 | S:4 |

## Состав модулей

Что в модуле ОБЪЯВЛЕНО. В JSON это лежало с самого начала (поле `свои`),
но в читаемый вид не выводилось — упущение, а не замысел: состав и есть
самое нужное, когда ищешь, где живёт сущность.


### `modules/boot-defs.js` — 62 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `installModalKeys` | function | 24 | да |
| `closeAllModals` | function | 13 | — |
| `installOverlayDismiss` | function | 8 | да |

### `modules/core/events.js` — 43 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `emit` | function | 10 | да |
| `subscribe` | function | 8 | да |
| `BUS_EVENTS` | const | 1 | — |
| `busSubscribers` | const | 1 | — |

### `modules/core/graph-index.js` — 150 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildIndexes` | function | 65 | — |
| `rebuildIndexes` | function | 37 | да |
| `buildRubricsIndex` | function | 8 | да |
| `buildConceptToRubrics` | function | 5 | да |
| `buildPhilosopherTraditions` | function | 3 | да |
| `conceptById` | const | 1 | да |
| `philosopherByName` | const | 1 | да |
| `traditionById` | const | 1 | да |
| `rubricById` | const | 1 | да |
| `nodesByPhilosopher` | const | 1 | да |
| `linksByConcept` | const | 1 | да |

### `modules/core/link-facts.js` — 48 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildReflexiveMap` | function | 9 | да |
| `isSymmetricLink` | function | 6 | да |
| `isReflexiveLink` | function | 5 | да |
| `isTypologicalLink` | function | 4 | да |
| `reflexiveLinkOf` | function | 4 | да |
| `otherPhilosopher` | function | 4 | да |
| `sumWeight` | function | 3 | да |

### `modules/core/long-task.js` — 120 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showTemporaryMessage` | function | 29 | да |
| `LoadingIndicator` | const | 1 | да |
| `CHAIN_SEARCH` | const | 1 | да |

### `modules/core/ns.js` — 33 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `FILES` | const | 1 | — |
| `loaded` | const | 1 | — |

### `modules/core/relation-types.js` — 59 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `relationHint` | function | 11 | да |
| `RELATION_HINTS` | const | 1 | — |
| `LAYER_NAMES` | const | 1 | — |
| `WEIGHT_WORDS` | const | 1 | да |
| `WEIGHT_OPTIONS` | const | 1 | да |
| `CONN_WEIGHT_WORDS` | const | 1 | да |

### `modules/core/search.js` — 68 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `displaySearchResults` | function | 23 | да |
| `pickConcepts` | function | 20 | да |
| `rowInner` | function | 11 | да |
| `emptyList` | function | 3 | да |

### `modules/core/session.js` — 14 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `canEdit` | function | 3 | да |
| `AUTH_ADMIN` | const | 1 | да |
| `authAccounts` | const | 1 | да |
| `authSession` | let | 1 | да |

### `modules/core/time.js` — 13 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `CHRONOLOGY_MODES` | const | 1 | да |
| `MATURITY_AGE` | const | 1 | да |

### `modules/core/visibility.js` — 13 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `isNodeVisible` | function | 1 | да |
| `isLinkVisible` | function | 1 | да |

### `modules/data/mutate.js` — 89 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `rebuildDerivedIndexes` | function | 36 | — |
| `afterDataChange` | function | 36 | да |
| `rebuildPhilosopherTraditions` | function | 4 | — |

### `modules/data/save.js` — 72 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `saveToFolder` | async function | 23 | да |
| `deliverFile` | function | 11 | — |
| `installUnsavedGuard` | function | 7 | да |
| `downloadData` | function | 6 | да |
| `collectData` | function | 3 | да |
| `DATA_SETS` | const | 1 | да |
| `hasUnsavedEdits` | let | 1 | — |
| `markDirty` | function | 1 | да |
| `hasUnsaved` | function | 1 | да |
| `dataFolder` | let | 1 | — |

### `modules/dead.js` — 86 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findConnectedComponents` | function | 34 | да |
| `tensionScales` | function | 23 | да |
| `toggleSimilarityKind` | function | 5 | да |
| `searchNodes` | function | 3 | да |
| `TENSION_WEIGHTS` | const | 1 | да |
| `graphSelectionContext` | let | 1 | да |

### `modules/filters/beyond-filter.js` — 21 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updateFilterNote` | function | 7 | да |
| `resetBeyondFilter` | function | 6 | да |

### `modules/filters/chains.js` — 273 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `processBFS` | function | 125 | — |
| `findChainsThroughAllPhilosophers` | async function | 45 | да |
| `findUniquePhilosopherChains` | async function | 44 | да |
| `buildAdjacencyGraph` | function | 35 | — |
| `confirmLongChainSearch` | function | 9 | да |
| `CHAIN_WARN_THRESHOLD` | const | 1 | — |

### `modules/filters/filters.js` — 454 строк, объявлений 14

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handleUniqueChainsMode` | async function | 65 | — |
| `handleChainsMode` | async function | 59 | — |
| `applyBasicFilter` | function | 52 | — |
| `applyFiltersImmediate` | function | 21 | да |
| `cleanupInvisibleSelections` | function | 14 | — |
| `debounce` | function | 11 | — |
| `applyChainVisibility` | function | 7 | — |
| `refreshMetricsIfScoped` | function | 7 | — |
| `philosopherPassesTraditions` | function | 5 | да |
| `linkPassesTraditions` | function | 5 | — |
| `philTraditionsSelected` | function | 4 | — |
| `FilterModes` | const | 1 | — |
| `debouncedApplyFilters` | const | 1 | — |
| `applyFilters` | function | 1 | да |

### `modules/graph/click-actions.js` — 201 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handleNodeClick` | function | 116 | да |
| `handleLinkSelect` | function | 32 | — |
| `handleLinkClick` | function | 28 | да |
| `clickTimer` | let | 1 | — |
| `clickCount` | let | 1 | — |
| `lastClickedNode` | let | 1 | — |
| `linkClickTimer` | let | 1 | — |
| `linkClickCount` | let | 1 | — |

### `modules/graph/graph-data.js` — 118 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `forgetNode` | function | 18 | да |
| `addNodeToGraph` | function | 15 | да |
| `addLinkToGraph` | function | 11 | да |
| `findConnection` | function | 9 | да |
| `getConceptConnections` | function | 8 | да |
| `updateLinkOnGraph` | function | 8 | да |
| `forgetLink` | function | 8 | да |
| `connectionsBetween` | function | 8 | да |
| `traditionsOfPhilosopher` | function | 5 | да |
| `updateNodeOnGraph` | function | 4 | да |

### `modules/graph/graph-selection.js` — 55 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectConceptOnGraph` | function | 28 | да |
| `cancelGraphSelection` | function | 11 | да |
| `handleConceptSelection` | function | 6 | да |

### `modules/metrics/by-link-type.js` — 116 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateInstrumentalIndexCache` | function | 3 | да |
| `invalidateAbstractionIndexCache` | function | 3 | да |
| `invalidateDeductiveIndexCache` | function | 3 | да |
| `instrumentalIndexCache` | let | 1 | — |
| `abstractionIndexCache` | let | 1 | — |
| `deductiveIndexCache` | let | 1 | — |

### `modules/metrics/concept-dynamics.js` — 224 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTransformationIndexCache` | function | 3 | да |
| `invalidateConceptualFertilityIndexCache` | function | 3 | да |
| `invalidateConceptualComplexityIndexCache` | function | 3 | да |
| `invalidateConceptualContinuityIndexCache` | function | 3 | да |
| `transformationIndexCache` | let | 1 | — |
| `conceptualFertilityIndexCache` | let | 1 | — |
| `conceptualComplexityIndexCache` | let | 1 | — |
| `conceptualContinuityIndexCache` | let | 1 | — |

### `modules/metrics/descriptions.js` — 478 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `getMetricDescription` | function | 12 | да |
| `metricDescriptions` | const | 1 | — |

### `modules/metrics/format.js` — 32 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `conceptDegreeForNorm` | function | 8 | — |
| `applyMetricMode` | function | 5 | да |
| `toggleMetricValueMode` | function | 5 | да |
| `normalizeMetricValue` | function | 4 | — |

### `modules/metrics/generativity.js` — 110 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generativityScores` | function | 48 | — |
| `linkInInfluenceScope` | function | 10 | да |
| `sameTraditionPhil` | function | 6 | — |
| `generativity` | function | 3 | да |
| `invalidateGenerativityCache` | function | 3 | да |
| `GENERATIVITY_DAMPING` | const | 1 | — |
| `GENERATIVITY_ITERATIONS` | const | 1 | — |
| `_generativityCacheByScope` | let | 1 | — |

### `modules/metrics/graph-cache.js` — 117 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildGlobalGraphCache` | function | 105 | да |
| `graphCache` | let | 1 | — |
| `invalidateGraphCache` | function | 1 | да |

### `modules/metrics/link-indexes.js` — 122 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initializePhilosophyMetrics` | function | 68 | да |
| `buildOutgoingLinks` | function | 17 | — |
| `buildIncomingLinks` | function | 14 | — |
| `initializeMetricsData` | function | 10 | — |

### `modules/metrics/network.js` — 871 строк, объявлений 25

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `calculateBetweennessAsync` | async function | 152 | да |
| `dijkstraFromSource` | function | 47 | — |
| `bfsFromSource` | function | 41 | — |
| `medianNodeDegree` | function | 12 | да |
| `nodeDegreeOf` | function | 7 | да |
| `invalidateBetweennessCache` | function | 4 | да |
| `invalidatePageRankCache` | function | 4 | да |
| `invalidateClosenessCache` | function | 4 | да |
| `invalidateEigenvectorCache` | function | 4 | да |
| `invalidateClusteringCache` | function | 3 | да |
| `invalidateWeightedClusteringCache` | function | 3 | да |
| `invalidateLocalCohesionCache` | function | 3 | да |
| `invalidateRichClubCache` | function | 3 | да |
| `betweennessCache` | let | 1 | да |
| `betweennessCalculating` | let | 1 | — |
| `pageRankCache` | let | 1 | да |
| `pageRankCalculating` | let | 1 | — |
| `closenessCache` | let | 1 | да |
| `closenessCalculating` | let | 1 | — |
| `clusteringCache` | let | 1 | — |
| `weightedClusteringCache` | let | 1 | да |
| `localCohesionCache` | let | 1 | да |
| `richClubCache` | let | 1 | да |
| `eigenvectorCache` | let | 1 | да |
| `eigenvectorCalculating` | let | 1 | — |

### `modules/metrics/philosopher.js` — 308 строк, объявлений 13

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `philosopherProfile` | function | 42 | да |
| `invalidatePhilosopherProfileCache` | function | 3 | да |
| `invalidatePhilosopherSystematicIndexCache` | function | 3 | да |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 3 | да |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 3 | да |
| `invalidateTemporalInfluencePatternCache` | function | 3 | да |
| `CONSTRUCTIVE_TYPES` | const | 1 | — |
| `POLEMICAL_TYPES` | const | 1 | — |
| `philosopherProfileCache` | let | 1 | — |
| `philosopherSystematicIndexCache` | let | 1 | — |
| `philosopherHistoricalReachIndexCache` | let | 1 | — |
| `philosopherInterdisciplinaryIndexCache` | let | 1 | — |
| `temporalInfluencePatternCache` | let | 1 | — |

### `modules/metrics/philosophical.js` — 1039 строк, объявлений 23

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateProblemGenerationIndexCache` | function | 3 | да |
| `invalidateCriticalPowerIndexCache` | function | 3 | да |
| `invalidateRevolutionaryIndexCache` | function | 3 | да |
| `invalidateParadigmShiftIndexCache` | function | 3 | да |
| `invalidateInfluenceIndexCache` | function | 3 | да |
| `invalidateFoundationalIndexCache` | function | 3 | да |
| `invalidateSyntheticIndexCache` | function | 3 | да |
| `invalidateDialogicalIndexCache` | function | 3 | да |
| `invalidateInternalCoherenceIndexCache` | function | 3 | да |
| `invalidateTensionIndexCache` | function | 3 | да |
| `problemGenerationIndexCache` | let | 1 | — |
| `criticalPowerIndexCache` | let | 1 | — |
| `revolutionaryIndexCache` | let | 1 | — |
| `paradigmShiftIndexCache` | let | 1 | — |
| `influenceIndexCache` | let | 1 | — |
| `foundationalIndexCache` | let | 1 | — |
| `SYSTEMATIC_TYPES` | const | 1 | да |
| `DISRUPTIVE_TYPES` | const | 1 | да |
| `syntheticIndexCache` | let | 1 | — |
| `dialogicalIndexCache` | let | 1 | — |
| `internalCoherenceIndexCache` | let | 1 | — |
| `tensionIndexCache` | let | 1 | — |
| `INFLUENCE_SCOPE_LABELS` | const | 1 | да |

### `modules/metrics/rankings.js` — 141 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generatePhilosopherRankings` | function | 89 | да |
| `generateRankings` | function | 31 | да |
| `invalidateGenerateRankingsCache` | function | 3 | да |
| `invalidateGeneratePhilosopherRankingsCache` | function | 3 | да |
| `generatePhilosopherRankingsCache` | let | 1 | — |

### `modules/metrics/scope-reset.js` — 64 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateAllMetricsCaches` | function | 30 | — |
| `invalidateEverythingForScope` | function | 14 | да |
| `invalidateMetricCoverageCache` | function | 1 | — |

### `modules/metrics/scope-select.js` — 99 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `transformForScope` | function | 9 | да |
| `effectiveScopeFlags` | function | 8 | да |
| `metricsLinks` | function | 1 | да |
| `metricsNodes` | function | 1 | да |
| `METRIC_FLAGS` | const | 1 | да |
| `VIEW_METRIC` | const | 1 | да |

### `modules/metrics/scope.js` — 135 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updateScopeToggles` | function | 33 | да |
| `applyMetricsScope` | function | 30 | да |
| `installMetricScopeWrappers` | function | 18 | да |
| `metricsScopeCounts` | function | 10 | да |
| `metricScopeFactor` | function | 9 | — |
| `handleMetricsScopeChange` | function | 8 | да |
| `updateMetricsScopeHint` | function | 6 | да |

### `modules/metrics/similarity-concepts.js` — 243 строк, объявлений 15

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `allConceptPairsAsync` | async function | 55 | да |
| `nearestConcepts` | function | 51 | да |
| `similarityData` | function | 48 | да |
| `structuralSimilarity` | function | 22 | да |
| `neighborSets` | function | 12 | — |
| `profileSimilarity` | function | 9 | да |
| `typeProfileOf` | function | 7 | — |
| `invalidateSimilarityCache` | function | 6 | да |
| `profileIsMeaningful` | function | 3 | да |
| `allConceptPairs` | function | 3 | да |
| `_simCache` | let | 1 | да |
| `_pairCache` | let | 1 | — |
| `_pairCalculating` | let | 1 | да |
| `PAIRS_CHUNK_ROWS` | const | 1 | — |
| `_neighborCache` | let | 1 | — |

### `modules/metrics/similarity-philosophers.js` — 166 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `philosopherSimilarityData` | function | 90 | да |
| `philosopherSimilarity` | function | 20 | да |
| `nearestPhilosophers` | function | 12 | да |
| `rubricUnionSize` | function | 5 | — |
| `cosineOf` | function | 5 | — |
| `SIM_METRIC_LABELS` | const | 1 | да |
| `PHIL_SIM_MIN_CONCEPTS` | const | 1 | — |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 1 | да |
| `_philSimCache` | let | 1 | — |
| `invalidatePhilosopherSimilarityCache` | function | 1 | да |
| `PHIL_SIM_LABELS` | const | 1 | да |

### `modules/metrics/tension-cache.js` — 13 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTensionScales` | function | 3 | да |

### `modules/metrics/tradition-bridging.js` — 89 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTraditionBridgingCache` | function | 3 | да |
| `BRIDGING_MIN_EXTERNAL` | const | 1 | да |
| `BRIDGING_WEIGHT_REF` | const | 1 | да |
| `traditionBridgingCache` | let | 1 | — |

### `modules/modal/assembly.js` — 54 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `modalContentFor` | function | 18 | да |
| `modalActions` | function | 15 | да |
| `modalEntityExists` | function | 13 | да |

### `modules/modal/auth.js` — 162 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `submitAuth` | function | 42 | да |
| `openAuthModal` | function | 29 | да |
| `authLogout` | function | 24 | да |
| `showAuthNotice` | function | 14 | — |
| `authNoticeAdmin` | function | 13 | — |
| `closeAuthModal` | function | 10 | да |
| `authNoticeMember` | function | 6 | — |
| `authError` | function | 4 | — |
| `authModalKind` | let | 1 | — |
| `authModalEl` | function | 1 | — |

### `modules/modal/concept-view.js` — 336 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `similarConceptsBlock` | function | 58 | — |

### `modules/modal/connection-edit.js` — 284 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `onConnTypeChange` | function | 37 | да |
| `handleConnectionEditSearch` | function | 29 | — |
| `updateConnEditPairNote` | function | 25 | — |
| `swapConnectionConcepts` | function | 20 | да |
| `selectConnectionEditConcept` | function | 18 | да |
| `setupConnectionEditSearchHandlers` | function | 13 | — |
| `connEditSelectedBlock` | function | 9 | — |
| `createNewConnectionForConcept` | function | 7 | да |
| `createNewConceptForPhilosopher` | function | 3 | да |

### `modules/modal/connection-view.js` — 415 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateConnectionVisualization` | function | 75 | — |
| `connectionArrowSvg` | function | 60 | — |
| `handleConnectionViewSearch` | function | 42 | да |
| `selectConnectionViewConcept` | function | 33 | да |
| `linkArrow` | function | 18 | да |
| `updateConnectionVisualization` | function | 18 | — |
| `initConnectionSearchFields` | function | 18 | да |
| `conceptPlate` | function | 16 | — |
| `connectionTraditionNote` | function | 13 | — |
| `toggleConnectionSearchSection` | function | 8 | да |
| `conceptCircle` | function | 6 | — |

### `modules/modal/context.js` — 11 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ModalContext` | const | 1 | да |

### `modules/modal/core.js` — 154 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `openUniversalModal` | function | 64 | да |
| `closeUniversalModal` | function | 27 | да |
| `toggleModalMode` | function | 17 | да |
| `pushModalState` | function | 14 | — |
| `popModalState` | function | 10 | да |
| `modalStack` | const | 1 | да |
| `MODAL_STACK_MAX` | const | 1 | — |

### `modules/modal/descriptions.js` — 162 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleAllConnectionDescriptions` | function | 37 | да |
| `toggleAllPhilosopherConceptDescriptions` | function | 32 | да |
| `toggleAllPhilosopherConnectionDescriptions` | function | 31 | да |
| `toggleSubsection` | function | 14 | да |
| `toggleConnectionDescription` | function | 12 | да |
| `togglePhilosopherConceptDescription` | function | 12 | да |
| `toggleAllRoot` | function | 7 | — |
| `allDescriptionsExpanded` | let | 1 | — |
| `allPhilosopherConceptDescriptionsExpanded` | let | 1 | — |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 1 | — |

### `modules/modal/dirty.js` — 112 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `hasConnectionChanges` | function | 27 | — |
| `hasPhilosopherChanges` | function | 22 | — |
| `hasUnsavedChanges` | function | 20 | да |
| `hasConceptChanges` | function | 19 | — |
| `hasFilledFields` | function | 10 | — |

### `modules/modal/edit-forms.js` — 288 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updatePhilColorSample` | function | 17 | да |
| `syncPhilColorFromPicker` | function | 6 | да |

### `modules/modal/edit-rights.js` — 53 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderAuthControls` | function | 18 | да |
| `refreshEditHints` | function | 15 | да |
| `refreshOpenModalToolbar` | function | 9 | да |

### `modules/modal/entry.js` — 124 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showAllConcepts` | function | 28 | да |
| `gotoNodeFromModal` | function | 23 | да |
| `getIsolatedConceptsAfterDeletion` | function | 15 | да |
| `openEditConceptModal` | function | 6 | да |
| `openEditConnectionModal` | function | 6 | да |
| `openConceptById` | function | 4 | да |
| `openEditPhilosopherModal` | function | 4 | да |
| `isConceptIsolated` | function | 3 | да |
| `showDetailModal` | function | 3 | да |
| `showPhilosopherDetailModal` | function | 3 | да |
| `closeDetailModal` | function | 1 | да |
| `closePhilosopherDetailModal` | function | 1 | да |

### `modules/modal/integrity.js` — 254 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `connectionIntegrityWarnings` | function | 138 | да |
| `groundingCyclePath` | function | 37 | — |
| `conceptIntegrityWarnings` | function | 18 | да |
| `philosopherIntegrityWarnings` | function | 16 | да |
| `activityOverlap` | function | 12 | — |
| `relationIndexOf` | function | 4 | да |
| `GROUNDING_TYPES` | const | 1 | — |
| `nConcepts` | const | 1 | да |
| `nLinks` | const | 1 | да |
| `labelOf` | const | 1 | — |

### `modules/modal/persist.js` — 363 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `savePhilosopherData` | function | 84 | да |
| `saveConnectionData` | function | 71 | да |
| `saveConceptData` | function | 57 | да |
| `deleteConnection` | function | 45 | да |
| `deletePhilosopher` | function | 37 | да |
| `deleteConcept` | function | 19 | да |
| `removeLinkEverywhere` | function | 9 | — |
| `removeConceptEverywhere` | function | 8 | — |
| `confirmWarnings` | function | 5 | — |
| `generateId` | function | 3 | — |

### `modules/modal/philosopher-view.js` — 621 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `makeLegendsEditable` | function | 71 | да |
| `philosopherTraditionsBlock` | function | 37 | — |
| `similarPhilosophersBlock` | function | 31 | — |
| `DATA_traditions_of` | function | 4 | — |

### `modules/modal/profile-concept.js` — 182 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showConceptProfileModal` | function | 74 | да |
| `metricPartsText` | function | 16 | — |
| `metricRank` | function | 15 | — |
| `metricPercentile` | function | 11 | — |
| `conceptDegreesDetailed` | function | 11 | — |
| `closeConceptProfileModal` | function | 8 | да |
| `toggleProfileOrder` | function | 4 | да |
| `PROFILE_METRICS` | const | 1 | да |

### `modules/modal/profile-philosopher.js` — 121 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showPhilosopherProfileModal` | function | 98 | да |
| `closePhilosopherProfileModal` | function | 8 | да |

### `modules/modal/search.js` — 43 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `clearModalSearch` | function | 16 | да |
| `handleModalSearch` | function | 9 | да |
| `installModalSearchDismiss` | function | 9 | да |

### `modules/paths/analysis.js` — 74 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `analyzePath` | function | 40 | да |
| `analyzePathTraditions` | function | 21 | да |

### `modules/paths/chronology.js` — 175 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `isChronologicallyValid` | function | 55 | да |
| `strictChronologyCheck` | function | 50 | — |
| `installChronologyMode` | function | 15 | да |
| `stepWithoutGap` | function | 8 | да |
| `nodeAge` | function | 6 | да |
| `installChronologyToggle` | function | 6 | да |
| `showChronologyModeIfOn` | function | 5 | да |
| `moderateChronologyCheck` | function | 4 | — |
| `looseChronologyCheck` | function | 4 | — |
| `DATA_nodes_find` | function | 1 | — |

### `modules/paths/path-descriptions.js` — 179 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showPathDescriptionsModal` | function | 128 | да |
| `togglePathNodesDescriptions` | function | 18 | да |
| `closePathDescriptionsModal` | function | 15 | да |
| `nodesDescriptionsVisible` | let | 1 | — |

### `modules/paths/path-ui.js` — 416 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findAndShowPath` | function | 268 | да |
| `handlePathArrowHover` | function | 39 | да |
| `resolvePathLinkList` | function | 37 | да |
| `initPathFinder` | function | 23 | да |
| `highlightPath` | function | 18 | — |
| `clearPathHighlight` | function | 6 | да |
| `arrowHoverTimer` | let | 1 | — |
| `ARROW_HOVER_DELAY` | const | 1 | — |

### `modules/paths/shortest-path.js` — 203 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findShortestPathWeighted` | function | 102 | — |
| `findShortestPathUnweighted` | function | 69 | — |
| `findShortestPath` | function | 10 | да |
| `pathLinkAllowed` | function | 9 | — |

### `modules/render/canvas-core.js` — 45 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `resizeCanvas` | function | 11 | да |
| `gfxCanvas` | const | 1 | да |
| `ctx` | const | 1 | да |
| `gfxSvg` | const | 1 | да |
| `pickCanvas` | const | 1 | да |
| `pickCtx` | const | 1 | да |
| `PICK_LINK_WIDTH` | const | 1 | да |
| `dpr` | let | 1 | да |
| `renderState` | const | 1 | да |

### `modules/render/d3-layer.js` — 105 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `subSelection` | function | 23 | — |
| `makeClassed` | function | 15 | — |
| `dragstarted` | function | 8 | да |
| `dragended` | function | 5 | да |
| `nodeHandlers` | const | 1 | да |
| `linkHandlers` | const | 1 | да |
| `gfxNode` | const | 1 | да |
| `gfxLink` | const | 1 | да |
| `gfxLinkAll` | const | 1 | да |
| `updateArrows` | function | 1 | да |
| `gfxZoom` | const | 1 | да |

### `modules/render/draw-link.js` — 101 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `drawSelfLoop` | function | 27 | да |
| `linkDrawAlpha` | function | 21 | да |
| `fillArrow` | function | 13 | да |
| `linkDrawWidth` | function | 8 | да |
| `strokeLink` | function | 8 | да |
| `linkVisualState` | function | 7 | да |

### `modules/render/geometry.js` — 95 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `arrowPointsStart` | function | 28 | да |
| `arrowPoints` | function | 26 | да |
| `arcParams` | function | 15 | да |
| `linkHasTwoHeads` | function | 5 | да |
| `linkStrokeWidth` | function | 4 | да |
| `linkHoverStrokeWidth` | function | 4 | да |

### `modules/render/grouping.js` — 103 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleGrouping` | function | 33 | да |
| `installResize` | function | 33 | да |
| `buildGroupPositions` | function | 10 | да |
| `philosopherNames` | const | 1 | — |
| `groupPositions` | const | 1 | — |
| `cols` | const | 1 | — |
| `rows` | const | 1 | — |

### `modules/render/interactions.js` — 308 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `installLinkHover` | function | 127 | да |
| `installNodeDrag` | function | 39 | да |
| `dispatchClick` | function | 34 | — |
| `dispatchMove` | function | 30 | — |
| `installNodeHover` | function | 29 | да |
| `initGraphEventHandlers` | function | 13 | да |
| `lastHoverNode` | let | 1 | — |
| `lastHoverLink` | let | 1 | — |

### `modules/render/loop.js` — 20 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `requestDraw` | function | 9 | да |
| `drawScheduled` | let | 1 | — |
| `painter` | let | 1 | — |
| `setPainter` | function | 1 | да |

### `modules/render/metric-visualization.js` — 371 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleMetricVisualization` | function | 132 | да |
| `visualizeMetricBySize` | function | 110 | — |
| `updateVisualizationControlSection` | function | 40 | — |
| `resetNodeSizes` | function | 39 | да |
| `updateVisualizationButtonText` | function | 16 | — |
| `saveOriginalRadii` | function | 11 | да |
| `isVisualizingBySize` | let | 1 | — |
| `currentVisualizedMetric` | let | 1 | — |
| `originalRadii` | let | 1 | — |
| `originalTextDy` | let | 1 | — |

### `modules/render/picking.js` — 79 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `repaintPickCanvas` | function | 30 | — |
| `pickLink` | function | 12 | да |
| `pickNode` | function | 9 | да |
| `rebuildQuadtree` | function | 5 | да |
| `toGraph` | function | 4 | да |
| `quadtree` | let | 1 | — |

### `modules/render/render-state.js` — 17 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `LABEL_HIDE_BELOW` | const | 1 | да |
| `LABEL_ALL_ABOVE` | const | 1 | да |
| `nodeRadius` | function | 1 | да |
| `nodeLabelDy` | function | 1 | да |
| `hasNodeClass` | function | 1 | да |
| `hasLinkClass` | function | 1 | да |

### `modules/render/scene.js` — 340 строк, объявлений 18

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderScene` | function | 138 | да |
| `drawLinkSet` | function | 36 | — |
| `paintLinkLayer` | function | 21 | — |
| `linksLayerKey` | function | 19 | — |
| `updateGraphData` | function | 14 | да |
| `stepRadiusAnimation` | function | 13 | — |
| `graphIsCovered` | function | 10 | — |
| `draw` | function | 10 | да |
| `needsContinuousAnimation` | function | 9 | да |
| `ensureAnimLoop` | function | 9 | да |
| `startRadiusAnimation` | function | 6 | да |
| `linkOutOfLayer` | function | 5 | — |
| `linkDrawnLive` | function | 5 | — |
| `sameLayerKey` | function | 5 | — |
| `animLoopRunning` | let | 1 | — |
| `DRAW_ORDER` | const | 1 | да |
| `lastLayerKey` | let | 1 | — |
| `LABEL_SHADOW_PASSES` | const | 1 | — |

### `modules/render/selection.js` — 261 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `highlightCombined` | function | 98 | да |
| `highlightPhilosopherOnGraph` | function | 56 | да |
| `highlightConnected` | function | 34 | да |
| `highlightNodeById` | function | 18 | да |
| `resetHighlight` | function | 11 | да |
| `isNodeConnectedToSelectedEdges` | function | 8 | да |
| `isEdgeConnectedToSelectedNodes` | function | 8 | да |
| `isEdgeConnectedToNode` | function | 5 | — |

### `modules/render/similarity-overlay.js` — 219 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showSimilarityOverlay` | function | 95 | да |
| `updateSimilarityLegend` | function | 46 | — |
| `similarityLinkCount` | function | 13 | — |
| `linkAmongHighlighted` | function | 12 | да |
| `similarityColor` | function | 9 | да |
| `nodeLitBySimilarity` | function | 9 | — |
| `setSimilarityLinks` | function | 6 | да |
| `clearSimilarityOverlay` | function | 5 | да |
| `SIMILARITY_KEEP_QUANTILE` | const | 1 | — |
| `SIMILARITY_ARCS` | const | 1 | — |

### `modules/render/simulation.js` — 126 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `installSimulationTick` | function | 17 | да |
| `unfreezeSimulation` | function | 17 | да |
| `installSimulationStatsEnd` | function | 12 | да |
| `updateFreezeButton` | function | 12 | — |
| `toggleSimulationFreeze` | function | 11 | да |
| `resetSimulation` | function | 9 | да |
| `centerGraph` | function | 9 | да |
| `installSimulationLog` | function | 5 | да |
| `freezeSimulation` | function | 4 | да |
| `maxTicks` | const | 1 | — |
| `simLockedByHand` | let | 1 | — |

### `modules/render/tooltip-el.js` — 7 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `tooltip` | const | 1 | да |

### `modules/state/edit.js` — 12 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `editMode` | let | 1 | да |

### `modules/state/filters.js` — 22 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `chosenPhilosophers` | const | 1 | да |
| `pinnedDespiteFilter` | const | 1 | да |
| `pinnedVisibleNodes` | const | 1 | да |

### `modules/state/render.js` — 38 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `linkLayer` | const | 1 | да |
| `selectedNodes` | let | 1 | да |
| `selectedEdges` | let | 1 | да |

### `modules/stats/coverage.js` — 66 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `metricCoverage` | function | 16 | да |
| `generateMetricCoverageBlock` | function | 12 | да |
| `METRIC_COVERAGE_WARN` | const | 1 | да |

### `modules/stats/modal.js` — 238 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `loadStatsContent` | function | 68 | да |
| `openStatsModal` | function | 38 | да |
| `handleStatsParameterChange` | function | 31 | да |
| `closeStatsModal` | function | 30 | да |
| `switchStatsView` | function | 15 | да |
| `updateActiveNavItem` | function | 10 | да |
| `installStatsModalDismiss` | function | 9 | да |
| `installStatsEscape` | function | 7 | да |

### `modules/stats/results.js` — 414 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateMetricResults` | function | 164 | да |
| `genericDetailsHTML` | function | 55 | — |
| `generateMetricDescriptionBlock` | function | 39 | да |
| `toggleMetricDetails` | function | 21 | да |
| `generateCalculateButton` | function | 18 | да |
| `applyMetricLayout` | function | 13 | да |
| `rankKeep` | function | 6 | да |
| `restoreMetricLayoutMode` | function | 6 | да |
| `toggleMetricLayout` | function | 5 | да |
| `lastZeroCount` | let | 1 | — |
| `METRIC_FIELD_LABELS` | const | 1 | — |

### `modules/stats/run.js` — 128 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `runSingleMetric` | async function | 73 | — |
| `calculateMetricFromModal` | async function | 29 | да |
| `showProgress` | function | 11 | — |
| `hideProgress` | function | 4 | — |

### `modules/stats/views/advanced.js` — 275 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateTemporalInfluenceContent` | function | 53 | да |
| `generateBridgingContent` | function | 28 | да |
| `generateAbstractionContent` | function | 26 | да |
| `generateTransformationContent` | function | 23 | да |
| `generateFertilityContent` | function | 23 | да |
| `generateComplexityContent` | function | 23 | да |
| `generateContinuityContent` | function | 23 | да |
| `generateGenerativeContent` | function | 19 | да |
| `generateInstrumentalContent` | function | 19 | да |
| `generateDeductiveContent` | function | 19 | да |

### `modules/stats/views/comparison.js` — 428 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderClosestPairs` | async function | 96 | да |
| `renderPhilosopherComparison` | function | 63 | да |
| `renderComparison` | function | 62 | да |
| `generateComparisonContent` | function | 48 | да |
| `generateClosestPairsContent` | function | 40 | да |
| `renderPhilosopherPairs` | function | 33 | да |
| `generatePhilosopherComparisonContent` | function | 32 | да |
| `generatePhilosopherPairsContent` | function | 21 | да |
| `openPhilosopherPair` | function | 4 | да |
| `openPairInComparison` | function | 4 | да |

### `modules/stats/views/network.js` — 223 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateDegreeContent` | function | 64 | да |
| `generateOverviewContent` | function | 36 | да |
| `generatePageRankContent` | function | 15 | да |
| `generateBetweennessContent` | function | 15 | да |
| `generateClosenessContent` | function | 15 | да |
| `generateEigenvectorContent` | function | 15 | да |
| `generateWeightedClusteringContent` | function | 15 | да |
| `generateLocalCohesionContent` | function | 15 | да |
| `generateRichClubContent` | function | 15 | да |

### `modules/stats/views/philosopher.js` — 171 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generatePhilosopherProfileContent` | function | 42 | да |
| `generatePhilosopherInterdisciplinaryContent` | function | 40 | да |
| `generatePhilosopherSystematicContent` | function | 38 | да |
| `generatePhilosopherReachContent` | function | 37 | да |

### `modules/stats/views/philosophical.js` — 473 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateTensionContent` | function | 195 | да |
| `influenceScopeSwitcher` | function | 38 | да |
| `generateProblemGenerationContent` | function | 23 | да |
| `generateCriticalPowerContent` | function | 23 | да |
| `generateRevolutionaryContent` | function | 23 | да |
| `generateParadigmShiftContent` | function | 23 | да |
| `generateInfluenceContent` | function | 23 | да |
| `generateFoundationalContent` | function | 23 | да |
| `generateSyntheticContent` | function | 23 | да |
| `generateDialogicalContent` | function | 23 | да |
| `generateCoherenceContent` | function | 23 | да |
| `setInfluenceScope` | function | 10 | да |

### `modules/stats/views/rankings.js` — 141 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateConceptRankingsContent` | function | 77 | да |
| `generatePhilosopherRankingsContent` | function | 51 | да |

### `modules/ui/about.js` — 102 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildAboutText` | function | 82 | — |
| `openAboutModal` | function | 5 | да |
| `closeAboutModal` | function | 3 | да |
| `onAboutBackdropClick` | function | 3 | да |

### `modules/ui/actions-byname.js` — 20 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `callByName` | function | 5 | — |
| `BY_NAME` | const | 1 | — |

### `modules/ui/actions.js` — 27 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ACTIONS` | const | 1 | — |

### `modules/ui/delegation.js` — 70 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `withEventSwap` | function | 16 | — |
| `EVENTS` | const | 1 | — |
| `BOUNDS` | const | 1 | — |

### `modules/ui/export.js` — 126 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `exportToSVG` | function | 74 | да |
| `exportToPNG` | function | 35 | да |

### `modules/ui/hint.js` — 60 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showHint` | function | 20 | — |
| `installHintOver` | function | 6 | да |
| `installHintOut` | function | 6 | да |
| `hideHint` | function | 3 | — |
| `installHintOnScroll` | function | 3 | да |
| `installHintOnClick` | function | 3 | да |
| `hintBox` | let | 1 | — |

### `modules/ui/legend.js` — 317 строк, объявлений 27

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initFilters` | function | 79 | да |
| `toggleSection` | function | 42 | да |
| `updatePhilosopherDimming` | function | 12 | да |
| `updateFilterStats` | function | 11 | да |
| `togglePhilosopher` | function | 8 | да |
| `selectAllTraditions` | function | 8 | да |
| `deselectAllTraditions` | function | 8 | да |
| `toggleRelation` | function | 8 | да |
| `toggleRubric` | function | 8 | да |
| `toggleUniformLinkWidth` | function | 8 | да |
| `selectAllPhilosophers` | function | 7 | да |
| `deselectAllPhilosophers` | function | 7 | да |
| `selectAllRelations` | function | 7 | да |
| `deselectAllRelations` | function | 7 | да |
| `selectAllRubrics` | function | 7 | да |
| `deselectAllRubrics` | function | 7 | да |
| `markChosenInLegend` | function | 6 | да |
| `syncPhilosopherCheckboxes` | function | 6 | — |
| `toggleTradition` | function | 5 | да |
| `onlyTradition` | function | 5 | да |
| `addTradition` | function | 5 | да |
| `traditionMembers` | function | 4 | — |
| `changeFilterMode` | function | 4 | да |
| `syncLegendWeightsToggle` | function | 3 | да |
| `syncLegendDirectionToggle` | function | 3 | да |
| `legendWeightsToggle` | const | 1 | — |
| `legendDirectionToggle` | const | 1 | — |

### `modules/ui/panels.js` — 40 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `togglePanel` | function | 20 | да |
| `restorePanelStates` | function | 14 | да |

### `modules/ui/search-legend.js` — 141 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectSearchResult` | function | 35 | да |
| `installLegendSearchDismiss` | function | 17 | да |
| `setSearchKind` | function | 16 | да |
| `clearLegendSearch` | function | 16 | да |
| `toggleLegendSearch` | function | 14 | да |
| `handleLegendSearch` | function | 12 | да |
| `searchKind` | let | 1 | — |

### `modules/ui/search-link.js` — 118 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showFoundLinks` | function | 28 | — |
| `handleLegendLinkSearch` | function | 24 | да |
| `highlightLinkOnGraph` | function | 23 | да |
| `clearLinkSearch` | function | 12 | да |
| `pickLinkEnd` | function | 10 | да |
| `linkSearch` | const | 1 | — |

### `modules/ui/search-philosopher.js` — 98 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handlePhilosopherSearch` | function | 26 | да |
| `handleLegendPhilSearch` | function | 23 | да |
| `pickPhilosophers` | function | 11 | — |
| `clearPhilosopherSearch` | function | 8 | да |
| `clearLegendPhilSearch` | function | 6 | да |
| `pickPhilosopherFromSearch` | function | 4 | да |
| `selectPhilosopherResult` | function | 4 | да |

### `modules/util/color.js` — 23 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `getContrastColor` | function | 18 | да |

### `modules/util/html.js` — 9 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `escapeAttr` | function | 4 | да |

### `modules/util/philosopher-label.js` — 40 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ambiguousLabels` | function | 7 | — |
| `philosopherBirth` | function | 4 | да |
| `philosopherYears` | function | 4 | да |
| `labelWithAuthor` | function | 4 | да |
| `formatBirthYear` | function | 3 | да |
| `sortPhilosophersByBirth` | function | 3 | да |
| `_ambiguousLabels` | let | 1 | — |

### `modules/util/ru.js` — 49 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `declinePhilosopher` | function | 26 | да |
| `conjugateVerb` | function | 9 | да |
| `pluralRu` | function | 7 | да |

### `modules/widgets/custom-select.js` — 88 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectCustomOption` | function | 24 | да |
| `initializeCustomSelects` | function | 16 | да |
| `populateCustomSelect` | function | 14 | — |
| `filterCustomSelect` | function | 11 | да |
| `showCustomSelectDropdown` | function | 10 | да |

## Ввоз по модулям


### `boot.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/data/load.js`: `loadData`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/ready.js`: `onReady`, `onLoad`
- из `modules/core/graph-index.js`: `buildConceptToRubrics`
- из `modules/core/graph-index.js`: `buildRubricsIndex`
- из `modules/core/graph-index.js`: `buildPhilosopherTraditions`
- из `modules/stats/modal.js`: `installStatsModalDismiss`
- из `modules/stats/modal.js`: `installStatsEscape`
- из `modules/stats/results.js`: `restoreMetricLayoutMode`
- из `modules/ui/search-legend.js`: `installLegendSearchDismiss`
- из `modules/render/interactions.js`: `installNodeDrag`
- из `modules/render/simulation.js`: `installSimulationTick`
- из `modules/render/simulation.js`: `installSimulationStatsEnd`
- из `modules/render/interactions.js`: `installNodeHover`
- из `modules/render/interactions.js`: `installLinkHover`
- из `modules/render/grouping.js`: `buildGroupPositions`
- из `modules/render/grouping.js`: `installResize`
- из `modules/data/save.js`: `installUnsavedGuard`
- из `modules/modal/search.js`: `installModalSearchDismiss`
- из `modules/boot-defs.js`: `installOverlayDismiss`
- из `modules/boot-defs.js`: `installModalKeys`
- из `modules/ui/hint.js`: `installHintOver`
- из `modules/ui/hint.js`: `installHintOut`
- из `modules/ui/hint.js`: `installHintOnScroll`
- из `modules/ui/hint.js`: `installHintOnClick`
- из `modules/render/simulation.js`: `installSimulationLog`
- из `modules/ui/legend.js`: `syncLegendWeightsToggle`
- из `modules/ui/legend.js`: `syncLegendDirectionToggle`
- из `modules/paths/chronology.js`: `installChronologyToggle`
- из `modules/paths/chronology.js`: `installChronologyMode`
- из `modules/paths/chronology.js`: `showChronologyModeIfOn`
- из `modules/core/events.js`: `subscribe`
- из `modules/core/graph-index.js`: `rebuildIndexes`
- из `modules/filters/beyond-filter.js`: `resetBeyondFilter`
- из `modules/filters/filters.js`: `applyFiltersImmediate`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/modal/connection-edit.js`: `selectConnectionEditConcept`
- из `modules/modal/connection-view.js`: `selectConnectionViewConcept`
- из `modules/modal/core.js`: `modalStack`, `openUniversalModal`
- из `modules/modal/edit-rights.js`: `renderAuthControls`
- из `modules/modal/entry.js`: `closeDetailModal`, `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `modules/modal/philosopher-view.js`: `makeLegendsEditable`
- из `modules/paths/path-ui.js`: `initPathFinder`
- из `modules/render/canvas-core.js`: `resizeCanvas`
- из `modules/render/interactions.js`: `initGraphEventHandlers`
- из `modules/render/loop.js`: `setPainter`
- из `modules/render/metric-visualization.js`: `saveOriginalRadii`
- из `modules/render/scene.js`: `draw`, `updateGraphData`
- из `modules/render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `modules/state/filters.js`: `pinnedDespiteFilter`
- из `modules/stats/modal.js`: `closeStatsModal`, `loadStatsContent`, `switchStatsView`
- из `modules/stats/views/comparison.js`: `renderComparison`
- из `modules/ui/legend.js`: `initFilters`, `markChosenInLegend`, `updateFilterStats`, `updatePhilosopherDimming`
- из `modules/ui/panels.js`: `restorePanelStates`
- из `modules/widgets/custom-select.js`: `initializeCustomSelects`

Чаще всего поминает: `subscribe`×22, `S`×10, `updateFilterStats`×3, `saveOriginalRadii`×2, `makeLegendsEditable`×2

### `main.js`

- из `modules/boot-defs.js`: _ради побочного действия_
- из `modules/core/base-cells.js`: _ради побочного действия_
- из `modules/core/events.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: _ради побочного действия_
- из `modules/core/long-task.js`: _ради побочного действия_
- из `modules/core/relation-types.js`: _ради побочного действия_
- из `modules/core/search.js`: _ради побочного действия_
- из `modules/core/session.js`: _ради побочного действия_
- из `modules/core/time.js`: _ради побочного действия_
- из `modules/core/visibility.js`: _ради побочного действия_
- из `modules/data/mutate.js`: _ради побочного действия_
- из `modules/data/save.js`: _ради побочного действия_
- из `modules/dead.js`: _ради побочного действия_
- из `modules/filters/beyond-filter.js`: _ради побочного действия_
- из `modules/filters/chains.js`: _ради побочного действия_
- из `modules/filters/filters.js`: _ради побочного действия_
- из `modules/graph/click-actions.js`: _ради побочного действия_
- из `modules/graph/graph-data.js`: _ради побочного действия_
- из `modules/graph/graph-selection.js`: _ради побочного действия_
- из `modules/metrics/by-link-type.js`: _ради побочного действия_
- из `modules/metrics/concept-dynamics.js`: _ради побочного действия_
- из `modules/metrics/descriptions.js`: _ради побочного действия_
- из `modules/metrics/format.js`: _ради побочного действия_
- из `modules/metrics/generativity.js`: _ради побочного действия_
- из `modules/metrics/graph-cache.js`: _ради побочного действия_
- из `modules/metrics/link-indexes.js`: _ради побочного действия_
- из `modules/metrics/network.js`: _ради побочного действия_
- из `modules/metrics/philosopher.js`: _ради побочного действия_
- из `modules/metrics/philosophical.js`: _ради побочного действия_
- из `modules/metrics/rankings.js`: _ради побочного действия_
- из `modules/metrics/scope-reset.js`: _ради побочного действия_
- из `modules/metrics/scope-select.js`: _ради побочного действия_
- из `modules/metrics/scope.js`: _ради побочного действия_
- из `modules/metrics/similarity-concepts.js`: _ради побочного действия_
- из `modules/metrics/similarity-philosophers.js`: _ради побочного действия_
- из `modules/metrics/tension-cache.js`: _ради побочного действия_
- из `modules/metrics/tradition-bridging.js`: _ради побочного действия_
- из `modules/modal/assembly.js`: _ради побочного действия_
- из `modules/modal/auth.js`: _ради побочного действия_
- из `modules/modal/concept-view.js`: _ради побочного действия_
- из `modules/modal/connection-edit.js`: _ради побочного действия_
- из `modules/modal/connection-view.js`: _ради побочного действия_
- из `modules/modal/context.js`: _ради побочного действия_
- из `modules/modal/core.js`: _ради побочного действия_
- из `modules/modal/descriptions.js`: _ради побочного действия_
- из `modules/modal/dirty.js`: _ради побочного действия_
- из `modules/modal/edit-forms.js`: _ради побочного действия_
- из `modules/modal/edit-rights.js`: _ради побочного действия_
- из `modules/modal/entry.js`: _ради побочного действия_
- из `modules/modal/integrity.js`: _ради побочного действия_
- из `modules/modal/persist.js`: _ради побочного действия_
- из `modules/modal/philosopher-view.js`: _ради побочного действия_
- из `modules/modal/profile-concept.js`: _ради побочного действия_
- из `modules/modal/profile-philosopher.js`: _ради побочного действия_
- из `modules/modal/search.js`: _ради побочного действия_
- из `modules/paths/analysis.js`: _ради побочного действия_
- из `modules/paths/chronology.js`: _ради побочного действия_
- из `modules/paths/path-descriptions.js`: _ради побочного действия_
- из `modules/paths/path-ui.js`: _ради побочного действия_
- из `modules/paths/shortest-path.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: _ради побочного действия_
- из `modules/render/d3-layer.js`: _ради побочного действия_
- из `modules/render/draw-link.js`: _ради побочного действия_
- из `modules/render/geometry.js`: _ради побочного действия_
- из `modules/render/grouping.js`: _ради побочного действия_
- из `modules/render/interactions.js`: _ради побочного действия_
- из `modules/render/loop.js`: _ради побочного действия_
- из `modules/render/metric-visualization.js`: _ради побочного действия_
- из `modules/render/picking.js`: _ради побочного действия_
- из `modules/render/render-state.js`: _ради побочного действия_
- из `modules/render/scene.js`: _ради побочного действия_
- из `modules/render/selection.js`: _ради побочного действия_
- из `modules/render/similarity-overlay.js`: _ради побочного действия_
- из `modules/render/simulation.js`: _ради побочного действия_
- из `modules/render/tooltip-el.js`: _ради побочного действия_
- из `modules/state/edit.js`: _ради побочного действия_
- из `modules/state/filters.js`: _ради побочного действия_
- из `modules/state/metrics-scope.js`: _ради побочного действия_
- из `modules/state/paths.js`: _ради побочного действия_
- из `modules/state/render.js`: _ради побочного действия_
- из `modules/state/stats.js`: _ради побочного действия_
- из `modules/stats/coverage.js`: _ради побочного действия_
- из `modules/stats/modal.js`: _ради побочного действия_
- из `modules/stats/results.js`: _ради побочного действия_
- из `modules/stats/run.js`: _ради побочного действия_
- из `modules/stats/views/advanced.js`: _ради побочного действия_
- из `modules/stats/views/comparison.js`: _ради побочного действия_
- из `modules/stats/views/network.js`: _ради побочного действия_
- из `modules/stats/views/philosopher.js`: _ради побочного действия_
- из `modules/stats/views/philosophical.js`: _ради побочного действия_
- из `modules/stats/views/rankings.js`: _ради побочного действия_
- из `modules/ui/about.js`: _ради побочного действия_
- из `modules/ui/export.js`: _ради побочного действия_
- из `modules/ui/hint.js`: _ради побочного действия_
- из `modules/ui/legend.js`: _ради побочного действия_
- из `modules/ui/panels.js`: _ради побочного действия_
- из `modules/ui/search-legend.js`: _ради побочного действия_
- из `modules/ui/search-link.js`: _ради побочного действия_
- из `modules/ui/search-philosopher.js`: _ради побочного действия_
- из `modules/util/color.js`: _ради побочного действия_
- из `modules/util/html.js`: _ради побочного действия_
- из `modules/util/philosopher-label.js`: _ради побочного действия_
- из `modules/util/ru.js`: _ради побочного действия_
- из `modules/widgets/custom-select.js`: _ради побочного действия_
- из `modules/ui/actions-byname.js`: _ради побочного действия_
- из `modules/ui/actions-static.js`: _ради побочного действия_
- из `modules/ui/delegation.js`: `installDelegation`
- из `modules/ui/actions-dyn.js`: _ради побочного действия_
- из `boot.js`: `boot`

Чаще всего поминает: `installDelegation`×1, `boot`×1

### `modules/boot-defs.js`

- из `modules/core/ns.js`: `S`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`
- из `modules/modal/core.js`: `closeUniversalModal`, `modalStack`, `popModalState`
- из `modules/modal/entry.js`: `closeDetailModal`, `closePhilosopherDetailModal`
- из `modules/modal/profile-concept.js`: `closeConceptProfileModal`
- из `modules/modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `modules/paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `modules/ui/about.js`: `closeAboutModal`

Чаще всего поминает: `S`×4, `closeAboutModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2, `closeConceptProfileModal`×2

### `modules/core/base-cells.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×8

### `modules/core/graph-index.js`

- из `modules/core/ns.js`: `DATA`
- из `vendor/d3.js`: _ради побочного действия_

Чаще всего поминает: `DATA`×37

### `modules/core/link-facts.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×6, `DATA`×2

### `modules/core/relation-types.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `DATA`×2

### `modules/core/search.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/visibility.js`: `isNodeVisible`

Чаще всего поминает: `DATA`×5, `isNodeVisible`×1

### `modules/core/visibility.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×6

### `modules/data/load.js`

- из `modules/core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×1

### `modules/data/mutate.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `rebuildIndexes`
- из `modules/data/save.js`: `markDirty`
- из `modules/state/render.js`: `linkLayer`

Чаще всего поминает: `DATA`×28, `S`×2, `markDirty`×1, `rebuildIndexes`×1, `linkLayer`×1

### `modules/data/save.js`

- из `modules/core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×6

### `modules/dead.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/search.js`: `pickConcepts`
- из `modules/metrics/graph-cache.js`: `buildGlobalGraphCache`
- из `modules/render/similarity-overlay.js`: `showSimilarityOverlay`

Чаще всего поминает: `S`×12, `buildGlobalGraphCache`×1, `DATA`×1, `MET`×1, `pickConcepts`×1

### `modules/filters/beyond-filter.js`

- из `modules/filters/filters.js`: `applyFiltersImmediate`
- из `modules/state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`

Чаще всего поминает: `pinnedDespiteFilter`×4, `pinnedVisibleNodes`×1, `applyFiltersImmediate`×1

### `modules/filters/chains.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/core/long-task.js`: `CHAIN_SEARCH`

Чаще всего поминает: `CHAIN_SEARCH`×7, `DATA`×5, `S`×3, `isSymmetricLink`×1

### `modules/filters/filters.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/long-task.js`: `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/filters/chains.js`: `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/metrics/scope.js`: `updateMetricsScopeHint`
- из `modules/render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `modules/render/selection.js`: `highlightConnected`, `resetHighlight`
- из `modules/state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×62, `DATA`×20, `emit`×9, `showTemporaryMessage`×9, `CHAIN_SEARCH`×8

### `modules/graph/click-actions.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/core/session.js`: `canEdit`
- из `modules/graph/graph-selection.js`: `handleConceptSelection`
- из `modules/render/d3-layer.js`: `gfxNode`
- из `modules/render/selection.js`: `highlightCombined`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`
- из `modules/state/edit.js`: `editMode`
- из `modules/state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `selectedNodes`×15, `selectedEdges`×15, `editMode`×8, `emit`×6, `gfxNode`×5

### `modules/graph/graph-data.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`, `linksByConcept`, `traditionById`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/scene.js`: `updateGraphData`
- из `modules/state/filters.js`: `pinnedVisibleNodes`
- из `modules/state/render.js`: `linkLayer`, `selectedEdges`, `selectedNodes`

Чаще всего поминает: `renderState`×10, `S`×10, `DATA`×3, `pinnedVisibleNodes`×2, `updateGraphData`×2

### `modules/graph/graph-selection.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/render/canvas-core.js`: `gfxCanvas`

Чаще всего поминает: `S`×3, `gfxCanvas`×2, `emit`×1

### `modules/metrics/by-link-type.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/core/link-facts.js`: `sumWeight`

Чаще всего поминает: `S`×11, `MET`×6, `sumWeight`×4

### `modules/metrics/concept-dynamics.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/core/link-facts.js`: `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

Чаще всего поминает: `S`×18, `sumWeight`×6, `MET`×4, `reflexiveLinkOf`×1, `otherPhilosopher`×1

### `modules/metrics/descriptions.js`

- из `modules/core/ns.js`: `S`
- из `modules/metrics/similarity-philosophers.js`: `PHIL_SIM_MIN_RUBRIC_UNION`
- из `modules/metrics/tradition-bridging.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`

Чаще всего поминает: `S`×43, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION`×1

### `modules/metrics/format.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`

Чаще всего поминает: `S`×5, `emit`×1

### `modules/metrics/generativity.js`

- из `modules/core/ns.js`: `MET`, `S`

Чаще всего поминает: `S`×12, `MET`×1

### `modules/metrics/graph-cache.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/metrics/scope-select.js`: `metricsLinks`, `metricsNodes`

Чаще всего поминает: `S`×4, `metricsNodes`×1, `metricsLinks`×1, `isSymmetricLink`×1

### `modules/metrics/link-indexes.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `buildReflexiveMap`, `isReflexiveLink`, `isSymmetricLink`
- из `modules/core/visibility.js`: `isNodeVisible`
- из `modules/metrics/scope-select.js`: `effectiveScopeFlags`, `transformForScope`

Чаще всего поминает: `S`×16, `DATA`×5, `isReflexiveLink`×2, `isSymmetricLink`×2, `effectiveScopeFlags`×2

### `modules/metrics/network.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/metrics/graph-cache.js`: `buildGlobalGraphCache`

Чаще всего поминает: `S`×37, `DATA`×25, `MET`×11, `buildGlobalGraphCache`×10, `conceptById`×3

### `modules/metrics/philosopher.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/philosophical.js`: `DISRUPTIVE_TYPES`, `SYSTEMATIC_TYPES`

Чаще всего поминает: `S`×17, `MET`×9, `SYSTEMATIC_TYPES`×1, `DISRUPTIVE_TYPES`×1

### `modules/metrics/philosophical.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isSymmetricLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `modules/metrics/generativity.js`: `generativity`, `linkInInfluenceScope`

Чаще всего поминает: `S`×65, `sumWeight`×13, `MET`×10, `linkInInfluenceScope`×2, `reflexiveLinkOf`×2

### `modules/metrics/rankings.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/format.js`: `applyMetricMode`
- из `modules/metrics/philosopher.js`: `philosopherProfile`

Чаще всего поминает: `S`×10, `MET`×9, `applyMetricMode`×1, `philosopherProfile`×1

### `modules/metrics/scope-reset.js`

- из `modules/core/ns.js`: `S`
- из `modules/metrics/by-link-type.js`: `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`
- из `modules/metrics/concept-dynamics.js`: `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`
- из `modules/metrics/generativity.js`: `invalidateGenerativityCache`
- из `modules/metrics/graph-cache.js`: `invalidateGraphCache`
- из `modules/metrics/network.js`: `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`
- из `modules/metrics/philosopher.js`: `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`
- из `modules/metrics/philosophical.js`: `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`
- из `modules/metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`
- из `modules/metrics/similarity-concepts.js`: `invalidateSimilarityCache`
- из `modules/metrics/tension-cache.js`: `invalidateTensionScales`
- из `modules/metrics/tradition-bridging.js`: `invalidateTraditionBridgingCache`

Чаще всего поминает: `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2

### `modules/metrics/scope-select.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×7, `DATA`×2

### `modules/metrics/scope.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/visibility.js`: `isNodeVisible`
- из `modules/metrics/graph-cache.js`: `invalidateGraphCache`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/metrics/scope-select.js`: `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `transformForScope`

Чаще всего поминает: `S`×16, `DATA`×6, `METRIC_FLAGS`×3, `initializePhilosophyMetrics`×2, `invalidateEverythingForScope`×2

### `modules/metrics/similarity-concepts.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `modules/metrics/similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

Чаще всего поминает: `MET`×17, `S`×5, `nodeDegreeOf`×1, `medianNodeDegree`×1, `invalidatePhilosopherSimilarityCache`×1

### `modules/metrics/similarity-philosophers.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/philosopher.js`: `philosopherProfile`

Чаще всего поминает: `S`×8, `MET`×3, `philosopherProfile`×1

### `modules/metrics/tension-cache.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×3

### `modules/metrics/tradition-bridging.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/core/link-facts.js`: `isTypologicalLink`

Чаще всего поминает: `S`×6, `MET`×1, `isTypologicalLink`×1

### `modules/modal/assembly.js`

- из `modules/core/ns.js`: `VIEWS`

Чаще всего поминает: `VIEWS`×2

### `modules/modal/auth.js`

- из `modules/core/session.js`: `AUTH_ADMIN`, `authAccounts`, `authSession`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `toggleModalMode`
- из `modules/modal/edit-rights.js`: `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

Чаще всего поминает: `authAccounts`×4, `authSession`×4, `renderAuthControls`×4, `refreshEditHints`×4, `AUTH_ADMIN`×3

### `modules/modal/concept-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `rubricById`
- из `modules/metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `modules/metrics/similarity-concepts.js`: `nearestConcepts`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×13, `nearestConcepts`×2, `conceptById`×2, `linkArrow`×2, `nodeDegreeOf`×1

### `modules/modal/connection-edit.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `WEIGHT_OPTIONS`, `relationHint`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/graph/graph-data.js`: `connectionsBetween`
- из `modules/modal/assembly.js`: `modalActions`
- из `modules/modal/connection-view.js`: `initConnectionSearchFields`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `ModalContext`×11, `conceptById`×5, `DATA`×4, `connectionsBetween`×2, `relationHint`×2

### `modules/modal/connection-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `traditionById`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `CONN_WEIGHT_WORDS`, `WEIGHT_WORDS`, `relationHint`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/graph/graph-data.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `modules/graph/graph-selection.js`: `selectConceptOnGraph`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×11, `ModalContext`×7, `conceptById`×5, `traditionsOfPhilosopher`×2, `isReflexiveLink`×2

### `modules/modal/core.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/session.js`: `canEdit`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`
- из `modules/modal/assembly.js`: `modalContentFor`, `modalEntityExists`
- из `modules/modal/connection-view.js`: `initConnectionSearchFields`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/dirty.js`: `hasUnsavedChanges`
- из `modules/modal/search.js`: `clearModalSearch`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`

Чаще всего поминает: `ModalContext`×17, `hasUnsavedChanges`×2, `canEdit`×2, `initConnectionSearchFields`×2, `clearModalSearch`×2

### `modules/modal/dirty.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `philosopherByName`
- из `modules/modal/assembly.js`: `modalEntityExists`
- из `modules/modal/context.js`: `ModalContext`

Чаще всего поминает: `ModalContext`×5, `DATA`×2, `modalEntityExists`×1, `philosopherByName`×1

### `modules/modal/edit-forms.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `relationHint`
- из `modules/graph/graph-data.js`: `getConceptConnections`
- из `modules/modal/assembly.js`: `modalActions`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/html.js`: `escapeAttr`
- из `modules/util/philosopher-label.js`: `philosopherYears`, `sortPhilosophersByBirth`

Чаще всего поминает: `DATA`×7, `escapeAttr`×5, `VIEWS`×2, `modalActions`×2, `relationHint`×2

### `modules/modal/edit-rights.js`

- из `modules/core/session.js`: `authSession`, `canEdit`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `openUniversalModal`

Чаще всего поминает: `ModalContext`×4, `openUniversalModal`×1, `authSession`×1, `canEdit`×1

### `modules/modal/entry.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `rubricById`
- из `modules/core/session.js`: `canEdit`
- из `modules/graph/graph-data.js`: `findConnection`, `getConceptConnections`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxNode`, `gfxZoom`
- из `modules/render/selection.js`: `highlightConnected`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `openUniversalModal`×5, `conceptById`×3, `canEdit`×3, `DATA`×3, `getConceptConnections`×2

### `modules/modal/integrity.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/modal/entry.js`: `isConceptIsolated`
- из `modules/util/philosopher-label.js`: `philosopherBirth`, `philosopherYears`
- из `modules/util/ru.js`: `pluralRu`

Чаще всего поминает: `DATA`×10, `conceptById`×3, `philosopherByName`×2, `pluralRu`×2, `philosopherBirth`×2

### `modules/modal/persist.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/data/mutate.js`: `afterDataChange`
- из `modules/graph/graph-data.js`: `addLinkToGraph`, `addNodeToGraph`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `modules/modal/assembly.js`: `modalEntityExists`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `modules/modal/entry.js`: `getIsolatedConceptsAfterDeletion`
- из `modules/modal/integrity.js`: `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

Чаще всего поминает: `DATA`×40, `ModalContext`×17, `afterDataChange`×8, `openUniversalModal`×6, `conceptById`×6

### `modules/modal/philosopher-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`, `rubricById`, `traditionById`
- из `modules/core/session.js`: `canEdit`
- из `modules/metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/modal/edit-rights.js`: `refreshEditHints`
- из `modules/modal/entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `modules/render/selection.js`: `highlightPhilosopherOnGraph`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/philosopher-label.js`: `formatBirthYear`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `modules/util/ru.js`: `conjugateVerb`, `declinePhilosopher`

Чаще всего поминает: `declinePhilosopher`×22, `DATA`×16, `conceptById`×6, `conjugateVerb`×5, `getContrastColor`×4

### `modules/modal/profile-concept.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope.js`: `metricsScopeCounts`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `modules/util/color.js`: `getContrastColor`

Чаще всего поминает: `MET`×19, `S`×7, `DATA`×5, `initializePhilosophyMetrics`×1, `conceptById`×1

### `modules/modal/profile-philosopher.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `nodesByPhilosopher`, `philosopherByName`, `rubricById`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/modal/profile-concept.js`: `PROFILE_METRICS`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `modules/util/color.js`: `getContrastColor`

Чаще всего поминает: `MET`×6, `DATA`×4, `S`×4, `initializePhilosophyMetrics`×1, `philosopherByName`×1

### `modules/modal/search.js`

- из `modules/core/search.js`: `displaySearchResults`, `pickConcepts`

Чаще всего поминает: `displaySearchResults`×1, `pickConcepts`×1

### `modules/paths/analysis.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `philosopherByName`, `traditionById`
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`
- из `modules/graph/graph-data.js`: `traditionsOfPhilosopher`
- из `modules/paths/chronology.js`: `isChronologicallyValid`

Чаще всего поминает: `DATA`×4, `conceptById`×2, `philosopherByName`×2, `traditionsOfPhilosopher`×2, `CHRONOLOGY_MODES`×1

### `modules/paths/chronology.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `philosopherByName`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`, `MATURITY_AGE`

Чаще всего поминает: `MATURITY_AGE`×4, `philosopherByName`×3, `conceptById`×3, `CHRONOLOGY_MODES`×3, `S`×2

### `modules/paths/path-descriptions.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `philosopherByName`
- из `modules/core/relation-types.js`: `WEIGHT_WORDS`
- из `modules/paths/analysis.js`: `analyzePathTraditions`
- из `modules/paths/path-ui.js`: `resolvePathLinkList`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×4, `S`×3, `resolvePathLinkList`×1, `freezeSimulation`×1, `analyzePathTraditions`×1

### `modules/paths/path-ui.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `philosopherByName`
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`
- из `modules/paths/analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `modules/paths/shortest-path.js`: `findShortestPath`
- из `modules/render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `modules/render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×15, `DATA`×6, `resetHighlight`×3, `philosopherByName`×2, `findShortestPath`×1

### `modules/paths/shortest-path.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isSymmetricLink`, `isTypologicalLink`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`
- из `modules/paths/chronology.js`: `isChronologicallyValid`, `nodeAge`, `stepWithoutGap`

Чаще всего поминает: `S`×7, `nodeAge`×6, `DATA`×5, `CHRONOLOGY_MODES`×2, `isSymmetricLink`×2

### `modules/render/canvas-core.js`

- из `modules/core/ns.js`: `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/render/loop.js`: `requestDraw`

Чаще всего поминает: `S`×5, `requestDraw`×1

### `modules/render/d3-layer.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/scene.js`: `startRadiusAnimation`

Чаще всего поминает: `DATA`×9, `renderState`×8, `requestDraw`×8, `S`×4, `startRadiusAnimation`×1

### `modules/render/draw-link.js`

- из `modules/core/ns.js`: `S`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/geometry.js`: `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`
- из `modules/render/render-state.js`: `hasLinkClass`, `nodeRadius`
- из `modules/render/similarity-overlay.js`: `linkAmongHighlighted`
- из `modules/state/render.js`: `selectedEdges`

Чаще всего поминает: `hasLinkClass`×4, `renderState`×3, `selectedEdges`×1, `linkHoverStrokeWidth`×1, `linkStrokeWidth`×1

### `modules/render/geometry.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: `renderState`

Чаще всего поминает: `S`×6, `renderState`×2, `DATA`×1

### `modules/render/grouping.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/state/render.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: `resizeCanvas`
- из `modules/render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×19, `DATA`×1, `resetHighlight`×1, `resizeCanvas`×1

### `modules/render/interactions.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `modules/core/session.js`: `canEdit`
- из `modules/graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `modules/render/canvas-core.js`: `gfxCanvas`, `gfxSvg`, `renderState`
- из `modules/render/d3-layer.js`: `dragended`, `dragstarted`, `gfxLink`, `gfxNode`, `gfxZoom`, `linkHandlers`, `nodeHandlers`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/picking.js`: `pickLink`, `pickNode`, `rebuildQuadtree`, `toGraph`
- из `modules/render/selection.js`: `resetHighlight`
- из `modules/render/tooltip-el.js`: `tooltip`
- из `modules/state/edit.js`: `editMode`
- из `modules/state/filters.js`: `chosenPhilosophers`
- из `modules/state/render.js`: `selectedEdges`
- из `modules/util/philosopher-label.js`: `labelWithAuthor`

Чаще всего поминает: `S`×15, `tooltip`×12, `renderState`×11, `linkHandlers`×10, `nodeHandlers`×8

### `modules/render/metric-visualization.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `modules/render/d3-layer.js`: `gfxNode`, `updateArrows`

Чаще всего поминает: `DATA`×8, `S`×5, `gfxNode`×4, `updateArrows`×2, `pageRankCache`×1

### `modules/render/picking.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `PICK_LINK_WIDTH`, `dpr`, `gfxCanvas`, `pickCanvas`, `pickCtx`, `renderState`
- из `modules/render/draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `modules/render/render-state.js`: `nodeRadius`

Чаще всего поминает: `pickCtx`×14, `dpr`×6, `DATA`×5, `pickCanvas`×4, `renderState`×3

### `modules/render/render-state.js`

- из `modules/render/canvas-core.js`: `renderState`

Чаще всего поминает: `renderState`×4

### `modules/render/scene.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `ctx`, `dpr`, `gfxCanvas`, `renderState`
- из `modules/render/draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `modules/render/geometry.js`: `arcParams`, `linkHoverStrokeWidth`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/picking.js`: `rebuildQuadtree`
- из `modules/render/render-state.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasLinkClass`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `modules/render/similarity-overlay.js`: `similarityColor`
- из `modules/state/render.js`: `linkLayer`, `selectedEdges`, `selectedNodes`

Чаще всего поминает: `S`×24, `renderState`×18, `DATA`×16, `linkLayer`×12, `dpr`×8

### `modules/render/selection.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxLinkAll`, `gfxNode`, `gfxZoom`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/state/filters.js`: `chosenPhilosophers`
- из `modules/state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `selectedNodes`×11, `chosenPhilosophers`×8, `selectedEdges`×8, `gfxNode`×6, `DATA`×5

### `modules/render/similarity-overlay.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/similarity-concepts.js`: `_simCache`, `profileIsMeaningful`, `profileSimilarity`, `structuralSimilarity`
- из `modules/render/loop.js`: `requestDraw`

Чаще всего поминает: `S`×29, `DATA`×4, `showTemporaryMessage`×4, `requestDraw`×3, `profileIsMeaningful`×2

### `modules/render/simulation.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxZoom`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/picking.js`: `rebuildQuadtree`
- из `modules/render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `modules/render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×20, `DATA`×3, `ensureAnimLoop`×2, `needsContinuousAnimation`×2, `rebuildQuadtree`×1

### `modules/render/tooltip-el.js`

- из `vendor/d3.js`: _ради побочного действия_

### `modules/state/filters.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×5, `DATA`×4

### `modules/state/metrics-scope.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×5

### `modules/state/paths.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`

Чаще всего поминает: `S`×7, `CHRONOLOGY_MODES`×1

### `modules/state/render.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×12, `DATA`×2

### `modules/state/stats.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×15

### `modules/stats/coverage.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/by-link-type.js`: _ради побочного действия_
- из `modules/metrics/concept-dynamics.js`: _ради побочного действия_
- из `modules/metrics/generativity.js`: _ради побочного действия_
- из `modules/metrics/philosophical.js`: _ради побочного действия_
- из `modules/metrics/tradition-bridging.js`: _ради побочного действия_

Чаще всего поминает: `MET`×19, `S`×8

### `modules/stats/modal.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/events.js`: `emit`
- из `modules/metrics/graph-cache.js`: `invalidateGraphCache`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `updateMetricsScopeHint`, `updateScopeToggles`
- из `modules/render/metric-visualization.js`: `resetNodeSizes`
- из `modules/render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/stats/results.js`: `applyMetricLayout`
- из `modules/stats/views/advanced.js`: `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`
- из `modules/stats/views/comparison.js`: `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `modules/stats/views/network.js`: `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`
- из `modules/stats/views/philosopher.js`: `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`
- из `modules/stats/views/philosophical.js`: `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`
- из `modules/stats/views/rankings.js`: `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

Чаще всего поминает: `S`×21, `applyMetricsScope`×3, `updateScopeToggles`×3, `DATA`×2, `initializePhilosophyMetrics`×2

### `modules/stats/results.js`

- из `modules/core/ns.js`: `S`
- из `modules/metrics/descriptions.js`: `getMetricDescription`
- из `modules/metrics/format.js`: `applyMetricMode`
- из `modules/stats/coverage.js`: `generateMetricCoverageBlock`

Чаще всего поминает: `S`×18, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `getMetricDescription`×1

### `modules/stats/run.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/network.js`: `calculateBetweennessAsync`
- из `modules/stats/modal.js`: `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

Чаще всего поминает: `MET`×6, `S`×2, `openStatsModal`×2, `switchStatsView`×1, `updateActiveNavItem`×1

### `modules/stats/views/advanced.js`

- из `modules/core/ns.js`: `DATA`, `MET`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/stats/results.js`: `generateMetricDescriptionBlock`, `generateMetricResults`, `rankKeep`

Чаще всего поминает: `DATA`×30, `initializePhilosophyMetrics`×10, `MET`×10, `generateMetricResults`×9, `rankKeep`×7

### `modules/stats/views/comparison.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/long-task.js`: `LoadingIndicator`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/philosopher.js`: `philosopherProfile`
- из `modules/metrics/similarity-concepts.js`: `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `profileSimilarity`, `similarityData`, `structuralSimilarity`
- из `modules/metrics/similarity-philosophers.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`, `philosopherSimilarity`, `philosopherSimilarityData`
- из `modules/stats/results.js`: `generateMetricDescriptionBlock`

Чаще всего поминает: `S`×47, `DATA`×12, `PHIL_SIM_LABELS`×5, `initializePhilosophyMetrics`×4, `generateMetricDescriptionBlock`×4

### `modules/stats/views/network.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `modules/stats/results.js`: `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`

Чаще всего поминает: `DATA`×7, `generateCalculateButton`×7, `generateMetricResults`×7, `pageRankCache`×3, `betweennessCache`×3

### `modules/stats/views/philosopher.js`

- из `modules/core/ns.js`: `DATA`, `MET`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/philosopher.js`: `philosopherProfile`
- из `modules/stats/results.js`: `generateMetricDescriptionBlock`, `rankKeep`
- из `modules/stats/views/philosophical.js`: `influenceScopeSwitcher`

Чаще всего поминает: `DATA`×12, `initializePhilosophyMetrics`×4, `generateMetricDescriptionBlock`×4, `MET`×3, `rankKeep`×2

### `modules/stats/views/philosophical.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/philosophical.js`: `INFLUENCE_SCOPE_LABELS`, `invalidateInfluenceIndexCache`
- из `modules/metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`
- из `modules/stats/results.js`: `generateMetricResults`, `rankKeep`

Чаще всего поминает: `DATA`×30, `S`×10, `initializePhilosophyMetrics`×10, `MET`×10, `generateMetricResults`×10

### `modules/stats/views/rankings.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/rankings.js`: `generatePhilosopherRankings`, `generateRankings`
- из `modules/stats/results.js`: `generateMetricDescriptionBlock`
- из `modules/stats/views/philosophical.js`: `influenceScopeSwitcher`

Чаще всего поминает: `DATA`×4, `S`×3, `initializePhilosophyMetrics`×2, `generateMetricDescriptionBlock`×2, `influenceScopeSwitcher`×2

### `modules/ui/about.js`

- из `modules/core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×7

### `modules/ui/actions-byname.js`

- из `modules/ui/actions.js`: `registerActions`
- из `modules/modal/persist.js`: `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

Чаще всего поминает: `saveConceptData`×2, `savePhilosopherData`×2, `saveConnectionData`×2, `deleteConcept`×2, `deletePhilosopher`×2

### `modules/ui/actions-dyn.js`

- из `modules/ui/actions.js`: `registerActions`
- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/graph/graph-data.js`: `findConnection`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`
- из `modules/metrics/format.js`: `toggleMetricValueMode`
- из `modules/modal/auth.js`: `authLogout`, `closeAuthModal`, `openAuthModal`, `submitAuth`
- из `modules/modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `modules/modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `modules/modal/descriptions.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `modules/modal/edit-forms.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `modules/modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `modules/modal/persist.js`: `deleteConnection`
- из `modules/modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `modules/modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `modules/modal/search.js`: `clearModalSearch`, `handleModalSearch`
- из `modules/paths/path-descriptions.js`: `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `modules/paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`
- из `modules/render/metric-visualization.js`: `toggleMetricVisualization`
- из `modules/render/selection.js`: `highlightNodeById`
- из `modules/render/similarity-overlay.js`: `clearSimilarityOverlay`, `setSimilarityLinks`, `showSimilarityOverlay`
- из `modules/stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `modules/stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `modules/stats/run.js`: `calculateMetricFromModal`
- из `modules/stats/views/comparison.js`: `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `modules/stats/views/philosophical.js`: `setInfluenceScope`
- из `modules/ui/legend.js`: `addTradition`, `onlyTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `modules/ui/search-legend.js`: `selectSearchResult`
- из `modules/ui/search-link.js`: `highlightLinkOnGraph`, `pickLinkEnd`
- из `modules/ui/search-philosopher.js`: `clearPhilosopherSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`
- из `modules/widgets/custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

Чаще всего поминает: `openUniversalModal`×18, `S`×10, `DATA`×8, `renderClosestPairs`×6, `toggleSubsection`×4

### `modules/ui/actions-static.js`

- из `modules/ui/actions.js`: `registerActions`
- из `modules/data/save.js`: `downloadData`, `saveToFolder`
- из `modules/filters/beyond-filter.js`: `resetBeyondFilter`
- из `modules/metrics/scope.js`: `handleMetricsScopeChange`
- из `modules/modal/core.js`: `closeUniversalModal`
- из `modules/modal/profile-concept.js`: `closeConceptProfileModal`
- из `modules/modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `modules/paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `modules/paths/path-ui.js`: `findAndShowPath`
- из `modules/render/grouping.js`: `toggleGrouping`
- из `modules/render/metric-visualization.js`: `resetNodeSizes`
- из `modules/render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `modules/stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `modules/ui/about.js`: `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`
- из `modules/ui/export.js`: `exportToPNG`, `exportToSVG`
- из `modules/ui/legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `toggleSection`, `toggleUniformLinkWidth`
- из `modules/ui/panels.js`: `togglePanel`
- из `modules/ui/search-legend.js`: `clearLegendSearch`, `handleLegendSearch`, `setSearchKind`, `toggleLegendSearch`
- из `modules/ui/search-link.js`: `handleLegendLinkSearch`
- из `modules/ui/search-philosopher.js`: `clearLegendPhilSearch`, `handleLegendPhilSearch`
- из `modules/widgets/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

Чаще всего поминает: `switchStatsView`×39, `handleLegendLinkSearch`×4, `toggleSection`×4, `setSearchKind`×3, `handleLegendSearch`×2

### `modules/ui/delegation.js`

- из `modules/ui/actions.js`: `runAction`

Чаще всего поминает: `runAction`×2

### `modules/ui/export.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/draw-link.js`: `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`
- из `modules/render/geometry.js`: `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`
- из `modules/render/render-state.js`: `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `modules/render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×8, `hasNodeClass`×6, `DATA`×5, `renderState`×2, `showTemporaryMessage`×2

### `modules/ui/hint.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×1

### `modules/ui/legend.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/relation-types.js`: `relationHint`
- из `modules/filters/filters.js`: `applyFilters`, `philosopherPassesTraditions`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/d3-layer.js`: `updateArrows`
- из `modules/state/filters.js`: `chosenPhilosophers`

Чаще всего поминает: `S`×31, `DATA`×24, `applyFilters`×15, `chosenPhilosophers`×1, `relationHint`×1

### `modules/ui/search-legend.js`

- из `modules/core/ns.js`: `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/core/search.js`: `displaySearchResults`, `pickConcepts`
- из `modules/core/visibility.js`: `isNodeVisible`
- из `modules/filters/beyond-filter.js`: `updateFilterNote`
- из `modules/filters/filters.js`: `applyFiltersImmediate`
- из `modules/modal/entry.js`: `showDetailModal`
- из `modules/modal/search.js`: `clearModalSearch`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxZoom`
- из `modules/render/selection.js`: `highlightConnected`
- из `modules/state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`
- из `modules/state/render.js`: `selectedNodes`
- из `modules/ui/search-link.js`: `clearLinkSearch`
- из `modules/ui/search-philosopher.js`: `clearLegendPhilSearch`

Чаще всего поминает: `clearLegendPhilSearch`×2, `clearLinkSearch`×2, `selectedNodes`×2, `S`×2, `displaySearchResults`×1

### `modules/ui/search-link.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxZoom`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/selection.js`: `highlightCombined`
- из `modules/state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `DATA`×6, `emptyList`×2, `selectedEdges`×2, `S`×2, `pickConcepts`×1

### `modules/ui/search-philosopher.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/search.js`: `emptyList`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/render/selection.js`: `highlightPhilosopherOnGraph`

Чаще всего поминает: `DATA`×7, `emptyList`×2, `highlightPhilosopherOnGraph`×1, `openUniversalModal`×1

### `modules/util/philosopher-label.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `philosopherByName`

Чаще всего поминает: `philosopherByName`×2, `DATA`×1

### `modules/widgets/custom-select.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`

Чаще всего поминает: `S`×4, `pickConcepts`×1, `rowInner`×1, `emptyList`×1, `conceptById`×1