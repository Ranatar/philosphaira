#!/bin/bash
# Приёмка серверной части. Два слоя: строение (без базы) и база.
set -u
cd "$(dirname "$0")"
echo "══ строение"
node probes/structure_probe.mjs; s=$?
echo
echo "══ правила"
node probes/rules_probe.mjs | tail -3; r=${PIPESTATUS[0]}
echo
echo "══ база"
node probes/db_probe.mjs | tail -3; d=${PIPESTATUS[0]}
echo
echo "══ вход"
node probes/auth_probe.mjs | tail -3; a=${PIPESTATUS[0]}
echo
echo "══ второй шаг"
node probes/mfa_probe.mjs | tail -3; m=${PIPESTATUS[0]}
echo
echo "══ управление пользователями"
node probes/users_probe.mjs | tail -3; u=${PIPESTATUS[0]}
echo
echo "══ перенос графа"
node probes/graph_probe.mjs | tail -3; g=${PIPESTATUS[0]}
echo
echo "══ коммиты"
node probes/commits_probe.mjs | tail -3; k=${PIPESTATUS[0]}
echo
echo "══ слияние (чистые функции)"
node probes/merge_probe.mjs | tail -3; f=${PIPESTATUS[0]}
echo
echo "══ применение и рассмотрение"
node probes/apply_probe.mjs | tail -3; y=${PIPESTATUS[0]}
echo
echo "══ откат, история, приращение"
node probes/revert_probe.mjs | tail -3; v=${PIPESTATUS[0]}
echo
echo "══ уведомления"
node probes/notify_probe.mjs | tail -3; n=${PIPESTATUS[0]}
echo
echo "══ доставка"
node probes/worker_probe.mjs | tail -3; w=${PIPESTATUS[0]}
echo
echo "══ соединения"
node probes/ws_probe.mjs | tail -3; c=${PIPESTATUS[0]}
echo
echo "══ слой HTTP"
node probes/http_probe.mjs | tail -3; h=${PIPESTATUS[0]}
echo
echo "══ страница в серверном режиме"
node probes/page_probe.mjs | tail -3; p=${PIPESTATUS[0]}
echo
echo "══ штатный запуск"
node probes/bootstrap_probe.mjs | tail -3; b=${PIPESTATUS[0]}
echo
[ $s -eq 0 ] && [ $r -eq 0 ] && [ $d -eq 0 ] && [ $a -eq 0 ] && [ $m -eq 0 ] \
  && [ $u -eq 0 ] && [ $g -eq 0 ] && [ $k -eq 0 ] && [ $f -eq 0 ] && [ $y -eq 0 ] \
  && [ $v -eq 0 ] && [ $n -eq 0 ] && [ $w -eq 0 ] && [ $c -eq 0 ] && [ $h -eq 0 ] \
  && [ $p -eq 0 ] && [ $b -eq 0 ] \
  && echo "ПРИЁМКА ЗЕЛЁНАЯ" || echo "ПРИЁМКА КРАСНАЯ"
exit $(( s + r + d + a + m + u + g + k + f + y + v + n + w + c + h + p + b ))
