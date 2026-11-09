import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Button from "./components/Button.jsx";
import LenisProvider, { useLenisRef } from "./components/LenisProvider.jsx";
import ScrollEnhancements from "./components/ScrollEnhancements.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PageSkeleton from "./components/PageSkeleton.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { seoRoutes } from "./data/seoData.js";
import { ADMIN_BASE } from "./Admin/adminConfig.js";

const cleanAdminBase = ADMIN_BASE ? ADMIN_BASE.replace(/^\/|\/$/g, "").toLowerCase() : "";

export function isAdminPath(urlPath = "") {
  if (!urlPath || typeof urlPath !== "string") return false;
  const clean = urlPath.replace(/^\/|\/$/g, "").toLowerCase();
  const configuredBase = (cleanAdminBase || "opclin-23410").toLowerCase();
  return (
    clean === "admin" ||
    clean.startsWith("admin/") ||
    clean.includes("/admin") ||
    clean === configuredBase ||
    clean.startsWith(`${configuredBase}/`) ||
    clean.includes("opclin-23410")
  );
}

const AdminApp = lazy(() => import("./Admin/AdminApp.jsx"));

const clientPages = {
  home: { label: "Home", component: lazy(() => import("./pages/HomePage.jsx")) },
  "ceo-message": { label: "CEO Message", component: lazy(() => import("./pages/CEOMessagePage.jsx")) },
  about: { label: "About", component: lazy(() => import("./pages/AboutPage.jsx")) },
  team: { label: "Team", component: lazy(() => import("./pages/TeamPage.jsx")) },
  services: { label: "Services", component: lazy(() => import("./pages/ServicesPage.jsx")) },
  "service-detail": { label: "Services", component: lazy(() => import("./pages/ServiceDetailPage.jsx")) },
  research: { label: "Research", component: lazy(() => import("./pages/ResearchPage.jsx")) },
  gallery: { label: "Gallery", component: lazy(() => import("./pages/GalleryPage.jsx")) },
  careers: { label: "Careers", component: lazy(() => import("./pages/OpenPositionsPage.jsx")) },
  "open-positions": { label: "Careers", component: lazy(() => import("./pages/OpenPositionsPage.jsx")) },
  news: { label: "News", component: lazy(() => import("./pages/NewsPage.jsx")) },
  blogs: { label: "Blog", component: lazy(() => import("./pages/BlogPage.jsx")) },
  blog: { label: "Blog", component: lazy(() => import("./pages/BlogPage.jsx")) },
  resources: { label: "Blog", component: lazy(() => import("./pages/BlogPage.jsx")) },
  contact: { label: "Contact", component: lazy(() => import("./pages/ContactPage.jsx")) },
  "not-found": { label: "Page Not Found", component: lazy(() => import("./pages/PageNotFoundPage.jsx")) },
};

function AdminLoadingFallback() {
  return (
    <div
      aria-label="Loading ClinGene"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
    >
      <img
        alt="ClinGene"
        width="733"
        height="290"
        className="preloader-logo h-28 w-80 max-w-[85vw] object-contain sm:h-36 sm:w-md lg:h-44 lg:w-xl"
        src="/images/clingene-logo.webp"
      />
      <span className="sr-only">Loading ClinGene</span>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      aria-label="Loading ClinGene"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
    >
      <img
        alt="ClinGene"
        width="733"
        height="290"
        className="preloader-logo h-28 w-80 max-w-[85vw] object-contain sm:h-36 sm:w-md lg:h-44 lg:w-xl"
        src="/images/clingene-logo.webp"
      />
      <span className="sr-only">Loading ClinGene</span>
    </div>
  );
}

