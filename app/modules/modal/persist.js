// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { conceptById, nodesByPhilosopher, philosopherByName } from '../core/graph-index.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { submitChange } from '../data/backend.js';
import { describeChange } from '../data/commit-draft.js';
import { afterDataChange } from '../data/mutate.js';
import { addLinkToGraph, addNodeToGraph, findConnection, forgetLink, forgetNode, getConceptConnections, updateLinkOnGraph, updateNodeOnGraph } from '../graph/graph-data.js';
import { modalEntityExists } from './assembly.js';
import { ModalContext } from './context.js';
import { closeUniversalModal, openUniversalModal } from './core.js';
import { getIsolatedConceptsAfterDeletion } from './entry.js';
import { provenanceValue } from './forms.js';
import { conceptIntegrityWarnings, connectionIntegrityWarnings, nConcepts, nLinks, philosopherIntegrityWarnings, provenanceDriftWarning, relationIndexById } from './integrity.js';

function generateId(prefix = 'item') {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

function confirmWarnings(title, warnings) {
      if (!warnings.length) return true;
      const body = warnings.map((s, i) => (i + 1) + '. ' + s).join('\n\n');
      return confirm(title + '\n\n' + body + '\n\nВсё равно сохранить?');
    }

function savePhilosopherData() {
      const nameEl  = document.getElementById('philName');
      const colorEl = document.getElementById('philColor');
      const birthEl = document.getElementById('philBirth');
      const deathEl = document.getElementById('philDeath');
      const descEl  = document.getElementById('philDescription');
      if (!nameEl || !colorEl) return;

      const name  = nameEl.value.trim();
      const color = colorEl.value;
      const num = el => {
        if (!el || el.value === '') return null;
        const v = parseInt(el.value, 10);
        return Number.isNaN(v) ? null : v;
      };
      const birth = num(birthEl), death = num(deathEl);
      // Традиции читаются так же, как рубрики в saveConceptData:
      // множественный выбор → массив идентификаторов.
      const tradEl = document.getElementById('philTraditions');
      const traditionIds = tradEl
        ? Array.from(tradEl.selectedOptions).map(o => o.value) : [];

      const description = descEl ? descEl.value.trim() : '';

      if (!name) { alert('Укажите имя философа'); return; }

      const originalName = ModalContext.currentData;
      const isNew = !modalEntityExists('philosopher', originalName);

      // Совпадение имени — единственный запрет, а не предупреждение:
      // имя служит ключом в philosopherConcepts и в nodes[].concept.
      // Условие ДВУСОСТАВНОЕ: имя совпало И это не тот же самый философ.
      // Карта отдаёт запись по имени, второе условие остаётся снаружи —
      // иначе от прежней стрелочной функции остаётся хвост с несведённым `p`.
      const clash = (name !== originalName) ? philosopherByName.get(name) : null;
      if (clash) { alert('Философ с именем «' + name + '» уже существует'); return; }

      // Происхождение читается ДО заслона: заслон о нём и спрашивает.
      const { строка: provenance, состояние: provenanceStatus } = provenanceValue();

      // Полнота (у каждого хотя бы одна традиция) — договорённость, а не
      // запрет: предупреждаем и даём сохранить, как принято в этом окне.
      if (!confirmWarnings('Сохранение философа',
          philosopherIntegrityWarnings(name, birth, death,
                         isNew ? null : originalName)
            .concat(traditionIds.length ? [] : [
              'Не выбрано ни одной традиции: раздел традиций в окне философа '
              + 'выводиться не будет.'])
            // ПРЕЖНЕЕ СОСТОЯНИЕ берётся по ИМЕНИ: в этом окне под рукой не
            // объект философа, а только его имя (ModalContext хранит имя,
            // потому что философ и опознаётся по имени).
            .concat(provenanceDriftWarning(
              isNew ? null : philosopherByName.get(originalName),
              { description, provenance })))) return;

      // years собирается по тому же правилу, что formatBirthYear:
      // отрицательный год без пояснения читается как «-515»
      const yr = v => v < 0 ? (-v) + ' до н.э.' : String(v);
      let years = '';
      if (birth != null && death != null) years = yr(birth) + '-' + yr(death);
      else if (birth != null)       years = yr(birth) + '-?';

      const i = isNew ? -1 : DATA.philosophers.findIndex(p => p.nameRu === originalName);
      if (!isNew && i === -1) { alert('Философ не найден'); return; }

      // Поле traditions обязано попасть и в НОВУЮ запись: без него
      // у созданного философа не будет ни традиции, ни раздела в окне.
      const next = { name, nameRu: name, color,
                birth, death, years, traditions: traditionIds, description,
                ...provenanceFields(provenance, provenanceStatus) };
      const philId = isNew
        ? (name.toLowerCase().replace(/\s+/g, '_')
             .replace(/[^a-z0-9_а-яё]/gi, '') || generateId('phil'))
        : DATA.philosophers[i].id;

      submitChange(
        describeChange(isNew ? 'add' : 'edit', 'philosopher', philId,
                 isNew ? null : DATA.philosophers[i], next),
        () => {
          if (isNew) {
            DATA.philosophers.push({ id: philId, ...next });
          } else {
            const oldName = originalName;
            const oldId   = DATA.philosophers[i].id;
            DATA.philosophers[i] = { ...DATA.philosophers[i], ...next };

            if (name !== oldName) {
              // Переименование тянет за собой больше, чем в unimod:
              // ссылку в узлах, множество фильтров и все кэши, ключами
              // которых служит имя (их сбросит afterDataChange).
              DATA.nodes.forEach(n => { if (n.concept === oldName) n.concept = name; });
              DATA.concepts.forEach(c => { if (c.philosopher === oldId) c.philosopher = DATA.philosophers[i].id; });
              if (S.selectedPhilosophers.has(oldName)) {
                S.selectedPhilosophers.delete(oldName);
                S.selectedPhilosophers.add(name);
              }
            }
          }
          afterDataChange({ philosophers: true, nodes: true, links: true });
        });
      openUniversalModal('philosopher', name, 'view', { noPush: true });
    }

function deletePhilosopher(philosopherName) {
      const name = philosopherName || ModalContext.currentData;
      const data = philosopherByName.get(name);
      if (!data) { alert('Философ не найден'); return; }

      const own = (nodesByPhilosopher.get(name) || []).slice();
      const isolated = getIsolatedConceptsAfterDeletion(name);

      let msg = 'Удалить философа «' + name + '»?\n\n'
          + 'Вместе с ним исчезнут ' + nConcepts(own.length)
          + ' и все их связи.\n';
      if (isolated.length) {
        msg += '\nБез связей с другими системами (исчезнут бесследно):\n'
           + isolated.slice(0, 5).map(c => '• ' + c.label).join('\n')
           + (isolated.length > 5 ? '\n… и ещё ' + (isolated.length - 5) : '');
      }
      if (!confirm(msg)) return;

      submitChange(
        describeChange('delete', 'philosopher', data.id, data, null),
        () => {
          // Сперва связи всех его концепций, потом сами концепции.
          // Переменная названа conceptLinks, а не connections: в unimod
          // одноимённая локальная затеняла глобальный массив, и удаление
          // из него не работало ни разу (дефект U-4).
          own.forEach(concept => {
            const conceptLinks = getConceptConnections(concept.id);
            conceptLinks.forEach(l => removeLinkEverywhere(l));
          });
          own.forEach(concept => removeConceptEverywhere(concept.id));

          const pi = DATA.philosophers.findIndex(p => p.nameRu === name);
          if (pi !== -1) DATA.philosophers.splice(pi, 1);
          delete DATA.philosopherConcepts[name];
          delete DATA.philosopherOrder[name];
          S.selectedPhilosophers.delete(name);

          afterDataChange({ philosophers: true, nodes: true, links: true });
        });
      closeUniversalModal();
    }

function removeConceptEverywhere(conceptId) {
      const ni = DATA.nodes.findIndex(n => n.id === conceptId);
      if (ni !== -1) DATA.nodes.splice(ni, 1);
      const ci = DATA.concepts.findIndex(c => c.id === conceptId);
      if (ci !== -1) DATA.concepts.splice(ci, 1);
      delete DATA.conceptToRubrics[conceptId];
      forgetNode(conceptId);
    }

function removeLinkEverywhere(link) {
      const li = DATA.links.indexOf(link);
      if (li !== -1) DATA.links.splice(li, 1);
      const ri = relationIndexById(link.id);
      if (ri !== -1) DATA.relations.splice(ri, 1);
      forgetLink(link);
    }

function saveConceptData() {
      const labelEl = document.getElementById('conceptLabel');
      const philEl  = document.getElementById('conceptPhilosopher');
      const rubrEl  = document.getElementById('conceptRubric');
      const descEl  = document.getElementById('conceptDescription');
      const extEl   = document.getElementById('conceptExtendedDescription');
      if (!labelEl || !philEl) return;

      const label = labelEl.value.trim();
      const philosopher = philEl.value;
      const selectedRubricIds = rubrEl
        ? Array.from(rubrEl.selectedOptions).map(o => o.value) : [];
      const description = descEl ? descEl.value.trim() : '';
      const extendedDescription = extEl ? extEl.value.trim() : '';
      const { строка: provenance, состояние: provenanceStatus } = provenanceValue();

      if (!label || !philosopher) {
        alert('Укажите название концепции и философа'); return;
      }
      const philData = philosopherByName.get(philosopher);
      if (!philData) { alert('Философ не найден'); return; }

      const original = ModalContext.currentData;
      const isNew = !modalEntityExists('concept', original);

      if (!confirmWarnings('Сохранение концепции',
          conceptIntegrityWarnings(label, philosopher, isNew ? null : original)
            .concat(provenanceDriftWarning(isNew ? null : original,
              { description, extendedDescription, provenance })))) return;

      // Схемы разные: в concepts философ хранится ИДЕНТИФИКАТОРОМ,
      // в nodes — ИМЕНЕМ. Их нельзя перепутать местами. Описание идёт по
      // хранимой схеме — по concepts.
      // ПУСТОЕ ПРОИСХОЖДЕНИЕ НЕ ПИШЕТСЯ ВОВСЕ. Иначе сущность без источника
      // обрастёт полем-пустышкой, выгрузка разойдётся с файлами у всех
      // четырёхсот с лишним разом, а «источника нет» станет неотличимо от
      // «источник — пустая строка».
      const next = { label, philosopher: philData.id,
              rubrics: selectedRubricIds, description, extendedDescription,
              ...provenanceFields(provenance, provenanceStatus) };

      if (isNew) {
        const id = generateId('concept');
        const newNode = { id, label, concept: philosopher,
                  rubrics: selectedRubricIds, description, extendedDescription,
                  ...provenanceFields(provenance, provenanceStatus) };
        submitChange(
          describeChange('add', 'concept', id, null, next),
          () => {
            DATA.concepts.push({ id, ...next });
            DATA.nodes.push(newNode);
            DATA.conceptToRubrics[id] = selectedRubricIds;
            addNodeToGraph(newNode);
            afterDataChange({ nodes: true, links: true });
          });
        openUniversalModal('concept', newNode, 'view', { noPush: true });
        return;
      }

      const ci = DATA.concepts.findIndex(c => c.id === original.id);
      const ni = DATA.nodes.findIndex(n => n.id === original.id);
      if (ci === -1 || ni === -1) { alert('Концепция не найдена'); return; }

      submitChange(
        describeChange('edit', 'concept', original.id, DATA.concepts[ci], next),
        () => {
          DATA.concepts[ci] = { ...DATA.concepts[ci], ...next };
          DATA.nodes[ni] = Object.assign(DATA.nodes[ni], { label, concept: philosopher,
                   rubrics: selectedRubricIds, description, extendedDescription });
          DATA.conceptToRubrics[original.id] = selectedRubricIds;

          updateNodeOnGraph();
          afterDataChange({ nodes: true, links: true });
        });
      openUniversalModal('concept', DATA.nodes[ni], 'view', { noPush: true });
    }

function deleteConcept(conceptId) {
      const id = conceptId
          || (ModalContext.currentData && ModalContext.currentData.id);
      const node = conceptById.get(id);
      if (!node) { alert('Концепция не найдена'); return; }

      const own = getConceptConnections(id);
      const msg = own.length
        ? 'Удалить концепцию «' + node.label + '»?\n\nВместе с ней исчезнут '
          + nLinks(own.length) + '.'
        : 'Концепция «' + node.label + '» не имеет связей. Удалить?';
      if (!confirm(msg)) return;

      submitChange(
        describeChange('delete', 'concept', id, node, null),
        () => {
          own.forEach(l => removeLinkEverywhere(l));
          removeConceptEverywhere(id);
          afterDataChange({ nodes: true, links: true });
        });

      // Если окно открыто на этой концепции — закрываем; если на философе,
      // перерисовываем, чтобы перечень концепций не врал. Развилка та же,
      // что в deleteConnection.
      if (ModalContext.currentEntity === 'philosopher' && ModalContext.currentData) {
        openUniversalModal('philosopher', ModalContext.currentData,
                   ModalContext.currentMode, { noPush: true });
      } else {
        closeUniversalModal();
      }
    }

function saveConnectionData() {
      const typeEl   = document.getElementById('connType');
      const weightEl = document.getElementById('connWeight');
      const bidirEl  = document.getElementById('connBidirectional');
      const descEl   = document.getElementById('connDescription');
      if (!typeEl || !weightEl) return;

      const type = typeEl.value;
      const weight = parseInt(weightEl.value, 10) || 2;
      const description = descEl ? descEl.value.trim() : '';
      const source = ModalContext.editState.selectedSource;
      const target = ModalContext.editState.selectedTarget;

      if (!type) { alert('Укажите тип связи'); return; }
      if (!source || !target) { alert('Выберите обе концепции'); return; }

      // У симметричного типа флажок в форме заблокирован, поэтому его
      // состояние ничего не выражает: берётся прежнее значение, а для
      // новой связи — false. Спецификация (§8.3 п. 5) требовала писать
      // true, но замер показал, что в базе у 84 связей симметричных типов
      // флаг намеренно false: symmetric говорит о ТИПЕ, bidirectional —
      // об историческом факте взаимности, и метрики их различают.
      const t = DATA.relationTypesObj[type] || {};
      const wasBidir = (ModalContext.currentData
        && modalEntityExists('connection', ModalContext.currentData))
        ? !!ModalContext.currentData.bidirectional : false;
      const bidirectional = t.symmetric ? wasBidir : !!(bidirEl && bidirEl.checked);

      const original = ModalContext.currentData;
      const isNew = !modalEntityExists('connection', original);
      const originalLink = isNew ? null
        : DATA.links.find(l => l === original) || findConnection(
          original.source.id || original.source,
          original.target.id || original.target, false);

      const { строка: provenance, состояние: provenanceStatus } = provenanceValue();
      if (!confirmWarnings('Сохранение связи',
          connectionIntegrityWarnings(source, target, type, weight,
                        bidirectional, originalLink)
            .concat(provenanceDriftWarning(originalLink,
              { description, provenance })))) return;

      // Описание идёт по ХРАНИМОЙ схеме — по relations, где концы лежат
      // идентификаторами. В links те же концы — объектами узлов, и путать
      // их нельзя: сервер примет только первое.
      const next = { source, target, type, weight, bidirectional, description,
                ...provenanceFields(provenance, provenanceStatus) };

      if (isNew) {
        const id = generateId('rel');
        const newLink = { id, ...next };
        submitChange(
          describeChange('add', 'relation', id, null, next),
          () => {
            DATA.relations.push({ id, ...next });
            DATA.links.push(newLink);
            addLinkToGraph(newLink);
            afterDataChange({ nodes: true, links: true });
          });
        openUniversalModal('connection', newLink, 'view', { noPush: true });
        return;
      }

      if (!originalLink) { alert('Связь не найдена'); return; }
      // По ИМЕНИ, а не по прежней тройке: правка может менять и концы, и тип,
      // а адрес обязан пережить это неизменным.
      const ri = relationIndexById(originalLink.id);

      const srcNode = conceptById.get(source);
      const tgtNode = conceptById.get(target);
      if (!srcNode || !tgtNode) { alert('Концепции связи не найдены'); return; }

      submitChange(
        describeChange('edit', 'relation', originalLink.id,
                 ri !== -1 ? DATA.relations[ri] : null, next),
        () => {
          Object.assign(originalLink, { source: srcNode, target: tgtNode,
                          type, weight, bidirectional, description });
          if (ri !== -1) {
            DATA.relations[ri] = { ...DATA.relations[ri], ...next };
          } else {
            // Запасная ветка: связь есть в links, но не в relations. Имя берём
            // прежнее, чтобы адрес не сменился на ровном месте.
            const id = originalLink.id || generateId('rel');
            originalLink.id = id;
            DATA.relations.push({ id, ...next });
          }

          updateLinkOnGraph();
          afterDataChange({ nodes: true, links: true });
        });
      openUniversalModal('connection', originalLink, 'view', { noPush: true });
    }

function deleteConnection(sourceId = null, targetId = null) {
      let link = null;
      if (sourceId && targetId) {
        link = findConnection(sourceId, targetId, false)
          || findConnection(sourceId, targetId, true);
      } else {
        const o = ModalContext.currentData;
        if (!o) { alert('Не удалось определить связь для удаления'); return; }
        link = DATA.links.find(l => l === o) || findConnection(
          o.source.id || o.source, o.target.id || o.target, false);
      }
      if (!link) { alert('Связь не найдена'); return; }

      const t = DATA.relationTypesObj[link.type] || {};
      const src = conceptById.get((link.source.id || link.source));
      const tgt = conceptById.get((link.target.id || link.target));
      const pair = isReflexiveLink(link)
        ? '«' + (src ? src.label : '?') + '» на себя'
        : '«' + (src ? src.label : '?') + '» → «' + (tgt ? tgt.label : '?') + '»';

      // Что останется без связей — важнее самого вопроса.
      const orphans = [];
      [src, tgt].forEach(n => {
        if (n && getConceptConnections(n.id).length === 1) orphans.push(n.label);
      });
      let msg = 'Удалить связь ' + pair + ' (' + (t.label || link.type) + ')?';
      if (orphans.length) {
        msg += '\n\nПосле удаления останутся без связей: '
           + [...new Set(orphans)].join(', ') + '.';
      }
      if (!confirm(msg)) return;

      submitChange(
        describeChange('delete', 'relation', link.id, link, null),
        () => {
          removeLinkEverywhere(link);
          afterDataChange({ nodes: true, links: true });
        });

      // Если окно открыто на этой связи — закрываем; если на концепции,
      // перерисовываем, чтобы список связей не врал.
      if (ModalContext.currentEntity === 'connection') {
        closeUniversalModal();
      } else if (ModalContext.currentEntity === 'concept' && ModalContext.currentData) {
        const cur = conceptById.get(ModalContext.currentData.id);
        if (cur) openUniversalModal('concept', cur, ModalContext.currentMode,
                      { noPush: true });
      }
    }

function provenanceFields(line, состояние) {
      const fields = {};
      if (line) fields.provenance = line;
      if (состояние && состояние !== 'unspecified') fields.provenanceStatus = состояние;
      return fields;
    }

export { deleteConcept, deleteConnection, deletePhilosopher, saveConceptData, saveConnectionData, savePhilosopherData };
