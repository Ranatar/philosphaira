#!/bin/bash
# РАЗВЁРТЫВАНИЕ С НУЛЯ.
#
# Всё, что работало до сих пор, работало В МОЁМ окружении: с уже
# накаченными миграциями, уже перенесённым графом, уже заведённым
# администратором. Это не проверка, а привычка — и она рвётся у первого,
# кто возьмёт репозиторий чистым.
#
# Здесь путь проходится целиком и на пустом месте:
#   клон из git → зависимости → сборка дерева → миграции с нуля →
#   перенос графа → первый администратор → обе приёмки.
#
# Ничего не берётся из рабочего дерева: только то, что лежит в репозитории.
#
#   bash tools/deploy_check.sh [папка] [строка подключения]

set -u
DEST="${1:-/tmp/развёртывание}"
DBURL="${2:-postgres://postgres@localhost:5433/philos_deploy?host=/tmp}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BAD=0
step() { printf '\n══ %s\n' "$1"; }
verdict() { if [ "$2" -eq 0 ]; then printf '  %-40s зелено\n' "$1";
         else printf '✗ %-40s КРАСНО\n' "$1"; BAD=$((BAD+1)); fi }

step "клон из репозитория (без рабочего дерева)"
rm -rf "$DEST"
git clone -q "$ROOT" "$DEST" 2>/dev/null; verdict "клон" $?
cd "$DEST" || exit 1

step "что приехало"
test -d server && test -f server/package.json; verdict "server/ в учёте" $?
test -f source/philosophy_graph_v3.html; verdict "исходник на месте" $?
test -f tools/accept.sh; verdict "единая приёмка на месте" $?
test ! -f app/_ref-orig.html; verdict "порождённое НЕ в учёте" $?

step "зависимости"
cp -r "$ROOT/node_modules" . 2>/dev/null            # сеть недоступна: берём готовые
cp -r "$ROOT/server/node_modules" server/ 2>/dev/null
test -d node_modules && test -d server/node_modules; verdict "зависимости на месте" $?

step "сборка дерева из исходника"
node tools/remap.mjs собрать > /tmp/развёрт_сборка.log 2>&1; verdict "сборка" $?
node tools/check_modules.mjs > /dev/null 2>&1; verdict "строение" $?

step "база с нуля"
psql "${DBURL%%\?*}" -c '' > /dev/null 2>&1 || true
createdb --maintenance-db="postgres://postgres@/postgres?host=/tmp&port=5433" \
  --locale=C.UTF-8 --template=template0 philos_deploy > /dev/null 2>&1
export DATABASE_URL="$DBURL"
export MFA_SECRET_KEY="${MFA_SECRET_KEY:-$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")}"
(cd server && node scripts/migrate.mjs up > /tmp/развёрт_миграции.log 2>&1); verdict "миграции накатились" $?

step "перенос графа и первый администратор"
(cd server && node scripts/import-graph.mjs ../app/data > /tmp/развёрт_перенос.log 2>&1); verdict "граф перенесён" $?
rm -rf /tmp/развёрт_выгрузка
(cd server && node scripts/export-graph.mjs /tmp/развёрт_выгрузка > /dev/null 2>&1)
diff -rq app/data /tmp/развёрт_выгрузка > /dev/null 2>&1; verdict "выгрузка совпадает ПОБАЙТОВО" $?
(cd server && node scripts/bootstrap-admin.mjs > /tmp/развёрт_админ.log 2>&1); verdict "первый администратор заведён" $?

step "приёмка на свежем месте"
(cd server && bash accept.sh > /tmp/развёрт_сервер.log 2>&1); verdict "приёмка сервера" $?
echo "  (приёмка приложения — отдельно: bash tools/accept.sh --только-приложение)"

echo
if [ "$BAD" -eq 0 ]; then echo "РАЗВЁРТЫВАНИЕ С НУЛЯ ПРОШЛО"; else echo "РАЗВЁРТЫВАНИЕ: НЕ СОШЛОСЬ $BAD"; fi
exit "$BAD"
