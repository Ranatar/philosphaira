#!/usr/bin/env node
// ТИПОСЛЕПАЯ КОНТРОЛЬНАЯ МЕРА (М9).
//
// Зачем. Разметка типов связей — рукотворный словарь: двадцать один тип,
// расставленный человеком. Метрики приложения его читают, а значит вывод
// «эти концепции похожи» может оказаться выводом «им проставлены схожие
// типы» — то есть свойством словаря, а не истории философии. Однажды так и
// вышло: метрический профиль давал 37,9 % межтрадиционных пар против фона
// 67,9 %, и смещение объяснялось именно типами.
//
// Прибор строит МЕРУ, КОТОРАЯ ТИПОВ НЕ ЧИТАЕТ ВОВСЕ (семнадцать признаков
// строения графа и дат, см. §1 спецификации), и сравнивает её с мерами
// приложения. Если выводы держатся — они о графе; если рассыпаются —
// о словаре.
//
// НА СТРАНИЦУ ЭТА МЕРА НЕ СТАВИТСЯ, и это решение, а не недоделка. Замерено:
// как инструмент чтения она хуже профиля приложения — устойчивость 0,369
// против 0,462, насыщение 77 концепций с вырожденным верхом против 40, а
// после отсева малосвязных её зависимость от степени ПЕРЕВОРАЧИВАЕТСЯ
// (+0,228 против −0,178 у профиля). Её назначение — контроль.
//
// ОБЕ СТОРОНЫ МЕРЯЕТ САМ. Первая прикидка сравнивала измеренную типослепую
// меру с ЦИФРАМИ ИЗ ОТЧЁТА — и старела бы молча: поправили метрику, а прибор
// продолжал бы сверяться с числом полугодовой давности и рапортовать
// согласие. Поэтому профиль и структура берутся из живого приложения через
// оснастку, и всякая правка формул отражается в замере сама.
//
// ДВА УРОВНЯ. Быстрый (ρ, пары, межтрадиционность, насыщение) считается за
// секунды и входит в приёмку. Медленный (устойчивость к выбросу десятой доли
// связей, переживание удаления собственного ребра) требует десятков
// пересчётов и зовётся явно: `node tools/blind_probe.mjs run <страница>
// <файл> --медленно`.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { БРАУЗЕР, PUPPETEER, ДЕРЕВО, СЕРВЕР } from './paths.mjs';
const require = createRequire(import.meta.url);
const puppeteer = require(PUPPETEER);

const BASE = СЕРВЕР;
const [, , команда, страница = 'index.html', выход] = process.argv;
const МЕДЛЕННО = process.argv.includes('--медленно');

if (команда !== 'run') {
  console.error('употребление: node tools/blind_probe.mjs run <страница> <файл.json> [--медленно]');
  process.exit(2);
}

// ── отпечаток базы ──────────────────────────────────────────────────
// Хеш всех записей С ВЫЧЕРКНУТЫМ полем description: правка описания базу не
// меняет. Отпечаток НЕ УСЛОВИЕ ЗАПУСКА — прибор входит в приёмку и считается
// всегда. Он ПОЯСНЕНИЕ: если числа разошлись, а отпечаток тот же, значит
// двинулись формулы; если отпечаток другой — дело в данных. Список поводов
// пересчитать оказался шире, чем «изменилась база»: формулы метрик,
// isSymmetricLink, проекция _relations, порог profileIsMeaningful. Решать
// заранее, что из этого «считается изменением», — способ забыть про восьмой
// повод; сравнение с эталоном ловит все разом.
function отпечатокБазы() {
  const наборы = ['concepts', 'relations', 'philosophers', 'traditions', 'rubrics', 'relationTypes'];
  let h = 2166136261 >>> 0;
  const съесть = s => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } };
  for (const имя of наборы) {
    const п = path.join(ДЕРЕВО, 'data', имя + '.json');
    if (!fs.existsSync(п)) continue;
    const данные = JSON.parse(fs.readFileSync(п, 'utf8'));
    съесть(имя + ':' + данные.length + ';');
    for (const запись of данные) {
      const ключи = Object.keys(запись).filter(k => k !== 'description').sort();
      for (const k of ключи) съесть(k + '=' + JSON.stringify(запись[k]) + ',');
      съесть(';');
    }
  }
  return h.toString(16).padStart(8, '0');
}

