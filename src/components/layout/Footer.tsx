"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "../ui/Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowToast(true);
      setEmail("");
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-white text-[#1F1F1F] border-t border-[#E5E5E5] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] relative z-10">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section: 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Column 1: Brand Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Logo width={50} height={50} className="group-hover:scale-105 transition-transform duration-300" />
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-playfair)] font-bold text-xl sm:text-2xl text-[#1F1F1F] tracking-tight group-hover:text-[#A67C52] transition-colors">
                  Béné Decor
                </span>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#A67C52] -mt-1">
                  Luxury Living
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Bene Decor crafts premium solid wood furniture with timeless elegance, combining luxury, craftsmanship, and comfort for modern Indian homes.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]/60 w-fit">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#666666]">
              <li>
                <Link href="/" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Shop
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Collections
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Custom Furniture
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]/60 w-fit">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#666666]">
              <li>
                <Link href="/shop?category=LIVING ROOM" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Living Room
                </Link>
              </li>
              <li>
                <Link href="/shop?category=DINING" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Dining
                </Link>
              </li>
              <li>
                <Link href="/shop?category=BEDROOM" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Bedroom
                </Link>
              </li>
              <li>
                <Link href="/shop?category=OFFICE" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Office
                </Link>
              </li>
              <li>
                <Link href="/shop?category=STORAGE" className="hover:text-[#A67C52] hover:translate-x-1 transition-all duration-300 inline-block">
                  • Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]/60 w-fit">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#666666]">
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#A67C52] shrink-0 font-bold">📍</span>
                <span>
                  Bene Decor Furniture<br />
                  Sitapura, Jaipur, Rajasthan, India
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#A67C52] shrink-0 font-bold">📞</span>
                <a href="tel:+919876543210" className="hover:text-[#A67C52] transition-colors font-medium">
                  +91 98765 43210
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#A67C52] shrink-0 font-bold">📧</span>
                <a href="mailto:support@benedecor.com" className="hover:text-[#A67C52] transition-colors font-medium">
                  support@benedecor.com
                </a>
              </p>
              <p className="flex items-center gap-2 text-xs">
                <span className="text-[#A67C52] shrink-0 font-bold">🕒</span>
                <span>Mon–Sat 10:00 AM – 7:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Bar */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E5E5E5]/80 flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          {/* Newsletter Form */}
          <div className="flex flex-col gap-2 w-full lg:max-w-xl">
            <h4 className="font-[family-name:var(--font-playfair)] font-bold text-lg sm:text-xl text-[#1F1F1F]">
              Subscribe to our Newsletter
            </h4>
            <p className="text-xs text-[#666666]">
              Receive curated interior inspiration, early access to sales, and luxury furniture guides.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-white focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#A67C52] text-white text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#8e6843] transition-all duration-300 shadow-sm shrink-0"
              >
                Subscribe
              </button>
            </form>

            {showToast && (
              <span className="text-xs font-semibold text-[#16A34A] animate-[fadeIn_0.3s_ease-out] mt-1">
                ✓ Thank you for subscribing to Bené Decor Newsletter!
              </span>
            )}
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52]">
              Follow Us:
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bene_decor_india?igsh=ZG1zeWFnZXo3Z2xh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#1F1F1F] hover:text-[#A67C52] hover:border-[#A67C52] hover:scale-110 shadow-sm transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook (Placeholder) */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook (Coming Soon)"
                title="Facebook (Coming Soon)"
                className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#666666]/60 hover:text-[#A67C52] hover:border-[#A67C52] hover:scale-110 shadow-sm transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/bene-decor-b946222a5?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#1F1F1F] hover:text-[#A67C52] hover:border-[#A67C52] hover:scale-110 shadow-sm transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube (Placeholder) */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube (Coming Soon)"
                title="YouTube (Coming Soon)"
                className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#666666]/60 hover:text-[#A67C52] hover:border-[#A67C52] hover:scale-110 shadow-sm transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <span>© 2026 Bene Decor. All Rights Reserved.</span>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/faq" className="hover:text-[#A67C52] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#A67C52] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#A67C52] transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#A67C52] transition-colors">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
