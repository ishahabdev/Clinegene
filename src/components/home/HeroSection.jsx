import { ArrowRight } from "lucide-react";
import Button from "../Button";
import { useTheme } from "../../context/ThemeContext";

function FeatureIcon({ type }) {
  if (type === "technology") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M9 3h6m-5 0v5l-5.5 9.2A2.5 2.5 0 0 0 6.6 21h10.8a2.5 2.5 0 0 0 2.1-3.8L14 8V3m-7.3 12h10.6M9 11h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "collaboration") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0m.5-4.5a4.5 4.5 0 0 1 5.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V8m-16 11h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export default function HeroSection() {
  const { theme, themeConfig } = useTheme();
  const { heroImg, heroImgMobile } = themeConfig;

  const isRed   = theme === "red";
  const isGreen = theme === "green";

  const overlayGradientMobile = isRed
    ? "linear-gradient(180deg, rgba(45, 3, 6, 0.90) 0%, rgba(45, 3, 6, 0.65) 45%, rgba(45, 3, 6, 0.94) 100%)"
    : isGreen
      ? "linear-gradient(180deg, rgba(2, 30, 18, 0.90) 0%, rgba(2, 30, 18, 0.65) 45%, rgba(2, 30, 18, 0.94) 100%)"
      : "linear-gradient(180deg, rgba(2, 19, 42, 0.90) 0%, rgba(2, 19, 42, 0.65) 45%, rgba(2, 19, 42, 0.94) 100%)";

  const overlayGradientDesktop = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(2, 19, 42, 0.97) 0%, rgba(2, 19, 42, 0.84) 48%, rgba(2, 19, 42, 0.30) 80%, rgba(2, 19, 42, 0.15) 100%)";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[580px] sm:min-h-[620px] lg:min-h-[calc(100svh-84px)] items-center overflow-hidden text-white"
      id="home"
    >
      {/* Hero background image — responsive focal position across screen sizes */}
      <img
        alt=""
        aria-hidden="true"
        key={heroImg}
        width="2014"
        height="781"
        srcSet={`${heroImgMobile} 1200w, ${heroImg} 2014w`}
        sizes="100vw"
        className="hero-bg-img absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center transition-all duration-500"
        fetchPriority="high"
        src={heroImg}
      />

      {/* Responsive theme-aware gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 block lg:hidden"
        style={{
          background: overlayGradientMobile,
          transition: "background 0.4s ease-in-out",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background: overlayGradientDesktop,
          transition: "background 0.4s ease-in-out",
        }}
      />

      <div className="site-container py-12 sm:py-16 lg:py-20">
        <div className="max-w-152.5">

          {/* ── Eyebrow line ─────────────────────────────────────────── */}
          <p className="mb-3 sm:mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-xs">
            Human Genetics{" "}
            <span
              className="mx-1"
              style={{
                color: isRed ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
              |
            </span>{" "}
            Omic Sciences{" "}
            <span
              className="mx-1"
              style={{
                color: isRed ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
              |
            </span>{" "}
            Biomedical Research
          </p>

          {/* ── Heading ──────────────────────────────────────────────── */}
          <h1
            className="max-w-147.5 text-[28px] sm:text-[38px] md:text-[44px] lg:text-[44px] font-bold leading-[1.14] tracking-tight"
            id="hero-title"
          >
            Advancing Human Genetics &amp; Precision Medicine
            <span
              className="mt-1.5 block"
              style={{
                color: isRed ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
              Through Research
            </span>
          </h1>

          {/* ── Body copy ────────────────────────────────────────────── */}
          <p className="mt-4 sm:mt-5 max-w-125 text-sm sm:text-base leading-6 text-white/90">
            ClinGene brings academic researchers, clinicians and industrial partners together
            to translate scientific findings for the well-being of the society.
          </p>

          {/* ── CTA buttons ──────────────────────────────────────────── */}
          <div className="mt-7 flex flex-wrap gap-3">
            {/* Primary button — fill uses --accent-btn-bg (dark maroon on red) */}
            <Button className="px-6" href="/research">
              Explore Our Research <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>

            {/* Secondary button — transparent outline, white text */}
            <Button
              className="px-6"
              href="/services"
              variant="transparent"
              style={{
                borderColor: isRed ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.70)",
              }}
            >
              Our Services
            </Button>
          </div>

          {/* ── Feature badges ───────────────────────────────────────── */}
          <div className="mt-8 sm:mt-9 grid max-w-152.5 grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-5 text-[11px] font-medium text-white/95">
            {[
              { icon: "technology",   label: <>Advanced<br className="hidden sm:block" /> Technologies</> },
              { icon: "collaboration", label: <>Research<br className="hidden sm:block" /> Collaboration</> },
              { icon: "capacity",     label: <>Capacity<br className="hidden sm:block" /> Development</> },
            ].map((feature) => (
              <div
                className="flex items-center gap-2.5 sm:border-r border-white/15 sm:last:border-r-0"
                key={feature.icon}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border shadow-sm"
                  style={{
                    borderColor: isRed ? "#ef4444" : "var(--accent)",
                    color: isRed ? "#ef4444" : "var(--accent)",
                    transition: "border-color 0.4s ease-in-out, color 0.4s ease-in-out",
                  }}
                >
                  <FeatureIcon type={feature.icon} />
                </span>
                <span className="leading-tight sm:leading-4">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Genomics card (bottom-right) ─────────────────────────── */}
        <div
          className="absolute bottom-[68px] right-10 hidden w-[200px] flex-col justify-center overflow-hidden rounded-[14px] backdrop-blur-sm lg:flex xl:right-16"
          style={{
            /* Per-theme dark background */
            background: isRed
              ? "rgba(28, 4, 8, 0.88)"
              : isGreen
                ? "rgba(4, 51, 27, 0.92)"
                : "rgba(3, 27, 55, 0.85)",
            /* Per-theme border — consistent use of CSS variable */
            border: isRed
              ? `1.5px solid var(--accent)`
              : `1px solid color-mix(in srgb, var(--accent) 65%, transparent)`,
            /* Themed glow using CSS variable */
            boxShadow: isRed
              ? `0 0 28px var(--accent-glow), 0 4px 24px rgba(0,0,0,0.45)`
              : `0 0 24px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.40)`,
            padding: "20px 22px 18px",
            transition: "border-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out, background 0.4s ease-in-out",
          }}
        >
          {/* Themed accent top bar */}
          <span
            aria-hidden="true"
            className="mb-3 block h-[2px] w-8 shrink-0 rounded-full"
            style={{
              background: "var(--accent)",
              transition: "background 0.4s ease-in-out",
            }}
          />

          {/* Card text */}
          <p className="font-inter text-[10.5px] font-semibold uppercase leading-[1.6] tracking-[0.22em] text-white/95">
            Genomics
            <br />
            for a healthier
            <br />
            tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
