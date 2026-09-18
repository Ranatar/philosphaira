// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { subscribe } from '../core/events.js';
import { conceptById } from '../core/graph-index.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { applyFiltersImmediate } from '../filters/filters.js';
import { handleMetricsScopeChange } from '../metrics/scope.js';
import { networkSimilarityData } from '../metrics/similarity-concepts.js';
import { ModalContext } from '../modal/context.js';
import { openUniversalModal } from '../modal/core.js';
import { openConceptById } from '../modal/entry.js';
import { findAndShowPath } from '../paths/path-ui.js';
import { setSimilarityLinks, showSimilarityOverlay } from '../render/similarity-overlay.js';
import { handleStatsParameterChange, openStatsModal, switchStatsView } from '../stats/modal.js';
import { renderComparison } from '../stats/views/comparison.js';
import { changeFilterMode, syncPhilosopherCheckboxes } from './legend.js';
import { selectCustomOption } from '../widgets/custom-select.js';

const LINK_KEYS = {
      concept: 'c', philosopher: 'phil', connection: 'link',
      path: 'path', pathOpts: 'popts', stats: 'stats', cmp: 'cmp',
      pairs: 'pairs', sim: 'sim', simLinks: 'simlinks',
      philosophers: 'ph', relations: 'rel', rubrics: 'rub', mode: 'mode',
    };

let _linkApplying = false;

let _linkMissed = [];

let _linkLastHash = null;

function philosopherIdByName(name) {
      const found = DATA.philosophers.find(x => (x.nameRu || x.name) === name);
      return found ? found.id : null;
    }

function philosopherNameById(id) {
      const found = DATA.philosophers.find(x => x.id === id);
      return found ? (found.nameRu || found.name) : null;
    }

function excludedList(set, all, toKey) {
      const out = [];
      for (const x of all) {
        const key = toKey ? toKey(x) : x;
        if (key && !set.has(x)) out.push(key);
      }
      return out;
    }

function currentLinkState() {
      const st = {};
      // окно сущности
      const modal = document.getElementById('universalModal');
      if (modal && modal.classList.contains('show') && ModalContext.currentData
          && ModalContext.currentMode === 'view') {
        const data = ModalContext.currentData;
        if (ModalContext.currentEntity === 'concept' && data.id) st.concept = data.id;
        if (ModalContext.currentEntity === 'philosopher') {
          const id = data.id || philosopherIdByName(data.nameRu || data.name);
          if (id) st.philosopher = id;
        }
        if (ModalContext.currentEntity === 'connection' && data.id) st.connection = data.id;
      }
      // путь
      if (S.selectedSourceNode && S.selectedTargetNode) {
        st.path = S.selectedSourceNode + '..' + S.selectedTargetNode;
        const letterIf = (id, letter) => document.getElementById(id) && document.getElementById(id).checked ? letter : '';
        const opts = [letterIf('respectChronology', 'x'), letterIf('respectDirectionPath', 'd'),
                      letterIf('useWeightsPath', 'w'), letterIf('skipTypologicalPath', 't')].join('');
        const chron = (document.getElementById('chronologyModeSelect') || {}).value;
        st.pathOpts = opts + (chron ? ':' + chron : '');
      }
      // статистика
      const statsModal = document.getElementById('statsModal');
      if (statsModal && getComputedStyle(statsModal).display !== 'none' && S.currentStatsView) {
        st.stats = S.currentStatsView;
        const toggleState = id => { const el = document.getElementById(id); return el ? el.checked : null; };
        const weights = toggleState('statsUseWeightsToggle'), data = toggleState('statsRespectDirectionToggle'), sc = toggleState('statsScopeToggle');
        const flags = [];
        if (weights === false) flags.push('-w');
        if (data === false) flags.push('-d');
        if (sc === true) flags.push('filtered');
        if (flags.length) st.statsFlags = flags.join(',');
        if (S.currentStatsView === 'comparison' && S._cmpA && S._cmpB) st.cmp = S._cmpA + '..' + S._cmpB;
        if (S.currentStatsView === 'closest-pairs' && S._pairsKind !== 'profile') st.pairs = S._pairsKind;
      }
      // карта сходства
      if (S.similarityOverlay && S.similarityOverlay.sourceId) {
        st.sim = S.similarityOverlay.sourceId + ':' + S.similarityOverlay.kind;
        const linkMode = S.similarityOverlay.linkMode || 'none';
        if (linkMode !== 'none') st.simLinks = linkMode;
      }
      // фильтры — отличием от умолчания
      const ph = excludedList(S.selectedPhilosophers, Object.keys(DATA.philosopherConcepts), philosopherIdByName);
      if (ph.length) st.philosophers = ph.join(',');
      const rel = excludedList(S.selectedRelations, Object.keys(DATA.relationTypesObj));
      if (rel.length) st.relations = rel.join(',');
      const rub = excludedList(S.selectedRubrics, DATA.rubrics.map(r => r.id));
      if (rub.length) st.rubrics = rub.join(',');
      if (S.filterMode !== 'all') st.mode = S.filterMode;
      return st;
    }

