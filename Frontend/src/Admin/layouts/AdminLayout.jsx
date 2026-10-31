import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import SessionTimeoutModal from "../components/SessionTimeoutModal.jsx";

export default function AdminLayout({
  currentPath = "/admin",
  onNavigate,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Enforce noindex, nofollow and isolate native mouse wheel scroll from Lenis
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    const previousContent = robotsMeta.getAttribute("content");
    robotsMeta.setAttribute("content", "noindex, nofollow");

    document.title = "Health Admin Portal";

    // Guarantee documentElement doesn't have Lenis locks
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    }

    return () => {
      if (previousContent) {
        robotsMeta.setAttribute("content", previousContent);
      }
    };
  }, [currentPath]);

  return (
    <div
      data-lenis-prevent="true"
      className="flex h-screen w-screen flex-col overflow-hidden bg-[#f4f7f6] font-inter text-slate-800"
    >
      {/* Top Navbar spans full width */}
      <AdminTopbar
        onOpenMobileSidebar={() => setMobileOpen(true)}
        onNavigate={onNavigate}
      />

      {/* Main Body: Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          currentPath={currentPath}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onNavigate={onNavigate}
        />

        {/* Content Area - Scrollable with native mouse wheel */}
        <main
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-7 select-text"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>

      {/* Inactivity warning modal */}
      <SessionTimeoutModal />
    </div>
  );
}
