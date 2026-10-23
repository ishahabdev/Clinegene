import { ArrowRight } from "lucide-react";
import Button from "../Button";
import homeBackground from "../../assets/homepic.png";

function FeatureIcon({ type }) {
  if (type === "technology") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M9 3h6m-5 0v5l-5.5 9.2A2.5 2.5 0 0 0 6.6 21h10.8a2.5 2.5 0 0 0 2.1-3.8L14 8V3m-7.3 12h10.6M9 11h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "collaboration") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0m.5-4.5a4.5 4.5 0 0 1 5.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V8m-16 11h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export default function HeroSection() {
    return (
<section
    aria-labelledby="hero-title"
    className="relative isolate flex min-h-140 items-center overflow-hidden bg-[#031b37] text-white sm:min-h-152.5 lg:min-h-[calc(100svh-84px)]"
    id="home"
  >
    <img
      alt=""
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      fetchPriority="high"
      src={homeBackground}
    />
    <div className="site-container grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="max-w-152.5">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 sm:text-xs">
          Human Genetics <span className="mx-1 text-[#10c8e0]">|</span> Omic Sciences{" "}
          <span className="mx-1 text-[#10c8e0]">|</span> Biomedical Research
        </p>
        <h1
          className="max-w-147.5 text-[34px] font-bold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[42px]"
          id="hero-title"
        >
          Advancing Human Genetics &amp; Precision Medicine
          <span className="mt-1 block text-[#10c8e0]">Through Research</span>
        </h1>
        <p className="mt-5 max-w-125 text-sm leading-6 text-white/85 sm:text-sm">
          ClinGene brings academic researchers, clinicians and industrial partners together
          to translate scientific findings for the well-being of the society.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button className="px-6" href="#research">
            Explore Our Research <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button className="border-white/70 px-6" href="#services" variant="transparent">
            Our Services
          </Button>
        </div>

        <div className="mt-9 grid max-w-152.5 grid-cols-1 gap-4 text-[10px] font-medium text-white/95 sm:grid-cols-3 sm:gap-5">
          {[
            { icon: "technology", label: <>Advanced<br />Technologies</> },
            { icon: "collaboration", label: <>Research<br />Collaboration</> },
            { icon: "capacity", label: <>Capacity<br />Development</> },
          ].map((feature) => (
            <div className="flex items-center gap-2.5 border-r border-white/15 last:border-r-0" key={feature.icon}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#12c5df] text-[#12c5df]">
                <FeatureIcon type={feature.icon} />
              </span>
              <span className="leading-4">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[68px] right-10 hidden min-h-[106px] w-[208px] flex-col justify-center overflow-hidden rounded-[12px] border border-[#12c5df]/70 bg-[#031b37]/85 px-5 py-4 shadow-[0_0_24px_rgba(18,197,223,0.16)] backdrop-blur-sm lg:flex xl:right-16">
        <span
          aria-hidden="true"
          className="mb-2.5 block h-[2px] w-7 shrink-0 bg-[#12c5df]"
        />
        <p className="font-inter text-[11px] font-medium uppercase leading-[1.55] tracking-[0.2em] text-white/95">
          Genomics
          <br />
          for a healthier
          <br />
          tomorrow
        </p>
      </div>
    </div>
  </section>
    );
}
