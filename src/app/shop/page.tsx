"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ShopSidebar, { FilterState } from "@/components/shop/ShopSidebar";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { useWishlist } from "@/context/WishlistContext";
import { fetchJsonCached } from "@/lib/apiClient";
import ProductCard from "@/components/product/ProductCard";

export interface DynamicProduct {
  _id?: string;
  id?: number | string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  images?: string[];
  image?: string;
  rating?: number;
  reviewCount?: number;
  reviewsCount?: number;
  shortDescription?: string;
  description?: string;
  material?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  hasVariants?: boolean;
  variants?: any[];
}

const INITIAL_FILTERS: FilterState = {
  category: "",
  maxPrice: 100000,
  inStockOnly: false,
  minRating: 0,
  minDiscount: 0,
  material: "",
};

function normalizeCategorySlug(catParam: string): string {
  if (!catParam) return "";
  const cleaned = catParam.toLowerCase().trim().replace(/[^a-z0-9]+/g, "");
  if (cleaned.includes("living")) return "LIVING ROOM";
  if (cleaned.includes("dining")) return "DINING";
  if (cleaned.includes("bed")) return "BEDROOM";
  if (cleaned.includes("office") || cleaned.includes("work")) return "OFFICE";
  if (cleaned.includes("storage") || cleaned.includes("cabinet")) return "STORAGE";

  return catParam
    .split("-")
    .map((w) => w.toUpperCase())
    .join(" ");
}

function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#E5E5E5]/80 overflow-hidden animate-pulse flex flex-col h-[380px]">
      <div className="h-[240px] sm:h-[280px] w-full bg-zinc-200" />
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-1/4 bg-zinc-200 rounded-md" />
          <div className="h-5 w-3/4 bg-zinc-200 rounded-md" />
          <div className="h-3 w-1/3 bg-zinc-200 rounded-md" />
        </div>
        <div className="h-6 w-1/2 bg-zinc-200 rounded-md mt-4" />
      </div>
    </div>
  );
}

function ShopProductCardImage({
  product,
  viewMode,
  isWishlisted,
  onToggleWishlist,
}: {
  product: DynamicProduct;
  viewMode: "grid" | "list";
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image) {
      return [product.image];
    }
    return ["/images/collections/sofa.jpg"];
  }, [product.images, product.image]);

  const startCycling = useCallback(() => {
    if (images.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsHovered(true);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1000);
  }, [images.length]);

  const stopCycling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className={`relative ${
        viewMode === "grid"
          ? "h-[280px] w-full"
          : "h-[240px] sm:w-[280px] w-full"
      } overflow-hidden bg-[#FAF8F5] shrink-0 group/img cursor-pointer`}
    >
      <Link href={`/product/${product._id || product.id}`} className="relative h-full w-full block">
        <Image
          key={currentImage}
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3 rounded-t-2xl transition-all duration-500 ease-in-out group-hover/img:scale-105"
        />
      </Link>

      {/* Wishlist Button Overlay */}
      <button
        type="button"
        onClick={onToggleWishlist}
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
          isWishlisted
            ? "bg-[#A67C52] text-white scale-110"
            : "bg-white/90 backdrop-blur-sm text-[#1F1F1F] hover:text-[#A67C52]"
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

      {/* Image Counter Indicator on Hover if multiple images exist */}
      {isHovered && images.length > 1 && (
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1.5 animate-pulse pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-ping" />
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

function ShopContent({ initialCategory }: { initialCategory?: string } = {}) {
  const searchParams = useSearchParams();
  const params = useParams();

  const activeCategoryParam =
    initialCategory || (params?.category as string) || searchParams?.get("category") || "";

  const [products, setProducts] = useState<DynamicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    category: activeCategoryParam ? normalizeCategorySlug(activeCategoryParam) : "",
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Sync category filter if route parameter or URL query changes
  useEffect(() => {
    if (activeCategoryParam) {
      const normalized = normalizeCategorySlug(activeCategoryParam);
      setFilters((prev) => ({ ...prev, category: normalized }));
    }
  }, [activeCategoryParam]);

  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch dynamic products from MongoDB via GET /api/products (cached & retryable)
  const loadProducts = useCallback(async (bypassCache = false) => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const res = await fetchJsonCached<{ success: boolean; products: DynamicProduct[] }>(
        "/api/products?limit=100",
        {},
        bypassCache
      );

      if (res.success && res.data && Array.isArray(res.data.products)) {
        const availableProducts = res.data.products.filter(
          (p: DynamicProduct) => p.isAvailable !== false
        );
        setProducts(availableProducts);
      } else {
        setFetchError(res.error || "Failed to load products from server.");
        setProducts([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch products from API:", error);
      setFetchError("Network connection error. Please try again.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Clear all filters
  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setSortBy("featured");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search
        if (searchQuery) {
          const term = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(term);
          const matchCategory = product.category.toLowerCase().includes(term);
          const matchMaterial = (product.material || "").toLowerCase().includes(term);
          if (!matchName && !matchCategory && !matchMaterial) {
            return false;
          }
        }

        // Category
        if (filters.category && product.category.toUpperCase() !== filters.category.toUpperCase()) {
          return false;
        }

        // Price
        if (product.price > filters.maxPrice) {
          return false;
        }

        // In Stock
        if (filters.inStockOnly && (product.stock ?? 0) <= 0) {
          return false;
        }

        // Rating
        const productRating = product.rating || 5;
        if (filters.minRating > 0 && productRating < filters.minRating) {
          return false;
        }

        // Discount
        const productDiscount = product.discount || 0;
        if (filters.minDiscount > 0 && productDiscount < filters.minDiscount) {
          return false;
        }

        // Material
        if (filters.material && product.material !== filters.material) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "newest") return String(b._id || b.id).localeCompare(String(a._id || a.id));
        if (sortBy === "best-selling")
          return (b.reviewCount || b.reviewsCount || 0) - (a.reviewCount || a.reviewsCount || 0);
        return 0; // featured
      });
  }, [products, filters, searchQuery, sortBy]);

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
                totalProducts={products.length}
                filteredCount={filteredProducts.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              />

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ProductSkeleton key={idx} />
                  ))}
                </div>
              ) : fetchError ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#FAF8F5] rounded-2xl border border-[#E5E5E5] text-center gap-4 max-w-md mx-auto">
                  <span className="text-3xl">⚠️</span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                    Unable to load catalog
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold">{fetchError}</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => loadProducts(true)}
                    className="cursor-pointer"
                  >
                    🔄 Retry Loading Catalog
                  </Button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#FAF8F5] rounded-2xl border border-[#E5E5E5] text-center gap-4">
                  <span className="text-4xl">🪑</span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                    No products available.
                  </h3>
                  <p className="text-sm text-[#666666] max-w-sm">
                    No available products matched your current filters. Try resetting your search or price range.
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
                  {filteredProducts.map((product) => {
                    const productId = String(product._id || product.id);
                    return (
                      <ProductCard
                        key={productId}
                        product={product}
                        viewMode={viewMode}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default function ShopPage({ initialCategory }: { initialCategory?: string } = {}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-[#666666]">
          Loading BeneDecor Shop...
        </div>
      }
    >
      <ShopContent initialCategory={initialCategory} />
    </Suspense>
  );
}
