# Спецификация модулей `philosophy_graph` — по собранному дереву

Составлено из готовой сборки: 115 модулей, 17597 строк.
Не замысел, а описание того, что есть, — поэтому расходиться с
действительностью ей нечем. Пересобирается программой `tools/gen_spec2.mjs`
после каждой сборки.

## Как это строится

```
tools/split.mjs <дерево> <исходник> <раскладка> <карта>   разбивка
tools/delegate.mjs <дерево> static                        атрибуты страницы
tools/delegate.mjs <дерево> dyn                           атрибуты генераторов
tools/rig.mjs <дерево>                                    оснастка приборов
tools/unbridge.mjs <дерево>                               снятие моста
```

Источник — **пропатченная одностраничная версия** (`philosophy_graph_v3.html`):
она же служит эталоном приёмки. Всякая новая возможность вносится в неё, а в
сборку приезжает разбивкой — по одной реализации на возможность.

**Раскладка задаётся именами, а не строками** (`assign_names.json`, 697 имён).
Номера строк сдвигаются от любой вставки, и по замеру тридцать чужих
сущностей молча уезжали в соседние модули. Имя, которого в раскладке нет,
**останавливает сборку** с перечнем — новая сущность требует явного решения.


## Пространства имён

| Имя | Что держит |
|---|---|
| `DATA` | шесть наборов базы и девять производных указателей; заполняется при запуске |
| `S` | изменяемое состояние и отложенные ячейки — всё, что либо меняется из чужого модуля (в том числе **из разметки**), либо не может быть вычислено при ввозе |
| `MET` | метрики, к которым обращаются по имени |
| `VIEWS` | генераторы окон, к которым обращаются по имени |

Три последних заменили `window[имя]`, который в модулях не работает вовсе.


## Модули

| Модуль | Строк | Вывозит | Ввозит из |
|---|---|---|---|
| `boot.js` | 225 | 1 | 56 |
| `main.js` | 121 | 0 | 110 |
| `modules/boot-defs.js` | 62 | 3 | 8 |
| `modules/core/base-cells.js` | 17 | 0 | 1 |
| `modules/core/events.js` | 43 | 4 | 0 |
| `modules/core/graph-index.js` | 99 | 4 | 1 |
| `modules/core/link-facts.js` | 42 | 6 | 2 |
| `modules/core/long-task.js` | 120 | 3 | 0 |
| `modules/core/ns.js` | 23 | 4 | 0 |
| `modules/core/ready.js` | 15 | 2 | 0 |
| `modules/core/relation-types.js` | 59 | 6 | 2 |
| `modules/core/search.js` | 72 | 5 | 3 |
| `modules/core/session.js` | 14 | 4 | 0 |
| `modules/core/time.js` | 13 | 2 | 0 |
| `modules/core/visibility.js` | 13 | 2 | 1 |
| `modules/data/load.js` | 9 | 1 | 1 |
| `modules/data/mutate.js` | 74 | 3 | 4 |
| `modules/data/save.js` | 72 | 10 | 1 |
| `modules/dead.js` | 79 | 4 | 4 |
| `modules/filters/beyond-filter.js` | 21 | 2 | 2 |
| `modules/filters/chains.js` | 273 | 6 | 4 |
| `modules/filters/filters.js` | 454 | 14 | 13 |
| `modules/graph/click-actions.js` | 201 | 8 | 8 |
| `modules/graph/graph-data.js` | 112 | 10 | 8 |
| `modules/graph/graph-selection.js` | 55 | 3 | 3 |
| `modules/metrics/by-link-type.js` | 116 | 6 | 2 |
| `modules/metrics/concept-dynamics.js` | 224 | 8 | 2 |
| `modules/metrics/descriptions.js` | 478 | 2 | 3 |
| `modules/metrics/format.js` | 32 | 4 | 2 |
| `modules/metrics/generativity.js` | 102 | 8 | 1 |
| `modules/metrics/graph-cache.js` | 117 | 3 | 3 |
| `modules/metrics/link-indexes.js` | 121 | 4 | 5 |
| `modules/metrics/network.js` | 870 | 25 | 3 |
| `modules/metrics/philosopher.js` | 308 | 13 | 2 |
| `modules/metrics/philosophical.js` | 1038 | 23 | 4 |
| `modules/metrics/rankings.js` | 141 | 5 | 3 |
| `modules/metrics/scope-reset.js` | 64 | 3 | 12 |
| `modules/metrics/scope-select.js` | 99 | 6 | 2 |
| `modules/metrics/scope.js` | 135 | 7 | 8 |
| `modules/metrics/similarity-concepts.js` | 243 | 15 | 3 |
| `modules/metrics/similarity-philosophers.js` | 160 | 11 | 2 |
| `modules/metrics/tension-cache.js` | 13 | 1 | 1 |
| `modules/metrics/tradition-bridging.js` | 70 | 4 | 1 |
| `modules/modal/assembly.js` | 54 | 3 | 1 |
| `modules/modal/auth.js` | 162 | 10 | 4 |
| `modules/modal/concept-view.js` | 336 | 1 | 6 |
| `modules/modal/connection-edit.js` | 283 | 9 | 11 |
| `modules/modal/connection-view.js` | 414 | 11 | 9 |
| `modules/modal/context.js` | 11 | 1 | 0 |
| `modules/modal/core.js` | 154 | 7 | 9 |
| `modules/modal/descriptions.js` | 162 | 10 | 0 |
| `modules/modal/dirty.js` | 111 | 5 | 4 |
| `modules/modal/edit-forms.js` | 287 | 2 | 10 |
| `modules/modal/edit-rights.js` | 53 | 3 | 3 |
| `modules/modal/entry.js` | 123 | 12 | 9 |
| `modules/modal/integrity.js` | 253 | 10 | 6 |
| `modules/modal/persist.js` | 360 | 10 | 10 |
| `modules/modal/philosopher-view.js` | 620 | 4 | 11 |
| `modules/modal/profile-concept.js` | 181 | 8 | 7 |
| `modules/modal/profile-philosopher.js` | 120 | 2 | 7 |
| `modules/modal/search.js` | 43 | 3 | 1 |
| `modules/paths/analysis.js` | 73 | 2 | 6 |
| `modules/paths/chronology.js` | 174 | 10 | 3 |
| `modules/paths/path-descriptions.js` | 174 | 4 | 7 |
| `modules/paths/path-ui.js` | 397 | 8 | 8 |
| `modules/paths/shortest-path.js` | 209 | 4 | 5 |
| `modules/render/canvas-core.js` | 45 | 9 | 2 |
| `modules/render/d3-layer.js` | 105 | 11 | 5 |
| `modules/render/draw-link.js` | 98 | 6 | 5 |
| `modules/render/geometry.js` | 95 | 6 | 3 |
| `modules/render/grouping.js` | 103 | 7 | 5 |
| `modules/render/interactions.js` | 307 | 8 | 17 |
| `modules/render/loop.js` | 20 | 4 | 0 |
| `modules/render/metric-visualization.js` | 371 | 10 | 5 |
| `modules/render/picking.js` | 79 | 6 | 7 |
| `modules/render/render-state.js` | 17 | 6 | 1 |
| `modules/render/scene.js` | 244 | 10 | 12 |
| `modules/render/selection.js` | 260 | 8 | 9 |
| `modules/render/similarity-overlay.js` | 112 | 6 | 7 |
| `modules/render/simulation.js` | 126 | 11 | 9 |
| `modules/render/tooltip-el.js` | 7 | 1 | 0 |
| `modules/state/edit.js` | 14 | 2 | 0 |
| `modules/state/filters.js` | 22 | 3 | 2 |
| `modules/state/metrics-scope.js` | 13 | 0 | 1 |
| `modules/state/paths.js` | 18 | 0 | 2 |
| `modules/state/render.js` | 36 | 2 | 2 |
| `modules/state/stats.js` | 33 | 0 | 1 |
| `modules/stats/coverage.js` | 66 | 3 | 6 |
| `modules/stats/modal.js` | 238 | 8 | 16 |
| `modules/stats/results.js` | 392 | 11 | 4 |
| `modules/stats/run.js` | 128 | 4 | 3 |
| `modules/stats/views/advanced.js` | 270 | 10 | 4 |
| `modules/stats/views/comparison.js` | 427 | 10 | 9 |
| `modules/stats/views/network.js` | 223 | 9 | 4 |
| `modules/stats/views/philosopher.js` | 171 | 4 | 6 |
| `modules/stats/views/philosophical.js` | 449 | 12 | 7 |
| `modules/stats/views/rankings.js` | 141 | 2 | 5 |
| `modules/ui/about.js` | 102 | 4 | 1 |
| `modules/ui/actions-byname.js` | 20 | 0 | 2 |
| `modules/ui/actions-dyn.js` | 148 | 0 | 31 |
| `modules/ui/actions-static.js` | 121 | 0 | 21 |
| `modules/ui/actions.js` | 27 | 3 | 0 |
| `modules/ui/delegation.js` | 70 | 1 | 1 |
| `modules/ui/export.js` | 126 | 2 | 11 |
| `modules/ui/hint.js` | 60 | 7 | 1 |
| `modules/ui/legend.js` | 317 | 27 | 7 |
| `modules/ui/panels.js` | 40 | 2 | 0 |
| `modules/ui/search-legend.js` | 140 | 7 | 16 |
| `modules/ui/search-link.js` | 117 | 6 | 8 |
| `modules/ui/search-philosopher.js` | 98 | 7 | 5 |
| `modules/util/color.js` | 23 | 1 | 0 |
| `modules/util/html.js` | 9 | 1 | 0 |
| `modules/util/philosopher-label.js` | 39 | 7 | 2 |
| `modules/util/ru.js` | 49 | 3 | 0 |
| `modules/widgets/custom-select.js` | 88 | 5 | 4 |

