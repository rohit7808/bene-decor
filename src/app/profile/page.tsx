"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface SavedAddress {
  _id?: string;
  id?: string;
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuth();

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Address Management State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Protected Route Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Fetch saved addresses from GET /api/user/addresses
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/user/addresses", { credentials: "same-origin" });
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error("Fetch saved addresses error:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Handle Profile Form Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    try {
      setIsSubmittingProfile(true);
      setProfileSuccessMsg(null);

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProfileSuccessMsg("Profile details saved successfully!");
        setTimeout(() => setProfileSuccessMsg(null), 3000);
        setIsEditProfileOpen(false);
        checkAuth();
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("An error occurred while updating profile.");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Open Add / Edit Address Modal
  const openAddressModal = (addr?: SavedAddress) => {
    setAddressError(null);
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        fullName: addr.fullName || user?.name || "",
        phone: addr.phone || user?.phone || "",
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        country: addr.country || "India",
        isDefault: !!addr.isDefault,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        fullName: user?.name || "",
        phone: user?.phone || "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: addresses.length === 0,
      });
    }
    setIsAddressModalOpen(true);
  };

  // Handle Address Submit (Create or Update)
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      setAddressError("Please fill in all required address fields.");
      return;
    }

    if (!/^\d{6}$/.test(addressForm.pincode.trim())) {
      setAddressError("Pincode must be a valid 6-digit number.");
      return;
    }

    try {
      setIsSubmittingAddress(true);
      setAddressError(null);

      const endpoint = editingAddress?._id
        ? `/api/user/addresses/${editingAddress._id}`
        : "/api/user/addresses";

      const method = editingAddress?._id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();

      if (data.success) {
        setToastMessage(editingAddress ? "✓ Address updated successfully!" : "✓ New address added!");
        setTimeout(() => setToastMessage(null), 3000);
        setIsAddressModalOpen(false);
        fetchAddresses();
      } else {
        setAddressError(data.error || "Failed to save address.");
      }
    } catch (err) {
      console.error("Address save error:", err);
      setAddressError("An unexpected error occurred while saving address.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (addrId?: string) => {
    if (!addrId) return;
    if (!confirm("Are you sure you want to delete this shipping address?")) return;

    try {
      const res = await fetch(`/api/user/addresses/${addrId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const data = await res.json();

      if (data.success) {
        setToastMessage("✓ Address removed.");
        setTimeout(() => setToastMessage(null), 3000);
        fetchAddresses();
      } else {
        alert(data.error || "Failed to delete address.");
      }
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  // Handle Set Default Address
  const handleSetDefault = async (addrId?: string) => {
    if (!addrId) return;

    try {
      const res = await fetch(`/api/user/addresses/${addrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ isDefault: true }),
      });

      const data = await res.json();

      if (data.success) {
        setToastMessage("✓ Set as default shipping address.");
        setTimeout(() => setToastMessage(null), 3000);
        fetchAddresses();
      }
    } catch (err) {
      console.error("Set default address error:", err);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F]">
        <Navbar />
        <Container>
          <div className="py-20 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Verifying profile authorization...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
          <span>{toastMessage}</span>
        </div>
      )}

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
              Manage your personal details, phone number, and saved shipping addresses.
            </p>
          </div>

          {/* Top Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Account Role
              </span>
              <span className="font-bold text-xl uppercase text-[#1F1F1F]">{user.role}</span>
              <span className="text-[11px] text-[#A67C52]">BenéDecor Member</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Saved Addresses
              </span>
              <span className="font-bold text-2xl text-[#1F1F1F]">{addresses.length}</span>
              <span className="text-[11px] text-[#A67C52]">Shipping Locations</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Security
              </span>
              <span className="font-bold text-xl text-[#16A34A]">VERIFIED</span>
              <span className="text-[11px] text-[#16A34A]">JWT Auth Cookie</span>
            </div>

            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
                Account Status
              </span>
              <span className="font-bold text-xl text-[#16A34A]">ACTIVE</span>
              <span className="text-[11px] text-[#16A34A]">Authenticated Customer</span>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Personal Profile & Address List */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Profile Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#A67C52] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white ring-2 ring-[#A67C52]/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                        {user.name}
                      </h2>
                      <span className="text-xs text-[#A67C52] font-semibold uppercase tracking-wider">
                        {user.role} Account
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    ✓ {profileSuccessMsg}
                  </div>
                )}

                {/* Profile Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Full Name</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">{user.name}</span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Email Address</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">{user.email}</span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Phone Number</span>
                    <span className="font-semibold text-[#1F1F1F] mt-0.5">{user.phone || "Not set"}</span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                    <span className="text-xs text-[#666666]">Role</span>
                    <span className="font-semibold uppercase text-[#1F1F1F] mt-0.5">{user.role}</span>
                  </div>
                </div>
              </div>

              {/* Module 2: Saved Shipping Addresses List */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                      Saved Shipping Addresses ({addresses.length})
                    </h2>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openAddressModal()}
                    className="cursor-pointer"
                  >
                    + Add New Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-8 text-center text-xs sm:text-sm text-[#666666] flex flex-col items-center gap-3 border border-dashed border-[#E5E5E5] rounded-2xl">
                    <span className="text-3xl">🏠</span>
                    <span className="font-bold text-[#1F1F1F]">No Saved Addresses</span>
                    <span>Add a shipping address for faster checkout.</span>
                    <Button variant="outline" size="sm" onClick={() => openAddressModal()}>
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      return (
                        <div
                          key={addrId || Math.random()}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                            addr.isDefault
                              ? "bg-[#FAF8F5] border-[#A67C52] shadow-sm"
                              : "bg-white border-[#E5E5E5] hover:border-[#A67C52]/50"
                          }`}
                        >
                          <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1F1F1F]">
                                {addr.fullName || user.name}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A67C52] text-white">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#666666] leading-relaxed mt-1">{addr.street}</p>
                            <p className="text-[#666666] font-semibold">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-[#666666]">{addr.country}</p>
                            <p className="text-[#A67C52] font-semibold mt-1">
                              📞 {addr.phone || user.phone || "N/A"}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#E5E5E5]/60 flex items-center justify-between gap-2 text-xs">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefault(addrId)}
                                className="text-[11px] font-bold text-[#A67C52] hover:underline cursor-pointer"
                              >
                                Set as Default
                              </button>
                            )}

                            <div className="flex items-center gap-2 ml-auto">
                              <button
                                type="button"
                                onClick={() => openAddressModal(addr)}
                                className="px-2.5 py-1 rounded-lg border border-[#E5E5E5] text-[#1F1F1F] hover:border-[#A67C52] font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addrId)}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-semibold hover:bg-rose-100 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Quick Navigation Links */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6 w-full">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
                Account Shortcuts
              </h2>

              <div className="flex flex-col gap-3">
                <Link href="/orders" className="w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-between text-left cursor-pointer"
                  >
                    <span>My Orders History</span>
                    <span>📦</span>
                  </Button>
                </Link>

                <Link href="/wishlist" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between text-left cursor-pointer"
                  >
                    <span>My Wishlist</span>
                    <span>❤️</span>
                  </Button>
                </Link>

                <Link href="/cart" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between text-left cursor-pointer"
                  >
                    <span>Shopping Cart</span>
                    <span>🛒</span>
                  </Button>
                </Link>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-between text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                    onClick={() => logout()}
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

      {/* Edit Profile Details Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Edit Personal Info
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-lg font-bold text-[#666666] hover:text-[#1F1F1F] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F1F1F]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F1F1F]">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                {editingAddress ? "Edit Shipping Address" : "Add Shipping Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-lg font-bold text-[#666666] hover:text-[#1F1F1F] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                ✕ {addressError}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">Recipient Full Name</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder={user.name}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">Contact Phone</label>
                  <input
                    type="text"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder={user.phone || "+91..."}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="font-bold text-[#1F1F1F]">Street / Flat / Area *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="e.g. 1402 Horizon Towers, Bandra West"
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">6-Digit Pincode *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="e.g. 400050"
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer font-semibold text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E5E5]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddressModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmittingAddress}>
                  {isSubmittingAddress ? "Saving Address..." : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
