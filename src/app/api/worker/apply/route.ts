import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, validateCsrf } from "@/lib/auth";
import { prisma } from "@/lib/db";

const VALID_SKILLS = [
  "PLUMBER",
  "ELECTRICIAN",
  "CLEANER",
  "PAINTER",
  "MASON",
  "DRIVER",
  "IT_SUPPORT",
  "SOFTWARE_ENGINEER",
  "WEDDING_PLANNER",
  "CHEF",
  "HOME_WORKER",
  "FITNESS_TRAINER",
  "EVENT_SERVICES",
] as const;

const VALID_MOMO = ["MTN_MOMO", "AIRTEL_MONEY"] as const;

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

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
  const nidNumber = typeof body.nidNumber === "string" ? body.nidNumber.replace(/\D/g, "") : "";
  const momoNumber = typeof body.momoNumber === "string" ? body.momoNumber.trim() : "";
  const rateRwf = typeof body.rateRwf === "number" ? Math.floor(body.rateRwf) : NaN;
  const skill = body.skill as string;
  const rateUnit = body.rateUnit as string;
  const momoProvider = body.momoProvider as string;
  const photoFileName = typeof body.photoFileName === "string" ? body.photoFileName.slice(0, 200) : null;
  const cvFileName = typeof body.cvFileName === "string" ? body.cvFileName.slice(0, 200) : null;
  const certFileName = typeof body.certFileName === "string" ? body.certFileName.slice(0, 200) : null;
  const photoDataUrl =
    typeof body.photoDataUrl === "string" && /^data:image\/(png|jpe?g|webp);base64,/.test(body.photoDataUrl)
      ? body.photoDataUrl.slice(0, 2_000_000)
      : null;
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";

  if (fullName.length < 2 || fullName.length > 120) {
    return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
  }
  if (!(VALID_SKILLS as readonly string[]).includes(skill)) {
    return NextResponse.json({ error: "INVALID_SKILL" }, { status: 400 });
  }
  if (!(VALID_MOMO as readonly string[]).includes(momoProvider)) {
    return NextResponse.json({ error: "INVALID_MOMO" }, { status: 400 });
  }
  if (!["hour", "day"].includes(rateUnit)) {
    return NextResponse.json({ error: "INVALID_RATE_UNIT" }, { status: 400 });
  }
  if (!Number.isFinite(rateRwf) || rateRwf < 100 || rateRwf > 10_000_000) {
    return NextResponse.json({ error: "INVALID_RATE" }, { status: 400 });
  }
  if (!neighborhood || neighborhood.length > 80) {
    return NextResponse.json({ error: "INVALID_NEIGHBORHOOD" }, { status: 400 });
  }
  if (!/^\+?\d{9,15}$/.test(momoNumber)) {
    return NextResponse.json({ error: "INVALID_MOMO_NUMBER" }, { status: 400 });
  }
  if (!/^[12]\d{15}$/.test(nidNumber)) {
    return NextResponse.json({ error: "INVALID_NID" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const existing = await prisma.workerProfile.findUnique({
    where: { userId: user.id },
    include: { verification: true },
  });
  if (existing?.verification?.status === "VERIFIED") {
    return NextResponse.json({ error: "ALREADY_VERIFIED" }, { status: 409 });
  }

  await prisma.$transaction(async (tx) => {
    const profile = await tx.workerProfile.upsert({
      where: { userId: user.id },
      update: {
        primarySkill: skill as never,
        rateRwf,
        rateUnit: rateUnit === "day" ? "DAY" : "HOUR",
        momoProvider: momoProvider as never,
        momoNumber,
        photoFileName,
        photoUrl: photoDataUrl ?? undefined,
        cvFileName,
        certFileName,
        email: email || null,
        bio: body.bio && typeof body.bio === "string" ? body.bio.slice(0, 500) : undefined,
      },
      create: {
        userId: user.id,
        primarySkill: skill as never,
        rateRwf,
        rateUnit: rateUnit === "day" ? "DAY" : "HOUR",
        momoProvider: momoProvider as never,
        momoNumber,
        photoFileName,
        photoUrl: photoDataUrl ?? undefined,
        cvFileName,
        certFileName,
        email: email || null,
      },
    });

    await tx.verification.upsert({
      where: { workerProfileId: profile.id },
      update: { nidNumber, status: "PENDING", rejectionReason: null, reviewedBy: null, verifiedAt: null },
      create: { workerProfileId: profile.id, nidNumber, status: "PENDING" },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { fullName, role: "WORKER", neighborhood },
    });
  });

  return NextResponse.json({ ok: true });
}
