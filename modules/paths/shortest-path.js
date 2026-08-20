// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import '../core/graph-index.js';
import { isSymmetricLink, isTypologicalLink } from '../core/link-facts.js';
import { CHRONOLOGY_MODES } from '../core/time.js';
import { isChronologicallyValid, nodeAge, stepWithoutGap } from './chronology.js';

function pathLinkAllowed(l) {
      // Петля не ведёт никуда: путь через неё удлиняется, ничего
      // не достигая, а при взвешенном поиске даёт нулевое приращение
      // расстояния и может зациклить обход.
      const s = (l.source && l.source.id) || l.source;
      const t = (l.target && l.target.id) || l.target;
      if (s === t) return false;
      return !(S.skipTypologicalInPaths && isTypologicalLink(l));
    }

function findShortestPath(sourceId, targetId, respectChronology = true, useDirection = null) {
      // Используем глобальный параметр, если не передан явно
      const shouldRespectDirection = useDirection !== null ? useDirection : S.respectDirection;
      
      if (S.useWeightedPaths) {
        return findShortestPathWeighted(sourceId, targetId, respectChronology, shouldRespectDirection);
      } else {
        return findShortestPathUnweighted(sourceId, targetId, respectChronology, shouldRespectDirection);
      }
    }

function findShortestPathWeighted(sourceId, targetId, respectChronology = true, shouldRespectDirection = true) {
      if (sourceId === targetId) return [sourceId];

      // Режим без разрывов: ход выбирается по концам. Цель раньше источника —
      // ищем ход НАЗАД, и путь читается как родословная: «восходит к».
      const noGaps = respectChronology && S.currentChronologyMode === CHRONOLOGY_MODES.SEAMLESS;
      const yearA = nodeAge(sourceId), yearB = nodeAge(targetId);
      const step = (yearA !== null && yearB !== null && yearB < yearA) ? -1 : +1;
      
      const distances = {};
      const previous = {};
      const unvisited = new Set();
      
      DATA.nodes.forEach(n => {
        distances[n.id] = Infinity;
        previous[n.id] = null;
        unvisited.add(n.id);
      });
      
      distances[sourceId] = 0;

      // Список смежности строится ОДИН раз, а не перебирается заново на
      // каждом шаге: до правки внешний цикл в 248 шагов давал 400 тысяч
      // проходов по массиву связей. Ветвление ниже дословно повторяет
      // прежнее: без разрывов и без учёта направления связь проходима в обе
      // стороны, при учёте направления обратный ход даёт только симметричный
      // тип. Тот же приём уже применён в findShortestPathUnweighted.
      const adjacency = new Map();
      DATA.nodes.forEach(n => adjacency.set(n.id, []));
      DATA.links.forEach(link => {
        if (!pathLinkAllowed(link)) return;
        const src = link.source.id || link.source;
        const tgt = link.target.id || link.target;
        const cost = 4 - (link.weight || 2);
        let a = adjacency.get(src);
        if (!a) { a = []; adjacency.set(src, a); }
        a.push({ id: tgt, type: link.type, cost: cost });
        if (noGaps || !shouldRespectDirection || isSymmetricLink(link)) {
          let b = adjacency.get(tgt);
          if (!b) { b = []; adjacency.set(tgt, b); }
          b.push({ id: src, type: link.type, cost: cost });
        }
      });
      
      while (unvisited.size > 0) {
        // Найти узел с минимальным расстоянием
        let current = null;
        let minDist = Infinity;
        unvisited.forEach(nodeId => {
          if (distances[nodeId] < minDist) {
            minDist = distances[nodeId];
            current = nodeId;
          }
        });
        
        if (current === null || distances[current] === Infinity) break;
        if (current === targetId) break;
        
        unvisited.delete(current);
        
        // Обновить расстояния до соседей.
        // curAge вынесен из цикла: current на его протяжении постоянен, а
        // nodeAge до правки пересчитывался на КАЖДОЙ связи, и каждый
        // пересчёт был линейным поиском по узлам и по философам.
        const curAge = noGaps ? nodeAge(current) : null;
        for (const edge of (adjacency.get(current) || [])) {
          const neighbor = edge.id;
          if (!unvisited.has(neighbor)) continue;

          const alt = distances[current] + edge.cost;

          if (noGaps) {
            // Проверяется ПУТЬ, а не ребро: при монотонности крайний
            // достигнутый год равен году текущего узла, поэтому условие
            // местное и Дейкстра работает без изменений.
            if (!stepWithoutGap(current, neighbor, step, curAge)) continue;
          } else if (respectChronology) {
            // B1: тип ребра определяет, в какую сторону оно читается
            if (!isChronologicallyValid(current, neighbor, S.currentChronologyMode, edge.type)) {
              continue; // Пропускаем этот переход как хронологически некорректный
            }
          }

          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
          }
        }
      }
      
      // Восстановить путь
      if (distances[targetId] === Infinity) return null;
      
      const path = [];
      let current = targetId;
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
      
      return path;
    }

