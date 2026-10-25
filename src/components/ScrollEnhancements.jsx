import { useEffect, useState } from 'react';

export default function ScrollEnhancements() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Scroll Progress Bar only — back-to-top button is handled in App.jsx */
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${scrollProgress / 100})` }}
      aria-hidden="true"
    />
  );
}
