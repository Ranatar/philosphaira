# ΦilosΦaira: публичное размещение под своим именем — пошаговое руководство

Это руководство, а не обзор: шаги идут в том порядке, в каком их надо
делать, у каждого есть команды и **проверка**, без которой к следующему
шагу не переходят. Порядок местами жёсткий, и где он жёсткий — сказано
почему.

Обозначения, которые надо заменить своим:

| Обозначение | Что это | Пример |
|---|---|---|
| `ИМЯ` | ваш домен | `philosphaira.to` |
| `АДРЕС` | публичный IPv4 машины | `203.0.113.10` |
| `ЛОГИН` | ваш логин администратора в сервисе | `nyanko` |
| `ПОЧТА` | ваш настоящий адрес | `вы@ваша.почта` |

Команды помечены, где их набирать: **[у себя]** — на своей машине
(Ubuntu-виртуалка, или Windows 10 с PowerShell — там есть `ssh`, `scp`,
`ssh-keygen`), **[на сервере]** — в SSH-сеансе на арендованной машине.

**Проверено 24 сентября 2026 прогоном:** развёртывание на месте в свежем клоне
(шаги 3–4), случайный пароль роли базы под `scram-sha-256`, `git pull` в
клоне после развёртывания. **26 сентября 2026** шаг 4 перепроверен с нуля и
повтором после правки скрипта: раскладка больше не пересчитывается при
развёртывании (прежде её затирал пересчёт в node — медиана 54,6 px), повтор
на развёрнутом месте не падает, провал переноса графа не выдаётся за
«граф не пуст». **Не проверено здесь** (нет домена, почты,
systemd): шаги 7–11 — они написаны по коду проекта и документации Caddy,
а проверка после каждого из них как раз для того, чтобы вы увидели
расхождение на своей стороне сразу, а не при первом госте.

---

## 0. Что приготовить до начала

1. **Домен.** Куплен, доступ к панели DNS есть. Для `.to` — любой регистратор,
   торгующий зоной Тонги; занятость проверяется на `tonic.to/whois`.
   Продление поставьте в календарь: у ccTLD нет привычных процедур ICANN,
   просрочку исправлять труднее, чем в `.org`.
2. **Поставщик почты с SMTP** (Postmark, Mailgun, Migadu, Fastmail — любой).
   Регистрация в сервисе открытая, подтверждение адреса идёт письмом: без
   почты люди заведутся, но не подтвердятся, и права у них будут срезаны.
   Свой почтовый сервер на этой же машине не заводите — письма с нового
   адреса в свежей ccTLD будут падать в спам, и чинить придётся чужие
   чёрные списки. Понадобятся: адрес SMTP-сервера, порт, логин, пароль и
   записи DNS, которые поставщик выдаст для домена.
3. **Ключ SSH** [у себя]:
   ```bash
   ssh-keygen -t ed25519 -C "philosphaira"      # Enter на все вопросы
   ```
   Открытая половина — `~/.ssh/id_ed25519.pub` (в Windows —
   `C:\Users\<вы>\.ssh\id_ed25519.pub`).
4. **Хранилище для копий вне машины** — любое с SFTP. Ниже в примерах
   Hetzner Storage Box; годится любой SFTP-адрес (§11).
5. **Место для секретов вне сервера** (менеджер паролей): туда лягут
   `MFA_SECRET_KEY`, пароль хранилища копий и пароль restic. Потеря
   `MFA_SECRET_KEY` — это потеря всех заведённых вторых шагов, и никакой
   дамп базы её не возместит.

---

## 1. Машина

Возьмите VPS: **Ubuntu 24.04 LTS, 2 vCPU, 4 ГБ памяти, от 40 ГБ диска**,
с публичным IPv4 (например, Hetzner Cloud, линейка общих vCPU, дата-центр в
Германии). Узел один, база маленькая, этого хватает с запасом. При создании
вставьте свой открытый ключ SSH из §0.3 — тогда пароль root не понадобится
вовсе.

