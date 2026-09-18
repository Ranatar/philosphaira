// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { MET, S } from '../core/ns.js';
import { betweennessCache, calculateBetweennessAsync, closenessCache, eigenvectorCache, medianNodeDegree, nodeDegreeOf, pageRankCache } from './network.js';
import { invalidatePhilosopherSimilarityCache } from './similarity-philosophers.js';

function profileIsMeaningful(conceptId) {
      return nodeDegreeOf(conceptId) >= medianNodeDegree();
    }

let _simCache = null;

function similarityData() {
      if (_simCache) return _simCache;

      const fns = {
        problemGenerationIndex: MET.problemGenerationIndex, criticalPowerIndex: MET.criticalPowerIndex, revolutionaryIndex: MET.revolutionaryIndex, paradigmShiftIndex: MET.paradigmShiftIndex,
        influenceIndex: MET.influenceIndex, foundationalIndex: MET.foundationalIndex, syntheticIndex: MET.syntheticIndex, dialogicalIndex: MET.dialogicalIndex,
        internalCoherenceIndex: MET.internalCoherenceIndex, transformationIndex: MET.transformationIndex, conceptualFertilityIndex: MET.conceptualFertilityIndex,
        conceptualComplexityIndex: MET.conceptualComplexityIndex, conceptualContinuityIndex: MET.conceptualContinuityIndex, instrumentalIndex: MET.instrumentalIndex,
        abstractionIndex: MET.abstractionIndex, deductiveIndex: MET.deductiveIndex, generativeIndex: MET.generativeIndex
      };
      const names = Object.keys(fns);
      const ids = S._concepts.map(c => c.id);

      const raw = names.map(n => ids.map(id => {
        try { const v = fns[n](id).total; return Number.isFinite(v) ? v : 0; }
        catch (e) { return 0; }
      }));

      // 1. z-нормировка по каждой метрике
      const z = raw.map(a => {
        const m = a.reduce((s, v) => s + v, 0) / a.length;
        const sd = Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / a.length) || 1;
        return a.map(v => (v - m) / sd);
      });

      // 2. центрирование профиля каждого концепта: сравниваем форму, а не величину
      const V = ids.map((_, i) => {
        const v = z.map(a => a[i]);
        const m = v.reduce((s, x) => s + x, 0) / v.length;
        return v.map(x => x - m);
      });
      const norms = V.map(v => Math.sqrt(v.reduce((s, x) => s + x * x, 0)));
      const nonZero = ids.map((_, i) => raw.filter(a => a[i] !== 0).length);

      // перцентиль сырого значения — для читаемых столбиков в сравнении
      const pct = raw.map(a => {
        const sorted = [...a].sort((x, y) => x - y);
        return a.map(v => {
          let lo = 0, hi = sorted.length;
          while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < v) lo = mid + 1; else hi = mid; }
          return Math.round(lo / (sorted.length - 1) * 100);
        });
      });

      _simCache = { names, ids, index: new Map(ids.map((id, i) => [id, i])),
              raw, z, V, norms, nonZero, pct };
      return _simCache;
    }

function invalidateSimilarityCache() {
      invalidatePhilosopherSimilarityCache();
      _simCache = null;
      _typeStyleCache = null;
      _netSimCache = null;
      _simThresholdCache = null;
      _pairCache = null;
      _pairCalculating = false;
    }

let _pairCache = null;

let _pairCalculating = false;

function allConceptPairs() {
      // Сетевая мера зависит от переключателей: сменились метрики — устарела
      // только её колонка, остальные три меры остаются годными.
      if (_pairCache && _pairCache.netData && _pairCache.netData !== networkSimilarityData()) {
        _pairCache.netData = null;
      }
      return _pairCache;
    }

const PAIRS_CHUNK_ROWS = 15;

