import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH / PUT /api/user/addresses/[id]
 * Updates or sets default for an address belonging to the authenticated customer.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update address." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Address ObjectId." }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const dbUser = await User.findById(authUser.userId);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const targetAddress = dbUser.addresses.find(
      (addr) => addr._id && addr._id.toString() === id
    );

    if (!targetAddress) {
      return NextResponse.json(
        { error: "Address not found or does not belong to your account." },
        { status: 404 }
      );
    }

    if (body.isDefault) {
      dbUser.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      targetAddress.isDefault = true;
    }

    if (body.fullName !== undefined) targetAddress.fullName = String(body.fullName).trim();
    if (body.phone !== undefined) targetAddress.phone = String(body.phone).trim();
    if (body.street !== undefined) targetAddress.street = String(body.street).trim();
    if (body.city !== undefined) targetAddress.city = String(body.city).trim();
    if (body.state !== undefined) targetAddress.state = String(body.state).trim();
    if (body.pincode !== undefined) targetAddress.pincode = String(body.pincode).trim();
    if (body.country !== undefined) targetAddress.country = String(body.country).trim();

    await dbUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully.",
        addresses: dbUser.addresses,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH /api/user/addresses/[id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update address." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, params: RouteParams) {
  return PATCH(request, params);
}

/**
 * DELETE /api/user/addresses/[id]
 * Deletes an address belonging to the authenticated customer.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required to delete address." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Address ObjectId." }, { status: 400 });
    }

    await connectDB();

    const dbUser = await User.findById(authUser.userId);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const initialLength = dbUser.addresses.length;
    dbUser.addresses = dbUser.addresses.filter(
      (addr) => addr._id && addr._id.toString() !== id
    );

    if (dbUser.addresses.length === initialLength) {
      return NextResponse.json(
        { error: "Address not found or does not belong to your account." },
        { status: 404 }
      );
    }

    // If deleted address was default and remaining addresses exist, set first one as default
    if (dbUser.addresses.length > 0 && !dbUser.addresses.some((a) => a.isDefault)) {
      dbUser.addresses[0].isDefault = true;
    }

    await dbUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully.",
        addresses: dbUser.addresses,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/user/addresses/[id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete address." },
      { status: 500 }
    );
  }
}
