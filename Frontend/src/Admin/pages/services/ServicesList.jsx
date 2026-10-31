import { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Dna,
  Activity,
  Layers,
  Shield,
  Microscope,
  Stethoscope,
  Pill,
  Monitor,
  FileText,
  Clock,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 8;

const ICON_MAP = {
  dna: Dna,
  activity: Activity,
  layers: Layers,
  shield: Shield,
  microscope: Microscope,
  stethoscope: Stethoscope,
  pill: Pill,
  monitor: Monitor,
  file: FileText,
};

function getCategoryBadgeStyle(category) {
  switch (category) {
    case "Clinical Diagnostics":
      return "bg-cyan-50 text-cyan-700 border border-cyan-200/60";
    case "Genomic Sequencing":
      return "bg-purple-50 text-purple-700 border border-purple-200/60";
    case "Bioinformatics":
      return "bg-blue-50 text-blue-700 border border-blue-200/60";
    case "Computational Biology":
      return "bg-sky-50 text-sky-700 border border-sky-200/60";
    case "Laboratory Services":
      return "bg-teal-50 text-teal-700 border border-teal-200/60";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export default function ServicesList({
  services = [],
  onEdit,
  onView,
  onDelete,
  loading = false,
  currentPage = 1,
  onPageChange,
}) {
  const [internalPage, setInternalPage] = useState(1);
  const page = onPageChange ? currentPage : internalPage;
  const setPage = onPageChange || setInternalPage;

  const totalPages = Math.ceil(services.length / PAGE_SIZE) || 1;
  const validCurrentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const currentServices = services.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse space-y-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="flex items-center gap-4">
            <div className="h-4 w-6 bg-slate-200 rounded" />
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-200 rounded ml-auto" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" role="table">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px] select-none">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4 min-w-[240px]">Service</th>
              <th className="py-3.5 px-4 min-w-[150px]">Category</th>
              <th className="py-3.5 px-4 min-w-[260px]">Description</th>
              <th className="py-3.5 px-4 text-center min-w-[100px]">Status</th>
              <th className="py-3.5 px-4 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentServices.map((service, index) => {
              const Icon = ICON_MAP[service.icon] || Dna;
              const isActive = service.status === "Active" || !service.status;

              return (
                <tr
                  key={service.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Number */}
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                    {startIndex + index + 1}.
                  </td>

                  {/* Service Icon, Name & Subtitle */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#009688]">
                        <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-outfit text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                          {service.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {service.subtitle || service.tagline}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category Pill Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${getCategoryBadgeStyle(
                        service.category
                      )}`}
                    >
                      {service.category}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4">
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-1 max-w-xs xl:max-w-md">
                      {service.description}
                    </p>
                  </td>

                  {/* Status Pill Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{isActive ? "Active" : "Inactive"}</span>
                    </span>
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => onView && onView(service)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                        title="View details &amp; preview"
                        aria-label={`View ${service.name}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(service)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Edit service"
                        aria-label={`Edit ${service.name}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(service.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                        title="Delete service"
                        aria-label={`Delete ${service.name}`}
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
          Showing {services.length > 0 ? startIndex + 1 : 0} –{" "}
          {Math.min(startIndex + PAGE_SIZE, services.length)} of {services.length} services
        </span>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setPage(Math.max(1, validCurrentPage - 1))}
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous page"
            aria-label="Previous page"
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
                onClick={() => setPage(pageNum)}
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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
            onClick={() => setPage(Math.min(totalPages, validCurrentPage + 1))}
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

