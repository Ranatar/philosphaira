#!/usr/bin/env bash
# ΦilosΦaira на Ubuntu 24.04 — установка, развёртывание, управление.
#
# Спутник инструкции `philosphaira-развёртывание.md`: то же самое, но одной
# командой. Инструкцию стоит прочесть — здесь объяснены только те решения,
# которые иначе выглядят произволом.
#
#   bash philos-ubuntu.sh установить          # пакеты, Node 22, PostgreSQL, Chrome
#   bash philos-ubuntu.sh развернуть <путь>   # архив или каталог с проектом
#   bash philos-ubuntu.sh пуск | стоп | состояние | журнал | адрес
#   bash philos-ubuntu.sh служба              # автозапуск через systemd (ДВЕ службы)
#   bash philos-ubuntu.sh приёмка             # на испытательной базе
#
# ИМЕНА ПЕРЕМЕННЫХ ЛАТИНИЦЕЙ. Кириллическое имя переменной bash не принимает
# ВОВСЕ: `случай=$1` даёт «command not found». Я наступил на это и здесь, при
# первом же прогоне, — знание правила от нарушения не защищает. Имена функций
# кириллицей bash допускает, и они оставлены ради читаемости.
set -euo pipefail

ROOT="${PHILOS_ROOT:-$HOME/philosphaira}"
ENVF="${PHILOS_ENV:-$HOME/philos.env}"
LOGD="${PHILOS_LOGS:-$HOME/.philos-logs}"
PIDF="$LOGD/server.pid"
PIDW="$LOGD/worker.pid"
LOGF="$LOGD/server.log"
LOGW="$LOGD/worker.log"
CHROME_VER="131.0.6778.204"

mkdir -p "$LOGD"

шаг()  { printf "\n\033[1m▸ %s\033[0m\n" "$*"; }
годно(){ printf "  ✓ %s\n" "$*"; }
беда() { printf "  ✗ %s\n" "$*"; }
стоп() { printf "\n\033[31m✗ %s\033[0m\n" "$*"; exit 1; }

естьSudo() { command -v sudo > /dev/null 2>&1; }
как_root() { if [ "$(id -u)" = 0 ]; then "$@"; else sudo "$@"; fi; }

# ОТДЕЛЬНО ДЛЯ postgres: `как_postgres …` от root теряет флаг и
# пытается выполнить «-u» как команду — я наступил на это при первом прогоне.
# Под root нужен `su postgres -c`, под обычным — `sudo -u postgres`.
как_postgres() {
  if [ "$(id -u)" = 0 ]; then
    su postgres -c "$(printf '%q ' "$@")"
  else
    sudo -u postgres "$@"
  fi
}

# ── установка ────────────────────────────────────────────────────────────
# СПИСКИ ПАКЕТОВ ОБНОВЛЯЮТСЯ ПЕРВЫМ ДЕЛОМ, А НЕ ПОПУТНО.
#
# Ubuntu выкатывает точечные выпуски и УБИРАЕТ прежние файлы с зеркал. Список,
# пролежавший неделю, помнит postgresql 16.14, а на зеркале уже 16.15 — и
# установка падает связкой «404 Not Found», из которой причина не видна вовсе:
# человек читает «не удалось получить» и идёт искать поломку в сети.
#
# Прежде обновление приходило СЛУЧАЙНО: его делал установщик NodeSource,
# и то лишь когда Node ещё не стоял. У кого Node уже был, шаг пропускался —
# и `установить` падал на втором шаге. Поймано не мной, а человеком, у
# которого Node оказался свежее моего.
#
# Термуксовый близнец (`philos-termux.sh`) звал `pkg update` с самого начала;
# здесь этого просто не было, и два скрипта расходились в главном.
обновить_списки() {
  шаг "списки пакетов"
  if как_root apt-get update > /dev/null 2>&1; then
    годно "обновлены"
  else
    # Не останов: единичное зеркало может отвечать 404 и при свежих списках,
    # а установка ниже всё равно скажет своё. Но предупредить надо здесь.
    беда "обновить не удалось — если установка упадёт на 404, причина тут"
  fi
}

