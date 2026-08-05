"use client";

import React, { useState } from "react";
import { ProductData } from "./ProductInfo";

interface ProductTabsProps {
  product: ProductData;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping" | "reviews"
  >("description");

  return (
    <div className="mt-16 border-t border-[#E5E5E5]/80 pt-12">
      {/* Tab Navigation Buttons */}
      <div className="flex flex-wrap items-center border-b border-[#E5E5E5] gap-4 sm:gap-8 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`pb-4 text-base sm:text-lg font-semibold transition-all duration-300 relative ${
            activeTab === "description"
              ? "text-[#A67C52] border-b-2 border-[#A67C52]"
              : "text-[#666666] hover:text-[#1F1F1F]"
          }`}
        >
          Product Description
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("specifications")}
          className={`pb-4 text-base sm:text-lg font-semibold transition-all duration-300 relative ${
            activeTab === "specifications"
              ? "text-[#A67C52] border-b-2 border-[#A67C52]"
              : "text-[#666666] hover:text-[#1F1F1F]"
          }`}
        >
          Specifications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`pb-4 text-base sm:text-lg font-semibold transition-all duration-300 relative ${
            activeTab === "shipping"
              ? "text-[#A67C52] border-b-2 border-[#A67C52]"
              : "text-[#666666] hover:text-[#1F1F1F]"
          }`}
        >
          Shipping &amp; Returns
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 text-base sm:text-lg font-semibold transition-all duration-300 relative ${
            activeTab === "reviews"
              ? "text-[#A67C52] border-b-2 border-[#A67C52]"
              : "text-[#666666] hover:text-[#1F1F1F]"
          }`}
        >
          Customer Reviews ({product.reviewsCount})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E5E5E5]/70">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="flex flex-col gap-4 text-[#666666] leading-relaxed text-base">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl sm:text-2xl text-[#1F1F1F]">
              Handcrafted Heritage &amp; Modern Comfort
            </h3>
            <p>
              The {product.name} is meticulously handcrafted by master artisans at Bené Decor using seasoned solid hardwood sourced from sustainable forestry plantations. Every wooden joint is Mortise &amp; Tenon reinforced for lifetime structural stability.
            </p>
            <p>
              Designed to elevate high-end living spaces, the upholstery is treated with dirt-repellent and stain-resistant finishes to preserve fabric vibrancy. Whether as a focal statement piece or a subtle complement to contemporary interiors, this piece reflects timeless luxury and generational craftsmanship.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#E5E5E5]/60">
              <div className="flex flex-col">
                <span className="font-bold text-[#1F1F1F]">100% Solid Hardwood</span>
                <span className="text-xs text-[#666666]">Kiln-dried &amp; termite resistant</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F1F1F]">Artisan Crafted</span>
                <span className="text-xs text-[#666666]">Precision hand joinery</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F1F1F]">Eco-Friendly Polish</span>
                <span className="text-xs text-[#666666]">Non-toxic organic oil coat</span>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="flex flex-col gap-4">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Primary Material</span>
                <span className="font-medium text-[#1F1F1F]">{product.material}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Dimensions</span>
                <span className="font-medium text-[#1F1F1F]">{product.dimensions}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Wood Finish</span>
                <span className="font-medium text-[#1F1F1F]">{product.finish}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Warranty Period</span>
                <span className="font-medium text-[#1F1F1F]">{product.warranty}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Assembly Required</span>
                <span className="font-medium text-[#1F1F1F]">Pre-assembled / Minimal</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg border border-[#E5E5E5]/60">
                <span className="text-[#666666]">Country of Origin</span>
                <span className="font-medium text-[#1F1F1F]">India</span>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <div className="flex flex-col gap-4 text-[#666666] leading-relaxed text-base">
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
              White-Glove Delivery &amp; Hassle-Free Returns
            </h3>
            <p>
              Every Bené Decor order includes complimentary insured transit and specialized furniture handling. Our delivery team will unbox, inspect, and place the furniture in your desired room.
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Estimated Delivery Time: <strong>{product.deliveryTime}</strong></li>
              <li>Free 7-Day Replacement for any manufacturing defects or transit damage.</li>
              <li>Transit Insurance: 100% covered by Bené Decor.</li>
            </ul>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
              <div>
                <span className="text-3xl font-bold text-[#1F1F1F]">5.0</span>
                <span className="text-sm text-[#666666] ml-2">out of 5.0</span>
                <div className="flex text-[#A67C52] text-lg mt-1">★★★★★</div>
              </div>
              <span className="text-sm text-[#666666]">Based on {product.reviewsCount} verified customer ratings</span>
            </div>

            {/* Customer Review List */}
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E5E5]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1F1F1F]">Vikram Malhotra</span>
                  <span className="text-xs text-[#A67C52] font-semibold uppercase">Verified Buyer</span>
                </div>
                <div className="text-[#A67C52] text-sm">★★★★★</div>
                <p className="text-sm text-[#666666]">
                  "Exceptional craftsmanship! The wood finish is rich and warm, perfectly matching our interior. Highly recommended."
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#E5E5E5]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1F1F1F]">Ananya Roy</span>
                  <span className="text-xs text-[#A67C52] font-semibold uppercase">Verified Buyer</span>
                </div>
                <div className="text-[#A67C52] text-sm">★★★★★</div>
                <p className="text-sm text-[#666666]">
                  "Seamless delivery and setup. The quality exceeds expectations—super solid and built to last."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
