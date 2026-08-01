"use client";

export interface MockUser {
  name: string;
  phone: string;
  city: string;
  neighborhood: string;
}

const STORAGE_KEY = "akazi-hub-user";

export const DEFAULT_USER: MockUser = {
  name: "Muraho Client",
  phone: "+250 788 000 111",
  city: "Kimironko, Kigali",
  neighborhood: "Kimironko",
};

export function getUser(): MockUser {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
}

export function setUser(user: MockUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
