"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import CartEmpty from "@/components/cart/CartEmpty";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-[#E5E5E5]/80 animate-pulse flex flex-col sm:flex-row items-center gap-4 h-32"
          >
            <div className="w-24 h-24 bg-zinc-200 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2 w-full">
              <div className="h-4 w-1/4 bg-zinc-200 rounded" />
              <div className="h-5 w-1/2 bg-zinc-200 rounded" />
              <div className="h-4 w-1/3 bg-zinc-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-80 bg-zinc-100 rounded-2xl animate-pulse" />
    </div>
  );
}

export default function CartPage() {
  const {
    cart,
    isLoading,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              YOUR SELECTION
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Shopping Cart
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Review your selected handcrafted furniture before checkout.
            </p>
          </div>

          {/* Cart Content */}
          {isLoading ? (
            <CartSkeleton />
          ) : cart.items.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <span className="text-sm font-medium text-[#666666]">
                    Showing <strong>{cart.totalItems}</strong> item(s) in your cart
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart Item Cards */}
                <div className="flex flex-col gap-4">
                  {cart.items.map((item) => {
                    const itemSubtotal = item.price * item.quantity;
                    const formattedPrice = `₹${item.price.toLocaleString("en-IN")}`;
                    const formattedSubtotal = `₹${itemSubtotal.toLocaleString("en-IN")}`;
                    const itemKey = `${item.productId}_${item.variantId || "base"}`;

                    return (
                      <div
                        key={itemKey}
                        className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-md transition-all duration-300 gap-4"
                      >
                        {/* Image & Main Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Link
                            href={`/product/${item.productId}`}
                            className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5]"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="120px"
                              className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          </Link>

                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                              Bené Decor
                            </span>

                            <Link
                              href={`/product/${item.productId}`}
                              className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F] hover:text-[#A67C52] transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>

                            {/* Color Variant Info */}
                            {item.colorName && (
                              <div className="flex items-center gap-1.5 text-xs text-[#1F1F1F] mt-0.5">
                                <span className="font-semibold text-[#666666]">Color:</span>
                                {item.colorCode && (
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block shrink-0 shadow-xs"
                                    style={{ backgroundColor: item.colorCode }}
                                  />
                                )}
                                <span className="font-bold text-[#1F1F1F]">{item.colorName}</span>
                              </div>
                            )}

                            {item.sku && (
                              <span className="text-[11px] text-[#A67C52] font-mono font-medium">
                                SKU: {item.sku}
                              </span>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-bold text-base text-[#1F1F1F]">
                                {formattedPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Selector & Item Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]/60">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-[#E5E5E5] rounded-xl px-3 py-1.5 bg-[#FAF8F5]">
                            <button
                              type="button"
                              onClick={() => decrementQuantity(item.productId, item.variantId)}
                              aria-label="Decrease quantity"
                              className="text-base font-medium text-[#666666] hover:text-[#1F1F1F] px-1.5 cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-semibold text-sm text-[#1F1F1F] px-2">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => incrementQuantity(item.productId, item.variantId)}
                              aria-label="Increase quantity"
                              className="text-base font-medium text-[#666666] hover:text-[#1F1F1F] px-1.5 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="flex flex-col items-end min-w-[90px]">
                            <span className="text-xs text-[#666666]">Subtotal</span>
                            <span className="font-bold text-base text-[#1F1F1F]">
                              {formattedSubtotal}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantId)}
                            aria-label="Remove item"
                            className="p-2 text-[#666666] hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="w-full">
                <OrderSummary
                  subtotal={cart.subtotal}
                  savings={0}
                  grandTotal={cart.subtotal}
                />
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
