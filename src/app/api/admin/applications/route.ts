import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const status = req.nextUrl.searchParams.get("status");
  const allowed = ["PENDING", "VERIFIED", "REJECTED"];
  const filter = status && allowed.includes(status) ? status : "PENDING";

  const applications = await prisma.workerProfile.findMany({
    where: { verification: { status: filter as never } },
    include: {
      user: { select: { id: true, fullName: true, phoneNumber: true, neighborhood: true, isActive: true, createdAt: true } },
      verification: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    applications: applications.map((a) => ({
      profileId: a.id,
      userId: a.user.id,
      fullName: a.user.fullName,
      phoneNumber: a.user.phoneNumber,
      neighborhood: a.user.neighborhood,
      isActive: a.user.isActive,
      createdAt: a.createdAt.toISOString(),
      appliedAt: a.verification?.createdAt.toISOString() ?? null,
      skill: a.primarySkill,
      rateRwf: a.rateRwf,
      rateUnit: a.rateUnit,
      momoProvider: a.momoProvider,
      momoNumber: a.momoNumber,
      nidNumber: a.verification?.nidNumber ?? null,
      photoUrl: a.photoUrl,
      photoFileName: a.photoFileName,
      cvFileName: a.cvFileName,
      certFileName: a.certFileName,
      status: a.verification?.status ?? "PENDING",
      rejectionReason: a.verification?.rejectionReason ?? null,
    })),
  });
}
