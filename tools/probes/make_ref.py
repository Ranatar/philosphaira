#!/usr/bin/env python3
"""Кладёт эталон в дерево сборки.

Приёмка сравнивает две страницы, и обе должны идти с одного сервера, иначе
браузер применит разные ограничения. Поэтому одностраничная версия кладётся
внутрь дерева под именем _ref-orig.html (имя с подчёркивания — счётчик долга
и проверка модулей такие пропускают), а ссылка на d3 переводится на местную
копию: сети у приёмки может не быть вовсе.
"""
import sys, pathlib
import os.path as _p
# paths.py лежит этажом выше: программы разнесены по подпапкам 10 сентября 2026.
sys.path.insert(0, _p.dirname(_p.dirname(_p.abspath(__file__))))
from paths import ДЕРЕВО, ИСХОДНИК  # пути — из одного места

исходник = sys.argv[1] if len(sys.argv) > 1 else ИСХОДНИК
дерево = sys.argv[2] if len(sys.argv) > 2 else ДЕРЕВО

s = pathlib.Path(исходник).read_text(encoding='utf-8')
s = s.replace('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js',
              './vendor/d3.min.js')
цель = pathlib.Path(дерево) / '_ref-orig.html'
цель.write_text(s, encoding='utf-8')
print(f'эталон: {цель} ({len(s)} знаков)')
