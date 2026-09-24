#!/usr/bin/env node
// ПОПАДАНИЕ И ГЕОМЕТРИЯ СВЯЗЕЙ — нарисованное против выбранного.
//
// Зачем. Три дефекта жили годами, и ни один прибор их не видел, потому что
// никто не сверял то, что НАРИСОВАНО, с тем, что ВЫБИРАЕТСЯ:
//   • наконечник был перенесён с SVG-маркера дословно — острие не доходило
//     до узла (у связей веса 3 на 30 px, при наведении на 97), середина
//     уходила с дуги до 68 px, ось расходилась с касательной до 48°;
//   • выбор узла шёл по дереву попаданий, которое устаревало после раскладки
//     с сервера: щелчок по кружку выбирал связь под ним (58 узлов из 123);
//   • выбор связи шёл по цветной карте, а сглаживание смешивало цвета двух
//     связей в номер третьей: 20 % точек читались как чужая связь.
//
// КАК МЕРИТ. Прибор НЕ спрашивает у приложения его геометрию (linkShape и
// прочее) — сверять функцию с нею же значило бы пересказывать правило. Он
// ЗАПИСЫВАЕТ кадр: перехватывает arc/moveTo/lineTo/fill/stroke холста графа
// и его слоя связей и восстанавливает, что нарисовано на самом деле:
//   кружки узлов (дуга 2π, заливка и обводка), штрихи связей (частичная
//   дуга, обводка), наконечники (треугольник, заливка).
// Затем судит нарисованное по нарисованному, а выбор — по нарисованному.
// Что и почему — у каждого утверждения в тексте ниже.
//
// Восемь состояний: исходное, наведение, выделение щелчком, отбор, метрика
// размером, карта сходства, правка (новая связь), раскладка с сервера.
// Каждое проверяется В ОДНОМ синхронном заходе: между записью кадра и
// выбором не проходит ни одного тика, иначе мерили бы движение, а не выбор.
//
//   node tools/probes/hit_probe.mjs [страница]      по умолчанию index.html
//
// Идёт только по СБОРКЕ (как assert_probe): состояния задаются через оснастку.
import { createRequire } from 'node:module';
import { PUPPETEER, БРАУЗЕР as BROWSER, СЕРВЕР as SERVER } from '../paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);

const PAGE_NAME = process.argv[2] || 'index.html';
const wait = ms => new Promise(r => setTimeout(r, ms));

const checks = [];
const check = (name, passed, expected, actual) =>
  checks.push({ name, passed: !!passed, expected, actual });

const browser = await puppeteer.launch({
  executablePath: BROWSER, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e).split('\n')[0]));
page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });
await page.goto(SERVER + PAGE_NAME, { waitUntil: 'domcontentloaded', timeout: 60000 });
await wait(6500);
await page.addScriptTag({ type: 'module', content: `
  import './_probe-rig.js';
  window.__t = window.__app;
  window.__tReady = true;` });
await page.waitForFunction('window.__tReady === true', { timeout: 20000 });

