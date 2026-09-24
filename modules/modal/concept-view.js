// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, VIEWS } from '../core/ns.js';
import '../core/graph-index.js';
import { conceptById, otherEndColor, rubricById } from '../core/graph-index.js';
import { orientLink } from '../core/link-facts.js';
import { medianNodeDegree, nodeDegreeOf } from '../metrics/network.js';
import { ensureNetworkProfile, nearestConcepts, networkProgressPercent, networkSimilarityData, profileIsMeaningful } from '../metrics/similarity-concepts.js';
import { linkArrow } from './connection-view.js';

import { historyBlock } from './history.js';

import { getContrastColor } from '../util/color.js';
import { liveProgressHtml, provenanceBlock, updateLiveProgress } from '../util/html.js';

function similarItemHtml(x) {
      const n = conceptById.get(x.id);
      if (!n) return '';
      const hasContrast = x.contrast !== null && x.contrast !== undefined;
      const score = hasContrast ? ('×' + x.contrast.toFixed(1)) : (Math.round(x.value * 100) + ' %');
      const tip = 'косинус ' + Math.round(x.value * 100) + ' %'
            + (hasContrast ? '; контраст — во сколько сигм сосед выделяется среди прочих' : '')
            + (x.tied ? '; неразличимо с соседней строкой' : '');
      return `
          <div class="similar-item${x.tied ? ' similar-tied' : ''}" data-act-click="open-concept-by-id" data-a1="${x.id}" data-tip="${tip}">
            <span class="similar-name">${n.label}</span>
            <span class="similar-author">${n.concept}</span>
            <span class="similar-score">${score}${x.tied ? ' =' : ''}</span>
          </div>`;
    }

let _forcedSimilar = { conceptId: null, kinds: new Set() };

function similarForced(conceptId, kind) {
      return _forcedSimilar.conceptId === conceptId && _forcedSimilar.kinds.has(kind);
    }

function forceSimilarColumn(kind, conceptId) {
      if (_forcedSimilar.conceptId !== conceptId) _forcedSimilar = { conceptId, kinds: new Set() };
      _forcedSimilar.kinds.add(kind);
      if (kind === 'network' && !networkSimilarityData()) {
        computeSimilarNetworkColumn(conceptId);   // с тем же указателем хода
        return;
      }
      refreshSimilarColumn(kind, conceptId);
    }

function refreshSimilarColumn(kind, conceptId) {
      const id = kind === 'profile' ? 'similarProfileCol' : 'similarNetworkCol';
      const box = document.getElementById(id);
      if (!box || box.dataset.concept !== conceptId) return;
      box.outerHTML = kind === 'profile'
        ? similarProfileColumnHtml(conceptId)
        : similarNetworkColumnHtml(conceptId);
    }

function forceButtonHtml(kind, conceptId, caption) {
      return `<button class="similar-map-btn" data-sweep-skip`
        + ` data-act-click="force-similar-column" data-a1="${kind}" data-a2="${conceptId}">${caption}</button>`;
    }

function similarColumnHtml(title, hint, list, empty, attrs) {
      return `
            <div class="similar-col"${attrs || ''}>
              <div class="similar-col-title">${title}</div>
              <div class="similar-col-hint">${hint}</div>
              ${list && list.length
                ? list.map(similarItemHtml).join('')
                : `<div class="similar-empty">${empty}</div>`}
            </div>`;
    }

function similarProfileColumnHtml(conceptId) {
      const title = 'По профилю метрик';
      const hint = 'Играют похожую роль в системе';
      const attrs = ` id="similarProfileCol" data-concept="${conceptId}"`;
      const forced = similarForced(conceptId, 'profile');
      if (!profileIsMeaningful(conceptId) && !forced) {
        return similarColumnHtml(title, hint, [],
          `Профиль метрик этой концепции почти пуст (связей: ${nodeDegreeOf(conceptId)},`
          + ` порог: ${medianNodeDegree()}) — сравнение по нему не показательно. `
          + forceButtonHtml('profile', conceptId, 'Всё равно показать'), attrs);
      }
      const list = nearestConcepts(conceptId, 'profile', 5, forced);
      const weak = forced && !profileIsMeaningful(conceptId);
      return similarColumnHtml(title, hint + (weak ? ' — профиль почти пуст, сходство ненадёжно' : ''),
        list, 'Нет близких по профилю', attrs);
    }

