import { Mail } from "lucide-react";
import ScrollReveal from "../ScrollReveal.jsx";
import { DEFAULT_AVATAR } from "../../lib/imageOptimization.js";

// Single Team Member Card (Compact, clean, upright)
function TeamMemberCard({ member }) {
  const getInitials = (name = "") => {
    return (name || "")
      .split(" ")
      .filter((n) => n.length && isNaN(Number(n.replace(/[^a-zA-Z.]/g, ""))))
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(member?.name || "");

  // Ensure email uses .co instead of .pk
  const cleanEmail = member.email ? member.email.replace(/\.pk$/i, ".co") : "";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(12,43,72,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_14px_30px_rgba(12,43,72,0.12)]">
      {/* Photo Header (Clean 4:3 portrait, not over-zoomed) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        {member.image || member.image_url ? (
          <img
            src={member.image || member.image_url}
            alt={member.imageAlt || member.name}
            width={member.width || 800}
            height={member.height || 600}
            decoding="async"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (member.fallbackImage && e.currentTarget.src !== member.fallbackImage) {
                e.currentTarget.src = member.fallbackImage;
              } else {
                e.currentTarget.src = DEFAULT_AVATAR;
              }
            }}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            style={{
              objectPosition: member.imagePosition || "center",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
            <div
              className="flex h-18 w-18 items-center justify-center rounded-full text-white shadow-md"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <span className="font-['Inter'] text-xl font-bold">{initials}</span>
            </div>
          </div>
        )}

        {/* Department Badge */}
        {member.department && (
          <span
            className="absolute left-2.5 top-2.5 rounded px-2 py-0.5 font-['Inter'] text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs"
            style={{ backgroundColor: "var(--card-hero-badge-bg, rgba(12,43,72,0.85))" }}
          >
            {member.department}
          </span>
        )}

        {/* Live Active Status Indicator */}
        <div
          className="absolute bottom-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white"
          title="Active Team Member"
        >
          <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
        </div>
      </div>

      {/* Card Content (Neat & balanced padding) */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 text-left">
        <div>
          {/* Member Name */}
          <h3 className="font-serif text-[15px] sm:text-base font-bold text-[#0c2b48] line-clamp-1 transition-colors group-hover:text-(--accent-dark)">
            {member.name}
          </h3>

          {/* Role / Designation */}
          <p
            className="mt-0.5 font-['Inter'] text-[11px] font-semibold uppercase tracking-wider line-clamp-1"
            style={{ color: "var(--accent)" }}
          >
            {member.role || member.designation}
          </p>

          {/* Decorative Divider */}
          <div
            className="my-2 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-14"
            style={{ backgroundColor: "var(--accent)" }}
          />

          {/* Description / Bio / Qualifications */}
          <p className="font-['Inter'] text-[11.5px] leading-relaxed text-slate-600 line-clamp-2">
            {member.qualification || member.bio || member.description}
          </p>
        </div>

        {/* Email with .co */}
        {cleanEmail && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-start">
            <a
              href={`mailto:${cleanEmail}`}
              className="inline-flex items-center gap-1.5 font-['Inter'] text-[11px] font-medium text-slate-500 hover:text-(--accent) transition-colors"
            >
              <Mail className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{cleanEmail}</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// 3 Cards In A Row Grid Showcase (Step by step reveal)
export default function TeamCarousel({ members = [] }) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section
      className="relative py-14 pb-18 md:py-16 md:pb-22 overflow-hidden transition-colors duration-500"
      id="team-carousel"
      style={{
        backgroundColor: "color-mix(in srgb, var(--accent-soft, #f0f4f8) 70%, #e2e8f0 30%)",
      }}
    >
      {/* Diagnostic grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--accent, #10C8E0) 1px, transparent 1px),
            linear-gradient(to bottom, var(--accent, #10C8E0) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative site-container max-w-6xl">
        {/* Section Header */}
        <ScrollReveal className="mb-8 sm:mb-10 text-left">
          <p
            className="mb-2 font-['Inter'] text-[10.5px] font-bold uppercase tracking-[0.24em] transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Scientific & Clinical Experts
          </p>
          <h2 className="font-outfit text-2xl font-extrabold leading-tight text-[#0c2b48] sm:text-3xl lg:text-[38px]">
            Meet Our{" "}
            <span
              style={{
                color: "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
              Team
            </span>
          </h2>
          <p className="mt-2.5 max-w-xl font-['Inter'] text-xs sm:text-[13px] leading-relaxed text-[#4a6e8b]">
            Our multidisciplinary team combines decades of expertise in clinical diagnostics, genomic medicine,
            bioinformatics, and laboratory science.
          </p>
          <div className="mt-3.5 inline-flex items-center rounded-full bg-white px-3.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200/80">
            {members.length} Team Members
          </div>
        </ScrollReveal>

        {/* Compact 3-Cards-In-A-Row Grid with step-by-step ScrollReveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {members.map((member, index) => (
            <ScrollReveal
              key={member.name || index}
              delay={Math.min((index % 3) * 80, 240)}
              className="h-full"
            >
              <TeamMemberCard member={member} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
