import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../types/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Lock, Mail, AlertTriangle, ShieldCheck, ArrowRight, Stethoscope } from "lucide-react";
import Input from "../components/Input.jsx";

export default function LoginPage({ onNavigate }) {
  const { login, isLockedOut, lockoutUntil } = useAuth();
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@clingene.co",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    setSubmitting(true);
    try {
      await login(data);
      if (onNavigate) onNavigate("/admin");
    } catch (err) {
      setAuthError(err.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue("email", "admin@clingene.co");
    setValue("password", "HealthAdmin2025!");
    setAuthError("");
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
              Medical & Clinical Portal
            </p>
          </div>

          {/* Lockout Warning */}
          {isLockedOut ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-rose-600 mx-auto mb-2" />
              <h4 className="font-outfit text-sm font-bold text-rose-900">
                Account Temporarily Locked
              </h4>
              <p className="mt-1 font-inter text-xs text-rose-700 leading-relaxed">
                Too many failed login attempts. Please wait 15 minutes before trying again.
              </p>
            </div>
          ) : (
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
                placeholder="admin@clingene.co"
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
                  onClick={fillDemo}
                  className="text-xs font-semibold text-[#009688] hover:text-[#00897b] transition-colors"
                >
                  Use Demo Credentials
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
