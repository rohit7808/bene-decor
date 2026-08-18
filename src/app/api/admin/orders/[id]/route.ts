import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdminRequest } from "@/middleware/auth";
import {
  sendOrderConfirmationEmail,
  sendOrderProcessingEmail,
  sendShippingConfirmationEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
} from "@/lib/email";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/admin/orders/[id]
 * Fetches single order details for admin management.
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
      return NextResponse.json(
        { error: "Invalid Order ObjectId." },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
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
    console.error("GET /api/admin/orders/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin order details." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Updates orderStatus, paymentStatus, trackingId, carrier & triggers automated status emails.
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
      return NextResponse.json(
        { error: "Invalid Order ObjectId." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderStatus, paymentStatus, trackingId, carrier, notes } = body;

    const allowedOrderStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    const allowedPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

    if (orderStatus && !allowedOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { error: `Invalid order status. Allowed: ${allowedOrderStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid payment status. Allowed: ${allowedPaymentStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch existing order to check if status actually changed
    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const statusChanged = orderStatus && orderStatus !== existingOrder.orderStatus;
    const oldStatus = existingOrder.orderStatus;

    const updateFields: Record<string, any> = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid") {
        updateFields.isPaid = true;
        updateFields.paidAt = existingOrder.paidAt || new Date();
      }
    }
    if (trackingId !== undefined) updateFields.trackingId = trackingId;
    if (notes !== undefined) updateFields.notes = notes;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Failed to update order." },
        { status: 500 }
      );
    }

    // Trigger Email Notification ONLY if orderStatus actually changed (Prevents duplicate emails)
    if (statusChanged && orderStatus) {
      try {
        const orderEmailDetails = {
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
        };

        if (orderStatus === "Confirmed") {
          await sendOrderConfirmationEmail(orderEmailDetails);
        } else if (orderStatus === "Processing") {
          await sendOrderProcessingEmail(orderEmailDetails);
        } else if (orderStatus === "Shipped") {
          await sendShippingConfirmationEmail(orderEmailDetails, trackingId || updatedOrder.trackingId);
        } else if (orderStatus === "Delivered") {
          await sendOrderDeliveredEmail(orderEmailDetails);
        } else if (orderStatus === "Cancelled") {
          await sendOrderCancelledEmail(orderEmailDetails);
        }
      } catch (emailErr) {
        console.error("Status Update Email Trigger Error:", emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order status updated from '${oldStatus}' to '${updatedOrder.orderStatus}'`,
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/admin/orders/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
