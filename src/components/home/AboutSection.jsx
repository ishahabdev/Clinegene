import { ArrowRight, Building2, GraduationCap, Lightbulb, Stethoscope, Users, UsersRound } from "lucide-react";
import Button from "../Button";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
import microscopeImage from "../../assets/micro.jpg";
export default function AboutSection() {
    return (
<section
    aria-labelledby="about-title"
    className="overflow-x-clip bg-white py-16 md:py-24"
    id="about"
  >
    <div className="site-container">
      <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:gap-16">
        <div>
        <SectionHeading
          compact
          eyebrow="About US"
          id="about-title"
          highlight="Life Sciences Research"
          title={<>Advancing<br className="hidden md:block" /></>}
        />
        <div className="max-w-212.5 space-y-4 font-inter text-base leading-7 text-slate-600 sm:text-[17px] sm:leading-[1.9]">
          <p>
            ClinGene (SMC-Private) Limited is a human genetics and precision medicine platform in Pakistan,
            bringing academic researchers, clinicians, and industrial partners together to
            advance research and contribute to the well-being of society.
          </p>
          <p>
            We also work across other areas of biomedical sciences, focusing on training the next
            generation of researchers in state-of-the-art technologies, scientific discovery,
            critical thinking, independent research, and teamwork.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {[
            { label: "Capacity Development", Icon: GraduationCap },
            { label: "Critical Thinking", Icon: Lightbulb },
            { label: "Teamwork", Icon: Users },
          ].map(({ label, Icon }) => (
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-inter text-[13px] font-medium"
              key={label}
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
                background: "var(--accent-soft)",
                color: "var(--accent-muted)",
                transition: "all 0.4s ease-in-out",
              }}
            >
              <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} style={{ color: "var(--accent-muted)" }} />
              {label}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button className="min-h-9 sm:min-h-12! px-4 sm:px-7! font-outfit text-xs sm:text-sm" href="/about" variant="cyan">
            More About US <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
         
          <a
            className="group inline-flex min-h-9 sm:min-h-12 items-center gap-2 px-2 font-outfit text-xs sm:text-sm font-bold transition-colors hover:text-[#0c2b48] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
            href="/ceo-message"
            style={{ color: "var(--accent-muted)", transition: "color 0.4s ease-in-out" }}
          >
            Message from CEO
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
          </a>
        </div>
      </div>

      <ScrollReveal as="div" className="relative isolate mx-auto w-full max-w-107.5 pb-28">
        <div className="absolute -right-3 -top-3 z-0 hidden aspect-3/2 w-full rounded-[28px] border-2 sm:block"
          style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)", transition: "border-color 0.4s ease-in-out" }}
        />
        <div className="relative z-0 aspect-3/2 w-full overflow-hidden rounded-[28px] bg-[#071e34] shadow-xl">
          <img
            alt="Microscope in a biomedical research setting"
            width="604"
            height="272"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-90"
            decoding="async"
            loading="lazy"
            src={microscopeImage}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#021526]/70 via-[#021526]/35 to-[#021526]/20" />
        </div>
        <div className="absolute bottom-0 left-1/2 z-10 w-[90%] -translate-x-1/2 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-100 shadow-[0_18px_40px_rgba(3,31,49,0.18)] sm:px-5 sm:py-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: "Researchers", Icon: UsersRound },
              { label: "Clinicians", Icon: Stethoscope },
              { label: "Industry Partners", Icon: Building2 },
            ].map(({ label, Icon }) => (
              <div className="flex flex-col items-center gap-2 text-center font-inter" key={label}
                style={{ color: "var(--accent-muted)", transition: "color 0.4s ease-in-out" }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full"
                  style={{ background: "var(--accent-soft)", transition: "background 0.4s ease-in-out" }}
                >
                  <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8}
                    style={{ color: "var(--accent-muted)" }}
                  />
                </span>
                <span className="text-[9px] font-semibold leading-tight sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
          <svg aria-hidden="true" className="mt-2 h-8 w-full" fill="none" viewBox="0 0 300 30" preserveAspectRatio="none"
            style={{ color: "var(--accent)", transition: "color 0.4s ease-in-out" }}
          >
            <path d="M45 2 C76 2 87 23 150 23 M150 2 V23 M255 2 C224 2 213 23 150 23" stroke="currentColor" strokeDasharray="3 4" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <div className="mt-1 flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#0c2b48] px-4 py-1.5 font-outfit text-sm font-bold tracking-[0.18em] text-white">
              <span aria-hidden="true" className="h-2 w-2 rounded-full"
                style={{ background: "var(--accent)", transition: "background 0.4s ease-in-out" }}
              />
              CLINGENE
            </p>
            <p className="mt-2 font-inter text-[12.5px] font-medium leading-snug text-[#4a6e8b]">
              Biomedical Research for a Better Tomorrow
            </p>
          </div>
        </div>
      </ScrollReveal>
      </div>
    </div>
  </section>
    );
}
