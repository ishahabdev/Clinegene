import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const AuthContext = createContext(null);

const SESSION_STORAGE_USER_KEY = "clingene_admin_session_active";
const LOCKOUT_ATTEMPTS_LIMIT = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const WARNING_INACTIVITY_MS = 28 * 60 * 1000; // 28 minutes
const LOGOUT_INACTIVITY_MS = 30 * 60 * 1000;  // 30 minutes

export function AuthProvider({ children }) {
  // Mock in-memory session (retains during tab refresh via sessionStorage session flag; TODO: replace with httpOnly cookie auth)
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const active = sessionStorage.getItem(SESSION_STORAGE_USER_KEY);
      if (active) {
        return {
          email: "admin@clingene.co",
          name: "Dr. Admin",
          role: "Super Admin",
          avatar: "/assets/team/Safdar Ali.jpeg",
        };
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [failedAttempts, setFailedAttempts] = useState(() => {
    if (typeof window === "undefined") return 0;
    const count = parseInt(sessionStorage.getItem("clingene_admin_failed_attempts") || "0", 10);
    return isNaN(count) ? 0 : count;
  });

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("clingene_admin_lockout_until");
    if (!stored) return null;
    const time = parseInt(stored, 10);
    return time > Date.now() ? time : null;
  });

  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  const lastActivityRef = useRef(Date.now());
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const logout = useCallback((reason = "manual") => {
    setUser(null);
    setShowInactivityWarning(false);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_USER_KEY);
    } catch {
      // ignore
    }

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    if (typeof window !== "undefined") {
      const query = reason === "timeout" ? "?reason=timeout" : "";
      window.history.pushState(null, "", `/admin/login${query}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  const resetInactivityTimers = useCallback(() => {
    if (!user) return;
    lastActivityRef.current = Date.now();
    setShowInactivityWarning(false);
    setSecondsRemaining(120);

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Warning at 28 minutes
    warningTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(true);
      setSecondsRemaining(120);

      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_INACTIVITY_MS);

    // Auto logout at 30 minutes
    logoutTimerRef.current = setTimeout(() => {
      logout("timeout");
    }, LOGOUT_INACTIVITY_MS);
  }, [user, logout]);

  // Activity listeners when user is logged in
  useEffect(() => {
    if (!user) return;

    resetInactivityTimers();

    const handleUserActivity = () => {
      // Only reset if warning modal is not currently open
      if (!showInactivityWarning) {
        lastActivityRef.current = Date.now();
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

        warningTimerRef.current = setTimeout(() => {
          setShowInactivityWarning(true);
          setSecondsRemaining(120);
        }, WARNING_INACTIVITY_MS);

        logoutTimerRef.current = setTimeout(() => {
          logout("timeout");
        }, LOGOUT_INACTIVITY_MS);
      }
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [user, showInactivityWarning, logout, resetInactivityTimers]);

  const login = async ({ email, password }) => {
    // Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingMins = Math.ceil((lockoutUntil - Date.now()) / (60 * 1000));
      throw new Error(`Account temporarily locked due to 5 consecutive failed attempts. Please try again in ${remainingMins} minute(s).`);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Mock validation: accept admin@clingene.co with any password
    if (cleanEmail === "admin@clingene.co") {
      const adminUser = {
        email: "admin@clingene.co",
        name: "Dr. Admin",
        role: "Super Admin",
        avatar: "/assets/team/Safdar Ali.jpeg",
      };
      setUser(adminUser);
      setFailedAttempts(0);
      setLockoutUntil(null);
      try {
        sessionStorage.setItem(SESSION_STORAGE_USER_KEY, "1");
        sessionStorage.removeItem("clingene_admin_failed_attempts");
        sessionStorage.removeItem("clingene_admin_lockout_until");
      } catch {
        // ignore
      }
      return adminUser;
    } else {
      // Failed attempt
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      sessionStorage.setItem("clingene_admin_failed_attempts", String(nextCount));

      if (nextCount >= LOCKOUT_ATTEMPTS_LIMIT) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockoutTime);
        sessionStorage.setItem("clingene_admin_lockout_until", String(lockoutTime));
        throw new Error("Too many failed attempts. Login has been locked for 15 minutes.");
      }

      const remaining = LOCKOUT_ATTEMPTS_LIMIT - nextCount;
      throw new Error(`Invalid credentials. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before temporary lockout.`);
    }
  };

  const isLockedOut = Boolean(lockoutUntil && Date.now() < lockoutUntil);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        failedAttempts,
        isLockedOut,
        lockoutUntil,
        showInactivityWarning,
        secondsRemaining,
        stayLoggedIn: resetInactivityTimers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

