/**
 * Reusable Container component.
 * Single source of truth for horizontal page constraints and responsive padding.
 * Matches Home page spacing:
 * - max-width: 1280px (--container-max-width)
 * - margin-inline: auto
 * - responsive padding-inline: 1.25rem (20px) on mobile, 2rem (32px) on >=640px
 */
export default function Container({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Component className={`site-container ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

