// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { emit } from '../core/events.js';
import { conceptById } from '../core/graph-index.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { initializePhilosophyMetrics } from '../metrics/link-indexes.js';
import { _simCache, profileIsMeaningful, profileSimilarity, structuralSimilarity } from '../metrics/similarity-concepts.js';
import { requestDraw } from './loop.js';

const SIMILARITY_KEEP_QUANTILE = 0.85;

const SIMILARITY_ARCS = 6;

function similarityColor(t) {
      const x = Math.max(-1, Math.min(1, t));
      // Полюса: синий #3b6fd4, красный #d63b3b, середина белая.
      const from = x < 0 ? [59, 111, 212] : [255, 255, 255];
      const to   = x < 0 ? [255, 255, 255] : [214, 59, 59];
      const p = x < 0 ? 1 + x : x;
      const mix = i => Math.round(from[i] + (to[i] - from[i]) * p);
      return `rgb(${mix(0)},${mix(1)},${mix(2)})`;
    }

function showSimilarityOverlay(sourceId, kind) {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      // Первый вызов строит все 17 метрик на весь корпус. Это заметно
      // быстрее полной матрицы пар, но не мгновенно, поэтому предупреждаем.
      if (!_simCache && typeof showTemporaryMessage === 'function') {
        showTemporaryMessage('Считаю метрики для карты сходства…', 1500);
      }
      if (kind === 'profile' && !profileIsMeaningful(sourceId)) {
        // ОТКАЗ ГРОМКИЙ, А НЕ МОЛЧАЛИВЫЙ. Первая редакция этой правки просто
        // возвращала пустоту — кнопка нажималась и не делала ничего, и
        // отличить это от поломки было нельзя. У концепции со степенью ниже
        // медианной профиль вырожден по существу, и честный ответ —
        // сказать об этом, а не показать карту, которой нельзя верить.
        if (typeof showTemporaryMessage === 'function') {
          showTemporaryMessage(
            'У этой концепции слишком мало связей: профиль метрик почти сплошь нулевой, '
            + 'и сходство по нему неотличимо от сходства с любой такой же. '
            + 'Попробуйте вид «по структуре» — он вырожденности не подвержен.', 4000);
        }
        return;
      }
      const values = new Map();
      // М1. ОТСЕВ ВЫРОЖДЕННЫХ ПРОФИЛЕЙ — тот же, что в списке окна.
      // Прежде карта звала profileSimilarity напрямую, и на один вопрос в
      // одном файле было два ответа, причём худший показывался на графе:
      // Спирмен(степень, верхнее сходство) −0.466 против −0.178 в окне —
      // ровно то значение, которое комментарий C5 называет состоянием ДО
      // исправления. У малосвязной концепции нули во всех метриках сразу,
      // после z-нормировки её профиль сходится к общей точке, и косинус к
      // любой такой же стремится к единице.
      // Отсев только для профиля: жаккар вырожденности не подвержен.
      // С2. НИЧЬИ РЕШАЮТСЯ ОБЩИМИ СОСЕДЯМИ, А НЕ ПОРЯДКОМ ПЕРЕБОРА.
      // У жаккара значения ложатся на редкую сетку дробей: у 370 концепций
      // из 453 внутри шестёрки есть повторы, у 181 шестое место — ничья,
      // обрезанная порядком обхода. У пары с четырьмя общими соседями из
      // восьми и пары с одним из двух жаккар одинаков, а свидетельство
      // разное. Величина shared уже возвращалась из structuralSimilarity и
      // нигде не использовалась.
      const sharedOf = new Map();
      for (const n of DATA.nodes) {
        if (n.id === sourceId) continue;
        // Отсев вырожденных нужен только профилю: жаккар и косинус по типам
        // строятся не на z-нормированных метриках и к нулям нечувствительны.
        if (kind === 'profile' && !profileIsMeaningful(n.id)) continue;
        let v;
        if (kind === 'structure') {
          const st = structuralSimilarity(sourceId, n.id);
          v = st.jaccard;
          sharedOf.set(n.id, st.shared);
        } else if (kind === 'types') {
          // С3. ТРЕТИЙ ВИД: доли типов связей, косинус. Величина уже
          // считалась в structuralSimilarity и уже показывалась в окне
          // сравнения концепций — на карте её просто не было.
          // Перевес над нулевой моделью 3,4× (141 пара «дуга + связь» из
          // 1893) против 2,1× у профиля; зависимость от степени наименьшая
          // из трёх: −0,258 против −0,364 у жаккара и −0,474 у профиля.
          // Отчёт называет это «вдвое больше попаданий, чем у профиля» —
          // на деле 141 против 88, то есть в 1,6 раза; вывод тот же.
          v = structuralSimilarity(sourceId, n.id).typeCosine;
        } else {
          v = profileSimilarity(sourceId, n.id);
        }
        values.set(n.id, v);
      }
      const nearest = [...values.entries()]
        .filter(([, v]) => v > 0)
        .sort((a, b) => (b[1] - a[1])
          || ((sharedOf.get(b[0]) || 0) - (sharedOf.get(a[0]) || 0)))
        .slice(0, SIMILARITY_ARCS)
        .map(([id]) => id);

      // Н1: нормировка по строке. Меры живут на несопоставимых шкалах —
      // медианный максимум строки 0.858 у профиля и 0.25 у жаккара, —
      // поэтому цвет и ширина считаются от максимума этой конкретной строки.
      const mags = [...values.values()].map(Math.abs);
      const rowMax = mags.length ? Math.max(...mags) : 1;

      // Порог приглушения тоже относительный. Для структуры отсекаются
      // только настоящие нули: ненулевых соседей у медианного узла 43,
      // и все они содержательны.
      let dimBelow;
      if (kind === 'structure' || kind === 'types') {
        dimBelow = 0;
      } else {
        const sorted = [...mags].sort((a, b) => a - b);
        dimBelow = sorted[Math.floor(SIMILARITY_KEEP_QUANTILE * (sorted.length - 1))] || 0;
      }

      const keepLinks = S.similarityOverlay ? (S.similarityOverlay.linkMode || 'none') : 'none';
      S.similarityOverlay = { sourceId, kind, values, nearest,
                  rowMax: rowMax || 1, dimBelow, linkMode: keepLinks };
      emit('close-modals');
      requestDraw();
      updateSimilarityLegend();
    }