// ── всё, что считается в браузере ───────────────────────────────────
// Целиком одной строкой: у страницы свои имена, и таскать их наружу
// по одному дороже, чем посчитать на месте.
const В_БРАУЗЕРЕ = async (медленно) => {
  const A = window.__app;
  const ids = A.DATA.concepts.map(c => c.id);
  const n = ids.length;
  const авторОф = new Map(A.DATA.concepts.map(c => [c.id, c.philosopher]));
  const фил = new Map(A.DATA.philosophers.map(p => [p.id, p]));
  const родОф = id => (фил.get(авторОф.get(id)) || {}).birth;
  const традОф = id => new Set((фил.get(авторОф.get(id)) || {}).traditions || []);

  // ---- строение по набору рёбер -----------------------------------
  function строение(рёбра, типослепо) {
    const Out = new Map(), In = new Map(), N = new Map();
    const wIn = new Map(), wOut = new Map();
    for (const id of ids) { Out.set(id, []); In.set(id, []); N.set(id, new Set()); wIn.set(id, 0); wOut.set(id, 0); }
    for (const r of рёбра) {
      const s = r.source, t = r.target;
      if (s === t) continue;                       // петли отброшены
      if (!N.has(s) || !N.has(t)) continue;
      const w = r.weight || 1;
      Out.get(s).push(t); In.get(t).push(s);
      wOut.set(s, wOut.get(s) + w); wIn.set(t, wIn.get(t) + w);
      N.get(s).add(t); N.get(t).add(s);
      // Симметричность: приложение считает её и по флагу bidirectional, и по
      // типу (пять типов помечены symmetric — это 119 связей из 1624).
      // Спецификация утверждала обратное, поэтому прибор считает ОБА способа
      // и показывает оба: мера, чьё назначение — контроль типослепоты, не
      // вправе сама втихую читать тип.
      const симм = типослепо ? !!r.bidirectional : A.isSymmetricLink(r);
      if (симм) {
        Out.get(t).push(s); In.get(s).push(t);
        wOut.set(t, wOut.get(t) + w); wIn.set(s, wIn.get(s) + w);
      }
    }
    return { Out, In, N, wIn, wOut };
  }

  function pagerank(A2) {
    let v = new Map(ids.map(i => [i, 1 / n]));
    for (let шаг = 0; шаг < 40; шаг++) {
      let вис = 0;
      for (const i of ids) if (!A2.get(i).length) вис += v.get(i);
      const нов = new Map(ids.map(i => [i, 0.15 / n + 0.85 * вис / n]));
      for (const i of ids) {
        const цели = A2.get(i);
        if (!цели.length) continue;
        const доля = 0.85 * v.get(i) / цели.length;
        for (const j of цели) нов.set(j, нов.get(j) + доля);
      }
      v = нов;
    }
    return v;
  }

  // ---- семнадцать признаков ---------------------------------------
  function признаки(рёбра, типослепо) {
    const { Out, In, N, wIn, wOut } = строение(рёбра, типослепо);
    const prF = pagerank(Out), prR = pagerank(In);
    const F = [];
    for (const i of ids) {
      const сос = [...N.get(i)], k = сос.length;
      let L = 0;
      for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) if (N.get(сос[a]).has(сос[b])) L++;
      const клас = k >= 2 ? 2 * L / (k * (k - 1)) : 0;
      const два = new Set();
      for (const j of сос) for (const q of N.get(j)) два.add(q);
      for (const j of сос) два.delete(j);
      два.delete(i);
      const срСт = k ? сос.reduce((a, j) => a + N.get(j).size, 0) / k : 0;
      const философы = new Set(сос.map(j => авторОф.get(j)));
      const свои = сос.filter(j => авторОф.get(j) === авторОф.get(i)).length;
      const мой = родОф(i);
      const даты = сос.map(родОф).filter(x => x !== undefined && x !== null);
      const раньше = мой == null ? 0 : сос.filter(j => родОф(j) != null && родОф(j) < мой).length;
      const позже = мой == null ? 0 : сос.filter(j => родОф(j) != null && родОф(j) > мой).length;
      let срД = 0, разб = 0;
      if (даты.length) {
        const m = даты.reduce((a, b) => a + b, 0) / даты.length;
        срД = мой == null ? 0 : (m - мой) / 100;
        разб = Math.sqrt(даты.reduce((a, b) => a + (b - m) * (b - m), 0) / даты.length) / 100;
      }
      F.push([k, In.get(i).length, Out.get(i).length, wIn.get(i), wOut.get(i),
              prF.get(i) * 1000, prR.get(i) * 1000, клас, два.size, срСт,
              философы.size, свои, k - свои, раньше, позже, срД, разб]);
    }
    return { F, N };
  }

  // ---- двойное центрирование --------------------------------------
  function профили(F) {
    const m = F[0].length;
    const Z = F.map(() => new Array(m).fill(0));
    for (let k = 0; k < m; k++) {
      let mu = 0; for (let i = 0; i < n; i++) mu += F[i][k]; mu /= n;
      let sd = 0; for (let i = 0; i < n; i++) sd += (F[i][k] - mu) ** 2;
      sd = Math.sqrt(sd / n) || 1;
      for (let i = 0; i < n; i++) Z[i][k] = (F[i][k] - mu) / sd;
    }
    const V = Z.map(z => { const ср = z.reduce((a, b) => a + b, 0) / m; return z.map(x => x - ср); });
    const нормы = V.map(v => Math.sqrt(v.reduce((a, b) => a + b * b, 0)));
    return { V, нормы };
  }

  // ---- шестёрки по любой мере -------------------------------------
  const ШЕСТЬ = 6;
  function шестёрки(значение, годен) {
    const рез = new Map();
    for (let a = 0; a < n; a++) {
      if (годен && !годен(ids[a])) continue;
      const зн = [];
      for (let b = 0; b < n; b++) {
        if (b === a) continue;
        if (годен && !годен(ids[b])) continue;
        const s = значение(a, b);
        if (s > 0) зн.push([s, b]);
      }
      зн.sort((x, y) => (y[0] - x[0]) || (x[1] - y[1]));
      рез.set(ids[a], зн.slice(0, ШЕСТЬ).map(([s, b]) => [ids[b], s]));
    }
    return рез;
  }

  // ---- замеры -----------------------------------------------------
  const естьСвязь = new Set();
  for (const r of A.DATA.relations) if (r.source !== r.target)
    естьСвязь.add([r.source, r.target].sort().join('|'));

  function спирмен(x, y) {
    const ранг = v => { const s = v.map((z, i) => [z, i]).sort((a, b) => a[0] - b[0]);
      const r = new Array(v.length); s.forEach(([, i], m) => r[i] = m); return r; };
    const rx = ранг(x), ry = ранг(y), k = x.length;
    const mx = (k - 1) / 2, my = mx;
    let cov = 0, sx = 0, sy = 0;
    for (let i = 0; i < k; i++) { cov += (rx[i] - mx) * (ry[i] - my); sx += (rx[i] - mx) ** 2; sy += (ry[i] - my) ** 2; }
    return sx && sy ? cov / Math.sqrt(sx * sy) : 0;
  }

  function замерить(шест, N) {
    const пары = new Set(); const верх = [];
    for (const [a, lst] of шест) {
      if (lst.length) верх.push([a, lst[0][1]]);
      for (const [b] of lst) пары.add([a, b].sort().join('|'));
    }
    const соСвязью = [...пары].filter(p => естьСвязь.has(p));
    const межфил = соСвязью.filter(p => { const [x, y] = p.split('|'); return авторОф.get(x) !== авторОф.get(y); });
    const межтрад = межфил.filter(p => { const [x, y] = p.split('|');
      const t = традОф(x); for (const q of традОф(y)) if (t.has(q)) return false; return true; });
    const x = верх.map(([a]) => N.get(a).size), y = верх.map(([, v]) => v);
    return {
      источников: шест.size, пар: пары.size, соСвязью: соСвязью.length,
      межфилософских: межфил.length, межтрадиционных: межтрад.length,
      ро: +спирмен(x, y).toFixed(3),
      насыщение: верх.filter(([, v]) => v >= 0.95).length,
    };
  }

  function жаккарШестёрок(a, b) {
    let s = 0, k = 0;
    for (const [c, lstA] of a) {
      const lstB = b.get(c); if (!lstB) continue;
      const A1 = new Set(lstA.map(([x]) => x)), B1 = new Set(lstB.map(([x]) => x));
      let общ = 0; for (const q of A1) if (B1.has(q)) общ++;
      const союз = new Set([...A1, ...B1]).size;
      s += союз ? общ / союз : 1; k++;
    }
    return k ? +(s / k).toFixed(3) : 0;
  }

  // ---- меры -------------------------------------------------------
  // ОТСЕВ СПРАШИВАЕТСЯ У ПРИЛОЖЕНИЯ, А НЕ ПЕРЕСКАЗЫВАЕТСЯ.
  // Первая редакция считала его сама: `nodeDegreeOf(id) >= medianNodeDegree()`.
  // Подложенная поломка это и вскрыла: порог в приложении ослабили на два, а
  // прибор показал полное согласие — он сверялся с собственным пересказом
  // правила, а не с правилом. Прибор, повторяющий логику проверяемого, не
  // умеет поймать её отказ; это записано в doc/build.md и стоило нам уже
  // трёх случаев.
  const годен = id => A.profileIsMeaningful(id);

  function типослепаяШесть(рёбра, типослепо, отсев) {
    const { F, N } = признаки(рёбра, типослепо);
    const { V, нормы } = профили(F);
    const знач = (a, b) => (нормы[a] && нормы[b])
      ? V[a].reduce((s, x, k) => s + x * V[b][k], 0) / (нормы[a] * нормы[b]) : 0;
    return { шест: шестёрки(знач, отсев), N };
  }

  const итог = { меры: {} };

  // приложение: профиль и структура — берутся ЖИВЫМИ, не из отчёта
  {
    const { N } = строение(A.DATA.relations, false);
    итог.меры['приложение: профиль'] =
      замерить(шестёрки((a, b) => A.profileSimilarity(ids[a], ids[b]), годен), N);
    итог.меры['приложение: структура'] =
      замерить(шестёрки((a, b) => A.structuralSimilarity(ids[a], ids[b]).jaccard, null), N);
    итог.меры['приложение: типы'] =
      замерить(шестёрки((a, b) => A.structuralSimilarity(ids[a], ids[b]).typeCosine, null), N);
  }
  // типослепая: как в коде (симметричность читает тип) и вправду типослепо
  for (const [имя, типослепо, отсев] of [
    ['типослепая: как в коде', false, null],
    ['типослепая: без типов вовсе', true, null],
    ['типослепая: как в коде, с отсевом', false, годен],
  ]) {
    const { шест, N } = типослепаяШесть(A.DATA.relations, типослепо, отсев);
    итог.меры[имя] = замерить(шест, N);
  }

  // фон: сколько пар философов межтрадиционны вообще
  {
    const пары = [];
    const все = [...new Set(A.DATA.concepts.map(c => c.philosopher))].filter(Boolean);
    let вс = 0, мт = 0;
    for (let i = 0; i < все.length; i++) for (let j = i + 1; j < все.length; j++) {
      вс++;
      const t = new Set((фил.get(все[i]) || {}).traditions || []);
      let общ = false; for (const q of ((фил.get(все[j]) || {}).traditions || [])) if (t.has(q)) общ = true;
      if (!общ) мт++;
    }
    итог.фон = { парФилософов: вс, межтрадиционных: мт, доля: +(мт / вс).toFixed(3) };
  }

  if (!медленно) return итог;

  // ---- медленная часть --------------------------------------------
  итог.медленное = {};
  const rnd = (seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)(7);
  {
    const базовые = типослепаяШесть(A.DATA.relations, false, null).шест;
    let сумма = 0;
    for (let прогон = 0; прогон < 4; прогон++) {
      const ост = A.DATA.relations.filter(() => rnd() > 0.10);
      сумма += жаккарШестёрок(базовые, типослепаяШесть(ост, false, null).шест);
    }
    итог.медленное['типослепая: устойчивость'] = +(сумма / 4).toFixed(3);

    const пары = new Set();
    for (const [a, lst] of базовые) for (const [b] of lst) пары.add([a, b].sort().join('|'));
    const со = [...пары].filter(p => естьСвязь.has(p));
    let выжили = 0;
    for (const p of со) {
      const [x, y] = p.split('|');
      const ост = A.DATA.relations.filter(r => [r.source, r.target].sort().join('|') !== p);
      const ш = типослепаяШесть(ост, false, null).шест;
      const вx = (ш.get(x) || []).some(([q]) => q === y);
      const вy = (ш.get(y) || []).some(([q]) => q === x);
      if (вx || вy) выжили++;
    }
    итог.медленное['типослепая: переживают удаление ребра'] =
      { выжили, из: со.length, доля: со.length ? +(выжили / со.length).toFixed(3) : 0 };
  }
  return итог;
};

