import { createContext, useCallback, useContext, useEffect, useState } from "react";

// ─── Theme definitions ──────────────────────────────────────────────────────
export const THEMES = {
  cyan: {
    label: "Cyan",
    "--accent":          "#10c8e0",
    "--accent-2":        "#06b6d4",
    "--accent-hover":    "#079bb0",
    "--accent-glow":     "rgba(16,200,224,0.28)",
    "--accent-soft":     "#eaf6fa",
    "--accent-soft-2":   "#effafc",
    "--accent-muted":    "#0a7a94",
    "--accent-dark":     "#0891b2",
    "--accent-btn-bg":   "#10c8e0",   // button fill = accent cyan
    "--accent-btn-text": "#04152b",   // dark navy text on light-cyan button
    heroImg: "/images/homepic.webp",
    heroImgMobile: "/images/homepic-1200.webp",
    swatch: "#10c8e0",
  },
  green: {
    label: "Green",
    // ── Matched to reference image — deep teal-green ─────────────────
    "--accent":          "#10b981",   // emerald → "Through Research", icon rings, card accent bar
    "--accent-2":        "#059669",
    "--accent-hover":    "#047857",
    "--accent-glow":     "rgba(16,185,129,0.22)",
    "--accent-soft":     "#ecfdf5",
    "--accent-soft-2":   "#d1fae5",
    "--accent-muted":    "#047857",
    "--accent-dark":     "#059669",
    "--accent-btn-bg":   "#059669",   // deep emerald button fill
    "--accent-btn-text": "#ffffff",   // white text on green button
    heroImg: "/images/greenhero.jpg",
    heroImgMobile: "/images/greenhero.jpg",
    swatch: "#10b981",
  },
  red: {
    label: "Red",
    // ── Exact ClinGene logo crimson — unified across all red elements ─
    "--accent":          "#b91c1c",   // logo crimson → "Through Research", icon rings, separators, borders
    "--accent-2":        "#991b1b",   // slightly deeper shade
    "--accent-hover":    "#7f1d1d",   // darker on hover
    "--accent-glow":     "rgba(185,28,28,0.40)",
    "--accent-soft":     "#fff1f2",
    "--accent-soft-2":   "#ffe4e6",
    "--accent-muted":    "#991b1b",
    "--accent-dark":     "#b91c1c",
    "--accent-btn-bg":   "#b91c1c",   // SAME logo crimson → button fill (unified)
    "--accent-btn-text": "#ffffff",   // white text on crimson button
    heroImg: "/images/redhero.jpg",
    heroImgMobile: "/images/redhero.jpg",
    swatch: "#b91c1c",
  },
};

const LS_KEY = "clingene-theme";

// ─── Context ────────────────────────────────────────────────────────────────
const ThemeContext = createContext({
  theme: "cyan",
  setTheme: () => {},
  themeConfig: THEMES.cyan,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved && THEMES[saved]) return saved;
    } catch { /* ignore */ }
    return "cyan";
  });

  // Apply CSS variables to :root whenever theme changes
  useEffect(() => {
    const config = THEMES[theme];
    const root = document.documentElement;
    Object.entries(config).forEach(([key, val]) => {
      if (key.startsWith("--")) root.style.setProperty(key, val);
    });
  }, [theme]);

  const setTheme = useCallback((id) => {
    if (!THEMES[id]) return;
    setThemeRaw(id);
    try { localStorage.setItem(LS_KEY, id); } catch { /* ignore */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
