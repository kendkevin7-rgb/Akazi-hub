import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const bookings = await prisma.jobPosting.findMany({
    include: {
      client: { select: { fullName: true, phoneNumber: true } },
      workerProfile: { include: { user: { select: { fullName: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      clientName: b.client.fullName,
      clientPhone: b.clientPhone,
      workerName: b.workerProfile.user.fullName,
      task: b.taskDescription,
      scheduledFor: b.scheduledFor.toISOString(),
      status: b.status,
      depositRwf: b.depositRwf,
      depositPaidAt: b.depositPaidAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
    })),
  });
}
