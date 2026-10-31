import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Layers,
  Stethoscope,
  LayoutGrid,
  Heart,
  PauseCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  FileText,
  FileDown,
  TestTubes,
  Info,
  X,
  Edit2,
  Trash2,
  RefreshCw,
  Home,
} from "lucide-react";
import FileUploader from "../components/FileUploader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ServicesToolbar from "./services/ServicesToolbar.jsx";
import ServicesList from "./services/ServicesList.jsx";
import ServicesGrid from "./services/ServicesGrid.jsx";
import { useViewMode } from "../hooks/useViewMode.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  uploadServiceImage,
} from "../api/services.js";

const CATEGORIES = [
  "Clinical Diagnostics",
  "Genomic Sequencing",
  "Bioinformatics",
  "Computational Biology",
  "Laboratory Services",
];

const DEFAULT_FORM_STATE = {
  name: "",
  subtitle: "",
  slug: "",
  type: "lab",
  category: "Clinical Diagnostics",
  pricing: "On request",
  status: "Active",
  icon: "dna",
  tagline: "",
  description: "",
  image: "",
  imageAlt: "",
  sampleType: "",
  turnaroundTime: "",
  reportFormat: "",
  requisitionPdf: null,
  overviewText: "",
  featuresText: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode("admin-services-view", "list");

  // Reset pagination when searching or changing category filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quickFacts");
  const [viewDrawerService, setViewDrawerService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [initialData, setInitialData] = useState(DEFAULT_FORM_STATE);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Unsaved changes confirm dialog
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  // Form errors
  const [errors, setErrors] = useState({});

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load services from Supabase services table
  const loadServicesList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data || []);
    } catch (err) {
      console.error("Failed to load services from Supabase:", err);
      setError(err.message || "Failed to load services from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServicesList();
  }, [loadServicesList]);

  // Compute category counts for pills
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((c) => {
      counts[c] = 0;
    });
    services.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [services]);

  // Dynamic KPI Stats Cards (Matching exact screenshot values & statuses)
  const statsCards = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.status === "Active" || !s.status).length;
    const inactive = services.filter((s) => s.status === "Inactive").length;
    const categoriesCount = Object.keys(categoryCounts).filter(
      (k) => categoryCounts[k] > 0
    ).length;

    return [
      {
        count: total,
        title: "Total Services",
        icon: Stethoscope,
        color: "text-[#00bcd4] bg-[#e0f7fa]",
      },
      {
        count: categoriesCount || 1,
        title: "Categories",
        icon: LayoutGrid,
        color: "text-[#00bcd4] bg-[#e0f7fa]",
      },
      {
        count: active,
        title: "Active Services",
        icon: CheckCircle2,
        color: "text-[#2e7d32] bg-[#e8f5e9]",
      },
      {
        count: inactive,
        title: "Inactive Services",
        icon: PauseCircle,
        color: "text-[#0284c7] bg-[#e0f2fe]",
      },
    ];
  }, [services, categoryCounts]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q));
      const matchCat =
        selectedCategory === "All Categories" || s.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [services, searchTerm, selectedCategory]);

  // Check if form has unsaved modifications
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // Open Add Service
  const handleOpenAdd = () => {
    setEditingService(null);
    const initial = { ...DEFAULT_FORM_STATE };
    setFormData(initial);
    setInitialData(initial);
    setErrors({});
    setModalError("");
    setActiveTab("quickFacts");
    setModalOpen(true);
  };

  // Open Edit Service
  const handleOpenEdit = (service) => {
    setEditingService(service);
    const initial = {
      name: service.name || "",
      subtitle: service.subtitle || "",
      slug: service.slug || "",
      type: service.type || "lab",
      category: service.category || "Clinical Diagnostics",
      pricing: service.pricing || "On request",
      status: service.status || "Active",
      icon: service.icon || "dna",
      tagline: service.tagline || "",
      description: service.description || "",
      image: service.image || "",
      imageAlt: service.imageAlt || "",
      sampleType: service.sampleType || "",
      turnaroundTime: service.turnaroundTime || "",
      reportFormat: service.reportFormat || "",
      requisitionPdf: service.requisitionPdf || null,
      overviewText: Array.isArray(service.overview)
        ? service.overview.join("\n\n")
        : service.overview || "",
      featuresText: Array.isArray(service.features)
        ? service.features.join("\n")
        : service.features || "",
      sort_order: service.sort_order ?? 1,
    };
    setFormData(initial);
    setInitialData(initial);
    setErrors({});
    setModalError("");
    setActiveTab("quickFacts");
    setModalOpen(true);
  };

  // Close modal with unsaved changes check
  const handleRequestCloseModal = () => {
    if (isDirty) {
      setConfirmDiscardOpen(true);
    } else {
      setModalOpen(false);
    }
  };

  const handleConfirmDiscard = () => {
    setConfirmDiscardOpen(false);
    setModalOpen(false);
  };

  // Auto-generate slug from name if new service
  const handleNameChange = (val) => {
    const updates = { name: val };
    if (!editingService && (!formData.slug || formData.slug === slugify(formData.name))) {
      updates.slug = slugify(val);
    }
    setFormData((prev) => ({ ...prev, ...updates }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Service name is required";
    } else if (formData.name.length > 100) {
      errs.name = "Service name cannot exceed 100 characters";
    }

    if (!formData.slug.trim()) {
      errs.slug = "Slug is required";
    }

    if (formData.sampleType && formData.sampleType.length > 120) {
      errs.sampleType = "Sample type cannot exceed 120 characters";
    }
    if (formData.turnaroundTime && formData.turnaroundTime.length > 60) {
      errs.turnaroundTime = "Turnaround time cannot exceed 60 characters";
    }
    if (formData.reportFormat && formData.reportFormat.length > 120) {
      errs.reportFormat = "Report format cannot exceed 120 characters";
    }

    if (formData.image && (!formData.imageAlt || !formData.imageAlt.trim())) {
      errs.imageAlt = "Alt text is required for accessibility and SEO when an image is set";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Service
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (errors.imageAlt) {
        setActiveTab("image");
      } else if (errors.sampleType || errors.turnaroundTime || errors.reportFormat) {
        setActiveTab("quickFacts");
      } else if (errors.name || errors.slug) {
        setActiveTab("basic");
      }
      return;
    }

    setSaving(true);
    setModalError("");

    const payload = {
      ...formData,
      overview: formData.overviewText
        ? formData.overviewText.split("\n\n").filter(Boolean)
        : [],
      features: formData.featuresText
        ? formData.featuresText.split("\n").filter(Boolean)
        : [],
    };

    try {
      if (editingService) {
        const updated = await updateService(editingService.id, payload);
        showToast(`Service "${updated.name}" updated successfully!`);
      } else {
        const created = await createService(payload);
        showToast(`Service "${created.name}" created successfully!`);
      }
      setModalOpen(false);
      await loadServicesList();
    } catch (err) {
      console.error("Failed to save service:", err);
      setModalError(err.message || "Failed to save service in Supabase.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Service
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await deleteService(deleteId);
      showToast("Service removed successfully.");
      setDeleteId(null);
      await loadServicesList();
    } catch (err) {
      console.error("Failed to delete service:", err);
      alert(`Failed to delete service: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Live mini preview quick facts helper
  const previewFacts = [
    formData.sampleType && {
      label: "Sample Type",
      value: formData.sampleType,
      icon: TestTubes,
    },
    formData.turnaroundTime && {
      label: "Turnaround Time",
      value: formData.turnaroundTime,
      icon: Clock,
    },
    formData.reportFormat && {
      label: "Report Format",
      value: formData.reportFormat,
      icon: FileText,
    },
  ].filter(Boolean);

  const hasRequisitionPdf = Boolean(
    formData.requisitionPdf &&
      (typeof formData.requisitionPdf === "string"
        ? formData.requisitionPdf.length > 0
        : formData.requisitionPdf.url || formData.requisitionPdf.name)
  );

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-60 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header (Matches screenshot) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00bcd4] text-white shadow-xs">
            <Layers className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-outfit text-2xl font-bold text-[#0c2b48]">Services</h1>
            <p className="font-inter text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage medical and research services
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          {/* Top right breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Home</span>
            <span>›</span>
            <span className="text-slate-600 font-medium">Services</span>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00bcd4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00acc1] active:scale-95 transition-all cursor-pointer"
          >
            <span>+ Add Service</span>
          </button>
        </div>
      </div>

      {/* Top Error Alert if Supabase fetch failed */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1 text-sm font-medium">{error}</div>
          <button
            type="button"
            onClick={loadServicesList}
            className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* 4 Stat Cards in a Row (Exact match to screenshot) */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <StatIcon className="h-6 w-6 stroke-[1.9]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0c2b48] leading-none">
                  {stat.count}
                </h4>
                <p className="font-inter text-xs font-semibold text-slate-400 mt-1.5">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar: Search input, Category Dropdown, Filter button, ViewToggle */}
      <ServicesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main View Container with smooth fade transition */}
      <div className="transition-opacity duration-200 motion-reduce:transition-none">
        {loading ? (
          viewMode === "grid" ? (
            <ServicesGrid services={[]} loading={true} />
          ) : (
            <ServicesList services={[]} loading={true} />
          )
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={searchTerm ? `No services match "${searchTerm}"` : "No services found"}
            description={
              searchTerm || selectedCategory !== "All Categories"
                ? "No services match your search or category filter criteria."
                : "No services are currently configured."
            }
            actionText="Clear Filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedCategory("All Categories");
            }}
          />
        ) : viewMode === "grid" ? (
          <ServicesGrid
            services={filteredServices}
            onEdit={handleOpenEdit}
            onView={(s) => setViewDrawerService(s)}
            onDelete={(id) => setDeleteId(id)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            loading={false}
          />
        ) : (
          <ServicesList
            services={filteredServices}
            onEdit={handleOpenEdit}
            onView={(s) => setViewDrawerService(s)}
            onDelete={(id) => setDeleteId(id)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            loading={false}
          />
        )}
      </div>

      {/* ================= ADD / EDIT SERVICE MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#009688]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-800">
                    {editingService ? "Edit Service" : "Add Service"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingService ? `Editing "${editingService.name}"` : "Create a new clinical or computational service"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {formData.slug && (
                  <a
                    href={`/services/${formData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors"
                    title="Preview Public Service Page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Preview page</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleRequestCloseModal}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/70 px-6 py-2 shrink-0 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab("quickFacts")}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "quickFacts"
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <span>Quick facts</span>
                {(formData.sampleType || formData.turnaroundTime || formData.reportFormat || hasRequisitionPdf) && (
                  <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-teal-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "basic"
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <span>Basic Info</span>
                {errors.name && (
                  <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("image")}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "image"
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <span>Image &amp; Alt</span>
                {errors.imageAlt && (
                  <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "content"
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <span>Overview &amp; Scope</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Modal Error Alert if Supabase save failed */}
              {modalError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{modalError}</span>
                </div>
              )}
              
              {/* TAB 1: QUICK FACTS */}
              {activeTab === "quickFacts" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Sample Type
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formData.sampleType?.length || 0}/120
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={120}
                      value={formData.sampleType}
                      onChange={(e) =>
                        setFormData({ ...formData, sampleType: e.target.value })
                      }
                      placeholder="e.g. Blood, DNA"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#009688] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Shown in the quick facts bar under the hero. Leave empty to hide.
                    </p>
                    {errors.sampleType && (
                      <p className="mt-1 text-[11px] text-rose-500">{errors.sampleType}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Turnaround Time
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formData.turnaroundTime?.length || 0}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={formData.turnaroundTime}
                      onChange={(e) =>
                        setFormData({ ...formData, turnaroundTime: e.target.value })
                      }
                      placeholder="e.g. 10–14 days"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#009688] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Shown in the quick facts bar under the hero. Leave empty to hide.
                    </p>
                    {errors.turnaroundTime && (
                      <p className="mt-1 text-[11px] text-rose-500">{errors.turnaroundTime}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Report Format
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formData.reportFormat?.length || 0}/120
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={120}
                      value={formData.reportFormat}
                      onChange={(e) =>
                        setFormData({ ...formData, reportFormat: e.target.value })
                      }
                      placeholder="e.g. Clinical report"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#009688] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Shown in the quick facts bar under the hero. Leave empty to hide.
                    </p>
                    {errors.reportFormat && (
                      <p className="mt-1 text-[11px] text-rose-500">{errors.reportFormat}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <FileUploader
                      label="Requisition form"
                      value={formData.requisitionPdf}
                      onChange={(fileData) =>
                        setFormData({ ...formData, requisitionPdf: fileData })
                      }
                      accept=".pdf,application/pdf"
                      maxSizeMB={5}
                      helperText="Shows a Download requisition form button on the service page."
                    />
                  </div>

                  {/* Live Mini Preview of Quick Facts Bar */}
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/90 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                        Live Quick Facts Bar Preview
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-400">
                        Matches public service page
                      </span>
                    </div>

                    {previewFacts.length === 0 && !hasRequisitionPdf ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center text-xs text-slate-400">
                        No quick facts entered. Enter sample type, turnaround time, report format, or upload a requisition form above to see the live preview.
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          {previewFacts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 flex-1">
                              {previewFacts.map((fact, idx) => {
                                const FactIcon = fact.icon;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2.5"
                                  >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600 mt-0.5">
                                      <FactIcon className="h-3.5 w-3.5 stroke-2" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                        {fact.label}
                                      </span>
                                      <span className="block text-[11px] font-semibold text-slate-800 leading-snug line-clamp-2">
                                        {fact.value}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {hasRequisitionPdf && (
                            <div className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shrink-0 self-start md:self-center">
                              <FileDown className="h-3.5 w-3.5 text-teal-600" />
                              <span>Download requisition form</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Panel Sequencing"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>
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
                        placeholder="e.g. panel-sequencing"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none font-mono"
                      />
                      {errors.slug && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.slug}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subtitle / Focus
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      placeholder="e.g. Disease panels"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                    />
                  </div>

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
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                      >
                        <option value="lab">Genetic Analysis (Lab)</option>
                        <option value="computational">Computational (In Silico)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pricing Display
                      </label>
                      <input
                        type="text"
                        value={formData.pricing}
                        onChange={(e) =>
                          setFormData({ ...formData, pricing: e.target.value })
                        }
                        placeholder="e.g. Rs. 45,000"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Short service description..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                      >
                        <option value="Active">Active (Published)</option>
                        <option value="Inactive">Inactive (Unavailable)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                      >
                        <option value="dna">DNA Helix</option>
                        <option value="activity">Pulse Activity</option>
                        <option value="stethoscope">Stethoscope</option>
                        <option value="microscope">Microscope</option>
                        <option value="shield">Shield</option>
                        <option value="layers">Layers</option>
                        <option value="pill">Pill</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IMAGE & ALT TEXT */}
              {activeTab === "image" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-800">
                    <Info className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Recommended Image Format &amp; Size</p>
                      <p className="mt-0.5 text-[11px] text-teal-700 leading-relaxed">
                        For optimal load performance, upload an image about <strong>800 px wide</strong>, in <strong>WebP</strong> format, with file size <strong>under 100 KB</strong>.
                      </p>
                    </div>
                  </div>

                  <ImageUploader
                    label="Service Cover Image"
                    value={formData.image}
                    onChange={(val) => setFormData({ ...formData, image: val })}
                    onUpload={uploadServiceImage}
                    aspectRatio="aspect-16/9"
                    helperText="Click or drop a PNG, JPG, or WebP cover image for this medical service"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alt Text {formData.image && <span className="text-rose-500">*</span>}
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
                      placeholder="e.g. Laboratory service"
                      className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 focus:outline-none ${
                        errors.imageAlt
                          ? "border-rose-400 focus:border-rose-500 bg-rose-50/30"
                          : "border-slate-200 focus:border-[#009688]"
                      }`}
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Required for accessibility and SEO when an image is uploaded. Describes the image for screen readers.
                    </p>
                    {errors.imageAlt && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.imageAlt}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTENT & SCOPE */}
              {activeTab === "content" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Overview Paragraphs
                    </label>
                    <textarea
                      rows={4}
                      value={formData.overviewText}
                      onChange={(e) =>
                        setFormData({ ...formData, overviewText: e.target.value })
                      }
                      placeholder="Enter overview content..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Separate each paragraph with an empty line. Shown in the About section.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Features &amp; Benefits (Tick points)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.featuresText}
                      onChange={(e) =>
                        setFormData({ ...formData, featuresText: e.target.value })
                      }
                      placeholder="One per line..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {isDirty && (
                    <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Unsaved changes
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRequestCloseModal}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>

                  {formData.slug && (
                    <a
                      href={`/services/${formData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex sm:hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Preview</span>
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : editingService ? "Save Changes" : "Add Service"}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW DRAWER ================= */}
      {viewDrawerService && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#009688]">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-outfit text-base font-bold text-slate-800">
                    Service Overview
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewDrawerService(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                {viewDrawerService.image && (
                  <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                    <img
                      src={viewDrawerService.image}
                      alt={viewDrawerService.imageAlt || viewDrawerService.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1579165466791-788226ab77b6?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                )}

                <div>
                  <span className="text-slate-400 font-medium">Service Name</span>
                  <p className="font-outfit text-base font-bold text-slate-800 mt-0.5">
                    {viewDrawerService.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    /services/{viewDrawerService.slug}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium">Category</span>
                    <p className="font-semibold text-teal-700 mt-0.5">
                      {viewDrawerService.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Status</span>
                    <div className="mt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          viewDrawerService.status === "Active" || !viewDrawerService.status
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            viewDrawerService.status === "Active" || !viewDrawerService.status
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        <span>{viewDrawerService.status || "Active"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Facts Section in Drawer */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium block mb-2">
                    Quick Facts (Public Bar)
                  </span>
                  <div className="space-y-2">
                    {viewDrawerService.sampleType && (
                      <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                        <TestTubes className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Sample Type
                          </span>
                          <span className="text-slate-700 font-medium text-[11.5px]">
                            {viewDrawerService.sampleType}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewDrawerService.turnaroundTime && (
                      <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                        <Clock className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Turnaround Time
                          </span>
                          <span className="text-slate-700 font-medium text-[11.5px]">
                            {viewDrawerService.turnaroundTime}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewDrawerService.reportFormat && (
                      <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                        <FileText className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Report Format
                          </span>
                          <span className="text-slate-700 font-medium text-[11.5px]">
                            {viewDrawerService.reportFormat}
                          </span>
                        </div>
                      </div>
                    )}

                    {viewDrawerService.requisitionPdf && (
                      <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-2.5 border border-teal-200/80">
                        <FileDown className="h-4 w-4 text-[#009688] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase text-teal-700 block">
                            Requisition PDF Available
                          </span>
                          <span className="text-teal-900 font-medium text-[11px] truncate block">
                            {typeof viewDrawerService.requisitionPdf === "string"
                              ? viewDrawerService.requisitionPdf.split("/").pop()
                              : viewDrawerService.requisitionPdf.name || "Requisition-Form.pdf"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {viewDrawerService.description && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">Description</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {viewDrawerService.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`/services/${viewDrawerService.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Public Page</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const s = viewDrawerService;
                  setViewDrawerService(null);
                  handleOpenEdit(s);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#009688] px-4 py-2 text-xs font-bold text-white hover:bg-[#00897b] transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UNSAVED CHANGES CONFIRM DIALOG ================= */}
      <ConfirmDialog
        isOpen={confirmDiscardOpen}
        onClose={() => setConfirmDiscardOpen(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        message="You have unsaved changes in this service form. Are you sure you want to discard them? Any adjustments to quick facts, image, or basic info will be lost."
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="danger"
      />

      {/* ================= DELETE CONFIRM DIALOG ================= */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Confirm Service Deletion"
        message="Are you sure you want to remove this service from the system? This action will remove it from the admin list and cannot be undone."
        confirmText="Delete Service"
        cancelText="Cancel"
        loading={isDeleting}
        variant="danger"
      />

    </div>
  );
}
