import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  FileCheck,
  FileDown,
  FileText,
  FlaskConical,
  Info,
  TestTubes,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";
import dnaStrand from "../assets/dna_strand.png";
import fallbackServiceImage from "../assets/services/service-hero.webp";
import PageNotFoundPage from "./PageNotFoundPage.jsx";
import { fetchServiceBySlug, fetchPublishedServices } from "../lib/servicesClient.js";
import { buildServiceSeo } from "../data/seoData.js";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export function notFound() {
  return <PageNotFoundPage />;
}

const SERVICE_NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "requirements", label: "Requirements" },
];

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
  // Dynamic theme CSS variables
  const themeColors = {
    accent: "var(--accent)",
    accentDark: "var(--accent-dark)",
    accentHover: "var(--accent-hover)",
    accentSoftBg: "var(--accent-soft)",
    accentSoftBorder: "color-mix(in srgb, var(--accent) 25%, transparent)",
    badgeText: "var(--accent-muted)",
    badgeBg: "var(--accent-soft-2)",
    sectionAltBg: "var(--service-detail-alt-bg)",
    cardBgTint: "color-mix(in srgb, var(--accent) 3%, transparent)",
  };

  // Determine slug from prop, ssrUrl, or window.location.pathname
  const path = ssrUrl
    ? ssrUrl.replace(/^\/|\/$/g, "")
    : (typeof window !== "undefined" ? window.location.pathname.replace(/^\/|\/$/g, "") : "");
  const activeSlug = currentSlug || (path.startsWith("services/") ? path.slice("services/".length) : "");

  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Client redirect from legacy spelling /services/genetic-counselling to canonical DB slug
  useEffect(() => {
    if (activeSlug === "genetic-counselling" && typeof window !== "undefined") {
      window.history.replaceState(null, "", "/services/genetic-counseling");
    }
  }, [activeSlug]);

  useEffect(() => {
    if (!activeSlug) {
      setIsNotFound(true);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setIsNotFound(false);

    async function loadDetail() {
      try {
        const item = await fetchServiceBySlug(activeSlug);
        if (!isMounted) return;

        if (!item) {
          setIsNotFound(true);
          setService(null);
          setLoading(false);
          return;
        }

        setService(item);
        setLoading(false);

        // Fetch related services
        try {
          const allPublished = await fetchPublishedServices();
          if (isMounted && allPublished) {
            setRelatedServices(
              allPublished.filter((s) => s.slug !== item.slug).slice(0, 3)
            );
          }
        } catch {
          // non-critical
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[ServiceDetailPage] Error fetching service:", err);
        }
        if (isMounted) {
          setIsNotFound(true);
          setService(null);
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  // Active section for in-page navigation spy
  const [activeNav, setActiveNav] = useState("about");

  // In-page navigation items
  // Set document title and meta description using buildServiceSeo
  useEffect(() => {
    if (!service) return;
    if (typeof document !== "undefined") {
      const seo = buildServiceSeo(service);
      if (!seo) return;
      const title = seo.title;
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
      metaDesc.setAttribute("content", seo.description);

      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute("href", seo.canonical);
      }
    }
  }, [service]);

  // In-page navigation scroll spy
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = SERVICE_NAV_SECTIONS.length - 1; i >= 0; i--) {
        const sectionId = SERVICE_NAV_SECTIONS[i].id;
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
  }, []);

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

  if (isNotFound) {
    return notFound();
  }

  if (loading && !service) {
    return (
      <div className="service-detail-page bg-white min-h-[70vh] flex items-center justify-center py-20">
        <div className="site-container max-w-5xl w-full animate-pulse space-y-8">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 w-36 bg-slate-200 rounded-full" />
              <div className="h-10 w-4/5 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-10 w-48 bg-slate-200 rounded-full mt-4" />
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-16/10 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return notFound();
  }

  // Application icons cycle
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

        aria-labelledby="service-hero-title"
        className="relative overflow-hidden border-b border-slate-200/70 py-10 transition-colors duration-500 sm:py-14 lg:py-18"
        style={{
          background: "radial-gradient(ellipse 60% 70% at 80% 40%, var(--accent-soft) 0%, #ffffff 80%)",
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

        <div className="site-container relative z-10 max-w-6xl">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <li>
                <a href="/" className="rounded-sm transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)">
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-slate-300">›</li>
              <li>
                <a href="/services" className="rounded-sm transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)">
                  Services
                </a>
              </li>
              <li aria-hidden="true" className="text-slate-300">›</li>
              <li aria-current="page" className="font-semibold text-[#0c2b48] truncate max-w-50 sm:max-w-none">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-12 lg:gap-14">
            
            {/* Left Column: Hero Text (~58%) */}
            <div className="lg:col-span-7">
              <ScrollReveal delay={50}>
                
                {/* Pill Category Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] shadow-2xs sm:text-[11px]"
                  style={{
                    backgroundColor: themeColors.badgeBg,
                    color: themeColors.badgeText,
                    borderColor: themeColors.accentSoftBorder,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  {service.type === "lab" ? "Genetic Analysis Service" : "Computational Service"}
                </div>

                {/* Main Heading (Only 1 H1 on page) */}
                <h1 
                  id="service-hero-title"
                  className="mt-4 max-w-3xl font-['Poppins',sans-serif] text-3xl font-bold tracking-tight text-[#0c2b48] leading-[1.12] sm:text-4xl lg:text-[48px]"
                >
                  {service.name}
                </h1>

                {/* Subtitle / Tagline */}
                {(service.tagline || service.description) && (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    {service.tagline || service.description}
                  </p>
                )}

                {/* Primary CTA Button */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    href={`/contact?service=${service.slug}`}
                    className="min-h-12 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  >
                    Request this service
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

              </ScrollReveal>
            </div>

            {/* Right Column: Hero Image Card (~42%) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <ScrollReveal delay={120}>
                <div className="relative mx-auto w-full max-w-120">
                  <div 
                    aria-hidden="true" 
                    className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: themeColors.accent }}
                  />
                  
                  <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-2.5 shadow-[0_24px_70px_rgba(12,43,72,0.16)] backdrop-blur transition-all duration-300 hover:shadow-[0_28px_80px_rgba(12,43,72,0.2)] sm:rounded-3xl sm:p-3">
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">
                      <img
                        src={service.image || fallbackServiceImage}
                        alt={service.imageAlt || service.name}
                        width={service.width}
                        height={service.height}
                        className={`h-full w-full object-cover ${service.slug === "library-generation" ? "object-[center_top]" : "object-center"} transition-transform duration-700 hover:scale-[1.03]`}
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
          className="border-b border-slate-200/80 bg-slate-50/80 py-6 sm:py-7"
        >
          <div className="site-container max-w-6xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              
              {/* Up to 3 Quick Facts Cards */}
              {quickFacts.length > 0 && (
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {quickFacts.map((fact, index) => {
                    const FactIcon = fact.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(12,43,72,0.04)] transition-shadow hover:shadow-[0_10px_28px_rgba(12,43,72,0.08)]"
                      >
                        <div
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: themeColors.accentSoftBg,
                            color: "var(--accent)",
                          }}
                        >
                          <FactIcon className="h-4 w-4 stroke-2" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            {fact.label}
                          </span>
                          <span className="mt-1 block text-sm font-semibold leading-snug text-[#0c2b48]">
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
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0c2b48] shadow-sm transition-all hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) md:self-center sm:text-[13px]"
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
        className="sticky top-18 sm:top-19 lg:top-21 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
      >
        <div className="site-container max-w-6xl">
          <nav aria-label="Service sections navigation" className="no-scrollbar overflow-x-auto py-3">
            <ul className="flex min-w-max items-center gap-2">
              {SERVICE_NAV_SECTIONS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`inline-flex min-h-10 items-center rounded-xl px-4 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:text-[13px] ${
                        isActive
                          ? "text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-[#0c2b48]"
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
        className="scroll-mt-36 bg-white py-12 sm:py-16"
      >
        <div className="site-container max-w-6xl">
          <ScrollReveal>
            <div className="max-w-4xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-(--accent)">
                Service overview
              </p>
              <h2 
                id="service-about-heading"
                className="font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#0c2b48] sm:text-3xl"
              >
                About {service.name}
              </h2>

              {/* Overview Paragraphs */}
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {service.overview.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sub-Services if applicable (e.g. Genetic Counselling) */}
            {service.subServices && service.subServices.length > 0 && (
              <div className="mt-10 border-t border-slate-200/80 pt-8">
                <div className="mb-5">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-(--accent)">
                    Explore this service
                  </p>
                  <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#0c2b48] sm:text-xl">
                  Specialized Clinical Focus Areas
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
                  {service.subServices.map((sub) => {
                    return (
                      <a
                        key={sub.id}
                        href={`/contact?service=${service.slug}-${sub.id}`}
                        className="group flex min-h-56 flex-col items-start rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-[0_6px_24px_rgba(12,43,72,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_18px_40px_rgba(12,43,72,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:p-6"
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: themeColors.accentSoftBg,
                            color: "var(--accent)",
                          }}
                        >
                          <SubServiceIcon
                            id={sub.id}
                            className="h-8 w-8 transition-colors duration-300"
                          />
                        </div>

                        <h4 className="mt-4 font-outfit text-sm font-bold leading-snug text-[#0c2b48] sm:text-base">
                          {sub.label}
                        </h4>
                        {sub.description && (
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {sub.description}
                          </p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-(--accent)">
                          Request this focus area
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features in a 2-Column Grid */}
            {service.features && service.features.length > 0 && (
              <div className="mt-10 border-t border-slate-200/80 pt-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {service.features.map((feature, index) => {
                    const parts = feature.split(" - ");
                    const title = parts[0];
                    const desc = parts.length > 1 ? parts.slice(1).join(" - ") : null;

                    return (
                      <div 
                        key={index}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 shadow-[0_4px_16px_rgba(12,43,72,0.035)] transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md"
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

      {/* ================= 5. REQUIREMENTS & DELIVERABLES ================= */}
      <section 
        id="requirements" 
        aria-labelledby="requirements-deliverables-heading" 
        className="scroll-mt-36 border-t border-slate-200/70 bg-slate-50/60 py-12 sm:py-16"
      >
        <div className="site-container max-w-6xl">
          <ScrollReveal>
            <div className="mb-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-(--accent)">
                Before you get started
              </p>
              <h2 
                id="requirements-deliverables-heading"
                className="font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#0c2b48] sm:text-3xl"
              >
                Requirements &amp; Deliverables
              </h2>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              
              {/* Left Card: Sample Requirements */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_28px_rgba(12,43,72,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <FlaskConical className="h-4 w-4 stroke-2" aria-hidden="true" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#0c2b48] sm:text-base">
                      {service.requirementsLabel || "Sample Requirements"}
                    </h3>
                  </div>

                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
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
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_28px_rgba(12,43,72,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <FileCheck className="h-4 w-4 stroke-2" aria-hidden="true" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#0c2b48] sm:text-base">
                      Deliverables
                    </h3>
                  </div>

                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
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
                    className="mt-5 flex items-start gap-2.5 rounded-xl border p-4 text-xs font-medium leading-6 sm:text-sm"
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
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-1.5 font-['Poppins',sans-serif] text-base font-bold text-[#0c2b48] sm:text-lg">
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

      {/* ================= 6. RELATED SERVICES (COMPACT CARDS) ================= */}
      {relatedServices.length > 0 && (
      <section 
        aria-labelledby="related-services-heading" 
        className="border-t border-slate-200/70 bg-white py-12 sm:py-16"
      >
        <div className="site-container max-w-6xl">
          <ScrollReveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-(--accent)">
                  Discover more
                </p>
                <h2 
                  id="related-services-heading"
                  className="font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#0c2b48] sm:text-3xl"
                >
                  Related Services
                </h2>
              </div>
              <a 
                href="/services" 
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--accent-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                style={{ color: "var(--accent)" }}
              >
                View all services <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Compact Cards: 3 per row on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((rel) => {
                return (
                  <a
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_6px_22px_rgba(12,43,72,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_16px_38px_rgba(12,43,72,0.11)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  >
                    {/* Small thumbnail image */}
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
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
      )}

      {/* ================= 7. FINAL "REQUEST THIS SERVICE" CTA ================= */}
      <section
        aria-label={`Request ${service.name}`}
        className="border-t border-slate-200/70 bg-slate-50 py-10 sm:py-14"
      >
        <div className="site-container max-w-6xl">
          <div
            className="flex flex-col items-start justify-between gap-5 rounded-2xl border p-6 shadow-sm sm:flex-row sm:items-center sm:p-8"
            style={{
              borderColor: themeColors.accentSoftBorder,
              backgroundColor: themeColors.accentSoftBg,
            }}
          >
            <div>
              <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-[#0c2b48] sm:text-2xl">
                Ready to request this service?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Contact us to get started with {service.name}.
              </p>
            </div>
            <a
              href={`/contact?service=${service.slug}`}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
              style={{
                backgroundColor: "var(--accent-btn-bg, var(--accent))",
                color: "var(--accent-btn-text, white)",
              }}
            >
              Request this service
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
