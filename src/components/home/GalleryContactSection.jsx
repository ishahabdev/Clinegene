import { ArrowRight } from "lucide-react";
import Button from "../Button";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import gallery1 from "../../assets/home/gallery1.jpeg";
import gallery2 from "../../assets/home/gallery2.jpeg";
export default function GalleryContactSection() {
  const { theme } = useTheme();

  const overlayColor =
    theme === "red"
      ? "rgba(45, 3, 6, 0.65)"
      : theme === "green"
        ? "rgba(2, 30, 18, 0.65)"
        : "rgba(2, 19, 42, 0.65)";

  const buttonColor =
    theme === "red"
      ? "!bg-red-600 hover:!bg-red-700"
      : theme === "green"
        ? "!bg-green-600 hover:!bg-green-700"
        : "!bg-[#2385d1] hover:!bg-[#1a6fb8]";

  return (
    <section
      aria-labelledby="home-gallery-title"
      className="bg-white py-16 md:py-24"
      id="gallery-contact"
    >
      <div className="site-container">
        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.72fr)] lg:gap-6">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                image: gallery1,
                label: "Genomics Research",
              },
              {
                image: gallery2,
                label: "DNA Sequencing & Analysis",
              },
            ].map(({ image, label }, index) => (
              <ScrollReveal
                as="a"
                aria-label={`View gallery: ${label}`}
                className="group relative block h-56 overflow-hidden rounded-xl sm:h-52 lg:h-64 shadow-sm"
                delay={index * 80}
                href="#gallery"
                key={label}
              >
                <img
                  alt={label}
                  width="1376"
                  height="768"
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  decoding="async"
                  loading="lazy"
                  src={image}
                />
                <span
                  className="absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90"
                  style={{ backgroundColor: overlayColor }}
                />
                <span className="absolute inset-x-4 bottom-4 text-sm font-semibold text-white sm:text-base">
                  {label}
                </span>
              </ScrollReveal>
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
        <Button className={`mt-6 !text-white hover:!text-white ${buttonColor}`} href="/contact">
          Contact Us <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
        <address className="mt-7 space-y-5 not-italic text-sm leading-6 text-slate-600">
          {/* Phone hidden until confirmed by client per SECP personal data guidelines */}
          <a className="flex items-start gap-3 break-all transition-colors hover:text-[#0a7a94] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]" href="mailto:info@clingene.co">
            <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
            <span>info@clingene.co</span>
          </a>
          <div className="flex items-start gap-3">
            <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9c9c]" fill="none" viewBox="0 0 24 24">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <span>Islamabad, Pakistan</span>
          </div>
        </address>
      </aside>
    </div>
  </div>
</section>
    );
}
