import { useEffect, useRef } from "react";

let sharedObserver = null;
const observerCallbacks = new Map();
let isReducedMotion = null;

function getSharedObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
              sharedObserver.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
  }
  return sharedObserver;
}

export default function ScrollReveal({
  as: Element = "div",
  className = "",
  delay = 0,
  style,
  ...props
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (isReducedMotion === null && typeof window !== "undefined") {
      isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    if (isReducedMotion) {
      element.dataset.revealState = "visible";
      return undefined;
    }

    const observer = getSharedObserver();
    if (!observer) {
      element.dataset.revealState = "visible";
      return undefined;
    }

    observerCallbacks.set(element, () => {
      element.dataset.revealState = "visible";
    });
    observer.observe(element);

    return () => {
      observerCallbacks.delete(element);
      observer.unobserve(element);
    };
  }, []);

  return (
    <Element
      {...props}
      className={`scroll-reveal ${className}`.trim()}
      data-reveal-state="pending"
      ref={elementRef}
      style={{ ...style, "--scroll-reveal-delay": `${delay}ms` }}
    />
  );
}
