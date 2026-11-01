import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  Calendar,
  User,
  ArrowUpRight,
  Share2,
  Check,
  X,
} from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { fetchPublishedBlogs, getInitialCachedBlogs } from "../lib/newsClient.js";
import { getIdbItem } from "../lib/idbCache.js";

const DEFAULT_CATEGORIES = [
  "All",
  "Genomics & Sequencing",
  "Clinical Genetics",
  "Bioinformatics",
  "Precision Medicine",
  "Laboratory Insights",
];

// Map author name to known photo assets in ClinGene
function getAuthorAvatar(authorName) {
  const name = (authorName || "").toLowerCase();
  if (name.includes("amjad")) return "/assets/team/Amjad Ali.jpeg";
  if (name.includes("safdar")) return "/assets/team/Safdar Ali.jpeg";
  if (name.includes("kifayat")) return "/assets/team/Kifayat ullah.jpeg";
  if (name.includes("mudassir")) return "/assets/team/Mudassir.jpeg";
  if (name.includes("abid")) return "/assets/team/Abid Ali.jpeg";
  if (name.includes("tahir")) return "/assets/team/Tahir Ali.jpeg";
  if (name.includes("samrana")) return "/assets/team/samrana.jpeg";
  if (name.includes("imad")) return "/assets/team/Imad Ali.jpeg";
  if (name.includes("saad")) return "/assets/team/Saad.jpeg";
  return null;
}

