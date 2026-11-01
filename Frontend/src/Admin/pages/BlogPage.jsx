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
  Loader2,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  slugify,
  isStaticArticle,
  uploadArticleImage,
} from "../api/articles.js";

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
  status: "Published",
  // Blog specific
  author: "Dr. Amjad Ali Tanoli Ph.D",
  tags: "",
  // News specific
  source: "ClinGene Press Office",
  eventDate: "",
};

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
  const [isDeleting, setIsDeleting] = useState(false);

  // Load articles from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        // Clean any old static demo items from localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter((item) => !isStaticArticle(item));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            }
          }
        } catch (_) {}

        const data = await getArticles();
        if (isMounted) setArticles(data);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage as backup cache (sanitized)
  useEffect(() => {
    try {
      const cleanArticles = articles.filter((item) => !isStaticArticle(item));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanArticles));
      } catch {
        // Fallback to storing lightweight metadata without multi-megabyte base64
        const light = cleanArticles.map((a) => {
          if (
            typeof a.image === "string" &&
            a.image.startsWith("data:") &&
            a.image.length > 50000
          ) {
            const { image, image_url, ...rest } = a;
            return { ...rest, image: "", image_url: "" };
          }
          return a;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(light));
      }
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
      status: item.status || "Published",
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

    setIsSaving(true);
    (async () => {
      try {
        if (editingItem) {
          const updated = await updateArticle(editingItem.id, payload);
          setArticles((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? { ...item, ...updated } : item
            )
          );
        } else {
          const created = await createArticle(payload);
          setArticles((prev) => [created, ...prev]);
        }
        setModalOpen(false);
      } catch (err) {
        console.error("Save article error:", err);
        alert("Failed to save article: " + (err.message || "Unknown error"));
      } finally {
        setIsSaving(false);
      }
    })();
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteArticle(deleteTarget.id, deleteTarget.type);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete article error:", err);
      alert("Failed to delete article: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header: EXACTLY ONE Button at top right */}
      <AdminPageHeader
        icon={Newspaper}
        title="Blog & News"
        subtitle="Manage articles, press releases & research highlights"
        breadcrumb="Blog & News"
        actionLabel="+ New Article"
        onAction={handleOpenCreate}
      />

      {/* Filter Bar: Search, Type filter (All / Blog / News), Category, Status */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] px-4 py-3 shadow-xs">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-transparent pl-7 pr-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
          />
        </div>

        {/* Right Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Type Filter: All / Blog / News */}
          <div className="relative w-full sm:w-36">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1e2f47] bg-slate-50 dark:bg-[#121c2e] px-3 py-2 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
            >
              <option value="all" className="bg-white dark:bg-[#0e1624]">All Types</option>
              <option value="blog" className="bg-white dark:bg-[#0e1624]">Blog Articles</option>
              <option value="news" className="bg-white dark:bg-[#0e1624]">News &amp; Events</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1e2f47] bg-slate-50 dark:bg-[#121c2e] px-3 py-2 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#0e1624]">
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
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1e2f47] bg-slate-50 dark:bg-[#121c2e] px-3 py-2 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st} className="bg-white dark:bg-[#0e1624]">
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Section */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-12 text-center shadow-xs">
          <Loader2 className="h-8 w-8 text-[#0da5aa] animate-spin mx-auto mb-2.5" />
          <p className="font-outfit text-sm font-semibold text-slate-600 dark:text-slate-300">
            Loading articles from Supabase...
          </p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-12 text-center shadow-xs relative overflow-hidden flex flex-col items-center justify-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 text-[#0da5aa] shadow-[0_0_20px_rgba(13,165,170,0.25)]">
            <Newspaper className="h-8 w-8 stroke-[1.8]" />
          </div>
          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
            {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
              ? "No articles match your filter criteria"
              : "No Articles Found"}
          </h3>
          <p className="mt-1.5 max-w-md font-inter text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
              ? "Try clearing search keywords or resetting filters."
              : "Create your first article or news piece to publish to the site."}
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
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0da5aa] hover:bg-[#088395] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>
              {searchTerm || selectedType !== "all" || selectedCategory !== "All Categories"
                ? "Clear Filters"
                : "Create Article"}
            </span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1b283d] bg-slate-50/70 dark:bg-[#0b121e]/50 text-slate-500 dark:text-slate-400 font-semibold text-xs select-none">
                  <th className="py-4 pl-6 pr-3 w-12 text-left">#</th>
                  <th className="py-4 px-4 min-w-[260px] font-semibold text-slate-600 dark:text-slate-300">Title</th>
                  <th className="py-4 px-4 min-w-[140px] font-semibold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="py-4 px-4 min-w-[150px] font-semibold text-slate-600 dark:text-slate-300">Author / Source</th>
                  <th className="py-4 px-4 text-center font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="py-4 px-4 min-w-[100px] font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="py-4 pr-6 pl-4 text-right font-semibold text-slate-600 dark:text-slate-300 min-w-[130px] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#172336]/60">
                {currentArticles.map((art, index) => {
                  const isBlog = art.type === "blog";
                  return (
                    <tr
                      key={art.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#121c2e]/60 transition-colors group"
                    >
                      <td className="py-4 pl-6 pr-3 text-xs font-semibold text-slate-400 dark:text-slate-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {art.image ? (
                            <img
                              src={art.image}
                              alt={art.imageAlt || art.title}
                              className="h-10 w-14 shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                          ) : (
                            <div
                              className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-xl border ${
                                isBlog
                                  ? "bg-teal-500/10 text-[#0da5aa] border-teal-500/20"
                                  : "bg-sky-500/10 text-sky-400 border-sky-500/20"
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
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  isBlog
                                    ? "bg-teal-500/10 text-[#0da5aa] border border-teal-500/20"
                                    : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                }`}
                              >
                                {isBlog ? "Blog" : "News"}
                              </span>
                            </div>
                            <p className="font-outfit text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {art.title}
                            </p>
                            {art.excerpt && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {art.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-[#0da5aa] border border-teal-500/20">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium truncate">
                        {isBlog ? art.author || "—" : art.source || "—"}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            art.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${art.status === "Published" ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-400"}`} />
                          {art.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap">
                        {art.date}
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap min-w-[130px]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewItem(art)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#152030] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="View article"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(art)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors cursor-pointer"
                            title="Edit article"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                id: art.id,
                                title: art.title,
                                type: art.type,
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-[#1b283d] bg-slate-50/50 dark:bg-[#0b121e]/40 px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-500 dark:text-slate-400">
              Showing {filteredArticles.length === 0 ? 0 : startIndex + 1} –{" "}
              {Math.min(startIndex + PAGE_SIZE, filteredArticles.length)} of{" "}
              {filteredArticles.length} articles
            </span>

            <div className="flex items-center gap-1.5 select-none">
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#0da5aa] text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ONE UNIFIED MODAL FORM ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-cyan-500/10 text-[#009688] dark:text-[#0da5aa]">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                    {editingItem ? "Edit Article" : "Create Article"}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400">
                    {editingItem
                      ? `Editing "${editingItem.title}"`
                      : "Publish a new scientific blog post or official news announcement"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Type * Selector (Blog / News) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("blog")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === "blog"
                        ? "border-[#0da5aa] bg-teal-50/70 dark:bg-cyan-500/15 text-[#009688] dark:text-cyan-400 ring-1 ring-[#0da5aa] shadow-2xs"
                        : "border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                        ? "border-[#0da5aa] bg-teal-50/70 dark:bg-cyan-500/15 text-[#009688] dark:text-cyan-400 ring-1 ring-[#0da5aa] shadow-2xs"
                        : "border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.slug}</p>
                  )}
                </div>
              </div>

              {/* Category, Status & Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="e.g. Oct 31, 2026"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Dynamic Type-specific fields */}
              {formData.type === "blog" ? (
                /* BLOG FIELDS: Author & Tags */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-teal-50/40 dark:bg-cyan-500/10 border border-teal-100 dark:border-cyan-500/20">
                  <div>
                    <label className="block text-xs font-semibold text-teal-900 dark:text-cyan-200 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="e.g. Dr. Amjad"
                      className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-900 dark:text-cyan-200 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="e.g. Genomics, NGS"
                      className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* NEWS FIELDS: Source & Event Date */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-sky-50/40 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20">
                  <div>
                    <label className="block text-xs font-semibold text-sky-900 dark:text-sky-200 mb-1">
                      Press / Media Source
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      placeholder="e.g. Press Office"
                      className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-900 dark:text-sky-200 mb-1">
                      Event Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      placeholder="e.g. Nov 15, 2026"
                      className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Short Excerpt with live counter (max 160 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Short Excerpt
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      formData.excerpt?.length > 160
                        ? "text-rose-500 font-bold"
                        : "text-slate-400 dark:text-slate-500"
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
                  className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Content
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter full content..."
                  className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-hidden font-sans"
                />
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  Separate paragraphs with a blank line. Rendered as clean structured paragraphs.
                </p>
              </div>

              {/* Cover Image Upload */}
              <ImageUploader
                label="Cover Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                onUpload={uploadArticleImage}
                aspectRatio="aspect-16/9"
                helperText="Upload PNG, JPG, or WebP (~1200 px wide, automatically optimized to WebP) or click 'Enter URL instead'"
              />

              {/* Image Alt Text (Required if image exists) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-hidden ${
                    errors.imageAlt
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] focus:border-[#0da5aa]"
                  }`}
                />
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  Required when an image is set. Describes the photo for accessibility and SEO.
                </p>
                {errors.imageAlt && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.imageAlt}
                  </p>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#1b283d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-200 dark:border-[#1b283d] px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0da5aa] px-5 py-2 text-xs font-semibold text-white hover:bg-[#088395] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSaving ? "Saving..." : (editingItem ? "Save Changes" : "Create Article")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW DRAWER ================= */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white dark:bg-[#0e1624] border-l border-slate-200 dark:border-[#1b283d] p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1b283d]">
              <div className="flex items-center gap-2">
                {viewItem.type === "blog" ? (
                  <BookOpen className="h-4.5 w-4.5 text-[#0da5aa]" />
                ) : (
                  <Radio className="h-4.5 w-4.5 text-sky-400" />
                )}
                <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-white">
                  {viewItem.type === "blog" ? "Blog Article Details" : "News Announcement Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {viewItem.image && (
                <img
                  src={viewItem.image}
                  alt={viewItem.imageAlt || viewItem.title}
                  className="w-full h-44 rounded-xl object-cover border border-slate-200 dark:border-[#1b283d] shadow-2xs"
                />
              )}

              <div>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Title</span>
                <p className="font-outfit text-base font-bold text-slate-800 dark:text-white mt-0.5">
                  {viewItem.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    viewItem.type === "blog"
                      ? "bg-teal-50 dark:bg-cyan-500/15 text-teal-700 dark:text-cyan-300"
                      : "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300"
                  }`}
                >
                  {viewItem.category}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <Calendar className="h-3 w-3" />
                  {viewItem.date}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {viewItem.status}
                </span>
              </div>

              {/* Author (Blog) or Source (News) */}
              {viewItem.type === "blog" ? (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Author</span>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-[#0da5aa]" />
                    {viewItem.author || "Dr. Amjad Ali Tanoli Ph.D"}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Press Source</span>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">
                    {viewItem.source || "ClinGene Press Office"}
                  </p>
                  {viewItem.eventDate && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                      Event Date: {viewItem.eventDate}
                    </p>
                  )}
                </div>
              )}

              {viewItem.excerpt && (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Excerpt</span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 bg-slate-50 dark:bg-[#080d17] p-3 rounded-lg border border-slate-100 dark:border-[#1b283d] leading-relaxed">
                    {viewItem.excerpt}
                  </p>
                </div>
              )}

              {viewItem.content && (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Content</span>
                  <div className="text-slate-700 dark:text-slate-300 mt-1 space-y-2 bg-slate-50 dark:bg-[#080d17] p-3 rounded-lg border border-slate-100 dark:border-[#1b283d] leading-relaxed">
                    {viewItem.content.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(viewItem.tags) && viewItem.tags.length > 0 && (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Tags</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewItem.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded"
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
        isOpen={Boolean(deleteTarget)}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
