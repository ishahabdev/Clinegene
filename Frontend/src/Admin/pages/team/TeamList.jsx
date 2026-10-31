import { useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const PAGE_SIZE = 8;

export default function TeamList({
  members = [],
  onEdit,
  onDelete,
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
      return <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-[#009688]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#009688]" />
    );
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 py-2">
              <div className="h-4 w-6 bg-slate-200 rounded" />
              <div className="h-9 w-9 rounded-full bg-slate-200" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" role="table">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] select-none">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("name")}
                  className="group inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 cursor-pointer focus:outline-none"
                >
                  <span>Member</span>
                  {renderSortIcon("name")}
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("designation")}
                  className="group inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 cursor-pointer focus:outline-none"
                >
                  <span>Designation</span>
                  {renderSortIcon("designation")}
                </button>
              </th>
              <th className="py-3.5 px-4 text-center">Department</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentMembers.map((member, index) => {
              const rowNum = startIndex + index + 1;
              const isPublished =
                member.status === "Published" ||
                member.status === "Active" ||
                !member.status;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* # Index Number */}
                  <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-800">
                    {rowNum}
                  </td>

                  {/* Member Photo + Name + Designation Subtitle */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-outfit text-xs sm:text-[13px] font-bold text-slate-800 leading-snug truncate">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Designation Badge (matches light cyan badge in screenshot) */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e0f7fa] text-[#00838f] whitespace-nowrap">
                      {member.department || "Executive Leadership"}
                    </span>
                  </td>

                  {/* Department (shown as dash — in screenshot) */}
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                    —
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <span className="truncate block" title={member.email}>
                      {member.email || "—"}
                    </span>
                  </td>

                  {/* Status Badge (Green dot + Published) */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                        isPublished
                          ? "bg-[#e8f5e9] text-[#2e7d32]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isPublished ? "bg-[#2e7d32]" : "bg-amber-500"
                        }`}
                      />
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Actions (Light Blue Edit & Light Red Delete) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(member)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                        title="Edit member"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(member.id)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                        title="Delete member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination matching screenshot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
        <span className="font-medium text-slate-500">
          Showing {members.length > 0 ? startIndex + 1 : 0} –{" "}
          {Math.min(startIndex + PAGE_SIZE, members.length)} of {members.length} members
        </span>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#009688] text-white shadow-xs"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
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
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
