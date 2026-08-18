import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getAuthUser } from "@/lib/auth";

/**
 * GET /api/wishlist
 * Fetches user's wishlist from MongoDB.
 */
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({ userId: user.userId }).lean();

    if (!wishlist) {
      wishlist = {
        userId: user.userId,
        items: [],
      } as any;
    }

    return NextResponse.json(
      {
        success: true,
        items: wishlist?.items || [],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/wishlist Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 * Adds an item to user's wishlist in MongoDB (prevents duplicates).
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated. Please log in to add items to your wishlist." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, name, price, originalPrice, image, category, isAvailable = true, stock = 10 } = body;

    if (!productId || !name || price === undefined || !image) {
      return NextResponse.json(
        { error: "Product details (productId, name, price, image) are required." },
        { status: 400 }
      );
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({ userId: user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: user.userId,
        items: [],
      });
    }

    // Check if item is already in wishlist
    const exists = wishlist.items.some(
      (item) => String(item.productId) === String(productId)
    );

    if (!exists) {
      wishlist.items.push({
        productId,
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : 0,
        image,
        category: category || "Furniture",
        isAvailable,
        stock: Number(stock),
        addedAt: new Date(),
      });
      await wishlist.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Item added to wishlist",
        items: wishlist.items,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/wishlist Error:", error);
    return NextResponse.json(
      { error: "Failed to add item to wishlist." },
      { status: 500 }
    );
  }
}