function similarNetworkColumnHtml(conceptId) {
      const title = 'По месту в сети';
      const hint = 'Сходная позиция в топологии графа';
      const attrs = ` id="similarNetworkCol" data-concept="${conceptId}"`;
      const forced = similarForced(conceptId, 'network');
      if (!profileIsMeaningful(conceptId) && !forced) {
        return similarColumnHtml(title, hint, [],
          `Место в сети у малосвязной концепции непоказательно (связей: ${nodeDegreeOf(conceptId)},`
          + ` порог: ${medianNodeDegree()}). `
          + forceButtonHtml('network', conceptId, 'Всё равно показать'), attrs);
      }
      const list = nearestConcepts(conceptId, 'network', 5, forced);
      if (list === null) {
        return similarColumnHtml(title, hint, [],
          `Сетевые метрики ещё не посчитаны. <button class="similar-map-btn" data-sweep-skip data-act-click="compute-similar-network-column" data-a1="${conceptId}">Посчитать</button>`, attrs);
      }
      const weak = forced && !profileIsMeaningful(conceptId);
      return similarColumnHtml(title, hint + (weak ? ' — связей мало, положение неустойчиво' : ''),
        list, 'Нет концепций со сходным местом', attrs);
    }

function computeSimilarNetworkColumn(conceptId) {
      const box = document.getElementById('similarNetworkCol');
      const empty = box && box.querySelector('.similar-empty');
      if (empty) empty.innerHTML = 'Считаю сетевые метрики… ' + liveProgressHtml(networkProgressPercent());
      const sameColumn = () => {
        const b = document.getElementById('similarNetworkCol');
        return b && b.dataset.concept === conceptId ? b : null;
      };
      ensureNetworkProfile(pct => updateLiveProgress(sameColumn(), pct)).then(ok => {
        if (ok) refreshSimilarNetworkColumn(conceptId);
        else if (empty) empty.textContent = 'Сетевые метрики не досчитались';
      });
    }

function refreshSimilarNetworkColumn(conceptId) {
      refreshSimilarColumn('network', conceptId);
    }

function similarConceptsBlock(conceptId) {
      // открыли другую концепцию — прежнее «всё равно показать» к ней не относится
      if (_forcedSimilar.conceptId !== conceptId) _forcedSimilar = { conceptId, kinds: new Set() };
      let byProfile, byStructure, byTypes;
      try {
        byProfile = nearestConcepts(conceptId, 'profile', 5);
        byStructure = nearestConcepts(conceptId, 'structure', 5);
        byTypes = nearestConcepts(conceptId, 'types', 5);
      } catch (e) { return ''; }
      if (!byProfile.length && !byStructure.length && !byTypes.length) return '';

      // КНОПКА ЗНАЕТ О ВЫРОЖДЕННОСТИ. Прежде она всегда звала вид «по профилю»,
      // а showSimilarityOverlay у малосвязной концепции отказывался и советовал
      // «попробуйте вид по структуре» — вид, к которому из окна не вело ничего:
      // панель с переключателем рисуется только при уже открытом наложении.
      // Совет указывал на дверь, которой нет.
      const profileWorks = profileIsMeaningful(conceptId);
      const mapKind = profileWorks ? 'profile' : 'structure';
      const mapLabel = profileWorks
        ? '🗺️ Показать на графе'
        : '🗺️ Показать на графе (по структуре)';
      const mapTip = profileWorks
        ? 'Раскрасить граф по сходству с этой концепцией'
        : 'Профиль метрик здесь непоказателен (связей ' + nodeDegreeOf(conceptId)
          + ', порог ' + medianNodeDegree() + '), поэтому граф раскрасится '
          + 'по структуре связей. Вид переключается в панели наложения';
      // Если и структура пуста, звать не к чему: обе колонки в этом случае
      // пусты, а такой блок вовсе не строится (см. проверку выше).
      const mapButton = (profileWorks || byStructure.length)
        ? `<button class="similar-map-btn"
                data-act-click="show-similarity-overlay" data-a1="${conceptId}" data-a2="${mapKind}"
                data-tip="${mapTip}">
              ${mapLabel}
            </button>`
        : '';

      return `
        <div class="rubric-section similar-section">
          <div class="similar-title">
            Похожие концепции
            ${mapButton}
          </div>
          <div class="similar-columns">
            ${similarProfileColumnHtml(conceptId)}
            ${similarColumnHtml('По структуре связей', 'Связаны с одними и теми же понятиями', byStructure,
              'Нет общих соседей')}
            ${similarColumnHtml('По типам связей', 'Необычны в одних и тех же отношениях', byTypes,
              'Нет концепций со сходным характером связей')}
            ${similarNetworkColumnHtml(conceptId)}
          </div>
        </div>`;
    }

