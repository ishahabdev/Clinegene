import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ADMIN_BASE, adminPath } from "./adminConfig.js";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AdminThemeProvider } from "./context/AdminThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import AdminErrorBoundary from "./components/AdminErrorBoundary.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const dashboardPath = adminPath("");
  const loginPath = adminPath("/login");
  const resetPath = adminPath("/reset");

  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : dashboardPath
  );

  // Requirement: Ensure <meta name="robots" content="noindex, nofollow"> on admin pages, removed on unmount
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
      created = true;
    }
    const previousContent = robotsMeta.getAttribute("content");
    robotsMeta.setAttribute("content", "noindex, nofollow");

    return () => {
      if (created) {
        robotsMeta.remove();
      } else if (previousContent) {
        robotsMeta.setAttribute("content", previousContent);
      } else {
        robotsMeta.removeAttribute("content");
      }
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to) => {
    if (window.location.pathname !== to) {
      window.history.pushState(null, "", to);
    }
    setCurrentPath(to);
    window.scrollTo(0, 0);
  };

  // Normalize path
  const normalized = currentPath.replace(/\/$/, "") || dashboardPath;

  // Requirement 1: Password Recovery route does not require active session
  if (normalized === resetPath) {
    return <ResetPasswordPage onNavigate={navigate} />;
  }

  // While session and admins check is in progress, show ClinGene loading logo screen like other pages.
  // The dashboard must NEVER render, even for a moment, before this check completes.
  if (loading) {
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

  // Requirement 1: If user is NOT authenticated (no valid session or not listed in `admins` table), show login form
  if (!isAuthenticated) {
    if (normalized !== loginPath) {
      if (typeof window !== "undefined" && window.location.pathname !== loginPath) {
        window.history.replaceState(null, "", loginPath);
      }
    }
    return <LoginPage onNavigate={navigate} />;
  }

  // If user IS authenticated and visits login -> redirect to dashboard
  if (normalized === loginPath) {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", dashboardPath);
    }
    return (
      <AdminLayout currentPath={dashboardPath} onNavigate={navigate}>
        <DashboardPage onNavigate={navigate} />
      </AdminLayout>
    );
  }

  // Match Protected Authenticated Routes
  let pageContent = null;
  if (normalized === dashboardPath) {
    pageContent = <DashboardPage onNavigate={navigate} />;
  } else if (normalized === adminPath("/team") || normalized === adminPath("/doctor")) {
    pageContent = <TeamPage />;
  } else if (normalized === adminPath("/services")) {
    pageContent = <ServicesPage />;
  } else if (normalized === adminPath("/research")) {
    pageContent = <ResearchPage />;
  } else if (normalized === adminPath("/career") || normalized === adminPath("/jobs")) {
    pageContent = <CareerPage />;
  } else if (normalized === adminPath("/gallery") || normalized === adminPath("/notice")) {
    pageContent = <GalleryPage />;
  } else if (
    normalized === adminPath("/messages") ||
    normalized === adminPath("/mail")
  ) {
    pageContent = <MessagesPage />;
  } else if (
    normalized === adminPath("/news") ||
    normalized === adminPath("/blog")
  ) {
    pageContent = <BlogPage />;
  } else if (normalized === adminPath("/profile") || normalized === adminPath("/settings")) {
    pageContent = <ProfilePage />;
  } else {
    // Fallback unknown admin route -> redirect to dashboard
    pageContent = <DashboardPage onNavigate={navigate} />;
  }

  return (
    <AdminLayout currentPath={normalized} onNavigate={navigate}>
      <AdminErrorBoundary onNavigate={navigate} key={normalized}>
        {pageContent}
      </AdminErrorBoundary>
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminThemeProvider>
            <ToastProvider>
              <AdminRoutes />
            </ToastProvider>
          </AdminThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AdminErrorBoundary>
  );
}
