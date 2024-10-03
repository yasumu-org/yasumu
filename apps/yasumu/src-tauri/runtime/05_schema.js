(() => {
  var e = globalThis,
    t = {},
    r = {},
    n = {},
    l = {};

  (l.FieldModel = class {
    create(e) {
      return this.validate(e), e;
    }
    check(e) {
      try {
        return this.validate(e), !0;
      } catch (e) {
        return !1;
      }
    }
    validate(e, t = 'value') {
      throw new Error("'validate' method has not been implemented");
    }
    get name() {
      return '-';
    }
    get type() {
      return '-';
    }
  }),
    Object.defineProperty(n, '__esModule', { value: !0 }),
    (n.AnyField = void 0);
  const i = l;
  class o extends i.FieldModel {
    validate(e, t = 'value') {
      return !0;
    }
    get name() {
      return 'AnyField';
    }
    get type() {
      return 'any';
    }
  }
  n.AnyField = o;
  var a = {};
  Object.defineProperty(a, '__esModule', { value: !0 }), (a.ArrayField = void 0);
  const d = l;
  class s extends d.FieldModel {
    constructor(e) {
      super(), (this.model = e);
    }
    validate(e, t = 'value') {
      if (!Array.isArray(e)) throw new TypeError(`'${t}' must be an 'array'`);
      return (
        e.forEach((e, t) => {
          this.model.validate(e, `Index ${t}`);
        }),
        !0
      );
    }
    get name() {
      return `ArrayField<${this.model.name}>`;
    }
    get type() {
      return `${this.model.name}[]`;
    }
  }
  a.ArrayField = s;
  var u = {};
  Object.defineProperty(u, '__esModule', { value: !0 }), (u.BooleanField = void 0);
  const c = l;
  class v extends c.FieldModel {
    validate(e, t = 'value') {
      if ('boolean' != typeof e) throw new TypeError(`'${t}' must be a 'boolean'`);
      return !0;
    }
    get name() {
      return 'BooleanField';
    }
    get type() {
      return 'boolean';
    }
  }
  u.BooleanField = v;
  var y = {};
  Object.defineProperty(y, '__esModule', { value: !0 }), (y.NumberField = void 0);
  const p = l;
  class h extends p.FieldModel {
    validate(e, t = 'value') {
      if ('number' != typeof e) throw new TypeError(`'${t}' must be a 'number'`);
      return !0;
    }
    get name() {
      return 'NumberField';
    }
    get type() {
      return 'number';
    }
  }
  y.NumberField = h;
  var f = {},
    b = {};
  Object.defineProperty(b, '__esModule', { value: !0 }), (b.NullableField = void 0);
  const m = l;
  class F extends m.FieldModel {
    constructor(e, t) {
      super(), (this.model = e), (this.options = t);
    }
    validate(e, t = 'value') {
      var r, n;
      return (
        (void 0 === e && !0 !== (null === (r = this.options) || void 0 === r ? void 0 : r.disallowUndefined)) ||
        (null === e && !0 !== (null === (n = this.options) || void 0 === n ? void 0 : n.disallowNull)) ||
        this.model.validate(e, t)
      );
    }
    get name() {
      return `NullableField<${this.type}>`;
    }
    get type() {
      return `${this.model.name} | null | undefined`;
    }
  }
  (b.NullableField = F), Object.defineProperty(f, '__esModule', { value: !0 }), (f.ObjectField = void 0);
  const g = l,
    w = b;
  class j extends g.FieldModel {
    constructor(e) {
      super(), (this.model = e);
    }
    validate(e, t = 'value') {
      if ('object' != typeof e || Array.isArray(e) || null === e) throw new TypeError(`'${t}' must be an 'object'`);
      const r = Object.keys(this.model),
        n = Object.keys(e);
      return (
        r.forEach((e) => {
          if (!(n.includes(e) || this.model[e] instanceof w.NullableField))
            throw new RangeError(`'${t}' has a missing key '${e}'`);
        }),
        n.forEach((n) => {
          if (!r.includes(n)) throw new RangeError(`'${t}' contains an unknown key '${n}'`);
          this.model[n].validate(e[n], `${t}.${n}`);
        }),
        !0
      );
    }
    get name() {
      return `ObjectField<${this.type}>`;
    }
    get type() {
      return `{\n${Object.entries(this.model)
        .map(([e, t]) => `  ${e}: ${t.name};`)
        .join('\n')}\n}`;
    }
  }
  f.ObjectField = j;
  var $ = {};
  Object.defineProperty($, '__esModule', { value: !0 }), ($.RecordField = void 0);
  const _ = l;
  class O extends _.FieldModel {
    constructor(e, t) {
      super(), (this.key = e), (this.value = t);
    }
    validate(e, t = 'value') {
      if ('object' != typeof e || Array.isArray(e) || null === e) throw new TypeError(`'${t}' must be an 'object'`);
      return (
        Object.entries(e).forEach(([e, t]) => {
          this.key.validate(e), this.value.validate(t);
        }),
        !0
      );
    }
    get name() {
      return `RecordField<${this.key.name}, ${this.value.name}>`;
    }
    get type() {
      return `{\n  ${this.key.type}: ${this.value.type};\n}`;
    }
  }
  $.RecordField = O;
  var M = {};
  Object.defineProperty(M, '__esModule', { value: !0 }), (M.StringField = void 0);
  const A = l;
  class P extends A.FieldModel {
    constructor(e) {
      super(), (this.options = e);
    }
    validate(e, t = 'value') {
      var r, n;
      if ('string' != typeof e) throw new TypeError(`'${t}' must be a 'string'`);
      if ((null === (r = this.options) || void 0 === r ? void 0 : r.disallowZeroLength) && 0 === e.length)
        throw new RangeError(`'${t}' must be longer than 1 character`);
      if ((null === (n = this.options) || void 0 === n ? void 0 : n.disallowWhiteSpace) && 0 === e.trim().length)
        throw new RangeError(`'${t}' must be longer than 1 character without whitespaces`);
      return !0;
    }
    get name() {
      return 'StringField';
    }
    get type() {
      return 'string';
    }
  }
  M.StringField = P;
  var E = {};
  Object.defineProperty(E, '__esModule', { value: !0 }), (E.AndField = void 0);
  const x = f;
  class T extends x.ObjectField {
    constructor(...e) {
      super(e.map((e) => e.model).reduce((e, t) => Object.assign(e, t), {})), (this.models = e);
    }
    get name() {
      return `AndField<${this.type}>`;
    }
  }
  E.AndField = T;
  var k = {},
    V = {};
  !(function (e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.joinValues = e.stringifyValues = e.stringifyValue = void 0);
    e.stringifyValue = (e) => ('number' == typeof e ? `${e}` : `"${e}"`);
    e.stringifyValues = (t) => t.map((t) => (0, e.stringifyValue)(t));
    e.joinValues = (e, t = ' | ') => e.join(t);
  })(V),
    Object.defineProperty(k, '__esModule', { value: !0 }),
    (k.OrField = void 0);
  const N = l,
    R = V;
  class S extends N.FieldModel {
    constructor(...e) {
      super(), (this.models = e);
    }
    validate(e, t = 'value') {
      for (const t of this.models) if (t.check(e)) return !0;
      throw new TypeError(`'${t}' must be did not satisfy any of the schema`);
    }
    get name() {
      return `OrField<${this.type}>`;
    }
    get type() {
      return `${(0, R.joinValues)(this.models.slice(0, 2).map((e) => e.name))}${this.models.length > 2 ? '...' : ''}`;
    }
  }
  k.OrField = S;
  var B = {};
  Object.defineProperty(B, '__esModule', { value: !0 }), (B.ConstantField = void 0);
  const C = l,
    I = V;
  class L extends C.FieldModel {
    constructor(e) {
      super(), (this.value = e);
    }
    validate(e, t = 'value') {
      if (this.value !== e) throw new TypeError(`'${t}' must be '${this.type}'`);
      return !0;
    }
    get name() {
      return `ConstantField<${this.type}>`;
    }
    get type() {
      return (0, I.stringifyValue)(this.value);
    }
  }
  B.ConstantField = L;
  var U = {};
  Object.defineProperty(U, '__esModule', { value: !0 }), (U.TupleField = void 0);
  const W = l,
    Z = V;
  class q extends W.FieldModel {
    constructor(...e) {
      super(), (this.values = e);
    }
    validate(e, t = 'value') {
      if (!Array.isArray(e)) throw new TypeError(`'${t}' must be an 'array'`);
      if (e.length !== this.values.length) throw new TypeError(`Length of '${t}' does not match the tuple`);
      for (let t = 0; t < this.values.length; t++) this.values[t].validate(e[t], `Index ${t}`);
      return !0;
    }
    get name() {
      return `TupleField<${this.type}>`;
    }
    get type() {
      return `(${(0, Z.joinValues)((0, Z.stringifyValues)(this.values.map((e) => e.type)), ', ')})`;
    }
  }
  var z, D, G;
  (U.TupleField = q),
    (function (t) {
      var r =
          (e && e.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r]);
              }),
        i =
          (e && e.__exportStar) ||
          function (e, t) {
            for (var n in e) 'default' === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
          };
      Object.defineProperty(t, '__esModule', { value: !0 }), (t.fields = void 0);
      const o = n,
        d = a,
        s = u,
        c = y,
        v = f,
        p = $,
        h = M,
        m = E,
        F = k,
        g = B,
        w = U,
        j = b;
      i(l, t),
        (function (e) {
          (e.any = () => new o.AnyField()),
            (e.array = (e) => new d.ArrayField(e)),
            (e.boolean = () => new s.BooleanField()),
            (e.number = () => new c.NumberField()),
            (e.object = (e) => new v.ObjectField(e)),
            (e.nullable = (e) => new j.NullableField(e)),
            (e.record = (e, t) => new p.RecordField(e, t)),
            (e.string = () => new h.StringField()),
            (e.or = (...e) => new F.OrField(...e)),
            (e.and = (...e) => new m.AndField(...e)),
            (e.constant = (e) => new g.ConstantField(e)),
            (e.tuple = (...e) => new w.TupleField(...e));
        })(t.fields || (t.fields = {}));
    })(r),
    (z = t),
    (D =
      (e && e.__createBinding) ||
      (Object.create
        ? function (e, t, r, n) {
            void 0 === n && (n = r),
              Object.defineProperty(e, n, {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              });
          }
        : function (e, t, r, n) {
            void 0 === n && (n = r), (e[n] = t[r]);
          })),
    (G =
      (e && e.__exportStar) ||
      function (e, t) {
        for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || D(t, e, r);
      }),
    Object.defineProperty(z, '__esModule', { value: !0 }),
    G(r, z);

  var H = t.FieldModel,
    K = t.fields;

  const YasumuSchema = {
    fields: K,
    FieldModel: H,
  };

  Object.assign(Yasumu, {
    schema: YasumuSchema,
  });

  Object.defineProperties(globalThis, {
    t: { value: YasumuSchema.fields, enumerable: !0, configurable: !0, writable: !0 },
  });
})();
