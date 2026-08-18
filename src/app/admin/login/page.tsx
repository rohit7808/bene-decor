"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyOtp, resendOtp, user, isAuthenticated, isLoading } = useAuth();

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

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

  // Redirect logged-in admin to /admin dashboard, or non-admin customer to /profile
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Resend cooldown timer
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

  // Handle Admin Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setInfoMsg(null);

      const res = await login(email.trim(), password);

      if (res.success && res.requiresOtp) {
        setStep("OTP");
        setInfoMsg(`Administrator OTP code sent to ${res.email || email.trim()}`);
        setResendCooldown(60);
        setCanResend(false);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      } else if (res.success) {
        router.push("/admin");
      } else {
        setErrorMsg(res.error || "Invalid admin credentials.");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
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
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{1,6}$/.test(pasted)) {
      const digits = pasted.split("");
      const newDigits = ["", "", "", "", "", ""];
      digits.forEach((d, idx) => {
        if (idx < 6) newDigits[idx] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(digits.length, 5);
      inputRefs[nextFocus].current?.focus();
    }
  };

  // Handle Verify OTP
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
          setErrorMsg("Access denied. Administrator privileges required.");
          router.push("/profile");
        }
      } else {
        setErrorMsg(res.error || "Invalid verification code.");
      }
    } catch (err) {
      console.error("Admin OTP Verification error:", err);
      setErrorMsg("An unexpected error occurred during verification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setInfoMsg(null);

      const res = await resendOtp(email.trim());

      if (res.success) {
        setInfoMsg(res.message || "A new 6-digit OTP has been sent.");
        setResendCooldown(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs[0].current?.focus();
      } else {
        setErrorMsg(res.error || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex items-center justify-center p-6">
        <div className="animate-pulse text-center text-sm text-amber-200">
          👑 Verifying administrator session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#F3F4F6] flex items-center justify-center py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-[#1F1F1F] rounded-3xl border border-[#333333] p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full bg-[#A67C52]/20 border border-[#A67C52] text-[#A67C52] flex items-center justify-center font-bold text-2xl shadow-lg">
              👑
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67C52]">
              ADMIN PORTAL
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-white">
              BenéDecor Admin
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Management Portal &amp; Store Administration
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold text-center animate-[fadeIn_0.2s_ease-out]">
              ✕ {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold text-center leading-relaxed animate-[fadeIn_0.2s_ease-out]">
              ✓ {infoMsg}
            </div>
          )}

          {/* STEP 1: ADMIN CREDENTIALS */}
          {step === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#E5E7EB]">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@benedecor.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#374151] bg-[#111827] text-white focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#E5E7EB]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#374151] bg-[#111827] text-white focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold py-3 mt-2 shadow-lg cursor-pointer bg-[#A67C52] hover:bg-[#8e6843] text-white"
              >
                {isSubmitting ? "Verifying Credentials..." : "Authenticate Admin →"}
              </Button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
          {step === "OTP" && (
            <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-6">
              <div className="text-center text-xs text-[#9CA3AF]">
                Enter the 6-digit verification code sent to: <br />
                <strong className="text-white font-semibold">{email}</strong>
              </div>

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
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-[#374151] bg-[#111827] text-white focus:outline-none focus:border-[#A67C52] shadow-sm transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || otpDigits.join("").length !== 6}
                className="w-full font-bold py-3 shadow-lg cursor-pointer bg-[#A67C52] hover:bg-[#8e6843] text-white disabled:opacity-50"
              >
                {isSubmitting ? "Verifying Code..." : "Verify Code & Access Dashboard →"}
              </Button>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-[#374151] text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isSubmitting}
                  className={`font-semibold transition-colors ${
                    canResend
                      ? "text-[#A67C52] hover:underline cursor-pointer"
                      : "text-[#6B7280] cursor-not-allowed"
                  }`}
                >
                  {canResend
                    ? "Didn't receive code? Resend OTP"
                    : `Resend code in ${resendCooldown}s`}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("LOGIN");
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className="text-[#9CA3AF] hover:text-white hover:underline cursor-pointer"
                >
                  ← Back to Email &amp; Password
                </button>
              </div>
            </form>
          )}

          {/* Customer Portal Link */}
          <div className="text-center text-xs text-[#9CA3AF] pt-4 border-t border-[#374151]">
            Customer?{" "}
            <Link href="/login" className="font-bold text-[#A67C52] hover:underline">
              Go to Customer Login
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
