import { useState } from "react";
import clingeneLogo from "../assets/clingene-logo.png";

const links = [
  { label: "Home", href: "#home" },
  { label: "CEO Message", href: "#ceo-message" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Services", href: "#services" },
  { label: "Research", href: "#research" },
  { label: "Gallery", href: "#gallery" },
  { label: "Open Positions", href: "#open-positions" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

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
      className={`relative whitespace-nowrap py-2 text-[11px] font-semibold transition-colors hover:text-[#bd0d27] ${
        activePage === label
          ? "text-[#bd0d27] after:absolute after:inset-x-0 after:-bottom-0.75 after:h-0.5 after:bg-[#bd0d27]"
          : "text-[#1f2937]"
      }`}
      href={href}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </a>
  );

  return (
    <header className="relative z-10 w-full border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="mx-auto flex min-h-19 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-21 lg:px-10">
        <a aria-label="Clingene home" className="shrink-0" href="#home">
          <img
            alt="Clingene"
            className="h-[14.5 w-37.5 object-contain sm:16.5 sm:w-44.5"
            src={clingeneLogo}
          />
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-3 min-[1200px]:flex 2xl:gap-4">
          {links.map(renderLink)}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 min-[1200px]:flex">
          <button
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-100 text-slate-600 transition-colors hover:border-slate-300 hover:text-[#bd0d27]"
            type="button"
          >
            <SearchIcon />
          </button>
          <a
            className="rounded-full bg-[#bd0d27] px-5 py-[11px] text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#9f0b21]"
            href="#contact"
          >
            Contact Us
          </a>
        </div>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-[#bd0d27] hover:text-[#bd0d27] min-[1200px]:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-t border-slate-100 bg-white px-5 py-4 shadow-lg min-[1200px]:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                aria-current={activePage === link.label ? "page" : undefined}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50 hover:text-[#bd0d27] ${
                  activePage === link.label ? "text-[#bd0d27]" : "text-slate-700"
                }`}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              className="mt-2 rounded-full bg-[#bd0d27] px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#9f0b21]"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
