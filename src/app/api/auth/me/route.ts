import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/auth/me
 * Retrieves current authenticated user session from HttpOnly JWT cookie.
 */
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const dbUser = await User.findById(authUser.userId).select("-password -loginOtp").lean();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const fullUser = {
      userId: dbUser._id.toString(),
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      phone: dbUser.phone || "",
      avatar: dbUser.avatar || "",
      addresses: dbUser.addresses || [],
    };

    return NextResponse.json(
      {
        success: true,
        user: fullUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/auth/me Error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication check failed" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/me
 * Updates authenticated customer's profile (name, phone, addresses) in MongoDB.
 */
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, addresses } = body;

    await connectDB();

    const updateFields: any = {};
    if (typeof name === "string" && name.trim()) {
      updateFields.name = name.trim();
    }
    if (typeof phone === "string") {
      updateFields.phone = phone.trim();
    }
    if (Array.isArray(addresses)) {
      updateFields.addresses = addresses;
    }

    const updatedUser = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar,
          addresses: updatedUser.addresses,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/auth/me Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
