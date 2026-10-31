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

const PAGE_SIZE = 5;

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
      <ArrowUp className="h-3 w-3 text-[#00bcd4]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#00bcd4]" />
    );
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 py-3">
              <div className="h-4 w-6 bg-slate-200 rounded" />
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="h-4 w-44 bg-slate-200 rounded" />
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" role="table">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-700 font-bold text-xs select-none">
              <th className="py-4 pl-6 pr-3 w-12 text-left">#</th>
              <th className="py-4 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("name")}
                  className="group inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-900 cursor-pointer focus:outline-none"
                >
                  <span>Member</span>
                  {renderSortIcon("name")}
                </button>
              </th>
              <th className="py-4 px-4">
                <button
                  type="button"
                  onClick={() => handleHeaderSort("department")}
                  className="group inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-900 cursor-pointer focus:outline-none"
                >
                  <span>Designation</span>
                  {renderSortIcon("department")}
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-slate-700">Email</th>
              <th className="py-4 px-4 font-bold text-slate-700">Status</th>
              <th className="py-4 pl-4 pr-6 text-right font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentMembers.map((member, index) => {
              const rowNum = startIndex + index + 1;
              const isPublished =
                member.status?.toLowerCase() === "published" ||
                member.status?.toLowerCase() === "active" ||
                !member.status;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* # Index Number */}
                  <td className="py-4 pl-6 pr-3 text-xs font-bold text-slate-800">
                    {rowNum}
                  </td>

                  {/* Member Photo + Name + Role Subtitle */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={member.image_url || member.photo}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-outfit text-sm font-bold text-[#0c2b48] leading-tight truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-400 font-normal truncate mt-0.5">
                          {member.role || member.designation || "Researcher"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Designation Badge (e.g. Leadership, Laboratory Sciences, Human Genetics) */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#e0f7fa] text-[#00838f] whitespace-nowrap">
                      {member.department || "Leadership"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-700 font-medium text-xs">
                    <span className="truncate block" title={member.email}>
                      {member.email || "—"}
                    </span>
                  </td>

                  {/* Status Badge (• Published) */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
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
                  <td className="py-4 pl-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                        title="Edit member"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(member.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
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

      {/* Table Footer with Pagination (Showing 1–5 of 9 members) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
        <span className="font-medium text-slate-500">
          Showing {members.length > 0 ? startIndex + 1 : 0}–
          {Math.min(startIndex + PAGE_SIZE, members.length)} of {members.length} members
        </span>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#00bcd4] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
