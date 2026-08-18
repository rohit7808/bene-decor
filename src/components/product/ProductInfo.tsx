"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface ProductVariantData {
  _id?: string;
  id?: string;
  colorName: string;
  colorCode: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
  images: string[];
  status: "active" | "inactive";
}

export interface ProductData {
  id: number | string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  shortDescription: string;
  material: string;
  dimensions: string;
  finish: string;
  brand?: string;
  color?: string;
  weight?: string;
  stockStatus?: string;
  sku?: string;
  isAvailable?: boolean;
  tags?: string[];
  warranty?: string;
  deliveryTime?: string;
  careInstructions?: string;
  hasVariants?: boolean;
  variants?: ProductVariantData[];
}

interface ProductInfoProps {
  product: ProductData;
  selectedVariant?: ProductVariantData | null;
  activeVariants?: ProductVariantData[];
  onSelectVariant?: (variantId: string) => void;
}

export default function ProductInfo({
  product,
  selectedVariant,
  activeVariants = [],
  onSelectVariant,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const productIdStr = String(product.id);
  const isWishlisted = isInWishlist(productIdStr);

  // Variant dynamic pricing, stock & status overrides
  const displayPrice = selectedVariant
    ? `₹${selectedVariant.price.toLocaleString("en-IN")}`
    : product.price;

  const displayOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
      ? `₹${selectedVariant.originalPrice.toLocaleString("en-IN")}`
      : ""
    : product.originalPrice;

  const displayDiscount = selectedVariant
    ? selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
      ? `${Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}% OFF`
      : ""
    : product.discount;

  const currentStock = selectedVariant ? selectedVariant.stock : 10;
  const isAvailable = selectedVariant
    ? selectedVariant.stock > 0 && selectedVariant.status === "active"
    : product.isAvailable !== false && product.stockStatus !== "Out of Stock";

  const displaySku = selectedVariant?.sku || product.sku;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);

      const numPrice = selectedVariant
        ? selectedVariant.price
        : Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;

      const variantImage =
        selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images[0]
          ? selectedVariant.images[0]
          : product.images[0] || "/images/collections/sofa.jpg";

      await addToCart({
        productId: productIdStr,
        variantId: selectedVariant ? String(selectedVariant._id || selectedVariant.id) : undefined,
        colorName: selectedVariant?.colorName,
        colorCode: selectedVariant?.colorCode,
        sku: displaySku,
        name: product.name,
        price: numPrice,
        image: variantImage,
        quantity,
      });

      const colorLabel = selectedVariant ? ` (${selectedVariant.colorName})` : "";
      setToastMessage(`✓ Added ${quantity} × ${product.name}${colorLabel} to your cart!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    const numericPrice = selectedVariant
      ? selectedVariant.price
      : Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;

    const numericOrigPrice = selectedVariant
      ? selectedVariant.originalPrice || 0
      : product.originalPrice
      ? Number(String(product.originalPrice).replace(/[^0-9.]/g, "")) || 0
      : 0;

    const added = await toggleWishlist({
      productId: productIdStr,
      name: product.name,
      price: numericPrice,
      originalPrice: numericOrigPrice,
      image: product.images[0] || "/images/collections/sofa.jpg",
      category: product.category,
      isAvailable,
    });

    setToastMessage(
      added ? "✓ Product added to your Wishlist!" : "Removed from your Wishlist."
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
          {toastMessage}
        </div>
      )}

      {/* Category & Stock Status Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
          {product.category}
        </span>

        {isAvailable ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
            ✓ In Stock {selectedVariant ? `(${currentStock} left)` : ""}
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            ✕ Out of Stock
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F] leading-tight">
        {product.name}
      </h1>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-3">
        <div className="flex text-[#A67C52] text-lg">
          {"★".repeat(product.rating || 5)}
        </div>
        <span className="text-sm font-medium text-[#666666]">
          {(product.rating || 5).toFixed(1)} ({product.reviewsCount} Customer Reviews)
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
          {displayPrice}
        </span>
        {displayOriginalPrice && (
          <span className="text-base text-[#666666] line-through">
            {displayOriginalPrice}
          </span>
        )}
        {displayDiscount && (
          <span className="text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#16A34A]/20">
            {displayDiscount}
          </span>
        )}
      </div>

      {/* SKU Badge if available */}
      {displaySku && (
        <div className="text-xs text-[#666666]">
          SKU: <span className="font-mono text-[#A67C52] font-semibold">{displaySku}</span>
        </div>
      )}

      {/* DYNAMIC COLOR VARIANT SELECTOR */}
      {activeVariants && activeVariants.length > 0 && (
        <div className="flex flex-col gap-3 py-4 border-y border-[#E5E5E5]/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">
              Color:{" "}
              <span className="font-extrabold text-[#A67C52] normal-case ml-1">
                {selectedVariant?.colorName || "Select Color"}
              </span>
            </span>
            {selectedVariant && selectedVariant.stock <= 0 && (
              <span className="text-xs font-bold text-rose-600">Out of Stock for this color</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {activeVariants.map((v) => {
              const vId = String(v._id || v.id);
              const isSelected = selectedVariant && String(selectedVariant._id || selectedVariant.id) === vId;
              const isOutOfStock = v.stock <= 0;

              return (
                <button
                  key={vId}
                  type="button"
                  onClick={() => onSelectVariant && onSelectVariant(vId)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#A67C52] bg-[#A67C52]/10 ring-2 ring-[#A67C52]/20 font-bold scale-[1.02]"
                      : "border-[#E5E5E5] bg-white hover:border-[#A67C52]/50 text-[#1F1F1F]"
                  } ${isOutOfStock ? "opacity-60" : ""}`}
                >
                  {/* Swatch Color Circle */}
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                    style={{ backgroundColor: v.colorCode || "#A67C52" }}
                  />
                  <span className="text-xs sm:text-sm font-semibold">{v.colorName}</span>
                  {isOutOfStock && (
                    <span className="text-[10px] text-rose-600 font-bold ml-0.5">(Sold Out)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Short Description */}
      <p className="text-sm text-[#666666] leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Action Controls: Quantity, Add to Cart & Wishlist */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-[#E5E5E5]/70">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border border-[#E5E5E5] rounded-xl p-1 bg-[#FAF8F5] sm:w-36 shrink-0">
          <button
            type="button"
            onClick={decrementQty}
            aria-label="Decrease quantity"
            disabled={!isAvailable}
            className="w-9 h-9 flex items-center justify-center font-bold text-[#1F1F1F] hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            −
          </button>
          <span className="font-bold text-sm text-[#1F1F1F]">{quantity}</span>
          <button
            type="button"
            onClick={incrementQty}
            aria-label="Increase quantity"
            disabled={!isAvailable}
            className="w-9 h-9 flex items-center justify-center font-bold text-[#1F1F1F] hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className="flex-1 shadow-md hover:shadow-lg cursor-pointer"
        >
          {isAdding
            ? "Adding to Cart..."
            : !isAvailable
            ? "Out of Stock"
            : `Add to Cart • ${displayPrice}`}
        </Button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isWishlisted
              ? "bg-[#A67C52] text-white border-[#A67C52]"
              : "bg-white border-[#E5E5E5] text-[#1F1F1F] hover:text-[#A67C52] hover:border-[#A67C52]"
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
      </div>

      {/* Product Specifications & Details Box */}
      <div className="mt-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/70 flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
          Product Specifications
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#666666]">Material:</span>
            <p className="font-semibold text-[#1F1F1F]">{product.material || "Solid Wood"}</p>
          </div>
          <div>
            <span className="text-[#666666]">Dimensions:</span>
            <p className="font-semibold text-[#1F1F1F]">{product.dimensions || "Not specified"}</p>
          </div>
          <div>
            <span className="text-[#666666]">Weight:</span>
            <p className="font-semibold text-[#1F1F1F]">{product.weight || "Not specified"}</p>
          </div>
          <div>
            <span className="text-[#666666]">Brand:</span>
            <p className="font-semibold text-[#1F1F1F]">{product.brand || "Bené Decor"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
