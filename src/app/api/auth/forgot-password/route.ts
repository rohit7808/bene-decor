import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // 1. Validate email input
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Please enter your registered email address." },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Generic success message to prevent user enumeration attacks
    const genericResponse = NextResponse.json(
      {
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    );

    if (!user) {
      // Return generic response without revealing user non-existence
      return genericResponse;
    }

    // 2. Generate cryptographically random token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 3. Hash the token before storing in MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // 4. Set expiry to 30 minutes from now
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();

    // 5. Construct Production-Ready Reset URL using NEXT_PUBLIC_APP_URL
    const envAppUrl = process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/["']/g, "").trim()
      : null;

    let baseUrl = envAppUrl;

    if (!baseUrl) {
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      baseUrl = `${protocol}://${host}`;
    }

    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const resetUrl = `${cleanBaseUrl}/reset-password?token=${rawToken}`;

    // 6. Send Password Reset Email via Resend
    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (emailErr) {
      console.error("Password reset email dispatch error:", emailErr);
    }

    return genericResponse;
  } catch (error: unknown) {
    console.error("POST /api/auth/forgot-password Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while requesting password reset." },
      { status: 500 }
    );
  }
}
