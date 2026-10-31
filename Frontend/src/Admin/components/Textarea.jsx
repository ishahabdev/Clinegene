import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    id,
    rows = 3,
    className = "",
    required = false,
    ...props
  },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block mb-1.5 font-inter text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? "true" : "false"}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 font-inter text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 focus:border-[#b91c1c]"
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1 font-inter text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 font-inter text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;

