// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { api } from '../core/api.js';
import { emit } from '../core/events.js';
import { PERM, can } from '../core/perms.js';
import { pullGraphSince } from '../data/remote.js';
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
      commitTab = (вкладка === 'pending' && can(PERM.REVIEW_COMMIT)) ? 'pending' : 'mine';
      loadCommits();
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

function commitStateWords(состояние) {
      return (COMMIT_STATES[состояние] || {}).слово || состояние;
    }

function commitStateKind(состояние) {
      return (COMMIT_STATES[состояние] || {}).вид || 'прочее';
    }

function renderCommits() {
      const slot = document.getElementById('commitsBody');
      if (!slot) return;

      const tabs = document.getElementById('commitsTabs');
      if (tabs) {
        // Вкладка очереди рисуется ПО ПРАВУ, а не по роли.
        const queue = tabs.querySelector('[data-tab="pending"]');
        if (queue) queue.style.display = can(PERM.REVIEW_COMMIT) ? '' : 'none';
      }

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

export { closeCommitsPanel, commitError, commitItems, commitTab, loadCommits, openCommitsPanel, revertCommitFromPanel, reviewCommitFromPanel, showImpact, switchCommitTab };
