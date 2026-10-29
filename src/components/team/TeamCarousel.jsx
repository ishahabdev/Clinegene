import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// Calculate stacked overlapping position for 5-card deck layout
function getCardTransform(offset, stageWidth) {
  const isMobile = stageWidth < 640;
  
  if (isMobile) {
    // Mobile: tighter spread so neighbouring cards peek in by ~45-60px from the edges
    const baseOffset = Math.round(Math.min(stageWidth * 0.76, 280));
    const mobilePositions = {
      0: {
        x: 0,
        y: 0,
        rotate: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 50,
        blur: 0,
      },
      1: {
        x: baseOffset,
        y: 6,
        rotate: 2,
        rotateY: -8,
        scale: 0.95,
        opacity: 0.8,
        zIndex: 40,
        blur: 0,
      },
      '-1': {
        x: -baseOffset,
        y: 6,
        rotate: -2,
        rotateY: 8,
        scale: 0.95,
        opacity: 0.8,
        zIndex: 40,
        blur: 0,
      },
      2: {
        x: baseOffset * 1.85,
        y: 14,
        rotate: 4,
        rotateY: -12,
        scale: 0.88,
        opacity: 0.35,
        zIndex: 30,
        blur: 0,
      },
      '-2': {
        x: -baseOffset * 1.85,
        y: 14,
        rotate: -4,
        rotateY: 12,
        scale: 0.88,
        opacity: 0.35,
        zIndex: 30,
        blur: 0,
      },
    };
    return mobilePositions[offset] || { x: baseOffset * 2.5, y: 24, rotate: 6, rotateY: -16, scale: 0.75, opacity: 0, zIndex: 10, blur: 0.5 };
  }

  // Wider horizontal spacing for excellent visibility on desktop (180-210px)
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
      className="absolute left-1/2 top-1/2 w-[min(320px,84vw)] sm:w-[min(340px,88vw)] transition-all duration-650 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        transform: `translate3d(-50%, -50%, 0) translate3d(${transform.x}px, ${transform.y}px, 0) rotateZ(${transform.rotate}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        willChange: 'transform, opacity',
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
            ? 'border sm:border-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:shadow-[0_10px_30px_rgba(15,23,42,0.15)]'
            : 'bg-white border sm:border-2 border-[#e2e8f0] shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:shadow-[0_10px_30px_rgba(15,23,42,0.12)] hover:shadow-[0_15px_40px_rgba(15,23,42,0.18)] hover:-translate-y-1'
        }`}
        style={isActive ? { borderColor: "var(--card-active-border, var(--accent))" } : undefined}
      >
        {/* Remove the animated glow effects */}
        {isActive && (
          <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
        )}

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header Section with Profile Photo */}
          <div className="relative h-[clamp(200px,54vw,240px)] sm:h-64 overflow-hidden bg-white">
            {/* Profile Image - Focused on Face */}
            {member.image ? (
              <div className="absolute inset-0">
                <img 
                  src={member.image} 
                  alt={member.imageAlt || member.name}
                  width={member.width || 800}
                  height={member.height || 800}
                  decoding="async"
                  loading="lazy"
                  className="h-full w-full object-cover object-[top_center] sm:object-[center_20%]"
                />
              </div>
            ) : (
              <>
                {/* Clean minimal pattern fallback */}
                <div className="absolute inset-0 bg-linear-to-br from-[#f8fafc] to-[#e0f2fe]">
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
                  <div
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full flex items-center justify-center shadow-2xl transition-colors"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <span className="text-[28px] sm:text-[32px] font-extrabold font-['Inter'] text-white">
                      {initials}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Status indicator - bottom right corner */}
            <div
              className={`absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full shadow-xl ${isActive ? 'bg-white ring-2 ring-white/50' : 'ring-2 ring-white'} z-10`}
              style={!isActive ? { backgroundColor: "var(--accent)" } : undefined}
            >
              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#10b981] animate-pulse" />
            </div>
          </div>

          {/* Content Section - Theme color on active card content area */}
          <div
            className={`px-3.5 py-3 sm:px-4 sm:pb-4 sm:pt-3.5 transition-colors duration-300 min-h-0 sm:min-h-43.75 flex flex-col justify-start ${
              isActive 
                ? 'text-white' 
                : 'bg-white'
            }`}
            style={isActive ? { backgroundColor: "var(--card-active-bg, var(--accent-dark))", color: "#ffffff" } : undefined}
          >
            <div>
              {/* 1. Name: serif for the name */}
              <h3
                className={`text-center font-serif font-bold mb-1 line-clamp-2 ${
                  isActive ? 'text-white' : 'text-[#0c2b48]'
                }`}
                style={{
                  fontSize: "clamp(1rem, 4.4vw, 1.15rem)",
                  lineHeight: 1.25,
                }}
              >
                {member.name}
              </h3>

              {/* 2. Designation: smaller, clean font */}
              <p
                className={`text-center font-semibold mb-1.5 sm:mb-2 line-clamp-1 font-['Inter',sans-serif] ${
                  isActive ? 'text-white/90' : ''
                }`}
                style={{
                  fontSize: "clamp(0.8rem, 3.4vw, 0.9rem)",
                  lineHeight: 1.3,
                  ...(!isActive ? { color: "var(--accent)" } : {}),
                }}
              >
                {member.designation}
              </p>

              {/* Decorative line: subtle ~6px margin on mobile */}
              <div
                className={`mx-auto h-0.5 w-10 sm:w-12 rounded-full my-1.5 sm:my-2.5 ${
                  isActive ? 'bg-white/40' : ''
                }`}
                style={!isActive ? { backgroundColor: "var(--accent)" } : undefined}
              />

              {/* 3. Description: supports multi-line credentials cleanly */}
              <p
                className={`text-center whitespace-pre-line line-clamp-4 sm:line-clamp-5 font-['Inter',sans-serif] ${
                  isActive ? 'text-white/85' : 'text-slate-500'
                }`}
                style={{
                  fontSize: "clamp(0.76rem, 3.1vw, 0.83rem)",
                  lineHeight: 1.45,
                }}
              >
                {member.description}
              </p>
            </div>
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
      className="relative bg-white py-10 pb-20 sm:py-12 sm:pb-16 md:py-16 overflow-hidden z-1" 
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

      <div className="relative site-container">
        {/* Section Header */}
        <div className="mb-6 sm:mb-10 lg:mb-12 text-center">
          <h2 className="font-['Poppins'] text-[26px] font-extrabold leading-[1.18] text-[#0f172a] sm:text-[36px] lg:text-[44px]">
            Meet Our{" "}
            <span
              style={{
                color: "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
             Team
            </span>
          </h2>

          <p className="mx-auto mt-2.5 sm:mt-4 max-w-2xl text-[13px] leading-relaxed text-[#64748b] sm:text-sm lg:text-[15px] font-['Inter']">
            Our leadership team combines decades of expertise in clinical diagnostics,<br className="hidden sm:block" />
            genomic medicine, and laboratory science to deliver world-class healthcare solutions.
          </p>
        </div>

        {/* Stacked Overlapping Carousel Stage */}
        <div
          ref={stageRef}
          className="relative mx-auto touch-pan-y select-none"
          style={{ 
            height: stageWidth < 640 ? 'clamp(430px, 55vh, 465px)' : 'clamp(520px, 60vh, 620px)',
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
                key={member.name || index}
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
        <div className="mt-3 sm:mt-8 lg:mt-10 flex items-center justify-center gap-6 sm:gap-8">
          {/* Previous button */}
          <button
            onClick={goToPrev}
            disabled={members.length <= 1 || isTransitioning}
            className="group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--accent-btn-bg)",
              color: "var(--accent-btn-text)",
            }}
            aria-label="Previous team member"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>

          {/* Counter and Dot Indicators */}
          <div className="flex flex-col items-center gap-3">
            {/* Progress counter */}
            <div className="text-base font-extrabold text-[#0f172a] tabular-nums font-['Inter']">
              <span style={{ color: "var(--accent)" }}>{String(activeIndex + 1).padStart(2, '0')}</span>
              {" / "}
              <span className="text-[#94a3b8]">{String(members.length).padStart(2, '0')}</span>
            </div>

            {/* Dot indicators — 44px touch targets */}
            <div className="flex items-center gap-1">
              {members.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  disabled={isTransitioning}
                  className="flex min-h-11 min-w-7 sm:min-w-8 items-center justify-center p-1 cursor-pointer touch-manipulation disabled:cursor-not-allowed"
                  aria-label={`Go to ${members[idx].name}`}
                  aria-current={idx === activeIndex ? 'true' : 'false'}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-8 shadow-md'
                        : 'w-2 bg-[#cbd5e1] hover:w-4'
                    }`}
                    style={idx === activeIndex ? { backgroundColor: "var(--accent)" } : undefined}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={goToNext}
            disabled={members.length <= 1 || isTransitioning}
            className="group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--accent-btn-bg)",
              color: "var(--accent-btn-text)",
            }}
            aria-label="Next team member"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
