// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { gfxSvg } from './canvas-core.js';
import { gfxZoom } from './d3-layer.js';
import { requestDraw } from './loop.js';
import { rebuildQuadtree } from './picking.js';
import { ensureAnimLoop, needsContinuousAnimation } from './scene.js';
import { resetHighlight } from './selection.js';

const maxTicks = 300;

// S.simulation.on("tick") @a784a5a3
function installSimulationTick() {
S.simulation.on("tick", () => {
      // Ф0.5/Б12: d3-timer уже синхронизирован с кадрами, поэтому обёртка
      // requestAnimationFrame только добавляла кадр задержки, а троттлинг
      // по Date.now() стоял ДО tickCount++ — счётчик не рос на отброшенных
      // кадрах, и симуляция крутилась дольше заявленных maxTicks.
      S.tickCount++;

      rebuildQuadtree();
      S.pickDirty = true;
      requestDraw();

      if (S.tickCount >= maxTicks) {
        S.simulation.stop();
      }
    });
}

// S.simulation.on("end.stats") @0d772bb9
function installSimulationStatsEnd() {
S.simulation.on("end.stats", () => {
      console.log("Симуляция завершена после", S.tickCount, "тиков");
      console.log("Производительность - узлов:", DATA.nodes.length, "связей:", DATA.links.length);
      
      // Информация о памяти (если доступно)
      if (performance.memory) {
        console.log("Использование памяти:", 
          Math.round(performance.memory.usedJSHeapSize / 1048576), "МБ");
      }
    });
}

function resetSimulation() {
      DATA.nodes.forEach(n => {
        n.fx = null;
        n.fy = null;
      });
      resetHighlight();
      S.tickCount = 0;
      S.simulation.alpha(1).restart();
    }

function toggleSimulationFreeze() {
      if (simLockedByHand) {
        simLockedByHand = false;
        const settled = !S.simulation || S.tickCount >= maxTicks;
        unfreezeSimulation('рука');
        if (settled) showTemporaryMessage('Раскладка уже улеглась — двигаться нечему', 2000);
      } else {
        freezeSimulation('рука');
      }
      updateFreezeButton();
    }

function updateFreezeButton() {
      const b = document.getElementById('freezeBtn');
      if (!b) return;
      // Только значок: панель держится на значках, а слово живёт в
      // подсказке. Прежде кнопка переписывала себе подпись при нажатии, и
      // панель на глазах раздувалась.
      b.textContent = simLockedByHand ? '▶️' : '❄️';
      b.setAttribute('data-tip', simLockedByHand
        ? 'Раскладка остановлена вручную и не оттаивает при закрытии окон'
        : 'Остановить раскладку насовсем — окна её больше не запустят');
      b.classList.toggle('frozen-by-hand', !!simLockedByHand);
    }

function centerGraph() {
      const transform = d3.zoomIdentity
        .translate(window.innerWidth / 2, window.innerHeight / 2)
        .scale(1);
      gfxSvg.transition().duration(750).call(gfxZoom.transform, transform);
      S.simulation.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
      S.tickCount = 0;
      S.simulation.alpha(0.3).restart();
    }

let simLockedByHand = false;

function freezeSimulation(source) {
      if (source === 'рука') simLockedByHand = true;
      if (S.simulation) S.simulation.stop();
    }

function unfreezeSimulation(source) {
      // Замок сильнее окон: пока он стоит, закрытие окна раскладку не будит.
      if (simLockedByHand && source !== 'рука') return;
      // Окно закрылось — граф снова виден, возобновляем непрерывную
      // отрисовку. Сам цикл не проснётся: он завершился, и
      // animLoopRunning уже false.
      if (typeof ensureAnimLoop === 'function'
        && typeof needsContinuousAnimation === 'function'
        && needsContinuousAnimation()) {
        ensureAnimLoop();
      }
      if (S.simulation && S.tickCount < maxTicks) {
        // Возобновляем симуляцию с небольшой энергией
        S.simulation.alpha(0.3).restart();
        // console.log("Симуляция разморожена");
      }
    }

// S.simulation.on("end.log") @c3b35574
function installSimulationLog() {
S.simulation.on("end.log", () => {
      console.log("Симуляция завершена. Запустите анализ вручную.");
    });
}

export { centerGraph, freezeSimulation, installSimulationLog, installSimulationStatsEnd, installSimulationTick, maxTicks, resetSimulation, simLockedByHand, toggleSimulationFreeze, unfreezeSimulation, updateFreezeButton };
