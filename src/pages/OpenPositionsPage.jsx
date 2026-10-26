import {
  ArrowRight,
  Bell,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import serviceHero from "../assets/service-hero.webp";
import { useTheme } from "../context/ThemeContext.jsx";

export default function OpenPositionsPage() {
  const { theme } = useTheme();

  const sectionBg =
    theme === "red"
      ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97), rgba(60, 6, 10, 0.95))"
      : theme === "green"
        ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97), rgba(4, 42, 24, 0.95))"
        : "linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94))";

  const overlayColor =
    theme === "red" ? "rgba(45, 3, 6, " : theme === "green" ? "rgba(2, 30, 18, " : "rgba(2, 19, 42, ";

  /* ── theme-aware accent colours ───────────────────────────── */
  const accent =
    theme === "red"
      ? { primary: "#e53e3e", glow: "rgba(229,62,62,.18)", softBg: "rgba(229,62,62,.08)", border: "rgba(229,62,62,.25)", text: "#feb2b2" }
      : theme === "green"
        ? { primary: "#38a169", glow: "rgba(56,161,105,.18)", softBg: "rgba(56,161,105,.08)", border: "rgba(56,161,105,.25)", text: "#9ae6b4" }
        : { primary: "#12c5df", glow: "rgba(18,197,223,.18)", softBg: "rgba(18,197,223,.08)", border: "rgba(18,197,223,.25)", text: "#a5f3fc" };

  return (
    <>
      {/* ══════════════════════════  HERO  ══════════════════════════ */}
      <section
        aria-labelledby="open-positions-hero-title"
        className="relative isolate flex min-h-75 items-center overflow-hidden text-white sm:min-h-80"
        id="open-positions-hero"
        style={{ backgroundImage: sectionBg }}
      >
        <img
          alt=""
          aria-hidden="true"
          width="1376"
          height="768"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center]"
          src={serviceHero}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(to right, ${overlayColor}/95, ${overlayColor}/75, ${overlayColor}/10)`,
          }}
        />
        <div className="mx-auto w-full max-w-310 px-6 py-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-3 font-inter text-sm"
          >
            <a
              className="text-[var(--accent)] transition-colors hover:text-white"
              href="/"
            >
              Home
            </a>
            <span aria-hidden="true" className="text-[var(--accent)]">
              ›
            </span>
            <span aria-current="page" className="text-slate-300">
              Open Positions
            </span>
          </nav>

          <div className="max-w-155">
            <p className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
              <span aria-hidden="true" className="h-0.5 w-9 bg-[var(--accent)]" />
              Open Positions
            </p>
            <ScrollReveal
              as="h1"
              className="font-outfit text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]"
              id="open-positions-hero-title"
            >
              Join Our{" "}
              <span className="text-[var(--accent)]">Research Community</span>
            </ScrollReveal>
            <p className="mt-3 max-w-122.5 font-inter text-[13px] leading-[1.55] text-slate-200 sm:text-sm">
              We're building a world-class team of scientists, clinicians, and
              bioinformaticians. While we don't have any open positions right
              now, we're always looking for passionate talent.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button className="font-inter" href="#contact">
                Contact Us{" "}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Button>
              <Button
                className="border-white/70 font-inter"
                href="#team"
                variant="transparent"
              >
                View Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════  NO-POSITIONS — REDESIGNED  ══════════════ */}
      <section
        aria-labelledby="no-positions-title"
        className="relative overflow-hidden bg-[#f8fafc] py-20 md:py-28"
        id="no-positions"
      >
        {/* Inline keyframes + utility classes */}
        <style>{`
          @keyframes op-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50%      { transform: translateY(-18px) scale(1.05); }
          }
          @keyframes op-pulse-ring {
            0%   { transform: scale(.85); opacity: .55; }
            70%  { transform: scale(1.55); opacity: 0; }
            100% { transform: scale(1.55); opacity: 0; }
          }
          @keyframes op-shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes op-orbit {
            from { transform: rotate(0deg) translateX(68px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(68px) rotate(-360deg); }
          }
          @keyframes op-orbit-reverse {
            from { transform: rotate(0deg) translateX(88px) rotate(0deg); }
            to   { transform: rotate(-360deg) translateX(88px) rotate(360deg); }
          }
          @keyframes op-glow-move {
            0%, 100% { opacity: .35; filter: blur(60px); }
            50%      { opacity: .55; filter: blur(80px); }
          }
          .op-float  { animation: op-float 5s ease-in-out infinite; }
          .op-ring   { animation: op-pulse-ring 2.4s cubic-bezier(.4,0,.6,1) infinite; }
          .op-shimmer {
            background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,.08) 50%, transparent 70%);
            background-size: 200% 100%;
            animation: op-shimmer 3s linear infinite;
          }
          .op-orbit  { animation: op-orbit 12s linear infinite; }
          .op-orbit-reverse { animation: op-orbit-reverse 16s linear infinite; }

          @media (prefers-reduced-motion: reduce) {
            .op-float,
            .op-ring,
            .op-shimmer,
            .op-orbit,
            .op-orbit-reverse { animation: none !important; }
          }
        `}</style>

        {/* ── Decorative background blobs ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
            style={{ background: accent.glow, animation: "op-glow-move 8s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full"
            style={{ background: accent.glow, animation: "op-glow-move 10s ease-in-out 2s infinite" }}
          />
          {/* Dot grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="op-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#0c2b48" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#op-dots)" />
          </svg>
        </div>

        <div className="mx-auto max-w-310 px-6 lg:px-12">
          {/* ── Main glass card ── */}
          <ScrollReveal>
            <div
              className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border bg-white/80 px-6 py-16 text-center shadow-2xl backdrop-blur-sm sm:px-10 sm:py-20 md:py-24"
              style={{ borderColor: accent.border }}
            >
              {/* Shimmer overlay */}
              <div aria-hidden="true" className="op-shimmer pointer-events-none absolute inset-0 rounded-[2rem]" />

              {/* ── Animated bell icon with orbiting elements ── */}
              <ScrollReveal as="div" className="relative mx-auto mb-10 flex h-44 w-44 items-center justify-center">
                {/* Outer glow ring */}
                <span
                  className="op-ring absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${accent.primary}`, opacity: 0.3 }}
                  aria-hidden="true"
                />
                {/* Second pulse ring – delayed */}
                <span
                  className="op-ring absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${accent.primary}`, opacity: 0.2, animationDelay: "1.2s" }}
                  aria-hidden="true"
                />
                {/* Orbiting dots */}
                <span className="op-orbit absolute inset-0" aria-hidden="true">
                  <span
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: accent.primary, opacity: 0.5 }}
                  />
                </span>
                <span className="op-orbit-reverse absolute inset-0" aria-hidden="true">
                  <span
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: accent.primary, opacity: 0.3 }}
                  />
                </span>
                {/* Main icon circle */}
                <span
                  className="op-float relative z-10 grid h-28 w-28 place-items-center rounded-full shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${accent.softBg}, ${accent.glow})`,
                    boxShadow: `0 8px 32px ${accent.glow}`,
                  }}
                >
                  <Bell
                    aria-hidden="true"
                    className="h-12 w-12"
                    strokeWidth={1.4}
                    style={{ color: accent.primary }}
                  />
                </span>
              </ScrollReveal>

              {/* ── Sub-heading ── */}
              <ScrollReveal as="div" delay={60}>
                <span
                  className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest"
                  style={{
                    backgroundColor: accent.softBg,
                    color: accent.primary,
                    border: `1px solid ${accent.border}`,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Future Openings
                </span>
              </ScrollReveal>

              {/* ── Title ── */}
              <ScrollReveal as="h2" delay={80}>
                <h2
                  className="mt-5 font-outfit text-[30px] font-extrabold leading-[1.15] text-[#0c2b48] sm:text-[38px] md:text-[44px]"
                  id="no-positions-title"
                >
                  No Open Positions{" "}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${accent.primary}, #6366f1)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Yet
                  </span>
                </h2>
              </ScrollReveal>

              {/* ── Description ── */}
              <ScrollReveal as="p" delay={120}>
                <p className="mx-auto mt-5 max-w-md font-inter text-[15px] leading-[1.8] text-[#4a6e8b] sm:text-base">
                  We're currently reviewing our staffing needs. New opportunities
                  will be posted here as soon as they become available.
                </p>
              </ScrollReveal>

              {/* ── CTA buttons ── */}
              <ScrollReveal delay={160}>
                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    className="!min-h-13 !px-8 !text-sm font-inter shadow-lg"
                    href="#contact"
                    style={{ boxShadow: `0 4px 24px ${accent.glow}` }}
                  >
                    Contact Us{" "}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button
                    className="!min-h-13 !px-8 !text-sm font-inter"
                    href="#team"
                    variant="transparent"
                    style={{
                      borderColor: accent.border,
                      color: accent.primary,
                    }}
                  >
                    View Our Team
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>


        </div>
      </section>

      {/* ══════════════  FOOTER LINKS  ══════════════ */}
      <section
        aria-label="Related pages"
        className="pb-6 pt-4 md:pb-8 md:pt-6 border-t border-[var(--accent)]/20"
        style={{ backgroundImage: sectionBg }}
      >
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <ScrollReveal className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[var(--accent)] hover:underline focus-visible:text-[var(--accent)] focus-visible:underline focus-visible:outline-none"
              href="#team"
            >
              View Our Team
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[var(--accent)] hover:underline focus-visible:text-[var(--accent)] focus-visible:underline focus-visible:outline-none"
              href="#contact"
            >
              Contact Us
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[var(--accent)] hover:underline focus-visible:text-[var(--accent)] focus-visible:underline focus-visible:outline-none"
              href="/"
            >
              Back to Home
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
