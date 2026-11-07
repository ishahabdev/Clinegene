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
    "--accent-dark":     "#0c2b48",   // Dark Blue
    "--card-active-bg":  "#0c2b48",   // Dark Blue
    "--card-active-border": "#10c8e0",
    "--card-active-badge":  "#0c2b48",
    "--accent-btn-bg":   "#10c8e0",   // button fill = accent cyan
    "--accent-btn-text": "#04152b",   // dark navy text on light-cyan button
    "--card-hero-badge-bg": "rgba(6, 52, 81, 0.92)",
    "--contact-featured-bg": "#050b1c",
    "--contact-featured-border": "#0c2b48",
    "--contact-featured-icon-bg": "rgba(16, 200, 224, 0.12)",
    "--contact-featured-icon-border": "rgba(16, 200, 224, 0.35)",
    "--contact-featured-accent": "#10c8e0",
    "--contact-featured-muted": "#c7d1e0",
    "--service-catalog-bg": "linear-gradient(180deg, #eaf8fc 0%, #f7fbfd 100%)",
    "--service-banner-bg": "#062b47",
    "--service-featured-banner-bg": "linear-gradient(to right, #eef9fd, #f5fbfe, #eaf5fc)",
    "--service-featured-banner-border": "#cbe8f6",
    "--gallery-card-overlay": "rgba(2, 19, 42, 0.65)",
    "--footer-overlay": "linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94))",
    "--promise-overlay": "linear-gradient(90deg, rgba(3,20,43,0.95) 0%, rgba(4,32,64,0.84) 45%, rgba(6,52,96,0.45) 100%)",
    "--panel-dark": "#020a07",
    "--panel-rgb": "2, 10, 7",
    "--spotlight-gradient": "linear-gradient(135deg, #022438 0%, #033d59 50%, #011624 100%)",
    "--spotlight-border": "rgba(18, 197, 223, 0.4)",
    "--spotlight-shadow": "0 20px 50px rgba(2, 36, 56, 0.35)",
    "--spotlight-radial": "radial-gradient(circle at 50% 18%, rgba(18, 197, 223, 0.18), transparent 60%)",
    "--why-dark": "#041728",
    "--why-accent": "#0284c7",
    "--why-icon-accent": "#10c8e0",
    "--why-checkmark-bg": "#0284c7",
    "--why-badge-bg": "#0284c7",
    "--why-badge-shadow": "0 12px 28px -4px rgba(2, 132, 199, 0.45)",
    "--why-overlay": "none",
    "--why-tile-bg": "rgba(16, 200, 224, 0.14)",
    "--why-tile-border": "rgba(16, 200, 224, 0.25)",
    "--why-paragraph": "#3d4f5a",
    "--why-checklist-text": "#1f252d",
    "--ceo-card-bg": "linear-gradient(180deg, #032236 0%, #043a50 100%)",
    "--ceo-card-shadow": "0 16px 36px rgba(2, 24, 38, 0.32)",
    "--ceo-card-border": "rgba(18, 197, 223, 0.2)",
    "--ceo-card-portrait-bg": "#032236",
    "--ceo-card-info-bg": "linear-gradient(180deg, #032439 0%, #04374d 100%)",
    "--ceo-card-info-text": "#c0d6e5",
    "--ceo-vision-bg": "linear-gradient(135deg, #022a3f 0%, #03445b 50%, #055c75 100%)",
    "--ceo-quote-bg": "linear-gradient(180deg, #eaf8fc 0%, #d7f2f7 100%)",
    "--ceo-quote-text": "#1e456c",
    "--ceo-quote-shadow": "0 8px 24px rgba(18, 197, 223, 0.10)",
    "--ceo-pillars-bg": "#eff9fc",
    "--ceo-pillars-shadow": "0 10px 30px rgba(18, 197, 223, 0.08)",
    "--ceo-pillars-icon-bg": "#d4f3f7",
    "--ceo-commitment-bg": "#01192b",
    "--service-detail-alt-bg": "#f8fafc",
    heroImg: "/images/homepic.webp",
    heroImgMobile: "/images/homepic-1200.webp",
    heroImg640: "/images/homepic-640.webp",
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
    "--accent-dark":     "#064e3b",   // Dark Green
    "--card-active-bg":  "#064e3b",   // Dark Green
    "--card-active-border": "#10b981",
    "--card-active-badge":  "#064e3b",
    "--accent-btn-bg":   "#059669",   // deep emerald button fill
    "--accent-btn-text": "#ffffff",   // white text on green button
    "--card-hero-badge-bg": "rgba(2, 30, 18, 0.92)",
    "--contact-featured-bg": "#0b1f1a",
    "--contact-featured-border": "rgba(16, 185, 129, 0.3)",
    "--contact-featured-icon-bg": "rgba(16, 185, 129, 0.16)",
    "--contact-featured-icon-border": "rgba(16, 185, 129, 0.4)",
    "--contact-featured-accent": "#10b981",
    "--contact-featured-muted": "#9eb5ab",
    "--service-catalog-bg": "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
    "--service-banner-bg": "#022013",
    "--service-featured-banner-bg": "linear-gradient(to right, #f0fdf4, white, #ecfdf5)",
    "--service-featured-banner-border": "#a7f3d0",
    "--gallery-card-overlay": "rgba(2, 30, 18, 0.65)",
    "--footer-overlay": "linear-gradient(105deg, rgba(2, 30, 18, 0.97), rgba(4, 42, 24, 0.95))",
    "--promise-overlay": "linear-gradient(90deg, rgba(2, 30, 18, 0.97) 0%, rgba(4, 42, 24, 0.88) 45%, rgba(6, 60, 34, 0.45) 100%)",
    "--panel-dark": "#0b1f1a",
    "--panel-rgb": "11, 31, 26",
    "--spotlight-gradient": "linear-gradient(135deg, #022214 0%, #043822 50%, #01170d 100%)",
    "--spotlight-border": "rgba(16, 185, 129, 0.4)",
    "--spotlight-shadow": "0 20px 50px rgba(2, 34, 20, 0.35)",
    "--spotlight-radial": "radial-gradient(circle at 50% 18%, rgba(16, 185, 129, 0.18), transparent 60%)",
    "--why-dark": "#0b1f1a",
    "--why-accent": "#10b981",
    "--why-icon-accent": "#10b981",
    "--why-checkmark-bg": "#10b981",
    "--why-badge-bg": "#059669",
    "--why-badge-shadow": "0 12px 28px -4px rgba(16, 185, 129, 0.45)",
    "--why-overlay": "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(2,10,7,0.10))",
    "--why-tile-bg": "rgba(16, 185, 129, 0.14)",
    "--why-tile-border": "rgba(16, 185, 129, 0.25)",
    "--why-paragraph": "#3d5a50",
    "--why-checklist-text": "#1f2d28",
    "--ceo-card-bg": "linear-gradient(180deg, #022013 0%, #033620 50%, #054c2d 100%)",
    "--ceo-card-shadow": "0 16px 36px rgba(2, 32, 19, 0.45)",
    "--ceo-card-border": "rgba(16, 185, 129, 0.3)",
    "--ceo-card-portrait-bg": "#01170d",
    "--ceo-card-info-bg": "linear-gradient(180deg, #022415 0%, #03381f 100%)",
    "--ceo-card-info-text": "#a7f3d0",
    "--ceo-vision-bg": "linear-gradient(135deg, #022013 0%, #033620 50%, #054c2d 100%)",
    "--ceo-quote-bg": "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)",
    "--ceo-quote-text": "#064e3b",
    "--ceo-quote-shadow": "0 8px 24px rgba(16, 185, 129, 0.10)",
    "--ceo-pillars-bg": "#f0fdf4",
    "--ceo-pillars-shadow": "0 10px 30px rgba(16, 185, 129, 0.08)",
    "--ceo-pillars-icon-bg": "#dcfce7",
    "--ceo-commitment-bg": "#021a10",
    "--service-detail-alt-bg": "#f8fdfa",
    heroImg: "/images/greenhero.webp",
    heroImgMobile: "/images/greenhero-1200.webp",
    heroImg640: "/images/greenhero-640.webp",
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
    "--accent-dark":     "#6b1218",   // Dark Red
    "--card-active-bg":  "#6b1218",   // Dark Red
    "--card-active-border": "#b91c1c",
    "--card-active-badge":  "#6b1218",
    "--accent-btn-bg":   "#b91c1c",   // SAME logo crimson → button fill (unified)
    "--accent-btn-text": "#ffffff",   // white text on crimson button
    "--card-hero-badge-bg": "rgba(45, 3, 6, 0.92)",
    "--contact-featured-bg": "#200407",
    "--contact-featured-border": "rgba(185, 28, 28, 0.35)",
    "--contact-featured-icon-bg": "rgba(185, 28, 28, 0.16)",
    "--contact-featured-icon-border": "rgba(185, 28, 28, 0.45)",
    "--contact-featured-accent": "#ef4444",
    "--contact-featured-muted": "#d4b8bb",
    "--service-catalog-bg": "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
    "--service-banner-bg": "#380408",
    "--service-featured-banner-bg": "linear-gradient(to right, #fff5f5, white, #fff1f2)",
    "--service-featured-banner-border": "#fecdd3",
    "--gallery-card-overlay": "rgba(45, 3, 6, 0.65)",
    "--footer-overlay": "linear-gradient(105deg, rgba(45, 3, 6, 0.97), rgba(60, 6, 10, 0.95))",
    "--promise-overlay": "linear-gradient(90deg, rgba(45, 3, 6, 0.97) 0%, rgba(60, 6, 10, 0.88) 45%, rgba(90, 10, 16, 0.45) 100%)",
    "--panel-dark": "#200407",
    "--panel-rgb": "32, 4, 7",
    "--spotlight-gradient": "linear-gradient(135deg, #320408 0%, #4f080e 50%, #200305 100%)",
    "--spotlight-border": "rgba(239, 68, 68, 0.4)",
    "--spotlight-shadow": "0 20px 50px rgba(50, 4, 8, 0.35)",
    "--spotlight-radial": "radial-gradient(circle at 50% 18%, rgba(255, 60, 60, 0.18), transparent 60%)",
    "--why-dark": "#200407",
    "--why-accent": "#dc2626",
    "--why-icon-accent": "#ef4444",
    "--why-checkmark-bg": "#dc2626",
    "--why-badge-bg": "#b91c1c",
    "--why-badge-shadow": "0 12px 28px -4px rgba(185, 28, 28, 0.45)",
    "--why-overlay": "none",
    "--why-tile-bg": "rgba(185, 28, 28, 0.14)",
    "--why-tile-border": "rgba(185, 28, 28, 0.25)",
    "--why-paragraph": "#5c3d42",
    "--why-checklist-text": "#2d1f21",
    "--ceo-card-bg": "linear-gradient(180deg, #380408 0%, #540810 50%, #700c16 100%)",
    "--ceo-card-shadow": "0 16px 36px rgba(56, 4, 8, 0.45)",
    "--ceo-card-border": "rgba(239, 68, 68, 0.3)",
    "--ceo-card-portrait-bg": "#220305",
    "--ceo-card-info-bg": "linear-gradient(180deg, #300407 0%, #46060b 100%)",
    "--ceo-card-info-text": "#fecdd3",
    "--ceo-vision-bg": "linear-gradient(135deg, #380408 0%, #540810 50%, #700c16 100%)",
    "--ceo-quote-bg": "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)",
    "--ceo-quote-text": "#4c0519",
    "--ceo-quote-shadow": "0 8px 24px rgba(185, 28, 28, 0.10)",
    "--ceo-pillars-bg": "#fff5f5",
    "--ceo-pillars-shadow": "0 10px 30px rgba(185, 28, 28, 0.08)",
    "--ceo-pillars-icon-bg": "#fee2e2",
    "--ceo-commitment-bg": "#280306",
    "--service-detail-alt-bg": "#fdf8f8",
    heroImg: "/images/redhero.webp",
    heroImgMobile: "/images/redhero-1200.webp",
    heroImg640: "/images/redhero-640.webp",
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
  // Always initialize with "cyan" so initial client render matches SSG prerender (0 hydration mismatch)
  const [theme, setThemeRaw] = useState("cyan");

  // Sync with saved localStorage / data-theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      const domTheme = document.documentElement.getAttribute("data-theme");
      const activeTheme = (saved && (THEMES[saved] || saved === "blue"))
        ? (saved === "blue" ? "cyan" : saved)
        : (domTheme && (THEMES[domTheme] || domTheme === "blue"))
        ? (domTheme === "blue" ? "cyan" : domTheme)
        : "cyan";
      if (activeTheme !== "cyan") {
        setThemeRaw(activeTheme);
      }
    } catch { /* ignore */ }
  }, []);

  // Apply data-theme attribute and CSS variables to documentElement whenever theme changes
  useEffect(() => {
    const config = THEMES[theme] || THEMES.cyan;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    Object.entries(config).forEach(([key, val]) => {
      if (key.startsWith("--")) root.style.setProperty(key, val);
    });
  }, [theme]);

  const setTheme = useCallback((id) => {
    const normalized = id === "blue" ? "cyan" : id;
    if (!THEMES[normalized]) return;
    setThemeRaw(normalized);
    try {
      localStorage.setItem(LS_KEY, normalized);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", normalized);
      }
    } catch { /* ignore */ }
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