// ── запись кадра и суд — в странице ────────────────────────────────────
await page.evaluate(() => {
  const A = window.__t;
  const rec = { on: false, ops: [], path: new WeakMap() };
  const P = CanvasRenderingContext2D.prototype;
  const ours = c => rec.any || c.canvas === A.gfxCanvas || (A.linkLayer.canvas && c.canvas === A.linkLayer.canvas);
  const wrap = (m, f) => { const o = P[m]; P[m] = function (...a) { if (rec.on && ours(this)) f(this, a); return o.apply(this, a); }; };
  wrap('beginPath', c => rec.path.set(c, []));
  wrap('arc',     (c, a) => (rec.path.get(c) || []).push({ arc: a.slice(0, 5) }));
  wrap('moveTo',  (c, a) => (rec.path.get(c) || []).push({ pt: a.slice(0, 2) }));
  wrap('lineTo',  (c, a) => (rec.path.get(c) || []).push({ pt: a.slice(0, 2) }));
  wrap('fill',    c => rec.ops.push({ kind: 'fill', path: (rec.path.get(c) || []).slice(), color: String(c.fillStyle) }));
  wrap('stroke',  c => rec.ops.push({ kind: 'stroke', path: (rec.path.get(c) || []).slice(),
    lw: c.lineWidth, color: String(c.strokeStyle), dash: c.getLineDash().length > 0 }));

  // Вычислительная погрешность, единицы графа. Холст получает числа как
  // есть; SVG-вывоз округляет их до сотых, и восстановленный по округлённым
  // концам центр дуги сдвигается на несколько сотых — там допуск шире.
  let TOL = 0.05;
  const TAU = 2 * Math.PI;
  const norm = a => a - TAU * Math.floor(a / TAU);

  // Вывоз не должен ничего сохранять: ссылка на файл перехватывается,
  // содержимое остаётся для разбора (тот же приём, что в probe4).
  window.__exported = null;
  const makeUrl = URL.createObjectURL;
  URL.createObjectURL = function (blob) { window.__exported = blob; return makeUrl.call(URL, blob); };
  const anchorClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) return; return anchorClick.apply(this, arguments); };

  function recordOps(run, any) {
    rec.ops = []; rec.any = !!any; rec.on = true;
    try { run(); } finally { rec.on = false; rec.any = false; }
    return rec.ops;
  }
  // Кадр экрана: что нарисовано, в порядке наложения.
  function captureFrame() {
    A.linkLayer.key = null;         // слой пересоберётся — связи попадут в запись
    return parseOps(recordOps(() => A.draw(), false));
  }
  // Кадр PNG-вывоза: тот же renderScene, но на своём холсте и без слоя —
  // записываются все холсты на время вызова (рисование синхронно, toBlob позже).
  function capturePng() { return parseOps(recordOps(() => A.exportToPNG(), true)); }
  // SVG-вывоз: разбор текста в те же кружки, дуги и наконечники.
  async function captureSvg() {
    window.__exported = null;
    A.exportToSVG();
    for (let i = 0; i < 50 && !window.__exported; i++) await new Promise(r => setTimeout(r, 100));
    if (!window.__exported) return null;
    const doc = new DOMParser().parseFromString(await window.__exported.text(), 'image/svg+xml');
    const circles = [], arcs = [], heads = [];
    let order = 0;
    const N = '(-?[\\d.]+(?:e-?\\d+)?)';
    const arcRe = new RegExp('^M' + N + ',' + N + 'A' + N + ',' + N + ' 0 ([01]),1 ' + N + ',' + N + '$');
    const triRe = new RegExp('^M' + N + ',' + N + 'L' + N + ',' + N + 'L' + N + ',' + N + 'Z$');
    for (const el of doc.querySelectorAll('circle, path')) {
      order++;
      if (el.tagName === 'circle') {
        circles.push({ x: +el.getAttribute('cx'), y: +el.getAttribute('cy'), r: +el.getAttribute('r'),
          lw: +el.getAttribute('stroke-width') || 0, order });
        continue;
      }
      const d = el.getAttribute('d') || '';
      let m;
      if ((m = d.match(triRe))) { heads.push({ t: [[+m[1], +m[2]], [+m[3], +m[4]], [+m[5], +m[6]]], order }); continue; }
      if (!(m = d.match(arcRe))) continue;
      // Центр дуги SVG по концам, радиусу и флагам: обход по возрастанию угла
      // (флаг 1), большая или малая дуга — по флагу large.
      const p0 = [+m[1], +m[2]], p1 = [+m[6], +m[7]], R = +m[3], large = m[5] === '1';
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      const h = Math.hypot(dx, dy) / 2, off = Math.sqrt(Math.max(0, R * R - h * h));
      for (const sgn of [1, -1]) {
        const cx = mx - sgn * dy / (2 * h) * off, cy = my + sgn * dx / (2 * h) * off;
        const a0 = Math.atan2(p0[1] - cy, p0[0] - cx), a1 = Math.atan2(p1[1] - cy, p1[0] - cx);
        if ((norm(a1 - a0) > Math.PI) === large) {
          arcs.push({ cx, cy, R, a0, a1, lw: +el.getAttribute('stroke-width'), gold: false, order });
          break;
        }
      }
    }
    for (const u of circles) u.outer = u.r + u.lw / 2;
    return { circles, arcs, heads };
  }

  function parseOps(ops) {
    const circles = [], arcs = [], heads = [];
    let order = 0;
    for (const op of ops) {
      order++;
      const p = op.path;
      if (p.length === 1 && p[0].arc) {
        const [cx, cy, r, a0, a1] = p[0].arc;
        if (Math.abs(a1 - a0) >= TAU - 1e-9) {
          if (op.kind === 'fill') circles.push({ x: cx, y: cy, r, lw: 0, order });
          else { const u = circles[circles.length - 1]; if (u && u.x === cx && u.y === cy) u.lw = op.lw; }
        } else if (op.kind === 'stroke') {
          arcs.push({ cx, cy, R: r, a0, a1, lw: op.lw, gold: op.color.toLowerCase() === '#ffd700', order });
        }
      } else if (op.kind === 'fill' && p.length === 3 && p.every(q => q.pt)) {
        heads.push({ t: p.map(q => q.pt), order });
      }
    }
    for (const u of circles) u.outer = u.r + u.lw / 2;
    return { circles, arcs, heads };
  }

  const at = (g, a) => [g.cx + g.R * Math.cos(a), g.cy + g.R * Math.sin(a)];
  const onEdge = (q, u) => Math.abs(Math.hypot(q[0] - u.x, q[1] - u.y) - u.outer) <= TOL;
  const inTri = (x, y, t) => {
    const s = (a, b) => (x - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (y - b[1]);
    const d1 = s(t[0], t[1]), d2 = s(t[1], t[2]), d3 = s(t[2], t[0]);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  };
  const onArc = (g, x, y) => { const u = norm(Math.atan2(y - g.cy, x - g.cx) - g.a0);
    return u <= norm(g.a1 - g.a0) + 1e-9; };

  // Кадр → суд. Возвращает меры; утверждения ставит прибор снаружи.
  // source: не задан — экран (со всеми проверками выбора), 'png' | 'svg' —
  // вывоз (только геометрия: выбор под курсором к файлу не относится).
  window.__hit = async function (name, source) {
    window.__axisSample = []; window.__insideSample = null; window.__foreignSample = null;
    TOL = source === 'svg' ? 0.25 : 0.05;
    const frame = source === 'png' ? capturePng() : source === 'svg' ? await captureSvg() : captureFrame();
    if (!frame) return { state: name, noFrame: true };
    const { circles, arcs, heads } = frame;
    const T = A.renderState.transform, rect = A.gfxCanvas.getBoundingClientRect();
    const rep = { state: name, circleCount: circles.length, arcCount: arcs.length, headCount: heads.length };

    // Узлы приложения ↔ нарисованные кружки (по координатам центра).
    const visibleNodes = A.DATA.nodes.filter(n => A.isNodeVisible(n) && n.x !== undefined);
    // Кружок узла — по координатам центра. SVG пишет их округлёнными до
    // сотых (num в exportToSVG), и сопоставлять надо тем же округлением.
    const place = source === 'svg' ? v => Math.round(v * 100) / 100 : v => v;
    const circleAt = new Map();
    for (const u of circles) circleAt.set(u.x + ',' + u.y, u);
    const circleOfNode = n => circleAt.get(place(n.x) + ',' + place(n.y));
    rep.visibleNodeCount = visibleNodes.length;
    rep.nodesWithoutCircle = visibleNodes.filter(n => !circleOfNode(n)).length;

    // Концы: край узла или основание наконечника.
    const headBases = heads.map(h => [(h.t[0][0] + h.t[2][0]) / 2, (h.t[0][1] + h.t[2][1]) / 2]);
    let endsOffPlace = 0, insideOwn = 0;
    // Узел конца дуги. Окружность дуги связи проходит через ЦЕНТРЫ обоих её
    // узлов — так она построена, и нарушить это нельзя, не нарушив рисунок.
    // Поэтому конец принадлежит узлу, чей край проходит через конец, а центр
    // лежит на окружности; край чужого узла через конец пройти может, центр —
    // нет. У петли центр на её окружности не лежит, зато оба конца на краю
    // одного и того же узла.
    const centerOnCircle = (g, u) => Math.abs(Math.hypot(u.x - g.cx, u.y - g.cy) - g.R) <= TOL;
    const endNode = (g, q) => {
      const edgeHits = circles.filter(u => onEdge(q, u));
      return edgeHits.find(u => centerOnCircle(g, u)) || (edgeHits.length === 1 ? edgeHits[0] : null);
    };
    for (const g of arcs) {
      g.own = new Set(); g.heads = [];
      for (const a of [g.a0, g.a1]) {
        const q = at(g, a);
        const u = endNode(g, q);
        // Связи одной пары рисуются одной дугой, и их наконечники совпадают:
        // к концу дуги цепляются ВСЕ совпавшие, а не первый найденный.
        const his = [];
        headBases.forEach((b, i) => { if (Math.hypot(b[0] - q[0], b[1] - q[1]) <= TOL) his.push(i); });
        if (u) g.own.add(u);
        for (const hi of his) { g.heads.push(hi); if (!heads[hi].ownerArc) heads[hi].ownerArc = g; }
        if (!u && !his.length) endsOffPlace++;
      }
    }
    // Наконечники: острие на краю, основание на дуге, ось по касательной,
    // не уже штриха.
    let tipOffEdge = 0, headWithoutArc = 0, axisOff = 0, narrowerThanStroke = 0, maxAngle = 0;
    const kin = new Map();              // наконечник → все дуги, к которым он прицеплен
    for (const g of arcs) for (const i of g.heads) { if (!kin.has(i)) kin.set(i, []); kin.get(i).push(g); }
    heads.forEach((h, i) => {
      const tip = h.t[1];
      const gs = kin.get(i) || [];
      const u = (gs[0] && endNode(gs[0], tip)) || circles.find(w => onEdge(tip, w));
      h.node = u;
      // Острие — конец тех дуг, на чьей окружности оно лежит; к прочей родне
      // наконечник прицеплен лишь совпадением основания в пределах допуска.
      if (u) for (const g of gs) if (Math.abs(Math.hypot(tip[0] - g.cx, tip[1] - g.cy) - g.R) <= TOL) g.own.add(u);
    });
    // Неоднозначность опознания. Если дуга прошла СКВОЗЬ третий узел, а
    // наконечник другой связи, приходящей в него почти тем же путём, совпал с
    // нею в пределах допуска, — у дуги окажется больше двух «своих». Одним
    // рисунком пару тогда не опознать; разрешаем построением дуги: её радиус —
    // полтора расстояния между центрами её узлов. Это опознание, а не проверка:
    // суд ниже по-прежнему сличает нарисованное с выбранным.
    let ambiguous = 0;
    for (const g of arcs) {
      if (g.own.size <= 2) continue;
      ambiguous++;
      const cs = [...g.own]; let best = null, bd = Infinity;
      for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
        const e = Math.abs(1.5 * Math.hypot(cs[i].x - cs[j].x, cs[i].y - cs[j].y) - g.R);
        if (e < bd) { bd = e; best = [cs[i], cs[j]]; }
      }
      g.own = new Set(best);
    }
    rep.ambiguous = ambiguous;
    for (const h of heads) {
      const tip = h.t[1];
      const u = h.node;
      if (!u) tipOffEdge++;
      // Из дуг, к которым прицеплен наконечник, своя — та, на чьей окружности
      // лежит острие (две связи, сходящиеся к узлу почти по одной линии,
      // могут дать совпавшие в пределах допуска концы).
      const gs = kin.get(heads.indexOf(h)) || [];
      const g = gs.slice().sort((a, b) => Math.abs(Math.hypot(tip[0] - a.cx, tip[1] - a.cy) - a.R)
                                        - Math.abs(Math.hypot(tip[0] - b.cx, tip[1] - b.cy) - b.R))[0];
      if (!g) { headWithoutArc++; continue; }
      h.ownerArc = g;
      const b = [(h.t[0][0] + h.t[2][0]) / 2, (h.t[0][1] + h.t[2][1]) / 2];
      const mid = [(tip[0] + b[0]) / 2, (tip[1] + b[1]) / 2];
      const a = Math.atan2(mid[1] - g.cy, mid[0] - g.cx);
      const ax = tip[0] - b[0], ay = tip[1] - b[1], L = Math.hypot(ax, ay);
      const cos = Math.abs(-Math.sin(a) * ax + Math.cos(a) * ay) / L;
      const angle = Math.acos(Math.min(1, cos)) * 180 / Math.PI;
      maxAngle = Math.max(maxAngle, angle);
      const offArc = Math.abs(Math.hypot(tip[0] - g.cx, tip[1] - g.cy) - g.R);
      if (angle > 1 || offArc > TOL) { axisOff++; if (!window.__axisSample) window.__axisSample = [];
        window.__axisSample.push({ angle: +angle.toFixed(3), offArc: +offArc.toFixed(3), R: +g.R.toFixed(1), lw: g.lw,
          headLength: +L.toFixed(2), ownerArc: +(norm(g.a1 - g.a0) * g.R).toFixed(2),
          kinRadii: arcs.filter(z => z.heads.includes(heads.indexOf(h))).map(z => +z.R.toFixed(1)),
          spans: (() => { const a = at(g, g.a0), b = at(g, g.a1); return [a, b].map(q => Math.hypot(q[0] - b[0], q[1] - b[1]).toFixed(1)).join('/'); })() }); }
      const half = Math.hypot(h.t[0][0] - h.t[2][0], h.t[0][1] - h.t[2][1]) / 2;
      if (half < g.lw / 2 - 1e-9) narrowerThanStroke++;
    }
    // Штрих не заходит внутрь своих узлов.
    for (const g of arcs) {
      const span = norm(g.a1 - g.a0);
      for (let k = 1; k < 16; k++) {
        const q = at(g, g.a0 + span * k / 16);
        for (const u of g.own) if (Math.hypot(q[0] - u.x, q[1] - u.y) < u.outer - TOL) { insideOwn++;
          if (!window.__insideSample) window.__insideSample = { k, R: +g.R.toFixed(1), lw: g.lw, node: [u.x, u.y, u.r, u.lw],
            dist: +Math.hypot(q[0] - u.x, q[1] - u.y).toFixed(2), ownCount: g.own.size,
            circlesAtCenter: circles.filter(w => w.x === u.x && w.y === u.y).map(w => [w.r, w.lw, w.order]) }; break; }
      }
    }
    Object.assign(rep, { endsOffPlace, tipOffEdge, headWithoutArc, axisOff, narrowerThanStroke, insideOwn,
      maxAngle: +maxAngle.toFixed(3), goldArcs: arcs.filter(g => g.gold).length, axisSample: window.__axisSample.slice(0, 3) });

    // Счёт: одна дуга на каждую видимую связь (кроме тех, чьи узлы
    // перекрываются — там видимой дуги нет), голов — по числу концов.
    let expectedArcs = 0, expectedHeads = 0;
    for (const l of A.DATA.links) {
      if (!A.isLinkVisible(l) || !l.source || l.source.x === undefined || !l.target || l.target.x === undefined) continue;
      const us = circleOfNode(l.source), ut = circleOfNode(l.target);
      if (!us || !ut) continue;
      if (us !== ut && Math.hypot(us.x - ut.x, us.y - ut.y) <= us.outer + ut.outer) continue;
      expectedArcs++; expectedHeads += (us !== ut && A.linkHasTwoHeads(l)) ? 2 : 1;
    }
    rep.expectedArcs = expectedArcs; rep.expectedHeads = expectedHeads;
    rep.linkArcCount = arcs.filter(g => !g.gold).length;

    rep.source = source || 'экран';
    if (source) return rep;

    // ── выбор узла: верхний из кружков, покрывающих точку ──
    let nodePoints = 0, nodeMiss = 0; const nodeMissSample = [];
    for (const u of circles) for (let k = 0; k < 12; k++) for (const f of [0.3, 0.65, 0.95]) {
      const a = k * Math.PI / 6, x = u.x + f * u.r * Math.cos(a), y = u.y + f * u.r * Math.sin(a);
      nodePoints++;
      const got = A.pickNode(x, y);
      const gu = got && circleOfNode(got);
      const coversPoint = w => Math.hypot(x - w.x, y - w.y) <= w.outer;
      const higher = circles.filter(w => w.order > (gu ? gu.order : -1) && w !== gu && Math.hypot(x - w.x, y - w.y) <= w.outer - 0.5);
      if (!gu || !coversPoint(gu) || higher.length) {
        nodeMiss++;
        if (nodeMissSample.length < 2) nodeMissSample.push({ where: u.x.toFixed(1) + ',' + u.y.toFixed(1), picked: got ? got.id : null });
      }
    }
    Object.assign(rep, { nodePoints, nodeMiss, nodeMissSample });

    // ── выбор связи ──
    // Пара концов нарисованной дуги и пара концов выбранной связи —
    // единственный общий язык записи и приложения (связи одной пары
    // рисуются одной дугой и различимы только цветом).
    const arcPair = g => [...g.own].map(u => u.x + ',' + u.y).sort().join('|');
    const linkPair = l => { const a = circleOfNode(l.source), b = circleOfNode(l.target);
      return a && b ? [...new Set([a, b])].map(u => u.x + ',' + u.y).sort().join('|') : '?'; };
    const toScreen = (x, y) => [rect.left + T.applyX(x), rect.top + T.applyY(y)];
    const inFrame = ([sx, sy]) => sx > rect.left + 1 && sy > rect.top + 1 && sx < rect.right - 1 && sy < rect.bottom - 1;
    const underNode = (x, y) => circles.some(u => Math.hypot(x - u.x, y - u.y) <= u.outer + 2);
    const linkArcs = arcs.filter(g => !g.gold);
    const topCovering = (x, y) => {
      let top = null;
      for (const g of linkArcs) if (onArc(g, x, y) && Math.abs(Math.hypot(x - g.cx, y - g.cy) - g.R) <= g.lw / 2 - 1e-6 && (!top || g.order > top.order)) top = g;
      for (const h of heads) if (h.ownerArc && !h.ownerArc.gold && inTri(x, y, h.t) && (!top || h.order > top.order)) top = h.ownerArc;
      return top;
    };
    let linkPoints = 0, linkMiss = 0; const linkMissSample = [];
    for (const g of linkArcs) for (const f of [0.25, 0.5, 0.75]) {
      const q = at(g, g.a0 + norm(g.a1 - g.a0) * f);
      if (underNode(q[0], q[1]) || !inFrame(toScreen(q[0], q[1]))) continue;
      const top = topCovering(q[0], q[1]);
      if (!top) continue;
      linkPoints++;
      const [sx, sy] = toScreen(q[0], q[1]);
      const l = A.pickLink(sx, sy);
      if (!l || linkPair(l) !== arcPair(top)) {
        linkMiss++;
        if (linkMissSample.length < 2) {
          const x = q[0], y = q[1];
          const nearby = linkArcs.map(g => ({ pair: arcPair(g), order: g.order, lw: g.lw,
            dist: +Math.abs(Math.hypot(x - g.cx, y - g.cy) - g.R).toFixed(2), inRange: onArc(g, x, y) }))
            .filter(z => z.inRange && z.dist <= 8).sort((a, b) => a.order - b.order);
          linkMissSample.push({ expected: arcPair(top), pickedLink: l ? l.source.id + '→' + l.target.id + ' ' + linkPair(l) : null, nearby });
        }
      }
    }
    // Чужая связь: выбранная обязана лежать не дальше своей полосы.
    const band = g => Math.max(g.lw, 10) / 2 + 0.6;
    const distToArc = (g, x, y) => onArc(g, x, y) ? Math.abs(Math.hypot(x - g.cx, y - g.cy) - g.R)
      : Math.min(...[g.a0, g.a1].map(a => { const q = at(g, a); return Math.hypot(x - q[0], y - q[1]); }));
    const distToSeg = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
    const distToTri = (x, y, t) => inTri(x, y, t) ? 0
      : Math.min(distToSeg(x, y, t[0], t[1]), distToSeg(x, y, t[1], t[2]), distToSeg(x, y, t[2], t[0]));
    const arcsByPair = new Map();
    for (const g of linkArcs) { const k = arcPair(g); if (!arcsByPair.has(k)) arcsByPair.set(k, []); arcsByPair.get(k).push(g); }
    let gridPoints = 0, pickedCount = 0, foreign = 0; const foreignSample = [];
    for (let sy = rect.top + 3; sy < rect.bottom - 3; sy += 11) for (let sx = rect.left + 3; sx < rect.right - 3; sx += 11) {
      gridPoints++;
      const l = A.pickLink(sx, sy);
      if (!l) continue;
      pickedCount++;
      const [x, y] = T.invert([sx - rect.left, sy - rect.top]);
      const gs = arcsByPair.get(linkPair(l)) || [];
      // Фигура связи — штрих и наконечники; полоса попадания отсчитывается от неё.
      const ok = gs.some(g => distToArc(g, x, y) <= band(g) || g.heads.some(i => distToTri(x, y, heads[i].t) <= band(g)));
      if (!ok) { foreign++; if (foreignSample.length < 2) foreignSample.push({ point: [sx, sy], pickedName: l.source.id + '→' + l.target.id,
        pair: linkPair(l), pairArcs: gs.length, dist: gs.map(g => +distToArc(g, x, y).toFixed(2)), lw: gs.map(g => g.lw),
        headCount: gs.map(g => g.heads.length), oddArcsNearby: linkArcs.filter(g => g.own.size !== 2 && distToArc(g, x, y) < 8).map(g => [...g.own].map(u => u.x.toFixed(1) + ',' + u.y.toFixed(1)).join('|')) }); }
    }
    Object.assign(rep, { linkPoints, linkMiss, linkMissSample, gridPoints, pickedCount, foreign, foreignSample, insideSample: window.__insideSample });
    return rep;
  };
});

