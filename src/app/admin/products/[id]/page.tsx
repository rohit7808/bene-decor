"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  images: string[];
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Stock modifier state
  const [stockAction, setStockAction] = useState<"add" | "remove" | "set">("add");
  const [stockQty, setStockQty] = useState<number>(5);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // Fetch product detail
  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/admin/products/${id}`, { credentials: "same-origin" });
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setSelectedImage(data.product.images[0]);
          }
        } else {
          setErrorMsg(data.error || "Product not found.");
        }
      } catch (err) {
        console.error("Fetch product detail error:", err);
        setErrorMsg("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle stock modification
  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setIsUpdatingStock(true);
      setErrorMsg(null);

      const res = await fetch(`/api/admin/products/${id}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: stockAction,
          quantity: Number(stockQty) || 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProduct((prev) =>
          prev ? { ...prev, stock: data.stock, isAvailable: data.isAvailable } : null
        );
        setToastMsg(data.message || "Stock quantity updated successfully!");
        setTimeout(() => setToastMsg(null), 3500);
      } else {
        setErrorMsg(data.error || "Failed to update inventory.");
      }
    } catch (err) {
      console.error("Update inventory error:", err);
      setErrorMsg("An unexpected error occurred while modifying stock.");
    } finally {
      setIsUpdatingStock(false);
    }
  };

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-5xl mx-auto p-12 text-center text-sm text-[#666666] animate-pulse">
          ⏳ Loading product details from MongoDB...
        </div>
      </AdminProtectedRoute>
    );
  }

  if (errorMsg || !product) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-rose-200 text-center flex flex-col items-center gap-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
            Product Not Found
          </h2>
          <p className="text-xs text-[#666666]">{errorMsg || "Requested product does not exist."}</p>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors"
          >
            ← Back to Products Catalog
          </Link>
        </div>
      </AdminProtectedRoute>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product.stock === 0;

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#A67C52] hover:underline flex items-center gap-1 w-fit mb-1"
            >
              ← Back to Product Catalog
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                {product.name}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  isOutOfStock
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : isLowStock
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                }`}
              >
                {isOutOfStock ? "🔴 Out of Stock" : isLowStock ? `🟠 Low Stock (${product.stock})` : `🟢 In Stock (${product.stock})`}
              </span>
            </div>
            <span className="text-xs text-[#666666]">
              SKU: <strong className="font-mono text-[#1F1F1F]">{product.sku || "N/A"}</strong> | Category: <strong className="text-[#1F1F1F]">{product.category}</strong>
            </span>
          </div>

          <Link
            href={`/admin/products/edit/${product._id}`}
            className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 flex items-center gap-2 w-fit cursor-pointer"
          >
            <span>✏️</span>
            <span>Edit Product</span>
          </Link>
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Image Gallery & Description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Image Gallery Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-4">
              <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-zinc-100 border border-[#E5E5E5]">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[#666666]">
                    🛋️
                  </div>
                )}
              </div>

              {/* Thumbnails list */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pt-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-[#FAF8F5] shrink-0 transition-all ${
                        selectedImage === img
                          ? "border-[#A67C52] ring-2 ring-[#A67C52]/20"
                          : "border-[#E5E5E5] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="64px" className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Specifications Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                  Description
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-4 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mt-4">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/60">
                    <span className="text-xs text-[#666666]">Material</span>
                    <p className="font-semibold text-[#1F1F1F] mt-0.5">{product.material || "Solid Wood"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/60">
                    <span className="text-xs text-[#666666]">Color Finish</span>
                    <p className="font-semibold text-[#1F1F1F] mt-0.5">{product.color || "Natural Finish"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/60">
                    <span className="text-xs text-[#666666]">Dimensions</span>
                    <p className="font-semibold text-[#1F1F1F] mt-0.5">{product.dimensions || "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/60">
                    <span className="text-xs text-[#666666]">Brand</span>
                    <p className="font-semibold text-[#1F1F1F] mt-0.5">{product.brand || "Bené Decor"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inventory Summary & Modifier Form */}
          <div className="flex flex-col gap-6 w-full">
            {/* Inventory Modifier Form */}
            <form
              onSubmit={handleStockUpdate}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-4"
            >
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                Adjust Inventory Stock
              </h2>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]">
                <span className="text-xs text-[#666666]">Current Available Stock:</span>
                <span className="font-bold text-lg text-[#A67C52]">{product.stock} units</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Action</label>
                <select
                  value={stockAction}
                  onChange={(e) => setStockAction(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-xs font-bold text-[#1F1F1F]"
                >
                  <option value="add">➕ Add Stock (+)</option>
                  <option value="remove">➖ Remove Stock (-)</option>
                  <option value="set">⚙️ Set Exact Stock (=)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={stockQty}
                  onChange={(e) => setStockQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingStock}
                className="w-full py-3 rounded-xl bg-[#A67C52] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isUpdatingStock ? "Updating Stock..." : "Apply Stock Adjustment →"}
              </button>
            </form>

            {/* Inventory Meta Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-3 text-xs sm:text-sm">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                Catalog Audit Meta
              </h2>

              <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Selling Price</span>
                <strong className="text-[#1F1F1F] font-bold text-base">
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>
              </div>

              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
                  <span className="text-[#666666]">Original Price</span>
                  <span className="line-through text-[#666666]">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Low Stock Threshold</span>
                <strong className="text-[#1F1F1F]">{product.lowStockThreshold || 5} units</strong>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Active Status</span>
                <span className={`font-bold ${product.isAvailable ? "text-emerald-700" : "text-rose-700"}`}>
                  {product.isAvailable ? "Available for Purchase" : "Deactivated / Hidden"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Featured Listing</span>
                <strong className="text-[#1F1F1F]">{product.isFeatured ? "Yes ★" : "No"}</strong>
              </div>

              <div className="flex justify-between items-center py-2 text-[11px] text-[#666666]">
                <span>Created Date</span>
                <span>
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
