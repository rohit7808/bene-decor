import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * GET /api/admin/customers
 * Admin customer management list.
 * Protected by requireAdminRequest.
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    await connectDB();

    const customers = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .select("name email phone addresses createdAt isActive role")
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: customers.length,
        customers: customers.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          email: c.email,
          phone: c.phone || "N/A",
          city: c.addresses && c.addresses.length > 0 ? `${c.addresses[0].city}, ${c.addresses[0].state}` : "India",
          createdAt: c.createdAt,
          isActive: c.isActive,
        })),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/customers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer list." },
      { status: 500 }
    );
  }
}
