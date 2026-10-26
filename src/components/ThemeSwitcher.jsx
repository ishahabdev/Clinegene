import { useEffect, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { THEMES, useTheme } from "../context/ThemeContext";

function PaletteIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879a2.5 2.5 0 0 0 2.895-2.732c-.08-.72.39-1.397 1.11-1.547a4.5 4.5 0 0 1 5.377 3.093c.12.35.485.557.854.498A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
      {/* ClinGene Cyan paint dot */}
      <circle cx="8" cy="9" r="1.6" fill="#10c8e0" stroke="none" />
      {/* ClinGene Emerald paint dot */}
      <circle cx="12.5" cy="7.5" r="1.6" fill="#10b981" stroke="none" />
      {/* ClinGene Crimson paint dot */}
      <circle cx="16.5" cy="10.5" r="1.6" fill="#b91c1c" stroke="none" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger button */}
      <button
        type="button"
        aria-label="Change color theme"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`group relative grid h-10 w-10 place-items-center rounded-full border bg-white/95 text-slate-700 shadow-[0_2px_8px_rgba(12,43,72,0.06)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:shadow-[0_4px_18px_var(--accent-glow)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
          open
            ? "border-(--accent) ring-2 ring-(--accent)/30 shadow-[0_4px_18px_var(--accent-glow)]"
            : "border-slate-200 hover:border-(--accent)"
        }`}
      >
        <PaletteIcon
          className={`h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open
              ? "scale-110 -rotate-12"
              : "group-hover:scale-110 group-hover:rotate-6"
          }`}
        />

        {/* Live active theme badge dot */}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(12,43,72,0.25)] transition-colors duration-500"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="menu"
          aria-label="Color theme options"
          className="absolute right-0 top-full z-50 mt-2.5 w-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-[0_16px_40px_rgba(12,43,72,0.14),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          style={{
            animation: "theme-dropdown-in 0.2s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-3 pb-2 pt-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3 w-3 text-(--accent)" />
              Color Theme
            </span>
            <span className="text-[10px] font-semibold text-slate-400">3 Themes</span>
          </div>

          {/* Theme options list */}
          <ul className="mt-1.5 space-y-1">
            {Object.entries(THEMES).map(([id, config]) => {
              const active = theme === id;
              const descriptions = {
                cyan: "Oceanic Cyan",
                green: "Emerald Teal",
                red: "Crimson Red",
              };
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setTheme(id);
                      setOpen(false);
                    }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                      active
                        ? "bg-slate-50/90 shadow-[inset_0_0_0_1px_rgba(12,43,72,0.08)]"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Color swatch circle with glow */}
                    <span
                      className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${
                        active ? "ring-2 ring-offset-2 ring-offset-white" : ""
                      }`}
                      style={{
                        backgroundColor: config.swatch,
                        boxShadow: `0 2px 8px ${config["--accent-glow"]}`,
                      }}
                    >
                      {active && (
                        <Check
                          className="h-3.5 w-3.5 text-white"
                          strokeWidth={2.8}
                        />
                      )}
                    </span>

                    {/* Text info */}
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold leading-tight ${
                          active ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {config.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {descriptions[id] || "ClinGene Accent"}
                      </span>
                    </div>

                    {/* Active pill */}
                    {active && (
                      <span
                        className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: config["--accent-soft"],
                          color: config["--accent-muted"],
                        }}
                      >
                        Active
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