VIEWS.generateConceptViewContent = function generateConceptViewContent(conceptData) {
      if (!conceptData) return '<p>Концепция не найдена</p>';
      // Получаем рубрики этой концепции
      const conceptRubrics = DATA.conceptToRubrics[conceptData.id] || [];
      
      let html = `
        <div id="modalSearch">
          <div class="legend-search-header">
            <div class="legend-search-icon">🔍</div>
            <div class="legend-search-input-wrapper">
              <input type="text" 
                   class="legend-search-input" 
                   id="modalSearchInput" 
                   placeholder="Поиск других концепций..."
                   data-act-input="handle-modal-search-input"
                   data-act-focus="handle-modal-search-focus">
              <span class="legend-search-clear" data-act-click="clear-modal-search">×</span>
              <div class="search-results" id="modalSearchResults"></div>
            </div>
          </div>
        </div>
        <h2>${conceptData.label}</h2>
        <div class="philosopher-tag" style="background: ${DATA.philosopherConcepts[conceptData.concept].color}; color: ${getContrastColor(DATA.philosopherConcepts[conceptData.concept].color)}; cursor: pointer;" 
           data-act-click="open-universal-modal" data-a1="${conceptData.concept}"
           data-tip="Кликните для просмотра информации о философе">
          ${conceptData.concept}
        </div>
        <div class="description">${conceptData.extendedDescription}</div>
        ${provenanceBlock(conceptData.provenance, conceptData.provenanceStatus)}
        ${historyBlock('concept', conceptData.id)}
        <button class="goto-node-btn" data-act-click="goto-node-from-modal" data-a1="${conceptData.id}">
          🎯 Перейти к узлу
        </button>
        <button class="goto-node-btn" data-act-click="close-universal-modal-2" data-a1="${conceptData.id}">
          📊 Статистический профиль
        </button>
      `;
      
      // Секция связей узла - МОДИФИЦИРОВАННАЯ ВЕРСИЯ
      const nodeConnections = DATA.links.filter(l => {
        const src = l.source.id || l.source;
        const tgt = l.target.id || l.target;
        return src === conceptData.id || tgt === conceptData.id;
      });

      if (nodeConnections.length > 0) {
        // Разделяем связи на внутренние и внешние
        const internalConnections = [];
        const externalConnections = [];
        
        nodeConnections.forEach(conn => {
          const src = conn.source.id || conn.source;
          const tgt = conn.target.id || conn.target;
          const isSource = src === conceptData.id;
          const connectedNodeId = isSource ? tgt : src;
          const connectedNode = conceptById.get(connectedNodeId);
          
          if (!connectedNode) return;
          
          // Проверяем, тот же философ или нет
          if (connectedNode.concept === conceptData.concept) {
            internalConnections.push({ conn, connectedNode, isSource });
          } else {
            externalConnections.push({ conn, connectedNode, isSource });
          }
        });
        
        // D1: покрытие описаниями считается по КАЖДОЙ подсекции отдельно.
        // Прежде кнопка «развернуть все» показывалась по наличию описаний
        // хотя бы у одной связи узла — и висела над внешним блоком,
        // где раскрывать нечего (у Dasein: внутренних 10 из 10 с описанием,
        // внешних 0 из 18).
        const internalDescribed = internalConnections.filter(x => x.conn.description).length;
        const externalDescribed = externalConnections.filter(x => x.conn.description).length;
        const hasDescriptions = internalDescribed + externalDescribed > 0;
        
        html += `
          <div class="connections-section">
            <div class="connections-title">📊 Связи узла (${nodeConnections.length})</div>
        `;
        
        // Добавляем кнопку для раскрытия/свертывания всех описаний, если есть descriptions
        if (hasDescriptions) {
          html += `
            <button class="toggle-all-descriptions-btn" data-act-click="toggle-all-connection-descriptions">
              ▼ Развернуть все описания связей
            </button>
          `;
        }
        
        // ВНУТРЕННИЕ СВЯЗИ (того же философа)
        if (internalConnections.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection" data-a1="${conceptData.id}">
                <div class="subsection-title">
                  🔗 Связи внутри системы ${conceptData.concept}
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${internalConnections.length}, описаний: ${internalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-internal-${conceptData.id}">▼</span>
              </div>
              <div class="subsection-content" id="content-internal-${conceptData.id}">
          `;
          
          internalConnections.forEach(({ conn, connectedNode, isSource }) => {
            // Пара концов нужна стрелке, чтобы открыть окно связи. Выше
            // объявления с теми же именами живут в ДРУГОМ обходе — проверка
            // модулей это и поймала, когда я взял их оттуда.
            const src = conn.source.id || conn.source;
            const tgt = conn.target.id || conn.target;
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            
            // Стрелка — общим правилом «от себя»: возвратная получает '↻',
            // двуглавая типом — '↔', прочие — '→'/'←' от этой концепции.
            const arrow = orientLink(conn, end => end === conceptData.id).mark;
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${otherEndColor(conn, conceptData.concept)}"></div>
                ${linkArrow(arrow, linkColor, conn.weight, linkLabel, '', src, tgt)}
                <div style="flex-grow: 1;" data-act-click="open-universal-modal-2" data-a1="${connectedNode.id}">
                  <div class="concept-name">${connectedNode.label}</div>
                  <div class="concept-philosopher">${connectedNode.concept}</div>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation" data-a1="${conceptData.id}" data-a2="${connectedNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-${conceptData.id}-${connectedNode.id}">
                  ${conn.description}
                </div>
              ` : ''}
            `;
          });
          
          html += `
              </div>
            </div>
          `;
        }
        
        // ВНЕШНИЕ СВЯЗИ (с другими философами)
        if (externalConnections.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection-2" data-a1="${conceptData.id}">
                <div class="subsection-title">
                  🌐 Связи с концепциями других философов
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${externalConnections.length}, описаний: ${externalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-external-${conceptData.id}">▼</span>
              </div>
              <div class="subsection-content" id="content-external-${conceptData.id}">
          `;
          
          externalConnections.forEach(({ conn, connectedNode, isSource }) => {
            const src = conn.source.id || conn.source;
            const tgt = conn.target.id || conn.target;
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            
            // Стрелка — общим правилом «от себя»: возвратная получает '↻',
            // двуглавая типом — '↔', прочие — '→'/'←' от этой концепции.
            const arrow = orientLink(conn, end => end === conceptData.id).mark;
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${otherEndColor(conn, conceptData.concept)}"></div>
                ${linkArrow(arrow, linkColor, conn.weight, linkLabel, '', src, tgt)}
                <div style="flex-grow: 1;" data-act-click="open-universal-modal-2" data-a1="${connectedNode.id}">
                  <div class="concept-name">${connectedNode.label}</div>
                  <div class="concept-philosopher">${connectedNode.concept}</div>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation" data-a1="${conceptData.id}" data-a2="${connectedNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-${conceptData.id}-${connectedNode.id}">
                  ${conn.description}
                </div>
              ` : ''}
            `;
          });
          
          html += `
              </div>
            </div>
          `;
        }
        
        html += `</div>`;
      }
      
      // Секция рубрик (без изменений)
      if (conceptRubrics.length > 0) {
        const rubricDataArray = conceptRubrics.map(rubricId => 
          rubricById.get(rubricId)
        ).filter(r => r !== undefined);
        
        rubricDataArray.forEach(rubricData => {
          const relatedConcepts = DATA.nodes.filter(n => {
            const nRubrics = DATA.conceptToRubrics[n.id] || [];
            return nRubrics.includes(rubricData.id) && n.id !== conceptData.id;
          });
          
          const showAllId = `show-all-${rubricData.id}`;
          const initialDisplay = 10;
          const hasMore = relatedConcepts.length > initialDisplay;
          
          html += `
            <div class="rubric-section">
              <div class="rubric-title">📚 Рубрика: ${rubricData.name}</div>
              <div class="rubric-description">${rubricData.description}</div>
              
              ${relatedConcepts.length > 0 ? `
                <div class="related-concepts">
                  <div class="related-title">Также в этой рубрике (${relatedConcepts.length}):</div>
                  <div id="${showAllId}-container">
                    ${relatedConcepts.slice(0, initialDisplay).map(c => `
                      <div class="concept-item" data-act-click="open-universal-modal-3" data-a1="${c.id}">
                        <div class="concept-color" style="background: ${DATA.philosopherConcepts[c.concept].color}"></div>
                        <div class="concept-name">${c.label}</div>
                        <div class="concept-philosopher">${c.concept}</div>
                      </div>
                    `).join('')}
                  </div>
                  ${hasMore ? `
                    <button class="show-all-concepts-btn" id="${showAllId}" data-act-click="show-all-concepts" data-a1="${rubricData.id}" data-a2="${conceptData.id}">
                      Показать все (${relatedConcepts.length})
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `;
        });
      } else {
        html += `<div class="rubric-section">
          <div class="rubric-description" style="color: var(--fg-muted);">
            Эта концепция пока не отнесена к какой-либо рубрике.
          </div>
        </div>`;
      }

      html += similarConceptsBlock(conceptData.id);

      return html;
    };

export { computeSimilarNetworkColumn, forceSimilarColumn };
