"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"customer" | "admin">;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, authError, retryAuth } = useAuth();
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
      if (!isAuthenticated || !user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] bg-white text-[#1F1F1F] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-10 h-10 border-4 border-[#A67C52] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#666666]">
            Verifying authentication status...
          </span>

          {(showSlowNotice || authError) && (
            <div className="mt-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col gap-3">
              <p className="text-xs text-[#666666]">
                {authError || "Slow connection detected. Verification is taking longer than expected."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowSlowNotice(false);
                  retryAuth();
                }}
                className="px-4 py-2 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-sm hover:bg-[#8e6843] transition-colors cursor-pointer"
              >
                🔄 Retry Verification
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
