import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { servicesData } from "../data/servicesData.js";

const homeBackground = "/images/home1.webp";

const contactPhone = "+92 348 5607051";
const contactPhoneRaw = "+923485607051";
const contactEmail = "info@clingene.co";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent("Inquiry - ClinGene")}`;
const contactAddress = "Islamabad, Pakistan";
const mapUrl = "https://maps.google.com/?q=Islamabad,+Pakistan";
const mapEmbedUrl = "https://maps.google.com/maps?q=Islamabad,+Pakistan&output=embed";

const contactCards = [
  {
    icon: "phone",
    title: "Call us",
    value: contactPhone,
    href: `tel:${contactPhoneRaw}`,
    detail: "Speak with our team about your inquiry.",
    isFeatured: false,
  },
  {
    icon: "email",
    title: "Email us",
    value: contactEmail,
    href: gmailComposeUrl,
    detail: "Send us a message and we’ll get back to you.",
    isFeatured: true,
  },
  {
    icon: "location",
    title: "Visit us",
    value: "Islamabad, Pakistan",
    href: mapUrl,
    detail: contactAddress,
    isFeatured: false,
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

export default function ContactPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const formRef = useRef(null);
  const turnstileContainerRef = useRef(null);

  const [selectedService, setSelectedService] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("service") || "";
    }
    return "";
  });

  const isCareerOption =
    selectedService === "job" ||
    selectedService === "job-application" ||
    selectedService === "internship";

  // Cloudflare Turnstile Integration (optional / non-blocking)
  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || typeof window === "undefined") return;

    let widgetId = null;
    const scriptId = "cf-turnstile-script";

    const renderWidget = () => {
      if (window.turnstile && turnstileContainerRef.current) {
        try {
          widgetId = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            callback: (token) => setTurnstileToken(token),
            "expired-callback": () => setTurnstileToken(""),
            "error-callback": () => setTurnstileToken(""),
          });
        } catch (e) {
          console.warn("Turnstile render warning:", e);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (_) {}
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const form = formRef.current || e.currentTarget;
    const formData = new FormData(form);

    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const organization = (formData.get("organization") || "").toString().trim();
    const serviceSlug = (formData.get("service") || "").toString().trim();
    const subjectInput = (formData.get("subject") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const position = (formData.get("position") || "").toString().trim();
    const coverNote = (formData.get("coverNote") || "").toString().trim();
    const websiteHoneypot = (formData.get("website") || "").toString().trim();

    // Inline field validation
    if (!fullName || fullName.length < 2) {
      setSubmitStatus({ type: "error", message: "Please enter your full name (minimum 2 characters)." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubmitStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!serviceSlug) {
      setSubmitStatus({ type: "error", message: "Please select a primary service of interest." });
      return;
    }

    const isCareer =
      serviceSlug === "job" ||
      serviceSlug === "job-application" ||
      serviceSlug === "internship";

    if (!isCareer && (!message || message.length < 5)) {
      setSubmitStatus({
        type: "error",
        message: "Please provide your project requirements or inquiry details.",
      });
      return;
    }

    const matchingService = servicesData.find((s) => s.slug === serviceSlug);
    const serviceDisplayName = matchingService
      ? matchingService.name
      : serviceSlug === "job" || serviceSlug === "job-application"
        ? "Job Application"
        : serviceSlug === "internship"
          ? "Internship Application"
          : serviceSlug === "general-inquiry"
            ? "General Inquiry / Consultation"
            : serviceSlug === "research-collaboration"
              ? "Research Collaboration"
              : serviceSlug;

    const payload = {
      fullName,
      email,
      phone,
      organization,
      service: serviceDisplayName,
      subject: subjectInput,
      message,
      position,
      coverNote,
      website: websiteHoneypot,
      turnstileToken,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result = {};
      const responseText = await response.text();
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn("[Contact API Non-JSON Response]", responseText);
        result = { error: `Server returned status ${response.status}. Please check your connection or server configuration.` };
      }

      if (!response.ok) {
        throw new Error(result.error || `Failed to send message (Status: ${response.status}). Please try again later.`);
      }

      setSubmitStatus({
        type: "success",
        message: result.message || "Thank you! Your message has been sent. Our team will get back to you shortly.",
      });

      // Clear the form
      form.reset();
      setTurnstileToken("");
      setSelectedService("");
      if (typeof window !== "undefined" && window.turnstile && typeof window.turnstile.reset === "function") {
        try {
          window.turnstile.reset();
        } catch (_) {}
      }
    } catch (err) {
      console.error("[Submission Error]", err);
      setSubmitStatus({
        type: "error",
        message: err.message || "Failed to send message. Please try again or email us directly at info@clingene.co.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          width="1672"
          height="941"
          fetchPriority="high"
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
        <div className="site-container contact-cards !grid-cols-1 md:!grid-cols-3 max-w-6xl mx-auto">
          {contactCards.map((card, index) => {
            const isFeatured = card.isFeatured;
            return (
              <ScrollReveal
                as="article"
                className={`contact-info-card${isFeatured ? " contact-info-card-featured" : ""} cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-6px_rgba(12,43,72,0.18)]`}
                delay={index * 60}
                key={card.title}
                onClick={(e) => {
                  if (e.target.closest("a")) return;
                  if (card.href.startsWith("https:")) {
                    window.open(card.href, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.href = card.href;
                  }
                }}
                style={
                  isFeatured
                    ? {
                        backgroundColor: featuredBg,
                        borderColor: featuredBorder,
                        boxShadow: "0 18px 45px -8px rgba(5, 11, 28, 0.45)",
                        transition: "background-color 0.4s ease, border-color 0.4s ease, transform 0.25s ease, box-shadow 0.25s ease",
                      }
                    : {
                        backgroundColor: "#ffffff",
                        borderColor: "#dbe5ee",
                        boxShadow: "0 14px 34px -4px rgba(12, 43, 72, 0.12), 0 4px 14px rgba(12, 43, 72, 0.05)",
                        transition: "background-color 0.4s ease, border-color 0.4s ease, transform 0.25s ease, box-shadow 0.25s ease",
                      }
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
                  rel={card.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                  target={card.href.startsWith("https:") ? "_blank" : undefined}
                  title={isFeatured ? "Compose email in Gmail" : undefined}
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
                  rel={card.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                  target={card.href.startsWith("https:") ? "_blank" : undefined}
                  title={isFeatured ? "Compose email in Gmail" : undefined}
                  style={
                    isFeatured
                      ? { color: featuredAccent, transition: "color 0.3s ease" }
                      : undefined
                  }
                >
                  {index === 2 ? "Get directions" : index === 0 ? "Call now" : "Contact us"} <span aria-hidden="true">→</span>
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
                width="600"
                height="450"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="contact-directions-link" href={mapUrl} rel="noopener noreferrer" target="_blank">
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

            <form ref={formRef} className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Spam Protection Honeypot Field */}
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                <label htmlFor="website">Leave this field blank</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {submitStatus && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-3 transition-all ${
                    submitStatus.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border border-rose-200 text-rose-800"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="flex-1 leading-relaxed">{submitStatus.message}</div>
                </div>
              )}

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
                    {isCareerOption ? "Current Institution / University" : "Organization"}
                  </label>
                  <input
                    id="contact-organization"
                    name="organization"
                    placeholder={isCareerOption ? "e.g. NUST / Quaid-i-Azam University" : "University / Company"}
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Area of Interest with optgroup */}
              <div>
                <label htmlFor="contact-service" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                  Primary Service of Interest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="contact-service"
                    name="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="w-full h-11 appearance-none px-3.5 pr-10 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select an option...</option>
                    
                    <optgroup label="General">
                      <option value="general-inquiry">General Inquiry / Consultation</option>
                      <option value="research-collaboration">Research Collaboration</option>
                    </optgroup>

                    <optgroup label="Services">
                      {servicesData.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Careers">
                      <option value="job">Job Application</option>
                      <option value="internship">Internship</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Conditional Careers Fields: Position & CV upload */}
              {isCareerOption && (
                <div className="space-y-4 rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 transition-all">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                    <span>Careers Intake Desk</span>
                    <span className="text-[11px] font-normal text-blue-700">Routed to careers@clingene.co</span>
                  </div>

                  <div>
                    <label htmlFor="contact-position" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                      Position / Research Area Applied For <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-position"
                      name="position"
                      required
                      placeholder="e.g. Molecular Biologist / Bioinformatician / Lab Intern"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-cover-note" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                      Cover Note / Statement of Interest <span className="text-[11px] font-normal text-slate-500">(Optional)</span>
                    </label>
                    <textarea
                      id="contact-cover-note"
                      name="coverNote"
                      placeholder="Briefly describe your research experience, technical skills, and career motivation..."
                      rows={3}
                      className="w-full p-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 leading-relaxed transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Standard Subject & Message (when not careers) */}
              {!isCareerOption && (
                <>
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

                  <div>
                    <label htmlFor="contact-message" className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 font-['Inter',sans-serif]">
                      Project Requirements / Sample Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Give details or text here..."
                      required
                      rows={4}
                      className="w-full p-3.5 rounded-lg border border-slate-200 bg-white text-sm font-['Inter',sans-serif] text-slate-800 placeholder:text-slate-400 leading-relaxed transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y"
                    />
                  </div>
                </>
              )}

              {/* Cloudflare Turnstile Verification Widget */}
              <div ref={turnstileContainerRef} className="my-2" />

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#0f2137] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#091524] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2137] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span>Sending...</span>
                      <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <span>{isCareerOption ? "Submit Application" : "Send Message"}</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
