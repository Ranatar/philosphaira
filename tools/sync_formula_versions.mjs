#!/usr/bin/env node
// ВЕРСИИ ФОРМУЛ НА СТРАНИЦУ (E-2).
//
// Свод версий живёт в `baseline/formulas.json` — там его ведёт
// `formula_probe`. Странице версии тоже нужны: ими подписывается замер.
// Держать два списка руками значит однажды их разойти, и тогда замер
// подпишется версией, которой формула не соответствует, — а это ровно та
// ложь, ради предотвращения которой версии и заведены.
//
//   node tools/sync_formula_versions.mjs            # проверить согласие
//   node tools/sync_formula_versions.mjs записать   # перенести в исходник
import fs from 'node:fs';
import path from 'node:path';
import { ИСХОДНИК, КОРЕНЬ } from './paths.mjs';

const свод = JSON.parse(fs.readFileSync(
  path.join(КОРЕНЬ, 'baseline', 'formulas.json'), 'utf8')).формулы;
const текст = fs.readFileSync(ИСХОДНИК, 'utf8');
const н = текст.indexOf('const FORMULA_VERSIONS = Object.freeze({');
if (н < 0) { console.error('FORMULA_VERSIONS в исходнике нет'); process.exit(1); }
const к = текст.indexOf('});', н) + 3;

const строки = Object.entries(свод).sort()
  .map(([и, о]) => `      ${и}: ${о.версия}`).join(',\n');
const новый = `const FORMULA_VERSIONS = Object.freeze({\n${строки}\n    });`;

if (process.argv[2] === 'записать') {
  fs.writeFileSync(ИСХОДНИК, текст.slice(0, н) + новый + текст.slice(к));
  console.log(`версии перенесены на страницу: метрик ${Object.keys(свод).length}`);
  process.exit(0);
}

if (текст.slice(н, к) === новый) {
  console.log(`версии формул на странице согласны со сводом (метрик ${Object.keys(свод).length})`);
  process.exit(0);
}
console.log('✗ ВЕРСИИ НА СТРАНИЦЕ РАЗОШЛИСЬ СО СВОДОМ');
console.log('  перенесите: node tools/sync_formula_versions.mjs записать');
process.exit(1);
