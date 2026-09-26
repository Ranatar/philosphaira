# Карта модульного дерева `philosophy_graph`

Составлена **по собранному дереву**, а не по одностраничному исходнику:
130 модулей, 22146 строк, 932 объявлений,
636 вывозов, 847 рёбер ввоза. Составлено 2026-09-26 04:07:14.

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
| `modules/core/ns.js` | 99 |
| `modules/core/graph-index.js` | 57 |
| `modules/core/events.js` | 25 |
| `modules/core/link-facts.js` | 24 |
| `modules/util/html.js` | 24 |
| `modules/render/canvas-core.js` | 19 |
| `modules/state/render.js` | 19 |
| `modules/core/api.js` | 14 |
| `modules/modal/core.js` | 14 |
| `modules/core/perms.js` | 13 |
| `modules/metrics/link-indexes.js` | 13 |
| `modules/render/selection.js` | 13 |

## Самые востребованные имена

| Имя | В скольких модулях ввозится |
|---|---|
| `S` | 78 |
| `DATA` | 61 |
| `conceptById` | 24 |
| `emit` | 23 |
| `MET` | 21 |
| `initializePhilosophyMetrics` | 12 |
| `PERM` | 12 |
| `can` | 11 |
| `escapeAttr` | 11 |
| `philosopherByName` | 11 |
| `requestDraw` | 10 |
| `api` | 10 |
| `selectedNodes` | 10 |
| `renderState` | 10 |
| `isReflexiveLink` | 10 |

## Общие пространства имён

| Пространство | Полей | Самое востребованное поле | В скольких модулях |
|---|---|---|---|
| `DATA` | 17 | `nodes` | 36 |
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
| `boot.js` | 327 | 0 | 1 | 67 | DATA:2, S:8 |
| `main.js` | 136 | 0 | 0 | 125 | — |
| `modules/boot-defs.js` | 62 | 3 | 2 | 8 | S:1 |
| `modules/core/api.js` | 90 | 4 | 3 | 1 | — |
| `modules/core/base-cells.js` | 19 | 0 | 0 | 1 | S:8 |
| `modules/core/events.js` | 66 | 5 | 2 | 0 | — |
| `modules/core/graph-index.js` | 238 | 19 | 17 | 2 | DATA:16 |
| `modules/core/link-facts.js` | 86 | 11 | 11 | 2 | DATA:1, S:6 |
| `modules/core/long-task.js` | 121 | 3 | 3 | 0 | — |
| `modules/core/ns.js` | 33 | 2 | 4 | 0 | — |
| `modules/core/perms.js` | 28 | 4 | 3 | 0 | — |
| `modules/core/ready.js` | 15 | 0 | 2 | 0 | — |
| `modules/core/relation-types.js` | 59 | 6 | 5 | 2 | DATA:2 |
| `modules/core/search.js` | 68 | 4 | 4 | 3 | DATA:3 |
| `modules/core/session.js` | 23 | 4 | 4 | 1 | — |
| `modules/core/time.js` | 13 | 2 | 2 | 0 | — |
| `modules/core/visibility.js` | 13 | 2 | 2 | 1 | S:2 |
| `modules/data/backend.js` | 121 | 7 | 4 | 4 | — |
| `modules/data/commit-draft.js` | 37 | 2 | 1 | 0 | — |
| `modules/data/load.js` | 9 | 0 | 1 | 1 | — |
| `modules/data/mutate.js` | 89 | 3 | 1 | 6 | DATA:11, S:1 |
| `modules/data/remote.js` | 174 | 9 | 5 | 6 | DATA:8, S:3 |
| `modules/data/save.js` | 72 | 10 | 7 | 1 | DATA:6 |
| `modules/dead.js` | 86 | 6 | 6 | 5 | DATA:1, S:5, MET:1 |
| `modules/filters/beyond-filter.js` | 21 | 2 | 2 | 2 | — |
| `modules/filters/chains.js` | 273 | 6 | 3 | 4 | DATA:3, S:2 |
| `modules/filters/filters.js` | 443 | 12 | 2 | 13 | DATA:4, S:7 |
| `modules/graph/click-actions.js` | 201 | 8 | 2 | 8 | S:1 |
| `modules/graph/graph-data.js` | 121 | 10 | 10 | 10 | DATA:2, S:5 |
| `modules/graph/graph-selection.js` | 61 | 3 | 3 | 3 | S:1 |
| `modules/metrics/by-link-type.js` | 116 | 6 | 3 | 2 | S:3, MET:4 |
| `modules/metrics/concept-dynamics.js` | 224 | 8 | 4 | 2 | S:4, MET:4 |
| `modules/metrics/descriptions.js` | 478 | 2 | 1 | 3 | S:4 |
| `modules/metrics/format.js` | 32 | 4 | 2 | 2 | S:3 |
| `modules/metrics/generativity.js` | 110 | 8 | 3 | 1 | S:6, MET:1 |
| `modules/metrics/graph-cache.js` | 129 | 3 | 2 | 3 | S:3 |
| `modules/metrics/link-indexes.js` | 122 | 4 | 1 | 5 | DATA:3, S:9 |
| `modules/metrics/network.js` | 950 | 26 | 18 | 4 | DATA:1, S:5, MET:9 |
| `modules/metrics/philosopher.js` | 308 | 13 | 6 | 2 | S:5, MET:9 |
| `modules/metrics/philosophical.js` | 1130 | 25 | 14 | 4 | DATA:1, S:6, MET:10 |
| `modules/metrics/rankings.js` | 141 | 5 | 4 | 3 | S:4, MET:9 |
| `modules/metrics/scope-reset.js` | 64 | 3 | 1 | 12 | S:2 |
| `modules/metrics/scope-select.js` | 99 | 6 | 6 | 2 | DATA:2, S:5 |
| `modules/metrics/scope.js` | 149 | 8 | 7 | 8 | DATA:2, S:8 |
| `modules/metrics/similarity-concepts.js` | 493 | 45 | 22 | 3 | S:4, MET:23 |
| `modules/metrics/similarity-philosophers.js` | 166 | 11 | 7 | 2 | S:3, MET:3 |
| `modules/metrics/tension-cache.js` | 13 | 1 | 1 | 1 | S:2 |
| `modules/metrics/tradition-bridging.js` | 89 | 4 | 3 | 2 | S:4, MET:1 |
| `modules/modal/assembly.js` | 56 | 3 | 3 | 2 | — |
| `modules/modal/auth.js` | 220 | 9 | 4 | 8 | S:1 |
| `modules/modal/commits.js` | 444 | 32 | 19 | 7 | — |
| `modules/modal/concept-view.js` | 442 | 12 | 2 | 10 | DATA:5, VIEWS:1 |
| `modules/modal/conflict.js` | 88 | 5 | 5 | 7 | — |
| `modules/modal/connection-edit.js` | 289 | 9 | 5 | 13 | DATA:2, VIEWS:1 |
| `modules/modal/connection-view.js` | 421 | 11 | 5 | 12 | DATA:5, VIEWS:1 |
| `modules/modal/context.js` | 11 | 1 | 1 | 0 | — |
| `modules/modal/core.js` | 159 | 7 | 5 | 10 | S:1 |
| `modules/modal/descriptions.js` | 162 | 10 | 6 | 0 | — |
| `modules/modal/dirty.js` | 116 | 5 | 1 | 6 | DATA:2 |
| `modules/modal/edit-forms.js` | 297 | 2 | 2 | 12 | DATA:5, VIEWS:2 |
| `modules/modal/edit-rights.js` | 61 | 4 | 4 | 4 | — |
| `modules/modal/entry.js` | 124 | 12 | 12 | 11 | DATA:3, S:2 |
| `modules/modal/forms.js` | 212 | 15 | 12 | 3 | S:1 |
| `modules/modal/history.js` | 114 | 7 | 4 | 5 | — |
| `modules/modal/integrity.js` | 265 | 11 | 7 | 7 | DATA:4 |
| `modules/modal/persist.js` | 467 | 11 | 6 | 14 | DATA:9, S:1 |
| `modules/modal/philosopher-view.js` | 668 | 4 | 1 | 15 | DATA:6, VIEWS:1 |
| `modules/modal/profile-concept.js` | 182 | 8 | 4 | 8 | DATA:4, S:3, MET:19 |
| `modules/modal/profile-philosopher.js` | 121 | 2 | 2 | 8 | DATA:3, S:3, MET:3 |
| `modules/modal/search.js` | 43 | 3 | 3 | 1 | — |
| `modules/modal/security.js` | 116 | 7 | 4 | 4 | S:1 |
| `modules/modal/selection-list.js` | 334 | 24 | 13 | 8 | DATA:5 |
| `modules/modal/users.js` | 97 | 8 | 7 | 3 | — |
| `modules/paths/analysis.js` | 74 | 2 | 2 | 7 | DATA:2 |
| `modules/paths/chronology.js` | 175 | 10 | 6 | 4 | DATA:1, S:1 |
| `modules/paths/path-descriptions.js` | 180 | 4 | 3 | 9 | DATA:2, S:2 |
| `modules/paths/path-ui.js` | 423 | 8 | 5 | 11 | DATA:4, S:7 |
| `modules/paths/shortest-path.js` | 203 | 4 | 1 | 5 | DATA:2, S:4 |
| `modules/render/canvas-core.js` | 38 | 7 | 7 | 3 | S:2 |
| `modules/render/d3-layer.js` | 106 | 11 | 9 | 7 | DATA:2, S:1 |
| `modules/render/draw-link.js` | 73 | 6 | 6 | 6 | S:1 |
| `modules/render/geometry.js` | 105 | 9 | 4 | 4 | S:1 |
| `modules/render/grouping.js` | 115 | 7 | 3 | 7 | DATA:1, S:6 |
| `modules/render/interactions.js` | 318 | 8 | 4 | 20 | DATA:1, S:3 |
| `modules/render/loop.js` | 20 | 4 | 2 | 0 | — |
| `modules/render/metric-visualization.js` | 371 | 10 | 3 | 5 | DATA:4, S:2 |
| `modules/render/picking.js` | 95 | 6 | 3 | 9 | DATA:2 |
| `modules/render/render-state.js` | 47 | 10 | 10 | 3 | S:1 |
| `modules/render/scene.js` | 353 | 18 | 8 | 13 | DATA:4, S:5 |
| `modules/render/selection.js` | 261 | 8 | 7 | 11 | DATA:2, S:2 |
| `modules/render/similarity-overlay.js` | 256 | 10 | 5 | 9 | DATA:4, S:1 |
| `modules/render/simulation.js` | 128 | 11 | 8 | 11 | DATA:2, S:4 |
| `modules/render/tooltip-el.js` | 7 | 1 | 1 | 1 | — |
| `modules/state/edit.js` | 15 | 1 | 1 | 1 | S:1 |
| `modules/state/filters.js` | 20 | 3 | 3 | 2 | DATA:3, S:4 |
| `modules/state/metrics-scope.js` | 13 | 0 | 0 | 1 | S:5 |
| `modules/state/paths.js` | 18 | 0 | 0 | 2 | S:7 |
| `modules/state/render.js` | 137 | 12 | 11 | 5 | DATA:5, S:9 |
| `modules/state/stats.js` | 33 | 0 | 0 | 1 | S:15 |
| `modules/stats/coverage.js` | 66 | 3 | 3 | 6 | S:3, MET:19 |
| `modules/stats/modal.js` | 269 | 10 | 9 | 19 | DATA:2, S:10 |
| `modules/stats/observations.js` | 223 | 11 | 5 | 6 | S:1 |
| `modules/stats/results.js` | 416 | 11 | 8 | 5 | S:3 |
| `modules/stats/run.js` | 128 | 4 | 1 | 3 | S:1, MET:6 |
| `modules/stats/views/advanced.js` | 275 | 10 | 10 | 4 | DATA:3, MET:10 |
| `modules/stats/views/comparison.js` | 508 | 12 | 12 | 11 | DATA:4, S:11 |
| `modules/stats/views/network.js` | 223 | 9 | 9 | 4 | DATA:2, S:2, MET:1 |
| `modules/stats/views/philosopher.js` | 171 | 4 | 4 | 6 | DATA:3, MET:3 |
| `modules/stats/views/philosophical.js` | 474 | 12 | 12 | 8 | DATA:3, S:2, MET:10 |
| `modules/stats/views/rankings.js` | 141 | 2 | 2 | 5 | DATA:2, S:1 |
| `modules/ui/about.js` | 102 | 4 | 3 | 1 | DATA:6 |
| `modules/ui/actions-byname.js` | 20 | 2 | 0 | 2 | — |
| `modules/ui/actions-dyn.js` | 187 | 0 | 0 | 38 | DATA:1, S:9 |
| `modules/ui/actions-static.js` | 140 | 0 | 0 | 26 | — |
| `modules/ui/actions.js` | 27 | 1 | 3 | 0 | — |
| `modules/ui/delegation.js` | 70 | 3 | 1 | 1 | — |
| `modules/ui/export.js` | 138 | 2 | 2 | 11 | DATA:4, S:2 |
| `modules/ui/hint.js` | 60 | 7 | 4 | 1 | S:1 |
| `modules/ui/legend.js` | 392 | 29 | 25 | 7 | DATA:9, S:9 |
| `modules/ui/link-state.js` | 282 | 13 | 6 | 17 | DATA:5, S:11 |
| `modules/ui/notifications.js` | 99 | 10 | 8 | 2 | — |
| `modules/ui/panels.js` | 40 | 2 | 2 | 0 | — |
| `modules/ui/search-legend.js` | 141 | 7 | 6 | 17 | S:2 |
| `modules/ui/search-link.js` | 135 | 7 | 5 | 12 | DATA:3, S:2 |
| `modules/ui/search-philosopher.js` | 98 | 7 | 6 | 6 | DATA:3 |
| `modules/util/color.js` | 23 | 1 | 1 | 0 | — |
| `modules/util/html.js` | 95 | 12 | 11 | 0 | — |
| `modules/util/philosopher-label.js` | 40 | 7 | 5 | 3 | DATA:1 |
| `modules/util/ru.js` | 49 | 3 | 3 | 0 | — |
| `modules/widgets/custom-select.js` | 103 | 6 | 4 | 5 | S:4 |

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

