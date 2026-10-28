import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeaderNav from "./components/HeaderNav.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import HomePage from "./pages/HomePage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import Button from "./components/Button.jsx";
import LenisProvider, { useLenisRef } from "./components/LenisProvider.jsx";
import SectionScrollEffects from "./components/SectionScrollEffects.jsx";
import ScrollEnhancements from "./components/ScrollEnhancements.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { seoRoutes } from "./data/seoData.js";

const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const CEOMessagePage = lazy(() => import("./pages/CEOMessagePage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.jsx"));
const OpenPositionsPage = lazy(() => import("./pages/OpenPositionsPage.jsx"));
const ResearchPage = lazy(() => import("./pages/ResearchPage.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage.jsx"));
const TeamPage = lazy(() => import("./pages/TeamPage.jsx"));

const pages = {
  home: { label: "Home", component: HomePage },
  "ceo-message": { label: "CEO Message", component: CEOMessagePage },
  about: { label: "About", component: AboutPage },
  team: { label: "Team", component: TeamPage },
  services: { label: "Services", component: ServicesPage },
  "service-detail": { label: "Services", component: ServiceDetailPage },
  research: { label: "Research", component: ResearchPage },
  gallery: { label: "Gallery", component: GalleryPage },
  careers: { label: "Careers", component: OpenPositionsPage },
  "open-positions": { label: "Careers", component: OpenPositionsPage },
  news: { label: "News", component: NewsPage },
  contact: { label: "Contact", component: ContactPage },
  "not-found": { label: "Page Not Found", component: PageNotFoundPage },
};

function LoadingScreen() {
  return (
    <div
      aria-label="Loading ClinGene"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
    >
      <img
        alt="ClinGene"
        width="450"
        height="189"
        className="preloader-logo h-28 w-80 max-w-[85vw] object-contain sm:h-36 sm:w-md lg:h-44 lg:w-xl"
        src="/images/clingene-logo.webp"
      />
      <span className="sr-only">Loading ClinGene</span>
    </div>
  );
}

function getCurrentPage(ssrUrl) {
  if (typeof window === "undefined") {
    if (!ssrUrl) return "home";
    const clean = ssrUrl.replace(/^\/|\/$/g, "");
    if (clean === "" || clean === "index.html") return "home";
    if (clean.startsWith("services/")) return "service-detail";
    if (clean === "careers" || clean === "open-positions") return "careers";
    if (pages[clean]) return clean;
    return "not-found";
  }

  const hash = window.location.hash.slice(1);
  const pathname = window.location.pathname.replace(/^\/|\/$/g, "");

  // If user landed with #home or an old URL like /services#home, normalize immediately to "/"
  if (hash === "home") {
    if (window.location.pathname !== "/" || window.location.hash) {
      window.history.replaceState(null, "", "/");
    }
    return "home";
  }

  // If hash has services/<slug>
  if (hash.startsWith("services/")) {
    const slug = hash.slice("services/".length);
    const cleanUrl = `/services/${slug}`;
    if (window.location.hash || window.location.pathname !== cleanUrl) {
      window.history.replaceState(null, "", cleanUrl);
    }
    return "service-detail";
  }

  if (hash === "careers" || hash === "open-positions") {
    const cleanUrl = "/careers";
    if (window.location.hash || window.location.pathname !== cleanUrl) {
      window.history.replaceState(null, "", cleanUrl);
    }
    return "careers";
  }

  // If there's a legacy hash matching a page (e.g. #services), normalize to clean path /services
  if (pages[hash]) {
    const cleanUrl = hash === "home" ? "/" : `/${hash}`;
    if (window.location.hash || window.location.pathname !== cleanUrl) {
      window.history.replaceState(null, "", cleanUrl);
    }
    return hash;
  }

  // If pathname is root or index.html:
  if (pathname === "" || pathname === "index.html") {
    return "home";
  }

  // If pathname matches /services/<slug>
  if (pathname.startsWith("services/")) {
    return "service-detail";
  }

  if (pathname === "careers" || pathname === "open-positions") {
    return "careers";
  }

  // If pathname matches a registered page (e.g. /about, /services, /team, /contact):
  if (pages[pathname]) {
    return pathname;
  }

  return "not-found";
}

