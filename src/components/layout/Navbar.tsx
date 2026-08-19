"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import NavLinks from "../ui/NavLinks";
import SearchBar from "../ui/SearchBar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  const { cart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = headerSearchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-sm">
      <Container className="flex items-center justify-between h-[88px]">
        {/* Logo & Brand Name Link */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Logo width={52} height={52} priority />
          <span className="font-[family-name:var(--font-playfair)] font-bold text-xl sm:text-2xl text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors select-none tracking-tight">
            Bene Decor
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <NavLinks direction="row" />
        </div>

        {/* Right Section: Search Bar & Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Bar */}
          <form onSubmit={handleHeaderSearch} className="hidden md:block w-[260px] lg:w-[300px]">
            <SearchBar
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Search furniture..."
            />
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#1F1F1F]">
            {/* Wishlist Icon with Live Count Badge */}
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

              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#A67C52] text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-[fadeIn_0.2s_ease-out]">
                  {totalWishlistItems > 99 ? "99+" : totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon with Live Count Badge */}
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

              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#A67C52] text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-[fadeIn_0.2s_ease-out]">
                  {cart.totalItems > 99 ? "99+" : cart.totalItems}
                </span>
              )}
            </Link>

            {/* Authenticated Profile Dropdown OR Login/Register Links */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  title="My Account"
                >
                  <div className="w-8 h-8 rounded-full bg-[#A67C52] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  aria-label="User Account"
                  className="p-2 transition-colors duration-300 hover:text-[#A67C52] cursor-pointer flex items-center gap-1.5"
                  title="Log In"
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
                  <span className="hidden sm:inline text-xs font-semibold text-[#1F1F1F] hover:text-[#A67C52]">
                    Log In
                  </span>
                </Link>
              )}

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E5E5E5] shadow-xl py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                  <div className="px-4 py-3 border-b border-[#E5E5E5] flex flex-col">
                    <span className="font-bold text-sm text-[#1F1F1F] truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-[#666666] truncate">{user.email}</span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] hover:text-[#A67C52] flex items-center justify-between transition-colors"
                  >
                    <span>My Profile</span>
                    <span>👤</span>
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] hover:text-[#A67C52] flex items-center justify-between transition-colors"
                  >
                    <span>My Orders</span>
                    <span>📦</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] hover:text-[#A67C52] flex items-center justify-between transition-colors"
                  >
                    <span>My Wishlist</span>
                    <span>❤️</span>
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold text-[#A67C52] hover:bg-[#FAF8F5] flex items-center justify-between transition-colors border-t border-[#E5E5E5]/60"
                    >
                      <span>Admin Dashboard</span>
                      <span>⚙️</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-between transition-colors border-t border-[#E5E5E5]"
                  >
                    <span>Log Out</span>
                    <span>🚪</span>
                  </button>
                </div>
              )}
            </div>

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
            <form
              onSubmit={(e) => {
                handleHeaderSearch(e);
                setIsMobileMenuOpen(false);
              }}
            >
              <SearchBar
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Search furniture..."
              />
            </form>
            <NavLinks direction="column" />

            {!isAuthenticated && (
              <div className="flex items-center gap-3 pt-4 border-t border-[#E5E5E5]">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] text-center"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-semibold text-center shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
