import { useEffect, useRef } from "react";

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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      element.dataset.revealState = "visible";
      return undefined;
    }

    element.dataset.revealState = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.revealState = "visible";
        observer.unobserve(element);
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
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
