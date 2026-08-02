import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, validateCsrf } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEPOSIT_RWF = 2000;

export async function POST(req: NextRequest) {
  if (!validateCsrf(req.headers.get("x-csrf-token"))) {
    return NextResponse.json({ error: "CSRF_INVALID" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const workerProfileId = typeof body.workerId === "string" ? body.workerId : "";
  const task = typeof body.task === "string" ? body.task.trim().slice(0, 1000) : "";
  const date = typeof body.date === "string" ? body.date : "";
  const time = typeof body.time === "string" ? body.time : "";
  const clientPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";

  if (task.length < 3) return NextResponse.json({ error: "INVALID_TASK" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ error: "INVALID_TIME" }, { status: 400 });
  if (!/^\+?\d{9,15}$/.test(clientPhone)) {
    return NextResponse.json({ error: "INVALID_PHONE" }, { status: 400 });
  }

  const scheduledFor = new Date(`${date}T${time}:00`);
  if (Number.isNaN(scheduledFor.getTime())) {
    return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  }

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { id: workerProfileId },
    include: { verification: true },
  });
  if (!workerProfile?.verification || workerProfile.verification.status !== "VERIFIED") {
    return NextResponse.json({ error: "WORKER_NOT_VERIFIED" }, { status: 400 });
  }

  const booking = await prisma.jobPosting.create({
    data: {
      clientId: user.id,
      workerProfileId,
      taskDescription: task,
      scheduledFor,
      clientPhone,
      depositRwf: DEPOSIT_RWF,
      depositPaidAt: new Date(),
      status: "CONFIRMED",
    },
  });

  return NextResponse.json({ ok: true, id: booking.id });
}
