import { useEffect, useRef } from "react";
import { useLenisRef } from "./LenisProvider";

export default function ScrollEnhancements() {
  const barRef = useRef(null);
  const lenisRef = useLenisRef();

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return undefined;

    let rafId = null;

    const updateBar = (pct) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, pct / 100))})`;
      }
    };

    // If Lenis is active, subscribe to Lenis scroll directly (zero DOM reflows)
    const lenis = lenisRef?.current;
    if (lenis) {
      const onLenisScroll = (e) => {
        updateBar(e.progress * 100);
      };
      lenis.on("scroll", onLenisScroll);
      return () => {
        lenis.off("scroll", onLenisScroll);
      };
    }

    // High-performance RAF-throttled fallback for native window scroll
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollableHeight = documentHeight - windowHeight;
        const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
        updateBar(progress);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [lenisRef]);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar gpu-layer"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
