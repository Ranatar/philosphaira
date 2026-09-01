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

serve_up() {
  curl -s -o /dev/null "http://127.0.0.1:$PORT/index.html" && return 0
  python3 -m http.server "$PORT" --directory "$ROOT/$TREE" > /tmp/serve.log 2>&1 &
  sleep 3
}

export PUPPETEER="${PUPPETEER:-$ROOT/node_modules/puppeteer-core}"
export BASE="http://127.0.0.1:$PORT/"

if [ "$WHAT" != "--только-сервер" ]; then
  echo "════ ПРИЛОЖЕНИЕ"
  echo "── строение (секунды)"
  node tools/check_modules.mjs > /dev/null 2>&1; verdict "строение" $?
  node tools/layers.mjs ввозы 2>/dev/null | grep -q "СНИЗУ ВВЕРХ: 0"; verdict "рёбер снизу вверх нет" $?
  node tools/maps_fresh.mjs 2>/dev/null | grep -q "все карты свежие"; verdict "карты свежие" $?
  python3 tools/bridge_debt.py 2>/dev/null | grep -q "ОСТАТОК ДОЛГА                    0"; verdict "долг закрыт" $?
  node tools/doc_numbers.mjs > /dev/null 2>&1; verdict "числа в документации сходятся" $?

  # ИНВАРИАНТ ИСХОДНИК ↔ ДЕРЕВО. Ставится ПОСЛЕДНИМ среди быстрых и ДО
  # приборов: он пересобирает дерево, и все дальнейшие замеры должны идти
  # по тому, что порождено, а не по тому, что кто-то поправил руками.
  # Зелёную копию программа снимает сама и возвращает при любом исходе.
  node tools/build_invariant.mjs 2>&1 | grep -q "ИНВАРИАНТ ДЕРЖИТСЯ"
  verdict "дерево воспроизводится из исходника" $?

  # СОХРАННОСТЬ СОДЕРЖАНИЯ. Стоит РЯДОМ с инвариантом и по той же причине:
  # оба стерегут не поведение, а то, что правка задела ровно то, что
  # собирались задеть. Правка кода не смеет менять ни одного описания.
  node tools/content_probe.mjs > /dev/null 2>&1
  verdict "содержание не тронуто правкой кода" $?

  # ЧЕСТНОСТЬ ВЕРСИЙ ФОРМУЛ. Стоит рядом с сохранностью содержания: оба
  # прибора стерегут не поведение, а достоверность того, что мы о себе
  # говорим. Замер метрики без верной версии формулы — число без
  # родословной, и ряд таких замеров лжёт убедительнее, чем их отсутствие.
  node tools/formula_probe.mjs > /dev/null 2>&1
  verdict "версии формул честны" $?

  # ОТМЕТКА В ПЛАНЕ ПРОТИВ ДЕРЕВА. Третий прибор этого рода: инвариант
  # стережёт согласие дерева с исходником, содержание — согласие правки с
  # замыслом, а этот — согласие СКАЗАННОГО О РАБОТЕ с самой работой.
  # Повод был: E-1 стоял отмеченным, а заслон согласованности был вплетён
  # в одно окно из трёх.
  node tools/plan_probe.mjs > /dev/null 2>&1
  verdict "отметки в плане подтверждены деревом" $?

  # СЛУЖБА БЕЗ ХОДА, ПРАВО БЕЗ ПРИМЕНЕНИЯ. Четвёртый прибор согласия: три
  # предыдущих сверяют дерево с исходником, правку с замыслом и сказанное с
  # сделанным, а этот — СЛОИ МЕЖДУ СОБОЙ. Повод: три службы работали и не
  # были выведены наружу, включая снятие второго шага — защиту, из которой
  # не было выхода.
  node tools/exposure_probe.mjs > /dev/null 2>&1
  verdict "службы и права согласны с ходами наружу" $?

  # ОПЕРАЦИОННЫЕ ФАКТЫ ИНСТРУКЦИИ. Пятый прибор согласия: команда, названная
  # в README, должна существовать; переменная — читаться кодом; путь — быть
  # в дереве; порт — совпадать. Читающий инструкцию сделает то, чего сделать
  # нельзя, и решит, что сломан продукт, а не текст.
  node tools/ops_probe.mjs > /dev/null 2>&1
  verdict "инструкция согласна с деревом" $?

  python3 tools/make_ref.py > /dev/null 2>&1
  serve_up

  echo "── утверждения и свои пробы (минуты)"
  node tools/assert_probe.mjs index.html 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "assert_probe" $?
  serve_up; node tools/tip_probe.mjs   2>&1 | tail -1 | grep -q "переживают"; verdict "tip_probe" $?
  serve_up; node tools/draft_probe.mjs 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "draft_probe" $?
  # layout_probe меряет живую раскладку и десять случайных стартов — минуты
  serve_up; node tools/layout_probe.mjs 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "layout_probe" $?
  # Свежесть набора позиций: отпечаток базы против отпечатка в наборе.
  # Забыть `node tools/layout.mjs` после правки базы легко, а последствие
  # тихое — страница просто снова считает раскладку двадцать секунд.
  node tools/maps_fresh.mjs 2>&1 | grep -q "все карты свежие"; verdict "карты и позиции свежи" $?
  node tools/tools_listed.mjs 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "перечень программ сходится" $?
  node tools/resets_listed.mjs 2>&1 | tail -1 | grep -q "не сошлось 0"; verdict "сбрасыватели кешей не забыты" $?

  echo "── эталоны (минуты)"
  for P in compare probe6 probe7 probe8 css_probe blind_probe; do
    serve_up
    node "tools/$P.mjs" run index.html "$SNAPS/$P.json" > /dev/null 2>&1
    node tools/baseline.mjs проверить "$P" "$SNAPS/$P.json" 2>&1 \
      | grep -q "разошлось 0"; verdict "$P против эталона" $?
  done

  echo "── сличение сторон (минуты)"
  for P in probe4 probe5 graph_probe; do
    serve_up; node "tools/$P.mjs" run _ref-orig.html "$SNAPS/${P}_и.json" > /dev/null 2>&1
    serve_up; node "tools/$P.mjs" run index.html     "$SNAPS/${P}_м.json" > /dev/null 2>&1
    node "tools/$P.mjs" diff "$SNAPS/${P}_и.json" "$SNAPS/${P}_м.json" 2>&1 \
      | grep -q "разошлось 0"; verdict "$P по сторонам" $?
  done

  echo "── полный обход (около получаса; три части на сторону)"
  for PART in 1 2 3; do
    serve_up; node tools/sweep_all.mjs run _ref-orig.html "$SNAPS/o$PART.json" $PART > /dev/null 2>&1
    serve_up; node tools/sweep_all.mjs run index.html     "$SNAPS/m$PART.json" $PART > /dev/null 2>&1
  done
  node tools/sweep_all.mjs merge "$SNAPS/и.json" - "$SNAPS/o1.json" "$SNAPS/o2.json" "$SNAPS/o3.json" > /dev/null
  node tools/sweep_all.mjs merge "$SNAPS/м.json" - "$SNAPS/m1.json" "$SNAPS/m2.json" "$SNAPS/m3.json" > /dev/null
  node tools/sweep_all.mjs diff "$SNAPS/и.json" "$SNAPS/м.json" 2>&1 | grep -q "разошлось 0"
  verdict "обход по сторонам" $?
  node tools/baseline.mjs проверить sweep_all "$SNAPS/м.json" 2>&1 | grep -q "разошлось 0"
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
