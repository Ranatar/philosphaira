// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA } from '../core/ns.js';
import '../core/graph-index.js';
import { conceptById } from '../core/graph-index.js';
import { directionMark } from '../core/link-facts.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';

import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { escapeAttr } from '../util/html.js';

let selectionListOpenBlocks = new Set();

let selectionListOpenBodies = new Set();

const SELECTION_LIST_CHUNK = 400;

let selectionListShown = { philosopher: 0, concept: 0, relation: 0 };

let selectionProvenance = 'all';

function provenanceState(z) {
      if (!z) return 'unspecified';
      const line = String(z.provenance || '').trim();
      return z.provenanceStatus
          || (line.startsWith('//') ? 'editorial_reasoning' : (line ? 'sourced' : 'unspecified'));
    }

const PROVENANCE_LABELS = {
      all: 'все',
      unspecified: 'не разобрано',
      sourced: 'источник',
      editorial_reasoning: 'основание',
      source_not_found: 'не найден',
    };

function setSelectionProvenance(value) {
      selectionProvenance = value;
      // Порции считаются заново: после сужения «показать ещё» относилось бы
      // к прежнему, более длинному списку.
      selectionListShown = { philosopher: SELECTION_LIST_CHUNK,
                             concept: SELECTION_LIST_CHUNK,
                             relation: SELECTION_LIST_CHUNK };
      renderSelectionList();
    }

let selectionPhilCount = {};

function selectionListSets() {
      const nodesShown = DATA.nodes.filter(isNodeVisible);
      // Философ считается отобранным, если видна хоть одна его концепция:
      // своего признака видимости у философа нет, он не узел графа.
      //
      // И СЧИТАЕМ ВИДИМЫЕ, А НЕ ВСЕ. Окно про отбор; написать рядом с именем
      // «концепций 14», когда отбор оставил три, значило бы отвечать не на
      // тот вопрос. philosopherConcepts для этого не годится вовсе — там
      // лежат только цвет и годы.
      selectionPhilCount = {};
      nodesShown.forEach(n => {
        selectionPhilCount[n.concept] = (selectionPhilCount[n.concept] || 0) + 1;
      });
      // ПРОИСХОЖДЕНИЕ ЕСТЬ У ВСЕХ ТРЁХ РОДОВ. Первая редакция обнуляла блок
      // философов при сужении — по неверной посылке, будто поля у них нет.
      // Посылка взялась из того, что ключа нет в данных: у 0 из 100
      // философов оно проставлено, и `Object.keys(philosophers[0])` его не
      // показывает. Но схема сервера числит `provenance` и
      // `provenanceStatus` среди полей философа, окно просмотра их рисует,
      // форма правки сохраняет — отсутствует значение, а не поле.
      //
      // Вывод об устройстве по одному образцу данных — та же ошибка, что
      // прочесть адрес сущности из окна вместо схемы. Спрашивать надо схему.
      const byProvenance = items => selectionProvenance === 'all'
        ? items : items.filter(z => provenanceState(z) === selectionProvenance);
      return {
        philosopher: byProvenance(
          DATA.philosophers.filter(p => selectionPhilCount[p.nameRu] > 0)),
        concept: byProvenance(nodesShown),
        relation: byProvenance(DATA.links.filter(isLinkVisible)),
      };
    }

function openSelectionListModal() {
      selectionListShown = { philosopher: SELECTION_LIST_CHUNK,
                             concept: SELECTION_LIST_CHUNK,
                             relation: SELECTION_LIST_CHUNK };
      // ЗАМОРОЗКА, КАК У ПРОЧИХ ПОЛНОЭКРАННЫХ ОКОН (статистика, описания
      // пути). Граф под окном не виден вовсе, а укладка продолжала считать
      // кадры и перерисовывать холст — работа вхолостую, и заметная: окно
      // строит до 1300 строк, и делить с ним кадры незачем.
      freezeSimulation();
      document.getElementById('selectionListModal').classList.add('active');
      renderSelectionList();
    }

function closeSelectionListModal() {
      document.getElementById('selectionListModal').classList.remove('active');
      unfreezeSimulation();
    }

