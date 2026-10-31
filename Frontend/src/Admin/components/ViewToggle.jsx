import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({
  mode = "grid",
  onChange,
  className = "",
}) {
  return (
    <div
      role="group"
      aria-label="View mode toggle"
      className={`inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 shadow-2xs ${className}`}
    >
      <button
        type="button"
        role="button"
        aria-label="Grid view"
        aria-pressed={mode === "grid"}
        title="Grid view"
        onClick={() => onChange && onChange("grid")}
        className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#009688] cursor-pointer ${
          mode === "grid"
            ? "bg-[#009688] text-white shadow-xs font-semibold"
            : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
        }`}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        role="button"
        aria-label="List view"
        aria-pressed={mode === "list"}
        title="List view"
        onClick={() => onChange && onChange("list")}
        className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#009688] cursor-pointer ${
          mode === "list"
            ? "bg-[#009688] text-white shadow-xs font-semibold"
            : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
        }`}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

