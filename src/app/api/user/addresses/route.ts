import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/user/addresses
 * Fetches saved addresses for the authenticated customer only.
 */
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view addresses." },
        { status: 401 }
      );
    }

    await connectDB();

    const dbUser = await User.findById(authUser.userId).select("addresses").lean();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Customer profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        addresses: dbUser.addresses || [],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/user/addresses Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch addresses." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/addresses
 * Adds a new address to the authenticated customer's MongoDB profile.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required to add address." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phone, street, city, state, pincode, country = "India", isDefault = false } = body;

    // Server-side validation
    if (!street || !street.trim()) {
      return NextResponse.json({ error: "Street / House address is required." }, { status: 400 });
    }
    if (!city || !city.trim()) {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (!state || !state.trim()) {
      return NextResponse.json({ error: "State is required." }, { status: 400 });
    }
    if (!pincode || !pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      return NextResponse.json({ error: "Please enter a valid 6-digit Pincode." }, { status: 400 });
    }

    await connectDB();

    const dbUser = await User.findById(authUser.userId);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isFirstAddress = !dbUser.addresses || dbUser.addresses.length === 0;
    const shouldBeDefault = isDefault || isFirstAddress;

    if (shouldBeDefault && dbUser.addresses) {
      dbUser.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName: fullName ? fullName.trim() : dbUser.name,
      phone: phone ? phone.trim() : dbUser.phone,
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: country.trim(),
      isDefault: shouldBeDefault,
    };

    dbUser.addresses.push(newAddress as any);
    await dbUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully.",
        addresses: dbUser.addresses,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/user/addresses Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add address." },
      { status: 500 }
    );
  }
}
