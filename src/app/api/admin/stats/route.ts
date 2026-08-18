import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * GET /api/admin/stats
 * Admin dashboard real-time statistics aggregator.
 * Protected by requireAdminRequest (401 if unauthenticated, 403 if non-admin customer).
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    await connectDB();

    // 1. Calculate Order Status Counts
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Processing" }),
      Order.countDocuments({ orderStatus: "Shipped" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({}),
    ]);

    // 2. Calculate Total Store Revenue from Paid/Completed Orders
    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          $or: [{ isPaid: true }, { paymentStatus: "Paid" }, { orderStatus: "Delivered" }],
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 3. Fetch Top 5 Recent Orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber shippingAddress totalAmount paymentStatus orderStatus createdAt")
      .lean();

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          totalCustomers,
          totalProducts,
          totalRevenue,
          recentOrders,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/stats Error:", error);
    return NextResponse.json(
      { error: "Failed to load admin statistics." },
      { status: 500 }
    );
  }
}
