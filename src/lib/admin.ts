import "server-only";

import { NextRequest } from "next/server";
import { getCurrentUser, validateCsrf, type SafeUser } from "@/lib/auth";

const ADMIN_ROLE = "ADMIN";

/**
 * Server-side guard used by every admin API route and page.
 *
 * Security model:
 * - A valid server session must exist (HttpOnly cookie, hashed token in DB).
 * - The session owner must have role === ADMIN and be active.
 * - For state-changing requests, the caller must also present a valid CSRF token.
 *
 * Nothing is ever trusted from the client — role checks happen on the server.
 */
export async function requireAdmin(): Promise<SafeUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== ADMIN_ROLE || !user.isActive) return null;
  return user;
}

/** CSRF + authentication guard for admin mutations. */
export async function guardAdminRequest(req: NextRequest): Promise<{ ok: true; user: SafeUser } | { ok: false }> {
  if (!validateCsrf(req.headers.get("x-csrf-token"))) return { ok: false };
  const user = await requireAdmin();
  if (!user) return { ok: false };
  return { ok: true, user };
}

export function isAdminRole(role: string): boolean {
  return role === ADMIN_ROLE;
}
