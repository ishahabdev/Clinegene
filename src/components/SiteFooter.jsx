import Button from "./Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const clingeneLogo = "/images/clingene-logo.webp";
const homeBackground = "/images/home1.webp";

export default function SiteFooter({ compact = false, showJoinCta }) {
  const { theme } = useTheme();

  // Per-theme footer overlay & accent tint
  const footerBgOverlay =
    theme === "red"
      ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97), rgba(60, 6, 10, 0.95))"
      : theme === "green"
        ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97), rgba(4, 42, 24, 0.95))"
        : "linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94))";

  if (compact) {
    return (
      <footer className="ceo-footer">
        <div className="ceo-shell">
          <div className="ceo-footer-main">
            <a aria-label="ClinGene home" className="ceo-footer-brand shrink-0" href="/">
              <img
                alt="ClinGene"
                width="450"
                height="189"
                className="h-10 w-36 rounded-lg bg-white object-contain px-2.5 py-1 sm:h-11 sm:w-40"
                src={clingeneLogo}
              />
            </a>
            <address className="ceo-contact-details">
              <a href="/contact">
                <span aria-hidden="true">✉</span>
                Contact our team for inquiries
              </a>
              <p>
                <span aria-hidden="true">⌖</span>
                Human genetics and biomedical research
              </p>
            </address>
            <div className="ceo-footer-social">
              <div aria-label="Social links" className="ceo-social-icons">
                <a aria-label="LinkedIn" href="/contact">in</a>
                <a aria-label="Contact ClinGene" href="/contact">↗</a>
              </div>
              <p>Better research today,<br />healthier generations tomorrow.</p>
              <span aria-hidden="true" className="ceo-short-rule" />
            </div>
          </div>
          <div className="ceo-footer-bottom">
            <p>© {new Date().getFullYear()} ClinGene (Pvt.) Ltd. All rights reserved.</p>
            <nav aria-label="Legal links">
              <a href="/">Home</a>
              <a href="#privacy-policy">Privacy Policy</a>
              <a href="#terms-of-use">Terms &amp; Conditions</a>
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="relative isolate overflow-hidden text-white z-[1]"
      style={{
        backgroundImage: `${footerBgOverlay}, url(${homeBackground})`,
        backgroundPosition: "center 38%",
        backgroundSize: "cover",
        transition: "background-image 0.4s ease-in-out",
      }}
    >
      <div className="site-container pb-4 pt-5 sm:pt-6 sm:pb-4">

        {/* ── Join CTA banner ───────────────────────────────────────── */}
        {showJoinCta && (
          <div className="flex flex-col justify-between gap-3 border-b border-white/15 pb-4 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)", transition: "color 0.4s ease-in-out" }}
              >
                Open Positions
              </p>
              <h2 className="mt-0.5 text-base sm:text-lg lg:text-xl font-bold tracking-tight">
                Join Our Research Community
              </h2>
              <p className="mt-0.5 text-xs text-slate-300">
                Be a part of our mission to advance human genetics and biomedical research.
              </p>
            </div>
            <Button className="!min-h-8.5 shrink-0 !px-4 !py-1.5 text-xs self-start sm:self-center" href="/open-positions">
              View Open Positions <span aria-hidden="true">→</span>
            </Button>
          </div>
        )}

        {/* ── Footer columns ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.75fr_0.75fr_1.1fr_0.6fr] lg:gap-6 lg:py-5">

          {/* Logo */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <a
              aria-label="ClinGene home"
              className="inline-flex w-[125px] sm:w-[135px] items-center rounded-lg bg-white/95 p-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              href="/"
            >
              <img
                alt="ClinGene — Human Genetics and Biomedical Research"
                width="450"
                height="189"
                className="w-full object-contain"
                src={clingeneLogo}
              />
            </a>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links" className="col-span-1">
            <h3 className="mb-2 text-xs sm:text-sm font-bold text-white">Quick Links</h3>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-white/80">
              {[
                ["Home",        "/"],
                ["CEO Message", "/ceo-message"],
                ["About",       "/about"],
                ["Team",        "/team"],
                ["Services",    "/services"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="transition-colors hover:underline"
                    href={href}
                    style={{ transition: "color 0.3s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "")}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Research Links */}
          <nav aria-label="Footer research links" className="col-span-1">
            <h3 className="mb-2 text-xs sm:text-sm font-bold text-white">Research</h3>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-white/80">
              {[
                ["Research",       "/research"],
                ["Gallery",        "/gallery"],
                ["Open Positions", "/open-positions"],
                ["News",           "/news"],
                ["Contact",        "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="transition-colors hover:underline"
                    href={href}
                    style={{ transition: "color 0.3s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "")}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="mb-2 text-xs sm:text-sm font-bold text-white">Contact Information</h3>
            <a
              className="text-xs sm:text-[13px] leading-relaxed text-white/80"
              href="/contact"
              style={{ transition: "color 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              For inquiries, please get in touch with our team.
              <span className="mt-1 block font-semibold text-white">Contact ClinGene →</span>
            </a>
          </div>

          {/* Follow Us */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="mb-2 text-xs sm:text-sm font-bold text-white">Follow Us</h3>
            <a
              aria-label="Contact ClinGene about social media"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white transition-all hover:bg-white/10"
              href="/contact"
              style={{ transition: "border-color 0.3s ease, color 0.3s ease" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              in
            </a>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 border-t border-white/15 pt-3 pb-1 text-[11px] sm:text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ClinGene (Pvt.) Ltd. All Rights Reserved.</p>
          <div className="flex gap-3 text-[11px] sm:text-xs sm:gap-4">
            <a
              className="transition-colors"
              href="#privacy-policy"
              style={{ transition: "color 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-white/30">|</span>
            <a
              className="transition-colors"
              href="#terms-of-use"
              style={{ transition: "color 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
