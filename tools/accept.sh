#!/bin/bash
# ЕДИНАЯ ТОЧКА ПРИЁМКИ. Одна команда на весь предмет.
#
# До неё приёмок было две и они не знали друг о друге: tools/accept_all.sh
# гонял приборы приложения, server/accept.sh — пробы сервера. «Прогнать
# всё» означало помнить обе команды, а помнящий уходит вместе с беседой.
#
# Сюда же поставлены три вещи, которых не было ни в одной из них:
#   blind_probe — седьмой эталон, замороженный 20 августа и НЕ ЗАПУЩЕННЫЙ
#     ни разу за фазы 0–4: тридцать раз докладывалось «приёмка зелёная»
#     при неработавшем приборе;
#   tip_probe и draft_probe — заведены в заходах 0.1 и 0.3 и жили только
#     во временном скрипте;
#   присмотр за статическим сервером — в этом окружении он умирает сам по
#     себе, а обход длится дольше, чем сервер живёт.
#
#   bash tools/accept.sh              — приложение и сервер
#   bash tools/accept.sh --только-приложение
#   bash tools/accept.sh --только-сервер
#
# Переменные для серверного слоя: DATABASE_URL, MFA_SECRET_KEY.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
TREE="${TREE:-app}"
SNAPS="${SNAPS:-/tmp/приёмка}"
PORT="${PORT:-8711}"
mkdir -p "$SNAPS"

WHAT="${1:-всё}"
BAD=0
verdict() { # имя, код
  if [ "$2" -eq 0 ]; then printf '  %-34s зелено\n' "$1"
  else printf '✗ %-34s КРАСНО\n' "$1"; BAD=$((BAD+1)); fi
}