## Состав, вывоз и ввоз по модулям


### `boot.js`

Строк 225.

**Вывозит:** `boot`

**Ввозит:**

- из `./modules/core/ns.js`: `DATA`, `S`
- из `./modules/data/load.js`: `loadData`
- из `./modules/core/ready.js`: `onReady`, `onLoad`
- из `./modules/core/graph-index.js`: `buildConceptToRubrics`
- из `./modules/core/graph-index.js`: `buildRubricsIndex`
- из `./modules/core/graph-index.js`: `buildPhilosopherTraditions`
- из `./modules/stats/modal.js`: `installStatsModalDismiss`
- из `./modules/stats/modal.js`: `installStatsEscape`
- из `./modules/stats/results.js`: `restoreMetricLayoutMode`
- из `./modules/ui/search-legend.js`: `installLegendSearchDismiss`
- из `./modules/render/interactions.js`: `installNodeDrag`
- из `./modules/render/simulation.js`: `installSimulationTick`
- из `./modules/render/simulation.js`: `installSimulationStatsEnd`
- из `./modules/render/interactions.js`: `installNodeHover`
- из `./modules/render/interactions.js`: `installLinkHover`
- из `./modules/render/grouping.js`: `buildGroupPositions`
- из `./modules/render/grouping.js`: `installResize`
- из `./modules/data/save.js`: `installUnsavedGuard`
- из `./modules/modal/search.js`: `installModalSearchDismiss`
- из `./modules/boot-defs.js`: `installOverlayDismiss`
- из `./modules/boot-defs.js`: `installModalKeys`
- из `./modules/ui/hint.js`: `installHintOver`
- из `./modules/ui/hint.js`: `installHintOut`
- из `./modules/ui/hint.js`: `installHintOnScroll`
- из `./modules/ui/hint.js`: `installHintOnClick`
- из `./modules/render/simulation.js`: `installSimulationLog`
- из `./modules/ui/legend.js`: `syncLegendWeightsToggle`
- из `./modules/ui/legend.js`: `syncLegendDirectionToggle`
- из `./modules/paths/chronology.js`: `installChronologyToggle`
- из `./modules/paths/chronology.js`: `installChronologyMode`
- из `./modules/paths/chronology.js`: `showChronologyModeIfOn`
- из `./modules/core/events.js`: `subscribe`
- из `./modules/filters/beyond-filter.js`: `resetBeyondFilter`
- из `./modules/filters/filters.js`: `applyFiltersImmediate`
- из `./modules/metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `./modules/metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `./modules/modal/connection-edit.js`: `selectConnectionEditConcept`
- из `./modules/modal/connection-view.js`: `selectConnectionViewConcept`
- из `./modules/modal/core.js`: `modalStack`, `openUniversalModal`
- из `./modules/modal/edit-rights.js`: `renderAuthControls`
- из `./modules/modal/entry.js`: `closeDetailModal`, `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `./modules/modal/philosopher-view.js`: `makeLegendsEditable`
- из `./modules/paths/path-ui.js`: `initPathFinder`
- из `./modules/render/canvas-core.js`: `resizeCanvas`
- из `./modules/render/interactions.js`: `initGraphEventHandlers`
- из `./modules/render/loop.js`: `setPainter`
- из `./modules/render/metric-visualization.js`: `saveOriginalRadii`
- из `./modules/render/scene.js`: `draw`, `updateGraphData`
- из `./modules/render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `./modules/state/filters.js`: `pinnedDespiteFilter`
- из `./modules/stats/modal.js`: `closeStatsModal`, `loadStatsContent`, `switchStatsView`
- из `./modules/stats/views/comparison.js`: `renderComparison`
- из `./modules/ui/legend.js`: `initFilters`, `markChosenInLegend`, `updateFilterStats`, `updatePhilosopherDimming`
- из `./modules/ui/panels.js`: `restorePanelStates`
- из `./modules/widgets/custom-select.js`: `initializeCustomSelects`
- из `./modules/core/graph-index.js`: _ради побочного действия_

**Содержит:** `boot`

### `main.js`

Строк 121.

**Вывозит:** _ничего_

**Ввозит:**

