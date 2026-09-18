// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../../core/ns.js';
import '../../core/graph-index.js';
import { emit } from '../../core/events.js';
import { conceptById } from '../../core/graph-index.js';
import { LoadingIndicator } from '../../core/long-task.js';
import { initializePhilosophyMetrics } from '../../metrics/link-indexes.js';
import { philosopherProfile } from '../../metrics/philosopher.js';
import { NETWORK_ROLE_WORDS, SIM_SHARED_HIGH, _pairCalculating, allConceptPairs, allConceptPairsAsync, ensureNetworkProfile, fillPairsNetwork, networkProgressPercent, networkRoleOf, networkSimilarity, profileIsMeaningful, profileSimilarity, similarityData, similarityThresholds, structuralSimilarity, typeStyleSimilarity } from '../../metrics/similarity-concepts.js';
import { PHIL_SIM_LABELS, SIM_METRIC_LABELS, philosopherSimilarity, philosopherSimilarityData } from '../../metrics/similarity-philosophers.js';

import { generateMetricDescriptionBlock } from '../results.js';
import { liveProgressHtml, updateLiveProgress } from '../../util/html.js';

function generatePhilosopherComparisonContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const P = philosopherSimilarityData();
      if (!S._pcmpA) S._pcmpA = P.phs[0];
      if (!S._pcmpB) S._pcmpB = P.phs[1];

      const opts = sel => P.phs.map(ph =>
        `<option value="${ph}"${ph === sel ? ' selected' : ''}>${ph}</option>`).join('');

      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">👤 Сравнение философов</h3>
          <p class="stats-content-subtitle">Четыре независимые меры схожести философских систем</p>
        </div>

        ${generateMetricDescriptionBlock('philosopher-comparison')}

        <div class="cmp-selects">
          <div class="cmp-field">
            <label class="cmp-field-label">Первый философ</label>
            <select class="cmp-select" data-act-change="render-philosopher-comparison-change">${opts(S._pcmpA)}</select>
          </div>
          <span class="cmp-vs">против</span>
          <div class="cmp-field">
            <label class="cmp-field-label">Второй философ</label>
            <select class="cmp-select" data-act-change="render-philosopher-comparison-change-2">${opts(S._pcmpB)}</select>
          </div>
        </div>

        <div id="pcmpBody"></div>
      `;
    }

function renderPhilosopherComparison() {
      const box = document.getElementById('pcmpBody');
      if (!box) return;
      const P = philosopherSimilarityData();
      const a = S._pcmpA, b = S._pcmpB;
      if (!a || !b) return;

      const scores = Object.keys(PHIL_SIM_LABELS).map(k =>
        ({ k, v: philosopherSimilarity(a, b, k) }));

      const prA = philosopherProfile(a) || {}, prB = philosopherProfile(b) || {};
      const keys = ['influence', 'revolutionary', 'coherence', 'instrumental', 'deductive'];
      const keyLabel = { influence: 'Влияние', revolutionary: 'Революционность',
        coherence: 'Когерентность', instrumental: 'Инструментальность', deductive: 'Дедуктивность' };

      // М20: показываем не только средний уровень, но и разброс
      const maxOf = k => Math.max(
        ...P.phs.map(ph => (philosopherProfile(ph) || { averages: {} }).averages[k] || 0), 1e-9);
      const rows = keys.map(k => {
        const mx = maxOf(k);
        const va = (prA.averages || {})[k] || 0, vb = (prB.averages || {})[k] || 0;
        const sa = (prA.spreads || {})[k] || 0, sb = (prB.spreads || {})[k] || 0;
        const pa = Math.round(va / mx * 100), pb = Math.round(vb / mx * 100);
        return `
          <div class="cmp-row ${Math.abs(pa - pb) <= 15 ? 'cmp-close' : (Math.abs(pa - pb) >= 50 ? 'cmp-far' : '')}">
            <div class="cmp-label">${keyLabel[k]}</div>
            <div class="cmp-bars">
              <div class="cmp-bar cmp-bar-a" style="width:${pa}%"></div>
              <div class="cmp-bar cmp-bar-b" style="width:${pb}%"></div>
            </div>
            <div class="cmp-nums" data-tip="среднее ± разброс">${va.toFixed(1)}±${sa.toFixed(1)} / ${vb.toFixed(1)}±${sb.toFixed(1)}</div>
          </div>`;
      }).join('');

      const styleTop = i => {
        const v = P.buildStyle[P.index.get(i)];
        const mx = v.indexOf(Math.max(...v));
        return P.types[mx];
      };

      box.innerHTML = `
        <div class="cmp-summary">
          ${scores.map(s => `
            <div class="cmp-score">
              <div class="cmp-score-value">${Math.round(s.v * 100)} %</div>
              <div class="cmp-score-label">${PHIL_SIM_LABELS[s.k]}</div>
            </div>`).join('')}
        </div>

        <div class="cmp-verdict">
          Характерный тип связи: у «${a}» — <b>${styleTop(a)}</b>, у «${b}» — <b>${styleTop(b)}</b>.
          Концепций: ${P.conceptsOf[a].length} и ${P.conceptsOf[b].length}.
        </div>

        <div class="cmp-legend">
          <span><i class="cmp-swatch cmp-bar-a"></i>${a}</span>
          <span><i class="cmp-swatch cmp-bar-b"></i>${b}</span>
          <span class="cmp-legend-hint">столбик — средний уровень относительно сильнейшего философа; цифрами среднее ± разброс по концептам</span>
        </div>

        <div class="cmp-rows">${rows}</div>
      `;
    }

function generatePhilosopherPairsContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🤝 Близкие пары философов</h3>
          <p class="stats-content-subtitle">${(() => { const _p = new Set(S._concepts.map(c => c.philosopher)).size; return _p * (_p - 1) / 2; })()} пар по четырём независимым мерам</p>
        </div>

        ${generateMetricDescriptionBlock('philosopher-pairs')}

        <div class="pairs-controls">
          <div class="pairs-modes">
            ${Object.entries(PHIL_SIM_LABELS).map(([k, l]) =>
              `<button class="pairs-btn" id="philPairsBtn_${k}"
                   data-act-click="render-philosopher-pairs" data-a1="${k}">${l}</button>`).join('')}
          </div>
        </div>

        <div id="philPairsBody"></div>
      `;
    }

