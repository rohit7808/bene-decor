import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendPaymentSuccessEmail } from "@/lib/email";

/**
 * POST /api/payment/verify
 * Verifies Razorpay payment signature and marks MongoDB Order paymentStatus = "Paid".
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { error: "Missing required Razorpay verification payload." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET is not configured." },
        { status: 500 }
      );
    }

    // Generate expected HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Razorpay Signature Mismatch!");
      return NextResponse.json(
        { error: "Payment signature verification failed. Invalid transaction." },
        { status: 400 }
      );
    }

    // Payment Verified! Check if order was already processed (Idempotency)
    await connectDB();

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { error: "Associated MongoDB Order not found." },
        { status: 404 }
      );
    }

    if (existingOrder.isPaid && existingOrder.paymentStatus === "Paid") {
      return NextResponse.json(
        {
          success: true,
          message: "Payment already verified.",
          orderNumber: existingOrder.orderNumber,
        },
        { status: 200 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paymentStatus: "Paid",
          isPaid: true,
          paidAt: new Date(),
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Associated MongoDB Order not found." },
        { status: 404 }
      );
    }

    // Trigger Payment Success Email notification
    try {
      const plainOrder = updatedOrder.toObject ? updatedOrder.toObject() : updatedOrder;
      const plainAddress = plainOrder.shippingAddress || {};

      const cleanAddress = {
        fullName: plainAddress.fullName || "Valued Customer",
        phone: plainAddress.phone || "N/A",
        email: plainAddress.email || "",
        address: plainAddress.address || "N/A",
        street: plainAddress.address || "N/A",
        city: plainAddress.city || "N/A",
        state: plainAddress.state || "N/A",
        postalCode: plainAddress.postalCode || "N/A",
        pinCode: plainAddress.postalCode || "N/A",
        country: plainAddress.country || "India",
      };

      await sendPaymentSuccessEmail({
        orderNumber: plainOrder.orderNumber,
        customerName: cleanAddress.fullName,
        customerEmail: cleanAddress.email,
        customerPhone: cleanAddress.phone,
        totalAmount: plainOrder.totalAmount,
        paymentMethod: plainOrder.paymentMethod,
        paymentStatus: plainOrder.paymentStatus,
        orderStatus: plainOrder.orderStatus,
        createdAt: plainOrder.createdAt,
        items: (plainOrder.items || []).map((item: any) => ({
          name: item.name || "Handcrafted Furniture Item",
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image,
        })),
        shippingAddress: cleanAddress,
        razorpayPaymentId: plainOrder.razorpayPaymentId,
        razorpayOrderId: plainOrder.razorpayOrderId,
      });
    } catch (e) {
      console.error("Payment Email Trigger Error:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        orderNumber: updatedOrder.orderNumber,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/payment/verify Error:", error);
    return NextResponse.json(
      { error: "Failed to verify Razorpay payment." },
      { status: 500 }
    );
  }
}
