import React from "react";

const variantClassMap = {
  cyan: "btn-bubble--cyan",
  primary: "btn-bubble--primary",
  blue: "btn-bubble--blue",
  red: "btn-bubble--red",
  danger: "btn-bubble--red",
  dark: "btn-bubble--dark",
  secondary: "btn-bubble--dark",
  black: "btn-bubble--dark",
  outline: "btn-bubble--outline",
  transparent: "btn-bubble--outline",
  "outline-dark": "btn-bubble--outline-dark",
  white: "btn-bubble--white",
};

function isArrowChild(child) {
  if (!React.isValidElement(child)) {
    if (typeof child === "string") {
      const trimmed = child.trim();
      return trimmed === "→" || trimmed === "->" || trimmed === "←" || trimmed === "<-";
    }
    return false;
  }

  const cls = String(child.props?.className || "");
  if (cls.split(/\s+/).includes("arrow")) return false;

  const name =
    child.type?.displayName ||
    child.type?.name ||
    child.type?.render?.displayName ||
    child.type?.render?.name ||
    "";
  if (typeof name === "string" && (name.includes("Arrow") || name.includes("Chevron"))) {
    return true;
  }

  if (typeof child.props?.children === "string") {
    const t = child.props.children.trim();
    if (t === "→" || t === "->" || t === "←" || t === "<-") {
      return true;
    }
  }

  return false;
}

function wrapChildren(children) {
  return React.Children.map(children, (child) => {
    if (isArrowChild(child)) {
      return <span className="arrow">{child}</span>;
    }
    return child;
  });
}

export default function Button({
  variant = "cyan",
  href,
  children,
  className = "",
  type = "button",
  style,
  ...props
}) {
  const bubbleVariantClass = variantClassMap[variant] || variantClassMap.cyan;

  const hasMinH = className.includes("min-h-");
  const hasPx = className.includes("px-");
  const hasTextSize = className.includes("text-");

  // Neutralize and strip any conflicting transitions, durations, or hover utilities from callers
  const cleanClassName = className
    .split(/\s+/)
    .filter(
      (c) =>
        !c.startsWith("transition") &&
        !c.startsWith("duration-") &&
        !c.startsWith("ease-") &&
        !c.startsWith("hover:bg-") &&
        !c.startsWith("hover:text-") &&
        !c.startsWith("hover:shadow") &&
        !c.startsWith("hover:border") &&
        !c.startsWith("hover:brightness") &&
        !c.startsWith("focus-visible:text-") &&
        !c.startsWith("group-hover:text-") &&
        !c.startsWith("group-hover:translate")
    )
    .join(" ");

  const classes = [
    "btn-bubble",
    bubbleVariantClass,
    !hasMinH && "min-h-11",
    !hasPx && "px-4.5 sm:px-6",
    !hasTextSize && "text-[12px] sm:text-sm",
    "font-bold select-none",
    cleanClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span className="btn-label">
      {wrapChildren(children)}
    </span>
  );

  return href ? (
    <a className={classes} href={href} style={style} {...props}>
      {content}
    </a>
  ) : (
    <button className={classes} type={type} style={style} {...props}>
      {content}
    </button>
  );
}
