"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, user, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect logged-in users away from /register
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields (Name, Email, Password, Confirm Password).");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please enter matching passwords.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await register({ name: name.trim(), email: email.trim(), password, phone: phone.trim() });

      if (res.success) {
        router.push("/profile");
      } else {
        setErrorMsg(res.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register page error:", err);
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
            {/* Header */}
            <div className="flex flex-col text-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                CREATE AN ACCOUNT
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                Join BenéDecor
              </h1>
              <p className="text-xs sm:text-sm text-[#666666]">
                Register to track orders, save handcrafted wishlist pieces, and enjoy member perks.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
                ✕ {errorMsg}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

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

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">
                  Password <span className="text-rose-500">*</span>
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
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
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
                {isSubmitting ? "Creating Account..." : "Create Account →"}
              </Button>
            </form>

            {/* Redirect link to Login */}
            <div className="text-center text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#A67C52] hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
