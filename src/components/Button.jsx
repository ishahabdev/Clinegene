const variants = {
  // "cyan" variant = the branded primary accent button (bg & text driven by CSS vars)
  cyan: "",
  transparent: "border border-white bg-transparent text-white hover:text-black focus-visible:text-black",
  white: "border border-black bg-white text-black hover:text-white focus-visible:text-white",
};

export default function Button({
  variant = "cyan",
  href,
  children,
  className = "",
  type = "button",
  style: propStyle,   // extract style separately so we can MERGE it with accentStyle
  ...props
}) {
  const isCyan = variant === "cyan";

  // Base accent style — always applied for primary (cyan) buttons
  const accentStyle = isCyan
    ? {
        backgroundColor: "var(--accent-btn-bg, var(--accent))",
        color:           "var(--accent-btn-text, #04152b)",
        transition:      "background-color 0.4s ease-in-out, color 0.4s ease-in-out",
      }
    : {};

  // Merge: accentStyle first, then caller overrides (propStyle wins for same keys)
  const mergedStyle = { ...accentStyle, ...propStyle };

  const hasMinH = className.includes("min-h-");
  const hasPx = className.includes("px-");
  const hasTextSize = className.includes("text-");

  const classes = [
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full touch-manipulation",
    !hasMinH && "min-h-11",
    !hasPx && "px-4.5 sm:px-6",
    !hasTextSize && "text-[12px] sm:text-sm",
    "font-bold transition-all duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
    "active:scale-95 active:opacity-85",
    variants[variant] ?? variants.cyan,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Ripple overlay
  const rippleBg = variant === "transparent" ? "bg-(--accent)" : "bg-black/25";

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-full aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100 group-focus-visible:scale-100 group-active:scale-100 ${rippleBg}`}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  return href ? (
    <a className={classes} href={href} style={mergedStyle} {...props}>
      {content}
    </a>
  ) : (
    <button className={classes} type={type} style={mergedStyle} {...props}>
      {content}
    </button>
  );
}
