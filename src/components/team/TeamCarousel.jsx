import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";

// Calculate stacked overlapping position for 5-card deck layout
function getCardTransform(offset, stageWidth) {
  // Wider horizontal spacing for excellent visibility (180-210px)
  const baseOffset = Math.min(Math.max(stageWidth * 0.26, 180), 210);
  
  // Stacked deck with wider spread and less vertical offset
  const positions = {
    0: { 
      x: 0, 
      y: -8, 
      rotate: 0, 
      rotateY: 0,
      scale: 1, 
      opacity: 1, 
      zIndex: 50,
      blur: 0
    }, // Front Center (active) - slightly elevated
    1: { 
      x: baseOffset, 
      y: 18, 
      rotate: 3, 
      rotateY: -12,
      scale: 0.92, 
      opacity: 0.95, 
      zIndex: 40,
      blur: 0
    }, // Right 1 (close) - wider spread
    '-1': { 
      x: -baseOffset, 
      y: 18, 
      rotate: -3, 
      rotateY: 12,
      scale: 0.92, 
      opacity: 0.95, 
      zIndex: 40,
      blur: 0
    }, // Left 1 (close) - wider spread
    2: { 
      x: baseOffset * 2.1, 
      y: 36, 
      rotate: 5, 
      rotateY: -16,
      scale: 0.84, 
      opacity: 0.85, 
      zIndex: 30,
      blur: 0
    }, // Right 2 (far) - much wider
    '-2': { 
      x: -baseOffset * 2.1, 
      y: 36, 
      rotate: -5, 
      rotateY: 16,
      scale: 0.84, 
      opacity: 0.85, 
      zIndex: 30,
      blur: 0
    }, // Left 2 (far) - much wider
  };

  return positions[offset] || { x: baseOffset * 2.9, y: 48, rotate: 6, rotateY: -18, scale: 0.72, opacity: 0, zIndex: 10, blur: 0.5 };
}

