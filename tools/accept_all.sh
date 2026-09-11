#!/bin/bash
# Полная приёмка: восемь приборов, каждый по двум сторонам.
#
# ВАЖНО: каждый прогон — ОТДЕЛЬНЫЙ ЗАПУСК ПРОЦЕССА. Четырёх гигабайтов не
# хватает на 400 снимков в одном сеансе, вкладка падает на 29-м виде. По той
# же причине обход дробится на три части и сводится командой merge.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Пути программ спрашиваются у таблицы РАЗМЕЩЕНИЕ (tools/paths.mjs), а не
# зашиваются: см. пояснение в accept.sh.
declare -A TOOLS
while IFS='=' read -r NAME PATH_; do [ -n "$NAME" ] && TOOLS["$NAME"]="$PATH_"; done < <(
  node -e "import('$ROOT/tools/paths.mjs').then(p => { for (const и of Object.keys(p.РАЗМЕЩЕНИЕ)) console.log(и + '=' + p.программа(и)); });")
tool() { if [ -z "${TOOLS[$1]:-}" ]; then echo "неизвестная программа: $1" >&2; exit 1; fi; printf '%s' "${TOOLS[$1]}"; }

TREE_DIR="${1:-app}"
SNAPS="${2:-/tmp/приёмка}"
mkdir -p "$SNAPS"

# Эталон кладётся ПОСЛЕ последней сборки: пересборка стирает _ref-orig.html
# из дерева, и прибор молча грузит 404. Путь — с папкой: без неё make_ref
# ищет файл в корне и падает на чистом клоне.
python3 "$(tool make_ref.py)" source/philosophy_graph_v3.html "$TREE_DIR"
bash "$(tool serve.sh)" "$TREE_DIR"

echo "== полный обход (три части на сторону)"
for PART in 1 2 3; do
  node "$(tool sweep_all.mjs)" run _ref-orig.html "$SNAPS/o$PART.json" $PART
  node "$(tool sweep_all.mjs)" run index.html     "$SNAPS/m$PART.json" $PART
done
node "$(tool sweep_all.mjs)" merge "$SNAPS/св_и.json" - "$SNAPS/o1.json" "$SNAPS/o2.json" "$SNAPS/o3.json"
node "$(tool sweep_all.mjs)" merge "$SNAPS/св_м.json" - "$SNAPS/m1.json" "$SNAPS/m2.json" "$SNAPS/m3.json"
node "$(tool sweep_all.mjs)" diff "$SNAPS/св_и.json" "$SNAPS/св_м.json"

for PROBE in compare graph_probe probe4 probe5 probe6 probe7 probe8 css_probe; do
  echo "== $PROBE"
  node "$(tool "$PROBE.mjs")" run _ref-orig.html "$SNAPS/${PROBE}_и.json"
  node "$(tool "$PROBE.mjs")" run index.html     "$SNAPS/${PROBE}_м.json"
  node "$(tool "$PROBE.mjs")" diff "$SNAPS/${PROBE}_и.json" "$SNAPS/${PROBE}_м.json"
done

echo "== утверждения о должном (второй слой)"
node "$(tool assert_probe.mjs)" index.html

echo "== свежесть карт"
node "$(tool maps_fresh.mjs)"

echo "== проверка модулей и долг"
node "$(tool check_modules.mjs)"
python3 "$(tool bridge_debt.py)" "$TREE_DIR"
rm -f "$TREE_DIR/_ref-orig.html"
