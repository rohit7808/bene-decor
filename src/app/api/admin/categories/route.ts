import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

const DEFAULT_CATEGORIES = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Velvet Chesterfield Sofas, Accent Tables, Coffee Tables & Pouffes",
    image: "/images/collections/sofa.jpg",
    sortOrder: 1,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Dining Room",
    slug: "dining",
    description: "Solid Sheesham & Teak Wood Dining Tables, Benches & Chairs",
    image: "/images/collections/dining.jpeg",
    sortOrder: 2,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "King & Queen Upholstered Beds, Nightstands & Wardrobes",
    image: "/images/collections/bed.jpeg",
    sortOrder: 3,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Office",
    slug: "office",
    description: "Executive Wooden Desks, Swivel Leather Chairs & Bookshelves",
    image: "/images/collections/office.png",
    sortOrder: 4,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Storage",
    slug: "storage",
    description: "Entryway Shoe Cabinets, Benches, Console Tables & Trunks",
    image: "/images/products/shoe.jpeg",
    sortOrder: 5,
    isFeatured: true,
    isActive: true,
  },
];

/**
 * GET /api/admin/categories
 * Paginated admin categories list with product counts & search.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const isActiveFilter = searchParams.get("isActive");
    const isFeaturedFilter = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "sortOrder";

    await connectDB();

    // Auto-seed initial categories if empty
    const existingCount = await Category.countDocuments({});
    if (existingCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
    }

    const query: Record<string, any> = {};

    if (isActiveFilter && isActiveFilter !== "All") {
      query.isActive = isActiveFilter === "true";
    }

    if (isFeaturedFilter && isFeaturedFilter !== "All") {
      query.isFeatured = isFeaturedFilter === "true";
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ name: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    let sortOptions: Record<string, 1 | -1> = { sortOrder: 1, name: 1 };
    if (sort === "name_asc") sortOptions = { name: 1 };
    else if (sort === "name_desc") sortOptions = { name: -1 };
    else if (sort === "newest") sortOptions = { createdAt: -1 };
    else if (sort === "oldest") sortOptions = { createdAt: 1 };

    const categories = await Category.find(query).sort(sortOptions).lean();

    // Attach dynamic product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, "i") },
        });
        return {
          ...cat,
          id: cat._id.toString(),
          productCount,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        count: categoriesWithCount.length,
        categories: categoriesWithCount,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/categories Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin categories list." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Creates a new Category document in MongoDB.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function POST(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const body = await request.json();
    const { name, slug, description, image, parentCategory, isActive, isFeatured, sortOrder } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    await connectDB();

    // Auto-generate or sanitize unique slug
    const cleanName = name.trim();
    let finalSlug =
      typeof slug === "string" && slug.trim()
        ? slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    const existingCategory = await Category.findOne({ slug: finalSlug });
    if (existingCategory) {
      return NextResponse.json(
        { error: `Category slug '${finalSlug}' already exists. Please choose a unique slug.` },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      name: cleanName,
      slug: finalSlug,
      description: description ? description.trim() : "",
      image: image ? image.trim() : "/images/collections/sofa.jpg",
      parentCategory: parentCategory ? parentCategory.trim() : "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      isFeatured: Boolean(isFeatured),
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    });

    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/admin/categories Error:", error);
    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 }
    );
  }
}
