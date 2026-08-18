"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo, { ProductData } from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import Button from "@/components/ui/Button";
import { fetchJsonCached } from "@/lib/apiClient";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProductData = useCallback(async (bypassCache = false) => {
    try {
      setIsLoading(true);
      setNotFound(false);
      setErrorMsg(null);

      // Fetch product details by ID or slug from GET /api/products/[id]
      const res = await fetchJsonCached<{ success: boolean; product: any }>(
        `/api/products/${id}`,
        {},
        bypassCache
      );

      if (!res.success || !res.data || !res.data.product) {
        if (res.error?.includes("404") || res.error?.includes("not found")) {
          setNotFound(true);
        } else {
          setErrorMsg(res.error || "Failed to load product details.");
        }
        return;
      }

      const p = res.data.product;
      const formatted: ProductData = {
        id: p._id || p.id || id,
        name: p.name,
        category: p.category,
        price: `₹${(p.price || 0).toLocaleString("en-IN")}`,
        originalPrice:
          p.originalPrice && p.originalPrice > p.price
            ? `₹${p.originalPrice.toLocaleString("en-IN")}`
            : "",
        discount: p.discount ? `${p.discount}% OFF` : "",
        rating: Math.min(5, Math.max(1, Math.round(p.rating || 5))),
        reviewsCount: p.reviewCount || p.reviewsCount || 0,
        images:
          Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : [p.image || "/images/collections/sofa.jpg"],
        shortDescription: p.description || p.shortDescription || "",
        material: p.material || "Solid Teak Wood",
        brand: p.brand || "Bené Decor",
        color: p.color || "Natural Finish",
        dimensions: p.dimensions || "",
        weight: p.weight || "",
        stockStatus: (p.stock ?? 10) > 0 && p.isAvailable !== false ? "In Stock" : "Out of Stock",
        isAvailable: p.isAvailable !== false && (p.stock ?? 10) > 0,
        sku: p.sku || "",
        tags: Array.isArray(p.tags) ? p.tags : [],
        finish: p.color || "Provincial Teak Polish",
        warranty: "5 Year Structural Warranty",
        deliveryTime: "5 - 7 Business Days",
        careInstructions:
          "Wipe clean with a soft dry cloth. Avoid direct exposure to moisture and direct sunlight.",
        hasVariants: p.hasVariants || false,
        variants: Array.isArray(p.variants) ? p.variants : [],
      };

      setProduct(formatted);

      // Fetch Related Products from the same category
      try {
        const relatedRes = await fetchJsonCached<{ success: boolean; products: any[] }>(
          `/api/products?category=${encodeURIComponent(p.category)}&limit=5`,
          {},
          bypassCache
        );
        if (relatedRes.success && relatedRes.data && Array.isArray(relatedRes.data.products)) {
          const formattedRelated: ProductData[] = relatedRes.data.products
            .filter((item: any) => String(item._id || item.id) !== String(p._id || p.id))
            .map((rel: any) => ({
              id: rel._id || rel.id,
              name: rel.name,
              category: rel.category,
              price: `₹${(rel.price || 0).toLocaleString("en-IN")}`,
              originalPrice:
                rel.originalPrice && rel.originalPrice > rel.price
                  ? `₹${rel.originalPrice.toLocaleString("en-IN")}`
                  : "",
              discount: rel.discount ? `${rel.discount}% OFF` : "",
              rating: Math.min(5, Math.max(1, Math.round(rel.rating || 5))),
              reviewsCount: rel.reviewCount || rel.reviewsCount || 0,
              images:
                Array.isArray(rel.images) && rel.images.length > 0
                  ? rel.images
                  : [rel.image || "/images/collections/sofa.jpg"],
              shortDescription: rel.description || "",
              material: rel.material || "Solid Wood",
              dimensions: rel.dimensions || "",
              finish: rel.color || "Teak Finish",
              hasVariants: rel.hasVariants || false,
              variants: rel.variants || [],
            }));
          setRelatedProducts(formattedRelated);
        }
      } catch (relatedErr) {
        console.warn("Related products load error:", relatedErr);
      }
    } catch (err: any) {
      console.error("Load Product Error:", err);
      setErrorMsg(err.message || "Network connection error.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  // Active Variants state management
  const activeVariants = React.useMemo(() => {
    if (product && product.hasVariants && Array.isArray(product.variants)) {
      return product.variants.filter((v: any) => v.status !== "inactive");
    }
    return [];
  }, [product]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (activeVariants.length > 0) {
      setSelectedVariantId(String(activeVariants[0]._id || activeVariants[0].id));
    } else {
      setSelectedVariantId(null);
    }
  }, [activeVariants]);

  const selectedVariant = React.useMemo(() => {
    if (!selectedVariantId || activeVariants.length === 0) return null;
    return activeVariants.find((v: any) => String(v._id || v.id) === selectedVariantId) || activeVariants[0];
  }, [selectedVariantId, activeVariants]);

  const currentGalleryImages = React.useMemo(() => {
    if (selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product?.images || ["/images/collections/sofa.jpg"];
  }, [selectedVariant, product]);

  // Render 404 Page if product is not found
  if (notFound) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F] flex flex-col justify-between">
        <Navbar />
        <main className="py-20 my-auto">
          <Container>
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E5E5] shadow-sm gap-5">
              <div className="w-16 h-16 rounded-full bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center text-3xl font-bold">
                🪑
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-3xl text-[#1F1F1F]">
                Product Not Found
              </h1>
              <p className="text-sm text-[#666666] leading-relaxed">
                The handcrafted furniture item you are looking for does not exist or has been removed from our collection.
              </p>
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-colors"
              >
                Browse All Collections →
              </Link>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Render Network Error State with Retry Button
  if (errorMsg && !isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F] flex flex-col justify-between">
        <Navbar />
        <main className="py-20 my-auto">
          <Container>
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E5E5] shadow-sm gap-5">
              <span className="text-4xl">⚠️</span>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
                Unable to Load Product
              </h1>
              <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                {errorMsg}
              </p>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => loadProductData(true)}
                className="cursor-pointer"
              >
                🔄 Retry Loading Product
              </Button>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Render Skeleton Loader while fetching data
  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F]">
        <Navbar />
        <main className="py-10 sm:py-16">
          <Container>
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse mb-8" />

            {/* Main Product Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Left Gallery Skeleton */}
              <div className="flex flex-col gap-4">
                <div className="h-[420px] sm:h-[500px] w-full bg-zinc-200 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-20 w-full bg-zinc-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Right Product Info Skeleton */}
              <div className="flex flex-col gap-5">
                <div className="h-4 w-1/4 bg-zinc-200 rounded animate-pulse" />
                <div className="h-8 w-3/4 bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-zinc-200 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-zinc-200 rounded animate-pulse mt-2" />
                <div className="h-20 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-zinc-200 rounded animate-pulse" />
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] flex flex-col justify-between">
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#666666] mb-8 flex-wrap">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#A67C52] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop/${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="hover:text-[#A67C52] transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#1F1F1F] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left: Product Gallery (Displays selected color variant's images) */}
            <ProductGallery images={currentGalleryImages} alt={product.name} />

            {/* Right: Product Info & Color Variant Selector */}
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              activeVariants={activeVariants}
              onSelectVariant={(vId) => setSelectedVariantId(vId)}
            />
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-[#E5E5E5]/60">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
