import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Mail,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Dna,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAdminTheme } from "../context/AdminThemeContext.jsx";
import { ADMIN_USER } from "../mocks/mockData.js";
import { ADMIN_BASE, adminPath } from "../adminConfig.js";
import { getUnreadCount } from "../api/messages.js";

export default function AdminTopbar({ onOpenMobileSidebar, onNavigate }) {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useAdminTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      const { count } = await getUnreadCount();
      if (mounted && typeof count === "number") {
        setUnreadCount(count);
      }
    };

    loadCount();

    const handleMessagesUpdated = () => {
      loadCount();
    };

    window.addEventListener("messages:updated", handleMessagesUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("messages:updated", handleMessagesUpdated);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adminDisplayName =
    user?.user_metadata?.fullName ||
    user?.user_metadata?.name ||
    ADMIN_USER.fullName;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between px-4 sm:px-6 transition-colors duration-200 bg-white border-b border-slate-200 text-slate-800 shadow-xs dark:bg-[#0c131d] dark:border-[#172334] dark:text-white">
      {/* Left: Brand + Hamburger */}
      <div className="flex items-center gap-3">
        <a
          href={ADMIN_BASE || "#"}
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate(ADMIN_BASE);
          }}
          className="flex items-center gap-2.5 select-none group"
        >
          {/* ClinGene DNA Emblem */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#0da5aa] group-hover:scale-105 transition-transform">
            <Dna className="h-5 w-5" />
          </div>
          <span className="font-outfit text-sm sm:text-base font-bold tracking-wider text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-300 transition-colors">
            HEALTH ADMIN
          </span>
        </a>

        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden ml-1 p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right: Theme Toggle, Notifications, Mail & User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Sun & Moon Theme Toggle Icon */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
          title={isDark ? "Switch to light mode (White theme)" : "Switch to dark mode (Black theme)"}
        >
          {isDark ? (
            <Sun className="h-4.5 w-4.5 text-amber-400 animate-in fade-in" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-slate-600 animate-in fade-in" />
          )}
        </button>

        {/* Notification Bell with Red Indicator Dot */}
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate(adminPath("/messages"));
          }}
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0c131d]" />
          </span>
        </button>

        {/* Mail Envelope with Unread Badge */}
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate(adminPath("/messages"));
          }}
          aria-label="Messages"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
          title={unreadCount > 0 ? `Unread Messages (${unreadCount})` : "Messages"}
        >
          <Mail className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar Menu */}
        <div className="relative ml-1 sm:ml-2" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="User profile menu"
            className="flex items-center gap-1.5 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-[#0da5aa]/40 cursor-pointer"
          >
            <div className="relative">
              <img
                src={ADMIN_USER.avatar}
                alt={adminDisplayName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                }}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0c131d]" />
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white border-slate-200 p-2 shadow-xl text-slate-800 dark:bg-[#0f1726] dark:border-[#1e2a3c] dark:text-slate-200 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {adminDisplayName}
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 truncate">
                  {user?.email || ADMIN_USER.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigate) onNavigate(adminPath("/profile"));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigate) onNavigate(adminPath("/profile"));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
