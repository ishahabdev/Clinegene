import { ArrowRight, Users, Award, TrendingUp, Target } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import TeamHero from "../components/team/TeamHero.jsx";
import LeadershipSection from "../components/team/LeadershipSection.jsx";
import TeamCarousel from "../components/team/TeamCarousel.jsx";
import { carouselMembers } from "../data/team.js";

const stats = [
  {
    icon: Users,
    value: "30+",
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
    value: "15+",
    label: "Years Experience",
    color: "from-[#10c8e0] to-[#0e8fae]"
  },
  {
    icon: Target,
    value: "200+",
    label: "Projects Completed",
    color: "from-[#0a7a94] to-[#08536a]"
  }
];

export default function TeamPage() {
  return (
    <>
      <TeamHero />

      {/* --- Leadership Section --- */}
      <LeadershipSection />

      {/* --- Team Carousel --- */}
      <TeamCarousel members={carouselMembers} />

      {/* --- Stats Section --- */}
      <section
        aria-labelledby="team-stats-title"
        className="relative bg-white py-16 md:py-20 overflow-hidden"
        id="team-stats"
      >
        {/* Background decoration */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(16,200,224,0.04),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f0f8fb] to-white border border-[#d4e5f2] p-6 text-center transition-all duration-500 hover:shadow-[0_12px_32px_rgba(16,200,224,0.15)] hover:border-[#10c8e0]/40 hover:-translate-y-1">
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#10c8e0] to-[#0a7a94] shadow-lg">
                      <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Value */}
                    <div className="font-outfit text-[36px] font-extrabold text-[#0c2b48] lg:text-[42px]">
                      {stat.value}
                    </div>

                    {/* Label */}
                    <p className="mt-2 text-sm font-semibold text-[#4a6e8b]">
                      {stat.label}
                    </p>

                    {/* Hover effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-[#10c8e0]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section
        aria-labelledby="join-team-title"
        className="relative isolate overflow-hidden bg-gradient-to-br from-[#031b37] via-[#0c2b48] to-[#031b37] py-20 text-center text-white md:py-28"
        id="join-team"
      >
        {/* Animated background gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,200,224,0.15),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-[#10c8e0]/10 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-[#0a7a94]/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2">
              <div className="h-2 w-2 rounded-full bg-[#10c8e0] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#10c8e0]">
                Join Us
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 
              className="font-outfit text-[36px] font-extrabold leading-tight sm:text-[42px] md:text-[48px] lg:text-[52px]"
              id="join-team-title"
            >
              Ready to{" "}
              <span className="bg-gradient-to-r from-[#10c8e0] to-[#22d3ee] bg-clip-text text-transparent">
                join our team
              </span>
              ?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-slate-300 sm:text-[17px] lg:leading-loose">
              We're always looking for passionate scientists and researchers who want to advance human genetics and precision medicine. Join us in transforming healthcare through innovation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                className="!min-h-[52px] !px-8 font-outfit !text-[15px] shadow-lg shadow-[#10c8e0]/30 hover:shadow-xl hover:shadow-[#10c8e0]/40"
                href="#contact"
                variant="cyan"
              >
                Contact Us <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Button>
              <Button
                className="!min-h-[52px] !px-8 font-outfit !text-[15px] border-2 border-white/30 hover:bg-white/10 hover:border-white/50"
                href="/open-positions"
                variant="transparent"
              >
                View Open Positions <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
