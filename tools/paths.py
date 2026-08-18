#!/usr/bin/env python3
# ВСЕ ПУТИ ПРОЕКТА — В ОДНОМ МЕСТЕ, python-половина.
#
# Близнец tools/paths.mjs и держится того же правила: корень вычисляется от
# расположения ЭТОГО файла (tools/ лежит в корне), всё прочее — от корня.
# Переставить папку значит поправить одну строку здесь и одну там.
#
# Два файла вместо одного — потому что оснастка написана на двух языках, а
# заводить ради путей общий json значит завести третье место, где они могут
# разойтись. Правило: правишь один — правь и второй; имена нарочно одинаковы.
import os
import sys
from pathlib import Path

КОРЕНЬ = Path(os.environ.get('PG_ROOT') or Path(__file__).resolve().parent.parent)

def от(*ч):
    return str(КОРЕНЬ.joinpath(*ч))

# ── рукотворное ────────────────────────────────────────────────────
ИСХОДНИК = os.environ.get('PG_SOURCE') or от('source/philosophy_graph_v3.html')
РАСКЛАДКА = os.environ.get('PG_ASSIGN') or от('decisions/assign_names.json')

# ── порождаемое ────────────────────────────────────────────────────
ДЕРЕВО = os.environ.get('TREE') or от('app')
КАРТА_ИМЁН = os.environ.get('PG_GLOBALS') or от('mapping/globals_map_v3.json')
КАРТА_ДЕРЕВА = os.environ.get('PG_TREEMAP') or от('mapping/map_tree.json')
КАРТА_ДЕРЕВА_MD = от('mapping/map_tree.md')
КЛЮЧИ = os.environ.get('KEYS') or от('mapping/handler_keys.json')


def требуется(путь, чей):
    """Проверка на месте, а не при чтении файла: путь может быть нужен одному
    прибору и не нужен другому."""
    if not os.path.exists(путь):
        print(f'{чей}: нет пути {путь}\n'
              f'Поправьте tools/paths.py или задайте переменную окружения.',
              file=sys.stderr)
        sys.exit(2)
    return путь
