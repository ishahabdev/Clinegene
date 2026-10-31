import { useEffect, useState, useRef } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  Clock,
  Dna,
  FileCheck,
  FileDown,
  FileText,
  FlaskConical,
  GitBranch,
  Info,
  Microscope,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  TestTubes,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import dnaStrand from "../assets/dna_strand.png";
import { servicesData, getServiceBySlug } from "../data/servicesData.js";
import { useTheme } from "../context/ThemeContext.jsx";

// Helper to sanitize placeholder brackets e.g. "[To be confirmed by the lab]"
function cleanText(text) {
  if (!text) return "";
  const trimmed = text.replace(/^\[|\]$/g, "").trim();
  if (/to be confirmed by the lab/i.test(trimmed)) {
    if (trimmed.includes(":")) {
      const parts = trimmed.split(":");
      return `${parts[0].trim()}: Contact us for details`;
    }
    return "Contact us for details";
  }
  return trimmed
    .replace(/\[To be confirmed by the lab\]/gi, "Contact us for details")
    .replace(/\[.*?to be confirmed.*?\]/gi, "Contact us for details");
}

function SubServiceIcon({ id, className = "h-11 w-11", style }) {
  if (id === "prenatal-diagnosis") {
    return (
      <svg className={className} style={style} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" strokeDasharray="3 3.5" opacity="0.4" />
        <circle cx="28" cy="18" r="4.5" />
        <path d="M28 22.5c-4 0-7.5 3-7.5 7.5 0 4.5 3.5 7.5 8 7.5 3.5 0 6.5-2 6.5-5 0-3-2.5-5-5-5-3 0-5 2-5 2" />
        <path d="M19 28a6 6 0 0 0 6 6" />
      </svg>
    );
  }
  if (id === "newborn-screening") {
    return (
      <svg className={className} style={style} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="25" r="13" />
        <circle cx="19" cy="23" r="1.8" fill="currentColor" />
        <circle cx="29" cy="23" r="1.8" fill="currentColor" />
        <path d="M20 29.5a5 5 0 0 0 8 0" />
        <path d="M24 12c0-2.5 2-4 4.5-4 1.5 0 2.5 1 2.5 2" />
        <path d="M11 25a3.5 3.5 0 1 1-3-3M37 25a3.5 3.5 0 1 0 3-3" />
      </svg>
    );
  }
  if (id === "genetic-diseases") {
    return (
      <svg className={className} style={style} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10c0 7 18 11 18 17s-18 10-18 17" />
        <path d="M33 10c0 7-18 11-18 17s18 10 18 17" />
        <line x1="18" y1="14" x2="30" y2="14" />
        <line x1="16" y1="19" x2="32" y2="19" />
        <line x1="21" y1="27" x2="27" y2="27" />
        <line x1="16" y1="35" x2="32" y2="35" />
        <line x1="18" y1="40" x2="30" y2="40" />
        <circle cx="15" cy="10" r="2" fill="currentColor" />
        <circle cx="33" cy="10" r="2" fill="currentColor" />
        <circle cx="15" cy="44" r="2" fill="currentColor" />
        <circle cx="33" cy="44" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "chromosomal-abnormalities") {
    return (
      <svg className={className} style={style} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 9c2 0 3.5 1.5 3.5 4v5c0 2-1.5 3.5-3 4.5 1.5 1 3 2.5 3 4.5v7c0 2.5-1.5 4-3.5 4s-3.5-1.5-3.5-4v-7c0-2 1.5-3.5 3-4.5-1.5-1-3-2.5-3-4.5v-5c0-2.5 1.5-4 3.5-4Z" />
        <path d="M31 9c2 0 3.5 1.5 3.5 4v5c0 2-1.5 3.5-3 4.5 1.5 1 3 2.5 3 4.5v7c0 2.5-1.5 4-3.5 4s-3.5-1.5-3.5-4v-7c0-2 1.5-3.5 3-4.5-1.5-1-3-2.5-3-4.5v-5c0-2.5 1.5-4 3.5-4Z" />
      </svg>
    );
  }
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="15" rx="6" ry="7" />
      <path d="M20 20 12 37c-1 2 0 3.5 1.5 3.5h3L24 30l7.5 10.5h3c1.5 0 2.5-1.5 1.5-3.5L28 20" />
      <circle cx="24" cy="15" r="2.2" fill="currentColor" />
    </svg>
  );
}

