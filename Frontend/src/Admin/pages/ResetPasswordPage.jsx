import { useState, useEffect } from "react";
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, Stethoscope } from "lucide-react";
import { supabase } from "../../lib/supabase.js";
import { adminPath } from "../adminConfig.js";
import Input from "../components/Input.jsx";
import LoginPage from "./LoginPage.jsx";

export default function ResetPasswordPage({ onNavigate }) {
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    // 1. Listen for Supabase Auth PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "PASSWORD_RECOVERY" ||
        (session && typeof window !== "undefined" && window.location.hash.includes("type=recovery"))
      ) {
        setIsRecovery(true);
        setChecking(false);
      }
    });

    // 2. Also inspect the current session and recovery hash/query tokens
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const search = typeof window !== "undefined" ? window.location.search : "";
        if (
          hash.includes("type=recovery") ||
          search.includes("type=recovery") ||
          (session && hash.includes("access_token"))
        ) {
          setIsRecovery(true);
        }
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // While inspecting session tokens, show clean minimal loader
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#16222f] p-4 font-inter text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-700 border-t-[#009688]" />
          <span className="text-xs text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Requirement 5: If opened without a valid recovery session, show normal login form
  if (!isRecovery) {
    return <LoginPage onNavigate={onNavigate} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: Minimum 12 characters
    if (!password || password.length < 12) {
      setError("Password must be at least 12 characters long.");
      return;
    }

    // Validation: Both must match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) {
        throw new Error("Supabase client is not configured.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      // Requirement 4: Call signOut(), show "Password updated", and send to login at adminPath()
      await supabase.auth.signOut();
      setSuccess(true);

      setTimeout(() => {
        if (onNavigate) {
          onNavigate(adminPath(""));
        } else if (typeof window !== "undefined") {
          window.location.href = adminPath("");
        }
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16222f] p-4 font-inter text-slate-800">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700/80 bg-white p-7 sm:p-9 shadow-2xl transition-all">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#00897b] to-[#00a884] text-white shadow-lg shadow-teal-950/20 mb-3">
              <Stethoscope className="h-7 w-7" />
            </div>
            <h1 className="font-outfit text-xl font-extrabold tracking-wider text-slate-900 sm:text-2xl uppercase">
              HEALTH <span className="text-[#009688]">ADMIN</span>
            </h1>
            <p className="mt-1 font-inter text-xs font-semibold uppercase tracking-widest text-slate-400">
              Reset Administrator Password
            </p>
          </div>

          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-1">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-outfit text-base font-bold text-slate-900">
                Password updated
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Your new password has been saved. Redirecting you to the sign-in screen...
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate(adminPath(""))}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#009688] hover:text-[#00897b] cursor-pointer"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 font-inter text-xs font-medium text-rose-700"
                >
                  {error}
                </div>
              )}

              <Input
                label="New Password"
                type="password"
                icon={Lock}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 12 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />

              <p className="text-[11px] text-slate-400 leading-normal">
                Must be at least 12 characters long and match both fields.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#009688] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00897b] transition-all disabled:opacity-60 cursor-pointer mt-2"
              >
                <span>{submitting ? "Updating..." : "Update Password"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Secure footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-[#009688]" />
            <span>256-bit HIPAA-compliant encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

