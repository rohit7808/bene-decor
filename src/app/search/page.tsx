"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import { fetchJsonCached } from "@/lib/apiClient";
import { PRODUCTS_DATA, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

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
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Read initial query parameter ?q=
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS_DATA);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Sync search input when URL query changes
  useEffect(() => {
    setSearchInput(initialQuery);
  }, [initialQuery]);

  // Fetch dynamic products from MongoDB (cached)
  useEffect(() => {
    async function fetchStoreProducts() {
      try {
        const res = await fetchJsonCached<{ success: boolean; products: any[] }>("/api/products?limit=100");
        if (res.success && res.data && Array.isArray(res.data.products) && res.data.products.length > 0) {
          const formatted: Product[] = res.data.products.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            category: (p.category || "LIVING ROOM").toUpperCase(),
            price: `₹${(p.price || 0).toLocaleString("en-IN")}`,
            priceNumeric: p.price || 0,
            originalPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString("en-IN")}` : "",
            discount: p.discount ? `${p.discount}% OFF` : "",
            discountNumeric: p.discount || 0,
            rating: Math.min(5, Math.max(1, Math.round(p.rating || 5))),
            reviewsCount: p.reviewCount || p.reviewsCount || 12,
            image: p.image || (Array.isArray(p.images) && p.images[0]) || "/images/collections/sofa.jpg",
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/images/collections/sofa.jpg"],
            shortDescription: p.description || p.shortDescription || "",
            material: p.material || "Solid Wood",
            inStock: p.stock === undefined || p.stock > 0,
            tags: Array.isArray(p.tags) ? p.tags : [],
          }));

          // Merge DB products with static products (avoiding duplicate IDs)
          const dbIds = new Set(formatted.map((f) => f.id));
          const staticFiltered = PRODUCTS_DATA.filter((sp) => !dbIds.has(sp.id));
          setAllProducts([...formatted, ...staticFiltered]);
        }
      } catch (err) {
        console.error("Fetch products error on search page:", err);
      }
    }

    fetchStoreProducts();
  }, []);

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

    return allProducts.filter((product) => {
      // Query Matching (case-insensitive across name, category, material, description, tags)
      if (queryTerm) {
        const nameMatch = product.name.toLowerCase().includes(queryTerm);
        const categoryMatch = product.category.toLowerCase().includes(queryTerm);
        const materialMatch = (product.material || "").toLowerCase().includes(queryTerm);
        const descMatch = (product.shortDescription || "").toLowerCase().includes(queryTerm);
        const tagsMatch = Array.isArray(product.tags)
          ? product.tags.some((tag) => tag.toLowerCase().includes(queryTerm))
          : false;

        if (!nameMatch && !categoryMatch && !materialMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      // Category Filter
      if (selectedCategory && selectedCategory !== "ALL") {
        if (product.category.toUpperCase() !== selectedCategory.toUpperCase()) {
          return false;
        }
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
  }, [allProducts, initialQuery, selectedCategory, maxPrice, inStockOnly, minRating]);

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
            <Button type="submit" variant="primary" size="md" className="cursor-pointer">
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
              className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:underline cursor-pointer"
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
                  className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
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
                  className={`flex items-center gap-2 text-sm text-left p-1.5 rounded-lg transition-colors cursor-pointer ${
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
                We couldn't find any products matching your search. Try another keyword or explore all furniture.
              </p>

              <Link href="/shop" className="mt-2">
                <Button variant="primary" size="lg">
                  Explore All Collections →
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
                  <ProductCard key={product.id} product={product} />
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
