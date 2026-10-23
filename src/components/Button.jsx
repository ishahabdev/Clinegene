const variants = {
  cyan: "bg-[#10c8e0] text-[#04152b] hover:text-white focus-visible:text-white",
  transparent: "border border-white bg-transparent text-white hover:text-black focus-visible:text-black",
  white: "border border-black bg-white text-black hover:text-white focus-visible:text-white",
};

export default function Button({
  variant = "cyan",
  href,
  children,
  className = "",
  type = "button",
  ...props
}) {
  const classes = `group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-5 text-xs font-bold transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10c8e0] active:text-white sm:px-6 sm:text-sm ${variants[variant] || variants.cyan} ${className}`;
  const content = (
    <>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-full aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100 group-focus-visible:scale-100 group-active:scale-100 ${variant === "transparent" ? "bg-[#10c8e0]" : "bg-black"}`}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  return href ? (
    <a className={classes} href={href} {...props}>
      {content}
    </a>
  ) : (
    <button className={classes} type={type} {...props}>
      {content}
    </button>
  );
}
