"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Worker } from "@/lib/types";
import { skillMeta } from "@/lib/mockData";
import { useLanguage } from "@/components/LanguageProvider";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import HireModal from "@/components/HireModal";

export default function WorkerCard({ worker }: { worker: Worker }) {
  const { t } = useLanguage();
  const [hireOpen, setHireOpen] = useState(false);
  const meta = skillMeta(worker.skill);

  return (
    <div className="rounded-xl2 border border-ink-100 bg-white p-3 shadow-card">
      <div className="flex gap-3">
        <Link href={`/worker/${worker.id}`} className="shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl2 bg-ink-50">
            <Image
              src={worker.photoUrl}
              alt={worker.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
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

      <button
        onClick={() => setHireOpen(true)}
        disabled={!worker.available}
        className="tap-target mt-3 w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400"
      >
        {t("hireNow")}
      </button>

      {hireOpen && <HireModal worker={worker} onClose={() => setHireOpen(false)} />}
    </div>
  );
}
