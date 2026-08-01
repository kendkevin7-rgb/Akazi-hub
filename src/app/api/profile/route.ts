import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, updateCurrentUser, validateCsrf } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const csrfOk = validateCsrf(req.headers.get("x-csrf-token"));
  if (!csrfOk) return NextResponse.json({ error: "CSRF_INVALID" }, { status: 403 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: { fullName?: string; city?: string; neighborhood?: string; preferredLang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const data: { fullName?: string; city?: string; neighborhood?: string | null; preferredLang?: string } = {};

  if (typeof body.fullName === "string") {
    const fullName = body.fullName.trim();
    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
    }
    data.fullName = fullName;
  }

  if (typeof body.city === "string") {
    const city = body.city.trim();
    if (city.length < 1 || city.length > 80) return NextResponse.json({ error: "INVALID_CITY" }, { status: 400 });
    data.city = city;
  }

  if (typeof body.neighborhood === "string") {
    const neighborhood = body.neighborhood.trim();
    if (neighborhood.length > 80) return NextResponse.json({ error: "INVALID_NEIGHBORHOOD" }, { status: 400 });
    data.neighborhood = neighborhood || null;
  }

  if (typeof body.preferredLang === "string" && ["en", "rw", "fr"].includes(body.preferredLang)) {
    data.preferredLang = body.preferredLang;
  }

  const updated = await updateCurrentUser(user.id, data);
  return NextResponse.json({ user: updated });
}
