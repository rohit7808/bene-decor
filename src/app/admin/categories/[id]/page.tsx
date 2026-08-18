"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface CategoryDetail {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  productCount: number;
}

interface ProductItem {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  images: string[];
  category: string;
}

export default function AdminCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Move product category modal
  const [moveModal, setMoveModal] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
    targetCategory: string;
  }>({
    isOpen: false,
    product: null,
    targetCategory: "",
  });

  // Fetch category & assigned products
  const fetchCategoryDetail = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch(`/api/admin/categories/${id}`, { credentials: "same-origin" });
      const data = await res.json();

      if (data.success && data.category) {
        setCategory(data.category);
        setProducts(data.products || []);
      } else {
        setErrorMsg(data.error || "Category not found.");
      }
    } catch (err) {
      console.error("Fetch Category Detail Error:", err);
      setErrorMsg("Failed to load category details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all categories for move modal dropdown
  const fetchAllCategories = async () => {
    try {
      const res = await fetch(`/api/admin/categories`, { credentials: "same-origin" });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setAllCategories(
          data.categories.map((c: any) => ({
            id: c.id || c._id,
            name: c.name,
          }))
        );
      }
    } catch (err) {
      console.error("Fetch all categories error:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategoryDetail();
      fetchAllCategories();
    }
  }, [id]);

  // Execute moving product to a different category
  const handleMoveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveModal.product || !moveModal.targetCategory) return;

    try {
      const prodId = moveModal.product._id;
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ category: moveModal.targetCategory }),
      });

      const data = await res.json();

      if (data.success) {
        setToastMsg(`✓ Moved '${moveModal.product.name}' to category '${moveModal.targetCategory}'`);
        setTimeout(() => setToastMsg(null), 3500);
        setMoveModal({ isOpen: false, product: null, targetCategory: "" });
        fetchCategoryDetail();
      } else {
        alert(data.error || "Failed to reassign product category.");
      }
    } catch (err) {
      console.error("Move product category error:", err);
      alert("An error occurred while moving product.");
    }
  };

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-5xl mx-auto p-12 text-center text-sm text-[#666666] animate-pulse">
          ⏳ Loading category details from MongoDB...
        </div>
      </AdminProtectedRoute>
    );
  }

  if (errorMsg || !category) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-rose-200 text-center flex flex-col items-center gap-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
            Category Not Found
          </h2>
          <p className="text-xs text-[#666666]">{errorMsg || "Requested category does not exist."}</p>
          <Link
            href="/admin/categories"
            className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors"
          >
            ← Back to Categories Catalog
          </Link>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin/categories"
              className="text-xs font-bold text-[#A67C52] hover:underline flex items-center gap-1 w-fit mb-1"
            >
              ← Back to Categories
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                {category.name}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  category.isActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-zinc-200 text-zinc-700 border border-zinc-300"
                }`}
              >
                {category.isActive ? "🟢 Active Category" : "⚫ Inactive"}
              </span>
              {category.isFeatured && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                  ★ Featured Collection
                </span>
              )}
            </div>
            <span className="text-xs text-[#666666]">
              Slug: <strong className="font-mono text-[#1F1F1F]">/{category.slug}</strong> | Assigned Products: <strong className="text-[#A67C52]">{category.productCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/products/add`}
              className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] bg-white hover:border-[#A67C52] transition-colors"
            >
              ➕ Add Product to Catalog
            </Link>

            <Link
              href={`/admin/categories/${category.id || category._id}/edit`}
              className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>✏️</span>
              <span>Edit Category</span>
            </Link>
          </div>
        </div>

        {/* Banner Preview & Description Box */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 h-52 md:h-auto bg-zinc-100">
            <Image
              src={category.image || "/images/collections/sofa.jpg"}
              alt={category.name}
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Category Banner &amp; Summary
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                {category.description || "No category description provided."}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-[#E5E5E5]/80 text-xs text-[#666666]">
              <span>Priority Order: <strong className="text-[#1F1F1F]">{category.sortOrder}</strong></span>
              <span>Parent Category: <strong className="text-[#1F1F1F]">{category.parentCategory || "None (Root)"}</strong></span>
            </div>
          </div>
        </div>

        {/* Assigned Products Section */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Assigned Furniture Products ({products.length})
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Manage items belonging to the '{category.name}' category.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[#666666] flex flex-col items-center gap-2">
              <span className="text-3xl">🛋️</span>
              <span className="font-bold text-[#1F1F1F]">No Products Currently Assigned</span>
              <span>Create a new product or reassign existing products to '{category.name}'.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#666666] border-b border-[#E5E5E5]">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1F1F1F]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-[#E5E5E5] shrink-0">
                            {prod.images?.[0] ? (
                              <Image src={prod.images[0]} alt={prod.name} fill sizes="40px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">🛋️</div>
                            )}
                          </div>
                          <span className="font-bold text-sm text-[#1F1F1F] line-clamp-1">{prod.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono font-semibold text-[#666666]">
                        {prod.sku || "N/A"}
                      </td>

                      <td className="py-3 px-4 font-bold">₹{prod.price.toLocaleString("en-IN")}</td>

                      <td className="py-3 px-4">
                        {prod.stock > 5 ? (
                          <span className="text-emerald-700 font-bold">🟢 {prod.stock}</span>
                        ) : prod.stock > 0 ? (
                          <span className="text-amber-700 font-bold">🟠 {prod.stock} left</span>
                        ) : (
                          <span className="text-rose-700 font-bold">🔴 Out of Stock</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                            prod.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {prod.isAvailable ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMoveModal({
                                isOpen: true,
                                product: prod,
                                targetCategory: category.name,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] cursor-pointer"
                          >
                            Move Category
                          </button>

                          <Link
                            href={`/admin/products/${prod._id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:bg-[#A67C52] hover:text-white transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Move Product Category Modal */}
        {moveModal.isOpen && moveModal.product && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E5E5] shadow-2xl flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Reassign Product Category
                </h3>
                <button
                  onClick={() => setMoveModal({ isOpen: false, product: null, targetCategory: "" })}
                  className="text-lg font-bold text-[#666666] hover:text-[#1F1F1F] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-[#666666]">
                Product: <strong className="text-[#1F1F1F]">{moveModal.product.name}</strong> <br />
                Current Category: <strong className="text-[#A67C52]">{moveModal.product.category}</strong>
              </div>

              <form onSubmit={handleMoveProductSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#1F1F1F]">Select New Target Category</label>
                  <select
                    value={moveModal.targetCategory}
                    onChange={(e) => setMoveModal({ ...moveModal, targetCategory: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] cursor-pointer"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMoveModal({ isOpen: false, product: null, targetCategory: "" })}
                    className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer"
                  >
                    Reassign Category →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}
