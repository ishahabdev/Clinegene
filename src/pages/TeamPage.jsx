import { ArrowRight, Users, Award, TrendingUp, Target } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import TeamHero from "../components/team/TeamHero.jsx";
import LeadershipSection from "../components/team/LeadershipSection.jsx";
import TeamCarousel from "../components/team/TeamCarousel.jsx";
import { carouselMembers } from "../data/team.js";
import teamPhoto from "../assets/team.png";
import { useTheme } from "../context/ThemeContext.jsx";

const stats = [
  {
    icon: Users,
    value: "9+",
    label: "Team Members",
    color: "from-[#10c8e0] to-[#0a7a94]"
  },
  {
    icon: Award,
    value: "5",
    label: "Departments",
    color: "from-[#0e8fae] to-[#08536a]"
  },
  {
    icon: TrendingUp,
    value: "5+",
    label: "Years Experience",
    color: "from-[#10c8e0] to-[#0e8fae]"
  },
  {
    icon: Target,
    value: "20+",
    label: "Projects Completed",
    color: "from-[#0a7a94] to-[#08536a]"
  }
];

export default function TeamPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";
  const promisePhoto = teamPhoto;

  const promiseOverlay = isRed
    ? "linear-gradient(90deg, rgba(45, 3, 6, 0.97) 0%, rgba(60, 6, 10, 0.88) 45%, rgba(90, 10, 16, 0.45) 100%)"
    : isGreen
      ? "linear-gradient(90deg, rgba(2, 30, 18, 0.97) 0%, rgba(4, 42, 24, 0.88) 45%, rgba(6, 60, 34, 0.45) 100%)"
      : "linear-gradient(90deg, rgba(3,20,43,0.95) 0%, rgba(4,32,64,0.84) 45%, rgba(6,52,96,0.45) 100%)";

  return (
    <>
      <TeamHero />

      {/* --- Leadership Section --- */}
      <LeadershipSection />

      {/* --- Team Carousel --- */}
      <TeamCarousel members={carouselMembers} />

      {/* --- Our Promise Section with Fixed Background --- */}
      <section
        className="promise-section relative overflow-hidden min-h-[320px] lg:h-[380px] flex items-center"
        id="trust-care"
        aria-labelledby="trust-care-title"
        style={{
          clipPath: 'inset(0)',
          isolation: 'isolate'
        }}
      >
        {/* Fixed background photo - stays in place while page scrolls */}
        <div
          className="promise-bg-fixed"
          style={{
            content: '',
            position: 'fixed',
            inset: 0,
            top: '-120px',
            zIndex: -2,
            backgroundImage: `url(${promisePhoto})`,
            backgroundPosition: '50% 35%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
          aria-hidden="true"
        />
        
        {/* Dark gradient overlay */}
        <div 
          className="absolute inset-0 z-[-1] transition-all duration-500"
          style={{
            background: promiseOverlay
          }}
          aria-hidden="true"
        />
        
        {/* Theme glow bottom-right */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-[120px] z-[-1] transition-colors"
          style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
        />

        {/* Content - using same container as hero section */}
        <div className="relative w-full">
          <div className="site-container py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              {/* Text Content */}
              <div className="text-white">
                <ScrollReveal>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-[2px] w-12 transition-colors"
                      style={{ backgroundColor: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      OUR PROMISE
                    </span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2 
                    id="trust-care-title"
                    className="font-serif text-[30px] font-bold leading-tight sm:text-[38px] lg:text-[44px]"
                  >
                    <span className="text-white">Precision You Can Trust.</span>
                    <br />
                    <span
                      style={{
                        color: isRed ? "#ef4444" : "var(--accent)",
                        transition: "color 0.4s ease-in-out",
                      }}
                    >
                      Care You Can Feel.
                    </span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <p className="mt-5 text-[16px] leading-relaxed text-slate-200 max-w-xl">
                    Every report is reviewed by experts, so you get answers you can act on.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <Button
                    className="mt-7 min-h-9 sm:min-h-12! px-4 sm:px-7! font-['Noto_Sans'] text-xs sm:text-[15px]!"
                    href="/contact"
                  >
                    Join Our Team <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Respect reduced motion preference */}
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .promise-bg-fixed {
              position: absolute !important;
            }
          }
        `}</style>
      </section>

      {/* White spacer before footer */}
      <div className="bg-white h-20" aria-hidden="true" />
    </>
  );
}