- из `./modules/ui/delegation.js`: `installDelegation`
- из `./boot.js`: `boot`
- из `./modules/boot-defs.js`: _ради побочного действия_
- из `./modules/core/base-cells.js`: _ради побочного действия_
- из `./modules/core/events.js`: _ради побочного действия_
- из `./modules/core/graph-index.js`: _ради побочного действия_
- из `./modules/core/link-facts.js`: _ради побочного действия_
- из `./modules/core/long-task.js`: _ради побочного действия_
- из `./modules/core/relation-types.js`: _ради побочного действия_
- из `./modules/core/search.js`: _ради побочного действия_
- из `./modules/core/session.js`: _ради побочного действия_
- из `./modules/core/time.js`: _ради побочного действия_
- из `./modules/core/visibility.js`: _ради побочного действия_
- из `./modules/data/mutate.js`: _ради побочного действия_
- из `./modules/data/save.js`: _ради побочного действия_
- из `./modules/dead.js`: _ради побочного действия_
- из `./modules/filters/beyond-filter.js`: _ради побочного действия_
- из `./modules/filters/chains.js`: _ради побочного действия_
- из `./modules/filters/filters.js`: _ради побочного действия_
- из `./modules/graph/click-actions.js`: _ради побочного действия_
- из `./modules/graph/graph-data.js`: _ради побочного действия_
- из `./modules/graph/graph-selection.js`: _ради побочного действия_
- из `./modules/metrics/by-link-type.js`: _ради побочного действия_
- из `./modules/metrics/concept-dynamics.js`: _ради побочного действия_
- из `./modules/metrics/descriptions.js`: _ради побочного действия_
- из `./modules/metrics/format.js`: _ради побочного действия_
- из `./modules/metrics/generativity.js`: _ради побочного действия_
- из `./modules/metrics/graph-cache.js`: _ради побочного действия_
- из `./modules/metrics/link-indexes.js`: _ради побочного действия_
- из `./modules/metrics/network.js`: _ради побочного действия_
- из `./modules/metrics/philosopher.js`: _ради побочного действия_
- из `./modules/metrics/philosophical.js`: _ради побочного действия_
- из `./modules/metrics/rankings.js`: _ради побочного действия_
- из `./modules/metrics/scope-reset.js`: _ради побочного действия_
- из `./modules/metrics/scope-select.js`: _ради побочного действия_
- из `./modules/metrics/scope.js`: _ради побочного действия_
- из `./modules/metrics/similarity-concepts.js`: _ради побочного действия_
- из `./modules/metrics/similarity-philosophers.js`: _ради побочного действия_
- из `./modules/metrics/tension-cache.js`: _ради побочного действия_
- из `./modules/metrics/tradition-bridging.js`: _ради побочного действия_
- из `./modules/modal/assembly.js`: _ради побочного действия_
- из `./modules/modal/auth.js`: _ради побочного действия_
- из `./modules/modal/concept-view.js`: _ради побочного действия_
- из `./modules/modal/connection-edit.js`: _ради побочного действия_
- из `./modules/modal/connection-view.js`: _ради побочного действия_
- из `./modules/modal/context.js`: _ради побочного действия_
- из `./modules/modal/core.js`: _ради побочного действия_
- из `./modules/modal/descriptions.js`: _ради побочного действия_
- из `./modules/modal/dirty.js`: _ради побочного действия_
- из `./modules/modal/edit-forms.js`: _ради побочного действия_
- из `./modules/modal/edit-rights.js`: _ради побочного действия_
- из `./modules/modal/entry.js`: _ради побочного действия_
- из `./modules/modal/integrity.js`: _ради побочного действия_
- из `./modules/modal/persist.js`: _ради побочного действия_
- из `./modules/modal/philosopher-view.js`: _ради побочного действия_
- из `./modules/modal/profile-concept.js`: _ради побочного действия_
- из `./modules/modal/profile-philosopher.js`: _ради побочного действия_
- из `./modules/modal/search.js`: _ради побочного действия_
- из `./modules/paths/analysis.js`: _ради побочного действия_
- из `./modules/paths/chronology.js`: _ради побочного действия_
- из `./modules/paths/path-descriptions.js`: _ради побочного действия_
- из `./modules/paths/path-ui.js`: _ради побочного действия_
- из `./modules/paths/shortest-path.js`: _ради побочного действия_
- из `./modules/render/canvas-core.js`: _ради побочного действия_
- из `./modules/render/d3-layer.js`: _ради побочного действия_
- из `./modules/render/draw-link.js`: _ради побочного действия_
- из `./modules/render/geometry.js`: _ради побочного действия_
- из `./modules/render/grouping.js`: _ради побочного действия_
- из `./modules/render/interactions.js`: _ради побочного действия_
- из `./modules/render/loop.js`: _ради побочного действия_
- из `./modules/render/metric-visualization.js`: _ради побочного действия_
- из `./modules/render/picking.js`: _ради побочного действия_
- из `./modules/render/render-state.js`: _ради побочного действия_
- из `./modules/render/scene.js`: _ради побочного действия_
- из `./modules/render/selection.js`: _ради побочного действия_
- из `./modules/render/similarity-overlay.js`: _ради побочного действия_
- из `./modules/render/simulation.js`: _ради побочного действия_
- из `./modules/render/tooltip-el.js`: _ради побочного действия_
- из `./modules/state/edit.js`: _ради побочного действия_
- из `./modules/state/filters.js`: _ради побочного действия_
- из `./modules/state/metrics-scope.js`: _ради побочного действия_
- из `./modules/state/paths.js`: _ради побочного действия_
- из `./modules/state/render.js`: _ради побочного действия_
- из `./modules/state/stats.js`: _ради побочного действия_
- из `./modules/stats/coverage.js`: _ради побочного действия_
- из `./modules/stats/modal.js`: _ради побочного действия_
- из `./modules/stats/results.js`: _ради побочного действия_
- из `./modules/stats/run.js`: _ради побочного действия_
- из `./modules/stats/views/advanced.js`: _ради побочного действия_
- из `./modules/stats/views/comparison.js`: _ради побочного действия_
- из `./modules/stats/views/network.js`: _ради побочного действия_
- из `./modules/stats/views/philosopher.js`: _ради побочного действия_
- из `./modules/stats/views/philosophical.js`: _ради побочного действия_
- из `./modules/stats/views/rankings.js`: _ради побочного действия_
- из `./modules/ui/about.js`: _ради побочного действия_
- из `./modules/ui/export.js`: _ради побочного действия_
- из `./modules/ui/hint.js`: _ради побочного действия_
- из `./modules/ui/legend.js`: _ради побочного действия_
- из `./modules/ui/panels.js`: _ради побочного действия_
- из `./modules/ui/search-legend.js`: _ради побочного действия_
- из `./modules/ui/search-link.js`: _ради побочного действия_
- из `./modules/ui/search-philosopher.js`: _ради побочного действия_
- из `./modules/util/color.js`: _ради побочного действия_
- из `./modules/util/html.js`: _ради побочного действия_
- из `./modules/util/philosopher-label.js`: _ради побочного действия_
- из `./modules/util/ru.js`: _ради побочного действия_
- из `./modules/widgets/custom-select.js`: _ради побочного действия_
- из `./modules/ui/actions-byname.js`: _ради побочного действия_
- из `./modules/ui/actions-static.js`: _ради побочного действия_
- из `./modules/ui/actions-dyn.js`: _ради побочного действия_

**Содержит:** _только исполняемый код_

### `modules/boot-defs.js`

Строк 62.

**Вывозит:** `closeAllModals`, `installModalKeys`, `installOverlayDismiss`

**Ввозит:**

- из `./core/ns.js`: `S`
- из `./graph/graph-selection.js`: `cancelGraphSelection`
- из `./modal/core.js`: `closeUniversalModal`, `modalStack`, `popModalState`
- из `./modal/entry.js`: `closeDetailModal`, `closePhilosopherDetailModal`
- из `./modal/profile-concept.js`: `closeConceptProfileModal`
- из `./modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `./paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `./ui/about.js`: `closeAboutModal`

**Содержит:** `closeAllModals`, `installModalKeys`, `installOverlayDismiss`

### `modules/core/base-cells.js`

Строк 17.

**Вывозит:** _ничего_

**Ввозит:**

- из `./ns.js`: `S`

**Содержит:** `S._conceptMap`, `S._concepts`, `S._incomingLinks`, `S._outgoingLinks`, `S._philosopherMap`, `S._philosophers`, `S._relations`

### `modules/core/events.js`

Строк 43.

**Вывозит:** `BUS_EVENTS`, `busSubscribers`, `emit`, `subscribe`

**Ввозит:** _ничего_

**Содержит:** `BUS_EVENTS`, `busSubscribers`, `emit`, `subscribe`

### `modules/core/graph-index.js`

Строк 99.

**Вывозит:** `buildConceptToRubrics`, `buildIndexes`, `buildPhilosopherTraditions`, `buildRubricsIndex`

**Ввозит:**

- из `./ns.js`: `DATA`

**Содержит:** `buildConceptToRubrics`, `buildIndexes`, `buildPhilosopherTraditions`, `buildRubricsIndex`

### `modules/core/link-facts.js`

Строк 42.

**Вывозит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Ввозит:**

- из `./ns.js`: `DATA`, `S`
- из `./graph-index.js`: _ради побочного действия_

**Содержит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

### `modules/core/long-task.js`

Строк 120.

**Вывозит:** `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`

**Ввозит:** _ничего_

**Содержит:** `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`

### `modules/core/ns.js`

Строк 23.

**Вывозит:** `DATA`, `MET`, `S`, `VIEWS`

**Ввозит:** _ничего_

**Содержит:** `DATA`, `MET`, `S`, `VIEWS`

### `modules/core/ready.js`

Строк 15.

**Вывозит:** `onLoad`, `onReady`

**Ввозит:** _ничего_

**Содержит:** `onLoad`, `onReady`

### `modules/core/relation-types.js`

Строк 59.

**Вывозит:** `CONN_WEIGHT_WORDS`, `LAYER_NAMES`, `RELATION_HINTS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

**Ввозит:**

- из `./ns.js`: `DATA`
- из `./graph-index.js`: _ради побочного действия_

**Содержит:** `CONN_WEIGHT_WORDS`, `LAYER_NAMES`, `RELATION_HINTS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

### `modules/core/search.js`

Строк 72.

