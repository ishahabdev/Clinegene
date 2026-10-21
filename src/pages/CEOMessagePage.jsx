import home1 from "../assets/home1.png";
import micro from "../assets/micro.jpg";
import sig from "../assets/sig.png";
import dnaStrand from "../assets/dna_strand.png";
import { UserRound } from "lucide-react";

const C = {
  cyan: "#12c5df",
  navy: "#0a2540",
  headingNavy: "#0c2b48",
  bodyText: "#4a6e8b",
};

/* ─── Hero Banner ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#031f31]">
     <div
  className="absolute inset-y-0 right-0 hidden w-[68%] bg-cover bg-left md:block"
  style={{ backgroundImage: `url(${home1})` }}
/>
      <div className="absolute inset-0 bg-linear-to-r from-[#031f31] from-34% via-[#031f31]/75 to-transparent to-75%" />
      <div className="relative mx-auto max-w-310 px-6 pb-9 pt-10 lg:px-12">
        <div className="mb-6 flex items-center gap-2.5 text-[12px] font-medium text-[#12c5df]">
          <a href="/" className="hover:underline">
            Home
          </a>
          <span>›</span>
          <span className="text-slate-300">CEO Message</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#12c5df] uppercase">
          <span className="h-px w-8 bg-[#12c5df]" />
          LEADERSHIP
        </div>
        <h1 className="mt-2 font-['Outfit',sans-serif] text-[40px] font-bold leading-tight text-white md:text-[50px]">
          CEO <span style={{ color: C.cyan }}>Message</span>
        </h1>
        <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-slate-200">
          Science today. Healthier generations tomorrow.
        </p>
        <div className="mt-4 h-[2.5px] w-9 rounded-full bg-[#12c5df]" />
      </div>
    </section>
  );
}

/* ─── Profile & Vision Sidebar ─── */
function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. CEO Photo Card */}
      <div className="relative pt-2 pl-3">
        {/* Curved Cyan L-Bracket behind top-left */}
        <svg
          className="pointer-events-none absolute -top-1 -left-1 z-0"
          width="135"
          height="165"
          viewBox="0 0 135 165"
          fill="none"
        >
          <defs>
            <linearGradient id="cornerCyanGrad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#32d5ec" />
              <stop offset="100%" stopColor="#7ee4f1" />
            </linearGradient>
          </defs>
          <path
            d="M 112 16 L 42 16 A 26 26 0 0 0 16 42 L 16 142"
            stroke="url(#cornerCyanGrad)"
            strokeWidth="25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Card Content */}
        <div className="relative z-10 overflow-hidden rounded-[20px] bg-linear-to-b from-[#032236] to-[#043a50] shadow-[0_16px_36px_rgba(2,24,38,0.32)]">
          <div
            aria-label="Portrait placeholder for Dr. Amjad Ali Tanoli Ph.D"
            className="flex aspect-[4/3.8] w-full items-center justify-center bg-linear-to-b from-[#dceaf2] to-[#c9dce8]"
            role="img"
          >
            <UserRound aria-hidden="true" className="h-24 w-24 text-[#496680]" strokeWidth={1.2} />
          </div>
          <div className="p-5 bg-linear-to-b from-[#032439] to-[#04374d] text-white">
            <h3 className="font-['Outfit',sans-serif] text-[17px] font-bold tracking-tight text-white">
              Dr. Amjad Ali Tanoli Ph.D
            </h3>
            <p className="mt-0.5 text-[13.5px] font-bold tracking-wide text-[#12c5df]">
              CEO
            </p>
            <div className="mt-1 text-[11.5px] leading-relaxed text-[#c0d6e5]">
              <p>Human Geneticist</p>
              <p>Consultant Genetic Counselor</p>
            </div>
            <div className="mt-3.5 h-0.5 w-9 rounded-full bg-[#12c5df]" />
          </div>
        </div>
      </div>

      {/* 2. OUR VISION Card */}
      <div className="relative isolate overflow-hidden rounded-[20px] p-5 text-white bg-linear-to-br from-[#022a3f] via-[#03445b] to-[#055c75] shadow-[0_14px_32px_rgba(2,24,38,0.25)] min-h-43.75 flex flex-col justify-between">
        {/* DNA Graphic background */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat opacity-25 mix-blend-screen"
          style={{
            backgroundImage: "url('/images/home1.webp')",
            backgroundPosition: "right -15px center",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#00121f]/45 via-[#00121f]/20 to-white/10"
        />

        <div className="relative z-10">
          {/* Researcher / Doctor Icon */}
          <div className="text-[#12c5df] mb-2.5">
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

          <div className="text-[10px] font-bold tracking-[0.22em] text-[#12c5df] uppercase">
            OUR VISION
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#e5f4f8] max-w-52.5">
            To be a leading hub for human genetics and biomedical research in
            Pakistan and beyond.
          </p>
          <div className="mt-3.5 h-0.5 w-9 rounded-full bg-[#12c5df]" />
        </div>

        {/* Circular Arrow Button */}
        <a
          href="#vision"
          className="absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#12c5df]/60 bg-[#06384c]/70 text-[#12c5df] transition hover:scale-105 hover:bg-[#12c5df] hover:text-[#022338]"
          aria-label="Our Vision details"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─── Main CEO Message Copy ─── */
function CeoMessageBody() {
  const pStyle = "text-[12.5px] leading-[1.8] text-[#486e8e]";
  return (
    <div className="pt-2">
      {/* Eyebrow with cyan line */}
      <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#0d9db3] uppercase">
        <span>A MESSAGE FROM OUR CEO</span>
        <span className="h-0.5 w-9 bg-[#12c5df]" />
      </div>

      {/* Heading */}
      <h2 className="mt-3 font-['Outfit',sans-serif] text-[30px] md:text-[34px] font-bold leading-[1.2] text-[#0c2b48]">
        Advancing Science for a<br />
        <span className="text-[#12c5df]">Healthier Tomorrow</span>
      </h2>

      {/* Paragraphs */}
      <div className="mt-5 space-y-3.5">
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
          className="h-10 mix-blend-multiply"
        />
        <div className="mt-2 text-[12.5px] font-bold text-[#0c2b48]">
          Dr. Amjad Ali Tanoli Ph.D
        </div>
        <div className="text-[11.5px] text-[#557b9c]">
          CEO, ClinGene (Pvt) Ltd.
        </div>
      </div>
    </div>
  );
}

/* ─── Quote Card with DNA Watermark ─── */
function QuoteCard() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-[22px] px-5 py-5 text-[#1e456c] bg-linear-to-b from-[#eaf8fc] to-[#d7f2f7] shadow-[0_10px_28px_rgba(18,197,223,0.12)] min-h-68.75 lg:min-h-76.25 w-full">
      {/* 3D DNA Helix Watermark anchored at bottom-right */}
      <img
        src={dnaStrand}
        alt=""
        className="pointer-events-none absolute -bottom-2 -right-1 w-28 object-contain opacity-75 select-none"
      />

      <div className="relative z-10">
        {/* Cyan Quote Glyph */}
        <div className="text-[#0ec5df]">
          <svg width="34" height="28" viewBox="0 0 34 28" fill="currentColor">
            <path d="M4.5 18c0-3.6 2.6-6.6 6.2-6.6.6 0 1.2.1 1.7.3C11.5 7.8 8 3.6 3.8 1.5L5.4 0C11.2 2 17 8.2 17 15.5c0 4.5-3.6 8-8.2 8-1.8 0-3.3-.5-4.3-1.5V18zm15 0c0-3.6 2.6-6.6 6.2-6.6.6 0 1.2.1 1.7.3C26.5 7.8 23 3.6 18.8 1.5L20.4 0C26.2 2 32 8.2 32 15.5c0 4.5-3.6 8-8.2 8-1.8 0-3.3-.5-4.3-1.5V18z" />
          </svg>
        </div>

        {/* Quote text */}
        <p className="mt-5 text-[17px] md:text-[18px] font-medium leading-[1.7] text-[#1e456c]">
          “Better research today, healthier generations tomorrow.”
        </p>

        {/* Cyan line */}
        <div className="mt-5 h-[2.5px] w-9 rounded-full bg-[#12c5df]" />
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
  return (
    <div className="mx-auto mt-14 grid max-w-285 grid-cols-2 gap-y-8 rounded-2xl px-6 py-8 lg:grid-cols-4 bg-[#eff9fc]">
      {pillarsData.map(({ title, desc, icon }, idx) => (
        <div
          key={title}
          className={`px-6 text-center ${
            idx ? "lg:border-l lg:border-slate-200" : ""
          }`}
        >
          <div className="mx-auto flex h-13.5 w-13.5 items-center justify-center rounded-full bg-[#d4f3f7] text-[#0b8aa6]">
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
          <p className="mx-auto mt-1.5 max-w-45 text-[11.5px] leading-relaxed text-[#557b9c]">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Commitment Section ─── */
function Commitment() {
  return (
    <section className="relative mt-14 overflow-hidden bg-[#01192b]">
      {/* 1. Left-side ambient lab background (microscope hidden, soft bokeh only) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] overflow-hidden opacity-35">
        <div
          className="h-full w-full bg-no-repeat"
          style={{
            backgroundImage: `url(${micro})`,
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
          }}
        />
        {/* Soft horizontal gradient fade into the background */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#01192b]/30 to-[#01192b]" />
      </div>

      {/* 2. Main microscope on the right: fits the div completely from top to bottom and right edge */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[58%] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 15%, rgba(0, 0, 0, 0.75) 45%, black 70%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 15%, rgba(0, 0, 0, 0.75) 45%, black 70%)",
        }}
      >
        <div
          className="h-full w-full bg-no-repeat"
          style={{
            backgroundImage: `url(${micro})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
          }}
        />
      </div>

      {/* 3. Subtle dark overlay on the left for maximum text readability */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#01192b]/70 via-[#01192b]/20 to-transparent" />
      <div className="relative mx-auto flex min-h-65 max-w-300 items-center px-6 py-12 lg:px-14">
        {/* Left text content */}
        <div className="max-w-105">
          <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-[#12c5df]">
            <span className="h-px w-9 bg-[#12c5df]" />
            OUR COMMITMENT
          </div>
          <h2 className="mt-4 font-['Outfit'] text-[30px] font-bold leading-tight text-white">
            Building a Future<br />
            <span className="text-[#12c5df]">Through Science</span>
          </h2>
          <p className="mt-4 text-[12.5px] leading-[1.75] text-slate-200">
            We are dedicated to advancing human health through cutting-edge
            research, collaboration and capacity building. Our work today lays
            the foundation for healthier communities and a brighter future.
          </p>
          <a
            href="#research"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#12c5df] px-6 py-3 text-[12px] font-semibold text-[#01192b] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore Our Research <span>→</span>
          </a>
        </div>

        {/* The three-word handwritten tagline in the middle */}
        <div className="pointer-events-none absolute left-[49%] top-[36%] hidden rotate-[-18deg] font-['Mrs_Saint_Delafield',cursive] text-[38px] leading-[1.2] text-white/90 lg:block">
          Science<br />
          <span className="ml-3 block">Collaboration</span>
          <span className="ml-8 block">Impact</span>
          <span className="ml-5 mt-3 block h-0.5 w-9 rotate-10 bg-[#12c5df]" />
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
        <div className="mx-auto grid max-w-285 items-start gap-8 px-6 lg:grid-cols-[290px_1fr_210px] lg:gap-8">
          <ProfileSidebar />
          <CeoMessageBody />
          <div className="lg:self-center">
            <QuoteCard />
          </div>
        </div>

        <Pillars />
      </main>

      <Commitment />

      {/* Floating Bottom Scroll Button as seen in reference */}
      <a
        href="#top"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-2xl transition hover:scale-105"
        aria-label="Scroll to top"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </div>
  );
}