"use client";

import React from "react";

export interface FilterState {
  category: string;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  minDiscount: number;
  material: string;
}

interface ShopSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES = [
  "ALL",
  "LIVING ROOM",
  "DINING",
  "BEDROOM",
  "OFFICE",
  "STORAGE",
];

const MATERIALS = [
  "ALL",
  "Solid Wood",
  "Engineered Wood",
  "Metal",
  "Fabric",
  "Leather",
];

const DISCOUNTS = [
  { label: "All Discounts", value: 0 },
  { label: "10%+ OFF", value: 10 },
  { label: "20%+ OFF", value: 20 },
  { label: "30%+ OFF", value: 30 },
  { label: "40%+ OFF", value: 40 },
  { label: "50%+ OFF", value: 50 },
];

export default function ShopSidebar({
  filters,
  setFilters,
  onClearAll,
  isMobileOpen = false,
  onCloseMobile,
}: ShopSidebarProps) {
  const content = (
    <div className="flex flex-col gap-8 text-[#1F1F1F]">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
          Filter Products
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected =
              cat === "ALL" ? filters.category === "" : filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    category: cat === "ALL" ? "" : cat,
                  }))
                }
                className={`text-left text-sm py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#A67C52] text-white font-semibold"
                    : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#1F1F1F]"
                }`}
              >
                <span>{cat === "ALL" ? "All Categories" : cat}</span>
                {isSelected && <span className="text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
            Max Price
          </h3>
          <span className="text-sm font-bold text-[#1F1F1F]">
            ₹{filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={100000}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full accent-[#A67C52] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#666666]">
          <span>₹3,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
          Availability
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#666666] hover:text-[#1F1F1F]">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                inStockOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded accent-[#A67C52] cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
          Rating
        </h3>
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: isSelected ? 0 : stars,
                  }))
                }
                className={`flex items-center gap-2 text-sm text-left p-1.5 rounded-lg transition-colors ${
                  isSelected ? "bg-[#A67C52]/10 text-[#A67C52] font-semibold" : "text-[#666666] hover:text-[#1F1F1F]"
                }`}
              >
                <span className="text-[#A67C52]">{"★".repeat(stars)}</span>
                <span>{stars} Stars &amp; above</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
          Discount
        </h3>
        <div className="flex flex-col gap-1">
          {DISCOUNTS.map((disc) => {
            const isSelected = filters.minDiscount === disc.value;
            return (
              <button
                key={disc.value}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minDiscount: disc.value,
                  }))
                }
                className={`text-left text-sm py-1 px-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#A67C52] text-white font-medium"
                    : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#1F1F1F]"
                }`}
              >
                {disc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
          Material
        </h3>
        <div className="flex flex-col gap-1">
          {MATERIALS.map((mat) => {
            const isSelected =
              mat === "ALL" ? filters.material === "" : filters.material === mat;
            return (
              <button
                key={mat}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    material: mat === "ALL" ? "" : mat,
                  }))
                }
                className={`text-left text-sm py-1 px-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#A67C52] text-white font-medium"
                    : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#1F1F1F]"
                }`}
              >
                {mat === "ALL" ? "All Materials" : mat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm self-start">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="relative w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close Drawer"
              className="absolute top-4 right-4 p-2 text-[#1F1F1F] font-bold text-xl hover:text-[#A67C52]"
            >
              ✕
            </button>
            <div className="mt-4">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
