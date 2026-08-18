import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

/**
 * GET /api/settings
 * Public storefront API endpoint returning non-sensitive store configuration.
 */
export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne({}).lean();

    if (!settings) {
      const defaultDoc = new Settings({});
      await defaultDoc.save();
      settings = defaultDoc.toObject();
    }

    // Public sanitized payload
    const publicSettings = {
      storeName: settings.storeName || "Bené Decor",
      logo: settings.logo || "/images/logo.png",
      supportEmail: settings.supportEmail || "support@benedecor.in",
      phone: settings.phone || "+91 98765 43210",
      whatsappNumber: settings.whatsappNumber || "+91 98765 43210",
      address: settings.address || "Jaipur Showroom & Artisan Studio",
      city: settings.city || "Jaipur",
      state: settings.state || "Rajasthan",
      pincode: settings.pincode || "302001",
      country: settings.country || "India",
      businessHours: settings.businessHours || "Mon - Sat: 10:00 AM - 7:00 PM IST",
      description: settings.description || "",
      facebookUrl: settings.facebookUrl || "",
      instagramUrl: settings.instagramUrl || "",
      twitterUrl: settings.twitterUrl || "",
      showSocialLinks: settings.showSocialLinks !== false,

      // Shipping & Order Rules
      minOrderAmount: settings.minOrderAmount || 0,
      freeShippingThreshold: settings.freeShippingThreshold || 0,
      defaultDeliveryCharge: settings.defaultDeliveryCharge || 0,
      enableCOD: settings.enableCOD !== false,
      enableOnlinePayment: settings.enableOnlinePayment !== false,
      estimatedDeliveryDays: settings.estimatedDeliveryDays || "5 to 7 business days",
      cancellationWindowHours: settings.cancellationWindowHours || 24,

      // Tax Rules
      enableTax: settings.enableTax !== false,
      gstPercentage: settings.gstPercentage || 18,
      taxInclusive: settings.taxInclusive !== false,
    };

    return NextResponse.json(
      {
        success: true,
        settings: publicSettings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/settings Error:", error);
    return NextResponse.json(
      { error: "Failed to load public store settings." },
      { status: 500 }
    );
  }
}
