"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { PRODUCTS_DATA, Product } from "@/data/products";

interface CompareProduct extends Product {
  dimensions: string;
  color: string;
  warranty: string;
  deliveryTime: string;
}

export default function ComparePage() {
  // Demo 4 products for comparison with enhanced specification fields
  const [compareItems, setCompareItems] = useState<CompareProduct[]>([
    {
      ...PRODUCTS_DATA[0], // Bene Decor Aldric Wooden Sofa
      dimensions: '78" W x 34" D x 32" H',
      color: "Teak Finish & Deep Royal Velvet",
      warranty: "5 Year Structural Warranty",
      deliveryTime: "4 - 6 Business Days",
    },
    {
      ...PRODUCTS_DATA[1], // Printed Cotton Ottoman Pouffe
      dimensions: '20" Dia x 16" H',
      color: "Provincial Teak & Ethnic Printed Cotton",
      warranty: "2 Year Structural Warranty",
      deliveryTime: "3 - 5 Business Days",
    },
    {
      ...PRODUCTS_DATA[2], // Sheesham Wood Shoe Rack
      dimensions: '36" W x 14" D x 20" H',
      color: "Natural Sheesham Polish & Grey Cushion",
      warranty: "3 Year Structural Warranty",
      deliveryTime: "4 - 6 Business Days",
    },
    {
      ...PRODUCTS_DATA[3], // The Sterling Tufted Accent Chair
      dimensions: '24" W x 26" D x 38" H',
      color: "Natural Oak Legs & Linen Upholstery",
      warranty: "3 Year Structural Warranty",
      deliveryTime: "4 - 6 Business Days",
    },
  ]);

  const handleRemoveProduct = (id: number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              SIDE BY SIDE SPECIFICATIONS
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Compare Furniture
            </h1>
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-[640px]">
              Compare your favorite furniture side by side and choose the perfect one.
            </p>
          </div>

          {/* Comparison Table / Empty State */}
          {compareItems.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 my-8 shadow-sm max-w-2xl mx-auto gap-5">
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
                    d="M12 3v18m9-12H3m15 6H6"
                  />
                </svg>
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                No products selected for comparison.
              </h2>

              <p className="text-base text-[#666666] max-w-md leading-relaxed">
                Add products to your comparison list from the shop page to compare their specs side by side.
              </p>

              <Link href="/shop" className="mt-2">
                <Button variant="primary" size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#666666]">
                  Comparing <strong>{compareItems.length}</strong> of 4 maximum products
                </span>
                <button
                  type="button"
                  onClick={() => setCompareItems([])}
                  className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline"
                >
                  Clear Comparison
                </button>
              </div>

              {/* Comparison Matrix Table */}
              <div className="w-full overflow-x-auto rounded-3xl border border-[#E5E5E5]/80 shadow-sm bg-white">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                  {/* Sticky Header with Product Cards */}
                  <thead className="sticky top-0 z-20 bg-[#FAF8F5] border-b border-[#E5E5E5]">
                    <tr>
                      <th className="p-6 w-48 sm:w-56 font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] align-top bg-[#FAF8F5]">
                        Features &amp; Specifications
                      </th>
                      {compareItems.map((item) => (
                        <th
                          key={item.id}
                          className="p-6 w-60 sm:w-64 align-top border-l border-[#E5E5E5]/60 bg-[#FAF8F5]"
                        >
                          <div className="group flex flex-col gap-3 relative">
                            {/* Remove Column Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(item.id)}
                              className="absolute top-0 right-0 p-1 text-[#666666] hover:text-red-600 transition-colors"
                              title="Remove from comparison"
                            >
                              ✕
                            </button>

                            {/* Image */}
                            <Link
                              href={`/product/${item.id}`}
                              className="relative h-36 w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5]"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="200px"
                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                              />
                            </Link>

                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A67C52]">
                              {item.category}
                            </span>

                            <Link
                              href={`/product/${item.id}`}
                              className="font-[family-name:var(--font-playfair)] font-bold text-base text-[#1F1F1F] hover:text-[#A67C52] transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>

                            <Button variant="primary" size="sm" className="mt-1">
                              Add to Cart
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Specification Comparison Rows */}
                  <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                    {/* Price */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Price
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-bold text-base text-[#1F1F1F]">
                              {item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-[#666666] line-through">
                                {item.originalPrice}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Discount */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Discount
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          <span className="font-semibold text-xs text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-md">
                            {item.discount}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Rating
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                            <span>{"★".repeat(item.rating)}</span>
                            <span className="text-[#666666] font-medium">
                              (5.0)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Material */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Material
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60 font-medium">
                          {item.material}
                        </td>
                      ))}
                    </tr>

                    {/* Dimensions */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Dimensions
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          {item.dimensions}
                        </td>
                      ))}
                    </tr>

                    {/* Color / Finish */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Color &amp; Finish
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          {item.color}
                        </td>
                      ))}
                    </tr>

                    {/* Warranty */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Warranty
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60 font-medium text-[#1F1F1F]">
                          {item.warranty}
                        </td>
                      ))}
                    </tr>

                    {/* Delivery Time */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Delivery Time
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          {item.deliveryTime}
                        </td>
                      ))}
                    </tr>

                    {/* Availability */}
                    <tr>
                      <td className="p-5 font-semibold text-[#666666] bg-[#FAF8F5]/50">
                        Availability
                      </td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                            In Stock
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Bottom Action */}
                    <tr>
                      <td className="p-5 bg-[#FAF8F5]/50"></td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="p-5 border-l border-[#E5E5E5]/60">
                          <Button variant="primary" size="sm" className="w-full">
                            Add to Cart
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
