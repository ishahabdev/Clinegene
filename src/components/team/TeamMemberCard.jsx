import { ExternalLink, Mail, UserRound, Sparkles } from "lucide-react";

const departmentLabels = {
  leadership: "Leadership",
  genetics: "Human Genetics",
  laboratory: "Laboratory Sciences",
  bioinformatics: "Bioinformatics",
  computational: "Computational Biology",
  training: "Training & Outreach",
};

const departmentColors = {
  leadership: {
    gradient: "from-[#10c8e0] to-[#0a7a94]",
    bg: "bg-[#e5f8fb]",
    text: "text-[#0a7a94]",
    border: "border-[#10c8e0]",
    glow: "rgba(16, 200, 224, 0.2)",
  },
  genetics: {
    gradient: "from-[#0a7a94] to-[#031b37]",
    bg: "bg-[#e0f2f7]",
    text: "text-[#0a7a94]",
    border: "border-[#0a7a94]",
    glow: "rgba(10, 122, 148, 0.2)",
  },
  laboratory: {
    gradient: "from-[#079bb0] to-[#10c8e0]",
    bg: "bg-[#d4f3f7]",
    text: "text-[#079bb0]",
    border: "border-[#079bb0]",
    glow: "rgba(7, 155, 176, 0.2)",
  },
  bioinformatics: {
    gradient: "from-[#0c2b48] to-[#0a7a94]",
    bg: "bg-[#dae8f2]",
    text: "text-[#0c2b48]",
    border: "border-[#0c2b48]",
    glow: "rgba(12, 43, 72, 0.2)",
  },
  computational: {
    gradient: "from-[#10c8e0] to-[#079bb0]",
    bg: "bg-[#d9f5f9]",
    text: "text-[#079bb0]",
    border: "border-[#10c8e0]",
    glow: "rgba(16, 200, 224, 0.25)",
  },
  training: {
    gradient: "from-[#0a7a94] to-[#0c2b48]",
    bg: "bg-[#dce9f0]",
    text: "text-[#0a7a94]",
    border: "border-[#0a7a94]",
    glow: "rgba(10, 122, 148, 0.2)",
  },
};

function Avatar({ name, department }) {
  const initials = name
    .split(" ")
    .filter((n) => n.length && isNaN(Number(n.replace(/[^a-zA-Z.]/g, ""))))
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  
  const deptColors = departmentColors[department] || departmentColors.leadership;

  return (
    <div
      className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg"
      aria-label={`Portrait of ${name}`}
      role="img"
    >
      {/* Animated gradient background */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${deptColors.gradient} transition-all duration-500 group-hover:scale-110`}
      />
      
      {/* Shimmer effect on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
      />
      
      {/* DNA helix pattern overlay */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-10"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M20 20 Q 35 35 50 50 T 80 80 M20 80 Q 35 65 50 50 T 80 20"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="2" fill="white" />
        <circle cx="50" cy="50" r="2" fill="white" />
        <circle cx="80" cy="80" r="2" fill="white" />
      </svg>

      {initials ? (
        <span className="relative z-10 font-outfit text-[36px] font-extrabold text-white drop-shadow-lg">
          {initials}
        </span>
      ) : (
        <UserRound
          aria-hidden="true"
          className="relative z-10 h-16 w-16 text-white drop-shadow-lg"
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}

function SocialLink({ label, href, icon: Icon, colorClass = "" }) {
  return (
    <a
      aria-label={label}
      className={`group/social relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] motion-reduce:transform-none ${colorClass}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon
        aria-hidden="true"
        className="h-4.5 w-4.5 transition-transform duration-300 group-hover/social:scale-110"
        strokeWidth={2}
      />
    </a>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4.5 w-4.5 fill-current ${className || ""}`}
      viewBox="0 0 24 24"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.83-3.04-1.83 0-2.1 1.43-2.1 2.94v5.63h-3.56V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.66 0 4.34 2.41 4.34 5.53v6.21z" />
      <circle cx="5.34" cy="12.05" r="1.62" />
      <path d="M6.95 4.93a1.62 1.62 0 11-.01 3.24 1.62 1.62 0 01.01-3.24z" />
    </svg>
  );
}

function ORCIDIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4.5 w-4.5 fill-current ${className || ""}`}
      viewBox="0 0 24 24"
    >
      <path d="M14.5 11.51c0 .89-.72 1.61-1.61 1.61S11.3 12.4 11.3 11.51c0-.89.72-1.61 1.61-1.61s1.6 1.72 1.6 3.71zM9.5 9.01c.68 0 1.23.58 1.23 1.3 0 .73-.55 1.31-1.23 1.31s-1.23-.58-1.23-1.31c0-.72.56-1.3 1.23-1.3zm-2.5 2.5c0 1.34.84 2.46 2.07 2.91v1.39l-.37.24v2.92h5v-2.92l-.37-.24v-1.39c1.23-.44 2.07-1.57 2.07-2.91 0-1.66-1.14-3-2.5-3.41v2.87c-.34-.31-.76-.48-1.2-.48-.44 0-.86.17-1.2.48V8.1c-1.36.41-2.5 1.75-2.5 3.41zm-2-2.5v6.8h6v-1.46c0-.72.16-1.42.43-2.08-.95-.36-1.58-1.22-1.58-2.18 0-.15.02-.31.05-.46-.14.05-.29.07-.45.07-1.03 0-1.87-.84-1.87-1.87s.84-1.87 1.87-1.87c.78 0 1.45.52 1.7 1.24l.05.16c.65.27 1.08.89 1.19 1.62.55-.41 1.19-.62 1.85-.62.95 0 1.81.38 2.47 1v-2.55h3.66c.74 0 1.34.6 1.34 1.34v7.16c0 .74-.6 1.34-1.34 1.34H5c-.74 0-1.34-.6-2.34-1.34V7.75c0-.74.6-1.34 1.34-1.34h1.16z" />
    </svg>
  );
}

