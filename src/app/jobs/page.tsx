"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarClock, ClipboardList } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { JOBS, WORKERS, skillMeta } from "@/lib/mockData";
import clsx from "clsx";

const STATUS_STYLES: Record<string, string> = {
  PENDING_DEPOSIT: "bg-gold-400/15 text-gold-600",
  CONFIRMED: "bg-brand-50 text-brand-600",
  IN_PROGRESS: "bg-brand-50 text-brand-600",
  COMPLETED: "bg-ink-50 text-ink-600",
  CANCELLED: "bg-danger/10 text-danger",
};

export default function JobsPage() {
  const { t } = useLanguage();

  if (JOBS.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <ClipboardList size={40} className="text-ink-100" />
        <p className="font-display font-bold text-ink-900">{t("noJobsYet")}</p>
        <p className="text-sm text-ink-400">{t("noJobsBody")}</p>
        <Link href="/search" className="tap-target rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white">
          {t("findWorker")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <h1 className="font-display text-xl font-extrabold text-ink-900">{t("myJobsTitle")}</h1>

      <div className="space-y-3">
        {JOBS.map((job) => {
          const worker = WORKERS.find((w) => w.id === job.workerId);
          if (!worker) return null;
          const meta = skillMeta(worker.skill);
          const date = new Date(job.scheduledFor);

          return (
            <Link
              key={job.id}
              href={`/worker/${worker.id}`}
              className="block rounded-xl2 border border-ink-100 bg-white p-3 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl2 bg-ink-50">
                  <Image src={worker.photoUrl} alt={worker.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-sm font-bold text-ink-900">{worker.name}</p>
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
              <p className="mt-2 line-clamp-1 text-sm text-ink-600">{job.taskDescription}</p>
              <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-ink-400">
                <CalendarClock size={12} />
                {date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
