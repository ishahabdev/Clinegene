import { Search, ChevronDown, Filter } from "lucide-react";
import ViewToggle from "../../components/ViewToggle.jsx";

export default function ServicesToolbar({
  searchTerm = "",
  onSearchChange,
  selectedCategory = "All Categories",
  onCategoryChange,
  categories = [],
  categoryCounts = {},
  totalCount = 0,
  viewMode = "list",
  onViewModeChange,
}) {
  return (
    <div className="space-y-3 mb-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search services by name, description, or category..."
            className="w-full rounded-md border-0 bg-transparent pl-9 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Right Controls: Category Dropdown, Filter Button & View Mode Toggle */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Dropdown */}
          <div className="relative w-44 sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-slate-700 focus:border-[#009688] focus:outline-none cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => onCategoryChange && onCategoryChange("All Categories")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter</span>
          </button>

          {/* View Toggle (Grid / List) */}
          <ViewToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {/* Category Filter Pills (Exact match to screenshot) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => onCategoryChange && onCategoryChange("All Categories")}
          className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer ${
            selectedCategory === "All Categories"
              ? "bg-[#009688] text-white shadow-xs font-bold"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All Services ({totalCount})
        </button>

        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange && onCategoryChange(cat)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer ${
                isActive
                  ? "bg-[#009688] text-white shadow-xs font-bold"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

