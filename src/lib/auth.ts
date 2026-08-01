import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "akazi_session";
const CSRF_COOKIE = "akazi_csrf";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_PER_WINDOW = 5;
const OTP_WINDOW_MINUTES = 15;
const SCRYPT_KEYLEN = 64;

export interface SafeUser {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  preferredLang: string;
  city: string;
  neighborhood: string | null;
  isActive: boolean;
}

function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "");
  if (!/^\d{9,15}$/.test(digits.replace("+", ""))) return null;

  let e164: string;
  if (digits.startsWith("+")) {
    e164 = digits;
  } else if (digits.startsWith("0")) {
    e164 = `+250${digits.slice(1)}`; // local: 0788... -> +250788...
  } else if (digits.startsWith("7")) {
    e164 = `+250${digits}`; // 788... -> +250788...
  } else {
    e164 = `+${digits}`;
  }

  if (!/^\+2507\d{8}$/.test(e164)) return null; // Rwandan mobile numbers only
  return e164;
}

function hashSecret(value: string, salt: string): string {
  return scryptSync(value, salt, SCRYPT_KEYLEN).toString("hex");
}

export function hashOtp(code: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${hashSecret(code, salt)}`;
}

export function verifyOtpHash(code: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = Buffer.from(hashSecret(code, salt), "hex");
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export function toSafeUser(u: {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  preferredLang: string;
  city: string;
  neighborhood: string | null;
  isActive: boolean;
}): SafeUser {
  return {
    id: u.id,
    phoneNumber: u.phoneNumber,
    fullName: u.fullName,
    role: u.role,
    preferredLang: u.preferredLang,
    city: u.city,
    neighborhood: u.neighborhood,
    isActive: u.isActive,
  };
}

// ---------------------------------------------------------------------------
// OTP lifecycle
// ---------------------------------------------------------------------------

export interface OtpRequestResult {
  ok: boolean;
  error?: string;
  userId?: string;
  isNewUser?: boolean;
  devCode?: string;
}

export async function requestOtp(phoneInput: string, purpose: "LOGIN" | "REGISTRATION"): Promise<OtpRequestResult> {
  const phoneNumber = normalizePhone(phoneInput);
  if (!phoneNumber) return { ok: false, error: "INVALID_PHONE" };

  const existing = await prisma.user.findUnique({ where: { phoneNumber } });
  const userId = existing?.id ?? randomBytes(12).toString("hex");
  const isNewUser = !existing;

  const windowStart = new Date(Date.now() - OTP_WINDOW_MINUTES * 60_000);
  const recent = await prisma.otpCode.count({
    where: { userId, createdAt: { gte: windowStart } },
  });
  if (recent >= OTP_MAX_PER_WINDOW) return { ok: false, error: "RATE_LIMITED" };

  const latest = await prisma.otpCode.findFirst({
    where: { userId, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < OTP_RESEND_SECONDS * 1000) {
    return { ok: false, error: "RESEND_TOO_SOON" };
  }

  if (isNewUser) {
    await prisma.user.create({
      data: {
        id: userId,
        phoneNumber,
        fullName: phoneNumber,
        preferredLang: "en",
      },
    });
  }

  const code = generateOtp();
  await prisma.otpCode.create({
    data: {
      userId,
      codeHash: hashOtp(code),
      purpose: purpose === "REGISTRATION" ? "REGISTRATION" : "LOGIN",
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
    },
  });

  return {
    ok: true,
    userId,
    isNewUser,
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}

export async function verifyOtp(phoneInput: string, codeInput: string, purpose: "LOGIN" | "REGISTRATION") {
  const phoneNumber = normalizePhone(phoneInput);
  if (!phoneNumber || !/^\d{6}$/.test(codeInput.trim())) return { ok: false, error: "INVALID_INPUT" };

  const user = await prisma.user.findUnique({ where: { phoneNumber } });
  if (!user) return { ok: false, error: "NO_ACCOUNT" };

  const otp = await prisma.otpCode.findFirst({
    where: {
      userId: user.id,
      purpose: purpose === "REGISTRATION" ? "REGISTRATION" : "LOGIN",
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return { ok: false, error: "NO_OTP" };
  if (otp.expiresAt < new Date()) return { ok: false, error: "OTP_EXPIRED" };
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, error: "OTP_MAX_ATTEMPTS" };

  const valid = verifyOtpHash(codeInput.trim(), otp.codeHash);
  if (!valid) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return { ok: false, error: "OTP_INCORRECT" };
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
  await prisma.session.deleteMany({ where: { userId: user.id } }); // revoke old sessions on login
  return { ok: true, user };
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const raw = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      tokenHash: hashToken(raw),
      userId,
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
    },
  });

  const store = cookies();
  store.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const store = cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;
  if (session.expiresAt.getTime() - Date.now() < SESSION_TTL_SECONDS * 500) {
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000) },
    });
  }
  return toSafeUser(session.user);
}

export async function destroySession(): Promise<void> {
  const store = cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(raw) } });
  }
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

// ---------------------------------------------------------------------------
// CSRF (double-submit cookie)
// ---------------------------------------------------------------------------

export function getCsrfCookie(): { name: string; token: string } {
  const store = cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing) return { name: CSRF_COOKIE, token: existing };
  const token = randomBytes(24).toString("hex");
  store.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return { name: CSRF_COOKIE, token };
}

export function validateCsrf(headerToken: string | null): boolean {
  const cookie = cookies().get(CSRF_COOKIE)?.value;
  if (!cookie || !headerToken) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(headerToken);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Session / user update
// ---------------------------------------------------------------------------

export async function updateCurrentUser(
  userId: string,
  data: { fullName?: string; city?: string; neighborhood?: string | null; preferredLang?: string }
): Promise<SafeUser | null> {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return toSafeUser(user);
}