async function allConceptPairsAsync(progressCallback) {
      if (allConceptPairs()) return _pairCache;
      if (_pairCalculating) return null;
      _pairCalculating = true;

      try {
        // Фаза 1: подготовка метрик. Дорога сама по себе — 17 метрик
        // на все концепты, среди них дедуктивная с обходом графа.
        if (progressCallback) progressCallback(2);
        await new Promise(r => setTimeout(r, 0));
        const D = similarityData();
        const N = neighborSets();
        const T = typeStyleData();
        // Сеть НЕ ЖДЁМ: её метрики тяжелы и считаются только по явной просьбе
        // (вид «по месту в сети»). Готовы — колонка заполнится сразу, нет —
        // её досчитает fillPairsNetwork, когда вид выберут.
        const W = networkSimilarityData();
        if (progressCallback) progressCallback(15);
        await new Promise(r => setTimeout(r, 0));

        // Фаза 2: перебор пар
        const ids = D.ids, n = ids.length;
        const total = n * (n - 1) / 2;

        const ia = new Uint16Array(total), ja = new Uint16Array(total);
        const pv = new Float32Array(total), jv = new Float32Array(total);
        const tv = new Float32Array(total), nv = new Float32Array(total);
        const sh = new Uint16Array(total);
        const deg = ids.map(id => (N.get(id) || new Set()).size);

        let k = 0;
        for (let i = 0; i < n; i++) {
          const a = N.get(ids[i]), Vi = D.V[i], ni = D.norms[i];
          for (let j = i + 1; j < n; j++) {
            let s = 0; const Vj = D.V[j];
            for (let m = 0; m < Vi.length; m++) s += Vi[m] * Vj[m];
            pv[k] = (ni && D.norms[j]) ? s / (ni * D.norms[j]) : 0;
            tv[k] = normedDot(T.V[i], T.norms[i], T.V[j], T.norms[j]);
            nv[k] = W ? normedDot(W.V[i], W.norms[i], W.V[j], W.norms[j]) : 0;

            const b = N.get(ids[j]);
            let inter = 0;
            for (const x of a) if (b.has(x)) inter++;
            const un = a.size + b.size - inter;
            jv[k] = un ? inter / un : 0;
            sh[k] = inter;

            ia[k] = i; ja[k] = j; k++;
          }

          if ((i + 1) % PAIRS_CHUNK_ROWS === 0) {
            if (progressCallback) progressCallback(15 + 85 * (i + 1) / n);
            await new Promise(r => setTimeout(r, 0));
          }
        }

        _pairCache = { ids, ia, ja, pv, jv, tv, nv, sh, deg, total, netData: W };
        if (progressCallback) progressCallback(100);
        return _pairCache;
      } finally {
        _pairCalculating = false;
      }
    }

function fillPairsNetwork(P) {
      const W = networkSimilarityData();
      if (!W) return false;
      if (P.netData === W) return true;
      for (let k = 0; k < P.total; k++) {
        const i = P.ia[k], j = P.ja[k];
        P.nv[k] = normedDot(W.V[i], W.norms[i], W.V[j], W.norms[j]);
      }
      P.netData = W;
      return true;
    }

function profileSimilarity(idA, idB) {
      const D = similarityData();
      const i = D.index.get(idA), j = D.index.get(idB);
      if (i === undefined || j === undefined) return 0;
      if (!D.norms[i] || !D.norms[j]) return 0;
      let s = 0;
      for (let k = 0; k < D.V[i].length; k++) s += D.V[i][k] * D.V[j][k];
      return s / (D.norms[i] * D.norms[j]);
    }

let _neighborCache = null;

function neighborSets() {
      if (_neighborCache) return _neighborCache;
      const m = new Map(S._concepts.map(c => [c.id, new Set()]));
      for (const r of S._relations) {
        if (m.has(r.source) && m.has(r.target)) {
          m.get(r.source).add(r.target);
          m.get(r.target).add(r.source);
        }
      }
      _neighborCache = m;
      return m;
    }

function typeProfileOf(conceptId) {
      const links = (S._incomingLinks.get(conceptId) || [])
        .concat(S._outgoingLinks.get(conceptId) || []);
      const v = {};
      for (const r of links) v[r.type] = (v[r.type] || 0) + (r.weight || 1);
      return v;
    }

function structuralSimilarity(idA, idB) {
      const N = neighborSets();
      const a = N.get(idA), b = N.get(idB);
      if (!a || !b) return { jaccard: 0, shared: 0 };

      let inter = 0;
      for (const x of a) if (b.has(x)) inter++;
      const union = a.size + b.size - inter;
      const jaccard = union ? inter / union : 0;
      // Косинус по долям типов прежде возвращался отсюда же (typeCosine).
      // С 2026-09-17 это отдельная мера — typeStyleSimilarity, ниже.
      return { jaccard, shared: inter };
    }

