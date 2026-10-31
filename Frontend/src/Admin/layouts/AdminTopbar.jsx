import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Mail,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_USER } from "../mocks/mockData.js";

export default function AdminTopbar({ onOpenMobileSidebar, onNavigate }) {
  const { logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#16222f] px-4 text-white shadow-sm border-b border-slate-800">
      {/* Left: Brand + Hamburger */}
      <div className="flex items-center gap-4">
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate("/admin");
          }}
          className="font-outfit text-base sm:text-lg font-bold tracking-wider text-white hover:text-teal-300 transition-colors flex items-center gap-2 select-none"
        >
          <span>HEALTH ADMIN</span>
        </a>

        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Toggle navigation menu"
          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right: Email Icon & User Avatar */}
      <div className="flex items-center gap-2">
        {/* Email Envelope Badge (5) */}
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate("/admin/news");
          }}
          aria-label="Mail"
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors focus:outline-none"
          title="Unread Emails (5)"
        >
          <Mail className="h-4.5 w-4.5" />
          <span className="absolute top-1 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            5
          </span>
        </button>

        {/* User Avatar Menu */}
        <div className="relative ml-2" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="User profile menu"
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <img
              src={ADMIN_USER.avatar}
              alt={ADMIN_USER.fullName}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-teal-500/40"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
              }}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-[#16222f] p-2 shadow-2xl text-slate-200 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-700/80">
                <p className="text-xs font-bold text-white">{ADMIN_USER.fullName}</p>
                <p className="text-[11px] text-teal-400">{ADMIN_USER.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigate) onNavigate("/admin/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-teal-300 rounded-lg transition-colors text-left"
                >
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigate) onNavigate("/admin/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-teal-300 rounded-lg transition-colors text-left"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
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
