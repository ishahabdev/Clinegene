import { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const PAGE_SIZE = 5;

function getDepartmentBadgeClass(dept = "") {
  const normalized = dept.toLowerCase();
  if (normalized.includes("leadership")) {
    return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/30";
  }
  if (normalized.includes("lab") || normalized.includes("science")) {
    return "bg-sky-500/10 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-500/30";
  }
  return "bg-teal-500/10 text-[#088395] dark:bg-teal-950/40 dark:text-[#0da5aa] border border-teal-500/30";
}

export default function TeamList({
  members = [],
  onEdit,
  onDelete,
  onView,
  sortField,
  sortDirection,
  onSortChange,
  loading = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(members.length / PAGE_SIZE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const currentMembers = members.slice(startIndex, startIndex + PAGE_SIZE);

  const handleHeaderSort = (field) => {
    if (!onSortChange) return;
    if (sortField === field) {
      onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-[#0da5aa]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#0da5aa]" />
    );
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-6 shadow-xs animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 py-3">
              <div className="h-4 w-6 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shadow-xs transition-colors">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" role="table">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1b283d] bg-slate-50/70 dark:bg-[#0b121e]/50 text-slate-500 dark:text-slate-400 font-semibold text-xs select-none">
              <th className="py-4 pl-6 pr-3 w-12 text-left">#</th>
              <th className="py-4 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("name")}
                  className="group inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer focus:outline-none"
                >
                  <span>Member</span>
                  {renderSortIcon("name")}
                </button>
              </th>
              <th className="py-4 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("department")}
                  className="group inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer focus:outline-none"
                >
                  <span>Designation</span>
                  {renderSortIcon("department")}
                </button>
              </th>
              <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="py-4 pr-6 pl-4 text-right font-semibold text-slate-600 dark:text-slate-300 min-w-[130px] whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#172336]/60">
            {currentMembers.map((member, index) => {
              const rowNum = startIndex + index + 1;
              const isPublished =
                member.status?.toLowerCase() === "published" ||
                member.status?.toLowerCase() === "active" ||
                !member.status;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#121c2e]/60 transition-colors group"
                >
                  {/* # Index Number */}
                  <td className="py-4 pl-6 pr-3 text-xs font-semibold text-slate-400 dark:text-slate-400">
                    {rowNum}
                  </td>

                  {/* Member Photo + Name + Role Subtitle */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={member.image_url || member.photo}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700/60 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-outfit text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                          {member.role || member.designation || "Researcher"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Designation Badge (e.g. Leadership, Laboratory Sciences, Human Genetics) */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getDepartmentBadgeClass(
                        member.department
                      )}`}
                    >
                      {member.department || "Leadership"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span className="truncate block" title={member.email}>
                      {member.email || "—"}
                    </span>
                  </td>

                  {/* Status Badge (• Published) */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isPublished
                            ? "bg-emerald-500 dark:bg-emerald-400"
                            : "bg-amber-500 dark:bg-amber-400"
                        }`}
                      />
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap min-w-[130px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView && onView(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#152030] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="View member details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-900/50 transition-colors cursor-pointer"
                        title="Edit member"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(member.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                        title="Delete member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-[#1b283d] bg-slate-50/50 dark:bg-[#0b121e]/40 px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Showing {members.length > 0 ? startIndex + 1 : 0}–
          {Math.min(startIndex + PAGE_SIZE, members.length)} of {members.length} members
        </span>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === validCurrentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0da5aa] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
