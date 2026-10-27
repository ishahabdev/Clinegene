import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { servicesData } from "../data/servicesData.js";

const homeBackground = "/images/home1.webp";

const contactPhone = "+92-3485607051";
const contactEmail = "Clinene@gmail.com";
const contactAddress =
  "Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road, Islamabad, Pakistan.";
const mapUrl =
  "https://maps.google.com/?q=Street+13,+Lane+10,+Hostel+City,+Chatta+Bakhtawar,+Chak+Shahzad,+Park+Road,+Islamabad,+Pakistan";
const mapEmbedUrl =
  "https://maps.google.com/maps?q=Street+13,+Lane+10,+Hostel+City,+Chatta+Bakhtawar,+Chak+Shahzad,+Park+Road,+Islamabad,+Pakistan&output=embed";

const contactCards = [
  {
    icon: "phone",
    title: "Call us",
    value: contactPhone,
    href: "tel:+923485607051",
    detail: "Speak with our team about your inquiry.",
  },
  {
    icon: "email",
    title: "Email us",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    detail: "Send us a message and we’ll get back to you.",
  },
  {
    icon: "location",
    title: "Visit us",
    value: "Islamabad, Pakistan",
    href: mapUrl,
    detail: contactAddress,
  },
];

function ContactIcon({ type }) {
  const paths = {
    phone: <path d="M7 3h3l2 5-2.5 1.8a14 14 0 0 0 4.7 4.7L16 12l5 2v3a2 2 0 0 1-2 2C10 19 5 14 5 5a2 2 0 0 1 2-2Z" />,
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}

function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const fullName = formData.get("fullName") || "";
  const email = formData.get("email") || "";
  const phone = formData.get("phone") || "";
  const organization = formData.get("organization") || "";
  const serviceSlug = formData.get("service") || "";
  const matchingService = servicesData.find((s) => s.slug === serviceSlug);
  const serviceName = matchingService ? matchingService.name : (serviceSlug || "Not specified");
  const subjectInput = formData.get("subject") || "";
  const message = formData.get("message") || "";

  const subject = encodeURIComponent(
    subjectInput ? `${subjectInput} - ${fullName}` : `Message from ${fullName}`
  );
  const body = encodeURIComponent(
    `Full Name: ${fullName}
Email Address: ${email}
Phone: ${phone || "Not specified"}
Organization: ${organization || "Not specified"}
Area of Interest: ${serviceName}
Subject: ${subjectInput || "General Inquiry"}

Message:
${message}`
  );

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
}

