"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import NavLinks from "../ui/NavLinks";
import SearchBar from "../ui/SearchBar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-sm">
      <Container className="flex items-center justify-between h-[88px]">
        {/* Logo Link */}
        <Link href="/" className="flex items-center shrink-0">
          <Logo width={60} height={60} priority />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <NavLinks direction="row" />
        </div>

        {/* Right Section: Search Bar & Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Bar */}
          <div className="hidden md:block w-[280px] lg:w-[320px]">
            <SearchBar placeholder="Search furniture..." />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#1F1F1F]">
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 transition-colors duration-300 hover:text-[#A67C52] cursor-pointer relative"
              title="Wishlist"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </Link>

            {/* User Account Icon */}
            <Link
              href="/profile"
              aria-label="User Account"
              className="p-2 transition-colors duration-300 hover:text-[#A67C52] cursor-pointer"
              title="My Account"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="p-2 transition-colors duration-300 hover:text-[#A67C52] cursor-pointer relative"
              title="Shopping Cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                />
              </svg>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="p-2 text-[#1F1F1F] hover:text-[#A67C52] lg:hidden cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E5E5] bg-white p-6 shadow-lg animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col gap-6">
            <SearchBar placeholder="Search furniture..." />
            <NavLinks direction="column" />
          </div>
        </div>
      )}
    </header>
  );
}
