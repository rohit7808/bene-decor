"use client";

import React from "react";
import Input from "../ui/Input";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

export default function CheckoutForm({
  formData,
  setFormData,
}: CheckoutFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-8 text-[#1F1F1F]">
      {/* Contact & Personal Information */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#A67C52] text-white text-sm font-bold">
            1
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Full Name *
            </label>
            <Input
              name="fullName"
              placeholder="e.g. Vikram Malhotra"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Email Address *
            </label>
            <Input
              type="email"
              name="email"
              placeholder="vikram@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Phone Number *
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#A67C52] text-white text-sm font-bold">
            2
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            Shipping Address
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Address Line 1 *
            </label>
            <Input
              name="addressLine1"
              placeholder="House/Flat No., Building Name, Street"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Address Line 2 (Optional)
            </label>
            <Input
              name="addressLine2"
              placeholder="Landmark, Area, Suite"
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              City *
            </label>
            <Input
              name="city"
              placeholder="Mumbai / New Delhi"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              State *
            </label>
            <Input
              name="state"
              placeholder="Maharashtra"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Pincode *
            </label>
            <Input
              name="pincode"
              placeholder="400001"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Country *
            </label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#A67C52] text-white text-sm font-bold">
            3
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            Payment Method
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* Credit / Debit Card */}
          <label
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
            }
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.paymentMethod === "card"
                ? "border-[#A67C52] bg-[#FAF8F5]"
                : "border-[#E5E5E5] bg-white hover:border-[#A67C52]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={formData.paymentMethod === "card"}
                onChange={() => {}}
                className="w-4 h-4 accent-[#A67C52]"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#1F1F1F]">
                  Credit / Debit Card
                </span>
                <span className="text-xs text-[#666666]">
                  Visa, Mastercard, RuPay, Amex
                </span>
              </div>
            </div>
            <span className="text-xl">💳</span>
          </label>

          {/* UPI */}
          <label
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "upi" }))
            }
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.paymentMethod === "upi"
                ? "border-[#A67C52] bg-[#FAF8F5]"
                : "border-[#E5E5E5] bg-white hover:border-[#A67C52]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={formData.paymentMethod === "upi"}
                onChange={() => {}}
                className="w-4 h-4 accent-[#A67C52]"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#1F1F1F]">
                  UPI / QR Code
                </span>
                <span className="text-xs text-[#666666]">
                  Google Pay, PhonePe, Paytm, BHIM
                </span>
              </div>
            </div>
            <span className="text-xl">📱</span>
          </label>

          {/* Net Banking */}
          <label
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "netbanking" }))
            }
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.paymentMethod === "netbanking"
                ? "border-[#A67C52] bg-[#FAF8F5]"
                : "border-[#E5E5E5] bg-white hover:border-[#A67C52]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={formData.paymentMethod === "netbanking"}
                onChange={() => {}}
                className="w-4 h-4 accent-[#A67C52]"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#1F1F1F]">
                  Net Banking
                </span>
                <span className="text-xs text-[#666666]">
                  All Major Indian Banks
                </span>
              </div>
            </div>
            <span className="text-xl">🏦</span>
          </label>
        </div>
      </div>
    </div>
  );
}
