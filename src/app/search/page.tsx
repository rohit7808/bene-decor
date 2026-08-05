"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import { PRODUCTS_DATA, Product } from "@/data/products";

const CATEGORIES = [
  "ALL",
  "LIVING ROOM",
  "DINING",
  "BEDROOM",
  "OFFICE",
  "STORAGE",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial query parameter ?q=
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/search");
    }
  };

  // Filter Products Logic
  const filteredProducts = useMemo(() => {
    const queryTerm = initialQuery.toLowerCase().trim();

    return PRODUCTS_DATA.filter((product) => {
      // Query Matching
      if (queryTerm) {
        const nameMatch = product.name.toLowerCase().includes(queryTerm);
        const categoryMatch = product.category.toLowerCase().includes(queryTerm);
        const materialMatch = product.material.toLowerCase().includes(queryTerm);
        const descMatch = product.shortDescription.toLowerCase().includes(queryTerm);

        if (!nameMatch && !categoryMatch && !materialMatch && !descMatch) {
          return false;
        }
      }

      // Category Filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price Filter
      if (product.priceNumeric > maxPrice) {
        return false;
      }

      // In Stock Filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Rating Filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [initialQuery, selectedCategory, maxPrice, inStockOnly, minRating]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setMaxPrice(100000);
    setInStockOnly(false);
    setMinRating(0);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
          EXPLORE CATALOG
        </span>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
          Search Results
        </h1>
        {initialQuery ? (
          <p className="text-base sm:text-lg text-[#666666]">
            Results for <strong className="text-[#1F1F1F]">"{initialQuery}"</strong>
          </p>
        ) : (
          <p className="text-base text-[#666666]">
            Showing all handcrafted Bené Decor furniture collections.
          </p>
        )}

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-md mt-2">
          <div className="flex items-center gap-2">
            <SearchBar
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search furniture, sofas, tables..."
              className="flex-1"
            />
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Main Search Layout (Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
              Filter Results
            </h2>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
              Category
            </h3>
            {CATEGORIES.map((cat) => {
              const isSelected =
                cat === "ALL" ? selectedCategory === "" : selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat === "ALL" ? "" : cat)}
                  className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#A67C52] text-white font-medium"
                      : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#1F1F1F]"
                  }`}
                >
                  <span>{cat === "ALL" ? "All Categories" : cat}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#A67C52]">
                Max Price
              </span>
              <span className="font-bold text-[#1F1F1F]">
                ₹{maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={100000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#A67C52] cursor-pointer"
            />
          </div>

          {/* Availability Filter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
              Availability
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#666666] hover:text-[#1F1F1F]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-[#A67C52] cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
              Rating
            </h3>
            {[5, 4, 3].map((stars) => {
              const isSelected = minRating === stars;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setMinRating(isSelected ? 0 : stars)}
                  className={`flex items-center gap-2 text-sm text-left p-1.5 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-[#A67C52]/10 text-[#A67C52] font-semibold"
                      : "text-[#666666] hover:text-[#1F1F1F]"
                  }`}
                >
                  <span className="text-[#A67C52]">{"★".repeat(stars)}</span>
                  <span>{stars} Stars &amp; above</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length === 0 ? (
            /* Empty State: No Products Found */
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 shadow-sm max-w-2xl mx-auto gap-5">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                No Products Found
              </h2>

              <p className="text-base text-[#666666] max-w-md leading-relaxed">
                Try another keyword or browse our collections.
              </p>

              <Link href="/" className="mt-2">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-xs text-[#666666] pb-2 border-b border-[#E5E5E5]/60">
                Found <strong>{filteredProducts.length}</strong> matching pieces
              </div>

              {/* Grid of Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-[280px] w-full overflow-hidden bg-zinc-200/80">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Wishlist Icon */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      <Navbar />
      <main className="py-10 sm:py-16">
        <Container>
          <Suspense
            fallback={
              <div className="py-20 text-center text-[#666666]">
                Loading search results...
              </div>
            }
          >
            <SearchContent />
          </Suspense>
        </Container>
      </main>
    </div>
  );
}
