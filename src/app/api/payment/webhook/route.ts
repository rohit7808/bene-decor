import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendPaymentSuccessEmail } from "@/lib/email";

/**
 * POST /api/payment/webhook
 * Production-ready Razorpay Webhook API handler.
 * Verifies HMAC SHA256 signature using x-razorpay-signature and RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    const secret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "";

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret is not configured on server." },
        { status: 500 }
      );
    }

    // Verify HMAC SHA256 Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Razorpay Webhook Signature Mismatch!");
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    await connectDB();

    if (event === "payment.captured" || event === "order.paid") {
      if (razorpayOrderId) {
        const updatedOrder = await Order.findOneAndUpdate(
          {
            $or: [
              { razorpayOrderId },
              { orderNumber: razorpayOrderId },
            ],
          },
          {
            $set: {
              paymentStatus: "Paid",
              isPaid: true,
              paidAt: new Date(),
              ...(razorpayPaymentId && { razorpayPaymentId }),
              ...(razorpayOrderId && { razorpayOrderId }),
            },
          },
          { new: true }
        );

        if (updatedOrder) {
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
            console.error("Webhook Payment Email Trigger Error:", e);
          }
        }
      }
    } else if (event === "payment.failed") {
      if (razorpayOrderId) {
        await Order.findOneAndUpdate(
          {
            $or: [
              { razorpayOrderId },
              { orderNumber: razorpayOrderId },
            ],
          },
          {
            $set: {
              paymentStatus: "Failed",
              isPaid: false,
              ...(razorpayPaymentId && { razorpayPaymentId }),
              ...(razorpayOrderId && { razorpayOrderId }),
            },
          }
        );
      }
    }

    return NextResponse.json(
      {
        status: "ok",
        message: `Razorpay webhook event '${event}' processed successfully.`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/payment/webhook Error:", error);
    return NextResponse.json(
      { error: "Failed to process Razorpay webhook event." },
      { status: 500 }
    );
  }
}
