import { useState, useEffect, useMemo } from "react";
import {
  Newspaper,
  Calendar,
  Search,
  ArrowRight,
  X,
  Building2,
  Share2,
  Check,
  Flame,
  Radio,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { fetchPublishedNews, getInitialCachedNews } from "../lib/newsClient.js";
import { getIdbItem } from "../lib/idbCache.js";
import resourcesHero from "../assets/Resources.webp";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default function NewsPage() {
  const [news, setNews] = useState(() => getInitialCachedNews());
  const [loading, setLoading] = useState(() => getInitialCachedNews().length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  // Background SWR fetch + IndexedDB instant hydration
  useEffect(() => {
    let isMounted = true;

    // Fast IndexedDB hydration if initial cache was empty (<5ms)
    if (news.length === 0) {
      getIdbItem("clingene_public_news_v2").then((cached) => {
        if (isMounted && Array.isArray(cached) && cached.length > 0) {
          setNews(cached);
          setLoading(false);
        }
      });
    }

    async function loadData() {
      try {
        const data = await fetchPublishedNews();
        if (isMounted && Array.isArray(data)) {
          setNews(data);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[NewsPage] Failed to fetch news:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (activeArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeArticle]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveArticle(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    news.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [news]);

  // Filtered & sorted news items (newest first)
  const filteredNews = useMemo(() => {
    const list = news.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });

    list.sort((a, b) => {
      const dateA = new Date(a.date || a.publish_date || a.created_at || 0).getTime();
      const dateB = new Date(b.date || b.publish_date || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return list;
  }, [news, searchTerm, selectedCategory]);

  // Section items matching user reference layout
  const breakingNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const popularNews = filteredNews.length > 1 ? filteredNews.slice(1, 5) : [];
  const editorChoiceNews =
    filteredNews.length > 5 ? filteredNews.slice(5) : filteredNews.slice(1, 4);

  const handleShare = (article) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/news#${article.slug || article.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* High-priority LCP Preload for Hero Image */}
      <link rel="preload" as="image" href={resourcesHero} fetchPriority="high" />

      {/* ── News Hero Section ── */}
      <section
        aria-labelledby="news-hero-title"
        className="relative isolate flex min-h-100 sm:min-h-110 lg:min-h-117.5 items-center overflow-hidden text-white transition-colors duration-500"
        id="news-hero"
        style={{ backgroundColor: "var(--hero-bg)" }}
      >
        {/* Full-screen background image across the whole hero section */}
        <img
          alt="ClinGene official news and media releases"
          width="2048"
          height="768"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero-bg-img absolute inset-0 -z-20 h-full w-full object-cover object-[80%_center] sm:object-[72%_center] lg:object-center transition-all duration-500"
          src={resourcesHero}
          style={{
            filter: "var(--hero-img-filter)",
          }}
        />

        {/* Responsive theme-aware gradient overlay: solid readability on left, reveals resource photography across the right */}
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
                <li>
                  <span className="text-[#E2E8F0]/80">Resources</span>
                </li>
                <li aria-hidden="true" className="text-[#E2E8F0]/60">›</li>
                <li className="text-[#E2E8F0]" aria-current="page">News</li>
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
                OFFICIAL PRESS &amp; MEDIA
              </p>
            </div>

            {/* Main heading */}
            <h1
              className="font-['Inter'] text-[32px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-extrabold leading-[1.14] tracking-tight text-white max-w-170"
              id="news-hero-title"
            >
              Latest News.{" "}
              <span style={{ color: "var(--hero-accent)", transition: "color 0.4s ease-in-out" }}>
                Announcements &amp; Media
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-125 text-sm sm:text-base leading-6 text-[#E2E8F0]">
              Real-time clinical genetic breakthroughs, laboratory accreditations, and official
              announcements from ClinGene Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filter & Search Floating Bar ── */}
      {news.length > 0 && (
        <section className="site-container max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search announcements, headlines, press sources..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-(--accent) focus:bg-white focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0c2b48] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear filters count */}
            {(searchTerm || selectedCategory !== "All") && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  Showing <strong>{filteredNews.length}</strong> announcement
                  {filteredNews.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="font-semibold text-(--accent-dark) hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Main Magazine News Layout (Matching Reference Design) ── */}
      <main className="site-container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading && news.length === 0 ? (
          /* Sleek Skeleton Loading State */
          <div className="space-y-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Tall Card Skeleton */}
              <div className="lg:col-span-6 rounded-2xl bg-slate-200 h-[460px]" />
              {/* Right 2x2 Grid Skeleton */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded-xl overflow-hidden space-y-2">
                    <div className="aspect-16/10 bg-slate-200 rounded-xl" />
                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs my-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-(--accent) mb-4">
              <Newspaper className="h-8 w-8" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-slate-900">
              No News Announcements Found
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
              {searchTerm || selectedCategory !== "All"
                ? "No announcements matched your search filter. Try clearing your search term or category."
                : "Official announcements and press releases will appear here as soon as they are published."}
            </p>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-5 rounded-full bg-(--accent) px-5 py-2 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-14 sm:space-y-16">
            {/* ════════════ SECTION 1: BREAKING NEWS & POPULAR NOW ════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Breaking News (Tall Feature Card) */}
              {breakingNews && (
                <div className="lg:col-span-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-5 w-5 text-rose-500" />
                    <h2 className="font-outfit text-xl font-bold text-slate-900">
                      Breaking News
                    </h2>
                  </div>

                  <article
                    onClick={() => setActiveArticle(breakingNews)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl aspect-3/4 sm:aspect-4/5 lg:h-[460px] xl:h-[480px] w-full"
                  >
                    {/* Background Image */}
                    <img
                      src={breakingNews.image || "/images/clingene-logo.webp"}
                      alt={breakingNews.imageAlt || breakingNews.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      decoding="async"
                      fetchPriority="high"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                    {/* Top Tag: BREAKING */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-sm bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                        Breaking
                      </span>
                    </div>

                    {/* Bottom Content Info */}
                    <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end">
                      {/* Category Badge */}
                      <span className="self-start rounded-xs bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 mb-2">
                        {breakingNews.category || "Press Release"}
                      </span>

                      {/* Title */}
                      <h3 className="font-outfit text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-white group-hover:text-cyan-200 transition-colors line-clamp-3">
                        {breakingNews.title}
                      </h3>

                      {/* Excerpt */}
                      {breakingNews.excerpt && (
                        <p className="mt-2 text-xs sm:text-sm text-slate-200/90 line-clamp-2 leading-relaxed">
                          {breakingNews.excerpt}
                        </p>
                      )}

                      {/* Date & Source Row */}
                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-300 font-medium">
                        <span>{breakingNews.date || breakingNews.publish_date || "Recent"}</span>
                        <span>•</span>
                        <span className="truncate">{breakingNews.source || "ClinGene Press Office"}</span>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Right Column: Popular Now (2x2 Grid) */}
              <div className="lg:col-span-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-outfit text-xl font-bold text-slate-900">
                    Popular Now
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {(popularNews.length > 0 ? popularNews : [breakingNews]).map((item, idx) => (
                    <article
                      key={item.id || idx}
                      onClick={() => setActiveArticle(item)}
                      className="group cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                      {/* Image with Tag Overlay */}
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-100 shadow-2xs">
                        <img
                          src={item.image || "/images/clingene-logo.webp"}
                          alt={item.imageAlt || item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          decoding="async"
                        />
                        {/* Overlay Category Tag */}
                        <div className="absolute bottom-2 left-2 z-10">
                          <span className="rounded-xs bg-black/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {item.category || "Milestone"}
                          </span>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="mt-2.5 flex-1 flex flex-col">
                        <h3 className="font-outfit text-sm sm:text-base font-bold text-slate-900 group-hover:text-(--accent-dark) transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.excerpt || item.content}
                        </p>

                        <div className="mt-2 text-[11px] text-slate-400 font-medium">
                          {item.date || item.publish_date || "Recent"}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* ════════════ SECTION 2: MIDDLE PROMO / APP BANNER ════════════ */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c2b48] via-[#0284c7] to-[#0369a1] p-6 sm:p-8 text-white shadow-md">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-outfit text-xl sm:text-2xl font-extrabold text-white">
                    Stay Connected with ClinGene Research &amp; Diagnostics
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Access genetic testing reports, request physician clinical consultations,
                    or subscribe to our quarterly scientific publications.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Button
                    href="/contact"
                    className="px-5 py-2.5 text-xs font-bold bg-white text-[#0c2b48] hover:bg-slate-100"
                  >
                    Contact Us
                  </Button>
                  <Button
                    href="/services"
                    className="px-5 py-2.5 text-xs font-bold border border-white/40 bg-white/10 hover:bg-white/20"
                  >
                    Explore Services
                  </Button>
                </div>
              </div>

              {/* Decorative background glow */}
              <div
                className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* ════════════ SECTION 3: MORE NEWS (3-IN-A-ROW GRID) ════════════ */}
            {editorChoiceNews.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Bookmark className="h-5 w-5 text-(--accent)" />
                  <h2 className="font-outfit text-xl sm:text-2xl font-bold text-slate-900">
                    Editor Choice &amp; Updates
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {editorChoiceNews.map((item, idx) => (
                    <article
                      key={item.id || idx}
                      onClick={() => setActiveArticle(item)}
                      className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-100 shadow-2xs">
                        <img
                          src={item.image || "/images/clingene-logo.webp"}
                          alt={item.imageAlt || item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          decoding="async"
                        />
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          <span className="rounded-xs bg-black/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {item.category || "Genomics"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-outfit text-base font-bold text-slate-900 group-hover:text-(--accent-dark) transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.excerpt || item.content}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                          <span>{item.date || item.publish_date || "Recent"}</span>
                          <span>{item.source || "ClinGene"}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Reading Modal View ── */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-news-title"
          className="fixed inset-0 z-1050 flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveArticle(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="rounded-xs bg-black/85 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                  {activeArticle.category || "Press Release"}
                </span>
                {(activeArticle.date || activeArticle.publish_date) && (
                  <span className="text-xs text-slate-400 font-medium">
                    • {activeArticle.date || activeArticle.publish_date}
                  </span>
                )}
              </div>

              <button
                type="button"
                aria-label="Close news modal"
                onClick={() => setActiveArticle(null)}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              {/* Title */}
              <h2
                id="modal-news-title"
                className="font-outfit text-2xl sm:text-3xl font-extrabold leading-snug text-slate-900"
              >
                {activeArticle.title}
              </h2>

              {/* Source attribution */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>Source: <strong>{activeArticle.source || "ClinGene Press Office"}</strong></span>
                {activeArticle.eventDate && (
                  <>
                    <span>•</span>
                    <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                      Event Date: {activeArticle.eventDate}
                    </span>
                  </>
                )}
              </div>

              {/* Image */}
              {activeArticle.image && (
                <div className="my-6 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.imageAlt || activeArticle.title}
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Lead */}
              {activeArticle.excerpt && (
                <div className="mb-5 rounded-xl border-l-4 border-(--accent) bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-700">
                  {activeArticle.excerpt}
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
                {(activeArticle.content || "")
                  .split("\n\n")
                  .filter((p) => p.trim())
                  .map((para, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/70">
              <button
                type="button"
                onClick={() => handleShare(activeArticle)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-slate-500" />
                    <span>Share Announcement</span>
                  </>
                )}
              </button>

              <Button
                className="px-4 py-2 text-xs"
                onClick={() => setActiveArticle(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}