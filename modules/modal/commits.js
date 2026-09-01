// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { emit } from '../core/events.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { PERM, can } from '../core/perms.js';
import { pullGraphSince } from '../data/remote.js';
import { PROVENANCE_STATES } from './forms.js';

import { escapeAttr } from '../util/html.js';

let commitTab = 'mine';

let commitItems = [];

let commitError = '';

function openCommitsPanel() {
      const modal = document.getElementById('commitsModal');
      if (!modal) return;
      modal.style.display = 'flex';
      loadCommits();
    }

function closeCommitsPanel() {
      const modal = document.getElementById('commitsModal');
      if (modal) modal.style.display = 'none';
    }

function switchCommitTab(вкладка) {
      // Вкладка выбирается ПО ПРАВУ, а не по названию: нажатие на скрытую
      // кнопку (или зов из консоли) не должен открывать чужое.
      if (вкладка === 'layout' && can(PERM.RELAYOUT_GRAPH)) commitTab = 'layout';
      else if (вкладка === 'pending' && can(PERM.REVIEW_COMMIT)) commitTab = 'pending';
      else commitTab = 'mine';
      if (commitTab === 'layout') {
        layoutPlan = null; layoutError = ''; layoutRevertTo = null;
        renderCommits();
        loadLayoutHistory();
        return;
      }
      loadCommits();
    }

let layoutPlan = null;

let layoutError = '';

async function planRelayout() {
      layoutError = '';
      const reply = await api('/api/layout/plan', { метод: 'POST' });
      if (!reply.годно) {
        layoutPlan = null;
        layoutError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Не удалось посчитать';
      } else {
        layoutPlan = (reply.тело && reply.тело.data) || null;
      }
      renderCommits();
    }

let layoutHistoryItems = [];

async function loadLayoutHistory() {
      const reply = await api('/api/layout/history');
      layoutHistoryItems = (reply.годно && reply.тело && reply.тело.data) || [];
      renderCommits();
    }

let layoutRevertTo = null;

function cancelLayoutRevert() { layoutRevertTo = null; renderCommits(); }

function askLayoutRevert(id) {
      const цель = layoutHistoryItems.find(л => String(л.id) === String(id));
      layoutRevertTo = цель || null;
      renderCommits();
    }

async function doLayoutRevert() {
      if (!layoutRevertTo) return;
      layoutError = '';
      const reply = await api('/api/layout/' + encodeURIComponent(layoutRevertTo.id) + '/revert',
        { метод: 'POST' });
      if (!reply.годно) {
        layoutError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Не удалось вернуть';
      } else {
        layoutRevertTo = null;
        layoutPlan = null;
        showTemporaryMessage('Раскладка возвращена', 4000);
        pullGraphSince();
        await loadLayoutHistory();
        return;
      }
      renderCommits();
    }

async function applyRelayout() {
      if (!layoutPlan) return;
      layoutError = '';
      // Версия отправляется ТА, по которой человек принимал решение. Сервер
      // считает заново и откажется, если граф успел измениться: иначе
      // применилась бы раскладка не того графа, а увиденная мера оказалась
      // бы чужой.
      const reply = await api('/api/layout/apply', { метод: 'POST',
        тело: { версия: layoutPlan.версия } });
      if (!reply.годно) {
        layoutError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Не удалось применить';
      } else {
        layoutPlan = null;
        showTemporaryMessage('Раскладка переучреждена', 4000);
        // Свежие координаты придут обычным путём — с приращением графа.
        pullGraphSince();
        await loadLayoutHistory();
        return;
      }
      renderCommits();
    }

async function loadCommits() {
      commitError = '';
      const path = commitTab === 'pending' ? '/api/commits/pending' : '/api/commits';
      const reply = await api(path);
      if (!reply.годно) {
        commitItems = [];
        commitError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Не удалось получить список';
      } else {
        const body = reply.тело || {};
        commitItems = (body.data && body.data.items) || body.items || [];
      }
      renderCommits();
      return commitItems;
    }

const COMMIT_STATES = Object.freeze({
      pending:    { слово: 'ждёт рассмотрения',  вид: 'ждёт' },
      applied:    { слово: 'применён',           вид: 'применён' },
      coincided:  { слово: 'то же уже внесли',   вид: 'совпал' },
      rejected:   { слово: 'отклонён',           вид: 'отклонён' },
      conflicted: { слово: 'столкнулся с чужим', вид: 'столкнулся' },
      reverted:   { слово: 'отменён',            вид: 'отменён' },
    });

function commitStateWords(state2) {
      return (COMMIT_STATES[state2] || {}).слово || state2;
    }

function commitStateKind(state2) {
      return (COMMIT_STATES[state2] || {}).вид || 'прочее';
    }

