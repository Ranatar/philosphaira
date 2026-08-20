// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { isTypologicalLink } from '../core/link-facts.js';

const BRIDGING_MIN_EXTERNAL = 5;

const BRIDGING_WEIGHT_REF = 50;

let traditionBridgingCache = null;

MET.traditionBridgingIndex = function traditionBridgingIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };
      const own = concept.philosopher;
      const ownTraditions = (S._philosopherMap.get(own) || {}).traditions || [];

      let external = 0, crossing = 0, crossWeight = 0, extWeight = 0;
      // М8. ТИПОЛОГИЧЕСКИЙ СЛОЙ СЧИТАЕТСЯ ОТДЕЛЬНО И В ИТОГ НЕ ВХОДИТ.
      // Мостовость меряет, КАК ТРАДИЦИИ СООБЩАЮТСЯ, а типологическая связь
      // по определению подсказки есть ОТСУТСТВИЕ сообщения: «сложившись
      // независимо, прямого заимствования не было». Засчитывая её, мера
      // принимала несообщение за сообщение. Замерено: типологические рёбра
      // давали 10,1 % внешнего веса и задевали 98 концепций.
      // Не выброшены, а вынесены в свои поля: схождение без контакта —
      // само по себе сведение о традициях, только другого рода, и прятать
      // его от подробностей было бы хуже, чем складывать с прочим.
      let typoCross = 0, typoWeight = 0;
      const reached = new Set(), typoReached = new Set();
      const links = [...(S._outgoingLinks.get(conceptId) || []),
                     ...(S._incomingLinks.get(conceptId) || [])];
      links.forEach(r => {
        const otherId = r.source === conceptId ? r.target : r.source;
        if (otherId === conceptId) return;
        const other = S._conceptMap.get(otherId);
        if (!other || other.philosopher === own) return;
        const w = r.weight || 2;
        const ot = (S._philosopherMap.get(other.philosopher) || {}).traditions || [];
        const crossesBorder = !ownTraditions.some(t => ot.includes(t));
        if (isTypologicalLink(r)) {
          if (crossesBorder) { typoCross++; typoWeight += w; ot.forEach(t => typoReached.add(t)); }
          return;
        }
        external++;
        extWeight += w;
        if (crossesBorder) {
          crossing++; crossWeight += w;
          ot.forEach(t => reached.add(t));
        }
      });

      // ДОЛЯ НАСЫЩАЕТСЯ: до правки у 34 концепций все внешние связи были
      // межтрадиционными, все они получали ровно 10, и весь показываемый
      // верх таблицы состоял из одного и того же числа — колонка значения
      // не несла ничего, а порядок решал невидимый добор. Поэтому доля
      // домножена на вес свидетельств: логарифм растёт медленно и не даёт
      // числу связей перебить саму долю. Различных значений среди ненулевых
      // стало 128 из 180 против 34 одинаковых наверху.
      //
      // ЦЕНА ЧЕСТНО: связность вернулась в метрику. Ранговая корреляция с
      // общей степенью узла 0,05 → 0,33. Мера перестала быть полностью
      // ортогональной связности, и это плата за различимость.
      const enough = external >= BRIDGING_MIN_EXTERNAL;
      // Доля показывается ПО ВЕСАМ — тою же мерой, какой считается сама
      // величина. Считать её по числу связей значило бы показывать в
      // подробностях не то, по чему построен рейтинг: у весов 1, 2 и 3
      // расхождение доходит до десятка процентов.
      const share = extWeight ? crossWeight / extWeight : 0;
      return {
        total: enough
          ? 10 * share * Math.log(1 + crossWeight) / Math.log(1 + BRIDGING_WEIGHT_REF)
          : 0,
        share: Math.round(share * 100),
        crossingLinks: crossing,
        crossWeight: crossWeight,
        externalLinks: external,
        traditionsReached: reached.size,
        typologicalCrossings: typoCross,
        typologicalWeight: typoWeight,
        typologicalReached: typoReached.size,
        belowThreshold: !enough
      };
    };

function invalidateTraditionBridgingCache() {
      traditionBridgingCache = null;
    }

export { BRIDGING_MIN_EXTERNAL, BRIDGING_WEIGHT_REF, invalidateTraditionBridgingCache };
