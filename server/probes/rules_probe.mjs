#!/usr/bin/env node
// Проба ПРАВИЛ. Чистые функции, база не нужна.
//
// Тринадцать утверждений, на которых сломалась первая редакция документа,
// здесь стали пробой. Проба ЗОВЁТ ТЕ ЖЕ функции, что и служба, а не
// пересказывает их условия: пересказ уже однажды дал ложное согласие.
//
//   node probes/rules_probe.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { P, ROLES, NEEDS_MFA, NEEDS_VERIFIED_EMAIL,
         effectivePermissions, rolesAtLeast, permissionMatrix } from '../src/access/roles.js';
import { can, canActOn, assertCan, assertCanChangeRole, assertNotSelfReview,
         isUsable, Forbidden, Conflict } from '../src/access/access.js';
import { userFromRow } from '../src/db/mapper.js';

const КОРЕНЬ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const merged = [];
const п = (имя, ждали, вышло) =>
  merged.push([String(ждали) === String(вышло) ? '  ' : '✗ ', имя, `ждали ${ждали}, вышло ${вышло}`]);
const отказ = fn => {
  try { fn(); return 'ПРОШЛО'; }
  catch (e) {
    return (e instanceof Forbidden || e instanceof Conflict)
      ? 'отказ' : 'ИСКЛЮЧЕНИЕ: ' + e.message;
  }
};

// Строка базы РОВНО в том виде, в каком её отдаёт SELECT *.
const row = (over = {}) => ({
  user_id: 'u1', username: 'ivan', email: 'i@e.ru', role: 'editor',
  is_active: true, is_banned: false, deleted_at: null,
  email_verified_at: '2026-01-02T00:00:00Z', mfa_enabled: true,
  display_name: null, avatar_url: null, bio: null,
  registered_at: '2026-01-01T00:00:00Z', language: 'ru', theme: 'dark', ...over });

const редактор  = userFromRow(row());
const баненый   = userFromRow(row({ user_id: 'u2', is_banned: true, ban_reason: 'спам' }));
const админ     = userFromRow(row({ user_id: 'a1', role: 'administrator' }));
const баненАдм  = userFromRow(row({ user_id: 'a2', role: 'administrator',
                                       is_banned: true, ban_reason: '—' }));
const модератор = userFromRow(row({ user_id: 'm1', role: 'moderator' }));
const зритель   = userFromRow(row({ user_id: 'v1', role: 'viewer' }));

// ── слой преобразования ──────────────────────────────────────────────────
п('строка базы проходит преобразователь и даёт право', true, can(редактор, P.CREATE_COMMIT));
п('забаненный из строки базы не действует', false, can(баненый, P.CREATE_COMMIT));
п('забаненный не имеет даже прав гостя', false, can(баненый, P.VIEW_GRAPH));
п('гость (нет записи) смотрит граф', true, can(null, P.VIEW_GRAPH));
п('гость не создаёт коммитов', false, can(null, P.CREATE_COMMIT));
п('преобразователь громко ругается на неполную строку', 'отказ',
  (() => { try { userFromRow({ user_id: 'x' }); return 'ПРОШЛО'; }
           catch (e) { return e.message.includes('нет полей') ? 'отказ' : 'ДРУГОЕ: ' + e.message; } })());
п('деактивированный непригоден', false,
  isUsable(userFromRow(row({ is_active: false }))));

// ── действие над собой ───────────────────────────────────────────────────
п('администратор не управляет сам собой', false, canActOn(админ, админ));
п('администратор не понижает сам себя', 'отказ',
  отказ(() => assertCanChangeRole(админ, админ, 'viewer')));
п('забаненный администратор не меняет роли', 'отказ',
  отказ(() => assertCanChangeRole(баненАдм, редактор, 'moderator')));
п('отсутствующий актор даёт отказ, а не исключение', 'отказ',
  отказ(() => assertCanChangeRole(null, редактор, 'moderator')));
п('роли, которой не бывает, не назначить', 'отказ',
  отказ(() => assertCanChangeRole(админ, редактор, 'царь')));
п('гостем не назначают', 'отказ',
  отказ(() => assertCanChangeRole(админ, редактор, 'guest')));
