import { ArrowRight, Bell } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import serviceHero from "../assets/service-hero.webp";

export default function OpenPositionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        aria-labelledby="open-positions-hero-title"
        className="relative isolate flex min-h-75 items-center overflow-hidden bg-[#031b37] text-white sm:min-h-80"
        id="open-positions-hero"
      >
        <img
          alt=""
          aria-hidden="true"
          width="1376"
          height="768"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center]"
          src={serviceHero}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-[#031b37]/95 via-[#031b37]/75 to-[#031b37]/10"
        />
        <div className="mx-auto w-full max-w-310 px-6 py-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-3 font-inter text-sm"
          >
            <a
              className="text-[#12c5df] transition-colors hover:text-white"
              href="#home"
            >
              Home
            </a>
            <span aria-hidden="true" className="text-[#12c5df]">
              ›
            </span>
            <span aria-current="page" className="text-slate-300">
              Open Positions
            </span>
          </nav>

          <div className="max-w-155">
            <p className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.24em] text-[#12c5df]">
              <span aria-hidden="true" className="h-0.5 w-9 bg-[#12c5df]" />
              Open Positions
            </p>
            <ScrollReveal
              as="h1"
              className="font-outfit text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]"
              id="open-positions-hero-title"
            >
              Join Our{" "}
              <span className="text-[#12c5df]">Research Community</span>
            </ScrollReveal>
            <p className="mt-3 max-w-122.5 font-inter text-[13px] leading-[1.55] text-slate-200 sm:text-sm">
              We're building a world-class team of scientists, clinicians, and
              bioinformaticians. While we don't have any open positions right
              now, we're always looking for passionate talent.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button className="font-inter" href="#contact">
                Contact Us{" "}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Button>
              <Button
                className="border-white/70 font-inter"
                href="#team"
                variant="transparent"
              >
                View Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* No Positions Section */}
      <section
        aria-labelledby="no-positions-title"
        className="bg-[#f8fafc] py-16 md:py-24"
        id="no-positions"
      >
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <div className="rounded-3xl border border-[#d4e5f2] bg-white px-4 py-12 text-center shadow-[0_20px_40px_rgba(12,43,72,0.08)] sm:px-6 sm:py-16 md:py-20">
            <ScrollReveal as="div" className="mb-6 flex justify-center">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 grid h-32 w-32 place-items-center rounded-full bg-[#eaf6fa] opacity-60 blur-[3px]"
                />
                <span className="relative grid h-28 w-28 place-items-center rounded-full bg-[#f0f8fb] text-[#0a7a94]">
                  <Bell
                    aria-hidden="true"
                    className="h-12 w-12"
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal as="div" delay={60}>
              <p className="mx-auto mt-2 max-w-96 font-outfit text-center text-[15px] font-medium leading-[1.7] text-[#10c8e0]">
                Opportunities in genomics, bioinformatics & precision medicine
              </p>
            </ScrollReveal>

            <ScrollReveal as="h2" delay={50}>
              <h2
                className="font-outfit text-[28px] font-bold leading-[1.2] text-[#0c2b48] sm:text-[34px] md:text-[38px]"
                id="no-positions-title"
              >
                No Open Positions Yet
              </h2>
            </ScrollReveal>

            <ScrollReveal as="p" delay={100}>
              <p className="mx-auto mt-4 max-w-72 font-inter text-[14px] leading-[1.7] text-[#4a6e8b] sm:text-base">
                We're currently reviewing our staffing needs. New opportunities
                will be posted here as soon as they become available.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  className="!min-h-12 !px-7 font-inter"
                  href="#contact"
                >
                  Contact Us{" "}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button
                  className="border-[#10c8e0]/50 font-inter"
                  href="#team"
                  variant="transparent"
                >
                  View Our Team
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer / Related Links */}
      <section
        aria-label="Related pages"
        className="bg-[#031b37] pb-6 pt-4 md:pb-8 md:pt-6 border-t border-[#12c5df]/20"
      >
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <ScrollReveal className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[#10c8e0] hover:underline focus-visible:text-[#10c8e0] focus-visible:underline focus-visible:outline-none"
              href="#team"
            >
              View Our Team
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[#10c8e0] hover:underline focus-visible:text-[#10c8e0] focus-visible:underline focus-visible:outline-none"
              href="#contact"
            >
              Contact Us
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-[#10c8e0] hover:underline focus-visible:text-[#10c8e0] focus-visible:underline focus-visible:outline-none"
              href="#home"
            >
              Back to Home
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