# ГДЕ ЛЕЖИТ ПРОГРАММА — СПРАШИВАЕТСЯ, А НЕ ЗАШИВАЕТСЯ.
#
# Здесь было 35 строк вида `node tools/имя.mjs`, то есть 35 мест, знающих
# раскладку папки наизусть. Таблица РАЗМЕЩЕНИЕ живёт в tools/paths.mjs (и
# близнеце paths.py); спрашивается она ОДИН раз при запуске — по имени
# программы отдаётся полный путь. Имена здесь ЛАТИНСКИЕ: bash кириллицы в
# именах переменных и функций не принимает — на этом уже спотыкались
# serve.sh и первая редакция помощника «прогон».
# Разойдутся программы по подпапкам —
# поправится таблица, а этот скрипт останется прежним.
declare -A TOOLS
while IFS='=' read -r NAME PATH_; do [ -n "$NAME" ] && TOOLS["$NAME"]="$PATH_"; done < <(
  node -e "
    import('$ROOT/tools/paths.mjs').then(p => {
      for (const имя of Object.keys(p.РАЗМЕЩЕНИЕ)) console.log(имя + '=' + p.программа(имя));
    });
  ")
if [ "${#TOOLS[@]}" -eq 0 ]; then
  echo "✗ не удалось спросить tools/paths.mjs, где лежат программы"
  exit 1
fi
tool() {  # имя программы → путь; незнакомое имя останавливает приёмку
  if [ -z "${TOOLS[$1]:-}" ]; then echo "✗ приёмка зовёт неизвестную программу: $1" >&2; exit 1; fi
  printf '%s' "${TOOLS[$1]}"
}

# ПОДНЯТЬ СЕРВЕР — И УБЕДИТЬСЯ, ЧТО ОН ОТВЕЧАЕТ.
#
# Прежняя редакция при неответе просто запускала ещё один и шла дальше. А
# сокет остаётся занят ПОВИСШИМ сервером: пересборка app/ под работающим
# serve.py роняет его, не отпуская порта. Тогда новый падает с «Address
# already in use», страница не отдаётся — и КАЖДЫЙ прибор падает на goto.
# Замер 10 сентября 2026: так прошла целая приёмка, доложив о четырёх
# красных приборах и ЗЕЛЁНЫХ шести эталонах и обходе (см. ниже, почему).
serve_up() {
  curl -s --max-time 5 -o /dev/null "http://127.0.0.1:$PORT/index.html" && return 0
  pkill -f "serve.py $PORT" 2>/dev/null
  pkill -f "http.server $PORT" 2>/dev/null
  sleep 1
  setsid python3 "$(tool serve.py)" "$PORT" "$ROOT/$TREE" > /tmp/serve.log 2>&1 < /dev/null &
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    curl -s --max-time 5 -o /dev/null "http://127.0.0.1:$PORT/index.html" && return 0
  done
  echo "✗ СЕРВЕР НА $PORT НЕ ПОДНЯЛСЯ — приёмка бессмысленна, дальше не идём"
  tail -3 /tmp/serve.log
  exit 1
}

# ПРОГНАТЬ ПРИБОР СО СНИМКОМ.
#
# Снимок СНАЧАЛА УДАЛЯЕТСЯ. Прежде прибор писал в $SNAPS, и если он падал,
# там оставался файл ПРОШЛОГО прогона — а `baseline.mjs проверить` сверял
# эталон с ним и отвечал «разошлось 0». Приёмка объявляла зелёными шесть
# эталонов и весь обход, не измерив ничего. Молчаливый отказ ровно того рода,
# о котором предупреждает readme §8.
# ИМЕНА ПЕРЕМЕННЫХ ЗДЕСЬ ЛАТИНСКИЕ, И ЭТО НЕ НЕБРЕЖНОСТЬ: bash кириллицы в
# именах не принимает вовсе — `local прибор=…` он читает как негодное имя и
# продолжает работать, подставляя пустоту. На этом уже спотыкался serve.sh
# (readme, «Сверка перечней с папкой»), и здесь я наступил на то же место.
прогон() {  # прибор, файл, доводы…
  local PROBE="$1" FILE="$2"; shift 2
  rm -f "$FILE"
  node "$(tool "$PROBE.mjs")" "$@" > /dev/null 2>&1
  if [ ! -s "$FILE" ]; then
    echo "✗ $PROBE не оставил снимка $FILE — прибор не отработал"
    return 1
  fi
  return 0
}

export PUPPETEER="${PUPPETEER:-$ROOT/node_modules/puppeteer-core}"
export BASE="http://127.0.0.1:$PORT/"

if [ "$WHAT" != "--только-сервер" ]; then
  echo "════ ПРИЛОЖЕНИЕ"
  echo "── строение (секунды)"
  node "$(tool check_modules.mjs)" > /dev/null 2>&1; verdict "строение" $?
  node "$(tool layers.mjs)" ввозы 2>/dev/null | grep -q "СНИЗУ ВВЕРХ: 0"; verdict "рёбер снизу вверх нет" $?
  node "$(tool maps_fresh.mjs)" 2>/dev/null | grep -q "все карты свежие"; verdict "карты свежие" $?
  python3 "$(tool bridge_debt.py)" 2>/dev/null | grep -q "ОСТАТОК ДОЛГА                    0"; verdict "долг закрыт" $?
  node "$(tool doc_numbers.mjs)" > /dev/null 2>&1; verdict "числа в документации сходятся" $?
  # Признак boot: в сборке только связывание, значений 0 (readme §17). Обещан
  # приёмке с августа, а входил в неё только на словах — до 2026-09-10.
  node "$(tool boot_values.mjs)" > /dev/null 2>&1; verdict "значений в boot() нет" $?

  # БАЗА, ПРАВЛЕННАЯ МИМО ИНТЕРФЕЙСА. Через интерфейс связь получает имя, а
  # запись — место по хронологии; правка литералов в исходнике руками этого
  # не даёт. Оба прибора здесь только ПРОВЕРЯЮТ, ничего не пишут.
  node "$(tool add_relation_ids.mjs)" --check 2>&1 | grep -q "выдаём 0"; verdict "у каждой связи есть имя" $?
  node "$(tool reorder_chrono.mjs)" --проверить 2>&1 | grep -q "нарушений хронологии 0" \
    && node "$(tool reorder_chrono.mjs)" --проверить 2>&1 | grep -q "групп не по порядку 0" \
    && node "$(tool reorder_chrono.mjs)" --проверить 2>&1 | grep -q "источник не по порядку 0"
  verdict "записи базы в хронологическом порядке" $?

  # ИНВАРИАНТ ИСХОДНИК ↔ ДЕРЕВО. Ставится ПОСЛЕДНИМ среди быстрых и ДО
  # приборов: он пересобирает дерево, и все дальнейшие замеры должны идти
  # по тому, что порождено, а не по тому, что кто-то поправил руками.
  # Зелёную копию программа снимает сама и возвращает при любом исходе.
  node "$(tool build_invariant.mjs)" 2>&1 | grep -q "ИНВАРИАНТ ДЕРЖИТСЯ"
  verdict "дерево воспроизводится из исходника" $?

  # СОХРАННОСТЬ СОДЕРЖАНИЯ. Стоит РЯДОМ с инвариантом и по той же причине:
  # оба стерегут не поведение, а то, что правка задела ровно то, что
  # собирались задеть. Правка кода не смеет менять ни одного описания.
  node "$(tool content_probe.mjs)" > /dev/null 2>&1
  verdict "содержание не тронуто правкой кода" $?

  # ЧЕСТНОСТЬ ВЕРСИЙ ФОРМУЛ. Стоит рядом с сохранностью содержания: оба
  # прибора стерегут не поведение, а достоверность того, что мы о себе
  # говорим. Замер метрики без верной версии формулы — число без
  # родословной, и ряд таких замеров лжёт убедительнее, чем их отсутствие.
  node "$(tool formula_probe.mjs)" > /dev/null 2>&1
  verdict "версии формул честны" $?

  # ОТМЕТКА В ПЛАНЕ ПРОТИВ ДЕРЕВА. Третий прибор этого рода: инвариант
  # стережёт согласие дерева с исходником, содержание — согласие правки с
  # замыслом, а этот — согласие СКАЗАННОГО О РАБОТЕ с самой работой.
  # Повод был: E-1 стоял отмеченным, а заслон согласованности был вплетён
  # в одно окно из трёх.
  node "$(tool plan_probe.mjs)" > /dev/null 2>&1
  verdict "отметки в плане подтверждены деревом" $?

  # СЛУЖБА БЕЗ ХОДА, ПРАВО БЕЗ ПРИМЕНЕНИЯ. Четвёртый прибор согласия: три
  # предыдущих сверяют дерево с исходником, правку с замыслом и сказанное с
  # сделанным, а этот — СЛОИ МЕЖДУ СОБОЙ. Повод: три службы работали и не
  # были выведены наружу, включая снятие второго шага — защиту, из которой
  # не было выхода.
  node "$(tool exposure_probe.mjs)" > /dev/null 2>&1
  verdict "службы и права согласны с ходами наружу" $?

  # ОПЕРАЦИОННЫЕ ФАКТЫ ИНСТРУКЦИИ. Пятый прибор согласия: команда, названная
  # в README, должна существовать; переменная — читаться кодом; путь — быть
  # в дереве; порт — совпадать. Читающий инструкцию сделает то, чего сделать
  # нельзя, и решит, что сломан продукт, а не текст.
  node "$(tool ops_probe.mjs)" > /dev/null 2>&1
  verdict "инструкция согласна с деревом" $?

  python3 "$(tool make_ref.py)" > /dev/null 2>&1
  serve_up

  echo "── утверждения и свои пробы (минуты)"
  node "$(tool assert_probe.mjs)" index.html 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "assert_probe" $?
  serve_up; node "$(tool tip_probe.mjs)"   2>&1 | tail -1 | grep -q "переживают"; verdict "tip_probe" $?
  serve_up; node "$(tool draft_probe.mjs)" 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "draft_probe" $?
  # layout_probe меряет живую раскладку и десять случайных стартов — минуты
  serve_up; node "$(tool layout_probe.mjs)" 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "layout_probe" $?
  # Свежесть набора позиций: отпечаток базы против отпечатка в наборе.
  # Забыть `node "$(tool layout.mjs)"` после правки базы легко, а последствие
  # тихое — страница просто снова считает раскладку двадцать секунд.
  node "$(tool maps_fresh.mjs)" 2>&1 | grep -q "все карты свежие"; verdict "карты и позиции свежи" $?
  node "$(tool tools_listed.mjs)" 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "перечень программ сходится" $?
  node "$(tool resets_listed.mjs)" 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "сбрасыватели кешей не забыты" $?

  echo "── эталоны (минуты)"
  for P in compare probe6 probe7 probe8 css_probe blind_probe; do
    serve_up
    if прогон "$P" "$SNAPS/$P.json" run index.html "$SNAPS/$P.json"; then
      node "$(tool baseline.mjs)" проверить "$P" "$SNAPS/$P.json" 2>&1 \
        | grep -q "разошлось 0"; verdict "$P против эталона" $?
    else
      verdict "$P против эталона" 1
    fi
  done

  echo "── сличение сторон (минуты)"
  for P in probe4 probe5 graph_probe; do
    serve_up; прогон "$P" "$SNAPS/${P}_и.json" run _ref-orig.html "$SNAPS/${P}_и.json"; SRC=$?
    serve_up; прогон "$P" "$SNAPS/${P}_м.json" run index.html     "$SNAPS/${P}_м.json"; TREE_=$?
    if [ $SRC -eq 0 ] && [ $TREE_ -eq 0 ]; then
      node "$(tool "$P.mjs")" diff "$SNAPS/${P}_и.json" "$SNAPS/${P}_м.json" 2>&1 \
        | grep -q "разошлось 0"; verdict "$P по сторонам" $?
    else
      verdict "$P по сторонам" 1
    fi
  done

  echo "── полный обход (около получаса; три части на сторону)"
  SWEEP=0
  for PART in 1 2 3; do
    serve_up; прогон sweep_all "$SNAPS/o$PART.json" run _ref-orig.html "$SNAPS/o$PART.json" $PART || SWEEP=1
    serve_up; прогон sweep_all "$SNAPS/m$PART.json" run index.html     "$SNAPS/m$PART.json" $PART || SWEEP=1
  done
  verdict "обход отработал по частям" $SWEEP
  node "$(tool sweep_all.mjs)" merge "$SNAPS/и.json" - "$SNAPS/o1.json" "$SNAPS/o2.json" "$SNAPS/o3.json" > /dev/null
  node "$(tool sweep_all.mjs)" merge "$SNAPS/м.json" - "$SNAPS/m1.json" "$SNAPS/m2.json" "$SNAPS/m3.json" > /dev/null
  node "$(tool sweep_all.mjs)" diff "$SNAPS/и.json" "$SNAPS/м.json" 2>&1 | grep -q "разошлось 0"
  verdict "обход по сторонам" $?
  node "$(tool baseline.mjs)" проверить sweep_all "$SNAPS/м.json" 2>&1 | grep -q "разошлось 0"
  verdict "обход против эталона" $?
  # Ошибки страницы — отдельное утверждение: обход их считает, но молча.
  node -e "
    const д = require('$SNAPS/м.json');
    const о = д.__errs || [];
    if (о.length) { console.error(о.slice(0,3).join(' | ')); process.exit(1); }
  "; verdict "ошибок страницы нет" $?
fi

if [ "$WHAT" != "--только-приложение" ]; then
  echo
  echo "════ СЕРВЕР"
  if [ -z "${DATABASE_URL:-}" ]; then
    echo "✗ DATABASE_URL не задан — серверный слой пропущен"
    BAD=$((BAD+1))
  else
    bash server/accept.sh 2>&1 | grep -E "^══|не сошлось|ПРИЁМКА"
    bash server/accept.sh > /dev/null 2>&1; verdict "приёмка сервера" $?
  fi
fi

echo
if [ "$BAD" -eq 0 ]; then echo "ПРИЁМКА ЗЕЛЁНАЯ"; else echo "ПРИЁМКА КРАСНАЯ: $BAD"; fi
exit "$BAD"
