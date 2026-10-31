import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    id,
    className = "",
    required = false,
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block mb-1.5 font-inter text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? "true" : "false"}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2 pr-9 font-inter text-sm text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-rose-400 focus:border-rose-500"
              : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 focus:border-[#b91c1c]"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error ? (
        <p className="mt-1 font-inter text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 font-inter text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;

