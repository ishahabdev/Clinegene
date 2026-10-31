import { Search, ChevronDown, Filter, List, LayoutGrid } from "lucide-react";

export default function ServicesToolbar({
  searchTerm = "",
  onSearchChange,
  selectedCategory = "All Categories",
  onCategoryChange,
  categories = [],
  viewMode = "list",
  onViewModeChange,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 shadow-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search services..."
          className="w-full bg-transparent pl-7 pr-4 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Right Controls: Category Dropdown, Filter Button, View Mode Toggle */}
      <div className="flex items-center gap-2.5 self-end md:self-auto">
        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 pr-9 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => onCategoryChange && onCategoryChange("All Categories")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filter</span>
        </button>

        {/* View Mode Toggle: List & Grid */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewModeChange && onViewModeChange("list")}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-[#00695c] text-white shadow-xs"
                : "border border-slate-200/90 bg-white text-slate-400 hover:text-slate-700 shadow-xs"
            }`}
            title="List view"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange && onViewModeChange("grid")}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#00695c] text-white shadow-xs"
                : "border border-slate-200/90 bg-white text-slate-400 hover:text-slate-700 shadow-xs"
            }`}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
