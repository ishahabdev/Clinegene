import { useState, useMemo } from "react";
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
  ExternalLink,
  Tag,
  User,
  BookOpen,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import { MOCK_RESEARCH, RESEARCH_STATS } from "../mocks/mockData.js";

const TYPES = ["All Types", "Research Project", "Publication"];

const STAT_ICONS = {
  flask: FlaskConical,
  file: FileText,
  edit: FileEdit,
  check: CheckCircle2,
};

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
  const [researchList, setResearchList] = useState(MOCK_RESEARCH);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [deleteId, setDeleteId] = useState(null);

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
      summary: item.summary || "",
      image: item.image || "",
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const keywordsArray = typeof formData.keywords === "string"
      ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : formData.keywords;

    const processedData = {
      ...formData,
      keywords: keywordsArray,
    };

    if (editingItem) {
      setResearchList((prev) =>
        prev.map((r) => (r.id === editingItem.id ? { ...r, ...processedData } : r))
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...processedData,
      };
      setResearchList((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setResearchList((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Ongoing") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">
          Ongoing
        </span>
      );
    }
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-200/60">
        Published
      </span>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={Microscope}
        title="Research"
        subtitle="Research Projects & Publications"
        breadcrumb="Research"
        actionLabel="Add Research"
        onAction={handleOpenAdd}
      />

      {/* Filter Bar with Live Real Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search research..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-9 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
            className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-hidden cursor-pointer"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RESEARCH_STATS.map((st) => {
          const Icon = STAT_ICONS[st.icon] || FlaskConical;
          return (
            <div
              key={st.label}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${st.bgColor} ${st.textColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">
                  {st.label}
                </p>
                <h4 className="font-outfit text-base font-bold text-slate-800">
                  {st.count}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Table with Real Data Display */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Research Study & Investigator</th>
                <th className="py-3.5 px-4">Type / Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResearch.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <FlaskConical className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="font-outfit text-sm font-bold text-slate-700">
                      {searchTerm
                        ? `No research data matches "${searchTerm}"`
                        : "No Research Projects or Publications"}
                    </p>
                    <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      {searchTerm
                        ? "Try adjusting search terms or resetting the filter."
                        : "The research section on the public website is currently under construction. You can create research entries using the button below."}
                    </p>
                    <button
                      type="button"
                      onClick={searchTerm ? () => setSearchTerm("") : handleOpenAdd}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00897b] transition-colors cursor-pointer"
                    >
                      {searchTerm ? "Clear Search" : "+ Add Research Entry"}
                    </button>
                  </td>
                </tr>
              ) : (
                filteredResearch.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-11 w-11 rounded-lg object-cover border border-slate-200/80 shrink-0 mt-0.5"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-outfit text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                            {item.leadInvestigator && (
                              <span className="font-semibold text-slate-700 flex items-center gap-1">
                                <User className="h-3 w-3 text-[#009688]" />
                                {item.leadInvestigator}
                              </span>
                            )}
                            {item.journal && (
                              <span className="text-slate-400 flex items-center gap-1">
                                • <BookOpen className="h-3 w-3 text-sky-600" />
                                {item.journal}
                              </span>
                            )}
                          </div>
                          {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.keywords.slice(0, 3).map((kw) => (
                                <span
                                  key={kw}
                                  className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                                >
                                  #{kw}
                                </span>
                              ))}
                              {item.keywords.length > 3 && (
                                <span className="text-[10px] text-slate-400">
                                  +{item.keywords.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs text-slate-700 font-semibold">
                        {item.type}
                      </p>
                      <p className="text-[11px] text-[#009688] font-medium">
                        {item.category}
                      </p>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4 text-slate-500 font-normal">
                      {item.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewItem(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {filteredResearch.length === 0 ? 0 : 1} to {filteredResearch.length} of {researchList.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed"
            >
              ‹
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded bg-[#009688] font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal with Complete Real Fields */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                {editingItem ? "Edit Research" : "Add Research Entry"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Research Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Genetic Variants"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Brief Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Brief study description..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Investigator
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.leadInvestigator}
                    onChange={(e) =>
                      setFormData({ ...formData, leadInvestigator: e.target.value })
                    }
                    placeholder="e.g. Dr. Amjad"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Genomics, Oncology"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Research Project">Research Project</option>
                    <option value="Publication">Publication</option>
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
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="e.g. Oct 2026"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Journal / Publication Venue
                  </label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) =>
                      setFormData({ ...formData, journal: e.target.value })
                    }
                    placeholder="e.g. Medical Journal"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    DOI Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) =>
                      setFormData({ ...formData, doi: e.target.value })
                    }
                    placeholder="e.g. 10.1038/sample-doi"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="e.g. WES, Genetics"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Abstract / Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Enter study abstract..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-hidden"
                />
              </div>

              <ImageUploader
                label="Research Picture / Cover Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                aspectRatio="aspect-16/9"
                helperText="Upload a featured cover image, graphical abstract, or research figure"
              />

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Add Research"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drawer with Complete Study Details */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                Research Details
              </h3>
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
                  alt={viewItem.title}
                  className="w-full h-44 rounded-xl object-cover border border-slate-200/80 shadow-2xs"
                />
              )}

              <div>
                <span className="text-slate-400 font-medium">Title</span>
                <p className="font-outfit text-base font-bold text-slate-800 mt-0.5">
                  {viewItem.title}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {viewItem.subtitle}
                </p>
              </div>

              {viewItem.summary && (
                <div>
                  <span className="text-slate-400 font-medium">Abstract / Summary</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {viewItem.summary}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Lead Investigator</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {viewItem.leadInvestigator || "Dr. Amjad Ali Tanoli Ph.D"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Category</span>
                  <p className="font-semibold text-teal-700 mt-0.5">
                    {viewItem.category}
                  </p>
                </div>
              </div>

              {viewItem.journal && (
                <div>
                  <span className="text-slate-400 font-medium">Journal / Venue</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {viewItem.journal}
                  </p>
                </div>
              )}

              {viewItem.doi && (
                <div>
                  <span className="text-slate-400 font-medium">DOI</span>
                  <p className="font-mono text-cyan-700 mt-0.5 flex items-center gap-1">
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
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Status</span>
                  <div className="mt-1">{getStatusBadge(viewItem.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Date</span>
                  <p className="text-slate-600 mt-0.5">{viewItem.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h4 className="font-outfit text-base font-bold text-slate-900">
              Confirm Delete
            </h4>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to remove this research entry?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 cursor-pointer"
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
