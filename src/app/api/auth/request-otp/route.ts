import { NextRequest, NextResponse } from "next/server";
import { requestOtp, validateCsrf } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const csrfOk = validateCsrf(req.headers.get("x-csrf-token"));
  if (!csrfOk) return NextResponse.json({ error: "CSRF_INVALID" }, { status: 403 });

  let body: { phoneNumber?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber : "";
  const purpose = body.purpose === "REGISTRATION" ? "REGISTRATION" : "LOGIN";
  if (!phoneNumber) return NextResponse.json({ error: "INVALID_PHONE" }, { status: 400 });

  const result = await requestOtp(phoneNumber, purpose);
  if (!result.ok) {
    const status = result.error === "RATE_LIMITED" || result.error === "RESEND_TOO_SOON" ? 429 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    isNewUser: result.isNewUser,
    devCode: result.devCode,
    expiresInMinutes: 10,
  });
}