function toggleSelectionBlock(kind) {
      if (selectionListOpenBlocks.has(kind)) selectionListOpenBlocks.delete(kind);
      else selectionListOpenBlocks.add(kind);
      renderSelectionList();
    }

function toggleSelectionBody(key) {
      if (selectionListOpenBodies.has(key)) selectionListOpenBodies.delete(key);
      else selectionListOpenBodies.add(key);
      renderSelectionList();
    }

function toggleSelectionBodies(kind) {
      const sets = selectionListSets();
      const items = sets[kind].slice(0, Math.min(selectionListShown[kind], sets[kind].length));
      const keys = items.map(z => kind === 'relation'
        ? 'relation:' + (z.source.id || z.source) + '→' + (z.target.id || z.target)
        : kind + ':' + z.id);
      const allOpen = keys.length > 0 && keys.every(k => selectionListOpenBodies.has(k));
      keys.forEach(k => allOpen ? selectionListOpenBodies.delete(k)
                                : selectionListOpenBodies.add(k));
      renderSelectionList();
    }

function selectionListMore(kind) {
      selectionListShown[kind] += SELECTION_LIST_CHUNK;
      renderSelectionList();
    }

function selectionLabel(id) {
      const n = conceptById.get(id);
      return n ? n.label : id;
    }

function selectionRowPhilosopher(p) {
      const dotColor = p.color || 'var(--fg-muted)';
      const bodyKey = 'philosopher:' + p.id;
      const openBody = selectionListOpenBodies.has(bodyKey);
      return `
        <div class="sel-row">
          <div class="sel-row-head">
            <span class="sel-dot" style="background:${dotColor};"></span>
            <span class="sel-name" data-act-click="open-universal-modal-13" data-a1="${escapeAttr(p.nameRu)}">${escapeAttr(p.nameRu)}</span>
            <span class="sel-meta">${escapeAttr(p.years || '')} · концепций в отборе ${selectionPhilCount[p.nameRu] || 0}</span>
            <button class="sel-toggle" data-act-click="toggle-selection-body" data-a1="${escapeAttr(bodyKey)}">${openBody ? '▲' : '▼'}</button>
          </div>
          ${openBody ? `<div class="sel-body">${escapeAttr(p.description || 'Описания нет')}</div>` : ''}
        </div>`;
    }

function selectionRowConcept(n) {
      const bodyKey = 'concept:' + n.id;
      const openBody = selectionListOpenBodies.has(bodyKey);
      const dotColor = (DATA.philosopherConcepts[n.concept] || {}).color || 'var(--fg-muted)';
      return `
        <div class="sel-row">
          <div class="sel-row-head">
            <span class="sel-dot" style="background:${dotColor};"></span>
            <span class="sel-name" data-act-click="open-universal-modal-14" data-a1="${escapeAttr(n.id)}">${escapeAttr(n.label)}</span>
            <span class="sel-meta">${escapeAttr(n.concept)}</span>
            <button class="sel-toggle" data-act-click="toggle-selection-body" data-a1="${escapeAttr(bodyKey)}">${openBody ? '▲' : '▼'}</button>
          </div>
          <div class="sel-caption">${escapeAttr(n.description || '')}</div>
          ${openBody ? `<div class="sel-body">${escapeAttr(n.extendedDescription || 'Пространного описания нет')}</div>` : ''}
        </div>`;
    }

function selectionRowRelation(l) {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      const bodyKey = 'relation:' + s + '→' + t;
      const openBody = selectionListOpenBodies.has(bodyKey);
      // relationTypesObj, а не relationTypes: второе — МАССИВ описаний
      // типов, а по идентификатору ищет первое. Разница молчаливая:
      // relationTypes['influence'] вернул бы undefined, и тип связи пропал
      // бы из строки, ничего об этом не сказав.
      const linkType = DATA.relationTypesObj[l.type] || {};
      const philOf = id => { const n = conceptById.get(id); return n ? n.concept : ''; };
      const sPhil = philOf(s);
      const tPhil = philOf(t);
      // У возвратной связи оба конца — одна концепция, и повторять философа
      // дважды незачем.
      const caption = s === t ? sPhil
        : (sPhil === tPhil ? sPhil : sPhil + ' ' + directionMark(l) + ' ' + tPhil);
      return `
        <div class="sel-row">
          <div class="sel-row-head">
            <span class="sel-dot" style="background:${linkType.color || 'var(--fg-muted)'};"></span>
            <span class="sel-name" data-act-click="open-universal-modal-15" data-a1="${escapeAttr(s)}" data-a2="${escapeAttr(t)}">${escapeAttr(selectionLabel(s))} ${directionMark(l)} ${escapeAttr(selectionLabel(t))}</span>
            <span class="sel-meta">${escapeAttr(linkType.label || l.type)} · вес ${l.weight}</span>
            <button class="sel-toggle" data-act-click="toggle-selection-body" data-a1="${escapeAttr(bodyKey)}">${openBody ? '▲' : '▼'}</button>
          </div>
          <div class="sel-caption">${escapeAttr(caption)}</div>
          ${openBody ? `<div class="sel-body">${escapeAttr(l.description || 'Описания нет')}</div>` : ''}
        </div>`;
    }

