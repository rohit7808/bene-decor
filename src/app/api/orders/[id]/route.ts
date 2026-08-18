import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/auth";
import { requireAdminRequest } from "@/middleware/auth";
import { sendShippingConfirmationEmail } from "@/lib/email";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/orders/[id]
 * Fetches single order details by ObjectId or orderNumber.
 * Enforces authentication & customer ownership protection.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to view order details." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Order identifier is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { orderNumber: id.toUpperCase().trim() };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Verify ownership: customer can only view their own order, admin can view any order
    if (user.role !== "admin" && order.user && order.user.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden. You are not authorized to view another customer's order." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/orders/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * Updates ONLY orderStatus (Admin authorization required).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Order ObjectId." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderStatus } = body;

    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid order status. Allowed values are: ${allowedStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { orderStatus } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Trigger Shipping Confirmation Email notification if orderStatus is updated to "Shipped"
    if (orderStatus === "Shipped") {
      try {
        await sendShippingConfirmationEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.shippingAddress?.fullName || "Customer",
          customerEmail: updatedOrder.shippingAddress?.email,
          totalAmount: updatedOrder.totalAmount,
          paymentMethod: updatedOrder.paymentMethod,
          paymentStatus: updatedOrder.paymentStatus,
          orderStatus: updatedOrder.orderStatus,
          createdAt: updatedOrder.createdAt,
          items: updatedOrder.items,
          shippingAddress: updatedOrder.shippingAddress,
        }, updatedOrder.trackingId);
      } catch (e) {
        console.error("Shipping Email Trigger Error:", e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/orders/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * Updates order fields (Admin authorization required).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Order ObjectId." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderStatus, paymentStatus, trackingId, isPaid, isDelivered, notes } = body;

    await connectDB();

    const updateFields: Record<string, any> = {};

    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (trackingId !== undefined) updateFields.trackingId = trackingId;
    if (typeof isPaid === "boolean") {
      updateFields.isPaid = isPaid;
      if (isPaid) updateFields.paidAt = new Date();
    }
    if (typeof isDelivered === "boolean") {
      updateFields.isDelivered = isDelivered;
      if (isDelivered) updateFields.deliveredAt = new Date();
    }
    if (notes !== undefined) updateFields.notes = notes;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/orders/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