### `modules/core/api.js` — 90 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `detectServerMode` | async function | 36 | да |
| `api` | async function | 34 | да |
| `readCookie` | function | 10 | — |
| `serverMode` | let | 1 | да |

### `modules/core/events.js` — 66 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `subscribe` | function | 17 | да |
| `emit` | function | 17 | да |
| `BUS_EVENTS` | const | 1 | — |
| `busSubscribers` | const | 1 | — |
| `BUS_PHASES` | const | 1 | — |

### `modules/core/graph-index.js` — 238 строк, объявлений 19

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildIndexes` | function | 75 | — |
| `rebuildIndexes` | function | 51 | да |
| `comparePhilosophers` | function | 14 | да |
| `compareLinks` | function | 12 | да |
| `buildRubricsIndex` | function | 8 | да |
| `withoutEmptyOptional` | function | 8 | да |
| `otherEndColor` | function | 7 | да |
| `buildConceptToRubrics` | function | 5 | да |
| `linkIsInternal` | function | 5 | да |
| `storedRecord` | function | 5 | да |
| `compareConcepts` | function | 4 | да |
| `buildPhilosopherTraditions` | function | 3 | да |
| `conceptById` | const | 1 | да |
| `philosopherByName` | const | 1 | да |
| `traditionById` | const | 1 | да |
| `rubricById` | const | 1 | да |
| `nodesByPhilosopher` | const | 1 | да |
| `linksByConcept` | const | 1 | да |
| `OMITTED_WHEN_EMPTY` | const | 1 | — |

### `modules/core/link-facts.js` — 86 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `orientLink` | function | 12 | да |
| `directionMark` | function | 12 | да |
| `buildReflexiveMap` | function | 9 | да |
| `isSymmetricLink` | function | 6 | да |
| `isReflexiveLink` | function | 5 | да |
| `linksBothWays` | function | 5 | да |
| `linkHasTwoHeads` | function | 5 | да |
| `isTypologicalLink` | function | 4 | да |
| `reflexiveLinkOf` | function | 4 | да |
| `otherPhilosopher` | function | 4 | да |
| `sumWeight` | function | 3 | да |

### `modules/core/long-task.js` — 121 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showTemporaryMessage` | function | 30 | да |
| `LoadingIndicator` | const | 1 | да |
| `CHAIN_SEARCH` | const | 1 | да |

### `modules/core/ns.js` — 33 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `FILES` | const | 1 | — |
| `loaded` | const | 1 | — |

### `modules/core/perms.js` — 28 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `PERM` | const | 1 | да |
| `granted` | let | 1 | — |
| `setPermissions` | function | 1 | да |
| `can` | function | 1 | да |

### `modules/core/relation-types.js` — 59 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `relationHint` | function | 11 | да |
| `RELATION_HINTS` | const | 1 | — |
| `LAYER_NAMES` | const | 1 | да |
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

### `modules/core/session.js` — 23 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `setSessionUser` | function | 11 | да |
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

### `modules/data/backend.js` — 121 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `sendCommit` | async function | 58 | — |
| `reportSubmit` | function | 19 | да |
| `submitChange` | function | 17 | да |
| `commitMessageFor` | function | 9 | — |
| `lastSubmitted` | let | 1 | да |
| `noticeTimer` | let | 1 | — |
| `lastSubmitResult` | let | 1 | да |

### `modules/data/commit-draft.js` — 37 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `describeChange` | function | 17 | да |
| `sameValue` | function | 14 | — |

### `modules/data/mutate.js` — 89 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `rebuildDerivedIndexes` | function | 36 | — |
| `afterDataChange` | function | 36 | да |
| `rebuildPhilosopherTraditions` | function | 4 | — |

### `modules/data/remote.js` — 174 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `rebuildDerived` | function | 43 | — |
| `connectLive` | function | 33 | да |
| `pullGraphSince` | async function | 30 | да |
| `applyIncrement` | function | 18 | — |
| `applyFreshGraph` | function | 17 | да |
| `replaceEntity` | function | 9 | — |
| `knownGraphVersion` | let | 1 | да |
| `liveSocket` | let | 1 | да |
| `liveRetry` | let | 1 | — |

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

### `modules/filters/filters.js` — 443 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handleUniqueChainsMode` | async function | 65 | — |
| `handleChainsMode` | async function | 59 | — |
| `applyBasicFilter` | function | 52 | — |
| `applyFiltersImmediate` | function | 22 | да |
| `cleanupInvisibleSelections` | function | 14 | — |
| `debounce` | function | 11 | — |
| `applyChainVisibility` | function | 7 | — |
| `refreshMetricsIfScoped` | function | 7 | — |
| `sharesTradition` | function | 5 | — |
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

### `modules/graph/graph-data.js` — 121 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `forgetNode` | function | 18 | да |
| `addNodeToGraph` | function | 15 | да |
| `getConceptConnections` | function | 11 | да |
| `addLinkToGraph` | function | 11 | да |
| `findConnection` | function | 9 | да |
| `updateLinkOnGraph` | function | 8 | да |
| `forgetLink` | function | 8 | да |
| `connectionsBetween` | function | 8 | да |
| `traditionsOfPhilosopher` | function | 5 | да |
| `updateNodeOnGraph` | function | 4 | да |

### `modules/graph/graph-selection.js` — 61 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectConceptOnGraph` | function | 31 | да |
| `cancelGraphSelection` | function | 14 | да |
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

### `modules/metrics/graph-cache.js` — 129 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildGlobalGraphCache` | function | 117 | да |
| `graphCache` | let | 1 | — |
| `invalidateGraphCache` | function | 1 | да |

### `modules/metrics/link-indexes.js` — 122 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initializePhilosophyMetrics` | function | 68 | да |
| `buildOutgoingLinks` | function | 17 | — |
| `buildIncomingLinks` | function | 14 | — |
| `initializeMetricsData` | function | 10 | — |

### `modules/metrics/network.js` — 950 строк, объявлений 26

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `calculateBetweennessAsync` | async function | 166 | да |
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
| `WEIGHTED_CLUSTERING_MIN_DEGREE` | const | 1 | — |
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

### `modules/metrics/philosophical.js` — 1130 строк, объявлений 25

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
| `FORMULA_VERSIONS` | const | 1 | да |
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
| `MUTUAL_DIALOGUE_BONUS` | const | 1 | — |
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

### `modules/metrics/scope.js` — 149 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `applyMetricsScope` | function | 36 | да |
| `updateScopeToggles` | function | 33 | да |
| `installMetricScopeWrappers` | function | 18 | да |
| `metricsScopeCounts` | function | 10 | да |
| `metricScopeFactor` | function | 9 | — |
| `handleMetricsScopeChange` | function | 9 | да |
| `updateMetricsScopeHint` | function | 6 | да |
| `liveScopeKey` | function | 4 | да |

