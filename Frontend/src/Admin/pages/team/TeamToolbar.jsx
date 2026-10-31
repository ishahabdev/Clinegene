import { Search, ChevronDown, LayoutGrid } from "lucide-react";
import ViewToggle from "../../components/ViewToggle.jsx";

export default function TeamToolbar({
  searchTerm = "",
  onSearchChange,
  selectedDept = "All Departments",
  onDeptChange,
  departments = [],
  viewMode = "list",
  onViewModeChange,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 sm:p-3 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search team members by name, role, email..."
          className="w-full rounded-lg border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Right Controls: Department Filter + View Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="relative min-w-[170px] sm:w-52">
          <LayoutGrid className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#009688]" />
          <select
            value={selectedDept}
            onChange={(e) => onDeptChange && onDeptChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs font-semibold text-slate-700 hover:border-[#009688] focus:border-[#009688] focus:outline-none cursor-pointer transition-colors"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        {/* View Toggle (Grid / List) */}
        {onViewModeChange && (
          <ViewToggle mode={viewMode} onChange={onViewModeChange} />
        )}
      </div>
    </div>
  );
}
