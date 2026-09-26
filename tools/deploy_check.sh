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
#
# Умолчание строки подключения — окружение автора: PostgreSQL на порту 5433
# с сокетом в /tmp. На машине, поднятой по server/README.md (localhost:5432),
# строку надо передать вторым доводом, например
#   bash tools/deploy_check.sh /tmp/развёртывание postgres://postgres@localhost:5432/philos_deploy
# Служебная база для createdb выводится ИЗ ЭТОЙ ЖЕ строки: прежде она была
# зашита (host=/tmp, port=5433), и при другой строке createdb молча падал, а
# первым красным оказывались миграции — далеко от причины.

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
# ПО LOCK-ФАЙЛУ, как у всякого, кто возьмёт репозиторий. Прежде здесь было
# только копирование из рабочего дерева («сеть недоступна») — и проверка
# развёртывания не проверяла главного шага развёртывания. Копия осталась
# запасным ходом для машины без сети, и об этом говорится вслух.
if npm ci --no-audit --no-fund > /tmp/развёрт_npm.log 2>&1 \
   && (cd server && npm ci --no-audit --no-fund >> /tmp/развёрт_npm.log 2>&1); then
  echo "  зависимости поставлены по lock-файлам (npm ci)"
else
  echo "  npm ci не прошёл (нет сети?) — беру копию из рабочего дерева; см. /tmp/развёрт_npm.log"
  cp -r "$ROOT/node_modules" . 2>/dev/null
  cp -r "$ROOT/server/node_modules" server/ 2>/dev/null
fi
test -d node_modules && test -d server/node_modules; verdict "зависимости на месте" $?

step "сборка дерева из исходника"
# ПУТИ ПРОГРАММ БЕРУТСЯ ИЗ КЛОНА, А НЕ ОТСЮДА: развёртывание проверяет то,
# что приехало в репозитории, включая раскладку самой папки tools/.
clone_tool() { node -e "import('$DEST/tools/paths.mjs').then(p=>console.log(p.программа('$1')))"; }
node "$(clone_tool remap.mjs)" собрать > /tmp/развёрт_сборка.log 2>&1; verdict "сборка" $?
node "$(clone_tool check_modules.mjs)" > /dev/null 2>&1; verdict "строение" $?

step "база с нуля"
# Имя базы и служебная база — из строки подключения. Запрос (?host=/tmp)
# отрезается ПЕРВЫМ: в нём тоже бывает «/», и разбор по последней черте
# иначе принял бы за имя базы кусок пути сокета.
DBBASE="${DBURL%%\?*}"; DBQUERY=""; case "$DBURL" in *\?*) DBQUERY="?${DBURL#*\?}";; esac
DBNAME="${DBBASE##*/}"
MAINT="${DBBASE%/*}/postgres$DBQUERY"
# С НУЛЯ значит с пустой базы — прежняя сносится. Но только своя: строка
# подключения приходит доводом, и опечатка в ней не должна стоить рабочей
# базы. Имя без «deploy» — останов, а не снос.
case "$DBNAME" in
  *deploy*) dropdb --maintenance-db="$MAINT" --if-exists "$DBNAME" > /dev/null 2>&1 ;;
  *) echo "✗ база «$DBNAME» не похожа на испытательную (нет «deploy» в имени) — сносить не стану"; exit 1 ;;
esac
createdb --maintenance-db="$MAINT" --locale=C.UTF-8 --template=template0 "$DBNAME" \
  > /tmp/развёрт_база.log 2>&1; verdict "база $DBNAME заведена" $?
export DATABASE_URL="$DBURL"
export MFA_SECRET_KEY="${MFA_SECRET_KEY:-$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")}"
# ПАРОЛЬ ИСПЫТАТЕЛЬНОГО АДМИНИСТРАТОРА — как ключ выше: не задан, значит
# порождается. Прежде его не было, и на чистой машине без переменной
# «развёртывание с нуля» падало на шаге, где проверять нечего (найдено
# 26.09.2026: прогон без окружения автора). Пароль одноразовый, как и база.
export BOOTSTRAP_ADMIN_PASSWORD="${BOOTSTRAP_ADMIN_PASSWORD:-$(node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))")}"
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