### `modules/metrics/similarity-concepts.js` — 493 строк, объявлений 45

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `allConceptPairsAsync` | async function | 63 | да |
| `nearestConcepts` | function | 51 | да |
| `similarityData` | function | 48 | да |
| `ensureNetworkProfile` | function | 38 | да |
| `similarityThresholds` | function | 28 | да |
| `zColumns` | function | 15 | — |
| `typeStyleData` | function | 15 | — |
| `networkSimilarityData` | function | 15 | да |
| `structuralSimilarity` | function | 13 | да |
| `neighborSets` | function | 12 | — |
| `fillPairsNetwork` | function | 11 | да |
| `networkRoleOf` | function | 11 | да |
| `networkProgressPercent` | function | 10 | да |
| `invalidateSimilarityCache` | function | 9 | да |
| `profileSimilarity` | function | 9 | да |
| `metricValueMap` | function | 9 | — |
| `allConceptPairs` | function | 8 | да |
| `typeProfileOf` | function | 7 | — |
| `networkSimilarity` | function | 7 | да |
| `similarityOf` | function | 7 | — |
| `centerRows` | function | 6 | — |
| `normedDot` | function | 6 | — |
| `typeStyleSimilarity` | function | 6 | да |
| `vectorNorm` | function | 5 | — |
| `profileIsMeaningful` | function | 3 | да |
| `similarityNeedsDegree` | function | 3 | да |
| `_simCache` | let | 1 | да |
| `_pairCache` | let | 1 | — |
| `_pairCalculating` | let | 1 | да |
| `PAIRS_CHUNK_ROWS` | const | 1 | — |
| `_neighborCache` | let | 1 | — |
| `_typeStyleCache` | let | 1 | — |
| `NETWORK_SIM_NAMES` | const | 1 | — |
| `NETWORK_ROLE_OF` | const | 1 | — |
| `NETWORK_ROLE_WORDS` | const | 1 | да |
| `_netSimCache` | let | 1 | — |
| `_netSimPending` | let | 1 | — |
| `NETWORK_PROGRESS_WEIGHTS` | const | 1 | — |
| `_netProgress` | let | 1 | — |
| `_netProgressListeners` | const | 1 | — |
| `SIGNED_SIMILARITY` | const | 1 | да |
| `SIM_VERDICT_HIGH_Q` | const | 1 | — |
| `SIM_VERDICT_LOW_Q` | const | 1 | — |
| `SIM_SHARED_HIGH` | const | 1 | да |
| `_simThresholdCache` | let | 1 | — |

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

### `modules/modal/assembly.js` — 56 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `modalContentFor` | function | 18 | да |
| `modalActions` | function | 15 | да |
| `modalEntityExists` | function | 13 | да |

### `modules/modal/auth.js` — 220 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `submitAuth` | async function | 96 | да |
| `openAuthModal` | function | 29 | да |
| `authLogout` | function | 24 | да |
| `showAuthNotice` | function | 14 | — |
| `authNoticeAdmin` | function | 13 | — |
| `closeAuthModal` | function | 10 | да |
| `authNoticeMember` | function | 6 | — |
| `authError` | function | 4 | — |
| `authModalEl` | function | 1 | — |

### `modules/modal/commits.js` — 444 строк, объявлений 32

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderCommits` | function | 74 | — |
| `layoutTabHtml` | function | 49 | — |
| `provenanceDiff` | function | 32 | — |
| `describeImpact` | function | 26 | — |
| `applyRelayout` | async function | 22 | да |
| `footnotesDiff` | function | 22 | — |
| `doLayoutRevert` | async function | 18 | да |
| `reviewCommitFromPanel` | async function | 17 | да |
| `showImpact` | async function | 16 | да |
| `loadCommits` | async function | 15 | да |
| `layoutHistoryHtml` | function | 15 | — |
| `switchCommitTab` | function | 14 | да |
| `revertCommitFromPanel` | async function | 14 | да |
| `planRelayout` | async function | 12 | да |
| `refreshEditCount` | function | 7 | — |
| `openCommitsPanel` | function | 6 | да |
| `loadLayoutHistory` | async function | 5 | да |
| `askLayoutRevert` | function | 5 | да |
| `closeCommitsPanel` | function | 4 | да |
| `stateInWords` | function | 4 | — |
| `commitStateWords` | function | 3 | — |
| `commitStateKind` | function | 3 | — |
| `commitTab` | let | 1 | да |
| `commitItems` | let | 1 | да |
| `commitError` | let | 1 | да |
| `layoutPlan` | let | 1 | да |
| `layoutError` | let | 1 | — |
| `layoutHistoryItems` | let | 1 | да |
| `layoutRevertTo` | let | 1 | да |
| `cancelLayoutRevert` | function | 1 | да |
| `COMMIT_STATES` | const | 1 | — |
| `LAYOUT_KINDS` | const | 1 | — |

### `modules/modal/concept-view.js` — 442 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `similarConceptsBlock` | function | 52 | — |
| `similarNetworkColumnHtml` | function | 20 | — |
| `similarProfileColumnHtml` | function | 16 | — |
| `similarItemHtml` | function | 15 | — |
| `computeSimilarNetworkColumn` | function | 13 | да |
| `similarColumnHtml` | function | 10 | — |
| `forceSimilarColumn` | function | 9 | да |
| `refreshSimilarColumn` | function | 8 | — |
| `forceButtonHtml` | function | 4 | — |
| `similarForced` | function | 3 | — |
| `refreshSimilarNetworkColumn` | function | 3 | — |
| `_forcedSimilar` | let | 1 | — |

### `modules/modal/conflict.js` — 88 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showConflict` | function | 31 | да |
| `rebuildOverCurrent` | async function | 22 | да |
| `warnRemoteEdit` | function | 14 | да |
| `closeConflictModal` | function | 4 | да |
| `lastConflict` | let | 1 | да |

### `modules/modal/connection-edit.js` — 289 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `onConnTypeChange` | function | 39 | да |
| `handleConnectionEditSearch` | function | 29 | — |
| `updateConnEditPairNote` | function | 25 | — |
| `swapConnectionConcepts` | function | 20 | да |
| `selectConnectionEditConcept` | function | 18 | да |
| `setupConnectionEditSearchHandlers` | function | 13 | — |
| `connEditSelectedBlock` | function | 9 | — |
| `createNewConnectionForConcept` | function | 7 | да |
| `createNewConceptForPhilosopher` | function | 3 | да |

### `modules/modal/connection-view.js` — 421 строк, объявлений 11

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

### `modules/modal/core.js` — 159 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `openUniversalModal` | function | 67 | да |
| `closeUniversalModal` | function | 28 | да |
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

### `modules/modal/dirty.js` — 116 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `hasConnectionChanges` | function | 28 | — |
| `hasPhilosopherChanges` | function | 23 | — |
| `hasUnsavedChanges` | function | 20 | да |
| `hasConceptChanges` | function | 20 | — |
| `hasFilledFields` | function | 10 | — |

### `modules/modal/edit-forms.js` — 297 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updatePhilColorSample` | function | 17 | да |
| `syncPhilColorFromPicker` | function | 6 | да |

### `modules/modal/edit-rights.js` — 61 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderAuthControls` | function | 19 | да |
| `refreshEditHints` | function | 15 | да |
| `refreshOpenModalToolbar` | function | 9 | да |
| `philRowTip` | function | 5 | да |

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

### `modules/modal/forms.js` — 212 строк, объявлений 15

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `provenanceField` | function | 22 | да |
| `insertFootnote` | function | 22 | да |
| `refreshFootnoteRows` | function | 19 | да |
| `refreshProvenanceField` | function | 17 | да |
| `footnotesValue` | function | 17 | да |
| `installFootnoteLinks` | function | 16 | да |
| `footnoteRow` | function | 15 | — |
| `footnotesField` | function | 15 | да |
| `provenanceValue` | function | 12 | да |
| `commitReasonField` | function | 9 | да |
| `removeFootnote` | function | 7 | да |
| `footnotesChanged` | function | 5 | да |
| `footnoteHosts` | function | 4 | — |
| `needsCitation` | function | 3 | — |
| `PROVENANCE_STATES` | const | 1 | да |

### `modules/modal/history.js` — 114 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderEntityHistory` | function | 39 | да |
| `revertEntityToVersion` | async function | 20 | да |
| `toggleEntityHistory` | async function | 18 | да |
| `historyBlock` | function | 17 | да |
| `historyFor` | let | 1 | — |
| `historyItems` | let | 1 | — |
| `historyBusy` | let | 1 | — |

### `modules/modal/integrity.js` — 265 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `connectionIntegrityWarnings` | function | 138 | да |
| `groundingCyclePath` | function | 37 | — |
| `conceptIntegrityWarnings` | function | 18 | да |
| `philosopherIntegrityWarnings` | function | 16 | да |
| `activityOverlap` | function | 12 | — |
| `provenanceDriftWarning` | function | 10 | да |
| `relationIndexById` | function | 4 | да |
| `GROUNDING_TYPES` | const | 1 | — |
| `nConcepts` | const | 1 | да |
| `nLinks` | const | 1 | да |
| `labelOf` | const | 1 | — |

### `modules/modal/persist.js` — 467 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `savePhilosopherData` | function | 107 | да |
| `saveConnectionData` | function | 100 | да |
| `saveConceptData` | function | 83 | да |
| `deleteConnection` | function | 49 | да |
| `deletePhilosopher` | function | 41 | да |
| `deleteConcept` | function | 31 | да |
| `removeConceptEverywhere` | function | 8 | — |
| `removeLinkEverywhere` | function | 7 | — |
| `confirmWarnings` | function | 5 | — |
| `provenanceFields` | function | 4 | — |
| `generateId` | function | 3 | — |

### `modules/modal/philosopher-view.js` — 668 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `makeLegendsEditable` | function | 81 | да |
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

### `modules/modal/security.js` — 116 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `startMfaEnroll` | async function | 31 | да |
| `confirmMfaEnroll` | async function | 30 | да |
| `openSecurityModal` | async function | 28 | да |
| `refreshSecurityDone` | function | 5 | да |
| `securityError` | function | 4 | — |
| `securitySecret` | let | 1 | — |
| `securityModalEl` | function | 1 | — |

