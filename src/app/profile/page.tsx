"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "Vikram Malhotra",
    email: "vikram.malhotra@example.com",
    phone: "+91 98765 43210",
    gender: "Male",
    dob: "14 August 1992",
    addressLine: "1402 Horizon Towers, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    country: "India",
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              ACCOUNT OVERVIEW
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              My Profile
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Manage your personal information and account settings.
            </p>
          </div>

          {/* Top Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Total Orders
              </span>
              <span className="font-bold text-2xl text-[#1F1F1F]">4</span>
              <span className="text-[11px] text-[#A67C52]">2 Active Deliveries</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Wishlist Items
              </span>
              <span className="font-bold text-2xl text-[#1F1F1F]">3</span>
              <span className="text-[11px] text-[#A67C52]">Saved Pieces</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Cart Items
              </span>
              <span className="font-bold text-2xl text-[#1F1F1F]">2</span>
              <span className="text-[11px] text-[#A67C52]">Ready to Checkout</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Total Saved
              </span>
              <span className="font-bold text-2xl text-[#16A34A]">₹48,500</span>
              <span className="text-[11px] text-[#16A34A]">Exclusive Member Savings</span>
            </div>
          </div>

          {/* Main Layout (Profile Details + Quick Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Personal Info & Shipping Address */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Profile Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4">
                  <div className="flex items-center gap-4">
                    {/* Placeholder Avatar */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#A67C52] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white ring-2 ring-[#A67C52]/20">
                      VM
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                        {userInfo.fullName}
                      </h2>
                      <span className="text-xs text-[#A67C52] font-semibold uppercase tracking-wider">
                        Premium Member
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>

                {/* Personal Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Full Name</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.fullName}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Email Address</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.email}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Phone Number</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.phone}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Gender</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.gender}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50 sm:col-span-2">
                    <span className="text-xs text-[#666666]">Date of Birth</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.dob}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                      Default Shipping Address
                    </h2>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                    Primary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50 sm:col-span-2">
                    <span className="text-xs text-[#666666]">Full Address</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.addressLine}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">City</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.city}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">State</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.state}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Pincode</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.pincode}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Country</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">
                      {userInfo.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6 w-full">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
                Quick Actions
              </h2>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-between text-left"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <span>Edit Profile Details</span>
                  <span>✏️</span>
                </Button>

                <Link href="/orders" className="w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-between text-left"
                  >
                    <span>My Orders History</span>
                    <span>📦</span>
                  </Button>
                </Link>

                <Link href="/wishlist" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between text-left"
                  >
                    <span>My Wishlist</span>
                    <span>❤️</span>
                  </Button>
                </Link>

                <Link href="/cart" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between text-left"
                  >
                    <span>Shopping Cart</span>
                    <span>🛒</span>
                  </Button>
                </Link>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-between text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => alert("Logged out successfully.")}
                  >
                    <span>Logout</span>
                    <span>🚪</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Edit Profile Demo Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-lg font-bold text-[#666666] hover:text-[#1F1F1F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, fullName: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userInfo.phone}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                  Address
                </label>
                <input
                  type="text"
                  value={userInfo.addressLine}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, addressLine: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
