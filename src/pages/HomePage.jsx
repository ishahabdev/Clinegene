import { useEffect, useRef, useState } from "react";
import homeBackground from "../assets/home1.png";
import clingeneLogo from "../assets/clingene-logo.png";

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

  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setServicesViewportWidth(entry.contentRect.width);
    });
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

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
              Human Genetics <span className="mx-1 text-[#d8203a]">|</span> Omic Sciences{" "}
              <span className="mx-1 text-[#d8203a]">|</span> Biomedical Research
            </p>
            <h1
              className="max-w-147.5 text-[34px] font-bold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[50px]"
              id="hero-title"
            >
              Advancing Human Genetics &amp; Precision Medicine
              <span className="mt-1 block text-[#bd0d27]">Through Research</span>
            </h1>
            <p className="mt-5 max-w-125 text-sm leading-6 text-slate-200 sm:text-base">
              ClinGene brings academic researchers, clinicians and industrial partners together
              to translate scientific findings for the well-being of the society.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d41e38] px-6 text-xs font-bold text-white transition-colors hover:bg-[#b7142b] sm:text-sm"
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#bd0d27]">
              About ClinGene
            </p>
            <h2
              className="max-w-200 text-3xl font-bold leading-[1.12] tracking-tight text-[#102744] sm:text-4xl lg:text-[44px]"
              id="about-title"
            >
              Pakistan’s Pioneer in{" "}
              <span className="text-[#bd0d27]">Life Sciences Research</span>
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
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#bd0d27] px-7 text-sm font-bold text-white shadow-[0_10px_22px_rgba(189,13,39,0.2)] transition-colors hover:bg-[#9f0b21]"
                href="#services"
              >
                Explore Our Services
                <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bd0d27]/30 px-7 text-sm font-bold text-[#bd0d27] transition-colors hover:bg-[#bd0d27]/5"
                href="#contact"
              >
                Contact Us
              </a>
              <a
                className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-bold text-[#bd0d27] transition-colors hover:text-[#9f0b21]"
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
            <div className="absolute left-1/2 top-1/2 grid h-19 w-19 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#bd0d27] shadow-lg">
              <svg aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4.8c0-.8.9-1.3 1.6-.9l11.1 7.2a1.1 1.1 0 0 1 0 1.8L8.6 20.1c-.7.4-1.6-.1-1.6-.9V4.8Z" />
              </svg>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e7465d]">
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
              <p className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#bd0d27]">
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
            <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
              <span aria-live="polite" className="mr-1 text-xs font-semibold tabular-nums text-[#58748d]">
                {String(serviceIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </span>
              <a
                className="ml-2 hidden min-h-12 items-center justify-center gap-3 rounded-full border border-[#b7d0e4] px-5 text-sm font-bold text-[#102744] transition-colors hover:border-[#bd0d27] hover:text-[#bd0d27] lg:inline-flex"
                href="#services"
              >
                View All
                <span aria-hidden="true" className="text-xl font-normal leading-none">→</span>
              </a>
            </div>
          </div>

          <div className="relative">
            <button
              aria-label="Previous services"
              className="absolute -left-7 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f1f8fd] text-[#102744] shadow-lg transition-colors hover:bg-[#bd0d27] hover:text-white sm:-left-8"
              onClick={() => setServiceIndex((current) => (current - 1 + services.length) % services.length)}
              type="button"
            >
              <span aria-hidden="true" className="text-2xl leading-none">‹</span>
            </button>
            <button
              aria-label="Next services"
              className="absolute -right-7 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f1f8fd] text-[#102744] shadow-lg transition-colors hover:bg-[#bd0d27] hover:text-white sm:-right-8"
              onClick={() => setServiceIndex((current) => (current + 1) % services.length)}
              type="button"
            >
              <span aria-hidden="true" className="text-2xl leading-none">›</span>
            </button>
            <div className="overflow-hidden" ref={servicesViewportRef}>
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
                      className="group flex min-h-100 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#d4e5f2] bg-[#f7fbff] text-[#102744] shadow-[0_8px_24px_rgba(29,78,116,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[#bd0d27]/40 hover:shadow-xl"
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
                        <span className="absolute -top-7 left-5 grid h-14 w-14 place-items-center rounded-xl border border-[#d4e5f2] bg-[#f7fbff] text-[#2385d1] shadow-sm transition-colors group-hover:bg-[#bd0d27] group-hover:text-white">
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
          <div aria-label="Choose a service" className="mt-8 flex items-center justify-center gap-2" role="group">
            {services.map((service, index) => (
              <button
                aria-current={serviceIndex === index ? "true" : undefined}
                aria-label={`Show ${service.name}`}
                className={`h-1.75 rounded-full transition-all duration-300 ${
                  serviceIndex === index
                    ? "w-7 bg-[#bd0d27]"
                    : "w-1.75 bg-[#9aafc1] hover:bg-[#bd0d27]/70"
                }`}
                key={service.name}
                onClick={() => setServiceIndex(index)}
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
          <div className="mb-8 flex items-center justify-start gap-3 text-[#bd0d27]">
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
                      className="grid h-16 w-16 place-items-center bg-[#f0f0ed] text-[22px] font-black text-[#102744] shadow-[0_6px_14px_rgba(15,23,42,0.07)] transition-colors duration-300 group-hover:bg-[#bd0d27] group-hover:text-white group-focus-within:bg-[#bd0d27] group-focus-within:text-white sm:h-18 sm:w-18"
                      style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
                    >
                      <span className="translate-y-0.5">{number}</span>
                    </div>
                  </div>

                  <div className="relative mx-2 min-h-36 w-[calc(100%-1rem)] max-w-72 px-5 pb-4 pt-1 text-left sm:min-h-40 sm:pl-12 sm:pr-5">
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 z-0 h-10 w-5 -translate-y-1/2 text-[#bd0d27] transition-transform duration-1000 ease-in-out group-hover:-translate-y-[calc(50%+8px)]"
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
        aria-labelledby="trust-title"
        className="bg-[#f5f8fb] py-16 sm:py-20"
        id="trust"
      >
        <div className="site-container">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#bd0d27]">
            Why ClinGene
          </p>
          <h2
            className="text-3xl font-bold leading-tight tracking-tight text-[#102744] sm:text-4xl"
            id="trust-title"
          >
            Trusted by Researchers and Clinicians
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["5,000+", "Samples Processed"],
              ["50+", "Research Collaborations"],
              ["20+", "Publications"],
              ["13", "Genomic Services"],
            ].map(([value, label]) => (
              <div
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                key={label}
              >
                <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full bg-[#bd0d27]" />
                <p className="text-3xl font-bold tracking-tight text-[#102744] sm:text-4xl">{value}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold text-[#102744]">Partners and Collaborators</h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ["RI", "Research Institute", "#2385d1"],
                ["U", "University", "#bd0d27"],
                ["GC", "Genomics Center", "#0d766e"],
                ["CL", "Clinical Lab", "#7048a8"],
                ["MC", "Medical College", "#d47a1f"],
                ["SN", "Science Network", "#34805b"],
              ].map(([mark, partner, color]) => (
                <div
                  aria-label={`${partner} logo placeholder`}
                  className="group flex min-h-20 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 grayscale transition duration-200 hover:scale-[1.02] hover:grayscale-0 sm:text-xs"
                  key={partner}
                  role="img"
                  style={{ "--partner-color": color }}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-current text-[10px] font-black transition-colors group-hover:text-(--partner-color)"
                  >
                    {mark}
                  </span>
                  <span className="group-hover:text-(--partner-color)">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer
        className="relative isolate overflow-hidden bg-[#031b37] text-white"
        style={{
          backgroundImage: `linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94)), url(${homeBackground})`,
          backgroundPosition: "center 38%",
          backgroundSize: "cover",
        }}
      >
        <div className="site-container pb-5 pt-8 sm:pt-10">
          <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-7 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fb6ce]">
                Open Positions
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Join Our Research Community
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
                Be a part of our mission to advance human genetics and biomedical research.
              </p>
            </div>
            <a
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#bd0d27] px-5 text-xs font-bold text-white transition-colors hover:bg-[#d41e38] sm:self-center"
              href="#open-positions"
            >
              View Open Positions
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr_0.7fr] lg:gap-7">
            <a aria-label="ClinGene home" className="flex w-fit items-center rounded-xl bg-white p-3" href="#home">
              <img
                alt="ClinGene — Human Genetics and Biomedical Research"
                className="w-40 object-contain"
                src={clingeneLogo}
              />
            </a>

            <nav aria-label="Footer quick links">
              <h3 className="mb-3 text-sm font-bold text-white">Quick Links</h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                {[
                  ["Home", "#home"],
                  ["CEO Message", "#ceo-message"],
                  ["About", "#about"],
                  ["Team", "#team"],
                  ["Services", "#services"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a className="transition-colors hover:text-[#d41e38] hover:underline" href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer research links">
              <h3 className="mb-3 text-sm font-bold text-white">Research</h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                {[
                  ["Research", "#research"],
                  ["Gallery", "#gallery"],
                  ["Open Positions", "#open-positions"],
                  ["News", "#news"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a className="transition-colors hover:text-[#d41e38] hover:underline" href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="mb-3 text-sm font-bold text-white">Contact Information</h3>
              <a
                className="text-sm leading-6 text-white/80 transition-colors hover:text-[#d41e38]"
                href="#contact"
              >
                For inquiries, please get in touch with our team.
                <span className="mt-1 block font-semibold text-white">Contact ClinGene →</span>
              </a>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold text-white">Follow Us</h3>
              <a
                aria-label="Contact ClinGene about social media"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/10"
                href="#contact"
              >
                in
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/15 pt-4 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ClinGene (Pvt.) Ltd. All Rights Reserved.</p>
            <div className="flex gap-4 text-sm">
              <a className="transition-colors hover:text-[#d41e38]" href="#privacy-policy">Privacy Policy</a>
              <span aria-hidden="true" className="text-white/30">|</span>
              <a className="transition-colors hover:text-[#d41e38]" href="#terms-of-use">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
