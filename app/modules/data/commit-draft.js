// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

function sameValue(a, b) {
      const blank = v => v == null || (typeof v === 'string' && v.trim() === '');
      if (blank(a) && blank(b)) return true;
      if (blank(a) || blank(b)) return false;
      if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        const sa = new Set(a.map(String)), sb = new Set(b.map(String));
        return sa.size === sb.size && [...sa].every(x => sb.has(x));
      }
      if (typeof a === 'number' || typeof b === 'number') return Number(a) === Number(b);
      if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b);
      const t = v => String(v).replace(/\r\n?/g, '\n').trim();
      return t(a) === t(b);
    }

function describeChange(action, kind, entityId, prevSide, next) {
      const descr = { action, kind, entityId, fields: {} };
      if (action === 'delete') return descr;
      const fields = Object.keys(next || {});
      for (const field of fields) {
        const base = prevSide ? prevSide[field] : null;
        // ИМЯ РАЗВЕДЕНО С ДОВОДОМ. Переименование `стало` → `next` дало
        // здесь `const next = next[field]` — переменная затенила довод
        // ЕЩЁ ДО СВОЕГО ОБЪЯВЛЕНИЯ, и вся правка падала с «Cannot access
        // next before initialization». Прибор проверял занятость имени
        // СНАРУЖИ области, а тут занято было ВНУТРИ той же.
        const nextValue = next[field];
        if (action === 'edit' && sameValue(base, nextValue)) continue;
        descr.fields[field] = { base: base === undefined ? null : base, next: nextValue };
      }
      return descr;
    }

export { describeChange };
