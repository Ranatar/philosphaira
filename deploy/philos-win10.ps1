# ΦilosΦaira на Windows 10 — установка, развёртывание, управление, приёмка.
#
# Спутник инструкции `philosphaira-win10.md`: то же самое, но одной командой.
# Инструкцию стоит прочесть — здесь объяснены только те решения, которые
# иначе выглядят произволом.
#
#   .\philos-win10.ps1 установить          # Node 22, PostgreSQL 16, Chrome 131
#   .\philos-win10.ps1 развернуть <путь>   # архив или каталог с проектом
#   .\philos-win10.ps1 пуск | стоп | состояние | журнал | адрес
#   .\philos-win10.ps1 доступ              # правило брандмауэра на порт узла
#   .\philos-win10.ps1 служба              # автозапуск при входе (ДВЕ задачи)
#   .\philos-win10.ps1 приёмка             # на испытательной базе philos_test
#
# ИМЕНА ЛАТИНИЦЕЙ. PowerShell кириллические имена принимает, но в проекте
# правило одно на весь код: латиница. Кириллица остаётся там, где она и
# нужна, — в словах команд и в том, что видит человек.
#
# ЧЕМ ЭТО НЕ ПЕРЕВОД philos-ubuntu.sh. Четыре места переписаны по существу,
# а не построчно:
#   * пользователя `postgres` в системе Windows нет — установщик EDB заводит
#     только роль внутри СУБД, и обращаться к ней надо по паролю;
#   * systemd нет — автозапуск идёт через планировщик задач при входе;
#   * прав вида `chmod 600` нет — наследование прав снимается через icacls,
#     иначе `philos.env` с ключом MFA читает кто угодно;
#   * приёмка перенесена сюда (см. Invoke-Accept), а не зовётся из bash.
#
# ЕСЛИ ЭТО ВИРТУАЛКА. На Ubuntu брандмауэр по умолчанию пропускает всё, и
# вопроса доступа снаружи не возникает вовсе. Windows входящие соединения
# по умолчанию НЕ ПУСКАЕТ: узел поднимется, порт займёт, `состояние` скажет
# «работает» — а с хозяйской машины страница не откроется. Отсюда отдельное
# действие `доступ` и проверка правила в `состояние`.

$ErrorActionPreference = 'Stop'
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Root       = if ($env:PHILOS_ROOT) { $env:PHILOS_ROOT } else { Join-Path $HOME 'philosphaira' }
$EnvFile    = if ($env:PHILOS_ENV)  { $env:PHILOS_ENV }  else { Join-Path $HOME 'philos.env' }
$LogDir     = if ($env:PHILOS_LOGS) { $env:PHILOS_LOGS } else { Join-Path $HOME '.philos-logs' }
$ServerLog  = Join-Path $LogDir 'server.log'
$WorkerLog  = Join-Path $LogDir 'worker.log'
$ServerPid  = Join-Path $LogDir 'server.pid'
$WorkerPid  = Join-Path $LogDir 'worker.pid'
$ChromeVer  = '131.0.6778.204'
$PgVersion  = '16'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Step($text) { Write-Host "`n▸ $text" -ForegroundColor White }
function Ok  ($text) { Write-Host "  ✓ $text" -ForegroundColor Green }
function Bad ($text) { Write-Host "  ✗ $text" -ForegroundColor Yellow }
function Die ($text) { Write-Host "`n✗ $text" -ForegroundColor Red; exit 1 }

