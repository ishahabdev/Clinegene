import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase.js";
import { adminPath } from "../adminConfig.js";

const AuthContext = createContext(null);

const WARNING_INACTIVITY_MS = 28 * 60 * 1000; // 28 minutes
const LOGOUT_INACTIVITY_MS = 30 * 60 * 1000;  // 30 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  const lastActivityRef = useRef(Date.now());
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Requirement 1 & 2: Check if user is listed in the `admins` table
  const checkAdminStatus = async (userId) => {
    if (!supabase || !userId) return false;
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = useCallback(async (reason = "manual") => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setShowInactivityWarning(false);

      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      if (typeof window !== "undefined") {
        const query = reason === "timeout" ? "?reason=timeout" : "";
        window.history.pushState(null, "", `${adminPath("/login")}${query}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
  }, []);

  const resetInactivityTimers = useCallback(() => {
    if (!user || !isAdmin) return;
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
  }, [user, isAdmin, logout]);

  // Requirement 5 & 6: Keep session across refresh (getSession + onAuthStateChange)
  useEffect(() => {
    let isMounted = true;

    // If supabase client is null (missing env vars), show login form and never grant access
    if (!supabase) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession();

        if (activeSession?.user) {
          const authorized = await checkAdminStatus(activeSession.user.id);
          if (isMounted) {
            if (authorized) {
              setUser(activeSession.user);
              setSession(activeSession);
              setIsAdmin(true);
            } else {
              // Valid Supabase user but not listed in `admins` table -> sign out
              await supabase.auth.signOut();
              setUser(null);
              setSession(null);
              setIsAdmin(false);
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === "SIGNED_OUT" || !currentSession?.user) {
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        const authorized = await checkAdminStatus(currentSession.user.id);
        if (isMounted) {
          if (authorized) {
            setUser(currentSession.user);
            setSession(currentSession);
            setIsAdmin(true);
          } else {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Inactivity listeners when user is authenticated
  useEffect(() => {
    if (!user || !isAdmin) return;

    resetInactivityTimers();

    const handleUserActivity = () => {
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
    events.forEach((evt) =>
      window.addEventListener(evt, handleUserActivity, { passive: true })
    );

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, handleUserActivity)
      );
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [user, isAdmin, showInactivityWarning, logout, resetInactivityTimers]);

  // Requirement 2 & 3: Email + Password via supabase.auth.signInWithPassword.
  // Then check `admins` table. One generic error "Invalid email or password" for any failure.
  const login = async ({ email, password }) => {
    const genericError = "Invalid email or password";

    if (!supabase) {
      throw new Error(genericError);
    }

    const cleanEmail = email?.trim();
    if (!cleanEmail || !password) {
      throw new Error(genericError);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data?.user) {
      throw new Error(genericError);
    }

    const authorized = await checkAdminStatus(data.user.id);
    if (!authorized) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      throw new Error(genericError);
    }

    setUser(data.user);
    setSession(data.session);
    setIsAdmin(true);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        isAuthenticated: Boolean(user && isAdmin),
        login,
        logout,
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
