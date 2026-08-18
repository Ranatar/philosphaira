// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

function togglePanel(panelId) {
      const panel = document.getElementById(panelId);
      const isCollapsed = panel.classList.contains('collapsed');
      
      if (isCollapsed) {
        panel.classList.remove('collapsed');
        // Меняем иконку на минус
        const btn = panel.querySelector('.collapse-btn .expand-icon');
        btn.textContent = '−';
        // Сохраняем состояние
        localStorage.setItem(`${panelId}_collapsed`, 'false');
      } else {
        panel.classList.add('collapsed');
        // Меняем иконку на плюс
        const btn = panel.querySelector('.collapse-btn .expand-icon');
        btn.textContent = '+';
        // Сохраняем состояние
        localStorage.setItem(`${panelId}_collapsed`, 'true');
      }
    }

function restorePanelStates() {
      const panels = ['pathFinder', 'statsPanel'];
      
      panels.forEach(panelId => {
        const collapsed = localStorage.getItem(`${panelId}_collapsed`) === 'true';
        if (collapsed) {
          const panel = document.getElementById(panelId);
          if (!panel) return;   // Б15: statsPanel в разметке отсутствует
          panel.classList.add('collapsed');
          const btn = panel.querySelector('.collapse-btn .expand-icon');
          if (btn) btn.textContent = '+';
        }
      });
    }

export { restorePanelStates, togglePanel };
