"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import CheckoutForm, {
  CheckoutFormData,
} from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { PRODUCTS_DATA } from "@/data/products";

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    paymentMethod: "card",
  });

  // Reusing Cart Items (Products 1 and 3 from PRODUCTS_DATA)
  const checkoutItems = [
    { product: PRODUCTS_DATA[0], quantity: 1 },
    { product: PRODUCTS_DATA[2], quantity: 2 },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              FINAL STEP
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Checkout
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Complete your order securely.
            </p>
          </div>

          {/* Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Left Column: Billing & Payment Form */}
            <div className="lg:col-span-2 w-full">
              <CheckoutForm formData={formData} setFormData={setFormData} />
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="w-full">
              <CheckoutSummary items={checkoutItems} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
