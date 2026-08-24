#!/usr/bin/env node
// Проба ВТОРОГО ШАГА. Требует живой базы и MFA_SECRET_KEY.
//
//   DATABASE_URL=… MFA_SECRET_KEY=… node probes/mfa_probe.mjs

import { создатьПул } from '../src/db/pool.js';
import { withTransaction } from '../src/db/tx.js';
import { register, login } from '../src/auth/service.js';
import { sessionByToken } from '../src/db/sessions.js';
import { findById } from '../src/db/users.js';
import { beginEnroll, confirmEnroll, submitCode, disable, свежийШаг,
         requireFreshMfa, СВЕЖЕСТЬ_МИНУТ } from '../src/auth/mfa.js';
import { countRecoveryCodes, passSessionMfa } from '../src/db/mfa.js';
import { код as totpКод, сверить, создатьСекрет, base32Decode, base32Encode,
         ШАГ_СЕК } from '../src/auth/totp.js';
import { зашифровать, расшифровать } from '../src/auth/secretbox.js';
import { can } from '../src/access/access.js';
import { P } from '../src/access/roles.js';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const мигр = (...д) => execFileSync('node',
  [path.join(КОРЕНЬ, 'scripts', 'migrate.mjs'), ...д],
  { encoding: 'utf8', env: process.env });

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });
const отказ = async fn => {
  try { await fn(); return 'ПРОШЛО'; } catch (e) { return e.message; }
};

// Откат ДО ПУСТОГО МЕСТА, а не заданное число раз: числом был счёт миграций
// на день написания пробы, и с каждой новой миграцией проба начинала
// оставлять хвост — а на хвосте она падает не там, где смотрят.
while (!мигр('down').includes('откатывать нечего')) { /* до пустого места */ }
мигр('up');

const pool = создатьПул();
const ПАРОЛЬ = 'вполне-длинный-пароль';

