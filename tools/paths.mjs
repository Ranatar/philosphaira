// ВСЕ ПУТИ ПРОЕКТА — В ОДНОМ МЕСТЕ.
//
// Прежде каждый прибор и каждый шаг сборки нёс свои умолчания: 44 абсолютных
// пути на 29 файлов, из них девять указывали в `/home/claude/build/src`,
// которого давно нет. Перестановка папок стоила бы правки всех двадцати
// девяти, а перенос на другую машину упирался в зашитый путь к Chrome.
//
// Теперь путь спрашивают здесь. Правило простое: корень проекта вычисляется
// от расположения ЭТОГО файла (`tools/` лежит в корне), всё прочее — от
// корня. Переставить папку значит поправить одну строку ниже.
//
// Переменные окружения перекрывают умолчания — это нужно приборам, которые
// гоняют по чужому дереву (например, сверяют сборку с эталоном исходника).
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ЗДЕСЬ = path.dirname(fileURLToPath(import.meta.url));
export const КОРЕНЬ = process.env.PG_ROOT || path.resolve(ЗДЕСЬ, '..');

const от = (...ч) => path.join(КОРЕНЬ, ...ч);

// ── рукотворное ────────────────────────────────────────────────────
export const ИСХОДНИК   = process.env.PG_SOURCE   || от('source/philosophy_graph_v3.html');
export const РАСКЛАДКА  = process.env.PG_ASSIGN   || от('decisions/assign_names.json');
export const ЭТАЖИ      = process.env.PG_LAYERS   || от('decisions/layers.json');

// ── порождаемое ────────────────────────────────────────────────────
export const ДЕРЕВО     = process.env.TREE        || от('app');
export const КАРТА_ИМЁН = process.env.PG_GLOBALS  || от('mapping/globals_map_v3.json');
export const КАРТА_СТИЛЕЙ = process.env.PG_CSSMAP || от('mapping/css_map.json');
export const КАРТА_ДЕРЕВА = process.env.PG_TREEMAP|| от('mapping/map_tree.json');
export const КАРТА_ДЕРЕВА_MD = от('mapping/map_tree.md');
export const СПЕЦИФИКАЦИЯ = от('mapping/module-spec.md');
export const КЛЮЧИ      = process.env.KEYS        || от('mapping/handler_keys.json');
export const ЭТАЛОНЫ    = process.env.BASE_DIR    || от('baseline');

// ── ГДЕ ЛЕЖАТ САМИ ПРОГРАММЫ ───────────────────────────────────────
//
// Пути ДАННЫХ спрашивают здесь с самого начала, а пути ПРОГРАММ до 10
// сентября 2026 были разбросаны: `path.join(КОРЕНЬ, 'tools', имя)` в четырёх
// местах, 35 строк `node tools/…` в accept.sh, ещё десятки в двух других
// скриптах и в развёртывании. Пока это так, любая перестановка папки — это
// правка тридцати мест, и она повторится при следующей.
//
// РАЗМЕЩЕНИЕ — таблица «имя программы → подпапка внутри tools/». Программы
// разнесены 10 сентября 2026: build/ (сборка), maps/ (карты), edit/ (правит
// предмет), probes/ (открывает страницу браузером), checks/ (читает файлы,
// секунды); в корне — вход и то, чем пользуются все. Переставить программу
// значит поправить ЭТУ таблицу, а зовущие места остаются прежними. Полнота таблицы не на совести человека: `tools_listed.mjs` сверяет её
// с папкой в обе стороны и краснеет на всяком расхождении.
export const ПРОГРАММЫ = process.env.PG_TOOLS || от('tools');

