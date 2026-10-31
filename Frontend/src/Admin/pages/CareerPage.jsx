import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Briefcase,
  Search,
  ChevronDown,
  Edit2,
  Eye,
  Trash2,
  Users,
  Plus,
  X,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../api/careers.js";

const DEPARTMENTS = [
  "All Departments",
  "Research",
  "Human Genetics",
  "Bioinformatics",
  "Laboratory Sciences",
  "Computational Biology",
  "Research & Development",
  "Training & Outreach",
];

const STATUSES = ["All Status", "Active", "Closed"];

const DEFAULT_FORM_DATA = {
  position: "",
  subtitle: "",
  department: "Human Genetics",
  type: "Full Time",
  status: "Active",
  applicants: 0,
};

export default function CareerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success toast state
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load jobs from Supabase
  const loadJobsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data || []);
    } catch (err) {
      console.error("[CareerPage] Failed to load jobs:", err);
      setError(err.message || "Failed to load jobs from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobsList();
  }, [loadJobsList]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const pos = (job.position || job.title || "").toLowerCase();
      const sub = (job.subtitle || job.short_description || "").toLowerCase();
      const dept = (job.department || "").toLowerCase();
      const q = searchTerm.toLowerCase();

      const matchSearch = !q || pos.includes(q) || sub.includes(q) || dept.includes(q);
      const matchDept = selectedDept === "All Departments" || job.department === selectedDept;
      const matchStatus = selectedStatus === "All Status" || job.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [jobs, searchTerm, selectedDept, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingJob(null);
    setFormData({ ...DEFAULT_FORM_DATA });
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      position: job.position || job.title || "",
      subtitle: job.subtitle || job.short_description || "",
      department: job.department || "Human Genetics",
      type: job.type || job.job_type || "Full Time",
      status: job.status || job.job_status || "Active",
      applicants: job.applicants ?? job.applicants_count ?? 0,
      sort_order: job.sort_order ?? 1,
    });
    setModalError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.position.trim()) {
      setModalError("Job position title is required.");
      return;
    }

    setSaving(true);
    setModalError("");

    try {
      if (editingJob) {
        const updated = await updateJob(editingJob.id, formData);
        setJobs((prev) =>
          prev.map((j) => (j.id === editingJob.id ? updated : j))
        );
        showToast("Job opening updated successfully.");
      } else {
        const created = await createJob(formData);
        setJobs((prev) => [...prev, created]);
        showToast("New job opening posted successfully.");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("[CareerPage] Save error:", err);
      setModalError(err.message || "Failed to save job opening.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteJob(deleteId);
      setJobs((prev) => prev.filter((j) => j.id !== deleteId));
      showToast("Job opening deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      console.error("[CareerPage] Delete error:", err);
      showToast("Error deleting job: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
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
        icon={Briefcase}
        title="Career"
        subtitle="Job Openings & Public Listings"
        breadcrumb="Career"
        actionLabel="Post Job"
        onAction={handleOpenAdd}
      />

      {/* Error banner if query fails */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadJobsList}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Filter Bar with 2 Dropdowns */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2.5">
          <div className="relative w-full sm:w-44">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
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

      {/* Main Jobs Section */}
      {loading && jobs.length === 0 ? (
        <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-xs mb-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#009688] border-r-transparent mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading job openings from Supabase...</p>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty state matching frontend real career data (no open jobs currently) */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#009688]">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="font-outfit text-base font-bold text-slate-800">
            No Open Positions Currently
          </h3>
          <p className="mt-1.5 max-w-md font-inter text-xs text-slate-500 leading-relaxed">
            ClinGene is currently reviewing staffing needs. No job vacancies are currently posted on the public careers portal. You can post a new opening whenever a position becomes available.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#009688] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#008779] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job Opening</span>
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty search/filter results */
        <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs mb-8">
          <p className="font-outfit text-sm font-bold text-slate-700">
            No matching job openings found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search query or department filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedDept("All Departments");
              setSelectedStatus("All Status");
            }}
            className="mt-4 text-xs font-semibold text-[#009688] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Job Openings Table */
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job, index) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-outfit text-xs sm:text-sm font-bold text-slate-800">
                        {job.position || job.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {job.subtitle || job.short_description}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {job.department}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {job.type || job.job_type}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          job.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.status || "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 text-[#009688] font-semibold">
                        <Users className="h-3.5 w-3.5" />
                        <span>{job.applicants ?? job.applicants_count ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(job)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewJob(job)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(job.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span>
              Showing {filteredJobs.length} of {jobs.length} job opening{jobs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                {editingJob ? "Edit Job Opening" : "Post New Job Opening"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g. Genetic Counselor"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Brief role description, duties, or requirements..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
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
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Applicants Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.applicants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicants: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
                </div>
              </div>

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
                  disabled={saving}
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : editingJob ? "Save Changes" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drawer */}
      {viewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                Job Position Details
              </h3>
              <button
                type="button"
                onClick={() => setViewJob(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Position</span>
                <p className="font-outfit text-base font-bold text-slate-800 mt-0.5">
                  {viewJob.position || viewJob.title}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Description</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {viewJob.subtitle || viewJob.short_description || "No description provided."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Department</span>
                  <p className="font-semibold text-teal-700 mt-0.5">
                    {viewJob.department}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Job Type</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {viewJob.type || viewJob.job_type}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Status</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        viewJob.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {viewJob.status || "Active"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Applicants</span>
                  <p className="font-bold text-[#009688] mt-0.5">
                    {viewJob.applicants ?? viewJob.applicants_count ?? 0} candidates
                  </p>
                </div>
              </div>
            </div>
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
              Are you sure you want to remove this job opening? This action will remove it from the public careers portal as well.
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
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
