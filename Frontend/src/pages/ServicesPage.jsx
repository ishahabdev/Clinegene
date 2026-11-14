import { useState, useEffect } from "react";
import { ArrowRight, Dna, Play, ShieldPlus, Layers } from "lucide-react";
import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading";
import ScrollReveal from "../components/ScrollReveal.jsx";
import serviceHero from "../assets/service-hero.webp";
import { getOptimizedImageUrl } from "../lib/imageOptimization.js";
import { fetchPublishedServices } from "../lib/servicesClient.js";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const ACADEMIC_SERVICE_PATTERNS = [
  /rna.{0,20}seq|transcriptome/,
  /metagenom/,
  /phylogenetic|phylogeny/,
  /pangenome/,
  /molecular.{0,15}dynamic|md.{0,10}simulation/,
  /protein.{0,20}model/,
  /immunogenic/,
  /virtual.{0,15}screen/,
  /library.{0,15}generation/,
  /molecular.{0,15}biology/,
  /project.{0,15}design/,
];

function getServiceCategory(service) {
  const category = String(service.category || "").toLowerCase();
  if (category.includes("academic")) return "academic";

  const identity = `${service.slug || ""} ${service.title || ""} ${service.name || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
  const matchesAcademicService = ACADEMIC_SERVICE_PATTERNS.some((pattern) =>
    pattern.test(identity)
  );
  if (category.includes("clinical") && category !== "clinical diagnostics") {
    return "clinical";
  }
  return matchesAcademicService ? "academic" : "clinical";
}

function getCategoryFromUrl(url) {
  const query = url?.includes("?") ? url.split("?")[1].split("#")[0] : "";
  return new URLSearchParams(query).get("category") === "academic"
    ? "academic"
    : "clinical";
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

export default function ServicesPage({ ssrUrl }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(() => getCategoryFromUrl(ssrUrl));

  useEffect(() => {
    const updateCategoryFromUrl = () => {
      setSelectedCategory(getCategoryFromUrl(window.location.href));
    };
    updateCategoryFromUrl();
    window.addEventListener("popstate", updateCategoryFromUrl);
    return () => window.removeEventListener("popstate", updateCategoryFromUrl);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const data = await fetchPublishedServices();
        if (isMounted) {
          setServices(data || []);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[ServicesPage] Failed to fetch published services:", err);
        }
        if (isMounted) {
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const categorizedServices = services.filter(
    (service) => getServiceCategory(service) === selectedCategory
  );
  const hasFeaturedGeneticCounseling = categorizedServices.some(
    (service) =>
      service.slug === "genetic-counseling" || service.slug === "genetic-counselling"
  );
  const selectedCategoryLabel =
    selectedCategory === "academic" ? "Academic" : "Clinical";

  const badgeBg = "var(--card-hero-badge-bg)";

  return (
    <>
      <section
        aria-labelledby="services-hero-title"
        className="relative isolate flex min-h-75 items-center overflow-hidden text-white sm:min-h-80 transition-colors duration-500"
        style={{ backgroundColor: "var(--hero-bg)" }}
      >
        <img
          alt=""
          aria-hidden="true"
          width="1376"
          height="768"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] transition-all duration-500"
          fetchPriority="high"
          src={serviceHero}
          style={{
            filter: "var(--hero-img-filter)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 transition-all duration-500"
          style={{
            background: "var(--hero-overlay)",
          }}
        />

        <div className="site-container py-12 sm:py-16 lg:py-20">
          <div className="max-w-155">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-3 font-inter text-sm">
              <a
                className="transition-colors hover:text-white"
                style={{ color: "var(--accent)" }}
                href="/"
              >
                Home
              </a>
              <span aria-hidden="true" style={{ color: "var(--accent)" }}>›</span>
              <span aria-current="page" className="text-slate-300">Services</span>
            </nav>
            <p
              className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.24em] transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <span
                aria-hidden="true"
                className="h-0.5 w-9 transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              />
              Our Services
            </p>
            <ScrollReveal as="h1" className="font-outfit text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]" id="services-hero-title">
              Comprehensive Genomic
              <span
                className="block transition-colors"
                style={{
                  color: "var(--accent)",
                  transition: "color 0.4s ease-in-out",
                }}
              >
                Services for a Healthier Tomorrow
              </span>
            </ScrollReveal>
            <p className="mt-3 max-w-125 font-inter text-sm sm:text-base leading-6 text-slate-200">
              We provide advanced genomic, genetic testing, bioinformatics and research services to
              help individuals, clinicians and researchers make data-driven decisions for better
              health and discovery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button className="font-inter" href="#service-catalog">
                Explore Services
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
              </Button>
              <a
                className="group inline-flex min-h-11 items-center gap-2.5 font-inter text-xs font-semibold text-white transition-colors hover:text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href="#contact"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full border transition-colors group-hover:opacity-90"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  <Play aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current" />
                </span>
                Talk to our team
              </a>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden site-container xl:block">
          <div
            className="absolute right-10 top-[24%] flex w-48 items-center gap-3 rounded-2xl border p-3 text-white shadow-[0_10px_28px_rgba(0,12,28,0.4)] backdrop-blur-sm transition-all duration-500"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: "var(--card-hero-badge-bg)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-500"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Dna aria-hidden="true" className="h-7 w-7" />
            </span>
            <span className="font-inter text-xs font-semibold leading-[1.4]">Genomic insights<br />for your research</span>
          </div>
          <div
            className="absolute bottom-[9%] right-28 flex w-48 items-center gap-3 rounded-2xl border p-3 text-white shadow-[0_10px_28px_rgba(0,12,28,0.4)] backdrop-blur-sm transition-all duration-500"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: "var(--card-hero-badge-bg)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-500"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              <ShieldPlus aria-hidden="true" className="h-7 w-7" />
            </span>
            <span className="font-inter text-xs font-semibold leading-[1.4]">Support from<br />testing to analysis</span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="service-catalog-title"
        className="py-12 md:py-16 transition-colors duration-500"
        style={{
          background: "var(--service-catalog-bg)",
        }}
        id="service-catalog"
      >
        <div className="site-container">
          <ScrollReveal as="div" className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p
                className="mb-2 flex items-center gap-2.5 font-inter text-[10px] font-bold uppercase tracking-[0.22em] transition-colors"
                style={{ color: "var(--accent-muted)" }}
              >
                <span
                  aria-hidden="true"
                  className="h-0.5 w-7 transition-colors"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                Our Services
              </p>
              <h2 className="font-outfit text-[28px] font-bold leading-tight text-[#0c2b48] sm:text-[34px]" id="service-catalog-title">
                Our {selectedCategoryLabel}{" "}
                <span
                  style={{
                    color: "var(--accent-dark)",
                    transition: "color 0.4s ease-in-out",
                  }}
                >
                  Services
                </span>
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-sm leading-6 text-[#4a6e8b]">
                Explore ClinGene’s {selectedCategoryLabel.toLowerCase()} services, with clear
                descriptions of the work each service supports.
              </p>
            </div>
            <Button
              className="min-h-0! px-4! py-2.5! font-inter"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)",
                color: "var(--accent-muted)",
              }}
              href="#contact"
              variant="outline"
            >
              <span>Contact ClinGene</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </ScrollReveal>
          {/* ── Services Content (Live from Supabase) ── */}
          {loading && services.length === 0 ? (
            <div className="space-y-6 py-8">
              <div className="h-48 w-full rounded-2xl bg-slate-200/60 animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-slate-200/50 animate-pulse" />
                ))}
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs my-6">
              <Layers className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Services Available</h3>
              <p className="text-xs text-slate-500 mt-1">
                Our published clinical and sequencing services will be available here soon.
              </p>
            </div>
          ) : (
            categorizedServices.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs my-6">
                <Layers className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-700">
                  No {selectedCategoryLabel} Services Available
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Published {selectedCategoryLabel.toLowerCase()} services will appear here.
                </p>
              </div>
            ) : (
            <>
              {/* ── Featured Top Card: Genetic Counselling & Sub-Services ── */}
              {selectedCategory === "clinical" && (() => {
                const gc =
                  categorizedServices.find((s) => s.slug === "genetic-counseling" || s.slug === "genetic-counselling");
                if (!gc) return null;
                return (
                  <ScrollReveal
                    as="div"
                    className="relative mb-7 overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-7 lg:p-8 shadow-[0_4px_22px_rgba(12,43,72,0.06)] transition-colors duration-500"
                    style={{
                      borderColor: "var(--service-featured-banner-border)",
                      background: "var(--service-featured-banner-bg)",
                    }}
                  >
                    
                    {/* Number 1 Badge on Card */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="rounded-md px-2.5 py-0.5 font-inter text-xs font-bold tracking-wide text-white shadow-2xs transition-colors duration-300"
                        style={{ backgroundColor: badgeBg }}
                      >
                        01
                      </span>
                      <span className="font-inter text-[11px] font-bold uppercase tracking-wider text-[#0c2b48]/70">
                        Service 01
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-6 lg:gap-8 items-center">
                      
                      {/* Left Column: Main Service Info */}
                      <div className="flex flex-col items-start pr-0 lg:pr-6 lg:border-r border-slate-200/80">
                        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0c2b48] leading-tight">
                          <span className="mr-2 transition-colors duration-300" style={{ color: "var(--accent)" }}>1.</span>{gc.name}
                        </h2>
                        <p className="mt-3 font-inter text-xs sm:text-[13.5px] leading-relaxed text-[#4a6e8b]">
                          {gc.description || "Professional guidance and support to help you understand genetic risks and make informed decisions."}
                        </p>
                        <a
                          href={`/services/${gc.slug}`}
                          className="mt-6 inline-flex items-center gap-2 rounded-full text-white font-inter font-bold text-xs sm:text-sm px-6 py-2.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-95"
                          style={{ backgroundColor: "var(--accent)" }}
                        >
                          <span>Learn More</span>
                          <span aria-hidden="true" className="text-sm font-bold">›</span>
                        </a>
                      </div>

                      {/* Right Column: Sub Services Row */}
                      <div className="min-w-0 w-full">
                        <div
                          className="flex items-center gap-1.5 font-inter text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-3.5 transition-colors duration-300"
                          style={{ color: "var(--accent)" }}
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                          </svg>
                          <span>Sub Services</span>
                        </div>

                        {(gc.subServices || []).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
                          {(gc.subServices || []).map((sub) => (
                            <a
                              key={sub.id}
                              href={`/contact?service=${gc.slug}-${sub.slug || sub.id}`}
                              className="group flex flex-col items-center text-center rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(12,43,72,0.03)] hover:shadow-md hover:border-(--accent) hover:-translate-y-0.5 transition-all duration-300"
                            >
                              <div className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                {sub.image_url ? (
                                  <img
                                    src={sub.image_url}
                                    alt=""
                                    loading="lazy"
                                    className="h-12 w-12 rounded-xl object-cover"
                                  />
                                ) : (
                                  <SubServiceIcon
                                    id={sub.id}
                                    className="h-10 w-10 transition-colors duration-300"
                                    style={{ color: "var(--accent)" }}
                                  />
                                )}
                              </div>

                              <h3 className="mt-2.5 mb-3 font-outfit text-xs sm:text-[12.5px] font-bold text-[#0c2b48] leading-tight min-h-7 flex items-center justify-center">
                                {sub.label}
                              </h3>

                              <span
                                className="mt-auto flex h-6.5 w-6.5 sm:h-7 sm:w-7 items-center justify-center rounded-full text-white shadow-2xs transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: "var(--accent)" }}
                              >
                                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                              </span>
                            </a>
                          ))}
                        </div>
                        ) : (
                          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                            Sub-services will appear here when available.
                          </p>
                        )}
                      </div>

                    </div>
                  </ScrollReveal>
                );
              })()}

              {/* ── Remaining Services Grid (02 to 15) in other line ── */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categorizedServices
                  .filter((s) =>
                    !hasFeaturedGeneticCounseling ||
                    (s.slug !== "genetic-counseling" && s.slug !== "genetic-counselling")
                  )
                  .map(({ slug, name, description, Icon, image, imageAlt, width, height, subServices = [] }, index) => {
                    const serviceUrl = `/services/${slug}`;

                    return (
                      <ScrollReveal
                        as="a"
                        href={serviceUrl}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#c9e2ef] bg-[#f8fcff] hover:bg-(--accent-soft) shadow-[0_7px_18px_rgba(12,43,72,0.09)] transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_12px_28px_var(--accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                        delay={Math.min(index % 4, 3) * 55}
                        key={slug || name}
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-[#102943]">
                          <img
                            alt={imageAlt || name}
                            width={width || 800}
                            height={height || 600}
                            className={`h-full w-full object-cover ${slug === "library-generation" ? "object-[center_top]" : "object-center"} transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none`}
                            decoding="async"
                            loading="lazy"
                            src={typeof image === "string" ? getOptimizedImageUrl(image, { width: 800, quality: 78, format: "webp" }) : image}
                          />
                          <span
                            className="absolute left-2 top-2 rounded-md px-2 py-1 font-inter text-[10px] font-bold tracking-wide text-white"
                            style={{ backgroundColor: badgeBg }}
                          >
                            {String(index + (hasFeaturedGeneticCounseling ? 2 : 1)).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="relative flex flex-1 flex-col px-3 pb-3 pt-7 transition-colors duration-300">
                          <span
                            className="absolute -top-5 left-3 grid h-10 w-10 place-items-center rounded-xl border border-[#c9e2ef] bg-white shadow-[0_3px_10px_rgba(12,43,72,0.13)] transition-colors group-hover:bg-(--accent-btn-bg,var(--accent)) group-hover:text-(--accent-btn-text,white)"
                            style={{ color: "var(--accent-muted)" }}
                          >
                            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                          </span>
                          <h3 className="font-outfit text-[15px] font-bold leading-snug text-[#0c2b48] group-hover:text-(--accent-dark) transition-colors">{name}</h3>
                          <p className="mt-1.5 font-inter text-xs leading-normal text-[#4a6e8b]">{description}</p>
                          {subServices?.length > 0 && (
                            <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                              Options: {subServices.slice(0, 3).map((sub) => sub.label).join(", ")}
                            </p>
                          )}
                          <span
                            className="mt-auto inline-flex items-center gap-1.5 pt-3 font-inter text-[11px] font-bold transition-colors text-[#0c2b48] group-hover:text-(--accent)"
                          >
                            Ask about this service
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                          </span>
                        </div>
                      </ScrollReveal>
                    );
                  })}
              </div>
            </>
            )
          )}

          <div
            className="mt-9 overflow-hidden rounded-2xl p-6 text-white shadow-[0_12px_28px_rgba(12,43,72,0.18)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8 transition-colors duration-500"
            style={{
              backgroundColor: "var(--service-banner-bg)",
            }}
          >
            <div>
              <p
                className="font-inter text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Need help choosing?
              </p>
              <h3 className="mt-2 font-outfit text-xl font-bold sm:text-2xl">Tell us about your research</h3>
              <p className="mt-2 max-w-xl font-inter text-sm leading-6 text-slate-300">
                Contact our team to discuss your sample, project goals and the services that fit your work.
              </p>
            </div>
            <Button className="mt-5 shrink-0 px-5! font-inter sm:mt-0" href="#contact">
              Contact our team
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
