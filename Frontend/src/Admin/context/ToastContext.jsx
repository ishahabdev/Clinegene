import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-2 ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/95 dark:text-emerald-100"
                  : isError
                  ? "border-rose-200 bg-rose-50/95 text-rose-900 dark:border-rose-800 dark:bg-rose-950/95 dark:text-rose-100"
                  : "border-slate-200 bg-white/95 text-slate-900 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                {isError && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                {!isSuccess && !isError && <Info className="h-5 w-5 text-[#b91c1c]" />}
              </div>

              <div className="min-w-0 flex-1">
                {toast.title && <h4 className="font-outfit text-sm font-bold leading-tight">{toast.title}</h4>}
                {toast.message && <p className="mt-0.5 font-inter text-xs leading-normal opacity-90">{toast.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

