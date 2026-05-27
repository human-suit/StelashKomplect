import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sk-admin";

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim();
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminSecret());
}

export async function setAdminSession(): Promise<void> {
  const secret = getAdminSecret();
  if (!secret) return;

  const token = sign("admin-session", secret);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function verifyAdminSession(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const expected = sign("admin-session", secret);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(secret));
  } catch {
    return false;
  }
}
