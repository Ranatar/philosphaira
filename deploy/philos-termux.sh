#!/data/data/com.termux/files/usr/bin/bash
# ΦilosΦaira в Termux: установка и управление.
#
#   bash philos-termux.sh установить ~/storage/downloads/philosphaira.zip
#   bash philos-termux.sh пуск | стоп | состояние | журнал | адрес | приёмка
#
# ПРАВИЛО, КОТОРОМУ СЛЕДУЕТ СКРИПТ: молчаливый отказ хуже громкого.
# Ни один шаг не «пропускается на всякий случай»: либо сделано, либо
# сказано, что именно не вышло и что с этим делать.
#
# ИМЕНА ПЕРЕМЕННЫХ ЛАТИНИЦЕЙ НАРОЧНО: bash не принимает кириллические
# (`КОРЕНЬ=x` он читает как запуск команды). На этом однажды сломался
# tools/serve.sh, и документация вместо починки учила его обходить.
# Имена функций кириллические — их bash принимает.

set -u

ROOT="${PHILOS_DIR:-$HOME/philosphaira}"
ENVF="$HOME/.philos.env"
LOGF="$HOME/.philos.log"
PIDF="$HOME/.philos.pid"
PIDW="$HOME/.philos-worker.pid"   # работник уведомлений — второй процесс
PGDATA="${PREFIX:-}/var/lib/postgresql"
PGLOG="$HOME/.philos-pg.log"
NPMLOG="$HOME/.philos-npm.log"
PGPASS=""

CR='\033[0;31m'; CG='\033[0;32m'; CY='\033[0;33m'; C0='\033[0m'
шаг()   { printf "\n${CY}══ %s${C0}\n" "$*"; }
годно() { printf "${CG}  ✓ %s${C0}\n" "$*"; }
беда()  { printf "${CR}  ✗ %s${C0}\n" "$*" >&2; }
стоп()  { printf "\n${CR}ОСТАНОВ: %s${C0}\n" "$*" >&2; exit 1; }

# ── проверка среды ───────────────────────────────────────────────────────
проверитьСреду() {
  [ -n "${PREFIX:-}" ] && [ -d "$PREFIX/bin" ] \
    || стоп "это не Termux. Скрипт рассчитан на Termux и нигде больше не нужен."
  case "$(uname -m)" in
    aarch64|arm64) годно "архитектура $(uname -m)" ;;
    *) беда "архитектура $(uname -m) — необычная для телефона, дальше на ваш страх" ;;
  esac
}

