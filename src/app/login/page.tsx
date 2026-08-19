"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || searchParams.get("callbackUrl") || "/profile";
  const { login, verifyOtp, resendOtp, user, isAuthenticated, isLoading } = useAuth();

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  
  // Resend OTP countdown timer
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Redirect logged-in users away from /login
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    }
  }, [isLoading, isAuthenticated, user, router, redirectUrl]);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "OTP" && resendCooldown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCooldown]);

  // Handle Step 1: Login Form Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setInfoMsg(null);

      const res = await login(email.trim(), password);

      if (res.success && res.requiresOtp) {
        setStep("OTP");
        setInfoMsg(`Verification code sent to ${res.email || email.trim()}`);
        setResendCooldown(60);
        setCanResend(false);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      } else if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.error || "Invalid email address or password.");
      }
    } catch (err) {
      console.error("Login page error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Digit input changes
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input field
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{1,6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newDigits = ["", "", "", "", "", ""];
      digits.forEach((d, idx) => {
        if (idx < 6) newDigits[idx] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(digits.length, 5);
      inputRefs[nextFocus].current?.focus();
    }
  };

  // Handle Step 2: Verify OTP Submit
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setInfoMsg(null);

      const res = await verifyOtp(email.trim(), fullOtp);

      if (res.success && res.user) {
        if (res.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push(redirectUrl);
        }
      } else {
        setErrorMsg(res.error || "Invalid verification code. Please check and try again.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP Click
  const handleResendOtp = async () => {
    if (!canResend || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setInfoMsg(null);

      const res = await resendOtp(email.trim());

      if (res.success) {
        setInfoMsg(res.message || "A new 6-digit verification code has been sent.");
        setResendCooldown(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs[0].current?.focus();
      } else {
        setErrorMsg(res.error || "Failed to resend verification code.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F]">
        <Navbar />
        <Container>
          <div className="py-20 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Verifying authentication status...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      <Navbar />

      <main className="py-12 sm:py-16">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            
            {/* ================= STEP 1: EMAIL & PASSWORD ================= */}
            {step === "LOGIN" && (
              <>
                {/* Header */}
                <div className="flex flex-col text-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                    WELCOME BACK
                  </span>
                  <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                    Customer Login
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666]">
                    Access your BenéDecor account, orders, and saved wishlist.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
                    ✕ {errorMsg}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[#1F1F1F]">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-[#1F1F1F]">Password</label>
                      <Link href="/forgot-password" className="text-xs font-semibold text-[#A67C52] hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                    {isSubmitting ? "Verifying Credentials..." : "Continue to Verification →"}
                  </Button>
                </form>

                {/* Redirect link to Register */}
                <div className="text-center text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-bold text-[#A67C52] hover:underline">
                    Create One
                  </Link>
                </div>
              </>
            )}

            {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
            {step === "OTP" && (
              <>
                {/* Header */}
                <div className="flex flex-col text-center gap-1.5">
                  <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] text-xl flex items-center justify-center mx-auto mb-1">
                    🛡️
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                    SECURITY VERIFICATION
                  </span>
                  <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                    Enter Code
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666]">
                    We sent a 6-digit login verification code to: <br />
                    <strong className="text-[#1F1F1F] font-semibold">{email}</strong>
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-[fadeIn_0.2s_ease-out]">
                    ✕ {errorMsg}
                  </div>
                )}

                {infoMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center leading-relaxed animate-[fadeIn_0.2s_ease-out]">
                    ✓ {infoMsg}
                  </div>
                )}

                {/* 6-Digit OTP Form */}
                <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-6">
                  <div className="flex justify-center items-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={inputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52] focus:bg-white shadow-sm transition-all"
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || otpDigits.join("").length !== 6}
                    className="w-full font-bold py-3 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Verifying Code..." : "Verify Code & Log In →"}
                  </Button>
                </form>

                {/* Resend OTP & Back Options */}
                <div className="flex flex-col items-center gap-3 pt-4 border-t border-[#E5E5E5] text-xs">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || isSubmitting}
                    className={`font-semibold transition-colors ${
                      canResend
                        ? "text-[#A67C52] hover:underline cursor-pointer"
                        : "text-[#999999] cursor-not-allowed"
                    }`}
                  >
                    {canResend
                      ? "Didn't receive the code? Resend OTP"
                      : `Resend code in ${resendCooldown}s`}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("LOGIN");
                      setErrorMsg(null);
                      setInfoMsg(null);
                    }}
                    className="text-[#666666] hover:text-[#1F1F1F] hover:underline cursor-pointer"
                  >
                    ← Back to Email & Password
                  </button>
                </div>
              </>
            )}

          </div>
        </Container>
      </main>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
          <Navbar />
          <Container>
            <div className="py-20 text-center text-xs text-[#666666] animate-pulse">
              ⏳ Loading authentication parameters...
            </div>
          </Container>
        </div>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}
