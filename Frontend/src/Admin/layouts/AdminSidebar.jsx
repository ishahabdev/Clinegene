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
} from "lucide-react";
import { ADMIN_USER } from "../mocks/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_BASE, adminPath } from "../adminConfig.js";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: adminPath(""), icon: LayoutDashboard },
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
  const { logout } = useAuth();

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

  const navContent = (
    <div data-lenis-prevent="true" className="flex h-full flex-col justify-between bg-[#16222f] text-slate-300">
      <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Mobile close toggle */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="font-outfit text-sm font-bold tracking-wider text-white">
            HEALTH ADMIN
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Welcome Block (Teal gradient card) */}
        <div className="p-3">
          <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-[#00897b] to-[#00a884] p-3 shadow-md text-white select-none">
            <img
              src={ADMIN_USER.avatar}
              alt={ADMIN_USER.fullName}
              className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-white/70 shadow-xs"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-teal-100">Welcome</span>
              <span className="block truncate text-xs font-bold tracking-wide text-white uppercase">
                {ADMIN_USER.fullName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 pb-3 space-y-0.5" aria-label="Admin Navigation">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === ADMIN_BASE
                ? currentPath === ADMIN_BASE || currentPath === `${ADMIN_BASE}/`
                : currentPath.startsWith(item.path) ||
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
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs sm:text-[13px] font-medium transition-all select-none ${
                  isActive
                    ? "bg-slate-800/90 text-teal-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.label !== "Dashboard" && (
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive ? "text-teal-400" : "text-slate-500 opacity-60 group-hover:opacity-100"
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout Button Pinned at Bottom */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs sm:text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all select-none cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <LogOut className="h-4.5 w-4.5 shrink-0 text-rose-400 group-hover:text-rose-300 transition-colors" />
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
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-800/90 bg-[#16222f] transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
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
          <div className="relative flex w-64 max-w-[80vw] flex-1 flex-col bg-[#16222f] shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
