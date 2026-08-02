import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardAdminRequest(req);
  if (!guard.ok) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  if (params.id === guard.user.id) {
    return NextResponse.json({ error: "CANNOT_DELETE_SELF" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const profile = await prisma.workerProfile.findUnique({ where: { userId: target.id } });

  await prisma.$transaction(async (tx) => {
    if (profile) {
      await tx.rating.deleteMany({
        where: { OR: [{ workerProfileId: profile.id }, { raterId: target.id }] },
      });
      await tx.jobPosting.deleteMany({
        where: { OR: [{ workerProfileId: profile.id }, { clientId: target.id }] },
      });
      await tx.workerProfile.delete({ where: { userId: target.id } });
    } else {
      await tx.rating.deleteMany({ where: { raterId: target.id } });
      await tx.jobPosting.deleteMany({ where: { clientId: target.id } });
    }
    await tx.otpCode.deleteMany({ where: { userId: target.id } });
    await tx.session.deleteMany({ where: { userId: target.id } });
    await tx.user.delete({ where: { id: target.id } });
  });

  return NextResponse.json({ ok: true });
}
