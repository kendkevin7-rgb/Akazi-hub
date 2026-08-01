"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, CalendarCheck } from "lucide-react";
import { WORKERS, skillMeta } from "@/lib/mockData";
import { useLanguage } from "@/components/LanguageProvider";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import HireModal from "@/components/HireModal";

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [hireOpen, setHireOpen] = useState(false);
  const worker = WORKERS.find((w) => w.id === params.id);

  if (!worker) notFound();

  const meta = skillMeta(worker.skill);

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl2 bg-ink-50">
          <Image src={worker.photoUrl} alt={worker.name} fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-ink-900">{worker.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.bg} ${meta.color}`}>
              {t(meta.labelKey)}
            </span>
            <VerifiedBadge verified={worker.nidVerified} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
            <MapPin size={12} />
            {worker.neighborhood}, {worker.city}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl2 border border-ink-100 bg-white p-3 text-center">
        <div>
          <StarRating rating={worker.rating} />
          <p className="mt-1 text-[11px] font-semibold text-ink-400">
            {worker.ratingCount} ratings
          </p>
        </div>
        <div className="border-x border-ink-100">
          <p className="font-display text-base font-extrabold text-ink-900">{worker.jobsCompleted}</p>
          <p className="mt-1 text-[11px] font-semibold text-ink-400">{t("jobsCompleted")}</p>
        </div>
        <div>
          <p className="font-display text-base font-extrabold text-ink-900">{worker.yearsActive}</p>
          <p className="mt-1 text-[11px] font-semibold text-ink-400">{t("yearsActive")}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 font-display text-sm font-bold text-ink-900">
          <Briefcase size={16} className="text-brand-500" />
          Bio
        </h2>
        <p className="text-sm leading-relaxed text-ink-600">{worker.bio}</p>
      </section>

      {worker.secondarySkills && worker.secondarySkills.length > 0 && (
        <section>
          <h2 className="mb-2 font-display text-sm font-bold text-ink-900">Also skilled in</h2>
          <div className="flex flex-wrap gap-1.5">
            {worker.secondarySkills.map((s) => {
              const m = skillMeta(s);
              return (
                <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-bold ${m.bg} ${m.color}`}>
                  {t(m.labelKey)}
                </span>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
          <CalendarCheck size={16} className="text-brand-500" />
          Starting rate
        </div>
        <p className="font-display text-lg font-extrabold text-brand-600">
          {worker.rateRwf.toLocaleString()} RWF
          <span className="text-xs font-semibold text-ink-400">
            {worker.rateUnit === "hour" ? t("perHour") : t("perDay")}
          </span>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-ink-100 bg-white/98 px-4 py-3 backdrop-blur">
        <div className="container-mobile">
          <button
            onClick={() => setHireOpen(true)}
            disabled={!worker.available}
            className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:bg-ink-100 disabled:text-ink-400"
          >
            {t("hireNow")}
          </button>
        </div>
      </div>

      {hireOpen && <HireModal worker={worker} onClose={() => setHireOpen(false)} />}
    </div>
  );
}
