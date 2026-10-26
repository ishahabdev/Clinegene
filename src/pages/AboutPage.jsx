import { ArrowRight, Users, Award, TrendingUp, Dna, Shield, Lightbulb, Star, Heart, Check, Clock, Package } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import promiseImage from "../assets/about us/promise.png";
import injectionImage from "../assets/about us/about-injection.jpeg";
import aimImage from "../assets/about us/aim-pic.jpeg";
import characterImage from "../assets/about us/character.png";
import amjadAli from "../assets/team/Amjad Ali.jpeg";
import { useTheme } from "../context/ThemeContext.jsx";

export default function AboutPage() {
  const { theme } = useTheme();

  const isRed   = theme === "red";
  const isGreen = theme === "green";

  // Panel background and RGB values for seamless gradient blend
  const panelDark = isRed ? "#200407" : "#020a07";
  const darkRgb = isRed ? "32, 4, 7" : "2, 10, 7";

  // Why Choose Us section theme-adaptive variables (Red, Green, Blue/Cyan)
  const whyDark = isRed ? "#200407" : isGreen ? "#0b1f1a" : "#041728";
  const whyAccent = isRed ? "#dc2626" : isGreen ? "#10b981" : "#0284c7";
  const whyIconAccent = isRed ? "#ef4444" : isGreen ? "#10b981" : "#10c8e0";
  const whyCheckmarkBg = isRed ? "#dc2626" : isGreen ? "#10b981" : "#0284c7";
  const whyBadgeBg = isRed ? "#b91c1c" : isGreen ? "#059669" : "#0284c7";
  const whyBadgeShadow = isRed
    ? "0 12px 28px -4px rgba(185, 28, 28, 0.45)"
    : isGreen
      ? "0 12px 28px -4px rgba(16, 185, 129, 0.45)"
      : "0 12px 28px -4px rgba(2, 132, 199, 0.45)";
  const whyOverlay = isRed 
    ? "none" 
    : isGreen 
      ? "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(2,10,7,0.10))" 
      : "none";
  const whyImageFilter = "none";
  const whyTileBg = isRed 
    ? "rgba(185, 28, 28, 0.14)" 
    : isGreen 
      ? "rgba(16, 185, 129, 0.14)" 
      : "rgba(16, 200, 224, 0.14)";
  const whyTileBorder = isRed 
    ? "rgba(185, 28, 28, 0.25)" 
    : isGreen 
      ? "rgba(16, 185, 129, 0.25)" 
      : "rgba(16, 200, 224, 0.25)";
  const whyParagraphColor = isRed ? "#5c3d42" : isGreen ? "#3d5a50" : "#3d4f5a";
  const whyChecklistTextColor = isRed ? "#2d1f21" : isGreen ? "#1f2d28" : "#1f252d";

  // Dark overlay matching theme, with smooth transition toward the right
  const overlayGradientMobile = isRed
    ? "linear-gradient(180deg, rgba(45, 3, 6, 0.95) 0%, rgba(45, 3, 6, 0.85) 60%, rgba(45, 3, 6, 0.50) 100%)"
    : isGreen
      ? "linear-gradient(180deg, rgba(2, 30, 18, 0.95) 0%, rgba(2, 30, 18, 0.85) 60%, rgba(2, 30, 18, 0.50) 100%)"
      : "linear-gradient(180deg, rgba(3, 20, 38, 0.95) 0%, rgba(3, 20, 38, 0.85) 60%, rgba(3, 20, 38, 0.50) 100%)";

  const overlayGradientDesktop = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.95) 0%, rgba(45, 3, 6, 0.88) 45%, rgba(45, 3, 6, 0.75) 65%, rgba(45, 3, 6, 0.35) 85%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.95) 0%, rgba(2, 30, 18, 0.88) 45%, rgba(2, 30, 18, 0.75) 65%, rgba(2, 30, 18, 0.35) 85%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(3, 20, 38, 0.95) 0%, rgba(3, 20, 38, 0.88) 45%, rgba(3, 20, 38, 0.75) 65%, rgba(3, 20, 38, 0.35) 85%, rgba(3, 20, 38, 0.15) 100%)";

  return (
    <>
      {/* --- About Hero Section --- */}
      <section
        aria-labelledby="about-hero-title"
        className="relative isolate flex min-h-100 sm:min-h-110 lg:min-h-117.5 items-center overflow-hidden text-white"
        id="about-hero"
      >
        {/* Full-screen background image — same picture recolored to theme in green and red */}
        <img
          alt="ClinGene laboratory professional at microscope"
          width="1920"
          height="1080"
          loading="eager"
          className="hero-bg-img absolute inset-0 -z-20 h-full w-full object-cover object-[80%_center] sm:object-[72%_center] lg:object-center transition-all duration-500"
          src={promiseImage}
          style={{
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
        />
        
        {/* Dark overlay: 90-95% opacity on left, 70-80% in middle, lighter on right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 block lg:hidden"
          style={{
            background: overlayGradientMobile,
            transition: "background 0.4s ease-in-out",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden lg:block"
          style={{
            background: overlayGradientDesktop,
            transition: "background 0.4s ease-in-out",
          }}
        />

        {/* Text content */}
        <div className="site-container w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-175">
            {/* Breadcrumb */}
            <ScrollReveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-[14px] sm:text-[15px]">
                  <li>
                    <a 
                      href="/" 
                      className="font-medium transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) rounded"
                      style={{ color: isRed ? "#EF4444" : "var(--accent)", transition: "color 0.4s ease-in-out" }}
                    >
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true" className="text-[#E2E8F0]/60">›</li>
                  <li className="text-[#E2E8F0]" aria-current="page">About Us</li>
                </ol>
              </nav>
            </ScrollReveal>

            {/* Eyebrow with decorative line */}
            <ScrollReveal delay={50}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-12" style={{ backgroundColor: isRed ? "#EF4444" : "var(--accent)", transition: "background-color 0.4s ease-in-out" }} aria-hidden="true" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] sm:text-[12px]" style={{ color: isRed ? "#EF4444" : "var(--accent)", transition: "color 0.4s ease-in-out" }}>
                  ABOUT US
                </p>
              </div>
            </ScrollReveal>

            {/* Main heading */}
            <ScrollReveal delay={100}>
              <h1
                className="font-['Inter'] text-[32px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-extrabold leading-[1.14] tracking-tight text-white max-w-170"
                id="about-hero-title"
              >
                Decoding Genes.{" "}
                <span style={{ color: isRed ? "#EF4444" : "var(--accent)", transition: "color 0.4s ease-in-out" }}>Delivering Healthier Lives</span>
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={150}>
              <p className="mt-4 max-w-125 text-sm sm:text-base leading-6 text-[#E2E8F0]">
                At ClinGene, we turn genetic insights into better health decisions,<br className="hidden sm:block" />
                helping individuals and families build a healthier future.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- Who We Are Section --- */}
      <section className="relative bg-linear-to-br from-[#f8fafb] to-white py-16 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,200,224,0.03),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative site-container">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_480px] lg:gap-14 items-center">
            {/* Text Content - Left Side */}
            <div>
              <ScrollReveal delay={100}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-0.5 w-12" style={{ backgroundColor: "var(--accent)" }} aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Who We Are
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <h2 className="font-['Inter'] text-[32px] font-extrabold leading-tight text-[#0c2b48] sm:text-[38px] lg:text-[42px]">
                  Your Trusted Partner<br />
                  in <span style={{ color: "var(--accent)" }}>Genetic Testing</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="mt-6 text-[15px] leading-relaxed text-[#64748b] sm:text-[16px] max-w-xl">
                  ClinGene is a leading clinical genetic testing laboratory dedicated to providing accurate, reliable, and innovative genetic testing solutions. We specialize in advanced diagnostics, research, and personalized medicine to help healthcare providers and individuals make informed decisions about their health.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <Button
                  className="mt-8 min-h-9 sm:min-h-11 px-4 sm:px-7 font-['Inter'] text-xs sm:text-[14px] shadow-md hover:shadow-lg"
                  href="/services"
                  variant="cyan"
                >
                  Our Services <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </ScrollReveal>
            </div>

            {/* Image and Badge - Right Side */}
            <ScrollReveal delay={300}>
              <div className="relative mx-auto max-w-120">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <img
                    src={injectionImage}
                    alt="Genetic testing laboratory professional handling sample"
                    className="w-full h-auto object-cover aspect-video"
                    loading="lazy"
                  />
                </div>

                {/* Floating Badge - Compact & shifted further right */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 lg:-right-12 xl:-right-16 bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] p-3.5 sm:p-4 w-48.75 sm:w-53.75 z-10 transition-all">
                  <div className="flex flex-col items-center text-center gap-2 sm:gap-2.5">
                    <div className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
                      <Dna className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] text-[13.5px] sm:text-[14.5px] font-bold text-[#0c2b48] leading-tight mb-0.5 sm:mb-1">
                        Advanced<br />Genetic Solutions
                      </h3>
                      <p className="text-[11px] sm:text-[12px] text-[#94a3b8] leading-relaxed">
                        From diagnosis to<br />personalized care
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative blur circles */}
                <div 
                  className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl -z-10"
                  style={{ backgroundColor: "var(--accent)", opacity: 0.08 }}
                  aria-hidden="true"
                />
                <div 
                  className="absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl -z-10"
                  style={{ backgroundColor: "var(--accent-dark)", opacity: 0.08 }}
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- Leadership / Founder Spotlight --- */}
      <section className="relative bg-white py-12 md:py-16">
        <div className="site-container">
          <ScrollReveal delay={150}>
            <div
              className="relative isolate overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 lg:gap-10 shadow-2xl"
              style={{
                background: isRed
                  ? "linear-gradient(135deg, #320408 0%, #4f080e 50%, #200305 100%)"
                  : isGreen
                    ? "linear-gradient(135deg, #022214 0%, #043822 50%, #01170d 100%)"
                    : "linear-gradient(135deg, #022438 0%, #033d59 50%, #011624 100%)",
                border: `1.5px solid ${isRed ? "rgba(239, 68, 68, 0.4)" : isGreen ? "rgba(16, 185, 129, 0.4)" : "rgba(18, 197, 223, 0.4)"}`,
                boxShadow: isRed
                  ? "0 20px 50px rgba(50, 4, 8, 0.35)"
                  : isGreen
                    ? "0 20px 50px rgba(2, 34, 20, 0.35)"
                    : "0 20px 50px rgba(2, 36, 56, 0.35)",
              }}
            >
              {/* Subtle ambient theme glow in the card */}
              <div
                className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full blur-3xl opacity-25"
                style={{ backgroundColor: "var(--accent)" }}
                aria-hidden="true"
              />

              {/* Photo Frame */}
              <div
                className="shrink-0 relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-xl border-2 transition-all duration-500"
                style={{
                  borderColor: isRed ? "#ef4444" : isGreen ? "#10b981" : "var(--accent)",
                  boxShadow: isRed
                    ? "0 8px 24px rgba(239, 68, 68, 0.3)"
                    : isGreen
                      ? "0 8px 24px rgba(16, 185, 129, 0.3)"
                      : "0 8px 24px rgba(18, 197, 223, 0.3)",
                }}
              >
                <img
                  src={amjadAli}
                  alt="Dr. Amjad Ali Tanoli Ph.D - CEO"
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left text-white z-10">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span
                    className="h-0.5 w-6 transition-colors"
                    style={{ backgroundColor: isRed ? "#ef4444" : "var(--accent)" }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.22em] transition-colors"
                    style={{ color: isRed ? "#ef4444" : "var(--accent)" }}
                  >
                    Founder &amp; CEO
                  </span>
                </div>
                <h3 className="font-['Outfit',sans-serif] text-[22px] sm:text-[26px] font-bold leading-tight text-white">
                  “Advancing Science for a{" "}
                  <span
                    style={{
                      color: isRed ? "#ef4444" : "var(--accent)",
                      transition: "color 0.4s ease-in-out",
                    }}
                  >
                    Healthier Tomorrow
                  </span>”
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                  “At ClinGene, we are committed to bridging the gap between cutting-edge science and real-world impact, training the next generation of researchers to enhance global advancements in genetics.”
                </p>
                <div className="mt-3.5 flex items-center justify-center md:justify-start gap-4">
                  <div>
                    <div className="font-['Outfit',sans-serif] text-[15px] font-bold text-white">
                      Dr. Amjad Ali Tanoli Ph.D
                    </div>
                    <div
                      className="text-xs font-semibold transition-colors mt-0.5"
                      style={{ color: isRed ? "#fca5a5" : isGreen ? "#86efac" : "var(--accent)" }}
                    >
                      Human Geneticist &amp; Consultant Genetic Counselor
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 z-10">
                <Button href="/ceo-message" className="px-6">
                  CEO Message <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- Our Aim & Stats Section --- */}
      <section className="relative bg-linear-to-br from-[#F4FAFC] to-[#EAF5F8] py-8 sm:py-10 overflow-hidden">
        <div className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-0 items-center">
            
            {/* LEFT - Our Aim Banner */}
            <ScrollReveal delay={100}>
              <style>{`
                .dna-aim-image {
                  position: relative;
                }
                .dna-aim-image::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  right: 0;
                  width: 100%;
                  pointer-events: none;
                  background: linear-gradient(90deg,
                    rgba(var(--panel-rgb, 2, 10, 7), 0) 0%,
                    rgba(var(--panel-rgb, 2, 10, 7), 0.15) 20%,
                    rgba(var(--panel-rgb, 2, 10, 7), 0.45) 45%,
                    rgba(var(--panel-rgb, 2, 10, 7), 0.8) 75%,
                    var(--panel-dark, #020a07) 100%);
                }
                @media (max-width: 720px) {
                  .dna-aim-image::after {
                    background: linear-gradient(180deg,
                      rgba(var(--panel-rgb, 2, 10, 7), 0) 0%,
                      rgba(var(--panel-rgb, 2, 10, 7), 0.15) 20%,
                      rgba(var(--panel-rgb, 2, 10, 7), 0.45) 45%,
                      rgba(var(--panel-rgb, 2, 10, 7), 0.8) 75%,
                      var(--panel-dark, #020a07) 100%);
                  }
                }
              `}</style>

              <div 
                className="dna-aim-banner relative flex flex-col lg:flex-row overflow-hidden mx-4 sm:mx-6 lg:mx-0 rounded-3xl lg:rounded-l-none lg:rounded-r-[210px] min-h-[420px] lg:min-h-97.5 shadow-xl transition-colors duration-500"
                style={{
                  backgroundColor: panelDark,
                  '--panel-dark': panelDark,
                  '--panel-rgb': darkRgb,
                }}
              >
                {/* DNA Image Container: 40% of banner width on desktop, full-width on mobile */}
                <div 
                  className="dna-aim-image relative w-full h-52 sm:h-60 lg:h-auto lg:w-[40%] lg:shrink-0"
                  style={{
                    backgroundImage: `url(${aimImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'left center',
                    filter: isRed
                      ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
                      : isGreen
                        ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                        : "none",
                  }}
                />

                {/* Dark Content Panel: relative, z-index: 1 so text stays above fade */}
                <div className="relative z-1 flex-1 flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:pl-10 lg:pr-20 lg:py-10">
                  <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
                    <div 
                      className="h-0.5 w-8 sm:w-10 transition-colors duration-400" 
                      style={{ backgroundColor: isRed ? "#EF4444" : "var(--accent)" }} 
                      aria-hidden="true" 
                    />
                    <span 
                      className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-400" 
                      style={{ color: isRed ? "#EF4444" : "var(--accent)" }}
                    >
                      OUR AIM
                    </span>
                  </div>

                  <h2 className="font-['Poppins',sans-serif] text-[26px] sm:text-[30px] lg:text-[34px] font-bold leading-[1.18] text-white mb-2.5 sm:mb-3.5">
                    Better Answers.<br />
                    <span 
                      className="transition-colors duration-400"
                      style={{ color: isRed ? "#EF4444" : "var(--accent)" }}
                    >
                      Healthier Lives.
                    </span>
                  </h2>

                  <p className="text-[12.5px] sm:text-[13.5px] lg:text-[14px] leading-[1.62] text-white/90 mb-5 sm:mb-6 max-w-xl">
                    Our aim is to advance genetic science and make it accessible to everyone. We strive to provide accurate testing, innovative research, and personalized solutions that lead to better diagnosis, treatment, and prevention of genetic and complex diseases.
                  </p>

                  <button 
                    className="inline-flex items-center gap-2 bg-white font-semibold text-[13px] sm:text-[13.5px] px-6 py-2.5 rounded-full hover:bg-white/95 transition-all shadow-md w-fit" 
                    style={{ color: isRed ? "#b91c1c" : isGreen ? "#064e3b" : "var(--accent-dark)" }}
                  >
                    Our Mission
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* RIGHT - Stats Section (2x2 Grid with Premium Background) */}
            <ScrollReveal delay={150}>
              <div className="relative h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-10 py-0 lg:py-8">
                {/* Premium Container with Subtle Gray Background */}
                <div className="bg-linear-to-br from-[#F8FAFB] to-[#F0F4F7] rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-6 lg:p-7 border border-white/60 w-full max-w-md mx-auto lg:mx-0">
                  <div className="grid grid-cols-2">
                    
                    {/* Stat 1 - Expert Researchers */}
                    <div className="text-center pb-5 sm:pb-6 pr-4 sm:pr-6 border-r border-b border-slate-300/80">
                      <div className="mb-2.5 flex justify-center">
                        <Users className="h-8 w-8 transition-colors duration-400" style={{ color: isRed ? "#EF4444" : "var(--accent)" }} strokeWidth={1.5} />
                      </div>
                      <div className="mb-1">
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold text-black leading-none lg:text-[36px]">
                          9
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold leading-none lg:text-[36px] text-black">
                          +
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] font-medium">
                        Expert Researchers
                      </p>
                    </div>

                    {/* Stat 2 - Departments */}
                    <div className="text-center pb-5 sm:pb-6 pl-4 sm:pl-6 border-b border-slate-300/80">
                      <div className="mb-2.5 flex justify-center">
                        <svg className="h-8 w-8 transition-colors duration-400" style={{ color: isRed ? "#EF4444" : "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                      </div>
                      <div className="mb-1">
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold text-black leading-none lg:text-[36px]">
                          5
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] font-medium">
                        Departments
                      </p>
                    </div>

                    {/* Stat 3 - Years of Experience */}
                    <div className="text-center pt-5 sm:pt-6 pr-4 sm:pr-6 border-r border-slate-300/80">
                      <div className="mb-2.5 flex justify-center">
                        <svg className="h-8 w-8 transition-colors duration-400" style={{ color: isRed ? "#EF4444" : "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <div className="mb-1">
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold text-black leading-none lg:text-[36px]">
                          5
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold leading-none lg:text-[36px] text-black">
                          +
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] font-medium">
                        Years of Experience
                      </p>
                    </div>

                    {/* Stat 4 - Publications */}
                    <div className="text-center pt-5 sm:pt-6 pl-4 sm:pl-6">
                      <div className="mb-2.5 flex justify-center">
                        <svg className="h-8 w-8 transition-colors duration-400" style={{ color: isRed ? "#EF4444" : "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="mb-1">
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold text-black leading-none lg:text-[36px]">
                          20
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[32px] font-bold leading-none lg:text-[36px] text-black">
                          +
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] font-medium">
                        Publications
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* --- Why Choose Us (Genomic Excellence, Mission & Vision) Section --- */}
      <section 
        aria-labelledby="why-choose-us-title" 
        className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden transition-colors duration-400" 
        id="why-choose-us"
        style={{ '--dark': whyDark }}
      >
        <div className="relative site-container">
          <div className="grid grid-cols-1 items-center gap-10 min-[900px]:grid-cols-12 min-[900px]:gap-10 xl:gap-12">
            
            {/* LEFT COLUMN: Why Choose Us info & checklist */}
            <div className="min-[900px]:col-span-5">
              <ScrollReveal delay={100}>
                <div>
                  <span 
                    className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] transition-colors duration-400" 
                    style={{ color: whyAccent }}
                  >
                    WHY CHOOSE US
                  </span>

                  <h2 
                    id="why-choose-us-title" 
                    className="mt-3 font-['Poppins',sans-serif] text-[30px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.18] transition-colors duration-400"
                    style={{ color: whyDark }}
                  >
                    Your Trusted Partner<br />
                    <span 
                      className="transition-colors duration-400" 
                      style={{ color: whyAccent }}
                    >
                      in Genomic Excellence
                    </span>
                  </h2>

                  <p 
                    className="mt-4 text-[14px] sm:text-[15px] leading-[1.7] transition-colors duration-400"
                    style={{ color: whyParagraphColor }}
                  >
                    We bring together scientific expertise and cutting-edge technology to deliver precise, dependable and forward-thinking solutions for researchers, clinicians and industry partners.
                  </p>

                  {/* Checklist */}
                  <ul className="mt-6 sm:mt-7 space-y-3.5">
                    {[
                      "Expertise across multiple scientific disciplines",
                      "Modern, well-equipped laboratory facilities",
                      "Applied research & product innovation",
                      "Technical training & expert consultation",
                      "Industry-academia partnerships",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span 
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white shadow-xs transition-colors duration-400"
                          style={{ backgroundColor: whyCheckmarkBg }}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                        <span 
                          className="font-['Inter',sans-serif] text-[13.5px] sm:text-[14.5px] font-medium transition-colors duration-400"
                          style={{ color: whyChecklistTextColor }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="mt-8">
                    <Button href="/contact" className="px-6 py-3 text-[13.5px]">
                      Discover More About Us <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* MIDDLE COLUMN: Character Portrait with Floating Badge */}
            <div className="min-[900px]:col-span-4 flex justify-center">
              <ScrollReveal delay={180}>
                <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] min-[900px]:max-w-none">
                  {/* Portrait Card with theme-adaptive tint overlay and filter */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] sm:rounded-3xl border border-slate-100/80 bg-slate-100 shadow-[0_16px_40px_rgba(12,43,72,0.1)]">
                    <img
                      src={characterImage}
                      alt="ClinGene Laboratory Professional"
                      className="h-full w-full object-cover object-[center_15%] transition-all duration-400"
                      style={{ filter: whyImageFilter }}
                      loading="lazy"
                    />
                    {whyOverlay && whyOverlay !== "none" && (
                      <div 
                        className="pointer-events-none absolute inset-0 mix-blend-multiply transition-all duration-400"
                        style={{ background: whyOverlay }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Floating Circular Badge at bottom right (z-10 above overlay) */}
                  <div 
                    className="absolute -bottom-5 -right-2 sm:-bottom-6 sm:-right-4 flex h-28 w-28 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-full p-2 text-center text-white shadow-xl transition-all hover:scale-105 duration-300 z-10"
                    style={{
                      backgroundColor: whyBadgeBg,
                      boxShadow: whyBadgeShadow,
                    }}
                  >
                    <p className="font-['Poppins',sans-serif] text-[11px] sm:text-[12px] font-bold leading-[1.25]">
                      Advancing<br />
                      Life Sciences<br />
                      in Pakistan
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT COLUMN: Fast Response & Sample Shipments Card */}
            <div className="min-[900px]:col-span-3 w-full max-[899px]:mt-6">
              <ScrollReveal delay={250}>
                <div 
                  className="w-full rounded-[26px] sm:rounded-3xl p-7 sm:p-9 shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-white/10 transition-colors duration-400"
                  style={{ backgroundColor: whyDark }}
                >
                  {/* Block 1: Fast Response */}
                  <div className="group">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-all duration-300 group-hover:-translate-y-[3px] group-hover:rotate-[-5deg]"
                        style={{ backgroundColor: whyTileBg, borderColor: whyTileBorder }}
                      >
                        <Clock className="h-[22px] w-[22px] transition-colors duration-400" stroke={whyIconAccent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </div>
                      <h3 className="font-['Poppins',sans-serif] text-[18px] sm:text-[19px] font-bold text-[#f1f7fb]">
                        Fast Response
                      </h3>
                    </div>
                    <p className="mt-3.5 text-[14px] sm:text-[14.5px] leading-[1.7] text-[#9db3c6]">
                      Our scientific directors in Islamabad reply to every inquiry within 4 hours during business days.
                    </p>
                  </div>

                  {/* Divider line */}
                  <div 
                    className="my-6 border-t" 
                    style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  />

                  {/* Block 2: Sample Shipments */}
                  <div className="group">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-all duration-300 group-hover:-translate-y-[3px] group-hover:rotate-[-5deg]"
                        style={{ backgroundColor: whyTileBg, borderColor: whyTileBorder }}
                      >
                        <Package className="h-[22px] w-[22px] transition-colors duration-400" stroke={whyIconAccent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </div>
                      <h3 className="font-['Poppins',sans-serif] text-[18px] sm:text-[19px] font-bold text-[#f1f7fb]">
                        Sample Shipments
                      </h3>
                    </div>
                    <p className="mt-3.5 text-[14px] sm:text-[14.5px] leading-[1.7] text-[#9db3c6]">
                      Please send your samples to Street 13, Lane 10, Hostel City, Chak Shahzad, Islamabad, Pakistan.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
