import { useEffect, useRef, useState } from "react";
import homeBackground from "../assets/home1.png";

const services = [
  { name: "Clinical Genetic Testing", description: "Genetic testing services for clinical and research needs." },
  { name: "Sanger Sequencing", description: "Targeted DNA sequencing and sequence analysis." },
  { name: "Whole Exome/Genome Sequencing", description: "Comprehensive sequencing for genomic research." },
  { name: "RNA-Seq", description: "RNA sequencing services for gene expression research." },
  { name: "Single-cell RNA seq data analysis", description: "Analysis of single-cell RNA sequencing datasets." },
  { name: "16SrRNA Metagenome Sequencing", description: "Sequencing and analysis of 16S rRNA metagenomes." },
  { name: "Whole Genome Metagenome", description: "Whole-genome metagenomic sequencing and analysis." },
  { name: "Whole Fungal Genome Sequencing", description: "Genome sequencing services for fungal research." },
  { name: "Pangenome Analysis", description: "Comparative analysis across multiple genomes." },
  { name: "Phylogenetic Tree Construction", description: "Phylogenetic analysis and tree construction." },
  { name: "Plant Genome Sequencing", description: "Genome sequencing services for plant research." },
  { name: "Protein Docking & Molecular Dynamic Simulation", description: "Computational protein docking and molecular simulation." },
  { name: "Statistical Data Analysis", description: "Statistical analysis to support research data." },
];

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

function ServiceIcon({ index }) {
  const icons = [
    <><path d="M12 4v16M4 12h16" /><circle cx="12" cy="12" r="9" /></>,
    <><path d="M8 3c10 4 10 14 0 18m8-18C6 7 6 17 16 21M7 6h10M6 12h12m-11 6h10" /></>,
    <><path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5M8 2v4m8-4v4" /></>,
    <><path d="M4 18c4-12 12-12 16 0M4 6c4 12 12 12 16 0" /><circle cx="12" cy="12" r="2" /></>,
    <><circle cx="12" cy="12" r="8" /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="9" r="1.5" /><circle cx="13" cy="15" r="2" /></>,
    <><circle cx="7" cy="8" r="2" /><circle cx="16" cy="7" r="1.5" /><circle cx="12" cy="15" r="2.5" /><circle cx="19" cy="16" r="1" /><path d="M5 17c1-2 2-2 3-1m8-7 2 3" /></>,
    <><path d="M4 5h16M4 12h16M4 19h16" /><circle cx="8" cy="5" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="10" cy="19" r="2" /></>,
    <><path d="M12 4c-4 0-7 3-7 7 0 3 3 5 7 5s7-2 7-5c0-4-3-7-7-7ZM12 16v4m-4 0h8M8 9c2 1 6 1 8 0" /></>,
    <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="m8 7 3 4m5-4-3 4m-3 2-3 4m5-4 3 4" /></>,
    <><circle cx="12" cy="4" r="2" /><circle cx="6" cy="11" r="2" /><circle cx="18" cy="11" r="2" /><circle cx="4" cy="20" r="2" /><circle cx="12" cy="20" r="2" /><circle cx="20" cy="20" r="2" /><path d="m11 6-4 3m6-3 4 3m-10 4-2 5m3-5 3 5m4-5 2 5m-3-5-3 5" /></>,
    <><path d="M19 4C9 4 5 9 5 15c0 3 2 5 5 5 7 0 9-8 9-16ZM5 20c3-5 6-8 11-11" /></>,
    <><path d="M7 18c0-4 2-7 5-7s5 3 5 7v2H7zM12 11V5m0 2c-3 0-4-2-4-4 3 0 4 1 4 4Zm0 1c3 0 4-2 4-4-3 0-4 1-4 4Z" /></>,
    <><path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7" /><circle cx="19" cy="6" r="1.5" /></>,
  ];

  return (
    <svg aria-hidden="true" className="relative z-10 h-14 w-14 text-[#10c8e0] sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        {icons[index]}
      </g>
    </svg>
  );
}

