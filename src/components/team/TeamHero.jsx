import ScrollReveal from "../ScrollReveal.jsx";
import teamPhoto from "../../assets/team.png";
import { companyStats } from "../../data/teamConfig.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function TeamHero() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const sectionBg = isRed ? "#2d0306" : isGreen ? "#021e12" : "#02132a";

  const overlayGradient = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(2, 19, 42, 0.97) 0%, rgba(2, 19, 42, 0.84) 48%, rgba(2, 19, 42, 0.30) 80%, rgba(2, 19, 42, 0.15) 100%)";

  return (
    <section
      aria-labelledby="team-hero-title"
      className="relative isolate min-h-[38vh] overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[46vh] z-[1] transition-colors duration-500"
      id="team-hero"
      style={{ backgroundColor: sectionBg }}
    >
      {/* Full-screen background image — same team picture recolored with theme */}
      <img
        alt="ClinGene team collaborating in laboratory environment"
        width="1920"
        height="1080"
        loading="eager"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-all duration-500"
        src={teamPhoto}
        style={{
          filter: isRed
            ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
            : isGreen
              ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
              : "none",
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-all duration-500"
        style={{
          background: overlayGradient,
        }}
      />

      {/* Text content */}
      <div className="relative flex min-h-[38vh] items-center sm:min-h-[42vh] lg:min-h-[46vh]">
        <div className="site-container py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <ScrollReveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-[14px] sm:text-[15px]">
                  <li>
                    <a 
                      href="/" 
                      className="transition-colors hover:underline rounded"
                      style={{ color: "var(--accent)" }}
                    >
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true" className="text-slate-400">›</li>
                  <li className="text-slate-300" aria-current="page">Our Team</li>
                </ol>
              </nav>
            </ScrollReveal>

            {/* Eyebrow with decorative line */}
            <ScrollReveal delay={50}>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-0.5 w-12 transition-colors"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden="true"
                />
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.2em] sm:text-[12px] transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  OUR TEAM
                </p>
              </div>
            </ScrollReveal>

            {/* Main heading */}
            <ScrollReveal delay={100}>
              <h1
                className="font-['Inter'] text-[36px] font-bold leading-[1.1] tracking-tight sm:text-[44px] md:text-[52px] lg:text-[58px]"
                id="team-hero-title"
              >
                The Minds Behind{" "}
                <span
                  style={{
                    color: isRed ? "#ef4444" : "var(--accent)",
                    transition: "color 0.4s ease-in-out",
                  }}
                >
                  ClinGene
                </span>
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={150}>
              <p className="mt-3 max-w-125 text-sm sm:text-base leading-6 text-slate-200 sm:mt-4">
                We are a team of passionate scientists, researchers, and innovators
                united by a shared mission — to advance genomic science and
                create a healthier tomorrow.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={200}>
              <div className="mt-6 flex flex-wrap gap-8 sm:gap-12" role="list">
                <div className="flex items-center gap-3" role="listitem">
                  <div
                    className="flex h-10 w-10 items-center justify-center transition-colors"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">{companyStats.teamMembers}</div>
                    <div className="mt-1 text-[14px] text-slate-400">Team Members</div>
                  </div>
                </div>

                <div className="flex items-center gap-3" role="listitem">
                  <div
                    className="flex h-10 w-10 items-center justify-center transition-colors"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">{companyStats.departments}</div>
                    <div className="mt-1 text-[14px] text-slate-400">Departments</div>
                  </div>
                </div>

                <div className="flex items-center gap-3" role="listitem">
                  <div
                    className="flex h-10 w-10 items-center justify-center transition-colors"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">{companyStats.yearsExperience}</div>
                    <div className="mt-1 text-[14px] text-slate-400">Years Experience</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

    </section>
  );
}
