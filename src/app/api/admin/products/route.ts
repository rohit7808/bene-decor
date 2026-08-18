import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * GET /api/admin/products
 * Paginated admin product list with search, category/stock filters & sorting.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "All";
    const stockStatus = searchParams.get("stockStatus") || "All"; // "InStock" | "LowStock" | "OutOfStock" | "All"
    const isAvailable = searchParams.get("isAvailable") || "All";
    const isFeatured = searchParams.get("isFeatured") || "All";
    const sort = searchParams.get("sort") || "newest";

    await connectDB();

    const query: Record<string, any> = {};

    // Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Active/Inactive Filter
    if (isAvailable && isAvailable !== "All") {
      query.isAvailable = isAvailable === "true";
    }

    // Featured Filter
    if (isFeatured && isFeatured !== "All") {
      query.isFeatured = isFeatured === "true";
    }

    // Stock Status Filter
    if (stockStatus === "OutOfStock") {
      query.stock = 0;
    } else if (stockStatus === "LowStock") {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (stockStatus === "InStock") {
      query.stock = { $gt: 5 };
    }

    // Search Filter
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    // Sorting
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };
    else if (sort === "price_asc") sortOptions = { price: 1 };
    else if (sort === "price_desc") sortOptions = { price: -1 };
    else if (sort === "stock_asc") sortOptions = { stock: 1 };

    const skip = (page - 1) * limit;

    const [totalProducts, products, inStock, lowStock, outOfStock] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments({ stock: { $gt: 5 } }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ stock: 0 }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: page,
          limit,
        },
        inventorySummary: {
          totalProductsCount: inStock + lowStock + outOfStock,
          inStock,
          lowStock,
          outOfStock,
        },
        products,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin product list." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Creates a new product in MongoDB.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function POST(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      subCategory,
      price,
      originalPrice,
      stock,
      lowStockThreshold,
      sku,
      images,
      material,
      color,
      dimensions,
      weight,
      brand,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isAvailable,
      tags,
      hasVariants,
      variants,
    } = body;

    // Server-side field validations
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Product description is required." }, { status: 400 });
    }

    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }

    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Valid price (≥ 0) is required." }, { status: 400 });
    }

    if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: "Valid stock count (≥ 0) is required." }, { status: 400 });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "At least one product image URL is required." }, { status: 400 });
    }

    await connectDB();

    // Auto-generate unique slug
    const cleanName = name.trim();
    let slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Auto-generate SKU if not provided
    const finalSku =
      typeof sku === "string" && sku.trim()
        ? sku.trim().toUpperCase()
        : `BD-${category.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newProduct = new Product({
      name: cleanName,
      slug,
      description: description.trim(),
      category: category.trim(),
      subCategory: subCategory ? subCategory.trim() : "",
      price,
      originalPrice: typeof originalPrice === "number" && originalPrice >= 0 ? originalPrice : 0,
      discount:
        typeof originalPrice === "number" && originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0,
      stock,
      lowStockThreshold: typeof lowStockThreshold === "number" && lowStockThreshold >= 0 ? lowStockThreshold : 5,
      sku: finalSku,
      images,
      material: material ? material.trim() : "Solid Wood",
      color: color ? color.trim() : "Natural Finish",
      dimensions: dimensions ? dimensions.trim() : "",
      weight: weight ? weight.trim() : "",
      brand: brand ? brand.trim() : "Bené Decor",
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      tags: Array.isArray(tags) ? tags : [],
      hasVariants: Boolean(hasVariants),
      variants: Array.isArray(variants) ? variants : [],
    });

    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/admin/products Error:", error);
    return NextResponse.json(
      { error: "Failed to create new product." },
      { status: 500 }
    );
  }
}
