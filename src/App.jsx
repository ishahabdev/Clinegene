import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeaderNav from "./components/HeaderNav.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import Button from "./components/Button.jsx";
import LenisProvider, { useLenisRef } from "./components/LenisProvider.jsx";
import SectionScrollEffects from "./components/SectionScrollEffects.jsx";
import ScrollEnhancements from "./components/ScrollEnhancements.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const CEOMessagePage = lazy(() => import("./pages/CEOMessagePage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.jsx"));
const OpenPositionsPage = lazy(() => import("./pages/OpenPositionsPage.jsx"));
const ResearchPage = lazy(() => import("./pages/ResearchPage.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const TeamPage = lazy(() => import("./pages/TeamPage.jsx"));

const pages = {
  home: { label: "Home", component: HomePage },
  "ceo-message": { label: "CEO Message", component: CEOMessagePage },
  about: { label: "About", component: AboutPage },
  team: { label: "Team", component: TeamPage },
  services: { label: "Services", component: ServicesPage },
  research: { label: "Research", component: ResearchPage },
  gallery: { label: "Gallery", component: GalleryPage },
  "open-positions": { label: "Open Positions", component: OpenPositionsPage },
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

function getCurrentPage() {
  const hash = window.location.hash.slice(1);
  if (pages[hash]) return hash;
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (pathname !== "/" && pathname !== "/index.html") return "not-found";
  if (!hash) return "home";
  return "not-found";
}

function getHashTarget(hash) {
  try {
    return document.getElementById(decodeURIComponent(hash));
  } catch {
    return null;
  }
}

function AppContent() {
  const [pageId, setPageId] = useState(getCurrentPage);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lenisRef = useLenisRef();
  const lastHandledLocationRef = useRef(window.location.href);
  const backToTopVisibleRef = useRef(false);
  const CurrentPage = pages[pageId].component;

  useEffect(() => {
    const updatePage = () => {
      const currentLocation = window.location.href;
      if (lastHandledLocationRef.current === currentLocation) return;
      lastHandledLocationRef.current = currentLocation;

      const hash = window.location.hash.slice(1);
      if (pages[hash]) {
        setPageId(hash);
        return;
      }

      const target = hash && getHashTarget(hash);
      if (target) {
        lenisRef.current?.scrollTo(target, {
          duration: 0.75,
          easing: (time) => 1 - Math.pow(1 - time, 4),
          offset: -8,
        });
        return;
      }

      setPageId(getCurrentPage());
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
      const anchor = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href")?.slice(1);
      if (!hash) return;

      if (pages[hash]) {
        event.preventDefault();
        const route = `#${encodeURIComponent(hash)}`;
        const alreadyOnRoute = getCurrentPage() === hash;
        if (window.location.hash !== route) {
          window.history.pushState(null, "", route);
        }
        lastHandledLocationRef.current = window.location.href;

        if (alreadyOnRoute) {
          lenisRef.current?.scrollTo(0, {
            duration: 0.7,
            easing: (time) => 1 - Math.pow(1 - time, 4),
          });
        } else {
          setPageId(hash);
        }
        return;
      }

      const target = getHashTarget(hash);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", `#${encodeURIComponent(hash)}`);
      lastHandledLocationRef.current = window.location.href;
      lenisRef.current?.scrollTo(target, {
        duration: 0.75,
        easing: (time) => 1 - Math.pow(1 - time, 4),
        offset: -8,
      });
    };

    window.addEventListener("hashchange", updatePage);
    window.addEventListener("popstate", updatePage);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      window.removeEventListener("hashchange", updatePage);
      window.removeEventListener("popstate", updatePage);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [lenisRef]);

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
          <CurrentPage />
        </Suspense>
      </main>
      {pageId !== "not-found" && (
        <>
          <SiteFooter
            compact={pageId === "ceo-message"}
            showJoinCta={pageId === "home"}
          />
          {/* ── Back to top — fully theme-driven ── */}
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
            style={{
              position:        "fixed",
              bottom:          "24px",
              right:           "24px",
              zIndex:          40,
              height:          "48px",
              width:           "48px",
              borderRadius:    "50%",
              border:          "none",
              cursor:          "pointer",
              display:         "grid",
              placeItems:      "center",
              /* Theme-driven fill & icon color */
              backgroundColor: "var(--accent-btn-bg, var(--accent))",
              color:           "var(--accent-btn-text, #04152b)",
              /* Theme-driven outer glow ring */
              boxShadow:       "0 0 0 3px var(--accent-glow), 0 4px 18px var(--accent-glow)",
              /* Visibility */
              opacity:         showBackToTop ? 1 : 0,
              pointerEvents:   showBackToTop ? "auto" : "none",
              transform:       showBackToTop ? "translateY(0)" : "translateY(10px)",
              /* Smooth transitions for everything */
              transition:
                "background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = showBackToTop ? "translateY(-4px)" : "translateY(10px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = showBackToTop ? "translateY(0)"   : "translateY(10px)")}
          >
            <svg aria-hidden="true" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 19V5m-7 7 7-7 7 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
            </svg>
          </button>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <ScrollEnhancements />
        <AppContent />
      </LenisProvider>
    </ThemeProvider>
  );
}
