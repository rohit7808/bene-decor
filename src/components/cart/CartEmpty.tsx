"use client";

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 my-8 shadow-sm max-w-2xl mx-auto gap-5">
      {/* Large Cart Icon */}
      <div className="p-6 rounded-full bg-white border border-[#E5E5E5] shadow-sm text-[#A67C52]">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
        Your Cart is Empty
      </h2>

      {/* Description */}
      <p className="text-base text-[#666666] max-w-md leading-relaxed">
        Looks like you haven't added any furniture yet.
      </p>

      {/* Continue Shopping Button */}
      <Link href="/shop" className="mt-2">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
