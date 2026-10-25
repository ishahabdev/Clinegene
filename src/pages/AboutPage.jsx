import { ArrowRight, Users, Award, TrendingUp, Dna, Shield, Lightbulb, Star, Heart } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import promiseImage from "../assets/about us/promise.jpeg";
import injectionImage from "../assets/about us/about-injection.jpeg";
import aimImage from "../assets/about us/aim-pic.jpeg";
import { useTheme } from "../context/ThemeContext.jsx";

export default function AboutPage() {
  const { theme } = useTheme();

  const sectionBg =
    theme === "red"
      ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97), rgba(60, 6, 10, 0.95))"
      : theme === "green"
        ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97), rgba(4, 42, 24, 0.95))"
        : "linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94))";

  const overlayColor =
    theme === "red" ? "rgba(45, 3, 6, " : theme === "green" ? "rgba(2, 30, 18, " : "rgba(2, 19, 42, ";

  return (
    <>
      {/* --- About Hero Section --- */}
      <section
        aria-labelledby="about-hero-title"
        className="relative isolate min-h-[38vh] overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[46vh]"
        id="about-hero"
        style={{ backgroundImage: sectionBg }}
      >
        {/* Full-screen background image */}
        <img
          alt="ClinGene team collaborating in laboratory environment"
          width="1920"
          height="1080"
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          src={promiseImage}
        />
        
        {/* Dark overlay for text readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${overlayColor}/98, ${overlayColor}/85, ${overlayColor}/60)`,
          }}
        />

        {/* Text content */}
        <div className="relative flex min-h-[38vh] items-center sm:min-h-[42vh] lg:min-h-[46vh]">
          <div className="site-container py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <ScrollReveal>
                <nav aria-label="Breadcrumb" className="mb-6">
                  <ol className="flex items-center gap-2 text-[14px] sm:text-[15px]">
                    <li>
                      <a 
                        href="#home" 
                        className="text-[#10c8e0] transition-colors hover:text-[#10c8e0]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10c8e0] rounded"
                      >
                        Home
                      </a>
                    </li>
                    <li aria-hidden="true" className="text-slate-400">›</li>
                    <li className="text-slate-300" aria-current="page">About Us</li>
                  </ol>
                </nav>
              </ScrollReveal>

              {/* Eyebrow with decorative line */}
              <ScrollReveal delay={50}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-0.5 w-12 bg-[#10c8e0]" aria-hidden="true" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#10c8e0] sm:text-[12px]">
                    ABOUT US
                  </p>
                </div>
              </ScrollReveal>

              {/* Main heading */}
              <ScrollReveal delay={100}>
                <h1
                  className="font-['Inter'] text-[36px] font-bold leading-[1.1] tracking-tight sm:text-[44px] md:text-[52px] lg:text-[58px]"
                  id="about-hero-title"
                >
                  Decoding Genes.{" "}
                  <span className="text-[#10c8e0]">Delivering Healthier Lives</span>
                </h1>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal delay={150}>
                <p className="mt-3 max-w-[600px] text-[15px] leading-[1.65] text-slate-300 sm:mt-4 sm:text-[16px] sm:leading-[1.7]">
                  At ClinGene, we turn genetic insights into better health decisions,<br className="hidden sm:block" />
                  helping individuals and families build a healthier future.
                </p>
              </ScrollReveal>

              {/* Stats */}
              <ScrollReveal delay={200}>
                <div className="mt-6 flex flex-wrap gap-8 sm:gap-12" role="list">
                  <div className="flex items-center gap-3" role="listitem">
                    <div className="flex h-10 w-10 items-center justify-center text-[#10c8e0]" aria-hidden="true">
                      <Users className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">30+</div>
                      <div className="mt-1 text-[14px] text-slate-400">Team Members</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" role="listitem">
                    <div className="flex h-10 w-10 items-center justify-center text-[#10c8e0]" aria-hidden="true">
                      <Award className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">5</div>
                      <div className="mt-1 text-[14px] text-slate-400">Departments</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" role="listitem">
                    <div className="flex h-10 w-10 items-center justify-center text-[#10c8e0]" aria-hidden="true">
                      <TrendingUp className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[28px] font-bold leading-none text-white sm:text-[32px]">15+</div>
                      <div className="mt-1 text-[14px] text-slate-400">Years Experience</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>


      </section>

      {/* --- Who We Are Section --- */}
      <section className="relative bg-gradient-to-br from-[#f8fafb] to-white py-16 md:py-20">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,200,224,0.03),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_580px] lg:gap-16 items-center">
            {/* Text Content - Left Side */}
            <div>
              <ScrollReveal delay={100}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-[#10c8e0]" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#10c8e0]">
                    Who We Are
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <h2 className="font-['Inter'] text-[32px] font-extrabold leading-tight text-[#0c2b48] sm:text-[38px] lg:text-[42px]">
                  Your Trusted Partner<br />
                  in <span className="text-[#10c8e0]">Genetic Testing</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="mt-6 text-[15px] leading-relaxed text-[#64748b] sm:text-[16px] max-w-xl">
                  ClinGene is a leading clinical genetic testing laboratory dedicated to providing accurate, reliable, and innovative genetic testing solutions. We specialize in advanced diagnostics, research, and personalized medicine to help healthcare providers and individuals make informed decisions about their health.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <Button
                  className="mt-8 !min-h-[48px] !px-7 font-['Inter'] !text-[14px] shadow-md hover:shadow-lg"
                  href="#services"
                  variant="cyan"
                >
                  Our Services <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </ScrollReveal>
            </div>

            {/* Image and Badge - Right Side */}
            <ScrollReveal delay={300}>
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <img
                    src={injectionImage}
                    alt="Genetic testing laboratory professional handling sample"
                    className="w-full h-auto object-cover aspect-[16/9]"
                    loading="lazy"
                  />
                </div>

                {/* Floating Badge - Right side of image */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 lg:-right-12 bg-white rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,0.2)] p-5 w-[280px] z-10">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-[#10c8e0] to-[#0a7a94] flex items-center justify-center shadow-lg">
                      <Dna className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] text-[17px] font-bold text-[#0c2b48] leading-tight mb-1">
                        Advanced<br />Genetic Solutions
                      </h3>
                      <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                        From diagnosis to<br />personalized care
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative blur circles */}
                <div 
                  className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#10c8e0]/5 blur-3xl -z-10"
                  aria-hidden="true"
                />
                <div 
                  className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#0a7a94]/5 blur-3xl -z-10"
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- Our Aim & Stats Section --- */}
      <section className="relative bg-gradient-to-br from-[#F4FAFC] to-[#EAF5F8] py-12 overflow-hidden">
        <div className="relative w-full">
          <div className="grid lg:grid-cols-[60%_40%] gap-0 items-center">
            
            {/* LEFT - Our Aim Card (DNA Left, Text Right) */}
            <ScrollReveal delay={100}>
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0B2E4A] to-[#0A3552] min-h-[500px] lg:min-h-[520px] rounded-r-[250px] lg:rounded-r-[250px] lg:rounded-l-none rounded-l-[40px]">
                {/* DNA Helix Image - LEFT SIDE, CLEAR & VISIBLE */}
                <div className="absolute left-0 top-0 h-full w-[50%]">
                  <img
                    src={aimImage}
                    alt="DNA Helix"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
                  />
                </div>
                
                {/* Light gradient overlay - transparent to right (keeps text readable) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B2E4A]/60 to-[#0B2E4A]" />
                
                {/* Teal Glow on left */}
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#19C3D6]/15 blur-2xl" aria-hidden="true" />
                
                {/* Content - RIGHT SIDE */}
                <div className="relative z-10 h-full flex flex-col justify-center ml-auto px-8 py-20 lg:px-16 lg:py-20 max-w-[58%]">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-[2px] w-10 bg-[#19C3D6]" aria-hidden="true" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#19C3D6]">
                      OUR AIM
                    </span>
                  </div>

                  <h2 className="font-['Poppins',sans-serif] text-[40px] font-bold leading-[1.15] text-white mb-5 lg:text-[46px]">
                    Better Answers.<br />
                    <span className="text-[#19C3D6]">Healthier Lives.</span>
                  </h2>

                  <p className="text-[15px] leading-[1.6] text-white/95 mb-7 lg:text-[16px]">
                    Our aim is to advance genetic science and make it accessible to everyone. We strive to provide accurate testing, innovative research, and personalized solutions that lead to better diagnosis, treatment, and prevention of genetic and complex diseases.
                  </p>

                  <button className="inline-flex items-center gap-2 bg-white text-[#0B2E4A] font-semibold text-[14px] px-7 py-3 rounded-full hover:bg-white/95 transition-all shadow-md w-fit">
                    Our Mission
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* RIGHT - Stats Section (2x2 Grid with Premium Background) */}
            <ScrollReveal delay={150}>
              <div className="relative h-full flex flex-col justify-center items-center px-8 py-12 lg:px-12">
                {/* Premium Container with Subtle Gray Background */}
                <div className="bg-gradient-to-br from-[#F8FAFB] to-[#F0F4F7] rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-8 lg:p-10 border border-white/60">
                  <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                    
                    {/* Stat 1 - Expert Researchers */}
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <Users className="h-10 w-10 text-[#19C3D6]" strokeWidth={1.5} />
                      </div>
                      <div className="mb-2">
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#1E3A5F] leading-none lg:text-[42px]">
                          25
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#19C3D6] leading-none lg:text-[42px]">
                          +
                        </span>
                      </div>
                      <p className="text-[13px] text-[#64748B] font-medium">
                        Expert Researchers
                      </p>
                    </div>

                    {/* Stat 2 - Departments */}
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <svg className="h-10 w-10 text-[#19C3D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                      </div>
                      <div className="mb-2">
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#1E3A5F] leading-none lg:text-[42px]">
                          6
                        </span>
                      </div>
                      <p className="text-[13px] text-[#64748B] font-medium">
                        Departments
                      </p>
                    </div>

                    {/* Stat 3 - Years of Experience */}
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <svg className="h-10 w-10 text-[#19C3D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <div className="mb-2">
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#1E3A5F] leading-none lg:text-[42px]">
                          15
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#19C3D6] leading-none lg:text-[42px]">
                          +
                        </span>
                      </div>
                      <p className="text-[13px] text-[#64748B] font-medium">
                        Years of Experience
                      </p>
                    </div>

                    {/* Stat 4 - Publications */}
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <svg className="h-10 w-10 text-[#19C3D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="mb-2">
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#1E3A5F] leading-none lg:text-[42px]">
                          200
                        </span>
                        <span className="font-['Poppins',sans-serif] text-[38px] font-bold text-[#19C3D6] leading-none lg:text-[42px]">
                          +
                        </span>
                      </div>
                      <p className="text-[13px] text-[#64748B] font-medium">
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

      {/* --- Our Values Section --- */}
      <section className="relative bg-white py-20 md:py-24">
        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
          {/* Section Header */}
          <ScrollReveal delay={100}>
            <div className="text-center mb-16">
              <h2 className="font-['Playfair_Display',serif] text-[36px] font-bold text-[#2D2D2D] mb-3 sm:text-[42px] lg:text-[48px]">
                Our Values
              </h2>
            </div>
          </ScrollReveal>

          {/* Values Grid - 2x2 */}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-x-20 lg:gap-y-16">
            
            {/* Value 1 - Innovation */}
            <ScrollReveal delay={150}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <svg className="h-16 w-16 text-[#D2691E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Inter',sans-serif] text-[22px] font-bold text-[#D2691E] mb-4">
                  Innovation
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B7280] max-w-md mx-auto">
                  By merging the fields of genetics, molecular biology, and computer science, we pursue excellence in clinical diagnostics, therapeutic development, and data analysis.
                </p>
              </div>
            </ScrollReveal>

            {/* Value 2 - Customer Service & Commitment */}
            <ScrollReveal delay={200}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <svg className="h-16 w-16 text-[#D2691E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Inter',sans-serif] text-[22px] font-bold text-[#D2691E] mb-4">
                  Customer Service & Commitment
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B7280] max-w-md mx-auto">
                  Our dedicated team of customer support staff is available to answer questions quickly and accurately, so physicians can spend more time with what's really important: their patients.
                </p>
              </div>
            </ScrollReveal>

            {/* Value 3 - Quality & Efficiency */}
            <ScrollReveal delay={250}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <svg className="h-16 w-16 text-[#D2691E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Inter',sans-serif] text-[22px] font-bold text-[#D2691E] mb-4">
                  Quality & Efficiency
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B7280] max-w-md mx-auto">
                  As a CLIA-certified and CAP-accredited lab, quality controls are built into our procedures at every step, and multiple lab directors oversee all clinical procedures and analysis.
                </p>
              </div>
            </ScrollReveal>

            {/* Value 4 - Our People */}
            <ScrollReveal delay={300}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <svg className="h-16 w-16 text-[#D2691E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-['Inter',sans-serif] text-[22px] font-bold text-[#D2691E] mb-4">
                  Our People
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B7280] max-w-md mx-auto">
                  We support our employees by providing them with resources for personal and professional growth while fostering an inclusive culture where differences are celebrated.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </>
  );
}
