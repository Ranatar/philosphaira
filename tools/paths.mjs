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
