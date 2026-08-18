"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { Product } from "@/data/products";

interface CheckoutSummaryProps {
  items: { product: Product; quantity: number }[];
}

export default function CheckoutSummary({ items }: CheckoutSummaryProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceNumeric * item.quantity,
    0
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "BENEDECOR10") {
      setAppliedCoupon("BENEDECOR10 (₹1,000 OFF)");
      setCouponDiscount(1000);
    } else {
      alert("Invalid coupon code. Try 'BENEDECOR10'");
    }
  };

  const grandTotal = Math.max(0, subtotal - couponDiscount);

  const handlePlaceOrder = () => {
    router.push("/order-success");
  };

  return (
    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm self-start w-full">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
        Order Summary
      </h2>

      {/* Product List */}
      <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-3 pb-3 border-b border-[#E5E5E5]/50"
          >
            <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col flex-1 gap-0.5">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-sm text-[#1F1F1F] line-clamp-1">
                {product.name}
              </h3>
              <span className="text-xs text-[#666666]">Qty: {quantity}</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-bold text-sm text-[#1F1F1F]">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-[11px] text-[#666666] line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code Input */}
      <form
        onSubmit={handleApplyCoupon}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          placeholder="Promo code (e.g. BENEDECOR10)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] uppercase tracking-wider bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
        />
        <Button variant="secondary" size="sm" type="submit">
          Apply
        </Button>
      </form>
      {appliedCoupon && (
        <span className="text-xs font-semibold text-[#16A34A] -mt-3">
          ✓ Coupon applied: {appliedCoupon}
        </span>
      )}

      {/* Totals Breakdown */}
      <div className="flex flex-col gap-3 text-sm text-[#666666] border-t border-[#E5E5E5] pt-4">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-[#1F1F1F]">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-[#16A34A]">
            <span>Promo Code Discount</span>
            <span className="font-semibold">− ₹{couponDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping &amp; Handling</span>
          <span className="font-semibold text-[#16A34A]">FREE</span>
        </div>

        <div className="flex justify-between">
          <span>Estimated GST (18%)</span>
          <span className="font-medium text-[#1F1F1F]">Included</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-[#E5E5E5] pt-4 flex justify-between items-baseline">
        <span className="font-bold text-lg text-[#1F1F1F]">Total Amount</span>
        <div className="flex flex-col items-end">
          <span className="font-bold text-2xl text-[#1F1F1F]">
            ₹{grandTotal.toLocaleString()}
          </span>
          <span className="text-xs text-[#666666]">All taxes included</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handlePlaceOrder}
        className="w-full text-base py-4 font-bold tracking-wide shadow-md hover:shadow-lg"
      >
        Place Order Securely
      </Button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-[#666666] pt-2">
        <span>🔒 256-Bit Encryption</span>
        <span>•</span>
        <span>🚚 Free Insured Transit</span>
      </div>
    </div>
  );
}
