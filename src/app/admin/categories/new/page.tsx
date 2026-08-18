"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

export default function AddCategoryPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "/images/collections/sofa.jpg",
    parentCategory: "",
    sortOrder: "0",
    isActive: true,
    isFeatured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload image to Cloudinary via /api/upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const file = files[0];
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, image: result.url }));
      } else {
        setErrorMessage(result.error || "Failed to upload category image.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setErrorMessage("Error connecting to upload API.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Category to POST /api/admin/categories
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Please enter a category name.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        image: formData.image,
        parentCategory: formData.parentCategory.trim(),
        sortOrder: parseInt(formData.sortOrder, 10) || 0,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setSuccessMessage("✓ Category created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/admin/categories");
        }, 1200);
      } else {
        setErrorMessage(result.error || "Failed to create category.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setErrorMessage("An unexpected error occurred while creating category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Add New Category
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Create a signature furniture collection or category for the storefront.
            </p>
          </div>

          <Link
            href="/admin/categories"
            className="px-4 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:border-[#A67C52] bg-white transition-colors"
          >
            ← Back to Categories
          </Link>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs sm:text-sm">
            ✕ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs sm:text-sm">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Category Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#1F1F1F]">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Living Room, Outdoor, Home Office"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#1F1F1F]">
                  Category Slug (Unique URL Path) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. living-room"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] font-mono focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#1F1F1F]">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Velvet Chesterfield Sofas, Accent Tables, Coffee Tables & Pouffes..."
                  className="w-full p-4 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F1F1F]">Parent Category (Optional)</label>
                <input
                  type="text"
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  placeholder="Leave empty for root category"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F1F1F]">Priority Sort Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  placeholder="0"
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>

          {/* Cloudinary Banner Upload Section */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                Category Banner Image
              </h2>
              <span className="text-xs text-[#666666]">Cloudinary Upload</span>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="text-xs text-[#666666] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#A67C52] file:text-white hover:file:bg-[#8e6843] cursor-pointer"
              />

              {isUploading && (
                <span className="text-xs font-semibold text-[#A67C52] animate-pulse">
                  ⏳ Uploading image to Cloudinary...
                </span>
              )}

              {/* Banner Preview */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#E5E5E5] bg-zinc-100 mt-2">
                <Image src={formData.image} alt="Category Banner Preview" fill sizes="600px" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Settings & Flags */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
              Visibility Settings
            </h2>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1F1F] cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Active (Visible on Storefront Navigation)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1F1F] cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span>Featured Collection (Displayed on Homepage/Collections)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/categories"
              className="px-6 py-3 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-8 py-3 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating Category..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </AdminProtectedRoute>
  );
}
