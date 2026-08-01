import { NextResponse } from "next/server";
import { getCsrfCookie } from "@/lib/auth";

export async function GET() {
  const { token } = getCsrfCookie();
  return NextResponse.json({ csrfToken: token });
}