function getHashTarget(hash) {
  try {
    return document.getElementById(decodeURIComponent(hash));
  } catch {
    return null;
  }
}

function AppContent({ ssrUrl }) {
  const [pageId, setPageId] = useState(() => getCurrentPage(ssrUrl));
  const [showPreloader, setShowPreloader] = useState(() => typeof window !== "undefined" && !ssrUrl);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lenisRef = useLenisRef();
  const lastHandledLocationRef = useRef(typeof window !== "undefined" ? window.location.href : (ssrUrl || "/"));
  const backToTopVisibleRef = useRef(false);
  const CurrentPage = pages[pageId]?.component || PageNotFoundPage;

  useEffect(() => {
    if (typeof document !== "undefined") {
      const pathname = window.location.pathname.replace(/\/$/, "") || "/";
      const seo = seoRoutes[pathname] || (pageId === "home" ? seoRoutes["/"] : null);
      const title =
        seo?.title ||
        (pageId === "home"
          ? "ClinGene | Pioneer in Life Sciences & Genetic Testing in Pakistan"
          : `${pages[pageId]?.label || "ClinGene"} | ClinGene`);
      if (title && pageId !== "service-detail") {
        document.title = title;
      }

      // Update meta description
      if (seo?.description) {
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute("content", seo.description);
      }

      // Update canonical
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute("href", seo?.canonical || `https://www.clingene.co${pathname === "/" ? "" : pathname}`);
      }

      // Update robots for 404
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.setAttribute("content", pageId === "not-found" ? "noindex, follow" : "index, follow");
      }
    }
  }, [pageId]);

  useEffect(() => {
    const updatePage = () => {
      const currentLocation = window.location.href;
      if (lastHandledLocationRef.current === currentLocation) return;
      lastHandledLocationRef.current = currentLocation;

      const page = getCurrentPage();
      setPageId(page);

      const hash = window.location.hash.slice(1);
      const target = hash && getHashTarget(hash);
      if (target) {
        lenisRef.current?.scrollTo(target, {
          duration: 0.75,
          easing: (time) => 1 - Math.pow(1 - time, 4),
          offset: -8,
        });
      }
    };

    const handleAnchorClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external or protocol links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // In-page anchor target (e.g. #contact)
      if (href.startsWith("#")) {
        const hash = href.slice(1);
        const target = getHashTarget(hash);
        if (target) {
          event.preventDefault();
          lastHandledLocationRef.current = window.location.href;
          lenisRef.current?.scrollTo(target, {
            duration: 0.8,
            easing: (time) => 1 - Math.pow(1 - time, 4),
            offset: -84, // Offsets for the sticky header height
          });
        }
        return;
      }

      // Check if it's a page route (handles "/", "#home", "/about", "/services/<slug>", "/contact?service=...", etc.)
      const [pathAndHash, queryPart] = href.split("?");
      const [pathPart] = pathAndHash.split("#");
      const normalized = pathPart.replace(/^\/|#/, "").replace(/\/$/, "");
      const isHomeTarget = href === "/" || href === "#home" || normalized === "" || normalized === "home";
      
      let targetPage = null;
      let targetPath = "/";

      if (isHomeTarget) {
        targetPage = "home";
        targetPath = "/";
      } else if (normalized.startsWith("services/")) {
        targetPage = "service-detail";
        targetPath = `/${normalized}`;
      } else if (pages[normalized]) {
        targetPage = normalized;
        targetPath = `/${normalized}`;
      }

      if (targetPage) {
        event.preventDefault();
        const fullTargetUrl = queryPart ? `${targetPath}?${queryPart}` : targetPath;
        const currentCleanPath = window.location.pathname.replace(/^\/|\/$/g, "");
        const targetCleanPath = targetPath.replace(/^\/|\/$/g, "");
        const isSamePage = currentCleanPath === targetCleanPath && window.location.search === (queryPart ? `?${queryPart}` : "");

        if (!isSamePage || window.location.hash) {
          window.history.pushState(null, "", fullTargetUrl);
        }
        lastHandledLocationRef.current = window.location.href;

        if (isSamePage) {
          lenisRef.current?.scrollTo(0, {
            duration: 0.7,
            easing: (time) => 1 - Math.pow(1 - time, 4),
          });
        } else {
          setPageId(targetPage);
          if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
        }
        return;
      }
    };

    window.addEventListener("hashchange", updatePage);
    window.addEventListener("popstate", updatePage);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      window.removeEventListener("hashchange", updatePage);
      window.removeEventListener("popstate", updatePage);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [lenisRef, pageId]);

  useEffect(() => {
    if (pageId !== getCurrentPage()) return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pageId, lenisRef]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPreloader(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateScrollPosition = () => {
      const isVisible = window.scrollY > 320;
      if (isVisible === backToTopVisibleRef.current) return;
      backToTopVisibleRef.current = isVisible;
      setShowBackToTop(isVisible);
    };
    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, []);

  return (
    <>
      {showPreloader && pageId !== "not-found" && <LoadingScreen />}
      {pageId !== "not-found" && <HeaderNav activePage={pages[pageId].label} />}
      <main>
        <SectionScrollEffects key={pageId} />
        <Suspense fallback={<LoadingScreen />}>
          <CurrentPage
            key={typeof window !== "undefined" ? window.location.pathname : (ssrUrl || "/")}
            ssrUrl={ssrUrl}
          />
        </Suspense>
      </main>
      {pageId !== "not-found" && (
        <>
          <SiteFooter
            compact={pageId === "ceo-message"}
            showJoinCta={pageId === "home"}
          />
          {/* ── Floating Action Buttons (Theme Switcher on bottom-left, WhatsApp & Scroll on bottom-right) ── */}
          <div
            className="fixed bottom-3.5 left-3.5 sm:bottom-6 sm:left-6 z-50 pointer-events-none"
            aria-label="Theme switcher"
          >
            <div className="pointer-events-auto">
              <ThemeSwitcher placement="bottom-left" />
            </div>
          </div>

          <div
            className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-none"
            aria-label="Quick actions"
          >
            {/* WhatsApp floating button */}
            <a
              href="https://wa.me/923485607051"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with ClinGene on WhatsApp"
              title="Chat with us on WhatsApp"
              className="group pointer-events-auto grid h-[46px] w-[46px] sm:h-12 sm:w-12 place-items-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: "#25D366",
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 3px rgba(37, 211, 102, 0.35), 0 4px 18px rgba(37, 211, 102, 0.5)",
              }}
            >
              <svg aria-hidden="true" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.9C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.12 10.45C10.25 10.31 10.29 10.2 10.37 10.05C10.45 9.9 10.41 9.76 10.35 9.64C10.3 9.5 9.8 8.32 9.6 7.82C9.4 7.34 9.2 7.4 9.05 7.39C8.91 7.38 8.74 7.33 8.53 7.33Z" />
              </svg>
            </a>

            {/* Back to top button */}
            <button
              aria-label="Scroll to top"
              tabIndex={showBackToTop ? 0 : -1}
              onClick={() => {
                if (lenisRef.current) {
                  lenisRef.current.scrollTo(0, {
                    duration: 0.7,
                    easing: (time) => 1 - Math.pow(1 - time, 4),
                  });
                } else window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group pointer-events-auto grid h-[46px] w-[46px] sm:h-12 sm:w-12 place-items-center rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                pointerEvents:   showBackToTop ? "auto" : "none",
                backgroundColor: "var(--accent-btn-bg, var(--accent))",
                color:           "#ffffff",
                border:          "2px solid #ffffff",
                boxShadow:       "0 0 0 3px var(--accent-glow), 0 4px 18px var(--accent-glow)",
                opacity:         showBackToTop ? 1 : 0,
                transform:       showBackToTop ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 0.3s ease, transform 0.3s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              <svg aria-hidden="true" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 19V5m-7 7 7-7 7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function App({ ssrUrl }) {
  return (
    <ThemeProvider>
      <LenisProvider>
        <ScrollEnhancements />
        <AppContent ssrUrl={ssrUrl} />
      </LenisProvider>
    </ThemeProvider>
  );
}