function renderSelectionList() {
      const slot = document.getElementById('selectionListBody');
      if (!slot) return;
      const sets = selectionListSets();
      const subtitle = document.getElementById('selectionListSubtitle');
      if (subtitle) subtitle.textContent =
        `философов ${sets.philosopher.length}, концепций ${sets.concept.length}, `
        + `связей ${sets.relation.length} — то, что сейчас проходит фильтры`;

      const blocks = [
        ['philosopher', '👤 Философы', sets.philosopher, selectionRowPhilosopher],
        ['concept', '💡 Концепции', sets.concept, selectionRowConcept],
        ['relation', '🔗 Связи', sets.relation, selectionRowRelation],
      ];
      // ПОЛОСА ОТБОРА ПО ПРОИСХОЖДЕНИЮ. Это единственное поле, где фронт
      // работ ещё открыт: описания проставлены везде (0 концепций и 0 связей
      // без них), а происхождение — нигде (0 из 100 философов, 0 из 718
      // концепций, 0 из 2720 связей). Потому «не разобрано» и вынесено
      // отдельной кнопкой, а не спрятано в общий список.
      const provBar = '<div class="sel-prov">'
        + Object.keys(PROVENANCE_LABELS).map(v =>
            `<button class="sel-prov-btn${v === selectionProvenance ? ' active' : ''}"
                     data-act-click="set-selection-provenance" data-a1="${v}">${PROVENANCE_LABELS[v]}</button>`).join('')
        + (selectionProvenance === 'all' ? ''
           : `<span class="sel-prov-note">показаны все три рода: ${
                PROVENANCE_LABELS[selectionProvenance]}</span>`)
        + '</div>';

      slot.innerHTML = provBar + blocks.map(([kind, title, items, rowOf]) => {
        const openBlock = selectionListOpenBlocks.has(kind);
        const shown = Math.min(selectionListShown[kind], items.length);
        return `
          <div class="sel-block">
            <div class="sel-block-head">
              <span class="sel-block-title" data-act-click="toggle-selection-block" data-a1="${kind}">${title}</span>
              <span class="sel-block-count">${items.length}</span>
              ${openBlock && items.length
                ? `<button class="sel-bodies" data-act-click="toggle-selection-bodies" data-a1="${kind}"
                           data-tip="Разворачивает описания у показанных строк, а не у всего набора">Все описания</button>`
                : ''}
              <span class="sel-block-toggle" data-act-click="toggle-selection-block" data-a1="${kind}">${openBlock ? '▲' : '▼'}</span>
            </div>
            ${openBlock ? `<div class="sel-block-body">
              ${items.length ? items.slice(0, shown).map(rowOf).join('')
                              : '<div class="empty-state-hint">Ничего не отобрано</div>'}
              ${shown < items.length
                ? `<button class="sel-more" data-act-click="selection-list-more" data-a1="${kind}">Показать ещё ${
                     Math.min(SELECTION_LIST_CHUNK, items.length - shown)} из ${
                     items.length - shown} оставшихся</button>` : ''}
            </div>` : ''}
          </div>`;
      }).join('');
    }

export { closeSelectionListModal, openSelectionListModal, provenanceState, renderSelectionList, selectionListMore, selectionListOpenBlocks, selectionListSets, setSelectionProvenance, toggleSelectionBlock, toggleSelectionBodies, toggleSelectionBody };