Chrome 131 на боевую машину **не ставится**: он нужен только приёмке, а
приёмка сносит испытательную базу и гоняется у вас, а не здесь.

**Проверка** [у себя]:
```bash
ssh root@АДРЕС 'lsb_release -ds; nproc; free -h | head -2'
# Ubuntu 24.04… · 2 · Mem: 3.7Gi…
```

---

## 2. Человек, вход по ключу, обновления

**Порядок жёсткий:** сперва убедиться, что входите новым пользователем по
ключу, и **только потом** запрещать вход паролем и root. Наоборот — и вы
заперты снаружи собственной машины.

[на сервере, под root]:
```bash
adduser --disabled-password --gecos "" philos
usermod -aG sudo philos
passwd philos                     # пароль для sudo (не для входа)
mkdir -p /home/philos/.ssh
cp /root/.ssh/authorized_keys /home/philos/.ssh/
chown -R philos:philos /home/philos/.ssh
chmod 700 /home/philos/.ssh && chmod 600 /home/philos/.ssh/authorized_keys
```

**Проверка** [у себя, в НОВОМ окне, старое не закрывать]:
```bash
ssh philos@АДРЕС 'sudo -v && echo sudo-ok'
```

Только если ответ `sudo-ok` — [на сервере]:
```bash
sudo sed -i -E 's/^#?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i -E 's/^#?PermitRootLogin .*/PermitRootLogin no/'              /etc/ssh/sshd_config
sudo systemctl restart ssh
sudo apt-get update && sudo apt-get install -y unattended-upgrades git
sudo dpkg-reconfigure -f noninteractive unattended-upgrades
```

**Проверка** [у себя]: `ssh root@АДРЕС` должен получить отказ
(`Permission denied (publickey)`), `ssh philos@АДРЕС` — войти.

Дальше всё — под `philos`.

---

## 3. Клон и установка

Проект кладётся **клоном git** прямо в `~/philosphaira`: так выкатка новой
версии сводится к `git pull` (§13). `развернуть` умеет разворачивать на месте
с 24 сентября 2026; прежде ветка каталога всегда копировала, и копия в саму
себя останавливала скрипт.

[на сервере]:
```bash
cd ~
git clone https://github.com/Ranatar/philosphaira.git
PHILOS_NO_CHROME=1 bash ~/philosphaira/deploy/philos-ubuntu.sh установить
```

`PHILOS_NO_CHROME=1` пропускает Chrome и его библиотеки. Скрипт сам
обновляет списки пакетов, ставит Node 22 (из NodeSource — не из репозиториев
Ubuntu, там 18.19, и нативный `argon2` на нём лотерея) и PostgreSQL 16.

**Проверка**:
```bash
node -v                                   # v22.x
sudo -u postgres psql -tAc 'select version()' | cut -c1-20   # PostgreSQL 16…
```

---

## 4. Развёртывание: базы, окружение, семя, раскладка, администратор

[на сервере]:
```bash
cd ~/philosphaira
BOOTSTRAP_ADMIN_LOGIN=ЛОГИН BOOTSTRAP_ADMIN_EMAIL=ПОЧТА \
  bash deploy/philos-ubuntu.sh развернуть ~/philosphaira
```

Пароль администратора скрипт спросит с клавиатуры без эха — **так и
вводите**: переданный переменной, он остаётся в истории оболочки и виден в
`/proc`. Не короче 12 знаков.

Что делает шаг: зависимости сервера, две базы (`philos` — рабочая,
`philos_test` — для приёмки, её сносят), роль `philos` со **случайным**
паролем (прежде стоял пароль `philos`, известный всякому, кто читал скрипт),
`~/philos.env` с правами 600, 14 миграций, семя графа вместе с раскладкой
(она приходит из семени — пересчитывать её не нужно и вредно, см.
`server/README.md` §5б), администратор с подтверждённой почтой (письмо ему не идёт — поэтому всё
это делается до того, как заработает SMTP).

