import { lazy, Suspense, useEffect, useState } from "react";
import HeaderNav from "./components/HeaderNav.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";

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

function getCurrentPage() {
  const hash = window.location.hash.slice(1);
  return pages[hash] ? hash : "home";
}

export default function App() {
  const [pageId, setPageId] = useState(getCurrentPage);
  const CurrentPage = pages[pageId].component;

  useEffect(() => {
    const updatePage = () => setPageId(getCurrentPage());
    window.addEventListener("hashchange", updatePage);
    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  return (
    <>
      <HeaderNav activePage={pages[pageId].label} />
      <main>
        <Suspense fallback={null}>
          <CurrentPage />
        </Suspense>
      </main>
      <SiteFooter
        compact={pageId === "ceo-message"}
        showJoinCta={pageId === "home"}
      />
    </>
  );
}
