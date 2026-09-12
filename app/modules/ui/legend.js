// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { relationHint } from '../core/relation-types.js';
import { applyFilters } from '../filters/filters.js';
import { renderState } from '../render/canvas-core.js';
import { updateArrows } from '../render/d3-layer.js';
import { chosenPhilosophers } from '../state/filters.js';

function markChosenInLegend() {
      document.querySelectorAll('#philosopherFilters .legend-item').forEach(item => {
        const cb = item.querySelector('input[type="checkbox"]');
        item.classList.toggle('phil-chosen', !!cb && chosenPhilosophers.has(cb.value));
      });
    }

function initFilters() {
      // ДЕФЕКТ U-3: прежде функция ДОПИСЫВАЛА в контейнеры, не очищая их.
      // В unimod она вызывается из savePhilosopherData, и замер показал
      // рост легенды с 42 записей до 84 за одно сохранение; каждое
      // следующее добавляло ещё столько же. Очистка нужна и здесь:
      // afterDataChange зовёт initFilters после всякой правки философов.
      ['philosopherFilters', 'relationFilters', 'rubricFilters'].forEach(id => {
        const box = document.getElementById(id);
        if (box) box.innerHTML = '';
      });

      // Создаем фильтры философов
      const philContainer = document.getElementById('philosopherFilters');
      Object.entries(DATA.philosopherConcepts).forEach(([name, data]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <input type="checkbox" id="phil-${name}" value="${name}" checked data-act-change="toggle-philosopher-change" data-a1="${name}">
          <label class="phil-row-label">
            <div class="legend-color" style="background: ${data.color}"></div>
            <span>${name}<small style="color: var(--fg-muted); font-size: 9px;"> (${data.years})</small></span>
          </label>
        `;
        philContainer.appendChild(item);
      });
    
      // Создаем фильтры связей — с подсказкой о смысле типа
      const relContainer = document.getElementById('relationFilters');
      Object.entries(DATA.relationTypesObj).forEach(([type, typeData]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const hint = relationHint(type).replace(/"/g, '&quot;');
        item.innerHTML = `
          <input type="checkbox" id="rel-${type}" checked data-act-change="toggle-relation-change" data-a1="${type}">
          <label for="rel-${type}" data-tip="${hint}">
            <div class="legend-line" style="background: ${typeData.color}"></div>
            <span>${typeData.label}<span class="legend-hint-mark">?</span></span>
          </label>
        `;
        relContainer.appendChild(item);
      });

      // Создаем фильтры традиций
      const tradContainer = document.getElementById('traditionFilters');
      if (tradContainer) {
        // Кнопки «+» больше нет: галочка сама добавляет всю традицию, когда
        // выбраны не все, и снимает её, когда выбраны все. Держать рядом два
        // управления с одним смыслом — то самое, из-за чего строка и была
        // непонятна. Осталось три: галочка (вся традиция), «=» (только эти),
        // сброс (снять этих).
        // Число в строке ставит syncTraditionRows: при сборке набор ещё не
        // известен, а писать сюда общее число членов значило бы завести
        // второй ответ на тот же вопрос.
        const traditionRow = (id, имя, подсказка) => {
          const item = document.createElement('div');
          item.className = 'legend-item';
          item.innerHTML = `
            <input type="checkbox" id="trad-${id}" data-act-change="toggle-tradition-change" data-a1="${id}">
            <label for="trad-${id}" data-tip="${подсказка}" style="flex:1;">
              <span>${имя}<small id="trad-count-${id}" style="color: var(--fg-muted);font-size:9px;"></small></span>
            </label>
            <button class="tradition-pick" data-tip="Оставить в отборе только этих философов"
                data-act-click="only-tradition" data-a1="${id}">=</button>
            <button class="tradition-pick" id="trad-reset-${id}"
                data-act-click="reset-tradition" data-a1="${id}">⌫</button>
          `;
          tradContainer.appendChild(item);
        };
        DATA.traditions.forEach(tr => traditionRow(
          tr.id, tr.name, (tr.description || '').replace(/"/g, '&quot;')));
        traditionRow(WITHOUT_TRADITION, 'Вне традиций',
          'Философы, которым традиция не проставлена');
      }

      // Создаем фильтры рубрик
      const rubricContainer = document.getElementById('rubricFilters');
      DATA.rubrics.forEach(rubric => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <input type="checkbox" id="rubric-${rubric.id}" checked data-act-change="toggle-rubric-change" data-a1="${rubric.id}">
          <label for="rubric-${rubric.id}">
            <span>${rubric.name}</span>
          </label>
        `;
        rubricContainer.appendChild(item);
      });

    }

function togglePhilosopher(philosopher) {
      if (S.selectedPhilosophers.has(philosopher)) {
        S.selectedPhilosophers.delete(philosopher);
      } else {
        S.selectedPhilosophers.add(philosopher);
      }
      applyFilters();
    }