**Проверка** — последние строки вывода:
```
▸ схема           ✓ всего 14, применено 14
▸ семя графа      ✓ семь наборов внесены: шесть в граф, седьмой — раскладка из семени
▸ раскладка       ✓ раскладка на месте (строк в истории: 1)
  ✓ ЛОГИН ДЛЯ ВХОДА: ЛОГИН
```

**Сразу же** унесите ключ второго шага с машины [у себя]:
```bash
ssh philos@АДРЕС "grep '^MFA_SECRET_KEY=' ~/philos.env"
```
— и положите строку в менеджер паролей (§0.5).

---

## 5. Переменные публичного случая

`~/philos.env` после §4 годится для домашней сети. За TLS к нему добавляются
шесть строк. **Кавычки обязательны**: файл читают и systemd, и bash
(`set -a; . ~/philos.env`), и в bash строка `MAIL_FROM=ΦilosΦaira <…>` без
кавычек — это перенаправление ввода из файла, на котором сломаются копии
(§11) и всякая ручная команда. systemd одинарные кавычки снимает сам.

[на сервере] — значения SMTP подставить от поставщика:
```bash
cat >> ~/philos.env <<'EOF'
NODE_ENV=production
TRUST_PROXY=1
PUBLIC_URL=https://ИМЯ
WS_ORIGINS=https://ИМЯ
SMTP_URL='smtps://ЛОГИН_SMTP:ПАРОЛЬ_SMTP@smtp.поставщик.tld:465'
MAIL_FROM='ΦilosΦaira <no-reply@ИМЯ>'
EOF
nano ~/philos.env        # заменить ИМЯ и SMTP-значения на настоящие
```

Если в пароле SMTP есть `@ : / ? # %` — их кодируют в URL (`@` → `%40`,
`:` → `%3A`, `/` → `%2F`, `?` → `%3F`, `#` → `%23`, `%` → `%25`). Порт 465 —
`smtps://`; если поставщик даёт 587 со STARTTLS — `smtp://…:587`.

Что каждая делает и что будет без неё:

| Переменная | Без неё |
|---|---|
| `NODE_ENV=production` | cookie сеанса уходит без `Secure` и утечёт при первом обращении по HTTP |
| `TRUST_PROXY=1` | при `production` узел **нарочно не поднимется**: за ставнем без доверия у всех один адрес `127.0.0.1`, и предел регистраций (5 в час с адреса) бьёт по всем разом |
| `PUBLIC_URL` | ссылка подтверждения в письме уведёт человека на `http://127.0.0.1:8814` — его собственный компьютер |
| `WS_ORIGINS` | Origin не проверяется вовсе; значение — адрес страницы **со схемой**: с `http://` страница откроется, а живые соединения молча отвергнутся |
| `SMTP_URL`, `MAIL_FROM` | работник скажет первой строкой «ПОЧТА НЕ НАСТРОЕНА» и писем не шлёт; регистрация пройдёт, подтверждение — нет |

Дополнительно, если понадобится: `PG_POOL_MAX` (умолчание 10 соединений),
`PG_STATEMENT_TIMEOUT` (умолчание 15000 мс).

**Проверка** — файл читается оболочкой без ошибок:
```bash
( set -a; . ~/philos.env; set +a; echo "$MAIL_FROM | $PUBLIC_URL" )
```

---

## 6. Службы и второй шаг администратора

[на сервере]:
```bash
cd ~/philosphaira
bash deploy/philos-ubuntu.sh служба
```

Заводятся **две** службы: `philosphaira` (узел) и `philosphaira-worker`
(работник уведомлений). Работник нужен всегда, а не только ради почты: без
него чужая правка не доходит до открытых страниц вовсе, и молча.

**Проверка**:
```bash
systemctl is-active philosphaira philosphaira-worker       # active, active
journalctl -u philosphaira-worker -n 5 --no-pager           # «почта: smtp.… , от …»
curl -s http://127.0.0.1:8814/index.html | grep -c 'name="philos-api"'   # 1
```

