import { useState, useMemo } from "react";
import {
  Newspaper,
  Search,
  ChevronDown,
  Edit2,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import { MOCK_BLOG_ARTICLES } from "../mocks/mockData.js";

const CATEGORIES = ["All Categories", "Announcement", "Event", "Research", "Career"];
const STATUSES = ["All Status", "Published", "Draft"];

export default function BlogPage() {
  const [articles, setArticles] = useState(MOCK_BLOG_ARTICLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewArticle, setViewArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Announcement",
    author: "Dr. Amjad Ali Tanoli Ph.D",
    status: "Published",
    date: "Oct 30, 2025",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&auto=format&fit=crop&q=80",
  });
  const [deleteId, setDeleteId] = useState(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCat === "All Categories" || art.category === selectedCat;
      const matchStatus =
        selectedStatus === "All Status" || art.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [articles, searchTerm, selectedCat, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      category: "Announcement",
      author: "Dr. Amjad Ali Tanoli Ph.D",
      status: "Published",
      date: "Oct 30, 2025",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&auto=format&fit=crop&q=80",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      author: art.author,
      status: art.status,
      date: art.date,
      image: art.image,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) => (a.id === editingArticle.id ? { ...a, ...formData } : a))
      );
    } else {
      const newArticle = {
        id: Date.now(),
        ...formData,
      };
      setArticles((prev) => [newArticle, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setArticles((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={Newspaper}
        title="Blog"
        subtitle="Latest News & Announcements"
        breadcrumb="Blog"
        actionLabel="Create Article"
        onAction={handleOpenAdd}
      />

      {/* Filter Bar with 2 Dropdowns (exact match to screenshot 5) */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2.5">
          <div className="relative w-full sm:w-44">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          <div className="relative w-full sm:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
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

      {/* Articles Table (exact match to screenshot 5) */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <Newspaper className="h-10 w-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="font-outfit text-sm font-bold text-slate-700">
                      {searchTerm
                        ? `No articles match "${searchTerm}"`
                        : "No News or Blog Articles"}
                    </p>
                    <p className="font-inter text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      {searchTerm
                        ? "Try clearing search terms or selecting all categories."
                        : "The news section on the public website is currently under construction. You can draft and publish articles here."}
                    </p>
                    <button
                      type="button"
                      onClick={searchTerm ? () => setSearchTerm("") : handleOpenAdd}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00897b] transition-colors cursor-pointer"
                    >
                      {searchTerm ? "Clear Search" : "+ Add Article"}
                    </button>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art, index) => (
                  <tr
                    key={art.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="h-10 w-14 shrink-0 rounded-md object-cover border border-slate-100 shadow-2xs"
                        />
                        <span className="font-outfit text-xs sm:text-sm font-bold text-slate-800">
                          {art.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {art.category}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {art.author}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-600">
                        {art.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-normal">
                      {art.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(art)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewArticle(art)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(art.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors"
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
            Showing {filteredArticles.length === 0 ? 0 : 1} to {filteredArticles.length} of {articles.length} articles
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

      {/* Add / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                {editingArticle ? "Edit Article" : "Create Article"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. New Genetic Testing Platform Launched"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
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
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Khan"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <ImageUploader
                label="Article Thumbnail Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                aspectRatio="aspect-16/9"
                helperText="Upload a featured image for this blog / news article"
              />

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b]"
                >
                  {editingArticle ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drawer */}
      {viewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                Article Details
              </h3>
              <button
                type="button"
                onClick={() => setViewArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <img
                src={viewArticle.image}
                alt={viewArticle.title}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div>
                <span className="text-slate-400 font-medium">Title</span>
                <p className="font-outfit text-base font-bold text-slate-800 mt-0.5">
                  {viewArticle.title}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Category</span>
                  <p className="font-semibold text-teal-700 mt-0.5">
                    {viewArticle.category}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Author</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {viewArticle.author}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Date</span>
                  <p className="text-slate-600 mt-0.5">{viewArticle.date}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Status</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-600">
                      {viewArticle.status}
                    </span>
                  </div>
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
              Are you sure you want to remove this article?
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