// ── состояния ──────────────────────────────────────────────────────────
const freeze = () => page.evaluate(() => window.__t.freezeSimulation());
const judge = async (name, source) => { await freeze(); await wait(150); await freeze(); return page.evaluate((n, s) => window.__hit(n, s), name, source); };
const results = [];

results.push(await judge('исходное'));

// наведение: толщина штриха растёт, наконечник обязан остаться на краю
await page.evaluate(() => {
  const A = window.__t, T = A.renderState.transform, rect = A.gfxCanvas.getBoundingClientRect();
  const l = A.DATA.links.find(l => A.isLinkVisible(l) && l.weight === 3 && A.linkHasTwoHeads(l)
    && T.applyX(l.target.x) > 100 && T.applyX(l.target.x) < rect.width - 100
    && T.applyY(l.target.y) > 100 && T.applyY(l.target.y) < rect.height - 100)
    || A.DATA.links.find(l => A.isLinkVisible(l) && l.weight === 3);
  A.renderState.hoveredLink = l;
});
results.push(await judge('наведение'));
await page.evaluate(() => { window.__t.renderState.hoveredLink = null; });

// выделение настоящим щелчком по кружку (затенение, анимация радиусов)
const clickTarget = await page.evaluate(() => {
  const A = window.__t, T = A.renderState.transform, r = A.gfxCanvas.getBoundingClientRect();
  const n = A.DATA.nodes.find(n => A.isNodeVisible(n) && T.applyX(n.x) > 300 && T.applyX(n.x) < r.width - 300
    && T.applyY(n.y) > 200 && T.applyY(n.y) < r.height - 200 && A.getConceptConnections(n.id).length > 3);
  return { x: r.left + T.applyX(n.x), y: r.top + T.applyY(n.y), id: n.id };
});
await page.mouse.move(clickTarget.x, clickTarget.y); await page.mouse.click(clickTarget.x, clickTarget.y); await wait(900);
const dimmedCount = await page.evaluate(() => window.__t.renderState.nodeClasses.dimmed ? window.__t.renderState.nodeClasses.dimmed.size : 0);
results.push(await judge('выделение'));
check('щелчок по кружку выделил концепцию (затенены прочие)', dimmedCount > 0, '>0', dimmedCount);
await page.evaluate(() => { const A = window.__t; A.closeUniversalModal(); A.resetHighlight(); });
await wait(600);