### `modules/modal/selection-list.js` — 334 строк, объявлений 24

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderSelectionList` | function | 83 | да |
| `selectionListSets` | function | 64 | да |
| `selectionRowRelation` | function | 32 | — |
| `selectionRowPhilosopher` | function | 15 | — |
| `selectionRowConcept` | function | 15 | — |
| `openSelectionListModal` | function | 12 | да |
| `toggleSelectionBodies` | function | 11 | да |
| `setSelectionProvenance` | function | 9 | да |
| `provenanceKinds` | function | 8 | — |
| `openSelectionLink` | function | 7 | да |
| `provenanceState` | function | 6 | да |
| `toggleSelectionBlock` | function | 5 | да |
| `toggleSelectionBody` | function | 5 | да |
| `closeSelectionListModal` | function | 4 | да |
| `selectionListMore` | function | 4 | да |
| `selectionLabel` | function | 4 | — |
| `selectionListOpenBlocks` | let | 1 | да |
| `selectionListOpenBodies` | let | 1 | — |
| `SELECTION_LIST_CHUNK` | const | 1 | — |
| `selectionListShown` | let | 1 | — |
| `selectionProvenance` | let | 1 | — |
| `PROVENANCE_LABELS` | const | 1 | — |
| `selectionPhilCount` | let | 1 | — |
| `selectionMirrorCount` | let | 1 | да |

### `modules/modal/users.js` — 97 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderUsers` | function | 26 | — |
| `loadUsers` | async function | 17 | да |
| `banUserFromPanel` | async function | 14 | да |
| `changeUserRoleFromPanel` | async function | 13 | да |
| `openUsersPanel` | function | 6 | да |
| `closeUsersPanel` | function | 4 | да |
| `userItems` | let | 1 | да |
| `usersError` | let | 1 | да |

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

### `modules/paths/path-descriptions.js` — 180 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showPathDescriptionsModal` | function | 128 | да |
| `togglePathNodesDescriptions` | function | 18 | да |
| `closePathDescriptionsModal` | function | 15 | да |
| `nodesDescriptionsVisible` | let | 1 | — |

### `modules/paths/path-ui.js` — 423 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findAndShowPath` | function | 271 | да |
| `handlePathArrowHover` | function | 39 | да |
| `resolvePathLinkList` | function | 37 | да |
| `initPathFinder` | function | 23 | да |
| `highlightPath` | function | 18 | — |
| `clearPathHighlight` | function | 7 | да |
| `arrowHoverTimer` | let | 1 | — |
| `ARROW_HOVER_DELAY` | const | 1 | — |

### `modules/paths/shortest-path.js` — 203 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findShortestPathWeighted` | function | 102 | — |
| `findShortestPathUnweighted` | function | 69 | — |
| `findShortestPath` | function | 10 | да |
| `pathLinkAllowed` | function | 9 | — |

### `modules/render/canvas-core.js` — 38 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `resizeCanvas` | function | 8 | да |
| `gfxCanvas` | const | 1 | да |
| `ctx` | const | 1 | да |
| `gfxSvg` | const | 1 | да |
| `PICK_LINK_WIDTH` | const | 1 | да |
| `dpr` | let | 1 | да |
| `renderState` | const | 1 | да |

### `modules/render/d3-layer.js` — 106 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `subSelection` | function | 23 | — |
| `makeClassed` | function | 15 | — |
| `dragMoveStarted` | function | 8 | да |
| `dragended` | function | 5 | да |
| `nodeHandlers` | const | 1 | да |
| `linkHandlers` | const | 1 | да |
| `gfxNode` | const | 1 | да |
| `gfxLink` | const | 1 | да |
| `gfxLinkAll` | const | 1 | да |
| `updateArrows` | function | 1 | да |
| `gfxZoom` | const | 1 | да |

### `modules/render/draw-link.js` — 73 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `linkDrawAlpha` | function | 21 | да |
| `strokeLinkShape` | function | 10 | да |
| `fillLinkHeads` | function | 10 | да |
| `linkDrawWidth` | function | 8 | да |
| `linkVisualState` | function | 7 | да |
| `CONTRADICTION_DASH` | const | 1 | да |

### `modules/render/geometry.js` — 105 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `linkShape` | function | 20 | да |
| `loopShape` | function | 16 | — |
| `arcParams` | function | 15 | — |
| `clippedArc` | function | 10 | да |
| `arrowSize` | function | 8 | — |
| `arcHead` | function | 8 | — |
| `linkStrokeWidth` | function | 4 | да |
| `linkHoverStrokeWidth` | function | 4 | да |
| `arcAngleOfChord` | function | 3 | — |

### `modules/render/grouping.js` — 115 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleGrouping` | function | 39 | да |
| `installResize` | function | 38 | да |
| `buildGroupPositions` | function | 10 | да |
| `philosopherNames` | const | 1 | — |
| `groupPositions` | const | 1 | — |
| `cols` | const | 1 | — |
| `rows` | const | 1 | — |

### `modules/render/interactions.js` — 318 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `installLinkHover` | function | 127 | да |
| `installNodeDrag` | function | 48 | да |
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
| `visualizeMetricBySize` | function | 111 | — |
| `updateVisualizationControlSection` | function | 40 | — |
| `resetNodeSizes` | function | 38 | да |
| `updateVisualizationButtonText` | function | 16 | — |
| `saveOriginalRadii` | function | 11 | да |
| `isVisualizingBySize` | let | 1 | — |
| `currentVisualizedMetric` | let | 1 | — |
| `originalRadii` | let | 1 | — |
| `originalTextDy` | let | 1 | — |

### `modules/render/picking.js` — 95 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `pickLink` | function | 36 | да |
| `hitLinkShape` | function | 16 | — |
| `pickNode` | function | 10 | да |
| `pointInTriangle` | function | 5 | — |
| `distToSegment` | function | 5 | — |
| `toGraph` | function | 4 | да |

### `modules/render/render-state.js` — 47 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `nodeEdgeWidth` | function | 16 | да |
| `nodeDrawPass` | function | 6 | да |
| `LABEL_HIDE_BELOW` | const | 1 | да |
| `LABEL_ALL_ABOVE` | const | 1 | да |
| `nodeRadius` | function | 1 | да |
| `nodeLabelDy` | function | 1 | да |
| `hasNodeClass` | function | 1 | да |
| `hasLinkClass` | function | 1 | да |
| `NODE_PASSES` | const | 1 | да |
| `nodeOuterRadius` | function | 1 | да |

### `modules/render/scene.js` — 353 строк, объявлений 18

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderScene` | function | 137 | да |
| `drawLinkSet` | function | 42 | — |
| `linksLayerKey` | function | 23 | — |
| `updateGraphData` | function | 22 | да |
| `paintLinkLayer` | function | 21 | — |
| `stepRadiusAnimation` | function | 13 | — |
| `graphIsCovered` | function | 10 | — |
| `ensureAnimLoop` | function | 9 | да |
| `draw` | function | 9 | да |
| `needsContinuousAnimation` | function | 8 | да |
| `startRadiusAnimation` | function | 6 | да |
| `linkDrawnLive` | function | 5 | да |
| `sameLayerKey` | function | 5 | — |
| `linkOutOfLayer` | function | 4 | — |
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

### `modules/render/similarity-overlay.js` — 256 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showSimilarityOverlay` | function | 126 | да |
| `updateSimilarityLegend` | function | 49 | — |
| `similarityLinkCount` | function | 13 | — |
| `linkAmongHighlighted` | function | 12 | да |
| `similarityColor` | function | 9 | да |
| `nodeLitBySimilarity` | function | 9 | — |
| `setSimilarityLinks` | function | 7 | да |
| `clearSimilarityOverlay` | function | 6 | да |
| `SIMILARITY_KEEP_QUANTILE` | const | 1 | — |
| `SIMILARITY_ARCS` | const | 1 | — |

### `modules/render/simulation.js` — 128 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `unfreezeSimulation` | function | 17 | да |
| `installSimulationTick` | function | 16 | да |
| `installSimulationStatsEnd` | function | 12 | да |
| `updateFreezeButton` | function | 12 | — |
| `toggleSimulationFreeze` | function | 11 | да |
| `resetSimulation` | function | 9 | да |
| `centerGraph` | function | 9 | да |
| `installSimulationLog` | function | 5 | да |
| `freezeSimulation` | function | 4 | да |
| `maxTicksFor` | const | 1 | — |
| `simLockedByHand` | let | 1 | — |

### `modules/render/tooltip-el.js` — 7 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `tooltip` | const | 1 | да |

### `modules/state/edit.js` — 15 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `editMode` | let | 1 | да |

### `modules/state/filters.js` — 20 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `chosenPhilosophers` | const | 1 | да |
| `pinnedDespiteFilter` | const | 1 | да |
| `pinnedVisibleNodes` | const | 1 | да |

### `modules/state/render.js` — 137 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `applyServerLayout` | function | 32 | да |
| `applyStoredLayout` | function | 29 | да |
| `graphFingerprint` | function | 15 | да |
| `installLayoutPull` | function | 5 | да |
| `resetLayoutClock` | function | 4 | да |
| `storedLayoutComplaint` | let | 1 | да |
| `linkLayer` | const | 1 | да |
| `layoutFromStore` | const | 1 | да |
| `LAYOUT_PULL` | const | 1 | — |
| `pullStrengthOf` | const | 1 | да |
| `selectedNodes` | let | 1 | да |
| `selectedEdges` | let | 1 | да |

### `modules/stats/coverage.js` — 66 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `metricCoverage` | function | 16 | да |
| `generateMetricCoverageBlock` | function | 12 | да |
| `METRIC_COVERAGE_WARN` | const | 1 | да |

### `modules/stats/modal.js` — 269 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `loadStatsContent` | function | 69 | да |
| `closeStatsModal` | function | 43 | да |
| `openStatsModal` | function | 39 | да |
| `handleStatsParameterChange` | function | 32 | да |
| `switchStatsView` | function | 17 | да |
| `updateActiveNavItem` | function | 10 | да |
| `installStatsModalDismiss` | function | 9 | да |
| `installStatsEscape` | function | 7 | да |
| `refreshObservationsNav` | function | 5 | да |
| `observationsAllowed` | function | 3 | — |

### `modules/stats/observations.js` — 223 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderObservations` | function | 46 | — |
| `observationValues` | function | 27 | — |
| `compareObservationsInPanel` | async function | 27 | — |
| `saveObservation` | async function | 25 | да |
| `loadObservations` | async function | 23 | — |
| `observationBar` | function | 21 | да |
| `deleteObservation` | async function | 18 | да |
| `pickObservation` | function | 7 | да |
| `generateObservationsContent` | function | 6 | да |
| `observationItems` | let | 1 | — |
| `observationPicked` | let | 1 | — |

