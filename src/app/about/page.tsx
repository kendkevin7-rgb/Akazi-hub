"use client";

import Link from "next/link";
import { ChevronLeft, Hammer, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/profile" aria-label={t("backToProfile")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 p-1.5 text-brand-600">
            <Hammer size={18} />
          </span>
          <h1 className="font-display text-lg font-extrabold text-ink-900">{t("aboutTitle")}</h1>
        </div>
      </div>

      <p className="rounded-xl2 border border-ink-100 bg-card p-4 text-sm leading-relaxed text-ink-600">
        {t("aboutBody")}
      </p>

      <section className="rounded-xl2 border border-ink-100 bg-card p-4">
        <h2 className="mb-1 font-display text-base font-bold text-ink-900">{t("aboutMission")}</h2>
        <p className="text-sm leading-relaxed text-ink-600">{t("aboutMissionBody")}</p>
      </section>

      <section className="rounded-xl2 border border-ink-100 bg-card p-4">
        <h2 className="mb-2 font-display text-base font-bold text-ink-900">{t("aboutContact")}</h2>
        <div className="space-y-2 text-sm font-semibold text-ink-700">
          <p className="flex items-center gap-2.5">
            <Mail size={16} className="text-ink-400" />
            {t("aboutEmail")}
          </p>
          <p className="flex items-center gap-2.5">
            <MapPin size={16} className="text-ink-400" />
            Kigali, Rwanda
          </p>
        </div>
      </section>
    </div>
  );
}