// отбор: два философа
await page.evaluate(() => {
  const A = window.__t, s = A.S.selectedPhilosophers;
  const T = A.renderState.transform, r = A.gfxCanvas.getBoundingClientRect();
  const centerNode = A.DATA.nodes.filter(n => A.isNodeVisible(n)).sort((a, b) =>
    Math.hypot(T.applyX(a.x) - r.width / 2, T.applyY(a.y) - r.height / 2) -
    Math.hypot(T.applyX(b.x) - r.width / 2, T.applyY(b.y) - r.height / 2))[0];
  const counts = new Map();
  for (const l of A.DATA.links) {
    const a = l.source, b = l.target;
    if (a.concept === centerNode.concept && b.concept !== centerNode.concept) counts.set(b.concept, (counts.get(b.concept) || 0) + 1);
    if (b.concept === centerNode.concept && a.concept !== centerNode.concept) counts.set(a.concept, (counts.get(a.concept) || 0) + 1);
  }
  const phils = [centerNode.concept, [...counts].sort((a, b) => b[1] - a[1])[0][0]];
  s.clear(); phils.forEach(x => s.add(x)); A.applyFiltersImmediate();
});
await wait(1200);
results.push(await judge('отбор'));
await page.evaluate(() => { window.__t.selectAllPhilosophers(); window.__t.applyFiltersImmediate(); });
await wait(1200);