export default function TeamMemberCard({ member }) {
  const {
    name,
    designation,
    department,
    details = [],
    bio,
    expertise = [],
    social,
  } = member;

  const deptColors = departmentColors[department] || departmentColors.leadership;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#d4e5f2] bg-white shadow-[0_8px_24px_rgba(29,78,116,0.06)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(12,43,72,0.18)] motion-reduce:transform-none motion-reduce:transition-none"
      tabIndex={0}
    >
      {/* Animated gradient border effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:opacity-0"
        style={{
          background: `linear-gradient(135deg, ${deptColors.glow}, transparent 70%)`,
          padding: '2px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Top decorative accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${deptColors.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

      {/* Content wrapper */}
      <div className="relative flex flex-col p-6">
        {/* Avatar and header section */}
        <div className="flex flex-col items-center text-center">
          <Avatar name={name} department={department} />
          
          <div className="mt-5 w-full">
            <h3 className="font-outfit text-[20px] font-extrabold leading-tight text-[#0c2b48] sm:text-[22px]">
              {name}
            </h3>
            <p className={`mt-2 text-[14px] font-bold ${deptColors.text}`}>
              {designation}
            </p>
            
            {/* Department badge */}
            <div className="mt-3 flex justify-center">
              <span className={`inline-flex items-center gap-2 rounded-full ${deptColors.bg} px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.05em] ${deptColors.text}`}>
                <Sparkles aria-hidden="true" className="h-3 w-3" />
                {departmentLabels[department] || department}
              </span>
            </div>
          </div>
        </div>

        {/* Details section */}
        {details.length > 0 && (
          <div className="mt-5 space-y-2 border-t border-[#e8f2f7] pt-4">
            {details.map((detail) => (
              <div key={detail} className="flex items-start gap-2">
                <svg
                  aria-hidden="true"
                  className={`mt-0.5 h-4 w-4 shrink-0 ${deptColors.text}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[12px] leading-[1.6] text-[#4a6e8b]">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bio section with gradient fade */}
        {bio && (
          <div className="relative mt-5 flex-1">
            <p className="text-[13px] leading-[1.75] text-slate-600">
              {bio}
            </p>
            {/* Subtle bottom fade for long text */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-30"
            />
          </div>
        )}

        {/* Expertise tags removed per user request */}

        {/* Social links with enhanced hover effects */}
        {social && (
          <div className="mt-6 flex items-center justify-center gap-3 border-t border-[#e8f2f7] pt-5">
            {social.email && (
              <a
                aria-label={`Email ${name}`}
                className={`group/social relative grid h-10 w-10 place-items-center rounded-full border ${deptColors.border} ${deptColors.text} transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-gradient-to-br ${deptColors.gradient} hover:text-white hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a7a94] motion-reduce:transform-none`}
                href={`mailto:${social.email}`}
              >
                <Mail
                  aria-hidden="true"
                  className="h-4.5 w-4.5 transition-transform duration-300 group-hover/social:scale-110"
                  strokeWidth={2}
                />
              </a>
            )}
            {social.linkedin && (
              <SocialLink
                colorClass={`border-${deptColors.border} ${deptColors.text} hover:border-transparent hover:bg-gradient-to-br ${deptColors.gradient} hover:text-white hover:shadow-lg`}
                href={social.linkedin}
                icon={LinkedInIcon}
                label={`LinkedIn profile for ${name}`}
              />
            )}
            {social.orcid && (
              <SocialLink
                colorClass={`border-${deptColors.border} ${deptColors.text} hover:border-transparent hover:bg-gradient-to-br ${deptColors.gradient} hover:text-white hover:shadow-lg`}
                href={social.orcid}
                icon={ORCIDIcon}
                label={`ORCID profile for ${name}`}
              />
            )}
            {social.website && (
              <SocialLink
                colorClass={`border-${deptColors.border} ${deptColors.text} hover:border-transparent hover:bg-gradient-to-br ${deptColors.gradient} hover:text-white hover:shadow-lg`}
                href={social.website}
                icon={ExternalLink}
                label={`${name}'s website`}
              />
            )}
          </div>
        )}

        {/* Bottom decorative element */}
        <div
          aria-hidden="true"
          className={`mt-5 h-1 w-16 mx-auto rounded-full bg-gradient-to-r ${deptColors.gradient} opacity-0 transition-all duration-500 group-hover:w-24 group-hover:opacity-100`}
        />
      </div>

      {/* Floating particles effect on hover */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute left-[10%] top-[15%] h-2 w-2 rounded-full bg-[#10c8e0]/30 blur-sm" style={{ animation: 'float 3s ease-in-out infinite' }} />
        <div className="absolute right-[15%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#0a7a94]/40 blur-sm" style={{ animation: 'float 4s ease-in-out infinite 0.5s' }} />
        <div className="absolute left-[20%] bottom-[20%] h-1 w-1 rounded-full bg-[#10c8e0]/20 blur-sm" style={{ animation: 'float 3.5s ease-in-out infinite 1s' }} />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </article>
  );
}
