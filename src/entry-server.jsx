import { renderToString } from "react-dom/server";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CEOMessagePage from "./pages/CEOMessagePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import OpenPositionsPage from "./pages/OpenPositionsPage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import HeaderNav from "./components/HeaderNav.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const serverPages = {
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

export function render(url = "/") {
  const clean = url.replace(/^\/|\/$/g, "");
  let pageId = "home";

  if (clean === "" || clean === "index.html") {
    pageId = "home";
  } else if (clean.startsWith("services/")) {
    pageId = "service-detail";
  } else if (clean === "careers" || clean === "open-positions") {
    pageId = "careers";
  } else if (serverPages[clean]) {
    pageId = clean;
  } else if (clean === "404") {
    pageId = "not-found";
  } else {
    pageId = "not-found";
  }

  const PageComponent = serverPages[pageId].component;
  const activeLabel = serverPages[pageId].label;

  const html = renderToString(
    <ThemeProvider>
      {pageId !== "not-found" && <HeaderNav activePage={activeLabel} />}
      <main id="main-content">
        <PageComponent ssrUrl={url} />
      </main>
      {pageId !== "not-found" && (
        <>
          <SiteFooter
            compact={pageId === "ceo-message"}
            showJoinCta={pageId === "home"}
          />
          <div
            className="fixed bottom-6 left-6 z-50 pointer-events-none"
            aria-label="Theme switcher"
          >
            <div className="pointer-events-auto">
              <ThemeSwitcher placement="bottom-left" />
            </div>
          </div>
        </>
      )}
    </ThemeProvider>
  );

  return { html };
}