**Вывозит:** `displaySearchResults`, `emptyList`, `pickConcepts`, `rowInner`, `searchNodes`

**Ввозит:**

- из `./ns.js`: `DATA`
- из `./visibility.js`: `isNodeVisible`
- из `./graph-index.js`: _ради побочного действия_

**Содержит:** `displaySearchResults`, `emptyList`, `pickConcepts`, `rowInner`, `searchNodes`

### `modules/core/session.js`

Строк 14.

**Вывозит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

**Ввозит:** _ничего_

**Содержит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

### `modules/core/time.js`

Строк 13.

**Вывозит:** `CHRONOLOGY_MODES`, `MATURITY_AGE`

**Ввозит:** _ничего_

**Содержит:** `CHRONOLOGY_MODES`, `MATURITY_AGE`

### `modules/core/visibility.js`

Строк 13.

**Вывозит:** `isLinkVisible`, `isNodeVisible`

**Ввозит:**

- из `./ns.js`: `S`

**Содержит:** `S.visibleLinkSet`, `S.visibleNodeIds`, `isLinkVisible`, `isNodeVisible`

### `modules/data/load.js`

Строк 9.

**Вывозит:** `loadData`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `loadData`

### `modules/data/mutate.js`

Строк 74.

**Вывозит:** `afterDataChange`, `rebuildDerivedIndexes`, `rebuildPhilosopherTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `./save.js`: `markDirty`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `afterDataChange`, `rebuildDerivedIndexes`, `rebuildPhilosopherTraditions`

### `modules/data/save.js`

Строк 72.

**Вывозит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `installUnsavedGuard`, `markDirty`, `saveToFolder`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `installUnsavedGuard`, `markDirty`, `saveToFolder`

### `modules/dead.js`

Строк 79.

**Вывозит:** `TENSION_WEIGHTS`, `findConnectedComponents`, `tensionScales`, `toggleSimilarityKind`

**Ввозит:**

- из `./core/ns.js`: `DATA`, `MET`, `S`
- из `./metrics/graph-cache.js`: `buildGlobalGraphCache`
- из `./render/similarity-overlay.js`: `showSimilarityOverlay`
- из `./core/graph-index.js`: _ради побочного действия_

**Содержит:** `TENSION_WEIGHTS`, `findConnectedComponents`, `tensionScales`, `toggleSimilarityKind`

### `modules/filters/beyond-filter.js`

Строк 21.

**Вывозит:** `resetBeyondFilter`, `updateFilterNote`

**Ввозит:**

- из `./filters.js`: `applyFiltersImmediate`
- из `../state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`

**Содержит:** `resetBeyondFilter`, `updateFilterNote`

### `modules/filters/chains.js`

Строк 273.

**Вывозит:** `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/long-task.js`: `CHAIN_SEARCH`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

### `modules/filters/filters.js`

Строк 454.

**Вывозит:** `FilterModes`, `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debounce`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../core/long-task.js`: `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./chains.js`: `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `../metrics/scope.js`: `updateMetricsScopeHint`
- из `../render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `../render/selection.js`: `highlightConnected`, `resetHighlight`
- из `../state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`
- из `../state/render.js`: `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `FilterModes`, `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debounce`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

### `modules/graph/click-actions.js`

Строк 201.

**Вывозит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `emit`
- из `../core/session.js`: `canEdit`
- из `./graph-selection.js`: `handleConceptSelection`
- из `../render/d3-layer.js`: `gfxNode`
- из `../render/selection.js`: `highlightCombined`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`
- из `../state/edit.js`: `editMode`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

### `modules/graph/graph-data.js`

Строк 112.

**Вывозит:** `addLinkToGraph`, `addNodeToGraph`, `connectionsBetween`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `traditionsOfPhilosopher`, `updateLinkOnGraph`, `updateNodeOnGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../render/canvas-core.js`: `renderState`
- из `../render/loop.js`: `requestDraw`
- из `../render/scene.js`: `updateGraphData`
- из `../state/filters.js`: `pinnedVisibleNodes`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `addLinkToGraph`, `addNodeToGraph`, `connectionsBetween`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `traditionsOfPhilosopher`, `updateLinkOnGraph`, `updateNodeOnGraph`

### `modules/graph/graph-selection.js`

Строк 55.

**Вывозит:** `cancelGraphSelection`, `handleConceptSelection`, `selectConceptOnGraph`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `emit`
- из `../render/canvas-core.js`: `gfxCanvas`

**Содержит:** `cancelGraphSelection`, `handleConceptSelection`, `selectConceptOnGraph`

### `modules/metrics/by-link-type.js`

Строк 116.

**Вывозит:** `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/link-facts.js`: `sumWeight`

**Содержит:** `MET.abstractionIndex`, `MET.deductiveDepth`, `MET.deductiveIndex`, `MET.instrumentalIndex`, `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`

### `modules/metrics/concept-dynamics.js`

Строк 224.

**Вывозит:** `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/link-facts.js`: `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Содержит:** `MET.conceptualComplexityIndex`, `MET.conceptualContinuityIndex`, `MET.conceptualFertilityIndex`, `MET.transformationIndex`, `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

### `modules/metrics/descriptions.js`

Строк 478.

**Вывозит:** `getMetricDescription`, `metricDescriptions`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./similarity-philosophers.js`: `PHIL_SIM_MIN_RUBRIC_UNION`
- из `./tradition-bridging.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`

**Содержит:** `getMetricDescription`, `metricDescriptions`

### `modules/metrics/format.js`

Строк 32.

**Вывозит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `emit`

**Содержит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

### `modules/metrics/generativity.js`

Строк 102.

**Вывозит:** `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`

**Содержит:** `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `MET.generativeIndex`, `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

### `modules/metrics/graph-cache.js`

Строк 117.

**Вывозит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `./scope-select.js`: `metricsLinks`, `metricsNodes`

**Содержит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

### `modules/metrics/link-indexes.js`

Строк 121.

**Вывозит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `initializePhilosophyMetrics`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `../core/visibility.js`: `isNodeVisible`
- из `./scope-select.js`: `effectiveScopeFlags`, `transformForScope`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `initializePhilosophyMetrics`

### `modules/metrics/network.js`

Строк 870.

**Вывозит:** `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `medianNodeDegree`, `nodeDegreeOf`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `./graph-cache.js`: `buildGlobalGraphCache`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `MET.calculateBetweenness`, `MET.calculateClosenessCentrality`, `MET.calculateClusteringCoefficient`, `MET.calculateEigenvectorCentrality`, `MET.calculateLocalCohesion`, `MET.calculatePageRank`, `MET.calculateRichClubCoefficient`, `MET.calculateWeightedClustering`, `MET.calculateWeightedDegree`, `S._medianDegreeCache`, `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `medianNodeDegree`, `nodeDegreeOf`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

### `modules/metrics/philosopher.js`

Строк 308.

**Вывозит:** `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./philosophical.js`: `DISRUPTIVE_TYPES`, `SYSTEMATIC_TYPES`

**Содержит:** `CONSTRUCTIVE_TYPES`, `MET.philosopherHistoricalReachIndex`, `MET.philosopherInterdisciplinaryIndex`, `MET.philosopherSystematicIndex`, `MET.temporalInfluencePattern`, `POLEMICAL_TYPES`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

### `modules/metrics/philosophical.js`

Строк 1038.

**Вывозит:** `DISRUPTIVE_TYPES`, `INFLUENCE_SCOPE_LABELS`, `SYSTEMATIC_TYPES`, `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `syntheticIndexCache`, `tensionIndexCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `./generativity.js`: `generativity`, `linkInInfluenceScope`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `DISRUPTIVE_TYPES`, `INFLUENCE_SCOPE_LABELS`, `MET.criticalPowerIndex`, `MET.dialogicalIndex`, `MET.foundationalIndex`, `MET.influenceIndex`, `MET.internalCoherenceIndex`, `MET.paradigmShiftIndex`, `MET.problemGenerationIndex`, `MET.revolutionaryIndex`, `MET.syntheticIndex`, `MET.tensionIndex`, `SYSTEMATIC_TYPES`, `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `syntheticIndexCache`, `tensionIndexCache`

### `modules/metrics/rankings.js`