export default function HomePage() {
  const [serviceIndex, setServiceIndex] = useState(5);
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
        className="relative isolate flex min-h-140 items-center overflow-hidden bg-[#031b37] bg-cover bg-center text-white sm:min-h-152.5 lg:min-h-[calc(100svh-84px)]"
        id="home"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
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
        className="bg-white py-16 sm:py-20 lg:py-24"
        id="about"
      >
        <div className="site-container grid items-center gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#10c8e0]">
              About ClinGene
            </p>
            <h2
              className="max-w-200 text-3xl font-bold leading-[1.12] tracking-tight text-[#102744] sm:text-4xl lg:text-[44px]"
              id="about-title"
            >
              Pakistan’s Pioneer in{" "}
              <span className="text-[#10c8e0]">Life Sciences Research</span>
            </h2>
            <div className="mt-6 max-w-212.5 space-y-4 text-base leading-7 text-slate-600 sm:text-[17px] sm:leading-[1.9]">
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
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#10c8e0] px-7 text-sm font-bold text-[#050b1c] shadow-[0_10px_22px_rgba(16,200,224,0.2)] transition-colors hover:bg-[#079bb0]"
                href="#services"
              >
                Explore Our Services
                <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#10c8e0]/30 px-7 text-sm font-bold text-[#10c8e0] transition-colors hover:bg-[#10c8e0]/5"
                href="#contact"
              >
                Contact Us
              </a>
              <a
                className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-bold text-[#10c8e0] transition-colors hover:text-[#10c8e0]"
                href="#ceo-message"
              >
                Message from CEO
                <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
              </a>
            </div>
          </div>

          <div
            aria-label="ClinGene introduction video preview"
            className="relative isolate min-h-105 overflow-hidden rounded-[22px] bg-[#071e34] bg-cover bg-center shadow-xl sm:min-h-130 lg:min-h-150"
            role="img"
            style={{ backgroundImage: `url(${homeBackground})` }}
          >
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#06192b]/10 via-[#06192b]/10 to-[#06192b]/90" />
            <div className="absolute left-1/2 top-1/2 grid h-19 w-19 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#10c8e0] shadow-lg">
              <svg aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4.8c0-.8.9-1.3 1.6-.9l11.1 7.2a1.1 1.1 0 0 1 0 1.8L8.6 20.1c-.7.4-1.6-.1-1.6-.9V4.8Z" />
              </svg>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#10c8e0]">
                Play
              </p>
              <p className="text-lg font-bold text-white sm:text-xl">
                Watch Our Introduction Video
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="services-title"
        className="relative isolate overflow-hidden bg-[#e8f2fa] py-16 text-[#102744] sm:py-20 lg:py-24"
        id="key-services"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(35,133,209,0.08),transparent_32%),linear-gradient(135deg,#e8f2fa,#dcebf7)]" />
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end lg:mb-14">
            <div className="max-w-190">
              <p className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#10c8e0]">
                Our Key Services
              </p>
              <h2
                className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]"
                id="services-title"
              >
                Comprehensive Genomic Solutions
              </h2>
              <p className="mt-4 max-w-175 text-sm leading-6 text-[#4e6d87] sm:text-base">
                From research to real-world applications, we provide genomic services to help unlock the potential of life’s code.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
              <span aria-live="polite" className="mr-1 hidden text-xs font-semibold tabular-nums text-[#58748d] sm:inline">
                {String(serviceIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </span>
              <a
                className="ml-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#b7d0e4] px-3 text-xs font-bold text-[#102744] transition-colors hover:border-[#10c8e0] hover:text-[#10c8e0] sm:min-h-12 sm:gap-3 sm:px-5 sm:text-sm"
                href="#services"
              >
                View All
                <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
              </a>
            </div>
          </div>

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
              <button
                aria-label="Previous services"
                className="absolute -left-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#f1f8fd] text-[#102744] shadow-lg transition-colors hover:bg-[#10c8e0] hover:text-[#050b1c] sm:-left-5"
                onClick={() => goToService(serviceIndex - 1)}
                type="button"
              >
                <span aria-hidden="true" className="text-2xl leading-none">‹</span>
              </button>
              <button
                aria-label="Next services"
                className="absolute -right-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#f1f8fd] text-[#102744] shadow-lg transition-colors hover:bg-[#10c8e0] hover:text-[#050b1c] sm:-right-5"
                onClick={() => goToService(serviceIndex + 1)}
                type="button"
              >
                <span aria-hidden="true" className="text-2xl leading-none">›</span>
              </button>
              <div className="overflow-hidden py-1">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  gap: `${cardGap}px`,
                  transform: `translateX(-${serviceIndex * (cardWidth + cardGap)}px)`,
                  width: cardWidth ? `${carouselServices.length * cardWidth + (carouselServices.length - 1) * cardGap}px` : "100%",
                }}
              >
                {carouselServices.map(({ name: service, description }, index) => {
                  const serviceIndexForCard = index % services.length;
                  return (
                    <a
                      className="group flex min-h-100 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#d4e5f2] bg-[#f7fbff] text-[#102744] shadow-[0_8px_24px_rgba(29,78,116,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[#10c8e0]/40 hover:shadow-xl"
                      href="#services"
                      key={`${service}-${index}`}
                      style={{ width: `${cardWidth}px` }}
                    >
                      <div
                        aria-hidden="true"
                        className="h-48.75 shrink-0 bg-[#102943] bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${homeBackground})`,
                          backgroundPosition: `${30 + (serviceIndexForCard % 4) * 15}% center`,
                        }}
                      />
                      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-9">
                        <span className="absolute -top-7 left-5 grid h-14 w-14 place-items-center rounded-xl border border-[#d4e5f2] bg-[#f7fbff] text-[#2385d1] shadow-sm transition-colors group-hover:bg-[#10c8e0] group-hover:text-[#050b1c]">
                          <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                            {serviceIndexForCard % 3 === 0 ? (
                              <>
                                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                              </>
                            ) : serviceIndexForCard % 3 === 1 ? (
                              <path d="M7 3c10 4 10 14 0 18m10-18C7 7 7 17 17 21M7 3h10M7 21h10M5 8h14m-14 8h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                            ) : (
                              <>
                                <path d="M4 19V5m0 14h16M8 16l3-4 3 2 5-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                                <circle cx="19" cy="7" r="1.3" fill="currentColor" />
                              </>
                            )}
                          </svg>
                        </span>
                        <h3 className="text-base font-bold leading-6 sm:text-[17px]">{service}</h3>
                        <p className="mt-3 text-sm leading-[1.6] text-[#58748d]">{description}</p>
                        <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-[#2385d1]">
                          Explore
                          <span aria-hidden="true" className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
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
                className={`h-1.75 rounded-full transition-all duration-300 ${
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
        className="bg-white py-16 sm:py-20 lg:py-24"
        id="scientific-journey"
      >
        <div className="site-container">
          <div className="mb-8 flex items-center justify-start gap-3 text-[#10c8e0]">
            <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 9c1.3-2.2 3.5-3.3 5.5-3.3S15.7 6.8 17 9c-1.3 2.2-3.5 3.3-5.5 3.3S8.3 11.2 7 9Zm10 6c-1.3-2.2-3.5-3.3-5.5-3.3S8.3 12.8 7 15c1.3 2.2 3.5 3.3 5.5 3.3S15.7 17.2 17 15Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5.7v12.6M5.5 12h13" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-semibold uppercase tracking-[0.14em]">Our Work Steps</span>
          </div>

          <h2
            className="max-w-330 text-left text-3xl font-bold leading-tight tracking-tight text-[#0b2d3c] sm:text-4xl lg:text-[42px]"
            id="journey-title"
          >
            From sample to discovery in four
            <span className="block">simple steps</span>
          </h2>

          <div className="relative mt-14 sm:mt-16">
            <div className="pointer-events-none absolute left-23 right-[calc(25%-92px)] top-9 hidden border-t-2 border-dashed border-[#cbd0d4] md:block" />
            <div className="grid gap-7 md:grid-cols-4 md:gap-0">
              {[
                {
                  number: "01",
                  title: "Sample Collection",
                  description: "Blood or DNA samples collected safely and efficiently",
                },
                {
                  number: "02",
                  title: "Sequencing & Genomic Data",
                  description: "Advanced sequencing generates high-quality genomic data",
                },
                {
                  number: "03",
                  title: "Bioinformatics Analysis",
                  description: "Computational pipelines process and analyze genomic data",
                },
                {
                  number: "04",
                  title: "Interpretation & Discovery",
                  description: "Expert interpretation turns results into meaningful scientific and clinical insights",
                },
              ].map(({ number, title, description }) => (
                <div className="group relative flex flex-col items-start" key={title}>
                  <div className="relative z-10 mx-2 mb-6 flex w-[calc(100%-1rem)] max-w-72 justify-start pl-5 sm:pl-12">
                    <div
                      aria-hidden="true"
                      className="grid h-16 w-16 place-items-center bg-[#f0f0ed] text-[22px] font-black text-[#102744] shadow-[0_6px_14px_rgba(15,23,42,0.07)] transition-colors duration-300 group-hover:bg-[#10c8e0] group-hover:text-[#050b1c] group-focus-within:bg-[#10c8e0] group-focus-within:text-[#050b1c] sm:h-18 sm:w-18"
                      style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
                    >
                      <span className="translate-y-0.5">{number}</span>
                    </div>
                  </div>

                  <div className="relative mx-2 min-h-36 w-[calc(100%-1rem)] max-w-72 px-5 pb-4 pt-1 text-left sm:min-h-40 sm:pl-12 sm:pr-5">
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 z-0 h-10 w-5 -translate-y-1/2 text-[#10c8e0] transition-transform duration-1000 ease-in-out group-hover:-translate-y-[calc(50%+8px)]"
                      fill="none"
                      viewBox="0 0 20 40"
                    >
                      <path d="M3 2 15 20 3 38" stroke="currentColor" strokeWidth="5" />
                    </svg>
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 z-10 w-0.5 bg-[#d0d4d7] shadow-[-2px_0_5px_rgba(16,39,68,0.12)]"
                    />
                    <h3 className="min-h-12 text-[18px] font-bold leading-tight text-[#102744] sm:min-h-14 sm:text-[21px]">
                      {title}
                    </h3>

                    <p className="mt-3 text-[14px] leading-[1.65] text-[#66727b] sm:text-[15px]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="team-title"
        className="bg-[#f5f8fb] py-16 sm:py-20 lg:py-24"
        id="team"
      >
        <div className="site-container">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#10c8e0]">
            Meet Our Team
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2
              className="text-3xl font-bold leading-tight tracking-tight text-[#102744] sm:text-4xl"
              id="team-title"
            >
              The People Behind ClinGene
            </h2>
            <a
              className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#10c8e0] transition-colors hover:text-[#10c8e0] sm:self-auto"
              href="#team"
            >
              Meet the team
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
            {[
              {
                initials: "AA",
                name: "Dr. Amjad Ali Tanoli",
                designation: "CEO",
                specialty: "Genetics & Precision Medicine",
              },
              {
                initials: "SA",
                name: "Dr. Safdar Ali Tanoli",
                designation: "Co-CEO",
                specialty: "Clinical and Genomic Research",
              },
              {
                initials: "KU",
                name: "Dr. Kifayat Ullah",
                designation: "Human Genetics",
                specialty: "Human Geneticist",
              },
            ].map(({ initials, name, designation, specialty }) => (
              <article
                className="group rounded-xl bg-white px-6 py-8 text-center shadow-[0_8px_28px_rgba(16,39,68,0.08)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_18px_36px_rgba(16,39,68,0.16)]"
                key={name}
              >
                <div className="mx-auto grid h-[150px] w-[150px] place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-[#dcecf8] to-[#b8d4e8] shadow-[0_4px_18px_rgba(16,39,68,0.14)] transition-transform duration-300 ease-out group-hover:scale-105">
                  <div className="relative flex h-full w-full flex-col items-center justify-end bg-gradient-to-b from-transparent via-transparent to-[#102744]/10">
                    <svg aria-hidden="true" className="mb-[-1px] h-[118px] w-[118px] text-[#7191a9]" fill="currentColor" viewBox="0 0 120 120">
                      <circle cx="60" cy="37" r="22" />
                      <path d="M18 120c2-31 18-49 42-49s40 18 42 49H18Z" />
                    </svg>
                    <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#10c8e0] text-[10px] font-bold text-[#050b1c]">
                      {initials}
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-bold text-[#102744]">{name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-[#0d766e]">
                  {designation}
                </p>
                <p className="mt-3 text-sm text-slate-600">{specialty}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Gallery and contact"
        className="bg-white py-12 sm:py-16 lg:py-20"
        id="gallery-contact"
      >
        <div className="site-container grid items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.72fr)] lg:gap-6">
          <div
            aria-labelledby="home-gallery-title"
            className="rounded-2xl bg-[#f6f8fb] p-6 sm:p-8"
            id="gallery"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#102744] sm:text-2xl" id="home-gallery-title">
                  Our Gallery
                </h2>
                <p className="mt-1 text-sm text-slate-500">Moments from Our Journey</p>
              </div>
              <a
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2385d1] transition-colors hover:text-[#10c8e0]"
                href="#gallery"
              >
                View All Gallery
                <span aria-hidden="true" className="text-2xl font-normal leading-none">→</span>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#2385d1] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(35,133,209,0.22)] transition-colors hover:bg-[#10c8e0]"
              href="#contact"
            >
              Contact Us
              <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
            </a>

            <address className="mt-7 space-y-5 not-italic text-sm leading-6 text-slate-600">
              <a className="flex items-start gap-3 transition-colors hover:text-[#10c8e0]" href="tel:+92515421056">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-3 2a16 16 0 0 0 5 5l2-3 5 2v4c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-.6.4-1 1-1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
                <span>+92 51 5421056</span>
              </a>
              <a className="flex items-start gap-3 break-all transition-colors hover:text-[#10c8e0]" href="mailto:info.alphagenomics@gmail.com">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
                <span>info.alphagenomics@gmail.com</span>
              </a>
              <div className="flex items-start gap-3">
                <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
                <span>Plot 4-C, Danyal Plaza, Block A, Main Double Road, PWD, Islamabad, Pakistan</span>
              </div>
            </address>
          </aside>
        </div>
      </section>

    </>
  );
}
