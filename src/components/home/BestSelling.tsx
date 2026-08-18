"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { fetchJsonCached } from "@/lib/apiClient";
import { PRODUCTS_DATA, Product as StaticProduct } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumeric: number;
  originalPrice?: string;
  discount?: string;
  rating: number;
  image: string;
  images: string[];
  inStock: boolean;
  hasVariants?: boolean;
  variants?: { colorCode?: string; colorName?: string }[];
}

function BestSellerCardImage({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: DisplayProduct;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/images/products/Soaafa.jpeg"];

  // Progressive preloading of secondary images ONLY when hovered
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
      className="relative h-[300px] w-full overflow-hidden bg-[#FAF8F5] block group/img cursor-pointer"
    >
      <Link href={`/product/${product.id}`} className="relative h-full w-full block">
        <Image
          key={currentImage}
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

      {/* Image Counter Indicator on Hover */}
      {isHovered && images.length > 1 && (
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1.5 animate-pulse pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-ping" />
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default function BestSelling() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fetchBestSellers = useCallback(async (bypassCache = false) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetchJsonCached<{ success: boolean; products: any[] }>(
        "/api/products?bestseller=true&limit=8",
        {},
        bypassCache
      );

      if (res.success && res.data && Array.isArray(res.data.products) && res.data.products.length > 0) {
        const formatted: DisplayProduct[] = res.data.products.map((p: any) => ({
          id: String(p._id || p.id),
          name: p.name,
          category: (p.category || "LIVING ROOM").toUpperCase(),
          price: `₹${(p.price || 0).toLocaleString("en-IN")}`,
          priceNumeric: p.price || 0,
          originalPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString("en-IN")}` : undefined,
          discount: p.discount ? `${p.discount}% OFF` : undefined,
          rating: Math.min(5, Math.max(1, Math.round(p.rating || 5))),
          image: p.image || (Array.isArray(p.images) && p.images[0]) || "/images/products/Soaafa.jpeg",
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/images/products/Soaafa.jpeg"],
          inStock: p.stock === undefined || p.stock > 0,
          hasVariants: p.hasVariants || false,
          variants: Array.isArray(p.variants) ? p.variants : [],
        }));
        setProducts(formatted);
        setLoading(false);
        return;
      }

      // Fallback if no best sellers found in DB
      const fallbackList: DisplayProduct[] = PRODUCTS_DATA.slice(0, 4).map((sp: StaticProduct) => ({
        id: String(sp.id),
        name: sp.name,
        category: sp.category,
        price: sp.price,
        priceNumeric: sp.priceNumeric,
        originalPrice: sp.originalPrice,
        discount: sp.discount,
        rating: sp.rating,
        image: sp.image,
        images: [sp.image],
        inStock: sp.inStock,
      }));
      setProducts(fallbackList);
    } catch (err: any) {
      console.error("Fetch Best Sellers Error:", err);
      setErrorMsg(err.message || "Failed to load best sellers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.priceNumeric,
      image: product.image,
      quantity: 1,
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section className="py-24 bg-white border-t border-[#E5E5E5]/50">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 md:gap-5">
          {/* Small Label */}
          <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            BEST SELLERS
          </span>

          {/* Main Heading */}
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F1F1F] leading-tight">
            Our Most Loved Furniture
          </h2>

          {/* Description */}
          <p className="max-w-[700px] text-base md:text-lg text-[#666666] leading-relaxed mx-auto">
            Discover our best-selling handcrafted furniture pieces loved by
            customers for their timeless beauty, premium quality and exceptional
            comfort.
          </p>
        </div>

        {/* Product Grid / Skeletons / Error Retry */}
        {loading ? (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-[#E5E5E5]/80 overflow-hidden animate-pulse flex flex-col h-[380px]">
                <div className="h-[280px] w-full bg-zinc-200" />
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div className="h-4 w-1/3 bg-zinc-200 rounded-md" />
                  <div className="h-5 w-2/3 bg-zinc-200 rounded-md" />
                  <div className="h-6 w-1/2 bg-zinc-200 rounded-md mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="mt-16 py-12 text-center text-[#666666] bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5] flex flex-col items-center gap-4 max-w-md mx-auto">
            <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            <button
              type="button"
              onClick={() => fetchBestSellers(true)}
              className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer"
            >
              🔄 Retry Loading Products
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 py-12 text-center text-[#666666] bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]">
            No best sellers available at the moment. Explore our full catalog in shop.
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  _id: product.id,
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  price: product.priceNumeric,
                  originalPrice: product.originalPrice ? Number(String(product.originalPrice).replace(/[^0-9.]/g, "")) : undefined,
                  discount: product.discount,
                  rating: product.rating,
                  image: product.image,
                  images: product.images,
                  inStock: product.inStock,
                  isBestSeller: true,
                  hasVariants: product.hasVariants,
                  variants: product.variants,
                }}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
