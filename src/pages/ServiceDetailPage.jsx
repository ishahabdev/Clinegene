import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Dna,
  FileCheck,
  FileText,
  FlaskConical,
  GitBranch,
  Info,
  Layers,
  Microscope,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
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

  // Accordion state for FAQs: only one open at a time
  const [openFaq, setOpenFaq] = useState(0);

  // Set document title and meta description
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${service.name} | ClinGene`;
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

  // Find index for Prev / Next links
  const currentIndex = servicesData.findIndex((s) => s.slug === service.slug);
  const prevService = servicesData[(currentIndex - 1 + servicesData.length) % servicesData.length];
  const nextService = servicesData[(currentIndex + 1) % servicesData.length];

  // Related services
  const relatedServices = (service.relatedSlugs || [])
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean)
    .slice(0, 3);

  const ServiceIcon = service.Icon;

  // Overview points for the about section
  const heroDescription = service.description || service.overview[0];
  const remainingOverview = (service.overview || []).filter(
    (p) => p.trim() !== heroDescription.trim()
  );

  // Application icons cycle
  const appIcons = [Dna, FileCheck, Microscope, GitBranch, FlaskConical, Sparkles, Activity, ShieldCheck];

  // Workflow steps with icons matching the pattern in the screenshot
  const workflowSteps = [
    {
      step: 1,
      icon: FlaskConical,
      title: "Sample Submission",
      desc: "Provide your samples and required information.",
    },
    {
      step: 2,
      icon: Dna,
      title: "Sequencing & Analysis",
      desc: `We perform ${service.name.toLowerCase()} and analyze the data.`,
    },
    {
      step: 3,
      icon: Activity,
      title: "Quality Check",
      desc: "Results are reviewed for accuracy and reliability.",
    },
    {
      step: 4,
      icon: FileText,
      title: "Report Delivery",
      desc: "You receive your results in standard formats with analysis.",
    },
  ];

  return (
    <div className="service-detail-page bg-white text-[#0c2b48] selection:bg-(--accent) selection:text-white font-['Inter',sans-serif]">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section 
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

                {/* Main Heading */}
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

                {/* Two Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex min-h-9 items-center justify-center rounded-full px-5 py-2 text-xs sm:text-[13px] font-bold text-white shadow-xs transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                    style={{ backgroundColor: "var(--accent-btn-bg, var(--accent))" }}
                  >
                    Request this service
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  </a>

                  <a
                    href="/services"
                    className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4.5 py-2 text-xs sm:text-[13px] font-semibold text-[#0c2b48] shadow-2xs transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  >
                    Back to services
                  </a>
                </div>

              </ScrollReveal>
            </div>

            {/* Right Column: Hero Image Card (~42%) */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal delay={120}>
                <div className="relative mx-auto w-full max-w-90 sm:max-w-97.5">
                  {/* Subtle soft backdrop blur halo */}
                  <div 
                    aria-hidden="true" 
                    className="absolute -inset-1.5 rounded-2xl blur-lg opacity-25 pointer-events-none"
                    style={{ backgroundColor: themeColors.accent }}
                  />
                  
                  {/* Image Card Container */}
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_10px_28px_rgba(12,43,72,0.1)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(12,43,72,0.14)]">
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.name}
                        width={service.width}
                        height={service.height}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. ABOUT THIS SERVICE ================= */}
      <section aria-labelledby="service-about-heading" className="py-8 sm:py-10 bg-white">
        <div className="site-container max-w-4xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                About This Service
              </span>
              <h2 
                id="service-about-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                About {service.name}
              </h2>
              <div className="mt-3 space-y-2.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600">
                {service.overview.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 3. WHAT YOU GET ================= */}
      <section 
        aria-labelledby="service-features-heading" 
        className="py-8 sm:py-10 border-y border-slate-200/60"
        style={{ backgroundColor: themeColors.sectionAltBg }}
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                What You Get
              </span>
              <h2 
                id="service-features-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                What You Get
              </h2>
              <p className="mt-1 text-xs sm:text-[13.5px] text-slate-600 max-w-2xl">
                Our {service.name} service delivers high-quality data with comprehensive support from sample preparation to result analysis.
              </p>
            </div>

            {/* 2x2 Feature Cards Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {service.features.map((feature, index) => {
                // If feature has a title/description split
                const parts = feature.split(" - ");
                const title = parts[0];
                const desc = parts.length > 1 ? parts.slice(1).join(" - ") : null;

                return (
                  <div 
                    key={index}
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(12,43,72,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(12,43,72,0.06)] hover:border-slate-300"
                  >
                    <span 
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5 shadow-2xs transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: themeColors.accentSoftBg,
                        color: "var(--accent)",
                      }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-['Poppins',sans-serif] text-xs sm:text-sm font-bold text-[#0c2b48] leading-snug">
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
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 4. APPLICATIONS ================= */}
      <section aria-labelledby="service-applications-heading" className="py-8 sm:py-10 bg-white">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                Applications
              </span>
              <h2 
                id="service-applications-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Applications
              </h2>
              <p className="mt-1 text-xs sm:text-[13.5px] text-slate-600 max-w-2xl">
                {service.name} is versatile and used across various research and clinical applications.
              </p>
            </div>

            {/* 4 Cards in 1 Row on Desktop */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {service.applications.map((app, index) => {
                const IconComp = appIcons[index % appIcons.length];

                return (
                  <div 
                    key={index}
                    className="group flex flex-col h-full rounded-xl border border-slate-200/80 p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(12,43,72,0.06)]"
                    style={{ backgroundColor: themeColors.sectionAltBg }}
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

      {/* ================= 5. REQUIREMENTS & DELIVERABLES ================= */}
      <section 
        aria-labelledby="requirements-deliverables-heading" 
        className="py-8 sm:py-10 border-y border-slate-200/60"
        style={{ backgroundColor: themeColors.sectionAltBg }}
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                Requirements &amp; Deliverables
              </span>
              <h2 
                id="requirements-deliverables-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Requirements &amp; Deliverables
              </h2>
              <p className="mt-1 text-xs sm:text-[13.5px] text-slate-600 max-w-2xl">
                To ensure the best results, we require quality samples and provide clear, actionable outputs.
              </p>
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

      {/* ================= 6. HOW IT WORKS ================= */}
      <section aria-labelledby="how-it-works-heading" className="py-8 sm:py-10 bg-white">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                How It Works
              </span>
              <h2 
                id="how-it-works-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                How It Works
              </h2>
              <p className="mt-1 text-xs sm:text-[13.5px] text-slate-600 max-w-2xl">
                A simple and efficient process from sample submission to final results.
              </p>
            </div>

            {/* 4 Cards with Arrows on Desktop */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 relative">
              {workflowSteps.map((item, index) => {
                const StepIcon = item.icon;

                return (
                  <div key={index} className="relative flex flex-col">
                    <div 
                      className="group flex flex-col h-full rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ backgroundColor: themeColors.sectionAltBg }}
                    >
                      {/* Top Row: Number Badge and Icon */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span 
                          className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: "var(--accent)" }}
                        >
                          {item.step}
                        </span>
                        <div 
                          className="flex h-6.5 w-6.5 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: themeColors.accentSoftBg,
                            color: "var(--accent)",
                          }}
                        >
                          <StepIcon className="h-3.5 w-3.5 stroke-2" aria-hidden="true" />
                        </div>
                      </div>

                      <h3 className="font-['Poppins',sans-serif] text-xs sm:text-[13.5px] font-bold text-[#0c2b48] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] sm:text-xs leading-normal text-slate-600 flex-1">
                        {item.desc}
                      </p>
                    </div>

                    {/* Connecting Arrow between cards (desktop only) */}
                    {index < workflowSteps.length - 1 && (
                      <div 
                        aria-hidden="true"
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-5.5 w-5.5 items-center justify-center rounded-full bg-white border border-slate-200 shadow-2xs"
                        style={{ color: "var(--accent)" }}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 7. COMMON QUESTIONS (FAQ) ================= */}
      <section aria-labelledby="service-faq-heading" className="py-8 sm:py-10 bg-white border-t border-slate-200/60">
        <div className="site-container max-w-3xl">
          <ScrollReveal>
            <div>
              <span 
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                Frequently Asked Questions
              </span>
              <h2 
                id="service-faq-heading"
                className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
              >
                Common Questions
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

      {/* ================= 8. EXPLORE RELATED SERVICES ================= */}
      <section 
        aria-labelledby="related-services-heading" 
        className="py-8 sm:py-10 border-t border-slate-200/60"
        style={{ backgroundColor: themeColors.sectionAltBg }}
      >
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <span 
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--accent)" }}
                >
                  Related Services
                </span>
                <h2 
                  id="related-services-heading"
                  className="mt-1 font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#0c2b48]"
                >
                  Explore Related Services
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {relatedServices.map((rel) => {
                return (
                  <a
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group flex flex-col h-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(12,43,72,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        width="480"
                        height="270"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4 justify-between">
                      <div>
                        <h3 
                          className="font-['Poppins',sans-serif] text-xs sm:text-[14px] font-bold text-[#0c2b48] transition-colors leading-snug group-hover:text-(--accent)"
                        >
                          {rel.name}
                        </h3>
                        <p className="mt-1 text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {rel.description || rel.tagline}
                        </p>
                      </div>
                      <span 
                        className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold transition-colors"
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

    </div>
  );
}