### `modules/stats/results.js` — 416 строк, объявлений 11

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

### `modules/stats/views/comparison.js` — 508 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderClosestPairs` | async function | 108 | да |
| `renderComparison` | function | 68 | да |
| `renderPhilosopherComparison` | function | 63 | да |
| `similarityVerdict` | function | 49 | да |
| `generateComparisonContent` | function | 48 | да |
| `generateClosestPairsContent` | function | 42 | да |
| `renderPhilosopherPairs` | function | 33 | да |
| `generatePhilosopherComparisonContent` | function | 32 | да |
| `generatePhilosopherPairsContent` | function | 21 | да |
| `computeComparisonNetwork` | function | 7 | да |
| `openPairInComparison` | function | 5 | да |
| `openPhilosopherPair` | function | 4 | да |

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

### `modules/stats/views/philosophical.js` — 474 строк, объявлений 12

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

### `modules/ui/export.js` — 138 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `exportToSVG` | function | 86 | да |
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

### `modules/ui/legend.js` — 392 строк, объявлений 29

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initFilters` | function | 89 | да |
| `updateProvenanceCoverage` | function | 45 | — |
| `toggleSection` | function | 42 | да |
| `syncTraditionRows` | function | 28 | да |
| `updateFilterStats` | function | 12 | да |
| `togglePhilosopher` | function | 8 | да |
| `toggleTradition` | function | 8 | да |
| `toggleRelation` | function | 8 | да |
| `toggleRubric` | function | 8 | да |
| `toggleUniformLinkWidth` | function | 8 | да |
| `traditionMembers` | function | 7 | да |
| `selectAllPhilosophers` | function | 7 | да |
| `deselectAllPhilosophers` | function | 7 | да |
| `selectAllRelations` | function | 7 | да |
| `deselectAllRelations` | function | 7 | да |
| `selectAllRubrics` | function | 7 | да |
| `deselectAllRubrics` | function | 7 | да |
| `markChosenInLegend` | function | 6 | да |
| `syncPhilosopherCheckboxes` | function | 6 | да |
| `resetTradition` | function | 5 | да |
| `selectAllTraditions` | function | 5 | да |
| `deselectAllTraditions` | function | 5 | да |
| `onlyTradition` | function | 5 | да |
| `changeFilterMode` | function | 4 | да |
| `syncLegendWeightsToggle` | function | 3 | да |
| `syncLegendDirectionToggle` | function | 3 | да |
| `WITHOUT_TRADITION` | const | 1 | — |
| `legendWeightsToggle` | const | 1 | — |
| `legendDirectionToggle` | const | 1 | — |

### `modules/ui/link-state.js` — 282 строк, объявлений 13

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `applyLinkState` | function | 111 | да |
| `currentLinkState` | function | 63 | да |
| `hashToLinkState` | function | 15 | да |
| `initLinkState` | function | 15 | да |
| `syncLinkHash` | function | 11 | — |
| `excludedList` | function | 8 | — |
| `linkStateToHash` | function | 8 | да |
| `philosopherIdByName` | function | 4 | — |
| `philosopherNameById` | function | 4 | — |
| `LINK_KEYS` | const | 1 | — |
| `_linkApplying` | let | 1 | — |
| `_linkMissed` | let | 1 | да |
| `_linkLastHash` | let | 1 | — |

### `modules/ui/notifications.js` — 99 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderNotifyList` | function | 18 | — |
| `notifyWords` | function | 16 | — |
| `renderBell` | function | 9 | да |
| `markNotificationRead` | async function | 9 | да |
| `refreshUnread` | async function | 8 | да |
| `loadNotifications` | async function | 7 | да |
| `toggleNotifyPanel` | function | 7 | да |
| `markAllNotificationsRead` | async function | 7 | да |
| `unreadCount` | let | 1 | да |
| `notifyItems` | let | 1 | да |

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

### `modules/ui/search-link.js` — 135 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showFoundLinks` | function | 33 | — |
| `handleLegendLinkSearch` | function | 26 | да |
| `highlightLinkOnGraph` | function | 23 | да |
| `clearLinkSearch` | function | 12 | да |
| `pickLinkEnd` | function | 10 | да |
| `openLegendLinkSearch` | function | 7 | да |
| `linkSearch` | const | 1 | — |

### `modules/ui/search-philosopher.js` — 98 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handlePhilosopherSearch` | function | 26 | да |
| `handleLegendPhilSearch` | function | 23 | да |
| `pickPhilosophers` | function | 10 | — |
| `clearPhilosopherSearch` | function | 8 | да |
| `clearLegendPhilSearch` | function | 6 | да |
| `pickPhilosopherFromSearch` | function | 4 | да |
| `selectPhilosopherResult` | function | 4 | да |

### `modules/util/color.js` — 23 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `getContrastColor` | function | 18 | да |

### `modules/util/html.js` — 95 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `provenanceBlock` | function | 24 | да |
| `footnotesBlock` | function | 11 | да |
| `footnotedText` | function | 10 | да |
| `footnoteOrder` | function | 9 | да |
| `scrollToPickedRow` | function | 6 | да |
| `updateLiveProgress` | function | 4 | да |
| `withoutFootnotes` | function | 4 | да |
| `escapeAttr` | function | 4 | да |
| `liveProgressHtml` | function | 3 | да |
| `FOOTNOTE_MARK_SOURCE` | const | 1 | — |
| `FOOTNOTE_LABELS` | const | 1 | да |
| `FOOTNOTE_STATE_ORDER` | const | 1 | да |

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

### `modules/widgets/custom-select.js` — 103 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectCustomOption` | function | 24 | да |
| `initializeCustomSelects` | function | 16 | да |
| `populateCustomSelect` | function | 16 | — |
| `showCustomSelectDropdown` | function | 14 | да |
| `filterCustomSelect` | function | 11 | да |
| `pickedConceptOf` | function | 7 | — |

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
- из `modules/core/api.js`: `detectServerMode`
- из `modules/core/events.js`: `emit`, `subscribe`
- из `modules/core/graph-index.js`: `rebuildIndexes`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/data/remote.js`: `connectLive`, `liveSocket`, `pullGraphSince`
- из `modules/filters/beyond-filter.js`: `resetBeyondFilter`
- из `modules/filters/filters.js`: `applyFiltersImmediate`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/modal/commits.js`: `revertCommitFromPanel`, `reviewCommitFromPanel`, `showImpact`
- из `modules/modal/conflict.js`: `showConflict`, `warnRemoteEdit`
- из `modules/modal/connection-edit.js`: `selectConnectionEditConcept`
- из `modules/modal/connection-view.js`: `selectConnectionViewConcept`
- из `modules/modal/core.js`: `modalStack`, `openUniversalModal`
- из `modules/modal/edit-rights.js`: `refreshEditHints`, `renderAuthControls`
- из `modules/modal/entry.js`: `closeDetailModal`, `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `modules/modal/forms.js`: `installFootnoteLinks`
- из `modules/modal/philosopher-view.js`: `makeLegendsEditable`
- из `modules/modal/users.js`: `banUserFromPanel`, `changeUserRoleFromPanel`
- из `modules/paths/path-ui.js`: `initPathFinder`
- из `modules/render/canvas-core.js`: `resizeCanvas`
- из `modules/render/interactions.js`: `initGraphEventHandlers`
- из `modules/render/loop.js`: `requestDraw`, `setPainter`
- из `modules/render/metric-visualization.js`: `saveOriginalRadii`
- из `modules/render/scene.js`: `draw`, `updateGraphData`
- из `modules/render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `modules/state/filters.js`: `pinnedDespiteFilter`
- из `modules/state/render.js`: `installLayoutPull`, `layoutFromStore`, `storedLayoutComplaint`
- из `modules/stats/modal.js`: `closeStatsModal`, `loadStatsContent`, `refreshObservationsNav`, `switchStatsView`
- из `modules/stats/views/comparison.js`: `renderComparison`
- из `modules/ui/legend.js`: `initFilters`, `markChosenInLegend`, `syncTraditionRows`, `updateFilterStats`
- из `modules/ui/link-state.js`: `initLinkState`
- из `modules/ui/notifications.js`: `markNotificationRead`, `refreshUnread`, `renderBell`
- из `modules/ui/panels.js`: `restorePanelStates`
- из `modules/widgets/custom-select.js`: `initializeCustomSelects`

Чаще всего поминает: `subscribe`×27, `S`×15, `updateFilterStats`×3, `saveOriginalRadii`×2, `banUserFromPanel`×2

### `main.js`

- из `modules/boot-defs.js`: _ради побочного действия_
- из `modules/core/api.js`: _ради побочного действия_
- из `modules/core/base-cells.js`: _ради побочного действия_
- из `modules/core/events.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: _ради побочного действия_
- из `modules/core/long-task.js`: _ради побочного действия_
- из `modules/core/perms.js`: _ради побочного действия_
- из `modules/core/relation-types.js`: _ради побочного действия_
- из `modules/core/search.js`: _ради побочного действия_
- из `modules/core/session.js`: _ради побочного действия_
- из `modules/core/time.js`: _ради побочного действия_
- из `modules/core/visibility.js`: _ради побочного действия_
- из `modules/data/backend.js`: _ради побочного действия_
- из `modules/data/commit-draft.js`: _ради побочного действия_
- из `modules/data/mutate.js`: _ради побочного действия_
- из `modules/data/remote.js`: _ради побочного действия_
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
- из `modules/modal/commits.js`: _ради побочного действия_
- из `modules/modal/concept-view.js`: _ради побочного действия_
- из `modules/modal/conflict.js`: _ради побочного действия_
- из `modules/modal/connection-edit.js`: _ради побочного действия_
- из `modules/modal/connection-view.js`: _ради побочного действия_
- из `modules/modal/context.js`: _ради побочного действия_
- из `modules/modal/core.js`: _ради побочного действия_
- из `modules/modal/descriptions.js`: _ради побочного действия_
- из `modules/modal/dirty.js`: _ради побочного действия_
- из `modules/modal/edit-forms.js`: _ради побочного действия_
- из `modules/modal/edit-rights.js`: _ради побочного действия_
- из `modules/modal/entry.js`: _ради побочного действия_
- из `modules/modal/forms.js`: _ради побочного действия_
- из `modules/modal/history.js`: _ради побочного действия_
- из `modules/modal/integrity.js`: _ради побочного действия_
- из `modules/modal/persist.js`: _ради побочного действия_
- из `modules/modal/philosopher-view.js`: _ради побочного действия_
- из `modules/modal/profile-concept.js`: _ради побочного действия_
- из `modules/modal/profile-philosopher.js`: _ради побочного действия_
- из `modules/modal/search.js`: _ради побочного действия_
- из `modules/modal/security.js`: _ради побочного действия_
- из `modules/modal/selection-list.js`: _ради побочного действия_
- из `modules/modal/users.js`: _ради побочного действия_
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
- из `modules/stats/observations.js`: _ради побочного действия_
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
- из `modules/ui/link-state.js`: _ради побочного действия_
- из `modules/ui/notifications.js`: _ради побочного действия_
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

### `modules/core/api.js`

- из `modules/core/session.js`: `setSessionUser`

Чаще всего поминает: `setSessionUser`×1

### `modules/core/base-cells.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×8