# УСТАНОВКА С РАЗБОРОМ ПРИЧИНЫ. Голый `apt-get install` при протухших списках
# печатает связку «404 Not Found» и умолкает; из неё не видно, что чинить —
# сеть, зеркало или список. Поэтому: попытка, при неудаче обновление и вторая
# попытка, и только потом останов — но уже с диагнозом, а не с загадкой.
поставить() {
  if как_root apt-get install -y "$@" > /dev/null 2>&1; then
    годно "поставлено: $*"
    return 0
  fi
  беда "не поставилось с первого раза — обновляю списки и пробую ещё раз"
  как_root apt-get update > /dev/null 2>&1 || true
  if как_root apt-get install -y "$@" > /dev/null 2>&1; then
    годно "поставлено со второй попытки: $*"
    return 0
  fi
  printf "\n"
  # `|| true` ОБЯЗАТЕЛЕН: при `set -o pipefail` неуспех apt в конвейере роняет
  # скрипт ПРЯМО ЗДЕСЬ, и разбор причины ниже не печатается вовсе. Поймано
  # подложенной поломкой — зеркало, упорно отвечающее 404.
  как_root apt-get install -y "$@" 2>&1 | tail -6 || true
  стоп "$(cat <<'КОНЕЦ'
не удалось поставить пакеты. Три частые причины, по убыванию вероятности:

  1. Зеркало отдаёт 404 на файлы, которые есть в списке. Ubuntu убирает
     прежние точечные выпуски; помогает `sudo apt-get update` (скрипт его
     уже пробовал — значит дело не в этом либо зеркало отвечает с перебоями).
  2. Зеркало недоступно или неполно. Смените источник:
     `sudo sed -i 's|ru.archive.ubuntu.com|archive.ubuntu.com|' /etc/apt/sources.list.d/ubuntu.sources`
     затем `sudo apt-get update` и повторите `установить`.
  3. Нет сети или DNS. Проверьте: `ping -c1 archive.ubuntu.com`.
КОНЕЦ
)"
}

установить() {
  естьSudo || [ "$(id -u)" = 0 ] || стоп "нужен sudo или запуск от root"

  обновить_списки

  шаг "Node 22"
  # НЕ ИЗ РЕПОЗИТОРИЕВ UBUNTU: там 18.19, а `argon2` 0.45 и `puppeteer-core`
  # 25 на нём — лотерея с готовыми сборками.
  if node -v 2>/dev/null | grep -q '^v2[2-9]'; then
    годно "уже $(node -v)"
  else
    curl -fsSL https://deb.nodesource.com/setup_22.x | как_root -E bash - > /dev/null
    поставить nodejs
    годно "поставлен $(node -v)"
  fi

  шаг "PostgreSQL и мелочь"
  поставить postgresql python3 python3-venv curl unzip git
  годно "$(psql --version)"

  шаг "библиотеки для Chrome"
  # Без них Chrome на безголовой Ubuntu не стартует и молчит невнятно.
  # `libasound2t64` — имя именно для 24.04; старое `libasound2` не найдётся.
  поставить libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libpango-1.0-0 libasound2t64

  шаг "Chrome $CHROME_VER"
  # ИМЕННО ЭТА СБОРКА: эталоны `css_probe` учреждены на ней, а вычисленные
  # стили машинно-зависимы. Другая сборка даст расхождение — и это не дефект
  # проекта.
  if [ -d "$HOME/chrome/linux-$CHROME_VER" ]; then
    годно "уже есть"
  else
    ( cd "$HOME" && npx --yes @puppeteer/browsers install "chrome@$CHROME_VER" ) \
      > /dev/null 2>&1 || беда "Chrome не поставился — приёмка приложения работать не будет"
    годно "поставлен"
  fi

  шаг "служба PostgreSQL"
  как_root systemctl enable --now postgresql > /dev/null 2>&1 || true
  pg_isready > /dev/null 2>&1 && годно "принимает соединения" || беда "не отвечает"
}

