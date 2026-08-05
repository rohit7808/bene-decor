"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import WishlistEmpty from "@/components/wishlist/WishlistEmpty";
import { PRODUCTS_DATA, Product } from "@/data/products";

interface WishlistItem extends Product {
  stockStatus: "In Stock" | "Only 2 Left" | "Out of Stock";
}

export default function WishlistPage() {
  // 4 Wishlist Products using existing furniture products
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { ...PRODUCTS_DATA[0], stockStatus: "In Stock" },
    { ...PRODUCTS_DATA[1], stockStatus: "In Stock" },
    { ...PRODUCTS_DATA[2], stockStatus: "Only 2 Left" },
    { ...PRODUCTS_DATA[3], stockStatus: "Out of Stock" },
  ]);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getStockBadgeClass = (status: WishlistItem["stockStatus"]) => {
    switch (status) {
      case "In Stock":
        return "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20";
      case "Only 2 Left":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Out of Stock":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
              SAVED COLLECTION
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              My Wishlist
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Save your favourite furniture here for later.
            </p>
          </div>

          {/* Wishlist Content */}
          {wishlistItems.length === 0 ? (
            <WishlistEmpty />
          ) : (
            <div className="flex flex-col gap-6">
              {/* Count Indicator & Clear Option */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#666666]">
                  Showing <strong>{wishlistItems.length}</strong> saved pieces
                </span>
                <button
                  type="button"
                  onClick={() => setWishlistItems([])}
                  className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline"
                >
                  Clear Wishlist
                </button>
              </div>

              {/* Wishlist Product Grid (4 Columns Desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {/* Image Container with Link & Remove Heart Button */}
                    <div className="relative h-[280px] w-full overflow-hidden bg-zinc-200/80">
                      <Link href={`/product/${product.id}`} className="block h-full w-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {/* Stock Status Badge Overlay (Top Left) */}
                      <span
                        className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[11px] font-semibold border backdrop-blur-sm shadow-sm ${getStockBadgeClass(
                          product.stockStatus
                        )}`}
                      >
                        {product.stockStatus}
                      </span>

                      {/* Remove Button (Filled Red Heart Icon Top Right) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFromWishlist(product.id);
                        }}
                        aria-label="Remove from Wishlist"
                        title="Remove from Wishlist"
                        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 shadow-sm"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5 gap-2 justify-between">
                      <Link
                        href={`/product/${product.id}`}
                        className="flex flex-col gap-1.5"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                          {product.category}
                        </span>

                        <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                          <span>{"★".repeat(product.rating)}</span>
                          <span className="text-[#666666] ml-1">
                            ({product.reviewsCount})
                          </span>
                        </div>
                      </Link>

                      {/* Pricing & Actions */}
                      <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#E5E5E5]/60">
                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-bold text-lg text-[#1F1F1F]">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#666666] line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.discount && (
                            <span className="text-xs font-semibold text-[#16A34A]">
                              {product.discount}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            disabled={product.stockStatus === "Out of Stock"}
                          >
                            {product.stockStatus === "Out of Stock"
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#666666] hover:text-red-600 hover:border-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
