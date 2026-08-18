import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/admin/products/[id]/inventory
 * Real-time stock quantity modifier (Add / Remove / Set stock).
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Product ObjectId." }, { status: 400 });
    }

    const body = await request.json();
    const { action, quantity } = body;

    const allowedActions = ["add", "remove", "set"];
    if (!action || !allowedActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid stock action. Allowed actions: 'add', 'remove', 'set'." },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number" || isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: "Stock quantity must be a non-negative number." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    let newStock = product.stock || 0;

    if (action === "add") {
      newStock += quantity;
    } else if (action === "remove") {
      newStock = Math.max(0, newStock - quantity);
    } else if (action === "set") {
      newStock = Math.max(0, quantity);
    }

    product.stock = newStock;
    // Auto-update availability if stock is 0 vs > 0
    if (newStock === 0) {
      product.isAvailable = false;
    } else if (newStock > 0 && !product.isAvailable) {
      product.isAvailable = true;
    }

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: `Stock updated for '${product.name}'. New stock: ${newStock}`,
        stock: newStock,
        isAvailable: product.isAvailable,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/admin/products/[id]/inventory Error:", error);
    return NextResponse.json(
      { error: "Failed to update product inventory." },
      { status: 500 }
    );
  }
}