function Test-Admin {
  $id = [Security.Principal.WindowsIdentity]::GetCurrent()
  (New-Object Security.Principal.WindowsPrincipal $id).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ── окружение ────────────────────────────────────────────────────────────
# Файл philos.env читается ТЕМ ЖЕ синтаксисом, что и в Ubuntu (KEY=value),
# чтобы один и тот же файл годился на обеих системах: переносят обычно
# вместе с базой.
function Import-EnvFile {
  if (-not (Test-Path $EnvFile)) { return $false }
  foreach ($line in Get-Content $EnvFile) {
    if ($line -match '^\s*#' -or $line -notmatch '=') { continue }
    $name, $value = $line -split '=', 2
    Set-Item -Path "Env:$($name.Trim())" -Value $value.Trim()
  }
  return $true
}

# Путь к psql известен только после установки EDB: в PATH он не попадает.
function Get-PsqlPath {
  if (Get-Command psql -ErrorAction SilentlyContinue) { return 'psql' }
  $guess = "C:\Program Files\PostgreSQL\$PgVersion\bin\psql.exe"
  if (Test-Path $guess) { return $guess }
  $found = Get-ChildItem 'C:\Program Files\PostgreSQL' -Filter psql.exe -Recurse `
             -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { return $found.FullName }
  return $null
}

# СЛУЖЕБНАЯ РОЛЬ, А НЕ СИСТЕМНЫЙ ПОЛЬЗОВАТЕЛЬ. В Ubuntu скрипт ходит
# `sudo -u postgres`; здесь такого пользователя нет вовсе, и единственный
# путь — пароль роли postgres, заданный при установке.
function Invoke-Psql($sqlText, [switch]$Quiet) {
  $psql = Get-PsqlPath
  if (-not $psql) { Die "psql не найден — PostgreSQL не установлен?" }
  $old = $env:PGPASSWORD
  $env:PGPASSWORD = if ($env:POSTGRES_PASSWORD) { $env:POSTGRES_PASSWORD } else { 'postgres' }
  try {
    $out = & $psql -U postgres -h 127.0.0.1 -tAc $sqlText 2>&1
    if (-not $Quiet -and $LASTEXITCODE -ne 0) { Bad ($out | Select-Object -First 1) }
    return $out
  } finally { $env:PGPASSWORD = $old }
}

function Test-Postgres {
  $out = Invoke-Psql 'SELECT 1' -Quiet
  return ($LASTEXITCODE -eq 0 -and "$out".Trim() -eq '1')
}

# ── установка ────────────────────────────────────────────────────────────
function Invoke-Install {
  if (-not (Test-Admin)) { Die 'запустите PowerShell от имени администратора' }
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Die 'нет winget. Обновите «Установщик приложений» из Microsoft Store либо ставьте вручную по philosphaira-win10.md §2'
  }

  Step 'Node 22'
  # ИМЕННО 22. На 18 не встанет `express` 5, а на 24 не проверялась приёмка.
  $node = (Get-Command node -ErrorAction SilentlyContinue)
  if ($node -and (node -v) -match '^v2[2-9]') {
    Ok "уже $(node -v)"
  } else {
    winget install --id OpenJS.NodeJS.LTS --silent --accept-source-agreements `
      --accept-package-agreements | Out-Null
    $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
                [Environment]::GetEnvironmentVariable('Path', 'User')
    if (Get-Command node -ErrorAction SilentlyContinue) { Ok "поставлен $(node -v)" }
    else { Die 'Node не встал. Закройте окно PowerShell и откройте заново — PATH обновляется только в новом.' }
  }

  Step "PostgreSQL $PgVersion"
  if (Get-PsqlPath) {
    Ok 'уже есть'
  } else {
    # Пароль роли postgres задаётся здесь и НИГДЕ БОЛЬШЕ не запрашивается.
    # Если ставили СУБД раньше и руками — передайте его переменной
    # POSTGRES_PASSWORD, иначе скрипт будет стучаться с умолчанием.
    winget install --id PostgreSQL.PostgreSQL.$PgVersion --silent `
      --accept-source-agreements --accept-package-agreements `
      --override "--mode unattended --superpassword postgres --serverport 5432 --locale C" | Out-Null
    if (Get-PsqlPath) { Ok 'поставлен (пароль роли postgres: postgres — смените после первого входа)' }
    else { Bad 'не встал; поставьте установщиком EDB по philosphaira-win10.md §2.2' }
  }

  Step "Chrome $ChromeVer"
  # ИМЕННО ЭТА СБОРКА: эталоны `css_probe` учреждены на ней, а вычисленные
  # стили машинно-зависимы. Другая сборка даст расхождение — и это будет не
  # дефект проекта. Ставим не системный Chrome, а отдельную копию для проб,
  # чтобы обновление браузера у человека не ломало приёмку.
  $chromeHome = Join-Path $HOME 'chrome'
  if (Test-Path (Join-Path $chromeHome "win64-$ChromeVer")) {
    Ok 'уже есть'
  } else {
    Push-Location $HOME
    try {
      & npx --yes '@puppeteer/browsers' install "chrome@$ChromeVer" *> $null
      if (Test-Path (Join-Path $chromeHome "win64-$ChromeVer")) { Ok 'поставлен' }
      else { Bad 'Chrome не поставился — приёмка приложения работать не будет' }
    } finally { Pop-Location }
  }

  Step 'служба PostgreSQL'
  $svc = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($svc) {
    if ($svc.Status -ne 'Running') { Start-Service $svc.Name }
    Set-Service $svc.Name -StartupType Automatic
    if (Test-Postgres) { Ok 'принимает соединения' } else { Bad 'служба идёт, но psql не отвечает — проверьте пароль роли postgres' }
  } else { Bad 'службы PostgreSQL нет' }
}

