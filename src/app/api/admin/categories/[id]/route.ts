import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/admin/categories/[id]
 * Fetches single category and assigned products.
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
      return NextResponse.json({ error: "Invalid Category ObjectId." }, { status: 400 });
    }

    await connectDB();

    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    // Fetch assigned products
    const assignedProducts = await Product.find({
      category: { $regex: new RegExp(`^${category.name}$`, "i") },
    })
      .select("name price stock isAvailable images sku category")
      .lean();

    return NextResponse.json(
      {
        success: true,
        category: {
          ...category,
          productCount: assignedProducts.length,
        },
        products: assignedProducts,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/categories/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category details." },
      { status: 500 }
    );
  }
}

/**
 * PATCH / PUT /api/admin/categories/[id]
 * Updates Category fields in MongoDB.
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
      return NextResponse.json({ error: "Invalid Category ObjectId." }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    // Validate Slug uniqueness if updated
    if (body.slug && typeof body.slug === "string") {
      const cleanSlug = body.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      if (cleanSlug !== category.slug) {
        const slugExists = await Category.findOne({ slug: cleanSlug, _id: { $ne: id } });
        if (slugExists) {
          return NextResponse.json(
            { error: `Category slug '${cleanSlug}' is already in use by another category.` },
            { status: 400 }
          );
        }
        category.slug = cleanSlug;
      }
    }

    // Prevent self-parent category assignment
    if (body.parentCategory && String(body.parentCategory).trim() === category.name) {
      return NextResponse.json(
        { error: "A category cannot be its own parent category." },
        { status: 400 }
      );
    }

    const oldName = category.name;

    if (body.name && typeof body.name === "string" && body.name.trim()) {
      category.name = body.name.trim();
    }
    if (body.description !== undefined) category.description = String(body.description).trim();
    if (body.image !== undefined) category.image = String(body.image).trim();
    if (body.parentCategory !== undefined) category.parentCategory = String(body.parentCategory).trim();
    if (body.isActive !== undefined) category.isActive = Boolean(body.isActive);
    if (body.isFeatured !== undefined) category.isFeatured = Boolean(body.isFeatured);
    if (body.sortOrder !== undefined) category.sortOrder = Number(body.sortOrder) || 0;

    await category.save();

    // If category name was updated, update existing products to keep synchronization
    if (oldName !== category.name) {
      await Product.updateMany(
        { category: { $regex: new RegExp(`^${oldName}$`, "i") } },
        { $set: { category: category.name } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully.",
        category,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/admin/categories/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, params: RouteParams) {
  return PATCH(request, params);
}

/**
 * DELETE /api/admin/categories/[id]
 * Deletes Category from MongoDB safely. Checks if assigned products exist.
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
      return NextResponse.json({ error: "Invalid Category ObjectId." }, { status: 400 });
    }

    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    // Check if category contains products
    const productCount = await Product.countDocuments({
      category: { $regex: new RegExp(`^${category.name}$`, "i") },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete '${category.name}' because it contains ${productCount} product(s). Please move or reassign the products first.`,
          productCount,
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: `Category '${category.name}' deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/admin/categories/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}
