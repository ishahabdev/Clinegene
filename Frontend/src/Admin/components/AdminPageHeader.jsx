import { Home } from "lucide-react";

export default function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  breadcrumb = "Dashboard",
  actionLabel,
  onAction,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Teal Circle Icon + Titles */}
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#009688] text-white shadow-xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="font-outfit text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Breadcrumb & Optional Top Action Button */}
      <div className="flex flex-col sm:items-end gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 select-none">
          <Home className="h-3.5 w-3.5 text-slate-400" />
          <span>Home</span>
          <span>›</span>
          <span className="text-teal-700 font-medium">{breadcrumb}</span>
        </nav>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#009688] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00897b] transition-all cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

