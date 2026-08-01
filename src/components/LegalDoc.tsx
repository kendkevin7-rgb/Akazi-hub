"use client";

import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export interface LegalSection {
  heading: string;
  body: string;
}

export default function LegalDoc({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2">
        <Link href="/profile" aria-label={t("back")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 p-1.5 text-brand-600">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h1 className="font-display text-lg font-extrabold text-ink-900">{title}</h1>
            <p className="text-[11px] font-semibold text-ink-400">
              {t("lastUpdated")}: {updated}
            </p>
          </div>
        </div>
      </div>

      <p className="rounded-xl2 border border-ink-100 bg-white p-4 text-sm leading-relaxed text-ink-600">{intro}</p>

      <div className="space-y-5">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-1.5 font-display text-base font-bold text-ink-900">{s.heading}</h2>
            <p className="text-sm leading-relaxed text-ink-600">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="rounded-xl2 border border-brand-100 bg-brand-50/60 p-4 text-sm text-brand-800">
        <strong>{t("contactUs")}:</strong> legal@akazihub.rw · +250 794 626 004
      </div>
    </div>
  );
}