### `modules/core/graph-index.js`

- из `modules/core/ns.js`: `DATA`
- из `vendor/d3.js`: _ради побочного действия_

Чаще всего поминает: `DATA`×40

### `modules/core/link-facts.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×8, `DATA`×3

### `modules/core/relation-types.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `DATA`×2

### `modules/core/search.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/visibility.js`: `isNodeVisible`

Чаще всего поминает: `DATA`×5, `isNodeVisible`×1

### `modules/core/session.js`

- из `modules/core/perms.js`: `PERM`, `setPermissions`

Чаще всего поминает: `PERM`×2, `setPermissions`×1

### `modules/core/visibility.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×6

### `modules/data/backend.js`

- из `modules/core/api.js`: `api`, `serverMode`
- из `modules/core/events.js`: `emit`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/data/remote.js`: `applyFreshGraph`

Чаще всего поминает: `api`×2, `serverMode`×1, `can`×1, `PERM`×1, `applyFreshGraph`×1

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

### `modules/data/remote.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/api.js`: `api`, `serverMode`
- из `modules/core/events.js`: `emit`
- из `modules/data/mutate.js`: `afterDataChange`
- из `modules/state/render.js`: `applyServerLayout`

Чаще всего поминает: `DATA`×27, `S`×4, `serverMode`×3, `afterDataChange`×2, `api`×2

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

Чаще всего поминает: `S`×60, `DATA`×20, `emit`×10, `showTemporaryMessage`×9, `CHAIN_SEARCH`×8

### `modules/graph/click-actions.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/core/perms.js`: `PERM`, `can`
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

Чаще всего поминает: `renderState`×10, `S`×9, `DATA`×3, `pinnedVisibleNodes`×2, `updateGraphData`×2

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

Чаще всего поминает: `S`×42, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION`×1

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

Чаще всего поминает: `S`×31, `DATA`×28, `MET`×11, `buildGlobalGraphCache`×10, `conceptById`×3

### `modules/metrics/philosopher.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/philosophical.js`: `DISRUPTIVE_TYPES`, `SYSTEMATIC_TYPES`

Чаще всего поминает: `S`×17, `MET`×9, `SYSTEMATIC_TYPES`×1, `DISRUPTIVE_TYPES`×1

### `modules/metrics/philosophical.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isSymmetricLink`, `linksBothWays`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `modules/metrics/generativity.js`: `generativity`, `linkInInfluenceScope`

Чаще всего поминает: `S`×65, `sumWeight`×13, `MET`×10, `linksBothWays`×6, `linkInInfluenceScope`×2

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

Чаще всего поминает: `S`×24, `DATA`×6, `METRIC_FLAGS`×3, `initializePhilosophyMetrics`×2, `invalidateEverythingForScope`×2

### `modules/metrics/similarity-concepts.js`

- из `modules/core/ns.js`: `MET`, `S`
- из `modules/metrics/network.js`: `betweennessCache`, `calculateBetweennessAsync`, `closenessCache`, `eigenvectorCache`, `medianNodeDegree`, `nodeDegreeOf`, `pageRankCache`
- из `modules/metrics/similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

Чаще всего поминает: `MET`×23, `S`×8, `pageRankCache`×3, `betweennessCache`×3, `closenessCache`×3

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
- из `modules/modal/forms.js`: `commitReasonField`

Чаще всего поминает: `VIEWS`×2, `commitReasonField`×1

### `modules/modal/auth.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/api.js`: `api`, `detectServerMode`, `serverMode`
- из `modules/core/events.js`: `emit`
- из `modules/core/session.js`: `AUTH_ADMIN`, `authAccounts`, `setSessionUser`
- из `modules/data/remote.js`: `connectLive`, `pullGraphSince`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `toggleModalMode`
- из `modules/modal/edit-rights.js`: `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

Чаще всего поминает: `S`×6, `renderAuthControls`×6, `refreshEditHints`×6, `refreshOpenModalToolbar`×4, `authAccounts`×4

### `modules/modal/commits.js`

- из `modules/core/api.js`: `api`
- из `modules/core/events.js`: `emit`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/data/remote.js`: `pullGraphSince`
- из `modules/modal/forms.js`: `PROVENANCE_STATES`
- из `modules/util/html.js`: `FOOTNOTE_LABELS`, `escapeAttr`

Чаще всего поминает: `escapeAttr`×30, `api`×8, `can`×6, `PERM`×6, `pullGraphSince`×4

### `modules/modal/concept-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `otherEndColor`, `rubricById`, `storedRecord`
- из `modules/core/link-facts.js`: `orientLink`
- из `modules/metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `modules/metrics/similarity-concepts.js`: `ensureNetworkProfile`, `nearestConcepts`, `networkProgressPercent`, `networkSimilarityData`, `profileIsMeaningful`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/modal/history.js`: `historyBlock`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/html.js`: `footnoteOrder`, `footnotedText`, `footnotesBlock`, `liveProgressHtml`, `provenanceBlock`, `updateLiveProgress`, `withoutFootnotes`

Чаще всего поминает: `DATA`×11, `profileIsMeaningful`×5, `nearestConcepts`×5, `nodeDegreeOf`×3, `medianNodeDegree`×3

### `modules/modal/conflict.js`

- из `modules/core/api.js`: `api`
- из `modules/data/backend.js`: `reportSubmit`
- из `modules/data/remote.js`: `applyFreshGraph`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `closeUniversalModal`
- из `modules/modal/entry.js`: `openEditConceptModal`, `openEditPhilosopherModal`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `reportSubmit`×5, `escapeAttr`×5, `ModalContext`×2, `api`×1, `applyFreshGraph`×1

### `modules/modal/connection-edit.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `storedRecord`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `LAYER_NAMES`, `WEIGHT_OPTIONS`, `relationHint`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/graph/graph-data.js`: `connectionsBetween`
- из `modules/modal/assembly.js`: `modalActions`
- из `modules/modal/connection-view.js`: `initConnectionSearchFields`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/modal/forms.js`: `footnotesField`, `provenanceField`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `ModalContext`×11, `conceptById`×5, `DATA`×4, `connectionsBetween`×2, `relationHint`×2

### `modules/modal/connection-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `storedRecord`, `traditionById`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `CONN_WEIGHT_WORDS`, `WEIGHT_WORDS`, `relationHint`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/graph/graph-data.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `modules/graph/graph-selection.js`: `selectConceptOnGraph`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/history.js`: `historyBlock`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/html.js`: `footnoteOrder`, `footnotedText`, `footnotesBlock`, `provenanceBlock`

Чаще всего поминает: `DATA`×11, `ModalContext`×7, `conceptById`×5, `storedRecord`×4, `traditionsOfPhilosopher`×2

### `modules/modal/core.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`
- из `modules/modal/assembly.js`: `modalContentFor`, `modalEntityExists`
- из `modules/modal/connection-view.js`: `initConnectionSearchFields`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/dirty.js`: `hasUnsavedChanges`
- из `modules/modal/search.js`: `clearModalSearch`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`

Чаще всего поминает: `ModalContext`×17, `hasUnsavedChanges`×2, `can`×2, `PERM`×2, `emit`×2

### `modules/modal/dirty.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `philosopherByName`, `storedRecord`
- из `modules/modal/assembly.js`: `modalEntityExists`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/forms.js`: `footnotesChanged`

Чаще всего поминает: `ModalContext`×5, `footnotesChanged`×3, `philosopherByName`×2, `storedRecord`×2, `DATA`×2

### `modules/modal/edit-forms.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`, `storedRecord`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/relation-types.js`: `relationHint`
- из `modules/graph/graph-data.js`: `getConceptConnections`
- из `modules/modal/assembly.js`: `modalActions`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/modal/forms.js`: `footnotesField`, `provenanceField`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/html.js`: `escapeAttr`
- из `modules/util/philosopher-label.js`: `philosopherYears`, `sortPhilosophersByBirth`

Чаще всего поминает: `DATA`×7, `escapeAttr`×5, `VIEWS`×2, `provenanceField`×2, `footnotesField`×2

### `modules/modal/edit-rights.js`

- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/core/session.js`: `authSession`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `openUniversalModal`

Чаще всего поминает: `ModalContext`×4, `can`×2, `PERM`×2, `openUniversalModal`×1, `authSession`×1

### `modules/modal/entry.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `rubricById`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/graph/graph-data.js`: `findConnection`, `getConceptConnections`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxNode`, `gfxZoom`
- из `modules/render/selection.js`: `highlightConnected`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `openUniversalModal`×5, `conceptById`×3, `can`×3, `PERM`×3, `DATA`×3

### `modules/modal/forms.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/api.js`: `serverMode`
- из `modules/util/html.js`: `FOOTNOTE_LABELS`, `FOOTNOTE_STATE_ORDER`, `escapeAttr`, `footnoteOrder`

Чаще всего поминает: `footnoteOrder`×4, `S`×3, `escapeAttr`×2, `FOOTNOTE_LABELS`×2, `FOOTNOTE_STATE_ORDER`×1

### `modules/modal/history.js`

