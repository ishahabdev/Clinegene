import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Microscope,
  Image as ImageIcon,
  Briefcase,
  Newspaper,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Mail,
} from "lucide-react";
import { ADMIN_USER } from "../mocks/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useAdminTheme } from "../context/AdminThemeContext.jsx";
import { ADMIN_BASE, adminPath } from "../adminConfig.js";
import { getUnreadCount } from "../api/messages.js";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: adminPath(""), icon: LayoutDashboard },
  { label: "Messages", path: adminPath("/messages"), icon: Mail },
  { label: "Team", path: adminPath("/team"), icon: Users },
  { label: "Services", path: adminPath("/services"), icon: Layers },
  { label: "Research", path: adminPath("/research"), icon: Microscope },
  { label: "Gallery", path: adminPath("/gallery"), icon: ImageIcon },
  { label: "Career", path: adminPath("/career"), icon: Briefcase },
  { label: "Blog & News", path: adminPath("/news"), icon: Newspaper },
  { label: "Profile Settings", path: adminPath("/profile"), icon: Settings },
];

export default function AdminSidebar({
  currentPath = ADMIN_BASE,
  collapsed,
  mobileOpen,
  setMobileOpen,
  onNavigate,
}) {
  const { user, logout } = useAuth();
  const { isDark } = useAdminTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      const { count } = await getUnreadCount();
      if (mounted && typeof count === "number") {
        setUnreadCount(count);
      }
    };
    loadCount();
    const handleUpdate = () => loadCount();
    window.addEventListener("messages:updated", handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("messages:updated", handleUpdate);
    };
  }, []);

  const handleNavClick = (path, e) => {
    e.preventDefault();
    if (onNavigate) onNavigate(path);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    if (setMobileOpen) setMobileOpen(false);
    logout();
    if (onNavigate) onNavigate(adminPath("/login"));
  };

  const adminDisplayName =
    user?.user_metadata?.fullName ||
    user?.user_metadata?.name ||
    ADMIN_USER.fullName;

  const navContent = (
    <div
      data-lenis-prevent="true"
      className="flex h-full flex-col justify-between transition-colors duration-200 bg-white dark:bg-[#0a101d] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-[#172334]"
    >
      <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Mobile close toggle */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <span className="font-outfit text-sm font-bold tracking-wider text-slate-900 dark:text-white">
            HEALTH ADMIN
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Welcome Block (Matches reference UI) */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 select-none">
            <div className="relative shrink-0">
              <img
                src={ADMIN_USER.avatar}
                alt={adminDisplayName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                }}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0a101d]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-400">
                Welcome
              </span>
              <span className="block truncate text-xs sm:text-[13px] font-bold text-slate-800 dark:text-white">
                {adminDisplayName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1" aria-label="Admin Navigation">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === ADMIN_BASE
                ? currentPath === ADMIN_BASE || currentPath === `${ADMIN_BASE}/`
                : currentPath.startsWith(item.path) ||
                  (item.path === adminPath("/messages") && currentPath.startsWith(adminPath("/mail"))) ||
                  (item.path === adminPath("/news") && currentPath.startsWith(adminPath("/blog"))) ||
                  (item.path === adminPath("/team") && currentPath.startsWith(adminPath("/doctor"))) ||
                  (item.path === adminPath("/profile") &&
                    (currentPath.startsWith(adminPath("/settings")) ||
                      currentPath.startsWith(adminPath("/profile"))));

            return (
              <a
                key={item.label}
                href={item.path}
                onClick={(e) => handleNavClick(item.path, e)}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] font-medium transition-all select-none cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-[#0da5aa] text-white font-semibold shadow-xs"
                      : "bg-[#e6f8f8] text-[#088395] font-semibold"
                    : isDark
                    ? "text-slate-400 hover:bg-[#121c2e]/60 hover:text-slate-100"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-[#088395]"
                        : isDark
                        ? "text-slate-400 group-hover:text-slate-200"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.label === "Messages" && unreadCount > 0 ? (
                  <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : (
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-[#088395]"
                        : "opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5"
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout Button Pinned at Bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] font-medium transition-all select-none cursor-pointer text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <LogOut className="h-4.5 w-4.5 shrink-0 transition-colors" />
            <span className="truncate font-semibold">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-64 max-w-[80vw] flex-1 flex-col shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
