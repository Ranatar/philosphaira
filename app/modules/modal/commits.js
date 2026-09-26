// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { emit } from '../core/events.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { PERM, can } from '../core/perms.js';
import { pullGraphSince } from '../data/remote.js';
import { conflictRowsHtml, conflictValue } from './conflict.js';
import { PROVENANCE_STATES } from './forms.js';

import { FOOTNOTE_LABELS, escapeAttr, richText } from '../util/html.js';

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

function switchCommitTab(tab) {
      // Вкладка выбирается ПО ПРАВУ, а не по названию: нажатие на скрытую
      // кнопку (или зов из консоли) не должен открывать чужое.
      if (tab === 'layout' && can(PERM.RELAYOUT_GRAPH)) commitTab = 'layout';
      else if (tab === 'pending' && can(PERM.REVIEW_COMMIT)) commitTab = 'pending';
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
      const targetItem = layoutHistoryItems.find(item => String(item.id) === String(id));
      layoutRevertTo = targetItem || null;
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

const CHANGE_FIELD_LABELS = { label: 'название', name: 'имя', nameRu: 'имя по-русски',
      description: 'описание', extendedDescription: 'полное описание', philosopher: 'философ',
      rubrics: 'рубрики', traditions: 'традиции', type: 'тип', weight: 'вес', bidirectional: 'двусторонняя',
      source: 'от', target: 'к', birth: 'рождение', death: 'смерть', years: 'годы', color: 'цвет' };

const CHANGE_KIND_LABELS = { concept: 'концепция', relation: 'связь', philosopher: 'философ',
      tradition: 'традиция', rubric: 'рубрика', relationType: 'тип связи' };

function changesDiff(changes) {
      const own = new Set(['provenance', 'provenanceStatus', 'footnotes']);
      const show = (field, v) => (v == null || v === '') ? '—'
        : (field === 'description' || field === 'extendedDescription') ? richText(v) : escapeAttr(conflictValue(v));
      const blocks = (changes || []).map(change => {
        const head = escapeAttr((CHANGE_KIND_LABELS[change.kind] || change.kind) + ' ' + (change.entityId || ''))
          + ' · ' + (change.action === 'add' ? 'новая' : change.action === 'delete' ? 'удаление' : 'правка');
        if (change.action === 'delete') return '<div class="prov-diff-row"><span class="prov-diff-what">' + head + '</span></div>';
        const rows = Object.entries(change.fields || {})
          .filter(([f, v]) => !own.has(f) && JSON.stringify(v.base ?? null) !== JSON.stringify(v.next ?? null))
          .map(([f, v]) => '<div class="prov-diff-row">'
            + '<span class="prov-diff-what">' + escapeAttr(CHANGE_FIELD_LABELS[f] || f) + '</span>'
            + (change.action === 'add' ? '' : '<span class="prov-diff-was">было: ' + show(f, v.base) + '</span>')
            + '<span class="prov-diff-now">стало: ' + show(f, v.next) + '</span></div>');
        // правка одного лишь источника или сносок — её покажут свои разборы
        if (!rows.length && change.action === 'edit') return '';
        return '<div class="prov-diff-row"><span class="prov-diff-what">' + head + '</span></div>' + rows.join('');
      }).filter(Boolean);
      if (!blocks.length) return '';
      return '<div class="commit-changes"><div class="prov-diff-head">Правка</div>' + blocks.join('') + '</div>';
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

function footnotesDiff(changes) {
      const say = n => (FOOTNOTE_LABELS[n.status] || n.status)
        + (n.status === 'source_not_found' ? '' : ': ' + (n.text || '—'));
      const rows = [];
      for (const change of changes || []) {
        const f = (change.fields || {}).footnotes;
        if (!f) continue;
        const was = new Map((f.base || []).map(n => [n.id, n]));
        const now = new Map((f.next || []).map(n => [n.id, n]));
        const row = (what, a, b) => rows.push('<div class="prov-diff-row">'
          + '<span class="prov-diff-what">' + escapeAttr((change.entityId || '') + ' · ' + what) + '</span>'
          + '<span class="prov-diff-was">было: ' + escapeAttr(a) + '</span>'
          + '<span class="prov-diff-now">стало: ' + escapeAttr(b) + '</span></div>');
        for (const [id, n] of now) {
          if (!was.has(id)) row('сноска ' + id + ' добавлена', '—', say(n));
          else if (say(was.get(id)) !== say(n)) row('сноска ' + id + ' изменена', say(was.get(id)), say(n));
        }
        for (const [id, n] of was) if (!now.has(id)) row('сноска ' + id + ' убрана', say(n), '—');
      }
      if (!rows.length) return '';
      return '<div class="prov-diff"><div class="prov-diff-head">Сноски</div>' + rows.join('') + '</div>';
    }

function stateInWords(stateCode) {
      const found = PROVENANCE_STATES.find(([candidate]) => candidate === (stateCode || 'unspecified'));
      return found ? found[1] : String(stateCode);
    }

const LAYOUT_KINDS = Object.freeze({ full: 'полная', warm: 'доращённая' });

function layoutHistoryHtml() {
      if (!layoutHistoryItems.length) return '';
      const historyRows = layoutHistoryItems.map((item, i) => {
        const measure = item.расхождение && item.расхождение.медиана !== null
          ? `сдвиг ${item.расхождение.медиана} px` : 'первая';
        const whenText = item.когда ? new Date(item.когда).toLocaleString('ru-RU') : '';
        // У действующей раскладки кнопки возврата нет: возвращать к самой себе
        // нечего, а кнопка, которая ничего не делает, учит не доверять кнопкам.
        const buttonHtml = i === 0 ? '<span class="layout-current">действующая</span>'
          : `<button class="layout-revert" data-act-click="ask-layout-revert" data-a1="${escapeAttr(String(item.id))}">Вернуть</button>`;
        return `<li>№${escapeAttr(String(item.id))} · ${LAYOUT_KINDS[item.род] || escapeAttr(item.род)}`
             + ` · ${escapeAttr(measure)} · ${escapeAttr(whenText)} ${buttonHtml}</li>`;
      }).join('');
      return `<div class="layout-history"><b>Прежние раскладки</b><ul>${historyRows}</ul></div>`;
    }

function layoutTabHtml() {
      if (layoutError) return `<div class="commits-error">${escapeAttr(layoutError)}</div>`;

      // ВОЗВРАТ СПРАШИВАЕТ ПОДТВЕРЖДЕНИЯ, как и перекладка. Разница в том,
      // что здесь мера уже известна — она записана при создании раскладки.
      if (layoutRevertTo) {
        const diffMeasure = layoutRevertTo.расхождение;
        return `<div class="commits-empty">Вернуть раскладку №${escapeAttr(String(layoutRevertTo.id))}`
          + ` (${LAYOUT_KINDS[layoutRevertTo.род] || escapeAttr(layoutRevertTo.род)})?<br><br>`
          + (diffMeasure && diffMeasure.медиана !== null
              ? `Когда её сменили, узлы сдвинулись на ${diffMeasure.медиана} px по медиане.`
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
      const diffMeasure = layoutPlan.мера;
      if (!diffMeasure) {
        return '<div class="commits-empty">Раскладки ещё нет — эта будет первой,'
          + ' расходиться не с чем.</div>'
          + '<div class="modal-actions"><button data-act-click="apply-relayout">Применить</button></div>';
      }
      const farMoved = (layoutPlan.дальние || [])
        .map(moved => `<li>${escapeAttr(moved.id)} — ${moved.сдвиг} px</li>`).join('');
      return `<div class="commits-empty">`
        + `Медианный сдвиг узла: <b>${diffMeasure.медиана} px</b><br>`
        + `Узлов дальше 200 px: <b>${diffMeasure.далеко}</b> из ${diffMeasure.сверено}<br>`
        + `<br>Дальше всех уедут:<ul>${farMoved}</ul>`
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

      slot.innerHTML = commitItems.map(commit => {
        const reviewBtn = (commitTab === 'pending' && can(PERM.REVIEW_COMMIT))
          ? `<button class="commit-approve" data-id="${escapeAttr(commit.commitId)}">Одобрить</button>`
          + `<button class="commit-reject" data-id="${escapeAttr(commit.commitId)}">Отклонить</button>`
          : '';
        // Свой столкнувшийся коммит — пересобрать поверх нынешнего тем же
        // ходом, что из окна столкновения, с родством.
        const rebuild = (commitTab === 'mine' && commit.status === 'conflicted' && commit.changes && commit.changes.length)
          ? `<button class="commit-rebuild" data-id="${escapeAttr(commit.commitId)}">Пересобрать поверх нынешнего</button>`
          : '';
        const revert = (commit.status === 'applied' && can(PERM.REVERT_COMMIT))
          ? `<button class="commit-revert" data-id="${escapeAttr(commit.commitId)}">Откатить</button>`
          : '';
        // ПРИЧИНА ОТКАЗА ПОКАЗЫВАЕТСЯ АВТОРУ. Она хранилась (review_comment),
        // но наружу не выходила: рецензент писал в пустоту.
        const reason = (commit.status === 'rejected' && commit.reviewComment)
          ? `<div class="commit-why">Причина отказа: ${escapeAttr(commit.reviewComment)}</div>`
          : '';
        // РОДСТВО ПОКАЗЫВАЕТСЯ КОРОТКО, но показывается: без него история
        // правки распадается на несвязанные попытки, и не видно, что три
        // похожих коммита — это три захода на одно и то же.
        const supersedesLine = commit.supersedes
          ? '<div class="commit-what">Взамен правки '
            + escapeAttr(String(commit.supersedes).slice(0, 8)) + '…</div>'
          : '';
        // ЧТО РАЗОШЛОСЬ — АВТОРУ ВИДНО. Сервер хранит столкновения коммита
        // (conflicts), а панель выводила одно «пересоберите»: автор узнавал
        // причину, лишь открыв форму заново, — а у столкновения по правилу
        // (сноски, источник) не узнавал вовсе.
        const breakdown = (commit.status === 'conflicted')
          ? '<div class="commit-why">Пересоберите правку поверх нынешнего состояния.</div>'
            + (commit.conflicts && commit.conflicts.length
                ? '<div class="commit-conflicts">' + conflictRowsHtml(commit.conflicts) + '</div>' : '')
          : '';
        // Если автор объяснил — крупно идёт ЗАЧЕМ, а машинный адрес мелко
        // под ним. Не объяснил — заголовком служит адрес: он всегда есть.
        const why = commit.authorComment ? String(commit.authorComment).trim() : '';
        const head = why
          ? `<div class="commit-msg">${escapeAttr(why)}</div>`
            + `<div class="commit-what">${escapeAttr(commit.message || '')}</div>`
          : `<div class="commit-msg">${escapeAttr(commit.message || '')}</div>`;
        // ПОСЛЕДСТВИЯ СПРАШИВАЮТСЯ, А НЕ ПОКАЗЫВАЮТСЯ СРАЗУ. Счёт идёт по
        // всему графу, и тянуть его для каждой записи очереди значило бы
        // класть на сервер работу, которой никто не просил. Кнопка есть у
        // всех, кому виден сам коммит: право то же.
        const impactButton = `<button class="commit-impact-btn" `
          + `data-id="${escapeAttr(commit.commitId)}">Последствия</button>`;
        return '<div class="commit-item">'
          + head
          + changesDiff(commit.changes)
          + provenanceDiff(commit.changes)
          + footnotesDiff(commit.changes)
          + `<div class="commit-meta">${escapeAttr(commit.authorName || '')} · `
          + `<span class="commit-state state-${commitStateKind(commit.status)}">`
          + `${escapeAttr(commitStateWords(commit.status))}</span></div>`
          + supersedesLine + reason + breakdown
          + `<div class="commit-impact" data-for="${escapeAttr(commit.commitId)}"></div>`
          + impactButton + reviewBtn + revert + rebuild + '</div>';
      }).join('');
    }

function refreshEditCount(count) {
      const slot = document.getElementById('commitsCount');
      if (!slot) return;
      slot.textContent = count
        ? `${count} ${count === 1 ? 'правка' : (count < 5 ? 'правки' : 'правок')}`
        : '';
    }

async function reviewCommitFromPanel(id, verdict) {
      const comment = verdict === 'reject'
        ? prompt('Причина отказа (обязательна):') : null;
      if (verdict === 'reject' && !comment) return;
      const reply = await api('/api/commits/' + encodeURIComponent(id) + '/review',
        // ОТПЕЧАТОК УВИДЕННОГО: сервер откажет (409), если автор успел
        // поправить коммит после того, как очередь была загружена.
        { метод: 'POST', тело: { action: verdict, comment: comment,
          digest: ((commitItems.find(c => String(c.commitId) === String(id)) || {}).digest) || null } });
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
          + goneConcepts.slice(0, 5).map(node => escapeAttr(node.label || node.id)).join(', ')
          + (goneConcepts.length > 5 ? ' и ещё ' + (goneConcepts.length - 5) : ''));
      }
      if (goneRelations.length) {
        lines.push('Исчезнут связи: ' + goneRelations.length
          + (data.cascaded ? ' (из них ' + data.cascaded + ' — вместе с концами)' : ''));
      }
      if ((data.orphaned || []).length) {
        lines.push('Останутся без связей: '
          + data.orphaned.slice(0, 5).map(node => escapeAttr(node.label || node.id)).join(', ')
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