- из `modules/core/api.js`: `api`, `serverMode`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/data/remote.js`: `pullGraphSince`
- из `modules/modal/descriptions.js`: `toggleSubsection`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `escapeAttr`×14, `api`×2, `serverMode`×1, `toggleSubsection`×1, `can`×1

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
- из `modules/core/graph-index.js`: `conceptById`, `nodesByPhilosopher`, `philosopherByName`, `storedRecord`, `withoutEmptyOptional`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/data/backend.js`: `submitChange`
- из `modules/data/commit-draft.js`: `describeChange`
- из `modules/data/mutate.js`: `afterDataChange`
- из `modules/graph/graph-data.js`: `addLinkToGraph`, `addNodeToGraph`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `modules/modal/assembly.js`: `modalEntityExists`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `modules/modal/entry.js`: `getIsolatedConceptsAfterDeletion`
- из `modules/modal/forms.js`: `footnotesValue`, `provenanceValue`
- из `modules/modal/integrity.js`: `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `provenanceDriftWarning`, `relationIndexById`

Чаще всего поминает: `DATA`×44, `ModalContext`×21, `submitChange`×8, `describeChange`×8, `afterDataChange`×8

### `modules/modal/philosopher-view.js`

- из `modules/core/ns.js`: `DATA`, `VIEWS`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `comparePhilosophers`, `conceptById`, `nodesByPhilosopher`, `otherEndColor`, `philosopherByName`, `rubricById`, `traditionById`
- из `modules/core/link-facts.js`: `orientLink`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `modules/modal/connection-view.js`: `linkArrow`
- из `modules/modal/edit-rights.js`: `philRowTip`, `refreshEditHints`
- из `modules/modal/entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `modules/modal/history.js`: `historyBlock`
- из `modules/render/selection.js`: `highlightPhilosopherOnGraph`
- из `modules/util/color.js`: `getContrastColor`
- из `modules/util/html.js`: `footnoteOrder`, `footnotedText`, `footnotesBlock`, `provenanceBlock`, `withoutFootnotes`
- из `modules/util/philosopher-label.js`: `formatBirthYear`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `modules/util/ru.js`: `conjugateVerb`, `declinePhilosopher`

Чаще всего поминает: `declinePhilosopher`×22, `DATA`×15, `conceptById`×12, `conjugateVerb`×5, `getContrastColor`×4

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

### `modules/modal/security.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/api.js`: `api`
- из `modules/modal/edit-rights.js`: `refreshEditHints`, `renderAuthControls`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `api`×3, `escapeAttr`×3, `S`×1, `renderAuthControls`×1, `refreshEditHints`×1

### `modules/modal/selection-list.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `compareConcepts`, `compareLinks`, `comparePhilosophers`, `conceptById`, `linkIsInternal`, `otherEndColor`, `storedRecord`
- из `modules/core/link-facts.js`: `directionMark`, `linkHasTwoHeads`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/util/html.js`: `escapeAttr`, `withoutFootnotes`

Чаще всего поминает: `escapeAttr`×19, `DATA`×6, `withoutFootnotes`×4, `conceptById`×3, `linkIsInternal`×2

### `modules/modal/users.js`

- из `modules/core/api.js`: `api`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `escapeAttr`×8, `api`×3, `can`×1, `PERM`×1

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
- из `modules/util/html.js`: `withoutFootnotes`

Чаще всего поминает: `DATA`×4, `S`×3, `withoutFootnotes`×2, `resolvePathLinkList`×1, `freezeSimulation`×1

### `modules/paths/path-ui.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`, `philosopherByName`
- из `modules/core/link-facts.js`: `isSymmetricLink`
- из `modules/core/time.js`: `CHRONOLOGY_MODES`
- из `modules/paths/analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `modules/paths/shortest-path.js`: `findShortestPath`
- из `modules/render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `modules/render/selection.js`: `resetHighlight`
- из `modules/util/html.js`: `withoutFootnotes`

Чаще всего поминает: `S`×15, `DATA`×6, `resetHighlight`×3, `withoutFootnotes`×2, `philosopherByName`×2

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

Чаще всего поминает: `S`×4, `requestDraw`×1

### `modules/render/d3-layer.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/scene.js`: `startRadiusAnimation`
- из `modules/state/render.js`: `resetLayoutClock`

Чаще всего поминает: `DATA`×9, `renderState`×8, `requestDraw`×8, `S`×2, `startRadiusAnimation`×1

### `modules/render/draw-link.js`

- из `modules/core/ns.js`: `S`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/geometry.js`: `linkHoverStrokeWidth`, `linkStrokeWidth`
- из `modules/render/render-state.js`: `hasLinkClass`
- из `modules/render/similarity-overlay.js`: `linkAmongHighlighted`
- из `modules/state/render.js`: `selectedEdges`

Чаще всего поминает: `hasLinkClass`×4, `renderState`×3, `selectedEdges`×1, `linkHoverStrokeWidth`×1, `linkStrokeWidth`×1

### `modules/render/geometry.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/link-facts.js`: `isReflexiveLink`, `linkHasTwoHeads`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/render-state.js`: `nodeOuterRadius`, `nodeRadius`

Чаще всего поминает: `nodeOuterRadius`×3, `renderState`×2, `S`×1, `isReflexiveLink`×1, `linkHasTwoHeads`×1

### `modules/render/grouping.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/state/render.js`: _ради побочного действия_
- из `modules/render/canvas-core.js`: `resizeCanvas`
- из `modules/render/selection.js`: `resetHighlight`
- из `modules/state/render.js`: `pullStrengthOf`, `resetLayoutClock`

Чаще всего поминает: `S`×24, `pullStrengthOf`×2, `DATA`×1, `resetHighlight`×1, `resetLayoutClock`×1

### `modules/render/interactions.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `modules/graph/graph-selection.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `modules/render/canvas-core.js`: `gfxCanvas`, `gfxSvg`, `renderState`
- из `modules/render/d3-layer.js`: `dragMoveStarted`, `dragended`, `gfxLink`, `gfxNode`, `gfxZoom`, `linkHandlers`, `nodeHandlers`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/picking.js`: `pickLink`, `pickNode`, `toGraph`
- из `modules/render/selection.js`: `resetHighlight`
- из `modules/render/tooltip-el.js`: `tooltip`
- из `modules/state/edit.js`: `editMode`
- из `modules/state/filters.js`: `chosenPhilosophers`
- из `modules/state/render.js`: `selectedEdges`
- из `modules/util/html.js`: `withoutFootnotes`
- из `modules/util/philosopher-label.js`: `labelWithAuthor`

Чаще всего поминает: `S`×14, `tooltip`×12, `renderState`×11, `linkHandlers`×10, `nodeHandlers`×8

### `modules/render/metric-visualization.js`

- из `modules/core/ns.js`: `DATA`, `MET`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `emit`
- из `modules/metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `modules/render/d3-layer.js`: `gfxNode`, `updateArrows`

Чаще всего поминает: `DATA`×7, `gfxNode`×4, `S`×3, `updateArrows`×2, `pageRankCache`×1

### `modules/render/picking.js`

- из `modules/core/ns.js`: `DATA`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `PICK_LINK_WIDTH`, `gfxCanvas`, `renderState`
- из `modules/render/draw-link.js`: `linkDrawWidth`, `linkVisualState`
- из `modules/render/geometry.js`: `linkShape`, `linkStrokeWidth`
- из `modules/render/render-state.js`: `NODE_PASSES`, `nodeDrawPass`, `nodeRadius`
- из `modules/render/scene.js`: `DRAW_ORDER`, `linkDrawnLive`

Чаще всего поминает: `DATA`×3, `gfxCanvas`×2, `nodeRadius`×2, `DRAW_ORDER`×2, `renderState`×1

### `modules/render/render-state.js`

- из `modules/core/ns.js`: `S`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `renderState`×4, `selectedNodes`×2, `S`×1

### `modules/render/scene.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/link-facts.js`: `isReflexiveLink`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `ctx`, `dpr`, `gfxCanvas`, `renderState`
- из `modules/render/draw-link.js`: `CONTRADICTION_DASH`, `fillLinkHeads`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLinkShape`
- из `modules/render/geometry.js`: `clippedArc`, `linkShape`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/render-state.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `NODE_PASSES`, `hasLinkClass`, `hasNodeClass`, `nodeDrawPass`, `nodeEdgeWidth`, `nodeLabelDy`, `nodeRadius`
- из `modules/render/similarity-overlay.js`: `similarityColor`
- из `modules/state/render.js`: `linkLayer`, `resetLayoutClock`, `selectedEdges`, `selectedNodes`

Чаще всего поминает: `S`×23, `renderState`×17, `DATA`×16, `linkLayer`×12, `dpr`×8

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
- из `modules/metrics/similarity-concepts.js`: `SIGNED_SIMILARITY`, `_simCache`, `ensureNetworkProfile`, `networkProgressPercent`, `networkSimilarity`, `networkSimilarityData`, `profileIsMeaningful`, `profileSimilarity`, `similarityNeedsDegree`, `structuralSimilarity`, `typeStyleSimilarity`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/util/html.js`: `liveProgressHtml`, `updateLiveProgress`

Чаще всего поминает: `S`×29, `showTemporaryMessage`×6, `DATA`×4, `emit`×4, `profileIsMeaningful`×3

### `modules/render/simulation.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `vendor/d3.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/state/render.js`: _ради побочного действия_
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxZoom`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `modules/render/selection.js`: `resetHighlight`
- из `modules/state/render.js`: `resetLayoutClock`

Чаще всего поминает: `S`×22, `DATA`×3, `resetLayoutClock`×2, `ensureAnimLoop`×2, `needsContinuousAnimation`×2

### `modules/render/tooltip-el.js`

- из `vendor/d3.js`: _ради побочного действия_

### `modules/state/edit.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×1

### `modules/state/filters.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_

Чаще всего поминает: `S`×4, `DATA`×3

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
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `linksByConcept`

