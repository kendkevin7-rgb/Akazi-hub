import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyOtp, validateCsrf } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const csrfOk = validateCsrf(req.headers.get("x-csrf-token"));
  if (!csrfOk) return NextResponse.json({ error: "CSRF_INVALID" }, { status: 403 });

  let body: { phoneNumber?: string; code?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber : "";
  const code = typeof body.code === "string" ? body.code : "";
  const purpose = body.purpose === "REGISTRATION" ? "REGISTRATION" : "LOGIN";
  if (!phoneNumber || !code) return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });

  const result = await verifyOtp(phoneNumber, code, purpose);
  if (!result.ok || !result.user) {
    const status = result.error === "OTP_INCORRECT" || result.error === "OTP_MAX_ATTEMPTS" ? 401 : 400;
    return NextResponse.json({ error: result.error ?? "INVALID_INPUT" }, { status });
  }

  await createSession(result.user.id);
  return NextResponse.json({ ok: true });
}
