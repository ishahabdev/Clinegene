import { useEffect, useState } from "react";
import HeaderNav from "./components/HeaderNav.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CEOMessagePage from "./pages/CEOMessagePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import OpenPositionsPage from "./pages/OpenPositionsPage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";

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
        <CurrentPage />
      </main>
    </>
  );
}