function provenanceDiff(changes) {
      const rows = [];
      for (const change of changes || []) {
        const fields2 = change.fields || {};
        const line = fields2.provenance;
        const state2 = fields2.provenanceStatus;
        if (!line && !state2) continue;
        const prevSide = [
          state2 ? stateInWords(state2.base) : null,
          line ? (line.base || '—') : null,
        ].filter(Boolean).join(': ');
        const nextSide = [
          state2 ? stateInWords(state2.next) : null,
          line ? (line.next || '—') : null,
        ].filter(Boolean).join(': ');
        // ТЕКСТ РЯДОМ, ЕСЛИ ТРОНУТ И ОН: разбирать основание в отрыве от
        // формулировки, к которой оно относится, — то же, что читать ответ
        // без вопроса.
        const textToo = ('description' in fields2) || ('extendedDescription' in fields2);
        rows.push('<div class="prov-diff-row">'
          + '<span class="prov-diff-what">' + escapeAttr(change.entityId || '') + '</span>'
          + '<span class="prov-diff-was">было: ' + escapeAttr(prevSide || '—') + '</span>'
          + '<span class="prov-diff-now">стало: ' + escapeAttr(nextSide || '—') + '</span>'
          + (textToo
              ? '<span class="prov-diff-warn">текст изменён вместе с основанием</span>'
              : '<span class="prov-diff-warn">изменено ТОЛЬКО основание</span>')
          + '</div>');
      }
      if (!rows.length) return '';
      return '<div class="prov-diff"><div class="prov-diff-head">Основание</div>'
        + rows.join('') + '</div>';
    }

function stateInWords(код) {
      const found = PROVENANCE_STATES.find(([к]) => к === (код || 'unspecified'));
      return found ? found[1] : String(код);
    }

const LAYOUT_KINDS = Object.freeze({ full: 'полная', warm: 'доращённая' });

function layoutHistoryHtml() {
      if (!layoutHistoryItems.length) return '';
      const строки = layoutHistoryItems.map((л, i) => {
        const мера = л.расхождение && л.расхождение.медиана !== null
          ? `сдвиг ${л.расхождение.медиана} px` : 'первая';
        const когда = л.когда ? new Date(л.когда).toLocaleString('ru-RU') : '';
        // У действующей раскладки кнопки возврата нет: возвращать к самой себе
        // нечего, а кнопка, которая ничего не делает, учит не доверять кнопкам.
        const кнопка = i === 0 ? '<span class="layout-current">действующая</span>'
          : `<button class="layout-revert" data-act-click="ask-layout-revert" data-a1="${escapeAttr(String(л.id))}">Вернуть</button>`;
        return `<li>№${escapeAttr(String(л.id))} · ${LAYOUT_KINDS[л.род] || escapeAttr(л.род)}`
             + ` · ${escapeAttr(мера)} · ${escapeAttr(когда)} ${кнопка}</li>`;
      }).join('');
      return `<div class="layout-history"><b>Прежние раскладки</b><ul>${строки}</ul></div>`;
    }

function layoutTabHtml() {
      if (layoutError) return `<div class="commits-error">${escapeAttr(layoutError)}</div>`;

      // ВОЗВРАТ СПРАШИВАЕТ ПОДТВЕРЖДЕНИЯ, как и перекладка. Разница в том,
      // что здесь мера уже известна — она записана при создании раскладки.
      if (layoutRevertTo) {
        const м = layoutRevertTo.расхождение;
        return `<div class="commits-empty">Вернуть раскладку №${escapeAttr(String(layoutRevertTo.id))}`
          + ` (${LAYOUT_KINDS[layoutRevertTo.род] || escapeAttr(layoutRevertTo.род)})?<br><br>`
          + (м && м.медиана !== null
              ? `Когда её сменили, узлы сдвинулись на ${м.медиана} px по медиане.`
                + ` Возврат сдвинет их примерно настолько же — обратно.`
              : 'Это первая раскладка графа.')
          + `<br>Прежняя не пропадёт: возврат записывается новой строкой, и вернуться`
          + ` можно будет и к нынешней.</div>`
          + `<div class="modal-actions">`
          + `<button data-act-click="do-layout-revert">Вернуть</button>`
          + `<button data-act-click="cancel-layout-revert">Отмена</button>`
          + `</div>`;
      }

      if (!layoutPlan) {
        return '<div class="commits-empty">Перекладка переставит узлы графа заново.'
          + ' Сперва посчитаем, насколько картина разойдётся с нынешней.</div>'
          + '<div class="modal-actions"><button data-act-click="plan-relayout">Посчитать</button></div>'
          + layoutHistoryHtml();
      }
      const м = layoutPlan.мера;
      if (!м) {
        return '<div class="commits-empty">Раскладки ещё нет — эта будет первой,'
          + ' расходиться не с чем.</div>'
          + '<div class="modal-actions"><button data-act-click="apply-relayout">Применить</button></div>';
      }
      const дальние = (layoutPlan.дальние || [])
        .map(у => `<li>${escapeAttr(у.id)} — ${у.сдвиг} px</li>`).join('');
      return `<div class="commits-empty">`
        + `Медианный сдвиг узла: <b>${м.медиана} px</b><br>`
        + `Узлов дальше 200 px: <b>${м.далеко}</b> из ${м.сверено}<br>`
        + `<br>Дальше всех уедут:<ul>${дальние}</ul>`
        + `<br>При медиане в сотню пикселей привычная картина графа перестанет`
        + ` узнаваться — у всех сразу. Прежняя раскладка сохранится, вернуть её`
        + ` можно, но ориентировку это вернёт не сразу.`
        + `</div>`
        + `<div class="modal-actions">`
        + `<button data-act-click="apply-relayout">Применить</button>`
        + `<button data-act-click="plan-relayout">Пересчитать</button>`
        + `</div>`
        + layoutHistoryHtml();
    }

