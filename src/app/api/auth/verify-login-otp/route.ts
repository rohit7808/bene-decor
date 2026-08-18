import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email address and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const cleanOtp = String(otp).trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { error: "Verification code must be a 6-digit number." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[OTP Verification Debug] Verification request for normalized email: "${normalizedEmail}"`);

    const user = await User.findOne({ email: normalizedEmail });

    console.log(`[OTP Verification Debug] Verification record found in DB: ${!!user}`);
    console.log(`[OTP Verification Debug] Document User ID: "${user?._id || 'NONE'}"`);
    console.log(`[OTP Verification Debug] Email matches identifier: ${user ? user.email === normalizedEmail : false}`);
    console.log(`[OTP Verification Debug] Stored loginOtp exists: ${!!user?.loginOtp}`);
    console.log(`[OTP Verification Debug] Stored loginOtpExpires: ${user?.loginOtpExpires ? new Date(user.loginOtpExpires).toISOString() : 'NONE'}`);

    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    if (!user.loginOtp || !user.loginOtpExpires) {
      console.warn(`[OTP Verification Debug] No active OTP found for user ID: "${user._id}"`);
      return NextResponse.json(
        { error: "No active verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    // 1. Check max attempts limit (5 failed attempts max)
    const attempts = user.loginOtpAttempts || 0;
    if (attempts >= 5) {
      console.warn(`[OTP Verification Debug] Maximum attempts exceeded (${attempts}) for user ID: "${user._id}"`);
      return NextResponse.json(
        { error: "Maximum verification attempts exceeded. Please request a new OTP code." },
        { status: 429 }
      );
    }

    // 2. Check token expiry (5 minutes)
    const now = new Date();
    const expiresAt = new Date(user.loginOtpExpires);
    const isExpired = now > expiresAt;
    console.log(`[OTP Verification Debug] Current Time: ${now.toISOString()}, Expiry Time: ${expiresAt.toISOString()}`);
    console.log(`[OTP Verification Debug] OTP expired: ${isExpired}`);

    if (isExpired) {
      return NextResponse.json(
        { error: "OTP expired. Please request a new OTP code." },
        { status: 400 }
      );
    }

    // 3. Hash incoming OTP to match stored SHA-256 hash
    const hashedInputOtp = crypto
      .createHash("sha256")
      .update(cleanOtp)
      .digest("hex");

    if (hashedInputOtp !== user.loginOtp) {
      console.warn(`[OTP Verification Debug] Invalid OTP mismatch for user ID: "${user._id}"`);
      await User.findByIdAndUpdate(user._id, {
        $inc: { loginOtpAttempts: 1 },
      });

      const remainingAttempts = 5 - (attempts + 1);
      return NextResponse.json(
        {
          error: `Invalid OTP code. ${
            remainingAttempts > 0
              ? `${remainingAttempts} attempt(s) remaining.`
              : "Please request a new code."
          }`,
        },
        { status: 400 }
      );
    }

    // 4. OTP Verified Successfully! Clear OTP fields via direct $unset
    console.log(`[OTP Verification Debug] OTP verified successfully for user ID: "${user._id}"`);
    await User.findByIdAndUpdate(user._id, {
      $unset: {
        loginOtp: 1,
        loginOtpExpires: 1,
        loginOtpLastSent: 1,
      },
      $set: {
        loginOtpAttempts: 0,
      },
    });

    // 5. Generate JWT Token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 6. Set HttpOnly Cookie
    await setAuthCookie(token);

    // 7. Return complete user payload
    return NextResponse.json(
      {
        success: true,
        message: "Login verified successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/auth/verify-login-otp Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during OTP verification." },
      { status: 500 }
    );
  }
}