**Второй шаг администратора — сейчас, до DNS.** Пока его нет, у
администратора срезаны опасные права (назначать роли, банить, рассматривать
коммиты), а после §8 служба будет открыта миру. Панели ещё нет (имя не
указывает на машину, а по HTTP вход при `production` не работает), поэтому —
из командной строки:

```bash
cd ~/philosphaira/server
set -a; . ~/philos.env; set +a
node scripts/enroll-mfa.mjs ЛОГИН
```

Скрипт покажет секрет строкой — введите её в приложение-аутентификатор
(Aegis, Authy, Google Authenticator) руками — и включит второй шаг **только
после** того, как вы введёте шестизначный код. Коды восстановления, если он их
выдаст, — в менеджер паролей.

---

## 7. Файрвол

Узел слушает **все** интерфейсы (`httpServer.listen(port)` в
`server/src/http/server.js` без адреса), и `http://АДРЕС:8814` иначе окажется
открыт в обход ставня. Вход там сломан (`Secure`-cookie по HTTP), чтение
работает — дыра, которая выглядит как поломка.

**Порядок:** `OpenSSH` разрешить **до** `enable`, иначе сеанс оборвётся и
войти будет нечем.

[на сервере]:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw --force enable
sudo ufw status verbose
```

**Проверка** [у себя] — снаружи порт узла должен молчать:
```bash
curl --max-time 5 -sI http://АДРЕС:8814/index.html; echo "код $?"   # код 28 (время вышло)
```

---

## 8. DNS

В панели регистратора:

| Тип | Имя | Значение | TTL |
|---|---|---|---|
| A | `@` (сам `ИМЯ`) | `АДРЕС` | 300 |
| A | `www` | `АДРЕС` | 300 |
| AAAA | `@` и `www` | IPv6 машины — **только если** он у неё есть и `ufw` его пропускает | 300 |

**Проверка** [у себя] — до перехода к §9, потому что сертификат выпускается
по проверке имени:
```bash
dig +short ИМЯ A          # АДРЕС
dig +short www.ИМЯ A      # АДРЕС
```
Пусто — подождать и повторить. TTL после запуска можно поднять до 3600.

---

## 9. Caddy: TLS и ставень

Caddy берёт и продлевает сертификат сам и пробрасывает WebSocket без
настройки. Страницу отдаёт сам узел (в ней метка `philos-api`, по которой
клиент узнаёт, что сервер есть), поэтому Caddy **только проксирует** —
раздавать `app/` мимо узла нельзя.

[на сервере]:
```bash
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy

sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
www.ИМЯ {
	redir https://ИМЯ{uri} permanent
}

ИМЯ {
	encode zstd gzip
	reverse_proxy 127.0.0.1:8814
}
EOF
sudo sed -i 's/ИМЯ/philosphaira.to/g' /etc/caddy/Caddyfile    # ← своё имя
sudo systemctl reload caddy
```

`www` перенаправляется на голое имя, а не обслуживается отдельно: страница
всегда открывается с одного адреса, и `WS_ORIGINS` из §5 достаточно одного.

**Проверка** [у себя]:
```bash
curl -sI https://ИМЯ/index.html | head -1                   # HTTP/2 200
curl -s  https://ИМЯ/index.html | grep -c 'name="philos-api"'   # 1
curl -sI http://ИМЯ/  | grep -i '^location'                 # https://ИМЯ/
curl -sI https://www.ИМЯ/ | grep -i '^location'             # https://ИМЯ/
```

Затем в браузере: `https://ИМЯ` → вход `ЛОГИН` → код второго шага → панель
открывается, права администратора на месте. **Живое обновление** проверяется
вторым браузером (или окном инкогнито с другим пользователем): правка в одном
окне должна появиться во втором без перезагрузки.

