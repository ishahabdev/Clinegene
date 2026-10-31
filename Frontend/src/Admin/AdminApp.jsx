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

  // Requirement 1: While session and admins check is in progress, show loading screen.
  // The dashboard must NEVER render, even for a moment, before this check completes.
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#16222f] p-4 font-inter text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-700 border-t-[#009688]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Verifying Authorization...
          </span>
        </div>
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
    normalized === adminPath("/news") ||
    normalized === adminPath("/blog") ||
    normalized === adminPath("/mail")
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
      {pageContent}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminThemeProvider>
          <ToastProvider>
            <AdminRoutes />
          </ToastProvider>
        </AdminThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
