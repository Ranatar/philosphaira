// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { api, serverMode } from '../core/api.js';
import { emit } from '../core/events.js';
import { afterDataChange } from './mutate.js';
import { applyServerLayout } from '../state/render.js';

let knownGraphVersion = 0;

function replaceEntity(set, id, запись) {
      const at = set.findIndex(z => z.id === id);
      if (запись === null) {
        if (at === -1) return false;
        set.splice(at, 1); return true;
      }
      if (at === -1) { set.push(запись); return true; }
      set[at] = запись; return true;
    }

function applyIncrement(приращение) {
      const sets = { concepts: DATA.concepts, relations: DATA.relations, philosophers: DATA.philosophers,
                       traditions: DATA.traditions, rubrics: DATA.rubrics, relationTypes: DATA.relationTypes };
      const touched = [];
      for (const i of приращение.изменения || []) {
        const set = sets[i.набор];
        if (!set) continue;
        if (replaceEntity(set, i.entityId, i.удалена ? null : i.запись)) {
          touched.push({ kind: i.kind, entityId: i.entityId });
        }
      }
      if (touched.length) {
        rebuildDerived();
        afterDataChange({ philosophers: true, nodes: true, links: true });
      }
      knownGraphVersion = приращение.версия;
      return touched;
    }

async function pullGraphSince() {
      if (!serverMode) return [];

      // ПЕРВЫЙ РАЗ — ЦЕЛИКОМ, дальше приращениями.
      //
      // «Приращение с нуля» полной базы НЕ даёт, и это не оплошность
      // сервера: сущности, легшие переносом, помечены версией ноль, а
      // приращение отдаёт то, что СТРОГО НОВЕЕ запрошенной версии. Я
      // написал в комментарии обратное и на том попался: страница осталась
      // с версией ноль и чужих правок не видела вовсе. Проба показала это
      // сразу тремя утверждениями.
      if (!knownGraphVersion) {
        const all = await api('/api/graph');
        if (!all.годно || !all.тело || !all.тело.data) return [];
        applyFreshGraph(all.тело.data);
        knownGraphVersion = all.тело.data.версия || 0;
        return [];
      }

      const reply = await api('/api/graph?since=' + encodeURIComponent(knownGraphVersion));
      if (!reply.годно || !reply.тело || !reply.тело.data) return [];
      const touched = applyIncrement(reply.тело.data);
      // Раскладка приходит с приращением только когда она новее той, что у
      // нас, — то есть после чужой правки, задевшей состав узлов и связей.
      // Ставится ПОСЛЕ применения приращения: сперва новые сущности, потом
      // их места.
      applyServerLayout(reply.тело.data.раскладка && reply.тело.data.раскладка.позиции);
      if (touched.length) emit('graph-updated-remotely', touched);
      return touched;
    }

function connectLive() {
      if (!serverMode || typeof WebSocket === 'undefined') return null;
      // Прежнее соединение закрываем: иначе после входа их станет два, и
      // каждое приращение возьмётся дважды.
      if (liveSocket) { try { liveSocket.close(); } catch (e) { /* уже мертво */ } }
      const address = (location.protocol === 'https:' ? 'wss://' : 'ws://')
                  + location.host + '/ws';
      let socket;
      try { socket = new WebSocket(address); } catch (e) { return null; }
      socket.addEventListener('message', событие => {
        let message;
        try { message = JSON.parse(событие.data); } catch (e) { return; }
        if (message.type === 'broadcast' || message.type === 'notification') {
          pullGraphSince();
        }
        if (message.type === 'notification' || message.type === 'broadcast') {
          emit('notification-arrived', message);
        }
      });
      socket.addEventListener('open', () => { liveRetry = 0; });
      // Разрыв — не беда: страница работает и без живого соединения. Но
      // соединение ВОССТАНАВЛИВАЕТСЯ с растущей задержкой: сеть моргает
      // чаще, чем кажется, а бить в дверь без передышки — верный способ
      // получить отказ и от исправного сервера.
      socket.addEventListener('close', () => {
        liveSocket = null;
        if (!serverMode || S.liveClosedOnPurpose) return;
        const pause = Math.min(30000, 500 * Math.pow(2, liveRetry++));
        setTimeout(() => { if (!liveSocket) connectLive(); }, pause);
      });
      liveSocket = socket;
      return socket;
    }

