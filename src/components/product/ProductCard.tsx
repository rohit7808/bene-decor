"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface ColorVariant {
  _id?: string;
  id?: string;
  colorName?: string;
  colorCode?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  sku?: string;
  images?: string[];
  status?: "active" | "inactive";
}

export interface ProductCardData {
  _id?: string;
  id?: number | string;
  name: string;
  category: string;
  subCategory?: string;
  price: number | string;
  originalPrice?: number | string;
  discount?: number | string;
  rating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  images?: string[];
  image?: string;
  inStock?: boolean;
  isAvailable?: boolean;
  isNewArrival?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  stock?: number;
  sku?: string;
  shortDescription?: string;
  description?: string;
  hasVariants?: boolean;
  variants?: ColorVariant[];
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  className = "",
  viewMode = "grid",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Normalize Product ID
  const productId = String(product._id || product.id || "");

  // Color Variants Filtering
  const activeVariants = useMemo(() => {
    if (product.hasVariants && Array.isArray(product.variants)) {
      return product.variants.filter((v) => v.status !== "inactive");
    }
    return [];
  }, [product]);

  // Selected Variant State (Default to first variant if present)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    activeVariants.length > 0 ? String(activeVariants[0]._id || activeVariants[0].id) : null
  );

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || activeVariants.length === 0) return null;
    return (
      activeVariants.find(
        (v) => String(v._id || v.id) === selectedVariantId
      ) || activeVariants[0]
    );
  }, [selectedVariantId, activeVariants]);

  // Images for display & slideshow
  const images = useMemo(() => {
    if (selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image) {
      return [product.image];
    }
    return ["/images/collections/sofa.jpg"];
  }, [selectedVariant, product]);

  // Image Hover Auto-Cycling State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCycling = useCallback(() => {
    if (images.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsHovered(true);
    timerRef.current = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 1000);
  }, [images.length]);

  const stopCycling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(false);
    setCurrentImgIndex(0);
  }, []);

  // UI state for Add to Cart feedback
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Price Parsing
  const rawPrice = selectedVariant?.price !== undefined ? selectedVariant.price : product.price;
  const numPrice = typeof rawPrice === "number" ? rawPrice : Number(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

  const rawOrigPrice = selectedVariant?.originalPrice !== undefined ? selectedVariant.originalPrice : product.originalPrice;
  const numOrigPrice = typeof rawOrigPrice === "number" ? rawOrigPrice : Number(String(rawOrigPrice).replace(/[^0-9.]/g, "")) || 0;

  const discountPercent = useMemo(() => {
    if (numOrigPrice > numPrice && numPrice > 0) {
      return Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100);
    }
    if (product.discount) {
      const parsedD = Number(String(product.discount).replace(/[^0-9.]/g, ""));
      return isNaN(parsedD) ? null : Math.round(parsedD);
    }
    return null;
  }, [numOrigPrice, numPrice, product.discount]);

  // Stock & Availability
  const isAvailable = useMemo(() => {
    if (selectedVariant) {
      return (selectedVariant.stock ?? 10) > 0 && selectedVariant.status !== "inactive";
    }
    if (product.isAvailable === false || product.inStock === false) return false;
    if (product.stock !== undefined && product.stock <= 0) return false;
    return true;
  }, [selectedVariant, product]);

  const isWishlisted = isInWishlist(productId);

  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable || isAdding) return;

    try {
      setIsAdding(true);
      const variantImg = images[0] || "/images/collections/sofa.jpg";

      await addToCart({
        productId,
        variantId: selectedVariant ? String(selectedVariant._id || selectedVariant.id) : undefined,
        colorName: selectedVariant?.colorName,
        colorCode: selectedVariant?.colorCode,
        sku: selectedVariant?.sku || product.sku,
        name: product.name,
        price: numPrice,
        image: variantImg,
        quantity: 1,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error("Cart Add Error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId,
      name: product.name,
      price: numPrice,
      originalPrice: numOrigPrice,
      image: images[0] || "/images/collections/sofa.jpg",
      category: product.category,
      isAvailable,
    });
  };

  const currentDisplayImage = images[currentImgIndex] || images[0] || "/images/collections/sofa.jpg";
  const rating = Math.min(5, Math.max(1, Math.round(product.rating || 5)));
  const reviewsCount = product.reviewsCount || product.reviewCount || 0;

  // New Arrival / Best Seller Badge Check
  const showNewBadge = product.isNewArrival || product.isNew;
  const showBestSellerBadge = !showNewBadge && product.isBestSeller;

  return (
    <div
      className={`group relative flex ${
        viewMode === "grid" ? "flex-col h-full" : "flex-col sm:flex-row"
      } rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden ${className}`}
    >
      {/* 1. IMAGE CONTAINER (Fixed Aspect Ratio 4:5, object-fit contain) */}
      <div
        className={`relative w-full ${
          viewMode === "grid" ? "aspect-[4/5]" : "sm:w-64 aspect-[4/5] sm:aspect-square shrink-0"
        } bg-[#FAF8F5] flex items-center justify-center overflow-hidden border-b border-[#E5E5E5]/60 group/card-img`}
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        <Link href={`/product/${productId}`} className="relative w-full h-full block">
          <Image
            key={currentDisplayImage}
            src={currentDisplayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
            className="object-contain p-3 sm:p-4 group-hover/card-img:scale-105 transition-all duration-500 ease-out"
          />
        </Link>

        {/* TOP-LEFT BADGES (New Arrival / Best Seller) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {showNewBadge && (
            <span className="px-2.5 py-1 rounded-full bg-[#1F1F1F] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              New Arrival
            </span>
          )}
          {showBestSellerBadge && (
            <span className="px-2.5 py-1 rounded-full bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* TOP-RIGHT WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer border ${
            isWishlisted
              ? "bg-[#A67C52] text-white border-[#A67C52] scale-110"
              : "bg-white/90 backdrop-blur-md text-[#1F1F1F] border-black/5 hover:text-[#A67C52] hover:scale-110"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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

        {/* IMAGE HOVER COUNTER INDICATOR */}
        {isHovered && images.length > 1 && (
          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1.5 animate-pulse pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" />
            {currentImgIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFORMATION CONTENT */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2 justify-between">
        <div className="flex flex-col gap-1.5">
          {/* Category */}
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#A67C52] line-clamp-1">
            {product.category}
          </span>

          {/* Product Name (Max 2 lines, aligned height) */}
          <Link href={`/product/${productId}`}>
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center">
              {product.name}
            </h3>
          </Link>

          {/* DYNAMIC COLOR VARIANTS SWATCHES (If > 1 active color variant) */}
          {activeVariants.length > 1 && (
            <div className="flex items-center justify-between gap-2 my-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeVariants.slice(0, 5).map((v) => {
                  const vId = String(v._id || v.id);
                  const isSelected = selectedVariantId === vId;
                  return (
                    <button
                      key={vId}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariantId(vId);
                      }}
                      className={`w-4 h-4 rounded-full border transition-transform duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#A67C52] ring-2 ring-[#A67C52]/30 scale-110"
                          : "border-black/20 hover:scale-110"
                      }`}
                      style={{ backgroundColor: v.colorCode || "#A67C52" }}
                      title={v.colorName}
                    />
                  );
                })}
              </div>

              <span className="text-[11px] font-bold text-[#666666] shrink-0">
                {activeVariants.length > 5
                  ? `+${activeVariants.length - 5} more`
                  : `${activeVariants.length} Colors`}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-[#A67C52]">
            <span>{"★".repeat(rating)}</span>
            <span className="text-[11px] font-medium text-[#666666] ml-1">
              ({reviewsCount})
            </span>
          </div>

          {/* List View Description */}
          {viewMode === "list" && (
            <p className="text-xs text-[#666666] line-clamp-2 mt-1">
              {product.shortDescription || product.description}
            </p>
          )}
        </div>

        {/* 3. BOTTOM PRICE & ADD TO CART (Sticks to bottom of card) */}
        <div className="mt-auto pt-3 border-t border-[#E5E5E5]/60 flex flex-col gap-3">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-base sm:text-lg text-[#1F1F1F]">
              ₹{numPrice.toLocaleString("en-IN")}
            </span>

            {numOrigPrice > numPrice && (
              <span className="text-xs text-[#666666] line-through">
                ₹{numOrigPrice.toLocaleString("en-IN")}
              </span>
            )}

            {discountPercent && discountPercent > 0 && (
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full border border-[#16A34A]/20">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              justAdded
                ? "bg-emerald-700 text-white"
                : !isAvailable
                ? "bg-rose-50 text-rose-600 border border-rose-200 cursor-not-allowed opacity-80"
                : "bg-[#A67C52] text-white hover:bg-[#8e6843] hover:shadow-md"
            }`}
          >
            {justAdded ? (
              <span>✓ Added to Cart!</span>
            ) : !isAvailable ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <span>🛒</span>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
