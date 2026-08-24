#!/usr/bin/env node
// Проба СТРОЕНИЯ. Не запускает ничего: читает исходники и спрашивает о том,
// что должно быть верно всегда.
//
//   node probes/structure_probe.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });

const файлы = (папка, накопитель = []) => {
  for (const имя of fs.readdirSync(papkaПуть(папка), { withFileTypes: true })) {
    const п = path.join(папка, имя.name);
    if (имя.isDirectory()) { if (имя.name !== 'node_modules') файлы(п, накопитель); }
    else if (имя.name.endsWith('.js') || имя.name.endsWith('.mjs')) накопитель.push(п);
  }
  return накопитель;
};
function papkaПуть(отн) { return path.join(КОРЕНЬ, отн); }
const читать = отн => fs.readFileSync(path.join(КОРЕНЬ, отн), 'utf8');

const все = [...файлы('src'), ...файлы('scripts'), ...файлы('probes')];

// Меряем КОД, а не прозу: строки запросов, кавычки и пояснения из счёта
// убираются. Оба утверждения ниже однажды спотыкались о собственные
// комментарии — прибор, принимающий пояснение за нарушение, учит писать
// поменьше пояснений.
const толькоКод = т => т
  .replace(/`[^`]*`/gs, '``')
  .replace(/'[^']*'/g, "''")
  .replace(/"[^"]*"/g, '""')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ── 1. rows[0] не покидает src/db/ ───────────────────────────────────────
// Корень половины дефектов первой редакции: строка базы гуляла по службам
// как доменный объект. Проверяем не намерение, а текст.
const внеБазы = все.filter(ф => !ф.startsWith(path.join('src', 'db')));
const сRows = внеБазы.filter(ф => /\brows\s*\[\s*0\s*\]|\.rows\b/.test(толькоКод(читать(ф))));
// Пробам и переносам читать rows можно: они и есть слой базы по назначению.
const нарушители = сRows.filter(ф => !ф.startsWith('probes') && !ф.startsWith('scripts'));
проверить('rows не покидают src/db/', нарушители.length === 0, 0,
  нарушители.join(', ') || 0);

// ── 2. змеиные имена полей не читаются вне src/db/ ───────────────────────
const змеиные = /\.\s*(is_banned|is_active|user_id|email_verified_at|mfa_enabled|deleted_at|password_hash|role_changed_at)\b/;
const соЗмеиными = внеБазы
  .filter(ф => !ф.startsWith('probes'))
  .filter(ф => змеиные.test(толькоКод(читать(ф))));
проверить('змеиные имена полей — только в src/db/', соЗмеиными.length === 0, 0,
  соЗмеиными.join(', ') || 0);

// ── 3. подпись говорит о транзакции ──────────────────────────────────────
// Функция, пишущая внутри withTransaction, обязана называть первый довод
// client. Читается по подписи и не требует памяти.
const телаСТранзакцией = все.filter(ф => читать(ф).includes('withTransaction'));
const плохиеПодписи = [];
for (const ф of телаСТранзакцией) {
  const текст = читать(ф);
  const rx = /withTransaction\s*\(\s*[^,]+,\s*async\s*(\w+)\s*=>|withTransaction\s*\(\s*[^,]+,\s*async\s*\(\s*(\w+)/g;
  let m;
  while ((m = rx.exec(текст))) {
    const довод = m[1] || m[2];
    if (довод !== 'client') плохиеПодписи.push(`${ф}: ${довод}`);
  }
}
проверить('первый довод транзакции назван client', плохиеПодписи.length === 0, 0,
  плохиеПодписи.join(', ') || 0);

// ── 4. нет второго источника правды о настройках уведомлений ─────────────
const схема = читать(path.join('migrations', '001_init.up.sql'));
проверить('в users нет колонок настроек уведомлений',
  !/email_notifications|push_notifications/.test(схема), 'нет',
  /email_notifications|push_notifications/.test(схема) ? 'есть' : 'нет');

// ── 5. счётчики не заведены колонками ────────────────────────────────────
проверить('в users нет колонок-счётчиков коммитов',
  !/commits_created|commits_approved/.test(схема), 'нет',
  /commits_created|commits_approved/.test(схема) ? 'есть' : 'нет');

// ── 6. сессия ищется по хешу токена ──────────────────────────────────────
проверить('единственный индекс сессий — по хешу токена',
  /CREATE UNIQUE INDEX sessions_token_uq\s+ON user_sessions \(token_sha256\)/.test(схема),
  'есть', 'нет');

// ── 7. у каждой миграции есть откат ──────────────────────────────────────
const наверх = fs.readdirSync(path.join(КОРЕНЬ, 'migrations'))
  .filter(ф => ф.endsWith('.up.sql')).map(ф => ф.replace('.up.sql', ''));
const безОтката = наверх.filter(м =>
  !fs.existsSync(path.join(КОРЕНЬ, 'migrations', `${м}.down.sql`)));
проверить('у каждой миграции есть откат', безОтката.length === 0, 0,
  безОтката.join(', ') || 0);

// ── 8. умолчания базы нет ────────────────────────────────────────────────
проверить('DATABASE_URL без умолчания',
  !/DATABASE_URL\s*\|\|\s*['"]post/.test(читать(path.join('src', 'db', 'pool.js'))),
  'нет умолчания', 'есть умолчание');

for (const п of проверки)
  console.log((п.годно ? '  ' : '✗ ') + п.имя.padEnd(48, '.') +
    (п.годно ? '' : ` ждали ${п.ждали}, вышло ${п.вышло}`));
const плохо = проверки.filter(п => !п.годно);
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
process.exit(плохо.length ? 1 : 0);
