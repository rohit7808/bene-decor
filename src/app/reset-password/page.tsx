"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMsg("Missing or invalid password reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please enter matching passwords.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Password has been reset successfully.");
      } else {
        setErrorMsg(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password page error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-sm flex flex-col items-center text-center gap-4">
        <span className="text-4xl">⚠️</span>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
          Invalid Reset Link
        </h1>
        <p className="text-xs text-[#666666]">
          This password reset link is invalid or incomplete. Please request a new link.
        </p>
        <Link
          href="/forgot-password"
          className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-semibold shadow-md hover:bg-[#8e6843] transition-colors"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col text-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
          NEW PASSWORD
        </span>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
          Reset Your Password
        </h1>
        <p className="text-xs sm:text-sm text-[#666666]">
          Choose a strong, secure new password for your BenéDecor account.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
          ✕ {errorMsg}
        </div>
      )}

      {successMsg ? (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold leading-relaxed w-full">
            ✓ {successMsg}
          </div>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-[#A67C52] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-colors text-center inline-block"
          >
            Log In with New Password →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#1F1F1F]">
              New Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#1F1F1F]">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full font-bold py-3 mt-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Resetting Password..." : "Update Password →"}
          </Button>
        </form>
      )}

      {/* Back to Login */}
      <div className="text-center text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
        Remembered your password?{" "}
        <Link href="/login" className="font-bold text-[#A67C52] hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      <Navbar />
      <main className="py-12 sm:py-16">
        <Container>
          <Suspense
            fallback={
              <div className="max-w-md mx-auto text-center py-10 text-xs text-[#666666] animate-pulse">
                ⏳ Loading reset token...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </Container>
      </main>
    </div>
  );
}
