import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * GET /api/admin/orders
 * Paginated admin order list with search & status filters.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if non-admin customer).
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
    const orderStatus = searchParams.get("orderStatus") || "All";
    const paymentStatus = searchParams.get("paymentStatus") || "All";

    await connectDB();

    const query: Record<string, any> = {};

    // 1. Order Status Filter
    if (orderStatus && orderStatus !== "All") {
      query.orderStatus = orderStatus;
    }

    // 2. Payment Status Filter
    if (paymentStatus && paymentStatus !== "All") {
      query.paymentStatus = paymentStatus;
    }

    // 3. Search Filter (by Order Number, Customer Name, or Customer Email)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { orderNumber: searchRegex },
        { "shippingAddress.fullName": searchRegex },
        { "shippingAddress.email": searchRegex },
        { "shippingAddress.phone": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalOrders / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          limit,
        },
        orders,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin orders list." },
      { status: 500 }
    );
  }
}
