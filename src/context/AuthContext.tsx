"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresOtp?: boolean; email?: string; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; user?: UserPayload; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CACHED_USER_KEY = "benedecor_cached_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CACHED_USER_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const updateCachedUser = (u: UserPayload | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      try {
        if (u) {
          localStorage.setItem(CACHED_USER_KEY, JSON.stringify(u));
        } else {
          localStorage.removeItem(CACHED_USER_KEY);
        }
      } catch (err) {}
    }
  };

  // Resilient session check with timeout & background revalidation
  const checkAuth = useCallback(async () => {
    setAuthError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout for slow networks

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "same-origin",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";

      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.user) {
          updateCachedUser(data.user);
        } else {
          updateCachedUser(null);
        }
      } else {
        updateCachedUser(null);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn("Background Auth verification delayed/failed:", err);
      if (err.name === "AbortError") {
        setAuthError("Network authentication check timed out.");
      }
      // Preserve existing cached user profile if offline/slow network
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; requiresOtp?: boolean; user?: UserPayload; error?: string }> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return { success: false, error: "Server returned a non-JSON response." };
      }

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.requiresOtp) {
          return { success: true, requiresOtp: true };
        }
        updateCachedUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || "Login failed. Please check credentials." };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected network error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Login OTP
  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; user?: UserPayload; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, otp }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return { success: false, error: "Server returned a non-JSON response." };
      }

      const data = await res.json();

      if (res.ok && data.success) {
        updateCachedUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || "OTP verification failed." };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Login OTP
  const resendOtp = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch("/api/auth/resend-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return { success: false, error: "Server returned a non-JSON response." };
      }

      const data = await res.json();

      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error || "Failed to resend verification code." };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  };

  // Register Customer
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return { success: false, error: "Server returned a non-JSON response." };
      }

      const resData = await res.json();

      if (res.ok && resData.success) {
        updateCachedUser(resData.user);
        return { success: true };
      } else {
        return { success: false, error: resData.error || "Registration failed." };
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      updateCachedUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout Context error:", err);
      updateCachedUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authError,
        login,
        verifyOtp,
        resendOtp,
        register,
        logout,
        checkAuth,
        retryAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
