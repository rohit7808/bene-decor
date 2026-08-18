"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  { name: "Products", href: "/admin/products", icon: "🛋️" },
  { name: "Orders", href: "/admin/orders", icon: "📦" },
  { name: "Customers", href: "/admin/customers", icon: "👥" },
  { name: "Categories", href: "/admin/categories", icon: "🏷️" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Enforce server & client admin route protection
  useEffect(() => {
    if (isLoginPage) return;

    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/admin/login");
      } else if (user.role !== "admin") {
        router.push("/profile");
      }
    }
  }, [pathname, isLoginPage, isLoading, isAuthenticated, user, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/admin/login");
    } catch (error) {
      console.error("Admin Logout Error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#1F1F1F]">
        <div className="flex flex-col items-center gap-3 animate-pulse text-center">
          <div className="w-12 h-12 rounded-full bg-[#A67C52]/20 text-[#A67C52] flex items-center justify-center font-bold text-xl">
            👑
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            BENÉ DECOR ADMIN
          </span>
          <p className="text-xs text-[#666666]">
            Verifying administrator authorization credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-white border border-[#E5E5E5] text-center flex flex-col items-center gap-4 max-w-md shadow-lg">
          <span className="text-4xl">🔐</span>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
            Authentication Required
          </h2>
          <p className="text-xs text-[#666666]">
            Please log in with administrator privileges to access the Bené Decor Admin Control Panel.
          </p>
          <Link
            href="/admin/login"
            className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs shadow-md hover:bg-[#8e6843] transition-colors"
          >
            Go to Admin Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F] flex flex-col font-[family-name:var(--font-inter)]">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] shadow-sm h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-[#1F1F1F] hover:text-[#A67C52] rounded-lg cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo width={40} height={40} />
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] leading-none">
                Bené Decor
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A67C52]">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#A67C52] transition-colors bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#E5E5E5]"
          >
            <span>🌐</span>
            <span>View Storefront</span>
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-[#E5E5E5]">
            <div className="w-8 h-8 rounded-full bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-[#1F1F1F]">{user.name}</span>
              <span className="text-[10px] text-[#666666]">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-2"
              title="Logout"
            >
              {isLoggingOut ? "..." : "Logout 🚪"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-16 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E5E5] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A67C52] px-3 mb-1">
              Main Menu
            </span>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#A67C52] text-white font-semibold shadow-sm"
                      : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#1F1F1F]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-[#E5E5E5] bg-[#FAF8F5]">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#1F1F1F]">Bené Decor Admin</span>
              <span className="text-[11px] text-[#A67C52]">Protected Mode Active</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
