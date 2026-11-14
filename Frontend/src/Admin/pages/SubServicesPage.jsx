import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Modal from "../components/Modal.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  deleteSubService,
  getSubServiceServices,
  getSubServices,
  saveSubService,
  setSubServiceActive,
  validateSubServiceImage,
} from "../api/subServices.js";

const PAGE_SIZE = 10;
const EMPTY_FORM = {
  service_id: "",
  name: "",
  description: "",
  price: "",
  price_type: "on_request",
  duration: "",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

function priceLabel(item) {
  if (item.price_type === "on_request" || item.price == null) return "On request";
  const amount = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(item.price);
  return `${item.price_type === "starting_from" ? "From " : ""}${amount}`;
}

export default function SubServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [serviceLoadError, setServiceLoadError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [clearImage, setClearImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingActiveId, setUpdatingActiveId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const requestIdRef = useRef(0);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const loadServices = useCallback(async () => {
    setServiceLoadError("");
    try {
      setServices(await getSubServiceServices());
    } catch (error) {
      console.error("[SubServicesPage] Failed to load services:", error);
      setServiceLoadError(error.message || "Unable to load services.");
    }
  }, []);

  const loadItems = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setLoadError("");
    try {
      const result = await getSubServices({
        page,
        pageSize: PAGE_SIZE,
        search,
        serviceId: serviceFilter,
      });
      if (requestId !== requestIdRef.current) return;
      setItems(result.items);
      setCount(result.count);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("[SubServicesPage] Failed to load sub-services:", error);
      setItems([]);
      setCount(0);
      setLoadError(error.message || "Unable to load sub-services.");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, search, serviceFilter]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const timeout = window.setTimeout(loadItems, search ? 250 : 0);
    return () => window.clearTimeout(timeout);
  }, [loadItems, search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const serviceNameById = useMemo(
    () => new Map(services.map((service) => [service.id, service.title])),
    [services]
  );

  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, service_id: serviceFilter || services[0]?.id || "" });
    setImageFile(null);
    setClearImage(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      service_id: item.service_id,
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      price_type: item.price_type || "on_request",
      duration: item.duration || "",
      image_url: item.image_url || "",
      is_active: item.is_active,
      sort_order: item.sort_order ?? 0,
    });
    setImageFile(null);
    setClearImage(false);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setImageFile(null);
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    try {
      validateSubServiceImage(file);
      setImageFile(file);
      setClearImage(false);
      setFormError("");
    } catch (error) {
      setImageFile(null);
      event.target.value = "";
      setFormError(error.message);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!form.service_id) {
      setFormError("Select a parent service.");
      return;
    }
    if (!form.name.trim()) {
      setFormError("Enter a sub-service name.");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveSubService({
        ...form,
        id: editingItem?.id,
        imageFile,
        clearImage,
      });
      setModalOpen(false);
      setImageFile(null);
      showToast({
        type: saved.cleanupWarning ? "error" : "success",
        title: saved.cleanupWarning ? "Saved with a cleanup warning" : "Sub-service saved",
        message:
          saved.cleanupWarning ||
          `"${saved.name}" was ${editingItem ? "updated" : "created"} successfully.`,
      });
      await loadItems();
    } catch (error) {
      console.error("[SubServicesPage] Failed to save sub-service:", error);
      setFormError(error.message || "Unable to save this sub-service.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item) => {
    setUpdatingActiveId(item.id);
    try {
      await setSubServiceActive(item.id, !item.is_active);
      showToast({
        type: "success",
        message: `"${item.name}" is now ${item.is_active ? "inactive" : "active"}.`,
      });
      await loadItems();
    } catch (error) {
      console.error("[SubServicesPage] Failed to update active status:", error);
      showToast({ type: "error", title: "Update failed", message: error.message });
    } finally {
      setUpdatingActiveId("");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      const result = await deleteSubService(deletingItem);
      setDeletingItem(null);
      showToast({
        type: result.cleanupWarning ? "error" : "success",
        title: result.cleanupWarning ? "Deleted with a cleanup warning" : "Sub-service deleted",
        message: result.cleanupWarning || `"${deletingItem.name}" was deleted.`,
      });
      await loadItems();
    } catch (error) {
      console.error("[SubServicesPage] Failed to delete sub-service:", error);
      showToast({ type: "error", title: "Delete failed", message: error.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        icon={Layers}
        title="Sub-Services"
        subtitle="Manage service options, pricing, and public visibility"
        breadcrumb="Sub-Services"
        actionLabel="Add Sub-Service"
        onAction={openCreate}
      />

      <section
        aria-label="Sub-service filters"
        className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-[#1b283d] dark:bg-[#0e1624] sm:grid-cols-[minmax(220px,1fr)_minmax(200px,280px)]"
      >
        <label className="relative block">
          <span className="sr-only">Search sub-services</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by sub-service name"
            className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17] dark:text-slate-100"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter by service</span>
          <select
            value={serviceFilter}
            onChange={(event) => {
              setServiceFilter(event.target.value);
              setPage(1);
            }}
            className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17] dark:text-slate-100"
          >
            <option value="">All services</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        {serviceLoadError && (
          <p role="alert" className="text-sm text-rose-600 sm:col-span-2">
            {serviceLoadError}
          </p>
        )}
      </section>

      <section
        aria-label="Sub-services"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-[#1b283d] dark:bg-[#0e1624]"
      >
        {loadError ? (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm text-rose-600">{loadError}</p>
            <button
              type="button"
              onClick={loadItems}
              className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#088395] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#0da5aa]"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-4 p-6" role="status" aria-label="Loading sub-services">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Layers className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-slate-800 dark:text-white">
              {search || serviceFilter ? "No matching sub-services" : "No sub-services yet"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {search || serviceFilter
                ? "Try changing the search or service filter."
                : "Create a sub-service to show additional options on the public service pages."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#080d17] dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-3">Sub-Service</th>
                    <th scope="col" className="px-5 py-3">Parent service</th>
                    <th scope="col" className="px-5 py-3">Price</th>
                    <th scope="col" className="px-5 py-3">Active</th>
                    <th scope="col" className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1b283d]">
                  {items.map((item) => (
                    <tr key={item.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                              <ImagePlus className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">{item.name}</p>
                            {item.slug && <p className="truncate text-xs text-slate-400">{item.slug}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{item.services?.title || serviceNameById.get(item.service_id) || "—"}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">{priceLabel(item)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.is_active}
                          aria-label={`${item.is_active ? "Deactivate" : "Activate"} ${item.name}`}
                          disabled={updatingActiveId === item.id}
                          onClick={() => handleToggleActive(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0da5aa] disabled:opacity-50 ${
                            item.is_active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              item.is_active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            aria-label={`Edit ${item.name}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#088395] focus-visible:outline-2 focus-visible:outline-[#0da5aa] dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            aria-label={`Delete ${item.name}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-500 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-[#1b283d] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, count)}–{Math.min(page * PAGE_SIZE, count)} of {count}
              </span>
              <nav className="flex items-center justify-end gap-2" aria-label="Sub-service pages">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0da5aa] dark:border-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </button>
                <span aria-current="page" className="px-2 font-semibold text-slate-700 dark:text-slate-200">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0da5aa] dark:border-slate-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </>
        )}
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? "Edit Sub-Service" : "Add Sub-Service"}
        subtitle="Sub-services are shown beneath their active parent service."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Parent service <span aria-hidden="true" className="text-rose-500">*</span>
              </span>
              <select
                required
                value={form.service_id}
                onChange={(event) => updateForm("service_id", event.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Name <span aria-hidden="true" className="text-rose-500">*</span>
              </span>
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                rows={3}
                maxLength={1200}
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Price type</span>
              <select
                value={form.price_type}
                onChange={(event) => updateForm("price_type", event.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              >
                <option value="fixed">Fixed</option>
                <option value="starting_from">Starting from</option>
                <option value="on_request">On request</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Duration</span>
              <input
                value={form.duration}
                onChange={(event) => updateForm("duration", event.target.value)}
                placeholder="e.g. 3–5 business days"
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Display order</span>
              <input
                type="number"
                step="1"
                value={form.sort_order}
                onChange={(event) => updateForm("sort_order", event.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0da5aa] focus:ring-2 focus:ring-[#0da5aa]/20 dark:border-slate-700 dark:bg-[#080d17]"
              />
            </label>
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">Image</span>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {(previewUrl || (!clearImage && form.image_url)) && (
                  <img
                    src={previewUrl || form.image_url}
                    alt="Sub-service preview"
                    className="h-20 w-20 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                  />
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Upload sub-service image"
                    onChange={handleImageChange}
                    className="block w-full max-w-xs text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold dark:text-slate-300 dark:file:bg-slate-800"
                  />
                  {(imageFile || form.image_url) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setClearImage(true);
                      }}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-500 dark:hover:bg-rose-950/30"
                    >
                      Remove image
                    </button>
                  )}
                  {clearImage && form.image_url && (
                    <button
                      type="button"
                      onClick={() => setClearImage(false)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-[#088395] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#0da5aa] dark:hover:bg-slate-800"
                    >
                      Keep existing image
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, or WebP; maximum 2 MB.</p>
            </div>
            <label className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => updateForm("is_active", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0da5aa] focus:ring-[#0da5aa]"
              />
              Active (visible on the public site)
            </label>
          </div>

          {formError && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 dark:border-[#1b283d] sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#0da5aa] disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || services.length === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0da5aa] px-4 text-sm font-semibold text-white hover:bg-[#088395] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0da5aa] disabled:opacity-50"
            >
              {saving ? "Saving…" : editingItem ? "Save changes" : <><Plus className="h-4 w-4" aria-hidden="true" />Create sub-service</>}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => {
          if (!deleting) setDeletingItem(null);
        }}
        onConfirm={handleDelete}
        title="Delete sub-service"
        message={`Delete "${deletingItem?.name || "this sub-service"}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
