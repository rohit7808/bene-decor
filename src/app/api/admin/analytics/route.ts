import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * Helper to compute exact IST (India Standard Time UTC+5:30) date range bounds
 */
function getISTDateRange(period: string, customStart?: string, customEnd?: string) {
  const nowUtc = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(nowUtc.getTime() + istOffsetMs);

  const currentYear = nowIst.getUTCFullYear();
  const currentMonth = nowIst.getUTCMonth();
  const currentDate = nowIst.getUTCDate();

  let start: Date;
  let end: Date = new Date(Date.UTC(currentYear, currentMonth, currentDate, 23, 59, 59, 999) - istOffsetMs);

  switch (period) {
    case "today":
      // 00:00:00 IST today
      start = new Date(Date.UTC(currentYear, currentMonth, currentDate, 0, 0, 0, 0) - istOffsetMs);
      break;

    case "7d":
      // Current day + previous 6 days = 7 full days
      start = new Date(Date.UTC(currentYear, currentMonth, currentDate - 6, 0, 0, 0, 0) - istOffsetMs);
      break;

    case "30d":
      // Current day + previous 29 days = 30 full days
      start = new Date(Date.UTC(currentYear, currentMonth, currentDate - 29, 0, 0, 0, 0) - istOffsetMs);
      break;

    case "this_month":
      // 1st day of current month 00:00:00 IST
      start = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0) - istOffsetMs);
      break;

    case "last_month":
      // 1st day of previous month 00:00:00 IST to last day of previous month 23:59:59 IST
      start = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0) - istOffsetMs);
      end = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999) - istOffsetMs);
      break;

    case "this_year":
      // Jan 1 00:00:00 IST
      start = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0) - istOffsetMs);
      break;

    case "custom":
      if (customStart) {
        const [y, m, d] = customStart.split("-").map(Number);
        start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - istOffsetMs);
      } else {
        start = new Date(0);
      }
      if (customEnd) {
        const [y, m, d] = customEnd.split("-").map(Number);
        end = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - istOffsetMs);
      }
      break;

    case "all":
    default:
      start = new Date(0);
      end = new Date(8640000000000000); // Max Date representation
      break;
  }

  return { start, end };
}

