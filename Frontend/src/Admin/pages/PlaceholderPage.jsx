import { ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";

export default function PlaceholderPage({
  title = "Module",
  phase = "Active",
  description = "This module is configured and active in the Health Admin Portal.",
  onNavigate,
}) {
  return (
    <div>
      <AdminPageHeader
        title={title}
        subtitle="Clinical Management System"
        breadcrumb={title}
      />

      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-[#009688] mb-4">
          <Clock className="h-7 w-7" />
        </div>

        <h3 className="font-outfit text-lg font-bold text-slate-800">
          {title} Management
        </h3>
        <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <span>{phase}</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate("/admin")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