# ── развёртывание ────────────────────────────────────────────────────────
function Invoke-Deploy($source) {
  if (-not $source) { Die 'укажите архив или каталог: развернуть C:\philosphaira.zip' }

  Step 'распаковка'
  if (Test-Path $source -PathType Container) {
    New-Item -ItemType Directory -Force -Path $Root | Out-Null
    Copy-Item "$source\*" $Root -Recurse -Force
    Ok 'скопировано из каталога'
  } else {
    if (-not (Test-Path $source)) { Die "нет такого файла: $source" }
    $tmp = Join-Path $env:TEMP ("philos-" + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    if ($source -match '\.zip$') {
      Expand-Archive -Path $source -DestinationPath $tmp -Force
    } else {
      # .tar.xz и .tar.gz: tar есть в Windows 10 начиная с 1803.
      & tar -xf $source -C $tmp
      if ($LASTEXITCODE -ne 0) { Die 'tar не справился с архивом' }
    }
    # ПОИСК БЕЗ ПРЕДЕЛА ГЛУБИНЫ. Ищем не корень архива, а каталог, где лежит
    # server\package.json: обёртка бывает и одна, и двойная (папка с датой,
    # архив в архиве), и её может не быть вовсе.
    #
    # У близнеца на bash здесь стояло `-maxdepth 2`, и этого хватало ровно на
    # архив БЕЗ обёртки; архив С обёрткой давал «в архиве не нашлось
    # server/package.json» про архив, где он есть. Причина была не в числе, а
    # в том, что путь через архив ни разу не проходился — прогон делался из
    # каталога, и обе ветки выглядели проверенными. Здесь предел снят вовсе.
    #
    # node_modules отсекается: там сотни package.json, и любой из них в
    # каталоге с именем server увёл бы поиск в чужое дерево.
    $inner = Get-ChildItem $tmp -Recurse -Filter package.json -File -ErrorAction SilentlyContinue |
             Where-Object { $_.Directory.Name -eq 'server' -and $_.FullName -notmatch '\\node_modules\\' } |
             Sort-Object { ($_.FullName -split '\\').Count } | Select-Object -First 1
    if (-not $inner) {
      Bad 'в распакованном не нашлось server\package.json. Что внутри:'
      Get-ChildItem $tmp -Depth 1 | ForEach-Object { Write-Host "    $($_.FullName.Substring($tmp.Length+1))" }
      Die 'проверьте, тот ли это архив проекта'
    }
    $proj = Split-Path (Split-Path $inner.FullName -Parent) -Parent

    # ПРОВЕРКА, ЧТО НАШЛОСЬ ИМЕННО ДЕРЕВО ПРОЕКТА, а не случайное совпадение
    # имён: у проекта рядом с server\ обязаны лежать source\ и tools\.
    foreach ($need in @('source', 'tools', 'server')) {
      if (-not (Test-Path (Join-Path $proj $need))) {
        Die "в «$proj» нет папки $need — это не дерево проекта"
      }
    }
    New-Item -ItemType Directory -Force -Path $Root | Out-Null
    Copy-Item "$proj\*" $Root -Recurse -Force
    Remove-Item $tmp -Recurse -Force
    Ok "распаковано в $Root"
  }

  Step 'зависимости'
  # Два места: корень (приборы приёмки приложения) и server (сам узел).
  Push-Location $Root
  try { & npm install --no-audit --no-fund *> $null }
  finally { Pop-Location }
  if ($LASTEXITCODE -eq 0) { Ok 'корень' } else { Bad 'корень не встал — приёмка приложения не пойдёт' }

  Push-Location (Join-Path $Root 'server')
  try { & npm install --no-audit --no-fund *> $null }
  finally { Pop-Location }
  if ($LASTEXITCODE -ne 0) { Die 'зависимости сервера не встали' }
  Ok 'server'
  # argon2 — единственная нативная зависимость. Готовые сборки под Windows
  # x64 выкладываются каждым выпуском; если их не нашлось, npm пойдёт
  # собирать из исходников и потребует Visual Studio Build Tools.
  if (-not (Test-Path (Join-Path $Root 'server\node_modules\argon2'))) {
    Bad 'argon2 не встал — см. philosphaira-win10.md §11'
  }

  Step 'две базы, а не одна'
  # ИСПЫТАТЕЛЬНАЯ ОТДЕЛЬНО, И ЭТО НЕ ПРИДИРКА: приёмка сносит `philos_test`
  # до пустого места. Одна база на оба дела — потерянные данные при первом
  # же прогоне приёмки.
  #
  # Локаль C.UTF-8 в Windows-сборке PostgreSQL недоступна; годится
  # collation `C` с кодировкой UTF8. Существенно здесь одно: единственность
  # логина держится на `lower()`, а в голой C `lower('ИВАН')` вернёт `ИВАН`.
  # Поэтому кодировка обязана быть UTF8 — проверяем это ниже прямо.
  foreach ($db in @('philos', 'philos_test')) {
    $exists = Invoke-Psql "SELECT 1 FROM pg_database WHERE datname='$db'" -Quiet
    if ("$exists".Trim() -eq '1') {
      Ok "$db уже есть"
    } else {
      Invoke-Psql "CREATE DATABASE $db ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0" | Out-Null
      Ok "$db создана"
    }
  }
  $enc = Invoke-Psql "SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname='philos'" -Quiet
  if ("$enc".Trim() -ne 'UTF8') { Die "кодировка базы philos — $enc, нужна UTF8" }
  Ok 'кодировка UTF8 подтверждена'

  $role = Invoke-Psql "SELECT 1 FROM pg_roles WHERE rolname='philos'" -Quiet
  if ("$role".Trim() -ne '1') {
    Invoke-Psql "CREATE ROLE philos LOGIN PASSWORD 'philos'" | Out-Null
  }
  foreach ($db in @('philos', 'philos_test')) {
    Invoke-Psql "ALTER DATABASE $db OWNER TO philos" -Quiet | Out-Null
  }
  Ok 'роль philos владеет обеими'

  Step 'окружение'
  if (Test-Path $EnvFile) {
    Ok "$EnvFile уже есть — не трогаю"
  } else {
    $key = & node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    @(
      'DATABASE_URL=postgres://philos:philos@127.0.0.1:5432/philos'
      "MFA_SECRET_KEY=$key"
      'PORT=8814'
      '# PUBLIC_URL=http://адрес-в-сети:8814   # корень ссылок в письмах'
      '# NODE_ENV=production                   # cookie только по HTTPS — нужен ставень'
    ) | Set-Content -Path $EnvFile -Encoding utf8

    # ПРАВА. Аналога `chmod 600` нет: файл наследует права папки профиля, и
    # их надо снять явно, иначе ключ MFA читает любой пользователь машины.
    & icacls $EnvFile /inheritance:r /grant:r "$($env:USERNAME):(R,W)" *> $null
    Ok "$EnvFile заведён, наследование прав снято"
    Write-Host '  СОХРАНИТЕ MFA_SECRET_KEY ВНЕ МАШИНЫ.' -ForegroundColor Yellow -NoNewline
    Write-Host ' Потеряете — потеряете все TOTP.'
  }
  Import-EnvFile | Out-Null

  Step 'схема'
  Push-Location (Join-Path $Root 'server')
  try {
    & npm run migrate *> $null
    if ($LASTEXITCODE -ne 0) { Die 'миграции не прошли' }
    $status = (& npm run migrate:status 2>$null | Select-Object -Last 1)
    Ok $status
  } finally { Pop-Location }

  Step 'семя графа'
  Push-Location (Join-Path $Root 'server')
  try {
    & npm run graph:import *> $null
    if ($LASTEXITCODE -eq 0) { Ok 'наборы внесены' }
    else { Ok 'граф уже не пуст — семя не трогаю (так и задумано)' }
  } finally { Pop-Location }

  Step 'первая раскладка'
  # ХРАНИМАЯ РАСКЛАДКА (миграции 013–014). Прежде каждый клиент считал её
  # сам, и выходила она у всех разная: один и тот же d3 в разных движках
  # расходится с медианой около 65 px. Пока человек один — незаметно; как
  # только двое, общий язык про «вон тот сгусток справа» пропадает.
  $relayout = Join-Path $Root 'server\scripts\relayout.mjs'
  if (Test-Path $relayout) {
    Push-Location (Join-Path $Root 'server')
    try {
      & node scripts/relayout.mjs --применить *> $null
      if ($LASTEXITCODE -eq 0) { Ok 'раскладка посчитана и записана' }
      else { Ok 'раскладка не понадобилась (уже есть или нечего класть)' }
    } finally { Pop-Location }
  } else { Bad 'relayout.mjs нет — сборка старше миграций 013–014' }

  Step 'первый администратор'
  if (-not $env:BOOTSTRAP_ADMIN_PASSWORD) {
    $secure = Read-Host 'Пароль администратора (от 12 знаков, ввод не виден)' -AsSecureString
    $env:BOOTSTRAP_ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
      [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
  }
  if (-not $env:BOOTSTRAP_ADMIN_LOGIN) { $env:BOOTSTRAP_ADMIN_LOGIN = 'admin' }
  if (-not $env:BOOTSTRAP_ADMIN_EMAIL) { $env:BOOTSTRAP_ADMIN_EMAIL = 'admin@example.invalid' }
  Push-Location (Join-Path $Root 'server')
  try { & npm run bootstrap-admin 2>&1 | Select-Object -Last 3 }
  finally { Pop-Location; $env:BOOTSTRAP_ADMIN_PASSWORD = $null }
}

# ── управление ───────────────────────────────────────────────────────────
function Show-Address {
  $port = Get-Port
  Write-Host "  в самой машине:  http://127.0.0.1:$port/"
  $ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
         Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
         Select-Object -First 1).IPAddress
  if ($ip) { Write-Host "  по сети:         http://${ip}:$port/" }

  # ЕСЛИ ЭТО ВИРТУАЛКА, адрес снаружи зависит от лада сети, и угадать его
  # изнутри нельзя — можно только назвать оба случая честно.
  if (Test-VirtualMachine) {
    Write-Host '  из хозяйской машины:' -ForegroundColor Cyan
    Write-Host "    мост  — тот же http://${ip}:$port/"
    Write-Host "    NAT   — http://127.0.0.1:$port/ и проброс порта $port в настройках виртуалки"
  }
}

# Узнаётся по производителю платы: годится и для VirtualBox, и для VMware,
# и для Hyper-V. Нужно ровно для одного — не молчать про адрес снаружи.
function Test-VirtualMachine {
  try {
    $m = (Get-CimInstance Win32_ComputerSystem -ErrorAction Stop).Manufacturer
    return ($m -match 'VirtualBox|VMware|QEMU|Microsoft Corporation|innotek|Parallels|Xen')
  } catch { return $false }
}

# PID КЛАДЁТСЯ У САМОГО NODE. Ubuntu-скрипт наступил здесь на грабли:
# `( … & echo $! )` клало pid подоболочки, та завершалась сразу, `стоп`
# рапортовал об успехе, а порт оставался занят. Start-Process возвращает
# объект самого процесса, и эта мина на Windows не воспроизводится, — но
# проверить, что процесс ЖИВ через три секунды, всё равно надо.
# ИМЯ ДОВОДА — scriptName, А НЕ script: `$script` в PowerShell есть указатель
# области видимости, и переменная с таким именем затеняет его. Проверяется
# разбором; в этом проекте затенение уже стоило полугода неверных метрик.
function Start-Node($scriptName, $pidFile, $logFile, $title, $waitSec) {
  if (Test-Path $pidFile) {
    $old = Get-Process -Id (Get-Content $pidFile) -ErrorAction SilentlyContinue
    if ($old) { Ok "$title уже работает, pid $($old.Id)"; return $true }
  }
  $proc = Start-Process -FilePath 'node' -ArgumentList $scriptName `
    -WorkingDirectory (Join-Path $Root 'server') `
    -RedirectStandardOutput $logFile -RedirectStandardError "$logFile.err" `
    -WindowStyle Hidden -PassThru
  $proc.Id | Set-Content $pidFile
  Start-Sleep -Seconds $waitSec
  if (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue) {
    Ok "$title поднят, pid $($proc.Id)"; return $true
  }
  Bad "$title не поднялся. Последние строки:"
  Get-Content $logFile, "$logFile.err" -Tail 5 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "    $_" }
  return $false
}

function Invoke-Start {
  if (-not (Import-EnvFile)) { Die "нет $EnvFile — сперва «развернуть»" }
  if (-not (Test-Postgres)) { Die 'PostgreSQL не отвечает' }

  # ПОРТ ПРОВЕРЯЕТСЯ ДО ПОДЪЁМА. Занятый порт даёт EADDRINUSE в журнале, а
  # снаружи выглядит как «сервер не поднялся» — и человек лезет чинить
  # проект вместо того, чтобы погасить прежний узел.
  $port = if ($env:PORT) { [int]$env:PORT } else { 8814 }
  $busy = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  $ours = if (Test-Path $ServerPid) { [int](Get-Content $ServerPid) } else { -1 }
  if ($busy -and $busy.OwningProcess -ne $ours) {
    Die "порт $port уже занят (pid $($busy.OwningProcess)) — погасите прежний узел («стоп»)"
  }

  if (-not (Start-Node 'scripts/serve.mjs' $ServerPid $ServerLog 'узел' 3)) { exit 1 }

  # ВТОРОЙ ПРОЦЕСС, И ОН НУЖЕН ВСЕГДА. Цепочка живого отклика: коммит кладёт
  # извещение в исходящие → РАБОТНИК публикует в шину → узел рассылает по
  # сокетам → страница берёт приращение. Нет работника — нет второго звена,
  # и чужая правка не доходит до открытых страниц вовсе.
  #
  # Извещение в шину идёт ДО почты и независимо от неё: работник нужен не
  # «когда заведёте почту», а всегда.
  Start-Node 'scripts/notify-worker.mjs' $WorkerPid $WorkerLog 'работник уведомлений' 2 | Out-Null
  Show-Address
}

function Invoke-Stop {
  foreach ($pair in @(@($WorkerPid, 'работник'), @($ServerPid, 'узел'))) {
    $file, $title = $pair
    if (Test-Path $file) {
      $id = Get-Content $file
      $p = Get-Process -Id $id -ErrorAction SilentlyContinue
      if ($p) { Stop-Process -Id $id -Force; Ok "$title остановлен" }
      Remove-Item $file -Force
    }
  }
}

function Invoke-Status {
  Import-EnvFile | Out-Null
  if (Test-Postgres) { Ok 'PostgreSQL отвечает' } else { Bad 'PostgreSQL стоит' }

  $port = if ($env:PORT) { $env:PORT } else { '8814' }
  $alive = (Test-Path $ServerPid) -and (Get-Process -Id (Get-Content $ServerPid) -ErrorAction SilentlyContinue)
  if ($alive) {
    Ok "узел работает, pid $(Get-Content $ServerPid)"
    try {
      $r = Invoke-WebRequest "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 5
      Write-Host "    HTTP $($r.StatusCode)"
    } catch { Write-Host "    не отвечает по HTTP: $($_.Exception.Message)" }
    Show-Address
  } else { Bad 'узел стоит' }

  # МОЛЧАНИЕ РАБОТНИКА — ЕДИНСТВЕННАЯ БЕДА, НЕ ВИДНАЯ НА ГЛАЗ: сервер
  # отвечает, страница работает, правки сохраняются. Потому он показывается
  # отдельно, и тут же считается неразосланное.
  $wAlive = (Test-Path $WorkerPid) -and (Get-Process -Id (Get-Content $WorkerPid) -ErrorAction SilentlyContinue)
  if ($wAlive) { Ok "работник уведомлений работает, pid $(Get-Content $WorkerPid)" }
  else { Bad 'работник СТОИТ — чужие правки не дойдут до открытых страниц' }

  # ДОСТУП СНАРУЖИ — ВТОРАЯ БЕДА, НЕ ВИДНАЯ ИЗНУТРИ: в самой машине страница
  # открывается, а с хозяйской нет, и человек идёт чинить сервер.
  if (Test-FirewallRule (Get-Port)) {
    Ok "брандмауэр пускает на порт $(Get-Port)"
  } else {
    Bad "правила брандмауэра на порт $(Get-Port) нет — снаружи страница не откроется («доступ»)"
  }

  $pending = Invoke-Psql 'SELECT count(*) FROM outbox WHERE delivered_at IS NULL' -Quiet
  if ($LASTEXITCODE -eq 0 -and "$pending".Trim() -ne '0' -and "$pending".Trim()) {
    Bad "в исходящих не разослано: $("$pending".Trim())"
  }
}

function Show-Log($lines) {
  if (-not $lines) { $lines = 40 }
  foreach ($f in @($ServerLog, "$ServerLog.err", $WorkerLog, "$WorkerLog.err")) {
    if (Test-Path $f) {
      Write-Host "`n══ $f" -ForegroundColor White
      Get-Content $f -Tail $lines
    }
  }
}

