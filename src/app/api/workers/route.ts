import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never cache: this must always reflect the latest admin-approved workers.
export const dynamic = "force-dynamic";

export async function GET() {
  const profiles = await prisma.workerProfile.findMany({
    where: {
      verification: { status: "VERIFIED" },
      user: { isActive: true },
    },
    include: {
      user: { select: { id: true, fullName: true, neighborhood: true, city: true } },
      verification: { select: { status: true } },
      ratingsReceived: { select: { stars: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  const workers = profiles.map((p) => {
    const ratings = p.ratingsReceived.map((r) => r.stars);
    const rating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

    return {
      id: p.id,
      name: p.user.fullName,
      skill: p.primarySkill,
      secondarySkills: p.secondarySkills,
      neighborhood: p.user.neighborhood ?? "Kigali",
      city: p.user.city,
      nidVerified: p.verification?.status === "VERIFIED",
      rating,
      ratingCount: ratings.length,
      rateRwf: p.rateRwf,
      rateUnit: p.rateUnit === "DAY" ? "day" : "hour",
      photoUrl: p.photoUrl ?? "",
      jobsCompleted: p.jobsCompleted,
      yearsActive: p.yearsActive,
      momoProvider: p.momoProvider,
      momoNumber: p.momoNumber,
      bio: p.bio ?? "",
      available: p.isAvailable,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ workers });
}
