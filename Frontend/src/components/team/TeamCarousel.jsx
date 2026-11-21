import { Mail } from "lucide-react";
import ScrollReveal from "../ScrollReveal.jsx";
import { DEFAULT_AVATAR } from "../../lib/imageOptimization.js";

// Single Team Member Card (Clean, upright, premium card)
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

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(12,43,72,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-(--accent) hover:shadow-[0_16px_36px_rgba(12,43,72,0.12)]">
      {/* Photo Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        {member.image || member.image_url ? (
          <img
            src={member.image || member.image_url}
            alt={member.imageAlt || member.name}
            width={member.width || 800}
            height={member.height || 800}
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              objectPosition: member.imagePosition || "center 20%",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-md"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <span className="font-['Inter'] text-2xl font-bold">{initials}</span>
            </div>
          </div>
        )}

        {/* Department Badge */}
        {member.department && (
          <span
            className="absolute left-3 top-3 rounded-md px-2.5 py-1 font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs"
            style={{ backgroundColor: "var(--card-hero-badge-bg, rgba(12,43,72,0.85))" }}
          >
            {member.department}
          </span>
        )}

        {/* Live Active Status Indicator */}
        <div
          className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white"
          title="Active Team Member"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 text-center">
        <div>
          {/* Member Name */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0c2b48] line-clamp-1 transition-colors group-hover:text-(--accent-dark)">
            {member.name}
          </h3>

          {/* Role / Designation */}
          <p
            className="mt-1 font-['Inter'] text-xs font-semibold uppercase tracking-wider line-clamp-1"
            style={{ color: "var(--accent)" }}
          >
            {member.role || member.designation}
          </p>

          {/* Decorative Divider */}
          <div
            className="mx-auto my-2.5 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-16"
            style={{ backgroundColor: "var(--accent)" }}
          />

          {/* Description / Bio / Qualifications */}
          <p className="font-['Inter'] text-xs leading-relaxed text-slate-600 line-clamp-3">
            {member.qualification || member.bio || member.description}
          </p>
        </div>

        {/* Email or Action Link */}
        {member.email && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 font-['Inter'] text-xs font-semibold text-slate-500 hover:text-(--accent) transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{member.email}</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// 3 Cards In A Row Grid Showcase (Step by step scroll reveal, no sliding)
export default function TeamCarousel({ members = [] }) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-white py-12 pb-16 md:py-16 md:pb-24 overflow-hidden" id="team-carousel">
      {/* Diagnostic grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10C8E0 1px, transparent 1px),
            linear-gradient(to bottom, #10C8E0 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative site-container">
        {/* Section Header */}
        <ScrollReveal className="mb-10 sm:mb-12 text-center">
          <p
            className="mb-2 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.24em] transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Scientific & Clinical Experts
          </p>
          <h2 className="font-outfit text-3xl font-extrabold leading-tight text-[#0c2b48] sm:text-4xl lg:text-[42px]">
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
          <p className="mx-auto mt-3 max-w-2xl font-['Inter'] text-sm leading-relaxed text-[#4a6e8b]">
            Our multidisciplinary team combines decades of expertise in clinical diagnostics, genomic medicine,
            bioinformatics, and laboratory science.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600">
            {members.length} Team Members
          </div>
        </ScrollReveal>

        {/* 3-Cards-In-A-Row Grid with step-by-step ScrollReveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {members.map((member, index) => (
            <ScrollReveal
              key={member.name || index}
              delay={Math.min((index % 3) * 100, 300)}
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