# ── доступ снаружи ───────────────────────────────────────────────────────
$FirewallRule = 'Philosphaira-HTTP'

function Get-Port {
  if ($env:PORT) { [int]$env:PORT } else { 8814 }
}

function Test-FirewallRule($port) {
  $rule = Get-NetFirewallRule -DisplayName $FirewallRule -ErrorAction SilentlyContinue
  if (-not $rule) { return $false }
  $ports = ($rule | Get-NetFirewallPortFilter).LocalPort
  return ("$ports" -eq "$port")
}

function Invoke-Access {
  if (-not (Test-Admin)) { Die 'запустите PowerShell от имени администратора' }
  Import-EnvFile | Out-Null
  $port = Get-Port

  # ПРАВИЛО ПЕРЕСОЗДАЁТСЯ, А НЕ ПРАВИТСЯ. Порт живёт в philos.env и может
  # смениться; старое правило на прежний порт осталось бы висеть и пускать
  # то, чего уже нет.
  Get-NetFirewallRule -DisplayName $FirewallRule -ErrorAction SilentlyContinue |
    Remove-NetFirewallRule -ErrorAction SilentlyContinue

  # ТОЛЬКО ЧАСТНАЯ СЕТЬ. Виртуалка в NAT или мосте попадает в «частную»
  # сеть; открывать порт в «общедоступной» значило бы пускать в него кафе
  # и вокзал. Если хозяйская машина не видит узел — сперва проверьте, что
  # сеть помечена частной (Get-NetConnectionProfile), а не расширяйте
  # правило.
  New-NetFirewallRule -DisplayName $FirewallRule -Direction Inbound `
    -Action Allow -Protocol TCP -LocalPort $port -Profile Private | Out-Null
  Ok "порт $port открыт для частной сети"

  $netProfile = (Get-NetConnectionProfile | Select-Object -First 1)
  if ($netProfile -and $netProfile.NetworkCategory -ne 'Private') {
    Bad "сеть «$($netProfile.Name)» помечена как $($netProfile.NetworkCategory) — правило на неё не подействует"
    Write-Host "    Set-NetConnectionProfile -InterfaceIndex $($netProfile.InterfaceIndex) -NetworkCategory Private"
  }
  Show-Address
}

# ── автозапуск ───────────────────────────────────────────────────────────
function Invoke-Service {
  if (-not (Test-Admin)) { Die 'запустите PowerShell от имени администратора' }
  # ДВЕ ЗАДАЧИ, А НЕ ОДНА — по той же причине, что и в «пуск».
  #
  # ПРИ ВХОДЕ, А НЕ ПРИ ЗАГРУЗКЕ. Задача при загрузке пошла бы от SYSTEM,
  # а philos.env лежит в профиле человека и права на него сняты до одного
  # владельца: SYSTEM прочтёт, но ключ окажется доступен службе, которой он
  # не принадлежит. Вход в систему — честная граница владения.
  $node = (Get-Command node).Source
  $pairs = @(
    @('Philosphaira',        'serve.mjs'),
    @('Philosphaira-Worker', 'notify-worker.mjs')
  )
  foreach ($pair in $pairs) {
    $name, $scriptName = $pair
    # Оболочка нужна, чтобы прочесть philos.env: планировщик переменных не знает.
    $cmd = "-NoProfile -WindowStyle Hidden -Command " +
           "`"& { Get-Content '$EnvFile' | ForEach-Object { if (`$_ -match '^[^#].*=') " +
           "{ `$n,`$v = `$_ -split '=',2; Set-Item Env:`$(`$n.Trim()) `$v.Trim() } }; " +
           "Set-Location '$Root\server'; & '$node' scripts/$scriptName }`""
    $action  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $cmd
    $trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
    $set     = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
                 -DontStopIfGoingOnBatteries -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
    Register-ScheduledTask -TaskName $name -Action $action -Trigger $trigger `
      -Settings $set -Force | Out-Null
    Ok "$name зарегистрирована"
  }
  Ok 'обе задачи включены; журнал — .\philos-win10.ps1 журнал'
}

# ── приёмка ──────────────────────────────────────────────────────────────
# ПОРТ, А НЕ ВЫЗОВ BASH. server/accept.sh перечисляет двадцать одну пробу и
# складывает двадцать одну однобуквенную переменную; в самом файле записано,
# что до 10 сентября 2026 там были две ошибки — одна буква присваивалась
# дважды, а другая не входила в сумму. Список проб здесь — ДАННЫЕ, и такая
# ошибка по устройству невозможна: складывается то же, что перечислено.
$AcceptProbes = @(
  @('строение',                    'structure_probe.mjs'),
  @('правила',                     'rules_probe.mjs'),
  @('база',                        'db_probe.mjs'),
  @('вход',                        'auth_probe.mjs'),
  @('второй шаг',                  'mfa_probe.mjs'),
  @('управление пользователями',   'users_probe.mjs'),
  @('перенос графа',               'graph_probe.mjs'),
  @('коммиты',                     'commits_probe.mjs'),
  @('слияние (чистые функции)',    'merge_probe.mjs'),
  @('применение и рассмотрение',   'apply_probe.mjs'),
  @('откат, история, приращение',  'revert_probe.mjs'),
  @('раскладка',                   'layout_probe.mjs'),
  @('уведомления',                 'notify_probe.mjs'),
  @('почта (чистые функции)',      'mail_probe.mjs'),
  @('доставка',                    'worker_probe.mjs'),
  @('соединения',                  'ws_probe.mjs'),
  @('слой HTTP',                   'http_probe.mjs'),
  @('страница в серверном режиме', 'page_probe.mjs'),
  @('продуктовый цикл (только HTTP)', 'product_flow_probe.mjs'),
  @('живое обновление графа',      'live_graph_probe.mjs'),
  @('штатный запуск',              'bootstrap_probe.mjs')
)

function Invoke-Accept {
  if (-not (Import-EnvFile)) { Die "нет $EnvFile — сперва «развернуть»" }

  # СПИСОК СВЕРЯЕТСЯ С ПАПКОЙ, А НЕ ПРИНИМАЕТСЯ НА ВЕРУ. Перечень выше —
  # пересказ содержимого server\probes; заведут новую пробу, и приёмка тихо
  # станет неполной. Спрашиваем папку и останавливаемся на расхождении.
  $onDisk = Get-ChildItem (Join-Path $Root 'server\probes') -Filter '*_probe.mjs' |
            ForEach-Object { $_.Name }
  $listed = $AcceptProbes | ForEach-Object { $_[1] }
  $missing = $onDisk | Where-Object { $_ -notin $listed }
  $ghosts  = $listed | Where-Object { $_ -notin $onDisk }
  if ($missing) { Die "в папке есть пробы, которых нет в списке: $($missing -join ', ')" }
  if ($ghosts)  { Die "в списке есть пробы, которых нет в папке: $($ghosts -join ', ')" }
  Ok "проб к прогону: $($listed.Count) — список сошёлся с папкой"

  # ЖЁСТКО ИСПЫТАТЕЛЬНАЯ БАЗА, что бы ни стояло в окружении: `db_probe`
  # откатывает её до пустого места, и одна забытая переменная стоила бы
  # рабочих данных.
  $env:DATABASE_URL = 'postgres://philos:philos@127.0.0.1:5432/philos_test'

  $chrome = Join-Path $HOME "chrome\win64-$ChromeVer\chrome-win64\chrome.exe"
  if (Test-Path $chrome) { $env:CHROME = $chrome }
  else { Bad "Chrome $ChromeVer не найден — пробы страницы не пойдут" }
  $env:PUPPETEER = Join-Path $Root 'server\node_modules\puppeteer-core'

  Push-Location (Join-Path $Root 'server')
  $failed = @()
  try {
    foreach ($pair in $AcceptProbes) {
      $title, $probe = $pair
      Write-Host "`n══ $title" -ForegroundColor White
      & node "probes/$probe" 2>&1 | Select-Object -Last 3
      if ($LASTEXITCODE -ne 0) { $failed += $title }
    }
  } finally { Pop-Location }

  Write-Host ''
  if ($failed.Count -eq 0) {
    Write-Host 'ПРИЁМКА ЗЕЛЁНАЯ' -ForegroundColor Green
    exit 0
  }
  Write-Host "ПРИЁМКА КРАСНАЯ — не сошлось: $($failed -join ', ')" -ForegroundColor Red
  exit $failed.Count
}

