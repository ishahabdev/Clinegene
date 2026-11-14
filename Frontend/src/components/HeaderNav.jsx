import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Atom,
  Baby,
  BookOpen,
  Boxes,
  ChevronDown,
  Dna,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Library,
  Lightbulb,
  Microscope,
  Newspaper,
  Network,
  Ribbon,
  ShieldCheck,
  ShieldPlus,
  Stethoscope,
  TestTubes,
} from "lucide-react";
import Button from "./Button";
import { GENETIC_COUNSELING_SUBSERVICES } from "../lib/servicesClient.js";

const links = [
  { label: "Home", href: "/" },
  { label: "CEO Message", href: "/ceo-message" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  {
    label: "Services",
    href: "/services",
    groups: [
      {
        label: "Clinical Services",
        children: [
          {
            label: "Genetic Counseling",
            href: "/services/genetic-counseling",
            subServices: GENETIC_COUNSELING_SUBSERVICES,
          },
          { label: "Clinical Whole Exome/Genome Sequencing", href: "/services/whole-exome-genome-sequencing" },
          { label: "Panel Sequencing", href: "/services/panel-sequencing" },
          { label: "Sanger Sequencing", href: "/services/sanger-sequencing" },
          { label: "Whole Exome/Genome Sequencing", href: "/services/whole-exomegenome-sequencing" },
        ],
      },
      {
        label: "Academic Services",
        children: [
          { label: "RNA-Sequencing/Transcriptome Sequencing", href: "/services/rna-seq" },
          { label: "Metagenome Sequencing", href: "/services/whole-genome-metagenome" },
          { label: "Phylogenetic Tree Construction & Analysis", href: "/services/phylogenetic-tree-construction" },
          { label: "Pangenome Analysis", href: "/services/pangenome-analysis" },
          { label: "MD Simulation", href: "/services/protein-docking-molecular-dynamics" },
          { label: "Protein Modeling", href: "/services/protein-modeling" },
          { label: "Immunogenicity Analysis", href: "/services/immunogenicity-analysis" },
          { label: "Virtual Screening", href: "/services/virtual-screening" },
          { label: "Library Generation", href: "/services/library-generation" },
          { label: "Molecular Biology Services", href: "/services/molecular-biology-services" },
          { label: "Project Design", href: "/services/project-design" },
        ],
      },
    ],
  },
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

const servicesLink = links.find((link) => link.label === "Services");
const servicesByCategory = servicesLink.groups
  .flatMap((group) =>
    group.children.map((service) => ({
      ...service,
      category: group.label.replace(/ Services$/, ""),
    }))
  )
  .reduce(
    (groups, service) => ({
      ...groups,
      [service.category]: [...(groups[service.category] || []), service],
    }),
    {}
  );
const serviceCategories = Object.keys(servicesByCategory);

function getServiceMenuIcon(label) {
  const name = label.toLowerCase();
  if (name.includes("clinical services")) return Stethoscope;
  if (name.includes("academic services")) return GraduationCap;
  if (name.includes("prenatal")) return Baby;
  if (name.includes("newborn")) return Activity;
  if (name.includes("genetic disease")) return ShieldPlus;
  if (name.includes("chromosomal")) return GitBranch;
  if (name.includes("hereditary cancer")) return Ribbon;
  if (name.includes("counsel")) return Dna;
  if (name.includes("cancer")) return ShieldCheck;
  if (name.includes("sequencing")) return TestTubes;
  if (name.includes("metagenom")) return Network;
  if (name.includes("phylogen")) return Network;
  if (name.includes("pangenom")) return Boxes;
  if (name.includes("simulation")) return Atom;
  if (name.includes("protein")) return Atom;
  if (name.includes("immunogenic")) return ShieldCheck;
  if (name.includes("screening")) return Microscope;
  if (name.includes("library")) return Library;
  if (name.includes("molecular biology")) return FlaskConical;
  if (name.includes("project design")) return Lightbulb;
  return Dna;
}

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
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeServicesCategory, setActiveServicesCategory] = useState("Clinical");
  const [expandedServiceMenu, setExpandedServiceMenu] = useState(null);

  const desktopCloseTimerRef = useRef(null);
  const desktopDropdownRefs = useRef({});
  const desktopTriggerRefs = useRef({});

  // Close menus when route or activePage changes
  useEffect(() => {
    setMenuOpen(false);
    setOpenDesktopDropdown(null);
    setMobileResourcesOpen(false);
    setExpandedServiceMenu(null);
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
    if (!openDesktopDropdown) return undefined;

    const handleOutsideClick = (e) => {
      const dropdown = desktopDropdownRefs.current[openDesktopDropdown];
      if (dropdown && !dropdown.contains(e.target)) {
        setOpenDesktopDropdown(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenDesktopDropdown(null);
        desktopTriggerRefs.current[openDesktopDropdown]?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDesktopDropdown]);

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
        setActiveServicesCategory("Clinical");
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

  const handleDesktopMouseEnter = (link) => {
    if (desktopCloseTimerRef.current) {
      clearTimeout(desktopCloseTimerRef.current);
      desktopCloseTimerRef.current = null;
    }
    if (link.label === "Services" && openDesktopDropdown !== link.label) {
      setActiveServicesCategory("Clinical");
    }
    setHasInteracted(true);
    setOpenDesktopDropdown(link.label);
  };

  const handleDesktopMouseLeave = (link) => {
    if (desktopCloseTimerRef.current) {
      clearTimeout(desktopCloseTimerRef.current);
    }
    // 130ms delay so moving the pointer from trigger to panel does not close it
    desktopCloseTimerRef.current = setTimeout(() => {
      setOpenDesktopDropdown((current) =>
        current === link.label ? null : current
      );
      desktopCloseTimerRef.current = null;
    }, 130);
  };

  const handleDesktopFocus = (link) => {
    if (link.label === "Services" && openDesktopDropdown !== link.label) {
      setActiveServicesCategory("Clinical");
    }
    setHasInteracted(true);
    setOpenDesktopDropdown(link.label);
  };

  const handleDesktopBlur = (e, link) => {
    if (!desktopDropdownRefs.current[link.label]?.contains(e.relatedTarget)) {
      setOpenDesktopDropdown((current) =>
        current === link.label ? null : current
      );
    }
  };

  const handleDesktopTriggerClick = (e, link) => {
    e.preventDefault();
    setHasInteracted(true);
    if (link.label === "Services" && openDesktopDropdown !== link.label) {
      setActiveServicesCategory("Clinical");
    }
    setOpenDesktopDropdown((current) =>
      current === link.label ? null : link.label
    );
  };

  const handleDesktopTriggerKeyDown = (e, link) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHasInteracted(true);
      if (link.label === "Services" && openDesktopDropdown !== link.label) {
        setActiveServicesCategory("Clinical");
      }
      setOpenDesktopDropdown((current) =>
        current === link.label ? null : link.label
      );
    }
  };

  const renderDesktopLink = (link) => {
    const dropdownChildren = link.groups
      ? link.groups.flatMap((group) => group.children)
      : link.children || [];
    const isLinkActive =
      activePage === link.label ||
      (dropdownChildren.length > 0 &&
        dropdownChildren.some(
          (c) =>
            c.label === activePage ||
            (c.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
            (c.label === "News" && activePage === "News")
        ));

    if (dropdownChildren.length > 0) {
      const dropdownId = `desktop-${link.label.toLowerCase()}-dropdown`;
      return (
        <div
          key={link.label}
          ref={(element) => {
            desktopDropdownRefs.current[link.label] = element;
          }}
          className="relative py-2"
          onMouseEnter={() => handleDesktopMouseEnter(link)}
          onMouseLeave={() => handleDesktopMouseLeave(link)}
          onFocus={() => handleDesktopFocus(link)}
          onBlur={(event) => handleDesktopBlur(event, link)}
        >
          <button
            type="button"
            ref={(element) => {
              desktopTriggerRefs.current[link.label] = element;
            }}
            onClick={(event) => handleDesktopTriggerClick(event, link)}
            onKeyDown={(event) => handleDesktopTriggerKeyDown(event, link)}
            aria-haspopup="true"
            aria-expanded={openDesktopDropdown === link.label}
            aria-controls={dropdownId}
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
                openDesktopDropdown === link.label
                  ? "rotate-180 text-(--accent-dark)"
                  : ""
              }`}
            />
          </button>

          {/* Desktop Dropdown Menu with zero-gap hover bridge */}
          <div
            id={dropdownId}
            className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 ${
              hasInteracted ? "transition-all duration-200 ease-out" : ""
            } ${
              openDesktopDropdown === link.label
                ? "opacity-100 visible pointer-events-auto translate-y-0"
                : "opacity-0 invisible pointer-events-none -translate-y-1"
            }`}
          >
            <div
              className={`${link.label === "Services" ? "w-[min(90vw,720px)] overflow-visible p-0" : link.groups ? "grid w-[min(90vw,640px)] grid-cols-2 gap-4 p-4" : "w-60 p-2"} rounded-2xl border bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5`}
              style={{
                borderColor:
                  link.label === "Services"
                    ? "var(--service-featured-banner-border, #e2e8f0)"
                    : undefined,
                background:
                  link.label === "Services"
                    ? "var(--service-featured-banner-bg, #fff)"
                    : undefined,
              }}
            >
              {link.label === "Services" ? (
                <div className="grid w-full grid-cols-[190px_minmax(0,1fr)] gap-0 overflow-visible p-0">
                  <div
                    className="space-y-1 border-r p-2"
                    style={{
                      borderColor:
                        "var(--service-featured-banner-border, #e2e8f0)",
                      background:
                        "color-mix(in srgb, var(--accent-soft, #f8fafc) 55%, white)",
                    }}
                  >
                    {serviceCategories.map((category) => {
                      const isSelected = activeServicesCategory === category;
                      const CategoryIcon = getServiceMenuIcon(`${category} Services`);
                      return (
                        <a
                          key={category}
                          href={`/services?category=${category.toLowerCase()}`}
                          aria-current={isSelected ? "page" : undefined}
                          onMouseEnter={() => {
                            setActiveServicesCategory(category);
                            setExpandedServiceMenu(null);
                          }}
                          onFocus={() => {
                            setActiveServicesCategory(category);
                            setExpandedServiceMenu(null);
                          }}
                          onClick={() => setOpenDesktopDropdown(null)}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                            isSelected
                              ? "text-white shadow-sm"
                              : "text-slate-700 hover:bg-white/80 hover:text-(--accent-dark)"
                          }`}
                          style={
                            isSelected
                              ? { backgroundColor: "var(--accent)" }
                              : undefined
                          }
                        >
                          <CategoryIcon
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          />
                          <span className="flex-1">{category} Services</span>
                          <ChevronDown aria-hidden="true" className="-rotate-90 h-3.5 w-3.5" />
                        </a>
                      );
                    })}
                  </div>
                  <div className="min-w-0 p-3">
                    <div className="space-y-0.5 p-1">
                      {(servicesByCategory[activeServicesCategory] || []).map((service) => {
                        const hasSubServices = Boolean(service.subServices?.length);
                        const isExpanded = expandedServiceMenu === service.label;
                        const ServiceIcon = getServiceMenuIcon(service.label);
                        return (
                          <div
                            key={service.href}
                            className="relative"
                            onMouseEnter={() =>
                              setExpandedServiceMenu(hasSubServices ? service.label : null)
                            }
                            onMouseLeave={() => setExpandedServiceMenu(null)}
                            onFocusCapture={() =>
                              setExpandedServiceMenu(hasSubServices ? service.label : null)
                            }
                            onBlur={(event) => {
                              if (!event.currentTarget.contains(event.relatedTarget)) {
                                setExpandedServiceMenu(null);
                              }
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <a
                                href={service.href}
                                onClick={() => setOpenDesktopDropdown(null)}
                                className="group/service flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] leading-snug text-slate-700 transition-colors hover:bg-white/80 hover:text-(--accent-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                              >
                                <span
                                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors group-hover/service:bg-white"
                                  style={{
                                    backgroundColor:
                                      "color-mix(in srgb, var(--accent) 11%, white)",
                                    color: "var(--accent)",
                                  }}
                                >
                                  <ServiceIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                  />
                                </span>
                                <span>{service.label}</span>
                              </a>
                              {hasSubServices && (
                                <button
                                  type="button"
                                  aria-label={`Show ${service.label} subservices`}
                                  aria-expanded={isExpanded}
                                  onClick={() =>
                                    setExpandedServiceMenu(isExpanded ? null : service.label)
                                  }
                                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/80 hover:text-(--accent-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                                >
                                  <ChevronDown
                                    aria-hidden="true"
                                    className="-rotate-90 h-3.5 w-3.5"
                                  />
                                </button>
                              )}
                            </div>
                            {hasSubServices && isExpanded && (
                              <div
                                className="absolute left-full top-0 z-30 w-64 rounded-xl border p-2 shadow-[0_12px_32px_rgba(15,23,42,0.14)]"
                                style={{
                                  borderColor: "var(--service-featured-banner-border, #e2e8f0)",
                                  background: "var(--service-featured-banner-bg, #fff)",
                                }}
                              >
                                {service.subServices.map((subService, index) => {
                                  const SubServiceIcon = getServiceMenuIcon(subService.label);
                                  return (
                                    <a
                                      key={subService.id}
                                      href={`/contact?service=genetic-counseling-${subService.id}`}
                                      onClick={() => setOpenDesktopDropdown(null)}
                                      className={`flex min-h-10 items-center gap-2 px-2 py-1.5 text-[11px] leading-snug text-slate-600 transition-colors hover:bg-(--accent-soft) hover:text-(--accent-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                                        index < service.subServices.length - 1
                                          ? "border-b"
                                          : ""
                                      }`}
                                      style={
                                        index < service.subServices.length - 1
                                          ? {
                                              borderColor:
                                                "var(--service-featured-banner-border, #e2e8f0)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <SubServiceIcon
                                        aria-hidden="true"
                                        className="h-4 w-4 shrink-0"
                                      />
                                      <span>{subService.label}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : link.groups
                ? link.groups.map((group) => (
                    <section key={group.label} aria-label={group.label}>
                      <h3 className="mb-2 border-b border-slate-100 px-2 pb-2 text-xs font-bold uppercase tracking-wide text-(--accent-dark)">
                        {group.label}
                      </h3>
                      <div className="max-h-[min(65vh,480px)] space-y-0.5 overflow-y-auto">
                        {group.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDesktopDropdown(null)}
                            className="block rounded-lg px-2 py-1.5 text-xs leading-snug text-slate-700 transition-colors hover:bg-(--accent-soft) hover:text-(--accent-dark)"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </section>
                  ))
                : link.children.map((child) => {
                const isChildActive =
                  activePage === child.label ||
                  (child.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
                  (child.label === "News" && activePage === "News");
                const Icon = child.icon;
                return (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={() => setOpenDesktopDropdown(null)}
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
            const dropdownChildren = link.groups
              ? link.groups.flatMap((group) => group.children)
              : link.children || [];
            const isLinkActive =
              activePage === link.label ||
              (dropdownChildren.length > 0 &&
                dropdownChildren.some(
                  (c) =>
                    c.label === activePage ||
                    (c.label === "Blog" && (activePage === "Blogs" || activePage === "Blog")) ||
                    (c.label === "News" && activePage === "News")
                ));

            if (dropdownChildren.length > 0) {
              const submenuId = `mobile-${link.label.toLowerCase()}-submenu`;
              return (
                <div key={link.label} className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={mobileResourcesOpen}
                    aria-controls={submenuId}
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

                  <div
                    id={submenuId}
                    className={`ml-4 my-1 pl-3 border-l-2 border-slate-200/70 flex flex-col gap-1 ${
                      mobileResourcesOpen ? "block" : "hidden"
                    }`}
                  >
                    {link.label === "Services" ? (
                      <>
                        <div className="flex gap-2 border-b border-slate-200 pb-2">
                          {serviceCategories.map((category) => {
                            const isSelected = activeServicesCategory === category;
                            const CategoryIcon = getServiceMenuIcon(`${category} Services`);
                            return (
                              <a
                                key={category}
                                href={`/services?category=${category.toLowerCase()}`}
                                aria-current={isSelected ? "page" : undefined}
                                onFocus={() => {
                                  setActiveServicesCategory(category);
                                  setExpandedServiceMenu(null);
                                }}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileResourcesOpen(false);
                                }}
                                className={`flex min-h-10 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                                  isSelected
                                    ? "text-white"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`}
                                style={
                                  isSelected
                                    ? { backgroundColor: "var(--accent)" }
                                    : undefined
                                }
                              >
                                <CategoryIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                                {category} Services
                              </a>
                            );
                          })}
                        </div>
                        <div className="py-2">
                          {(servicesByCategory[activeServicesCategory] || []).map((service) => {
                            const hasSubServices = Boolean(service.subServices?.length);
                            const isExpanded = expandedServiceMenu === service.label;
                            const ServiceIcon = getServiceMenuIcon(service.label);
                            return (
                              <div key={service.href}>
                                <div className="flex items-center gap-1">
                                  <a
                                    href={service.href}
                                    onClick={() => {
                                      setMenuOpen(false);
                                      setMobileResourcesOpen(false);
                                      setExpandedServiceMenu(null);
                                    }}
                                    className="flex min-h-[40px] min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                                  >
                                    <span
                                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                                      style={{
                                        backgroundColor:
                                          "color-mix(in srgb, var(--accent) 11%, white)",
                                        color: "var(--accent)",
                                      }}
                                    >
                                      <ServiceIcon aria-hidden="true" className="h-4 w-4" />
                                    </span>
                                    {service.label}
                                  </a>
                                  {hasSubServices && (
                                    <button
                                      type="button"
                                      aria-label={`Show ${service.label} subservices`}
                                      aria-expanded={isExpanded}
                                      onClick={() =>
                                        setExpandedServiceMenu(isExpanded ? null : service.label)
                                      }
                                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                                    >
                                      <ChevronDown
                                        aria-hidden="true"
                                        className={`h-4 w-4 transition-transform ${
                                          isExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>
                                {hasSubServices && isExpanded && (
                                  <div className="ml-8 space-y-0.5 border-l border-slate-200 pl-2">
                                    {service.subServices.map((subService) => {
                                      const SubServiceIcon = getServiceMenuIcon(subService.label);
                                      return (
                                        <a
                                          key={subService.id}
                                          href={`/contact?service=genetic-counseling-${subService.id}`}
                                          onClick={() => {
                                            setMenuOpen(false);
                                            setMobileResourcesOpen(false);
                                            setExpandedServiceMenu(null);
                                          }}
                                          className="flex min-h-9 items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                                        >
                                          <SubServiceIcon
                                            aria-hidden="true"
                                            className="h-4 w-4 shrink-0"
                                          />
                                          {subService.label}
                                        </a>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : link.groups
                      ? link.groups.map((group) => (
                          <section key={group.label} className="py-1">
                            <h3 className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-(--accent-dark)">
                              {group.label}
                            </h3>
                            {group.children.map((child) => (
                              <a
                                key={child.href}
                                href={child.href}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileResourcesOpen(false);
                                }}
                                className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                              >
                                {child.label}
                              </a>
                            ))}
                          </section>
                        ))
                      : link.children.map((child) => {
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
