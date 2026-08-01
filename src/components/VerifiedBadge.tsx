"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function VerifiedBadge({ verified }: { verified: boolean }) {
  const { t } = useLanguage();

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">
        <ShieldCheck size={13} strokeWidth={2.5} />
        {t("nidVerified")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-bold text-ink-400">
      <ShieldAlert size={13} strokeWidth={2.5} />
      {t("notVerified")}
    </span>
  );
}