Если вместо Caddy nginx — `Upgrade` и `Connection` прописываются руками,
иначе страница работает, а сокет нет:
```nginx
location / {
    proxy_pass http://127.0.0.1:8814;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 10. Почта: записи DNS и проверка доставки

Точные значения выдаёт поставщик; форма такова:

| Тип | Имя | Значение |
|---|---|---|
| TXT | `@` | `v=spf1 include:<от поставщика> -all` |
| TXT или CNAME | `<селектор>._domainkey` | ключ DKIM от поставщика |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:ПОЧТА` |

В панели поставщика дождитесь, пока домен отмечен подтверждённым.

**Проверка доставки** — не глазами. В браузере без входа зарегистрируйте
пробного пользователя на свой ящик у крупной почтовой службы, откройте
пришедшее письмо, «Показать оригинал», найдите `Authentication-Results`:
там должно стоять `spf=pass` и `dkim=pass`. Заведённая, но не сошедшаяся
запись выглядит в панели DNS точно так же, как верная. Ссылка в письме
обязана начинаться с `https://ИМЯ/` (иначе — `PUBLIC_URL`, §5). Пробного
пользователя затем удалить из панели.

Если письма нет вовсе:
```bash
journalctl -u philosphaira-worker -n 30 --no-pager
set -a; . ~/philos.env; set +a
psql "$DATABASE_URL" -c "SELECT id, last_error FROM outbox WHERE last_error IS NOT NULL ORDER BY id DESC LIMIT 5"
```

---

## 11. Копии — до открытия, а не после

`app/data` — только **семя**; всё, что внесут люди, живёт в базе. Копия
считается копией, когда (1) она вне машины и (2) из неё проверенно
поднимается граф.

### 11.1. Ежесуточный дамп на машине

[на сервере]:
```bash
mkdir -p ~/backups
crontab -e
```
Строка (одна, целиком):
```cron
0 3 * * * set -a; . /home/philos/philos.env; set +a; pg_dump -Fc "$DATABASE_URL" > /home/philos/backups/philos-$(date +\%F).dump && find /home/philos/backups -name 'philos-*.dump' -mtime +14 -delete
```

**Проверка** — выполнить то же руками и увидеть файл:
```bash
set -a; . ~/philos.env; set +a
pg_dump -Fc "$DATABASE_URL" > ~/backups/philos-$(date +%F).dump && ls -lh ~/backups
```

### 11.2. Вывоз наружу (restic по SFTP)

[на сервере]:
```bash
sudo apt-get install -y restic
ssh-keygen -t ed25519 -N "" -f ~/.ssh/backup_key
cat ~/.ssh/backup_key.pub       # добавить в хранилище как ключ для SFTP
```
Для Hetzner Storage Box: включить SSH в панели, добавить ключ; адрес вида
`uNNNNN@uNNNNN.your-storagebox.de`, порт 23. Затем:
```bash
cat >> ~/.ssh/config <<'EOF'
Host backupbox
  HostName uNNNNN.your-storagebox.de
  User uNNNNN
  Port 23
  IdentityFile ~/.ssh/backup_key
EOF
head -c 24 /dev/urandom | base64 > ~/.restic-pass && chmod 600 ~/.restic-pass
cat ~/.restic-pass              # → в менеджер паролей (§0.5): без него копия не откроется
export RESTIC_REPOSITORY=sftp:backupbox:philosphaira RESTIC_PASSWORD_FILE=~/.restic-pass
restic init
restic backup ~/backups ~/philos.env
```
В cron — второй строкой, через час после дампа:
```cron
0 4 * * * RESTIC_REPOSITORY=sftp:backupbox:philosphaira RESTIC_PASSWORD_FILE=/home/philos/.restic-pass restic backup -q /home/philos/backups /home/philos/philos.env && RESTIC_REPOSITORY=sftp:backupbox:philosphaira RESTIC_PASSWORD_FILE=/home/philos/.restic-pass restic forget -q --keep-daily 14 --keep-monthly 6 --prune
```

