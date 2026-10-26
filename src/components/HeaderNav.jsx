import { useState } from "react";
import Button from "./Button";
import ThemeSwitcher from "./ThemeSwitcher";

const clingeneLogo = "/images/clingene-logo.webp";

const links = [
  { label: "Home", href: "/" },
  { label: "CEO Message", href: "/ceo-message" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Services", href: "/services" },
  { label: "Research", href: "/research" },
  { label: "Gallery", href: "/gallery" },
  { label: "Open Positions", href: "/open-positions" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];


function MenuIcon({ open }) {
  return open ? (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export default function HeaderNav({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderLink = ({ label, href }) => (
    <a
      key={label}
      aria-current={activePage === label ? "page" : undefined}
      className={`whitespace-nowrap py-2 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] ${activePage === label ? "text-(--accent-muted)" : "text-[#1f2937]"}`}
      href={href}
      onClick={() => setMenuOpen(false)}
    >
      <span className="group relative inline-block">
        {label}
        <span aria-hidden="true" className={`absolute -bottom-2 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${activePage === label ? "scale-x-100 origin-left" : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"}`} />
      </span>
    </a>
  );

  return (
    <header
      className="relative z-10 w-full border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
    >
      <div className="site-container flex min-h-19 items-center justify-between gap-4 lg:min-h-21">
        <a aria-label="Clingene home" className="shrink-0" href="/">
          <img
            alt="Clingene"
            width="450"
            height="189"
            className="h-11 w-36 object-contain sm:h-12 sm:w-44"
            src={clingeneLogo}
          />
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 min-[1200px]:flex 2xl:gap-7">
          {links.map(renderLink)}
        </nav>

        {/* Desktop actions (≥1200px) */}
        <div className="hidden shrink-0 items-center gap-4 min-[1200px]:flex">
          <ThemeSwitcher />
          <Button className="min-h-0! px-5! py-2.75! text-[11px]!" href="/contact">Contact Us</Button>
        </div>

        {/* Mobile controls (<1200px) */}
        <div className="flex items-center gap-2.5 min-[1200px]:hidden">
          <ThemeSwitcher />
          <Button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="h-10! min-h-10! w-10! shrink-0! rounded-full! border! border-slate-200! p-0! text-slate-700! hover:text-white!"
            onClick={() => setMenuOpen(!menuOpen)}
            variant="white"
          >
            <MenuIcon open={menuOpen} />
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-t border-slate-100 bg-white px-5 py-4 shadow-lg min-[1200px]:hidden"
        >
          <div className="mx-auto flex max-w-360 flex-col items-stretch gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                aria-current={activePage === link.label ? "page" : undefined}
                className={`group rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] ${
                  activePage === link.label ? "text-(--accent-muted)" : "text-slate-700"
                }`}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                <span className="relative inline-block">
                  {link.label}
                  <span aria-hidden="true" className={`absolute -bottom-0.5 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${activePage === link.label ? "scale-x-100 origin-left" : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"}`} />
                </span>
              </a>
            ))}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <Button
                className="w-full! py-3! text-center"
                href="/contact"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
