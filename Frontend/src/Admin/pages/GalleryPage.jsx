import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon,
  Search,
  ChevronDown,
  CheckSquare,
  Upload,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  RefreshCw,
  Plus,
  CheckCircle2,
  Images,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import {
  getGalleryItems,
  createGalleryItem,
  createMultipleGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  uploadGalleryImage,
} from "../api/gallery.js";

const DEFAULT_CATEGORIES = [
  "ClinGene Genomics Lab",
  "Scientific Symposiums",
  "Research Bench & Compute",
  "Diagnostic Facilities",
];

const DEFAULT_FORM_STATE = {
  title: "",
  category: "ClinGene Genomics Lab",
  image_url: "",
  image_alt: "",
  caption: "",
  event_date: new Date().toISOString().split("T")[0],
  status: "published",
};

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("All Categories");
  const [selectedIds, setSelectedIds] = useState([]);

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

  // Multi-image batch upload state
  const [uploadBatch, setUploadBatch] = useState([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const multiFileInputRef = useRef(null);

  // New Category / Album Quick Add
  const [addAlbumModalOpen, setAddAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load gallery items from Supabase
  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGalleryItems();
      setImages(data || []);
    } catch (err) {
      console.error("Failed to load gallery items from Supabase:", err);
      setError(err.message || "Failed to load gallery items from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Derive unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    images.forEach((img) => {
      if (img.category) set.add(img.category);
    });
    return Array.from(set);
  }, [images]);

  // Filter images by search term and category
  const filteredImages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return images.filter((img) => {
      const matchSearch =
        !q ||
        img.title.toLowerCase().includes(q) ||
        (img.caption && img.caption.toLowerCase().includes(q)) ||
        (img.category && img.category.toLowerCase().includes(q));

      const matchCategory =
        selectedAlbum === "All Categories" ||
        selectedAlbum === "All Albums" ||
        img.category === selectedAlbum;

      return matchSearch && matchCategory;
    });
  }, [images, searchTerm, selectedAlbum]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredImages.map((img) => img.id));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...DEFAULT_FORM_STATE });
    setUploadBatch([]);
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (img) => {
    setEditingItem(img);
    setUploadBatch([]);
    setFormData({
      title: img.title || "",
      category: img.category || "ClinGene Genomics Lab",
      image_url: img.image_url || img.src || "",
      image_alt: img.image_alt || img.title || "",
      caption: img.caption || "",
      event_date: img.event_date || "",
      status: img.status || "published",
    });
    setModalError("");
    setModalOpen(true);
  };

  // Helper to format filename into a human readable title
  const formatFileNameToTitle = (filename) => {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Handle selection of multiple image files
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      title: formatFileNameToTitle(file.name),
      isUploaded: false,
      uploadedUrl: null,
    }));

    setUploadBatch((prev) => [...prev, ...newItems]);
    if (!formData.title && newItems.length > 0) {
      setFormData((prev) => ({ ...prev, title: newItems[0].title }));
    }
    // reset input so same file can be selected again if needed
    e.target.value = "";
  };

  const removeBatchItem = (id) => {
    setUploadBatch((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBatchItemTitle = (id, newTitle) => {
    setUploadBatch((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleFormSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setModalError("");
    setUploadStatusText("Starting upload...");

    try {
      if (editingItem) {
        // Single Edit Mode
        if (!formData.title.trim()) {
          throw new Error("Please provide an image title.");
        }
        if (!formData.image_url.trim()) {
          throw new Error("Please upload an image or provide an image URL.");
        }
        setUploadStatusText("Saving changes...");
        await updateGalleryItem(editingItem.id, formData);
        showToast("Gallery image updated successfully.");
      } else {
        // Multi-image or Single-Image Add Mode
        if (uploadBatch.length > 0) {
          setIsUploadingFiles(true);
          const preparedItems = [];

          for (let i = 0; i < uploadBatch.length; i++) {
            const item = uploadBatch[i];
            setUploadStatusText(`Optimizing & uploading ${i + 1} of ${uploadBatch.length}...`);
            let photoUrl = item.uploadedUrl;

            if (!photoUrl && item.file) {
              photoUrl = await uploadGalleryImage(item.file);
            }

            if (!photoUrl) {
              throw new Error(`Failed to process photo #${i + 1} (${item.title || "image"}).`);
            }

            const itemTitle = (item.title || "").trim() || `${(formData.title || "ClinGene Photo").trim()} (${i + 1})`;

            // Format event_date safely
            const rawDate = (formData.event_date || "").trim();
            const dateValid = rawDate && !isNaN(Date.parse(rawDate)) ? rawDate : null;

            preparedItems.push({
              title: itemTitle,
              image_url: photoUrl,
              image_alt: itemTitle,
              caption: (formData.caption || "").trim() || null,
              category: formData.category || "ClinGene Genomics Lab",
              event_date: dateValid,
              status: formData.status || "published",
            });
          }

          setUploadStatusText(`Saving ${preparedItems.length} photos to database...`);
          if (preparedItems.length === 1) {
            await createGalleryItem(preparedItems[0]);
            showToast("1 image uploaded to gallery successfully.");
          } else {
            await createMultipleGalleryItems(preparedItems);
            showToast(`${preparedItems.length} images uploaded to gallery successfully.`);
          }
        } else {
          // Direct URL or single ImageUploader
          if (!formData.title.trim()) {
            throw new Error("Please provide an image title.");
          }
          if (!formData.image_url.trim()) {
            throw new Error("Please select at least one photo to upload.");
          }
          setUploadStatusText("Saving image to database...");
          await createGalleryItem(formData);
          showToast("Image uploaded to gallery successfully.");
        }
      }

      setModalOpen(false);
      setEditingItem(null);
      setUploadBatch([]);
      await loadGallery();
    } catch (err) {
      console.error("Failed to save gallery item:", err);
      const errMsg = err.message || "Failed to save gallery item. Please try again.";
      setModalError(errMsg);
    } finally {
      setSaving(false);
      setIsUploadingFiles(false);
      setUploadStatusText("");
    }
  };

  const handleAddAlbumSave = (e) => {
    e.preventDefault();
    const trimmed = newAlbumName.trim();
    if (!trimmed) return;
    setSelectedAlbum(trimmed);
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setAddAlbumModalOpen(false);
    setNewAlbumName("");
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await deleteGalleryItem(deleteId);
      setDeleteId(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
      showToast("Gallery image deleted successfully.");
      await loadGallery();
    } catch (err) {
      console.error("Failed to delete gallery item:", err);
      alert(err.message || "Failed to delete image.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected image(s)?`)) return;

    setDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteGalleryItem(id);
      }
      setSelectedIds([]);
      showToast(`${selectedIds.length} images deleted.`);
      await loadGallery();
    } catch (err) {
      console.error("Failed bulk delete:", err);
      alert(err.message || "Failed to delete selected images.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        icon={ImageIcon}
        title="Gallery"
        subtitle="Photos & Media Gallery"
        breadcrumb="Gallery"
        actionLabel="Upload Image"
        onAction={handleOpenAdd}
      />

      {/* Top Error Alert Banner with Retry Button */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={loadGallery}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images by title, category, or caption..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="relative w-full sm:w-64">
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
          >
            <option value="All Categories">All Categories ({images.length})</option>
            {categories.map((cat) => {
              const count = images.filter((i) => i.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Gallery Images Section (Directly below Filter, without the Album Cards folder) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        {/* Section Top Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-outfit text-base font-bold text-[#009688]">
              {selectedAlbum === "All Categories" ? "All Images" : selectedAlbum}
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
              {filteredImages.length} images
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              type="button"
              disabled={filteredImages.length === 0}
              onClick={handleSelectAll}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition-colors ${
                filteredImages.length === 0
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {selectedIds.length === filteredImages.length && filteredImages.length > 0
                  ? "Deselect all"
                  : "Select images"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#009688] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#008779] transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Images</span>
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <ImageIcon className="h-9 w-9 text-slate-300 mx-auto mb-2" />
            <p className="font-outfit text-sm font-bold text-slate-700">
              {searchTerm
                ? `No images match "${searchTerm}"`
                : "No Gallery Images Available"}
            </p>
            <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchTerm
                ? "Try clearing search keywords or selecting all categories."
                : "Upload photos to display them in this category and across the public website gallery."}
            </p>
            <button
              type="button"
              onClick={searchTerm ? () => setSearchTerm("") : handleOpenAdd}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00897b] transition-colors cursor-pointer"
            >
              {searchTerm ? "Clear Search" : "+ Upload First Image"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => {
              const isSelected = selectedIds.includes(img.id);
              return (
                <div
                  key={img.id}
                  className={`group relative overflow-hidden rounded-xl border bg-white shadow-xs transition-all ${
                    isSelected
                      ? "border-[#009688] ring-2 ring-[#009688]/30"
                      : "border-slate-200/80 hover:shadow-md"
                  }`}
                >
                  {/* Image + Checkbox */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={img.image_url || img.src}
                      alt={img.image_alt || img.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(img.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#009688] focus:ring-[#009688] cursor-pointer"
                      />
                    </div>
                    {img.status === "draft" && (
                      <span className="absolute top-2.5 right-2.5 rounded-md bg-amber-500/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Info Bar */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-outfit text-xs font-bold text-slate-800 truncate" title={img.title}>
                          {img.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {img.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(img)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                          title="Edit Image"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(img.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                          title="Delete Image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {img.caption && (
                      <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Image Modal with Multi-File Upload Support */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800 flex items-center gap-2">
                <Images className="h-5 w-5 text-[#009688]" />
                {editingItem
                  ? "Edit Gallery Image"
                  : uploadBatch.length > 1
                  ? `Upload ${uploadBatch.length} Images`
                  : "Upload Gallery Photos"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Error Alert */}
            {modalError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSave} className="mt-4 space-y-4">
              {/* Target Folder / Event Selection (Choice of one folder at a time) */}
              <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Target Folder / Event <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAddAlbumModalOpen(true)}
                    className="text-[11px] font-semibold text-[#009688] hover:underline cursor-pointer"
                  >
                    + New Folder / Event
                  </button>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-teal-700/80">
                  All photos in this upload will be grouped into this event folder.
                </p>
              </div>

              {/* If Editing single item */}
              {editingItem ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Image Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      label="Replace Photo"
                      value={formData.image_url}
                      onChange={(val) => setFormData({ ...formData, image_url: val })}
                      onUpload={uploadGalleryImage}
                      aspectRatio="aspect-16/10"
                      helperText="Upload a photo (PNG, JPG, or WebP up to 10MB)"
                    />
                  </div>
                </>
              ) : (
                /* Multi-Image Upload Section for new items */
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Select Photos <span className="text-slate-400 font-normal">(select 1 or multiple)</span>
                    </label>
                    {uploadBatch.length > 0 && (
                      <span className="text-xs font-bold text-[#009688]">
                        {uploadBatch.length} photo{uploadBatch.length !== 1 ? "s" : ""} selected
                      </span>
                    )}
                  </div>

                  {/* Hidden multi-file input */}
                  <input
                    ref={multiFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesSelected}
                    className="hidden"
                  />

                  {/* Drag / Click Upload Area */}
                  <div
                    onClick={() => multiFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-[#009688] bg-slate-50 hover:bg-slate-50/70 rounded-xl cursor-pointer transition-colors"
                  >
                    <Upload className="h-8 w-8 text-[#009688] mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      Click to browse or drop photos here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      You can select multiple PNG, JPG, or WebP images
                    </p>
                  </div>

                  {/* Selected Photos Preview & Per-Photo Titles */}
                  {uploadBatch.length > 0 && (
                    <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {uploadBatch.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 text-xs"
                        >
                          <img
                            src={item.url}
                            alt=""
                            className="h-12 w-14 rounded-md object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                              Photo #{idx + 1} Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateBatchItemTitle(item.id, e.target.value)}
                              placeholder="Image title..."
                              className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBatchItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md shrink-0 cursor-pointer"
                            title="Remove this photo"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Shared Metadata: Date, Caption, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date (text)
                  </label>
                  <input
                    type="text"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    placeholder="e.g. 2026-01-01 or Jan 2026"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  placeholder="Optional brief description of the photo(s)..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none resize-none"
                />
              </div>

              {/* Live Upload Progress Indicator */}
              {(saving || isUploadingFiles) && (
                <div className="flex items-center gap-2.5 rounded-lg bg-teal-50 border border-teal-200 p-3 text-xs text-teal-800 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-[#009688] shrink-0" />
                  <span className="font-medium">{uploadStatusText || "Uploading and saving images..."}</span>
                </div>
              )}

              {/* Prominent Modal Error Alert */}
              {modalError && (
                <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-rose-800">Upload Issue</p>
                    <p className="mt-0.5 leading-relaxed">{modalError}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving || isUploadingFiles}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploadingFiles}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#008779] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {(saving || isUploadingFiles) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>
                    {saving || isUploadingFiles
                      ? uploadStatusText || "Uploading..."
                      : editingItem
                      ? "Save Changes"
                      : uploadBatch.length > 1
                      ? `Upload ${uploadBatch.length} Images`
                      : "Upload Image"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Category Modal */}
      {addAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-base font-bold text-slate-800">
                Create New Category
              </h3>
              <button
                type="button"
                onClick={() => setAddAlbumModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAlbumSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g. Clinical Conferences"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddAlbumModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#008779] cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h4 className="font-outfit text-base font-bold text-slate-900">
              Confirm Delete
            </h4>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to remove this image from the gallery? This will also remove it from the public website gallery.
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
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
