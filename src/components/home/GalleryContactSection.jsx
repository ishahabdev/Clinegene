import { ArrowRight } from "lucide-react";
import Button from "../Button";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
const homeBackground = "/images/homepic.webp";
export default function GalleryContactSection() {
    return (
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
          ].map(({ label, position }, index) => (
            <ScrollReveal
              as="a"
              aria-label={`View gallery: ${label}`}
              className="group relative block h-52 overflow-hidden rounded-xl bg-[#102943] sm:h-48 lg:h-56"
              delay={index * 60}
              href="#gallery"
              key={label}
            >
              <img
                alt={label}
                width="2014"
                height="781"
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
        <Button className="mt-6 !bg-[#2385d1] !text-white hover:!text-white" href="#contact">
          Contact Us <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
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
    );
}