export default function ServiceDetailPage({ currentSlug, ssrUrl }) {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  // Dynamic theme colors
  const themeColors = {
    accent: isRed ? "#b91c1c" : isGreen ? "#10b981" : "#10c8e0",
    accentDark: isRed ? "#2d0306" : isGreen ? "#072419" : "#0c2b48",
    accentHover: isRed ? "#991b1b" : isGreen ? "#059669" : "#0891b2",
    accentSoftBg: isRed ? "#fff1f2" : isGreen ? "#ecfdf5" : "#e5f8fb",
    accentSoftBorder: isRed ? "rgba(185, 28, 28, 0.25)" : isGreen ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 200, 224, 0.25)",
    badgeText: isRed ? "#991b1b" : isGreen ? "#065f46" : "#0a7a94",
    badgeBg: isRed ? "#ffe4e6" : isGreen ? "#d1fae5" : "#e5f8fb",
    sectionAltBg: isRed ? "#fdf8f8" : isGreen ? "#f8fdfa" : "#f8fafc",
    cardBgTint: isRed ? "rgba(185, 28, 28, 0.03)" : isGreen ? "rgba(16, 185, 129, 0.03)" : "rgba(16, 200, 224, 0.03)",
  };

  // Determine slug from prop, ssrUrl, or window.location.pathname
  const path = ssrUrl
    ? ssrUrl.replace(/^\/|\/$/g, "")
    : (typeof window !== "undefined" ? window.location.pathname.replace(/^\/|\/$/g, "") : "");
  const activeSlug = currentSlug || (path.startsWith("services/") ? path.slice("services/".length) : "");
  const service = getServiceBySlug(activeSlug) || servicesData[0];

  // Accordion state for FAQs: first item open by default
  const [openFaq, setOpenFaq] = useState(0);

  // Active section for in-page navigation spy
  const [activeNav, setActiveNav] = useState("about");

  // Sticky CTA visibility (shown when scrolled past hero)
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef(null);

  // In-page navigation items
  const navSections = [
    { id: "about", label: "About" },
    { id: "applications", label: "Applications" },
    { id: "requirements", label: "Requirements" },
    { id: "faq", label: "FAQ" },
  ];

  // Set document title and meta description
  useEffect(() => {
    if (typeof document !== "undefined") {
      const title = `${service.name} | ClinGene`;
      document.title = title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", title);
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute("content", title);
      const siteName = document.querySelector('meta[property="og:site_name"]');
      if (siteName) siteName.setAttribute("content", "ClinGene");

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", service.tagline || service.description);

      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute("href", `https://www.clingene.co/services/${service.slug}`);
      }
    }
  }, [service]);

  // Scroll spy & Sticky CTA scroll listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // 1. Show sticky CTA after scrolling past hero
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        setShowStickyCta(heroRect.bottom < 80);
      } else {
        setShowStickyCta(window.scrollY > 400);
      }

      // 2. Active in-page navigation highlight based on scroll position
      const scrollPosition = window.scrollY + 160;
      for (let i = navSections.length - 1; i >= 0; i--) {
        const sectionId = navSections[i].id;
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveNav(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navSections]);

  // Smooth scroll handler for in-page navigation
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 130; // accounts for fixed site header (~72px) + sticky in-page nav (~50px)
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveNav(sectionId);
    }
  };

  // Related services
  const relatedServices = (service.relatedSlugs || [])
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean)
    .slice(0, 3);

  // Application icons cycle
  const appIcons = [Dna, FileCheck, Microscope, GitBranch, FlaskConical, Sparkles, Activity, ShieldCheck];

  // Quick facts array (only non-empty fields)
  const quickFacts = [
    service.sampleType && {
      label: "Sample Type",
      value: service.sampleType,
      icon: TestTubes,
    },
    service.turnaroundTime && {
      label: "Turnaround Time",
      value: service.turnaroundTime,
      icon: Clock,
    },
    service.reportFormat && {
      label: "Report Format",
      value: service.reportFormat,
      icon: FileText,
    },
  ].filter(Boolean);

  return (
    <div className="service-detail-page bg-white text-[#0c2b48] selection:bg-(--accent) selection:text-white font-['Inter',sans-serif]">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section 
        ref={heroRef}
        aria-labelledby="service-hero-title"
        className="relative overflow-hidden pt-6 pb-9 sm:pt-7 sm:pb-11 lg:pt-8 lg:pb-12 border-b border-slate-200/60"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 80% 40%, ${themeColors.accentSoftBg} 0%, #ffffff 80%)`,
        }}
      >
        {/* Decorative DNA watermark strand on right */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-[40%] opacity-15 mix-blend-multiply bg-no-repeat bg-top-right hidden md:block"
          style={{
            backgroundImage: `url(${dnaStrand})`,
            backgroundSize: "contain",
          }}
        />

        <div className="site-container relative z-10 max-w-5xl">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-3.5">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <li>
                <a href="/" className="hover:text-(--accent) transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-slate-300">›</li>
              <li>
                <a href="/services" className="hover:text-(--accent) transition-colors">
                  Services
                </a>
              </li>
              <li aria-hidden="true" className="text-slate-300">›</li>
              <li aria-current="page" className="font-semibold text-[#0c2b48] truncate max-w-50 sm:max-w-none">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Hero Text (~58%) */}
            <div className="lg:col-span-7">
              <ScrollReveal delay={50}>
                
                {/* Pill Category Badge */}
                <div className="inline-flex items-center rounded-full px-3 py-0.5 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider shadow-2xs"
                  style={{
                    backgroundColor: themeColors.badgeBg,
                    color: themeColors.badgeText,
                  }}
                >
                  {service.type === "lab" ? "Genetic Analysis Service" : "Computational Service"}
                </div>

                {/* Main Heading (Only 1 H1 on page) */}
                <h1 
                  id="service-hero-title"
                  className="mt-2.5 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#0c2b48] sm:text-3xl lg:text-[34px] leading-tight"
                >
                  {service.name}
                </h1>

                {/* Subtitle / Tagline */}
                <p className="mt-2 text-xs sm:text-[14px] text-slate-600 leading-normal max-w-lg font-normal">
                  {service.tagline}
                </p>

                {/* Primary CTA Button */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex min-h-9 items-center justify-center rounded-full px-5 py-2 text-xs sm:text-[13px] font-bold text-white shadow-xs transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                    style={{ backgroundColor: "var(--accent-btn-bg, var(--accent))" }}
                  >
                    Request this service
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

              </ScrollReveal>
            </div>

            {/* Right Column: Hero Image Card (~42%) */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal delay={120}>
                <div className="relative mx-auto w-full max-w-90 sm:max-w-97.5">
                  <div 
                    aria-hidden="true" 
                    className="absolute -inset-1.5 rounded-2xl blur-lg opacity-25 pointer-events-none"
                    style={{ backgroundColor: themeColors.accent }}
                  />
                  
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_10px_28px_rgba(12,43,72,0.1)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(12,43,72,0.14)]">
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.imageAlt || service.name}
                        width={service.width}
                        height={service.height}
                        className={`h-full w-full object-cover ${service.slug === "library-generation" ? "object-[center_top]" : "object-center"} transition-transform duration-700 hover:scale-105`}
                        loading="eager"
                        fetchPriority="high"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. QUICK FACTS BAR ================= */}
      {(quickFacts.length > 0 || service.requisitionPdf) && (
        <section 
          aria-label="Service Quick Facts" 
          className="border-b border-slate-200/80 bg-slate-50/70 py-4 sm:py-5"
        >
          <div className="site-container max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Up to 3 Quick Facts Cards */}
              {quickFacts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                  {quickFacts.map((fact, index) => {
                    const FactIcon = fact.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-2xs"
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                          style={{
                            backgroundColor: themeColors.accentSoftBg,
                            color: "var(--accent)",
                          }}
                        >
                          <FactIcon className="h-4 w-4 stroke-2" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                            {fact.label}
                          </span>
                          <span className="block text-xs sm:text-[12.5px] font-semibold text-[#0c2b48] leading-snug">
                            {fact.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Optional Requisition Form Download */}
              {service.requisitionPdf && (
                <a
                  href={typeof service.requisitionPdf === "string" ? service.requisitionPdf : service.requisitionPdf?.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-bold text-[#0c2b48] shadow-2xs hover:border-(--accent) hover:text-(--accent) hover:bg-slate-50 transition-all shrink-0 self-start md:self-center"
                >
                  <FileDown className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
                  <span>Download requisition form</span>
                </a>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ================= 3. STICKY IN-PAGE NAVIGATION ================= */}
      <div 
        className="sticky top-18 sm:top-19 lg:top-21 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs"
      >
        <div className="site-container max-w-5xl">
          <nav aria-label="Service sections navigation" className="overflow-x-auto no-scrollbar py-2.5">
            <ul className="flex items-center gap-1.5 sm:gap-2 min-w-max">
              {navSections.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`inline-flex items-center rounded-lg px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold transition-all select-none ${
                        isActive
                          ? "text-white shadow-2xs"
                          : "text-slate-600 hover:text-[#0c2b48] hover:bg-slate-100"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: "var(--accent-btn-bg, var(--accent))" }
                          : {}
                      }
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ================= 4. ABOUT & WHAT YOU GET (MERGED) ================= */}
      <section 
        id="about" 
        aria-labelledby="service-about-heading" 
        className="scroll-mt-36 py-8 sm:py-10 bg-white"
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <h2 
                id="service-about-heading"
                className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                About {service.name}
              </h2>

              {/* Overview Paragraphs */}
              <div className="mt-3.5 space-y-2.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 max-w-4xl">
                {service.overview.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sub-Services if applicable (e.g. Genetic Counselling) */}
            {service.subServices && service.subServices.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-7">
                <h3 className="font-['Poppins',sans-serif] text-sm sm:text-base font-bold text-[#0c2b48] mb-4">
                  Specialized Clinical Focus Areas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  {service.subServices.map((sub) => {
                    const themeAccentColor = isRed ? "#c81e25" : isGreen ? "#059669" : "#00bcd4";
                    const themeCardBorderHover = isRed ? "hover:border-[#c81e25]" : isGreen ? "hover:border-[#059669]" : "hover:border-[#00bcd4]";

                    return (
                      <a
                        key={sub.id}
                        href={`/contact?service=genetic-counselling-${sub.id}`}
                        className={`group flex flex-col items-center text-center rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(12,43,72,0.04)] hover:shadow-lg ${themeCardBorderHover} hover:-translate-y-1 transition-all duration-300`}
                      >
                        <div className="flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <SubServiceIcon
                            id={sub.id}
                            className="h-11 w-11 transition-colors duration-300"
                            style={{ color: themeAccentColor }}
                          />
                        </div>

                        <h4 className="mt-3 mb-3.5 font-outfit text-xs sm:text-sm font-bold text-[#0c2b48] leading-tight min-h-8 flex items-center justify-center">
                          {sub.label}
                        </h4>

                        <span
                          className="mt-auto flex h-7 w-7 items-center justify-center rounded-full text-white shadow-xs transition-transform duration-300 group-hover:scale-115"
                          style={{ backgroundColor: themeAccentColor }}
                        >
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features in a 2-Column Grid */}
            {service.features && service.features.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                  {service.features.map((feature, index) => {
                    const parts = feature.split(" - ");
                    const title = parts[0];
                    const desc = parts.length > 1 ? parts.slice(1).join(" - ") : null;

                    return (
                      <div 
                        key={index}
                        className="group flex items-start gap-3 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 sm:p-4 shadow-2xs transition-all duration-300 hover:shadow-sm hover:border-slate-300"
                      >
                        <span 
                          className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full mt-0.5 shadow-2xs transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: themeColors.accentSoftBg,
                            color: "var(--accent)",
                          }}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['Poppins',sans-serif] text-xs sm:text-[13.5px] font-bold text-[#0c2b48] leading-snug">
                            {title}
                          </h3>
                          {desc && (
                            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 leading-normal">
                              {desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </ScrollReveal>
        </div>
      </section>

      {/* ================= 5. APPLICATIONS ================= */}
      <section 
        id="applications" 
        aria-labelledby="service-applications-heading" 
        className="scroll-mt-36 py-8 sm:py-10 border-t border-slate-200/60 bg-slate-50/50"
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <h2 
                id="service-applications-heading"
                className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Applications
              </h2>
            </div>

            {/* 4 Cards in Responsive Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {service.applications.map((app, index) => {
                const IconComp = appIcons[index % appIcons.length];

                return (
                  <div 
                    key={index}
                    className="group flex flex-col h-full rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(12,43,72,0.06)]"
                  >
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <IconComp className="h-4 w-4 stroke-2" aria-hidden="true" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] text-xs sm:text-sm font-bold text-[#0c2b48] leading-snug">
                      {app.title}
                    </h3>
                    <p className="mt-1 text-[11.5px] sm:text-xs leading-relaxed text-slate-600 flex-1">
                      {app.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 6. REQUIREMENTS & DELIVERABLES ================= */}
      <section 
        id="requirements" 
        aria-labelledby="requirements-deliverables-heading" 
        className="scroll-mt-36 py-8 sm:py-10 border-t border-slate-200/60 bg-white"
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <h2 
                id="requirements-deliverables-heading"
                className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Requirements &amp; Deliverables
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Left Card: Sample Requirements */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div 
                      className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <FlaskConical className="h-4 w-4 stroke-2" aria-hidden="true" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] text-xs sm:text-sm font-bold text-[#0c2b48]">
                      {service.requirementsLabel || "Sample Requirements"}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-[12.5px] text-slate-700">
                    {service.requirements.map((req, index) => {
                      const cleanReq = cleanText(req);
                      if (!cleanReq) return null;
                      return (
                        <li key={index} className="flex items-start gap-2">
                          <Check 
                            className="h-3.5 w-3.5 shrink-0 mt-0.5" 
                            strokeWidth={2.5}
                            style={{ color: "var(--accent)" }}
                            aria-hidden="true" 
                          />
                          <span className="leading-relaxed">{cleanReq}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Right Card: Deliverables */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-5 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div 
                      className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <FileCheck className="h-4 w-4 stroke-2" aria-hidden="true" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] text-xs sm:text-sm font-bold text-[#0c2b48]">
                      Deliverables
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-[12.5px] text-slate-700">
                    {service.deliverables.map((deliv, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check 
                          className="h-3.5 w-3.5 shrink-0 mt-0.5" 
                          strokeWidth={2.5}
                          style={{ color: "var(--accent)" }}
                          aria-hidden="true" 
                        />
                        <span className="leading-relaxed">{cleanText(deliv)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Soft highlighted callout note */}
                {service.deliverablesNote && (
                  <div 
                    className="mt-4 rounded-lg border p-3 text-[11px] sm:text-xs font-medium leading-relaxed flex items-start gap-2.5"
                    style={{
                      borderColor: themeColors.accentSoftBorder,
                      backgroundColor: themeColors.accentSoftBg,
                      color: themeColors.badgeText,
                    }}
                  >
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Note:</strong> {cleanText(service.deliverablesNote)}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Optional Comparison Table */}
            {service.comparisonTable && (
              <div className="mt-5 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-['Poppins',sans-serif] text-sm sm:text-base font-bold text-[#0c2b48] mb-1.5">
                  Whole Exome Sequencing (WES) vs. Whole Genome Sequencing (WGS)
                </h3>
                <p className="text-[11.5px] sm:text-xs text-slate-600 mb-3.5">
                  Key distinctions to help select the optimal sequencing approach for your scientific aims.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr 
                        className="border-b border-slate-200"
                        style={{ backgroundColor: themeColors.accentSoftBg, color: themeColors.badgeText }}
                      >
                        {service.comparisonTable.headers.map((h, i) => (
                          <th key={i} className="py-2.5 px-3 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {service.comparisonTable.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-[#0c2b48]">
                            {row[0]}
                          </td>
                          <td className="py-2 px-3 text-slate-700">
                            {row[1]}
                          </td>
                          <td className="py-2 px-3 text-slate-700">
                            {row[2]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 7. FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
      <section 
        id="faq" 
        aria-labelledby="service-faq-heading" 
        className="scroll-mt-36 py-8 sm:py-10 bg-slate-50/50 border-t border-slate-200/60"
      >
        <div className="site-container max-w-3xl">
          <ScrollReveal>
            <div>
              <h2 
                id="service-faq-heading"
                className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-5 space-y-2.5">
              {service.faq.map((item, index) => {
                const isOpen = openFaq === index;
                const questionId = `faq-q-${index}`;
                const answerId = `faq-a-${index}`;

                return (
                  <div 
                    key={index}
                    className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition-all duration-200"
                  >
                    <button
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left font-['Poppins',sans-serif] text-xs sm:text-[13.5px] font-semibold text-[#0c2b48] hover:bg-slate-50/70 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                    >
                      <span className="leading-snug">{cleanText(item.question)}</span>
                      <span 
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ color: "var(--accent)" }}
                        aria-hidden="true"
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div 
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="px-4 pb-3.5 pt-1 text-[11.5px] sm:text-xs text-slate-600 leading-relaxed border-t border-slate-100"
                      >
                        {cleanText(item.answer)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 8. RELATED SERVICES (COMPACT CARDS) ================= */}
      <section 
        aria-labelledby="related-services-heading" 
        className="py-8 sm:py-10 border-t border-slate-200/60 bg-white"
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h2 
                  id="related-services-heading"
                  className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
                >
                  Related Services
                </h2>
              </div>
              <a 
                href="/services" 
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                style={{ color: "var(--accent)" }}
              >
                View all services <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Compact Cards: 3 per row on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
              {relatedServices.map((rel) => {
                return (
                  <a
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  >
                    {/* Small thumbnail image */}
                    <div className="relative h-16 w-20 sm:h-18 sm:w-22 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <img
                        src={rel.image}
                        alt={rel.imageAlt || rel.name}
                        width={160}
                        height={144}
                        className={`h-full w-full object-cover ${rel.slug === "library-generation" ? "object-[center_top]" : "object-center"} transition-transform duration-500 group-hover:scale-105`}
                        decoding="async"
                        loading="lazy"
                      />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-['Poppins',sans-serif] text-xs sm:text-[13px] font-bold text-[#0c2b48] truncate transition-colors group-hover:text-(--accent)"
                      >
                        {rel.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                        {rel.tagline || rel.description}
                      </p>
                      <span 
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold transition-colors"
                        style={{ color: "var(--accent)" }}
                      >
                        Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 9. STICKY "REQUEST THIS SERVICE" CTA ================= */}
      {showStickyCta && (
        <>
          {/* Mobile Bottom Bar (Fixed across screen width) */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-200 sm:hidden">
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-[#0c2b48]">
                {service.name}
              </span>
              <span className="block text-[10.5px] text-slate-500">
                {service.type === "lab" ? "Clinical Lab Service" : "Computational Service"}
              </span>
            </div>
            <a
              href={`/contact?service=${service.slug}`}
              className="shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: "var(--accent-btn-bg, var(--accent))" }}
            >
              Request service
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          {/* Desktop Floating Pill Button (Bottom Right) */}
          <a
            href={`/contact?service=${service.slug}`}
            className="hidden sm:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ backgroundColor: "var(--accent-btn-bg, var(--accent))" }}
          >
            <span>Request this service</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </>
      )}

    </div>
  );
}
