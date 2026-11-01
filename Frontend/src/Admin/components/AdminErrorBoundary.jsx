import React, { Component } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { adminPath } from "../adminConfig.js";

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Page Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center my-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="font-outfit text-lg font-bold text-slate-800 dark:text-white">
            Something went wrong loading this section
          </h2>
          <p className="font-inter text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
            {this.state.error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onNavigate) {
                  this.props.onNavigate(adminPath(""));
                } else if (typeof window !== "undefined") {
                  window.location.href = adminPath("");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0da5aa] hover:bg-[#088395] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