# ── развёртывание ────────────────────────────────────────────────────────
развернуть() {
  SRC="${1:-}"
  [ -n "$SRC" ] || стоп "укажите архив или каталог: развернуть ~/philosphaira.zip"

  шаг "распаковка"
  if [ -d "$SRC" ]; then
    mkdir -p "$ROOT" && cp -r "$SRC"/. "$ROOT"/
    годно "скопировано из каталога"
  else
    [ -f "$SRC" ] || стоп "нет такого файла: $SRC"
    TMP=$(mktemp -d)

    # РАСПАКОВКА ПО СОДЕРЖИМОМУ, А НЕ ПО РАСШИРЕНИЮ ОДНОГО ВИДА. Прежде звался
    # только `unzip`, и на .tar.xz — том самом, каким проект и отдаётся, —
    # он падал невнятно.
    case "$SRC" in
      *.zip)                   unzip -q "$SRC" -d "$TMP" ;;
      *.tar.xz|*.txz|*.tar.gz|*.tgz|*.tar.bz2|*.tar)
                               # --warning=no-timestamp глушит ровно один
                               # повод для тревоги: «время в будущем» при
                               # отставших часах машины. Настоящие ошибки
                               # tar по-прежнему видны.
                               tar --warning=no-timestamp -xf "$SRC" -C "$TMP" ;;
      *) стоп "не знаю, чем открыть «$SRC»: жду .zip, .tar.xz, .tar.gz или .tar" ;;
    esac

    # ПОИСК БЕЗ ПРЕДЕЛА ГЛУБИНЫ.
    #
    # Прежде стояло `-maxdepth 2`, и этого хватало ровно на архив БЕЗ обёртки
    # (`server/package.json` во втором уровне). Архив С обёрткой —
    # `philosphaira/server/package.json` — лежит на третьем, и скрипт
    # сообщал «в архиве не нашлось server/package.json» про архив, где он
    # есть. Инструкция при этом обещала, что оба вида приняты.
    #
    # Причина не в числе 2, а в том, что путь через архив НИ РАЗУ НЕ
    # ПРОХОДИЛСЯ: прогон делался из каталога, и обе ветки выглядели
    # проверенными. Поэтому предел снят вовсе, а не увеличен на единицу:
    # обёртка бывает и двойной (архив в архиве, папка с датой).
    #
    # node_modules отсекается: там сотни package.json, и любой из них
    # в каталоге с именем server увёл бы поиск в чужое дерево.
    INNER=$(find "$TMP" -name node_modules -prune -o \
              -type f -path '*/server/package.json' -print 2>/dev/null \
            | awk '{ print gsub(/\//, "/"), $0 }' | sort -n | head -1 | cut -d' ' -f2-)
    INNER=$(printf '%s' "$INNER" | xargs -r dirname | xargs -r dirname)

    if [ -z "$INNER" ]; then
      беда "в распакованном не нашлось */server/package.json. Что внутри:"
      find "$TMP" -maxdepth 2 | head -15 | sed 's/^/    /'
      стоп "проверьте, тот ли это архив проекта"
    fi

    # ПРОВЕРКА, ЧТО НАШЛОСЬ ИМЕННО ДЕРЕВО ПРОЕКТА, а не случайное совпадение
    # имён: у проекта рядом с server/ обязаны лежать source/ и tools/.
    # ИМЯ ЛАТИНИЦЕЙ — см. шапку файла. Первая редакция этой проверки звала
    # переменную `ОБЯЗАН`, bash отвечал «not a valid identifier», и цикл
    # МОЛЧА НЕ ВЫПОЛНЯЛСЯ: проверка, которая ничего не проверяет, хуже
    # отсутствующей. Поймано прогоном по четырём видам архива.
    for need in source tools server; do
      [ -d "$INNER/$need" ] || стоп "в «$INNER» нет папки $need — это не дерево проекта"
    done

    mkdir -p "$ROOT" && cp -r "$INNER"/. "$ROOT"/
    rm -rf "$TMP"
    годно "распаковано в $ROOT"
  fi

  шаг "зависимости"
  # Два места: корень (приборы приёмки) и server (сам узел).
  ( cd "$ROOT" && npm install --no-audit --no-fund ) > /dev/null 2>&1 \
    && годно "корень" || беда "корень не встал — приёмка приложения не пойдёт"
  ( cd "$ROOT/server" && npm install --no-audit --no-fund ) > /dev/null 2>&1 \
    || стоп "зависимости сервера не встали"
  годно "server"

  шаг "две базы, а не одна"
  # ИСПЫТАТЕЛЬНАЯ ОТДЕЛЬНО, И ЭТО НЕ ПРИДИРКА: приёмка сносит `philos_test`
  # до пустого места. Одна база на оба дела — потерянные данные при первом
  # же прогоне приёмки.
  #
  # Локаль C.UTF-8, а не C: единственность логина держится на `lower()`, а в
  # голой C `lower('ИВАН')` возвращает `ИВАН`.
  for DB in philos philos_test; do
    if как_postgres psql -tAc \
        "SELECT 1 FROM pg_database WHERE datname='$DB'" 2>/dev/null | grep -q 1; then
      годно "$DB уже есть"
    else
      как_postgres createdb "$DB" --locale=C.UTF-8 --template=template0 \
        && годно "$DB создана"
    fi
  done
  как_postgres psql -tAc \
    "SELECT 1 FROM pg_roles WHERE rolname='philos'" 2>/dev/null | grep -q 1 \
    || как_postgres psql -c \
      "CREATE ROLE philos LOGIN PASSWORD 'philos'" > /dev/null
  for DB in philos philos_test; do
    как_postgres psql -c \
      "ALTER DATABASE $DB OWNER TO philos" > /dev/null 2>&1 || true
  done
  годно "роль philos владеет обеими"

  шаг "окружение"
  if [ -f "$ENVF" ]; then
    годно "$ENVF уже есть — не трогаю"
  else
    KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    cat > "$ENVF" <<EOF