Строк 141.

**Вывозит:** `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./format.js`: `applyMetricMode`
- из `./philosopher.js`: `philosopherProfile`

**Содержит:** `S.generateRankingsCache`, `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

### `modules/metrics/scope-reset.js`

Строк 64.

**Вывозит:** `invalidateAllMetricsCaches`, `invalidateEverythingForScope`, `invalidateMetricCoverageCache`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./by-link-type.js`: `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`
- из `./concept-dynamics.js`: `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`
- из `./generativity.js`: `invalidateGenerativityCache`
- из `./graph-cache.js`: `invalidateGraphCache`
- из `./network.js`: `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`
- из `./philosopher.js`: `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`
- из `./philosophical.js`: `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`
- из `./rankings.js`: `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`
- из `./similarity-concepts.js`: `invalidateSimilarityCache`
- из `./tension-cache.js`: `invalidateTensionScales`
- из `./tradition-bridging.js`: `invalidateTraditionBridgingCache`

**Содержит:** `invalidateAllMetricsCaches`, `invalidateEverythingForScope`, `invalidateMetricCoverageCache`

### `modules/metrics/scope-select.js`

Строк 99.

**Вывозит:** `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `metricsLinks`, `metricsNodes`, `transformForScope`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `metricsLinks`, `metricsNodes`, `transformForScope`

### `modules/metrics/scope.js`

Строк 135.

**Вывозит:** `applyMetricsScope`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `metricScopeFactor`, `metricsScopeCounts`, `updateMetricsScopeHint`, `updateScopeToggles`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/events.js`: `emit`
- из `../core/visibility.js`: `isNodeVisible`
- из `./graph-cache.js`: `invalidateGraphCache`
- из `./link-indexes.js`: `initializePhilosophyMetrics`
- из `./scope-reset.js`: `invalidateEverythingForScope`
- из `./scope-select.js`: `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `transformForScope`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `S.lastScopeKey`, `applyMetricsScope`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `metricScopeFactor`, `metricsScopeCounts`, `updateMetricsScopeHint`, `updateScopeToggles`

### `modules/metrics/similarity-concepts.js`

Строк 243.

**Вывозит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `./similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

**Содержит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

### `modules/metrics/similarity-philosophers.js`

Строк 160.

**Вывозит:** `PHIL_SIM_LABELS`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `SIM_METRIC_LABELS`, `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./philosopher.js`: `philosopherProfile`

**Содержит:** `PHIL_SIM_LABELS`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `SIM_METRIC_LABELS`, `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

### `modules/metrics/tension-cache.js`

Строк 13.

**Вывозит:** `invalidateTensionScales`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S._tensionScales`, `S._tensionScalesComputing`, `invalidateTensionScales`

### `modules/metrics/tradition-bridging.js`

Строк 70.

**Вывозит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`

**Содержит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `MET.traditionBridgingIndex`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

### `modules/modal/assembly.js`

Строк 54.

**Вывозит:** `modalActions`, `modalContentFor`, `modalEntityExists`

**Ввозит:**

- из `../core/ns.js`: `VIEWS`

**Содержит:** `modalActions`, `modalContentFor`, `modalEntityExists`

### `modules/modal/auth.js`

Строк 162.

**Вывозит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `showAuthNotice`, `submitAuth`

**Ввозит:**

- из `../core/session.js`: `AUTH_ADMIN`, `authAccounts`, `authSession`
- из `./context.js`: `ModalContext`
- из `./core.js`: `toggleModalMode`
- из `./edit-rights.js`: `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

**Содержит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `showAuthNotice`, `submitAuth`

### `modules/modal/concept-view.js`

Строк 336.

**Вывозит:** `similarConceptsBlock`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `../metrics/similarity-concepts.js`: `nearestConcepts`
- из `./connection-view.js`: `linkArrow`
- из `../util/color.js`: `getContrastColor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `VIEWS.generateConceptViewContent`, `similarConceptsBlock`

### `modules/modal/connection-edit.js`

Строк 283.

**Вывозит:** `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `WEIGHT_OPTIONS`, `relationHint`
- из `../core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `../graph/graph-data.js`: `connectionsBetween`
- из `./assembly.js`: `modalActions`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`
- из `../util/html.js`: `escapeAttr`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `VIEWS.generateConnectionEditContent`, `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

### `modules/modal/connection-view.js`

Строк 414.

**Вывозит:** `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `linkArrow`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `CONN_WEIGHT_WORDS`, `WEIGHT_WORDS`, `relationHint`
- из `../core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `../graph/graph-data.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `../graph/graph-selection.js`: `selectConceptOnGraph`
- из `./context.js`: `ModalContext`
- из `../util/color.js`: `getContrastColor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `VIEWS.generateConnectionViewContent`, `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `linkArrow`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`

### `modules/modal/context.js`

Строк 11.

**Вывозит:** `ModalContext`

**Ввозит:** _ничего_

**Содержит:** `ModalContext`

### `modules/modal/core.js`

Строк 154.

**Вывозит:** `MODAL_STACK_MAX`, `closeUniversalModal`, `modalStack`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/session.js`: `canEdit`
- из `../graph/graph-selection.js`: `cancelGraphSelection`
- из `./assembly.js`: `modalContentFor`, `modalEntityExists`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `ModalContext`
- из `./dirty.js`: `hasUnsavedChanges`
- из `./search.js`: `clearModalSearch`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`

**Содержит:** `MODAL_STACK_MAX`, `closeUniversalModal`, `modalStack`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

### `modules/modal/descriptions.js`

Строк 162.

**Вывозит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

**Ввозит:** _ничего_

**Содержит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

### `modules/modal/dirty.js`

Строк 111.

**Вывозит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `./assembly.js`: `modalEntityExists`
- из `./context.js`: `ModalContext`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

### `modules/modal/edit-forms.js`

Строк 287.

**Вывозит:** `syncPhilColorFromPicker`, `updatePhilColorSample`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `relationHint`
- из `../graph/graph-data.js`: `getConceptConnections`
- из `./assembly.js`: `modalActions`
- из `./connection-view.js`: `linkArrow`
- из `../util/color.js`: `getContrastColor`
- из `../util/html.js`: `escapeAttr`
- из `../util/philosopher-label.js`: `philosopherYears`, `sortPhilosophersByBirth`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `VIEWS.generateConceptEditContent`, `VIEWS.generatePhilosopherEditContent`, `syncPhilColorFromPicker`, `updatePhilColorSample`

### `modules/modal/edit-rights.js`

Строк 53.

**Вывозит:** `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

**Ввозит:**

- из `../core/session.js`: `authSession`, `canEdit`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`

**Содержит:** `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

### `modules/modal/entry.js`

Строк 123.

**Вывозит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/session.js`: `canEdit`
- из `../graph/graph-data.js`: `findConnection`, `getConceptConnections`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `../render/canvas-core.js`: `gfxSvg`
- из `../render/d3-layer.js`: `gfxNode`, `gfxZoom`
- из `../render/selection.js`: `highlightConnected`
- из `../state/render.js`: `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

### `modules/modal/integrity.js`

Строк 253.

**Вывозит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `labelOf`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `./entry.js`: `isConceptIsolated`
- из `../util/philosopher-label.js`: `philosopherBirth`, `philosopherYears`
- из `../util/ru.js`: `pluralRu`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `labelOf`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

### `modules/modal/persist.js`

Строк 360.

**Вывозит:** `confirmWarnings`, `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `generateId`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../data/mutate.js`: `afterDataChange`
- из `../graph/graph-data.js`: `addLinkToGraph`, `addNodeToGraph`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `./assembly.js`: `modalEntityExists`
- из `./context.js`: `ModalContext`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `./entry.js`: `getIsolatedConceptsAfterDeletion`
- из `./integrity.js`: `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `confirmWarnings`, `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `generateId`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

### `modules/modal/philosopher-view.js`

Строк 620.

