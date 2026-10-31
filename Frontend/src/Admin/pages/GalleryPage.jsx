import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Search,
  ChevronDown,
  MoreHorizontal,
  CheckSquare,
  Upload,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import { MOCK_ALBUMS, MOCK_GALLERY_IMAGES } from "../mocks/mockData.js";

const ALBUM_CATEGORIES = [
  "All Albums",
  "Laboratory",
  "Team Events",
  "Research Work",
  "Facilities",
];

export default function GalleryPage() {
  const [albums, setAlbums] = useState(MOCK_ALBUMS);
  const [images, setImages] = useState(MOCK_GALLERY_IMAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("All Albums");
  const [selectedIds, setSelectedIds] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addAlbumModalOpen, setAddAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newImage, setNewImage] = useState({
    title: "",
    album: "Laboratory",
    src: "",
  });
  const [deleteId, setDeleteId] = useState(null);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchSearch =
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.album.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAlbum =
        selectedAlbum === "All Albums" || img.album === selectedAlbum;
      return matchSearch && matchAlbum;
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

  const handleUploadSave = (e) => {
    e.preventDefault();
    if (!newImage.title) return;
    const item = {
      id: Date.now(),
      ...newImage,
    };
    setImages((prev) => [item, ...prev]);
    setUploadModalOpen(false);
    setNewImage({
      title: "",
      album: "Laboratory",
      src: "",
    });
  };

  const handleAddAlbumSave = (e) => {
    e.preventDefault();
    if (!newAlbumName) return;
    const album = {
      id: newAlbumName.toLowerCase().replace(/\s+/g, "-"),
      name: newAlbumName,
      count: "0 Photos",
      cover: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    };
    setAlbums((prev) => [...prev, album]);
    setAddAlbumModalOpen(false);
    setNewAlbumName("");
  };

  const handleDelete = () => {
    if (deleteId) {
      setImages((prev) => prev.filter((img) => img.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={ImageIcon}
        title="Gallery"
        subtitle="Photos & Media Gallery"
        breadcrumb="Gallery"
        actionLabel="Add Album"
        onAction={() => setAddAlbumModalOpen(true)}
      />

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="relative w-full sm:w-56">
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
          >
            {ALBUM_CATEGORIES.map((alb) => (
              <option key={alb} value={alb}>
                {alb}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Album Cards Row */}
      {albums.length === 0 ? (
        <div className="mb-8 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
          <ImageIcon className="h-9 w-9 text-slate-300 mx-auto mb-2" />
          <h4 className="font-outfit text-sm font-bold text-slate-700">
            No Photo Albums Available
          </h4>
          <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
            The gallery section on the public website is currently under construction. You can organize images into albums here.
          </p>
          <button
            type="button"
            onClick={() => setAddAlbumModalOpen(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00897b] transition-colors cursor-pointer"
          >
            + Add New Album
          </button>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all"
            >
              <div className="h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={album.cover}
                  alt={album.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <h4 className="font-outfit text-sm font-bold text-slate-800">
                    {album.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-normal">{album.count}</p>
                </div>
                <button
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Images Section */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        {/* Section Top Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-outfit text-base font-bold text-[#009688]">
              Recent Images
            </h3>
            <span className="text-xs text-slate-400">
              {filteredImages.length} images
            </span>
          </div>

          <div className="flex items-center gap-2.5">
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
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#009688] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#00897b] transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Images</span>
            </button>
          </div>
        </div>

        {/* 4x2 Image Grid or Empty State */}
        {filteredImages.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <ImageIcon className="h-9 w-9 text-slate-300 mx-auto mb-2" />
            <p className="font-outfit text-sm font-bold text-slate-700">
              {searchTerm
                ? `No images match "${searchTerm}"`
                : "No Gallery Images Uploaded"}
            </p>
            <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchTerm
                ? "Try clearing search keywords or selecting all albums."
                : "The gallery on the public website is currently under construction. You can upload laboratory, equipment, or facility photos here."}
            </p>
            <button
              type="button"
              onClick={searchTerm ? () => setSearchTerm("") : () => setUploadModalOpen(true)}
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
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={img.src}
                      alt={img.title}
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
                  </div>

                  {/* Info Bar */}
                  <div className="flex items-center justify-between p-3">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-outfit text-xs font-bold text-slate-800 truncate">
                        {img.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {img.album}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(img.id)}
                        className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Image Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                Upload Image
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  required
                  value={newImage.title}
                  onChange={(e) =>
                    setNewImage({ ...newImage, title: e.target.value })
                  }
                  placeholder="e.g. Genetics laboratory"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Album
                </label>
                <select
                  value={newImage.album}
                  onChange={(e) =>
                    setNewImage({ ...newImage, album: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                >
                  {ALBUM_CATEGORIES.filter((a) => a !== "All Albums").map((alb) => (
                    <option key={alb} value={alb}>
                      {alb}
                    </option>
                  ))}
                </select>
              </div>

              <ImageUploader
                label="Select Photo"
                value={newImage.src}
                onChange={(val) => setNewImage({ ...newImage, src: val })}
                aspectRatio="aspect-16/9"
                helperText="Upload a photo from your computer or phone"
              />

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b]"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Album Modal */}
      {addAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-base font-bold text-slate-800">
                Create New Album
              </h3>
              <button
                type="button"
                onClick={() => setAddAlbumModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAlbumSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Album Name
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

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddAlbumModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#00897b]"
                >
                  Create
                </button>
              </div>
            </form>
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
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
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

