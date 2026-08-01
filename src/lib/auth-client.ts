"use client";

export interface ClientUser {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  preferredLang: string;
  city: string;
  neighborhood: string | null;
}

const CSRF_COOKIE = "akazi_csrf";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getCsrfToken(): Promise<string> {
  let token = readCookie(CSRF_COOKIE);
  if (!token) {
    const res = await fetch("/api/auth/csrf");
    if (!res.ok) throw new Error("Failed to initialize security token");
    const data: { csrfToken?: string } = await res.json();
    token = data.csrfToken ?? null;
  }
  if (!token) throw new Error("Failed to initialize security token");
  return token;
}

export async function apiWithCsrf(
  url: string,
  options: { method?: string; body?: unknown } = {}
): Promise<Response> {
  const csrfToken = await getCsrfToken();
  return fetch(url, {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

export async function fetchMe(): Promise<ClientUser | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
