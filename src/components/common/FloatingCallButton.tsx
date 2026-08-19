"use client";

import React from "react";

export default function FloatingCallButton() {
  return (
    <aside aria-label="Quick Phone Call Support">
      <a
        href="tel:+919928348586"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[99] flex items-center gap-2.5 group cursor-pointer"
        title="Call Bene Decor - +91 9928348586"
      >
        {/* Pill Label: "Buy on Phone" */}
        <div className="bg-white text-[#1F1F1F] font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg border border-[#E5E5E5]/90 flex items-center gap-1.5 whitespace-nowrap group-hover:-translate-x-1 group-hover:shadow-xl transition-all duration-300 ease-out">
          <span className="w-2 h-2 rounded-full bg-[#E06A3B] animate-pulse" />
          <span>Buy on Phone</span>
        </div>

        {/* Circular Action Button */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#C85A32] via-[#E06A3B] to-[#D97706] text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 ease-out shrink-0 border-2 border-white">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </div>
      </a>
    </aside>
  );
}
