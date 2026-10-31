import { useState, useEffect } from "react";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Microscope,
  Stethoscope,
  Network,
  FlaskConical,
  Bell,
  Sparkles,
  Layers,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import Button from "../components/Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { fetchPublishedJobs } from "../lib/careersClient.js";

export const revalidate = 60;
export const dynamic = "force-dynamic";

function getDepartmentIcon(dept) {
  const d = (dept || "").toLowerCase();
  if (d.includes("bioinformatics") || d.includes("computation") || d.includes("data")) {
    return Network;
  }
  if (d.includes("genetics") || d.includes("counsel") || d.includes("clinical")) {
    return Stethoscope;
  }
  if (d.includes("lab") || d.includes("molecular")) {
    return FlaskConical;
  }
  return Microscope;
}

export default function OpenPositionsPage() {
  const { theme, themeConfig } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleJobExpand = (id) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const home1 = "/images/home1.webp";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchPublishedJobs();
        if (isMounted) {
          setJobs(data || []);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[OpenPositionsPage] Failed to fetch jobs:", err);
        }
        if (isMounted) {
          setJobs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionBg = isRed ? "#2d0306" : isGreen ? "#021e12" : "#031a2e";

  const overlayGradientDesktop = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.98) 0%, rgba(45, 3, 6, 0.88) 45%, rgba(45, 3, 6, 0.35) 75%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.98) 0%, rgba(2, 30, 18, 0.88) 45%, rgba(2, 30, 18, 0.35) 75%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(3, 26, 46, 0.98) 0%, rgba(3, 26, 46, 0.88) 48%, rgba(3, 26, 46, 0.30) 75%, rgba(3, 26, 46, 0.10) 100%)";

  const overlayGradientMobile = isRed
    ? "linear-gradient(180deg, rgba(45, 3, 6, 0.92) 0%, rgba(45, 3, 6, 0.70) 50%, rgba(45, 3, 6, 0.96) 100%)"
    : isGreen
      ? "linear-gradient(180deg, rgba(2, 30, 18, 0.92) 0%, rgba(2, 30, 18, 0.70) 50%, rgba(2, 30, 18, 0.96) 100%)"
      : "linear-gradient(180deg, rgba(3, 26, 46, 0.92) 0%, rgba(3, 26, 46, 0.70) 50%, rgba(3, 26, 46, 0.96) 100%)";

  const accentColor = isRed ? "#ef4444" : isGreen ? "#10b981" : "#00bcd4";

  return (
    <>
      {/* ══════════════════════════ HERO SECTION ══════════════════════════ */}
      <section
        aria-labelledby="careers-hero-heading"
        className="relative isolate flex min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] items-center overflow-hidden text-white transition-colors duration-500"
        style={{ backgroundColor: sectionBg }}
      >
        {/* Background DNA helix image on right */}
        <div
          className="absolute inset-y-0 right-0 w-full sm:w-[70%] md:w-[60%] lg:w-[55%] bg-cover bg-position-[80%_center] md:bg-center transition-all duration-500 opacity-40 sm:opacity-75 md:opacity-100 -z-20"
          style={{
            backgroundImage: `url(${home1})`,
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
        />

        {/* Gradient overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 block md:hidden -z-10 transition-all duration-500"
          style={{ background: overlayGradientMobile }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block -z-10 transition-all duration-500"
          style={{ background: overlayGradientDesktop }}
        />

        <div className="site-container py-12 sm:py-16">
          <div className="max-w-xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 font-inter text-xs sm:text-sm">
              <a
                href="/"
                className="transition-colors hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Home
              </a>
              <span aria-hidden="true" className="text-slate-400">
                ›
              </span>
              <span className="text-slate-300">Careers</span>
            </nav>

            {/* Tag / Category Badge */}
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span
                className="font-inter text-[11px] font-bold uppercase tracking-[0.24em]"
                style={{ color: "var(--accent)" }}
              >
                CAREERS AT CLINGENE
              </span>
            </div>

            {/* Main Hero Heading */}
            <ScrollReveal
              as="h1"
              id="careers-hero-heading"
              className="font-outfit text-[34px] sm:text-[46px] lg:text-[52px] font-bold leading-[1.12] tracking-tight text-white"
            >
              Build the Future of{" "}
              <span
                style={{
                  color: isRed ? "#ef4444" : "var(--accent)",
                  transition: "color 0.4s ease-in-out",
                }}
              >
                Genomics
              </span>
            </ScrollReveal>

            {/* Subtitle */}
            <p className="mt-3.5 max-w-lg font-inter text-sm sm:text-base leading-relaxed text-slate-200">
              Join our innovative team and make an impact in genomic research.
            </p>

            {/* Hero CTA Button */}
            <div className="mt-7 flex items-center gap-4">
              <Button
                href="#open-positions"
                className="px-7 py-3 text-xs sm:text-sm font-bold shadow-lg"
              >
                <span>View Open Roles</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ OPEN POSITIONS SECTION ══════════════════════════ */}
      <section
        id="open-positions"
        aria-labelledby="open-positions-heading"
        className="bg-[#f8fafc] py-16 sm:py-24"
      >
        <div className="site-container max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center rounded-full px-4 py-1 font-inter text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{
                backgroundColor: "rgba(0, 188, 212, 0.08)",
                color: isRed ? "#dc2626" : isGreen ? "#059669" : "#0097a7",
                border: `1px solid ${isRed ? "#fca5a5" : isGreen ? "#a7f3d0" : "#80deea"}`,
              }}
            >
              CAREER OPPORTUNITIES
            </span>

            <h2
              id="open-positions-heading"
              className="mt-3 font-outfit text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0c2b48] tracking-tight"
            >
              Open Positions
            </h2>

            {/* Small horizontal cyan accent bar directly under title */}
            <div
              className="mx-auto mt-3 h-1 w-11 rounded-full transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>

          {/* Jobs List / Rows */}
          {loading ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center shadow-xs max-w-lg mx-auto my-4">
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(0, 188, 212, 0.1)", color: "var(--accent)" }}
              >
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-outfit text-base font-bold text-slate-800">
                No Open Positions Currently
              </h3>
              <p className="font-inter text-xs text-slate-500 mt-1.5 leading-relaxed">
                ClinGene is currently reviewing staffing needs. New opportunities will be posted here as soon as they become available.
              </p>
            </div>
          ) : (
            /* ── Job Rows (Identical match to user screenshot) ── */
            <div className="space-y-4 max-w-4xl mx-auto">
              {jobs.map((job) => {
                const IconComponent = getDepartmentIcon(job.department);
                const isExpanded = !!expandedJobs[job.id];
                const descriptionText =
                  job.shortDescription ||
                  job.description ||
                  "Support research projects and assist in genetic research studies.";

                return (
                  <div
                    key={job.id}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-3xl border border-[#00bcd4] bg-white p-5 sm:p-6 sm:px-7 shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    {/* Left: Department Icon + Title + Meta row + Description */}
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      {/* Cyan rounded container with icon */}
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#e0f7fa] transition-transform duration-300 group-hover:scale-105">
                        <IconComponent className="h-9 w-9 sm:h-10 sm:w-10 text-[#00bcd4]" strokeWidth={1.8} />
                      </div>

                      {/* Job details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-outfit text-xl sm:text-2xl font-bold text-[#0c2b48] leading-tight">
                          {job.title}
                        </h3>

                        {/* Metadata row with small icons and separators */}
                        <div className="mt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] text-slate-700 font-medium font-inter">
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4 text-[#0c2b48] stroke-[2]" />
                            {job.department || "Research"}
                          </span>

                          <span aria-hidden="true" className="text-slate-300 font-light">
                            |
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#0c2b48] stroke-[2]" />
                            {job.type || "Full Time"}
                          </span>

                          <span aria-hidden="true" className="text-slate-300 font-light">
                            |
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#0c2b48] stroke-[2]" />
                            {job.location || "Islamabad, Pakistan"}
                          </span>
                        </div>

                        {/* Description: 1 line initially + Read More button one line below */}
                        <div className="mt-2">
                          <p
                            className={`text-xs sm:text-[13px] text-slate-600 font-inter leading-relaxed transition-all duration-300 ${
                              isExpanded ? "" : "line-clamp-1"
                            }`}
                          >
                            {descriptionText}
                          </p>

                          <button
                            type="button"
                            onClick={() => toggleJobExpand(job.id)}
                            className="mt-1 font-medium text-[#00bcd4] hover:text-[#0097a7] hover:underline inline-flex items-center gap-1 text-xs sm:text-[13px] transition-colors cursor-pointer"
                            aria-expanded={isExpanded}
                          >
                            <span>{isExpanded ? "Read Less ←" : "Read More →"}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Apply Now -> pill button with bubble hover */}
                    <div className="shrink-0 self-start md:self-center">
                      <Button
                        href={`/contact?service=job-application&position=${encodeURIComponent(job.title)}`}
                        className="px-7 py-3 text-xs sm:text-sm font-bold shadow-xs"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Speculative CV section removed per user request */}
        </div>
      </section>
    </>
  );
}
