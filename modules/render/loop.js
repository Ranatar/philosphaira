// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

let drawScheduled = false;

let painter = null;

function setPainter(handler) { painter = handler; }

function requestDraw() {
      if (drawScheduled) return;
      drawScheduled = true;
      requestAnimationFrame(() => {
        drawScheduled = false;
        if (painter) painter();
        else console.error('цикл кадров: рисовальщик не назначен');
      });
    }

export { requestDraw, setPainter };
