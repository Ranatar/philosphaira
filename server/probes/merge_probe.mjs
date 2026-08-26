import { mergeField, mergeEntityChange, sameValue, MERGE } from '../src/commits/merge.js';
const т = [], п = (имя, ждали, вышло) =>
  т.push([JSON.stringify(ждали)===JSON.stringify(вышло)?'  ':'✗ ', имя, `ждали ${ждали}, вышло ${вышло}`]);

п('никто не трогал → чисто', MERGE.CLEAN, mergeField({ base:'A', next:'B', current:'A' }));
п('правили ОДИНАКОВО → совпало', MERGE.SAME, mergeField({ base:'A', next:'B', current:'B' }));
п('правили ПО-РАЗНОМУ → столкновение', MERGE.CONFLICT, mergeField({ base:'A', next:'B', current:'C' }));
п('пробелы и переносы строк не создают столкновения', MERGE.SAME,
  mergeField({ base:'A', next:' Б\r\nВ ', current:'Б\nВ' }));
п('РЕГИСТР значим: «Ничто» ≠ «ничто»', MERGE.CONFLICT,
  mergeField({ base:'A', next:'Ничто', current:'ничто' }));
п('перестановка рубрик — не правка', MERGE.SAME,
  mergeField({ base:['x'], next:['a','b'], current:['b','a'] }));
п('добавленная рубрика — правка', MERGE.CONFLICT,
  mergeField({ base:['x'], next:['a','b'], current:['a','b','c'] }));
п('null, пусто и пробел — одно и то же', MERGE.SAME,
  mergeField({ base:'текст', next:null, current:'   ' }));
п('вес связи 3 и «3» — одно и то же', true, sameValue(3, '3'));

const cur = { label:'Дазайн', description:'старое', rubrics:['a'] };
const edit = (fields, current=cur) => mergeEntityChange({ action:'edit', fields, current });
п('разные поля одной сущности НЕ сталкиваются', MERGE.CLEAN,
  edit({ rubrics:{ base:['a'], next:['a','b'] } }, {...cur, description:'чужое новое'}).outcome);
п('одно поле, разные значения → столкновение', MERGE.CONFLICT,
  edit({ description:{ base:'старое', next:'моё' } }, {...cur, description:'чужое'}).outcome);
п('в столкновении названо ПОЛЕ, а не сущность', 'description',
  edit({ description:{ base:'старое', next:'моё' } }, {...cur, description:'чужое'}).conflicts[0].field);
п('часть полей чистая, часть столкнулась → не применяем НИЧЕГО', MERGE.CONFLICT,
  edit({ description:{ base:'старое', next:'моё' }, rubrics:{ base:['a'], next:['a','b'] } },
       {...cur, description:'чужое'}).outcome);
п('вся правка совпала с чужой → вхолостую', MERGE.SAME,
  edit({ description:{ base:'старое', next:'то же' } }, {...cur, description:'то же'}).outcome);
п('применяется ТОЛЬКО чистое поле', JSON.stringify({rubrics:['a','b']}),
  JSON.stringify(edit({ rubrics:{ base:['a'], next:['a','b'] },
                        label:{ base:'Дазайн', next:'Дазайн' } }, cur).apply));
п('оба удалили → вхолостую', MERGE.SAME,
  mergeEntityChange({ action:'delete', current:null }).outcome);
п('правлю удалённое → столкновение', MERGE.CONFLICT,
  edit({ description:{ base:'старое', next:'моё' } }, null).outcome);
п('добавляю по занятому адресу → столкновение', MERGE.CONFLICT,
  mergeEntityChange({ action:'add', current:cur }).outcome);

for (const [verification,result,commitRow] of т) console.log(verification, result.padEnd(54,'.'), commitRow);
const плохо = т.filter(x=>x[0]==='✗ ').length;
console.log(`\nутверждений ${т.length}, не сошлось ${плохо}`);
process.exit(плохо?1:0);
