import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardAdminRequest(req);
  if (!guard.ok) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  let body: { isActive?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  // An admin can never suspend themselves.
  if (params.id === guard.user.id && !body.isActive) {
    return NextResponse.json({ error: "CANNOT_SUSPEND_SELF" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  await prisma.user.update({
    where: { id: target.id },
    data: { isActive: body.isActive },
  });

  if (!body.isActive) {
    // Revoke all live sessions so the suspended user is signed out immediately.
    await prisma.session.deleteMany({ where: { userId: target.id } });
  }

  return NextResponse.json({ ok: true });
}
