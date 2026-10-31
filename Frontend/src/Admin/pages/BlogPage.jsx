import { useState, useMemo, useEffect } from "react";
import {
  Newspaper,
  BookOpen,
  Radio,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Trash2,
  X,
  Plus,
  Calendar,
  User,
  Tag,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const STORAGE_KEY = "clingene_admin_articles_data";
const PAGE_SIZE = 8;

const CATEGORIES = [
  "All Categories",
  "Genomics & Sequencing",
  "Clinical Genetics",
  "Bioinformatics",
  "Precision Medicine",
  "Laboratory Insights",
  "Press Release",
  "Company Milestone",
  "Event Announcement",
  "Media Coverage",
];

const STATUSES = ["All Status", "Published", "Draft"];

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function loadInitialArticles() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Backward compatibility: migrate any existing blogs or news
    const rawBlogs = localStorage.getItem("clingene_admin_blogs_data");
    const rawNews = localStorage.getItem("clingene_admin_news_data");
    const migrated = [];
    if (rawBlogs) {
      const bList = JSON.parse(rawBlogs);
      if (Array.isArray(bList)) {
        bList.forEach((b) => migrated.push({ ...b, type: "blog" }));
      }
    }
    if (rawNews) {
      const nList = JSON.parse(rawNews);
      if (Array.isArray(nList)) {
        nList.forEach((n) =>
          migrated.push({
            ...n,
            type: "news",
            title: n.headline || n.title,
          })
        );
      }
    }
    if (migrated.length > 0) return migrated;
  } catch (e) {
    console.warn("Could not load stored articles", e);
  }
  return [];
}

const DEFAULT_FORM_STATE = {
  type: "blog", // 'blog' | 'news'
  title: "",
  slug: "",
  category: "Genomics & Sequencing",
  excerpt: "",
  content: "",
  image: "",
  imageAlt: "",
  date: new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  status: "Draft",
  // Blog specific
  author: "Dr. Amjad Ali Tanoli Ph.D",
  tags: "",
  // News specific
  source: "ClinGene Press Office",
  eventDate: "",
};