/**
 * GET /api/admin/analytics
 * Returns dynamic analytics metrics strictly filtered by selected time horizon.
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const customStart = searchParams.get("startDate") || undefined;
    const customEnd = searchParams.get("endDate") || undefined;

    const { start, end } = getISTDateRange(period, customStart, customEnd);

    await connectDB();

    // Construct Mongo date match filter based on period
    const dateMatchFilter: Record<string, any> = {};
    if (period !== "all") {
      dateMatchFilter.createdAt = { $gte: start, $lte: end };
    }

    // Filter for valid paid/completed revenue transactions
    const paidMatchFilter: Record<string, any> = {
      ...dateMatchFilter,
      orderStatus: { $ne: "Cancelled" },
      $or: [
        { paymentStatus: "Paid" },
        { isPaid: true },
        { paymentMethod: "COD", orderStatus: "Delivered" },
      ],
    };

    // 1. KPI Aggregations (Total Revenue, Paid Orders, AOV, Products Sold)
    const paidStatsAggregation = await Order.aggregate([
      { $match: paidMatchFilter },
      {
        $unwind: { path: "$items", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          totalAmount: { $first: "$totalAmount" },
          itemsCount: { $sum: "$items.quantity" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          paidOrderCount: { $sum: 1 },
          totalProductsSold: { $sum: "$itemsCount" },
        },
      },
    ]);

    const totalRevenue = paidStatsAggregation[0]?.totalRevenue || 0;
    const paidOrderCount = paidStatsAggregation[0]?.paidOrderCount || 0;
    const productsSold = paidStatsAggregation[0]?.totalProductsSold || 0;
    const averageOrderValue = paidOrderCount > 0 ? Math.round(totalRevenue / paidOrderCount) : 0;

    // Total Orders placed in selected period
    const totalOrders = await Order.countDocuments(dateMatchFilter);

    // New Registered Customers in selected period
    const userMatchFilter: Record<string, any> = { role: "customer" };
    if (period !== "all") {
      userMatchFilter.createdAt = { $gte: start, $lte: end };
    }
    const newCustomers = await User.countDocuments(userMatchFilter);

    // Total Registered Customers overall
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Returning Customers Calculation (users with > 1 order)
    const customerOrderCounts = await Order.aggregate([
      { $match: { ...dateMatchFilter, user: { $exists: true, $ne: null } } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "returningCount" },
    ]);

    const returningCustomers = customerOrderCounts[0]?.returningCount || 0;
    const avgOrdersPerCustomer = totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : "0.0";

    // 2. Revenue & Orders Over Time Trend (Grouped in IST)
    const timeTrend = await Order.aggregate([
      { $match: dateMatchFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+05:30",
            },
          },
          totalOrders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$orderStatus", "Cancelled"] },
                    {
                      $or: [
                        { $eq: ["$paymentStatus", "Paid"] },
                        { $eq: ["$isPaid", true] },
                        {
                          $and: [
                            { $eq: ["$paymentMethod", "COD"] },
                            { $eq: ["$orderStatus", "Delivered"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },
          paidOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$orderStatus", "Cancelled"] },
                    {
                      $or: [
                        { $eq: ["$paymentStatus", "Paid"] },
                        { $eq: ["$isPaid", true] },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Order Status Distribution
    const statusDistributionRaw = await Order.aggregate([
      { $match: dateMatchFilter },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const statusMap: Record<string, number> = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    statusDistributionRaw.forEach((item) => {
      if (item._id && statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    // 4. Top Selling Products (From actual order items in period)
    const topProducts = await Order.aggregate([
      { $match: dateMatchFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          name: { $first: "$items.name" },
          image: { $first: "$items.image" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 },
    ]);

    // 5. Payment Method Analytics
    const paymentAnalytics = await Order.aggregate([
      { $match: dateMatchFilter },
      {
        $group: {
          _id: "$paymentMethod",
          ordersCount: { $sum: 1 },
          paidRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$orderStatus", "Cancelled"] },
                    {
                      $or: [
                        { $eq: ["$paymentStatus", "Paid"] },
                        { $eq: ["$isPaid", true] },
                        {
                          $and: [
                            { $eq: ["$paymentMethod", "COD"] },
                            { $eq: ["$orderStatus", "Delivered"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    // 6. Inventory Insight (Live inventory counts)
    const allProducts = await Product.find({}).lean();
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let activeProductCount = 0;

    allProducts.forEach((p: any) => {
      if (p.isAvailable !== false) activeProductCount++;
      const threshold = p.lowStockThreshold || 5;
      if (p.stock === 0) {
        outOfStockCount++;
      } else if (p.stock <= threshold) {
        lowStockCount++;
      }
    });

    // 7. Recent Sales List within period
    const recentOrders = await Order.find(dateMatchFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedRecentSales = recentOrders.map((ord: any) => ({
      _id: ord._id.toString(),
      orderNumber: ord.orderNumber,
      customerName: ord.shippingAddress?.fullName || "Valued Customer",
      customerEmail: ord.shippingAddress?.email || "N/A",
      totalAmount: ord.totalAmount,
      paymentMethod: ord.paymentMethod,
      paymentStatus: ord.paymentStatus,
      orderStatus: ord.orderStatus,
      createdAt: ord.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        period,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
        kpis: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          newCustomers,
          productsSold,
          successfulPayments: paidOrderCount,
          totalCustomers,
          returningCustomers,
          avgOrdersPerCustomer,
        },
        timeTrend,
        statusDistribution: statusMap,
        topProducts,
        paymentAnalytics,
        inventoryInsights: {
          totalProducts: allProducts.length,
          activeProducts: activeProductCount,
          lowStockProducts: lowStockCount,
          outOfStockProducts: outOfStockCount,
        },
        recentSales: formattedRecentSales,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics report." },
      { status: 500 }
    );
  }
}
