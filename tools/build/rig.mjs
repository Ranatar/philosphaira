#!/usr/bin/env node
// Оснастка для приборов приёмки.
//
// Мост (bridge.js) существовал ради разметки. Разметка переведена на
// делегирование и в нём больше не нуждается — но приборы приёмки зовут
// действия по имени, и им нужна точка входа. Класть её в window навсегда
// значило бы вернуть мост под другим названием.
//
// Поэтому: отдельный файл _probe-rig.js, который приборы подключают САМИ
// (модульным тегом) и который в обычной работе приложения не участвует.
// Имя начинается с подчёркивания — счётчик долга такие пропускает, как и
// эталонную копию исходника.
import fs from 'node:fs';
import path from 'node:path';
import { ДЕРЕВО } from '../paths.mjs';

const ROOT = process.argv[2] || ДЕРЕВО;

// ИМЕНА, КОТОРЫЕ ЗОВУТ ПРИБОРЫ. Список — объединение по ВСЕМ приборам: раньше
// каждый ввозил модули сам, зашивая пути, и всякое переименование модуля
// роняло прибор (probe6 сорвался на переезде findConnection, delegate.mjs — на
// переименовании edit-common). Теперь путь знает только эта программа, а она
// его вычисляет.
const ИМЕНА = `selectedNodes selectedEdges authLogout cancelGraphSelection changeFilterMode
clearLegendSearch clearPhilosopherSearch clearSimilarityOverlay closeAboutModal closeAuthModal
closeConceptProfileModal closePathDescriptionsModal closePhilosopherProfileModal closeStatsModal
closeUniversalModal collectData deselectAllPhilosophers deselectAllRubrics exportToPNG exportToSVG
findAndShowPath findConnection findShortestPath freezeSimulation getConceptConnections
handleConnectionViewSearch handleLegendLinkSearch handleLegendPhilSearch handleLegendSearch
handleMetricsScopeChange handleModalSearch handlePhilosopherSearch handleStatsParameterChange
hasNodeClass hasUnsaved highlightConnected highlightNodeById highlightPhilosopherOnGraph
isLinkVisible isNodeVisible linkDrawAlpha linkVisualState onlyTradition openAboutModal
api subscribe emit connectLive showImpact loadCommits openCommitsPanel openAuthModal openSecurityModal startMfaEnroll confirmMfaEnroll refreshSecurityDone openConceptById openEditConceptModal refreshProvenanceField provenanceValue openEditConnectionModal openStatsModal loadStatsContent saveObservation pickObservation
openUniversalModal pickLink pickLinkEnd pickNode resetBeyondFilter resetHighlight
selectAllPhilosophers selectAllRelations selectAllRubrics selectAllTraditions selectCustomOption
selectSearchResult setSearchKind showConceptProfileModal showCustomSelectDropdown
showPathDescriptionsModal showPhilosopherProfileModal showSimilarityOverlay submitAuth
switchStatsView toGraph toggleConnectionSearchSection toggleGrouping toggleLegendSearch
toggleMetricLayout toggleMetricValueMode toggleModalMode togglePhilosopher unfreezeSimulation
DATA_SETS actionNames
profileSimilarity structuralSimilarity profileIsMeaningful medianNodeDegree nodeDegreeOf
isSymmetricLink similarityData renderState gfxCanvas lastSubmitted serverMode lastSubmitResult
can PERM authSession authLogout openAuthModal submitAuth openEditConceptModal refreshProvenanceField provenanceValue closeUniversalModal saveConceptData rebuildOverCurrent showConflict lastConflict pullGraphSince knownGraphVersion refreshUnread loadNotifications toggleNotifyPanel markAllNotificationsRead notifyItems unreadCount openCommitsPanel switchCommitTab loadCommits commitItems commitTab commitError closeCommitsPanel openUsersPanel loadUsers userItems usersError closeUsersPanel
saveConceptData saveConnectionData deleteConnection
addLinkToGraph graphFingerprint applyStoredLayout layoutFromStore resetSimulation planRelayout applyRelayout layoutPlan loadLayoutHistory askLayoutRevert doLayoutRevert layoutHistoryItems layoutRevertTo
philosopherSimilarity philosopherSimilarityData initializePhilosophyMetrics`.split(/\s+/).filter(Boolean);

// ГДЕ ЧТО ВЫВОЗИТСЯ и ЧТО ПЕРЕПРИСВАИВАЕТСЯ.
//
// Второе — не мелочь, а причина четырёх молчаливых поломок подряд.
// Величина, объявленная через let, меняется со временем; положенная в
// объект оснастки ЗНАЧЕНИЕМ, она навсегда застывает на том, чем была при
// загрузке, и прибор читает старое, не жалуясь. Так молчали renderState,
// lastSubmitted, serverMode и notifyItems. Правило было записано в readme,
// но применялось по памяти — теперь его применяет программа: всякое let
// попадает в свойства САМО.
const exportsOf = new Map();
const переприсваиваемые = new Set();