DATABASE_URL=postgres://philos:philos@127.0.0.1:5432/philos
MFA_SECRET_KEY=$KEY
PORT=8814
# PUBLIC_URL=http://адрес-в-сети:8814   # корень ссылок в письмах
# NODE_ENV=production                   # cookie только по HTTPS — нужен ставень
EOF
    chmod 600 "$ENVF"
    годно "$ENVF заведён (права 600)"
    printf "  \033[33mСОХРАНИТЕ MFA_SECRET_KEY ВНЕ МАШИНЫ.\033[0m Потеряете — потеряете все TOTP.\n"
  fi

  set -a; . "$ENVF"; set +a

  шаг "схема"
  ( cd "$ROOT/server" && npm run migrate ) > /dev/null 2>&1 || стоп "миграции не прошли"
  годно "$(cd "$ROOT/server" && npm run migrate:status 2>/dev/null | tail -1)"

  шаг "семя графа"
  if ( cd "$ROOT/server" && npm run graph:import ) > /dev/null 2>&1; then
    годно "наборы внесены"
  else
    годно "граф уже не пуст — семя не трогаю (так и задумано)"
  fi

  шаг "первая раскладка"
  # ХРАНИМАЯ РАСКЛАДКА (миграции 013–014). Прежде каждый клиент считал её
  # сам, и выходила она у всех разная: один и тот же d3 в разных движках
  # расходится с медианой около 65 px. Пока человек один — незаметно; как
  # только двое, общий язык про «вон тот сгусток справа» пропадает.
  if [ -f "$ROOT/server/scripts/relayout.mjs" ]; then
    ( cd "$ROOT/server" && node scripts/relayout.mjs --применить ) > /dev/null 2>&1 \
      && годно "раскладка посчитана и записана" \
      || годно "раскладка не понадобилась (уже есть или нечего класть)"
  else
    беда "relayout.mjs нет — сборка старше миграций 013–014"
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

