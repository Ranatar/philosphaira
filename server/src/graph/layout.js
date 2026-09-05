// РАСКЛАДКА ГРАФА НА СЕРВЕРЕ.
//
// ГЛАВНОЕ РЕШЕНИЕ ЭТОГО СЛОЯ — НЕ СЧИТАТЬ ЗАНОВО. Замерено на улёгшейся
// раскладке: одна добавленная связь при полном пересчёте сдвигает узлы на
// 130 px по медиане (90-й процентиль 283, максимум 502), а новая концепция с
// тремя связями — на 173 px. Контроль без правки даёт ноль, то есть это
// чувствительность к правке, а не шум: сила это свойство хаотической системы.
//
// Для одного человека такое перетасовывание неприятно, для совместной работы
// недопустимо: после чужого утверждённого коммита все теряют ориентировку
// разом. Поэтому при коммите раскладка ДОРАЩИВАЕТСЯ из прежних координат:
// alpha 0.3, быстрый распад, до потолка тиков. Замер того же коммита:
// медиана 9 px, 90-й процентиль 24, максимум 109 — расходится только
// окрестность правки. Качество не страдает: новая концепция встала от своих
// трёх соседей на 321/245/194 px против 275/197/284 при полном пересчёте.
//
// ПОЛНЫЙ ОТЖИГ ОСТАЁТСЯ, но как решение человека, а не как ежедневная
// починка: дорасклад накапливает след, и однажды раскладка будет нести
// историю порядка правок. Это не порок — стабильность важнее «правильности», —
// но знать об этом надо, и потому перекладка предъявляет меру расхождения
// ДО применения.
import * as d3 from 'd3-force';

// Потолок тиков — следствие темпа остывания, ровно как на странице: столько
// тиков, сколько нужно альфе дойти от начальной до alphaMin. Переписать его
// числом значило бы завести второй ответ на тот же вопрос.
const ALPHA_MIN = 0.001;
const ceiling = (alpha0, decay) => Math.ceil(Math.log(ALPHA_MIN / alpha0) / Math.log(1 - decay));

// Силы — те же, что в приложении (state/render.js). Здесь они переписаны, и
// это единственное место, где правило записано дважды; стережёт согласие
// проба layout_probe, сверяющая МЕРЫ обеих сторон. Побайтово сличать нельзя:
// замерено, что один и тот же d3 в Chrome и в node даёт разные координаты.
export const FORCES = Object.freeze({
  distance: 160,
  charge: -350,
  collide: 45,
  pull: 0.1,          // тяга к середине, делится на степень узла
  width: 1440,
  height: 900,
});

/**
 * Задевает ли правка раскладку.
 *
 * Раскладка зависит ТОЛЬКО от множества узлов и множества пар
 * «источник — цель». Проверено по исходнику: расстояние связи и радиус
 * столкновения — постоянные, сила пружины считается d3 из степеней концов,
 * тяга — из степени. Значит описания, типы, веса, рубрики, философы,
 * происхождение и всё прочее раскладку НЕ задевают, и пересчитывать при них
 * нечего: судя по составу коммитов, это большинство правок.
 */
export function touchesLayout(changes) {
  for (const c of changes ?? []) {
    const isConceptChange = c.kind === 'concept';
    const isRelationChange = c.kind === 'relation';
    if (!isConceptChange && !isRelationChange) continue;
    if (c.action === 'add' || c.action === 'delete') return true;
    if (isRelationChange) {
      const changedFields = Object.keys(c.fields ?? {});
      if (changedFields.includes('source') || changedFields.includes('target')) return true;
    }
  }
  return false;
}

/** Собрать узлы и связи в том виде, в каком их укладывает d3. */
function graphBody({ concepts, relations }) {
  const nodes = concepts.map(c => ({ id: c.id }));
  const links = relations.map(r => ({ source: r.source, target: r.target }));
  const degree = Object.create(null);
  for (const n of nodes) degree[n.id] = 0;
  for (const l of links) {
    if (l.source === l.target) continue;
    if (degree[l.source] !== undefined) degree[l.source]++;
    if (degree[l.target] !== undefined) degree[l.target]++;
  }
  return { nodes, links, степень: degree };
}

function runForces({ nodes, links, степень: degree }, { decay, alpha }) {
  const pullOf = n => FORCES.pull / Math.max(1, degree[n.id] ?? 0);
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(FORCES.distance))
    .force('charge', d3.forceManyBody().strength(FORCES.charge))
    .force('center', d3.forceCenter(FORCES.width / 2, FORCES.height / 2))
    .force('collision', d3.forceCollide().radius(FORCES.collide))
    .alphaDecay(decay)
    .stop();
  // Тяга ставится ОТДЕЛЬНЫМ шагом, после того как степени посчитаны: d3
  // запоминает силу при initialize, обходя узлы один раз. На странице эта
  // же мина стоила расхождения сторон на 291 px по медиане.
  sim.force('pullX', d3.forceX(FORCES.width / 2).strength(pullOf));
  sim.force('pullY', d3.forceY(FORCES.height / 2).strength(pullOf));
  sim.alpha(alpha);
  sim.tick(ceiling(alpha, decay));
  const positions = Object.create(null);
  for (const n of nodes) positions[n.id] = [+n.x.toFixed(1), +n.y.toFixed(1)];
  return positions;
}

/** Полный отжиг с нуля: медленное остывание, начальные положения от d3. */
export function fullLayout(граф) {
  return runForces(graphBody(граф), { decay: 0.005, alpha: 1 });
}

/**
 * Дорасклад из прежних координат. Узел, которого в прежней раскладке не было
 * (только что добавлен), ставится в середину с малым разбросом — как это
 * делает и приложение, — и дальше его растаскивают силы.
 */
export function growLayout(граф, прежние) {
  const graphData = graphBody(граф);
  let withoutPrev = 0;
  for (const n of graphData.nodes) {
    const p = прежние?.[n.id];
    if (p) { n.x = p[0]; n.y = p[1]; }
    else {
      withoutPrev++;
      // Разброс детерминированный: тот же граф и та же прежняя раскладка
      // обязаны давать тот же результат, иначе два узла кластера не смогут
      // сверить свои раскладки.
      let h = 0;
      for (let i = 0; i < n.id.length; i++) h = (h * 31 + n.id.charCodeAt(i)) >>> 0;
      n.x = FORCES.width / 2 + ((h % 61) - 30);
      n.y = FORCES.height / 2 + (((h >>> 8) % 61) - 30);
    }
    n.vx = 0; n.vy = 0;
  }
  return { позиции: runForces(graphData, { decay: 0.02, alpha: 0.3 }), новых: withoutPrev };
}

/**
 * Мера расхождения двух раскладок. Это ЧИСЛО РЕШЕНИЯ: по нему человек
 * соглашается на полную перекладку или отказывается от неё. Порог «дальше
 * 200 px» выбран не на глаз: при таком сдвиге узел уезжает за пределы своего
 * прежнего окружения (медиана расстояния до ближайшего соседа — 90).
 */
export function divergence(было, стало) {
  const shifts = [];
  for (const id of Object.keys(стало)) {
    const a = было?.[id];
    if (!a) continue;
    shifts.push(Math.hypot(стало[id][0] - a[0], стало[id][1] - a[1]));
  }
  if (!shifts.length) return { медиана: null, далеко: null, сверено: 0 };
  shifts.sort((x, y) => x - y);
  return {
    медиана: +shifts[Math.floor(shifts.length / 2)].toFixed(1),
    далеко: shifts.filter(d => d > 200).length,
    сверено: shifts.length,
  };
}
