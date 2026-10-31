import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ADMIN_BASE } from "../Admin/adminConfig.js";

const LenisContext = createContext(null);

export function useLenisRef() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return undefined;

    // High-performance Lenis inertial instance calibrated for 60-120fps displays
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      syncTouch: false, // Preserves native fluid momentum and gestures on touchscreens
      autoRaf: true,
      anchors: true, // Smooth anchor navigation with scroll-padding support
      respectReducedMotion: true,
    });

    lenisRef.current = lenis;

    // Stop Lenis on admin paths to allow native mouse wheel scrolling in nested admin panels
    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        if (ADMIN_BASE && (window.location.pathname === ADMIN_BASE || window.location.pathname.startsWith(`${ADMIN_BASE}/`))) {
          lenis.stop();
          document.documentElement.classList.remove("lenis", "lenis-smooth");
        } else {
          lenis.start();
        }
      }
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