**Проверка**: `restic snapshots` показывает снимок с сегодняшней датой.

### 11.3. Проверка восстановления — раз в месяц

[на сервере]:
```bash
set -a; . ~/philos.env; set +a
sudo -u postgres createdb philos_restore --owner=philos --locale=C.UTF-8 --template=template0
F=$(ls -t ~/backups/philos-*.dump | head -1)
pg_restore --no-owner -d "${DATABASE_URL%/philos}/philos_restore" "$F"
psql "${DATABASE_URL%/philos}/philos_restore" -tAc "SELECT count(*) FROM graph_entities"   # не ноль
sudo -u postgres dropdb philos_restore
```

Восстановление по-настоящему (после потери базы):
```bash
sudo systemctl stop philosphaira philosphaira-worker
pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" ~/backups/philos-ГГГГ-ММ-ДД.dump
sudo systemctl start philosphaira philosphaira-worker
```

---

## 12. Наблюдение

Показателя отставшего работника в продукте нет (`doc/plan-next.md`, этап F),
а без работника чужие правки молча не доходят до страниц. Письмо о беде
шлётся тем же SMTP, что и письма сервиса — `curl` умеет SMTP сам, отдельный
почтовый агент не нужен.

[на сервере]:
```bash
mkdir -p ~/bin
cat > ~/bin/philos-watch.sh <<'EOF'
#!/usr/bin/env bash
set -a; . /home/philos/philos.env; set +a
TO='ПОЧТА'
say() { printf 'From: %s\nTo: %s\nSubject: philosphaira: %s\n\n%s\n' "$MAIL_FROM" "$TO" "$1" "$2" \
  | curl -s --ssl-reqd --url "$SMTP_URL" --mail-from "no-reply@${PUBLIC_URL#https://}" --mail-rcpt "$TO" -T -; }
for s in philosphaira philosphaira-worker caddy; do
  systemctl is-active -q "$s" || say "служба $s стоит" "$(systemctl status "$s" --no-pager | head -20)"
done
n=$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM outbox WHERE delivered_at IS NULL")
[ "$n" -gt 200 ] && say "исходящие копятся: $n" "работник стоит или отстал"
d=$(df --output=pcent / | tail -1 | tr -dc 0-9)
[ "$d" -gt 85 ] && say "диск заполнен на $d%" "$(du -sh /home/philos/backups)"
exit 0
EOF
sed -i "s/'ПОЧТА'/'вы@ваша.почта'/" ~/bin/philos-watch.sh     # ← свой адрес
chmod 700 ~/bin/philos-watch.sh
crontab -e
```
```cron
*/15 * * * * /home/philos/bin/philos-watch.sh
```

**Проверка** — письмо должно прийти:
```bash
bash -c 'set -a; . ~/philos.env; set +a; printf "Subject: philosphaira: проверка\n\nok\n" | curl -s --ssl-reqd --url "$SMTP_URL" --mail-from "no-reply@${PUBLIC_URL#https://}" --mail-rcpt "вы@ваша.почта" -T - && echo отправлено'
```

Раз в неделю глазами — закрытые безнадёжные письма (адреса, не принимающие
почту). Быстрый рост — это либо боты с выдуманными адресами, либо ваши
письма перестали принимать вовсе (§10):
```sql
SELECT count(*) FROM outbox WHERE delivered_at IS NOT NULL AND last_error IS NOT NULL;
```

---

## 13. Выкатка новой версии

`app/` — порождаемое; на боевой машине его не собирают: там нет Chrome и
приёмки, а сборка стирает дерево первым делом.

1. [у себя] Правка исходника по `readme.md` §5, `remap.mjs собрать`,
   **полная приёмка** (`bash tools/accept.sh`) — зелёная.
2. [у себя] Коммит **вместе с порождённым `app/`**, `git push`.
3. [на сервере]:
```bash
cd ~/philosphaira && git pull --ff-only
cd server && npm ci
set -a; . ~/philos.env; set +a
npm run migrate                       # ДО перезапуска, а не после
sudo systemctl restart philosphaira philosphaira-worker
```

