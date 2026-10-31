import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../types/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_BASE, adminPath } from "../adminConfig.js";
import { supabase } from "../../lib/supabase.js";
import { Lock, Mail, ShieldCheck, ArrowRight, Stethoscope } from "lucide-react";
import Input from "../components/Input.jsx";

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Forgot Password Flow State
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    setSubmitting(true);
    try {
      await login(data);
      if (onNavigate) onNavigate(ADMIN_BASE);
    } catch {
      // Requirement 3: One generic error for any failure: "Invalid email or password"
      setAuthError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const email = forgotEmail.trim();
    if (!email) return;

    setForgotSending(true);
    try {
      if (supabase) {
        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}${adminPath("/reset")}`
            : adminPath("/reset");

        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
      }
    } catch {
      // Intentionally ignore error to preserve generic message
    } finally {
      setForgotSending(false);
      setForgotMessage(
        "If this email is registered, a reset link has been sent."
      );
      setCooldown(60);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16222f] p-4 font-inter text-slate-800">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-white p-7 sm:p-9 shadow-2xl transition-all">
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#00897b] to-[#00a884] text-white shadow-lg shadow-teal-950/20 mb-3">
              <Stethoscope className="h-7 w-7" />
            </div>
            <h1 className="font-outfit text-xl font-extrabold tracking-wider text-slate-900 sm:text-2xl uppercase">
              HEALTH <span className="text-[#009688]">ADMIN</span>
            </h1>
            <p className="mt-1 font-inter text-xs font-semibold uppercase tracking-widest text-slate-400">
              {showForgot ? "Password Recovery" : "Medical & Clinical Portal"}
            </p>
          </div>

          {showForgot ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
              {forgotMessage && (
                <div
                  role="status"
                  className="rounded-xl border border-teal-200 bg-teal-50 p-3.5 font-inter text-xs font-medium text-teal-800 leading-relaxed"
                >
                  {forgotMessage}
                </div>
              )}

              <Input
                label="Administrator Email"
                type="email"
                icon={Mail}
                required
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <button
                type="submit"
                disabled={forgotSending || cooldown > 0 || !forgotEmail.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#009688] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00897b] transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>
                  {forgotSending
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Send reset link"}
                </span>
                {!forgotSending && cooldown === 0 && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotMessage("");
                  }}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {authError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 font-inter text-xs font-medium text-rose-700"
                >
                  {authError}
                </div>
              )}

              <Input
                label="Administrator Email"
                type="email"
                icon={Mail}
                required
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                required
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#009688] focus:ring-[#009688]"
                    {...register("rememberMe")}
                  />
                  <span className="text-slate-600">Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthError("");
                    setShowForgot(true);
                  }}
                  className="text-xs font-semibold text-[#009688] hover:text-[#00897b] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#009688] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#00897b] transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>{submitting ? "Signing In..." : "Sign In to Admin Portal"}</span>
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
