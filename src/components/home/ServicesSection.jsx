import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../Button";
import SectionHeading from "../SectionHeading";
import services from "../../data/services";
export default function ServicesSection() {
  const [serviceIndex, setServiceIndex] = useState(0);
  const [servicesViewportWidth, setServicesViewportWidth] = useState(0);
  const servicesViewportRef = useRef(null);
  const cardsPerView = servicesViewportWidth >= 1024 ? 4 : servicesViewportWidth >= 640 ? 2 : 1;
  const cardGap = 16;
  const cardWidth = servicesViewportWidth ? (servicesViewportWidth - cardGap * (cardsPerView - 1)) / cardsPerView : 0;
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
  const goToService = (index) => { setServiceIndex((index + services.length) % services.length); };
    return (
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
            <Button
              aria-label="Previous services"
              className="!h-11 !min-h-11 !w-11 !rounded-full !border !border-slate-200 !p-0 !text-[#0c2b48] shadow-[0_4px_14px_rgba(12,43,72,0.14)] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={serviceIndex === 0}
              onClick={() => goToService(serviceIndex - 1)}
              variant="white"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </Button>
            <Button
              aria-label="Next services"
              className="!h-11 !min-h-11 !w-11 !rounded-full !border !border-slate-200 !p-0 !text-[#0c2b48] shadow-[0_4px_14px_rgba(12,43,72,0.14)] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={serviceIndex === services.length - 1}
              onClick={() => goToService(serviceIndex + 1)}
              variant="white"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </Button>
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
          <Button
            variant={serviceIndex === index ? "cyan" : "white"}
            aria-current={serviceIndex === index ? "true" : undefined}
            aria-label={`Show ${service.name}`}
                className={`!h-1.75 !min-h-1.75 !rounded-full !border-0 !p-0 transition-all duration-300 motion-reduce:transition-none ${
              serviceIndex === index
                ? "w-7 bg-[#10c8e0]"
                : "w-1.75 bg-[#9aafc1] hover:bg-[#10c8e0]/70"
            }`}
            key={service.name}
            onClick={() => goToService(index)}
          />
        ))}
      </div>
    </div>
  </section>
    );
}
