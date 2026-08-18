import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

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
 * GET /api/categories
 * Returns active categories for storefront navigation & browsing.
 */
export async function GET() {
  try {
    await connectDB();

    // Auto seed default categories if collection is empty
    const existingCount = await Category.countDocuments({});
    if (existingCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
    }

    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, "i") },
          isAvailable: true,
        });

        // Normalize legacy category image URLs
        let catImage = cat.image || "/images/collections/sofa.jpg";
        if (catImage === "/images/collections/sofa.jpeg") catImage = "/images/collections/sofa.jpg";
        if (catImage === "/images/collections/office.jpeg") catImage = "/images/collections/office.png";

        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: catImage,
          isFeatured: cat.isFeatured,
          sortOrder: cat.sortOrder,
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
    console.error("GET /api/categories Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storefront categories." },
      { status: 500 }
    );
  }
}