// метрика размером: радиусы 8…40 и мелкие наконечники
await page.evaluate(() => window.__t.toggleMetricVisualization('degree'));
await wait(1200);
const arrowModeNow = await page.evaluate(() => window.__t.S.arrowMode);
results.push(await judge('метрика размером'));
check('метрика размером включилась', arrowModeNow === 'metric', 'metric', arrowModeNow);
await page.evaluate(() => window.__t.toggleMetricVisualization('degree'));
await wait(1200);

// карта сходства: дуги к похожим и обводки по сходству
await page.evaluate(() => {
  const A = window.__t;
  const n = A.DATA.nodes.find(n => A.getConceptConnections(n.id).length > 6);
  A.showSimilarityOverlay(n.id, 'structure');
});
await wait(2500);
results.push(await judge('карта сходства'));
await page.evaluate(() => window.__t.clearSimilarityOverlay());
await wait(600);

// правка: новая связь проходит путь сохранения (relations, links, граф)
const newLinkCount = await page.evaluate(() => {
  const A = window.__t, D = A.DATA;
  const existing = new Set(D.links.map(l => (l.source.id || l.source) + '>' + (l.target.id || l.target)));
  let s, t;
  for (const a of D.nodes) { for (const b of D.nodes) if (a !== b && a.concept !== b.concept && !existing.has(a.id + '>' + b.id) && !existing.has(b.id + '>' + a.id)
    && Math.hypot(a.x - b.x, a.y - b.y) > 150 && Math.hypot(a.x - b.x, a.y - b.y) < 300) { s = a; t = b; break; } if (s) break; }
  const next = { source: s.id, target: t.id, type: D.relations[0].type, weight: 3, bidirectional: true, description: 'проба' };
  const link = { id: 'hit_probe_rel', ...next };
  D.relations.push({ id: 'hit_probe_rel', ...next });
  D.links.push(link);
  A.addLinkToGraph(link);
  A.afterDataChange({ nodes: true, links: true });   // как saveConnectionData
  return D.links.length;
});
await wait(300);
results.push(await judge('правка'));

