"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white border border-[#E5E5E5]/80 overflow-hidden animate-pulse flex flex-col h-[380px]"
        >
          <div className="h-[240px] w-full bg-zinc-200" />
          <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-1/3 bg-zinc-200 rounded" />
              <div className="h-6 w-3/4 bg-zinc-200 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 rounded mt-2" />
            </div>
            <div className="h-10 w-full bg-zinc-200 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: any) => {
    await addToCart({
      productId: String(item.productId),
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
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
              SAVED PIECES
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Your Wishlist
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Explore your saved luxury furniture pieces and move them to your cart.
            </p>
          </div>

          {/* Wishlist Content */}
          {isLoading ? (
            <WishlistSkeleton />
          ) : wishlist.length === 0 ? (
            /* Beautiful Empty Wishlist Illustration & View */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 my-4 shadow-sm max-w-2xl mx-auto gap-5">
              <div className="p-6 rounded-full bg-white border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                Your Wishlist is Empty
              </h2>

              <p className="text-base text-[#666666] max-w-md leading-relaxed">
                Save your favorite solid wood sofas, dining chairs, and handcrafted decor to view them here anytime.
              </p>

              <Link href="/shop" className="mt-2">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#666666]">
                  Showing <strong>{wishlist.length}</strong> saved item(s)
                </span>
                <Link href="/shop" className="text-xs font-bold text-[#A67C52] hover:underline">
                  Browse More Products →
                </Link>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {wishlist.map((item) => {
                  const formattedPrice = `₹${item.price.toLocaleString("en-IN")}`;
                  const formattedOrigPrice =
                    item.originalPrice && item.originalPrice > item.price
                      ? `₹${item.originalPrice.toLocaleString("en-IN")}`
                      : null;
                  const isAvailable = item.isAvailable !== false && (item.stock ?? 10) > 0;

                  return (
                    <div
                      key={item.productId}
                      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                    >
                      {/* Product Image */}
                      <div className="relative h-[260px] w-full overflow-hidden bg-[#FAF8F5]">
                        <Image
                          src={item.image || "/images/collections/sofa.jpg"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-3 rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Remove Button Overlay */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.productId)}
                          aria-label="Remove from Wishlist"
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-600 hover:text-white transition-colors duration-300 shadow-sm cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5 gap-3 justify-between">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                              {item.category}
                            </span>
                            {isAvailable ? (
                              <span className="text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] line-clamp-1">
                            {item.name}
                          </h3>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold text-lg text-[#1F1F1F]">
                              {formattedPrice}
                            </span>
                            {formattedOrigPrice && (
                              <span className="text-xs text-[#666666] line-through">
                                {formattedOrigPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-[#E5E5E5]/60 mt-2">
                          <Link
                            href={`/product/${item.productId}`}
                            className="flex-1 px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:border-[#A67C52] hover:text-[#A67C52] bg-white text-center transition-colors"
                          >
                            View Product
                          </Link>

                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1 text-xs py-2"
                            disabled={!isAvailable}
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