// Pastel tag pill color palette matching the requested reference UI
const TAG_PALETTE = [
  { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200/70" },
  { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200/70" },
  { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200/70" },
  { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200/70" },
  { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200/70" },
];

function getArticleTags(item) {
  const tags = [];
  if (item.category) tags.push(item.category);
  if (item.tags) {
    const splitTags = Array.isArray(item.tags)
      ? item.tags
      : String(item.tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    splitTags.forEach((t) => {
      if (!tags.includes(t)) tags.push(t);
    });
  }
  if (tags.length === 1) tags.push("Genomics");
  return tags.slice(0, 2);
}

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default function BlogPage() {
  const [blogs, setBlogs] = useState(() => getInitialCachedBlogs());
  const [loading, setLoading] = useState(() => getInitialCachedBlogs().length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  // Background SWR fetch + IndexedDB instant hydration
  useEffect(() => {
    let isMounted = true;

    // Fast IndexedDB hydration if initial cache was empty (<5ms)
    if (blogs.length === 0) {
      getIdbItem("clingene_public_blogs_v2").then((cached) => {
        if (isMounted && Array.isArray(cached) && cached.length > 0) {
          setBlogs(cached);
          setLoading(false);
        }
      });
    }

    async function loadData() {
      try {
        const data = await fetchPublishedBlogs();
        if (isMounted && Array.isArray(data)) {
          setBlogs(data);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[BlogPage] Failed to fetch blogs:", err);
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

  // Handle escape key to close modal
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
    DEFAULT_CATEGORIES.forEach((c) => set.add(c));
    blogs.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [blogs]);

  // Filtered & sorted blogs: 1st is newest, 2nd, 3rd, etc. follow
  const filteredBlogs = useMemo(() => {
    const list = blogs.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.tags && String(item.tags).toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });

    // Ensure newest is always 1st place, then 2nd, 3rd, etc.
    list.sort((a, b) => {
      const dateA = new Date(a.date || a.publish_date || a.created_at || 0).getTime();
      const dateB = new Date(b.date || b.publish_date || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return list;
  }, [blogs, searchTerm, selectedCategory]);

  // 1st place article: Newest article in featured layout
  const firstArticle = filteredBlogs.length > 0 ? filteredBlogs[0] : null;

  // 2nd, 3rd, 4th, etc. articles: Below in 3-in-a-row grid
  const remainingArticles = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  const handleShare = (article) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/blogs#${article.slug || article.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0c2b48] py-16 sm:py-20 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_60%)] opacity-30 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative site-container max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm text-cyan-200">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Scientific Articles &amp; Insights</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="mt-4 font-outfit text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              ClinGene <span style={{ color: "var(--accent)" }}>Blog</span> &amp; Publications
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
              Explore scientific articles, clinical genetics perspectives, and bioinformatics
              breakthroughs authored by our scientists and directors.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Search & Filter Controls ── */}
      {blogs.length > 0 && (
        <section className="site-container max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles by headline, topic, author..."
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

              {/* Category Filter Pills */}
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

            {/* Active search/category reset */}
            {(searchTerm || selectedCategory !== "All") && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  Found <strong>{filteredBlogs.length}</strong> article
                  {filteredBlogs.length === 1 ? "" : "s"}
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

      {/* ── Main Content Section ── */}
      <section className="site-container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading && blogs.length === 0 ? (
          /* Sleek Skeleton Loading State */
          <div className="space-y-12 animate-pulse">
            {/* Top Featured Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 aspect-4/3 sm:aspect-16/10 rounded-3xl bg-slate-200" />
              <div className="lg:col-span-6 space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-slate-200" />
                  <div className="h-6 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="h-8 w-3/4 rounded-lg bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-5 w-28 rounded bg-slate-200 mt-6" />
              </div>
            </div>
            {/* 3-in-a-row Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden p-0">
                  <div className="aspect-16/10 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-20 rounded-full bg-slate-200" />
                    <div className="h-6 w-full rounded bg-slate-200" />
                    <div className="h-4 w-4/5 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs my-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-(--accent) mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-slate-900">
              No Blog Articles Found
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
              {searchTerm || selectedCategory !== "All"
                ? "No articles matched your search filter. Try clearing your search keywords."
                : "Scientific blog articles and genomic insights will appear here once published from the admin panel."}
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
          <div className="space-y-12 sm:space-y-16">
            {/* ── 1ST PLACE: Top Featured Article (Exact 2-Column UI Design) ── */}
            {firstArticle && (
              <article
                onClick={() => setActiveArticle(firstArticle)}
                className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left: Featured Image with rounded corners */}
                <div className="lg:col-span-6 relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xs">
                  <img
                    src={firstArticle.image || "/images/clingene-logo.webp"}
                    alt={firstArticle.imageAlt || firstArticle.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>

                {/* Right: Tag pills, Date, Title, Excerpt, Read Article link */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  {/* Tags and Date Row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {getArticleTags(firstArticle).map((tag, idx) => {
                        const pillStyle = TAG_PALETTE[idx % TAG_PALETTE.length];
                        return (
                          <span
                            key={tag}
                            className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${pillStyle.bg} ${pillStyle.text} ${pillStyle.border}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    {(firstArticle.date || firstArticle.publish_date) && (
                      <span className="text-xs sm:text-sm font-medium text-slate-400">
                        {firstArticle.date || firstArticle.publish_date}
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-slate-900 group-hover:text-(--accent-dark) transition-colors">
                    {firstArticle.title}
                  </h2>

                  {/* Excerpt Body */}
                  <div className="mt-4 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-4">
                    <p>{firstArticle.excerpt}</p>
                  </div>

                  {/* Read Article ↗ Link */}
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-slate-900 group-hover:text-(--accent-dark) transition-colors">
                      Read Article
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* ── 2ND, 3RD, 4TH, ETC.: Below 3-in-a-Row Card Grid ── */}
            {remainingArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {remainingArticles.map((article, idx) => {
                  const tags = getArticleTags(article);
                  const authorAvatar = getAuthorAvatar(article.author);
                  const displayDate = article.date || article.publish_date || "Recent";

                  return (
                    <article
                      key={article.id || idx}
                      onClick={() => setActiveArticle(article)}
                      className="group flex flex-col justify-between cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                    >
                      <div>
                        {/* Top Card Image */}
                        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                          <img
                            src={article.image || "/images/clingene-logo.webp"}
                            alt={article.imageAlt || article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            decoding="async"
                          />
                        </div>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6">
                          {/* Tags row */}
                          <div className="flex items-center gap-2 mb-3">
                            {tags.map((tag, tIdx) => {
                              const pillStyle = TAG_PALETTE[tIdx % TAG_PALETTE.length];
                              return (
                                <span
                                  key={tag}
                                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pillStyle.bg} ${pillStyle.text} ${pillStyle.border}`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>

                          {/* Title */}
                          <h3 className="font-outfit text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-(--accent-dark) transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="mt-2 text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Author Footer Row */}
                      <div className="border-t border-slate-100 p-5 sm:p-6 pt-4 flex items-center gap-3">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={article.author || "Author"}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs ring-2 ring-slate-100">
                            {article.author
                              ? article.author
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join("")
                              : "CG"}
                          </div>
                        )}

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {article.author || "ClinGene Research Team"}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            Updated on : {displayDate}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Reading Modal View ── */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
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
                {getArticleTags(activeArticle).map((tag, idx) => {
                  const pillStyle = TAG_PALETTE[idx % TAG_PALETTE.length];
                  return (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pillStyle.bg} ${pillStyle.text} ${pillStyle.border}`}
                    >
                      {tag}
                    </span>
                  );
                })}
                {(activeArticle.date || activeArticle.publish_date) && (
                  <span className="text-xs text-slate-400 font-medium">
                    • {activeArticle.date || activeArticle.publish_date}
                  </span>
                )}
              </div>

              <button
                type="button"
                aria-label="Close article modal"
                onClick={() => setActiveArticle(null)}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              {/* Title */}
              <h2
                id="modal-article-title"
                className="font-outfit text-2xl sm:text-3xl font-extrabold leading-snug text-slate-900"
              >
                {activeArticle.title}
              </h2>

              {/* Author & Meta */}
              <div className="mt-4 flex items-center gap-3">
                {getAuthorAvatar(activeArticle.author) ? (
                  <img
                    src={getAuthorAvatar(activeArticle.author)}
                    alt={activeArticle.author || "Author"}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 font-bold text-sm ring-2 ring-slate-100">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {activeArticle.author || "ClinGene Research Team"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Updated on : {activeArticle.date || activeArticle.publish_date || "Recent"}
                  </div>
                </div>
              </div>

              {/* Main Image */}
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

              {/* Full Article Content */}
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
                    <span>Share Article</span>
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