**Вывозит:** `DATA_traditions_of`, `makeLegendsEditable`, `philosopherTraditionsBlock`, `similarPhilosophersBlock`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/session.js`: `canEdit`
- из `../metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `./connection-view.js`: `linkArrow`
- из `./edit-rights.js`: `refreshEditHints`
- из `./entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `../render/selection.js`: `highlightPhilosopherOnGraph`
- из `../util/color.js`: `getContrastColor`
- из `../util/philosopher-label.js`: `formatBirthYear`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `../util/ru.js`: `conjugateVerb`, `declinePhilosopher`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `DATA_traditions_of`, `VIEWS.generatePhilosopherViewContent`, `makeLegendsEditable`, `philosopherTraditionsBlock`, `similarPhilosophersBlock`

### `modules/modal/profile-concept.js`

Строк 181.

**Вывозит:** `PROFILE_METRICS`, `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `metricsScopeCounts`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `../util/color.js`: `getContrastColor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `PROFILE_METRICS`, `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

### `modules/modal/profile-philosopher.js`

Строк 120.

**Вывозит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `./profile-concept.js`: `PROFILE_METRICS`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `../util/color.js`: `getContrastColor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

### `modules/modal/search.js`

Строк 43.

**Вывозит:** `clearModalSearch`, `handleModalSearch`, `installModalSearchDismiss`

**Ввозит:**

- из `../core/search.js`: `displaySearchResults`, `pickConcepts`

**Содержит:** `clearModalSearch`, `handleModalSearch`, `installModalSearchDismiss`

### `modules/paths/analysis.js`

Строк 73.

**Вывозит:** `analyzePath`, `analyzePathTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `../graph/graph-data.js`: `traditionsOfPhilosopher`
- из `./chronology.js`: `isChronologicallyValid`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `analyzePath`, `analyzePathTraditions`

### `modules/paths/chronology.js`

Строк 174.

**Вывозит:** `DATA_nodes_find`, `installChronologyMode`, `installChronologyToggle`, `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `nodeAge`, `showChronologyModeIfOn`, `stepWithoutGap`, `strictChronologyCheck`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/time.js`: `CHRONOLOGY_MODES`, `MATURITY_AGE`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `DATA_nodes_find`, `installChronologyMode`, `installChronologyToggle`, `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `nodeAge`, `showChronologyModeIfOn`, `stepWithoutGap`, `strictChronologyCheck`

### `modules/paths/path-descriptions.js`

Строк 174.

**Вывозит:** `closePathDescriptionsModal`, `nodesDescriptionsVisible`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/relation-types.js`: `WEIGHT_WORDS`
- из `./analysis.js`: `analyzePathTraditions`
- из `./path-ui.js`: `resolvePathLinkList`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../util/color.js`: `getContrastColor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `closePathDescriptionsModal`, `nodesDescriptionsVisible`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

### `modules/paths/path-ui.js`

Строк 397.

**Вывозит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `resolvePathLinkList`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `./analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `./shortest-path.js`: `findShortestPath`
- из `../render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `../render/selection.js`: `resetHighlight`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `resolvePathLinkList`

### `modules/paths/shortest-path.js`

Строк 209.

**Вывозит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`, `isTypologicalLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `./chronology.js`: `isChronologicallyValid`, `nodeAge`, `stepWithoutGap`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

### `modules/render/canvas-core.js`

Строк 45.

**Вывозит:** `PICK_LINK_WIDTH`, `ctx`, `dpr`, `gfxCanvas`, `gfxSvg`, `pickCanvas`, `pickCtx`, `renderState`, `resizeCanvas`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./loop.js`: `requestDraw`

**Содержит:** `PICK_LINK_WIDTH`, `ctx`, `dpr`, `gfxCanvas`, `gfxSvg`, `pickCanvas`, `pickCtx`, `renderState`, `resizeCanvas`

### `modules/render/d3-layer.js`

Строк 105.

**Вывозит:** `dragended`, `dragstarted`, `gfxLink`, `gfxLinkAll`, `gfxNode`, `gfxZoom`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./canvas-core.js`: `renderState`
- из `./loop.js`: `requestDraw`
- из `./scene.js`: `startRadiusAnimation`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `dragended`, `dragstarted`, `gfxLink`, `gfxLinkAll`, `gfxNode`, `gfxZoom`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

### `modules/render/draw-link.js`

Строк 98.

**Вывозит:** `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./canvas-core.js`: `renderState`
- из `./geometry.js`: `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`
- из `./render-state.js`: `hasLinkClass`, `nodeRadius`
- из `../state/render.js`: `selectedEdges`

**Содержит:** `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`

### `modules/render/geometry.js`

Строк 95.

**Вывозит:** `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./canvas-core.js`: `renderState`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`

### `modules/render/grouping.js`

Строк 103.

**Вывозит:** `buildGroupPositions`, `cols`, `groupPositions`, `installResize`, `philosopherNames`, `rows`, `toggleGrouping`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./canvas-core.js`: `resizeCanvas`
- из `./selection.js`: `resetHighlight`
- из `../core/graph-index.js`: _ради побочного действия_
- из `../state/render.js`: _ради побочного действия_

**Содержит:** `S.spacingX`, `S.spacingY`, `buildGroupPositions`, `cols`, `groupPositions`, `installResize`, `philosopherNames`, `rows`, `toggleGrouping`

### `modules/render/interactions.js`

Строк 307.

**Вывозит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `installLinkHover`, `installNodeDrag`, `installNodeHover`, `lastHoverLink`, `lastHoverNode`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `../core/session.js`: `canEdit`
- из `../graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `../graph/graph-selection.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `./canvas-core.js`: `gfxCanvas`, `gfxSvg`, `renderState`
- из `./d3-layer.js`: `dragended`, `dragstarted`, `gfxLink`, `gfxNode`, `gfxZoom`, `linkHandlers`, `nodeHandlers`
- из `./loop.js`: `requestDraw`
- из `./picking.js`: `pickLink`, `pickNode`, `rebuildQuadtree`, `toGraph`
- из `./selection.js`: `resetHighlight`
- из `./tooltip-el.js`: `tooltip`
- из `../state/edit.js`: `editMode`
- из `../state/filters.js`: `chosenPhilosophers`
- из `../state/render.js`: `selectedEdges`
- из `../util/philosopher-label.js`: `labelWithAuthor`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `installLinkHover`, `installNodeDrag`, `installNodeHover`, `lastHoverLink`, `lastHoverNode`

### `modules/render/loop.js`

Строк 20.

**Вывозит:** `drawScheduled`, `painter`, `requestDraw`, `setPainter`

**Ввозит:** _ничего_

**Содержит:** `drawScheduled`, `painter`, `requestDraw`, `setPainter`

### `modules/render/metric-visualization.js`

Строк 371.

**Вывозит:** `currentVisualizedMetric`, `isVisualizingBySize`, `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/events.js`: `emit`
- из `../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `./d3-layer.js`: `gfxNode`, `updateArrows`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `currentVisualizedMetric`, `isVisualizingBySize`, `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

### `modules/render/picking.js`

Строк 79.

**Вывозит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./canvas-core.js`: `PICK_LINK_WIDTH`, `dpr`, `gfxCanvas`, `pickCanvas`, `pickCtx`, `renderState`
- из `./draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `./render-state.js`: `nodeRadius`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

### `modules/render/render-state.js`

Строк 17.

**Вывозит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasLinkClass`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`

**Ввозит:**

- из `./canvas-core.js`: `renderState`

**Содержит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasLinkClass`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`

### `modules/render/scene.js`

Строк 244.

**Вывозит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `startRadiusAnimation`, `stepRadiusAnimation`, `updateGraphData`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./canvas-core.js`: `ctx`, `dpr`, `gfxCanvas`, `renderState`
- из `./draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `./geometry.js`: `arcParams`, `linkHoverStrokeWidth`
- из `./loop.js`: `requestDraw`
- из `./picking.js`: `rebuildQuadtree`
- из `./render-state.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `./similarity-overlay.js`: `similarityColor`
- из `../state/render.js`: `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `startRadiusAnimation`, `stepRadiusAnimation`, `updateGraphData`

### `modules/render/selection.js`

Строк 260.

**Вывозит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `highlightPhilosopherOnGraph`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `./canvas-core.js`: `gfxSvg`
- из `./d3-layer.js`: `gfxLinkAll`, `gfxNode`, `gfxZoom`
- из `./loop.js`: `requestDraw`
- из `../state/filters.js`: `chosenPhilosophers`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `highlightPhilosopherOnGraph`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

