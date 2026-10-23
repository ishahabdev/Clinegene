import { lazy, Suspense, useEffect, useState } from "react";
import HeaderNav from "./components/HeaderNav.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";
import Button from "./components/Button.jsx";

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
        className="preloader-logo h-28 w-80 max-w-[85vw] object-contain sm:h-36 sm:w-md lg:h-44 lg:w-xl"
        src="/images/clingene-logo.webp"
      />
      <span className="sr-only">Loading ClinGene</span>
    </div>
  );
}

function getCurrentPage() {
  const hash = window.location.hash.slice(1);
  return pages[hash] ? hash : "home";
}

export default function App() {
  const [pageId, setPageId] = useState(getCurrentPage);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const CurrentPage = pages[pageId].component;

  useEffect(() => {
    const updatePage = () => setPageId(getCurrentPage());
    window.addEventListener("hashchange", updatePage);
    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPreloader(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateScrollPosition = () => setShowBackToTop(window.scrollY > 320);
    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, []);

  return (
    <>
      {showPreloader && <LoadingScreen />}
      <HeaderNav activePage={pages[pageId].label} />
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <CurrentPage />
        </Suspense>
      </main>
      <SiteFooter
        compact={pageId === "ceo-message"}
        showJoinCta={pageId === "home"}
      />
      <Button
        variant="cyan"
        aria-label="Scroll to top"
        className={`!fixed bottom-6 right-6 z-40 !h-12 !min-h-12 !w-12 !rounded-full !p-0 !text-[#031b37] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#079bb0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10c8e0] ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 19V5m-7 7 7-7 7 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </Button>
    </>
  );
}
