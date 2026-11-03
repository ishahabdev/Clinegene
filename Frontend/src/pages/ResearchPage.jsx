import { useState, useEffect, useMemo } from "react";
import {
  FlaskConical,
  Search,
  Calendar,
  User,
  BookOpen,
  ExternalLink,
  Layers,
  X,
  Share2,
  Check,
  ArrowRight,
} from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { fetchPublishedResearch } from "../lib/researchClient.js";
import { useTheme } from "../context/ThemeContext.jsx";
import researchHero from "../assets/Researchhero.webp";

const TYPES = ["All", "Research Project", "Publication", "Clinical Trial"];

export default function ResearchPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchPublishedResearch();
        if (isMounted) {
          setResearchList(data || []);
        }
      } catch (err) {
        console.error("[ResearchPage] Error loading research:", err);
        if (isMounted) setResearchList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique categories from loaded list
  const categories = useMemo(() => {
    const set = new Set();
    researchList.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["All", ...Array.from(set)];
  }, [researchList]);

  // Filtered research entries
  const filteredList = useMemo(() => {
    return researchList.filter((item) => {
      // Type filter
      if (activeType !== "All" && item.type !== activeType) return false;

      // Category filter
      if (activeCategory !== "All" && item.category !== activeCategory) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle?.toLowerCase().includes(q);
        const matchesLead = item.leadInvestigator?.toLowerCase().includes(q);
        const matchesAbstract = (item.abstract || item.summary)?.toLowerCase().includes(q);
        const matchesJournal = item.journal?.toLowerCase().includes(q);
        const matchesKeywords = Array.isArray(item.keywords)
          ? item.keywords.some((k) => k.toLowerCase().includes(q))
          : false;

        return (
          matchesTitle ||
          matchesSubtitle ||
          matchesLead ||
          matchesAbstract ||
          matchesJournal ||
          matchesKeywords
        );
      }

      return true;
    });
  }, [researchList, activeType, activeCategory, searchTerm]);

  const handleShare = (item) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ongoing")) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }
    if (s.includes("publish")) {
      return {
        bg: "bg-cyan-50 text-cyan-800 border-cyan-200",
        dot: "bg-cyan-500",
      };
    }
    if (s.includes("complete")) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    }
    return {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    };
  };

  return (
    <main className="min-h-screen bg-[#f8fbfe]">
      {/* High-priority LCP Preload for Hero Image */}
      <link rel="preload" as="image" href={researchHero} fetchPriority="high" />

      {/* ── Research Hero Section ── */}
      <section
        aria-labelledby="research-hero-title"
        className="relative isolate flex min-h-100 sm:min-h-110 lg:min-h-117.5 items-center overflow-hidden text-white transition-colors duration-500"
        id="research-hero"
        style={{ backgroundColor: "var(--hero-bg)" }}
      >
        {/* Full-screen background image across the whole hero section */}
        <img
          alt="ClinGene genomic research and laboratory inquiry"
          width="2048"
          height="768"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero-bg-img absolute inset-0 -z-20 h-full w-full object-cover object-[80%_center] sm:object-[72%_center] lg:object-center transition-all duration-500"
          src={researchHero}
          style={{
            filter: "var(--hero-img-filter)",
          }}
        />

        {/* Responsive theme-aware gradient overlay: solid readability on left, reveals research photography across the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 block lg:hidden transition-all duration-500"
          style={{
            background: "var(--hero-overlay-mobile)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden lg:block transition-all duration-500"
          style={{
            background: "var(--hero-overlay-desktop)",
          }}
        />

        {/* Text content */}
        <div className="site-container w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-175">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[14px] sm:text-[15px]">
                <li>
                  <a
                    href="/"
                    className="font-medium transition-colors hover:opacity-80 rounded"
                    style={{ color: "var(--hero-accent)", transition: "color 0.4s ease-in-out" }}
                  >
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="text-[#E2E8F0]/60">›</li>
                <li className="text-[#E2E8F0]" aria-current="page">Research</li>
              </ol>
            </nav>

            {/* Eyebrow with decorative line */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-0.5 w-12"
                style={{ backgroundColor: "var(--hero-accent)", transition: "background-color 0.4s ease-in-out" }}
                aria-hidden="true"
              />
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em] sm:text-[12px]"
                style={{ color: "var(--hero-accent)", transition: "color 0.4s ease-in-out" }}
              >
                OUR RESEARCH
              </p>
            </div>

            {/* Main heading */}
            <h1
              className="font-['Inter'] text-[32px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-extrabold leading-[1.14] tracking-tight text-white max-w-170"
              id="research-hero-title"
            >
              Advancing Genomics.{" "}
              <span style={{ color: "var(--hero-accent)", transition: "color 0.4s ease-in-out" }}>
                Pioneering Discoveries
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-125 text-sm sm:text-base leading-6 text-[#E2E8F0]">
              Discover our latest clinical genetic investigations, ongoing genomic research, and
              published scientific studies driving precision medicine forward.
            </p>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls ── */}
      {researchList.length > 0 && (
        <section className="site-container max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search research by title, investigator, keywords, DOI..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-(--accent) focus:bg-white focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TYPES.map((type) => {
                  const isActive = activeType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveType(type)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#0c2b48] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills (if multiple exist) */}
            {categories.length > 2 && (
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Category:
                </span>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                        isActive
                          ? "bg-(--accent-soft) text-(--accent-dark) font-bold"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Research Cards Listing ── */}
      <section className="site-container max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 animate-pulse space-y-3"
              >
                <div className="aspect-4/3 w-full rounded-2xl bg-slate-200" />
                <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          researchList.length === 0 ? (
            /* Clean Empty State when no research exists in Supabase (matching GalleryPage style) */
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs max-w-md mx-auto my-6">
              <FlaskConical className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-outfit text-base font-bold text-slate-800">
                No Research Present
              </h3>
              <p className="font-inter text-xs text-slate-500 mt-1.5 leading-relaxed">
                Research projects, clinical trials, and genomic publications will appear here once published from the admin portal.
              </p>
            </div>
          ) : (
            /* Filter empty state when search keywords produce 0 matches */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-md mx-auto my-6">
              <FlaskConical className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching research found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your search terms or filter selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveType("All");
                  setActiveCategory("All");
                }}
                className="mt-4 text-xs font-semibold text-(--accent-dark) underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredList.map((item, idx) => {
              const statusBadge = getStatusBadge(item.status);
              const oneLineParagraph =
                item.subtitle ||
                item.abstract ||
                item.summary ||
                "Clinical genetic investigation and precision medical breakthrough.";

              return (
                <article
                  key={item.id || idx}
                  onClick={() => setSelectedItem(item)}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/85 bg-white p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* Top Photo with aspect-4/3 ratio & top-aligned framing so faces are fully visible */}
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-2xs">
                      <img
                        src={item.image || "/images/clingene-logo.webp"}
                        alt={item.title}
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        decoding="async"
                      />
                      {/* Floating Badges overlay on image */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-xs">
                          <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                          {item.status || "Ongoing"}
                        </span>
                        <span className="rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                          {item.type || "Research Project"}
                        </span>
                      </div>

                      {item.date && (
                        <div className="absolute bottom-2.5 right-2.5 z-10">
                          <span className="rounded-xs bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
                            {item.date}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3.5 font-outfit text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-(--accent-dark) transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Exactly 1 line of <p> as requested */}
                    <p className="mt-1.5 text-xs sm:text-[13px] text-slate-500 line-clamp-1 leading-relaxed">
                      {oneLineParagraph}
                    </p>
                  </div>

                  {/* Card Footer: Read Abstract link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c2b48] group-hover:text-(--accent-dark) transition-colors">
                      <span>Read Abstract</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>

                    {item.doi && (
                      <a
                        href={item.doi.startsWith("http") ? item.doi : `https://doi.org/${item.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-700"
                        title={item.doi}
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>DOI</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Detail Modal (Full Abstract / Citation) ── */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-0.5 text-xs font-semibold text-cyan-800">
                {selectedItem.type || "Research Project"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                {selectedItem.status || "Ongoing"}
              </span>
              {selectedItem.category && (
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                  {selectedItem.category}
                </span>
              )}
            </div>

            {/* Modal Title */}
            <h2 className="font-outfit text-xl sm:text-2xl font-bold leading-tight text-[#0c2b48]">
              {selectedItem.title}
            </h2>

            {selectedItem.subtitle && (
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                {selectedItem.subtitle}
              </p>
            )}

            {/* Lead & Meta */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs border border-slate-100">
              {selectedItem.leadInvestigator && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Lead Investigator:</span>
                  <span className="font-bold text-slate-800">{selectedItem.leadInvestigator}</span>
                </div>
              )}
              {selectedItem.date && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Date / Year:</span>
                  <span className="font-bold text-slate-800">{selectedItem.date}</span>
                </div>
              )}
              {selectedItem.journal && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Publication Venue:</span>
                  <span className="font-bold text-slate-800">{selectedItem.journal}</span>
                </div>
              )}
              {selectedItem.doi && (
                <div>
                  <span className="text-slate-400 block text-[11px]">DOI Identifier:</span>
                  <a
                    href={selectedItem.doi.startsWith("http") ? selectedItem.doi : `https://doi.org/${selectedItem.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-(--accent-dark) underline inline-flex items-center gap-1"
                  >
                    <span>{selectedItem.doi}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Image in modal if exists */}
            {selectedItem.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full max-h-80 object-cover object-top"
                />
              </div>
            )}

            {/* Full Abstract Text */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Abstract &amp; Study Details
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                {selectedItem.abstract || selectedItem.summary || "No abstract details provided."}
              </div>
            </div>

            {/* Keywords */}
            {Array.isArray(selectedItem.keywords) && selectedItem.keywords.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleShare(selectedItem)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share Research"}</span>
              </button>

              <Button
                variant="dark"
                className="px-5 py-2 text-xs font-bold"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
