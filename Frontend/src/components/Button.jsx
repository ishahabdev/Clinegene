const variants = {
  // "cyan" variant = the branded primary accent button (bg & text driven by CSS vars)
  cyan: "",
  transparent: "border border-white bg-transparent text-white hover:text-white focus-visible:text-white",
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
    "font-bold hover:text-white! focus-visible:text-white!",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
    "active:scale-95 active:opacity-85",
    variants[variant] ?? variants.cyan,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Ripple overlay: bubble starts as a small circle in center and spreads slowly across whole button
  const rippleBg = "bg-black";

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full group-hover:scale-100 group-focus-visible:scale-100 group-active:scale-100 ${rippleBg}`}
        style={{
          transition: "transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          willChange: "transform",
        }}
      />
      <span
        className="relative z-10 inline-flex items-center gap-2 group-hover:text-white! group-focus-visible:text-white!"
        style={{
          transition: "color 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {children}
      </span>
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