function linkStateToHash(st) {
      const parts = [];
      for (const [field, key] of Object.entries(LINK_KEYS)) {
        if (st[field]) parts.push(key + '=' + st[field]);
      }
      if (st.statsFlags) parts.push('sflags=' + st.statsFlags);
      return parts.join('&');
    }

function hashToLinkState(hash) {
      const st = {};
      const text = String(hash || '').replace(/^#/, '');
      if (!text) return st;
      const byKey = {};
      for (const [field, key] of Object.entries(LINK_KEYS)) byKey[key] = field;
      byKey.sflags = 'statsFlags';
      for (const chunk of text.split('&')) {
        const i = chunk.indexOf('=');
        if (i < 1) continue;
        const field = byKey[chunk.slice(0, i)];
        if (field) st[field] = decodeURIComponent(chunk.slice(i + 1));
      }
      return st;
    }

function syncLinkHash(push) {
      if (_linkApplying) return;
      const hash = linkStateToHash(currentLinkState());
      if (hash === _linkLastHash) return;
      _linkLastHash = hash;
      const address = location.pathname + location.search + (hash ? '#' + hash : '');
      try {
        if (push) window.history.pushState(null, '', address);
        else window.history.replaceState(null, '', address);
      } catch (e) { /* file:// в старых ладах истории не даёт */ }
    }

function applyLinkState(st) {
      const missed = [];
      _linkApplying = true;
      try {
        // 1. фильтры — до всего прочего: они решают, что вообще на графе
        const splitList = (v, fits) => String(v || '').split(',').map(x => x.trim()).filter(Boolean).filter(fits);
        if (st.philosophers !== undefined) {
          S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));
          for (const id of splitList(st.philosophers, () => true)) {
            const name = philosopherNameById(id);
            if (name && S.selectedPhilosophers.has(name)) S.selectedPhilosophers.delete(name);
            else missed.push('философ ' + id);
          }
        }
        if (st.relations !== undefined) {
          S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));
          for (const setToggle of splitList(st.relations, () => true)) {
            if (S.selectedRelations.has(setToggle)) S.selectedRelations.delete(setToggle); else missed.push('тип связи ' + setToggle);
          }
        }
        if (st.rubrics !== undefined) {
          S.selectedRubrics = new Set(DATA.rubrics.map(rubric => rubric.id));
          for (const rubric of splitList(st.rubrics, () => true)) {
            if (S.selectedRubrics.has(rubric)) S.selectedRubrics.delete(rubric); else missed.push('рубрика ' + rubric);
          }
        }
        if (st.mode && st.mode !== S.filterMode) {
          const select = document.getElementById('filterMode');
          if (select && [...select.options].some(o => o.value === st.mode)) {
            select.value = st.mode;
            changeFilterMode(st.mode);
          } else missed.push('режим ' + st.mode);
        } else {
          if (typeof syncPhilosopherCheckboxes === 'function') syncPhilosopherCheckboxes();
          applyFiltersImmediate();
        }
        // 2. путь
        if (st.path) {
          const [a, b] = st.path.split('..');
          if (conceptById.get(a) && conceptById.get(b)) {
            selectCustomOption('source', a);
            selectCustomOption('target', b);
            const [flags, chron] = String(st.pathOpts || '').split(':');
            const setFlag = (id, letter) => { const el = document.getElementById(id); if (el) el.checked = (flags || '').includes(letter); };
            if (st.pathOpts !== undefined) {
              setFlag('respectChronology', 'x'); setFlag('respectDirectionPath', 'd');
              setFlag('useWeightsPath', 'w'); setFlag('skipTypologicalPath', 't');
              const select = document.getElementById('chronologyModeSelect');
              if (select && chron && [...select.options].some(o => o.value === chron)) select.value = chron;
            }
            findAndShowPath();
          } else missed.push('концепция пути');
        }
        // 3. статистика
        if (st.stats) {
          // openStatsModal через 100 мс щёлкает по «Обзору», если вида ещё
          // не было; ставим вид заранее, чтобы пошла ветка возврата
          S.currentStatsView = st.stats;
          openStatsModal();
          const setToggle = (id, wanted) => { const el = document.getElementById(id); if (el && el.checked !== wanted) { el.checked = wanted; return true; } return false; };
          const flags = String(st.statsFlags || '').split(',');
          let changed = false;
          changed = setToggle('statsUseWeightsToggle', !flags.includes('-w')) || changed;
          changed = setToggle('statsRespectDirectionToggle', !flags.includes('-d')) || changed;
          if (changed && typeof handleStatsParameterChange === 'function') handleStatsParameterChange();
          if (setToggle('statsScopeToggle', flags.includes('filtered')) && typeof handleMetricsScopeChange === 'function') handleMetricsScopeChange();
          if (st.pairs) S._pairsKind = st.pairs;
          switchStatsView(st.stats);
          // пару ставим ПОСЛЕ входа в вид: вход в сравнение сбрасывает концы
          if (st.cmp) {
            const [a, b] = st.cmp.split('..');
            if (conceptById.get(a) && conceptById.get(b)) {
              S._cmpA = a; S._cmpB = b;
              if (typeof renderComparison === 'function') renderComparison();
            } else missed.push('концепция сравнения');
          }
        }
        // 4. карта сходства — но не запуская долгого счёта
        if (st.sim) {
          const [id, kind] = st.sim.split(':');
          if (!conceptById.get(id)) missed.push('концепция карты ' + id);
          else if (kind === 'network' && !networkSimilarityData()) {
            missed.push('карта по месту в сети (нажмите «По месту в сети»: сетевые метрики считаются несколько секунд)');
          } else {
            showSimilarityOverlay(id, kind || 'profile');
            // режим показа связей живёт в самом наложении и ставится после него
            if (st.simLinks && S.similarityOverlay) setSimilarityLinks(st.simLinks);
          }
        }
        // 5. окно сущности — последним, оно поверх всего
        if (st.concept) {
          const node = conceptById.get(st.concept);
          if (node) openConceptById(st.concept); else missed.push('концепция ' + st.concept);
        } else if (st.philosopher) {
          const name = philosopherNameById(st.philosopher);
          const phil = name ? DATA.philosophers.find(x => x.id === st.philosopher) : null;
          if (phil) openUniversalModal('philosopher', phil, 'view'); else missed.push('философ ' + st.philosopher);
        } else if (st.connection) {
          const relation = (DATA.relations).find(rubric => rubric.id === st.connection);
          if (relation) openUniversalModal('connection', relation, 'view'); else missed.push('связь ' + st.connection);
        }
      } finally {
        _linkApplying = false;
      }
      _linkMissed = missed.slice();   // извещение живёт секунды, запись — нет
      if (missed.length && typeof showTemporaryMessage === 'function') {
        showTemporaryMessage('Ссылка восстановлена не целиком: ' + missed.join('; '), 6000);
      }
      _linkLastHash = linkStateToHash(currentLinkState());
      return missed;
    }

function initLinkState() {
      // Крюки в нижних модулях подают СОБЫТИЕ, а не зовут syncLinkHash: слой
      // ссылок живёт на ui/ (этаж 6), а крюки стоят в filters/, metrics/,
      // modal/, paths/, render/ и stats/ — прямой зов дал бы семь рёбер ввоза
      // снизу вверх. Развороты держит шина, для того она и заведена.
      subscribe('state-changed', push => syncLinkHash(push));
      window.addEventListener('popstate', () => {
        applyLinkState(hashToLinkState(location.hash));
      });
      if (location.hash && location.hash.length > 1) {
        applyLinkState(hashToLinkState(location.hash));
      } else {
        _linkLastHash = linkStateToHash(currentLinkState());
      }
    }

export { _linkMissed, applyLinkState, currentLinkState, hashToLinkState, initLinkState, linkStateToHash };
