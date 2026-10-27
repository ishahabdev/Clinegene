import micro from "../assets/micro.jpg";
import sig from "../assets/sig.png";
import dnaStrand from "../assets/dna_strand.png";
import amjadAli from "../assets/team/Amjad Ali.jpeg";
import taglineText from "../assets/tagline-text@2x.png";
import { ArrowRight } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

/* ─── Hero Banner ─── */
function Hero() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";
  const home1 = "/images/home1.webp";

  const overlayGradientMobile = isRed
    ? "linear-gradient(180deg, rgba(45, 3, 6, 0.94) 0%, rgba(45, 3, 6, 0.72) 45%, rgba(45, 3, 6, 0.96) 100%)"
    : isGreen
      ? "linear-gradient(180deg, rgba(2, 30, 18, 0.94) 0%, rgba(2, 30, 18, 0.72) 45%, rgba(2, 30, 18, 0.96) 100%)"
      : "linear-gradient(180deg, rgba(3, 31, 49, 0.94) 0%, rgba(3, 31, 49, 0.72) 45%, rgba(3, 31, 49, 0.96) 100%)";

  const overlayGradientDesktop = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(3, 31, 49, 0.97) 0%, rgba(3, 31, 49, 0.84) 48%, rgba(3, 31, 49, 0.30) 80%, rgba(3, 31, 49, 0.15) 100%)";

  return (
    <section
      className="relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isRed ? "#2d0306" : isGreen ? "#021e12" : "#031f31" }}
    >
      {/* Background image — responsive across mobile and desktop */}
      <div
        className="absolute inset-y-0 right-0 w-full sm:w-[75%] md:w-[68%] bg-cover bg-[75%_center] md:bg-left opacity-35 sm:opacity-55 md:opacity-100 transition-all duration-500"
        style={{
          backgroundImage: `url(${home1})`,
          filter: isRed
            ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
            : isGreen
              ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
              : "none",
        }}
      />
      {/* Responsive theme-aware gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 block md:hidden transition-all duration-500"
        style={{ background: overlayGradientMobile }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block transition-all duration-500"
        style={{ background: overlayGradientDesktop }}
      />
      <div className="relative site-container pb-9 pt-10">
        <div
          className="mb-6 flex items-center gap-2.5 text-[12px] font-medium transition-colors"
          style={{ color: "var(--accent)" }}
        >
          <a href="/" className="hover:underline">
            Home
          </a>
          <span>›</span>
          <span className="text-slate-300">CEO Message</span>
        </div>
        <div
          className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase transition-colors"
          style={{ color: "var(--accent)" }}
        >
          <span className="h-px w-8 transition-colors" style={{ backgroundColor: "var(--accent)" }} />
          LEADERSHIP
        </div>
        <ScrollReveal as="h1" className="mt-2 font-['Outfit',sans-serif] text-[40px] font-bold leading-tight text-white md:text-[50px]">
          CEO{" "}
          <span
            style={{
              color: isRed ? "#ef4444" : "var(--accent)",
              transition: "color 0.4s ease-in-out",
            }}
          >
            Message
          </span>
        </ScrollReveal>
        <p className="mt-3 max-w-125 text-sm sm:text-base leading-6 text-slate-200">
          Science today. Healthier generations tomorrow.
        </p>
        <div
          className="mt-4 h-[2.5px] w-9 rounded-full transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </div>
    </section>
  );
}

/* ─── Profile & Vision Sidebar ─── */
function ProfileSidebar() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";
  const gradColor1 = isRed ? "#ef4444" : isGreen ? "#10b981" : "#32d5ec";
  const gradColor2 = isRed ? "#b91c1c" : isGreen ? "#059669" : "#7ee4f1";
  const visionBgImg = "/images/home1.webp";

  return (
    <div className="flex flex-col gap-4">
      {/* 1. CEO Photo Card */}
      <div className="relative pt-2">
        {/* Curved Theme L-Bracket behind top-left */}
        <svg
          className="pointer-events-none absolute -top-1.5 -left-2 z-0"
          width="135"
          height="165"
          viewBox="0 0 135 165"
          fill="none"
        >
          <defs>
            <linearGradient id="cornerThemeGrad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradColor1} />
              <stop offset="100%" stopColor={gradColor2} />
            </linearGradient>
          </defs>
          <path
            d="M 112 16 L 42 16 A 26 26 0 0 0 16 42 L 16 142"
            stroke="url(#cornerThemeGrad)"
            strokeWidth="25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Card Content */}
        <div
          className="relative z-10 overflow-hidden rounded-[20px] transition-all duration-500"
          style={{
            background: isRed
              ? "linear-gradient(180deg, #380408 0%, #540810 50%, #700c16 100%)"
              : isGreen
                ? "linear-gradient(180deg, #022013 0%, #033620 50%, #054c2d 100%)"
                : "linear-gradient(180deg, #032236 0%, #043a50 100%)",
            boxShadow: isRed
              ? "0 16px 36px rgba(56, 4, 8, 0.45)"
              : isGreen
                ? "0 16px 36px rgba(2, 32, 19, 0.45)"
                : "0 16px 36px rgba(2, 24, 38, 0.32)",
            border: `1px solid ${isRed ? "rgba(239, 68, 68, 0.3)" : isGreen ? "rgba(16, 185, 129, 0.3)" : "rgba(18, 197, 223, 0.2)"}`,
          }}
        >
          <div
            aria-label="Portrait of Dr. Amjad Ali Tanoli Ph.D"
            className="relative aspect-[4/4.2] w-full overflow-hidden transition-colors duration-500"
            style={{
              backgroundColor: isRed ? "#220305" : isGreen ? "#01170d" : "#032236",
            }}
          >
            <img
              src={amjadAli}
              alt="Dr. Amjad Ali Tanoli Ph.D"
              className="h-full w-full object-cover object-[center_20%]"
            />
          </div>
          <div
            className="p-5 text-white transition-colors duration-500"
            style={{
              background: isRed
                ? "linear-gradient(180deg, #300407 0%, #46060b 100%)"
                : isGreen
                  ? "linear-gradient(180deg, #022415 0%, #03381f 100%)"
                  : "linear-gradient(180deg, #032439 0%, #04374d 100%)",
            }}
          >
            <h3 className="font-['Outfit',sans-serif] text-[17px] font-bold tracking-tight text-white">
              Dr. Amjad Ali Tanoli Ph.D
            </h3>
            <p
              className="mt-0.5 text-[13.5px] font-bold tracking-wide transition-colors"
              style={{ color: "var(--accent)" }}
            >
              CEO
            </p>
            <div
              className="mt-1 text-[11.5px] leading-relaxed transition-colors duration-500"
              style={{
                color: isRed ? "#fecdd3" : isGreen ? "#a7f3d0" : "#c0d6e5",
              }}
            >
              <p>Human Geneticist</p>
              <p>Consultant Genetic Counselor</p>
            </div>
            <div
              className="mt-3.5 h-0.5 w-9 rounded-full transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </div>
      </div>

      {/* 2. OUR VISION Card */}
      <div
        className="relative isolate overflow-hidden rounded-[20px] p-5 text-white shadow-[0_14px_32px_rgba(2,24,38,0.25)] min-h-43.75 flex flex-col justify-between transition-colors duration-500"
        style={{
          background: isRed
            ? "linear-gradient(135deg, #380408 0%, #540810 50%, #700c16 100%)"
            : isGreen
              ? "linear-gradient(135deg, #022013 0%, #033620 50%, #054c2d 100%)"
              : "linear-gradient(135deg, #022a3f 0%, #03445b 50%, #055c75 100%)",
        }}
      >
        {/* DNA Graphic background */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat opacity-25 mix-blend-screen transition-all duration-500"
          style={{
            backgroundImage: `url(${visionBgImg})`,
            backgroundPosition: "right -15px center",
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25)"
                : "none",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/45 via-black/20 to-white/10"
        />

        <div className="relative z-10">
          {/* Researcher / Doctor Icon */}
          <div className="mb-2.5 transition-colors" style={{ color: "var(--accent)" }}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="7" r="3.2" />
              <path d="M7 13.5v5.5a1 1 0 001 1h8a1 1 0 001-1v-5.5c0-1.8-1.5-3-3.2-3.2l-.8 1.2h-2l-.8-1.2C8.5 10.5 7 11.7 7 13.5z" />
              <rect x="4.5" y="13" width="3" height="6.5" rx="0.8" />
              <path d="M17.5 13.5c.8 0 1.5.7 1.5 1.5v3.5c0 .6-.4 1-1 1s-1-.4-1-1v-3.5c0-.8.2-1.5.5-1.5z" />
            </svg>
          </div>

          <div
            className="text-[10px] font-bold tracking-[0.22em] uppercase transition-colors"
            style={{ color: "var(--accent)" }}
          >
            OUR VISION
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#e5f4f8] max-w-52.5">
            To be a leading hub for human genetics and biomedical research in
            Pakistan and beyond.
          </p>
          <div
            className="mt-3.5 h-0.5 w-9 rounded-full transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main CEO Message Copy ─── */
function CeoMessageBody() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const pStyle = "text-[15px] leading-7 text-slate-600 sm:text-[16.5px] sm:leading-[1.85]";

  return (
    <div className="pt-2">
      {/* Eyebrow with theme line */}
      <div
        className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase transition-colors"
        style={{ color: "var(--accent)" }}
      >
        <span>A MESSAGE FROM OUR CEO</span>
        <span className="h-0.5 w-9 transition-colors" style={{ backgroundColor: "var(--accent)" }} />
      </div>

      {/* Heading */}
      <h2 className="mt-3 font-['Outfit',sans-serif] text-[30px] md:text-[34px] font-bold leading-[1.2] text-[#0c2b48]">
        Advancing Science for a<br />
        <span
          style={{
            color: isRed ? "#ef4444" : "var(--accent)",
            transition: "color 0.4s ease-in-out",
          }}
        >
          Healthier Tomorrow
        </span>
      </h2>

      {/* Paragraphs */}
      <div className="mt-5 space-y-4">
        <p className={pStyle}>
          Artificial intelligence, data science and technological advancement
          have revolutionized biomedical research in terms of data generation and
          new scientific discoveries. On daily basis, new technologies are being
          introduced into the market to give momentum to research. So, it is
          necessary to equip and train next generation of researchers to learn
          state-of-the-art tools and techniques to enhance their research skills.
        </p>
        <p className={pStyle}>
          At ClinGene, we are committed to bridging the gap between cutting-edge
          science and real-world impact. Our focus is not only on generating
          knowledge but also on translating it into solutions that improve human
          health and well-being. We believe that by investing in people,
          technology and collaboration, we can build a stronger research
          ecosystem and create opportunities for young scientists to contribute
          to global advancements in genetics, precision medicine and biomedical
          sciences.
        </p>
        <p className={pStyle}>Together, we can make a meaningful difference.</p>
      </div>

      {/* Signature & Title */}
      <div className="mt-6">
        <img
          src={sig}
          alt="Amjad Ali Tanoli Signature"
          width="216"
          height="40"
          className="h-10 mix-blend-multiply"
        />
        <div className="mt-2 text-[14px] font-bold text-[#0c2b48]">
          Dr. Amjad Ali Tanoli Ph.D
        </div>
        <div className="text-[12.5px] text-[#557b9c]">
          CEO, ClinGene (Pvt) Ltd.
        </div>
      </div>
    </div>
  );
}

/* ─── Quote Card with Watermark ─── */
function QuoteCard() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[22px] p-4 sm:p-5 min-h-0 sm:min-h-48 lg:min-h-76.25 w-full transition-all duration-500"
      style={{
        background: isRed
          ? "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)"
          : isGreen
            ? "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)"
            : "linear-gradient(180deg, #eaf8fc 0%, #d7f2f7 100%)",
        color: isRed ? "#4c0519" : isGreen ? "#064e3b" : "#1e456c",
        boxShadow: isRed
          ? "0 8px 24px rgba(185,28,28,0.10)"
          : isGreen
            ? "0 8px 24px rgba(16,185,129,0.10)"
            : "0 8px 24px rgba(18,197,223,0.10)",
      }}
    >
      {/* 3D DNA Helix Watermark anchored at bottom-right */}
      <img
        src={dnaStrand}
        alt=""
        width="121"
        height="105"
        className="pointer-events-none absolute -bottom-2 -right-1 w-20 sm:w-24 lg:w-28 object-contain select-none transition-all duration-500"
        style={{
          opacity: 0.55,
          filter: isRed
            ? "hue-rotate(150deg) saturate(1.8)"
            : isGreen
              ? "hue-rotate(240deg) saturate(1.5)"
              : "none",
        }}
      />

      <div className="relative z-10">
        {/* Quote Glyph */}
        <div style={{ color: "var(--accent)" }} className="transition-colors">
          <svg className="h-5 w-6 sm:h-7 sm:w-8" viewBox="0 0 34 28" fill="currentColor">
            <path d="M4.5 18c0-3.6 2.6-6.6 6.2-6.6.6 0 1.2.1 1.7.3C11.5 7.8 8 3.6 3.8 1.5L5.4 0C11.2 2 17 8.2 17 15.5c0 4.5-3.6 8-8.2 8-1.8 0-3.3-.5-4.3-1.5V18zm15 0c0-3.6 2.6-6.6 6.2-6.6.6 0 1.2.1 1.7.3C26.5 7.8 23 3.6 18.8 1.5L20.4 0C26.2 2 32 8.2 32 15.5c0 4.5-3.6 8-8.2 8-1.8 0-3.3-.5-4.3-1.5V18z" />
          </svg>
        </div>

        {/* Quote text */}
        <p className="mt-3 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] font-medium leading-[1.6] sm:leading-[1.7]">
          “Better research today, healthier generations tomorrow.”
        </p>

        {/* Theme line */}
        <div
          className="mt-3 sm:mt-5 h-[2px] sm:h-[2.5px] w-8 sm:w-9 rounded-full transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

/* ─── 4 Pillars Strip ─── */
const pillarsData = [
  {
    title: "Innovative Research",
    desc: "Bridging science and real-world impact through innovation.",
    icon: (
      <path d="M8 3c0 6 8 6 8 12s-8 6-8 6M16 3c0 6-8 6-8 12s8 6 8 6M9 8h6M9 16h6" />
    ),
  },
  {
    title: "Capacity Building",
    desc: "Empowering the next generation of researchers.",
    icon: (
      <>
        <circle cx="12" cy="8" r="3" />
        <circle cx="5.5" cy="10" r="2" />
        <circle cx="18.5" cy="10" r="2" />
        <path d="M6 20c0-4 2.5-6 6-6s6 2 6 6" />
      </>
    ),
  },
  {
    title: "Collaboration",
    desc: "Working together for better solutions.",
    icon: (
      <>
        <circle cx="12" cy="6" r="2.5" />
        <circle cx="6" cy="17" r="2.5" />
        <circle cx="18" cy="17" r="2.5" />
        <path d="M10.5 8.5L7 15M13.5 8.5L17 15M9 17h6" />
      </>
    ),
  },
  {
    title: "Healthier Communities",
    desc: "Advancing science for a healthier tomorrow.",
    icon: (
      <>
        <path d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5C20 15.5 12 20 12 20z" />
        <path d="M6 12h3l1.5-3 3 6 1.5-3h3" />
      </>
    ),
  },
];

function Pillars() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const dividerColor = "color-mix(in srgb, var(--accent) 35%, transparent)";

  return (
    <div
      className="mt-14 grid w-full grid-cols-2 gap-y-8 rounded-2xl px-6 py-8 lg:grid-cols-4 transition-all duration-500 border-2"
      style={{
        backgroundColor: isRed ? "#fff5f5" : isGreen ? "#f0fdf4" : "#eff9fc",
        borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
        boxShadow: isRed
          ? "0 10px 30px rgba(185,28,28,0.08)"
          : isGreen
            ? "0 10px 30px rgba(16,185,129,0.08)"
            : "0 10px 30px rgba(18,197,223,0.08)",
      }}
    >
      {pillarsData.map(({ title, desc, icon }, idx) => (
        <div
          key={title}
          className={`px-4 sm:px-6 text-center ${
            idx % 2 !== 0 ? "border-l-2" : ""
          } ${
            idx >= 2 ? "border-t-2 lg:border-t-0 pt-4 lg:pt-0" : ""
          } ${
            idx !== 0 ? "lg:border-l-2" : ""
          }`}
          style={{ borderColor: dividerColor }}
        >
          <div
            className="mx-auto flex h-13.5 w-13.5 items-center justify-center rounded-full transition-all duration-400"
            style={{
              backgroundColor: isRed ? "#fee2e2" : isGreen ? "#dcfce7" : "#d4f3f7",
              color: "var(--accent)",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icon}
            </svg>
          </div>
          <div className="mt-3 font-['Outfit',sans-serif] text-[14px] font-bold text-[#0c2b48]">
            {title}
          </div>
          {/* Bold theme accent line */}
          <div
            className="mx-auto mt-2 h-[2.5px] w-7 rounded-full transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <p className="mx-auto mt-2 max-w-45 text-[11.5px] leading-relaxed text-[#557b9c]">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Commitment Section ─── */
function Commitment() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const bgSection = isRed ? "#280306" : isGreen ? "#021a10" : "#01192b";

  return (
    <section
      className="relative mt-12 md:mt-14 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgSection }}
    >
      {/* 1. Left-side ambient lab background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] overflow-hidden opacity-25 hidden sm:block">
        <div
          className="h-full w-full bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${micro})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            filter: isRed
              ? "hue-rotate(150deg) saturate(1.4) brightness(0.85)"
              : isGreen
                ? "hue-rotate(240deg) saturate(1.2) brightness(0.85)"
                : "none",
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${bgSection} 80%, ${bgSection} 100%)`,
          }}
        />
      </div>

      {/* 2. Main microscope on the right: responsive on mobile, tablet, and desktop */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[70%] md:w-[58%] overflow-hidden opacity-40 sm:opacity-75 md:opacity-100 transition-all duration-500"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 25%, rgba(0, 0, 0, 0.8) 55%, black 85%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 25%, rgba(0, 0, 0, 0.8) 55%, black 85%)",
        }}
      >
        <div
          className="h-full w-full bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${micro})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
            filter: isRed
              ? "hue-rotate(150deg) saturate(1.4) brightness(0.85)"
              : isGreen
                ? "hue-rotate(240deg) saturate(1.2) brightness(0.85)"
                : "none",
          }}
        />
      </div>

      {/* 3. Subtle dark overlay for text readability */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(to right, ${bgSection} 0%, ${bgSection}f0 50%, ${bgSection}50 100%)`,
        }}
      />
      <div className="relative site-container flex flex-col md:flex-row min-h-60 sm:min-h-65 items-start md:items-center py-10 sm:py-12">
        <div className="max-w-105">
          <div
            className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.3em] uppercase transition-colors"
            style={{ color: "var(--accent)" }}
          >
            <span className="h-px w-9 transition-colors" style={{ backgroundColor: "var(--accent)" }} />
            OUR COMMITMENT
          </div>
          <h2 className="mt-3 sm:mt-4 font-['Outfit'] text-[26px] sm:text-[30px] font-bold leading-tight text-white">
            Building a Future<br />
            <span
              style={{
                color: isRed ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s ease-in-out",
              }}
            >
              Through Science
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-[13.5px] sm:text-[15.5px] leading-[1.7] sm:leading-[1.75] text-slate-200">
            We are dedicated to advancing human health through cutting-edge
            research, collaboration and capacity building. Our work today lays
            the foundation for healthier communities and a brighter future.
          </p>
          <Button className="mt-5 sm:mt-6" href="/research">
            Explore Our Research <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
          </Button>
        </div>

        {/* The three-word handwritten tagline in the middle — 100% identical to the reference pic */}
        <div 
          className="pointer-events-none mt-8 md:mt-0 md:absolute md:left-[46%] md:top-[22%] lg:top-[24%] select-none z-10 w-[240px] sm:w-[270px] lg:w-[290px]"
          aria-hidden="true"
        >
          <div className="relative w-full aspect-[255/228]">
            <img
              src={taglineText}
              alt="Science Collaboration Impact"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              loading="eager"
            />
            {/* Dynamic theme-adaptive underline positioned exactly like the pic */}
            <span
              className="absolute rounded-full transition-colors duration-400"
              style={{
                left: "29.8%",
                top: "95.6%",
                width: "17%",
                height: "3.5px",
                transform: "rotate(-8deg)",
                transformOrigin: "left center",
                backgroundColor: isRed ? "#ef4444" : isGreen ? "#10b981" : "#19c4de",
                boxShadow: isRed
                  ? "0 0 10px rgba(239, 68, 68, 0.6)"
                  : isGreen
                    ? "0 0 10px rgba(16, 185, 129, 0.6)"
                    : "0 0 10px rgba(25, 196, 222, 0.6)",
              }}
            />
          </div>
          <span className="sr-only">Science Collaboration Impact</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─── */
export default function CeoMessagePage() {
  return (
    <div className="font-['Inter',sans-serif] antialiased bg-white text-[#0c2b48]">
      <Hero />

      <main className="pb-8 pt-12">
        <div className="site-container">
          <div className="grid items-start gap-8 lg:grid-cols-[290px_1fr_220px] lg:gap-8">
            <ProfileSidebar />
            <CeoMessageBody />
            <div className="lg:self-center w-full max-w-md mx-auto lg:max-w-none">
              <QuoteCard />
            </div>
          </div>

          <Pillars />
        </div>
      </main>

      <Commitment />
    </div>
  );
}