let liveSocket = null;

let liveRetry = 0;

S.liveClosedOnPurpose = false;

function rebuildDerived() {
      const byName = {};
      for (const f of DATA.philosophers) byName[f.id] = f.nameRu || f.name;
      // Координаты снимаются ДО замены: узлы пересоздаются целиком, и без
      // этого граф стирается с экрана, а при чужом коммите — прыгает.
      const priorPlaces = new Map();
      for (const node of DATA.nodes) {
        if (node && node.x !== undefined) priorPlaces.set(node.id,
          { x: node.x, y: node.y, vx: node.vx || 0, vy: node.vy || 0, fx: node.fx, fy: node.fy });
      }
      DATA.nodes.length = 0;
      DATA.nodes.push(...DATA.concepts.map(c => ({
        id: c.id, label: c.label, concept: byName[c.philosopher],
        rubrics: c.rubrics || [], description: c.description,
        extendedDescription: c.extendedDescription,
        provenance: c.provenance, provenanceStatus: c.provenanceStatus,
      })));
      DATA.links.length = 0;
      DATA.links.push(...DATA.relations.map(r => ({
        id: r.id, source: r.source, target: r.target, type: r.type,
        weight: r.weight, bidirectional: r.bidirectional || false,
        description: r.description, provenance: r.provenance,
        provenanceStatus: r.provenanceStatus,
      })));

      // Места возвращаются уцелевшим по идентификатору; новым — середина
      // области. БЕЗ renderState: слой данных не смеет спрашивать слой
      // отрисовки — прибор слоёв показал ребро ввоза снизу вверх, как
      // только оно появилось. Разница видна лишь при сильном увеличении,
      // а укладка всё равно тут же двинет новый узел к его месту.
      const viewCenter = [S.viewWidth / 2, S.viewHeight / 2];
      for (const u of DATA.nodes) {
        const prior = priorPlaces.get(u.id);
        if (prior) { Object.assign(u, prior); continue; }
        u.x = viewCenter[0] + (Math.random() - 0.5) * 60;
        u.y = viewCenter[1] + (Math.random() - 0.5) * 60;
        u.vx = 0; u.vy = 0;
      }

      // МАССИВЫ СИМУЛЯЦИИ ПЕРЕДАЮТСЯ НЕ ОТСЮДА: слой данных не смеет звать
      // слой отрисовки. Это делает подписчик `data-changed`, стоящий ПЕРВЫМ
      // среди подписок запуска, — см. пояснение там же о том, почему первым.
    }

function applyFreshGraph(state2) {
      const sets = state2 && state2.наборы;
      if (!sets) return false;
      if (Array.isArray(sets.concepts))      { DATA.concepts.length = 0;      DATA.concepts.push(...sets.concepts); }
      if (Array.isArray(sets.relations))     { DATA.relations.length = 0;     DATA.relations.push(...sets.relations); }
      if (Array.isArray(sets.philosophers))  { DATA.philosophers.length = 0;  DATA.philosophers.push(...sets.philosophers); }
      if (Array.isArray(sets.traditions))    { DATA.traditions.length = 0;    DATA.traditions.push(...sets.traditions); }
      if (Array.isArray(sets.rubrics))       { DATA.rubrics.length = 0;       DATA.rubrics.push(...sets.rubrics); }
      if (Array.isArray(sets.relationTypes)) { DATA.relationTypes.length = 0; DATA.relationTypes.push(...sets.relationTypes); }

      rebuildDerived();
      afterDataChange({ philosophers: true, nodes: true, links: true });
      // ПОРЯДОК СУЩЕСТВЕНЕН: afterDataChange будит укладку, и координаты
      // ставятся ПОСЛЕ неё — иначе симуляция стронет узлы с присланных мест.
      applyServerLayout(state2.раскладка && state2.раскладка.позиции);
      return true;
    }

export { applyFreshGraph, connectLive, knownGraphVersion, liveSocket, pullGraphSince };
