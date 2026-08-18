import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, hashPassword } from "@/lib/auth";
import { sendLoginOtpEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 2. Connect to database
    await connectDB();

    // 3. Find user by normalized email
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[Login API] Processing login request for normalized email: "${normalizedEmail}"`);

    let user = await User.findOne({ email: normalizedEmail });

    // 4. Auto-seed default admin account if logging in as saadgifurniture@gmail.com and account doesn't exist yet
    if (!user && normalizedEmail === "saadgifurniture@gmail.com") {
      const hashedPassword = await hashPassword(process.env.ADMIN_INITIAL_PASSWORD || "Vaibhav@21");
      user = await User.create({
        name: "Administrator",
        email: "saadgifurniture@gmail.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        emailVerified: true,
      });
    }

    if (!user) {
      console.log(`[Login API] User not found for email: "${normalizedEmail}"`);
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // 5. Verify account status
    if (!user.isActive) {
      console.log(`[Login API] Account deactivated for user ID: "${user._id}"`);
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact support." },
        { status: 403 }
      );
    }

    // 6. Compare password
    const isPasswordValid = await comparePassword(password, user.password || "");

    if (!isPasswordValid) {
      console.log(`[Login API] Invalid password provided for user ID: "${user._id}"`);
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // 7. Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(rawOtp)
      .digest("hex");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // Exactly 5 minutes from now

    // 8. Direct MongoDB update to ensure OTP persistence
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          loginOtp: hashedOtp,
          loginOtpExpires: expiresAt,
          loginOtpAttempts: 0,
          loginOtpLastSent: now,
        },
      },
      { new: true }
    );

    console.log(`[OTP Storage Debug] Normalized Email: "${normalizedEmail}"`);
    console.log(`[OTP Storage Debug] OTP record created/updated successfully: ${!!updatedUser?.loginOtp}`);
    console.log(`[OTP Storage Debug] OTP record User ID: "${user._id}"`);
    console.log(`[OTP Storage Debug] OTP Creation Timestamp: ${now.toISOString()}`);
    console.log(`[OTP Storage Debug] OTP Expiry Timestamp: ${expiresAt.toISOString()}`);

    // 9. Send OTP Email via Resend
    try {
      await sendLoginOtpEmail({
        to: user.email,
        name: user.name,
        otp: rawOtp,
      });
    } catch (emailErr) {
      console.error("Login OTP email dispatch error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        requiresOtp: true,
        email: user.email,
        message: "A 6-digit verification code has been sent to your registered email address.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
