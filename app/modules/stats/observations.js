// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { S } from '../core/ns.js';
import { api, serverMode } from '../core/api.js';
import { FORMULA_VERSIONS } from '../metrics/philosophical.js';
import { VIEW_METRIC, effectiveScopeFlags, metricsNodes } from '../metrics/scope-select.js';
import { escapeAttr } from '../util/html.js';

function observationBar(viewName) {
      const metric = VIEW_METRIC[viewName];
      if (!serverMode || !metric) return '';
      const flags = effectiveScopeFlags(viewName);
      return `
        <div class="observation-bar">
          <span class="observation-conditions">${escapeAttr(
            'условия: веса ' + (flags.weights ? '✓' : '✗')
            + ' · направленность ' + (flags.direction ? '✓' : '✗')
            + ' · охват ' + (S.metricsScopeActive ? 'частичный' : 'вся база'))}</span>
          <input type="text" id="observationNote" maxlength="300"
                 placeholder="зачем замеряете (необязательно)">
          <button class="observation-save"
                  data-act-click="save-observation" data-a1="${escapeAttr(viewName)}">Запомнить замер</button>
          <span class="observation-said" id="observationSaid"></span>
        </div>`;
    }

function observationValues(viewName) {
      const lines = [...document.querySelectorAll('#statsContentArea tbody tr')];
      const numbers = [];
      const top = [];
      for (const tr of lines) {
        const cells = tr.querySelectorAll('td');
        if (cells.length < 2) continue;
        const cellNumber = parseFloat(String(cells[cells.length - 1].textContent).replace(',', '.'));
        if (!Number.isFinite(cellNumber)) continue;
        numbers.push(cellNumber);
        if (top.length < 20) top.push({ имя: cells[0].textContent.trim(), значение: cellNumber });
      }
      if (!numbers.length) return null;
      const ascending = [...numbers].sort((а, б) => а - б);
      const mean = numbers.reduce((с, z2) => с + z2, 0) / numbers.length;
      return {
        top: top,
        summary: {
          mean: +mean.toFixed(6),
          median: +ascending[Math.floor(ascending.length / 2)].toFixed(6),
          spread: +Math.sqrt(numbers.reduce((с, z3) => с + (z3 - mean) ** 2, 0)
                             / numbers.length).toFixed(6),
          nonzero: numbers.filter(z4 => z4 !== 0).length,
          count: numbers.length,
        },
      };
    }

async function saveObservation(viewName) {
      const say = t => {
        const saidBox = document.getElementById('observationSaid');
        if (saidBox) saidBox.textContent = t;
      };
      const metric = VIEW_METRIC[viewName];
      const values = observationValues(viewName);
      if (!values) { say('Нечего запоминать: в этом виде нет чисел'); return; }
      const flags = effectiveScopeFlags(viewName);
      const reply = await api('/api/metrics/observations', { метод: 'POST', тело: {
        metric: metric,
        // Версия формулы приходит со страницей: её учреждает прибор
        // formula_probe, и он же стережёт, чтобы она не врала.
        formulaVersion: (FORMULA_VERSIONS && FORMULA_VERSIONS[metric]) || 1,
        flags: 'weights=' + (flags.weights ? 'on' : 'off')
             + ';direction=' + (flags.direction ? 'on' : 'off'),
        scope: S.metricsScopeActive ? metricsNodes().map(flagsNow => flagsNow.id) : [],
        scopeNote: S.metricsScopeActive ? 'частичный охват' : 'вся база',
        values: values,
        note: (document.getElementById('observationNote') || {}).value || null,
      } });
      say(reply.годно
        ? 'Запомнено при графе версии ' + reply.тело.data.graphVersion
        : 'Не удалось запомнить');
    }

let observationItems = [];

let observationPicked = [];

function generateObservationsContent() {
      // Содержимое подгружается ходом; пока идёт запрос — место под него.
      setTimeout(loadObservations, 0);
      return '<div id="observationsBody"><div class="empty-state">'
        + '<div class="empty-state-text">Читаю замеры…</div></div></div>';
    }

async function loadObservations() {
      const slot = document.getElementById('observationsBody');
      if (!slot) return;
      if (!serverMode) {
        // БЕЗ СЕРВЕРА РАЗДЕЛ ОБЪЯСНЯЕТ СЕБЯ, А НЕ ОТДЕЛЫВАЕТСЯ ОТКАЗОМ.
        // Прибор утверждений поймал первую редакцию: она умещалась в шесть
        // слов, и вкладка считалась пустой. Пустая вкладка и вкладка,
        // говорящая «здесь ничего нет и вот почему», — разные вещи.
        slot.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📌</div>'
          + '<div class="empty-state-text">Замеры хранит сервер</div>'
          + '<div class="empty-state-hint">Замер — это записанное значение метрики'
          + ' вместе с условиями, при которых оно получено: версия графа, версия'
          + ' формулы, учёт весов и направленности, охват. Условия хранятся затем,'
          + ' чтобы числа можно было сравнивать: два замера сличаются, только если'
          + ' у них совпало всё, кроме версии графа. Без сервера записывать замеры'
          + ' некуда — страница считает метрики заново при каждом открытии и'
          + ' ничего о прошлых значениях не помнит.</div></div>';
        return;
      }
      const reply = await api('/api/metrics/observations?limit=50');
      observationItems = (reply.годно && reply.тело.data && reply.тело.data.items) || [];
      renderObservations();
    }

