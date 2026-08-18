"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

export interface VariantItem {
  id: string;
  _id?: string;
  colorName: string;
  colorCode: string;
  price: string;
  originalPrice: string;
  stock: string;
  sku: string;
  images: string[];
  status: "active" | "inactive";
}

export default function AddProductPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Living Room",
    subCategory: "",
    price: "",
    originalPrice: "",
    discount: "0",
    stock: "10",
    lowStockThreshold: "5",
    sku: "",
    description: "",
    material: "Solid Teak Wood",
    color: "Natural Sheesham",
    dimensions: "",
    weight: "",
    brand: "Bené Decor",
    tags: "luxury, handcrafted, wooden",
    isFeatured: false,
    isBestSeller: false,
    isAvailable: true,
  });

  // Color Variants State
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantItem[]>([]);

  // Base Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Base Image Upload
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
        setImages((prev) => [...prev, result.url]);
      } else {
        setErrorMessage(result.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setErrorMessage("Error connecting to upload API.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Variant Specific Image Upload
  const handleVariantImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setErrorMessage(null);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        data.append("file", files[i]);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setVariants((prev) =>
          prev.map((v, idx) =>
            idx === variantIndex ? { ...v, images: [...v.images, ...uploadedUrls] } : v
          )
        );
      }
    } catch (err) {
      console.error("Variant upload error:", err);
      setErrorMessage("Failed to upload variant image.");
    }
  };

  // Submit product to POST /api/admin/products
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      setErrorMessage("Please fill in all required fields (Name, Description, Price).");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please upload at least one main product image.");
      return;
    }

    // Color Variant Validations
    if (hasVariants) {
      if (variants.length === 0) {
        setErrorMessage("Please add at least one color variant or disable color variants.");
        return;
      }

      const colorNamesSet = new Set<string>();
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v.colorName || !v.colorName.trim()) {
          setErrorMessage(`Color name for Variant #${i + 1} cannot be empty.`);
          return;
        }

        const lowerName = v.colorName.trim().toLowerCase();
        if (colorNamesSet.has(lowerName)) {
          setErrorMessage(`Duplicate color name '${v.colorName}' detected. Each variant color name must be unique.`);
          return;
        }
        colorNamesSet.add(lowerName);

        const vPrice = parseFloat(v.price);
        if (isNaN(vPrice) || vPrice < 0) {
          setErrorMessage(`Invalid selling price for color variant '${v.colorName}'. Price cannot be negative.`);
          return;
        }

        const vStock = parseInt(v.stock, 10);
        if (isNaN(vStock) || vStock < 0) {
          setErrorMessage(`Invalid stock count for color variant '${v.colorName}'. Stock cannot be negative.`);
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const formattedVariants = hasVariants
        ? variants.map((v) => ({
            colorName: v.colorName.trim(),
            colorCode: v.colorCode.trim() || "#A67C52",
            price: parseFloat(v.price) || 0,
            originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : 0,
            stock: parseInt(v.stock, 10) || 0,
            sku: v.sku ? v.sku.trim().toUpperCase() : "",
            images: Array.isArray(v.images) && v.images.length > 0 ? v.images : [...images],
            status: v.status || "active",
          }))
        : [];

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subCategory: formData.subCategory.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock, 10) || 10,
        lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
        sku: formData.sku.trim(),
        images,
        material: formData.material.trim(),
        color: formData.color.trim(),
        dimensions: formData.dimensions.trim(),
        weight: formData.weight.trim(),
        brand: formData.brand.trim(),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isAvailable: formData.isAvailable,
        hasVariants,
        variants: formattedVariants,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("Product created successfully! Redirecting to products list...");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      } else {
        setErrorMessage(data.error || "Failed to create product.");
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      setErrorMessage("An error occurred while creating the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F] p-4 sm:p-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A67C52] uppercase tracking-wider mb-1">
                <span>Admin</span>
                <span>/</span>
                <span>Products</span>
                <span>/</span>
                <span>New</span>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                Add New Product
              </h1>
            </div>

            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:bg-white transition-colors cursor-pointer w-fit"
            >
              ← Back to Products List
            </Link>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
              ✕ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Basic Information Section */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1F1F1F]">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Royal Solid Sheesham Dining Set"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52] cursor-pointer"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Dining">Dining</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Office">Office</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Sub-Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    placeholder="e.g. Dining Table Set"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1F1F1F]">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write detailed product description..."
                    required
                    className="w-full p-4 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Pricing &amp; Base Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">
                    Base Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25000"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="32000"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Base Stock Count</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="BD-SOFA-001"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC COLOR VARIANTS SECTION */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                <div className="flex flex-col">
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                    Product Color Variants
                  </h2>
                  <p className="text-xs text-[#666666]">
                    Enable to add custom colors with variant-specific pricing, stock, SKU &amp; images.
                  </p>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#E5E5E5] hover:border-[#A67C52]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHasVariants(checked);
                      if (checked && variants.length === 0) {
                        setVariants([
                          {
                            id: Date.now().toString(),
                            colorName: "Royal Blue",
                            colorCode: "#3B82F6",
                            price: formData.price || "6700",
                            originalPrice: formData.originalPrice || "8000",
                            stock: formData.stock || "10",
                            sku: formData.sku ? `${formData.sku}-BLUE` : "CHAIR-BLUE-001",
                            images: images.length > 0 ? [...images] : [],
                            status: "active",
                          },
                        ]);
                      }
                    }}
                    className="w-4 h-4 text-[#A67C52] rounded accent-[#A67C52] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#1F1F1F]">
                    Enable Color Variants
                  </span>
                </label>
              </div>

              {hasVariants && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                      Color Variants List ({variants.length})
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setVariants((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            colorName: "",
                            colorCode: "#8B5CF6",
                            price: formData.price || "6700",
                            originalPrice: formData.originalPrice || "8000",
                            stock: "10",
                            sku: "",
                            images: [],
                            status: "active",
                          },
                        ]);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-xs hover:bg-[#8e6843] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ Add Color Variant</span>
                    </button>
                  </div>

                  {variants.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#666666] bg-[#FAF8F5] rounded-xl border border-dashed border-[#E5E5E5]">
                      No variants added yet. Click <strong>"+ Add Color Variant"</strong> above.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 divide-y divide-[#E5E5E5]">
                      {variants.map((v, index) => (
                        <div key={v.id || index} className="pt-5 first:pt-0 flex flex-col gap-4">
                          <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E5E5]/70">
                            <span className="text-xs font-bold text-[#1F1F1F] flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-xs"
                                style={{ backgroundColor: v.colorCode || "#A67C52" }}
                              />
                              Variant #{index + 1}: <span className="text-[#A67C52]">{v.colorName || "Untitled Color"}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setVariants((prev) => prev.filter((_, i) => i !== index));
                              }}
                              className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                            >
                              ✕ Delete Variant
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {/* Color Name */}
                            <div className="flex flex-col gap-1 sm:col-span-2">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">
                                Color Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={v.colorName}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, colorName: val } : item))
                                  );
                                }}
                                placeholder="e.g. Royal Blue"
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] bg-[#FAF8F5]"
                              />
                            </div>

                            {/* Color Code Picker */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">Color Code</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={v.colorCode}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setVariants((prev) =>
                                      prev.map((item, i) => (i === index ? { ...item, colorCode: val } : item))
                                    );
                                  }}
                                  className="w-8 h-8 rounded-lg border border-[#E5E5E5] p-0.5 cursor-pointer bg-white shrink-0"
                                />
                                <input
                                  type="text"
                                  value={v.colorCode}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setVariants((prev) =>
                                      prev.map((item, i) => (i === index ? { ...item, colorCode: val } : item))
                                    );
                                  }}
                                  placeholder="#3B82F6"
                                  className="w-full px-2 py-2 rounded-xl border border-[#E5E5E5] text-xs font-mono text-[#1F1F1F] bg-[#FAF8F5]"
                                />
                              </div>
                            </div>

                            {/* Selling Price */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">
                                Selling Price (₹) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, price: val } : item))
                                  );
                                }}
                                placeholder="6700"
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] bg-[#FAF8F5]"
                              />
                            </div>

                            {/* Original Price */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">Original Price (₹)</label>
                              <input
                                type="number"
                                value={v.originalPrice}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, originalPrice: val } : item))
                                  );
                                }}
                                placeholder="8000"
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] bg-[#FAF8F5]"
                              />
                            </div>

                            {/* Stock */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">
                                Stock <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, stock: val } : item))
                                  );
                                }}
                                placeholder="10"
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] bg-[#FAF8F5]"
                              />
                            </div>

                            {/* SKU */}
                            <div className="flex flex-col gap-1 sm:col-span-2">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">SKU</label>
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, sku: val } : item))
                                  );
                                }}
                                placeholder="e.g. CHAIR-BLUE-001"
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-mono uppercase text-[#1F1F1F] bg-[#FAF8F5]"
                              />
                            </div>

                            {/* Variant Status */}
                            <div className="flex flex-col gap-1 sm:col-span-1">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">Status</label>
                              <select
                                value={v.status}
                                onChange={(e) => {
                                  const val = e.target.value as "active" | "inactive";
                                  setVariants((prev) =>
                                    prev.map((item, i) => (i === index ? { ...item, status: val } : item))
                                  );
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#1F1F1F] bg-[#FAF8F5] cursor-pointer"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          {/* Variant Specific Images Upload */}
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-[#1F1F1F]">
                                Variant Images ({v.images.length})
                              </label>

                              <label className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                                <span>📤 Upload Variant Images</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleVariantImageUpload(e, index)}
                                />
                              </label>
                            </div>

                            {v.images.length > 0 && (
                              <div className="flex items-center gap-3 overflow-x-auto py-2">
                                {v.images.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative w-16 h-16 rounded-xl border border-[#E5E5E5] overflow-hidden bg-[#FAF8F5] shrink-0 group">
                                    <Image src={imgUrl} alt="Variant image" fill className="object-contain p-1" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVariants((prev) =>
                                          prev.map((item, i) =>
                                            i === index
                                              ? { ...item, images: item.images.filter((_, idx) => idx !== imgIdx) }
                                              : item
                                          )
                                        );
                                      }}
                                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Specifications Section */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Specifications &amp; Attributes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="e.g. Solid Teak Wood"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Default Color Finish</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Natural Sheesham"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 180cm x 90cm x 75cm"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1F1F1F]">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 45 kg"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>
            </div>

            {/* Main Product Images Upload */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Main Product Images <span className="text-rose-500">*</span>
              </h2>

              <div className="flex flex-col gap-3">
                <label className="px-6 py-4 rounded-xl border-2 border-dashed border-[#A67C52]/40 bg-[#FAF8F5] hover:bg-[#A67C52]/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-2xl">📸</span>
                  <span className="text-xs font-bold text-[#1F1F1F]">
                    Click to Upload Main Images
                  </span>
                  <span className="text-[11px] text-[#666666]">
                    JPEG, PNG, WebP supported
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {isUploading && (
                  <div className="text-xs font-semibold text-[#A67C52] animate-pulse text-center">
                    ⏳ Uploading image to Cloudinary...
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-24 w-full rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#FAF8F5] group"
                      >
                        <Image src={img} alt={`Product ${idx + 1}`} fill className="object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visibility & Flags */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-2 border-b border-[#E5E5E5]">
                Visibility &amp; Badges
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#A67C52] rounded accent-[#A67C52]"
                  />
                  <span className="text-xs font-bold text-[#1F1F1F]">Available for Sale</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#A67C52] rounded accent-[#A67C52]"
                  />
                  <span className="text-xs font-bold text-[#1F1F1F]">Featured Collection</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#A67C52] rounded accent-[#A67C52]"
                  />
                  <span className="text-xs font-bold text-[#1F1F1F]">Best Seller</span>
                </label>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-4 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm">
              <Link
                href="/admin/products"
                className="px-6 py-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:bg-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-8 py-3 rounded-xl bg-[#A67C52] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#8e6843] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Creating Product..." : "Create Product →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
