import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendLoginOtpEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[Resend OTP API] Resend request for normalized email: "${normalizedEmail}"`);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`[Resend OTP API] User not found for email: "${normalizedEmail}"`);
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    // 1. Enforce 60-second cooldown rate limiting
    if (user.loginOtpLastSent) {
      const elapsed = Date.now() - new Date(user.loginOtpLastSent).getTime();
      if (elapsed < 60000) {
        const secondsLeft = Math.ceil((60000 - elapsed) / 1000);
        console.log(`[Resend OTP API] Rate limit hit. User must wait ${secondsLeft}s.`);
        return NextResponse.json(
          { error: `Please wait ${secondsLeft} second(s) before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    // 2. Generate new cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(rawOtp)
      .digest("hex");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    // 3. Direct MongoDB update to ensure new OTP persistence
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

    console.log(`[Resend OTP Storage Debug] Normalized Email: "${normalizedEmail}"`);
    console.log(`[Resend OTP Storage Debug] New OTP record created/updated: ${!!updatedUser?.loginOtp}`);
    console.log(`[Resend OTP Storage Debug] User ID: "${user._id}"`);
    console.log(`[Resend OTP Storage Debug] Creation Timestamp: ${now.toISOString()}`);
    console.log(`[Resend OTP Storage Debug] Expiry Timestamp: ${expiresAt.toISOString()}`);

    // 4. Send Email via Resend
    try {
      await sendLoginOtpEmail({
        to: user.email,
        name: user.name,
        otp: rawOtp,
      });
    } catch (emailErr) {
      console.error("Resend OTP email dispatch error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "A new 6-digit verification code has been sent to your email address.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/auth/resend-login-otp Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resending the OTP code." },
      { status: 500 }
    );
  }
}
