/* UI Studio — canvas component styles. Shared by editor + exported mockups.
   Everything is scoped under .u-shell so it can't leak into the editor chrome. */
window.UIComponentCss = `
.u-shell{ display:flex; height:100%; min-height:100%; background:var(--bg); color:var(--text);
  font-family:var(--font); font-size:14px; letter-spacing:.1px; -webkit-font-smoothing:antialiased; }
.u-shell *{ box-sizing:border-box; }
.u-shell button{ font:inherit; color:inherit; background:none; border:none; cursor:pointer; }
.u-shell input{ font:inherit; color:inherit; }

/* sidebar */
.u-side{ width:96px; flex:0 0 96px; display:flex; flex-direction:column; align-items:center; gap:8px;
  padding:20px 0 16px; border-right:1px solid var(--line); background:linear-gradient(180deg,var(--bg2),var(--bg)); }
.u-brand{ width:40px; height:40px; border-radius:12px; display:grid; place-items:center; margin-bottom:22px;
  box-shadow:var(--hl2),inset 0 -2px 6px rgb(0 0 0/.35),0 8px 20px var(--accent-glow); }
.u-brand svg{ width:22px; height:22px; }
.u-nav{ display:flex; flex-direction:column; gap:10px; align-items:center; width:100%; }
.u-nav button{ width:50px; height:50px; border-radius:14px; position:relative; display:grid; place-items:center; color:var(--muted2); transition:.2s var(--ease,cubic-bezier(.22,.61,.36,1)); }
.u-nav button:hover{ color:var(--text); background:rgb(255 255 255/.05); }
.u-nav button.on{ color:var(--text); background:rgb(255 255 255/.07); }
.u-nav button.on .u-navdot{ background:var(--accent); box-shadow:0 0 12px var(--accent); }
.u-nav button.on::before{ content:""; position:absolute; left:-23px; top:50%; transform:translateY(-50%); width:3px; height:22px; border-radius:3px; background:var(--accent); box-shadow:0 0 12px var(--accent); }
.u-navdot{ width:16px; height:16px; border-radius:5px; border:2px solid currentColor; }
.u-sidenow{ margin-top:auto; display:flex; flex-direction:column; align-items:center; gap:8px; }
.u-sidenow .u-wf{ display:flex; align-items:flex-end; gap:2px; height:24px; }
.u-sidenow .u-wf i{ width:2.5px; border-radius:2px; }
.u-sidenow em{ font-style:normal; font-size:9px; letter-spacing:.5px; color:var(--muted); }

/* main */
.u-main{ flex:1; min-width:0; display:flex; flex-direction:column; }
.u-top{ display:flex; align-items:center; gap:14px; padding:14px 26px; border-bottom:1px solid var(--line); }
.u-search{ flex:1; max-width:520px; display:flex; align-items:center; gap:10px; padding:9px 14px; border-radius:12px; background:var(--panel); border:1px solid var(--line); }
.u-search svg{ width:16px; height:16px; color:var(--muted2); }
.u-search input{ flex:1; background:none; border:none; outline:none; min-width:0; }
.u-nowchip{ margin-left:auto; display:flex; align-items:center; gap:10px; padding:7px 12px 7px 8px; border-radius:12px; background:var(--panel); border:1px solid var(--line); }
.u-nowchip b{ display:block; font-size:12px; } .u-nowchip i{ display:block; font-style:normal; font-size:10.5px; color:var(--muted); }
.u-content{ flex:1; min-height:0; overflow:auto; padding:28px 32px 32px; display:grid; grid-template-columns:repeat(12,1fr); gap:var(--gap); align-items:start; }
.u-block{ min-width:0; }
.u-thumb{ width:34px; height:34px; border-radius:9px; background-size:cover; background-position:center; flex:0 0 auto; box-shadow:inset 0 0 0 1px rgb(255 255 255/.06); }
.u-thumb.lg{ width:48px; height:48px; border-radius:10px; }

/* player bar */
.u-player{ flex:0 0 auto; height:80px; display:flex; align-items:center; gap:18px; padding:0 24px; border-top:1px solid var(--line); background:linear-gradient(180deg,var(--bg2),var(--bg)); }
.u-pbleft{ display:flex; align-items:center; gap:12px; width:240px; flex:0 0 auto; min-width:0; }
.u-pbleft b{ display:block; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-pbleft i{ display:block; font-style:normal; font-size:11.5px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-pbcenter{ flex:1; display:flex; align-items:center; justify-content:center; gap:16px; }
.u-pbtn{ width:40px; height:40px; border-radius:50%; display:grid; place-items:center; color:var(--muted); }
.u-pbtn:hover{ color:var(--text); background:rgb(255 255 255/.06); }
.u-pbtn svg{ width:18px; height:18px; }
.u-ring{ width:64px; height:64px; flex:0 0 auto; filter:drop-shadow(0 6px 16px rgb(0 0 0/.5)); }
.u-pbright{ width:240px; flex:0 0 auto; display:flex; flex-direction:column; gap:6px; }
.u-vu{ display:flex; align-items:center; gap:8px; }
.u-vu span{ width:9px; font-size:9px; color:var(--muted2); }
.u-meter{ flex:1; height:7px; border-radius:5px; background:var(--well); box-shadow:var(--well-in); overflow:hidden; }
.u-meter i{ display:block; height:100%; border-radius:5px; background:linear-gradient(90deg,rgb(var(--accent-rgb)/.8),hsl(from var(--accent) h s 70%)); box-shadow:0 0 10px var(--accent-glow); }

/* generic panel + text */
.u-panel{ border-radius:var(--r); background:var(--panel); border:1px solid var(--line); padding:20px;
  box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-eyebrow{ font-size:11px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:var(--accent); }
.u-h1{ margin:8px 0 0; font-size:44px; font-weight:800; letter-spacing:-1.3px; line-height:1.03; }
.u-h2{ margin:0; font-size:22px; font-weight:750; letter-spacing:-.4px; }
.u-sub{ margin-top:3px; font-size:13px; color:var(--muted); }
.u-label{ font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted2); }
.u-badge{ display:inline-flex; align-items:center; padding:3px 9px; border-radius:7px; font-size:10px; letter-spacing:.4px;
  background:rgb(255 255 255/.05); border:1px solid var(--line); color:var(--muted); }
.u-badge.acc{ background:var(--accent-soft); border-color:var(--accent-line); color:var(--text); }

/* hero */
.u-hero{ position:relative; border-radius:var(--r); overflow:hidden; min-height:420px; background:#080808; border:1px solid var(--line);
  box-shadow:var(--hl),var(--sh-amb),var(--sh-far); }
.u-hero-art{ position:absolute; inset:0; background-size:cover; background-position:center; transform:scale(1.03); transition:transform 6s cubic-bezier(.22,.61,.36,1); }
.u-hero:hover .u-hero-art{ transform:scale(1.08); }
.u-hero-scrim{ position:absolute; inset:0; background:linear-gradient(90deg,rgb(6 6 6/.8),rgb(6 6 6/.3) 48%,transparent 72%),linear-gradient(0deg,rgb(6 6 6/.9),transparent 48%); }
.u-hero-body{ position:relative; z-index:2; height:100%; min-height:420px; display:flex; flex-direction:column; justify-content:flex-end; padding:34px 38px 32px; }
.u-hero-now{ display:flex; align-items:center; gap:10px; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#d9d9dc; margin-bottom:12px; }
.u-hero-now .u-wf{ display:flex; align-items:flex-end; gap:2.5px; height:18px; }
.u-hero-now .u-wf i{ width:3px; border-radius:2px; }
.u-hero-title{ margin:0; font-size:60px; font-weight:800; letter-spacing:-2.2px; line-height:1; color:#fff; text-shadow:0 4px 30px rgb(0 0 0/.7); }
.u-hero-artist{ margin-top:10px; font-size:19px; color:#bcbcc1; }
.u-progress{ margin-top:22px; }
.u-progress .u-bar{ position:relative; height:4px; border-radius:4px; background:rgb(255 255 255/.16); }
.u-progress .u-bar i{ position:absolute; inset:0 auto 0 0; border-radius:4px; background:var(--accent); box-shadow:0 0 12px var(--accent-glow); }
.u-progress .u-knob{ position:absolute; top:50%; width:13px; height:13px; border-radius:50%; background:var(--accent); transform:translate(-50%,-50%); box-shadow:0 0 0 4px var(--accent-soft),0 0 12px var(--accent-glow); }
.u-progress .u-times{ display:flex; justify-content:space-between; margin-top:9px; font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; }
.u-heart{ position:absolute; right:34px; bottom:56px; width:44px; height:44px; border-radius:50%; display:grid; place-items:center; color:var(--accent); background:var(--accent-soft); border:1px solid var(--accent-line); }
.u-heart svg{ width:19px; height:19px; }
.u-hero-badges{ display:flex; gap:6px; flex-wrap:wrap; margin-top:14px; }
/* overlay text sits on artwork — always light, regardless of theme */
.u-hero-badges .u-badge{ background:rgb(255 255 255/.13); border-color:rgb(255 255 255/.24); color:#fff; }
.u-hero-badges .u-badge.acc{ background:var(--accent); border-color:transparent; color:#0b0b14; }
.u-hero .u-progress .u-times, .u-np .u-progress .u-times{ color:rgb(255 255 255/.72); }
.u-np .u-sub{ color:rgb(255 255 255/.6); }

/* up next / lists */
.u-unrow{ display:flex; align-items:center; gap:13px; padding:7px 0; }
.u-unrow .u-art{ width:44px; height:44px; border-radius:8px; background-size:cover; flex:0 0 auto; box-shadow:inset 0 0 0 1px rgb(255 255 255/.06); }
.u-unrow .u-meta{ min-width:0; flex:1; }
.u-unrow .u-meta b{ display:block; font-size:14px; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-unrow .u-meta i{ display:block; font-style:normal; font-size:12px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-dur{ font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; flex:0 0 auto; }
.u-divider{ height:1px; background:var(--line); margin:20px 0; }
.u-tiles{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.u-tile{ background:var(--panel2); border:1px solid var(--line); border-radius:11px; padding:13px 15px; }
.u-tile b{ display:block; font-size:18px; font-weight:700; letter-spacing:-.3px; }
.u-tile span{ display:block; margin-top:3px; font-size:11.5px; color:var(--muted); }

/* stat cards */
.u-stats{ display:grid; grid-template-columns:repeat(3,1fr); gap:var(--gap); }
.u-stat{ border-radius:var(--r); background:var(--panel); border:1px solid var(--line); padding:20px; box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-stat .u-sic{ width:30px; height:30px; border-radius:9px; display:grid; place-items:center; color:var(--accent); background:var(--accent-soft); margin-bottom:14px; }
.u-stat .u-sic svg{ width:16px; height:16px; }
.u-stat b{ display:block; font-size:30px; font-weight:800; letter-spacing:-.8px; }
.u-stat b small{ font-size:15px; font-weight:650; color:var(--muted); margin-left:3px; }
.u-stat .u-slabel{ margin-top:5px; font-size:12.5px; color:var(--muted); }
.u-stat .u-sdelta{ margin-top:10px; font-size:11.5px; color:var(--accent); }

/* charts */
.u-chart{ width:100%; display:block; }
.u-card{ border-radius:var(--r); background:var(--panel); border:1px solid var(--line); padding:20px; box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-cardhead{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
.u-grid2{ display:grid; grid-template-columns:1.3fr 1fr; gap:var(--gap); }
.u-barchart{ display:flex; flex-direction:column; gap:10px; }
.u-bc{ display:flex; align-items:center; gap:10px; }
.u-bc .u-name{ width:110px; font-size:12.5px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-bc .u-track{ flex:1; height:9px; border-radius:6px; background:var(--well); box-shadow:var(--well-in); overflow:hidden; }
.u-bc .u-track i{ display:block; height:100%; border-radius:6px; background:var(--accent); box-shadow:0 0 10px var(--accent-glow); }
.u-bc .u-val{ width:40px; text-align:right; font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; }
.u-legend{ display:flex; gap:12px; flex-wrap:wrap; margin-top:12px; font-size:11px; color:var(--muted); }
.u-legend b{ display:inline-block; width:9px; height:9px; border-radius:3px; margin-right:5px; vertical-align:middle; }
.u-heat{ width:100%; display:block; border-radius:10px; }
.u-rings{ display:flex; align-items:center; gap:20px; }
.u-rings .u-rclegend{ display:flex; flex-direction:column; gap:10px; }
.u-ri{ display:flex; align-items:center; gap:8px; font-size:12.5px; }
.u-ri .u-sw{ width:10px; height:10px; border-radius:3px; } .u-ri .u-rv{ margin-left:auto; color:var(--text); }

/* track list */
.u-list{ display:flex; flex-direction:column; }
.u-row{ display:flex; align-items:center; gap:14px; padding:12px 6px; border-bottom:1px solid var(--line); }
.u-row:last-child{ border-bottom:none; }
.u-row .u-idx{ width:26px; font-size:12px; color:var(--muted2); font-variant-numeric:tabular-nums; }
.u-row .u-art{ width:44px; height:44px; border-radius:8px; background-size:cover; flex:0 0 auto; }
.u-row .u-meta{ min-width:0; flex:1; }
.u-row .u-meta b{ display:block; font-size:14px; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-row .u-meta i{ display:block; font-style:normal; font-size:12px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-row .u-plays{ font-size:12px; color:var(--muted); }

/* albums + moods */
.u-albums{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:var(--gap); }
.u-album .u-cover{ width:100%; aspect-ratio:1; border-radius:10px; background-size:cover; margin-bottom:10px; box-shadow:inset 0 -12px 26px rgb(0 0 0/.5),var(--sh-key); }
.u-album b{ display:block; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-album span{ display:block; font-size:11.5px; color:var(--muted); }
.u-moods{ display:grid; grid-template-columns:repeat(4,1fr); gap:var(--gap); }
.u-mood{ border-radius:var(--r); background:var(--panel); border:1px solid var(--line); padding:18px; box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-mood b{ display:block; font-size:15px; }
.u-mood span{ display:block; margin-top:6px; font-size:12px; color:var(--muted); }
.u-mood .u-dot{ float:right; width:11px; height:11px; border-radius:50%; margin-top:4px; }

/* signal blocks */
.u-vus{ display:flex; flex-direction:column; gap:12px; }
.u-knobs{ display:flex; gap:26px; justify-content:center; padding:10px 0; flex-wrap:wrap; }
.u-knob{ width:64px; height:64px; border-radius:50%; position:relative; cursor:ns-resize; flex:0 0 auto;
  background:radial-gradient(circle at 34% 28%,#2c2c42,#0f0f18 72%);
  box-shadow:var(--hl2),inset 0 -7px 14px rgb(0 0 0/.75),0 7px 18px rgb(0 0 0/.6); }
.u-knob::after{ content:""; position:absolute; left:50%; top:10px; width:3px; height:16px; border-radius:2px; transform-origin:50% 22px;
  transform:translateX(-50%) rotate(var(--rot,-135deg)); background:linear-gradient(180deg,#fff,var(--accent)); box-shadow:0 0 9px var(--accent-glow); }
.u-knob.off{ filter:saturate(.25) brightness(.7); }
.u-knob .u-kl{ position:absolute; left:50%; bottom:-20px; transform:translateX(-50%); font-size:10px; color:var(--muted); white-space:nowrap; }
.u-chain{ display:flex; flex-direction:column; gap:8px; }
.u-stage{ display:flex; align-items:center; gap:11px; padding:10px 12px; border-radius:12px; background:var(--panel2); border:1px solid var(--line); box-shadow:var(--hl); }
.u-stage.on{ border-color:var(--accent-line); box-shadow:var(--hl),0 0 16px var(--accent-soft); }
.u-stage .u-sdot{ width:8px; height:8px; border-radius:50%; background:var(--muted2); }
.u-stage.on .u-sdot{ background:var(--accent); box-shadow:0 0 12px var(--accent); }
.u-stage .u-sname{ flex:1; font-size:12.5px; }
.u-stage .u-sstate{ font-size:9px; letter-spacing:.8px; text-transform:uppercase; color:var(--muted2); }

/* now playing */
.u-np{ position:relative; border-radius:var(--r); overflow:hidden; min-height:540px; background:#050508; border:1px solid var(--line); box-shadow:var(--sh-amb),var(--sh-far); }
.u-np-art{ position:absolute; inset:0; background-size:cover; background-position:center; filter:brightness(.72); }
.u-np-scrim{ position:absolute; inset:0; background:linear-gradient(0deg,rgb(4 4 6/.85),transparent 55%); }
.u-np-body{ position:relative; z-index:2; height:100%; min-height:540px; display:flex; flex-direction:column; justify-content:flex-end; padding:34px 40px; }
.u-np-lyrics{ position:absolute; z-index:2; left:40px; top:22%; width:44%; display:flex; flex-direction:column; gap:8px; max-height:42%; overflow:hidden; -webkit-mask-image:linear-gradient(180deg,#000 72%,transparent); mask-image:linear-gradient(180deg,#000 72%,transparent); }
.u-np-lyrics .u-line{ font-size:20px; font-weight:600; color:rgb(255 255 255/.34); }
.u-np-lyrics .u-line.cur{ color:#fff; }


/* ============ per-theme skins: structural, not just recolour ============ */

/* Brutalist — hard offsets, heavy borders, uppercase, zero radius */
.u-shell[data-skin="brutalist"] .u-panel,
.u-shell[data-skin="brutalist"] .u-card,
.u-shell[data-skin="brutalist"] .u-stat,
.u-shell[data-skin="brutalist"] .u-mood,
.u-shell[data-skin="brutalist"] .u-tile{ border:2px solid #111; border-radius:0; box-shadow:5px 5px 0 #111; background:#fbfaf6; }
.u-shell[data-skin="brutalist"] .u-hero{ border:3px solid #111; border-radius:0; box-shadow:8px 8px 0 #111; }
.u-shell[data-skin="brutalist"] .u-h1,
.u-shell[data-skin="brutalist"] .u-h2,
.u-shell[data-skin="brutalist"] .u-hero-title{ text-transform:uppercase; letter-spacing:-.5px; font-weight:900; }
.u-shell[data-skin="brutalist"] .u-eyebrow,
.u-shell[data-skin="brutalist"] .u-label{ background:#111; color:#fff; padding:3px 7px; letter-spacing:1px; }
.u-shell[data-skin="brutalist"] .u-badge{ border:1.5px solid #111; border-radius:0; }
.u-shell[data-skin="brutalist"] .u-side{ border-right:2px solid #111; background:#fbfaf6; }
.u-shell[data-skin="brutalist"] .u-player{ border-top:2px solid #111; background:#fbfaf6; }
.u-shell[data-skin="brutalist"] .u-brand{ border-radius:0; box-shadow:3px 3px 0 #111; }
.u-shell[data-skin="brutalist"] .u-meter{ border:1.5px solid #111; border-radius:0; box-shadow:none; }

/* Terminal — monospace, uppercase, dashed rules, glow, left-bar panels */
.u-shell[data-skin="terminal"] .u-panel,
.u-shell[data-skin="terminal"] .u-card,
.u-shell[data-skin="terminal"] .u-stat,
.u-shell[data-skin="terminal"] .u-mood,
.u-shell[data-skin="terminal"] .u-tile{ border:1px dashed var(--line2); border-radius:0; box-shadow:none; background:transparent; border-left:3px solid var(--accent); }
.u-shell[data-skin="terminal"] .u-h1,
.u-shell[data-skin="terminal"] .u-h2,
.u-shell[data-skin="terminal"] .u-eyebrow,
.u-shell[data-skin="terminal"] .u-label,
.u-shell[data-skin="terminal"] .u-hero-title{ text-transform:uppercase; letter-spacing:1px; }
.u-shell[data-skin="terminal"] .u-h1{ font-size:36px; }
.u-shell[data-skin="terminal"] .u-h1::before,
.u-shell[data-skin="terminal"] .u-hero-title::before{ content:"> "; color:var(--accent); }
.u-shell[data-skin="terminal"] .u-eyebrow{ color:var(--muted); }
.u-shell[data-skin="terminal"] .u-eyebrow::before{ content:"// "; }
.u-shell[data-skin="terminal"] .u-side{ border-right:1px dashed var(--line2); }
.u-shell[data-skin="terminal"] .u-player{ border-top:1px dashed var(--line2); background:transparent; }
.u-shell[data-skin="terminal"] .u-hero{ border:1px dashed var(--line2); box-shadow:none; }
.u-shell[data-skin="terminal"] .u-badge{ border-radius:0; border-style:dashed; }
.u-shell[data-skin="terminal"] .u-brand{ border-radius:0; box-shadow:none; }

/* Blueprint — square, dashed grid, corner ticks, all-caps labels */
.u-shell[data-skin="blueprint"] .u-panel,
.u-shell[data-skin="blueprint"] .u-card,
.u-shell[data-skin="blueprint"] .u-stat,
.u-shell[data-skin="blueprint"] .u-mood,
.u-shell[data-skin="blueprint"] .u-tile{ border:1px dashed var(--line2); border-radius:0; box-shadow:none; background:transparent; }
.u-shell[data-skin="blueprint"] .u-h2,
.u-shell[data-skin="blueprint"] .u-label,
.u-shell[data-skin="blueprint"] .u-eyebrow{ text-transform:uppercase; letter-spacing:2px; }
.u-shell[data-skin="blueprint"] .u-hero{ border:1px solid var(--line2); border-radius:0; }
.u-shell[data-skin="blueprint"] .u-side{ border-right:1px dashed var(--line2); }
.u-shell[data-skin="blueprint"] .u-player{ border-top:1px dashed var(--line2); }
.u-shell[data-skin="blueprint"] .u-badge{ border-radius:0; }
.u-shell[data-skin="blueprint"] .u-content{ background-image:linear-gradient(rgb(120 170 220/.06) 1px,transparent 1px),linear-gradient(90deg,rgb(120 170 220/.06) 1px,transparent 1px); background-size:32px 32px; }
.u-shell[data-skin="blueprint"] .u-brand{ border-radius:0; }

/* Sunset — over-rounded, glow, gradient hairline borders */
.u-shell[data-skin="sunset"] .u-panel,
.u-shell[data-skin="sunset"] .u-card,
.u-shell[data-skin="sunset"] .u-stat,
.u-shell[data-skin="sunset"] .u-mood,
.u-shell[data-skin="sunset"] .u-tile{ border-radius:26px; border:1px solid transparent;
  background:linear-gradient(var(--panel),var(--panel)) padding-box,linear-gradient(135deg,var(--accent),hsl(from var(--accent) h s 80%)) border-box;
  box-shadow:0 18px 44px rgb(0 0 0/.5),0 0 30px var(--accent-soft); }
.u-shell[data-skin="sunset"] .u-hero{ border-radius:30px; }
.u-shell[data-skin="sunset"] .u-h1{ font-weight:800; letter-spacing:-1.6px; }
.u-shell[data-skin="sunset"] .u-h2{ font-size:24px; }
.u-shell[data-skin="sunset"] .u-badge{ border-radius:20px; }
.u-shell[data-skin="sunset"] .u-brand{ border-radius:18px; }
.u-shell[data-skin="sunset"] .u-thumb{ border-radius:14px; }
.u-shell[data-skin="sunset"] .u-tile{ border-radius:20px; }

/* Mono — flat, hairline, no shadows, tiny caps, tight grid */
.u-shell[data-skin="mono"] .u-panel,
.u-shell[data-skin="mono"] .u-card,
.u-shell[data-skin="mono"] .u-stat,
.u-shell[data-skin="mono"] .u-mood,
.u-shell[data-skin="mono"] .u-tile{ border:1px solid var(--line); border-radius:10px; box-shadow:none; background:transparent; }
.u-shell[data-skin="mono"] .u-hero{ box-shadow:none; border-radius:12px; }
.u-shell[data-skin="mono"] .u-h1{ font-size:34px; font-weight:700; letter-spacing:-.8px; }
.u-shell[data-skin="mono"] .u-h2{ font-size:17px; font-weight:650; }
.u-shell[data-skin="mono"] .u-eyebrow,
.u-shell[data-skin="mono"] .u-label{ letter-spacing:1.6px; color:var(--muted); }
.u-shell[data-skin="mono"] .u-badge{ border-radius:5px; }
.u-shell[data-skin="mono"] .u-brand{ border-radius:9px; box-shadow:none; }
.u-shell[data-skin="mono"] .u-meter{ height:5px; }

/* Cyber — neon glow, thin magenta/cyan edges, dark */
.u-shell[data-skin="cyber"] .u-panel,
.u-shell[data-skin="cyber"] .u-card,
.u-shell[data-skin="cyber"] .u-stat,
.u-shell[data-skin="cyber"] .u-mood,
.u-shell[data-skin="cyber"] .u-tile{ border:1px solid var(--accent-line); border-radius:6px; box-shadow:0 0 22px var(--accent-soft),inset 0 0 24px rgb(var(--accent-rgb)/.06); background:var(--panel); }
.u-shell[data-skin="cyber"] .u-h1{ font-size:40px; letter-spacing:-1px; text-shadow:0 0 22px var(--accent-glow); }
.u-shell[data-skin="cyber"] .u-eyebrow{ text-shadow:0 0 10px var(--accent-glow); }
.u-shell[data-skin="cyber"] .u-hero{ border:1px solid var(--accent-line); border-radius:8px; box-shadow:0 0 30px var(--accent-soft); }
.u-shell[data-skin="cyber"] .u-brand{ border-radius:8px; }
.u-shell[data-skin="cyber"] .u-badge{ border-radius:4px; border-color:var(--accent-line); }

/* Paper — soft light, hairline, generous radius */
.u-shell[data-skin="paper"] .u-panel,
.u-shell[data-skin="paper"] .u-card,
.u-shell[data-skin="paper"] .u-stat,
.u-shell[data-skin="paper"] .u-mood,
.u-shell[data-skin="paper"] .u-tile{ border:1px solid var(--line); border-radius:18px; box-shadow:0 12px 30px rgb(30 30 60/.08); background:var(--panel); }
.u-shell[data-skin="paper"] .u-hero{ border-radius:20px; box-shadow:0 20px 50px rgb(30 30 60/.14); }
.u-shell[data-skin="paper"] .u-h1{ font-weight:750; letter-spacing:-1px; }
.u-shell[data-skin="paper"] .u-brand{ border-radius:14px; }

/* High contrast — thick rules, zero radius, maximum legibility */
.u-shell[data-skin="high-contrast"] .u-panel,
.u-shell[data-skin="high-contrast"] .u-card,
.u-shell[data-skin="high-contrast"] .u-stat,
.u-shell[data-skin="high-contrast"] .u-mood,
.u-shell[data-skin="high-contrast"] .u-tile{ border:2px solid #fff; border-radius:0; box-shadow:none; background:#000; }
.u-shell[data-skin="high-contrast"] .u-hero{ border:3px solid #fff; border-radius:0; }
.u-shell[data-skin="high-contrast"] .u-h1,
.u-shell[data-skin="high-contrast"] .u-h2,
.u-shell[data-skin="high-contrast"] .u-hero-title{ font-weight:900; }
.u-shell[data-skin="high-contrast"] .u-eyebrow,
.u-shell[data-skin="high-contrast"] .u-label{ color:#fff; }
.u-shell[data-skin="high-contrast"] .u-side{ border-right:2px solid #fff; }
.u-shell[data-skin="high-contrast"] .u-player{ border-top:2px solid #fff; }
.u-shell[data-skin="high-contrast"] .u-badge{ border:1.5px solid #fff; border-radius:0; color:#fff; }
.u-shell[data-skin="high-contrast"] .u-meter{ border:1px solid #fff; border-radius:0; box-shadow:none; }

/* ============ extra blocks ============ */

/* search header */
.u-searchhead{ display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.u-searchbox{ display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:12px; background:var(--panel); border:1px solid var(--line); min-width:280px; }
.u-searchbox svg{ width:16px; height:16px; color:var(--muted2); flex:0 0 auto; }
.u-searchbox input{ flex:1; background:none; border:none; outline:none; min-width:0; }

/* album hero */
.u-albumhero{ display:flex; gap:26px; align-items:flex-start; }
.u-ahcover{ width:210px; height:210px; flex:0 0 auto; border-radius:var(--r); background-size:cover; background-position:center;
  box-shadow:var(--hl),var(--sh-amb),inset 0 -14px 30px rgb(0 0 0/.5); }
.u-ahbody{ min-width:0; flex:1; }
.u-ahtitle{ margin:6px 0 4px; font-size:40px; font-weight:800; letter-spacing:-1.2px; line-height:1.05; }
.u-playrow{ display:flex; gap:10px; margin-top:16px; align-items:center; }
.u-playbtn{ width:52px; height:52px; border-radius:50%; display:grid; place-items:center; color:#0b0b14; background:var(--accent); box-shadow:0 8px 22px var(--accent-glow); }
.u-playbtn svg{ width:22px; height:22px; }
.u-ghostbtn{ padding:10px 16px; border-radius:11px; border:1px solid var(--line); color:var(--muted); }
@media(max-width:760px){ .u-albumhero{ flex-direction:column; } .u-ahcover{ width:100%; height:auto; aspect-ratio:1; } }

/* session heatmap (album-art cells) */
.u-arthm{ display:grid; grid-template-columns:repeat(12,1fr); gap:6px; }
.u-artcell{ aspect-ratio:1; border-radius:7px; position:relative; overflow:hidden; box-shadow:var(--hl),inset 0 -4px 10px rgb(0 0 0/.5); transition:transform .16s; }
.u-artcell:hover{ transform:translateY(-2px) scale(1.05); z-index:2; }
.u-artcell i{ position:absolute; inset:0; }
.u-artcell b{ position:absolute; left:0; right:0; bottom:0; font-size:8px; font-weight:500; text-align:center; background:rgb(0 0 0/.55); color:#fff; padding:1px 0; }

/* sparkline stat */
.u-spark{ position:absolute; right:12px; bottom:10px; width:84px; height:26px; opacity:.85; }

/* settings list */
.u-setrow{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:13px 2px; border-bottom:1px solid var(--line); }
.u-setrow:last-child{ border-bottom:none; }
.u-setrow .u-sname b{ font-size:13.5px; font-weight:600; display:block; }
.u-setrow .u-sname span{ font-size:11.5px; color:var(--muted); }
.u-toggle{ width:42px; height:24px; border-radius:20px; background:var(--well); box-shadow:var(--well-in); position:relative; flex:0 0 auto; cursor:pointer; }
.u-toggle i{ position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:var(--muted2); transition:.2s cubic-bezier(.22,.61,.36,1); }
.u-toggle.on{ background:var(--accent-soft); box-shadow:inset 0 0 0 1px var(--accent-line); }
.u-toggle.on i{ left:21px; background:var(--accent); box-shadow:0 0 10px var(--accent-glow); }

/* mini player */
.u-mini{ display:flex; align-items:center; gap:16px; padding:14px 18px; border-radius:var(--r); background:var(--panel); border:1px solid var(--line); box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-mini .u-mthumb{ width:52px; height:52px; border-radius:12px; background-size:cover; background-position:center; flex:0 0 auto; box-shadow:inset 0 0 0 1px rgb(255 255 255/.06); }
.u-mini .u-mbody{ min-width:0; flex:1; }
.u-mini .u-mbody b{ display:block; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-mini .u-mbody i{ display:block; font-style:normal; font-size:11.5px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.u-mini .u-mctl{ display:flex; gap:8px; align-items:center; }
.u-mini .u-mctl .u-pbtn{ color:var(--muted); }
.u-mini .u-mprog{ width:120px; height:5px; border-radius:4px; background:var(--well); box-shadow:var(--well-in); overflow:hidden; }
.u-mini .u-mprog i{ display:block; height:100%; background:var(--accent); box-shadow:0 0 8px var(--accent-glow); }

/* ============ per-block style variants ============ */
.u-block[data-pad="8"]{ padding:8px; }
.u-block[data-pad="16"]{ padding:16px; }
.u-block[data-pad="24"]{ padding:24px; }
.u-block[data-tint="soft"]{ background:var(--panel); border:1px solid var(--line); border-radius:var(--r); padding:16px; box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-block[data-tint="well"]{ background:var(--well); border-radius:var(--r); padding:16px; box-shadow:var(--well-in); }
.u-block[data-tint="accent"]{ background:var(--accent-soft); border:1px solid var(--accent-line); border-radius:var(--r); padding:16px; }
.u-block[data-tint="gradient"]{ background:linear-gradient(140deg,var(--accent-soft),transparent 70%); border:1px solid var(--line); border-radius:var(--r); padding:16px; }
.u-block[data-align="center"]{ text-align:center; }
.u-block[data-align="center"] .u-searchhead, .u-block[data-align="center"] .u-cardhead{ justify-content:center; }
.u-block[data-align="right"]{ text-align:right; }
#canvas.view-phone .u-block[data-hide="phone"], #canvas.view-phone .u-block[data-hide="both"],
#canvas.view-tablet .u-block[data-hide="tablet"], #canvas.view-tablet .u-block[data-hide="both"]{ display:none; }
.u-block [data-edit]{ outline:none; }
.u-block [data-edit].editing{ outline:2px dashed var(--accent); outline-offset:3px; border-radius:3px; cursor:text; }

/* ============ added blocks ============ */
.u-tabs{ display:flex; gap:6px; flex-wrap:wrap; }
.u-tab{ padding:8px 14px; border-radius:10px; border:1px solid var(--line); color:var(--muted); font-size:12.5px; }
.u-tab.on{ color:var(--text); background:var(--accent-soft); border-color:var(--accent-line); }
.u-tg{ display:inline-flex; padding:4px; gap:3px; border-radius:12px; background:var(--well); box-shadow:var(--well-in); }
.u-tg button{ padding:7px 13px; border-radius:9px; color:var(--muted); font-size:12px; }
.u-tg button.on{ color:#0b0b14; background:var(--accent); }
.u-callout{ display:flex; gap:12px; padding:16px; border-radius:var(--r); border:1px solid var(--line); background:var(--panel); box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-callout .u-ico{ width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background:var(--accent-soft); color:var(--accent); flex:0 0 auto; }
.u-callout b{ display:block; font-size:13.5px; }
.u-callout p{ margin:3px 0 0; font-size:12.5px; color:var(--muted); line-height:1.55; }
.u-kv{ display:grid; grid-template-columns:auto 1fr; gap:9px 18px; }
.u-kv dt{ color:var(--muted); font-size:12.5px; }
.u-kv dd{ margin:0; text-align:right; font-variant-numeric:tabular-nums; font-size:13px; }
.u-tl{ display:flex; flex-direction:column; }
.u-tlrow{ display:flex; gap:14px; padding:10px 0; position:relative; }
.u-tlrow:not(:last-child)::before{ content:""; position:absolute; left:5px; top:22px; bottom:-6px; width:1px; background:var(--line); }
.u-tlrow .u-tldot{ width:11px; height:11px; border-radius:50%; background:var(--accent); box-shadow:0 0 10px var(--accent-glow); flex:0 0 auto; margin-top:4px; }
.u-tlrow .u-tlbody b{ display:block; font-size:13.5px; }
.u-tlrow .u-tlbody span{ font-size:11.5px; color:var(--muted); }
.u-tlrow .u-tltime{ margin-left:auto; font-size:11.5px; color:var(--muted2); font-variant-numeric:tabular-nums; }
.u-table{ width:100%; border-collapse:collapse; }
.u-table th{ text-align:left; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted2); padding:10px 8px; border-bottom:1px solid var(--line); font-weight:700; }
.u-table td{ padding:12px 8px; border-bottom:1px solid var(--line); font-size:13px; }
.u-table tr:last-child td{ border-bottom:none; }
.u-table td.num{ text-align:right; font-variant-numeric:tabular-nums; }
.u-chips{ display:flex; gap:8px; flex-wrap:wrap; }
.u-chip{ padding:7px 13px; border-radius:20px; border:1px solid var(--line); background:var(--panel); font-size:12px; color:var(--muted); }
.u-chip.on{ color:var(--text); background:var(--accent-soft); border-color:var(--accent-line); }
.u-avatars{ display:flex; }
.u-avatars .u-av{ width:40px; height:40px; border-radius:50%; margin-left:-11px; border:2px solid var(--bg); background-size:cover; box-shadow:var(--sh-key); }
.u-avatars .u-av:first-child{ margin-left:0; }
.u-ringstat{ display:flex; align-items:center; gap:20px; }
.u-ringstat .u-rsval b{ display:block; font-size:30px; font-weight:800; letter-spacing:-.8px; }
.u-ringstat .u-rsval span{ font-size:12px; color:var(--muted); }
.u-lyrics{ display:flex; flex-direction:column; gap:11px; }
.u-lyrics .u-line{ font-size:18px; font-weight:600; color:var(--muted2); transition:.2s; }
.u-lyrics .u-line.cur{ color:var(--text); font-size:21px; }
.u-notif{ display:flex; gap:12px; align-items:flex-start; padding:14px; border-radius:12px; border:1px solid var(--line); background:var(--panel2); }
.u-notif .u-ndot{ width:8px; height:8px; border-radius:50%; background:var(--accent); margin-top:6px; box-shadow:0 0 10px var(--accent-glow); flex:0 0 auto; }
.u-notif b{ display:block; font-size:13px; } .u-notif span{ font-size:12px; color:var(--muted); }
.u-notif time{ margin-left:auto; font-size:11px; color:var(--muted2); }
.u-eqbars{ display:flex; align-items:flex-end; gap:5px; height:64px; }
.u-eqbars i{ flex:1; border-radius:4px; background:linear-gradient(180deg,var(--accent),transparent); box-shadow:0 0 8px var(--accent-glow); transform-origin:bottom; animation:ueq 1.1s ease-in-out infinite; }
@keyframes ueq{ 0%,100%{ transform:scaleY(.45); } 50%{ transform:scaleY(1); } }
.u-quote{ font-size:20px; line-height:1.5; font-weight:500; }
.u-quote cite{ display:block; margin-top:12px; font-size:12px; color:var(--muted); font-style:normal; }
.u-media{ display:flex; gap:14px; align-items:center; padding:12px; border-radius:12px; border:1px solid var(--line); background:var(--panel2); }
.u-media .u-mthumb{ width:48px; height:48px; border-radius:10px; background-size:cover; flex:0 0 auto; }
.u-media .u-mbody{ min-width:0; flex:1; } .u-media .u-mbody b{ display:block; font-size:13.5px; } .u-media .u-mbody i{ font-style:normal; font-size:11.5px; color:var(--muted); }
.u-media .u-mactions{ display:flex; gap:6px; }
.u-hr{ height:1px; background:var(--line); border:none; margin:0; }
.u-statbig{ font-size:44px; font-weight:800; letter-spacing:-1.4px; }
.u-inline{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

/* ============ depth occlusion ============
   Album art cut into foreground shapes that sit ABOVE the title/lyrics
   (z-index 3 vs 2), so text passes behind them. Static — no cursor follow. */
.u-np-depth{ position:absolute; inset:0; z-index:3; pointer-events:none; }
.u-np-depthobj{ position:absolute; inset:-6%; background-size:cover; background-position:center; background-repeat:no-repeat;
  transform:scale(1.06); transform-origin:center; will-change:transform;
  filter:brightness(1.1) saturate(1.12) contrast(1.04) drop-shadow(0 44px 64px rgb(0 0 0/.62)) drop-shadow(0 10px 18px rgb(0 0 0/.45)); }
.u-np-depthobj::after{ content:""; position:absolute; inset:0;
  background:radial-gradient(46% 46% at 30% 22%, rgb(255 255 255/.45), transparent 62%);
  mix-blend-mode:screen; }
/* text layers must sit below the objects */
.u-np-body, .u-np-lyrics, .u-hero-body{ z-index:2; }

/* ============ WILD MASHUP skins ============ */
/* Soft UI / Neumorphic */
.u-shell[data-skin="soft"] .u-panel,
.u-shell[data-skin="soft"] .u-card,
.u-shell[data-skin="soft"] .u-stat,
.u-shell[data-skin="soft"] .u-mood,
.u-shell[data-skin="soft"] .u-tile,
.u-shell[data-skin="soft"] .u-mini{ background:var(--panel); border:none; border-radius:24px;
  box-shadow:9px 9px 20px rgb(163 177 198/.55),-9px -9px 20px rgb(255 255 255/.9); }
.u-shell[data-skin="soft"] .u-hero{ border:none; border-radius:26px; box-shadow:12px 12px 28px rgb(163 177 198/.55),-12px -12px 28px rgb(255 255 255/.9); }
.u-shell[data-skin="soft"] .u-badge{ border:none; border-radius:12px; box-shadow:4px 4px 9px rgb(163 177 198/.5),-4px -4px 9px rgb(255 255 255/.9); background:var(--panel); color:var(--text); }
.u-shell[data-skin="soft"] .u-brand{ border-radius:16px; box-shadow:5px 5px 12px rgb(163 177 198/.6),-5px -5px 12px rgb(255 255 255/.9); }
.u-shell[data-skin="soft"] .u-meter{ box-shadow:inset 3px 3px 6px rgb(163 177 198/.5),inset -3px -3px 6px rgb(255 255 255/.9); background:var(--bg); }
.u-shell[data-skin="soft"] .u-h1{ font-weight:700; letter-spacing:-1px; }
.u-shell[data-skin="soft"] .u-side{ border-right:none; box-shadow:8px 0 22px rgb(163 177 198/.35); }

/* Glass HUD */
.u-shell[data-skin="hud"] .u-panel,
.u-shell[data-skin="hud"] .u-card,
.u-shell[data-skin="hud"] .u-stat,
.u-shell[data-skin="hud"] .u-mood,
.u-shell[data-skin="hud"] .u-tile{ background:linear-gradient(160deg,rgb(24 48 82/.55),rgb(8 16 30/.6)); border:1px solid var(--line2); border-radius:14px;
  -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); box-shadow:0 0 34px rgb(var(--accent-rgb)/.12),inset 0 0 34px rgb(var(--accent-rgb)/.05); }
.u-shell[data-skin="hud"] .u-hero{ border:1px solid var(--line2); box-shadow:0 0 44px rgb(var(--accent-rgb)/.16); }
.u-shell[data-skin="hud"] .u-h1{ font-weight:600; letter-spacing:-.5px; text-shadow:0 0 30px var(--accent-glow); }
.u-shell[data-skin="hud"] .u-eyebrow{ text-shadow:0 0 12px var(--accent-glow); }
.u-shell[data-skin="hud"] .u-badge{ border-color:var(--line2); background:rgb(var(--accent-rgb)/.1); color:var(--text); }
.u-shell[data-skin="hud"] .u-brand{ box-shadow:0 0 26px var(--accent-glow); }

/* WOVE Minimal */
.u-shell[data-skin="wove"] .u-panel,
.u-shell[data-skin="wove"] .u-card,
.u-shell[data-skin="wove"] .u-stat,
.u-shell[data-skin="wove"] .u-mood,
.u-shell[data-skin="wove"] .u-tile{ background:transparent; border:none; border-top:1px solid var(--line); border-radius:0; box-shadow:none; padding-left:0; padding-right:0; }
.u-shell[data-skin="wove"] .u-hero{ border-radius:0; box-shadow:none; }
.u-shell[data-skin="wove"] .u-h1{ font-size:56px; font-weight:800; letter-spacing:-2px; }
.u-shell[data-skin="wove"] .u-h2{ font-size:26px; font-weight:750; letter-spacing:-.6px; }
.u-shell[data-skin="wove"] .u-eyebrow,
.u-shell[data-skin="wove"] .u-label{ letter-spacing:3px; color:var(--muted2); }
.u-shell[data-skin="wove"] .u-side{ border-right:1px solid var(--line); }
.u-shell[data-skin="wove"] .u-brand{ border-radius:0; box-shadow:none; }

/* ============ new blocks ============ */

/* radial tick gauge (the "20% processing" dial) */
.u-ticks{ position:relative; display:inline-grid; place-items:center; }
.u-ticks svg{ display:block; }
.u-ticks .u-tk{ stroke:var(--muted2); opacity:.5; }
.u-ticks .u-tk.on{ stroke:var(--accent); opacity:1; filter:drop-shadow(0 0 4px var(--accent-glow)); }
.u-ticks .u-tk.hot{ stroke:#ff6b5a; opacity:1; filter:drop-shadow(0 0 5px rgb(255 107 90/.7)); }
.u-ticks .u-tkcore{ position:absolute; inset:0; display:grid; place-items:center; text-align:center; align-content:center; }
.u-ticks .u-tkpct{ font-size:46px; font-weight:800; letter-spacing:-1.5px; line-height:1; }
.u-ticks .u-tklbl{ font-size:13px; color:var(--muted); margin-top:4px; }

/* progress dock — replaces the mini player, unlocks the waveform */
.u-dock{ display:flex; align-items:center; gap:24px; padding:16px 24px; border-radius:var(--r); background:var(--panel); border:1px solid var(--line); box-shadow:var(--hl),var(--shade),var(--sh-key); }
.u-dock .u-dticks{ flex:0 0 auto; }
.u-dock .u-dwave{ flex:1; min-width:0; }
.u-dock .u-dunlock{ display:flex; align-items:flex-end; gap:3px; height:66px; }
.u-dock .u-dunlock i{ flex:1; border-radius:3px; background:var(--well); box-shadow:var(--well-in); min-height:4px; transition:background .25s,box-shadow .25s; }
.u-dock .u-dunlock i.on{ background:linear-gradient(180deg,var(--accent),rgb(var(--accent-rgb)/.35)); box-shadow:0 0 9px var(--accent-glow); }
.u-dock .u-dmeta{ display:flex; justify-content:space-between; margin-top:9px; font-size:11px; color:var(--muted2); font-variant-numeric:tabular-nums; }
.u-dock .u-dinfo{ flex:0 0 auto; text-align:right; }
.u-dock .u-dinfo b{ display:block; font-size:15px; } .u-dock .u-dinfo span{ font-size:11px; color:var(--muted); }

/* candlesticks */
.u-candles{ width:100%; display:block; }

/* circular gauge (crypto) */
.u-gauge{ display:flex; align-items:center; gap:20px; }
.u-gauge .u-gval b{ display:block; font-size:34px; font-weight:800; letter-spacing:-1px; }
.u-gauge .u-gval span{ font-size:12px; color:var(--muted); }

/* ribbons (HUD) */
.u-ribbons{ width:100%; display:block; }

/* node network */
.u-nodes{ width:100%; display:block; }

/* WOVE arc index */
.u-arc{ position:relative; display:flex; align-items:center; gap:24px; min-height:180px; }
.u-arc .u-arcbig{ font-size:96px; font-weight:800; letter-spacing:-4px; line-height:.9; }
.u-arc .u-arcmeta b{ display:block; font-size:15px; } .u-arc .u-arcmeta span{ font-size:12.5px; color:var(--muted); max-width:220px; display:block; margin-top:4px; }
.u-arc .u-arcnums{ position:absolute; inset:0; pointer-events:none; }
.u-arc .u-arcnum{ position:absolute; font-size:22px; font-weight:700; color:var(--muted2); opacity:.5; transform:translate(-50%,-50%); }
.u-arc .u-arcnum.on{ color:var(--text); opacity:1; font-size:26px; }

/* soft controls */
.u-softrow{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.u-softbtn{ padding:12px 20px; border-radius:14px; background:var(--panel); color:var(--text); font-size:13px; font-weight:600;
  box-shadow:6px 6px 14px rgb(163 177 198/.55),-6px -6px 14px rgb(255 255 255/.9); }
.u-softbtn.primary{ color:#fff; background:linear-gradient(150deg,var(--accent),rgb(var(--accent-rgb)/.7)); box-shadow:0 8px 20px var(--accent-glow); }
.u-softinput{ padding:12px 16px; border-radius:14px; background:var(--panel); color:var(--text); min-width:200px;
  box-shadow:inset 4px 4px 9px rgb(163 177 198/.55),inset -4px -4px 9px rgb(255 255 255/.9); }
.u-softtoggle{ width:52px; height:30px; border-radius:20px; background:var(--panel); position:relative; box-shadow:inset 3px 3px 7px rgb(163 177 198/.6),inset -3px -3px 7px rgb(255 255 255/.9); cursor:pointer; }
.u-softtoggle i{ position:absolute; top:4px; left:4px; width:22px; height:22px; border-radius:50%; background:var(--panel2); box-shadow:2px 2px 5px rgb(163 177 198/.7); transition:.2s; }
.u-softtoggle.on{ background:linear-gradient(150deg,var(--accent),rgb(var(--accent-rgb)/.7)); }
.u-softtoggle.on i{ left:26px; background:#fff; }

/* transaction list */
.u-tx{ display:flex; align-items:center; gap:13px; padding:12px 4px; border-bottom:1px solid var(--line); }
.u-tx:last-child{ border-bottom:none; }
.u-tx .u-txic{ width:36px; height:36px; border-radius:11px; display:grid; place-items:center; flex:0 0 auto; background:var(--accent-soft); color:var(--accent); }
.u-tx .u-txname{ min-width:0; flex:1; } .u-tx .u-txname b{ display:block; font-size:13.5px; } .u-tx .u-txname span{ font-size:11.5px; color:var(--muted); }
.u-tx .u-txval{ text-align:right; } .u-tx .u-txval b{ display:block; font-size:13.5px; font-variant-numeric:tabular-nums; }
.u-chip.up{ color:#2fbf71; } .u-chip.down{ color:#e05a5a; }
.u-tx .u-delta{ font-size:11.5px; } .u-tx .u-delta.up{ color:#2fbf71; } .u-tx .u-delta.down{ color:#e05a5a; }

/* years timeline */
.u-years{ display:flex; align-items:center; gap:0; position:relative; padding:24px 0; }
.u-years .u-yr{ flex:1; text-align:center; position:relative; font-size:12px; color:var(--muted2); }
.u-years .u-yr::before{ content:""; position:absolute; left:50%; top:-12px; width:11px; height:11px; border-radius:50%; background:var(--panel); border:2px solid var(--line2); transform:translate(-50%,-50%); }
.u-years .u-yr.on{ color:var(--text); font-weight:700; }
.u-years .u-yr.on::before{ background:var(--accent); border-color:var(--accent); box-shadow:0 0 12px var(--accent-glow); }
.u-years::after{ content:""; position:absolute; left:0; right:0; top:12px; height:1px; background:var(--line2); z-index:-1; }

`;
