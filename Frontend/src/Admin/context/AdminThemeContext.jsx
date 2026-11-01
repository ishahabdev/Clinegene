import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AdminThemeContext = createContext(null);
const LS_ADMIN_THEME_KEY = "clingene_admin_theme";

export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LS_ADMIN_THEME_KEY);
        if (saved === "light" || saved === "dark") return saved;
      } catch {
        // ignore
      }
    }
    // Default to dark theme as in reference UI
    return "dark";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    try {
      localStorage.setItem(LS_ADMIN_THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, isDark]);

  // Clean up when unmounting Admin (e.g. navigation back to public site)
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setThemeState(newTheme);
    }
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return ctx;
}
