import { useState } from "react";

export function useViewMode(storageKey = "admin-team-view", defaultMode = "grid") {
  const [viewMode, setViewModeState] = useState(() => {
    if (typeof window === "undefined") return defaultMode;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === "list" || stored === "grid" ? stored : defaultMode;
    } catch (e) {
      console.warn("Could not read view mode from localStorage", e);
      return defaultMode;
    }
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, mode);
      }
    } catch (e) {
      console.warn("Could not save view mode to localStorage", e);
    }
  };

  return [viewMode, setViewMode];
}

