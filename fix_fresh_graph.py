#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ПРАВКА: применение свежего графа с сервера стирало картинку.

ЧТО БЫЛО. rebuildDerived() заменяет содержимое DATA.nodes и DATA.links
НОВЫМИ объектами: у узлов нет ни x/y, ни vx/vy, у связей source/target —
строки-идентификаторы. Между тем d3 при создании симуляции подменяет
концы связей объектами узлов и держит собственные индексы. После замены
ни один узел не имеет координат, ни одна связь не находит концов — и
отрисовка пропускает всё (draw-link.js:60, geometry.js:34, scene.js:201).
updateGraphData(), которая передаёт массивы симуляции заново, из
remote.js не звалась вовсе: этого ввоза там нет.

ЧТО СТАЛО. Координаты СНИМАЮТСЯ ДО замены и возвращаются узлам, уцелевшим
по идентификатору, — иначе граф прыгал бы при каждом чужом коммите.
Не нашедшимся дают место у середины видимой области, как это уже делает
addNodeToGraph для только что созданного узла. Затем массивы передаются
симуляции заново.

Правит ОБА места, если они есть: source/philosophy_graph_v3.html (там
правка настоящая) и app/modules/data/remote.js (там она временная — слетит
при первой же пересборке, но позволяет проверить на телефоне сегодня).

    python3 fix_fresh_graph.py [корень проекта]
"""
import re, sys, pathlib

корень = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').expanduser()

def шаблоны(префикс_данных, префикс_состояния):
    """Исходник зовёт величины голыми именами (nodes, viewWidth), сборка —
    через пространства (DATA.nodes, S.viewWidth). Один комплект шаблонов на
    оба не годится: подставить не тот префикс значит внести правку, которая
    разберётся, но не сработает."""
    Д = префикс_данных
    С = префикс_состояния
    старое_тело = f"""      {Д}nodes.length = 0;
      {Д}nodes.push(...{Д}concepts.map(c => ({{"""
    новая_голова = f"""      // Координаты снимаются ДО замены: узлы пересоздаются целиком, и без
      // этого граф стирается с экрана, а при чужом коммите — прыгает.
      const былиМеста = new Map();
      for (const у of {Д}nodes) {{
        if (у && у.x !== undefined) былиМеста.set(у.id,
          {{ x: у.x, y: у.y, vx: у.vx || 0, vy: у.vy || 0, fx: у.fx, fy: у.fy }});
      }}
      {Д}nodes.length = 0;
      {Д}nodes.push(...{Д}concepts.map(c => ({{"""
    старый_хвост = f"""      {Д}links.length = 0;
      {Д}links.push(...{Д}relations.map(r => ({{
        id: r.id, source: r.source, target: r.target, type: r.type,
        weight: r.weight, bidirectional: r.bidirectional || false,
        description: r.description,
      }})));
    }}"""
    новый_хвост = f"""      {Д}links.length = 0;
      {Д}links.push(...{Д}relations.map(r => ({{
        id: r.id, source: r.source, target: r.target, type: r.type,
        weight: r.weight, bidirectional: r.bidirectional || false,
        description: r.description,
      }})));

      // Места возвращаются уцелевшим по идентификатору; новым — середина
      // видимой области, как в addNodeToGraph. Без координат d3 ставит узел
      // в (0,0) и выбрасывает рывком через весь экран.
      let середина = null;
      for (const у of {Д}nodes) {{
        const было = былиМеста.get(у.id);
        if (было) {{ Object.assign(у, было); continue; }}
        if (!середина) {{
          try {{ середина = renderState.transform.invert(
            [{С}viewWidth / 2, {С}viewHeight / 2]); }}
          catch (e) {{ середина = [{С}viewWidth / 2, {С}viewHeight / 2]; }}
        }}
        у.x = середина[0] + (Math.random() - 0.5) * 60;
        у.y = середина[1] + (Math.random() - 0.5) * 60;
        у.vx = 0; у.vy = 0;
      }}

      // Массивы передаются симуляции заново: d3 держит свои индексы и
      // подменяет концы связей объектами узлов — после замены содержимого
      // и то и другое устарело.
      updateGraphData();
    }}"""
    return старое_тело, новая_голова, старый_хвост, новый_хвост


def правитьФайл(путь, префикс_данных, префикс_состояния, добавитьВвоз):
    т = путь.read_text(encoding='utf-8')
    if 'былиМеста' in т:
        print(f'  — {путь.name}: правка уже внесена, пропускаю')
        return False
    ст, нг, сх, нх = шаблоны(префикс_данных, префикс_состояния)
    if т.count(ст) != 1 or т.count(сх) != 1:
        print(f'  ✗ {путь.name}: место правки не найдено ровно один раз ('
              f'{т.count(ст)} и {т.count(сх)}) — отказываюсь')
        return False
    т = т.replace(ст, нг).replace(сх, нх)
    if добавитьВвоз:
        ввоз = "import { afterDataChange } from './mutate.js';"
        if ввоз not in т:
            print(f'  ✗ {путь.name}: не нашёл строку ввоза')
            return False
        т = т.replace(ввоз, ввоз
            + "\nimport { updateGraphData } from '../render/scene.js';"
            + "\nimport { renderState } from '../render/canvas-core.js';")
    путь.write_text(т, encoding='utf-8')
    print(f'  ✓ {путь.name}: правка внесена')
    return True


цели = [
    # (файл, префикс данных, префикс состояния, дописывать ли ввозы)
    (корень / 'source' / 'philosophy_graph_v3.html', '', '', False),
    (корень / 'app' / 'modules' / 'data' / 'remote.js', 'DATA.', 'S.', True),
]
сделано = 0
for путь, пд, пс, ввоз in цели:
    if путь.exists():
        сделано += правитьФайл(путь, пд, пс, ввоз)
    else:
        print(f'  — {путь}: нет, пропускаю')

print(f'\nПравок внесено: {сделано}')
