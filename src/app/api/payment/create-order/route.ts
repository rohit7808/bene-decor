import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";

/**
 * POST /api/payment/create-order
 * Creates a Razorpay Order in Test Mode and returns order_id, amount, currency, and key_id.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt = `rcpt_${Date.now()}` } = body;

    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount. Amount must be greater than 0." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("PASTE_MY_RAZORPAY")) {
      return NextResponse.json(
        {
          error: "Razorpay Key ID or Secret is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.",
        },
        { status: 500 }
      );
    }

    // Amount in paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(numAmount * 100);

    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt,
      notes: {
        store: "Bené Decor Luxury Furniture",
      },
    });

    return NextResponse.json(
      {
        success: true,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: keyId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/payment/create-order Error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay payment order." },
      { status: 500 }
    );
  }
}