// раскладка с сервера: все узлы переезжают, симуляция глохнет
await page.evaluate(() => {
  const A = window.__t, P = {};
  for (const n of A.DATA.nodes) P[n.id] = [n.x + 60, n.y + 36];
  A.applyServerLayout(P);
});
await wait(600);
results.push(await judge('раскладка с сервера'));

// вывоз: PNG рисует тем же renderScene, SVG строит свою разметку — оба
// обязаны нести ту же геометрию, что экран. Выделение щелчком делает
// обводки разными, чтобы край узла проверялся не на одной ширине.
const exportTarget = await page.evaluate(() => {
  const A = window.__t, T = A.renderState.transform, r = A.gfxCanvas.getBoundingClientRect();
  const n = A.DATA.nodes.find(n => A.isNodeVisible(n) && T.applyX(n.x) > 300 && T.applyX(n.x) < r.width - 300
    && T.applyY(n.y) > 200 && T.applyY(n.y) < r.height - 200 && A.getConceptConnections(n.id).length > 3);
  return { x: r.left + T.applyX(n.x), y: r.top + T.applyY(n.y) };
});
await page.mouse.move(exportTarget.x, exportTarget.y); await page.mouse.click(exportTarget.x, exportTarget.y); await wait(900);
results.push(await judge('вывоз PNG', 'png'));
results.push(await judge('вывоз SVG', 'svg'));

