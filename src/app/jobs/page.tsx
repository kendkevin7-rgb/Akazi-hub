"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, ClipboardList, Loader2, LogIn } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { skillMeta } from "@/lib/mockData";
import clsx from "clsx";

const STATUS_STYLES: Record<string, string> = {
  PENDING_DEPOSIT: "bg-gold-400/15 text-gold-600",
  CONFIRMED: "bg-brand-50 text-brand-600",
  IN_PROGRESS: "bg-brand-50 text-brand-600",
  COMPLETED: "bg-ink-50 text-ink-600",
  CANCELLED: "bg-danger/10 text-danger",
  DISPUTED: "bg-danger/10 text-danger",
};

interface Booking {
  id: string;
  workerName: string;
  clientName: string;
  skill: string;
  task: string;
  scheduledFor: string;
  status: string;
  depositRwf: number;
}

export default function JobsPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch("/api/my-jobs", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { bookings: [] }))
      .then((data) => {
        if (!cancelled) setBookings(data.bookings ?? []);
      })
      .catch(() => {
        if (!cancelled) setBookings([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl2 border border-ink-100 bg-card p-6 py-16 text-center">
        <LogIn size={40} className="text-ink-100" />
        <h1 className="font-display text-lg font-extrabold text-ink-900">{t("myJobsTitle")}</h1>
        <p className="max-w-xs text-sm text-ink-400">{t("loginSubtitle")}</p>
        <Link href="/login" className="tap-target mt-1 rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  const isWorker = user.role === "WORKER";

  if (bookings === null) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <ClipboardList size={40} className="text-ink-100" />
        <p className="font-display font-bold text-ink-900">{t("noJobsYet")}</p>
        <p className="text-sm text-ink-400">{t("noJobsBody")}</p>
        {!isWorker && (
          <Link href="/search" className="tap-target rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white">
            {t("findWorker")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <h1 className="font-display text-xl font-extrabold text-ink-900">
        {isWorker ? t("myBookings") : t("myJobsTitle")}
      </h1>

      <div className="space-y-3">
        {bookings.map((job) => {
          const meta = skillMeta(job.skill as never);
          const date = new Date(job.scheduledFor);
          const counterpart = isWorker ? job.clientName : job.workerName;

          return (
            <div key={job.id} className="rounded-xl2 border border-ink-100 bg-card p-3 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl2 bg-brand-100 font-display font-extrabold text-brand-600">
                  {counterpart
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-sm font-bold text-ink-900">{counterpart}</p>
                    <span
                      className={clsx(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        STATUS_STYLES[job.status]
                      )}
                    >
                      {job.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                    {t(meta.labelKey)}
                  </span>
                </div>
              </div>
              <p className="mt-2 line-clamp-1 text-sm text-ink-600">{job.task}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-medium text-ink-400">
                  <CalendarClock size={12} />
                  {date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="font-display text-xs font-extrabold text-brand-600">
                  {job.depositRwf.toLocaleString()} RWF
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
