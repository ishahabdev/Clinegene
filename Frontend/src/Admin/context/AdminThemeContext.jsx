import { createContext, useContext, useEffect } from "react";

const AdminThemeContext = createContext(null);

export function AdminThemeProvider({ children }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.removeItem("clingene_admin_theme");
    } catch {
      // ignore
    }
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme: "light", isDark: false, toggleTheme: () => {} }}>
      <div className="bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}
