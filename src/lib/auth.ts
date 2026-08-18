import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * JWT Secret Key configuration retrieved from environment variables
 */
const JWT_SECRET = process.env.JWT_SECRET || "bene_decor_secret_jwt_key_2026_luxury_furniture_secret";

/**
 * Cookie Name for HttpOnly Authentication Token
 */
export const AUTH_COOKIE_NAME = "benedecor_auth_token";

/**
 * TypeScript Interface for JWT Payload
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

/**
 * Hashes plain text password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plain text password with hashed password stored in database.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Signs a new JWT token containing user payload.
 */
export function signToken(
  payload: JWTPayload,
  expiresIn: string = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT token string.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Sets secure HttpOnly cookie containing JWT token in response headers.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clears HttpOnly authentication cookie on logout.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Helper to retrieve currently authenticated user from HttpOnly request cookie.
 */
export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) return null;

    return verifyToken(token);
  } catch {
    return null;
  }
}
