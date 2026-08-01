import { NextRequest, NextResponse } from "next/server";
import { destroySession, validateCsrf } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const csrfOk = validateCsrf(req.headers.get("x-csrf-token"));
  if (!csrfOk) return NextResponse.json({ error: "CSRF_INVALID" }, { status: 403 });

  await destroySession();
  return NextResponse.json({ ok: true });
}