function renderCommits() {
      const slot = document.getElementById('commitsBody');
      if (!slot) return;

      const tabs = document.getElementById('commitsTabs');
      if (tabs) {
        // Вкладки рисуются ПО ПРАВУ, а не по роли.
        const queue = tabs.querySelector('[data-tab="pending"]');
        if (queue) queue.style.display = can(PERM.REVIEW_COMMIT) ? '' : 'none';
        const lay = tabs.querySelector('[data-tab="layout"]');
        if (lay) lay.style.display = can(PERM.RELAYOUT_GRAPH) ? '' : 'none';
      }

      if (commitTab === 'layout') { slot.innerHTML = layoutTabHtml(); return; }

      if (commitError) {
        slot.innerHTML = `<div class="commits-error">${escapeAttr(commitError)}</div>`;
        return;
      }
      if (!commitItems.length) {
        slot.innerHTML = '<div class="commits-empty">Пусто</div>';
        refreshEditCount(0);
        return;
      }
      refreshEditCount(commitItems.length);

      slot.innerHTML = commitItems.map(к => {
        const reviewBtn = (commitTab === 'pending' && can(PERM.REVIEW_COMMIT))
          ? `<button class="commit-approve" data-id="${escapeAttr(к.commitId)}">Одобрить</button>`
          + `<button class="commit-reject" data-id="${escapeAttr(к.commitId)}">Отклонить</button>`
          : '';
        const revert = (к.status === 'applied' && can(PERM.REVERT_COMMIT))
          ? `<button class="commit-revert" data-id="${escapeAttr(к.commitId)}">Откатить</button>`
          : '';
        // ПРИЧИНА ОТКАЗА ПОКАЗЫВАЕТСЯ АВТОРУ. Она хранилась (review_comment),
        // но наружу не выходила: рецензент писал в пустоту.
        const reason = (к.status === 'rejected' && к.reviewComment)
          ? `<div class="commit-why">Причина отказа: ${escapeAttr(к.reviewComment)}</div>`
          : '';
        // РОДСТВО ПОКАЗЫВАЕТСЯ КОРОТКО, но показывается: без него история
        // правки распадается на несвязанные попытки, и не видно, что три
        // похожих коммита — это три захода на одно и то же.
        const supersedesLine = к.supersedes
          ? '<div class="commit-what">Взамен правки '
            + escapeAttr(String(к.supersedes).slice(0, 8)) + '…</div>'
          : '';
        const breakdown = (к.status === 'conflicted')
          ? '<div class="commit-why">Пересоберите правку поверх нынешнего состояния.</div>'
          : '';
        // Если автор объяснил — крупно идёт ЗАЧЕМ, а машинный адрес мелко
        // под ним. Не объяснил — заголовком служит адрес: он всегда есть.
        const why = к.authorComment ? String(к.authorComment).trim() : '';
        const head = why
          ? `<div class="commit-msg">${escapeAttr(why)}</div>`
            + `<div class="commit-what">${escapeAttr(к.message || '')}</div>`
          : `<div class="commit-msg">${escapeAttr(к.message || '')}</div>`;
        // ПОСЛЕДСТВИЯ СПРАШИВАЮТСЯ, А НЕ ПОКАЗЫВАЮТСЯ СРАЗУ. Счёт идёт по
        // всему графу, и тянуть его для каждой записи очереди значило бы
        // класть на сервер работу, которой никто не просил. Кнопка есть у
        // всех, кому виден сам коммит: право то же.
        const impactButton = `<button class="commit-impact-btn" `
          + `data-id="${escapeAttr(к.commitId)}">Последствия</button>`;
        return '<div class="commit-item">'
          + head
          + provenanceDiff(к.changes)
          + `<div class="commit-meta">${escapeAttr(к.authorName || '')} · `
          + `<span class="commit-state state-${commitStateKind(к.status)}">`
          + `${escapeAttr(commitStateWords(к.status))}</span></div>`
          + supersedesLine + reason + breakdown
          + `<div class="commit-impact" data-for="${escapeAttr(к.commitId)}"></div>`
          + impactButton + reviewBtn + revert + '</div>';
      }).join('');
    }

