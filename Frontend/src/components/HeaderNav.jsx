import { useState, useEffect, useRef } from "react";
import { ChevronDown, Newspaper, BookOpen } from "lucide-react";
import Button from "./Button";

const links = [
  { label: "Home", href: "/" },
  { label: "CEO Message", href: "/ceo-message" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Services", href: "/services" },
  { label: "Research", href: "/research" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
  {
    label: "Resources",
    href: "/blogs",
    children: [
      {
        label: "Blog",
        href: "/blogs",
        description: "Scientific articles & publications",
        icon: BookOpen,
      },
      {
        label: "News",
        href: "/news",
        description: "Company news & press releases",
        icon: Newspaper,
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

function MenuIcon({ open }) {
  return open ? (
    <svg aria-hidden="true" className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

export default function HeaderNav({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const desktopCloseTimerRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const desktopTriggerRef = useRef(null);

  // Close menus when route or activePage changes
  useEffect(() => {
    setMenuOpen(false);
    setDesktopDropdownOpen(false);
    setMobileResourcesOpen(false);
  }, [activePage]);

  // Lock body scroll when mobile menu is open; handle Escape key
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (menuOpen) {
      document.body.classList.add("menu-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileResourcesOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Desktop outside click and Escape handler
  useEffect(() => {
    if (!desktopDropdownOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setDesktopDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDesktopDropdownOpen(false);
        desktopTriggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [desktopDropdownOpen]);

  // Cleanup desktop timer on unmount
  useEffect(() => {
    return () => {
      if (desktopCloseTimerRef.current) {
        clearTimeout(desktopCloseTimerRef.current);
      }
    };
  }, []);

  const handleToggleMobileMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        // Open accordion automatically only if current page is /blogs or /news
        const isResourcesPage =
          activePage === "Blog" ||
          activePage === "Blogs" ||
          activePage === "News" ||
          (typeof window !== "undefined" &&
            (window.location.pathname === "/blogs" ||
              window.location.pathname === "/news" ||
              window.location.pathname.startsWith("/blogs/") ||
              window.location.pathname.startsWith("/news/")));
        setMobileResourcesOpen(isResourcesPage);
      } else {
        setMobileResourcesOpen(false);
      }
      return next;
    });
  };

  const handleDesktopMouseEnter = () => {
    if (desktopCloseTimerRef.current) {
      clearTimeout(desktopCloseTimerRef.current);
      desktopCloseTimerRef.current = null;
    }
    setHasInteracted(true);
    setDesktopDropdownOpen(true);
  };

  const handleDesktopMouseLeave = () => {
    if (desktopCloseTimerRef.current) {
      clearTimeout(desktopCloseTimerRef.current);
    }
    // 130ms delay so moving the pointer from trigger to panel does not close it
    desktopCloseTimerRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
      desktopCloseTimerRef.current = null;
    }, 130);
  };

  const handleDesktopFocus = () => {
    setHasInteracted(true);
    setDesktopDropdownOpen(true);
  };

  const handleDesktopBlur = (e) => {
    if (!desktopDropdownRef.current?.contains(e.relatedTarget)) {
      setDesktopDropdownOpen(false);
    }
  };

  const handleDesktopTriggerClick = (e) => {
    e.preventDefault();
    setHasInteracted(true);
    setDesktopDropdownOpen((prev) => !prev);
  };

  const handleDesktopTriggerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHasInteracted(true);
      setDesktopDropdownOpen((prev) => !prev);
    }
  };

  const renderDesktopLink = (link) => {
    const isLinkActive =
      activePage === link.label ||
      (link.children &&
        link.children.some(
          (c) =>
            c.label === activePage ||
            (c.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
            (c.label === "News" && activePage === "News")
        ));

    if (link.children && link.children.length > 0) {
      return (
        <div
          key={link.label}
          ref={desktopDropdownRef}
          className="relative py-2"
          onMouseEnter={handleDesktopMouseEnter}
          onMouseLeave={handleDesktopMouseLeave}
          onFocus={handleDesktopFocus}
          onBlur={handleDesktopBlur}
        >
          <button
            type="button"
            ref={desktopTriggerRef}
            onClick={handleDesktopTriggerClick}
            onKeyDown={handleDesktopTriggerKeyDown}
            aria-haspopup="true"
            aria-expanded={desktopDropdownOpen}
            aria-controls="desktop-resources-dropdown"
            className={`inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] cursor-pointer ${
              isLinkActive ? "text-(--accent-muted)" : "text-[#1f2937] hover:text-(--accent-dark)"
            }`}
          >
            <span className="relative inline-block">
              {link.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-2 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${
                  isLinkActive
                    ? "scale-x-100 origin-left"
                    : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                }`}
              />
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                desktopDropdownOpen ? "rotate-180 text-(--accent-dark)" : ""
              }`}
            />
          </button>

          {/* Desktop Dropdown Menu with zero-gap hover bridge */}
          <div
            id="desktop-resources-dropdown"
            className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 ${
              hasInteracted ? "transition-all duration-200 ease-out" : ""
            } ${
              desktopDropdownOpen
                ? "opacity-100 visible pointer-events-auto translate-y-0"
                : "opacity-0 invisible pointer-events-none -translate-y-1"
            }`}
          >
            <div className="w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5">
              {link.children.map((child) => {
                const isChildActive =
                  activePage === child.label ||
                  (child.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
                  (child.label === "News" && activePage === "News");
                const Icon = child.icon;
                return (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={() => setDesktopDropdownOpen(false)}
                    className={`group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                      isChildActive
                        ? "bg-(--accent-soft) text-(--accent-dark)"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {Icon && (
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isChildActive
                            ? "bg-(--accent) text-white"
                            : "bg-slate-100 text-slate-500 group-hover/item:bg-(--accent) group-hover/item:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span
                        className={`text-[13px] font-semibold leading-snug transition-colors ${
                          isChildActive
                            ? "text-(--accent-dark)"
                            : "text-slate-800 group-hover/item:text-(--accent-dark)"
                        }`}
                      >
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="mt-0.5 text-[11px] font-normal leading-tight text-slate-400">
                          {child.description}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <a
        key={link.label}
        aria-current={isLinkActive ? "page" : undefined}
        className={`whitespace-nowrap py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] ${
          isLinkActive ? "text-(--accent-muted)" : "text-[#1f2937] hover:text-(--accent-dark)"
        }`}
        href={link.href}
      >
        <span className="group relative inline-block">
          {link.label}
          <span
            aria-hidden="true"
            className={`absolute -bottom-2 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${
              isLinkActive
                ? "scale-x-100 origin-left"
                : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
            }`}
          />
        </span>
      </a>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 w-full border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition-all">
        <div className="site-container flex min-h-18 sm:min-h-19 lg:min-h-21 items-center justify-between gap-4">
          <a
            aria-label="ClinGene home"
            className="flex items-center shrink-0 touch-manipulation group"
            href="/"
          >
            <img
              alt="ClinGene"
              width="733"
              height="290"
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              src="/images/clingene-logo.webp"
            />
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-5 min-[1200px]:flex 2xl:gap-7">
            {links.map(renderDesktopLink)}
          </nav>

          {/* Desktop action */}
          <div className="hidden shrink-0 items-center gap-4 min-[1200px]:flex">
            <Button className="px-5 py-2.5 text-[11px]" href="/contact">
              Contact Us
            </Button>
          </div>

          {/* Mobile controls (<1200px) — 44px minimum touch target */}
          <div className="flex items-center gap-2.5 min-[1200px]:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] cursor-pointer touch-manipulation"
              onClick={handleToggleMobileMenu}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Header spacer so top page content is never hidden behind fixed header */}
      <div className="h-18 sm:h-19 lg:h-21 shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Semi-transparent Backdrop Overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 min-[1200px]:hidden z-998 bg-slate-900/40 transition-opacity duration-200 ease-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setMenuOpen(false);
          setMobileResourcesOpen(false);
        }}
      />

      {/* Mobile panel fitting the viewport with dvh, clean scroll, and compact reachable items */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
        className={`fixed inset-x-0 min-[1200px]:hidden z-999 border-t border-slate-100 bg-white flex flex-col shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out ${
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
        style={{
          top: "var(--header-height, 72px)",
          maxHeight: "calc(100dvh - var(--header-height, 72px))",
          overscrollBehavior: "contain",
        }}
      >
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-4 pt-2.5 flex flex-col gap-1"
          style={{
            overscrollBehavior: "contain",
            paddingBottom: "max(1.5rem, calc(1rem + env(safe-area-inset-bottom, 0px)))",
          }}
        >
          {links.map((link) => {
            const isLinkActive =
              activePage === link.label ||
              (link.children &&
                link.children.some(
                  (c) =>
                    c.label === activePage ||
                    (c.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
                    (c.label === "News" && activePage === "News")
                ));

            if (link.children && link.children.length > 0) {
              return (
                <div key={link.label} className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={mobileResourcesOpen}
                    aria-controls="mobile-resources-submenu"
                    onClick={() => setMobileResourcesOpen((prev) => !prev)}
                    className={`group flex min-h-[44px] w-full items-center justify-between rounded-lg px-4 py-2.5 text-[15px] font-semibold leading-tight transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] touch-manipulation cursor-pointer ${
                      isLinkActive ? "text-(--accent-muted) bg-(--accent-soft)" : "text-slate-700"
                    }`}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-0.5 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${
                          isLinkActive
                            ? "scale-x-100 origin-left"
                            : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                        }`}
                      />
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        mobileResourcesOpen ? "rotate-180 text-(--accent-dark)" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile sub-links: collapsed by default, opens only on tap or if on /blogs /news */}
                  <div
                    id="mobile-resources-submenu"
                    className={`ml-4 my-1 pl-3 border-l-2 border-slate-200/70 flex flex-col gap-1 ${
                      mobileResourcesOpen ? "block" : "hidden"
                    }`}
                  >
                    {link.children.map((child) => {
                      const isChildActive =
                        activePage === child.label ||
                        (child.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
                        (child.label === "News" && activePage === "News");
                      const ChildIcon = child.icon;
                      return (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileResourcesOpen(false);
                          }}
                          className={`flex min-h-[40px] items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                            isChildActive
                              ? "text-(--accent-dark) bg-(--accent-soft)"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          {ChildIcon && <ChildIcon className="h-3.5 w-3.5 text-(--accent)" />}
                          <span>{child.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.label}
                aria-current={activePage === link.label ? "page" : undefined}
                className={`group flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-[15px] font-semibold leading-tight transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] touch-manipulation ${
                  activePage === link.label
                    ? "text-(--accent-muted) bg-(--accent-soft)"
                    : "text-slate-700"
                }`}
                href={link.href}
                onClick={() => {
                  setMenuOpen(false);
                  setMobileResourcesOpen(false);
                }}
              >
                <span className="relative inline-block">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-0.5 w-full bg-(--accent) transition-transform duration-300 ${
                      activePage === link.label
                        ? "scale-x-100 origin-left"
                        : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                    }`}
                  />
                </span>
              </a>
            );
          })}

          {/* Full-width Contact Us button */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <Button
              className="w-full! min-h-[44px]! py-2.5! text-center font-bold text-sm"
              href="/contact"
              onClick={() => {
                setMenuOpen(false);
                setMobileResourcesOpen(false);
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