function getCurrentPage(ssrUrl, activePages = clientPages) {
  if (typeof window === "undefined") {
    if (!ssrUrl) return "home";
    if (isAdminPath(ssrUrl)) return "admin";
    const clean = ssrUrl.replace(/^\/|\/$/g, "");
    if (clean === "" || clean === "index.html") return "home";
    if (clean.startsWith("services/")) return "service-detail";
    if (clean === "careers" || clean === "open-positions") return "careers";
    if (clean === "blogs" || clean === "blog" || clean === "resources") return "blogs";
    if (activePages[clean]) return clean;
    return "not-found";
  }

  const hash = window.location.hash.slice(1);
  const pathname = window.location.pathname.replace(/^\/|\/$/g, "");

  // Priority 1: Check admin path first before any other route!
  if (isAdminPath(window.location.pathname) || isAdminPath(window.location.hash)) {
    return "admin";
  }

  // If user landed with #home or an old URL like /services#home, normalize immediately to "/"
  if (hash === "home") {
    if (window.location.pathname !== "/" || window.location.hash) {
      window.history.replaceState(null, "", "/");
    }
    return "home";
  }

  // If hash has services/<slug>
  if (hash.startsWith("services/")) {
    let slug = hash.slice("services/".length);
    if (slug === "genetic-counselling") slug = "genetic-counseling";
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
  if (activePages[hash]) {
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
    if (pathname === "services/genetic-counselling") {
      window.history.replaceState(null, "", "/services/genetic-counseling");
    }
    return "service-detail";
  }

  if (pathname === "careers" || pathname === "open-positions") {
    return "careers";
  }

  if (pathname === "blogs" || pathname === "blog" || pathname === "resources") {
    return "blogs";
  }

  // If pathname matches a registered page (e.g. /about, /services, /team, /contact):
  if (activePages[pathname]) {
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

function AppContent({ ssrUrl, ssrPages }) {
  const activePages = ssrPages || clientPages;
  const [pageId, setPageId] = useState(() => getCurrentPage(ssrUrl, activePages));
  const [showPreloader, setShowPreloader] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lenisRef = useLenisRef();
  const lastHandledLocationRef = useRef(typeof window !== "undefined" ? window.location.href : (ssrUrl || "/"));
  const backToTopVisibleRef = useRef(false);
  const isCurrentAdmin =
    pageId === "admin" ||
    (typeof window !== "undefined" && (isAdminPath(window.location.pathname) || isAdminPath(window.location.hash))) ||
    isAdminPath(ssrUrl);

  const CurrentPage = isCurrentAdmin
    ? AdminApp
    : (activePages[pageId]?.component || activePages["not-found"]?.component);

  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    if (pageId === "admin") {
      lenis.stop();
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("lenis", "lenis-smooth");
      }
    } else {
      lenis.start();
    }
  }, [pageId, lenisRef]);

  useEffect(() => {
    if (pageId === "admin") return;
    if (typeof document !== "undefined") {
      const pathname = window.location.pathname.replace(/\/$/, "") || "/";
      const seo = seoRoutes[pathname] || (pageId === "home" ? seoRoutes["/"] : null);
      const title =
        seo?.title ||
        (pageId === "home"
          ? "ClinGene | Clinical Genetic Testing Laboratory"
          : `${activePages[pageId]?.label || "ClinGene"} - ClinGene`);
      if (title && pageId !== "service-detail") {
        document.title = title;
      }

      // Update meta description
      if (seo?.description) {
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute("content", seo.description);
      }

      // Update og:site_name to ClinGene
      const siteNameMeta = document.querySelector('meta[property="og:site_name"]');
      if (siteNameMeta) siteNameMeta.setAttribute("content", "ClinGene");

      // Update og:title & twitter:title
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta && title) ogTitleMeta.setAttribute("content", title);
      const twTitleMeta = document.querySelector('meta[name="twitter:title"]');
      if (twTitleMeta && title) twTitleMeta.setAttribute("content", title);

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
      
      // Admin routes handled directly by AdminApp
      if (isAdminPath(href) || isAdminPath(normalized)) {
        event.preventDefault();
        window.history.pushState(null, "", href);
        setPageId("admin");
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }

      let targetPage = null;
      let targetPath = "/";

      if (isHomeTarget) {
        targetPage = "home";
        targetPath = "/";
      } else if (normalized.startsWith("services/")) {
        targetPage = "service-detail";
        targetPath = `/${normalized}`;
      } else if (activePages[normalized]) {
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
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, []);

  // Isolate Admin portal completely from public shell - No public Header or Footer
  if (isCurrentAdmin) {
    return (
      <main id="admin-root" className="min-h-screen w-full bg-[#070c14] text-slate-100">
        <Suspense fallback={<AdminLoadingFallback />}>
          <CurrentPage />
        </Suspense>
      </main>
    );
  }

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 0.7,
        easing: (time) => 1 - Math.pow(1 - time, 4),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <PublicLayout
      activePage={activePages[pageId]?.label || "Home"}
      pageId={pageId}
      showPreloader={showPreloader}
      showBackToTop={showBackToTop}
      onScrollToTop={handleScrollToTop}
      LoadingScreenComponent={LoadingScreen}
    >
      <Suspense fallback={<PageSkeleton />}>
        <CurrentPage
          key={typeof window !== "undefined" ? window.location.pathname : (ssrUrl || "/")}
          ssrUrl={ssrUrl}
        />
      </Suspense>
    </PublicLayout>
  );
}

export default function App({ ssrUrl, ssrPages }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LenisProvider>
          <ScrollEnhancements />
          <AppContent ssrUrl={ssrUrl} ssrPages={ssrPages} />
        </LenisProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
