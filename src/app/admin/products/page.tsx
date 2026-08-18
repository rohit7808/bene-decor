"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  hasVariants?: boolean;
  variants?: any[];
  createdAt: string;
}

interface InventorySummary {
  totalProductsCount: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface PaginationMeta {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary>({
    totalProductsCount: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Stock Adjustment Modal
  const [stockModal, setStockModal] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
    action: "add" | "remove" | "set";
    quantity: number;
  }>({
    isOpen: false,
    product: null,
    action: "add",
    quantity: 5,
  });

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
  }>({
    isOpen: false,
    product: null,
  });

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery.trim(),
        category: categoryFilter,
        stockStatus: stockStatusFilter,
        isAvailable: activeFilter,
        sort: sortOption,
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        if (data.inventorySummary) setInventorySummary(data.inventorySummary);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setErrorMsg(data.error || "Failed to fetch products catalog.");
      }
    } catch (err) {
      console.error("Fetch admin products error:", err);
      setErrorMsg("An unexpected error occurred while fetching products.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, stockStatusFilter, activeFilter, sortOption]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Quick Stock Update
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModal.product) return;

    try {
      const res = await fetch(`/api/admin/products/${stockModal.product._id}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: stockModal.action,
          quantity: Number(stockModal.quantity) || 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setToastMsg(data.message || "Stock updated successfully!");
        setTimeout(() => setToastMsg(null), 3500);
        setStockModal({ isOpen: false, product: null, action: "add", quantity: 5 });
        fetchProducts();
      } else {
        alert(data.error || "Failed to update stock.");
      }
    } catch (err) {
      console.error("Stock update error:", err);
      alert("An unexpected error occurred while updating stock.");
    }
  };

  // Handle Deactivation / Soft Delete
  const confirmDeleteProduct = async () => {
    if (!deleteModal.product) return;
    const prodId = deleteModal.product._id;

    try {
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg("✓ Product deactivated successfully.");
        setTimeout(() => setToastMsg(null), 3500);
        setDeleteModal({ isOpen: false, product: null });
        fetchProducts();
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      alert("An unexpected error occurred.");
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg(`Product status changed to ${!product.isAvailable ? "Active" : "Inactive"}`);
        setTimeout(() => setToastMsg(null), 3000);
        fetchProducts();
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header Title & Add Product Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Product &amp; Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Manage furniture catalog items, track stock thresholds, and adjust inventory levels.
            </p>
          </div>

          <Link
            href="/admin/products/add"
            className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 flex items-center gap-2 w-fit cursor-pointer"
          >
            <span>➕</span>
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Inventory Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#666666] uppercase">Total Products</span>
            <span className="text-2xl font-bold text-[#1F1F1F]">{inventorySummary.totalProductsCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase flex items-center gap-1">
              🟢 In Stock
            </span>
            <span className="text-2xl font-bold text-emerald-900">{inventorySummary.inStock}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-800 uppercase flex items-center gap-1">
              🟠 Low Stock
            </span>
            <span className="text-2xl font-bold text-amber-900">{inventorySummary.lowStock}</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-rose-800 uppercase flex items-center gap-1">
              🔴 Out of Stock
            </span>
            <span className="text-2xl font-bold text-rose-900">{inventorySummary.outOfStock}</span>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Product Name, SKU, Category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-[#FAF8F5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
            />
            <span className="absolute left-3.5 top-3 text-sm text-[#666666]">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Dining">Dining</option>
              <option value="Office">Office</option>
              <option value="Storage">Storage</option>
            </select>

            <select
              value={stockStatusFilter}
              onChange={(e) => {
                setStockStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="InStock">🟢 In Stock (&gt;5)</option>
              <option value="LowStock">🟠 Low Stock (1-5)</option>
              <option value="OutOfStock">🔴 Out of Stock (0)</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ✕ {errorMsg}
          </div>
        )}

        {/* Product Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Loading products catalog from MongoDB...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">🛋️</span>
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
              No Products Found
            </h3>
            <p className="text-xs text-[#666666]">
              No catalog items matched your current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-2xl border border-[#E5E5E5]/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#666666] border-b border-[#E5E5E5]">
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                    {products.map((prod) => {
                      const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 5);
                      const isOutOfStock = prod.stock === 0;

                      return (
                        <tr key={prod._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#1F1F1F]">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                                {prod.images?.[0] ? (
                                  <Image
                                    src={prod.images[0]}
                                    alt={prod.name}
                                    fill
                                    sizes="48px"
                                    className="object-contain p-1"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs">
                                    🛋️
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-[#1F1F1F] line-clamp-1">
                                  {prod.name}
                                </span>
                                {prod.hasVariants && Array.isArray(prod.variants) && prod.variants.length > 0 && (
                                  <span className="text-[10px] font-bold text-[#3B82F6] flex items-center gap-1">
                                    🎨 {prod.variants.length} Color Variant{prod.variants.length > 1 ? "s" : ""}
                                  </span>
                                )}
                                {prod.isFeatured && (
                                  <span className="text-[10px] font-bold text-[#A67C52]">
                                    ★ Featured Product
                                  </span>
                                )}
                                {prod.isBestSeller && (
                                  <span className="text-[10px] font-bold text-amber-600">
                                    🔥 Best Seller
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-xs font-mono font-semibold text-[#666666]">
                            {prod.sku || "N/A"}
                          </td>

                          <td className="py-3 px-4 text-xs font-semibold text-[#1F1F1F]">
                            {prod.category}
                          </td>

                          <td className="py-3 px-4 font-bold">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                                  isOutOfStock
                                    ? "bg-rose-100 text-rose-800 border-rose-300"
                                    : isLowStock
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                                }`}
                              >
                                {isOutOfStock
                                  ? "🔴 0 (Out)"
                                  : isLowStock
                                  ? `🟠 ${prod.stock} left`
                                  : `🟢 ${prod.stock}`}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setStockModal({
                                    isOpen: true,
                                    product: prod,
                                    action: "add",
                                    quantity: 5,
                                  })
                                }
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] border border-[#E5E5E5] hover:bg-[#A67C52] hover:text-white transition-colors cursor-pointer"
                                title="Quick Adjust Stock"
                              >
                                ✏️ Stock
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(prod)}
                              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full cursor-pointer ${
                                prod.isAvailable
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-zinc-200 text-zinc-600"
                              }`}
                            >
                              {prod.isAvailable ? "Active" : "Inactive"}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/products/edit/${prod._id}`}
                                className="px-3 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:bg-[#A67C52] hover:text-white transition-colors cursor-pointer"
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                onClick={() => setDeleteModal({ isOpen: true, product: prod })}
                                className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                Deactivate
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5E5]/80 shadow-sm text-xs">
                <span className="text-[#666666]">
                  Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalProducts} products)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] disabled:opacity-40 cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages || isLoading}
                    className="px-4 py-2 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] disabled:opacity-40 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Stock Adjustment Modal */}
        {stockModal.isOpen && stockModal.product && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E5E5] shadow-2xl flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Adjust Inventory Stock
                </h3>
                <button
                  onClick={() => setStockModal({ isOpen: false, product: null, action: "add", quantity: 5 })}
                  className="text-lg font-bold text-[#666666] hover:text-[#1F1F1F] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-[#666666]">
                Product: <strong className="text-[#1F1F1F]">{stockModal.product.name}</strong> <br />
                Current Stock: <strong className="text-[#A67C52]">{stockModal.product.stock} units</strong>
              </div>

              <form onSubmit={handleStockSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">Action</label>
                  <select
                    value={stockModal.action}
                    onChange={(e) =>
                      setStockModal({ ...stockModal, action: e.target.value as any })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] cursor-pointer"
                  >
                    <option value="add">➕ Add Stock (+)</option>
                    <option value="remove">➖ Remove Stock (-)</option>
                    <option value="set">⚙️ Set Exact Stock (=)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1F1F1F]">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={stockModal.quantity}
                    onChange={(e) =>
                      setStockModal({ ...stockModal, quantity: Math.max(0, parseInt(e.target.value, 10) || 0) })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] font-semibold text-[#1F1F1F]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStockModal({ isOpen: false, product: null, action: "add", quantity: 5 })}
                    className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer"
                  >
                    Save Stock Changes →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.product && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E5E5] shadow-2xl flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                  ⚠️
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Deactivate Product
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Deactivating this product will hide it from the storefront while safely preserving all historical customer orders and invoices.
                </p>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] font-bold text-xs text-[#1F1F1F]">
                  {deleteModal.product.name}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, product: null })}
                  className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Confirm Deactivation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}