// ── запуск ──────────────────────────────────────────────────────────
const browser = await puppeteer.launch({
  executablePath: БРАУЗЕР, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));

await page.goto(BASE + страница, { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));
if (страница.startsWith('_ref')) {
  // СТОРОНА ИСХОДНИКА: пространств имён там нет — они появляются только при
  // разбивке. `window.__app = window` даёт лишь то, что объявлено через var
  // или function; всё, объявленное через let и const, в window НЕ ПОПАДАЕТ.
  // Но оно ВИДНО ИЗНУТРИ страницы: верхнеуровневые let живут в глобальном
  // лексическом окружении, и eval в глобальной области их достаёт. Поэтому
  // прослойка собирается через eval — иначе прибор годился бы только для
  // сборки, а сличать стороны было бы нечем.
  await page.evaluate(() => {
    const взять = имя => { try { return eval(имя); } catch (e) { return undefined; } };
    const A = {
      DATA: { get concepts() { return взять('concepts'); },
              get relations() { return взять('relations'); },
              get philosophers() { return взять('philosophers'); } },
      S: { get _philosopherMap() { return взять('_philosopherMap'); } },
      MET: { traditionBridgingIndex: (...a) => взять('traditionBridgingIndex')(...a) },
    };
    for (const имя of ['profileSimilarity', 'structuralSimilarity', 'profileIsMeaningful',
                       'medianNodeDegree', 'nodeDegreeOf', 'isSymmetricLink',
                       'similarityData', 'initializePhilosophyMetrics',
                       'philosopherSimilarity', 'philosopherSimilarityData']) {
      const f = взять(имя);
      if (typeof f === 'function') A[имя] = (...a) => взять(имя)(...a);
    }
    window.__app = A; window.__appReady = true;
  });
} else {
  await page.addScriptTag({ type: 'module', content: "import './_probe-rig.js';" });
  await page.waitForFunction('window.__appReady === true', { timeout: 20000 });
}
await new Promise(r => setTimeout(r, 1500));

