import { useEffect, useRef } from 'react';
import teamPhoto from '../assets/team.png';

export default function PromiseBackground() {
  const photoRef = useRef(null);
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Check if we should disable parallax
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion.current || isMobile) {
      return;
    }

    const photo = photoRef.current;
    const section = document.getElementById('trust-care');
    
    if (!photo || !section) return;

    const updatePhotoPosition = () => {
      const rect = section.getBoundingClientRect();
      // Cancel the section's movement so photo stays fixed, and shift up by 120px
      photo.style.transform = `translate3d(0, ${-rect.top - 120}px, 0)`;
      rafRef.current = null;
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePhotoPosition);
      }
    };

    const handleResize = () => {
      handleScroll();
    };

    // Initial position
    updatePhotoPosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={photoRef}
      className="promise-photo"
      style={{
        position: 'absolute',
        left: 0,
        top: '-120px',
        width: '100%',
        height: 'calc(100vh + 120px)',
        backgroundImage: `url(${teamPhoto})`,
        backgroundPosition: '50% 35%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
