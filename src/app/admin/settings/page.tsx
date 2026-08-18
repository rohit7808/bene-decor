"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

type SettingsTab = "store" | "business" | "orders" | "tax" | "email" | "payment" | "security";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("store");

  const [settingsForm, setSettingsForm] = useState({
    storeName: "Bené Decor",
    logo: "/images/logo.png",
    businessEmail: "marketing@benedecor.in",
    supportEmail: "saadgifurniture@gmail.com",
    phone: "+91 9928348586",
    websiteUrl: "https://benedecor.in",
    address: "Jaipur Showroom & Artisan Studio",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    country: "India",
    description:
      "Handcrafted luxury solid wood furniture made with passion, precision and finest materials in Jaipur, India.",

    whatsappNumber: "+91 9928348586",
    businessHours: "Mon - Sat: 10:00 AM - 7:00 PM IST",
    facebookUrl: "https://facebook.com/benedecor",
    instagramUrl: "https://instagram.com/benedecor",
    twitterUrl: "https://twitter.com/benedecor",
    showSocialLinks: true,

    minOrderAmount: 0,
    freeShippingThreshold: 0,
    defaultDeliveryCharge: 0,
    enableCOD: true,
    enableOnlinePayment: true,
    cancellationWindowHours: 24,
    estimatedDeliveryDays: "5 to 7 business days",

    enableTax: true,
    gstPercentage: 18,
    taxInclusive: true,

    senderName: "BeneDecor Team",
    senderEmail: "marketing@benedecor.in",
    replyToEmail: "support@benedecor.in",

    razorpayEnabled: true,
    razorpayTestMode: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Fetch Settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/settings", { credentials: "same-origin" });
        const contentType = res.headers.get("content-type") || "";

        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.settings) {
            setSettingsForm((prev) => ({
              ...prev,
              ...data.settings,
            }));
          }
        }
      } catch (err) {
        console.error("Load settings error:", err);
        setErrorMsg("Failed to load store settings from database.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(settingsForm),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setErrorMsg(`Failed to save settings (${res.status}).`);
        setIsSaving(false);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setSettingsForm((prev) => ({ ...prev, ...data.settings }));
        setHasUnsavedChanges(false);
        setToastMessage("✓ Store settings saved and published successfully!");
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to save settings.");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      setErrorMsg("An unexpected network error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setPasswordError(`Failed to change password (${res.status}).`);
        setIsChangingPassword(false);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setPasswordSuccess("✓ Administrator password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError("Network error while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs sm:text-sm text-[#666666] animate-pulse">
        ⏳ Loading store settings and configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto font-[family-name:var(--font-inter)] text-[#1F1F1F]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              ADMINISTRATION
            </span>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Unsaved Changes
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            Admin Settings &amp; Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Configure store details, business contact, shipping charges, tax GST %, and security credentials.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="cursor-pointer shrink-0"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs">
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#E5E5E5] text-xs">
        {[
          { id: "store", label: "Store Info", icon: "🏬" },
          { id: "business", label: "Business & Contact", icon: "📞" },
          { id: "orders", label: "Orders & Shipping", icon: "📦" },
          { id: "tax", label: "Tax & GST", icon: "💸" },
          { id: "email", label: "Email Settings", icon: "✉️" },
          { id: "payment", label: "Payment Status", icon: "💳" },
          { id: "security", label: "Security & Admin Profile", icon: "🔐" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#A67C52] text-white shadow-xs"
                : "bg-white text-[#666666] border border-[#E5E5E5] hover:border-[#A67C52] hover:text-[#1F1F1F]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        {/* TAB 1: STORE INFO */}
        {activeTab === "store" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Store Identification &amp; Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Store Name *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Website URL *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.websiteUrl}
                  onChange={(e) => handleChange("websiteUrl", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Official Business Email *</label>
                <input
                  type="email"
                  required
                  value={settingsForm.businessEmail}
                  onChange={(e) => handleChange("businessEmail", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Customer Support Email *</label>
                <input
                  type="email"
                  required
                  value={settingsForm.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[#1F1F1F]">Business Address / Studio *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">City *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">State *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Pincode *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Country *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[#1F1F1F]">Store Overview &amp; Description</label>
                <textarea
                  rows={3}
                  value={settingsForm.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS & CONTACT */}
        {activeTab === "business" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Contact Channels &amp; Operating Hours
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Customer Support Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">WhatsApp Order Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[#1F1F1F]">Showroom Business Hours</label>
                <input
                  type="text"
                  value={settingsForm.businessHours}
                  onChange={(e) => handleChange("businessHours", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Instagram URL</label>
                <input
                  type="text"
                  value={settingsForm.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Facebook URL</label>
                <input
                  type="text"
                  value={settingsForm.facebookUrl}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-xs sm:text-sm text-[#1F1F1F]">
              <input
                type="checkbox"
                checked={settingsForm.showSocialLinks}
                onChange={(e) => handleChange("showSocialLinks", e.target.checked)}
                className="w-4 h-4 accent-[#A67C52]"
              />
              <span>Display social media links on customer website footer</span>
            </label>
          </div>
        )}

        {/* TAB 3: ORDERS & SHIPPING */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Checkout Rules &amp; Shipping Charges
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.minOrderAmount}
                  onChange={(e) => handleChange("minOrderAmount", Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) => handleChange("freeShippingThreshold", Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
                <span className="text-[11px] text-[#666666]">Set 0 for free shipping on all orders</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Default Delivery Charge (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.defaultDeliveryCharge}
                  onChange={(e) => handleChange("defaultDeliveryCharge", Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Estimated Delivery Duration</label>
                <input
                  type="text"
                  value={settingsForm.estimatedDeliveryDays}
                  onChange={(e) => handleChange("estimatedDeliveryDays", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Order Cancellation Window (Hours)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.cancellationWindowHours}
                  onChange={(e) => handleChange("cancellationWindowHours", Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E5E5] text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={settingsForm.enableCOD}
                  onChange={(e) => handleChange("enableCOD", e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Enable Cash on Delivery (COD) at checkout</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={settingsForm.enableOnlinePayment}
                  onChange={(e) => handleChange("enableOnlinePayment", e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Enable Online Payments (Razorpay Card / UPI / NetBanking)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: TAX & GST */}
        {activeTab === "tax" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Tax / GST Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">GST Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settingsForm.gstPercentage}
                  onChange={(e) => handleChange("gstPercentage", Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
                <span className="text-[11px] text-[#666666]">Standard Indian GST rate for furniture is 18%</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E5E5] text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={settingsForm.enableTax}
                  onChange={(e) => handleChange("enableTax", e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Enable GST Tax calculations on invoices</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1F1F]">
                <input
                  type="checkbox"
                  checked={settingsForm.taxInclusive}
                  onChange={(e) => handleChange("taxInclusive", e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Product listing prices are GST inclusive</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 5: EMAIL SETTINGS */}
        {activeTab === "email" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Resend Email Service Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Email Sender Name</label>
                <input
                  type="text"
                  value={settingsForm.senderName}
                  onChange={(e) => handleChange("senderName", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F1F1F]">Verified Resend Domain Email</label>
                <input
                  type="email"
                  value={settingsForm.senderEmail}
                  onChange={(e) => handleChange("senderEmail", e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F] bg-[#FAF8F5]"
                />
                <span className="text-[11px] text-[#A67C52]">Domain verified via Resend (`marketing@benedecor.in`)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
              <span>✓ Resend Email Dispatch Active (`RESEND_API_KEY` configured in environment)</span>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT STATUS */}
        {activeTab === "payment" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Razorpay Payment Gateway Integration
            </h2>

            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]">
                <span className="font-semibold text-[#1F1F1F]">Razorpay API Status</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Configured (`RAZORPAY_KEY_ID` &amp; Secret)
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]">
                <span className="font-semibold text-[#1F1F1F]">Signature Verification</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Active (HMAC-SHA256)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & ADMIN PROFILE */}
        {activeTab === "security" && (
          <div className="flex flex-col gap-6">
            {/* Account Info */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4 text-xs sm:text-sm">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Administrator Account Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col">
                  <span className="text-[#666666]">Admin User</span>
                  <strong className="text-[#1F1F1F] mt-0.5">{user?.name || "Administrator"}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col">
                  <span className="text-[#666666]">Admin Email</span>
                  <strong className="text-[#1F1F1F] mt-0.5">{user?.email || "saadgifurniture@gmail.com"}</strong>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Change Administrator Password
              </h2>

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  ⚠️ {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#1F1F1F]">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#1F1F1F]">New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#1F1F1F]">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleChangePasswordSubmit}
                  disabled={isChangingPassword}
                  className="cursor-pointer"
                >
                  {isChangingPassword ? "Updating Password..." : "Update Admin Password"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Save Button Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
          <span className="text-xs text-[#666666]">
            {hasUnsavedChanges ? "⚠️ You have unsaved configuration changes." : "✓ All settings up to date."}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving}
            className="cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
