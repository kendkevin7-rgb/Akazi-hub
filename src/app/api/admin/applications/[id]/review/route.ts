import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardAdminRequest(req);
  if (!guard.ok) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  let body: { action?: string; rejectionReason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const action = body.action === "APPROVE" ? "APPROVE" : body.action === "REJECT" ? "REJECT" : null;
  if (!action) return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });

  const profile = await prisma.workerProfile.findUnique({
    where: { id: params.id },
    include: { verification: true },
  });
  if (!profile?.verification) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  let rejectionReason: string | null = null;
  if (action === "REJECT") {
    rejectionReason =
      typeof body.rejectionReason === "string" && body.rejectionReason.trim()
        ? body.rejectionReason.trim().slice(0, 300)
        : null;
  }

  await prisma.verification.update({
    where: { id: profile.verification.id },
    data: {
      status: action === "APPROVE" ? "VERIFIED" : "REJECTED",
      verifiedAt: action === "APPROVE" ? new Date() : null,
      reviewedBy: guard.user.id,
      rejectionReason,
    },
  });

  return NextResponse.json({ ok: true });
}