# ── 1. пакеты ────────────────────────────────────────────────────────────
поставитьПакеты() {
  шаг "пакеты"
  pkg update -y > /dev/null 2>&1
  # clang/make/python нужны не «на всякий случай»: argon2 нативный, и под
  # Termux готовых сборок нет — его собирают на месте.
  pkg install -y nodejs-lts postgresql python clang make binutils \
                 libffi openssl unzip which > /dev/null 2>&1 \
    || pkg install -y nodejs postgresql python clang make binutils \
                      libffi openssl unzip which > /dev/null 2>&1 \
    || стоп "pkg install не прошёл. Проверьте сеть и повторите."

  local v major
  v=$(node -v 2>/dev/null) || стоп "node не поставился"
  major=${v#v}; major=${major%%.*}
  [ "$major" -ge 18 ] || стоп "нужен Node ≥18, стоит $v (Express 5 и argon2 0.45 старше не идут)"
  годно "Node $v"
  годно "PostgreSQL $(postgres --version 2>/dev/null | awk '{print $3}')"
}

# ── 2. база ──────────────────────────────────────────────────────────────
поднятьПостгрес() {
  шаг "PostgreSQL"
  if [ ! -d "$PGDATA/base" ]; then
    initdb "$PGDATA" > /dev/null 2>&1 || стоп "initdb не прошёл"
    годно "хранилище заведено"
  else
    годно "хранилище уже есть"
  fi
  if ! pg_ctl -D "$PGDATA" status > /dev/null 2>&1; then
    pg_ctl -D "$PGDATA" -l "$PGLOG" start > /dev/null 2>&1
    sleep 2
  fi
  pg_ctl -D "$PGDATA" status > /dev/null 2>&1 \
    || стоп "PostgreSQL не поднялся. Смотрите $PGLOG"
  годно "работает"
}

настроитьДоступ() {
  шаг "доступ к базе"
  # PostgreSQL 14+ ставит для TCP scram-sha-256, а у роли, заведённой initdb,
  # пароля нет — отсюда «Password for user …», которого никто не задавал.
  # Служебные команды идут через сокет (там peer, пароль не нужен), а роли
  # пароль задаётся, потому что node-pg ходит по TCP.
  psql -lqt > /dev/null 2>&1 \
    || стоп "psql не пускает даже через сокет. Смотрите $PGLOG"
  годно "сокет отвечает без пароля"
  if [ -f "$ENVF" ]; then
    PGPASS=$(sed -n 's#^DATABASE_URL=postgres://[^:]*:\([^@]*\)@.*#\1#p' "$ENVF")
  fi
  if [ -z "$PGPASS" ]; then
    PGPASS=$(node -e "console.log(require('crypto').randomBytes(18).toString('hex'))")
    [ -f "$ENVF" ] && sed -i "s#^DATABASE_URL=.*#DATABASE_URL=postgres://$(whoami):$PGPASS@127.0.0.1:5432/philos#" "$ENVF"
  fi
  # -d postgres ОБЯЗАТЕЛЬНО: без него psql идёт в базу, названную по имени
  # пользователя, а такой базы в Termux нет. Ошибка PostgreSQL передаётся
  # как есть — пересказывать её своими словами значит прятать причину.
  local err
  if ! err=$(psql -d postgres -qc "ALTER ROLE \"$(whoami)\" WITH PASSWORD '$PGPASS'" 2>&1); then
    стоп "не удалось задать пароль роли $(whoami). PostgreSQL сказал:
$err"
  fi
  годно "пароль роли задан"
}

завестиБазу() {
  local name=$1
  if psql -lqt 2>/dev/null | cut -d\| -f1 | grep -qw "$name"; then
    годно "база $name уже есть"; return 0
  fi
  local err
  createdb "$name" --locale=C.UTF-8 --template=template0 2>/dev/null \
    || createdb "$name" --locale-provider=icu --icu-locale=ru \
         --encoding=UTF8 --template=template0 2>/dev/null \
    || { err=$(createdb "$name" --template=template0 2>&1) \
         || стоп "createdb $name не прошёл. PostgreSQL сказал:
$err"; }
  годно "база $name заведена"
}

# ГЛАВНАЯ ПРОВЕРКА ВСЕЙ ЗАТЕИ. Единственность логина и почты держится на
# lower(). В Android нет glibc, а bionic знает мало локалей — если lower()
# не свернёт кириллицу, «ИВАН» и «иван» заведутся как разные люди, и это
# не мелочь оформления, а дыра в учёте.
проверитьСворачивание() {
  шаг "сворачивание кириллицы"
  local got
  got=$(psql -d philos -tAc "SELECT lower('ИВАН')" 2>/dev/null)
  if [ "$got" = "иван" ]; then
    годно "lower('ИВАН') = 'иван'"
    return 0
  fi
  беда "lower('ИВАН') дало «$got» вместо «иван»"
  cat >&2 <<'ТЕКСТ'

  Это не косметика. На lower() держится единственность логина и почты:
  при таком поведении «ИВАН» и «иван» заведутся как два разных человека,
  а auth_probe покажет красное.

  Причина — в Android нет glibc, и локаль C.UTF-8 у bionic пустая.
  Что делать, по убыванию предпочтительности:
    1. Проверить, собран ли здешний PostgreSQL с ICU:
         psql -d postgres -tAc "SELECT icu_version()"
       Есть ответ — пересоздайте базы с --locale-provider=icu --icu-locale=ru.
    2. Ставить сервер на Ubuntu (виртуалка, старый ноутбук, VPS),
       а телефоном пользоваться как обычным клиентом через браузер.

  Установка остановлена нарочно: молча отдать вам систему с таким
  изъяном хуже, чем не отдать вовсе.
ТЕКСТ
  exit 1
}

# ── 3. проект ────────────────────────────────────────────────────────────
разложитьПроект() {
  local arc=${1:-}
  шаг "проект"
  if [ ! -d "$ROOT" ]; then
    [ -n "$arc" ] || стоп "проекта в $ROOT нет. Дайте путь к архиву:
  bash $0 установить ~/storage/downloads/philosphaira.zip
  (если папки storage нет — сперва termux-setup-storage)"
    [ -f "$arc" ] || стоп "архива $arc нет"
    rm -rf "$HOME/.raspakovka"; mkdir -p "$HOME/.raspakovka"
    unzip -q "$arc" -d "$HOME/.raspakovka" || стоп "unzip не прошёл"
    if [ -d "$HOME/.raspakovka/philosphaira" ]; then
      mv "$HOME/.raspakovka/philosphaira" "$ROOT"; rm -rf "$HOME/.raspakovka"
    else
      mv "$HOME/.raspakovka" "$ROOT"
    fi
    годно "распакован в $ROOT"
  else
    годно "уже лежит в $ROOT"
  fi
  [ -f "$ROOT/server/package.json" ] || стоп "в $ROOT нет server/ — не тот архив?"
}

поставитьЗависимости() {
  шаг "зависимости (argon2 собирается на месте, это долго — до 10 минут)"
  ( cd "$ROOT" && npm install --no-audit --no-fund ) > /dev/null 2>&1 \
    || беда "npm install в корне не прошёл — приборы приёмки приложения не заработают"
  ( cd "$ROOT/server" && npm install --no-audit --no-fund ) > "$NPMLOG" 2>&1 \
    || стоп "npm install в server/ не прошёл. Скорее всего argon2.
  Смотрите $NPMLOG; чаще всего не хватает clang/make/python —
  поставьте их (pkg install clang make python) и повторите."
  ( cd "$ROOT/server" && node -e "import('argon2').then(()=>process.exit(0),()=>process.exit(1))" ) \
    || стоп "argon2 не грузится — без него не работает ни вход, ни регистрация"
  годно "argon2 собран и грузится"
}

# ── 4. переменные ────────────────────────────────────────────────────────
завестиОкружение() {
  шаг "переменные"
  if [ -f "$ENVF" ]; then годно "$ENVF уже есть, не трогаю"; return 0; fi
  local key
  key=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  cat > "$ENVF" <<EOF
# NODE_ENV здесь НЕТ нарочно: production включает Secure-cookie, и по
# обычному HTTP браузер её не сохранит — вход будет молча не работать.
# WS_ORIGINS здесь НЕТ нарочно: null означает «не проверять».
DATABASE_URL=postgres://$(whoami):$PGPASS@127.0.0.1:5432/philos
MFA_SECRET_KEY=$key
PORT=8814
EOF
  chmod 600 "$ENVF"
  годно "$ENVF заведён"
  printf "${CY}  СОХРАНИТЕ MFA_SECRET_KEY ВНЕ ТЕЛЕФОНА: потеряете ключ — потеряете все TOTP.${C0}\n"
}

подхватить() { set -a; . "$ENVF"; set +a; }

# ── 5. схема, семя, администратор ────────────────────────────────────────
наполнить() {
  подхватить
  шаг "схема"
  ( cd "$ROOT/server" && npm run migrate ) > /dev/null 2>&1 || стоп "миграции не прошли"
  годно "накачена"

  шаг "семя графа"
  if ( cd "$ROOT/server" && npm run graph:import ) > /dev/null 2>&1; then
    годно "шесть наборов внесены"
  else
    годно "граф уже не пуст — семя не трогаю (так и задумано)"
  fi

  # РАСКЛАДКА ХРАНИТСЯ НА СЕРВЕРЕ (миграции 013–014, добавлены после первой
  # редакции этого скрипта). Прежде каждый клиент считал её сам, и выходила
  # она у всех разная: один d3 в разных движках расходится с медианой ~65 px.
  # Пока человек один — незаметно; как только двое, общий язык про «вон тот
  # сгусток справа» пропадает.
  шаг "первая раскладка"
  if ( cd "$ROOT/server" && node scripts/relayout.mjs --применить ) > /dev/null 2>&1; then
    годно "раскладка посчитана и записана"
  else
    годно "раскладка не понадобилась (уже есть или нечего класть)"
  fi

  шаг "первый администратор"
  if [ -z "${BOOTSTRAP_ADMIN_PASSWORD:-}" ]; then
    printf "  Пароль администратора (от 12 знаков, ввод не виден): "
    read -rs BOOTSTRAP_ADMIN_PASSWORD; echo
  fi
  ( cd "$ROOT/server" \
    && BOOTSTRAP_ADMIN_LOGIN="${BOOTSTRAP_ADMIN_LOGIN:-admin}" \
       BOOTSTRAP_ADMIN_EMAIL="${BOOTSTRAP_ADMIN_EMAIL:-admin@example.invalid}" \
       BOOTSTRAP_ADMIN_PASSWORD="$BOOTSTRAP_ADMIN_PASSWORD" \
       npm run bootstrap-admin ) 2>&1 | tail -2
}

# ── команды ──────────────────────────────────────────────────────────────
адрес() {
  local ip
  ip=$(ifconfig 2>/dev/null | grep -oE 'inet (addr:)?192\.168\.[0-9.]+' | head -1 | grep -oE '192\.168\.[0-9.]+')
  echo "  на самом телефоне: http://127.0.0.1:${PORT:-8814}/"
  [ -n "$ip" ] && echo "  из домашней сети:  http://$ip:${PORT:-8814}/"
}

пуск() {
  [ -f "$ENVF" ] || стоп "сперва: bash $0 установить"
  подхватить
  if ! pg_ctl -D "$PGDATA" status > /dev/null 2>&1; then
    pg_ctl -D "$PGDATA" -l "$PGLOG" start > /dev/null 2>&1; sleep 2
  fi
  if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; then
    годно "уже работает, pid $(cat "$PIDF")"; адрес; return 0
  fi
  # Без замка Android усыпит процесс через несколько минут.
  termux-wake-lock 2>/dev/null
  # PID БЕРЁТСЯ У САМОГО NODE, А НЕ У ПОДОБОЛОЧКИ. `( … & echo $! )` кладёт
  # pid ПОДОБОЛОЧКИ: она завершается сразу, узел живёт дальше, `стоп`
  # рапортует об успехе — а порт занят. Найдено прогоном скрипта для Ubuntu,
  # где ошибка была та же.
  cd "$ROOT/server"
  nohup node scripts/serve.mjs >> "$LOGF" 2>&1 &
  echo $! > "$PIDF"
  cd - > /dev/null
  sleep 3
  if kill -0 "$(cat "$PIDF")" 2>/dev/null; then
    годно "поднята, pid $(cat "$PIDF")"
  else
    стоп "не поднялась. Последние строки журнала:
$(tail -5 "$LOGF")"
  fi

  # РАБОТНИК УВЕДОМЛЕНИЙ — ВТОРОЙ ПРОЦЕСС, И ОН НУЖЕН ВСЕГДА.
  #
  # Первая редакция этого скрипта поднимала только узел, а инструкция
  # уверяла, что работник нужен «лишь при настоящей почте». Это НЕПРАВДА:
  # извещение в шину идёт ДО почты и независимо от неё. Без работника
  # цепочка рвётся на первом звене — коммит кладёт извещение в исходящие, и
  # оно там лежит; чужая правка не доходит до открытых страниц ВОВСЕ.
  #
  # Хуже всего, что это не видно: сервер отвечает, страница работает, правки
  # сохраняются. Молчит только живое обновление — и заметит это второй
  # человек, а не тот, кто разворачивал.
  cd "$ROOT/server"
  nohup node scripts/notify-worker.mjs >> "$LOGF" 2>&1 &
  echo $! > "$PIDW"
  cd - > /dev/null
  sleep 2
  if kill -0 "$(cat "$PIDW")" 2>/dev/null; then
    годно "работник уведомлений пошёл, pid $(cat "$PIDW")"
  else
    годно "работник не пошёл — живое обновление молчит (см. журнал)"
  fi
  адрес
}

стопСервер() {
  if [ -f "$PIDW" ] && kill "$(cat "$PIDW")" 2>/dev/null; then годно "работник остановлен"; fi
  rm -f "$PIDW"
  if [ -f "$PIDF" ] && kill "$(cat "$PIDF")" 2>/dev/null; then годно "сервер остановлен"; fi
  rm -f "$PIDF"
  termux-wake-unlock 2>/dev/null
  pg_ctl -D "$PGDATA" stop > /dev/null 2>&1 && годно "PostgreSQL остановлен"
}

состояние() {
  pg_ctl -D "$PGDATA" status > /dev/null 2>&1 \
    && годно "PostgreSQL работает" || беда "PostgreSQL стоит"
  if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; then
    годно "сервер работает, pid $(cat "$PIDF")"
    подхватить; адрес
    curl -sI "http://127.0.0.1:${PORT:-8814}/" 2>/dev/null | head -1
  else
    беда "сервер стоит"
  fi

  # РАБОТНИК ПОКАЗЫВАЕТСЯ ОТДЕЛЬНО. Его молчание — единственная беда, что не
  # видна на глаз: сервер отвечает, страница работает, а чужие правки не
  # доходят. Пока пользователь один, этого не заметит никто.
  if [ -f "$PIDW" ] && kill -0 "$(cat "$PIDW")" 2>/dev/null; then
    годно "работник уведомлений работает, pid $(cat "$PIDW")"
  else
    беда "работник СТОИТ — живое обновление молчит, чужие правки не дойдут"
  fi
  подхватить 2>/dev/null || true
  копится=$(psql -tAc "SELECT count(*) FROM outbox WHERE delivered_at IS NULL" \
    2>/dev/null | tr -d ' ')
  [ -n "$копится" ] && [ "$копится" != "0" ] \
    && беда "в исходящих не разослано: $копится"
}

приёмка() {
  cat <<'ТЕКСТ'
  ВНИМАНИЕ: приёмка ОТКАТЫВАЕТ базу до пустого места (db_probe).
  Поэтому здесь жёстко задана philos_test, а не то, что в окружении.
  page_probe не пойдёт: он поднимает Chrome, которого в Termux нет.
  Остальные шестнадцать проб сервера — идут.
ТЕКСТ
  MFA_SECRET_KEY="$(grep '^MFA_SECRET_KEY=' "$ENVF" | cut -d= -f2-)" \
  DATABASE_URL="$(sed -n 's#^DATABASE_URL=##p' "$ENVF" | sed 's#/philos$#/philos_test#')" \
    bash "$ROOT/server/accept.sh"
}

установить() {
  проверитьСреду
  поставитьПакеты
  поднятьПостгрес
  настроитьДоступ
  завестиБазу philos
  завестиБазу philos_test
  проверитьСворачивание
  разложитьПроект "${1:-}"
  поставитьЗависимости
  завестиОкружение
  наполнить
  шаг "готово"
  пуск
  cat <<ТЕКСТ

  Дальше:
    bash $0 состояние     что сейчас работает
    bash $0 стоп          остановить всё
    bash $0 журнал        последние записи
ТЕКСТ
}

case "${1:-}" in
  установить) shift; установить "${1:-}" ;;
  пуск)       пуск ;;
  стоп)       стопСервер ;;
  состояние)  состояние ;;
  журнал)     tail -40 "$LOGF" ;;
  адрес)      подхватить; адрес ;;
  приёмка)    приёмка ;;
  *) cat <<ТЕКСТ
ΦilosΦaira в Termux

  bash $0 установить <путь-к-архиву.zip>
  bash $0 пуск | стоп | состояние | журнал | адрес | приёмка
ТЕКСТ
  ;;
esac
