"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, authError, retryAuth } = useAuth();
  const router = useRouter();
  const [showSlowNotice, setShowSlowNotice] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowSlowNotice(true), 5000);
    } else {
      setShowSlowNotice(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/admin/login");
      } else if (user && user.role !== "admin") {
        router.push("/profile");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#1F1F1F]">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[#A67C52]/20 text-[#A67C52] flex items-center justify-center font-bold text-xl">
            👑
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            BENÉ DECOR ADMIN
          </span>
          <p className="text-xs text-[#666666]">
            Verifying administrator authorization credentials...
          </p>

          {(showSlowNotice || authError) && (
            <div className="mt-2 p-4 rounded-2xl bg-white border border-[#E5E5E5] flex flex-col gap-3 shadow-sm">
              <p className="text-xs text-[#666666]">
                {authError || "Slow network detected. Verification is taking extra time."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowSlowNotice(false);
                  retryAuth();
                }}
                className="px-4 py-2 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-sm hover:bg-[#8e6843] transition-colors cursor-pointer"
              >
                🔄 Retry Auth Verification
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#1F1F1F]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-lg flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl font-bold">
            🚫
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
            Access Denied
          </h2>
          <p className="text-xs text-[#666666] leading-relaxed">
            Administrator privileges required. You do not have permission to view this page.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer"
          >
            Go to Admin Login →
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