function zColumns(M) {
      if (!M.length) return [];
      const k = M[0].length;
      const Z = M.map(r => r.slice());
      for (let c = 0; c < k; c++) {
        let m = 0;
        for (const r of M) m += r[c];
        m /= M.length;
        let q = 0;
        for (const r of M) q += (r[c] - m) * (r[c] - m);
        const sd = Math.sqrt(q / M.length) || 1;
        for (let i = 0; i < M.length; i++) Z[i][c] = (M[i][c] - m) / sd;
      }
      return Z;
    }

function centerRows(M) {
      return M.map(r => {
        const m = r.reduce((x, y) => x + y, 0) / (r.length || 1);
        return r.map(x => x - m);
      });
    }

function vectorNorm(v) {
      let q = 0;
      for (const x of v) q += x * x;
      return Math.sqrt(q);
    }

function normedDot(a, na, b, nb) {
      if (!na || !nb) return 0;
      let d = 0;
      for (let i = 0; i < a.length; i++) d += a[i] * b[i];
      return d / (na * nb);
    }

let _typeStyleCache = null;

function typeStyleData() {
      if (_typeStyleCache) return _typeStyleCache;
      const ids = S._concepts.map(c => c.id);
      const types = [...new Set(S._relations.map(r => r.type))];
      const share = ids.map(id => {
        const p = typeProfileOf(id);
        const v = types.map(t => p[t] || 0);
        const total = v.reduce((x, y) => x + y, 0) || 1;
        return v.map(x => x / total);
      });
      const V = centerRows(zColumns(share));
      _typeStyleCache = { ids, types, V, norms: V.map(vectorNorm),
                          index: new Map(ids.map((id, i) => [id, i])) };
      return _typeStyleCache;
    }

function typeStyleSimilarity(idA, idB) {
      const T = typeStyleData();
      const i = T.index.get(idA), j = T.index.get(idB);
      if (i === undefined || j === undefined) return 0;
      return normedDot(T.V[i], T.norms[i], T.V[j], T.norms[j]);
    }

const NETWORK_SIM_NAMES = ['degree', 'pagerank', 'betweenness', 'closeness',
                               'eigenvector', 'clustering', 'cohesion', 'richClub'];

const NETWORK_ROLE_OF = {
      degree: 'core', pagerank: 'core', eigenvector: 'core', richClub: 'core',
      betweenness: 'bridge', closeness: 'bridge',
      clustering: 'nest', cohesion: 'nest'
    };

const NETWORK_ROLE_WORDS = {
      core: 'узел ядра', bridge: 'мост', nest: 'член плотного гнезда', periphery: 'периферия'
    };

let _netSimCache = null;

let _netSimPending = null;

function metricValueMap(res) {
      const m = new Map();
      const list = Array.isArray(res) ? res : (res && typeof res === 'object' ? Object.values(res) : []);
      for (const r of list) {
        const id = r && r.node ? r.node.id : (r && r.id);
        if (id !== undefined) m.set(id, Number.isFinite(r.value) ? r.value : 0);
      }
      return m;
    }

function networkSimilarityData() {
      const pending = [pageRankCache, betweennessCache, closenessCache, eigenvectorCache];
      if (pending.some(x => !x)) return null;
      const refs = pending.concat([MET.calculateWeightedClustering(), MET.calculateLocalCohesion(),
                                   MET.calculateRichClubCoefficient()]);
      if (_netSimCache && _netSimCache.refs.every((r, i) => r === refs[i])) return _netSimCache;
      const ids = S._concepts.map(c => c.id);
      const maps = refs.map(metricValueMap);
      const raw = ids.map(id => [nodeDegreeOf(id)].concat(maps.map(m => m.get(id) || 0)));
      const Z = zColumns(raw);
      const V = centerRows(Z);
      _netSimCache = { refs, ids, names: NETWORK_SIM_NAMES, Z, V, norms: V.map(vectorNorm),
                       index: new Map(ids.map((id, i) => [id, i])) };
      return _netSimCache;
    }