// Метрики строятся при первом обращении и не мгновенно.
await page.evaluate(() => { if (window.__app.similarityData) window.__app.similarityData(); });

const итог = await page.evaluate(В_БРАУЗЕРЕ, МЕДЛЕННО);
await browser.close();

итог.отпечатокБазы = отпечатокБазы();
итог.страница = страница;
итог.ошибокСтраницы = ошибки.length;

// ── снимок для эталона: ПЛОСКИЙ ─────────────────────────────────────
// baseline.mjs сверяет ключи верхнего уровня через JSON.stringify. Вложенный
// объект сравнился бы целиком, и отчёт сказал бы «мера такая-то разошлась»,
// не назвав, ЧЕМ именно. Раскладываем по одному ключу на величину: тогда
// расхождение показывает пальцем.
//
// Служебное — страница, число ошибок, отпечаток базы — уходит под двойное
// подчёркивание: такие ключи baseline.mjs из сверки исключает. Отпечаток
// сверять нельзя, иначе всякая правка описания роняла бы приёмку, а он
// именно для того и вычеркнут из хеша, чтобы её не ронять.
const снимок = { __страница: страница, __ошибок: ошибки.length,
                 __отпечатокБазы: итог.отпечатокБазы };
for (const [имя, з] of Object.entries(итог.меры)) {
  снимок[имя + ' ▸ пар'] = з.пар;
  снимок[имя + ' ▸ со связью'] = з.соСвязью;
  снимок[имя + ' ▸ межтрадиционных'] = `${з.межтрадиционных}/${з.межфилософских}`;
  снимок[имя + ' ▸ ро'] = з.ро;
  снимок[имя + ' ▸ насыщение'] = з.насыщение;
  снимок[имя + ' ▸ источников'] = з.источников;
}
снимок['фон ▸ межтрадиционных'] = `${итог.фон.межтрадиционных}/${итог.фон.парФилософов}`;
if (итог.медленное) for (const [k, v] of Object.entries(итог.медленное))
  снимок['медленное ▸ ' + k] = typeof v === 'object' ? JSON.stringify(v) : v;