function renderPhilosopherPairs() {
      const box = document.getElementById('philPairsBody');
      if (!box) return;
      const P = philosopherSimilarityData();
      Object.keys(PHIL_SIM_LABELS).forEach(k =>
        document.getElementById('philPairsBtn_' + k)?.classList.toggle('active', k === S._philPairsKind));

      const all = [];
      for (let i = 0; i < P.phs.length; i++) {
        for (let j = i + 1; j < P.phs.length; j++) {
          all.push([philosopherSimilarity(P.phs[i], P.phs[j], S._philPairsKind), P.phs[i], P.phs[j]]);
        }
      }
      all.sort((x, y) => y[0] - x[0]);
      const top = all.slice(0, 30);

      box.innerHTML = `
        <div class="pairs-count">Мера: ${PHIL_SIM_LABELS[S._philPairsKind]}. Показаны первые ${top.length} из ${all.length}.</div>
        <div class="pairs-rows">
          ${top.map(([v, a, b], i) => `
            <div class="pairs-row" data-act-click="open-philosopher-pair" data-a1="${a}" data-a2="${b}" data-tip="Открыть в сравнении философов">
              <div class="pairs-rank">#${i + 1}</div>
              <div class="pairs-names">
                <span class="pairs-name">${a}</span>
                <span class="pairs-tilde">~</span>
                <span class="pairs-name">${b}</span>
              </div>
              <div class="pairs-value">${v.toFixed(3)}</div>
              <div class="pairs-extra"></div>
            </div>`).join('')}
        </div>
      `;
    }

function openPhilosopherPair(a, b) {
      S._pcmpA = a; S._pcmpB = b;
      emit('switch-stats-view', 'philosopher-comparison');
    }

function generateClosestPairsContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🔗 Близкие пары концепций</h3>
          <p class="stats-content-subtitle">Наиболее схожие пары по профилю метрик, структуре связей, типам связей и месту в сети</p>
        </div>

        ${generateMetricDescriptionBlock('closest-pairs')}

        <div class="pairs-controls">
          <div class="pairs-modes">
            <button class="pairs-btn" id="pairsBtnProfile" data-act-click="render-closest-pairs">По профилю</button>
            <button class="pairs-btn" id="pairsBtnStructure" data-act-click="render-closest-pairs-2">По структуре</button>
            <button class="pairs-btn" id="pairsBtnTypes" data-act-click="render-closest-pairs-3">По типам связей</button>
            <button class="pairs-btn" id="pairsBtnNetwork" data-sweep-skip data-act-click="render-closest-pairs-4">По месту в сети</button>
          </div>
          <label class="pairs-filter">
            Минимальная связность узла: <b id="pairsDegVal">${S._pairsMinDegree}</b>
            <input type="range" min="1" max="20" value="${S._pairsMinDegree}"
                 data-act-input="render-closest-pairs-input">
          </label>
          <label class="pairs-filter" id="pairsSharedFilter">
            Минимум общих соседей: <b id="pairsShVal">${S._pairsMinShared}</b>
            <input type="range" min="0" max="10" value="${S._pairsMinShared}"
                 data-act-input="render-closest-pairs-input-2">
          </label>
          <label class="pairs-check">
            <input type="checkbox" ${S._pairsCrossAuthor ? 'checked' : ''}
                 data-act-change="render-closest-pairs-change">
            только между разными философами
          </label>
          <label class="pairs-check">
            <input type="checkbox" ${S._pairsCrossTradition ? 'checked' : ''}
                 data-act-change="render-closest-pairs-change-2">
            только между разными традициями
          </label>
        </div>

        <div id="pairsBody"></div>
      `;
    }

async function renderClosestPairs() {
      const box = document.getElementById('pairsBody');
      if (!box) return;

      let P = allConceptPairs();

      // Первое построение считает все пары концепций и занимает несколько секунд.
      // Дальше всё берётся из кеша, поэтому ползунки работают мгновенно.
      if (!P) {
        if (_pairCalculating) {
          box.innerHTML = '<div class="pairs-count">Расчёт уже идёт…</div>';
          return;
        }
        const indicator = LoadingIndicator.create(
          'Расчёт близости концепций',
          `Сравнение ${(S._concepts.length * (S._concepts.length - 1) / 2).toLocaleString('ru')} пар по профилю, соседям и типам связей`,
          '#6c5ce7'
        );
        try {
          P = await allConceptPairsAsync(pct => indicator.updateProgress(pct));
        } catch (e) {
          console.error('Ошибка расчёта пар:', e);
        } finally {
          indicator.remove();
        }
        if (!P) {
          box.innerHTML = '<div class="pairs-count">Не удалось построить матрицу пар.</div>';
          return;
        }
      }
      const kind = S._pairsKind;
      emit('state-changed', false);
      if (kind === 'network' && !fillPairsNetwork(P)) {
        box.innerHTML = '<div class="pairs-count">Считаю сетевые метрики… '
          + liveProgressHtml(networkProgressPercent()) + '</div>';
        const ok = await ensureNetworkProfile(pct => updateLiveProgress(document.getElementById('pairsBody'), pct));
        if (!ok) { box.innerHTML = '<div class="pairs-count">Сетевые метрики не досчитались.</div>'; return; }
        if (S._pairsKind === 'network' && document.getElementById('pairsBody')) renderClosestPairs();
        return;
      }
      const isStructure = kind === 'structure';
      const philOf = {};
      DATA.nodes.forEach(n => philOf[n.id] = n.concept);
      const labOf = {};
      DATA.nodes.forEach(n => labOf[n.id] = n.label);

      [['pairsBtnProfile', 'profile'], ['pairsBtnStructure', 'structure'],
       ['pairsBtnTypes', 'types'], ['pairsBtnNetwork', 'network']].forEach(([id, k]) =>
        document.getElementById(id)?.classList.toggle('active', k === kind));
      const shFilter = document.getElementById('pairsSharedFilter');
      if (shFilter) shFilter.style.display = isStructure ? '' : 'none';
      const valuesOf = { profile: P.pv, structure: P.jv, types: P.tv, network: P.nv }[kind] || P.pv;
      const dv = document.getElementById('pairsDegVal'); if (dv) dv.textContent = S._pairsMinDegree;
      const sv = document.getElementById('pairsShVal'); if (sv) sv.textContent = S._pairsMinShared;

      const picked = [];
      for (let k = 0; k < P.total; k++) {
        const i = P.ia[k], j = P.ja[k];
        if (P.deg[i] < S._pairsMinDegree || P.deg[j] < S._pairsMinDegree) continue;
        const a = P.ids[i], b = P.ids[j];
        if (S._pairsCrossAuthor && philOf[a] === philOf[b]) continue;
        if (S._pairsCrossTradition) {
          // Тот же критерий, что в режиме «между традициями» и при переходах
          // в цепочке пути: общей традиции нет ни одной.
          const ta = DATA.philosopherTraditions[philOf[a]] || [];
          const tb = DATA.philosopherTraditions[philOf[b]] || [];
          if (!ta.length || !tb.length || ta.some(x => tb.includes(x))) continue;
        }
        if (isStructure) {
          if (P.sh[k] < S._pairsMinShared) continue;
          if (P.jv[k] <= 0) continue;
        }
        picked.push([valuesOf[k], k]);
      }
      picked.sort((x, y) => y[0] - x[0]);
      const top = picked.slice(0, 40);

      if (!top.length) {
        box.innerHTML = '<div class="empty-state"><div class="empty-state-text">Под эти условия не подходит ни одна пара</div>' +
          '<div class="empty-state-hint">Ослабьте фильтры связности или общих соседей</div></div>';
        return;
      }

      const rows = top.map(([v, k], idx) => {
        const a = P.ids[P.ia[k]], b = P.ids[P.ja[k]];
        const same = philOf[a] === philOf[b];
        return `
          <div class="pairs-row" data-act-click="open-pair-in-comparison" data-a1="${a}" data-a2="${b}"
             data-tip="Открыть в сравнении концепций">
            <div class="pairs-rank">#${idx + 1}</div>
            <div class="pairs-names">
              <span class="pairs-name">${labOf[a]}</span>
              <span class="pairs-author">${philOf[a]}</span>
              <span class="pairs-tilde">~</span>
              <span class="pairs-name">${labOf[b]}</span>
              <span class="pairs-author">${philOf[b]}</span>
              ${same ? '<span class="pairs-same">один автор</span>' : ''}
            </div>
            <div class="pairs-value">${v.toFixed(3)}</div>
            <div class="pairs-extra">${isStructure ? P.sh[k] + ' общ.' : ''}</div>
          </div>`;
      }).join('');

      box.innerHTML = `
        <div class="pairs-count">Подошло пар: ${picked.length} из ${P.total}. Показаны первые ${top.length}.</div>
        <div class="pairs-rows">${rows}</div>
      `;
    }

function openPairInComparison(a, b) {
      setTimeout(() => emit('state-changed', false), 0);
      S._cmpA = a; S._cmpB = b;
      emit('switch-stats-view', 'comparison');
    }

function generateComparisonContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const D = similarityData();

      // П2: тот же механизм, что в панели поиска пути — поле с поиском
      // по началу слова и выпадающий список в хронологическом порядке.
      // Обычный <select> на несколько сотен строк листать неудобно.
      if (!S._cmpA) S._cmpA = D.ids[0];
      if (!S._cmpB) S._cmpB = D.ids[1];

      const captionOf = id => {
        const n = conceptById.get(id);
        return n ? `${n.label} (${n.concept})` : '';
      };
      const selectField = (slot, label) => `
        <div class="cmp-field">
          <label class="cmp-field-label">${label}</label>
          <div class="custom-select-wrapper">
            <input type="text"
                 class="custom-select-input"
                 id="${slot}SelectInput"
                 placeholder="Начните вводить название..."
                 autocomplete="off"
                 value="${captionOf(slot === 'cmpA' ? S._cmpA : S._cmpB)}"
                 data-act-focus="show-custom-select-dropdown-focus-3" data-a1="${slot}"
                 data-act-input="filter-custom-select-input-3" data-a1="${slot}">
            <span class="custom-select-arrow">▼</span>
            <div class="custom-select-dropdown" id="${slot}SelectDropdown"></div>
          </div>
        </div>`;

      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">⚖️ Сравнение концепций</h3>
          <p class="stats-content-subtitle">Схожесть по профилю метрик, структуре связей, типам связей и месту в сети</p>
        </div>

        ${generateMetricDescriptionBlock('comparison')}

        <div class="cmp-selects">
          ${selectField('cmpA', 'Первая концепция')}
          <span class="cmp-vs">против</span>
          ${selectField('cmpB', 'Вторая концепция')}
        </div>

        <div id="cmpBody"></div>
      `;
    }

