#!/usr/bin/env node
// ПОЛНАЯ ПЕРЕКЛАДКА ГРАФА — тонкая оболочка над службой.
//
// Сами ходы живут в src/graph/relayout-service.js. Здесь только разбор
// доводов и показ чисел человеку: когда перекладка станет кнопкой в панели
// коммитов, ход должен быть ОДИН, а не переписан рядом заново.
//
//   node scripts/relayout.mjs              посчитать и показать меру
//   node scripts/relayout.mjs --применить  посчитать и записать
//   node scripts/relayout.mjs --откат N    вернуть раскладку номер N
import { pool } from '../src/db/pool.js';
import { layoutHistory } from '../src/db/layout.js';
import { relayoutPlan, applyRelayout, revertLayout }
  from '../src/graph/relayout-service.js';

const довод = имя => process.argv.includes(имя);
const значение = имя => {
  const i = process.argv.indexOf(имя);
  return i >= 0 ? process.argv[i + 1] : null;
};

try {
  const кОткату = значение('--откат');
  if (кОткату) {
    const итог = await revertLayout(pool, { id: Number(кОткату) });
    if (!итог) { console.error(`раскладки ${кОткату} нет`); process.exit(2); }
    console.log(`возвращена раскладка ${итог.изЧего} как новая ${итог.id}; ` +
      `сдвиг от нынешней: медиана ${итог.мера.медиана} px, ` +
      `дальше 200 px — ${итог.мера.далеко}`);
    process.exit(0);
  }

  const t0 = Date.now();
  const план = await relayoutPlan(pool);
  console.log(`граф версии ${план.версия}: концепций ${план.граф.concepts.length}, ` +
    `связей ${план.граф.relations.length}`);
  console.log(`отжиг занял ${((Date.now() - t0) / 1000).toFixed(1)} с`);

  if (!план.прежняя) {
    console.log('прежней раскладки нет — эта будет первой');
  } else {
    console.log(`\nРАСХОЖДЕНИЕ С НЫНЕШНЕЙ РАСКЛАДКОЙ (${план.прежняя.id}, род ${план.прежняя.род}):`);
    console.log(`  медианный сдвиг узла: ${план.мера.медиана} px`);
    console.log(`  узлов дальше 200 px:  ${план.мера.далеко} из ${план.мера.сверено}`);
    console.log('  дальше всех уехали:');
    for (const у of план.дальние) console.log(`    ${у.id} — ${у.сдвиг} px`);
    console.log('\nЭто число решения. Медиана порядка сотни пикселей означает, что');
    console.log('пространственная память людей о графе перестанет работать.');
  }

  if (!довод('--применить')) {
    console.log('\nничего не записано. Применить: node scripts/relayout.mjs --применить');
    process.exit(0);
  }

  const итог = await applyRelayout(pool, { план });
  console.log(`\nзаписана раскладка ${итог.id}; о смене картины извещены все.`);
  if (план.прежняя)
    console.log(`откат — node scripts/relayout.mjs --откат ${план.прежняя.id}`);
  for (const л of await layoutHistory(pool, { limit: 5 }))
    console.log(`  ${л.id}: ${л.род}, версия графа ${л.версияГрафа}`);
} finally {
  await pool.end();
}
