// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { api, serverMode } from '../core/api.js';
import { emit } from '../core/events.js';
import { afterDataChange } from './mutate.js';
import { renderState } from '../render/canvas-core.js';
import { updateGraphData } from '../render/scene.js';

let knownGraphVersion = 0;

function replaceEntity(набор, id, запись) {
      const i = набор.findIndex(з => з.id === id);
      if (запись === null) {
        if (i === -1) return false;
        набор.splice(i, 1); return true;
      }
      if (i === -1) { набор.push(запись); return true; }
      набор[i] = запись; return true;
    }

function applyIncrement(приращение) {
      const наборы = { concepts: DATA.concepts, relations: DATA.relations, philosophers: DATA.philosophers,
                       traditions: DATA.traditions, rubrics: DATA.rubrics, relationTypes: DATA.relationTypes };
      const тронуто = [];
      for (const и of приращение.изменения || []) {
        const набор = наборы[и.набор];
        if (!набор) continue;
        if (replaceEntity(набор, и.entityId, и.удалена ? null : и.запись)) {
          тронуто.push({ kind: и.kind, entityId: и.entityId });
        }
      }
      if (тронуто.length) {
        rebuildDerived();
        afterDataChange({ philosophers: true, nodes: true, links: true });
      }
      knownGraphVersion = приращение.версия;
      return тронуто;
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
        const всё = await api('/api/graph');
        if (!всё.годно || !всё.тело || !всё.тело.data) return [];
        applyFreshGraph(всё.тело.data);
        knownGraphVersion = всё.тело.data.версия || 0;
        return [];
      }

      const ответ = await api('/api/graph?since=' + encodeURIComponent(knownGraphVersion));
      if (!ответ.годно || !ответ.тело || !ответ.тело.data) return [];
      const тронуто = applyIncrement(ответ.тело.data);
      if (тронуто.length) emit('graph-updated-remotely', тронуто);
      return тронуто;
    }

function connectLive() {
      if (!serverMode || typeof WebSocket === 'undefined') return null;
      // Прежнее соединение закрываем: иначе после входа их станет два, и
      // каждое приращение возьмётся дважды.
      if (liveSocket) { try { liveSocket.close(); } catch (e) { /* уже мертво */ } }
      const адрес = (location.protocol === 'https:' ? 'wss://' : 'ws://')
                  + location.host + '/ws';
      let сокет;
      try { сокет = new WebSocket(адрес); } catch (e) { return null; }
      сокет.addEventListener('message', событие => {
        let сообщение;
        try { сообщение = JSON.parse(событие.data); } catch (e) { return; }
        if (сообщение.type === 'broadcast' || сообщение.type === 'notification') {
          pullGraphSince();
        }
        if (сообщение.type === 'notification' || сообщение.type === 'broadcast') {
          emit('notification-arrived', сообщение);
        }
      });
      сокет.addEventListener('open', () => { liveRetry = 0; });
      // Разрыв — не беда: страница работает и без живого соединения. Но
      // соединение ВОССТАНАВЛИВАЕТСЯ с растущей задержкой: сеть моргает
      // чаще, чем кажется, а бить в дверь без передышки — верный способ
      // получить отказ и от исправного сервера.
      сокет.addEventListener('close', () => {
        liveSocket = null;
        if (!serverMode || S.liveClosedOnPurpose) return;
        const пауза = Math.min(30000, 500 * Math.pow(2, liveRetry++));
        setTimeout(() => { if (!liveSocket) connectLive(); }, пауза);
      });
      liveSocket = сокет;
      return сокет;
    }

let liveSocket = null;

let liveRetry = 0;

S.liveClosedOnPurpose = false;

function rebuildDerived() {
      const поИмени = {};
      for (const ф of DATA.philosophers) поИмени[ф.id] = ф.nameRu || ф.name;
      // Координаты снимаются ДО замены: узлы пересоздаются целиком, и без
      // этого граф стирается с экрана, а при чужом коммите — прыгает.
      const былиМеста = new Map();
      for (const у of DATA.nodes) {
        if (у && у.x !== undefined) былиМеста.set(у.id,
          { x: у.x, y: у.y, vx: у.vx || 0, vy: у.vy || 0, fx: у.fx, fy: у.fy });
      }
      DATA.nodes.length = 0;
      DATA.nodes.push(...DATA.concepts.map(c => ({
        id: c.id, label: c.label, concept: поИмени[c.philosopher],
        rubrics: c.rubrics || [], description: c.description,
        extendedDescription: c.extendedDescription,
      })));
      DATA.links.length = 0;
      DATA.links.push(...DATA.relations.map(r => ({
        id: r.id, source: r.source, target: r.target, type: r.type,
        weight: r.weight, bidirectional: r.bidirectional || false,
        description: r.description,
      })));

      // Места возвращаются уцелевшим по идентификатору; новым — середина
      // видимой области, как в addNodeToGraph. Без координат d3 ставит узел
      // в (0,0) и выбрасывает рывком через весь экран.
      let середина = null;
      for (const у of DATA.nodes) {
        const было = былиМеста.get(у.id);
        if (было) { Object.assign(у, было); continue; }
        if (!середина) {
          try { середина = renderState.transform.invert(
            [S.viewWidth / 2, S.viewHeight / 2]); }
          catch (e) { середина = [S.viewWidth / 2, S.viewHeight / 2]; }
        }
        у.x = середина[0] + (Math.random() - 0.5) * 60;
        у.y = середина[1] + (Math.random() - 0.5) * 60;
        у.vx = 0; у.vy = 0;
      }

      // Массивы передаются симуляции заново: d3 держит свои индексы и
      // подменяет концы связей объектами узлов — после замены содержимого
      // и то и другое устарело.
      updateGraphData();
    }

function applyFreshGraph(состояние) {
      const н = состояние && состояние.наборы;
      if (!н) return false;
      if (Array.isArray(н.concepts))      { DATA.concepts.length = 0;      DATA.concepts.push(...н.concepts); }
      if (Array.isArray(н.relations))     { DATA.relations.length = 0;     DATA.relations.push(...н.relations); }
      if (Array.isArray(н.philosophers))  { DATA.philosophers.length = 0;  DATA.philosophers.push(...н.philosophers); }
      if (Array.isArray(н.traditions))    { DATA.traditions.length = 0;    DATA.traditions.push(...н.traditions); }
      if (Array.isArray(н.rubrics))       { DATA.rubrics.length = 0;       DATA.rubrics.push(...н.rubrics); }
      if (Array.isArray(н.relationTypes)) { DATA.relationTypes.length = 0; DATA.relationTypes.push(...н.relationTypes); }

      rebuildDerived();
      afterDataChange({ philosophers: true, nodes: true, links: true });
      return true;
    }

export { applyFreshGraph, connectLive, knownGraphVersion, liveSocket, pullGraphSince };
