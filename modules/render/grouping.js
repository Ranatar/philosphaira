// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.
import { DATA, S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import '../core/graph-index.js';
import '../state/render.js';
import { resizeCanvas } from './canvas-core.js';
import { resetHighlight } from './selection.js';
import { pullStrengthOf, resetLayoutClock } from '../state/render.js';

const philosopherNames = Object.keys(DATA.philosopherConcepts);

const groupPositions = {};

const cols = 6;

const rows = Math.ceil(philosopherNames.length / cols);

S.spacingX = S.viewWidth / (cols + 1);

S.spacingY = S.viewHeight / (rows + 1);

// philosopherNames.forEach((phil) @41664ece
function buildGroupPositions() {
philosopherNames.forEach((phil, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      groupPositions[phil] = {
        x: S.spacingX * (col + 1),
        y: S.spacingY * (row + 1)
      };
    });
}

function toggleGrouping() {
      S.isGrouped = !S.isGrouped;
      const btn = document.getElementById('groupBtn');
      
      resetHighlight();
      
      if (S.isGrouped) {
        btn.classList.add('active');
        btn.textContent = '📦';
        btn.setAttribute('data-tip', 'Разгруппировать: вернуть свободную раскладку');
        
        // Добавляем силы группировки
        S.simulation
          .force("x", d3.forceX(d => groupPositions[d.concept].x).strength(0.3))
          .force("y", d3.forceY(d => groupPositions[d.concept].y).strength(0.3))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("collision", d3.forceCollide().radius(40));
        // Тяга к середине ГАСИТСЯ, а не снимается: снятая сила исчезла бы
        // насовсем, а гашение обратимо одной строкой ниже.
        S.simulation.force("pullX").strength(0);
        S.simulation.force("pullY").strength(0);
      } else {
        btn.classList.remove('active');
        btn.textContent = '📦';
        btn.setAttribute('data-tip', 'Сгруппировать узлы по философам');
        
        // Убираем силы группировки
        S.simulation
          .force("x", null)
          .force("y", null)
          .force("charge", d3.forceManyBody().strength(-350))
          .force("collision", d3.forceCollide().radius(45))
          .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
        S.simulation.force("pullX").strength(pullStrengthOf);
        S.simulation.force("pullY").strength(pullStrengthOf);
      }
      resetLayoutClock();
      S.simulation.alpha(0.5).restart();
    }

// window.addEventListener('resize') @f7a8b18f
function installResize() {
window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      // Б4: держим глобальные размеры в актуальном состоянии —
      // от них зависят все четыре функции камеры и exportToPNG
      S.viewWidth = newWidth;
      S.viewHeight = newHeight;
      resizeCanvas();
      
      // Пересчитываем позиции групп
      const newSpacingX = newWidth / (cols + 1);
      const newSpacingY = newHeight / (rows + 1);
      philosopherNames.forEach((phil, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        groupPositions[phil] = {
          x: newSpacingX * (col + 1),
          y: newSpacingY * (row + 1)
        };
      });
      
      if (S.isGrouped) {
        S.simulation
          .force("x", d3.forceX(d => groupPositions[d.concept].x).strength(0.3))
          .force("y", d3.forceY(d => groupPositions[d.concept].y).strength(0.3));
      } else {
        S.simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      }
      // forceX вычисляет цель ОДИН РАЗ, при инициализации силы. Без этих
      // двух строк после разворота окна центр тяжести и центр тяги
      // разъезжаются, и граф тянут в разные стороны две силы сразу.
      S.simulation.force("pullX").x(newWidth / 2);
      S.simulation.force("pullY").y(newHeight / 2);
      
      S.simulation.alpha(0.3).restart();
    });
}

export { buildGroupPositions, installResize, toggleGrouping };