const WITHOUT_TRADITION = 'no_tradition';

function toggleTradition(traditionId) {
      const members = traditionMembers(traditionId);
      const allSelected = members.length > 0 && members.every(n => S.selectedPhilosophers.has(n));
      if (allSelected) members.forEach(n => S.selectedPhilosophers.delete(n));
      else members.forEach(n => S.selectedPhilosophers.add(n));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function resetTradition(traditionId) {
      traditionMembers(traditionId).forEach(n => S.selectedPhilosophers.delete(n));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function selectAllTraditions() {
      DATA.traditions.forEach(t => traditionMembers(t.id).forEach(n => S.selectedPhilosophers.add(n)));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function deselectAllTraditions() {
      DATA.traditions.forEach(t => traditionMembers(t.id).forEach(n => S.selectedPhilosophers.delete(n)));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function traditionMembers(traditionId) {
      if (traditionId === WITHOUT_TRADITION) {
        return DATA.philosophers.filter(p => !(p.traditions || []).length).map(p => p.nameRu);
      }
      return DATA.philosophers.filter(p => (p.traditions || []).includes(traditionId))
                 .map(p => p.nameRu);
    }

function syncPhilosopherCheckboxes() {
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        const cb = document.getElementById('phil-' + name);
        if (cb) cb.checked = S.selectedPhilosophers.has(name);
      });
    }

function syncTraditionRows() {
      const rowIds = [...DATA.traditions.map(t => t.id), WITHOUT_TRADITION];
      rowIds.forEach(id => {
        const cb = document.getElementById('trad-' + id);
        if (!cb) return;
        const members = traditionMembers(id);
        const selected = members.filter(n => S.selectedPhilosophers.has(n)).length;
        cb.checked = members.length > 0 && selected === members.length;
        cb.indeterminate = selected > 0 && selected < members.length;

        const countEl = document.getElementById('trad-count-' + id);
        if (countEl) countEl.textContent = ' (' + selected + ' из ' + members.length + ')';

        const row = cb.closest('.legend-item');
        if (row && id === WITHOUT_TRADITION) row.style.display = members.length ? '' : 'none';

        // Безусловный сброс назван поимённо ДО нажатия: кого именно снимет.
        const resetBtn = document.getElementById('trad-reset-' + id);
        if (resetBtn) {
          const willDrop = members.filter(n => S.selectedPhilosophers.has(n));
          resetBtn.disabled = willDrop.length === 0;
          resetBtn.setAttribute('data-tip', willDrop.length
            ? 'Снять философов этой традиции: ' + willDrop.slice(0, 6).join(', ')
              + (willDrop.length > 6 ? ' и ещё ' + (willDrop.length - 6) : '')
            : 'Из этой традиции никто не выбран');
        }
      });
    }

function onlyTradition(traditionId) {
      S.selectedPhilosophers = new Set(traditionMembers(traditionId));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function toggleRelation(relationType) {
      if (S.selectedRelations.has(relationType)) {
        S.selectedRelations.delete(relationType);
      } else {
        S.selectedRelations.add(relationType);
      }
      applyFilters();
    }

function selectAllPhilosophers() {
      S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        document.getElementById(`phil-${name}`).checked = true;
      });
      applyFilters();
    }

function deselectAllPhilosophers() {
      S.selectedPhilosophers.clear();
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        document.getElementById(`phil-${name}`).checked = false;
      });
      applyFilters();
    }

function selectAllRelations() {
      S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));
      Object.keys(DATA.relationTypesObj).forEach(type => {
        document.getElementById(`rel-${type}`).checked = true;
      });
      applyFilters();
    }

function deselectAllRelations() {
      S.selectedRelations.clear();
      Object.keys(DATA.relationTypesObj).forEach(type => {
        document.getElementById(`rel-${type}`).checked = false;
      });
      applyFilters();
    }

function toggleRubric(rubricId) {
      if (S.selectedRubrics.has(rubricId)) {
        S.selectedRubrics.delete(rubricId);
      } else {
        S.selectedRubrics.add(rubricId);
      }
      applyFilters();
    }

function selectAllRubrics() {
      S.selectedRubrics = new Set(DATA.rubrics.map(r => r.id));
      DATA.rubrics.forEach(rubric => {
        document.getElementById(`rubric-${rubric.id}`).checked = true;
      });
      applyFilters();
    }

function deselectAllRubrics() {
      S.selectedRubrics.clear();
      DATA.rubrics.forEach(rubric => {
        document.getElementById(`rubric-${rubric.id}`).checked = false;
      });
      applyFilters();
    }