export default function ContactPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const [selectedService, setSelectedService] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("service") || "";
    }
    return "";
  });

  useEffect(() => {
    const updateServiceFromQuery = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setSelectedService(params.get("service") || "");
      }
    };

    updateServiceFromQuery();
    window.addEventListener("popstate", updateServiceFromQuery);
    return () => window.removeEventListener("popstate", updateServiceFromQuery);
  }, []);

  const overlayGradient = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(2, 19, 42, 0.97) 0%, rgba(2, 19, 42, 0.84) 48%, rgba(2, 19, 42, 0.30) 80%, rgba(2, 19, 42, 0.15) 100%)";

  // Featured card theme adaptive styling (Dark Green in Green theme, Dark Red in Red theme, Dark Blue in Cyan theme)
  const featuredBg = isRed ? "#200407" : isGreen ? "#0b1f1a" : "#050b1c";
  const featuredBorder = isRed
    ? "rgba(185, 28, 28, 0.35)"
    : isGreen
      ? "rgba(16, 185, 129, 0.3)"
      : "#0c2b48";
  const featuredAccent = isRed ? "#ef4444" : isGreen ? "#10b981" : "#10c8e0";
  const featuredIconBg = isRed
    ? "rgba(185, 28, 28, 0.16)"
    : isGreen
      ? "rgba(16, 185, 129, 0.16)"
      : "rgba(16, 200, 224, 0.12)";
  const featuredIconBorder = isRed
    ? "rgba(185, 28, 28, 0.45)"
    : isGreen
      ? "rgba(16, 185, 129, 0.4)"
      : "rgba(16, 200, 224, 0.35)";
  const featuredMuted = isRed ? "#d4b8bb" : isGreen ? "#9eb5ab" : "#c7d1e0";

  return (
    <div className="contact-page">
      <section
        aria-labelledby="contact-page-title"
        className="contact-hero relative isolate overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: isRed ? "#2d0306" : isGreen ? "#021e12" : "#050b1c",
        }}
      >
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-all duration-500"
          src={homeBackground}
          style={{
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
        />
        <div
          className="contact-hero-overlay transition-all duration-500"
          style={{ background: overlayGradient }}
        />
        <div className="site-container contact-hero-content">
          <p className="contact-breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span> Contact</p>
          <p className="contact-eyebrow">We’re here to help</p>
          <ScrollReveal as="h1" id="contact-page-title">Contact Us</ScrollReveal>
          <p>Have a question about our research or services? Get in touch with the ClinGene team.</p>
        </div>
      </section>

      <section aria-label="ClinGene contact details" className="contact-details-section">
        <div className="site-container contact-cards">
          {contactCards.map((card, index) => {
            const isFeatured = index === 1;
            return (
              <ScrollReveal
                as="article"
                className={`contact-info-card${isFeatured ? " contact-info-card-featured" : ""}`}
                delay={index * 60}
                key={card.title}
                style={
                  isFeatured
                    ? {
                        backgroundColor: featuredBg,
                        borderColor: featuredBorder,
                        transition: "background-color 0.4s ease, border-color 0.4s ease",
                      }
                    : undefined
                }
              >
                <span
                  className="contact-info-icon"
                  style={
                    isFeatured
                      ? {
                          backgroundColor: featuredIconBg,
                          borderColor: featuredIconBorder,
                          color: featuredAccent,
                          transition: "all 0.4s ease",
                        }
                      : {
                          backgroundColor: isRed
                            ? "rgba(185, 28, 28, 0.08)"
                            : isGreen
                              ? "rgba(16, 185, 129, 0.08)"
                              : "rgba(16, 200, 224, 0.10)",
                          borderColor: isRed
                            ? "rgba(185, 28, 28, 0.3)"
                            : isGreen
                              ? "rgba(16, 185, 129, 0.3)"
                              : "rgba(16, 200, 224, 0.35)",
                          color: isRed ? "#b91c1c" : isGreen ? "#10b981" : "#10c8e0",
                          transition: "all 0.4s ease",
                        }
                  }
                >
                  <ContactIcon type={card.icon} />
                </span>
                <h2>{card.title}</h2>
                <a
                  href={card.href}
                  rel={card.href.startsWith("https:") ? "noreferrer" : undefined}
                  target={card.href.startsWith("https:") ? "_blank" : undefined}
                  style={
                    isFeatured
                      ? { color: featuredAccent, transition: "color 0.3s ease" }
                      : { color: isRed ? "#b91c1c" : isGreen ? "#059669" : "#079bb0", transition: "color 0.3s ease" }
                  }
                >
                  {card.value}
                </a>
                <p style={isFeatured ? { color: featuredMuted } : undefined}>{card.detail}</p>
                <a
                  className="contact-card-link"
                  href={card.href}
                  rel={card.href.startsWith("https:") ? "noreferrer" : undefined}
                  target={card.href.startsWith("https:") ? "_blank" : undefined}
                  style={
                    isFeatured
                      ? { color: featuredAccent, transition: "color 0.3s ease" }
                      : undefined
                  }
                >
                  {index === 2 ? "Get directions" : "Contact us"} <span aria-hidden="true">→</span>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section aria-label="Contact information and message form" className="contact-main-section">
        <div className="site-container contact-main-grid">
          <div className="contact-location-column">
            <p className="contact-section-eyebrow">Find us</p>
            <h2>Our location</h2>
            <p className="contact-location-address">
              {contactAddress}
            </p>
            <div className="contact-map">
              <iframe
                title="Map showing ClinGene’s location in Islamabad"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="contact-directions-link" href={mapUrl} rel="noreferrer" target="_blank">
              View directions on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Send us a message Form Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-9 shadow-[0_12px_36px_rgba(5,11,28,0.06)]">
            <h2 className="font-['Poppins',sans-serif] text-[24px] sm:text-[28px] font-bold leading-snug text-[#0c2b48]">
              Send us a message
            </h2>
            <p className="mt-1 text-xs sm:text-[14px] text-slate-500 font-['Inter',sans-serif]">
              Fill in the form and our team will get back to you shortly.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleContactSubmit}>
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-full-name" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-full-name"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+92 ..."
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-organization" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                    Organization
                  </label>
                  <input
                    id="contact-organization"
                    name="organization"
                    placeholder="University / Company"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Area of Interest */}
              <div>
                <label htmlFor="contact-service" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                  Area of Interest
                </label>
                <div className="relative">
                  <select
                    id="contact-service"
                    name="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full h-11 appearance-none px-3.5 pr-10 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    {servicesData.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                    <option value="research-collaboration">Research Collaboration</option>
                    <option value="training-workshops">Training &amp; Workshops</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Row 4: Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  placeholder="How can we help?"
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              {/* Row 5: Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Write your message..."
                  required
                  rows={4}
                  className="w-full p-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 leading-relaxed transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#0f2137] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#091524] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2137] cursor-pointer"
                >
                  <span>Send Message</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