await page.close(); await browser.close();

// ── утверждения ────────────────────────────────────────────────────────
for (const rep of results) {
  const sname = rep.state;
  if (rep.noFrame) { check(`${sname}: кадр снят`, false, 'кадр', 'нет'); continue; }
  check(`${sname}: каждый видимый узел нарисован`, rep.nodesWithoutCircle === 0 && rep.circleCount === rep.visibleNodeCount,
    `${rep.visibleNodeCount} кружков`, `${rep.circleCount}, без кружка ${rep.nodesWithoutCircle}`);
  check(`${sname}: штрих на каждую видимую связь`, rep.linkArcCount === rep.expectedArcs, rep.expectedArcs, rep.linkArcCount);
  check(`${sname}: наконечник на каждый конец со стрелкой`, rep.headCount === rep.expectedHeads, rep.expectedHeads, rep.headCount);
  check(`${sname}: концы штрихов — на краю узла или у основания наконечника`, rep.endsOffPlace === 0, 0, rep.endsOffPlace);
  check(`${sname}: острие наконечника на видимом краю узла`, rep.tipOffEdge === 0, 0, rep.tipOffEdge);
  check(`${sname}: наконечник сидит на своей дуге`, rep.headWithoutArc === 0, 0, rep.headWithoutArc);
  check(`${sname}: ось наконечника по касательной, острие на дуге`, rep.axisOff === 0, '0 (≤1°)',
    `${rep.axisOff} (наиб. ${rep.maxAngle}°)` + (rep.axisSample[0] ? ' ' + JSON.stringify(rep.axisSample[0]) : ''));
  check(`${sname}: наконечник не уже штриха`, rep.narrowerThanStroke === 0, 0, rep.narrowerThanStroke);
  check(`${sname}: неоднозначных опознаний — единицы`, rep.ambiguous <= 3, '≤3', rep.ambiguous);
  check(`${sname}: штрих не заходит внутрь своих узлов`, rep.insideOwn === 0, 0, rep.insideOwn + (rep.insideSample ? ' ' + JSON.stringify(rep.insideSample) : ''));
  if (rep.source !== 'экран') continue;
  check(`${sname}: точка в кружке выбирает верхний кружок`, rep.nodeMiss === 0 && rep.nodePoints > 0,
    `0 из ${rep.nodePoints}`, rep.nodeMiss + (rep.nodeMissSample[0] ? ' ' + JSON.stringify(rep.nodeMissSample[0]) : ''));
  check(`${sname}: точка на штрихе выбирает верхнюю связь`, rep.linkMiss === 0 && rep.linkPoints > 0,
    `0 из ${rep.linkPoints}`, rep.linkMiss + (rep.linkMissSample[0] ? ' ' + JSON.stringify(rep.linkMissSample[0]) : ''));
  check(`${sname}: выбранная связь не дальше своей полосы`, rep.foreign === 0 && rep.pickedCount > 0,
    `0 из ${rep.pickedCount}`, rep.foreign + (rep.foreignSample[0] ? ' ' + JSON.stringify(rep.foreignSample[0]) : ''));
}
const simResult = results.find(rep => rep.state === 'карта сходства');
check('карта сходства: дуги к похожим нарисованы и обрезаны по краю', simResult && simResult.goldArcs > 0, '>0', simResult && simResult.goldArcs);
const editResult = results.find(rep => rep.state === 'правка'), baseResult = results[0];
check('правка: новая связь нарисована', editResult.linkArcCount === baseResult.linkArcCount + 1 || editResult.expectedArcs === baseResult.expectedArcs + 1,
  baseResult.expectedArcs + 1, editResult.expectedArcs);
check('ошибок страницы нет', pageErrors.length === 0, 0, pageErrors.length + (pageErrors[0] ? ' (' + pageErrors[0].slice(0, 60) + ')' : ''));

const failed = checks.filter(item => !item.passed);
for (const item of checks) console.log(`${item.passed ? '✓' : '✗'} ${item.name}: ждали ${item.expected}, вышло ${item.actual}`);
console.log(`\nутверждений ${checks.length}, не сошлось ${failed.length}`);
process.exit(failed.length ? 1 : 0);
