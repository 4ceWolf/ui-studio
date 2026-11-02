# UI Studio

A local, no-build composer for designing music-app UIs — block palette, live canvas, theming with **dynamic / custom / fixed** accent, per-block styling, a structured data editor, projects, and **single-file HTML export**.

## Launch

```bash
# UI Studio (the editor)
cd ~/Projects/ui-studio && ./serve.sh          # → http://localhost:5173

# Design Gallery (preview selector for every generated design + the editor)
cd ~/Projects/designs && ./serve.sh            # → http://localhost:5180/designs/

# Or just open a file directly (everything works except animated HTML export)
xdg-open ~/Projects/ui-studio/index.html
```

`serve.sh` matters because **Export HTML** inlines the runtime via `fetch`, and the gallery previews designs by relative path.

## Regenerate the design gallery

```bash
cd ~/Projects/ui-studio
node tools/gen-designs.js            # writes ~/Projects/designs/*.html + manifest.json
node tools/gen-designs.js /some/dir  # custom output dir
```

Emits 10 standalone, animated, self-contained designs (one per theme × composition).

## Editing the app

```
index.html            editor shell
css/app.css           editor chrome only (not exported)
js/themes.js          theme presets + token → CSS
js/core.js            data, art, accent, charts, block registry, render/mount   ← shared with exports
js/component-css.js   canvas component styles (window.UIComponentCss)            ← shared with exports
js/blocks.js          the block library (~43 blocks)                             ← shared with exports
js/studio.js          editor logic (not exported)
tools/gen-designs.js  standalone design generator
vendor/Sortable.min.js
```

The four "shared" files are exactly what gets inlined into an exported mockup, so what you see is what ships.

## Depth occlusion (Now Playing / Hero)

The `now-playing` and `hero` blocks can cut the album art into **foreground objects** that sit above the title/lyrics, so the text passes *behind* them (z-index 3 vs 2) — a real layered occlusion, not a fake.

- Toggle **Depth occlusion** in the inspector; pick **shape** (`orb`, `blob`, `slab`, `star`, `diamond`, `vinyl`, `ring`, `mixed`) and **object count** (1–3).
- The objects are **static** — they do **not** follow the cursor. There's an optional autonomous drift (`UI.bindDepth(el, { motion: true })`) if you ever want motion.
- Implementation lives in `js/core.js` (`UI.depthObjects`, `UI.applyDepthMasks`, `UI.bindDepth`) and `js/component-css.js` (`.u-np-depth` / `.u-np-depthobj`).

## Editor cheat-sheet

- **Add**: click a palette block, or drag it onto the canvas.
- **Reorder**: drag blocks. **Select**: click. **Inline edit**: double-click a heading/title.
- **Shortcuts**: `Ctrl+Z` / `Ctrl+Shift+Z` undo-redo, `Ctrl+D` duplicate, `Delete` remove, `Esc` deselect.
- **Theme** button: theme gallery, accent hue/sat/light, skin (layout language), font, save custom theme.
- **Inspector**: block width, padding, surface, align, hide-on-device, block fields, and the Data editor (Now / Tracks / Albums / Moods / Stats).
- **Projects**: New / Save / Duplicate / Import / Export JSON.
- **Export HTML**: one self-contained animated file.