### `modules/render/similarity-overlay.js`

Строк 112.

**Вывозит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/similarity-concepts.js`: `_simCache`, `profileSimilarity`, `structuralSimilarity`
- из `./loop.js`: `requestDraw`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

### `modules/render/simulation.js`

Строк 126.

**Вывозит:** `centerGraph`, `freezeSimulation`, `installSimulationLog`, `installSimulationStatsEnd`, `installSimulationTick`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `./canvas-core.js`: `gfxSvg`
- из `./d3-layer.js`: `gfxZoom`
- из `./loop.js`: `requestDraw`
- из `./picking.js`: `rebuildQuadtree`
- из `./scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `./selection.js`: `resetHighlight`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `centerGraph`, `freezeSimulation`, `installSimulationLog`, `installSimulationStatsEnd`, `installSimulationTick`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

### `modules/render/tooltip-el.js`

Строк 7.

**Вывозит:** `tooltip`

**Ввозит:** _ничего_

**Содержит:** `tooltip`

### `modules/state/edit.js`

Строк 14.

**Вывозит:** `editMode`, `graphSelectionContext`

**Ввозит:** _ничего_

**Содержит:** `editMode`, `graphSelectionContext`

### `modules/state/filters.js`

Строк 22.

**Вывозит:** `chosenPhilosophers`, `pinnedDespiteFilter`, `pinnedVisibleNodes`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `S.filterMode`, `S.selectedPhilosophers`, `S.selectedRelations`, `S.selectedRubrics`, `S.selectedTraditions`, `chosenPhilosophers`, `pinnedDespiteFilter`, `pinnedVisibleNodes`

### `modules/state/metrics-scope.js`

Строк 13.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.influenceScope`, `S.metricsLinkSource`, `S.metricsNodeSource`, `S.metricsScope`, `S.metricsScopeActive`

### `modules/state/paths.js`

Строк 18.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/time.js`: `CHRONOLOGY_MODES`

**Содержит:** `S.currentChronologyMode`, `S.currentPathData`, `S.respectDirection`, `S.selectedSourceNode`, `S.selectedTargetNode`, `S.skipTypologicalInPaths`, `S.useWeightedPaths`

### `modules/state/render.js`

Строк 36.

**Вывозит:** `selectedEdges`, `selectedNodes`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `S.arrowMode`, `S.arrowRadius`, `S.isGrouped`, `S.pickDirty`, `S.similarityOverlay`, `S.simulation`, `S.tickCount`, `S.uniformLinkWidthActive`, `S.viewHeight`, `S.viewWidth`, `selectedEdges`, `selectedNodes`

### `modules/state/stats.js`

Строк 33.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S._cmpA`, `S._cmpB`, `S._pairsCrossAuthor`, `S._pairsCrossTradition`, `S._pairsKind`, `S._pairsMinDegree`, `S._pairsMinShared`, `S._pcmpA`, `S._pcmpB`, `S._philPairsKind`, `S.currentStatsView`, `S.generateRankingsMode`, `S.isStatsModalOpen`, `S.metricValueMode`, `S.profileOrderMode`

### `modules/stats/coverage.js`

Строк 66.

**Вывозит:** `METRIC_COVERAGE_WARN`, `generateMetricCoverageBlock`, `metricCoverage`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../metrics/by-link-type.js`: _ради побочного действия_
- из `../metrics/concept-dynamics.js`: _ради побочного действия_
- из `../metrics/generativity.js`: _ради побочного действия_
- из `../metrics/philosophical.js`: _ради побочного действия_
- из `../metrics/tradition-bridging.js`: _ради побочного действия_

**Содержит:** `METRIC_COVERAGE_WARN`, `S.METRIC_COVERAGE_FN`, `S._metricCoverageCache`, `generateMetricCoverageBlock`, `metricCoverage`

### `modules/stats/modal.js`

Строк 238.

**Вывозит:** `closeStatsModal`, `handleStatsParameterChange`, `installStatsEscape`, `installStatsModalDismiss`, `loadStatsContent`, `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../metrics/graph-cache.js`: `invalidateGraphCache`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `../metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `updateMetricsScopeHint`, `updateScopeToggles`
- из `../render/metric-visualization.js`: `resetNodeSizes`
- из `../render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `./results.js`: `applyMetricLayout`
- из `./views/advanced.js`: `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`
- из `./views/comparison.js`: `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `./views/network.js`: `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`
- из `./views/philosopher.js`: `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`
- из `./views/philosophical.js`: `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`
- из `./views/rankings.js`: `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

**Содержит:** `closeStatsModal`, `handleStatsParameterChange`, `installStatsEscape`, `installStatsModalDismiss`, `loadStatsContent`, `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

### `modules/stats/results.js`

Строк 392.

**Вывозит:** `METRIC_FIELD_LABELS`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `lastZeroCount`, `rankKeep`, `restoreMetricLayoutMode`, `toggleMetricDetails`, `toggleMetricLayout`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../metrics/descriptions.js`: `getMetricDescription`
- из `../metrics/format.js`: `applyMetricMode`
- из `./coverage.js`: `generateMetricCoverageBlock`

**Содержит:** `METRIC_FIELD_LABELS`, `S.metricLayoutMode`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `lastZeroCount`, `rankKeep`, `restoreMetricLayoutMode`, `toggleMetricDetails`, `toggleMetricLayout`

### `modules/stats/run.js`

Строк 128.

**Вывозит:** `calculateMetricFromModal`, `hideProgress`, `runSingleMetric`, `showProgress`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../metrics/network.js`: `calculateBetweennessAsync`
- из `./modal.js`: `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

**Содержит:** `calculateMetricFromModal`, `hideProgress`, `runSingleMetric`, `showProgress`

### `modules/stats/views/advanced.js`

Строк 270.

**Вывозит:** `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../results.js`: `generateMetricDescriptionBlock`, `generateMetricResults`, `rankKeep`
- из `../../core/graph-index.js`: _ради побочного действия_

**Содержит:** `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`

### `modules/stats/views/comparison.js`

Строк 427.

**Вывозит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../core/events.js`: `emit`
- из `../../core/long-task.js`: `LoadingIndicator`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../../metrics/similarity-concepts.js`: `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `profileSimilarity`, `similarityData`, `structuralSimilarity`
- из `../../metrics/similarity-philosophers.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`, `philosopherSimilarity`, `philosopherSimilarityData`
- из `../results.js`: `generateMetricDescriptionBlock`
- из `../../core/graph-index.js`: _ради побочного действия_

**Содержит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

### `modules/stats/views/network.js`

Строк 223.

**Вывозит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`, `S`
- из `../../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `../results.js`: `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`
- из `../../core/graph-index.js`: _ради побочного действия_

**Содержит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

### `modules/stats/views/philosopher.js`

Строк 171.

**Вывозит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../results.js`: `generateMetricDescriptionBlock`, `rankKeep`
- из `./philosophical.js`: `influenceScopeSwitcher`
- из `../../core/graph-index.js`: _ради побочного действия_

**Содержит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

### `modules/stats/views/philosophical.js`

Строк 449.

**Вывозит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`, `influenceScopeSwitcher`, `setInfluenceScope`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`, `S`
- из `../../core/events.js`: `emit`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosophical.js`: `INFLUENCE_SCOPE_LABELS`, `invalidateInfluenceIndexCache`
- из `../../metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`
- из `../results.js`: `generateMetricResults`, `rankKeep`
- из `../../core/graph-index.js`: _ради побочного действия_

**Содержит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`, `influenceScopeSwitcher`, `setInfluenceScope`

### `modules/stats/views/rankings.js`

Строк 141.

**Вывозит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/rankings.js`: `generatePhilosopherRankings`, `generateRankings`
- из `../results.js`: `generateMetricDescriptionBlock`
- из `./philosophical.js`: `influenceScopeSwitcher`

**Содержит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

### `modules/ui/about.js`

Строк 102.

**Вывозит:** `buildAboutText`, `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `buildAboutText`, `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`

