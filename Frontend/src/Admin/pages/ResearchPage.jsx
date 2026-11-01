import { useState, useMemo, useEffect } from "react";
import {
  Microscope,
  Search,
  ChevronDown,
  Edit2,
  Eye,
  Trash2,
  FlaskConical,
  FileText,
  FileEdit,
  CheckCircle2,
  X,
  Plus,
  ExternalLink,
  Tag,
  User,
  BookOpen,
  LayoutGrid,
  Layers,
  Calendar,
  Link2,
  AlignLeft,
  UploadCloud,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import {
  getResearchList,
  createResearch,
  updateResearch,
  deleteResearch,
  uploadResearchImage,
} from "../api/research.js";

const TYPES = ["All Types", "Research Project", "Publication"];

const STAT_ICONS = {
  flask: FlaskConical,
  file: FileText,
  edit: FileEdit,
  check: CheckCircle2,
};

const LEAD_INVESTIGATORS = [
  "Dr. Amjad Ali Tanoli Ph.D",
  "Dr. Safdar Ali, Ph.D, Postdoc",
  "Dr. Abid Ali, Ph.D, Postdoc",
  "Dr. Samrana Ph.D",
  "Dr. Kifayat Ullah, Ph.D",
  "Dr. Saad Ullah",
];

const CATEGORIES = [
  "Clinical Diagnostics",
  "Genomics & Sequencing",
  "Bioinformatics",
  "Molecular Biology",
  "Crop Genetics",
  "Genomics",
];

const RESEARCH_TYPES = [
  "Research Project",
  "Publication",
  "Clinical Trial",
];

const STATUS_OPTIONS = [
  "Ongoing",
  "Completed",
  "Published",
  "In Review",
];

const DATE_OPTIONS = [
  "Oct 2026",
  "Nov 2026",
  "Dec 2026",
  "Jan 2027",
  "2026",
  "2025",
  "2024",
];

const DEFAULT_FORM_STATE = {
  title: "",
  subtitle: "",
  type: "Research Project",
  category: "Genomics",
  status: "Ongoing",
  date: "Oct 2026",
  leadInvestigator: "Dr. Amjad Ali Tanoli Ph.D",
  journal: "",
  doi: "",
  keywords: "",
  summary: "",
  image: "",
};

export default function ResearchPage() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await getResearchList();
        if (isMounted) setResearchList(data);
      } catch (err) {
        console.error("Failed to load research:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredResearch = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return researchList.filter((item) => {
      const matchType =
        selectedType === "All Types" || item.type === selectedType;

      if (!q) return matchType;

      const keywordsStr = Array.isArray(item.keywords)
        ? item.keywords.join(" ")
        : item.keywords || "";
      const coInvStr = Array.isArray(item.coInvestigators)
        ? item.coInvestigators.join(" ")
        : item.coInvestigators || "";

      const matchSearch =
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.leadInvestigator && item.leadInvestigator.toLowerCase().includes(q)) ||
        (coInvStr && coInvStr.toLowerCase().includes(q)) ||
        (item.affiliations && item.affiliations.toLowerCase().includes(q)) ||
        (item.journal && item.journal.toLowerCase().includes(q)) ||
        (item.doi && item.doi.toLowerCase().includes(q)) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (keywordsStr && keywordsStr.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q)) ||
        (item.date && item.date.toLowerCase().includes(q));

      return matchType && matchSearch;
    });
  }, [researchList, searchTerm, selectedType]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...DEFAULT_FORM_STATE });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      type: item.type || "Research Project",
      category: item.category || "Genomics",
      status: item.status || "Ongoing",
      date: item.date || "Oct 2026",
      leadInvestigator: item.leadInvestigator || "Dr. Amjad Ali Tanoli Ph.D",
      journal: item.journal || "",
      doi: item.doi || "",
      keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : item.keywords || "",
      summary: item.summary || item.abstract || "",
      image: item.image || item.image_url || "",
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB allowed.");
      return;
    }
    setUploadingImage(true);
    try {
      const url = await uploadResearchImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to process image: " + (err.message || "Unknown error"));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSaving(true);
    try {
      const keywordsArray = typeof formData.keywords === "string"
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : formData.keywords;

      const processedData = {
        ...formData,
        keywords: keywordsArray,
      };

      if (editingItem) {
        const updated = await updateResearch(editingItem.id, processedData);
        setResearchList((prev) =>
          prev.map((r) => (r.id === editingItem.id ? { ...r, ...updated } : r))
        );
      } else {
        const created = await createResearch(processedData);
        setResearchList((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Save research error:", err);
      alert("Failed to save research: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteResearch(deleteId);
      setResearchList((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete research error:", err);
      alert("Failed to delete research: " + (err.message || "Unknown error"));
    }
  };

  const dynamicStats = useMemo(
    () => [
      {
        label: "Total Research",
        count: researchList.length,
        icon: FlaskConical,
        circleBg:
          "bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/20 text-[#0da5aa]",
        waveFill: "#0da5aa",
      },
      {
        label: "Ongoing Projects",
        count: researchList.filter(
          (r) => (r.status || "").toLowerCase() === "ongoing"
        ).length,
        icon: FileText,
        circleBg:
          "bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-amber-500",
        waveFill: "#f59e0b",
      },
      {
        label: "Completed Studies",
        count: researchList.filter(
          (r) => (r.status || "").toLowerCase() === "completed"
        ).length,
        icon: CheckCircle2,
        circleBg:
          "bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-400",
        waveFill: "#10b981",
      },
      {
        label: "Publications",
        count: researchList.filter(
          (r) =>
            (r.type || "").toLowerCase().includes("publication") ||
            (r.status || "").toLowerCase() === "published"
        ).length,
        icon: FileEdit,
        circleBg:
          "bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20 text-purple-400",
        waveFill: "#a855f7",
      },
    ],
    [researchList]
  );

  const getStatusBadge = (status) => {
    if (status === "Ongoing") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          Ongoing
        </span>
      );
    }
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-[#0da5aa] border border-teal-500/20">
        Published
      </span>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={FlaskConical}
        title="Research"
        subtitle="Research Projects & Publications"
        breadcrumb="Research"
        actionLabel="Add Research"
        onAction={handleOpenAdd}
      />

      {/* Filter Bar with Live Real Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] px-4 py-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search research..."
            className="w-full bg-transparent pl-7 pr-7 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-56">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1e2f47] bg-slate-50 dark:bg-[#121c2e] px-3 py-2 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer"
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-[#0e1624] text-slate-800 dark:text-slate-100">
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-4.5 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 z-10">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${st.circleBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    {st.label}
                  </p>
                  <h4 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {st.count}
                  </h4>
                </div>
              </div>
              <svg
                className="absolute right-0 bottom-0 top-0 h-full w-28 pointer-events-none opacity-20 dark:opacity-30"
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,45 C35,20 65,55 100,25 L100,60 L0,60 Z"
                  fill={st.waveFill}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Empty State or Research Table with Real Data Display */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-12 text-center shadow-xs">
          <Loader2 className="h-8 w-8 text-[#0da5aa] animate-spin mx-auto mb-2.5" />
          <p className="font-outfit text-sm font-semibold text-slate-600 dark:text-slate-300">
            Loading research from Supabase...
          </p>
        </div>
      ) : filteredResearch.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-12 text-center shadow-xs relative overflow-hidden flex flex-col items-center justify-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 text-[#0da5aa] shadow-[0_0_20px_rgba(13,165,170,0.25)]">
            <FlaskConical className="h-8 w-8 stroke-[1.8]" />
          </div>

          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
            {searchTerm
              ? `No research data matches "${searchTerm}"`
              : "No Research Projects or Publications"}
          </h3>
          <p className="mt-1.5 max-w-md font-inter text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {searchTerm
              ? "Try adjusting search terms or resetting the filter."
              : "No research records have been added to the database yet. Click below to add a research project or publication."}
          </p>
          <button
            type="button"
            onClick={searchTerm ? () => setSearchTerm("") : handleOpenAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0da5aa] hover:bg-[#088395] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{searchTerm ? "Clear Search" : "Add Research Item"}</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1b283d] bg-slate-50/70 dark:bg-[#0b121e]/50 text-slate-500 dark:text-slate-400 font-semibold text-xs select-none">
                  <th className="py-4 pl-6 pr-3 w-12 text-left">#</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Research Study & Investigator</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Type / Category</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="py-4 pr-6 pl-4 text-right font-semibold text-slate-600 dark:text-slate-300 min-w-[130px] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#172336]/60">
                {filteredResearch.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#121c2e]/60 transition-colors group"
                  >
                    <td className="py-4 pl-6 pr-3 text-xs font-semibold text-slate-400 dark:text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-11 w-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-outfit text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                            {item.leadInvestigator && (
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <User className="h-3 w-3 text-[#0da5aa]" />
                                {item.leadInvestigator}
                              </span>
                            )}
                            {item.journal && (
                              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                • <BookOpen className="h-3 w-3 text-sky-500" />
                                {item.journal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-[#0da5aa] border border-teal-500/20">
                        {item.type || item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-normal">
                      {item.date}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewItem(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#152030] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#1b283d] bg-slate-50/50 dark:bg-[#0b121e]/40 px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {filteredResearch.length === 0 ? 0 : 1} to {filteredResearch.length} of {researchList.length} entries
            </span>
            <div className="flex items-center gap-1.5 select-none">
              <button
                type="button"
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0da5aa] font-bold text-white shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal - Exact Match to User Design Reference */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:py-8 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-[#1b283d] shrink-0 bg-white dark:bg-[#0e1624]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0da5aa] text-white shadow-[0_0_15px_rgba(13,165,170,0.35)]">
                  <FlaskConical className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">
                    {editingItem ? "Edit Research Entry" : "Add Research Entry"}
                  </h3>
                  <p className="font-inter text-xs sm:text-sm text-slate-400 mt-0.5">
                    Enter the details of your research project
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4 sm:space-y-5">
              {/* Row 1: Research Title + Subtitle / Brief Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Research Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Genetic Variants"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Subtitle / Brief Description
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Short description..."
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Lead Investigator + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Lead Investigator
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={formData.leadInvestigator}
                      onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
                    >
                      <option value="" className="bg-white dark:bg-[#0e1624]">Select Investigator</option>
                      {LEAD_INVESTIGATORS.map((inv) => (
                        <option key={inv} value={inv} className="bg-white dark:bg-[#0e1624]">{inv}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <LayoutGrid className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0da5aa]" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
                    >
                      <option value="" className="bg-white dark:bg-[#0e1624]">Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-white dark:bg-[#0e1624]">{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Row 3: Type (left) + Status & Date (right) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Type
                  </label>
                  <div className="relative">
                    <Layers className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0da5aa]" />
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
                    >
                      <option value="" className="bg-white dark:bg-[#0e1624]">Select Type</option>
                      {RESEARCH_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-white dark:bg-[#0e1624]">{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500" />
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-7 pr-7 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-white dark:bg-[#0e1624]">{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <select
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-8 pr-7 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:border-[#0da5aa] focus:outline-hidden cursor-pointer transition-colors"
                      >
                        {DATE_OPTIONS.map((d) => (
                          <option key={d} value={d} className="bg-white dark:bg-[#0e1624]">{d}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Journal / Publication Venue + DOI Identifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Journal / Publication Venue
                  </label>
                  <div className="relative">
                    <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0da5aa]" />
                    <input
                      type="text"
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                      placeholder="e.g. Medical Journal"
                      className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    DOI Identifier
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      placeholder="e.g. 10.1038/sample-doi"
                      className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Keywords (comma-separated) */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Keywords (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0da5aa]" />
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g. WES, Genetics"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Row 6: Full Abstract / Summary */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Full Abstract / Summary
                </label>
                <div className="relative">
                  <AlignLeft className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Enter detailed abstract..."
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Row 7: Upload Research Picture (Optional) */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Upload Research Picture (Optional)
                </label>
                {formData.image ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-14 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium">Research image uploaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-3 py-1.5 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1e2f47] hover:border-[#0da5aa] bg-teal-50/15 dark:bg-[#080d17] py-6 px-4 text-center cursor-pointer transition-colors group">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-8 w-8 text-[#0da5aa] animate-spin mb-1.5" />
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Optimizing image...
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-[#0da5aa] mb-1.5 transition-transform group-hover:scale-110" />
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-slate-800 dark:text-white">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, WebP (Max 5MB)</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#1b283d] px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0da5aa] hover:bg-[#088395] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drawer with Complete Study Details */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white dark:bg-[#0e1624] border-l border-slate-200 dark:border-[#1b283d] p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1b283d]">
              <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-white">
                Research Details
              </h3>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {viewItem.image && (
                <img
                  src={viewItem.image}
                  alt={viewItem.title}
                  className="w-full h-44 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-2xs"
                />
              )}

              <div>
                <span className="text-slate-400 font-medium">Title</span>
                <p className="font-outfit text-base font-bold text-slate-800 dark:text-white mt-0.5">
                  {viewItem.title}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {viewItem.subtitle}
                </p>
              </div>

              {viewItem.summary && (
                <div>
                  <span className="text-slate-400 font-medium">Abstract / Summary</span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-[#080d17] p-3 rounded-xl border border-slate-100 dark:border-[#1b283d]">
                    {viewItem.summary}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Lead Investigator</span>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                    {viewItem.leadInvestigator || "Dr. Amjad Ali Tanoli Ph.D"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Category</span>
                  <p className="font-semibold text-[#0da5aa] mt-0.5">
                    {viewItem.category}
                  </p>
                </div>
              </div>

              {viewItem.journal && (
                <div>
                  <span className="text-slate-400 font-medium">Journal / Venue</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.journal}
                  </p>
                </div>
              )}

              {viewItem.doi && (
                <div>
                  <span className="text-slate-400 font-medium">DOI</span>
                  <p className="font-mono text-[#0da5aa] mt-0.5 flex items-center gap-1">
                    {viewItem.doi}
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              )}

              {Array.isArray(viewItem.keywords) && viewItem.keywords.length > 0 && (
                <div>
                  <span className="text-slate-400 font-medium">Keywords</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewItem.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#1b283d]">
                <div>
                  <span className="text-slate-400 font-medium">Status</span>
                  <div className="mt-1">{getStatusBadge(viewItem.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Date</span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{viewItem.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h4 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
              Confirm Delete
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove this research entry?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-200 dark:border-[#1b283d] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
