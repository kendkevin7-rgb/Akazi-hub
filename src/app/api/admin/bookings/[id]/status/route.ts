import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin";
import { prisma } from "@/lib/db";

const ALLOWED = ["PENDING_DEPOSIT", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISPUTED"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardAdminRequest(req);
  if (!guard.ok) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== "string" || !ALLOWED.includes(status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const booking = await prisma.jobPosting.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  await prisma.jobPosting.update({
    where: { id: params.id },
    data: { status: status as never },
  });

  return NextResponse.json({ ok: true });
}