(function обойти(папка) {
  for (const имя of fs.readdirSync(папка)) {
    const путь = path.join(папка, имя);
    if (fs.statSync(путь).isDirectory()) { if (имя !== 'vendor') обойти(путь); continue; }
    if (!путь.endsWith('.js') || имя.startsWith('_')) continue;
    const отн = path.relative(ROOT, путь).replace(/\\/g, '/');
    const текст = fs.readFileSync(путь, 'utf8');
    for (const m of текст.matchAll(/^export \{([^}]*)\};?$/gm))
      for (const n of m[1].split(',').map(x => x.trim()).filter(Boolean))
        exportsOf.set(n, отн);
    for (const m of текст.matchAll(/^export (?:async )?function (\w+)/gm)) exportsOf.set(m[1], отн);
    for (const m of текст.matchAll(/^export const (\w+)/gm)) exportsOf.set(m[1], отн);
    for (const m of текст.matchAll(/^let (\w+)/gm)) переприсваиваемые.add(m[1]);
  }
})(ROOT);

// Кого откуда ввозить.
const нужно = new Map();
const нет = [];
for (const имя of ИМЕНА) {
  const дом = exportsOf.get(имя);
  if (!дом) { нет.push(имя); continue; }
  if (!нужно.has(дом)) нужно.set(дом, new Set());
  нужно.get(дом).add(имя);
}

const все = [...new Set([...нужно.values()].flatMap(с => [...с]))].sort();
const живые = все.filter(имя => переприсваиваемые.has(имя));   // let — свойством
const мёртвые = все.filter(имя => !переприсваиваемые.has(имя)); // прочее — значением

// Имена, которые живут ТО в общем состоянии, ТО переменной своего модуля.
// Раскладка со временем меняется, поэтому смотрим в оба места: сперва S,
// потом вывоз. Иначе прибор врёт при каждой такой перестановке.
const ИЗ_ОБОИХ = ['selectedNodes', 'selectedEdges', 'renderState', 'gfxCanvas'];

// Имена, которые берутся прямо из пространств. Их в ИМЕНА нет — они не
// вывозятся модулями, а лежат в DATA и S.
const ИЗ_ПРОСТРАНСТВ = {
  nodes: 'DATA.nodes', links: 'DATA.links', concepts: 'DATA.concepts',
  relations: 'DATA.relations', philosophers: 'DATA.philosophers',
  isStatsModalOpen: 'S.isStatsModalOpen', simulation: 'S.simulation',
  tickCount: 'S.tickCount',
};

const ввозы = [...нужно.keys()].sort().map(м =>
  `import { ${[...нужно.get(м)].sort().join(', ')} } from './${
    м.startsWith('modules/') ? м : 'modules/' + м}';`).join('\n');

const свойство = имя => ИЗ_ОБОИХ.includes(имя)
  ? `  ${имя}: { get: () => (S.${имя} !== undefined ? S.${имя} : ЖИВЫЕ.${имя}) },`
  : `  ${имя}: { get: () => ЖИВЫЕ.${имя} },`;

const out = `// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// СГЕНЕРИРОВАНО tools/build/rig.mjs — правки вносить ТУДА, не сюда.
//
// Имена, объявленные через let, отданы СВОЙСТВАМИ, а не значениями:
// значение застывает на миге подключения, и прибор читает старое молча.
// Список порождён обходом дерева, а не памятью человека.
import { DATA, S, MET, VIEWS } from './modules/core/ns.js';
${ввозы}

const A = { DATA, S, MET, VIEWS${мёртвые.length ? ', ' + мёртвые.join(', ') : ''} };

// Живые величины — через посредника: обращение к нему читает переменную
// модуля в тот миг, когда спросили.
const ЖИВЫЕ = {
${живые.map(n => `  get ${n}() { return typeof ${n} !== 'undefined' ? ${n} : undefined; },`).join('\n')}
};

Object.defineProperties(A, {
${Object.entries(ИЗ_ПРОСТРАНСТВ).map(([n, п]) => `  ${n}: { get: () => ${п} },`).join('\n')}
${живые.map(свойство).join('\n')}
});

window.__app = A;
window.__appReady = true;
`;

fs.writeFileSync(path.join(ROOT, '_probe-rig.js'), out);
console.log(`оснастка: имён ${ИМЕНА.length - нет.length} из ${ИМЕНА.length}`
  + `; свойствами ${живые.length}, значениями ${мёртвые.length}`
  + (нет.length ? `; не вывозятся: ${нет.join(', ')}` : ''));
