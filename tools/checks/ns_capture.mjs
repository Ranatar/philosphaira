#!/usr/bin/env node
// ЗАХВАТ ИМЕНИ ПРИ СБОРКЕ. split.mjs заменяет ссылку на глобальное имя
// на `S.имя` (DATA./MET./VIEWS.). Если в области видимости этой ссылки
// есть СВОЁ связывание с именем S, подставленный префикс укажет на него,
// а не на пространство имён. Разбор находит все такие места.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { ИСХОДНИК } from '../paths.mjs';
const require = createRequire(import.meta.url);
const acorn = require('acorn');
const eslintScope = require('eslint-scope');

const файл = process.argv[2] || ИСХОДНИК;
const html = fs.readFileSync(файл, 'utf8');
// тот же приём, что и в split.mjs: берём самый большой <script> без src
const куски = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => ({ code: m[1], at: m.index + m[0].indexOf(m[1]) }))
  .sort((a, b) => b.code.length - a.code.length);
const { code, at } = куски[0];
const строка = поз => html.slice(0, at + поз).split('\n').length;

const ast = acorn.parse(code, { ecmaVersion: 2022, ranges: true, locations: false });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2022, sourceType: 'script' });
const NS = new Set(['DATA', 'S', 'MET', 'VIEWS']);

// все глобальные имена (кандидаты на префикс)
const глоб = new Set(sm.globalScope.variables.map(v => v.name));

const находки = [];
(function обход(scope) {
  // своё связывание с именем пространства имён?
  const свои = scope.variables.filter(v => NS.has(v.name));
  if (scope !== sm.globalScope && свои.length) {
    // какие глобальные имена читаются внутри этой области?
    const внутри = new Set();
    (function вглубь(s) {
      s.references.forEach(r => {
        if (r.resolved && r.resolved.scope === sm.globalScope && глоб.has(r.identifier.name))
          внутри.add(r.identifier.name);
      });
      s.childScopes.forEach(вглубь);
    })(scope);
    находки.push({
      имя: свои.map(v => v.name).join(', '),
      строка: строка(scope.block.range[0]),
      видОбласти: scope.type,
      глобальныхВнутри: [...внутри],
    });
  }
  scope.childScopes.forEach(обход);
})(sm.globalScope);

console.log(`файл: ${файл}`);
console.log(`областей со своим именем пространства: ${находки.length}`);
for (const н of находки) {
  console.log(`  строка ${н.строка}: своё «${н.имя}» (${н.видОбласти}); глобальных имён внутри: ${н.глобальныхВнутри.length}`);
  if (н.глобальныхВнутри.length) console.log('    ' + н.глобальныхВнутри.join(', '));
}
