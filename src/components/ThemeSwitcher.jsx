import { useEffect, useRef, useState } from "react";
import { THEMES, useTheme } from "../context/ThemeContext";

function PaletteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4.5 w-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
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
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger button */}
      <button
        aria-label="Change color theme"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="group grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-white hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        style={{ transition: "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease" }}
      >
        {/* Live swatch ring */}
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-0 ring-2 ring-offset-1"
          style={{ ringColor: "var(--accent)" }}
        />
        <PaletteIcon />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Color theme options"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.12)] animate-in"
          style={{ animation: "theme-dropdown-in 0.18s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Color Theme
          </p>
          <ul className="px-2 pb-2 pt-1 space-y-1">
            {Object.entries(THEMES).map(([id, config]) => {
              const active = theme === id;
              return (
                <li key={id}>
                  <button
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => { setTheme(id); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {/* Color swatch circle */}
                    <span
                      className="relative h-5 w-5 shrink-0 rounded-full ring-2 ring-offset-2"
                      style={{
                        background: config.swatch,
                        ringColor: active ? config.swatch : "transparent",
                      }}
                    >
                      {active && (
                        <svg
                          className="absolute inset-0 h-full w-full text-white"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="m5 10 3.5 3.5 6.5-7"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </span>
                    <span>{config.label}</span>
                    {active && (
                      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-slate-400">
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
