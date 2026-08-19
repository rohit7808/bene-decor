"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing popup & saving session state
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      try {
        sessionStorage.setItem("benedecor_promo_popup_seen", "true");
      } catch (err) {
        console.warn("sessionStorage unavailable:", err);
      }
    }, 300); // Animation duration
  }, []);

  // Check sessionStorage on mount & set 4-second delay timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    try {
      const alreadySeen = sessionStorage.getItem("benedecor_promo_popup_seen");
      if (!alreadySeen) {
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 4000); // 4-second initial delay
      }
    } catch (err) {
      console.warn("sessionStorage read error:", err);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  const whatsappMessage = encodeURIComponent(
    "Hi Béné Decor, I'm interested in your furniture."
  );
  const whatsappUrl = `https://wa.me/919928348586?text=${whatsappMessage}`;

  return (
    <div
      role="region"
      aria-label="Promotional Notification"
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[90] w-auto max-w-[360px] sm:w-[350px] bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E5E5E5] shadow-2xl transition-all duration-300 ease-out transform ${
        isClosing || !isOpen
          ? "translate-y-8 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      {/* Top-Right Close Button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close promotion"
        className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E5E5] text-[#666666] hover:bg-[#A67C52] hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Card Layout */}
      <div className="flex items-start gap-3">
        {/* Left Furniture Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E5E5E5]/80">
          <Image
            src="/images/collections/sofa.jpg"
            alt="Bene Decor Furniture"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Copy & Action Buttons */}
        <div className="flex flex-col flex-1 pr-4 gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
            SPECIAL OFFER
          </span>
          <h4 className="font-[family-name:var(--font-playfair)] font-bold text-sm text-[#1F1F1F] leading-tight">
            Looking for Furniture?
          </h4>
          <p className="text-[11px] text-[#666666] leading-snug line-clamp-2">
            Get a personalized quote or browse handcrafted solid wood pieces.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-2">
            <Link
              href="/shop"
              onClick={handleClose}
              className="px-3 py-1.5 rounded-lg bg-[#A67C52] text-white text-[11px] font-bold hover:bg-[#8e6843] transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Shop Now</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#20bd5a] transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