// Individual Card Component
function CarouselCard({ member, offset, stageWidth, onClick, isActive }) {
  const transform = getCardTransform(offset, stageWidth);
  
  const getInitials = (name) => {
    return name
      .split(" ")
      .filter((n) => n.length && isNaN(Number(n.replace(/[^a-zA-Z.]/g, ""))))
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(member.name);

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[min(340px,88vw)] transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) rotateZ(${transform.rotate}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        opacity: transform.opacity,
        zIndex: transform.zIndex,
        filter: `blur(${transform.blur}px)`,
        pointerEvents: Math.abs(offset) <= 2 ? 'auto' : 'none',
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
    >
      <article
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
          Math.abs(offset) > 0 ? 'cursor-pointer' : 'cursor-default'
        } ${
          isActive
            ? 'border-2 border-[#10C8E0] shadow-[0_25px_70px_rgba(16,200,224,0.6)]'
            : 'bg-white border-2 border-[#e2e8f0] shadow-[0_10px_30px_rgba(15,23,42,0.12)] hover:shadow-[0_15px_40px_rgba(16,200,224,0.2)] hover:-translate-y-1'
        }`}
      >
        {/* Subtle animated glow for active card */}
        {isActive && (
          <>
            <div
              className="absolute inset-0 rounded-2xl opacity-25 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(6,182,212,0.9) 10%, transparent 20%)',
                animation: 'spin-slow 6s linear infinite',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05] pointer-events-none" />
          </>
        )}

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header Section with Full Image - Increased height for fuller picture */}
          <div className="relative h-64 overflow-hidden bg-white">
            {/* Profile Image - Full Header, Focused on Face */}
            {member.image ? (
              <div className="absolute inset-0">
                <img 
                  src={member.image} 
                  alt={member.imageAlt || member.name}
                  className="h-full w-full"
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: member.imagePosition || 'center 20%' // Use per-member focal point
                  }}
                />
              </div>
            ) : (
              <>
                {/* Clean minimal pattern fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]">
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px'
                  }} />
                </div>
                
                {/* Initials fallback */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#10C8E0] to-[#10C8E0] flex items-center justify-center shadow-2xl">
                    <span className="text-[32px] font-extrabold font-['Inter'] text-white">
                      {initials}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Leadership badge (top right) - on image */}
            {isActive && (
              <div className="absolute top-3 right-3 rounded-lg bg-[#10C8E0] backdrop-blur-sm border border-[#10C8E0] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white shadow-lg z-10">
                Leadership
              </div>
            )}

            {/* Department badge - on image */}
            {!isActive && (
              <div className="absolute top-3 left-3 rounded-lg bg-white/95 backdrop-blur-sm border border-[#e2e8f0] px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-[#10C8E0] shadow-md z-10">
                {member.department || 'Team'}
              </div>
            )}

            {/* Status indicator - bottom right corner */}
            <div className={`absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full shadow-xl ${isActive ? 'bg-white ring-2 ring-white/50' : 'bg-[#10C8E0] ring-2 ring-white'} z-10`}>
              <div className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
            </div>
          </div>

          {/* Content Section - Cyan gradient ONLY on active card content area */}
          <div className={`px-4 pb-3 pt-3 ${
            isActive 
              ? 'bg-[#0991B2]' 
              : 'bg-white'
          }`}>
            {/* Name - compact */}
            <h3 className={`text-center font-['Poppins'] text-[16px] font-bold leading-tight mb-1 line-clamp-2 ${
              isActive ? 'text-black' : 'text-[#0f172a]'
            }`}>
              {member.name}
            </h3>

            {/* Designation - compact */}
            <p className={`text-center text-[11px] font-semibold mb-2.5 line-clamp-2 ${
              isActive ? 'text-black' : 'text-[#10C8E0]'
            }`}>
              {member.designation}
            </p>

            {/* Decorative line - compact */}
            <div className={`mx-auto h-[2px] w-12 rounded-full mb-3 ${
              isActive ? 'bg-black/60' : 'bg-[#10C8E0]'
            }`} />

            {/* Details (bullet points) - compact spacing */}
            {member.details && member.details.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {member.details.slice(0, 2).map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[10px] leading-relaxed">
                    <div className={`mt-1 h-1 w-1 rounded-full shrink-0 ${isActive ? 'bg-black' : 'bg-[#10C8E0]'}`} />
                    <span className={`line-clamp-2 ${isActive ? 'text-black/90' : 'text-[#475569]'}`}>
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags - compact */}
            {member.tags && member.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {member.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`rounded-lg px-2 py-1 text-[8px] font-semibold uppercase tracking-wide transition-all ${
                      isActive
                        ? 'bg-white/90 text-black border border-white'
                        : 'bg-[#e0f2fe] text-[#10C8E0] border border-[#10C8E0]/20'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Contact button - compact */}
            {member.social?.email && (
              <button
                className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[11px] font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-black text-white hover:bg-gray-800 shadow-xl hover:shadow-2xl'
                    : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${member.social.email}`;
                }}
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />
                {isActive ? 'Contact Specialist' : 'Contact'}
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

// Main Carousel Component
export default function TeamCarousel({ members = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(1200);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const stageRef = useRef(null);
  const touchStartRef = useRef({ x: 0, time: 0 });
  const isDraggingRef = useRef(false);

  // Measure stage width
  useEffect(() => {
    const updateStageWidth = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.offsetWidth);
      }
    };

    updateStageWidth();
    const resizeObserver = new ResizeObserver(updateStageWidth);
    if (stageRef.current) {
      resizeObserver.observe(stageRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate offset for each member
  const getCardOffset = useCallback((memberIndex) => {
    const n = members.length;
    if (n === 0) return 0;
    
    let offset = memberIndex - activeIndex;
    
    // Normalize offset to shortest path
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    
    return offset;
  }, [activeIndex, members.length]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning || members.length <= 1) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % members.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, members.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || members.length <= 1) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, members.length]);

  const goToIndex = useCallback((targetIndex) => {
    if (isTransitioning || targetIndex === activeIndex || members.length <= 1) return;
    setIsTransitioning(true);
    setActiveIndex(targetIndex);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, activeIndex, members.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch/Mouse handlers
  const handleStart = useCallback((clientX) => {
    if (isTransitioning) return;
    touchStartRef.current = { x: clientX, time: Date.now() };
    isDraggingRef.current = false;
  }, [isTransitioning]);

  const handleMove = useCallback((clientX) => {
    if (!touchStartRef.current || isTransitioning) return;
    
    const diff = clientX - touchStartRef.current.x;
    if (Math.abs(diff) > 10) {
      isDraggingRef.current = true;
    }
  }, [isTransitioning]);

  const handleEnd = useCallback((clientX) => {
    if (!touchStartRef.current || isTransitioning) return;

    const diff = clientX - touchStartRef.current.x;
    const timeDiff = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(diff) / timeDiff;

    if ((Math.abs(diff) > 50 || velocity > 0.5) && isDraggingRef.current) {
      if (diff > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }

    touchStartRef.current = null;
    isDraggingRef.current = false;
  }, [isTransitioning, goToPrev, goToNext]);

  const handlePointerDown = (e) => handleStart(e.clientX);
  const handlePointerMove = (e) => handleMove(e.clientX);
  const handlePointerUp = (e) => handleEnd(e.clientX);

  const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = (e) => handleEnd(e.changedTouches[0].clientX);

  // Handle card click
  const handleCardClick = useCallback((memberIndex) => {
    if (isDraggingRef.current) return;
    const offset = getCardOffset(memberIndex);
    if (offset === 0) return;
    goToIndex(memberIndex);
  }, [getCardOffset, goToIndex]);

  if (members.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative bg-white py-12 md:py-16 overflow-hidden z-[1]" 
      id="team-carousel"
    >
      {/* Diagnostic grid background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10C8E0 1px, transparent 1px),
            linear-gradient(to bottom, #10C8E0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
        aria-hidden="true"
      />

      {/* Radial cyan glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(16,200,224,0.1),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#10C8E0]/10 to-[#10C8E0]/10 border border-[#10C8E0]/30 px-6 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-[#10C8E0] animate-pulse shadow-lg shadow-[#10C8E0]/50" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#10C8E0] font-['Inter']">
              Expert Diagnostic Leadership
            </span>
          </div>

          <h2 className="font-['Poppins'] text-[32px] font-extrabold leading-[1.15] text-[#0f172a] sm:text-[38px] lg:text-[44px]">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-[#10C8E0] to-[#10C8E0] bg-clip-text text-transparent">
              Board-Certified Specialists
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-[#64748b] lg:text-[15px] font-['Inter']">
            Our leadership team combines decades of expertise in clinical diagnostics,<br className="hidden sm:block" />
            genomic medicine, and laboratory science to deliver world-class healthcare solutions.
          </p>
        </div>

        {/* Stacked Overlapping Carousel Stage */}
        <div
          ref={stageRef}
          className="relative mx-auto touch-pan-y select-none"
          style={{ 
            height: 'clamp(520px, 60vh, 620px)',
            perspective: '2000px',
            perspectiveOrigin: '50% 50%'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            touchStartRef.current = null;
            isDraggingRef.current = false;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Render ALL cards in stacked deck */}
          {members.map((member, index) => {
            const offset = getCardOffset(index);
            return (
              <CarouselCard
                key={member.id || index}
                member={member}
                offset={offset}
                stageWidth={stageWidth}
                isActive={index === activeIndex}
                onClick={() => handleCardClick(index)}
              />
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="mt-10 flex items-center justify-center gap-8">
          {/* Previous button */}
          <button
            onClick={goToPrev}
            disabled={members.length <= 1 || isTransitioning}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10C8E0] to-[#10C8E0] text-white transition-all duration-300 hover:shadow-xl hover:shadow-[#10C8E0]/40 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10C8E0] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Previous team member"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>

          {/* Counter and Dot Indicators */}
          <div className="flex flex-col items-center gap-3">
            {/* Progress counter */}
            <div className="text-base font-extrabold text-[#0f172a] tabular-nums font-['Inter']">
              <span className="text-[#10C8E0]">{String(activeIndex + 1).padStart(2, '0')}</span>
              {" / "}
              <span className="text-[#94a3b8]">{String(members.length).padStart(2, '0')}</span>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {members.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  disabled={isTransitioning}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10C8E0] disabled:cursor-not-allowed ${
                    idx === activeIndex
                      ? 'w-8 bg-gradient-to-r from-[#10C8E0] to-[#10C8E0] shadow-lg shadow-[#10C8E0]/40'
                      : 'w-2 bg-[#cbd5e1] hover:bg-[#10C8E0]/70 hover:w-5'
                  }`}
                  aria-label={`Go to ${members[idx].name}`}
                  aria-current={idx === activeIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={goToNext}
            disabled={members.length <= 1 || isTransitioning}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#10C8E0] to-[#10C8E0] text-white transition-all duration-300 hover:shadow-xl hover:shadow-[#10C8E0]/40 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10C8E0] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Next team member"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

       
      </div>
    </section>
  );
}
