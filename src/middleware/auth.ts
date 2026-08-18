import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken, JWTPayload } from "@/lib/auth";

/**
 * Authentication result interface
 */
export type AuthResult =
  | { success: true; user: JWTPayload }
  | { success: false; response: NextResponse };

/**
 * Verifies JWT authentication token from HttpOnly cookie or Authorization header.
 */
export function verifyAuthRequest(request: NextRequest): AuthResult {
  // 1. Extract token from HttpOnly cookie
  let token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 2. Fallback: Extract token from Authorization header if present
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 3. Reject request if no token is found
  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication required. Please log in to proceed." },
        { status: 401 }
      ),
    };
  }

  // 4. Verify token payload
  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    user: decoded,
  };
}

/**
 * Ensures request is made by an authenticated administrator.
 */
export function requireAdminRequest(request: NextRequest): AuthResult {
  const authResult = verifyAuthRequest(request);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user.role !== "admin") {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Access denied. Administrator privileges required." },
        { status: 403 }
      ),
    };
  }

  return authResult;
}
