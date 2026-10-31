import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  SlidersHorizontal,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import TeamList from "./team/TeamList.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  uploadTeamImage,
} from "../api/team.js";

const DEPARTMENTS = [
  "All Departments",
  "Leadership",
  "Human Genetics",
  "Laboratory Sciences",
  "Bioinformatics",
  "Computational Biology",
  "Training & Outreach",
];

const INITIAL_FORM = {
  name: "",
  role: "",
  department: "Human Genetics",
  qualification: "",
  email: "",
  bio: "",
  image_url: "",
  status: "published",
  sort_order: 1,
};

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sorting state for List View
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Requirement 1: Load team members from Supabase `team` table
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamMembers();
      setTeam(data);
    } catch (err) {
      setError(err.message || "Failed to load team members from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Filtered members
  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (member.name && member.name.toLowerCase().includes(q)) ||
        (member.role && member.role.toLowerCase().includes(q)) ||
        (member.email && member.email.toLowerCase().includes(q)) ||
        (member.department && member.department.toLowerCase().includes(q)) ||
        (member.qualification && member.qualification.toLowerCase().includes(q));

      const matchDept =
        selectedDept === "All Departments" || member.department === selectedDept;

      return matchSearch && matchDept;
    });
  }, [team, searchTerm, selectedDept]);

  // Sorted members
  const sortedTeam = useMemo(() => {
    if (!sortField) {
      return [...filteredTeam].sort(
        (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
      );
    }
    return [...filteredTeam].sort((a, b) => {
      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTeam, sortField, sortDirection]);

  // Sort change handler
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Reorder handler
  const handleReorder = async (memberId, direction) => {
    const index = team.findIndex((m) => m.id === memberId);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const copy = [...team];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    const reordered = copy.map((m, i) => ({
      ...m,
      sort_order: i + 1,
    }));

    setTeam(reordered);
    try {
      await reorderTeamMembers(reordered);
    } catch (err) {
      console.error("Failed to reorder team members in Supabase:", err);
      fetchTeam();
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMember(null);
    setModalError("");
    setFormData({
      ...INITIAL_FORM,
      sort_order: team.length + 1,
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setModalError("");
    setFormData({
      name: member.name || "",
      role: member.role || "",
      department: member.department || "Human Genetics",
      qualification: member.qualification || "",
      email: member.email || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      status: member.status?.toLowerCase() === "draft" ? "draft" : "published",
      sort_order: member.sort_order ?? 1,
    });
    setModalOpen(true);
  };

  // Save Modal Member
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      setModalError("Please provide both full name and role/designation.");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      if (editingMember) {
        const updated = await updateTeamMember(editingMember.id, formData);
        setTeam((prev) =>
          prev.map((m) => (m.id === editingMember.id ? updated : m))
        );
      } else {
        const created = await createTeamMember(formData);
        setTeam((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setModalError(err.message || "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Member
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTeamMember(deleteId);
      setTeam((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(`Failed to delete team member: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header (Matches screenshot) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00bcd4] text-white shadow-xs">
            <Users className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-outfit text-2xl font-bold text-[#0c2b48]">Team</h1>
            <p className="font-inter text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your team members
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00bcd4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00acc1] active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Search & Filter Bar (Matches screenshot) */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team members..."
            className="w-full bg-transparent pl-7 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              selectedDept !== "All Departments" || showFilterDropdown
                ? "border-[#00bcd4] bg-cyan-50 text-[#00bcd4]"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            title="Filter by department"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in zoom-in-95">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Filter by Department
              </div>
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => {
                    setSelectedDept(dept);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? "bg-[#e0f7fa] text-[#00838f] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Main Table View */}
      <div className="transition-opacity duration-200 motion-reduce:transition-none">
        {loading ? (
          <TeamList loading={true} />
        ) : sortedTeam.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members found"
            description={
              error
                ? "Could not load records from Supabase `team` table."
                : "No team members match your search or department filter criteria."
            }
            actionText={error ? "Retry" : "Clear Filters"}
            onAction={() => {
              if (error) {
                fetchTeam();
              } else {
                setSearchTerm("");
                setSelectedDept("All Departments");
              }
            }}
          />
        ) : (
          <TeamList
            members={sortedTeam}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeleteId(id)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-outfit text-lg font-bold text-slate-800">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Sarah"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Molecular Biologist"
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    placeholder="e.g. Ph.D. Genetics"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: Number(e.target.value) || 1 })
                    }
                    placeholder="1"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. doctor@clingene.pk"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief clinical background or research summary"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none resize-none"
                />
              </div>

              {/* Image Uploader: Supabase Storage bucket 'images' at team/<uuid>.webp */}
              <ImageUploader
                label="Member Photo"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onUpload={uploadTeamImage}
                maxSizeMB={10}
                helperText="PNG, JPG, or WebP up to 10MB (automatically resized & converted to WebP <= 2MB)"
              />

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving
                    ? "Saving..."
                    : editingMember
                    ? "Save Changes"
                    : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM DIALOG ================= */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Confirm Member Deletion"
        message="Are you sure you want to remove this team member from the roster? This will permanently delete the record from Supabase."
        confirmText={deleting ? "Deleting..." : "Delete Member"}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
