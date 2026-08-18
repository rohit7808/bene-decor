import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/admin/products/[id]
 * Fetches single product details for admin editing & view.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Product ObjectId." }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/products/[id] Error:", error);
    return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/products/[id] & PUT /api/admin/products/[id]
 * Updates product details in MongoDB.
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
    await connectDB();

    const updateFields: Record<string, any> = {};

    if (body.name && typeof body.name === "string") updateFields.name = body.name.trim();
    if (body.description && typeof body.description === "string") updateFields.description = body.description.trim();
    if (body.category && typeof body.category === "string") updateFields.category = body.category.trim();
    if (body.subCategory !== undefined) updateFields.subCategory = String(body.subCategory).trim();
    if (typeof body.price === "number" && body.price >= 0) updateFields.price = body.price;
    if (typeof body.originalPrice === "number" && body.originalPrice >= 0) updateFields.originalPrice = body.originalPrice;
    if (typeof body.stock === "number" && body.stock >= 0) updateFields.stock = body.stock;
    if (typeof body.lowStockThreshold === "number" && body.lowStockThreshold >= 0) updateFields.lowStockThreshold = body.lowStockThreshold;
    if (body.sku !== undefined) updateFields.sku = String(body.sku).trim().toUpperCase();
    if (Array.isArray(body.images)) updateFields.images = body.images;
    if (body.material !== undefined) updateFields.material = String(body.material).trim();
    if (body.color !== undefined) updateFields.color = String(body.color).trim();
    if (body.dimensions !== undefined) updateFields.dimensions = String(body.dimensions).trim();
    if (body.weight !== undefined) updateFields.weight = String(body.weight).trim();
    if (body.brand !== undefined) updateFields.brand = String(body.brand).trim();
    if (typeof body.isFeatured === "boolean") updateFields.isFeatured = body.isFeatured;
    if (typeof body.isBestSeller === "boolean") updateFields.isBestSeller = body.isBestSeller;
    if (typeof body.isNewArrival === "boolean") updateFields.isNewArrival = body.isNewArrival;
    if (typeof body.isAvailable === "boolean") updateFields.isAvailable = body.isAvailable;
    if (typeof body.hasVariants === "boolean") updateFields.hasVariants = body.hasVariants;
    if (Array.isArray(body.variants)) updateFields.variants = body.variants;

    // Auto update discount percentage
    const currentPrice = updateFields.price !== undefined ? updateFields.price : (await Product.findById(id))?.price || 0;
    const currentOriginal = updateFields.originalPrice !== undefined ? updateFields.originalPrice : (await Product.findById(id))?.originalPrice || 0;
    if (currentOriginal > currentPrice) {
      updateFields.discount = Math.round(((currentOriginal - currentPrice) / currentOriginal) * 100);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/admin/products/[id] Error:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return PATCH(request, { params });
}

/**
 * DELETE /api/admin/products/[id]
 * Deactivates or removes a product from MongoDB.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if customer).
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Product ObjectId." }, { status: 400 });
    }

    await connectDB();

    // Soft delete by setting isAvailable: false to preserve historical order records
    const deactivatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { isAvailable: false, stock: 0 } },
      { new: true }
    ).lean();

    if (!deactivatedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deactivated successfully to preserve historical orders.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/admin/products/[id] Error:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
