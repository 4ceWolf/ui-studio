/* UI Studio — theme presets + token → CSS. No build step. */
(function () {
  "use strict";

  var presets = {
    "echo-dark": {
      label: "Echo · Dark Glass",
      accent: { mode: "dynamic", hue: 258, sat: 70, light: 64 },
      tokens: {
        bg: "#07070c", bg2: "#0b0b14", panel: "#12121c", panel2: "#171726", well: "#08080e",
        line: "#22222f", line2: "#31313f", text: "#eef0fa", muted: "#9a9db6", muted2: "#6b6e88",
        radius: 18, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "lovable-red": {
      label: "Lovable · Editorial Red",
      accent: { mode: "fixed", hue: 2, sat: 76, light: 54 },
      tokens: {
        bg: "#0a0a0b", bg2: "#0c0c0d", panel: "#111112", panel2: "#161617", well: "#080808",
        line: "#212124", line2: "#2c2c30", text: "#f4f4f5", muted: "#8b8b90", muted2: "#5e5e63",
        radius: 16, gap: 22, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "oled": {
      label: "OLED Black",
      accent: { mode: "dynamic", hue: 200, sat: 72, light: 60 },
      tokens: {
        bg: "#000000", bg2: "#000000", panel: "#0a0a0d", panel2: "#101015", well: "#000000",
        line: "#1a1a1f", line2: "#26262d", text: "#f2f2f5", muted: "#8a8a95", muted2: "#5c5c66",
        radius: 16, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "light": {
      label: "Light Technical",
      accent: { mode: "dynamic", hue: 220, sat: 68, light: 50 },
      tokens: {
        bg: "#eef0f6", bg2: "#f7f8fc", panel: "#ffffff", panel2: "#ffffff", well: "#e6e8f0",
        line: "#dfe1ea", line2: "#cfd2de", text: "#14162a", muted: "#565a78", muted2: "#83869e",
        radius: 14, gap: 16, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "nord": {
      label: "Nord",
      accent: { mode: "dynamic", hue: 193, sat: 60, light: 62 },
      tokens: {
        bg: "#2e3440", bg2: "#2b303b", panel: "#3b4252", panel2: "#434c5e", well: "#272c36",
        line: "#4c566a", line2: "#5b677e", text: "#eceff4", muted: "#a8b1c2", muted2: "#7c8699",
        radius: 12, gap: 16, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "brutalist": {
      label: "Brutalist Paper",
      accent: { mode: "fixed", hue: 22, sat: 100, light: 50 },
      tokens: {
        bg: "#e9e6dd", bg2: "#efede6", panel: "#fbfaf6", panel2: "#ffffff", well: "#dedbd0",
        line: "#111111", line2: "#111111", text: "#111111", muted: "#4a4a44", muted2: "#6b6b62",
        radius: 2, gap: 18, depth: 0, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "terminal": {
      label: "Terminal Green",
      accent: { mode: "fixed", hue: 130, sat: 72, light: 58 },
      tokens: {
        bg: "#080c08", bg2: "#0a100a", panel: "#0e160e", panel2: "#122012", well: "#060a06",
        line: "#1c2e1c", line2: "#2a442a", text: "#c6f7cd", muted: "#5f8f66", muted2: "#3f5c44",
        radius: 4, gap: 14, depth: 0, font: '"JetBrains Mono","SFMono-Regular",ui-monospace,monospace'
      }
    },
    "blueprint": {
      label: "Blueprint",
      accent: { mode: "custom", hue: 210, sat: 84, light: 60 },
      tokens: {
        bg: "#0c1a2b", bg2: "#0e2038", panel: "#102842", panel2: "#14314f", well: "#091523",
        line: "#1e4066", line2: "#2a5a8a", text: "#d6e9ff", muted: "#7ea6cc", muted2: "#557da3",
        radius: 2, gap: 16, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "sunset": {
      label: "Sunset Neon",
      accent: { mode: "custom", hue: 330, sat: 84, light: 64 },
      tokens: {
        bg: "#170d1f", bg2: "#1d1129", panel: "#241433", panel2: "#2d1a40", well: "#120a19",
        line: "#3a2152", line2: "#4d2c6b", text: "#fdeaf6", muted: "#c093d4", muted2: "#8a669e",
        radius: 22, gap: 18, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "mono": {
      label: "Mono Slate",
      accent: { mode: "fixed", hue: 0, sat: 0, light: 96 },
      tokens: {
        bg: "#111112", bg2: "#141415", panel: "#1a1a1c", panel2: "#202023", well: "#0d0d0e",
        line: "#2a2a2e", line2: "#3a3a40", text: "#ededf0", muted: "#8a8a90", muted2: "#606066",
        radius: 14, gap: 16, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "cyber": {
      label: "Cyber Neon",
      accent: { mode: "custom", hue: 300, sat: 90, light: 62 },
      tokens: {
        bg: "#05040a", bg2: "#080610", panel: "#0c0a16", panel2: "#120e22", well: "#040308",
        line: "#241a44", line2: "#3a2a66", text: "#eae6ff", muted: "#9a8fd0", muted2: "#6a5fa0",
        radius: 6, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "paper": {
      label: "Paper Light",
      accent: { mode: "custom", hue: 245, sat: 66, light: 56 },
      tokens: {
        bg: "#f4f1ea", bg2: "#faf8f3", panel: "#ffffff", panel2: "#ffffff", well: "#ece8de",
        line: "#e4e0d4", line2: "#d3cebf", text: "#1a1a1a", muted: "#6b6b60", muted2: "#96968a",
        radius: 18, gap: 18, depth: 1, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "high-contrast": {
      label: "High Contrast",
      accent: { mode: "fixed", hue: 52, sat: 100, light: 55 },
      tokens: {
        bg: "#000000", bg2: "#000000", panel: "#000000", panel2: "#0a0a0a", well: "#000000",
        line: "#ffffff", line2: "#ffffff", text: "#ffffff", muted: "#c8c8c8", muted2: "#a0a0a0",
        radius: 0, gap: 16, depth: 0, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "neon": {
      label: "Neon Dual",
      accent: { mode: "custom", hue: 186, sat: 95, light: 58 },
      tokens: {
        bg: "#04070a", bg2: "#060b12", panel: "#0a121c", panel2: "#0f1a28", well: "#030608",
        line: "#123044", line2: "#1d4a66", text: "#e6faff", muted: "#7fb3c8", muted2: "#4f7a8f",
        radius: 6, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "soft": {
      label: "Soft UI (Neumorphic)",
      accent: { mode: "fixed", hue: 243, sat: 75, light: 58 },
      tokens: {
        bg: "#e8ebf2", bg2: "#eef1f7", panel: "#e8ebf2", panel2: "#eef1f7", well: "#dde1ea",
        line: "#d9dde8", line2: "#c9cedc", text: "#2b2f45", muted: "#6b7089", muted2: "#9298ad",
        radius: 22, gap: 20, depth: 0, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "hud": {
      label: "Glass HUD",
      accent: { mode: "custom", hue: 196, sat: 92, light: 60 },
      tokens: {
        bg: "#060b16", bg2: "#0a1222", panel: "#0d1728", panel2: "#122036", well: "#050a12",
        line: "#1b3550", line2: "#27507a", text: "#dcecff", muted: "#7fa3c8", muted2: "#4d6f92",
        radius: 14, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "wove": {
      label: "WOVE Minimal",
      accent: { mode: "fixed", hue: 0, sat: 0, light: 8 },
      tokens: {
        bg: "#f2f1ed", bg2: "#f7f6f3", panel: "#f2f1ed", panel2: "#ffffff", well: "#e7e6e1",
        line: "#dcdbd5", line2: "#c9c8c2", text: "#111111", muted: "#6b6b66", muted2: "#9a9a94",
        radius: 2, gap: 26, depth: 0, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    },
    "signature": {
      label: "Signature (recommended)",
      accent: { mode: "dynamic", hue: 196, sat: 88, light: 58 },
      tokens: {
        bg: "#08090f", bg2: "#0b0d16", panel: "#0e1119", panel2: "#141826", well: "#06070c",
        line: "#1c2230", line2: "#2a3346", text: "#eaf0ff", muted: "#8b97b3", muted2: "#5b657e",
        radius: 14, gap: 16, depth: 2, font: '"Inter","SF Pro Display",system-ui,sans-serif'
      }
    }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* tokensToCss(tokens, accentVars, selector) -> scoped custom-property block */
  function tokensToCss(t, av, sel) {
    var dk = [0.35, 0.7, 1.15, 1.7][Math.max(0, Math.min(3, t.depth || 0))];
    return (sel || ":root") + "{\n" +
      "  --accent:" + av.css + ";\n" +
      "  --accent-rgb:" + av.rgb + ";\n" +
      "  --accent-soft:" + av.soft + ";\n" +
      "  --accent-line:" + av.line + ";\n" +
      "  --accent-glow:" + av.glow + ";\n" +
      "  --bg:" + t.bg + "; --bg2:" + t.bg2 + "; --panel:" + t.panel + "; --panel2:" + t.panel2 + "; --well:" + t.well + ";\n" +
      "  --line:" + t.line + "; --line2:" + t.line2 + "; --text:" + t.text + "; --muted:" + t.muted + "; --muted2:" + t.muted2 + ";\n" +
      "  --r:" + t.radius + "px; --gap:" + t.gap + "px; --font:" + t.font + ";\n" +
      "  --dk:" + dk + ";\n" +
      "  --sh-key:0 calc(2px*var(--dk)) calc(4px*var(--dk)) rgb(0 0 0/.45);\n" +
      "  --sh-amb:0 calc(10px*var(--dk)) calc(28px*var(--dk)) rgb(0 0 0/.5);\n" +
      "  --sh-far:0 calc(30px*var(--dk)) calc(70px*var(--dk)) rgb(0 0 0/.55);\n" +
      "  --hl:inset 0 1px 0 rgb(255 255 255/.09);\n" +
      "  --hl2:inset 0 1px 0 rgb(255 255 255/.16);\n" +
      "  --shade:inset 0 -1px 0 rgb(0 0 0/.5);\n" +
      "  --well-in:inset 0 calc(2px*var(--dk)) calc(7px*var(--dk)) rgb(0 0 0/.7),inset 0 calc(-1px*var(--dk)) 0 rgb(255 255 255/.04);\n" +
      "}\n";
  }

  window.UIThemes = { presets: presets, tokensToCss: tokensToCss, esc: esc };
})();
