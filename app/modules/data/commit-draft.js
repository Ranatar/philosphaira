// Сгенерировано из philosophy_graph.html — правки вносить ТУДА, не сюда.

function sameValue(a, b) {
      const пусто = v => v == null || (typeof v === 'string' && v.trim() === '');
      if (пусто(a) && пусто(b)) return true;
      if (пусто(a) || пусто(b)) return false;
      if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        const sa = new Set(a.map(String)), sb = new Set(b.map(String));
        return sa.size === sb.size && [...sa].every(x => sb.has(x));
      }
      if (typeof a === 'number' || typeof b === 'number') return Number(a) === Number(b);
      if (typeof a === 'boolean' || typeof b === 'boolean') return Boolean(a) === Boolean(b);
      const т = v => String(v).replace(/\r\n?/g, '\n').trim();
      return т(a) === т(b);
    }

function describeChange(action, kind, entityId, было, стало) {
      const описание = { action, kind, entityId, fields: {} };
      if (action === 'delete') return описание;
      const поля = Object.keys(стало || {});
      for (const поле of поля) {
        const base = было ? было[поле] : null;
        const next = стало[поле];
        if (action === 'edit' && sameValue(base, next)) continue;
        описание.fields[поле] = { base: base === undefined ? null : base, next };
      }
      return описание;
    }

export { describeChange };