function refreshEditCount(сколько) {
      const slot = document.getElementById('commitsCount');
      if (!slot) return;
      slot.textContent = сколько
        ? `${сколько} ${сколько === 1 ? 'правка' : (сколько < 5 ? 'правки' : 'правок')}`
        : '';
    }

async function reviewCommitFromPanel(id, решение) {
      const comment = решение === 'reject'
        ? prompt('Причина отказа (обязательна):') : null;
      if (решение === 'reject' && !comment) return;
      const reply = await api('/api/commits/' + encodeURIComponent(id) + '/review',
        { метод: 'POST', тело: { action: решение, comment: comment } });
      if (!reply.годно) {
        // ОТКАЗ ПОКАЗЫВАЕТСЯ, а не проглатывается.
        commitError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Сервер отказал';
        renderCommits();
        return;
      }
      await pullGraphSince();
      await loadCommits();
      emit('session-changed');   // счёт непрочитанного мог измениться
    }

async function revertCommitFromPanel(id) {
      const reason = prompt('Причина отката (обязательна):');
      if (!reason) return;
      const reply = await api('/api/commits/' + encodeURIComponent(id) + '/revert',
        { метод: 'POST', тело: { reason: reason } });
      if (!reply.годно) {
        commitError = (reply.тело && reply.тело.error && reply.тело.error.message)
                    || 'Сервер отказал';
        renderCommits();
        return;
      }
      await pullGraphSince();
      await loadCommits();
    }

async function showImpact(id) {
      // Перебором, а не селектором с подстановкой: CSS.escape в описи
      // сущностей страницы не значится, а собирать селектор из чужого
      // значения без него — способ однажды получить негодный селектор.
      const slot = [...document.querySelectorAll('.commit-impact')]
        .find(e => e.getAttribute('data-for') === id);
      if (!slot) return;
      if (slot.textContent.trim()) { slot.innerHTML = ''; return; }
      slot.innerHTML = '<div class="commit-why">Считаю…</div>';
      const reply = await api('/api/commits/' + encodeURIComponent(id) + '/impact');
      if (!reply.годно) {
        slot.innerHTML = '<div class="commits-error">Не удалось посчитать</div>';
        return;
      }
      slot.innerHTML = describeImpact(reply.тело.data);
    }

function describeImpact(data) {
      const lines = [];
      const gone = data.gone || {};
      const goneConcepts = gone.concepts || [];
      const goneRelations = gone.relations || [];
      if (goneConcepts.length) {
        lines.push('Исчезнут концепции: '
          + goneConcepts.slice(0, 5).map(к => escapeAttr(к.label || к.id)).join(', ')
          + (goneConcepts.length > 5 ? ' и ещё ' + (goneConcepts.length - 5) : ''));
      }
      if (goneRelations.length) {
        lines.push('Исчезнут связи: ' + goneRelations.length
          + (data.cascaded ? ' (из них ' + data.cascaded + ' — вместе с концами)' : ''));
      }
      if ((data.orphaned || []).length) {
        lines.push('Останутся без связей: '
          + data.orphaned.slice(0, 5).map(к => escapeAttr(к.label || к.id)).join(', ')
          + (data.orphaned.length > 5 ? ' и ещё ' + (data.orphaned.length - 5) : ''));
      }
      if (data.connectivity && data.connectivity.splits) {
        lines.push('Граф распадётся: кусков было ' + data.connectivity.before
          + ', станет ' + data.connectivity.after);
      }
      if (!lines.length) lines.push('Строение графа не изменится.');
      return '<div class="commit-why">' + lines.join('<br>') + '</div>';
    }

export { applyRelayout, askLayoutRevert, cancelLayoutRevert, closeCommitsPanel, commitError, commitItems, commitTab, doLayoutRevert, layoutHistoryItems, layoutPlan, layoutRevertTo, loadCommits, loadLayoutHistory, openCommitsPanel, planRelayout, revertCommitFromPanel, reviewCommitFromPanel, showImpact, switchCommitTab };
