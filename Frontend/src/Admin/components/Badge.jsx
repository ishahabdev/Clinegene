export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}) {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  const variantClasses = {
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    warning:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    danger:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    info:
      "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    crimson:
      "bg-rose-50 text-[#b91c1c] border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 font-semibold",
    neutral:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  // Map common strings to variants if needed
  let resolvedVariant = variant;
  if (children === "Published" || children === "Active" || children === "Hired") {
    resolvedVariant = "success";
  } else if (children === "Draft" || children === "Scheduled") {
    resolvedVariant = "warning";
  } else if (children === "Closed" || children === "Rejected") {
    resolvedVariant = "danger";
  } else if (children === "New" || children === "Interviewed" || children === "Shortlisted") {
    resolvedVariant = "info";
  }

  return (
    <span
      className={`inline-flex items-center font-inter font-medium rounded-full ${
        sizeClasses[size] || sizeClasses.sm
      } ${variantClasses[resolvedVariant] || variantClasses.neutral} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {children}
    </span>
  );
}

