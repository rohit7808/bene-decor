import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * Helper function to generate a URL-friendly slug from product name
 */
function createSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${baseSlug}-${Date.now().toString(36)}`;
}

/**
 * GET /api/products
 * Retrieves paginated, filtered, and sorted products catalog from MongoDB.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortParam = searchParams.get("sort") || "latest";
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");

    // Build MongoDB filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isAvailable: true };

    // Search filter (name, description, tags)
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "ALL" && category !== "All") {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    // Featured / Best Seller flags
    if (featured === "true") filter.isFeatured = true;
    if (bestseller === "true") filter.isBestSeller = true;

    // Sorting logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOptions: Record<string, any> = { createdAt: -1 };
    switch (sortParam) {
      case "price_asc":
      case "price-asc":
      case "low-high":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
      case "price-desc":
      case "high-low":
        sortOptions = { price: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "latest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Execute paginated database queries
    const skip = (page - 1) * limit;
    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        total: totalProducts,
        totalPages,
        currentPage: page,
        products,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Creates a new product in MongoDB (Admin authorization required).
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authorize Admin
    const auth = requireAdminRequest(request);
    if (!auth.success) {
      return auth.response;
    }

    const body = await request.json();
    const { name, description, category, price, images } = body;

    // 2. Validate required fields
    if (!name || !description || !category || price === undefined || !images) {
      return NextResponse.json(
        { error: "Name, description, category, price, and images are required fields." },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one product image URL is required." },
        { status: 400 }
      );
    }

    // 3. Connect to database
    await connectDB();

    // 4. Auto-generate slug if not provided
    const slug = body.slug ? body.slug.toLowerCase().trim() : createSlug(name);

    // Check if slug is unique
    const existingSlug = await Product.findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;

    // 5. Create product in MongoDB
    const product = await Product.create({
      ...body,
      name: name.trim(),
      slug: finalSlug,
      category: category.trim(),
      price: Number(price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : 0,
      discount: body.discount ? Number(body.discount) : 0,
      images,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/products Error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
