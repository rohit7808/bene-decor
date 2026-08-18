import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getAuthUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/wishlist/[id]
 * Removes a product from user's wishlist by product ID.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID parameter is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ userId: user.userId });

    if (!wishlist) {
      return NextResponse.json(
        { success: true, message: "Wishlist empty", items: [] },
        { status: 200 }
      );
    }

    wishlist.items = wishlist.items.filter(
      (item) => String(item.productId) !== String(id)
    );

    await wishlist.save();

    return NextResponse.json(
      {
        success: true,
        message: "Removed from wishlist",
        items: wishlist.items,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/wishlist/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from wishlist." },
      { status: 500 }
    );
  }
}
