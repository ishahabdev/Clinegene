import { useState } from "react";
import {
  Stethoscope,
  Dna,
  Syringe,
  Droplet,
  Layers,
  GitFork,
  BarChart2,
  Microscope,
  Activity,
  FileText,
  FlaskConical,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 8;

function getServiceIcon(service) {
  const name = (service.name || "").toLowerCase();
  const iconStr = (service.icon || "").toLowerCase();

  if (iconStr === "stethoscope" || name.includes("counsel")) return Stethoscope;
  if (name.includes("panel")) return Syringe;
  if (name.includes("sanger") || iconStr === "droplet") return Droplet;
  if (name.includes("metagenome") || iconStr === "layers") return Layers;
  if (name.includes("phylogenetic") || name.includes("tree")) return GitFork;
  if (name.includes("pangenome") || name.includes("chart") || name.includes("data")) return BarChart2;
  if (name.includes("micro") || iconStr === "microscope") return Microscope;
  if (name.includes("docking") || name.includes("molecular") || iconStr === "flask") return FlaskConical;
  if (iconStr === "dna" || name.includes("exome") || name.includes("rna") || name.includes("seq") || name.includes("gene")) return Dna;
  return Stethoscope;
}

export default function ServicesList({
  services = [],
  onEdit,
  onDelete,
  onView,
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
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs animate-pulse space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="flex items-center gap-4 py-2">
            <div className="h-4 w-6 bg-slate-200 rounded" />
            <div className="h-8 w-8 rounded-lg bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" role="table">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1b283d] bg-slate-50/50 dark:bg-[#080d17]/60 text-slate-700 dark:text-slate-300 font-bold text-xs select-none">
              <th className="py-4 pl-6 pr-3 w-12 text-left">#</th>
              <th className="py-4 px-4 min-w-[240px]">Service</th>
              <th className="py-4 px-4 min-w-[150px]">Category</th>
              <th className="py-4 px-4 min-w-[240px]">Description</th>
              <th className="py-4 px-4 min-w-[110px]">Status</th>
              <th className="py-4 px-4 text-center min-w-[130px] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1b283d]">
            {currentServices.map((service, index) => {
              const Icon = getServiceIcon(service);
              const isActive = service.status === "Active" || service.status === "published" || !service.status;

              return (
                <tr
                  key={service.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-[#121c2e]/60 transition-colors group"
                >
                  {/* Number */}
                  <td className="py-3.5 pl-6 pr-3 text-xs font-bold text-slate-700 dark:text-slate-400">
                    {startIndex + index + 1}
                  </td>

                  {/* Service Icon & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e0f7fa] dark:bg-cyan-500/15 text-[#00bcd4] dark:text-[#0da5aa]">
                        <Icon className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <span className="font-outfit text-xs sm:text-[13px] font-bold text-[#0c2b48] dark:text-white truncate">
                        {service.name}
                      </span>
                    </div>
                  </td>

                  {/* Category Pill Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#e0f7fa] dark:bg-cyan-500/15 text-[#00838f] dark:text-cyan-300 whitespace-nowrap">
                      {service.category || "Clinical Diagnostics"}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4">
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed truncate max-w-xs xl:max-w-md">
                      {service.short_description || service.description || "Comprehensive genomics service..."}
                    </p>
                  </td>

                  {/* Status Pill Badge (• Active) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-[#e8f5e9] dark:bg-emerald-500/15 text-[#2e7d32] dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-[#2e7d32] dark:bg-emerald-400" : "bg-slate-400"
                        }`}
                      />
                      <span>{isActive ? "Active" : "Inactive"}</span>
                    </span>
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap min-w-[130px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView && onView(service)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#080d17] text-slate-600 dark:text-slate-400 border border-transparent dark:border-[#1b283d] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View service"
                        aria-label={`View ${service.name}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(service)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e0f2fe] dark:bg-cyan-500/15 text-[#0284c7] dark:text-cyan-400 border border-transparent dark:border-cyan-500/30 hover:bg-[#bae6fd] dark:hover:bg-cyan-500/25 transition-colors cursor-pointer"
                        title="Edit service"
                        aria-label={`Edit ${service.name}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(service.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe4e6] dark:bg-rose-500/15 text-[#e11d48] dark:text-rose-400 border border-transparent dark:border-rose-500/30 hover:bg-[#fecdd3] dark:hover:bg-rose-500/25 transition-colors cursor-pointer"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-[#1b283d] px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-500 dark:text-slate-400">
          Showing {services.length > 0 ? startIndex + 1 : 0} –{" "}
          {Math.min(startIndex + PAGE_SIZE, services.length)} of {services.length} services
        </span>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setPage(Math.max(1, validCurrentPage - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#0da5aa] text-white shadow-[0_0_12px_rgba(13,165,170,0.35)]"
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
            onClick={() => setPage(Math.min(totalPages, validCurrentPage + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#1b283d] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
