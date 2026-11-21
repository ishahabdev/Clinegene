import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { DEFAULT_AVATAR } from "../../lib/imageOptimization.js";

// Single Team Member Card (Clean, upright, no 3D tilt)
function TeamMemberCard({ member }) {
  const getInitials = (name = "") => {
    return (name || "")
      .split(" ")
      .filter((n) => n.length && isNaN(Number(n.replace(/[^a-zA-Z.]/g, ""))))
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(member?.name || "");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(12,43,72,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-(--accent) hover:shadow-[0_16px_36px_rgba(12,43,72,0.12)]">
      {/* Photo Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        {member.image || member.image_url ? (
          <img
            src={member.image || member.image_url}
            alt={member.imageAlt || member.name}
            width={member.width || 800}
            height={member.height || 800}
            decoding="async"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (member.fallbackImage && e.currentTarget.src !== member.fallbackImage) {
                e.currentTarget.src = member.fallbackImage;
              } else {
                e.currentTarget.src = DEFAULT_AVATAR;
              }
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              objectPosition: member.imagePosition || "center 20%",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-md"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <span className="font-['Inter'] text-2xl font-bold">{initials}</span>
            </div>
          </div>
        )}

        {/* Department Badge */}
        {member.department && (
          <span
            className="absolute left-3 top-3 rounded-md px-2.5 py-1 font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs"
            style={{ backgroundColor: "var(--card-hero-badge-bg, rgba(12,43,72,0.85))" }}
          >
            {member.department}
          </span>
        )}

        {/* Live Active Status Indicator */}
        <div
          className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white"
          title="Active Team Member"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 text-center">
        <div>
          {/* Member Name */}
          <h3 className="font-serif text-lg font-bold text-[#0c2b48] line-clamp-1 transition-colors group-hover:text-(--accent-dark)">
            {member.name}
          </h3>

          {/* Role / Designation */}
          <p
            className="mt-1 font-['Inter'] text-xs font-semibold uppercase tracking-wider line-clamp-1"
            style={{ color: "var(--accent)" }}
          >
            {member.role || member.designation}
          </p>

          {/* Decorative Divider */}
          <div
            className="mx-auto my-2.5 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-16"
            style={{ backgroundColor: "var(--accent)" }}
          />

          {/* Description / Bio / Qualifications */}
          <p className="font-['Inter'] text-xs leading-relaxed text-slate-600 line-clamp-3">
            {member.qualification || member.bio || member.description}
          </p>
        </div>

        {/* Email or Action Link */}
        {member.email && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 font-['Inter'] text-xs font-semibold text-slate-500 hover:text-(--accent) transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{member.email}</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// Main 3-Cards-In-A-Row Carousel Component
export default function TeamCarousel({ members = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, time: 0 });
  const isDraggingRef = useRef(false);

  // Responsive cards per view: Desktop = 3 in a row, Tablet = 2, Mobile = 1
  const cardsPerView = containerWidth >= 1024 ? 3 : containerWidth >= 640 ? 2 : 1;
  const gap = 24; // gap-6 in pixels
  const cardWidth = containerWidth ? Math.max(0, (containerWidth - (cardsPerView - 1) * gap) / cardsPerView) : 0;
  const step = cardWidth + gap;
  const maxIndex = Math.max(0, members.length - cardsPerView);

  // Measure container width via ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect?.width) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ensure currentIndex stays within bounds when resizing
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToIndex = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(clamped);
    },
    [maxIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, time: Date.now() };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const diff = e.touches[0].clientX - touchStartRef.current.x;
    if (Math.abs(diff) > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const diff = e.changedTouches[0].clientX - touchStartRef.current.x;
    const timeDiff = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(diff) / timeDiff;

    if ((Math.abs(diff) > 40 || velocity > 0.4) && isDraggingRef.current) {
      if (diff > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }

    touchStartRef.current = null;
    isDraggingRef.current = false;
  };

  if (!members || members.length === 0) {
    return null;
  }

  // Calculate range displayed (e.g. 1 - 3 of 11)
  const rangeStart = currentIndex + 1;
  const rangeEnd = Math.min(currentIndex + cardsPerView, members.length);

  // Calculate page dots
  const totalPages = Math.max(1, maxIndex + 1);

  return (
    <section className="relative bg-white py-12 pb-16 md:py-16 md:pb-20 overflow-hidden" id="team-carousel">
      {/* Diagnostic grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10C8E0 1px, transparent 1px),
            linear-gradient(to bottom, #10C8E0 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative site-container">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <p
            className="mb-2 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.24em] transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Scientific & Clinical Experts
          </p>
          <h2 className="font-outfit text-3xl font-extrabold leading-tight text-[#0c2b48] sm:text-4xl lg:text-[42px]">
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
          <p className="mx-auto mt-3 max-w-2xl font-['Inter'] text-sm leading-relaxed text-[#4a6e8b]">
            Our multidisciplinary team combines decades of expertise in clinical diagnostics, genomic medicine,
            bioinformatics, and laboratory science.
          </p>
        </div>

        {/* 3-Cards-In-A-Row Carousel Viewport */}
        <div
          ref={containerRef}
          className="relative overflow-hidden w-full select-none py-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${currentIndex * step}px)`,
            }}
          >
            {members.map((member, index) => (
              <div
                key={member.name || index}
                className="shrink-0"
                style={{
                  width: `${cardWidth}px`,
                }}
              >
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Controls (Arrows, Counter, Dots) */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          {/* Members Counter Display */}
          <div className="font-['Inter'] text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="font-bold text-[#0c2b48]">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of <span className="font-bold text-[#0c2b48]">{members.length}</span> team members
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label="Carousel pages">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                aria-label={`Go to team card ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : "false"}
                className="group p-1 cursor-pointer"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-7" : "w-2 bg-slate-200 group-hover:bg-slate-300"
                  }`}
                  style={idx === currentIndex ? { backgroundColor: "var(--accent)" } : undefined}
                />
              </button>
            ))}
          </div>

          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={members.length <= cardsPerView}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0c2b48] transition-all hover:border-(--accent) hover:bg-(--accent) hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous team member"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              onClick={goToNext}
              disabled={members.length <= cardsPerView}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0c2b48] transition-all hover:border-(--accent) hover:bg-(--accent) hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next team member"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
