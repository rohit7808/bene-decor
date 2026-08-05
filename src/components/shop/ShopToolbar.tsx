"use client";

import React from "react";

interface ShopToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalProducts: number;
  filteredCount: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onOpenMobileFilters: () => void;
}

export default function ShopToolbar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  totalProducts,
  filteredCount,
  viewMode,
  setViewMode,
  onOpenMobileFilters,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5]/80 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search furniture, tables, chairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E5E5E5] text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
          />
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#666666] hover:text-[#1F1F1F]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex lg:hidden items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold uppercase tracking-wider text-[#A67C52] bg-[#FAF8F5]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM6 9h12M9 15h6"
              />
            </svg>
            Filters
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#666666] hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center border border-[#E5E5E5] rounded-xl p-1 bg-[#FAF8F5]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-[#A67C52] shadow-sm"
                  : "text-[#666666] hover:text-[#1F1F1F]"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[#A67C52] shadow-sm"
                  : "text-[#666666] hover:text-[#1F1F1F]"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Count Indicator */}
      <div className="text-xs text-[#666666] border-t border-[#E5E5E5]/60 pt-2 flex items-center justify-between">
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalProducts}</strong> handcrafted pieces
        </span>
      </div>
    </div>
  );
}
