"use client";

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 my-8 shadow-sm max-w-2xl mx-auto gap-5">
      {/* Large Heart Icon */}
      <div className="p-6 rounded-full bg-white border border-[#E5E5E5] shadow-sm text-[#A67C52]">
        <svg
          className="w-16 h-16"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
        Your Wishlist is Empty
      </h2>

      {/* Subtitle */}
      <p className="text-base text-[#666666] max-w-md leading-relaxed">
        Save your favourite furniture here for later.
      </p>

      {/* Continue Shopping Button */}
      <Link href="/" className="mt-2">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
