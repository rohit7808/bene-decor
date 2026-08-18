import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdminRequest } from "@/middleware/auth";

/**
 * POST /api/admin/change-password
 * Secure Admin password update endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const adminAuth = requireAdminRequest(request);
    if (!adminAuth.success) {
      return adminAuth.response;
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();

    const adminUser = await User.findById(adminAuth.user.userId);

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user record not found." },
        { status: 404 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, adminUser.password || "");

    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Admin password changed successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/admin/change-password Error:", error);
    return NextResponse.json(
      { error: "Failed to change admin password." },
      { status: 500 }
    );
  }
}