try {
  // ── 1. сам TOTP ─────────────────────────────────────────────────────────
  const секрет = создатьСекрет();
  проверить('base32 туда и обратно',
    base32Encode(base32Decode(секрет)) === секрет, секрет.slice(0, 8),
    base32Encode(base32Decode(секрет)).slice(0, 8));
  проверить('свой код сходится', сверить(секрет, totpКод(секрет)), true, 'да');
  проверить('чужой код не сходится', !сверить(секрет, '000000'), true, 'да');
  проверить('код не из шести цифр не сходится', !сверить(секрет, 'abcdef'), true, 'да');
  проверить('код соседнего шага принимается (часы расходятся)',
    сверить(секрет, totpКод(секрет, Date.now() - ШАГ_СЕК * 1000)), true, 'да');
  проверить('код через два шага уже не принимается',
    !сверить(секрет, totpКод(секрет, Date.now() - 2 * ШАГ_СЕК * 1000)), true, 'да');

  // ── 2. шифрование секрета ───────────────────────────────────────────────
  const шифр = зашифровать(секрет);
  проверить('секрет в базе не лежит открытым',
    !шифр.toString('utf8').includes(секрет.slice(0, 8)), 'не видно', 'видно');
  проверить('расшифровка возвращает секрет', расшифровать(шифр) === секрет, 'да', 'нет');
  const порченый = Buffer.from(шифр); порченый[порченый.length - 1] ^= 1;
  проверить('подменённый шифротекст не расшифруется молча',
    (await отказ(() => расшифровать(порченый))) !== 'ПРОШЛО', 'отказ', 'прошло');

  // ── 3. заведение ────────────────────────────────────────────────────────
  const {  user: админ } = await register(pool, {
    username: 'админ', email: 'a@e.рф', password: ПАРОЛЬ });
  await pool.query(`UPDATE users SET role='administrator', email_verified_at=NOW()
                     WHERE user_id=$1`, [админ.userId]);
  const адм = await findById(pool, админ.userId);

  // КУРИЦА И ЯЙЦО: администратор назначен, второй шаг не заведён.
  проверить('администратор без второго шага не банит',
    !can(адм, P.BAN_USER), false, 'нет');
  проверить('администратор без второго шага не меняет ролей',
    !can(адм, P.MANAGE_EDITORS), false, 'нет');
  проверить('администратор без второго шага список пользователей видит',
    can(адм, P.VIEW_USERS), true, 'да');

  const начало = await beginEnroll(pool, адм);
  проверить('заведение выдаёт секрет и ссылку',
    !!начало.секрет && начало.ссылка.startsWith('otpauth://totp/'),
    'otpauth://', начало.ссылка.slice(0, 15));
  const послеВыдачи = await findById(pool, админ.userId);
  проверить('выдача секрета ещё НЕ включает второй шаг',
    послеВыдачи.mfaReady === false, false, послеВыдачи.mfaReady);

  проверить('неверный код не включает', 
    (await отказ(() => confirmEnroll(pool, адм, '000000'))).includes('не сошёлся'),
    'не сошёлся', 'иное');

  const { коды } = await confirmEnroll(pool, адм, totpКод(начало.секрет));
  проверить('подтверждение выдаёт коды восстановления', коды.length === 10, 10, коды.length);
  const включён = await findById(pool, админ.userId);
  проверить('после подтверждения второй шаг заведён', включён.mfaReady === true, true, 'да');
  проверить('и права опасных действий появляются', can(включён, P.BAN_USER), true, 'да');
  проверить('дважды завести нельзя',
    (await отказ(() => confirmEnroll(pool, адм, totpКод(начало.секрет)))).includes('уже заведён'),
    'уже заведён', 'иное');

  // ── 4. вход становится двухшаговым ──────────────────────────────────────
  const вход = await login(pool, { email: 'a@e.рф', password: ПАРОЛЬ });
  проверить('вход сообщает, что ждёт кода', вход.ждётКода === true, true, вход.ждётКода);
  const сеанс = await sessionByToken(pool, вход.токен);
  проверить('сессия частичная', сеанс.mfaPending === true, true, сеанс.mfaPending);

  // ГЛАВНОЕ: частичная сессия не даёт НИЧЕГО. Проверяем так же, как это
  // видит привратник: он кладёт req.user = null и запоминает sessionId.
  проверить('частичная сессия не даёт пользователя',
    сеанс.mfaPending && !can(null, P.VIEW_USERS), 'ничего', 'что-то');

  проверить('чужой код не проходит',
    (await отказ(() => submitCode(pool, вход.sessionId, '111111'))).includes('не сошёлся'),
    'не сошёлся', 'иное');

  const прошёл = await submitCode(pool, вход.sessionId, totpКод(начало.секрет));
  проверить('код из приложения проходит', прошёл.способ === 'приложение',
    'приложение', прошёл.способ);
  const сеанс2 = await sessionByToken(pool, вход.токен);
  проверить('сессия перестала быть частичной', сеанс2.mfaPending === false, false, 'да');

  // ── 5. коды восстановления ──────────────────────────────────────────────
  const вход2 = await login(pool, { email: 'a@e.рф', password: ПАРОЛЬ });
  const восст = await submitCode(pool, вход2.sessionId, коды[0]);
  проверить('код восстановления проходит', восст.способ === 'восстановление',
    'восстановление', восст.способ);
  проверить('и гасится: осталось девять', восст.осталосьКодов === 9, 9, восст.осталосьКодов);

  const вход3 = await login(pool, { email: 'a@e.рф', password: ПАРОЛЬ });
  проверить('тот же код второй раз не проходит',
    (await отказ(() => submitCode(pool, вход3.sessionId, коды[0]))).includes('не сошёлся'),
    'не сошёлся', 'иное');
  await submitCode(pool, вход3.sessionId, коды[1]);
  проверить('второй код проходит и гасится',
    (await countRecoveryCodes(pool, админ.userId)) === 8, 8,
    await countRecoveryCodes(pool, админ.userId));

  // ── 6. свежесть подтверждения ───────────────────────────────────────────
  проверить('без отметки — не свежо', !свежийШаг(null), false, 'нет');
  проверить('только что — свежо', свежийШаг(new Date()), true, 'да');
  проверить('шестнадцать минут назад — не свежо',
    !свежийШаг(new Date(Date.now() - 16 * 60_000)), false, 'нет');
  проверить('четырнадцать минут назад — свежо',
    свежийШаг(new Date(Date.now() - 14 * 60_000)), true, 'да');

  const застава = requireFreshMfa();
  const прогнать = req => new Promise(готово =>
    застава(req, {}, e => готово(e ? (e.code ?? 'отказ') : 'прошло')));
  const свежая = await login(pool, { email: 'a@e.рф', password: ПАРОЛЬ });
  await submitCode(pool, свежая.sessionId, totpКод(начало.секрет));
  проверить('со свежим кодом застава пускает',
    await прогнать({ db: pool, user: адм, sessionId: свежая.sessionId }) === 'прошло',
    'прошло', '—');
  await pool.query(`UPDATE user_sessions SET mfa_passed_at = NOW() - INTERVAL '20 minutes'
                     WHERE session_id = $1`, [свежая.sessionId]);
  проверить('с несвежим — 401 mfa_required',
    await прогнать({ db: pool, user: адм, sessionId: свежая.sessionId }) === 'mfa_required',
    'mfa_required', await прогнать({ db: pool, user: адм, sessionId: свежая.sessionId }));
  проверить('без входа застава не пускает',
    await прогнать({ db: pool, user: null, sessionId: null }) !== 'прошло', 'отказ', '—');

  // ── 7. отзыв ────────────────────────────────────────────────────────────
  проверить('отозвать без кода нельзя',
    (await отказ(() => disable(pool, адм, '000000'))).includes('не сошёлся'),
    'не сошёлся', 'иное');
  await disable(pool, адм, totpКод(начало.секрет));
  const снят = await findById(pool, админ.userId);
  проверить('после отзыва второй шаг снят', снят.mfaReady === false, false, 'да');
  проверить('после отзыва опасные права снова срезаны',
    !can(снят, P.BAN_USER), false, 'нет');
  проверить('после отзыва все сессии погашены',
    !(await sessionByToken(pool, вход.токен)), 'погашены', 'жива');
  проверить('коды восстановления погашены вместе с ним',
    (await countRecoveryCodes(pool, админ.userId)) === 0, 0,
    await countRecoveryCodes(pool, админ.userId));

} catch (e) {
  проверить('проба дошла до конца', false, 'дошла', e.message.slice(0, 90));
} finally {
  for (const п of проверки)
    console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(56, '.') +
      (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
  const плохо = проверки.filter(п => !п.годно);
  console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
  await pool.end();
  process.exit(плохо.length ? 1 : 0);
}
