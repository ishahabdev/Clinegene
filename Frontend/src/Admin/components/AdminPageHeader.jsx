import { Home, Plus } from "lucide-react";

export default function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  breadcrumb = "Dashboard",
  actionLabel,
  onAction,
  actions,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Squircle Icon + Titles */}
      <div className="flex items-center gap-3.5 sm:gap-4">
        {Icon && (
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e6f8f8] text-[#088395] dark:bg-[#0da5aa] dark:text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] transition-colors">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        )}
        <div>
          <h1 className="font-outfit text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Breadcrumb & Optional Actions */}
      <div className="flex flex-col sm:items-end gap-2.5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 select-none">
          <Home className="h-3.5 w-3.5 text-slate-400" />
          <span className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Home</span>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="text-[#088395] dark:text-[#0da5aa] font-semibold">{breadcrumb}</span>
        </nav>

        {actions}

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0da5aa] hover:bg-[#088395] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_15px_rgba(13,165,170,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            {!actionLabel.trim().startsWith("+") && <Plus className="h-4 w-4 stroke-[2.5]" />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
