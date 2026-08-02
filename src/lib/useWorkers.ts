"use client";

import { useEffect, useState } from "react";
import type { Worker } from "@/lib/types";

/**
 * Fetches the admin-verified, active workers. Returns [] while loading so
 * callers can keep showing mock data as a demo fallback.
 */
export function useWorkers(): { workers: Worker[]; loading: boolean } {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/workers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { workers: [] }))
      .then((data) => {
        if (!cancelled) setWorkers(data.workers ?? []);
      })
      .catch(() => {
        if (!cancelled) setWorkers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { workers, loading };
}
