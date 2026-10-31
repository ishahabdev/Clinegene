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
  TestTubes,
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

export default function ServicesGrid({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-5 w-20 rounded-full bg-slate-200" />
            </div>
            <div className="h-4 w-3/4 rounded bg-slate-200 mt-3" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-12 w-full rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentServices.map((service, index) => {
          const Icon = ICON_MAP[service.icon] || Dna;
          const isActive = service.status === "Active" || !service.status;
          const hasPdf = Boolean(service.requisitionPdf);

          return (
            <div
              key={service.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200"
            >
              <div>
                {/* Top row: Icon, Category Badge & Status Dot */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#009688] group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{startIndex + index + 1}
                    </span>
                  </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold whitespace-nowrap ${getCategoryBadgeStyle(
                      service.category
                    )}`}
                  >
                    {service.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
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
                </div>
              </div>

              {/* Service Title & Subtitle */}
              <h3 className="font-outfit text-base font-bold text-slate-800 leading-snug group-hover:text-teal-900 transition-colors">
                {service.name}
              </h3>
              <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                {service.subtitle || service.tagline}
              </p>

              {/* Description */}
              <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              {/* Quick Facts Chips if available */}
              {(service.turnaroundTime || service.sampleType || hasPdf) && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10.5px]">
                  {service.turnaroundTime && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 font-medium">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{service.turnaroundTime}</span>
                    </span>
                  )}
                  {service.sampleType && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-teal-700 font-medium truncate max-w-[170px]">
                      <TestTubes className="h-3 w-3 text-teal-600" />
                      <span className="truncate">{service.sampleType}</span>
                    </span>
                  )}
                  {hasPdf && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 font-medium">
                      <FileDown className="h-3 w-3 text-blue-600" />
                      <span>PDF</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-outfit text-xs font-bold text-slate-700">
                {service.pricing}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onView && onView(service)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                  title="View details &amp; preview"
                  aria-label={`View ${service.name}`}
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit && onEdit(service)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Edit service"
                  aria-label={`Edit ${service.name}`}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

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
            </div>
          </div>
        );
      })}
      </div>

      {/* Grid Footer with Pagination matching table */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-5 py-3.5 text-xs text-slate-500 shadow-xs">
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

