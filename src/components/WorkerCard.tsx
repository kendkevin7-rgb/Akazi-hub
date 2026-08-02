"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Worker } from "@/lib/types";
import { skillMeta } from "@/lib/mockData";
import { useLanguage } from "@/components/LanguageProvider";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import WorkerAvatar from "@/components/WorkerAvatar";

export default function WorkerCard({ worker }: { worker: Worker }) {
  const { t } = useLanguage();
  const meta = skillMeta(worker.skill);

  return (
    <div className="rounded-xl2 border border-ink-100 bg-card p-3 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-floating">
      <div className="flex gap-3">
        <Link href={`/worker/${worker.id}`} className="shrink-0">
          <WorkerAvatar photoUrl={worker.photoUrl} name={worker.name} size={64} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/worker/${worker.id}`} className="min-w-0">
              <p className="truncate font-display font-bold text-ink-900">{worker.name}</p>
            </Link>
            {!worker.available && (
              <span className="shrink-0 rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-400">
                busy
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.bg} ${meta.color}`}>
              {t(meta.labelKey)}
            </span>
            <VerifiedBadge verified={worker.nidVerified} />
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-400">
            <MapPin size={12} />
            {worker.neighborhood}, {worker.city}
          </div>

          <div className="mt-1.5 flex items-center justify-between">
            <StarRating rating={worker.rating} count={worker.ratingCount} />
            <p className="font-display text-sm font-extrabold text-brand-600">
              {worker.rateRwf.toLocaleString()} RWF
              <span className="text-xs font-semibold text-ink-400">
                {worker.rateUnit === "hour" ? t("perHour") : t("perDay")}
              </span>
            </p>
          </div>
        </div>
      </div>

      {worker.available ? (
        <Link
          href={`/hire/${worker.id}`}
          className="tap-target mt-3 w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600"
        >
          {t("hireNow")}
        </Link>
      ) : (
        <button
          disabled
          className="tap-target mt-3 w-full cursor-not-allowed rounded-xl2 bg-ink-100 text-sm font-bold text-ink-400"
        >
          {t("hireNow")}
        </button>
      )}
    </div>
  );
}
