// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

let hintBox = null;

function showHint(el, text) {
      if (!hintBox) {
        hintBox = document.createElement('div');
        hintBox.id = 'hintBox';
        document.body.appendChild(hintBox);
      }
      hintBox.textContent = text;
      hintBox.classList.add('show');

      // Ставим над элементом; если сверху не помещается — под ним, а по
      // горизонтали держим в пределах окна.
      const r = el.getBoundingClientRect();
      const key = hintBox.getBoundingClientRect();
      let x = r.left + r.width / 2 - key.width / 2;
      let y = r.top - key.height - 8;
      if (y < 4) y = r.bottom + 8;
      x = Math.max(4, Math.min(x, window.innerWidth - key.width - 4));
      hintBox.style.left = x + 'px';
      hintBox.style.top = y + 'px';
    }

function hideHint() {
      if (hintBox) hintBox.classList.remove('show');
    }

S.tooltipTimeout = null;

// document.addEventListener('mouseover') @acf7f7d9
function installHintOver() {
document.addEventListener('mouseover', ev => {
      const el = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
      if (el) showHint(el, el.getAttribute('data-tip'));
    });
}

// document.addEventListener('mouseout') @85dee8c5
function installHintOut() {
document.addEventListener('mouseout', ev => {
      const el = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
      if (el && !el.contains(ev.relatedTarget)) hideHint();
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

export { installHintOnClick, installHintOnScroll, installHintOut, installHintOver };
