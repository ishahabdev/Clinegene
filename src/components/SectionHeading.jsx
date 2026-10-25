import { useId } from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal.jsx";

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  action,
  controls,
  highlightClassName,
  descriptionClassName,
  compact = false,
  dark = false,
  center = false,
  id,
}) {
  const generatedId = useId();
  const headingId = id || generatedId;

  return (
    <ScrollReveal
      as="div"
      className={`${compact ? "mb-5" : "mb-10"} flex flex-wrap items-end justify-between gap-6 ${
        center ? "flex-col items-center text-center" : ""
      }`}
    >
      <div className={center ? "flex flex-col items-center" : "min-w-0 flex-1"}>
        <div
          className={`flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.25em] ${
            dark ? "text-[#12c5df]" : "text-[#0a7a94]"
          }`}
        >
          <span aria-hidden="true" className={`h-[2px] w-9 ${dark ? "bg-[#12c5df]" : "bg-[#12c5df]"}`} />
          {eyebrow}
          {center && <span aria-hidden="true" className={`h-[2px] w-9 ${dark ? "bg-[#12c5df]" : "bg-[#12c5df]"}`} />}
        </div>

        <h2
          className={`mt-3 font-outfit text-[32px] font-bold leading-[1.15] [text-wrap:balance] md:text-[44px] ${
            dark ? "text-white" : "text-[#0c2b48]"
          }`}
          id={headingId}
        >
          {title}{" "}
          <span className={highlightClassName || (dark ? "text-[#12c5df]" : "text-[#0891b2]")}>
            {highlight}
          </span>
        </h2>

        {description && (
          <p
            className={`mt-4 max-w-[640px] font-inter text-base leading-[1.7] ${
              dark ? "text-slate-300" : descriptionClassName || "text-[#4a6e8b]"
            } ${center ? "text-center" : ""}`}
          >
            {description}
          </p>
        )}
      </div>

      {(controls || action) && (
        <div className={`flex w-full basis-full items-center gap-2 sm:w-auto sm:basis-auto ${center ? "justify-center" : "justify-end sm:ml-auto"}`}>
          {controls}
          {action && (
            <a
              className={`group inline-flex w-fit items-center gap-2.5 font-inter text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] ${
                dark ? "text-[#12c5df] hover:text-white" : "text-[#0a7a94] hover:text-[#0c2b48]"
              }`}
              href={action.href}
            >
              {action.label}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
              />
            </a>
          )}
        </div>
      )}
    </ScrollReveal>
  );
}
