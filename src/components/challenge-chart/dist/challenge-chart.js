(() => {
  var we =
    window.ShadowRoot &&
    (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
    yi = Symbol(),
    Se = class {
      constructor(t, e) {
        if (e !== yi)
          throw Error(
            "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
          );
        this.cssText = t;
      }
      get styleSheet() {
        return (
          we &&
          this.t === void 0 &&
          ((this.t = new CSSStyleSheet()), this.t.replaceSync(this.cssText)),
          this.t
        );
      }
      toString() {
        return this.cssText;
      }
    },
    vi = new Map(),
    wi = (i) => {
      let t = vi.get(i);
      return t === void 0 && vi.set(i, (t = new Se(i, yi))), t;
    },
    Si = (i) => wi(typeof i == "string" ? i : i + ""),
    wn = (i, ...t) => {
      let e =
        i.length === 1
          ? i[0]
          : t.reduce(
            (n, s, o) =>
              n +
              ((a) => {
                if (a instanceof Se) return a.cssText;
                if (typeof a == "number") return a;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                  a +
                  ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(s) +
              i[o + 1],
            i[0]
          );
      return wi(e);
    },
    Sn = (i, t) => {
      we
        ? (i.adoptedStyleSheets = t.map((e) =>
          e instanceof CSSStyleSheet ? e : e.styleSheet
        ))
        : t.forEach((e) => {
          let n = document.createElement("style");
          (n.textContent = e.cssText), i.appendChild(n);
        });
    },
    Me = we
      ? (i) => i
      : (i) =>
        i instanceof CSSStyleSheet
          ? ((t) => {
            let e = "";
            for (let n of t.cssRules) e += n.cssText;
            return Si(e);
          })(i)
          : i;
  var Mi,
    Mn,
    kn,
    ki,
    Pn = {
      toAttribute(i, t) {
        switch (t) {
          case Boolean:
            i = i ? "" : null;
            break;
          case Object:
          case Array:
            i = i == null ? i : JSON.stringify(i);
        }
        return i;
      },
      fromAttribute(i, t) {
        let e = i;
        switch (t) {
          case Boolean:
            e = i !== null;
            break;
          case Number:
            e = i === null ? null : Number(i);
            break;
          case Object:
          case Array:
            try {
              e = JSON.parse(i);
            } catch (n) {
              e = null;
            }
        }
        return e;
      },
    },
    Pi = (i, t) => t !== i && (t == t || i == i),
    Cn = {
      attribute: !0,
      type: String,
      converter: Pn,
      reflect: !1,
      hasChanged: Pi,
    },
    ht = class extends HTMLElement {
      constructor() {
        super(),
          (this.Πi = new Map()),
          (this.Πo = void 0),
          (this.Πl = void 0),
          (this.isUpdatePending = !1),
          (this.hasUpdated = !1),
          (this.Πh = null),
          this.u();
      }
      static addInitializer(t) {
        var e;
        ((e = this.v) !== null && e !== void 0) || (this.v = []),
          this.v.push(t);
      }
      static get observedAttributes() {
        this.finalize();
        let t = [];
        return (
          this.elementProperties.forEach((e, n) => {
            let s = this.Πp(n, e);
            s !== void 0 && (this.Πm.set(s, n), t.push(s));
          }),
          t
        );
      }
      static createProperty(t, e = Cn) {
        if (
          (e.state && (e.attribute = !1),
            this.finalize(),
            this.elementProperties.set(t, e),
            !e.noAccessor && !this.prototype.hasOwnProperty(t))
        ) {
          let n = typeof t == "symbol" ? Symbol() : "__" + t,
            s = this.getPropertyDescriptor(t, n, e);
          s !== void 0 && Object.defineProperty(this.prototype, t, s);
        }
      }
      static getPropertyDescriptor(t, e, n) {
        return {
          get() {
            return this[e];
          },
          set(s) {
            let o = this[t];
            (this[e] = s), this.requestUpdate(t, o, n);
          },
          configurable: !0,
          enumerable: !0,
        };
      }
      static getPropertyOptions(t) {
        return this.elementProperties.get(t) || Cn;
      }
      static finalize() {
        if (this.hasOwnProperty("finalized")) return !1;
        this.finalized = !0;
        let t = Object.getPrototypeOf(this);
        if (
          (t.finalize(),
            (this.elementProperties = new Map(t.elementProperties)),
            (this.Πm = new Map()),
            this.hasOwnProperty("properties"))
        ) {
          let e = this.properties,
            n = [
              ...Object.getOwnPropertyNames(e),
              ...Object.getOwnPropertySymbols(e),
            ];
          for (let s of n) this.createProperty(s, e[s]);
        }
        return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
      }
      static finalizeStyles(t) {
        let e = [];
        if (Array.isArray(t)) {
          let n = new Set(t.flat(1 / 0).reverse());
          for (let s of n) e.unshift(Me(s));
        } else t !== void 0 && e.push(Me(t));
        return e;
      }
      static Πp(t, e) {
        let n = e.attribute;
        return n === !1
          ? void 0
          : typeof n == "string"
            ? n
            : typeof t == "string"
              ? t.toLowerCase()
              : void 0;
      }
      u() {
        var t;
        (this.Πg = new Promise((e) => (this.enableUpdating = e))),
          (this.L = new Map()),
          this.Π_(),
          this.requestUpdate(),
          (t = this.constructor.v) === null ||
          t === void 0 ||
          t.forEach((e) => e(this));
      }
      addController(t) {
        var e, n;
        ((e = this.ΠU) !== null && e !== void 0 ? e : (this.ΠU = [])).push(t),
          this.renderRoot !== void 0 &&
          this.isConnected &&
          ((n = t.hostConnected) === null || n === void 0 || n.call(t));
      }
      removeController(t) {
        var e;
        (e = this.ΠU) === null ||
          e === void 0 ||
          e.splice(this.ΠU.indexOf(t) >>> 0, 1);
      }
      Π_() {
        this.constructor.elementProperties.forEach((t, e) => {
          this.hasOwnProperty(e) && (this.Πi.set(e, this[e]), delete this[e]);
        });
      }
      createRenderRoot() {
        var t;
        let e =
          (t = this.shadowRoot) !== null && t !== void 0
            ? t
            : this.attachShadow(this.constructor.shadowRootOptions);
        return Sn(e, this.constructor.elementStyles), e;
      }
      connectedCallback() {
        var t;
        this.renderRoot === void 0 &&
          (this.renderRoot = this.createRenderRoot()),
          this.enableUpdating(!0),
          (t = this.ΠU) === null ||
          t === void 0 ||
          t.forEach((e) => {
            var n;
            return (n = e.hostConnected) === null || n === void 0
              ? void 0
              : n.call(e);
          }),
          this.Πl && (this.Πl(), (this.Πo = this.Πl = void 0));
      }
      enableUpdating(t) { }
      disconnectedCallback() {
        var t;
        (t = this.ΠU) === null ||
          t === void 0 ||
          t.forEach((e) => {
            var n;
            return (n = e.hostDisconnected) === null || n === void 0
              ? void 0
              : n.call(e);
          }),
          (this.Πo = new Promise((e) => (this.Πl = e)));
      }
      attributeChangedCallback(t, e, n) {
        this.K(t, n);
      }
      Πj(t, e, n = Cn) {
        var s, o;
        let a = this.constructor.Πp(t, n);
        if (a !== void 0 && n.reflect === !0) {
          let r = (
            (o =
              (s = n.converter) === null || s === void 0
                ? void 0
                : s.toAttribute) !== null && o !== void 0
              ? o
              : Pn.toAttribute
          )(e, n.type);
          (this.Πh = t),
            r == null ? this.removeAttribute(a) : this.setAttribute(a, r),
            (this.Πh = null);
        }
      }
      K(t, e) {
        var n, s, o;
        let a = this.constructor,
          r = a.Πm.get(t);
        if (r !== void 0 && this.Πh !== r) {
          let l = a.getPropertyOptions(r),
            c = l.converter,
            d =
              (o =
                (s =
                  (n = c) === null || n === void 0
                    ? void 0
                    : n.fromAttribute) !== null && s !== void 0
                  ? s
                  : typeof c == "function"
                    ? c
                    : null) !== null && o !== void 0
                ? o
                : Pn.fromAttribute;
          (this.Πh = r), (this[r] = d(e, l.type)), (this.Πh = null);
        }
      }
      requestUpdate(t, e, n) {
        let s = !0;
        t !== void 0 &&
          (((n = n || this.constructor.getPropertyOptions(t)).hasChanged || Pi)(
            this[t],
            e
          )
            ? (this.L.has(t) || this.L.set(t, e),
              n.reflect === !0 &&
              this.Πh !== t &&
              (this.Πk === void 0 && (this.Πk = new Map()),
                this.Πk.set(t, n)))
            : (s = !1)),
          !this.isUpdatePending && s && (this.Πg = this.Πq());
      }
      async Πq() {
        this.isUpdatePending = !0;
        try {
          for (await this.Πg; this.Πo;) await this.Πo;
        } catch (e) {
          Promise.reject(e);
        }
        let t = this.performUpdate();
        return t != null && (await t), !this.isUpdatePending;
      }
      performUpdate() {
        var t;
        if (!this.isUpdatePending) return;
        this.hasUpdated,
          this.Πi &&
          (this.Πi.forEach((s, o) => (this[o] = s)), (this.Πi = void 0));
        let e = !1,
          n = this.L;
        try {
          (e = this.shouldUpdate(n)),
            e
              ? (this.willUpdate(n),
                (t = this.ΠU) === null ||
                t === void 0 ||
                t.forEach((s) => {
                  var o;
                  return (o = s.hostUpdate) === null || o === void 0
                    ? void 0
                    : o.call(s);
                }),
                this.update(n))
              : this.Π$();
        } catch (s) {
          throw ((e = !1), this.Π$(), s);
        }
        e && this.E(n);
      }
      willUpdate(t) { }
      E(t) {
        var e;
        (e = this.ΠU) === null ||
          e === void 0 ||
          e.forEach((n) => {
            var s;
            return (s = n.hostUpdated) === null || s === void 0
              ? void 0
              : s.call(n);
          }),
          this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
          this.updated(t);
      }
      Π$() {
        (this.L = new Map()), (this.isUpdatePending = !1);
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this.Πg;
      }
      shouldUpdate(t) {
        return !0;
      }
      update(t) {
        this.Πk !== void 0 &&
          (this.Πk.forEach((e, n) => this.Πj(n, this[n], e)),
            (this.Πk = void 0)),
          this.Π$();
      }
      updated(t) { }
      firstUpdated(t) { }
    };
  (ht.finalized = !0),
    (ht.elementProperties = new Map()),
    (ht.elementStyles = []),
    (ht.shadowRootOptions = { mode: "open" }),
    (Mn = (Mi = globalThis).reactiveElementPlatformSupport) === null ||
    Mn === void 0 ||
    Mn.call(Mi, { ReactiveElement: ht }),
    ((kn = (ki = globalThis).reactiveElementVersions) !== null && kn !== void 0
      ? kn
      : (ki.reactiveElementVersions = [])
    ).push("1.0.0-rc.2");
  var Ci,
    Dn,
    On,
    Di,
    ke = globalThis.trustedTypes,
    Oi = ke ? ke.createPolicy("lit-html", { createHTML: (i) => i }) : void 0,
    ut = `lit$${(Math.random() + "").slice(9)}$`,
    Ai = "?" + ut,
    ra = `<${Ai}>`,
    Tt = document,
    Ut = (i = "") => Tt.createComment(i),
    Pe = (i) => i === null || (typeof i != "object" && typeof i != "function"),
    Ti = Array.isArray,
    la = (i) => {
      var t;
      return (
        Ti(i) ||
        typeof ((t = i) === null || t === void 0
          ? void 0
          : t[Symbol.iterator]) == "function"
      );
    },
    Yt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    Ri = /-->/g,
    Li = />/g,
    yt =
      />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
    Ei = /'/g,
    Fi = /"/g,
    zi = /^(?:script|style|textarea)$/i,
    Ii =
      (i) =>
        (t, ...e) => ({ _$litType$: i, strings: t, values: e }),
    Bi = Ii(1),
    Dc = Ii(2),
    vt = Symbol.for("lit-noChange"),
    H = Symbol.for("lit-nothing"),
    Hi = new WeakMap(),
    Vi = (i, t, e) => {
      var n, s;
      let o =
        (n = e == null ? void 0 : e.renderBefore) !== null && n !== void 0
          ? n
          : t,
        a = o._$litPart$;
      if (a === void 0) {
        let r =
          (s = e == null ? void 0 : e.renderBefore) !== null && s !== void 0
            ? s
            : null;
        o._$litPart$ = a = new Ft(t.insertBefore(Ut(), r), r, void 0, e);
      }
      return a.I(i), a;
    },
    Rt = Tt.createTreeWalker(Tt, 129, null, !1),
    ca = (i, t) => {
      let e = i.length - 1,
        n = [],
        s,
        o = t === 2 ? "<svg>" : "",
        a = Yt;
      for (let l = 0; l < e; l++) {
        let c = i[l],
          d,
          h,
          u = -1,
          f = 0;
        for (
          ;
          f < c.length && ((a.lastIndex = f), (h = a.exec(c)), h !== null);

        )
          (f = a.lastIndex),
            a === Yt
              ? h[1] === "!--"
                ? (a = Ri)
                : h[1] !== void 0
                  ? (a = Li)
                  : h[2] !== void 0
                    ? (zi.test(h[2]) && (s = RegExp("</" + h[2], "g")), (a = yt))
                    : h[3] !== void 0 && (a = yt)
              : a === yt
                ? h[0] === ">"
                  ? ((a = s ?? Yt), (u = -1))
                  : h[1] === void 0
                    ? (u = -2)
                    : ((u = a.lastIndex - h[2].length),
                      (d = h[1]),
                      (a = h[3] === void 0 ? yt : h[3] === '"' ? Fi : Ei))
                : a === Fi || a === Ei
                  ? (a = yt)
                  : a === Ri || a === Li
                    ? (a = Yt)
                    : ((a = yt), (s = void 0));
        let g = a === yt && i[l + 1].startsWith("/>") ? " " : "";
        o +=
          a === Yt
            ? c + ra
            : u >= 0
              ? (n.push(d), c.slice(0, u) + "$lit$" + c.slice(u) + ut + g)
              : c + ut + (u === -2 ? (n.push(void 0), l) : g);
      }
      let r = o + (i[e] || "<?>") + (t === 2 ? "</svg>" : "");
      return [Oi !== void 0 ? Oi.createHTML(r) : r, n];
    },
    Lt = class {
      constructor({ strings: t, _$litType$: e }, n) {
        let s;
        this.parts = [];
        let o = 0,
          a = 0,
          r = t.length - 1,
          l = this.parts,
          [c, d] = ca(t, e);
        if (
          ((this.el = Lt.createElement(c, n)),
            (Rt.currentNode = this.el.content),
            e === 2)
        ) {
          let h = this.el.content,
            u = h.firstChild;
          u.remove(), h.append(...u.childNodes);
        }
        for (; (s = Rt.nextNode()) !== null && l.length < r;) {
          if (s.nodeType === 1) {
            if (s.hasAttributes()) {
              let h = [];
              for (let u of s.getAttributeNames())
                if (u.endsWith("$lit$") || u.startsWith(ut)) {
                  let f = d[a++];
                  if ((h.push(u), f !== void 0)) {
                    let g = s.getAttribute(f.toLowerCase() + "$lit$").split(ut),
                      p = /([.?@])?(.*)/.exec(f);
                    l.push({
                      type: 1,
                      index: o,
                      name: p[2],
                      strings: g,
                      ctor:
                        p[1] === "."
                          ? Ni
                          : p[1] === "?"
                            ? ji
                            : p[1] === "@"
                              ? $i
                              : Xt,
                    });
                  } else l.push({ type: 6, index: o });
                }
              for (let u of h) s.removeAttribute(u);
            }
            if (zi.test(s.tagName)) {
              let h = s.textContent.split(ut),
                u = h.length - 1;
              if (u > 0) {
                s.textContent = ke ? ke.emptyScript : "";
                for (let f = 0; f < u; f++)
                  s.append(h[f], Ut()),
                    Rt.nextNode(),
                    l.push({ type: 2, index: ++o });
                s.append(h[u], Ut());
              }
            }
          } else if (s.nodeType === 8)
            if (s.data === Ai) l.push({ type: 2, index: o });
            else {
              let h = -1;
              for (; (h = s.data.indexOf(ut, h + 1)) !== -1;)
                l.push({ type: 7, index: o }), (h += ut.length - 1);
            }
          o++;
        }
      }
      static createElement(t, e) {
        let n = Tt.createElement("template");
        return (n.innerHTML = t), n;
      }
    };
  function Et(i, t, e = i, n) {
    var s, o, a, r;
    if (t === vt) return t;
    let l =
      n !== void 0
        ? (s = e.Σi) === null || s === void 0
          ? void 0
          : s[n]
        : e.Σo,
      c = Pe(t) ? void 0 : t._$litDirective$;
    return (
      (l == null ? void 0 : l.constructor) !== c &&
      ((o = l == null ? void 0 : l.O) === null ||
        o === void 0 ||
        o.call(l, !1),
        c === void 0 ? (l = void 0) : ((l = new c(i)), l.T(i, e, n)),
        n !== void 0
          ? (((a = (r = e).Σi) !== null && a !== void 0 ? a : (r.Σi = []))[n] =
            l)
          : (e.Σo = l)),
      l !== void 0 && (t = Et(i, l.S(i, t.values), l, n)),
      t
    );
  }
  var Wi = class {
    constructor(t, e) {
      (this.l = []), (this.N = void 0), (this.D = t), (this.M = e);
    }
    u(t) {
      var e;
      let {
        el: { content: n },
        parts: s,
      } = this.D,
        o = (
          (e = t == null ? void 0 : t.creationScope) !== null && e !== void 0
            ? e
            : Tt
        ).importNode(n, !0);
      Rt.currentNode = o;
      let a = Rt.nextNode(),
        r = 0,
        l = 0,
        c = s[0];
      for (; c !== void 0;) {
        if (r === c.index) {
          let d;
          c.type === 2
            ? (d = new Ft(a, a.nextSibling, this, t))
            : c.type === 1
              ? (d = new c.ctor(a, c.name, c.strings, this, t))
              : c.type === 6 && (d = new Ui(a, this, t)),
            this.l.push(d),
            (c = s[++l]);
        }
        r !== (c == null ? void 0 : c.index) && ((a = Rt.nextNode()), r++);
      }
      return o;
    }
    v(t) {
      let e = 0;
      for (let n of this.l)
        n !== void 0 &&
          (n.strings !== void 0
            ? (n.I(t, n, e), (e += n.strings.length - 2))
            : n.I(t[e])),
          e++;
    }
  },
    Ft = class {
      constructor(t, e, n, s) {
        (this.type = 2),
          (this.N = void 0),
          (this.A = t),
          (this.B = e),
          (this.M = n),
          (this.options = s);
      }
      setConnected(t) {
        var e;
        (e = this.P) === null || e === void 0 || e.call(this, t);
      }
      get parentNode() {
        return this.A.parentNode;
      }
      get startNode() {
        return this.A;
      }
      get endNode() {
        return this.B;
      }
      I(t, e = this) {
        (t = Et(this, t, e)),
          Pe(t)
            ? t === H || t == null || t === ""
              ? (this.H !== H && this.R(), (this.H = H))
              : t !== this.H && t !== vt && this.m(t)
            : t._$litType$ !== void 0
              ? this._(t)
              : t.nodeType !== void 0
                ? this.$(t)
                : la(t)
                  ? this.g(t)
                  : this.m(t);
      }
      k(t, e = this.B) {
        return this.A.parentNode.insertBefore(t, e);
      }
      $(t) {
        this.H !== t && (this.R(), (this.H = this.k(t)));
      }
      m(t) {
        let e = this.A.nextSibling;
        e !== null &&
          e.nodeType === 3 &&
          (this.B === null
            ? e.nextSibling === null
            : e === this.B.previousSibling)
          ? (e.data = t)
          : this.$(Tt.createTextNode(t)),
          (this.H = t);
      }
      _(t) {
        var e;
        let { values: n, _$litType$: s } = t,
          o =
            typeof s == "number"
              ? this.C(t)
              : (s.el === void 0 &&
                (s.el = Lt.createElement(s.h, this.options)),
                s);
        if (((e = this.H) === null || e === void 0 ? void 0 : e.D) === o)
          this.H.v(n);
        else {
          let a = new Wi(o, this),
            r = a.u(this.options);
          a.v(n), this.$(r), (this.H = a);
        }
      }
      C(t) {
        let e = Hi.get(t.strings);
        return e === void 0 && Hi.set(t.strings, (e = new Lt(t))), e;
      }
      g(t) {
        Ti(this.H) || ((this.H = []), this.R());
        let e = this.H,
          n,
          s = 0;
        for (let o of t)
          s === e.length
            ? e.push(
              (n = new Ft(this.k(Ut()), this.k(Ut()), this, this.options))
            )
            : (n = e[s]),
            n.I(o),
            s++;
        s < e.length && (this.R(n && n.B.nextSibling, s), (e.length = s));
      }
      R(t = this.A.nextSibling, e) {
        var n;
        for (
          (n = this.P) === null || n === void 0 || n.call(this, !1, !0, e);
          t && t !== this.B;

        ) {
          let s = t.nextSibling;
          t.remove(), (t = s);
        }
      }
    },
    Xt = class {
      constructor(t, e, n, s, o) {
        (this.type = 1),
          (this.H = H),
          (this.N = void 0),
          (this.V = void 0),
          (this.element = t),
          (this.name = e),
          (this.M = s),
          (this.options = o),
          n.length > 2 || n[0] !== "" || n[1] !== ""
            ? ((this.H = Array(n.length - 1).fill(H)), (this.strings = n))
            : (this.H = H);
      }
      get tagName() {
        return this.element.tagName;
      }
      I(t, e = this, n, s) {
        let o = this.strings,
          a = !1;
        if (o === void 0)
          (t = Et(this, t, e, 0)),
            (a = !Pe(t) || (t !== this.H && t !== vt)),
            a && (this.H = t);
        else {
          let r = t,
            l,
            c;
          for (t = o[0], l = 0; l < o.length - 1; l++)
            (c = Et(this, r[n + l], e, l)),
              c === vt && (c = this.H[l]),
              a || (a = !Pe(c) || c !== this.H[l]),
              c === H ? (t = H) : t !== H && (t += (c ?? "") + o[l + 1]),
              (this.H[l] = c);
        }
        a && !s && this.W(t);
      }
      W(t) {
        t === H
          ? this.element.removeAttribute(this.name)
          : this.element.setAttribute(this.name, t ?? "");
      }
    },
    Ni = class extends Xt {
      constructor() {
        super(...arguments), (this.type = 3);
      }
      W(t) {
        this.element[this.name] = t === H ? void 0 : t;
      }
    },
    ji = class extends Xt {
      constructor() {
        super(...arguments), (this.type = 4);
      }
      W(t) {
        t && t !== H
          ? this.element.setAttribute(this.name, "")
          : this.element.removeAttribute(this.name);
      }
    },
    $i = class extends Xt {
      constructor() {
        super(...arguments), (this.type = 5);
      }
      I(t, e = this) {
        var n;
        if (
          (t = (n = Et(this, t, e, 0)) !== null && n !== void 0 ? n : H) === vt
        )
          return;
        let s = this.H,
          o =
            (t === H && s !== H) ||
            t.capture !== s.capture ||
            t.once !== s.once ||
            t.passive !== s.passive,
          a = t !== H && (s === H || o);
        o && this.element.removeEventListener(this.name, this, s),
          a && this.element.addEventListener(this.name, this, t),
          (this.H = t);
      }
      handleEvent(t) {
        var e, n;
        typeof this.H == "function"
          ? this.H.call(
            (n =
              (e = this.options) === null || e === void 0
                ? void 0
                : e.host) !== null && n !== void 0
              ? n
              : this.element,
            t
          )
          : this.H.handleEvent(t);
      }
    },
    Ui = class {
      constructor(t, e, n) {
        (this.element = t),
          (this.type = 6),
          (this.N = void 0),
          (this.V = void 0),
          (this.M = e),
          (this.options = n);
      }
      I(t) {
        Et(this, t);
      }
    };
  (Dn = (Ci = globalThis).litHtmlPlatformSupport) === null ||
    Dn === void 0 ||
    Dn.call(Ci, Lt, Ft),
    ((On = (Di = globalThis).litHtmlVersions) !== null && On !== void 0
      ? On
      : (Di.litHtmlVersions = [])
    ).push("2.0.0-rc.3");
  var An, Yi, Tn, Xi, Rn, qi;
  ((An = (qi = globalThis).litElementVersions) !== null && An !== void 0
    ? An
    : (qi.litElementVersions = [])
  ).push("3.0.0-rc.2");
  var wt = class extends ht {
    constructor() {
      super(...arguments),
        (this.renderOptions = { host: this }),
        (this.Φt = void 0);
    }
    createRenderRoot() {
      var t, e;
      let n = super.createRenderRoot();
      return (
        ((t = (e = this.renderOptions).renderBefore) !== null &&
          t !== void 0) ||
        (e.renderBefore = n.firstChild),
        n
      );
    }
    update(t) {
      let e = this.render();
      super.update(t), (this.Φt = Vi(e, this.renderRoot, this.renderOptions));
    }
    connectedCallback() {
      var t;
      super.connectedCallback(),
        (t = this.Φt) === null || t === void 0 || t.setConnected(!0);
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(),
        (t = this.Φt) === null || t === void 0 || t.setConnected(!1);
    }
    render() {
      return vt;
    }
  };
  (wt.finalized = !0),
    (wt._$litElement$ = !0),
    (Tn = (Yi = globalThis).litElementHydrateSupport) === null ||
    Tn === void 0 ||
    Tn.call(Yi, { LitElement: wt }),
    (Rn = (Xi = globalThis).litElementPlatformSupport) === null ||
    Rn === void 0 ||
    Rn.call(Xi, { LitElement: wt });
  var Ln = (function () {
    return typeof window == "undefined"
      ? function (i) {
        return i();
      }
      : window.requestAnimationFrame;
  })();
  function En(i, t, e) {
    let n = e || ((a) => Array.prototype.slice.call(a)),
      s = !1,
      o = [];
    return function (...a) {
      (o = n(a)),
        s ||
        ((s = !0),
          Ln.call(window, () => {
            (s = !1), i.apply(t, o);
          }));
    };
  }
  function Ki(i, t) {
    let e;
    return function () {
      return t ? (clearTimeout(e), (e = setTimeout(i, t))) : i(), t;
    };
  }
  var Gi = (i) => (i === "start" ? "left" : i === "end" ? "right" : "center"),
    Fn = (i, t, e) => (i === "start" ? t : i === "end" ? e : (t + e) / 2);
  var Zi = (function () {
    let i = 0;
    return function () {
      return i++;
    };
  })();
  function P(i) {
    return i === null || typeof i == "undefined";
  }
  function T(i) {
    if (Array.isArray && Array.isArray(i)) return !0;
    let t = Object.prototype.toString.call(i);
    return t.substr(0, 7) === "[object" && t.substr(-6) === "Array]";
  }
  function O(i) {
    return (
      i !== null && Object.prototype.toString.call(i) === "[object Object]"
    );
  }
  var B = (i) => (typeof i == "number" || i instanceof Number) && isFinite(+i);
  function U(i, t) {
    return B(i) ? i : t;
  }
  function C(i, t) {
    return typeof i == "undefined" ? t : i;
  }
  var Ji = (i, t) =>
    typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 : i / t,
    Ce = (i, t) =>
      typeof i == "string" && i.endsWith("%") ? (parseFloat(i) / 100) * t : +i;
  function R(i, t, e) {
    if (i && typeof i.call == "function") return i.apply(e, t);
  }
  function D(i, t, e, n) {
    let s, o, a;
    if (T(i))
      if (((o = i.length), n)) for (s = o - 1; s >= 0; s--) t.call(e, i[s], s);
      else for (s = 0; s < o; s++) t.call(e, i[s], s);
    else if (O(i))
      for (a = Object.keys(i), o = a.length, s = 0; s < o; s++)
        t.call(e, i[a[s]], a[s]);
  }
  function qt(i, t) {
    let e, n, s, o;
    if (!i || !t || i.length !== t.length) return !1;
    for (e = 0, n = i.length; e < n; ++e)
      if (
        ((s = i[e]),
          (o = t[e]),
          s.datasetIndex !== o.datasetIndex || s.index !== o.index)
      )
        return !1;
    return !0;
  }
  function De(i) {
    if (T(i)) return i.map(De);
    if (O(i)) {
      let t = Object.create(null),
        e = Object.keys(i),
        n = e.length,
        s = 0;
      for (; s < n; ++s) t[e[s]] = De(i[e[s]]);
      return t;
    }
    return i;
  }
  function Qi(i) {
    return ["__proto__", "prototype", "constructor"].indexOf(i) === -1;
  }
  function da(i, t, e, n) {
    if (!Qi(i)) return;
    let s = t[i],
      o = e[i];
    O(s) && O(o) ? zt(s, o, n) : (t[i] = De(o));
  }
  function zt(i, t, e) {
    let n = T(t) ? t : [t],
      s = n.length;
    if (!O(i)) return i;
    e = e || {};
    let o = e.merger || da;
    for (let a = 0; a < s; ++a) {
      if (((t = n[a]), !O(t))) continue;
      let r = Object.keys(t);
      for (let l = 0, c = r.length; l < c; ++l) o(r[l], i, t, e);
    }
    return i;
  }
  function It(i, t) {
    return zt(i, t, { merger: ha });
  }
  function ha(i, t, e) {
    if (!Qi(i)) return;
    let n = t[i],
      s = e[i];
    O(n) && O(s)
      ? It(n, s)
      : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = De(s));
  }
  var ua = "",
    fa = ".";
  function ts(i, t) {
    let e = i.indexOf(fa, t);
    return e === -1 ? i.length : e;
  }
  function ot(i, t) {
    if (t === ua) return i;
    let e = 0,
      n = ts(t, e);
    for (; i && n > e;)
      (i = i[t.substr(e, n - e)]), (e = n + 1), (n = ts(t, e));
    return i;
  }
  function Oe(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
  }
  var q = (i) => typeof i != "undefined",
    St = (i) => typeof i == "function",
    es = (i, t) => {
      if (i.size !== t.size) return !1;
      for (let e of i) if (!t.has(e)) return !1;
      return !0;
    },
    I = Math.PI,
    A = 2 * I,
    ga = A + I,
    Ae = Number.POSITIVE_INFINITY,
    pa = I / 180,
    L = I / 2,
    Kt = I / 4,
    ns = (I * 2) / 3,
    Y = Math.log10,
    at = Math.sign;
  function zn(i) {
    let t = Math.pow(10, Math.floor(Y(i))),
      e = i / t;
    return (e <= 1 ? 1 : e <= 2 ? 2 : e <= 5 ? 5 : 10) * t;
  }
  function is(i) {
    let t = [],
      e = Math.sqrt(i),
      n;
    for (n = 1; n < e; n++) i % n == 0 && (t.push(n), t.push(i / n));
    return e === (e | 0) && t.push(e), t.sort((s, o) => s - o).pop(), t;
  }
  function Mt(i) {
    return !isNaN(parseFloat(i)) && isFinite(i);
  }
  function Gt(i, t, e) {
    return Math.abs(i - t) < e;
  }
  function ss(i, t) {
    let e = Math.round(i);
    return e - t <= i && e + t >= i;
  }
  function In(i, t, e) {
    let n, s, o;
    for (n = 0, s = i.length; n < s; n++)
      (o = i[n][e]),
        isNaN(o) ||
        ((t.min = Math.min(t.min, o)), (t.max = Math.max(t.max, o)));
  }
  function Q(i) {
    return i * (I / 180);
  }
  function Te(i) {
    return i * (180 / I);
  }
  function os(i) {
    if (!B(i)) return;
    let t = 1,
      e = 0;
    for (; Math.round(i * t) / t !== i;) (t *= 10), e++;
    return e;
  }
  function as(i, t) {
    let e = t.x - i.x,
      n = t.y - i.y,
      s = Math.sqrt(e * e + n * n),
      o = Math.atan2(n, e);
    return o < -0.5 * I && (o += A), { angle: o, distance: s };
  }
  function Re(i, t) {
    return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
  }
  function ma(i, t) {
    return ((i - t + ga) % A) - I;
  }
  function tt(i) {
    return ((i % A) + A) % A;
  }
  function Zt(i, t, e) {
    let n = tt(i),
      s = tt(t),
      o = tt(e),
      a = tt(s - n),
      r = tt(o - n),
      l = tt(n - s),
      c = tt(n - o);
    return n === s || n === o || (a > r && l < c);
  }
  function X(i, t, e) {
    return Math.max(t, Math.min(e, i));
  }
  function rs(i) {
    return X(i, -32768, 32767);
  }
  var Le = (i) => i === 0 || i === 1,
    ls = (i, t, e) =>
      -(Math.pow(2, 10 * (i -= 1)) * Math.sin(((i - t) * A) / e)),
    cs = (i, t, e) => Math.pow(2, -10 * i) * Math.sin(((i - t) * A) / e) + 1,
    Bt = {
      linear: (i) => i,
      easeInQuad: (i) => i * i,
      easeOutQuad: (i) => -i * (i - 2),
      easeInOutQuad: (i) =>
        (i /= 0.5) < 1 ? 0.5 * i * i : -0.5 * (--i * (i - 2) - 1),
      easeInCubic: (i) => i * i * i,
      easeOutCubic: (i) => (i -= 1) * i * i + 1,
      easeInOutCubic: (i) =>
        (i /= 0.5) < 1 ? 0.5 * i * i * i : 0.5 * ((i -= 2) * i * i + 2),
      easeInQuart: (i) => i * i * i * i,
      easeOutQuart: (i) => -((i -= 1) * i * i * i - 1),
      easeInOutQuart: (i) =>
        (i /= 0.5) < 1
          ? 0.5 * i * i * i * i
          : -0.5 * ((i -= 2) * i * i * i - 2),
      easeInQuint: (i) => i * i * i * i * i,
      easeOutQuint: (i) => (i -= 1) * i * i * i * i + 1,
      easeInOutQuint: (i) =>
        (i /= 0.5) < 1
          ? 0.5 * i * i * i * i * i
          : 0.5 * ((i -= 2) * i * i * i * i + 2),
      easeInSine: (i) => -Math.cos(i * L) + 1,
      easeOutSine: (i) => Math.sin(i * L),
      easeInOutSine: (i) => -0.5 * (Math.cos(I * i) - 1),
      easeInExpo: (i) => (i === 0 ? 0 : Math.pow(2, 10 * (i - 1))),
      easeOutExpo: (i) => (i === 1 ? 1 : -Math.pow(2, -10 * i) + 1),
      easeInOutExpo: (i) =>
        Le(i)
          ? i
          : i < 0.5
            ? 0.5 * Math.pow(2, 10 * (i * 2 - 1))
            : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
      easeInCirc: (i) => (i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1)),
      easeOutCirc: (i) => Math.sqrt(1 - (i -= 1) * i),
      easeInOutCirc: (i) =>
        (i /= 0.5) < 1
          ? -0.5 * (Math.sqrt(1 - i * i) - 1)
          : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
      easeInElastic: (i) => (Le(i) ? i : ls(i, 0.075, 0.3)),
      easeOutElastic: (i) => (Le(i) ? i : cs(i, 0.075, 0.3)),
      easeInOutElastic(i) {
        let t = 0.1125,
          e = 0.45;
        return Le(i)
          ? i
          : i < 0.5
            ? 0.5 * ls(i * 2, t, e)
            : 0.5 + 0.5 * cs(i * 2 - 1, t, e);
      },
      easeInBack(i) {
        let t = 1.70158;
        return i * i * ((t + 1) * i - t);
      },
      easeOutBack(i) {
        let t = 1.70158;
        return (i -= 1) * i * ((t + 1) * i + t) + 1;
      },
      easeInOutBack(i) {
        let t = 1.70158;
        return (i /= 0.5) < 1
          ? 0.5 * (i * i * (((t *= 1.525) + 1) * i - t))
          : 0.5 * ((i -= 2) * i * (((t *= 1.525) + 1) * i + t) + 2);
      },
      easeInBounce: (i) => 1 - Bt.easeOutBounce(1 - i),
      easeOutBounce(i) {
        let t = 7.5625,
          e = 2.75;
        return i < 1 / e
          ? t * i * i
          : i < 2 / e
            ? t * (i -= 1.5 / e) * i + 0.75
            : i < 2.5 / e
              ? t * (i -= 2.25 / e) * i + 0.9375
              : t * (i -= 2.625 / e) * i + 0.984375;
      },
      easeInOutBounce: (i) =>
        i < 0.5
          ? Bt.easeInBounce(i * 2) * 0.5
          : Bt.easeOutBounce(i * 2 - 1) * 0.5 + 0.5,
    };
  var K = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  },
    Bn = "0123456789ABCDEF",
    ba = (i) => Bn[i & 15],
    xa = (i) => Bn[(i & 240) >> 4] + Bn[i & 15],
    Ee = (i) => (i & 240) >> 4 == (i & 15);
  function _a(i) {
    return Ee(i.r) && Ee(i.g) && Ee(i.b) && Ee(i.a);
  }
  function ya(i) {
    var t = i.length,
      e;
    return (
      i[0] === "#" &&
      (t === 4 || t === 5
        ? (e = {
          r: 255 & (K[i[1]] * 17),
          g: 255 & (K[i[2]] * 17),
          b: 255 & (K[i[3]] * 17),
          a: t === 5 ? K[i[4]] * 17 : 255,
        })
        : (t === 7 || t === 9) &&
        (e = {
          r: (K[i[1]] << 4) | K[i[2]],
          g: (K[i[3]] << 4) | K[i[4]],
          b: (K[i[5]] << 4) | K[i[6]],
          a: t === 9 ? (K[i[7]] << 4) | K[i[8]] : 255,
        })),
      e
    );
  }
  function va(i) {
    var t = _a(i) ? ba : xa;
    return i && "#" + t(i.r) + t(i.g) + t(i.b) + (i.a < 255 ? t(i.a) : "");
  }
  function Jt(i) {
    return (i + 0.5) | 0;
  }
  var Fe = (i, t, e) => Math.max(Math.min(i, e), t);
  function Qt(i) {
    return Fe(Jt(i * 2.55), 0, 255);
  }
  function te(i) {
    return Fe(Jt(i * 255), 0, 255);
  }
  function Hn(i) {
    return Fe(Jt(i / 2.55) / 100, 0, 1);
  }
  function ds(i) {
    return Fe(Jt(i * 100), 0, 100);
  }
  var wa =
    /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
  function Sa(i) {
    let t = wa.exec(i),
      e = 255,
      n,
      s,
      o;
    if (!!t) {
      if (t[7] !== n) {
        let a = +t[7];
        e = 255 & (t[8] ? Qt(a) : a * 255);
      }
      return (
        (n = +t[1]),
        (s = +t[3]),
        (o = +t[5]),
        (n = 255 & (t[2] ? Qt(n) : n)),
        (s = 255 & (t[4] ? Qt(s) : s)),
        (o = 255 & (t[6] ? Qt(o) : o)),
        { r: n, g: s, b: o, a: e }
      );
    }
  }
  function Ma(i) {
    return (
      i &&
      (i.a < 255
        ? `rgba(${i.r}, ${i.g}, ${i.b}, ${Hn(i.a)})`
        : `rgb(${i.r}, ${i.g}, ${i.b})`)
    );
  }
  var ka =
    /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
  function hs(i, t, e) {
    let n = t * Math.min(e, 1 - e),
      s = (o, a = (o + i / 30) % 12) =>
        e - n * Math.max(Math.min(a - 3, 9 - a, 1), -1);
    return [s(0), s(8), s(4)];
  }
  function Pa(i, t, e) {
    let n = (s, o = (s + i / 60) % 6) =>
      e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
    return [n(5), n(3), n(1)];
  }
  function Ca(i, t, e) {
    let n = hs(i, 1, 0.5),
      s;
    for (
      t + e > 1 && ((s = 1 / (t + e)), (t *= s), (e *= s)), s = 0;
      s < 3;
      s++
    )
      (n[s] *= 1 - t - e), (n[s] += t);
    return n;
  }
  function Vn(i) {
    let t = 255,
      e = i.r / t,
      n = i.g / t,
      s = i.b / t,
      o = Math.max(e, n, s),
      a = Math.min(e, n, s),
      r = (o + a) / 2,
      l,
      c,
      d;
    return (
      o !== a &&
      ((d = o - a),
        (c = r > 0.5 ? d / (2 - o - a) : d / (o + a)),
        (l =
          o === e
            ? (n - s) / d + (n < s ? 6 : 0)
            : o === n
              ? (s - e) / d + 2
              : (e - n) / d + 4),
        (l = l * 60 + 0.5)),
      [l | 0, c || 0, r]
    );
  }
  function Wn(i, t, e, n) {
    return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, n)).map(te);
  }
  function Nn(i, t, e) {
    return Wn(hs, i, t, e);
  }
  function Da(i, t, e) {
    return Wn(Ca, i, t, e);
  }
  function Oa(i, t, e) {
    return Wn(Pa, i, t, e);
  }
  function us(i) {
    return ((i % 360) + 360) % 360;
  }
  function Aa(i) {
    let t = ka.exec(i),
      e = 255,
      n;
    if (!t) return;
    t[5] !== n && (e = t[6] ? Qt(+t[5]) : te(+t[5]));
    let s = us(+t[2]),
      o = +t[3] / 100,
      a = +t[4] / 100;
    return (
      t[1] === "hwb"
        ? (n = Da(s, o, a))
        : t[1] === "hsv"
          ? (n = Oa(s, o, a))
          : (n = Nn(s, o, a)),
      { r: n[0], g: n[1], b: n[2], a: e }
    );
  }
  function Ta(i, t) {
    var e = Vn(i);
    (e[0] = us(e[0] + t)),
      (e = Nn(e)),
      (i.r = e[0]),
      (i.g = e[1]),
      (i.b = e[2]);
  }
  function Ra(i) {
    if (!i) return;
    let t = Vn(i),
      e = t[0],
      n = ds(t[1]),
      s = ds(t[2]);
    return i.a < 255
      ? `hsla(${e}, ${n}%, ${s}%, ${Hn(i.a)})`
      : `hsl(${e}, ${n}%, ${s}%)`;
  }
  var fs = {
    x: "dark",
    Z: "light",
    Y: "re",
    X: "blu",
    W: "gr",
    V: "medium",
    U: "slate",
    A: "ee",
    T: "ol",
    S: "or",
    B: "ra",
    C: "lateg",
    D: "ights",
    R: "in",
    Q: "turquois",
    E: "hi",
    P: "ro",
    O: "al",
    N: "le",
    M: "de",
    L: "yello",
    F: "en",
    K: "ch",
    G: "arks",
    H: "ea",
    I: "ightg",
    J: "wh",
  },
    gs = {
      OiceXe: "f0f8ff",
      antiquewEte: "faebd7",
      aqua: "ffff",
      aquamarRe: "7fffd4",
      azuY: "f0ffff",
      beige: "f5f5dc",
      bisque: "ffe4c4",
      black: "0",
      blanKedOmond: "ffebcd",
      Xe: "ff",
      XeviTet: "8a2be2",
      bPwn: "a52a2a",
      burlywood: "deb887",
      caMtXe: "5f9ea0",
      KartYuse: "7fff00",
      KocTate: "d2691e",
      cSO: "ff7f50",
      cSnflowerXe: "6495ed",
      cSnsilk: "fff8dc",
      crimson: "dc143c",
      cyan: "ffff",
      xXe: "8b",
      xcyan: "8b8b",
      xgTMnPd: "b8860b",
      xWay: "a9a9a9",
      xgYF: "6400",
      xgYy: "a9a9a9",
      xkhaki: "bdb76b",
      xmagFta: "8b008b",
      xTivegYF: "556b2f",
      xSange: "ff8c00",
      xScEd: "9932cc",
      xYd: "8b0000",
      xsOmon: "e9967a",
      xsHgYF: "8fbc8f",
      xUXe: "483d8b",
      xUWay: "2f4f4f",
      xUgYy: "2f4f4f",
      xQe: "ced1",
      xviTet: "9400d3",
      dAppRk: "ff1493",
      dApskyXe: "bfff",
      dimWay: "696969",
      dimgYy: "696969",
      dodgerXe: "1e90ff",
      fiYbrick: "b22222",
      flSOwEte: "fffaf0",
      foYstWAn: "228b22",
      fuKsia: "ff00ff",
      gaRsbSo: "dcdcdc",
      ghostwEte: "f8f8ff",
      gTd: "ffd700",
      gTMnPd: "daa520",
      Way: "808080",
      gYF: "8000",
      gYFLw: "adff2f",
      gYy: "808080",
      honeyMw: "f0fff0",
      hotpRk: "ff69b4",
      RdianYd: "cd5c5c",
      Rdigo: "4b0082",
      ivSy: "fffff0",
      khaki: "f0e68c",
      lavFMr: "e6e6fa",
      lavFMrXsh: "fff0f5",
      lawngYF: "7cfc00",
      NmoncEffon: "fffacd",
      ZXe: "add8e6",
      ZcSO: "f08080",
      Zcyan: "e0ffff",
      ZgTMnPdLw: "fafad2",
      ZWay: "d3d3d3",
      ZgYF: "90ee90",
      ZgYy: "d3d3d3",
      ZpRk: "ffb6c1",
      ZsOmon: "ffa07a",
      ZsHgYF: "20b2aa",
      ZskyXe: "87cefa",
      ZUWay: "778899",
      ZUgYy: "778899",
      ZstAlXe: "b0c4de",
      ZLw: "ffffe0",
      lime: "ff00",
      limegYF: "32cd32",
      lRF: "faf0e6",
      magFta: "ff00ff",
      maPon: "800000",
      VaquamarRe: "66cdaa",
      VXe: "cd",
      VScEd: "ba55d3",
      VpurpN: "9370db",
      VsHgYF: "3cb371",
      VUXe: "7b68ee",
      VsprRggYF: "fa9a",
      VQe: "48d1cc",
      VviTetYd: "c71585",
      midnightXe: "191970",
      mRtcYam: "f5fffa",
      mistyPse: "ffe4e1",
      moccasR: "ffe4b5",
      navajowEte: "ffdead",
      navy: "80",
      Tdlace: "fdf5e6",
      Tive: "808000",
      TivedBb: "6b8e23",
      Sange: "ffa500",
      SangeYd: "ff4500",
      ScEd: "da70d6",
      pOegTMnPd: "eee8aa",
      pOegYF: "98fb98",
      pOeQe: "afeeee",
      pOeviTetYd: "db7093",
      papayawEp: "ffefd5",
      pHKpuff: "ffdab9",
      peru: "cd853f",
      pRk: "ffc0cb",
      plum: "dda0dd",
      powMrXe: "b0e0e6",
      purpN: "800080",
      YbeccapurpN: "663399",
      Yd: "ff0000",
      Psybrown: "bc8f8f",
      PyOXe: "4169e1",
      saddNbPwn: "8b4513",
      sOmon: "fa8072",
      sandybPwn: "f4a460",
      sHgYF: "2e8b57",
      sHshell: "fff5ee",
      siFna: "a0522d",
      silver: "c0c0c0",
      skyXe: "87ceeb",
      UXe: "6a5acd",
      UWay: "708090",
      UgYy: "708090",
      snow: "fffafa",
      sprRggYF: "ff7f",
      stAlXe: "4682b4",
      tan: "d2b48c",
      teO: "8080",
      tEstN: "d8bfd8",
      tomato: "ff6347",
      Qe: "40e0d0",
      viTet: "ee82ee",
      JHt: "f5deb3",
      wEte: "ffffff",
      wEtesmoke: "f5f5f5",
      Lw: "ffff00",
      LwgYF: "9acd32",
    };
  function La() {
    let i = {},
      t = Object.keys(gs),
      e = Object.keys(fs),
      n,
      s,
      o,
      a,
      r;
    for (n = 0; n < t.length; n++) {
      for (a = r = t[n], s = 0; s < e.length; s++)
        (o = e[s]), (r = r.replace(o, fs[o]));
      (o = parseInt(gs[a], 16)),
        (i[r] = [(o >> 16) & 255, (o >> 8) & 255, o & 255]);
    }
    return i;
  }
  var ze;
  function Ea(i) {
    ze || ((ze = La()), (ze.transparent = [0, 0, 0, 0]));
    let t = ze[i.toLowerCase()];
    return t && { r: t[0], g: t[1], b: t[2], a: t.length === 4 ? t[3] : 255 };
  }
  function Ie(i, t, e) {
    if (i) {
      let n = Vn(i);
      (n[t] = Math.max(0, Math.min(n[t] + n[t] * e, t === 0 ? 360 : 1))),
        (n = Nn(n)),
        (i.r = n[0]),
        (i.g = n[1]),
        (i.b = n[2]);
    }
  }
  function ps(i, t) {
    return i && Object.assign(t || {}, i);
  }
  function ms(i) {
    var t = { r: 0, g: 0, b: 0, a: 255 };
    return (
      Array.isArray(i)
        ? i.length >= 3 &&
        ((t = { r: i[0], g: i[1], b: i[2], a: 255 }),
          i.length > 3 && (t.a = te(i[3])))
        : ((t = ps(i, { r: 0, g: 0, b: 0, a: 1 })), (t.a = te(t.a))),
      t
    );
  }
  function Fa(i) {
    return i.charAt(0) === "r" ? Sa(i) : Aa(i);
  }
  var ee = class {
    constructor(t) {
      if (t instanceof ee) return t;
      let e = typeof t,
        n;
      e === "object"
        ? (n = ms(t))
        : e === "string" && (n = ya(t) || Ea(t) || Fa(t)),
        (this._rgb = n),
        (this._valid = !!n);
    }
    get valid() {
      return this._valid;
    }
    get rgb() {
      var t = ps(this._rgb);
      return t && (t.a = Hn(t.a)), t;
    }
    set rgb(t) {
      this._rgb = ms(t);
    }
    rgbString() {
      return this._valid ? Ma(this._rgb) : this._rgb;
    }
    hexString() {
      return this._valid ? va(this._rgb) : this._rgb;
    }
    hslString() {
      return this._valid ? Ra(this._rgb) : this._rgb;
    }
    mix(t, e) {
      let n = this;
      if (t) {
        let s = n.rgb,
          o = t.rgb,
          a,
          r = e === a ? 0.5 : e,
          l = 2 * r - 1,
          c = s.a - o.a,
          d = ((l * c == -1 ? l : (l + c) / (1 + l * c)) + 1) / 2;
        (a = 1 - d),
          (s.r = 255 & (d * s.r + a * o.r + 0.5)),
          (s.g = 255 & (d * s.g + a * o.g + 0.5)),
          (s.b = 255 & (d * s.b + a * o.b + 0.5)),
          (s.a = r * s.a + (1 - r) * o.a),
          (n.rgb = s);
      }
      return n;
    }
    clone() {
      return new ee(this.rgb);
    }
    alpha(t) {
      return (this._rgb.a = te(t)), this;
    }
    clearer(t) {
      let e = this._rgb;
      return (e.a *= 1 - t), this;
    }
    greyscale() {
      let t = this._rgb,
        e = Jt(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
      return (t.r = t.g = t.b = e), this;
    }
    opaquer(t) {
      let e = this._rgb;
      return (e.a *= 1 + t), this;
    }
    negate() {
      let t = this._rgb;
      return (t.r = 255 - t.r), (t.g = 255 - t.g), (t.b = 255 - t.b), this;
    }
    lighten(t) {
      return Ie(this._rgb, 2, t), this;
    }
    darken(t) {
      return Ie(this._rgb, 2, -t), this;
    }
    saturate(t) {
      return Ie(this._rgb, 1, t), this;
    }
    desaturate(t) {
      return Ie(this._rgb, 1, -t), this;
    }
    rotate(t) {
      return Ta(this._rgb, t), this;
    }
  };
  function bs(i) {
    return new ee(i);
  }
  var xs = (i) => i instanceof CanvasGradient || i instanceof CanvasPattern;
  function jn(i) {
    return xs(i) ? i : bs(i);
  }
  function $n(i) {
    return xs(i) ? i : bs(i).saturate(0.5).darken(0.1).hexString();
  }
  var ft = Object.create(null),
    Be = Object.create(null);
  function ne(i, t) {
    if (!t) return i;
    let e = t.split(".");
    for (let n = 0, s = e.length; n < s; ++n) {
      let o = e[n];
      i = i[o] || (i[o] = Object.create(null));
    }
    return i;
  }
  function Un(i, t, e) {
    return typeof t == "string" ? zt(ne(i, t), e) : zt(ne(i, ""), t);
  }
  var _s = class {
    constructor(t) {
      (this.animation = void 0),
        (this.backgroundColor = "rgba(0,0,0,0.1)"),
        (this.borderColor = "rgba(0,0,0,0.1)"),
        (this.color = "#666"),
        (this.datasets = {}),
        (this.devicePixelRatio = (e) =>
          e.chart.platform.getDevicePixelRatio()),
        (this.elements = {}),
        (this.events = [
          "mousemove",
          "mouseout",
          "click",
          "touchstart",
          "touchmove",
        ]),
        (this.font = {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          size: 12,
          style: "normal",
          lineHeight: 1.2,
          weight: null,
        }),
        (this.hover = {}),
        (this.hoverBackgroundColor = (e, n) => $n(n.backgroundColor)),
        (this.hoverBorderColor = (e, n) => $n(n.borderColor)),
        (this.hoverColor = (e, n) => $n(n.color)),
        (this.indexAxis = "x"),
        (this.interaction = { mode: "nearest", intersect: !0 }),
        (this.maintainAspectRatio = !0),
        (this.onHover = null),
        (this.onClick = null),
        (this.parsing = !0),
        (this.plugins = {}),
        (this.responsive = !0),
        (this.scale = void 0),
        (this.scales = {}),
        (this.showLine = !0),
        this.describe(t);
    }
    set(t, e) {
      return Un(this, t, e);
    }
    get(t) {
      return ne(this, t);
    }
    describe(t, e) {
      return Un(Be, t, e);
    }
    override(t, e) {
      return Un(ft, t, e);
    }
    route(t, e, n, s) {
      let o = ne(this, t),
        a = ne(this, n),
        r = "_" + e;
      Object.defineProperties(o, {
        [r]: { value: o[e], writable: !0 },
        [e]: {
          enumerable: !0,
          get() {
            let l = this[r],
              c = a[s];
            return O(l) ? Object.assign({}, c, l) : C(l, c);
          },
          set(l) {
            this[r] = l;
          },
        },
      });
    }
  },
    k = new _s({
      _scriptable: (i) => !i.startsWith("on"),
      _indexable: (i) => i !== "events",
      hover: { _fallback: "interaction" },
      interaction: { _scriptable: !1, _indexable: !1 },
    });
  function za(i) {
    return !i || P(i.size) || P(i.family)
      ? null
      : (i.style ? i.style + " " : "") +
      (i.weight ? i.weight + " " : "") +
      i.size +
      "px " +
      i.family;
  }
  function ie(i, t, e, n, s) {
    let o = t[s];
    return (
      o || ((o = t[s] = i.measureText(s).width), e.push(s)), o > n && (n = o), n
    );
  }
  function ys(i, t, e, n) {
    n = n || {};
    let s = (n.data = n.data || {}),
      o = (n.garbageCollect = n.garbageCollect || []);
    n.font !== t &&
      ((s = n.data = {}), (o = n.garbageCollect = []), (n.font = t)),
      i.save(),
      (i.font = t);
    let a = 0,
      r = e.length,
      l,
      c,
      d,
      h,
      u;
    for (l = 0; l < r; l++)
      if (((h = e[l]), h != null && T(h) !== !0)) a = ie(i, s, o, a, h);
      else if (T(h))
        for (c = 0, d = h.length; c < d; c++)
          (u = h[c]), u != null && !T(u) && (a = ie(i, s, o, a, u));
    i.restore();
    let f = o.length / 2;
    if (f > e.length) {
      for (l = 0; l < f; l++) delete s[o[l]];
      o.splice(0, f);
    }
    return a;
  }
  function gt(i, t, e) {
    let n = i.currentDevicePixelRatio,
      s = e !== 0 ? Math.max(e / 2, 0.5) : 0;
    return Math.round((t - s) * n) / n + s;
  }
  function Yn(i, t) {
    (t = t || i.getContext("2d")),
      t.save(),
      t.resetTransform(),
      t.clearRect(0, 0, i.width, i.height),
      t.restore();
  }
  function He(i, t, e, n) {
    let s,
      o,
      a,
      r,
      l,
      c = t.pointStyle,
      d = t.rotation,
      h = t.radius,
      u = (d || 0) * pa;
    if (
      c &&
      typeof c == "object" &&
      ((s = c.toString()),
        s === "[object HTMLImageElement]" || s === "[object HTMLCanvasElement]")
    ) {
      i.save(),
        i.translate(e, n),
        i.rotate(u),
        i.drawImage(c, -c.width / 2, -c.height / 2, c.width, c.height),
        i.restore();
      return;
    }
    if (!(isNaN(h) || h <= 0)) {
      switch ((i.beginPath(), c)) {
        default:
          i.arc(e, n, h, 0, A), i.closePath();
          break;
        case "triangle":
          i.moveTo(e + Math.sin(u) * h, n - Math.cos(u) * h),
            (u += ns),
            i.lineTo(e + Math.sin(u) * h, n - Math.cos(u) * h),
            (u += ns),
            i.lineTo(e + Math.sin(u) * h, n - Math.cos(u) * h),
            i.closePath();
          break;
        case "rectRounded":
          (l = h * 0.516),
            (r = h - l),
            (o = Math.cos(u + Kt) * r),
            (a = Math.sin(u + Kt) * r),
            i.arc(e - o, n - a, l, u - I, u - L),
            i.arc(e + a, n - o, l, u - L, u),
            i.arc(e + o, n + a, l, u, u + L),
            i.arc(e - a, n + o, l, u + L, u + I),
            i.closePath();
          break;
        case "rect":
          if (!d) {
            (r = Math.SQRT1_2 * h), i.rect(e - r, n - r, 2 * r, 2 * r);
            break;
          }
          u += Kt;
        case "rectRot":
          (o = Math.cos(u) * h),
            (a = Math.sin(u) * h),
            i.moveTo(e - o, n - a),
            i.lineTo(e + a, n - o),
            i.lineTo(e + o, n + a),
            i.lineTo(e - a, n + o),
            i.closePath();
          break;
        case "crossRot":
          u += Kt;
        case "cross":
          (o = Math.cos(u) * h),
            (a = Math.sin(u) * h),
            i.moveTo(e - o, n - a),
            i.lineTo(e + o, n + a),
            i.moveTo(e + a, n - o),
            i.lineTo(e - a, n + o);
          break;
        case "star":
          (o = Math.cos(u) * h),
            (a = Math.sin(u) * h),
            i.moveTo(e - o, n - a),
            i.lineTo(e + o, n + a),
            i.moveTo(e + a, n - o),
            i.lineTo(e - a, n + o),
            (u += Kt),
            (o = Math.cos(u) * h),
            (a = Math.sin(u) * h),
            i.moveTo(e - o, n - a),
            i.lineTo(e + o, n + a),
            i.moveTo(e + a, n - o),
            i.lineTo(e - a, n + o);
          break;
        case "line":
          (o = Math.cos(u) * h),
            (a = Math.sin(u) * h),
            i.moveTo(e - o, n - a),
            i.lineTo(e + o, n + a);
          break;
        case "dash":
          i.moveTo(e, n), i.lineTo(e + Math.cos(u) * h, n + Math.sin(u) * h);
          break;
      }
      i.fill(), t.borderWidth > 0 && i.stroke();
    }
  }
  function Ht(i, t, e) {
    return (
      (e = e || 0.5),
      i &&
      i.x > t.left - e &&
      i.x < t.right + e &&
      i.y > t.top - e &&
      i.y < t.bottom + e
    );
  }
  function Ve(i, t) {
    i.save(),
      i.beginPath(),
      i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top),
      i.clip();
  }
  function We(i) {
    i.restore();
  }
  function vs(i, t, e, n, s) {
    if (!t) return i.lineTo(e.x, e.y);
    if (s === "middle") {
      let o = (t.x + e.x) / 2;
      i.lineTo(o, t.y), i.lineTo(o, e.y);
    } else (s === "after") != !!n ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y);
    i.lineTo(e.x, e.y);
  }
  function ws(i, t, e, n) {
    if (!t) return i.lineTo(e.x, e.y);
    i.bezierCurveTo(
      n ? t.cp1x : t.cp2x,
      n ? t.cp1y : t.cp2y,
      n ? e.cp2x : e.cp1x,
      n ? e.cp2y : e.cp1y,
      e.x,
      e.y
    );
  }
  function se(i, t, e, n, s, o = {}) {
    let a = T(t) ? t : [t],
      r = o.strokeWidth > 0 && o.strokeColor !== "",
      l,
      c;
    for (
      i.save(),
      o.translation && i.translate(o.translation[0], o.translation[1]),
      P(o.rotation) || i.rotate(o.rotation),
      i.font = s.string,
      o.color && (i.fillStyle = o.color),
      o.textAlign && (i.textAlign = o.textAlign),
      o.textBaseline && (i.textBaseline = o.textBaseline),
      l = 0;
      l < a.length;
      ++l
    ) {
      if (
        ((c = a[l]),
          r &&
          (o.strokeColor && (i.strokeStyle = o.strokeColor),
            P(o.strokeWidth) || (i.lineWidth = o.strokeWidth),
            i.strokeText(c, e, n, o.maxWidth)),
          i.fillText(c, e, n, o.maxWidth),
          o.strikethrough || o.underline)
      ) {
        let d = i.measureText(c),
          h = e - d.actualBoundingBoxLeft,
          u = e + d.actualBoundingBoxRight,
          f = n - d.actualBoundingBoxAscent,
          g = n + d.actualBoundingBoxDescent,
          p = o.strikethrough ? (f + g) / 2 : g;
        (i.strokeStyle = i.fillStyle),
          i.beginPath(),
          (i.lineWidth = o.decorationWidth || 2),
          i.moveTo(h, p),
          i.lineTo(u, p),
          i.stroke();
      }
      n += s.lineHeight;
    }
    i.restore();
  }
  function Ne(i, t) {
    let { x: e, y: n, w: s, h: o, radius: a } = t;
    i.arc(e + a.topLeft, n + a.topLeft, a.topLeft, -L, I, !0),
      i.lineTo(e, n + o - a.bottomLeft),
      i.arc(e + a.bottomLeft, n + o - a.bottomLeft, a.bottomLeft, I, L, !0),
      i.lineTo(e + s - a.bottomRight, n + o),
      i.arc(
        e + s - a.bottomRight,
        n + o - a.bottomRight,
        a.bottomRight,
        L,
        0,
        !0
      ),
      i.lineTo(e + s, n + a.topRight),
      i.arc(e + s - a.topRight, n + a.topRight, a.topRight, 0, -L, !0),
      i.lineTo(e + a.topLeft, n);
  }
  var Ia = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),
    Ba = new RegExp(
      /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/
    );
  function Ha(i, t) {
    let e = ("" + i).match(Ia);
    if (!e || e[1] === "normal") return t * 1.2;
    switch (((i = +e[2]), e[3])) {
      case "px":
        return i;
      case "%":
        i /= 100;
        break;
    }
    return t * i;
  }
  var Va = (i) => +i || 0;
  function je(i, t) {
    let e = {},
      n = O(t),
      s = n ? Object.keys(t) : t,
      o = O(i) ? (n ? (a) => C(i[a], i[t[a]]) : (a) => i[a]) : () => i;
    for (let a of s) e[a] = Va(o(a));
    return e;
  }
  function Xn(i) {
    return je(i, { top: "y", right: "x", bottom: "y", left: "x" });
  }
  function qn(i) {
    return je(i, ["topLeft", "topRight", "bottomLeft", "bottomRight"]);
  }
  function G(i) {
    let t = Xn(i);
    return (t.width = t.left + t.right), (t.height = t.top + t.bottom), t;
  }
  function N(i, t) {
    (i = i || {}), (t = t || k.font);
    let e = C(i.size, t.size);
    typeof e == "string" && (e = parseInt(e, 10));
    let n = C(i.style, t.style);
    n &&
      !("" + n).match(Ba) &&
      (console.warn('Invalid font style specified: "' + n + '"'), (n = ""));
    let s = {
      family: C(i.family, t.family),
      lineHeight: Ha(C(i.lineHeight, t.lineHeight), e),
      size: e,
      style: n,
      weight: C(i.weight, t.weight),
      string: "",
    };
    return (s.string = za(s)), s;
  }
  function oe(i, t, e, n) {
    let s = !0,
      o,
      a,
      r;
    for (o = 0, a = i.length; o < a; ++o)
      if (
        ((r = i[o]),
          r !== void 0 &&
          (t !== void 0 && typeof r == "function" && ((r = r(t)), (s = !1)),
            e !== void 0 && T(r) && ((r = r[e % r.length]), (s = !1)),
            r !== void 0))
      )
        return n && !s && (n.cacheable = !1), r;
  }
  function Ss(i, t) {
    let { min: e, max: n } = i;
    return { min: e - Math.abs(Ce(t, e)), max: n + Ce(t, n) };
  }
  function ae(i, t, e) {
    e = e || ((a) => i[a] < t);
    let n = i.length - 1,
      s = 0,
      o;
    for (; n - s > 1;) (o = (s + n) >> 1), e(o) ? (s = o) : (n = o);
    return { lo: s, hi: n };
  }
  var Vt = (i, t, e) => ae(i, e, (n) => i[n][t] < e),
    Ms = (i, t, e) => ae(i, e, (n) => i[n][t] >= e);
  function ks(i, t, e) {
    let n = 0,
      s = i.length;
    for (; n < s && i[n] < t;) n++;
    for (; s > n && i[s - 1] > e;) s--;
    return n > 0 || s < i.length ? i.slice(n, s) : i;
  }
  var Ps = ["push", "pop", "shift", "splice", "unshift"];
  function Cs(i, t) {
    if (i._chartjs) {
      i._chartjs.listeners.push(t);
      return;
    }
    Object.defineProperty(i, "_chartjs", {
      configurable: !0,
      enumerable: !1,
      value: { listeners: [t] },
    }),
      Ps.forEach((e) => {
        let n = "_onData" + Oe(e),
          s = i[e];
        Object.defineProperty(i, e, {
          configurable: !0,
          enumerable: !1,
          value(...o) {
            let a = s.apply(this, o);
            return (
              i._chartjs.listeners.forEach((r) => {
                typeof r[n] == "function" && r[n](...o);
              }),
              a
            );
          },
        });
      });
  }
  function Kn(i, t) {
    let e = i._chartjs;
    if (!e) return;
    let n = e.listeners,
      s = n.indexOf(t);
    s !== -1 && n.splice(s, 1),
      !(n.length > 0) &&
      (Ps.forEach((o) => {
        delete i[o];
      }),
        delete i._chartjs);
  }
  function Gn(i) {
    let t = new Set(),
      e,
      n;
    for (e = 0, n = i.length; e < n; ++e) t.add(i[e]);
    if (t.size === n) return i;
    let s = [];
    return (
      t.forEach((o) => {
        s.push(o);
      }),
      s
    );
  }
  function $e(i, t = [""], e = i, n, s = () => i[0]) {
    q(n) || (n = Rs("_fallback", i));
    let o = {
      [Symbol.toStringTag]: "Object",
      _cacheable: !0,
      _scopes: i,
      _rootScopes: e,
      _fallback: n,
      _getTarget: s,
      override: (a) => $e([a, ...i], t, e, n),
    };
    return new Proxy(o, {
      deleteProperty(a, r) {
        return delete a[r], delete a._keys, delete i[0][r], !0;
      },
      get(a, r) {
        return Os(a, r, () => Xa(r, t, i, a));
      },
      getOwnPropertyDescriptor(a, r) {
        return Reflect.getOwnPropertyDescriptor(a._scopes[0], r);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(i[0]);
      },
      has(a, r) {
        return Ls(a).includes(r);
      },
      ownKeys(a) {
        return Ls(a);
      },
      set(a, r, l) {
        let c = a._storage || (a._storage = s());
        return (c[r] = l), delete a[r], delete a._keys, !0;
      },
    });
  }
  function kt(i, t, e, n) {
    let s = {
      _cacheable: !1,
      _proxy: i,
      _context: t,
      _subProxy: e,
      _stack: new Set(),
      _descriptors: Zn(i, n),
      setContext: (o) => kt(i, o, e, n),
      override: (o) => kt(i.override(o), t, e, n),
    };
    return new Proxy(s, {
      deleteProperty(o, a) {
        return delete o[a], delete i[a], !0;
      },
      get(o, a, r) {
        return Os(o, a, () => Na(o, a, r));
      },
      getOwnPropertyDescriptor(o, a) {
        return o._descriptors.allKeys
          ? Reflect.has(i, a)
            ? { enumerable: !0, configurable: !0 }
            : void 0
          : Reflect.getOwnPropertyDescriptor(i, a);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(i);
      },
      has(o, a) {
        return Reflect.has(i, a);
      },
      ownKeys() {
        return Reflect.ownKeys(i);
      },
      set(o, a, r) {
        return (i[a] = r), delete o[a], !0;
      },
    });
  }
  function Zn(i, t = { scriptable: !0, indexable: !0 }) {
    let {
      _scriptable: e = t.scriptable,
      _indexable: n = t.indexable,
      _allKeys: s = t.allKeys,
    } = i;
    return {
      allKeys: s,
      scriptable: e,
      indexable: n,
      isScriptable: St(e) ? e : () => e,
      isIndexable: St(n) ? n : () => n,
    };
  }
  var Wa = (i, t) => (i ? i + Oe(t) : t),
    Ds = (i, t) => O(t) && i !== "adapters";
  function Os(i, t, e) {
    let n = i[t];
    return q(n) || ((n = e()), q(n) && (i[t] = n)), n;
  }
  function Na(i, t, e) {
    let { _proxy: n, _context: s, _subProxy: o, _descriptors: a } = i,
      r = n[t];
    return (
      St(r) && a.isScriptable(t) && (r = ja(t, r, i, e)),
      T(r) && r.length && (r = $a(t, r, i, a.isIndexable)),
      Ds(t, r) && (r = kt(r, s, o && o[t], a)),
      r
    );
  }
  function ja(i, t, e, n) {
    let { _proxy: s, _context: o, _subProxy: a, _stack: r } = e;
    if (r.has(i))
      throw new Error("Recursion detected: " + [...r].join("->") + "->" + i);
    return (
      r.add(i),
      (t = t(o, a || n)),
      r.delete(i),
      O(t) && (t = Jn(s._scopes, s, i, t)),
      t
    );
  }
  function $a(i, t, e, n) {
    let { _proxy: s, _context: o, _subProxy: a, _descriptors: r } = e;
    if (q(o.index) && n(i)) t = t[o.index % t.length];
    else if (O(t[0])) {
      let l = t,
        c = s._scopes.filter((d) => d !== l);
      t = [];
      for (let d of l) {
        let h = Jn(c, s, i, d);
        t.push(kt(h, o, a && a[i], r));
      }
    }
    return t;
  }
  function As(i, t, e) {
    return St(i) ? i(t, e) : i;
  }
  var Ua = (i, t) => (i === !0 ? t : typeof i == "string" ? ot(t, i) : void 0);
  function Ya(i, t, e, n) {
    for (let s of t) {
      let o = Ua(e, s);
      if (o) {
        i.add(o);
        let a = As(o._fallback, e, o);
        if (q(a) && a !== e && a !== n) return a;
      } else if (o === !1 && q(n) && e !== n) return null;
    }
    return !1;
  }
  function Jn(i, t, e, n) {
    let s = t._rootScopes,
      o = As(t._fallback, e, n),
      a = [...i, ...s],
      r = new Set();
    r.add(n);
    let l = Ts(r, a, e, o || e);
    return l === null || (q(o) && o !== e && ((l = Ts(r, a, o, l)), l === null))
      ? !1
      : $e([...r], [""], s, o, () => {
        let c = t._getTarget();
        return e in c || (c[e] = {}), c[e];
      });
  }
  function Ts(i, t, e, n) {
    for (; e;) e = Ya(i, t, e, n);
    return e;
  }
  function Xa(i, t, e, n) {
    let s;
    for (let o of t)
      if (((s = Rs(Wa(o, i), e)), q(s))) return Ds(i, s) ? Jn(e, n, i, s) : s;
  }
  function Rs(i, t) {
    for (let e of t) {
      if (!e) continue;
      let n = e[i];
      if (q(n)) return n;
    }
  }
  function Ls(i) {
    let t = i._keys;
    return t || (t = i._keys = qa(i._scopes)), t;
  }
  function qa(i) {
    let t = new Set();
    for (let e of i)
      for (let n of Object.keys(e).filter((s) => !s.startsWith("_"))) t.add(n);
    return [...t];
  }
  var Ka = Number.EPSILON || 1e-14,
    Wt = (i, t) => t < i.length && !i[t].skip && i[t];
  function Ga(i, t, e, n) {
    let s = i.skip ? t : i,
      o = t,
      a = e.skip ? t : e,
      r = Re(o, s),
      l = Re(a, o),
      c = r / (r + l),
      d = l / (r + l);
    (c = isNaN(c) ? 0 : c), (d = isNaN(d) ? 0 : d);
    let h = n * c,
      u = n * d;
    return {
      previous: { x: o.x - h * (a.x - s.x), y: o.y - h * (a.y - s.y) },
      next: { x: o.x + u * (a.x - s.x), y: o.y + u * (a.y - s.y) },
    };
  }
  function Za(i, t, e) {
    let n = i.length,
      s,
      o,
      a,
      r,
      l,
      c = Wt(i, 0);
    for (let d = 0; d < n - 1; ++d)
      if (((l = c), (c = Wt(i, d + 1)), !(!l || !c))) {
        if (Gt(t[d], 0, Ka)) {
          e[d] = e[d + 1] = 0;
          continue;
        }
        (s = e[d] / t[d]),
          (o = e[d + 1] / t[d]),
          (r = Math.pow(s, 2) + Math.pow(o, 2)),
          !(r <= 9) &&
          ((a = 3 / Math.sqrt(r)),
            (e[d] = s * a * t[d]),
            (e[d + 1] = o * a * t[d]));
      }
  }
  function Ja(i, t) {
    let e = i.length,
      n,
      s,
      o,
      a = Wt(i, 0);
    for (let r = 0; r < e; ++r) {
      if (((s = o), (o = a), (a = Wt(i, r + 1)), !o)) continue;
      let { x: l, y: c } = o;
      s && ((n = (l - s.x) / 3), (o.cp1x = l - n), (o.cp1y = c - n * t[r])),
        a && ((n = (a.x - l) / 3), (o.cp2x = l + n), (o.cp2y = c + n * t[r]));
    }
  }
  function Qa(i) {
    let t = i.length,
      e = Array(t).fill(0),
      n = Array(t),
      s,
      o,
      a,
      r = Wt(i, 0);
    for (s = 0; s < t; ++s)
      if (((o = a), (a = r), (r = Wt(i, s + 1)), !!a)) {
        if (r) {
          let l = r.x - a.x;
          e[s] = l !== 0 ? (r.y - a.y) / l : 0;
        }
        n[s] = o
          ? r
            ? at(e[s - 1]) !== at(e[s])
              ? 0
              : (e[s - 1] + e[s]) / 2
            : e[s - 1]
          : e[s];
      }
    Za(i, e, n), Ja(i, n);
  }
  function Ue(i, t, e) {
    return Math.max(Math.min(i, e), t);
  }
  function tr(i, t) {
    let e,
      n,
      s,
      o,
      a,
      r = Ht(i[0], t);
    for (e = 0, n = i.length; e < n; ++e)
      (a = o),
        (o = r),
        (r = e < n - 1 && Ht(i[e + 1], t)),
        !!o &&
        ((s = i[e]),
          a &&
          ((s.cp1x = Ue(s.cp1x, t.left, t.right)),
            (s.cp1y = Ue(s.cp1y, t.top, t.bottom))),
          r &&
          ((s.cp2x = Ue(s.cp2x, t.left, t.right)),
            (s.cp2y = Ue(s.cp2y, t.top, t.bottom))));
  }
  function Es(i, t, e, n) {
    let s, o, a, r;
    if (
      (t.spanGaps && (i = i.filter((l) => !l.skip)),
        t.cubicInterpolationMode === "monotone")
    )
      Qa(i);
    else {
      let l = n ? i[i.length - 1] : i[0];
      for (s = 0, o = i.length; s < o; ++s)
        (a = i[s]),
          (r = Ga(l, a, i[Math.min(s + 1, o - (n ? 0 : 1)) % o], t.tension)),
          (a.cp1x = r.previous.x),
          (a.cp1y = r.previous.y),
          (a.cp2x = r.next.x),
          (a.cp2y = r.next.y),
          (l = a);
    }
    t.capBezierPoints && tr(i, e);
  }
  function pt(i) {
    let t = i.parentNode;
    return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
  }
  function Ye(i, t, e) {
    let n;
    return (
      typeof i == "string"
        ? ((n = parseInt(i, 10)),
          i.indexOf("%") !== -1 && (n = (n / 100) * t.parentNode[e]))
        : (n = i),
      n
    );
  }
  var Xe = (i) => window.getComputedStyle(i, null);
  function er(i, t) {
    return Xe(i).getPropertyValue(t);
  }
  var nr = ["top", "right", "bottom", "left"];
  function Pt(i, t, e) {
    let n = {};
    e = e ? "-" + e : "";
    for (let s = 0; s < 4; s++) {
      let o = nr[s];
      n[o] = parseFloat(i[t + "-" + o + e]) || 0;
    }
    return (n.width = n.left + n.right), (n.height = n.top + n.bottom), n;
  }
  var ir = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
  function sr(i, t) {
    let e = i.native || i,
      n = e.touches,
      s = n && n.length ? n[0] : e,
      { offsetX: o, offsetY: a } = s,
      r = !1,
      l,
      c;
    if (ir(o, a, e.target)) (l = o), (c = a);
    else {
      let d = t.getBoundingClientRect();
      (l = s.clientX - d.left), (c = s.clientY - d.top), (r = !0);
    }
    return { x: l, y: c, box: r };
  }
  function Qn(i, t) {
    let { canvas: e, currentDevicePixelRatio: n } = t,
      s = Xe(e),
      o = s.boxSizing === "border-box",
      a = Pt(s, "padding"),
      r = Pt(s, "border", "width"),
      { x: l, y: c, box: d } = sr(i, e),
      h = a.left + (d && r.left),
      u = a.top + (d && r.top),
      { width: f, height: g } = t;
    return (
      o && ((f -= a.width + r.width), (g -= a.height + r.height)),
      {
        x: Math.round((((l - h) / f) * e.width) / n),
        y: Math.round((((c - u) / g) * e.height) / n),
      }
    );
  }
  function or(i, t, e) {
    let n, s;
    if (t === void 0 || e === void 0) {
      let o = pt(i);
      if (!o) (t = i.clientWidth), (e = i.clientHeight);
      else {
        let a = o.getBoundingClientRect(),
          r = Xe(o),
          l = Pt(r, "border", "width"),
          c = Pt(r, "padding");
        (t = a.width - c.width - l.width),
          (e = a.height - c.height - l.height),
          (n = Ye(r.maxWidth, o, "clientWidth")),
          (s = Ye(r.maxHeight, o, "clientHeight"));
      }
    }
    return { width: t, height: e, maxWidth: n || Ae, maxHeight: s || Ae };
  }
  var ti = (i) => Math.round(i * 10) / 10;
  function Fs(i, t, e, n) {
    let s = Xe(i),
      o = Pt(s, "margin"),
      a = Ye(s.maxWidth, i, "clientWidth") || Ae,
      r = Ye(s.maxHeight, i, "clientHeight") || Ae,
      l = or(i, t, e),
      { width: c, height: d } = l;
    if (s.boxSizing === "content-box") {
      let h = Pt(s, "border", "width"),
        u = Pt(s, "padding");
      (c -= u.width + h.width), (d -= u.height + h.height);
    }
    return (
      (c = Math.max(0, c - o.width)),
      (d = Math.max(0, n ? Math.floor(c / n) : d - o.height)),
      (c = ti(Math.min(c, a, l.maxWidth))),
      (d = ti(Math.min(d, r, l.maxHeight))),
      c && !d && (d = ti(c / 2)),
      { width: c, height: d }
    );
  }
  function ei(i, t, e) {
    let n = (i.currentDevicePixelRatio = t || 1),
      { canvas: s, width: o, height: a } = i;
    (s.height = a * n),
      (s.width = o * n),
      i.ctx.setTransform(n, 0, 0, n, 0, 0),
      s.style &&
      (e || (!s.style.height && !s.style.width)) &&
      ((s.style.height = a + "px"), (s.style.width = o + "px"));
  }
  var zs = (function () {
    let i = !1;
    try {
      let t = {
        get passive() {
          return (i = !0), !1;
        },
      };
      window.addEventListener("test", null, t),
        window.removeEventListener("test", null, t);
    } catch (t) { }
    return i;
  })();
  function ni(i, t) {
    let e = er(i, t),
      n = e && e.match(/^(\d+)(\.\d+)?px$/);
    return n ? +n[1] : void 0;
  }
  function mt(i, t, e, n) {
    return { x: i.x + e * (t.x - i.x), y: i.y + e * (t.y - i.y) };
  }
  function Is(i, t, e, n) {
    return {
      x: i.x + e * (t.x - i.x),
      y:
        n === "middle"
          ? e < 0.5
            ? i.y
            : t.y
          : n === "after"
            ? e < 1
              ? i.y
              : t.y
            : e > 0
              ? t.y
              : i.y,
    };
  }
  function Bs(i, t, e, n) {
    let s = { x: i.cp2x, y: i.cp2y },
      o = { x: t.cp1x, y: t.cp1y },
      a = mt(i, s, e),
      r = mt(s, o, e),
      l = mt(o, t, e),
      c = mt(a, r, e),
      d = mt(r, l, e);
    return mt(c, d, e);
  }
  var Hs = new Map();
  function ar(i, t) {
    t = t || {};
    let e = i + JSON.stringify(t),
      n = Hs.get(e);
    return n || ((n = new Intl.NumberFormat(i, t)), Hs.set(e, n)), n;
  }
  function re(i, t, e) {
    return ar(t, e).format(i);
  }
  var rr = function (i, t) {
    return {
      x(e) {
        return i + i + t - e;
      },
      setWidth(e) {
        t = e;
      },
      textAlign(e) {
        return e === "center" ? e : e === "right" ? "left" : "right";
      },
      xPlus(e, n) {
        return e - n;
      },
      leftForLtr(e, n) {
        return e - n;
      },
    };
  },
    lr = function () {
      return {
        x(i) {
          return i;
        },
        setWidth(i) { },
        textAlign(i) {
          return i;
        },
        xPlus(i, t) {
          return i + t;
        },
        leftForLtr(i, t) {
          return i;
        },
      };
    };
  function qe(i, t, e) {
    return i ? rr(t, e) : lr();
  }
  function Vs(i, t) {
    let e, n;
    (t === "ltr" || t === "rtl") &&
      ((e = i.canvas.style),
        (n = [
          e.getPropertyValue("direction"),
          e.getPropertyPriority("direction"),
        ]),
        e.setProperty("direction", t, "important"),
        (i.prevTextDirection = n));
  }
  function Ws(i, t) {
    t !== void 0 &&
      (delete i.prevTextDirection,
        i.canvas.style.setProperty("direction", t[0], t[1]));
  }
  function Ns(i) {
    return i === "angle"
      ? { between: Zt, compare: ma, normalize: tt }
      : {
        between: (t, e, n) => t >= Math.min(e, n) && t <= Math.max(n, e),
        compare: (t, e) => t - e,
        normalize: (t) => t,
      };
  }
  function js({ start: i, end: t, count: e, loop: n, style: s }) {
    return {
      start: i % e,
      end: t % e,
      loop: n && (t - i + 1) % e == 0,
      style: s,
    };
  }
  function cr(i, t, e) {
    let { property: n, start: s, end: o } = e,
      { between: a, normalize: r } = Ns(n),
      l = t.length,
      { start: c, end: d, loop: h } = i,
      u,
      f;
    if (h) {
      for (c += l, d += l, u = 0, f = l; u < f && a(r(t[c % l][n]), s, o); ++u)
        c--, d--;
      (c %= l), (d %= l);
    }
    return d < c && (d += l), { start: c, end: d, loop: h, style: i.style };
  }
  function $s(i, t, e) {
    if (!e) return [i];
    let { property: n, start: s, end: o } = e,
      a = t.length,
      { compare: r, between: l, normalize: c } = Ns(n),
      { start: d, end: h, loop: u, style: f } = cr(i, t, e),
      g = [],
      p = !1,
      m = null,
      b,
      _,
      y,
      x = () => l(s, y, b) && r(s, y) !== 0,
      v = () => r(o, b) === 0 || l(o, y, b),
      w = () => p || x(),
      S = () => !p || v();
    for (let M = d, z = d; M <= h; ++M)
      (_ = t[M % a]),
        !_.skip &&
        ((b = c(_[n])),
          (p = l(b, s, o)),
          m === null && w() && (m = r(b, s) === 0 ? M : z),
          m !== null &&
          S() &&
          (g.push(js({ start: m, end: M, loop: u, count: a, style: f })),
            (m = null)),
          (z = M),
          (y = b));
    return (
      m !== null &&
      g.push(js({ start: m, end: h, loop: u, count: a, style: f })),
      g
    );
  }
  function Us(i, t) {
    let e = [],
      n = i.segments;
    for (let s = 0; s < n.length; s++) {
      let o = $s(n[s], i.points, t);
      o.length && e.push(...o);
    }
    return e;
  }
  function dr(i, t, e, n) {
    let s = 0,
      o = t - 1;
    if (e && !n) for (; s < t && !i[s].skip;) s++;
    for (; s < t && i[s].skip;) s++;
    for (s %= t, e && (o += s); o > s && i[o % t].skip;) o--;
    return (o %= t), { start: s, end: o };
  }
  function hr(i, t, e, n) {
    let s = i.length,
      o = [],
      a = t,
      r = i[t],
      l;
    for (l = t + 1; l <= e; ++l) {
      let c = i[l % s];
      c.skip || c.stop
        ? r.skip ||
        ((n = !1),
          o.push({ start: t % s, end: (l - 1) % s, loop: n }),
          (t = a = c.stop ? l : null))
        : ((a = l), r.skip && (t = l)),
        (r = c);
    }
    return a !== null && o.push({ start: t % s, end: a % s, loop: n }), o;
  }
  function Ys(i, t) {
    let e = i.points,
      n = i.options.spanGaps,
      s = e.length;
    if (!s) return [];
    let o = !!i._loop,
      { start: a, end: r } = dr(e, s, o, n);
    if (n === !0) return Xs([{ start: a, end: r, loop: o }], e, t);
    let l = r < a ? r + s : r,
      c = !!i._fullLoop && a === 0 && r === s - 1;
    return Xs(hr(e, a, l, c), e, t);
  }
  function Xs(i, t, e) {
    return !e || !e.setContext || !t ? i : ur(i, t, e);
  }
  function ur(i, t, e) {
    let n = t.length,
      s = [],
      o = i[0].start,
      a = o;
    for (let r of i) {
      let l,
        c,
        d = t[o % n];
      for (a = o + 1; a <= r.end; a++) {
        let h = t[a % n];
        (c = fr(e.setContext({ type: "segment", p0: d, p1: h }))),
          gr(c, l) &&
          (s.push({ start: o, end: a - 1, loop: r.loop, style: l }),
            (l = c),
            (o = a - 1)),
          (d = h),
          (l = c);
      }
      o < a - 1 &&
        (s.push({ start: o, end: a - 1, loop: r.loop, style: c }), (o = a - 1));
    }
    return s;
  }
  function fr(i) {
    return {
      backgroundColor: i.backgroundColor,
      borderCapStyle: i.borderCapStyle,
      borderDash: i.borderDash,
      borderDashOffset: i.borderDashOffset,
      borderJoinStyle: i.borderJoinStyle,
      borderWidth: i.borderWidth,
      borderColor: i.borderColor,
    };
  }
  function gr(i, t) {
    return t && JSON.stringify(i) !== JSON.stringify(t);
  }
  var qs = class {
    constructor() {
      (this._request = null),
        (this._charts = new Map()),
        (this._running = !1),
        (this._lastDate = void 0);
    }
    _notify(t, e, n, s) {
      let o = e.listeners[s],
        a = e.duration;
      o.forEach((r) =>
        r({
          chart: t,
          initial: e.initial,
          numSteps: a,
          currentStep: Math.min(n - e.start, a),
        })
      );
    }
    _refresh() {
      let t = this;
      t._request ||
        ((t._running = !0),
          (t._request = Ln.call(window, () => {
            t._update(), (t._request = null), t._running && t._refresh();
          })));
    }
    _update(t = Date.now()) {
      let e = this,
        n = 0;
      e._charts.forEach((s, o) => {
        if (!s.running || !s.items.length) return;
        let a = s.items,
          r = a.length - 1,
          l = !1,
          c;
        for (; r >= 0; --r)
          (c = a[r]),
            c._active
              ? (c._total > s.duration && (s.duration = c._total),
                c.tick(t),
                (l = !0))
              : ((a[r] = a[a.length - 1]), a.pop());
        l && (o.draw(), e._notify(o, s, t, "progress")),
          a.length ||
          ((s.running = !1),
            e._notify(o, s, t, "complete"),
            (s.initial = !1)),
          (n += a.length);
      }),
        (e._lastDate = t),
        n === 0 && (e._running = !1);
    }
    _getAnims(t) {
      let e = this._charts,
        n = e.get(t);
      return (
        n ||
        ((n = {
          running: !1,
          initial: !0,
          items: [],
          listeners: { complete: [], progress: [] },
        }),
          e.set(t, n)),
        n
      );
    }
    listen(t, e, n) {
      this._getAnims(t).listeners[e].push(n);
    }
    add(t, e) {
      !e || !e.length || this._getAnims(t).items.push(...e);
    }
    has(t) {
      return this._getAnims(t).items.length > 0;
    }
    start(t) {
      let e = this._charts.get(t);
      !e ||
        ((e.running = !0),
          (e.start = Date.now()),
          (e.duration = e.items.reduce((n, s) => Math.max(n, s._duration), 0)),
          this._refresh());
    }
    running(t) {
      if (!this._running) return !1;
      let e = this._charts.get(t);
      return !(!e || !e.running || !e.items.length);
    }
    stop(t) {
      let e = this._charts.get(t);
      if (!e || !e.items.length) return;
      let n = e.items,
        s = n.length - 1;
      for (; s >= 0; --s) n[s].cancel();
      (e.items = []), this._notify(t, e, Date.now(), "complete");
    }
    remove(t) {
      return this._charts.delete(t);
    }
  },
    rt = new qs(),
    Ks = "transparent",
    pr = {
      boolean(i, t, e) {
        return e > 0.5 ? t : i;
      },
      color(i, t, e) {
        let n = jn(i || Ks),
          s = n.valid && jn(t || Ks);
        return s && s.valid ? s.mix(n, e).hexString() : t;
      },
      number(i, t, e) {
        return i + (t - i) * e;
      },
    },
    Gs = class {
      constructor(t, e, n, s) {
        let o = e[n];
        s = oe([t.to, s, o, t.from]);
        let a = oe([t.from, o, s]);
        (this._active = !0),
          (this._fn = t.fn || pr[t.type || typeof a]),
          (this._easing = Bt[t.easing] || Bt.linear),
          (this._start = Math.floor(Date.now() + (t.delay || 0))),
          (this._duration = this._total = Math.floor(t.duration)),
          (this._loop = !!t.loop),
          (this._target = e),
          (this._prop = n),
          (this._from = a),
          (this._to = s),
          (this._promises = void 0);
      }
      active() {
        return this._active;
      }
      update(t, e, n) {
        let s = this;
        if (s._active) {
          s._notify(!1);
          let o = s._target[s._prop],
            a = n - s._start,
            r = s._duration - a;
          (s._start = n),
            (s._duration = Math.floor(Math.max(r, t.duration))),
            (s._total += a),
            (s._loop = !!t.loop),
            (s._to = oe([t.to, e, o, t.from])),
            (s._from = oe([t.from, o, e]));
        }
      }
      cancel() {
        let t = this;
        t._active && (t.tick(Date.now()), (t._active = !1), t._notify(!1));
      }
      tick(t) {
        let e = this,
          n = t - e._start,
          s = e._duration,
          o = e._prop,
          a = e._from,
          r = e._loop,
          l = e._to,
          c;
        if (((e._active = a !== l && (r || n < s)), !e._active)) {
          (e._target[o] = l), e._notify(!0);
          return;
        }
        if (n < 0) {
          e._target[o] = a;
          return;
        }
        (c = (n / s) % 2),
          (c = r && c > 1 ? 2 - c : c),
          (c = e._easing(Math.min(1, Math.max(0, c)))),
          (e._target[o] = e._fn(a, l, c));
      }
      wait() {
        let t = this._promises || (this._promises = []);
        return new Promise((e, n) => {
          t.push({ res: e, rej: n });
        });
      }
      _notify(t) {
        let e = t ? "res" : "rej",
          n = this._promises || [];
        for (let s = 0; s < n.length; s++) n[s][e]();
      }
    },
    mr = ["x", "y", "borderWidth", "radius", "tension"],
    br = ["color", "borderColor", "backgroundColor"];
  k.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0,
  });
  var xr = Object.keys(k.animation);
  k.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (i) => i !== "onProgress" && i !== "onComplete" && i !== "fn",
  });
  k.set("animations", {
    colors: { type: "color", properties: br },
    numbers: { type: "number", properties: mr },
  });
  k.describe("animations", { _fallback: "animation" });
  k.set("transitions", {
    active: { animation: { duration: 400 } },
    resize: { animation: { duration: 0 } },
    show: {
      animations: {
        colors: { from: "transparent" },
        visible: { type: "boolean", duration: 0 },
      },
    },
    hide: {
      animations: {
        colors: { to: "transparent" },
        visible: { type: "boolean", easing: "linear", fn: (i) => i | 0 },
      },
    },
  });
  var ii = class {
    constructor(t, e) {
      (this._chart = t), (this._properties = new Map()), this.configure(e);
    }
    configure(t) {
      if (!O(t)) return;
      let e = this._properties;
      Object.getOwnPropertyNames(t).forEach((n) => {
        let s = t[n];
        if (!O(s)) return;
        let o = {};
        for (let a of xr) o[a] = s[a];
        ((T(s.properties) && s.properties) || [n]).forEach((a) => {
          (a === n || !e.has(a)) && e.set(a, o);
        });
      });
    }
    _animateOptions(t, e) {
      let n = e.options,
        s = yr(t, n);
      if (!s) return [];
      let o = this._createAnimations(s, n);
      return (
        n.$shared &&
        _r(t.options.$animations, n).then(
          () => {
            t.options = n;
          },
          () => { }
        ),
        o
      );
    }
    _createAnimations(t, e) {
      let n = this._properties,
        s = [],
        o = t.$animations || (t.$animations = {}),
        a = Object.keys(e),
        r = Date.now(),
        l;
      for (l = a.length - 1; l >= 0; --l) {
        let c = a[l];
        if (c.charAt(0) === "$") continue;
        if (c === "options") {
          s.push(...this._animateOptions(t, e));
          continue;
        }
        let d = e[c],
          h = o[c],
          u = n.get(c);
        if (h)
          if (u && h.active()) {
            h.update(u, d, r);
            continue;
          } else h.cancel();
        if (!u || !u.duration) {
          t[c] = d;
          continue;
        }
        (o[c] = h = new Gs(u, t, c, d)), s.push(h);
      }
      return s;
    }
    update(t, e) {
      if (this._properties.size === 0) {
        Object.assign(t, e);
        return;
      }
      let n = this._createAnimations(t, e);
      if (n.length) return rt.add(this._chart, n), !0;
    }
  };
  function _r(i, t) {
    let e = [],
      n = Object.keys(t);
    for (let s = 0; s < n.length; s++) {
      let o = i[n[s]];
      o && o.active() && e.push(o.wait());
    }
    return Promise.all(e);
  }
  function yr(i, t) {
    if (!t) return;
    let e = i.options;
    if (!e) {
      i.options = t;
      return;
    }
    return (
      e.$shared &&
      (i.options = e =
        Object.assign({}, e, { $shared: !1, $animations: {} })),
      e
    );
  }
  function Zs(i, t) {
    let e = (i && i.options) || {},
      n = e.reverse,
      s = e.min === void 0 ? t : 0,
      o = e.max === void 0 ? t : 0;
    return { start: n ? o : s, end: n ? s : o };
  }
  function vr(i, t, e) {
    if (e === !1) return !1;
    let n = Zs(i, e),
      s = Zs(t, e);
    return { top: s.end, right: n.end, bottom: s.start, left: n.start };
  }
  function wr(i) {
    let t, e, n, s;
    return (
      O(i)
        ? ((t = i.top), (e = i.right), (n = i.bottom), (s = i.left))
        : (t = e = n = s = i),
      { top: t, right: e, bottom: n, left: s }
    );
  }
  function Js(i, t) {
    let e = [],
      n = i._getSortedDatasetMetas(t),
      s,
      o;
    for (s = 0, o = n.length; s < o; ++s) e.push(n[s].index);
    return e;
  }
  function Qs(i, t, e, n) {
    let s = i.keys,
      o = n.mode === "single",
      a,
      r,
      l,
      c;
    if (t !== null) {
      for (a = 0, r = s.length; a < r; ++a) {
        if (((l = +s[a]), l === e)) {
          if (n.all) continue;
          break;
        }
        (c = i.values[l]),
          B(c) && (o || t === 0 || at(t) === at(c)) && (t += c);
      }
      return t;
    }
  }
  function Sr(i) {
    let t = Object.keys(i),
      e = new Array(t.length),
      n,
      s,
      o;
    for (n = 0, s = t.length; n < s; ++n)
      (o = t[n]), (e[n] = { x: o, y: i[o] });
    return e;
  }
  function to(i, t) {
    let e = i && i.options.stacked;
    return e || (e === void 0 && t.stack !== void 0);
  }
  function Mr(i, t, e) {
    return `${i.id}.${t.id}.${e.stack || e.type}`;
  }
  function kr(i) {
    let { min: t, max: e, minDefined: n, maxDefined: s } = i.getUserBounds();
    return {
      min: n ? t : Number.NEGATIVE_INFINITY,
      max: s ? e : Number.POSITIVE_INFINITY,
    };
  }
  function Pr(i, t, e) {
    let n = i[t] || (i[t] = {});
    return n[e] || (n[e] = {});
  }
  function eo(i, t, e) {
    for (let n of t.getMatchingVisibleMetas("bar").reverse()) {
      let s = i[n.index];
      if ((e && s > 0) || (!e && s < 0)) return n.index;
    }
    return null;
  }
  function no(i, t) {
    let { chart: e, _cachedMeta: n } = i,
      s = e._stacks || (e._stacks = {}),
      { iScale: o, vScale: a, index: r } = n,
      l = o.axis,
      c = a.axis,
      d = Mr(o, a, n),
      h = t.length,
      u;
    for (let f = 0; f < h; ++f) {
      let g = t[f],
        { [l]: p, [c]: m } = g,
        b = g._stacks || (g._stacks = {});
      (u = b[c] = Pr(s, d, p)),
        (u[r] = m),
        (u._top = eo(u, a, !0)),
        (u._bottom = eo(u, a, !1));
    }
  }
  function si(i, t) {
    let e = i.scales;
    return Object.keys(e)
      .filter((n) => e[n].axis === t)
      .shift();
  }
  function Cr(i, t) {
    return Object.assign(Object.create(i), {
      active: !1,
      dataset: void 0,
      datasetIndex: t,
      index: t,
      mode: "default",
      type: "dataset",
    });
  }
  function Dr(i, t, e) {
    return Object.assign(Object.create(i), {
      active: !1,
      dataIndex: t,
      parsed: void 0,
      raw: void 0,
      element: e,
      index: t,
      mode: "default",
      type: "data",
    });
  }
  function Ke(i, t) {
    t = t || i._parsed;
    for (let e of t) {
      let n = e._stacks;
      if (!n || n[i.vScale.id] === void 0 || n[i.vScale.id][i.index] === void 0)
        return;
      delete n[i.vScale.id][i.index];
    }
  }
  var oi = (i) => i === "reset" || i === "none",
    io = (i, t) => (t ? i : Object.assign({}, i)),
    J = class {
      constructor(t, e) {
        (this.chart = t),
          (this._ctx = t.ctx),
          (this.index = e),
          (this._cachedDataOpts = {}),
          (this._cachedMeta = this.getMeta()),
          (this._type = this._cachedMeta.type),
          (this.options = void 0),
          (this._parsing = !1),
          (this._data = void 0),
          (this._objectData = void 0),
          (this._sharedOptions = void 0),
          (this._drawStart = void 0),
          (this._drawCount = void 0),
          (this.enableOptionSharing = !1),
          (this.$context = void 0),
          this.initialize();
      }
      initialize() {
        let t = this,
          e = t._cachedMeta;
        t.configure(),
          t.linkScales(),
          (e._stacked = to(e.vScale, e)),
          t.addElements();
      }
      updateIndex(t) {
        this.index = t;
      }
      linkScales() {
        let t = this,
          e = t.chart,
          n = t._cachedMeta,
          s = t.getDataset(),
          o = (u, f, g, p) => (u === "x" ? f : u === "r" ? p : g),
          a = (n.xAxisID = C(s.xAxisID, si(e, "x"))),
          r = (n.yAxisID = C(s.yAxisID, si(e, "y"))),
          l = (n.rAxisID = C(s.rAxisID, si(e, "r"))),
          c = n.indexAxis,
          d = (n.iAxisID = o(c, a, r, l)),
          h = (n.vAxisID = o(c, r, a, l));
        (n.xScale = t.getScaleForId(a)),
          (n.yScale = t.getScaleForId(r)),
          (n.rScale = t.getScaleForId(l)),
          (n.iScale = t.getScaleForId(d)),
          (n.vScale = t.getScaleForId(h));
      }
      getDataset() {
        return this.chart.data.datasets[this.index];
      }
      getMeta() {
        return this.chart.getDatasetMeta(this.index);
      }
      getScaleForId(t) {
        return this.chart.scales[t];
      }
      _getOtherScale(t) {
        let e = this._cachedMeta;
        return t === e.iScale ? e.vScale : e.iScale;
      }
      reset() {
        this._update("reset");
      }
      _destroy() {
        let t = this._cachedMeta;
        this._data && Kn(this._data, this), t._stacked && Ke(t);
      }
      _dataCheck() {
        let t = this,
          e = t.getDataset(),
          n = e.data || (e.data = []);
        O(n)
          ? (t._data = Sr(n))
          : t._data !== n &&
          (t._data && (Kn(t._data, t), Ke(t._cachedMeta)),
            n && Object.isExtensible(n) && Cs(n, t),
            (t._data = n));
      }
      addElements() {
        let t = this,
          e = t._cachedMeta;
        t._dataCheck(),
          t.datasetElementType && (e.dataset = new t.datasetElementType());
      }
      buildOrUpdateElements(t) {
        let e = this,
          n = e._cachedMeta,
          s = e.getDataset(),
          o = !1;
        e._dataCheck(),
          (n._stacked = to(n.vScale, n)),
          n.stack !== s.stack && ((o = !0), Ke(n), (n.stack = s.stack)),
          e._resyncElements(t),
          o && no(e, n._parsed);
      }
      configure() {
        let t = this,
          e = t.chart.config,
          n = e.datasetScopeKeys(t._type),
          s = e.getOptionScopes(t.getDataset(), n, !0);
        (t.options = e.createResolver(s, t.getContext())),
          (t._parsing = t.options.parsing);
      }
      parse(t, e) {
        let n = this,
          { _cachedMeta: s, _data: o } = n,
          { iScale: a, _stacked: r } = s,
          l = a.axis,
          c = t === 0 && e === o.length ? !0 : s._sorted,
          d = t > 0 && s._parsed[t - 1],
          h,
          u,
          f;
        if (n._parsing === !1) (s._parsed = o), (s._sorted = !0), (f = o);
        else {
          T(o[t])
            ? (f = n.parseArrayData(s, o, t, e))
            : O(o[t])
              ? (f = n.parseObjectData(s, o, t, e))
              : (f = n.parsePrimitiveData(s, o, t, e));
          let g = () => u[l] === null || (d && u[l] < d[l]);
          for (h = 0; h < e; ++h)
            (s._parsed[h + t] = u = f[h]), c && (g() && (c = !1), (d = u));
          s._sorted = c;
        }
        r && no(n, f);
      }
      parsePrimitiveData(t, e, n, s) {
        let { iScale: o, vScale: a } = t,
          r = o.axis,
          l = a.axis,
          c = o.getLabels(),
          d = o === a,
          h = new Array(s),
          u,
          f,
          g;
        for (u = 0, f = s; u < f; ++u)
          (g = u + n),
            (h[u] = { [r]: d || o.parse(c[g], g), [l]: a.parse(e[g], g) });
        return h;
      }
      parseArrayData(t, e, n, s) {
        let { xScale: o, yScale: a } = t,
          r = new Array(s),
          l,
          c,
          d,
          h;
        for (l = 0, c = s; l < c; ++l)
          (d = l + n),
            (h = e[d]),
            (r[l] = { x: o.parse(h[0], d), y: a.parse(h[1], d) });
        return r;
      }
      parseObjectData(t, e, n, s) {
        let { xScale: o, yScale: a } = t,
          { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing,
          c = new Array(s),
          d,
          h,
          u,
          f;
        for (d = 0, h = s; d < h; ++d)
          (u = d + n),
            (f = e[u]),
            (c[d] = { x: o.parse(ot(f, r), u), y: a.parse(ot(f, l), u) });
        return c;
      }
      getParsed(t) {
        return this._cachedMeta._parsed[t];
      }
      getDataElement(t) {
        return this._cachedMeta.data[t];
      }
      applyStack(t, e, n) {
        let s = this.chart,
          o = this._cachedMeta,
          a = e[t.axis],
          r = { keys: Js(s, !0), values: e._stacks[t.axis] };
        return Qs(r, a, o.index, { mode: n });
      }
      updateRangeFromParsed(t, e, n, s) {
        let o = n[e.axis],
          a = o === null ? NaN : o,
          r = s && n._stacks[e.axis];
        s &&
          r &&
          ((s.values = r),
            (t.min = Math.min(t.min, a)),
            (t.max = Math.max(t.max, a)),
            (a = Qs(s, o, this._cachedMeta.index, { all: !0 }))),
          (t.min = Math.min(t.min, a)),
          (t.max = Math.max(t.max, a));
      }
      getMinMax(t, e) {
        let n = this,
          s = n._cachedMeta,
          o = s._parsed,
          a = s._sorted && t === s.iScale,
          r = o.length,
          l = n._getOtherScale(t),
          c = e && s._stacked && { keys: Js(n.chart, !0), values: null },
          d = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
          { min: h, max: u } = kr(l),
          f,
          g,
          p,
          m;
        function b() {
          return (
            (p = o[f]),
            (g = p[t.axis]),
            (m = p[l.axis]),
            !B(g) || h > m || u < m
          );
        }
        for (
          f = 0;
          f < r && !(!b() && (n.updateRangeFromParsed(d, t, p, c), a));
          ++f
        );
        if (a) {
          for (f = r - 1; f >= 0; --f)
            if (!b()) {
              n.updateRangeFromParsed(d, t, p, c);
              break;
            }
        }
        return d;
      }
      getAllParsedValues(t) {
        let e = this._cachedMeta._parsed,
          n = [],
          s,
          o,
          a;
        for (s = 0, o = e.length; s < o; ++s)
          (a = e[s][t.axis]), B(a) && n.push(a);
        return n;
      }
      getMaxOverflow() {
        return !1;
      }
      getLabelAndValue(t) {
        let e = this,
          n = e._cachedMeta,
          s = n.iScale,
          o = n.vScale,
          a = e.getParsed(t);
        return {
          label: s ? "" + s.getLabelForValue(a[s.axis]) : "",
          value: o ? "" + o.getLabelForValue(a[o.axis]) : "",
        };
      }
      _update(t) {
        let e = this,
          n = e._cachedMeta;
        e.configure(),
          (e._cachedDataOpts = {}),
          e.update(t || "default"),
          (n._clip = wr(
            C(e.options.clip, vr(n.xScale, n.yScale, e.getMaxOverflow()))
          ));
      }
      update(t) { }
      draw() {
        let t = this,
          e = t._ctx,
          n = t.chart,
          s = t._cachedMeta,
          o = s.data || [],
          a = n.chartArea,
          r = [],
          l = t._drawStart || 0,
          c = t._drawCount || o.length - l,
          d;
        for (s.dataset && s.dataset.draw(e, a, l, c), d = l; d < l + c; ++d) {
          let h = o[d];
          h.active ? r.push(h) : h.draw(e, a);
        }
        for (d = 0; d < r.length; ++d) r[d].draw(e, a);
      }
      getStyle(t, e) {
        let n = e ? "active" : "default";
        return t === void 0 && this._cachedMeta.dataset
          ? this.resolveDatasetElementOptions(n)
          : this.resolveDataElementOptions(t || 0, n);
      }
      getContext(t, e, n) {
        let s = this,
          o = s.getDataset(),
          a;
        if (t >= 0 && t < s._cachedMeta.data.length) {
          let r = s._cachedMeta.data[t];
          (a = r.$context || (r.$context = Dr(s.getContext(), t, r))),
            (a.parsed = s.getParsed(t)),
            (a.raw = o.data[t]);
        } else
          (a = s.$context || (s.$context = Cr(s.chart.getContext(), s.index))),
            (a.dataset = o);
        return (a.active = !!e), (a.mode = n), a;
      }
      resolveDatasetElementOptions(t) {
        return this._resolveElementOptions(this.datasetElementType.id, t);
      }
      resolveDataElementOptions(t, e) {
        return this._resolveElementOptions(this.dataElementType.id, e, t);
      }
      _resolveElementOptions(t, e = "default", n) {
        let s = this,
          o = e === "active",
          a = s._cachedDataOpts,
          r = t + "-" + e,
          l = a[r],
          c = s.enableOptionSharing && q(n);
        if (l) return io(l, c);
        let d = s.chart.config,
          h = d.datasetElementScopeKeys(s._type, t),
          u = o ? [`${t}Hover`, "hover", t, ""] : [t, ""],
          f = d.getOptionScopes(s.getDataset(), h),
          g = Object.keys(k.elements[t]),
          p = () => s.getContext(n, o),
          m = d.resolveNamedOptions(f, g, p, u);
        return (
          m.$shared && ((m.$shared = c), (a[r] = Object.freeze(io(m, c)))), m
        );
      }
      _resolveAnimations(t, e, n) {
        let s = this,
          o = s.chart,
          a = s._cachedDataOpts,
          r = `animation-${e}`,
          l = a[r];
        if (l) return l;
        let c;
        if (o.options.animation !== !1) {
          let h = s.chart.config,
            u = h.datasetAnimationScopeKeys(s._type, e),
            f = h.getOptionScopes(s.getDataset(), u);
          c = h.createResolver(f, s.getContext(t, n, e));
        }
        let d = new ii(o, c && c.animations);
        return c && c._cacheable && (a[r] = Object.freeze(d)), d;
      }
      getSharedOptions(t) {
        if (!!t.$shared)
          return (
            this._sharedOptions || (this._sharedOptions = Object.assign({}, t))
          );
      }
      includeOptions(t, e) {
        return !e || oi(t) || this.chart._animationsDisabled;
      }
      updateElement(t, e, n, s) {
        oi(s)
          ? Object.assign(t, n)
          : this._resolveAnimations(e, s).update(t, n);
      }
      updateSharedOptions(t, e, n) {
        t && !oi(e) && this._resolveAnimations(void 0, e).update(t, n);
      }
      _setStyle(t, e, n, s) {
        t.active = s;
        let o = this.getStyle(e, s);
        this._resolveAnimations(e, n, s).update(t, {
          options: (!s && this.getSharedOptions(o)) || o,
        });
      }
      removeHoverStyle(t, e, n) {
        this._setStyle(t, n, "active", !1);
      }
      setHoverStyle(t, e, n) {
        this._setStyle(t, n, "active", !0);
      }
      _removeDatasetHoverStyle() {
        let t = this._cachedMeta.dataset;
        t && this._setStyle(t, void 0, "active", !1);
      }
      _setDatasetHoverStyle() {
        let t = this._cachedMeta.dataset;
        t && this._setStyle(t, void 0, "active", !0);
      }
      _resyncElements(t) {
        let e = this,
          n = e._cachedMeta.data.length,
          s = e._data.length;
        s > n
          ? e._insertElements(n, s - n, t)
          : s < n && e._removeElements(s, n - s);
        let o = Math.min(s, n);
        o && e.parse(0, o);
      }
      _insertElements(t, e, n = !0) {
        let s = this,
          o = s._cachedMeta,
          a = o.data,
          r = t + e,
          l,
          c = (d) => {
            for (d.length += e, l = d.length - 1; l >= r; l--) d[l] = d[l - e];
          };
        for (c(a), l = t; l < r; ++l) a[l] = new s.dataElementType();
        s._parsing && c(o._parsed),
          s.parse(t, e),
          n && s.updateElements(a, t, e, "reset");
      }
      updateElements(t, e, n, s) { }
      _removeElements(t, e) {
        let n = this,
          s = n._cachedMeta;
        if (n._parsing) {
          let o = s._parsed.splice(t, e);
          s._stacked && Ke(s, o);
        }
        s.data.splice(t, e);
      }
      _onDataPush() {
        let t = arguments.length;
        this._insertElements(this.getDataset().data.length - t, t);
      }
      _onDataPop() {
        this._removeElements(this._cachedMeta.data.length - 1, 1);
      }
      _onDataShift() {
        this._removeElements(0, 1);
      }
      _onDataSplice(t, e) {
        this._removeElements(t, e),
          this._insertElements(t, arguments.length - 2);
      }
      _onDataUnshift() {
        this._insertElements(0, arguments.length);
      }
    };
  J.defaults = {};
  J.prototype.datasetElementType = null;
  J.prototype.dataElementType = null;
  function Or(i) {
    if (!i._cache.$bar) {
      let t = i.getMatchingVisibleMetas("bar"),
        e = [];
      for (let n = 0, s = t.length; n < s; n++)
        e = e.concat(t[n].controller.getAllParsedValues(i));
      i._cache.$bar = Gn(e.sort((n, s) => n - s));
    }
    return i._cache.$bar;
  }
  function Ar(i) {
    let t = Or(i),
      e = i._length,
      n,
      s,
      o,
      a,
      r = () => {
        o === 32767 ||
          o === -32768 ||
          (q(a) && (e = Math.min(e, Math.abs(o - a) || e)), (a = o));
      };
    for (n = 0, s = t.length; n < s; ++n) (o = i.getPixelForValue(t[n])), r();
    for (a = void 0, n = 0, s = i.ticks.length; n < s; ++n)
      (o = i.getPixelForTick(n)), r();
    return e;
  }
  function Tr(i, t, e, n) {
    let s = e.barThickness,
      o,
      a;
    return (
      P(s)
        ? ((o = t.min * e.categoryPercentage), (a = e.barPercentage))
        : ((o = s * n), (a = 1)),
      { chunk: o / n, ratio: a, start: t.pixels[i] - o / 2 }
    );
  }
  function Rr(i, t, e, n) {
    let s = t.pixels,
      o = s[i],
      a = i > 0 ? s[i - 1] : null,
      r = i < s.length - 1 ? s[i + 1] : null,
      l = e.categoryPercentage;
    a === null && (a = o - (r === null ? t.end - t.start : r - o)),
      r === null && (r = o + o - a);
    let c = o - ((o - Math.min(a, r)) / 2) * l;
    return {
      chunk: ((Math.abs(r - a) / 2) * l) / n,
      ratio: e.barPercentage,
      start: c,
    };
  }
  function Lr(i, t, e, n) {
    let s = e.parse(i[0], n),
      o = e.parse(i[1], n),
      a = Math.min(s, o),
      r = Math.max(s, o),
      l = a,
      c = r;
    Math.abs(a) > Math.abs(r) && ((l = r), (c = a)),
      (t[e.axis] = c),
      (t._custom = {
        barStart: l,
        barEnd: c,
        start: s,
        end: o,
        min: a,
        max: r,
      });
  }
  function so(i, t, e, n) {
    return T(i) ? Lr(i, t, e, n) : (t[e.axis] = e.parse(i, n)), t;
  }
  function oo(i, t, e, n) {
    let s = i.iScale,
      o = i.vScale,
      a = s.getLabels(),
      r = s === o,
      l = [],
      c,
      d,
      h,
      u;
    for (c = e, d = e + n; c < d; ++c)
      (u = t[c]),
        (h = {}),
        (h[s.axis] = r || s.parse(a[c], c)),
        l.push(so(u, h, o, c));
    return l;
  }
  function ai(i) {
    return i && i.barStart !== void 0 && i.barEnd !== void 0;
  }
  var Ge = class extends J {
    parsePrimitiveData(t, e, n, s) {
      return oo(t, e, n, s);
    }
    parseArrayData(t, e, n, s) {
      return oo(t, e, n, s);
    }
    parseObjectData(t, e, n, s) {
      let { iScale: o, vScale: a } = t,
        { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing,
        c = o.axis === "x" ? r : l,
        d = a.axis === "x" ? r : l,
        h = [],
        u,
        f,
        g,
        p;
      for (u = n, f = n + s; u < f; ++u)
        (p = e[u]),
          (g = {}),
          (g[o.axis] = o.parse(ot(p, c), u)),
          h.push(so(ot(p, d), g, a, u));
      return h;
    }
    updateRangeFromParsed(t, e, n, s) {
      super.updateRangeFromParsed(t, e, n, s);
      let o = n._custom;
      o &&
        e === this._cachedMeta.vScale &&
        ((t.min = Math.min(t.min, o.min)), (t.max = Math.max(t.max, o.max)));
    }
    getLabelAndValue(t) {
      let e = this,
        n = e._cachedMeta,
        { iScale: s, vScale: o } = n,
        a = e.getParsed(t),
        r = a._custom,
        l = ai(r)
          ? "[" + r.start + ", " + r.end + "]"
          : "" + o.getLabelForValue(a[o.axis]);
      return { label: "" + s.getLabelForValue(a[s.axis]), value: l };
    }
    initialize() {
      let t = this;
      (t.enableOptionSharing = !0), super.initialize();
      let e = t._cachedMeta;
      e.stack = t.getDataset().stack;
    }
    update(t) {
      let e = this,
        n = e._cachedMeta;
      e.updateElements(n.data, 0, n.data.length, t);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = s === "reset",
        r = o._cachedMeta.vScale,
        l = r.getBasePixel(),
        c = r.isHorizontal(),
        d = o._getRuler(),
        h = o.resolveDataElementOptions(e, s),
        u = o.getSharedOptions(h),
        f = o.includeOptions(s, u);
      o.updateSharedOptions(u, s, h);
      for (let g = e; g < e + n; g++) {
        let p = o.getParsed(g),
          m =
            a || P(p[r.axis])
              ? { base: l, head: l }
              : o._calculateBarValuePixels(g),
          b = o._calculateBarIndexPixels(g, d),
          _ = (p._stacks || {})[r.axis],
          y = {
            horizontal: c,
            base: m.base,
            enableBorderRadius:
              !_ ||
              ai(p._custom) ||
              o.index === _._top ||
              o.index === _._bottom,
            x: c ? m.head : b.center,
            y: c ? b.center : m.head,
            height: c ? b.size : void 0,
            width: c ? void 0 : b.size,
          };
        f && (y.options = u || o.resolveDataElementOptions(g, s)),
          o.updateElement(t[g], g, y, s);
      }
    }
    _getStacks(t, e) {
      let n = this,
        o = n._cachedMeta.iScale,
        a = o.getMatchingVisibleMetas(n._type),
        r = o.options.stacked,
        l = a.length,
        c = [],
        d,
        h;
      for (d = 0; d < l; ++d) {
        if (((h = a[d]), typeof e != "undefined")) {
          let u =
            h.controller.getParsed(e)[h.controller._cachedMeta.vScale.axis];
          if (P(u) || isNaN(u)) continue;
        }
        if (
          ((r === !1 ||
            c.indexOf(h.stack) === -1 ||
            (r === void 0 && h.stack === void 0)) &&
            c.push(h.stack),
            h.index === t)
        )
          break;
      }
      return c.length || c.push(void 0), c;
    }
    _getStackCount(t) {
      return this._getStacks(void 0, t).length;
    }
    _getStackIndex(t, e, n) {
      let s = this._getStacks(t, n),
        o = e !== void 0 ? s.indexOf(e) : -1;
      return o === -1 ? s.length - 1 : o;
    }
    _getRuler() {
      let t = this,
        e = t.options,
        n = t._cachedMeta,
        s = n.iScale,
        o = [],
        a,
        r;
      for (a = 0, r = n.data.length; a < r; ++a)
        o.push(s.getPixelForValue(t.getParsed(a)[s.axis], a));
      let l = e.barThickness;
      return {
        min: l || Ar(s),
        pixels: o,
        start: s._startPixel,
        end: s._endPixel,
        stackCount: t._getStackCount(),
        scale: s,
        grouped: e.grouped,
        ratio: l ? 1 : e.categoryPercentage * e.barPercentage,
      };
    }
    _calculateBarValuePixels(t) {
      let e = this,
        { vScale: n, _stacked: s } = e._cachedMeta,
        { base: o, minBarLength: a } = e.options,
        r = e.getParsed(t),
        l = r._custom,
        c = ai(l),
        d = r[n.axis],
        h = 0,
        u = s ? e.applyStack(n, r, s) : d,
        f,
        g;
      u !== d && ((h = u - d), (u = d)),
        c &&
        ((d = l.barStart),
          (u = l.barEnd - l.barStart),
          d !== 0 && at(d) !== at(l.barEnd) && (h = 0),
          (h += d));
      let p = !P(o) && !c ? o : h,
        m = n.getPixelForValue(p);
      this.chart.getDataVisibility(t)
        ? (f = n.getPixelForValue(h + u))
        : (f = m),
        (g = f - m),
        a !== void 0 &&
        Math.abs(g) < a &&
        ((g = g < 0 ? -a : a), d === 0 && (m -= g / 2), (f = m + g));
      let b = o || 0;
      if (m === n.getPixelForValue(b)) {
        let _ = n.getLineWidthForValue(b) / 2;
        g > 0 ? ((m += _), (g -= _)) : g < 0 && ((m -= _), (g += _));
      }
      return { size: g, base: m, head: f, center: f + g / 2 };
    }
    _calculateBarIndexPixels(t, e) {
      let n = this,
        s = e.scale,
        o = n.options,
        a = o.skipNull,
        r = C(o.maxBarThickness, Infinity),
        l,
        c;
      if (e.grouped) {
        let d = a ? n._getStackCount(t) : e.stackCount,
          h = o.barThickness === "flex" ? Rr(t, e, o, d) : Tr(t, e, o, d),
          u = n._getStackIndex(n.index, n._cachedMeta.stack, a ? t : void 0);
        (l = h.start + h.chunk * u + h.chunk / 2),
          (c = Math.min(r, h.chunk * h.ratio));
      } else
        (l = s.getPixelForValue(n.getParsed(t)[s.axis], t)),
          (c = Math.min(r, e.min * e.ratio));
      return { base: l - c / 2, head: l + c / 2, center: l, size: c };
    }
    draw() {
      let t = this,
        e = t.chart,
        n = t._cachedMeta,
        s = n.vScale,
        o = n.data,
        a = o.length,
        r = 0;
      for (Ve(e.ctx, e.chartArea); r < a; ++r)
        t.getParsed(r)[s.axis] !== null && o[r].draw(t._ctx);
      We(e.ctx);
    }
  };
  Ge.id = "bar";
  Ge.defaults = {
    datasetElementType: !1,
    dataElementType: "bar",
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: !0,
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "base", "width", "height"],
      },
    },
  };
  Ge.overrides = {
    interaction: { mode: "index" },
    scales: {
      _index_: { type: "category", offset: !0, grid: { offset: !0 } },
      _value_: { type: "linear", beginAtZero: !0 },
    },
  };
  var Ze = class extends J {
    initialize() {
      (this.enableOptionSharing = !0), super.initialize();
    }
    parseObjectData(t, e, n, s) {
      let { xScale: o, yScale: a } = t,
        { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing,
        c = [],
        d,
        h,
        u;
      for (d = n, h = n + s; d < h; ++d)
        (u = e[d]),
          c.push({
            x: o.parse(ot(u, r), d),
            y: a.parse(ot(u, l), d),
            _custom: u && u.r && +u.r,
          });
      return c;
    }
    getMaxOverflow() {
      let { data: t, _parsed: e } = this._cachedMeta,
        n = 0;
      for (let s = t.length - 1; s >= 0; --s)
        n = Math.max(n, t[s].size() / 2, e[s]._custom);
      return n > 0 && n;
    }
    getLabelAndValue(t) {
      let e = this,
        n = e._cachedMeta,
        { xScale: s, yScale: o } = n,
        a = e.getParsed(t),
        r = s.getLabelForValue(a.x),
        l = o.getLabelForValue(a.y),
        c = a._custom;
      return {
        label: n.label,
        value: "(" + r + ", " + l + (c ? ", " + c : "") + ")",
      };
    }
    update(t) {
      let e = this,
        n = e._cachedMeta.data;
      e.updateElements(n, 0, n.length, t);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = s === "reset",
        { xScale: r, yScale: l } = o._cachedMeta,
        c = o.resolveDataElementOptions(e, s),
        d = o.getSharedOptions(c),
        h = o.includeOptions(s, d);
      for (let u = e; u < e + n; u++) {
        let f = t[u],
          g = !a && o.getParsed(u),
          p = a ? r.getPixelForDecimal(0.5) : r.getPixelForValue(g.x),
          m = a ? l.getBasePixel() : l.getPixelForValue(g.y),
          b = { x: p, y: m, skip: isNaN(p) || isNaN(m) };
        h &&
          ((b.options = o.resolveDataElementOptions(u, s)),
            a && (b.options.radius = 0)),
          o.updateElement(f, u, b, s);
      }
      o.updateSharedOptions(d, s, c);
    }
    resolveDataElementOptions(t, e) {
      let n = this.getParsed(t),
        s = super.resolveDataElementOptions(t, e);
      s.$shared && (s = Object.assign({}, s, { $shared: !1 }));
      let o = s.radius;
      return (
        e !== "active" && (s.radius = 0), (s.radius += C(n && n._custom, o)), s
      );
    }
  };
  Ze.id = "bubble";
  Ze.defaults = {
    datasetElementType: !1,
    dataElementType: "point",
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "borderWidth", "radius"],
      },
    },
  };
  Ze.overrides = {
    scales: { x: { type: "linear" }, y: { type: "linear" } },
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
        },
      },
    },
  };
  function Er(i, t, e) {
    let n = 1,
      s = 1,
      o = 0,
      a = 0;
    if (t < A) {
      let r = i,
        l = r + t,
        c = Math.cos(r),
        d = Math.sin(r),
        h = Math.cos(l),
        u = Math.sin(l),
        f = (y, x, v) => (Zt(y, r, l) ? 1 : Math.max(x, x * e, v, v * e)),
        g = (y, x, v) => (Zt(y, r, l) ? -1 : Math.min(x, x * e, v, v * e)),
        p = f(0, c, h),
        m = f(L, d, u),
        b = g(I, c, h),
        _ = g(I + L, d, u);
      (n = (p - b) / 2),
        (s = (m - _) / 2),
        (o = -(p + b) / 2),
        (a = -(m + _) / 2);
    }
    return { ratioX: n, ratioY: s, offsetX: o, offsetY: a };
  }
  var le = class extends J {
    constructor(t, e) {
      super(t, e);
      (this.enableOptionSharing = !0),
        (this.innerRadius = void 0),
        (this.outerRadius = void 0),
        (this.offsetX = void 0),
        (this.offsetY = void 0);
    }
    linkScales() { }
    parse(t, e) {
      let n = this.getDataset().data,
        s = this._cachedMeta,
        o,
        a;
      for (o = t, a = t + e; o < a; ++o) s._parsed[o] = +n[o];
    }
    _getRotation() {
      return Q(this.options.rotation - 90);
    }
    _getCircumference() {
      return Q(this.options.circumference);
    }
    _getRotationExtents() {
      let t = A,
        e = -A,
        n = this;
      for (let s = 0; s < n.chart.data.datasets.length; ++s)
        if (n.chart.isDatasetVisible(s)) {
          let o = n.chart.getDatasetMeta(s).controller,
            a = o._getRotation(),
            r = o._getCircumference();
          (t = Math.min(t, a)), (e = Math.max(e, a + r));
        }
      return { rotation: t, circumference: e - t };
    }
    update(t) {
      let e = this,
        n = e.chart,
        { chartArea: s } = n,
        o = e._cachedMeta,
        a = o.data,
        r = e.getMaxBorderWidth() + e.getMaxOffset(a),
        l = Math.max((Math.min(s.width, s.height) - r) / 2, 0),
        c = Math.min(Ji(e.options.cutout, l), 1),
        d = e._getRingWeight(e.index),
        { circumference: h, rotation: u } = e._getRotationExtents(),
        { ratioX: f, ratioY: g, offsetX: p, offsetY: m } = Er(u, h, c),
        b = (s.width - r) / f,
        _ = (s.height - r) / g,
        y = Math.max(Math.min(b, _) / 2, 0),
        x = Ce(e.options.radius, y),
        v = Math.max(x * c, 0),
        w = (x - v) / e._getVisibleDatasetWeightTotal();
      (e.offsetX = p * x),
        (e.offsetY = m * x),
        (o.total = e.calculateTotal()),
        (e.outerRadius = x - w * e._getRingWeightOffset(e.index)),
        (e.innerRadius = Math.max(e.outerRadius - w * d, 0)),
        e.updateElements(a, 0, a.length, t);
    }
    _circumference(t, e) {
      let n = this,
        s = n.options,
        o = n._cachedMeta,
        a = n._getCircumference();
      return (e && s.animation.animateRotate) ||
        !this.chart.getDataVisibility(t) ||
        o._parsed[t] === null
        ? 0
        : n.calculateCircumference((o._parsed[t] * a) / A);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = s === "reset",
        r = o.chart,
        l = r.chartArea,
        d = r.options.animation,
        h = (l.left + l.right) / 2,
        u = (l.top + l.bottom) / 2,
        f = a && d.animateScale,
        g = f ? 0 : o.innerRadius,
        p = f ? 0 : o.outerRadius,
        m = o.resolveDataElementOptions(e, s),
        b = o.getSharedOptions(m),
        _ = o.includeOptions(s, b),
        y = o._getRotation(),
        x;
      for (x = 0; x < e; ++x) y += o._circumference(x, a);
      for (x = e; x < e + n; ++x) {
        let v = o._circumference(x, a),
          w = t[x],
          S = {
            x: h + o.offsetX,
            y: u + o.offsetY,
            startAngle: y,
            endAngle: y + v,
            circumference: v,
            outerRadius: p,
            innerRadius: g,
          };
        _ && (S.options = b || o.resolveDataElementOptions(x, s)),
          (y += v),
          o.updateElement(w, x, S, s);
      }
      o.updateSharedOptions(b, s, m);
    }
    calculateTotal() {
      let t = this._cachedMeta,
        e = t.data,
        n = 0,
        s;
      for (s = 0; s < e.length; s++) {
        let o = t._parsed[s];
        o !== null &&
          !isNaN(o) &&
          this.chart.getDataVisibility(s) &&
          (n += Math.abs(o));
      }
      return n;
    }
    calculateCircumference(t) {
      let e = this._cachedMeta.total;
      return e > 0 && !isNaN(t) ? A * (Math.abs(t) / e) : 0;
    }
    getLabelAndValue(t) {
      let e = this,
        n = e._cachedMeta,
        s = e.chart,
        o = s.data.labels || [],
        a = re(n._parsed[t], s.options.locale);
      return { label: o[t] || "", value: a };
    }
    getMaxBorderWidth(t) {
      let e = this,
        n = 0,
        s = e.chart,
        o,
        a,
        r,
        l,
        c;
      if (!t) {
        for (o = 0, a = s.data.datasets.length; o < a; ++o)
          if (s.isDatasetVisible(o)) {
            (r = s.getDatasetMeta(o)),
              (t = r.data),
              (l = r.controller),
              l !== e && l.configure();
            break;
          }
      }
      if (!t) return 0;
      for (o = 0, a = t.length; o < a; ++o)
        (c = l.resolveDataElementOptions(o)),
          c.borderAlign !== "inner" &&
          (n = Math.max(n, c.borderWidth || 0, c.hoverBorderWidth || 0));
      return n;
    }
    getMaxOffset(t) {
      let e = 0;
      for (let n = 0, s = t.length; n < s; ++n) {
        let o = this.resolveDataElementOptions(n);
        e = Math.max(e, o.offset || 0, o.hoverOffset || 0);
      }
      return e;
    }
    _getRingWeightOffset(t) {
      let e = 0;
      for (let n = 0; n < t; ++n)
        this.chart.isDatasetVisible(n) && (e += this._getRingWeight(n));
      return e;
    }
    _getRingWeight(t) {
      return Math.max(C(this.chart.data.datasets[t].weight, 1), 0);
    }
    _getVisibleDatasetWeightTotal() {
      return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
    }
  };
  le.id = "doughnut";
  le.defaults = {
    datasetElementType: !1,
    dataElementType: "arc",
    animation: { animateRotate: !0, animateScale: !1 },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "circumference",
          "endAngle",
          "innerRadius",
          "outerRadius",
          "startAngle",
          "x",
          "y",
          "offset",
          "borderWidth",
        ],
      },
    },
    cutout: "50%",
    rotation: 0,
    circumference: 360,
    radius: "100%",
    indexAxis: "r",
  };
  le.overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(i) {
            let t = i.data;
            return t.labels.length && t.datasets.length
              ? t.labels.map((e, n) => {
                let o = i.getDatasetMeta(0).controller.getStyle(n);
                return {
                  text: e,
                  fillStyle: o.backgroundColor,
                  strokeStyle: o.borderColor,
                  lineWidth: o.borderWidth,
                  hidden: !i.getDataVisibility(n),
                  index: n,
                };
              })
              : [];
          },
        },
        onClick(i, t, e) {
          e.chart.toggleDataVisibility(t.index), e.chart.update();
        },
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(i) {
            let t = i.label,
              e = ": " + i.formattedValue;
            return T(t) ? ((t = t.slice()), (t[0] += e)) : (t += e), t;
          },
        },
      },
    },
  };
  var Ct = class extends J {
    initialize() {
      (this.enableOptionSharing = !0), super.initialize();
    }
    update(t) {
      let e = this,
        n = e._cachedMeta,
        { dataset: s, data: o = [], _dataset: a } = n,
        r = e.chart._animationsDisabled,
        { start: l, count: c } = Fr(n, o, r);
      (e._drawStart = l),
        (e._drawCount = c),
        zr(n) && ((l = 0), (c = o.length)),
        (s._decimated = !!a._decimated),
        (s.points = o);
      let d = e.resolveDatasetElementOptions(t);
      e.options.showLine || (d.borderWidth = 0),
        (d.segment = e.options.segment),
        e.updateElement(s, void 0, { animated: !r, options: d }, t),
        e.updateElements(o, l, c, t);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = s === "reset",
        { xScale: r, yScale: l, _stacked: c } = o._cachedMeta,
        d = o.resolveDataElementOptions(e, s),
        h = o.getSharedOptions(d),
        u = o.includeOptions(s, h),
        f = o.options.spanGaps,
        g = Mt(f) ? f : Number.POSITIVE_INFINITY,
        p = o.chart._animationsDisabled || a || s === "none",
        m = e > 0 && o.getParsed(e - 1);
      for (let b = e; b < e + n; ++b) {
        let _ = t[b],
          y = o.getParsed(b),
          x = p ? _ : {},
          v = P(y.y),
          w = (x.x = r.getPixelForValue(y.x, b)),
          S = (x.y =
            a || v
              ? l.getBasePixel()
              : l.getPixelForValue(c ? o.applyStack(l, y, c) : y.y, b));
        (x.skip = isNaN(w) || isNaN(S) || v),
          (x.stop = b > 0 && y.x - m.x > g),
          (x.parsed = y),
          u && (x.options = h || o.resolveDataElementOptions(b, s)),
          p || o.updateElement(_, b, x, s),
          (m = y);
      }
      o.updateSharedOptions(h, s, d);
    }
    getMaxOverflow() {
      let t = this,
        e = t._cachedMeta,
        n = e.dataset,
        s = (n.options && n.options.borderWidth) || 0,
        o = e.data || [];
      if (!o.length) return s;
      let a = o[0].size(t.resolveDataElementOptions(0)),
        r = o[o.length - 1].size(t.resolveDataElementOptions(o.length - 1));
      return Math.max(s, a, r) / 2;
    }
    draw() {
      this._cachedMeta.dataset.updateControlPoints(this.chart.chartArea),
        super.draw();
    }
  };
  Ct.id = "line";
  Ct.defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: !0,
    spanGaps: !1,
  };
  Ct.overrides = {
    scales: { _index_: { type: "category" }, _value_: { type: "linear" } },
  };
  function Fr(i, t, e) {
    let n = t.length,
      s = 0,
      o = n;
    if (i._sorted) {
      let { iScale: a, _parsed: r } = i,
        l = a.axis,
        { min: c, max: d, minDefined: h, maxDefined: u } = a.getUserBounds();
      h &&
        (s = X(
          Math.min(
            Vt(r, a.axis, c).lo,
            e ? n : Vt(t, l, a.getPixelForValue(c)).lo
          ),
          0,
          n - 1
        )),
        u
          ? (o =
            X(
              Math.max(
                Vt(r, a.axis, d).hi + 1,
                e ? 0 : Vt(t, l, a.getPixelForValue(d)).hi + 1
              ),
              s,
              n
            ) - s)
          : (o = n - s);
    }
    return { start: s, count: o };
  }
  function zr(i) {
    let { xScale: t, yScale: e, _scaleRanges: n } = i,
      s = { xmin: t.min, xmax: t.max, ymin: e.min, ymax: e.max };
    if (!n) return (i._scaleRanges = s), !0;
    let o =
      n.xmin !== t.min ||
      n.xmax !== t.max ||
      n.ymin !== e.min ||
      n.ymax !== e.max;
    return Object.assign(n, s), o;
  }
  var Je = class extends J {
    constructor(t, e) {
      super(t, e);
      (this.innerRadius = void 0), (this.outerRadius = void 0);
    }
    update(t) {
      let e = this._cachedMeta.data;
      this._updateRadius(), this.updateElements(e, 0, e.length, t);
    }
    _updateRadius() {
      let t = this,
        e = t.chart,
        n = e.chartArea,
        s = e.options,
        o = Math.min(n.right - n.left, n.bottom - n.top),
        a = Math.max(o / 2, 0),
        r = Math.max(
          s.cutoutPercentage ? (a / 100) * s.cutoutPercentage : 1,
          0
        ),
        l = (a - r) / e.getVisibleDatasetCount();
      (t.outerRadius = a - l * t.index), (t.innerRadius = t.outerRadius - l);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = s === "reset",
        r = o.chart,
        l = o.getDataset(),
        d = r.options.animation,
        h = o._cachedMeta.rScale,
        u = h.xCenter,
        f = h.yCenter,
        g = h.getIndexAngle(0) - 0.5 * I,
        p = g,
        m,
        b = 360 / o.countVisibleElements();
      for (m = 0; m < e; ++m) p += o._computeAngle(m, s, b);
      for (m = e; m < e + n; m++) {
        let _ = t[m],
          y = p,
          x = p + o._computeAngle(m, s, b),
          v = r.getDataVisibility(m)
            ? h.getDistanceFromCenterForValue(l.data[m])
            : 0;
        (p = x),
          a && (d.animateScale && (v = 0), d.animateRotate && (y = x = g));
        let w = {
          x: u,
          y: f,
          innerRadius: 0,
          outerRadius: v,
          startAngle: y,
          endAngle: x,
          options: o.resolveDataElementOptions(m, s),
        };
        o.updateElement(_, m, w, s);
      }
    }
    countVisibleElements() {
      let t = this.getDataset(),
        e = this._cachedMeta,
        n = 0;
      return (
        e.data.forEach((s, o) => {
          !isNaN(t.data[o]) && this.chart.getDataVisibility(o) && n++;
        }),
        n
      );
    }
    _computeAngle(t, e, n) {
      return this.chart.getDataVisibility(t)
        ? Q(this.resolveDataElementOptions(t, e).angle || n)
        : 0;
    }
  };
  Je.id = "polarArea";
  Je.defaults = {
    dataElementType: "arc",
    animation: { animateRotate: !0, animateScale: !0 },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "startAngle",
          "endAngle",
          "innerRadius",
          "outerRadius",
        ],
      },
    },
    indexAxis: "r",
    startAngle: 0,
  };
  Je.overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(i) {
            let t = i.data;
            return t.labels.length && t.datasets.length
              ? t.labels.map((e, n) => {
                let o = i.getDatasetMeta(0).controller.getStyle(n);
                return {
                  text: e,
                  fillStyle: o.backgroundColor,
                  strokeStyle: o.borderColor,
                  lineWidth: o.borderWidth,
                  hidden: !i.getDataVisibility(n),
                  index: n,
                };
              })
              : [];
          },
        },
        onClick(i, t, e) {
          e.chart.toggleDataVisibility(t.index), e.chart.update();
        },
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(i) {
            return i.chart.data.labels[i.dataIndex] + ": " + i.formattedValue;
          },
        },
      },
    },
    scales: {
      r: {
        type: "radialLinear",
        angleLines: { display: !1 },
        beginAtZero: !0,
        grid: { circular: !0 },
        pointLabels: { display: !1 },
        startAngle: 0,
      },
    },
  };
  var ri = class extends le { };
  ri.id = "pie";
  ri.defaults = { cutout: 0, rotation: 0, circumference: 360, radius: "100%" };
  var Qe = class extends J {
    getLabelAndValue(t) {
      let e = this,
        n = e._cachedMeta.vScale,
        s = e.getParsed(t);
      return {
        label: n.getLabels()[t],
        value: "" + n.getLabelForValue(s[n.axis]),
      };
    }
    update(t) {
      let e = this,
        n = e._cachedMeta,
        s = n.dataset,
        o = n.data || [],
        a = n.iScale.getLabels();
      if (((s.points = o), t !== "resize")) {
        let r = e.resolveDatasetElementOptions(t);
        e.options.showLine || (r.borderWidth = 0);
        let l = { _loop: !0, _fullLoop: a.length === o.length, options: r };
        e.updateElement(s, void 0, l, t);
      }
      e.updateElements(o, 0, o.length, t);
    }
    updateElements(t, e, n, s) {
      let o = this,
        a = o.getDataset(),
        r = o._cachedMeta.rScale,
        l = s === "reset";
      for (let c = e; c < e + n; c++) {
        let d = t[c],
          h = o.resolveDataElementOptions(c, s),
          u = r.getPointPositionForValue(c, a.data[c]),
          f = l ? r.xCenter : u.x,
          g = l ? r.yCenter : u.y,
          p = {
            x: f,
            y: g,
            angle: u.angle,
            skip: isNaN(f) || isNaN(g),
            options: h,
          };
        o.updateElement(d, c, p, s);
      }
    }
  };
  Qe.id = "radar";
  Qe.defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    indexAxis: "r",
    showLine: !0,
    elements: { line: { fill: "start" } },
  };
  Qe.overrides = { aspectRatio: 1, scales: { r: { type: "radialLinear" } } };
  var tn = class extends Ct { };
  tn.id = "scatter";
  tn.defaults = { showLine: !1, fill: !1 };
  tn.overrides = {
    interaction: { mode: "point" },
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(i) {
            return "(" + i.label + ", " + i.formattedValue + ")";
          },
        },
      },
    },
    scales: { x: { type: "linear" }, y: { type: "linear" } },
  };
  function Dt() {
    throw new Error(
      "This method is not implemented: either no adapter can be found or an incomplete integration was provided."
    );
  }
  var en = class {
    constructor(t) {
      this.options = t || {};
    }
    formats() {
      return Dt();
    }
    parse(t, e) {
      return Dt();
    }
    format(t, e) {
      return Dt();
    }
    add(t, e, n) {
      return Dt();
    }
    diff(t, e, n) {
      return Dt();
    }
    startOf(t, e, n) {
      return Dt();
    }
    endOf(t, e) {
      return Dt();
    }
  };
  en.override = function (i) {
    Object.assign(en.prototype, i);
  };
  var Ir = { _date: en };
  function ce(i, t) {
    return "native" in i ? { x: i.x, y: i.y } : Qn(i, t);
  }
  function Br(i, t) {
    let e = i.getSortedVisibleDatasetMetas(),
      n,
      s,
      o;
    for (let a = 0, r = e.length; a < r; ++a) {
      ({ index: n, data: s } = e[a]);
      for (let l = 0, c = s.length; l < c; ++l)
        (o = s[l]), o.skip || t(o, n, l);
    }
  }
  function Hr(i, t, e, n) {
    let { controller: s, data: o, _sorted: a } = i,
      r = s._cachedMeta.iScale;
    if (r && t === r.axis && a && o.length) {
      let l = r._reversePixels ? Ms : Vt;
      if (n) {
        if (s._sharedOptions) {
          let c = o[0],
            d = typeof c.getRange == "function" && c.getRange(t);
          if (d) {
            let h = l(o, t, e - d),
              u = l(o, t, e + d);
            return { lo: h.lo, hi: u.hi };
          }
        }
      } else return l(o, t, e);
    }
    return { lo: 0, hi: o.length - 1 };
  }
  function ao(i, t, e, n, s) {
    let o = i.getSortedVisibleDatasetMetas(),
      a = e[t];
    for (let r = 0, l = o.length; r < l; ++r) {
      let { index: c, data: d } = o[r],
        { lo: h, hi: u } = Hr(o[r], t, a, s);
      for (let f = h; f <= u; ++f) {
        let g = d[f];
        g.skip || n(g, c, f);
      }
    }
  }
  function Vr(i) {
    let t = i.indexOf("x") !== -1,
      e = i.indexOf("y") !== -1;
    return function (n, s) {
      let o = t ? Math.abs(n.x - s.x) : 0,
        a = e ? Math.abs(n.y - s.y) : 0;
      return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2));
    };
  }
  function li(i, t, e, n) {
    let s = [];
    return (
      Ht(t, i.chartArea, i._minPadding) &&
      ao(
        i,
        e,
        t,
        function (a, r, l) {
          a.inRange(t.x, t.y, n) &&
            s.push({ element: a, datasetIndex: r, index: l });
        },
        !0
      ),
      s
    );
  }
  function ci(i, t, e, n, s) {
    let o = Vr(e),
      a = Number.POSITIVE_INFINITY,
      r = [];
    return (
      Ht(t, i.chartArea, i._minPadding) &&
      ao(i, e, t, function (c, d, h) {
        if (n && !c.inRange(t.x, t.y, s)) return;
        let u = c.getCenterPoint(s),
          f = o(t, u);
        f < a
          ? ((r = [{ element: c, datasetIndex: d, index: h }]), (a = f))
          : f === a && r.push({ element: c, datasetIndex: d, index: h });
      }),
      r
    );
  }
  function ro(i, t, e, n) {
    let s = ce(t, i),
      o = [],
      a = e.axis,
      r = a === "x" ? "inXRange" : "inYRange",
      l = !1;
    return (
      Br(i, (c, d, h) => {
        c[r](s[a], n) && o.push({ element: c, datasetIndex: d, index: h }),
          c.inRange(s.x, s.y, n) && (l = !0);
      }),
      e.intersect && !l ? [] : o
    );
  }
  var Wr = {
    modes: {
      index(i, t, e, n) {
        let s = ce(t, i),
          o = e.axis || "x",
          a = e.intersect ? li(i, s, o, n) : ci(i, s, o, !1, n),
          r = [];
        return a.length
          ? (i.getSortedVisibleDatasetMetas().forEach((l) => {
            let c = a[0].index,
              d = l.data[c];
            d &&
              !d.skip &&
              r.push({ element: d, datasetIndex: l.index, index: c });
          }),
            r)
          : [];
      },
      dataset(i, t, e, n) {
        let s = ce(t, i),
          o = e.axis || "xy",
          a = e.intersect ? li(i, s, o, n) : ci(i, s, o, !1, n);
        if (a.length > 0) {
          let r = a[0].datasetIndex,
            l = i.getDatasetMeta(r).data;
          a = [];
          for (let c = 0; c < l.length; ++c)
            a.push({ element: l[c], datasetIndex: r, index: c });
        }
        return a;
      },
      point(i, t, e, n) {
        let s = ce(t, i),
          o = e.axis || "xy";
        return li(i, s, o, n);
      },
      nearest(i, t, e, n) {
        let s = ce(t, i),
          o = e.axis || "xy";
        return ci(i, s, o, e.intersect, n);
      },
      x(i, t, e, n) {
        return (e.axis = "x"), ro(i, t, e, n);
      },
      y(i, t, e, n) {
        return (e.axis = "y"), ro(i, t, e, n);
      },
    },
  },
    Nr = ["left", "top", "right", "bottom"];
  function de(i, t) {
    return i.filter((e) => e.pos === t);
  }
  function lo(i, t) {
    return i.filter((e) => Nr.indexOf(e.pos) === -1 && e.box.axis === t);
  }
  function he(i, t) {
    return i.sort((e, n) => {
      let s = t ? n : e,
        o = t ? e : n;
      return s.weight === o.weight ? s.index - o.index : s.weight - o.weight;
    });
  }
  function jr(i) {
    let t = [],
      e,
      n,
      s;
    for (e = 0, n = (i || []).length; e < n; ++e)
      (s = i[e]),
        t.push({
          index: e,
          box: s,
          pos: s.position,
          horizontal: s.isHorizontal(),
          weight: s.weight,
        });
    return t;
  }
  function $r(i, t) {
    let e, n, s;
    for (e = 0, n = i.length; e < n; ++e)
      (s = i[e]),
        s.horizontal
          ? ((s.width = s.box.fullSize && t.availableWidth),
            (s.height = t.hBoxMaxHeight))
          : ((s.width = t.vBoxMaxWidth),
            (s.height = s.box.fullSize && t.availableHeight));
  }
  function Ur(i) {
    let t = jr(i),
      e = he(
        t.filter((c) => c.box.fullSize),
        !0
      ),
      n = he(de(t, "left"), !0),
      s = he(de(t, "right")),
      o = he(de(t, "top"), !0),
      a = he(de(t, "bottom")),
      r = lo(t, "x"),
      l = lo(t, "y");
    return {
      fullSize: e,
      leftAndTop: n.concat(o),
      rightAndBottom: s.concat(l).concat(a).concat(r),
      chartArea: de(t, "chartArea"),
      vertical: n.concat(s).concat(l),
      horizontal: o.concat(a).concat(r),
    };
  }
  function co(i, t, e, n) {
    return Math.max(i[e], t[e]) + Math.max(i[n], t[n]);
  }
  function ho(i, t) {
    (i.top = Math.max(i.top, t.top)),
      (i.left = Math.max(i.left, t.left)),
      (i.bottom = Math.max(i.bottom, t.bottom)),
      (i.right = Math.max(i.right, t.right));
  }
  function Yr(i, t, e) {
    let n = e.box,
      s = i.maxPadding;
    O(e.pos) ||
      (e.size && (i[e.pos] -= e.size),
        (e.size = e.horizontal ? n.height : n.width),
        (i[e.pos] += e.size)),
      n.getPadding && ho(s, n.getPadding());
    let o = Math.max(0, t.outerWidth - co(s, i, "left", "right")),
      a = Math.max(0, t.outerHeight - co(s, i, "top", "bottom")),
      r = o !== i.w,
      l = a !== i.h;
    return (
      (i.w = o),
      (i.h = a),
      e.horizontal ? { same: r, other: l } : { same: l, other: r }
    );
  }
  function Xr(i) {
    let t = i.maxPadding;
    function e(n) {
      let s = Math.max(t[n] - i[n], 0);
      return (i[n] += s), s;
    }
    (i.y += e("top")), (i.x += e("left")), e("right"), e("bottom");
  }
  function qr(i, t) {
    let e = t.maxPadding;
    function n(s) {
      let o = { left: 0, top: 0, right: 0, bottom: 0 };
      return (
        s.forEach((a) => {
          o[a] = Math.max(t[a], e[a]);
        }),
        o
      );
    }
    return n(i ? ["left", "right"] : ["top", "bottom"]);
  }
  function ue(i, t, e) {
    let n = [],
      s,
      o,
      a,
      r,
      l,
      c;
    for (s = 0, o = i.length, l = 0; s < o; ++s) {
      (a = i[s]),
        (r = a.box),
        r.update(a.width || t.w, a.height || t.h, qr(a.horizontal, t));
      let { same: d, other: h } = Yr(t, e, a);
      (l |= d && n.length), (c = c || h), r.fullSize || n.push(a);
    }
    return (l && ue(n, t, e)) || c;
  }
  function uo(i, t, e) {
    let n = e.padding,
      s = t.x,
      o = t.y,
      a,
      r,
      l,
      c;
    for (a = 0, r = i.length; a < r; ++a)
      (l = i[a]),
        (c = l.box),
        l.horizontal
          ? ((c.left = c.fullSize ? n.left : t.left),
            (c.right = c.fullSize ? e.outerWidth - n.right : t.left + t.w),
            (c.top = o),
            (c.bottom = o + c.height),
            (c.width = c.right - c.left),
            (o = c.bottom))
          : ((c.left = s),
            (c.right = s + c.width),
            (c.top = c.fullSize ? n.top : t.top),
            (c.bottom = c.fullSize ? e.outerHeight - n.right : t.top + t.h),
            (c.height = c.bottom - c.top),
            (s = c.right));
    (t.x = s), (t.y = o);
  }
  k.set("layout", { padding: { top: 0, right: 0, bottom: 0, left: 0 } });
  var nn = {
    addBox(i, t) {
      i.boxes || (i.boxes = []),
        (t.fullSize = t.fullSize || !1),
        (t.position = t.position || "top"),
        (t.weight = t.weight || 0),
        (t._layers =
          t._layers ||
          function () {
            return [
              {
                z: 0,
                draw(e) {
                  t.draw(e);
                },
              },
            ];
          }),
        i.boxes.push(t);
    },
    removeBox(i, t) {
      let e = i.boxes ? i.boxes.indexOf(t) : -1;
      e !== -1 && i.boxes.splice(e, 1);
    },
    configure(i, t, e) {
      (t.fullSize = e.fullSize),
        (t.position = e.position),
        (t.weight = e.weight);
    },
    update(i, t, e, n) {
      if (!i) return;
      let s = G(i.options.layout.padding),
        o = t - s.width,
        a = e - s.height,
        r = Ur(i.boxes),
        l = r.vertical,
        c = r.horizontal;
      D(i.boxes, (g) => {
        typeof g.beforeLayout == "function" && g.beforeLayout();
      });
      let d =
        l.reduce(
          (g, p) =>
            p.box.options && p.box.options.display === !1 ? g : g + 1,
          0
        ) || 1,
        h = Object.freeze({
          outerWidth: t,
          outerHeight: e,
          padding: s,
          availableWidth: o,
          availableHeight: a,
          vBoxMaxWidth: o / 2 / d,
          hBoxMaxHeight: a / 2,
        }),
        u = Object.assign({}, s);
      ho(u, G(n));
      let f = Object.assign(
        { maxPadding: u, w: o, h: a, x: s.left, y: s.top },
        s
      );
      $r(l.concat(c), h),
        ue(r.fullSize, f, h),
        ue(l, f, h),
        ue(c, f, h) && ue(l, f, h),
        Xr(f),
        uo(r.leftAndTop, f, h),
        (f.x += f.w),
        (f.y += f.h),
        uo(r.rightAndBottom, f, h),
        (i.chartArea = {
          left: f.left,
          top: f.top,
          right: f.left + f.w,
          bottom: f.top + f.h,
          height: f.h,
          width: f.w,
        }),
        D(r.chartArea, (g) => {
          let p = g.box;
          Object.assign(p, i.chartArea), p.update(f.w, f.h);
        });
    },
  },
    di = class {
      acquireContext(t, e) { }
      releaseContext(t) {
        return !1;
      }
      addEventListener(t, e, n) { }
      removeEventListener(t, e, n) { }
      getDevicePixelRatio() {
        return 1;
      }
      getMaximumSize(t, e, n, s) {
        return (
          (e = Math.max(0, e || t.width)),
          (n = n || t.height),
          { width: e, height: Math.max(0, s ? Math.floor(e / s) : n) }
        );
      }
      isAttached(t) {
        return !0;
      }
    },
    fo = class extends di {
      acquireContext(t) {
        return (t && t.getContext && t.getContext("2d")) || null;
      }
    },
    sn = "$chartjs",
    Kr = {
      touchstart: "mousedown",
      touchmove: "mousemove",
      touchend: "mouseup",
      pointerenter: "mouseenter",
      pointerdown: "mousedown",
      pointermove: "mousemove",
      pointerup: "mouseup",
      pointerleave: "mouseout",
      pointerout: "mouseout",
    },
    go = (i) => i === null || i === "";
  function Gr(i, t) {
    let e = i.style,
      n = i.getAttribute("height"),
      s = i.getAttribute("width");
    if (
      ((i[sn] = {
        initial: {
          height: n,
          width: s,
          style: { display: e.display, height: e.height, width: e.width },
        },
      }),
        (e.display = e.display || "block"),
        (e.boxSizing = e.boxSizing || "border-box"),
        go(s))
    ) {
      let o = ni(i, "width");
      o !== void 0 && (i.width = o);
    }
    if (go(n))
      if (i.style.height === "") i.height = i.width / (t || 2);
      else {
        let o = ni(i, "height");
        o !== void 0 && (i.height = o);
      }
    return i;
  }
  var po = zs ? { passive: !0 } : !1;
  function Zr(i, t, e) {
    i.addEventListener(t, e, po);
  }
  function Jr(i, t, e) {
    i.canvas.removeEventListener(t, e, po);
  }
  function Qr(i, t) {
    let e = Kr[i.type] || i.type,
      { x: n, y: s } = Qn(i, t);
    return {
      type: e,
      chart: t,
      native: i,
      x: n !== void 0 ? n : null,
      y: s !== void 0 ? s : null,
    };
  }
  function tl(i, t, e) {
    let n = i.canvas,
      o = (n && pt(n)) || n,
      a = new MutationObserver((r) => {
        let l = pt(o);
        r.forEach((c) => {
          for (let d = 0; d < c.addedNodes.length; d++) {
            let h = c.addedNodes[d];
            (h === o || h === l) && e(c.target);
          }
        });
      });
    return a.observe(document, { childList: !0, subtree: !0 }), a;
  }
  function el(i, t, e) {
    let n = i.canvas,
      s = n && pt(n);
    if (!s) return;
    let o = new MutationObserver((a) => {
      a.forEach((r) => {
        for (let l = 0; l < r.removedNodes.length; l++)
          if (r.removedNodes[l] === n) {
            e();
            break;
          }
      });
    });
    return o.observe(s, { childList: !0 }), o;
  }
  var fe = new Map(),
    mo = 0;
  function bo() {
    let i = window.devicePixelRatio;
    i !== mo &&
      ((mo = i),
        fe.forEach((t, e) => {
          e.currentDevicePixelRatio !== i && t();
        }));
  }
  function nl(i, t) {
    fe.size || window.addEventListener("resize", bo), fe.set(i, t);
  }
  function il(i) {
    fe.delete(i), fe.size || window.removeEventListener("resize", bo);
  }
  function sl(i, t, e) {
    let n = i.canvas,
      s = n && pt(n);
    if (!s) return;
    let o = En((r, l) => {
      let c = s.clientWidth;
      e(r, l), c < s.clientWidth && e();
    }, window),
      a = new ResizeObserver((r) => {
        let l = r[0],
          c = l.contentRect.width,
          d = l.contentRect.height;
        (c === 0 && d === 0) || o(c, d);
      });
    return a.observe(s), nl(i, o), a;
  }
  function hi(i, t, e) {
    e && e.disconnect(), t === "resize" && il(i);
  }
  function ol(i, t, e) {
    let n = i.canvas,
      s = En(
        (o) => {
          i.ctx !== null && e(Qr(o, i));
        },
        i,
        (o) => {
          let a = o[0];
          return [a, a.offsetX, a.offsetY];
        }
      );
    return Zr(n, t, s), s;
  }
  var xo = class extends di {
    acquireContext(t, e) {
      let n = t && t.getContext && t.getContext("2d");
      return n && n.canvas === t ? (Gr(t, e), n) : null;
    }
    releaseContext(t) {
      let e = t.canvas;
      if (!e[sn]) return !1;
      let n = e[sn].initial;
      ["height", "width"].forEach((o) => {
        let a = n[o];
        P(a) ? e.removeAttribute(o) : e.setAttribute(o, a);
      });
      let s = n.style || {};
      return (
        Object.keys(s).forEach((o) => {
          e.style[o] = s[o];
        }),
        (e.width = e.width),
        delete e[sn],
        !0
      );
    }
    addEventListener(t, e, n) {
      this.removeEventListener(t, e);
      let s = t.$proxies || (t.$proxies = {}),
        a = { attach: tl, detach: el, resize: sl }[e] || ol;
      s[e] = a(t, e, n);
    }
    removeEventListener(t, e) {
      let n = t.$proxies || (t.$proxies = {}),
        s = n[e];
      if (!s) return;
      (({ attach: hi, detach: hi, resize: hi }[e] || Jr)(t, e, s),
        (n[e] = void 0));
    }
    getDevicePixelRatio() {
      return window.devicePixelRatio;
    }
    getMaximumSize(t, e, n, s) {
      return Fs(t, e, n, s);
    }
    isAttached(t) {
      let e = pt(t);
      return !!(e && pt(e));
    }
  },
    et = class {
      constructor() {
        (this.x = void 0),
          (this.y = void 0),
          (this.active = !1),
          (this.options = void 0),
          (this.$animations = void 0);
      }
      tooltipPosition(t) {
        let { x: e, y: n } = this.getProps(["x", "y"], t);
        return { x: e, y: n };
      }
      hasValue() {
        return Mt(this.x) && Mt(this.y);
      }
      getProps(t, e) {
        let n = this,
          s = this.$animations;
        if (!e || !s) return n;
        let o = {};
        return (
          t.forEach((a) => {
            o[a] = s[a] && s[a].active() ? s[a]._to : n[a];
          }),
          o
        );
      }
    };
  et.defaults = {};
  et.defaultRoutes = void 0;
  var _o = {
    values(i) {
      return T(i) ? i : "" + i;
    },
    numeric(i, t, e) {
      if (i === 0) return "0";
      let n = this.chart.options.locale,
        s,
        o = i;
      if (e.length > 1) {
        let c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
        (c < 1e-4 || c > 1e15) && (s = "scientific"), (o = al(i, e));
      }
      let a = Y(Math.abs(o)),
        r = Math.max(Math.min(-1 * Math.floor(a), 20), 0),
        l = { notation: s, minimumFractionDigits: r, maximumFractionDigits: r };
      return Object.assign(l, this.options.ticks.format), re(i, n, l);
    },
    logarithmic(i, t, e) {
      if (i === 0) return "0";
      let n = i / Math.pow(10, Math.floor(Y(i)));
      return n === 1 || n === 2 || n === 5
        ? _o.numeric.call(this, i, t, e)
        : "";
    },
  };
  function al(i, t) {
    let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
    return Math.abs(e) > 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
  }
  var on = { formatters: _o };
  k.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawBorder: !0,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (i, t) => t.lineWidth,
      tickColor: (i, t) => t.color,
      offset: !1,
      borderDash: [],
      borderDashOffset: 0,
      borderWidth: 1,
    },
    title: { display: !1, text: "", padding: { top: 4, bottom: 4 } },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: on.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2,
    },
  });
  k.route("scale.ticks", "color", "", "color");
  k.route("scale.grid", "color", "", "borderColor");
  k.route("scale.grid", "borderColor", "", "borderColor");
  k.route("scale.title", "color", "", "color");
  k.describe("scale", {
    _fallback: !1,
    _scriptable: (i) =>
      !i.startsWith("before") &&
      !i.startsWith("after") &&
      i !== "callback" &&
      i !== "parser",
    _indexable: (i) => i !== "borderDash" && i !== "tickBorderDash",
  });
  k.describe("scales", { _fallback: "scale" });
  function rl(i, t) {
    let e = i.options.ticks,
      n = e.maxTicksLimit || ll(i),
      s = e.major.enabled ? dl(t) : [],
      o = s.length,
      a = s[0],
      r = s[o - 1],
      l = [];
    if (o > n) return hl(t, l, s, o / n), l;
    let c = cl(s, t, n);
    if (o > 0) {
      let d,
        h,
        u = o > 1 ? Math.round((r - a) / (o - 1)) : null;
      for (an(t, l, c, P(u) ? 0 : a - u, a), d = 0, h = o - 1; d < h; d++)
        an(t, l, c, s[d], s[d + 1]);
      return an(t, l, c, r, P(u) ? t.length : r + u), l;
    }
    return an(t, l, c), l;
  }
  function ll(i) {
    let t = i.options.offset,
      e = i._tickSize(),
      n = i._length / e + (t ? 0 : 1),
      s = i._maxLength / e;
    return Math.floor(Math.min(n, s));
  }
  function cl(i, t, e) {
    let n = ul(i),
      s = t.length / e;
    if (!n) return Math.max(s, 1);
    let o = is(n);
    for (let a = 0, r = o.length - 1; a < r; a++) {
      let l = o[a];
      if (l > s) return l;
    }
    return Math.max(s, 1);
  }
  function dl(i) {
    let t = [],
      e,
      n;
    for (e = 0, n = i.length; e < n; e++) i[e].major && t.push(e);
    return t;
  }
  function hl(i, t, e, n) {
    let s = 0,
      o = e[0],
      a;
    for (n = Math.ceil(n), a = 0; a < i.length; a++)
      a === o && (t.push(i[a]), s++, (o = e[s * n]));
  }
  function an(i, t, e, n, s) {
    let o = C(n, 0),
      a = Math.min(C(s, i.length), i.length),
      r = 0,
      l,
      c,
      d;
    for (
      e = Math.ceil(e), s && ((l = s - n), (e = l / Math.floor(l / e))), d = o;
      d < 0;

    )
      r++, (d = Math.round(o + r * e));
    for (c = Math.max(o, 0); c < a; c++)
      c === d && (t.push(i[c]), r++, (d = Math.round(o + r * e)));
  }
  function ul(i) {
    let t = i.length,
      e,
      n;
    if (t < 2) return !1;
    for (n = i[0], e = 1; e < t; ++e) if (i[e] - i[e - 1] !== n) return !1;
    return n;
  }
  var fl = (i) => (i === "left" ? "right" : i === "right" ? "left" : i),
    yo = (i, t, e) => (t === "top" || t === "left" ? i[t] + e : i[t] - e);
  function vo(i, t) {
    let e = [],
      n = i.length / t,
      s = i.length,
      o = 0;
    for (; o < s; o += n) e.push(i[Math.floor(o)]);
    return e;
  }
  function gl(i, t, e) {
    let n = i.ticks.length,
      s = Math.min(t, n - 1),
      o = i._startPixel,
      a = i._endPixel,
      r = 1e-6,
      l = i.getPixelForTick(s),
      c;
    if (
      !(
        e &&
        (n === 1
          ? (c = Math.max(l - o, a - l))
          : t === 0
            ? (c = (i.getPixelForTick(1) - l) / 2)
            : (c = (l - i.getPixelForTick(s - 1)) / 2),
          (l += s < t ? c : -c),
          l < o - r || l > a + r)
      )
    )
      return l;
  }
  function pl(i, t) {
    D(i, (e) => {
      let n = e.gc,
        s = n.length / 2,
        o;
      if (s > t) {
        for (o = 0; o < s; ++o) delete e.data[n[o]];
        n.splice(0, s);
      }
    });
  }
  function ge(i) {
    return i.drawTicks ? i.tickLength : 0;
  }
  function wo(i, t) {
    if (!i.display) return 0;
    let e = N(i.font, t),
      n = G(i.padding);
    return (T(i.text) ? i.text.length : 1) * e.lineHeight + n.height;
  }
  function ml(i, t) {
    return Object.assign(Object.create(i), { scale: t, type: "scale" });
  }
  function bl(i, t, e) {
    return Object.assign(Object.create(i), { tick: e, index: t, type: "tick" });
  }
  function xl(i, t, e) {
    let n = Gi(i);
    return ((e && t !== "right") || (!e && t === "right")) && (n = fl(n)), n;
  }
  function _l(i, t, e, n) {
    let { top: s, left: o, bottom: a, right: r } = i,
      l = 0,
      c,
      d,
      h;
    return (
      i.isHorizontal()
        ? ((d = Fn(n, o, r)), (h = yo(i, e, t)), (c = r - o))
        : ((d = yo(i, e, t)), (h = Fn(n, a, s)), (l = e === "left" ? -L : L)),
      { titleX: d, titleY: h, maxWidth: c, rotation: l }
    );
  }
  var bt = class extends et {
    constructor(t) {
      super();
      (this.id = t.id),
        (this.type = t.type),
        (this.options = void 0),
        (this.ctx = t.ctx),
        (this.chart = t.chart),
        (this.top = void 0),
        (this.bottom = void 0),
        (this.left = void 0),
        (this.right = void 0),
        (this.width = void 0),
        (this.height = void 0),
        (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
        (this.maxWidth = void 0),
        (this.maxHeight = void 0),
        (this.paddingTop = void 0),
        (this.paddingBottom = void 0),
        (this.paddingLeft = void 0),
        (this.paddingRight = void 0),
        (this.axis = void 0),
        (this.labelRotation = void 0),
        (this.min = void 0),
        (this.max = void 0),
        (this._range = void 0),
        (this.ticks = []),
        (this._gridLineItems = null),
        (this._labelItems = null),
        (this._labelSizes = null),
        (this._length = 0),
        (this._maxLength = 0),
        (this._longestTextCache = {}),
        (this._startPixel = void 0),
        (this._endPixel = void 0),
        (this._reversePixels = !1),
        (this._userMax = void 0),
        (this._userMin = void 0),
        (this._suggestedMax = void 0),
        (this._suggestedMin = void 0),
        (this._ticksLength = 0),
        (this._borderValue = 0),
        (this._cache = {}),
        (this._dataLimitsCached = !1),
        (this.$context = void 0);
    }
    init(t) {
      let e = this;
      (e.options = t.setContext(e.getContext())),
        (e.axis = t.axis),
        (e._userMin = e.parse(t.min)),
        (e._userMax = e.parse(t.max)),
        (e._suggestedMin = e.parse(t.suggestedMin)),
        (e._suggestedMax = e.parse(t.suggestedMax));
    }
    parse(t, e) {
      return t;
    }
    getUserBounds() {
      let {
        _userMin: t,
        _userMax: e,
        _suggestedMin: n,
        _suggestedMax: s,
      } = this;
      return (
        (t = U(t, Number.POSITIVE_INFINITY)),
        (e = U(e, Number.NEGATIVE_INFINITY)),
        (n = U(n, Number.POSITIVE_INFINITY)),
        (s = U(s, Number.NEGATIVE_INFINITY)),
        { min: U(t, n), max: U(e, s), minDefined: B(t), maxDefined: B(e) }
      );
    }
    getMinMax(t) {
      let e = this,
        { min: n, max: s, minDefined: o, maxDefined: a } = e.getUserBounds(),
        r;
      if (o && a) return { min: n, max: s };
      let l = e.getMatchingVisibleMetas();
      for (let c = 0, d = l.length; c < d; ++c)
        (r = l[c].controller.getMinMax(e, t)),
          o || (n = Math.min(n, r.min)),
          a || (s = Math.max(s, r.max));
      return { min: U(n, U(s, n)), max: U(s, U(n, s)) };
    }
    getPadding() {
      let t = this;
      return {
        left: t.paddingLeft || 0,
        top: t.paddingTop || 0,
        right: t.paddingRight || 0,
        bottom: t.paddingBottom || 0,
      };
    }
    getTicks() {
      return this.ticks;
    }
    getLabels() {
      let t = this.chart.data;
      return (
        this.options.labels ||
        (this.isHorizontal() ? t.xLabels : t.yLabels) ||
        t.labels ||
        []
      );
    }
    beforeLayout() {
      (this._cache = {}), (this._dataLimitsCached = !1);
    }
    beforeUpdate() {
      R(this.options.beforeUpdate, [this]);
    }
    update(t, e, n) {
      let s = this,
        o = s.options.ticks,
        a = o.sampleSize;
      s.beforeUpdate(),
        (s.maxWidth = t),
        (s.maxHeight = e),
        (s._margins = n =
          Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, n)),
        (s.ticks = null),
        (s._labelSizes = null),
        (s._gridLineItems = null),
        (s._labelItems = null),
        s.beforeSetDimensions(),
        s.setDimensions(),
        s.afterSetDimensions(),
        (s._maxLength = s.isHorizontal()
          ? s.width + n.left + n.right
          : s.height + n.top + n.bottom),
        s._dataLimitsCached ||
        (s.beforeDataLimits(),
          s.determineDataLimits(),
          s.afterDataLimits(),
          (s._range = Ss(s, s.options.grace)),
          (s._dataLimitsCached = !0)),
        s.beforeBuildTicks(),
        (s.ticks = s.buildTicks() || []),
        s.afterBuildTicks();
      let r = a < s.ticks.length;
      s._convertTicksToLabels(r ? vo(s.ticks, a) : s.ticks),
        s.configure(),
        s.beforeCalculateLabelRotation(),
        s.calculateLabelRotation(),
        s.afterCalculateLabelRotation(),
        o.display &&
        (o.autoSkip || o.source === "auto") &&
        ((s.ticks = rl(s, s.ticks)), (s._labelSizes = null)),
        r && s._convertTicksToLabels(s.ticks),
        s.beforeFit(),
        s.fit(),
        s.afterFit(),
        s.afterUpdate();
    }
    configure() {
      let t = this,
        e = t.options.reverse,
        n,
        s;
      t.isHorizontal()
        ? ((n = t.left), (s = t.right))
        : ((n = t.top), (s = t.bottom), (e = !e)),
        (t._startPixel = n),
        (t._endPixel = s),
        (t._reversePixels = e),
        (t._length = s - n),
        (t._alignToPixels = t.options.alignToPixels);
    }
    afterUpdate() {
      R(this.options.afterUpdate, [this]);
    }
    beforeSetDimensions() {
      R(this.options.beforeSetDimensions, [this]);
    }
    setDimensions() {
      let t = this;
      t.isHorizontal()
        ? ((t.width = t.maxWidth), (t.left = 0), (t.right = t.width))
        : ((t.height = t.maxHeight), (t.top = 0), (t.bottom = t.height)),
        (t.paddingLeft = 0),
        (t.paddingTop = 0),
        (t.paddingRight = 0),
        (t.paddingBottom = 0);
    }
    afterSetDimensions() {
      R(this.options.afterSetDimensions, [this]);
    }
    _callHooks(t) {
      let e = this;
      e.chart.notifyPlugins(t, e.getContext()), R(e.options[t], [e]);
    }
    beforeDataLimits() {
      this._callHooks("beforeDataLimits");
    }
    determineDataLimits() { }
    afterDataLimits() {
      this._callHooks("afterDataLimits");
    }
    beforeBuildTicks() {
      this._callHooks("beforeBuildTicks");
    }
    buildTicks() {
      return [];
    }
    afterBuildTicks() {
      this._callHooks("afterBuildTicks");
    }
    beforeTickToLabelConversion() {
      R(this.options.beforeTickToLabelConversion, [this]);
    }
    generateTickLabels(t) {
      let e = this,
        n = e.options.ticks,
        s,
        o,
        a;
      for (s = 0, o = t.length; s < o; s++)
        (a = t[s]), (a.label = R(n.callback, [a.value, s, t], e));
      for (s = 0; s < o; s++) P(t[s].label) && (t.splice(s, 1), o--, s--);
    }
    afterTickToLabelConversion() {
      R(this.options.afterTickToLabelConversion, [this]);
    }
    beforeCalculateLabelRotation() {
      R(this.options.beforeCalculateLabelRotation, [this]);
    }
    calculateLabelRotation() {
      let t = this,
        e = t.options,
        n = e.ticks,
        s = t.ticks.length,
        o = n.minRotation || 0,
        a = n.maxRotation,
        r = o,
        l,
        c,
        d;
      if (
        !t._isVisible() ||
        !n.display ||
        o >= a ||
        s <= 1 ||
        !t.isHorizontal()
      ) {
        t.labelRotation = o;
        return;
      }
      let h = t._getLabelSizes(),
        u = h.widest.width,
        f = h.highest.height,
        g = X(t.chart.width - u, 0, t.maxWidth);
      (l = e.offset ? t.maxWidth / s : g / (s - 1)),
        u + 6 > l &&
        ((l = g / (s - (e.offset ? 0.5 : 1))),
          (c =
            t.maxHeight -
            ge(e.grid) -
            n.padding -
            wo(e.title, t.chart.options.font)),
          (d = Math.sqrt(u * u + f * f)),
          (r = Te(
            Math.min(
              Math.asin(Math.min((h.highest.height + 6) / l, 1)),
              Math.asin(Math.min(c / d, 1)) - Math.asin(f / d)
            )
          )),
          (r = Math.max(o, Math.min(a, r)))),
        (t.labelRotation = r);
    }
    afterCalculateLabelRotation() {
      R(this.options.afterCalculateLabelRotation, [this]);
    }
    beforeFit() {
      R(this.options.beforeFit, [this]);
    }
    fit() {
      let t = this,
        e = { width: 0, height: 0 },
        {
          chart: n,
          options: { ticks: s, title: o, grid: a },
        } = t,
        r = t._isVisible(),
        l = t.isHorizontal();
      if (r) {
        let c = wo(o, n.options.font);
        if (
          (l
            ? ((e.width = t.maxWidth), (e.height = ge(a) + c))
            : ((e.height = t.maxHeight), (e.width = ge(a) + c)),
            s.display && t.ticks.length)
        ) {
          let {
            first: d,
            last: h,
            widest: u,
            highest: f,
          } = t._getLabelSizes(),
            g = s.padding * 2,
            p = Q(t.labelRotation),
            m = Math.cos(p),
            b = Math.sin(p);
          if (l) {
            let _ = s.mirror ? 0 : b * u.width + m * f.height;
            e.height = Math.min(t.maxHeight, e.height + _ + g);
          } else {
            let _ = s.mirror ? 0 : m * u.width + b * f.height;
            e.width = Math.min(t.maxWidth, e.width + _ + g);
          }
          t._calculatePadding(d, h, b, m);
        }
      }
      t._handleMargins(),
        l
          ? ((t.width = t._length =
            n.width - t._margins.left - t._margins.right),
            (t.height = e.height))
          : ((t.width = e.width),
            (t.height = t._length =
              n.height - t._margins.top - t._margins.bottom));
    }
    _calculatePadding(t, e, n, s) {
      let o = this,
        {
          ticks: { align: a, padding: r },
          position: l,
        } = o.options,
        c = o.labelRotation !== 0,
        d = l !== "top" && o.axis === "x";
      if (o.isHorizontal()) {
        let h = o.getPixelForTick(0) - o.left,
          u = o.right - o.getPixelForTick(o.ticks.length - 1),
          f = 0,
          g = 0;
        c
          ? d
            ? ((f = s * t.width), (g = n * e.height))
            : ((f = n * t.height), (g = s * e.width))
          : a === "start"
            ? (g = e.width)
            : a === "end"
              ? (f = t.width)
              : ((f = t.width / 2), (g = e.width / 2)),
          (o.paddingLeft = Math.max(
            ((f - h + r) * o.width) / (o.width - h),
            0
          )),
          (o.paddingRight = Math.max(
            ((g - u + r) * o.width) / (o.width - u),
            0
          ));
      } else {
        let h = e.height / 2,
          u = t.height / 2;
        a === "start"
          ? ((h = 0), (u = t.height))
          : a === "end" && ((h = e.height), (u = 0)),
          (o.paddingTop = h + r),
          (o.paddingBottom = u + r);
      }
    }
    _handleMargins() {
      let t = this;
      t._margins &&
        ((t._margins.left = Math.max(t.paddingLeft, t._margins.left)),
          (t._margins.top = Math.max(t.paddingTop, t._margins.top)),
          (t._margins.right = Math.max(t.paddingRight, t._margins.right)),
          (t._margins.bottom = Math.max(t.paddingBottom, t._margins.bottom)));
    }
    afterFit() {
      R(this.options.afterFit, [this]);
    }
    isHorizontal() {
      let { axis: t, position: e } = this.options;
      return e === "top" || e === "bottom" || t === "x";
    }
    isFullSize() {
      return this.options.fullSize;
    }
    _convertTicksToLabels(t) {
      let e = this;
      e.beforeTickToLabelConversion(),
        e.generateTickLabels(t),
        e.afterTickToLabelConversion();
    }
    _getLabelSizes() {
      let t = this,
        e = t._labelSizes;
      if (!e) {
        let n = t.options.ticks.sampleSize,
          s = t.ticks;
        n < s.length && (s = vo(s, n)),
          (t._labelSizes = e = t._computeLabelSizes(s, s.length));
      }
      return e;
    }
    _computeLabelSizes(t, e) {
      let { ctx: n, _longestTextCache: s } = this,
        o = [],
        a = [],
        r = 0,
        l = 0,
        c,
        d,
        h,
        u,
        f,
        g,
        p,
        m,
        b,
        _,
        y;
      for (c = 0; c < e; ++c) {
        if (
          ((u = t[c].label),
            (f = this._resolveTickFontOptions(c)),
            (n.font = g = f.string),
            (p = s[g] = s[g] || { data: {}, gc: [] }),
            (m = f.lineHeight),
            (b = _ = 0),
            !P(u) && !T(u))
        )
          (b = ie(n, p.data, p.gc, b, u)), (_ = m);
        else if (T(u))
          for (d = 0, h = u.length; d < h; ++d)
            (y = u[d]),
              !P(y) && !T(y) && ((b = ie(n, p.data, p.gc, b, y)), (_ += m));
        o.push(b), a.push(_), (r = Math.max(b, r)), (l = Math.max(_, l));
      }
      pl(s, e);
      let x = o.indexOf(r),
        v = a.indexOf(l),
        w = (S) => ({ width: o[S] || 0, height: a[S] || 0 });
      return {
        first: w(0),
        last: w(e - 1),
        widest: w(x),
        highest: w(v),
        widths: o,
        heights: a,
      };
    }
    getLabelForValue(t) {
      return t;
    }
    getPixelForValue(t, e) {
      return NaN;
    }
    getValueForPixel(t) { }
    getPixelForTick(t) {
      let e = this.ticks;
      return t < 0 || t > e.length - 1
        ? null
        : this.getPixelForValue(e[t].value);
    }
    getPixelForDecimal(t) {
      let e = this;
      e._reversePixels && (t = 1 - t);
      let n = e._startPixel + t * e._length;
      return rs(e._alignToPixels ? gt(e.chart, n, 0) : n);
    }
    getDecimalForPixel(t) {
      let e = (t - this._startPixel) / this._length;
      return this._reversePixels ? 1 - e : e;
    }
    getBasePixel() {
      return this.getPixelForValue(this.getBaseValue());
    }
    getBaseValue() {
      let { min: t, max: e } = this;
      return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
    }
    getContext(t) {
      let e = this,
        n = e.ticks || [];
      if (t >= 0 && t < n.length) {
        let s = n[t];
        return s.$context || (s.$context = bl(e.getContext(), t, s));
      }
      return e.$context || (e.$context = ml(e.chart.getContext(), e));
    }
    _tickSize() {
      let t = this,
        e = t.options.ticks,
        n = Q(t.labelRotation),
        s = Math.abs(Math.cos(n)),
        o = Math.abs(Math.sin(n)),
        a = t._getLabelSizes(),
        r = e.autoSkipPadding || 0,
        l = a ? a.widest.width + r : 0,
        c = a ? a.highest.height + r : 0;
      return t.isHorizontal()
        ? c * s > l * o
          ? l / s
          : c / o
        : c * o < l * s
          ? c / s
          : l / o;
    }
    _isVisible() {
      let t = this.options.display;
      return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
    }
    _computeGridLineItems(t) {
      let e = this,
        n = e.axis,
        s = e.chart,
        o = e.options,
        { grid: a, position: r } = o,
        l = a.offset,
        c = e.isHorizontal(),
        h = e.ticks.length + (l ? 1 : 0),
        u = ge(a),
        f = [],
        g = a.setContext(e.getContext()),
        p = g.drawBorder ? g.borderWidth : 0,
        m = p / 2,
        b = function (E) {
          return gt(s, E, p);
        },
        _,
        y,
        x,
        v,
        w,
        S,
        M,
        z,
        st,
        V,
        Z,
        W;
      if (r === "top")
        (_ = b(e.bottom)),
          (S = e.bottom - u),
          (z = _ - m),
          (V = b(t.top) + m),
          (W = t.bottom);
      else if (r === "bottom")
        (_ = b(e.top)),
          (V = t.top),
          (W = b(t.bottom) - m),
          (S = _ + m),
          (z = e.top + u);
      else if (r === "left")
        (_ = b(e.right)),
          (w = e.right - u),
          (M = _ - m),
          (st = b(t.left) + m),
          (Z = t.right);
      else if (r === "right")
        (_ = b(e.left)),
          (st = t.left),
          (Z = b(t.right) - m),
          (w = _ + m),
          (M = e.left + u);
      else if (n === "x") {
        if (r === "center") _ = b((t.top + t.bottom) / 2 + 0.5);
        else if (O(r)) {
          let E = Object.keys(r)[0],
            $ = r[E];
          _ = b(e.chart.scales[E].getPixelForValue($));
        }
        (V = t.top), (W = t.bottom), (S = _ + m), (z = S + u);
      } else if (n === "y") {
        if (r === "center") _ = b((t.left + t.right) / 2);
        else if (O(r)) {
          let E = Object.keys(r)[0],
            $ = r[E];
          _ = b(e.chart.scales[E].getPixelForValue($));
        }
        (w = _ - m), (M = w - u), (st = t.left), (Z = t.right);
      }
      for (y = 0; y < h; ++y) {
        let E = a.setContext(e.getContext(y)),
          $ = E.lineWidth,
          F = E.color,
          dt = a.borderDash || [],
          pn = E.borderDashOffset,
          mn = E.tickWidth,
          bn = E.tickColor,
          ve = E.tickBorderDash || [],
          At = E.tickBorderDashOffset;
        (x = gl(e, y, l)),
          x !== void 0 &&
          ((v = gt(s, x, $)),
            c ? (w = M = st = Z = v) : (S = z = V = W = v),
            f.push({
              tx1: w,
              ty1: S,
              tx2: M,
              ty2: z,
              x1: st,
              y1: V,
              x2: Z,
              y2: W,
              width: $,
              color: F,
              borderDash: dt,
              borderDashOffset: pn,
              tickWidth: mn,
              tickColor: bn,
              tickBorderDash: ve,
              tickBorderDashOffset: At,
            }));
      }
      return (e._ticksLength = h), (e._borderValue = _), f;
    }
    _computeLabelItems(t) {
      let e = this,
        n = e.axis,
        s = e.options,
        { position: o, ticks: a } = s,
        r = e.isHorizontal(),
        l = e.ticks,
        { align: c, crossAlign: d, padding: h, mirror: u } = a,
        f = ge(s.grid),
        g = f + h,
        p = u ? -h : g,
        m = -Q(e.labelRotation),
        b = [],
        _,
        y,
        x,
        v,
        w,
        S,
        M,
        z,
        st,
        V,
        Z,
        W,
        E = "middle";
      if (o === "top") (S = e.bottom - p), (M = e._getXAxisLabelAlignment());
      else if (o === "bottom")
        (S = e.top + p), (M = e._getXAxisLabelAlignment());
      else if (o === "left") {
        let F = e._getYAxisLabelAlignment(f);
        (M = F.textAlign), (w = F.x);
      } else if (o === "right") {
        let F = e._getYAxisLabelAlignment(f);
        (M = F.textAlign), (w = F.x);
      } else if (n === "x") {
        if (o === "center") S = (t.top + t.bottom) / 2 + g;
        else if (O(o)) {
          let F = Object.keys(o)[0],
            dt = o[F];
          S = e.chart.scales[F].getPixelForValue(dt) + g;
        }
        M = e._getXAxisLabelAlignment();
      } else if (n === "y") {
        if (o === "center") w = (t.left + t.right) / 2 - g;
        else if (O(o)) {
          let F = Object.keys(o)[0],
            dt = o[F];
          w = e.chart.scales[F].getPixelForValue(dt);
        }
        M = e._getYAxisLabelAlignment(f).textAlign;
      }
      n === "y" &&
        (c === "start" ? (E = "top") : c === "end" && (E = "bottom"));
      let $ = e._getLabelSizes();
      for (_ = 0, y = l.length; _ < y; ++_) {
        (x = l[_]), (v = x.label);
        let F = a.setContext(e.getContext(_));
        (z = e.getPixelForTick(_) + a.labelOffset),
          (st = e._resolveTickFontOptions(_)),
          (V = st.lineHeight),
          (Z = T(v) ? v.length : 1);
        let dt = Z / 2,
          pn = F.color,
          mn = F.textStrokeColor,
          bn = F.textStrokeWidth;
        r
          ? ((w = z),
            o === "top"
              ? d === "near" || m !== 0
                ? (W = -Z * V + V / 2)
                : d === "center"
                  ? (W = -$.highest.height / 2 - dt * V + V)
                  : (W = -$.highest.height + V / 2)
              : d === "near" || m !== 0
                ? (W = V / 2)
                : d === "center"
                  ? (W = $.highest.height / 2 - dt * V)
                  : (W = $.highest.height - Z * V),
            u && (W *= -1))
          : ((S = z), (W = ((1 - Z) * V) / 2));
        let ve;
        if (F.showLabelBackdrop) {
          let At = G(F.backdropPadding),
            xn = $.heights[_],
            _n = $.widths[_],
            yn = S + W - At.top,
            vn = w - At.left;
          switch (E) {
            case "middle":
              yn -= xn / 2;
              break;
            case "bottom":
              yn -= xn;
              break;
          }
          switch (M) {
            case "center":
              vn -= _n / 2;
              break;
            case "right":
              vn -= _n;
              break;
          }
          ve = {
            left: vn,
            top: yn,
            width: _n + At.width,
            height: xn + At.height,
            color: F.backdropColor,
          };
        }
        b.push({
          rotation: m,
          label: v,
          font: st,
          color: pn,
          strokeColor: mn,
          strokeWidth: bn,
          textOffset: W,
          textAlign: M,
          textBaseline: E,
          translation: [w, S],
          backdrop: ve,
        });
      }
      return b;
    }
    _getXAxisLabelAlignment() {
      let t = this,
        { position: e, ticks: n } = t.options;
      if (-Q(t.labelRotation)) return e === "top" ? "left" : "right";
      let o = "center";
      return (
        n.align === "start"
          ? (o = "left")
          : n.align === "end" && (o = "right"),
        o
      );
    }
    _getYAxisLabelAlignment(t) {
      let e = this,
        {
          position: n,
          ticks: { crossAlign: s, mirror: o, padding: a },
        } = e.options,
        r = e._getLabelSizes(),
        l = t + a,
        c = r.widest.width,
        d,
        h;
      return (
        n === "left"
          ? o
            ? ((d = "left"), (h = e.right + a))
            : ((h = e.right - l),
              s === "near"
                ? (d = "right")
                : s === "center"
                  ? ((d = "center"), (h -= c / 2))
                  : ((d = "left"), (h = e.left)))
          : n === "right"
            ? o
              ? ((d = "right"), (h = e.left + a))
              : ((h = e.left + l),
                s === "near"
                  ? (d = "left")
                  : s === "center"
                    ? ((d = "center"), (h += c / 2))
                    : ((d = "right"), (h = e.right)))
            : (d = "right"),
        { textAlign: d, x: h }
      );
    }
    _computeLabelArea() {
      let t = this;
      if (t.options.ticks.mirror) return;
      let e = t.chart,
        n = t.options.position;
      if (n === "left" || n === "right")
        return { top: 0, left: t.left, bottom: e.height, right: t.right };
      if (n === "top" || n === "bottom")
        return { top: t.top, left: 0, bottom: t.bottom, right: e.width };
    }
    drawBackground() {
      let {
        ctx: t,
        options: { backgroundColor: e },
        left: n,
        top: s,
        width: o,
        height: a,
      } = this;
      e && (t.save(), (t.fillStyle = e), t.fillRect(n, s, o, a), t.restore());
    }
    getLineWidthForValue(t) {
      let e = this,
        n = e.options.grid;
      if (!e._isVisible() || !n.display) return 0;
      let o = e.ticks.findIndex((a) => a.value === t);
      return o >= 0 ? n.setContext(e.getContext(o)).lineWidth : 0;
    }
    drawGrid(t) {
      let e = this,
        n = e.options.grid,
        s = e.ctx,
        o =
          e._gridLineItems || (e._gridLineItems = e._computeGridLineItems(t)),
        a,
        r,
        l = (c, d, h) => {
          !h.width ||
            !h.color ||
            (s.save(),
              (s.lineWidth = h.width),
              (s.strokeStyle = h.color),
              s.setLineDash(h.borderDash || []),
              (s.lineDashOffset = h.borderDashOffset),
              s.beginPath(),
              s.moveTo(c.x, c.y),
              s.lineTo(d.x, d.y),
              s.stroke(),
              s.restore());
        };
      if (n.display)
        for (a = 0, r = o.length; a < r; ++a) {
          let c = o[a];
          n.drawOnChartArea &&
            l({ x: c.x1, y: c.y1 }, { x: c.x2, y: c.y2 }, c),
            n.drawTicks &&
            l(
              { x: c.tx1, y: c.ty1 },
              { x: c.tx2, y: c.ty2 },
              {
                color: c.tickColor,
                width: c.tickWidth,
                borderDash: c.tickBorderDash,
                borderDashOffset: c.tickBorderDashOffset,
              }
            );
        }
    }
    drawBorder() {
      let t = this,
        {
          chart: e,
          ctx: n,
          options: { grid: s },
        } = t,
        o = s.setContext(t.getContext()),
        a = s.drawBorder ? o.borderWidth : 0;
      if (!a) return;
      let r = s.setContext(t.getContext(0)).lineWidth,
        l = t._borderValue,
        c,
        d,
        h,
        u;
      t.isHorizontal()
        ? ((c = gt(e, t.left, a) - a / 2),
          (d = gt(e, t.right, r) + r / 2),
          (h = u = l))
        : ((h = gt(e, t.top, a) - a / 2),
          (u = gt(e, t.bottom, r) + r / 2),
          (c = d = l)),
        n.save(),
        (n.lineWidth = o.borderWidth),
        (n.strokeStyle = o.borderColor),
        n.beginPath(),
        n.moveTo(c, h),
        n.lineTo(d, u),
        n.stroke(),
        n.restore();
    }
    drawLabels(t) {
      let e = this;
      if (!e.options.ticks.display) return;
      let s = e.ctx,
        o = e._computeLabelArea();
      o && Ve(s, o);
      let a = e._labelItems || (e._labelItems = e._computeLabelItems(t)),
        r,
        l;
      for (r = 0, l = a.length; r < l; ++r) {
        let c = a[r],
          d = c.font,
          h = c.label;
        c.backdrop &&
          ((s.fillStyle = c.backdrop.color),
            s.fillRect(
              c.backdrop.left,
              c.backdrop.top,
              c.backdrop.width,
              c.backdrop.height
            ));
        let u = c.textOffset;
        se(s, h, 0, u, d, c);
      }
      o && We(s);
    }
    drawTitle() {
      let {
        ctx: t,
        options: { position: e, title: n, reverse: s },
      } = this;
      if (!n.display) return;
      let o = N(n.font),
        a = G(n.padding),
        r = n.align,
        l = o.lineHeight / 2;
      e === "bottom"
        ? ((l += a.bottom),
          T(n.text) && (l += o.lineHeight * (n.text.length - 1)))
        : (l += a.top);
      let {
        titleX: c,
        titleY: d,
        maxWidth: h,
        rotation: u,
      } = _l(this, l, e, r);
      se(t, n.text, 0, 0, o, {
        color: n.color,
        maxWidth: h,
        rotation: u,
        textAlign: xl(r, e, s),
        textBaseline: "middle",
        translation: [c, d],
      });
    }
    draw(t) {
      let e = this;
      !e._isVisible() ||
        (e.drawBackground(),
          e.drawGrid(t),
          e.drawBorder(),
          e.drawTitle(),
          e.drawLabels(t));
    }
    _layers() {
      let t = this,
        e = t.options,
        n = (e.ticks && e.ticks.z) || 0,
        s = (e.grid && e.grid.z) || 0;
      return !t._isVisible() || t.draw !== bt.prototype.draw
        ? [
          {
            z: n,
            draw(o) {
              t.draw(o);
            },
          },
        ]
        : [
          {
            z: s,
            draw(o) {
              t.drawBackground(), t.drawGrid(o), t.drawTitle();
            },
          },
          {
            z: s + 1,
            draw() {
              t.drawBorder();
            },
          },
          {
            z: n,
            draw(o) {
              t.drawLabels(o);
            },
          },
        ];
    }
    getMatchingVisibleMetas(t) {
      let e = this,
        n = e.chart.getSortedVisibleDatasetMetas(),
        s = e.axis + "AxisID",
        o = [],
        a,
        r;
      for (a = 0, r = n.length; a < r; ++a) {
        let l = n[a];
        l[s] === e.id && (!t || l.type === t) && o.push(l);
      }
      return o;
    }
    _resolveTickFontOptions(t) {
      let e = this.options.ticks.setContext(this.getContext(t));
      return N(e.font);
    }
    _maxDigits() {
      let t = this,
        e = t._resolveTickFontOptions(0).lineHeight;
      return t.isHorizontal() ? t.width / e / 0.7 : t.height / e;
    }
  },
    pe = class {
      constructor(t, e, n) {
        (this.type = t),
          (this.scope = e),
          (this.override = n),
          (this.items = Object.create(null));
      }
      isForType(t) {
        return Object.prototype.isPrototypeOf.call(
          this.type.prototype,
          t.prototype
        );
      }
      register(t) {
        let e = this,
          n = Object.getPrototypeOf(t),
          s;
        wl(n) && (s = e.register(n));
        let o = e.items,
          a = t.id,
          r = e.scope + "." + a;
        if (!a) throw new Error("class does not have id: " + t);
        return (
          a in o ||
          ((o[a] = t),
            yl(t, r, s),
            e.override && k.override(t.id, t.overrides)),
          r
        );
      }
      get(t) {
        return this.items[t];
      }
      unregister(t) {
        let e = this.items,
          n = t.id,
          s = this.scope;
        n in e && delete e[n],
          s && n in k[s] && (delete k[s][n], this.override && delete ft[n]);
      }
    };
  function yl(i, t, e) {
    let n = zt(Object.create(null), [e ? k.get(e) : {}, k.get(t), i.defaults]);
    k.set(t, n),
      i.defaultRoutes && vl(t, i.defaultRoutes),
      i.descriptors && k.describe(t, i.descriptors);
  }
  function vl(i, t) {
    Object.keys(t).forEach((e) => {
      let n = e.split("."),
        s = n.pop(),
        o = [i].concat(n).join("."),
        a = t[e].split("."),
        r = a.pop(),
        l = a.join(".");
      k.route(o, s, l, r);
    });
  }
  function wl(i) {
    return "id" in i && "defaults" in i;
  }
  var So = class {
    constructor() {
      (this.controllers = new pe(J, "datasets", !0)),
        (this.elements = new pe(et, "elements")),
        (this.plugins = new pe(Object, "plugins")),
        (this.scales = new pe(bt, "scales")),
        (this._typedRegistries = [
          this.controllers,
          this.scales,
          this.elements,
        ]);
    }
    add(...t) {
      this._each("register", t);
    }
    remove(...t) {
      this._each("unregister", t);
    }
    addControllers(...t) {
      this._each("register", t, this.controllers);
    }
    addElements(...t) {
      this._each("register", t, this.elements);
    }
    addPlugins(...t) {
      this._each("register", t, this.plugins);
    }
    addScales(...t) {
      this._each("register", t, this.scales);
    }
    getController(t) {
      return this._get(t, this.controllers, "controller");
    }
    getElement(t) {
      return this._get(t, this.elements, "element");
    }
    getPlugin(t) {
      return this._get(t, this.plugins, "plugin");
    }
    getScale(t) {
      return this._get(t, this.scales, "scale");
    }
    removeControllers(...t) {
      this._each("unregister", t, this.controllers);
    }
    removeElements(...t) {
      this._each("unregister", t, this.elements);
    }
    removePlugins(...t) {
      this._each("unregister", t, this.plugins);
    }
    removeScales(...t) {
      this._each("unregister", t, this.scales);
    }
    _each(t, e, n) {
      let s = this;
      [...e].forEach((o) => {
        let a = n || s._getRegistryForType(o);
        n || a.isForType(o) || (a === s.plugins && o.id)
          ? s._exec(t, a, o)
          : D(o, (r) => {
            let l = n || s._getRegistryForType(r);
            s._exec(t, l, r);
          });
      });
    }
    _exec(t, e, n) {
      let s = Oe(t);
      R(n["before" + s], [], n), e[t](n), R(n["after" + s], [], n);
    }
    _getRegistryForType(t) {
      for (let e = 0; e < this._typedRegistries.length; e++) {
        let n = this._typedRegistries[e];
        if (n.isForType(t)) return n;
      }
      return this.plugins;
    }
    _get(t, e, n) {
      let s = e.get(t);
      if (s === void 0)
        throw new Error('"' + t + '" is not a registered ' + n + ".");
      return s;
    }
  },
    lt = new So(),
    Mo = class {
      constructor() {
        this._init = [];
      }
      notify(t, e, n, s) {
        let o = this;
        e === "beforeInit" &&
          ((o._init = o._createDescriptors(t, !0)),
            o._notify(o._init, t, "install"));
        let a = s ? o._descriptors(t).filter(s) : o._descriptors(t),
          r = o._notify(a, t, e, n);
        return (
          e === "destroy" &&
          (o._notify(a, t, "stop"), o._notify(o._init, t, "uninstall")),
          r
        );
      }
      _notify(t, e, n, s) {
        s = s || {};
        for (let o of t) {
          let a = o.plugin,
            r = a[n],
            l = [e, s, o.options];
          if (R(r, l, a) === !1 && s.cancelable) return !1;
        }
        return !0;
      }
      invalidate() {
        P(this._cache) ||
          ((this._oldCache = this._cache), (this._cache = void 0));
      }
      _descriptors(t) {
        if (this._cache) return this._cache;
        let e = (this._cache = this._createDescriptors(t));
        return this._notifyStateChanges(t), e;
      }
      _createDescriptors(t, e) {
        let n = t && t.config,
          s = C(n.options && n.options.plugins, {}),
          o = Sl(n);
        return s === !1 && !e ? [] : kl(t, o, s, e);
      }
      _notifyStateChanges(t) {
        let e = this._oldCache || [],
          n = this._cache,
          s = (o, a) =>
            o.filter((r) => !a.some((l) => r.plugin.id === l.plugin.id));
        this._notify(s(e, n), t, "stop"), this._notify(s(n, e), t, "start");
      }
    };
  function Sl(i) {
    let t = [],
      e = Object.keys(lt.plugins.items);
    for (let s = 0; s < e.length; s++) t.push(lt.getPlugin(e[s]));
    let n = i.plugins || [];
    for (let s = 0; s < n.length; s++) {
      let o = n[s];
      t.indexOf(o) === -1 && t.push(o);
    }
    return t;
  }
  function Ml(i, t) {
    return !t && i === !1 ? null : i === !0 ? {} : i;
  }
  function kl(i, t, e, n) {
    let s = [],
      o = i.getContext();
    for (let a = 0; a < t.length; a++) {
      let r = t[a],
        l = r.id,
        c = Ml(e[l], n);
      c !== null && s.push({ plugin: r, options: Pl(i.config, r, c, o) });
    }
    return s;
  }
  function Pl(i, t, e, n) {
    let s = i.pluginScopeKeys(t),
      o = i.getOptionScopes(e, s);
    return i.createResolver(o, n, [""], {
      scriptable: !1,
      indexable: !1,
      allKeys: !0,
    });
  }
  function ui(i, t) {
    let e = k.datasets[i] || {};
    return (
      ((t.datasets || {})[i] || {}).indexAxis ||
      t.indexAxis ||
      e.indexAxis ||
      "x"
    );
  }
  function Cl(i, t) {
    let e = i;
    return (
      i === "_index_"
        ? (e = t)
        : i === "_value_" && (e = t === "x" ? "y" : "x"),
      e
    );
  }
  function Dl(i, t) {
    return i === t ? "_index_" : "_value_";
  }
  function Ol(i) {
    if (i === "top" || i === "bottom") return "x";
    if (i === "left" || i === "right") return "y";
  }
  function fi(i, t) {
    return i === "x" || i === "y"
      ? i
      : t.axis || Ol(t.position) || i.charAt(0).toLowerCase();
  }
  function Al(i, t) {
    let e = ft[i.type] || { scales: {} },
      n = t.scales || {},
      s = ui(i.type, t),
      o = Object.create(null),
      a = Object.create(null);
    return (
      Object.keys(n).forEach((r) => {
        let l = n[r],
          c = fi(r, l),
          d = Dl(c, s),
          h = e.scales || {};
        (o[c] = o[c] || r),
          (a[r] = It(Object.create(null), [{ axis: c }, l, h[c], h[d]]));
      }),
      i.data.datasets.forEach((r) => {
        let l = r.type || i.type,
          c = r.indexAxis || ui(l, t),
          h = (ft[l] || {}).scales || {};
        Object.keys(h).forEach((u) => {
          let f = Cl(u, c),
            g = r[f + "AxisID"] || o[f] || f;
          (a[g] = a[g] || Object.create(null)),
            It(a[g], [{ axis: f }, n[g], h[u]]);
        });
      }),
      Object.keys(a).forEach((r) => {
        let l = a[r];
        It(l, [k.scales[l.type], k.scale]);
      }),
      a
    );
  }
  function ko(i) {
    let t = i.options || (i.options = {});
    (t.plugins = C(t.plugins, {})), (t.scales = Al(i, t));
  }
  function Po(i) {
    return (
      (i = i || {}),
      (i.datasets = i.datasets || []),
      (i.labels = i.labels || []),
      i
    );
  }
  function Tl(i) {
    return (i = i || {}), (i.data = Po(i.data)), ko(i), i;
  }
  var Co = new Map(),
    Do = new Set();
  function rn(i, t) {
    let e = Co.get(i);
    return e || ((e = t()), Co.set(i, e), Do.add(e)), e;
  }
  var me = (i, t, e) => {
    let n = ot(t, e);
    n !== void 0 && i.add(n);
  },
    Oo = class {
      constructor(t) {
        (this._config = Tl(t)),
          (this._scopeCache = new Map()),
          (this._resolverCache = new Map());
      }
      get type() {
        return this._config.type;
      }
      set type(t) {
        this._config.type = t;
      }
      get data() {
        return this._config.data;
      }
      set data(t) {
        this._config.data = Po(t);
      }
      get options() {
        return this._config.options;
      }
      set options(t) {
        this._config.options = t;
      }
      get plugins() {
        return this._config.plugins;
      }
      update() {
        let t = this._config;
        this.clearCache(), ko(t);
      }
      clearCache() {
        this._scopeCache.clear(), this._resolverCache.clear();
      }
      datasetScopeKeys(t) {
        return rn(t, () => [[`datasets.${t}`, ""]]);
      }
      datasetAnimationScopeKeys(t, e) {
        return rn(`${t}.transition.${e}`, () => [
          [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
          [`datasets.${t}`, ""],
        ]);
      }
      datasetElementScopeKeys(t, e) {
        return rn(`${t}-${e}`, () => [
          [`datasets.${t}.elements.${e}`, `datasets.${t}`, `elements.${e}`, ""],
        ]);
      }
      pluginScopeKeys(t) {
        let e = t.id,
          n = this.type;
        return rn(`${n}-plugin-${e}`, () => [
          [`plugins.${e}`, ...(t.additionalOptionScopes || [])],
        ]);
      }
      _cachedScopes(t, e) {
        let n = this._scopeCache,
          s = n.get(t);
        return (!s || e) && ((s = new Map()), n.set(t, s)), s;
      }
      getOptionScopes(t, e, n) {
        let { options: s, type: o } = this,
          a = this._cachedScopes(t, n),
          r = a.get(e);
        if (r) return r;
        let l = new Set();
        e.forEach((d) => {
          t && (l.add(t), d.forEach((h) => me(l, t, h))),
            d.forEach((h) => me(l, s, h)),
            d.forEach((h) => me(l, ft[o] || {}, h)),
            d.forEach((h) => me(l, k, h)),
            d.forEach((h) => me(l, Be, h));
        });
        let c = [...l];
        return Do.has(e) && a.set(e, c), c;
      }
      chartOptionScopes() {
        let { options: t, type: e } = this;
        return [t, ft[e] || {}, k.datasets[e] || {}, { type: e }, k, Be];
      }
      resolveNamedOptions(t, e, n, s = [""]) {
        let o = { $shared: !0 },
          { resolver: a, subPrefixes: r } = Ao(this._resolverCache, t, s),
          l = a;
        if (Rl(a, e)) {
          (o.$shared = !1), (n = St(n) ? n() : n);
          let c = this.createResolver(t, n, r);
          l = kt(a, n, c);
        }
        for (let c of e) o[c] = l[c];
        return o;
      }
      createResolver(t, e, n = [""], s) {
        let { resolver: o } = Ao(this._resolverCache, t, n);
        return O(e) ? kt(o, e, void 0, s) : o;
      }
    };
  function Ao(i, t, e) {
    let n = i.get(t);
    n || ((n = new Map()), i.set(t, n));
    let s = e.join(),
      o = n.get(s);
    return (
      o ||
      ((o = {
        resolver: $e(t, e),
        subPrefixes: e.filter((r) => !r.toLowerCase().includes("hover")),
      }),
        n.set(s, o)),
      o
    );
  }
  function Rl(i, t) {
    let { isScriptable: e, isIndexable: n } = Zn(i);
    for (let s of t) if ((e(s) && St(i[s])) || (n(s) && T(i[s]))) return !0;
    return !1;
  }
  var Ll = "3.2.1",
    El = ["top", "bottom", "left", "right", "chartArea"];
  function To(i, t) {
    return i === "top" || i === "bottom" || (El.indexOf(i) === -1 && t === "x");
  }
  function Ro(i, t) {
    return function (e, n) {
      return e[i] === n[i] ? e[t] - n[t] : e[i] - n[i];
    };
  }
  function Lo(i) {
    let t = i.chart,
      e = t.options.animation;
    t.notifyPlugins("afterRender"), R(e && e.onComplete, [i], t);
  }
  function Fl(i) {
    let t = i.chart,
      e = t.options.animation;
    R(e && e.onProgress, [i], t);
  }
  function Eo() {
    return typeof window != "undefined" && typeof document != "undefined";
  }
  function Fo(i) {
    return (
      Eo() && typeof i == "string"
        ? (i = document.getElementById(i))
        : i && i.length && (i = i[0]),
      i && i.canvas && (i = i.canvas),
      i
    );
  }
  var ln = {},
    zo = (i) => {
      let t = Fo(i);
      return Object.values(ln)
        .filter((e) => e.canvas === t)
        .pop();
    },
    nt = class {
      constructor(t, e) {
        let n = this;
        this.config = e = new Oo(e);
        let s = Fo(t),
          o = zo(s);
        if (o)
          throw new Error(
            "Canvas is already in use. Chart with ID '" +
            o.id +
            "' must be destroyed before the canvas can be reused."
          );
        let a = e.createResolver(e.chartOptionScopes(), n.getContext());
        this.platform = n._initializePlatform(s, e);
        let r = n.platform.acquireContext(s, a.aspectRatio),
          l = r && r.canvas,
          c = l && l.height,
          d = l && l.width;
        if (
          ((this.id = Zi()),
            (this.ctx = r),
            (this.canvas = l),
            (this.width = d),
            (this.height = c),
            (this._options = a),
            (this._aspectRatio = this.aspectRatio),
            (this._layers = []),
            (this._metasets = []),
            (this._stacks = void 0),
            (this.boxes = []),
            (this.currentDevicePixelRatio = void 0),
            (this.chartArea = void 0),
            (this._active = []),
            (this._lastEvent = void 0),
            (this._listeners = {}),
            (this._sortedMetasets = []),
            (this.scales = {}),
            (this.scale = void 0),
            (this._plugins = new Mo()),
            (this.$proxies = {}),
            (this._hiddenIndices = {}),
            (this.attached = !1),
            (this._animationsDisabled = void 0),
            (this.$context = void 0),
            (this._doResize = Ki(
              () => this.update("resize"),
              a.resizeDelay || 0
            )),
            (ln[n.id] = n),
            !r || !l)
        ) {
          console.error(
            "Failed to create chart: can't acquire context from the given item"
          );
          return;
        }
        rt.listen(n, "complete", Lo),
          rt.listen(n, "progress", Fl),
          n._initialize(),
          n.attached && n.update();
      }
      get aspectRatio() {
        let {
          options: { aspectRatio: t, maintainAspectRatio: e },
          width: n,
          height: s,
          _aspectRatio: o,
        } = this;
        return P(t) ? (e && o ? o : s ? n / s : null) : t;
      }
      get data() {
        return this.config.data;
      }
      set data(t) {
        this.config.data = t;
      }
      get options() {
        return this._options;
      }
      set options(t) {
        this.config.options = t;
      }
      _initialize() {
        let t = this;
        return (
          t.notifyPlugins("beforeInit"),
          t.options.responsive ? t.resize() : ei(t, t.options.devicePixelRatio),
          t.bindEvents(),
          t.notifyPlugins("afterInit"),
          t
        );
      }
      _initializePlatform(t, e) {
        return e.platform
          ? new e.platform()
          : !Eo() ||
            (typeof OffscreenCanvas != "undefined" &&
              t instanceof OffscreenCanvas)
            ? new fo()
            : new xo();
      }
      clear() {
        return Yn(this.canvas, this.ctx), this;
      }
      stop() {
        return rt.stop(this), this;
      }
      resize(t, e) {
        rt.running(this)
          ? (this._resizeBeforeDraw = { width: t, height: e })
          : this._resize(t, e);
      }
      _resize(t, e) {
        let n = this,
          s = n.options,
          o = n.canvas,
          a = s.maintainAspectRatio && n.aspectRatio,
          r = n.platform.getMaximumSize(o, t, e, a),
          l = n.currentDevicePixelRatio,
          c = s.devicePixelRatio || n.platform.getDevicePixelRatio();
        (n.width === r.width && n.height === r.height && l === c) ||
          ((n.width = r.width),
            (n.height = r.height),
            (n._aspectRatio = n.aspectRatio),
            ei(n, c, !0),
            n.notifyPlugins("resize", { size: r }),
            R(s.onResize, [n, r], n),
            n.attached && n._doResize() && n.render());
      }
      ensureScalesHaveIDs() {
        let e = this.options.scales || {};
        D(e, (n, s) => {
          n.id = s;
        });
      }
      buildOrUpdateScales() {
        let t = this,
          e = t.options,
          n = e.scales,
          s = t.scales,
          o = Object.keys(s).reduce((r, l) => ((r[l] = !1), r), {}),
          a = [];
        n &&
          (a = a.concat(
            Object.keys(n).map((r) => {
              let l = n[r],
                c = fi(r, l),
                d = c === "r",
                h = c === "x";
              return {
                options: l,
                dposition: d ? "chartArea" : h ? "bottom" : "left",
                dtype: d ? "radialLinear" : h ? "category" : "linear",
              };
            })
          )),
          D(a, (r) => {
            let l = r.options,
              c = l.id,
              d = fi(c, l),
              h = C(l.type, r.dtype);
            (l.position === void 0 || To(l.position, d) !== To(r.dposition)) &&
              (l.position = r.dposition),
              (o[c] = !0);
            let u = null;
            if (c in s && s[c].type === h) u = s[c];
            else {
              let f = lt.getScale(h);
              (u = new f({ id: c, type: h, ctx: t.ctx, chart: t })),
                (s[u.id] = u);
            }
            u.init(l, e);
          }),
          D(o, (r, l) => {
            r || delete s[l];
          }),
          D(s, (r) => {
            nn.configure(t, r, r.options), nn.addBox(t, r);
          });
      }
      _updateMetasetIndex(t, e) {
        let n = this._metasets,
          s = t.index;
        s !== e && ((n[s] = n[e]), (n[e] = t), (t.index = e));
      }
      _updateMetasets() {
        let t = this,
          e = t._metasets,
          n = t.data.datasets.length,
          s = e.length;
        if (s > n) {
          for (let o = n; o < s; ++o) t._destroyDatasetMeta(o);
          e.splice(n, s - n);
        }
        t._sortedMetasets = e.slice(0).sort(Ro("order", "index"));
      }
      _removeUnreferencedMetasets() {
        let t = this,
          {
            _metasets: e,
            data: { datasets: n },
          } = t;
        e.length > n.length && delete t._stacks,
          e.forEach((s, o) => {
            n.filter((a) => a === s._dataset).length === 0 &&
              t._destroyDatasetMeta(o);
          });
      }
      buildOrUpdateControllers() {
        let t = this,
          e = [],
          n = t.data.datasets,
          s,
          o;
        for (t._removeUnreferencedMetasets(), s = 0, o = n.length; s < o; s++) {
          let a = n[s],
            r = t.getDatasetMeta(s),
            l = a.type || t.config.type;
          if (
            (r.type &&
              r.type !== l &&
              (t._destroyDatasetMeta(s), (r = t.getDatasetMeta(s))),
              (r.type = l),
              (r.indexAxis = a.indexAxis || ui(l, t.options)),
              (r.order = a.order || 0),
              t._updateMetasetIndex(r, s),
              (r.label = "" + a.label),
              (r.visible = t.isDatasetVisible(s)),
              r.controller)
          )
            r.controller.updateIndex(s), r.controller.linkScales();
          else {
            let c = lt.getController(l),
              { datasetElementType: d, dataElementType: h } = k.datasets[l];
            Object.assign(c.prototype, {
              dataElementType: lt.getElement(h),
              datasetElementType: d && lt.getElement(d),
            }),
              (r.controller = new c(t, s)),
              e.push(r.controller);
          }
        }
        return t._updateMetasets(), e;
      }
      _resetElements() {
        let t = this;
        D(
          t.data.datasets,
          (e, n) => {
            t.getDatasetMeta(n).controller.reset();
          },
          t
        );
      }
      reset() {
        this._resetElements(), this.notifyPlugins("reset");
      }
      update(t) {
        let e = this,
          n = e.config;
        n.update(),
          (e._options = n.createResolver(
            n.chartOptionScopes(),
            e.getContext()
          )),
          D(e.scales, (c) => {
            nn.removeBox(e, c);
          });
        let s = (e._animationsDisabled = !e.options.animation);
        e.ensureScalesHaveIDs(), e.buildOrUpdateScales();
        let o = new Set(Object.keys(e._listeners)),
          a = new Set(e.options.events);
        if (
          (es(o, a) || (e.unbindEvents(), e.bindEvents()),
            e._plugins.invalidate(),
            e.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }) === !1)
        )
          return;
        let r = e.buildOrUpdateControllers();
        e.notifyPlugins("beforeElementsUpdate");
        let l = 0;
        for (let c = 0, d = e.data.datasets.length; c < d; c++) {
          let { controller: h } = e.getDatasetMeta(c),
            u = !s && r.indexOf(h) === -1;
          h.buildOrUpdateElements(u), (l = Math.max(+h.getMaxOverflow(), l));
        }
        (e._minPadding = l),
          e._updateLayout(l),
          s ||
          D(r, (c) => {
            c.reset();
          }),
          e._updateDatasets(t),
          e.notifyPlugins("afterUpdate", { mode: t }),
          e._layers.sort(Ro("z", "_idx")),
          e._lastEvent && e._eventHandler(e._lastEvent, !0),
          e.render();
      }
      _updateLayout(t) {
        let e = this;
        if (e.notifyPlugins("beforeLayout", { cancelable: !0 }) === !1) return;
        nn.update(e, e.width, e.height, t);
        let n = e.chartArea,
          s = n.width <= 0 || n.height <= 0;
        (e._layers = []),
          D(
            e.boxes,
            (o) => {
              (s && o.position === "chartArea") ||
                (o.configure && o.configure(), e._layers.push(...o._layers()));
            },
            e
          ),
          e._layers.forEach((o, a) => {
            o._idx = a;
          }),
          e.notifyPlugins("afterLayout");
      }
      _updateDatasets(t) {
        let e = this,
          n = typeof t == "function";
        if (
          e.notifyPlugins("beforeDatasetsUpdate", {
            mode: t,
            cancelable: !0,
          }) !== !1
        ) {
          for (let s = 0, o = e.data.datasets.length; s < o; ++s)
            e._updateDataset(s, n ? t({ datasetIndex: s }) : t);
          e.notifyPlugins("afterDatasetsUpdate", { mode: t });
        }
      }
      _updateDataset(t, e) {
        let n = this,
          s = n.getDatasetMeta(t),
          o = { meta: s, index: t, mode: e, cancelable: !0 };
        n.notifyPlugins("beforeDatasetUpdate", o) !== !1 &&
          (s.controller._update(e),
            (o.cancelable = !1),
            n.notifyPlugins("afterDatasetUpdate", o));
      }
      render() {
        let t = this;
        t.notifyPlugins("beforeRender", { cancelable: !0 }) !== !1 &&
          (rt.has(t)
            ? t.attached && !rt.running(t) && rt.start(t)
            : (t.draw(), Lo({ chart: t })));
      }
      draw() {
        let t = this,
          e;
        if (t._resizeBeforeDraw) {
          let { width: s, height: o } = t._resizeBeforeDraw;
          t._resize(s, o), (t._resizeBeforeDraw = null);
        }
        if (
          (t.clear(),
            t.width <= 0 ||
            t.height <= 0 ||
            t.notifyPlugins("beforeDraw", { cancelable: !0 }) === !1)
        )
          return;
        let n = t._layers;
        for (e = 0; e < n.length && n[e].z <= 0; ++e) n[e].draw(t.chartArea);
        for (t._drawDatasets(); e < n.length; ++e) n[e].draw(t.chartArea);
        t.notifyPlugins("afterDraw");
      }
      _getSortedDatasetMetas(t) {
        let n = this._sortedMetasets,
          s = [],
          o,
          a;
        for (o = 0, a = n.length; o < a; ++o) {
          let r = n[o];
          (!t || r.visible) && s.push(r);
        }
        return s;
      }
      getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(!0);
      }
      _drawDatasets() {
        let t = this;
        if (t.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 }) === !1)
          return;
        let e = t.getSortedVisibleDatasetMetas();
        for (let n = e.length - 1; n >= 0; --n) t._drawDataset(e[n]);
        t.notifyPlugins("afterDatasetsDraw");
      }
      _drawDataset(t) {
        let e = this,
          n = e.ctx,
          s = t._clip,
          o = e.chartArea,
          a = { meta: t, index: t.index, cancelable: !0 };
        e.notifyPlugins("beforeDatasetDraw", a) !== !1 &&
          (Ve(n, {
            left: s.left === !1 ? 0 : o.left - s.left,
            right: s.right === !1 ? e.width : o.right + s.right,
            top: s.top === !1 ? 0 : o.top - s.top,
            bottom: s.bottom === !1 ? e.height : o.bottom + s.bottom,
          }),
            t.controller.draw(),
            We(n),
            (a.cancelable = !1),
            e.notifyPlugins("afterDatasetDraw", a));
      }
      getElementsAtEventForMode(t, e, n, s) {
        let o = Wr.modes[e];
        return typeof o == "function" ? o(this, t, n, s) : [];
      }
      getDatasetMeta(t) {
        let e = this,
          n = e.data.datasets[t],
          s = e._metasets,
          o = s.filter((a) => a && a._dataset === n).pop();
        return (
          o ||
          (o = s[t] =
          {
            type: null,
            data: [],
            dataset: null,
            controller: null,
            hidden: null,
            xAxisID: null,
            yAxisID: null,
            order: (n && n.order) || 0,
            index: t,
            _dataset: n,
            _parsed: [],
            _sorted: !1,
          }),
          o
        );
      }
      getContext() {
        return (
          this.$context || (this.$context = { chart: this, type: "chart" })
        );
      }
      getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
      }
      isDatasetVisible(t) {
        let e = this.data.datasets[t];
        if (!e) return !1;
        let n = this.getDatasetMeta(t);
        return typeof n.hidden == "boolean" ? !n.hidden : !e.hidden;
      }
      setDatasetVisibility(t, e) {
        let n = this.getDatasetMeta(t);
        n.hidden = !e;
      }
      toggleDataVisibility(t) {
        this._hiddenIndices[t] = !this._hiddenIndices[t];
      }
      getDataVisibility(t) {
        return !this._hiddenIndices[t];
      }
      _updateDatasetVisibility(t, e) {
        let n = this,
          s = e ? "show" : "hide",
          o = n.getDatasetMeta(t),
          a = o.controller._resolveAnimations(void 0, s);
        n.setDatasetVisibility(t, e),
          a.update(o, { visible: e }),
          n.update((r) => (r.datasetIndex === t ? s : void 0));
      }
      hide(t) {
        this._updateDatasetVisibility(t, !1);
      }
      show(t) {
        this._updateDatasetVisibility(t, !0);
      }
      _destroyDatasetMeta(t) {
        let e = this,
          n = e._metasets && e._metasets[t];
        n && n.controller && (n.controller._destroy(), delete e._metasets[t]);
      }
      destroy() {
        let t = this,
          { canvas: e, ctx: n } = t,
          s,
          o;
        for (
          t.stop(), rt.remove(t), s = 0, o = t.data.datasets.length;
          s < o;
          ++s
        )
          t._destroyDatasetMeta(s);
        t.config.clearCache(),
          e &&
          (t.unbindEvents(),
            Yn(e, n),
            t.platform.releaseContext(n),
            (t.canvas = null),
            (t.ctx = null)),
          t.notifyPlugins("destroy"),
          delete ln[t.id];
      }
      toBase64Image(...t) {
        return this.canvas.toDataURL(...t);
      }
      bindEvents() {
        let t = this,
          e = t._listeners,
          n = t.platform,
          s = (r, l) => {
            n.addEventListener(t, r, l), (e[r] = l);
          },
          o = (r, l) => {
            e[r] && (n.removeEventListener(t, r, l), delete e[r]);
          },
          a = function (r, l, c) {
            (r.offsetX = l), (r.offsetY = c), t._eventHandler(r);
          };
        if ((D(t.options.events, (r) => s(r, a)), t.options.responsive)) {
          a = (c, d) => {
            t.canvas && t.resize(c, d);
          };
          let r,
            l = () => {
              o("attach", l),
                (t.attached = !0),
                t.resize(),
                s("resize", a),
                s("detach", r);
            };
          (r = () => {
            (t.attached = !1), o("resize", a), s("attach", l);
          }),
            n.isAttached(t.canvas) ? l() : r();
        } else t.attached = !0;
      }
      unbindEvents() {
        let t = this,
          e = t._listeners;
        !e ||
          ((t._listeners = {}),
            D(e, (n, s) => {
              t.platform.removeEventListener(t, s, n);
            }));
      }
      updateHoverStyle(t, e, n) {
        let s = n ? "set" : "remove",
          o,
          a,
          r,
          l;
        for (
          e === "dataset" &&
          ((o = this.getDatasetMeta(t[0].datasetIndex)),
            o.controller["_" + s + "DatasetHoverStyle"]()),
          r = 0,
          l = t.length;
          r < l;
          ++r
        ) {
          a = t[r];
          let c = a && this.getDatasetMeta(a.datasetIndex).controller;
          c && c[s + "HoverStyle"](a.element, a.datasetIndex, a.index);
        }
      }
      getActiveElements() {
        return this._active || [];
      }
      setActiveElements(t) {
        let e = this,
          n = e._active || [],
          s = t.map(({ datasetIndex: a, index: r }) => {
            let l = e.getDatasetMeta(a);
            if (!l) throw new Error("No dataset found at index " + a);
            return { datasetIndex: a, element: l.data[r], index: r };
          });
        !qt(s, n) && ((e._active = s), e._updateHoverStyles(s, n));
      }
      notifyPlugins(t, e, n) {
        return this._plugins.notify(this, t, e, n);
      }
      _updateHoverStyles(t, e, n) {
        let s = this,
          o = s.options.hover,
          a = (c, d) =>
            c.filter(
              (h) =>
                !d.some(
                  (u) =>
                    h.datasetIndex === u.datasetIndex && h.index === u.index
                )
            ),
          r = a(e, t),
          l = n ? t : a(t, e);
        r.length && s.updateHoverStyle(r, o.mode, !1),
          l.length && o.mode && s.updateHoverStyle(l, o.mode, !0);
      }
      _eventHandler(t, e) {
        let n = this,
          s = { event: t, replay: e, cancelable: !0 },
          o = (r) => (r.options.events || this.options.events).includes(t.type);
        if (n.notifyPlugins("beforeEvent", s, o) === !1) return;
        let a = n._handleEvent(t, e);
        return (
          (s.cancelable = !1),
          n.notifyPlugins("afterEvent", s, o),
          (a || s.changed) && n.render(),
          n
        );
      }
      _handleEvent(t, e) {
        let n = this,
          { _active: s = [], options: o } = n,
          a = o.hover,
          r = e,
          l = [],
          c = !1,
          d = null;
        return (
          t.type !== "mouseout" &&
          ((l = n.getElementsAtEventForMode(t, a.mode, a, r)),
            (d = t.type === "click" ? n._lastEvent : t)),
          (n._lastEvent = null),
          Ht(t, n.chartArea, n._minPadding) &&
          (R(o.onHover, [t, l, n], n),
            (t.type === "mouseup" ||
              t.type === "click" ||
              t.type === "contextmenu") &&
            R(o.onClick, [t, l, n], n)),
          (c = !qt(l, s)),
          (c || e) && ((n._active = l), n._updateHoverStyles(l, s, e)),
          (n._lastEvent = d),
          c
        );
      }
    },
    Io = () => D(nt.instances, (i) => i._plugins.invalidate()),
    xt = !0;
  Object.defineProperties(nt, {
    defaults: { enumerable: xt, value: k },
    instances: { enumerable: xt, value: ln },
    overrides: { enumerable: xt, value: ft },
    registry: { enumerable: xt, value: lt },
    version: { enumerable: xt, value: Ll },
    getChart: { enumerable: xt, value: zo },
    register: {
      enumerable: xt,
      value: (...i) => {
        lt.add(...i), Io();
      },
    },
    unregister: {
      enumerable: xt,
      value: (...i) => {
        lt.remove(...i), Io();
      },
    },
  });
  function Bo(i, t) {
    let {
      startAngle: e,
      endAngle: n,
      pixelMargin: s,
      x: o,
      y: a,
      outerRadius: r,
      innerRadius: l,
    } = t,
      c = s / r;
    i.beginPath(),
      i.arc(o, a, r, e - c, n + c),
      l > s
        ? ((c = s / l), i.arc(o, a, l, n + c, e - c, !0))
        : i.arc(o, a, s, n + L, e - L),
      i.closePath(),
      i.clip();
  }
  function zl(i) {
    return je(i, ["outerStart", "outerEnd", "innerStart", "innerEnd"]);
  }
  function Il(i, t, e, n) {
    let s = zl(i.options.borderRadius),
      o = (e - t) / 2,
      a = Math.min(o, (n * t) / 2),
      r = (l) => {
        let c = ((e - Math.min(o, l)) * n) / 2;
        return X(l, 0, Math.min(o, c));
      };
    return {
      outerStart: r(s.outerStart),
      outerEnd: r(s.outerEnd),
      innerStart: X(s.innerStart, 0, a),
      innerEnd: X(s.innerEnd, 0, a),
    };
  }
  function Nt(i, t, e, n) {
    return { x: e + i * Math.cos(t), y: n + i * Math.sin(t) };
  }
  function gi(i, t) {
    let { x: e, y: n, startAngle: s, endAngle: o, pixelMargin: a } = t,
      r = Math.max(t.outerRadius - a, 0),
      l = t.innerRadius + a,
      {
        outerStart: c,
        outerEnd: d,
        innerStart: h,
        innerEnd: u,
      } = Il(t, l, r, o - s),
      f = r - c,
      g = r - d,
      p = s + c / f,
      m = o - d / g,
      b = l + h,
      _ = l + u,
      y = s + h / b,
      x = o - u / _;
    if ((i.beginPath(), i.arc(e, n, r, p, m), d > 0)) {
      let S = Nt(g, m, e, n);
      i.arc(S.x, S.y, d, m, o + L);
    }
    let v = Nt(_, o, e, n);
    if ((i.lineTo(v.x, v.y), u > 0)) {
      let S = Nt(_, x, e, n);
      i.arc(S.x, S.y, u, o + L, x + Math.PI);
    }
    if ((i.arc(e, n, l, o - u / l, s + h / l, !0), h > 0)) {
      let S = Nt(b, y, e, n);
      i.arc(S.x, S.y, h, y + Math.PI, s - L);
    }
    let w = Nt(f, s, e, n);
    if ((i.lineTo(w.x, w.y), c > 0)) {
      let S = Nt(f, p, e, n);
      i.arc(S.x, S.y, c, s - L, p);
    }
    i.closePath();
  }
  function Bl(i, t) {
    if (t.fullCircles) {
      (t.endAngle = t.startAngle + A), gi(i, t);
      for (let e = 0; e < t.fullCircles; ++e) i.fill();
    }
    isNaN(t.circumference) ||
      (t.endAngle = t.startAngle + (t.circumference % A)),
      gi(i, t),
      i.fill();
  }
  function Hl(i, t, e) {
    let { x: n, y: s, startAngle: o, endAngle: a, pixelMargin: r } = t,
      l = Math.max(t.outerRadius - r, 0),
      c = t.innerRadius + r,
      d;
    for (
      e &&
      ((t.endAngle = t.startAngle + A),
        Bo(i, t),
        (t.endAngle = a),
        t.endAngle === t.startAngle && ((t.endAngle += A), t.fullCircles--)),
      i.beginPath(),
      i.arc(n, s, c, o + A, o, !0),
      d = 0;
      d < t.fullCircles;
      ++d
    )
      i.stroke();
    for (i.beginPath(), i.arc(n, s, l, o, o + A), d = 0; d < t.fullCircles; ++d)
      i.stroke();
  }
  function Vl(i, t) {
    let { options: e } = t,
      n = e.borderAlign === "inner";
    !e.borderWidth ||
      (n
        ? ((i.lineWidth = e.borderWidth * 2), (i.lineJoin = "round"))
        : ((i.lineWidth = e.borderWidth), (i.lineJoin = "bevel")),
        t.fullCircles && Hl(i, t, n),
        n && Bo(i, t),
        gi(i, t),
        i.stroke());
  }
  var cn = class extends et {
    constructor(t) {
      super();
      (this.options = void 0),
        (this.circumference = void 0),
        (this.startAngle = void 0),
        (this.endAngle = void 0),
        (this.innerRadius = void 0),
        (this.outerRadius = void 0),
        (this.pixelMargin = 0),
        (this.fullCircles = 0),
        t && Object.assign(this, t);
    }
    inRange(t, e, n) {
      let s = this.getProps(["x", "y"], n),
        { angle: o, distance: a } = as(s, { x: t, y: e }),
        {
          startAngle: r,
          endAngle: l,
          innerRadius: c,
          outerRadius: d,
          circumference: h,
        } = this.getProps(
          [
            "startAngle",
            "endAngle",
            "innerRadius",
            "outerRadius",
            "circumference",
          ],
          n
        ),
        u = h >= A || Zt(o, r, l),
        f = a >= c && a <= d;
      return u && f;
    }
    getCenterPoint(t) {
      let {
        x: e,
        y: n,
        startAngle: s,
        endAngle: o,
        innerRadius: a,
        outerRadius: r,
      } = this.getProps(
        ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"],
        t
      ),
        l = (s + o) / 2,
        c = (a + r) / 2;
      return { x: e + Math.cos(l) * c, y: n + Math.sin(l) * c };
    }
    tooltipPosition(t) {
      return this.getCenterPoint(t);
    }
    draw(t) {
      let e = this,
        n = e.options,
        s = n.offset || 0;
      if (
        ((e.pixelMargin = n.borderAlign === "inner" ? 0.33 : 0),
          (e.fullCircles = Math.floor(e.circumference / A)),
          !(e.circumference === 0 || e.innerRadius < 0 || e.outerRadius < 0))
      ) {
        if ((t.save(), s && e.circumference < A)) {
          let o = (e.startAngle + e.endAngle) / 2;
          t.translate(Math.cos(o) * s, Math.sin(o) * s);
        }
        (t.fillStyle = n.backgroundColor),
          (t.strokeStyle = n.borderColor),
          Bl(t, e),
          Vl(t, e),
          t.restore();
      }
    }
  };
  cn.id = "arc";
  cn.defaults = {
    borderAlign: "center",
    borderColor: "#fff",
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    angle: void 0,
  };
  cn.defaultRoutes = { backgroundColor: "backgroundColor" };
  function Ho(i, t, e = t) {
    (i.lineCap = C(e.borderCapStyle, t.borderCapStyle)),
      i.setLineDash(C(e.borderDash, t.borderDash)),
      (i.lineDashOffset = C(e.borderDashOffset, t.borderDashOffset)),
      (i.lineJoin = C(e.borderJoinStyle, t.borderJoinStyle)),
      (i.lineWidth = C(e.borderWidth, t.borderWidth)),
      (i.strokeStyle = C(e.borderColor, t.borderColor));
  }
  function Wl(i, t, e) {
    i.lineTo(e.x, e.y);
  }
  function Nl(i) {
    return i.stepped
      ? vs
      : i.tension || i.cubicInterpolationMode === "monotone"
        ? ws
        : Wl;
  }
  function Vo(i, t, e = {}) {
    let n = i.length,
      { start: s = 0, end: o = n - 1 } = e,
      { start: a, end: r } = t,
      l = Math.max(s, a),
      c = Math.min(o, r),
      d = (s < a && o < a) || (s > r && o > r);
    return {
      count: n,
      start: l,
      loop: t.loop,
      ilen: c < l && !d ? n + c - l : c - l,
    };
  }
  function jl(i, t, e, n) {
    let { points: s, options: o } = t,
      { count: a, start: r, loop: l, ilen: c } = Vo(s, e, n),
      d = Nl(o),
      { move: h = !0, reverse: u } = n || {},
      f,
      g,
      p;
    for (f = 0; f <= c; ++f)
      (g = s[(r + (u ? c - f : f)) % a]),
        !g.skip &&
        (h ? (i.moveTo(g.x, g.y), (h = !1)) : d(i, p, g, u, o.stepped),
          (p = g));
    return l && ((g = s[(r + (u ? c : 0)) % a]), d(i, p, g, u, o.stepped)), !!l;
  }
  function $l(i, t, e, n) {
    let s = t.points,
      { count: o, start: a, ilen: r } = Vo(s, e, n),
      { move: l = !0, reverse: c } = n || {},
      d = 0,
      h = 0,
      u,
      f,
      g,
      p,
      m,
      b,
      _ = (x) => (a + (c ? r - x : x)) % o,
      y = () => {
        p !== m && (i.lineTo(d, m), i.lineTo(d, p), i.lineTo(d, b));
      };
    for (l && ((f = s[_(0)]), i.moveTo(f.x, f.y)), u = 0; u <= r; ++u) {
      if (((f = s[_(u)]), f.skip)) continue;
      let x = f.x,
        v = f.y,
        w = x | 0;
      w === g
        ? (v < p ? (p = v) : v > m && (m = v), (d = (h * d + x) / ++h))
        : (y(), i.lineTo(x, v), (g = w), (h = 0), (p = m = v)),
        (b = v);
    }
    y();
  }
  function pi(i) {
    let t = i.options,
      e = t.borderDash && t.borderDash.length;
    return !i._decimated &&
      !i._loop &&
      !t.tension &&
      t.cubicInterpolationMode !== "monotone" &&
      !t.stepped &&
      !e
      ? $l
      : jl;
  }
  function Ul(i) {
    return i.stepped
      ? Is
      : i.tension || i.cubicInterpolationMode === "monotone"
        ? Bs
        : mt;
  }
  function Yl(i, t, e, n) {
    let s = t._path;
    s || ((s = t._path = new Path2D()), t.path(s, e, n) && s.closePath()),
      Ho(i, t.options),
      i.stroke(s);
  }
  function Xl(i, t, e, n) {
    let { segments: s, options: o } = t,
      a = pi(t);
    for (let r of s)
      Ho(i, o, r.style),
        i.beginPath(),
        a(i, t, r, { start: e, end: e + n - 1 }) && i.closePath(),
        i.stroke();
  }
  var ql = typeof Path2D == "function";
  function Kl(i, t, e, n) {
    ql && t.segments.length === 1 ? Yl(i, t, e, n) : Xl(i, t, e, n);
  }
  var Ot = class extends et {
    constructor(t) {
      super();
      (this.animated = !0),
        (this.options = void 0),
        (this._loop = void 0),
        (this._fullLoop = void 0),
        (this._path = void 0),
        (this._points = void 0),
        (this._segments = void 0),
        (this._decimated = !1),
        (this._pointsUpdated = !1),
        t && Object.assign(this, t);
    }
    updateControlPoints(t) {
      let e = this,
        n = e.options;
      if (
        (n.tension || n.cubicInterpolationMode === "monotone") &&
        !n.stepped &&
        !e._pointsUpdated
      ) {
        let s = n.spanGaps ? e._loop : e._fullLoop;
        Es(e._points, n, t, s), (e._pointsUpdated = !0);
      }
    }
    set points(t) {
      let e = this;
      (e._points = t),
        delete e._segments,
        delete e._path,
        (e._pointsUpdated = !1);
    }
    get points() {
      return this._points;
    }
    get segments() {
      return (
        this._segments || (this._segments = Ys(this, this.options.segment))
      );
    }
    first() {
      let t = this.segments,
        e = this.points;
      return t.length && e[t[0].start];
    }
    last() {
      let t = this.segments,
        e = this.points,
        n = t.length;
      return n && e[t[n - 1].end];
    }
    interpolate(t, e) {
      let n = this,
        s = n.options,
        o = t[e],
        a = n.points,
        r = Us(n, { property: e, start: o, end: o });
      if (!r.length) return;
      let l = [],
        c = Ul(s),
        d,
        h;
      for (d = 0, h = r.length; d < h; ++d) {
        let { start: u, end: f } = r[d],
          g = a[u],
          p = a[f];
        if (g === p) {
          l.push(g);
          continue;
        }
        let m = Math.abs((o - g[e]) / (p[e] - g[e])),
          b = c(g, p, m, s.stepped);
        (b[e] = t[e]), l.push(b);
      }
      return l.length === 1 ? l[0] : l;
    }
    pathSegment(t, e, n) {
      return pi(this)(t, this, e, n);
    }
    path(t, e, n) {
      let s = this,
        o = s.segments,
        a = pi(s),
        r = s._loop;
      (e = e || 0), (n = n || s.points.length - e);
      for (let l of o) r &= a(t, s, l, { start: e, end: e + n - 1 });
      return !!r;
    }
    draw(t, e, n, s) {
      let o = this,
        a = o.options || {};
      !(o.points || []).length ||
        !a.borderWidth ||
        (t.save(),
          Kl(t, o, n, s),
          t.restore(),
          o.animated && ((o._pointsUpdated = !1), (o._path = void 0)));
    }
  };
  Ot.id = "line";
  Ot.defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: "default",
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
  };
  Ot.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  Ot.descriptors = {
    _scriptable: !0,
    _indexable: (i) => i !== "borderDash" && i !== "fill",
  };
  function Wo(i, t, e, n) {
    let s = i.options,
      { [e]: o } = i.getProps([e], n);
    return Math.abs(t - o) < s.radius + s.hitRadius;
  }
  var jt = class extends et {
    constructor(t) {
      super();
      (this.options = void 0),
        (this.parsed = void 0),
        (this.skip = void 0),
        (this.stop = void 0),
        t && Object.assign(this, t);
    }
    inRange(t, e, n) {
      let s = this.options,
        { x: o, y: a } = this.getProps(["x", "y"], n);
      return (
        Math.pow(t - o, 2) + Math.pow(e - a, 2) <
        Math.pow(s.hitRadius + s.radius, 2)
      );
    }
    inXRange(t, e) {
      return Wo(this, t, "x", e);
    }
    inYRange(t, e) {
      return Wo(this, t, "y", e);
    }
    getCenterPoint(t) {
      let { x: e, y: n } = this.getProps(["x", "y"], t);
      return { x: e, y: n };
    }
    size(t) {
      t = t || this.options || {};
      let e = t.radius || 0;
      e = Math.max(e, (e && t.hoverRadius) || 0);
      let n = (e && t.borderWidth) || 0;
      return (e + n) * 2;
    }
    draw(t) {
      let e = this,
        n = e.options;
      e.skip ||
        n.radius < 0.1 ||
        ((t.strokeStyle = n.borderColor),
          (t.lineWidth = n.borderWidth),
          (t.fillStyle = n.backgroundColor),
          He(t, n, e.x, e.y));
    }
    getRange() {
      let t = this.options || {};
      return t.radius + t.hitRadius;
    }
  };
  jt.id = "point";
  jt.defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0,
  };
  jt.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  function No(i, t) {
    let {
      x: e,
      y: n,
      base: s,
      width: o,
      height: a,
    } = i.getProps(["x", "y", "base", "width", "height"], t),
      r,
      l,
      c,
      d,
      h;
    return (
      i.horizontal
        ? ((h = a / 2),
          (r = Math.min(e, s)),
          (l = Math.max(e, s)),
          (c = n - h),
          (d = n + h))
        : ((h = o / 2),
          (r = e - h),
          (l = e + h),
          (c = Math.min(n, s)),
          (d = Math.max(n, s))),
      { left: r, top: c, right: l, bottom: d }
    );
  }
  function jo(i) {
    let t = i.options.borderSkipped,
      e = {};
    return (
      t &&
      ((t = i.horizontal
        ? $o(t, "left", "right", i.base > i.x)
        : $o(t, "bottom", "top", i.base < i.y)),
        (e[t] = !0)),
      e
    );
  }
  function $o(i, t, e, n) {
    return n ? ((i = Gl(i, t, e)), (i = Uo(i, e, t))) : (i = Uo(i, t, e)), i;
  }
  function Gl(i, t, e) {
    return i === t ? e : i === e ? t : i;
  }
  function Uo(i, t, e) {
    return i === "start" ? t : i === "end" ? e : i;
  }
  function _t(i, t, e, n) {
    return i ? 0 : Math.max(Math.min(t, n), e);
  }
  function Zl(i, t, e) {
    let n = i.options.borderWidth,
      s = jo(i),
      o = Xn(n);
    return {
      t: _t(s.top, o.top, 0, e),
      r: _t(s.right, o.right, 0, t),
      b: _t(s.bottom, o.bottom, 0, e),
      l: _t(s.left, o.left, 0, t),
    };
  }
  function Jl(i, t, e) {
    let { enableBorderRadius: n } = i.getProps(["enableBorderRadius"]),
      s = i.options.borderRadius,
      o = qn(s),
      a = Math.min(t, e),
      r = jo(i),
      l = n || O(s);
    return {
      topLeft: _t(!l || r.top || r.left, o.topLeft, 0, a),
      topRight: _t(!l || r.top || r.right, o.topRight, 0, a),
      bottomLeft: _t(!l || r.bottom || r.left, o.bottomLeft, 0, a),
      bottomRight: _t(!l || r.bottom || r.right, o.bottomRight, 0, a),
    };
  }
  function Ql(i) {
    let t = No(i),
      e = t.right - t.left,
      n = t.bottom - t.top,
      s = Zl(i, e / 2, n / 2),
      o = Jl(i, e / 2, n / 2);
    return {
      outer: { x: t.left, y: t.top, w: e, h: n, radius: o },
      inner: {
        x: t.left + s.l,
        y: t.top + s.t,
        w: e - s.l - s.r,
        h: n - s.t - s.b,
        radius: {
          topLeft: Math.max(0, o.topLeft - Math.max(s.t, s.l)),
          topRight: Math.max(0, o.topRight - Math.max(s.t, s.r)),
          bottomLeft: Math.max(0, o.bottomLeft - Math.max(s.b, s.l)),
          bottomRight: Math.max(0, o.bottomRight - Math.max(s.b, s.r)),
        },
      },
    };
  }
  function mi(i, t, e, n) {
    let s = t === null,
      o = e === null,
      r = i && !(s && o) && No(i, n);
    return (
      r &&
      (s || (t >= r.left && t <= r.right)) &&
      (o || (e >= r.top && e <= r.bottom))
    );
  }
  function tc(i) {
    return i.topLeft || i.topRight || i.bottomLeft || i.bottomRight;
  }
  function ec(i, t) {
    i.rect(t.x, t.y, t.w, t.h);
  }
  var dn = class extends et {
    constructor(t) {
      super();
      (this.options = void 0),
        (this.horizontal = void 0),
        (this.base = void 0),
        (this.width = void 0),
        (this.height = void 0),
        t && Object.assign(this, t);
    }
    draw(t) {
      let e = this.options,
        { inner: n, outer: s } = Ql(this),
        o = tc(s.radius) ? Ne : ec;
      t.save(),
        (s.w !== n.w || s.h !== n.h) &&
        (t.beginPath(),
          o(t, s),
          t.clip(),
          o(t, n),
          (t.fillStyle = e.borderColor),
          t.fill("evenodd")),
        t.beginPath(),
        o(t, n),
        (t.fillStyle = e.backgroundColor),
        t.fill(),
        t.restore();
    }
    inRange(t, e, n) {
      return mi(this, t, e, n);
    }
    inXRange(t, e) {
      return mi(this, t, null, e);
    }
    inYRange(t, e) {
      return mi(this, null, t, e);
    }
    getCenterPoint(t) {
      let {
        x: e,
        y: n,
        base: s,
        horizontal: o,
      } = this.getProps(["x", "y", "base", "horizontal"], t);
      return { x: o ? (e + s) / 2 : e, y: o ? n : (n + s) / 2 };
    }
    getRange(t) {
      return t === "x" ? this.width / 2 : this.height / 2;
    }
  };
  dn.id = "bar";
  dn.defaults = {
    borderSkipped: "start",
    borderWidth: 0,
    borderRadius: 0,
    enableBorderRadius: !0,
    pointStyle: void 0,
  };
  dn.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  var hn = {
    average(i) {
      if (!i.length) return !1;
      let t,
        e,
        n = 0,
        s = 0,
        o = 0;
      for (t = 0, e = i.length; t < e; ++t) {
        let a = i[t].element;
        if (a && a.hasValue()) {
          let r = a.tooltipPosition();
          (n += r.x), (s += r.y), ++o;
        }
      }
      return { x: n / o, y: s / o };
    },
    nearest(i, t) {
      if (!i.length) return !1;
      let e = t.x,
        n = t.y,
        s = Number.POSITIVE_INFINITY,
        o,
        a,
        r;
      for (o = 0, a = i.length; o < a; ++o) {
        let l = i[o].element;
        if (l && l.hasValue()) {
          let c = l.getCenterPoint(),
            d = Re(t, c);
          d < s && ((s = d), (r = l));
        }
      }
      if (r) {
        let l = r.tooltipPosition();
        (e = l.x), (n = l.y);
      }
      return { x: e, y: n };
    },
  };
  function it(i, t) {
    return t && (T(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i;
  }
  function ct(i) {
    return (typeof i == "string" || i instanceof String) &&
      i.indexOf(`
`) > -1
      ? i.split(`
`)
      : i;
  }
  function nc(i, t) {
    let { element: e, datasetIndex: n, index: s } = t,
      o = i.getDatasetMeta(n).controller,
      { label: a, value: r } = o.getLabelAndValue(s);
    return {
      chart: i,
      label: a,
      parsed: o.getParsed(s),
      raw: i.data.datasets[n].data[s],
      formattedValue: r,
      dataset: o.getDataset(),
      dataIndex: s,
      datasetIndex: n,
      element: e,
    };
  }
  function Yo(i, t) {
    let e = i._chart.ctx,
      { body: n, footer: s, title: o } = i,
      { boxWidth: a, boxHeight: r } = t,
      l = N(t.bodyFont),
      c = N(t.titleFont),
      d = N(t.footerFont),
      h = o.length,
      u = s.length,
      f = n.length,
      g = G(t.padding),
      p = g.height,
      m = 0,
      b = n.reduce(
        (x, v) => x + v.before.length + v.lines.length + v.after.length,
        0
      );
    if (
      ((b += i.beforeBody.length + i.afterBody.length),
        h &&
        (p +=
          h * c.lineHeight + (h - 1) * t.titleSpacing + t.titleMarginBottom),
        b)
    ) {
      let x = t.displayColors ? Math.max(r, l.lineHeight) : l.lineHeight;
      p += f * x + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
    }
    u &&
      (p += t.footerMarginTop + u * d.lineHeight + (u - 1) * t.footerSpacing);
    let _ = 0,
      y = function (x) {
        m = Math.max(m, e.measureText(x).width + _);
      };
    return (
      e.save(),
      (e.font = c.string),
      D(i.title, y),
      (e.font = l.string),
      D(i.beforeBody.concat(i.afterBody), y),
      (_ = t.displayColors ? a + 2 : 0),
      D(n, (x) => {
        D(x.before, y), D(x.lines, y), D(x.after, y);
      }),
      (_ = 0),
      (e.font = d.string),
      D(i.footer, y),
      e.restore(),
      (m += g.width),
      { width: m, height: p }
    );
  }
  function ic(i, t) {
    let { y: e, height: n } = t;
    return e < n / 2 ? "top" : e > i.height - n / 2 ? "bottom" : "center";
  }
  function sc(i, t, e, n) {
    let { x: s, width: o } = n,
      a = e.caretSize + e.caretPadding;
    if (
      (i === "left" && s + o + a > t.width) ||
      (i === "right" && s - o - a < 0)
    )
      return !0;
  }
  function oc(i, t, e, n) {
    let { x: s, width: o } = e,
      {
        width: a,
        chartArea: { left: r, right: l },
      } = i,
      c = "center";
    return (
      n === "center"
        ? (c = s <= (r + l) / 2 ? "left" : "right")
        : s <= o / 2
          ? (c = "left")
          : s >= a - o / 2 && (c = "right"),
      sc(c, i, t, e) && (c = "center"),
      c
    );
  }
  function Xo(i, t, e) {
    let n = t.yAlign || ic(i, e);
    return { xAlign: t.xAlign || oc(i, t, e, n), yAlign: n };
  }
  function ac(i, t) {
    let { x: e, width: n } = i;
    return t === "right" ? (e -= n) : t === "center" && (e -= n / 2), e;
  }
  function rc(i, t, e) {
    let { y: n, height: s } = i;
    return (
      t === "top" ? (n += e) : t === "bottom" ? (n -= s + e) : (n -= s / 2), n
    );
  }
  function qo(i, t, e, n) {
    let { caretSize: s, caretPadding: o, cornerRadius: a } = i,
      { xAlign: r, yAlign: l } = e,
      c = s + o,
      d = a + o,
      h = ac(t, r),
      u = rc(t, l, c);
    return (
      l === "center"
        ? r === "left"
          ? (h += c)
          : r === "right" && (h -= c)
        : r === "left"
          ? (h -= d)
          : r === "right" && (h += d),
      { x: X(h, 0, n.width - t.width), y: X(u, 0, n.height - t.height) }
    );
  }
  function un(i, t, e) {
    let n = G(e.padding);
    return t === "center"
      ? i.x + i.width / 2
      : t === "right"
        ? i.x + i.width - n.right
        : i.x + n.left;
  }
  function Ko(i) {
    return it([], ct(i));
  }
  function lc(i, t, e) {
    return Object.assign(Object.create(i), {
      tooltip: t,
      tooltipItems: e,
      type: "tooltip",
    });
  }
  function Go(i, t) {
    let e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
    return e ? i.override(e) : i;
  }
  var Zo = class extends et {
    constructor(t) {
      super();
      (this.opacity = 0),
        (this._active = []),
        (this._chart = t._chart),
        (this._eventPosition = void 0),
        (this._size = void 0),
        (this._cachedAnimations = void 0),
        (this._tooltipItems = []),
        (this.$animations = void 0),
        (this.$context = void 0),
        (this.options = t.options),
        (this.dataPoints = void 0),
        (this.title = void 0),
        (this.beforeBody = void 0),
        (this.body = void 0),
        (this.afterBody = void 0),
        (this.footer = void 0),
        (this.xAlign = void 0),
        (this.yAlign = void 0),
        (this.x = void 0),
        (this.y = void 0),
        (this.height = void 0),
        (this.width = void 0),
        (this.caretX = void 0),
        (this.caretY = void 0),
        (this.labelColors = void 0),
        (this.labelPointStyles = void 0),
        (this.labelTextColors = void 0);
    }
    initialize(t) {
      (this.options = t),
        (this._cachedAnimations = void 0),
        (this.$context = void 0);
    }
    _resolveAnimations() {
      let t = this,
        e = t._cachedAnimations;
      if (e) return e;
      let n = t._chart,
        s = t.options.setContext(t.getContext()),
        o = s.enabled && n.options.animation && s.animations,
        a = new ii(t._chart, o);
      return o._cacheable && (t._cachedAnimations = Object.freeze(a)), a;
    }
    getContext() {
      let t = this;
      return (
        t.$context ||
        (t.$context = lc(t._chart.getContext(), t, t._tooltipItems))
      );
    }
    getTitle(t, e) {
      let n = this,
        { callbacks: s } = e,
        o = s.beforeTitle.apply(n, [t]),
        a = s.title.apply(n, [t]),
        r = s.afterTitle.apply(n, [t]),
        l = [];
      return (l = it(l, ct(o))), (l = it(l, ct(a))), (l = it(l, ct(r))), l;
    }
    getBeforeBody(t, e) {
      return Ko(e.callbacks.beforeBody.apply(this, [t]));
    }
    getBody(t, e) {
      let n = this,
        { callbacks: s } = e,
        o = [];
      return (
        D(t, (a) => {
          let r = { before: [], lines: [], after: [] },
            l = Go(s, a);
          it(r.before, ct(l.beforeLabel.call(n, a))),
            it(r.lines, l.label.call(n, a)),
            it(r.after, ct(l.afterLabel.call(n, a))),
            o.push(r);
        }),
        o
      );
    }
    getAfterBody(t, e) {
      return Ko(e.callbacks.afterBody.apply(this, [t]));
    }
    getFooter(t, e) {
      let n = this,
        { callbacks: s } = e,
        o = s.beforeFooter.apply(n, [t]),
        a = s.footer.apply(n, [t]),
        r = s.afterFooter.apply(n, [t]),
        l = [];
      return (l = it(l, ct(o))), (l = it(l, ct(a))), (l = it(l, ct(r))), l;
    }
    _createItems(t) {
      let e = this,
        n = e._active,
        s = e._chart.data,
        o = [],
        a = [],
        r = [],
        l = [],
        c,
        d;
      for (c = 0, d = n.length; c < d; ++c) l.push(nc(e._chart, n[c]));
      return (
        t.filter && (l = l.filter((h, u, f) => t.filter(h, u, f, s))),
        t.itemSort && (l = l.sort((h, u) => t.itemSort(h, u, s))),
        D(l, (h) => {
          let u = Go(t.callbacks, h);
          o.push(u.labelColor.call(e, h)),
            a.push(u.labelPointStyle.call(e, h)),
            r.push(u.labelTextColor.call(e, h));
        }),
        (e.labelColors = o),
        (e.labelPointStyles = a),
        (e.labelTextColors = r),
        (e.dataPoints = l),
        l
      );
    }
    update(t, e) {
      let n = this,
        s = n.options.setContext(n.getContext()),
        o = n._active,
        a,
        r = [];
      if (!o.length) n.opacity !== 0 && (a = { opacity: 0 });
      else {
        let l = hn[s.position].call(n, o, n._eventPosition);
        (r = n._createItems(s)),
          (n.title = n.getTitle(r, s)),
          (n.beforeBody = n.getBeforeBody(r, s)),
          (n.body = n.getBody(r, s)),
          (n.afterBody = n.getAfterBody(r, s)),
          (n.footer = n.getFooter(r, s));
        let c = (n._size = Yo(n, s)),
          d = Object.assign({}, l, c),
          h = Xo(n._chart, s, d),
          u = qo(s, d, h, n._chart);
        (n.xAlign = h.xAlign),
          (n.yAlign = h.yAlign),
          (a = {
            opacity: 1,
            x: u.x,
            y: u.y,
            width: c.width,
            height: c.height,
            caretX: l.x,
            caretY: l.y,
          });
      }
      (n._tooltipItems = r),
        (n.$context = void 0),
        a && n._resolveAnimations().update(n, a),
        t &&
        s.external &&
        s.external.call(n, { chart: n._chart, tooltip: n, replay: e });
    }
    drawCaret(t, e, n, s) {
      let o = this.getCaretPosition(t, n, s);
      e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3);
    }
    getCaretPosition(t, e, n) {
      let { xAlign: s, yAlign: o } = this,
        { cornerRadius: a, caretSize: r } = n,
        { x: l, y: c } = t,
        { width: d, height: h } = e,
        u,
        f,
        g,
        p,
        m,
        b;
      return (
        o === "center"
          ? ((m = c + h / 2),
            s === "left"
              ? ((u = l), (f = u - r), (p = m + r), (b = m - r))
              : ((u = l + d), (f = u + r), (p = m - r), (b = m + r)),
            (g = u))
          : (s === "left"
            ? (f = l + a + r)
            : s === "right"
              ? (f = l + d - a - r)
              : (f = this.caretX),
            o === "top"
              ? ((p = c), (m = p - r), (u = f - r), (g = f + r))
              : ((p = c + h), (m = p + r), (u = f + r), (g = f - r)),
            (b = p)),
        { x1: u, x2: f, x3: g, y1: p, y2: m, y3: b }
      );
    }
    drawTitle(t, e, n) {
      let s = this,
        o = s.title,
        a = o.length,
        r,
        l,
        c;
      if (a) {
        let d = qe(n.rtl, s.x, s.width);
        for (
          t.x = un(s, n.titleAlign, n),
          e.textAlign = d.textAlign(n.titleAlign),
          e.textBaseline = "middle",
          r = N(n.titleFont),
          l = n.titleSpacing,
          e.fillStyle = n.titleColor,
          e.font = r.string,
          c = 0;
          c < a;
          ++c
        )
          e.fillText(o[c], d.x(t.x), t.y + r.lineHeight / 2),
            (t.y += r.lineHeight + l),
            c + 1 === a && (t.y += n.titleMarginBottom - l);
      }
    }
    _drawColorBox(t, e, n, s, o) {
      let a = this,
        r = a.labelColors[n],
        l = a.labelPointStyles[n],
        { boxHeight: c, boxWidth: d } = o,
        h = N(o.bodyFont),
        u = un(a, "left", o),
        f = s.x(u),
        g = c < h.lineHeight ? (h.lineHeight - c) / 2 : 0,
        p = e.y + g;
      if (o.usePointStyle) {
        let m = {
          radius: Math.min(d, c) / 2,
          pointStyle: l.pointStyle,
          rotation: l.rotation,
          borderWidth: 1,
        },
          b = s.leftForLtr(f, d) + d / 2,
          _ = p + c / 2;
        (t.strokeStyle = o.multiKeyBackground),
          (t.fillStyle = o.multiKeyBackground),
          He(t, m, b, _),
          (t.strokeStyle = r.borderColor),
          (t.fillStyle = r.backgroundColor),
          He(t, m, b, _);
      } else {
        (t.lineWidth = r.borderWidth || 1),
          (t.strokeStyle = r.borderColor),
          t.setLineDash(r.borderDash || []),
          (t.lineDashOffset = r.borderDashOffset || 0);
        let m = s.leftForLtr(f, d),
          b = s.leftForLtr(s.xPlus(f, 1), d - 2),
          _ = qn(r.borderRadius);
        Object.values(_).some((y) => y !== 0)
          ? (t.beginPath(),
            (t.fillStyle = o.multiKeyBackground),
            Ne(t, { x: m, y: p, w: d, h: c, radius: _ }),
            t.fill(),
            t.stroke(),
            (t.fillStyle = r.backgroundColor),
            t.beginPath(),
            Ne(t, { x: b, y: p + 1, w: d - 2, h: c - 2, radius: _ }),
            t.fill())
          : ((t.fillStyle = o.multiKeyBackground),
            t.fillRect(m, p, d, c),
            t.strokeRect(m, p, d, c),
            (t.fillStyle = r.backgroundColor),
            t.fillRect(b, p + 1, d - 2, c - 2));
      }
      t.fillStyle = a.labelTextColors[n];
    }
    drawBody(t, e, n) {
      let s = this,
        { body: o } = s,
        {
          bodySpacing: a,
          bodyAlign: r,
          displayColors: l,
          boxHeight: c,
          boxWidth: d,
        } = n,
        h = N(n.bodyFont),
        u = h.lineHeight,
        f = 0,
        g = qe(n.rtl, s.x, s.width),
        p = function (M) {
          e.fillText(M, g.x(t.x + f), t.y + u / 2), (t.y += u + a);
        },
        m = g.textAlign(r),
        b,
        _,
        y,
        x,
        v,
        w,
        S;
      for (
        e.textAlign = r,
        e.textBaseline = "middle",
        e.font = h.string,
        t.x = un(s, m, n),
        e.fillStyle = n.bodyColor,
        D(s.beforeBody, p),
        f = l && m !== "right" ? (r === "center" ? d / 2 + 1 : d + 2) : 0,
        x = 0,
        w = o.length;
        x < w;
        ++x
      ) {
        for (
          b = o[x],
          _ = s.labelTextColors[x],
          e.fillStyle = _,
          D(b.before, p),
          y = b.lines,
          l &&
          y.length &&
          (s._drawColorBox(e, t, x, g, n), (u = Math.max(h.lineHeight, c))),
          v = 0,
          S = y.length;
          v < S;
          ++v
        )
          p(y[v]), (u = h.lineHeight);
        D(b.after, p);
      }
      (f = 0), (u = h.lineHeight), D(s.afterBody, p), (t.y -= a);
    }
    drawFooter(t, e, n) {
      let s = this,
        o = s.footer,
        a = o.length,
        r,
        l;
      if (a) {
        let c = qe(n.rtl, s.x, s.width);
        for (
          t.x = un(s, n.footerAlign, n),
          t.y += n.footerMarginTop,
          e.textAlign = c.textAlign(n.footerAlign),
          e.textBaseline = "middle",
          r = N(n.footerFont),
          e.fillStyle = n.footerColor,
          e.font = r.string,
          l = 0;
          l < a;
          ++l
        )
          e.fillText(o[l], c.x(t.x), t.y + r.lineHeight / 2),
            (t.y += r.lineHeight + n.footerSpacing);
      }
    }
    drawBackground(t, e, n, s) {
      let { xAlign: o, yAlign: a } = this,
        { x: r, y: l } = t,
        { width: c, height: d } = n,
        h = s.cornerRadius;
      (e.fillStyle = s.backgroundColor),
        (e.strokeStyle = s.borderColor),
        (e.lineWidth = s.borderWidth),
        e.beginPath(),
        e.moveTo(r + h, l),
        a === "top" && this.drawCaret(t, e, n, s),
        e.lineTo(r + c - h, l),
        e.quadraticCurveTo(r + c, l, r + c, l + h),
        a === "center" && o === "right" && this.drawCaret(t, e, n, s),
        e.lineTo(r + c, l + d - h),
        e.quadraticCurveTo(r + c, l + d, r + c - h, l + d),
        a === "bottom" && this.drawCaret(t, e, n, s),
        e.lineTo(r + h, l + d),
        e.quadraticCurveTo(r, l + d, r, l + d - h),
        a === "center" && o === "left" && this.drawCaret(t, e, n, s),
        e.lineTo(r, l + h),
        e.quadraticCurveTo(r, l, r + h, l),
        e.closePath(),
        e.fill(),
        s.borderWidth > 0 && e.stroke();
    }
    _updateAnimationTarget(t) {
      let e = this,
        n = e._chart,
        s = e.$animations,
        o = s && s.x,
        a = s && s.y;
      if (o || a) {
        let r = hn[t.position].call(e, e._active, e._eventPosition);
        if (!r) return;
        let l = (e._size = Yo(e, t)),
          c = Object.assign({}, r, e._size),
          d = Xo(n, t, c),
          h = qo(t, c, d, n);
        (o._to !== h.x || a._to !== h.y) &&
          ((e.xAlign = d.xAlign),
            (e.yAlign = d.yAlign),
            (e.width = l.width),
            (e.height = l.height),
            (e.caretX = r.x),
            (e.caretY = r.y),
            e._resolveAnimations().update(e, h));
      }
    }
    draw(t) {
      let e = this,
        n = e.options.setContext(e.getContext()),
        s = e.opacity;
      if (!s) return;
      e._updateAnimationTarget(n);
      let o = { width: e.width, height: e.height },
        a = { x: e.x, y: e.y };
      s = Math.abs(s) < 0.001 ? 0 : s;
      let r = G(n.padding),
        l =
          e.title.length ||
          e.beforeBody.length ||
          e.body.length ||
          e.afterBody.length ||
          e.footer.length;
      n.enabled &&
        l &&
        (t.save(),
          (t.globalAlpha = s),
          e.drawBackground(a, t, o, n),
          Vs(t, n.textDirection),
          (a.y += r.top),
          e.drawTitle(a, t, n),
          e.drawBody(a, t, n),
          e.drawFooter(a, t, n),
          Ws(t, n.textDirection),
          t.restore());
    }
    getActiveElements() {
      return this._active || [];
    }
    setActiveElements(t, e) {
      let n = this,
        s = n._active,
        o = t.map(({ datasetIndex: l, index: c }) => {
          let d = n._chart.getDatasetMeta(l);
          if (!d) throw new Error("Cannot find a dataset at index " + l);
          return { datasetIndex: l, element: d.data[c], index: c };
        }),
        a = !qt(s, o),
        r = n._positionChanged(o, e);
      (a || r) && ((n._active = o), (n._eventPosition = e), n.update(!0));
    }
    handleEvent(t, e) {
      let n = this,
        s = n.options,
        o = n._active || [],
        a = !1,
        r = [];
      t.type !== "mouseout" &&
        ((r = n._chart.getElementsAtEventForMode(t, s.mode, s, e)),
          s.reverse && r.reverse());
      let l = n._positionChanged(r, t);
      return (
        (a = e || !qt(r, o) || l),
        a &&
        ((n._active = r),
          (s.enabled || s.external) &&
          ((n._eventPosition = { x: t.x, y: t.y }), n.update(!0, e))),
        a
      );
    }
    _positionChanged(t, e) {
      let { caretX: n, caretY: s, options: o } = this,
        a = hn[o.position].call(this, t, e);
      return a !== !1 && (n !== a.x || s !== a.y);
    }
  };
  Zo.positioners = hn;
  var cc = (i, t, e) =>
    typeof t == "string" ? i.push(t) - 1 : isNaN(t) ? null : e;
  function dc(i, t, e) {
    let n = i.indexOf(t);
    if (n === -1) return cc(i, t, e);
    let s = i.lastIndexOf(t);
    return n !== s ? e : n;
  }
  var hc = (i, t) => (i === null ? null : X(Math.round(i), 0, t)),
    $t = class extends bt {
      constructor(t) {
        super(t);
        (this._startValue = void 0), (this._valueRange = 0);
      }
      parse(t, e) {
        if (P(t)) return null;
        let n = this.getLabels();
        return (
          (e = isFinite(e) && n[e] === t ? e : dc(n, t, C(e, t))),
          hc(e, n.length - 1)
        );
      }
      determineDataLimits() {
        let t = this,
          { minDefined: e, maxDefined: n } = t.getUserBounds(),
          { min: s, max: o } = t.getMinMax(!0);
        t.options.bounds === "ticks" &&
          (e || (s = 0), n || (o = t.getLabels().length - 1)),
          (t.min = s),
          (t.max = o);
      }
      buildTicks() {
        let t = this,
          e = t.min,
          n = t.max,
          s = t.options.offset,
          o = [],
          a = t.getLabels();
        (a = e === 0 && n === a.length - 1 ? a : a.slice(e, n + 1)),
          (t._valueRange = Math.max(a.length - (s ? 0 : 1), 1)),
          (t._startValue = t.min - (s ? 0.5 : 0));
        for (let r = e; r <= n; r++) o.push({ value: r });
        return o;
      }
      getLabelForValue(t) {
        let n = this.getLabels();
        return t >= 0 && t < n.length ? n[t] : t;
      }
      configure() {
        let t = this;
        super.configure(),
          t.isHorizontal() || (t._reversePixels = !t._reversePixels);
      }
      getPixelForValue(t) {
        let e = this;
        return (
          typeof t != "number" && (t = e.parse(t)),
          t === null
            ? NaN
            : e.getPixelForDecimal((t - e._startValue) / e._valueRange)
        );
      }
      getPixelForTick(t) {
        let e = this,
          n = e.ticks;
        return t < 0 || t > n.length - 1
          ? null
          : e.getPixelForValue(n[t].value);
      }
      getValueForPixel(t) {
        let e = this;
        return Math.round(
          e._startValue + e.getDecimalForPixel(t) * e._valueRange
        );
      }
      getBasePixel() {
        return this.bottom;
      }
    };
  $t.id = "category";
  $t.defaults = { ticks: { callback: $t.prototype.getLabelForValue } };
  function uc(i, t) {
    let e = [],
      n = 1e-14,
      {
        step: s,
        min: o,
        max: a,
        precision: r,
        count: l,
        maxTicks: c,
        maxDigits: d,
        horizontal: h,
      } = i,
      u = s || 1,
      f = c - 1,
      { min: g, max: p } = t,
      m = !P(o),
      b = !P(a),
      _ = !P(l),
      y = (p - g) / d,
      x = zn((p - g) / f / u) * u,
      v,
      w,
      S,
      M;
    if (x < n && !m && !b) return [{ value: g }, { value: p }];
    (M = Math.ceil(p / x) - Math.floor(g / x)),
      M > f && (x = zn((M * x) / f / u) * u),
      P(r) || ((v = Math.pow(10, r)), (x = Math.ceil(x * v) / v)),
      (w = Math.floor(g / x) * x),
      (S = Math.ceil(p / x) * x),
      m && b && s && ss((a - o) / s, x / 1e3)
        ? ((M = Math.min((a - o) / x, c)), (x = (a - o) / M), (w = o), (S = a))
        : _
          ? ((w = m ? o : w), (S = b ? a : S), (M = l - 1), (x = (S - w) / M))
          : ((M = (S - w) / x),
            Gt(M, Math.round(M), x / 1e3)
              ? (M = Math.round(M))
              : (M = Math.ceil(M))),
      (v = Math.pow(10, P(r) ? os(x) : r)),
      (w = Math.round(w * v) / v),
      (S = Math.round(S * v) / v);
    let z = 0;
    for (
      m &&
      (e.push({ value: o }),
        w <= o && z++,
        Gt(Math.round((w + z * x) * v) / v, o, y * (h ? ("" + o).length : 1)) &&
        z++);
      z < M;
      ++z
    )
      e.push({ value: Math.round((w + z * x) * v) / v });
    return (
      b
        ? Gt(e[e.length - 1].value, a, y * (h ? ("" + a).length : 1))
          ? (e[e.length - 1].value = a)
          : e.push({ value: a })
        : e.push({ value: S }),
      e
    );
  }
  var be = class extends bt {
    constructor(t) {
      super(t);
      (this.start = void 0),
        (this.end = void 0),
        (this._startValue = void 0),
        (this._endValue = void 0),
        (this._valueRange = 0);
    }
    parse(t, e) {
      return P(t) ||
        ((typeof t == "number" || t instanceof Number) && !isFinite(+t))
        ? null
        : +t;
    }
    handleTickRangeOptions() {
      let t = this,
        { beginAtZero: e, stacked: n } = t.options,
        { minDefined: s, maxDefined: o } = t.getUserBounds(),
        { min: a, max: r } = t,
        l = (d) => (a = s ? a : d),
        c = (d) => (r = o ? r : d);
      if (e || n) {
        let d = at(a),
          h = at(r);
        d < 0 && h < 0 ? c(0) : d > 0 && h > 0 && l(0);
      }
      a === r && (c(r + 1), e || l(a - 1)), (t.min = a), (t.max = r);
    }
    getTickLimit() {
      let t = this,
        e = t.options.ticks,
        { maxTicksLimit: n, stepSize: s } = e,
        o;
      return (
        s
          ? (o = Math.ceil(t.max / s) - Math.floor(t.min / s) + 1)
          : ((o = t.computeTickLimit()), (n = n || 11)),
        n && (o = Math.min(n, o)),
        o
      );
    }
    computeTickLimit() {
      return Number.POSITIVE_INFINITY;
    }
    buildTicks() {
      let t = this,
        e = t.options,
        n = e.ticks,
        s = t.getTickLimit();
      s = Math.max(2, s);
      let o = {
        maxTicks: s,
        min: e.min,
        max: e.max,
        precision: n.precision,
        step: n.stepSize,
        count: n.count,
        maxDigits: t._maxDigits(),
        horizontal: t.isHorizontal(),
      },
        a = t._range || t,
        r = uc(o, a);
      return (
        e.bounds === "ticks" && In(r, t, "value"),
        e.reverse
          ? (r.reverse(), (t.start = t.max), (t.end = t.min))
          : ((t.start = t.min), (t.end = t.max)),
        r
      );
    }
    configure() {
      let t = this,
        e = t.ticks,
        n = t.min,
        s = t.max;
      if ((super.configure(), t.options.offset && e.length)) {
        let o = (s - n) / Math.max(e.length - 1, 1) / 2;
        (n -= o), (s += o);
      }
      (t._startValue = n), (t._endValue = s), (t._valueRange = s - n);
    }
    getLabelForValue(t) {
      return re(t, this.chart.options.locale);
    }
  },
    xe = class extends be {
      determineDataLimits() {
        let t = this,
          { min: e, max: n } = t.getMinMax(!0);
        (t.min = B(e) ? e : 0),
          (t.max = B(n) ? n : 1),
          t.handleTickRangeOptions();
      }
      computeTickLimit() {
        let t = this;
        if (t.isHorizontal()) return Math.ceil(t.width / 40);
        let e = t._resolveTickFontOptions(0);
        return Math.ceil(t.height / e.lineHeight);
      }
      getPixelForValue(t) {
        return t === null
          ? NaN
          : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
      }
      getValueForPixel(t) {
        return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
      }
    };
  xe.id = "linear";
  xe.defaults = { ticks: { callback: on.formatters.numeric } };
  function Jo(i) {
    return i / Math.pow(10, Math.floor(Y(i))) === 1;
  }
  function fc(i, t) {
    let e = Math.floor(Y(t.max)),
      n = Math.ceil(t.max / Math.pow(10, e)),
      s = [],
      o = U(i.min, Math.pow(10, Math.floor(Y(t.min)))),
      a = Math.floor(Y(o)),
      r = Math.floor(o / Math.pow(10, a)),
      l = a < 0 ? Math.pow(10, Math.abs(a)) : 1;
    do
      s.push({ value: o, major: Jo(o) }),
        ++r,
        r === 10 && ((r = 1), ++a, (l = a >= 0 ? 1 : l)),
        (o = Math.round(r * Math.pow(10, a) * l) / l);
    while (a < e || (a === e && r < n));
    let c = U(i.max, o);
    return s.push({ value: c, major: Jo(o) }), s;
  }
  var bi = class extends bt {
    constructor(t) {
      super(t);
      (this.start = void 0),
        (this.end = void 0),
        (this._startValue = void 0),
        (this._valueRange = 0);
    }
    parse(t, e) {
      let n = be.prototype.parse.apply(this, [t, e]);
      if (n === 0) {
        this._zero = !0;
        return;
      }
      return B(n) && n > 0 ? n : null;
    }
    determineDataLimits() {
      let t = this,
        { min: e, max: n } = t.getMinMax(!0);
      (t.min = B(e) ? Math.max(0, e) : null),
        (t.max = B(n) ? Math.max(0, n) : null),
        t.options.beginAtZero && (t._zero = !0),
        t.handleTickRangeOptions();
    }
    handleTickRangeOptions() {
      let t = this,
        { minDefined: e, maxDefined: n } = t.getUserBounds(),
        s = t.min,
        o = t.max,
        a = (c) => (s = e ? s : c),
        r = (c) => (o = n ? o : c),
        l = (c, d) => Math.pow(10, Math.floor(Y(c)) + d);
      s === o && (s <= 0 ? (a(1), r(10)) : (a(l(s, -1)), r(l(o, 1)))),
        s <= 0 && a(l(o, -1)),
        o <= 0 && r(l(s, 1)),
        t._zero &&
        t.min !== t._suggestedMin &&
        s === l(t.min, 0) &&
        a(l(s, -1)),
        (t.min = s),
        (t.max = o);
    }
    buildTicks() {
      let t = this,
        e = t.options,
        n = { min: t._userMin, max: t._userMax },
        s = fc(n, t);
      return (
        e.bounds === "ticks" && In(s, t, "value"),
        e.reverse
          ? (s.reverse(), (t.start = t.max), (t.end = t.min))
          : ((t.start = t.min), (t.end = t.max)),
        s
      );
    }
    getLabelForValue(t) {
      return t === void 0 ? "0" : re(t, this.chart.options.locale);
    }
    configure() {
      let t = this,
        e = t.min;
      super.configure(),
        (t._startValue = Y(e)),
        (t._valueRange = Y(t.max) - Y(e));
    }
    getPixelForValue(t) {
      let e = this;
      return (
        (t === void 0 || t === 0) && (t = e.min),
        t === null || isNaN(t)
          ? NaN
          : e.getPixelForDecimal(
            t === e.min ? 0 : (Y(t) - e._startValue) / e._valueRange
          )
      );
    }
    getValueForPixel(t) {
      let e = this,
        n = e.getDecimalForPixel(t);
      return Math.pow(10, e._startValue + n * e._valueRange);
    }
  };
  bi.id = "logarithmic";
  bi.defaults = {
    ticks: { callback: on.formatters.logarithmic, major: { enabled: !0 } },
  };
  function xi(i) {
    let t = i.ticks;
    if (t.display && i.display) {
      let e = G(t.backdropPadding);
      return C(t.font && t.font.size, k.font.size) + e.height;
    }
    return 0;
  }
  function gc(i, t, e) {
    return T(e)
      ? { w: ys(i, i.font, e), h: e.length * t }
      : { w: i.measureText(e).width, h: t };
  }
  function Qo(i, t, e, n, s) {
    return i === n || i === s
      ? { start: t - e / 2, end: t + e / 2 }
      : i < n || i > s
        ? { start: t - e, end: t }
        : { start: t, end: t + e };
  }
  function pc(i) {
    let t = { l: 0, r: i.width, t: 0, b: i.height - i.paddingTop },
      e = {},
      n,
      s,
      o,
      a = [],
      r = [],
      l = i.getLabels().length;
    for (n = 0; n < l; n++) {
      let u = i.options.pointLabels.setContext(i.getContext(n));
      (r[n] = u.padding), (o = i.getPointPosition(n, i.drawingArea + r[n]));
      let f = N(u.font);
      (i.ctx.font = f.string),
        (s = gc(i.ctx, f.lineHeight, i._pointLabels[n])),
        (a[n] = s);
      let g = i.getIndexAngle(n),
        p = Te(g),
        m = Qo(p, o.x, s.w, 0, 180),
        b = Qo(p, o.y, s.h, 90, 270);
      m.start < t.l && ((t.l = m.start), (e.l = g)),
        m.end > t.r && ((t.r = m.end), (e.r = g)),
        b.start < t.t && ((t.t = b.start), (e.t = g)),
        b.end > t.b && ((t.b = b.end), (e.b = g));
    }
    i._setReductions(i.drawingArea, t, e), (i._pointLabelItems = []);
    let c = i.options,
      d = xi(c),
      h = i.getDistanceFromCenterForValue(c.ticks.reverse ? i.min : i.max);
    for (n = 0; n < l; n++) {
      let u = n === 0 ? d / 2 : 0,
        f = i.getPointPosition(n, h + u + r[n]),
        g = Te(i.getIndexAngle(n)),
        p = a[n];
      bc(g, p, f);
      let m = mc(g),
        b;
      m === "left"
        ? (b = f.x)
        : m === "center"
          ? (b = f.x - p.w / 2)
          : (b = f.x - p.w);
      let _ = b + p.w;
      i._pointLabelItems[n] = {
        x: f.x,
        y: f.y,
        textAlign: m,
        left: b,
        top: f.y,
        right: _,
        bottom: f.y + p.h,
      };
    }
  }
  function mc(i) {
    return i === 0 || i === 180 ? "center" : i < 180 ? "left" : "right";
  }
  function bc(i, t, e) {
    i === 90 || i === 270
      ? (e.y -= t.h / 2)
      : (i > 270 || i < 90) && (e.y -= t.h);
  }
  function xc(i, t) {
    let {
      ctx: e,
      options: { pointLabels: n },
    } = i;
    for (let s = t - 1; s >= 0; s--) {
      let o = n.setContext(i.getContext(s)),
        a = N(o.font),
        {
          x: r,
          y: l,
          textAlign: c,
          left: d,
          top: h,
          right: u,
          bottom: f,
        } = i._pointLabelItems[s],
        { backdropColor: g } = o;
      if (!P(g)) {
        let p = G(o.backdropPadding);
        (e.fillStyle = g),
          e.fillRect(d - p.left, h - p.top, u - d + p.width, f - h + p.height);
      }
      se(e, i._pointLabels[s], r, l + a.lineHeight / 2, a, {
        color: o.color,
        textAlign: c,
        textBaseline: "middle",
      });
    }
  }
  function ta(i, t, e, n) {
    let { ctx: s } = i;
    if (e) s.arc(i.xCenter, i.yCenter, t, 0, A);
    else {
      let o = i.getPointPosition(0, t);
      s.moveTo(o.x, o.y);
      for (let a = 1; a < n; a++)
        (o = i.getPointPosition(a, t)), s.lineTo(o.x, o.y);
    }
  }
  function _c(i, t, e, n) {
    let s = i.ctx,
      o = t.circular,
      { color: a, lineWidth: r } = t;
    (!o && !n) ||
      !a ||
      !r ||
      e < 0 ||
      (s.save(),
        (s.strokeStyle = a),
        (s.lineWidth = r),
        s.setLineDash(t.borderDash),
        (s.lineDashOffset = t.borderDashOffset),
        s.beginPath(),
        ta(i, e, o, n),
        s.closePath(),
        s.stroke(),
        s.restore());
  }
  function fn(i) {
    return Mt(i) ? i : 0;
  }
  var _e = class extends be {
    constructor(t) {
      super(t);
      (this.xCenter = void 0),
        (this.yCenter = void 0),
        (this.drawingArea = void 0),
        (this._pointLabels = []),
        (this._pointLabelItems = []);
    }
    setDimensions() {
      let t = this;
      (t.width = t.maxWidth),
        (t.height = t.maxHeight),
        (t.paddingTop = xi(t.options) / 2),
        (t.xCenter = Math.floor(t.width / 2)),
        (t.yCenter = Math.floor((t.height - t.paddingTop) / 2)),
        (t.drawingArea = Math.min(t.height - t.paddingTop, t.width) / 2);
    }
    determineDataLimits() {
      let t = this,
        { min: e, max: n } = t.getMinMax(!1);
      (t.min = B(e) && !isNaN(e) ? e : 0),
        (t.max = B(n) && !isNaN(n) ? n : 0),
        t.handleTickRangeOptions();
    }
    computeTickLimit() {
      return Math.ceil(this.drawingArea / xi(this.options));
    }
    generateTickLabels(t) {
      let e = this;
      be.prototype.generateTickLabels.call(e, t),
        (e._pointLabels = e.getLabels().map((n, s) => {
          let o = R(e.options.pointLabels.callback, [n, s], e);
          return o || o === 0 ? o : "";
        }));
    }
    fit() {
      let t = this,
        e = t.options;
      e.display && e.pointLabels.display ? pc(t) : t.setCenterPoint(0, 0, 0, 0);
    }
    _setReductions(t, e, n) {
      let s = this,
        o = e.l / Math.sin(n.l),
        a = Math.max(e.r - s.width, 0) / Math.sin(n.r),
        r = -e.t / Math.cos(n.t),
        l = -Math.max(e.b - (s.height - s.paddingTop), 0) / Math.cos(n.b);
      (o = fn(o)),
        (a = fn(a)),
        (r = fn(r)),
        (l = fn(l)),
        (s.drawingArea = Math.max(
          t / 2,
          Math.min(Math.floor(t - (o + a) / 2), Math.floor(t - (r + l) / 2))
        )),
        s.setCenterPoint(o, a, r, l);
    }
    setCenterPoint(t, e, n, s) {
      let o = this,
        a = o.width - e - o.drawingArea,
        r = t + o.drawingArea,
        l = n + o.drawingArea,
        c = o.height - o.paddingTop - s - o.drawingArea;
      (o.xCenter = Math.floor((r + a) / 2 + o.left)),
        (o.yCenter = Math.floor((l + c) / 2 + o.top + o.paddingTop));
    }
    getIndexAngle(t) {
      let e = A / this.getLabels().length,
        n = this.options.startAngle || 0;
      return tt(t * e + Q(n));
    }
    getDistanceFromCenterForValue(t) {
      let e = this;
      if (P(t)) return NaN;
      let n = e.drawingArea / (e.max - e.min);
      return e.options.reverse ? (e.max - t) * n : (t - e.min) * n;
    }
    getValueForDistanceFromCenter(t) {
      if (P(t)) return NaN;
      let e = this,
        n = t / (e.drawingArea / (e.max - e.min));
      return e.options.reverse ? e.max - n : e.min + n;
    }
    getPointPosition(t, e) {
      let n = this,
        s = n.getIndexAngle(t) - L;
      return {
        x: Math.cos(s) * e + n.xCenter,
        y: Math.sin(s) * e + n.yCenter,
        angle: s,
      };
    }
    getPointPositionForValue(t, e) {
      return this.getPointPosition(t, this.getDistanceFromCenterForValue(e));
    }
    getBasePosition(t) {
      return this.getPointPositionForValue(t || 0, this.getBaseValue());
    }
    getPointLabelPosition(t) {
      let { left: e, top: n, right: s, bottom: o } = this._pointLabelItems[t];
      return { left: e, top: n, right: s, bottom: o };
    }
    drawBackground() {
      let t = this,
        {
          backgroundColor: e,
          grid: { circular: n },
        } = t.options;
      if (e) {
        let s = t.ctx;
        s.save(),
          s.beginPath(),
          ta(
            t,
            t.getDistanceFromCenterForValue(t._endValue),
            n,
            t.getLabels().length
          ),
          s.closePath(),
          (s.fillStyle = e),
          s.fill(),
          s.restore();
      }
    }
    drawGrid() {
      let t = this,
        e = t.ctx,
        n = t.options,
        { angleLines: s, grid: o } = n,
        a = t.getLabels().length,
        r,
        l,
        c;
      if (
        (n.pointLabels.display && xc(t, a),
          o.display &&
          t.ticks.forEach((d, h) => {
            if (h !== 0) {
              l = t.getDistanceFromCenterForValue(d.value);
              let u = o.setContext(t.getContext(h - 1));
              _c(t, u, l, a);
            }
          }),
          s.display)
      ) {
        for (e.save(), r = t.getLabels().length - 1; r >= 0; r--) {
          let d = s.setContext(t.getContext(r)),
            { color: h, lineWidth: u } = d;
          !u ||
            !h ||
            ((e.lineWidth = u),
              (e.strokeStyle = h),
              e.setLineDash(d.borderDash),
              (e.lineDashOffset = d.borderDashOffset),
              (l = t.getDistanceFromCenterForValue(
                n.ticks.reverse ? t.min : t.max
              )),
              (c = t.getPointPosition(r, l)),
              e.beginPath(),
              e.moveTo(t.xCenter, t.yCenter),
              e.lineTo(c.x, c.y),
              e.stroke());
        }
        e.restore();
      }
    }
    drawBorder() { }
    drawLabels() {
      let t = this,
        e = t.ctx,
        n = t.options,
        s = n.ticks;
      if (!s.display) return;
      let o = t.getIndexAngle(0),
        a,
        r;
      e.save(),
        e.translate(t.xCenter, t.yCenter),
        e.rotate(o),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        t.ticks.forEach((l, c) => {
          if (c === 0 && !n.reverse) return;
          let d = s.setContext(t.getContext(c)),
            h = N(d.font);
          if (
            ((a = t.getDistanceFromCenterForValue(t.ticks[c].value)),
              d.showLabelBackdrop)
          ) {
            (r = e.measureText(l.label).width), (e.fillStyle = d.backdropColor);
            let u = G(d.backdropPadding);
            e.fillRect(
              -r / 2 - u.left,
              -a - h.size / 2 - u.top,
              r + u.width,
              h.size + u.height
            );
          }
          se(e, l.label, 0, -a, h, { color: d.color });
        }),
        e.restore();
    }
    drawTitle() { }
  };
  _e.id = "radialLinear";
  _e.defaults = {
    display: !0,
    animate: !0,
    position: "chartArea",
    angleLines: {
      display: !0,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0,
    },
    grid: { circular: !1 },
    startAngle: 0,
    ticks: { showLabelBackdrop: !0, callback: on.formatters.numeric },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: !0,
      font: { size: 10 },
      callback(i) {
        return i;
      },
      padding: 5,
    },
  };
  _e.defaultRoutes = {
    "angleLines.color": "borderColor",
    "pointLabels.color": "color",
    "ticks.color": "color",
  };
  _e.descriptors = { angleLines: { _fallback: "grid" } };
  var gn = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
    j = Object.keys(gn);
  function yc(i, t) {
    return i - t;
  }
  function ea(i, t) {
    if (P(t)) return null;
    let e = i._adapter,
      { parser: n, round: s, isoWeekday: o } = i._parseOpts,
      a = t;
    return (
      typeof n == "function" && (a = n(a)),
      B(a) || (a = typeof n == "string" ? e.parse(a, n) : e.parse(a)),
      a === null
        ? null
        : (s &&
          (a =
            s === "week" && (Mt(o) || o === !0)
              ? e.startOf(a, "isoWeek", o)
              : e.startOf(a, s)),
          +a)
    );
  }
  function na(i, t, e, n) {
    let s = j.length;
    for (let o = j.indexOf(i); o < s - 1; ++o) {
      let a = gn[j[o]],
        r = a.steps ? a.steps : Number.MAX_SAFE_INTEGER;
      if (a.common && Math.ceil((e - t) / (r * a.size)) <= n) return j[o];
    }
    return j[s - 1];
  }
  function vc(i, t, e, n, s) {
    for (let o = j.length - 1; o >= j.indexOf(e); o--) {
      let a = j[o];
      if (gn[a].common && i._adapter.diff(s, n, a) >= t - 1) return a;
    }
    return j[e ? j.indexOf(e) : 0];
  }
  function wc(i) {
    for (let t = j.indexOf(i) + 1, e = j.length; t < e; ++t)
      if (gn[j[t]].common) return j[t];
  }
  function ia(i, t, e) {
    if (!e) i[t] = !0;
    else if (e.length) {
      let { lo: n, hi: s } = ae(e, t),
        o = e[n] >= t ? e[n] : e[s];
      i[o] = !0;
    }
  }
  function Sc(i, t, e, n) {
    let s = i._adapter,
      o = +s.startOf(t[0].value, n),
      a = t[t.length - 1].value,
      r,
      l;
    for (r = o; r <= a; r = +s.add(r, 1, n))
      (l = e[r]), l >= 0 && (t[l].major = !0);
    return t;
  }
  function sa(i, t, e) {
    let n = [],
      s = {},
      o = t.length,
      a,
      r;
    for (a = 0; a < o; ++a)
      (r = t[a]), (s[r] = a), n.push({ value: r, major: !1 });
    return o === 0 || !e ? n : Sc(i, n, s, e);
  }
  var ye = class extends bt {
    constructor(t) {
      super(t);
      (this._cache = { data: [], labels: [], all: [] }),
        (this._unit = "day"),
        (this._majorUnit = void 0),
        (this._offsets = {}),
        (this._normalized = !1),
        (this._parseOpts = void 0);
    }
    init(t, e) {
      let n = t.time || (t.time = {}),
        s = (this._adapter = new Ir._date(t.adapters.date));
      It(n.displayFormats, s.formats()),
        (this._parseOpts = {
          parser: n.parser,
          round: n.round,
          isoWeekday: n.isoWeekday,
        }),
        super.init(t),
        (this._normalized = e.normalized);
    }
    parse(t, e) {
      return t === void 0 ? null : ea(this, t);
    }
    beforeLayout() {
      super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] });
    }
    determineDataLimits() {
      let t = this,
        e = t.options,
        n = t._adapter,
        s = e.time.unit || "day",
        { min: o, max: a, minDefined: r, maxDefined: l } = t.getUserBounds();
      function c(d) {
        !r && !isNaN(d.min) && (o = Math.min(o, d.min)),
          !l && !isNaN(d.max) && (a = Math.max(a, d.max));
      }
      (!r || !l) &&
        (c(t._getLabelBounds()),
          (e.bounds !== "ticks" || e.ticks.source !== "labels") &&
          c(t.getMinMax(!1))),
        (o = B(o) && !isNaN(o) ? o : +n.startOf(Date.now(), s)),
        (a = B(a) && !isNaN(a) ? a : +n.endOf(Date.now(), s) + 1),
        (t.min = Math.min(o, a - 1)),
        (t.max = Math.max(o + 1, a));
    }
    _getLabelBounds() {
      let t = this.getLabelTimestamps(),
        e = Number.POSITIVE_INFINITY,
        n = Number.NEGATIVE_INFINITY;
      return (
        t.length && ((e = t[0]), (n = t[t.length - 1])), { min: e, max: n }
      );
    }
    buildTicks() {
      let t = this,
        e = t.options,
        n = e.time,
        s = e.ticks,
        o = s.source === "labels" ? t.getLabelTimestamps() : t._generate();
      e.bounds === "ticks" &&
        o.length &&
        ((t.min = t._userMin || o[0]), (t.max = t._userMax || o[o.length - 1]));
      let a = t.min,
        r = t.max,
        l = ks(o, a, r);
      return (
        (t._unit =
          n.unit ||
          (s.autoSkip
            ? na(n.minUnit, t.min, t.max, t._getLabelCapacity(a))
            : vc(t, l.length, n.minUnit, t.min, t.max))),
        (t._majorUnit =
          !s.major.enabled || t._unit === "year" ? void 0 : wc(t._unit)),
        t.initOffsets(o),
        e.reverse && l.reverse(),
        sa(t, l, t._majorUnit)
      );
    }
    initOffsets(t) {
      let e = this,
        n = 0,
        s = 0,
        o,
        a;
      e.options.offset &&
        t.length &&
        ((o = e.getDecimalForValue(t[0])),
          t.length === 1
            ? (n = 1 - o)
            : (n = (e.getDecimalForValue(t[1]) - o) / 2),
          (a = e.getDecimalForValue(t[t.length - 1])),
          t.length === 1
            ? (s = a)
            : (s = (a - e.getDecimalForValue(t[t.length - 2])) / 2));
      let r = t.length < 3 ? 0.5 : 0.25;
      (n = X(n, 0, r)),
        (s = X(s, 0, r)),
        (e._offsets = { start: n, end: s, factor: 1 / (n + 1 + s) });
    }
    _generate() {
      let t = this,
        e = t._adapter,
        n = t.min,
        s = t.max,
        o = t.options,
        a = o.time,
        r = a.unit || na(a.minUnit, n, s, t._getLabelCapacity(n)),
        l = C(a.stepSize, 1),
        c = r === "week" ? a.isoWeekday : !1,
        d = Mt(c) || c === !0,
        h = {},
        u = n,
        f,
        g;
      if (
        (d && (u = +e.startOf(u, "isoWeek", c)),
          (u = +e.startOf(u, d ? "day" : r)),
          e.diff(s, n, r) > 1e5 * l)
      )
        throw new Error(
          n + " and " + s + " are too far apart with stepSize of " + l + " " + r
        );
      let p = o.ticks.source === "data" && t.getDataTimestamps();
      for (f = u, g = 0; f < s; f = +e.add(f, l, r), g++) ia(h, f, p);
      return (
        (f === s || o.bounds === "ticks" || g === 1) && ia(h, f, p),
        Object.keys(h)
          .sort((m, b) => m - b)
          .map((m) => +m)
      );
    }
    getLabelForValue(t) {
      let e = this,
        n = e._adapter,
        s = e.options.time;
      return s.tooltipFormat
        ? n.format(t, s.tooltipFormat)
        : n.format(t, s.displayFormats.datetime);
    }
    _tickFormatFunction(t, e, n, s) {
      let o = this,
        a = o.options,
        r = a.time.displayFormats,
        l = o._unit,
        c = o._majorUnit,
        d = l && r[l],
        h = c && r[c],
        u = n[e],
        f = c && h && u && u.major,
        g = o._adapter.format(t, s || (f ? h : d)),
        p = a.ticks.callback;
      return p ? R(p, [g, e, n], o) : g;
    }
    generateTickLabels(t) {
      let e, n, s;
      for (e = 0, n = t.length; e < n; ++e)
        (s = t[e]), (s.label = this._tickFormatFunction(s.value, e, t));
    }
    getDecimalForValue(t) {
      let e = this;
      return t === null ? NaN : (t - e.min) / (e.max - e.min);
    }
    getPixelForValue(t) {
      let e = this,
        n = e._offsets,
        s = e.getDecimalForValue(t);
      return e.getPixelForDecimal((n.start + s) * n.factor);
    }
    getValueForPixel(t) {
      let e = this,
        n = e._offsets,
        s = e.getDecimalForPixel(t) / n.factor - n.end;
      return e.min + s * (e.max - e.min);
    }
    _getLabelSize(t) {
      let e = this,
        n = e.options.ticks,
        s = e.ctx.measureText(t).width,
        o = Q(e.isHorizontal() ? n.maxRotation : n.minRotation),
        a = Math.cos(o),
        r = Math.sin(o),
        l = e._resolveTickFontOptions(0).size;
      return { w: s * a + l * r, h: s * r + l * a };
    }
    _getLabelCapacity(t) {
      let e = this,
        n = e.options.time,
        s = n.displayFormats,
        o = s[n.unit] || s.millisecond,
        a = e._tickFormatFunction(t, 0, sa(e, [t], e._majorUnit), o),
        r = e._getLabelSize(a),
        l = Math.floor(e.isHorizontal() ? e.width / r.w : e.height / r.h) - 1;
      return l > 0 ? l : 1;
    }
    getDataTimestamps() {
      let t = this,
        e = t._cache.data || [],
        n,
        s;
      if (e.length) return e;
      let o = t.getMatchingVisibleMetas();
      if (t._normalized && o.length)
        return (t._cache.data = o[0].controller.getAllParsedValues(t));
      for (n = 0, s = o.length; n < s; ++n)
        e = e.concat(o[n].controller.getAllParsedValues(t));
      return (t._cache.data = t.normalize(e));
    }
    getLabelTimestamps() {
      let t = this,
        e = t._cache.labels || [],
        n,
        s;
      if (e.length) return e;
      let o = t.getLabels();
      for (n = 0, s = o.length; n < s; ++n) e.push(ea(t, o[n]));
      return (t._cache.labels = t._normalized ? e : t.normalize(e));
    }
    normalize(t) {
      return Gn(t.sort(yc));
    }
  };
  ye.id = "time";
  ye.defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: !1,
      unit: !1,
      round: !1,
      isoWeekday: !1,
      minUnit: "millisecond",
      displayFormats: {},
    },
    ticks: { source: "auto", major: { enabled: !1 } },
  };
  function oa(i, t, e) {
    let n, s, o, a;
    if (e) (n = Math.floor(t)), (s = Math.ceil(t)), (o = i[n]), (a = i[s]);
    else {
      let l = ae(i, t);
      (o = l.lo), (a = l.hi), (n = i[o]), (s = i[a]);
    }
    let r = s - n;
    return r ? o + ((a - o) * (t - n)) / r : o;
  }
  var _i = class extends ye {
    constructor(t) {
      super(t);
      (this._table = []), (this._maxIndex = void 0);
    }
    initOffsets() {
      let t = this,
        e = t._getTimestampsForTable();
      (t._table = t.buildLookupTable(e)),
        (t._maxIndex = t._table.length - 1),
        super.initOffsets(e);
    }
    buildLookupTable(t) {
      let e = this,
        { min: n, max: s } = e;
      if (!t.length)
        return [
          { time: n, pos: 0 },
          { time: s, pos: 1 },
        ];
      let o = [n],
        a,
        r,
        l;
      for (a = 0, r = t.length; a < r; ++a)
        (l = t[a]), l > n && l < s && o.push(l);
      return o.push(s), o;
    }
    _getTimestampsForTable() {
      let t = this,
        e = t._cache.all || [];
      if (e.length) return e;
      let n = t.getDataTimestamps(),
        s = t.getLabelTimestamps();
      return (
        n.length && s.length
          ? (e = t.normalize(n.concat(s)))
          : (e = n.length ? n : s),
        (e = t._cache.all = e),
        e
      );
    }
    getPixelForValue(t, e) {
      let n = this,
        s = n._offsets,
        o =
          n._normalized && n._maxIndex > 0 && !P(e)
            ? e / n._maxIndex
            : n.getDecimalForValue(t);
      return n.getPixelForDecimal((s.start + o) * s.factor);
    }
    getDecimalForValue(t) {
      return oa(this._table, t) / this._maxIndex;
    }
    getValueForPixel(t) {
      let e = this,
        n = e._offsets,
        s = e.getDecimalForPixel(t) / n.factor - n.end;
      return oa(e._table, s * this._maxIndex, !0);
    }
  };
  _i.id = "timeseries";
  _i.defaults = ye.defaults;
  var aa = class extends wt {
    static get styles() {
      return wn``;
    }
    static get properties() {
      return { data: Array };
    }
    constructor() {
      super();
      nt.register(xe),
        nt.register($t),
        nt.register(Ct),
        nt.register(jt),
        nt.register(Ot);
    }
    firstUpdated() {
      (this.chartOptions = {
        responsive: !0,
        maintainAspectRatio: !1,
        type: "line",
        data: [],
        options: {
          scales: {
            x: {
              display: !0,
              type: "linear",
              position: "bottom",
              axis: "x",
              min: 0,
              max: 1,
            },
            y: {
              display: !0,
              type: "linear",
              position: "left",
              axis: "y",
              min: 0,
              max: 1,
            },
          },
        },
        plugins: { legend: { display: !1 }, Filler: !1 },
      }),
        (this.chart = new nt(
          this.shadowRoot.querySelector("#chart"),
          this.chartOptions
        ));
    }
    updated(t) {
      t.has("data") && this._updateData();
    }
    async _updateData() {
      let t = [
        {
          type: "line",
          backgroundColor: "white",
          borderColor: "red",
          data: this.data,
          showLine: !0,
          yAxisID: "y",
        },
      ],
        e = this.data.map((l) => l.x),
        n = this.data.map((l) => l.y),
        s = Math.min(...e),
        o = Math.max(...e),
        a = Math.min(...n),
        r = Math.max(...n);
      (this.chart.data = { datasets: t }),
        (this.chart.options.scales.x.min = s),
        (this.chart.options.scales.x.max = o),
        (this.chart.options.scales.y.min = a),
        (this.chart.options.scales.y.max = r),
        this.chart.update();
    }
    render() {
      return Bi`<canvas id="chart"></canvas>`;
    }
  };
  customElements.define("challenge-chart", aa);
})();
/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */
/*!
 * Chart.js v3.2.1
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
