"use client";

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

interface OrderSummaryProps {
  subtotal: number;
  savings: number;
  grandTotal: number;
}

export default function OrderSummary({
  subtotal,
  savings,
  grandTotal,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm self-start w-full">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
        Order Summary
      </h2>

      <div className="flex flex-col gap-3.5 text-sm text-[#666666]">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1F1F1F]">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        {savings > 0 && (
          <div className="flex justify-between items-center text-[#16A34A]">
            <span>Discount Savings</span>
            <span className="font-semibold">− ₹{savings.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-semibold text-[#16A34A]">FREE</span>
        </div>

        {/* Estimated Tax */}
        <div className="flex justify-between items-center">
          <span>Estimated GST (18%)</span>
          <span className="font-medium text-[#1F1F1F]">Included</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E5E5] pt-4 flex justify-between items-baseline">
        <span className="font-bold text-lg text-[#1F1F1F]">Grand Total</span>
        <div className="flex flex-col items-end">
          <span className="font-bold text-2xl text-[#1F1F1F]">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-[#666666]">Inclusive of all taxes</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        <Link href="/checkout" className="w-full">
          <Button variant="primary" size="lg" className="w-full cursor-pointer">
            Proceed to Checkout
          </Button>
        </Link>

        <Link href="/shop" className="w-full">
          <Button variant="outline" size="lg" className="w-full cursor-pointer">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#666666] pt-2">
        <svg
          className="w-4 h-4 text-[#A67C52]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span>Secure 256-Bit SSL Encrypted Checkout</span>
      </div>
    </div>
  );
}