# ── разбор команды ───────────────────────────────────────────────────────
$command = if ($args.Count -gt 0) { $args[0] } else { '' }
switch ($command) {
  'установить' { Invoke-Install }
  'развернуть' { Invoke-Deploy $args[1] }
  'пуск'       { Invoke-Start }
  'стоп'       { Invoke-Stop }
  'состояние'  { Invoke-Status }
  'журнал'     { Show-Log $args[1] }
  'адрес'      { Import-EnvFile | Out-Null; Show-Address }
  'доступ'     { Invoke-Access }
  'служба'     { Invoke-Service }
  'приёмка'    { Invoke-Accept }
  default {
    @'
ΦilosΦaira на Windows 10

  .\philos-win10.ps1 установить          Node 22, PostgreSQL 16, Chrome 131
  .\philos-win10.ps1 развернуть <путь>   архив .zip/.tar.xz или каталог
  .\philos-win10.ps1 пуск                узел И работник уведомлений
  .\philos-win10.ps1 стоп
  .\philos-win10.ps1 состояние           оба процесса и очередь исходящих
  .\philos-win10.ps1 журнал [строк]
  .\philos-win10.ps1 адрес
  .\philos-win10.ps1 доступ              правило брандмауэра на порт узла
  .\philos-win10.ps1 служба              автозапуск при входе: ДВЕ задачи
  .\philos-win10.ps1 приёмка             на испытательной базе philos_test

Подробности и доводы — в philosphaira-win10.md.
'@ | Write-Host
  }
}
