import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AdminThemeProvider } from "./context/AdminThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
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
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/admin"
  );

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
  const normalized = currentPath.replace(/\/$/, "") || "/admin";

  // If user is NOT authenticated:
  if (!isAuthenticated) {
    if (normalized !== "/admin/login") {
      // Redirect to /admin/login
      if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
        window.history.replaceState(null, "", "/admin/login");
      }
    }
    return <LoginPage onNavigate={navigate} />;
  }

  // If user IS authenticated and tries to visit /admin/login -> redirect to /admin
  if (normalized === "/admin/login") {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/admin");
    }
    return (
      <AdminLayout currentPath="/admin" onNavigate={navigate}>
        <DashboardPage onNavigate={navigate} />
      </AdminLayout>
    );
  }

  // Match Authenticated Routes
  let pageContent = null;
  if (normalized === "/admin") {
    pageContent = <DashboardPage onNavigate={navigate} />;
  } else if (normalized === "/admin/team" || normalized === "/admin/doctor") {
    pageContent = <TeamPage />;
  } else if (normalized === "/admin/services") {
    pageContent = <ServicesPage />;
  } else if (normalized === "/admin/research") {
    pageContent = <ResearchPage />;
  } else if (normalized === "/admin/career" || normalized === "/admin/jobs") {
    pageContent = <CareerPage />;
  } else if (normalized === "/admin/gallery" || normalized === "/admin/notice") {
    pageContent = <GalleryPage />;
  } else if (
    normalized === "/admin/news" ||
    normalized === "/admin/blog" ||
    normalized === "/admin/mail"
  ) {
    pageContent = <BlogPage />;
  } else if (normalized === "/admin/profile" || normalized === "/admin/settings") {
    pageContent = <ProfilePage />;
  } else {
    // Fallback unknown /admin/* route -> redirect to /admin
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
