"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import { ProductData } from "./ProductInfo";

interface RelatedProductsProps {
  currentProductId: number;
  allProducts: ProductData[];
}

export default function RelatedProducts({
  currentProductId,
  allProducts,
}: RelatedProductsProps) {
  // Filter out current product or use all products
  const relatedList = allProducts.filter((p) => p.id !== currentProductId);
  const displayProducts = relatedList.length >= 4 ? relatedList.slice(0, 4) : allProducts.slice(0, 4);

  return (
    <div className="mt-20 border-t border-[#E5E5E5]/80 pt-16">
      {/* Heading */}
      <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-12">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
          YOU MAY ALSO LIKE
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
          Related Handcrafted Collections
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {displayProducts.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-[280px] w-full overflow-hidden bg-zinc-200/80">
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Wishlist Button */}
              <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1F1F1F] hover:text-[#A67C52] transition-colors duration-300 shadow-sm">
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
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                {item.category}
              </span>

              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300 line-clamp-1">
                {item.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                <span>{"★".repeat(item.rating)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#E5E5E5]/60 gap-2">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-bold text-base text-[#1F1F1F]">
                    {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-[#666666] line-through">
                      {item.originalPrice}
                    </span>
                  )}
                </div>
                <Button variant="primary" size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
