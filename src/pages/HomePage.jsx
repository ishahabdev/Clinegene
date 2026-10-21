import { useEffect, useRef, useState } from "react";
import {
  Atom,
  ArrowRight,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  Dna,
  Droplet,
  GraduationCap,
  Lightbulb,
  Microscope,
  Stethoscope,
  TestTubes,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import services from "../data/services";
import microscopeImage from "../assets/micro.jpg";

const homeBackground = "/images/home1.webp";

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

const serviceGradients = [
  "from-[#d9ecfa] to-white",
  "from-[#dce6f5] to-[#f7fbff]",
  "from-[#e3eff8] to-[#d7e7f5]",
  "from-[#e4f1f2] to-white",
  "from-[#e4eafa] to-[#f8faff]",
  "from-[#deedf2] to-white",
  "from-[#dce8f5] to-[#f7fbff]",
  "from-[#e9eff4] to-white",
  "from-[#e2e9f6] to-[#f8faff]",
  "from-[#e3edf5] to-white",
  "from-[#e2f0eb] to-[#f8fbf9]",
  "from-[#e6e6f2] to-white",
  "from-[#dcecf4] to-[#f7fbff]",
];

export default function HomePage() {
  const [serviceIndex, setServiceIndex] = useState(0);
  const [servicesViewportWidth, setServicesViewportWidth] = useState(0);
  const servicesViewportRef = useRef(null);
  const cardsPerView = servicesViewportWidth >= 1024 ? 4 : servicesViewportWidth >= 640 ? 2 : 1;
  const cardGap = 16;
  const cardWidth = servicesViewportWidth
    ? (servicesViewportWidth - cardGap * (cardsPerView - 1)) / cardsPerView
    : 0;
  const carouselServices = [...services, ...services.slice(0, cardsPerView - 1)];
  const touchStartX = useRef(null);

  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport) return undefined;

    viewport.scrollLeft = 0;
    setServiceIndex(0);
    const resizeObserver = new ResizeObserver(([entry]) => setServicesViewportWidth(entry.contentRect.width));
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

  const goToService = (index) => {
    setServiceIndex((index + services.length) % services.length);
  };

  return (
    <>
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
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#03172f]/95 via-[#031a35]/75 to-[#031a35]/10" />
        <div className="site-container grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-152.5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200 sm:text-xs">
              Human Genetics <span className="mx-1 text-[#10c8e0]">|</span> Omic Sciences{" "}
              <span className="mx-1 text-[#10c8e0]">|</span> Biomedical Research
            </p>
            <h1
              className="max-w-147.5 text-[34px] font-bold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[50px]"
              id="hero-title"
            >
              Advancing Human Genetics &amp; Precision Medicine
              <span className="mt-1 block text-[#10c8e0]">Through Research</span>
            </h1>
            <p className="mt-5 max-w-125 text-sm leading-6 text-slate-200 sm:text-base">
              ClinGene brings academic researchers, clinicians and industrial partners together
              to translate scientific findings for the well-being of the society.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10c8e0] px-6 text-xs font-bold text-[#050b1c] transition-colors hover:bg-[#079bb0] sm:text-sm"
                href="#research"
              >
                Explore Our Research
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 px-6 text-xs font-bold text-white transition-colors hover:bg-white/10 sm:text-sm"
                href="#services"
              >
                Our Services
              </a>
            </div>

            <div className="mt-9 grid max-w-152.5 grid-cols-1 gap-4 text-xs font-semibold text-slate-100 sm:grid-cols-3 sm:gap-5">
              {[
                { icon: "technology", label: <>Advanced<br />Technologies</> },
                { icon: "collaboration", label: <>Research<br />Collaboration</> },
                { icon: "capacity", label: <>Capacity<br />Development</> },
              ].map((feature) => (
                <div className="flex items-center gap-2.5" key={feature.icon}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/50 text-white">
                    <FeatureIcon type={feature.icon} />
                  </span>
                  <span className="leading-4">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden flex-col items-start gap-2 justify-self-end self-center lg:flex">
            <span className="h-px w-8 shrink-0 bg-white/70" />
            <p className="max-w-44 text-sm font-semibold uppercase leading-[1.55] tracking-widest text-white">
              Genomics
              <br />
              Today for a
              <br />
              Healthier
              <br />
              Tomorrow
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-title"
        className="overflow-x-clip bg-white py-16 md:py-24"
        id="about"
      >
        <div className="mx-auto grid max-w-310 items-center gap-10 px-6 lg:grid-cols-[1.35fr_0.9fr] lg:gap-16 lg:px-12">
          <div>
            <SectionHeading
              compact
              eyebrow="About US"
              id="about-title"
              highlight="Life Sciences Research"
              title={<>Pakistan’s Pioneer in<br className="hidden md:block" /></>}
            />
            <div className="max-w-212.5 space-y-4 font-inter text-base leading-7 text-slate-600 sm:text-[17px] sm:leading-[1.9]">
              <p>
                ClinGene (Pvt) Ltd. is a human genetics and precision medicine platform in Pakistan,
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
                  className="inline-flex items-center gap-2 rounded-full border border-[#12c5df]/30 bg-[#effafc] px-3.5 py-2 font-inter text-[13px] font-medium text-[#0a7a94]"
                  key={label}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-[#0a7a94]" strokeWidth={1.8} />
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#12c5df] px-7 font-outfit text-sm font-bold text-[#0c2b48] shadow-[0_10px_22px_rgba(18,197,223,0.2)] transition-colors hover:bg-[#10b5cf] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
                href="#services"
              >
                Explore Our Services
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
              </a>
              <a
                className="group inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-[#0a7a94] px-7 font-outfit text-sm font-bold text-[#0a7a94] transition-colors hover:bg-[#0a7a94] hover:text-white focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
                href="#contact"
              >
                Contact Us
              </a>
              <a
                className="group inline-flex min-h-12 items-center gap-2.5 px-2 font-outfit text-sm font-bold text-[#0a7a94] transition-colors hover:text-[#0c2b48] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
                href="#ceo-message"
              >
                Message from CEO
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
              </a>
            </div>
          </div>

          <div className="relative isolate w-full pb-30">
            <div className="absolute -right-3 -top-3 z-0 hidden aspect-3/2 w-full rounded-[28px] border-2 border-[#12c5df]/40 sm:block" />
            <div className="relative z-0 aspect-3/2 w-full overflow-hidden rounded-[28px] bg-[#071e34] shadow-xl">
              <img
                alt="Microscope in a biomedical research setting"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="lazy"
                src={microscopeImage}
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#031e30]/5 via-transparent to-[#031e30]/35" />
            </div>
            <div className="absolute bottom-0 left-1/2 z-10 w-[90%] -translate-x-1/2 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-100 shadow-[0_18px_40px_rgba(3,31,49,0.18)] sm:px-5 sm:py-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: "Researchers", Icon: UsersRound },
                  { label: "Clinicians", Icon: Stethoscope },
                  { label: "Industry Partners", Icon: Building2 },
                ].map(({ label, Icon }) => (
                  <div className="flex flex-col items-center gap-2 text-center font-inter text-[#0a7a94]" key={label}>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e6f8fb]">
                      <Icon aria-hidden="true" className="h-6 w-6 text-[#0a7a94]" strokeWidth={1.8} />
                    </span>
                    <span className="text-[9px] font-semibold leading-tight sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
              <svg aria-hidden="true" className="mt-2 h-8 w-full text-[#12c5df]" fill="none" viewBox="0 0 300 30" preserveAspectRatio="none">
                <path d="M45 2 C76 2 87 23 150 23 M150 2 V23 M255 2 C224 2 213 23 150 23" stroke="currentColor" strokeDasharray="3 4" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              <div className="mt-1 flex flex-col items-center text-center">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#0c2b48] px-4 py-1.5 font-outfit text-sm font-bold tracking-[0.18em] text-white">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#12c5df]" />
                  CLINGENE
                </p>
                <p className="mt-2 font-inter text-[12.5px] font-medium leading-snug text-[#4a6e8b]">
                  Biomedical Research for a Better Tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="services-title"
        className="relative isolate overflow-hidden bg-[#eaf6fa] py-16 text-[#102744] md:py-24"
        id="key-services"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(35,133,209,0.08),transparent_32%),linear-gradient(135deg,#eaf6fa,#eaf6fa)]" />
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <SectionHeading
            action={{ label: "View All", href: "/services" }}
            controls={
              <>
                <button
                  aria-label="Previous services"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0c2b48] shadow-[0_4px_14px_rgba(12,43,72,0.14)] transition-colors hover:bg-[#10c8e0] hover:text-[#050b1c] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={serviceIndex === 0}
                  onClick={() => goToService(serviceIndex - 1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={18} />
                </button>
                <button
                  aria-label="Next services"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0c2b48] shadow-[0_4px_14px_rgba(12,43,72,0.14)] transition-colors hover:bg-[#10c8e0] hover:text-[#050b1c] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={serviceIndex === services.length - 1}
                  onClick={() => goToService(serviceIndex + 1)}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={18} />
                </button>
              </>
            }
            description="From research to real-world applications, we provide genomic services to help unlock the potential of life's code."
            eyebrow="Our Services"
            id="services-title"
            highlight="Genomic Solutions"
            title="Comprehensive"
          />

          <div className="min-w-0">
            <div
              className="relative"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const delta = event.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(delta) > 40) {
                  goToService(serviceIndex + (delta < 0 ? 1 : -1));
                }
                touchStartX.current = null;
              }}
              ref={servicesViewportRef}
              role="region"
              aria-label="Genomic services"
              style={{ touchAction: "pan-y" }}
            >
              <div className="overflow-x-clip overflow-y-visible">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  gap: `${cardGap}px`,
                  transform: `translateX(-${serviceIndex * (cardWidth + cardGap)}px)`,
                  width: cardWidth ? `${carouselServices.length * cardWidth + (carouselServices.length - 1) * cardGap}px` : "100%",
                }}
              >
                {carouselServices.map((service, index) => {
                  return (
                    <a
                      className="group flex min-h-100 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#d4e5f2] bg-[#f7fbff] text-[#102744] shadow-[0_12px_30px_rgba(12,43,72,0.18)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#12c5df] hover:shadow-[0_16px_36px_rgba(12,43,72,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12c5df] group-focus-within:-translate-y-1.5 group-focus-within:border-[#12c5df] group-focus-within:shadow-[0_16px_36px_rgba(12,43,72,0.24)] motion-reduce:transform-none motion-reduce:transition-none"
                      href="#services"
                      key={`${service}-${index}`}
                      style={{ width: `${cardWidth}px` }}
                    >
                      <div className="relative aspect-4/3 w-full min-w-0 overflow-hidden bg-[#102943]">
                        <img
                          alt=""
                          aria-hidden="true"
                          className={`block h-full w-full object-cover object-center transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                            service.name === "Whole Exome/Genome Sequencing"
                              ? "scale-[1.16] group-hover:scale-[1.24] group-focus-within:scale-[1.24]"
                              : service.name === "16SrRNA Metagenome Sequencing"
                                ? "origin-bottom scale-[1.16] group-hover:scale-[1.24] group-focus-within:scale-[1.24]"
                              : "scale-[1.03] group-hover:scale-110 group-focus-within:scale-110"
                          }`}
                          loading="lazy"
                          src={service.image}
                        />
                      </div>
                      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-9">
                        <span className="absolute -top-7 left-5 grid h-14 w-14 place-items-center rounded-xl border border-[#d4e5f2] bg-[#f7fbff] text-[#0a7a94] shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#12c5df] group-hover:text-white group-focus-within:scale-110 group-focus-within:-rotate-6 group-focus-within:bg-[#12c5df] group-focus-within:text-white motion-reduce:transform-none motion-reduce:transition-none">
                          <service.Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                        </span>
                        <h3 className="mt-4 text-base font-bold leading-6 transition-colors duration-300 ease-out group-hover:text-[#0a5265] group-focus-within:text-[#0a5265] motion-reduce:transition-none sm:text-[17px]">{service.name}</h3>
                        <p className="mt-3 text-sm leading-[1.6] text-[#58748d]">{service.description}</p>
                        <span className="mt-auto inline-flex items-center gap-2 whitespace-nowrap pt-5 text-sm font-bold text-[#0a7a94]">
                          Explore
                          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
          <div aria-label="Choose a service" className="mt-6 flex items-center justify-center gap-2" role="group">
            {services.map((service, index) => (
              <button
                aria-current={serviceIndex === index ? "true" : undefined}
                aria-label={`Show ${service.name}`}
                className={`h-1.75 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] motion-reduce:transition-none ${
                  serviceIndex === index
                    ? "w-7 bg-[#10c8e0]"
                    : "w-1.75 bg-[#9aafc1] hover:bg-[#10c8e0]/70"
                }`}
                key={service.name}
                onClick={() => goToService(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="journey-title"
        className="overflow-x-clip bg-white py-16 md:py-24"
        id="scientific-journey"
      >
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <SectionHeading
            description="We turn your biological data into meaningful insights — quickly, accurately and with expert care."
            eyebrow="Work Steps"
            id="journey-title"
            highlight="Four simple steps"
            title="From sample to discovery in"
          />

          <div className="relative mt-7 grid gap-x-5 gap-y-5 sm:mt-9 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-[#cbd0d4] xl:block"
            />
            {[
              {
                Icon: Droplet,
                title: "Sample Collection",
                description: "Blood or DNA samples collected safely and efficiently",
              },
              {
                Icon: Dna,
                title: "Sequencing & Genomic Data",
                description: "Advanced sequencing generates high-quality genomic data",
              },
              {
                Icon: BarChart3,
                title: "Bioinformatics Analysis",
                description: "Computational pipelines process and analyze genomic data",
              },
              {
                Icon: Lightbulb,
                title: "Interpretation & Discovery",
                description: "Expert interpretation turns results into meaningful scientific and clinical insights",
              },
            ].map(({ Icon, title, description }, index) => (
              <div className="group relative xl:px-2" key={title}>
                <div className="mb-5 flex justify-center">
                  <div
                    aria-label={`Step ${index + 1}`}
                    className="relative z-10 grid h-16 w-18.5 place-items-center bg-[#f0f0ed] text-[22px] font-black text-[#102744] shadow-[0_6px_14px_rgba(15,23,42,0.07)] transition-colors duration-1000 ease-in-out group-hover:bg-[#10c8e0] group-focus-within:bg-[#10c8e0] motion-reduce:transition-none"
                    role="img"
                    style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <article className="flex h-full flex-col rounded-2xl border border-[#d4e5f2] bg-white px-5 py-4.25 shadow-[0_8px_24px_rgba(29,78,116,0.08)] transition-all duration-700 ease-out hover:-translate-y-1 hover:border-[#10c8e0] hover:bg-[#f7fbff] hover:shadow-[0_14px_30px_rgba(12,43,72,0.14)] focus-within:border-[#10c8e0] focus-within:bg-[#f7fbff] focus-within:shadow-[0_14px_30px_rgba(12,43,72,0.14)] motion-reduce:transform-none motion-reduce:transition-none">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf6fa] text-[#0a7a94] transition-colors duration-700 group-hover:bg-[#10c8e0] group-hover:text-[#0c2b48] group-focus-within:bg-[#10c8e0] group-focus-within:text-[#0c2b48]">
                    <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-3 text-[18px] font-bold leading-tight text-[#0c2b48] sm:text-[20px]">
                    {title}
                  </h3>
                  <span aria-hidden="true" className="mt-3 h-0.5 w-9 rounded-full bg-[#10c8e0]" />
                  <p className="mt-3 text-[14px] leading-[1.65] text-[#4a6e8b] sm:text-[15px]">
                    {description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="team-title"
        className="relative isolate overflow-hidden bg-[#eaf6fa] py-16 md:py-24"
        id="team"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_15%,rgba(255,255,255,0.9),transparent_55%)]" />
        <div className="mx-auto max-w-310 px-6 lg:px-12">
          <SectionHeading
            action={{ label: "View Team", href: "/team" }}
            description="Scientists, clinicians and bioinformaticians turning genomic research into healthier futures."
            descriptionClassName="text-slate-600"
            eyebrow="Our Team"
            id="team-title"
            highlight="Scientific Team"
            title="Meet our"
          />

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4" id="team-members">
            {[
              {
                name: "Dr. Amjad Ali Tanoli Ph.D",
                designation: "CEO",
                details: ["Human Geneticist", "Consultant Genetic Counselor"],
              },
              {
                name: "Dr. Safdar Ali Tanoli Ph.D",
                designation: "POSTDOC",
                details: ["Co-CEO", "Medical Physicist", "Princess Margaret Cancer Research Centre, Toronto, Canada"],
              },
              {
                name: "Dr. Kifayat Ullah Ph.D",
                designation: "HUMAN GENETICS",
                details: [],
              },
            ].map(({ name, designation, details, image }) => (
              <article
                className="flex min-h-57 items-center gap-4 rounded-2xl border border-[#d4e5f2] bg-white/85 p-4 shadow-[0_8px_24px_rgba(29,78,116,0.06)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#10c8e0] hover:bg-white hover:shadow-[0_14px_30px_rgba(12,43,72,0.12)] motion-reduce:transform-none motion-reduce:transition-none sm:gap-5"
                key={name}
              >
                <div className="relative h-48 w-[38%] max-w-38 shrink-0 overflow-hidden rounded-xl bg-[#dceaf2]">
                  {image ? (
                    <img
                      alt={name}
                      className="h-full w-full object-cover object-[center_20%]"
                      loading="lazy"
                      src={image}
                    />
                  ) : (
                    <div aria-label={`Portrait placeholder for ${name}`} className="flex h-full w-full items-center justify-center bg-linear-to-b from-[#dceaf2] to-[#c9dce8]" role="img">
                      <UserRound aria-hidden="true" className="h-20 w-20 text-[#496680]" strokeWidth={1.2} />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start self-stretch py-2">
                  <h3 className="text-[15px] font-bold leading-[1.35] text-[#0c2b48] sm:text-base">
                    {name}
                  </h3>
                  {designation && (
                    <p className="mt-2 rounded-md bg-[#e5f8fb] px-2 py-1 text-[10px] font-bold uppercase leading-tight tracking-[0.04em] text-[#0a7a94]">
                      {designation}
                    </p>
                  )}
                  <div className="mt-2 space-y-0.5 text-[12px] leading-[1.45] text-[#4a6e8b] sm:text-[13px]">
                    {details.map((detail) => <p key={detail}>{detail}</p>)}
                  </div>
                  <a
                    aria-label={`View ${name}`}
                    className="mt-auto grid h-10 w-10 place-items-center rounded-full border border-[#bdebf2] text-[#0a7a94] transition-all duration-500 hover:border-[#10c8e0] hover:bg-[#10c8e0] hover:text-[#0c2b48] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
                    href="/team"
                  >
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-gallery-title"
        className="bg-white py-16 md:py-24"
        id="gallery-contact"
      >
        <div className="mx-auto grid max-w-310 items-stretch gap-5 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.72fr)] lg:gap-6 lg:px-12">
          <div
            className="rounded-2xl bg-[#f6f8fb] p-6 sm:p-8"
            id="gallery"
          >
            <SectionHeading
              action={{ label: "View All Gallery", href: "/gallery" }}
              description="Glimpses of our research, training and collaboration."
              eyebrow="Our Gallery"
              id="home-gallery-title"
              highlight="Our Journey"
              title="Moments from"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Genomics research", position: "65% center" },
                { label: "DNA sequencing", position: "82% center" },
                { label: "Biomedical science", position: "48% center" },
              ].map(({ label, position }) => (
                <a
                  aria-label={`View gallery: ${label}`}
                  className="group relative block h-52 overflow-hidden rounded-xl bg-[#102943] sm:h-48 lg:h-56"
                  href="#gallery"
                  key={label}
                >
                  <img
                    alt={label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    src={homeBackground}
                    style={{ objectPosition: position }}
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-[#031b37]/65 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                  <span className="absolute inset-x-3 bottom-3 text-xs font-semibold text-white sm:text-sm">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <aside
            aria-labelledby="home-contact-title"
            className="rounded-2xl bg-[#e7f3fc] p-7 pb-10 sm:p-9 sm:pb-12"
            id="contact"
          >
            <h2 className="text-xl font-bold text-[#102744] sm:text-2xl" id="home-contact-title">
              Get in Touch
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Have a question or need assistance? We’re here to help.
            </p>
            <a
              className="mt-6 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#2385d1] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(35,133,209,0.22)] transition-colors hover:bg-[#10c8e0] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
              href="#contact"
            >
              Contact Us
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <address className="mt-7 space-y-5 not-italic text-sm leading-6 text-slate-600">
              <a className="flex items-start gap-3 transition-colors hover:text-[#0a7a94] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]" href="tel:+92515421056">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-3 2a16 16 0 0 0 5 5l2-3 5 2v4c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-.6.4-1 1-1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
                <span>+92-3485607051</span>
              </a>
              <a className="flex items-start gap-3 break-all transition-colors hover:text-[#0a7a94] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]" href="mailto:info.Clinegene@gmail.com">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
                <span>info.cline@gmail.com</span>
              </a>
              <div className="flex items-start gap-3">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
                <span> Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road, Islamabad, Pakistan.</span>
              </div>
            </address>
          </aside>
        </div>
      </section>

    </>
  );
}
