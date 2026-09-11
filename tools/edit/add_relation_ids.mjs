#!/usr/bin/env node
// Однократный перенос (заход 0.1): каждой связи выдаётся устойчивое имя.
//
// ЗАЧЕМ. Сегодня связь адресуется тройкой «источник — цель — тип». Значит
// смена типа — это смена адреса: история связи рвётся, а откат такой правки
// перестаёт быть простым. Многопользовательскому режиму нужен адрес, который
// правка не двигает.
//
// ПОЧЕМУ ИМЯ ВЫВОДИТСЯ ИЗ СОДЕРЖИМОГО, а не из времени. Перенос обязан быть
// повторимым: второй прогон на том же исходнике должен дать те же имена, иначе
// его нельзя ни проверить, ни повторить после отката. Отсюда sha1 от тройки.
// Дальше имя НЕПРОЗРАЧНО: правка типа его не меняет — в этом вся суть.
//
// Правится ИСХОДНИК (правка первого рода: правится предмет). Литералы не
// переписываются: имя вставляется первым свойством, всё остальное остаётся
// знак в знак. Программа идемпотентна — на связи с именем не трогает ничего.
//
//   node tools/edit/add_relation_ids.mjs [--check]
//     --check: ничего не пишет, только считает и проверяет

import fs from 'node:fs';
import crypto from 'node:crypto';
import * as acorn from 'acorn';
import { ИСХОДНИК } from '../paths.mjs';

const проверкаТолько = process.argv.includes('--check');

const текст = fs.readFileSync(ИСХОДНИК, 'utf8');
const строки = текст.split('\n');

// Границы массива ищем по объявлению, а не по номерам строк: номера сдвинутся
// при первой же правке рядом, и программа начнёт резать не то.
const нача = строки.findIndex(l => l.trim() === 'const relations = [');
if (нача === -1) { console.error('не нашёл объявления const relations = ['); process.exit(1); }
const конец = строки.findIndex((l, i) => i > нача && l.trim() === '];');
if (конец === -1) { console.error('не нашёл закрытия массива relations'); process.exit(1); }

const до    = строки.slice(0, нача).join('\n').length + (нача ? 1 : 0);
const срез  = строки.slice(нача, конец + 1).join('\n');

const ast = acorn.parse(срез, { ecmaVersion: 2022 });
const массив = ast.body[0]?.declarations?.[0]?.init;
if (!массив || массив.type !== 'ArrayExpression') {
  console.error('за объявлением не массив, а ' + (массив && массив.type));
  process.exit(1);
}

const имяСвязи = (src, tgt, тип) =>
  'rel_' + crypto.createHash('sha1')
    .update(`${src}\u0000${tgt}\u0000${тип}`).digest('hex').slice(0, 12);

const вставки = [];
const тройки = new Map();
const имена  = new Map();
let ужеСИменем = 0;

for (const эл of массив.elements) {
  if (эл.type !== 'ObjectExpression') {
    console.error('в массиве не объект на смещении ' + эл.start); process.exit(1);
  }
  const поле = имя => эл.properties.find(p => (p.key.name ?? p.key.value) === имя);

  if (поле('id')) { ужеСИменем++; continue; }

  const src = поле('source')?.value?.value;
  const tgt = поле('target')?.value?.value;
  const тип = поле('type')?.value?.value;
  if (!src || !tgt || !тип) {
    console.error('у связи на смещении ' + эл.start + ' нет source/target/type');
    process.exit(1);
  }

  const тройка = `${src}|${tgt}|${тип}`;
  if (тройки.has(тройка)) {
    // Тройка неуникальна — значит имя, выведенное из неё, столкнётся.
    // Молча пронумеровать нельзя: перенос перестанет быть повторимым.
    console.error('ДВЕ СВЯЗИ С ОДНОЙ ТРОЙКОЙ: ' + тройка +
      ' (смещения ' + тройки.get(тройка) + ' и ' + эл.start + ').\n' +
      'Имя из содержимого им не выдать — сначала развести связи.');
    process.exit(1);
  }
  тройки.set(тройка, эл.start);

  const id = имяСвязи(src, tgt, тип);
  if (имена.has(id)) {
    console.error('столкновение хешей: ' + id + ' — удлинить срез');
    process.exit(1);
  }
  имена.set(id, тройка);

  вставки.push({ куда: эл.properties[0].start, что: `id: "${id}", ` });
}

console.log(`связей ${массив.elements.length}, с именем уже ${ужеСИменем}, ` +
            `выдаём ${вставки.length}`);

if (проверкаТолько || вставки.length === 0) {
  console.log(вставки.length ? 'проверка: писать не просили' : 'делать нечего');
  process.exit(0);
}

// Вставки идут С КОНЦА: иначе каждая сдвигает смещения следующих.
вставки.sort((а, б) => б.куда - а.куда);
let новыйСрез = срез;
for (const { куда, что } of вставки) {
  новыйСрез = новыйСрез.slice(0, куда) + что + новыйСрез.slice(куда);
}

const новый = текст.slice(0, до) + новыйСрез + текст.slice(до + срез.length);

// Проверка перед записью: число строк не изменилось, а разбор нового среза
// даёт столько же связей и у каждой есть имя.
if (новый.split('\n').length !== строки.length) {
  console.error('число строк изменилось — так быть не должно'); process.exit(1);
}
const пров = acorn.parse(новыйСрез, { ecmaVersion: 2022 })
  .body[0].declarations[0].init;
const безИмени = пров.elements.filter(э =>
  !э.properties.some(p => (p.key.name ?? p.key.value) === 'id'));
if (пров.elements.length !== массив.elements.length || безИмени.length) {
  console.error('после вставки связей ' + пров.elements.length +
                ', без имени ' + безИмени.length); process.exit(1);
}

fs.writeFileSync(ИСХОДНИК, новый);
console.log(`записано: ${вставки.length} имён, строк ${строки.length} (не изменилось)`);