function networkSimilarity(idA, idB) {
      const W = networkSimilarityData();
      if (!W) return null;
      const i = W.index.get(idA), j = W.index.get(idB);
      if (i === undefined || j === undefined) return 0;
      return normedDot(W.V[i], W.norms[i], W.V[j], W.norms[j]);
    }

function networkRoleOf(id) {
      const W = networkSimilarityData();
      if (!W) return null;
      const i = W.index.get(id);
      if (i === undefined) return null;
      const z = W.Z[i];
      if (z.reduce((x, y) => x + y, 0) / z.length < -0.5) return 'periphery';
      let best = 0;
      for (let k = 1; k < W.V[i].length; k++) if (W.V[i][k] > W.V[i][best]) best = k;
      return NETWORK_ROLE_OF[W.names[best]];
    }

const NETWORK_PROGRESS_WEIGHTS = { betweenness: 0.51, closeness: 0.46, eigenvector: 0.02, pagerank: 0.01 };

let _netProgress = { betweenness: 0, closeness: 0, eigenvector: 0, pagerank: 0 };

const _netProgressListeners = new Set();

function networkProgressPercent() {
      if (networkSimilarityData()) return 100;
      const ready = { betweenness: betweennessCache, closeness: closenessCache,
                      eigenvector: eigenvectorCache, pagerank: pageRankCache };
      let p = 0;
      for (const k of Object.keys(NETWORK_PROGRESS_WEIGHTS)) {
        p += NETWORK_PROGRESS_WEIGHTS[k] * (ready[k] ? 1 : Math.min(1, _netProgress[k] || 0));
      }
      return Math.min(99, Math.floor(p * 100));
    }

function ensureNetworkProfile(onProgress) {
      if (networkSimilarityData()) {
        if (onProgress) onProgress(100);
        return Promise.resolve(true);
      }
      if (onProgress) _netProgressListeners.add(onProgress);
      if (_netSimPending) return _netSimPending;
      const track = key => (current, total) => { _netProgress[key] = total ? current / total : 0; };
      const kick = () => {
        if (!pageRankCache) MET.calculatePageRank(20, 0.85, track('pagerank'));
        if (!betweennessCache) calculateBetweennessAsync(track('betweenness'));
        if (!closenessCache) MET.calculateClosenessCentrality(track('closeness'));
        if (!eigenvectorCache) MET.calculateEigenvectorCentrality(100, track('eigenvector'));
      };
      const tell = () => {
        const pct = networkProgressPercent();
        for (const f of _netProgressListeners) { try { f(pct); } catch (e) { /* ждущий исчез */ } }
      };
      _netProgress = { betweenness: 0, closeness: 0, eigenvector: 0, pagerank: 0 };
      _netSimPending = (async () => {
        try {
          const started = Date.now();
          let lastKick = 0;
          while (!networkSimilarityData()) {
            if (Date.now() - lastKick > 1000) { kick(); lastKick = Date.now(); }
            if (Date.now() - started > 120000) return false;
            tell();
            await new Promise(r => setTimeout(r, 200));
          }
          return true;
        } finally {
          tell();
          _netProgressListeners.clear();
          _netSimPending = null;
        }
      })();
      return _netSimPending;
    }

const SIGNED_SIMILARITY = new Set(['profile', 'types', 'network']);

function similarityNeedsDegree(kind) {
      return kind === 'profile' || kind === 'network';
    }

function similarityOf(kind, idA, idB) {
      if (kind === 'profile') return profileSimilarity(idA, idB);
      if (kind === 'structure') return structuralSimilarity(idA, idB).jaccard;
      if (kind === 'types') return typeStyleSimilarity(idA, idB);
      if (kind === 'network') return networkSimilarity(idA, idB) || 0;
      return 0;
    }

const SIM_VERDICT_HIGH_Q = 0.9;

const SIM_VERDICT_LOW_Q = 0.1;

const SIM_SHARED_HIGH = 3;

let _simThresholdCache = null;

