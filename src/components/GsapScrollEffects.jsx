import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GsapScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const main = document.querySelector("main");
    if (!main) return undefined;

    const tweens = new Map();
    let refreshFrame = null;

    const registerSections = (root) => {
      const sections = [];
      if (root instanceof Element && root.matches("section")) sections.push(root);
      if (root.querySelectorAll) sections.push(...root.querySelectorAll("section"));

      let hasNewSections = false;
      sections.forEach((section) => {
        if (tweens.has(section)) return;
        hasNewSections = true;
        const tween = gsap.fromTo(
          section,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
            },
          },
        );
        tweens.set(section, tween);
      });

      if (hasNewSections && refreshFrame === null) {
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = null;
          ScrollTrigger.refresh();
        });
      }
    };

    registerSections(main);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) registerSections(node);
        });
      });
    });
    observer.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);
      tweens.forEach((tween, section) => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(section, { clearProps: "opacity,visibility,transform" });
      });
    };
  }, []);

  return null;
}
