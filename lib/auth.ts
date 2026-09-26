import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "cf_admin";
const ALG = "HS256";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_COOKIE_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error("ADMIN_COOKIE_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(raw);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
export const AUTH_MAX_AGE_SEC = MAX_AGE_SEC;

export async function signSession(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    return true;
  } catch {
    return false;
  }
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // still do a dummy comparison to avoid timing leaks
    let diff = 1;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length));
    }
    return false && diff === 0;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
