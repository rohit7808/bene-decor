"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface CategoryItem {
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
  createdAt?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [sortOption, setSortOption] = useState("sortOrder");

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: CategoryItem | null;
  }>({
    isOpen: false,
    category: null,
  });

  // Fetch Categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const params = new URLSearchParams({
        search: searchQuery.trim(),
        isActive: activeFilter,
        isFeatured: featuredFilter,
        sort: sortOption,
      });

      const res = await fetch(`/api/admin/categories?${params.toString()}`, {
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setErrorMsg(data.error || "Failed to fetch categories catalog.");
      }
    } catch (err) {
      console.error("Fetch admin categories error:", err);
      setErrorMsg("An unexpected error occurred while loading categories.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeFilter, featuredFilter, sortOption]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Toggle Active Status
  const handleToggleActive = async (cat: CategoryItem) => {
    const targetId = cat.id || cat._id;
    try {
      const res = await fetch(`/api/admin/categories/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg(`Category '${cat.name}' status set to ${!cat.isActive ? "Active" : "Inactive"}`);
        setTimeout(() => setToastMsg(null), 3000);
        fetchCategories();
      } else {
        alert(data.error || "Failed to update category status.");
      }
    } catch (err) {
      console.error("Toggle active status error:", err);
    }
  };

  // Confirm Delete Category
  const confirmDeleteCategory = async () => {
    if (!deleteModal.category) return;
    const targetId = deleteModal.category.id || deleteModal.category._id;

    try {
      const res = await fetch(`/api/admin/categories/${targetId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg(`✓ ${data.message}`);
        setTimeout(() => setToastMsg(null), 3500);
        setDeleteModal({ isOpen: false, category: null });
        fetchCategories();
      } else {
        alert(data.error || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      alert("An unexpected error occurred while deleting category.");
    }
  };

  // KPI Calculations
  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const featuredCount = categories.filter((c) => c.isFeatured).length;
  const totalCatalogProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header & Add Category Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Category &amp; Collection Management
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Organize signature furniture categories, collection banners, and product assignments.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 flex items-center gap-2 w-fit cursor-pointer"
          >
            <span>➕</span>
            <span>Add New Category</span>
          </Link>
        </div>

        {/* Category KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#666666] uppercase">Total Categories</span>
            <span className="text-2xl font-bold text-[#1F1F1F]">{totalCategories}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase flex items-center gap-1">
              🟢 Active Categories
            </span>
            <span className="text-2xl font-bold text-emerald-900">{activeCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-800 uppercase flex items-center gap-1">
              ★ Featured Collections
            </span>
            <span className="text-2xl font-bold text-amber-900">{featuredCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-zinc-700 uppercase flex items-center gap-1">
              🛋️ Catalog Products
            </span>
            <span className="text-2xl font-bold text-zinc-900">{totalCatalogProducts}</span>
          </div>
        </div>

        {/* Search, Filters & Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Category Name, Slug, Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-[#FAF8F5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
            />
            <span className="absolute left-3.5 top-3 text-sm text-[#666666]">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="All">All Collections</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer"
            >
              <option value="sortOrder">Sort: Priority Order</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ✕ {errorMsg}
          </div>
        )}

        {/* Category Grid Display */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Loading categories catalog from MongoDB...
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">📁</span>
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
              No Categories Found
            </h3>
            <p className="text-xs text-[#666666]">
              No categories matched your current filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const targetId = cat.id || cat._id;
              const imgSrc = cat.image || "/images/collections/sofa.jpg";

              return (
                <div
                  key={targetId}
                  className="bg-white rounded-2xl border border-[#E5E5E5]/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-[#FAF8F5]">
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain p-2"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-500/90 text-white border-emerald-600"
                            : "bg-zinc-800/90 text-zinc-300 border-zinc-900"
                        }`}
                      >
                        {cat.isActive ? "🟢 Active" : "⚫ Inactive"}
                      </button>

                      {cat.isFeatured && (
                        <span className="bg-amber-500/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-[#A67C52] border border-[#E5E5E5] shadow-xs">
                      {cat.productCount} Products
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E5E5] text-[#666666]">
                          Order: {cat.sortOrder}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-[#A67C52] font-semibold">
                        slug: /{cat.slug}
                      </span>

                      <p className="text-xs text-[#666666] leading-relaxed line-clamp-2 mt-1">
                        {cat.description || "No description provided."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E5E5]/60 flex items-center justify-between gap-2 mt-2">
                      <Link
                        href={`/admin/categories/${targetId}`}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:bg-[#A67C52] hover:text-white transition-colors cursor-pointer"
                      >
                        Manage Products ({cat.productCount})
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${targetId}/edit`}
                          className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:border-[#A67C52] transition-colors"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, category: cat })}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.category && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E5E5] shadow-2xl flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                  ⚠️
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Delete Category
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Are you sure you want to delete category <strong>'{deleteModal.category.name}'</strong>?
                </p>

                {deleteModal.category.productCount > 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold leading-relaxed">
                    ⚠️ Cannot Delete: This category currently contains {deleteModal.category.productCount} assigned product(s). Please move or reassign the products first before deleting.
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] font-bold text-xs text-[#1F1F1F]">
                    ✓ No assigned products found. Safe to delete.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, category: null })}
                  className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCategory}
                  disabled={deleteModal.category.productCount > 0}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}