function setSimilarityLinks(mode) {
      if (!S.similarityOverlay) return;
      S.similarityOverlay.linkMode = mode;
      requestDraw();
      updateSimilarityLegend();
    }

function nodeLitBySimilarity(id) {
      if (!S.similarityOverlay) return false;
      if (id === S.similarityOverlay.sourceId) return true;
      const v = S.similarityOverlay.values.get(id);
      if (v === undefined) return false;
      return S.similarityOverlay.kind === 'profile'
        ? Math.abs(v) >= S.similarityOverlay.dimBelow
        : v > 0;
    }

function similarityLinkCount(mode) {
      if (!S.similarityOverlay || mode === 'none') return 0;
      let n = 0;
      for (const l of DATA.links) {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        if (s === t) continue;
        if (mode === 'source') {
          if ((s === S.similarityOverlay.sourceId && nodeLitBySimilarity(t))
           || (t === S.similarityOverlay.sourceId && nodeLitBySimilarity(s))) n++;
        } else if (nodeLitBySimilarity(s) && nodeLitBySimilarity(t)) n++;
      }
      return n;
    }

function linkAmongHighlighted(l) {
      if (!S.similarityOverlay) return false;
      const mode = S.similarityOverlay.linkMode || 'none';
      if (mode === 'none') return false;
      const s = l.source.id || l.source, t = l.target.id || l.target;
      if (s === t) return false;
      if (mode === 'source') {
        return (s === S.similarityOverlay.sourceId && nodeLitBySimilarity(t))
            || (t === S.similarityOverlay.sourceId && nodeLitBySimilarity(s));
      }
      return nodeLitBySimilarity(s) && nodeLitBySimilarity(t);
    }

function clearSimilarityOverlay() {
      S.similarityOverlay = null;
      requestDraw();
      updateSimilarityLegend();
    }

function updateSimilarityLegend() {
      let box = document.getElementById('similarityLegend');
      if (!S.similarityOverlay) { if (box) box.remove(); return; }
      if (!box) {
        box = document.createElement('div');
        box.id = 'similarityLegend';
        document.body.appendChild(box);
      }
      const src = conceptById.get(S.similarityOverlay.sourceId);
      const mode = S.similarityOverlay.kind;
      const isProfile = mode === 'profile';
      const btn = (k, caption) =>
        `<button class="simleg-btn ${mode === k ? 'active' : ''}"
             data-act-click="show-similarity-overlay-2" data-a1="${S.similarityOverlay.sourceId}" data-a2="${k}">${caption}</button>`;
      box.innerHTML = `
        <div class="simleg-title">Сходство с «${src ? src.label : '—'}»</div>
        <div class="simleg-mode">
          ${btn('profile', 'По профилю')}
          ${btn('structure', 'По структуре')}
          ${btn('types', 'По типам')}
        </div>
        <div class="simleg-links-title">Связи из базы</div>
        <div class="simleg-links" data-tip="Карта гасит все связи разом, чтобы рёбра не перетягивали внимание. «С источником» показывает, совпало ли сходство с прямым отношением; «между похожими» — сложилась ли подсвеченная часть в связную область">
          ${[['none', 'нет', 0],
             ['source', 'с источником', similarityLinkCount('source')],
             ['all', 'между похожими', similarityLinkCount('all')]].map(([m, подпись, n]) =>
            `<button class="simleg-lbtn ${(S.similarityOverlay.linkMode || 'none') === m ? 'active' : ''}"
                 data-act-click="set-similarity-links" data-a1="${m}">${подпись}${m === 'none' ? '' : ` <b>${n}</b>`}</button>`).join('')}
        </div>
        <div class="simleg-scale ${isProfile ? '' : 'one-sided'}"></div>
        <div class="simleg-ticks">
          <span>${isProfile ? '−' + S.similarityOverlay.rowMax.toFixed(2) : '0'}</span>
          <span>${isProfile ? '0' : ''}</span>
          <span>${S.similarityOverlay.rowMax.toFixed(2)}</span>
        </div>
        <div class="simleg-hint">
          Шкала нормирована по этой концепции: край соответствует её
          максимальному сходству ${S.similarityOverlay.rowMax.toFixed(2)}.
          Показано ${[...S.similarityOverlay.values.values()].filter(v =>
            isProfile ? Math.abs(v) >= S.similarityOverlay.dimBelow : v > 0).length}
          концепций из ${S.similarityOverlay.values.size}.
          Пунктиром — ${SIMILARITY_ARCS} ближайших. Заливка узла — цвет философа.
        </div>
        <button class="simleg-close" data-act-click="clear-similarity-overlay">Скрыть карту сходства</button>
      `;
    }

export { clearSimilarityOverlay, linkAmongHighlighted, setSimilarityLinks, showSimilarityOverlay, similarityColor };