function similarityVerdict(idA, idB) {
      const th = similarityThresholds();
      const meaningful = profileIsMeaningful(idA) && profileIsMeaningful(idB);
      const level = (v, t) => (v === null || !t || t.high === null) ? null
        : (v >= t.high ? 'high' : (v <= t.low ? 'low' : 'mid'));
      const st = structuralSimilarity(idA, idB);
      const prof = meaningful ? level(profileSimilarity(idA, idB), th.profile) : null;
      const types = level(typeStyleSimilarity(idA, idB), th.types);
      const netV = meaningful ? networkSimilarity(idA, idB) : null;
      const net = netV === null ? null : level(netV, th.network);
      const struct = st.shared >= SIM_SHARED_HIGH ? 'high' : (st.shared === 0 ? 'none' : 'mid');
      const roleWord = id => NETWORK_ROLE_WORDS[networkRoleOf(id)] || '—';

      const lines = [];
      lines.push(!meaningful
        ? 'Роль в системе: профиль непоказателен — у одной из концепций связей меньше медианы'
        : ({ high: 'Сходная роль в системе: профиль в верхних 10 % пар',
             low: 'Противоположные роли в системе: профиль в нижних 10 % пар',
             mid: 'Роли в системе не схожи и не противоположны' })[prof]);
      lines.push(({ high: `Общее окружение: общих соседей ${st.shared}`,
                    none: 'Общих соседей нет',
                    mid: `Окружение пересекается слабо: общих соседей ${st.shared}` })[struct]);
      lines.push(({ high: 'Сходный характер отношений: необычны в одних и тех же типах связей',
                    low: 'Противоположный характер отношений: одна насыщена теми типами связей, которых у другой меньше обычного',
                    mid: 'Характер отношений не схож и не противоположен' })[types]);
      if (!meaningful) lines.push('Место в сети: непоказательно — мало связей');
      else if (netV === null) lines.push('Место в сети: сетевые метрики не посчитаны');
      else if (net === 'high') lines.push(`Сходное место в сети: ${roleWord(idA)}`);
      else if (net === 'low') lines.push(`Противоположное место в сети: ${roleWord(idA)} и ${roleWord(idB)}`);
      else lines.push('Места в сети не схожи и не противоположны');

      const names = { profile: 'роль', struct: 'окружение', types: 'характер отношений', net: 'место в сети' };
      const high = Object.entries({ profile: prof, struct, types, net })
        .filter(([, v]) => v === 'high').map(([k]) => k);
      let headline;
      if (high.length === 4)
        headline = 'Близнецы: совпадают роль, окружение, характер отношений и место в сети.';
      else if (prof === 'high' && types === 'high' && struct === 'none')
        headline = 'Аналоги в разных областях графа: сходные роль и характер отношений без общих соседей.';
      else if (struct === 'high' && types === 'low')
        headline = 'Одно окружение, разное отношение к нему: соседи общие, а связи с ними противоположного рода.';
      else if (high.length === 1 && net === 'high')
        headline = 'Совпадает только место в сети — о родстве содержания это не говорит.';
      else if (!high.length)
        headline = 'Существенного сходства ни по одной мере не видно.';
      else
        headline = 'Частичное сходство: ' + high.map(k => names[k]).join(', ') + '.';
      return { headline, lines };
    }

