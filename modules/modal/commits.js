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
      const окно = document.getElementById('commitsModal');
      if (!окно) return;
      окно.style.display = 'flex';
      loadCommits();
    }

function closeCommitsPanel() {
      const окно = document.getElementById('commitsModal');
      if (окно) окно.style.display = 'none';
    }

function switchCommitTab(вкладка) {
      commitTab = (вкладка === 'pending' && can(PERM.REVIEW_COMMIT)) ? 'pending' : 'mine';
      loadCommits();
    }

async function loadCommits() {
      commitError = '';
      const путь = commitTab === 'pending' ? '/api/commits/pending' : '/api/commits';
      const ответ = await api(путь);
      if (!ответ.годно) {
        commitItems = [];
        commitError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                    || 'Не удалось получить список';
      } else {
        const тело = ответ.тело || {};
        commitItems = тело.items || (тело.data && тело.data.items) || [];
      }
      renderCommits();
      return commitItems;
    }

function commitStateWords(состояние) {
      const словарь = {
        pending: 'ждёт рассмотрения', applied: 'применён',
        coincided: 'то же уже внесли', rejected: 'отклонён',
        conflicted: 'столкнулся с чужим', reverted: 'отменён',
      };
      return словарь[состояние] || состояние;
    }

function renderCommits() {
      const место = document.getElementById('commitsBody');
      if (!место) return;

      const вкладки = document.getElementById('commitsTabs');
      if (вкладки) {
        // Вкладка очереди рисуется ПО ПРАВУ, а не по роли.
        const очередь = вкладки.querySelector('[data-tab="pending"]');
        if (очередь) очередь.style.display = can(PERM.REVIEW_COMMIT) ? '' : 'none';
      }

      if (commitError) {
        место.innerHTML = `<div class="commits-error">${escapeAttr(commitError)}</div>`;
        return;
      }
      if (!commitItems.length) {
        место.innerHTML = '<div class="commits-empty">Пусто</div>';
        return;
      }

      место.innerHTML = commitItems.map(к => {
        const рассмотреть = (commitTab === 'pending' && can(PERM.REVIEW_COMMIT))
          ? `<button class="commit-approve" data-id="${escapeAttr(к.commitId)}">Одобрить</button>`
          + `<button class="commit-reject" data-id="${escapeAttr(к.commitId)}">Отклонить</button>`
          : '';
        const откат = (к.status === 'applied' && can(PERM.REVERT_COMMIT))
          ? `<button class="commit-revert" data-id="${escapeAttr(к.commitId)}">Откатить</button>`
          : '';
        return '<div class="commit-item">'
          + `<div class="commit-msg">${escapeAttr(к.message || '')}</div>`
          + `<div class="commit-meta">${escapeAttr(к.authorName || '')} · `
          + `${escapeAttr(commitStateWords(к.status))}</div>`
          + рассмотреть + откат + '</div>';
      }).join('');
    }

async function reviewCommitFromPanel(id, решение) {
      const комментарий = решение === 'reject'
        ? prompt('Причина отказа (обязательна):') : null;
      if (решение === 'reject' && !комментарий) return;
      const ответ = await api('/api/commits/' + encodeURIComponent(id) + '/review',
        { метод: 'POST', тело: { action: решение, comment: комментарий } });
      if (!ответ.годно) {
        // ОТКАЗ ПОКАЗЫВАЕТСЯ, а не проглатывается.
        commitError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                    || 'Сервер отказал';
        renderCommits();
        return;
      }
      await pullGraphSince();
      await loadCommits();
      emit('session-changed');   // счёт непрочитанного мог измениться
    }

async function revertCommitFromPanel(id) {
      const причина = prompt('Причина отката (обязательна):');
      if (!причина) return;
      const ответ = await api('/api/commits/' + encodeURIComponent(id) + '/revert',
        { метод: 'POST', тело: { reason: причина } });
      if (!ответ.годно) {
        commitError = (ответ.тело && ответ.тело.error && ответ.тело.error.message)
                    || 'Сервер отказал';
        renderCommits();
        return;
      }
      await pullGraphSince();
      await loadCommits();
    }

export { closeCommitsPanel, commitError, commitItems, commitTab, loadCommits, openCommitsPanel, revertCommitFromPanel, reviewCommitFromPanel, switchCommitTab };
