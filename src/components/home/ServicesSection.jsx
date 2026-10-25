import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../Button";
import SectionHeading from "../SectionHeading";
import services from "../../data/services";
export default function ServicesSection() {
  const [serviceIndex, setServiceIndex] = useState(0);
  const [servicesViewportWidth, setServicesViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Math.max(
      0,
      Math.min(window.innerWidth, 1212) - (window.innerWidth < 1280 ? 48 : 0),
    );
  });
  const servicesViewportRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const cardsPerView = servicesViewportWidth >= 1024 ? 4 : servicesViewportWidth >= 640 ? 2 : 1;
  const cardGap = 18;
  const cardWidth = servicesViewportWidth ? (servicesViewportWidth - cardGap * (cardsPerView - 1)) / cardsPerView : 0;
  const carouselServices = [...services, ...services.slice(0, cardsPerView - 1)];
  const touchStartX = useRef(null);
  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport) return undefined;
    const measureViewport = () => setServicesViewportWidth(viewport.clientWidth);
    measureViewport();
    const resizeObserver = new ResizeObserver(measureViewport);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);
  const goToService = (index) => { setServiceIndex((index + services.length) % services.length); };
  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport || !cardWidth) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = viewport.scrollLeft;
    const target = Math.min(
      serviceIndex * (cardWidth + cardGap),
      viewport.scrollWidth - viewport.clientWidth,
    );
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
    }
    if (reduceMotion || Math.abs(target - start) < 1) {
      viewport.scrollLeft = target;
      return undefined;
    }

    const duration = 700;
    const startedAt = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      viewport.scrollLeft = start + (target - start) * eased;

      if (progress < 1) {
        scrollFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        scrollFrameRef.current = null;
      }
    };

    scrollFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [cardGap, cardWidth, serviceIndex]);
    return (
<section
    aria-labelledby="services-title"
    className="relative isolate overflow-hidden bg-[#eaf6fa] py-16 text-[#102744] md:py-24"
    id="key-services"
  >
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(35,133,209,0.08),transparent_32%),linear-gradient(135deg,#eaf6fa,#eaf6fa)]" />
    <div className="mx-auto w-full max-w-[1212px] px-6 xl:px-0">
      <SectionHeading
        action={{ label: "View All", href: "/services" }}
        description="From research to real-world applications, we provide genomic services to help unlock the potential of life's code."
        eyebrow="Our Services"
        id="services-title"
        highlight="Genomic Solutions"
        title="Comprehensive"
      />

      <div className="relative mx-auto w-full">
        <Button
          variant="cyan"
          aria-label="Previous services"
          className="service-carousel-control !absolute !left-[-56px] !top-1/2 !z-10 !hidden !h-11 !min-h-11 !w-11 !-translate-y-1/2 !rounded-full !border !border-slate-200 !p-0 !text-[#04152b] shadow-[0_4px_14px_rgba(12,43,72,0.14)] !transition-all duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 2xl:!flex"
          disabled={serviceIndex === 0}
          onClick={() => goToService(serviceIndex - 1)}
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </Button>
        <Button
          variant="cyan"
          aria-label="Next services"
          className="service-carousel-control !absolute !right-[-56px] !top-1/2 !z-10 !hidden !h-11 !min-h-11 !w-11 !-translate-y-1/2 !rounded-full !border !border-slate-200 !p-0 !text-[#04152b] shadow-[0_4px_14px_rgba(12,43,72,0.14)] !transition-all duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 2xl:!flex"
          disabled={serviceIndex === services.length - 1}
          onClick={() => goToService(serviceIndex + 1)}
        >
          <ChevronRight aria-hidden="true" size={18} />
        </Button>
        <div
          className="relative w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
          <div
            className="flex w-max"
            style={{
              gap: `${cardGap}px`,
              width: `${carouselServices.length * cardWidth + (carouselServices.length - 1) * cardGap}px`,
            }}
          >
            {carouselServices.map((service, index) => {
              return (
                <a
                  className="service-card group flex min-h-[29.25rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#d4e5f2] border-t-4 border-t-[#d4e5f2] hover:border-t-[var(--accent)] bg-[#f7fbff] text-[#102744] transition-all duration-[800ms] ease-in-out hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                  href="#services"
                  key={`${service}-${index}`}
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="relative aspect-[3.5/2.5] w-full min-w-0 overflow-hidden bg-[#102943]">
                    <img
                      alt=""
                      aria-hidden="true"
                      className="block h-full w-full object-cover object-center transition-transform duration-[800ms] ease-in-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                      loading="lazy"
                      src={service.image}
                    />
                  </div>
                  <div className="relative flex flex-1 flex-col px-5 pb-5 pt-11">
                    {/* Icon badge — rests & hover both themed via CSS vars */}
                    <span className="service-card-icon absolute -top-[30px] left-5 grid h-[60px] w-[60px] place-items-center rounded-[15px] border border-[#d4e5f2] shadow-[0_3px_8px_rgba(12,43,72,0.12)] transition-all duration-[800ms] ease-in-out group-hover:scale-110 group-hover:-rotate-6 group-focus-within:scale-110 group-focus-within:-rotate-6 motion-reduce:transform-none motion-reduce:transition-none">
                      <service.Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-4 text-[18px] font-bold leading-[1.35] transition-colors duration-[800ms] ease-in-out group-hover:text-[#0a5265] group-focus-within:text-[#0a5265] motion-reduce:transition-none">{service.name}</h3>
                    <p className="mt-3 text-base leading-[1.6] text-[#58748d]">{service.description}</p>
                    <span className="service-card-explore mt-auto inline-flex items-center gap-2 whitespace-nowrap pt-5 text-base font-bold">
                      Explore
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-[800ms] ease-in-out group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                    </span>
                  </div>
                </a>
              );
            })}
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
                ? "w-7"
                : "w-1.75 !bg-[#9aafc1] hover:!bg-[var(--accent)]"
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
