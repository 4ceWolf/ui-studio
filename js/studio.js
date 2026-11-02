/* UI Studio — editor logic (v2). */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var THEMES = window.UIThemes.presets;
  var LS_KEY = "ui-studio-v1", LS_PROJ = "ui-studio-projects", LS_THEMES = "ui-studio-themes", LS_COLLAPSE = "ui-studio-collapse";
  var uid = function () { return Math.random().toString(36).slice(2, 9); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  var FONTS = [
    { label: "Inter", value: '"Inter","SF Pro Display",system-ui,sans-serif' },
    { label: "Mono", value: '"JetBrains Mono","SFMono-Regular",ui-monospace,monospace' },
    { label: "Serif", value: '"Iowan Old Style","Palatino Linotype",Georgia,serif' },
    { label: "Rounded", value: '"Nunito","Quicksand",system-ui,sans-serif' },
    { label: "Condensed", value: '"Oswald","Arial Narrow",system-ui,sans-serif' }
  ];
  var ACCENT_PRESETS = [2, 22, 45, 90, 140, 176, 205, 232, 258, 300, 330];

  /* ---------------- storage ---------------- */
  function readLS(k, d) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch (e) { return d; } }
  function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function customThemes() { return readLS(LS_THEMES, {}); }
  function allThemes() { var t = {}; for (var k in THEMES) t[k] = THEMES[k]; var c = customThemes(); for (var j in c) t[j] = c[j]; return t; }

  /* ---------------- state ---------------- */
  function themeState(id) {
    var p = allThemes()[id] || THEMES["echo-dark"];
    return { theme: id, tokens: clone(p.tokens), accent: clone(p.accent), skin: id === "neon" ? "cyber" : id };
  }
  function defaultState() {
    var s = themeState("echo-dark");
    s.accent.mode = "dynamic";
    s.meta = { name: "Untitled UI" };
    s.layout = { sidebar: true, topbar: false, playerbar: true };
    s.data = clone(UI.data);
    s.selected = null; s.zoom = 1;
    s.blocks = [
      { id: uid(), type: "page-header", span: 12, props: { eyebrow: "Now Playing", title: "Stay with the sound.", sub: "" }, style: {} },
      { id: uid(), type: "hero", span: 8, props: { title: "Red Thread", artist: "Mira Vale", album: "Forms of Silence · 2026", source: "Forms of Silence", seed: 3, badges: "FLAC, 24-bit, 96 kHz, Lossless", wave: true, spec: true, heart: true, height: 440 }, style: {} },
      { id: uid(), type: "up-next", span: 4, props: { title: "Up next", sub: "A quiet sequence · 13 min", count: 3, signal: true }, style: {} }
    ];
    return s;
  }
  var state = readLS(LS_KEY, null) || defaultState();

  var history = [], hIndex = -1, hLock = false, hLast = 0;
  function snapshot() { return JSON.stringify(state); }
  function pushHistory() { if (hLock) return; var now = Date.now(); if (now - hLast < 350) return; hLast = now; history = history.slice(0, hIndex + 1); history.push(snapshot()); if (history.length > 80) history.shift(); hIndex = history.length - 1; }
  function save() { writeLS(LS_KEY, state); pushHistory(); }
  function restore(json) { hLock = true; state = JSON.parse(json); hLock = false; writeLS(LS_KEY, state); syncTopbar(); renderCanvas(); renderInspector(); }
  function undo() { if (hIndex > 0) { hIndex--; restore(history[hIndex]); } }
  function redo() { if (hIndex < history.length - 1) { hIndex++; restore(history[hIndex]); } }

  /* ---------------- component css + tokens ---------------- */
  var compStyle = document.createElement("style"); compStyle.textContent = window.UIComponentCss || ""; document.head.appendChild(compStyle);
  var tokenStyle = document.createElement("style"); document.head.appendChild(tokenStyle);
  function hexToRgb(h) { h = String(h || "").replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join(""); var n = parseInt(h, 16); if (isNaN(n)) return null; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgbToHex(c) { return "#" + c.map(function (x) { return Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"); }).join(""); }
  function shift(hex, amt) { var c = hexToRgb(hex); return c ? rgbToHex([c[0] + amt, c[1] + amt, c[2] + amt]) : hex; }
  function lum(hex) { var c = hexToRgb(hex); return c ? (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 : 0; }
  function applyTokens() {
    var acc = UI.accentFor(state.data.now.seed, state);
    var css = window.UIThemes.tokensToCss(state.tokens, acc, "#canvas");
    tokenStyle.textContent = css + "\n#canvas{background:var(--bg);color:var(--text);font-family:var(--font);height:100%}";
    /* workspace behind the mockup adapts to the theme (fixes light themes on dark editor) */
    var bg = state.tokens.bg, light = lum(bg) > 0.5;
    var top = shift(bg, light ? -10 : 12);
    $("#stage").style.background = "radial-gradient(80% 60% at 50% 0%," + top + "," + bg + " 72%)";
    var dw = $("#deviceWrap");
    dw.style.background = bg;
    dw.style.borderColor = state.tokens.line;
    dw.style.boxShadow = light ? "0 30px 80px rgb(0 0 0/.22)" : "0 30px 80px rgb(0 0 0/.6)";
    $("#themeSwatch").style.background = "linear-gradient(135deg," + acc.css + "," + state.tokens.panel + ")";
  }

  /* ---------------- canvas ---------------- */
  var canvas = $("#canvas");
  function renderCanvas() {
    UI.render(state, canvas);
    applyTokens();
    canvas.className = canvas.className.replace(/\bview-\w+/g, "").trim();
    var db = $("#device button.on");
    var w = db ? +db.getAttribute("data-val") : 1280;
    canvas.classList.add(w <= 480 ? "view-phone" : w <= 960 ? "view-tablet" : "view-desktop");
    if (!state.blocks.length) {
      var c = $("#canvas .u-content");
      if (c) c.innerHTML = '<div class="s-empty"><b>Empty canvas</b><span>Click a block in the palette, or drag one here, to start composing. Pick a layout from the top bar for a head start.</span></div>';
    }
    applySelection(); initSortable();
  }

  function applySelection() {
    $$("#canvas .u-block").forEach(function (b) { b.classList.toggle("s-selected", b.getAttribute("data-block-id") === state.selected); });
    var sel = state.selected && $('#canvas .u-block[data-block-id="' + state.selected + '"]');
    $$("#canvas .s-blockbar").forEach(function (n) { n.remove(); });
    if (!sel) return;
    var bar = document.createElement("div"); bar.className = "s-blockbar";
    bar.innerHTML = '<button data-act="up" title="Move up">↑</button><button data-act="down" title="Move down">↓</button><button data-act="dup" title="Duplicate">⧉</button><button data-act="del" title="Delete">✕</button>';
    bar.addEventListener("click", function (e) { var a = e.target.getAttribute("data-act"); if (!a) return; e.stopPropagation(); blockAction(a); });
    sel.appendChild(bar);
  }

  function findBlock(id) { return state.blocks.filter(function (b) { return b.id === id; })[0]; }
  function blockAction(act) {
    var i = state.blocks.map(function (b) { return b.id; }).indexOf(state.selected); if (i < 0) return;
    if (act === "up" && i > 0) { var t = state.blocks[i - 1]; state.blocks[i - 1] = state.blocks[i]; state.blocks[i] = t; }
    if (act === "down" && i < state.blocks.length - 1) { var t2 = state.blocks[i + 1]; state.blocks[i + 1] = state.blocks[i]; state.blocks[i] = t2; }
    if (act === "dup") { var c = clone(state.blocks[i]); c.id = uid(); state.blocks.splice(i + 1, 0, c); state.selected = c.id; }
    if (act === "del") { state.blocks.splice(i, 1); state.selected = null; }
    save(); renderCanvas(); renderInspector();
  }

  function initSortable() {
    var content = $("#canvas .u-content"); if (!content || !window.Sortable) return;
    Sortable.create(content, {
      group: { name: "blocks", put: true, pull: false }, animation: 150, ghostClass: "sortable-ghost", filter: ".s-blockbar",
      onEnd: readOrder,
      onAdd: function (evt) {
        var type = evt.item.getAttribute("data-palette-type"); if (!type) return;
        var def = UI.blocks[type]; if (!def) { evt.item.remove(); return; }
        var id = uid();
        state.blocks.push({ id: id, type: type, span: /hero|album-hero/.test(type) ? 8 : 12, props: clone(def.defaults), style: {} });
        state.selected = id; save(); renderCanvas(); renderInspector();
      }
    });
  }
  function readOrder() {
    var ids = $$("#canvas .u-block").map(function (b) { return b.getAttribute("data-block-id"); });
    state.blocks.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); save();
  }

  /* ---------------- palette ---------------- */
  var collapsed = readLS(LS_COLLAPSE, {});
  function renderPalette(filter) {
    var host = $("#paletteList"); host.innerHTML = "";
    filter = (filter || "").toLowerCase();
    var groups = {};
    (window.UIBlockOrder || Object.keys(UI.blocks)).forEach(function (t) {
      var d = UI.blocks[t]; if (!d) return;
      if (filter && (d.name + " " + t + " " + d.group).toLowerCase().indexOf(filter) < 0) return;
      (groups[d.group] = groups[d.group] || []).push(t);
    });
    if (!Object.keys(groups).length) { host.innerHTML = '<div class="i-empty">No blocks match.</div>'; return; }
    Object.keys(groups).forEach(function (g) {
      var gh = document.createElement("div"); gh.className = "p-group" + (collapsed[g] ? " collapsed" : "");
      gh.innerHTML = '<span><span class="p-arrow">▾</span>' + g + '</span><span class="p-count">' + groups[g].length + '</span>';
      gh.addEventListener("click", function () { collapsed[g] = !collapsed[g]; writeLS(LS_COLLAPSE, collapsed); gh.classList.toggle("collapsed"); items.classList.toggle("collapsed"); });
      host.appendChild(gh);
      var items = document.createElement("div"); items.className = "p-items" + (collapsed[g] ? " collapsed" : "");
      groups[g].forEach(function (t) {
        var d = UI.blocks[t];
        var it = document.createElement("div"); it.className = "p-item"; it.setAttribute("data-palette-type", t);
        it.innerHTML = '<span class="p-ic">' + (d.icon || "▦") + '</span>' + d.name;
        it.addEventListener("click", function () {
          var id = uid();
          state.blocks.push({ id: id, type: t, span: /hero|album-hero/.test(t) ? 8 : 12, props: clone(d.defaults), style: {} });
          state.selected = id; save(); renderCanvas(); renderInspector();
          $("#canvas").scrollTop = 99999;
        });
        items.appendChild(it);
      });
      host.appendChild(items);
    });
    if (window.Sortable) Sortable.create(host, { group: { name: "blocks", pull: "clone", put: false }, sort: false, animation: 150 });
  }

  /* ---------------- inspector ---------------- */
  function field(f, val) {
    var h = '<div class="i-field"><label>' + f.label + '</label>';
    if (f.type === "textarea") h += '<textarea data-key="' + f.key + '">' + UI.esc(val) + '</textarea>';
    else if (f.type === "number") h += '<input type="number" data-key="' + f.key + '" value="' + (val == null ? "" : val) + '" />';
    else if (f.type === "select") h += '<select data-key="' + f.key + '">' + (f.options || []).map(function (o) { return '<option' + (o === val ? " selected" : "") + '>' + UI.esc(o) + '</option>'; }).join("") + '</select>';
    else if (f.type === "check") h += '<label class="i-check"><input type="checkbox" data-key="' + f.key + '"' + (val ? " checked" : "") + ' /> enabled</label>';
    else h += '<input type="text" data-key="' + f.key + '" value="' + UI.esc(val) + '" />';
    return h + '</div>';
  }
  function tokenColor(key, label) { return '<div class="i-color"><input type="color" data-token="' + key + '" value="' + state.tokens[key] + '" /><span>' + label + '</span></div>'; }
  function seg(name, opts, cur) { return '<div class="i-seg" data-seg="' + name + '">' + opts.map(function (o) { return '<button data-val="' + o[0] + '"' + (String(cur) === String(o[0]) ? ' class="on"' : "") + '>' + o[1] + '</button>'; }).join("") + '</div>'; }

  function renderInspector() {
    var host = $("#inspector"); host.innerHTML = "";
    var sel = findBlock(state.selected);

    if (sel) {
      var def = UI.blocks[sel.type];
      var c = document.createElement("div"); c.className = "i-card";
      c.innerHTML = '<div class="i-head">' + def.name + ' <span class="i-tag">' + sel.type + '</span></div>' +
        '<div class="i-field"><label>Width · <span data-out="span">' + sel.span + '</span>/12</label><input type="range" data-block-span min="2" max="12" value="' + sel.span + '" /></div>' +
        def.fields.map(function (f) { return field(f, sel.props[f.key]); }).join("") +
        '<div class="i-btns"><button data-bact="up">↑ Up</button><button data-bact="down">↓ Down</button><button data-bact="dup">Duplicate</button><button data-bact="del" class="del">Delete</button></div>';
      host.appendChild(c);

      /* block style */
      var st = sel.style || (sel.style = {});
      var sc = document.createElement("div"); sc.className = "i-card";
      sc.innerHTML = '<div class="i-head">Block style</div>' +
        '<div class="i-field"><label>Padding</label>' + seg("pad", [[0, "None"], [8, "S"], [16, "M"], [24, "L"]], st.pad || 0) + '</div>' +
        '<div class="i-field"><label>Surface</label>' + seg("tint", [["none", "None"], ["soft", "Card"], ["well", "Well"], ["accent", "Accent"], ["gradient", "Grad"]], st.tint || "none") + '</div>' +
        '<div class="i-field"><label>Align</label>' + seg("align", [["left", "Left"], ["center", "Center"], ["right", "Right"]], st.align || "left") + '</div>' +
        '<div class="i-field"><label>Hide on</label>' + seg("hide", [["none", "Never"], ["tablet", "Tablet"], ["phone", "Phone"], ["both", "Both"]], st.hide || "none") + '</div>' +
        '<div class="i-btns"><button data-bact="swap">⇄ Swap block type</button></div>';
      host.appendChild(sc);
    } else {
      var e = document.createElement("div"); e.className = "i-card i-empty";
      e.innerHTML = "Select a block on the canvas to edit it, or click one in the palette to add it.<br><br>Double-click any heading on the canvas to edit text inline.";
      host.appendChild(e);
    }

    /* design tokens */
    var d = document.createElement("div"); d.className = "i-card";
    d.innerHTML = '<div class="i-head">Design tokens</div>' +
      '<div class="i-colors">' + tokenColor("bg", "bg") + tokenColor("bg2", "bg2") + tokenColor("panel", "panel") + tokenColor("panel2", "panel2") + tokenColor("well", "well") + tokenColor("line", "line") + tokenColor("text", "text") + tokenColor("muted", "muted") + '</div>' +
      '<div class="i-field" style="margin-top:12px"><label>Radius · <span data-out="radius">' + state.tokens.radius + '</span>px</label><input type="range" data-token-range="radius" min="0" max="32" value="' + state.tokens.radius + '" /></div>' +
      '<div class="i-field"><label>Gap · <span data-out="gap">' + state.tokens.gap + '</span>px</label><input type="range" data-token-range="gap" min="0" max="40" value="' + state.tokens.gap + '" /></div>' +
      '<div class="i-field"><label>Depth</label>' + seg("depth", [[0, "Flat"], [1, "Low"], [2, "High"], [3, "Max"]], state.tokens.depth) + '</div>';
    host.appendChild(d);

    /* data */
    var dc = document.createElement("div"); dc.className = "i-card";
    dc.innerHTML = '<div class="i-head">Data</div>' + dataEditorHtml();
    host.appendChild(dc);

    wireInspector();
  }

  function dataEditorHtml() {
    return '<div class="d-tabs" id="dTabs">' + [["now", "Now"], ["tracks", "Tracks"], ["albums", "Albums"], ["moods", "Moods"], ["stats", "Stats"]].map(function (t, i) { return '<button data-dtab="' + t[0] + '"' + (i === 0 ? ' class="on"' : "") + '>' + t[1] + '</button>'; }).join("") + '</div><div id="dBody"></div>';
  }

  function renderDataBody(tab) {
    var body = $("#dBody"); if (!body) return;
    var data = state.data;
    function inputRow(cols, row, idx, arr) {
      var grid = 'grid-template-columns:' + cols.map(function (c) { return c.w; }).join(" ") + ' 22px';
      return '<div class="d-row" style="' + grid + '" data-row="' + idx + '">' + cols.map(function (c) {
        return '<input data-dfield="' + c.k + '" data-didx="' + idx + '" value="' + UI.esc(row[c.k] == null ? "" : row[c.k]) + '" placeholder="' + c.k + '" />';
      }).join("") + '<button class="d-del" data-ddel="' + idx + '">✕</button></div>';
    }
    function table(arr, cols) {
      return '<div class="d-th" style="grid-template-columns:' + cols.map(function (c) { return c.w; }).join(" ") + ' 22px">' + cols.map(function (c) { return '<span>' + c.k + '</span>'; }).join("") + '<span></span></div>' +
        arr.map(function (r, i) { return inputRow(cols, r, i, arr); }).join("") +
        '<button class="d-add" data-dadd>＋ Add row</button>';
    }
    if (tab === "now") {
      var n = data.now;
      body.innerHTML = '<div class="i-field"><label>Title</label><input type="text" data-nfield="title" value="' + UI.esc(n.title) + '"/></div>' +
        '<div class="i-field"><label>Artist</label><input type="text" data-nfield="artist" value="' + UI.esc(n.artist) + '"/></div>' +
        '<div class="i-field"><label>Album</label><input type="text" data-nfield="album" value="' + UI.esc(n.album) + '"/></div>' +
        '<div class="i-row"><div class="i-field"><label>Seed</label><input type="number" data-nfield="seed" value="' + n.seed + '"/></div>' +
        '<div class="i-field"><label>Duration (ms)</label><input type="number" data-nfield="duration" value="' + n.duration + '"/></div></div>';
    } else if (tab === "tracks") {
      body.innerHTML = table(data.tracks, [{ k: "title", w: "1.5fr" }, { k: "artist", w: "1fr" }, { k: "album", w: "1fr" }, { k: "duration", w: "52px" }, { k: "plays", w: "46px" }, { k: "seed", w: "44px" }]);
    } else if (tab === "albums") {
      body.innerHTML = table(data.albums, [{ k: "title", w: "1.6fr" }, { k: "artist", w: "1.2fr" }, { k: "year", w: "56px" }, { k: "seed", w: "50px" }]);
    } else if (tab === "moods") {
      body.innerHTML = table(data.moods, [{ k: "name", w: "1.6fr" }, { k: "albums", w: "64px" }, { k: "hue", w: "56px" }]);
    } else {
      var s = data.stats;
      body.innerHTML = ["hours", "tracks", "albums", "artists", "delta", "discoveries"].map(function (k) {
        return '<div class="i-field"><label>' + k + '</label><input data-sfield="' + k + '" value="' + UI.esc(s[k]) + '"/></div>';
      }).join("");
    }
  }

  function wireInspector() {
    $$("#inspector [data-token]").forEach(function (inp) { inp.addEventListener("input", function () { state.tokens[inp.getAttribute("data-token")] = inp.value; save(); applyTokens(); renderCanvas(); }); });
    $$("#inspector [data-token-range]").forEach(function (inp) { inp.addEventListener("input", function () { var k = inp.getAttribute("data-token-range"); state.tokens[k] = +inp.value; var o = $('[data-out="' + k + '"]'); if (o) o.textContent = inp.value; save(); applyTokens(); renderCanvas(); }); });
    $$("#inspector [data-seg]").forEach(function (sg) { sg.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return; var name = sg.getAttribute("data-seg"), val = b.getAttribute("data-val");
      if (name === "depth") { state.tokens.depth = +val; save(); applyTokens(); renderCanvas(); renderInspector(); return; }
      var blk = findBlock(state.selected); if (!blk) return;
      blk.style = blk.style || {}; blk.style[name] = isNaN(+val) || val === "none" || val === "left" || val === "soft" ? val : +val;
      if (name === "pad") blk.style.pad = +val;
      save(); renderCanvas(); renderInspector();
    }); });
    var sp = $("#inspector [data-block-span]"); if (sp) sp.addEventListener("input", function () { var b = findBlock(state.selected); if (b) { b.span = +sp.value; var o = $('[data-out="span"]'); if (o) o.textContent = sp.value; save(); renderCanvas(); } });
    $$("#inspector [data-key]").forEach(function (inp) {
      var ev = (inp.type === "checkbox" || inp.tagName === "SELECT") ? "change" : "input";
      inp.addEventListener(ev, function () {
        var b = findBlock(state.selected); if (!b) return; var k = inp.getAttribute("data-key");
        b.props[k] = inp.type === "checkbox" ? inp.checked : (inp.type === "number" ? +inp.value : inp.value);
        save(); renderCanvas();
      });
    });
    $$("#inspector [data-bact]").forEach(function (b) { b.addEventListener("click", function () { var a = b.getAttribute("data-bact"); if (a === "swap") swapBlock(); else blockAction(a); }); });

    /* data editor */
    var tabs = $("#dTabs"); if (tabs) {
      var cur = tabs.querySelector(".on").getAttribute("data-dtab"); renderDataBody(cur);
      tabs.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("#dTabs button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); renderDataBody(b.getAttribute("data-dtab")); });
    }
    $$("#dBody [data-dfield]").forEach(function (inp) { inp.addEventListener("input", function () {
      var tab = $("#dTabs .on").getAttribute("data-dtab"), i = +inp.getAttribute("data-didx"), k = inp.getAttribute("data-dfield");
      var v = inp.value; if (k === "duration" || k === "plays" || k === "seed" || k === "year" || k === "albums" || k === "hue") v = +v || 0;
      state.data[tab][i][k] = v; save(); renderCanvas();
    }); });
    $$("#dBody [data-ddel]").forEach(function (b) { b.addEventListener("click", function () { var tab = $("#dTabs .on").getAttribute("data-dtab"); state.data[tab].splice(+b.getAttribute("data-ddel"), 1); save(); renderInspector(); renderCanvas(); }); });
    var add = $("#dBody [data-dadd]"); if (add) add.addEventListener("click", function () { var tab = $("#dTabs .on").getAttribute("data-dtab"); var t = tab === "albums" ? { title: "New album", artist: "Artist", year: 2026, seed: Math.floor(Math.random() * 40) } : tab === "moods" ? { name: "New mood", albums: 5, hue: Math.floor(Math.random() * 360) } : { title: "New track", artist: "Artist", album: "Album", seed: Math.floor(Math.random() * 40), duration: 240, plays: 0 }; state.data[tab].push(t); save(); renderInspector(); renderCanvas(); });
    $$("#dBody [data-nfield]").forEach(function (inp) { inp.addEventListener("input", function () { var k = inp.getAttribute("data-nfield"); state.data.now[k] = (k === "seed" || k === "duration") ? +inp.value : inp.value; save(); renderCanvas(); }); });
    $$("#dBody [data-sfield]").forEach(function (inp) { inp.addEventListener("input", function () { state.data.stats[inp.getAttribute("data-sfield")] = inp.value; save(); renderCanvas(); }); });
  }

  function swapBlock() {
    var b = findBlock(state.selected); if (!b) return;
    var types = window.UIBlockOrder;
    var name = prompt("Swap to block type:\n" + types.map(function (t, i) { return (i + 1) + ". " + UI.blocks[t].name + " (" + t + ")"; }).join("\n") + "\n\nEnter a number or type id:", String(types.indexOf(b.type) + 1));
    if (!name) return;
    var t = /^\d+$/.test(name) ? types[+name - 1] : name.trim();
    if (!UI.blocks[t]) return alert("Unknown block: " + name);
    b.type = t; b.props = clone(UI.blocks[t].defaults);
    save(); renderCanvas(); renderInspector();
  }

  /* ---------------- canvas events ---------------- */
  canvas.addEventListener("click", function (e) {
    if (e.target.isContentEditable) return;
    var b = e.target.closest(".u-block"); if (!b) return;
    state.selected = b.getAttribute("data-block-id"); applySelection(); renderInspector();
  });
  canvas.addEventListener("dblclick", function (e) {
    var ed = e.target.closest("[data-edit]"); if (!ed) return;
    var blkEl = ed.closest(".u-block"); var b = findBlock(blkEl.getAttribute("data-block-id")); if (!b) return;
    var key = ed.getAttribute("data-edit");
    ed.setAttribute("contenteditable", "true"); ed.classList.add("editing"); ed.focus();
    var r = document.createRange(); r.selectNodeContents(ed); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    function commit() {
      ed.removeAttribute("contenteditable"); ed.classList.remove("editing"); ed.removeEventListener("blur", commit); ed.removeEventListener("keydown", keydown);
      b.props[key] = ed.textContent.trim(); save(); renderCanvas();
    }
    function keydown(ev) { if (ev.key === "Enter") { ev.preventDefault(); ed.blur(); } if (ev.key === "Escape") { ed.removeEventListener("blur", commit); ed.removeAttribute("contenteditable"); ed.classList.remove("editing"); renderCanvas(); } }
    ed.addEventListener("blur", commit); ed.addEventListener("keydown", keydown);
  });

  /* ---------------- topbar ---------------- */
  function buildLayoutSelect() {
    var layoutSel = $("#uiLayout");
    layoutSel.innerHTML = '<option value="">— load layout —</option>' + Object.keys(TEMPLATES).map(function (k) { return '<option>' + k + '</option>'; }).join("");
    layoutSel.addEventListener("change", function () { if (!this.value || !TEMPLATES[this.value]) return; state.blocks = TEMPLATES[this.value](); state.selected = null; save(); renderCanvas(); renderInspector(); });
  }
  var TEMPLATES = {
    "Hero · Now Playing": function () { return [blk("page-header", 12, { eyebrow: "Now Playing", title: "Stay with the sound." }), blk("hero", 8), blk("up-next", 4)]; },
    "Browse · Library": function () { return [blk("page-header", 12, { eyebrow: "Browse", title: "Find your next repeat." }), blk("album-grid", 12, { title: "Recently added", sub: "Fresh arrivals in your library", count: 4 }), blk("mood-cards", 12), blk("track-list", 12, { title: "For this hour", sub: "Selections shaped by your library", count: 6 })]; },
    "Stats · Analytics": function () { return [blk("page-header", 12, { eyebrow: "Stats", title: "Your listening, in detail." }), blk("stat-cards", 12), blk("bar-chart", 7), blk("genre-mix", 5), blk("heatmap", 7), blk("radial-rings", 5), blk("line-chart", 12), blk("data-table", 12, { title: "Top tracks", count: 5 })]; },
    "Dashboard · Grid": function () { return [blk("page-header", 12, { eyebrow: "Dashboard", title: "A live view of your engine." }), blk("hero", 7, { height: 400 }), blk("radial-rings", 5, { title: "Library Pulse" }), blk("sparkline-stats", 12), blk("track-list", 7, { title: "Up next", sub: "Queued", count: 5, numbered: true }), blk("signal-tiles", 5), blk("bar-chart", 6), blk("heatmap", 6)]; },
    "Queue · Session": function () { return [blk("page-header", 12, { eyebrow: "Queue", title: "What's coming up." }), blk("track-list", 8, { title: "Queue", sub: "Structured around the real queue state", count: 8, numbered: true }), blk("signal-tiles", 4), blk("session-heatmap", 4), blk("genre-mix", 4)]; },
    "Immersive · Player": function () { return [blk("now-playing", 12, { title: "Red Thread", artist: "Mira Vale", lyrics: "left" }), blk("waveform", 8), blk("vumeters", 4), blk("spectrum", 12), blk("knobs", 6), blk("processing-chain", 6)]; },
    "Signal · Rack": function () { return [blk("page-header", 12, { eyebrow: "Signal", title: "Every stage, visible." }), blk("spectrum", 8), blk("vumeters", 4), blk("waveform", 12), blk("equalizer", 12), blk("knobs", 6), blk("processing-chain", 6)]; },
    "Album · Detail": function () { return [blk("album-hero", 12, { title: "Forms of Silence", artist: "Mira Vale", year: 2026, count: 5 }), blk("waveform", 8), blk("signal-tiles", 4), blk("lyrics-panel", 12)]; },
    "Search · Browse": function () { return [blk("search-header", 12), blk("chip-row", 12), blk("album-grid", 12, { title: "Recently added", sub: "Fresh arrivals in your library", count: 4 }), blk("mood-cards", 12), blk("media-list", 12, { title: "For this hour", count: 4 })]; },
    "Settings · Toggles": function () { return [blk("page-header", 12, { eyebrow: "Setup", title: "Make it yours." }), blk("settings-list", 7, { title: "Playback" }), blk("settings-list", 5, { title: "Appearance", items: "Dynamic accent, Motion, Lyrics, Flashbang", on: "1,1,0,1" }), blk("knobs", 12), blk("key-value", 12)]; },
    "Compact · Mini": function () { return [blk("page-header", 12, { eyebrow: "Home", title: "Quick access." }), blk("mini-player", 12), blk("sparkline-stats", 12), blk("session-heatmap", 12, { title: "Session heatmap", sub: "Every cell is a track", cols: 12, rows: 2 }), blk("media-list", 12, { title: "Continue listening", count: 4 })]; },
    "Article · Editorial": function () { return [blk("page-header", 12, { eyebrow: "Feature", title: "The quiet loud." }), blk("quote", 12), blk("text-block", 12, { title: "On ambient music", body: "The best ambient music rewards patience. It asks you to stop waiting for the drop and start noticing the room." }), blk("callout", 12), blk("divider", 12), blk("media-list", 12, { title: "Listen next", count: 4 })]; }
  };
  function blk(type, span, props) { var d = UI.blocks[type]; return { id: uid(), type: type, span: span || 12, props: Object.assign({}, d.defaults, props || {}), style: {} }; }

  $("#uiName").addEventListener("input", function () { state.meta.name = this.value; save(); });
  $$("#accentMode button").forEach(function (b) { b.addEventListener("click", function () { state.accent.mode = b.getAttribute("data-val"); $$("#accentMode button").forEach(function (x) { x.classList.toggle("on", x === b); }); save(); applyTokens(); renderCanvas(); }); });
  $$("#device button").forEach(function (b) { b.addEventListener("click", function () { $$("#device button").forEach(function (x) { x.classList.toggle("on", x === b); }); $("#deviceWrap").style.setProperty("--dw", b.getAttribute("data-val") + "px"); renderCanvas(); }); });
  function lay(id, key) { $(id).addEventListener("change", function () { state.layout[key] = this.checked; save(); renderCanvas(); }); }
  lay("#laySidebar", "sidebar"); lay("#layTopbar", "topbar"); lay("#layPlayer", "playerbar");
  $("#paletteSearch").addEventListener("input", function () { renderPalette(this.value); });

  /* zoom */
  function applyZoom() { $("#deviceWrap").style.zoom = state.zoom || 1; $("#zoomVal").textContent = Math.round((state.zoom || 1) * 100) + "%"; }
  $("#zoomIn").addEventListener("click", function () { state.zoom = Math.min(1.6, (state.zoom || 1) + 0.1); applyZoom(); save(); });
  $("#zoomOut").addEventListener("click", function () { state.zoom = Math.max(0.5, (state.zoom || 1) - 0.1); applyZoom(); save(); });

  /* preview */
  $("#btnPreview").addEventListener("click", function () {
    document.body.classList.add("preview");
    if (!$("#previewExit")) { var x = document.createElement("button"); x.id = "previewExit"; x.textContent = "Exit preview"; x.addEventListener("click", function () { document.body.classList.remove("preview"); }); document.body.appendChild(x); }
  });

  /* ---------------- theme gallery ---------------- */
  function openModal(html, onOpen) {
    var root = $("#modalRoot");
    root.innerHTML = '<div class="modal-backdrop open"><div class="modal">' + html + '</div></div>';
    var bd = root.querySelector(".modal-backdrop");
    bd.addEventListener("click", function (e) { if (e.target === bd) closeModal(); });
    var x = root.querySelector(".modal-close"); if (x) x.addEventListener("click", closeModal);
    if (onOpen) onOpen(root);
  }
  function closeModal() { $("#modalRoot").innerHTML = ""; }

  function themeCard(id, t) {
    var acc = UI.accentFor(state.data.now.seed, { accent: t.accent });
    return '<div class="theme-card' + (state.theme === id ? " on" : "") + '" data-theme="' + id + '">' +
      '<div class="tc-swatches"><i style="background:' + t.tokens.bg + '"></i><i style="background:' + t.tokens.panel + '"></i><i style="background:' + acc.css + '"></i><i style="background:' + t.tokens.text + '"></i></div>' +
      '<b>' + UI.esc(t.label || id) + '</b><span>' + (t.custom ? "custom" : "preset") + '</span>' +
      (t.custom ? '<span class="tc-del" data-deltheme="' + id + '">delete</span>' : "") + '</div>';
  }
  $("#btnThemes").addEventListener("click", function () {
    var all = allThemes();
    var gallery = Object.keys(all).map(function (k) { return themeCard(k, all[k]); }).join("");
    var skins = Object.keys(all).map(function (k) { return '<option value="' + k + '"' + (state.skin === k ? " selected" : "") + '>' + UI.esc(all[k].label || k) + '</option>'; }).join("");
    var fonts = FONTS.map(function (f) { return '<option value="' + UI.esc(f.value) + '"' + (state.tokens.font === f.value ? " selected" : "") + '>' + f.label + '</option>'; }).join("");
    var swatches = ACCENT_PRESETS.map(function (h) { return '<span class="preset-sw" data-hue="' + h + '" style="background:hsl(' + h + ' 72% 60%)"></span>'; }).join("");
    openModal(
      '<div class="modal-head"><h2>Theme</h2><button class="modal-close">✕</button></div>' +
      '<div class="theme-grid">' + gallery + '</div>' +
      '<div class="i-sec">Accent</div><div class="preset-row">' + swatches + '</div>' +
      '<div class="i-row"><div class="i-field"><label>Hue · <span id="mHueV">' + state.accent.hue + '</span></label><input type="range" id="mHue" min="0" max="360" value="' + state.accent.hue + '"/></div>' +
      '<div class="i-field"><label>Sat · <span id="mSatV">' + state.accent.sat + '</span></label><input type="range" id="mSat" min="20" max="100" value="' + state.accent.sat + '"/></div>' +
      '<div class="i-field"><label>Light · <span id="mLightV">' + state.accent.light + '</span></label><input type="range" id="mLight" min="30" max="80" value="' + state.accent.light + '"/></div></div>' +
      '<div class="i-sec">Structure & type</div>' +
      '<div class="i-row"><div class="i-field"><label>Skin (layout language)</label><select id="mSkin">' + skins + '</select></div>' +
      '<div class="i-field"><label>Font</label><select id="mFont">' + fonts + '</select></div></div>' +
      '<div class="modal-actions"><button class="tb-btn" id="mSaveTheme">Save as custom theme</button></div>',
      function (root) {
        root.querySelectorAll(".theme-card").forEach(function (card) { card.addEventListener("click", function (e) {
          if (e.target.getAttribute("data-deltheme")) { var d = customThemes(); delete d[e.target.getAttribute("data-deltheme")]; writeLS(LS_THEMES, d); closeModal(); return; }
          applyTheme(card.getAttribute("data-theme"));
        }); });
        function bind(id, key, out) { var el = root.querySelector(id); if (!el) return; el.addEventListener("input", function () { state.accent[key] = +el.value; var o = root.querySelector(out); if (o) o.textContent = el.value; save(); applyTokens(); renderCanvas(); }); }
        bind("#mHue", "hue", "#mHueV"); bind("#mSat", "sat", "#mSatV"); bind("#mLight", "light", "#mLightV");
        root.querySelectorAll(".preset-sw").forEach(function (s) { s.addEventListener("click", function () { state.accent.hue = +s.getAttribute("data-hue"); save(); applyTokens(); renderCanvas(); closeModal(); }); });
        root.querySelector("#mSkin").addEventListener("change", function () { state.skin = this.value; save(); renderCanvas(); });
        root.querySelector("#mFont").addEventListener("change", function () { state.tokens.font = this.value; save(); applyTokens(); renderCanvas(); });
        root.querySelector("#mSaveTheme").addEventListener("click", function () {
          var name = prompt("Custom theme name:", "My theme"); if (!name) return;
          var id = "custom-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          var d = customThemes(); d[id] = { label: name, custom: true, accent: clone(state.accent), tokens: clone(state.tokens) }; writeLS(LS_THEMES, d);
          closeModal();
        });
      });
  });
  function applyTheme(id) {
    var p = allThemes()[id]; if (!p) return;
    state.theme = id; state.tokens = clone(p.tokens); state.accent = clone(p.accent); state.skin = id === "neon" ? "cyber" : id;
    save(); syncTopbar(); applyTokens(); renderCanvas(); renderInspector(); closeModal();
  }

  /* ---------------- projects ---------------- */
  $("#btnProjects").addEventListener("click", function () {
    var projs = readLS(LS_PROJ, {});
    var rows = Object.keys(projs).map(function (k) { return '<div class="proj-row"><b>' + UI.esc(projs[k].meta.name || k) + '</b><span>' + (projs[k].blocks || []).length + ' blocks</span><button data-open="' + k + '">Open</button><button data-del="' + k + '">Delete</button></div>'; }).join("") || '<div class="i-empty">No saved projects yet.</div>';
    openModal('<div class="modal-head"><h2>Projects</h2><button class="modal-close">✕</button></div>' +
      '<div class="modal-actions" style="margin:0 0 14px"><button class="tb-btn primary" id="pNew">New</button><button class="tb-btn" id="pSave">Save current</button><button class="tb-btn" id="pDup">Duplicate current</button><button class="tb-btn" id="pImport">Import JSON</button><button class="tb-btn" id="pExport">Export JSON</button></div>' +
      '<div class="proj-list">' + rows + '</div>', function (root) {
      root.querySelector("#pNew").addEventListener("click", function () { if (!confirm("Start a new empty design?")) return; state = defaultState(); save(); syncTopbar(); applyZoom(); renderCanvas(); renderInspector(); closeModal(); });
      root.querySelector("#pSave").addEventListener("click", function () { var projs2 = readLS(LS_PROJ, {}); projs2[uid()] = clone(state); writeLS(LS_PROJ, projs2); closeModal(); });
      root.querySelector("#pDup").addEventListener("click", function () { var s = clone(state); s.meta.name = (s.meta.name || "Untitled") + " copy"; var projs2 = readLS(LS_PROJ, {}); projs2[uid()] = s; writeLS(LS_PROJ, projs2); closeModal(); });
      root.querySelector("#pImport").addEventListener("click", function () { $("#fileInput").click(); });
      root.querySelector("#pExport").addEventListener("click", function () { download((state.meta.name || "ui").replace(/\s+/g, "-").toLowerCase() + ".json", JSON.stringify(state, null, 2), "application/json"); });
      root.querySelectorAll("[data-open]").forEach(function (b) { b.addEventListener("click", function () { var p = readLS(LS_PROJ, {})[b.getAttribute("data-open")]; if (p) { state = p; save(); syncTopbar(); applyZoom(); renderCanvas(); renderInspector(); closeModal(); } }); });
      root.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { var d = readLS(LS_PROJ, {}); delete d[b.getAttribute("data-del")]; writeLS(LS_PROJ, d); closeModal(); }); });
    });
  });

  /* ---------------- export / import ---------------- */
  var runtime = null;
  function loadRuntime() {
    if (runtime) return Promise.resolve(runtime);
    var files = ["js/themes.js", "js/core.js", "js/component-css.js", "js/blocks.js"];
    return Promise.all(files.map(function (f) { return fetch(f).then(function (r) { if (!r.ok) throw new Error(f); return r.text(); }); }))
      .then(function (t) { runtime = { themes: t[0], core: t[1], css: t[2], blocks: t[3] }; return runtime; });
  }
  function download(name, text, type) { var b = new Blob([text], { type: type || "text/html" }), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); }
  function safeJson(o) { return JSON.stringify(o).replace(/</g, "\\u003c"); }

  $("#btnExport").addEventListener("click", function () {
    var btn = this; btn.textContent = "Building…";
    loadRuntime().then(function (rt) {
      var tok = window.UIThemes.tokensToCss(state.tokens, UI.accentFor(state.data.now.seed, state), ".export-root");
      var html = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />' +
        '<title>' + UI.esc(state.meta.name || "UI") + '</title>\n<style>\n' + tok +
        'html,body{height:100%;margin:0;background:var(--bg);color:var(--text);font-family:var(--font)}\n.export-root{height:100vh;overflow:auto}\n</style>\n</head>\n<body>\n<div id="export-root" class="export-root"></div>\n' +
        '<script>' + rt.themes + '<\/script>\n<script>' + rt.core + '<\/script>\n<script>' + rt.css + '<\/script>\n<script>' + rt.blocks + '<\/script>\n' +
        '<script>(function(){var s=document.createElement("style");s.textContent=window.UIComponentCss||"";document.head.appendChild(s);var st=' + safeJson(state) + ';UI.render(st,document.getElementById("export-root"));})();<\/script>\n</body></html>';
      download((state.meta.name || "ui").replace(/\s+/g, "-").toLowerCase() + ".html", html, "text/html");
      btn.textContent = "Export HTML";
    }).catch(function () {
      var tok = window.UIThemes.tokensToCss(state.tokens, UI.accentFor(state.data.now.seed, state), ":root");
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + UI.esc(state.meta.name) + '</title><style>' + tok + (window.UIComponentCss || "") + 'html,body{height:100%;margin:0;background:var(--bg)}</style></head><body>' + ($("#canvas .u-shell") ? $("#canvas .u-shell").outerHTML : "") + '</body></html>';
      download((state.meta.name || "ui").replace(/\s+/g, "-").toLowerCase() + ".html", html, "text/html");
      btn.textContent = "Export HTML";
      alert("Exported a static snapshot. Run ./serve.sh and open via http://localhost:5173 for full animated exports.");
    });
  });

  $("#btnReset").addEventListener("click", function () { if (confirm("Reset to the default composition?")) { state = defaultState(); save(); syncTopbar(); applyZoom(); renderCanvas(); renderInspector(); } });
  $("#fileInput").addEventListener("change", function () {
    var f = this.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function () { try { var s = JSON.parse(r.result); if (!s.blocks) throw 0; state = s; save(); syncTopbar(); applyZoom(); renderCanvas(); renderInspector(); closeModal(); } catch (e) { alert("Invalid studio JSON"); } };
    r.readAsText(f); this.value = "";
  });

  function syncTopbar() {
    $("#uiName").value = state.meta.name || "Untitled UI";
    $$("#accentMode button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-val") === state.accent.mode); });
    $("#laySidebar").checked = !!state.layout.sidebar; $("#layTopbar").checked = !!state.layout.topbar; $("#layPlayer").checked = !!state.layout.playerbar;
  }

  /* ---------------- keyboard ---------------- */
  document.addEventListener("keydown", function (e) {
    if (e.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { if (!(e.ctrlKey && e.key.toLowerCase() === "z")) return; }
    var mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    else if (mod && k === "y") { e.preventDefault(); redo(); }
    else if (mod && k === "d") { e.preventDefault(); if (state.selected) blockAction("dup"); }
    else if (e.key === "Delete" || e.key === "Backspace") { if (state.selected) { e.preventDefault(); blockAction("del"); } }
    else if (e.key === "Escape") { state.selected = null; applySelection(); renderInspector(); }
  });

  /* ---------------- init ---------------- */
  buildLayoutSelect();
  pushHistory();
  $("#btnUndo").addEventListener("click", undo);
  $("#btnRedo").addEventListener("click", redo);
  renderPalette("");
  syncTopbar();
  applyZoom();
  renderCanvas();
  renderInspector();
})();
