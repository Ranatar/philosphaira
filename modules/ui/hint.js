// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

let hintBox = null;

function showHint(эл, текст) {
      if (!hintBox) {
        hintBox = document.createElement('div');
        hintBox.id = 'hintBox';
        document.body.appendChild(hintBox);
      }
      hintBox.textContent = текст;
      hintBox.classList.add('show');

      // Ставим над элементом; если сверху не помещается — под ним, а по
      // горизонтали держим в пределах окна.
      const r = эл.getBoundingClientRect();
      const к = hintBox.getBoundingClientRect();
      let x = r.left + r.width / 2 - к.width / 2;
      let y = r.top - к.height - 8;
      if (y < 4) y = r.bottom + 8;
      x = Math.max(4, Math.min(x, window.innerWidth - к.width - 4));
      hintBox.style.left = x + 'px';
      hintBox.style.top = y + 'px';
    }

function hideHint() {
      if (hintBox) hintBox.classList.remove('show');
    }

S.tooltipTimeout = null;

// document.addEventListener('mouseover') @8a2e7fc6
function installHintOver() {
document.addEventListener('mouseover', ev => {
      const эл = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
      if (эл) showHint(эл, эл.getAttribute('data-tip'));
    });
}

// document.addEventListener('mouseout') @8a9ed5ad
function installHintOut() {
document.addEventListener('mouseout', ev => {
      const эл = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
      if (эл && !эл.contains(ev.relatedTarget)) hideHint();
    });
}

// document.addEventListener('scroll') @64e740c4
function installHintOnScroll() {
document.addEventListener('scroll', hideHint, true);
}

// document.addEventListener('click') @d0a2e14a
function installHintOnClick() {
document.addEventListener('click', hideHint, true);
}

export { hideHint, hintBox, installHintOnClick, installHintOnScroll, installHintOut, installHintOver, showHint };