function renderObservations() {
      const slot = document.getElementById('observationsBody');
      if (!slot) return;
      if (!observationItems.length) {
        slot.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📌</div>'
          + '<div class="empty-state-text">Замеров пока нет</div>'
          + '<div class="empty-state-hint">Откройте вид метрики и нажмите'
          + ' «Запомнить замер»</div></div>';
        return;
      }
      // УСЛОВИЯ ПИШУТСЯ СЛОВАМИ, А НЕ ОТПЕЧАТКОМ. Отпечаток охвата годен для
      // сравнения машиной, но человеку он не говорит ничего.
      slot.innerHTML = '<div class="obs-list">' + observationItems.map(z => {
        const picked = observationPicked.includes(z.observationId);
        const summary = (z.values && z.values.summary) || {};
        return `<div class="obs-item${picked ? ' picked' : ''}"
                     data-act-click="pick-observation" data-a1="${escapeAttr(z.observationId)}">
          <div class="obs-head">${escapeAttr(z.metric)}
            <span class="obs-when">граф v${z.graphVersion} · формула v${z.formulaVersion}</span>
          </div>
          <div class="obs-conditions">${escapeAttr(z.flags)} · охват: ${
            escapeAttr(z.scopeNote || 'не назван')} · ${escapeAttr(z.authorName || '')}</div>
          ${z.note ? `<div class="obs-note">${escapeAttr(z.note)}</div>` : ''}
          <div class="obs-summary">среднее ${summary.mean ?? '—'} · медиана ${
            summary.median ?? '—'} · разброс ${summary.spread ?? '—'}</div>
        </div>`;
      }).join('') + '</div>'
      + '<div class="obs-compare" id="obsCompare">'
      + (observationPicked.length === 2
          ? '<div class="empty-state-hint">Сличаю…</div>'
          : `<div class="empty-state-hint">Выбрано ${observationPicked.length} из 2 —
             отметьте два замера, чтобы сличить</div>`)
      + '</div>';
      if (observationPicked.length === 2) compareObservationsInPanel();
    }

function pickObservation(id) {
      const alreadyAt = observationPicked.indexOf(id);
      if (alreadyAt >= 0) observationPicked.splice(alreadyAt, 1);
      else if (observationPicked.length < 2) observationPicked.push(id);
      else observationPicked = [observationPicked[1], id];
      renderObservations();
    }

async function compareObservationsInPanel() {
      const slot = document.getElementById('obsCompare');
      if (!slot) return;
      const [а, б] = observationPicked;
      const reply = await api('/api/metrics/compare?a=' + encodeURIComponent(а)
        + '&b=' + encodeURIComponent(б));
      if (!reply.годно) { slot.innerHTML = '<div class="commits-error">Не вышло сличить</div>'; return; }
      const verdict = reply.тело.data;
      if (!verdict.сравнимы) {
        slot.innerHTML = '<div class="obs-refusal"><b>Сравнивать нельзя</b><div>'
          + escapeAttr(verdict.почему) + '</div>'
          + (verdict.разошлось || []).map(р => `<div class="obs-diff">${escapeAttr(р.что)}:
             у первого ${escapeAttr(String(р.у_первого))},
             у второго ${escapeAttr(String(р.у_второго))}</div>`).join('')
          + '</div>';
        return;
      }
      const lines = Object.entries(verdict.сводка || {}).map(([имя, z]) =>
        `<tr><td>${escapeAttr(имя)}</td><td>${z.было ?? '—'}</td><td>${z.стало ?? '—'}</td>
         <td class="${Number(z.разница) > 0 ? 'obs-up' : Number(z.разница) < 0 ? 'obs-down' : ''}">${
           z.разница == null ? '—' : (z.разница > 0 ? '+' : '') + z.разница}</td></tr>`).join('');
      slot.innerHTML = `<div class="obs-verdict">${escapeAttr(verdict.метрика)}:
          граф v${verdict.раньше.graphVersion} → v${verdict.позже.graphVersion},
          условия совпали</div>
        <table class="obs-table"><thead><tr><th>величина</th><th>было</th>
          <th>стало</th><th>разница</th></tr></thead><tbody>${lines}</tbody></table>`;
    }

export { generateObservationsContent, observationBar, pickObservation, saveObservation };