export default function BlogPage() {
  const [articles, setArticles] = useState(loadInitialArticles);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'blog' | 'news'
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State (One unified form)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});

  // View Drawer State
  const [viewItem, setViewItem] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.warn("Could not save articles to localStorage", e);
    }
  }, [articles]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedCategory, selectedStatus]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return articles.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      // Category filter
      if (
        selectedCategory !== "All Categories" &&
        item.category !== selectedCategory
      ) {
        return false;
      }
      // Status filter
      if (
        selectedStatus !== "All Status" &&
        item.status !== selectedStatus
      ) {
        return false;
      }
      // Search term
      if (q) {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const excerptMatch = item.excerpt?.toLowerCase().includes(q);
        const authorMatch = item.author?.toLowerCase().includes(q);
        const sourceMatch = item.source?.toLowerCase().includes(q);
        if (!titleMatch && !excerptMatch && !authorMatch && !sourceMatch) {
          return false;
        }
      }
      return true;
    });
  }, [articles, searchTerm, selectedType, selectedCategory, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Open Create Modal (Exactly ONE button opens this)
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...DEFAULT_FORM_STATE,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
    setErrors({});
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || "blog",
      title: item.title || "",
      slug: item.slug || slugify(item.title || ""),
      category: item.category || "Genomics & Sequencing",
      excerpt: item.excerpt || "",
      content: item.content || "",
      image: item.image || "",
      imageAlt: item.imageAlt || "",
      date: item.date || item.publish_date || "",
      status: item.status || "Draft",
      author: item.author || "Dr. Amjad Ali Tanoli Ph.D",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      source: item.source || "ClinGene Press Office",
      eventDate: item.eventDate || item.event_date || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  // Handle Type Switch without losing common fields
  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  // Handle Title Change & auto-slug
  const handleTitleChange = (val) => {
    const updates = { title: val };
    if (!editingItem && (!formData.slug || formData.slug === slugify(formData.title))) {
      updates.slug = slugify(val);
    }
    setFormData((prev) => ({ ...prev, ...updates }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  // Validate & Save Form
  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL Slug is required.";
    } else {
      // Uniqueness check
      const normalizedSlug = slugify(formData.slug);
      const isTaken = articles.some(
        (a) =>
          a.id !== editingItem?.id &&
          slugify(a.slug || a.title) === normalizedSlug
      );
      if (isTaken) {
        newErrors.slug = "This URL slug is already taken. Please enter a unique slug.";
      }
    }

    if (formData.image && !formData.imageAlt.trim()) {
      newErrors.imageAlt = "Alt text is required when an image is set.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare payload, setting opposite type-specific fields to null
    const tagsArray =
      formData.type === "blog" && typeof formData.tags === "string"
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(formData.tags)
        ? formData.tags
        : [];

    const payload = {
      type: formData.type,
      title: formData.title.trim(),
      slug: slugify(formData.slug),
      category: formData.category,
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      image: formData.image,
      imageAlt: formData.imageAlt.trim(),
      date: formData.date,
      status: formData.status,
      author: formData.type === "blog" ? formData.author.trim() : null,
      tags: formData.type === "blog" ? tagsArray : null,
      source: formData.type === "news" ? formData.source.trim() : null,
      eventDate: formData.type === "news" ? formData.eventDate : null,
    };

    if (editingItem) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...payload } : item
        )
      );
    } else {
      const newEntry = {
        id: Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      setArticles((prev) => [newEntry, ...prev]);
    }

    setModalOpen(false);
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header: EXACTLY ONE Button at top right */}
      <AdminPageHeader
        icon={Newspaper}
        title="Blog & News"
        subtitle="Manage Medical Articles, Scientific Blogs & Official News"
        breadcrumb="Blog & News"
        actionLabel="+ Create Article"
        onAction={handleOpenCreate}
      />

      {/* Filter Bar: Search, Type filter (All / Blog / News), Category, Status */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-xs">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-lg border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Right Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Type Filter: All / Blog / News */}
          <div className="relative w-full sm:w-36">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:border-[#009688] focus:border-[#009688] focus:outline-hidden cursor-pointer transition-colors"
            >
              <option value="all">All Types</option>
              <option value="blog">Blog Articles</option>
              <option value="news">News &amp; Events</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:border-[#009688] focus:border-[#009688] focus:outline-hidden cursor-pointer transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-32">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:border-[#009688] focus:border-[#009688] focus:outline-hidden cursor-pointer transition-colors"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Unified Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[260px]">Title</th>
                <th className="py-3.5 px-4 min-w-[140px]">Category</th>
                <th className="py-3.5 px-4 min-w-[150px]">Author / Source</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 min-w-[100px]">Date</th>
                <th className="py-3.5 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <Newspaper className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="font-outfit text-sm font-bold text-slate-700">
                      {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
                        ? "No articles match your filter criteria"
                        : "No Articles Found"}
                    </p>
                    <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
                        ? "Try clearing search keywords or resetting filters."
                        : "Create and publish medical blog articles and news releases."}
                    </p>
                    <button
                      type="button"
                      onClick={
                        searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
                          ? () => {
                              setSearchTerm("");
                              setSelectedType("all");
                              setSelectedCategory("All Categories");
                              setSelectedStatus("All Status");
                            }
                          : handleOpenCreate
                      }
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00897b] transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
                          ? "Clear Filters"
                          : "Create Article"}
                      </span>
                    </button>
                  </td>
                </tr>
              ) : (
                currentArticles.map((art, index) => {
                  const isBlog = art.type === "blog";
                  return (
                    <tr
                      key={art.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-4 px-4 text-center text-slate-400 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {art.image ? (
                            <img
                              src={art.image}
                              alt={art.imageAlt || art.title}
                              className="h-10 w-14 shrink-0 rounded-md object-cover border border-slate-100 shadow-2xs"
                            />
                          ) : (
                            <div
                              className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-md border ${
                                isBlog
                                  ? "bg-teal-50 text-[#009688] border-teal-100"
                                  : "bg-sky-50 text-sky-600 border-sky-100"
                              }`}
                            >
                              {isBlog ? (
                                <BookOpen className="h-5 w-5" />
                              ) : (
                                <Radio className="h-5 w-5" />
                              )}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider ${
                                  isBlog
                                    ? "bg-teal-50 text-[#009688] border border-teal-200/60"
                                    : "bg-sky-50 text-sky-700 border border-sky-200/60"
                                }`}
                              >
                                {isBlog ? "Blog" : "News"}
                              </span>
                            </div>
                            <p className="font-outfit text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                              {art.title}
                            </p>
                            {art.excerpt && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {art.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium truncate">
                        {isBlog ? art.author || "—" : art.source || "—"}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            art.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-normal whitespace-nowrap">
                        {art.date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewItem(art)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="View article"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(art)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                            title="Edit article"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                id: art.id,
                                title: art.title,
                              })
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
          <span className="font-medium text-slate-500">
            Showing {filteredArticles.length === 0 ? 0 : startIndex + 1} –{" "}
            {Math.min(startIndex + PAGE_SIZE, filteredArticles.length)} of{" "}
            {filteredArticles.length} articles
          </span>

          <div className="flex items-center gap-1.5 select-none">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === validCurrentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#009688] text-white shadow-xs"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ONE UNIFIED MODAL FORM ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#009688]">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-800">
                    {editingItem ? "Edit Article" : "Create Article"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingItem
                      ? `Editing "${editingItem.title}"`
                      : "Publish a new scientific blog post or official news announcement"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Type * Selector (Blog / News) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("blog")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === "blog"
                        ? "border-[#009688] bg-teal-50/70 text-[#009688] ring-1 ring-[#009688] shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Blog Article</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange("news")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === "news"
                        ? "border-[#009688] bg-teal-50/70 text-[#009688] ring-1 ring-[#009688] shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Radio className="h-4 w-4" />
                    <span>News Announcement</span>
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={
                      formData.type === "blog"
                        ? "Enter blog title"
                        : "Enter news headline"
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: slugify(e.target.value) })
                    }
                    placeholder="e.g. article-slug"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.slug}</p>
                  )}
                </div>
              </div>

              {/* Category, Status & Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="e.g. Oct 31, 2026"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Dynamic Type-specific fields */}
              {formData.type === "blog" ? (
                /* BLOG FIELDS: Author & Tags */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-teal-50/40 border border-teal-100">
                  <div>
                    <label className="block text-xs font-semibold text-teal-900 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="e.g. Dr. Amjad"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-900 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="e.g. Genomics, NGS"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* NEWS FIELDS: Source & Event Date */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-sky-50/40 border border-sky-100">
                  <div>
                    <label className="block text-xs font-semibold text-sky-900 mb-1">
                      Press / Media Source
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      placeholder="e.g. Press Office"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-900 mb-1">
                      Event Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      placeholder="e.g. Nov 15, 2026"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Short Excerpt with live counter (max 160 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Short Excerpt
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      formData.excerpt?.length > 160
                        ? "text-rose-500 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {formData.excerpt?.length || 0}/160
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Enter short excerpt..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Content
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter full content..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden font-sans"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Separate paragraphs with a blank line. Rendered as clean structured paragraphs.
                </p>
              </div>

              {/* Cover Image Upload */}
              <ImageUploader
                label="Cover Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                aspectRatio="aspect-16/9"
                helperText="Upload PNG, JPG, or WebP (~1200 px wide, under 150 KB recommended) or click 'Enter URL instead'"
              />

              {/* Image Alt Text (Required if image exists) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alt Text{" "}
                  {formData.image && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={(e) => {
                    setFormData({ ...formData, imageAlt: e.target.value });
                    if (errors.imageAlt) {
                      setErrors((prev) => ({ ...prev, imageAlt: undefined }));
                    }
                  }}
                  placeholder="e.g. Laboratory technician"
                  className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 focus:outline-hidden ${
                    errors.imageAlt
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-slate-200 focus:border-[#009688]"
                  }`}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Required when an image is set. Describes the photo for accessibility and SEO.
                </p>
                {errors.imageAlt && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.imageAlt}
                  </p>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] transition-colors shadow-xs cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW DRAWER ================= */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {viewItem.type === "blog" ? (
                  <BookOpen className="h-4.5 w-4.5 text-[#009688]" />
                ) : (
                  <Radio className="h-4.5 w-4.5 text-sky-600" />
                )}
                <h3 className="font-outfit text-base font-bold text-slate-800">
                  {viewItem.type === "blog" ? "Blog Article Details" : "News Announcement Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {viewItem.image && (
                <img
                  src={viewItem.image}
                  alt={viewItem.imageAlt || viewItem.title}
                  className="w-full h-44 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
              )}

              <div>
                <span className="text-slate-400 font-medium">Title</span>
                <p className="font-outfit text-base font-bold text-slate-800 mt-0.5">
                  {viewItem.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    viewItem.type === "blog"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {viewItem.category}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                  <Calendar className="h-3 w-3" />
                  {viewItem.date}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {viewItem.status}
                </span>
              </div>

              {/* Author (Blog) or Source (News) */}
              {viewItem.type === "blog" ? (
                <div>
                  <span className="text-slate-400 font-medium">Author</span>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-[#009688]" />
                    {viewItem.author || "Dr. Amjad Ali Tanoli Ph.D"}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 font-medium">Press Source</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {viewItem.source || "ClinGene Press Office"}
                  </p>
                  {viewItem.eventDate && (
                    <p className="text-slate-500 text-[11px] mt-1">
                      Event Date: {viewItem.eventDate}
                    </p>
                  )}
                </div>
              )}

              {viewItem.excerpt && (
                <div>
                  <span className="text-slate-400 font-medium">Excerpt</span>
                  <p className="text-slate-600 mt-0.5 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {viewItem.excerpt}
                  </p>
                </div>
              )}

              {viewItem.content && (
                <div>
                  <span className="text-slate-400 font-medium">Content</span>
                  <div className="text-slate-700 mt-1 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {viewItem.content.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(viewItem.tags) && viewItem.tags.length > 0 && (
                <div>
                  <span className="text-slate-400 font-medium">Tags</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewItem.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION ================= */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Article"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
