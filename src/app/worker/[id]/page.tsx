"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, CalendarCheck, Loader2, Phone, MessageCircle, Mail } from "lucide-react";
import { WORKERS, skillMeta } from "@/lib/mockData";
import { useWorkers } from "@/lib/useWorkers";
import { useLanguage } from "@/components/LanguageProvider";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import WorkerAvatar from "@/components/WorkerAvatar";
import HireModal from "@/components/HireModal";
import { telLink, whatsappLink } from "@/lib/contact";

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const { workers, loading } = useWorkers();
  const [hireOpen, setHireOpen] = useState(false);

  const source = workers.length > 0 ? workers : WORKERS;
  const worker = source.find((w) => w.id === params.id);

  if (!worker) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24 text-ink-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      );
    }
    notFound();
  }

  const meta = skillMeta(worker.skill);

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <WorkerAvatar photoUrl={worker.photoUrl} name={worker.name} size={80} />
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

      <div className="grid grid-cols-3 gap-2 rounded-xl2 border border-ink-100 bg-card p-3 text-center">
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

      <section className="rounded-xl2 border border-ink-100 bg-card p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{t("reachWorker")}</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={telLink(worker.momoNumber)}
            className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-brand-500 px-3 py-2.5 text-sm font-bold text-white active:bg-brand-600"
          >
            <Phone size={16} /> {t("call")}
          </a>
          <a
            href={whatsappLink(worker.momoNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white active:opacity-90"
          >
            <MessageCircle size={16} /> {t("whatsapp")}
          </a>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-ink-500">{worker.momoNumber}</p>
        {worker.email && (
          <a
            href={`mailto:${worker.email}`}
            className="tap-target mt-2 flex items-center justify-center gap-1.5 rounded-xl2 border border-ink-100 px-3 py-2.5 text-sm font-bold text-ink-700 active:bg-ink-50"
          >
            <Mail size={16} /> {t("email")}: {worker.email}
          </a>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-ink-100 bg-card/98 px-4 py-3 backdrop-blur">
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
