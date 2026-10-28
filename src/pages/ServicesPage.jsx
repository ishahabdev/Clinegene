import { ArrowRight, Dna, Play, ShieldPlus } from "lucide-react";
import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading";
import ScrollReveal from "../components/ScrollReveal.jsx";
import serviceHero from "../assets/service-hero.webp";
import services from "../data/services";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ServicesPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const sectionBg = isRed ? "#2d0306" : isGreen ? "#021e12" : "#02132a";

  const overlayGradient = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(2, 19, 42, 0.97) 0%, rgba(2, 19, 42, 0.84) 48%, rgba(2, 19, 42, 0.30) 80%, rgba(2, 19, 42, 0.15) 100%)";

  const badgeBg =
    theme === "red"
      ? "rgba(45, 3, 6, 0.88)"
      : theme === "green"
        ? "rgba(2, 30, 18, 0.88)"
        : "rgba(2, 19, 42, 0.88)";

  return (
    <>
      <section
        aria-labelledby="services-hero-title"
        className="relative isolate flex min-h-75 items-center overflow-hidden text-white sm:min-h-80 transition-colors duration-500"
        style={{ backgroundColor: sectionBg }}
      >
        <img
          alt=""
          aria-hidden="true"
          width="1376"
          height="768"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] transition-all duration-500"
          fetchPriority="high"
          src={serviceHero}
          style={{
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 transition-all duration-500"
          style={{
            background: overlayGradient,
          }}
        />

        <div className="site-container py-12 sm:py-16 lg:py-20">
          <div className="max-w-155">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-3 font-inter text-sm">
              <a
                className="transition-colors hover:text-white"
                style={{ color: "var(--accent)" }}
                href="/"
              >
                Home
              </a>
              <span aria-hidden="true" style={{ color: "var(--accent)" }}>›</span>
              <span aria-current="page" className="text-slate-300">Services</span>
            </nav>
            <p
              className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.24em] transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <span
                aria-hidden="true"
                className="h-0.5 w-9 transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              />
              Our Services
            </p>
            <ScrollReveal as="h1" className="font-outfit text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]" id="services-hero-title">
              Comprehensive Genomic
              <span
                className="block transition-colors"
                style={{
                  color: isRed ? "#ef4444" : "var(--accent)",
                  transition: "color 0.4s ease-in-out",
                }}
              >
                Services for a Healthier Tomorrow
              </span>
            </ScrollReveal>
            <p className="mt-3 max-w-125 font-inter text-sm sm:text-base leading-6 text-slate-200">
              We provide advanced genomic, genetic testing, bioinformatics and research services to
              help individuals, clinicians and researchers make data-driven decisions for better
              health and discovery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button className="font-inter" href="#service-catalog">
                Explore Services
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
              </Button>
              <a
                className="group inline-flex min-h-11 items-center gap-2.5 font-inter text-xs font-semibold text-white transition-colors hover:text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href="#contact"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full border transition-colors group-hover:opacity-90"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  <Play aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current" />
                </span>
                Talk to our team
              </a>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden site-container xl:block">
          <div
            className="absolute right-10 top-[24%] flex w-48 items-center gap-3 rounded-2xl border p-3 text-white shadow-[0_10px_28px_rgba(0,12,28,0.4)] backdrop-blur-sm"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: isRed ? "rgba(45,3,6,0.92)" : isGreen ? "rgba(2,30,18,0.92)" : "rgba(6,52,81,0.92)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Dna aria-hidden="true" className="h-7 w-7" />
            </span>
            <span className="font-inter text-xs font-semibold leading-[1.4]">Genomic insights<br />for your research</span>
          </div>
          <div
            className="absolute bottom-[9%] right-28 flex w-48 items-center gap-3 rounded-2xl border p-3 text-white shadow-[0_10px_28px_rgba(0,12,28,0.4)] backdrop-blur-sm"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: isRed ? "rgba(45,3,6,0.92)" : isGreen ? "rgba(2,30,18,0.92)" : "rgba(6,52,81,0.92)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              <ShieldPlus aria-hidden="true" className="h-7 w-7" />
            </span>
            <span className="font-inter text-xs font-semibold leading-[1.4]">Support from<br />testing to analysis</span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="service-catalog-title"
        className="py-12 md:py-16 transition-colors duration-500"
        style={{
          background: isRed
            ? "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)"
            : isGreen
              ? "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)"
              : "linear-gradient(180deg, #eaf8fc 0%, #f7fbfd 100%)",
        }}
        id="service-catalog"
      >
        <div className="site-container">
          <ScrollReveal as="div" className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p
                className="mb-2 flex items-center gap-2.5 font-inter text-[10px] font-bold uppercase tracking-[0.22em] transition-colors"
                style={{ color: "var(--accent-muted)" }}
              >
                <span
                  aria-hidden="true"
                  className="h-0.5 w-7 transition-colors"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                Our Services
              </p>
              <h2 className="font-outfit text-[28px] font-bold leading-tight text-[#0c2b48] sm:text-[34px]" id="service-catalog-title">
                Our{" "}
                <span
                  style={{
                    color: isRed ? "#b91c1c" : "var(--accent-dark)",
                    transition: "color 0.4s ease-in-out",
                  }}
                >
                  Specialized Services
                </span>
              </h2>
              <p className="mt-2 max-w-2xl font-inter text-sm leading-6 text-[#4a6e8b]">
                Explore ClinGene’s clinical testing, sequencing and bioinformatics services, with
                clear descriptions of the work each service supports.
              </p>
            </div>
            <Button
              className="min-h-0! px-4! py-2.5! font-inter"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)",
                color: "var(--accent-muted)",
              }}
              href="#contact"
              variant="transparent"
            >
              Contact ClinGene
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
            </Button>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ slug, name, description, Icon, image, width, height }, index) => {
              const serviceUrl = `/services/${slug}`;

              return (
                <ScrollReveal
                  as="a"
                  href={serviceUrl}
                  className="group flex min-h-63.25 flex-col overflow-hidden rounded-xl border border-[#c9e2ef] bg-[#f8fcff] hover:bg-(--accent-soft) shadow-[0_7px_18px_rgba(12,43,72,0.09)] transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_12px_28px_var(--accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                  delay={Math.min(index % 4, 3) * 55}
                  key={slug || name}
                >
                  <div className="relative aspect-2.5/1 overflow-hidden bg-[#102943]">
                    <img
                      alt={name}
                      width={width}
                      height={height}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                      loading="lazy"
                      src={image}
                    />
                    <span
                      className="absolute left-2 top-2 rounded-md px-2 py-1 font-inter text-[10px] font-bold tracking-wide text-white"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="relative flex flex-1 flex-col px-3 pb-3 pt-7 transition-colors duration-300">
                    <span
                      className="absolute -top-5 left-3 grid h-10 w-10 place-items-center rounded-xl border border-[#c9e2ef] bg-white shadow-[0_3px_10px_rgba(12,43,72,0.13)] transition-colors group-hover:bg-(--accent-btn-bg,var(--accent)) group-hover:text-(--accent-btn-text,white)"
                      style={{ color: "var(--accent-muted)" }}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="font-outfit text-[15px] font-bold leading-snug text-[#0c2b48] group-hover:text-(--accent-dark) transition-colors">{name}</h3>
                    <p className="mt-1.5 font-inter text-xs leading-normal text-[#4a6e8b]">{description}</p>
                    <span
                      className="mt-auto inline-flex items-center gap-1.5 pt-3 font-inter text-[11px] font-bold transition-colors text-[#0c2b48] group-hover:text-(--accent)"
                    >
                      Ask about this service
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <div
            className="mt-9 overflow-hidden rounded-2xl p-6 text-white shadow-[0_12px_28px_rgba(12,43,72,0.18)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8 transition-colors duration-500"
            style={{
              backgroundColor: isRed ? "#380408" : isGreen ? "#022013" : "#062b47",
            }}
          >
            <div>
              <p
                className="font-inter text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Need help choosing?
              </p>
              <h3 className="mt-2 font-outfit text-xl font-bold sm:text-2xl">Tell us about your research</h3>
              <p className="mt-2 max-w-xl font-inter text-sm leading-6 text-slate-300">
                Contact our team to discuss your sample, project goals and the services that fit your work.
              </p>
            </div>
            <Button className="mt-5 shrink-0 px-5! font-inter sm:mt-0" href="#contact">
              Contact our team
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
