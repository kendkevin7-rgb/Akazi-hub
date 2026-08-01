"use client";

import Link from "next/link";
import { ChevronLeft, MessageCircle, HelpCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const FAQS = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

export default function HelpPage() {
  const { t } = useLanguage();
  const support = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || "250794626004";

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/profile" aria-label={t("backToProfile")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 p-1.5 text-brand-600">
            <HelpCircle size={18} />
          </span>
          <h1 className="font-display text-lg font-extrabold text-ink-900">{t("helpTitle")}</h1>
        </div>
      </div>

      <p className="rounded-xl2 border border-ink-100 bg-white p-4 text-sm leading-relaxed text-ink-600">
        {t("helpIntro")}
      </p>

      <div className="space-y-3">
        {FAQS.map((q) => (
          <section key={q} className="rounded-xl2 border border-ink-100 bg-white p-4">
            <h2 className="mb-1 font-display text-base font-bold text-ink-900">{t(q)}</h2>
            <p className="text-sm leading-relaxed text-ink-600">{t(`${q}a`)}</p>
          </section>
        ))}
      </div>

      <a
        href={`https://wa.me/${support}`}
        target="_blank"
        rel="noopener noreferrer"
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl2 bg-[#25D366] text-sm font-bold text-white active:scale-[0.99]"
      >
        <MessageCircle size={18} />
        {t("whatsappSupport")}
      </a>
    </div>
  );
}