итог.__снимок = снимок;

if (ошибки.length) {
  console.error('ОШИБКИ СТРАНИЦЫ:', ошибки.slice(0, 3).join(' | '));
}

if (выход && !выход.startsWith('--')) {
  fs.writeFileSync(выход, JSON.stringify(снимок, null, 1));
  fs.writeFileSync(выход.replace(/\.json$/, '') + '.полный.json', JSON.stringify(итог, null, 1));
}

console.log(`типослепая мера, ${страница}; отпечаток базы ${итог.отпечатокБазы}` +
  `; ошибок страницы ${ошибки.length}`);
console.log('фон: пар философов ' + итог.фон.парФилософов +
  ', межтрадиционных ' + итог.фон.межтрадиционных + ' = ' + (итог.фон.доля * 100).toFixed(1) + ' %');
for (const [имя, з] of Object.entries(итог.меры)) {
  const дол = з.межфилософских ? (100 * з.межтрадиционных / з.межфилософских).toFixed(1) : '—';
  console.log(`  ${имя.padEnd(34)} источников ${String(з.источников).padStart(3)}` +
    ` | пар ${String(з.пар).padStart(4)} | со связью ${String(з.соСвязью).padStart(3)}` +
    ` | межтрад ${String(з.межтрадиционных).padStart(3)}/${String(з.межфилософских).padStart(3)} = ${дол} %` +
    ` | ро ${String(з.ро).padStart(6)} | насыщение ${з.насыщение}`);
}
if (итог.медленное) {
  console.log('  медленное:');
  for (const [k, v] of Object.entries(итог.медленное))
    console.log(`    ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
}
process.exit(ошибки.length ? 1 : 0);
