import { renderToString } from "react-dom/server";
import App from "./App.jsx";
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
import BlogPage from "./pages/BlogPage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";

const ssrPages = {
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
  blogs: { label: "Blog", component: BlogPage },
  blog: { label: "Blog", component: BlogPage },
  resources: { label: "Blog", component: BlogPage },
  contact: { label: "Contact", component: ContactPage },
  "not-found": { label: "Page Not Found", component: PageNotFoundPage },
};

export function render(url = "/") {
  const html = renderToString(<App ssrUrl={url} ssrPages={ssrPages} />);
  return { html };
}
