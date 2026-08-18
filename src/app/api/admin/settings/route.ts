import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * GET /api/admin/settings
 * Secure Admin endpoint to fetch complete store configuration.
 */
export async function GET(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    await connectDB();

    let settings = await Settings.findOne({}).lean();

    if (!settings) {
      // Create default settings if none exists yet
      const defaultDoc = new Settings({});
      await defaultDoc.save();
      settings = defaultDoc.toObject();
    }

    return NextResponse.json(
      {
        success: true,
        settings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/admin/settings Error:", error);
    return NextResponse.json(
      { error: "Failed to load store settings." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Secure Admin endpoint to update store configuration with server-side validation.
 */
export async function PUT(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const body = await request.json();

    // Server-side Input Validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (body.businessEmail && !emailRegex.test(body.businessEmail.trim())) {
      return NextResponse.json({ error: "Invalid business email address format." }, { status: 400 });
    }
    if (body.supportEmail && !emailRegex.test(body.supportEmail.trim())) {
      return NextResponse.json({ error: "Invalid support email address format." }, { status: 400 });
    }
    if (body.senderEmail && !emailRegex.test(body.senderEmail.trim())) {
      return NextResponse.json({ error: "Invalid sender email address format." }, { status: 400 });
    }

    if (body.pincode && !/^\d{6}$/.test(String(body.pincode).trim())) {
      return NextResponse.json({ error: "Please enter a valid 6-digit Pincode." }, { status: 400 });
    }

    if (typeof body.gstPercentage === "number" && (body.gstPercentage < 0 || body.gstPercentage > 100)) {
      return NextResponse.json({ error: "GST percentage must be between 0% and 100%." }, { status: 400 });
    }

    if (typeof body.minOrderAmount === "number" && body.minOrderAmount < 0) {
      return NextResponse.json({ error: "Minimum order amount cannot be negative." }, { status: 400 });
    }

    if (typeof body.defaultDeliveryCharge === "number" && body.defaultDeliveryCharge < 0) {
      return NextResponse.json({ error: "Delivery charge cannot be negative." }, { status: 400 });
    }

    await connectDB();

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        message: "Store settings updated successfully.",
        settings: updatedSettings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/admin/settings Error:", error);
    return NextResponse.json(
      { error: "Failed to update store settings." },
      { status: 500 }
    );
  }
}
