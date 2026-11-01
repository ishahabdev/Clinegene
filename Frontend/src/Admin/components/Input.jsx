import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    rightElement,
    id,
    type = "text",
    className = "",
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 font-inter text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? "true" : "false"}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 font-inter text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0da5aa]/20 dark:bg-[#080d17] dark:text-slate-100 dark:placeholder:text-slate-500 ${
            Icon ? "pl-10" : ""
          } ${
            rightElement ? "pr-10" : ""
          } ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-300 hover:border-slate-400 dark:border-[#1b283d] dark:hover:border-[#283b54] focus:border-[#0da5aa]"
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 font-inter text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 font-inter text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;

