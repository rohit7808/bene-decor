"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "If an account exists with this email, a password reset link has been sent.");
      } else {
        setErrorMsg(data.error || "Failed to process password reset request.");
      }
    } catch (err) {
      console.error("Forgot password page error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      <Navbar />

      <main className="py-12 sm:py-16">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col text-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                PASSWORD RECOVERY
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                Forgot Password?
              </h1>
              <p className="text-xs sm:text-sm text-[#666666]">
                Enter your registered email address below and we will send you a password reset link.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
                ✕ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold leading-relaxed animate-[fadeIn_0.2s_ease-out]">
                ✓ {successMsg}
              </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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
                {isSubmitting ? "Sending Reset Link..." : "Send Password Reset Link →"}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
              Remember your password?{" "}
              <Link href="/login" className="font-bold text-[#A67C52] hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
