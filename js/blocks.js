/* UI Studio — block library. render(props, ctx) -> html ; mount(el, props, ctx) -> wire canvas/interactions */
(function () {
  "use strict";
  var UI = window.UI, R = UI.register, esc = UI.esc, fmt = UI.fmt;

  function csv(s) { return String(s == null ? "" : s).split(",").map(function (x) { return x.trim(); }).filter(Boolean); }
  function bindDraw(c, fn) {
    if (!c) return;
    var run = function () { try { fn(); } catch (e) { } };
    if (window.ResizeObserver) { new ResizeObserver(run).observe(c); }
    requestAnimationFrame(run);
  }
  function series(n, seed) { var a = []; for (var i = 0; i < n; i++) a.push(.3 + UI.hash(i * 1.9 + seed) * .6 + .12 * Math.sin(i * .6)); return a; }

  /* ---------------- structure ---------------- */
  R("page-header", {
    name: "Page header", group: "Structure", icon: "H",
    defaults: { eyebrow: "Now Playing", title: "Stay with the sound.", sub: "" },
    fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }],
    render: function (p, ctx) {
      return '<div><div class="u-eyebrow" data-edit="eyebrow">' + esc(p.eyebrow) + '</div><h1 class="u-h1" data-edit="title">' + esc(p.title) + '</h1>' + (p.sub ? '<div class="u-sub" data-edit="sub">' + esc(p.sub) + '</div>' : "") + '</div>';
    }
  });

  R("section-head", {
    name: "Section heading", group: "Structure", icon: "§",
    defaults: { title: "Recently added", sub: "Fresh arrivals in your library", right: "4 albums" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "right", label: "Right label", type: "text" }],
    render: function (p) {
      return '<div class="u-cardhead"><div><h2 class="u-h2" data-edit="title">' + esc(p.title) + '</h2>' + (p.sub ? '<div class="u-sub" data-edit="sub">' + esc(p.sub) + '</div>' : "") + '</div>' + (p.right ? '<div class="u-sub" data-edit="right">' + esc(p.right) + '</div>' : "") + '</div>';
    }
  });

  R("text-block", {
    name: "Text", group: "Structure", icon: "T",
    defaults: { title: "Heading", body: "A paragraph of explanatory copy." },
    fields: [{ key: "title", label: "Heading", type: "text" }, { key: "body", label: "Body", type: "textarea" }],
    render: function (p) { return '<div class="u-card"><h2 class="u-h2">' + esc(p.title) + '</h2><p style="color:var(--muted);line-height:1.6;margin:10px 0 0">' + esc(p.body) + '</p></div>'; }
  });

  /* ---------------- player ---------------- */
  R("hero", {
    name: "Hero / Now Playing", group: "Player", icon: "★",
    defaults: { title: "Red Thread", artist: "Mira Vale", album: "Forms of Silence · 2026", seed: 3, source: "Forms of Silence", badges: "FLAC, 24-bit, 96 kHz, Lossless", wave: true, spec: true, heart: true, height: 440, depth: false, shape: "orb", count: 2 },
    fields: [
      { key: "title", label: "Title", type: "text" }, { key: "artist", label: "Artist", type: "text" },
      { key: "album", label: "Album", type: "text" }, { key: "source", label: "Playing-from label", type: "text" },
      { key: "badges", label: "Badges (csv)", type: "text" }, { key: "seed", label: "Art seed", type: "number" },
      { key: "height", label: "Height (px)", type: "number" }, { key: "wave", label: "Waveform", type: "check" },
      { key: "spec", label: "Spectrum", type: "check" }, { key: "heart", label: "Heart", type: "check" },
      { key: "depth", label: "Depth occlusion", type: "check" }, { key: "shape", label: "Object shape", type: "select", options: ["orb", "blob", "slab", "star", "diamond", "vinyl", "ring", "mixed"] }, { key: "count", label: "Objects", type: "number" }
    ],
    render: function (p, ctx) {
      var acc = ctx.accentFor(p.seed);
      var badges = csv(p.badges).map(function (b) { return '<span class="u-badge' + (/lossless|flac|24/i.test(b) ? " acc" : "") + '">' + esc(b) + '</span>'; }).join("");
      var depth = p.depth ? UI.depthObjects(ctx.art(p.seed), { shape: p.shape, count: p.count }) : "";
      return '<div class="u-hero" style="min-height:' + p.height + 'px"><div class="u-hero-art" style="background-image:' + ctx.art(p.seed) + '"></div><div class="u-hero-scrim"></div>' +
        '<div class="u-hero-body" style="min-height:' + p.height + 'px">' +
        '<div class="u-hero-now"><span class="u-wf">' + ctx.wfBars(9, acc) + '</span> Playing from ' + esc(p.source) + '</div>' +
        '<h2 class="u-hero-title" data-edit="title">' + esc(p.title) + '</h2><div class="u-hero-artist" data-edit="artist">' + esc(p.artist) + '</div>' +
        '<div class="u-hero-badges">' + badges + '</div>' +
        '<div class="u-progress"><div class="u-bar"><i data-fill style="width:3%"></i><span class="u-knob" data-knob style="left:3%"></span></div>' +
        '<div class="u-times"><span data-cur>0:08</span><span>' + fmt(ctx.data.now.duration) + '</span></div></div>' +
        '</div>' + (p.heart ? '<button class="u-heart"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9A5.4 5.4 0 0112 5.5 5.4 5.4 0 0121.5 12c-2 4.4-9.5 9-9.5 9z"/></svg></button>' : "") +
        (p.wave ? '<canvas class="u-chart" data-hero-wave style="position:absolute;left:0;right:0;bottom:0;height:70px;opacity:.5"></canvas>' : "") +
        (p.spec ? '<canvas class="u-chart" data-hero-spec style="position:absolute;left:0;right:0;bottom:0;height:90px;opacity:.35;mix-blend-mode:screen"></canvas>' : "") +
        depth + '</div>';
    },
    mount: function (el, p, ctx) {
      var acc = ctx.accentFor(p.seed);
      var wave = el.querySelector("[data-hero-wave]"), spec = el.querySelector("[data-hero-spec]");
      if (wave) ctx.registerAnim(wave, "wave", { seed: p.seed, acc: acc });
      if (spec) ctx.registerAnim(spec, "spectrum", { acc: acc });
      UI.applyDepthMasks(el); UI.bindDepth(el);
      var fill = el.querySelector("[data-fill]"), knob = el.querySelector("[data-knob]"), cur = el.querySelector("[data-cur]");
      var pos = 8000, dur = ctx.data.now.duration, t0 = performance.now();
      function step(ts) {
        if (!el.isConnected) return; requestAnimationFrame(step);
        pos += (ts - (step._p || ts)) * 16; step._p = ts; if (pos > dur) pos = 0;
        var pc = pos / dur * 100; if (fill) fill.style.width = pc + "%"; if (knob) knob.style.left = pc + "%"; if (cur) cur.textContent = fmt(pos);
      }
      requestAnimationFrame(step);
    }
  });

  R("up-next", {
    name: "Up next panel", group: "Player", icon: "≡",
    defaults: { title: "Up next", sub: "A quiet sequence · 13 min", count: 3, signal: true },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "count", label: "Rows", type: "number" }, { key: "signal", label: "Signal tiles", type: "check" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(1, 1 + (p.count || 3)).map(function (t) {
        return '<div class="u-unrow"><div class="u-art" style="background-image:' + ctx.art(t.seed) + '"></div><div class="u-meta"><b>' + esc(t.title) + '</b><i>' + esc(t.artist) + '</i></div><span class="u-dur">' + fmt(t.duration * 1000) + '</span></div>';
      }).join("");
      return '<div class="u-panel"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;color:var(--accent)"><path d="M4 6h11M4 12h11M4 18h7"/><path d="M17 15l4 3-4 3z" fill="currentColor" stroke="none"/></svg></div>' +
        '<div class="u-sub">' + esc(p.sub) + '</div><div style="margin-top:18px">' + rows + '</div>' +
        (p.signal ? '<div class="u-divider"></div><div class="u-label" style="margin-bottom:14px">Signal</div><div class="u-tiles"><div class="u-tile"><b>Lossless</b><span>24-bit / 96 kHz</span></div><div class="u-tile"><b>Stereo</b><span>2 channels</span></div></div>' : "") + '</div>';
    }
  });

  R("signal-tiles", {
    name: "Signal tiles", group: "Player", icon: "▦",
    defaults: { a: "Lossless", av: "24-bit / 96 kHz", b: "Stereo", bv: "2 channels" },
    fields: [{ key: "a", label: "Tile A", type: "text" }, { key: "av", label: "A value", type: "text" }, { key: "b", label: "Tile B", type: "text" }, { key: "bv", label: "B value", type: "text" }],
    render: function (p) { return '<div class="u-tiles"><div class="u-tile"><b>' + esc(p.a) + '</b><span>' + esc(p.av) + '</span></div><div class="u-tile"><b>' + esc(p.b) + '</b><span>' + esc(p.bv) + '</span></div></div>'; }
  });

  R("now-playing", {
    name: "Now playing (immersive)", group: "Player", icon: "◉",
    defaults: { title: "Red Thread", artist: "Mira Vale", album: "Forms of Silence · 2026", seed: 3, lyrics: "left", depth: true, shape: "orb", count: 2 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "artist", label: "Artist", type: "text" }, { key: "album", label: "Album", type: "text" }, { key: "seed", label: "Art seed", type: "number" }, { key: "lyrics", label: "Lyrics pos", type: "select", options: ["left", "center", "right", "off"] },
      { key: "depth", label: "Depth occlusion", type: "check" }, { key: "shape", label: "Object shape", type: "select", options: ["orb", "blob", "slab", "star", "diamond", "vinyl", "ring", "mixed"] }, { key: "count", label: "Objects", type: "number" }],
    render: function (p, ctx) {
      var lines = ["I'm weightless", "drifting through the static", "every note a breath", "nothing here is heavy", "let the signal carry me"];
      var ly = p.lyrics !== "off" ? '<div class="u-np-lyrics" style="' + (p.lyrics === "center" ? "left:50%;transform:translateX(-50%);text-align:center;align-items:center;" : p.lyrics === "right" ? "left:auto;right:40px;text-align:right;align-items:flex-end;" : "") + '">' + lines.map(function (l, i) { return '<div class="u-line' + (i === 3 ? " cur" : "") + '">' + esc(l) + '</div>'; }).join("") + '</div>' : "";
      var depth = p.depth ? UI.depthObjects(ctx.art(p.seed), { shape: p.shape, count: p.count }) : "";
      return '<div class="u-np"><div class="u-np-art" style="background-image:' + ctx.art(p.seed) + '"></div><div class="u-np-scrim"></div>' + ly +
        '<canvas class="u-chart" data-np-spec style="position:absolute;left:0;right:0;bottom:0;height:120px;opacity:.5;mix-blend-mode:screen"></canvas>' +
        '<div class="u-np-body"><h2 class="u-hero-title">' + esc(p.title) + '</h2><div class="u-hero-artist">' + esc(p.artist) + '</div><div class="u-sub" style="color:rgb(255 255 255/.5)">' + esc(p.album) + '</div>' +
        '<div class="u-progress" style="max-width:900px"><div class="u-bar"><i style="width:32%"></i><span class="u-knob" style="left:32%"></span></div><div class="u-times"><span>1:22</span><span>' + fmt(ctx.data.now.duration) + '</span></div></div></div>' + depth + '</div>';
    },
    mount: function (el, p, ctx) { var s = el.querySelector("[data-np-spec]"); if (s) ctx.registerAnim(s, "spectrum", { acc: ctx.accentFor(p.seed) }); UI.applyDepthMasks(el); UI.bindDepth(el); }
  });

  /* ---------------- data ---------------- */
  R("stat-cards", {
    name: "Stat cards", group: "Data", icon: "▮",
    defaults: { aLabel: "Listened this month", bLabel: "Tracks played", cLabel: "Albums in rotation" },
    fields: [{ key: "aLabel", label: "Card 1 label", type: "text" }, { key: "bLabel", label: "Card 2 label", type: "text" }, { key: "cLabel", label: "Card 3 label", type: "text" }],
    render: function (p, ctx) {
      var s = ctx.data.stats, ic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
      function card(label, val, unit, sub) { return '<div class="u-stat"><div class="u-sic">' + ic + '</div><b>' + val + (unit ? '<small>' + unit + '</small>' : "") + '</b><div class="u-slabel">' + esc(label) + '</div>' + (sub ? '<div class="u-sdelta">' + esc(sub) + '</div>' : "") + '</div>'; }
      return '<div class="u-stats">' + card(p.aLabel, s.hours, "hrs", s.delta) + card(p.bLabel, s.tracks, "", s.discoveries) + card(p.cLabel, s.albums, "", "Across " + s.artists + " artists") + '</div>';
    }
  });

  R("bar-chart", {
    name: "Bar chart", group: "Data", icon: "▮▮",
    defaults: { title: "Listening rhythm", sub: "Hours across the last seven days", right: "9.2h peak", values: "2.4, 4.1, 3.2, 5.6, 4.4, 6.1, 4.9" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "right", label: "Right label", type: "text" }, { key: "values", label: "Values (csv)", type: "text" }],
    render: function (p) {
      return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div><div class="u-sub">' + esc(p.right) + '</div></div><canvas class="u-chart" data-bar style="height:200px"></canvas></div>';
    },
    mount: function (el, p, ctx) { var c = el.querySelector("[data-bar]"); bindDraw(c, function () { UI.charts.bars(c, csv(p.values).map(Number), ctx.accentFor(3)); }); }
  });

  R("line-chart", {
    name: "Line / gradient chart", group: "Data", icon: "∿",
    defaults: { title: "Plays over time", sub: "Last 28 days", artColour: true, points: 24 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "points", label: "Points", type: "number" }, { key: "artColour", label: "Art-coloured", type: "check" }],
    render: function (p) { return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div></div><canvas class="u-chart" data-line style="height:120px"></canvas></div>'; },
    mount: function (el, p, ctx) { var c = el.querySelector("[data-line]"); var seeds = ctx.data.tracks.map(function (t) { return t.seed; }); bindDraw(c, function () { UI.charts.line(c, series(p.points || 24, 2), p.artColour ? seeds : null, ctx.accentFor(3)); }); }
  });

  R("heatmap", {
    name: "Heatmap", group: "Data", icon: "▩",
    defaults: { title: "Listening activity", sub: "Hour × weekday", cols: 7, rows: 8, artColour: true },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "cols", label: "Columns", type: "number" }, { key: "rows", label: "Rows", type: "number" }, { key: "artColour", label: "Art-coloured", type: "check" }],
    render: function (p) { return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div></div><canvas class="u-heat" data-heat style="height:180px"></canvas></div>'; },
    mount: function (el, p, ctx) { var c = el.querySelector("[data-heat]"); bindDraw(c, function () { UI.charts.heat(c, { cols: p.cols, rows: p.rows, artColour: p.artColour }, ctx.accentFor(3)); }); }
  });

  R("radial-rings", {
    name: "Radial ring chart", group: "Data", icon: "◎",
    defaults: { title: "Library Pulse" },
    fields: [{ key: "title", label: "Title", type: "text" }],
    render: function (p, ctx) {
      var metrics = [{ name: "Tracks", value: 1204, max: 1500 }, { name: "Albums", value: 96, max: 140 }, { name: "Artists", value: 43, max: 80 }, { name: "Hours", value: 128, max: 200 }];
      var acc = ctx.accentFor(3);
      var legend = metrics.map(function (m, i) { var col = "hsl(" + ((acc.h + i * 40) % 360) + " 72% 62%)"; return '<div class="u-ri"><span class="u-sw" style="background:' + col + '"></span>' + m.name + '<span class="u-rv">' + m.value.toLocaleString() + '</span></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-rings">' + ctx.ringsSvg(metrics, acc, 190) + '<div class="u-rclegend">' + legend + '</div></div></div>';
    }
  });

  R("genre-mix", {
    name: "Genre mix", group: "Data", icon: "≡",
    defaults: { title: "Genre mix", sub: "Your most played sounds" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }],
    render: function (p, ctx) {
      var total = ctx.data.moods.reduce(function (a, m) { return a + m.albums; }, 0);
      var rows = ctx.data.moods.map(function (m) { var pct = Math.round(m.albums / total * 100); return '<div class="u-bc"><span class="u-name">' + esc(m.name) + '</span><div class="u-track"><i style="width:' + pct + '%;background:hsl(' + m.hue + ' 70% 58%)"></i></div><span class="u-val">' + pct + '%</span></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div></div><div class="u-barchart">' + rows + '</div></div>';
    }
  });

  R("track-list", {
    name: "Track list", group: "Data", icon: "☰",
    defaults: { title: "For this hour", sub: "Selections shaped by your library", count: 6, numbered: true, plays: false },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "count", label: "Rows", type: "number" }, { key: "numbered", label: "Numbered", type: "check" }, { key: "plays", label: "Show plays", type: "check" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(0, p.count || 6).map(function (t, i) {
        return '<div class="u-row">' + (p.numbered ? '<span class="u-idx">' + String(i + 1).padStart(2, "0") + '</span>' : "") + '<div class="u-art" style="background-image:' + ctx.art(t.seed) + '"></div>' +
          '<div class="u-meta"><b>' + esc(t.title) + '</b><i>' + esc(t.artist) + ' · ' + esc(t.album) + '</i></div>' + (p.plays ? '<span class="u-plays">' + t.plays + ' plays</span>' : '<span class="u-dur">' + fmt(t.duration * 1000) + '</span>') + '</div>';
      }).join("");
      return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2>' + (p.sub ? '<div class="u-sub">' + esc(p.sub) + '</div>' : "") + '</div></div><div class="u-list">' + rows + '</div></div>';
    }
  });

  R("album-grid", {
    name: "Album grid", group: "Data", icon: "▦",
    defaults: { title: "Recently added", sub: "Fresh arrivals in your library", count: 4 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "count", label: "Albums", type: "number" }],
    render: function (p, ctx) {
      var cards = ctx.data.albums.slice(0, p.count || 4).map(function (a) { return '<div class="u-album"><div class="u-cover" style="background-image:' + ctx.art(a.seed) + '"></div><b>' + esc(a.title) + '</b><span>' + esc(a.artist) + ' · ' + a.year + '</span></div>'; }).join("");
      return '<div><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2>' + (p.sub ? '<div class="u-sub">' + esc(p.sub) + '</div>' : "") + '</div></div><div class="u-albums">' + cards + '</div></div>';
    }
  });

  R("mood-cards", {
    name: "Mood cards", group: "Data", icon: "◍",
    defaults: { title: "Explore moods", sub: "Selections shaped by your library" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }],
    render: function (p, ctx) {
      var cards = ctx.data.moods.map(function (m) { return '<div class="u-mood"><span class="u-dot" style="background:hsl(' + m.hue + ' 70% 55%)"></span><b>' + esc(m.name) + '</b><span>' + m.albums + ' albums</span></div>'; }).join("");
      return '<div><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2>' + (p.sub ? '<div class="u-sub">' + esc(p.sub) + '</div>' : "") + '</div></div><div class="u-moods">' + cards + '</div></div>';
    }
  });

  /* ---------------- signal ---------------- */
  R("spectrum", {
    name: "Spectrum visualizer", group: "Signal", icon: "▮▮▮",
    defaults: { height: 140 },
    fields: [{ key: "height", label: "Height (px)", type: "number" }],
    render: function () { return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">Spectrum</h2></div><canvas class="u-chart" data-spec style="height:140px"></canvas></div>'; },
    mount: function (el, p, ctx) { var c = el.querySelector("[data-spec]"); c.style.height = (p.height || 140) + "px"; ctx.registerAnim(c, "spectrum", { acc: ctx.accentFor(3) }); }
  });

  R("waveform", {
    name: "Waveform scrub", group: "Signal", icon: "∿",
    defaults: { height: 90, seed: 4 },
    fields: [{ key: "height", label: "Height (px)", type: "number" }, { key: "seed", label: "Seed", type: "number" }],
    render: function () { return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">Waveform</h2></div><canvas class="u-chart" data-wf style="height:90px"></canvas></div>'; },
    mount: function (el, p, ctx) { var c = el.querySelector("[data-wf]"); c.style.height = (p.height || 90) + "px"; ctx.registerAnim(c, "wave", { seed: p.seed, acc: ctx.accentFor(p.seed) }); }
  });

  R("vumeters", {
    name: "VU meters (L/R)", group: "Signal", icon: "▥",
    defaults: { title: "Levels" },
    fields: [{ key: "title", label: "Title", type: "text" }],
    render: function () { return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">Levels</h2></div><div class="u-vus"><div class="u-vu"><span>L</span><div class="u-meter"><i data-vl style="width:0%"></i></div></div><div class="u-vu"><span>R</span><div class="u-meter"><i data-vr style="width:0%"></i></div></div></div></div>'; },
    mount: function (el, p, ctx) { var l = el.querySelector("[data-vl]"), r = el.querySelector("[data-vr]");
      ctx.registerAnim(el, "vu", { acc: ctx.accentFor(3), onDraw: function (v) { if (l) l.style.width = UI.clamp(v * 1.25, 0, 1) * 100 + "%"; if (r) r.style.width = UI.clamp(v * 1.1, 0, 1) * 100 + "%"; } }); }
  });

  R("knobs", {
    name: "Knobs", group: "Signal", icon: "◌",
    defaults: { labels: "Volume, Concert Hall, Reverb, Stereo width", on: "1,1,0,1", values: "72,70,35,90" },
    fields: [{ key: "labels", label: "Labels (csv)", type: "text" }, { key: "on", label: "On (csv 0/1)", type: "text" }, { key: "values", label: "Values (csv)", type: "text" }],
    render: function (p) {
      var labels = csv(p.labels), on = csv(p.on).map(Number), vals = csv(p.values).map(Number);
      var knobs = labels.map(function (l, i) { var rot = -135 + (vals[i] || 0) / 100 * 270; return '<div style="text-align:center"><div class="u-knob' + (on[i] ? "" : " off") + '" data-knob style="--rot:' + rot + 'deg"></div><div style="font-size:10px;color:var(--muted);margin-top:6px">' + esc(l) + '</div></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">Signal trim</h2><div class="u-sub">click = on/off · scroll = value</div></div><div class="u-knobs">' + knobs + '</div></div>';
    },
    mount: function (el, p, ctx) {
      el.querySelectorAll("[data-knob]").forEach(function (k) {
        var v = parseFloat(k.style.getPropertyValue("--rot")) || 0; var on = !k.classList.contains("off");
        function paint() { k.style.setProperty("--rot", v + "deg"); k.classList.toggle("off", !on); }
        k.addEventListener("click", function () { on = !on; paint(); });
        k.addEventListener("wheel", function (e) { e.preventDefault(); on = true; v = UI.clamp(v + (e.deltaY < 0 ? 9 : -9), -135, 135); paint(); }, { passive: false });
      });
    }
  });

  R("processing-chain", {
    name: "Processing chain", group: "Signal", icon: "⇉",
    defaults: { stages: "Decode, ReplayGain, Concert Hall, Mono downmix, Resample 96k, Output", on: "1,0,1,0,1,1" },
    fields: [{ key: "stages", label: "Stages (csv)", type: "text" }, { key: "on", label: "Active (csv 0/1)", type: "text" }],
    render: function (p) {
      var st = csv(p.stages), on = csv(p.on).map(Number);
      var rows = st.map(function (s, i) { return '<div class="u-stage' + (on[i] ? " on" : "") + '"><span class="u-sdot"></span><span class="u-sname">' + esc(s) + '</span><span class="u-sstate">' + (on[i] ? "active" : "bypass") + '</span></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">Processing chain</h2></div><div class="u-chain">' + rows + '</div></div>';
    }
  });

  /* ---------------- extended blocks ---------------- */
  R("search-header", {
    name: "Search header", group: "Structure", icon: "⌕",
    defaults: { eyebrow: "Browse", title: "Find your next repeat.", placeholder: "Search music" },
    fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "title", label: "Title", type: "text" }, { key: "placeholder", label: "Search placeholder", type: "text" }],
    render: function (p) {
      return '<div class="u-searchhead"><div><div class="u-eyebrow" data-edit="eyebrow">' + esc(p.eyebrow) + '</div><h1 class="u-h1" data-edit="title">' + esc(p.title) + '</h1></div>' +
        '<div class="u-searchbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5" stroke-linecap="round"/></svg><input placeholder="' + esc(p.placeholder) + '" /></div></div>';
    }
  });

  R("album-hero", {
    name: "Album detail", group: "Data", icon: "▣",
    defaults: { title: "Forms of Silence", artist: "Mira Vale", year: 2026, seed: 3, count: 5, badge: "2026 · 9 tracks" },
    fields: [{ key: "title", label: "Album", type: "text" }, { key: "artist", label: "Artist", type: "text" }, { key: "year", label: "Year", type: "number" }, { key: "seed", label: "Art seed", type: "number" }, { key: "count", label: "Tracks shown", type: "number" }, { key: "badge", label: "Badge", type: "text" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(0, p.count || 5).map(function (t, i) {
        return '<div class="u-row"><span class="u-idx">' + String(i + 1).padStart(2, "0") + '</span><div class="u-meta"><b>' + esc(t.title) + '</b><i>' + esc(t.artist) + '</i></div><span class="u-dur">' + fmt(t.duration * 1000) + '</span></div>';
      }).join("");
      return '<div class="u-card"><div class="u-albumhero"><div class="u-ahcover" style="background-image:' + ctx.art(p.seed) + '"></div>' +
        '<div class="u-ahbody"><div class="u-eyebrow">Album</div><div class="u-ahtitle">' + esc(p.title) + '</div>' +
        '<div class="u-sub">' + esc(p.artist) + ' · ' + p.year + '</div><div class="u-sub" style="margin-top:6px">' + esc(p.badge) + '</div>' +
        '<div class="u-playrow"><button class="u-playbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button><button class="u-ghostbtn">Shuffle</button><button class="u-ghostbtn">＋ Library</button></div>' +
        '<div class="u-list" style="margin-top:14px">' + rows + '</div></div></div></div>';
    }
  });

  R("session-heatmap", {
    name: "Session heatmap", group: "Data", icon: "▦",
    defaults: { title: "Session heatmap", sub: "Every cell is a track · brighter = smart-shuffle weight", cols: 12, rows: 2 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "cols", label: "Columns", type: "number" }, { key: "rows", label: "Rows", type: "number" }],
    render: function (p, ctx) {
      var total = (p.cols || 12) * (p.rows || 2), cells = "";
      for (var i = 0; i < total; i++) {
        var t = ctx.data.tracks[i % ctx.data.tracks.length], w = .2 + UI.hash(t.seed * 1.7 + i) * .8;
        cells += '<div class="u-artcell" title="' + esc(t.title) + '"><i style="background-image:' + ctx.art(t.seed) + ';opacity:' + (.35 + w * .65).toFixed(2) + '"></i><b>' + Math.round(w * 100) + '</b></div>';
      }
      return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div></div><div class="u-arthm">' + cells + '</div></div>';
    }
  });

  R("sparkline-stats", {
    name: "Sparkline stats", group: "Data", icon: "∿",
    defaults: { a: "Tracks", av: "1,204", b: "Albums", bv: "96", c: "Artists", cv: "43", d: "Hours", dv: "128" },
    fields: [{ key: "a", label: "1 label", type: "text" }, { key: "av", label: "1 value", type: "text" }, { key: "b", label: "2 label", type: "text" }, { key: "bv", label: "2 value", type: "text" }, { key: "c", label: "3 label", type: "text" }, { key: "cv", label: "3 value", type: "text" }, { key: "d", label: "4 label", type: "text" }, { key: "dv", label: "4 value", type: "text" }],
    render: function (p, ctx) {
      var acc = ctx.accentFor(3);
      function spark(seed) {
        var pts = [], n = 8; for (var i = 0; i < n; i++) pts.push([i / (n - 1) * 84, 24 - (.2 + UI.hash(seed * 3 + i * 7) * .75) * 22 - 2]);
        var d = pts.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" ");
        return '<svg class="u-spark" viewBox="0 0 84 26" preserveAspectRatio="none"><path d="' + d + '" fill="none" stroke="' + acc.css + '" stroke-width="1.6" stroke-linecap="round"/><path d="' + d + ' L84 26 L0 26 Z" fill="' + acc.css + '" opacity=".14"/></svg>';
      }
      function card(label, val, seed) { return '<div class="u-stat" style="position:relative"><b>' + esc(val) + '</b><div class="u-slabel">' + esc(label) + '</div>' + spark(seed) + '</div>'; }
      return '<div class="u-stats" style="grid-template-columns:repeat(4,1fr)">' + card(p.a, p.av, 6) + card(p.b, p.bv, 9) + card(p.c, p.cv, 5) + card(p.d, p.dv, 12) + '</div>';
    }
  });

  R("settings-list", {
    name: "Settings list", group: "Structure", icon: "⚙",
    defaults: { title: "Playback", items: "Gapless, Crossfade, ReplayGain, Mono downmix, Smart shuffle", on: "1,0,1,0,1" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "items", label: "Rows (csv)", type: "text" }, { key: "on", label: "On (csv 0/1)", type: "text" }],
    render: function (p) {
      var items = csv(p.items), on = csv(p.on).map(Number);
      var rows = items.map(function (it, i) { return '<div class="u-setrow"><div class="u-sname"><b>' + esc(it) + '</b></div><div class="u-toggle' + (on[i] ? " on" : "") + '" data-toggle><i></i></div></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div>' + rows + '</div>';
    },
    mount: function (el) { el.querySelectorAll("[data-toggle]").forEach(function (t) { t.addEventListener("click", function () { t.classList.toggle("on"); }); }); }
  });

  R("mini-player", {
    name: "Mini player", group: "Player", icon: "▭",
    defaults: { title: "Red Thread", artist: "Mira Vale", seed: 3 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "artist", label: "Artist", type: "text" }, { key: "seed", label: "Art seed", type: "number" }],
    render: function (p, ctx) {
      return '<div class="u-mini"><div class="u-mthumb" style="background-image:' + ctx.art(p.seed) + '"></div><div class="u-mbody"><b>' + esc(p.title) + '</b><i>' + esc(p.artist) + '</i></div>' +
        '<div class="u-mprog"><i style="width:38%"></i></div><div class="u-mctl">' +
        '<button class="u-pbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5h2.4v13H7zM19 6v12l-8.5-6z"/></svg></button>' +
        '<button class="u-pbtn" style="color:var(--accent)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button>' +
        '<button class="u-pbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.6 5.5H17v13h-2.4zM5 6l8.5 6L5 18z"/></svg></button></div></div>';
    }
  });

  /* ---------------- component blocks ---------------- */
  R("tabs", {
    name: "Tabs", group: "Components", icon: "▤",
    defaults: { items: "Overview, Tracks, Artists, About", active: 0 },
    fields: [{ key: "items", label: "Tabs (csv)", type: "text" }, { key: "active", label: "Active index", type: "number" }],
    render: function (p) { return '<div class="u-tabs">' + csv(p.items).map(function (t, i) { return '<button class="u-tab' + (i === p.active ? " on" : "") + '" data-tab>' + esc(t) + '</button>'; }).join("") + '</div>'; },
    mount: function (el) { el.querySelectorAll("[data-tab]").forEach(function (b) { b.addEventListener("click", function () { el.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); }
  });

  R("toggle-group", {
    name: "Toggle group", group: "Components", icon: "▥",
    defaults: { items: "Week, Month, Year", active: 0 },
    fields: [{ key: "items", label: "Options (csv)", type: "text" }, { key: "active", label: "Active index", type: "number" }],
    render: function (p) { return '<div class="u-tg">' + csv(p.items).map(function (t, i) { return '<button class="' + (i === p.active ? "on" : "") + '" data-tg>' + esc(t) + '</button>'; }).join("") + '</div>'; },
    mount: function (el) { el.querySelectorAll("[data-tg]").forEach(function (b) { b.addEventListener("click", function () { el.querySelectorAll("[data-tg]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); }
  });

  R("callout", {
    name: "Callout", group: "Components", icon: "!",
    defaults: { title: "Depth engine active", body: "Per-track masks are computed on a background worker and cached locally." },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "body", label: "Body", type: "textarea" }],
    render: function (p) {
      return '<div class="u-callout"><div class="u-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg></div>' +
        '<div><b data-edit="title">' + esc(p.title) + '</b><p data-edit="body">' + esc(p.body) + '</p></div></div>';
    }
  });

  R("key-value", {
    name: "Key / value list", group: "Components", icon: ":",
    defaults: { title: "Signal", rows: "Codec:FLAC, Bit depth:24-bit, Sample rate:96 kHz, Channels:2, Bitrate:2304 kbps" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "rows", label: "Rows (k:v, ...)", type: "textarea" }],
    render: function (p) {
      var rows = String(p.rows || "").split(",").map(function (r) { var i = r.indexOf(":"); if (i < 0) return ""; return '<dt>' + esc(r.slice(0, i).trim()) + '</dt><dd>' + esc(r.slice(i + 1).trim()) + '</dd>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><dl class="u-kv">' + rows + '</dl></div>';
    }
  });

  R("timeline", {
    name: "Activity timeline", group: "Components", icon: "⋮",
    defaults: { title: "Recent activity", count: 5 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "count", label: "Rows", type: "number" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(0, p.count || 5).map(function (t) { return '<div class="u-tlrow"><span class="u-tldot"></span><div class="u-tlbody"><b>' + esc(t.title) + '</b><span>' + esc(t.artist) + ' · ' + esc(t.album) + '</span></div><span class="u-tltime">' + fmt(t.duration * 1000) + '</span></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-tl">' + rows + '</div></div>';
    }
  });

  R("data-table", {
    name: "Data table", group: "Data", icon: "▦",
    defaults: { title: "Top tracks", cols: "Track, Artist, Plays, Length", count: 6 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "cols", label: "Columns (csv)", type: "text" }, { key: "count", label: "Rows", type: "number" }],
    render: function (p, ctx) {
      var cols = csv(p.cols);
      var head = cols.map(function (c, i) { return '<th' + (i >= 2 ? ' class="num"' : "") + '>' + esc(c) + '</th>'; }).join("");
      var body = ctx.data.tracks.slice(0, p.count || 6).map(function (t) {
        var cells = [t.title, t.artist, t.plays, fmt(t.duration * 1000)];
        return '<tr>' + cells.map(function (v, i) { return '<td' + (i >= 2 ? ' class="num"' : "") + '>' + esc(v) + '</td>'; }).join("") + '</tr>';
      }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><table class="u-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
    }
  });

  R("chip-row", {
    name: "Chip row", group: "Components", icon: "⬭",
    defaults: { items: "Ambient, Electronic, Dream pop, Instrumental, Drone", active: 0 },
    fields: [{ key: "items", label: "Chips (csv)", type: "text" }, { key: "active", label: "Active index", type: "number" }],
    render: function (p) { return '<div class="u-chips">' + csv(p.items).map(function (t, i) { return '<span class="u-chip' + (i === p.active ? " on" : "") + '">' + esc(t) + '</span>'; }).join("") + '</div>'; }
  });

  R("avatar-row", {
    name: "Avatar row", group: "Components", icon: "●",
    defaults: { title: "Top listeners", count: 6 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "count", label: "Count", type: "number" }],
    render: function (p, ctx) {
      var av = ""; for (var i = 0; i < (p.count || 6); i++) av += '<span class="u-av" style="background-image:' + ctx.art(ctx.data.tracks[i % ctx.data.tracks.length].seed) + '"></span>';
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-avatars">' + av + '</div></div>';
    }
  });

  R("progress-ring-card", {
    name: "Progress ring card", group: "Data", icon: "◍",
    defaults: { label: "Monthly goal", value: "72", sub: "of 40 hours", progress: 72 },
    fields: [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Big value", type: "text" }, { key: "sub", label: "Sub", type: "text" }, { key: "progress", label: "Progress %", type: "number" }],
    render: function (p, ctx) { var acc = ctx.accentFor(3);
      return '<div class="u-card"><div class="u-ringstat">' + ctx.ringSvg((p.progress || 0) / 100, acc, 8, 120) + '<div class="u-rsval"><b>' + esc(p.value) + '</b><span>' + esc(p.label) + ' · ' + esc(p.sub) + '</span></div></div></div>';
    }
  });

  R("lyrics-panel", {
    name: "Lyrics panel", group: "Player", icon: "♪",
    defaults: { title: "Lyrics", current: 2 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "current", label: "Current line", type: "number" }],
    render: function (p) {
      var lines = ["I'm weightless", "drifting through the static", "every note a breath", "nothing here is heavy", "let the signal carry me", "and the world goes quiet"];
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-lyrics">' + lines.map(function (l, i) { return '<div class="u-line' + (i === p.current ? " cur" : "") + '">' + esc(l) + '</div>'; }).join("") + '</div></div>';
    }
  });

  R("notification-list", {
    name: "Notifications", group: "Components", icon: "◔",
    defaults: { title: "Activity", items: "Library scan complete, New album added, Depth model updated", times: "just now, 2m, 1h" },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "items", label: "Items (csv)", type: "text" }, { key: "times", label: "Times (csv)", type: "text" }],
    render: function (p) {
      var it = csv(p.items), tm = csv(p.times);
      var rows = it.map(function (t, i) { return '<div class="u-notif"><span class="u-ndot"></span><div><b>' + esc(t) + '</b><span>System</span></div><time>' + esc(tm[i] || "") + '</time></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div style="display:flex;flex-direction:column;gap:10px">' + rows + '</div></div>';
    }
  });

  R("equalizer", {
    name: "Equalizer bars", group: "Signal", icon: "▮",
    defaults: { title: "Equalizer", bars: 24 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "bars", label: "Bars", type: "number" }],
    render: function (p, ctx) { var acc = ctx.accentFor(3), n = p.bars || 24, bars = "";
      for (var i = 0; i < n; i++) { var h = 20 + UI.hash(i * 1.7) * 70; bars += '<i style="height:' + h.toFixed(0) + '%;animation-delay:' + (-(i % 7) * .18) + 's"></i>'; }
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-eqbars">' + bars + '</div></div>';
    }
  });

  R("quote", {
    name: "Quote", group: "Structure", icon: "❝",
    defaults: { text: "Music is the space between the notes.", cite: "Claude Debussy" },
    fields: [{ key: "text", label: "Quote", type: "textarea" }, { key: "cite", label: "Attribution", type: "text" }],
    render: function (p) { return '<div class="u-card"><blockquote class="u-quote" data-edit="text">“' + esc(p.text) + '”<cite data-edit="cite">— ' + esc(p.cite) + '</cite></blockquote></div>'; }
  });

  R("media-list", {
    name: "Media list", group: "Components", icon: "▤",
    defaults: { title: "Continue listening", count: 4 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "count", label: "Rows", type: "number" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(0, p.count || 4).map(function (t) { return '<div class="u-media"><div class="u-mthumb" style="background-image:' + ctx.art(t.seed) + '"></div><div class="u-mbody"><b>' + esc(t.title) + '</b><i>' + esc(t.artist) + '</i></div><div class="u-mactions"><button class="u-pbtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button></div></div>'; }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div style="display:flex;flex-direction:column;gap:10px">' + rows + '</div></div>';
    }
  });

  R("divider", {
    name: "Divider", group: "Structure", icon: "—",
    defaults: { space: 0 },
    fields: [{ key: "space", label: "Space (px)", type: "number" }],
    render: function (p) { return '<div style="padding:' + (p.space || 0) + 'px 0"><hr class="u-hr" /></div>'; }
  });

  R("spacer", {
    name: "Spacer", group: "Structure", icon: "␣",
    defaults: { height: 48 },
    fields: [{ key: "height", label: "Height (px)", type: "number" }],
    render: function (p) { return '<div style="height:' + (p.height || 48) + 'px"></div>'; }
  });

  /* ---------------- wild mashup blocks ---------------- */
  function ticksSvgHtml(n, size) {
    var out = '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '">';
    for (var i = 0; i < n; i++) {
      var a = i / n * 360 - 90, r1 = 38, r2 = 47;
      var x1 = 50 + r1 * Math.cos(a * Math.PI / 180), y1 = 50 + r1 * Math.sin(a * Math.PI / 180);
      var x2 = 50 + r2 * Math.cos(a * Math.PI / 180), y2 = 50 + r2 * Math.sin(a * Math.PI / 180);
      out += '<line class="u-tk" data-i="' + i + '" x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '" stroke-width="1.7"/>';
    }
    return out + '</svg>';
  }
  function paintTicks(el, percent, n) {
    var on = Math.round(percent / 100 * n), lines = el.querySelectorAll(".u-tk");
    for (var i = 0; i < lines.length; i++) {
      var isOn = i < on;
      lines[i].classList.toggle("on", isOn);
      lines[i].classList.toggle("hot", isOn && i >= on - 6);
    }
  }

  R("radial-ticks", {
    name: "Radial ticks (processing)", group: "Signal", icon: "◍",
    defaults: { percent: 20, label: "processing", sub: "Our AI is processing data", ticks: 60, size: 220 },
    fields: [{ key: "percent", label: "Percent", type: "number" }, { key: "label", label: "Label", type: "text" }, { key: "sub", label: "Sub", type: "text" }, { key: "ticks", label: "Ticks", type: "number" }, { key: "size", label: "Size (px)", type: "number" }],
    render: function (p) {
      var n = p.ticks || 60, s = p.size || 220;
      return '<div class="u-card" style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center">' +
        '<div class="u-ticks" data-ticks style="width:' + s + 'px;height:' + s + 'px">' + ticksSvgHtml(n, s) +
        '<div class="u-tkcore"><div class="u-tkpct" data-pct>' + (p.percent || 0) + '%</div><div class="u-tklbl">' + esc(p.label) + '</div></div></div>' +
        '<div style="font-size:14px;font-weight:600">' + esc(p.sub) + '</div></div>';
    },
    mount: function (el, p) { paintTicks(el.querySelector("[data-ticks]"), p.percent || 0, p.ticks || 60); }
  });

  R("progress-dock", {
    name: "Progress dock (waveform unlock)", group: "Player", icon: "◉",
    defaults: { ticks: 56, bars: 48, size: 120, note: "waveform unlocks as playback advances" },
    fields: [{ key: "ticks", label: "Ticks", type: "number" }, { key: "bars", label: "Waveform bars", type: "number" }, { key: "size", label: "Gauge size", type: "number" }, { key: "note", label: "Note", type: "text" }],
    render: function (p, ctx) {
      var n = p.ticks || 56, bars = p.bars || 48, s = p.size || 120, bh = "";
      for (var i = 0; i < bars; i++) { var h = 18 + UI.hash(i * 1.9 + 3) * 78; bh += '<i data-b="' + i + '" style="height:' + h.toFixed(0) + '%"></i>'; }
      return '<div class="u-dock"><div class="u-ticks u-dticks" data-ticks style="width:' + s + 'px;height:' + s + 'px">' + ticksSvgHtml(n, s) +
        '<div class="u-tkcore"><div class="u-tkpct" data-pct style="font-size:28px">0%</div></div></div>' +
        '<div class="u-dwave"><div class="u-dunlock" data-bars>' + bh + '</div><div class="u-dmeta"><span data-el>0:00</span><span>' + esc(p.note) + '</span><span data-dur>' + fmt(ctx.data.now.duration) + '</span></div></div>' +
        '<div class="u-dinfo"><b data-state>Processing</b><span>unlock</span></div></div>';
    },
    mount: function (el, p) {
      var ticks = el.querySelector("[data-ticks]"), bars = el.querySelector("[data-bars]").children;
      var pctEl = el.querySelector("[data-pct]"), elEl = el.querySelector("[data-el]"), stEl = el.querySelector("[data-state]");
      var n = p.ticks || 56, nb = bars.length;
      (function loop() {
        if (!el.isConnected) return; requestAnimationFrame(loop);
        var pos = UI.getPos(), dur = UI.getDur(), pct = Math.max(0, Math.min(100, pos / dur * 100));
        paintTicks(ticks, pct, n);
        var on = Math.round(pct / 100 * nb);
        for (var i = 0; i < nb; i++) bars[i].classList.toggle("on", i < on);
        if (pctEl) pctEl.textContent = Math.round(pct) + "%";
        if (elEl) elEl.textContent = fmt(pos);
        if (stEl) stEl.textContent = pct >= 99.5 ? "Ready" : "Processing";
      })();
    }
  });

  R("candles", {
    name: "Candlestick chart", group: "Data", icon: "▮",
    defaults: { title: "Daily plays", sub: "Last 30 days", count: 30 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "sub", label: "Subtitle", type: "text" }, { key: "count", label: "Candles", type: "number" }],
    render: function (p) { return '<div class="u-card"><div class="u-cardhead"><div><h2 class="u-h2">' + esc(p.title) + '</h2><div class="u-sub">' + esc(p.sub) + '</div></div></div><canvas class="u-candles" data-candles style="height:190px"></canvas></div>'; },
    mount: function (el, p, ctx) {
      var c = el.querySelector("[data-candles]");
      bindDraw(c, function () {
        var dpr = Math.min(2, window.devicePixelRatio || 1), r = c.getBoundingClientRect();
        c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
        var x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, r.width, r.height);
        var n = p.count || 30, cw = r.width / n, series = [];
        for (var k = 0; k < n; k++) series.push(50 + Math.sin(k * 0.45 + 1) * 18 + (UI.hash(k * 2.3 + 1) - .5) * 14);
        for (var i = 0; i < n; i++) {
          var o = i ? series[i - 1] : series[0], cl = series[i];
          var hi = Math.max(o, cl) + UI.hash(i * 5.1) * 6, lo = Math.min(o, cl) - UI.hash(i * 3.7) * 6;
          var up = cl >= o, col = up ? "#2fbf71" : "#e05a5a";
          var cx = i * cw + cw / 2, sc = (r.height - 20) / 100;
          x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 1;
          x.beginPath(); x.moveTo(cx, 10 + (100 - hi) * sc); x.lineTo(cx, 10 + (100 - lo) * sc); x.stroke();
          var y1 = 10 + (100 - Math.max(o, cl)) * sc, h = Math.max(2, Math.abs(cl - o) * sc);
          x.fillRect(cx - cw * .3, y1, cw * .6, h);
        }
      });
    }
  });

  R("circular-gauge", {
    name: "Circular gauge", group: "Data", icon: "◎",
    defaults: { title: "Dynamics now", value: "34.2", unit: "%", sub: "Dynamics now", progress: 34 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "value", label: "Value", type: "text" }, { key: "unit", label: "Unit", type: "text" }, { key: "progress", label: "Progress %", type: "number" }],
    render: function (p, ctx) {
      var acc = ctx.accentFor(3), prog = Math.max(0, Math.min(1, (p.progress || 0) / 100)), c = 2 * Math.PI * 44;
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><div class="u-gauge">' +
        '<svg viewBox="0 0 100 100" width="150" height="150"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--well)" stroke-width="9"/>' +
        '<circle cx="50" cy="50" r="44" fill="none" stroke="' + acc.css + '" stroke-width="9" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - prog)).toFixed(1) + '" style="filter:drop-shadow(0 0 6px ' + acc.glow + ')"/>' +
        '<text x="50" y="47" text-anchor="middle" font-size="17" font-weight="800" fill="var(--text)">' + esc(p.value) + '</text>' +
        '<text x="50" y="60" text-anchor="middle" font-size="8" fill="var(--muted)">' + esc(p.unit) + '</text></svg>' +
        '<div class="u-gval"><b>' + esc(p.value) + esc(p.unit) + '</b><span>' + esc(p.sub) + '</span></div></div></div>';
    }
  });

  R("ribbons", {
    name: "HUD ribbons", group: "Signal", icon: "∿",
    defaults: { title: "Signal flow", height: 180, count: 5 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "height", label: "Height (px)", type: "number" }, { key: "count", label: "Ribbons", type: "number" }],
    render: function (p) { return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><canvas class="u-ribbons" data-rib style="height:' + (p.height || 180) + 'px"></canvas></div>'; },
    mount: function (el, p, ctx) {
      var c = el.querySelector("[data-rib]"), acc = ctx.accentFor(3), t0 = performance.now();
      (function loop(ts) {
        if (!el.isConnected) return; requestAnimationFrame(loop);
        var dpr = Math.min(2, window.devicePixelRatio || 1), r = c.getBoundingClientRect();
        c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
        var x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, r.width, r.height);
        var t = (ts - t0) / 1000, n = p.count || 5, h = r.height, w = r.width;
        for (var k = 0; k < n; k++) {
          var yy = h * (0.22 + k * 0.14), amp = 18 + k * 6, hue = (acc.h + k * 26) % 360;
          x.beginPath(); x.moveTo(-20, yy);
          x.bezierCurveTo(w * .3, yy + Math.sin(t * .8 + k) * amp, w * .7, yy - Math.sin(t * .7 + k) * amp, w + 20, yy);
          x.strokeStyle = "hsl(" + hue + " 85% 62% / .7)"; x.lineWidth = 2; x.shadowColor = "hsl(" + hue + " 85% 62% / .8)"; x.shadowBlur = 12; x.stroke();
        }
        x.shadowBlur = 0;
      })();
    }
  });

  R("node-net", {
    name: "Node network", group: "Signal", icon: "⁂",
    defaults: { title: "Connections", height: 200, nodes: 42 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "height", label: "Height (px)", type: "number" }, { key: "nodes", label: "Nodes", type: "number" }],
    render: function (p) { return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div><canvas class="u-nodes" data-net style="height:' + (p.height || 200) + 'px"></canvas></div>'; },
    mount: function (el, p, ctx) {
      var c = el.querySelector("[data-net]"), acc = ctx.accentFor(3), N = p.nodes || 42, t0 = performance.now();
      var pts = []; for (var i = 0; i < N; i++) pts.push({ x: UI.hash(i * 3.1), y: UI.hash(i * 7.7), vx: (UI.hash(i * 1.3) - .5) * .0006, vy: (UI.hash(i * 2.9) - .5) * .0006 });
      (function loop(ts) {
        if (!el.isConnected) return; requestAnimationFrame(loop);
        var dpr = Math.min(2, window.devicePixelRatio || 1), r = c.getBoundingClientRect();
        c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
        var x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, r.width, r.height);
        var w = r.width, h = r.height;
        pts.forEach(function (o) { o.x += o.vx; o.y += o.vy; if (o.x < 0 || o.x > 1) o.vx *= -1; if (o.y < 0 || o.y > 1) o.vy *= -1; });
        for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
          var dx = (pts[a].x - pts[b].x) * w, dy = (pts[a].y - pts[b].y) * h, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) { x.strokeStyle = "hsl(" + acc.h + " " + acc.s + "% 62% / " + (0.28 * (1 - d / 110)).toFixed(2) + ")"; x.lineWidth = 1; x.beginPath(); x.moveTo(pts[a].x * w, pts[a].y * h); x.lineTo(pts[b].x * w, pts[b].y * h); x.stroke(); }
        }
        pts.forEach(function (o) { x.fillStyle = "hsl(" + acc.h + " " + acc.s + "% 68% / .9)"; x.beginPath(); x.arc(o.x * w, o.y * h, 1.8, 0, 7); x.fill(); });
      })();
    }
  });

  R("arc-index", {
    name: "WOVE arc index", group: "Structure", icon: "◐",
    defaults: { active: 3, count: 5, title: "Ambient", sub: "already on and never turns off." },
    fields: [{ key: "active", label: "Active index", type: "number" }, { key: "count", label: "Count", type: "number" }, { key: "title", label: "Title", type: "text" }, { key: "sub", label: "Sub", type: "text" }],
    render: function (p) {
      var n = p.count || 5, nums = "";
      for (var i = 1; i <= n; i++) {
        var t = (i - 1) / (n - 1), ang = Math.PI * (0.92 - t * 0.92), rad = 42;
        var lx = 30 + Math.cos(ang) * rad, ly = 50 - Math.sin(ang) * rad;
        nums += '<span class="u-arcnum' + (i === p.active ? " on" : "") + '" style="left:' + lx.toFixed(1) + '%;top:' + ly.toFixed(1) + '%">' + String(i).padStart(2, "0") + '</span>';
      }
      return '<div class="u-card"><div class="u-arc"><div class="u-arcbig">' + String(p.active).padStart(2, "0") + '</div><div class="u-arcmeta"><b>' + esc(p.title) + '</b><span>' + esc(p.sub) + '</span></div><div class="u-arcnums">' + nums + '</div></div></div>';
    }
  });

  R("soft-controls", {
    name: "Soft controls", group: "Components", icon: "⬭",
    defaults: { input: "username@mail.com", btn: "Sign Up" },
    fields: [{ key: "input", label: "Input value", type: "text" }, { key: "btn", label: "Button", type: "text" }],
    render: function (p) { return '<div class="u-card"><div class="u-softrow"><div class="u-softinput">' + esc(p.input) + '</div><button class="u-softbtn primary">' + esc(p.btn) + '</button><div class="u-softtoggle on" data-stog><i></i></div><button class="u-softbtn">Share</button></div></div>'; },
    mount: function (el) { var t = el.querySelector("[data-stog]"); if (t) t.addEventListener("click", function () { t.classList.toggle("on"); }); }
  });

  R("tx-list", {
    name: "Transactions / rows", group: "Data", icon: "⇅",
    defaults: { title: "Transactions", count: 5 },
    fields: [{ key: "title", label: "Title", type: "text" }, { key: "count", label: "Rows", type: "number" }],
    render: function (p, ctx) {
      var rows = ctx.data.tracks.slice(0, p.count || 5).map(function (t, i) {
        var d = (UI.hash(t.seed) * 20 - 6), up = d >= 0;
        return '<div class="u-tx"><div class="u-txic">' + (up ? "▲" : "▼") + '</div><div class="u-txname"><b>' + esc(t.title) + '</b><span>' + esc(t.artist) + ' · ' + esc(t.album) + '</span></div>' +
          '<div class="u-txval"><b>' + t.plays + ' plays</b><span class="u-delta ' + (up ? "up" : "down") + '">' + (up ? "+" : "") + d.toFixed(1) + '%</span></div></div>';
      }).join("");
      return '<div class="u-card"><div class="u-cardhead"><h2 class="u-h2">' + esc(p.title) + '</h2></div>' + rows + '</div>';
    }
  });

  R("years", {
    name: "Year timeline", group: "Components", icon: "—",
    defaults: { items: "2019, 2020, 2021, 2022", active: 0 },
    fields: [{ key: "items", label: "Years (csv)", type: "text" }, { key: "active", label: "Active index", type: "number" }],
    render: function (p) { return '<div class="u-card"><div class="u-years">' + csv(p.items).map(function (y, i) { return '<div class="u-yr' + (i === p.active ? " on" : "") + '">' + esc(y) + '</div>'; }).join("") + '</div></div>'; }
  });

  window.UIBlockOrder = ["page-header", "search-header", "section-head", "text-block", "quote", "callout", "divider", "spacer", "arc-index", "hero", "up-next", "signal-tiles", "now-playing", "mini-player", "progress-dock", "lyrics-panel", "stat-cards", "sparkline-stats", "progress-ring-card", "circular-gauge", "album-hero", "bar-chart", "line-chart", "candles", "heatmap", "session-heatmap", "radial-rings", "genre-mix", "track-list", "data-table", "tx-list", "album-grid", "mood-cards", "media-list", "timeline", "notification-list", "key-value", "tabs", "toggle-group", "chip-row", "avatar-row", "years", "settings-list", "soft-controls", "spectrum", "waveform", "equalizer", "vumeters", "knobs", "processing-chain", "radial-ticks", "ribbons", "node-net"];
})();
