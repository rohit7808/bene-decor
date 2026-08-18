import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/products/[id]
 * Fetches a single product by ObjectId or slug.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product identifier is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if ID is a valid Mongoose ObjectId or query by slug
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id.toLowerCase().trim() };

    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/products/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Updates an existing product by ObjectId (Admin authorization required).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authorize Admin
    const auth = requireAdminRequest(request);
    if (!auth.success) {
      return auth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ObjectId." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 2. Connect to database
    await connectDB();

    // 3. Update product with validation
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/products/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes a product by ObjectId and cleans up Cloudinary images (Admin authorization required).
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authorize Admin
    const auth = requireAdminRequest(request);
    if (!auth.success) {
      return auth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ObjectId." },
        { status: 400 }
      );
    }

    // 2. Connect to database
    await connectDB();

    // 3. Find product
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // 4. Delete Cloudinary images if present
    const imageUrls: string[] = Array.isArray(product.images) ? product.images : [];

    for (const url of imageUrls) {
      if (url && url.includes("res.cloudinary.com")) {
        try {
          const parts = url.split("/upload/");
          if (parts.length >= 2) {
            const pathWithExt = parts[1].replace(/^v\d+\//, "");
            const publicId = pathWithExt.substring(0, pathWithExt.lastIndexOf("."));
            if (publicId) {
              await deleteImageFromCloudinary(publicId);
            }
          }
        } catch (imgErr) {
          console.error("Cloudinary Image Cleanup Error:", imgErr);
        }
      }
    }

    // 5. Delete product document from MongoDB
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/products/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
