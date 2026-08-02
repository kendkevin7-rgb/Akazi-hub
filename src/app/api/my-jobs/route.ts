import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const isWorker = user.role === "WORKER";

  const bookings = await prisma.jobPosting.findMany({
    where: isWorker
      ? { workerProfile: { userId: user.id } }
      : { clientId: user.id },
    include: {
      client: { select: { fullName: true, phoneNumber: true } },
      workerProfile: { include: { user: { select: { fullName: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    role: user.role,
    bookings: bookings.map((b) => ({
      id: b.id,
      workerName: b.workerProfile.user.fullName,
      clientName: b.client.fullName,
      skill: b.workerProfile.primarySkill,
      task: b.taskDescription,
      scheduledFor: b.scheduledFor.toISOString(),
      status: b.status,
      depositRwf: b.depositRwf,
    })),
  });
}
