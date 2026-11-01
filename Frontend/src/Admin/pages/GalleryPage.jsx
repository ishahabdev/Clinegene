import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Folder,
  FolderOpen,
  ArrowLeft,
  ChevronRight,
  Image as ImageIcon,
  Search,
  ChevronDown,
  CheckSquare,
  Upload,
  Eye,
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

const DEFAULT_FORM_STATE = {
  title: "",
  category: "General",
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
  const [activeFolder, setActiveFolder] = useState(null);
  const [createdFolders, setCreatedFolders] = useState([]);
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

  // View modal state
  const [viewingImage, setViewingImage] = useState(null);

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

  // Derive folders dynamically from database images + manually created folders
  const folders = useMemo(() => {
    const map = new Map();

    // Include manually created empty folders
    createdFolders.forEach((name) => {
      const clean = name.trim();
      if (clean && !map.has(clean)) {
        map.set(clean, {
          name: clean,
          images: [],
          count: 0,
          cover: null,
        });
      }
    });

    // Populate from images
    images.forEach((img) => {
      const cat = (img.category || "General").trim();
      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          images: [],
          count: 0,
          cover: null,
        });
      }
      const folder = map.get(cat);
      folder.images.push(img);
      folder.count += 1;
      if (!folder.cover && (img.image_url || img.src)) {
        folder.cover = img.image_url || img.src;
      }
    });

    return Array.from(map.values());
  }, [images, createdFolders]);

  // Filter folders by search term when on the folders screen
  const filteredFolders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter((f) => f.name.toLowerCase().includes(q));
  }, [folders, searchTerm]);

  // Images in the currently opened folder
  const folderImages = useMemo(() => {
    if (!activeFolder) return [];
    const q = searchTerm.trim().toLowerCase();
    return images.filter((img) => {
      const cat = (img.category || "General").trim();
      const matchFolder = cat.toLowerCase() === activeFolder.toLowerCase();
      if (!matchFolder) return false;
      if (!q) return true;
      return (
        (img.title && img.title.toLowerCase().includes(q)) ||
        (img.caption && img.caption.toLowerCase().includes(q))
      );
    });
  }, [images, activeFolder, searchTerm]);

  // Derive unique categories dynamically for upload selectors
  const categories = useMemo(() => {
    const set = new Set(["General"]);
    createdFolders.forEach((f) => set.add(f.trim()));
    images.forEach((img) => {
      if (img.category) set.add(img.category.trim());
    });
    return Array.from(set);
  }, [images, createdFolders]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === folderImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(folderImages.map((img) => img.id));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      ...DEFAULT_FORM_STATE,
      category: activeFolder || categories[0] || "General",
    });
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
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newAlbumName.trim();
    if (!trimmed) return;
    if (!createdFolders.includes(trimmed)) {
      setCreatedFolders((prev) => [...prev, trimmed]);
    }
    setActiveFolder(trimmed);
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setAddAlbumModalOpen(false);
    setNewAlbumName("");
    showToast(`Folder "${trimmed}" created.`);
  };

  const handleDeleteFolder = async (folderName) => {
    const folderItems = images.filter(
      (img) => (img.category || "General").trim().toLowerCase() === folderName.trim().toLowerCase()
    );
    const confirmMsg =
      folderItems.length > 0
        ? `Delete folder "${folderName}" and all ${folderItems.length} photo(s) inside it? This cannot be undone.`
        : `Delete empty folder "${folderName}"?`;
    if (!window.confirm(confirmMsg)) return;

    setDeleting(true);
    try {
      for (const item of folderItems) {
        await deleteGalleryItem(item.id);
      }
      setCreatedFolders((prev) => prev.filter((f) => f.toLowerCase() !== folderName.toLowerCase()));
      if (activeFolder && activeFolder.toLowerCase() === folderName.toLowerCase()) {
        setActiveFolder(null);
      }
      showToast(`Folder "${folderName}" deleted.`);
      await loadGallery();
    } catch (err) {
      console.error("Failed to delete folder:", err);
      alert(err.message || "Failed to delete folder.");
    } finally {
      setDeleting(false);
    }
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
        subtitle={
          activeFolder
            ? `Viewing photos inside "${activeFolder}" folder`
            : "Photo Albums & Folders"
        }
        breadcrumb={activeFolder ? `Gallery > ${activeFolder}` : "Gallery"}
        actionLabel={activeFolder ? "+ Upload to Folder" : "+ New Folder"}
        onAction={
          activeFolder
            ? handleOpenAdd
            : () => setAddAlbumModalOpen(true)
        }
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
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-3 shadow-xs">
        {activeFolder ? (
          <button
            type="button"
            onClick={() => {
              setActiveFolder(null);
              setSelectedIds([]);
              setSearchTerm("");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] hover:bg-slate-100 dark:hover:bg-[#1b283d] px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-[#0da5aa]" />
            <span>Back to Folders</span>
          </button>
        ) : null}

        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeFolder
                ? `Search photos in "${activeFolder}"...`
                : "Search folders by name..."
            }
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {!activeFolder && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAddAlbumModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] hover:bg-slate-50 dark:hover:bg-[#1b283d] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#0da5aa]" />
              <span>New Folder</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0da5aa] hover:bg-[#088395] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] transition-all cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Images</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Container: Folders View OR Inside-Folder Photos View */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-5 shadow-xs">
        {/* VIEW 1: FOLDERS / ALBUMS LIST */}
        {!activeFolder ? (
          <div>
            {/* Section Header */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-[#0da5aa]" />
                <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
                  Photo Folders
                </h3>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {filteredFolders.length} folder{filteredFolders.length !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                Click any folder to view and manage its photos
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredFolders.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-slate-200 dark:border-[#1b283d] rounded-2xl bg-slate-50/50 dark:bg-[#080d17]/60">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-cyan-500/10 text-[#009688] dark:text-[#0da5aa] shadow-[0_0_20px_rgba(13,165,170,0.25)]">
                  <Folder className="h-7 w-7" />
                </div>
                <p className="font-outfit text-sm font-bold text-slate-700 dark:text-white">
                  {searchTerm ? `No folders match "${searchTerm}"` : "No Photo Folders Yet"}
                </p>
                <p className="font-inter text-xs text-slate-400 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {searchTerm
                    ? "Try checking your spelling or clear the search filter."
                    : "Create a folder or upload photos to start organizing your gallery."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAddAlbumModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#1b283d] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#0da5aa]" />
                    <span>Create Folder</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0da5aa] hover:bg-[#088395] text-white text-xs font-semibold shadow-[0_0_15px_rgba(13,165,170,0.35)] transition-all cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Images</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.name}
                    onClick={() => {
                      setActiveFolder(folder.name);
                      setSelectedIds([]);
                      setSearchTerm("");
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-[#1b283d] hover:border-[#0da5aa] dark:hover:border-[#0da5aa] bg-white dark:bg-[#080d17] hover:bg-slate-50/50 dark:hover:bg-[#0e1624]/90 shadow-xs hover:shadow-[0_0_20px_rgba(13,165,170,0.2)] transition-all duration-200 cursor-pointer flex flex-col"
                  >
                    {/* Folder Cover */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      {folder.cover ? (
                        <>
                          <img
                            src={folder.cover}
                            alt={folder.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                          <Folder className="h-12 w-12 text-[#0da5aa]/40 mb-1" />
                          <span className="text-xs font-medium">Empty Folder</span>
                        </div>
                      )}

                      {/* Folder Photo Count Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/65 dark:bg-[#0e1624]/90 backdrop-blur-md px-2.5 py-1 text-white text-[11px] font-bold border border-white/10 dark:border-[#1b283d]">
                        <Folder className="h-3.5 w-3.5 text-[#0da5aa]" />
                        <span>
                          {folder.count} photo{folder.count !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Quick Delete Folder Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.name);
                        }}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/85 hover:bg-rose-600 text-white shadow-md cursor-pointer"
                        title={`Delete folder "${folder.name}"`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Folder Info Footer */}
                    <div className="p-3.5 flex items-center justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-[#0da5aa] shrink-0" />
                          <h4 className="font-outfit text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0da5aa] truncate transition-colors capitalize">
                            {folder.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate pl-6">
                          {folder.count} {folder.count === 1 ? "photo" : "photos"} stored
                        </p>
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#0e1624] text-slate-500 dark:text-slate-400 group-hover:bg-[#0da5aa] group-hover:text-white transition-all shrink-0">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: PHOTOS INSIDE ACTIVE FOLDER */
          <div>
            {/* Folder Header & Actions */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="h-5 w-5 text-[#0da5aa]" />
                <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white capitalize">
                  {activeFolder}
                </h3>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {folderImages.length} image{folderImages.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Selected ({selectedIds.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={folderImages.length === 0}
                  onClick={handleSelectAll}
                  className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#1b283d] px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    folderImages.length === 0
                      ? "bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : "bg-white dark:bg-[#080d17] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {selectedIds.length === folderImages.length && folderImages.length > 0
                      ? "Deselect all"
                      : "Select images"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0da5aa] hover:bg-[#088395] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Images</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : folderImages.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-slate-200 dark:border-[#1b283d] rounded-2xl bg-slate-50/50 dark:bg-[#080d17]/60">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-cyan-500/10 text-[#009688] dark:text-[#0da5aa] shadow-[0_0_20px_rgba(13,165,170,0.25)]">
                  <ImageIcon className="h-7 w-7" />
                </div>
                <p className="font-outfit text-sm font-bold text-slate-700 dark:text-white">
                  {searchTerm
                    ? `No images match "${searchTerm}" in "${activeFolder}"`
                    : `No Photos in "${activeFolder}" Folder`}
                </p>
                <p className="font-inter text-xs text-slate-400 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {searchTerm
                    ? "Try clearing your search query."
                    : "Upload photos to store them inside this folder."}
                </p>
                <button
                  type="button"
                  onClick={searchTerm ? () => setSearchTerm("") : handleOpenAdd}
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0da5aa] hover:bg-[#088395] text-white text-xs font-semibold shadow-[0_0_15px_rgba(13,165,170,0.35)] transition-all cursor-pointer"
                >
                  {searchTerm ? "Clear Search" : "+ Upload First Photo"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folderImages.map((img) => {
                  const isSelected = selectedIds.includes(img.id);
                  return (
                    <div
                      key={img.id}
                      className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-[#080d17] shadow-xs transition-all ${
                        isSelected
                          ? "border-[#0da5aa] ring-2 ring-[#0da5aa]/40"
                          : "border-slate-200/80 dark:border-[#1b283d] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Image + Checkbox */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
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
                            className="h-4 w-4 rounded border-slate-300 text-[#0da5aa] focus:ring-[#0da5aa] cursor-pointer"
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
                            <p
                              className="font-outfit text-xs font-bold text-slate-800 dark:text-white truncate"
                              title={img.title}
                            >
                              {img.title}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5 capitalize">
                              {img.category}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setViewingImage(img)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0e1624] text-slate-600 dark:text-slate-400 border border-transparent dark:border-[#1b283d] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="View Image"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(img)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e0f2fe] dark:bg-cyan-500/15 text-[#0284c7] dark:text-cyan-400 border border-transparent dark:border-cyan-500/30 hover:bg-[#bae6fd] dark:hover:bg-cyan-500/25 transition-colors cursor-pointer"
                              title="Edit Image"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(img.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe4e6] dark:bg-rose-500/15 text-[#e11d48] dark:text-rose-400 border border-transparent dark:border-rose-500/30 hover:bg-[#fecdd3] dark:hover:bg-rose-500/25 transition-colors cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {img.caption && (
                          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
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
        )}
      </div>

      {/* Add / Edit Image Modal with Multi-File Upload Support */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b283d]">
              <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Images className="h-5 w-5 text-[#009688] dark:text-[#0da5aa]" />
                {editingItem
                  ? "Edit Gallery Image"
                  : uploadBatch.length > 1
                  ? `Upload ${uploadBatch.length} Images`
                  : "Upload Gallery Photos"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Error Alert */}
            {modalError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSave} className="mt-4 space-y-4">
              {/* Target Folder / Event Selection (Choice of one folder at a time) */}
              <div className="rounded-xl border border-teal-100 dark:border-cyan-500/20 bg-teal-50/50 dark:bg-cyan-500/10 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white">
                    Target Folder / Event <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAddAlbumModalOpen(true)}
                    className="text-[11px] font-semibold text-[#009688] dark:text-[#0da5aa] hover:underline cursor-pointer"
                  >
                    + New Folder / Event
                  </button>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-teal-700/80 dark:text-cyan-300/80">
                  All photos in this upload will be grouped into this event folder.
                </p>
              </div>

              {/* If Editing single item */}
              {editingItem ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Image Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none"
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Photos <span className="text-slate-400 font-normal">(select 1 or multiple)</span>
                    </label>
                    {uploadBatch.length > 0 && (
                      <span className="text-xs font-bold text-[#009688] dark:text-[#0da5aa]">
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
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-[#1b283d] hover:border-[#0da5aa] bg-slate-50 dark:bg-[#080d17] hover:bg-slate-50/70 dark:hover:bg-[#080d17]/70 rounded-xl cursor-pointer transition-colors"
                  >
                    <Upload className="h-8 w-8 text-[#0da5aa] mb-2" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Click to browse or drop photos here
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      You can select multiple PNG, JPG, or WebP images
                    </p>
                  </div>

                  {/* Selected Photos Preview & Per-Photo Titles */}
                  {uploadBatch.length > 0 && (
                    <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {uploadBatch.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] p-2 text-xs"
                        >
                          <img
                            src={item.url}
                            alt=""
                            className="h-12 w-14 rounded-md object-cover bg-slate-100 dark:bg-slate-900 shrink-0"
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
                              className="w-full rounded border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] px-2 py-1 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date (text)
                  </label>
                  <input
                    type="text"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    placeholder="e.g. 2026-01-01 or Jan 2026"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  placeholder="Optional brief description of the photo(s)..."
                  className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none resize-none"
                />
              </div>

              {/* Live Upload Progress Indicator */}
              {(saving || isUploadingFiles) && (
                <div className="flex items-center gap-2.5 rounded-lg bg-teal-50 dark:bg-cyan-500/10 border border-teal-200 dark:border-cyan-500/20 p-3 text-xs text-teal-800 dark:text-cyan-300 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-[#0da5aa] shrink-0" />
                  <span className="font-medium">{uploadStatusText || "Uploading and saving images..."}</span>
                </div>
              )}

              {/* Prominent Modal Error Alert */}
              {modalError && (
                <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-3 text-xs text-rose-700 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-rose-800 dark:text-rose-300">Upload Issue</p>
                    <p className="mt-0.5 leading-relaxed">{modalError}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1b283d]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving || isUploadingFiles}
                  className="rounded-lg border border-slate-200 dark:border-[#1b283d] px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploadingFiles}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0da5aa] px-5 py-2 text-xs font-semibold text-white hover:bg-[#088395] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b283d]">
              <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-white">
                Create New Category
              </h3>
              <button
                type="button"
                onClick={() => setAddAlbumModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAlbumSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g. Clinical Conferences"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#080d17] px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-[#0da5aa] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddAlbumModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-[#1b283d] px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0da5aa] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#088395] cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Image Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b283d]">
              <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-white">
                Image Preview
              </h3>
              <button
                type="button"
                onClick={() => setViewingImage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-[#1b283d]">
              <img
                src={viewingImage.image_url || viewingImage.image}
                alt={viewingImage.title}
                className="w-full max-h-[380px] object-contain mx-auto"
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
                  {viewingImage.title}
                </h4>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {viewingImage.category}
                </span>
              </div>
              {viewingImage.caption && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {viewingImage.caption}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-[#1b283d] pt-3">
              <button
                type="button"
                onClick={() => {
                  const img = viewingImage;
                  setViewingImage(null);
                  handleOpenEdit(img);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#e0f2fe] dark:bg-cyan-500/15 border border-transparent dark:border-cyan-500/30 px-3.5 py-2 text-xs font-semibold text-[#0284c7] dark:text-cyan-400 hover:bg-[#bae6fd] dark:hover:bg-cyan-500/25 transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Image</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingImage(null)}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0e1624] border border-slate-200 dark:border-[#1b283d] p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h4 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
              Confirm Delete
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove this image from the gallery? This will also remove it from the public website gallery.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-200 dark:border-[#1b283d] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
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
