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
КАРТА_ИМЁН_MD   = от('mapping/globals_map_v3.md')
КАРТА_ДЕРЕВА_MD = от('mapping/map_tree.md')
КЛЮЧИ = os.environ.get('KEYS') or от('mapping/handler_keys.json')


# ── ГДЕ ЛЕЖАТ САМИ ПРОГРАММЫ ───────────────────────────────────────
#
# Близнец раздела в paths.mjs, и правило то же: правишь одну таблицу — правь
# и вторую. РАЗМЕЩЕНИЕ — «имя программы → подпапка внутри tools/»; сегодня
# программы разнесены по подпапкам 10 сентября 2026. Полноту сверяет tools_listed.mjs, он же
# следит, чтобы обе таблицы не разошлись между собой.
ПРОГРАММЫ = os.environ.get('PG_TOOLS') or от('tools')

РАЗМЕЩЕНИЕ = {
    'absorb.mjs':                'edit',
    'accept.sh':                 '',
    'accept_all.sh':             '',
    'add_concepts.mjs':          'edit',
    'add_links.mjs':             'edit',
    'fix_links.mjs':             'edit',
    'add_relation_ids.mjs':      'edit',
    'assert_probe.mjs':          'probes',
    'baseline.mjs':              'probes',
    'blind_probe.mjs':           'probes',
    'boot_values.mjs':           'checks',
    'bridge_debt.py':            'checks',
    'build_invariant.mjs':       'checks',
    'check_modules.mjs':         'checks',
    'compare.mjs':               'probes',
    'content_probe.mjs':         'checks',
    'context.py':                '',
    'css_map.mjs':               'maps',
    'css_probe.mjs':             'probes',
    'delegate.mjs':              'build',
    'deploy_check.sh':           '',
    'doc_numbers.mjs':           'checks',
    'draft_probe.mjs':           'probes',
    'exposure_probe.mjs':        'checks',
    'formula_probe.mjs':         'checks',
    'gen_spec2.mjs':             'maps',
    'graph_probe.mjs':           'probes',
    'layers.mjs':                'checks',
    'layout.mjs':                'edit',
    'layout_probe.mjs':          'probes',
    'make_ref.py':               'probes',
    'map_globals.mjs':           'maps',
    'map_to_md.py':              'maps',
    'map_tree.mjs':              'maps',
    'map_tree_to_md.py':         'maps',
    'maps_fresh.mjs':            'maps',
    'ns_capture.mjs':            'checks',
    'ops_probe.mjs':             'checks',
    'paths.mjs':                 '',
    'paths.py':                  '',
    'plan_probe.mjs':            'checks',
    'probe4.mjs':                'probes',
    'probe5.mjs':                'probes',
    'probe6.mjs':                'probes',
    'probe7.mjs':                'probes',
    'probe8.mjs':                'probes',
    'prune_exports.mjs':         'build',
    'prune_imports.mjs':         'build',
    'remap.mjs':                 '',
    'rename.mjs':                'edit',
    'rename_locals.mjs':         'edit',
    'rename_modules.mjs':        'edit',
    'reorder_chrono.mjs':        'edit',
    'resets_listed.mjs':         'checks',
    'rig.mjs':                   'build',
    'serve.py':                  '',
    'serve.sh':                  '',
    'sides_all.mjs':             'probes',
    'snap_stability.mjs':        'probes',
    'snapshot.mjs':              'probes',
    'split.mjs':                 'build',
    'split_css.mjs':             'build',
    'sweep_all.mjs':             'probes',
    'tip_probe.mjs':             'probes',
    'tools_listed.mjs':          'checks',
    'tradition_trial.mjs':       'probes',
}


def программа(имя):
    """Полный путь программы по имени. Незнакомое имя — останов, а не догадка."""
    где = РАЗМЕЩЕНИЕ.get(имя)
    if где is None:
        print(f'нет такой программы: {имя}\n'
              f'Добавьте её в РАЗМЕЩЕНИЕ (tools/paths.py и tools/paths.mjs).',
              file=sys.stderr)
        sys.exit(2)
    return os.path.join(ПРОГРАММЫ, где, имя)


def требуется(путь, чей):
    """Проверка на месте, а не при чтении файла: путь может быть нужен одному
    прибору и не нужен другому."""
    if not os.path.exists(путь):
        print(f'{чей}: нет пути {путь}\n'
              f'Поправьте tools/paths.py или задайте переменную окружения.',
              file=sys.stderr)
        sys.exit(2)
    return путь
