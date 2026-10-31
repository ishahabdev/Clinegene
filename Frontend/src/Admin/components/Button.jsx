import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "crimson",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-inter font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none";

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 gap-1.5 min-h-8",
    md: "text-sm px-4 py-2 gap-2 min-h-10",
    lg: "text-base px-6 py-2.5 gap-2.5 min-h-12",
  };

  const variantClasses = {
    crimson:
      "bg-[#b91c1c] text-white hover:bg-[#991b1b] focus-visible:ring-[#b91c1c] shadow-[0_4px_14px_rgba(185,28,28,0.25)]",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400",
    outline:
      "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:ring-[#b91c1c]",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm",
    ghost:
      "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-slate-400",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.crimson} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}