# ── управление ───────────────────────────────────────────────────────────
адрес() {
  P="${PORT:-8814}"
  IP=$(hostname -I 2>/dev/null | awk '{print $1}')
  printf "  на самой машине: http://127.0.0.1:%s/\n" "$P"
  [ -n "$IP" ] && printf "  в домашней сети: http://%s:%s/\n" "$IP" "$P"
}

пуск() {
  [ -f "$ENVF" ] || стоп "нет $ENVF — сперва `развернуть`"
  set -a; . "$ENVF"; set +a
  pg_isready > /dev/null 2>&1 || стоп "PostgreSQL не отвечает"

  # P ПРОВЕРЯЕТСЯ ДО ПОДЪЁМА. Занятый порт даёт EADDRINUSE в журнале, а
  # снаружи выглядит как «сервер не поднялся» — и человек лезет чинить
  # проект вместо того, чтобы погасить прежний узел.
  if command -v ss > /dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ":${PORT:-8814} "; then
    стоп "порт ${PORT:-8814} уже занят — погасите прежний узел (`стоп`)"
  fi

  if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; then
    годно "узел уже работает, pid $(cat "$PIDF")"
  else
    # PID БЕРЁТСЯ У САМОГО NODE, А НЕ У ПОДОБОЛОЧКИ. Запись вида
    # `( cd … && nohup node … & echo $! )` кладёт pid ПОДОБОЛОЧКИ: она
    # завершается сразу, а узел живёт дальше — `стоп` рапортует об успехе,
    # порт остаётся занят, и следующий `пуск` падает с невнятным EADDRINUSE.
    # Поймано прогоном: после `стоп` страница отвечала.
    cd "$ROOT/server"
    nohup node scripts/serve.mjs >> "$LOGF" 2>&1 &
    echo $! > "$PIDF"
    cd - > /dev/null
    sleep 3
    kill -0 "$(cat "$PIDF")" 2>/dev/null \
      && годно "узел поднят, pid $(cat "$PIDF")" \
      || стоп "узел не поднялся. Последние строки: $(tail -5 "$LOGF")"
  fi

  # ВТОРОЙ ПРОЦЕСС, И ОН НУЖЕН ВСЕГДА. Цепочка живого отклика: коммит кладёт
  # извещение в исходящие → РАБОТНИК публикует в шину → узел рассылает по
  # сокетам → страница берёт приращение. Нет работника — нет второго звена,
  # и чужая правка не доходит до открытых страниц вовсе.
  #
  # Извещение в шину идёт ДО почты и независимо от неё: работник нужен не
  # «когда заведёте почту», а всегда.
  if [ -f "$PIDW" ] && kill -0 "$(cat "$PIDW")" 2>/dev/null; then
    годно "работник уже работает, pid $(cat "$PIDW")"
  else
    cd "$ROOT/server"
    nohup node scripts/notify-worker.mjs >> "$LOGW" 2>&1 &
    echo $! > "$PIDW"
    cd - > /dev/null
    sleep 2
    kill -0 "$(cat "$PIDW")" 2>/dev/null \
      && годно "работник уведомлений пошёл, pid $(cat "$PIDW")" \
      || беда "работник не пошёл — живое обновление будет молчать"
  fi
  адрес
}

стоп_всё() {
  for PAIR in "$PIDW работник" "$PIDF узел"; do
    set -- $PAIR
    if [ -f "$1" ] && kill "$(cat "$1")" 2>/dev/null; then годно "$2 остановлен"; fi
    rm -f "$1"
  done
}