function findShortestPathUnweighted(sourceId, targetId, respectChronology = true, shouldRespectDirection = true) {
      if (sourceId === targetId) return [sourceId];

      // Режим без разрывов: ход выбирается по концам. Цель раньше источника —
      // ищем ход НАЗАД, и путь читается как родословная: «восходит к».
      const noGaps = respectChronology && S.currentChronologyMode === CHRONOLOGY_MODES.SEAMLESS;
      const yearA = nodeAge(sourceId), yearB = nodeAge(targetId);
      const step = (yearA !== null && yearB !== null && yearB < yearA) ? -1 : +1;
      
      const queue = [[sourceId]];
      const visited = new Set([sourceId]);
      
      // B1: список смежности хранит тип ребра — он нужен для проверки хронологии
      const adjacency = {};
      DATA.nodes.forEach(n => adjacency[n.id] = []);
      
      DATA.links.forEach(l => {
        if (!pathLinkAllowed(l)) return;
        const src = l.source.id || l.source;
        const tgt = l.target.id || l.target;
        
        if (noGaps || !shouldRespectDirection) {
          // Без разрывов ход времени задают ГОДЫ, а не стрелка: связь,
          // пройденная против стрелки, читается как «восходит к».
          adjacency[src].push({ id: tgt, type: l.type });
          adjacency[tgt].push({ id: src, type: l.type });
        } else if (shouldRespectDirection) {
          adjacency[src].push({ id: tgt, type: l.type });
          if (isSymmetricLink(l)) {
            adjacency[tgt].push({ id: src, type: l.type });
          }
        } else {
          adjacency[src].push({ id: tgt, type: l.type });
          adjacency[tgt].push({ id: src, type: l.type });
        }
      });
      
      while (queue.length > 0) {
        const path = queue.shift();
        const currentNodeId = path[path.length - 1];
        
        if (currentNodeId === targetId) {
          return path;
        }
        
        const neighbors = adjacency[currentNodeId] || [];
        // curAge вынесен из цикла по той же причине, что и в Дейкстре:
        // currentNodeId постоянен, а nodeAge пересчитывался на каждом соседе.
        const curAge = noGaps ? nodeAge(currentNodeId) : null;
        for (const edge of neighbors) {
          const neighborId = edge.id;
          if (!visited.has(neighborId)) {
            if (noGaps) {
              if (!stepWithoutGap(currentNodeId, neighborId, step, curAge)) continue;
            } else if (respectChronology) {
              // B1: тип ребра определяет, в какую сторону оно читается
              if (!isChronologicallyValid(currentNodeId, neighborId, S.currentChronologyMode, edge.type)) {
                continue; // Пропускаем этот переход как хронологически некорректный
              }
            }
            
            visited.add(neighborId);
            queue.push([...path, neighborId]);
          }
        }
      }
      
      return null;
    }

export { findShortestPath };
