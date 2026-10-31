import { useState, useMemo, useEffect } from "react";
import { Users, Briefcase, Trophy, UserPlus, X } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import TeamToolbar from "./team/TeamToolbar.jsx";
import TeamGrid from "./team/TeamGrid.jsx";
import TeamList from "./team/TeamList.jsx";
import { useViewMode } from "../hooks/useViewMode.js";
import ImageUploader from "../components/ImageUploader.jsx";
import { MOCK_DOCTORS } from "../mocks/mockData.js";

const DEPARTMENTS = [
  "All Departments",
  "Executive Leadership",
  "Human Genetics",
  "Laboratory Sciences",
  "Bioinformatics",
  "Computational Biology",
  "Training & Outreach",
];

const STORAGE_KEY = "clingene_admin_team_doctors";

function loadInitialTeam() {
  if (typeof window === "undefined") {
    return MOCK_DOCTORS.map((m, i) => ({ ...m, displayOrder: m.displayOrder ?? i + 1 }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read stored team data", e);
  }
  return MOCK_DOCTORS.map((m, i) => ({ ...m, displayOrder: m.displayOrder ?? i + 1 }));
}

export default function TeamPage() {
  const [team, setTeam] = useState(loadInitialTeam);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [viewMode, setViewMode] = useViewMode("admin-team-view", "list");

  // Sorting state for List View
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "Executive Leadership",
    qualification: "",
    email: "",
    phone: "",
    photo: "",
    displayOrder: 1,
    status: "Published",
  });

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  // Sync team state to localStorage
  const saveTeamState = (newList) => {
    setTeam(newList);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      }
    } catch (e) {
      console.warn("Failed to persist team", e);
    }
  };

  // Filtered members
  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.designation.toLowerCase().includes(q) ||
        (member.email && member.email.toLowerCase().includes(q)) ||
        (member.department && member.department.toLowerCase().includes(q));
      const matchDept =
        selectedDept === "All Departments" || member.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [team, searchTerm, selectedDept]);

  // Sorted members (applied when sorting in list view)
  const sortedTeam = useMemo(() => {
    if (!sortField) {
      // Default sort by displayOrder
      return [...filteredTeam].sort(
        (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
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
  const handleReorder = (memberId, direction) => {
    const index = team.findIndex((m) => m.id === memberId);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const copy = [...team];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Reassign normalized order numbers
    const reordered = copy.map((m, i) => ({
      ...m,
      displayOrder: i + 1,
    }));

    saveTeamState(reordered);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      designation: "",
      department: "Human Genetics",
      qualification: "",
      email: "",
      phone: "",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      displayOrder: team.length + 1,
      status: "Published",
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      department: member.department || "Human Genetics",
      qualification: member.qualification || "",
      email: member.email || "",
      phone: member.phone || "",
      photo: member.photo || "",
      displayOrder: member.displayOrder ?? 1,
      status: member.status || "Published",
    });
    setModalOpen(true);
  };

  // Save Modal Member
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingMember) {
      const updated = team.map((m) =>
        m.id === editingMember.id ? { ...m, ...formData } : m
      );
      saveTeamState(updated);
    } else {
      const newMember = {
        id: Date.now(),
        ...formData,
        displayOrder: Number(formData.displayOrder) || team.length + 1,
      };
      saveTeamState([...team, newMember]);
    }
    setModalOpen(false);
  };

  // Delete Member
  const handleDelete = () => {
    if (deleteId) {
      const updated = team.filter((m) => m.id !== deleteId);
      // Re-normalize order
      const reordered = updated.map((m, i) => ({
        ...m,
        displayOrder: i + 1,
      }));
      saveTeamState(reordered);
      setDeleteId(null);
    }
  };

  // KPI Metrics for top stat cards
  const totalMembers = team.length;
  const departmentsCount = DEPARTMENTS.filter((d) => d !== "All Departments").length;
  const seniorCount = team.filter(
    (m) =>
      m.department === "Executive Leadership" ||
      (m.designation && (m.designation.includes("CEO") || m.designation.includes("Director")))
  ).length || 2;
  const activeCount = team.filter(
    (m) => m.status === "Published" || m.status === "Active" || !m.status
  ).length;

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={Users}
        title="Team"
        subtitle="Our Professional Team Members"
        breadcrumb="Team"
        actionLabel="+ Add Member"
        onAction={handleOpenAdd}
      />

      {/* Toolbar: Search & Department Filter */}
      <TeamToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        departments={DEPARTMENTS}
        count={sortedTeam.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 4 Stat Cards in a Row (Matching Screenshot) */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Members */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f8fa] text-[#009688]">
            <Users className="h-6 w-6 stroke-[1.9]" />
          </div>
          <div>
            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none">
              {totalMembers}
            </h3>
            <p className="font-inter text-xs font-semibold text-slate-400 mt-1">
              Total Members
            </p>
          </div>
        </div>

        {/* Card 2: Departments */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f8fa] text-[#00a2b5]">
            <Briefcase className="h-6 w-6 stroke-[1.9]" />
          </div>
          <div>
            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none">
              {departmentsCount}
            </h3>
            <p className="font-inter text-xs font-semibold text-slate-400 mt-1">
              Departments
            </p>
          </div>
        </div>

        {/* Card 3: Senior Members */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f8fa] text-[#00a2b5]">
            <Trophy className="h-6 w-6 stroke-[1.9]" />
          </div>
          <div>
            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none">
              {seniorCount}
            </h3>
            <p className="font-inter text-xs font-semibold text-slate-400 mt-1">
              Senior Members
            </p>
          </div>
        </div>

        {/* Card 4: Active Members */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f8fa] text-[#00a2b5]">
            <UserPlus className="h-6 w-6 stroke-[1.9]" />
          </div>
          <div>
            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none">
              {activeCount}
            </h3>
            <p className="font-inter text-xs font-semibold text-slate-400 mt-1">
              Active Members
            </p>
          </div>
        </div>
      </div>

      {/* Main View Container with smooth fade transition */}
      <div className="transition-opacity duration-200 motion-reduce:transition-none">
        {sortedTeam.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members found"
            description="No team members match your search or department filter criteria."
            actionText="Clear Filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedDept("All Departments");
            }}
          />
        ) : viewMode === "list" ? (
          <TeamList
            members={sortedTeam}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeleteId(id)}
            onReorder={handleReorder}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        ) : (
          <TeamGrid
            members={sortedTeam}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeleteId(id)}
            onReorder={handleReorder}
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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
                  placeholder="e.g. Dr. Sarah Khan Ph.D"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="e.g. Lead Molecular Biologist &amp; Geneticist"
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
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

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
                  placeholder="e.g. Ph.D. Human Genetics (King's College London)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@clingene.pk"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#009688] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Member Photo"
                value={formData.photo}
                onChange={(val) => setFormData({ ...formData, photo: val })}
                helperText="Click or drop a PNG, JPG, or WebP photo of the team member"
              />

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#009688] px-5 py-2 text-xs font-semibold text-white hover:bg-[#00897b] transition-colors shadow-xs"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
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
        message="Are you sure you want to remove this team member from the roster? This action cannot be undone."
        confirmText="Delete Member"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