состояние() {
  [ -f "$ENVF" ] && { set -a; . "$ENVF"; set +a; }
  pg_isready > /dev/null 2>&1 && годно "PostgreSQL отвечает" || беда "PostgreSQL стоит"

  if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; then
    годно "узел работает, pid $(cat "$PIDF")"
    curl -sI "http://127.0.0.1:${PORT:-8814}/" 2>/dev/null | head -1 | sed 's/^/    /'
    адрес
  else
    беда "узел стоит"
  fi

  # МОЛЧАНИЕ РАБОТНИКА — ЕДИНСТВЕННАЯ БЕДА, НЕ ВИДНАЯ НА ГЛАЗ: сервер
  # отвечает, страница работает, правки сохраняются. Потому он показывается
  # отдельно, и тут же считается неразосланное.
  if [ -f "$PIDW" ] && kill -0 "$(cat "$PIDW")" 2>/dev/null; then
    годно "работник уведомлений работает, pid $(cat "$PIDW")"
  else
    беда "работник СТОИТ — чужие правки не дойдут до открытых страниц"
  fi
  PENDING=$(psql "${DATABASE_URL:-}" -tAc \
    "SELECT count(*) FROM outbox WHERE delivered_at IS NULL" 2>/dev/null | tr -d ' ')
  [ -n "$PENDING" ] && [ "$PENDING" != "0" ] \
    && беда "в исходящих не разослано: $PENDING" \
    || true
}

журнал() { tail -n "${1:-40}" "$LOGF" "$LOGW" 2>/dev/null; }

служба() {
  естьSudo || [ "$(id -u)" = 0 ] || стоп "нужен sudo"
  WHO="${SUDO_USER:-$USER}"
  # ДВЕ СЛУЖБЫ, А НЕ ОДНА — по той же причине, что и в `пуск`.
  for PAIR in "philosphaira serve.mjs" "philosphaira-worker notify-worker.mjs"; do
    set -- $PAIR
    как_root tee "/etc/systemd/system/$1.service" > /dev/null <<EOF
[Unit]
Description=Philosphaira ($2)
After=network.target postgresql.service

[Service]
Type=simple
User=$WHO
WorkingDirectory=$ROOT/server
EnvironmentFile=$ENVF
ExecStart=/usr/bin/node scripts/$2
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
    годно "$1.service записан"
  done
  как_root systemctl daemon-reload
  как_root systemctl enable --now philosphaira philosphaira-worker
  годно "обе службы включены; журнал — journalctl -u philosphaira -f"
}

приёмка() {
  set -a; . "$ENVF"; set +a
  # ЖЁСТКО ИСПЫТАТЕЛЬНАЯ DB, что бы ни стояло в окружении: `db_probe`
  # откатывает её до пустого места, и одна забытая переменная стоила бы
  # рабочих данных.
  DATABASE_URL="postgres://philos:philos@127.0.0.1:5432/philos_test" \
  CHROME="$(ls -d "$HOME/chrome/linux-$CHROME_VER"/chrome-linux64/chrome 2>/dev/null || true)" \
    bash "$ROOT/server/accept.sh"
}

cmd="${1:-}"
case "$cmd" in
  установить) установить ;;
  развернуть) развернуть "${2:-}" ;;
  пуск)       пуск ;;
  стоп)       стоп_всё ;;
  состояние)  состояние ;;
  журнал)     журнал "${2:-40}" ;;
  адрес)      [ -f "$ENVF" ] && { set -a; . "$ENVF"; set +a; }; адрес ;;
  служба)     служба ;;
  приёмка)    приёмка ;;
  *)
    cat <<'EOF'
ΦilosΦaira на Ubuntu 24.04

  bash philos-ubuntu.sh установить          пакеты, Node 22, PostgreSQL, Chrome 131
  bash philos-ubuntu.sh развернуть <путь>   архив .zip или каталог с проектом
  bash philos-ubuntu.sh пуск                узел И работник уведомлений
  bash philos-ubuntu.sh стоп
  bash philos-ubuntu.sh состояние           оба процесса и очередь исходящих
  bash philos-ubuntu.sh журнал [строк]
  bash philos-ubuntu.sh адрес
  bash philos-ubuntu.sh служба              автозапуск: ДВЕ службы systemd
  bash philos-ubuntu.sh приёмка             на испытательной базе philos_test

Подробности и доводы — в philosphaira-развёртывание.md.
EOF
    ;;
esac
