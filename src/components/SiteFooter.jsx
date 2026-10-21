const clingeneLogo = "/images/clingene-logo.webp";
const homeBackground = "/images/home1.webp";

export default function SiteFooter({ compact = false, showJoinCta }) {
  if (compact) {
    return (
      <footer className="ceo-footer">
        <div className="ceo-shell">
          <div className="ceo-footer-main">
            <a aria-label="ClinGene home" className="ceo-footer-brand shrink-0" href="#home">
              <img
                alt="ClinGene"
                className="h-10 w-36 rounded-lg bg-white object-contain px-2.5 py-1 sm:h-11 sm:w-40"
                src={clingeneLogo}
              />
            </a>
            <address className="ceo-contact-details">
              <a href="#contact">
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
                <a aria-label="LinkedIn" href="#contact">in</a>
                <a aria-label="Contact ClinGene" href="#contact">↗</a>
              </div>
              <p>Better research today,<br />healthier generations tomorrow.</p>
              <span aria-hidden="true" className="ceo-short-rule" />
            </div>
          </div>
          <div className="ceo-footer-bottom">
            <p>© {new Date().getFullYear()} ClinGene (Pvt.) Ltd. All rights reserved.</p>
            <nav aria-label="Legal links">
              <a href="#home">Home</a>
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
      className="relative isolate overflow-hidden bg-[#031b37] text-white"
      style={{
        backgroundImage: `linear-gradient(105deg, rgba(2, 19, 42, 0.97), rgba(3, 28, 57, 0.94)), url(${homeBackground})`,
        backgroundPosition: "center 38%",
        backgroundSize: "cover",
      }}
    >
      <div className="site-container pb-5 pt-8 sm:pt-10">
        {showJoinCta && (
          <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-7 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fb6ce]">
                Open Positions
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Join Our Research Community
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
                Be a part of our mission to advance human genetics and biomedical research.
              </p>
            </div>
            <a
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#10c8e0] px-5 text-xs font-bold text-[#050b1c] transition-colors hover:bg-[#079bb0] sm:self-center"
              href="#open-positions"
            >
              View Open Positions
              <span aria-hidden="true">→</span>
            </a>
          </div>
        )}

        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr_0.7fr] lg:gap-7">
          <a aria-label="ClinGene home" className="flex w-[150px] self-start items-center rounded-xl bg-white/95 p-3 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12c5df]" href="#home">
            <img
              alt="ClinGene — Human Genetics and Biomedical Research"
              className="w-full object-contain"
              src={clingeneLogo}
            />
          </a>

          <nav aria-label="Footer quick links">
            <h3 className="mb-3 text-sm font-bold text-white">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              {[
                ["Home", "#home"],
                ["CEO Message", "#ceo-message"],
                ["About", "#about"],
                ["Team", "#team"],
                ["Services", "#services"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a className="transition-colors hover:text-[#10c8e0] hover:underline" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer research links">
            <h3 className="mb-3 text-sm font-bold text-white">Research</h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              {[
                ["Research", "#research"],
                ["Gallery", "#gallery"],
                ["Open Positions", "#open-positions"],
                ["News", "#news"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a className="transition-colors hover:text-[#10c8e0] hover:underline" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Contact Information</h3>
            <a
              className="text-sm leading-6 text-white/80 transition-colors hover:text-[#10c8e0]"
              href="#contact"
            >
              For inquiries, please get in touch with our team.
              <span className="mt-1 block font-semibold text-white">Contact ClinGene →</span>
            </a>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Follow Us</h3>
            <a
              aria-label="Contact ClinGene about social media"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              href="#contact"
            >
              in
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-4 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ClinGene (Pvt.) Ltd. All Rights Reserved.</p>
          <div className="flex gap-4 text-sm">
            <a className="transition-colors hover:text-[#10c8e0]" href="#privacy-policy">
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-white/30">|</span>
            <a className="transition-colors hover:text-[#10c8e0]" href="#terms-of-use">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
