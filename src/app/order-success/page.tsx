"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState("#BD483921");
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    // Generate order date on client side
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setOrderDate(formatted);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-12 sm:py-20">
        <Container>
          {/* Main Success Container with Subtle Entrance Animation */}
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center animate-[fadeIn_0.6s_ease-out]">
            {/* Top Success Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#16A34A]/10 text-[#16A34A] border-2 border-[#16A34A]/30 flex items-center justify-center shadow-inner transform transition-transform hover:scale-105 duration-300">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            </div>

            {/* Title & Confirmatory Text */}
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52] mb-2">
              ORDER CONFIRMED
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F] mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-lg mb-10">
              Thank you for shopping with Béné Decor. Your handcrafted furniture order has been confirmed.
            </p>

            {/* Order Details Card */}
            <div className="w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-4 text-sm mb-10 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]/60">
                <span className="text-[#666666]">Order ID:</span>
                <span className="font-bold text-[#1F1F1F] tracking-wider">{orderId}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]/60">
                <span className="text-[#666666]">Order Date:</span>
                <span className="font-semibold text-[#1F1F1F]">{orderDate || "August 1, 2026"}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]/60">
                <span className="text-[#666666]">Estimated Delivery:</span>
                <span className="font-semibold text-[#1F1F1F]">5 – 7 Business Days</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]/60">
                <span className="text-[#666666]">Payment Status:</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                  Paid
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#666666]">Shipping &amp; Transit:</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                  Free Delivery
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-16">
              <Link href="/" className="w-full sm:w-auto flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/orders" className="w-full sm:w-auto flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  View Orders
                </Button>
              </Link>
            </div>

            {/* Bottom Features Bar */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#E5E5E5]/80 pt-10">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E5E5E5]/60 shadow-sm text-center">
                <span className="text-xl text-[#16A34A]">✓</span>
                <span className="font-bold text-xs text-[#1F1F1F]">Secure Payment</span>
                <span className="text-[11px] text-[#666666]">256-Bit Encrypted</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E5E5E5]/60 shadow-sm text-center">
                <span className="text-xl text-[#16A34A]">✓</span>
                <span className="font-bold text-xs text-[#1F1F1F]">Premium Quality</span>
                <span className="text-[11px] text-[#666666]">Solid Teak Wood</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E5E5E5]/60 shadow-sm text-center">
                <span className="text-xl text-[#16A34A]">✓</span>
                <span className="font-bold text-xs text-[#1F1F1F]">Fast Delivery</span>
                <span className="text-[11px] text-[#666666]">White-Glove Service</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E5E5E5]/60 shadow-sm text-center">
                <span className="text-xl text-[#16A34A]">✓</span>
                <span className="font-bold text-xs text-[#1F1F1F]">Customer Support</span>
                <span className="text-[11px] text-[#666666]">24/7 Assistance</span>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