Миграции — до перезапуска: узел, поднятый на старой схеме, успеет принять
запросы и записать то, чего новая схема не ждёт. Раскладку при выкатке
**не пересчитывать** (`relayout` не звать): она общая для всех и
доращивается сама при утверждённых коммитах; полная перекладка сдвигает
узлы у всех разом.

**Проверка**:
```bash
systemctl is-active philosphaira philosphaira-worker
curl -s https://ИМЯ/index.html | grep -c 'name="philos-api"'     # 1
```
И обновить открытую страницу в браузере: `app/` отдаётся с диска.

`git pull --ff-only` откажет, если на машине правили отслеживаемые файлы:
так и задумано — на боевой машине файлы проекта руками не правят.

---

## 14. Если что-то пошло не так

| Признак | Причина | Что делать |
|---|---|---|
| Узел не поднимается, в журнале «задайте TRUST_PROXY» | `NODE_ENV=production` без числа ставней | `TRUST_PROXY=1` в `~/philos.env` (§5) |
| Вошли — и сразу гость | обращение по `http://`, а cookie с `Secure` | ходить по `https://ИМЯ`; Caddy перенаправляет HTTP сам |
| Страница есть, живого обновления нет | `WS_ORIGINS` не совпадает с адресом буквально (схема, `www`) | `https://ИМЯ`, открывать без `www` (Caddy перенаправит) |
| Живого обновления нет, `WS_ORIGINS` верен | стоит работник | `systemctl status philosphaira-worker` |
| `set -a; . ~/philos.env` ругается «No such file or directory» | значение с `<…>` без кавычек | одинарные кавычки (§5) |
| Регистрация проходит, письма нет | нет `SMTP_URL`/`MAIL_FROM` или неверный пароль SMTP | первая строка журнала работника; `outbox.last_error` (§10) |
| Письмо в спаме | SPF/DKIM не сошлись | `Authentication-Results` (§10) |
| Ссылка в письме ведёт на `127.0.0.1` | нет `PUBLIC_URL` | §5, затем `systemctl restart philosphaira` |
| Регистрация отвечает `429` всем | предел считает по одному адресу `127.0.0.1` — нет `TRUST_PROXY` | §5 |
| Сертификат не выпустился | A-запись ещё не разошлась, или 80/443 закрыты | `dig +short ИМЯ`; `sudo ufw status`; `journalctl -u caddy -n 50` |
| Снаружи открыт `http://АДРЕС:8814` | файрвол не включён | §7 |
| Администратор не может назначить роль | нет второго шага | §6, `enroll-mfa.mjs` |
| `git pull` отказывает | на машине правили файлы проекта | `git status`; вернуть: `git checkout -- <файл>` |
| Рабочая база опустела | приёмку запустили на `DATABASE_URL` рабочей базы | восстановление §11.3; приёмку на сервере не гонять |

---

## 15. Чего в продукте пока нет

- **Показателя отставшего работника** — только проверка из §12
  (`doc/plan-next.md`, этап F).
- **Общего хранилища для пределов**: счётчики регистраций и попыток входа
  живут в памяти процесса. При одном узле это верно; второй узел будет
  считать своё.
- **Живого обновления у гостя**: гость получает снимок графа на миг открытия
  страницы и сокета не получает (`ws/manager.js` отвечает 401 без сеанса; с
  26.09.2026 страница гостя сокета и не просит — прежде стучалась бесконечно,
  раз в полминуты с каждой открытой вкладки).
  Анонимный читатель не увидит чужих правок до перезагрузки. Если это не
  годится для публичного сервиса — решать до открытия.

## 16. Не по технике — до открытия

Публичный сервис с учётными записями на машине в Германии требует Impressum
и описания обработки данных (почта, адреса в журналах сеансов). Это вопрос
не к коду, но выяснять его — до первого гостя, а не после первого письма.
