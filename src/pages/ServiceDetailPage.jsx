import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Coins,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { servicesData, getServiceBySlug } from "../data/servicesData.js";

export default function ServiceDetailPage({ currentSlug }) {
  // Determine slug from prop or window.location.pathname
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/^\/|\/$/g, "") : "";
  const activeSlug = currentSlug || (path.startsWith("services/") ? path.slice("services/".length) : "");
  const service = getServiceBySlug(activeSlug) || servicesData[0];

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState(0);

  // Set document title and meta description
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${service.name} | ClinGene Services`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", service.tagline);
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

  return (
    <div className="service-detail-page bg-[#fbfdfc] text-[#0b1f1a] selection:bg-[#10b981] selection:text-white">
      
      {/* ================= 1. BREADCRUMB & PREV/NEXT NAV ================= */}
      <nav 
        aria-label="Breadcrumb and navigation"
        className="border-b border-[#e2e8f0] bg-white sticky top-0 z-30 shadow-xs"
      >
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-3.5 text-xs sm:text-sm font-['Inter',sans-serif]">
          {/* Breadcrumb */}
          <ol className="flex items-center gap-2 text-slate-500 font-medium">
            <li>
              <a 
                href="/" 
                className="transition-colors hover:text-[#10b981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
              >
                Home
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-300">›</li>
            <li>
              <a 
                href="/services" 
                className="transition-colors hover:text-[#10b981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
              >
                Services
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-300">›</li>
            <li aria-current="page" className="font-semibold text-[#0b1f1a] truncate max-w-[200px] sm:max-w-xs">
              {service.name}
            </li>
          </ol>

          {/* Quick Prev / Next Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a 
              href={`/services/${prevService.slug}`}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#10b981] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
              title={`Previous service: ${prevService.name}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </a>
            <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
            <a 
              href="/services" 
              className="text-[#0b6b4c] hover:text-[#10b981] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
            >
              All Services
            </a>
            <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
            <a 
              href={`/services/${nextService.slug}`}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#10b981] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
              title={`Next service: ${nextService.name}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <section 
        aria-labelledby="service-hero-title"
        className="relative overflow-hidden bg-gradient-to-b from-white via-[#f0fdf4]/50 to-white py-12 sm:py-16 lg:py-20 border-b border-[#e6f4ea]"
      >
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Hero Details */}
            <div className="lg:col-span-7">
              <ScrollReveal delay={50}>
                {/* Number Badge & Type indicator */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-lg bg-[#0b1f1a] px-3 py-1 font-['Inter',sans-serif] text-xs font-bold tracking-widest text-[#10b981] shadow-xs">
                    SERVICE {service.number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-0.5 text-xs font-semibold text-[#0b6b4c]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" aria-hidden="true" />
                    {service.type === "lab" ? "Laboratory Service" : "Computational Service"}
                  </span>
                </div>

                {/* Service Name */}
                <h1 
                  id="service-hero-title"
                  className="mt-4 font-['Poppins',sans-serif] text-3xl font-extrabold tracking-tight text-[#0b1f1a] sm:text-4xl lg:text-5xl leading-[1.15]"
                >
                  {service.name}
                </h1>

                {/* Tagline */}
                <p className="mt-4 font-['Inter',sans-serif] text-base sm:text-lg font-medium text-[#0b6b4c] leading-relaxed">
                  {service.tagline}
                </p>

                {/* Short Overview snippet */}
                <p className="mt-3 font-['Inter',sans-serif] text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {service.overview[0]}
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#10b981] px-7 py-3 font-['Inter',sans-serif] text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#0b6b4c] hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                  >
                    Request this service
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>

                  <a
                    href="/services"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-['Inter',sans-serif] text-sm font-bold text-[#0b1f1a] transition-all duration-300 hover:border-[#10b981] hover:text-[#0b6b4c] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                  >
                    Back to services
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal delay={120}>
                <div className="relative mx-auto w-full max-w-[420px] rounded-3xl border border-[#c9e2ef]/70 bg-white p-3 shadow-[0_16px_36px_rgba(11,31,26,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)]">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#0b1f1a]">
                    <img
                      src={service.image}
                      alt={service.name}
                      width={service.width}
                      height={service.height}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                    <div 
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1f1a]/60 via-transparent to-transparent" 
                      aria-hidden="true" 
                    />
                    <span 
                      className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-[#0b6b4c] shadow-md backdrop-blur-xs"
                      aria-hidden="true"
                    >
                      {ServiceIcon && <ServiceIcon className="h-6 w-6 stroke-[1.8]" />}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. OVERVIEW SECTION ================= */}
      <section aria-labelledby="service-overview-heading" className="py-14 sm:py-18 bg-white">
        <div className="site-container max-w-4xl">
          <ScrollReveal>
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
              <span className="h-0.5 w-6 bg-[#10b981]" aria-hidden="true" />
              Service Overview
            </div>
            <h2 
              id="service-overview-heading"
              className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
            >
              About {service.name}
            </h2>
            <div className="mt-6 space-y-4 font-['Inter',sans-serif] text-base leading-relaxed text-slate-700">
              {service.overview.map((paragraph, index) => (
                <p key={index} className="text-[15px] sm:text-base leading-[1.75]">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 4. WHAT YOU GET (KEY FEATURES) ================= */}
      <section aria-labelledby="service-features-heading" className="py-14 sm:py-18 bg-[#f8fdfa] border-y border-[#eaf6ee]">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Capabilities & Quality
              </span>
              <h2 
                id="service-features-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                What You Get
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto font-['Inter',sans-serif]">
                Key technical capabilities and analytical features included in this service.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {service.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#d1fae5] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white shadow-xs mt-0.5">
                    <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-['Poppins',sans-serif] text-sm sm:text-[15px] font-bold text-[#0b1f1a]">
                      {feature}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 5. APPLICATIONS ================= */}
      <section aria-labelledby="service-applications-heading" className="py-14 sm:py-18 bg-white">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Real-World Research & Diagnostics
              </span>
              <h2 
                id="service-applications-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                Applications
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto font-['Inter',sans-serif]">
                Representative research and translational study areas supported by this workflow.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {service.applications.map((app, index) => (
                <div 
                  key={index}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-[#fbfdfc] p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/60 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981] mb-3.5">
                    <Sparkles className="h-5 w-5 stroke-[1.8]" aria-hidden="true" />
                  </div>
                  <h3 className="font-['Poppins',sans-serif] text-sm sm:text-[15px] font-bold text-[#0b1f1a]">
                    {app.title}
                  </h3>
                  <p className="mt-2 font-['Inter',sans-serif] text-xs sm:text-[13px] leading-relaxed text-slate-600">
                    {app.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 6 & 7. REQUIREMENTS & DELIVERABLES ================= */}
      <section aria-labelledby="requirements-deliverables-heading" className="py-14 sm:py-18 bg-[#f5faf7] border-y border-[#e2efe8]">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Specifications & Handover
              </span>
              <h2 
                id="requirements-deliverables-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                Requirements & Deliverables
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Requirements Card */}
              <div className="rounded-2xl border border-[#d1fae5] bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#0b6b4c]">
                    <Layers className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-[#0b1f1a]">
                      {service.requirementsLabel}
                    </h3>
                    <span className="text-xs text-slate-500 font-['Inter',sans-serif]">
                      {service.type === "lab" ? "Physical sample criteria" : "Digital dataset specifications"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 font-['Inter',sans-serif] text-xs sm:text-sm text-slate-700 mt-2 flex-1">
                  {service.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables Card */}
              <div className="rounded-2xl border border-[#d1fae5] bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#0b6b4c]">
                    <FileCheck className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-[#0b1f1a]">
                      Deliverables
                    </h3>
                    <span className="text-xs text-slate-500 font-['Inter',sans-serif]">
                      Reports and computational files provided
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 font-['Inter',sans-serif] text-xs sm:text-sm text-slate-700 mt-2 flex-1">
                  {service.deliverables.map((deliv, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" aria-hidden="true" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>

                {/* Optional note (e.g. Genetic counseling for service 01) */}
                {service.deliverablesNote && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-[#ecfdf5] p-3 text-xs text-[#065f46] font-medium leading-relaxed">
                    <strong>Note:</strong> {service.deliverablesNote}
                  </div>
                )}
              </div>

            </div>

            {/* Special comparison table for Whole Exome / Genome Sequencing */}
            {service.comparisonTable && (
              <div className="mt-8 rounded-2xl border border-[#d1fae5] bg-white p-6 sm:p-8 shadow-xs">
                <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#0b1f1a] mb-2">
                  Whole Exome Sequencing (WES) vs. Whole Genome Sequencing (WGS)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-5 font-['Inter',sans-serif]">
                  Key distinctions to help select the optimal sequencing approach for your scientific aims.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-['Inter',sans-serif] text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-[#ecfdf5] text-[#0b6b4c]">
                        {service.comparisonTable.headers.map((h, i) => (
                          <th key={i} className="py-3 px-4 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {service.comparisonTable.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0b1f1a]">
                            {row[0]}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row[1]}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
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

      {/* ================= 8. HOW IT WORKS ================= */}
      <section aria-labelledby="how-it-works-heading" className="py-14 sm:py-18 bg-white">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Workflow & Project Stages
              </span>
              <h2 
                id="how-it-works-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                How It Works
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto font-['Inter',sans-serif]">
                A transparent, standardized four-step workflow from initial inquiry to final delivery.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                {
                  step: "01",
                  title: "Send inquiry",
                  desc: "Submit your study parameters, sample counts and objectives via our inquiry form.",
                },
                {
                  step: "02",
                  title: "Sample or data submission",
                  desc: "Ship stabilized biological samples or transfer computational datasets following confirmed guidelines.",
                },
                {
                  step: "03",
                  title: "Processing and analysis",
                  desc: "Laboratory processing, quality checks, sequencing, and dedicated bioinformatics evaluation.",
                },
                {
                  step: "04",
                  title: "Report delivery",
                  desc: "Secure delivery of complete analytical reports, datasets, and variant/feature summaries.",
                },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-200/90 bg-[#fbfdfc] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/50 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)] flex flex-col"
                >
                  <span className="font-['Poppins',sans-serif] text-2xl font-black text-[#10b981]/40 mb-2">
                    {item.step}
                  </span>
                  <h3 className="font-['Poppins',sans-serif] text-sm sm:text-base font-bold text-[#0b1f1a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-['Inter',sans-serif] text-xs sm:text-[13px] leading-relaxed text-slate-600 flex-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Scientific Directors Note */}
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-[#f0fdf4] p-5 text-center shadow-xs">
              <p className="font-['Inter',sans-serif] text-xs sm:text-sm font-semibold text-[#065f46]">
                Our scientific directors in Islamabad reply within 4 hours during business days.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 9. TURNAROUND TIME & PRICING ================= */}
      <section aria-labelledby="timeline-pricing-heading" className="py-12 sm:py-16 bg-[#f8fdfa] border-y border-[#eaf6ee]">
        <div className="site-container max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Project Parameters
              </span>
              <h2 
                id="timeline-pricing-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                Turnaround Time & Pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Turnaround Time */}
              <div className="rounded-2xl border border-[#d1fae5] bg-white p-6 sm:p-7 shadow-xs text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981] mb-3">
                  <Clock className="h-6 w-6 stroke-[1.8]" aria-hidden="true" />
                </div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#0b1f1a]">
                  Turnaround time
                </h3>
                <p className="mt-3 font-['Inter',sans-serif] text-sm sm:text-base font-bold text-[#0b6b4c]">
                  [To be confirmed by the lab]
                </p>
                <p className="mt-1 text-xs text-slate-500 font-['Inter',sans-serif]">
                  Confirmed upon review of sample volume and batch requirements.
                </p>
              </div>

              {/* Pricing */}
              <div className="rounded-2xl border border-[#d1fae5] bg-white p-6 sm:p-7 shadow-xs text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981] mb-3">
                  <Coins className="h-6 w-6 stroke-[1.8]" aria-hidden="true" />
                </div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#0b1f1a]">
                  Pricing
                </h3>
                <p className="mt-3 font-['Inter',sans-serif] text-sm sm:text-base font-bold text-[#0b6b4c]">
                  [To be confirmed by the lab]
                </p>
                <p className="mt-1 text-xs text-slate-500 font-['Inter',sans-serif]">
                  Custom institutional quotes provided according to sample scale.
                </p>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 10. FAQ ACCORDION ================= */}
      <section aria-labelledby="service-faq-heading" className="py-14 sm:py-18 bg-white">
        <div className="site-container max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                Frequently Asked Questions
              </span>
              <h2 
                id="service-faq-heading"
                className="mt-2 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
              >
                Questions & Answers
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-['Inter',sans-serif]">
                Common inquiries regarding sample preparation, data delivery, and quotations.
              </p>
            </div>

            <div className="space-y-3.5">
              {service.faq.map((item, index) => {
                const isOpen = openFaq === index;
                const questionId = `faq-q-${index}`;
                const answerId = `faq-a-${index}`;

                return (
                  <div 
                    key={index}
                    className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs transition-colors duration-200"
                  >
                    <button
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left font-['Poppins',sans-serif] text-sm sm:text-[15px] font-bold text-[#0b1f1a] hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-[#10b981] shrink-0" aria-hidden="true" />
                        {item.question}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#10b981]" : ""}`} 
                        aria-hidden="true" 
                      />
                    </button>

                    {isOpen && (
                      <div 
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm font-['Inter',sans-serif] text-slate-600 leading-relaxed border-t border-slate-100"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 11. RELATED SERVICES ================= */}
      <section aria-labelledby="related-services-heading" className="py-14 sm:py-18 bg-[#f8fdfa] border-t border-[#eaf6ee]">
        <div className="site-container max-w-5xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b6b4c]">
                  Complementary Workflows
                </span>
                <h2 
                  id="related-services-heading"
                  className="mt-1 font-['Poppins',sans-serif] text-2xl sm:text-3xl font-bold text-[#0b1f1a]"
                >
                  Related Services
                </h2>
              </div>
              <a 
                href="/services" 
                className="inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-xs sm:text-sm font-bold text-[#0b6b4c] hover:text-[#10b981] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
              >
                View all 12 services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((rel) => {
                const RelIcon = rel.Icon;

                return (
                  <a
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/50 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                  >
                    <div className="relative aspect-16/9 w-full overflow-hidden bg-[#0b1f1a]">
                      <img
                        src={rel.image}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-[#0b1f1a]/85 px-2 py-0.5 font-['Inter',sans-serif] text-[10px] font-bold tracking-wider text-white">
                        {rel.number}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 mb-2 text-[#0b6b4c]">
                        {RelIcon && <RelIcon className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />}
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {rel.type === "lab" ? "Lab" : "Computational"}
                        </span>
                      </div>
                      <h3 className="font-['Poppins',sans-serif] text-sm sm:text-base font-bold text-[#0b1f1a] group-hover:text-[#10b981] transition-colors leading-snug">
                        {rel.name}
                      </h3>
                      <p className="mt-2 font-['Inter',sans-serif] text-xs text-slate-600 line-clamp-2 leading-relaxed flex-1">
                        {rel.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-xs font-bold text-[#0b6b4c] group-hover:text-[#10b981] transition-colors">
                        Explore service details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= 12. FINAL CTA BAND ================= */}
      <section 
        aria-labelledby="cta-band-heading"
        className="relative overflow-hidden bg-[#0b1f1a] text-white py-16 sm:py-20 lg:py-24"
        style={{
          backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.28), transparent 75%)",
        }}
      >
        <div className="site-container max-w-3xl text-center relative z-10">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-widest text-[#10b981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" aria-hidden="true" />
              ClinGene Laboratory Services
            </span>

            <h2 
              id="cta-band-heading"
              className="mt-4 font-['Poppins',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
            >
              Ready to start your project?
            </h2>

            <p className="mt-4 font-['Inter',sans-serif] text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Connect with our scientific directors to discuss {service.name.toLowerCase()}, project parameters, sample requirements and timelines.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`/contact?service=${service.slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#10b981] px-8 py-3.5 font-['Inter',sans-serif] text-sm font-bold text-white shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all duration-300 hover:bg-[#0b6b4c] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Request this service
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="/services"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-['Inter',sans-serif] text-sm font-bold text-white backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/40 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to all services
              </a>
            </div>

            {/* Sample shipment address shown ONLY on lab services, not on computational */}
            {service.type === "lab" && (
              <div className="mt-10 pt-8 border-t border-white/10 text-xs sm:text-sm text-slate-400 font-['Inter',sans-serif]">
                <p>
                  <strong className="text-white">Sample shipments:</strong> Street 13, Lane 10, Hostel City, Chak Shahzad, Islamabad, Pakistan.
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}

