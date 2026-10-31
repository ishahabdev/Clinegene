import { useEffect } from "react";

export default function SectionScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const main = document.querySelector("main");
    if (!main || !("IntersectionObserver" in window)) return undefined;

    const observed = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.sectionReveal = "visible";
          observer.unobserve(entry.target);
          observed.delete(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    const observeSections = (root) => {
      const sections = [];
      if (root instanceof Element && root.matches("section")) sections.push(root);
      if (root.querySelectorAll) sections.push(...root.querySelectorAll("section"));

      sections.forEach((section) => {
        if (observed.has(section)) return;
        section.dataset.sectionReveal = "hidden";
        observer.observe(section);
        observed.add(section);
      });
    };

    observeSections(main);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeSections(node);
        });
      });
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      observed.forEach((section) => delete section.dataset.sectionReveal);
      main.querySelectorAll('[data-section-reveal="visible"]').forEach((section) => {
        delete section.dataset.sectionReveal;
      });
    };
  }, []);

  return null;
}
