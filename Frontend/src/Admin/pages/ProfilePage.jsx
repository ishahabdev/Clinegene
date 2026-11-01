import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Lock,
  Mail,
  ShieldCheck,
  Camera,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ADMIN_USER } from "../mocks/mockData.js";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../../lib/supabase.js";

const PROFILE_STORAGE_KEY = "clingene_admin_profile_data";

function loadInitialProfile() {
  if (typeof window === "undefined") return ADMIN_USER;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.fullName) {
        return { ...ADMIN_USER, ...parsed };
      }
    }
  } catch (e) {
    console.warn("Could not read stored profile", e);
  }
  return ADMIN_USER;
}

export default function ProfilePage() {
  const { addToast } = useToast() || { addToast: () => {} };
  const { user } = useAuth();
  const [profile, setProfile] = useState(loadInitialProfile);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Change Email state
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // File input ref for camera upload
  const fileInputRef = useRef(null);

  // Synchronize profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save profile to localStorage", e);
    }
  }, [profile]);

  // Handle avatar upload via camera button
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      if (addToast) {
        addToast({
          type: "error",
          title: "Invalid file",
          message: "Please choose a valid image file (JPEG, PNG, WEBP).",
        });
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfile((prev) => ({ ...prev, avatar: dataUrl }));
      if (addToast) {
        addToast({
          type: "success",
          title: "Photo Updated",
          message: "Profile avatar changed successfully.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Update Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (!supabase) {
      setPasswordError("Database client is not configured.");
      return;
    }

    const email = user?.email || profile.email;
    if (!email) {
      setPasswordError("No authenticated admin email found. Please sign in again.");
      return;
    }

    setPasswordLoading(true);

    try {
      // 1. Verify that an active session exists
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("[ProfilePage] Session verification failed:", sessionError);
        setPasswordError("Your session has expired. Please sign in again.");
        return;
      }

      // 2. Re-authenticate with entered current password to verify identity
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        });

      if (signInError) {
        console.error("[ProfilePage] Current password verification failed:", signInError);
        setPasswordError("Current password is incorrect.");
        return;
      }

      // 3. Update password in Supabase Auth
      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        setPasswordError(
          updateError.message || "Failed to update password. Please try again."
        );
        return;
      }

      // 4. Success: only set success state and clear inputs when update truly succeeded
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated successfully!");

      if (addToast) {
        addToast({
          type: "success",
          title: "Password Changed",
          message: "Your account password has been updated securely.",
        });
      }

      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      console.error("[ProfilePage] Unexpected error during password update:", err);
      setPasswordError(
        err.message || "An unexpected error occurred while updating password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Update Email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    const trimmed = newEmail.trim();
    if (!trimmed) {
      setEmailError("Please enter a new email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (trimmed.toLowerCase() === profile.email.toLowerCase()) {
      setEmailError("This email address is already in use.");
      return;
    }

    // Update profile with new email
    setProfile((prev) => ({ ...prev, email: trimmed }));
    setNewEmail("");
    setEmailSuccess(`Email updated to ${trimmed}`);

    if (addToast) {
      addToast({
        type: "success",
        title: "Email Updated",
        message: `Your account email has been updated to ${trimmed}.`,
      });
    }

    setTimeout(() => setEmailSuccess(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={Settings}
        title="Profile Settings"
        subtitle="Manage your profile and account settings"
        breadcrumb="Profile"
      />

      {/* Top Card: Profile Info (Full Name, Email & Status Box) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Avatar with Teal Ring & Camera overlay button */}
          <div className="relative shrink-0">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-teal-400 p-1 bg-teal-50/20">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                }}
              />
            </div>

            {/* Camera Button on bottom right */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#009688] text-white shadow-md hover:bg-[#008577] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Upload / Change profile photo"
              aria-label="Upload / Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Form Fields: Full Name & Email Address */}
          <div className="flex-1 w-full space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-[#0a101d] focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all"
                placeholder="Full Name"
              />
            </div>

            {/* Email Address with left Mail icon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] pl-11 pr-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-[#0a101d] focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all"
                  placeholder="Email Address"
                />
              </div>
            </div>
          </div>

          {/* Right Status Box: "Your profile is up to date" */}
          <div className="shrink-0 w-full lg:w-auto lg:min-w-[260px] self-center">
            <div className="rounded-2xl bg-[#f0fdfa]/80 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100/70 dark:bg-teal-900/40 text-[#0da5aa]">
                <ShieldCheck className="h-6 w-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                  Your profile is up to date
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last updated: Oct 24, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: 2 Columns (Change Password & Change Email Address) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= CARD 1: Change Password ================= */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#0da5aa]">
                <Lock className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-outfit text-base font-bold text-slate-800 dark:text-white">
                  Change Password
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Keep your account secure
                </p>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {/* Current Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  disabled={passwordLoading}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Current Password"
                  className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#080d17] pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  disabled={passwordLoading}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="New Password"
                  className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#080d17] pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  disabled={passwordLoading}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Confirm New Password"
                  className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#080d17] pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* Password Feedback */}
              {passwordError && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 rounded-lg p-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {/* Update Password Button */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full mt-4 rounded-xl bg-[#009688] hover:bg-[#008577] text-white py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4" />
                <span>{passwordLoading ? "Updating Password..." : "Update Password"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* ================= CARD 2: Change Email Address ================= */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#1b283d] bg-white dark:bg-[#0e1624] p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#0da5aa]">
                <Mail className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-outfit text-base font-bold text-slate-800 dark:text-white">
                  Change Email Address
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Update your email address
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {/* New Email Address */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="New Email Address"
                  className="w-full rounded-xl border border-slate-200/90 dark:border-[#1b283d] bg-white dark:bg-[#080d17] pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#0da5aa] focus:ring-1 focus:ring-[#0da5aa] outline-none transition-all"
                />
              </div>

              {/* Email Feedback */}
              {emailError && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 rounded-lg p-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
              {emailSuccess && (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{emailSuccess}</span>
                </div>
              )}

              {/* Update Email Button */}
              <button
                type="submit"
                className="w-full mt-4 rounded-xl bg-[#0da5aa] hover:bg-[#088395] text-white py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Update Email</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
