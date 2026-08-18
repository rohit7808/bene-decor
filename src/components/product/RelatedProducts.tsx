"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard, { ProductCardData } from "./ProductCard";
import { ProductData } from "./ProductInfo";

interface RelatedProductsProps {
  currentProductId?: number | string;
  allProducts?: ProductData[] | ProductCardData[];
  products?: ProductData[] | ProductCardData[];
}

export default function RelatedProducts({
  currentProductId,
  allProducts = [],
  products,
}: RelatedProductsProps) {
  const sourceList = products || allProducts;
  const relatedList = currentProductId
    ? sourceList.filter((p) => String(p.id) !== String(currentProductId))
    : sourceList;
  const displayProducts = relatedList.length > 0 ? relatedList.slice(0, 4) : sourceList.slice(0, 4);

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
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
