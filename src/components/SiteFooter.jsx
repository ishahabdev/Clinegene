import Button from "./Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const clingeneLogo = "/images/clingene-logo.webp";
const homeBackground = "/images/home1.webp";

export default function SiteFooter({ showJoinCta }) {
  const { theme } = useTheme();

  // Per-theme footer overlay & accent tint
  const footerBgOverlay =
    theme === "red"
      ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97), rgba(60, 6, 10, 0.95))"
      : theme === "green"
        ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97), rgba(4, 42, 24, 0.95))"
        : "linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94))";

  return (
    <footer
      className="relative isolate overflow-hidden text-white z-1 transition-all duration-500"
      style={{
        backgroundImage: `${footerBgOverlay}, url(${homeBackground})`,
        backgroundPosition: "center 38%",
        backgroundSize: "cover",
        transition: "background-image 0.4s ease-in-out",
      }}
    >
      <div className="site-container pt-6 pb-4 sm:pt-10 sm:pb-6">

        {/* ── Optional Join CTA banner (if showJoinCta is passed) ── */}
        {showJoinCta && (
          <div className="mb-5 sm:mb-8 flex flex-col justify-between gap-3 sm:gap-4 border-b border-white/15 pb-4 sm:pb-6 sm:flex-row sm:items-center">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)", transition: "color 0.4s ease-in-out" }}
              >
                Open Positions
              </p>
              <h2 className="mt-0.5 text-base sm:text-lg font-bold tracking-tight">
                Join Our Research Community
              </h2>
              <p className="mt-0.5 text-xs text-slate-300">
                Be a part of our mission to advance human genetics and biomedical research.
              </p>
            </div>
            <Button className="min-h-9! shrink-0 px-5! py-1.5! text-xs self-start sm:self-center" href="/open-positions">
              View Open Positions <span aria-hidden="true">→</span>
            </Button>
          </div>
        )}

        {/* ── 4-Column Grid: Compact on mobile, 3-col on tablet, 4-col on desktop ── */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[1.35fr_0.95fr_0.95fr_1.15fr] lg:gap-0 items-stretch">

          {/* 1. Brand & Contact Column */}
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-between items-start pr-0 lg:pr-8 lg:border-r lg:border-white/10 h-full">
            <div>
              {/* Logo container */}
              <a
                aria-label="ClinGene home"
                className="inline-flex w-32.5 sm:w-38.75 items-center rounded-xl sm:rounded-2xl bg-white p-2 sm:p-2.5 shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                href="/"
              >
                <img
                  alt="ClinGene"
                  width="450"
                  height="189"
                  className="w-full object-contain"
                  src={clingeneLogo}
                />
              </a>

              {/* Email & Office stacked vertically */}
              <div className="mt-3.5 sm:mt-5 flex flex-col items-start gap-2.5 sm:gap-4 w-full">
                {/* Email us */}
                <a
                  href="mailto:info@clingene.co"
                  className="group flex items-start gap-2.5 sm:gap-3 text-left transition-colors"
                >
                  <div
                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: "rgba(18, 197, 223, 0.08)",
                      color: "var(--accent)",
                    }}
                  >
                    <svg
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-white group-hover:text-(--accent) transition-colors">
                      Email us
                    </p>
                    <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-slate-400">Send us your inquiry</p>
                    <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-slate-300 font-medium">info@clingene.co</p>
                  </div>
                </a>

                {/* Visit our office */}
                <a
                  href="/contact"
                  className="group flex items-start gap-2.5 sm:gap-3 text-left transition-colors"
                >
                  <div
                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: "rgba(18, 197, 223, 0.08)",
                      color: "var(--accent)",
                    }}
                  >
                    <svg
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-white group-hover:text-(--accent) transition-colors">
                      Visit our office
                    </p>
                    <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-slate-400">Find us on the map</p>
                    <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-slate-300 font-medium">Islamabad, Pakistan</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="col-span-1 px-0 sm:px-2 lg:px-8 lg:border-r lg:border-white/10 h-full flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="h-3.5 sm:h-4 w-1 rounded-full transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <h3 className="text-[11.5px] sm:text-[13px] font-bold tracking-wider uppercase text-white">
                QUICK LINKS
              </h3>
            </div>
            <ul className="mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-2.5 text-[12px] sm:text-[13px] text-slate-300">
              {[
                ["Home",     "/"],
                ["About Us", "/about"],
                ["Team",     "/team"],
                ["Services", "/services"],
                ["Contact",  "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="group inline-flex items-center gap-1.5 sm:gap-2 transition-colors hover:text-white"
                    href={href}
                    style={{ transition: "color 0.25s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "")}
                  >
                    <span
                      className="text-[11px] sm:text-[12px] font-bold transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--accent)" }}
                    >
                      ›
                    </span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Explore */}
          <div className="col-span-1 px-0 sm:px-2 lg:px-8 h-full flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="h-3.5 sm:h-4 w-1 rounded-full transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <h3 className="text-[11.5px] sm:text-[13px] font-bold tracking-wider uppercase text-white">
                EXPLORE
              </h3>
            </div>
            <ul className="mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-2.5 text-[12px] sm:text-[13px] text-slate-300">
              {[
                ["CEO Message",    "/ceo-message"],
                ["Research",       "/research"],
                ["Gallery",        "/gallery"],
                ["Careers",        "/careers"],
                ["News",           "/news"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="group inline-flex items-center gap-1.5 sm:gap-2 transition-colors hover:text-white"
                    href={href}
                    style={{ transition: "color 0.25s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "")}
                  >
                    <span
                      className="text-[11px] sm:text-[12px] font-bold transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--accent)" }}
                    >
                      ›
                    </span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Right Card ("Let's advance" div - hidden on small screens < lg) */}
          <div className="hidden lg:flex pl-0 lg:pl-6 h-full flex-col items-start lg:items-end">
            <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-white/4 p-5 sm:p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full w-full max-w-81.25">
              <div>
                {/* 4-point sparkle icon */}
                <div className="mb-2.5">
                  <svg
                    className="h-5.5 w-5.5 transition-colors"
                    style={{ color: "var(--accent)" }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </div>

                <h3 className="font-['Outfit',sans-serif] text-[18px] sm:text-[20px] font-bold leading-tight tracking-tight text-white">
                  Let&apos;s advance<br />
                  science <span style={{ color: "var(--accent)" }}>together</span>
                </h3>

                <p className="mt-2 text-xs sm:text-[12px] leading-relaxed text-slate-300">
                  Partner with us to accelerate breakthroughs in genetic research and precision healthcare.
                </p>
              </div>

              <a
                href="/contact"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 px-5 text-xs sm:text-[13px] font-bold transition-all shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--accent)",
                  color: theme === "red" || theme === "green" ? "#ffffff" : "#031d33",
                }}
              >
                <span>Contact Our Team</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-6 sm:mt-10 flex flex-col gap-2.5 sm:gap-3 border-t border-white/10 pt-4 sm:pt-5 pb-2 text-[11px] sm:text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold transition-colors" style={{ color: "var(--accent)" }}>
              ClinGene
            </span>{" "}
            (SMC-Private) Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a
              className="transition-colors hover:text-white"
              href="#privacy-policy"
              style={{ transition: "color 0.25s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              Privacy Policy
            </a>
            <span className="text-white/40">•</span>
            <a
              className="transition-colors hover:text-white"
              href="#terms-of-use"
              style={{ transition: "color 0.25s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
