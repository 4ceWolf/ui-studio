#!/usr/bin/env node
/* gen-designs.js — emits standalone, self-contained design mockups from the
   UI Studio runtime (themes + core + component css + blocks), one per theme.
   Usage:  node tools/gen-designs.js [outDir]   (default ../designs) */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const outDir = path.resolve(process.argv[2] || path.join(root, "..", "designs"));
const src = (f) => fs.readFileSync(path.join(root, f), "utf8");

/* --- load the runtime into a shared sandbox (no DOM needed at load) --- */
const sandbox = {
  console,
  performance: { now: () => 0 },
  requestAnimationFrame: () => {},
  document: { createElement: () => ({ getContext: () => null, style: {}, appendChild() {}, addEventListener() {} }), querySelector: () => null, head: { appendChild() {} } }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
["js/themes.js", "js/core.js", "js/component-css.js", "js/blocks.js"].forEach((f) => vm.runInContext(src(f), sandbox, { filename: f }));

const UI = sandbox.UI, UIThemes = sandbox.UIThemes;
const clone = (o) => JSON.parse(JSON.stringify(o));
let idc = 0;
const blk = (type, span, props) => ({ id: "b" + (++idc), type, span: span || 12, props: Object.assign({}, clone(UI.blocks[type].defaults), props || {}), style: {} });

/* --- compositions --- */
const C = {
  hero: () => [blk("page-header", 12, { eyebrow: "Now Playing", title: "Stay with the sound." }), blk("hero", 8, { depth: true, shape: "orb", count: 2 }), blk("up-next", 4)],
  depthOrb: () => [blk("page-header", 12, { eyebrow: "Depth", title: "Objects in front." }), blk("now-playing", 12, { shape: "orb", count: 2 }), blk("waveform", 12)],
  depthBlob: () => [blk("page-header", 12, { eyebrow: "Depth", title: "The quiet loud." }), blk("now-playing", 12, { shape: "blob", count: 3, lyrics: "center" }), blk("spectrum", 12)],
  depthVinyl: () => [blk("page-header", 12, { eyebrow: "Depth", title: "Spin it." }), blk("now-playing", 12, { shape: "vinyl", count: 1, lyrics: "right" }), blk("vumeters", 12)],
  depthMixed: () => [blk("page-header", 12, { eyebrow: "Depth", title: "Layered." }), blk("now-playing", 12, { shape: "mixed", count: 3 }), blk("equalizer", 12)],
  mashSoft: () => [blk("page-header", 12, { eyebrow: "Dashboard", title: "Soft everything." }), blk("soft-controls", 12), blk("progress-dock", 12), blk("stat-cards", 12), blk("circular-gauge", 5), blk("radial-ticks", 7, { percent: 20 }), blk("tx-list", 12)],
  mashHud: () => [blk("page-header", 12, { eyebrow: "Signal", title: "Ribbons in the dark." }), blk("hero", 12, { depth: true, shape: "blob", count: 2, height: 360 }), blk("ribbons", 7), blk("node-net", 5), blk("progress-dock", 12), blk("candles", 12)],
  mashWove: () => [blk("page-header", 12, { eyebrow: "WOVE", title: "Numbers on an arc." }), blk("arc-index", 12, { active: 3 }), blk("progress-dock", 12), blk("years", 12), blk("track-list", 12, { title: "Selected", count: 5 }), blk("album-grid", 12, { title: "Records", count: 4 })],
  mashCrypto: () => [blk("page-header", 12, { eyebrow: "Library", title: "Your data, traded." }), blk("sparkline-stats", 12), blk("circular-gauge", 5), blk("candles", 7), blk("tx-list", 12), blk("progress-dock", 12)],
  signature: () => [
    blk("page-header", 12, { eyebrow: "Now Playing", title: "Stay with the sound." }),
    blk("hero", 8, { depth: true, shape: "blob", count: 2, height: 420, badges: "FLAC, 24-bit, 96 kHz, Lossless" }),
    blk("up-next", 4),
    blk("progress-dock", 12),
    blk("sparkline-stats", 7),
    blk("circular-gauge", 5),
    blk("track-list", 12, { title: "For this hour", sub: "Selections shaped by your library", count: 6 })
  ],
  browse: () => [blk("search-header", 12), blk("chip-row", 12), blk("album-grid", 12, { title: "Recently added", sub: "Fresh arrivals in your library", count: 4 }), blk("mood-cards", 12), blk("track-list", 12, { title: "For this hour", sub: "Selections shaped by your library", count: 6 })],
  stats: () => [blk("page-header", 12, { eyebrow: "Stats", title: "Your listening, in detail." }), blk("stat-cards", 12), blk("bar-chart", 7), blk("genre-mix", 5), blk("heatmap", 7), blk("radial-rings", 5), blk("line-chart", 12), blk("data-table", 12, { title: "Top tracks", count: 5 })],
  immersive: () => [blk("now-playing", 12, { title: "Red Thread", artist: "Mira Vale", lyrics: "left" }), blk("waveform", 8), blk("vumeters", 4), blk("spectrum", 12), blk("knobs", 6), blk("processing-chain", 6)],
  signal: () => [blk("page-header", 12, { eyebrow: "Signal", title: "Every stage, visible." }), blk("spectrum", 8), blk("vumeters", 4), blk("waveform", 12), blk("equalizer", 12), blk("knobs", 6), blk("processing-chain", 6)],
  album: () => [blk("album-hero", 12, { title: "Forms of Silence", artist: "Mira Vale", year: 2026, count: 5 }), blk("waveform", 8), blk("signal-tiles", 4), blk("lyrics-panel", 12)],
  dashboard: () => [blk("page-header", 12, { eyebrow: "Dashboard", title: "A live view of your engine." }), blk("hero", 7, { height: 400 }), blk("radial-rings", 5, { title: "Library Pulse" }), blk("sparkline-stats", 12), blk("track-list", 7, { title: "Up next", sub: "Queued", count: 5, numbered: true }), blk("signal-tiles", 5), blk("bar-chart", 6), blk("heatmap", 6)],
  compact: () => [blk("page-header", 12, { eyebrow: "Home", title: "Quick access." }), blk("mini-player", 12), blk("sparkline-stats", 12), blk("session-heatmap", 12, { title: "Session heatmap", sub: "Every cell is a track", cols: 12, rows: 2 }), blk("media-list", 12, { title: "Continue listening", count: 4 })],
  settings: () => [blk("page-header", 12, { eyebrow: "Setup", title: "Make it yours." }), blk("settings-list", 7, { title: "Playback" }), blk("settings-list", 5, { title: "Appearance", items: "Dynamic accent, Motion, Lyrics, Flashbang", on: "1,1,0,1" }), blk("knobs", 12), blk("key-value", 12)],
  article: () => [blk("page-header", 12, { eyebrow: "Feature", title: "The quiet loud." }), blk("quote", 12), blk("text-block", 12, { title: "On ambient music", body: "The best ambient music rewards patience. It asks you to stop waiting for the drop and start noticing the room." }), blk("callout", 12), blk("divider", 12), blk("media-list", 12, { title: "Listen next", count: 4 })]
};

/* --- theme + composition pairings --- */
const DESIGNS = [
  ["hero-lovable", "lovable-red", "hero", "Lovable · Editorial Red"],
  ["browse-brutalist", "brutalist", "browse", "Brutalist Paper"],
  ["stats-blueprint", "blueprint", "stats", "Blueprint"],
  ["immersive-cyber", "cyber", "immersive", "Cyber Neon"],
  ["signal-terminal", "terminal", "signal", "Terminal Green"],
  ["album-echodark", "echo-dark", "album", "Echo · Dark Glass"],
  ["dashboard-sunset", "sunset", "dashboard", "Sunset Neon"],
  ["compact-mono", "mono", "compact", "Mono Slate"],
  ["settings-highcontrast", "high-contrast", "settings", "High Contrast"],
  ["article-paper", "paper", "article", "Paper Light"],
  ["depth-orb", "echo-dark", "depthOrb", "Depth · Orb"],
  ["depth-blob", "sunset", "depthBlob", "Depth · Blob"],
  ["depth-vinyl", "terminal", "depthVinyl", "Depth · Vinyl"],
  ["depth-mixed", "blueprint", "depthMixed", "Depth · Mixed"],
  ["immersive-neon", "neon", "immersive", "Neon Dual"],
  ["immersive-neon-vinyl", "neon", "depthVinyl", "Neon · Vinyl"],
  ["immersive-neon-mixed", "neon", "depthMixed", "Neon · Mixed"],
  ["mashup-soft", "soft", "mashSoft", "Mashup · Soft UI"],
  ["mashup-hud", "hud", "mashHud", "Mashup · Glass HUD"],
  ["mashup-wove", "wove", "mashWove", "Mashup · WOVE"],
  ["mashup-crypto", "light", "mashCrypto", "Mashup · Crypto", "soft"],
  ["signature", "signature", "signature", "Signature", "hud"]
];

const themesSrc = src("js/themes.js"), coreSrc = src("js/core.js"), cssSrc = src("js/component-css.js"), blocksSrc = src("js/blocks.js");

function build(file, themeId, comp, title, skinOverride) {
  const p = UIThemes.presets[themeId];
  const state = { theme: themeId, skin: skinOverride || (themeId === "neon" ? "cyber" : themeId), tokens: clone(p.tokens), accent: clone(p.accent), layout: { sidebar: true, topbar: false, playerbar: true }, data: clone(UI.data), blocks: C[comp]() };
  const tok = UIThemes.tokensToCss(state.tokens, UI.accentFor(state.data.now.seed, state), ".export-root");
  const bootstrap = `(function(){var s=document.createElement("style");s.textContent=window.UIComponentCss||"";document.head.appendChild(s);var st=${JSON.stringify(state).replace(/</g, "\\u003c")};UI.render(st,document.getElementById("export-root"));})();`;
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — Echo design</title>
<style>
${tok}html,body{height:100%;margin:0;background:var(--bg);color:var(--text);font-family:var(--font)}
.export-root{height:100vh;overflow:auto}
</style></head>
<body><div id="export-root" class="export-root"></div>
<script>${themesSrc}<\/script>
<script>${coreSrc}<\/script>
<script>${cssSrc}<\/script>
<script>${blocksSrc}<\/script>
<script>${bootstrap}<\/script>
</body></html>`;
  fs.writeFileSync(path.join(outDir, file + ".html"), html);
  return file + ".html";
}

fs.mkdirSync(outDir, { recursive: true });
const manifest = DESIGNS.map(([file, theme, comp, title, skin]) => {
  const out = build(file, theme, comp, title, skin);
  console.log("wrote", out);
  return { file: out, title, theme, accent: UI.accentFor(UI.data.now.seed, { accent: UIThemes.presets[theme].accent }).css, bg: UIThemes.presets[theme].tokens.bg, panel: UIThemes.presets[theme].tokens.panel, text: UIThemes.presets[theme].tokens.text };
});
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("wrote manifest.json (" + manifest.length + " designs) → " + outDir);