п('та же роль — не правка, а столкновение', 'отказ',
  отказ(() => assertCanChangeRole(админ, редактор, 'editor')));

// ── ступени ──────────────────────────────────────────────────────────────
п('модератор двигает viewer → editor', 'ПРОШЛО',
  отказ(() => assertCanChangeRole(модератор, зритель, 'editor')));
п('модератор НЕ назначает модератора', 'отказ',
  отказ(() => assertCanChangeRole(модератор, редактор, 'moderator')));
п('модератор не управляет администратором', false, canActOn(модератор, админ));
п('редактор не управляет никем', false, canActOn(редактор, зритель));

// ── самоодобрение ────────────────────────────────────────────────────────
п('модератор не рецензирует собственный коммит', 'отказ',
  отказ(() => assertNotSelfReview(модератор, { authorId: 'm1' })));
п('чужой коммит рецензировать можно', 'ПРОШЛО',
  отказ(() => assertNotSelfReview(модератор, { authorId: 'u1' })));

// ── срезание прав помимо роли ────────────────────────────────────────────
const неподтв = userFromRow(row({ user_id: 'u9', email_verified_at: null }));
п('неподтверждённый адрес — коммитов нет', false, can(неподтв, P.CREATE_COMMIT));
п('неподтверждённый адрес — смотреть можно', true, can(неподтв, P.VIEW_GRAPH));
const безШага = userFromRow(row({ user_id: 'a3', role: 'administrator', mfa_enabled: false }));
п('без двухшагового входа — не банит', false, can(безШага, P.BAN_USER));
п('без двухшагового входа — список пользователей видит', true, can(безШага, P.VIEW_USERS));
п('без двухшагового входа не назначает администратора', 'отказ',
  отказ(() => assertCanChangeRole(безШага, редактор, 'administrator')));

// ── устройство набора прав ───────────────────────────────────────────────
const исходникРолей = fs.readFileSync(path.join(КОРЕНЬ, 'src/access/roles.js'), 'utf8');
п('набор администратора собран перечислением, а не Object.values(P)', false,
  /const\s+administrator\s*=\s*\[[^\]]*Object\.values\(\s*P\s*\)/.test(исходникРолей));
п('все права из P розданы хоть кому-то', 0,
  Object.values(P).filter(x =>
    !Object.values(ROLES).some(r => r.permissions.includes(x))).length);
п('срезаемые права существуют', 0,
  [...NEEDS_MFA, ...NEEDS_VERIFIED_EMAIL].filter(x => !Object.values(P).includes(x)).length);
п('rolesAtLeast(модератор) — двое', 'moderator,administrator',
  rolesAtLeast(ROLES.moderator.level).join(','));
п('effectivePermissions ругается на неизвестную роль', 'отказ',
  (() => { try { effectivePermissions({ role: 'царь' }); return 'ПРОШЛО'; }
           catch { return 'отказ'; } })());

// ── матрица в README порождается, а не пишется руками ────────────────────
const readme = fs.readFileSync(path.join(КОРЕНЬ, 'README.md'), 'utf8');
const строкиТаблицы = readme.split('\n')
  .filter(l => /^\| `[a-z_]+` \| (✅|❌) \|/.test(l));
let расхождений = 0;
for (const строкаТ of строкиТаблицы) {
  const части = строкаТ.split('|').map(x => x.trim()).filter(Boolean);
  const право = части[0].replace(/`/g, '');
  ['guest', 'viewer', 'editor', 'moderator', 'administrator'].forEach((decipher, i) => {
    if ((части[1 + i] === '✅') !== ROLES[decipher].permissions.includes(право)) {
      расхождений++; console.log('  расходится:', право, decipher);
    }
  });
}
п('строк матрицы в README', Object.values(P).length, строкиТаблицы.length);
п('матрица в README сходится с ROLES', 0, расхождений);
п('permissionMatrix даёт строку на каждое право', Object.values(P).length,
  permissionMatrix().length);

for (const [з, и, к] of merged) console.log(з, и.padEnd(58, '.'), з === '  ' ? '' : к);
const плохо = merged.filter(x => x[0] === '✗ ').length;
console.log(`\nутверждений ${merged.length}, не сошлось ${плохо}`);
process.exit(плохо ? 1 : 0);