function computeComparisonNetwork() {
      const tile = document.querySelector('#cmpBody .similar-map-btn');
      if (tile) tile.parentElement.innerHTML = 'Считаю… ' + liveProgressHtml(networkProgressPercent());
      ensureNetworkProfile(pct => updateLiveProgress(document.getElementById('cmpBody'), pct)).then(() => {
        if (document.getElementById('cmpBody')) renderComparison();
      });
    }

function renderComparison() {
      const box = document.getElementById('cmpBody');
      if (!box) return;
      const D = similarityData();
      const a = conceptById.get(S._cmpA), b = conceptById.get(S._cmpB);
      if (!a || !b) { box.innerHTML = ''; return; }

      const prof = profileSimilarity(S._cmpA, S._cmpB);
      const st = structuralSimilarity(S._cmpA, S._cmpB);
      const typesV = typeStyleSimilarity(S._cmpA, S._cmpB);
      const meaningful = profileIsMeaningful(S._cmpA) && profileIsMeaningful(S._cmpB);
      const netV = meaningful ? networkSimilarity(S._cmpA, S._cmpB) : null;
      const ia = D.index.get(S._cmpA), ib = D.index.get(S._cmpB);
      const verdict = similarityVerdict(S._cmpA, S._cmpB);
      // Сеть считается только по кнопке — см. similarNetworkColumnHtml.
      const signedPct = v => (v < 0 ? '−' : '') + Math.abs(Math.round(v * 100)) + ' %';
      const netTile = !meaningful ? 'н/п'
        : (netV === null
          ? '<button class="similar-map-btn" data-sweep-skip data-act-click="compute-comparison-network">Посчитать</button>'
          : signedPct(netV));

      const rows = D.names.map((n, k) => {
        const pa = D.pct[k][ia], pb = D.pct[k][ib];
        const diff = Math.abs(pa - pb);
        return `
          <div class="cmp-row ${diff <= 15 ? 'cmp-close' : (diff >= 50 ? 'cmp-far' : '')}">
            <div class="cmp-label">${SIM_METRIC_LABELS[n] || n}</div>
            <div class="cmp-bars">
              <div class="cmp-bar cmp-bar-a" style="width:${pa}%"></div>
              <div class="cmp-bar cmp-bar-b" style="width:${pb}%"></div>
            </div>
            <div class="cmp-nums">${pa} / ${pb}</div>
          </div>`;
      }).join('');

      box.innerHTML = `
        <div class="cmp-summary">
          <div class="cmp-score">
            <div class="cmp-score-value">${meaningful ? signedPct(prof) : 'н/п'}</div>
            <div class="cmp-score-label">схожесть профиля</div>
          </div>
          <div class="cmp-score">
            <div class="cmp-score-value">${Math.round(st.jaccard * 100)} %</div>
            <div class="cmp-score-label">схожесть структуры<br><span>общих соседей: ${st.shared}</span></div>
          </div>
          <div class="cmp-score">
            <div class="cmp-score-value">${signedPct(typesV)}</div>
            <div class="cmp-score-label">сходство по типам связей</div>
          </div>
          <div class="cmp-score">
            <div class="cmp-score-value">${netTile}</div>
            <div class="cmp-score-label">сходство места в сети</div>
          </div>
        </div>

        <div class="cmp-verdict"><b>${verdict.headline}</b>
          <ul class="cmp-verdict-lines">${verdict.lines.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>

        <div class="cmp-legend">
          <span><i class="cmp-swatch cmp-bar-a"></i>${a.label} (${a.concept})</span>
          <span><i class="cmp-swatch cmp-bar-b"></i>${b.label} (${b.concept})</span>
          <span class="cmp-legend-hint">столбики — процентиль концепции по метрике среди всех ${S._concepts.length}</span>
        </div>

        <div class="cmp-rows">${rows}</div>
      `;
    }

export { computeComparisonNetwork, generateClosestPairsContent, generateComparisonContent, generatePhilosopherComparisonContent, generatePhilosopherPairsContent, openPairInComparison, openPhilosopherPair, renderClosestPairs, renderComparison, renderPhilosopherComparison, renderPhilosopherPairs, similarityVerdict };
