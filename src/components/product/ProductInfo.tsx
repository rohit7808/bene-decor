"use client";

import React, { useState } from "react";
import Button from "../ui/Button";

export interface ProductData {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  shortDescription: string;
  material: string;
  dimensions: string;
  finish: string;
  warranty: string;
  deliveryTime: string;
  careInstructions: string;
}

interface ProductInfoProps {
  product: ProductData;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
        {product.category}
      </span>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F] leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex text-[#A67C52] text-lg">
          {"★".repeat(product.rating)}
        </div>
        <span className="text-sm font-medium text-[#666666]">
          5.0 ({product.reviewsCount} Customer Reviews)
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
          {product.price}
        </span>
        <span className="text-base text-[#666666] line-through">
          {product.originalPrice}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
          {product.discount}
        </span>
      </div>

      {/* Short Description */}
      <p className="text-base text-[#666666] leading-relaxed border-t border-b border-[#E5E5E5]/60 py-4 my-2">
        {product.shortDescription}
      </p>

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border border-[#E5E5E5] rounded-xl px-4 py-2.5 min-w-[130px] bg-[#FAF8F5]">
          <button
            type="button"
            onClick={decrementQty}
            aria-label="Decrease quantity"
            className="text-lg font-medium text-[#666666] hover:text-[#1F1F1F] transition-colors px-1"
          >
            −
          </button>
          <span className="font-semibold text-base text-[#1F1F1F]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={incrementQty}
            aria-label="Increase quantity"
            className="text-lg font-medium text-[#666666] hover:text-[#1F1F1F] transition-colors px-1"
          >
            +
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-1 items-center gap-3">
          <Button variant="primary" size="lg" className="flex-1">
            Add to Cart
          </Button>

          <Button variant="secondary" size="lg" className="flex-1">
            Buy Now
          </Button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Add to Wishlist"
            className={`p-3.5 rounded-xl border transition-all duration-300 ${
              isWishlisted
                ? "border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]"
                : "border-[#E5E5E5] bg-white text-[#1F1F1F] hover:border-[#A67C52] hover:text-[#A67C52]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
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
      </div>

      {/* Product Specifications Summary Table */}
      <div className="mt-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/70 p-6 flex flex-col gap-3.5">
        <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] mb-1">
          Product Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Material:</span>
            <span className="font-medium text-[#1F1F1F]">{product.material}</span>
          </div>

          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Dimensions:</span>
            <span className="font-medium text-[#1F1F1F]">{product.dimensions}</span>
          </div>

          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Finish:</span>
            <span className="font-medium text-[#1F1F1F]">{product.finish}</span>
          </div>

          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Warranty:</span>
            <span className="font-medium text-[#1F1F1F]">{product.warranty}</span>
          </div>

          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Delivery:</span>
            <span className="font-medium text-[#1F1F1F]">{product.deliveryTime}</span>
          </div>

          <div className="flex justify-between border-b border-[#E5E5E5]/50 pb-2">
            <span className="text-[#666666]">Care:</span>
            <span className="font-medium text-[#1F1F1F] line-clamp-1">{product.careInstructions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