function similarityThresholds() {
      const W = networkSimilarityData();
      if (_simThresholdCache && _simThresholdCache.net === W) return _simThresholdCache;
      const D = similarityData(), T = typeStyleData();
      const keep = [];
      D.ids.forEach((id, i) => { if (profileIsMeaningful(id)) keep.push(i); });
      const cols = { profile: [], types: [], network: [] };
      for (let a = 0; a < keep.length; a++) {
        const i = keep[a];
        for (let b = a + 1; b < keep.length; b++) {
          const j = keep[b];
          cols.profile.push(normedDot(D.V[i], D.norms[i], D.V[j], D.norms[j]));
          cols.types.push(normedDot(T.V[i], T.norms[i], T.V[j], T.norms[j]));
          if (W) cols.network.push(normedDot(W.V[i], W.norms[i], W.V[j], W.norms[j]));
        }
      }
      const quantile = (arr, p) => {
        if (!arr.length) return null;
        const sorted = Float64Array.from(arr).sort();
        return sorted[Math.floor(p * (sorted.length - 1))];
      };
      const out = { net: W, pairs: cols.profile.length };
      for (const k of Object.keys(cols)) {
        out[k] = { high: quantile(cols[k], SIM_VERDICT_HIGH_Q), low: quantile(cols[k], SIM_VERDICT_LOW_Q) };
      }
      _simThresholdCache = out;
      return out;
    }

function nearestConcepts(conceptId, kind, k) {
      const D = similarityData();
      const src = D.index.get(conceptId);
      if (src === undefined) return [];

      // C5: у малосвязной концепции почти все метрики нулевые, а ноль
      // после z-нормировки даёт одну и ту же константу −mean/sd. Профили
      // таких концепций сходятся к общей точке, и косинус между ними
      // стремится к единице. Замерено: Спирмен(степень, верхнее сходство)
      // = −0.48, у 47 концепций из 453 верх ≥ 95 %, все степени 1–2.
      // Профильная колонка строится только для связных концепций —
      // и для источника, и для кандидатов.
      if (similarityNeedsDegree(kind) && !profileIsMeaningful(conceptId)) return [];
      // Сеть может быть ещё не посчитана: null — «подождите», а не «пусто».
      if (kind === 'network' && !networkSimilarityData()) return null;

      const out = [];
      for (let i = 0; i < D.ids.length; i++) {
        if (i === src) continue;
        const id = D.ids[i];
        if (similarityNeedsDegree(kind) && !profileIsMeaningful(id)) continue;
        const value = similarityOf(kind, conceptId, id);
        if (value <= 0) continue;
        out.push({ id, value });
      }
      out.sort((a, b) => b.value - a.value);

      // C5: контраст — насколько сосед выделяется среди прочих ИМЕННО
      // для этой концепции. Косинус сам по себе несравним между
      // концепциями разной связности, контраст — сравним (Спирмен со
      // степенью −0.12 против −0.48). Это монотонное преобразование при
      // фиксированной концепции, поэтому порядок соседей не меняется.
      if (out.length > 2) {
        const vals = out.map(x => x.value);
        const m = vals.reduce((s, v) => s + v, 0) / vals.length;
        const sd = Math.sqrt(vals.reduce((s, v) => s + (v - m) * (v - m), 0) / vals.length) || 1;
        out.forEach(x => { x.contrast = (x.value - m) / sd; });
      } else {
        out.forEach(x => { x.contrast = null; });
      }

      const res = out.slice(0, k || 5);
      // C5: точные ничьи (9 случаев по графу) помечаются как неразличимые
      for (let i = 1; i < res.length; i++) {
        if (Math.abs(res[i].value - res[i - 1].value) < 5e-4) {
          res[i].tied = true;
          res[i - 1].tied = true;
        }
      }
      return res;
    }

export { NETWORK_ROLE_WORDS, SIGNED_SIMILARITY, SIM_SHARED_HIGH, _pairCalculating, _simCache, allConceptPairs, allConceptPairsAsync, ensureNetworkProfile, fillPairsNetwork, invalidateSimilarityCache, nearestConcepts, networkProgressPercent, networkRoleOf, networkSimilarity, networkSimilarityData, profileIsMeaningful, profileSimilarity, similarityData, similarityNeedsDegree, similarityThresholds, structuralSimilarity, typeStyleSimilarity };