### `modules/ui/actions-byname.js`

Строк 20.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../modal/persist.js`: `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Содержит:** _только исполняемый код_

### `modules/ui/actions-dyn.js`

Строк 148.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../core/ns.js`: `DATA`, `S`
- из `../graph/graph-data.js`: `findConnection`
- из `../graph/graph-selection.js`: `cancelGraphSelection`
- из `../metrics/format.js`: `toggleMetricValueMode`
- из `../modal/auth.js`: `authLogout`, `closeAuthModal`, `openAuthModal`, `submitAuth`
- из `../modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `../modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `../modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `../modal/descriptions.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `../modal/edit-forms.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `../modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `../modal/persist.js`: `deleteConnection`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `../modal/search.js`: `clearModalSearch`, `handleModalSearch`
- из `../paths/path-descriptions.js`: `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `../paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`
- из `../render/metric-visualization.js`: `toggleMetricVisualization`
- из `../render/selection.js`: `highlightNodeById`
- из `../render/similarity-overlay.js`: `clearSimilarityOverlay`, `showSimilarityOverlay`
- из `../stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `../stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `../stats/run.js`: `calculateMetricFromModal`
- из `../stats/views/comparison.js`: `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `../stats/views/philosophical.js`: `setInfluenceScope`
- из `./legend.js`: `addTradition`, `onlyTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `./search-legend.js`: `selectSearchResult`
- из `./search-link.js`: `highlightLinkOnGraph`, `pickLinkEnd`
- из `./search-philosopher.js`: `clearPhilosopherSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`
- из `../widgets/custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

**Содержит:** _только исполняемый код_

### `modules/ui/actions-static.js`

Строк 121.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../data/save.js`: `downloadData`, `saveToFolder`
- из `../filters/beyond-filter.js`: `resetBeyondFilter`
- из `../metrics/scope.js`: `handleMetricsScopeChange`
- из `../modal/core.js`: `closeUniversalModal`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `../paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `../paths/path-ui.js`: `findAndShowPath`
- из `../render/grouping.js`: `toggleGrouping`
- из `../render/metric-visualization.js`: `resetNodeSizes`
- из `../render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `../stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `./about.js`: `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`
- из `./export.js`: `exportToPNG`, `exportToSVG`
- из `./legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `toggleSection`, `toggleUniformLinkWidth`
- из `./panels.js`: `togglePanel`
- из `./search-legend.js`: `clearLegendSearch`, `handleLegendSearch`, `setSearchKind`, `toggleLegendSearch`
- из `./search-link.js`: `handleLegendLinkSearch`
- из `./search-philosopher.js`: `clearLegendPhilSearch`, `handleLegendPhilSearch`
- из `../widgets/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

**Содержит:** _только исполняемый код_

### `modules/ui/actions.js`

Строк 27.

**Вывозит:** `actionNames`, `registerActions`, `runAction`

**Ввозит:** _ничего_

**Содержит:** `actionNames`, `registerActions`, `runAction`

### `modules/ui/delegation.js`

Строк 70.

**Вывозит:** `installDelegation`

**Ввозит:**

- из `./actions.js`: `runAction`

**Содержит:** `installDelegation`

### `modules/ui/export.js`

Строк 126.

**Вывозит:** `exportToPNG`, `exportToSVG`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `../render/canvas-core.js`: `renderState`
- из `../render/draw-link.js`: `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`
- из `../render/geometry.js`: `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`
- из `../render/render-state.js`: `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `../render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `../state/render.js`: `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `exportToPNG`, `exportToSVG`

### `modules/ui/hint.js`

Строк 60.

**Вывозит:** `hideHint`, `hintBox`, `installHintOnClick`, `installHintOnScroll`, `installHintOut`, `installHintOver`, `showHint`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.tooltipTimeout`, `hideHint`, `hintBox`, `installHintOnClick`, `installHintOnScroll`, `installHintOut`, `installHintOver`, `showHint`

### `modules/ui/legend.js`

Строк 317.

**Вывозит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `legendDirectionToggle`, `legendWeightsToggle`, `markChosenInLegend`, `onlyTradition`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncLegendDirectionToggle`, `syncLegendWeightsToggle`, `syncPhilosopherCheckboxes`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/relation-types.js`: `relationHint`
- из `../filters/filters.js`: `applyFilters`, `philosopherPassesTraditions`
- из `../render/canvas-core.js`: `renderState`
- из `../render/d3-layer.js`: `updateArrows`
- из `../state/filters.js`: `chosenPhilosophers`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `legendDirectionToggle`, `legendWeightsToggle`, `markChosenInLegend`, `onlyTradition`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncLegendDirectionToggle`, `syncLegendWeightsToggle`, `syncPhilosopherCheckboxes`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`

### `modules/ui/panels.js`

Строк 40.

**Вывозит:** `restorePanelStates`, `togglePanel`

**Ввозит:** _ничего_

**Содержит:** `restorePanelStates`, `togglePanel`

### `modules/ui/search-legend.js`

Строк 140.

**Вывозит:** `clearLegendSearch`, `handleLegendSearch`, `installLegendSearchDismiss`, `searchKind`, `selectSearchResult`, `setSearchKind`, `toggleLegendSearch`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../core/search.js`: `displaySearchResults`, `pickConcepts`
- из `../core/visibility.js`: `isNodeVisible`
- из `../filters/beyond-filter.js`: `updateFilterNote`
- из `../filters/filters.js`: `applyFiltersImmediate`
- из `../modal/entry.js`: `showDetailModal`
- из `../modal/search.js`: `clearModalSearch`
- из `../render/canvas-core.js`: `gfxSvg`
- из `../render/d3-layer.js`: `gfxZoom`
- из `../render/selection.js`: `highlightConnected`
- из `../state/filters.js`: `pinnedDespiteFilter`, `pinnedVisibleNodes`
- из `../state/render.js`: `selectedNodes`
- из `./search-link.js`: `clearLinkSearch`
- из `./search-philosopher.js`: `clearLegendPhilSearch`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `clearLegendSearch`, `handleLegendSearch`, `installLegendSearchDismiss`, `searchKind`, `selectSearchResult`, `setSearchKind`, `toggleLegendSearch`

### `modules/ui/search-link.js`

Строк 117.

**Вывозит:** `clearLinkSearch`, `handleLegendLinkSearch`, `highlightLinkOnGraph`, `linkSearch`, `pickLinkEnd`, `showFoundLinks`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `../render/canvas-core.js`: `gfxSvg`
- из `../render/d3-layer.js`: `gfxZoom`
- из `../render/loop.js`: `requestDraw`
- из `../render/selection.js`: `highlightCombined`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `clearLinkSearch`, `handleLegendLinkSearch`, `highlightLinkOnGraph`, `linkSearch`, `pickLinkEnd`, `showFoundLinks`

### `modules/ui/search-philosopher.js`

Строк 98.

**Вывозит:** `clearLegendPhilSearch`, `clearPhilosopherSearch`, `handleLegendPhilSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `pickPhilosophers`, `selectPhilosopherResult`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/search.js`: `emptyList`
- из `../modal/core.js`: `openUniversalModal`
- из `../render/selection.js`: `highlightPhilosopherOnGraph`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `clearLegendPhilSearch`, `clearPhilosopherSearch`, `handleLegendPhilSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `pickPhilosophers`, `selectPhilosopherResult`

### `modules/util/color.js`

Строк 23.

**Вывозит:** `getContrastColor`

**Ввозит:** _ничего_

**Содержит:** `getContrastColor`

### `modules/util/html.js`

Строк 9.

**Вывозит:** `escapeAttr`

**Ввозит:** _ничего_

**Содержит:** `escapeAttr`

### `modules/util/philosopher-label.js`

Строк 39.

**Вывозит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

### `modules/util/ru.js`

Строк 49.

**Вывозит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`

**Ввозит:** _ничего_

**Содержит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`

### `modules/widgets/custom-select.js`

Строк 88.

**Вывозит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `emit`
- из `../core/search.js`: `emptyList`, `pickConcepts`, `rowInner`
- из `../core/graph-index.js`: _ради побочного действия_

**Содержит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`