function toggleSection(sectionId) {
      const header = event.currentTarget;
      const content = document.getElementById(`${sectionId}-content`);
      
      if (!content) {
        console.error(`Секция ${sectionId}-content не найдена`);
        return;
      }
      
      // Переключаем классы
      const isCollapsed = content.classList.contains('collapsed');
      
      if (isCollapsed) {
        // Разворачиваем
        content.classList.remove('collapsed');
        header.classList.remove('collapsed');
        
        // Устанавливаем max-height равным реальной высоте контента
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        
        // После окончания анимации убираем ограничение
        setTimeout(() => {
          if (!content.classList.contains('collapsed')) {
            content.style.maxHeight = 'none';
          }
        }, 300); // 300ms - длительность transition
        
      } else {
        // Перед сворачиванием устанавливаем текущую высоту
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        
        // Принудительный reflow для применения стиля
        content.offsetHeight;
        
        // Сворачиваем
        content.classList.add('collapsed');
        header.classList.add('collapsed');
        content.style.maxHeight = '0px';
      }
    }

function changeFilterMode(mode) {
      S.filterMode = mode;
      applyFilters();
    }

function toggleUniformLinkWidth() {
      const isUniform = document.getElementById('uniformLinkWidth').checked;
      
      renderState.uniformLinkWidth = isUniform;
      // Ф0.4: маркеры масштабировались stroke-width, теперь размер считаем сами
      S.uniformLinkWidthActive = isUniform;
      updateArrows();
    }

function updateFilterStats() {
      // Б11: счётчики берутся из JS-состояния, а не обходом 2008 элементов
      const visibleNodesCount = S.visibleNodeIds ? S.visibleNodeIds.size : DATA.nodes.length;
      const visibleLinksCount = S.visibleLinkSet ? S.visibleLinkSet.size : DATA.links.length;
      
      const totalNodes = DATA.nodes.length;
      const totalLinks = DATA.links.length;
      
      document.getElementById('filterStats').textContent = 
        `Показано: ${visibleNodesCount}/${totalNodes} концепций, ${visibleLinksCount}/${totalLinks} связей`;
      updateProvenanceCoverage();
    }

function updateProvenanceCoverage() {
      const slot = document.getElementById('provenanceCoverage');
      if (!slot) return;
      // Считаем по ХРАНИМЫМ наборам (`relations`, `concepts`), а не по
      // `links`/`nodes`: происхождение — свойство записи в базе, и узлы с
      // связями получают его переносом. Считать по ним значило бы мерить
      // полноту переноса, а не работу составителя.
      // РАЗДЕЛЬНО ПО СОСТОЯНИЯМ, А НЕ «С ИСТОЧНИКОМ: X/Y».
      //
      // Прежний счётчик мерил ЗАПОЛНЕННОСТЬ: библиографическая ссылка и
      // собственное рассуждение шли в одну кучу, и число говорило, сколько
      // полей не пусто, — а не сколько утверждений подкреплено.
      // «Процента достоверности» здесь нет и не будет: достоверность не
      // считается делением, и такой процент немедленно стал бы враньём.
      const byState = список => {
        const fields = { sourced: 0, editorial_reasoning: 0, source_not_found: 0 };
        for (const z of список || []) {
          if (!z) continue;
          const line = String(z.provenance || '').trim();
          const state = z.provenanceStatus
            || (line.startsWith('//') ? 'editorial_reasoning'
                                        : (line ? 'sourced' : 'unspecified'));
          if (state in fields) fields[state]++;
        }
        return fields;
      };
      const byRelations = byState(DATA.relations);
      const byConcepts = byState(DATA.concepts);
      const classified = о => о.sourced + о.editorial_reasoning + о.source_not_found;
      if (!classified(byRelations) && !classified(byConcepts)) {
        slot.textContent = '';
        return;
      }
      const asLine = (имя, о, длина) => имя + ': источник ' + о.sourced
        + ' · основание ' + о.editorial_reasoning
        + ' · не найден ' + о.source_not_found
        + ' · не разобрано ' + (длина - classified(о));
      slot.textContent = asLine('связи', byRelations, (DATA.relations || []).length)
        + '; ' + asLine('концепции', byConcepts, (DATA.concepts || []).length);
    }

const legendWeightsToggle = document.getElementById('useWeightsToggle');

// if (legendWeightsToggle) @c01d934e
function syncLegendWeightsToggle() {
if (legendWeightsToggle) legendWeightsToggle.checked = S.useWeightedPaths;
}

const legendDirectionToggle = document.getElementById('respectDirectionToggle');

// if (legendDirectionToggle) @47528ba2
function syncLegendDirectionToggle() {
if (legendDirectionToggle) legendDirectionToggle.checked = S.respectDirection;
}

export { changeFilterMode, deselectAllPhilosophers, deselectAllRelations, deselectAllRubrics, deselectAllTraditions, initFilters, markChosenInLegend, onlyTradition, resetTradition, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, syncLegendDirectionToggle, syncLegendWeightsToggle, syncTraditionRows, togglePhilosopher, toggleRelation, toggleRubric, toggleSection, toggleTradition, toggleUniformLinkWidth, traditionMembers, updateFilterStats };
