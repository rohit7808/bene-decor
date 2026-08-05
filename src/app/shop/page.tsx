"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ShopSidebar, { FilterState } from "@/components/shop/ShopSidebar";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { PRODUCTS_DATA, Product } from "@/data/products";

const INITIAL_FILTERS: FilterState = {
  category: "",
  maxPrice: 100000,
  inStockOnly: false,
  minRating: 0,
  minDiscount: 0,
  material: "",
};

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Clear all filters
  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setSortBy("featured");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // Search
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.material.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price
      if (product.priceNumeric > filters.maxPrice) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // Discount
      if (filters.minDiscount > 0 && product.discountNumeric < filters.minDiscount) {
        return false;
      }

      // Material
      if (filters.material && product.material !== filters.material) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.priceNumeric - b.priceNumeric;
      if (sortBy === "price-high") return b.priceNumeric - a.priceNumeric;
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "best-selling") return b.reviewsCount - a.reviewsCount;
      return 0; // featured
    });
  }, [filters, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Shop Header / Banner */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              BENÉ DECOR COLLECTION
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Explore Handcrafted Furniture
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[640px]">
              Discover luxury solid wood furniture, dining tables, sofas, and accent decor handcrafted for timeless living spaces.
            </p>
          </div>

          {/* Main Shop Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar Filters */}
            <ShopSidebar
              filters={filters}
              setFilters={setFilters}
              onClearAll={handleClearAll}
              isMobileOpen={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />

            {/* Right Product Listing Area */}
            <div className="flex-1 w-full">
              {/* Top Toolbar */}
              <ShopToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalProducts={PRODUCTS_DATA.length}
                filteredCount={filteredProducts.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              />

              {/* Product Grid / List */}
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#FAF8F5] rounded-2xl border border-[#E5E5E5] text-center gap-4">
                  <span className="text-4xl">🪑</span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                    No Furniture Found
                  </h3>
                  <p className="text-sm text-[#666666] max-w-sm">
                    No products matched your current filters. Try resetting your search or price range.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleClearAll}>
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                      : "flex flex-col gap-6"
                  }
                >
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className={`group relative flex ${
                        viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row"
                      } rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer`}
                    >
                      {/* Product Image Container */}
                      <div
                        className={`relative ${
                          viewMode === "grid"
                            ? "h-[280px] w-full"
                            : "h-[240px] sm:w-[280px] w-full"
                        } overflow-hidden bg-zinc-200/80`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Wishlist Button Overlay */}
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

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-5 gap-2 justify-between">
                        <div className="flex flex-col gap-1.5">
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

                          {viewMode === "list" && (
                            <p className="text-xs text-[#666666] line-clamp-2 mt-1">
                              {product.shortDescription}
                            </p>
                          )}
                        </div>

                        {/* Pricing & Add to Cart */}
                        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#E5E5E5]/60 gap-2">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-bold text-lg text-[#1F1F1F]">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#666666] line-through">
                                {product.originalPrice}
                              </span>
                            )}
                            {product.discount && (
                              <span className="text-xs font-semibold text-[#16A34A]">
                                {product.discount}
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
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