export const РАЗМЕЩЕНИЕ = Object.freeze({
  'absorb.mjs':              'edit',
  'accept.sh':               '',
  'accept_all.sh':           '',
  'add_concepts.mjs':        'edit',
  'add_links.mjs':           'edit',
  'fix_links.mjs':           'edit',
  'add_relation_ids.mjs':    'edit',
  'assert_probe.mjs':        'probes',
  'baseline.mjs':            'probes',
  'blind_probe.mjs':         'probes',
  'boot_values.mjs':         'checks',
  'bridge_debt.py':          'checks',
  'build_invariant.mjs':     'checks',
  'check_modules.mjs':       'checks',
  'compare.mjs':             'probes',
  'content_probe.mjs':       'checks',
  'context.py':              '',
  'css_map.mjs':             'maps',
  'css_probe.mjs':           'probes',
  'delegate.mjs':            'build',
  'deploy_check.sh':         '',
  'doc_numbers.mjs':         'checks',
  'draft_probe.mjs':         'probes',
  'exposure_probe.mjs':      'checks',
  'formula_probe.mjs':       'checks',
  'gen_spec2.mjs':           'maps',
  'graph_probe.mjs':         'probes',
  'layers.mjs':              'checks',
  'layout.mjs':              'edit',
  'layout_probe.mjs':        'probes',
  'make_ref.py':             'probes',
  'map_globals.mjs':         'maps',
  'map_to_md.py':            'maps',
  'map_tree.mjs':            'maps',
  'map_tree_to_md.py':       'maps',
  'maps_fresh.mjs':          'maps',
  'ops_probe.mjs':           'checks',
  'paths.mjs':               '',
  'paths.py':                '',
  'plan_probe.mjs':          'checks',
  'probe4.mjs':              'probes',
  'probe5.mjs':              'probes',
  'probe6.mjs':              'probes',
  'probe7.mjs':              'probes',
  'probe8.mjs':              'probes',
  'prune_exports.mjs':       'build',
  'prune_imports.mjs':       'build',
  'remap.mjs':               '',
  'rename.mjs':              'edit',
  'rename_locals.mjs':       'edit',
  'rename_modules.mjs':      'edit',
  'reorder_chrono.mjs':      'edit',
  'resets_listed.mjs':       'checks',
  'rig.mjs':                 'build',
  'serve.py':                '',
  'serve.sh':                '',
  'snap_stability.mjs':      'probes',
  'snapshot.mjs':            'probes',
  'spec_probe.mjs':          'checks',
  'split.mjs':               'build',
  'split_css.mjs':           'build',
  'sweep_all.mjs':           'probes',
  'tip_probe.mjs':           'probes',
  'tools_listed.mjs':        'checks',
  'tradition_trial.mjs':     'probes',
});

/** Полный путь программы по имени. Незнакомое имя — ОСТАНОВ, а не догадка:
 *  опечатка в имени иначе превратится в «файла нет» где-то ниже по течению. */
export function программа(имя) {
  const где = РАЗМЕЩЕНИЕ[имя];
  if (где === undefined) {
    console.error(`нет такой программы: ${имя}\nДобавьте её в РАЗМЕЩЕНИЕ (tools/paths.mjs и tools/paths.py).`);
    process.exit(2);
  }
  return path.join(ПРОГРАММЫ, где, имя);
}

// ── окружение приёмки ──────────────────────────────────────────────
// Chrome и puppeteer не входят в проект: их путь зависит от машины, а не от
// раскладки папок. Умолчания оставлены прежние (они верны на машине автора),
// но переменные CHROME и PUPPETEER перекрывают их без правки кода.
export const БРАУЗЕР = process.env.CHROME
  || '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
export const PUPPETEER = process.env.PUPPETEER
  || '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer';
export const D3 = process.env.PG_D3
  || path.join(КОРЕНЬ, 'node_modules/d3/dist/d3.min.js');
export const СЕРВЕР = process.env.BASE || 'http://127.0.0.1:8711/';

// Проверка на месте, а не при первом чтении файла: путь может быть верен для
// одного прибора и не нужен другому.
export function требуется(путь, чей) {
  if (!fs.existsSync(путь)) {
    console.error(`${чей}: нет пути ${путь}\nПоправьте tools/paths.mjs или задайте переменную окружения.`);
    process.exit(2);
  }
  return путь;
}