Чаще всего поминает: `S`×19, `DATA`×12, `emit`×1, `linksByConcept`×1

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
- из `modules/core/api.js`: `serverMode`
- из `modules/core/events.js`: `emit`
- из `modules/core/session.js`: `authSession`
- из `modules/metrics/graph-cache.js`: `invalidateGraphCache`
- из `modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modules/metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `liveScopeKey`, `updateMetricsScopeHint`, `updateScopeToggles`
- из `modules/render/metric-visualization.js`: `resetNodeSizes`
- из `modules/render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `modules/render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `modules/stats/observations.js`: `generateObservationsContent`, `observationBar`
- из `modules/stats/results.js`: `applyMetricLayout`
- из `modules/stats/views/advanced.js`: `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`
- из `modules/stats/views/comparison.js`: `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `modules/stats/views/network.js`: `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`
- из `modules/stats/views/philosopher.js`: `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`
- из `modules/stats/views/philosophical.js`: `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`
- из `modules/stats/views/rankings.js`: `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

Чаще всего поминает: `S`×27, `emit`×4, `applyMetricsScope`×3, `updateScopeToggles`×3, `DATA`×2

### `modules/stats/observations.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/api.js`: `api`, `serverMode`
- из `modules/core/perms.js`: `PERM`, `can`
- из `modules/metrics/philosophical.js`: `FORMULA_VERSIONS`
- из `modules/metrics/scope-select.js`: `VIEW_METRIC`, `effectiveScopeFlags`, `metricsNodes`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `escapeAttr`×16, `can`×4, `PERM`×4, `api`×4, `S`×3

### `modules/stats/results.js`

- из `modules/core/ns.js`: `S`
- из `modules/metrics/descriptions.js`: `getMetricDescription`
- из `modules/metrics/format.js`: `applyMetricMode`
- из `modules/stats/coverage.js`: `generateMetricCoverageBlock`
- из `modules/util/html.js`: `withoutFootnotes`

Чаще всего поминает: `S`×18, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `getMetricDescription`×1, `withoutFootnotes`×1

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
- из `modules/metrics/similarity-concepts.js`: `NETWORK_ROLE_WORDS`, `SIM_SHARED_HIGH`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `ensureNetworkProfile`, `fillPairsNetwork`, `networkProgressPercent`, `networkRoleOf`, `networkSimilarity`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `similarityThresholds`, `structuralSimilarity`, `typeStyleSimilarity`
- из `modules/metrics/similarity-philosophers.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`, `philosopherSimilarity`, `philosopherSimilarityData`
- из `modules/stats/results.js`: `generateMetricDescriptionBlock`
- из `modules/util/html.js`: `liveProgressHtml`, `updateLiveProgress`

Чаще всего поминает: `S`×56, `DATA`×12, `PHIL_SIM_LABELS`×5, `initializePhilosophyMetrics`×4, `generateMetricDescriptionBlock`×4

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
- из `modules/util/html.js`: `withoutFootnotes`

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
- из `modules/modal/commits.js`: `applyRelayout`, `askLayoutRevert`, `cancelLayoutRevert`, `doLayoutRevert`, `planRelayout`
- из `modules/modal/concept-view.js`: `computeSimilarNetworkColumn`, `forceSimilarColumn`
- из `modules/modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `modules/modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `modules/modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `modules/modal/descriptions.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `modules/modal/edit-forms.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `modules/modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `modules/modal/forms.js`: `insertFootnote`, `refreshFootnoteRows`, `refreshProvenanceField`, `removeFootnote`
- из `modules/modal/history.js`: `revertEntityToVersion`, `toggleEntityHistory`
- из `modules/modal/persist.js`: `deleteConcept`, `deleteConnection`
- из `modules/modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `modules/modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `modules/modal/search.js`: `clearModalSearch`, `handleModalSearch`
- из `modules/modal/security.js`: `confirmMfaEnroll`, `openSecurityModal`, `refreshSecurityDone`, `startMfaEnroll`
- из `modules/modal/selection-list.js`: `openSelectionLink`, `selectionListMore`, `setSelectionProvenance`, `toggleSelectionBlock`, `toggleSelectionBodies`, `toggleSelectionBody`
- из `modules/paths/path-descriptions.js`: `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `modules/paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`
- из `modules/render/metric-visualization.js`: `toggleMetricVisualization`
- из `modules/render/selection.js`: `highlightNodeById`
- из `modules/render/similarity-overlay.js`: `clearSimilarityOverlay`, `setSimilarityLinks`, `showSimilarityOverlay`
- из `modules/stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `modules/stats/observations.js`: `deleteObservation`, `pickObservation`, `saveObservation`
- из `modules/stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `modules/stats/run.js`: `calculateMetricFromModal`
- из `modules/stats/views/comparison.js`: `computeComparisonNetwork`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `modules/stats/views/philosophical.js`: `setInfluenceScope`
- из `modules/ui/legend.js`: `onlyTradition`, `resetTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `modules/ui/search-legend.js`: `selectSearchResult`
- из `modules/ui/search-link.js`: `highlightLinkOnGraph`, `pickLinkEnd`
- из `modules/ui/search-philosopher.js`: `clearPhilosopherSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`
- из `modules/widgets/custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

Чаще всего поминает: `openUniversalModal`×20, `S`×12, `DATA`×9, `renderClosestPairs`×8, `toggleSubsection`×4

### `modules/ui/actions-static.js`

- из `modules/ui/actions.js`: `registerActions`
- из `modules/data/save.js`: `downloadData`, `saveToFolder`
- из `modules/filters/beyond-filter.js`: `resetBeyondFilter`
- из `modules/metrics/scope.js`: `handleMetricsScopeChange`
- из `modules/modal/commits.js`: `closeCommitsPanel`, `openCommitsPanel`, `switchCommitTab`
- из `modules/modal/conflict.js`: `closeConflictModal`, `rebuildOverCurrent`
- из `modules/modal/core.js`: `closeUniversalModal`
- из `modules/modal/profile-concept.js`: `closeConceptProfileModal`
- из `modules/modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `modules/modal/selection-list.js`: `closeSelectionListModal`, `openSelectionListModal`
- из `modules/modal/users.js`: `closeUsersPanel`, `openUsersPanel`
- из `modules/paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `modules/paths/path-ui.js`: `findAndShowPath`
- из `modules/render/grouping.js`: `toggleGrouping`
- из `modules/render/metric-visualization.js`: `resetNodeSizes`
- из `modules/render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `modules/stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `modules/ui/about.js`: `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`
- из `modules/ui/export.js`: `exportToPNG`, `exportToSVG`
- из `modules/ui/legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `toggleSection`, `toggleUniformLinkWidth`
- из `modules/ui/notifications.js`: `markAllNotificationsRead`, `toggleNotifyPanel`
- из `modules/ui/panels.js`: `togglePanel`
- из `modules/ui/search-legend.js`: `clearLegendSearch`, `handleLegendSearch`, `setSearchKind`, `toggleLegendSearch`
- из `modules/ui/search-link.js`: `handleLegendLinkSearch`, `openLegendLinkSearch`
- из `modules/ui/search-philosopher.js`: `clearLegendPhilSearch`, `handleLegendPhilSearch`
- из `modules/widgets/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

Чаще всего поминает: `switchStatsView`×40, `toggleSection`×4, `setSearchKind`×3, `switchCommitTab`×3, `handleLegendSearch`×2

### `modules/ui/delegation.js`

- из `modules/ui/actions.js`: `runAction`

Чаще всего поминает: `runAction`×2

### `modules/ui/export.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/draw-link.js`: `CONTRADICTION_DASH`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`
- из `modules/render/geometry.js`: `linkShape`
- из `modules/render/render-state.js`: `hasNodeClass`, `nodeEdgeWidth`, `nodeLabelDy`, `nodeRadius`
- из `modules/render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `modules/state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×8, `hasNodeClass`×6, `DATA`×5, `CONTRADICTION_DASH`×3, `renderState`×2

### `modules/ui/hint.js`

- из `modules/core/ns.js`: `S`

Чаще всего поминает: `S`×1

### `modules/ui/legend.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/relation-types.js`: `relationHint`
- из `modules/filters/filters.js`: `applyFilters`
- из `modules/render/canvas-core.js`: `renderState`
- из `modules/render/d3-layer.js`: `updateArrows`
- из `modules/state/filters.js`: `chosenPhilosophers`

Чаще всего поминает: `S`×33, `DATA`×29, `applyFilters`×15, `chosenPhilosophers`×1, `relationHint`×1

### `modules/ui/link-state.js`

- из `modules/core/ns.js`: `DATA`, `S`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/events.js`: `subscribe`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/long-task.js`: `showTemporaryMessage`
- из `modules/filters/filters.js`: `applyFiltersImmediate`
- из `modules/metrics/scope.js`: `handleMetricsScopeChange`
- из `modules/metrics/similarity-concepts.js`: `networkSimilarityData`
- из `modules/modal/context.js`: `ModalContext`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/modal/entry.js`: `openConceptById`
- из `modules/paths/path-ui.js`: `findAndShowPath`
- из `modules/render/similarity-overlay.js`: `setSimilarityLinks`, `showSimilarityOverlay`
- из `modules/stats/modal.js`: `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `modules/stats/views/comparison.js`: `renderComparison`
- из `modules/ui/legend.js`: `changeFilterMode`, `syncPhilosopherCheckboxes`
- из `modules/widgets/custom-select.js`: `selectCustomOption`

Чаще всего поминает: `S`×39, `DATA`×9, `ModalContext`×6, `conceptById`×6, `syncPhilosopherCheckboxes`×2

### `modules/ui/notifications.js`

- из `modules/core/api.js`: `api`, `serverMode`
- из `modules/util/html.js`: `escapeAttr`

Чаще всего поминает: `serverMode`×5, `api`×4, `escapeAttr`×3

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
- из `modules/core/link-facts.js`: `directionMark`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/render/canvas-core.js`: `gfxSvg`
- из `modules/render/d3-layer.js`: `gfxZoom`
- из `modules/render/loop.js`: `requestDraw`
- из `modules/render/selection.js`: `highlightCombined`
- из `modules/state/render.js`: `selectedEdges`, `selectedNodes`
- из `modules/util/html.js`: `scrollToPickedRow`

Чаще всего поминает: `DATA`×6, `emptyList`×2, `selectedEdges`×2, `S`×2, `pickConcepts`×1

### `modules/ui/search-philosopher.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `comparePhilosophers`
- из `modules/core/search.js`: `emptyList`
- из `modules/modal/core.js`: `openUniversalModal`
- из `modules/render/selection.js`: `highlightPhilosopherOnGraph`

Чаще всего поминает: `DATA`×7, `emptyList`×2, `highlightPhilosopherOnGraph`×1, `comparePhilosophers`×1, `openUniversalModal`×1

### `modules/util/philosopher-label.js`

- из `modules/core/ns.js`: `DATA`
- из `modules/core/graph-index.js`: _ради побочного действия_
- из `modules/core/graph-index.js`: `comparePhilosophers`, `philosopherByName`

Чаще всего поминает: `philosopherByName`×2, `comparePhilosophers`×1, `DATA`×1

### `modules/widgets/custom-select.js`

- из `modules/core/ns.js`: `S`
- из `modules/core/events.js`: `emit`
- из `modules/core/graph-index.js`: `conceptById`
- из `modules/core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `modules/util/html.js`: `scrollToPickedRow`

Чаще всего поминает: `S`×8, `pickConcepts`×1, `rowInner`×1, `emptyList`×1, `scrollToPickedRow`×1