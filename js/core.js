/* UI Studio — core runtime. Shared by the editor AND exported mockups. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  helpers
   * ------------------------------------------------------------------ */
  function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function fmt(ms) { ms = Math.max(0, ms || 0); var s = Math.floor(ms / 1000), m = Math.floor(s / 60); return m + ":" + String(s % 60).padStart(2, "0"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]); }); }
  function hslRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function c(x) { x = x < 0 ? x + 1 : x > 1 ? x - 1 : x; if (x < 1 / 6) return p + (q - p) * 6 * x; if (x < 1 / 2) return q; if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6; return p; }
    return Math.round(c(h / 360 + 1 / 3) * 255) + " " + Math.round(c(h / 360) * 255) + " " + Math.round(c(h / 360 - 1 / 3) * 255);
  }

  /* ------------------------------------------------------------------ *
   *  sample data
   * ------------------------------------------------------------------ */
  var defaultData = {
    now: { title: "Red Thread", artist: "Mira Vale", album: "Forms of Silence · 2026", seed: 3, duration: 258000 },
    tracks: [
      { title: "Red Thread", artist: "Mira Vale", album: "Forms of Silence", seed: 3, duration: 258, plays: 42 },
      { title: "Afterimage", artist: "North Index", album: "Intervals", seed: 11, duration: 222, plays: 33 },
      { title: "Still Water", artist: "Ana Lune", album: "Soft Machines", seed: 19, duration: 306, plays: 24 },
      { title: "Pale Distance", artist: "Common Field", album: "Contour Lines", seed: 7, duration: 271, plays: 18 },
      { title: "Intervals", artist: "North Index", album: "Intervals", seed: 23, duration: 341, plays: 15 },
      { title: "Soft Machines", artist: "Ana Lune", album: "Soft Machines", seed: 29, duration: 288, plays: 12 },
      { title: "Contour Lines", artist: "Common Field", album: "Contour Lines", seed: 13, duration: 254, plays: 9 },
      { title: "Quiet Sequence", artist: "Mira Vale", album: "Forms of Silence", seed: 17, duration: 198, plays: 7 }
    ],
    albums: [
      { title: "Forms of Silence", artist: "Mira Vale", seed: 3, year: 2026 },
      { title: "Intervals", artist: "North Index", seed: 11, year: 2025 },
      { title: "Soft Machines", artist: "Ana Lune", seed: 19, year: 2026 },
      { title: "Contour Lines", artist: "Common Field", seed: 7, year: 2024 }
    ],
    moods: [
      { name: "Ambient", albums: 12, hue: 2 },
      { name: "Electronic", albums: 19, hue: 176 },
      { name: "Dream pop", albums: 26, hue: 45 },
      { name: "Instrumental", albums: 33, hue: 205 }
    ],
    stats: { hours: "38.4", tracks: "624", albums: "86", artists: "54", delta: "+12% from August", discoveries: "47 were new discoveries" }
  };

  /* ------------------------------------------------------------------ *
   *  album art (procedural — stands in for real covers)
   * ------------------------------------------------------------------ */
  var ART = [
    ["#ff5a4d", "#7a0f12", "#1a0304"], ["#3aa7c9", "#0d2a33", "#040a0c"],
    ["#ff8a3d", "#7a1f0a", "#160402"], ["#b9c4ff", "#2a2f55", "#070812"],
    ["#5ad1a0", "#0d3327", "#03100c"], ["#e07be0", "#3a1040", "#0c0310"],
    ["#7bd0ff", "#0d2a44", "#040a12"], ["#f2b657", "#5a3a0a", "#140d02"]
  ];
  function art(seed) {
    var h = hash(seed * 1.31 + 0.7);
    var c = ART[Math.floor(h * ART.length) % ART.length];
    return "radial-gradient(65% 80% at 28% 18%," + c[0] + ",transparent 62%)," +
      "radial-gradient(60% 70% at 76% 74%," + c[1] + ",transparent 64%)," +
      "conic-gradient(from " + Math.floor(h * 360) + "deg at 50% 50%," + c[2] + "," + c[1] + "," + c[2] + "," + c[0] + "," + c[2] + ")";
  }
  function albumHue(seed) { return Math.floor(hash(seed * 2.13) * 360); }

  /* ------------------------------------------------------------------ *
   *  accent resolution (dynamic | custom | fixed)
   * ------------------------------------------------------------------ */
  function accentFor(seed, state) {
    var a = (state && state.accent) || { mode: "dynamic", hue: 258, sat: 70, light: 64 };
    var h = a.mode === "dynamic" ? albumHue(seed) : a.hue;
    var s = a.sat == null ? 70 : a.sat, l = a.light == null ? 64 : a.light;
    return {
      h: h, s: s, l: l,
      css: "hsl(" + h + " " + s + "% " + l + "%)",
      rgb: hslRgb(h, s, l),
      soft: "hsl(" + h + " " + s + "% " + l + "% / .16)",
      line: "hsl(" + h + " " + s + "% " + l + "% / .42)",
      glow: "hsl(" + h + " " + s + "% " + l + "% / .5)"
    };
  }

  /* ------------------------------------------------------------------ *
   *  charts
   * ------------------------------------------------------------------ */
  function fit(c) {
    var dpr = Math.min(2, window.devicePixelRatio || 1), r = c.getBoundingClientRect();
    if (c.width !== Math.round(r.width * dpr) || c.height !== Math.round(r.height * dpr)) { c.width = Math.max(1, Math.round(r.width * dpr)); c.height = Math.max(1, Math.round(r.height * dpr)); }
    return { w: r.width, h: r.height, dpr: dpr };
  }
  function ctx2(c) { var f = fit(c), x = c.getContext("2d"); x.setTransform(f.dpr, 0, 0, f.dpr, 0, 0); x.clearRect(0, 0, f.w, f.h); return { ctx: x, w: f.w, h: f.h }; }

  var charts = {
    spectrum: function (c, bands, acc) {
      if (!c) return; var o = ctx2(c), x = o.ctx, w = o.w, h = o.h;
      var n = bands.length, gap = 2, bw = (w - gap * (n - 1)) / n;
      for (var i = 0; i < n; i++) {
        var v = bands[i], bh = Math.max(2, v * h * .82), bx = i * (bw + gap), by = h - bh;
        var g = x.createLinearGradient(0, by, 0, h);
        g.addColorStop(0, "hsl(" + acc.h + " " + acc.s + "% " + (acc.l + 8) + "% / .98)");
        g.addColorStop(1, "hsl(" + acc.h + " " + acc.s + "% " + acc.l + "% / .3)");
        x.fillStyle = g; x.fillRect(bx, by, bw, bh);
        x.fillStyle = "rgb(255 255 255 / .5)"; x.fillRect(bx, by, bw, 1.5);
      }
    },
    waveform: function (c, seed, progress, acc) {
      if (!c) return; var o = ctx2(c), x = o.ctx, w = o.w, h = o.h, mid = h / 2;
      var bars = Math.max(30, Math.floor(w / 4));
      for (var i = 0; i < bars; i++) {
        var bx = i * (w / bars), xr = i / bars;
        var a = hash(i * .7 + seed) * .6 + hash(i * .23 + seed * 2) * .4;
        var env = Math.sin(Math.PI * xr) * .55 + .45, ah = Math.max(1.5, a * env * (h * .44));
        var played = xr <= progress, g = x.createLinearGradient(0, mid - ah, 0, mid + ah);
        if (played) { g.addColorStop(0, "hsl(" + acc.h + " " + acc.s + "% " + (acc.l + 10) + "%)"); g.addColorStop(1, "hsl(" + acc.h + " " + acc.s + "% " + acc.l + "%)"); }
        else { g.addColorStop(0, "rgb(255 255 255 / .28)"); g.addColorStop(1, "rgb(255 255 255 / .16)"); }
        x.fillStyle = g; x.fillRect(bx, mid - ah, Math.max(1.4, (w / bars) * .55), ah * 2);
      }
    },
    bars: function (c, values, acc) {
      if (!c) return; var o = ctx2(c), x = o.ctx, w = o.w, h = o.h;
      var max = Math.max.apply(null, values) || 1, n = values.length, gap = Math.max(6, w * .02), bw = (w - gap * (n - 1)) / n;
      for (var i = 0; i < n; i++) {
        var bh = values[i] / max * (h * .86), bx = i * (bw + gap), by = h - bh, r = Math.min(6, bw / 3);
        var g = x.createLinearGradient(0, by, 0, h);
        g.addColorStop(0, "hsl(" + acc.h + " " + acc.s + "% " + (acc.l + 6) + "%)"); g.addColorStop(1, "hsl(" + acc.h + " " + acc.s + "% " + (acc.l - 16) + "%)");
        x.fillStyle = g; x.beginPath(); x.moveTo(bx + r, by); x.arcTo(bx + bw, by, bx + bw, h, r); x.lineTo(bx + bw, h); x.lineTo(bx, h); x.arcTo(bx, by, bx + bw, by, r); x.closePath(); x.fill();
      }
    },
    line: function (c, values, seeds, acc) {
      if (!c) return; var o = ctx2(c), x = o.ctx, w = o.w, h = o.h, n = values.length, pts = [];
      for (var i = 0; i < n; i++) pts.push([i / (n - 1) * w, h - values[i] * h * .82 - 4]);
      for (var j = 0; j < n - 1; j++) {
        var hue = seeds ? albumHue(seeds[j % seeds.length]) : acc.h;
        x.beginPath(); x.moveTo(pts[j][0], pts[j][1]); x.lineTo(pts[j + 1][0], pts[j + 1][1]);
        x.strokeStyle = "hsl(" + hue + " 72% 62%)"; x.lineWidth = 3; x.lineCap = "round"; x.shadowColor = "hsl(" + hue + " 72% 62% / .7)"; x.shadowBlur = 10; x.stroke();
      }
      x.shadowBlur = 0; x.beginPath(); pts.forEach(function (p, i) { return i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); });
      x.lineTo(w, h); x.lineTo(0, h); x.closePath();
      var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "hsl(" + acc.h + " " + acc.s + "% 60% / .35)"); g.addColorStop(1, "hsl(" + acc.h + " " + acc.s + "% 60% / 0)");
      x.fillStyle = g; x.fill();
    },
    heat: function (c, opts, acc) {
      if (!c) return; var o = ctx2(c), x = o.ctx, w = o.w, h = o.h;
      var cols = opts.cols || 7, rows = opts.rows || 8, gap = 4, cw = (w - gap * (cols - 1)) / cols, ch = (h - gap * (rows - 1)) / rows;
      for (var r = 0; r < rows; r++) for (var col = 0; col < cols; col++) {
        var seed = r * 17 + col * 5 + 2.5, v = hash(seed), hue = opts.artColour ? albumHue(seed) : acc.h;
        var a = .1 + v * .85, bx = col * (cw + gap), by = r * (ch + gap), rr = Math.min(4, ch / 3);
        x.fillStyle = "hsl(" + hue + " 68% " + (34 + v * 22) + "% / " + a.toFixed(2) + ")";
        x.beginPath(); x.moveTo(bx + rr, by); x.arcTo(bx + cw, by, bx + cw, by + ch, rr); x.arcTo(bx + cw, by + ch, bx, by + ch, rr); x.arcTo(bx, by + ch, bx, by, rr); x.arcTo(bx, by, bx + cw, by, rr); x.closePath(); x.fill();
        x.strokeStyle = "rgb(255 255 255 / .05)"; x.stroke();
      }
    }
  };

  /* rings -> SVG string (multi-metric concentric) */
  function ringsSvg(metrics, acc, size) {
    size = size || 200; var cx = 100, cy = 100, out = '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '">';
    metrics.forEach(function (m, i) {
      var r = 86 - i * 20, c = 2 * Math.PI * r, frac = clamp(m.value / m.max, 0, 1), col = m.colour || "hsl(" + ((acc.h + i * 40) % 360) + " 72% 62%)";
      out += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="rgb(0 0 0 / .5)" stroke-width="11"/>';
      out += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="rgb(255 255 255 / .06)" stroke-width="11"/>';
      out += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="11" stroke-linecap="round" transform="rotate(-90 100 100)" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - frac)).toFixed(1) + '" style="filter:drop-shadow(0 0 4px ' + col + ')"/>';
    });
    out += '</svg>'; return out;
  }
  function ringSvg(progress, acc, stroke, size) {
    stroke = stroke || 5; size = size || 120; var c = 2 * Math.PI * 44;
    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '">' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="rgb(0 0 0 / .5)" stroke-width="' + stroke + '"/>' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="rgb(255 255 255 / .07)" stroke-width="' + stroke + '"/>' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="' + acc.css + '" stroke-width="' + stroke + '" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - progress)).toFixed(1) + '" style="filter:drop-shadow(0 0 5px ' + acc.glow + ')"/>' +
      '</svg>';
  }
  function wfBars(n, acc) { var s = ""; for (var i = 0; i < n; i++) s += '<i style="height:' + (4 + hash(i * 1.7) * 15).toFixed(0) + 'px;background:' + acc.css + '"></i>'; return s; }

  /* ------------------------------------------------------------------ *
   *  block registry
   * ------------------------------------------------------------------ */
  var blocks = {};
  function register(type, def) { blocks[type] = def; def.type = type; }

  /* ------------------------------------------------------------------ *
   *  global animation loop
   * ------------------------------------------------------------------ */
  var anims = [];
  var NB = 48, bands = new Float32Array(NB), target = new Float32Array(NB), peak = new Float32Array(NB);
  var started = false, t0 = 0, pos = 0, dur = 258000, playing = true, trackSeed = 3;
  function registerAnim(el, kind, opts) { anims.push({ el: el, kind: kind, opts: opts || {} }); ensureLoop(); }
  function clearAnims() { anims = []; }
  function ensureLoop() {
    if (started) return; started = true; t0 = performance.now();
    for (var i = 0; i < NB; i++) { bands[i] = .2; }
    requestAnimationFrame(loop);
  }
  function loop(ts) {
    requestAnimationFrame(loop);
    var t = (ts - t0) / 1000, beat = .75 + .25 * Math.exp(-((t % .46)) * 7);
    for (var i = 0; i < NB; i++) {
      var x = i / (NB - 1), env = Math.pow(1 - x, .72) * .92 + .06;
      var wob = .5 + .5 * Math.sin(t * (2.1 + i * .17) + i * 1.7), gr = .55 + .45 * hash(i * 3.3 + Math.floor(t * 6));
      target[i] = clamp(env * wob * gr * beat * (i < 4 ? 1.15 : 1), .02, 1);
      bands[i] = lerp(bands[i], target[i], .32);
      peak[i] = Math.max(peak[i] - .018, bands[i]);
    }
    if (playing) { pos += 16 * 8; if (pos >= dur) pos = 0; }
    anims.forEach(function (a) {
      if (!a.el || !a.el.isConnected) return;
      if (a.kind === "spectrum") charts.spectrum(a.el, bands, a.opts.acc);
      else if (a.kind === "wave") charts.waveform(a.el, a.opts.seed, pos / dur, a.opts.acc);
      else if (a.kind === "vu") { var lvl = 0; for (var k = 0; k < NB; k++) lvl += bands[k]; lvl /= NB; a.opts.onDraw && a.opts.onDraw(lvl); }
      else if (a.kind === "spine") a.opts.onDraw && a.opts.onDraw(bands);
    });
  }
  function setPlaying(v) { playing = v; }
  function setNow(seed, d) { trackSeed = seed; if (d) dur = d; }

  /* ------------------------------------------------------------------ *
   *  render
   * ------------------------------------------------------------------ */
  function ctxFor(state) { return { state: state, tokens: state.tokens, accentFor: function (s) { return accentFor(s, state); }, art: art, albumHue: albumHue, fmt: fmt, esc: esc, data: state.data, wfBars: wfBars, ringSvg: ringSvg, ringsSvg: ringsSvg, charts: charts, registerAnim: registerAnim }; }

  function shellHtml(state, ctx) {
    var L = state.layout || {}, t = state.tokens, acc = ctx.accentFor(ctx.data.now.seed);
    var h = '<div class="u-shell" data-skin="' + esc(state.skin || state.theme || "echo-dark") + '">';
    if (L.sidebar) {
      h += '<aside class="u-side"><div class="u-brand" style="background:linear-gradient(150deg,' + acc.css + ',hsl(' + ((acc.h + 40) % 360) + ' ' + acc.s + '% ' + acc.l + '%))"><svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h16" stroke="#0b0b14" stroke-width="2.6" stroke-linecap="round"/></svg></div>' +
        '<nav class="u-nav">' + ["Home", "Playing", "Stats"].map(function (n, i) { return '<button class="' + (i === 1 ? "on" : "") + '" title="' + n + '"><span class="u-navdot"></span></button>'; }).join("") + '</nav>' +
        '<div class="u-sidenow"><span class="u-wf">' + ctx.wfBars(9, acc) + '</span><em>' + esc(ctx.data.now.title) + '</em></div></aside>';
    }
    h += '<div class="u-main">';
    if (L.topbar) {
      h += '<header class="u-top"><div class="u-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5" stroke-linecap="round"/></svg><input placeholder="Search music" /></div><div class="u-nowchip"><span class="u-thumb" style="background-image:' + ctx.art(ctx.data.now.seed) + '"></span><div><b>' + esc(ctx.data.now.title) + '</b><i>' + esc(ctx.data.now.artist) + '</i></div></div></header>';
    }
    h += '<div class="u-content" data-canvas>';
    (state.blocks || []).forEach(function (b) {
      var def = blocks[b.type]; if (!def) return;
      var st = b.style || {};
      h += '<section class="u-block" style="grid-column:span ' + (b.span || 12) + '"' +
        ' data-block-id="' + b.id + '" data-type="' + b.type + '"' +
        ' data-pad="' + (st.pad == null ? 0 : st.pad) + '" data-tint="' + (st.tint || "none") + '"' +
        ' data-align="' + (st.align || "left") + '" data-hide="' + (st.hide || "none") + '">' +
        def.render(b.props || {}, ctx) + '</section>';
    });
    h += '</div>';
    if (L.playerbar) {
      h += '<footer class="u-player"><div class="u-pbleft"><span class="u-thumb lg" style="background-image:' + ctx.art(ctx.data.now.seed) + '"></span><div><b>' + esc(ctx.data.now.title) + '</b><i>' + esc(ctx.data.now.artist) + '</i></div></div>' +
        '<div class="u-pbcenter"><button class="u-pbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5h2.4v13H7zM19 6v12l-8.5-6z"/></svg></button>' +
        '<span class="u-ring" data-pb-ring>' + ringSvg(0, acc, 5, 64) + '</span>' +
        '<button class="u-pbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.6 5.5H17v13h-2.4zM5 6l8.5 6L5 18z"/></svg></button></div>' +
        '<div class="u-pbright"><div class="u-vu"><span>L</span><div class="u-meter"><i data-pb-vu="l" style="width:0%"></i></div></div><div class="u-vu"><span>R</span><div class="u-meter"><i data-pb-vu="r" style="width:0%"></i></div></div></div></footer>';
    }
    h += '</div></div>';
    return h;
  }

  function render(state, root) {
    clearAnims();
    var ctx = ctxFor(state);
    root.innerHTML = shellHtml(state, ctx);
    /* mount blocks */
    Array.prototype.forEach.call(root.querySelectorAll(".u-block"), function (el) {
      var def = blocks[el.getAttribute("data-type")]; if (!def || !def.mount) return;
      var id = el.getAttribute("data-block-id");
      var b = (state.blocks || []).filter(function (x) { return x.id === id; })[0];
      try { def.mount(el, (b && b.props) || {}, ctx); } catch (e) { /* noop */ }
    });
    /* player bar anim */
    var acc = ctx.accentFor(ctx.data.now.seed);
    var ring = root.querySelector("[data-pb-ring]");
    var vuL = root.querySelector('[data-pb-vu="l"]'), vuR = root.querySelector('[data-pb-vu="r"]');
    if (ring || vuL) {
      var fake = { el: root, isConnected: true };
      registerAnim(fake, "vu", { acc: acc, onDraw: function (lvl) {
        if (vuL) vuL.style.width = clamp(lvl * 1.25, 0, 1) * 100 + "%";
        if (vuR) vuR.style.width = clamp(lvl * 1.1, 0, 1) * 100 + "%";
      } });
    }
    return ctx;
  }

  /* ------------------------------------------------------------------ *
   *  depth objects — album art cut into foreground shapes that occlude
   *  the title/lyrics (real layer order + pointer parallax)
   * ------------------------------------------------------------------ */
  var SHAPES = {
    orb: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='47'/></svg>",
    blob: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M52 2c22 0 43 13 45 34s-9 41-28 51-45 4-57-13S0 32 11 18 31 2 52 2z'/></svg>",
    slab: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='7' y='20' width='86' height='60' rx='13'/></svg>",
    star: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 3l13 31 33 2-26 22 8 32-28-18-28 18 8-32L4 36l33-2z'/></svg>",
    diamond: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 2l48 48-48 48L2 50z'/></svg>",
    vinyl: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill-rule='evenodd' d='M50 2a48 48 0 100 96 48 48 0 000-96zm0 15a33 33 0 110 66 33 33 0 010-66zm0 27a6 6 0 100 12 6 6 0 000-12z'/></svg>",
    ring: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill-rule='evenodd' d='M50 2a48 48 0 100 96 48 48 0 000-96zm0 17a31 31 0 110 62 31 31 0 010-62z'/></svg>"
  };
  var DEPTH_LAYOUTS = {
    1: [[64, 16, 46, 0.9]],
    2: [[66, 8, 38, 1.0], [19, 54, 24, 0.55]],
    3: [[68, 4, 34, 1.05], [17, 50, 21, 0.62], [56, 66, 17, 0.45]]
  };
  function depthObjects(art, opts) {
    opts = opts || {};
    var n = Math.max(1, Math.min(3, opts.count == null ? 2 : opts.count));
    var lay = DEPTH_LAYOUTS[n], shape = opts.shape || "orb", out = '<div class="u-np-depth">';
    for (var i = 0; i < lay.length; i++) {
      var o = lay[i], sh = shape === "mixed" ? ["orb", "slab", "blob"][i % 3] : shape;
      out += '<div class="u-np-depthobj" data-depth="' + o[3] + '" data-shape="' + sh + '" style="background-image:' + art +
        ';mask-size:auto ' + o[2] + '%;-webkit-mask-size:auto ' + o[2] + '%;mask-position:' + o[0] + '% ' + o[1] + '%;-webkit-mask-position:' + o[0] + '% ' + o[1] + '%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat"></div>';
    }
    return out + '</div>';
  }
  function applyDepthMasks(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-shape]"), function (o) {
      var svg = SHAPES[o.getAttribute("data-shape")] || SHAPES.orb;
      var url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
      o.style.webkitMaskImage = url; o.style.maskImage = url;
    });
  }
  function bindDepth(container, opts) {
    opts = opts || {};
    /* Occlusion is static by design — objects do NOT follow the cursor.
       Optional autonomous drift only when opts.motion is explicitly true. */
    if (!opts.motion) return;
    var objs = Array.prototype.slice.call(container.querySelectorAll(".u-np-depthobj"));
    if (!objs.length) return;
    var t0 = performance.now();
    (function loop(ts) {
      if (!container.isConnected) return;
      requestAnimationFrame(loop);
      var t = (ts - t0) / 1000;
      objs.forEach(function (o) {
        var d = parseFloat(o.getAttribute("data-depth")) || 0.5;
        o.style.transform = "translate3d(" + (Math.sin(t * 0.4 + d * 3) * 6).toFixed(2) + "px," + (Math.cos(t * 0.34 + d * 3) * 7).toFixed(2) + "px,0)";
      });
    })(t0);
  }

  window.UI = {
    hash: hash, clamp: clamp, lerp: lerp, fmt: fmt, esc: esc, hslRgb: hslRgb,
    data: defaultData, art: art, albumHue: albumHue, accentFor: accentFor,
    charts: charts, ringsSvg: ringsSvg, ringSvg: ringSvg, wfBars: wfBars,
    register: register, blocks: blocks, render: render, ctxFor: ctxFor,
    registerAnim: registerAnim, setPlaying: setPlaying, setNow: setNow, getPos: function () { return pos; }, getDur: function () { return dur; },
    SHAPES: SHAPES, depthObjects: depthObjects, applyDepthMasks: applyDepthMasks, bindDepth: bindDepth
  };
})();
